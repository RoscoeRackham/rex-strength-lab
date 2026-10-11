// How much of the face-limit reading is arm pixels read at torso depth?
const R = process.argv[2];
const BC = require(R + '/build-calculator/src/calc.js');
const builds = require(R + '/build-calculator/data/builds.json');
const Fig = require(R + '/build-comparison/src/figure.js');
const M = require(R + '/build-comparison/src/measure.js');
const T = require(R + '/build-comparison/data/outline.json');
const calc = BC.create(builds);
const r = calc.compute({ buildId: 'ansur2_m_p50', heightM: 1.8 }); const g = {}; for (const s of BC.SITES) g[s] = r.girths[s].value;
const base = Fig.human(T, 1.8, g, {}, { buttockFit: BC.FRUSTUM.M.buttock, armDeg: 35 });
const make = (f, deg) => Fig.human(T, 1.8, g, {}, { buttockFit: BC.FRUSTUM.M.buttock, widthScale: f, legAxis: base.dims.legAxis, armDeg: deg });
const y = base.dims.levels, lv = { shoulder: y.acromion, chest: y.chest, waist: y.waist, crotch: y.crotch, knee: y.knee };
console.log('part names:', make(1, 35).front.map((p) => p.name).join(', '));
const isArm = (p) => /arm|hand/.test(p.name);
function meas(views) {
  const img = Fig.renderSheet(views, 1.8, lv, { figurePx: 800 });
  const res = M.measureSheet(img, { heightM: 1.8, heightRef: 'skull', skullRows: Fig.sheetSkullRows(img, 1.8), density: 1060, bodyFatPct: 7.5, order: ['front','side','back'], seg: { refine: 0 } });
  return res;
}
const S = (v) => 1.8 * v * 1060 * 0.925 / Math.pow(1.8, 3);
for (const [f, deg] of [[1, 35], [1.2539, 35], [2.837, 92], [2.837, 60]]) {
  const fig = make(f, deg);
  const all = meas({ front: fig.front, side: fig.side });
  const noArm = meas({ front: fig.front.filter((p) => !isArm(p)), side: fig.side.filter((p) => !isArm(p)) });
  console.log('f', f, 'deg', deg, '| with arms: score', all.score.value.toFixed(1), 'arms part', (all.volume_m3.parts.arms * 1000).toFixed(1), 'L | arms removed: score', noArm.score.value.toFixed(1), 'ok', noArm.ok,
    '| tool arm contribution', (all.score.value - noArm.score.value).toFixed(1));
}
// Analytic arm volume at f=1 from the tool on a clean arm (arms found at 35 deg), scaled by f^2 (limbs widen by f; hands do not).
