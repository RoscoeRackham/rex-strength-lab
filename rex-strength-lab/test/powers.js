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
  const check = (label, extra) => {
    // a fresh copy of the engine for each pass, so no cache carries results from one pass into the other
    delete require.cache[require.resolve(ENGINE)];
    P = require(ENGINE);
    P.BUILDS.rex.kV = P.BUILDS.ollie.kV = FIXTURE_KV;
    let diff = 0, missing = 0, first = null;
    const list = cases(P, D);
    for (const c of list) {
      const want = base[c.key];
      if (!want) { missing++; continue; }
      const got = hash(canon(c.run(extra)));
      if (got !== want) { diff++; if (!first) first = c.key; }
    }
    ok('powers ' + label + ': every engine result matches the engine before them (' + list.length + ' cases)', diff === 0 && missing === 0, diff || missing ? diff + ' differ, ' + missing + ' missing; first: ' + first : null);
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
    // real drag between 1.5 g and 1.5 / 0.4 g: harmful at 0%, harmless at 60%
    ok('5a: a thrown person feels 40% of the real drag at 60% absorbed (the held 1.5 g limit)', dg > P.PASSENGER.noHarm(1) && 0.4 * dg < P.PASSENGER.noHarm(1) && M.throw.passenger(r, Object.assign({ airAbsorb: 0.6 }, o)) === false && M.throw.passenger(r, Object.assign({ airAbsorb: 0 }, o)) === true && M.throw.passenger(r, Object.assign({ airAbsorb: 1 }, o)) === false, 'drag ' + sig(dg) + ' g real'); }
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
    for (const [F, sh] of [[200e18 * 907.18474 * g, 0.5], [200e18 * 907.18474 * g, 0.99], [200e18 * 907.18474 * g, 1], [1e16 * g, 0.99]]) {
      const cR = ctxOf(F, Object.assign({}, ON, { airAbsorb: sh, anchor: 'bolted' })), L = P.catchLeg(cR, Object.assign({}, cR, { body: ollie }), ob, 1000, 'hard');
      const E = P.throwObject(cR, ob, 0).Eobj, Ein = L.sheath ? E - L.sheath.E : E;
      if (!(L.result === 'caught' && L.catch && near(L.catch.Ecatch, Ein, 1e-6) && near(L.toGroundC ? L.toGroundC.J : NaN, Math.sqrt(E * E + 2 * E * ob.m * P.K.c * P.K.c) / P.K.c, 1e-6))) bad.push(sh + ': ' + L.result + ' ' + (L.catch ? sig(L.catch.Ecatch / Ein) : '') + (L.toGroundC ? ' J ' + sig(L.toGroundC.J) : ''));
    }
    ok('5a: a catch near light speed (the sheath at 50% and 99%, and 100%) frees the energy that arrives and hands the planet the throw\'s momentum', !bad.length, bad.join('; '));
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

