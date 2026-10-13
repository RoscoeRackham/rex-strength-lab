const { P, D, g, surf, obj, rex, ollie, ctx } = require('./base.js');
for (const kg of [90718.474, 1e7, 1e12, 1e20, 1e30]) {
  const a = P.punch(ctx(kg)), b = P.punch(ctx(kg, { anchor: 'bolted' }));
  console.log(kg.toExponential(2), 'friction vFist', a.vFist.toPrecision(5), 'E', a.E.toExponential(3), 'recoilE share', (a.recoilE / a.E).toFixed(3), '| bolted vFist', b.vFist.toPrecision(5), 'E', b.E.toExponential(3), 'ratio E', (b.E / a.E).toFixed(3));
}
// ladder thresholds for punch: hiroshima E 6.3e13 J
const E = (id) => D.energyRefs.find((e) => e.id === id).J;
for (const anchor of ['friction', 'bolted']) {
  const kg = P.threshold ? null : null;
  let lo = 1, hi = 1e34; for (let i = 0; i < 200; i++) { const mid = Math.sqrt(lo * hi); if (P.punch(ctx(mid, { anchor })).E >= E('hiroshima')) hi = mid; else lo = mid; }
  let lo2 = 1, hi2 = 1e34; for (let i = 0; i < 200; i++) { const mid = Math.sqrt(lo2 * hi2); if (P.punch(ctx(mid, { anchor })).E >= E('earthbind')) hi2 = mid; else lo2 = mid; }
  console.log(anchor, 'punch Hiroshima at', hi.toExponential(3), 'kg; blows Earth apart at', hi2.toExponential(3));
}
