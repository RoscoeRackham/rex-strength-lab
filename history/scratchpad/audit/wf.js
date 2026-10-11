global.window={}; const P=require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js'); const D=window.DINO_DATA;
const S=D.surfaces.find(s=>s.id==='concrete');
const mk=(kg,anchor)=>({F:kg*9.80665,mode:'comic',body:P.makeBody({H:2,m:180}),surface:S,groundHolds:false,anchor:anchor});
const B=P.makeBody({H:2,m:180});
let n=0, tot=0;
for (const o of D.objects.filter(x=>!x.noThrow && x.crush)) for (const lk of [4.96,6,7,8,9]) for (const Dd of [10,100,1000]) for (const st of ['hard','easy']) for (const an of ['friction','bolted']) {
  const Dm=Math.max(Dd,P.catchMinD(B,B,o));
  let L; try { L=P.catchLeg(mk(10**lk,an),mk(10**lk,an),o,Dm,st);} catch(e){continue;}
  if (L.result!=='caught') continue; tot++;
  const k=L.catch, wf1=k.F1[0]/o.area/o.crush;
  if (wf1>1) { n++; if(n<12) console.log(o.id.padEnd(8),'1e'+lk,Dm,st,an,'vArr',L.vArrive.toPrecision(4),'wholeFront(stroke)',k.wholeFront.toPrecision(3),'wholeFront(first contact, soft end)',wf1.toPrecision(3),'plate side',Math.sqrt(k.plateNeeded).toPrecision(3),'obj front side',Math.sqrt(o.area).toPrecision(3)); }
}
console.log('caught verdicts',tot,'of which first-contact exceeds crush over whole front',n);
