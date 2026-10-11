// Drawn figure volume x body density (Siri, from the build's working fat) vs the build's weight.
const BC=require('/home/user/rex-strength-lab/build-calculator/src/calc.js'); const b=require('/home/user/rex-strength-lab/build-calculator/data/builds.json');
const S=require('/home/user/rex-strength-lab/build-comparison/data/settings.json'); const M=require('/home/user/rex-strength-lab/build-comparison/src/model.js');
const F=require('/home/user/rex-strength-lab/build-comparison/src/figure.js'); const T=require('/home/user/rex-strength-lab/build-comparison/data/outline.json'); const Me=require('/home/user/rex-strength-lab/build-comparison/src/measure.js');
const c=BC.create(b); const m=M.create(c,S);
const rows=[];
for (const e of m.all()) {
  if (e.group==='Rex and Ollie') continue;
  const g={}; BC.SITES.forEach(s=>g[s]=e.girths[s].value);
  const H=e.height.value, f=F.human(T,H,g,{}, {buttockFit: BC.FRUSTUM.M.buttock, armDeg:35}); const y=f.dims.levels;
  const img=F.renderSheet({front:f.front, side:f.side},H,{shoulder:y.acromion,chest:y.chest,waist:y.waist,crotch:y.crotch,knee:y.knee},{figurePx:800});
  const r=Me.measureSheet(img,{heightM:H,heightRef:'top',density:1000,bodyFatPct:0, seg:{refine:0}});
  const fat=e.bodyFat.value/100, rho=1/(fat/0.9007+(1-fat)/1.1)*1000;
  const W=e.build.girth_basis_weight_kg||e.build.weight_kg.value;
  rows.push([e.id, e.group, (r.volume_m3.value*rho/W).toFixed(3)]);
}
rows.sort((a,b)=>a[2]-b[2]); rows.forEach(r=>console.log(r.join('\t')));
const v=rows.map(r=>+r[2]); console.log('median', v.sort()[v.length>>1], 'min', Math.min(...v), 'max', Math.max(...v));
