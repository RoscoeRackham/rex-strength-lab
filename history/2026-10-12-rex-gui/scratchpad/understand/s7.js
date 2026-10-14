global.window={}; const P=require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'); require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D=window.DINO_DATA;
const f=(x)=>typeof x==='number'?x.toPrecision(3):String(x);
for (const [bn,b] of [['rex',P.makeBody({build:'rex',H:3.048,m:3007})],['kaiju',P.makeBody({build:'rex',H:50,m:1060*P.bodyVolume(50,'rex')})],['rex1e5',P.makeBody({build:'rex',H:3.048,m:1e5})]]) for (const s of D.surfaces) for (const e of [0,1]) {
  const a=P.presence(b,s,{pace:'walk',effort:e,groundHolds:false}), c=P.presence(b,s,{pace:'walk',effort:e,groundHolds:true});
  console.log(bn,s.id,'e'+e,'print',a.step.footprint.kind,f(a.step.footprint.depth),'ratio',f(a.step.ratio),f(a.step.peakRatio),'| comic',c.step.footprint.kind,'| ppv5',f(a.ppv(5)),f(c.ppv(5)),'rattle reach',f(a.reach.rattle),f(c.reach.rattle));
}
