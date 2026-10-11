const R='/home/user/rex-strength-lab/';
const BC=require(R+'build-calculator/src/calc.js');
const builds=require(R+'build-calculator/data/builds.json');
const settings=require(R+'build-comparison/data/settings.json');
const Compare=require(R+'build-comparison/src/model.js');
const Fig=require(R+'build-comparison/src/figure.js');
const M=require(R+'build-comparison/src/measure.js');
const T=require(R+'build-comparison/data/outline.json');
const calc=BC.create(builds);
const model=Compare.create(calc,{builds:settings.builds,fat_classes:settings.fat_classes});
for (const id of ['ansur2_m_p50','ronnie_coleman','wolverine']){
  const e=model.evaluate(id); const g={}; BC.SITES.forEach(s=>g[s]=e.girths[s].value);
  const H=e.height.value, f=Fig.human(T,H,g,{},{buttockFit:BC.FRUSTUM.M.buttock,armDeg:35}), y=f.dims.levels;
  const img=Fig.renderSheet({front:f.front,side:f.side},H,{shoulder:y.acromion,chest:y.chest,waist:y.waist,crotch:y.crotch,knee:y.knee},{figurePx:600});
  const r=M.measureSheet(img,{heightM:H,heightRef:'top',density:1000,bodyFatPct:0,seg:{refine:0}});
  console.log(id, 'ok',r.ok, 'vol', r.volume_m3 && r.volume_m3.value, r.errors);
}
