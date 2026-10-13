const L='/home/user/rex-strength-lab/rex-strength-lab/';
const P=require(L+'src/engine.js');global.window={};require(L+'src/data.js');const D=window.DINO_DATA;
const K=P.K,g=K.g;const surf=id=>D.surfaces.find(s=>s.id===id);
const rex=P.makeBody({build:'rex',H:3.048,m:3007});
const ctxOf=(F,x)=>Object.assign({F,mode:'comic',body:rex,surface:surf('concrete'),anchor:'bolted'},x||{});
const M=P.RESTRAINT.MOVES.throw;
const rows=[];
for(const o of D.objects.filter(o=>!o.noThrow)){
 for(let lk=4;lk<=14;lk+=0.5){for(const ang of [10,30,45,70]){
  const F=Math.pow(10,lk)*g;
  const r0=P.throwObject(ctxOf(F,{airAbsorb:0}),o,ang), r5=P.throwObject(ctxOf(F,{airAbsorb:0.5}),o,ang);
  if(!r0.canMove||r0.flight.relativistic||r0.v<K.a0)continue;
  const b0=M.blastParts(r0,{obj:o,angle:ang,airAbsorb:0}),b5=M.blastParts(r5,{obj:o,angle:ang,airAbsorb:0.5});
  const air5=r5.flight.air?r5.flight.air.E:null;
  if(b5.path>b5.land && b0.path>0){
   const ratio=b5.path/b0.path, airRatio=air5/b0.path;
   if(ratio<0.4) rows.push({o:o.id,lk,ang,v:Math.round(r0.v),ratio:+ratio.toFixed(3),air5_over_air0:+airRatio.toFixed(3),land5:b5.land.toExponential(2),path5:b5.path.toExponential(2),path0:b0.path.toExponential(2),landed0:r0.flight.landed,landed5:r5.flight.landed});
  }
 }}
}
console.log(rows.length);rows.slice(0,30).forEach(r=>console.log(JSON.stringify(r)));
