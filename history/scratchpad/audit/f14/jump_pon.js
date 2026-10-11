// Independent jump-on-yielding-ground model. Leg force F (comic: constant) pushes body A (mA, up, gravity)
// and feet B (mB, down) apart over stroke d. Ground on feet: static up to qA, once moving R = A(q + k rho vB^2).
// RK4 with tiny fixed step; take-off speed = body momentum / total mass (same rule as engine: v = pA/m).
// k = 0 must reproduce the engine (validation); k = 0.5, 1 = velocity-dependent resistance.
const { P, D, g, S, T, ctx } = require('./common');
function sim(F, body, surf, k) {
  const mB = body.feetMass, mA = body.m - mB, A = 2 * body.footArea, d = body.strokes.leg, q = surf.qult, rho = surf.rho;
  const feetMove = F > q * A; // engine criterion (RB = qA, feet gravity ignored as in engine)
  const f = (s) => { // s = [xA, vA, xB, vB]
    const aA = (F - mA * g) / mA;
    const aB = feetMove ? (F - A * (q + k * rho * s[3] * s[3])) / mB : 0;
    return [s[1], aA, s[3], aB];
  };
  // time scale
  const vfT = feetMove ? Math.sqrt((F - q * A) / (Math.max(k, 1e-12) * rho * A)) : 0;
  const tGuess = Math.min(Math.sqrt(2 * d * mB / Math.max(F - q * A, 1e-9)) + (k > 0 ? d / vfT : 0), Math.sqrt(2 * d * mA / (F - mA * g)));
  const dt = tGuess / 2e5;
  let s = [0, 0, 0, 0], t = 0;
  while (s[0] + s[2] < d) {
    const k1 = f(s), s2 = s.map((x, i) => x + 0.5 * dt * k1[i]), k2 = f(s2), s3 = s.map((x, i) => x + 0.5 * dt * k2[i]), k3 = f(s3), s4 = s.map((x, i) => x + dt * k3[i]), k4 = f(s4);
    s = s.map((x, i) => x + dt / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i])); t += dt;
  }
  return { v: mA * s[1] / body.m, sink: s[2], vFeet: s[3], t, groundReactionEnd: feetMove ? A * (q + k * rho * s[3] * s[3]) : null };
}
const fmt = (x) => x.toPrecision(3);
for (const sid of ['sand', 'clay', 'asphalt', 'concrete']) for (const kg of [T.spidey.liftKg, T.thing.liftKg, 1e6]) {
  const c = ctx(kg, { surface: sid });
  const r = P.jump(c);
  if (!r.groundFails) { console.log(`${sid.padEnd(8)} lift ${fmt(kg)} kg: ground holds, engine v ${fmt(r.v)} (not affected)`); continue; }
  const s0 = sim(r.F, c.body, S[sid], 0), s5 = sim(r.F, c.body, S[sid], 0.5), s1 = sim(r.F, c.body, S[sid], 1);
  const ap = (v) => P.fly({ v0: v, thetaDeg: 90, h0: 0, m: c.body.m, A: c.body.topArea, Cd: c.body.Cd }).apex;
  console.log(`${sid.padEnd(8)} lift ${fmt(kg)} kg F ${fmt(r.F)} N groundLimit ${fmt(r.groundLimitForce)} N | engine v ${fmt(r.v)} apex ${fmt(r.flight.apex)} m sink ${fmt(r.sink)} | my k=0 v ${fmt(s0.v)} | k=0.5 v ${fmt(s5.v)} apex ${fmt(ap(s5.v))} sink ${fmt(s5.sink)} | k=1 v ${fmt(s1.v)} apex ${fmt(ap(s1.v))} sink ${fmt(s1.sink)} vFeet ${fmt(s1.vFeet)} (v*=${fmt(Math.sqrt(S[sid].qult / S[sid].rho))}) ground reaction at end ${fmt(s1.groundReactionEnd)} N | speed ratio k=.5 ${fmt(s5.v / r.v)} k=1 ${fmt(s1.v / r.v)}; apex ratio k=.5 ${fmt(ap(s5.v) / r.flight.apex)} k=1 ${fmt(ap(s1.v) / r.flight.apex)}`);
}
