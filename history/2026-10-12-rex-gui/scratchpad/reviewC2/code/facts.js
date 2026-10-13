global.window = {};
const fs=require('fs');
const R0='/home/user/rex-strength-lab/rex-strength-lab/';
require(R0+'src/data.js');
const D = window.DINO_DATA;
const facts = {};
for (const f of fs.readdirSync(R0+'research').filter((x) => /^final-.*\.json$/.test(x)))
  for (const x of JSON.parse(fs.readFileSync(R0+'research/'+f, 'utf8')).facts) facts[x.key] = Object.assign({_file:f}, x);
for (const r of D.energyRefs) {
  const f = facts[r.key];
  const lo = f.low_si, hi = f.high_si;
  console.log(r.id.padEnd(13), f.status.padEnd(9), String(f.value_si.toExponential(3)).padEnd(10), 'lo', lo==null?'-':lo.toExponential(2), 'hi', hi==null?'-':hi.toExponential(2), r.rough?'ROUGH':'', f.rough?'(field)':'', '| unit', f.unit_si, '|', f.display.slice(0,140));
}
