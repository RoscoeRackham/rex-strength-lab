const M = require(__dirname + '/head/build-comparison/src/measure.js');
console.log(Object.keys(M).filter(k => /slice|kProfile|frontOnly/.test(k)));
const w = 300, h = 300, mask = new Uint8Array(w * h);
for (let y = 100; y < 200; y++) for (let x = 50; x < 90; x++) mask[y * w + x] = 1;
const k = M.kProfile([[100, 1], [200, 0.5]]);
let exact = 0; for (let y = 100; y < 200; y++) exact += Math.PI / 4 * k(y) * 40 * 40;
console.log('exact', exact.toFixed(0), 'sliceRows', M.sliceRows(mask, w, h, k).toFixed(0));
for (const a of [0.001, 1, 10, 30]) console.log('sliceRotated', a, M.sliceRotated(mask, w, h, k, a).toFixed(0));
console.log('const k=0.75: rows', M.sliceRows(mask, w, h, 0.75).toFixed(0), 'rot0.001', M.sliceRotated(mask, w, h, 0.75, 0.001).toFixed(0));
