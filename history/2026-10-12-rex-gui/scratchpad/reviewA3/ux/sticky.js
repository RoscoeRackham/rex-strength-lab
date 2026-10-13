const { launch, open, S } = require('./lib.js');
(async () => {
  const b = await launch();
  const page = await open(b, { w: 1280, h: 900, state: { duoOpen: true, duoAction: 'collide' }, wait: 4000 });
  const info = await page.evaluate(() => { const rig = document.querySelector('.rig').getBoundingClientRect(); return { rigTop: Math.round(rig.top + scrollY), rigBottom: Math.round(rig.bottom + scrollY), doc: document.documentElement.scrollHeight }; });
  console.log(JSON.stringify(info));
  for (const y of [0, 600, 2000, info.rigBottom - 900, info.rigBottom - 300]) {
    await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(200);
    const r = await page.evaluate(() => { const a = document.querySelector('aside').getBoundingClientRect(); const lad = document.getElementById('ladder').getBoundingClientRect(); return { sy: Math.round(scrollY), asideTop: Math.round(a.top), asideBottom: Math.round(a.bottom), ladderTop: Math.round(lad.top) }; });
    console.log(JSON.stringify(r));
    await page.screenshot({ path: S + '/shots/sticky-' + y + '.png' });
  }
  await b.close();
})();
