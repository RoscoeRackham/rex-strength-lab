const R='/home/user/rex-strength-lab/';
const BC=require(R+'build-calculator/src/calc.js');
const builds=require(R+'build-calculator/data/builds.json');
const Fig=require(R+'build-comparison/src/figure.js');
const M=require(R+'build-comparison/src/measure.js');
const T=require(R+'build-comparison/data/outline.json');
const { measureTemplate } = require(R+'build-comparison/tools/export_targets.js');
const calc=BC.create(builds);
const H=1.8;
function views(id,f,armDeg){
  const r=calc.compute({buildId:id,heightM:H}); const g={}; for(const s of BC.SITES) g[s]=r.girths[s].value;
  const base=Fig.human(T,H,g,{},{buttockFit:BC.FRUSTUM.M.buttock});
  const fig=Fig.human(T,H,g,{},{buttockFit:BC.FRUSTUM.M.buttock,widthScale:f,legAxis:base.dims.legAxis,armDeg});
  const y=base.dims.levels;
  return {fig, levels:{shoulder:y.acromion,chest:y.chest,waist:y.waist,crotch:y.crotch,knee:y.knee}};
}
function meas(id,f,armDeg,px){
  const t=views(id,f,armDeg);
  const img=Fig.renderSheet({front:t.fig.front,side:t.fig.side},H,t.levels,{figurePx:px||800});
  const res=M.measureSheet(img,{heightM:H,heightRef:'top',density:1060,bodyFatPct:7.5});
  return res;
}
const L=require(R+'build-comparison/data/limits.json');
for (const tp of L.templates){
  const S1=measureTemplate(tp.id,H,1,800).res.score.value;
  const S1b=meas(tp.id,1,20,800).score.value;
  let line=tp.id.padEnd(22)+' S1 '+S1.toFixed(2)+' (stored '+tp.score_at_f1+')';
  for (const k of ['arms','thighs','face']){
    const f=tp[k].f;
    const r20=meas(tp.id,f,20,800), r60=meas(tp.id,f,60,800);
    line+=' | '+k+' f='+f.toFixed(3)+' S1f2='+(S1*f*f).toFixed(1)+' meas@20='+r20.score.value.toFixed(1)+(r20.ok?'':'(rej)')+' meas@60='+r60.score.value.toFixed(1)+(r60.ok?'':'(rej)');
  }
  console.log(line);
}
