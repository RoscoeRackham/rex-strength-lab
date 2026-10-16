const { P, ctx, octx, K, DIAL, g } = require('./h.js');
const c = K.c;
// Ollie sprints into Rex, splat & bounce
for (const bounce of [false, true]) {
  const r = P.collide(octx(), ctx(), { source: 'sprint', bounce });
  console.log('bounce', bounce, r.outcome, 'v', r.vRel, 'carry', JSON.stringify(r.carry), 'Q', r.Q, 'hitAbs', JSON.stringify(r.hitAbsorbed), 'after', JSON.stringify(r.after), 'toGround', JSON.stringify(r.toGround));
  const mB = ctx().body.m, mA = octx().body.m, v = r.vRel;
  const gam = 1 / Math.sqrt(1 - v * v / c / c);
  const myV = bounce ? 2 * v / (1 + v * v / c / c) : v;
  const myP = bounce ? 2 * gam * gam * mB * v : gam * mB * v;
  const myQ = (gam - 1) * mB * c * c;
  console.log('  mine vB', myV, 'p', myP, 'Q', myQ, ' diff vB', r.carry.vB - myV, 'dp/p', (r.carry.pGain - myP) / myP, 'dQ/Q', (r.Q - myQ) / myQ, 'supplied-pGain-footJ', r.carry.supplied - r.carry.pGain - r.carry.footJ);
  console.log('  hold', JSON.stringify({ H: r.hold.H, R: r.hold.R, why: r.hold.why }), 'mA', mA, 'mB', mB);
}
