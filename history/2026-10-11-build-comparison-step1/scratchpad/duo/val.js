const M=require('/home/user/rex-strength-lab/build-comparison/src/measure.js');
const png=require('/home/user/rex-strength-lab/build-comparison/tools/png.js');
const cfg=require('/home/user/rex-strength-lab/build-comparison/data/duo-validation.json');
const img=png.read(process.argv[2]);
const opts=JSON.parse(process.argv[3]||'{}');
const seg=M.segment(img,opts);
const r=M.frontOnly(seg.mask,img.width,img.height,cfg);
const g={}; for(const p of r.parts) g[p.group]=(g[p.group]||0)+p.volume_m3;
console.log(JSON.stringify(opts), 'groups', Object.entries(g).map(([k,v])=>k+' '+v.toFixed(4)).join(', '), '| measured', r.measured_m3.toFixed(4), 'extras', r.extras_m3.toFixed(4), 'TOTAL', r.total_m3.toFixed(4));
if (opts.ov) { const ov={width:img.width,height:img.height,data:new Uint8ClampedArray(img.data)}; for(let i=0;i<img.width*img.height;i++) if(seg.mask[i]){ov.data[i*4]=255;ov.data[i*4+1]*=0.3;} png.write('/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/duo/ov.png',ov); }
const exp={head_and_neck:15662,torso:104091,'upper arm (fully visible arm, counted for both)':31767,'forearm (fully visible arm, counted for both)':15180,'hand (fully visible arm, counted for both)':6110,'left leg':29914,'right leg':30792};
console.log(r.parts.map(p=>p.name.slice(0,12)+' px '+p.px+' vs old '+Math.round((exp[p.name]||exp[p.name.replace(/ /g,'_')]||0)*0.31640625)).join('; '));
