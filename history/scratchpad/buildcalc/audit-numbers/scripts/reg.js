const {rows,COL,lstsq}=require('./ansur.js');
const d=require('/home/user/build-calc/data/builds.json');
const S=['chest','waist','arm_flexed','forearm','thigh','calf','neck'];
const K={chest:'chest',waist:'waist_omphalion',arm_flexed:'biceps_flexed',forearm:'forearm_flexed',thigh:'thigh_upper',calf:'calf',neck:'neck'};
for (const sx of ['M','F']){
  const R=rows[sx];
  const X=R.map(r=>[1,Math.log(r.stature/10)].concat(S.map(s=>Math.log(r[COL[s]]/10))));
  const y=R.map(r=>Math.log(r.weightkg/10));
  const c=lstsq(X,y);
  const res=R.map((r,i)=>y[i]-X[i].reduce((a,v,j)=>a+v*c[j],0));
  const smear=res.reduce((a,v)=>a+Math.exp(v),0)/R.length;
  const v=d.facts['ansur2_weight_regression_'+(sx==='F'?'female':'male')].values;
  const stored=[v.loglog_ln_intercept,v.loglog_ln_stature_cm].concat(S.map(s=>v['loglog_ln_'+K[s]+'_cm']));
  console.log(sx,'refit',c.map(x=>x.toFixed(5)).join(' '),'smear',smear.toFixed(5));
  console.log(sx,'store',stored.map(x=>(+x).toFixed(5)).join(' '),'smear',v.loglog_smearing_factor);
}
