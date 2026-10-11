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
const ids=['bruce_banner','ansur2_m_p5','ansur2_m_p50','ansur2_m_p95','nhanes_m_median','kouri1995_nonusers','steve_reeves_1947','ronnie_coleman','big_ramy','brian_shaw','eddie_hall','hafthor_bjornsson','wolverine','kingpin','thor','hulk_savage','abomination','juggernaut'];
for (const id of ids){
  const e=model.evaluate(id); const g={}; BC.SITES.forEach(s=>g[s]=e.girths[s].value);
  const H=e.height.value;
  const res=[];
  for (const deg of [20,35,60]){
    const f=Fig.human(T,H,g,{},{buttockFit:BC.FRUSTUM.M.buttock,armDeg:deg}); const y=f.dims.levels;
    const img=Fig.renderSheet({front:f.front,side:f.side},H,{shoulder:y.acromion,chest:y.chest,waist:y.waist,crotch:y.crotch,knee:y.knee},{figurePx:1200});
    const r=M.measureSheet(img,{heightM:H,heightRef:'top',density:1060,bodyFatPct:7.5});
    res.push(r);
  }
  const W=e.mass.value, fat=e.bodyFat.value/100, rho=1000/(fat/0.9007+(1-fat)/1.1);
  const v=res[1].volume_m3.value;
  console.log(id.padEnd(20),'H',H.toFixed(2),'W',W.toFixed(1),'| V(20,35,60deg)',res.map(r=>r.volume_m3.value.toFixed(4)).join(','),'| mass@1060 (35deg)',(v*1060).toFixed(1),'ratio',(v*1060/W).toFixed(3),'| Siri rho',rho.toFixed(0),'ratio',(v*rho/W).toFixed(3), 'ok',res.map(r=>r.ok).join(','));
}
