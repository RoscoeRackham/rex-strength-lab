// The old and new results quoted in BRIEF-canon.md. Run from rex-strength-lab/:
//   node research/brief-canon/runs.js > research/brief-canon/runs.json
// "Old" is the engine as it is. "New" changes this process's copy of the engine only, to show what each canon change
// would give before anyone builds it: the 3,000 kg bodies (BUILDS kV), the recoil's push going to their source (the
// throw's and pull's ground shaking), Safe passenger on. Nothing in the repository is changed.
// Unless a case says otherwise: the default 10 ft Rex, concrete, comic muscle, standing (friction), the four default
// powers on, people 5 m away, the page's default dial (100 short tons).
global.window = {};
const path = require('path');
const root = path.resolve(process.argv[2] || path.join(__dirname, '..', '..'));
const P = require(path.join(root, 'src', 'engine.js'));
require(path.join(root, 'src', 'data.js'));
const D = window.DINO_DATA;
const g = P.K.g, R = P.RESTRAINT;
const sf = (id) => D.surfaces.find((s) => s.id === id);
const ob = (id) => D.objects.find((o) => o.id === id);
const sig = (x, n = 3) => (typeof x !== 'number' ? String(x) : !isFinite(x) ? String(x) : Number(x.toPrecision(n)));
const kgf = (u) => (u === undefined ? 'all-out' : sig(u / g) + ' kg-force');
const ppv = (src, d) => (src ? P.ppvAt(src, d) * 1000 : 0);   // mm/s
const F0 = 100 * 907.18474 * g;                                // the page's default dial
const POW = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const OLD_KV = P.BUILDS.rex.kV, NEW_KV = 3000 / 1060 / Math.pow(3.048, 3);
const setMass = (isNew) => { P.BUILDS.rex.kV = P.BUILDS.ollie.kV = isNew ? NEW_KV : OLD_KV; };
const body = (b, m) => P.makeBody({ build: b, H: 3.048, m: m || 3007 });
const ctxOf = (m, extra) => Object.assign({ F: F0, mode: 'comic', body: body('rex', m), surface: sf('concrete'), anchor: 'friction' }, POW, extra || {});

// the page's least-disruptive effort (resolveEffort in app.html): the goal's effort, unless a hazard happens there;
// then just under the courtesy ceiling
function least(move, c, o) {
  const p = R.planNow(move, c, o), gl = p.goal(), want = gl.never || gl.onlyUnlimited ? undefined : gl.use;
  const rr = p.run(want), M = R.MOVES[move], ce = p.ceiling();
  if (!R.HAZARDS.some((h) => h.test(M, rr, p.opt))) return { p, use: want, r: rr, capped: false, ce };
  const use = ce.below > 0 ? ce.below : p.lo;
  return { p, use, r: p.run(use), capped: true, ce };
}
const ceilingText = (ce) => (ce.by ? ce.by + ' at ' + kgf(ce.use) : 'none');

// the new recoil rule, in this copy only: the push back goes to their source, so a throw's push and a pull's rope
// no longer reach the ground (what the planet kept was his recoil)
const oldThrowShake = R.MOVES.throw.shake, oldShakeFrom = R.MOVES.throw.shakeFrom, oldPullShake = R.MOVES.pull.shake;
function newRecoil(on) {
  R.MOVES.throw.shake = on ? (r, o) => (o.ownRecoil ? R.MOVES.throw.landShake(r, o) : oldThrowShake(r, o)) : oldThrowShake;
  R.MOVES.throw.shakeFrom = on ? (r, o) => (o.ownRecoil ? 'landing' : oldShakeFrom(r, o)) : oldShakeFrom;
  R.MOVES.pull.shake = on ? () => null : oldPullShake;
}

