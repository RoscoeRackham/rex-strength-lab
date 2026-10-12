global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const near = 5;
for (const mode of ['comic', 'real']) for (const F of [Infinity, 1e6 * g, 90718 * g]) for (const sid of ['concrete', 'sand']) for (const [mv, o] of [['throw', { obj: obj('car'), angle: 45, target: 30 }], ['throw', { obj: obj('baseball'), angle: 45, target: 30 }], ['jump', { target: 3 }], ['stomp', {}], ['punch', {target: 10.4}], ['sprint', {target: 12.42}], ['pull', {obj: obj('bus'), target: 10}]]) {
  const c = { F, mode, body: rex, surface: surf(sid), groundHolds: false, anchor: 'friction' };
  const p = P.RESTRAINT.plan(mv, c, Object.assign({ near }, o));
  let t0 = Date.now(); const gl = p.goal(); const tg = Date.now() - t0;
  t0 = Date.now(); const ce = p.ceiling(); const tc = Date.now() - t0;
  const runsC = p.runs();
  t0 = Date.now(); const pr = p.presets(); const tp = Date.now() - t0;
  // longest single step
  const p2 = P.RESTRAINT.plan(mv, c, Object.assign({ near }, o)); let maxStep = 0; let steps = 0;
  for (;;) { const a = Date.now(); const d = p2.step(); const b = Date.now() - a; if (b > maxStep) maxStep = b; steps++; if (d) break; }
  console.log(mode, (F / g).toPrecision(3), sid, mv, (o.obj ? o.obj.id : ''), 'goal', tg, 'ms; ceiling', tc, 'ms (', runsC, 'runs); presets', tp, 'ms; total runs', p.runs(), 'maxStep', maxStep, 'ms steps', steps, 'ce.by', ce.by);
}
