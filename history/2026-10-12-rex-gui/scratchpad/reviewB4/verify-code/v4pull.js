for (const R of [process.argv[2]]) {
  global.window={}; require(R+'/src/data.js'); const D=window.DINO_DATA; const P=require(R+'/src/engine.js');
  const g=P.K.g, rex=P.makeBody({build:'rex',H:3.048,m:3007}), c={F:1e6*g,mode:'comic',body:rex,surface:D.surfaces.find(s=>s.id==='concrete'),anchor:'friction',ownRecoil:true};
  const bus=D.objects.find(o=>o.id==='bus'), pl=P.pull(c,bus), S=P.RESTRAINT.MOVES.pull.shake(pl,{surface:c.surface,body:rex,obj:bus,ownRecoil:true,anchor:'friction'});
  const want=P.impulseSource(c.surface, P.vToMomentum(pl.vEnd,bus.m)+pl.resist*pl.t10m, pl.t10m);
  console.log(R.split('/').pop(),'ppv at 2 m (mm/s)',(P.ppvAt(S,2)*1000).toFixed(3),'expected from p_bus + R t',(P.ppvAt(want,2)*1000).toFixed(3));
}