function throwRun(m, objId, extra, oExtra) {
  const o = Object.assign({ near: 5, target: 30, obj: ob(objId), angle: 45 }, oExtra || {});
  const c = ctxOf(m, extra), L = least('throw', c, o);
  const A = R.MOVES.throw.run(Object.assign({}, c, { use: undefined }), L.p.opt);
  const shakes = (r) => [].concat(R.MOVES.throw.shake(r, L.p.opt) || []).filter(Boolean);
  const own = (r) => (r.toGround && R.MOVES.throw.shake === oldThrowShake ? P.impulseSource(c.surface, r.toGround.J, Math.max(1e-9, r.toGround.T)) : null);
  const land = (r) => R.MOVES.throw.landShake(r, L.p.opt);
  const side = (r) => ({
    v: sig(r.v), range: sig(r.flight && r.flight.range), leaves: !!(r.flight && (r.flight.relativistic || r.flight.escaped || r.flight.orbit || !r.flight.landed)),
    toGroundJ: own(r) ? sig(r.toGround.J) : 0, toGroundSupplied: own(r) && r.toGround.supplied ? sig(r.toGround.supplied) : 0,
    ppv5_hisPush: sig(ppv(own(r), 5)), ppv5_landing: sig(ppv(land(r), 5)), plasterReach_m: sig(shakes(r).length ? P.plasterReach(shakes(r)) : 0),
    airTakenBack_J: r.flight && r.flight.ocean ? sig(r.flight.ocean.E) : 0, Eobj_J: sig(r.Eobj),
  });
  return { volume_m3: sig(c.body.volume, 4), least: Object.assign({ effort: kgf(L.use), capped: L.capped }, side(L.r)), ceiling: ceilingText(L.ce), allout: side(A),
    presets: L.p.presets().map((x) => x.id + ': ' + (x.never ? 'never' : kgf(x.use))).join(', ') };
}

const out = {};

// 1. Mass
for (const [tag, isNew] of [['old, 3,007 kg', false], ['new, 3,000 kg', true]]) {
  setMass(isNew);
  const m = isNew ? 3000 : 3007, c = ctxOf(m);
  const J = R.MOVES.jump.run(Object.assign({}, c, { use: undefined })), Lj = least('jump', c, { near: 5, target: 3 });
  out['1 mass, ' + tag] = {
    throwCar30m: throwRun(m, 'car'),
    jump3m: { least: kgf(Lj.use), alloutApex_m: sig(J.flight.apex), alloutV: sig(J.v) },
    walkSoft_ppv3_mm_s: sig(P.presence(body('rex', m), sf('concrete'), { pace: 'walk', effort: 0 }).ppv(3) * 1000),
    standing_kPa: sig(c.body.m * g / (2 * c.body.footArea) / 1000),
    kV: sig(P.BUILDS.rex.kV, 4),
  };
}
setMass(false);

