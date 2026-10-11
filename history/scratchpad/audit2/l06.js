global.window={}; require('/home/user/dino-strength-sim/src/data.js'); const D=window.DINO_DATA;
const P=require('/home/user/dino-strength-sim/src/engine.js');
console.log(Object.keys(P).slice(0,40));
for (const f of D.feats) {
  const r=f.run; if(!r||!r.liftKg||!isFinite(r.liftKg)) continue;
  const rt=Math.pow(10,Math.log10(r.liftKg));
  const o = r.obj && D.objects.find(x=>x.id===r.obj);
  console.log(f.title.padEnd(40), r.liftKg, rt, rt<r.liftKg?'BELOW':'', r.action, r.obj, o?o.m:'', o && rt < o.m ? 'FAILS':'' );
}
