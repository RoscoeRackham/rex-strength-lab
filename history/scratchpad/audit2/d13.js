global.window={};require('/home/user/dino-strength-sim/src/data.js');const D=window.DINO_DATA;
const R=require('/home/user/dino-strength-sim/research/final-environment.json');
const keyFor={sand:/loose.*sand.*ultimate|ground_loose_sand.*ultimate/i};
const byCat={};
for(const f of R.facts){ if(/ultimate_bearing|punch|compressive_strength|hardness/i.test(f.key||'') && f.low_si!=null) byCat[f.key]=f; }
for(const k in byCat){const f=byCat[k]; console.log(k.padEnd(60), (f.value_si/1e6).toPrecision(3),'MPa  low',(f.low_si/1e6).toPrecision(3),'high',(f.high_si/1e6).toPrecision(3),' central/low=',(f.value_si/f.low_si).toFixed(1),' high/central=',(f.high_si/f.value_si).toFixed(1),' spread=',(f.high_si/f.low_si).toFixed(1));}
console.log('\nEngine qult (MPa):', D.surfaces.map(s=>s.id+'='+s.qult/1e6).join(', '));
console.log('\nGround assumption:', D.assumptions.find(a=>a.t==='Ground').d.slice(0,80));
