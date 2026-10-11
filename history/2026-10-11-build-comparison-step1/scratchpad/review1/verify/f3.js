const B='/home/user/rex-strength-lab/build-comparison/';
const M=require(B+'src/measure.js'), Fig=require(B+'src/figure.js'), BC=require('/home/user/rex-strength-lab/build-calculator/src/calc.js');
const T=require(B+'data/outline.json'), calc=BC.create(require('/home/user/rex-strength-lab/build-calculator/data/builds.json'));
// the page's exampleSheet()
const r0=calc.compute({buildId:'ansur2_m_p50',heightM:1.8}); const g={}; BC.SITES.forEach(s=>g[s]=r0.girths[s].value);
const f=Fig.human(T,1.8,g,{},{buttockFit:BC.FRUSTUM.M.buttock,armDeg:35}); const y=f.dims.levels;
const img=Fig.renderSheet({front:f.front,side:f.side},1.8,{shoulder:y.acromion,chest:y.chest,waist:y.waist,crotch:y.crotch,knee:y.knee},{figurePx:700});
console.log('sheet',img.width,'x',img.height,'ground',img.ground,'skull row',Fig.sheetSkullRows(img,1.8).front);
for (const row of [null, Fig.sheetSkullRows(img,1.8).front, 640, 5000]) {
  const sk=row==null?null:{front:row,side:row,back:row};
  const r=M.measureSheet(img,{heightM:1.8,heightRef:sk?'skull':'top',skullRows:sk,order:['front','side','back'],density:1060,bodyFatPct:7.5,armK:1});
  console.log('\nskull rows',row,'ok',r.ok,'errors',r.errors);
  console.log(' checks:',r.checks.map(c=>(c.ok?'PASS ':'FAIL ')+c.name+' ['+c.detail+']').join(' || '));
  console.log(' warnings:',r.warnings.filter(w=>/tall|skull/.test(w)));
  if(r.volume_m3) console.log(' volume',r.volume_m3.value.toFixed(3),'mass',r.mass_kg.value.toExponential(3),'score',r.score.value.toFixed(1),'thigh cm',r.girths.thigh.value_m&&(r.girths.thigh.value_m*100).toFixed(1),'crotch height m',r.lengths.crotch_height&&r.lengths.crotch_height.toFixed(2),'head m',r.lengths.head&&r.lengths.head.toFixed(2));
  console.log(' landmarks.skull =',r.landmarks&&r.landmarks.skull,'| F.top =',r.frontLandmarks&&r.frontLandmarks.top);
}
