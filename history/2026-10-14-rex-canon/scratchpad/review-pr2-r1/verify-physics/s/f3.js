const R='/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r1/verify-physics/repo/rex-strength-lab';
const P = require(R+'/src/engine.js'); global.window = {}; require(R+'/src/data.js'); const D = window.DINO_DATA;
const g=P.K.g;
const rex=P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex });
const surf=D.surfaces.find(s=>s.id==='concrete');
const M=P.RESTRAINT.MOVES.stomp;
for (const anchor of ['friction','bolted']) for (const kg of [20000,90718.474]) for (const mode of ['comic']) {
  const c={F:kg*g,mode,body:rex,surface:surf,anchor,airAbsorb:0,keepForm:false,unbreakable:false,ownRecoil:false};
  const r=P.stomp(c), pp=r.push;
  const o={surface:surf,body:rex,near:5,anchor};
  const b=M.blow(r,o), src=M.shake(r,o);
  console.log(anchor,kg,'basis',r.basis,'F',r.F.toFixed(0),'mA g',((rex.m-rex.legEff)*g).toFixed(0),'pA',pp.pA.toFixed(0),'pB',pp.pB.toFixed(0),'unload pB-pA',(pp.pB-pp.pA).toFixed(0),'blow J',b&&b.J.toFixed(0),'T',b&&b.T,'ppv5 mm/s',(P.ppvAt(src,5)*1000).toFixed(3),'bolted',r.bolted,'vBody',r.vBody);
}
