// Same target shape (median soldier, widths x f), measured with the arms at 20 deg (tools/export_targets.js
// and compute_limits.js) and at 35 deg (the page's target outline and the sheet spec's 30-40 deg A-pose).
const BCD = '/home/user/rex-strength-lab/build-comparison';
const Fig = require(BCD + '/src/figure.js'), M = require(BCD + '/src/measure.js');
const BC = require('/home/user/rex-strength-lab/build-calculator/src/calc.js');
const calc = BC.create(require('/home/user/rex-strength-lab/build-calculator/data/builds.json'));
const T = require(BCD + '/data/outline.json');
const r = calc.compute({ buildId: 'ansur2_m_p50', heightM: 1.8 }), g = {}; for (const s of BC.SITES) g[s] = r.girths[s].value;
const base = Fig.human(T, 1.8, g, {}, { buttockFit: BC.FRUSTUM.M.buttock });
const y = base.dims.levels, lv = { shoulder: y.acromion, chest: y.chest, waist: y.waist, crotch: y.crotch, knee: y.knee };
for (const f of [1, 2.139]) for (const deg of [20, 35]) {
  const fig = Fig.human(T, 1.8, g, {}, { buttockFit: BC.FRUSTUM.M.buttock, widthScale: f, legAxis: base.dims.legAxis, armDeg: deg });
  const img = Fig.renderSheet({ front: fig.front, side: fig.side }, 1.8, lv, { figurePx: 1000 });
  const t = Date.now();
  const res = M.measureSheet(img, { heightM: 1.8, heightRef: 'top', density: 1060, bodyFatPct: 7.5 });
  console.log('f', f, 'arms', deg + 'deg', 'score', res.score.value.toFixed(1), 'arms found', res.landmarks.arms.map((a) => !!a).join('/'), 'warnings:', res.warnings.filter((w) => /arm/.test(w)).join(' | ').slice(0, 160), (Date.now() - t) + ' ms');
}
