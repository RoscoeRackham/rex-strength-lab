const fs = require('fs');
const out = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const bad = /NaN|Infinity|undefined|\bnull\b|Calculation failed|\[object|e\+\d|−∞|-∞/;
let n = 0; const buckets = {};
const slow = [];
for (const r of out) {
  if (r.dt > 700) slow.push([r.name, Math.round(r.dt)]);
  const issues = [];
  if (r.errs.length) issues.push('ERR ' + r.errs.join('|').slice(0, 200));
  if (r.perrs.length) issues.push('PERR ' + r.perrs.join('|').slice(0, 200));
  const lines = r.text.split('\n').filter((l) => bad.test(l));
  for (const l of lines) issues.push('TXT ' + l.slice(0, 220));
  if (!r.text.trim()) issues.push('EMPTY');
  for (const i of issues) {
    const key = i.replace(/[\d.]+/g, '#').slice(0, 160);
    (buckets[key] = buckets[key] || []).push(r.name);
  }
}
for (const [k, v] of Object.entries(buckets).sort((a, b) => b[1].length - a[1].length)) console.log(v.length + 'x  ' + k + '\n     e.g. ' + v.slice(0, 3).join(' ; '));
console.log('slow (>700ms):', slow.length); for (const s of slow.sort((a,b)=>b[1]-a[1]).slice(0, 30)) console.log('  ', s.join(' '));
const dts = out.map((r) => r.dt).sort((a, b) => a - b);
console.log('n', out.length, 'median dt', dts[dts.length >> 1].toFixed(1), 'max', dts[dts.length - 1].toFixed(0));
