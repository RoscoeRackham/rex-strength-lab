// Node tests for the Build Comparison model, figures and measuring tool.
// Run from build-comparison/: node test/test.js
'use strict';
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const BC = require('../../build-calculator/src/calc.js');
const builds = require('../../build-calculator/data/builds.json');
const Compare = require('../src/model.js');
const Fig = require('../src/figure.js');
const M = require('../src/measure.js');
const png = require('../tools/png.js');
const settings = require('../data/settings.json');
const outline = require('../data/outline.json');
const duo = require('../data/duo-outlines.json');
const comparisonFile = path.join(__dirname, '..', 'data', 'comparison.json');
const comparison = fs.existsSync(comparisonFile) ? require(comparisonFile) : null;

const calc = BC.create(builds);
const model = Compare.create(calc, comparison || { builds: settings.builds, fat_classes: settings.fat_classes });

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('ok   ' + name); }
  catch (e) { failed++; console.log('FAIL ' + name + '\n     ' + (e && e.message)); }
}
function near(a, b, tol, msg) { assert.ok(Math.abs(a - b) <= tol, (msg || '') + ' expected ' + b + ' +/- ' + tol + ', got ' + a); }

// ---------- the score ----------
test('the score equals plain FFMI at 1.80 m and ignores size at the same shape', () => {
  near(Compare.score(81, 1.8), 25, 1e-9);
  near(Compare.ffmi(81, 1.8), 25, 1e-9);
  for (const k of [0.5, 1.6933, 3]) near(Compare.score(81 * k * k * k, 1.8 * k), 25, 1e-9, 'k=' + k);
  near(Compare.plainFromScore(25, 3.048), 25 * 3.048 / 1.8, 1e-9);
});

test('the meatball scores about 924 at 7.5% fat and 1,060 kg/m^3 (899-949 for 5-10%)', () => {
  near(Compare.ballScore(1060, 7.5), 924.1, 0.05);
  near(Compare.ballScore(1060, 5), 949.1, 0.05);
  near(Compare.ballScore(1060, 10), 899.1, 0.05);
});

test('the Army one-site equation reproduces its published worked example (35 in, 210 lb: 17.48%)', () => {
  near(Compare.armyBodyFat(210 * 0.45359237, 35 * 0.0254), 17.48, 0.005);
});

// ---------- the builds ----------
test("soldiers' body fat: the mean of the official and Taylor equations, the range covering both plus 3.35 points", () => {
  const e = model.evaluate('ansur2_m_p50'), b = e.build;
  const o = Compare.armyBodyFat(b.weight_kg.value, b.girths.waist.value_m), t = Compare.taylorBodyFat(b.weight_kg.value, b.girths.waist.value_m);
  near(t - o, -0.08 + 0.07 * b.girths.waist.value_m / 0.0254, 1e-9, 'Taylor minus official');
  near(e.bodyFat.value, (o + t) / 2, 1e-9); near(e.bodyFat.lo, Math.min(o, t) - 3.35, 1e-9); near(e.bodyFat.hi, Math.max(o, t) + 3.35, 1e-9);
});

test('the chart has every man in builds.json and no woman', () => {
  const men = builds.builds.filter((b) => b.sex === 'M').map((b) => b.id).sort();
  assert.deepStrictEqual(Object.keys(settings.builds).sort(), men);
});

test('every build scores without NaN, with its central value inside its range', () => {
  for (const e of model.all()) {
    for (const v of [e.score.value, e.score.lo, e.score.hi, e.plain.value, e.bodyFat.value, e.height.value, e.mass.value]) assert.ok(Number.isFinite(v), e.id);
    assert.ok(e.score.lo <= e.score.value + 1e-9 && e.score.value <= e.score.hi + 1e-9, e.id + ' range');
    assert.ok(e.bodyFat.lo <= e.bodyFat.value && e.bodyFat.value <= e.bodyFat.hi, e.id + ' fat range');
    near(e.plain.value, Compare.plainFromScore(e.score.value, e.height.value), 1e-9, e.id + ' plain');
  }
});

