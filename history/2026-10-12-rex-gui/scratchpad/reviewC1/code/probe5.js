global.window = {};
const which = process.argv[2];
require(which);
const D = window.DINO_DATA;
const rows = D.sourceRows;
const caret = rows.filter(r => /\^|\bx 10|\+\/-|~/.test(r.value));
console.log('rows', rows.length, 'with ^/x 10/+/-/~:', caret.length, 'of which energy:', caret.filter(r=>/^Energy:/.test(r.label)).length);
for (const r of caret.filter(r=>!/^Energy:/.test(r.label)).slice(0,8)) console.log('  non-energy:', r.label, '|', r.value);
const en = rows.filter(r=>/^Energy:/.test(r.label));
console.log('energy rows', en.length);
for (const r of en) { const urls = r.sources.map(s=>s.url); if (new Set(urls).size !== urls.length) console.log('DUP URL in', r.label); }
for (const r of en.slice(0,60)) console.log(r.status.padEnd(9), r.label.slice(0,60).padEnd(60), '|', r.value.slice(0,90), '|', r.sources.length);
