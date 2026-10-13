global.window = {};
const L = process.argv[2];
const P = require(L + '/src/engine.js'); require(L + '/src/data.js'); const D = window.DINO_DATA;
for (const [build, m, H, sid, lk] of [['rex', 5000, 3.048, 'sand', 5], ['rex', 3007, 3.048, 'sand', 5], ['rex', 3007, 3.048, 'concrete', 5]]) {
  const body = P.makeBody({ build, H, m });
  const surface = D.surfaces.find(s => s.id === sid);
  const ctx = { F: Math.pow(10, lk) * P.K.g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
  const r = P.jump(ctx);
  const Ld = r.landing;
  const J = P.vToMomentum(Ld.v, m), Jg = Math.min(J, (r.landBear || 0) * Ld.t);
  const RBreal = r.groundLimitReal;
  const sh = P.RESTRAINT.MOVES.jump.shake(r, Object.assign({ m, body }, ctx));
  console.log(JSON.stringify({ sid, m, v: Ld.v, t: Ld.t, landRatioReal: r.landRatioReal, landBear: r.landBear, RBreal, weight: m * P.K.g, J, Jg, landV1: r.landV1, pushOff: r.pushOff, shake: sh }));
}
