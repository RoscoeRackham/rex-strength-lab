// Checks for restraint, presence, the comic switches and growth (BRIEF-presence.md, "Tests"). Run: node test/presence.js
global.window = {};
const P = require('../src/engine.js');
require('../src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
let fails = 0, n = 0;
const ok = (name, cond, detail) => { n++; if (!cond) fails++; console.log((cond ? 'ok   ' : 'FAIL ') + name + (detail != null ? ': ' + detail : '')); };
const near = (a, b, rel) => Math.abs(a - b) <= rel * Math.abs(b);
const surf = (id) => D.surfaces.find((s) => s.id === id);
const obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const ctxOf = (F, extra) => Object.assign({ F, mode: 'comic', body: rex, surface: surf('concrete'), groundHolds: false, anchor: 'friction' }, extra || {});

// 1. All-out effort reproduces the engine as it was before effort existed (fixture from main's engine).
{
  const { cases, summarize } = require('./baseline-cases.js');
  const base = require('./fixtures/allout-baseline.json');
  let diff = 0, first = null;
  for (const c of cases(D)) for (const use of [undefined, Infinity]) {
    const now = JSON.stringify(summarize(P, D, c, { use }));
    if (now !== JSON.stringify(base[c.key])) { diff++; if (!first) first = c.key + ' use=' + use + '\n   now  ' + now + '\n   base ' + JSON.stringify(base[c.key]); }
  }
  ok('all-out effort reproduces the pre-effort engine (' + Object.keys(base).length + ' setting combinations x 2)', diff === 0, diff ? diff + ' differ; first: ' + first : null);
}

// 2. Least-disruptive effort reaches each move's goal and, where the courtesy ceiling allows it, stays under every hazard.
{
  const moves = [['throw', { obj: obj('car'), angle: 45, target: 30 }], ['jump', { target: 3 }], ['stomp', {}], ['punch', { target: 10.4 }], ['clap', { target: 6 }], ['sprint', { target: 12.42 }], ['pull', { obj: obj('bus'), target: 10 }]];
  for (const F of [90718 * g, 1e7 * g, Infinity]) for (const sid of ['concrete', 'sand']) for (const [mv, o] of moves) {
    const c = ctxOf(F, { surface: surf(sid) });
    const p = P.RESTRAINT.planNow(mv, c, o);
    const gl = p.goal(), ce = p.ceiling();
    const M = P.RESTRAINT.MOVES[mv];
    if (!gl.reached) {
      // unreachable means all-out misses it too (or only unlimited strength reaches it)
      ok(mv + ' goal reported unreachable really is (F ' + (F / g).toPrecision(3) + ' kg, ' + sid + ')', gl.onlyUnlimited ? M.goal(p.run(Infinity), p.opt) && !M.goal(p.run(p.hi), p.opt) : !M.goal(p.run(undefined), p.opt));
      continue;
    }
    const r = p.run(gl.use);
    ok(mv + ' least-disruptive reaches its goal (F ' + (F / g).toPrecision(3) + ' kg, ' + sid + ')', M.goal(r, p.opt));
    // and it is restrained: well under all-out, and a push a fifth gentler misses the goal (unless it is the least he can try)
    ok(mv + ' least-disruptive is gentler than all-out and the gentlest that works (' + sid + ')', gl.use < (isFinite(F) ? F : Infinity) && (gl.atLowest || !M.goal(p.run(gl.use * 0.8), p.opt)), (gl.use / g).toPrecision(3) + ' kg');
    // under every hazard whenever the goal is below the ceiling
    if (gl.use <= ce.below) {
      const bad = P.RESTRAINT.HAZARDS.filter((h) => h.test(P.RESTRAINT.MOVES[mv], r, p.opt));
      ok(mv + ' least-disruptive stays under every hazard (' + sid + ')', bad.length === 0, bad.map((h) => h.id).join(','));
    }
    // the ceiling is harmless and the first hazard really starts just above it
    if (ce.by && ce.below > 0) {
      const M = P.RESTRAINT.MOVES[mv], oo = p.opt;
      const under = P.RESTRAINT.HAZARDS.filter((h) => h.test(M, p.run(ce.below), oo));
      ok(mv + ' courtesy ceiling is harmless and ' + ce.by + ' starts just above it (' + sid + ')', under.length === 0 && P.RESTRAINT.HAZARDS.find((h) => h.id === ce.by).test(M, p.run(ce.use), oo), under.map((h) => h.id).join(','));
    }
  }
}

// 3. Presence: more effort, a faster pace or less distance never gives less shaking.
{
  for (const b of [rex, ollie]) for (const sid of ['sand', 'softclay', 'concrete', 'granite']) {
    const byPace = ['stroll', 'walk', 'brisk', 'fast'].map((pace) => P.presence(b, surf(sid), { effort: 0.5, pace }).ppv(5));
    ok('PPV rises with pace, stroll to fastest walk (' + b.build + ', ' + sid + ')', byPace.every((v, i) => i === 0 || v >= byPace[i - 1] * (1 - 1e-12)), byPace.map((v) => (v * 1000).toPrecision(2)).join(' < '));
    let prev = 0, mono = true;
    for (let e = 0; e <= 1.0001; e += 0.05) { const v = P.presence(b, surf(sid), { effort: e }).ppv(5); if (v < prev * (1 - 1e-12)) mono = false; prev = v; }
    ok('PPV rises with step effort (' + b.build + ', ' + sid + ')', mono);
    let prevD = Infinity, monoD = true;
    for (let d = 0.5; d < 2000; d *= 1.3) { const v = P.presence(b, surf(sid), { effort: 0.5 }).ppv(d); if (v > prevD * (1 + 1e-12)) monoD = false; prevD = v; }
    ok('PPV falls with distance (' + b.build + ', ' + sid + ')', monoD);
  }
}

// 3b. The ground-shaking model reproduces its sourced anchors and each threshold's worked conversion.
{
  // Pisa drop test (Colombero et al. 2015): 130 kg dropped about 3 m; field readings from their Fig. 6 (verifier) 8.7 / 4.7 /
  // 1.8 / 0.77 / 0.4 / 0.19 mm/s at 2.5 / 5 / 10 / 20 / 35 / 60 m; the model with the site's ground (c_s 150 m/s,
  // 1,850 kg/m3, damping 0.03) and a 30 ms pulse carrying the momentum: within about 2x (the contact time was fitted).
  const pisa = { kind: 'hann', F: 2 * 997.4 / 0.03, T: 0.03, ground: { rho: 1850, cs: 150, xi: 0.03 } };
  const meas = [[2.5, 8.7e-3], [5, 4.7e-3], [10, 1.8e-3], [20, 0.77e-3], [35, 0.4e-3], [60, 0.19e-3]];
  for (const [d, m] of meas) { const v = P.ppvAt(pisa, d); ok('Pisa drop test at ' + d + ' m within 2.2x of measured', v / m < 2.2 && m / v < 2.2, (v * 1000).toPrecision(2) + ' mm/s vs ' + m * 1000); }
  // past 60 m it falls no faster than r^-1.3 (measured impact trends), never as steeply as the damped pulse alone
  ok('past 60 m the fall-off is no steeper than r^-1.3', P.ppvAt(pisa, 200) >= P.ppvAt(pisa, 60) * Math.pow(60 / 200, 1.3) * (1 - 1e-9));
  // the near field: PPV x r tends to 0.375 F / (rho cs^2 T) close in
  const nf = 0.375 * pisa.F / (1850 * 150 * 150 * 0.03);
  // at 1 m the near-field term dominates for this pulse; the damping there is D(z) with z = xi r / (0.919 cs T)
  const z1 = 0.03 * 1 / (0.919 * 150 * 0.03), D1 = Math.pow(1 + Math.pow(z1 / 0.224, 1.4), -2.5 / 1.4);
  ok('near-field limit 0.375 F / (rho cs^2 T r) x damping', near(P.ppvAt(pisa, 1), nf * D1, 0.005), (P.ppvAt(pisa, 1)).toPrecision(4) + ' vs ' + (nf * D1).toPrecision(4));
  const ff = 0.620 * pisa.F / (1850 * Math.pow(150, 2.5) * Math.pow(0.03, 1.5) * Math.sqrt(40)), z40 = 0.03 * 40 / (0.919 * 150 * 0.03), D40 = Math.pow(1 + Math.pow(z40 / 0.224, 1.4), -2.5 / 1.4);
  ok('far-field 0.620 F / (rho cs^2.5 T^1.5 sqrt r) x damping at 40 m', near(P.ppvAt(pisa, 40), Math.max(ff, nf / 40) * D40, 0.005), (P.ppvAt(pisa, 40) * 1000).toPrecision(3) + ' mm/s');
  // an elephant-like soft footfall (a 10 kN load rising over 0.05-0.1 s on firm ground, c_s 280 m/s) lands inside the
  // measured elephant band at 20 m (0.0007-0.04 mm/s: Steinmann et al. 2025, read from their figure, 0.15x to 8x)
  for (const tau of [0.05, 0.1]) { const v = P.ppvAt({ kind: 'ramp', F: 10e3, tau, ground: { rho: 1800, cs: 280, xi: 0.03 } }, 20); ok('elephant-like footfall (ramp ' + tau + ' s) inside the measured band at 20 m', v >= 0.7e-6 && v <= 40e-6, (v * 1e6).toPrecision(2) + ' um/s'); }
  ok('elephant anchor: 0.005 mm/s at 20 m, about 1/D', near(P.elephantPPV(20), 5e-6, 1e-9) && near(P.elephantPPV(10), 10e-6, 1e-9));
  ok('threshold: 0.5 in/s = 12.7 mm/s (US Bureau of Mines plaster)', near(P.VIB.TH.plaster, 0.5 * 0.0254, 1e-9));
  ok('threshold: 0.3 in/s = 7.6 mm/s (Caltrans, repeated steps)', near(P.VIB.TH.plasterWalk, 0.3 * 0.0254, 0.003));
  // the Walk tab's footing threshold for an ordinary step is the 1 g cap at its pulse frequency, below the 300 mm/s earthquake value
  const st = P.walkStep(rex, surf('concrete'), { effort: 0.5 });
  const thw = P.walkThresholds(st);
  ok('footing threshold capped at 1 g for a footstep (g T / 2 pi)', thw.footing < P.VIB.TH.footing && near(thw.footing, g * st.Tpulse / (2 * Math.PI), 1e-12), (thw.footing * 1000).toPrecision(2) + ' mm/s');
  ok('the other walking thresholds are the sourced ones', thw.feel === P.VIB.TH.feel && thw.plasterWalk === P.VIB.TH.plasterWalk && thw.shimmer === P.VIB.TH.shimmer);
  // the glass's shimmer answers to side-to-side shaking: a third of the up-and-down close in, 0.68 far out
  const slow = Object.assign({}, pisa, { T: 0.3 });   // a long pulse, so the near field dominates at 1 m
  const hv1 = P.ppvAt(slow, 1, true) / P.ppvAt(slow, 1), hv200 = P.ppvAt(pisa, 200, true) / P.ppvAt(pisa, 200);
  ok('side-to-side shaking is 1/3 of up-and-down near the foot and 0.68 far out', near(hv1, 1 / 3, 0.01) && near(hv200, 0.68, 0.01), hv1.toFixed(3) + ', ' + hv200.toFixed(3));
  ok('the water glass is judged on side-to-side shaking', P.presence(rex, surf('concrete'), { effort: 0.5 }).reach.shimmer === P.ppvReach(st.src, P.VIB.TH.shimmer, true));
  // a heel strike scaled by dynamic similarity is the same share of body weight at any size (about 0.43)
  const small = P.walkStep(P.makeBody({}), surf('concrete'), { effort: 0.5 });
  ok('heel-strike pulse is about 0.43 x body weight at any size', near(st.Fpulse / st.W, 0.43, 0.03) && near(small.Fpulse / small.W, 0.43, 0.03), (st.Fpulse / st.W).toFixed(3));
  ok('no ground shaking modelled on lake ice or a steel deck', P.presence(rex, surf('ice'), {}).ppv(5) === 0 && !P.walkStep(rex, surf('steel'), {}).modelled);
}

// 4. Gentle hold changes only grip and launch-crush results, never ground, recoil, air or impact results.
{
  for (const F of [90718 * g, 1e8 * g]) for (const id of ['car', 'piano', 'bus']) {
    const c = ctxOf(F), cg = ctxOf(F, { gentleHold: true });
    const a = P.throwObject(c, obj(id), 30), b = P.throwObject(cg, obj(id), 30);
    const same = ['v', 'recoilV', 'sinkRatio', 'Eimpact', 'crater', 'quake'].every((k) => a[k] === b[k]) && (a.flight && b.flight ? a.flight.range === b.flight.range && a.flight.maxStagT === b.flight.maxStagT : true);
    ok('gentle hold leaves the throw unchanged except grip (' + id + ', ' + (F / g).toPrecision(2) + ' kg)', same && b.gripRatio === 0 && a.gripRatioRaw === b.gripRatioRaw);
    const la = P.lift(c, obj(id)), lb = P.lift(cg, obj(id));
    ok('gentle hold leaves the lift unchanged except grip (' + id + ')', la.groundRatio === lb.groundRatio && la.canLift === lb.canLift && lb.gripRatio === 0);
  }
}

// 5. Absorbed switches remove only their own hazard and keep the momentum.
{
  for (const F of [1e6 * g, 1e9 * g]) {
    const c = ctxOf(F), cs = ctxOf(F, { silentStrike: true });
    const a = P.punch(c), b = P.punch(cs);
    ok('silent strike keeps the punch and its recoil (F ' + (F / g).toPrecision(2) + ' kg)', a.vFist === b.vFist && a.recoilV === b.recoilV && a.E === b.E);
    const pa = P.RESTRAINT.reach('punch', a, {}), pb = P.RESTRAINT.reach('punch', b, { silentStrike: true });
    ok('silent strike removes the blast and the boom', pb.air === 0 && pb.windows === 0 && !pb.boom && (pa.air > 0 || F < 1e7 * g));
    const ja = P.jump(c), jb = P.jump(ctxOf(F, { softLanding: true }));
    ok('soft landing keeps the jump and absorbs the landing energy', ja.v === jb.v && jb.landing.soft && jb.landing.absorbed === ja.landing.E && jb.landing.ratio === 0);
    const jo = { surface: c.surface, body: rex, m: rex.m, near: 5 };
    ok('soft landing removes the landing’s ground shaking and impact, not its momentum', P.RESTRAINT.MOVES.jump.shake(ja, jo) != null && P.RESTRAINT.MOVES.jump.shake(jb, jo) == null && jb.landing.Eimpact === 0 && jb.landing.Eground === 0 && jb.landing.v === ja.landing.v);
    // the hazards behind the courtesy ceiling (not only the page's reach) respect silent strike
    const boom = P.RESTRAINT.HAZARDS.find((h) => h.id === 'boom'), air = P.RESTRAINT.HAZARDS.find((h) => h.id === 'air');
    if (a.vFist >= P.K.a0) ok('silent strike turns off the boom and air-blast hazards for a supersonic punch (F ' + (F / g).toPrecision(2) + ' kg)', boom.test(P.RESTRAINT.MOVES.punch, a, { near: 5 }) && !boom.test(P.RESTRAINT.MOVES.punch, b, { near: 5, silentStrike: true }) && !air.test(P.RESTRAINT.MOVES.punch, b, { near: 5, silentStrike: true }));
  }
  // gentle hold and cool flight in the game of catch: no crushed launch, no burn-up; the flight is unchanged
  const cc = (F, x) => ctxOf(F, x), oc = (F, x) => ctxOf(F, Object.assign({ body: ollie }, x));
  const L0 = P.catchLeg(cc(1e9 * g), oc(1e9 * g), obj('car'), Math.pow(10, 1.5), 'hard'), L1 = P.catchLeg(cc(1e9 * g, { gentleHold: true }), oc(1e9 * g, { gentleHold: true }), obj('car'), Math.pow(10, 1.5), 'hard');
  ok('gentle hold in catch: no crushed launch, same throw', L0.result === 'crushed-launch' && L1.result !== 'crushed-launch' && L1.result !== 'wreckage' && L0.aim.vL === L1.aim.vL, L0.result + ' -> ' + L1.result);
  const B0 = P.catchLeg(cc(1e12 * g), oc(1e12 * g), obj('baseball'), Math.pow(10, 1.5), 'hard'), B1 = P.catchLeg(cc(1e12 * g, { coolFlight: true }), oc(1e12 * g, { coolFlight: true }), obj('baseball'), Math.pow(10, 1.5), 'hard');
  ok('cool flight in catch: no burn-up, same flight', B0.result === 'burns-up' && B1.result !== 'burns-up' && B0.vArrive === B1.vArrive && B0.aim.vL === B1.aim.vL, B0.result + ' -> ' + B1.result);
  // a thrown person: past the ride limits all-out at the default strength, and Safe passenger takes that hazard away
  const person = obj('person'), pc = ctxOf(90718 * g), tp = P.throwObject(pc, person, 45);
  const pz = P.RESTRAINT.HAZARDS.find((h) => h.id === 'passenger');
  ok('throwing a person all-out is past the ride limits; Safe passenger removes that hazard only', pz.test(P.RESTRAINT.MOVES.throw, tp, { obj: person, angle: 45 }) && !pz.test(P.RESTRAINT.MOVES.throw, tp, { obj: person, angle: 45, safePassenger: true }));
  ok('ride limit follows ASTM F2291: 2 g at 0.2 s, 1.75 g at 0.35 s, 1.5 g from 0.5 s', P.PASSENGER.noHarm(0.1) === 2 && near(P.PASSENGER.noHarm(0.35), 1.75, 1e-9) && P.PASSENGER.noHarm(0.8) === 1.5);
  // presets: each fires, and the bigger version of the same harm needs more (a punch, 10^12 kg dial): rattling before
  // broken windows or flattened houses next door, and those before houses flattened a block away
  const pp = P.RESTRAINT.planNow('punch', ctxOf(1e12 * g), { near: 5, target: 10 }), pr = (id) => pp.result('preset:' + id).use;
  const ord = [['rattle', 'windows'], ['rattle', 'houses'], ['windows', 'block'], ['houses', 'block']];
  ok('punch presets each fire, rattle first and a block last', ['rattle', 'windows', 'houses', 'block'].every((id) => isFinite(pr(id))) && ord.every(([a, b]) => pr(a) <= pr(b)), ['rattle', 'windows', 'houses', 'block'].map((id) => id + ' ' + (pr(id) / g).toPrecision(2)).join(', '));
  // effort really drives each move: half the goal effort gives less speed for sprint, punch and throw
  for (const mv of ['sprint', 'punch', 'throw']) {
    const pl = P.RESTRAINT.planNow(mv, ctxOf(90718 * g), { near: 5, target: { sprint: 12.42, punch: 10.4, throw: 30 }[mv], obj: obj('car'), angle: 45 }), gu = pl.goal().use;
    ok(mv + ': less effort, less speed', P.RESTRAINT.MOVES[mv].speed(pl.run(gu / 2)) < P.RESTRAINT.MOVES[mv].speed(pl.run(gu)));
  }
}

// 6. Growth: the growth forms reproduce the brief's worked examples. (The endless ocean is the page's default mode: it
// adds nothing, and the engine has nothing to compute for it.)
{
  const ex = [
    ['Krakatoa', 8.4e17, { dm: 9 }],
    ['Chicxulub', 4.2e23, { ratio: 1560, mixH: 10, mixRho: 42000, sizeH: 35, densRho: 1.65e6 }],   // the brief's 1.7e6 is a rounding slip (growth_brief_number_check)
    ['the Sun for 1 s', 3.828e26, { ratio: 1.4e6, mixH: 32, mixRho: 1.3e6, sizeH: 340, densRho: 1.5e9 }],
  ];
  for (const [nm, E, w] of ex) {
    const mix = P.grownBody(rex, E, 'mix'), size = P.grownBody(rex, E, 'size'), dens = P.grownBody(rex, E, 'density');
    if (w.dm) ok(nm + ': adds about ' + w.dm + ' kg', near(mix.dm, w.dm, 0.05), mix.dm.toFixed(2));
    if (w.ratio) ok(nm + ': mass ratio about ' + w.ratio, near(mix.ratio, w.ratio, 0.03), mix.ratio.toPrecision(4));
    if (w.mixH) ok(nm + ': mix about ' + w.mixH + ' m and ' + w.mixRho + ' kg/m3', near(mix.H, w.mixH, 0.05) && near(mix.rho, w.mixRho, 0.05), mix.H.toFixed(1) + ' m, ' + mix.rho.toPrecision(3));
    if (w.sizeH) ok(nm + ': pure size about ' + w.sizeH + ' m', near(size.H, w.sizeH, 0.03), size.H.toFixed(1));
    if (w.densRho) ok(nm + ': pure density about ' + w.densRho + ' kg/m3', near(dens.rho, w.densRho, 0.02) && dens.H === rex.H, dens.rho.toPrecision(3));
  }
  const rw = P.runawayGrowth(rex, 4.2e23, 'mix');
  ok('runaway loop ratio reported and far below 1 for Chicxulub', rw.k > 0 && rw.k < 1e-6, rw.k.toExponential(2));
  ok('self-gravity share stays under 1 at the event horizon (all forms)', ['size', 'mix', 'density'].every((f) => P.runawayGrowth(rex, 1, f).kGravAtHorizon < 1));
}

// 7. A quick sweep of the new paths: no NaN or negative numbers (test/sweep.js covers the moves themselves, all-out).
{
  const bad = [];
  const scan = (label, v, path) => {
    if (typeof v === 'number') { if (Number.isNaN(v) || v < 0 && /\b(F|E|v|ppv|depth|ratio|pressure|T|t|m|H|rho)\b/i.test(path.split('.').pop())) bad.push(label + ' ' + path + ' = ' + v); return; }
    if (v && typeof v === 'object' && !Array.isArray(v)) for (const k of Object.keys(v)) if (typeof v[k] !== 'function') scan(label, v[k], path + '.' + k);
  };
  for (const F of [1e3 * g, 90718 * g, 1e15 * g, Infinity]) for (const use of [1e-3, 1e2 * g, 1e6 * g, 1e20 * g, Infinity]) {
    const c = ctxOf(F, { use });
    for (const [mv, run] of [['jump', () => P.jump(c)], ['stomp', () => P.stomp(c)], ['punch', () => P.punch(c)], ['clap', () => P.clap(c)], ['sprint', () => P.sprint(c)]]) scan(mv + ' F' + F + ' use' + use, run(), '');
  }
  for (const b of [rex, ollie, P.makeBody({}), P.makeBody({ build: 'rex', H: 50, m: 3007 * Math.pow(50 / 3.048, 3) })]) for (const sf of D.surfaces) for (const pace of ['stroll', 'walk', 'brisk', 'fast']) for (const effort of [0, 0.25, 0.5, 0.75, 1]) {
    const pr = P.presence(b, sf, { pace, effort });
    scan('walk ' + sf.id + ' ' + pace + ' ' + effort, pr.step, 'step');
    for (const d of [0.5, 3, 60, 1000]) { const v = pr.ppv(d), h = pr.ppvH(d); if (!(v >= 0) || !(h >= 0) || h > v) bad.push('walk ppv ' + sf.id + ' ' + d + ' ' + v + ' ' + h); }
  }
  for (const E of [0, 1, 1e10, 1e20, 4.2e23, 1e30, 1e40, 1e60]) for (const f of [0, 0.5, 1]) {
    scan('grown ' + E + ' ' + f, P.grownBody(rex, E, f), ''); scan('gradual ' + E + ' ' + f, P.gradualGrowth(rex, E, f), ''); scan('instant ' + E + ' ' + f, P.instantGrowth(rex, E, f), ''); scan('runaway ' + E + ' ' + f, P.runawayGrowth(rex, E, f), '');
  }
  ok('new paths: no NaN or negative values (moves at any effort, walking on every surface, growth over 60 decades)', bad.length === 0, bad.slice(0, 5).join('; '));
}

console.log(n + ' checks, ' + (fails ? fails + ' FAILED' : 'all checks passed'));
process.exit(fails ? 1 : 0);
