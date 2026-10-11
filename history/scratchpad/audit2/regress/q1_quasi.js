const { P, ctx } = require('./common.js');
function direct(F, d, mA, mB, RA, RB, cB) {
  // classical, exact ODE for feet with drag (analytic tanh solution), body constant force
  const fA = F - RA, fB = F - RB;
  const vt = Math.sqrt(fB / cB), k = Math.sqrt(fB * cB) / mB; // vB = vt tanh(k t), xB = (mB/cB) ln cosh(k t)
  const S = (t) => fA * t * t / (2 * mA) + (mB / cB) * Math.log(Math.cosh(k * t));
  let lo = 0, hi = 1; while (S(hi) < d) hi *= 2;
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; if (S(m) < d) lo = m; else hi = m; }
  const t = hi; return { p: fA * t - mB * vt * Math.tanh(k * t), t };
}
for (const surface of ['sand', 'concrete', 'granite']) for (const H of [0.4, 2, 50]) for (const lg of [3, 4, 5, 6, 8, 10, 12]) {
  const c = ctx({ kg: Math.pow(10, lg) * Math.pow(H / 2, 3), surface, H });
  const b = c.body, d = b.strokes.leg, mA = b.m - b.feetMass, mB = b.feetMass;
  const F = P.MUSCLE.jump.comicFrac * c.F;
  const RB = P.qultFor(c.surface, b.footB) * 2 * b.footArea, cB = c.surface.rho * 2 * b.footArea;
  if (F <= RB) continue;
  const e = P.pushApart({ F, d, mA, mB, RA: mA * P.K.g, RB, cB, mode: 'comic' });
  const pe = e.pA - e.pB, pd = direct(F, d, mA, mB, mA * P.K.g, RB, cB).p;
  if (Math.abs(pe / pd - 1) > 0.02) console.log(surface, 'H', H, 'lg', lg, 'engine p', pe.toPrecision(5), 'direct', pd.toPrecision(5), 'ratio', (pe / pd).toFixed(3));
}
console.log('done');
