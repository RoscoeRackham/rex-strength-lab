const L='/home/user/rex-strength-lab/rex-strength-lab/';
const P=require(L+'src/engine.js');global.window={};require(L+'src/data.js');const D=window.DINO_DATA;
const K=P.K,g=K.g;const surf=id=>D.surfaces.find(s=>s.id===id);
const rex=P.makeBody({build:'rex',H:3.048,m:3007}),ollie=P.makeBody({build:'ollie',H:3.048,m:3007});
const ON={airAbsorb:1,keepForm:true,unbreakable:true,ownRecoil:true};
const F=Math.pow(10,23.2587)*g;
const cR=Object.assign({F,mode:'comic',body:rex,surface:surf('concrete'),anchor:'friction'},ON),cO=Object.assign({},cR,{body:ollie});
const Lg=P.catchLeg(cR,cO,D.objects.find(o=>o.id==='baseball'),100,'hard');
const k=Lg.catch;
console.log('result',Lg.result,'fast',Lg.fast,'time',Lg.time,'vArrive/c',Lg.vArrive/K.c,'chord',Lg.chord,'Dfl',Lg.Dfl,'aim',Lg.aim.thetaDeg);
console.log('pIn',k.pIn.toExponential(4),'mh',k.mh,'v1/c',k.v1/K.c,'E1',k.E1.toExponential(4),'Ediss',k.Ediss.toExponential(4),'F',k.F.toExponential(3),'Fneed',k.Fneed.toExponential(3),'tStroke',k.tStroke,'uAfter/c',k.uAfter/K.c,'carried',k.carried,'slide',k.slide,'Ecatch',k.Ecatch.toExponential(3));
// independent
const c=K.c,c2=c*c,m=0.1453,mh=k.mh,M=ollie.m;
const E0=P.momentumToKE(k.pIn,m),gam=1+E0/(m*c2);
const M1=Math.sqrt(m*m+mh*mh+2*gam*m*mh);const E1=(M1-m-mh)*c2;
const Etot=gam*m*c2+M*c2;const pc=k.pIn*c;const Mf=Math.sqrt(Etot*Etot-pc*pc)/c2;const u=pc/Etot;
console.log('indep: gamma',gam.toExponential(4),'M1',M1,'E1',E1.toExponential(4),'Mf',Mf,'u/c',u,'Ediss',((Mf-M1-(M-mh))*c2).toExponential(4),'KE carried',(Etot-Mf*c2).toExponential(4),'TNT Gt',(Etot-Mf*c2)/4.184e18);
// air ride: Ollie at u through sea-level air
const gf=1/Math.sqrt(1-u*u);const A=ollie.frontArea;console.log('ollie front area',A,'unit (own mass of air) m',Mf/(1.225*A),'gamma_f',gf);
const rt=P.CATCHGAME?null:null;
const g2=P.catchGame?P.catchGame(cR,cO,D.objects.find(o=>o.id==='baseball'),100,'hard'):null;
if(g2)console.log('round trip',g2.round,'b result',g2.b.result,g2.b.catch&&g2.b.catch.carried);
