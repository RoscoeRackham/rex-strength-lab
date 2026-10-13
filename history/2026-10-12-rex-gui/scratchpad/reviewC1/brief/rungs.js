global.window = {};
const repo = process.argv[2] || '/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewC1/brief/repo/rex-strength-lab';
require(repo + '/src/data.js');
const D = window.DINO_DATA;
const R = D.energyRefs.slice().sort((a,b)=>a.J-b.J);
let prev=null;
for (const r of R) { console.log(r.id.padEnd(14), r.J.toExponential(3).padEnd(10), (prev? (r.J/prev.J).toFixed(1)+'x':'').padEnd(7), r.rough?'ROUGH':'     ', r.key.padEnd(34), '|', r.short, '|', r.label); prev=r; }
console.log(Object.keys(R[0]));
