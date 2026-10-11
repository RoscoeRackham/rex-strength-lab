const P = require('/home/user/dino-strength-sim/src/engine.js');
const c = P.K.c;
function check(o) {
  const r = P.pushApart(Object.assign({ mode: 'comic' }, o));
  const RA = o.RA == null ? 0 : o.RA, RB = o.RB == null ? 0 : o.RB;
  const fA = isFinite(RA) ? Math.max(0, o.F - RA) : 0, fB = isFinite(RB) ? Math.max(0, o.F - RB) : 0;
  const W = fA * r.xA + fB * r.xB;
  const strokeErr = (r.xA + r.xB - o.d) / o.d;
  // momentum: pA = fA t, pB = fB t, net external impulse
  const eErr = (r.EA + r.EB - W) / W;
  // exact relativistic energy from x: E = f x
  const eAx = fA * r.xA, eBx = fB * r.xB;
  const vAchk = r.pA / Math.sqrt(o.mA * o.mA + (r.pA / c) ** 2);
  console.log(JSON.stringify({ F: o.F, mA: o.mA, mB: o.mB, RA, RB, t: r.t, xA: r.xA, xB: r.xB, strokeErr, eErr,
    EA_vs_fAxA: eAx ? (r.EA - eAx) / eAx : 0, EB_vs_fBxB: eBx ? (r.EB - eBx) / eBx : 0, vA_c: r.vA / c, vB_c: r.vB / c, vAerr: r.vA ? (r.vA - vAchk) / r.vA : 0 }));
}
const cases = [
  { F: 1e4, d: 1, mA: 100, mB: 10 },
  { F: 1e4, d: 1, mA: 100, mB: 10, RA: 5e3, RB: 1e3 },
  { F: 1e4, d: 1, mA: 100, mB: 10, RA: Infinity },
  { F: 1e17, d: 0.7, mA: 176, mB: 3.96, RA: 1e5 },     // mildly relativistic
  { F: 1e25, d: 0.7, mA: 176, mB: 3.96, RA: 1e5 },
  { F: 1e40, d: 0.7, mA: 176, mB: 3.96, RA: 1e5 },
  { F: 1e40, d: 1.6, mA: 172, mB: 7.342e22 + 8 },       // Moon
  { F: 1e40, d: 1.6, mA: 172, mB: 5.97e24 },            // Earth
  { F: 1e3, d: 1.6, mA: 172, mB: 5.97e24 },             // tiny F, Earth
  { F: 1e-6, d: 0.5, mA: 180, mB: 4 },                  // tiny F
  { F: 1000 + 1e-9, d: 0.5, mA: 180, mB: 4, RA: Infinity, RB: 1000 }, // barely above R
  { F: 1e20 * (1 + 1e-12), d: 0.5, mA: 180, mB: 4, RA: Infinity, RB: 1e20 },
];
for (const o of cases) check(o);
// F = Infinity vs 1e40 limit consistency
const a = P.pushApart({ F: Infinity, d: 0.7, mA: 176, mB: 3.96, RA: 1e5, RB: 0, mode: 'comic' });
const b = P.pushApart({ F: 1e40, d: 0.7, mA: 176, mB: 3.96, RA: 1e5, RB: 0, mode: 'comic' });
console.log('F=Inf xA', a.xA, 'xB', a.xB, '| F=1e40 xA', b.xA, 'xB', b.xB);
