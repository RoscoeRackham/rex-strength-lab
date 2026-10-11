global.window = global.window || {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = global.window.DINO_DATA;
const g = P.K.g;
const S = Object.fromEntries(D.surfaces.map(s => [s.id, s]));
const O = Object.fromEntries(D.objects.map(o => [o.id, o]));
const body = P.makeBody({ H: 2, m: 180 });
const mk = (kg, over) => Object.assign({ F: kg * g, mode: 'comic', body, surface: S.concrete, groundHolds: false, anchor: 'friction' }, over || {});
for (const anchor of ['friction', 'braced', 'bolted']) {
  for (const sid of ['concrete', 'asphalt']) {
    const c = mk(511, { anchor, surface: S[sid] });
    const r = P.pull(c, O.b747);
    console.log(anchor, sid, 'F', c.F.toFixed(0), 'resist', r.resist.toFixed(0), 'anchorR', r.anchor.R.toFixed(0), 'canMove', r.canMove, 'limitedBy', r.limitedBy);
  }
}
// groundHolds
{ const r = P.pull(mk(511, { groundHolds: true }), O.b747); console.log('groundHolds', r.canMove, r.limitedBy, r.anchor.R); }
// Record: 188,830 kg, 8.8 m in 76 s
const Mrec = 188830, L = 8.8, t = 76;
const aMin = 2 * L / t / t;
console.log('record min accel', aMin.toExponential(3), 'inertial force', (Mrec * aMin).toFixed(0), 'N');
console.log('sim-model force needed for record at crr 0.005:', (0.005 * Mrec * g + Mrec * aMin).toFixed(0), 'N');
console.log('crr that 511-kg strength alone could beat (747):', (511 * g / (O.b747.m * g)).toExponential(3));
for (const Ffast of [1000, 1500, 2000, 2500]) console.log('if Fast pulled', Ffast, 'N -> crr <=', ((Ffast - Mrec * aMin) / (Mrec * g)).toExponential(2));
// Fix candidates
for (const crr of [0.001, 0.0008, 0.0007]) {
  const o = Object.assign({}, O.b747, { crr });
  const r = P.pull(mk(511), o);
  console.log('crr', crr, 'resist', r.resist.toFixed(0), 'canMove', r.canMove, 'limitedBy', r.limitedBy, 't10m', r.t10m.toFixed(1));
}
for (const deg of [0, 10, 20, 30]) { const a = P.anchorCapacity({ body, surface: S.concrete, theta: deg * Math.PI / 180, anchor: 'friction' }); console.log('theta', deg, 'R', a.R.toFixed(0), (a.R / (0.8 * 180 * g)).toFixed(2)); }
// other rolling objects at record strength
for (const id of ['car', 'bus', 'tank']) { const r = P.pull(mk(511), O[id]); console.log(id, 'resist', r.resist.toFixed(0), 'canMove', r.canMove, r.limitedBy); }
