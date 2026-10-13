// duoFacts' wrestle throw shaking list [landS, ownS] and the plaster test at near, versus effort
const { P, g, ctxOf, oCtx, sig, surf } = require('./h.js');
const ang = +(process.argv[2] || 45), near = +(process.argv[3] || 12), sf = process.argv[4] || 'concrete';
const M = P.RESTRAINT.MOVES.throw;
for (let lg = 4; lg <= 10; lg += 0.25) {
  const cA = ctxOf(Math.pow(10, lg), { surface: surf(sf) }), cB = oCtx(cA);
  const t = P.throwPartner(cA, cB, ang);
  if (!t.r.canMove) continue;
  const mo = { obj: t.obj, surface: cA.surface, body: cA.body, anchor: cA.anchor, groundHolds: cA.groundHolds, angle: ang, near, airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
  const landS = t.landToGround ? P.impulseSource(mo.surface, t.landToGround.J, t.landToGround.T) : M.landShake(t.r, mo);
  const ownS = t.r.toGround ? P.impulseSource(mo.surface, t.r.toGround.J, Math.max(1e-9, t.r.toGround.T)) : null;
  const sh = [landS, ownS].filter(Boolean);
  console.log('10^' + lg.toFixed(2), 'v', sig(t.r.v), 'boom', t.r.v >= P.K.a0, 'land plaster', landS ? sig(P.plasterReach(landS)) : '-', 'own plaster', ownS ? sig(P.plasterReach(ownS)) : '-', 'plasterOver(' + near + ')', P.plasterOver(sh, near), 'blast', sig(M.blast(t.r, mo)));
}
