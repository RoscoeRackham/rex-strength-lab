const R='/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewC1/copy/repo/rex-strength-lab';
global.window = {}; require(R+'/src/data.js'); const D = window.DINO_DATA;
const rows = D.sourceRows;
const en = rows.filter(r=>r.label.startsWith('Energy:'));
console.log('total rows', rows.length, 'energy rows', en.length);
const bad = /\^|\d x \d| x 10|\bx\b|\+\/-|~|erg|Bethe|TOA|kpc|RE factor|e\+\d|\bW\/m|'/;
let n=0;
for (const r of rows) { if (bad.test(r.value) || bad.test(r.label)) { n++; console.log((r.label.startsWith('Energy:')?'E ':'  ')+'['+r.status+'] '+r.label+' || '+r.value); } }
console.log('flagged', n);
