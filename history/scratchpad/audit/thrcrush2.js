global.window={}; const P=require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js'); const D=window.DINO_DATA;
const S=D.surfaces.find(s=>s.id==='concrete');
const mk=(kg)=>({F:kg*9.80665,mode:'comic',body:P.makeBody({H:2,m:180}),surface:S,groundHolds:false,anchor:'bolted'});
const B=P.makeBody({H:2,m:180});
let n=0;
for (const o of D.objects.filter(x=>!x.noThrow && x.crush)) for (const lk of [5,6,7,8,9,10]) for (const Dd of [10,100,1000,1e4]) for (const st of ['hard','easy']) {
  const Dm=Math.max(Dd,P.catchMinD(B,B,o));
  let L; try { L=P.catchLeg(mk(10**lk),mk(10**lk),o,Dm,st);} catch(e){continue;}
  if (L.result!=='caught' || !L.aim) continue;
  const vL=L.aim.vL; const tab=null;
  const stroke=(o.m<=1?2.2:1.6);
  const Fthrow=o.m*vL*vL/(2*stroke);
  const r=Fthrow/o.area/o.crush;
  if (r>1) { n++; if(n<15) console.log(o.id, '1e'+lk, Dm, st, 'vL',vL.toPrecision(4),'vArr',L.vArrive.toPrecision(4),'throw/front/crush',r.toPrecision(3),'catch wholeFront',L.catch.wholeFront.toPrecision(3)); }
}
console.log('count',n);
