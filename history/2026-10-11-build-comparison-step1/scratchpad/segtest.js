const M=require('/home/user/rex-strength-lab/build-comparison/src/measure.js');
const png=require('/home/user/rex-strength-lab/build-comparison/tools/png.js');
const out='/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/';
for (const f of ['rex','ollie']) {
  const img=png.read(`/home/user/rex-strength-lab/build-comparison/assets/${f}-turnaround.png`);
  const t=Date.now();
  const s=M.segment(img, f==='ollie'?{ignore:[[0,795,img.width-1,img.height-1]]}:{});
  const views=M.splitViews(s.mask,img.width,img.height);
  console.log(f, Date.now()-t,'ms', views.map(v=>JSON.stringify(v)).join('\n  '));
  const ov={width:img.width,height:img.height,data:new Uint8ClampedArray(img.data)};
  for(let i=0;i<img.width*img.height;i++){ if(s.mask[i]){ ov.data[i*4]=ov.data[i*4]*0.4+255*0.6; ov.data[i*4+1]*=0.4; ov.data[i*4+2]=ov.data[i*4+2]*0.4+255*0.6; } }
  png.write(out+f+'_mask.png', ov);
}
