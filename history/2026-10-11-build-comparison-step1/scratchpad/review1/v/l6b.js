const { open, launch, DIR } = require('./h.js');
(async () => {
  const b = await launch();
  for (const fonts of [true, false]) for (const w of [375, 390]) {
    const p = await open(b, { width: w, height: 844, skel: 'host', fonts });
    const r = await p.evaluate(() => {
      const fam = Array.from(document.fonts).filter(f => f.status === 'loaded').map(f => f.family + f.weight);
      const c = document.querySelector('.fig[data-id="thing"]'), pl = c.querySelector('.plate'), ch = Array.from(pl.querySelectorAll('.chip'));
      return { loaded: fam.slice(0, 8), cellW: c.getBoundingClientRect().width, plateW: pl.getBoundingClientRect().width, plateSW: pl.scrollWidth, cols: getComputedStyle(pl).gridTemplateColumns, chips: ch.map(x => [x.textContent, x.getBoundingClientRect().width.toFixed(1), x.scrollWidth, getComputedStyle(x).fontFamily.slice(0, 20)]) };
    });
    console.log('fonts', fonts, w, JSON.stringify(r));
    await p._ctx.close();
  }
  await b.close();
})();
