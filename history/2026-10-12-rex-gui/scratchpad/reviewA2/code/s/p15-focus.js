const { wrap, launch, settle, S } = require('./h.js');
const path = require('path');
(async () => {
  const b = await launch(); const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto(wrap(path.join(S, 'lab/dist/index.html'), 'new'));
  await p.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'catch', action: 'throw' })));
  await p.reload(); await p.waitForTimeout(800); await settle(p, 'duo-bay');
  await p.click('#duo-bay details.effort-adjust > summary');
  await p.fill('#duo-near', '20'); await p.press('#duo-near', 'Enter'); await p.waitForTimeout(1200); await settle(p, 'duo-bay');
  console.log(JSON.stringify(await p.evaluate(() => ({ focus: document.activeElement.id, inDuo: !!document.activeElement.closest('#duo-bay'), rexNear: (document.getElementById('near') || {}).value, duoNear: document.getElementById('duo-near').value, duoAdj: document.querySelector('#duo-bay details.effort-adjust').open, rexAdj: document.querySelector('#bay details.effort-adjust').open }))));
  await b.close();
})();