test('Rex and Ollie: height to the top of the skull, tails out, 7.5% fat (5-10%)', () => {
  const rex = model.evaluate('rex'), ollie = model.evaluate('ollie');
  near(rex.height.value, 2.92, 1e-9); near(ollie.height.value, 2.91, 1e-9);
  // mass by ruling: 3,000 kg each in all (13 Oct 2026); Rex is 2,700 kg without his 300 kg tail, Ollie about 2,989 kg without his
  near(rex.mass.value, 3000 - 300, 1e-9); near(ollie.mass.value, 3000 - 11, 1e-9);
  assert.deepStrictEqual([rex.bodyFat.lo, rex.bodyFat.value, rex.bodyFat.hi], [5, 7.5, 10]);
  near(rex.score.value, 1.8 * 2700 * 0.925 / Math.pow(2.92, 3), 1e-9);
  // the range covers skull height and body fat together (the ruled mass has no range)
  near(rex.score.lo, 1.8 * 2700 * 0.9 / Math.pow(2.95, 3), 1e-9);
  near(rex.score.hi, 1.8 * 2700 * 0.95 / Math.pow(2.90, 3), 1e-9);
});

test('comic editions are not mixed into a range; Wolverine is scored without adamantium', () => {
  const hulk = model.evaluate('hulk_savage');
  assert.deepStrictEqual(hulk.height.range, [hulk.height.value, hulk.height.value]);
  assert.deepStrictEqual(hulk.mass.range, [hulk.mass.value, hulk.mass.value]);
  near(model.evaluate('wolverine').mass.value, calc.byId.wolverine.girth_basis_weight_kg, 1e-9);
});

test('armoured Colossus is not comparable; Thor, Superman and Luke Cage may be overstated; the Thing is uncertain; none bounds a gap', () => {
  const list = model.all();
  const want = { colossus_armored: 'no', thor: 'overstated', superman: 'overstated', luke_cage: 'overstated', thing: 'uncertain' };
  for (const [id, c] of Object.entries(want)) {
    const e = model.evaluate(id);
    assert.strictEqual(e.comparable, c, id);
    assert.ok(e.comparableNote && e.comparableKeys.length, id + ' says why, with sources');
  }
  const gaps = model.gaps(list, Compare.ballScore(1060, 7.5));
  for (const g of gaps) for (const id of Object.keys(want)) assert.ok(g.below !== id && g.above !== id, id + ' bounds a gap');
  assert.ok(gaps.length >= 2, 'expected gaps, got ' + gaps.length);
  const top = gaps[gaps.length - 1];
  assert.strictEqual(top.above, null); assert.strictEqual(top.below, 'ollie');
});

test('no build range reaches into a gap, even one sorted before a neighbour with a lower top', () => {
  const list = model.all();
  for (const g of model.gaps(list, Compare.ballScore(1060, 7.5))) {
    for (const e of list) if (e.comparable === 'yes') assert.ok(e.score.hi <= g.from + 1e-9 || e.score.lo >= g.to - 1e-9, e.id + ' reaches into ' + g.from + '-' + g.to);
  }
  // A wide range sorted earlier closes the gap a narrow neighbour would leave open.
  const fake = (id, v, lo, hi) => ({ id, comparable: 'yes', score: { value: v, lo, hi } });
  const g = model.gaps([fake('a', 20, 15, 60), fake('b', 21, 20, 22), fake('c', 50, 45, 55)], null);
  assert.strictEqual(g.length, 0, JSON.stringify(g));
});

test('every fact key the settings cite exists, in facts.json or builds.json', () => {
  const facts = require('../data/facts.json').facts;
  const keys = new Set();
  (function walk(o) {
    if (Array.isArray(o)) { o.forEach(walk); return; }
    if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) { if (k === 'keys') v.forEach((x) => keys.add(x)); else walk(v); }
  })(settings);
  const missing = [...keys].filter((k) => !facts[k] && !builds.facts[k]);
  assert.deepStrictEqual(missing, []);
});

