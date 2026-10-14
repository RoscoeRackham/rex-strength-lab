const {P,D,rex,surf,ON,OFF,ctx}=require('./h.js');
const R=P.RESTRAINT;
for (const sid of ['granite','concrete']) {
  const c=ctx(1e9,sid,ON); const p=R.planNow('jump',c,{target:1});
  console.log(sid,'presets',p.presets().map(x=>x.id+':'+(x.never?'never':(x.use/P.K.g).toExponential(3))).join(' '),'ceiling',p.ceiling().by,(p.ceiling().use/P.K.g).toExponential(3));
  console.log('  hazards',p.hazards().map(x=>x.id+':'+(x.never?'never':(x.use/P.K.g).toExponential(3))).join(' '));
}
