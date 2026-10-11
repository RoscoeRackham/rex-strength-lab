const R='/home/user/rex-strength-lab/';
const BC=require(R+'build-calculator/src/calc.js');
const builds=require(R+'build-calculator/data/builds.json');
const settings=require(R+'build-comparison/data/settings.json');
const Compare=require(R+'build-comparison/src/model.js');
const calc=BC.create(builds);
const model=Compare.create(calc,{builds:settings.builds,fat_classes:settings.fat_classes});
const by={}; builds.builds.forEach(b=>by[b.id]=b);
const lb=0.45359237, inch=0.0254;
function mine(id){
  const b=by[id], s=settings.builds[id];
  // height
  let H=s.score_height?s.score_height.value_m:b.height_m.value;
  let Hr = s.score_height&&s.score_height.range_m ? s.score_height.range_m : (s.ranges!=='none' && b.height_m.range? b.height_m.range : [H,H]);
  let W = b.girth_basis_weight_kg!=null? b.girth_basis_weight_kg : b.weight_kg.value;
  let Wr = (s.ranges!=='none' && b.weight_kg.range && b.girth_basis_weight_kg==null)? b.weight_kg.range : [W,W];
  const ex=(s.exclude_mass||[]).reduce((t,e)=>t+e.mass_kg,0);
  W-=ex; Wr=Wr.map(x=>x-ex);
  let bf,lo,hi;
  if (s.fat && s.fat.kind==='army_equation'){
    const wl=b.weight_kg.value/lb, wi=b.girths.waist.value_m/inch;
    const o=-26.97-0.12*wl+1.99*wi, t=-27.05-0.12*wl+2.06*wi;
    bf=(o+t)/2; lo=Math.min(o,t)-3.35; hi=Math.max(o,t)+3.35;
  } else if (s.fat && s.fat.kind==='own'){ bf=b.body_fat_pct.value; lo=bf-s.fat.error_points; hi=bf+s.fat.error_points; }
  else if (s.fat && s.fat.kind==='value'){ bf=s.fat.value; lo=s.fat.lo; hi=s.fat.hi; }
  else { const c=settings.fat_classes[s.fat_class]; bf=c.working_pct; lo=c.range_pct[0]; hi=c.range_pct[1]; }
  const S=(w,f,h)=>1.8*w*(1-f/100)/h**3;
  return {H,Hr,W,Wr,bf,lo,hi,S:S(W,bf,H),Slo:S(Math.min(...Wr),hi,Math.max(...Hr)),Shi:S(Math.max(...Wr),lo,Math.min(...Hr)),plain:W*(1-bf/100)/H/H};
}
const ids=['bruce_banner','ansur2_m_p5','ansur2_m_p50','ansur2_m_p95','ansur2_m_largest_arm','nhanes_m_median','kouri1995_nonusers','steve_reeves_1947','withers1997_elite','ronnie_coleman','big_ramy','brian_shaw','hafthor_bjornsson','eddie_hall','wolverine','hulk_savage','juggernaut','kingpin','abomination','thor','rex','ollie'];
let maxd=0;
for (const id of ids){
  const m=mine(id), e=model.evaluate(id);
  const d=Math.max(Math.abs(m.S-e.score.value),Math.abs(m.Slo-e.score.lo),Math.abs(m.Shi-e.score.hi),Math.abs(m.plain-e.plain.value));
  maxd=Math.max(maxd,d);
  console.log(id.padEnd(22), 'H',m.H.toFixed(3),'W',m.W.toFixed(1),'bf',m.bf.toFixed(1),'['+m.lo.toFixed(1)+','+m.hi.toFixed(1)+']','S',m.S.toFixed(2),'['+m.Slo.toFixed(2)+','+m.Shi.toFixed(2)+']','plain',m.plain.toFixed(1),' model S',e.score.value.toFixed(2),'['+e.score.lo.toFixed(2)+','+e.score.hi.toFixed(2)+']', 'diff',d.toExponential(1));
}
console.log('max diff',maxd);
// Wolverine with adamantium for comparison
const w=by.wolverine; console.log('wolverine with adamantium S', (1.8*136.1*0.92/1.6002**3).toFixed(2), 'without', (1.8*88.5*0.92/1.6002**3).toFixed(2), 'ratio', (136.1/88.5).toFixed(3));
module.exports={mine};