// ---------- the outline template ----------
test('data/outline.json is what tools/derive_outline.js derives from the ANSUR II CSV', () => {
  const { derive, CSV } = require('../tools/derive_outline.js');
  if (!fs.existsSync(CSV)) { console.log('     (CSV not found; skipped)'); return; }
  assert.deepStrictEqual(JSON.parse(JSON.stringify(derive(CSV))), outline);
});

test('data/duo-outlines.json is what tools/trace_turnarounds.js traces from the turnarounds', () => {
  const { run } = require('../tools/trace_turnarounds.js');
  assert.deepStrictEqual(JSON.parse(JSON.stringify(run(null))), duo);
});

function girthsOf(id) {
  const r = calc.compute({ buildId: id }); const g = {}, marks = {};
  for (const s of BC.SITES) { g[s] = r.girths[s].value; marks[s] = r.girths[s].kind === 'own' ? 'own' : 'template'; }
  return { r, g, marks };
}

test('human figures: same-height drawing, marking follows the girth source', () => {
  const { r, g, marks } = girthsOf('ronnie_coleman');
  const f = Fig.human(outline, r.height.value, g, marks, { buttockFit: BC.FRUSTUM.M.buttock });
  const b = Fig.bounds(f.front);
  near(b[3], r.height.value, 1e-3, 'top of the head');
  near(b[1], 0, 1e-9, 'feet on the ground');
  const body = f.front.find((p) => p.name === 'body');
  const bands = {}; body.edges.forEach((e) => { bands[e.band] = e.mark; });
  assert.strictEqual(bands.chest, 'own'); assert.strictEqual(bands.neck, 'template');
  assert.strictEqual(f.front.find((p) => p.name === 'left forearm').mark, 'template');
  assert.strictEqual(f.front.find((p) => p.name === 'head').mark, 'average');
});

test('the drawn chest is the ANSUR II breadth for the girth: 0.274 x chest girth', () => {
  const { r, g } = girthsOf('ansur2_m_p50');
  const f = Fig.human(outline, r.height.value, g, {}, { buttockFit: BC.FRUSTUM.M.buttock });
  near(f.dims.chestB, outline.sections.chest.breadth_over_girth.mean * g.chest, 1e-12);
  near(f.dims.chestB, 0.2895, 0.0005);
});

test('Rex and Ollie are drawn to their skull-top height, crest and horns above it, side views facing right', () => {
  for (const [name, H] of [['rex', 2.92], ['ollie', 2.91]]) {
    for (const view of ['front', 'side']) {
      const t = Fig.traced(duo.characters[name], view, H);
      const b = Fig.bounds(t.parts);
      assert.ok(b[3] > H, name + ' ' + view + ' rises above the skull line');
      assert.ok(b[1] > -0.01 && b[1] < 0.02, name + ' ' + view + ' stands on the ground');
    }
  }
  assert.strictEqual(duo.characters.rex.views.side.facing, 'left');
  // Traced side views are mirrored to face right, so the tail sits behind, to the left (x < 0).
  for (const [name, H] of [['rex', 2.92], ['ollie', 2.91]]) {
    const tail = Fig.traced(duo.characters[name], 'side', H).parts.filter((p) => p.mark === 'tail');
    assert.ok(tail.length, name + ' has a tail in the side view');
    const xs = tail.flatMap((p) => p.poly.map((q) => q[0]));
    assert.ok(xs.reduce((a, b) => a + b, 0) / xs.length < 0, name + ': the side-view tail is behind (facing right)');
  }
});

