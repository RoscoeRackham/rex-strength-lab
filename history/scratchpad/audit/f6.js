global.window={};
const P=require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js');
const D=window.DINO_DATA; const g=9.80665;
const surf=D.surfaces.find(s=>s.id==='concrete');
const ob=(id)=>D.objects.find(o=>o.id===id);
const mk=(kg,anchor)=>({F:kg*g,mode:'comic',body:P.makeBody({H:3.05,m:637}),surface:surf,groundHolds:false,anchor:anchor||'friction'});
const kg=100*907.18474;
for (const st of ['easy','hard']) {
 const L=P.catchLeg(mk(kg),mk(kg),ob('baseball'),10,st); const k=L.catch;
 const mS=0.145+k.mh;
 console.log(st,L.result,'vArr',L.vArrive.toFixed(3),'v1',k.v1.toFixed(4),'F',k.F.toExponential(3),'tStroke',k.tStroke.toFixed(4),'2d/v1',(2*k.stroke/k.v1).toFixed(3),'2d/v',(2*k.stroke/L.vArrive).toFixed(4),'p after contact',(mS*k.v1).toFixed(3),'F*t',(k.F*k.tStroke).toFixed(3),'flight',L.time.toFixed(3),'holdLoad',k.holdLoad.toFixed(3), 'angle', L.angleDeg);
}
const G=P.catchGame? null:null;
