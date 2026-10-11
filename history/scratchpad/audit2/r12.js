global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const human = D.tiers.find(t => t.id === 'human');
const g = 9.80665;
for (const mode of ['real', 'comic']) for (const H of [0.4, 1, 2, 4, 50]) {
  const body = P.makeBody({ H, m: 180 * Math.pow(H / 2, 3) });
  const surface = D.surfaces.find(s => s.id === (D.surfaces[0].id));
  const c = { F: human.liftKg * (P.K && P.K.g || g), mode, body, surface: D.surfaces.find(s=>s.id==='concrete')||D.surfaces[0], groundHolds: false, anchor: 'friction' };
  const rows = D.calibration.map(k => { const r = P.throwObject(c, D.objects.find(o => o.id === k.obj), k.angle); return k.label + ' ' + (k.metric === 'range' ? r.flight.range.toFixed(2) + ' m' : r.v.toFixed(2) + ' m/s'); });
  console.log(mode, H, rows.join(' | '));
}
console.log(D.surfaces.map(s=>s.id).join(','), 'liftKg', human.liftKg, 'K.g', P.K.g);
