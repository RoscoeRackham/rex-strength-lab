global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const obj = (id) => D.objects.find((o) => o.id === id);
const surf = D.surfaces.find(s=>s.id==='concrete');
const defB = () => P.makeBody({H: P.DEFAULT_BODIES.rex.H, m: P.DEFAULT_BODIES.rex.m});
const defO = () => P.makeBody({H: P.DEFAULT_BODIES.ollie.H, m: P.DEFAULT_BODIES.ollie.m, build:'ollie'});
const mk = (lk, b, gh) => ({ F: Math.pow(10, lk) * g, mode: 'comic', body: b, surface: surf, groundHolds: gh, anchor: 'friction' });
const res = {};
const t0 = Date.now();
for (const id of ['tank','loco','shuttle','titanic','nimitz','esb','ruyi','car','baseball','eiffel','pyramid']) for (const Dd of [1e7, 2.0015e7, 1e6]) for (const lk of [12, 16, 20]) for (const bs of ['def','2m']) {
  const o = obj(id); if (!o) { console.log('no', id); continue; }
  const bT = bs==='def'?defB():P.makeBody({H:2,m:180}), bC = bs==='def'?defO():P.makeBody({H:2,m:180});
  const r = P.catchLeg(mk(lk,bT,true), mk(lk,bC,true), o, Dd, 'easy');
  res[r.result]=(res[r.result]||0)+1;
  if (r.result === 'no-arc' || (id==='tank' && Dd===1e7 && lk===16)) console.log(id, Dd, lk, bs, r.result, r.thetaDeg || (r.aim && r.aim.thetaDeg), r.vL || (r.aim && r.aim.vL), r.launchRatio && r.launchRatio.toPrecision(3));
}
console.log(JSON.stringify(res), Date.now()-t0, 'ms');
