global.window={}; const P=require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js'); const D=window.DINO_DATA;
const g=9.80665, surf=D.surfaces.find(s=>s.id==='concrete');
const o=D.objects.find(x=>x.id==='baseball');
for (const [m,logKg,Dd,gh] of [[1e13,12,10**1.5,true],[1e10,8,100,true]]) {
  const cR={F:10**logKg*g,mode:'comic',body:P.makeBody({H:3.048,m,build:'rex'}),surface:surf,groundHolds:gh,anchor:'bolted'};
  const cO={F:10**logKg*g,mode:'comic',body:P.makeBody({H:3.048,m,build:'ollie'}),surface:surf,groundHolds:gh,anchor:'bolted'};
  const a=P.catchLeg(cR,cO,o,Dd,'easy');
  console.log(m, a.result, 'far',a.farthest&&a.farthest.range,'need',a.needFactor,'vMax',a.vMax, 'easyNeed',JSON.stringify(a.easyNeed), 'barrier',a.wells.barrier, 'wellDom',a.wells.wellDominated, 'holdNeeded',a.holdNeeded, 'F', cR.F);
}
