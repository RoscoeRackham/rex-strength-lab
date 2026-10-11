const T = process.argv[2];
const path = require('path');
const png = require(T + '/build-comparison/tools/png.js');
const M = require(T + '/build-comparison/src/measure.js');
const Fig = require(T + '/build-comparison/src/figure.js');
const BC = require(T + '/build-calculator/src/calc.js');
const data = require(T + '/build-calculator/data/builds.json');
const TT = require(T + '/build-comparison/data/outline.json');
function sheet(buildId, H, f, px) {
  const model = BC.create(data);
  const r = model.compute({ buildId, heightM: H });
  const g = {}; for (const s of BC.SITES) g[s] = r.girths[s].value;
  const base = Fig.human(TT, H, g, {}, { buttockFit: BC.FRUSTUM.M.buttock, armDeg: 35 });
  const make = (deg) => Fig.human(TT, H, g, {}, { buttockFit: BC.FRUSTUM.M.buttock, widthScale: f, legAxis: base.dims.legAxis, armDeg: deg });
  const fig = make(Math.max(35, Fig.armRestAngle(make) + 2));
  const y = base.dims.levels;
  return Fig.renderSheet({ front: fig.front, side: fig.side }, H, { shoulder: y.acromion, chest: y.chest, waist: y.waist, crotch: y.crotch, knee: y.knee }, { figurePx: px });
}
const out = process.argv[3];
const big = sheet('ansur2_m_p50', 1.8, 1.5, 2000); png.write(out + '/big-2000.png', big);
const small = sheet('ansur2_m_p50', 1.8, 1.0, 500); png.write(out + '/small-500.png', small);
console.log('big', big.width, big.height, 'small', small.width, small.height);
for (const [n, im] of [['big', big], ['small', small]]) {
  const t0 = Date.now();
  const r = M.measureSheet(im, { heightM: 1.8, heightRef: 'top', density: 1060, bodyFatPct: 7.5, armK: 1, order: ['front','side','back'] });
  console.log(n, 'vol', r.volume_m3 && r.volume_m3.value.toFixed(3), 'mass', r.mass_kg && r.mass_kg.value.toFixed(1), 'ok', r.ok, 'ms', Date.now() - t0);
}
