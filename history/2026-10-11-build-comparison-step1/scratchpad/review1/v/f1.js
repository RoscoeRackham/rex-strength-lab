const R='/home/user/rex-strength-lab/build-comparison/';
const BC = require('/home/user/rex-strength-lab/build-calculator/src/calc.js');
const builds = require('/home/user/rex-strength-lab/build-calculator/data/builds.json');
const Fig = require(R+'src/figure.js');
const M = require(R+'src/measure.js');
const T = require(R+'data/outline.json');
const L = require(R+'data/limits.json');
const H=1.8, calc=BC.create(builds);
function maker(id){const r=calc.compute({buildId:id,heightM:H});const g={};for(const s of BC.SITES)g[s]=r.girths[s].value;
 const base=Fig.human(T,H,g,{},{buttockFit:BC.FRUSTUM.M.buttock});
 const make=(f,armDeg)=>Fig.human(T,H,g,{},{buttockFit:BC.FRUSTUM.M.buttock,widthScale:f,legAxis:base.dims.legAxis,armDeg});
 return {base,make};}
function meas(fig, base, px){const y=base.dims.levels;const img=Fig.renderSheet({front:fig.front,side:fig.side},H,{shoulder:y.acromion,chest:y.chest,waist:y.waist,crotch:y.crotch,knee:y.knee},{figurePx:px||1600});
 const r=M.measureSheet(img,{heightM:H,heightRef:'top',density:1060,bodyFatPct:7.5,order:['front','side','back']});return r;}
const ids = process.argv[2] ? [process.argv[2]] : L.templates.map(t=>t.id);
for (const id of ids){
 const t=L.templates.find(x=>x.id===id); const {base,make}=maker(id);
 const r1=meas(make(1,20),base); const S1=r1.score.value;
 let line=id+' S1(stored)='+t.score_at_f1+' S1(now,20deg)='+S1.toFixed(2);
 for(const k of ['arms','thighs','face']){ if(!t[k]) continue; const f=t[k].f;
   const rest=Fig.armRestAngle(d=>make(f,d));
   const a20=meas(make(f,20),base), aR=meas(make(f,Math.max(20,Math.min(80,rest))),base), a35=meas(make(f,Math.max(35,rest)),base);
   line+=`\n  ${k}: f=${f} stored=${t[k].score} | S1*f^2=${(S1*f*f).toFixed(2)} | meas@20=${a20.score.value.toFixed(1)} ok=${a20.ok} | meas@rest(${rest.toFixed(1)})=${aR.score.value.toFixed(1)} ok=${aR.ok} | meas@max(35,rest)=${a35.score.value.toFixed(1)} ok=${a35.ok} ratio f2/meas=${(S1*f*f/aR.score.value).toFixed(3)}`;
   if(!aR.ok) line+=' errs: '+aR.errors.join(' | ');
 }
 console.log(line);
}
