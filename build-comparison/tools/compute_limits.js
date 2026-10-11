// Where the body stops working: three functional limits found by geometry on drawn template
// figures whose widths and depths are scaled up at fixed bones (the joints stay where they are).
// Writes data/limits.json. Run from build-comparison/: node tools/compute_limits.js
//
// For each template build (data/settings.json, limits.templates) and each limit, it finds the
// width factor f at which the limit is reached, then scores that drawn shape (density 1,060 kg/m^3,
// 7.5% fat, like Rex, Ollie and the meatball). The shape is measured, not scaled by f^2: the head,
// hands, feet, shoulder line and leg axes are not widened, and widened thighs merge, so the volume
// grows more slowly than f^2.
//
// How a drawn shape is measured (drawnVolume): the measuring tool reads the head and body from the
// front and side views, and the arms are added as round limbs along their own axis (Figure.armVolume).
// The tool cannot follow arms that stand far out (it would count them as torso), and even where it
// does, it counts the arm at torso depth where it meets the shoulder, a few percent high.
//
// It also draws every chart build's own figure (at its own height and girths, with the arms where
// the page draws them), runs the three tests on it, scores that outline the same way, and stores
// its drawn volume for the page's drawing check.
'use strict';
const fs = require('fs');
const path = require('path');
const BC = require('../../build-calculator/src/calc.js');
const builds = require('../../build-calculator/data/builds.json');
const Compare = require('../src/model.js');
const Fig = require('../src/figure.js');
const T = require('../data/outline.json');
const { drawnVolume, leanScore: lean } = require('./export_targets.js');
const settings = require('../data/settings.json');

const H = 1.8, RHO = 1060, FAT = 7.5, ARM_MAX = 88;
const calc = BC.create(builds);
const model = Compare.create(calc, settings);
const L = settings.limits;
const round = (x, d) => Math.round(x * Math.pow(10, d)) / Math.pow(10, d);
const leanScore = (V, h) => lean(V, h);

/** A template at 1.80 m: make(f, armDeg) draws it with every width and depth times f. */
function maker(id) {
  const r = calc.compute({ buildId: id, heightM: H });
  const g = {}; for (const s of BC.SITES) g[s] = r.girths[s].value;
  const opts = (extra) => Object.assign({ buttockFit: BC.FRUSTUM.M.buttock }, extra);
  const base = Fig.human(T, H, g, {}, opts({ armDeg: 35 }));
  const make = (f, armDeg) => Fig.human(T, H, g, {}, opts({ widthScale: f, legAxis: base.dims.legAxis, armDeg: armDeg }));
  return { base, make, girths: g };
}
/** Arms at 35 degrees (the middle of the sheet A-pose), or just past where the body lets them rest. */
const armsFor = (rest, low) => Math.min(ARM_MAX, Math.max(low, rest + 2));
function scoreAt(m, f) {
  const deg = armsFor(Fig.armRestAngle((d) => m.make(f, d)), 35);
  return leanScore(drawnVolume(m.make(f, deg), H, deg, 800), H);
}
/** Slim a figure's polygons for the page: metres to 3 decimals, every other point. */
function slimParts(parts) {
  return parts.map((p) => ({ name: p.name, mark: 'average', poly: p.poly.filter((q, i) => i % 2 === 0).map((q) => [round(q[0], 3), round(q[1], 3)]) }));
}
/** The girths that decide each test. */
const DECIDING = { arms: ['arm_flexed', 'chest', 'waist'], thighs: ['thigh'], face: ['arm_flexed', 'forearm'] };

