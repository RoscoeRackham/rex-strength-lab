global.window = {}; const P = require('./repo/src/engine.js'); require('./repo/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g, rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const M = P.RESTRAINT.MOVES;
for (const anchor of ['friction', 'bolted']) for (const oid of ['bus', 'locomotive', 'c17']) {
  const o = obj(oid) || obj('car');
  const c = { F: 1e7 * g, mode: 'comic', body: rex, surface: surf('concrete'), anchor, ownRecoil: true, unbreakable: true };
  const r = P.pull(c, o);
  const sh = M.pull.shake(r, { surface: c.surface, body: rex, obj: o, ownRecoil: true, anchor });
  // the push the ground takes in either case: rope impulse over t10m
  const J = P.vToMomentum(r.vEnd, o.m) + r.resist * r.t10m;
  const src = P.impulseSource(c.surface, J, r.t10m);
  console.log(anchor, o.id, 'canMove', r.canMove, 't10m', r.t10m.toPrecision(3), 'vEnd', r.vEnd.toPrecision(3), 'shake counted:', !!sh, 'ppv@2m if counted', (P.ppvAt(src, 2) * 1000).toPrecision(3), 'mm/s', 'plasterReach', P.plasterReach(src).toPrecision(3));
}
