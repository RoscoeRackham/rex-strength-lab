global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const K = P.K, g = K.g;
const obj = (id) => D.objects.find((o) => o.id === id);
const surf = (id) => D.surfaces.find((s) => s.id === id);
const body = P.makeBody({});
const base = { F: 100 * 907.18474 * g, mode: 'comic', body, surface: surf('concrete'), groundHolds: false, anchor: 'friction' };
for (const id of ['baseball', 'shot', 'bowling', 'piano', 'car', 'tank']) {
  for (const th of [0, 10, 30, 45]) {
    const t0 = Date.now();
    const r = P.throwObject(base, obj(id), th);
    const dt = Date.now() - t0;
    console.log(id, th, 'v', r.v && r.v.toFixed(2), 'range', r.flight && r.flight.range.toFixed(1), 'apex', r.flight && r.flight.apex.toFixed(1), 'time', r.flight && r.flight.time.toFixed(2), 'steps', r.flight && r.flight.steps, 'ms', dt, 'recoil', r.recoilV && r.recoilV.toFixed(2), 'R', r.anchor.R.toFixed(0));
  }
}
// fly timing for long flights
for (const [v, th] of [[3000, 45], [7000, 30], [7500, 20], [8000, 10], [5000, 45]]) {
  const o = obj('baseball');
  const t0 = Date.now();
  const f = P.fly({ v0: v, thetaDeg: th, h0: 1.8, m: o.m, A: o.area, Cd: o.Cd, CdSup: o.CdSup });
  console.log('baseball', v, th, 'range km', (f.range / 1e3).toFixed(1), 'apex km', (f.apex / 1e3).toFixed(1), 'time', f.time.toFixed(1), 'vimp', f.vImpact.toFixed(1), 'steps', f.steps, 'ms', Date.now() - t0, f.escaped, f.orbit);
  const oc = obj('car');
  const t1 = Date.now();
  const f2 = P.fly({ v0: v, thetaDeg: th, h0: 1.8, m: oc.m, A: oc.area, Cd: oc.Cd, CdSup: oc.CdSup });
  console.log('car', v, th, 'range km', (f2.range / 1e3).toFixed(1), 'apex km', (f2.apex / 1e3).toFixed(1), 'time', f2.time.toFixed(1), 'vimp', f2.vImpact.toFixed(1), 'steps', f2.steps, 'ms', Date.now() - t1, f2.escaped, f2.orbit);
}
