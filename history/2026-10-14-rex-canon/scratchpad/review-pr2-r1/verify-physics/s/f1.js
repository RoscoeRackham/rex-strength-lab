const R='/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r1/verify-physics/repo/rex-strength-lab';
const P = require(R+'/src/engine.js'); global.window = {}; require(R+'/src/data.js'); const D = window.DINO_DATA;
const g=P.K.g;
const rex=P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex }), ollie=P.makeBody({ build: 'ollie', ...P.DEFAULT_BODIES.ollie });
const surf=D.surfaces.find(s=>s.id==='concrete');
const ON={airAbsorb:1,keepForm:true,unbreakable:true,ownRecoil:true};
const mk=(kg,body,x,mode)=>Object.assign({F:kg*g,mode:mode||'comic',body,surface:surf,anchor:'friction'},x);
const dial=90718.474;
for (const mode of ['comic','real']) for (const f of [0.5,0.9,0.99]) {
  const r=P.armWrestle(mk(dial,rex,ON,mode),mk(dial*f,ollie,ON,mode));
  const Aw=r.AA, Pl=r.PB, t=r.pin.t;
  console.log(mode,f,r.outcome,'J',r.recoilAbsorbed&&r.recoilAbsorbed.J.toFixed(0),'Aw*t',(Aw*t).toFixed(0),'Pl*t',(Pl*t).toFixed(0),'(Aw-Pl)t',((Aw-Pl)*t).toFixed(0),'toGround',r.toGround&&r.toGround.J.toFixed(0),'t',t);
}
