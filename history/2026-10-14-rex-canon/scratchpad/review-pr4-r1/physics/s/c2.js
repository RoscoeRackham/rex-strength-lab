const { P, ctx, octx, K } = require('./h.js');
const c = K.c;
for (const beta of [100 / c, 1e-3, 0.0099, 0.0101, 0.1, 0.5, 0.99, 0.999999]) {
  const gb = beta / Math.sqrt(1 - beta * beta);
  for (const bounce of [false, true]) {
    const r = P.collide(octx(), ctx(), { source: 'set', gb, bounce });
    const mB = 3000, gam = 1 / Math.sqrt(1 - beta * beta), v = r.vRel;
    const myV = bounce ? 2 * beta * c / (1 + beta * beta) : beta * c;
    const myP = bounce ? 2 * gam * gam * mB * beta * c : gam * mB * beta * c;
    const myQ = (gam - 1) * mB * c * c; // KE of one hit in charger frame
    const cr = r.carry || {};
    console.log(beta.toExponential(3), bounce ? 'B' : 'S', r.outcome, 'vRel/v', (v / (beta * c) - 1).toExponential(2), 'vB rel err', ((cr.vB - myV) / myV).toExponential(2), 'p rel', ((cr.pGain - myP) / myP).toExponential(2), 'Q rel', ((r.Q - myQ) / myQ).toExponential(2), 'supply chk', (cr.supplied - cr.pGain - cr.footJ), 'footJ', cr.footJ && cr.footJ.toExponential(3), 'F', cr.F && cr.F.toExponential(3), 'T', cr.T && cr.T.toExponential(3), 'hitAbs', r.hitAbsorbed && r.hitAbsorbed.E.toExponential(3), 'Elocal', r.Elocal && r.Elocal.toExponential(3), 'after', JSON.stringify(bounce ? r.after.bounce : r.after.splat));
  }
}
// light speed
for (const bounce of [false, true]) {
  const r = P.collide(octx(), ctx(), { source: 'set', gb: Infinity, bounce });
  console.log('c', bounce, r.outcome, r.unbounded, JSON.stringify(r.carry), r.h && JSON.stringify(r.h.el), JSON.stringify(r.after), JSON.stringify(r.toGround));
}
