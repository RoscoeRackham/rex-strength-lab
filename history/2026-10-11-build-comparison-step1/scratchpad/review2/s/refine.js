// Code F5: per-view refinement vs whole-sheet refinement (old measure.js), same inputs.
const R = process.argv[2], S = process.argv[3];
const png = require(R + '/build-comparison/tools/png.js');
const Mn = require(R + '/build-comparison/src/measure.js');
const Mo = require('./measure_old.js');
const T = require(R + '/build-comparison/tools/trace_turnarounds.js').READINGS;
function cmp(lab, img, opts) {
  let t = Date.now(); const a = Mo.measureSheet(img, opts); const ta = Date.now() - t;
  t = Date.now(); const b = Mn.measureSheet(img, opts); const tb = Date.now() - t;
  let diff = 0; for (let i = 0; i < a.mask.length; i++) if (a.mask[i] !== b.mask[i]) diff++;
  console.log(lab, '| old', ta, 'ms vol', a.volume_m3 && a.volume_m3.value.toFixed(4), '| new', tb, 'ms vol', b.volume_m3 && b.volume_m3.value.toFixed(4), '| mask pixels differing', diff);
}
cmp('s700', png.read(S + '/s700.png'), { heightM: 1.8, heightRef: 'top' });
for (const name of ['rex', 'ollie']) {
  const Rr = T[name], img = png.read(R + '/build-comparison/' + Rr.file);
  const ex = {}, skull = {}; for (const v of Rr.order) { ex[v] = Rr.views[v].tail ? [Rr.views[v].tail] : []; skull[v] = Rr.views[v].skull; }
  cmp(name + ' turnaround', img, { heightM: 2.92, skullRows: skull, order: Rr.order, exclude: ex, seg: { ignore: Rr.ignore, refine: 2 } });
}
cmp('big2000', png.read(S + '/big2000.png'), { heightM: 1.8, heightRef: 'top' });
