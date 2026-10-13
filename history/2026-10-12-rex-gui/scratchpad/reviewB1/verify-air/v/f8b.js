const { P, obj, rex, ctx, K } = require('./env.js');
const car = obj('car');
for (const share of [0, 0.5]) {
  const c = ctx(1e8, rex(), { airAbsorb: share });
  const r = P.throwObject(c, car, 5);
  const fl = P.flyTo({ v0: r.v, thetaDeg: 5, h0: c.body.releaseHeight, hStop: 0, m: car.m, A: car.area, Cd: car.Cd, CdSup: car.CdSup, dragK: 1 - share, Dend: 1e9 });
  console.log(`share=${share} v=${r.v.toFixed(0)} Eobj=${r.Eobj.toExponential(3)} dragLoss=${r.dragLoss && r.dragLoss.toExponential(3)} (1-share)*dragLoss=${r.dragLoss && ((1-share)*r.dragLoss).toExponential(3)} | flyTo dragE=${fl.dragE.toExponential(3)} near-thrower tally dragNear0=${fl.dragNear0.toExponential(3)} range=${fl.range.toFixed(0)}`);
}
