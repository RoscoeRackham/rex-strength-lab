const L='/home/user/rex-strength-lab/rex-strength-lab/';
const P=require(L+'src/engine.js');global.window={};require(L+'src/data.js');const D=window.DINO_DATA;
const K=P.K,g=K.g;const ob=id=>D.objects.find(o=>o.id===id);const surf=id=>D.surfaces.find(s=>s.id===id);
const rex=P.makeBody({build:'rex',H:3.048,m:3007});
const ctxOf=(F,x)=>Object.assign({F,mode:'comic',body:rex,surface:surf('concrete'),anchor:'friction'},x||{});
const allstar=200e18*907.18474*g;
const bb=ob('baseball');
for(const s of [0,0.5,0.9,0.99,1]){
 const c=ctxOf(allstar,{airAbsorb:s,keepForm:s>0});const r=P.throwObject(c,bb,0);
 const gam=1+r.Eobj/(bb.m*K.c*K.c);
 const parts=P.RESTRAINT.MOVES.throw.blastParts(r,{obj:bb,angle:0,body:rex,airAbsorb:s});
 const fa=P.fastAir(bb,r.Eobj,0,1-s);
 const h=P.handAir(rex,bb,r.v,gam);
 console.log(`s=${s} v/c=${(r.v/K.c)} gamma=${gam.toExponential(3)} Eobj=${r.Eobj.toExponential(3)} land=${parts.land.toExponential(3)} path=${parts.path.toExponential(3)} fa.Eair/Eair0=${(fa.Eair/fa.Eair0)} keep=${fa.keep} x=${fa.x.toFixed(0)} dHalf=${fa.dHalf} vOut/c=${fa.vOut/K.c} hand mAir=${h.mAir.toExponential(3)} handE=${h.E.toExponential(3)} gamma^2 version=${(gam*gam*h.mAir*K.c*K.c).toExponential(3)} handMass=${(rex.whipEff).toFixed(3)} hand KE=${((gam-1)*rex.whipEff*K.c*K.c).toExponential(3)}`);
 // heat-only version
 const S=(xx)=>Math.sqrt((1+xx)**2+2*(gam-1)*xx);const heat=xx=>2*r.Eobj*xx/(S(xx)+1+xx);
 console.log('   heat(kx)/heat(x)=',(heat((1-s)*fa.x)/heat(fa.x)), 'heat(x)/E=',heat(fa.x)/r.Eobj);
}
