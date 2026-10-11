const T = process.argv[2], path = require('path');
const M = require(T + '/build-comparison/src/measure.js'); const png = require(T + '/build-comparison/tools/png.js');
const R = require(T + '/build-comparison/tools/trace_turnarounds.js').READINGS;
for (const name of ['rex', 'ollie']) {
  const r = R[name], img = png.read(path.join(T, 'build-comparison', r.file));
  const ex = {}, skull = {};
  for (const v of r.order) { ex[v] = r.views[v].tail ? [r.views[v].tail] : []; skull[v] = r.views[v].skull; }
  const m = M.measureSheet(img, { heightM: 3, skullRows: skull, order: r.order, exclude: ex, seg: { ignore: r.ignore } });
  console.log(name, 'order', r.order.join(','), 'tails in', Object.keys(ex).filter((k) => ex[k].length).join(','));
  m.checks.forEach((c) => console.log('   ', c.ok ? 'ok  ' : 'FAIL', c.name, '|', c.detail));
  const Fh = m.landmarks.front, B = m.landmarks.back;
  console.log('    front rows', JSON.stringify(Fh)); console.log('    back rows ', JSON.stringify(B));
}
