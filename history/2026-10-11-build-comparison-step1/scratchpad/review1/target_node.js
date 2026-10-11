// The page's drawTarget in Node: why does the outline miss the target, and does iterating at the final size fix it?
const BCD = '/home/user/rex-strength-lab/build-comparison';
const Fig = require(BCD + '/src/figure.js'), M = require(BCD + '/src/measure.js');
const BC = require('/home/user/rex-strength-lab/build-calculator/src/calc.js');
const calc = BC.create(require('/home/user/rex-strength-lab/build-calculator/data/builds.json'));
const T = require(BCD + '/data/outline.json');
function make(id) {
  const r0 = calc.compute({ buildId: id, heightM: 1.8 }), gs = {}; for (const s of BC.SITES) gs[s] = r0.girths[s].value;
  const base = Fig.human(T, 1.8, gs, {}, { buttockFit: BC.FRUSTUM.M.buttock, armDeg: 35 });
  const y = base.dims.levels, lv = { shoulder: y.acromion, chest: y.chest, waist: y.waist, crotch: y.crotch, knee: y.knee };
  return (f, px) => { const fig = Fig.human(T, 1.8, gs, {}, { buttockFit: BC.FRUSTUM.M.buttock, armDeg: 35, widthScale: f, legAxis: base.dims.legAxis });
    const img = Fig.renderSheet({ front: fig.front, side: fig.side }, 1.8, lv, { figurePx: px });
    return M.measureSheet(img, { heightM: 1.8, heightRef: 'top', density: 1060, bodyFatPct: 7.5, seg: { refine: 0 } }).score.value; };
}
for (const [id, tv] of [['ansur2_m_p50', 200], ['ronnie_coleman', 300], ['ronnie_coleman', 900]]) {
  const sAt = make(id);
  // the page: two steps at 400 px, then the final drawing at 1000 px
  let f = Math.sqrt(tv / sAt(1, 400)); f *= Math.sqrt(tv / sAt(f, 400)); const page = sAt(f, 1000);
  // iterate (secant on log score vs log f) at 1000 px
  let f0 = f, s0 = page, f1 = f * Math.sqrt(tv / page), s1 = sAt(f1, 1000);
  for (let i = 0; i < 6 && Math.abs(s1 / tv - 1) > 0.01; i++) { const k = Math.log(s1 / s0) / Math.log(f1 / f0); const f2 = f1 * Math.pow(tv / s1, 1 / (isFinite(k) && k > 0.2 ? k : 2)); f0 = f1; s0 = s1; f1 = f2; s1 = sAt(f1, 1000); }
  console.log(id, 'target', tv, '| page method: f', f.toFixed(3), 'measures', page.toFixed(1), '(' + ((page / tv - 1) * 100).toFixed(1) + '%) | iterated at 1000 px: f', f1.toFixed(3), 'measures', s1.toFixed(1), '(' + ((s1 / tv - 1) * 100).toFixed(1) + '%)', '| 400 px reading at the page f:', sAt(f, 400).toFixed(1));
}
