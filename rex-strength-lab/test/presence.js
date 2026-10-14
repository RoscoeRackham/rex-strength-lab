// Checks for restraint, presence, the comic switches and growth (BRIEF-presence.md, "Tests"). Run: node test/presence.js
global.window = {};
const P = require('../src/engine.js');
require('../src/data.js');
const D = window.DINO_DATA;
const g = P.K.g;
let fails = 0, n = 0;
const ok = (name, cond, detail) => { n++; if (!cond) fails++; console.log((cond ? 'ok   ' : 'FAIL ') + name + (detail != null ? ': ' + detail : '')); };
const near = (a, b, rel) => Math.abs(a - b) <= rel * Math.abs(b);
const sig2 = (x) => Number(x.toPrecision(3));
const surf = (id) => D.surfaces.find((s) => s.id === id);
const obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const ctxOf = (F, extra) => Object.assign({ F, mode: 'comic', body: rex, surface: surf('concrete'), groundHolds: false, anchor: 'friction' }, extra || {});

// 1. All-out effort reproduces the engine as it was before effort existed (fixture from main's engine).
{
  const { cases, summarize } = require('./baseline-cases.js');
  const base = require('./fixtures/allout-baseline.json');
  // the fixture was written with the 3,007 kg bodies of 11 Oct 2026 (volume 0.10017 x height^3); since 13 Oct 2026
  // the canon is 3,000 kg (BRIEF-canon.md item 1), so this comparison runs on the build it was written with
  const kV0 = [P.BUILDS.rex.kV, P.BUILDS.ollie.kV];
  P.BUILDS.rex.kV = P.BUILDS.ollie.kV = 0.10017;
  let diff = 0, first = null;
  for (const c of cases(D)) for (const use of [undefined, Infinity]) {
    const now = JSON.stringify(summarize(P, D, c, { use }));
    if (now !== JSON.stringify(base[c.key])) { diff++; if (!first) first = c.key + ' use=' + use + '\n   now  ' + now + '\n   base ' + JSON.stringify(base[c.key]); }
  }
  [P.BUILDS.rex.kV, P.BUILDS.ollie.kV] = kV0;
  ok('all-out effort reproduces the pre-effort engine (' + Object.keys(base).length + ' setting combinations x 2)', diff === 0, diff ? diff + ' differ; first: ' + first : null);
}

