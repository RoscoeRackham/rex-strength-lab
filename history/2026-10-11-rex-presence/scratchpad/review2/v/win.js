const P=require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
const body=P.makeBody({H:P.DEFAULT_BODIES.rex.H,m:P.DEFAULT_BODIES.rex.m,build:'rex'});
for (const E of [2.7e18,5e18,1e19,2e19,5e19,1e20]) {
  const g=P.grownBody(body,E,0.5); const I=P.instantGrowth(body,E,0.5);
  console.log(E.toExponential(1),'lnr',g.lnr.toFixed(4),'dpLo',I.dpLo.toFixed(0),'dpHi',I.dpHi.toFixed(0),'Elo',I.Elo.toExponential(2),'Ehi',I.Ehi.toExponential(2),
   'r(690Pa)',P.blastRadius(I.Ehi,690).toFixed(2),'r(364)',P.blastRadius(I.Ehi,364).toFixed(2), 'r(207)', P.blastRadius(I.Ehi,207).toFixed(2));
}
