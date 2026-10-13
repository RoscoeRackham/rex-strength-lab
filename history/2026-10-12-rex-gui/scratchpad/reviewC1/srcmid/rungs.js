global.window = {};
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const L = require('/home/user/rex-strength-lab/rex-strength-lab/src/ladder.js');
const ids=['moab','hubble','beirut','iss','hiroshima','chelyabinsk','hoover','bravo','tsar','krakatoa','worldday','hurricane','worldyear','sunlightday','chicxulub','sunlightyear','sun','pluto'];
const refs=D.energyRefs;
for (const id of ids){ const r=refs.find(x=>x.id===id); console.log(id, r.J.toExponential(4), r.rough, '|', r.short);}
console.log('---');
const sorted=refs.slice().sort((a,b)=>a.J-b.J);
for (let i=1;i<sorted.length;i++){ if (ids.includes(sorted[i].id)||ids.includes(sorted[i-1].id)) console.log(sorted[i-1].id,'->',sorted[i].id,(sorted[i].J/sorted[i-1].J).toFixed(2)); }
console.log('---');
for (const id of ids){ const r=refs.find(x=>x.id===id); for (const f of [1,3,0.4,1.1]) console.log(id,f, L.compare(r.J*f, refs).text);}
