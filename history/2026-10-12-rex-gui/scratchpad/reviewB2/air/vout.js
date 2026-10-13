const L='/home/user/rex-strength-lab/rex-strength-lab/';
const P=require(L+'src/engine.js');global.window={};require(L+'src/data.js');const D=window.DINO_DATA;
const K=P.K,g=K.g;const surf=id=>D.surfaces.find(s=>s.id===id);
const rex=P.makeBody({build:'rex',H:3.048,m:3007});
const ctxOf=(F,x)=>Object.assign({F,mode:'comic',body:rex,surface:surf('concrete'),anchor:'friction'},x||{});
// scan objects, dials (log kg), shares, angles: find relativistic throws with keepForm whose vOut is between 11.2 km/s and 3000 km/s
const found=[];
for(const o of D.objects.filter(o=>!o.noThrow)){
 for(let lk=10;lk<=40;lk+=0.25){
  const F=Math.pow(10,lk)*g;
  for(const s of [0,0.5,0.8,0.9,0.95,0.99]){
   for(const ang of [0,10,30,60,90]){
   const c=ctxOf(F,{airAbsorb:s,keepForm:true,ownRecoil:true,unbreakable:true});
   const r=P.throwObject(c,o,ang);
   if(!r.canMove||!r.flight.relativistic||!isFinite(r.Eobj))continue;
   const fa=P.fastAir(o,r.Eobj,ang,1-s);
   if(fa.vOut>=580e3 && fa.vOut<765e3){found.push({o:o.id,lk,s,ang,v:r.v/1000,vOut:fa.vOut/1000});}
  }}
 }
}
console.log(found.length);
const seen=new Set();for(const f of found){const k=f.o+f.s+f.ang;if(seen.has(k))continue;seen.add(k);console.log(JSON.stringify(f));}
