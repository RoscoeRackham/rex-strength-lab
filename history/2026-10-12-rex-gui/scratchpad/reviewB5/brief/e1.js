global.window = {};
const R = __dirname + '/repo/src/';
const P = require(R + 'engine.js'); require(R + 'data.js'); const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const M = P.RESTRAINT.MOVES;
for (const sid of ['concrete', 'sand']) for (const [F, oid] of [[1e9, 'car'], [1e6, 'car']]) for (const ang of [0, 45, 89, 89.9, 90]) {
  const c = Object.assign({ F: F * g, mode: 'comic', body: rex, surface: surf(sid), anchor: 'friction' }, ON);
  const r = P.throwObject(c, obj(oid), ang);
  const o = Object.assign({ obj: obj(oid), angle: ang, body: rex, surface: surf(sid), anchor: 'friction', near: 5 }, ON);
  const own = r.toGround ? P.impulseSource(surf(sid), r.toGround.J, r.toGround.T) : null;
  console.log(sid, F, oid, ang, 'v', r.v.toPrecision(3), 'toGround J', r.toGround && r.toGround.J.toPrecision(3), 'whole', r.toGround && (r.toGround.whole||0).toPrecision(3), 'supplied', r.toGround && (r.toGround.supplied||0).toPrecision(3), 'T', r.toGround && r.toGround.T.toPrecision(3), 'plaster reach', own ? P.plasterReach(own).toPrecision(3) : '-', 'ppv5', own ? P.ppvAt(own, 5).toPrecision(3) : '-');
}
console.log('shear', surf('concrete').shear, 'digArea', rex.digArea, 'tear N', surf('concrete').shear * rex.digArea, 'sand', surf('sand').shear * rex.digArea);
