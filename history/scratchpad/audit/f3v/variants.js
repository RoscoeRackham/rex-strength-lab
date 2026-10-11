// Scratch copies of pushApartHill with candidate fixes; compare against refHill across strengths.
global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA; const { refHill } = require('./ref.js'); const g = P.K.g; const hill = P.hill;
const S = Object.fromEntries(D.surfaces.map(s => [s.id, s])); const O = Object.fromEntries(D.objects.map(o => [o.id, o]));
function make(variant) {
  return function (o) {
    const { d, mA, mB, vmax } = o; const F0 = o.F; const k = 0.25;
    const RA = o.RA == null ? 0 : o.RA, RB = o.RB == null ? 0 : o.RB;
    const aFree = isFinite(RA), bFree = isFinite(RB);
    const inertialScale = Math.max(mA, mB) * vmax * vmax / d + (aFree ? RA : 0) + (bFree ? RB : 0);
    const satK = variant.sat;
    if (!isFinite(F0) || F0 > satK * inertialScale) {
      let vA = 0, vB = 0;
      if (aFree && bFree) { vB = vmax * mA / (mA + mB); vA = vmax * mB / (mA + mB); } else if (bFree) vB = vmax; else if (aFree) vA = vmax;
      return { vA, vB, sat: true, steps: 0 };
    }
    let xA = 0, xB = 0, vA = 0, vB = 0, t = 0;
    const mMove = Math.min(aFree ? mA : Infinity, bFree ? mB : Infinity);
    const tComic = Math.sqrt(2 * d * Math.min(mA, mB) / Math.max(F0, 1e-9));
    const tEst = Math.max(tComic, d / vmax);
    let dt0 = tEst / 4000;
    if (variant.dtFixed) dt0 = Math.min(dt0, variant.dtFixed * vmax * mMove / F0);
    const maxSteps = variant.maxSteps || 400000;
    const acc = (vA_, vB_) => { const F = F0 * hill((vA_ + vB_) / vmax, k); let aA = 0, aB = 0;
      if (aFree && (vA_ > 0 || F > RA)) aA = (F - RA) / mA; if (bFree && (vB_ > 0 || F > RB)) aB = (F - RB) / mB; return [aA, aB]; };
    let steps = 0;
    while (xA + xB < d && steps < maxSteps) {
      const [a1A, a1B] = acc(vA, vB);
      let dt = dt0;
      if (variant.adaptive) dt = Math.min(dt0, variant.adaptive * vmax / Math.max(Math.abs(a1A) + Math.abs(a1B), 1e-30));
      const mvA = Math.max(0, vA + 0.5 * dt * a1A), mvB = Math.max(0, vB + 0.5 * dt * a1B);
      const [a2A, a2B] = acc(mvA, mvB);
      const nvA = Math.max(0, vA + dt * a2A), nvB = Math.max(0, vB + dt * a2B);
      xA += 0.5 * (vA + nvA) * dt; xB += 0.5 * (vB + nvB) * dt; vA = nvA; vB = nvB; t += dt; steps++;
      if (vA === 0 && vB === 0 && steps > 10) break;
    }
    return { vA, vB, sat: false, steps, incomplete: xA + xB < d * 0.999 };
  };
}
const variants = {
  engine: { sat: 1e6 },
  auditorFix: { sat: 1e3, dtFixed: 0.05 },
  auditorFix_maxSteps2e6: { sat: 1e3, dtFixed: 0.05, maxSteps: 2e6 },
  adaptive5pct: { sat: 1e6, adaptive: 0.05 },
  adaptive1pct: { sat: 1e6, adaptive: 0.01 },
};
function cases(H, kg, surf) {
  const b = P.makeBody({ H, m: 180 * Math.pow(H / 2, 3) }); const su = S[surf];
  const anc0 = P.anchorCapacity({ body: b, surface: su, theta: 0, anchor: 'friction', groundHolds: false });
  const thr = (obj, th) => { const t = th * Math.PI / 180, whip = obj.m <= 1, hands = obj.m > 20 ? 2 : 1, arm = hands * (whip ? b.whipEff : b.handEff), mB = obj.m + arm;
    const anc = P.anchorCapacity({ body: b, surface: su, theta: t, anchor: 'friction', groundHolds: false, extraMass: obj.m });
    return { F: kg * g * 0.3, d: whip ? b.strokes.whip : b.strokes.throw, mA: b.m - arm, mB, RA: anc.R, RB: mB * g * Math.sin(t), vmax: 55 * b.s, side: 'vB' }; };
  return {
    punch: { F: kg * g * 0.3, d: b.strokes.punch, mA: b.m - b.handEff, mB: b.handEff, RA: anc0.R, RB: 0, vmax: 17 * b.s, side: 'vB' },
    clap: { F: kg * g * 0.3, d: b.strokes.clap, mA: b.m, mB: b.handEff, RA: Infinity, RB: 0, vmax: 17 * b.s, side: 'vB' },
    stomp: { F: kg * g * 0.5, d: b.strokes.stomp, mA: b.m - b.legEff, mB: b.legEff, RA: (b.m - b.legEff) * g, RB: 0, vmax: 16 * b.s, side: 'vB' },
    jump: { F: kg * g, d: b.strokes.leg, mA: b.m - b.feetMass, mB: b.feetMass, RA: (b.m - b.feetMass) * g, RB: su.qult * 2 * b.footArea, vmax: 30 * b.s, side: 'vA' },
    baseball: thr(O.baseball, 0), shot: thr(O.shot, 37), car: thr(O.car, 45),
  };
}
const H = +(process.argv[2] || 2), surf = process.argv[3] || 'concrete';
const stats = {};
for (let lg = 3; lg <= 13.5; lg += 0.25) {
  const kg = Math.pow(10, lg);
  for (const [act, o] of Object.entries(cases(H, kg, surf))) {
    const r = refHill(o); const truth = r[o.side];
    for (const [vn, v] of Object.entries(variants)) {
      const t0 = process.hrtime.bigint(); const e = make(v)(o); const ms = Number(process.hrtime.bigint() - t0) / 1e6;
      const err = truth > 1e-9 ? Math.abs(e[o.side] - truth) / truth : Math.abs(e[o.side]);
      const key = vn + '|' + act; const s = stats[key] || (stats[key] = { maxErr: 0, at: null, maxSteps: 0, maxMs: 0, incomplete: 0 });
      if (err > s.maxErr) { s.maxErr = err; s.at = lg; s.eng = e[o.side]; s.ref = truth; }
      s.maxSteps = Math.max(s.maxSteps, e.steps); s.maxMs = Math.max(s.maxMs, ms); if (e.incomplete) s.incomplete++;
    }
  }
}
console.log(`H=${H} m, ${surf}; sweep 10^3..10^13.5 kg lift, step 0.25 decade`);
for (const [k, s] of Object.entries(stats)) console.log(k.padEnd(34), 'maxRelErr', (100 * s.maxErr).toFixed(2).padStart(7) + '%', 'at 10^' + s.at, `(got ${s.eng && s.eng.toFixed(3)} vs ref ${s.ref && s.ref.toFixed(3)})`, 'maxSteps', s.maxSteps, 'maxMs', s.maxMs.toFixed(1), 'truncated', s.incomplete);
