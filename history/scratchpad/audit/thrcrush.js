global.window={}; const P=require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js'); const D=window.DINO_DATA;
const S=D.surfaces.find(s=>s.id==='concrete');
const mk=(kg,anchor)=>({F:kg*9.80665,mode:'comic',body:P.makeBody({H:2,m:180}),surface:S,groundHolds:false,anchor:anchor||'bolted'});
for (const [id,lk,Dd] of [['car',4.9577,10],['car',7,10],['car',8,10],['car',8,1000],['piano',8,1000],['shot',9,1000],['bar511',9,100]]) {
  const o=D.objects.find(x=>x.id===id);
  const Dm=Math.max(Dd,P.catchMinD(P.makeBody({H:2,m:180}),P.makeBody({H:2,m:180}),o));
  const L=P.catchLeg(mk(10**lk),mk(10**lk),o,Dm,'hard');
  if(!L.aim){console.log(id,lk,L.result);continue;}
  const vL=L.aim.vL; const stroke=(o.m<=1?2.2:1.6);
  const Fthrow=o.m*vL*vL/(2*stroke); // mean push needed to reach vL over the stroke
  const k=L.catch;
  console.log(id.padEnd(7),'dial 1e'+lk,'D',Dm.toFixed(0),'result',L.result.padEnd(10),'vL',vL.toPrecision(4),'qDynMax/crush',(L.qDynMax/o.crush).toPrecision(3),'throw push/front/crush',(Fthrow/o.area/o.crush).toPrecision(3),'catch wholeFront',k?k.wholeFront.toPrecision(3):'-');
}
