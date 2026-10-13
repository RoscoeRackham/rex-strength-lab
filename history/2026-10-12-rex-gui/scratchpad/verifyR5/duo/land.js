// partner landing: ground take and ppv at 5 m versus effort (Rex throws Ollie, powers on, concrete)
const { P, g, ctxOf, oCtx, sig, surf } = require('./h.js');
const ang = +(process.argv[2] || 45), sf = process.argv[3] || 'concrete';
let prev = null;
for (let lg = 3; lg <= 9.5; lg += 0.25) {
  const cA = ctxOf(Math.pow(10, lg), { surface: surf(sf) }), cB = oCtx(cA);
  const t = P.throwPartner(cA, cB, ang), f = t.r.flight;
  if (!t.r.canMove || !f || !f.landed) { console.log(lg, 'no landing', t.r.canMove, f && f.relativistic); continue; }
  const L = t.obj.L, v = f.vImpact, T = Math.max(1e-3, L / v), J = P.vToMomentum(v, 3007);
  const src = t.landToGround ? P.impulseSource(cA.surface, t.landToGround.J, t.landToGround.T) : P.impulseSource(cA.surface, J, T);
  const ppv = P.ppvAt(src, 5), pl = P.plasterReach(src);
  const src0 = P.impulseSource(cA.surface, J, T);
  console.log('10^' + lg.toFixed(2), 'vImp', sig(v), 'ang', sig(f.impactAngleDeg), 'J', sig(t.landToGround ? t.landToGround.J : J), 'whole', sig(J), 'capped', !!t.landToGround, 'ppv5', sig(ppv * 1000), 'mm/s plaster', sig(pl), 'm | uncapped ppv5', sig(P.ppvAt(src0, 5) * 1000), (prev != null && ppv < prev * (1 - 1e-9)) ? '  <-- LESS than a softer throw' : '');
  prev = ppv;
}
