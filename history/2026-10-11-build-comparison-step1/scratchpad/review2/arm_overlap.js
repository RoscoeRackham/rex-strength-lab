// For every chart figure drawn as the page draws it (arms at max(20, rest + 2)), the area where the
// left arm (beyond 0.35 of the upper arm from the shoulder joint, like the test) overlaps the body
// outline: below the chest line (what armClearAt tests) and above it (what it skips).
const path = require('path');
const B = path.join(__dirname, 'tree');
const BC = require(B + '/build-calculator/src/calc.js');
const Fig = require(B + '/build-comparison/src/figure.js');
const T = require(B + '/build-comparison/data/outline.json');
const LIM = require(B + '/build-comparison/data/limits.json');
const settings = require(B + '/build-comparison/data/settings.json');
const Compare = require(B + '/build-comparison/src/model.js');
const calc = BC.create(require(B + '/build-calculator/data/builds.json'));
const model = Compare.create(calc, settings);
const rows = [];
for (const e of model.all()) {
  if (e.group === 'Rex and Ollie') continue;
  const c = LIM.chart_figures[e.id], deg = Math.max(20, c.rest_deg + 2);
  const g = {}; for (const s of BC.SITES) g[s] = e.girths[s].value;
  const fig = Fig.human(T, e.height.value, g, {}, { buttockFit: BC.FRUSTUM.M.buttock, armDeg: deg });
  const d = fig.dims, sj = d.shoulderJoint, near = 0.35 * d.armStations.Lu, yc = d.levels.chest;
  const ax = Math.sin(deg * Math.PI / 180), ay = -Math.cos(deg * Math.PI / 180);
  const body = fig.front.find((p) => p.name === 'body').poly;
  const arm = fig.front.filter((p) => /^left (upper arm|forearm|hand)$/.test(p.name)).map((p) => p.poly);
  const b = Fig.bounds(fig.front), step = e.height.value / 1500;
  let below = 0, above = 0, armArea = 0;
  for (let x = 0; x <= b[2]; x += step) for (let y = b[1]; y <= b[3]; y += step) {
    if (!arm.some((p) => Fig.pointInPoly([x, y], p))) continue;
    if ((x - sj[0]) * ax + (y - sj[1]) * ay <= near) continue;
    armArea++;
    if (Fig.pointInPoly([x, y], body)) { if (y < yc) below++; else above++; }
  }
  rows.push([e.id, deg.toFixed(1), (100 * below / armArea).toFixed(1) + '%', (100 * above / armArea).toFixed(1) + '%']);
}
rows.sort((a, b) => parseFloat(b[3]) - parseFloat(a[3]));
console.log('id drawnDeg overlapBelowChest overlapAboveChest (share of the tested arm area)');
rows.forEach((r) => console.log(r.join('  ')));
