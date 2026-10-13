const { withPage } = require('./page.js');
(async () => {
  await withPage(async (page, load) => {
    await load(null);
    const r = await page.evaluate(() => {
      const ps = [...document.querySelectorAll('svg path')].filter((p) => (p.getAttribute('d') || '').startsWith('M40.0 197.2'));
      const ds = ps.map((p) => p.getAttribute('d'));
      const pts = ds.map((d) => d.split(/[ML]/).filter(Boolean).map((s) => s.trim().split(' ').map(Number)));
      const last = pts.map((a) => a[a.length - 1]);
      let maxDy = 0; // compare y at matched x by interpolation
      const interp = (a, x) => { for (let i = 1; i < a.length; i++) if (a[i][0] >= x) { const t = (x - a[i-1][0]) / (a[i][0] - a[i-1][0]); return a[i-1][1] + t * (a[i][1] - a[i-1][1]); } return NaN; };
      for (const p of pts[1]) { const y = interp(pts[0], p[0]); if (isFinite(y)) maxDy = Math.max(maxDy, Math.abs(y - p[1])); }
      return { n: ds.length, dashes: ps.map((p) => p.getAttribute('stroke-dasharray')), last, maxDyPx: maxDy };
    });
    console.log(JSON.stringify(r));
  });
})();
