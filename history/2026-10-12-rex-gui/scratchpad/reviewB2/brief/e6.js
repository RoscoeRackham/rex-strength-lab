global.window = {}; const P = require('./repo/rex-strength-lab/src/engine.js'); require('./repo/rex-strength-lab/src/data.js'); const D = window.DINO_DATA; const g = P.K.g;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }); const obj = (id) => D.objects.find((o) => o.id === id);
const conc = D.surfaces.find((s) => s.id === 'concrete');
for (const [oid, lk] of [['b777', 9], ['b777', 6], ['loco', 9], ['ruyi', 9]]) {
  const o = obj(oid); if (!o) { console.log('no', oid); continue; }
  for (const own of [false, true]) {
    const c = { F: Math.pow(10, lk) * g, mode: 'comic', body: rex, surface: conc, anchor: 'friction', ownRecoil: own, unbreakable: true };
    const r = P.pull(c, o);
    if (!r.canMove) { console.log(oid, lk, own, 'cannot move', r.usable); continue; }
    const J = P.vToMomentum(r.vEnd, o.m), T = r.t10m;
    const src = P.impulseSource(conc, J, T);
    console.log(oid, '1e' + lk, 'ownRecoil', own, 'accel', r.accel.toPrecision(3), 't10m', T.toPrecision(3), 'vEnd', r.vEnd.toPrecision(3), 'J', J.toPrecision(3), 'ppv@5m', P.ppvAt(src, 5).toPrecision(3), 'plaster@5', P.plasterOver(src, 5), 'plasterReach', P.plasterReach(src).toPrecision(3), 'rope F', (o.m * r.accel).toPrecision(3));
  }
}
