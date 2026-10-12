global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
global.gc && gc();
const m0 = process.memoryUsage().heapUsed;
const plans = [];
for (let i = 0; i < 40; i++) {
  const c = { F: Math.pow(10, 20 + i * 0.3) * g, mode: 'comic', body: rex, surface: surf('sand'), groundHolds: false, anchor: 'friction' };
  const p = P.RESTRAINT.planNow('throw', c, { obj: obj('car'), angle: 45, target: 30, near: 5 });
  plans.push(p);
}
global.gc && gc();
const m1 = process.memoryUsage().heapUsed;
console.log('40 completed throw plans retain', ((m1 - m0) / 1e6).toFixed(1), 'MB; runs', plans.map((p) => p.runs()).reduce((a, b) => a + b));
