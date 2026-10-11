global.window={}; const P=require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js'); const D=window.DINO_DATA;
const S=D.surfaces.find(s=>s.id==='concrete');
const mk=(kg,m,anchor)=>({F:kg*9.80665,mode:'comic',body:P.makeBody({H:2,m}),surface:S,groundHolds:false,anchor:anchor||'friction'});
const r=P.pushMatch(mk(90718.474,180),mk(90718.474,300));
console.log(JSON.stringify(r,(k,v)=>typeof v==='number'?+v.toPrecision(5):v));
// independent: net = muB g - muA g; M = 480; a; x = ring/2
const g=9.80665, net=0.6*300*g-0.6*180*g, a=net/480, x=4.55*2/2/2; console.log('net',net,'a',a,'t',Math.sqrt(2*x/a),'v',Math.sqrt(2*a*x));
