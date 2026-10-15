// Checks for their four default powers (BRIEF-gui.md section 5): air resistance absorbed, things keep their form,
// unbreakable footing and they take their own recoil. Run: node test/powers.js
// Part 1: with all four off, every engine result is exactly what the engine gave before they existed.
global.window = {};
const path = require('path');
const ENGINE = path.join(__dirname, '..', 'src', 'engine.js');
let P = require(ENGINE);
require('../src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
let fails = 0, n = 0;
const ok = (name, cond, detail) => { n++; if (!cond) fails++; console.log((cond ? 'ok   ' : 'FAIL ') + name + (detail != null ? ': ' + detail : '')); };
const ONLY = process.argv.includes('--off-only');

// 1. Powers off: the same results as before (fixture from main's engine, test/make-powers-off.js)
if (!process.argv.includes('--skip-off')) {
  const { cases, canon, hash, OFF } = require('./powers-off-cases.js');
  const base = require('./fixtures/powers-off.json').fingerprints;
  // the fixture was written with the 3,007 kg bodies of 11 Oct 2026 (volume 0.10017 x height^3); since 13 Oct 2026
  // the canon is 3,000 kg (BRIEF-canon.md item 1), so these comparisons run on the build they were written with
  const FIXTURE_KV = 0.10017;
  // BRIEF-canon.md item 5 (pull request 3): Safe passenger now covers the air's drag in flight too, so with it on the
  // passenger hazard never fires. Eight of the planner cases run with Safe passenger on (powers-off-cases.js's second
  // switch set, a person thrown at unlimited strength: plan|throw|person|inf|...|5), so they are not powers-off cases.
  // They are compared through a test-side shim that restores the passenger rule from before (the drag counted whatever
  // Safe passenger says), and without the shim exactly these eight must differ, with the hazard now never. The fixture
  // is not regenerated.
  const SP_KEYS = [];
  for (const sid of ['concrete', 'sand']) for (const anchor of ['friction', 'bolted']) for (const gh of [false, true]) SP_KEYS.push(['plan', 'throw', 'person', 'inf', sid, anchor, gh, 5].join('|'));
  const oldPassenger = (E) => (r, o) => !!o.obj.passenger && r.canMove && ((!o.safePassenger && r.launchG > 0 && E.PASSENGER.felt(Math.max(r.launchG, r.launchGPeak || 0), o.angle) > E.PASSENGER.noHarm(r.launchT)) || E.PASSENGER.dragG(o.obj, r.v) * E.dragFactor(o) > E.PASSENGER.noHarm(1));
  const check = (label, extra) => {
    // a fresh copy of the engine for each pass, so no cache carries results from one pass into the other
    delete require.cache[require.resolve(ENGINE)];
    P = require(ENGINE);
    P.BUILDS.rex.kV = P.BUILDS.ollie.kV = FIXTURE_KV;
    let diff = 0, missing = 0, first = null;
    const list = cases(P, D), spDiff = [], spNever = [];
    for (const c of list) {
      const want = base[c.key];
      if (!want) { missing++; continue; }
      const res = c.run(extra), got = hash(canon(res));
      if (SP_KEYS.includes(c.key)) { if (got !== want) spDiff.push(c.key); if (res.hazards.find((h) => h.id === 'passenger').never && res.reachAll.passenger === false && res.reachLeast.passenger === false) spNever.push(c.key); }
      else if (got !== want) { diff++; if (!first) first = c.key; }
    }
    ok('powers ' + label + ': every engine result matches the engine before them (' + (list.length - SP_KEYS.length) + ' cases, all but the ' + SP_KEYS.length + ' with Safe passenger on)', diff === 0 && missing === 0, diff || missing ? diff + ' differ, ' + missing + ' missing; first: ' + first : null);
    // the eight with Safe passenger on: the same results through the shim, and without it exactly they differ
    const T = P.RESTRAINT.MOVES.throw, rule = T.passenger;
    T.passenger = oldPassenger(P);
    const shimDiff = list.filter((c) => SP_KEYS.includes(c.key) && hash(canon(c.run(extra))) !== base[c.key]).map((c) => c.key);
    T.passenger = rule;
    ok('powers ' + label + ': the ' + SP_KEYS.length + ' planner cases run with Safe passenger on match the engine before them with its passenger rule restored; without it exactly those ' + SP_KEYS.length + ' differ, their passenger hazard now never (pull request 3)',
      shimDiff.length === 0 && spDiff.length === SP_KEYS.length && spNever.length === SP_KEYS.length && SP_KEYS.every((k) => list.some((c) => c.key === k)), shimDiff.length + ' differ through the shim; ' + spDiff.length + ' differ without it; ' + spNever.length + ' never');
  };
  check('left out', {});
  check('explicitly off (airAbsorb 0, keepForm, unbreakable and ownRecoil false)', OFF);
  // the rest of the checks run on a fresh engine with today's build
  delete require.cache[require.resolve(ENGINE)];
  P = require(ENGINE);
}
if (ONLY) { console.log('\n' + (n - fails) + '/' + n + ' passed'); process.exit(fails ? 1 : 0); }

// helpers
const surf = (id) => D.surfaces.find((x) => x.id === id);
const obj = (id) => D.objects.find((x) => x.id === id);
const near = (a, b, rel) => Math.abs(a - b) <= rel * Math.abs(b);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const ctxOf = (F, extra) => Object.assign({ F, mode: 'comic', body: rex, surface: surf('concrete'), anchor: 'friction' }, extra || {});
const M = P.RESTRAINT.MOVES;
const sig = (x) => Number(x).toPrecision(3);

// 2. 5a: Air resistance absorbed
{
  // at 100% a car and a baseball fly as in a vacuum
  for (const [oid, F] of [['car', 1e5 * g], ['car', 1e7 * g], ['baseball', 1e5 * g], ['baseball', 1e7 * g]]) {
    const c = ctxOf(F, { airAbsorb: 1, anchor: 'bolted' }), r = P.throwObject(c, obj(oid), 45);
    const vac = P.fly({ v0: r.vOut, thetaDeg: 45, h0: rex.releaseHeight, m: obj(oid).m, A: obj(oid).area, Cd: 0 });
    const f = r.flight;
    const same = (f.escaped && vac.escaped) || (f.orbit && vac.orbit) || (near(f.range, vac.range, 1e-4) && near(f.apex, vac.apex, 1e-4));
    ok('5a: at 100% a thrown ' + oid + ' (' + sig(F / g) + ' kg dial) flies the drag-free arc', same, 'range ' + sig(f.range) + ' vs ' + sig(vac.range) + ' m, apex ' + sig(f.apex) + ' vs ' + sig(vac.apex) + ' m');
  }
  // the ocean's momentum is what the air would have taken along the path flown: check against a direct sum over the
  // drag-free arc of a slow, low throw (flat ground, constant gravity: fine at 30 m/s)
  {
    const o = obj('car'), v0 = 30, th = Math.PI / 4, h0 = 2.7;
    const f = P.fly({ v0, thetaDeg: 45, h0, m: o.m, A: o.area, Cd: o.Cd, CdSup: o.CdSup, dragK: 0 });
    let x = 0, y = h0, vx = v0 * Math.cos(th), vy = v0 * Math.sin(th), Px = 0, Py = 0, E = 0;
    const dt = 1e-4;
    while (y >= 0) { const v = Math.hypot(vx, vy), Dg = 0.5 * P.cdAt(o.Cd, o.CdSup, v / P.K.a0) * P.rhoAt(y) * o.area * v * v; Px += Dg * vx / v * dt; Py += Dg * vy / v * dt; E += Dg * v * dt; vy -= g * dt; x += vx * dt; y += vy * dt; }
    ok('5a: at 100% the ocean takes the momentum and energy the air would have taken along the drag-free arc', near(f.ocean.P, Math.hypot(Px, Py), 0.01) && near(f.ocean.E, E, 0.01) && !f.air.E && !f.air.P, 'ocean ' + sig(f.ocean.P) + ' N s vs ' + sig(Math.hypot(Px, Py)) + '; ' + sig(f.ocean.E) + ' J vs ' + sig(E));
    const h = P.fly({ v0, thetaDeg: 45, h0, m: o.m, A: o.area, Cd: o.Cd, CdSup: o.CdSup, dragK: 0.3 });
    ok('5a: at 70% the air takes 30% and the ocean 70% of the drag along the path flown', near(h.air.E / (h.air.E + h.ocean.E), 0.3, 1e-9) && near(h.air.P / (h.air.P + h.ocean.P), 0.3, 1e-9));
  }
  // range rises and the air's blast falls steadily as the share rises; a supersonic throw at 50% still booms, with about
  // half the blast
  for (const [oid, F, ang] of [['car', 1e11 * g, 45], ['car', 1e9 * g, 30], ['baseball', 1e7 * g, 30], ['shot', 1e8 * g, 20]]) {
    const shares = [0, 0.25, 0.5, 0.75, 1];
    const runs = shares.map((s) => { const c = ctxOf(F, { airAbsorb: s, anchor: 'bolted' }); const r = P.throwObject(c, obj(oid), ang); return { s, r, blast: M.throw.blastParts(r, { airAbsorb: s }).path, range: r.flight.escaped || r.flight.orbit ? Infinity : r.flight.range }; });
    const up = runs.every((x, i) => i === 0 || x.range >= runs[i - 1].range), down = runs.every((x, i) => i === 0 || x.blast <= runs[i - 1].blast);
    ok('5a: ' + oid + ' at ' + sig(F / g) + ' kg (supersonic): range rises and the blast from its flight falls as the share rises', up && down && runs[0].r.v >= P.K.a0 && runs[0].blast > runs[4].blast, runs.map((x) => (x.s * 100) + '%: ' + (isFinite(x.range) ? sig(x.range) + ' m' : 'leaves') + ', ' + sig(x.blast) + ' J').join('; '));
    const r0 = runs[0], r5 = runs[2];
    if (r0.r.v >= P.K.a0) {
      ok('5a: ' + oid + ' supersonic at 50%: still a sonic boom, and half the blast from its flight of 0% (half of what real air takes)', M.throw.boomSpeed(r5.r, { airAbsorb: 0.5 }) >= P.K.a0 && near(r5.blast / r0.blast, 0.5, 1e-9), 'ratio ' + sig(r5.blast / r0.blast));
      ok('5a: ' + oid + ' at 100%: no blast from its flight (its landing is real)', runs[4].blast === 0);
      const h4 = M.throw.hand(runs[4].r, { obj: obj(oid), body: rex }), p4 = M.throw.blastParts(runs[4].r, { airAbsorb: 1, obj: obj(oid), body: rex });
      ok('5a: ' + oid + ' at 100%: his supersonic hand\'s own air still counts (gamma^2 m_air v^2, at most his push\'s work)', h4 && h4.E > 0 && p4.path === h4.E && near(h4.Euncapped, h4.mAir * runs[4].r.v * runs[4].r.v / (1 - Math.pow(runs[4].r.v / P.K.c, 2)), 1e-9) && h4.E <= runs[4].r.push.EA + runs[4].r.push.EB, sig(h4.E) + ' J from ' + sig(h4.mAir) + ' kg of air');
    }
  }
  // their own sprint is unchanged at any share; a person's drag scales with the share
  { const a = P.sprint(ctxOf(1e6 * g)), b = P.sprint(ctxOf(1e6 * g, { airAbsorb: 1 })); ok('5a: their own sprint is unchanged at any share', a.vTop === b.vTop && a.dragPower === b.dragPower); }
  { const r = P.throwObject(ctxOf(7e4 * g, { airAbsorb: 0.6, safePassenger: true }), obj('person'), 30), o = { obj: obj('person'), angle: 30, safePassenger: true };
    const dg = P.PASSENGER.dragG(obj('person'), r.v);
    // real drag between 1.5 g and 1.5 / 0.4 g: harmful at 0%, harmless at 60% (the drag on its own, switch or no switch)
    ok('5a: a thrown person feels 40% of the real drag at 60% absorbed (the held 1.5 g limit)', dg > P.PASSENGER.noHarm(1) && 0.4 * dg < P.PASSENGER.noHarm(1) && M.throw.passengerDrag(r, Object.assign({ airAbsorb: 0.6 }, o)) === false && M.throw.passengerDrag(r, Object.assign({ airAbsorb: 0 }, o)) === true && M.throw.passengerDrag(r, Object.assign({ airAbsorb: 1 }, o)) === false, 'drag ' + sig(dg) + ' g real');
    // BRIEF-canon.md item 5: Safe passenger covers the drag too, so with it on the hazard never fires, even at 0% where
    // the drag alone is past the limit; with it off the hazard is the launch or the drag, as before
    const off = Object.assign({}, o, { safePassenger: false });
    ok('5a: with Safe passenger on the passenger hazard never fires (the drag at 0% included); with it off it is the launch or the drag', [0, 0.6, 1].every((s) => M.throw.passenger(r, Object.assign({ airAbsorb: s }, o)) === false)
      && [0, 0.6, 1].every((s) => { const x = Object.assign({ airAbsorb: s }, off); return M.throw.passenger(r, x) === (M.throw.passengerLaunch(r, x) || M.throw.passengerDrag(r, x)); }) && M.throw.passenger(r, Object.assign({ airAbsorb: 0 }, off)) === true && M.throw.passengerLaunch(r, off) === true); }
  // past 1% of light speed: the All-Star baseball (1.8 x 10^23 kg dial, comic, level)
  {
    const allstar = 200e18 * 907.18474 * g;
    const c0 = ctxOf(allstar), c1 = ctxOf(allstar, { airAbsorb: 1, keepForm: true }), c5 = ctxOf(allstar, { airAbsorb: 0.5 });
    const r0 = P.throwObject(c0, obj('baseball'), 0), r1 = P.throwObject(c1, obj('baseball'), 0), r5 = P.throwObject(c5, obj('baseball'), 0);
    const ob = (x) => Object.assign({ obj: obj('baseball'), angle: 0, body: rex }, x || {});
    const parts1 = M.throw.blastParts(r1, ob({ airAbsorb: 1 })), hand = M.throw.hand(r1, ob()), gam = 1 + r1.Eobj / (obj('baseball').m * P.K.c * P.K.c), work = r1.push.EA + r1.push.EB;
    // the piston work gamma^2 m_air v^2 is far more than his push supplies here, so it is capped at the push's work
    ok('5a: the All-Star baseball at 100% makes no fireball of its own and leaves the Earth in a straight line; his hand\'s own air still counts, capped at the work of his push', r1.flight.relativistic && r1.line && r1.line.leaves && parts1.land === 0 && parts1.path === hand.E && hand.capped && hand.E === work && near(hand.Euncapped, gam * gam * hand.mAir * P.K.c * P.K.c, 1e-6) && r1.line.bendMax < 1e-5, 'bend under ' + sig(r1.line.bendMax) + ' rad; hand air ' + sig(hand.Euncapped) + ' J uncapped, capped at ' + sig(hand.E) + ' J (' + sig(hand.mAir) + ' kg of air)');
    // the relativistic snowplow against energy and momentum kept, worked out here independently: at gamma = 10, sweeping
    // k x = 1 of its own masses: gamma_f = (gamma + x) / sqrt((1 + x)^2 + 2 (gamma - 1) x), keep = (gamma_f - 1) / (gamma - 1)
    { const Eg = 9 * obj('car').m * P.K.c * P.K.c, f1 = P.fastAir(obj('car'), Eg, 0, 1), kk = 1 / f1.x, fk = P.fastAir(obj('car'), Eg, 0, kk), x = 1;
      const gf = (10 + x) / Math.sqrt((1 + x) * (1 + x) + 2 * 9 * x), want = (gf - 1) / 9;
      ok('5a: the relativistic snowplow keeps energy and momentum (gamma 10, its own mass of air swept: keep ' + sig(want) + ', classical 0.25)', near(fk.keep, want, 1e-9) && near(fk.Eair, Eg * (1 - want), 1e-9), 'keep ' + sig(fk.keep)); }
    // the snowplow in the ground's frame: it meets 10,000 times its own mass of air on a level path, so even half the
    // drag hands on almost all of its energy; the brief's 'half at 50%' holds only for something that sweeps little air
    const fa0 = P.fastAir(obj('baseball'), r0.Eobj, 0, 1), fa5 = P.fastAir(obj('baseball'), r0.Eobj, 0, 0.5), b5 = M.throw.blastParts(r5, ob({ airAbsorb: 0.5 })).land, b0 = M.throw.blast(r0, ob());
    // the blast near him: the share of the drag that acts times what real air takes (all of it past 1% of light speed),
    // one rule on both sides of 1% c, so 50% gives half (the brief's test); the snowplow's whole-path take, nearly all
    // of it at either share, is what the text reports
    ok('5a: the All-Star blast at 50% is half the 0% value (the near-field rule, as below 1% of light speed); the whole path\'s air takes nearly all of its energy at either share; at 0% all of it, as before', b0 === r0.Eobj && near(b5 / b0, 0.5, 1e-12) && fa5.Eair / fa0.Eair > 0.99 && fa0.Eair / r0.Eobj > 0.999 && fa0.x > 1e4, 'blast ratio ' + sig(b5 / b0) + '; whole-path take ' + sig(fa5.Eair / fa0.Eair) + '; air ' + sig(fa0.x) + ' times its mass');
    // no step at 1% of light speed: a car at 90% just under and just over it
    { const cu = (F) => ctxOf(F, Object.assign({}, ON, { airAbsorb: 0.9 })), o9 = { obj: obj('car'), angle: 45, body: rex, airAbsorb: 0.9, keepForm: true, unbreakable: true, ownRecoil: true };
      let lo = 1e13 * g, hi = 1e16 * g;
      for (let i = 0; i < 60; i++) { const mid = Math.sqrt(lo * hi); if (P.throwObject(cu(mid), obj('car'), 45).flight.relativistic) hi = mid; else lo = mid; }
      const a = P.throwObject(cu(lo), obj('car'), 45), b = P.throwObject(cu(hi), obj('car'), 45), ba = M.throw.blast(a, o9), bb = M.throw.blast(b, o9);
      ok('5a: the blast has no step at 1% of light speed (a car at 90%: just under and just over)', !a.flight.relativistic && b.flight.relativistic && near(ba, bb, 0.05), sig(ba) + ' vs ' + sig(bb) + ' J'); }
    // the same snowplow keeps momentum: what it keeps plus what the air takes is all of its energy, and at low speed it
    // is the textbook 1 / (1 + x)^2
    { const lo = P.fastAir(obj('car'), P.keFromV(0.011 * P.K.c, obj('car').m), 90, 0.2); ok('5a: the snowplow at low speed keeps 1/(1 + kx)^2 of the energy', near(lo.keep, 1 / Math.pow(1 + 0.2 * lo.x, 2), 1e-3) && near(lo.Eair + lo.keep * P.keFromV(0.011 * P.K.c, obj('car').m), P.keFromV(0.011 * P.K.c, obj('car').m), 1e-9)); }
    // a slow fireball (just past 1% of light speed) that sweeps little air scales almost linearly
    { const e = P.keFromV(0.011 * P.K.c, obj('pyramid').m), a1 = P.fastAir(obj('pyramid'), e, 90, 1), a5 = P.fastAir(obj('pyramid'), e, 90, 0.5), c1 = P.fastAir(obj('car'), P.keFromV(0.011 * P.K.c, obj('car').m), 90, 1), c5 = P.fastAir(obj('car'), P.keFromV(0.011 * P.K.c, obj('car').m), 90, 0.5);
      ok('5a: just past 1% of light speed, straight up: the Great Pyramid sweeps little air, so its fireball scales almost as the share; a car is stopped by the air at either share', a5.Eair / a1.Eair > 0.49 && a5.Eair / a1.Eair < 0.53 && c5.Eair / c1.Eair > 0.95, 'pyramid ' + sig(a5.Eair / a1.Eair) + ', car ' + sig(c5.Eair / c1.Eair)); }
    ok('5a: at 0% with Things keep their form off, the throw is today\'s (no straight-line report)', r0.line === undefined);
  }
  // the game of catch past 1% of light speed: at 50% the fireball sweeps air at half the rate (the Throw tab's rule)
  { const cR = ctxOf(1e20 * g, { airAbsorb: 0.5 }), cO = Object.assign({}, cR, { body: ollie }), c0 = ctxOf(1e20 * g), c0O = Object.assign({}, c0, { body: ollie });
    const a = P.catchLeg(cR, cO, obj('baseball'), 1000, 'hard'), b = P.catchLeg(c0, c0O, obj('baseball'), 1000, 'hard');
    const fb5 = a.fireball, fb0 = b.fireball, x = a.Dfl / fb0.unit, gm1 = fb0.gamma - 1, E = fb0.E, heat = (xx) => 2 * E * xx / (Math.sqrt((1 + xx) * (1 + xx) + 2 * gm1 * xx) + 1 + xx);
    ok('5a: in the game of catch at 50% the fireball sweeps air at half the rate, as on the Throw tab (half-energy length twice as long)', a.result === 'fireball' && b.result === 'fireball' && near(fb0.Egap, heat(x), 1e-9) && near(fb5.Egap, heat(0.5 * x), 1e-9) && near(fb5.sweepK, 2 * fb0.sweep, 1e-12), sig(fb5.Egap / fb0.Egap) + ' of the 0% heat'); }
  // ... and at 100% it flies the straight chord between their hands: caught near, but past about 12 km the chord runs
  // underground, so it hits the ground; a catch that fast keeps momentum (the pair is carried off)
  { const cR = ctxOf(200e18 * 907.18474 * g, { airAbsorb: 1, keepForm: true }), cO = Object.assign({}, cR, { body: ollie });
    const near1 = P.catchLeg(cR, cO, obj('baseball'), 100, 'hard'), far1 = P.catchLeg(cR, cO, obj('baseball'), 20000, 'hard');
    const k = near1.catch, pIn = k.pIn, mb = obj('baseball').m, Mtot = ollie.m + mb;
    ok('5a: at 100% the game of catch flies the straight chord: caught at 100 m (aimed a hair below level), hits the ground at 20 km', near1.fast && near1.result === 'caught' && near1.aim.thetaDeg < 0 && near1.vArrive === near1.aim.vL && far1.result === 'hits-ground' && far1.hitsGround.at < 20000 && far1.hitsGround.E > 0, 'hits ' + sig(far1.hitsGround.at) + ' m out');
    // momentum and energy kept: the pair's rest mass from E and p, and its speed from that
    const c2 = P.K.c * P.K.c, E0 = P.momentumToKE(pIn, mb), Mf = Math.sqrt(Math.pow(E0 + Mtot * c2, 2) - pIn * pIn * c2) / c2;
    ok('5a: a catch past 1% of light speed keeps momentum: Ollie is carried off at the speed energy and momentum allow', k.carried && k.relativistic && near(P.vToMomentum(k.uAfter, Mf), pIn, 1e-6) && k.uAfter < P.K.c, 'carried off at ' + sig(k.uAfter / P.K.c) + ' c');
    // carried off, his own body meets real air: the pair's ride turns its motion to heat in the lower air (the snowplow
    // fireballAt uses below 100%); and with Ollie gone there is no round trip
    const Ek = P.momentumToKE(pIn, Mf), aa = Math.max(obj('baseball').area, ollie.frontArea), x2 = P.K.rho0 * aa * Math.sqrt(2 * P.K.R_E * P.K.Hs) / Mf, g1 = Ek / (Mf * c2);
    const want = 2 * Ek * x2 / (Math.sqrt((1 + x2) * (1 + x2) + 2 * g1 * x2) + 1 + x2), G = P.catchGame(cR, cO, obj('baseball'), 100, 'hard');
    ok('5a: carried off, the catch\'s heat and the pair\'s motion add up to the energy that came in', near(k.Ecatch + k.Eride, E0, 1e-9), sig(k.Ecatch) + ' + ' + sig(k.Eride) + ' J of ' + sig(E0) + ' J');
    ok('5a: carried off past 1% of light speed, Ollie\'s ride heats the air (the pair\'s snowplow over about 320 km), and there is no round trip', near(k.Enear, want, 1e-6) && k.Enear > 0 && k.Enear <= Ek && P.catchRoundTrip(G.a, G.b) === null, sig(k.Enear) + ' J of ' + sig(Ek) + ' J');
    // the hit point's angle: the line meets the ground more shallowly than it left him, by the arc it covered
    const ob1 = obj('baseball'), L1 = ob1.L || Math.cbrt(6 * ob1.m / (Math.PI * (ob1.rho || 1000))), hg = far1.hitsGround, ang = -far1.aim.thetaDeg - hg.at / P.K.R_E * 180 / Math.PI;
    const cr = P.craterDiameter({ L: L1, v: far1.vArrive, rhoI: ob1.rho || 1000, rhoT: cR.surface.rho || 2000, angleDeg: ang, E: hg.E });
    ok('5a: the straight line that hits the ground: its crater uses the angle at the hit point', ang > 0 && ang < -far1.aim.thetaDeg && near(hg.crater, cr.D, 1e-12), sig(ang) + ' deg there, ' + sig(-far1.aim.thetaDeg) + ' deg at his hand'); }
  // a dense catcher (Ollie at 10^18 kg, both bolted) stops a relativistic baseball: first contact frees nearly all its
  // energy, worked out without round-off (M1 - m - mh, written exactly)
  { const cR = ctxOf(1e14 * g, Object.assign({ anchor: 'bolted' }, ON)), cO = Object.assign({}, cR, { body: P.makeBody({ build: 'ollie', H: 3.048, m: 1e18 }) });
    const L = P.catchLeg(cR, cO, obj('baseball'), 100, 'hard'), k = L.catch, E0 = k && P.momentumToKE(k.pIn, obj('baseball').m);
    ok('5a: a dense catcher stops a relativistic baseball with first contact taking almost all of its energy (no round-off)', L.fast && k && k.relativistic && k.firstShare > 0.99 && k.firstShare <= 1 && near(k.Ecatch, E0, 1e-3), k ? 'first contact ' + sig(k.firstShare) + ' of ' + sig(E0) + ' J' : L.result); }
  // the sheath catch keeps the throw's momentum and energy (the lump's rest mass counts the swept air and its heat), at
  // the All-Star dial where gamma x is large; and at 100% the catch is exact far past where the speed rounds to c
  { const ob = obj('baseball'), bad = [];
    // (and at 10^16 kg and 99%, where the sheath holds a quarter of its energy, so the lump's rest mass matters)
    // (bolted catcher. They take their own recoil on: the stop's push back, the throw's momentum, goes to his source;
    // off: his bolts hand it to the planet)
    for (const [F, sh] of [[200e18 * 907.18474 * g, 0.5], [200e18 * 907.18474 * g, 0.99], [200e18 * 907.18474 * g, 1], [1e16 * g, 0.99]]) for (const own of [true, false]) {
      const cR = ctxOf(F, Object.assign({}, ON, { airAbsorb: sh, anchor: 'bolted', ownRecoil: own })), L = P.catchLeg(cR, Object.assign({}, cR, { body: ollie }), ob, 1000, 'hard');
      const E = P.throwObject(cR, ob, 0).Eobj, Ein = L.sheath ? E - L.sheath.E : E, fig = own ? L.recoilAbsorbedC : L.toGroundC;
      if (!(L.result === 'caught' && L.catch && near(L.catch.Ecatch, Ein, 1e-6) && near(fig ? fig.J : NaN, Math.sqrt(E * E + 2 * E * ob.m * P.K.c * P.K.c) / P.K.c, 1e-6) && (own ? !L.toGroundC : !L.recoilAbsorbedC))) bad.push(sh + (own ? ' own' : ' bolts') + ': ' + L.result + ' ' + (L.catch ? sig(L.catch.Ecatch / Ein) : '') + (fig ? ' J ' + sig(fig.J) : ''));
    }
    ok('5a/5d: a catch near light speed (the sheath at 50% and 99%, and 100%) frees the energy that arrives; the throw\'s momentum goes to his source with They take their own recoil on, and through his bolts to the planet with it off', !bad.length, bad.join('; '));
    const bad2 = [];
    for (const lg of [25, 27, 30]) {
      const cR = ctxOf(Math.pow(10, lg) * g, Object.assign({}, ON, { anchor: 'bolted' })), L = P.catchLeg(cR, Object.assign({}, cR, { body: ollie }), ob, 1000, 'hard'), E = P.throwObject(cR, ob, 0).Eobj;
      if (!(L.catch && near(L.catch.Ecatch, E, 1e-3))) bad2.push('1e' + lg + ': ' + (L.catch ? sig(L.catch.Ecatch / E) : L.result));
    }
    const cI = ctxOf(Infinity, Object.assign({}, ON, { anchor: 'bolted' })), LI = P.catchLeg(cI, Object.assign({}, cI, { body: ollie }), ob, 1000, 'hard');
    ok('5a: at 100% the catch keeps its energy far past gamma 10^7 (from the throw\'s energy, not its rounded speed); at infinite strength it is unbounded', !bad2.length && LI.catch && LI.catch.unbounded && LI.catch.Ecatch === Infinity, bad2.join('; ') + (LI.catch ? '' : ' infinite: ' + LI.result)); }
  // nearly all the drag absorbed, Things keep their form on: the object arrives whole with a thin plasma sheath, and he
  // catches it much as at 100% (no flip between 99.99% and 100%)
  { const c1 = ctxOf(1e16 * g, { airAbsorb: 1, keepForm: true }), c9 = ctxOf(1e16 * g, { airAbsorb: 0.9999, keepForm: true });
    const L1 = P.catchLeg(c1, Object.assign({}, c1, { body: ollie }), obj('baseball'), 100, 'hard'), L9 = P.catchLeg(c9, Object.assign({}, c9, { body: ollie }), obj('baseball'), 100, 'hard');
    ok('5a: at 99.99% with Things keep their form, the baseball arrives whole with a thin plasma sheath and is caught, as at 100%', L1.result === 'caught' && L9.result === L1.result && L9.sheath && L9.sheath.share < 0.01 && L9.catch.relativistic && near(L9.catch.Ecatch, L1.catch.Ecatch, 0.01), L9.result + (L9.sheath ? ', sheath ' + sig(L9.sheath.share) + ' of its energy' : '')); }
  // the toss of a partner at 100%: past 1% of light speed he escapes in a straight line, no fireball
  { const cR = ctxOf(1e22 * g, { airAbsorb: 1 }), t = P.tossPartner(cR, ollie, 'Ollie', 'hard', 10, 'friction'), t0 = P.tossPartner(ctxOf(1e22 * g), ollie, 'Ollie', 'hard', 10, 'friction');
    ok('5a: tossing Ollie past 1% of light speed at 100%: he escapes in a straight line (a fireball at 0%)', t.result === 'escapes' && t.fast && t0.result === 'fireball', t.result + ' / ' + t0.result); }
  // the downward geometry (the game of catch aims a hair down): a 1 degree dip from 2.743 m meets the ground about 157 m out
  { const L = P.straightThrow(0.02 * P.K.c, -1, 2.743), L0 = P.straightThrow(0.02 * P.K.c, 0, 2.743);
    ok('5a: a straight line aimed 1 degree down from 2.74 m meets the ground about 157 m away; level, it leaves', near(L.hitAt, 157.2, 0.002) && !L.leaves && L0.leaves && !L0.hitAt, sig(L.hitAt) + ' m'); }
}


// 3. 5b: Things keep their form
{
  const crushy = D.objects.filter((o) => o.crush && !o.noThrow);
  let liftBad = [], throwBad = [], seenRaw = 0;
  for (const F of [1e4 * g, 1e6 * g, 1e9 * g]) for (const o of crushy) {
    const l = P.lift(ctxOf(F, { keepForm: true }), o), t = P.throwObject(ctxOf(F, { keepForm: true }), o, 30);
    if (l.gripRatioRaw > 1 || t.gripRatioRaw > 1) seenRaw++;
    if (!(l.gripRatio === 0 && l.plateNeeded === 0 && l.gentle)) liftBad.push(o.id);
    if (t.canMove && !(t.gripRatio === 0 && t.gentle && !M.throw.crush(t, { keepForm: true }))) throwBad.push(o.id);
  }
  ok('5b: his grip never crushes what he lifts or throws (' + seenRaw + ' cases would have)', seenRaw > 10 && !liftBad.length && !throwBad.length, liftBad.concat(throwBad).slice(0, 5).join(', '));
  // impacts stay real: the landing is the same with it on or off
  { const a = P.throwObject(ctxOf(1e9 * g), obj('car'), 30), b = P.throwObject(ctxOf(1e9 * g, { keepForm: true }), obj('car'), 30);
    ok('5b: the landing (energy, crater, quake) is the same with it on', a.Eimpact === b.Eimpact && a.crater === b.crater && a.quake === b.quake && a.flight.range === b.flight.range && a.Eimpact > 0); }
  // the game of catch: no breaking by them or the air while it is on; without it, the same grid breaks things
  const broke = ['crushed-launch', 'breaks-up', 'burns-up', 'wreckage'];
  let offBroke = 0, onBroke = [], firesOn = 0;
  for (const F of [1e5 * g, 1e9 * g, 1e12 * g, 1e20 * g]) for (const [oid, Dd] of [['car', 30], ['baseball', 30], ['piano', 100], ['shot', 1000]]) for (const style of ['easy', 'hard']) {
    const cR = ctxOf(F), cO = Object.assign({}, cR, { body: ollie });
    const a = P.catchLeg(cR, cO, obj(oid), Dd, style), b = P.catchLeg(Object.assign({}, cR, { keepForm: true }), Object.assign({}, cO, { keepForm: true }), obj(oid), Dd, style);
    if (broke.includes(a.result) || a.bursts || a.result === 'fireball') offBroke++;
    if (b.result === 'fireball' || b.sheath) firesOn++;
    if (broke.includes(b.result) || b.bursts || (b.catch && b.catch.gripRatio > 1) || b.breakAtLaunch || (b.result === 'fireball' && !b.kept)) onBroke.push(oid + ' ' + style + ' ' + (F / g).toPrecision(1) + ': ' + b.result);
  }
  ok('5b: past 1% of light speed with it on, the object comes through the fireball whole (' + firesOn + ' fireballs, all kept: those that reach him arrive inside a plasma sheath and are caught)', firesOn > 0 && !onBroke.some((x) => /fireball/.test(x)));
  // no cliff: with it on, a throw that reaches him arrives as itself at any sheath size (round 4: the 1% line is gone)
  { const bad = [];
    for (const sh of [0.99, 0.9993, 0.99935, 0.9999]) { const c = ctxOf(1e20 * g, Object.assign({}, ON, { airAbsorb: sh })), L = P.catchLeg(c, Object.assign({}, c, { body: ollie }), obj('baseball'), 1000, 'hard'); if (L.result === 'fireball' && L.fireball && L.fireball.kind !== 'before') bad.push(sh + ': ' + L.result); }
    ok('5b: with Things keep their form a throw that reaches him is caught inside its sheath at any share (no flip at a 1% sheath)', !bad.length, bad.join('; ')); }
  ok('5b: in the game of catch nothing is crushed, broken up, burned or wrecked while it is on (' + offBroke + ' would have been)', offBroke > 3 && !onBroke.length, onBroke.slice(0, 4).join('; '));
  // the arm-wrestling table is something they hold: it never breaks
  { const cA = ctxOf(1e9 * g, { keepForm: true }), cB = Object.assign({}, cA, { body: ollie }), r = P.armWrestle(cA, cB), r0 = P.armWrestle(ctxOf(1e9 * g), Object.assign({}, ctxOf(1e9 * g), { body: ollie }));
    ok('5b: the arm-wrestling table holds with it on (it tears apart without)', !r.tableBreaks && !(r.slamRatio > 1) && r0.tableBreaks); }
}

// 4. 5c: Unbreakable footing
{
  const surfs = ['sand', 'softclay', 'concrete', 'ice', 'granite'];
  const bad = [];
  for (const sid of surfs) for (const lg of [3, 5, 7, 9, 12, 20]) for (const mode of ['comic', 'real']) {
    const c = ctxOf(Math.pow(10, lg) * g, { surface: surf(sid), unbreakable: true, mode });
    const j = P.jump(c), st = P.stomp(c), t = P.throwObject(c, obj('car'), 30), l = P.lift(c, obj('bus')), sp = P.sprint(c);
    const tag = sid + ' 1e' + lg + ' ' + mode;
    if (j.groundFails || j.landing.ratio > 0 || j.landing.sink > 0 || j.Eground > 0) bad.push('jump ' + tag);
    if (st.crater > 0 || (!P.RESTRAINT.SOIL.has(sid) && st.holeDepth >= 0.01) || (P.RESTRAINT.SOIL.has(sid) && !(st.holeDepth <= st.printCap + 1e-12)) || (st.realBreaks && st.holeDepth > (P.RESTRAINT.SOIL.has(sid) ? st.printCap : 0))) bad.push('stomp ' + tag);
    if (t.canMove && t.sinkRatio > 0) bad.push('throw ' + tag);
    if (l.groundRatio > 0 || l.standRatio > 0) bad.push('lift ' + tag);
    if (sp.sinks) bad.push('sprint ' + tag);
    for (const mv of ['jump', 'stomp', 'throw', 'sprint']) { const r = mv === 'throw' ? t : mv === 'jump' ? j : mv === 'stomp' ? st : sp; const o = { surface: c.surface, body: rex, m: rex.m, unbreakable: true, obj: obj('car'), angle: 30, near: 5 }; if (P.RESTRAINT.HAZARDS.find((h) => h.id === 'ground').test(M[mv], r, o)) bad.push('ground hazard ' + mv + ' ' + tag); }
  }
  for (const sid of surfs) for (const m of [3007, 3e5, 3e8, 3e12]) { const b = P.makeBody({ build: 'rex', H: 3.048, m }); const w = P.weight({ F: Infinity, mode: 'comic', body: b, surface: surf(sid), anchor: 'friction', unbreakable: true }); if (!['stands', 'held'].includes(w.ground.regime) || w.fall) bad.push('weight ' + sid + ' ' + m); }
  for (const sid of surfs) for (const e of [0, 0.5, 1]) for (const H of [3.048, 50]) { const b = P.makeBody({ build: 'rex', H, m: 1060 * P.bodyVolume(H, 'rex') }); const fp = P.walkStep(b, surf(sid), { effort: e, unbreakable: true }).footprint; if (['sinks', 'mired', 'breaks', 'comic'].includes(fp.kind)) bad.push('walk ' + sid + ' ' + e + ' ' + H + ': ' + fp.kind); }
  ok('5c: on sand, clay, concrete, ice and granite nothing breaks or sinks under them (jump, stomp, throw, lift, sprint, standing, walking; 2 x 6 x 5 settings)', !bad.length, bad.slice(0, 6).join('; '));
  // prints in soil stay
  { const fpOn = P.walkStep(rex, surf('sand'), { effort: 0, unbreakable: true }).footprint, fpOff = P.walkStep(rex, surf('sand'), { effort: 0 }).footprint;
    ok('5c: his footprints in sand stay (a print is not breaking the ground)', fpOn.depth > 0.002 && fpOn.depth === fpOff.depth && fpOn.kind === 'print', (fpOn.depth * 1000).toFixed(1) + ' mm'); }
  { const dense = P.makeBody({ build: 'rex', H: 3.048, m: 1e6 }), w = P.weight({ F: Infinity, mode: 'comic', body: dense, surface: surf('sand'), anchor: 'friction', unbreakable: true }), w0 = P.weight({ F: Infinity, mode: 'comic', body: dense, surface: surf('sand'), anchor: 'friction' });
    ok('5c: a 1,000 t Rex stands on sand: their power holds him, with a print no deeper than where the sand starts to fail', w.ground.regime === 'held' && w.ground.realRegime === w0.ground.regime && w.ground.print > 0 && w.ground.print < 0.2, 'would ' + w0.ground.regime + '; print ' + (w.ground.print * 1000).toFixed(0) + ' mm'); }
  // the same shaking as with it off, for the same push: the stomp (whose push doesn't depend on the ground), walking, and
  // a jump the ground can bear
  { const diffs = [];
    for (const sid of ['sand', 'softclay', 'concrete', 'granite']) for (const H of [3.048, 50]) for (const lg of [3, 4.5, 6, 6.25, 8]) {
      const b = P.makeBody({ build: 'rex', H, m: 1060 * P.bodyVolume(H, 'rex') }), c = { F: Math.pow(10, lg) * g, mode: 'comic', body: b, surface: surf(sid), anchor: 'friction' }, cu = Object.assign({ unbreakable: true }, c);
      const o = { surface: c.surface, body: b }, ou = Object.assign({ unbreakable: true }, o);
      // (where real ground would break, the ground takes only what it bears under his foot: no more than with it off)
      const st1 = P.stomp(cu), s0 = M.stomp.shake(P.stomp(c), o), s1 = M.stomp.shake(st1, ou);
      if (st1.realBreaks ? !(P.ppvAt(s1, 5) <= P.ppvAt(s0, 5) * (1 + 1e-12)) : (!near(P.ppvAt(s1, 5), P.ppvAt(s0, 5), 1e-12) || !near(P.plasterReach(s1) || 1e-300, P.plasterReach(s0) || 1e-300, 1e-9))) diffs.push('stomp ' + sid + ' H' + H + ' 1e' + lg + ': ' + P.ppvAt(s1, 5).toPrecision(3) + ' vs ' + P.ppvAt(s0, 5).toPrecision(3));
      const w0 = P.presence(b, c.surface, { effort: 1 }), w1 = P.presence(b, c.surface, { effort: 1, unbreakable: true });
      if (w0.ppv(5) !== w1.ppv(5) || w0.reach.plaster !== w1.reach.plaster) diffs.push('walk ' + sid);
    }
    for (const lg of [3, 4, 4.5]) { const c = ctxOf(Math.pow(10, lg) * g), j0 = P.jump(c), j1 = P.jump(Object.assign({ unbreakable: true }, c)), o = { surface: c.surface, body: rex, m: rex.m };
      if (j0.overLimit) continue;
      // the landing shakes the ground as with it off; the push-off adds its own (with the power off it isn't counted)
      const a = M.jump.shake(j0, o), b2 = M.jump.shake(Object.assign({}, j1, { pushOff: undefined }), Object.assign({ unbreakable: true }, o)), b3 = M.jump.shake(j1, Object.assign({ unbreakable: true }, o));
      if (P.ppvAt(a, 5) !== P.ppvAt(b2, 5) || P.plasterReach(a) !== P.plasterReach(b2) || (j1.v > 0 && !j1.pushOff) || !(P.ppvAt(b3, 5) >= P.ppvAt(a, 5))) diffs.push('jump 1e' + lg); }
    ok('5c: the ground shakes as with it off, for the same push (ppv at 5 m and the plaster reach: stomps up to a 50 m Rex on soft clay where the ground bears them, no more where it would break, walking, a jump\'s landing where the ground bears it; its push-off is added)', !diffs.length, diffs.slice(0, 4).join('; '));
  }
  // their own bodies meet real air: with a power on, a supersonic jump counts what the air takes from his flight
  { const c = ctxOf(1e9 * g), j0 = P.jump(c), j1 = P.jump(Object.assign({}, c, ON)), o = { surface: c.surface, body: rex, m: rex.m };
    ok('5c/5a: a supersonic jump with their powers on counts the air his own body meets as a blast (nothing from the unbreakable ground); with them off, main\'s count', j1.v >= P.K.a0 && j1.airLoss > 0 && M.jump.blast(j1, Object.assign({}, o, ON)) === j1.airLoss && j0.airLoss === undefined, sig(j1.airLoss) + ' J'); }
  // a push-off the ground couldn't bear still reaches it, and shakes it
  { const c = ctxOf(1e8 * g, { unbreakable: true }), j = P.jump(c), o = { surface: c.surface, body: rex, m: rex.m, unbreakable: true };
    ok('5c: a jump the real ground couldn\'t bear: their power holds it; the ground takes only what it bears (beyond his weight, over the push) and shakes from that; their power supplies the rest (canon\'s momentum exception)', j.overLimitReal && j.pushOff && j.pushOff.supplied > 0 && near(j.pushOff.J, j.landBear * j.pushOff.T, 1e-12) && near(j.pushOff.J + j.pushOff.supplied, rex.m * j.v / Math.sqrt(1 - Math.pow(j.v / P.K.c, 2)), 1e-9) && P.ppvAt(M.jump.shake(j, o), 5) > 0, sig(j.pushOff.J) + ' of ' + sig(j.pushOff.J + j.pushOff.supplied) + ' kg m/s into the ground'); }
  // the same on weak ground: Ollie jumping onto a standing Rex on loose sand, held only by Unbreakable footing
  { const cA = Object.assign(ctxOf(1e5 * g, { unbreakable: true, surface: surf('sand') }), { body: ollie }), cB = ctxOf(1e5 * g, { unbreakable: true, surface: surf('sand') });
    const r = P.collide(cA, cB, { source: 'jump' });
    // on gravel, where the ground bears more than the two of them weigh: its bearing beyond both weights over the pulse
    const cAg = Object.assign({}, cA, { surface: surf('gravel') }), cBg = Object.assign({}, cB, { surface: surf('gravel') });
    const rg = P.collide(cAg, cBg, { source: 'jump' }), bearG = P.collide(cAg, Object.assign({}, cBg, { unbreakable: false }), { source: 'jump' }).hold.H - ollie.m * g;
    ok('5c: Collide held by Unbreakable footing: the ground takes at most its bearing beyond both their weights (Ollie lands on him) over the pulse; on sand, where the two outweigh what it bears, none; their power supplies the rest', r.held && r.hold.why === 'unbreakable' && r.toGround && r.toGround.J === 0 && r.toGround.supplied === r.toGround.whole && rg.toGround && rg.toGround.supplied > 0 && bearG > 0 && near(rg.toGround.J, bearG * rg.toGround.T, 1e-12), r.toGround ? 'sand ' + sig(r.toGround.J) + ' of ' + sig(r.toGround.whole) + '; gravel ' + sig(rg.toGround && rg.toGround.J) + ' kg m/s' : r.outcome); }
  // a dent or a footprint isn't breaking the ground: the power changes nothing there (the stomp's energy goes in, its
  // blast stays, the print stays)
  { const c = ctxOf(5e2 * g, { surface: surf('granite') }), cu = Object.assign({ unbreakable: true }, c), s0 = P.stomp(c), s1 = P.stomp(cu);
    const cs = ctxOf(5e2 * g, { surface: surf('sand') }), ss0 = P.stomp(cs), ss1 = P.stomp(Object.assign({ unbreakable: true }, cs));
    ok('5c: a dent in granite or a footprint in sand: nothing is taken back, the hole and blast are as without it', !s1.realBreaks && s1.absorbed === 0 && s1.holeDepth === s0.holeDepth && s0.holeDepth > 0 && M.stomp.blast(s1, { unbreakable: true }) === M.stomp.blast(s0, {}) && ss1.absorbed === 0 && ss1.holeDepth === ss0.holeDepth && ss0.holeDepth > 0.002, 'granite ' + sig(s0.holeDepth * 1e6) + ' µm, sand ' + sig(ss0.holeDepth * 1000) + ' mm'); }
  // in soil, sinking past the print where the ground starts to fail is held, and its energy taken back (as on concrete)
  { const bad2 = [];
    for (const sid of ['sand', 'softclay']) for (const lg of [4, 6, 8]) { const c = ctxOf(Math.pow(10, lg) * g, { surface: surf(sid) }), s0 = P.stomp(c), s1 = P.stomp(Object.assign({ unbreakable: true }, c));
      if (!(s0.holeDepth > s1.printCap && s1.realBreaks && s1.absorbed === s1.E && s1.holeDepth === s1.printCap)) bad2.push(sid + ' 1e' + lg + ': ' + sig(s0.holeDepth) + ' m real, ' + sig(s1.holeDepth) + ' m kept'); }
    ok('5c: a stomp in sand or clay sinks no deeper than the print where the ground starts to fail (sand 90 mm, clay none); the rest is taken back', !bad2.length, bad2.slice(0, 3).join('; ')); }
  // a stomp's energy that would have broken the ground goes to the ocean: no blast from it
  { const c = ctxOf(1e8 * g, { unbreakable: true }), st = P.stomp(c), st0 = P.stomp(ctxOf(1e8 * g));
    const fa = M.stomp.footAir(st, { body: rex }), bl = M.stomp.blast(st, { unbreakable: true, body: rex });
    ok('5c: a stomp\'s cratering energy is taken back (no blast from it); the boom, the shaking and the air his foot drives ahead of it stay', st.absorbed === st.E && fa && near(bl, fa.E, 1e-12) && fa.E > 0 && bl < 0.01 * M.stomp.blast(st0, {}) && st.vFoot === st0.vFoot, 'foot air ' + sig(fa.E) + ' J vs ' + sig(M.stomp.blast(st0, {})) + ' J on real ground'); }
  // the break-the-ground preset turns the absorption off: it breaks at the same effort as without the power
  for (const [mv, o, sid] of [['stomp', {}, 'concrete'], ['jump', { target: 3 }, 'concrete'], ['throw', { obj: obj('car'), angle: 45, target: 30 }, 'concrete']]) {
    const c = ctxOf(1e9 * g, { surface: surf(sid) }), cu = Object.assign({ unbreakable: true }, c);
    const p0 = P.RESTRAINT.planNow(mv, c, o), p1 = P.RESTRAINT.planNow(mv, cu, o);
    const g0 = p0.result('preset:ground'), g1 = p1.result('preset:ground'), h1 = p1.result('hazard:ground');
    ok('5c: ' + mv + ' on ' + sid + ': "break the ground" turns the absorption off (same effort, and that run breaks it); nothing else does', g0.use === g1.use && h1.never && !g1.never && M[mv].ground(p1.runReal(g1.use), p1.optReal), g1.never ? 'never' : sig(g1.use / g) + ' kg');
  }
  // the Collide charge into a bolted (immovable) holder shakes the ground; a truly immovable one has no ground to shake
  { const cA = Object.assign(ctxOf(1e6 * g, { unbreakable: true }), { body: ollie }), cB = ctxOf(1e6 * g, { unbreakable: true, anchor: 'bolted' });
    const r = P.collide(cA, cB, { source: 'jump' }), src = P.impulseSource(cB.surface, r.toGround.J, r.toGround.T);
    const ri = P.collide(cA, Object.assign({ immovable: true }, cB), { source: 'jump' });
    ok('5c: Ollie jumping onto a bolted Rex shakes the ground (held: the hit\'s momentum over the longer of the contact and a limb\'s contact time)', r.held && near(r.toGround.J, r.pA, 1e-6) && r.toGround.T >= P.limbPulse(rex) && P.ppvAt(src, 5) > 1e-3 && P.plasterOver(src, 5) && !ri.toGround, sig(P.ppvAt(src, 5) * 1000) + ' mm/s at 5 m; plaster to ' + sig(P.plasterReach(src)) + ' m');
    const rb = P.collide(cA, cB, { source: 'jump', bounce: true });
    ok('5c: ... a bounce hands the ground the bounce\'s momentum (more than a splat\'s)', rb.held && rb.toGround && near(rb.toGround.J, rb.h.el.pT, 1e-9) && rb.toGround.J > r.toGround.J * (1 + 1e-9), sig(rb.toGround.J) + ' vs ' + sig(r.toGround.J) + ' kg m/s'); }
  // instant growth: the ground can't be driven into, so he grows up from his soles (the lift goes to the ocean)
  { const I = P.instantGrowth(rex, 4.2e23, 0.5, { surface: surf('concrete'), unbreakable: true }), I0 = P.instantGrowth(rex, 4.2e23, 0.5, { surface: surf('concrete') });
    ok('5c: instant growth on unbreakable ground drives nothing into it; the push that starts his rise still goes in, at most what the ground bears (their power supplies the rest)', !I.gives && I.Eground === 0 && I.rise > 0 && I.toGround && near(I.toGround.J + I.toGround.supplied, I.grown.m * I.vSole, 1e-12) && I.toGround.J <= I.grown.m * I.vSole && I.toGround.T === I.tau && !I0.toGround, sig(I.toGround.J) + ' of ' + sig(I.grown.m * I.vSole) + ' kg m/s'); }
  // the two-player pushes into the ground: the pin's momentum (relativistic), the shover's footing (also when he
  // takes no recoil of his own), and the catcher's stop
  { const cA = ctxOf(1e18 * g, { unbreakable: true, keepForm: true }), cB = Object.assign({}, ctxOf(1e4 * g, { unbreakable: true, keepForm: true }), { body: ollie }), aw = P.armWrestle(cA, cB);
    ok('5c: a fast arm-wrestling pin (its swing shorter than a limb\'s contact time) leaves the ground no net push: the swing\'s push and the slam cancel there', aw.pin && aw.pin.t < P.limbPulse(rex) && !aw.toGround && aw.pin.v > 0.1 * P.K.c, aw.pin ? sig(aw.pin.v / P.K.c) + ' c over ' + sig(aw.pin.t) + ' s' : aw.outcome);
    const awS = P.armWrestle(ctxOf(2e3 * g, { unbreakable: true, keepForm: true }), Object.assign({}, ctxOf(1e3 * g, { unbreakable: true, keepForm: true }), { body: ollie }));
    ok('5c: a slow pin (a swing longer than that) hands the ground the slam\'s momentum', awS.pin && !(awS.pin.t < P.limbPulse(rex)) ? !!awS.toGround && near(awS.toGround.J, P.vToMomentum(awS.pin.v, awS.pin.M), 1e-9) : true, awS.pin ? sig(awS.pin.t) + ' s swing' : awS.outcome);
    const s1 = P.shove(ctxOf(1e5 * g, { unbreakable: true }), Object.assign({}, ctxOf(1e5 * g, { unbreakable: true }), { body: ollie }));
    ok('5c: a shove with Unbreakable footing on (own recoil off): the shover\'s feet hand the ground his footing\'s push', s1.toGround && s1.toGround.J > 0 && s1.vA > 0, sig(s1.toGround.J) + ' kg m/s');
    const cR = ctxOf(1e6 * g, { unbreakable: true }), cO = Object.assign({}, cR, { body: ollie }), L = P.catchLeg(cR, cO, obj('car'), 30, 'hard');
    ok('5c: the catcher\'s stop goes into the ground (the car\'s momentum, less what he and it keep moving with)', L.toGroundC && L.toGroundC.J > 0 && L.toGroundC.J <= P.vToMomentum(L.vArrive, obj('car').m) * (1 + 1e-12)); }
}

// 5. 5d: They take their own recoil. Canon (CLAUDE.md, RT A7; BRIEF-canon.md item 2): the push back from their own moves
// goes into their source (the endless ocean), not into the planet, so they stay planted and the ground isn't shoved.
// Each move reports what its source takes back (recoilAbsorbed; recoilAbsorbedT and recoilAbsorbedC in the game of
// catch and the partner toss) only with the power on, and with it on nothing of his own push back reaches the ground.
{
  // the bus on ice (the presence test's case, a 100 t dial): no slide, and the push goes to his source
  { const c = ctxOf(1e5 * g, { surface: surf('ice') }), cr = Object.assign({ ownRecoil: true }, c);
    const a = P.throwObject(c, obj('bus'), 45), b = P.throwObject(cr, obj('bus'), 45);
    const o = { body: rex, surface: c.surface, anchor: 'friction', angle: 45, near: 5, obj: obj('bus') };
    const p = P.RESTRAINT.planNow('throw', cr, { obj: obj('bus'), angle: 45, target: 30, near: 5 });
    ok('5d: the bus on ice: no recoil and no slide with it on (it slides without)', b.recoilV === 0 && M.throw.slide(b, Object.assign({ ownRecoil: true }, o)) === 0 && M.throw.slide(a, o) > 5 && p.result('hazard:slide').never, 'off: slides ' + sig(M.throw.slide(a, o)) + ' m');
    ok('5d: ... and its push back goes to his source, not the planet: the momentum the bus keeps (the follow-through hands his arm\'s back), back along the throw line, over the push; nothing goes into the ground', !b.toGround && b.recoilAbsorbed && near(b.recoilAbsorbed.J, b.push.pB * obj('bus').m / b.mB, 1e-12) && b.recoilAbsorbed.J > 0 && b.recoilAbsorbed.T === b.push.t && b.recoilAbsorbed.thetaDeg === 45 && !a.recoilAbsorbed, b.recoilAbsorbed ? sig(b.recoilAbsorbed.J) + ' kg m/s' : 'none');
    // on concrete: with it on only the landing shakes the ground; with Unbreakable footing alone (his recoil not taken)
    // his push reaches the ground, shakes it, and adds to the landing (ice and steel have no ground-wave model)
    const conc = surf('concrete'), bc = P.throwObject(Object.assign({}, cr, { surface: conc }), obj('bus'), 45), oc = Object.assign({}, o, { surface: conc, ownRecoil: true });
    const srcOn = M.throw.shake(bc, oc), landOn = M.throw.landShake(bc, oc);
    ok('5d: on concrete with it on, his push shakes nothing: the shaking is the landing\'s alone, and it comes from the landing', !bc.toGround && !Array.isArray(srcOn) && P.ppvAt(srcOn, 5) === P.ppvAt(landOn, 5) && M.throw.shakeFrom(bc, oc) === 'landing', sig(P.ppvAt(srcOn, 5) * 1000) + ' mm/s at 5 m');
    const bu = P.throwObject(ctxOf(1e5 * g, { unbreakable: true }), obj('bus'), 45), ou = Object.assign({}, o, { surface: conc, unbreakable: true });
    const src = M.throw.shake(bu, ou), own = bu.toGround ? P.impulseSource(ou.surface, bu.toGround.J, Math.max(1e-9, bu.toGround.T)) : null;
    ok('5c: on concrete with Unbreakable footing alone (his recoil not taken), his push reaches the ground: it alone shakes it, and adds to the landing', !!own && !bu.recoilAbsorbed && Array.isArray(src) && P.ppvAt(own, 5) > 1e-5 && P.ppvAt(src, 5) >= P.ppvAt(M.throw.landShake(bu, ou), 5) && P.ppvAt(src, 5) === Math.max(P.ppvAt(own, 5), P.ppvAt(M.throw.landShake(bu, ou), 5)), own ? sig(P.ppvAt(own, 5) * 1000) + ' mm/s at 5 m from his push' : 'none'); }
  // the All-Star baseball doesn't move Rex
  { const r = P.throwObject(ctxOf(200e18 * 907.18474 * g, { ownRecoil: true }), obj('baseball'), 0), r0 = P.throwObject(ctxOf(200e18 * 907.18474 * g), obj('baseball'), 0);
    ok('5d: the All-Star baseball doesn\'t move Rex (it shoves him back at ' + (r0.recoilV / P.K.c).toFixed(4) + ' c without)', r.recoilV === 0 && r0.recoilV > 0.99 * P.K.c); }
  // punch and pull are his own pushes; a clap's two hands cancel; a jump and a sprint start are the move itself
  { const c = ctxOf(1e6 * g), cr = Object.assign({ ownRecoil: true }, c);
    const pu = P.punch(cr), pu0 = P.punch(c), pl = P.pull(cr, obj('bus')), pl0 = P.pull(c, obj('bus'));
    ok('5d: a punch: no lurch or recoil; its push back goes to his source over the stroke and the arm\'s stop hands it straight back, so no net push is kept by the ocean or the ground', pu.lurch === 0 && pu.recoilV === 0 && pu0.recoilV > 0 && !pu.toGround && !M.punch.shake && pu.recoilAbsorbed && pu.recoilAbsorbed.J === pu.push.pB && pu.recoilAbsorbed.returned === true && pu.recoilAbsorbed.thetaDeg === 0 && !pu0.recoilAbsorbed);
    const plB = P.pull(Object.assign({}, cr, { anchor: 'bolted' }), obj('bus')), plB0 = P.pull(Object.assign({}, c, { anchor: 'bolted' }), obj('bus'));
    // (review round 2: the power wins over Bolted for his own moves, so a bolted pull follows its rule too: his bolted
    // feet never slide, and the bus is heavier than he is, so his legs keep up (review round 3) and the load sets the
    // pace, (drive - resistance) / the load's mass, not the pair's)
    ok('5d: a bolted pull with They take their own recoil on: the rope\'s pull back goes to his source, not through his bolts into the planet (for his own moves the power wins over Bolted), and the load sets the pace: (his drive - the resistance) / the load\'s mass, his bolted feet keeping his own body with it', plB.canMove && plB.ropeT > 0 && plB.recoilAbsorbed && near(plB.recoilAbsorbed.J, plB.ropeT * plB.t10m, 1e-12) && plB.recoilAbsorbed.T === plB.t10m && !plB0.recoilAbsorbed && plB.footLimited === false && plB.usable === c.F && near(plB.accel, (plB.usable - plB.resist) / obj('bus').m, 1e-12) && near(plB.ropeT, plB.usable, 1e-12) && near(plB.accel * obj('bus').m, plB0.accel * (obj('bus').m + rex.m), 1e-9), plB.recoilAbsorbed ? sig(plB.recoilAbsorbed.J) + ' kg m/s; a ' + sig(plB.accel) + ' m/s2 (the pair\'s pace, bolted alone: ' + sig(plB0.accel) + ')' : 'none');
    // his own steps (walking with the load: the move, not recoil) push the ground with his own body's momentum over the
    // pull: with the power on, the pull's shaking source (walkPush), reported only then; on friction his grip caps it
    // (bolted, only his legs do: the next check but one)
    const conc = surf('concrete'), oPl = (x) => Object.assign({ obj: obj('bus'), surface: conc, body: rex, near: 5 }, x);
    const walkOk = (r) => r.walkPush && near(r.walkPush.J, P.vToMomentum(r.vEnd, rex.m), 1e-9) && r.walkPush.T === r.t10m && P.ppvAt(M.pull.shake(r, oPl({ ownRecoil: true })), 5) === P.ppvAt(P.impulseSource(conc, r.walkPush.J, r.walkPush.T), 5);
    ok('5d: a pull with it on: the rope\'s pull back (the bus\'s momentum and the rolling resistance) goes to his source over the pull; the shaking is his own steps\' (his own body\'s momentum over the pull, real), capped by his grip on friction; bolted only his legs cap it (the bus needs less than the strength he uses); with it off the lab counts no pull\'s shaking (as before the power)', M.pull.shakeWithPower === 'ownRecoil' && P.RESTRAINT.shakeOff(M.pull, { ownRecoil: false }) && !P.RESTRAINT.shakeOff(M.pull, { ownRecoil: true }) && M.pull.shake(pl0, oPl({ ownRecoil: false })) === null && !pl0.walkPush && !plB0.walkPush && walkOk(pl) && walkOk(plB) && pl.walkPush.J / pl.walkPush.T <= pl.anchor.R * (1 + 1e-12) && plB.walkPush.J / plB.walkPush.T > 10 * pl.anchor.R && pl.recoilAbsorbed && near(pl.recoilAbsorbed.J, P.vToMomentum(pl.vEnd, obj('bus').m) + pl.resist * pl.t10m, 1e-9) && pl.recoilAbsorbed.T === pl.t10m && pl.recoilAbsorbed.thetaDeg === 0 && !pl0.recoilAbsorbed && near(pl.ropeT, obj('bus').m * pl.accel + pl.resist, 1e-12) && pl.ropeT < pl.usable && P.RESTRAINT.reach('pull', pl, oPl({ ownRecoil: true })).plaster === 0 && P.RESTRAINT.reach('pull', plB, oPl({ ownRecoil: true })).plaster > 5, 'rope ' + sig(pl.ropeT) + ' N of ' + sig(pl.usable) + ' N; ' + (pl.recoilAbsorbed ? sig(pl.recoilAbsorbed.J) + ' kg m/s to his source' : 'none') + '; steps ' + (pl.walkPush ? sig(pl.walkPush.J) + ' kg m/s, bolted ' + sig(plB.walkPush && plB.walkPush.J) : 'none'));
    ok('5d: a pull: the load\'s pull back goes to his source (his whole drive pulls it); his own legs still walk on friction', pl.usable === c.F && pl0.usable === pl0.anchor.R && pl.accel <= pl.anchor.R / rex.m * (1 + 1e-12) && pl.accel > pl0.accel && pl.footLimited, 'a ' + sig(pl.accel) + ' vs ' + sig(pl0.accel) + ' m/s2, feet allow ' + sig(pl.anchor.R / rex.m));
    // review round 3 (physics-bolted-pull-legs-unbounded): Bolted removes the footing limit, not the muscle limit. With
    // the power on his feet push his own body with at most his legs' push, the strength he uses (the Sprint tab's
    // push-off: review round 3's re-check, fixes-pull-legs-vs-sprint; the 1.4x leg rule is for carrying weight up), on
    // either footing and at any effort; on friction his grip caps it too. Light loads (the car, the motorcycle, the
    // baseball at the default dial), all-out and at 30 kg-force (the least-disruptive floor): walkPush.J / walkPush.T <=
    // the strength he uses; where his own body sets the pace (footLimited: all-out always, and at 30 kg-force here) it is
    // exactly the cap: bolted his legs' full push, on friction the smaller of it and his grip; all-out that pace is the
    // Sprint tab's push-off / his mass (bolted and on friction), so a towed load never out-accelerates his sprint; the
    // bus, heavier than he is, keeps the load's pace bolted
    { const bad = [], seen = [];
      for (const anchor of ['bolted', 'friction']) for (const id of ['car', 'motorcycle', 'baseball']) for (const use of [null, 30 * g]) {
        const cc = Object.assign(ctxOf(90718.474 * g, Object.assign({ anchor }, ON)), use ? { use } : {}), r = P.pull(cc, obj(id)), tag = anchor + ' ' + id + (use ? ' at 30 kg-force' : ' all-out');
        if (!r.canMove || !r.walkPush) { bad.push(tag + ': does not move'); continue; }
        const legs = r.walkPush.J / r.walkPush.T, cap = Math.min(r.anchor.R, r.usable);
        seen.push(tag + ' ' + sig(legs / r.usable) + 'x');
        if (!(legs <= r.usable * (1 + 1e-12))) bad.push(tag + ': his legs push ' + sig(legs / r.usable) + 'x the strength he uses');
        if (!(r.accel <= cap / rex.m * (1 + 1e-12))) bad.push(tag + ': a ' + sig(r.accel) + ' m/s2 past his feet\'s ' + sig(cap / rex.m));
        if (!(r.footLimited && near(r.accel, cap / rex.m, 1e-12) && near(legs, cap, 1e-9))) bad.push(tag + ': not his own body\'s pace at his feet\'s cap (a ' + sig(r.accel) + ', feet ' + sig(cap / rex.m) + ', legs ' + sig(legs / r.usable) + 'x)');
        if (!use) { const sp = P.sprint(cc); if (!near(r.accel, sp.accel, 1e-12)) bad.push(tag + ': a ' + sig(r.accel) + ' m/s2, not the Sprint tab\'s push-off ' + sig(sp.accel)); }
      }
      const bb = P.pull(ctxOf(90718.474 * g, Object.assign({ anchor: 'bolted' }, ON)), obj('bus'));
      if (bb.footLimited || !near(bb.accel, (bb.usable - bb.resist) / obj('bus').m, 1e-12) || !(bb.walkPush && bb.walkPush.J / bb.walkPush.T < bb.usable)) bad.push('bolted bus: should keep the load\'s pace under his legs\' cap');
      ok('5d: with They take their own recoil on, his legs cap his feet\'s push on his own body at the strength he uses (the Sprint tab\'s push-off), bolted and on friction, all-out and at 30 kg-force (the car, the motorcycle and the baseball at the default dial); a light load is pulled at his own body\'s pace, all-out the Sprint tab\'s; the bolted bus keeps the load\'s', !bad.length, bad.length ? bad.join('; ') : seen.join(', ')); }
    const cl = P.clap(cr), cl0 = P.clap(c), j = P.jump(cr), j0 = P.jump(c), sp = P.sprint(cr), sp0 = P.sprint(c);
    ok('5d: a clap, a jump and a sprint are unchanged', cl.vHand === cl0.vHand && j.v === j0.v && sp.vTop === sp0.vTop && !cl.recoilAbsorbed && !j.recoilAbsorbed && !sp.recoilAbsorbed);
    const st = P.stomp(ctxOf(1e8 * g, { ownRecoil: true })), st0 = P.stomp(ctxOf(1e8 * g)), stL = P.stomp(ctxOf(1e8 * g, { ownRecoil: true, stompLaunch: true }));
    ok('5d: a stomp no longer launches him (except the Collide tab\'s stomp-launch, which is the point)', st.vBody === 0 && st0.vBody > 0 && stL.vBody === st0.vBody);
    const stB = P.stomp(ctxOf(1e8 * g, { ownRecoil: true, anchor: 'bolted' })), stB0 = P.stomp(ctxOf(1e8 * g, { anchor: 'bolted' }));
    ok('5d: ... its upward push on him (the foot\'s momentum, as he is held) goes to his source, pointing up, bolted too; not with it off, nor in the stomp-launch; the foot\'s blow on the ground is unchanged', st.recoilAbsorbed && st.recoilAbsorbed.J === st.push.pB && st.recoilAbsorbed.T === st.push.t && st.recoilAbsorbed.thetaDeg === -90 && stB.recoilAbsorbed && stB.recoilAbsorbed.J === stB.push.pB && !st0.recoilAbsorbed && !stB0.recoilAbsorbed && !stL.recoilAbsorbed && st.vFoot === stB0.vFoot && P.ppvAt(M.stomp.shake(st, { surface: surf('concrete'), body: rex, ownRecoil: true }), 5) === P.ppvAt(M.stomp.shake(stB0, { surface: surf('concrete'), body: rex }), 5), st.recoilAbsorbed ? sig(st.recoilAbsorbed.J) + ' kg m/s' : 'none');
    const cOn = Object.assign(ctxOf(1e7 * g, { ownRecoil: true }), { body: ollie }), cOff = Object.assign(ctxOf(1e7 * g), { body: ollie });
    const coL = P.collide(cOn, ctxOf(1e7 * g, { ownRecoil: true }), { source: 'stomp' }), coL0 = P.collide(cOff, ctxOf(1e7 * g), { source: 'stomp' });
    ok('5d: the Collide tab\'s stomp-launch charge is the same with it on', !coL.noCharge && coL.v0 === coL0.v0 && coL.v0 > 1, sig(coL.v0) + ' m/s'); }
  // two players: his own shove and throws, yes; being pushed (the shoving match, arm wrestling, Collide), no
  { const cR = ctxOf(1e6 * g), cO = Object.assign({}, cR, { body: ollie }), cRr = Object.assign({ ownRecoil: true }, cR), cOr = Object.assign({ ownRecoil: true }, cO);
    const sh = P.shove(cRr, cOr), sh0 = P.shove(cR, cO);
    ok('5d: the shover doesn\'t recoil; the partner he shoves keeps his own footing', sh.vA === 0 && sh0.vA > 0 && sh.vB > 0);
    const fB = P.anchorCapacity({ body: ollie, surface: cO.surface, theta: 0, anchor: cO.anchor, groundHolds: P.holdsGround(cOr), mA: ollie.m }).R;
    ok('5d: with only They take their own recoil on, the shove\'s push back goes to his source (his partner\'s momentum plus what his partner\'s footing took during the push), pointing away from his partner; nothing from his feet into the ground', !sh.toGround && sh.recoilAbsorbed && near(sh.recoilAbsorbed.J, P.vToMomentum(sh.vB, ollie.m) + fB * sh.push.t, 1e-6) && sh.recoilAbsorbed.thetaDeg === 0 && !sh0.recoilAbsorbed && !sh0.toGround, sh.recoilAbsorbed ? sig(sh.recoilAbsorbed.J) + ' kg m/s' : 'none');
    // the partner toss: his push and his catch go to his source with their powers on (Q5), into the ground with
    // Unbreakable footing alone, and neither is reported with them off
    const tp = P.tossPartner(Object.assign({}, cR, ON), ollie, 'Ollie', 'hard', 10, 'friction'), tp0 = P.tossPartner(cR, ollie, 'Ollie', 'hard', 10, 'friction'), tpU = P.tossPartner(Object.assign({}, cR, ON, { ownRecoil: false }), ollie, 'Ollie', 'hard', 10, 'friction');
    const tOk = (t) => t.recoilAbsorbedT && near(t.recoilAbsorbedT.J, P.vToMomentum(t.v, ollie.m), 1e-9) && t.recoilAbsorbedT.thetaDeg === 90 && !t.toGroundT && (t.result !== 'caught' || (t.recoilAbsorbedC && near(t.recoilAbsorbedC.J, P.vToMomentum(t.flight.vImpact, ollie.m), 1e-12) && t.recoilAbsorbedC.angleDeg === 90 && !t.toGroundC && t.catch.uAfter === 0));
    ok('5d: tossing Ollie up and catching him with their powers on: the toss\'s push back and the catch\'s stop go to his source (his partner\'s momentum each way, straight down), none into the ground; with Unbreakable footing alone both go into the ground; with them off neither is reported', tp.result === 'caught' && tOk(tp) && tpU.toGroundT && tpU.toGroundT.J > 0 && tpU.toGroundC && tpU.toGroundC.J > 0 && !tpU.recoilAbsorbedT && !tpU.recoilAbsorbedC && !tp0.toGroundT && !tp0.toGroundC && !tp0.recoilAbsorbedT && !tp0.recoilAbsorbedC, tp.result + (tp.recoilAbsorbedT ? ': ' + sig(tp.recoilAbsorbedT.J) + ' / ' + sig(tp.recoilAbsorbedC && tp.recoilAbsorbedC.J) + ' kg m/s' : ''));
    // (the shoving match, arm wrestling and Collide with the power on are contests: section 8, pull request 4)
    const L = P.catchLeg(cRr, cOr, obj('car'), 30, 'hard'), L0 = P.catchLeg(cR, cO, obj('car'), 30, 'hard');
    ok('5d: in the game of catch the thrower isn\'t shoved back', L.recoil.v === 0 && L0.recoil.v > 0, 'thrower off: ' + sig(L0.recoil.v) + ' m/s');
    // the catcher's stop is his own push back too (canon: a catch is absorbed, unless he chooses otherwise): planted
    const k1 = P.catchIt(cOr, obj('car'), 60, 10, null), k0 = P.catchIt(cO, obj('car'), 60, 10, null);
    ok('5d: the catcher takes his own stop (a car at 60 m/s, 10^6 kg dial): planted, no slip, no slide, never carried off; with it off his feet slide', k1.slide === 0 && k1.uAfter === 0 && !k1.slips && !k1.carried && k1.R === Infinity && k0.slips && k0.slide > 1 && k0.uAfter > 0, 'off: slides ' + sig(k0.slide) + ' m at ' + sig(k0.uAfter) + ' m/s');
    ok('5d: ... in the game of catch the whole stop goes to his source along the car\'s arrival, none into the ground, and he doesn\'t slide', L.catch && L.catch.slide === 0 && L.catch.uAfter === 0 && !L.toGroundC && L.recoilAbsorbedC && near(L.recoilAbsorbedC.J, P.vToMomentum(L.vArrive, obj('car').m), 1e-12) && L.recoilAbsorbedC.angleDeg === L.angleDeg && L.recoilAbsorbedC.T === L.catch.tStroke && L0.catch.slide > 0 && !L0.recoilAbsorbedC, L.result + (L.recoilAbsorbedC ? ': ' + sig(L.recoilAbsorbedC.J) + ' kg m/s' : ''));
    // the thrower's push back is the Throw tab's: the object and his throwing hand's momentum, less his recoil (none)
    const Lb = P.catchLeg(cRr, cOr, obj('baseball'), 10, 'hard'), tb = P.throwObject(cRr, obj('baseball'), Lb.aim.thetaDeg);
    ok('5d: the catch thrower\'s push back goes to his source and matches the Throw tab\'s for the same throw (the ball\'s momentum: his arm\'s comes back in the follow-through); nothing into the ground', !Lb.toGroundT && Lb.recoilAbsorbedT && tb.recoilAbsorbed && near(Lb.recoilAbsorbedT.J, tb.recoilAbsorbed.J, 1e-9) && near(Lb.recoilAbsorbedT.J, P.vToMomentum(Lb.aim.vL, obj('baseball').m), 1e-6) && Lb.recoilAbsorbedT.thetaDeg === Lb.aim.thetaDeg, Lb.recoilAbsorbedT ? sig(Lb.recoilAbsorbedT.J) + ' kg m/s' : 'none');
    // ... with Unbreakable footing alone the same push goes into the ground under him
    const cRu = Object.assign({ unbreakable: true }, cR), LbU = P.catchLeg(cRu, Object.assign({ unbreakable: true }, cO), obj('baseball'), 10, 'hard'), tbU = P.throwObject(cRu, obj('baseball'), LbU.aim.thetaDeg);
    ok('5c: with Unbreakable footing alone the catch thrower\'s push goes into the ground (the Throw tab\'s push for the same throw)', LbU.toGroundT && tbU.toGround && near(LbU.toGroundT.J, tbU.toGround.J, 1e-9) && !LbU.recoilAbsorbedT, LbU.toGroundT ? sig(LbU.toGroundT.J) + ' kg m/s' : 'none');
    // a throw that ends in a fireball: the thrower still pushed (the Throw tab's push), to his source
    const cRf = ctxOf(1e20 * g, { airAbsorb: 0.5, ownRecoil: true }), Lf = P.catchLeg(cRf, Object.assign({}, cRf, { body: ollie }), obj('baseball'), 1000, 'hard'), tf = Lf.result === 'fireball' ? P.throwObject(cRf, obj('baseball'), Lf.thetaDeg) : null;
    ok('5d: a catch throw that becomes a fireball: the thrower\'s push back still goes to his source (the Throw tab\'s), none into the ground', Lf.result === 'fireball' && !Lf.toGroundT && Lf.recoilAbsorbedT && tf && tf.recoilAbsorbed && near(Lf.recoilAbsorbedT.J, tf.recoilAbsorbed.J, 1e-9), Lf.result); }
}

// 5e. They take their own recoil, the rest of BRIEF-canon.md item 2 (pull request 2's decisions): the power wins over
// Bolted for his own moves; his feet carry only the weights; the catcher is never carried off; the throw's shaking is
// its landing's alone; the arm-wrestle pin's slam reaches the ground whole at any swing time
{
  const conc = surf('concrete'), Nmax = (sf, B) => P.qultFor(sf, (B || rex).footB) * 2 * (B || rex).footArea;
  // own recoil wins over Bolted for his own moves: with both on the push back goes to his source, not through the bolts
  { const cB = ctxOf(1e6 * g, Object.assign({}, ON, { anchor: 'bolted' })), r = P.throwObject(cB, obj('car'), 45), sh = P.shove(cB, Object.assign(ctxOf(1e6 * g, ON), { body: ollie }));
    const cB0 = ctxOf(1e6 * g, { anchor: 'bolted' }), r0 = P.throwObject(cB0, obj('car'), 45);
    ok('5d: bolted with They take their own recoil on, a throw\'s and a shove\'s push back go to his source, not through his bolts (bolted alone, nothing is reported, as before)', !r.toGround && r.recoilAbsorbed && near(r.recoilAbsorbed.J, r.push.pB * obj('car').m / r.mB, 1e-12) && !sh.toGround && sh.recoilAbsorbed && sh.recoilAbsorbed.J > 0 && !r0.toGround && !r0.recoilAbsorbed); }
  // his feet carry only the weights (his own and the load's he holds): the push back isn't on them
  { const sets = [['own recoil only', { ownRecoil: true }], ['all four on', ON]], bad = [];
    for (const [lab, x] of sets) for (const [oid, th] of [['car', 45], ['bus', 30], ['piano', 60], ['car', 90]]) {
      const c = ctxOf(1e9 * g, x), r = P.throwObject(c, obj(oid), th), bear = Nmax(conc), want = (rex.m + obj(oid).m) * g / bear;
      const got = x.unbreakable ? r.sinkRatioRaw : r.sinkRatio;
      if (!(r.canMove && near(got, want, 1e-12) && (x.unbreakable ? r.sinkRatio === 0 : true))) bad.push(lab + ' ' + oid + ' ' + th + ': ' + sig(got) + ' vs ' + sig(want));
    }
    const r0 = P.throwObject(ctxOf(1e9 * g), obj('car'), 45), rU = P.throwObject(ctxOf(1e9 * g, { unbreakable: true }), obj('car'), 45);
    ok('5d: with They take their own recoil on, his feet carry only his weight and the load\'s (a car at 45 degrees and more at a 10^9 kg dial): the push back isn\'t on them; with it off (Unbreakable footing alone too) the push drives them down past what concrete bears', !bad.length && r0.sinkRatio > 1 && rU.sinkRatioRaw > 1, bad.join('; ') || 'car 45: off ' + sig(r0.sinkRatio) + 'x the bearing, on ' + sig((rex.m + obj('car').m) * g / Nmax(conc)) + 'x');
    // ... the same in the wrestle throw (his partner held up is weight, not recoil: decision 3)
    const wbad = [];
    for (const [lab, x] of sets) { const c = ctxOf(1e9 * g, x), t = P.throwPartner(c, Object.assign({}, c, { body: ollie }), 45), want = (rex.m + ollie.m) * g / Nmax(conc);
      if (!(t.r && t.r.canMove && near(x.unbreakable ? t.r.sinkRatioRaw : t.r.sinkRatio, want, 1e-12))) wbad.push(lab + ': ' + sig(t.r && (x.unbreakable ? t.r.sinkRatioRaw : t.r.sinkRatio)) + ' vs ' + sig(want)); }
    const tw0 = P.throwPartner(ctxOf(1e9 * g), Object.assign(ctxOf(1e9 * g), { body: ollie }), 45);
    ok('5d: ... and in the wrestle throw (Ollie thrown at 45 degrees at a 10^9 kg dial): with it on his feet carry only his weight and Ollie\'s; with it off the push drives them down past what concrete bears', !wbad.length && tw0.r.sinkRatio > 1, wbad.join('; ') || 'off ' + sig(tw0.r.sinkRatio) + 'x the bearing');
    // so his throw can't break the ground under him with it on: the ground hazard (own recoil alone) and the break-the-ground
    // preset (all four on: it sets Unbreakable footing aside, not his recoil) are never; with it off both are found
    const o = { obj: obj('car'), angle: 45, target: 30 }, pOR = P.RESTRAINT.planNow('throw', ctxOf(1e9 * g, { ownRecoil: true }), o), pON = P.RESTRAINT.planNow('throw', ctxOf(1e9 * g, ON), o), p0 = P.RESTRAINT.planNow('throw', ctxOf(1e9 * g), o), pU = P.RESTRAINT.planNow('throw', ctxOf(1e9 * g, { unbreakable: true }), o);
    ok('5d: ... so with it on his throw never breaks the ground under him (a car at 45 degrees, 10^9 kg dial): the ground hazard and the "break the ground" preset are never; with it off both are found', pOR.result('hazard:ground').never && pON.result('preset:ground').never && !p0.result('hazard:ground').never && !pU.result('preset:ground').never, 'off: ' + sig(p0.result('hazard:ground').use / g) + ' kg-force'); }
  // the catch's stop and the partner toss: the catcher's feet carry only his weight and its, with the power on
  { const cO = Object.assign(ctxOf(1e6 * g, { ownRecoil: true }), { body: ollie }), k = P.catchIt(cO, obj('car'), 60, 30, null), k0 = P.catchIt(Object.assign({}, cO, { ownRecoil: false }), obj('car'), 60, 30, null);
    const t = P.tossPartner(ctxOf(1e9 * g, { ownRecoil: true }), ollie, 'Ollie', 'hard', 10, 'friction'), t0 = P.tossPartner(ctxOf(1e9 * g), ollie, 'Ollie', 'hard', 10, 'friction');
    ok('5d: the catcher\'s feet carry only his weight and the object\'s with his recoil taken (a car at 60 m/s coming down at 30 degrees; Rex catching a tossed Ollie at 10^9 kg); with it off the stop presses them too', near(k.sinkRatio, (ollie.m + obj('car').m) * g / Nmax(conc, ollie), 1e-12) && k0.sinkRatio > k.sinkRatio && t.catch && near(t.catch.sinkRatio, (rex.m + ollie.m) * g / Nmax(conc), 1e-12) && t0.catch.sinkRatio > 1, sig(t0.catch.sinkRatio) + 'x the bearing with it off, ' + sig(t.catch.sinkRatio) + 'x on');
    // (review round 2) ... and with Unbreakable footing on too (all four on, the page's default), where the engine reports
    // what real ground would bear (sinkRatioRaw): still the weights only, not his stop's push back; with his recoil not
    // taken (Unbreakable footing alone) the stop presses them
    const cOU = Object.assign(ctxOf(1e6 * g, ON), { body: ollie }), kU = P.catchIt(cOU, obj('car'), 60, 30, null), kU0 = P.catchIt(Object.assign({}, cOU, { ownRecoil: false }), obj('car'), 60, 30, null);
    const tU = P.tossPartner(ctxOf(1e9 * g, ON), ollie, 'Ollie', 'hard', 10, 'friction'), tU0 = P.tossPartner(ctxOf(1e9 * g, Object.assign({}, ON, { ownRecoil: false })), ollie, 'Ollie', 'hard', 10, 'friction');
    ok('5d: ... with Unbreakable footing on too (all four on), the load real ground would bear under the catcher (sinkRatioRaw) is the weights only: the car at 60 m/s on Ollie at 10^6 kg, and Rex catching a tossed Ollie at 10^9 kg; with his recoil not taken his stop presses them', near(kU.sinkRatioRaw, (ollie.m + obj('car').m) * g / Nmax(conc, ollie), 1e-12) && kU0.sinkRatioRaw > kU.sinkRatioRaw * 1.5 && tU.catch && near(tU.catch.sinkRatioRaw, (rex.m + ollie.m) * g / Nmax(conc), 1e-12) && tU0.catch && tU0.catch.sinkRatioRaw > 1, 'on ' + sig(kU.sinkRatioRaw) + ' / ' + sig(tU.catch && tU.catch.sinkRatioRaw) + 'x; off ' + sig(kU0.sinkRatioRaw) + ' / ' + sig(tU0.catch && tU0.catch.sinkRatioRaw) + 'x'); }
  // the catcher is never carried off with it on: the All-Star fastball at a 10^20 kg dial; with it off he is (as before)
  { const cR = ctxOf(1e20 * g, ON), L = P.catchLeg(cR, Object.assign({}, cR, { body: ollie }), obj('baseball'), 10, 'hard');
    const c0 = ctxOf(1e20 * g, Object.assign({}, ON, { ownRecoil: false })), L0 = P.catchLeg(c0, Object.assign({}, c0, { body: ollie }), obj('baseball'), 10, 'hard');
    ok('5d: a catch past 1% of light speed (a fastball at a 10^20 kg dial): with his recoil taken he is planted and its whole momentum goes to his source, all its motion energy freed at the catch; with it off it carries him off', L.result === 'caught' && L.catch.relativistic && !L.catch.carried && L.catch.uAfter === 0 && L.catch.slide === 0 && L.recoilAbsorbedC && L.recoilAbsorbedC.J === L.catch.pIn && !L.toGroundC && near(L.catch.Ecatch, P.momentumToKE(L.catch.pIn, obj('baseball').m), 1e-9) && L0.catch && L0.catch.carried && L0.catch.uAfter > 0.01 * P.K.c, 'off: carried off at ' + sig(L0.catch && L0.catch.uAfter / 1000) + ' km/s');
    // the round trip: planted, the stroke isn't forced, so it is the throws and flights alone (at 10^9: a fastball)
    const c9 = ctxOf(1e9 * g, ON), G = P.catchGame(c9, Object.assign({}, c9, { body: ollie }), obj('baseball'), 10, 'hard');
    ok('5d: in the game of catch with their recoil taken neither catcher slips, so the round trip is the throws and the flights (a fastball 10 m apart at 10^9 kg)', G.a.result === 'caught' && G.b.result === 'caught' && !G.a.catch.slips && !G.b.catch.slips && G.round > 0 && isFinite(G.round), sig(G.round) + ' s'); }
  // every outcome where the object reaches him, with the catcher's power on: planted, the whole stop to his source,
  // nothing into the ground. At unlimited strength (no arms can stop it; it slams into him), a catch he can't hold up
  // (Rex at 10^5 kg lobs a car 30 m to Ollie at 500 kg) and wreckage (a motorcycle fastball 10 m apart at 10^6 kg, Things
  // keep their form off); with his power off (Unbreakable footing on) he slides, is carried off, or his stop goes into
  // the ground as before
  { const bad = [], pOf = (L) => P.vToMomentum(L.vArrive, L.obj ? L.obj.m : 0);
    const planted = (L) => L.catch && L.catch.uAfter === 0 && L.catch.slide === 0 && !L.catch.carried && !L.toGroundC;
    const cI = ctxOf(Infinity, ON), LI = P.catchLeg(cI, Object.assign({}, cI, { body: ollie }), obj('baseball'), 10, 'hard');
    const cIo = ctxOf(Infinity, Object.assign({}, ON, { ownRecoil: false })), LIo = P.catchLeg(cIo, Object.assign({}, cIo, { body: ollie }), obj('baseball'), 10, 'hard');
    if (!(LI.result === 'slams' && planted(LI) && LI.recoilAbsorbedC && LI.recoilAbsorbedC.J === Infinity && near(LI.catch.sinkRatioRaw, (ollie.m + obj('baseball').m) * g / Nmax(conc, ollie), 1e-9) && LIo.catch.carried && !LIo.recoilAbsorbedC))
      bad.push('unlimited: ' + JSON.stringify({ result: LI.result, carried: LI.catch && LI.catch.carried, uAfter: LI.catch && LI.catch.uAfter, sinkRatioRaw: LI.catch && LI.catch.sinkRatioRaw, J: LI.recoilAbsorbedC && LI.recoilAbsorbedC.J, offCarried: LIo.catch && LIo.catch.carried }));
    for (const [lab, x, kgT, kgC, oid, Dd, style, want] of [['a catch he can\'t hold', {}, 1e5, 500, 'car', 30, 'easy', 'cant-hold-it'], ['wreckage', { keepForm: false }, 1e6, 1e6, 'motorcycle', 10, 'hard', 'wreckage']]) {
      const leg = (own) => { const st = Object.assign({}, ON, x, { ownRecoil: own }), cT = ctxOf(kgT * g, st); return P.catchLeg(cT, Object.assign(ctxOf(kgC * g, st), { body: ollie }), obj(oid), Dd, style); };
      const L = leg(true), L0 = leg(false);
      L.obj = L0.obj = obj(oid);
      if (!(L.result === want && planted(L) && L.recoilAbsorbedC && near(L.recoilAbsorbedC.J, pOf(L), 1e-9) && L.recoilAbsorbedC.angleDeg === (L.angleDeg || 0) && L0.result === want && !L0.recoilAbsorbedC && L0.catch.slide > 0 && (want !== 'wreckage' || (L0.toGroundC && L0.toGroundC.J > 0))))
        bad.push(lab + ': ' + JSON.stringify({ result: L.result, J: L.recoilAbsorbedC && L.recoilAbsorbedC.J, want: pOf(L), toGroundC: !!L.toGroundC, uAfter: L.catch && L.catch.uAfter, off: L0.result, offJ: L0.toGroundC && L0.toGroundC.J }));
    }
    ok('5d: with the catcher\'s recoil taken, every outcome where it reaches him leaves him planted with the whole stop in his source and none in the ground: an unlimited fastball that slams into him (his feet carry only the weights), a catch he can\'t hold up, wreckage; with it off he is carried off, slides, or (wreckage, Unbreakable footing on) his stop goes into the ground', !bad.length, bad.join('; ')); }
  // planting the catcher: his arms stop the full arrival speed, so a hard catch can turn into a slam (a bus thrown hard
  // 10 m apart at the default dial): a consequence, reported
  { const cR = ctxOf(100 * 907.18474 * g, ON), cO = Object.assign({}, cR, { body: ollie }), L = P.catchLeg(cR, cO, obj('bus'), 10, 'hard');
    const c0 = ctxOf(100 * 907.18474 * g, Object.assign({}, ON, { ownRecoil: false })), L0 = P.catchLeg(c0, Object.assign({}, c0, { body: ollie }), obj('bus'), 10, 'hard');
    ok('5d: planted, the catcher\'s arms stop all of it: a bus thrown hard 10 m apart at the default dial slams into him (with his feet free to slide, his arms could stop it); his source still takes the whole stop', L.result === 'slams' && L.catch.vSlam > 0 && L.catch.uAfter === 0 && L.recoilAbsorbedC && near(L.recoilAbsorbedC.J, P.vToMomentum(L.vArrive, obj('bus').m), 1e-12) && L0.result === 'caught', L.result + ' at ' + sig(L.catch.vSlam) + ' m/s; off: ' + L0.result); }
  // the throw's shaking: with the power on only the landing, never 'him'; with Unbreakable footing alone, heavy flat
  // throws are shaken hardest by his push (so the test can tell them apart)
  { const bad = []; let him = 0;
    for (const sid of ['concrete', 'gravel', 'granite']) for (const oid of ['bus', 'semi', 'loco', 'car']) for (const th of [0, 45]) for (const lg of [5, 9]) {
      const sfc = surf(sid), c = ctxOf(Math.pow(10, lg) * g, Object.assign({}, ON, { surface: sfc })), r = P.throwObject(c, obj(oid), th), o = Object.assign({ obj: obj(oid), angle: th, surface: sfc, body: rex, near: 5 }, ON);
      if (!r.canMove) continue;
      const s = M.throw.shake(r, o), land = M.throw.landShake(r, o);
      if (r.toGround || Array.isArray(s) || M.throw.shakeFrom(r, o) !== 'landing' || P.ppvAt(s, 5) !== P.ppvAt(land, 5)) bad.push(oid + ' ' + th + ' ' + sid + ' 1e' + lg);
      const cU = ctxOf(Math.pow(10, lg) * g, { unbreakable: true, surface: sfc }), rU = P.throwObject(cU, obj(oid), th), oU = { obj: obj(oid), angle: th, surface: sfc, body: rex, near: 5, unbreakable: true };
      if (rU.canMove && M.throw.shakeFrom(rU, oU) === 'him') him++;
    }
    const esc = P.throwObject(ctxOf(1e12 * g, ON), obj('car'), 45);
    ok('5d: with their powers on a throw\'s shaking is its landing\'s alone, never his push\'s (heavy and light throws, flat and at 45 degrees, on concrete, gravel and granite); a throw that never comes down shakes nothing; with Unbreakable footing alone his push is the larger in ' + him + ' of them', !bad.length && him > 0 && esc.flight.escaped && M.throw.shake(esc, Object.assign({ obj: obj('car'), angle: 45, surface: conc, body: rex }, ON)) === null, bad.slice(0, 4).join('; ')); }
  // the arm-wrestle pin with the winner's recoil taken: the slam reaches the ground whole at any swing time
  { const pinAt = (FA, FB, x) => P.armWrestle(ctxOf(FA, Object.assign({ keepForm: true }, x)), Object.assign(ctxOf(FB, Object.assign({ keepForm: true }, x)), { body: ollie }));
    const fromE = (E, Mf) => Math.sqrt(E * E + 2 * E * Mf * P.K.c * P.K.c) / P.K.c;
    const dial = 100 * 907.18474 * g, a = pinAt(dial, dial / 2, ON), aU = pinAt(dial, dial / 2, { unbreakable: true }), aR = pinAt(dial, dial / 2, { ownRecoil: true });
    ok('5d: a quick arm-wrestling pin (its swing shorter than a limb\'s contact time), the winner taking his own recoil: the swing\'s push back goes to his source (up), so the slam\'s blow reaches the ground whole with Unbreakable footing, through his legs over a limb\'s contact time (not the swing\'s); without the power the two cancel there (no net push)', a.outcome === 'pin' && a.pin.t < P.limbPulse(rex) && a.toGround && a.recoilAbsorbed && near(a.toGround.J, fromE(a.pin.E, a.pin.M), 1e-12) && a.recoilAbsorbed.J === a.toGround.J && a.toGround.T === P.limbPulse(rex) && a.recoilAbsorbed.thetaDeg === -90 && a.recoilAbsorbed.T === a.pin.t && !aU.toGround && !aU.recoilAbsorbed && aR.recoilAbsorbed && !aR.toGround, a.toGround ? sig(a.toGround.J) + ' kg m/s over ' + sig(a.toGround.T) + ' s' : a.outcome);
    // near light speed the slam's momentum follows its energy (the rounded speed would freeze it): Rex at 10^26 and
    // 10^30 kg against Ollie at 10^4 kg
    const bad = [];
    for (const lg of [26, 30]) { const r = pinAt(Math.pow(10, lg) * g, 1e4 * g, ON), want = fromE(r.pin.E, r.pin.M);
      if (!(r.outcome === 'pin' && r.toGround && near(r.toGround.J, want, 1e-9) && r.toGround.T === P.limbPulse(rex) && r.recoilAbsorbed.J === r.toGround.J && (lg < 30 || r.toGround.J > 100 * P.vToMomentum(r.pin.v, r.pin.M)))) bad.push('1e' + lg + ': ' + sig(r.toGround && r.toGround.J) + ' vs ' + sig(want) + ' over ' + sig(r.toGround && r.toGround.T) + ' s'); }
    ok('5d: past 1% of light speed the pin\'s momentum follows its energy (Rex at 10^26 and 10^30 kg against Ollie at 10^4 kg; at 10^30 the rounded speed gives a hundredth of it)', !bad.length, bad.join('; ')); }
  // the wrestle throw: the thrower's push back goes to his source (his partner's momentum, back along the throw line);
  // Ollie's landing isn't his recoil and still goes into the ground (Unbreakable footing's cap where it binds)
  { const dial = 100 * 907.18474 * g, cA = ctxOf(dial, ON), t = P.throwPartner(cA, Object.assign({}, cA, { body: ollie }), 45), cU = ctxOf(dial, { unbreakable: true }), tU = P.throwPartner(cU, Object.assign({}, cU, { body: ollie }), 45);
    const c9 = ctxOf(1e9 * g, ON), t9 = P.throwPartner(c9, Object.assign({}, c9, { body: ollie }), 45);
    ok('5d: the wrestle throw with their powers on: the thrower\'s push back (his partner\'s momentum) goes to his source, none into the ground; with Unbreakable footing alone it goes into the ground; the partner\'s landing still reaches the ground (10^9 kg dial)', t.r.canMove && !t.r.toGround && t.r.recoilAbsorbed && near(t.r.recoilAbsorbed.J, P.vToMomentum(t.r.v, ollie.m), 1e-9) && t.r.recoilAbsorbed.thetaDeg === 45 && tU.r.toGround && !tU.r.recoilAbsorbed && !t9.r.toGround && t9.r.recoilAbsorbed && t9.landToGround && t9.landToGround.J > 0, t.r.recoilAbsorbed ? sig(t.r.recoilAbsorbed.J) + ' kg m/s' : 'none'); }
  // a shove into a bolted partner with Unbreakable footing alone: his bolts still hand the planet the whole push; with
  // the shover's recoil taken he is planted too, so the shove stalls and nothing goes anywhere
  { const cR = ctxOf(1e6 * g, { unbreakable: true }), sh = P.shove(cR, Object.assign({}, cR, { body: ollie, anchor: 'bolted' })), cRo = ctxOf(1e6 * g, ON), sho = P.shove(cRo, Object.assign({}, cRo, { body: ollie, anchor: 'bolted' }));
    ok('5c/5d: a shove into a bolted partner: with Unbreakable footing alone his bolts hand the planet the whole push (and the shover\'s feet their share); with the shover\'s recoil taken both are planted and the shove stalls', sh.toGroundB && sh.toGroundB.J > 0 && sh.toGround && !sh.recoilAbsorbed && sho.stalled && !sho.toGroundB && !sho.toGround && !sho.recoilAbsorbed); }
}

// Review round 2 of pull request 2 (code-9's optional hardening): each push back's time is the push's own (the engine
// header: T, how long the push lasts), where the page doesn't show it yet (the shimmer, a later pull request, will)
{
  const c9 = ctxOf(1e9 * g, ON), c6 = ctxOf(1e6 * g, ON), bad = [];
  const tr = P.throwObject(c9, obj('car'), 45);
  if (!(tr.canMove && tr.push.t < P.limbPulse(rex) && tr.recoilAbsorbed && tr.recoilAbsorbed.T === tr.push.t)) bad.push('throw: ' + sig(tr.recoilAbsorbed && tr.recoilAbsorbed.T) + ' vs push ' + sig(tr.push && tr.push.t) + ' (limb ' + sig(P.limbPulse(rex)) + ')');
  const pu = P.punch(c6);
  if (!(pu.recoilAbsorbed && pu.recoilAbsorbed.T === pu.push.t && pu.push.t > 0)) bad.push('punch: ' + sig(pu.recoilAbsorbed && pu.recoilAbsorbed.T));
  const sh = P.shove(c9, Object.assign({}, c9, { body: ollie }));
  if (!(sh.recoilAbsorbed && sh.recoilAbsorbed.T === sh.push.t && sh.push.t > 0 && sh.push.t < P.limbPulse(rex))) bad.push('shove: ' + sig(sh.recoilAbsorbed && sh.recoilAbsorbed.T) + ' vs push ' + sig(sh.push && sh.push.t));
  const L = P.catchLeg(c9, Object.assign({}, c9, { body: ollie }), obj('baseball'), 10, 'hard'), tb = L.aim ? P.throwObject(c9, obj('baseball'), L.aim.thetaDeg) : null;
  if (!(L.recoilAbsorbedT && tb && tb.recoilAbsorbed && L.recoilAbsorbedT.T === tb.recoilAbsorbed.T && L.recoilAbsorbedT.T > 0 && L.recoilAbsorbedC && L.recoilAbsorbedC.T === L.catch.tStroke)) bad.push('catch: ' + sig(L.recoilAbsorbedT && L.recoilAbsorbedT.T) + ' vs ' + sig(tb && tb.recoilAbsorbed && tb.recoilAbsorbed.T));
  const t = P.tossPartner(c6, ollie, 'Ollie', 'hard', 10, 'friction'), tt = P.throwObject(c6, Object.assign(P.partnerAsObject(ollie, 'Ollie'), { dragK: 0 }), 90);
  if (!(t.result === 'caught' && t.recoilAbsorbedT && tt.recoilAbsorbed && t.recoilAbsorbedT.T === tt.recoilAbsorbed.T && t.recoilAbsorbedT.T > 0 && t.recoilAbsorbedC && t.recoilAbsorbedC.T === t.catch.tStroke && t.catch.tStroke > 0)) bad.push('toss: ' + t.result + ' ' + sig(t.recoilAbsorbedT && t.recoilAbsorbedT.T) + ' vs ' + sig(tt.recoilAbsorbed && tt.recoilAbsorbed.T));
  ok('5d: each push back taken lasts as long as its push: a fast car throw and a shove at 10^9 kg (each shorter than a limb\'s contact time), a punch, the game of catch\'s throw (the Throw tab\'s) and stop (the stroke), the partner toss (the Throw tab\'s straight up) and its catch', !bad.length, bad.join('; '));
}

// Round 4 of the review: canon's weak-ground cap on every push, the orbit at 100%, the unbounded jump
{
  const sand = surf('sand'), qf = (sf) => P.qultFor(sf, rex.footB);
  // a throw straight up that escapes, on concrete: the ground takes its bearing beyond his weight and the car's, over the pulse
  // (Unbreakable footing alone: with They take their own recoil on the push goes to his source instead)
  { const c = ctxOf(1e11 * g, Object.assign({}, ON, { ownRecoil: false })), r = P.throwObject(c, obj('car'), 90), RB = qf(c.surface) * 2 * rex.footArea, tg = r.toGround;
    ok('5c: a car thrown straight up past escape speed, his recoil not taken: the ground takes (its bearing - his weight and the car\'s) x the pulse, and their power supplies the rest', r.flight.escaped && tg && near(tg.J, (RB - (rex.m + obj('car').m) * g) * tg.T, 1e-9) && near(tg.J + tg.supplied, tg.whole, 1e-12), tg ? sig(tg.J) + ' of ' + sig(tg.whole) + ' kg m/s' : 'none'); }
  // a gentle toss on sand never hands the ground more than it bears (here none: Rex and Ollie together already weigh
  // more than loose sand bears under his feet), and never more than the all-out toss
  // (his recoil not taken: with it taken the toss goes to his source)
  { const c = ctxOf(1e7 * g, Object.assign({}, ON, { surface: sand, ownRecoil: false })), te = P.tossPartner(c, ollie, 'Ollie', 'easy', 1000, 'friction'), th = P.tossPartner(c, ollie, 'Ollie', 'hard', 1000, 'friction');
    const bear = Math.max(0, qf(sand) * 2 * rex.footArea - (rex.m + ollie.m) * g);
    ok('5c: a gentle toss on sand hands the ground no more than it bears, and no more than the all-out toss; the rest is supplied', te.toGroundT && te.toGroundT.J <= bear * te.toGroundT.T + 1e-9 && te.toGroundT.J <= th.toGroundT.J + 1e-9 && near(te.toGroundT.J + te.toGroundT.supplied, te.toGroundT.whole, 1e-12) && th.toGroundT.supplied > 0, te.toGroundT ? 'gentle ' + sig(te.toGroundT.J) + ', all-out ' + sig(th.toGroundT.J) + ' kg m/s' : 'none'); }
  // a stomp on sand: their power stops the foot at the print over a foot's contact time; the ground takes what it
  // bears under that foot (at least what real ground took at the print's edge, so it never drops past it), and shakes
  // less than real ground
  { const c = ctxOf(1e5 * g, Object.assign({}, ON, { surface: sand })), r = P.stomp(c), r0 = P.stomp(ctxOf(1e5 * g, { surface: sand }));
    const oS = Object.assign({ surface: sand, body: rex }, ON), b = M.stomp.blow(r, oS), s1 = M.stomp.shake(r, oS), s0 = M.stomp.shake(r0, { surface: sand, body: rex });
    // where the print's edge is passed: just below it real ground takes the whole blow; just above, the cap must match
    let lo = 1, hi = 5;
    for (let i = 0; i < 60; i++) { const mid = 0.5 * (lo + hi); if (P.stomp(ctxOf(Math.pow(10, mid) * g, Object.assign({}, ON, { surface: sand }))).realBreaks) hi = mid; else lo = mid; }
    const bLo = M.stomp.blow(P.stomp(ctxOf(Math.pow(10, lo) * g, Object.assign({}, ON, { surface: sand }))), oS), bHi = M.stomp.blow(P.stomp(ctxOf(Math.pow(10, hi) * g, Object.assign({}, ON, { surface: sand }))), oS);
    ok('5c: a stomp on sand with Unbreakable footing: past the kept print the ground takes what real ground took at its edge (no drop), at least its bearing under the foot; their power supplies the rest; it shakes less than real ground', r.realBreaks && b && b.J >= qf(sand) * rex.footArea * b.T * (1 - 1e-12) && near(b.J + b.supplied, b.whole, 1e-12) && near(bHi.J, bLo.J, 1e-4) && P.ppvAt(s1, 5) < P.ppvAt(s0, 5), b ? sig(b.J) + ' of ' + sig(b.whole) + ' kg m/s (edge ' + sig(bLo.J) + ' / ' + sig(bHi.J) + '); ' + sig(P.ppvAt(s1, 5) * 1000) + ' vs ' + sig(P.ppvAt(s0, 5) * 1000) + ' mm/s at 5 m' : 'none'); }
  // with Unbreakable footing on, a harder stomp never shakes the ground less (sand, gravel, soft clay, concrete); and a
  // jump's landing shakes it exactly as with the power off wherever real ground bears the landing
  { const bad = [];
    for (const sf of ['sand', 'gravel', 'softclay', 'concrete']) {
      let prev = 0;
      for (let lg = 1; lg <= 12; lg += 0.02) {
        const c = ctxOf(Math.pow(10, lg) * g, Object.assign({}, ON, { surface: surf(sf) })), r = P.stomp(c), src = M.stomp.shake(r, Object.assign({ surface: c.surface, body: rex }, ON));
        const v = src ? P.ppvAt(src, 5) : 0;
        if (v < prev * (1 - 1e-9)) { bad.push('stomp on ' + sf + ' at 10^' + lg.toFixed(2)); break; }
        prev = v;
      }
      for (let lg = 2; lg <= 6; lg += 0.01) {
        // (the same jump, its landing with the cap and without it)
        const on = Object.assign({}, ON, { surface: surf(sf) }), r = P.jump(ctxOf(Math.pow(10, lg) * g, on));
        if (!r.landing.landed || !(r.landRatioReal <= 1)) continue;
        const l1 = M.jump.shake(r, Object.assign({ surface: surf(sf), body: rex, m: rex.m }, on)).slice(0, 2), l0 = M.jump.shake(r, { surface: surf(sf), body: rex, m: rex.m });
        if (!near(P.ppvAt(l1, 5), P.ppvAt(l0, 5), 1e-9)) { bad.push('jump landing on ' + sf + ' at 10^' + lg.toFixed(2)); break; }
      }
    }
    ok('5c: with Unbreakable footing a harder stomp never shakes the ground less, and a landing real ground bears shakes it as without the cap', !bad.length, bad.join('; ')); }
  // an unbounded jump has no push time: the ground takes none of it, so it shakes nothing (he never lands)
  { const c = ctxOf(Infinity, ON), j = P.jump(c), src = M.jump.shake(j, Object.assign({ surface: c.surface, body: rex, m: rex.m }, ON));
    ok('5c: an unbounded jump: the ground takes none of the push-off and nothing shakes (their power supplies it all)', j.pushOff && j.pushOff.J === 0 && j.pushOff.supplied === Infinity && !src, j.pushOff ? 'J ' + j.pushOff.J : 'no push-off'); }
  // Collide's real-ground run (the 'break the ground' preset sets the power aside) still carries the hit into the ground
  { const cA = ctxOf(Math.pow(10, 6.25) * g), cB = Object.assign({}, cA, { body: ollie });
    const r1 = P.collide(cA, cB, { source: 'jump', toGround: true }), r0 = P.collide(cA, cB, { source: 'jump' });
    ok('5c: Collide on real ground with the toGround option hands the ground the hit; without it, nothing (the powers off, as main)', r1.toGround && r1.toGround.J > 0 && !r0.toGround, r1.toGround ? sig(r1.toGround.J) + ' kg m/s' : 'none'); }
  // at 100% a level throw at orbital speed goes into orbit at once (not 3 million steps and 'still in flight')
  { const c = ctxOf(Math.pow(10, 8.2) * g, ON), t0 = Date.now(), r = P.throwObject(c, obj('baseball'), 0), ms = Date.now() - t0;
    const f8 = P.fly({ v0: 8000, thetaDeg: 0, h0: 2.7, m: obj('car').m, A: obj('car').area, Cd: obj('car').Cd, CdSup: obj('car').CdSup, dragK: 0 });
    ok('5a: at 100% a level throw past orbital speed goes into orbit, found at once', r.flight.orbit && !r.flight.timedOut && f8.orbit && !f8.timedOut && ms < 1000, sig(r.v) + ' m/s; ' + ms + ' ms'); }
  // the partner toss at 50%: what real air would take from the same toss (the blast near him counts half of it)
  { const c5 = ctxOf(1e8 * g, Object.assign({}, ON, { airAbsorb: 0.5 })), c0 = ctxOf(1e8 * g, Object.assign({}, ON, { airAbsorb: 0 }));
    const t5 = P.tossPartner(c5, ollie, 'Ollie', 'hard', 10, 'friction'), t0 = P.tossPartner(c0, ollie, 'Ollie', 'hard', 10, 'friction');
    ok('5a: a supersonic partner toss at 50%: the engine gives what real air takes from the same toss (the Throw tab\'s near-field rule)', t5.v === t0.v && t5.v >= P.K.a0 && t0.flight && near(t5.dragLoss0, P.keFromV(t0.v, ollie.m) - P.keFromV(t0.flight.vImpact, ollie.m), 1e-9), sig(t5.dragLoss0) + ' J'); }
}

// Round 5 of the review: each weak-ground rule where it binds (so a broken rule fails), unbounded pushes, friction
// sideways, the bolted partner, the partner's landing, the game of catch's straight line, the sheath and the far blast
{
  const conc = surf('concrete'), sand = surf('sand'), qf = (sf, B) => P.qultFor(sf, (B || rex).footB), Nmax = (sf, B) => qf(sf, B) * 2 * (B || rex).footArea;
  // growth where the bearing is positive and the cap binds: the ground takes (soles x bearing - grown weight) x the growth time
  { const I = P.instantGrowth(rex, 1e20, 0.5, { surface: conc, unbreakable: true }), G = I.grown;
    const bear = I.soles * P.qultFor(conc, rex.footB * Math.exp(G.lnr * G.s / 3)) - G.m * g;
    ok('5c: instant growth where the cap binds: the ground takes (its bearing under his grown soles - his grown weight) x the growth time', I.toGround && I.toGround.supplied > 0 && bear > 0 && near(I.toGround.J, bear * I.tau, 1e-9), I.toGround ? sig(I.toGround.J) + ' of ' + sig(I.toGround.whole) : 'none'); }
  // an angled throw on sand, bolted (Unbreakable footing on, his recoil not taken: with it taken nothing goes into the
  // ground): the ground can bear none of the downward part, but takes the sideways part whole
  { const r = P.throwObject(ctxOf(1e6 * g, Object.assign({}, ON, { surface: sand, ownRecoil: false, anchor: 'bolted' })), obj('car'), 30), tg = r.toGround;
    ok('5c: a 30-degree throw on sand, bolted: the ground takes the sideways part whole (cos 30 of the push) and none of the downward part, which their power supplies', tg && near(tg.J, tg.whole * Math.cos(Math.PI / 6), 1e-9) && near(tg.suppliedDown, tg.whole * 0.5, 1e-9) && tg.suppliedSide === 0, tg ? sig(tg.J) + ' of ' + sig(tg.whole) : 'none'); }
  // ... standing on friction (their recoil not taken): sideways at most the ground's friction on what it bears
  { const r = P.throwObject(ctxOf(1e6 * g, Object.assign({}, ON, { surface: sand, ownRecoil: false })), obj('car'), 45), tg = r.toGround, capH = sand.mu * Nmax(sand) * (tg ? tg.T : NaN);
    ok('5c: standing on friction on sand, the ground\'s sideways grip is at most mu x what it bears over the pulse; their power supplies the rest', tg && near(tg.J, capH, 1e-9) && tg.suppliedSide > 0, tg ? sig(tg.J) + ' (cap ' + sig(capH) + ') of ' + sig(tg.whole) : 'none'); }
  // Unbreakable footing alone: the throw's push is the object's momentum less his recoil
  { const c = ctxOf(1e6 * g, { unbreakable: true }), r = P.throwObject(c, obj('car'), 30);
    ok('5c: with Unbreakable footing alone the throw\'s push into the ground is the object\'s momentum less his recoil', r.toGround && r.recoilV > 0 && near(r.toGround.whole != null ? r.toGround.whole : r.toGround.J, P.vToMomentum(r.v, obj('car').m) - P.vToMomentum(r.recoilV, rex.m), 1e-6), r.toGround ? sig(r.toGround.whole != null ? r.toGround.whole : r.toGround.J) : 'none'); }
  // only They take their own recoil on: no weak-ground cap (that is Unbreakable footing's), and nothing into the ground:
  // the whole push back goes to his source
  { const r = P.throwObject(ctxOf(1e6 * g, { ownRecoil: true, surface: sand }), obj('car'), 30);
    ok('5d: with only They take their own recoil on, nothing goes into the ground and there is no weak-ground cap: the whole push back (the car\'s momentum) goes to his source', !r.toGround && r.recoilAbsorbed && r.recoilAbsorbed.supplied === undefined && near(r.recoilAbsorbed.J, r.push.pB * obj('car').m / r.mB, 1e-12) && r.recoilAbsorbed.J > 0, r.recoilAbsorbed ? sig(r.recoilAbsorbed.J) : 'none'); }
  // a gentle toss and a catch on concrete where the cap binds: (bearing - Rex and Ollie's weight) x the pulse
  // (his recoil not taken: with it taken both go to his source)
  { const c = ctxOf(1e7 * g, Object.assign({}, ON, { surface: conc, ownRecoil: false })), t = P.tossPartner(c, ollie, 'Ollie', 'easy', 1000, 'friction'), bear = Nmax(conc) - (rex.m + ollie.m) * g;
    ok('5c: a gentle toss and its catch on concrete where the cap binds: each hands the ground (bearing - both weights) x its pulse', t.toGroundT && t.toGroundT.supplied > 0 && near(t.toGroundT.J, bear * t.toGroundT.T, 1e-9) && t.toGroundC && t.toGroundC.supplied > 0 && near(t.toGroundC.J, bear * t.toGroundC.T, 1e-9), t.toGroundT ? sig(t.toGroundT.J) + ' over ' + sig(t.toGroundT.T) + ' s; catch ' + sig(t.toGroundC && t.toGroundC.J) : t.result); }
  // a catch in the game of catch where the cap binds (a car lobbed 1 km to a bolted Ollie on concrete): the ground under
  // him takes the sideways part whole (bolted) and its bearing beyond his weight and the car's of the downward part
  // (the catcher's recoil not taken: with it taken the stop goes to his source)
  { const c = ctxOf(1e7 * g, Object.assign({}, ON, { surface: conc, ownRecoil: false })), L = P.catchLeg(c, Object.assign({}, c, { body: ollie, anchor: 'bolted' }), obj('car'), 1000, 'easy'), tg = L.toGroundC;
    const th = L.angleDeg * Math.PI / 180, capD = (Nmax(conc, ollie) - (ollie.m + obj('car').m) * g) * (tg ? tg.T : NaN);
    ok('5c: a catch on concrete where the cap binds: the ground takes the sideways part whole (bolted) and its bearing beyond his weight and the car\'s of the downward part', L.result === 'caught' && tg && tg.supplied > 0 && near(tg.J, Math.hypot(tg.whole * Math.cos(th), capD), 1e-9), tg ? sig(tg.J) + ' of ' + sig(tg.whole) : L.result); }
  // the jump's landing on concrete where the cap binds: the body's stop at most landBear x its time
  { const on = Object.assign({}, ON, { surface: conc }), r = P.jump(ctxOf(1e6 * g, on)), L = r.landing;
    const l1 = M.jump.shake(r, Object.assign({ surface: conc, body: rex, m: rex.m }, on)), want = P.impulseSource(conc, Math.min(P.vToMomentum(L.v, rex.m), r.landBear * L.t), L.t);
    ok('5c: a jump landing on concrete the ground can\'t bear: its stop hands the ground at most (bearing - weight) x the stop time', L.landed && r.landRatioReal > 1 && near(P.ppvAt(l1[0], 5), P.ppvAt(want, 5), 1e-9) && P.vToMomentum(L.v, rex.m) > r.landBear * L.t, sig(P.ppvAt(l1[0], 5) * 1000) + ' mm/s'); }
  // unbounded pushes with a push time are capped too: a throw and a toss straight up at unlimited strength, a stomp
  // whose foot speed rounds to c
  // (the throw and the toss with his recoil not taken, which sends them into the ground; the stomp with all four on)
  { const c = ctxOf(Infinity, ON), cU = ctxOf(Infinity, Object.assign({}, ON, { ownRecoil: false })), r = P.throwObject(cU, obj('car'), 90), t = P.tossPartner(cU, ollie, 'Ollie', 'hard', 10, 'friction');
    const st = P.stomp(ctxOf(1e30 * g, ON)), b = M.stomp.blow(st, Object.assign({ surface: conc, body: rex }, ON)), stI = P.stomp(c), bI = M.stomp.blow(stI, Object.assign({ surface: conc, body: rex }, ON));
    const capT = (Nmax(conc) - (rex.m + obj('car').m) * g) * (r.toGround ? r.toGround.T : NaN), capS = qf(conc) * rex.footArea * (b ? b.T : NaN);
    ok('5c: unbounded pushes with a push time are capped: a throw and a toss straight up at unlimited strength, a stomp at 10^30 kg and unlimited', r.toGround && near(r.toGround.J, capT, 1e-9) && r.toGround.supplied === Infinity && t.toGroundT && isFinite(t.toGroundT.J) && t.toGroundT.supplied === Infinity && b && b.J >= capS && isFinite(b.J) && isFinite(b.whole) && bI && isFinite(bI.J) && near(bI.J, b.J, 1e-9), 'throw ' + sig(r.toGround && r.toGround.J) + ', toss ' + sig(t.toGroundT && t.toGroundT.J) + ', stomp ' + sig(b && b.J) + ' / ' + sig(bI && bI.J)); }
  // a shove into a bolted partner: his bolts hand the planet the whole push
  { const cR = ctxOf(1e6 * g, { unbreakable: true }), cO = Object.assign({}, cR, { body: ollie, anchor: 'bolted' }), sh = P.shove(cR, cO), sh0 = P.shove(cR, Object.assign({}, cO, { anchor: 'friction' }));
    ok('5c: a shove into a bolted partner: his bolts hand the planet the whole push (about the shover\'s recoil momentum); not when he can slide', sh.toGroundB && near(sh.toGroundB.J, P.vToMomentum(sh.vA, rex.m), 0.02) && !sh0.toGroundB, sh.toGroundB ? sig(sh.toGroundB.J) + ' vs recoil ' + sig(P.vToMomentum(sh.vA, rex.m)) : 'none'); }
  // the thrown partner's landing on his own unbreakable footing: at most his bearing (downward) and his friction on it
  // (sideways) over the landing's pulse
  { const cA = ctxOf(1e9 * g, ON), cB = Object.assign({}, cA, { body: ollie }), t = P.throwPartner(cA, cB, 75), lt = t.landToGround, f = t.r.flight;
    const th = f.impactAngleDeg * Math.PI / 180, capD = (Nmax(conc, ollie) - ollie.m * g) * (lt ? lt.T : NaN), capH = conc.mu * Nmax(conc, ollie) * (lt ? lt.T : NaN);
    const Jd = P.vToMomentum(f.vImpact, ollie.m) * Math.sin(th), Jh = P.vToMomentum(f.vImpact, ollie.m) * Math.cos(th);
    ok('5c: a thrown partner landing on unbreakable ground hands it at most its bearing beyond his weight downward over the landing\'s pulse; sideways he skids it out whole (nothing breaks for it)', lt && near(lt.J, Math.hypot(Jh, Math.min(Jd, capD)), 1e-9) && lt.supplied > 0 && lt.suppliedSide === 0, lt ? sig(lt.J) + ' of ' + sig(lt.whole) : 'none'); }
  // the game of catch below 100% with a power on, past about 12 km: the straight line to his hands runs underground, so it
  // hits the ground near the thrower with all its energy, kept whole or not (no fireball reaching him through the planet)
  { const bad = [];
    for (const kf of [true, false]) for (const sh of [0, 0.5]) for (const Dd of [1e5, 1e6]) {
      const c = ctxOf(200e18 * 907.18474 * g, Object.assign({}, ON, { airAbsorb: sh, keepForm: kf })), L = P.catchLeg(c, Object.assign({}, c, { body: ollie }), obj('baseball'), Dd, 'hard');
      const E = P.throwObject(c, obj('baseball'), L.aim ? L.aim.thetaDeg : 0).Eobj;
      if (!(L.result === 'hits-ground' && L.hitsGround && near(L.hitsGround.E, E, 1e-6) && L.hitsGround.at < 1000)) bad.push((kf ? 'kept' : 'not kept') + ' ' + sh + ' ' + Dd + ': ' + L.result + (L.hitsGround ? ' E ' + sig(L.hitsGround.E / E) : ''));
    }
    ok('5a: below 100% with a power on, a throw past 1% of light speed to a catcher past 12 km hits the ground near the thrower with all its energy', !bad.length, bad.join('; ')); }
  // the sheath catch has no line at all: with Things keep their form the result doesn't flip where the air has heated half
  // of its energy (the old fireball-before line), and the catch keeps the lump's energy
  { const c = ctxOf(1e17 * g, Object.assign({}, ON, { airAbsorb: 0.5 })), Ls = [60, 62, 63, 70, 200].map((Dd) => P.catchLeg(c, Object.assign({}, c, { body: ollie }), obj('baseball'), Dd, 'hard'));
    const bad = Ls.filter((L) => !(L.result === 'caught' && L.sheath && L.catch && L.catch.Ecatch > 0)).map((L) => L.D + ' m: ' + L.result);
    ok('5a: with Things keep their form the sheath catch holds past the half-energy line (no flip to a blast)', !bad.length && Ls[4].sheath.share > 0.5, bad.join('; ') + ' sheath at 200 m ' + sig(Ls[4].sheath && Ls[4].sheath.share)); }
  // a missed throw past 1% of light speed flies on with all its energy (it doesn't land at 0 m/s)
  { const c = ctxOf(1e15 * g, ON), L = P.catchLeg(c, Object.assign({}, c, { body: ollie }), obj('baseball'), 1000, 'hard');
    ok('5a: a missed throw past 1% of light speed flies on with its energy and leaves', L.fast && L.miss && L.miss.leaves && L.miss.E > 0 && L.miss.vImpact === L.vArrive, L.miss ? sig(L.miss.E) + ' J' : L.result); }
  // past 1% of light speed with part of the drag absorbed, the far blast reach counts the air's take within it: a car
  // the air stops within a few km reaches as far at 90% as at 0%; near him the (1 - s) share still applies
  { const reachAt = (sh) => { const c = ctxOf(1e15 * g, Object.assign({}, ON, { airAbsorb: sh })), r = P.throwObject(c, obj('car'), 0); return { rc: P.RESTRAINT.reach('throw', r, Object.assign({ obj: obj('car'), angle: 0, surface: conc, body: rex, near: 5 }, c)), b: M.throw.blast(r, Object.assign({ obj: obj('car'), angle: 0 }, c)), E: r.Eobj }; };
    const a0 = reachAt(0), a9 = reachAt(0.9);
    ok('5a: past 1% of light speed the far blast reach counts the air\'s take within it (90% reaches as far as 0%); the near-field energy is still (1 - s) x its energy', near(a9.rc.air, a0.rc.air, 0.01) && near(a9.b, 0.1 * a9.E, 1e-9), sig(a9.rc.air / 1000) + ' vs ' + sig(a0.rc.air / 1000) + ' km'); }
  // a drag-free orbit low enough to skim the air reports its perigee
  { const f = P.fly({ v0: 8900, thetaDeg: 0, h0: 2.74, m: obj('baseball').m, A: obj('baseball').area, Cd: obj('baseball').Cd, CdSup: obj('baseball').CdSup, dragK: 0 });
    const fh = P.fly({ v0: 11170, thetaDeg: 0, h0: 2.74, m: obj('baseball').m, A: obj('baseball').area, Cd: obj('baseball').Cd, CdSup: obj('baseball').CdSup, dragK: 0 });
    ok('5a: a drag-free level orbit reports its perigee (2.74 m: it skims the air each orbit); one reaching past where the Sun\'s pull wins leaves Earth\'s pull', f.orbit && near(f.perigee, 2.74, 1e-6) && fh.escaped && fh.leavesHill, 'perigee ' + sig(f.perigee) + ' m'); }
}

// The re-check of round 5's fixes
{
  const conc = surf('concrete'), Nmax = (sf, B) => P.qultFor(sf, (B || rex).footB) * 2 * (B || rex).footArea;
  // an angled unbounded push, bolted (Unbreakable footing on, his recoil not taken): the sideways part goes in whole, the
  // downward part is capped; no NaN anywhere
  { const cU = Object.assign({}, ON, { ownRecoil: false, anchor: 'bolted' }), r = P.throwObject(ctxOf(Infinity, cU), obj('car'), 45), tg = r.toGround, t = P.throwPartner(ctxOf(Infinity, cU), Object.assign(ctxOf(Infinity, ON), { body: ollie }), 45);
    const noNaN = (x) => x && Object.values(x).every((v) => typeof v !== 'number' || !Number.isNaN(v));
    ok('5c: an angled unbounded throw, bolted, his recoil not taken: the ground takes the sideways part whole, their power supplies the downward part beyond its bearing; no NaN', tg && tg.J === Infinity && tg.supplied === Infinity && tg.suppliedDown === Infinity && tg.suppliedSide === 0 && noNaN(tg) && noNaN(t.r.toGround), JSON.stringify(tg));
    // ... and with all four on (his recoil taken): unbounded, all to his source, none into the ground; no NaN
    const ro = P.throwObject(ctxOf(Infinity, ON), obj('car'), 45), to = P.throwPartner(ctxOf(Infinity, ON), Object.assign(ctxOf(Infinity, ON), { body: ollie }), 45);
    ok('5d: an angled unbounded throw with their recoil taken: the push back to his source is unbounded, and none of it reaches the ground; no NaN', !ro.toGround && ro.recoilAbsorbed && ro.recoilAbsorbed.J === Infinity && noNaN(ro.recoilAbsorbed) && !to.r.toGround && to.r.recoilAbsorbed && to.r.recoilAbsorbed.J === Infinity && noNaN(to.r.recoilAbsorbed), JSON.stringify(ro.recoilAbsorbed)); }
  // standing on friction on concrete, where the downward part is borne: the sideways grip is capped at mu x bearing x pulse
  { const r = P.throwObject(ctxOf(1e6 * g, Object.assign({}, ON, { ownRecoil: false })), obj('car'), 30), tg = r.toGround;
    ok('5c: on concrete, standing on friction, the downward part borne: the sideways grip is at most mu x bearing x pulse', tg && tg.suppliedDown === 0 && tg.suppliedSide > 0 && near(tg.J, Math.hypot(conc.mu * Nmax(conc) * tg.T, tg.whole * Math.sin(Math.PI / 6)), 1e-9), tg ? sig(tg.J) + ' of ' + sig(tg.whole) : 'none'); }
  // the bolted partner's push at a dial where the push is shorter than a limb's contact time
  { const cR = ctxOf(1e8 * g, { unbreakable: true }), sh = P.shove(cR, Object.assign({}, cR, { body: ollie, anchor: 'bolted' }));
    ok('5c: at 10^8 kg the bolted partner\'s bolts still hand the planet the whole push (about the shover\'s recoil momentum)', sh.toGroundB && near(sh.toGroundB.J, P.vToMomentum(sh.vA, rex.m), 0.02), sh.toGroundB ? sig(sh.toGroundB.J) + ' vs ' + sig(P.vToMomentum(sh.vA, rex.m)) : 'none'); }
  // the far blast reach is capped by the air in the column (the Great Pyramid straight up at 90%)
  { const o = obj('pyramid') || obj('pyramids'), E = 1e22, fa = P.fastAir(o, E, 90, 0.1);
    ok('5a: what the air takes within any reach is at most the whole column\'s take', near(P.fastAirWithin(o, E, 90, 0.1, 1e12), fa.Eair, 1e-9) && P.fastAirWithin(o, E, 90, 0.1, 1e12) < 0.5 * E, sig(fa.Eair / E) + ' of its energy'); }
  // the far reach is continuous across 1% of light speed (90%, a car)
  { const reach = (lg) => { const c = ctxOf(Math.pow(10, lg) * g, Object.assign({}, ON, { airAbsorb: 0.9 })), r = P.throwObject(c, obj('car'), 0); return { R: P.RESTRAINT.reach('throw', r, Object.assign({ obj: obj('car'), angle: 0, surface: conc, body: rex, near: 5 }, c)).air, rel: r.flight.relativistic }; };
    const a = reach(14.9), b = reach(14.95);
    ok('5a: at 90% the far blast reach is continuous across 1% of light speed', !a.rel && b.rel && b.R / a.R < 1.2, sig(a.R / 1000) + ' km below, ' + sig(b.R / 1000) + ' km above'); }
  // the game of catch with a dense catcher (his pull rules): past 12 km it still hits the ground with all its energy
  { const bad = [];
    for (const kf of [true, false]) for (const sh of [0.5, 0.99]) {
      const c = ctxOf(1e17 * g, Object.assign({}, ON, { airAbsorb: sh, keepForm: kf, anchor: 'bolted' })), cO = Object.assign({}, c, { body: P.makeBody({ build: 'ollie', H: 3.048, m: 1e20 }) });
      const L = P.catchLeg(c, cO, obj('baseball'), 15000, 'hard'), E = P.throwObject(c, obj('baseball'), 0).Eobj;
      if (!(L.wells && L.wells.wellDominated && L.result === 'hits-ground' && near(L.hitsGround.E, E, 1e-6) && L.hitsGround.airK > 0)) bad.push((kf ? 'kept ' : 'not kept ') + sh + ': ' + L.result);
    }
    ok('5a: with a dense catcher past 12 km, a fast throw below 100% hits the ground with all its energy (the straight line), kept or not', !bad.length, bad.join('; ')); }
  // a sheath catch below 1% of light speed keeps the throw's momentum (relCatch at any speed), and its flight time is the
  // path times the mean of 1/v at the two ends
  { const c = ctxOf(1e14 * g, Object.assign({}, ON, { airAbsorb: 0.5 })), L = P.catchLeg(c, Object.assign({}, c, { body: ollie }), obj('baseball'), 1000, 'hard');
    const tWant = L.chord ? 0.5 * L.chord * (1 / L.aim.vL + 1 / L.vArrive) : NaN;
    ok('5a: a sheath lump caught below 1% of light speed keeps the throw\'s momentum; its flight time follows its slowing', L.result === 'caught' && L.sheath && L.vArrive < 0.01 * P.K.c && L.catch.relativistic && near(L.catch.pIn, P.vToMomentum(L.aim.vL, obj('baseball').m), 0.01) && near(L.time, tWant, 1e-9), sig(L.vArrive) + ' m/s; pIn ' + sig(L.catch.pIn)); }
  // a missed sheath throw below 100% keeps sweeping air: it leaves the air at the snowplow's speed
  { const c = ctxOf(1e15 * g, Object.assign({}, ON, { airAbsorb: 0.5 })), L = P.catchLeg(c, Object.assign({}, c, { body: ollie }), obj('baseball'), 1000, 'hard'), m = L.miss;
    ok('5a: a missed sheath throw below 100% leaves the air at the snowplow\'s speed (here short of escape speed)', m && m.vOut > 0 && m.vOut < P.K.a0 * 50 && m.Eheat > 0 && m.vOut < 11186, m ? sig(m.vOut) + ' m/s' : 'none'); }
  // the stomp's momentum near light speed follows its energy at every dial (no frozen figure)
  { const bad = [];
    for (let lg = 26; lg <= 33.5; lg += 0.01) { const r = P.stomp(ctxOf(Math.pow(10, lg) * g, ON)), b = M.stomp.blow(r, Object.assign({ surface: conc, body: rex }, ON)); const want = Math.sqrt(r.E * r.E + 2 * r.E * rex.legEff * P.K.c * P.K.c) / P.K.c; if (b && isFinite(r.E) && !(Math.abs(b.whole - want) <= 0.05 * want)) { bad.push(lg.toFixed(2)); if (bad.length > 3) break; } }
    ok('5c: past 1% of light speed the stomp\'s momentum follows its energy at every dial', !bad.length, bad.join(', ')); }
}

// 6. The momentum ledger (BRIEF-canon.md item 3). For each move, at three dials (the page's 100 short tons, 10^9 kg and
// 10^12 kg), with the powers on, off, Unbreakable footing alone, They take their own recoil alone, and bolted with all
// four on and with none: add up the momentum each party gains in the push or contact event, along each axis (x level,
// along his push; y up): the object (or partner, or load), his body, the ground, and the endless ocean. Each entry is
// labelled with what it is, the ocean's with its canon case ('ocean:recoil' their own recoil, 'ocean:supplied' the
// ground's share it can't bear, 'ocean:growthLift' the lift from growth). The total must be zero to a part in a million
// of the largest entry, and the buckets must be right (a mutant that books his recoil in the ground would still close):
//   - with They take their own recoil on, none of his own push back is in the ground (the catcher's stop included), and
//     the test never works it out for him: the engine must report it, or the sum stays open;
//   - with it off, nothing is booked as his recoil taken back;
//   - with every power off, nothing goes to the ocean but canon's growth lift (instantGrowth reports it whatever the
//     switches say: it is canon, not a power);
//   - every ocean entry is one of canon's cases.
// Flights are left out: the share of the air's drag that is absorbed is a pair of equal and opposite pushes, both taken
// back (the object isn't slowed and the air isn't pushed), so it adds nothing net (and fly() reports only its size).
// Where the engine reports no ground figure (with the powers off, and the parts the lab never reports: a stomp's
// standing foot, a punch's footing, the shove partner's footing, the pull's load (its rolling or sliding) and, with the
// power off, his walking), the test works the planet's share out from the push itself ('derived', flagged): the push's
// own impulses, the masses and anchorCapacity. Momenta come from energies where speeds
// round near c (p = sqrt(E^2 + 2 E m c^2) / c). Unbounded pushes are checked as unbounded on both sides (section 6b).
{
  const R3 = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), O3 = P.makeBody(Object.assign({ build: 'ollie' }, P.DEFAULT_BODIES.ollie));
  const car = obj('car'), bus = obj('bus'), cl = P.K.c;
  const pE = (E, m) => (E > 0 ? (isFinite(E) ? Math.sqrt(E * E + 2 * E * m * cl * cl) / cl : Infinity) : 0);
  const pV = (v, m) => (v > 0 ? P.vToMomentum(v, m) : 0);
  const rad = (d) => d * Math.PI / 180;
  // a unit vector at d degrees above level (cos 90 rounds to 6e-17: no sideways part)
  const dirOf = (d) => [Math.abs(d) === 90 ? 0 : Math.cos(rad(d)), Math.sin(rad(d))];
  // ('ocean:hit': an incoming hit taken by Never knocked back, canon's case "incoming hits"; pull request 4)
  const OCEAN = new Set(['ocean:recoil', 'ocean:supplied', 'ocean:growthLift', 'ocean:hit']);
  const HIS_RECOIL = new Set(['ground:recoil', 'ground:catch']);
  const bad = [], seen = {}, collideSeen = {};
  let ledgers = 0, worst = 0, derived = 0;
  const STATES = [['off', {}], ['on', ON], ['Unbreakable only', { unbreakable: true }], ['own recoil only', { ownRecoil: true }], ['on, bolted', Object.assign({ anchor: 'bolted' }, ON)], ['off, bolted', { anchor: 'bolted' }]];
  const DIALS = [[100 * 907.18474 * g, '100 short tons'], [1e9 * g, '10^9 kg'], [1e12 * g, '10^12 kg']];
  // entries: [label, x, y, derived?]: the momentum each party gains, kg m/s
  const book = (tag, st, entries) => {
    ledgers++;
    const list = entries.filter((e) => e && (e[1] !== 0 || e[2] !== 0));
    // (a ledger whose ground share the test works out from the push itself closes by construction: it checks only that
    // the engine's energies and speeds match its own push impulses; counted, so the label says how many)
    if (list.some((e) => e[3])) derived++;
    const why = [];
    let sx = 0, sy = 0, big = 0;
    for (const [, x, y] of list) { sx += x; sy += y; big = Math.max(big, Math.abs(x), Math.abs(y)); }
    const res = big > 0 ? Math.hypot(sx, sy) / big : 0;
    if (!(res <= 1e-6)) why.push('open by ' + sig(res) + ' of the largest entry (' + list.map((e) => e[0] + ' ' + sig(e[1]) + ',' + sig(e[2])).join('; ') + ')');
    worst = Math.max(worst, isFinite(res) ? res : 1);
    for (const [lab] of list) {
      seen[lab] = (seen[lab] || 0) + 1;
      if (/^ocean/.test(lab) && !OCEAN.has(lab)) why.push('an ocean entry that is no canon case: ' + lab);
      if (st.ownRecoil && HIS_RECOIL.has(lab)) why.push('his own push back in the ground with They take their own recoil on (' + lab + ')');
      if (!st.ownRecoil && lab === 'ocean:recoil') why.push('recoil taken back with the power off');
      if (!st.ownRecoil && !st.unbreakable && /^ocean/.test(lab) && lab !== 'ocean:growthLift' && !(lab === 'ocean:hit' && st.noKnockback)) why.push('an ocean entry with the powers off (' + lab + ')');
      // Never knocked back: an incoming hit goes to the ocean only with the catcher's switch on, and then none of it moves
      // him or reaches the ground
      if (!st.noKnockback && lab === 'ocean:hit') why.push('an incoming hit taken back with Never knocked back off');
      if (st.noKnockback && (lab === 'ground:knock' || lab === 'catcher and lump')) why.push('the hit moves him or reaches the ground with Never knocked back on (' + lab + ')');
    }
    if (why.length) bad.push(tag + ': ' + why.join('; '));
  };
  // a push into the ground reported by the engine, pointing along (ux, uy) (the way the ground is pushed; uy <= 0), split
  // where Unbreakable footing capped it into the ground's take and the part their power supplied
  const wg = (tag, x, ux, uy, lab) => {
    if (!x) return [];
    if (x.whole == null) return [[lab, x.J * ux, x.J * uy]];
    const sx = Math.sign(ux);
    if (!(near(x.J, Math.hypot(x.sideTaken, x.downTaken), 1e-12) && near(x.sideTaken + x.suppliedSide || 1e-300, x.whole * Math.abs(ux) || 1e-300, 1e-9) && near(x.downTaken + x.suppliedDown || 1e-300, x.whole * Math.abs(uy) || 1e-300, 1e-9))) bad.push(tag + ': the weak-ground split doesn\'t add up (' + JSON.stringify(x) + ')');
    return [[lab, sx * x.sideTaken, -x.downTaken], ['ocean:supplied', sx * x.suppliedSide, -x.suppliedDown]];
  };
  // his own push back taken by his source, along u (sense -1: opposite to u, the way his push points)
  const own = (x, u, sense) => (x ? [['ocean:recoil', sense * x.J * u[0], sense * x.J * u[1]]] : []);
  // a leg of the game of catch: the thrower's push and the catcher's stop, as two events. The catcher stands as the state
  // says (bolted in the bolted states: with the powers off a bolted catcher in a slam keeps moving with it, uAfter > 0,
  // though his bolts hold his feet; that is counted as his own momentum, as the engine counts it). stops: the stop
  // ledgers seen, by outcome (each outcome where it reaches him must be booked)
  const stops = {};
  const bookCatch = (tag0, st, cT, cC, oid, Dd, style) => {
    const ob = obj(oid), L = P.catchLeg(cT, cC, ob, Dd, style), tag = tag0 + ', catch ' + oid + ' ' + style + ' ' + L.result;
    const th = L.aim ? L.aim.thetaDeg : L.thetaDeg, full = style === 'hard' || L.fullStrength;
    if (th != null) {
      // the throw: at full strength the exact throw at that angle (the release table's, not the interpolated release
      // speed); a lob, the steady push that gives its release speed
      const tb = full ? P.catchReleaseTable(cT, ob).at(th) : null, u = dirOf(th), pO = full ? pE(tb.Eobj, ob.m) : pV(L.aim.vL, ob.m), pB = pV(L.recoil ? L.recoil.v : 0, cT.body.m);
      const e = [['object', pO * u[0], pO * u[1]], ['thrower', -pB * u[0], -pB * u[1]], ...wg(tag + ' (throw)', L.toGroundT, -u[0], -u[1], 'ground:recoil'), ...own(L.recoilAbsorbedT, u, -1)];
      if (L.recoilAbsorbedT && L.recoilAbsorbedT.thetaDeg !== th) bad.push(tag + ': recoilAbsorbedT.thetaDeg');
      if (!st.ownRecoil && !L.toGroundT) e.push(['ground:recoil', -(pO - pB) * u[0], -(pO - pB) * u[1], true]);
      book(tag + ' (throw)', st, e);
    }
    if (L.catch && ['caught', 'slams', 'wreckage', 'cant-hold-it'].includes(L.result)) {
      // the stop, along its arrival (forward and down): what it brings, what he and it keep moving with, the ground
      // under him, and his source
      const k = L.catch, a = rad(L.angleDeg || 0), ua = [Math.cos(a), -Math.sin(a)];
      const pIn = k.relativistic ? k.pIn : pV(L.vArrive, ob.m), pair = k.relativistic ? (k.uAfter > 0 ? k.pIn : 0) : (cC.body.m + ob.m) * k.uAfter;
      const e = [['object and catcher', (pair - pIn) * ua[0], (pair - pIn) * ua[1]], ...wg(tag + ' (stop)', L.toGroundC, ua[0], ua[1], 'ground:catch'), ...own(L.recoilAbsorbedC, ua, 1)];
      if (L.recoilAbsorbedC && L.recoilAbsorbedC.angleDeg !== (L.angleDeg || 0)) bad.push(tag + ': recoilAbsorbedC.angleDeg');
      if (st.ownRecoil && !(k.uAfter === 0 && k.slide === 0 && !k.carried)) bad.push(tag + ': the catcher moves with his recoil taken');
      if (!st.ownRecoil && !L.toGroundC) e.push(['ground:catch', (pIn - pair) * ua[0], (pIn - pair) * ua[1], true]);
      book(tag + ' (stop)', st, e);
      const sk = (st.ownRecoil ? 'on ' : 'off ') + L.result; stops[sk] = (stops[sk] || 0) + 1;
    }
  };
  for (const [lab, st] of STATES) for (const [F, dl] of DIALS) {
    const tag0 = lab + ', ' + dl, c = ctxOf(F, Object.assign({ body: R3 }, st)), cO = Object.assign({}, c, { body: O3, anchor: 'friction' });
    // the throw (a car at 0, 45 and 90 degrees): at the end of the push and follow-through
    for (const th of [0, 45, 90]) {
      const r = P.throwObject(c, car, th), tag = tag0 + ', throw ' + th;
      if (!r.canMove) continue;
      const u = dirOf(th), pO = pE(r.Eobj, car.m), pB = pE(r.recoilE, R3.m), e = [['object', pO * u[0], pO * u[1]], ['body', -pB * u[0], -pB * u[1]]];
      e.push(...wg(tag, r.toGround, -u[0], -u[1], 'ground:recoil'), ...own(r.recoilAbsorbed, u, -1));
      if (r.recoilAbsorbed && r.recoilAbsorbed.thetaDeg !== th) bad.push(tag + ': recoilAbsorbed.thetaDeg ' + r.recoilAbsorbed.thetaDeg);
      if (!st.ownRecoil && !r.toGround) { const pp = r.push, J = pp.pB * car.m / r.mB - Math.max(0, pp.pA - pp.pB * r.armMass / r.mB); e.push(['ground:recoil', -J * u[0], -J * u[1], true]); }
      book(tag, st, e);
    }
    // the stomp (y): his body, the foot's blow on the ground (the move: the stamp's extra effective mass in the shaking
    // model is not a momentum transfer, so a cap splits the foot's own momentum in proportion), his standing foot
    { const s = P.stomp(c), pp = s.push, tag = tag0 + ', stomp', pF = pE(s.E, R3.legEff), oS = Object.assign({ surface: c.surface, body: R3 }, st);
      const b = M.stomp.blow(s, oS), sup = b && b.supplied > 0 ? pF * b.supplied / b.whole : 0;
      const e = [['body', 0, pV(s.vBody, R3.m)], ['ground:blow', 0, -(pF - sup)], ['ocean:supplied', 0, -sup], ...own(s.recoilAbsorbed, [0, -1], -1)];
      if (s.recoilAbsorbed && s.recoilAbsorbed.thetaDeg !== -90) bad.push(tag + ': thetaDeg ' + s.recoilAbsorbed.thetaDeg);
      // (his standing foot unloads, or his bolts pull the planet up: never reported by the engine)
      if (!st.ownRecoil) e.push(['ground:recoil', 0, pp.pB - pp.pA, true]);
      book(tag, st, e); }
    // the punch (x), at the end of the push: the fist, his body, his footing; the arm's stop hands it all back later
    { const pu = P.punch(c), pp = pu.push, tag = tag0 + ', punch';
      const e = [['fist', pE(pu.Efist, R3.handEff), 0], ['body', -pE(pu.recoilE, R3.m - R3.handEff), 0], ...own(pu.recoilAbsorbed, [1, 0], -1)];
      if (pu.recoilAbsorbed && !(pu.recoilAbsorbed.returned === true && pu.recoilAbsorbed.thetaDeg === 0)) bad.push(tag + ': not marked returned');
      if (!st.ownRecoil) e.push(['ground:recoil', -(pp.pB - pp.pA), 0, true]);
      book(tag, st, e); }
    // the clap: his two hands, equal and opposite
    { const k = P.clap(c), p = pE(k.push.EB, R3.handEff); book(tag0 + ', clap', st, [['hand', p, 0], ['other hand', -p, 0], ...own(k.recoilAbsorbed, [1, 0], -1)]); }
    // the jump (y): his push-off is the move itself, not recoil; Unbreakable footing caps what the ground takes
    { const j = P.jump(c), tag = tag0 + ', jump', p = pE(j.Ebody, R3.m), e = [['body', 0, p], ...own(j.recoilAbsorbed, [0, 1], -1)];
      if (j.pushOff) { e.push(['ground:pushOff', 0, -j.pushOff.J], ['ocean:supplied', 0, -j.pushOff.supplied]); if (!near(j.pushOff.whole, p, 1e-9)) bad.push(tag + ': push-off whole ' + sig(j.pushOff.whole) + ' vs ' + sig(p)); }
      else e.push(['ground:pushOff', 0, -p, true]);
      book(tag, st, e); }
    // the pull (a bus over 10 m; x the way he walks): the load and his body at the end, the ground under the load (its
    // rolling resistance: derived), his walking (his own body's momentum: the move; with the power on the engine reports
    // it, walkPush, the pull's shaking source; with it off the test works it out), and the rope's pull back on him
    { const pl = P.pull(c, bus), tag = tag0 + ', pull';
      if (pl.canMove) {
        const t = pl.t10m, pL = pV(pl.vEnd, bus.m), pBd = pV(pl.vEnd, R3.m);
        const e = [['load', pL, 0], ['body', pBd, 0], ['ground:load', pl.resist * t, 0, true], pl.walkPush ? ['ground:walk', -pl.walkPush.J, 0] : ['ground:walk', -pBd, 0, true], ...own(pl.recoilAbsorbed, [1, 0], -1)];
        if (!!st.ownRecoil !== !!pl.walkPush) bad.push(tag + ': walkPush ' + (pl.walkPush ? 'with the power off' : 'missing with the power on'));
        if (pl.walkPush && pl.walkPush.T !== t) bad.push(tag + ': walkPush.T ' + pl.walkPush.T + ' vs the pull\'s ' + t);
        if (!st.ownRecoil) e.push(['ground:recoil', -(pl.usable * t - pBd), 0, true]);
        book(tag, st, e);
      } }
    // the shove (Ollie on his own footing; x toward him): his partner, the shover, the partner's footing during the push
    // (anchorCapacity), and the shover's push back; their mutual pull is equal and opposite, so it cancels
    { const sh = P.shove(c, cO), tag = tag0 + ', shove';
      if (!sh.stalled && sh.push) {
        const pp = sh.push, fB = P.anchorCapacity({ body: O3, surface: cO.surface, theta: 0, anchor: cO.anchor, groundHolds: P.holdsGround(cO), mA: O3.m }).R;
        const fBt = pp.pB > 0 ? fB * pp.t : 0;
        const e = [['partner', pE(sh.EB, O3.m), 0], ['body', -pE(sh.EA, R3.m), 0], ['ground:partnerFooting', fBt, 0, true], ...wg(tag, sh.toGround, -1, 0, 'ground:recoil'), ...own(sh.recoilAbsorbed, [1, 0], -1)];
        // (from the push: his partner's share after the follow-through, plus the partner's footing, less his own recoil,
        // which the follow-through clamps at zero: a held shover's arms hand their momentum back into his footing)
        const arm = 2 * R3.handEff, mB = O3.m + arm;
        if (!st.ownRecoil && !sh.toGround) e.push(['ground:recoil', -(pp.pB * O3.m / mB + fBt - Math.max(0, pp.pA - pp.pB * arm / mB)), 0, true]);
        book(tag, st, e);
      } }
    // the wrestle throw at 45 degrees: the throw's push back, then (where Unbreakable footing caps it) Ollie's landing
    { const tp = P.throwPartner(c, cO, 45), r = tp.r, tag = tag0 + ', wrestle throw';
      if (r && r.canMove) {
        const u = dirOf(45), pO = pE(r.Eobj, O3.m), pB = pE(r.recoilE, R3.m), e = [['partner', pO * u[0], pO * u[1]], ['body', -pB * u[0], -pB * u[1]]];
        e.push(...wg(tag, r.toGround, -u[0], -u[1], 'ground:recoil'), ...own(r.recoilAbsorbed, u, -1));
        if (!st.ownRecoil && !r.toGround) { const pp = r.push, J = pp.pB * O3.m / r.mB - Math.max(0, pp.pA - pp.pB * r.armMass / r.mB); e.push(['ground:recoil', -J * u[0], -J * u[1], true]); }
        book(tag, st, e);
        const f = r.flight, lt = tp.landToGround;
        if (lt) { const a = rad(f.impactAngleDeg), pIn = pV(f.vImpact, O3.m), ua = [Math.cos(a), -Math.sin(a)];
          book(tag + ' (landing)', st, [['partner', -pIn * ua[0], -pIn * ua[1]], ...wg(tag + ' (landing)', lt, ua[0], ua[1], 'ground:landing')]); }
      } }
    // the game of catch (a car 30 m apart, thrown hard and lobbed; a fastball 10 m apart, past 1% of light speed at
    // 10^12 kg): the thrower's push and the catcher's stop, as two events (bookCatch, below the loop; the legs that end
    // in a slam, wreckage or a catch he can't hold are booked after the loop)
    for (const [oid, Dd, style] of [['car', 30, 'hard'], ['car', 30, 'easy'], ['baseball', 10, 'hard']]) bookCatch(tag0, st, c, Object.assign({}, c, { body: O3 }), oid, Dd, style);
    // the partner toss (Ollie 10 m up, gently; y): Rex's toss and his catch
    { const t = P.tossPartner(c, O3, 'Ollie', 'easy', 10, 'friction'), tag = tag0 + ', toss ' + t.result;
      if (t.v > 0) {
        const pO = pV(t.v, O3.m), e = [['partner', 0, pO], ...wg(tag, t.toGroundT, 0, -1, 'ground:recoil'), ...own(t.recoilAbsorbedT, [0, 1], -1)];
        if (!st.ownRecoil && !t.toGroundT) e.push(['ground:recoil', 0, -pO, true]);
        book(tag + ' (toss)', st, e);
      }
      if (t.catch) {
        const pIn = pV(t.flight.vImpact, O3.m), pair = (R3.m + O3.m) * (t.catch.uAfter || 0);
        const e = [['partner and catcher', 0, pIn - pair], ...wg(tag, t.toGroundC, 0, -1, 'ground:catch'), ...own(t.recoilAbsorbedC, [0, -1], 1)];
        if (!st.ownRecoil && !t.toGroundC) e.push(['ground:catch', 0, -(pIn - pair), true]);
        book(tag + ' (catch)', st, e);
      } }
    // Collide (BRIEF-canon.md item 4, pull request 4), along the hit: Ollie charges Rex at a sprint, at 0.1% of light speed
    // and jumping onto him (from above; with Unbreakable footing on that is the paradox), splat and bounce. With Ollie's
    // recoil taken he doesn't slow (a body of unbounded mass): Rex gains the momentum, his footing (or the rock around
    // his bolts, as it tears) hands the ground its share, and Ollie's source supplies both ('ocean:recoil', the charger's
    // own recoil); his own momentum is unchanged during the hit. Where Rex is held without limit (bolted on Unbreakable
    // footing; landed on from above with it on) the hit has no physical answer: no ledger. With Ollie's recoil not taken:
    // held, the planet takes the hit (where Unbreakable footing caps it, their power supplies the rest); knocked back,
    // his footing's share of the splat (the bounce bound ignores his footing, as its speeds do: nothing in the ground;
    // pull request 2's over-count, fixed)
    for (const [src, gb] of [['sprint'], ['set', 0.001 / Math.sqrt(1 - 1e-6)], ['jump']]) for (const bounce of [false, true]) {
      const cA = Object.assign({}, c, { body: O3 }), r = P.collide(cA, c, { source: src, gb, bounce }), tag = tag0 + ', collide ' + src + ' ' + (bounce ? 'bounce' : 'splat');
      if (r.noCharge || r.blackHole || r.planetScale) continue;
      if (r.unbounded && r.outcome === 'paradox') {
        if (!(st.ownRecoil && P.holdsGround(c) && (c.anchor === 'bolted' || r.dir === 'v'))) bad.push(tag + ': a paradox where Rex isn\'t held without limit');
        collideSeen.paradox = (collideSeen.paradox || 0) + 1;
        continue;
      }
      if (r.outcome === 'carried') {
        const k = r.carry;
        if (!st.ownRecoil) bad.push(tag + ': carried with the charger\'s recoil not taken');
        if (r.toGround && r.toGround.J !== k.footJ) bad.push(tag + ': toGround is not the footing\'s share');
        if (!(r.h.el.vA === r.vRel && k.stop.J === r.pA)) bad.push(tag + ': the charger slows');
        book(tag, st, [['Rex', k.pGain, 0], ['ground:hit', r.toGround ? r.toGround.J : k.footJ, 0], ['ocean:recoil', -k.supplied, 0]]);
        collideSeen.carried = (collideSeen.carried || 0) + 1;
        continue;
      }
      if (st.ownRecoil && isFinite(r.pA)) bad.push(tag + ': the charger\'s recoil taken, but ' + r.outcome);
      if (!r.h || r.dragged || r.boltsLate || r.relativistic || r.h.undefinedResult) continue;
      const h = r.h, pA = r.pA, e = [];
      if (r.held) { e.push(['charger', (bounce ? h.el.pA : 0) - pA, 0]); e.push(r.toGround ? ['ground:hit', r.toGround.J, 0] : ['ground:hit', bounce ? h.el.pT : h.inel.pT, 0, true]); }
      else if (!bounce) { e.push(['charger', O3.m * h.inel.V - pA, 0], ['Rex', h.inel.pT, 0], ['ground:hit', r.partial ? r.partial.Jearth : 0, 0]); if (r.toGround && r.toGround.J !== r.partial.Jearth) bad.push(tag + ': toGround is not the footing\'s share'); }
      else { e.push(['charger', h.el.pA - pA, 0], ['Rex', h.el.pT, 0]); if (r.toGround) bad.push(tag + ': a bounce books his footing\'s share while its speeds ignore it'); }
      if (r.toGround && r.toGround.supplied > 0) e.push(['ocean:supplied', r.toGround.supplied, 0]);
      book(tag, st, e);
      collideSeen[r.held ? 'held' : 'moved'] = (collideSeen[r.held ? 'held' : 'moved'] || 0) + 1;
    }
  }
  // the catch outcomes the dial loop doesn't reach, in every state: a slam (a bus thrown hard 10 m apart at the page's
  // default dial: planted, his arms can't stop it all), wreckage (a motorcycle fastball 10 m apart at a 10^6 kg dial with
  // Things keep their form off) and a catch he can't hold (Rex at a 10^5 kg dial lobs a car 30 m to Ollie at a 500 kg dial)
  for (const [lab, st] of STATES) {
    const at = (kg, x) => ctxOf(kg * g, Object.assign({ body: R3 }, st, x || {})), Ob = (c, kg) => Object.assign({}, c, { body: O3 }, kg ? { F: kg * g } : {});
    const cD = at(100 * 907.18474), cW = at(1e6, { keepForm: false }), cH = at(1e5);
    bookCatch(lab + ', 100 short tons', st, cD, Ob(cD), 'bus', 10, 'hard');
    bookCatch(lab + ', 10^6 kg, Things keep their form off', st, cW, Ob(cW), 'motorcycle', 10, 'hard');
    bookCatch(lab + ', Rex 10^5 kg, Ollie 500 kg', st, cH, Ob(cH, 500), 'car', 30, 'easy');
  }
  // the fireball's push on the catcher (Never knocked back, BRIEF-canon.md item 4, pull request 4): a fastball 10 m apart
  // at 10^14 and 10^16 kg, Things keep their form off and some of the drag acting, reaches Ollie as plasma. With his
  // switch on he isn't moved and its momentum goes to the endless ocean ('ocean:hit'), bolted too; with it off he and the
  // lump move off together (their momentum from the motion they carry on, p = E (1 + 1/gamma) / v), or, bolted, the
  // Earth takes it (its speed times its mass). Both throws are Rex's own push back (taken: not booked here)
  const fireSeen = {};
  for (const nkb of [true, false]) for (const anc of ['friction', 'bolted']) for (const air of [0, 0.5]) for (const kg of [1e14, 1e16]) {
    const stF = { ownRecoil: true, unbreakable: true, noKnockback: nkb }, tag = 'fireball, Never knocked back ' + (nkb ? 'on' : 'off') + ', ' + anc + ', ' + (air * 100) + '% absorbed, ' + sig(kg) + ' kg';
    const cT = ctxOf(kg * g, { body: R3, keepForm: false, airAbsorb: air, ownRecoil: true, unbreakable: true }), cC = Object.assign({}, cT, { body: O3, anchor: anc, noKnockback: nkb });
    const L = P.catchLeg(cT, cC, obj('baseball'), 10, 'hard'), fb = L.fireball;
    if (L.result !== 'fireball' || !fb || fb.kind === 'before' || !isFinite(fb.p)) { bad.push(tag + ': ' + L.result + (fb ? ' ' + fb.kind : '')); continue; }
    const e = [['lump', -fb.p, 0]];
    if (fb.knockAbsorbed) e.push(['ocean:hit', fb.knockAbsorbed.J, 0]);
    else if (anc === 'bolted') e.push(['ground:knock', fb.push.earthRecoilV * P.K.M_E, 0]);
    else { const v = fb.push.recoilV, gam = 1 / Math.sqrt(1 - (v / P.K.c) * (v / P.K.c)); e.push(['catcher and lump', fb.Eafter * (1 + 1 / gam) / v, 0]); }
    if (nkb && !(fb.push.recoilV === 0 && fb.push.earthRecoilV === 0 && fb.Ecarry === 0)) bad.push(tag + ': he is moved');
    book(tag, stF, e);
    fireSeen[(nkb ? 'on ' : 'off ') + anc] = (fireSeen[(nkb ? 'on ' : 'off ') + anc] || 0) + 1;
  }
  // the arm-wrestle pin on the table (Rex at the dial, Ollie at half; Things keep their form on so the table holds): the
  // forearms start and end at rest; the swing's push backs (the winner's up, the loser's resisting arm's down: both own
  // recoil, netted in the one source they share) and the slam (down)
  for (const [lab, st] of [['off (table held)', {}], ['on', ON], ['Unbreakable only', { unbreakable: true }], ['own recoil only', { ownRecoil: true }]]) for (const [F, dl] of DIALS) {
    const x = Object.assign({ keepForm: true }, st), aw = P.armWrestle(ctxOf(F, Object.assign({ body: R3 }, x)), Object.assign(ctxOf(F / 2, x), { body: O3 })), tag = lab + ', ' + dl + ', arm pin';
    if (aw.outcome !== 'pin' || aw.tableBreaks || !(aw.pin.v > 0)) { bad.push(tag + ': ' + aw.outcome); continue; }
    // (recoilAbsorbed: the net of the two push backs, booked once as their own recoil)
    const pF = pE(aw.pin.E, aw.pin.M), e = [...own(aw.recoilAbsorbed, [0, -1], -1)];
    // the slam: the move (reported with Unbreakable footing; without it the lab doesn't count its shaking)
    e.push(aw.toGround ? ['ground:slam', 0, -aw.toGround.J] : ['ground:slam', 0, -pF, true]);
    // the swing's push back through his body and feet, with his recoil not taken (a quick one cancels the slam there:
    // the engine reports neither then)
    if (!st.ownRecoil) e.push(['ground:recoil', 0, pF, true]);
    if (aw.recoilAbsorbed && !(aw.recoilAbsorbed.thetaDeg === -90 && aw.recoilAbsorbed.T === aw.pin.t)) bad.push(tag + ': direction or time');
    book(tag, st, e);
  }
  // instant growth (no dial: the energy he takes in): the ground's push and the lift (canon's growth lift)
  for (const E of [1e6, 1e15, 4.2e23]) for (const [lab, gnd, st] of [['off', { surface: surf('concrete') }, {}], ['Unbreakable only', { surface: surf('concrete'), unbreakable: true }, { unbreakable: true }]]) {
    const I = P.instantGrowth(R3, E, 0.5, gnd), G = I.grown, tag = lab + ', growth ' + sig(E) + ' J';
    const e = [['ocean:growthLift', 0, I.Pocean]];
    if (I.gives) e.push(['ground:growth', 0, -Math.max(0, I.Fground - G.m * g) * I.tau]);
    else if (I.toGround) e.push(['ground:growth', 0, -I.toGround.J], ['ocean:supplied', 0, -I.toGround.supplied]);
    book(tag, st, e);
  }
  ok('6: the momentum ledger closes for every move (a throw at 0, 45 and 90 degrees, stomp, punch, clap, jump, pull, shove, wrestle throw and landing, a catch\'s throw and stop, the partner toss and its catch, Collide (a sprint, 0.1% of light speed and a jump onto him, splat and bounce: carried with the charger\'s source supplying, held or knocked back), the arm-wrestle pin, instant growth), with the powers on, off, Unbreakable footing alone, They take their own recoil alone and bolted, at three dials, the catch outcomes the dials miss (a slam, wreckage, a catch he can\'t hold), and the fireball\'s push with Never knocked back on and off: object + body + ground + ocean = 0 to a part in a million, and every share in its canon bucket (' + ledgers + ' ledgers; in ' + derived + ' of them, mostly with the powers off, the test works the ground\'s share out from the push itself, so those close by construction and check only that the engine\'s energies match its push impulses)', !bad.length, bad.length ? bad.length + ' bad: ' + bad.slice(0, 4).join(' | ') : 'worst ' + sig(worst) + '; ' + Object.entries(seen).map(([k, v]) => k + ' ' + v).join(', '));
  // the buckets were exercised: his recoil reached the ocean with the power on and the ground with it off, the
  // catcher's stop both ways, and each of canon's cases appeared
  ok('6: the ledger saw each bucket: their own recoil in the ocean (power on) and in the ground (power off), the catcher\'s stop both ways, the ground\'s share it can\'t bear, the growth lift, an incoming hit taken by Never knocked back', seen['ocean:recoil'] > 50 && seen['ground:recoil'] > 50 && seen['ground:catch'] > 5 && seen['ocean:supplied'] > 5 && seen['ocean:growthLift'] === 6 && seen['ocean:hit'] === 8, JSON.stringify(seen));
  // ... and Collide in each outcome (a charger whose source supplies, held, knocked back, the paradox with no ledger), and
  // the fireball both ways, bolted and not
  ok('6: the ledger booked Collide carried (the charger\'s source supplying), held and knocked back, and saw the paradox; and the fireball\'s push with Never knocked back on and off, bolted and not', collideSeen.carried >= 20 && collideSeen.held > 0 && collideSeen.moved > 0 && collideSeen.paradox > 0 && ['on friction', 'on bolted', 'off friction', 'off bolted'].every((k) => fireSeen[k] === 4), JSON.stringify(collideSeen) + ' ' + JSON.stringify(fireSeen));
  // ... and every catch outcome where the object reaches him, with the catcher's power on and off: a mutant that drops
  // one from the catcher's own recoil (or books it in the ground) leaves that stop open or in the wrong bucket
  const stopOk = ['caught', 'slams', 'wreckage', 'cant-hold-it'].every((o) => stops['on ' + o] > 0 && stops['off ' + o] > 0);
  ok('6: the ledger booked the catcher\'s stop in every outcome where the object reaches him (caught, a slam, wreckage, a catch he can\'t hold), with his recoil taken and not', stopOk, JSON.stringify(stops));
}

