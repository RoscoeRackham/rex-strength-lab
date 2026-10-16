// fly() outputs, base (canon-4) vs this branch, with tally unset, over a sweep
const load = require('./h.js');
const path = require('path');
const B = load(path.join(__dirname, '..', 'base')), N = load();
const snap = (x) => JSON.stringify(x, (k, v) => (typeof v === 'number' && !isFinite(v) ? String(v) : v));
let n = 0, diff = 0, first = null;
for (const id of ['car', 'person', 'baseball', 'pyramid', 'ruyi', 'bus']) {
  const ob = N.obj(id); if (!ob) continue;
  for (const th of [-10, 0, 20, 45, 90]) for (let e = 0; e <= 8; e += 0.25) for (const dK of [undefined, 1, 0.5, 0, 0.999]) for (const rec of [false, true]) {
    const v0 = Math.pow(10, e);
    const o = { v0, thetaDeg: th, h0: 1.5, m: ob.m, A: ob.area, Cd: ob.Cd, CdSup: ob.CdSup, dragK: dK, record: rec };
    const a = snap(B.P.fly(Object.assign({}, o))), b = snap(N.P.fly(Object.assign({}, o)));
    n++; if (a !== b) { diff++; if (!first) first = id + ' ' + th + ' ' + e + ' ' + dK; }
  }
}
console.log('fly sweep', n, 'calls,', diff, 'differ', first || '');
// with tally:true vs unset at dK<1: identical
let d2 = 0, n2 = 0;
for (const id of ['car', 'baseball']) { const ob = N.obj(id); for (let e = 0; e <= 7; e += 0.5) for (const dK of [0.5, 0]) { const o = { v0: Math.pow(10, e), thetaDeg: 45, h0: 1.5, m: ob.m, A: ob.area, Cd: ob.Cd, CdSup: ob.CdSup, dragK: dK }; n2++; if (snap(N.P.fly(o)) !== snap(N.P.fly(Object.assign({ tally: true }, o)))) d2++; } }
console.log('tally:true at dK<1 differs in', d2, 'of', n2);
// tally:true at dK=1: only air/ocean keys added
let d3 = 0, n3 = 0;
for (const id of ['car', 'baseball', 'pyramid']) { const ob = N.obj(id); for (let e = 0; e <= 7; e += 0.5) { const o = { v0: Math.pow(10, e), thetaDeg: 45, h0: 1.5, m: ob.m, A: ob.area, Cd: ob.Cd, CdSup: ob.CdSup }; const a = N.P.fly(o), b = N.P.fly(Object.assign({ tally: true }, o)); delete b.air; delete b.ocean; n3++; if (snap(a) !== snap(b)) d3++; } }
console.log('tally:true at dK=1, minus air/ocean, differs in', d3, 'of', n3);
