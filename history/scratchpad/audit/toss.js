global.window={}; const P=require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js'); const D=window.DINO_DATA;
const S=D.surfaces.find(s=>s.id==='concrete');
const mk=(kg,m,anchor)=>({F:kg*9.80665,mode:'comic',body:P.makeBody({H:2,m:m||180}),surface:S,groundHolds:false,anchor:anchor||'friction'});
const strip=(x)=>JSON.stringify(x,(k,v)=>k==='path'?undefined:(typeof v==='number'?+v.toPrecision(6):v));
let t=P.tossPartner(mk(90718.474),P.makeBody({H:2,m:180}),'Ollie','easy',10);
console.log(strip({v:t.v,result:t.result,catch:t.catch,fl:{time:t.flight.time,apex:t.flight.apex,vImpact:t.flight.vImpact}}));
t=P.tossPartner(mk(90718.474),P.makeBody({H:2,m:180}),'Ollie','hard',10);
console.log(strip({v:t.v,result:t.result,catch:t.catch,fl:{time:t.flight.time,apex:t.flight.apex,vImpact:t.flight.vImpact}}));
