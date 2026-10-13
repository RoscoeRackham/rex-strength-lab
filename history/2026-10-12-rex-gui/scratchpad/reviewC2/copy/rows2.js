global.window = {};
require(process.argv[2] + '/src/data.js');
const D = window.DINO_DATA;
const rows = D.sourceRows.filter(r => /^Energy:/.test(r.label));
let i=0;
for (const r of rows) { i++;
  console.log(`#${i} [${r.status}] ${r.label}\n   VALUE: ${r.value}`);
  for (const s of r.sources) console.log('   - ' + s.title + '  <' + s.url + '>');
}
