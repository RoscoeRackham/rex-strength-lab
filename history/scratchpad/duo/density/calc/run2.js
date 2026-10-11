const X = require('./weight.js'); const { W, P, K } = X;
const H = 2, V = P.bodyVolume(H);
const fmt = (x) => x.toExponential(4);
for (const [id, rho, tMax] of [['WD', 2.77e9, 6 * 3600], ['m1e8', 1e8 / V, 12 * 3600], ['NS', 4.12e17, 3 * 3600]]) {
  for (const lat of [0, 45]) {
    const body = P.makeBody({ H, m: rho * V });
    const t0 = Date.now();
    const r = X.fallThrough(body, { latDeg: lat, tMax, stopAtFirstTurn: id === 'NS', dtMax: 1 });
    console.log(id, 'lat', lat, 'm', fmt(body.m), 'steps', r.steps, 'ms', Date.now() - t0, 'tEnd', (r.t / 60).toFixed(2), 'min; minR km', (r.minR / 1e3).toFixed(1), 'at min', (r.minRt / 60).toFixed(2), 'maxV', r.maxV.toFixed(0), 'stuck', r.stuck ? ('t ' + (r.stuck.t / 60).toFixed(1) + ' min r ' + (r.stuck.r / 1e3).toFixed(1) + ' km') : 'no', 'final r km', (r.final / 1e3).toFixed(1));
    if (r.firstTurn && r.firstTurn.out) console.log('   first far-side turn: t', (r.firstTurn.out.t / 60).toFixed(3), 'min, depth below surface m', r.firstTurn.out.depth.toFixed(2), 'dLon from antipode deg', r.firstTurn.out.dLonFromAntipode.toFixed(3), 'lat', r.firstTurn.out.latDeg.toFixed(3));
  }
}
