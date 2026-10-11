const X = require('./weight.js'); const { W, P, K } = X;
const H = 2, V = P.bodyVolume(H);
for (const lat of [0, 45]) for (const dtMax of [1, 0.25]) {
  const body = P.makeBody({ H, m: 4.12e17 * V });
  const r = X.fallThrough(body, { latDeg: lat, tMax: 3 * 3600, stopAtFirstTurn: true, dtMax, noDrag: true });
  const r2 = X.fallThrough(body, { latDeg: lat, tMax: 3 * 3600, stopAtFirstTurn: true, dtMax });
  console.log('lat', lat, 'dtMax', dtMax, 'noDrag depth m', r.firstTurn.out.depth.toFixed(3), 't', (r.firstTurn.out.t/60).toFixed(3), 'dLon', r.firstTurn.out.dLonFromAntipode.toFixed(3), '| drag depth', r2.firstTurn.out.depth.toFixed(3), 'dLon', r2.firstTurn.out.dLonFromAntipode.toFixed(3), 'minR', (r2.minR/1e3).toFixed(1));
}
