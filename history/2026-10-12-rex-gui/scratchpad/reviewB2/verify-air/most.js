const { P, ctx, obj, K } = require('./common');
const o = obj('baseball');
const r = P.throwObject(ctx(1e14, { airAbsorb: 0.5 }), o, 30);
const fa = P.fastAir(o, r.Eobj, 30, 0.5);
console.log('v/c', (r.v / K.c).toFixed(4), 'gm1', fa.gm1.toExponential(2), 'x', fa.x.toFixed(1), 'k x', (0.5 * fa.x).toFixed(1), 'keep', fa.keep.toExponential(3), 'classical 1/(1+kx)^2', (1 / (1 + 0.5 * fa.x) ** 2).toExponential(3), 'Eair/E', (fa.Eair / r.Eobj).toFixed(6));
// the same object at gm1 -> 0 limit (classical): Eair/E
const fac = P.fastAir(o, 1e-6 * o.m * K.c * K.c, 30, 0.5);
console.log('classical limit (gm1 1e-6) Eair/E', (fac.Eair / fac.E / 1).toFixed(6), (fac.Eair / (1e-6 * o.m * K.c * K.c)).toFixed(6));
