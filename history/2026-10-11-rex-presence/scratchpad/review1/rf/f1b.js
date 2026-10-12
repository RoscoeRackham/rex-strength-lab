const { P, D, g, surf, obj, ctx } = require('./lib.js');
for (const [oid, tgt] of [['car', 35], ['desoto', 30], ['desoto', 35]]) {
  const o0 = obj(oid); if (!o0) { console.log('no obj', oid, D.objects.map(o=>o.id).join(',')); continue; }
  const c = ctx();
  const o = { near: 5, target: tgt, obj: o0, angle: 45 };
  const p = P.RESTRAINT.planNow('throw', c, o);
  const gl = p.goal(), ce = p.ceiling(), M = P.RESTRAINT.MOVES.throw;
  const rg = p.run(gl.use);
  const hz = P.RESTRAINT.HAZARDS.filter(h => h.test(M, rg, p.opt)).map(h=>h.id);
  console.log(oid, tgt, 'goal kg', (gl.use/g).toFixed(0), 'hazards at goal', hz, 'ceiling', ce.by, (ce.below/g).toFixed(0));
  const rc = p.run(ce.below); console.log('  at ceiling range', rc.flight.range.toFixed(1), 'basis', rc.basis||'comic');
  let prev=null; for (let i=0;i<=300;i++){ const kg=3000*Math.pow(c.F/g/3000,i/300); const r=p.run(kg*g); const cr=M.crush(r,p.opt); if(cr!==prev){console.log('   crush',cr,'from',kg.toFixed(0),'grip',r.gripRatio.toFixed(3),r.basis||'comic'); prev=cr;} }
}
