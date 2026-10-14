const L='/home/user/rex-strength-lab/rex-strength-lab/';
const P=require(L+'src/engine.js');global.window={};require(L+'src/data.js');const D=window.DINO_DATA;
const K=P.K,g=K.g;const surf=id=>D.surfaces.find(s=>s.id===id);
const rex=P.makeBody({build:'rex',H:3.048,m:3007}),ollie=P.makeBody({build:'ollie',H:3.048,m:3007});
const bb=D.objects.find(o=>o.id==='baseball');
for(const s of [1,0.9999,0.99,0.5]){
const ON={airAbsorb:s,keepForm:true,unbreakable:true,ownRecoil:true};
const F=1e16*g;
const cR=Object.assign({F,mode:'comic',body:rex,surface:surf('concrete'),anchor:'friction'},ON),cO=Object.assign({},cR,{body:ollie});
const Lg=P.catchLeg(cR,cO,bb,100,'hard');
const fb=Lg.fireball;
console.log('share',s,'result',Lg.result,'kept',Lg.kept,'kind',fb&&fb.kind,'Egap/E',fb&&(fb.Egap/fb.E),'Eblast',fb&&fb.Eblast.toExponential(3),'vL/c',(Lg.vL||Lg.aim.vL)/K.c,'catch',Lg.catch&&{carried:Lg.catch.carried,u:Lg.catch.uAfter/K.c,Ecatch:Lg.catch.Ecatch.toExponential(3)});
}
