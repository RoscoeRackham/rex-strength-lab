const L='/home/user/rex-strength-lab/rex-strength-lab/';
const P=require(L+'src/engine.js');global.window={};require(L+'src/data.js');const D=window.DINO_DATA;
const K=P.K,g=K.g;const surf=id=>D.surfaces.find(s=>s.id===id);
const rex=P.makeBody({build:'rex',H:3.048,m:3007});
const bb=D.objects.find(o=>o.id==='baseball');
const ON={airAbsorb:1,keepForm:true,unbreakable:true,ownRecoil:true};
const c=Object.assign({F:Math.pow(10,23.258726)*g,mode:'comic',body:rex,surface:surf('concrete'),anchor:'friction'},ON);
const r=P.throwObject(c,bb,0);
const gam=1+r.Eobj/(bb.m*K.c*K.c);
const h=P.handAir(rex,bb,r.v,gam);
const W=r.push.EA+r.push.EB; // energy his push put in (object+hand, recoil)
console.log('gamma',gam.toExponential(3),'Eobj',r.Eobj.toExponential(3),'hand E (code, gamma)',h.E.toExponential(3),'TNT t',(h.E/4.184e9).toExponential(2),'| gamma^2 piston',(gam*gam*h.mAir*r.v*r.v).toExponential(3),'TNT t',(gam*gam*h.mAir*r.v*r.v/4.184e9).toExponential(2),'| ramp /3',(gam*gam*h.mAir*r.v*r.v/3).toExponential(3),'| push work EA+EB',W.toExponential(3),'F*d',(r.F*h.d).toExponential(3),'| drag force on hand at release gamma^2 rho A c^2',(gam*gam*K.rho0*h.area*K.c*K.c).toExponential(3),'N vs his drive',r.Fdrive.toExponential(3));
