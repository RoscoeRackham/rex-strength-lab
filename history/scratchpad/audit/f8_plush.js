const { P, g, S, O, ctx } = require('./common');
for (const anchor of ['friction', 'braced']) {
  const c = ctx(511, { surface: 'sand', anchor, H: 0.4, m: 180 * 0.2 ** 3 });
  const r = P.pull(c, O.car);
  console.log('plush', anchor, 'pull car: resist', r.resist.toFixed(0), 'N, anchor R', r.anchor.R.toFixed(1), 'N, canMove', r.canMove, 'limit', r.anchor.limit);
}
// fraction of default-size braced resistance from 'shear' term on each surface
const b = P.makeBody({});
for (const s of Object.values(S)) console.log(s.id, 'dig', (s.shear*b.digArea).toFixed(0), 'friction', (s.mu*b.m*g).toFixed(0));
