const P = require('/home/user/dino-strength-sim/src/engine.js');
const K = P.K;
// Published K&G (1985) free-air chemical-explosion fit, written independently:
const kg = (Z) => 808 * (1 + (Z / 4.5) ** 2) / Math.sqrt((1 + (Z / 0.048) ** 2) * (1 + (Z / 0.32) ** 2) * (1 + (Z / 1.35) ** 2));
const brode = (Z) => 0.975 / Z + 1.455 / Z ** 2 + 5.85 / Z ** 3 - 0.019; // bar, valid 0.1-10 bar
const henrych = (Z) => Z < 0.3 ? 14.072 / Z + 5.540 / Z ** 2 - 0.357 / Z ** 3 + 0.00625 / Z ** 4 : Z < 1 ? 6.194 / Z - 0.326 / Z ** 2 + 2.132 / Z ** 3 : 0.662 / Z + 4.05 / Z ** 2 + 3.288 / Z ** 3; // bar
console.log('Z     engine dp/p0   indep K&G     dp kPa   Brode kPa  Henrych kPa');
for (const Z of [0.5, 1, 2, 3, 5, 10, 13.44, 20, 50]) {
  console.log(Z.toString().padEnd(6), P.kgRatio(Z).toPrecision(6).padEnd(14), kg(Z).toPrecision(6).padEnd(13), (P.kgRatio(Z) * K.p0 / 1e3).toFixed(2).padEnd(9), (brode(Z) * 100).toFixed(2).padEnd(10), (henrych(Z) * 100).toFixed(2));
}
// monotonic decreasing?
let prev = Infinity, mono = true, worst = null;
for (let lz = -4; lz <= 6; lz += 1e-4) { const r = P.kgRatio(10 ** lz); if (r >= prev) { mono = false; worst = lz; break; } prev = r; }
console.log('kgRatio strictly decreasing on Z in [1e-4,1e6]:', mono, worst);
console.log('kgRatio(1e-4)*p0 =', (P.kgRatio(1e-4) * K.p0).toExponential(3), 'Pa; kgRatio(1e6)*p0 =', (P.kgRatio(1e6) * K.p0).toExponential(3), 'Pa');
// blastRadius solver: round-trip
for (const [E, dp] of [[4.184e6, 6900], [4.184e12, 6900], [4.184e12, 240e3], [1, 34e3], [4.2e23, 6900], [1e-3, 6900]]) {
  const R = P.blastRadius(E, dp);
  console.log(`E=${E.toExponential(3)} J dp=${dp} Pa -> R=${R.toPrecision(8)} m; overpressureAt(R)=${R > 0 ? P.overpressureAt(E, R).toPrecision(8) : 'n/a'}`);
}
console.log('blastRadius(Inf)', P.blastRadius(Infinity, 6900), 'blastRadius(0)', P.blastRadius(0, 6900), 'blastRadius(NaN)', P.blastRadius(NaN, 6900));
// Taylor/large-yield sanity: 1 Mt TNT (4.184e15 J) 5 psi radius vs Glasstone-type rule (cube-root scaling from 1 kt)
console.log('1 kt 34 kPa radius', P.blastRadius(4.184e12, 34e3).toFixed(0), 'm; 1 Mt 34 kPa', P.blastRadius(4.184e15, 34e3).toFixed(0), 'm (ratio', (P.blastRadius(4.184e15, 34e3) / P.blastRadius(4.184e12, 34e3)).toFixed(3), ')');