// ---------- the measuring tool ----------
// A blocky figure with an exact volume: elliptic-section torso, ellipsoid head, round legs and
// round arms tilted 20 degrees in the picture plane.
function synth(H) {
  const rect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
  const crotch = 0.47 * H, shoulder = 0.80 * H, neckTop = 0.88 * H, headH = 0.13 * H;
  const a = 0.30 * H, b = 0.16 * H, nw = 0.07 * H, nd = 0.075 * H, hw = 0.09 * H, hd = 0.11 * H;
  const r = 0.05 * H, legX = 0.075 * H, aw = 0.05 * H, th = 20 * Math.PI / 180, L = 0.30 * H;
  const hwid = aw / 2 / Math.cos(th), ax = a / 2 + 0.035 * H + hwid, ay = shoulder - 0.03 * H;
  const arm = (s) => [[s * ax - hwid, ay], [s * ax + hwid, ay], [s * ax + hwid + s * Math.sin(th) * L, ay - Math.cos(th) * L], [s * ax - hwid + s * Math.sin(th) * L, ay - Math.cos(th) * L]];
  const P = (poly) => ({ poly, mark: 'own' });
  const front = [P(rect(-a / 2, crotch, a / 2, shoulder)), P(rect(-nw / 2, shoulder, nw / 2, neckTop)), P(Fig.ellipse(0, H - headH / 2, hw / 2, headH / 2, 360)),
    P(rect(-legX - r, 0, -legX + r, crotch + 0.001)), P(rect(legX - r, 0, legX + r, crotch + 0.001)), P(arm(1)), P(arm(-1)),
    P(rect(-ax - hwid, ay, -a / 2 + 0.001, shoulder)), P(rect(a / 2 - 0.001, ay, ax + hwid, shoulder))];
  const side = [P(rect(-b / 2, crotch, b / 2, shoulder)), P(rect(-nd / 2, shoulder, nd / 2, neckTop)), P(Fig.ellipse(0, H - headH / 2, hd / 2, headH / 2, 360)), P(rect(-r, 0, r, crotch + 0.001))];
  const bridge = Math.PI / 4 * (2 * (ax + hwid) - a) * b * (shoulder - ay);
  const V = Math.PI / 4 * a * b * (shoulder - crotch) + Math.PI / 4 * nw * nd * (neckTop - shoulder) + Math.PI / 6 * hw * hd * headH +
    2 * Math.PI * r * r * crotch + 2 * Math.PI / 4 * aw * aw * L + bridge;
  return { front, side, V, chest: M.ellipsePerimeter(a, b), thigh: 2 * Math.PI * r, arm: Math.PI * aw,
    levels: { shoulder: shoulder - 0.01 * H, chest: 0.72 * H, waist: 0.6 * H, crotch, knee: 0.28 * H } };
}

test('the tool measures a figure of known volume to within 0.5%, and its girths to within 1%', () => {
  const H = 1.8, s = synth(H);
  for (const lines of [false, true]) {
    const img = Fig.renderSheet({ front: s.front, side: s.side }, H, lines ? s.levels : null, { figurePx: 2000 });
    const r = M.measureSheet(img, { heightM: H, heightRef: 'top', armK: 1, shape: false });
    assert.ok(r.ok, 'sheet accepted: ' + r.errors.join('; '));
    near(r.volume_m3.value / s.V, 1, 0.005, (lines ? 'with' : 'without') + ' guide lines: volume ratio');
    near(r.girths.chest.value_m / s.chest, 1, 0.01, 'chest');
    near(r.girths.thigh.value_m / s.thigh, 1, 0.01, 'thigh');
    near(r.girths.arm_flexed.value_m / s.arm, 1, 0.02, 'arm');
    if (lines) { assert.strictEqual(r.guideLines.length, 6, 'five guide lines and the ground'); assert.strictEqual(r.landmarkSource, 'guide lines on the sheet'); }
  }
});

test("the tool's trunk shape factors are ANSUR II's tape-to-ellipse ratios", () => {
  near(M.TRUNK_SHAPE.chest, outline.sections.chest.girth_over_ellipse.mean, 0.0005);
  near(M.TRUNK_SHAPE.waist, outline.sections.waist.girth_over_ellipse.mean, 0.0005);
});

test('on a sheet drawn from the ANSUR II median man, the tool gives back his chest and waist tapes within 3%', () => {
  const { r: rr, g } = girthsOf('ansur2_m_p50');
  const f = Fig.human(outline, rr.height.value, g, {}, { buttockFit: BC.FRUSTUM.M.buttock, armDeg: 35 });
  const y = f.dims.levels;
  const img = Fig.renderSheet({ front: f.front, side: f.side }, rr.height.value, { shoulder: y.acromion, chest: y.chest, waist: y.waist, crotch: y.crotch, knee: y.knee }, { figurePx: 1600 });
  const r = M.measureSheet(img, { heightM: rr.height.value, heightRef: 'top' });
  near(r.girths.chest.value_m / g.chest, 1, 0.03, 'chest');
  near(r.girths.waist.value_m / g.waist, 1, 0.03, 'waist');
});

