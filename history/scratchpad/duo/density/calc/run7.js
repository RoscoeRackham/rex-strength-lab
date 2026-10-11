const X = require('./weight.js'); const { W, P, K } = X;
for (const m of [1e10, 3e10, 1e11, 1e12]) {
  const body = P.makeBody({ H: 2, m });
  const t0 = Date.now();
  const r = X.fallThrough(body, { latDeg: 0, tMax: 10 * 86400, dtMax: 10 });
  console.log('m', m.toExponential(2), 'steps', r.steps, 'ms', Date.now() - t0, 'stuck', r.stuck ? ((r.stuck.t / 3600).toFixed(2) + ' h at r ' + (r.stuck.r / 1e3).toFixed(2) + ' km') : 'no (t=' + (r.t/3600).toFixed(1) + ' h, r ' + (r.final/1e3).toFixed(1) + ' km)');
  const s = X.settle(body); console.log('   settle(): rStop km', (s.rStop/1e3).toFixed(2), 'years', s.years.toPrecision(3), 'hours', (s.years*8766).toPrecision(3), 'halfPasses', s.halfPasses.toPrecision(3));
}
