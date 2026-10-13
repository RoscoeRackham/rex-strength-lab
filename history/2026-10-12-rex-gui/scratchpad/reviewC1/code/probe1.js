global.window = {};
const R = '/home/user/rex-strength-lab/rex-strength-lab/';
require(R + 'src/data.js');
const D = window.DINO_DATA;
const L = require(R + 'src/ladder.js');
const refs = D.energyRefs.slice().sort((a,b)=>a.J-b.J);
console.log('n rungs', refs.length, 'ids unique', new Set(refs.map(r=>r.id)).size, 'keys unique', new Set(refs.map(r=>r.key)).size);
for (const r of refs) console.log(r.id.padEnd(14), r.J.toExponential(4).padEnd(12), r.rough?'ROUGH':'     ', r.short, ' | ', r.label);
// ratios
for (let i=1;i<refs.length;i++){ const q=refs[i].J/refs[i-1].J; if (q>20 || q<1.5) console.log('step', refs[i-1].id,'->',refs[i].id, q.toFixed(2)); }
