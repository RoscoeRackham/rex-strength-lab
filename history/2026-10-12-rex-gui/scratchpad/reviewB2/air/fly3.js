const L='/home/user/rex-strength-lab/rex-strength-lab/';
const P=require(L+'src/engine.js');global.window={};require(L+'src/data.js');const D=window.DINO_DATA;
const K=P.K;const ob=id=>D.objects.find(o=>o.id===id);
for(const [id,v0,th] of [['car',300,45],['baseball',1500,45],['baseball',300,30],['car',3000,20],['pyramid',700,45]]){
 const o=ob(id);const h0=2.5;let prevR=-1,prevA=Infinity,mono=true;
 const rows=[];
 for(const s of [0,0.1,0.25,0.5,0.75,0.9,0.99,1]){
  const f=P.fly({v0,thetaDeg:th,h0,m:o.m,A:o.area,Cd:o.Cd,CdSup:o.CdSup,dragK:s===0?undefined:1-s});
  const E0=0.5*o.m*v0*v0+o.m*(K.GM/K.R_E-K.GM/(K.R_E+h0)), Eimp=0.5*o.m*f.vImpact*f.vImpact;
  const bal=E0-Eimp; const airE=f.air?f.air.E:bal;
  if(!(f.range>=prevR-1e-6))mono=false; if(!(airE<=prevA*(1+1e-9)+1e-9))mono=false; prevR=f.range;prevA=airE;
  rows.push(`s=${s} range=${f.range.toFixed(1)} air.E=${airE.toExponential(3)} balance=${bal.toExponential(3)} ratio=${(airE/bal).toFixed(4)} ocean=${f.ocean?f.ocean.E.toExponential(3):'-'} eFold=${f.eFold.toExponential(3)}`);
 }
 console.log(id,v0,th,'monotone',mono);rows.forEach(r=>console.log('  ',r));
}
