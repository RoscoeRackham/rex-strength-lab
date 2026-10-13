global.window={}; const P=require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'); require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D=window.DINO_DATA;
const g=P.K.g, surf=(id)=>D.surfaces.find(s=>s.id===id), obj=(id)=>D.objects.find(o=>o.id===id);
const rex=P.makeBody(Object.assign({build:'rex'},P.DEFAULT_BODIES.rex));
console.log('rex body', P.DEFAULT_BODIES.rex, 'palmArea', rex.palmArea);
const F=Math.pow(10,Math.log10(100*907.18474))*g;
const ctx=(x)=>Object.assign({F,mode:'comic',body:rex,surface:surf('concrete'),groundHolds:false,anchor:'friction'},x||{});
for (const id of ['car','piano','bus','shot','bar511','ruyi','tank','motorcycle']) {
  const a=P.throwObject(ctx(),obj(id),45), b=P.throwObject(ctx({gentleHold:true}),obj(id),45);
  console.log('throw allout',id,'v',a.v.toPrecision(4),'gripRatio',a.gripRatio&&a.gripRatio.toPrecision(3),'raw',a.gripRatioRaw&&a.gripRatioRaw.toPrecision(3),'plate',a.plateNeeded&&a.plateNeeded.toPrecision(3),'gentle gr',b.gripRatio,'sameV',a.v===b.v, 'maxStagT', a.flight&&a.flight.maxStagT&&a.flight.maxStagT.toPrecision(4));
}
for (const id of ['car','pickup','bus','piano','everest','pyramid','moon','allstar','tank']) {
  const a=P.lift(ctx(),obj(id)), b=P.lift(ctx({gentleHold:true}),obj(id));
  console.log('lift',id,'canLift',a.canLift,'gripRatio',a.gripRatio&&a.gripRatio.toPrecision(3),'gentle',b.gripRatio,'raw',b.gripRatioRaw&&b.gripRatioRaw.toPrecision(3));
}
// least effort plan for throw car default
for (const gh of [false,true]) {
  const p=P.RESTRAINT.planNow('throw',ctx({gentleHold:gh}),{obj:obj('car'),angle:45,target:30,near:5,gentleHold:gh});
  const ce=p.ceiling(), gl=p.goal(), cr=p.result('hazard:crush');
  console.log('plan gh',gh,'goal use kg',(gl.use/g).toPrecision(4),'ceiling by',ce.by,'below kg',(ce.below/g).toPrecision(4),'crush onset kg',isFinite(cr.use)?(cr.use/g).toPrecision(4):cr.use, 'never',cr.never);
}
