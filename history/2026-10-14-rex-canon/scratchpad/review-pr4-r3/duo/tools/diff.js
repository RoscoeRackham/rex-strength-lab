// node diff.js <a.json> <b.json>: per state and effort, which parts differ (verdict, status, tiles, effort, happens, math)
const fs = require('fs');
const [aP, bP] = process.argv.slice(2);
const A = JSON.parse(fs.readFileSync(aP, 'utf8')), B = JSON.parse(fs.readFileSync(bP, 'utf8'));
const PARTS = ['verdict', 'status', 'tiles', 'effort', 'happens', 'callouts', 'math'];
let same = 0, diff = 0;
const firstDiff = (x, y) => { let i = 0; while (i < x.length && x[i] === y[i]) i++; return [x.slice(Math.max(0, i - 80), i + 220), y.slice(Math.max(0, i - 80), i + 220)]; };
for (const id of Object.keys(A)) {
  if (!B[id]) { console.log('missing in b', id); continue; }
  for (const e of Object.keys(A[id])) {
    const a = A[id][e], b = B[id][e];
    if (!a || typeof a !== 'object' || Array.isArray(a) || !('verdict' in a)) continue;
    const parts = PARTS.filter((p) => (a[p] || '') !== (b[p] || ''));
    if (!parts.length) { same++; continue; }
    diff++;
    console.log('DIFF ' + id + ' ' + e + ' [' + parts.join(',') + ']');
    for (const p of parts.slice(0, 3)) { const [x, y] = firstDiff(a[p] || '', b[p] || ''); console.log('   ' + p + ' A: ' + x); console.log('   ' + p + ' B: ' + y); }
  }
}
console.log('same ' + same + ', differ ' + diff);
