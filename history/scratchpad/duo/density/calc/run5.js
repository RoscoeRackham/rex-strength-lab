const X = require('./weight.js'); const { W, P, K } = X;
const H = 2, V = P.bodyVolume(H);
for (const [id, rho] of [['NS', 4.12e17], ['nuc', 2.7e17], ['1e20', 1e20 / 0.18], ['1e18', 1e18 / 0.18], ['1e14', 1e14/0.18], ['1e12', 1e12/0.18], ['WD', 2.77e9]]) {
  const body = P.makeBody({ H, m: rho * V });
  const t0 = Date.now();
  const s = X.settle(body);
  console.log(id, 'm', body.m.toExponential(3), 'rStop m', s.rStop.toExponential(3), 'halfPasses', s.halfPasses.toExponential(3), 'years', s.years.toPrecision(4), 'first pass loss J', s.firstPassLossJ.toExponential(3), '-> depth m', (s.firstPassLossJ / (body.m * 9.82)).toPrecision(3), 'halfPeriod min', (s.firstHalfPeriod / 60).toFixed(2), 'energy J', s.energyJ.toExponential(3), 'ms', Date.now() - t0);
}
