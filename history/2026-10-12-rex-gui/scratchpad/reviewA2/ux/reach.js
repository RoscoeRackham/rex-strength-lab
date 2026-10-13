const { launch, open, S } = require('./lib.js');
(async () => {
  const b = await launch();
  for (const [w, h] of [[1280, 900], [1024, 768]]) for (const a of ['arm', 'catch', 'collide']) {
    const page = await open(b, { w, h, state: { duoOpen: true, duoAction: a }, wait: 4000 });
    await page.evaluate(() => document.querySelector('#duo-bay .verdict').scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(200);
    await page.focus('#powers > summary'); await page.keyboard.press('Enter'); await page.waitForTimeout(300);
    await page.focus('#bolt-ollie'); await page.waitForTimeout(200);
    const r = await page.evaluate(() => { const v = document.querySelector('#duo-bay .verdict').getBoundingClientRect(), s = document.getElementById('bolt-ollie').getBoundingClientRect(); return { verdictTop: Math.round(v.top), boltTop: Math.round(s.top), vh: innerHeight }; });
    console.log(w + 'x' + h, a, JSON.stringify(r), r.verdictTop > 0 && r.verdictTop < r.vh && r.boltTop > 0 && r.boltTop < r.vh ? 'both on screen' : 'NOT both');
    await page.context().close();
  }
  await b.close();
})();
