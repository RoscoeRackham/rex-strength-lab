'use strict';
const fs=require('fs'), path=require('path');
const RAW='/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/buildcalc/ansur2/raw';
function readCsv(f){const L=fs.readFileSync(f,'latin1').trim().split(/\r?\n/);const h=L[0].split(',').map(s=>s.trim().toLowerCase());return L.slice(1).map(l=>{const c=l.split(',');const o={};h.forEach((k,i)=>{const v=Number(c[i]);o[k]=Number.isFinite(v)?v:c[i];});return o;});}
const rows={M:readCsv(path.join(RAW,'ANSUR_II_MALE_Public.csv')),F:readCsv(path.join(RAW,'ANSUR_II_FEMALE_Public.csv'))};
const COL={chest:'chestcircumference',waist:'waistcircumference',arm_flexed:'bicepscircumferenceflexed',forearm:'forearmcircumferenceflexed',thigh:'thighcircumference',calf:'calfcircumference',neck:'neckcircumference'};
function q(a,p){const s=a.slice().sort((x,y)=>x-y);const i=(s.length-1)*p;const lo=Math.floor(i),hi=Math.ceil(i);return s[lo]+(s[hi]-s[lo])*(i-lo);}
function lstsq(X,y){const n=X[0].length;const A=Array.from({length:n},()=>new Array(n).fill(0));const b=new Array(n).fill(0);for(let r=0;r<X.length;r++){for(let i=0;i<n;i++){b[i]+=X[r][i]*y[r];for(let j=0;j<n;j++)A[i][j]+=X[r][i]*X[r][j];}}
for(let i=0;i<n;i++){let p=i;for(let k=i+1;k<n;k++)if(Math.abs(A[k][i])>Math.abs(A[p][i]))p=k;[A[i],A[p]]=[A[p],A[i]];[b[i],b[p]]=[b[p],b[i]];for(let k=i+1;k<n;k++){const f=A[k][i]/A[i][i];for(let j=i;j<n;j++)A[k][j]-=f*A[i][j];b[k]-=f*b[i];}}
const x=new Array(n).fill(0);for(let i=n-1;i>=0;i--){let s=b[i];for(let j=i+1;j<n;j++)s-=A[i][j]*x[j];x[i]=s/A[i][i];}return x;}
module.exports={rows,COL,q,lstsq};
if(require.main===module){
 const data=require('/home/user/build-calc/data/builds.json');
 for(const sx of ['M','F']){
  const R=rows[sx];
  console.log('==',sx,'n',R.length,'maxBMI',Math.max(...R.map(r=>(r.weightkg/10)/Math.pow(r.stature/1000,2))).toFixed(3));
  for(const p of [0.05,0.5,0.95]){
    const o={H:q(R.map(r=>r.stature/1000),p).toFixed(4),W:q(R.map(r=>r.weightkg/10),p).toFixed(2)};
    for(const s in COL)o[s]=q(R.map(r=>r[COL[s]]/1000),p).toFixed(4);
    console.log(' p'+p*100, JSON.stringify(o));
  }
  // predictor / allometry fits
  const out={};
  for(const s in COL){const X=R.map(r=>[1,Math.log(r.weightkg/10),Math.log(r.stature/1000)]);const y=R.map(r=>Math.log(r[COL[s]]/10));const c=lstsq(X,y);
   const res=R.map((r,i)=>y[i]-(c[0]+c[1]*X[i][1]+c[2]*X[i][2]));const sd=Math.sqrt(res.reduce((a,v)=>a+v*v,0)/(R.length-3));
   out[s]={A:Math.exp(c[0]).toFixed(4),p:c[1].toFixed(4),q:c[2].toFixed(4),sd:(100*sd).toFixed(2)};}
  console.log(' fit ln G_cm = lnA + p lnW + q lnH_m:',JSON.stringify(out));
 }
}
