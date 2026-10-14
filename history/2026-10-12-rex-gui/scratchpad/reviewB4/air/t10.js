const {P, obj} = require('./load.js');
const o = obj('car');
for (const [v0, th] of [[7920, 0], [7930, 0], [7950, 1], [7800, 5], [8000, 2], [7910, 0.5]]) {
  const t0 = Date.now();
  const a = P.fly({ v0, thetaDeg: th, h0: 2.7, m: o.m, A: o.area, Cd: o.Cd, CdSup: o.CdSup, dragK: 0 });
  const t1 = Date.now();
  const b = P.fly({ v0, thetaDeg: th, h0: 2.7, m: o.m, A: o.area, Cd: 0 });
  console.log(v0, th, '100%:', JSON.stringify({ landed: a.landed, orbit: a.orbit, escaped: a.escaped, timedOut: a.timedOut, range: Math.round(a.range), apex: Math.round(a.apex), time: Math.round(a.time), steps: a.steps }), (t1 - t0) + ' ms', '| vacuum:', JSON.stringify({ landed: b.landed, orbit: b.orbit, range: Math.round(b.range), apex: Math.round(b.apex) }));
}