// 2. Least-disruptive effort reaches each move's goal and, where the courtesy ceiling allows it, stays under every hazard.
{
  // the goals that need more than the courtesy ceiling allows (on sand the car's crush window and the jump's craters)
  const ABOVE = new Set(['throw 9.07e+4 sand', 'throw 1.00e+7 sand', 'jump 1.00e+7 sand', 'throw inf sand', 'jump inf sand']);
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
    // under every hazard whenever the goal is below the ceiling; the few goals above it are listed, so a regression
    // can't drop checks silently
    const above = gl.use > ce.below;
    ok(mv + ' goal ' + (above ? 'above' : 'within') + ' the courtesy ceiling as expected (F ' + (F / g).toPrecision(3) + ' kg, ' + sid + ')', above === ABOVE.has([mv, F === Infinity ? 'inf' : (F / g).toPrecision(3), sid].join(' ')));
    if (!above) {
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

// 2b. The courtesy ceiling holds everywhere below it, not just at the grid points the search tried: 120 log-spaced efforts
// from the least he can try up to the ceiling, for cases where a hazard switches on and off (the default car throw's
// crush window, where the winning muscle model changes). Known exception, left out here and listed in the README: a
// real-muscle jump at huge strength, where two pushes give the same jump to a part in 100,000 and the engine's choice
// between them (one breaks the ground) flickers with effort; changing that choice would change all-out results.
{
  const cases = [['throw', ctxOf(90718 * g), { obj: obj('car'), angle: 45, target: 30 }], ['throw', ctxOf(90718 * g), { obj: obj('desoto'), angle: 45, target: 30 }],
    ['jump', ctxOf(90718 * g, { surface: surf('concrete') }), { target: 3 }], ['stomp', ctxOf(90718 * g), {}], ['punch', ctxOf(1e9 * g), { target: 10.4 }], ['sprint', ctxOf(1e7 * g), { target: 12.42 }]];
  for (const [mv, c, o] of cases) {
    const p = P.RESTRAINT.planNow(mv, c, Object.assign({ near: 5 }, o)), ce = p.ceiling(), M = P.RESTRAINT.MOVES[mv];
    if (!ce.by || !(ce.below > 0)) continue;
    const bad = [];
    for (let k = 0; k <= 120; k++) { const u = p.lo * Math.pow(ce.below / p.lo, k / 120), r = M.run(Object.assign({}, c, { use: u }), p.opt); for (const h of P.RESTRAINT.HAZARDS) if (h.test(M, r, p.opt)) bad.push(h.id + '@' + (u / g).toPrecision(3)); }
    ok(mv + ' (' + (o.obj ? o.obj.id + ', ' : '') + c.mode + ') harmless at every effort below the courtesy ceiling', bad.length === 0, bad.length ? bad.slice(0, 4).join(', ') : 'ceiling ' + (ce.below / g).toPrecision(3) + ' kg, set by ' + ce.by);
  }
}

// 2c. A search that says 'never' really means all-out doesn't do it either: plateaus where a run is held back to the
// footing or the ground (comic mode) must not stop the search early (review round 2).
{
  const cases = [['jump', ctxOf(1e12 * g, { surface: surf('ice') }), { target: 3 }], ['jump', ctxOf(1e7 * g), { target: 3 }],
    ['throw', ctxOf(1e8 * g), { obj: obj('tank'), angle: 45, target: 30 }], ['throw', ctxOf(1e7 * g), { obj: obj('semi'), angle: 45, target: 30 }],
    ['throw', ctxOf(1e8 * g, { surface: surf('granite') }), { obj: obj('tank'), angle: 45, target: 30 }], ['throw', ctxOf(1e12 * g), { obj: obj('loco'), angle: 45, target: 30 }]];
  for (const [mv, c, o] of cases) {
    const p = P.RESTRAINT.planNow(mv, c, Object.assign({ near: 5 }, o)), M = P.RESTRAINT.MOVES[mv], all = p.run(undefined);
    const wrong = [];
    if (p.goal().never && M.goal(all, p.opt)) wrong.push('goal');
    for (const h of P.RESTRAINT.HAZARDS) if (p.result('hazard:' + h.id).never && h.test(M, all, p.opt)) wrong.push(h.id);
    ok(mv + ' (' + (o.obj ? o.obj.id + ', ' : '') + c.surface.id + ', ' + (c.F / g).toExponential(0) + ' kg): nothing reported as never happens all-out', wrong.length === 0, wrong.join(','));
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

// 3b. The ground-shaking model reproduces its sourced anchors; each threshold equals its research value.
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
  // every threshold and limit the engine uses equals the value in the research file (so a change to either is caught)
  const R = Object.fromEntries(require('../research/final-presence.json').facts.map((f) => [f.key, f]));
  const same = (name, a, key, scale) => ok(name + ' matches ' + key, near(a, R[key].value_si * (scale || 1), 0.01), a + ' vs ' + R[key].value_si);
  same('feel 0.3 mm/s', P.VIB.TH.feel, 'thr_rec_feel');
  same('one jolt 1 mm/s', P.VIB.TH.feelOnce, 'thr_caltrans2020_table20_human_transient_continuous');
  same('glass shimmer', P.VIB.TH.shimmer, 'ripple_threshold_shimmer');
  same('glass rings', P.VIB.TH.rings, 'ripple_threshold_rings');
  same('rattle', P.VIB.TH.rattle, 'thr_rec_rattle');
  same('footing', P.VIB.TH.footing, 'thr_rec_footing');
  same('air blast harmless', P.RESTRAINT.R.DP_HARM, 'comic_airblast_safe_max');
  same('air rattle', P.RESTRAINT.R.DP_RATTLE, 'airblast_rattle_onset_unfiltered');
  same('drill stamp peak', P.WALK.STAMP.kPeak, 'step_carden2015_drill_peak_force');
  // the plaster curve (RI 8507 Figure B-1): 0.50 in/s flat part and 2.0 in/s above 40 Hz
  same('plaster safe level, flat part', P.VIB.PLASTER_B1.v, 'thr_usbm_ri8507_figure_b1_curve');
  ok('plaster safe level above 40 Hz matches thr_usbm_ri8507_figure_b1_curve', near(P.VIB.PLASTER_B1.vHigh, R.thr_usbm_ri8507_figure_b1_curve.high_si, 0.01));
  ok('plaster curve displacements 0.030 in and 0.008 in (thr_usbm_ri8507_figure_b1_curve)', /0\.030 in/.test(R.thr_usbm_ri8507_figure_b1_curve.display) && /0\.008 in/.test(R.thr_usbm_ri8507_figure_b1_curve.display) && near(P.VIB.PLASTER_B1.dLow, 0.030 * 0.0254, 1e-9) && near(P.VIB.PLASTER_B1.dMid, 0.008 * 0.0254, 1e-9));
  // the firm sand of the elephant range: the ground the elephant model check used (c_s about 280 m/s, 1,800 kg/m3, damping 0.03)
  const gF = P.VIB.GROUND.firmsand, ve = R.vib_model_check_elephant.notes;
  ok('firm sand matches vib_model_check_elephant (280 m/s, 1,800 kg/m3, 0.03)', gF.cs === 280 && gF.rho === 1800 && gF.xi === 0.03 && /280 m\/s/.test(ve) && /1,800 kg/.test(ve) && /0\.03/.test(ve));
  // the elephant anchor and its band
  same('elephant anchor 0.005 mm/s at 20 m', P.VIB.ELEPHANT.v, 'elephant_anchor_ppv_vs_distance');
  ok('elephant band x0.15 to x8 matches elephant_anchor_ppv_vs_distance', JSON.parse(R.elephant_anchor_ppv_vs_distance.values_json).band === 'x' + P.VIB.ELEPHANT.lo + ' to x' + P.VIB.ELEPHANT.hi);
  // blast levels (environment research) and the growth limits
  const RE = Object.fromEntries(require('../research/final-environment.json').facts.map((f) => [f.key, f]));
  ok('windows preset at the top of blast_window_breakage (6.9 kPa)', near(P.RESTRAINT.R.DP_WINDOWS, RE.blast_window_breakage.high_si, 0.01));
  ok('growth window band matches blast_window_breakage (3.4-6.9 kPa)', near(P.GROW.DP_WIN[0], RE.blast_window_breakage.low_si, 0.02) && near(P.GROW.DP_WIN[1], RE.blast_window_breakage.high_si, 0.01));
  ok('houses collapse at blast_residential_collapse (26.8 kPa)', near(P.RESTRAINT.R.DP_HOUSES, RE.blast_residential_collapse.value_si, 0.01));
  same('tissue sound speed', P.GROW.TISSUE_C, 'growth_tissue_sound_speed');
  same('growth air pulse limit', P.GROW.SAFE_DP, 'growth_airblast_usbm_ri8485');
  same('growth surface speed limit', P.GROW.SAFE_U, 'growth_contact_speed_osha');
  same('soil crater line', P.RESTRAINT.R.CRATER_E, 'soil_crater_cutoff');
  ok('soft-footed factor is the 48.7% cut at normal speed (Yoon 2025)', near(P.WALK.SOFT, 1 - 0.487, 0.01) && /48\.7%|49%/.test(R.step_yoon2025_quiet_walking.display + R.step_yoon2025_quiet_walking.notes));
  const eib = JSON.parse(R.comic_eiband_voluntary_limits.values_json)[Object.keys(JSON.parse(R.comic_eiband_voluntary_limits.values_json)).find((k) => k.startsWith('spineward, voluntary'))];
  ok('Eiband limits match comic_eiband_voluntary_limits', P.PASSENGER.EIBAND.every(([t, gl]) => eib[String(t)] === gl), JSON.stringify(eib));
  // a person walking past the elephant's station (Steinmann et al. 2025, sandy dry ground): about 0.002 mm/s at 53 m
  const hum = JSON.parse(R.elephant_steinmann2025_other_animals.values_json).rows.find((x) => x.animal === 'human');
  // the station's ground stiffness is unknown (the elephant comparison spans firm to loose sand), so both ends
  const firm = Object.assign({}, surf('sand'), { id: 'firmsand' });
  for (const s0 of [firm, surf('sand')]) {
    const vHum = P.presence(P.makeBody({ build: 'human', H: 1.75, m: 76.7 }), s0, { effort: 0.5 }).ppv(hum.distance_m);
    ok('a person walking 53 m away on ' + (s0.id === 'sand' ? 'loose' : 'firm') + ' sand: within 3x of the recorded 0.002 mm/s', vHum / (hum.ppv_mm_s / 1000) < 3 && (hum.ppv_mm_s / 1000) / vHum < 3, (vHum * 1000).toExponential(2) + ' mm/s');
  }
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
    // soft landing takes back the landing's energy, not its force: the ground still bears the same stop
    // it takes back what the landing would put into the ground: the feet's impact (and the ground's share if it gives)
    ok('soft landing keeps the jump and absorbs what the landing would put into the ground', ja.v === jb.v && jb.landing.soft && jb.landing.absorbed === (ja.landing.ratio > 1 ? ja.landing.E : ja.landing.Eimpact) && jb.landing.absorbed > 0 && jb.landing.Eimpact === 0 && jb.landing.Eground === 0);
    ok('soft landing keeps the force on the ground (same push, bearing ratio and sinking)', jb.landing.F === ja.landing.F && jb.landing.t === ja.landing.t && jb.landing.ratio === ja.landing.ratio && jb.landing.sink === ja.landing.sink && jb.landing.v === ja.landing.v);
    const jo = { surface: c.surface, body: rex, m: rex.m, near: 5 };
    const sa = P.RESTRAINT.MOVES.jump.shake(ja, jo), sb = P.RESTRAINT.MOVES.jump.shake(jb, jo);
    ok('soft landing removes only the feet’s impact from the ground shaking; the body’s stop still shakes it', sa.length === 2 && sb.length === 1 && sb[0].F === sa[0].F && P.ppvAt(sb, 5) <= P.ppvAt(sa, 5));
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
  const person = obj('person'), pz = P.RESTRAINT.HAZARDS.find((h) => h.id === 'passenger');
  const tp = P.throwObject(ctxOf(90718 * g, { use: 4000 * g }), person, 45), tAll = P.throwObject(ctxOf(90718 * g), person, 45);
  ok('a 30 m throw of a person is past the ride limits at launch; Safe passenger removes that', pz.test(P.RESTRAINT.MOVES.throw, tp, { obj: person, angle: 45 }) && !pz.test(P.RESTRAINT.MOVES.throw, tp, { obj: person, angle: 45, safePassenger: true }), sig2(tp.v) + ' m/s');
  // (BRIEF-canon.md item 5, the ruling of 14 Oct 2026: Safe passenger covers the air's drag on them too, so it now
  // takes that away; before, this check said it couldn't)
  ok('all-out, the air drag on them is past the held limit too, and Safe passenger takes that away as well', P.PASSENGER.dragG(person, tAll.v) > 1.5 && P.RESTRAINT.MOVES.throw.passengerDrag(tAll, { obj: person, angle: 45 }) && pz.test(P.RESTRAINT.MOVES.throw, tAll, { obj: person, angle: 45 }) && !pz.test(P.RESTRAINT.MOVES.throw, tAll, { obj: person, angle: 45, safePassenger: true }), P.PASSENGER.dragG(person, tAll.v).toFixed(1) + ' g at ' + sig2(tAll.v) + ' m/s');
  ok('real muscle: the push on a thrown person peaks above its average', (() => { const r = P.throwObject(ctxOf(90718 * g, { use: 4000 * g, mode: 'real' }), person, 45); return r.launchGPeak > r.launchG; })());
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
  // (on the default body: the canon's 3,000 kg since 13 Oct 2026; the brief's figures were worked out at 3,007 kg, 0.2% off)
  const rexD = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex));
  for (const [nm, E, w] of ex) {
    const mix = P.grownBody(rexD, E, 'mix'), size = P.grownBody(rexD, E, 'size'), dens = P.grownBody(rexD, E, 'density');
    if (w.dm) ok(nm + ': adds about ' + w.dm + ' kg', near(mix.dm, w.dm, 0.05), mix.dm.toFixed(2));
    if (w.ratio) ok(nm + ': mass ratio about ' + w.ratio, near(mix.ratio, w.ratio, 0.03), mix.ratio.toPrecision(4));
    if (w.mixH) ok(nm + ': mix about ' + w.mixH + ' m and ' + w.mixRho + ' kg/m3', near(mix.H, w.mixH, 0.05) && near(mix.rho, w.mixRho, 0.05), mix.H.toFixed(1) + ' m, ' + mix.rho.toPrecision(3));
    if (w.sizeH) ok(nm + ': pure size about ' + w.sizeH + ' m', near(size.H, w.sizeH, 0.03), size.H.toFixed(1));
    if (w.densRho) ok(nm + ': pure density about ' + w.densRho + ' kg/m3', near(dens.rho, w.densRho, 0.02) && dens.H === rexD.H, dens.rho.toPrecision(3));
  }
  const rw = P.runawayGrowth(rex, 4.2e23, 'mix');
  ok('runaway loop ratio reported and far below 1 for Chicxulub', rw.k > 0 && rw.k < 1e-6, rw.k.toExponential(2));
  // the gravity share two ways: the binding-energy difference the loop uses, and the weak-field formula 0.3 (2 - s/3) r_s / R
  const small = P.runawayGrowth(rex, 1e12, 'mix');
  ok('runaway gravity share: binding-energy difference matches the weak-field formula for a small growth', near(small.kGrav, small.kGravNow, 0.02), small.kGrav.toExponential(3) + ' vs ' + small.kGravNow.toExponential(3));
}

// 7. A quick sweep of the new paths: no NaN or negative numbers (test/sweep.js covers the moves themselves, all-out).
{
  const bad = [];
  const scan = (label, v, path) => {
    // every negative number is a problem except a quake magnitude (which can be negative)
    if (typeof v === 'number') { if (Number.isNaN(v) || v < 0 && !/quake/i.test(path.split('.').pop())) bad.push(label + ' ' + path + ' = ' + v); return; }
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

// 8. Guards for the review fixes: each check fails if one line of its fix is undone (review round 2, code lens).
{
  const H = (id) => P.RESTRAINT.HAZARDS.find((h) => h.id === id), M = P.RESTRAINT.MOVES;
  // soil: sinking in is a footprint. On sand at the default dial, all-out, the throw's and sprint's feet sink and the
  // jump's feet punch in (under a megajoule: no craters), and none of that counts as breaking the ground
  { const c = ctxOf(90718 * g, { surface: surf('sand') }), o = { surface: c.surface, body: rex, m: rex.m, near: 5, obj: obj('car'), angle: 45 };
    const t = P.throwObject(c, obj('car'), 45), j = P.jump(c), sp = P.sprint(c);
    ok('on sand, sinking in is not broken ground (throw, jump, sprint)', t.sinkRatio > 1 && j.groundFails && j.Eground < 1e6 && sp.sinks && !H('ground').test(M.throw, t, o) && !H('ground').test(M.jump, j, o) && !H('ground').test(M.sprint, sp, o));
    const j2 = P.jump(ctxOf(1e7 * g, { surface: surf('sand') }));
    ok('on sand, a jump that leaves craters (over a megajoule into the ground) does break it', j2.Eground >= 1e6 && H('ground').test(M.jump, j2, o)); }
  // a jump's landing breaks a slab when it is past the slab's bearing, even if the take-off didn't
  { const c = ctxOf(3e6 * g, { surface: surf('concrete') }), r = P.jump(c), o = { surface: c.surface, body: rex, m: rex.m, near: 5 };
    const landOnly = Object.assign({}, r, { groundFails: false });
    ok('jump on concrete: a landing past the bearing sets the ground hazard', r.landing.ratio > 1 && H('ground').test(M.jump, landOnly, o) && !H('ground').test(M.jump, Object.assign({}, landOnly, { landing: Object.assign({}, r.landing, { ratio: 0.9 }) }), o), 'landing ratio ' + r.landing.ratio.toFixed(2)); }
  // the Stomp tab's shaking at the drill stamp's leg speed equals the Walk tab's stamp
  { const st = P.walkStep(rex, surf('concrete'), { effort: 1 }), vSt = Math.sqrt(2 * g * P.WALK.STAMP.thigh * rex.H);
    const sh = M.stomp.shake({ vFoot: vSt, holeDepth: 0 }, { surface: surf('concrete'), body: rex });
    ok('a stomp at the drill stamp\'s leg speed shakes the ground like the Walk tab\'s stamp', near(P.ppvAt(sh, 5), P.ppvAt(st.src[0], 5), 0.01), (P.ppvAt(sh, 5) * 1000).toPrecision(3) + ' vs ' + (P.ppvAt(st.src[0], 5) * 1000).toPrecision(3) + ' mm/s'); }
  // the stomp's goal is the one-jolt level, not the walk-past level
  { const c = ctxOf(90718 * g), p = P.RESTRAINT.planNow('stomp', c, { near: 5 }), r = p.run(p.goal().use);
    ok('stomp goal is the 1 mm/s one-jolt level', near(P.ppvAt(M.stomp.shake(r, p.opt), 5), P.VIB.TH.feelOnce, 0.02)); }
  // a person's launch is judged by the push's peak (real muscle pushes hardest at first)
  // (at 350 kg of effort the average push is within the 1.5 g limit and the peak is past it)
  { const person = obj('person'), r = P.throwObject(ctxOf(90718 * g, { mode: 'real', use: 350 * g }), person, 45), o = { obj: person, angle: 45 };
    const nAvg = P.PASSENGER.felt(r.launchG, 45), nPk = P.PASSENGER.felt(r.launchGPeak, 45), lim = P.PASSENGER.noHarm(r.launchT);
    ok('passenger hazard uses the launch peak', nAvg <= lim && nPk > lim && H('passenger').test(M.throw, r, o), sig2(nAvg) + ' g mean, ' + sig2(nPk) + ' g peak, limit ' + sig2(lim)); }
  // instant growth about his middle (canon): never thrown up; the lift goes to the endless ocean
  { const I = P.instantGrowth(rex, 4.2e23, 0.5, { surface: surf('concrete') }), I0 = P.instantGrowth(rex, 4.2e23, 0.5);
    ok('instant growth (Chicxulub, mix): never launched, on concrete or comic ground, and the lift that went to the ocean is reported', I.launch === 0 && I0.launch === 0 && I0.launchWould > 1e4 && I.launchWould > 0, sig2(I0.launchWould) + ' m on comic ground'); }
  // gradual growth: the shortest harmless times in the research (growth_slow_tmin_examples)
  for (const [E, f, T] of [[4.2e23, 0.5, 86], [4.2e23, 1, 248], [3.828e26, 0.5, 824], [3.828e26, 1, 2560]]) ok('gradual growth shortest harmless time ' + T + ' s (' + E.toExponential(1) + ' J, s = ' + f + ')', near(P.gradualGrowth(rex, E, f).T, T, 0.02), P.gradualGrowth(rex, E, f).T.toFixed(1));
  ok('instant growth timescale: sound crossing his new body (6.7 ms for Chicxulub, mix)', near(P.instantGrowth(rex, 4.2e23, 0.5).tau, 0.0067, 0.02));
  ok('runaway air share about 2e-16 for Chicxulub (mix)', near(P.runawayGrowth(rex, 4.2e23, 0.5).kAir, 2.25e-16, 0.05));
  // clap with silent strike, as for the punch
  { const a = P.clap(ctxOf(1e9 * g)), b = P.clap(ctxOf(1e9 * g, { silentStrike: true }));
    ok('silent strike keeps the clap and turns off its boom and air hazards', a.vHand === b.vHand && a.vHand >= P.K.a0 && H('boom').test(M.clap, a, { near: 5 }) && !H('boom').test(M.clap, b, { near: 5, silentStrike: true }) && !H('air').test(M.clap, b, { near: 5, silentStrike: true })); }
  // a thrown object's landing shakes the ground
  { const r = P.throwObject(ctxOf(90718 * g), obj('car'), 45);
    ok('a landing car shakes the ground where it lands', P.ppvAt(M.throw.shake(r, { obj: obj('car'), surface: surf('concrete') }), 5) > 1e-4); }
  // 'break windows across the street' is judged at 15 m
  // (a punch whose 6.9 kPa radius is between 15 m and the 40 m nearest people: true only if judged at 15 m)
  { const pw = P.RESTRAINT.PRESETS.find((x) => x.id === 'windows'), r = P.punch(ctxOf(Math.pow(10, 7.5) * g)), rad = P.blastRadius(M.punch.blast(r, {}), P.RESTRAINT.R.DP_WINDOWS);
    ok('the windows preset is judged at the street (15 m)', P.RESTRAINT.R.STREET === 15 && rad > 15 && rad < 40 && pw.test(M.punch, r, { near: 40 }), sig2(rad) + ' m'); }
  // Ollie's boots on soft clay: mired
  ok('Ollie on soft clay is mired', P.walkStep(ollie, surf('softclay'), {}).footprint.kind === 'mired');
}

// 9. Guards for review round 3's fixes (each fails if one line of its fix is undone).
{
  const H = (id) => P.RESTRAINT.HAZARDS.find((h) => h.id === id), M = P.RESTRAINT.MOVES, PR = (id) => P.RESTRAINT.PRESETS.find((x) => x.id === id);
  // the plaster safe level follows RI 8507 Figure B-1: 12.7 mm/s from about 2.7 to 10 Hz, 0.2 mm of displacement to
  // 40 Hz, 50.8 mm/s above, and never falls as the frequency rises
  const L = P.plasterLimitHz;
  ok('plaster safe level: 12.7 mm/s at 5 Hz, 2 pi f x 0.2 mm at 20 Hz, 50.8 mm/s at 100 Hz', near(L(5), 0.0127, 1e-9) && near(L(20), 2 * Math.PI * 20 * 0.008 * 0.0254, 1e-9) && near(L(100), 0.0508, 1e-9) && near(L(1), 2 * Math.PI * 0.030 * 0.0254, 1e-9));
  let mono = true; for (let f = 0.3, prev = 0; f < 300; f *= 1.05) { if (L(f) < prev * (1 - 1e-12)) mono = false; prev = L(f); }
  ok('plaster safe level never falls as the frequency rises', mono);
  // the hazard check uses the curve: a 5 ms jolt (200 Hz) of 20 mm/s at 5 m is under its 50.8 mm/s, one of 60 mm/s is over
  { const gd = { rho: 2300, cs: 1500, xi: 0.01 }, unit = P.ppvAt({ kind: 'hann', F: 1, T: 0.005, ground: gd }, 5), src = (v) => ({ kind: 'hann', F: v / unit, T: 0.005, ground: gd });
    ok('plaster check: a short jolt is judged at 50.8 mm/s, not 12.7', !P.plasterOver(src(0.020), 5) && P.plasterOver(src(0.060), 5)); }
  // ... so on a hazard scan it stays on once on (the 2 m calibration body's jump used to switch off at 40 Hz)
  { const cb = P.makeBody({}), c = { F: 1e6 * g, mode: 'comic', body: cb, surface: surf('concrete'), groundHolds: false, anchor: 'friction' }, o = { surface: c.surface, body: cb, m: cb.m, near: 5 };
    let on = false, back = false; for (let u = 1e4; u < 1e6; u *= 1.02) { const x = H('plaster').test(M.jump, P.jump(Object.assign({}, c, { use: u * g })), o); if (on && !x) back = true; on = on || x; }
    ok('calibration body jump: the plaster hazard stays on once on', on && !back); }
  // the stomp's extra stamp share stops growing at the stamp's own leg speed
  { const vs = Math.sqrt(2 * g * P.WALK.STAMP.thigh * rex.H), o = { surface: surf('concrete'), body: rex }, J = (v) => { const x = M.stomp.shake({ vFoot: v, holeDepth: 0 }, o); return x.F * x.T / 2; };
    ok('stomp impulse past the stamp speed grows by the leg alone', near(J(2 * vs) - J(vs), rex.legEff * vs, 1e-6), sig2(J(2 * vs) - J(vs)) + ' vs ' + sig2(rex.legEff * vs)); }
  // sand prints follow the landing peak: a stamp prints much deeper than an ordinary step, and is flagged as extrapolated
  { const a = P.walkStep(rex, surf('sand'), { effort: 0.5 }).footprint, b = P.walkStep(rex, surf('sand'), { effort: 1 }).footprint;
    ok('sand: a stamp prints over 3x deeper than an ordinary step, past the fitted range', b.depth > 3 * a.depth && b.extrapolated && !a.extrapolated, sig2(a.depth * 1000) + ' vs ' + sig2(b.depth * 1000) + ' mm'); }
  // a throw's boom counts his recoil: a locomotive slower than sound with Rex recoiling past it
  { let hit = null; for (let u = 1e6; u < 1e10 && !hit; u *= 1.1) { const r = P.throwObject(ctxOf(1e12 * g, { use: u * g }), obj('loco'), 45); if (r.canMove && r.v < P.K.a0 && r.recoilV >= P.K.a0) hit = r; }
    ok('a locomotive thrown below Mach 1 with Rex recoiling past it: sonic boom', !!hit && H('boom').test(M.throw, hit, { near: 5 })); }
  // a jump's boom counts his feet driven into the ground
  { let hit = null; for (let u = 1e5; u < 1e9 && !hit; u *= 1.1) { const r = P.jump(ctxOf(1e12 * g, { use: u * g })); if (r.v < P.K.a0 && r.footSpeed >= P.K.a0) hit = r; }
    ok('a jump whose feet pass Mach 1: sonic boom', !!hit && H('boom').test(M.jump, hit, { near: 5 })); }
  // in soil a stomp's hole is a footprint: no crater, no broken ground
  { const r = P.stomp(ctxOf(1e5 * g, { surface: surf('sand'), use: 1e4 * g })), o = { surface: surf('sand'), body: rex, near: 5 };
    ok('sand: a stomp that dents the ground (no crater) does not break it', r.holeDepth >= 0.01 && !(r.crater > 0) && !H('ground').test(M.stomp, r, o), sig2(r.holeDepth * 100) + ' cm'); }
  // the nearest-people distance moves the air and plaster onsets
  { const on = (mv, id, nr) => P.RESTRAINT.planNow(mv, ctxOf(1e12 * g), { near: nr }).result('hazard:' + id).use;
    ok('farther nearest people: the stomp\'s plaster onset rises', on('stomp', 'plaster', 40) > on('stomp', 'plaster', 5) * 1.5);
    // (a punch's blast reaches past 40 m as soon as it passes Mach 1, so judge one blast at two distances)
    const r = P.punch(ctxOf(1e9 * g)), rad = P.blastRadius(M.punch.blast(r, {}), P.RESTRAINT.R.DP_HARM);
    ok('the air hazard is judged at the nearest-people distance', H('air').test(M.punch, r, { near: rad * 0.9 }) && !H('air').test(M.punch, r, { near: rad * 1.1 }), sig2(rad) + ' m'); }
  // the rattle preset is judged at the rattle level (1 mm/s), not the feel level
  { const p = P.RESTRAINT.planNow('stomp', ctxOf(1e6 * g), { near: 5 }), r = p.result('preset:rattle');
    const at = (u) => P.ppvAt(M.stomp.shake(p.run(u), p.opt), 5);
    ok('rattle preset starts at 1 mm/s', at(r.use) >= P.VIB.TH.rattle && at(r.below) < P.VIB.TH.rattle * 1.0001, (at(r.use) * 1000).toPrecision(3) + ' mm/s'); }
  // a relativistic throw's fireball is a blast of all its energy
  { const r = P.throwObject(ctxOf(Infinity), obj('baseball'), 45);
    ok('an unlimited throw\'s fireball counts its whole energy', r.flight.relativistic && M.throw.blast(r, { obj: obj('baseball') }) === r.Eobj); }
  // a throw past Mach 1: the air takes the energy in flight (the 'upper bound' presets can fire), unless Cool flight is on
  { const c = ctxOf(1e15 * g), r = P.throwObject(c, obj('car'), 45), o = { obj: obj('car'), angle: 45, near: 5, surface: c.surface, body: rex };
    ok('a car thrown far past Mach 1: its flight counts as a blast from him', r.v > P.K.a0 && r.dragLoss > 0 && M.throw.blast(r, o) >= r.dragLoss && M.throw.blastFrom(r, o) === 'path' && PR('windows').test(M.throw, r, o));
    ok('... and with Cool flight only the landing and his own recoil count', M.throw.blast(r, Object.assign({ coolFlight: true }, o)) === Math.max(r.flight.vImpact >= P.K.a0 ? r.Eimpact : 0, r.recoilV >= P.K.a0 ? r.recoilE : 0)); }
  // a solo throw's recoil slide past the nearest people is a hazard (a bus on ice at a 100 t dial)
  { const c = ctxOf(1e5 * g, { surface: surf('ice') }), p = P.RESTRAINT.planNow('throw', c, { obj: obj('bus'), angle: 45, target: 30, near: 5 }), ce = p.ceiling();
    ok('bus on ice: the courtesy ceiling stops before his recoil slides him past 5 m', ce.by === 'slide' && M.throw.slide(p.run(ce.below), p.opt) < 5 && M.throw.slide(p.run(ce.use), p.opt) >= 5, sig2(ce.below / g) + ' kg'); }
  // instant growth on ground that gives: the soles are driven in, and the ground takes that work
  { const I = P.instantGrowth(rex, 4.2e23, 0.5, { surface: surf('concrete') });
    ok('instant growth (Chicxulub, mix) on concrete: the ground takes more than the air', I.gives && I.Eground > I.Ehi && near(I.uHead, 0.5 * I.grown.dH / I.tau, 1e-9), sig2(I.Eground) + ' J vs ' + sig2(I.Ehi) + ' J'); }
}

// 9. The owners' answers (12 Oct 2026): growth about the middle, the runaway's round trip, the standing sink rule.
{
  // growth about his middle: on ground that gives, his middle stays put and his soles go in dH/2 at dH/2t
  for (const [E, f] of [[2.7e20, 0.5], [4.2e23, 0.5], [4.2e23, 1], [3.828e26, 1]]) for (const id of ['sand', 'concrete', 'granite']) {
    const I = P.instantGrowth(rex, E, f, { surface: surf(id) }), G = I.grown;
    ok('about the middle (' + E.toExponential(1) + ' J, s ' + f + ', ' + id + '): soles driven dH/2 in, head rises dH/2t, no launch',
      I.gives && near(I.sink, G.dH / 2, 1e-9) && near(I.uHead, G.dH / (2 * I.tau), 1e-9) && I.launch === 0 && I.rise === 0
      && near(I.Eground, I.soles * (I.qGround + P.K.PONCELET_K * surf(id).rho * I.vSole * I.vSole) * I.sink, 1e-9)
      && near(I.vWould, Math.max(0, I.Fground - G.m * g) * I.tau / G.m, 1e-9), sig2(I.sink) + ' m'); }
  // comic ground doesn't give: he grows upward and stops; the head moves twice as fast; nothing goes into the ground
  { const I = P.instantGrowth(rex, 4.2e23, 0.5, { surface: surf('concrete'), groundHolds: true }), G = I.grown;
    ok('comic ground: he grows upward (middle rises dH/2), ends at rest, nothing into the ground', !I.gives && near(I.rise, G.dH / 2, 1e-9) && I.sink === 0 && I.Eground === 0 && near(I.uHead, G.dH / I.tau, 1e-9) && near(I.vWould, G.dH / (2 * I.tau), 1e-9)); }
  { const I = P.instantGrowth(rex, 1e20, 0, { surface: surf('sand') });
    ok('pure density: no growth in size, nothing driven in', I.sink === 0 && I.Eground === 0 && I.uHead === 0); }
  // the runaway: a round trip, so exactly E becomes mass; gravity's release goes to the ocean, so the loop never runs away
  for (const E of [1e12, 4.2e23, 1e40, 1e50]) for (const f of [0, 0.5, 1]) {
    const RW = P.runawayGrowth(rex, E, f, { surface: surf('concrete') });
    ok('runaway (' + E.toExponential(0) + ' J, s ' + f + '): total = E, never runs, gravity reported but not fed back', RW.total === E && RW.runs === false && RW.k === RW.kAir + RW.kGround && near(RW.Egrav, RW.kGrav * E, 1e-12) && RW.k < 1, 'k ' + RW.k.toExponential(1) + ', gravity ' + RW.kGrav.toExponential(1)); }
  // the standing rule against the measured elephant print (Schanz 2013: 2,530 kg cow, forefoot 0.32 x 0.30 m, prints
  // 20-26 mm; the authors' calibrated model 4 / 8 / 18 mm at 99 / 185 / 350 kPa)
  const sand = surf('sand'), Bel = 0.274;
  const el = (p) => P.standDepth(sand, p, Bel, 3);
  ok('elephant: 350 kPa (its forefoot\'s dynamic stress) leaves 18 mm, no plunge (measured 20-26 mm)', near(el(350e3).depth, 0.018, 0.01) && el(350e3).plunge === 0, (el(350e3).depth * 1000).toFixed(1) + ' mm');
  ok('elephant: 185 kPa leaves about 8 mm, 99 kPa about 4 mm (the authors\' model)', near(el(185e3).depth, 0.008, 0.15) && near(el(99e3).depth, 0.004, 0.25), (el(185e3).depth * 1000).toFixed(1) + ', ' + (el(99e3).depth * 1000).toFixed(1) + ' mm');
  ok('elephant: the old rule\'s tenfold overprediction is gone (181 kPa, the force-plate peak: under 26 mm)', el(181e3).depth < 0.026, (el(181e3).depth * 1000).toFixed(1) + ' mm');
  // continuity and monotony through the failure pressure, in sand and gravel
  for (const id of ['sand', 'gravel']) {
    const sf = surf(id), B = ollie.footB, qf = P.standDepth(sf, 1e3, B, 3).qFail;
    let prev = 0, mono = true;
    for (let p = 1e3; p < 1e9; p *= 1.05) { const d = P.standDepth(sf, p, B, 3).depth; if (d < prev) mono = false; prev = d; }
    const below = P.standDepth(sf, qf * 0.999999, B, 3).depth, above = P.standDepth(sf, qf * 1.000001, B, 3).depth;
    ok(id + ': standing depth rises with pressure and is continuous at the failure pressure', mono && near(above, below, 1e-3), sig2(qf) + ' Pa'); }
  // at canon, standing is never deeper than walking: the Weight tab no longer contradicts the Walk tab
  for (const [nm, b] of [['Rex', rex], ['Ollie', ollie]]) for (const id of ['sand', 'gravel']) {
    const gu = P.groundUnderWeight(b, surf(id), false), w = P.presence(b, surf(id), { pace: 'walk', effort: 0 }).step.footprint;
    ok(nm + ' on ' + id + ': stands, and the standing print is shallower than the walking one', gu.regime === 'stands' && gu.print > 0 && gu.print < w.depth, (gu.print * 1000).toFixed(1) + ' vs ' + (w.depth * 1000).toFixed(1) + ' mm'); }
  // clay: the Weight tab uses the Walk tab's rule (bearing growing with depth)
  { const b = P.makeBody({ build: 'rex', H: 3.048, m: 4 * 3007 }), sf = surf('softclay'), gu = P.groundUnderWeight(b, sf, false);
    ok('soft clay at 4x density: sinks to where N_c(D) su + gamma D carries him (shallower than the old overburden-only rule)', gu.regime === 'sinks' && near(gu.sink, P.standDepth(sf, gu.footPressure, b.footB, b.H).depth, 1e-9) && gu.sink < (gu.footPressure - sf.qult) / (sf.rho * g), sig2(gu.sink) + ' m'); }
  // denser always sinks at least as far
  { let prev = 0, mono = true;
    for (const k of [1, 2, 5, 10, 30, 100, 300]) { const gu = P.groundUnderWeight(P.makeBody({ build: 'ollie', H: 3.048, m: k * 3007 }), surf('sand'), false); const d = gu.regime === 'stands' ? gu.print : gu.regime === 'sinks' || gu.regime === 'outOfSight' ? gu.sink : Infinity; if (d < prev) mono = false; prev = d; }
    ok('Ollie on sand: denser always sinks at least as far', mono); }
  // the open questions are closed on the page
  { const fs = require('fs'), pth = require('path'), src = fs.readFileSync(pth.join(__dirname, '../src/app.html'), 'utf8') + fs.readFileSync(pth.join(__dirname, '../src/static-data.js'), 'utf8');
    ok('no open questions for the owners left on the page', !/open question/i.test(src) && !/grows from his soles/i.test(src));
    // the half-life control was removed (12 Oct 2026): the runaway loop can never run away under the canon
    ok('no half-life control on the page', !/half-life|halfLife|half-row/.test(src)); }
}

console.log(n + ' checks, ' + (fails ? fails + ' FAILED' : 'all checks passed'));
process.exit(fails ? 1 : 0);
