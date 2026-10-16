const which=process.argv[2]; const E = which==='fix'?require('./envf.js'):which==='main'?require('./envm.js'):require('./env.js');
const {P,D,rex,surf}=E; const kgf=(x)=>x==null?x:isFinite(x)?Math.round(x/P.K.g):String(x);
for (const anchor of ['friction','bolted']) for (const oid of ['baseball','person','car','bus']) {
  const ctx={F:90718.474*P.K.g,mode:'comic',body:rex,surface:surf('concrete'),anchor,airAbsorb:1,keepForm:true,unbreakable:true,ownRecoil:true};
  const o=D.objects.find(x=>x.id===oid);
  const p=P.RESTRAINT.planNow('pull',ctx,{obj:o,target:10,near:5}); const g=p.goal(); const ce=p.ceiling();
  const all=p.run(ctx.F), least=p.run(g.use);
  console.log(which,anchor,oid,'least',kgf(g.use),'t',least.t10m.toFixed(3),'| allout t',all.t10m.toFixed(4),'vEnd',all.vEnd.toFixed(1),'legs/F',all.walkPush?(all.walkPush.J/all.walkPush.T/ctx.F).toFixed(2):'-','| ceiling',kgf(ce.below),ce.by);
}
