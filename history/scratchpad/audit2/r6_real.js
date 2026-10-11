global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = 9.80665;
console.log(D.tiers.map(t => t.id + ':' + t.liftKg + ':' + (t.chip||t.label||'')).join('\n'));
function ctx(o) {
  const body = P.makeBody({ H: o.H || 2, m: o.m || 180 });
  const surface = D.surfaces.find(s => s.id === (o.surface || 'concrete'));
  return { F: Math.pow(10, o.logKg) * g, mode: o.mode || 'comic', body, surface, groundHolds: !!o.groundHolds, anchor: o.anchor || 'friction' };
}
const obj = id => D.objects.find(x => x.id === id);
const hulk = D.tiers.find(t => /hulk/i.test(t.id));
console.log('hulk', hulk);
const out = [];
for (let L = 3.5; L <= 9; L += 0.05) {
  const r = P.throwObject(ctx({ logKg: L, mode: 'real' }), obj('car'), 45);
  out.push([L.toFixed(2), r.v.toFixed(3), r.flight ? r.flight.range.toFixed(2) : '-', r.recoilV.toFixed(2)].join(' '));
}
console.log(out.join('\n'));
const r = P.throwObject(ctx({ logKg: Math.log10(hulk.liftKg), mode: 'real' }), obj('car'), 45);
console.log('HULK real', r.v, r.flight.range, r.recoilV);
