const L = require('./lib.js');
(async () => {
  const browser = await L.launch();
  const out = {};
  for (const scheme of ['light', 'dark']) for (const w of [1280, 390]) {
    const pg = await L.newPage(browser, { viewport: { width: w, height: 900 }, reducedMotion: 'reduce', colorScheme: scheme });
    await L.load(pg, { action: 'walk', duoOpen: true, duoAction: 'collide', colMode: 'push' });
    const st = await pg.evaluate(() => [document.querySelector('header.hero img'), document.querySelector('#duo-bay .art-figure img')].map((i) => { const c = getComputedStyle(i); return [c.filter, c.mixBlendMode, c.opacity, i.naturalWidth, i.naturalHeight, i.src.slice(0, 30)]; }));
    const shots = [];
    for (const sel of ['header.hero img', '#duo-bay .art-figure img']) { const e = await pg.$(sel); await e.scrollIntoViewIfNeeded(); shots.push((await e.screenshot()).toString('base64')); }
    out[scheme + w] = { st, shots };
    await pg.close();
  }
  console.log(process.env.REPO ? 'BASE' : 'PR5', JSON.stringify(Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.st]))));
  require('fs').writeFileSync(L.SD + '/out/art-' + (process.env.REPO ? 'base' : 'pr5') + '.json', JSON.stringify(Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.shots]))));
  await browser.close();
})();
