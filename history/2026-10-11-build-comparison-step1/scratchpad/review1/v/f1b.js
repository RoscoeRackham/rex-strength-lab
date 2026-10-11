const R = __dirname + '/head/build-comparison/';
const BC = require(__dirname + '/head/build-calculator/src/calc.js');
const builds = require(__dirname + '/head/build-calculator/data/builds.json');
const Fig = require(R + 'src/figure.js'), M = require(R + 'src/measure.js'), T = require(R + 'data/outline.json');
const H = 1.8, calc = BC.create(builds);
const r = calc.compute({ buildId: 'ansur2_m_p50', heightM: H }); const g = {}; for (const s of BC.SITES) g[s] = r.girths[s].value;
const base = Fig.human(T, H, g, {}, { buttockFit: BC.FRUSTUM.M.buttock });
const make = (f, d) => Fig.human(T, H, g, {}, { buttockFit: BC.FRUSTUM.M.buttock, widthScale: f, legAxis: base.dims.legAxis, armDeg: d });
const y = base.dims.levels;
for (const [f, px] of [[1, 800], [1, 2000], [1.2539, 2000], [1.3464, 2000], [1.786, 1600], [2.837, 1600]]) {
  const rest = Fig.armRestAngle((d) => make(f, d)); const fig = make(f, Math.max(20, Math.min(80, rest)));
  const img = Fig.renderSheet({ front: fig.front, side: fig.side }, H, { shoulder: y.acromion, chest: y.chest, waist: y.waist, crotch: y.crotch, knee: y.knee }, { figurePx: px });
  const m = M.measureSheet(img, { heightM: H, heightRef: 'top', density: 1060, bodyFatPct: 7.5, order: ['front', 'side', 'back'] });
  console.log('f', f, 'px', px, 'rest', rest.toFixed(1), 'measured', m.score.value.toFixed(2), 'f^2 x 26.98 =', (26.98 * f * f).toFixed(2), 'ok', m.ok);
}
