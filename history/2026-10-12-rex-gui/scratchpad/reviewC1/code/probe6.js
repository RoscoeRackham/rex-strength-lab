global.window = {};
const fs = require('fs');
const R = '/home/user/rex-strength-lab/rex-strength-lab/';
require(R + 'src/data.js');
const D = window.DINO_DATA;
const facts = {};
for (const f of fs.readdirSync(R + 'research').filter((x) => /^final-.*\.json$/.test(x))) for (const x of JSON.parse(fs.readFileSync(R + 'research/' + f, 'utf8')).facts) facts[x.key] = x;
let bad = 0;
for (const r of D.energyRefs) {
  const f = facts[r.key];
  const row = D.sourceRows.find((x) => x.label === 'Energy: ' + r.label);
  const want = f.sources.map((s) => s.url), got = row.sources.map((s) => s.url);
  if (JSON.stringify(want) !== JSON.stringify(got)) { bad++; console.log('sources differ', r.id, want, got); }
  if (row.value !== f.display) { bad++; console.log('value differs', r.id); }
  if (r.short !== f.page_short.replace(/'/g, '’')) { bad++; console.log('short differs', r.id); }
  if (r.label !== f.label) { bad++; console.log('label differs', r.id); }
  const dupLabel = D.sourceRows.filter((x) => x.label === row.label).length; if (dupLabel > 1) { bad++; console.log('dup label', row.label); }
}
// any other Energy: rows not rungs?
const extra = D.sourceRows.filter((x) => /^Energy: /.test(x.label) && !D.energyRefs.some((r) => 'Energy: ' + r.label === x.label));
console.log('bad', bad, 'non-rung Energy rows', extra.map((x) => x.label));
// page_short with straight quotes or capital letters
for (const r of D.energyRefs) if (/'/.test(r.short)) console.log('straight quote in short', r.id);
