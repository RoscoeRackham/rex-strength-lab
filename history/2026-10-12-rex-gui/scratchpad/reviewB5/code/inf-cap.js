global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g, M = P.RESTRAINT.MOVES;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
for (const sid of ['concrete', 'sand']) {
  const surf = D.surfaces.find((s) => s.id === sid);
  for (const F of [1e20 * g, 1e30 * g, Infinity]) {
    const c = Object.assign({ F, mode: 'comic', body: rex, surface: surf, anchor: 'friction' }, ON);
    const o = Object.assign({ surface: surf, body: rex, m: rex.m, near: 5 }, ON);
    const st = P.stomp(c), b = M.stomp.blow(st, o), src = M.stomp.shake(st, o);
    const t = P.throwObject(c, D.objects.find((x) => x.id === 'car'), 90);
    const j = P.jump(c);
    console.log(sid, F === Infinity ? 'inf' : (F / g).toExponential(0),
      '| stomp blow J', b && b.J, 'T', b && b.T, 'supplied', b && b.supplied, 'plasterReach', P.plasterReach(src),
      '| throw90 toGround', JSON.stringify(t.toGround), 'reach', t.toGround ? P.plasterReach(P.impulseSource(surf, t.toGround.J, t.toGround.T)) : null,
      '| jump pushOff', JSON.stringify(j.pushOff));
  }
}
