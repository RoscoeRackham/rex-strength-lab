const { P, g, ctx, obj } = require('./common.js');
const { refHill } = require('./ref.js');
const H = 50, m = 180 * 25 ** 3;
const at = (kg) => ctx(kg, 'real', { H, m });
const engTh = P.threshold((F) => P.punch(at(F / g)).vFist >= P.K.a0, 10, 1e34) / g;
// reference: same punch setup through the stiff-stable integrator
function refPunch(kg) {
  const c = at(kg), b = c.body;
  const anc = P.anchorCapacity({ body: b, surface: c.surface, theta: 0, anchor: 'friction', groundHolds: false });
  return refHill({ F: c.F * 0.3, d: b.strokes.punch, mA: b.m - b.handEff, mB: b.handEff, RA: anc.R, RB: 0, vmax: 17 * b.s, N: 4000 }).vB;
}
let lo = 1e6, hi = 1e20;
for (let i = 0; i < 60; i++) { const mid = Math.sqrt(lo * hi); if (refPunch(mid) >= P.K.a0) hi = mid; else lo = mid; }
console.log('Kaiju (50 m), real mode, ladder "Fist breaks the sound barrier": engine threshold', engTh.toExponential(3), 'kg; reference', hi.toExponential(3), 'kg; ratio', (engTh / hi).toFixed(0));
for (const kg of [hi * 1.01, 1e11, 1e13, 1e15]) console.log('  kg', kg.toExponential(2), 'engine fist', P.punch(at(kg)).vFist.toFixed(1), 'ref', refPunch(kg).toFixed(1));
