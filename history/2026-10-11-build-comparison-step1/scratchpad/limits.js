const root='/home/user/rex-strength-lab/';
const BC=require(root+'build-calculator/src/calc.js'), data=require(root+'build-calculator/data/builds.json');
const Fig=require(root+'build-comparison/src/figure.js'), T=require(root+'build-comparison/data/outline.json');
const M=BC.create(data);
for (const id of ['ansur2_m_p50','ansur2_m_p5','ansur2_m_p95','ronnie_coleman','ansur2_m_largest_arm','steve_reeves_1947']) {
  const r=M.compute({buildId:id}); const g={}; for(const s of BC.SITES) g[s]=r.girths[s].value;
  const base=Fig.human(T, r.height.value, g, {}, {buttockFit: BC.FRUSTUM.M.buttock});
  const mk=f=>Fig.human(T, r.height.value, g, {}, {buttockFit: BC.FRUSTUM.M.buttock, widthScale:f, legAxis: base.dims.legAxis});
  const rows=[1,1.2,1.4,1.6,2,2.5,3].map(f=>{const x=mk(f); return `f${f}: arm ${Fig.armClearance(x)}deg bone ${Fig.armBoneClearance(x)}deg thigh ${Fig.thighContact(x).toFixed(2)} elbow ${Fig.elbowFlexion(x).toFixed(1)}`;});
  console.log(id, 'legAxis', base.dims.legAxis.toFixed(3)); console.log('  '+rows.join('\n  '));
}
