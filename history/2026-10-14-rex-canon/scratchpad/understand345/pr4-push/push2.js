// A sketch of pushMatch with ownRecoil (PR4), for numbers only: each push is real on the other, its push back absorbed.
const { P, g, ON, OFF, DIAL, sig, rex, ollie, surf, ctxOf } = require('./common.js');
const K = P.K;
const footing = (c) => P.anchorCapacity({ body: c.body, surface: c.surface, theta: 0, anchor: c.anchor, groundHolds: P.holdsGround(c) });
const slide = (v, R, b) => { if (!(v > 0)) return 0; if (v > 0.01 * K.c) return Infinity; if (!isFinite(R)) return 0; const k = 0.5 * K.rho0 * b.Cd * b.frontArea; return b.m / (2 * k) * Math.log1p(k * v * v / R); };
function match(cA, cB, stroke) {
  const A = cA.body, B = cB.body, fA = footing(cA), fB = footing(cB);
  const bolt = (c) => c.anchor === 'bolted';
  const mvA = P.moveCheck(cA.F, A.m), mvB = P.moveCheck(cB.F, B.m);
  const HA = bolt(cA) ? Infinity : mvA.stand ? Math.min(cA.F, fA.R) : fA.R, HB = bolt(cB) ? Infinity : mvB.stand ? Math.min(cB.F, fB.R) : fB.R;
  const DA = mvA.stand ? cA.F : 0, DB = mvB.stand ? cB.F : 0;   // the push: his effort, uncapped by his grip (its push back goes to his source)
  const aWins = DA > HB, bWins = DB > HA;
  if (aWins && bWins) {
    // both shoved apart over the stroke: A by B's push less his footing, B by A's push less his
    const nA = DB - fA.R, nB = DA - fB.R, aA = nA / A.m, aB = nB / B.m;
    const t = Math.sqrt(2 * stroke / (aA + aB));
    const vA = aA * t, vB = aB * t;
    return { outcome: 'bothShoved', DA, DB, HA, HB, t, vA, vB, slideA: slide(vA, fA.R, A), slideB: slide(vB, fB.R, B) };
  }
  if (aWins || bWins) {
    const w = aWins ? 'A' : 'B', cw = aWins ? cA : cB, cl = aWins ? cB : cA, Dw = aWins ? DA : DB, Hl = aWins ? HB : HA, Dl = aWins ? DB : DA, Rw = aWins ? fA.R : fB.R;
    const aLoser = (Dw - Hl) / cl.body.m, aFeet = (Rw - Dl) / cw.body.m;
    return { outcome: bolt(cw) ? 'shovedOff' : 'walkOut', winner: w, aLoser, aFeet, accel: Math.min(aLoser, aFeet) };
  }
  return { outcome: 'deadlock', DA, DB, HA, HB };
}
const need = (m) => P.W8.WALK_LOAD * m * g / P.MUSCLE.jump.forceFrac;
const stroke = rex.strokes.throw;
console.log('stroke (strokes.throw)', stroke);
for (const F of [need(3000), 5e4, 9e4, 2e5, DIAL]) {
  const cR = ctxOf(F, ON, rex), cO = ctxOf(F, ON, ollie);
  const r = match(cR, cO, stroke);
  console.log('F', sig(F), 'kgf', sig(F / g), JSON.stringify(r, (k, v) => typeof v === 'number' ? sig(v) : v));
}
// effort where the slide reaches 5 m
let lo = need(3000), hi = DIAL;
for (let i = 0; i < 60; i++) { const mid = Math.sqrt(lo * hi); const r = match(ctxOf(mid, ON, rex), ctxOf(mid, ON, ollie), stroke); if (Math.max(r.slideA, r.slideB) > 5) hi = mid; else lo = mid; }
console.log('slide 5 m at F', sig(lo), 'N =', sig(lo / g), 'kgf');
// unequal: Ollie at 1,000 kg-force (can't stand), Rex at the dial
console.log('Ollie 1000 kgf', JSON.stringify(match(ctxOf(DIAL, ON, rex), ctxOf(1000 * g, ON, ollie), stroke), (k, v) => typeof v === 'number' ? sig(v) : v));
console.log('Ollie 2200 kgf (stands, push 21.6 kN)', JSON.stringify(match(ctxOf(DIAL, ON, rex), ctxOf(2200 * g, ON, ollie), stroke), (k, v) => typeof v === 'number' ? sig(v) : v));
console.log('Rex bolted', JSON.stringify(match(ctxOf(DIAL, Object.assign({}, ON, { anchor: 'bolted' }), rex), ctxOf(DIAL, ON, ollie), stroke), (k, v) => typeof v === 'number' ? sig(v) : v));
// timing of today's pushMatch
let t0 = process.hrtime.bigint(); for (let i = 0; i < 2000; i++) P.pushMatch(ctxOf(DIAL * (1 + i * 1e-6), ON, rex), ctxOf(DIAL, ON, ollie)); console.log('pushMatch today', Number(process.hrtime.bigint() - t0) / 2000 / 1e3, 'us/call');
t0 = process.hrtime.bigint(); for (let i = 0; i < 2000; i++) match(ctxOf(DIAL * (1 + i * 1e-6), ON, rex), ctxOf(DIAL, ON, ollie), stroke); console.log('sketch', Number(process.hrtime.bigint() - t0) / 2000 / 1e3, 'us/call');
t0 = process.hrtime.bigint(); for (let i = 0; i < 2000; i++) P.standoff(ctxOf(DIAL * (1 + i * 1e-6), ON, ollie), ctxOf(DIAL, ON, rex)); console.log('standoff today', Number(process.hrtime.bigint() - t0) / 2000 / 1e3, 'us/call');
t0 = process.hrtime.bigint(); for (let i = 0; i < 2000; i++) P.armWrestle(ctxOf(DIAL * (1 + i * 1e-6), ON, rex), ctxOf(DIAL, ON, ollie)); console.log('armWrestle today', Number(process.hrtime.bigint() - t0) / 2000 / 1e3, 'us/call');
// gravel walk-out
{
  const gr = surf('gravel');
  const r = match(ctxOf(DIAL, Object.assign({}, ON, { surface: gr }), rex), ctxOf(2200 * g, Object.assign({}, ON, { surface: gr }), ollie), stroke);
  console.log('gravel, Rex dial vs Ollie 2,200 kgf', JSON.stringify(r, (k, v) => typeof v === 'number' ? sig(v) : v), 'Ollie push', sig(2200 * g), 'Rex grip', sig(gr.mu * 3000 * g));
  const today = P.pushMatch(ctxOf(DIAL, Object.assign({}, ON, { surface: gr }), rex), ctxOf(2200 * g, Object.assign({}, ON, { surface: gr }), ollie));
  console.log('  main today', today.outcome, today.winner, sig(today.accel), sig(today.t), sig(today.v));
  const today2 = P.pushMatch(ctxOf(DIAL, ON, rex), ctxOf(1000 * g, ON, ollie));
  console.log('concrete Ollie 1,000 kgf main today', today2.outcome, sig(today2.contact));
}
// infinite
console.log('inf', JSON.stringify(match(ctxOf(Infinity, ON, rex), ctxOf(Infinity, ON, ollie), stroke)));
