global.window={};
const P=require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js');
const D=window.DINO_DATA; const g=9.80665;
const surf=D.surfaces.find(s=>s.id==='concrete');
const ob=(id)=>D.objects.find(o=>o.id===id);
const mk=(kg,anchor,H,m)=>({F:kg*g,mode:'comic',body:P.makeBody({H:H||3.05,m:m||637}),surface:surf,groundHolds:false,anchor:anchor||'bolted'});
for (const kg of [1e6,3e6,1e7]) for (const Dd of [10,100]) {
  const L=P.catchLeg(mk(kg),mk(kg),ob('shot'),Dd,'hard');
  const k=L.catch; const o=ob('shot');
  if(!k){console.log(kg,Dd,L.result);continue;}
  console.log(kg,Dd,L.result,'vL',L.aim&&L.aim.vL.toFixed(0),'vArr',L.vArrive&&L.vArrive.toFixed(0),'F1',k.F1.map(x=>x.toExponential(2)).join('-'),'Fobj',(k.F*o.m/(o.m+k.mh)).toExponential(2),'area',o.area,'crush',o.crush,'F1lo/area/crush',(k.F1[0]/o.area/o.crush).toFixed(2),'wholeFront',k.wholeFront.toFixed(3),'plate',k.plateNeeded.toExponential(3),'firstShare',k.firstShare.toFixed(3),'mh',k.mh.toFixed(2), 'gripRatio',k.gripRatio.toFixed(1));
  // throw push
  if (L.aim) console.log('   throw push m vL^2/(2*1.6)', (o.m*L.aim.vL**2/3.2).toExponential(3), 'ratio', (o.m*L.aim.vL**2/3.2/o.area/o.crush).toFixed(2));
}
