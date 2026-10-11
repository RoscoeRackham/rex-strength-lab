// Scan Figure.solveTarget over the page's template shapes and a range of targets, as the page does (300 px).
const T = process.argv[2];
const Fig = require(T + '/build-comparison/src/figure.js');
const { measureTemplate, scoreOrNaN } = require(T + '/build-comparison/tools/export_targets.js');
const limits = require(T + '/build-comparison/data/limits.json');
const shapes = limits.templates.map((t) => t.id);
const targets = (process.argv[3] || '15,20,30,45,60,100,150,250,400,600,900').split(',').map(Number);
const only = process.argv[4] ? process.argv[4].split(',') : shapes;
for (const id of only) {
  const cache = new Map();
  const at = (f) => { const k = f.toPrecision(12); if (!cache.has(k)) cache.set(k, scoreOrNaN(measureTemplate(id, 1.8, f, 300).res)); return cache.get(k); };
  const s1 = at(1);
  for (const t of targets) {
    let n = 0; const t0 = Date.now();
    const sol = Fig.solveTarget((f) => { n++; return at(f); }, t);
    const miss = sol.f != null ? (sol.score / t - 1) * 100 : null;
    console.log(id.padEnd(22), 'S1=' + s1.toFixed(1), 'target', String(t).padStart(4), sol.f != null ? 'f=' + sol.f.toFixed(4) + ' score=' + sol.score.toFixed(2) + ' miss=' + miss.toFixed(2) + '%' : 'NONE ' + sol.reason + ' bestF=' + (sol.bestF && sol.bestF.toFixed(3)) + ' best=' + sol.bestScore, 'evals=' + n, (Date.now() - t0) + 'ms');
  }
}