test('the tool rejects a sheet whose views differ in height by more than 2%', () => {
  const H = 1.8, s = synth(H);
  const tall = s.side.map((p) => ({ poly: p.poly.map((q) => [q[0], q[1] * 1.04]), mark: 'own' }));
  const img = Fig.renderSheet({ front: s.front, side: tall }, H * 1.04, null, { figurePx: 1200 });
  const r = M.measureSheet(img, { heightM: H, heightRef: 'top' });
  assert.ok(!r.ok);
  assert.ok(r.errors.some((e) => /view heights agree/.test(e)), r.errors.join('; '));
});

test('the current turnarounds fail the sheet checks (tail over the back view, low resolution)', () => {
  const T = require('../tools/trace_turnarounds.js').READINGS;
  for (const name of ['rex', 'ollie']) {
    const R = T[name], img = png.read(path.join(__dirname, '..', R.file));
    const ex = {}, skull = {};
    for (const v of R.order) { ex[v] = R.views[v].tail ? [R.views[v].tail] : []; skull[v] = R.views[v].skull; }
    const r = M.measureSheet(img, { heightM: 3, skullRows: skull, order: R.order, exclude: ex, seg: { ignore: R.ignore } });
    assert.ok(!r.ok, name + ' should be rejected');
    assert.ok(r.warnings.some((w) => /2,000 px/.test(w)), name + ': resolution warning');
    const failed = r.checks.filter((c) => !c.ok).map((c) => c.name);
    const want = { rex: ['front and back landmarks line up', 'side-view neck lines up'], ollie: ['front and back landmarks line up'] }[name];
    assert.deepStrictEqual(failed.map((n) => want.find((w) => n.startsWith(w)) || n), want, name + ' fails ' + failed.join('; '));
    // Their round bellies make the waist as deep as it is wide; the hips still mark the side view.
    assert.ok(r.checks.find((c) => /side view is a side view/.test(c.name)).ok, name + ': a real side view is not mistaken for a back view');
  }
});

test('a sheet with front and back views but no side view is refused (the back is not a depth)', () => {
  const { templateViews } = require('../tools/export_targets.js');
  const t = templateViews('ansur2_m_p50', 1.8, 1);
  const good = M.measureSheet(Fig.renderSheet(t.views, 1.8, t.levels, { figurePx: 600 }), { heightM: 1.8, heightRef: 'top', seg: { refine: 0 } });
  const frontBack = M.measureSheet(Fig.renderSheet({ front: t.views.front, side: t.views.front }, 1.8, t.levels, { figurePx: 600 }), { heightM: 1.8, heightRef: 'top', seg: { refine: 0 } });
  assert.ok(good.ok, 'front and side pass');
  assert.ok(!frontBack.ok && frontBack.checks.some((c) => /side view is a side view/.test(c.name) && !c.ok), 'front and back are refused');
});

test('typed skull rows outside the head are refused, not scored', () => {
  const { templateViews } = require('../tools/export_targets.js');
  const t = templateViews('ansur2_m_p50', 1.8, 1);
  const img = Fig.renderSheet(t.views, 1.8, t.levels, { figurePx: 600 });
  const rows = Fig.sheetSkullRows(img, 1.8);
  const ok = M.measureSheet(img, { heightM: 1.8, skullRows: rows, seg: { refine: 0 } });
  assert.ok(ok.ok && ok.landmarks.skull === rows.front, 'the true skull rows are used and reported');
  for (const bad of [5000, rows.front + 400, rows.front - 40]) {
    const r = M.measureSheet(img, { heightM: 1.8, skullRows: { front: bad, side: rows.side }, seg: { refine: 0 } });
    assert.ok(!r.ok && !r.score && r.errors.some((e) => /outside its head/.test(e)), 'row ' + bad + ' refused');
  }
});

