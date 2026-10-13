const d = require('./' + process.argv[2]);
const strip = (s) => (s || '').replace(/ It doesn’t judge the ground shaking here\./g, '').replace(/ The lab has no ground-wave model for [^.]*\./g, '');
const words = (a, b) => { const A = a.split(' '), B = b.split(' '); let i = 0; while (i < A.length && A[i] === B[i]) i++; let j = 0; while (j < A.length - i && j < B.length - i && A[A.length - 1 - j] === B[B.length - 1 - j]) j++; return ['…' + A.slice(Math.max(0, i - 6), A.length - j).join(' ') + '…', '…' + B.slice(Math.max(0, i - 6), B.length - j).join(' ') + '…']; };
let n = 0; const groups = {};
for (const k of Object.keys(d.main)) {
  const a = d.main[k], b = d.branch[k];
  if (JSON.stringify(a) === JSON.stringify(b)) continue;
  if (typeof a !== 'object' || typeof b !== 'object') { console.log('NONOBJ', k, a, b); continue; }
  for (const f of Object.keys(a)) {
    const A = JSON.stringify(a[f]), B = JSON.stringify(b[f]);
    if (A === B) continue;
    if (strip(A) === strip(B)) { groups['caveat-only:' + f] = (groups['caveat-only:' + f] || 0) + 1; continue; }
    const [x, y] = words(strip(A), strip(B));
    const key = f + ' :: ' + x.slice(0, 220) + ' => ' + y.slice(0, 220);
    (groups[key] = groups[key] || []).push(k);
  }
}
for (const [k, v] of Object.entries(groups)) console.log((Array.isArray(v) ? v.length + 'x [' + v.slice(0, 2).join(' ; ') + ']' : v + 'x'), '\n   ', k, '\n');
