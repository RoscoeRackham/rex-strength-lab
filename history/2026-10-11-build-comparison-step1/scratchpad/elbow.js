const root='/home/user/rex-strength-lab/';
const BC=require(root+'build-calculator/src/calc.js'), data=require(root+'build-calculator/data/builds.json');
const Fig=require(root+'build-comparison/src/figure.js'), T=require(root+'build-comparison/data/outline.json');
const M=BC.create(data);
for (const id of ['ansur2_m_p50','ansur2_m_p5','ansur2_m_p95','ronnie_coleman','ansur2_m_largest_arm']) {
  const r=M.compute({buildId:id}); const g={}; for(const s of BC.SITES) g[s]=r.girths[s].value;
  const base=Fig.human(T, r.height.value, g, {}, {buttockFit: BC.FRUSTUM.M.buttock});
  const mk=f=>Fig.human(T, r.height.value, g, {}, {buttockFit: BC.FRUSTUM.M.buttock, widthScale:f, legAxis: base.dims.legAxis});
  const out=[];
  for (const cr of [0.10,0.15,0.20,0.25,0.30]) out.push('crease'+cr+': '+[1,1.2,1.5,2,2.5,3].map(f=>Fig.elbowFlexion(mk(f), cr*base.dims.armStations.Lu).toFixed(0)).join(' '));
  console.log(id, 'armR', base.dims.armR.toFixed(3),'foreR',base.dims.foreR.toFixed(3)); console.log('  '+out.join('\n  '));
}
