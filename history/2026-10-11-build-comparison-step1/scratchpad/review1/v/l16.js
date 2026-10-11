const { open, launch, DIR } = require('./h.js');
(async () => {
  const b = await launch();
  for (const dark of [false]) for (const w of [1280, 390]) {
    const p = await open(b, { width: w, height: 900, skel: 'host', dark });
    const info = await p.evaluate(() => {
      const bc = window.__bc;
      const gaps = bc.SEQ.filter(s => s.kind === 'gap').map(s => ({ id: s.id, lo: s.lo, hi: s.hi, limits: s.limits.map(L => ({ id: L.id, headline: L.headline, range: L.range, score: L.score })) }));
      const tiles = Array.from(document.querySelectorAll('.gaptile')).map(t => { const rs = Array.from(t.querySelectorAll('svg rect[stroke="var(--chalk)"]')).map(r => ({ x: +(+r.getAttribute('x')).toFixed(1), w: +(+r.getAttribute('width')).toFixed(1) })); const svgW = +t.querySelector('svg').getAttribute('viewBox').split(' ')[2]; return { id: t.dataset.gap, svgW, x0: +(0.04 * svgW).toFixed(1), x1: +(0.96 * svgW).toFixed(1), bandRects: rs, verdict: t.parentElement.querySelector('.sub') && t.parentElement.querySelector('.sub').textContent.match(/The [^.]*limit lies[^.]*\./g) }; });
      return { gaps, tiles };
    });
    console.log(w, JSON.stringify(info, null, 0));
    if (w === 1280) for (const id of ['empty-2', 'empty-3']) { const el = await p.$(`.gaptile[data-gap="${id}"]`); if (el) { await el.scrollIntoViewIfNeeded(); await el.screenshot({ path: `${DIR}/l16-${id}-${w}.png` }); } }
    await p._ctx.close();
  }
  await b.close();
})();
