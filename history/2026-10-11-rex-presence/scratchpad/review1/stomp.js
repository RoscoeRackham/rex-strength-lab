global.window = {};
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
const g = P.K.g;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const c = { F: 90718 * g, mode: 'comic', body: rex, surface: D.surfaces.find((s) => s.id === 'concrete'), groundHolds: false, anchor: 'friction' };
const p = P.RESTRAINT.planNow('stomp', c, {});
const gl = p.goal(); const r = p.run(gl.use);
const src = P.RESTRAINT.MOVES.stomp.shake(r, p.opt);
console.log('stomp goal use (kgf)', (gl.use / g).toFixed(0), 'PPV at 5 m mm/s', (P.ppvAt(src, 5) * 1000).toFixed(3), 'TH.feel', P.VIB.TH.feel * 1000);
// the effort needed for 1 mm/s (Caltrans barely perceptible, transient) at 5 m
const s2 = P.RESTRAINT.search((u) => { const rr = p.run(u); return P.ppvAt(P.RESTRAINT.MOVES.stomp.shake(rr, p.opt), 5) >= 1e-3; }, p.lo, p.hi, false);
while (s2.use === undefined) s2.step();
console.log('effort for 1.0 mm/s at 5 m (kgf)', (s2.use / g).toFixed(0));
