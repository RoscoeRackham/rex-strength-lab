// The limit readings in compute_limits.js: arms drawn at max(35, rest + 2). Are the arms found on each limit sheet?
const T = process.argv[2];
const Fig = require(T + '/build-comparison/src/figure.js'); const M = require(T + '/build-comparison/src/measure.js');
const BC = require(T + '/build-calculator/src/calc.js'); const calc = BC.create(require(T + '/build-calculator/data/builds.json'));
const outline = require(T + '/build-comparison/data/outline.json'); const L = require(T + '/build-comparison/data/limits.json');
const isArm = (p) => /(upper arm|forearm|hand)$/.test(p.name);
for (const t of L.templates) {
  const r = calc.compute({ buildId: t.id, heightM: 1.8 }), g = {}; BC.SITES.forEach((s) => { g[s] = r.girths[s].value; });
  const base = Fig.human(outline, 1.8, g, {}, { buttockFit: BC.FRUSTUM.M.buttock, armDeg: 35 }); const y = base.dims.levels;
  const lv = { shoulder: y.acromion, chest: y.chest, waist: y.waist, crotch: y.crotch, knee: y.knee };
  for (const k of ['arms', 'thighs', 'face']) {
    const f = t[k].f, mk = (d) => Fig.human(outline, 1.8, g, {}, { buttockFit: BC.FRUSTUM.M.buttock, widthScale: f, legAxis: base.dims.legAxis, armDeg: d });
    const deg = Math.max(35, Fig.armRestAngle(mk) + 2), fig = mk(deg);
    const opt = { heightM: 1.8, heightRef: 'skull', density: 1060, bodyFatPct: 7.5, seg: { refine: 0 } };
    const img = Fig.renderSheet({ front: fig.front, side: fig.side }, 1.8, lv, { figurePx: 800 });
    const res = M.measureSheet(img, Object.assign({ skullRows: Fig.sheetSkullRows(img, 1.8) }, opt));
    const img0 = Fig.renderSheet({ front: fig.front.filter((p) => !isArm(p)), side: fig.side }, 1.8, lv, { figurePx: 800 });
    const r0 = M.measureSheet(img0, Object.assign({ skullRows: Fig.sheetSkullRows(img0, 1.8) }, opt));
    const w = img.width, h = img.height;
    const mkM = (parts) => { const b = { width: w, height: h, data: new Uint8ClampedArray(w * h * 4) }; Fig.fillParts(b, parts, img.k, img.views[0], img.ground, [255, 255, 255]); const m = new Uint8Array(w * h); for (let i = 0; i < m.length; i++) m[i] = b.data[i * 4] > 128 ? 1 : 0; return m; };
    const allM = mkM(fig.front), bodyM = mkM(fig.front.filter((p) => !isArm(p)));
    const Lm = new Uint8Array(w * h), Rm = new Uint8Array(w * h), cx = img.views[0];
    for (let i = 0; i < w * h; i++) if (allM[i] && !bodyM[i]) ((i % w) < cx ? Lm : Rm)[i] = 1;
    const armV = (M.sliceRotated(Rm, w, h, 1, deg) + M.sliceRotated(Lm, w, h, 1, -deg)) * res.scale.mPerPx ** 3;
    const ratio = res.volume_m3.value / (r0.volume_m3.value + armV);
    console.log(t.id.padEnd(22), k.padEnd(6), 'f ' + f.toFixed(3), 'arms drawn at ' + deg.toFixed(1) + ' deg, found ' + res.landmarks.arms.filter(Boolean).length + ', tool arm volume ' + res.volume_m3.parts.arms.toFixed(4), '| stored score ' + t[k].score + ', tool / (no-arm + sliced arms) = ' + ratio.toFixed(3) + ' -> ' + (t[k].score / ratio).toFixed(1));
  }
}
