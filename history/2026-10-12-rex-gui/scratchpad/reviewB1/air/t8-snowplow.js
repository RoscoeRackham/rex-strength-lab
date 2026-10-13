const {P,D,obj,rex,surf}=require('./env.js');
const K=P.K, c2=K.c*K.c;
const o=obj('baseball');
const ctx={F:1.81436948e23*K.g,mode:'comic',body:rex(),surface:surf('concrete'),anchor:'friction',airAbsorb:0,keepForm:true,unbreakable:true,ownRecoil:true};
const r=P.throwObject(ctx,o,0); const E=r.Eobj, m=o.m, G=E/(m*c2);
for (const k of [1,0.5]) {
  const fa=P.fastAir(o,E,0,k); const x=k*fa.x;
  const S=Math.sqrt((1+x)**2+2*G*x), gf=(1+G+x)/S;
  const heatRest=(S-1-x)*m*c2;
  console.log('k',k,'E',E.toExponential(3),'gamma-1',G.toExponential(3),'x',x.toExponential(3),'| fastAir fireball',(fa.E/E*100).toFixed(2)+'%','keep',(fa.keep*100).toFixed(1)+'%','| snowplow: final gamma',gf.toFixed(3),'ball KE kept',((gf-1)*m*c2/E*100).toExponential(2)+'%','lab energy of heat (moving)',(gf*heatRest/E*100).toFixed(1)+'%','swept-air bulk KE',((gf-1)*x*m*c2/E*100).toFixed(1)+'%','check sum',((gf*heatRest+(gf-1)*x*m*c2+(gf-1)*m*c2)/E*100).toFixed(2)+'%');
}
// main's text criterion: m/A > column
const column=K.rho0*K.Hs/0.03; console.log('m/A',(m/o.area).toFixed(1),'kg/m2 vs level air column',column.toFixed(0),'kg/m2 -> air column is',(column*o.area/m).toFixed(0),'x its mass; main sweep length m/(rho0 A) =',(m/(K.rho0*o.area)).toFixed(1),'m');
