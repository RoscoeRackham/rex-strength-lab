// Independent check: body A (up +) and feet B, internal leg force F while extension s < d,
// at s >= d a stiff spring-damper (leg lock). Ground: plastic, resists feet moving down with up to RB,
// cannot pull. Gravity on both. Integrate until the system leaves the ground or comes to rest.
const P = require('/home/user/dino-strength-sim/src/engine.js');
const g = P.K.g; const body = P.makeBody({});
const mA = body.m - body.feetMass, mB = body.feetMass, d = body.strokes.leg, m = body.m;
function sim(F, RB) {
  let yA = 0, vA = 0, yB = 0, vB = 0, t = 0; // yB: feet position (up +)
  const kLock = 1e4 * Math.max(F, 1e5) / d * 50, cLock = 2 * Math.sqrt(kLock * mB) * 2;
  const tEst = Math.sqrt(2 * d * mB / F); let dt = Math.min(tEst, 0.01) / 20000;
  let phase = 'push', tEnd = null;
  for (let i = 0; i < 4e7; i++) {
    const s = yA - yB, sdot = vA - vB;
    let fInt = s < d ? F : 0;              // muscle pushes until full extension
    if (s > d) fInt -= kLock * (s - d) + cLock * sdot; // lock (tension when stretched past d)
    let fA = fInt - mA * g;
    let fB = -fInt - mB * g;
    // ground on feet: plastic, up to RB upward when feet are pressed down or moving down; no pull
    let N = 0;
    if (yB <= 0 && (vB < 0 || fB < 0)) { N = Math.min(RB, -fB - mB * vB / dt); N = Math.max(0, N); if (vB < 0) N = RB; }
    if (yB > 0 || vB > 0) N = 0;
    fB += N;
    vA += fA / mA * dt; vB += fB / mB * dt; yA += vA * dt; yB += vB * dt; t += dt;
    if (yB > 1e-9 && vB > 0 && Math.abs(vA - vB) < 1e-3 * Math.abs(vA)) { phase = 'airborne'; break; }
    if (t > 50 * tEst && Math.abs(vA) < 1e-4 && Math.abs(vB) < 1e-4) { phase = 'rest'; break; }
  }
  const vcm = (mA * vA + mB * vB) / m;
  return { phase, vcm, vA, vB, sink: -yB, t };
}
const RB = 10e6 * 2 * body.footArea; // concrete
for (const kg of [2e5, 1e6, 1e7]) {
  const F = P.MUSCLE.jump.comicFrac * kg * g;
  const r = sim(F, RB);
  const j = P.jump({ F: kg * g, mode: 'comic', body, surface: { qult: 10e6 }, groundHolds: false });
  console.log(kg.toExponential(1), 'sim:', r.phase, 'v_cm', r.vcm.toFixed(3), 'sink', r.sink.toFixed(3),
    '| engine v', j.v.toFixed(2), '| (pA-pB)/m', ((j.push.pA - j.push.pB) / m).toFixed(3));
}
