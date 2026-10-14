const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const car = D.objects.find(o => /car/i.test(o.id));
console.log(car.id, car.m, car.area, car.Cd, car.CdSup);
console.log('exports', Object.keys(P).filter(k=>/fly|throw|conic/i.test(k)));
for (const v of [7920, 8000, 9000, 10500, 11000]) {
  for (const dK of [0, 1e-6, 0.01]) {
    const t0 = Date.now();
    const r = P.fly({ v0: v, m: car.m, A: car.area, Cd: car.Cd, CdSup: car.CdSup, thetaDeg: 0, h0: 2.7, dragK: dK });
    console.log(v, 'dK', dK, 'orbit', r.orbit, 'landed', r.landed, 'timedOut', r.timedOut, 'escaped', r.escaped, 'steps', r.steps, 'time', (r.time/86400).toFixed(2)+'d', 'apex km', (r.apex/1e3).toFixed(0), 'ms', Date.now()-t0, r.ocean ? 'oceanE '+r.ocean.E.toExponential(3) : '');
  }
  const r0 = P.fly({ v0: v, m: car.m, A: car.area, Cd: 0, CdSup: 0, thetaDeg: 0, h0: 2.7 });
  console.log(v, 'Cd0 orbit', r0.orbit, 'escaped', r0.escaped, 'apex km', (r0.apex/1e3).toFixed(0));
}