test('a tilted part with a depth profile reads the profile at its own image rows', () => {
  const w = 200, h = 300, mask = new Uint8Array(w * h);
  for (let y = 100; y < 200; y++) for (let x = 80; x < 120; x++) mask[y * w + x] = 1;
  const k = M.kProfile([[100, 1], [200, 0.5]]);
  near(M.sliceRotated(mask, w, h, k, 0.001) / M.sliceRows(mask, w, h, k), 1, 0.01, 'tilted by 0.001 degrees:');
  // At 30 degrees a rectangle slices differently across its tilt, but the profile must cost no more than a flat k does.
  near((M.sliceRotated(mask, w, h, k, 30) / M.sliceRows(mask, w, h, k)) / (M.sliceRotated(mask, w, h, 0.75, 30) / M.sliceRows(mask, w, h, 0.75)), 1, 0.005, 'tilted by 30 degrees, profile against flat:');
});

test('widening every run by f multiplies the measured volume by f^2', () => {
  const H = 1.8, s = synth(H);
  const img = Fig.renderSheet({ front: s.front, side: s.side }, H, null, { figurePx: 1600 });
  const base = M.measureSheet(img, { heightM: H, heightRef: 'top' });
  const m = M.scaleRuns(base.mask, img.width, img.height, Object.values(base.views), 1.3);
  const out = { width: img.width, height: img.height, data: new Uint8ClampedArray(img.data.length) };
  for (let i = 0; i < m.length; i++) { const v = m[i] ? 0 : 255; out.data[i * 4] = out.data[i * 4 + 1] = out.data[i * 4 + 2] = v; out.data[i * 4 + 3] = 255; }
  const r = M.measureSheet(out, { heightM: H, heightRef: 'top', seg: { refine: 0 } });
  near(r.volume_m3.value / base.volume_m3.value, 1.69, 0.03);
});

// ---------- functional limits ----------
test('limits: wider at fixed bones, the thighs touch further down and the arms are pushed further out', () => {
  const { r, g } = girthsOf('ansur2_m_p50');
  const base = Fig.human(outline, r.height.value, g, {}, { buttockFit: BC.FRUSTUM.M.buttock });
  const mk = (f, deg) => Fig.human(outline, r.height.value, g, {}, { buttockFit: BC.FRUSTUM.M.buttock, widthScale: f, legAxis: base.dims.legAxis, armDeg: deg });
  let lastT = -1, lastA = -1;
  for (const f of [1, 1.2, 1.4, 1.8]) {
    const t = Fig.thighContact(mk(f)), a = Fig.armRestAngle((deg) => mk(f, deg));
    assert.ok(t >= lastT && a >= lastA, 'monotone at f=' + f);
    lastT = t; lastA = a;
  }
  assert.ok(Fig.armRestAngle((deg) => mk(1, deg)) < 20, 'an ordinary man can let his arms hang within the chart\'s 20 degrees');
  assert.ok(Fig.thighContact(base) < 1, 'an ordinary man has daylight between the thighs above the knee');
});

// The limits and the chart's own figures, recomputed: data/limits.json must be what the tool gives.
const limitsRun = JSON.parse(JSON.stringify(require('../tools/compute_limits.js').run()));
test('data/limits.json is what tools/compute_limits.js computes (run it after changing settings or figures)', () => {
  assert.deepStrictEqual(require('../data/limits.json'), limitsRun);
});

