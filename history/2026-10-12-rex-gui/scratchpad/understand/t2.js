global.window={}; const P=require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'); require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D=window.DINO_DATA;
const g=P.K.g, surf=(id)=>D.surfaces.find(s=>s.id===id), obj=(id)=>D.objects.find(o=>o.id===id);
const rex=P.makeBody(Object.assign({build:'rex'},P.DEFAULT_BODIES.rex)), ollie=P.makeBody(Object.assign({build:'ollie'},P.DEFAULT_BODIES.ollie));
const c=(b,F,x)=>Object.assign({F,mode:'comic',body:b,surface:surf('concrete'),groundHolds:false,anchor:'friction'},x||{});
const rows=[];
for (const id of ['baseball','car','shot','piano','bus','bar511']) for (const lg of [4.96,6,7,8,9,10,12,15,20]) for (const st of ['easy','hard']) for (const D0 of [10,31.6,1000]) {
  const F=Math.pow(10,lg)*g;
  const L0=P.catchLeg(c(rex,F),c(ollie,F),obj(id),D0,st), L1=P.catchLeg(c(rex,F,{gentleHold:true}),c(ollie,F,{gentleHold:true}),obj(id),D0,st);
  rows.push([id,lg,st,D0,L0.result,L0.bursts?'bursts':'',L1.result,L1.bursts?'bursts':'', L0.breakAtLaunch?'breakAtLaunch':''].join(' '));
}
const seen=new Set();
for (const r of rows){ const k=r.split(' ').slice(4).join(' '); if(!seen.has(k+r.split(' ')[0])){seen.add(k+r.split(' ')[0]); console.log(r);} }
