const P = require('/home/user/dino-strength-sim/src/engine.js');
const K = P.K, g = K.g;
const body = P.makeBody({});
const surf = { qult: 30e6, mu: 0.7, shear: 5e6, rho: 2400 };
const ctx = (L, mode, extra) => Object.assign({ F: L * g, mode, body, surface: surf, groundHolds: true, anchor: 'friction' }, extra || {});
// find strength where punch reaches 0.01c in comic mode
for (const L of [1e9, 1e12, 1e13, 1e14, 1e15, 1e18]) {
  const p = P.punch(ctx(L, 'comic'));
  console.log('L kg', L.toExponential(0), 'vFist/c', (p.vFist / K.c).toExponential(3), 'fusion text shown?', p.vFist >= 0.01 * K.c);
}
const ball = { m: 0.145, area: Math.PI * 0.0369 ** 2, Cd: 0.35, crush: 5e6, rho: 700 };
for (const L of [1e12, 1e14]) {
  const t = P.throwObject(ctx(L, 'comic'), ball, 0);
  console.log('throw ball L', L.toExponential(0), 'v/c', (t.v / K.c).toExponential(3), 'relativistic flag', t.flight.relativistic);
}
// Nuclear physics at beta = 0.01
const amu = 931.494; // MeV
const alpha = 1 / 137.036;
const beta = 0.01;
console.log('\nKE per nucleon at 0.01c (keV):', (0.5 * amu * beta * beta * 1e3).toFixed(1), '(relativistic:', ((1/Math.sqrt(1-beta*beta)-1)*amu*1e3).toFixed(1), ')');
function pair(name, Z1, A1, Z2, A2) {
  const mu = A1 * A2 / (A1 + A2);
  const Ecm = 0.5 * mu * amu * beta * beta; // MeV
  const R = 1.2 * (Math.cbrt(A1) + Math.cbrt(A2));
  const VB = 1.44 * Z1 * Z2 / R; // MeV
  const twoPiEta = 2 * Math.PI * Z1 * Z2 * alpha / beta;
  const log10G = -twoPiEta / Math.LN10;
  // beta at which Ecm reaches barrier
  const bBar = Math.sqrt(2 * VB / (mu * amu));
  console.log(name.padEnd(8), 'Ecm', (Ecm*1e3).toFixed(0), 'keV  barrier', VB.toFixed(1), 'MeV  Gamow 10^' + log10G.toFixed(1), ' barrier reached at beta=', bBar.toFixed(3));
}
pair('N+N', 7, 14, 7, 14);
pair('O+N', 8, 16, 7, 14);
pair('C+N', 6, 12, 7, 14);
pair('Fe+N', 26, 56, 7, 14);
pair('p+N', 1, 1, 7, 14);
pair('p+O', 1, 1, 8, 16);
// p + 14N(p,g)15O thick-target yield estimate for hydrogen in a 0.145 kg baseball (upper bound)
// S(0) ~ 1.6 keV b (LUNA), sigma = S/E exp(-2pi eta)
const S = 1.6e-3 * 1e-24; // MeV cm^2
const mu = 14 / 15;
let Y = 0; // per proton, integrate sigma * n dx = sigma / (stopping per atom) dE
// stopping of protons in air near 10-50 keV ~ 0.9-1.0e-15... use stopping cross section eps ~ 6e-15 eV cm^2/atom (SRIM ~ 6-7 x10^-15 eV cm2 for N at 40 keV)
const eps = 6.5e-15 * 1e-6; // MeV cm^2 per atom
for (let Elab = 0.0466; Elab > 1e-4; Elab -= 1e-5) {
  const Ecm = Elab * 14 / 15;
  const eta2pi = 2 * Math.PI * 7 * alpha * Math.sqrt(mu * amu / (2 * Ecm));
  const sig = S / Ecm * Math.exp(-eta2pi);
  Y += sig / eps * 1e-5;
}
const nH = 0.145 * 0.06 / 1.67e-27; // ~6% H by mass, generous
console.log('\np+14N thick-target yield per proton', Y.toExponential(2), '; H atoms in ball', nH.toExponential(2), '; reactions', (Y * nH).toExponential(2), '; energy J', (Y * nH * 7.3 * 1.602e-13).toExponential(2));
const KE = 0.5 * 0.145 * (0.01 * K.c) ** 2;
console.log('ball KE at 0.01c J', KE.toExponential(2), '; fusion share', (Y * nH * 7.3 * 1.602e-13 / KE).toExponential(1));