// 2. Recoil: into the planet (old) or into their source (new)
for (const [tag, on] of [['old, into the planet', false], ['new, into their source', true]]) {
  newRecoil(on);
  const x = {};
  x.throwCar30m = throwRun(3007, 'car');
  x.throwCar30m_dial1e12 = throwRun(3007, 'car', { F: 1e12 * g });
  x.throwBusUp1km_dial1e9 = throwRun(3007, 'bus', { F: 1e9 * g }, { angle: 90, target: 1000 });
  { const c = ctxOf(3007), pl = least('pull', c, { near: 5, target: 10, obj: ob('car') }), A = R.MOVES.pull.run(Object.assign({}, c, { use: undefined }), { obj: ob('car') });
    x.pullCar10s = { least: kgf(pl.use), allout_ppv5: sig(ppv(R.MOVES.pull.shake(A, pl.p.opt), 5)), ceiling: ceilingText(pl.ce) }; }
  out['2 recoil, ' + tag] = x;
}
newRecoil(false);
// his push in the two-player tests (the engine reports it; the new rule drops it)
{
  const cR = ctxOf(3007), cO = Object.assign(ctxOf(3007), { body: body('ollie') });
  const s = P.shove(cR, cO), src = s.toGround ? P.impulseSource(cR.surface, s.toGround.J, Math.max(1e-9, s.toGround.T)) : null;
  out['2 recoil, Rex shoves Ollie (old; new drops the push)'] = { ollieV: sig(s.vB), ollieSlide_m: sig(s.slideB), rexV: sig(s.vA), toGroundJ: sig(s.toGround ? s.toGround.J : 0), ppv5: sig(ppv(src, 5)) };
  const F9 = 1e9 * g, cR9 = ctxOf(3007, { F: F9 }), cO9 = Object.assign(ctxOf(3007, { F: F9 }), { body: body('ollie') });
  const L = P.catchLeg(cR9, cO9, ob('baseball'), 10, 'hard');
  const sT = L.toGroundT ? P.impulseSource(cR9.surface, L.toGroundT.J, Math.max(1e-9, L.toGroundT.T)) : null, sC = L.toGroundC ? P.impulseSource(cR9.surface, L.toGroundC.J, Math.max(1e-9, L.toGroundC.T)) : null;
  out['2 recoil, game of catch, fastball 10 m, dial 1e9 (old; new drops the thrower\'s push)'] = { result: L.result, throwV: sig(L.aim && L.aim.vL), throwerPushJ: sig(L.toGroundT ? L.toGroundT.J : 0), throwerPPV5: sig(ppv(sT, 5)), catcherStopJ: sig(L.toGroundC ? L.toGroundC.J : 0), catcherPPV5: sig(ppv(sC, 5)) };
  const F20 = 1e20 * g, L20 = P.catchLeg(ctxOf(3007, { F: F20 }), Object.assign(ctxOf(3007, { F: F20 }), { body: body('ollie') }), ob('baseball'), 10, 'hard');
  out['5Q catch, fastball 10 m, dial 1e20: is the catcher carried off?'] = { result: L20.result, carried: !!(L20.catch && L20.catch.carried), carriedAt_m_s: sig(L20.catch && L20.catch.uAfter) };
}

// 3. Audit: the comic unlimited jump's push-off has no push time
{ const j = P.jump(ctxOf(3007, { F: Infinity })); out['3 audit, unlimited comic jump push-off'] = { groundTakes: j.pushOff.J, pushTime: j.pushOff.T, supplied: String(j.pushOff.supplied) }; }

// 4. Collide: Ollie charges Rex; "new" is the truly immovable sums with the momentum to the endless ocean
for (const [label, F, src, gb] of [['sprint, default dial', F0, 'sprint'], ['jump, dial 1e9', 1e9 * g, 'jump'], ['set 0.1% of light speed', 1e6 * g, 'set', 1e-3]]) {
  const cO = Object.assign(ctxOf(3007, { F }), { body: body('ollie') }), cR = ctxOf(3007, { F });
  for (const bounce of [false, true]) {
    const r = P.collide(cO, cR, { source: src, gb, bounce }), imm = P.collide(cO, Object.assign({}, cR, { immovable: true }), { source: src, gb, bounce });
    const af = r.after && (bounce ? r.after.bounce : r.after.splat), s = r.toGround ? P.impulseSource(cR.surface, r.toGround.J, Math.max(1e-9, r.toGround.T)) : null;
    out['4 collide, Ollie into Rex, ' + label + (bounce ? ', bounce' : ', splat')] = {
      old: { arrives_m_s: sig(r.v0), outcome: r.outcome, heldBy: r.hold && r.hold.why, rex: bounce ? { flies_m_s: sig(af && af.vB), slides_m: sig(af && af.slideB) } : { moves_m: sig(af && (af.moved != null ? af.moved : af.depth)), pairSpeed_m_s: sig(af && af.V) },
        groundTakesJ: sig(r.toGround ? r.toGround.J : 0), supplied: sig(r.toGround && r.toGround.supplied ? r.toGround.supplied : 0), plasterReach_m: sig(s ? P.plasterReach(s) : 0), freed_J: sig(r.Q) },
      new: { rexMoves: 0, ollieAfter_m_s: sig(bounce ? imm.h.el.vA : 0), toEndlessOcean: sig(bounce ? imm.h.el.pT : imm.h.inel.pT), freed_J: sig(imm.Q) },
    };
  }
}

