// The brief's figures for item 5 (a person thrown 30 m at 45°, default dial, 3,000 kg Rex), on this branch's engine.
// Run: node figures.js [path to rex-strength-lab]
global.window = {};
const ROOT = process.argv[2] || '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(ROOT + '/src/engine.js');
require(ROOT + '/src/data.js');
const D = window.DINO_DATA, g = P.K.g, R = P.RESTRAINT, M = R.MOVES;
const sf = (id) => D.surfaces.find((s) => s.id === id), ob = (id) => D.objects.find((o) => o.id === id);
const sig = (x, n = 3) => (typeof x !== 'number' || !isFinite(x) ? String(x) : Number(x.toPrecision(n)));
const kgf = (u) => (u === undefined ? 'all-out' : sig(u / g, 4) + ' kg-force');
const F0 = 100 * 907.18474 * g;
const POW = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const OFF4 = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
const body = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex });
console.log('Rex', body.m, 'kg');
const person = ob('person');
function run(label, pw, sp) {
  const c = Object.assign({ F: F0, mode: 'comic', body, surface: sf('concrete'), anchor: 'friction', safePassenger: sp }, pw);
  const p = R.planNow('throw', c, { near: 5, target: 30, obj: person, angle: 45, safePassenger: sp, silentStrike: false, softLanding: false });
  const gl = p.goal(), ce = p.ceiling();
  // the page's least disruptive: the goal's effort unless a hazard happens there, then held at the ceiling
  let use = gl.reached ? gl.use : undefined, capped = false;
  const rG = p.run(use);
  if (R.HAZARDS.some((h) => h.test(M.throw, rG, p.opt))) { use = ce.below > 0 ? ce.below : p.lo; capped = true; }
  const r = p.run(use), A = p.run(undefined);
  const onset = ce.by ? Math.sqrt(ce.below * ce.use) : null;
  const pl = M.throw.passengerLanding(r, p.opt), plA = M.throw.passengerLanding(A, p.opt);
  const shakeA = M.throw.shake(A, p.opt);
  const side = (x) => ({ v: sig(x.v), range: sig(x.flight.range), vImpact: sig(x.flight.vImpact), fall_m: sig(x.flight.vImpact ** 2 / (2 * g)), Eimpact_J: sig(x.Eimpact), launch: M.throw.passengerLaunch(x, p.opt), drag: M.throw.passengerDrag(x, p.opt), hazard: M.throw.passenger(x, p.opt) });
  console.log(JSON.stringify({ label, least: kgf(use), leastPct: sig(100 * (use || F0) / F0), capped, atLeast: side(r), passengerLanding: pl && { absorbed: sig(pl.absorbed), J: sig(pl.J) },
    ceiling: ce.by ? ce.by + ' use ' + kgf(ce.use) + ', below ' + kgf(ce.below) + ', onset ' + kgf(onset) + ' (' + sig(100 * onset / F0) + '%)' : 'none',
    allout: side(A), alloutLanding: plA && { absorbed: sig(plA.absorbed), J: sig(plA.J) }, alloutPlasterReach_m: sig(P.plasterReach(shakeA)), blastLandAllOut: M.throw.blastParts(A, p.opt).land,
    presets: p.presets().map((x) => x.id + ': ' + (x.never ? 'never' : x.onlyUnlimited ? 'unlimited' : kgf(x.use))).join(', ') }));
}
run('four on, Safe passenger on', POW, true);
run('four on, Safe passenger off', POW, false);
run('four off, Safe passenger on', OFF4, true);
run('four off, Safe passenger off', OFF4, false);
// the landing's pulse at the least effort (switch on)
{
  const c = Object.assign({ F: F0, mode: 'comic', body, surface: sf('concrete'), anchor: 'friction', safePassenger: true, use: 3342 * g }, POW);
  const r = P.throwObject(c, person, 45), o = Object.assign({ obj: person, angle: 45, near: 5, surface: sf('concrete'), body, safePassenger: true }, POW);
  const ls = M.throw.landShake(r, o), L = Math.cbrt(6 * person.m / (Math.PI * person.rho));
  console.log('landing at 3,342 kg-force: L', sig(L), 'm; pulse', sig(ls.T), 's; F·T/2', sig(ls.F * ls.T / 2), 'kg m/s; mean stop', sig(r.flight.vImpact / ls.T / g), 'g; ppv 5 m', sig(P.ppvAt(ls, 5) * 1000), 'mm/s');
}
