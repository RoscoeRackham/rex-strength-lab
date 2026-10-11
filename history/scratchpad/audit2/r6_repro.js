global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = 9.80665;
function ctx(o) {
  const body = P.makeBody({ H: o.H || 2, m: o.m || 180 });
  const surface = D.surfaces.find(s => s.id === (o.surface || 'concrete'));
  return { F: Math.pow(10, o.logKg) * g, mode: o.mode || 'comic', body, surface, groundHolds: !!o.groundHolds, anchor: o.anchor || 'friction' };
}
const obj = id => D.objects.find(x => x.id === id);
function row(o, id, ang) {
  const r = P.throwObject(ctx(o), obj(id), ang);
  return { logKg: o.logKg, t: (10**o.logKg/1000).toPrecision(3)+' t', v: r.v && r.v.toFixed(3), range: r.flight && r.flight.range && r.flight.range.toFixed(3), recoil: r.recoilV && r.recoilV.toFixed(2), R: r.anchor.R.toExponential(3), F: r.F.toExponential(3), canMove: r.canMove };
}
console.log('objects', D.objects.map(o => o.id + ':' + o.m).join(' '));
console.log('--- comic concrete car 45');
for (const L of [3.8, 3.9, 4.0, 4.05, 4.1, 4.15, 4.2, 4.3, 4.5, 4.7, 4.9, 5.0, 5.5]) console.log(row({ logKg: L }, 'car', 45));
console.log('--- comic tank 45');
for (const L of [5.0, 5.2, 5.38, 5.5, 5.8, 6.0, 6.5, 7]) console.log(row({ logKg: L }, 'tank', 45));
