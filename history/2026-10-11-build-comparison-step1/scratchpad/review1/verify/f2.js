const B='/home/user/rex-strength-lab/build-comparison/';
const M=require(B+'src/measure.js'), Fig=require(B+'src/figure.js');
const {templateViews}=require(B+'tools/export_targets.js');
const png=require(B+'tools/png.js');
const H=1.8, t=templateViews('ansur2_m_p50',H,1);
const backPolys=t.views.front.map(p=>({name:p.name,mark:p.mark,poly:p.poly.map(q=>[-q[0],q[1]])}));
const opts=(img)=>({heightM:H,heightRef:'skull',skullRows:Fig.sheetSkullRows(img,H),density:1060,bodyFatPct:7.5,order:['front','side','back']});
// normal sheet
const img3=Fig.renderSheet(t.views,H,t.levels,{figurePx:700});
const r3=M.measureSheet(img3,opts(img3));
console.log('front+side+back: ok',r3.ok,'vol',r3.volume_m3.value.toFixed(4),'score',r3.score.value.toFixed(1),'chest',(r3.girths.chest.value_m*100).toFixed(1));
// front + back as the middle view, third erased
const img2=Fig.renderSheet({front:t.views.front,side:backPolys,back:backPolys},H,t.levels,{figurePx:700});
const x3=img2.views[2]; // origin x of third view
const b3=Math.min(...backPolys.flatMap(p=>p.poly.map(q=>q[0])));
const xStart=Math.floor(x3+b3*img2.k)-5;
for(let y=0;y<img2.height;y++)for(let x=xStart;x<img2.width;x++){const o=(y*img2.width+x)*4; const g=img2.data[o]; if(g<100){img2.data[o]=img2.data[o+1]=img2.data[o+2]=255;}}
png.write(__dirname+'/frontback.png',img2);
const r2=M.measureSheet(img2,opts(img2));
console.log('front+back: ok',r2.ok,'vol',r2.volume_m3&&r2.volume_m3.value.toFixed(4),'score',r2.score&&r2.score.value.toFixed(1),'chest',r2.girths&&(r2.girths.chest.value_m*100).toFixed(1));
console.log('errors',r2.errors);console.log('warnings',r2.warnings.filter(w=>/view/i.test(w)));
console.log('checks',r2.checks.map(c=>(c.ok?'PASS ':'FAIL ')+c.name+' | '+c.detail));
