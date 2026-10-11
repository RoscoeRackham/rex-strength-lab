global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
const obj = (id) => D.objects.find((o) => o.id === id);
const surf = D.surfaces.find(s=>s.id==='concrete');
const defB = () => P.makeBody({H: P.DEFAULT_BODIES.rex.H, m: P.DEFAULT_BODIES.rex.m});
const defO = () => P.makeBody({H: P.DEFAULT_BODIES.ollie.H, m: P.DEFAULT_BODIES.ollie.m, build:'ollie'});
const mk = (lk, body) => ({ F: Math.pow(10, lk) * g, mode: 'comic', body, surface: surf, groundHolds: false, anchor: 'friction' });
for (const [id, lk, Dd] of [['eiffel',19,1e5],['eiffel',20,1e5],['pyramid',18,1e5],['pyramid',20.5,1e5],['pyramid',19,1e5]]) for (const bs of ['def','2m']) {
  const bT = bs==='def'?defB():P.makeBody({H:2,m:180}), bC = bs==='def'?defO():P.makeBody({H:2,m:180});
  const r = P.catchLeg(mk(lk,bT), mk(lk,bC), obj(id), Dd, 'hard');
  console.log(id, lk, Dd, bs, r.result, 'vL', r.vL && r.vL.toPrecision(4), 'th', r.thetaDeg, r.aim && JSON.stringify(r.aim), 'rel', r.relativistic, 'fb', r.fireball && r.fireball.kind);
}
// table accuracy
for (const [id, lk] of [['pyramid',19],['eiffel',20],['car',12],['tank',16]]) {
  const c = mk(lk, defB());
  const tab = P.catchReleaseTable(c, obj(id));
  let worst = 0, wth=0;
  for (let th = 0; th <= 89; th += 0.5) {
    const ex = P.throwObject(Object.assign({}, c, {noFlight:true}), obj(id), th);
    const ve = ex.canMove ? ex.v : 0, vt = tab.vOf(th);
    if (ve > 0) { const ratio = Math.max(vt/ve, ve/vt); if (ratio > worst) { worst = ratio; wth = th; } }
  }
  console.log('table', id, lk, 'worst ratio', worst.toFixed(3), 'at', wth, 'v89', tab.vOf(89).toPrecision(3), 'v90 exact', P.throwObject(Object.assign({}, c, {noFlight:true}), obj(id), 90).v.toPrecision(3));
}
