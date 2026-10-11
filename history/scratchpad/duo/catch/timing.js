const X = require('./catch2.js');
const { P, K } = X;
require('/home/user/dino-strength-sim/src/data.js');
const DD = window.DINO_DATA;
const obj = (id) => DD.objects.find((o) => o.id === id);
const surf = (id) => DD.surfaces.find((s) => s.id === id);
const g = K.g;
const mk = (o) => Object.assign({ F: 100 * 907.18474 * g, mode: 'comic', body: P.makeBody({}), surface: surf('concrete'), groundHolds: false, anchor: 'friction' }, o || {});
for (const id of ['baseball', 'car', 'tank', 'pyramid']) {
  for (const mode of ['comic', 'real']) {
    const t0 = Date.now(); X.releaseTable(mk({ mode }), obj(id)); const t1 = Date.now();
    console.log('releaseTable', id, mode, t1 - t0, 'ms');
  }
}
// cold vs warm easy aim
for (const D of [10, 100, 1000, 1e5]) {
  const t0 = Date.now(); X.aimEasy(obj('shot'), D, 1.8, 1.8); const t1 = Date.now(); X.aimEasy(obj('shot'), D, 1.8, 1.8); const t2 = Date.now();
  console.log('aimEasy shot', D, 'cold', t1 - t0, 'warm', t2 - t1);
}
