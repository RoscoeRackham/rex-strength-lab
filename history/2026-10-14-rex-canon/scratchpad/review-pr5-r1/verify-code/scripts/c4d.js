const { P, g, R3, O3, c9, obj, sig } = require('./common.js');
let n = 0;
for (const id of ['baseball', 'car', 'person']) for (let e = 3; e <= 20; e += 1) for (const D0 of [10, 100, 1000]) for (const st of ['hard', 'easy']) {
  const x = { ownRecoil: false }, A = c9(Math.pow(10, e) * g, R3, x), B = c9(Math.pow(10, e) * g, O3, x); let a; try { a = P.catchLeg(A, B, obj(id), D0, st); } catch (er) { continue; }
  if (a.result === 'caught' && a.catch && a.catch.carried) { const o = { A, B, whoA: 'rex', obj: obj(id) }; const t1 = P.RESTRAINT.takenBack('catch', { a }, o), t2 = P.RESTRAINT.takenBack('catch', { a, b: a }, o);
    if (t1.E !== t2.E && n++ < 2) console.log('carried off:', id, st, '10^' + e, D0 + ' m: leg a alone', sig(t1.E, 4), 'with a return leg', sig(t2.E, 4)); } }
console.log('differing carried-off states:', n);
