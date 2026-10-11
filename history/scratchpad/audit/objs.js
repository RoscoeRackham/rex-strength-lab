global.window={};
require('/home/user/dino-strength-sim/src/data.js');
const D=window.DINO_DATA;
for (const o of D.objects) console.log(o.id, JSON.stringify(Object.fromEntries(Object.entries(o).filter(([k])=>!['label','src','sources','note','desc'].includes(k)))).slice(0,300));
console.log(D.surfaces.map(s=>s.id+' mu='+s.mu+' shear='+s.shear+' rho='+s.rho).join('\n'));
