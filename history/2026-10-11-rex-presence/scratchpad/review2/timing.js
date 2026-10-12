global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const cases = (process.argv[2] || '').split(',').filter(Boolean);
function time(move, F, mode, sid, o, jobs) {
  const c = { F, mode, body: rex, surface: surf(sid), groundHolds: false, anchor: 'friction', gentleHold: false, safePassenger: false, silentStrike: false, softLanding: false, coolFlight: false };
  const p = P.RESTRAINT.plan(move, c, Object.assign({ near: 5 }, o));
  const t0 = Date.now(); let maxStep = 0, steps = 0;
  // emulate resolveEffort 'ceiling': ensure all hazard jobs (sync up to budget), then background the rest
  const names = jobs === 'ceiling' ? P.RESTRAINT.HAZARDS.map(h => 'hazard:' + h.id) : jobs === 'least' ? ['goal'] : ['preset:' + jobs];
  let tReady = null;
  for (const n of names) while (!p.result(n)) { const a = Date.now(); p.stepJob(n); const d = Date.now() - a; steps++; if (d > maxStep) maxStep = d; }
  tReady = Date.now() - t0;
  while (true) { const a = Date.now(); const done = p.step(); const d = Date.now() - a; steps++; if (d > maxStep) maxStep = d; if (done) break; }
  console.log(move, (isFinite(F) ? (F / g).toExponential(0) : 'inf'), mode, sid, o.obj ? o.obj.id : '', jobs, 'ready', tReady, 'ms; all', Date.now() - t0, 'ms; runs', p.runs(), 'maxStep', maxStep, 'ms');
}
const objs = (process.argv[3] || 'car').split(',');
for (const mode of ['real', 'comic']) for (const sid of ['concrete', 'sand', 'ice']) {
  time('jump', Infinity, mode, sid, { target: 3 }, 'ceiling');
  for (const id of objs) time('throw', Infinity, mode, sid, { obj: obj(id), angle: 45, target: 30 }, 'ceiling');
}
