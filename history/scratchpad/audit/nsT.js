global.window={}; const P=require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js'); const D=window.DINO_DATA;
const S=D.surfaces.find(s=>s.id==='concrete');
const mk=(kg,m,anchor)=>({F:kg*9.80665,mode:'comic',body:P.makeBody({H:2,m:m||180}),surface:S,groundHolds:false,anchor:anchor||'bolted'});
const o=D.objects.find(x=>x.id==='baseball');
for (const lk of [10, 14, 20]) {
const L=P.catchLeg(mk(10**lk,7.416e16),mk(10**lk,180),o,10,'easy');
console.log(lk, L.result, 'vNeed',L.vNeed,'vL',L.aim&&L.aim.vL,'vArrive',L.vArrive,'holdNeeded',L.holdNeeded, 'wells',JSON.stringify(L.wells,(k,v)=>typeof v==='number'?+v.toPrecision(5):v));
}
