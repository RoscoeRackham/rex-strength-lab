const { flyTo, P, K } = require('./flyto.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const obj = (id) => D.objects.find((o) => o.id === id);
const Rn = (o) => Math.sqrt(o.area / Math.PI);
// compare flyTo with fly when hStop=0
for (const id of ['baseball', 'car', 'shot']) {
  const o = obj(id);
  for (const [v, th] of [[30, 45], [200, 30], [3000, 45]]) {
    const a = P.fly({ v0: v, thetaDeg: th, h0: 1.8, m: o.m, A: o.area, Cd: o.Cd, CdSup: o.CdSup });
    const b = flyTo({ v0: v, thetaDeg: th, h0: 1.8, m: o.m, A: o.area, Cd: o.Cd, CdSup: o.CdSup, Rn: Rn(o) });
    const c = flyTo({ v0: v, thetaDeg: th, h0: 1.8, hStop: 1.8, m: o.m, A: o.area, Cd: o.Cd, CdSup: o.CdSup, Rn: Rn(o) });
    console.log(id, v, th, 'fly', a.range.toFixed(2), a.time.toFixed(3), a.vImpact.toFixed(2), '| flyTo h0', b.range.toFixed(2), b.time.toFixed(3), b.vImpact.toFixed(2), '| hStop 1.8', c.range.toFixed(2), c.time.toFixed(3), c.vImpact.toFixed(2), c.impactAngleDeg.toFixed(1), 'heat', c.heatLoad.toExponential(3), 'qMax', c.qMax.toExponential(3));
  }
}
// saturation range: farthest a baseball goes at any speed
for (const id of ['baseball', 'shot', 'car', 'tank', 'pyramid', 'ruyi']) {
  const o = obj(id);
  let best = { r: 0 };
  for (const v of [100, 300, 1000, 3000, 1e4, 3e4, 1e5, 1e6, 2.99e6]) {
    for (const th of [10, 20, 30, 40, 45, 50, 60]) {
      const f = flyTo({ v0: v, thetaDeg: th, h0: 1.8, hStop: 1.8, m: o.m, A: o.area, Cd: o.Cd, CdSup: o.CdSup });
      if (f.landed && f.range > best.r) best = { r: f.range, v, th, t: f.time, vi: f.vImpact };
      if (f.escaped || f.orbit) { best.escapes = best.escapes || [v, th]; }
    }
  }
  console.log('farthest', id, 'm/A', (o.m / o.area).toFixed(0), JSON.stringify(best));
}
