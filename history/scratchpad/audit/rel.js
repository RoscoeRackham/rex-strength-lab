global.window={}; const P=require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js'); const D=window.DINO_DATA;
const S=(id)=>D.surfaces.find(s=>s.id===id);
const mk=(kg,H,m,anchor)=>({F:kg*9.80665,mode:'comic',body:P.makeBody({H,m}),surface:S('concrete'),groundHolds:false,anchor:anchor||'friction'});
const obj=(id)=>D.objects.find(x=>x.id===id);
for (const [id,lk,Dd] of [['baseball',16,10],['baseball',20,10],['baseball',24,10],['pyramid',30,10],['car',22,10],['car',22,1e5]]) {
  const L=P.catchLeg(mk(10**lk,2,180,'bolted'),mk(10**lk,2,180,'bolted'),obj(id),Dd,'hard');
  const fb=L.fireball;
  console.log(id,lk,Dd,L.result,'vL',L.vL, fb?JSON.stringify(fb,(k,v)=>typeof v==='number'?+v.toPrecision(5):v):'');
}
