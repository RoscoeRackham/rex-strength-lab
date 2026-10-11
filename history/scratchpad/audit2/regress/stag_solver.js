// Equilibrium-air stagnation temperature (N2,O2,N,O,N+,O+,e-; RRHO partition functions), vs engine's ideal-gas T0(1+0.2M^2).
const P = require('/home/user/dino-strength-sim/src/engine.js');
const K = P.K;
const kB = 1.380649e-23, h = 6.62607015e-34, eV = 1.602176634e-19, amu = 1.66053907e-27, me = 9.1093837e-31;
const sp = {
  N2: { m: 28.0134 * amu, thv: 3393, thr: 2.88, sig: 2, g: 1, e0: 0 },
  O2: { m: 31.9988 * amu, thv: 2273, thr: 2.08, sig: 2, g: 3, e0: 0 },
  N: { m: 14.0067 * amu, g: 4, e0: 9.759 / 2 * eV },
  O: { m: 15.9994 * amu, g: 9, e0: 5.116 / 2 * eV },
  Np: { m: 14.0067 * amu, g: 9, e0: (9.759 / 2 + 14.534) * eV },
  Op: { m: 15.9994 * amu, g: 4, e0: (5.116 / 2 + 13.618) * eV },
  e: { m: me, g: 2, e0: 0 },
};
// ln of partition function per unit volume (translational * internal), energy measured from species' own ground state + e0 offset
function lnQ(s, T) {
  const tr = 1.5 * Math.log(2 * Math.PI * s.m * kB * T / (h * h));
  let int = Math.log(s.g);
  if (s.thv) int += Math.log(T / (s.sig * s.thr)) - Math.log(1 - Math.exp(-s.thv / T));
  return tr + int - s.e0 / (kB * T);
}
function eint(s, T) { // internal energy per particle excluding translation, plus e0
  let e = s.e0;
  if (s.thv) e += kB * T + kB * s.thv / (Math.exp(s.thv / T) - 1);
  return e;
}
// Solve composition at T, p with element totals N:O = 0.79*2 : 0.21*2 ; charge neutrality.
function equil(T, p) {
  const L = {}; for (const k in sp) L[k] = lnQ(sp[k], T);
  // unknowns: lambda_N, lambda_O, lambda_e (log fugacities); n_i = exp(L_i + sum a_ij lambda_j)
  const nOf = (lN, lO, le) => ({
    N2: Math.exp(L.N2 + 2 * lN), O2: Math.exp(L.O2 + 2 * lO), N: Math.exp(L.N + lN), O: Math.exp(L.O + lO),
    Np: Math.exp(L.Np + lN - le), Op: Math.exp(L.Op + lO - le), e: Math.exp(L.e + le),
  });
  // Newton in 3 vars on residuals: ln(total N / total O) = ln(0.79/0.21), charge, pressure
  let x = [Math.log(p / kB / T) - L.N2 / 2 , Math.log(p / kB / T) - L.O2 / 2 - 1.3, -50];
  x[0] = (Math.log(0.79 * p / kB / T) - L.N2) / 2; x[1] = (Math.log(0.21 * p / kB / T) - L.O2) / 2;
  x[2] = Math.log(1e-10 * p / kB / T) - L.e;
  const res = (x) => { const n = nOf(...x); const NN = 2 * n.N2 + n.N + n.Np, NO = 2 * n.O2 + n.O + n.Op; const tot = Object.values(n).reduce((a, b) => a + b, 0);
    return [Math.log(NN / NO) - Math.log(0.79 / 0.21), Math.log((n.Np + n.Op) / n.e), Math.log(tot * kB * T / p)]; };
  for (let it = 0; it < 200; it++) {
    const r0 = res(x); if (Math.max(...r0.map(Math.abs)) < 1e-12) break;
    const J = [];
    for (let j = 0; j < 3; j++) { const xp = x.slice(); xp[j] += 1e-6; const rp = res(xp); J.push(rp.map((v, i) => (v - r0[i]) / 1e-6)); }
    // solve J^T dx = -r  (J[j][i] = d r_i / d x_j)
    const A = [[J[0][0], J[1][0], J[2][0]], [J[0][1], J[1][1], J[2][1]], [J[0][2], J[1][2], J[2][2]]];
    const b = r0.map((v) => -v);
    const det = (M) => M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);
    const d = det(A); const dx = [];
    for (let c = 0; c < 3; c++) { const M = A.map((row, i) => row.map((v, j) => (j === c ? b[i] : v))); dx.push(det(M) / d); }
    const lim = 2; for (let j = 0; j < 3; j++) x[j] += Math.max(-lim, Math.min(lim, dx[j]));
  }
  const n = nOf(...x);
  let rho = 0, H = 0;
  for (const k in n) { rho += n[k] * sp[k].m; H += n[k] * (2.5 * kB * T + eint(sp[k], T)); }
  return { h: H / rho, n, rho };
}
// reference: enthalpy of cold air at 288 K (frozen, N2/O2 ground state, rot+trans)
const h288 = equil(288.15, 101325).h;
function realStagT(v) {
  const h0 = h288 + 0.5 * v * v;
  const pst = K.rho0 * v * v; // ~ stagnation pressure behind normal shock at hypersonic speed (Newtonian), sea level
  let lo = 300, hi = 200000;
  for (let i = 0; i < 100; i++) { const mid = Math.sqrt(lo * hi); if (equil(mid, pst).h > h0) hi = mid; else lo = mid; }
  const T = Math.sqrt(lo * hi); const eq = equil(T, pst); const tot = Object.values(eq.n).reduce((a, b) => a + b, 0);
  return { T, pst, xe: eq.n.e / tot, xN: eq.n.N / tot, xN2: eq.n.N2 / tot };
}
module.exports = { equil, realStagT, h288 };
if (require.main === module) {
  for (const v of [1000, 1500, 2000, 3000, 4000, 5000, 7000, 10000, 11000, 15000, 20000, 30000, 50000]) {
    const r = realStagT(v);
    console.log(`v=${v}: solver ${r.T.toFixed(0)} K  engine ${P.stagnationT(v).toFixed(0)} K  ratio ${(P.stagnationT(v) / r.T).toFixed(3)}`);
  }
  // Anderson's Apollo case: 11 km/s at ~53 km altitude (rho ~ 6.0e-4 .. 7.5e-4 kg/m3)
  for (const rho of [6.0e-4, 7.5e-4]) {
    const v = 11000, h0 = h288 + 0.5 * v * v, pst = rho * v * v;
    let lo = 300, hi = 200000;
    for (let i = 0; i < 100; i++) { const mid = Math.sqrt(lo * hi); if (equil(mid, pst).h > h0) hi = mid; else lo = mid; }
    console.log('Anderson-like 11 km/s, rho', rho, 'p_stag', (pst / 101325).toFixed(2), 'atm -> T', Math.sqrt(lo * hi).toFixed(0), 'K');
  }
}
