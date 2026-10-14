const L='/home/user/rex-strength-lab/rex-strength-lab/';
const P=require(L+'src/engine.js');global.window={};require(L+'src/data.js');const D=window.DINO_DATA;
const K=P.K,g=K.g;const surf=id=>D.surfaces.find(s=>s.id===id);
const rex=P.makeBody({build:'rex',H:3.048,m:3007}),ollie=P.makeBody({build:'ollie',H:3.048,m:3007});
const bb=D.objects.find(o=>o.id==='baseball');
const ON={airAbsorb:1,keepForm:true,unbreakable:true,ownRecoil:true};
const F=200e18*907.18474*g;
const cR=Object.assign({F,mode:'comic',body:rex,surface:surf('concrete'),anchor:'friction'},ON),cO=Object.assign({},cR,{body:ollie});
for(const Dd of [11000,12500,20000]){
const Lg=P.catchLeg(cR,cO,bb,Dd,'hard');
const R=K.R_E,h0=rex.releaseHeight,h1=ollie.releaseHeight;
// independent: thrower at angle 0 radius R+h0; catcher at central angle phi=Dfl/R radius R+h1 (2D). find line-sphere intersection numerically by marching
const phi=Lg.Dfl/R;const A=[0,R+h0],B=[(R+h1)*Math.sin(phi),(R+h1)*Math.cos(phi)];
let hit=null;const N=2e6;for(let i=1;i<=N;i++){const t=i/N;const x=A[0]+(B[0]-A[0])*t,y=A[1]+(B[1]-A[1])*t;if(Math.hypot(x,y)<R){hit={t,s:R*Math.atan2(x,y)};break;}}
// impact angle: angle between chord direction and local horizontal at the hit point
let ang=null;if(hit){const x=A[0]+(B[0]-A[0])*hit.t,y=A[1]+(B[1]-A[1])*hit.t;const d=[B[0]-A[0],B[1]-A[1]];const dl=Math.hypot(...d);const rr=Math.hypot(x,y);ang=Math.asin(-(x*d[0]+y*d[1])/(rr*dl))*180/Math.PI;}
console.log('D',Dd,'result',Lg.result,'aim',Lg.aim&&Lg.aim.thetaDeg,'hitAt',Lg.hitsGround&&Lg.hitsGround.at,'indep',hit&&hit.s,'impact angle true deg',ang,'code uses',Lg.aim&&-Lg.aim.thetaDeg,'crater',Lg.hitsGround&&Lg.hitsGround.crater);
}
