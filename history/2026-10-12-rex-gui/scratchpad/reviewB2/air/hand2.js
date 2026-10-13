const L='/home/user/rex-strength-lab/rex-strength-lab/';
const P=require(L+'src/engine.js');global.window={};require(L+'src/data.js');const D=window.DINO_DATA;
const K=P.K,g=K.g;const surf=id=>D.surfaces.find(s=>s.id===id);
const rex=P.makeBody({build:'rex',H:3.048,m:3007});
const bb=D.objects.find(o=>o.id==='baseball');
const ON={airAbsorb:1,keepForm:true,unbreakable:true,ownRecoil:true};
const c=Object.assign({F:1e9*g,mode:'comic',body:rex,surface:surf('concrete'),anchor:'friction'},ON);
const r=P.throwObject(c,bb,0);
const h=P.handAir(rex,bb,r.v,1);
console.log('v',r.v,'mach',r.v/K.a0,'hand mAir',h.mAir,'area',h.area,'d',h.d,'E',h.E.toExponential(3),'dp at 15 m',P.overpressureAt(h.E,15).toExponential(3),'(windows 6900 Pa); radius for 6900 Pa',P.blastRadius(h.E,6900).toFixed(1),'m; houses 26800 Pa radius',P.blastRadius(h.E,26800).toFixed(1));
// punch tab comparison: the punch at the same dial
const pu=P.punch(c);console.log('punch vFist',pu.vFist,'E',pu.E.toExponential(3),'blast radius 6900',P.blastRadius(pu.E,6900).toFixed(1));
