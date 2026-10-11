const B='/home/user/rex-strength-lab/build-comparison/';
const M=require(B+'src/measure.js'), Fig=require(B+'src/figure.js'), png=require(B+'tools/png.js'), path=require('path');
const duo=require(B+'data/duo-outlines.json');
for (const [name,H] of [['rex',2.92],['ollie',2.91]]) {
  const t=Fig.traced(duo.characters[name],'side',H);
  const tail=t.parts.filter(p=>p.mark==='tail'), body=t.parts.filter(p=>p.mark!=='tail');
  const mx=ps=>{let s=0,n=0;ps.forEach(p=>p.poly.forEach(q=>{s+=q[0];n++;}));return (s/n).toFixed(2);};
  console.log(name,'source facing',duo.characters[name].views.side.facing,'| traced side: tail mean x',mx(tail),'body mean x',mx(body));
}
const T=require(B+'tools/trace_turnarounds.js').READINGS;
for (const name of ['rex','ollie']) {
  const R=T[name], img=png.read(path.join(B,R.file)); const ex={},skull={};
  for (const v of R.order){ex[v]=R.views[v].tail?[R.views[v].tail]:[];skull[v]=R.views[v].skull;}
  const r=M.measureSheet(img,{heightM:3,skullRows:skull,order:R.order,exclude:ex,seg:{ignore:R.ignore}});
  console.log(name,'ok',r.ok,'failed checks:',r.checks.filter(c=>!c.ok).map(c=>c.name+' ['+c.detail+']'),'errors',r.errors.filter(e=>!/^Rejected/.test(e)));
}