// 5. 5d: They take their own recoil
{
  // the bus on ice (the presence test's case, a 100 t dial): no slide, and the push reaches the ground
  { const c = ctxOf(1e5 * g, { surface: surf('ice') }), cr = Object.assign({ ownRecoil: true }, c);
    const a = P.throwObject(c, obj('bus'), 45), b = P.throwObject(cr, obj('bus'), 45);
    const o = { body: rex, surface: c.surface, anchor: 'friction', angle: 45, near: 5, obj: obj('bus') };
    const p = P.RESTRAINT.planNow('throw', cr, { obj: obj('bus'), angle: 45, target: 30, near: 5 });
    ok('5d: the bus on ice: no recoil and no slide with it on (it slides without)', b.recoilV === 0 && M.throw.slide(b, Object.assign({ ownRecoil: true }, o)) === 0 && M.throw.slide(a, o) > 5 && p.result('hazard:slide').never, 'off: slides ' + sig(M.throw.slide(a, o)) + ' m');
    ok('5d: ... and its push goes into the planet: the momentum the bus keeps (the follow-through hands his arm\'s back), over the throw', b.toGround && near(b.toGround.J, b.push.pB * obj('bus').m / b.mB, 1e-12) && b.toGround.J > 0 && b.toGround.T >= P.limbPulse(rex));
    const bc = P.throwObject(Object.assign({}, cr, { surface: surf('concrete') }), obj('bus'), 45), oc = Object.assign({}, o, { surface: surf('concrete'), ownRecoil: true });
    const src = M.throw.shake(bc, oc);
    const own = P.impulseSource(oc.surface, bc.toGround.J, Math.max(1e-9, bc.toGround.T));
    ok('5d: on concrete that push alone shakes the ground, and adds to the landing (ice and steel have no ground-wave model)', Array.isArray(src) && P.ppvAt(own, 5) > 1e-5 && P.ppvAt(src, 5) >= P.ppvAt(M.throw.landShake(bc, oc), 5) && P.ppvAt(src, 5) === Math.max(P.ppvAt(own, 5), P.ppvAt(M.throw.landShake(bc, oc), 5)), sig(P.ppvAt(own, 5) * 1000) + ' mm/s at 5 m from his push'); }
  // the All-Star baseball doesn't move Rex
  { const r = P.throwObject(ctxOf(200e18 * 907.18474 * g, { ownRecoil: true }), obj('baseball'), 0), r0 = P.throwObject(ctxOf(200e18 * 907.18474 * g), obj('baseball'), 0);
    ok('5d: the All-Star baseball doesn\'t move Rex (it shoves him back at ' + (r0.recoilV / P.K.c).toFixed(4) + ' c without)', r.recoilV === 0 && r0.recoilV > 0.99 * P.K.c); }
  // punch and pull are his own pushes; a clap's two hands cancel; a jump and a sprint start are the move itself
  { const c = ctxOf(1e6 * g), cr = Object.assign({ ownRecoil: true }, c);
    const pu = P.punch(cr), pu0 = P.punch(c), pl = P.pull(cr, obj('bus')), pl0 = P.pull(c, obj('bus'));
    ok('5d: a punch: no lurch or recoil; the arm\'s stop hands its push straight back, so no net push reaches the ground', pu.lurch === 0 && pu.recoilV === 0 && pu0.recoilV > 0 && !pu.toGround && !M.punch.shake);
    const plB = P.pull(Object.assign({}, cr, { anchor: 'bolted' }), obj('bus')), plBS = M.pull.shake(plB, { surface: c.surface, body: rex, obj: obj('bus'), ownRecoil: true, anchor: 'bolted' });
    ok('5d: a bolted pull with They take their own recoil on: the rope\'s pull goes through his bolts into the planet and shakes the ground', plB.canMove && !!plBS && P.ppvAt(plBS, 2) > 0 && plB.ropeT > 0);
    const plS = M.pull.shake(pl, { surface: c.surface, body: rex, obj: obj('bus'), ownRecoil: true, anchor: 'friction' }), plS0 = M.pull.shake(pl0, { surface: c.surface, body: rex, obj: obj('bus'), anchor: 'friction' });
    ok('5d: a pull with it on: the rope\'s pull back goes into the planet over the pull (the bus\'s momentum and the rolling resistance), and shakes the ground; off, not counted', plS && P.ppvAt(plS, 2) > 0 && near(P.ppvAt(plS, 2), P.ppvAt(P.impulseSource(c.surface, P.vToMomentum(pl.vEnd, obj('bus').m) + pl.resist * pl.t10m, pl.t10m), 2), 1e-12) && !plS0 && near(pl.ropeT, obj('bus').m * pl.accel + pl.resist, 1e-12) && pl.ropeT < pl.usable, 'rope ' + sig(pl.ropeT) + ' N of ' + sig(pl.usable) + ' N; ' + sig(P.ppvAt(plS, 2) * 1000) + ' mm/s at 2 m');
    ok('5d: a pull: the load\'s pull back goes into the planet (his whole drive pulls it); his own legs still walk on friction', pl.usable === c.F && pl0.usable === pl0.anchor.R && pl.accel <= pl.anchor.R / rex.m * (1 + 1e-12) && pl.accel > pl0.accel && pl.footLimited, 'a ' + sig(pl.accel) + ' vs ' + sig(pl0.accel) + ' m/s2, feet allow ' + sig(pl.anchor.R / rex.m));
    const cl = P.clap(cr), cl0 = P.clap(c), j = P.jump(cr), j0 = P.jump(c), sp = P.sprint(cr), sp0 = P.sprint(c);
    ok('5d: a clap, a jump and a sprint are unchanged', cl.vHand === cl0.vHand && j.v === j0.v && sp.vTop === sp0.vTop);
    const st = P.stomp(ctxOf(1e8 * g, { ownRecoil: true })), st0 = P.stomp(ctxOf(1e8 * g)), stL = P.stomp(ctxOf(1e8 * g, { ownRecoil: true, stompLaunch: true }));
    ok('5d: a stomp no longer launches him (except the Collide tab\'s stomp-launch, which is the point)', st.vBody === 0 && st0.vBody > 0 && stL.vBody === st0.vBody);
    const cOn = Object.assign(ctxOf(1e7 * g, { ownRecoil: true }), { body: ollie }), cOff = Object.assign(ctxOf(1e7 * g), { body: ollie });
    const coL = P.collide(cOn, ctxOf(1e7 * g, { ownRecoil: true }), { source: 'stomp' }), coL0 = P.collide(cOff, ctxOf(1e7 * g), { source: 'stomp' });
    ok('5d: the Collide tab\'s stomp-launch charge is the same with it on', !coL.noCharge && coL.v0 === coL0.v0 && coL.v0 > 1, sig(coL.v0) + ' m/s'); }
  // two players: his own shove and throws, yes; being pushed (the shoving match, arm wrestling, Collide), no
  { const cR = ctxOf(1e6 * g), cO = Object.assign({}, cR, { body: ollie }), cRr = Object.assign({ ownRecoil: true }, cR), cOr = Object.assign({ ownRecoil: true }, cO);
    const sh = P.shove(cRr, cOr), sh0 = P.shove(cR, cO);
    ok('5d: the shover doesn\'t recoil; the partner he shoves keeps his own footing', sh.vA === 0 && sh0.vA > 0 && sh.vB > 0);
    ok('5d: with only They take their own recoil on, the shove hands the ground his push', !!sh.toGround && sh.toGround.J > 0, sh.toGround ? sig(sh.toGround.J) + ' kg m/s' : 'none');
    // the partner toss: his push and his catch go into the ground with their powers on, none with them off
    const tp = P.tossPartner(Object.assign({}, cR, ON), ollie, 'Ollie', 'hard', 10, 'friction'), tp0 = P.tossPartner(cR, ollie, 'Ollie', 'hard', 10, 'friction');
    ok('5d: tossing Ollie up and catching him: the toss\'s push and the catch go into the ground with their powers on (not with them off)', tp.toGroundT && tp.toGroundT.J > 0 && (tp.result !== 'caught' || (tp.toGroundC && tp.toGroundC.J > 0)) && !tp0.toGroundT && !tp0.toGroundC, tp.result);
    const pm = P.pushMatch(cRr, cOr), pm0 = P.pushMatch(cR, cO), aw = P.armWrestle(cRr, cOr), aw0 = P.armWrestle(cR, cO);
    const co = P.collide(cRr, cOr, { source: 'sprint' }), co0 = P.collide(cR, cO, { source: 'sprint' });
    ok('5d: the shoving match, arm wrestling and Collide are unchanged (being pushed is what Bolted is for)', pm.outcome === pm0.outcome && pm.contact === pm0.contact && aw.outcome === aw0.outcome && aw.contact === aw0.contact && co.outcome === co0.outcome && co.Q === co0.Q);
    const L = P.catchLeg(cRr, cOr, obj('car'), 30, 'hard'), L0 = P.catchLeg(cR, cO, obj('car'), 30, 'hard');
    const k1 = P.catchIt(cOr, obj('car'), 60, 10, null), k0 = P.catchIt(cO, obj('car'), 60, 10, null);
    ok('5d: in the game of catch the thrower isn\'t shoved back; the catcher\'s footing is his own (the same catch at the same speed)', L.recoil.v === 0 && L0.recoil.v > 0 && k1.slide === k0.slide && k1.R === k0.R, 'thrower off: ' + sig(L0.recoil.v) + ' m/s');
    // the thrower's push into the ground is the Throw tab's: the object and his throwing hand's momentum, less his recoil
    const Lb = P.catchLeg(cRr, cOr, obj('baseball'), 10, 'hard'), tb = P.throwObject(cRr, obj('baseball'), Lb.aim.thetaDeg);
    ok('5d: the catch thrower\'s push into the ground matches the Throw tab\'s for the same throw (the ball\'s momentum: his arm\'s comes back in the follow-through)', near(Lb.toGroundT.J, tb.toGround.J, 1e-9) && near(Lb.toGroundT.J, P.vToMomentum(Lb.aim.vL, obj('baseball').m), 1e-6), sig(Lb.toGroundT.J) + ' kg m/s');
    // a throw that ends in a fireball: the thrower still pushed (the Throw tab's push)
    const cRf = ctxOf(1e20 * g, { airAbsorb: 0.5, ownRecoil: true }), Lf = P.catchLeg(cRf, Object.assign({}, cRf, { body: ollie }), obj('baseball'), 1000, 'hard'), tf = Lf.result === 'fireball' ? P.throwObject(cRf, obj('baseball'), Lf.thetaDeg) : null;
    ok('5d: a catch throw that becomes a fireball still pushes the ground under the thrower (the Throw tab\'s push)', Lf.result === 'fireball' && Lf.toGroundT && tf && near(Lf.toGroundT.J, tf.toGround.J, 1e-9), Lf.result); }
}

