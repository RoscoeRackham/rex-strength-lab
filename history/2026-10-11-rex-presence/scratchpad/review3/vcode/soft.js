global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
for (const [F, sid] of [[90718.474 * g, 'concrete'], [1e5 * g, 'concrete'], [1e5*g,'sand']]) {
  const c = { F, mode: 'comic', body: rex, surface: surf(sid), groundHolds: false, anchor: 'friction', softLanding: true };
  const p = P.RESTRAINT.planNow('jump', c, { near: 5, target: 3, softLanding: true });
  const gl = p.goal();
  for (const use of [gl.use, undefined]) {
    const r = p.run(use);
    console.log(sid, (F / g).toPrecision(3), 'use', use == null ? 'allout' : (use / g).toPrecision(5), 'landing.E', r.landing.E.toFixed(0), 'absorbed', r.landing.absorbed.toFixed(0), 'ratio', r.landing.ratio.toFixed(2));
  }
}
