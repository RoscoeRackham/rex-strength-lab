global.window={}; const P=require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'); require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D=window.DINO_DATA;
const g=P.K.g, surf=(id)=>D.surfaces.find(s=>s.id===id), obj=(id)=>D.objects.find(o=>o.id===id);
const rex=P.makeBody(Object.assign({build:'rex'},P.DEFAULT_BODIES.rex));
const ctx=(F,x)=>Object.assign({F,mode:'comic',body:rex,surface:surf('granite'),groundHolds:false,anchor:'bolted'},x||{});
const E=obj('everest');
console.log('everest', E.m, E.area, E.crush, E.rho, 'noThrow', E.noThrow);
for (const lg of [15, 16, 17, 18, 20]) for (const th of [10,45]) {
  const r=P.throwObject(ctx(Math.pow(10,lg)*g),E,th);
  const f=r.flight||{};
  console.log('lg',lg,'th',th,'canMove',r.canMove,'v',r.v&&r.v.toPrecision(4),'gripRatio',r.gripRatio&&r.gripRatio.toPrecision(3),'landed',f.landed,'range',f.range&&f.range.toPrecision(3),'vImp',f.vImpact&&f.vImpact.toPrecision(4),'Eimp',r.Eimpact&&r.Eimpact.toPrecision(3),'crater',r.crater&&r.crater.toPrecision(3),'planetScale',r.planetScale,'escaped',f.escaped,'orbit',f.orbit,'rel',f.relativistic,'maxStagT',f.maxStagT&&f.maxStagT.toPrecision(3));
}
// generic head-on: Everest into a bird and into the Moon
const bird={m:0.5}, moon=obj('moon');
for (const v of [100, 1000, 2380, 10000]) {
  const p=P.vToMomentum(v,E.m);
  const hb=P.headOn(p,E.m,bird.m), hm=P.headOn(p,E.m,moon.m);
  // whole-object rule: force over Everest's cross-section vs its strength, force = Q / squash
  const depthE=(E.m/E.rho)/E.area, depthBird=0.1;
  const sB=2*0.25*Math.min(depthE,depthBird), sM=2*0.25*depthE;
  const FB=hb.Q/sB, FM=hm.Q/sM;
  console.log('v',v,'bird Q',hb.Q.toPrecision(3),'F',FB.toPrecision(3),'ratio',(FB/(E.area*E.crush)).toPrecision(3),'| moon Q',hm.Q.toPrecision(3),'F',FM.toPrecision(3),'ratio',(FM/(E.area*E.crush)).toPrecision(3), 'specificE', (hm.Q/E.m).toPrecision(3), 'vs crush/rho', (E.crush/E.rho).toPrecision(3), 'depthE', depthE.toPrecision(3));
}
