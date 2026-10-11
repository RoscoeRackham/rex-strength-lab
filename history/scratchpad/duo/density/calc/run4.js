const X = require('./weight.js'); const { W, P, K } = X;
const H = 2, V = P.bodyVolume(H);
for (const dtMax of [1, 0.25, 0.1]) {
  const body = P.makeBody({ H, m: 4.12e17 * V });
  const a = X.fallThrough(body, { latDeg: 0, tMax: 3 * 3600, stopAtFirstTurn: true, dtMax, noDrag: true });
  const b = X.fallThrough(body, { latDeg: 0, tMax: 3 * 3600, stopAtFirstTurn: true, dtMax });
  console.log('dtMax', dtMax, 'noDrag depth', a.firstTurn.out.depth.toFixed(3), 'drag depth', b.firstTurn.out.depth.toFixed(3), 't', (b.firstTurn.out.t/60).toFixed(3));
}
// WD debug
const body = P.makeBody({ H, m: 2.77e9 * V });
const r = X.fallThrough(body, { latDeg: 0, tMax: 20 * 3600, dtMax: 1 });
console.log('WD 20h: final r km', (r.final/1e3).toFixed(2), 'stuck', r.stuck);
const s = X.settle(body); console.log('WD settle rStop km', (s.rStop/1e3).toFixed(1));
console.log('g at 213.8 km', X.premG(213.8e3), ' m g', body.m*X.premG(213.8e3), 'sigma A', W.SIGMA_ROCK*body.topArea);
