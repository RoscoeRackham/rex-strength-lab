global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const K = P.K;
const g = 9.80665;
function ctx(o) {
  const body = P.makeBody({ H: o.H || 2, m: o.m || 180 });
  const surface = D.surfaces.find((s) => s.id === (o.surface || 'concrete'));
  return { F: o.inf ? Infinity : o.kg * g, mode: o.mode || 'comic', body, surface, groundHolds: !!o.groundHolds, anchor: o.anchor || 'friction' };
}
function relT(f, M, d) { // exact time to cover d from rest under constant force f
  const a = f / M;
  if (!isFinite(f)) return d / K.c;
  const x = d * f / (M * K.c * K.c);
  return (M * K.c / f) * Math.sqrt((1 + x) * (1 + x) - 1);
}
const cases = [
  { name: 'allstar car bolted', kg: D.feats ? null : null, chip: 'allstar', obj: 'car', anchor: 'bolted' },
  { name: '1e20 car bolted', kg: 1e20, obj: 'car', anchor: 'bolted' },
  { name: 'c17 1e20 bolted', kg: 1e20, obj: 'c17', anchor: 'bolted' },
  { name: 'inf car bolted', inf: true, obj: 'car', anchor: 'bolted' },
  { name: 'allstar car friction', chip: 'allstar', obj: 'car', anchor: 'friction' },
  { name: 'allstar car braced', chip: 'allstar', obj: 'car', anchor: 'braced' },
  { name: 'default 100 tons car bolted', kg: 100 * 907.18474, obj: 'car', anchor: 'bolted' },
];
const chips = Object.values(D).find((v) => Array.isArray(v) && v.some && v.some((x) => x && x.id === 'allstar' && x.liftKg));
console.log('data keys', Object.keys(D));
for (const c of cases) {
  if (c.chip) c.kg = chips.find((x) => x.id === c.chip).liftKg;
  const o = D.objects.find((x) => x.id === c.obj);
  if (!o) { console.log('no obj', c.obj, D.objects.map(x=>x.id).join(',')); continue; }
  const cx = ctx(c);
  const r = P.pull(cx, o);
  const M = o.m + cx.body.m;
  const net = r.usable - r.resist;
  const tRel = relT(net, M, 10);
  console.log(c.name, 'kg=', c.kg, 'obj.m=', o.m, 'canMove', r.canMove, 't10m=', r.t10m, 'vfinal(classical)=', r.canMove ? 20 / r.t10m : 0, 'vs c', r.canMove ? 20 / r.t10m / K.c : 0, 'tRel=', tRel, 'light time', 10 / K.c);
}
