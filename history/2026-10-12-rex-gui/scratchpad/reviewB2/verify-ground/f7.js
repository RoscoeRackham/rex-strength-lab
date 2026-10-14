const {P,D,rex,surf,ON,OFF,ctx}=require('./h.js');
const obj=(id)=>D.objects.find(x=>x.id===id);
for (const id of ['bus','car']) {
  const c=ctx(90718.474,'concrete',ON); // 200,000 lb? use 90.7 t
  const r=P.pull(c,obj(id));
  const T=obj(id).m*r.accel+r.resist;
  console.log(id,'F',(c.F/1e3).toFixed(0),'kN','driveStrength',(P.driveStrength(c)/1e3).toFixed(0),'kN usable',(r.usable/1e3).toFixed(0),'kN','footLimited',r.footLimited,'accel',r.accel.toFixed(2),'anchor.R kN',(r.anchor.R/1e3).toFixed(1),'rope tension kN',(T/1e3).toFixed(1),'share',(100*T/r.usable).toFixed(1)+'%','accel if all usable on load',((r.usable-r.resist)/obj(id).m).toFixed(0));
}
