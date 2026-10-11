// The page's "Drawing check" (drawingCheck in app.html) for every chart figure: are the arms found,
// and how much volume do near-level arms add when the tool slices them as torso?
const T = process.argv[2];
const Fig = require(T + '/build-comparison/src/figure.js'); const M = require(T + '/build-comparison/src/measure.js');
const BC = require(T + '/build-calculator/src/calc.js'); const calc = BC.create(require(T + '/build-calculator/data/builds.json'));
const outline = require(T + '/build-comparison/data/outline.json'); const Compare = require(T + '/build-comparison/src/model.js');
const model = Compare.create(calc, require(T + '/build-comparison/data/settings.json')); const LIM = require(T + '/build-comparison/data/limits.json');
function radiusInt(st, L) { // integral of pi r^2 ds along stations, linear r
  let v = 0; for (let i = 1; i < st.length; i++) { const [s0, r0] = st[i - 1], [s1, r1] = st[i]; v += Math.PI * (s1 - s0) * (r0 * r0 + r0 * r1 + r1 * r1) / 3; } return v;
}
const rows = [];
for (const e of model.all()) {
  if (e.group === 'Rex and Ollie') continue;
  const c = LIM.chart_figures[e.id]; const armAngle = c ? Math.max(20, c.rest_deg + 2) : 20, deg = Math.max(35, armAngle);
  const g = {}; BC.SITES.forEach((s) => { g[s] = e.girths[s].value; });
  const H = e.height.value, f = Fig.human(outline, H, g, {}, { buttockFit: BC.FRUSTUM.M.buttock, armDeg: deg }), y = f.dims.levels;
  const lv = { shoulder: y.acromion, chest: y.chest, waist: y.waist, crotch: y.crotch, knee: y.knee };
  const opt = { heightM: H, heightRef: 'top', density: 1000, bodyFatPct: 0, seg: { refine: 0 } };
  const r = M.measureSheet(Fig.renderSheet({ front: f.front, side: f.side }, H, lv, { figurePx: 600 }), opt);
  const noArm = f.front.filter((p) => !/(upper arm|forearm|hand)$/.test(p.name));
  const r0 = M.measureSheet(Fig.renderSheet({ front: noArm, side: f.side }, H, lv, { figurePx: 600 }), opt);
  const st = f.dims.armStations, armsTrue = 2 * (radiusInt(st.upper) + radiusInt(st.fore));
  const fat = e.bodyFat.value / 100, rho = 1000 / (fat / 0.9007 + (1 - fat) / 1.1);
  const found = r.landmarks.arms.filter(Boolean).length;
  const extra = r.volume_m3.value - r0.volume_m3.value - armsTrue;
  rows.push([e.id, deg.toFixed(1), found, (r.volume_m3.parts.arms).toFixed(4), armsTrue.toFixed(4), (100 * extra / r.volume_m3.value).toFixed(1), Math.round((r.volume_m3.value * rho / e.mass.value - 1) * 100), Math.round(((r.volume_m3.value - Math.max(0, extra)) * rho / e.mass.value - 1) * 100)]);
}
console.log('id, arm deg drawn, arms found, tool arm m3, true arm m3 (upper+fore), unexplained extra % of volume, page drawing check %, check % without the extra');
rows.sort((a, b) => +b[1] - +a[1]).forEach((r) => console.log(r.join(', ')));
