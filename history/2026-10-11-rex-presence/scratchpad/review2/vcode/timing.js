const repo = process.argv[2];
global.window = {};
const P = require(repo + '/rex-strength-lab/src/engine.js');
require(repo + '/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
for (const [o, sid, mode] of [['pickup','sand','real'], ['car','concrete','comic'], ['liberty','ice','real']]) {
  if (!obj(o)) { console.log('no obj', o); continue; }
  const c = { F: Infinity, mode, body: rex, surface: surf(sid), groundHolds: false, anchor: 'friction', gentleHold:false, safePassenger:false, silentStrike:false, softLanding:false, coolFlight:false };
  const p = P.RESTRAINT.plan('throw', c, { obj: obj(o), angle: 45, target: 30, near: 5 });
  let maxStep = 0; const t0 = Date.now();
  while (true) { const t1 = performance.now(); const d = p.step(); maxStep = Math.max(maxStep, performance.now() - t1); if (d) break; }
  console.log(o, sid, mode, 'total ms', Date.now() - t0, 'runs', p.runs(), 'longest probe ms', maxStep.toFixed(0));
}