// 6b. Unbounded pushes (comic mode at unlimited strength): the ledger can't add infinities, so each must be unbounded on
// both sides: the object (or his own body) gains an unbounded momentum, and what pushed it back takes an unbounded one
{
  const R3 = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), O3 = P.makeBody(Object.assign({ build: 'ollie' }, P.DEFAULT_BODIES.ollie));
  const c = ctxOf(Infinity, Object.assign({ body: R3 }, ON)), cO = Object.assign({}, c, { body: O3 });
  const r = P.throwObject(c, obj('car'), 45), st = P.stomp(c), sh = P.shove(c, cO), j = P.jump(c), cU = ctxOf(Infinity, Object.assign({ body: R3 }, ON, { ownRecoil: false })), jU = P.jump(cU);
  ok('6b: unbounded pushes with their recoil taken: a throw (the car\'s momentum and his source\'s take), a stomp (the foot\'s and the upward push taken back) and a shove are unbounded on both sides; nothing reaches the ground', r.Eobj === Infinity && r.recoilAbsorbed && r.recoilAbsorbed.J === Infinity && !r.toGround && st.push.pB === Infinity && st.recoilAbsorbed && st.recoilAbsorbed.J === Infinity && sh.vB === P.K.c && sh.recoilAbsorbed && sh.recoilAbsorbed.J === Infinity && !sh.toGround);
  // an unlimited shove into a bolted partner, the shover taking his own recoil (standing or bolted: the power decides for
  // his own moves): he stays put, nothing tears around his feet, and his source takes the unbounded push back; on real
  // rock only the rock around the partner's bolts tears out and the partner leaves at just under light speed; where the
  // ground under the partner holds (Unbreakable footing), nothing gives (no physical answer: stalled). With his recoil
  // not taken and both bolted, the shared clash rule as before (the rock around both sets of bolts gives)
  { const real = Object.assign({ body: R3 }, ON, { unbreakable: false }), bad = [];
    for (const anc of ['friction', 'bolted']) {
      const cA = ctxOf(Infinity, Object.assign({}, real, { anchor: anc })), cB = Object.assign({}, cA, { body: O3, anchor: 'bolted' });
      // (Both at once with their recoil taken: each is shoved by the other's shove, pull request 4's decision 9: section 8h)
      for (const [how, x] of [['shove', P.shove(cA, cB)]]) if (!(x.clash === 'partnerTorn' && x.oneSided === true && x.EA === 0 && x.vA === 0 && x.slideA === 0 && !(x.tearA > 0) && x.tearB > 0 && isFinite(x.tearB) && x.vB === P.K.c && x.recoilAbsorbed && x.recoilAbsorbed.J === Infinity && !x.toGround && !x.stalled)) bad.push(anc + ' ' + how + ': ' + JSON.stringify({ clash: x.clash, oneSided: x.oneSided, EA: x.EA, vA: x.vA, slideA: x.slideA, tearA: x.tearA, vB: x.vB, rA: x.recoilAbsorbed && x.recoilAbsorbed.J }));
      const cU = Object.assign({}, cA, { unbreakable: true }), u = P.shove(cU, Object.assign({}, cU, { body: O3, anchor: 'bolted' }));
      if (!(u.clash === 'paradox' && u.oneSided === true && u.EA === 0 && u.stalled && u.vA === 0 && u.vB === 0 && !u.recoilAbsorbed && !u.toGround)) bad.push(anc + ' Unbreakable: ' + JSON.stringify({ clash: u.clash, oneSided: u.oneSided, EA: u.EA, stalled: u.stalled, vA: u.vA }));
    }
    const c0 = ctxOf(Infinity, { body: R3, anchor: 'bolted' }), x0 = P.shove(c0, Object.assign({}, c0, { body: O3 }));
    if (!(x0.clash === 'rockGives' && !x0.oneSided && x0.tearA > 0 && x0.vA === P.K.c && !x0.recoilAbsorbed)) bad.push('powers off, both bolted: ' + x0.clash + (x0.oneSided ? ' (one-sided)' : ''));
    ok('6b: an unlimited shove into a bolted partner with the shover\'s recoil taken (standing or bolted): one-sided (only the partner is held; the page words it so), he stays put with no energy and nothing tears around his feet, his source takes the unbounded push back, and only the rock around the partner\'s bolts tears out (he leaves at just under light speed); with the partner\'s ground held, nothing gives; with the powers off and both bolted, the rock gives around both as before (not one-sided)', !bad.length, bad.join('; ')); }
  ok('6b: the comic jump at unlimited strength (Q9): unbounded upward, and their power supplies all of it, unbounded (the ground takes none: no push time)', j.v === P.K.c && j.pushOff && j.pushOff.whole === Infinity && j.pushOff.supplied === Infinity && j.pushOff.J === 0 && j.pushOff.T === 0 && jU.pushOff && jU.pushOff.supplied === Infinity);
}

