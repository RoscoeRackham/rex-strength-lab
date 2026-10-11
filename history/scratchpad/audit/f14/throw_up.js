// Vertical (90 deg) throw on yielding ground: engine anchor = constant (Nmax - W)/sin, which is 0 when the
// held weight already exceeds q*2A. Compare with a feet resistance that grows with sinking speed:
// RA(vA) = max(0, Nmax - W) + k rho (2A) vA^2. Comic constant force, RK4, k=0 reproduces engine.
const { P, D, g, S, T, ctx } = require('./common');
const O = Object.fromEntries(D.objects.map(o => [o.id, o]));
function sim(F, mA, mB, RB, R0, Aft, rho, k, d) {
  const f = (s) => [s[1], Math.max(0, F - R0 - k * rho * Aft * s[1] * s[1]) / mA * (F > R0 ? 1 : 0), s[3], Math.max(0, F - RB) / mB];
  let s = [0, 0, 0, 0]; const dt = 1e-7; let t = 0;
  while (s[0] + s[2] < d && t < 10) { const k1 = f(s), s2 = s.map((x, i) => x + 0.5 * dt * k1[i]), k2 = f(s2), s3 = s.map((x, i) => x + 0.5 * dt * k2[i]), k3 = f(s3), s4 = s.map((x, i) => x + dt * k3[i]), k4 = f(s4); s = s.map((x, i) => x + dt / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i])); t += dt; }
  return { vA: s[1], vB: s[3] };
}
const fmt = (x) => x.toPrecision(3);
for (const [sid, tid, oid] of [['sand', 'thing', 'car'], ['sand', 'spidey', 'car'], ['clay', 'thing', 'car']]) {
  const c = ctx(T[tid].liftKg, { surface: sid }); const obj = O[oid];
  const r = P.throwObject(c, obj, 90);
  const b = c.body, armMass = 2 * b.handEff, mB = obj.m + armMass, mA = b.m - armMass;
  const RB = mB * g; const R0 = r.anchor.R; const Aft = 2 * b.footArea;
  const e0 = sim(r.F, mA, mB, RB, R0, Aft, S[sid].rho, 0, b.strokes.throw);
  const e1 = sim(r.F, mA, mB, RB, R0, Aft, S[sid].rho, 1, b.strokes.throw);
  const e5 = sim(r.F, mA, mB, RB, R0, Aft, S[sid].rho, 0.5, b.strokes.throw);
  console.log(`${sid} ${tid} ${oid} 90deg: F ${fmt(r.F)} anchor R ${fmt(R0)} (${r.anchor.limit}) | engine obj v ${fmt(r.v)} recoil ${fmt(r.recoilV)} | my k=0 obj v ${fmt(e0.vB)} recoil ${fmt(e0.vA)} | k=0.5 obj v ${fmt(e5.vB)} recoil ${fmt(e5.vA)} | k=1 obj v ${fmt(e1.vB)} recoil ${fmt(e1.vA)} | apex engine ${fmt(r.flight.apex)} m`);
}
