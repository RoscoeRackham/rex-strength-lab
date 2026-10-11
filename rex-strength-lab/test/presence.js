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
