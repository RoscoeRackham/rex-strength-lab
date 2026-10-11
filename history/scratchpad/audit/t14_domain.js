const P = require('/home/user/dino-strength-sim/src/engine.js');
const K = P.K, g = K.g;
const D = (function(){ const window = {}; eval(require('fs').readFileSync('/home/user/dino-strength-sim/src/data.js','utf8')); return window.DINO_DATA; })();
const body = P.makeBody({});
const ctx = (kg) => ({ F: kg * g, mode: 'comic', body, surface: D.surfaces.find(s => s.id === 'concrete'), groundHolds: false, anchor: 'friction' });
const lk = (pred) => Math.log10(P.threshold((F) => pred(F / g), 1e2, 1e45) / g);
const antipode = Math.PI * K.R_E;
console.log('Earth antipodal distance km', (antipode / 1e3).toFixed(0));
for (const [n, fn] of [['stomp', (kg) => P.stomp(ctx(kg)).E], ['punch', (kg) => P.punch(ctx(kg)).E], ['clap', (kg) => P.clap(ctx(kg)).E]]) {
  console.log(`${n}: windows radius > 100 km at logKg ${lk((kg) => P.blastRadius(fn(kg), 6900) > 1e5).toFixed(2)}; > antipode at logKg ${lk((kg) => P.blastRadius(fn(kg), 6900) > antipode).toFixed(2)}; E > Earth binding energy 2.24e32 J at logKg ${lk((kg) => fn(kg) > 2.24e32).toFixed(2)}`);
}
const s = P.stomp(ctx(1e34));
console.log('stomp logKg 34: E', s.E.toExponential(3), 'J =', (s.E / 2.24e32).toFixed(1), 'x Earth binding; quake M', s.quake.toFixed(2), '; windows radius', (P.blastRadius(s.E, 6900) / 1e3).toExponential(3), 'km (Moon distance 384,400 km)');
console.log('seismicMagnitude(Infinity) =', P.seismicMagnitude(Infinity), '-> UI sig(Infinity,2) =', (function sig(x, n) { const d = Math.floor(Math.log10(Math.abs(x))); const p = Math.pow(10, n - 1 - d); return String(Math.round(x * p) / p); })(Infinity, 2));
// Gutenberg-Richter / Collins consistency
for (const E of [4.184e9, 4.184e15, 4.2e23]) console.log(`E=${E.toExponential(3)}: engine M ${P.seismicMagnitude(E).toFixed(3)} | Collins eq. M=0.67 log10E-5.87: ${(0.67 * Math.log10(E) - 5.87).toFixed(3)} | via log10(Es[erg]) = 1.5M + 11.8: ${((Math.log10(E * 1e-4 * 1e7) - 11.8) / 1.5).toFixed(3)}`);
// Fusion claim at 0.01c: Gamow exponent for N+N and Fe+N
const alpha = 1 / 137.036, beta = 0.01;
for (const [n, Z1, Z2, A1, A2] of [['N+N', 7, 7, 14, 14], ['Fe+N', 26, 7, 56, 14], ['H+N', 1, 7, 1, 14]]) {
  const mu = A1 * A2 / (A1 + A2), Ecm = 0.5 * mu * 931.494 * beta * beta; // MeV
  const Ec = 1.44 * Z1 * Z2 / (1.2 * (Math.cbrt(A1) + Math.cbrt(A2)));
  const eta = Z1 * Z2 * alpha / beta;
  console.log(`${n} at 0.01c: E_cm ${(Ecm * 1e3).toFixed(0)} keV vs Coulomb barrier ${Ec.toFixed(1)} MeV; Gamow factor exp(-2*pi*eta) = 10^${(-2 * Math.PI * eta / Math.LN10).toFixed(0)}`);
}
