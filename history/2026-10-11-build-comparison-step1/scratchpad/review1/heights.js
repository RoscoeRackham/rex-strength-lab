const S=__dirname+'/snap/';
const Fig=require(S+'build-comparison/src/figure.js');
const M=require(S+'build-comparison/src/measure.js');
const {build}=require('./synth_mod.js');
const H=1.8, s=build(H,{armDeg:30});
const sc=(parts,fx,fy)=>parts.map(p=>({poly:p.poly.map(q=>[q[0]*fx,q[1]*fy]),mark:'own'}));
const cases={
  'side stretched +3% vertically': {front:s.front, side:sc(s.side,1,1.03)},
  'side uniformly +3%': {front:s.front, side:sc(s.side,1.03,1.03)},
  'side -3% (shorter)': {front:s.front, side:sc(s.side,1,0.97)},
  'back +3% (front, side equal)': {front:s.front, side:s.side, back:sc(s.front,-1,1.03)},
  'side +2.5%': {front:s.front, side:sc(s.side,1,1.025)},
  'side +1.5% (should pass)': {front:s.front, side:sc(s.side,1,1.015)},
};
for (const [name,v] of Object.entries(cases)){
  const img=Fig.renderSheet(v,H*1.04,null,{figurePx:2000});
  const r=M.measureSheet(img,{heightM:H,heightRef:'top'});
  console.log(name.padEnd(32),'ok',r.ok,'|',r.checks.map(c=>(c.ok?'ok ':'FAIL ')+c.name+' ['+c.detail+']').join(' ; '));
}
// heightRef skull, skull row given for front only, and a horn on all views (top of figure 4% above the skull)
const horn=(cx,top)=>({poly:[[cx-0.01,top-0.01],[cx+0.01,top-0.01],[cx,top+0.07]],mark:'own'});
const v={front:s.front.concat([horn(0,H)]), side:s.side.concat([horn(0,H)])};
const img=Fig.renderSheet(v,H,null,{figurePx:2000});
const skullRowFront=Math.round(img.ground-H*img.k);
let r=M.measureSheet(img,{heightM:H,heightRef:'skull',skullRows:{front:skullRowFront}});
console.log('horned, skull row front only: ok',r.ok, r.checks.map(c=>(c.ok?'ok ':'FAIL ')+c.name+' ['+c.detail+']').join(' ; '));
r=M.measureSheet(img,{heightM:H,heightRef:'skull',skullRows:{front:skullRowFront,side:skullRowFront,back:skullRowFront}});
console.log('horned, skull rows all views: ok',r.ok, r.checks.map(c=>(c.ok?'ok ':'FAIL ')+c.name).join(' ; '));
