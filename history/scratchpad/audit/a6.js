const { P, D, g, S, O, T, ctx } = require('./common');
const f = (x) => (typeof x === 'number' ? x.toPrecision(4) : String(x));
// 1) theta discontinuity at 0 vs 1 deg when standing load exceeds bearing
for (const [sid, oid, kg] of [['sand', 'car', 1e5], ['clay', 'car', 1e5], ['sand', 'bus', 1e6]]) for (const deg of [0, 1, 5]) {
  const c = ctx(kg, { surface: sid });
  const r = P.throwObject(c, O[oid], deg);
  console.log('disc', sid, oid, 'lift', kg, 'deg', deg, 'anchor', f(r.anchor.R), r.anchor.limit, 'Rbear', f(r.anchor.Rbear), '| v', f(r.v), 'recoilV', f(r.recoilV), 'range', f(r.flight.range));
}
// 2) extraMass double count: compare RA_engine vs RA_true = RA_engine + mB g sin(theta)
function trueThrow(c, obj, deg) {
  const r = P.throwObject(c, obj, deg);
  const th = deg * Math.PI / 180;
  const style = obj.m <= 1 ? 'whip' : 'push', hands = obj.m > 20 ? 2 : 1;
  const armMass = hands * (style === 'whip' ? c.body.whipEff : c.body.handEff);
  const mB = obj.m + armMass, mA = c.body.m - armMass;
  // exact force balance, dino stationary: N = mA g + F s + mB g c^2 ; H = F c - mB g s c
  const s = Math.sin(th), co = Math.cos(th), mu = c.surface.mu, Nmax = c.surface.qult * 2 * c.body.footArea;
  const dig = c.anchor === 'braced' ? c.surface.shear * c.body.digArea : 0;
  const Rbear = s > 1e-9 ? (Nmax - mA * g - mB * g * co * co) / s : Infinity;
  const Rhor = (co - mu * s) <= 0 ? Infinity : (mu * mA * g + mu * mB * g * co * co + mB * g * s * co + dig) / (co - mu * s);
  const RA = Math.max(0, Math.min(Rbear, Rhor));
  const push = P.pushApart({ F: r.F, d: style === 'whip' ? c.body.strokes.whip : c.body.strokes.throw, mA, mB, RA, RB: mB * g * s, mode: c.mode, vmax: P.MUSCLE[style === 'whip' ? 'throwWhip' : 'throwPush'].vmax * c.body.s });
  return { r, RAtrue: RA, pushTrue: push };
}
for (const [sid, oid, deg, kg] of [['concrete', 'tank', 45, 4.25e5], ['concrete', 'tank', 60, 5e5], ['concrete', 'tank', 90, 4.25e5], ['asphalt', 'bus', 70, 1.2e5], ['concrete', 'car', 45, 9072]]) {
  const c = ctx(kg, { surface: sid });
  const { r, RAtrue, pushTrue } = trueThrow(c, O[oid], deg);
  console.log('dbl', sid, oid, deg + 'deg', 'lift', kg, 'Fthrow', f(r.F), 'RB', f(r.F && O[oid].m * g * Math.sin(deg * Math.PI / 180)),
    '| engine RA', f(r.anchor.R), r.anchor.limit, 'recoilV', f(r.recoilV), 'v', f(r.v),
    '| true RA', f(RAtrue), 'recoilV', f(pushTrue.vA), 'v', f(pushTrue.vB), '| RA ratio', (RAtrue / r.anchor.R).toFixed(2));
}
