global.window = {};
const E0 = require('/home/user/dino-strength-sim/src/engine.js');
const E1 = require('/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/r7/repo/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const g = E0.K.g;
function run(E, lk, objId, ang, surfId='concrete', anchor='friction', mode='comic') {
  const body = E.makeBody({H:2,m:180});
  const surface = D.surfaces.find(s=>s.id===surfId);
  const ctx = {F: lk===Infinity?Infinity:Math.pow(10,lk)*g, mode, body, surface, groundHolds:false, anchor};
  return E.throwObject(ctx, D.objects.find(o=>o.id===objId), ang);
}
const f=(x)=>x==null?'-':(typeof x==='number'?x.toPrecision(4):x);
for (const [lk,obj,ang,surf,anc,mode] of [
  [Math.log10(90718.474),'car',45,'concrete','friction','comic'],
  [Math.log10(90718.474),'car',45,'concrete','friction','real'],
  [4.5,'car',45,'concrete','friction','comic'],
  [7,'car',45,'concrete','friction','comic'],
  [7,'car',45,'concrete','bolted','comic'],
  [Math.log10(511),'shot',37,'concrete','friction','real'],
  [Math.log10(511),'shot',37,'concrete','friction','comic'],
  [5,'car',0,'concrete','friction','comic'],
  [8,'baseball',45,'concrete','friction','comic'],
  [Infinity,'car',45,'concrete','friction','comic'],
]) {
  const a = run(E0,lk,obj,ang,surf,anc,mode), b = run(E1,lk,obj,ang,surf,anc,mode);
  console.log(`${obj} ${ang}deg ${surf} ${anc} ${mode} logKg ${f(lk)}`);
  console.log(`   orig: v ${f(a.v)} recoil ${f(a.recoilV)} range ${f(a.flight&&a.flight.range)} sink ${f(a.sinkRatio)} R ${f(a.anchor.R)}`);
  console.log(`   fix : v ${f(b.v)} recoil ${f(b.recoilV)} range ${f(b.flight&&b.flight.range)} sink ${f(b.sinkRatio)} RAeff ${b.anchor.Rslide&&isFinite(b.F)?f(b.anchor.Rslide(b.F)):'-'}`);
}
