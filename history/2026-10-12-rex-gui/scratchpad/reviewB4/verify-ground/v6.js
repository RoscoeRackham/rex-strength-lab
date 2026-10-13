const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const g = P.K.g;
for (const sid of ['concrete', 'sand']) {
  const sf = D.surfaces.find(s => s.id === sid);
  const ctx = (F, o) => Object.assign({ F, mode: 'comic', body, surface: sf, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }, o || {});
  for (const F of [1e20 * g, 1e30 * g, Infinity]) {
    const r = P.jump(ctx(F));
    const sh = P.RESTRAINT.MOVES.jump.shake(r, { surface: sf, body, m: body.m, unbreakable: true });
    const ppv = P.ppvAt(sh, 5);
    console.log(sid, 'F', F, 'rel', r.relativistic, 'v/c', (r.v / P.K.c).toFixed(4), 'pushOff', r.pushOff, 'ppv@5', ppv, 'plasterReach', P.plasterReach(sh));
  }
}
