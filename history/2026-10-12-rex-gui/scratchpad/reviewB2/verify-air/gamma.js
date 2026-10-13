const { P, body, ctx, obj, K } = require('./common');
const o = obj('baseball');
const kg = Math.pow(10, 23.2587);
const c = ctx(kg);
const r = P.throwObject(c, o, 0);
const gamma = 1 + r.Eobj / (o.m * K.c * K.c);
const h = P.handAir(body, o, r.v, gamma);
const TNTt = 4.184e9;
console.log('v/c', r.v / K.c, 'gamma', gamma.toExponential(3), 'Eobj', r.Eobj.toExponential(3));
console.log('handAir (code, gamma m v^2):', h.E.toExponential(3), 'J =', (h.E / TNTt).toExponential(2), 't TNT; mAir', h.mAir.toFixed(4));
const E2 = gamma * gamma * h.mAir * Math.min(r.v, K.c) ** 2;
console.log('gamma^2 m v^2:', E2.toExponential(3), 'J =', (E2 / TNTt).toExponential(2), 't TNT; ratio', (E2 / h.E).toExponential(2));
console.log('push EA+EB', r.push && (r.push.EA + r.push.EB).toExponential(3), 'push F', r.push && r.push.F, 'drive keys', Object.keys(r.push || {}).join(','));
// drag on hand at release: gamma^2 rho A c^2
console.log('hand ram force at release', (gamma * gamma * K.rho0 * h.area * K.c * K.c).toExponential(2), 'N');
console.log('blastParts', JSON.stringify(P.RESTRAINT.MOVES.throw.blastParts(r, { obj: o, angle: 0, body, airAbsorb: 1 })));
// invariant check of energy: (gamma^2-1) m c^2
console.log('(g^2-1) m c^2', ((gamma * gamma - 1) * h.mAir * K.c * K.c).toExponential(3));
