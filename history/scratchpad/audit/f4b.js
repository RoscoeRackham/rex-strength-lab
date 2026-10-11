global.window={};
const P=require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js');
const D=window.DINO_DATA; const g=9.80665;
const surf=D.surfaces.find(s=>s.id==='concrete');
const mk=(kg,anchor)=>({F:kg*g,mode:'comic',body:P.makeBody({H:3.05,m:637}),surface:surf,groundHolds:false,anchor:anchor||'bolted'});
let tot=0, bad=[];
for (const o of D.objects) { if(!o.crush) continue;
 for (const e of [3,4,5,6,7,8,9,10,11,12]) for (const Dd of [10,100,1000]) for (const st of ['easy','hard']) for (const an of ['friction','bolted']) {
  let L; try { L=P.catchLeg(mk(10**e,an),mk(10**e,an),o,Dd,st);} catch(err){continue;}
  if (L.result!=='caught') continue; tot++;
  const k=L.catch; const r=k.F1[0]/o.area/o.crush;
  if (r>1 || k.plateNeeded>o.area) bad.push([o.id,e,Dd,st,an,r.toFixed(2),(k.plateNeeded/o.area).toFixed(1),k.wholeFront.toFixed(3)].join(' '));
 }}
console.log('caught',tot,'bad',bad.length); console.log(bad.join('\n'));
