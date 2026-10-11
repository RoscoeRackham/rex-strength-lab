// Are the sheets compute_limits.js reads (800 px) accepted by the tool's own checks?
const T = process.argv[2];
const Fig = require(T + '/build-comparison/src/figure.js');
const { measureTemplate } = require(T + '/build-comparison/tools/export_targets.js');
const L = require(T + '/build-comparison/data/limits.json');
const show = (r) => r.ok ? 'pass' : 'FAIL: ' + r.checks.filter((c) => !c.ok).map((c) => c.name.slice(0, 40) + ' [' + c.detail + ']').join('; ');
for (const t of L.templates) {
  for (const k of [null, 'arms', 'thighs', 'face']) {
    const f = k ? t[k].f : 1;
    const r = measureTemplate(t.id, 1.8, f, 800).res;
    console.log(t.id.padEnd(22), (k || 'f=1').padEnd(7), 'f=' + f.toFixed(4), 'score ' + r.score.value.toFixed(2), 'stored ' + (k ? t[k].score : t.score_at_f1), show(r));
  }
}
// The page's example sheet at 700 px (with refinement on, as the page measures it)
