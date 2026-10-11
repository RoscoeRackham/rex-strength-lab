const R = process.argv[2], S = process.argv[3];
const png = require(R + '/build-comparison/tools/png.js');
const Mn = require(R + '/build-comparison/src/measure.js');
const Mo = require('./measure_old.js');
const img = png.read(S + '/big2000.png');
for (const [k, M] of [['old', Mo], ['new', Mn], ['old', Mo], ['new', Mn]]) {
  let t = Date.now(); M.segment(img, { refine: 0 }); const t0 = Date.now() - t;
  t = Date.now(); M.segment(img, { refine: 2 }); const t2 = Date.now() - t;
  t = Date.now(); M.measureSheet(img, { heightM: 1.8, heightRef: 'top', seg: { refine: 0 } }); const tm0 = Date.now() - t;
  t = Date.now(); M.measureSheet(img, { heightM: 1.8, heightRef: 'top' }); const tm = Date.now() - t;
  console.log(k, 'segment refine0', t0, 'refine2', t2, '(refinement', t2 - t0, 'ms) | measureSheet refine0', tm0, 'default', tm);
}