test("each limit's score is its drawn shape's volume (head and body by the tool, arms as limbs), not a scaling rule", () => {
  const { drawnVolume, leanScore } = require('../tools/export_targets.js');
  const L = settings.limits, main = limitsRun.templates.find((t) => t.id === L.main_template);
  const r = calc.compute({ buildId: L.main_template, heightM: 1.8 }), g = {};
  for (const s of BC.SITES) g[s] = r.girths[s].value;
  const base = Fig.human(outline, 1.8, g, {}, { buttockFit: BC.FRUSTUM.M.buttock, armDeg: 35 });
  for (const k of ['arms', 'thighs', 'face']) {
    const f = main[k].f, mk = (deg) => Fig.human(outline, 1.8, g, {}, { buttockFit: BC.FRUSTUM.M.buttock, widthScale: f, legAxis: base.dims.legAxis, armDeg: deg });
    const deg = Math.min(88, Math.max(35, Fig.armRestAngle(mk) + 2)), fig = mk(deg);
    near(leanScore(drawnVolume(fig, 1.8, deg, 600), 1.8) / main[k].score, 1, 0.02, k + ' limit score vs a fresh reading at another resolution:');
    // The head, hands, feet and joints are not widened, so the drawn shape grows more slowly than f^2.
    assert.ok(main[k].score < main.score_at_f1 * f * f, k + ' grows more slowly than f^2');
  }
  // The arms as limbs match the measuring tool where it follows them: the tool reads a little high
  // (it counts each arm at torso depth where it meets the shoulder), never low.
  const fig1 = Fig.human(outline, 1.8, g, {}, { buttockFit: BC.FRUSTUM.M.buttock, armDeg: 35 });
  const { measureViews, levelsOf } = require('../tools/export_targets.js');
  const tool = measureViews({ front: fig1.front, side: fig1.side }, 1.8, levelsOf(fig1), 800).res;
  const ratio = tool.volume_m3.value / drawnVolume(fig1, 1.8, 35, 800);
  assert.ok(ratio > 1 && ratio < 1.08, 'tool / drawn volume at 35 degrees: ' + ratio.toFixed(3));
});

test('the steep face model is derived from its fact: k where bend falls to the limit, on the drawn arm and forearm girths', () => {
  const sf = settings.limits.face.steep_fit, F = require('../data/facts.json').facts[sf.fact].values;
  assert.strictEqual(sf.c, F.c_active); assert.strictEqual(sf.p, F.p_fitted_to_bmi_groups_active); assert.strictEqual(sf.reference_girth_sum_m, F.reference_girth_sum_m);
  const k = Math.pow(Math.tan(40 * Math.PI / 180) / sf.c, 1 / sf.p);
  near(k, 1.785, 0.002, 'k at 100 degrees:');
  const r = calc.compute({ buildId: 'ansur2_m_p50', heightM: 1.8 });
  const face = limitsRun.items.find((i) => i.id === 'face');
  near(face.models.steep_width_factor, k * sf.reference_girth_sum_m / (r.girths.arm_flexed.value + r.girths.forearm.value), 1e-3);
});

test("the chart's own figures: arms drawn past their rest angle clear the body, and the tests match the stored flags", () => {
  const L = settings.limits;
  for (const id of ['ansur2_m_p50', 'ronnie_coleman', 'hulk_savage']) {
    const e = model.all().find((x) => x.id === id), c = limitsRun.chart_figures[id], g = {};
    for (const s of BC.SITES) g[s] = e.girths[s].value;
    const mk = (deg) => Fig.human(outline, e.height.value, g, {}, { buttockFit: BC.FRUSTUM.M.buttock, armDeg: deg });
    near(Fig.armRestAngle(mk), c.rest_deg, 0.1, id + ' rest angle');
    const drawn = Math.max(20, c.rest_deg + 2);
    assert.ok(Fig.armClearAt(mk(drawn), drawn), id + ' arms clear at the drawn angle, ' + drawn + ' degrees');
    if (c.rest_deg > 0) assert.ok(!Fig.armClearAt(mk(c.rest_deg - 2), c.rest_deg - 2), id + ' arms pass through the body just inside the rest angle');
    const fig = mk(c.drawn_arm_deg), crease = limitsRun.elbow_crease_fraction_of_upper_arm * fig.dims.armStations.Lu;
    assert.strictEqual(c.arms, Fig.armRestAngle(mk) >= L.arms.angle_deg, id + ' arms flag');
    assert.strictEqual(c.thighs, Fig.thighContact(fig) >= L.thighs.fraction, id + ' thighs flag');
    assert.strictEqual(c.face, Fig.elbowFlexion(fig, crease) < L.face.max_flexion_deg, id + ' face flag');
  }
  // Ronnie Coleman's own outline already meets the arms and thighs tests; the median soldier's meets neither.
  assert.ok(limitsRun.chart_figures.ronnie_coleman.arms && limitsRun.chart_figures.ronnie_coleman.thighs);
  assert.ok(!limitsRun.chart_figures.ansur2_m_p50.arms && !limitsRun.chart_figures.ansur2_m_p50.thighs);
  const arms = limitsRun.items.find((i) => i.id === 'arms');
  assert.ok(arms.met_by.includes('ronnie_coleman') && !arms.met_by.includes('ansur2_m_p50'));
});

