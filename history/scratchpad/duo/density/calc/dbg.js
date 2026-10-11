const X = require('./weight.js'); const { W, P, K } = X;
const H = 2, V = P.bodyVolume(H);
const body = P.makeBody({ H, m: 2.77e9 * V });
for (const T of [3, 4, 5, 6, 8, 12]) {
  const r = X.fallThrough(body, { latDeg: 0, tMax: T * 3600, dtMax: 1 });
  console.log('t', T, 'h  r km', (r.final / 1e3).toFixed(2));
}
