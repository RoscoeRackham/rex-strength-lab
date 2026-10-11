const R='/home/user/rex-strength-lab/';
const BC=require(R+'build-calculator/src/calc.js');
const builds=require(R+'build-calculator/data/builds.json');
const Fig=require(R+'build-comparison/src/figure.js');
const M=require(R+'build-comparison/src/measure.js');
const T=require(R+'build-comparison/data/outline.json');
const calc=BC.create(builds);
const H=1.8;
function views(id,f,armDeg){
  const r=calc.compute({buildId:id,heightM:H}); const g={}; for(const s of BC.SITES) g[s]=r.girths[s].value;
  const base=Fig.human(T,H,g,{},{buttockFit:BC.FRUSTUM.M.buttock});
  const fig=Fig.human(T,H,g,{},{buttockFit:BC.FRUSTUM.M.buttock,widthScale:f,legAxis:base.dims.legAxis,armDeg});
  const y=base.dims.levels;
  return {fig, base, levels:{shoulder:y.acromion,chest:y.chest,waist:y.waist,crotch:y.crotch,knee:y.knee}};
}
// analytic: polygon area of side and front per row? Use own integrator: per row y, front runs of body polygon (no arms) x side depth of body polygon.
function rowsRuns(poly, y){ const xs=[]; for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[j],b=poly[i]; if((a[1]<=y&&b[1]>y)||(b[1]<=y&&a[1]>y)) xs.push(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1]));} xs.sort((p,q)=>p-q); const out=[]; for(let k=0;k+1<xs.length;k+=2) out.push(xs[k+1]-xs[k]); return out; }
function analytic(fig){
  const fb=fig.front.find(p=>p.name==='body').poly, sb=fig.side.find(p=>p.name==='body').poly;
  const d=fig.dims; let torso=0, legs=0, legsNoOverlap=0; const dy=0.0005;
  for(let y=dy/2;y<H;y+=dy){
    const fr=rowsRuns(fb,y), sr=rowsRuns(sb,y); if(!fr.length||!sr.length) continue;
    const depth=Math.max(...sr);
    for(const w of fr){ const v=Math.PI/4*w*depth*dy; if(y>d.levels.crotch) torso+=v; else legs+=v; }
  }
  // head ellipsoid
  const head=4/3*Math.PI*(d.headB/2*1.02)*(d.headL/2)*(d.headH/2);
  // arms: integrate pi r^2 along stations, x2
  const st=d.armStations; const integ=(s,L)=>{let v=0; const n=400; for(let i=0;i<n;i++){const x=(i+0.5)/n*L; let r; for(let k=1;k<s.length;k++){ if(x<=s[k][0]){ r=s[k-1][1]+(s[k][1]-s[k-1][1])*(x-s[k-1][0])/(s[k][0]-s[k-1][0]); break;} } v+=Math.PI*r*r*L/n;} return v;};
  const arms=2*(integ(st.upper,st.Lu)+integ(st.fore,st.Lf));
  const hands=2*Math.PI*Math.pow(d.handB*0.3,1)*(d.handB*0.15)*d.handL; // rough: not used
  return {torso,legs,head,arms,total:torso+legs+head+arms};
}
for (const id of ['ansur2_m_p50','ronnie_coleman']){
  const a1=analytic(views(id,1,20).fig);
  for (const f of [1,1.25,1.35,2,2.84]){
    const a=analytic(views(id,f,20).fig);
    const r=M.measureSheet(Fig.renderSheet({front:views(id,f,60).fig.front,side:views(id,f,60).fig.side},H,null,{figurePx:800}),{heightM:H,heightRef:'top'});
    console.log(id, 'f',f, 'analytic total ratio', (a.total/a1.total).toFixed(3),'f2',(f*f).toFixed(3), 'parts ratio torso',(a.torso/a1.torso).toFixed(3),'legs',(a.legs/a1.legs).toFixed(3),'arms',(a.arms/a1.arms).toFixed(3),'head',(a.head/a1.head).toFixed(3), '| f=1 shares torso',(a1.torso/a1.total).toFixed(3),'legs',(a1.legs/a1.total).toFixed(3),'arms',(a1.arms/a1.total).toFixed(3),'head',(a1.head/a1.total).toFixed(3), '| tool parts', JSON.stringify(Object.fromEntries(Object.entries(r.volume_m3.parts).map(([k,v])=>[k,+v.toFixed(4)]))));
  }
}