test('the target solver converges on drawn scores, and says when it cannot', () => {
  const { templateScore } = require('../tools/export_targets.js');
  const at = (id) => (f) => templateScore(id, 1.8, f, 300);
  for (const [id, t] of [['ansur2_m_p50', 20], ['ansur2_m_p50', 217], ['ansur2_m_p50', 900], ['ansur2_m_p5', 15], ['ronnie_coleman', 300]]) {
    const s = Fig.solveTarget(at(id), t); assert.ok(s.f > 0, id + ' reaches ' + t); near(s.score / t, 1, 0.003, id + ' target ' + t + ':');
  }
  // Out of reach: says so, with how far it got.
  const far = Fig.solveTarget(at('ansur2_m_p50'), 2000, 3);
  assert.strictEqual(far.f, null); assert.strictEqual(far.reason, 'range'); assert.ok(far.bestScore < 2000);
  // A score that jumps across the target is reported as a gap, never as a hit.
  const jump = Fig.solveTarget((f) => (f < 2 ? 50 * f : 150 * f), 120);
  assert.strictEqual(jump.f, null); assert.strictEqual(jump.reason, 'gap'); assert.ok(jump.bestScore < 120 && jump.nextScore > 120);
  // A failing sheet inside the bracket is not taken for one above the target.
  const holey = Fig.solveTarget((f) => (f > 1.3 && f < 1.5 ? NaN : 30 * f * f), 60);
  assert.ok(holey.f == null || Math.abs(holey.score / 60 - 1) <= 0.003, JSON.stringify(holey));
  // A plain function: false position closes in fast.
  let n = 0; const sq = Fig.solveTarget((f) => { n++; return 27 * Math.pow(f, 1.9); }, 300);
  near(sq.score / 300, 1, 0.002); assert.ok(n <= 12, n + ' evaluations');
});

test('the measuring tool follows arms held far out, with no jump in the score as they rise', () => {
  const { measureTemplate } = require('../tools/export_targets.js');
  let last = null;
  for (const f of [1.70, 1.72, 1.74, 1.745, 1.75, 1.76, 1.78, 1.80]) {
    const r = measureTemplate('ansur2_m_p50', 1.8, f, 600).res;
    assert.ok(r.landmarks.arms.every(Boolean), 'both arms followed at f ' + f);
    if (last) assert.ok(Math.abs(r.score.value / last - 1) < 0.03, 'no jump at f ' + f + ': ' + last.toFixed(1) + ' to ' + r.score.value.toFixed(1));
    last = r.score.value;
  }
  // Arms that cannot hang clear (level, at 88 degrees) are refused, not counted as torso.
  const lvl = measureTemplate('ansur2_m_p50', 1.8, 2.6, 600).res;
  assert.ok(!lvl.ok && lvl.checks.some((c) => /arms followed/.test(c.name) && !c.ok), 'level arms refused');
});

test('front and back views that mirror each other pass the landmark check (flat profiles included)', () => {
  const { measureTemplate } = require('../tools/export_targets.js');
  for (const [id, f] of [['ansur2_m_largest_arm', 1.05], ['ansur2_m_p95', 1.4], ['ansur2_m_p5', 0.79], ['ansur2_m_p50', 1]]) {
    const r = measureTemplate(id, 1.8, f, 1000).res;
    const c = r.checks.find((x) => /front and back landmarks/.test(x.name));
    assert.ok(c && c.ok, id + ' f ' + f + ': ' + (c ? c.detail : 'no back-view check'));
  }
});

console.log('\n' + passed + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
