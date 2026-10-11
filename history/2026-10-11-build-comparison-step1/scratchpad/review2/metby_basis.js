// The limits are scored from the drawn shape (tool reading, 1,060 kg/m^3, 7.5% fat); "met sooner"
// compares them with each figure's weight-based score at its own assumed fat. Score each met_by
// figure's own drawing the way the limits are scored.
const path = require('path');
const B = path.join(__dirname, 'tree');
const BC = require(B + '/build-calculator/src/calc.js');
const Fig = require(B + '/build-comparison/src/figure.js');
const M = require(B + '/build-comparison/src/measure.js');
const T = require(B + '/build-comparison/data/outline.json');
const LIM = require(B + '/build-comparison/data/limits.json');
const settings = require(B + '/build-comparison/data/settings.json');
const Compare = require(B + '/build-comparison/src/model.js');
const calc = BC.create(require(B + '/build-calculator/data/builds.json'));
const model = Compare.create(calc, settings);
for (const k of ['arms', 'thighs']) {
  const it = LIM.items.find((i) => i.id === k);
  console.log('== ' + k + ' limit ' + it.score + ' band ' + it.range.join('-'));
  for (const id of it.met_by.slice(0, 16)) {
    const e = model.all().find((x) => x.id === id), c = LIM.chart_figures[id];
    const g = {}; for (const s of BC.SITES) g[s] = e.girths[s].value;
    const H = e.height.value, deg = Math.max(35, c.rest_deg + 2);
    const f = Fig.human(T, H, g, {}, { buttockFit: BC.FRUSTUM.M.buttock, armDeg: deg }), y = f.dims.levels;
    const img = Fig.renderSheet({ front: f.front, side: f.side }, H, { shoulder: y.acromion, chest: y.chest, waist: y.waist, crotch: y.crotch, knee: y.knee }, { figurePx: 800 });
    const r = M.measureSheet(img, { heightM: H, heightRef: 'skull', skullRows: Fig.sheetSkullRows(img, H), density: 1060, bodyFatPct: 7.5, seg: { refine: 0 } });
    console.log(id.padEnd(24), 'page score', e.score.value.toFixed(1), 'at', e.bodyFat.value + '% fat | its drawing scored like the limits:', r.score.value.toFixed(1), r.volume_m3.parts.arms > 0 ? '' : '(arms not found)');
  }
}
