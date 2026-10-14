const {P,D,obj,rex,surf}=require('./env.js');
const K=P.K,c2=K.c*K.c;
const o=obj('baseball'), b=rex();
const c={F:1.81436948e23*K.g,mode:'comic',body:b,surface:surf('concrete'),anchor:'friction',airAbsorb:1,keepForm:true,unbreakable:true,ownRecoil:true};
const r=P.throwObject(c,o,0);
const mh=r.armMass, A=b.palmArea, d=b.strokes.whip, G=r.Eobj/(o.m*c2), Eh=G*mh*c2;
const x=K.rho0*A*d/mh, S=Math.sqrt((1+x)**2+2*G*x), heat=2*Eh*x/(S+1+x);
console.log('hand+forearm mass',mh.toFixed(2),'kg at the release speed (gamma-1 =',G.toExponential(3)+'), its KE',Eh.toExponential(2),'J vs ball',r.Eobj.toExponential(2),'J; air swept over the',d.toFixed(2),'m stroke',(x*mh).toFixed(3),'kg (x =',x.toFixed(4)+'); snowplow heat at the release speed',heat.toExponential(2),'J =',(heat/4.184e9/1e9).toFixed(0),'Gt TNT; blast hazard at 100%:',P.RESTRAINT.MOVES.throw.blast(r,{obj:o,angle:0,airAbsorb:1}));
