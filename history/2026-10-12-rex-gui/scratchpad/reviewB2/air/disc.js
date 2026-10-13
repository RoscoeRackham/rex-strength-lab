const L='/home/user/rex-strength-lab/rex-strength-lab/';
const P=require(L+'src/engine.js');global.window={};require(L+'src/data.js');const D=window.DINO_DATA;
const K=P.K,g=K.g;const surf=id=>D.surfaces.find(s=>s.id===id);
const rex=P.makeBody({build:'rex',H:3.048,m:3007});
const bb=D.objects.find(o=>o.id==='baseball');
const ctxOf=(F,x)=>Object.assign({F,mode:'comic',body:rex,surface:surf('concrete'),anchor:'friction'},x||{});
const M=P.RESTRAINT.MOVES.throw;
// bisection on dial for v = 0.01c
let lo=10,hi=16;
for(let i=0;i<60;i++){const mid=(lo+hi)/2;const r=P.throwObject(ctxOf(Math.pow(10,mid)*g,{airAbsorb:1,keepForm:true,ownRecoil:true,unbreakable:true}),bb,0);if(r.v>0.01*K.c)hi=mid;else lo=mid;}
for(const lk of [lo-0.3,lo-1e-9,hi+1e-9]){
 const c=ctxOf(Math.pow(10,lk)*g,{airAbsorb:1,keepForm:true,ownRecoil:true,unbreakable:true});const r=P.throwObject(c,bb,0);
 const o={obj:bb,angle:0,body:rex,surface:surf('concrete'),airAbsorb:1,keepForm:true,ownRecoil:true,unbreakable:true,near:5};
 const b=M.blastParts(r,o);
 const h=P.handAir(rex,bb,r.v,1+r.Eobj/(bb.m*K.c*K.c));
 console.log('logKg',lk.toFixed(9),'v km/s',(r.v/1e3).toFixed(1),'rel',r.flight.relativistic,'blast parts',JSON.stringify(b),'max',M.blast(r,o).toExponential(3),'hand mAir v^2',(h.mAir*r.v*r.v).toExponential(3),'overpressure at 15 m of the hand air (Pa):',P.overpressureAt(h.mAir*r.v*r.v,15).toExponential(3));
}
// at what speed does mAir v^2 reach 6.9 kPa at 15 m?
const h=P.handAir(rex,bb,1000,1);for(const v of [500,1000,2000,3500,5000,10000]){console.log('v',v,'E',(h.mAir*v*v).toExponential(3),'dp15',P.overpressureAt(h.mAir*v*v,15).toFixed(0),'dp5',P.overpressureAt(h.mAir*v*v,5).toFixed(0));}
