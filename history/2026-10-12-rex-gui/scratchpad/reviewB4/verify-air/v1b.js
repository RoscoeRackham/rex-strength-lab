const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const car = D.objects.find(o => o.id === 'car');
for (const th of [0, 0.01, 0.5, 1, 2, 5]) for (const v of [7950, 9000, 11000]) {
  const t0 = Date.now();
  const r = P.fly({ v0: v, m: car.m, A: car.area, Cd: car.Cd, CdSup: car.CdSup, thetaDeg: th, h0: 2.7432, dragK: 0 });
  const r0 = P.fly({ v0: v, m: car.m, A: car.area, Cd: 0, CdSup: 0, thetaDeg: th, h0: 2.7432 });
  console.log('th', th, 'v', v, 'dK0:', r.orbit ? 'orbit' : r.landed ? 'landed range km ' + (r.range/1e3).toFixed(0) : r.timedOut ? 'timedOut' : r.escaped ? 'escaped' : '?', 'steps', r.steps, 'ms', Date.now()-t0, '| Cd0:', r0.orbit ? 'orbit' : r0.landed ? 'landed range km ' + (r0.range/1e3).toFixed(0) : r0.escaped ? 'escaped':'?');
}