// 7. Safe passenger on by default (BRIEF-canon.md item 5, pull request 3; canon, RT 4.2, and the ruling of 14 Oct 2026:
// it also covers where the person lands and the air's drag on them). With it on the passenger hazard never fires (5a,
// above); a thrown person's landing energy is taken back and its momentum still reaches the ground; the landing makes no
// blast; with it off nothing changes. The brief's figures are at the 3,000 kg Rex, a person thrown 30 m at 45 degrees
// at the page's default dial (100 short tons), the four powers on.
{
  const person = obj('person'), R0 = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), F0 = 100 * 907.18474 * g;
  const cOf = (F, x) => Object.assign({ F, mode: 'comic', body: R0, surface: surf('concrete'), anchor: 'friction' }, ON, x || {});
  const oOf = (x) => Object.assign({ obj: person, angle: 45, near: 5, body: R0, surface: surf('concrete') }, ON, x || {});
  // the landing at the least disruptive effort with the switch on (3,342 kg-force): energy taken back, momentum on
  const r = P.throwObject(cOf(F0, { use: 3342 * g, safePassenger: true }), person, 45), on = oOf({ safePassenger: true }), off = oOf({ safePassenger: false });
  const pl = M.throw.passengerLanding(r, on), ls = M.throw.landShake(r, on), ls0 = M.throw.landShake(r, off);
  ok('7: with Safe passenger on, a thrown person\'s landing energy is taken back (all of it: the engine\'s impact energy, about 14,600 J at the least effort), and its momentum still reaches the ground (the landing\'s pulse carries it, the same with the switch off)',
    !!pl && !!ls && pl.absorbed === r.Eimpact && r.Eimpact > 0 && near(pl.absorbed, 14600, 0.01) && near(pl.J, P.vToMomentum(r.flight.vImpact, person.m), 1e-12) && near(ls.F * ls.T / 2, pl.J, 1e-12) && JSON.stringify(ls) === JSON.stringify(ls0)
      && JSON.stringify(M.throw.shake(r, on)) === JSON.stringify(M.throw.shake(r, off)) && near(pl.J, 1630, 0.01), pl && ls ? sig(pl.absorbed) + ' J taken back, ' + sig(pl.J) + ' kg m/s to the ground over ' + sig(ls.T) + ' s' : 'landing ' + JSON.stringify(pl) + ', pulse ' + JSON.stringify(ls));
  // null with the switch off, for anything that isn't a person, and for a throw that doesn't land
  const car = P.throwObject(cOf(F0, { safePassenger: true }), obj('car'), 45), esc = P.throwObject(cOf(1e10 * g, { safePassenger: true }), person, 45), rel = P.throwObject(cOf(1e20 * g, { safePassenger: true }), person, 45);
  ok('7: no landing taken back with Safe passenger off, for a car, or for a person who never lands (escapes, or past 1% of light speed)', M.throw.passengerLanding(r, off) === null && M.throw.passengerLanding(car, oOf({ obj: obj('car'), safePassenger: true })) === null
    && esc.flight.escaped && !esc.flight.landed && M.throw.passengerLanding(esc, on) === null && rel.flight.relativistic && M.throw.passengerLanding(rel, on) === null);
  // the landing blast: a person landing past Mach 1 (10^7 kg-force at a 10^9 kg dial) makes none with the switch on, and
  // the same as before with it off; a car's is unchanged; a call with no object (as some checks make) still works
  const fast = P.throwObject(cOf(1e9 * g, { use: 1e7 * g, safePassenger: true }), person, 45), bOn = M.throw.blastParts(fast, on), bOff = M.throw.blastParts(fast, off);
  const carF = P.throwObject(cOf(1e10 * g, { use: 1e8 * g }), obj('car'), 45), carOn = M.throw.blastParts(carF, oOf({ obj: obj('car'), safePassenger: true })), carOff = M.throw.blastParts(carF, oOf({ obj: obj('car'), safePassenger: false }));
  ok('7: a person landing past Mach 1 makes no landing blast with Safe passenger on (its energy is taken back) and the same as before with it off; a car\'s is unchanged',
    fast.flight.landed && fast.flight.vImpact >= P.K.a0 && bOn.land === 0 && bOff.land === fast.Eimpact && bOn.path === bOff.path && carF.flight.vImpact >= P.K.a0 && carOn.land === carF.Eimpact && carOn.land === carOff.land && M.throw.blastParts(fast, { airAbsorb: 1, safePassenger: true }).land === fast.Eimpact,
    'lands at ' + sig(fast.flight.vImpact) + ' m/s; landing blast ' + sig(bOff.land) + ' J with it off');
  // no result gains a key, and Safe passenger is not one of the powers anyPower reads
  const k1 = Object.keys(P.throwObject(cOf(F0, { use: 3342 * g, safePassenger: true }), person, 45)).sort().join(), k0 = Object.keys(P.throwObject(cOf(F0, { use: 3342 * g }), person, 45)).sort().join();
  ok('7: Safe passenger adds no key to a throw\'s result, and anyPower leaves it out', k1 === k0 && P.anyPower({ safePassenger: true }) === false);
  // the brief's figures (BRIEF-canon.md item 5, at 3,000 kg): the planner as the page runs it
  const planOf = (x, sp) => P.RESTRAINT.planNow('throw', cOf(F0, Object.assign({ safePassenger: sp }, x)), { near: 5, target: 30, obj: person, angle: 45, safePassenger: sp, silentStrike: false, softLanding: false });
  const pOn = planOf({}, true), pOff = planOf({}, false), p4 = planOf({ airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false }, true);
  const gOn = pOn.goal(), cOn = pOn.ceiling(), cOff = pOff.ceiling(), c4 = p4.ceiling(), onset = (ce) => Math.sqrt(ce.below * ce.use) / g;
  const rLeast = pOn.run(gOn.use), plLeast = M.throw.passengerLanding(rLeast, pOn.opt), all4 = p4.run(undefined);
  ok('7: the brief\'s figures: with the switch on, least disruptive 3,342 kg-force (released at 16.4 m/s, 30 m, lands at 18.0 m/s, 14,600 J taken back), ceiling about 27,000 kg-force from the landing\'s plaster; off, ceiling 334 kg-force (the person\'s g-force); all four powers off, Safe passenger on: no ceiling, plaster within 1.4 m of the landing all-out',
    near(gOn.use / g, 3342, 0.005) && near(rLeast.v, 16.4, 0.005) && near(rLeast.flight.range, 30, 0.005) && near(rLeast.flight.vImpact, 18.0, 0.005) && near(plLeast.absorbed, 14600, 0.01)
      && cOn.by === 'plaster' && near(onset(cOn), 27000, 0.01) && M.throw.shakeFrom(pOn.run(cOn.use), pOn.opt) === 'landing' && cOff.by === 'passenger' && near(onset(cOff), 333.4, 0.005) && !c4.by && near(P.plasterReach(M.throw.shake(all4, p4.opt)), 1.36, 0.01),
    'least ' + sig(gOn.use / g) + ' kg-force; ceiling ' + cOn.by + ' at ' + sig(onset(cOn)) + '; off ' + cOff.by + ' at ' + sig(onset(cOff)) + '; four off: ' + (c4.by || 'none') + ', plaster reach ' + sig(P.plasterReach(M.throw.shake(all4, p4.opt))) + ' m');
  // review round 1 of pull request 3 (physics-fast-landing-bearing): the landing's push stays real and whole; past what
  // the ground bears over the person's facing area (less their weight) it gives way where they land. Review round 2
  // (physics-landground-1ms-floor): the push is over the person's own stop, T = L / v (README decision 4), with no 1 ms
  // floor (that belongs to landShake's shaking model): below L / 1 ms (559 m/s) it is landShake's mean push (a Hann
  // pulse: half its peak), above it m v^2 / L. Straight down, the speeds where the ground just bears it are the ones the
  // README and the Their powers card give: about 100 m/s on the concrete slab and asphalt, 140 m/s on ice, 1.8 km/s on
  // steel, 2.7 km/s on granite, 20-50 m/s on sand, gravel and clay
  {
    const lgOf = (rr, sid) => P.PASSENGER.landGround(person, rr.flight.vImpact, surf(sid || 'concrete'));
    const allD = P.throwObject(cOf(F0, { safePassenger: true }), person, 45), all9 = P.throwObject(cOf(Math.pow(10, 9.15) * g, { safePassenger: true }), person, 45);
    const vb = (sid, a) => P.PASSENGER.landGround(person, 1, surf(sid), a).vBear, r2 = (x) => Number(x.toPrecision(2));
    const at = (sid, f) => P.PASSENGER.landGround(person, vb(sid) * f, surf(sid)).gives;
    const soils = ['sand', 'gravel', 'softclay', 'stiffclay'].map((x) => vb(x));
    const L0 = Math.cbrt(6 * person.m / (Math.PI * (person.rho || 1000))), bad = [];
    for (const rr of [r, allD]) { const ls1 = M.throw.landShake(rr, on); if (!(rr.flight.vImpact < L0 / 1e-3) || !near(lgOf(rr).push, ls1.F / 2, 1e-12)) bad.push('push ' + sig(lgOf(rr).push) + ' vs ' + sig(ls1.F / 2)); }
    const v9 = all9.flight.vImpact, mv2L = P.vToMomentum(v9, person.m) * v9 / L0;
    if (!(v9 > L0 / 1e-3) || !near(lgOf(all9).push, mv2L, 1e-12) || !(lgOf(all9).push > 9 * M.throw.landShake(all9, on).F / 2)) bad.push('10^9.15 push ' + sig(lgOf(all9).push) + ' vs m v^2/L ' + sig(mv2L));
    for (const sid of D.surfaces.map((x) => x.id)) if (at(sid, 0.999) || !at(sid, 1.001)) bad.push('threshold ' + sid);
    ok('7: past what the ground bears (its bearing over the person\'s facing area, less their weight) a Safe-passenger landing gives way, over their own stop L / v (no 1 ms floor): straight down about 100 m/s on the slab and asphalt, 140 m/s on ice, 1.8 km/s on steel, 2.7 km/s on granite, 20-50 m/s in soil; not at the default dial all-out (81 m/s), about 9,850 times past it at a 10^9.15 kg dial, and granite gives way there too (14 times); the push is landShake\'s below 559 m/s, whole',
      !bad.length && r2(vb('concrete')) === 100 && r2(vb('asphalt')) === 100 && r2(vb('ice')) === 140 && r2(vb('steel')) === 1800 && r2(vb('granite')) === 2700 && Math.min(...soils) >= 19.5 && Math.max(...soils) <= 51
        && !lgOf(allD).gives && lgOf(all9).gives && near(lgOf(all9).push / lgOf(all9).bear, 9850, 0.01) && lgOf(all9, 'granite').gives && near(lgOf(all9, 'granite').push / lgOf(all9, 'granite').bear, 14.5, 0.01) && JSON.stringify(M.throw.landShake(all9, on)) === JSON.stringify(M.throw.landShake(all9, off)),
      bad.join('; ') + ' slab ' + sig(vb('concrete')) + ', ice ' + sig(vb('ice')) + ', steel ' + sig(vb('steel')) + ', granite ' + sig(vb('granite')) + ', soils ' + soils.map(sig).join('/') + ' m/s; 10^9.15: ' + sig(lgOf(all9).push / lgOf(all9).bear) + 'x, granite ' + sig(lgOf(all9, 'granite').push / lgOf(all9, 'granite').bear) + 'x');
    // review round 2 (physics-landground-angle): the ground bears the downward part of the push, as weakGround splits a
    // landing (the sideways part is a skid, which breaks nothing). At 45 degrees the slab gives way from about 120 m/s
    // (a dial of about 202,000 kg all-out); a person skimming in at 2.8 degrees at 151 m/s (a 10^5.5 kg dial, thrown
    // level all-out) presses down with about a tenth of what it bears. The game of catch's miss angle is worked out
    // again from the leg (catchMissAngle: its speed matches the leg's miss); the level fastball's miss at 155 m/s
    // (2.1 degrees) doesn't give way, the lob's at 176 m/s (45 degrees) does; a ground hit meets it along the chord
    const lvl = P.throwObject(cOf(Math.pow(10, 5.5) * g, { safePassenger: true }), person, 0), a202 = P.throwObject(cOf(202500 * g, { safePassenger: true }), person, 45), a201 = P.throwObject(cOf(201500 * g, { safePassenger: true }), person, 45);
    const lgA = (rr, sid) => P.PASSENGER.landGround(person, rr.flight.vImpact, surf(sid || 'concrete'), rr.flight.impactAngleDeg);
    const O0 = P.makeBody(Object.assign({ build: 'ollie' }, P.DEFAULT_BODIES.ollie)), leg = (lk, Dm, style, air) => { const cT = cOf(Math.pow(10, lk) * g, { airAbsorb: air, safePassenger: true }); const L = P.catchLeg(cT, Object.assign({}, cT, { body: O0 }), person, Dm, style), ma = P.catchMissAngle(L, person, cT); return { L, ma, lg: ma && P.PASSENGER.landGround(person, L.miss.vImpact, surf('concrete'), ma.angleDeg) }; };
    const fb = leg(8, 100, 'hard', 0), lob = leg(7, Math.pow(10, 3.5), 'easy', 1), hit = leg(16, Math.pow(10, 4.5), 'hard', 1), bad2 = [];
    if (!(lvl.flight.impactAngleDeg < 3 && lvl.flight.vImpact > 150 && lgOf(lvl).gives && !lgA(lvl).gives && lgA(lvl).push / lgA(lvl).bear < 0.15)) bad2.push('level 10^5.5: ' + sig(lvl.flight.vImpact) + ' m/s at ' + sig(lvl.flight.impactAngleDeg) + ' deg, ' + sig(lgA(lvl).push / lgA(lvl).bear) + 'x');
    if (r2(vb('concrete', 45)) !== 120 || !lgA(a202).gives || lgA(a201).gives) bad2.push('45 deg slab ' + sig(vb('concrete', 45)) + ' m/s; 202,500 kg ' + lgA(a202).gives + ', 201,500 kg ' + lgA(a201).gives);
    if (!fb.ma || fb.ma.vImpact !== fb.L.miss.vImpact || !near(fb.L.miss.vImpact, 155, 0.01) || !(fb.ma.angleDeg < 3) || fb.lg.gives || !lob.ma || lob.ma.vImpact !== lob.L.miss.vImpact || !(lob.ma.angleDeg > 44) || !lob.lg.gives) bad2.push('catch misses: fastball ' + JSON.stringify(fb.ma) + ' ' + (fb.lg && fb.lg.gives) + ', lob ' + JSON.stringify(lob.ma) + ' ' + (lob.lg && lob.lg.gives));
    if (hit.L.result !== 'hits-ground' || !hit.ma || !near(hit.ma.angleDeg, 0.132, 0.01) || !hit.lg.gives) bad2.push('ground hit along the chord: ' + hit.L.result + ' ' + JSON.stringify(hit.ma));
    ok('7: the ground bears the downward part of a person\'s landing push (review round 2): about 120 m/s at 45 degrees on the slab (a dial of about 202,000 kg all-out), not a grazing landing at 151 m/s and 2.8 degrees; in the game of catch the miss angle is worked out again from the leg (the fastball\'s 155 m/s miss at 2 degrees bears, the lob\'s 176 m/s at 45 degrees gives way; a ground hit along its chord, 0.13 degrees)', !bad2.length, bad2.join('; '));
    // review round 2 (physics-hits-ground-below-100): a person kept whole (Things keep their form on) who hits the ground
    // below 100% absorbed: their own energy at the hit (the snowplow lump's motion, exact) is their landing; the rest, the
    // swept air's heat and motion, is real. 97.9% their own at 99.9%, 82% at 99%, 24% at 90%; none of it is told apart
    // where the person isn't kept (Things keep their form off) or meets no air (100%)
    const hg = (air, kf) => { const cT = cOf(1e16 * g, { airAbsorb: air, keepForm: kf, safePassenger: true }); return P.catchLeg(cT, Object.assign({}, cT, { body: O0 }), person, Math.pow(10, 4.5), 'hard').hitsGround; };
    const h999 = hg(0.999, true), h99 = hg(0.99, true), h9 = hg(0.9, true), h1 = hg(1, true), hOff = hg(0.999, false);
    ok('7: below 100% absorbed, a person kept whole who hits the ground: their own share is told apart from the swept air\'s (97.9% at 99.9%, 82% at 99%, 24% at 90%), its crater and quake from the rest; not where they meet no air or aren\'t kept',
      !!(h999 && h999.own && h99.own && h9.own) && near(h999.own.E / h999.E, 0.9794, 0.001) && near(h99.own.E / h99.E, 0.8198, 0.001) && near(h9.own.E / h9.E, 0.2395, 0.002) && near(h999.own.E + h999.own.rest, h999.E, 1e-12) && h999.own.rest > h999.airHeat
        && h999.own.crater > 0 && h999.own.crater < h999.crater && near(h999.own.quake, P.seismicMagnitude(h999.own.rest), 1e-12) && !('own' in h1) && !('own' in hOff),
      h999 && h999.own ? sig(h999.own.E / h999.E) + ' / ' + sig(h99.own.E / h99.E) + ' / ' + sig(h9.own.E / h9.E) + ' their own; rest ' + sig(h999.own.rest) + ' J, crater ' + sig(h999.own.crater) + ' m' : JSON.stringify(h999));
  }
}