// Round 4 of the review: canon's weak-ground cap on every push, the orbit at 100%, the unbounded jump
{
  const sand = surf('sand'), qf = (sf) => P.qultFor(sf, rex.footB);
  // a throw straight up that escapes, on concrete: the ground takes its bearing beyond his weight and the car's, over the pulse
  { const c = ctxOf(1e11 * g, ON), r = P.throwObject(c, obj('car'), 90), RB = qf(c.surface) * 2 * rex.footArea, tg = r.toGround;
    ok('5c: a car thrown straight up past escape speed: the ground takes (its bearing - his weight and the car\'s) x the pulse, and their power supplies the rest', r.flight.escaped && tg && near(tg.J, (RB - (rex.m + obj('car').m) * g) * tg.T, 1e-9) && near(tg.J + tg.supplied, tg.whole, 1e-12), tg ? sig(tg.J) + ' of ' + sig(tg.whole) + ' kg m/s' : 'none'); }
  // a gentle toss on sand never hands the ground more than it bears (here none: Rex and Ollie together already weigh
  // more than loose sand bears under his feet), and never more than the all-out toss
  { const c = ctxOf(1e7 * g, Object.assign({}, ON, { surface: sand })), te = P.tossPartner(c, ollie, 'Ollie', 'easy', 1000, 'friction'), th = P.tossPartner(c, ollie, 'Ollie', 'hard', 1000, 'friction');
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
  // an angled throw on sand with their recoil taken (as if bolted): the ground can bear none of the downward part, but
  // takes the sideways part whole
  { const r = P.throwObject(ctxOf(1e6 * g, Object.assign({}, ON, { surface: sand })), obj('car'), 30), tg = r.toGround;
    ok('5c: a 30-degree throw on sand with their recoil taken: the ground takes the sideways part whole (cos 30 of the push) and none of the downward part, which their power supplies', tg && near(tg.J, tg.whole * Math.cos(Math.PI / 6), 1e-9) && near(tg.suppliedDown, tg.whole * 0.5, 1e-9) && tg.suppliedSide === 0, tg ? sig(tg.J) + ' of ' + sig(tg.whole) : 'none'); }
  // ... standing on friction (their recoil not taken): sideways at most the ground's friction on what it bears
  { const r = P.throwObject(ctxOf(1e6 * g, Object.assign({}, ON, { surface: sand, ownRecoil: false })), obj('car'), 45), tg = r.toGround, capH = sand.mu * Nmax(sand) * (tg ? tg.T : NaN);
    ok('5c: standing on friction on sand, the ground\'s sideways grip is at most mu x what it bears over the pulse; their power supplies the rest', tg && near(tg.J, capH, 1e-9) && tg.suppliedSide > 0, tg ? sig(tg.J) + ' (cap ' + sig(capH) + ') of ' + sig(tg.whole) : 'none'); }
  // Unbreakable footing alone: the throw's push is the object's momentum less his recoil
  { const c = ctxOf(1e6 * g, { unbreakable: true }), r = P.throwObject(c, obj('car'), 30);
    ok('5c: with Unbreakable footing alone the throw\'s push into the ground is the object\'s momentum less his recoil', r.toGround && r.recoilV > 0 && near(r.toGround.whole != null ? r.toGround.whole : r.toGround.J, P.vToMomentum(r.v, obj('car').m) - P.vToMomentum(r.recoilV, rex.m), 1e-6), r.toGround ? sig(r.toGround.whole != null ? r.toGround.whole : r.toGround.J) : 'none'); }
  // only They take their own recoil on: no weak-ground cap (that is Unbreakable footing's)
  { const r = P.throwObject(ctxOf(1e6 * g, { ownRecoil: true, surface: sand }), obj('car'), 30);
    ok('5c: with only They take their own recoil on there is no weak-ground cap', r.toGround && r.toGround.supplied === undefined && r.toGround.J > 0, r.toGround ? sig(r.toGround.J) : 'none'); }
  // a gentle toss and a catch on concrete where the cap binds: (bearing - Rex and Ollie's weight) x the pulse
  { const c = ctxOf(1e7 * g, Object.assign({}, ON, { surface: conc })), t = P.tossPartner(c, ollie, 'Ollie', 'easy', 1000, 'friction'), bear = Nmax(conc) - (rex.m + ollie.m) * g;
    ok('5c: a gentle toss and its catch on concrete where the cap binds: each hands the ground (bearing - both weights) x its pulse', t.toGroundT && t.toGroundT.supplied > 0 && near(t.toGroundT.J, bear * t.toGroundT.T, 1e-9) && t.toGroundC && t.toGroundC.supplied > 0 && near(t.toGroundC.J, bear * t.toGroundC.T, 1e-9), t.toGroundT ? sig(t.toGroundT.J) + ' over ' + sig(t.toGroundT.T) + ' s; catch ' + sig(t.toGroundC && t.toGroundC.J) : t.result); }
  // a catch in the game of catch where the cap binds (a car lobbed 1 km to a bolted Ollie on concrete): the ground under
  // him takes the sideways part whole (bolted) and its bearing beyond his weight and the car's of the downward part
  { const c = ctxOf(1e7 * g, Object.assign({}, ON, { surface: conc })), L = P.catchLeg(c, Object.assign({}, c, { body: ollie, anchor: 'bolted' }), obj('car'), 1000, 'easy'), tg = L.toGroundC;
    const th = L.angleDeg * Math.PI / 180, capD = (Nmax(conc, ollie) - (ollie.m + obj('car').m) * g) * (tg ? tg.T : NaN);
    ok('5c: a catch on concrete where the cap binds: the ground takes the sideways part whole (bolted) and its bearing beyond his weight and the car\'s of the downward part', L.result === 'caught' && tg && tg.supplied > 0 && near(tg.J, Math.hypot(tg.whole * Math.cos(th), capD), 1e-9), tg ? sig(tg.J) + ' of ' + sig(tg.whole) : L.result); }
  // the jump's landing on concrete where the cap binds: the body's stop at most landBear x its time
  { const on = Object.assign({}, ON, { surface: conc }), r = P.jump(ctxOf(1e6 * g, on)), L = r.landing;
    const l1 = M.jump.shake(r, Object.assign({ surface: conc, body: rex, m: rex.m }, on)), want = P.impulseSource(conc, Math.min(P.vToMomentum(L.v, rex.m), r.landBear * L.t), L.t);
    ok('5c: a jump landing on concrete the ground can\'t bear: its stop hands the ground at most (bearing - weight) x the stop time', L.landed && r.landRatioReal > 1 && near(P.ppvAt(l1[0], 5), P.ppvAt(want, 5), 1e-9) && P.vToMomentum(L.v, rex.m) > r.landBear * L.t, sig(P.ppvAt(l1[0], 5) * 1000) + ' mm/s'); }
  // unbounded pushes with a push time are capped too: a throw and a toss straight up at unlimited strength, a stomp
  // whose foot speed rounds to c
  { const c = ctxOf(Infinity, ON), r = P.throwObject(c, obj('car'), 90), t = P.tossPartner(c, ollie, 'Ollie', 'hard', 10, 'friction');
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
  // an angled unbounded push, bolted: the sideways part goes in whole, the downward part is capped; no NaN anywhere
  { const r = P.throwObject(ctxOf(Infinity, ON), obj('car'), 45), tg = r.toGround, t = P.throwPartner(ctxOf(Infinity, ON), Object.assign(ctxOf(Infinity, ON), { body: ollie }), 45);
    const noNaN = (x) => x && Object.values(x).every((v) => typeof v !== 'number' || !Number.isNaN(v));
    ok('5c: an angled unbounded throw with their recoil taken: the ground takes the sideways part whole, their power supplies the downward part beyond its bearing; no NaN', tg && tg.J === Infinity && tg.supplied === Infinity && tg.suppliedDown === Infinity && tg.suppliedSide === 0 && noNaN(tg) && noNaN(t.r.toGround), JSON.stringify(tg)); }
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

console.log('\n' + (n - fails) + '/' + n + ' passed');
process.exit(fails ? 1 : 0);
