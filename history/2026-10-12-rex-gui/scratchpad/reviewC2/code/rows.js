global.window = {};
const fs=require('fs'), path=require('path');
const R0='/home/user/rex-strength-lab/rex-strength-lab/';
require(R0+'src/data.js');
const D = window.DINO_DATA;
const facts = {};
for (const f of fs.readdirSync(R0+'research').filter((x) => /^final-.*\.json$/.test(x)))
  for (const x of JSON.parse(fs.readFileSync(R0+'research/'+f, 'utf8')).facts) facts[x.key] = Object.assign({_file:f}, x);
const er = D.sourceRows.filter(r=>/^Energy: /.test(r.label));
console.log('energy rows', er.length);
const labels = er.map(r=>r.label); console.log('dup labels', labels.filter((x,i)=>labels.indexOf(x)!==i));
for (const r of D.energyRefs) {
  const f = facts[r.key];
  const row = er.filter(x=>x.label==='Energy: '+r.label);
  if (row.length!==1) console.log('ROW COUNT', r.id, row.length);
  const urls = row[0].sources.map(s=>s.url);
  const dupu = urls.filter((x,i)=>urls.indexOf(x)!==i);
  if (dupu.length) console.log('dup url in row', r.id, dupu);
  const missing = f.sources.map(s=>s.url).filter(u=>!urls.includes(u));
  if (missing.length) console.log('missing src', r.id, missing);
  if (row[0].status!==f.status) console.log('status', r.id, row[0].status, f.status);
  if (f._file!=='final-energy.json') console.log('file', r.id, f._file);
  if (row[0].value!==f.display) console.log('display', r.id);
  // value vs display consistency: does display mention value?
  if (!r.label || r.label!==f.label) console.log('label', r.id);
  const untitled = row[0].sources.filter(s=>!s.title); if (untitled.length) console.log('untitled', r.id, untitled.map(s=>s.url));
}
// all statuses
const st={}; for (const r of D.energyRefs) { const s=facts[r.key].status; st[s]=(st[s]||0)+1; } console.log(st);
// rows mentioning energy ids elsewhere
for (const r of D.sourceRows) if (/rakatoa|hicxulub|Hiroshima|Tsar/.test(r.label+r.value) && !/^Energy: /.test(r.label)) console.log('OTHER ROW', r.label, '|', r.value, '|', r.status);
