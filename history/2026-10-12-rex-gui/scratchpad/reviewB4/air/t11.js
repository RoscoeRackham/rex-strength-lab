const {P, obj} = require('./load.js');
const o = obj('car');
for (const [v0, th] of [[8000, 0], [9000, 0], [10500, 0], [11000, 0], [7920, 0.0001], [8500, 0.001]]) {
  const t0 = Date.now();
  const a = P.fly({ v0, thetaDeg: th, h0: 2.7, m: o.m, A: o.area, Cd: o.Cd, CdSup: o.CdSup, dragK: 0 });
  const t1 = Date.now();
  const b = P.fly({ v0, thetaDeg: th, h0: 2.7, m: o.m, A: o.area, Cd: 0 });
  const r = P.fly({ v0, thetaDeg: th, h0: 2.7, m: o.m, A: o.area, Cd: o.Cd, CdSup: o.CdSup, dragK: 1e-9 });
  console.log(v0, th, '100%:', JSON.stringify({ landed: a.landed, orbit: a.orbit, escaped: a.escaped, timedOut: a.timedOut, apex: Math.round(a.apex), time: Math.round(a.time), steps: a.steps }), (t1 - t0) + ' ms', '| vacuum:', JSON.stringify({ landed: b.landed, orbit: b.orbit, escaped: b.escaped, apex: Math.round(b.apex) }));
}
