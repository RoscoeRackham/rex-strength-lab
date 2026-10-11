const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = P.K.g, c = P.K.c;
const body = P.makeBody({});
const surf = { qult: 10e6, mu: 0.8, shear: 2e6, rho: 2400 };
const mk = (F) => ({ F, mode: 'comic', body, surface: surf, groundHolds: false, anchor: 'friction' });
const Dc = 3200; // Earth simple-complex transition (Collins eq. 27)
function collins(L, v, rhoI, rhoT) { return 1.161 * Math.pow(rhoI / rhoT, 1/3) * Math.pow(L, 0.78) * Math.pow(v, 0.44) * Math.pow(g, -0.22); }
function finalD(Dtc) { return 1.25 * Dtc <= Dc ? 1.25 * Dtc : 1.17 * Math.pow(Dtc, 1.13) / Math.pow(Dc, 0.13); }
const Ebind = 3 * P.K.GM * (P.K.GM / 6.674e-11) / (5 * P.K.R_E);
console.log('Earth grav binding energy (uniform sphere) J', Ebind.toExponential(3));
console.log('logKg | E J | gamma | engine D | (p,E)-equiv impactor D(simple 1.25x) | same, eq27 final | 20km/s stony energy-equiv eq27');
for (const lk of [8, 12, 15, 16, 18, 20, 22, 23, 25, 30, 34]) {
  const r = P.stomp(mk(Math.pow(10, lk) * g));
  const p = r.push.pB, E = r.E, m = body.legEff;
  const gam = 1 + E / (m * c * c);
  const vEff = 2 * E / p, mEff = p * p / (2 * E);
  const Leff = Math.cbrt(6 * mEff / (Math.PI * 1000));
  const Dtc = collins(Leff, vEff, 1000, 2400);
  // energy-equivalent stony at 20 km/s
  const mS = 2 * E / 4e8, LS = Math.cbrt(6 * mS / (Math.PI * 3000));
  const DtcS = collins(LS, 2e4, 3000, 2400);
  console.log(lk, E.toExponential(2), gam.toExponential(3), r.crater.toFixed(0), (1.25 * Dtc).toExponential(3), finalD(Dtc).toExponential(3), finalD(DtcS).toExponential(3), 'vEff/c', (vEff / c).toFixed(4), 'E/Ebind', (E / Ebind).toExponential(2));
}
