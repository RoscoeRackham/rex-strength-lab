// Mutual gravity of two touching 2 m bodies (V = 0.18 m^3 each): box and cylinder shapes vs equal-volume balls.
const V = 0.18;
const rEq = Math.cbrt(3 * V / (4 * Math.PI)), Fball = 1 / (2 * rEq) ** 2; // G = m = 1
function gl(n) { const x = [], w = []; for (let i = 1; i <= n; i++) { let z = Math.cos(Math.PI * (i - 0.25) / (n + 0.5)), pp; for (let it = 0; it < 100; it++) { let p1 = 1, p2 = 0; for (let j = 1; j <= n; j++) { const p3 = p2; p2 = p1; p1 = ((2 * j - 1) * z * p2 - (j - 1) * p3) / j; } pp = n * (z * p1 - p2) / (z * z - 1); const z1 = z; z = z1 - p1 / pp; if (Math.abs(z - z1) < 1e-15) break; } x.push(z); w.push(2 / ((1 - z * z) * pp * pp)); } return { x, w }; }
// x-component of the pull at P from a uniform prism of unit density, via the corner formula; verified below by brute force
function gxPrism(P, b) {
  let s = 0;
  for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) for (let k = 0; k < 2; k++) {
    const x = b[i] - P[0], y = b[2 + j] - P[1], z = b[4 + k] - P[2];
    const r = Math.hypot(x, y, z);
    const t = y * Math.log(z + r) + z * Math.log(y + r) - x * Math.atan((y * z) / (x * r));
    s += ((i + j + k) % 2 ? -1 : 1) * t;
  }
  return s;
}
function gxBrute(P, b, n) { const q = gl(n); let s = 0; const mp = (u, a, c) => 0.5 * (c - a) * u + 0.5 * (a + c); for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let k = 0; k < n; k++) { const x = mp(q.x[i], b[0], b[1]) - P[0], y = mp(q.x[j], b[2], b[3]) - P[1], z = mp(q.x[k], b[4], b[5]) - P[2]; const r = Math.hypot(x, y, z); s += q.w[i] * q.w[j] * q.w[k] * x / (r * r * r); } return s * (b[1] - b[0]) * (b[3] - b[2]) * (b[5] - b[4]) / 8; }
const box = [-0.2, 0, -0.2, 0.25, 0, 2];
for (const P of [[0.3, 0.1, 1.2], [1.5, -0.3, 0.4], [0.05, 0.0, 1.0]]) console.log('check P', P, 'closed', gxPrism(P, box).toFixed(6), 'brute', gxBrute(P, box, 40).toFixed(6));
function forcePrisms(dep, wid, hgt, gap, n) {
  const rho = 1 / V, A = [-dep, 0, -wid / 2, wid / 2, 0, hgt], q = gl(n);
  const mp = (u, a, c) => 0.5 * (c - a) * u + 0.5 * (a + c); let F = 0;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let k = 0; k < n; k++) {
    const P = [mp(q.x[i], gap, gap + dep), mp(q.x[j], -wid / 2, wid / 2), mp(q.x[k], 0, hgt)];
    F += q.w[i] * q.w[j] * q.w[k] * gxPrism(P, A);
  }
  return Math.abs(F * rho * rho * dep * wid * hgt / 8);
}
const far = forcePrisms(Math.cbrt(V), Math.cbrt(V), Math.cbrt(V), 20, 8); console.log('sanity far cubes F/Fpoint', (far / (1 / (20 + Math.cbrt(V)) ** 2)).toFixed(5));
for (const [label, dep, wid] of [['chest to chest, 0.20 deep x 0.45 wide x 2 m', 0.20, 0.45], ['chest to chest, 0.25 x 0.36 x 2 m', 0.25, 0.36], ['square column 0.30 x 0.30 x 2 m', 0.30, 0.30]]) {
  for (const n of [16, 32]) console.log(label, 'n', n, 'F/Fball', (forcePrisms(dep, wid, 2.0, 0, n) / Fball).toFixed(3));
}
const L = 2, rc = Math.sqrt(V / (Math.PI * L)), d = 2 * rc;
console.log('touching cylinders (line-mass approx) F/Fball', ((1 / (L * L)) * 2 * (Math.sqrt(L * L + d * d) - d) / d / Fball).toFixed(3));
