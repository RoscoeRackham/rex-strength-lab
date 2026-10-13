// Reading the Rex + Ollie result at 1280x900: does a sidebar change make it jump?
const { launch, open, S } = require('./lib.js');
(async () => {
  const b = await launch();
  const cases = [
    { action: 'throw', duoAction: 'arm' }, { action: 'throw', duoAction: 'collide' }, { action: 'jump', duoAction: 'catch' }, { action: 'weight', duoAction: 'wrestle' }, { action: 'sprint', duoAction: 'collide' },
  ];
  for (const which of ['branch']) for (const c of cases) {
    const page = await open(b, { w: 1280, h: 900, which, state: Object.assign({ duoOpen: true }, c), wait: 4000 });
    const ids = await page.evaluate(() => Array.from(document.querySelectorAll('#tier-chips .chip')).map((x) => x.dataset.id));
    for (const chip of [ids[5], ids[1], ids[3]]) {
      await page.evaluate(() => { const v = document.querySelector('#duo-bay .verdict'); window.scrollBy(0, v.getBoundingClientRect().top - 300); });
      await page.waitForTimeout(300);
      const before = await page.evaluate(() => ({ y: Math.round(document.querySelector('#duo-bay .verdict').getBoundingClientRect().top), sy: Math.round(scrollY), mainH: Math.round(document.querySelector('main').getBoundingClientRect().height) }));
      // click the chip without Playwright's scroll-into-view: dispatch a real click at its centre (sidebar is sticky, on screen)
      const vis = await page.evaluate((id) => { const r = document.querySelector('#tier-chips .chip[data-id="' + id + '"]').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2, r.top >= 0 && r.bottom <= innerHeight]; }, chip);
      if (!vis[2]) await page.evaluate((id) => document.querySelector('#tier-chips .chip[data-id="' + id + '"]').click(), chip); else await page.mouse.click(vis[0], vis[1]);
      await page.waitForTimeout(4000);
      const after = await page.evaluate(() => ({ y: Math.round(document.querySelector('#duo-bay .verdict').getBoundingClientRect().top), sy: Math.round(scrollY), mainH: Math.round(document.querySelector('main').getBoundingClientRect().height) }));
      console.log(which, JSON.stringify(c), 'chip', chip, 'clickedVisible', vis[2], 'duo verdict y', before.y, '->', after.y, '| scrollY', before.sy, '->', after.sy, '| Rex bay height', before.mainH, '->', after.mainH);
    }
    await page.context().close();
  }
  await b.close();
})();
