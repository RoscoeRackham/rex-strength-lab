global.window={};
const R='/home/user/rex-strength-lab/rex-strength-lab/';
const P=require(R+'src/engine.js'); require(R+'src/data.js'); const D=window.DINO_DATA; const g=P.K.g;
const rex=P.makeBody({build:'rex',H:3.048,m:3007});
const surf=D.surfaces.find(s=>s.id==='concrete'), car=D.objects.find(o=>o.id==='car');
const ctx=(use)=>({F:Infinity,mode:'real',body:rex,surface:surf,groundHolds:false,anchor:'friction',use});
const times=[];
for (let v=1.5; v<=12.0001; v+=0.05) {
  const u=Math.pow(10,v)*g; const t0=process.hrtime.bigint(); P.throwObject(ctx(u),car,45); const ms=Number(process.hrtime.bigint()-t0)/1e6; times.push([v.toFixed(2),ms]);
}
times.sort((a,b)=>b[1]-a[1]); console.log('top', times.slice(0,10).map(([v,m])=>v+':'+m.toFixed(0)).join(' '));
console.log('over50', times.filter(x=>x[1]>50).length,'of',times.length);
for (const v of [5.59,6.0,7.0,7.32,10.15]) { const t0=Date.now(); P.throwObject(ctx(Math.pow(10,v)*g),car,45); console.log(v, Date.now()-t0,'ms'); }
