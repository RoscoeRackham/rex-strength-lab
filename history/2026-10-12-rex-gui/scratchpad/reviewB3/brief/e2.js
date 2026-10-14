global.window = {}; const P = require('./repo/src/engine.js'); require('./repo/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g, surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
for (const sid of ['sand', 'concrete', 'ice', 'softclay']) for (const lg of [4, 6, 9]) {
  const cR = Object.assign({ F: Math.pow(10, lg) * g, mode: 'comic', body: rex, surface: surf(sid), anchor: 'friction' }, ON), cO = Object.assign({}, cR, { body: ollie });
  const L = P.catchLeg(cR, cO, obj('car'), 30, 'hard');
  const co = P.collide(cO, cR, { source: 'jump' });
  const tp = P.throwPartner(cR, cO, 45);
  const ts = P.tossPartner(cR, ollie, 'Ollie', 'hard', 10, 'friction');
  const pu = P.punch(cR), pl = P.pull(cR, obj('bus'));
  console.log(sid, lg, '| catch', L.result, L.catch && L.catch.sinkRatio, L.catch && L.catch.sinkRatioRaw, '| collide jump', co.outcome, co.after && co.after.splat && co.after.splat.depth, 'toGround', !!co.toGround,
   '| wthrow sink', tp.r && tp.r.sinkRatio, '| toss', ts.result, ts.catch ? ts.catch.sinkRatio : '', ts.catch ? ts.catch.sinkRatioRaw : '', 'toss toGround', !!(ts.toGround || ts.toGroundC || (ts.catch && ts.catch.toGround)),
   '| punch sink', pu.sinkRatio, pu.groundRatio, '| pull', pl.canMove);
}
