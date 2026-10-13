global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g, M = P.RESTRAINT.MOVES;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
console.log('feelOnce', P.VIB.TH.feelOnce, 'TH keys', Object.keys(P.VIB.TH));
for (const sid of ['concrete', 'sand']) {
  const surface = D.surfaces.find(s => s.id === sid);
  const r0 = P.jump(Object.assign({ F: 1e5 * g, mode: 'comic', body: rex, surface, anchor: 'friction' }, ON));
  console.log(sid, 'RBreal kgf', (r0.groundLimitReal / g).toPrecision(4));
  for (const lg of [5, 5.5, 6, 7, 8, 9, 10]) {
    const r = P.jump(Object.assign({ F: Math.pow(10, lg) * g, mode: 'comic', body: rex, surface, anchor: 'friction' }, ON));
    const s = P.RESTRAINT.MOVES.jump.shake(r, Object.assign({ surface, body: rex, m: rex.m }, ON));
    const po = s[s.length - 1];
    console.log(' 10^' + lg, 'overLimitReal', r.overLimitReal, 'pushOff J', r.pushOff.J.toPrecision(4), 'whole', r.pushOff.whole.toPrecision(4), 'push-off reach (feelOnce)', P.ppvReach(po, P.VIB.TH.feelOnce).toPrecision(3), 'm; all-sources ppv5', (P.ppvAt(s, 5) * 1000).toFixed(1));
  }
}
