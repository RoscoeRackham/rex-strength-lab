const {P, obj, ctx, rex, ALL, D} = require('./load.js');
const o = obj('car'); const c = P.K.c;
for (const ang of [15, 17, 20]) {
  let lo = 1e13, hi = 1e16;
  for (let i = 0; i < 80; i++) { const mid = Math.sqrt(lo*hi); if (P.throwObject(ctx(mid, Object.assign({}, ALL, {airAbsorb: 0})), o, ang).flight.relativistic) hi = mid; else lo = mid; }
  for (const kg of [hi*1.001, hi*1.05]) {
    const r = P.throwObject(ctx(kg, Object.assign({}, ALL, {airAbsorb: 0})), o, ang);
    const fa = P.fastAir(o, r.Eobj, ang, 1);
    console.log('angle', ang, 'logKg', Math.log10(kg).toFixed(5), 'v/c', (r.v/c).toFixed(5), 'x', fa.x.toFixed(1), 'vOut km/s', (fa.vOut/1000).toFixed(2));
  }
}
const e=D.escape; console.log('best-direction solar escape from the ground', Math.hypot(e.sun*(1-Math.SQRT1_2), e.earth));
