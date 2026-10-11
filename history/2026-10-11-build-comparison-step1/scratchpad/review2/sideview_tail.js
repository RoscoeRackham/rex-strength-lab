// The side-view check on the real turnarounds, with and without their tails excluded (the page's
// tool has no way to exclude a tail).
const path = require('path');
const B = path.join(__dirname, 'tree', 'build-comparison');
const M = require(B + '/src/measure.js');
const png = require(B + '/tools/png.js');
const RD = require(B + '/tools/trace_turnarounds.js').READINGS;
for (const name of ['rex', 'ollie']) {
  const R = RD[name], img = png.read(path.join(B, R.file));
  for (const withTail of [false, true]) {
    const ex = {}, skull = {};
    for (const v of R.order) { ex[v] = !withTail && R.views[v].tail ? [R.views[v].tail] : []; skull[v] = R.views[v].skull; }
    const r = M.measureSheet(img, { heightM: 3, skullRows: skull, order: R.order, exclude: ex, seg: { ignore: R.ignore } });
    const c = r.checks.find((x) => /side view is a side view/.test(x.name));
    console.log(name, withTail ? 'tail kept   ' : 'tail removed', c ? (c.ok ? 'pass' : 'FAIL') + ' ' + c.detail : 'no check', '| rows waist', r.landmarks && r.landmarks.front.waist, 'crotch', r.landmarks && r.landmarks.front.crotch);
  }
  console.log(name, 'order', R.order.join(','), 'skull', JSON.stringify(R.order.map((v) => R.views[v].skull)));
}
