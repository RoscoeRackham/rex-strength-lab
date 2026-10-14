const { P, D, g, surf, obj, rex, ollie, ctx } = require('./base.js');
const thr = (pred) => { let lo = 1, hi = 1e34; if (!pred(hi)) return Infinity; for (let i = 0; i < 120; i++) { const m = Math.sqrt(lo * hi); if (pred(m)) hi = m; else lo = m; } return hi; };
for (const anchor of ['friction', 'bolted']) {
  const car = thr((kg) => P.throwObject(ctx(kg, { anchor }), obj('car'), 45).v >= 3 * P.K.a0);
  const fist = thr((kg) => P.punch(ctx(kg, { anchor })).vFist >= P.K.a0);
  console.log(anchor, 'car Mach 3 at', car.toPrecision(4), 'kg; fist boom at', fist.toPrecision(4), 'kg');
}
