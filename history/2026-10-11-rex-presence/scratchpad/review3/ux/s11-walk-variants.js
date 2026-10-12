// Walk tab variants: chart text overlapping or clipped, legend, broken numbers.
const { launch, open, OUT } = require('./lib');
const EXTRA = `
window.__svgOverlap = () => { const o = []; for (const svg of document.querySelectorAll('#bay svg')) { if (svg.closest('.status')) continue; const ts = [...svg.querySelectorAll('text')].map((t) => ({ t: t.textContent, r: t.getBoundingClientRect() })).filter((x) => x.r.width); for (let i = 0; i < ts.length; i++) for (let j = i + 1; j < ts.length; j++) { const a = ts[i].r, b = ts[j].r; const ix = Math.min(a.right, b.right) - Math.max(a.left, b.left), iy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top); if (ix > 0.5 && iy > 1) o.push(ts[i].t + ' X ' + ts[j].t + ' (' + Math.round(ix) + 'x' + Math.round(iy) + ')'); } const sr = svg.getBoundingClientRect(); for (const x of ts) if (x.r.left < sr.left - 0.5 || x.r.right > sr.right + 0.5 || x.r.top < sr.top - 0.5 || x.r.bottom > sr.bottom + 0.5) o.push('CLIP ' + x.t); } return o; };
// gap between neighbouring x-axis labels
window.__xgap = () => { const svg = document.querySelector('#bay .viz svg'); if (!svg) return null; const ts = [...svg.querySelectorAll('text')].filter((t) => /^(1|10|100) ?(m|km)$|^1 km$|^10 km$/.test(t.textContent.trim())).map((t) => t.getBoundingClientRect()).sort((a, b) => a.left - b.left); let g = 1e9; for (let i = 1; i < ts.length; i++) g = Math.min(g, ts[i].left - ts[i - 1].right); return Math.round(g * 10) / 10; };
`;
(async () => {
  const b = await launch();
  const vars = [
    { walker: 'rex' }, { walker: 'both' }, { walker: 'both', stepEffort: 1, pace: 'fast' }, { walker: 'ollie', stepEffort: 0.5, walkD: 9000 },
    { walker: 'rex', walkD: 0.5 }, { walker: 'both', surface: 'sand' }, { walker: 'rex', surface: 'clay', stepEffort: 1 }, { walker: 'rex', surface: 'granite', stepEffort: 1 },
    { walker: 'rex', stepEffort: 1, walkD: 60 }, { walker: 'both', oM: 6000, stepEffort: 0.7 },
  ];
  for (const w of (process.env.W ? process.env.W.split(",").map(Number) : [360, 1280])) {
    for (const v of vars) {
      const st = Object.assign({ group: 'solo', action: 'walk' }, v);
      const { ctx, page, errs } = await open(b, w, 900, 'light', { storage: JSON.stringify(st), wait: 1200 });
      await page.addScriptTag({ content: EXTRA });
      if (v.stepEffort != null) { await page.evaluate((x) => { const s = document.querySelector('#step-effort'); s.value = x; s.dispatchEvent(new Event('input', { bubbles: true })); }, v.stepEffort); await page.waitForTimeout(300); }
      const r = await page.evaluate(() => ({ ov: __svgOverlap(), xgap: __xgap(), legend: [...document.querySelectorAll('#bay .ladder-legend span')].map((s) => s.innerText), verdict: (document.querySelector('#bay .verdict') || {}).innerText, bad: (document.querySelector('#bay').innerText.match(/NaN|undefined|Infinity/g) || []), hscroll: document.documentElement.scrollWidth - document.documentElement.clientWidth }));
      console.log(w, JSON.stringify(v), JSON.stringify(r));
      const viz = await page.$('#bay .viz');
      if (viz) await viz.screenshot({ path: OUT + 'walkviz-' + w + '-' + Object.entries(v).map(([k, x]) => k + x).join('_') + '.png' });
      if (errs.length) console.log('  errs', errs);
      await ctx.close();
    }
  }
  await b.close();
})();
