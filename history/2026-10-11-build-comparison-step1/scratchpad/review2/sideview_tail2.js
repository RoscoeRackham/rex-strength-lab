// Rex as a Step 2 sheet would be: no tail over the legs in the front and back views (spec fix),
// tail kept in the side view (it is part of him; the page tool cannot exclude it).
const path = require('path');
const B = path.join(__dirname, 'tree', 'build-comparison');
const M = require(B + '/src/measure.js');
const png = require(B + '/tools/png.js');
const RD = require(B + '/tools/trace_turnarounds.js').READINGS;
for (const name of ['rex', 'ollie']) {
  const R = RD[name], img = png.read(path.join(B, R.file));
  const ex = {}, skull = {};
  for (const v of R.order) { ex[v] = v !== 'side' && R.views[v].tail ? [R.views[v].tail] : []; skull[v] = R.views[v].skull; }
  const r = M.measureSheet(img, { heightM: 3, skullRows: skull, order: R.order, exclude: ex, seg: { ignore: R.ignore } });
  const c = r.checks.find((x) => /side view is a side view/.test(x.name));
  console.log(name, 'tail only in the side view:', c ? (c.ok ? 'pass' : 'FAIL') + ' ' + c.detail : 'no check', '| errors:', r.errors.filter((e) => /side view is/.test(e)).length);
}
