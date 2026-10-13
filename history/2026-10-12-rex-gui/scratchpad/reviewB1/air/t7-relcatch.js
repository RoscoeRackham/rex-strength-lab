const {P,D,obj,rex,surf}=require('./env.js');
const K=P.K;
const ollie=P.makeBody({build:'ollie',H:3.048,m:3007});
const o=obj('baseball');
for (const kg of [1.81436948e23, 1e21, 1e19, 3e17]) {
  const mk=(b)=>({F:kg*K.g,mode:'comic',body:b,surface:surf('concrete'),anchor:'friction',airAbsorb:1,keepForm:true,unbreakable:true,ownRecoil:true});
  const L=P.catchLeg(mk(rex()),mk(ollie),o,100,'hard');
  const k=L.catch;
  if(!k){console.log(kg,L.result);continue;}
  const pIn=P.vToMomentum(L.vArrive,o.m);
  // correct: Ollie+ball final state if Ollie ends up carrying all the momentum (he slides): momentum pIn on mass M+m (+heat)
  const uOllie=P.momentumToV(pIn,ollie.m+o.m);
  console.log('dial',kg.toExponential(2),'vArrive/c',(L.vArrive/K.c).toFixed(6),'result',L.result,'F',k.F.toExponential(3),'slips',k.slips,'uAfter/c',(k.uAfter/K.c).toExponential(3),'slide',k.slide.toExponential(3),'E1/E0',k.firstShare.toExponential(3),'| momentum-only Ollie speed /c', (uOllie/K.c).toFixed(6), 'toGroundC',JSON.stringify(L.toGroundC));
}
