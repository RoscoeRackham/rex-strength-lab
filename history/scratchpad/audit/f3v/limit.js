// Analytic F0 -> infinity limit (singular perturbation): instantaneous ramp to w = vmax with momentum
// conservation, then on the slow manifold the Hill force sits at F* where aA + aB = 0, so the
// resistances move momentum from the more-resisted side to the less-resisted side at (R_big-R_small)/(mA+mB).
function hillLimit(o) {
  const { d, mA, mB, vmax } = o; const RA = o.RA == null ? 0 : o.RA, RB = o.RB == null ? 0 : o.RB;
  const aFree = isFinite(RA), bFree = isFinite(RB);
  if (aFree && !bFree) return { vA: vmax, vB: 0 };
  if (bFree && !aFree) return { vA: 0, vB: vmax };
  let vA = vmax * mB / (mA + mB), vB = vmax * mA / (mA + mB);
  const aA = (RB - RA) / (mA + mB), aB = -aA, T = d / vmax;
  // time for decelerating side to stop
  if (aA < 0 && vA + aA * T < 0) { return { vA: 0, vB: vmax }; }
  if (aB < 0 && vB + aB * T < 0) { return { vA: vmax, vB: 0 }; }
  return { vA: vA + aA * T, vB: vB + aB * T };
}
module.exports = { hillLimit };
