// Score of the median-soldier target drawing against the width factor, near where the tool stops finding the arms.
const path = require('path');
const B = path.join(__dirname, 'tree');
const BC = require(B + '/build-calculator/src/calc.js');
const Fig = require(B + '/build-comparison/src/figure.js');
const M = require(B + '/build-comparison/src/measure.js');
const T = require(B + '/build-comparison/data/outline.json');
const calc = BC.create(require(B + '/build-calculator/data/builds.json'));
const id = process.argv[2] || 'ansur2_m_p50';
const r0 = calc.compute({ buildId: id, heightM: 1.8 }), gs = {}; BC.SITES.forEach((s) => { gs[s] = r0.girths[s].value; });
const H = 1.8, fit = BC.FRUSTUM.M.buttock, base = Fig.human(T, H, gs, {}, { buttockFit: fit, armDeg: 35 });
const y = base.dims.levels, lv = { shoulder: y.acromion, chest: y.chest, waist: y.waist, crotch: y.crotch, knee: y.knee };
const make = (f, deg) => Fig.human(T, H, gs, {}, { buttockFit: fit, armDeg: deg, widthScale: f, legAxis: base.dims.legAxis });
for (let f = 1.68; f <= 1.80; f += 0.01) {
  const rest = Fig.armRestAngle((d) => make(f, d)), deg = Math.max(35, rest + 2), fig = make(f, deg);
  const out = [];
  for (const px of [300, 1000]) {
    const img = Fig.renderSheet({ front: fig.front, side: fig.side }, H, lv, { figurePx: px });
    const r = M.measureSheet(img, { heightM: H, heightRef: 'skull', skullRows: Fig.sheetSkullRows(img, H), density: 1060, bodyFatPct: 7.5, order: ['front', 'side', 'back'], seg: { refine: 0 } });
    out.push(px + 'px ' + r.score.value.toFixed(1) + (r.ok ? '' : ' FAIL') + ' arms ' + r.volume_m3.parts.arms.toFixed(4) + (r.landmarks.arms.filter(Boolean).length ? ' (' + r.landmarks.arms.filter(Boolean).map((a) => a.angleDeg.toFixed(0)).join(',') + ' deg)' : ''));
  }
  console.log('f ' + f.toFixed(2) + ' drawn at ' + deg.toFixed(1) + ' | ' + out.join(' | '));
}
