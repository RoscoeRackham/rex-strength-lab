// "Show the math" open state is one variable for both bays
const { wrap, launch, settle, S } = require('./h.js');
const path = require('path');
(async () => {
  const b = await launch(); const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto(wrap(path.join(S, 'lab', 'dist', 'index.html'), 'new'));
  await p.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'catch', action: 'throw' })));
  await p.reload(); await p.waitForTimeout(800); await settle(p, 'duo-bay'); await settle(p, 'bay');
  const st = () => p.evaluate(() => ({ rexMath: document.querySelector('#bay details.math').open, duoMath: document.querySelector('#duo-bay details.math').open }));
  console.log('start', JSON.stringify(await st()));
  await p.click('#bay details.math > summary'); await p.waitForTimeout(200);
  console.log('after opening Rex’s Show the math', JSON.stringify(await st()));
  await p.click('#c-hard'); await p.waitForTimeout(500); await settle(p, 'duo-bay');
  console.log('after a two-player control (Fastball) redraws both bays', JSON.stringify(await st()));
  await p.click('#duo-bay details.math > summary'); await p.waitForTimeout(200);
  console.log('after closing the element’s Show the math', JSON.stringify(await st()));
  await p.click('#tab-jump'); await p.click('#tab-throw'); await p.waitForTimeout(500);
  console.log('after Rex tab Jump -> Throw', JSON.stringify(await st()));
  await b.close();
})();
