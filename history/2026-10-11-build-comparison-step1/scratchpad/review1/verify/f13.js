const B='/home/user/rex-strength-lab/build-comparison/';
const M=require(B+'src/measure.js'), png=require(B+'tools/png.js'), path=require('path');
const R=require(B+'tools/trace_turnarounds.js').READINGS.rex, img=png.read(path.join(B,R.file));
const order=['front','back','side'];
// the page's mapping: order.forEach((v,i)=>skull[v]=rows[min(i,len-1)])
for (const [label,rows] of [['true rows in layout order (52,52,57)',[52,52,57]],['rows typed per the hint "front, side, back" (52,57,52)',[52,57,52]]]) {
  const skull={}; order.forEach((v,i)=>skull[v]=rows[Math.min(i,rows.length-1)]);
  const r=M.measureSheet(img,{heightM:2.92,heightRef:'skull',skullRows:skull,order,density:1060,bodyFatPct:7.5});
  console.log(label,'-> assigned',JSON.stringify(skull),'|',r.checks[0].detail);
}
