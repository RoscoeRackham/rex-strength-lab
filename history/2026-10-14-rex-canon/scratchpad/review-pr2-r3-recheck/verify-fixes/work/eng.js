const REPO = process.argv[2] || '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r3-recheck/verify-fixes/repo/rex-strength-lab';
global.window = {};
const P = require(REPO + '/src/engine.js'); require(REPO + '/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const body = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex));
const surface = D.surfaces.find((s) => s.id === 'concrete');
const mk = (anchor, extra) => Object.assign({ F: 90718.474 * g, mode: 'comic', body, surface, anchor, airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }, extra || {});
console.log('body.m', body.m, 'LEG', P.MUSCLE.jump.forceFrac);
const sp = P.sprint(mk('bolted'));
// sprint 10 m with drag: integrate a = thrust/m - k v^2/m
const k = 0.5 * P.K.rho0 * body.Cd * body.frontArea;
let x = 0, v = 0, t = 0, dt = 1e-6, t100 = null;
while (x < 10) { const a = (sp.thrust - k * v * v) / body.m; v += a * dt; x += v * dt; t += dt; if (t100 === null && v >= 27.78) t100 = t; }
console.log('sprint bolted: thrust', (sp.thrust / 1e3).toFixed(1), 'kN; accel', sp.accel.toFixed(1), '; t10m (with drag)', t.toFixed(4), 's, v', v.toFixed(1), 'm/s; drag at end', (k * v * v / 1e3).toFixed(1), 'kN; t100', sp.t100.toFixed(4), 'limit', sp.limit, 'topLimit', sp.topLimit, 'vTop', sp.vTop.toFixed(1));
for (const id of ['car', 'baseball', 'person', 'bus']) {
  const o = D.objects.find((q) => q.id === id);
  const r = P.pull(mk('bolted'), o);
  const legsN = r.walkPush.J / r.walkPush.T;
  console.log('pull bolted all-out', id, 'm', o.m, ': t10m', r.t10m.toFixed(4), 's; accel', r.accel.toFixed(1), 'm/s2; footLimited', r.footLimited, '; legs push', (legsN / 1e3).toFixed(1), 'kN =', (legsN / r.usable).toFixed(3), 'x usable; rope', (r.ropeT / 1e3).toFixed(1), 'kN; t to 27.78 m/s', (27.78 / r.accel).toFixed(4));
}
const spf = P.sprint(mk('friction'));
console.log('sprint friction: thrust', (spf.thrust/1e3).toFixed(2), 'kN accel', spf.accel.toFixed(2));
const pf = P.pull(mk('friction'), D.objects.find((q) => q.id === 'car'));
console.log('pull friction car: accel', pf.accel.toFixed(2), 't10m', pf.t10m.toFixed(3), 'footLimited', pf.footLimited);
