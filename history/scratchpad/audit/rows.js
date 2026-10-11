global.window={};
require('/home/user/dino-strength-sim/src/data.js');
const D=window.DINO_DATA;
const q=process.argv[2]?new RegExp(process.argv[2],'i'):null;
for (const r of D.sourceRows) { const s=JSON.stringify(r); if(!q||q.test(s)) console.log(r.status.padEnd(9), r.label,'|',r.value.slice(0,200), r.note?('| NOTE '+r.note.slice(0,200)):'' , '|', r.sources.map(x=>x.url).join(' ')); }
