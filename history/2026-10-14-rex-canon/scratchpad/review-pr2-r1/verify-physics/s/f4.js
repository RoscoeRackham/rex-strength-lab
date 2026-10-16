const base='/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r1/verify-physics/';
const which=process.argv[2]; const R=base+(which==='main'?'main':'repo')+'/rex-strength-lab';
const P = require(R+'/src/engine.js'); global.window = {}; require(R+'/src/data.js'); const D = window.DINO_DATA;
const g=P.K.g;
const rex=P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex });
const ON={airAbsorb:1,keepForm:true,unbreakable:true,ownRecoil:true};
const out=[];
for (const [sid,ang,objs,kgs] of [['sand',0,['car','pickup'],[1e7,1e8,1e9]],['concrete',45,['car','pickup'],[1e9]],['concrete',0,['car','pickup'],[1e9]],['gravel',0,['car','pickup'],[1e9]]]) for (const oid of objs) for (const kg of kgs) {
  const surf=D.surfaces.find(s=>s.id===sid), obj=D.objects.find(o=>o.id===oid);
  const c=Object.assign({F:kg*g,mode:'comic',body:rex,surface:surf,anchor:'friction'},ON);
  const o={obj,angle:ang,target:30,near:5};
  const r=P.throwObject(c,obj,ang);
  const opt=Object.assign({near:5,groundHolds:false,m:rex.m,body:rex,surface:surf,anchor:'friction',airAbsorb:1,keepForm:true,unbreakable:true,ownRecoil:true},o);
  const re=P.RESTRAINT.reach('throw',r,opt);
  const pl=P.RESTRAINT.planNow('throw',c,o);
  const ceil=pl.ceiling(); const pr=pl.presets();
  const f=(x)=>x.never?'never':(x.use/g).toPrecision(4);
  out.push([sid,ang,oid,kg.toExponential(0),'plasterReach',re.plaster.toPrecision(4),'ceiling',(ceil.use/g).toPrecision(4),ceil.by,'presets',pr.map(p=>p.id+':'+f(p)).join(' ')].join(' '));
}
console.log(which+'\n'+out.join('\n'));
