const { P, ctx } = require('./common.js');
// Reference ground work for the real-mode jump: W_ground = ∫ (RB + cB vB^2) vB dt, via fine RK4 (non-stiff strengths).
function refJump(F0, d, mA, mB, RA, RB, cB, vmax) {
  const k = 0.25, hill = (u) => u <= 0 ? 1 : u >= 1 ? 0 : (1 - u) / (1 + u / k);
  let xA = 0, xB = 0, vA = 0, vB = 0, W = 0, Wleg = 0; const dt = 2e-8;
  const acc = (vA, vB) => { const F = F0 * hill((vA + vB) / vmax); return [(vA > 0 || F > RA) ? (F - RA) / mA : 0, (vB > 0 || F > RB) ? (F - RB - cB * vB * vB) / mB : 0, F]; };
  while (xA + xB < d) {
    const a = acc(vA, vB);
    const nvA = Math.max(0, vA + a[0] * dt), nvB = Math.max(0, vB + a[1] * dt);
    const dxB = 0.5 * (vB + nvB) * dt;
    W += (RB + cB * vB * vB) * dxB; Wleg += a[2] * dxB;
    xA += 0.5 * (vA + nvA) * dt; xB += dxB; vA = nvA; vB = nvB;
  }
  return { W, Wleg, xB, vA };
}
for (const [surface, lg] of [['concrete', 4.958], ['concrete', 6], ['gravel', 4.958], ['softclay', 4]]) {
  const c = ctx({ kg: Math.pow(10, lg), mode: 'real', surface });
  const r = P.jump(c), b = c.body;
  const RB = r.groundLimitForce, cB = c.surface.rho * 2 * b.footArea;
  const ref = refJump(r.F, b.strokes.leg, b.m - b.feetMass, b.feetMass, (b.m - b.feetMass) * P.K.g, RB, cB, 12);
  console.log(surface, '1e' + lg, 'engine Eground', r.Eground.toFixed(0), 'J, sink', (r.push.xB * 100).toFixed(2), 'cm | ref ground work', ref.W.toFixed(0), 'J, leg work on feet', ref.Wleg.toFixed(0), 'J, sink', (ref.xB * 100).toFixed(2), 'cm, lower bound RB*xB', (RB * ref.xB).toFixed(0));
}
