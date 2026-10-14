const R='/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewC1/copy/repo/rex-strength-lab';
global.window = {}; require(R+'/src/data.js'); const D = window.DINO_DATA;
const L = require(R+'/src/ladder.js');
const facts = {}; for (const f of require(R+'/research/final-energy.json').facts) facts[f.key]=f;
console.log(Object.keys(D));
const refs = D.energyRefs.slice().sort((a,b)=>a.J-b.J);
console.log(Object.keys(refs[0]));
for (let i=0;i<refs.length;i++){const r=refs[i]; const f=facts[r.key]||{}; const step = i? (r.J/refs[i-1].J).toFixed(1):'';
 console.log([i+1, r.id, r.J.toExponential(3), step, r.rough?'ROUGH':'', f.status, JSON.stringify(r.short), '|', f.display, '| rough:', f.rough||'', '| lo', f.low_si, 'hi', f.high_si].join(' '));}
