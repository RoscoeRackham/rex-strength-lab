const { P, g, R3, dial } = require('./common.js');
const F = dial, d = 2.44, hold = 17651.97;
for (const [lab, vmax] of [['shove vmax 35 x s', P.MUSCLE.throwPush.vmax * R3.s], ['punch vmax 17 x s', P.MUSCLE.punch.vmax * R3.s]]) {
  const r = P.pushApart({ F, d, mA: 3000, mB: 3000, RA: Infinity, RB: hold, mode: 'real', vmax });
  console.log(lab, vmax.toFixed(1), 'm/s -> Hill exit vB', r.vB.toFixed(2), 'm/s (constant-force model: 37.65)');
}
