// Mutual gravity of two touching 2 m bodies (V = 0.18 m^3 each) for different shapes, relative to equal-volume balls.
const G = 1, m = 1, V = 0.18, rho = m / V;
const rEq = Math.cbrt(3 * V / (4 * Math.PI)), Fball = G * m * m / (2 * rEq) ** 2;
// closed-form x-field of a uniform rectangular prism [x1,x2]x[y1,y2]x[z1,z2] at the origin-shifted point (Nagy et al. 2000)
function gxPrism(px, py, pz, b) {
  let s = 0;
  for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) for (let k = 0; k < 2; k++) {
    const x = b[i] - px, y = b[2 + j] - py, z = b[4 + k] - pz;
    const r = Math.sqrt(x * x + y * y + z * z);
    const sign = ((i + j + k) % 2 === 0) ? -1 : 1;
    const t = y * Math.log(z + r) + z * Math.log(y + r) - x * Math.atan2(y * z, x * r);
    s += sign * t;
  }
  return G * rho * s; // field toward +x points of mass (sign checked below)
}
// Gauss-Legendre nodes
function gl(n) { const x = [], w = []; for (let i = 1; i <= n; i++) { let z = Math.cos(Math.PI * (i - 0.25) / (n + 0.5)), pp; for (let it = 0; it < 100; it++) { let p1 = 1, p2 = 0; for (let j = 1; j <= n; j++) { const p3 = p2; p2 = p1; p1 = ((2 * j - 1) * z * p2 - (j - 1) * p3) / j; } pp = n * (z * p1 - p2) / (z * z - 1); const z1 = z; z = z1 - p1 / pp; if (Math.abs(z - z1) < 1e-15) break; } x.push(z); w.push(2 / ((1 - z * z) * pp * pp)); } return { x, w }; }
function forcePrisms(dep, wid, hgt, gap) {
  // A occupies x in [-dep, 0], B in [gap, gap+dep]; both y in [-wid/2, wid/2], z in [0, hgt]
  const A = [-dep, 0, -wid / 2, wid / 2, 0, hgt];
  const n = 24, q = gl(n); let F = 0;
  const map = (u, a, b) => 0.5 * (b - a) * u + 0.5 * (a + b);
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let k = 0; k < n; k++) {
    const x = map(q.x[i], gap, gap + dep), y = map(q.x[j], -wid / 2, wid / 2), z = map(q.x[k], 0, hgt);
    const wgt = q.w[i] * q.w[j] * q.w[k] * (dep / 2) * (wid / 2) * (hgt / 2);
    F += wgt * rho * gxPrism(x, y, z, A);
  }
  return F;
}
// sanity: two small cubes far apart ~ point masses
const cube = Math.cbrt(V); const Ffar = forcePrisms(cube, cube, cube, 10);
console.log('sanity far cubes F/F_point', Math.abs(Ffar) / (G * m * m / (10 + cube) ** 2));
for (const [label, dep, wid] of [['chest to chest, 0.20 deep x 0.45 wide', 0.20, 0.45], ['chest to chest, 0.25 x 0.36', 0.25, 0.36], ['square column 0.3 x 0.3', 0.3, 0.3]]) {
  const F = Math.abs(forcePrisms(dep, wid, 2.0, 0)); console.log(label, 'centre gap', dep, 'F/Fball', (F / Fball).toFixed(3));
}
// two parallel touching cylinders as line segments
const L = 2, rc = Math.sqrt(V / (Math.PI * L)), d = 2 * rc;
const Fline = G * m * m / (L * L) * 2 * (Math.sqrt(L * L + d * d) - d) / d;
console.log('cylinders r', rc.toFixed(4), 'centre gap', d.toFixed(4), 'F/Fball', (Fline / Fball).toFixed(3));
console.log('ball centre gap', (2 * rEq).toFixed(4));
