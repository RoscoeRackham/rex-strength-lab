const { P, surf, ctx } = require('./common.js');
const R = P.RESTRAINT;
const sand = surf('sand');
for (const ub of [true, false]) {
  const c = ctx(1e5, { surface: sand, unbreakable: ub, use: Infinity });
  const r = P.jump(c);
  const o = { near: 5, surface: sand, body: c.body, m: c.body.m, unbreakable: ub, ownRecoil: true, airAbsorb: 1, keepForm: true, anchor: 'friction' };
  const src = R.MOVES.jump.shake(r, o);
  const list = Array.isArray(src) ? src : [src];
  console.log('unbreakable', ub, 'v', r.v.toFixed(2), 'F', (r.F/1e3).toFixed(1), 'kN groundLimitReal', r.groundLimitReal && (r.groundLimitReal/1e3).toFixed(1), 'pushOff', r.pushOff && JSON.stringify({J: r.pushOff.J.toExponential(3), T: r.pushOff.T.toFixed(4), meankN: (r.pushOff.J / r.pushOff.T/1e3).toFixed(0)}));
  console.log('  ppv@5m each source mm/s:', list.filter(Boolean).map(s => (P.ppvAt(s, 5) * 1e3).toFixed(2)).join(', '), ' plasterOver5', P.plasterOver(src, 5), ' plasterReach', P.plasterReach(src).toFixed(1));
  if (ub) {
    const W = c.body.m * P.K.g; const cap = Math.max(0, r.groundLimitReal - W) * r.pushOff.T;
    const s2 = P.impulseSource(sand, cap, r.pushOff.T);
    console.log('  weight kN', (W/1e3).toFixed(1), ' capped J', cap.toFixed(0), ' ppv@5 capped', (P.ppvAt(s2, 5)*1e3).toFixed(2), 'mm/s');
  }
}
