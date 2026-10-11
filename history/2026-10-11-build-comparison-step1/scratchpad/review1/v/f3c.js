const R = __dirname + '/head/';
const BC = require(R + 'build-calculator/src/calc.js');
const builds = require(R + 'build-calculator/data/builds.json');
const Fig = require(R + 'build-comparison/src/figure.js');
const M = require(R + 'build-comparison/src/measure.js');
const T = require(R + 'build-comparison/data/outline.json');
const calc = BC.create(builds), H = 1.8;
function at(id, f, px) {
  const r0 = calc.compute({ buildId: id, heightM: H }), gs = {}; BC.SITES.forEach(s => gs[s] = r0.girths[s].value);
  const base = Fig.human(T, H, gs, {}, { buttockFit: BC.FRUSTUM.M.buttock, armDeg: 35 });
  const y = base.dims.levels, lv = { shoulder: y.acromion, chest: y.chest, waist: y.waist, crotch: y.crotch, knee: y.knee };
  const fig = Fig.human(T, H, gs, {}, { buttockFit: BC.FRUSTUM.M.buttock, armDeg: 35, widthScale: f, legAxis: base.dims.legAxis });
  const img = Fig.renderSheet({ front: fig.front, side: fig.side }, H, lv, { figurePx: px });
  const row = Math.round(img.ground - H * img.k);
  const r = M.measureSheet(img, { heightM: H, heightRef: 'skull', skullRows: { front: row, side: row, back: row }, density: 1060, bodyFatPct: 7.5, seg: { refine: 0 } });
  return { score: r.score && r.score.value, ok: r.ok, errs: r.errors };
}
for (const [id, f] of [['ronnie_coleman', 4.93], ['ronnie_coleman', 6.66], ['ansur2_m_p50', 7.17], ['ansur2_m_p50', 3.22]]) { const r = at(id, f, 1000); console.log(id, f, 'skull-ref score', (r.score||0).toFixed(1), 'ok', r.ok, r.errs.join(' | ').slice(0, 250)); }
