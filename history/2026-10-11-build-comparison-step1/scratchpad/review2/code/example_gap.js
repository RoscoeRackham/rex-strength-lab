// Why does the page's example (25.7) differ from the limits' reading of the same shape (27.3)?
const T = process.argv[2];
const Fig = require(T + '/build-comparison/src/figure.js'); const M = require(T + '/build-comparison/src/measure.js');
const BC = require(T + '/build-calculator/src/calc.js'); const calc = BC.create(require(T + '/build-calculator/data/builds.json'));
const outline = require(T + '/build-comparison/data/outline.json');
const Compare = require(T + '/build-comparison/src/model.js'); const settings = require(T + '/build-comparison/data/settings.json');
const model = Compare.create(calc, settings);
const e = model.all().find((x) => x.id === 'ansur2_m_p50');
const gPage = {}; BC.SITES.forEach((s) => { gPage[s] = e.girths[s].value; });
const r = calc.compute({ buildId: 'ansur2_m_p50', heightM: 1.8 }), gL = {}; BC.SITES.forEach((s) => { gL[s] = r.girths[s].value; });
console.log('girths page example (own height ' + e.height.value + ' m):', JSON.stringify(gPage)); console.log('girths limits (scaled to 1.8 m):', JSON.stringify(gL));
for (const [name, g] of [['page girths', gPage], ['limits girths', gL]]) {
  const f = Fig.human(outline, 1.8, g, {}, { buttockFit: BC.FRUSTUM.M.buttock, armDeg: 35 }); const y = f.dims.levels;
  const lv = { shoulder: y.acromion, chest: y.chest, waist: y.waist, crotch: y.crotch, knee: y.knee };
  for (const px of [700, 800]) for (const refine of [0, 2]) {
    const img = Fig.renderSheet({ front: f.front, side: f.side }, 1.8, lv, { figurePx: px });
    const m = M.measureSheet(img, { heightM: 1.8, heightRef: 'top', density: 1060, bodyFatPct: 7.5, seg: { refine } });
    console.log(name, px + 'px', 'refine ' + refine, 'score ' + m.score.value.toFixed(2));
  }
}
