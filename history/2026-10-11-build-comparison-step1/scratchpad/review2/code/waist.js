// Waist row and girth from detection (no guide lines) vs the build's own waist, on sheets drawn from data.
const T = process.argv[2];
const Fig = require(T + '/build-comparison/src/figure.js'); const M = require(T + '/build-comparison/src/measure.js');
const BC = require(T + '/build-calculator/src/calc.js'); const calc = BC.create(require(T + '/build-calculator/data/builds.json'));
const outline = require(T + '/build-comparison/data/outline.json');
for (const id of ['ansur2_m_p50', 'ansur2_m_p5', 'ansur2_m_p95', 'ronnie_coleman', 'steve_reeves_1947', 'ansur2_m_largest_arm']) {
  const r = calc.compute({ buildId: id, heightM: 1.8 }), g = {}; BC.SITES.forEach((s) => { g[s] = r.girths[s].value; });
  const f = Fig.human(outline, 1.8, g, {}, { buttockFit: BC.FRUSTUM.M.buttock, armDeg: 35 }); const y = f.dims.levels;
  const lv = { shoulder: y.acromion, chest: y.chest, waist: y.waist, crotch: y.crotch, knee: y.knee };
  for (const lines of [true, false]) {
    const img = Fig.renderSheet({ front: f.front, side: f.side }, 1.8, lines ? lv : null, { figurePx: 1000 });
    const m = M.measureSheet(img, { heightM: 1.8, heightRef: 'skull', skullRows: Fig.sheetSkullRows(img, 1.8), seg: { refine: 0 } });
    const wr = m.landmarks.front.waist, frac = (img.ground - wr) / img.k / 1.8;
    console.log(id.padEnd(22), lines ? 'guide lines' : 'no lines   ', 'waist row at ' + frac.toFixed(3) + ' of stature (template waist ' + (y.waist / 1.8).toFixed(3) + ')', 'girth ' + (m.girths.waist.value_m * 100).toFixed(1) + ' cm vs build ' + (g.waist * 100).toFixed(1) + ' (' + ((m.girths.waist.value_m / g.waist - 1) * 100).toFixed(1) + '%)', m.ok ? 'pass' : 'FAIL ' + m.checks.filter((c) => !c.ok).map((c) => c.detail).join(';'));
  }
}
