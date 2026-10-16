const { P, D, rex, ollie, surf, objs, ON, OFF, ctx } = require('./h.js');
const semi = objs('semi');
const c = ctx(90718.474, ON);
const r = P.throwObject(c, semi, 10);
const M = P.RESTRAINT.MOVES.throw;
const o = { obj: semi, surface: surf('concrete'), body: rex, near: 5, angle: 10, unbreakable: true, ownRecoil: true };
const L = semi.L || Math.cbrt(6 * semi.m / (Math.PI * (semi.rho || 1000)));
console.log('semi L', semi.L, 'rho', semi.rho, 'L used', L.toFixed(2), 'vImpact', r.flight.vImpact.toFixed(2), 'T', (L / r.flight.vImpact).toFixed(3));
const src = M.landShake(r, o);
console.log('landing ppv at 5 m (mm/s)', (P.ppvAt(src, 5) * 1000).toFixed(3));
for (const T of [0.05, 0.1, 0.3, 1]) console.log('T', T, 'ppv', (P.ppvAt(P.impulseSource(surf('concrete'), semi.m * r.flight.vImpact, T), 5) * 1000).toFixed(3));
// main-like push at his feet with ownRecoil off and unbreakable on
const r0 = P.throwObject(ctx(90718.474, Object.assign({}, ON, { ownRecoil: false })), semi, 10);
console.log('power off: toGround', r0.toGround && r0.toGround.J.toFixed(0), r0.toGround && r0.toGround.T.toFixed(3), 'ppv', r0.toGround ? (P.ppvAt(P.impulseSource(surf('concrete'), r0.toGround.J, r0.toGround.T), 5) * 1000).toFixed(3) : '-');