// 8. Contests and Never knocked back (BRIEF-canon.md item 4, pull request 4; canon, the rulings of 14 Oct 2026). Every
// Rex + Ollie test is a contest: force moves, Never knocked back is set aside, the other's push is real, and only the
// push each puts on himself is absorbed (They take their own recoil). A charger doesn't slow (a body of unbounded mass at
// his speed); where the one he hits is held without limit by their powers the collision has no physical answer. The
// steady push isn't capped by the pusher's own footing; in the shoving match each pushes with the effort he uses; Both
// at once shoves each with the other's shove; arm wrestling is built on reading B (each pad or each one's feet hold the
// OTHER's press: the brief's reading A leaves the other's real press with nothing on his side carrying it). Never knocked
// back (noKnockback, a key of each one's own context) acts only on a game-of-catch throw that reaches the catcher as a
// fireball or plasma. The bodies are the 3,000 kg defaults; the dial is the page's 100 short tons unless stated.
{
  const R3 = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), O3 = P.makeBody(Object.assign({ build: 'ollie' }, P.DEFAULT_BODIES.ollie));
  const cl = P.K.c, dial = 100 * 907.18474 * g, conc = surf('concrete');
  const c3 = (F, body, x) => Object.assign({ F, mode: 'comic', body, surface: conc, anchor: 'friction' }, x || {});
  const on = (x) => Object.assign({}, ON, x || {}), off = (x) => Object.assign({}, x || {});
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  // a condition that reads a key a broken engine might leave out fails the check rather than stopping the test
  const chk = (f) => { try { return !!f(); } catch (e) { return false; } };
  // Ollie charges Rex (the page's Collide: Ollie is the charger)
  const charge = (F, o, xR, xO, FR) => P.collide(c3(F, O3, xO || on()), c3(FR == null ? F : FR, R3, xR || on()), o);
  const gb1 = 0.001 / Math.sqrt(1 - 1e-6), gb50 = 0.5 / Math.sqrt(0.75);
  const holdR = P.anchorCapacity({ body: R3, surface: conc, theta: 0, anchor: 'friction', groundHolds: true, mA: R3.m }).R;

  // 8a. the charger keeps his speed; the one hit leaves at his speed (splat) or 2v/(1+v^2/c^2) (bounce); his source
  // supplies the one hit's gain plus what the one hit's footing hands the ground (to 1e-9); the bounce bound ignores the
  // footing (footJ 0), as the bounce's after-speeds do
  { const bad = [], seen = [];
    for (const [lab, F, o, xR, xO] of [['sprint', dial, { source: 'sprint' }], ['sprint at 10^9 kg', 1e9 * g, { source: 'sprint' }], ['0.1% of c', dial, { source: 'set', gb: gb1 }], ['50% of c', dial, { source: 'set', gb: gb50 }],
      ['jump at 10^6.25 kg on real ground (own recoil only)', Math.pow(10, 6.25) * g, { source: 'jump' }, { ownRecoil: true }, { ownRecoil: true }], ['sprint, own recoil only', dial, { source: 'sprint' }, { ownRecoil: true }, { ownRecoil: true }]]) {
      for (const bounce of [false, true]) {
        const r = charge(F, Object.assign({ bounce }, o), xR, xO), k = r.carry, v = r.vRel, tag = lab + (bounce ? ' bounce' : ' splat');
        if (r.outcome !== 'carried' || !k || r.unbounded !== true || r.held !== false) { bad.push(tag + ': ' + r.outcome); continue; }
        const gam = 1 / Math.sqrt(1 - (v / cl) * (v / cl)), mB = R3.m;
        const vWant = bounce ? 2 * v / (1 + (v / cl) * (v / cl)) : v, pWant = bounce ? 2 * gam * gam * mB * v : P.vToMomentum(v, mB);
        const Fc = bounce ? r.contact.softEl : r.contact.soft, footWant = bounce ? 0 : Math.min(r.hold.H, Fc.F) * Fc.t;
        if (!(k.v === v && r.h.el.vA === v && r.h.inel.V === v && k.stop.J === r.pA)) bad.push(tag + ': the charger slows (' + sig(r.h.el.vA) + ' of ' + sig(v) + ')');
        if (!near(k.vB, vWant, 1e-12) || !near(k.pGain, pWant, 1e-9)) bad.push(tag + ': leaves at ' + sig(k.vB) + ' (want ' + sig(vWant) + ') with ' + sig(k.pGain) + ' kg m/s (want ' + sig(pWant) + ')');
        if (!(near(k.supplied, k.pGain + k.footJ, 1e-9) && (k.footJ === 0 ? footWant === 0 : near(k.footJ, footWant, 1e-12)))) bad.push(tag + ': source ' + sig(k.supplied) + ' vs gain ' + sig(k.pGain) + ' + footing ' + sig(k.footJ) + ' (want ' + sig(footWant) + ')');
        if (r.toGround && !(r.toGround.J === k.footJ && r.toGround.how === 'carried')) bad.push(tag + ': toGround ' + sig(r.toGround.J) + ' is not the footing\'s share');
        if ((xR || on()).unbreakable && !bounce && k.footJ > 0 && !r.toGround) bad.push(tag + ': no toGround with Unbreakable footing on');
        seen.push(tag + ' ' + sig(k.vB) + ' m/s, ' + sig(k.supplied) + ' kg m/s');
      }
    }
    // at 50% of c the bounce's ground-frame momentum is 2 gamma^2 m v, not the immovable sums' 2 p (the brief's first runs)
    const r50 = charge(dial, { source: 'set', gb: gb50, bounce: true });
    ok('8a: a charger with his recoil taken keeps his speed; the one hit, on his footing, leaves at his speed (splat) or 2v/(1+v^2/c^2) (bounce), and the charger\'s source supplies the one hit\'s gain plus his footing\'s share, to 1e-9 (sprint, 10^9 kg, 0.1% and 50% of c, a jump onto Rex on real ground; the bounce bound ignores the footing, as its speeds do)', !bad.length && r50.carry && r50.carry.pGain > 1.15 * 2 * P.vToMomentum(r50.vRel, R3.m), bad.length ? bad.join('; ') : seen.join('; '));
  }
  // 8b. the paradox: held without limit by their powers (bolted on Unbreakable footing, any charge; landed on from above
  // with Unbreakable footing or Comic ground holding him up): no h, contact, toGround or after; the charge itself kept.
  // Not held without limit: standing (carried), from above on real ground (carried, driven into it), bolted on real rock
  // (carried, the rock tears out around his bolts and he slides on his own friction)
  { const bad = [];
    const para = [['bolted on Unbreakable footing, sprint', { source: 'sprint' }, on({ anchor: 'bolted' }), 'bolted'], ['bolted, 0.1% of c', { source: 'set', gb: gb1 }, on({ anchor: 'bolted' }), 'bolted'], ['bolted, light speed', { source: 'set', gb: Infinity }, on({ anchor: 'bolted' }), 'bolted'],
      ['jump onto him at 10^9 kg', { source: 'jump' }, on(), 'unbreakable', 1e9 * g], ['stomp-launch onto him at 10^9 kg', { source: 'stomp' }, on(), 'unbreakable', 1e9 * g], ['jump onto him, Comic ground', { source: 'jump' }, { ownRecoil: true, groundHolds: true }, 'comicGround', 1e9 * g]];
    for (const [lab, o, xR, why, F] of para) for (const bounce of [false, true]) {
      const r = charge(F || dial, Object.assign({ bounce }, o), xR, Object.assign({}, xR, { anchor: 'friction' }));
      if (!(r.outcome === 'paradox' && r.unbounded === true && r.heldBy === why && !r.h && !r.contact && !r.toGround && !r.after && !r.earth && !r.rock && r.speed && r.v0 > 0)) bad.push(lab + (bounce ? ' bounce' : '') + ': ' + r.outcome + ' ' + r.heldBy);
    }
    const j9 = charge(1e9 * g, { source: 'jump' }), s9 = charge(1e9 * g, { source: 'stomp' });
    const notPara = [['standing', charge(dial, { source: 'sprint' }), 'carried'], ['from above on real ground (own recoil only)', charge(Math.pow(10, 6.25) * g, { source: 'jump' }, { ownRecoil: true }, { ownRecoil: true }), 'carried'],
      ['bolted on real rock', charge(dial, { source: 'sprint' }, on({ anchor: 'bolted', unbreakable: false }), on({ unbreakable: false })), 'carried'], ['standing at light speed', charge(dial, { source: 'set', gb: Infinity }), 'unstoppable']];
    for (const [lab, r, want] of notPara) if (r.outcome !== want) bad.push(lab + ': ' + r.outcome);
    const rr = notPara[2][1], k = rr.carry, tear = R3.digArea * conc.shear;
    if (!(k && k.rockGives === true && near(k.tear, tear, 1e-12) && near(k.footJ, Math.min(tear, rr.contact.soft.F) * rr.contact.soft.t, 1e-12))) bad.push('real rock: ' + JSON.stringify(k));
    // he slides on his own friction once torn loose, as a standing Rex does
    if (!(near(rr.after.splat.slide, notPara[0][1].after.splat.slide, 1e-12))) bad.push('real rock slide ' + sig(rr.after.splat.slide) + ' vs standing ' + sig(notPara[0][1].after.splat.slide));
    const above = notPara[1][1];
    if (!(above.after.splat.depth > 0.01 && above.dir === 'v')) bad.push('from above on real ground: not driven in (' + JSON.stringify(above.after.splat) + ')');
    ok('8b: the paradox where the one hit is held without limit by their powers (bolted on Unbreakable footing at a sprint, 0.1% of c and light speed; landed on from above where Unbreakable footing or Comic ground holds him up: the jump at ' + sig(j9.v0) + ' m/s and the stomp-launch at ' + sig(s9.v0) + ' m/s at 10^9 kg), with no h, contact, ground push or after, the charge kept; not where he isn\'t: standing he is carried, from above on real ground he is driven in (' + sig(above.after.splat.depth * 100) + ' cm), bolted on real rock the rock tears out (' + sig(tear) + ' N) and he slides on his own friction; at light speed today\'s unstoppable', !bad.length, bad.join('; '));
  }
  // 8c. the hit's energy: absorbed by default (hitAbsorbed, the shimmer's figure), real only when he means it (meanIt:
  // the page's blast presets); a bounce frees none; past 1% of light speed the one hit, carried off, meets real air, and
  // so does the charger's run-up: real either way
  { const s = charge(dial, { source: 'sprint' }), sm = charge(dial, { source: 'sprint', meanIt: true }), sb = charge(dial, { source: 'sprint', bounce: true });
    const g1 = charge(dial, { source: 'set', gb: 0.02 }), g1m = charge(dial, { source: 'set', gb: 0.02, meanIt: true });
    const keOf = (r) => P.momentumToKE(r.carry.pGain, R3.m);
    const s0 = P.collide(c3(dial, O3, on({ ownRecoil: false })), c3(dial, R3, on({ ownRecoil: false })), { source: 'sprint' }), s0m = P.collide(c3(dial, O3, on({ ownRecoil: false })), c3(dial, R3, on({ ownRecoil: false })), { source: 'sprint', meanIt: true });
    ok('8c: the hit\'s freed energy is absorbed by default (494 kJ at the default sprint: hitAbsorbed, none of it in Elocal) and real when he means it (meanIt: hitAbsorbed 0, Elocal = Q); a bounce frees none; past 1% of light speed the one hit\'s motion and the charger\'s run-up air are real either way; with his recoil not taken meanIt changes nothing',
      chk(() => near(s.Q, 4.94e5, 0.002) && s.hitAbsorbed.E === s.Q && s.Elocal === 0 && !s.meanIt && sm.hitAbsorbed.E === 0 && sm.Elocal === sm.Q && sm.meanIt === true && sb.hitAbsorbed.E === 0 && sb.Elocal === 0
        && g1.relativistic && near(g1.Elocal, keOf(g1) + g1.airRunUp, 1e-12) && g1.hitAbsorbed.E === g1.Q && near(g1m.Elocal, g1m.Q + keOf(g1m) + g1m.airRunUp, 1e-12) && same(s0, s0m) && !('hitAbsorbed' in s0)),
      'Q ' + sig(s.Q) + ' J; at 2% of c Elocal ' + sig(g1.Elocal) + ' J (meant: ' + sig(g1m.Elocal) + ')');
  }
  // 8d. the 'Truly immovable' thought experiment sets the mover's own recoil aside (decision 4): its results are today's,
  // in the charge and the steady push; with They take their own recoil off, Collide and the steady push are as before
  // (no new key), except the bounce's footing share (8e)
  { const bad = [];
    for (const src of ['sprint', 'jump', 'stomp']) for (const bounce of [false, true]) for (const F of [dial, 1e9 * g, Infinity]) {
      const imm = (x) => P.collide(c3(F, O3, x), c3(F, R3, Object.assign({ immovable: true }, x)), { source: src, bounce });
      if (!same(imm(on()), imm(on({ ownRecoil: false })))) bad.push('immovable ' + src + (bounce ? ' bounce' : '') + ' ' + sig(F / g));
      const r0 = P.collide(c3(F, O3, on({ ownRecoil: false })), c3(F, R3, on({ ownRecoil: false })), { source: src, bounce });
      if ('carry' in r0 || 'unbounded' in r0 || 'hitAbsorbed' in r0 || r0.outcome === 'carried') bad.push('own recoil off ' + src + ': new keys');
    }
    for (const F of [dial, Infinity]) { const so = (x) => P.standoff(c3(F, O3, x), c3(F, R3, Object.assign({ immovable: true }, x))); if (!same(so(on()), so(on({ ownRecoil: false })))) bad.push('standoff immovable ' + sig(F / g)); }
    ok('8d: the Truly immovable thought experiment is unchanged with They take their own recoil on (the charge from a sprint, a jump and a stomp-launch, splat and bounce, at the default dial, 10^9 kg and unlimited strength; the steady push); with the power off Collide reports no new key', !bad.length, bad.join('; '));
  }
  // 8e. pull request 2's Known limit, fixed: knocked back in a bounce (Unbreakable footing alone), the bounce bound ignores
  // his footing (elasticUpper), so it hands the ground nothing; the splat books its footing's share as before
  { const x = { unbreakable: true }, sp = P.collide(c3(dial, O3, x), c3(dial, R3, x), { source: 'sprint' }), bo = P.collide(c3(dial, O3, x), c3(dial, R3, x), { source: 'sprint', bounce: true });
    ok('8e: knocked back in a bounce (Unbreakable footing alone), nothing goes into the ground through his footing (the bounce bound ignores it, as its speeds do); the splat still books the footing\'s share (pull request 2\'s over-count of about 1.1% is gone)', sp.outcome === 'moved' && sp.toGround && sp.toGround.J === sp.partial.Jearth && sp.toGround.how === 'footing' && bo.outcome === 'moved' && !bo.toGround && near(bo.h.el.pA + bo.h.el.pT, bo.pA, 1e-9), 'splat ' + sig(sp.toGround && sp.toGround.J) + ' kg m/s; bounce ' + (bo.toGround ? sig(bo.toGround.J) : 'none'));
  }
  // 8f. the steady push: with the pusher's recoil taken his push isn't capped by his own footing and he never slips; the
  // one pushed holds with his footing, or his bolts and the rock around them; an unlimited push against a hold without
  // limit is the one-sided paradox; on real rock only the held side's rock tears; the rock carries no dipole
  { const so = P.standoff(c3(dial, O3, on()), c3(dial, R3, on())), so0 = P.standoff(c3(dial, O3, on({ ownRecoil: false })), c3(dial, R3, on({ ownRecoil: false })));
    const pP = P.standoff(c3(Infinity, O3, on()), c3(dial, R3, on({ anchor: 'bolted' }))), pR = P.standoff(c3(Infinity, O3, on({ unbreakable: false })), c3(dial, R3, on({ anchor: 'bolted', unbreakable: false })));
    const bb = P.standoff(c3(1e8 * g, O3, on({ unbreakable: false, anchor: 'bolted' })), c3(1e8 * g, R3, on({ unbreakable: false, anchor: 'bolted' }))), bb0 = P.standoff(c3(1e8 * g, O3, { anchor: 'bolted' }), c3(1e8 * g, R3, { anchor: 'bolted' }));
    const rk = P.standoff(c3(dial, O3, on({ unbreakable: false })), c3(dial, R3, on({ anchor: 'bolted', unbreakable: false })));
    ok('8f: the steady push with the pusher\'s recoil taken: his push is his strength (' + sig(so.DA) + ' N, not capped by his ' + sig(so.RA) + ' N footing), he never slips, and it beats Rex\'s hold (' + sig(so.HB) + ' N); with the power off, a dead heat at the footing; unlimited against Rex bolted on Unbreakable footing, the one-sided paradox; on real rock only the rock around Rex\'s bolts tears out (no tearA); bolted on real rock his push loads only Rex\'s rock (no dipole: out to ' + sig(rk.rock && rk.rock.rT) + ' m)',
      so.ownRecoil === true && so.DA === dial && so.pusherSlips === false && so.outcome === 'forceWins' && so.contact === holdR && so0.outcome === 'stalemate' && so0.DA === so0.RA && so0.pusherSlips && !('ownRecoil' in so0)
        && pP.outcome === 'paradox' && pP.oneSided === true && pR.outcome === 'rockGives' && pR.oneSided === true && near(pR.tearB, R3.digArea * conc.shear, 1e-12) && !('tearA' in pR)
        && rk.rock && rk.rock.dipole === false && near(rk.rock.rT, Math.sqrt(dial / (2 * Math.PI * P.COL.ROCK_T)), 1e-12) && bb.rock && !bb.rock.dipole && bb0.rock && bb0.rock.dipole && bb.rock.rT > bb0.rock.rT,
      so.outcome + ' / ' + so0.outcome + '; ' + pP.outcome + ', ' + pR.outcome + '; both bolted at 10^8 kg: ' + sig(bb.rock && bb.rock.rT) + ' m (power off, a dipole: ' + sig(bb0.rock && bb0.rock.rT) + ' m)');
  }
  // 8g. the shoving match: with their recoil taken each pushes with the effort he uses and is held only by his footing
  // against the other's push. At the default dial each push (889,644 N) is about 50 times either grip on concrete
  // (17,652 N): both shoved apart, about 26.6 m/s each over the shove's stroke, sliding about 57 m. The search's floor
  // (the strength to stand and walk) is above the grip on every ground, so equal bodies are shoved apart at any effort
  { const pm = (FR, FO, xR, xO) => P.pushMatch(c3(FR, R3, on(xR)), c3(FO, O3, on(xO)));
    const r = pm(dial, dial), r0 = P.pushMatch(c3(dial, R3, on({ ownRecoil: false })), c3(dial, O3, on({ ownRecoil: false })));
    const t = r.t, fA = r.DB - r.HA, fB = r.DA - r.HB, rA = r.recoilAbsorbedA || { J: NaN }, rB = r.recoilAbsorbedB || { J: NaN }, ledger = r.pB - r.pA + r.footB - r.footA - rA.J + rB.J;
    ok('8g: the shoving match at the default dial, their recoil taken: each pushes with ' + sig(r.DA) + ' N against each grip of ' + sig(r.HA) + ' N (' + sig(r.DA / r.HA) + 'x), so both are shoved apart over the shove\'s stroke at ' + sig(r.vA) + ' m/s each and slide ' + sig(r.slideA) + ' m; the motion is the two constant pushes (each less his hold) over the stroke, and its momentum adds up (each one\'s gain, his feet\'s share and his push back); with the power off, a dead heat at the grip',
      r.outcome === 'bothShoved' && r.DA === dial && r.DB === dial && r.HA === holdR && near(r.vA, 26.6, 0.002) && near(r.vB, 26.6, 0.002) && near(r.slideA, 57.2, 0.003) && near(r.slideB, 57.1, 0.003) && near(r.d, Math.min(R3.strokes.throw, O3.strokes.throw), 0)
        && near(P.xOfT(fA, R3.m, t) + P.xOfT(fB, O3.m, t), r.d, 1e-12) && near(r.pA, fA * t, 1e-12) && near(r.pB, fB * t, 1e-12) && near(r.footA, r.HA * t, 1e-12) && near(rA.J, r.DA * t, 1e-12) && Math.abs(ledger) <= 1e-9 * rA.J
        && r0.outcome === 'deadlock' && r0.contact === holdR && !('ownRecoil' in r0), r.outcome + ' / ' + r0.outcome);
    const need = P.W8.WALK_LOAD * P.DEFAULT_BODIES.rex.m * g / P.MUSCLE.jump.forceFrac, bad = [], seen = [];
    for (const sf of D.surfaces) { const x = pm(need * (1 + 1e-9), need * (1 + 1e-9), { surface: sf }, { surface: sf }); seen.push(sf.id + ' ' + sig(need / x.HA) + 'x'); if (x.outcome !== 'bothShoved') bad.push(sf.id + ': ' + x.outcome + ' (grip ' + sig(x.HA) + ' N)'); }
    const lo = pm(need, need);
    ok('8g: at the least effort two-player searches use (the strength to stand and walk, ' + sig(need / g) + ' kg-force), equal bodies are still shoved apart, on every ground (' + sig(lo.vA) + ' m/s, sliding ' + sig(lo.slideA) + ' m on concrete): with their recoil taken a deadlock needs a grip above the push', !bad.length && near(lo.vA, 2.48, 0.003), bad.length ? bad.join('; ') : seen.join(', '));
    // the walk-out: only one push beats the other's grip; paced by the Pull tab's rule for the winner's own body
    const gr = surf('gravel'), w1 = pm(dial, 2200 * g, { surface: gr }, { surface: gr }), w2 = pm(dial, 1000 * g), w2o = P.pushMatch(c3(dial, R3, on({ ownRecoil: false })), c3(1000 * g, O3, on({ ownRecoil: false })));
    const fw = (x) => P.anchorCapacity({ body: R3, surface: x, theta: 0, anchor: 'friction', groundHolds: true, mA: R3.m }).R;
    const aOk = (x, sfc) => near(x.accel, Math.min((x.DA - x.HB) / O3.m, (fw(sfc) - x.DB) / R3.m), 1e-12) && near(x.contact, x.HB + O3.m * x.accel, 1e-12);
    ok('8g: the walk-out where only one push beats the other\'s grip, at the Pull tab\'s pace for the winner\'s own body, a = min((his push - the loser\'s hold) / the loser\'s mass, (his footing - the loser\'s push) / his own mass): Rex at the dial against Ollie at 2,200 kg-force on gravel (a ' + sig(w1.accel) + ' m/s2) and against Ollie lying flat at 1,000 kg-force on concrete (a ' + sig(w2.accel) + ' m/s2; with the power off a dead heat)',
      w1.outcome === 'walkOut' && w1.winner === 'A' && aOk(w1, gr) && near(w1.accel, 1.046, 0.002) && w2.outcome === 'walkOut' && aOk(w2, conc) && near(w2.accel, 5.88, 0.002) && w2o.outcome === 'deadlock', w1.outcome + ' / ' + w2.outcome + ' / off ' + w2o.outcome);
    // a bolted wrestler with the power on: his push is real (pull request 2's decision 2), so he shoves the other off over
    // the stroke ('shovedOff'); unlimited against a partner bolted on ground that holds, the one-sided paradox; on real
    // rock his rock tears out and he leaves at just under light speed
    const sb = pm(dial, dial, { anchor: 'bolted' }), sbo = P.pushMatch(c3(dial, R3, { anchor: 'bolted', ownRecoil: false }), c3(dial, O3, { ownRecoil: false }));
    const up = pm(Infinity, dial, {}, { anchor: 'bolted' }), ur = pm(Infinity, dial, { unbreakable: false }, { anchor: 'bolted', unbreakable: false }), ui = pm(Infinity, Infinity);
    ok('8g: a bolted Rex with the power on shoves Ollie off over the stroke (' + sig(sb.vB) + ' m/s, sliding ' + sig(sb.slideB) + ' m) and doesn\'t move; with it off he only holds (a dead heat); an unlimited push against Ollie bolted on Unbreakable footing is the one-sided paradox, on real rock his rock tears out and he leaves at just under light speed; both unlimited, they fly apart at just under light speed',
      sb.outcome === 'shovedOff' && sb.winner === 'A' && sb.vA === 0 && sb.vB > 30 && near(sb.pB, (sb.DA - sb.HB) * sb.t, 1e-12) && sbo.outcome === 'deadlock' && up.outcome === 'paradox' && up.oneSided === true && ur.outcome === 'bothShoved' && ur.tornB === true && ur.vB === cl && ui.outcome === 'bothShoved' && ui.vA === cl && ui.vB === cl && ui.slideA === Infinity,
      [sb.outcome, sbo.outcome, up.outcome, ur.outcome, ui.outcome].join(' / '));
  }
  // 8h. Both at once, their recoil taken: each is shoved by the other's shove, so equal bodies both fly apart (each at
  // what the Shove tab gives a planted shover's partner); with the power off, the stronger shove sets the push as before
  { const sb = P.shoveBoth(c3(dial, R3, on()), c3(dial, O3, on())), one = P.shove(c3(dial, R3, on()), c3(dial, O3, on())), back = P.shove(c3(dial, O3, on()), c3(dial, R3, on()));
    const sb0 = P.shoveBoth(c3(dial, R3, on({ ownRecoil: false })), c3(dial, O3, on({ ownRecoil: false }))), old0 = Object.assign(P.shove(c3(dial, R3, on({ ownRecoil: false })), c3(dial, O3, on({ ownRecoil: false }))), { shover: 'A' });
    const real = on({ unbreakable: false, anchor: 'bolted' }), rg = P.shoveBoth(c3(Infinity, R3, real), c3(Infinity, O3, real)), pd = P.shoveBoth(c3(Infinity, R3, on({ anchor: 'bolted' })), c3(Infinity, O3, on()));
    // (pull request 2's one-sided case, both at once: Rex standing, Ollie bolted on real rock, both unlimited: Ollie's rock
    // tears out and he leaves at just under light speed, and Ollie's unlimited shove sends Rex off too; no clash)
    const st1 = P.shoveBoth(c3(Infinity, R3, on({ unbreakable: false })), c3(Infinity, O3, real));
    ok('8h: Both at once with their recoil taken: each is shoved by the other\'s shove (Rex at ' + sig(sb.vA) + ' m/s, Ollie at ' + sig(sb.vB) + ' m/s, each sliding about ' + sig(sb.slideA) + ' m), each one\'s push back to his own source; with the power off the stronger shove sets the push, as before; unlimited, both bolted on real rock, both rocks tear out (rockGives); Rex standing, Ollie bolted on real rock, Ollie\'s rock tears out and both fly off at just under light speed; into a partner bolted on Unbreakable footing, the one-sided paradox',
      chk(() => sb.both === true && sb.shover === 'A' && sb.vB === one.vB && sb.vA === back.vB && sb.slideA === back.slideB && sb.recoilAbsorbed && near(sb.recoilAbsorbed.J, one.recoilAbsorbed.J, 0) && sb.back.recoilAbsorbed && sb.vA > 20 && !sb.stalled && same(sb0, old0)
        && rg.clash === 'rockGives' && rg.oneSided === false && rg.vA === cl && rg.vB === cl && rg.tearA > 0 && rg.tearB > 0 && pd.clash === 'paradox' && pd.oneSided === true && pd.stalled
        && !st1.clash && st1.vA === cl && st1.vB === cl && st1.tearB > 0 && !(st1.tearA > 0) && st1.recoilAbsorbed && st1.recoilAbsorbed.J === Infinity), sig(sb.vA) + ' / ' + sig(sb.vB) + '; off: ' + sig(sb0.vA) + ' / ' + sig(sb0.vB));
  }
  // 8i. arm wrestling, reading B (decision 10; the brief's reading A is physically incoherent, see armWrestle): each pad
  // (standing, each one's feet) holds the OTHER's press. A pin on the table: the winner's pad holds the loser's press
  // (spinning the forearms is his swing, to his source), so a pin never breaks the table with the power on; the presses
  // still do; the pin itself is unchanged. Standing (Things keep their form off, the table broken by the presses): his
  // own footing no longer caps his own press, so the stronger always pins; each one's feet hold the other's press
  { const aw = (FR, FO, x) => P.armWrestle(c3(FR, R3, on(x)), c3(FO, O3, on(x))), aw0 = (FR, FO, x) => P.armWrestle(c3(FR, R3, on(Object.assign({ ownRecoil: false }, x))), c3(FO, O3, on(Object.assign({ ownRecoil: false }, x))));
    const p1 = aw(dial, 1000 * g), p0 = aw0(dial, 1000 * g), k1 = aw(dial, 1000 * g, { keepForm: false }), k0 = aw0(dial, 1000 * g, { keepForm: false });
    let pinBreaks = 0, runs = 0;
    for (const lg of [2.5, 3, 3.5, 4, 5, 6, 9, 12, 20]) for (const lo of [2, 2.5, 3, 4, 6, 9]) for (const sid of ['sand', 'concrete', 'ice', 'granite', 'softclay']) for (const anc of ['friction', 'bolted']) for (const kf of [false, true]) for (const ub of [false, true]) {
      const x = { keepForm: kf, unbreakable: ub, surface: surf(sid), anchor: anc }, r = P.armWrestle(c3(Math.pow(10, lg) * g, R3, on(x)), c3(Math.pow(10, lo) * g, O3, on(x)));
      runs++; if (r.tableBreaksBy === 'pin' || (r.tableBreaks && !(Math.min(r.PA, r.PB) > r.tableLat))) pinBreaks++;
    }
    ok('8i: arm wrestling on the table with the winner\'s recoil taken: his pad holds the loser\'s press (' + sig(p1.padLoad) + ' N, against ' + sig(p0.padLoad) + ' N with the power off), so a pin never breaks the table (0 of ' + runs + ' runs; only both presses past what it carries do); the pin itself is unchanged; with Things keep their form off the pin that broke the table with the power off stays on it',
      p1.outcome === 'pin' && p1.padLoad === p1.PB && p0.padLoad > 50 * p1.padLoad && same(p1.pin, p0.pin) && p1.slamRatio === p0.slamRatio && pinBreaks === 0 && k1.outcome === 'pin' && !k1.tableBreaks && k0.tableBreaks && k0.tableBreaksBy === 'pin', 'power off with Things keep their form off: the table breaks by the ' + k0.tableBreaksBy);
    const st = aw(dial, dial, { keepForm: false }), st0 = aw0(dial, dial, { keepForm: false }), sp = aw(1e5 * g, 2e5 * g, { keepForm: false }), sp0 = aw0(1e5 * g, 2e5 * g, { keepForm: false });
    const u1 = aw(Infinity, Infinity, { keepForm: false }), u2 = aw(Infinity, Infinity, { keepForm: false, anchor: 'bolted' }), u3 = aw(Infinity, Infinity, { keepForm: false, anchor: 'bolted', unbreakable: false });
    ok('8i: standing, once the presses break the table (Things keep their form off): his own footing no longer caps his own press (both at the dial: a stalemate in the arms at ' + sig(st.AA) + ' N, each one\'s feet sliding under the other\'s press; with the power off a stalemate at the grip); 100 t against 200 t, Ollie pins Rex (with the power off a stalemate at the grip) and both one\'s feet slide; both unlimited: flung apart, or the paradox bolted on Unbreakable footing, or both rocks tear out on real rock',
      st.tableBreaks && st.tableBreaksBy === 'push' && st.outcome === 'stalemate' && st.AA === st.PA && !st.footLimitedA && st.draggedA === true && st.draggedB === true && st0.outcome === 'stalemate' && st0.AA === st0.RA && !('draggedA' in st0)
        && sp.outcome === 'pin' && sp.winner === 'B' && sp.AB === sp.PB && sp.winnerSlides === true && sp.loserSlides === true && sp0.outcome === 'stalemate' && !('winnerSlides' in sp0)
        && u1.outcome === 'flungApart' && u1.ownRecoil && u2.outcome === 'paradox' && u2.oneSided === false && u3.outcome === 'rockGives' && u3.tearA > 0 && u3.tearB > 0, [st.outcome, st0.outcome, sp.outcome, sp0.outcome, u1.outcome, u2.outcome, u3.outcome].join(' / '));
  }
  // 8j. lifting a partner is unchanged (holding him up is weight, not recoil; decision 11)
  { const bad = [];
    for (const F of [dial, 1e9 * g]) for (const sid of ['concrete', 'sand']) { const x = { surface: surf(sid) }, a = P.liftPartner(c3(F, R3, on(x)), c3(F, O3, on(x))), b = P.liftPartner(c3(F, R3, on(Object.assign({ ownRecoil: false }, x))), c3(F, O3, on(Object.assign({ ownRecoil: false }, x))));
      if (!same(a, b)) bad.push(sig(F / g) + ' ' + sid); }
    ok('8j: lifting a partner is the same with They take their own recoil on and off (holding him up is weight, not recoil)', !bad.length, bad.join('; '));
  }
  // 8k. Never knocked back: the fireball's push in the game of catch (Things keep their form off, some of the air's drag
  // left: a fastball 10 m apart at a 10^14 kg dial arrives as plasma). With the catcher's switch on he isn't moved, its
  // momentum goes to the endless ocean (bolted too: the power wins over Bolted), and of the energy freed where he stands
  // the air's heat is real and the motion is taken back (real when he means it); with it off, today's physics
  { const leg = (kg, x, xC, oid, Dd) => { const cT = c3(kg * g, R3, Object.assign({ keepForm: false, airAbsorb: 0 }, x)); return P.catchLeg(cT, Object.assign({}, cT, { body: O3 }, xC || {}), obj(oid || 'baseball'), Dd || 10, 'hard'); };
    const L1 = leg(1e14, {}, { noKnockback: true }), L0 = leg(1e14, {}, { noKnockback: false }), Lx = leg(1e14, {}), LB = leg(1e14, {}, { noKnockback: true, anchor: 'bolted' }), LB0 = leg(1e14, {}, { anchor: 'bolted' }), Lm = leg(1e14, {}, { noKnockback: true, meanIt: true });
    const f1 = L1.fireball, f0 = L0.fireball;
    ok('8k: Never knocked back on: the fireball (a fastball 10 m apart at 10^14 kg, Things keep their form off, all the drag acting) doesn\'t move Ollie; its momentum (' + sig(f1 && f1.p) + ' kg m/s) goes to the endless ocean; everything is freed where he stands, the air\'s heat (' + sig(f1 && f1.Egap) + ' J) real and the motion (' + sig(f1 && f1.Earr) + ' J) taken back unless he means it; bolted, the same (the power wins over Bolted); off, today\'s physics (carried off at ' + sig(f0 && f0.push.recoilV) + ' m/s; bolted, the Earth takes it)',
      chk(() => L1.result === 'fireball' && f1.kind !== 'before' && f1.push.recoilV === 0 && f1.push.earthRecoilV === 0 && f1.knockAbsorbed && f1.knockAbsorbed.J === f1.p && near(f1.knockAbsorbed.E, f1.E - f1.Egap, 1e-12) && f1.Ehere === f1.E && f1.Eafter === 0 && f1.Ecarry === 0 && f1.Enear === 0 && f1.Eblast === f1.Egap
        && same(L0, Lx) && !('knockAbsorbed' in f0) && near(f0.push.recoilV, 342.5, 0.002) && f0.Ecarry > 0 && LB.fireball.knockAbsorbed && LB.fireball.knockAbsorbed.J === LB.fireball.p && LB.fireball.push.earthRecoilV === 0 && LB0.fireball.push.earthRecoilV > 0
        && Lm.fireball.knockAbsorbed.E === 0 && Lm.fireball.Eblast === Lm.fireball.E), L1.result + ' ' + (f1 && f1.kind));
    // the switch changes nothing else: every two-player call with Never knocked back on gives exactly what it gives off,
    // except a catch that ends in a fireball (and anyPower ignores it)
    const bad = [];
    for (const [lab, x] of [['all on', ON], ['all off', {}], ['Things keep their form off, all the drag', { airAbsorb: 0, keepForm: false, unbreakable: true, ownRecoil: true }]]) for (const F of [dial, 1e9 * g, 1e14 * g]) {
      const A = (k) => c3(F, R3, Object.assign({}, x, { noKnockback: k })), B = (k) => c3(F, O3, Object.assign({}, x, { noKnockback: k }));
      const calls = [['arm', (k) => P.armWrestle(A(k), B(k))], ['push', (k) => P.pushMatch(A(k), B(k))], ['shove', (k) => P.shove(A(k), B(k))], ['both', (k) => P.shoveBoth(A(k), B(k))], ['lift', (k) => P.liftPartner(A(k), B(k))], ['throwP', (k) => P.throwPartner(A(k), B(k), 45)],
        ['standoff', (k) => P.standoff(B(k), A(k))], ['sprint', (k) => P.collide(B(k), A(k), { source: 'sprint' })], ['jump', (k) => P.collide(B(k), A(k), { source: 'jump', bounce: true })], ['set', (k) => P.collide(B(k), A(k), { source: 'set', gb: 0.02 })],
        ['toss', (k) => P.tossPartner(A(k), O3, 'Ollie', 'easy', 10, 'friction')], ['catch car', (k) => P.catchLeg(A(k), B(k), obj('car'), 30, 'hard')], ['catch ball', (k) => P.catchLeg(A(k), B(k), obj('baseball'), 1000, 'hard')]];
      for (const [nm, f] of calls) { const a = f(true), b = f(false); if (!same(a, b) && !(a && a.result === 'fireball')) bad.push(lab + ' ' + sig(F / g) + ' ' + nm); }
    }
    ok('8k: Never knocked back changes nothing else: arm wrestling, every Wrestle move, Collide\'s charge and steady push, the partner toss and the game of catch give exactly the same results with it on and off, except a catch that ends in a fireball; anyPower leaves it out (it defaults to on)', !bad.length && P.anyPower({ noKnockback: true }) === false, bad.join('; '));
  }
  // 8l. the brief's figures at the 3,000 kg bodies (the brief's are at 3,007 kg): Ollie charges Rex, the defaults on
  { const sp = charge(dial, { source: 'sprint' }), bo = charge(dial, { source: 'sprint', bounce: true }), j9 = charge(1e9 * g, { source: 'jump' }), s9 = charge(1e9 * g, { source: 'stomp' });
    const t1 = charge(dial, { source: 'set', gb: gb1 }), t1b = charge(dial, { source: 'set', gb: gb1, bounce: true });
    const sp0 = P.collide(c3(dial, O3, on({ ownRecoil: false })), c3(dial, R3, on({ ownRecoil: false })), { source: 'sprint' });
    const r2 = (x, n) => Number(x.toPrecision(n || 3));
    const got = chk(() => true) && (() => { try { return [r2(sp.v0), r2(sp.carry.vB), r2(sp.carry.pGain), r2(sp.carry.footJ), r2(sp.carry.supplied, 2), r2(sp.Q), r2(sp.after.splat.slide), r2(bo.carry.vB), r2(bo.carry.supplied), j9.outcome, r2(j9.v0), s9.outcome, r2(t1.carry.vB / 1000), r2(t1.carry.supplied), r2(t1.Q / 1e12), r2(t1b.carry.vB / 1000), r2(t1b.carry.supplied), sp0.outcome, r2(sp0.h.inel.V), r2(sp0.Q / 1000)]; } catch (e) { return ['broken: ' + e.message]; } })();
    const want = [18.1, 18.1, 54400, 612, 55000, 494000, 27.3, 36.3, 109000, 'paradox', 286, 'paradox', 300, 8.99e8, 135, 600, 1.8e9, 'moved', 8.97, 250];
    ok('8l: the brief\'s Collide figures at 3,000 kg: the sprint carries Rex at 18.1 m/s, Ollie\'s source supplies about 55,000 kg m/s (54,400 + his footing\'s 612), 494 kJ freed and absorbed, Rex slides 27.3 m; the bounce sends him off at 36.3 m/s (109,000 kg m/s: the bounce bound ignores his footing); the jump (286 m/s) and the stomp-launch at 10^9 kg are the paradox; at 0.1% of c he is carried at 300 km/s (8.99 x 10^8 kg m/s, 135 TJ) or sent off at 600 km/s (1.8 x 10^9); with They take their own recoil off, today\'s (knocked back, 8.97 m/s, 250 kJ)', same(got, want), JSON.stringify(got));
    const pm = P.pushMatch(c3(dial, R3, on()), c3(dial, O3, on()));
    ok('8l: the brief\'s shoving match at the default dial: each push 889,644 N against each grip 17,652 N on concrete (about 50x), both shoved apart at about 26.6 m/s each, sliding about 57 m', r2(pm.DA, 6) === 889644 && r2(pm.HA, 5) === 17652 && Math.round(pm.DA / pm.HA) === 50 && r2(pm.vA) === 26.6 && Math.round(pm.slideA) === 57 && Math.round(pm.slideB) === 57, sig(pm.DA) + ' / ' + sig(pm.HA) + ' N; ' + sig(pm.vA) + ' m/s; ' + sig(pm.slideA) + ' m');
  }
}

console.log('\n' + (n - fails) + '/' + n + ' passed');
process.exit(fails ? 1 : 0);
