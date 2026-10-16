const R='/home/user/rex-strength-lab/rex-strength-lab/src/';
global.window={}; const P=require(R+'engine.js'); require(R+'data.js'); const D=window.DINO_DATA, g=P.K.g;
const body=P.makeBody(Object.assign({build:'rex'},P.DEFAULT_BODIES.rex));
const ctx=(kg,anchor,extra)=>Object.assign({F:kg*g,mode:'comic',body,surface:D.surfaces.find(s=>s.id==='concrete'),anchor,airAbsorb:1,keepForm:true,unbreakable:true,ownRecoil:true},extra||{});
for (const anc of ['bolted','friction']) for (const id of ['baseball','person','motorcycle','car','pickup','bus']) {
  const o=D.objects.find(x=>x.id===id);
  for (const use of [undefined, 30*g]) {
    const r=P.pull(ctx(90718.474,anc,use?{use}:{}),o);
    if (!r.canMove) { console.log(anc,id,use?'30kg':'all','cannot move'); continue; }
    console.log(anc,id,use?'30kg':'all', 't',r.t10m.toFixed(4),'vEnd',r.vEnd.toFixed(2),'legs/use',(r.walkPush.J/r.walkPush.T/r.usable).toFixed(4),'foot',r.footLimited);
  }
}
