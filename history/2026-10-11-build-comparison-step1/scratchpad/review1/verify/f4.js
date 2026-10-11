// The page's drawTarget(), line for line, in Node.
const B='/home/user/rex-strength-lab/build-comparison/';
const M=require(B+'src/measure.js'), Figure=require(B+'src/figure.js'), BC=require('/home/user/rex-strength-lab/build-calculator/src/calc.js');
const T=require(B+'data/outline.json'), calc=BC.create(require('/home/user/rex-strength-lab/build-calculator/data/builds.json'));
function drawTarget(id,tv){
  const r0=calc.compute({buildId:id,heightM:1.8}),gs={}; BC.SITES.forEach(s=>gs[s]=r0.girths[s].value);
  const H=1.8,fit=BC.FRUSTUM.M.buttock,base=Figure.human(T,H,gs,{},{buttockFit:fit,armDeg:35});
  const y=base.dims.levels,lv={shoulder:y.acromion,chest:y.chest,waist:y.waist,crotch:y.crotch,knee:y.knee};
  const make=(f,deg)=>Figure.human(T,H,gs,{},{buttockFit:fit,armDeg:deg,widthScale:f,legAxis:base.dims.legAxis});
  const sheetAt=(f,px)=>{const fig=make(f,Math.max(35,Figure.armRestAngle(d=>make(f,d))+2));const img=Figure.renderSheet({front:fig.front,side:fig.side},H,lv,{figurePx:px});
    return {img,r:M.measureSheet(img,{heightM:H,heightRef:'skull',skullRows:Figure.sheetSkullRows(img,H),density:1060,bodyFatPct:7.5,order:['front','side','back'],seg:{refine:0}})};};
  const passing=r=>r.ok&&r.score?r.score.value:NaN;
  const t0=Date.now();
  const sol=Figure.solveTarget(f=>passing(sheetAt(f,300).r),tv);
  if(sol.f==null) return {id,tv,none:sol,ms:Date.now()-t0};
  let f=sol.f,out=sheetAt(f,1000); const first=out.r.ok?out.r.score.value:NaN;
  for(let i=0;i<2&&out.r.ok&&Math.abs(out.r.score.value/tv-1)>0.005;i++){f*=Math.sqrt(tv/out.r.score.value);out=sheetAt(f,1000);}
  return {id,tv,f300:+sol.f.toFixed(3),s300:+sol.score.toFixed(1),first1000:+first.toFixed(1),f:+f.toFixed(3),ok:out.r.ok,final:out.r.ok?+out.r.score.value.toFixed(1):'FAIL '+out.r.checks.filter(c=>!c.ok).map(c=>c.name),miss:out.r.ok?((out.r.score.value/tv-1)*100).toFixed(1)+'%':'',ms:Date.now()-t0};
}
const cases=process.argv.slice(2).map(s=>s.split(':'));
for(const [id,tv] of cases) console.log(JSON.stringify(drawTarget(id,+tv)));
