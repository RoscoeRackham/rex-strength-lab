global.window = {};
const R='/home/user/rex-strength-lab/rex-strength-lab/';
const P = require(R+'src/engine.js'); require(R+'src/data.js');
const D = window.DINO_DATA, g=P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
console.log('plaster th',P.VIB.TH.plaster,'RMIN',P.VIB.RMIN);
for (const [mv,logKg,mode,sid] of [['jump',Math.log10(100*907.18474),'comic','concrete'],['jump',6,'real','concrete'],['jump',8,'real','concrete'],['stomp',Math.log10(100*907.18474),'comic','concrete'],['stomp',6,'comic','concrete']]){
  const c={F:Math.pow(10,logKg)*g,mode,body:rex,surface:surf(sid),groundHolds:false,anchor:'friction'};
  const o={target:3, near:5};
  const p=P.RESTRAINT.planNow(mv,c,o);
  const ce=p.ceiling(); const M=P.RESTRAINT.MOVES[mv];
  const rAll=p.run(undefined);
  const sh=M.shake(rAll,p.opt);
  const line=[1,2,3,5,10].map(d=>d+' m '+(P.ppvAt(sh,d)*1000).toFixed(1)).join(', ');
  console.log(mv,mode,logKg.toFixed(2),'ceiling by',ce.by,'below',ce.below&&(ce.below/g).toPrecision(3),'| all-out PPV mm/s:',line);
  if(ce.by){ const rc=p.run(ce.below); const s2=M.shake(rc,p.opt); console.log('   at ceiling:',[1,2,3,5].map(d=>d+' m '+(P.ppvAt(s2,d)*1000).toFixed(1)).join(', '));}
}
