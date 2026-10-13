const { launch, open, S } = require('./lib.js');
(async () => {
  const b = await launch();
  for (const [w, h] of [[919, 700], [920, 700], [640, 800], [639, 800], [480, 800], [481, 800]]) for (const a of ['arm', 'wrestle', 'catch', 'collide']) {
    const page = await open(b, { w, h, state: { duoOpen: true, duoAction: a, wrestleMove: 'shove', colSrc: 'set' }, wait: 2500 });
    await page.evaluate(() => { document.getElementById('powers').open = true; document.getElementById('ollie-setup').open = true; for (const d of document.querySelectorAll('details.effort-adjust')) d.open = true; });
    await page.waitForTimeout(300);
    const r = await page.evaluate(() => ({ ov: document.documentElement.scrollWidth - document.documentElement.clientWidth, asideOv: document.querySelector('aside').scrollWidth - document.querySelector('aside').clientWidth, setupOpen: document.getElementById('setup').open, sticky: getComputedStyle(document.querySelector('aside')).position }));
    console.log(w + 'x' + h, a, JSON.stringify(r));
    await page.context().close();
  }
  await b.close();
})();
