// Proposed closed-form saturated limit (F0 -> infinity, relative speed pinned at vmax) that keeps the external resistances.
const { P, g, ctx, obj } = require('./common.js');
const { refHill } = require('./ref.js');
function saturated(o) {
  const { d, mA, mB, vmax } = o; const RA = o.RA == null ? 0 : o.RA, RB = o.RB == null ? 0 : o.RB;
  const aFree = isFinite(RA), bFree = isFinite(RB), M = mA + mB, T = d / vmax;
  if (!aFree && !bFree) return { vA: 0, vB: 0 };
  if (!aFree) return { vA: 0, vB: vmax };
  if (!bFree) return { vA: vmax, vB: 0 };
  // both free: impulsive split, then net external force (RA - RB) along B's direction while both slide
  const vB0 = vmax * mA / M, net = RA - RB;
  let vB;
  if (net > 0) { const t1 = (vmax - vB0) * M / net; vB = t1 >= T ? vB0 + net * T / M : vmax; }
  else if (net < 0) { const t1 = vB0 * M / -net; vB = t1 >= T ? vB0 + net * T / M : 0; }
  else vB = vB0;
  return { vA: vmax - vB, vB };
}
module.exports = { saturated };
if (require.main === module) {
  const kg = 1.36e14;
  for (const extra of [{}, { surface: 'sand' }]) {
    const c = ctx(kg, 'real', extra), b = c.body, F = c.F;
    const anc0 = P.anchorCapacity({ body: b, surface: c.surface, theta: 0, anchor: 'friction', groundHolds: false });
    const cs = {
      punch: [{ F: F * 0.3, d: b.strokes.punch, mA: b.m - b.handEff, mB: b.handEff, RA: anc0.R, RB: 0, vmax: 17 }, 'vB'],
      stompBody: [{ F: F * 0.5, d: b.strokes.stomp, mA: b.m - b.legEff, mB: b.legEff, RA: (b.m - b.legEff) * g, RB: 0, vmax: 16 }, 'vA'],
      jump: [{ F, d: b.strokes.leg, mA: b.m - b.feetMass, mB: b.feetMass, RA: (b.m - b.feetMass) * g, RB: c.surface.qult * 2 * b.footArea, vmax: 30 }, 'vA'],
    };
    for (const id of ['shot', 'car', 'bus']) {
      const o = obj(id), th = Math.PI / 4, arm = (o.m > 20 ? 2 : 1) * b.handEff;
      const anc = P.anchorCapacity({ body: b, surface: c.surface, theta: th, anchor: 'friction', groundHolds: false, extraMass: o.m });
      cs[id] = [{ F: F * 0.3, d: b.strokes.throw, mA: b.m - arm, mB: o.m + arm, RA: anc.R, RB: (o.m + arm) * g * Math.sin(th), vmax: 55 }, 'vB'];
    }
    console.log('==', JSON.stringify(extra));
    for (const [n, [o, side]] of Object.entries(cs)) {
      const s = saturated(o)[side], r = refHill(Object.assign({ N: 50000 }, o))[side], e = P.pushApart(Object.assign({ mode: 'real' }, o))[side];
      console.log('  ', n.padEnd(9), 'closed-form fix', s.toFixed(3), ' reference', r.toFixed(3), ' current engine', e.toFixed(3));
    }
  }
}
