const { P, surf, ctx } = require('./common.js');
// near vs far terms of the engine's Lamb model at 5 m for the push sources' pulse lengths
const src0 = P.impulseSource(surf('concrete'), 1e4, 0.064);
const g = src0.ground; console.log('concrete ground', g);
for (const id of ['concrete', 'sand', 'granite', 'stiffclay']) {
  for (const T of [0.064, 0.1, 0.16]) {
    const s = P.impulseSource(surf(id), 1e4, T); if (!s) continue;
    const { rho, cs, xi } = s.ground, r = 5, F = s.F;
    const near = 0.375 * F / (rho * cs * cs * T * r), far = 0.620 * F / (rho * Math.pow(cs, 2.5) * Math.pow(T, 1.5) * Math.sqrt(r));
    console.log(id, 'T', T, 'cs', cs, 'lambda_R~', (0.92 * cs * T).toFixed(1), 'm  near/far at 5 m', (near / far).toFixed(2));
  }
}
// Collide sprint into bolted Rex: horizontal push, page claims plaster to 3.93 m (t2.js in finding)
const cA = ctx(100 * 907.18474, {}), cB = ctx(100 * 907.18474, { anchor: 'bolted' });
const r = P.collide(cA, cB, { source: 'sprint', bounce: false });
const s = P.impulseSource(surf('concrete'), r.toGround.J, r.toGround.T);
console.log('collide sprint into bolted Rex: dir', r.dir, 'J', r.toGround.J.toExponential(3), 'T', r.toGround.T.toFixed(3), 'plasterReach', P.plasterReach(s).toFixed(2), 'ppv5', (P.ppvAt(s, 5) * 1e3).toFixed(1));
// Cerruti (static, nu = 1/4): surface displacement magnitudes relative to Boussinesq vertical-under-vertical uz = P(1-nu)/(2 pi G r)
const nu = 0.25;
console.log('static near field, relative to vertical-under-vertical: horizontal-under-horizontal along push', (1 / (1 - nu)).toFixed(2), 'across push', ((1 - nu) / (1 - nu)).toFixed(2), 'vertical-under-horizontal', ((1 - 2 * nu) / (2 * (1 - nu))).toFixed(2));
