global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const P0 = require('/home/user/dino-strength-sim/src/engine.js');
const Pb = require('./engine_r6b.js');
const Pc = require('./engine_r6c.js');
const g = 9.80665;
const obj = id => D.objects.find(x => x.id === id);
const body = P0.makeBody({ H: 2, m: 180 });
const surf = D.surfaces.find(s => s.id === 'concrete');
const rows = [['comic', 4.1, 'car'], ['comic', 4.2, 'car'], ['comic', Math.log10(90718.474), 'car'], ['comic', 5.38, 'tank'], ['comic', 5.8, 'tank'],
  ['real', 3.84, 'car'], ['real', Math.log10(90718.474), 'car'], ['real', 6, 'car'], ['real', 5.8, 'tank'], ['real', 9, 'tank']];
for (const [mode, L, id] of rows) {
  const c = { F: 10 ** L * g, mode, body, surface: surf, groundHolds: false, anchor: 'friction' };
  const f = (P) => { const r = P.throwObject(c, obj(id), 45); return r.v.toFixed(3) + ' m/s ' + r.flight.range.toFixed(2) + ' m rec ' + r.recoilV.toFixed(2) + (r.heldBack ? ' held' : ''); };
  console.log(mode, L.toFixed(3), id, '| orig', f(P0), '| grid', f(Pb), '| cap', f(Pc));
}
