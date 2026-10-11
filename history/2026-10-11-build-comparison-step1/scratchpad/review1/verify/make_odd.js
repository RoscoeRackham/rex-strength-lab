const B='/home/user/rex-strength-lab/build-comparison/';
const Fig=require(B+'src/figure.js'), png=require(B+'tools/png.js'), {templateViews}=require(B+'tools/export_targets.js');
const t=templateViews('ansur2_m_p50',1.8,1);
const out=__dirname+'/';
// black figure on transparent background
let a=Fig.renderSheet(t.views,1.8,null,{figurePx:700});
for(let i=0;i<a.width*a.height;i++){const o=i*4; if(a.data[o]>200){a.data[o+3]=0;} }
// also remove ground line and height bar (grey 150) -> transparent
for(let i=0;i<a.width*a.height;i++){const o=i*4; if(a.data[o]===150){a.data[o+3]=0;a.data[o]=a.data[o+1]=a.data[o+2]=255;} }
png.write(out+'alpha-black.png',a);
// grey 120 on grey 150
let b=Fig.renderSheet(t.views,1.8,null,{figurePx:700,bg:[150,150,150],fg:[120,120,120],line:[150,150,150]});
png.write(out+'lowcontrast.png',b);
// normal sheet for reference
let c=Fig.renderSheet(t.views,1.8,t.levels,{figurePx:700});
png.write(out+'ok-sheet.png',c);
console.log('ok-sheet ground',c.ground,'skull row',Fig.sheetSkullRows(c,1.8).front, c.width,c.height);
