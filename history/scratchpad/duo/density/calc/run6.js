const X = require('./weight.js'); const { W, P, K } = X;
const H = 2, V = P.bodyVolume(H);
for (const m of [5.25e7, 5.5e7, 6e7, 8e7, 1e8, 3e8, 4.986e8, 1e9, 1e10, 1e11, 1e12]) {
  const body = P.makeBody({ H, m });
  for (const dtMax of [1, 10]) {
    const t0 = Date.now();
    const r = X.fallThrough(body, { latDeg: 0, tMax: 40 * 86400, dtMax, stopAtFirstTurn: true });
    console.log('m', m.toExponential(3), 'dtMax', dtMax, 'steps', r.steps, 'ms', Date.now() - t0, 'stuck', r.stuck ? ((r.stuck.t / 3600).toFixed(2) + ' h at r ' + (r.stuck.r / 1e3).toFixed(1) + ' km') : 'no', 'maxV', r.maxV.toFixed(0), r.firstTurn && r.firstTurn.out ? 'farTurn depth ' + r.firstTurn.out.depth.toExponential(3) + ' m at ' + (r.firstTurn.out.t / 60).toFixed(1) + ' min dLon ' + r.firstTurn.out.dLonFromAntipode.toFixed(2) : '', 'minR km', (r.minR / 1e3).toFixed(1));
  }
}
