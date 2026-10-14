global.window = {};
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const L = D.energyRefs.map(e => 'Energy: ' + e.label);
const rowsL = D.sourceRows.map(r => r.label);
for (const l of L) { const m = rowsL.filter(r => r.startsWith(l)); if (m.length > 1) console.log('prefix collision', l, '=>', m); }
for (const e of D.energyRefs) console.log(e.id.padEnd(13), e.label);
