const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {};
require('/home/user/dino-strength-sim/src/data.js');
const D = global.window.DINO_DATA;
const g = P.K.g;
function ctx(logKg, mode='comic', surface='concrete') {
  const body = P.makeBody({ H: 2, m: 180 });
  return { F: Math.pow(10, logKg) * g, mode, body, surface: D.surfaces.find(s=>s.id===surface), groundHolds: false, anchor: 'friction' };
}
const obj = id => D.objects.find(o => o.id === id);
function show(label, logKg, id, ang, mode='comic') {
  const t0 = Date.now();
  const r = P.throwObject(ctx(logKg, mode), obj(id), ang);
  const f = r.flight;
  console.log(label, 'logKg', logKg, id, ang, 'deg', mode, '| v', r.v.toFixed(1), 'canMove', r.canMove,
    '| timedOut', f.timedOut, 'escaped', f.escaped, 'steps', f.steps,
    '| time d', (f.time/86400).toFixed(3), 'apex m', f.apex.toExponential(4), 'range km', (f.range/1000).toFixed(1),
    'vImpact', f.vImpact.toFixed(1), 'Eimpact', r.Eimpact, '| ms', Date.now()-t0);
  return r;
}
show('tank', 16.86, 'tank', 30);
show('shot', 13.15, 'shot', 45);
const r = P.throwObject(ctx(16.86), obj('tank'), 30);
const t0=Date.now();
const f2 = P.fly({ v0: r.v, thetaDeg: 30, h0: P.makeBody({}).releaseHeight, m: 66800, A: 15, Cd: 1.0, tMax: 400*86400 });
console.log('tank tMax=400d: time d', (f2.time/86400).toFixed(3), 'range km', (f2.range/1000).toFixed(1), 'vImpact', f2.vImpact.toFixed(1), 'apex', f2.apex.toExponential(4), 'steps', f2.steps, 'timedOut', f2.timedOut, 'ms', Date.now()-t0);
console.log('v0 tank', r.v);
// step cap
const t1=Date.now();
const f3 = P.fly({ v0: 8000, thetaDeg: 0, h0: 1.8, m:1, A:1, Cd: 0 });
console.log('stepcap: steps', f3.steps, 'time d', (f3.time/86400).toFixed(3), 'timedOut', f3.timedOut, 'escaped', f3.escaped, 'vImpact', f3.vImpact, 'range km', (f3.range/1000).toFixed(0), 'ms', Date.now()-t1);
