// Score vs width factor near the p50 target-80 solution: rest angle and measured score at 300 and 1,000 px.
const T = process.argv[2];
const Fig = require(T + '/build-comparison/src/figure.js');
const { templateViews, measureTemplate } = require(T + '/build-comparison/tools/export_targets.js');
const BC = require(T + '/build-calculator/src/calc.js'); const calc = BC.create(require(T + '/build-calculator/data/builds.json')); const outline = require(T + '/build-comparison/data/outline.json');
const id = process.argv[3] || 'ansur2_m_p50';
const r = calc.compute({ buildId: id, heightM: 1.8 }), g = {}; BC.SITES.forEach((s) => { g[s] = r.girths[s].value; });
const base = Fig.human(outline, 1.8, g, {}, { buttockFit: BC.FRUSTUM.M.buttock, armDeg: 35 });
for (const f of (process.argv[4] || '1.68,1.70,1.71,1.714,1.72,1.73,1.7408,1.75,1.77').split(',').map(Number)) {
  const mk = (d) => Fig.human(outline, 1.8, g, {}, { buttockFit: BC.FRUSTUM.M.buttock, widthScale: f, legAxis: base.dims.legAxis, armDeg: d });
  const rest = Fig.armRestAngle(mk);
  const a = measureTemplate(id, 1.8, f, 300).res, b = measureTemplate(id, 1.8, f, 1000).res;
  console.log('f=' + f.toFixed(4), 'rest ' + rest.toFixed(1) + ' deg, drawn at ' + Math.max(35, rest + 2).toFixed(1), '| 300px ' + a.score.value.toFixed(2) + (a.ok ? '' : ' FAIL'), '| 1000px ' + b.score.value.toFixed(2) + (b.ok ? '' : ' FAIL'));
}
