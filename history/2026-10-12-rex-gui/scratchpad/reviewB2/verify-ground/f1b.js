const {P,D,rex,surf,ON,OFF,ctx}=require('./h.js');
const R=P.RESTRAINT;
for (const sid of ['sand','concrete']) {
  const c=ctx(1e9,sid,ON); const p=R.planNow('stomp',c,{});
  const pr=p.presets().map(x=>x.id+':'+(x.never?'never':(x.use/P.K.g).toExponential(3)));
  console.log(sid,'presets(kgf):',pr.join(' '), 'ceiling', JSON.stringify(p.ceiling().by), (p.ceiling().use/P.K.g).toExponential(3));
  // windows blast radius at 9.34e7 and 9.34e8 
  for (const u of [9.34e6,9.34e7,9.34e8]) { const r=p.run(u*P.K.g); console.log('  use',u.toExponential(2),'hole',r.holeDepth.toFixed(2),'blast windows R',P.blastRadius(R.MOVES.stomp.blast(r,p.opt),6900).toFixed(1)); }
}
// sand print cap Walk uses
const sp=P.walkStep(rex,surf('sand'),{effort:1,unbreakable:true}); console.log('walk sand unbreakable footprint',JSON.stringify(sp.footprint));
