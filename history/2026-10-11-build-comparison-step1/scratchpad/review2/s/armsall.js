const R = process.argv[2];
const BC = require(R + '/build-calculator/src/calc.js');
const builds = require(R + '/build-calculator/data/builds.json');
const Compare = require(R + '/build-comparison/src/model.js');
const Fig = require(R + '/build-comparison/src/figure.js');
const T = require(R + '/build-comparison/data/outline.json');
const settings = require(R + '/build-comparison/data/settings.json');
const L = require(R + '/build-comparison/data/limits.json');
const calc = BC.create(builds), model = Compare.create(calc, settings);
let bad = [];
for (const e of model.all()) {
  if (e.group === 'Rex and Ollie') continue;
  const c = L.chart_figures[e.id]; const g = {}; for (const s of BC.SITES) g[s] = e.girths[s].value;
  const mk = (deg) => Fig.human(T, e.height.value, g, {}, { buttockFit: BC.FRUSTUM.M.buttock, armDeg: deg });
  const drawn = Math.max(20, c.rest_deg + 2);
  const clear = Fig.armClearAt(mk(drawn), drawn);
  if (!clear) bad.push(e.id + ' drawn ' + drawn);
}
console.log('figures whose arms pass through the body at the drawn angle:', bad.length ? bad : 'none');
