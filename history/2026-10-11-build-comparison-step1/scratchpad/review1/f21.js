const root = '/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/review1/head/';
const BC = require(root + 'build-calculator/src/calc.js');
const builds = require(root + 'build-calculator/data/builds.json');
const Fig = require(root + 'build-comparison/src/figure.js');
const M = require(root + 'build-comparison/src/measure.js');
const T = require(root + 'build-comparison/data/outline.json');
const Compare = require(root + 'build-comparison/src/model.js'); const settings = require(root + 'build-comparison/data/settings.json'); const model = Compare.create(BC.create(builds), { builds: settings.builds, fat_classes: settings.fat_classes });
const calc = BC.create(builds);
const H = 1.8;
function girthsAt(h) { const r = calc.compute({ buildId: 'ansur2_m_p50', heightM: h }); const g = {}; for (const s of BC.SITES) g[s] = r.girths[s].value; return g; }
const own = (() => { const e = (model.evaluate ? model.evaluate('ansur2_m_p50') : null); const g = {}; for (const s of BC.SITES) g[s] = e.girths[s].value; return g; })();
const g18 = girthsAt(1.8);
console.log('own-height girths', JSON.stringify(own)); console.log('girths at 1.8', JSON.stringify(g18));
function score(g, armDeg, px) {
  const opt = { buttockFit: BC.FRUSTUM.M.buttock }; if (armDeg != null) opt.armDeg = armDeg;
  const f = Fig.human(T, H, g, {}, opt); const y = f.dims.levels;
  const img = Fig.renderSheet({ front: f.front, side: f.side }, H, { shoulder: y.acromion, chest: y.chest, waist: y.waist, crotch: y.crotch, knee: y.knee }, { figurePx: px });
  const r = M.measureSheet(img, { heightM: H, heightRef: 'top', density: 1060, bodyFatPct: 7.5, order: ['front', 'side', 'back'] });
  return r.score.value.toFixed(2) + ' (mass ' + r.mass_kg.value.toFixed(1) + ')';
}
for (const [name, g] of [['own girths', own], ['girths at 1.8', g18]]) for (const a of [null, 35]) for (const px of [700, 800]) console.log(name.padEnd(14), 'arm', String(a).padEnd(5), 'px', px, score(g, a, px));
