// node cmp.js main.json br.json [filterRegex]
const fs = require('fs');
const [, , a, b, filt] = process.argv;
const A = JSON.parse(fs.readFileSync(a)), B = JSON.parse(fs.readFileSync(b));
const re = filt ? new RegExp(filt) : null;
for (const id of Object.keys(B)) {
  if (re && !re.test(id)) continue;
  const x = A[id], y = B[id];
  if (!x) { console.log('NEW', id); continue; }
  for (const k of ['verdict', 'status', 'tiles', 'effort', 'happens', 'callouts', 'math']) {
    const xs = x[k] || [], ys = y[k] || [];
    const sx = new Set(xs), sy = new Set(ys);
    const gone = xs.filter((t) => !sy.has(t)), added = ys.filter((t) => !sx.has(t));
    if (gone.length || added.length) {
      console.log('== ' + id + ' [' + k + ']');
      for (const t of gone) console.log('  - ' + t);
      for (const t of added) console.log('  + ' + t);
    }
  }
}
