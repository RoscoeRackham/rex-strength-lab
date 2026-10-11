global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
const { pushApartHillFixed } = require('./fix.js'); const g = P.K.g; const b = P.makeBody({});
// timing per call
for (const kg of [511, 1e6, 1e8, 1e12, 1e30]) {
  const o = { F: kg * g * 0.3, d: b.strokes.punch, mA: b.m - b.handEff, mB: b.handEff, RA: 1412, RB: 0, vmax: 17, mode: 'real' };
  let t0 = process.hrtime.bigint(); for (let i = 0; i < 50; i++) P.pushApart(o); const te = Number(process.hrtime.bigint() - t0) / 5e7;
  t0 = process.hrtime.bigint(); let f; for (let i = 0; i < 50; i++) f = pushApartHillFixed(o); const tf = Number(process.hrtime.bigint() - t0) / 5e7;
  console.log(`punch ${kg.toExponential(0)} kg: engine ${te.toFixed(2)} ms/call vB=${P.pushApart(o).vB.toFixed(3)} | fixed ${tf.toFixed(2)} ms/call vB=${f.vB.toFixed(3)} steps=${f.steps}`);
}
// calibration path unchanged: at 511 kg the fixed version takes the explicit branch and matches bit-for-bit
const o = { F: 511 * g * 0.3, d: b.strokes.punch, mA: b.m - b.handEff, mB: b.handEff, RA: Infinity, RB: 0, vmax: 17, mode: 'real' };
console.log('511 kg calibration case identical:', P.pushApart(o).vB === pushApartHillFixed(o).vB, P.pushApart(o).vB);
// The auditor's proposed switch at 1e3*inertialScale, jump on default concrete:
const RB = 10e6 * 2 * b.footArea, mA = b.m - b.feetMass, mB = b.feetMass;
const IS = mA * 900 / b.strokes.leg + mA * g + RB;
console.log('auditor switch for jump on concrete at lift kg =', (1e3 * IS / g).toExponential(3), '; closed-form body speed there =', (30 * mB / (mA + mB) * mA / b.m).toFixed(3), 'm/s vs limit', (30 * mA / b.m).toFixed(3));
