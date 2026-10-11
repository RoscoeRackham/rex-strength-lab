// The page's drawTarget, run in Node with the same modules: solve at 300 px, then up to two sqrt steps at 1,000 px.
const T = process.argv[2];
const Fig = require(T + '/build-comparison/src/figure.js');
const { measureTemplate, scoreOrNaN } = require(T + '/build-comparison/tools/export_targets.js');
const ids = (process.argv[3] || 'ansur2_m_p5').split(','), targets = (process.argv[4] || '15,18,20,22,23,24,25,28,30,35,40').split(',').map(Number);
for (const id of ids) for (const tv of targets) {
  const sol = Fig.solveTarget((f) => scoreOrNaN(measureTemplate(id, 1.8, f, 300).res), tv);
  if (sol.f == null) { console.log(id, tv, 'REFUSED by solver:', sol.reason, 'bestF', sol.bestF, 'best', sol.bestScore); continue; }
  let f = sol.f, out = measureTemplate(id, 1.8, f, 1000).res;
  for (let i = 0; i < 2 && out.ok && Math.abs(out.score.value / tv - 1) > 0.005; i++) { f *= Math.sqrt(tv / out.score.value); out = measureTemplate(id, 1.8, f, 1000).res; }
  if (!out.ok) { console.log(id, tv, 'solver f=' + sol.f.toFixed(4) + ' (300px score ' + sol.score.toFixed(2) + ') -> PAGE REFUSES at 1000 px: ' + out.checks.filter((c) => !c.ok).map((c) => c.name.slice(0, 35) + ' [' + c.detail + ']').join('; ')); continue; }
  console.log(id, tv, 'solver f=' + sol.f.toFixed(4) + ' (300px ' + sol.score.toFixed(2) + ') -> page shows f=' + f.toFixed(3) + ' measures ' + out.score.value.toFixed(2) + ' (miss ' + ((out.score.value / tv - 1) * 100).toFixed(2) + '%)');
}
