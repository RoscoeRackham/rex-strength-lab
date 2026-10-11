// Where the body stops working: three functional limits found by geometry on drawn template
// figures whose widths and depths are scaled up at fixed bones (the joints stay where they are).
// Writes data/limits.json. Run from build-comparison/: node tools/compute_limits.js
//
// For each template build (data/settings.json, limits.templates) and each limit, it finds the
// width factor f at which the limit is reached, then reads the score of that drawn shape with the
// measuring tool (density 1,060 kg/m^3, 7.5% fat, like Rex, Ollie and the meatball). The shape is
// measured, not scaled by f^2: the head, hands, feet, shoulder line and leg axes are not widened,
// and widened thighs merge, so the volume grows more slowly than f^2.
//
// It also runs the three tests on every chart build's own figure (at its own height and girths),
// records which already meet each test, and records each figure's arm rest angle (the page draws
// the arms there, so they never pass through the body).
'use strict';
const fs = require('fs');
const path = require('path');
const BC = require('../../build-calculator/src/calc.js');
const builds = require('../../build-calculator/data/builds.json');
const Compare = require('../src/model.js');
const Fig = require('../src/figure.js');
const T = require('../data/outline.json');
const { measureViews } = require('./export_targets.js');
const settings = require('../data/settings.json');

const H = 1.8;
const calc = BC.create(builds);
const model = Compare.create(calc, settings);
const L = settings.limits;
const round = (x, d) => Math.round(x * Math.pow(10, d)) / Math.pow(10, d);

/** A template at 1.80 m: make(f, armDeg) draws it with every width and depth times f. */
function maker(id) {
  const r = calc.compute({ buildId: id, heightM: H });
  const g = {}; for (const s of BC.SITES) g[s] = r.girths[s].value;
  const opts = (extra) => Object.assign({ buttockFit: BC.FRUSTUM.M.buttock }, extra);
  const base = Fig.human(T, H, g, {}, opts({ armDeg: 35 }));
  const make = (f, armDeg) => Fig.human(T, H, g, {}, opts({ widthScale: f, legAxis: base.dims.legAxis, armDeg: armDeg }));
  const y = base.dims.levels;
  return { base, make, levels: { shoulder: y.acromion, chest: y.chest, waist: y.waist, crotch: y.crotch, knee: y.knee } };
}
/** The tool's reading of the drawn shape at width factor f: arms at 35 degrees (the middle of the
 * sheet A-pose), or where the body lets them rest if that is wider. */
function scoreAt(m, f) {
  const rest = Fig.armRestAngle((deg) => m.make(f, deg));
  const fig = m.make(f, Math.max(35, rest + 2));
  const r = measureViews({ front: fig.front, side: fig.side }, H, m.levels, 800).res;
  if (!r.score) throw new Error('the measuring tool could not read a template at f = ' + f);
  return r.score.value;
}
/** Shrink a figure's polygons for the page: metres to 3 decimals, every other point. */
function slimParts(parts) {
  return parts.map((p) => ({ name: p.name, mark: 'average', poly: p.poly.filter((q, i) => i % 2 === 0).map((q) => [round(q[0], 3), round(q[1], 3)]) }));
}

function run() {
  // The elbow crease (the stretch next to the elbow where skin folds instead of stopping the bend)
  // is set once, on the ordinary man: the length that lets the median soldier bend to the normal
  // maximum. It is a fraction of the upper arm, so it stays with the bones for every template.
  const mainBase = maker(L.main_template).base;
  let lo = 0.1, hi = 0.8;
  for (let i = 0; i < 30; i++) { const mid = (lo + hi) / 2; if (Fig.elbowFlexion(mainBase, mid * mainBase.dims.armStations.Lu) < L.face.normal_max_flexion_deg) lo = mid; else hi = mid; }
  const creaseFrac = hi;
  const per = [];
  for (const id of L.templates) {
    const m = maker(id);
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
  const mainM = maker(L.main_template);
  // The face limit also has a pessimistic bound: the same contact model with flexion falling as
  // steeply as it does across BMI groups (research fact elbow_flexion_vs_girth_wedge_model: 100 deg
  // at 1.786 times the reference arm girth). Measured on the widened median soldier.
  const wedge = L.face.pessimistic_girth_factor;
  const faceLow = wedge ? round(scoreAt(mainM, wedge), 2) : null;

  // Every chart build's own figure, at its own height and girths (Rex and Ollie are traced, not posable).
  const chart = {};
  for (const e of model.all()) {
    if (e.group === 'Rex and Ollie') continue;
    const g = {}; for (const s of BC.SITES) g[s] = e.girths[s].value;
    const mk = (deg) => Fig.human(T, e.height.value, g, {}, { buttockFit: BC.FRUSTUM.M.buttock, armDeg: deg });
    const fig = mk(20);
    const rest = Fig.armRestAngle(mk);
    chart[e.id] = {
      rest_deg: round(rest, 1),
      arms: rest >= L.arms.angle_deg,
      thighs: Fig.thighContact(fig) >= L.thighs.fraction,
      face: Fig.elbowFlexion(fig, creaseFrac * fig.dims.armStations.Lu) < L.face.max_flexion_deg,
      score: round(e.score.value, 2),
    };
  }
  const metBy = (k) => Object.keys(chart).filter((id) => chart[id][k]).sort((a, b) => chart[a].score - chart[b].score);

  const items = ['arms', 'thighs', 'face'].map((k) => {
    const scores = per.map((p) => p[k] && p[k].score).filter((x) => x != null);
    if (k === 'face' && faceLow != null) scores.push(faceLow);
    // Drawn with the arms where the outlines let them rest (at least the chart's 20 degrees).
    const rest = Fig.armRestAngle((deg) => mainM.make(main[k].f, deg));
    const fig = mainM.make(main[k].f, Math.max(20, Math.min(80, rest)));
    return Object.assign({}, L[k].text, {
      id: k, score: main[k].score, range: [Math.min.apply(null, scores), Math.max.apply(null, scores)],
      // false when the place depends on an untested model choice: then the page shows only the band.
      headline: L[k].headline !== false,
      models: k === 'face' && faceLow != null ? { contact_geometry: main[k].score, steep_bmi_fit: faceLow } : undefined,
      met_by: metBy(k),
      arm_rest_angle_deg: round(rest, 1), figure: { H, parts: slimParts(fig.front) },
    });
  });
  return {
    about: 'Computed by tools/compute_limits.js from data/settings.json (limits) and the templates drawn by src/figure.js. Do not edit by hand.',
    status: 'estimate', verdict: L.verdict, method: L.method, notes: L.notes,
    elbow_crease_fraction_of_upper_arm: round(creaseFrac, 4),
    definitions: { arms_angle_deg: L.arms.angle_deg, thighs_fraction: L.thighs.fraction, normal_max_flexion_deg: L.face.normal_max_flexion_deg, max_flexion_deg: L.face.max_flexion_deg, density_kg_m3: 1060, fat_pct: 7.5, height_m: H },
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
