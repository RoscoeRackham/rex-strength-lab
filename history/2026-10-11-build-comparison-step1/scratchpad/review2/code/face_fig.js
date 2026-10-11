const T = process.argv[2];
const Fig = require(T + '/build-comparison/src/figure.js'); const BC = require(T + '/build-calculator/src/calc.js');
const calc = BC.create(require(T + '/build-calculator/data/builds.json')); const outline = require(T + '/build-comparison/data/outline.json');
const L = require(T + '/build-comparison/data/limits.json');
const r = calc.compute({ buildId: 'ansur2_m_p50', heightM: 1.8 }), g = {}; BC.SITES.forEach((s) => { g[s] = r.girths[s].value; });
const base = Fig.human(outline, 1.8, g, {}, { buttockFit: BC.FRUSTUM.M.buttock, armDeg: 35 });
for (const it of L.items) {
  const f = L.templates.find((t) => t.id === 'ansur2_m_p50')[it.id].f;
  const mk = (d) => Fig.human(outline, 1.8, g, {}, { buttockFit: BC.FRUSTUM.M.buttock, widthScale: f, legAxis: base.dims.legAxis, armDeg: d });
  const drawn = Math.max(20, Math.min(80, it.arm_rest_angle_deg));
  console.log(it.id, 'f', f, 'rest', it.arm_rest_angle_deg, 'drawn at', drawn, 'clear at drawn angle:', Fig.armClearAt(mk(drawn), drawn), '| clear at 90:', Fig.armClearAt(mk(90), 90));
}
for (const it of L.items) {
  const f = L.templates.find((t) => t.id === 'ansur2_m_p50')[it.id].f;
  const mk = (d) => Fig.human(outline, 1.8, g, {}, { buttockFit: BC.FRUSTUM.M.buttock, widthScale: f, legAxis: base.dims.legAxis, armDeg: d });
  const rest = Fig.armRestAngle(mk), drawn = Math.max(20, Math.min(80, rest));
  console.log('exact:', it.id, 'rest', rest, 'drawn', drawn, 'clear', Fig.armClearAt(mk(drawn), drawn));
}
