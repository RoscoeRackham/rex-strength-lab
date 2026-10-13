// the round 2 scenario: a typed, uncommitted distance in the element, then a resize. Does Rex's bay get drawn while two-player mode is on?
const { launch, open, settle } = require('./lib.js');
(async () => {
  const b = await launch();
  for (const f of ['mutI.html', 'mutIE.html']) {
    const page = await open(b, f, { state: { duoOpen: true, duoAction: 'catch', action: 'throw' }, wait: 1500 });
    await settle(page, 'bay'); await settle(page, 'duo-bay');
    await page.evaluate(() => { const d = document.querySelector('#duo-bay details.effort-adjust'); if (d) d.open = true; });
    await page.focus('#duo-near'); await page.keyboard.press('Control+A'); await page.keyboard.type('50');
    await page.setViewportSize({ width: 1000, height: 900 }); await page.waitForTimeout(1200); await settle(page, 'bay');
    const r = await page.evaluate(() => ({ nested: window.__nested || 0, near: JSON.parse(localStorage.getItem('rex-lab-v1')).near, rexEffortBox: !!document.querySelector('#bay .effort-read') }));
    console.log(f === 'mutI.html' ? 'branch (deferred setIn)' : 'branch with synchronous setIn', JSON.stringify(r), page.errs.join(' | '));
    await page.close();
  }
  await b.close();
})();
