const { P, D, body, ctx } = require(process.argv[2] || './setup.js');
const obj = (id) => D.objects.find((x) => x.id === id);
let n = 0, withDrag = 0, explained = 0; const ex = [];
for (const id of ['baseball', 'car', 'person', 'bus', 'shot']) { if (!obj(id)) continue;
  for (const st of ['hard', 'easy']) for (let ld = 1; ld <= 6.5; ld += 0.5) for (let e = 5; e <= 16; e += 1) {
    const A = ctx(Math.pow(10, e) * P.K.g, body('rex')), B = ctx(Math.pow(10, e) * P.K.g, body('ollie'));
    // ctx takes kg; fix
    A.F = Math.pow(10, e) * P.K.g; B.F = A.F;
    let L; try { L = P.catchLeg(A, B, obj(id), Math.pow(10, ld), st); } catch (er) { continue; }
    if (!['caught', 'slams', 'wreckage', 'cant-hold-it'].includes(L.result) || !L.catch) continue;
    n++;
    const tb = P.RESTRAINT.takenBack('catch', { a: L }, { A, B, whoA: 'rex', obj: obj(id) });
    const d = tb.by.rex.parts.drag;
    if (d > 0) { withDrag++; const resid = P.keFromV(L.vArrive, obj(id).m) - L.catch.Ecatch; if (d <= Math.max(resid, 0) * 1.01 + 1e-9 * L.catch.Ecatch) explained++; else ex.push([id, st, ld, e, d, resid, L.catch.Ecatch]); }
  }
}
console.log('legs reaching the catcher', n, 'with a drag part', withDrag, 'explained by KE(vArrive)-Ecatch or rounding', explained);
console.log('unexplained (first 10):', JSON.stringify(ex.slice(0, 10)));
