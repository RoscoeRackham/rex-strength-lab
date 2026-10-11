global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const obj = (id) => D.objects.find((o) => o.id === id);
const surf = D.surfaces.find(s=>s.id==='concrete');
const mk = (lk, b, anchor) => ({ F: Math.pow(10, lk) * g, mode: 'comic', body: b, surface: surf, groundHolds: false, anchor: anchor||'friction' });
const time = (lbl, fn) => { const t = Date.now(); const r = fn(); console.log(lbl, Date.now() - t, 'ms'); return r; };
const defB = () => P.makeBody({H: P.DEFAULT_BODIES.rex.H, m: P.DEFAULT_BODIES.rex.m});
const defO = () => P.makeBody({H: P.DEFAULT_BODIES.ollie.H, m: P.DEFAULT_BODIES.ollie.m, build:'ollie'});
time('b777 lob unequal (H0.1 m0.0225 vs H500 oM2.8e9) 10km', () => P.catchGame(mk(12, P.makeBody({H:0.1,m:0.0225})), mk(12, P.makeBody({H:500, m:2.8125e9, build:'ollie'})), obj('b777'), 1e4, 'easy'));
time('b777 lob unequal again (cache)', () => P.catchGame(mk(12, P.makeBody({H:0.1,m:0.0225})), mk(12, P.makeBody({H:500, m:2.8125e9, build:'ollie'})), obj('b777'), 1e4, 'easy'));
time('eiffel lob 100km default', () => P.catchGame(mk(12, defB()), mk(12, defO()), obj('eiffel'), 1e5, 'easy'));
time('eiffel lob 100km 2m', () => P.catchGame(mk(12, P.makeBody({H:2,m:180})), mk(12, P.makeBody({H:2,m:180})), obj('eiffel'), 1e5, 'easy'));
time('eiffel lob 50km default', () => P.catchGame(mk(12, defB()), mk(12, defO()), obj('eiffel'), 5e4, 'easy'));
time('eiffel lob 100km default str 13', () => P.catchGame(mk(13, defB()), mk(13, defO()), obj('eiffel'), 1e5, 'easy'));
time('shoveBoth 1e21 1e34', () => P.shoveBoth(mk(34, P.makeBody({H:2,m:1e21}), 'friction'), mk(34, P.makeBody({H:2,m:1e21, build:'ollie'}), 'bolted')));
time('shoveBoth 1e21 1e34 both friction', () => P.shoveBoth(mk(34, P.makeBody({H:2,m:1e21}), 'friction'), mk(34, P.makeBody({H:2,m:1e21, build:'ollie'}), 'friction')));
// worst-case sweep sample
let worst = 0, wl = '';
const objs = D.objects.filter(o=>!o.noThrow);
const t0 = Date.now(); let n = 0;
for (const o of objs) for (const Dd of [1e3, 1e4, 1e5, 1e6]) for (const lk of [6, 12, 18]) for (const st of ['easy','hard']) {
  const t = Date.now();
  P.catchGame(mk(lk, P.makeBody({H:2,m:180})), mk(lk, P.makeBody({H:3.048,m:2700, build:'ollie'})), o, Dd, st); n++;
  const dt = Date.now() - t; if (dt > worst) { worst = dt; wl = [o.id, Dd, lk, st].join(' '); }
}
console.log('sweep', n, 'states, total', Date.now()-t0, 'ms, worst', worst, wl);
