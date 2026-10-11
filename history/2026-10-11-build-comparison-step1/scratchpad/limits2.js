const root='/home/user/rex-strength-lab/';
const BC=require(root+'build-calculator/src/calc.js'), data=require(root+'build-calculator/data/builds.json');
const Fig=require(root+'build-comparison/src/figure.js'), T=require(root+'build-comparison/data/outline.json');
const X=require(root+'build-comparison/tools/export_targets.js');
const M=BC.create(data);
for (const id of ['ansur2_m_p50','ronnie_coleman','steve_reeves_1947','ansur2_m_largest_arm']) {
  const H=1.8; const r=M.compute({buildId:id, heightM:H}); const g={}; for(const s of BC.SITES) g[s]=r.girths[s].value;
  const base=Fig.human(T, H, g, {}, {buttockFit: BC.FRUSTUM.M.buttock});
  const mk=f=>Fig.human(T, H, g, {}, {buttockFit: BC.FRUSTUM.M.buttock, widthScale:f, legAxis: base.dims.legAxis});
  const fa=Fig.solveScale(mk, x=>Fig.armBoneClearance(x)>0, 0.5, 6);
  const fb=Fig.solveScale(mk, x=>Fig.thighContact(x)>=1, 0.5, 6);
  const S1=X.measureTemplate(id, H, 1, 800).res.score.value;
  console.log(id, 'S(f=1) at 7.5%/1060:', S1.toFixed(1), '| arms bone f', fa&&fa.toFixed(3), 'S', fa&&(S1*fa*fa).toFixed(1), '| thighs f', fb&&fb.toFixed(3), 'S', fb&&(S1*fb*fb).toFixed(1));
}
console.log('--- angle at which the humerus clears the torso, by score');
for (const id of ['ansur2_m_p50','ronnie_coleman']) {
  const H=1.8; const r=M.compute({buildId:id, heightM:H}); const g={}; for(const s of BC.SITES) g[s]=r.girths[s].value;
  const base=Fig.human(T, H, g, {}, {buttockFit: BC.FRUSTUM.M.buttock});
  const mk=f=>Fig.human(T, H, g, {}, {buttockFit: BC.FRUSTUM.M.buttock, widthScale:f, legAxis: base.dims.legAxis});
  const S1=X.measureTemplate(id, H, 1, 800).res.score.value;
  console.log(id, [0.8,1,1.2,1.4,1.6,1.8,2,2.5,3].map(f=>'S'+(S1*f*f).toFixed(0)+':'+Fig.armBoneClearance(mk(f))+'/'+Fig.armClearance(mk(f))).join(' '));
}
