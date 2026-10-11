// Jump on yielding ground with Poncelet resistance R(v) = A (q + k rho v^2), comic constant force,
// non-relativistic, momentum-conserving inelastic lock at full extension.
const { P, D, g, S, O, T, ctx } = require('./common');
function ponceletJump(F, body, surf, k) {
  const mB = body.feetMass, mA = body.m - mB, A = 2 * body.footArea, d = body.strokes.leg;
  const q = surf.qult, rho = surf.rho;
  // can feet move? only if F + mB g > q A
  let xA = 0, xB = 0, vA = 0, vB = 0, t = 0;
  const vfTerm = Math.sqrt(Math.max(0, F - q * A) / (k * rho * A));
  const tEst = d / Math.max(vfTerm + Math.sqrt(2 * d * F / mA), 1e-9);
  const dt = tEst / 2e5;
  let Jground = 0;
  while (xA + xB < d) {
    // feet: F down (+mB g), resisted by soil while moving or if exceeding q A
    const aA = (F - mA * g) / mA;
    let Rg = (vB > 0 || F + mB * g > q * A) ? A * (q + k * rho * vB * vB) : F + mB * g;
    if (vB <= 0 && Rg > F + mB * g) Rg = F + mB * g;
    const aB = (F + mB * g - Rg) / mB;
    // semi-implicit
    vA += aA * dt; vB = Math.max(0, vB + aB * dt);
    xA += vA * dt; xB += vB * dt; t += dt; Jground += Rg * dt;
  }
  const v = (mA * vA - mB * vB) / (mA + mB);
  return { v, t, xA, xB, vB, vA, Jground };
}
for (const sid of ['sand', 'clay', 'concrete']) for (const kg of [9072, 90718, 1e6, 1.36e11]) {
  const c = ctx(kg, { surface: sid });
  const r = P.jump(c);
  const F = r.F;
  const pk = ponceletJump(F, c.body, S[sid], 1.0);
  const pk5 = ponceletJump(F, c.body, S[sid], 0.5);
  const A = 0.09, d = 0.5, m = 180;
  const asym = d * Math.sqrt(F * 1.0 * S[sid].rho * A) / m;
  console.log(sid, 'liftKg', kg.toPrecision(4), 'Fjump', F.toPrecision(3), 'groundFails', r.groundFails,
    '| engine v', r.v.toPrecision(4), '| Poncelet k=1 v', pk.v.toPrecision(4), '(asymptote', asym.toPrecision(4) + ')', 'k=0.5 v', pk5.v.toPrecision(4),
    '| ratio(k=1)/engine', (pk.v / r.v).toFixed(2), 'height ratio', ((pk.v / r.v) ** 2).toFixed(1));
}
