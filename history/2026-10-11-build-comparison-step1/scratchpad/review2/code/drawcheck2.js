// Cleaner check: tool volume of the drawn figure vs (tool volume without arms) + arms sliced across their own axis (sliceRotated, round).
const T = process.argv[2];
const Fig = require(T + '/build-comparison/src/figure.js'); const M = require(T + '/build-comparison/src/measure.js');
const BC = require(T + '/build-calculator/src/calc.js'); const calc = BC.create(require(T + '/build-calculator/data/builds.json'));
const outline = require(T + '/build-comparison/data/outline.json'); const Compare = require(T + '/build-comparison/src/model.js');
const model = Compare.create(calc, require(T + '/build-comparison/data/settings.json')); const LIM = require(T + '/build-comparison/data/limits.json');
const only = process.argv[3] ? process.argv[3].split(',') : null;
const maskOf = (img) => { const m = new Uint8Array(img.width * img.height); for (let i = 0; i < m.length; i++) m[i] = img.data[i * 4] < 128 ? 1 : 0; return m; };
for (const e of model.all()) {
  if (e.group === 'Rex and Ollie' || (only && !only.includes(e.id))) continue;
  const c = LIM.chart_figures[e.id]; const deg = Math.max(35, c ? Math.max(20, c.rest_deg + 2) : 20);
  const g = {}; BC.SITES.forEach((s) => { g[s] = e.girths[s].value; });
  const H = e.height.value, f = Fig.human(outline, H, g, {}, { buttockFit: BC.FRUSTUM.M.buttock, armDeg: deg }), y = f.dims.levels;
  const lv = { shoulder: y.acromion, chest: y.chest, waist: y.waist, crotch: y.crotch, knee: y.knee };
  const opt = { heightM: H, heightRef: 'top', density: 1000, bodyFatPct: 0, seg: { refine: 0 } };
  const isArm = (p) => /(upper arm|forearm|hand)$/.test(p.name);
  const full = Fig.renderSheet({ front: f.front, side: f.side }, H, null, { figurePx: 600 });
  const r = M.measureSheet(Fig.renderSheet({ front: f.front, side: f.side }, H, lv, { figurePx: 600 }), opt);
  const r0 = M.measureSheet(Fig.renderSheet({ front: f.front.filter((p) => !isArm(p)), side: f.side }, H, lv, { figurePx: 600 }), opt);
  // arms alone, same layout (renderSheet places views by their bounds, so draw arms + body and subtract the body)
  const body = maskOf(Fig.renderSheet({ front: f.front.filter((p) => !isArm(p)), side: f.side, back: f.front.filter((p) => !isArm(p)).map((p) => ({ name: p.name, mark: p.mark, poly: p.poly.map((q) => [-q[0], q[1]]) })) }, H, null, { figurePx: 600 }));
  const all = maskOf(full);
  // only valid if both sheets share a layout: check the widths match
  const fv = r.views.front, w = full.width, h = full.height;
  const left = new Uint8Array(w * h), right = new Uint8Array(w * h), cx = (fv.x0 + fv.x1) / 2;
  let sameLayout = Fig.renderSheet({ front: f.front.filter((p) => !isArm(p)), side: f.side, back: f.front.filter((p) => !isArm(p)).map((p) => ({ name: p.name, mark: p.mark, poly: p.poly.map((q) => [-q[0], q[1]]) })) }, H, null, { figurePx: 600 }).width === w;
  for (let yy = 0; yy < h; yy++) for (let x = fv.x0; x <= fv.x1; x++) { const i = yy * w + x; if (all[i] && !body[i]) (x < cx ? left : right)[i] = 1; }
  const mpp = r.scale.mPerPx, armV = (M.sliceRotated(right, w, h, 1, -deg) + M.sliceRotated(left, w, h, 1, deg)) * mpp * mpp * mpp;
  const correct = r0.volume_m3.value + armV;
  const fat = e.bodyFat.value / 100, rho = 1000 / (fat / 0.9007 + (1 - fat) / 1.1);
  console.log(e.id.padEnd(26), 'arms ' + deg.toFixed(1) + ' deg, found ' + r.landmarks.arms.filter(Boolean).length, '| tool ' + r.volume_m3.value.toFixed(4) + ' vs no-arm tool + sliced arms ' + correct.toFixed(4) + ' (' + ((r.volume_m3.value / correct - 1) * 100).toFixed(1) + '%)', '| page check ' + Math.round((r.volume_m3.value * rho / e.mass.value - 1) * 100) + '% -> ' + Math.round((correct * rho / e.mass.value - 1) * 100) + '%', sameLayout ? '' : '(LAYOUT DIFFERS: ignore)');
}
