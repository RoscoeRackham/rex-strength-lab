const a = require(process.argv[2]), b = require(process.argv[3]);
let nd = 0, msA = 0, msB = 0;
for (const k of Object.keys(a)) {
  msA += a[k].ms; msB += b[k].ms;
  for (const f of Object.keys(a[k])) {
    if (f === 'ms' || f === 'runs') continue;
    const x = JSON.stringify(a[k][f]), y = JSON.stringify(b[k][f]);
    if (x !== y) { nd++; console.log(k, f, '\n  old', x, '\n  new', y); }
  }
}
console.log('diffs', nd, 'ms old', msA, 'new', msB);
