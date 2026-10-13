global.window={};
const P0=require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
const P1=require('./engine-trial.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D=window.DINO_DATA;
const {cases,summarize}=require('/home/user/rex-strength-lab/rex-strength-lab/test/baseline-cases.js');
const base=require('/home/user/rex-strength-lab/rex-strength-lab/test/fixtures/allout-baseline.json');
let d0=0,d1=0,dAbs=0,n=0;
for (const c of cases(D)) { n++;
  const a=JSON.stringify(summarize(P1,D,c)), b=JSON.stringify(base[c.key]);
  if (a!==b) d1++;
  const a2=JSON.stringify(summarize(P1,D,c,{airAbsorb:0}));
  if (a2!==b) dAbs++;
}
console.log('cases',n,'trial(undefined) differs',d1,'trial(airAbsorb 0) differs',dAbs);
// deep compare throw flights field by field for a range of throws
let bad=0, tot=0;
const surface=D.surfaces.find(s=>s.id==='concrete');
for (const lg of [2,3,4,5,6,8,10,12,15,20]) for (const id of ['baseball','car','person','tank','shot','pyramid']) for (const a of [0,30,45,90]) {
  const body=P0.makeBody({build:'rex',H:3.048,m:3007});
  const c={F:Math.pow(10,lg)*9.80665,mode:'comic',body,surface,groundHolds:false,anchor:'friction'};
  const o=D.objects.find(x=>x.id===id);
  const r0=P0.throwObject(c,o,a), r1=P1.throwObject(Object.assign({},c,{airAbsorb:0}),o,a);
  tot++;
  const f0=r0.flight||{}, f1=r1.flight||{};
  for (const k of Object.keys(f0)) if (k!=='path' && !Object.is(f0[k],f1[k])) { bad++; console.log('diff',lg,id,a,k,f0[k],f1[k]); break; }
  for (const k of ['v','Eobj','dragLoss','Eimpact','recoilV','crater']) if (!Object.is(r0[k],r1[k])) { bad++; console.log('diffr',lg,id,a,k); }
}
console.log('throws',tot,'diffs',bad);
