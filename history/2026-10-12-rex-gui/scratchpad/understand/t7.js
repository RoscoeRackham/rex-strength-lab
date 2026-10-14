global.window={}; const P=require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'); require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D=window.DINO_DATA;
const g=P.K.g, surf=(id)=>D.surfaces.find(s=>s.id===id), obj=(id)=>D.objects.find(o=>o.id===id);
const rex=P.makeBody(Object.assign({build:'rex'},P.DEFAULT_BODIES.rex)), ollie=P.makeBody(Object.assign({build:'ollie'},P.DEFAULT_BODIES.ollie));
const ctx=(F,b,x)=>Object.assign({F,mode:'comic',body:b,surface:surf('concrete'),groundHolds:false,anchor:'friction'},x||{});
const F=90718.474*g;
const L=P.catchLeg(ctx(F,rex,{gentleHold:true}),ctx(F,ollie,{gentleHold:true}),obj('baseball'),10,'hard');
console.log('gentle baseball 100t hard 10m: result',L.result,'bursts',L.bursts,'gentleC',L.gentleC,'baseballRatio',L.catch.baseballRatio.toPrecision(3),'gripRatio',L.catch.gripRatio,'-> page verdict adds "The ball probably bursts." since line 2347 checks only k.baseballRatio > 1');
