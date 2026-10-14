const R='/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewC2/verify-copy/repo/rex-strength-lab/';
global.window={}; require(R+'src/data.js'); const D=window.DINO_DATA;
const rows=D.sourceRows.filter(r=>/^Energy:/.test(r.label));
console.log('energy rows',rows.length, 'keys', Object.keys(rows[0]));
const re=/\^|\bx 10|\berg\b|existing fact|\bfact [a-z_]+|\d e\d|\de\d|\bd15\b|\bHNe\b|~|\+\/-|kpc|Bethe/;
let nRows=0,nT=0;
for (const r of rows){ const bad=(r.sources||[]).filter(s=>re.test(s.title)); if(bad.length){nRows++;nT+=bad.length; console.log('*',r.label.slice(0,70)); bad.forEach(s=>console.log('    ',s.title));}}
console.log('rows with bad titles',nRows,'titles',nT);
