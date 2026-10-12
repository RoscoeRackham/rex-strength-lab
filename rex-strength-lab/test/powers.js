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
  const check = (label, extra) => {
    // a fresh copy of the engine for each pass, so no cache carries results from one pass into the other
    delete require.cache[require.resolve(ENGINE)];
    P = require(ENGINE);
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
      ok('5a: ' + oid + ' supersonic at 50%: still a sonic boom, and about half the blast of 0%', M.throw.boomSpeed(r5.r, { airAbsorb: 0.5 }) >= P.K.a0 && r5.blast / r0.blast > 0.4 && r5.blast / r0.blast < 0.6, 'ratio ' + sig(r5.blast / r0.blast));
      ok('5a: ' + oid + ' at 100%: no blast from its flight (its landing is real)', runs[4].blast === 0);
    }
  }
  // their own sprint is unchanged at any share; a person's drag scales with the share
  { const a = P.sprint(ctxOf(1e6 * g)), b = P.sprint(ctxOf(1e6 * g, { airAbsorb: 1 })); ok('5a: their own sprint is unchanged at any share', a.vTop === b.vTop && a.dragPower === b.dragPower); }
  { const r = P.throwObject(ctxOf(1e6 * g, { airAbsorb: 0.6, safePassenger: true }), obj('person'), 30), o = { obj: obj('person'), angle: 30, safePassenger: true };
    const dg = P.PASSENGER.dragG(obj('person'), r.v);
    ok('5a: a thrown person feels 40% of the real drag at 60% absorbed (the held 1.5 g limit)', M.throw.passenger(r, Object.assign({ airAbsorb: 0.6 }, o)) === (dg * 0.4 > P.PASSENGER.noHarm(1)) && M.throw.passenger(r, Object.assign({ airAbsorb: 1 }, o)) === false, 'drag ' + sig(dg) + ' g real'); }
  // past 1% of light speed: the All-Star baseball (1.8 x 10^23 kg dial, comic, level)
  {
    const allstar = 200e18 * 907.18474 * g;
    const c0 = ctxOf(allstar), c1 = ctxOf(allstar, { airAbsorb: 1, keepForm: true }), c5 = ctxOf(allstar, { airAbsorb: 0.5 });
    const r0 = P.throwObject(c0, obj('baseball'), 0), r1 = P.throwObject(c1, obj('baseball'), 0), r5 = P.throwObject(c5, obj('baseball'), 0);
    const ob = (x) => Object.assign({ obj: obj('baseball'), angle: 0, body: rex }, x || {});
    const parts1 = M.throw.blastParts(r1, ob({ airAbsorb: 1 })), hand = P.handAir(rex, obj('baseball'), r1.v, 1 + r1.Eobj / (obj('baseball').m * P.K.c * P.K.c));
    ok('5a: the All-Star baseball at 100% makes no fireball of its own and leaves the Earth in a straight line; his hand\'s own air still counts', r1.flight.relativistic && r1.line && r1.line.leaves && parts1.land === 0 && near(parts1.path, hand.E, 1e-12) && hand.E > 1e20 && r1.line.bendMax < 1e-5, 'bend under ' + sig(r1.line.bendMax) + ' rad; hand fireball up to ' + sig(hand.E) + ' J (' + sig(hand.mAir) + ' kg of air)');
    // the snowplow in the ground's frame: it meets 10,000 times its own mass of air on a level path, so even half the
    // drag hands on almost all of its energy; the brief's 'half at 50%' holds only for something that sweeps little air
    const fa0 = P.fastAir(obj('baseball'), r0.Eobj, 0, 1), fa5 = P.fastAir(obj('baseball'), r0.Eobj, 0, 0.5), b5 = M.throw.blastParts(r5, ob({ airAbsorb: 0.5 })).land, b0 = M.throw.blast(r0, ob());
    ok('5a: the All-Star fireball at 50% is nearly all of the 0% value (the air takes nearly all of its energy at either share); at 0% it is all of it, as before', b0 === r0.Eobj && near(b5 / b0, fa5.Eair / fa0.Eair, 1e-12) && b5 / b0 > 0.99 && fa0.Eair / r0.Eobj > 0.999 && fa0.x > 1e4, 'ratio ' + sig(b5 / b0) + '; air ' + sig(fa0.x) + ' times its mass');
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
    ok('5a: a catch past 1% of light speed keeps momentum: Ollie is carried off at the speed energy and momentum allow', k.carried && k.relativistic && near(P.vToMomentum(k.uAfter, Mf), pIn, 1e-6) && k.uAfter < P.K.c, 'carried off at ' + sig(k.uAfter / P.K.c) + ' c'); }
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
    if (b.result === 'fireball') firesOn++;
    if (broke.includes(b.result) || b.bursts || (b.catch && b.catch.gripRatio > 1) || b.breakAtLaunch || (b.result === 'fireball' && !b.kept)) onBroke.push(oid + ' ' + style + ' ' + (F / g).toPrecision(1) + ': ' + b.result);
  }
  ok('5b: past 1% of light speed with it on, the object comes through the fireball whole (' + firesOn + ' fireballs, all kept)', firesOn > 0 && !onBroke.some((x) => /fireball/.test(x)));
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
    if (st.crater > 0 || (!P.RESTRAINT.SOIL.has(sid) && st.holeDepth >= 0.01) || (st.realBreaks && st.holeDepth > 0)) bad.push('stomp ' + tag);
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
      const s0 = M.stomp.shake(P.stomp(c), o), s1 = M.stomp.shake(P.stomp(cu), ou);
      if (!near(P.ppvAt(s1, 5), P.ppvAt(s0, 5), 1e-12) || !near(P.plasterReach(s1) || 1e-300, P.plasterReach(s0) || 1e-300, 1e-9)) diffs.push('stomp ' + sid + ' H' + H + ' 1e' + lg + ': ' + P.ppvAt(s1, 5).toPrecision(3) + ' vs ' + P.ppvAt(s0, 5).toPrecision(3));
      const w0 = P.presence(b, c.surface, { effort: 1 }), w1 = P.presence(b, c.surface, { effort: 1, unbreakable: true });
      if (w0.ppv(5) !== w1.ppv(5) || w0.reach.plaster !== w1.reach.plaster) diffs.push('walk ' + sid);
    }
    for (const lg of [3, 4, 4.5]) { const c = ctxOf(Math.pow(10, lg) * g), j0 = P.jump(c), j1 = P.jump(Object.assign({ unbreakable: true }, c)), o = { surface: c.surface, body: rex, m: rex.m };
      if (j0.overLimit) continue;
      const a = M.jump.shake(j0, o), b2 = M.jump.shake(j1, Object.assign({ unbreakable: true }, o));
      if (P.ppvAt(a, 5) !== P.ppvAt(b2, 5) || P.plasterReach(a) !== P.plasterReach(b2)) diffs.push('jump 1e' + lg); }
    ok('5c: the ground shakes as with it off, for the same push (ppv at 5 m and the plaster reach: stomps up to a 50 m Rex on soft clay, walking, a jump the ground bears)', !diffs.length, diffs.slice(0, 4).join('; '));
  }
  // a push-off the ground couldn't bear still reaches it, and shakes it
  { const c = ctxOf(1e8 * g, { unbreakable: true }), j = P.jump(c), o = { surface: c.surface, body: rex, m: rex.m, unbreakable: true };
    ok('5c: a jump the real ground couldn\'t bear: their power holds it, and the push-off still shakes it', j.overLimitReal && j.pushOff && P.ppvAt(M.jump.shake(j, o), 5) > P.ppvAt(M.jump.shake(j, { surface: c.surface, body: rex, m: rex.m }), 5), sig(P.ppvAt(M.jump.shake(j, o), 5)) + ' m/s at 5 m'); }
  // a dent or a footprint isn't breaking the ground: the power changes nothing there (the stomp's energy goes in, its
  // blast stays, the print stays)
  { const c = ctxOf(5e2 * g, { surface: surf('granite') }), cu = Object.assign({ unbreakable: true }, c), s0 = P.stomp(c), s1 = P.stomp(cu);
    const cs = ctxOf(1e5 * g, { surface: surf('sand') }), ss0 = P.stomp(cs), ss1 = P.stomp(Object.assign({ unbreakable: true }, cs));
    ok('5c: a dent in granite or a footprint in sand: nothing is taken back, the hole and blast are as without it', !s1.realBreaks && s1.absorbed === 0 && s1.holeDepth === s0.holeDepth && s0.holeDepth > 0 && M.stomp.blast(s1, { unbreakable: true }) === M.stomp.blast(s0, {}) && ss1.absorbed === 0 && ss1.holeDepth === ss0.holeDepth && ss0.holeDepth > 0.002, 'granite ' + sig(s0.holeDepth * 1e6) + ' µm, sand ' + sig(ss0.holeDepth * 1000) + ' mm'); }
  // a stomp's energy that would have broken the ground goes to the ocean: no blast from it
  { const c = ctxOf(1e8 * g, { unbreakable: true }), st = P.stomp(c), st0 = P.stomp(ctxOf(1e8 * g));
    ok('5c: a stomp\'s cratering energy is taken back (no blast from it); the boom and the shaking stay', st.absorbed === st.E && M.stomp.blast(st, { unbreakable: true }) === 0 && M.stomp.blast(st0, {}) > 0 && st.vFoot === st0.vFoot); }
  // the break-the-ground preset turns the absorption off: it breaks at the same effort as without the power
  for (const [mv, o, sid] of [['stomp', {}, 'concrete'], ['jump', { target: 3 }, 'concrete'], ['throw', { obj: obj('car'), angle: 45, target: 30 }, 'concrete']]) {
    const c = ctxOf(1e9 * g, { surface: surf(sid) }), cu = Object.assign({ unbreakable: true }, c);
    const p0 = P.RESTRAINT.planNow(mv, c, o), p1 = P.RESTRAINT.planNow(mv, cu, o);
    const g0 = p0.result('preset:ground'), g1 = p1.result('preset:ground'), h1 = p1.result('hazard:ground');
    ok('5c: ' + mv + ' on ' + sid + ': "break the ground" turns the absorption off (same effort, and that run breaks it); nothing else does', g0.use === g1.use && h1.never && !g1.never && M[mv].ground(p1.runReal(g1.use), p1.optReal), g1.never ? 'never' : sig(g1.use / g) + ' kg');
  }
  // the Collide charge into a bolted (immovable) holder shakes the ground; a truly immovable one has no ground to shake
  { const cA = Object.assign(ctxOf(1e5 * g, { unbreakable: true }), { body: ollie }), cB = ctxOf(1e5 * g, { unbreakable: true, anchor: 'bolted' });
    const r = P.collide(cA, cB, { source: 'sprint' }), src = P.impulseSource(cB.surface, r.toGround.J, r.toGround.T);
    const ri = P.collide(cA, Object.assign({ immovable: true }, cB), { source: 'sprint' });
    ok('5c: Ollie charging a bolted Rex shakes the ground (held: the hit\'s momentum over the contact)', r.held && near(r.toGround.J, r.pA, 1e-6) && P.ppvAt(src, 5) > 1e-3 && P.plasterOver(src, 5) && !ri.toGround, sig(P.ppvAt(src, 5) * 1000) + ' mm/s at 5 m; plaster to ' + sig(P.plasterReach(src)) + ' m'); }
  // instant growth: the ground can't be driven into, so he grows up from his soles (the lift goes to the ocean)
  { const I = P.instantGrowth(rex, 4.2e23, 0.5, { surface: surf('concrete'), unbreakable: true }), I0 = P.instantGrowth(rex, 4.2e23, 0.5, { surface: surf('concrete') });
    ok('5c: instant growth on unbreakable ground drives nothing into it; the push that starts his rise still goes in (and shakes it)', !I.gives && I.Eground === 0 && I.rise > 0 && I.toGround && near(I.toGround.J, I.grown.m * I.vSole, 1e-12) && I.toGround.T === I.tau && !I0.toGround); }
  // the two-player pushes into the ground: the pin's momentum (relativistic), the shover's footing (also when he
  // takes no recoil of his own), and the catcher's stop
  { const cA = ctxOf(1e18 * g, { unbreakable: true, keepForm: true }), cB = Object.assign({}, ctxOf(1e4 * g, { unbreakable: true, keepForm: true }), { body: ollie }), aw = P.armWrestle(cA, cB);
    ok('5c: the arm-wrestling pin hands the ground the forearms\' relativistic momentum', aw.pin && aw.toGround && near(aw.toGround.J, P.vToMomentum(aw.pin.v, aw.pin.M), 1e-9) && aw.pin.v > 0.1 * P.K.c, aw.pin ? sig(aw.pin.v / P.K.c) + ' c' : aw.outcome);
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
    ok('5d: ... and its push goes into the planet: the momentum the bus gets, over the throw', b.toGround && near(b.toGround.J, b.push.pB, 1e-12) && b.toGround.J > 0);
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
    ok('5d: a punch: no lurch or recoil, and its push reaches the ground (the momentum of his fist and arm)', pu.lurch === 0 && pu.recoilV === 0 && pu0.recoilV > 0 && near(pu.toGround.J, pu.push.pB - pu.push.pA, 1e-12) && pu.toGround.J > 1);
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
    const pm = P.pushMatch(cRr, cOr), pm0 = P.pushMatch(cR, cO), aw = P.armWrestle(cRr, cOr), aw0 = P.armWrestle(cR, cO);
    const co = P.collide(cRr, cOr, { source: 'sprint' }), co0 = P.collide(cR, cO, { source: 'sprint' });
    ok('5d: the shoving match, arm wrestling and Collide are unchanged (being pushed is what Bolted is for)', pm.outcome === pm0.outcome && pm.contact === pm0.contact && aw.outcome === aw0.outcome && aw.contact === aw0.contact && co.outcome === co0.outcome && co.Q === co0.Q);
    const L = P.catchLeg(cRr, cOr, obj('car'), 30, 'hard'), L0 = P.catchLeg(cR, cO, obj('car'), 30, 'hard');
    const k1 = P.catchIt(cOr, obj('car'), 60, 10, null), k0 = P.catchIt(cO, obj('car'), 60, 10, null);
    ok('5d: in the game of catch the thrower isn\'t shoved back; the catcher\'s footing is his own (the same catch at the same speed)', L.recoil.v === 0 && L0.recoil.v > 0 && k1.slide === k0.slide && k1.R === k0.R, 'thrower off: ' + sig(L0.recoil.v) + ' m/s');
    // the thrower's push into the ground is the Throw tab's: the object and his throwing hand's momentum, less his recoil
    const Lb = P.catchLeg(cRr, cOr, obj('baseball'), 10, 'hard'), tb = P.throwObject(cRr, obj('baseball'), Lb.aim.thetaDeg);
    ok('5d: the catch thrower\'s push into the ground matches the Throw tab\'s for the same throw (hand included)', near(Lb.toGroundT.J, tb.toGround.J, 1e-9) && Lb.toGroundT.J > 10 * P.vToMomentum(Lb.aim.vL, obj('baseball').m), sig(Lb.toGroundT.J) + ' kg m/s'); }
}

console.log('\n' + (n - fails) + '/' + n + ' passed');
process.exit(fails ? 1 : 0);