// 5. Safe passenger: a person thrown 30 m at 45°
for (const [tag, sp] of [['old, off', false], ['new, on', true]]) {
  out['5 safe passenger, ' + tag] = throwRun(3007, 'person', {}, { safePassenger: sp });
  out['5 safe passenger, ' + tag + ', all four powers off'] = throwRun(3007, 'person', { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false }, { safePassenger: sp });
}
{ const t = P.throwObject(ctxOf(3007, { use: 3350 * g }), ob('person'), 45);
  out['5 safe passenger, the person\'s landing at the new least effort'] = { v: sig(t.v), lands_m_s: sig(t.flight.vImpact), likeAFallOf_m: sig(t.flight.vImpact * t.flight.vImpact / (2 * g)) }; }

// 6. Shimmer: energy taken back, and its level on a log scale between the canon's anchors
{
  const E = (id) => D.energyRefs.find((x) => x.key === id).J;
  const flick = E('energy_corolla_100kmh_kinetic'), flares = { dinosaurKiller: E('energy_chicxulub_impact'), earthApart: E('energy_earth_gravitational_binding') };
  const level = (e, F) => sig((Math.log10(e) - Math.log10(flick)) / (Math.log10(F) - Math.log10(flick)), 2);
  const steps = {};
  for (const [k, F] of Object.entries(flares)) steps[k] = [0.25, 0.5, 0.75].map((q) => sig(Math.pow(10, Math.log10(flick) + q * (Math.log10(F) - Math.log10(flick))), 2));
  const cases = {
    'throw car 30 m, least': P.throwObject(ctxOf(3007, { use: 22100 * g }), ob('car'), 45).flight.ocean.E,
    'throw car, all-out, default dial': P.throwObject(ctxOf(3007), ob('car'), 45).flight.ocean.E,
    'stomp, all-out, default dial (absorbed by Unbreakable footing)': P.stomp(ctxOf(3007)).absorbed,
    'stomp, all-out, dial 1e9': P.stomp(ctxOf(3007, { F: 1e9 * g })).absorbed,
    'Ollie into Rex at 0.1% c, if the hit is absorbed': P.collide(Object.assign(ctxOf(3007, { F: 1e6 * g }), { body: body('ollie') }), Object.assign(ctxOf(3007, { F: 1e6 * g }), { immovable: true }), { source: 'set', gb: 1e-3 }).Q,
  };
  const t9 = P.throwObject(ctxOf(3007, { F: 1e9 * g }), ob('car'), 45);
  out['6 shimmer'] = { flicker_J: flick, flares_J: flares, stepsAtQuarterHalfThreeQuarters: steps,
    cases: Object.fromEntries(Object.entries(cases).map(([k, e]) => [k, { E_J: sig(e), level_dinosaurKiller: level(e, flares.dinosaurKiller), level_earthApart: level(e, flares.earthApart) }])),
    'risk: car all-out at dial 1e9': { airTally_J: sig(t9.flight.ocean.E), carEnergy_J: sig(t9.Eobj) } };
}

// 8. Sprint: today's top speeds, and the dial a bolted stride needs for 330 m/s
{
  const sp = (F, sid, anchor) => P.sprint(Object.assign(ctxOf(3007, { F, surface: sf(sid) }), { anchor }));
  let lo = 1e5, hi = 1e9;
  for (let i = 0; i < 60; i++) { const m = Math.sqrt(lo * hi); if (sp(m * g, 'concrete', 'bolted').vTop >= 330) hi = m; else lo = m; }
  out['8 sprint'] = { defaultDial: { vTop: sig(sp(F0, 'concrete', 'friction').vTop), limit: sp(F0, 'concrete', 'friction').topLimit },
    dial1e9_friction: { concrete: sig(sp(1e9 * g, 'concrete', 'friction').vTop), granite: sig(sp(1e9 * g, 'granite', 'friction').vTop) }, bolted330_from_kg: sig(hi) };
}
console.log(JSON.stringify(out, null, 1));
