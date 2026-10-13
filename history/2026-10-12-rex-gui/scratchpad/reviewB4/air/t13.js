const {P, obj} = require('./load.js');
const o = obj('car');
for (const s of [0.99, 0.9999, 0.999999]) for (const v0 of [8000, 9000]) {
  const t0 = Date.now();
  const a = P.fly({ v0, thetaDeg: 0, h0: 2.7, m: o.m, A: o.area, Cd: o.Cd, CdSup: o.CdSup, dragK: 1 - s });
  console.log(s, v0, JSON.stringify({ landed: a.landed, orbit: a.orbit, timedOut: a.timedOut, range: Math.round(a.range), apex: Math.round(a.apex), time: Math.round(a.time), steps: a.steps, airE: a.air && a.air.E.toExponential(2) }), (Date.now() - t0) + ' ms');
}
