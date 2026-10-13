global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g, M = P.RESTRAINT.MOVES;
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
// the growth test's own case
const I = P.instantGrowth(rex, 4.2e23, 0.5, { surface: surf('concrete'), unbreakable: true });
console.log('growth test case: toGround', JSON.stringify(I.toGround), 'm vSole', I.grown.m * I.vSole);
for (const E of [1e6, 1e9, 1e12, 1e15]) for (const sid of ['sand', 'concrete']) { const x = P.instantGrowth(rex, E, 0.5, { surface: surf(sid), unbreakable: true }); if (x.toGround) console.log('growth', E, sid, 'J', x.toGround.J.toPrecision(3), 'whole', x.toGround.whole.toPrecision(3), 'supplied', x.toGround.supplied.toPrecision(3)); }
// landing cap binding: jump with unbreakable on sand/concrete
for (const sid of ['sand', 'concrete']) for (const lg of [4, 5, 5.5, 6, 6.5]) {
  const c = { F: Math.pow(10, lg) * g, mode: 'comic', body: rex, surface: surf(sid), anchor: 'friction', unbreakable: true };
  const j = P.jump(c), L = j.landing;
  if (!L.landed) { console.log('jump', sid, lg, 'no landing'); continue; }
  const J = P.vToMomentum(L.v, rex.m), cap = j.landBear * L.t;
  const o = { surface: c.surface, body: rex, m: rex.m, unbreakable: true };
  const src = M.jump.shake(j, o);
  console.log('jump', sid, lg, 'landing J', J.toPrecision(3), 'cap', cap.toPrecision(3), J > cap ? 'BINDS' : '', 'plaster reach', P.plasterReach(src).toPrecision(3));
}
// angled throw on sand with unbreakable: sideways part
for (const ang of [30, 45, 60]) { const c = { F: 1e6 * g, mode: 'comic', body: rex, surface: surf('sand'), anchor: 'friction', unbreakable: true, ownRecoil: true }; const r = P.throwObject(c, obj('car'), ang); console.log('throw sand', ang, JSON.stringify(r.toGround)); }
// unbreakable alone: recoil subtracted
{ const c = { F: 1e6 * g, mode: 'comic', body: rex, surface: surf('concrete'), anchor: 'friction', unbreakable: true }; const r = P.throwObject(c, obj('car'), 30); console.log('throw unbreakable only: pObj', P.vToMomentum(r.v, obj('car').m).toPrecision(4), 'recoilV', r.recoilV, 'toGround', JSON.stringify(r.toGround)); }
