global.window={}; const R=process.env.R;
require(R+'/src/data.js'); const D=window.DINO_DATA; const L=require(R+'/src/ladder.js');
const refs=D.energyRefs;
if (process.argv[2]==='list') { refs.forEach((r,i)=>console.log(i, r.key||r.k, r.J||r.v||r.value, JSON.stringify(Object.keys(r)), r.rough?'ROUGH':'', (r.short||r.name||r.label||'').slice(0,80))); }
for (const J of process.argv.slice(3).map(Number)) console.log(J, JSON.stringify(L.compare(J, refs)));
