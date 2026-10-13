global.window = {};
require(process.argv[2] + '/src/data.js');
const D = window.DINO_DATA;
const R = D.energyRefs.slice().sort((a,b)=>a.J-b.J);
let prev=null;
for (const r of R) { const row = D.sourceRows.find(x=>x.label==='Energy: '+r.label);
 console.log(r.id.padEnd(14), r.J.toExponential(2).padStart(9), (prev? (r.J/prev.J).toFixed(1)+'x':'').padStart(7), r.rough?'ROUGH':'     ', (row?row.status:'NOROW').padEnd(9), r.short); prev=r; }
console.log(Object.keys(R[0]));
