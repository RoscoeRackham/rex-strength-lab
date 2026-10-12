const { P, D, g, surf, obj, rex, ollie, ctxOf } = require('./common.js');
for (const sid of ['concrete', 'granite', 'sand']) for (const anchor of ['friction', 'braced']) {
  const row = [];
  let prev = null, plateau = false, rose = false;
  for (let lg = 3.5; lg <= 14; lg += 0.5) {
    const cA = ctxOf(Math.pow(10, lg) * g, { surface: surf(sid), anchor }), cB = Object.assign({}, cA, { body: ollie });
    const t = P.throwPartner(cA, cB, 45);
    const v = t.r ? t.r.v : 0;
    if (prev != null && v > 0 && Math.abs(v - prev) <= 1e-6 * prev) plateau = true; else if (plateau && v > prev * 1.000001) rose = true;
    row.push(lg + ':' + (t.r ? v.toPrecision(4) : '-')); prev = v;
  }
  console.log(sid, anchor, 'plateau', plateau, 'then rises', rose, row.join(' '));
}
