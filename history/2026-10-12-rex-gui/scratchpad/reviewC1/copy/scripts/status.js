const R='/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewC1/copy/repo/rex-strength-lab';
global.window = {}; require(R+'/src/data.js'); const D = window.DINO_DATA;
const facts = {}; for (const f of require(R+'/research/final-energy.json').facts) facts[f.key]=f;
const by = {}; for (const r of D.energyRefs) { const s = facts[r.key].status; (by[s] = by[s]||[]).push(r.id); }
console.log(by); console.log('rough', D.energyRefs.filter(r=>r.rough).map(r=>r.id));
const refs = D.energyRefs.slice().sort((a,b)=>a.J-b.J); const st = refs.slice(1).map((r,i)=>[r.J/refs[i].J, refs[i].id+'->'+r.id]).sort((a,b)=>b[0]-a[0]).slice(0,5); console.log(st);
console.log('facts', Object.keys(facts).length, 'rungs', D.energyRefs.length);
