// Tool volume of the drawn figure (as the page's drawing check measures it) vs the tool's volume of the
// same figure without arms plus the arms' own volume sliced across their axis (sliceRotated, round sections).
const T = process.argv[2];
const Fig = require(T + '/build-comparison/src/figure.js'); const M = require(T + '/build-comparison/src/measure.js');
const BC = require(T + '/build-calculator/src/calc.js'); const calc = BC.create(require(T + '/build-calculator/data/builds.json'));
const outline = require(T + '/build-comparison/data/outline.json'); const Compare = require(T + '/build-comparison/src/model.js');
const model = Compare.create(calc, require(T + '/build-comparison/data/settings.json')); const LIM = require(T + '/build-comparison/data/limits.json');
const only = process.argv[3] ? process.argv[3].split(',') : null;
const isArm = (p) => /(upper arm|forearm|hand)$/.test(p.name);
const out = [];
for (const e of model.all()) {
  if (e.group === 'Rex and Ollie' || (only && !only.includes(e.id))) continue;
  const c = LIM.chart_figures[e.id]; const deg = Math.max(35, c ? Math.max(20, c.rest_deg + 2) : 20);
  const g = {}; BC.SITES.forEach((s) => { g[s] = e.girths[s].value; });
  const H = e.height.value, f = Fig.human(outline, H, g, {}, { buttockFit: BC.FRUSTUM.M.buttock, armDeg: deg }), y = f.dims.levels;
  const lv = { shoulder: y.acromion, chest: y.chest, waist: y.waist, crotch: y.crotch, knee: y.knee };
  const opt = { heightM: H, heightRef: 'top', density: 1000, bodyFatPct: 0, seg: { refine: 0 } };
  const img = Fig.renderSheet({ front: f.front, side: f.side }, H, lv, { figurePx: 600 });
  const r = M.measureSheet(img, opt);
  const r0 = M.measureSheet(Fig.renderSheet({ front: f.front.filter((p) => !isArm(p)), side: f.side }, H, lv, { figurePx: 600 }), opt);
  const w = img.width, h = img.height;
  const mk = (parts) => { const b = { width: w, height: h, data: new Uint8ClampedArray(w * h * 4) }; Fig.fillParts(b, parts, img.k, img.views[0], img.ground, [255, 255, 255]); const m = new Uint8Array(w * h); for (let i = 0; i < m.length; i++) m[i] = b.data[i * 4] > 128 ? 1 : 0; return m; };
  const allM = mk(f.front), bodyM = mk(f.front.filter((p) => !isArm(p)));
  const L = new Uint8Array(w * h), R = new Uint8Array(w * h), cx = img.views[0];
  for (let i = 0; i < w * h; i++) if (allM[i] && !bodyM[i]) ((i % w) < cx ? L : R)[i] = 1;
  const mpp = r.scale.mPerPx, armV = (M.sliceRotated(R, w, h, 1, deg) + M.sliceRotated(L, w, h, 1, -deg)) * mpp ** 3;
  const correct = r0.volume_m3.value + armV;
  const fat = e.bodyFat.value / 100, rho = 1000 / (fat / 0.9007 + (1 - fat) / 1.1);
  out.push([e.id, deg, r.landmarks.arms.filter(Boolean).length, r.volume_m3.value, correct, Math.round((r.volume_m3.value * rho / e.mass.value - 1) * 100), Math.round((correct * rho / e.mass.value - 1) * 100), r.volume_m3.parts.arms, armV]);
}
out.sort((a, b) => b[1] - a[1]).forEach((x) => console.log(x[0].padEnd(26), 'arms ' + x[1].toFixed(1) + ' deg, found ' + x[2], '| tool arms ' + x[7].toFixed(4) + ' m3, sliced arms ' + x[8].toFixed(4), '| tool total ' + x[3].toFixed(4) + ' vs no-arm + sliced arms ' + x[4].toFixed(4) + ' (' + ((x[3] / x[4] - 1) * 100).toFixed(1) + '%)', '| page drawing check ' + x[5] + '% -> ' + x[6] + '%'));
