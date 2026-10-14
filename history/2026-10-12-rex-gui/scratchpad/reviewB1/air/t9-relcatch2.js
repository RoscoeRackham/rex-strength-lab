const {P,D,obj,rex,surf}=require('./env.js');
const K=P.K;
const ollie=P.makeBody({build:'ollie',H:3.048,m:3007});
for (const [id,kg] of [['car',1e18],['car',1e20],['car',1e22],['shot',1e19],['bus',1e21]]) {
  const o=obj(id);
  const mk=(b)=>({F:kg*K.g,mode:'comic',body:b,surface:surf('concrete'),anchor:'friction',airAbsorb:1,keepForm:true,unbreakable:true,ownRecoil:true});
  const L=P.catchLeg(mk(rex()),mk(ollie),o,100,'hard');
  const k=L.catch; if(!k){console.log(id,kg,L.result);continue;}
  const pIn=P.vToMomentum(L.vArrive,o.m);
  const uMom=P.momentumToV(pIn,ollie.m+o.m);
  const pOut=P.vToMomentum(Math.min(k.uAfter,K.c*(1-1e-15)),ollie.m+o.m);
  console.log(id,'dial',kg.toExponential(0),'vArrive/c',(L.vArrive/K.c).toFixed(4),L.result,'uAfter/c',(k.uAfter/K.c).toFixed(4),'vs momentum-conserving',(uMom/K.c).toFixed(4),'Newtonian p_out/p_in',((ollie.m+o.m)*k.uAfter/pIn).toFixed(2),'slide',k.slide.toExponential(2),'m');
}
