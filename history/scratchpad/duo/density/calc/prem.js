// PREM density (Dziewonski & Anderson 1981, Table 1; polynomial in x = r/6371 km), g/cm3 -> kg/m3
const RE = 6371e3, G = 6.67430e-11;
const LAYERS = [ // [rTop_km, coeffs a0..a3, solid?]
  [1221.5, [13.0885, 0, -8.8381, 0], 'inner core', true],
  [3480.0, [12.5815, -1.2638, -3.6426, -5.5281], 'outer core', false],
  [5701.0, [7.9565, -6.4761, 5.5283, -3.0807], 'lower mantle', true],
  [5771.0, [5.3197, -1.4836, 0, 0], 'transition zone', true],
  [5971.0, [11.2494, -8.0298, 0, 0], 'transition zone', true],
  [6151.0, [7.1089, -3.8045, 0, 0], 'upper mantle', true],
  [6346.6, [2.6910, 0.6924, 0, 0], 'upper mantle (LVZ+lid)', true],
  [6356.0, [2.900, 0, 0, 0], 'lower crust', true],
  [6368.0, [2.600, 0, 0, 0], 'upper crust', true],
  [6371.0, [1.020, 0, 0, 0], 'ocean', false],
];
function rho(r) { // r in m
  const km = r / 1000, x = r / RE;
  for (const [top, a] of LAYERS) if (km <= top) return 1000 * (a[0] + a[1] * x + a[2] * x * x + a[3] * x * x * x);
  return 0;
}
// integrate on fine grid
const N = 637100; const dr = RE / N;
const M = new Float64Array(N + 1), gr = new Float64Array(N + 1);
for (let i = 1; i <= N; i++) { const r0 = (i - 1) * dr, r1 = i * dr, rm = 0.5 * (r0 + r1); M[i] = M[i - 1] + 4 * Math.PI * rm * rm * rho(rm) * dr; gr[i] = G * M[i] / (r1 * r1); }
const P = new Float64Array(N + 1); // pressure from surface down
for (let i = N - 1; i >= 0; i--) { const rm = (i + 0.5) * dr; P[i] = P[i + 1] + rho(rm) * 0.5 * (gr[i] + gr[i + 1]) * dr; }
const Phi = new Float64Array(N + 1); // potential relative to surface: Phi(R) = -GM/R
Phi[N] = -G * M[N] / RE; for (let i = N - 1; i >= 0; i--) Phi[i] = Phi[i + 1] - 0.5 * (gr[i] + gr[i + 1]) * dr;
const at = (km) => Math.round(km * 1000 / dr);
console.log('Mass', M[N].toExponential(5), 'GM', (G * M[N]).toExponential(6), 'mean density', (M[N] / (4 / 3 * Math.PI * RE ** 3)).toFixed(1));
for (const km of [0, 1221.5, 3480, 5701, 6371]) console.log('r', km, 'g', gr[at(km)].toFixed(4), 'P GPa', (P[at(km)] / 1e9).toFixed(3), 'Phi', Phi[at(km)].toExponential(5));
const maxg = gr.reduce((a, b, i) => b > a[0] ? [b, i] : a, [0, 0]); console.log('max g', maxg[0].toFixed(4), 'at r km', (maxg[1] * dr / 1000).toFixed(1));
const dPhi = Phi[N] - Phi[0]; console.log('Phi(R)-Phi(0) J/kg', dPhi.toExponential(5), ' vmax at centre m/s', Math.sqrt(2 * dPhi).toFixed(1), ' uniform-Earth value', Math.sqrt(G * M[N] / RE).toFixed(1));
// tunnel time from surface to centre: t = int dr / v, v = sqrt(2(Phi(R)-Phi(r)))
let t = 0; for (let i = 0; i < N; i++) { const v = Math.sqrt(2 * (Phi[N] - 0.5 * (Phi[i] + Phi[i + 1]))); t += dr / v; }
console.log('surface->centre', (t / 60).toFixed(3), 'min; full diameter', (2 * t / 60).toFixed(3), 'min =', Math.floor(2 * t / 60), 'min', ((2 * t) % 60).toFixed(1), 's; period', (4 * t / 60).toFixed(2), 'min');
const tu = Math.PI * Math.sqrt(RE ** 3 / (G * M[N])); console.log('uniform diameter', (tu / 60).toFixed(3), 'min');
module.exports = { rho, LAYERS };
// export tables at 1 km for later use
const fs = require('fs'); const rows = []; for (let km = 0; km <= 6371; km += 1) { const i = at(km); rows.push([km, rho(Math.min(km * 1000, RE - 1)), gr[i], P[i], Phi[i]]); }
fs.writeFileSync(__dirname + '/prem_table.json', JSON.stringify(rows));
