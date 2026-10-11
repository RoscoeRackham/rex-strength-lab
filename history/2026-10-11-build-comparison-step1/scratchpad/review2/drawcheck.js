// Replicates the page's drawingCheck (details panel) for every chart figure, and compares the
// tool's volume of the drawing with (tool volume of the drawing without arms + arms by revolution).
const path = require('path');
const B = path.join(__dirname, 'tree');
const BC = require(B + '/build-calculator/src/calc.js');
const builds = require(B + '/build-calculator/data/builds.json');
const Fig = require(B + '/build-comparison/src/figure.js');
const M = require(B + '/build-comparison/src/measure.js');
const T = require(B + '/build-comparison/data/outline.json');
const LIM = require(B + '/build-comparison/data/limits.json');
const settings = require(B + '/build-comparison/data/settings.json');
const Compare = require(B + '/build-comparison/src/model.js');
const calc = BC.create(builds);
const model = Compare.create(calc, settings);
const rAt = (stn, s) => { if (s <= stn[0][0]) return stn[0][1]; for (let i = 1; i < stn.length; i++) if (s <= stn[i][0]) return stn[i - 1][1] + (stn[i][1] - stn[i - 1][1]) * (s - stn[i - 1][0]) / (stn[i][0] - stn[i - 1][0]); return stn[stn.length - 1][1]; };
function armVol(fig, deg) {
  const d = fig.dims, body = fig.front.find((p) => p.name === 'body').poly, st = d.armStations, sj = d.shoulderJoint;
  const a = deg * Math.PI / 180, dx = Math.sin(a), dy = -Math.cos(a), L = st.Lu + st.Lf, ds = L / 1000; let v = 0;
  for (let s = ds / 2; s < L; s += ds) {
    const p = [sj[0] + dx * s, sj[1] + dy * s], r = s <= st.Lu ? rAt(st.upper, s) : rAt(st.fore, s - st.Lu);
    let out = 0; const n = 15;
    for (let k = 0; k < n; k++) { const t = -1 + 2 * (k + 0.5) / n; if (!Fig.pointInPoly([p[0] + t * r * Math.cos(a), p[1] + t * r * Math.sin(a)], body)) out++; }
    v += Math.PI * r * r * ds * out / n;
  }
  const hs = [[0, d.wristR * 0.95], [0.35 * d.handL, d.handB * 0.36], [0.75 * d.handL, d.handB * 0.32], [d.handL * 0.95, d.handB * 0.22]];
  const dh = d.handL / 300; let vh = 0; for (let s = dh / 2; s < d.handL * 0.95; s += dh) { const r = rAt(hs, s); vh += Math.PI * r * r * dh; }
  return 2 * (v + vh);
}
const rows = [];
for (const e of model.all()) {
  if (e.group === 'Rex and Ollie') continue;
  const c = LIM.chart_figures[e.id]; const deg = Math.max(35, c ? Math.max(20, c.rest_deg + 2) : 20);
  const g = {}; for (const s of BC.SITES) g[s] = e.girths[s].value;
  const H = e.height.value, f = Fig.human(T, H, g, {}, { buttockFit: BC.FRUSTUM.M.buttock, armDeg: deg }), y = f.dims.levels;
  const lv = { shoulder: y.acromion, chest: y.chest, waist: y.waist, crotch: y.crotch, knee: y.knee };
  const meas = (front) => M.measureSheet(Fig.renderSheet({ front, side: f.side }, H, lv, { figurePx: 600 }), { heightM: H, heightRef: 'top', density: 1000, bodyFatPct: 0, seg: { refine: 0 } });
  const r = meas(f.front), bare = meas(f.front.filter((p) => !/arm|hand/.test(p.name)));
  const fat = e.bodyFat.value / 100, rho = 1000 / (fat / 0.9007 + (1 - fat) / 1.1);
  const pagePct = Math.round((r.volume_m3.value * rho / e.mass.value - 1) * 100);
  const alt = bare.volume_m3.value + armVol(f, deg);
  const altPct = Math.round((alt * rho / e.mass.value - 1) * 100);
  rows.push([e.id, deg.toFixed(1), (r.volume_m3.parts.arms).toFixed(4), pagePct, altPct]);
}
rows.sort((a, b) => b[3] - b[4] - (a[3] - a[4]));
console.log('id armDeg toolArmsM3 page% bare+revolution%');
rows.forEach((r) => console.log(r.join('  ')));
