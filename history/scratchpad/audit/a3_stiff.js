const { P, g, ctx, obj } = require('./common.js');
const { refHill } = require('./ref.js');
function setups(kg) {
  const c = ctx(kg, 'real');
  const b = c.body; const F = c.F;
  const ancPunch = P.anchorCapacity({ body: b, surface: c.surface, theta: 0, anchor: 'friction', groundHolds: false });
  const th = 45 * Math.PI / 180, ball = obj('baseball');
  const ancBall = P.anchorCapacity({ body: b, surface: c.surface, theta: th, anchor: 'friction', groundHolds: false, extraMass: ball.m });
  return {
    punch: { F: F * 0.3, d: b.strokes.punch, mA: b.m - b.handEff, mB: b.handEff, RA: ancPunch.R, RB: 0, vmax: 17, side: 'vB' },
    jumpHolds: { F: F, d: b.strokes.leg, mA: b.m - b.feetMass, mB: b.feetMass, RA: (b.m - b.feetMass) * g, RB: Infinity, vmax: 30, side: 'vA' },
    jumpConcrete: { F: F, d: b.strokes.leg, mA: b.m - b.feetMass, mB: b.feetMass, RA: (b.m - b.feetMass) * g, RB: c.surface.qult * 2 * b.footArea, vmax: 30, side: 'vA' },
    ball45: { F: F * 0.3, d: b.strokes.whip, mA: b.m - b.whipEff, mB: ball.m + b.whipEff, RA: ancBall.R, RB: (ball.m + b.whipEff) * g * Math.sin(th), vmax: 55, side: 'vB' },
  };
}
for (const kg of [511, 1e5, 1e6, 3e6, 1e7, 1e8, 1e9, 1e10, 3e10, 1e11, 1e12]) {
  const S = setups(kg); const row = [kg.toExponential(0).padEnd(6)];
  for (const [name, o] of Object.entries(S)) {
    const e = P.pushApart(Object.assign({}, o, { mode: 'real' }));
    const r = refHill(Object.assign({}, o, { N: 20000 }));
    row.push(name + ' eng ' + e[o.side].toFixed(2) + (e.saturated ? 'S' : '') + (e.stalled ? '!' : '') + ' ref ' + r[o.side].toFixed(2));
  }
  console.log(row.join(' | '));
}
