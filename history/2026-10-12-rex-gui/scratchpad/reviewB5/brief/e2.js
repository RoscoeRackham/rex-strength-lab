global.window = {};
const R = __dirname + '/repo/src/';
const P = require(R + 'engine.js'); require(R + 'data.js'); const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
for (const sid of ['sand', 'concrete']) for (const pw of [{ unbreakable: true }, { unbreakable: true, ownRecoil: true }, { ownRecoil: true }]) for (const ang of [0, 45, 90]) {
  const c = Object.assign({ F: 1e9 * g, mode: 'comic', body: rex, surface: surf(sid), anchor: 'friction' }, pw);
  const r = P.throwObject(c, obj('car'), ang);
  const own = r.toGround ? P.impulseSource(surf(sid), r.toGround.J, r.toGround.T) : null;
  console.log(sid, JSON.stringify(pw), ang, 'recoilV', (r.recoilV||0).toPrecision(3), 'J', r.toGround && r.toGround.J.toPrecision(3), 'supplied', r.toGround && (r.toGround.supplied||0).toPrecision(3), 'plaster', own ? P.plasterReach(own).toPrecision(3) : '-');
}
