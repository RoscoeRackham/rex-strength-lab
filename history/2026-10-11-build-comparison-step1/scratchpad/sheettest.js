const M=require('/home/user/rex-strength-lab/build-comparison/src/measure.js');
const png=require('/home/user/rex-strength-lab/build-comparison/tools/png.js');
const T=require('/home/user/rex-strength-lab/build-comparison/tools/trace_turnarounds.js');
for (const name of ['rex','ollie']) {
  const R=T.READINGS[name];
  const img=png.read('/home/user/rex-strength-lab/build-comparison/'+R.file);
  const ex={}; for(const v of R.order) ex[v]=R.views[v].tail?[R.views[v].tail]:[];
  const skull={}; for(const v of R.order) skull[v]=R.views[v].skull;
  const t=Date.now();
  const r=M.measureSheet(img,{heightM: name==='rex'?2.923:2.91, heightRef:'skull', skullRows:skull, order:R.order, exclude:ex, seg:{ignore:R.ignore}});
  console.log('==',name, Date.now()-t,'ms ok',r.ok);
  console.log(' errors',r.errors); console.log(' warnings',r.warnings);
  console.log(' checks',r.checks.map(c=>(c.ok?'OK ':'XX ')+c.name+': '+c.detail).join('\n   '));
  console.log(' rows',JSON.stringify(r.landmarks.front), 'back', JSON.stringify(r.landmarks.back));
  console.log(' arms',r.landmarks.arms.map(a=>a&&JSON.stringify({ang:a.angleDeg.toFixed(1),pit:a.armpit,end:a.end,up:a.upper&&a.upper.w.toFixed(0),el:a.elbow&&a.elbow.row,fo:a.fore&&a.fore.w.toFixed(0)})));
  console.log(' vol',JSON.stringify(r.volume_m3,(k,v)=>typeof v==='number'?+v.toFixed(3):v));
  console.log(' mass',r.mass_kg.value.toFixed(0),'score',r.score.value.toFixed(1),r.score.low.toFixed(1),r.score.high.toFixed(1),'ffmi',r.ffmi.toFixed(0));
  console.log(' girths',Object.entries(r.girths).map(([k,g])=>k+' '+(g.value_m?g.value_m.toFixed(2):'?')).join(', '));
  console.log(' lengths',JSON.stringify(r.lengths,(k,v)=>typeof v==='number'?+v.toFixed(3):v), 'frontal', r.frontal_area_m2.toFixed(2));
}
