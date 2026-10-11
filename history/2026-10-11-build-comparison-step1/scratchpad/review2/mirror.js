// The target tool draws the back view as the exact mirror of the front, yet some full-size sheets
// fail "front and back landmarks line up". Which landmark, and by how much?
const path = require('path');
const B = path.join(__dirname, 'tree');
const BC = require(B + '/build-calculator/src/calc.js');
const Fig = require(B + '/build-comparison/src/figure.js');
const M = require(B + '/build-comparison/src/measure.js');
const T = require(B + '/build-comparison/data/outline.json');
const calc = BC.create(require(B + '/build-calculator/data/builds.json'));
for (const [id, f] of [['ansur2_m_p5', 0.763], ['ansur2_m_p95', 1.424], ['ansur2_m_largest_arm', 1.037]]) {
  const r0 = calc.compute({ buildId: id, heightM: 1.8 }), gs = {}; BC.SITES.forEach((s) => { gs[s] = r0.girths[s].value; });
  const H = 1.8, fit = BC.FRUSTUM.M.buttock, base = Fig.human(T, H, gs, {}, { buttockFit: fit, armDeg: 35 });
  const y = base.dims.levels, lv = { shoulder: y.acromion, chest: y.chest, waist: y.waist, crotch: y.crotch, knee: y.knee };
  const make = (ff, deg) => Fig.human(T, H, gs, {}, { buttockFit: fit, armDeg: deg, widthScale: ff, legAxis: base.dims.legAxis });
  const fig = make(f, Math.max(35, Fig.armRestAngle((d) => make(f, d)) + 2));
  for (const px of [300, 1000, 2000]) {
    const img = Fig.renderSheet({ front: fig.front, side: fig.side }, H, lv, { figurePx: px });
    const r = M.measureSheet(img, { heightM: H, heightRef: 'skull', skullRows: Fig.sheetSkullRows(img, H), density: 1060, bodyFatPct: 7.5, order: ['front', 'side', 'back'], seg: { refine: 0 } });
    const c = r.checks.find((x) => /front and back/.test(x.name));
    console.log(id, 'f', f, px + 'px', c.ok ? 'ok' : 'FAIL', c.detail, '| score', r.score ? r.score.value.toFixed(2) : '-');
  }
}
