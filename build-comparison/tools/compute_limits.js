// Where the body stops working: three functional limits found by geometry on drawn template
// figures whose widths and depths are scaled up at fixed bones (the joints stay where they are).
// Writes data/limits.json. Run from build-comparison/: node tools/compute_limits.js
//
// For each template build (data/settings.json, limits.templates) and each limit, it finds the
// width factor f at which the limit is reached, then the score of that drawn shape: the template
// drawn at 1.80 m is measured with the measuring tool (density 1,060 kg/m^3, 7.5% fat, like Rex,
// Ollie and the meatball), and the score scales with f^2 because every width and depth scales by f.
'use strict';
const fs = require('fs');
const path = require('path');
const BC = require('../../build-calculator/src/calc.js');
const builds = require('../../build-calculator/data/builds.json');
const Fig = require('../src/figure.js');
const T = require('../data/outline.json');
const { measureTemplate } = require('./export_targets.js');
const settings = require('../data/settings.json');

const H = 1.8;
const calc = BC.create(builds);
const L = settings.limits;

function maker(id) {
  const r = calc.compute({ buildId: id, heightM: H });
  const g = {}; for (const s of BC.SITES) g[s] = r.girths[s].value;
  const base = Fig.human(T, H, g, {}, { buttockFit: BC.FRUSTUM.M.buttock });
  const make = (f, armDeg) => Fig.human(T, H, g, {}, { buttockFit: BC.FRUSTUM.M.buttock, widthScale: f, legAxis: base.dims.legAxis, armDeg: armDeg });
  return { base, make };
}

const round = (x, d) => Math.round(x * Math.pow(10, d)) / Math.pow(10, d);
/** Shrink a figure's polygons for the page: metres to 3 decimals, every other point. */
function slimParts(parts) {
  return parts.map((p) => ({ name: p.name, mark: 'average', poly: p.poly.filter((q, i) => i % 2 === 0).map((q) => [round(q[0], 3), round(q[1], 3)]) }));
}

function run() {
  const tests = {
    arms: null, // needs the figure rebuilt at each arm angle: set per template below
    thighs: (fig) => Fig.thighContact(fig) >= L.thighs.fraction,
    face: null, // set per template below (the crease is calibrated on the template itself)
  };
  // The elbow crease (the stretch next to the elbow where skin folds instead of stopping the bend)
  // is set once, on the ordinary man: the length that lets the median soldier bend to the normal
  // maximum. It is a fraction of the upper arm, so it stays with the bones for every template.
  const mainBase = maker(L.main_template).base;
  let lo = 0.1, hi = 0.8;
  for (let i = 0; i < 30; i++) { const mid = (lo + hi) / 2; if (Fig.elbowFlexion(mainBase, mid * mainBase.dims.armStations.Lu) < L.face.normal_max_flexion_deg) lo = mid; else hi = mid; }
  const creaseFrac = hi;
  const per = [];
  for (const id of L.templates) {
    const { base, make } = maker(id);
    const S1 = measureTemplate(id, H, 1, 800).res.score.value;
    const row = { id, name: calc.byId[id].name, score_at_f1: round(S1, 2) };
    const crease = creaseFrac * base.dims.armStations.Lu;
    row.elbow_flexion_at_f1_deg = round(Fig.elbowFlexion(base, crease), 1);
    const t = Object.assign({}, tests, { face: (fig) => Fig.elbowFlexion(fig, crease) < L.face.max_flexion_deg });
    const armAt = (f) => Fig.armRestAngle((deg) => make(f, deg));
    row.arm_rest_angle_at_f1_deg = round(armAt(1), 1);
    for (const k of ['arms', 'thighs', 'face']) {
      const f = k === 'arms' ? Fig.solveScale((x) => x, (x) => armAt(x) >= L.arms.angle_deg, 0.3, 8) : Fig.solveScale((x) => make(x), t[k], 0.3, 8);
      row[k] = f == null ? null : { f: round(f, 4), score: round(S1 * f * f, 2) };
    }
    per.push(row);
    console.log(id.padEnd(24), 'S(f=1) ' + S1.toFixed(1), ['arms', 'thighs', 'face'].map((k) => k + ' ' + (row[k] ? row[k].score.toFixed(1) + ' (f ' + row[k].f.toFixed(2) + ')' : 'none')).join(', '));
  }
  const main = per.find((p) => p.id === L.main_template);
  // The face limit also has a pessimistic bound: the same contact model with flexion falling as
  // steeply as it does across BMI groups (research fact elbow_flexion_vs_girth_wedge_model: 100 deg
  // at 1.8 times the reference arm girth instead of 2.7 times). It widens the band downwards.
  const wedge = L.face.pessimistic_girth_factor;
  const faceLow = wedge ? round(main.score_at_f1 * wedge * wedge, 2) : null;
  const items = ['arms', 'thighs', 'face'].map((k) => {
    const scores = per.map((p) => p[k] && p[k].score).filter((x) => x != null);
    if (k === 'face' && faceLow != null) scores.push(faceLow);
    const { make } = maker(L.main_template);
    // Drawn with the arms where the outlines let them rest (at least the chart's 20 degrees).
    const rest = Fig.armRestAngle((deg) => make(main[k].f, deg));
    const fig = make(main[k].f, Math.max(20, Math.min(80, rest)));
    return Object.assign({}, L[k].text, {
      id: k, score: main[k].score, range: [Math.min.apply(null, scores), Math.max.apply(null, scores)],
      // false when the place depends on an untested model choice: then the page shows only the band.
      headline: L[k].headline !== false,
      models: k === 'face' && faceLow != null ? { contact_geometry: main[k].score, steep_bmi_fit: faceLow } : undefined,
      arm_rest_angle_deg: round(rest, 1), figure: { H, parts: slimParts(fig.front) },
    });
  });
  return {
    about: 'Computed by tools/compute_limits.js from data/settings.json (limits) and the templates drawn by src/figure.js. Do not edit by hand.',
    status: 'estimate', verdict: L.verdict, method: L.method, notes: L.notes,
    elbow_crease_fraction_of_upper_arm: round(creaseFrac, 4),
    definitions: { arms_angle_deg: L.arms.angle_deg, thighs_fraction: L.thighs.fraction, normal_max_flexion_deg: L.face.normal_max_flexion_deg, max_flexion_deg: L.face.max_flexion_deg, density_kg_m3: 1060, fat_pct: 7.5, height_m: H },
    templates: per, items,
  };
}

if (require.main === module) {
  const out = run();
  fs.writeFileSync(path.join(__dirname, '..', 'data', 'limits.json'), JSON.stringify(out) + '\n');
  console.log('wrote data/limits.json');
}
module.exports = { run };
