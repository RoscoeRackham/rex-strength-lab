global.window = {};
const R='/home/user/rex-strength-lab/rex-strength-lab/';
const P = require(R+'src/engine.js'); require(R+'src/data.js');
let anyRuns=0, shown=0;
for (let lr=1; lr<=30; lr+=0.5){ const V=P.bodyVolume(3.048,'rex'); const m=Math.pow(10,lr)*V; const body=P.makeBody({build:'rex',H:3.048,m});
  for (let lE=10; lE<=50; lE+=1) for (const s of [0,0.5,1]) { const E=Math.pow(10,lE); const rw=P.runawayGrowth(body,E,s); if(rw.runs){anyRuns++; const gB=P.grownBody?P.grownBody(body,E,s):null; const small=gB&&gB.lnr<0.01; if(!small) {shown++; if(shown<4) console.log('runs & not small: rho 1e'+lr,'E 1e'+lE,'s',s,'k',rw.k,'rs/R',rw.rsOverR,'lnr',gB&&gB.lnr);} } }
}
console.log('combos where runs:',anyRuns,'of which growth not small:',shown);
