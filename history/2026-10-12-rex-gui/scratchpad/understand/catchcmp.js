global.window={};
const P0=require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
const P=require('./engine-trial.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D=window.DINO_DATA, K=P.K, g=K.g;
const surface=D.surfaces.find(s=>s.id==='concrete');
const rex=P.makeBody({build:'rex',H:3.048,m:3007}), ollie=P.makeBody({build:'ollie',H:3.048,m:3007});
const sig=(x)=>typeof x==='number'?Number(x.toPrecision(4)):x;
const obj=(id)=>D.objects.find(o=>o.id===id);
const mk=(F,b,x)=>Object.assign({F,mode:'comic',body:b,surface,groundHolds:false,anchor:'friction'},x||{});
// identity at airAbsorb 0 vs original for catch legs
let diff=0;
for (const [lk,id,Dd,st] of [[4.96,'baseball',10,'easy'],[4.96,'baseball',10,'hard'],[9,'car',31.6,'hard'],[12,'baseball',31.6,'hard'],[7,'car',1e4,'easy'],[30,'pyramid',200,'hard'],[23.26,'baseball',10,'hard']]) {
  const a=P0.catchLeg(mk(Math.pow(10,lk)*g,rex),mk(Math.pow(10,lk)*g,ollie),obj(id),Dd,st);
  const b=P.catchLeg(mk(Math.pow(10,lk)*g,rex,{airAbsorb:0}),mk(Math.pow(10,lk)*g,ollie,{airAbsorb:0}),obj(id),Dd,st);
  const ja=JSON.stringify(a,(k,v)=>k==='path'?undefined:v), jb=JSON.stringify(b,(k,v)=>k==='path'||k==='oceanE'?undefined:v);
  if (ja!==jb) { diff++; console.log('DIFF',lk,id,Dd,st); }
}
console.log('catch identity diffs at share 0:',diff);
for (const [lk,id,Dd,st] of [[12,'baseball',31.6,'hard'],[9,'car',31.6,'hard'],[Math.log10(90718.474),'baseball',10,'hard'],[Math.log10(90718.474),'baseball',1e4,'easy'],[7,'car',1e4,'easy'],[23.2587,'baseball',10,'hard'],[Math.log10(90718.474),'person',10,'hard']]) {
  for (const s of [0,0.5,1]) {
    const t0=Date.now();
    const L=P.catchLeg(mk(Math.pow(10,lk)*g,rex,{airAbsorb:s}),mk(Math.pow(10,lk)*g,ollie,{airAbsorb:s}),obj(id),Dd,st);
    const ms=Date.now()-t0;
    console.log(id,'10^'+sig(lk),'D',Dd,st,'s='+s,'->',L.result,'vL',sig(L.aim?L.aim.vL:L.vL),'vArrive',sig(L.vArrive),'dragE',sig(L.drag&&L.drag.E),'oceanE',sig(L.flight&&L.flight.oceanE),'heat',L.heat&&L.heat.kind,'qDyn',sig(L.qDynMax),'shockPa',sig(L.shockPa),'fb',L.fireball?JSON.stringify({kind:L.fireball.kind,Egap:sig(L.fireball.Egap),sweep:sig(L.fireball.sweep),Eblast:sig(L.fireball.Eblast)}):'', 'ms',ms);
  }
}
