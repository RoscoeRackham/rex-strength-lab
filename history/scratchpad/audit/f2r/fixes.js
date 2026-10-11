// Compare candidate fixes: (1) momentum-conserving lock only, (2) lock + optimal push (clamp to ground limit),
// (3) Poncelet ground + lock (+ best-of RB/F). Check monotonicity and Statue-of-Liberty threshold with drag flight.
const P = require('/home/user/dino-strength-sim/src/engine.js');
global.window = {}; require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g, body = P.makeBody({});
const S = (id) => D.surfaces.find(s => s.id === id);
const T = Object.fromEntries(D.tiers.map(t => [t.id, t.liftKg]));
const mA = body.m - body.feetMass, mB = body.feetMass, d = body.strokes.leg, A = 2 * body.footArea;
const cf = P.MUSCLE.jump.comicFrac;
const apexOf = (v) => P.fly({ v0: v, thetaDeg: 90, h0: 0, m: body.m, A: body.topArea, Cd: body.Cd });
function vLockConst(Fj, RB) { const r = P.pushApart({ F: Fj, d, mA, mB, RA: mA * g, RB, mode: 'comic' }); return P.momentumToV(Math.max(0, r.pA - r.pB), body.m); }
function vClamp(Fj, RB) { return vLockConst(Math.min(Fj, RB), RB); }
const lncosh = (z) => z > 20 ? z - Math.LN2 + Math.log1p(Math.exp(-2*z)) : Math.log(Math.cosh(z));
function vPon(Fj, surf, k = 1) {
  const fA = Fj - mA * g, f0 = Fj - A * surf.qult; if (fA <= 0) return 0;
  if (f0 <= 0) { const t = Math.sqrt(2 * d * mA / fA); return fA * t / body.m; }
  const c = A * k * surf.rho, vt = Math.sqrt(f0 / c), tau = mB / Math.sqrt(f0 * c);
  const xs = (t) => vt * tau * lncosh(t / tau) + fA * t * t / (2 * mA);
  let lo = 0, hi = 1; while (xs(hi) < d) hi *= 2; for (let i = 0; i < 300; i++) { const m = 0.5*(lo+hi); if (xs(m) < d) lo = m; else hi = m; }
  return Math.max(0, fA * hi - mB * vt * Math.tanh(hi / tau)) / body.m;
}
const vPonBest = (Fj, surf) => Math.max(vPon(Fj, surf), vPon(Math.min(Fj, A * surf.qult), surf));
// brute-force check that best-of(RB,F) equals the running max
for (const sid of ['sand','concrete']) { const s = S(sid); let run = 0, worst = 0; for (let e = 2.5; e < 14; e += 0.005) { const Fj = 10**e*g*cf; const v = vPon(Fj, s); run = Math.max(run, v); worst = Math.max(worst, Math.abs(run - vPonBest(Fj, s)) / run); } console.log(sid, 'max rel diff running-max vs best-of(RB,F):', worst.toExponential(2)); }
for (const sid of ['sand','concrete','granite']) {
  const s = S(sid), RB = A * s.qult;
  console.log('\n==', sid, 'RB', RB.toExponential(3), 'N; ground-limit lift kg', (RB / cf / g).toExponential(3));
  for (const [lbl, kg] of [['spidey', T.spidey], ['thing', T.thing], ['1e6', 1e6], ['secretwars', T.secretwars]]) {
    const Fj = kg * g * cf; const eng = P.jump({ F: kg * g, mode: 'comic', body, surface: s, groundHolds: false, anchor: 'friction' });
    const a = vLockConst(Fj, RB), b = vClamp(Fj, RB), c = vPonBest(Fj, s);
    console.log(lbl.padEnd(10), 'engine v', eng.v.toPrecision(4), 'apex', eng.flight.apex.toPrecision(4), '| lock-only v', a.toPrecision(3), '| lock+clamp v', b.toPrecision(4), 'apex', apexOf(b).apex.toPrecision(4), '| Poncelet(best) v', c.toPrecision(4), 'apex', (c > 0.01*P.K.c ? 'REL' : apexOf(c).apex.toPrecision(4)));
  }
  for (const [name, fn] of [['clamp', (kg) => vClamp(kg*g*cf, RB)], ['poncelet', (kg) => vPonBest(kg*g*cf, s)]]) {
    const pred = (kg) => { const v = fn(kg); if (v > 0.01 * P.K.c) return true; const f = apexOf(v); return f.apex >= 93 || f.escaped; };
    let segs = [], prev = null, st = null; for (let e = 1; e <= 20.0001; e += 0.02) { const p = pred(10**e); if (p !== prev) { if (prev === true) segs.push([st, e]); if (p) st = e; prev = p; } } if (prev) segs.push([st, 20]);
    console.log('  ', name, 'Statue predicate true segments (log10 kg):', segs.map(x => x.map(y => y.toFixed(2)).join('..')).join(', ') || 'never');
  }
}
