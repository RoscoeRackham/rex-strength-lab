const R='/home/user/rex-strength-lab/';
const BC=require(R+'build-calculator/src/calc.js');
const builds=require(R+'build-calculator/data/builds.json');
const Fig=require(R+'build-comparison/src/figure.js');
const M=require(R+'build-comparison/src/measure.js');
const T=require(R+'build-comparison/data/outline.json');
const calc=BC.create(builds);
const H=1.8, sc=(v)=>1.8*v*1060*0.925/H**3;
function mk(id,f,armDeg){
  const r=calc.compute({buildId:id,heightM:H}); const g={}; for(const s of BC.SITES) g[s]=r.girths[s].value;
  const base=Fig.human(T,H,g,{},{buttockFit:BC.FRUSTUM.M.buttock});
  return Fig.human(T,H,g,{},{buttockFit:BC.FRUSTUM.M.buttock,widthScale:f,legAxis:base.dims.legAxis,armDeg});
}
function rowsRuns(poly, y){ const xs=[]; for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[j],b=poly[i]; if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y)) xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));} xs.sort((p,q)=>p-q); const out=[]; for(let k=0;k+1<xs.length;k+=2) out.push(xs[k+1]-xs[k]); return out; }
function analytic(fig){
  const fb=fig.front.find(p=>p.name==='body').poly, sb=fig.side.find(p=>p.name==='body').poly;
  const d=fig.dims; let body=0; const dy=0.0005;
  for(let y=dy/2;y<H;y+=dy){ const fr=rowsRuns(fb,y), sr=rowsRuns(sb,y); if(!fr.length||!sr.length) continue; const depth=Math.max(...sr); for(const w of fr) body+=Math.PI/4*w*depth*dy; }
  const head=4/3*Math.PI*(d.headB/2*1.02)*(d.headL/2)*(d.headH/2);
  const st=d.armStations; const integ=(s,L)=>{let v=0; const n=400; for(let i=0;i<n;i++){const x=(i+0.5)/n*L; let r=s[s.length-1][1]; for(let k=1;k<s.length;k++){ if(x<=s[k][0]){ r=s[k-1][1]+(s[k][1]-s[k-1][1])*(x-s[k-1][0])/(s[k][0]-s[k-1][0]); break;} } v+=Math.PI*r*r*L/n;} return v;};
  const arms=2*(integ(st.upper,st.Lu)+integ(st.fore,st.Lf));
  return body+head+arms;
}
const L=require(R+'build-comparison/data/limits.json');
for (const tp of L.templates){
  const a1=analytic(mk(tp.id,1,20));
  let line=tp.id.padEnd(22)+' analytic S1 '+sc(a1).toFixed(1)+' tool S1 '+tp.score_at_f1;
  for (const k of ['arms','thighs','face']){
    const f=tp[k].f, a=analytic(mk(tp.id,f,20));
    line+=' | '+k+' stored '+tp[k].score+' drawn(analytic, scaled to tool S1) '+(tp.score_at_f1*a/a1).toFixed(1)+' ratio '+(f*f/(a/a1)).toFixed(3);
  }
  console.log(line);
}
// tool on the page's drawn figure at the limit: arms limit figure drawn at rest angle
const main=L.templates[0];
for (const it of L.items){
  const f=main[it.id].f, deg=Math.max(20,Math.min(80,it.arm_rest_angle_deg));
  const fig=mk('ansur2_m_p50',f,deg);
  const r=M.measureSheet(Fig.renderSheet({front:fig.front,side:fig.side},H,null,{figurePx:1200}),{heightM:H,heightRef:'top'});
  console.log(it.id,'page figure arms at',deg,'tool score',r.score.value.toFixed(1),'ok',r.ok,'stated',it.score);
}
