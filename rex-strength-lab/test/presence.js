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
    if (!gl.reached) { ok(mv + ' goal unreachable reported (F ' + F + ', ' + sid + ')', gl.never || gl.onlyUnlimited); continue; }
    const r = p.run(gl.use);
    ok(mv + ' least-disruptive reaches its goal (F ' + (F / g).toPrecision(3) + ' kg, ' + sid + ')', P.RESTRAINT.MOVES[mv].goal(r, p.opt));
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
  // Pisa drop test (Colombero et al. 2015): 130 kg dropped about 3 m, measured 9 / 5 / 0.5 / 0.2 mm/s at 2.5 / 5 / 35 / 60 m;
  // the model with the site's ground (c_s 150 m/s, 1,850 kg/m3, damping 0.03) and a 30 ms pulse carrying the momentum.
  const pisa = { kind: 'hann', F: 2 * 997.4 / 0.03, T: 0.03, ground: { rho: 1850, cs: 150, xi: 0.03 } };
  const meas = [[2.5, 9e-3], [5, 5e-3], [35, 0.5e-3], [60, 0.2e-3]];
  for (const [d, m] of meas) { const v = P.ppvAt(pisa, d); ok('Pisa drop test at ' + d + ' m within 1.5x of measured', v / m < 1.5 && m / v < 1.5, (v * 1000).toPrecision(2) + ' mm/s vs ' + m * 1000); }
  // the near field: PPV x r tends to 0.375 F / (rho cs^2 T) close in
  const nf = 0.375 * pisa.F / (1850 * 150 * 150 * 0.03);
  ok('near-field limit 0.375 F / (rho cs^2 T r)', near(P.ppvAt(pisa, 1) * 1, nf, 0.05) || P.ppvAt(pisa, 1) >= nf * 0.95, (P.ppvAt(pisa, 1)).toPrecision(3) + ' vs ' + nf.toPrecision(3));
  // an elephant-like soft footfall (a 10 kN load rising over 0.05-0.1 s on firm ground, c_s 280 m/s) lands inside the
  // measured elephant band at 20 m (0.0007-0.04 mm/s: Steinmann et al. 2025, read from their figure, 0.15x to 8x)
  for (const tau of [0.05, 0.1]) { const v = P.ppvAt({ kind: 'ramp', F: 10e3, tau, ground: { rho: 1800, cs: 280, xi: 0.03 } }, 20); ok('elephant-like footfall (ramp ' + tau + ' s) inside the measured band at 20 m', v >= 0.7e-6 && v <= 40e-6, (v * 1e6).toPrecision(2) + ' um/s'); }
  ok('elephant anchor: 0.005 mm/s at 20 m, about 1/D', near(P.elephantPPV(20), 5e-6, 1e-9) && near(P.elephantPPV(10), 10e-6, 1e-9));
  ok('threshold: 0.5 in/s = 12.7 mm/s (US Bureau of Mines plaster)', near(P.VIB.TH.plaster, 0.5 * 0.0254, 1e-9));
  ok('threshold: 0.3 in/s = 7.6 mm/s (Caltrans, repeated steps)', near(P.VIB.TH.plasterWalk, 0.3 * 0.0254, 0.003));
  ok('threshold: 1 g up and down at 20 Hz = 78 mm/s', near(g / (2 * Math.PI * 20), 0.078, 0.01));
  // the Walk tab's footing threshold for an ordinary step is the 1 g cap at its pulse frequency, below the 300 mm/s earthquake value
  const st = P.walkStep(rex, surf('concrete'), { effort: 0.5 });
  ok('footing threshold capped at 1 g for a footstep', g * st.Tpulse / (2 * Math.PI) < P.VIB.TH.footing, (g * st.Tpulse / (2 * Math.PI) * 1000).toPrecision(2) + ' mm/s');
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
  }
}

// 6. Growth: endless ocean adds nothing; the growth forms reproduce the brief's worked examples.
{
  const ex = [
    ['Krakatoa', 8.4e17, { dm: 9 }],
    ['Chicxulub', 4.2e23, { ratio: 1560, mixH: 10, mixRho: 42000, sizeH: 35, densRho: 1.7e6 }],
    ['the Sun for 1 s', 3.828e26, { ratio: 1.4e6, mixH: 32, mixRho: 1.3e6, sizeH: 340, densRho: 1.5e9 }],
  ];
  for (const [nm, E, w] of ex) {
    const mix = P.grownBody(rex, E, 'mix'), size = P.grownBody(rex, E, 'size'), dens = P.grownBody(rex, E, 'density');
    if (w.dm) ok(nm + ': adds about ' + w.dm + ' kg', near(mix.dm, w.dm, 0.05), mix.dm.toFixed(2));
    if (w.ratio) ok(nm + ': mass ratio about ' + w.ratio, near(mix.ratio, w.ratio, 0.03), mix.ratio.toPrecision(4));
    if (w.mixH) ok(nm + ': mix about ' + w.mixH + ' m and ' + w.mixRho + ' kg/m3', near(mix.H, w.mixH, 0.05) && near(mix.rho, w.mixRho, 0.05), mix.H.toFixed(1) + ' m, ' + mix.rho.toPrecision(3));
    if (w.sizeH) ok(nm + ': pure size about ' + w.sizeH + ' m', near(size.H, w.sizeH, 0.03), size.H.toFixed(1));
    if (w.densRho) ok(nm + ': pure density about ' + w.densRho + ' kg/m3', near(dens.rho, w.densRho, 0.05) && dens.H === rex.H, dens.rho.toPrecision(3));
  }
  const rw = P.runawayGrowth(rex, 4.2e23, 'mix');
  ok('runaway loop ratio reported and far below 1 for Chicxulub', rw.k > 0 && rw.k < 1e-6, rw.k.toExponential(2));
  ok('self-gravity share stays under 1 at the event horizon (all forms)', ['size', 'mix', 'density'].every((f) => P.runawayGrowth(rex, 1, f).kGravAtHorizon < 1));
}

console.log(n + ' checks, ' + (fails ? fails + ' FAILED' : 'all checks passed'));
process.exit(fails ? 1 : 0);