function run() {
  // The elbow crease (the stretch next to the elbow where skin folds instead of stopping the bend)
  // is set once, on the ordinary man: the length that lets the median soldier bend to the normal
  // maximum. It is a fraction of the upper arm, so it stays with the bones for every template.
  const mainM = maker(L.main_template), mainBase = mainM.base;
  let lo = 0.1, hi = 0.8;
  for (let i = 0; i < 30; i++) { const mid = (lo + hi) / 2; if (Fig.elbowFlexion(mainBase, mid * mainBase.dims.armStations.Lu) < L.face.normal_max_flexion_deg) lo = mid; else hi = mid; }
  const creaseFrac = hi;
  const per = [];
  for (const id of L.templates) {
    const m = id === L.main_template ? mainM : maker(id);
    const S1 = scoreAt(m, 1);
    const row = { id, name: calc.byId[id].name, score_at_f1: round(S1, 2) };
    const crease = creaseFrac * m.base.dims.armStations.Lu;
    row.elbow_flexion_at_f1_deg = round(Fig.elbowFlexion(m.base, crease), 1);
    const armAt = (f) => Fig.armRestAngle((deg) => m.make(f, deg));
    row.arm_rest_angle_at_f1_deg = round(armAt(1), 1);
    const reached = {
      arms: (x) => armAt(x) >= L.arms.angle_deg,
      thighs: (x) => Fig.thighContact(m.make(x)) >= L.thighs.fraction,
      face: (x) => Fig.elbowFlexion(m.make(x), crease) < L.face.max_flexion_deg,
    };
    for (const k of ['arms', 'thighs', 'face']) {
      const f = Fig.solveScale((x) => x, reached[k], 0.3, 8);
      row[k] = f == null ? null : { f: round(f, 4), score: round(scoreAt(m, f), 2) };
    }
    per.push(row);
    console.log(id.padEnd(24), 'S(f=1) ' + S1.toFixed(1), ['arms', 'thighs', 'face'].map((k) => k + ' ' + (row[k] ? row[k].score.toFixed(1) + ' (f ' + row[k].f.toFixed(2) + ')' : 'none')).join(', '));
  }
  const main = per.find((p) => p.id === L.main_template);
  // The face limit's steep model: elbow bend falling as fast as it does across BMI groups (research
  // fact elbow_flexion_vs_girth_wedge_model: tan((180 - phi) / 2) = c * k^p, k = (flexed arm + forearm
  // girth) / reference sum). The width factor that brings the median soldier's drawn arm and forearm
  // girths (at 1.80 m) to the k where phi falls to the limit.
  const sf = L.face.steep_fit;
  const kLimit = Math.pow(Math.tan((180 - L.face.max_flexion_deg) / 2 * Math.PI / 180) / sf.c, 1 / sf.p);
  const fSteep = kLimit * sf.reference_girth_sum_m / (mainM.girths.arm_flexed + mainM.girths.forearm);
  const faceLow = round(scoreAt(mainM, fSteep), 2);

  // Every chart build's own figure, at its own height and girths (Rex and Ollie are traced, not posable).
  const chart = {};
  for (const e of model.all()) {
    if (e.group === 'Rex and Ollie') continue;
    const g = {}; for (const s of BC.SITES) g[s] = e.girths[s].value;
    const h = e.height.value;
    const mk = (deg) => Fig.human(T, h, g, {}, { buttockFit: BC.FRUSTUM.M.buttock, armDeg: deg });
    const rest = Fig.armRestAngle(mk);
    const drawnDeg = armsFor(rest, 20), fig = mk(drawnDeg), V = drawnVolume(fig, h, drawnDeg, 600);
    const own = {};
    for (const k of Object.keys(DECIDING)) {
      const t = DECIDING[k].map((s) => e.girths[s]).find((x) => x.kind !== 'own');
      own[k] = t ? t.owner : 'own';
    }
    chart[e.id] = {
      rest_deg: round(rest, 1),
      drawn_arm_deg: round(drawnDeg, 1),
      arms: rest >= L.arms.angle_deg,
      thighs: Fig.thighContact(fig) >= L.thighs.fraction,
      face: Fig.elbowFlexion(fig, creaseFrac * fig.dims.armStations.Lu) < L.face.max_flexion_deg,
      // The face limit's steep model: past it when arm plus forearm girth reaches the limit's k.
      face_steep: (g.arm_flexed + g.forearm) / sf.reference_girth_sum_m >= kLimit,
      score: round(e.score.value, 2),
      volume_m3: round(V, 4),
      outline_score: round(leanScore(V, h), 2),
      girths_from: own,
    };
  }
  const metBy = (k) => Object.keys(chart).filter((id) => chart[id][k]).sort((a, b) => chart[a].outline_score - chart[b].outline_score);

  const items = ['arms', 'thighs', 'face'].map((k) => {
    const scores = per.map((p) => p[k] && p[k].score).filter((x) => x != null);
    if (k === 'face') scores.push(faceLow);
    // Drawn with the arms where the outlines let them rest (at least the chart's 20 degrees).
    const rest = Fig.armRestAngle((deg) => mainM.make(main[k].f, deg));
    const fig = mainM.make(main[k].f, armsFor(rest, 20));
    return Object.assign({}, L[k].text, {
      id: k, score: main[k].score, range: [Math.min.apply(null, scores), Math.max.apply(null, scores)],
      // false when the place depends on an untested model choice: then the page shows only the band.
      headline: L[k].headline !== false,
      models: k === 'face' ? { contact_geometry: main[k].score, steep_bmi_fit: faceLow, steep_width_factor: round(fSteep, 4), steep_girth_sum_m: round(kLimit * sf.reference_girth_sum_m, 3) } : undefined,
      met_by: metBy(k),
      met_by_steep_model: k === 'face' ? metBy('face_steep') : undefined,
      arm_rest_angle_deg: round(rest, 1), figure: { H, parts: slimParts(fig.front) },
    });
  });
  return {
    about: 'Computed by tools/compute_limits.js from data/settings.json (limits) and the templates drawn by src/figure.js. Do not edit by hand.',
    status: 'estimate', verdict: L.verdict, method: L.method, notes: L.notes,
    elbow_crease_fraction_of_upper_arm: round(creaseFrac, 4),
    definitions: { arms_angle_deg: L.arms.angle_deg, thighs_fraction: L.thighs.fraction, normal_max_flexion_deg: L.face.normal_max_flexion_deg, max_flexion_deg: L.face.max_flexion_deg, density_kg_m3: RHO, fat_pct: FAT, height_m: H, arm_max_deg: ARM_MAX },
    templates: per, items,
    chart_figures: chart,
  };
}

if (require.main === module) {
  const out = run();
  fs.writeFileSync(path.join(__dirname, '..', 'data', 'limits.json'), JSON.stringify(out) + '\n');
  console.log('wrote data/limits.json');
}
module.exports = { run };
