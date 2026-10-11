// Reproduce bayThrow's "Without air it would have gone ..." sentence logic and compare to true vacuum range.
global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = global.window.DINO_DATA;
const K = P.K, g = K.g;
const objById = (id) => D.objects.find((o) => o.id === id);
function ctx(state) {
  const body = P.makeBody({ H: state.H || 2, m: state.m || 180 });
  const surface = D.surfaces.find((s) => s.id === (state.surface || 'concrete'));
  return { F: state.inf ? Infinity : Math.pow(10, state.logKg) * g, mode: state.mode, body, surface, groundHolds: !!state.groundHolds, anchor: state.anchor || 'friction' };
}
function analyticFlat(v, th, h0) { const s = Math.sin(th), c = Math.cos(th); return v * c * (v * s + Math.sqrt(v * v * s * s + 2 * g * h0)) / g; }
function run(label, state, objId, angle) {
  const c = ctx(state); const o = objById(objId);
  const r = P.throwObject(c, o, angle);
  const f = r.flight;
  const shown = r.canMove && !f.relativistic && f.range < 0.2 * (r.v * r.v / g);
  const claim = Math.min(r.v * r.v / g, 2e7);
  const vac = P.fly({ v0: r.v, thetaDeg: angle, h0: c.body.releaseHeight, m: o.m, A: o.area, Cd: 0, tMax: 30 * 86400 });
  const th = angle * Math.PI / 180;
  console.log(label.padEnd(36), 'v=', r.v.toFixed(2), 'm/s | drag range', f.range.toFixed(2), f.escaped ? '(escaped)' : '',
    '| sentence shown?', shown, '| claimed no-air', claim.toFixed(1),
    '| true vacuum (fly Cd=0)', vac.escaped ? 'ESCAPED' : vac.timedOut ? 'TIMEDOUT/orbit range=' + vac.range.toFixed(0) : vac.range.toFixed(2),
    '| flat analytic', analyticFlat(r.v, th, c.body.releaseHeight).toFixed(2), '| air loss', (vac.range ? (1 - f.range / vac.range) * 100 : NaN).toFixed(1) + '%');
}
const L511 = Math.log10(511);
console.log('releaseHeight', P.makeBody({}).releaseHeight);
for (const mode of ['real', 'comic']) {
  for (const ang of [0, 10, 30, 45, 60, 80, 85, 90]) run(mode + ' baseball 511kg ang ' + ang, { logKg: L511, mode }, 'baseball', ang);
}
for (const mode of ['real', 'comic']) for (const ang of [0, 45, 90]) run(mode + ' shot 511kg ang ' + ang, { logKg: L511, mode }, 'shot', ang);
