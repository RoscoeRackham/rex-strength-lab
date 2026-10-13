const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const car = D.objects.find(o => o.id === 'car');
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const surface = D.surfaces.find(s => s.id === 'concrete');
for (const rec of [false, true]) {
  const ctx = { F: Math.pow(10, 9.870) * P.K.g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, record: rec };
  const t0 = Date.now();
  const r = P.throwObject(ctx, car, 0);
  const f = r.flight;
  console.log('record', rec, 'v', r.v && r.v.toFixed(0), 'orbit', f.orbit, 'timedOut', f.timedOut, 'time d', (f.time/86400).toFixed(2), 'apex km', (f.apex/1e3).toFixed(0), 'ocean E', f.ocean && f.ocean.E.toExponential(3), 'ms', Date.now() - t0);
}
// power-off : 
const ctx0 = { F: Math.pow(10, 9.870) * P.K.g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
const r0 = P.throwObject(ctx0, car, 0); console.log('off: landed', r0.flight.landed, 'range km', (r0.flight.range/1e3).toFixed(1));
