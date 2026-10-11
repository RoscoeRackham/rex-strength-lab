const Mnew = require(process.argv[2] + '/build-comparison/src/measure.js'), Mold = require(process.argv[3]);
const png = require(process.argv[2] + '/build-comparison/tools/png.js');
const img = png.read(process.argv[4]);
for (let rep = 0; rep < 2; rep++) for (const [n, M] of [['old', Mold], ['new', Mnew]]) {
  const t0 = Date.now(); const r = M.measureSheet(img, { heightM: 1.8, heightRef: 'top' }); const t = Date.now() - t0;
  console.log(n, img.width + 'x' + img.height, t + ' ms', 'vol ' + r.volume_m3.value.toFixed(5), 'heap MB ' + Math.round(process.memoryUsage().heapUsed / 1e6));
}
