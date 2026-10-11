const {rows,COL}=require('./ansur.js');
const R=rows.M; const n=R.length;
const lw=R.map(r=>Math.log(r.weightkg/10)), lh=R.map(r=>Math.log(r.stature/1000));
const mean=a=>a.reduce((s,v)=>s+v,0)/a.length; const sd=a=>{const m=mean(a);return Math.sqrt(a.reduce((s,v)=>s+(v-m)**2,0)/(a.length-1));};
for (const s in COL){ const lg=R.map(r=>Math.log(r[COL[s]]/1000)); const x=lw.map((v,i)=>0.5*(v-lh[i])); const res=lg.map((v,i)=>v-x[i]); // residual after removing geometric law; SD around mean
 const res2=R.map((r,i)=>(r[COL[s]]/1000)/Math.exp(mean(res)+x[i])-1);
 console.log(s,'sd log %',(100*sd(res)).toFixed(2),'sd ratio %',(100*sd(res2)).toFixed(2)); }
console.log('--- variants');
for (const s in COL){ const lg=R.map(r=>Math.log(r[COL[s]]/1000)); const x=lw.map((v,i)=>0.5*(v-lh[i])); const res=lg.map((v,i)=>v-x[i]); const m=mean(res);
 const a=R.map((r,i)=>Math.exp(m+x[i])/(r[COL[s]]/1000)-1); // pred/obs-1
 // arithmetic-mean reference man
 const Wm=mean(R.map(r=>r.weightkg/10)), Hm=mean(R.map(r=>r.stature/1000)), Gm=mean(R.map(r=>r[COL[s]]/1000));
 const b=R.map(r=>(r[COL[s]]/1000)/(Gm*Math.sqrt((r.weightkg/10/Wm)/(r.stature/1000/Hm)))-1);
 const rms=x=>Math.sqrt(mean(x.map(v=>v*v)));
 console.log(s,'pred/obs sd',(100*sd(a)).toFixed(2),'arith-ref sd',(100*sd(b)).toFixed(2),'arith-ref rms',(100*rms(b)).toFixed(2));}
