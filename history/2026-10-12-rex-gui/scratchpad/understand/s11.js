global.window={}; const P=require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'); require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D=window.DINO_DATA;
const g=9.80665, surf=(id)=>D.surfaces.find(s=>s.id===id), obj=(id)=>D.objects.find(o=>o.id===id);
const f=(x)=>typeof x==='number'?(isFinite(x)?(x/g).toPrecision(3)+'kg':String(x)):String(x);
const rex=P.makeBody({build:'rex',H:3.048,m:3007});
const cases=[['jump',{target:3}],['stomp',{}],['throw',{obj:obj('car'),angle:45,target:30}],['sprint',{target:12.42}]];
for (const sid of ['sand','concrete']) for (const [mv,o] of cases) for (const gh of [false,true]) {
  const c={F:100*907.18474*g,mode:'comic',body:rex,surface:surf(sid),anchor:'friction',groundHolds:gh};
  const p=P.RESTRAINT.planNow(mv,c,o);
  const pr=p.presets().map(x=>x.id+':'+(x.never?'never':f(x.use)));
  const hz=p.hazards().map(x=>x.id+':'+(x.never?'never':f(x.use)));
  const ce=p.ceiling();
  console.log(sid,mv,'gh',gh,'| ceiling',ce.by,f(ce.below),'| presets',pr.join(' '),'| hazards',hz.join(' '));
}
