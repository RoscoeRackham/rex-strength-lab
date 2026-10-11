global.window={}; const P=require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js'); const D=window.DINO_DATA;
const S=D.surfaces.find(s=>s.id==='concrete');
const mk=(kg,anchor)=>({F:kg*9.80665,mode:'comic',body:P.makeBody({H:2,m:180}),surface:S,groundHolds:false,anchor:anchor||'bolted'});
const [lk,Dd,style]=[+process.argv[2],+process.argv[3],process.argv[4]];
for (const o of D.objects.filter(x=>!x.noThrow)) {
  let L; try { L=P.catchLeg(mk(10**lk),mk(10**lk),o,Math.max(Dd,P.catchMinD(P.makeBody({H:2,m:180}),P.makeBody({H:2,m:180}),o)),style); } catch(e){ console.log(o.id,'ERR',e.message); continue; }
  const k=L.catch||{};
  console.log(o.id.padEnd(10), (L.result||'').padEnd(14), 'vL',(L.aim?L.aim.vL:L.vL||0).toPrecision(4),'vArr',(L.vArrive||0).toPrecision(4),'heat',L.heat?L.heat.kind+'/'+L.heat.kindHi:'', 'qDyn',(L.qDynMax||0).toPrecision(3),'crush',o.crush||'-','F',(k.F||0).toPrecision(3),'wholeFront',(k.wholeFront||0).toPrecision(3),'size',(L.size||0).toPrecision(3));
}
