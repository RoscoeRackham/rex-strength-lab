const { launch, open, R } = require('./lib');
const SIZES = [[360, 740], [390, 844], [768, 1024], [1024, 768], [1280, 900]];
function probe() {
  const out = { overlaps: [], outside: [], vlCovered: [], nmVl: [] };
  const trk = document.querySelector('#fpAxis .trk'), tr = trk.getBoundingClientRect();
  const labs = Array.from(document.querySelectorAll('#fpAxis .lbls span, #fpAxis .tp b')).map((s) => ({ t: s.textContent, r: s.getBoundingClientRect() }));
  for (let i = 0; i < labs.length; i++) {
    const a = labs[i];
    if (a.r.left < tr.left - 0.5 || a.r.right > tr.right + 0.5) out.outside.push(a.t + ' ' + Math.round(a.r.left - tr.left) + '..' + Math.round(a.r.right - tr.right));
    for (let j = i + 1; j < labs.length; j++) { const b = labs[j]; const ov = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left), ovy = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top); if (ov > 0 && ovy > 0) out.overlaps.push(a.t + ' x ' + b.t + ' ' + ov.toFixed(1) + 'px'); }
  }
  // value cells: does any background rule (fp-bg i with border-left) pass through the value text?
  const lines = Array.from(document.querySelectorAll('#fp .fp-bg i')).filter((i) => getComputedStyle(i).borderLeftWidth !== '0px').map((i) => i.getBoundingClientRect().left);
  document.querySelectorAll('#fp .fp-row').forEach((row) => {
    const vl = row.querySelector('.vl'), nm = row.querySelector('.nm');
    if (!vl) return;
    const r = vl.getBoundingClientRect();
    const cs = getComputedStyle(vl);
    // a rule crosses the text box and the cell has no opaque background
    const crosses = lines.filter((x) => x > r.left && x < r.right);
    if (crosses.length && (cs.backgroundColor === 'rgba(0, 0, 0, 0)' || cs.backgroundColor === 'transparent')) out.vlCovered.push(nm.textContent.slice(0, 25));
    // name and value text overlap
    const range = document.createRange(); range.selectNodeContents(nm); const nr = range.getBoundingClientRect();
    const range2 = document.createRange(); range2.selectNodeContents(vl); const vr = range2.getBoundingClientRect();
    const ox = Math.min(nr.right, vr.right) - Math.max(nr.left, vr.left), oy = Math.min(nr.bottom, vr.bottom) - Math.max(nr.top, vr.top);
    if (ox > 0.5 && oy > 0.5) out.nmVl.push(nm.textContent.slice(0, 30));
  });
  // row tracks: does the .off text overflow the track or collide with marks?
  out.offOver = Array.from(document.querySelectorAll('#fp .off')).map((o) => { const r = o.getBoundingClientRect(), t = o.parentElement.getBoundingClientRect(); return r.left < t.left - 0.5 ? o.textContent + ' ' + Math.round(t.left - r.left) : null; }).filter(Boolean);
  out.sw = document.documentElement.scrollWidth; out.iw = window.innerWidth;
  return out;
}
(async () => {
  const b = await launch();
  for (const [w, h] of SIZES) for (const sch of ['light', 'dark']) {
    const { ctx, p } = await open(b, w, h, sch);
    for (const z of ['zAll', 'zHum']) {
      await p.click('#' + z);
      const r = await p.evaluate(probe);
      console.log(w, sch, z, JSON.stringify(r));
      if (sch === 'light' || w < 500) {
        await p.evaluate(() => document.getElementById('to-scale').scrollIntoView());
        await p.screenshot({ path: R + `/forest-${w}-${sch}-${z}.png` });
      }
    }
    await ctx.close();
  }
  await b.close();
})();
