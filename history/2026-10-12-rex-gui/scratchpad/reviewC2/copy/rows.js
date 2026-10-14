global.window = {};
require(process.argv[2] + '/src/data.js');
const D = window.DINO_DATA;
const rows = D.sourceRows.filter(r => /^Energy:/.test(r.label || r.l || ''));
console.log(Object.keys(D.sourceRows[0]));
console.log(rows.length);
for (const r of rows) console.log(JSON.stringify(r));
