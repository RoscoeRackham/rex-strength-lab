global.window = {}; const P = require('./repo/src/engine.js'); require('./repo/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g, surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const M = P.RESTRAINT.MOVES;
for (const [oid, lg, ang] of [['car', 6, 0], ['car', 7, 0], ['car', 8, 0], ['car', 10, 0], ['baseball', 6, 0], ['baseball', 7, 0], ['baseball', 8, 30]]) {
  for (const air of [1, 0]) {
    const c = { F: Math.pow(10, lg) * g, mode: 'comic', body: rex, surface: surf('concrete'), anchor: 'friction', airAbsorb: air, keepForm: true, unbreakable: true, ownRecoil: true };
    const p = P.RESTRAINT.planNow('throw', c, { obj: obj(oid), angle: ang, target: 30, near: 5 });
    const res = ['windows', 'houses', 'block'].map((e) => { const r = p.result('preset:' + e); return e + ':' + (r.never ? 'never' : (r.use / g).toPrecision(3)); }).join(' ');
    const rr = P.throwObject(c, obj(oid), ang), b = M.throw.blastParts(rr, Object.assign({ obj: obj(oid), angle: ang, body: rex, near: 5 }, c));
    console.log(oid, lg, ang, 'air', air, '|', res, '| allout v', rr.v.toPrecision(3), 'blast parts land', b.land.toPrecision(3), 'path', b.path.toPrecision(3), rr.flight.escaped ? 'escaped' : rr.flight.orbit ? 'orbit' : 'range ' + (rr.flight.range||0).toPrecision(3));
  }
}
