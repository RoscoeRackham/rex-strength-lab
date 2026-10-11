const { P, g, ctx, obj } = require('./lib.js');
// independent reference integrator: same ODE, adaptive tiny steps limited by velocity change
function ref(o) {
  const { F: F0, d, mA, mB, vmax } = o; const k = 0.25;
  const RA = o.RA == null ? 0 : o.RA, RB = o.RB == null ? 0 : o.RB;
  const aFree = isFinite(RA), bFree = isFinite(RB);
  const hill = (u) => u <= 0 ? 1 : u >= 1 ? 0 : (1 - u) / (1 + u / k);
  let xA = 0, xB = 0, vA = 0, vB = 0, t = 0;
  const acc = (vA_, vB_) => { const F = F0 * hill((vA_ + vB_) / vmax); let aA = 0, aB = 0;
    if (aFree && (vA_ > 0 || F > RA)) aA = (F - RA) / mA; if (bFree && (vB_ > 0 || F > RB)) aB = (F - RB) / mB; return [aA, aB]; };
  for (let i = 0; i < 5e7 && xA + xB < d; i++) {
    const [aA, aB] = acc(vA, vB);
    const amax = Math.max(Math.abs(aA), Math.abs(aB), 1e-12);
    let dt = Math.min(1e-3 * vmax / amax, 1e-4 * d / Math.max(vA + vB, 1e-9), 1e-3);
    const [a2A, a2B] = acc(Math.max(0, vA + 0.5 * dt * aA), Math.max(0, vB + 0.5 * dt * aB));
    const nvA = Math.max(0, vA + dt * a2A), nvB = Math.max(0, vB + dt * a2B);
    // land exactly on the stroke end
    const dx = 0.5 * (vA + nvA) * dt + 0.5 * (vB + nvB) * dt;
    if (xA + xB + dx > d && dx > 0) { const f = (d - xA - xB) / dx; xA += 0.5 * (vA + nvA) * dt * f; xB += 0.5 * (vB + nvB) * dt * f; vA += (nvA - vA) * f; vB += (nvB - vB) * f; t += dt * f; break; }
    xA += 0.5 * (vA + nvA) * dt; xB += 0.5 * (vB + nvB) * dt; vA = nvA; vB = nvB; t += dt;
    if (vA === 0 && vB === 0 && i > 1000) break;
  }
  return { vA, vB, xA, xB, t };
}
const body = P.makeBody({});
const cases = [
  ['shot 511kg', { F: 511 * g * 0.3, d: body.strokes.throw, mA: body.m - body.handEff, mB: 7.26 + body.handEff, RA: Infinity, RB: 0, vmax: 55 }],
  ['punch 511kg', { F: 511 * g * 0.3, d: body.strokes.punch, mA: body.m - body.handEff, mB: body.handEff, RA: 1412, RB: 0, vmax: 17 }],
  ['jump 511kg', { F: 511 * g, d: body.strokes.leg, mA: body.m - body.feetMass, mB: body.feetMass, RA: (body.m - body.feetMass) * g, RB: Infinity, vmax: 30 }],
  ['punch 1e5kg', { F: 1e5 * g * 0.3, d: body.strokes.punch, mA: body.m - body.handEff, mB: body.handEff, RA: 1412, RB: 0, vmax: 17 }],
  ['punch 3e6kg', { F: 3e6 * g * 0.3, d: body.strokes.punch, mA: body.m - body.handEff, mB: body.handEff, RA: 1412, RB: 0, vmax: 17 }],
  ['punch 1e8kg', { F: 1e8 * g * 0.3, d: body.strokes.punch, mA: body.m - body.handEff, mB: body.handEff, RA: 1412, RB: 0, vmax: 17 }],
  ['jump 1e9kg', { F: 1e9 * g, d: body.strokes.leg, mA: body.m - body.feetMass, mB: body.feetMass, RA: (body.m - body.feetMass) * g, RB: Infinity, vmax: 30 }],
];
for (const [name, o] of cases) {
  const e = P.pushApart(Object.assign({ mode: 'real' }, o));
  const r = ref(o);
  console.log(name.padEnd(12), '| engine vA', e.vA.toFixed(4), 'vB', e.vB.toFixed(4), 'stalled', e.stalled, 'sat', e.saturated, '| reference vA', r.vA.toFixed(4), 'vB', r.vB.toFixed(4));
}
