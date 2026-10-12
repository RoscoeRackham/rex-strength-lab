global.window = {};
const P = require('/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/review2/ci/repo/rex-strength-lab/src/engine.js');
require('/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/review2/ci/repo/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const rows = [];
function time(move, F, mode, sf, o) {
  const c = { F, mode, body: rex, surface: sf, groundHolds: false, anchor: 'friction', gentleHold: false, safePassenger: false, silentStrike: false, softLanding: false, coolFlight: false };
  const p = P.RESTRAINT.plan(move, c, Object.assign({ near: 5 }, o));
  const t0 = Date.now(); let maxStep = 0;
  while (true) { const a = Date.now(); const done = p.step(); const d = Date.now() - a; if (d > maxStep) maxStep = d; if (done) break; }
  rows.push([Date.now() - t0, maxStep, move, isFinite(F) ? (F / g).toExponential(0) : 'inf', mode, sf.id, o.obj ? o.obj.id : '', o.angle, p.runs()]);
}
const throwables = D.objects.filter((x) => !x.noThrow);
const mv = process.argv[2];
for (const F of [Infinity, 1e12 * g, 1e25 * g]) for (const mode of ['real', 'comic']) for (const sf of D.surfaces) {
  if (mv === 'jump') { time('jump', F, mode, sf, { target: 3 }); time('stomp', F, mode, sf, {}); time('punch', F, mode, sf, {target: 10.4}); time('sprint', F, mode, sf, {target: 12.42}); }
  else for (const ob of throwables) time('throw', F, mode, sf, { obj: ob, angle: 45, target: 30 });
}
rows.sort((a, b) => b[0] - a[0]);
console.log('total plans', rows.length, 'sum ms', rows.reduce((s, r) => s + r[0], 0));
console.log('by total:'); rows.slice(0, 8).forEach((r) => console.log(JSON.stringify(r)));
rows.sort((a, b) => b[1] - a[1]);
console.log('by max step:'); rows.slice(0, 8).forEach((r) => console.log(JSON.stringify(r)));
