const { P, g, ctx, obj } = require('./lib.js');
const c = ctx({ logKg: 34, mode: 'comic', surface: 'sand', anchor: 'bolted', H: 50, m: 180 * Math.pow(25, 3) });
const o = obj('tank');
const r = P.throwObject(c, o, 45);
console.log('v', r.v, 'v==c', r.v === P.K.c, 'v>c', r.v > P.K.c, 'gamma', P.gammaOf(r.v), 'Eobj', r.Eobj, 'push.EB', r.push.EB);
// momentumToV rounding above c
for (const rr of [1e7, 1e8, 3e8, 1e9, 1e12]) { const m = 1; const v = P.momentumToV(rr * m * P.K.c, m); console.log('p/mc', rr, 'v - c =', v - P.K.c, 'gammaOf', P.gammaOf(v), 'keFromV', P.keFromV(v, 1)); }
