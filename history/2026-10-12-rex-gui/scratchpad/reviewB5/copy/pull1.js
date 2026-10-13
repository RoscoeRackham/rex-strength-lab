const P=require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'); global.window={}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D=window.DINO_DATA;
const s=D.surfaces.find(s=>s.id==='granite');
for (const m of [3007, 3e5, 3e7, 3e9]) {
  const body=P.makeBody({build:'rex',H:3.048,m});
  const obj=D.objects.find(o=>o.id==='nimitz');
  for (const own of [false,true]) {
    const c={F:1e14*P.K.g, mode:'comic', body, surface:s, anchor:'friction', airAbsorb:1, keepForm:true, unbreakable:true, ownRecoil:own};
    const r=P.pull(c,obj);
    const o={surface:s, ownRecoil:own, obj, near:5};
    const sh=P.RESTRAINT.MOVES.pull.shake(r,o);
    const hyp = P.impulseSource ? null : null;
    console.log('m',m,'own',own,'R',r.anchor&&r.anchor.R.toExponential(2),'t10m',r.t10m&&r.t10m.toFixed(2),'shake',sh? 'ppv5='+P.ppvAt(sh,5).toExponential(2)+' plasterReach='+P.plasterReach(sh).toFixed(1):'none');
  }
}
