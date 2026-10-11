global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const human = D.tiers.find(t => t.id === 'human');
console.log('surfaces', D.surfaces.map(s=>s.id).join(','));
for (const mode of ['real', 'comic']) for (const H of [0.4, 1, 2, 4, 50]) {
  const body = P.makeBody({ H, m: 180 * Math.pow(H / 2, 3) });
  const c = { F: Math.pow(10, Math.log10(human.liftKg)) * 9.80665, mode, body, surface: D.surfaces[0], groundHolds: false, anchor: 'friction' };
  const rows = D.calibration.map(k => { const r = P.throwObject(c, D.objects.find(o => o.id === k.obj), k.angle); return k.label + ' ' + (k.metric === 'range' ? (r.flight ? r.flight.range.toFixed(2) + ' m' : 'flight=null ' + JSON.stringify(Object.keys(r))) : r.v.toFixed(2) + ' m/s'); });
  console.log(mode, H, rows.join(' | '));
}
