const T = process.argv[2], id = process.argv[3], t = Number(process.argv[4]), px = Number(process.argv[5] || 300);
const Fig = require(T + '/build-comparison/src/figure.js');
const { measureTemplate, scoreOrNaN } = require(T + '/build-comparison/tools/export_targets.js');
const at = (f) => { const r = measureTemplate(id, 1.8, f, px).res; const s = scoreOrNaN(r); console.log('  f=' + f.toFixed(5), 'score=' + (r.score ? r.score.value.toFixed(3) : '-'), r.ok ? 'pass' : 'FAIL: ' + r.checks.filter((c) => !c.ok).map((c) => c.name + ' [' + c.detail + ']').join('; ') + ' ' + r.errors.filter((e) => !/^Rejected/.test(e)).join(' ')); return s; };
const sol = Fig.solveTarget(at, t);
console.log(JSON.stringify(sol));
