const {rows,COL,q}=require('./ansur.js');
function med(a){return q(a,0.5);}
for (const [sx,bmiMin,diff] of [['M',28,200],['F',26,150]]){
 const R=rows[sx].filter(r=>{const bmi=(r.weightkg/10)/Math.pow(r.stature/1000,2);return bmi>=bmiMin && (r.chestcircumference-r.waistcircumference)>=diff;});
 const o={n:R.length,H:med(R.map(r=>r.stature/1000)),W:med(R.map(r=>r.weightkg/10))};
 for(const s in COL)o[s]=med(R.map(r=>r[COL[s]]/1000));
 console.log(sx,JSON.stringify(o));
}
// largest arm man
const M=rows.M.slice().sort((a,b)=>b.bicepscircumferenceflexed-a.bicepscircumferenceflexed);
for (const r of M.slice(0,3)){const o={id:r.subjectid,H:r.stature/1000,W:r.weightkg/10,bmi:((r.weightkg/10)/Math.pow(r.stature/1000,2)).toFixed(2)};for(const s in COL)o[s]=r[COL[s]]/1000;console.log(JSON.stringify(o));}
