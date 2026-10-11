// Claims F21: tool example (median soldier "at 1.80 m") vs limits card score_at_f1.
const R = process.argv[2];
const BC = require(R + '/build-calculator/src/calc.js');
const builds = require(R + '/build-calculator/data/builds.json');
const Compare = require(R + '/build-comparison/src/model.js');
const Fig = require(R + '/build-comparison/src/figure.js');
const M = require(R + '/build-comparison/src/measure.js');
const T = require(R + '/build-comparison/data/outline.json');
const settings = require(R + '/build-comparison/data/settings.json');
const L = require(R + '/build-comparison/data/limits.json');
const calc = BC.create(builds), model = Compare.create(calc, settings);
const e = model.all().find((x) => x.id === 'ansur2_m_p50');
const own = {}, at18 = {};
const r18 = calc.compute({ buildId: 'ansur2_m_p50', heightM: 1.8 });
for (const s of BC.SITES) { own[s] = e.girths[s].value; at18[s] = r18.girths[s].value; }
console.log('height of build', e.height.value, 'chest own', own.chest, 'chest at 1.8', at18.chest);
function meas(g, px, refine) {
  const f = Fig.human(T, 1.8, g, {}, { buttockFit: BC.FRUSTUM.M.buttock, armDeg: 35 });
  const y = f.dims.levels;
  const img = Fig.renderSheet({ front: f.front, side: f.side }, 1.8, { shoulder: y.acromion, chest: y.chest, waist: y.waist, crotch: y.crotch, knee: y.knee }, { figurePx: px });
  const opts = { heightM: 1.8, heightRef: 'top', order: ['front','side','back'], density: 1060, bodyFatPct: 7.5, armK: 1 };
  if (refine != null) opts.seg = { refine };
  const r = M.measureSheet(img, opts);
  return r.score.value.toFixed(2) + ' (mass ' + r.mass_kg.value.toFixed(1) + ' kg, ok ' + r.ok + ')';
}
console.log('limits card score_at_f1:', L.templates[0].score_at_f1);
console.log('page example (own girths, 700 px, default refine):', meas(own, 700));
console.log('own girths, 800 px refine 0:', meas(own, 800, 0));
console.log('own girths, 1600 px refine 0:', meas(own, 1600, 0));
console.log('girths at 1.80 m, 700 px default refine:', meas(at18, 700));
console.log('girths at 1.80 m, 800 px refine 0:', meas(at18, 800, 0));
console.log('ratio (1.8/H)^2 =', (1.8 / e.height.value) ** 2);
