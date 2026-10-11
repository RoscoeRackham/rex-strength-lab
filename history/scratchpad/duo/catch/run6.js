const X = require('./catch2.js');
const { P, K } = X;
require('/home/user/dino-strength-sim/src/data.js');
const DD = window.DINO_DATA;
const obj = (id) => DD.objects.find((o) => o.id === id);
const surf = (id) => DD.surfaces.find((s) => s.id === id);
const g = K.g;
const mk = (o) => Object.assign({ F: 100 * 907.18474 * g, mode: 'comic', body: P.makeBody({}), surface: surf('concrete'), groundHolds: false, anchor: 'friction' }, o || {});
const f = (x, n) => (x == null ? String(x) : (typeof x === 'number' ? Number(x).toPrecision(n || 4) : String(x)));
for (const [id, D, kg] of [['pyramid', 2e7, 1e17], ['pyramid', 1e7, 1e17], ['pyramid', 1e6, 1e17], ['ruyi', 1e5, 1e9], ['shot', 3e4, 1e9], ['tank', 1e5, 1e12]]) {
  const o = { F: kg * g, anchor: 'bolted', groundHolds: true };
  const t0 = Date.now();
  const gm = X.game(mk(o), mk(o), obj(id), D, 'easy');
  const a = gm.a;
  console.log(id, D, 'dial', kg, a.result, 'th', f(a.aim && a.aim.thetaDeg), 'v', f(a.aim && a.aim.vL), 'vMax', f(a.aim && a.aim.vMax), 't', f(a.time), 'apex', a.flight && f(a.flight.apex), 'vArr', f(a.vArrive), 'ang', f(a.angleDeg),
    'F', a.catch && f(a.catch.F), 'grip', a.catch && f(a.catch.gripRatio), 'plate', a.catch && f(a.catch.plateNeeded), 'heat', a.heat && a.heat.kind, a.heat && f(a.heat.frac), a.heat && f(a.heat.noseC), 'round', f(gm.round), 'miss crater', a.miss && f(a.miss.crater), 'quake', a.miss && f(a.miss.quake, 3), 'E', a.miss && f(a.miss.E), (Date.now() - t0) + 'ms');
}
// default human-strength calibration: 511 kg
const c511 = mk({ F: 511 * g });
const r = X.leg(c511, c511, obj('baseball'), 18.44, 'hard');
console.log('511 kg pitch 18.44 m: v', f(r.aim.vL), 'arr', f(r.vArrive), 't', f(r.time), 'F', f(r.catch.F), 'decelG', f(r.catch.decelG), 'tS', f(r.catch.tStroke));
const r2 = X.leg(c511, c511, obj('baseball'), 60, 'easy');
console.log('511 kg easy 60 m: v', f(r2.aim.vL), 'th', f(r2.aim.thetaDeg), 't', f(r2.time));
// terminal velocity
const bb = obj('baseball');
console.log('vt baseball', Math.sqrt(2 * bb.m * g / (K.rho0 * bb.Cd * bb.area)));
// fireball cases
for (const id of ['baseball', 'car', 'shot', 'tank', 'pyramid']) { const o = obj(id); console.log('sweep', id, f(o.m / (K.rho0 * o.area)), 'm/A', f(o.m / o.area)); }
console.log('fireball baseball 0.02c D=100', JSON.stringify(X.fireballAt(bb, 0.02 * K.c, 100, P.makeBody({}))));
