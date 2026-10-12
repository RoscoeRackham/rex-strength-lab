// Walk chart: does any threshold line (dashed, full width) or a curve pass through a threshold label's glyph box?
const { launch, open, OUT } = require('./lib');
(async () => {
  const b = await launch();
  for (const w of [360, 390, 768, 1280]) {
    const { ctx, page } = await open(b, w, 900, 'light', { storage: JSON.stringify({ group: 'solo', action: 'walk' }), wait: 1200 });
    const r = await page.evaluate(() => {
      const svg = document.querySelector('#bay .viz svg');
      const KEYS = ['shimmer', 'feel', 'rings', 'rattle', 'plasterWalk', 'footing'];
      const lines = [...svg.querySelectorAll('line[stroke-dasharray]')].map((l, i) => ({ i, y: l.getBoundingClientRect().top, x1: l.getBoundingClientRect().left, x2: l.getBoundingClientRect().right }));
      const TH = window.DinoPhys.VIB.TH;
      const labels = [...svg.querySelectorAll('text.halo')].filter((t) => t.textContent !== 'listener').map((t) => { const rr = t.getBoundingClientRect(); return { t: t.textContent, top: rr.top, bottom: rr.bottom, left: rr.left, right: rr.right }; });
      const out = [];
      for (const L of labels) for (const ln of lines) {
        // glyph body roughly: the middle 70% of the text box
        const gTop = L.top + 0.2 * (L.bottom - L.top), gBot = L.bottom - 0.15 * (L.bottom - L.top);
        if (ln.y > gTop && ln.y < gBot && ln.x2 > L.left && ln.x1 < L.right) out.push(L.t + ' struck by line #' + ln.i + ' at y=' + ln.y.toFixed(1) + ' (label ' + L.top.toFixed(1) + '-' + L.bottom.toFixed(1) + ')');
      }
      return out;
    });
    console.log(w, JSON.stringify(r));
    await ctx.close();
  }
  await b.close();
})();
