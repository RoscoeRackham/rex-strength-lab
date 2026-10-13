global.window={};
const P=require('./engine-trial.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D=window.DINO_DATA, K=P.K, g=K.g;
const surface=D.surfaces.find(s=>s.id==='concrete');
const body=P.makeBody({build:'rex',H:3.048,m:3007});
const kg = Math.pow(10, Math.log10(200e18*907.18474)+1e-12);
const sig=(x)=>typeof x==='number'?Number(x.toPrecision(4)):x;
function show(label, F, id, ang, target) {
  const o=D.objects.find(x=>x.id===id);
  for (const s of [0,0.5,1]) {
    const c={F,mode:'comic',body,surface,groundHolds:false,anchor:'friction',airAbsorb:s};
    const t0=Date.now();
    const p=P.RESTRAINT.planNow('throw', c, {obj:o, angle:ang, target, near:5});
    const ms=Date.now()-t0;
    const pr=p.presets().map(x=>x.id+':'+(x.never?'never':sig(x.use/g)+'kg'));
    const hz=p.hazards().map(x=>x.id+':'+(x.never?'never':sig(x.use/g)+'kg'));
    const ce=p.ceiling(), gl=p.goal();
    console.log(label,'s='+s,'goal',gl.reached?sig(gl.use/g)+'kg':'unreached','ceiling',ce.by,ce.by?sig(ce.below/g)+'kg':'','\n  presets',pr.join(' '),'\n  hazards',hz.join(' '),'runs',p.runs(),'ms',ms);
    for (const x of p.presets()) if (!x.never) { const r=p.run(x.use); const M=P.RESTRAINT.MOVES.throw; console.log('   ',x.id,'v',sig(r.v),'landed',r.flight.landed,'esc',r.flight.escaped,'orbit',r.flight.orbit,'rel',r.flight.relativistic,'range',sig(r.flight.range),'vImp',sig(r.flight.vImpact),'blast',sig(M.blast(r,p.opt)),'from',M.blastFrom(r,p.opt)); }
  }
}
show('allstar baseball level', kg*g, 'baseball', 0, 30);
show('default car 45', 90718.474*g, 'car', 45, 30);
show('car 1e9 45', 1e9*g, 'car', 45, 30);
