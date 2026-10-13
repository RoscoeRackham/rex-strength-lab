global.window={}; const P=require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'); require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D=window.DINO_DATA;
const g=P.K.g, surf=(id)=>D.surfaces.find(s=>s.id===id), obj=(id)=>D.objects.find(o=>o.id===id);
const rex=P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie=P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const ctxOf=(F,extra)=>Object.assign({ F, mode: 'comic', body: rex, surface: surf('concrete'), groundHolds: false, anchor: 'friction' }, extra || {});
const cc=(F,x)=>ctxOf(F,x), oc=(F,x)=>ctxOf(F,Object.assign({body:ollie},x));
const keepRes=(L)=>{ if(!L.catch) return L.result; const k=L.catch; if (['crushed-launch','breaks-up','burns-up','wreckage','caught'].indexOf(L.result)<0) return L.result; if (L.size>2*L.hStop) return 'too-big'; if(!k.clean) return k.canHold?'slams':'cant-hold-it'; return 'caught'; };
const cases=[['car',1e9,31.6,'hard'],['baseball',1e12,31.6,'hard'],['car',1e7,10,'hard'],['shot',1e7,10,'hard'],['baseball',90718,10,'hard'],['baseball',1e10,10,'hard'],['pyramid',1e14,1e7,'easy']];
for (const [id,kg,D0,st] of cases){
  const L0=P.catchLeg(cc(kg*g),oc(kg*g),obj(id),D0,st), L1=P.catchLeg(cc(kg*g,{gentleHold:true}),oc(kg*g,{gentleHold:true}),obj(id),D0,st);
  const Lf=P.catchLeg(cc(kg*g,{keepForm:false}),oc(kg*g,{keepForm:false}),obj(id),D0,st);
  console.log(id,kg,D0,st,'off:',L0.result,L0.bursts?'bursts':'', '| gentle:',L1.result,L1.bursts?'bursts':'','| keepForm (projected):',keepRes(L0), '| vL', L0.aim?L0.aim.vL.toPrecision(4):L0.vL, 'launchRatio', L0.launchRatio&&L0.launchRatio.toPrecision(3),'qDyn/crush', obj(id).crush? (L0.qDynMax/obj(id).crush).toPrecision(3):'-', 'heat', L0.heat&&L0.heat.kind, 'wholeFront', L0.catch&&L0.catch.wholeFront.toPrecision(3), 'sameAsUndef', JSON.stringify(Lf.result)===JSON.stringify(L0.result));
}
