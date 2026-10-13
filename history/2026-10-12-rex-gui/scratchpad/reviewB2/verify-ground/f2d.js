const {P,D,rex,surf,ON,OFF,ctx}=require('./h.js');
const R=P.RESTRAINT, M=R.MOVES, g=P.K.g;
const s=surf('granite');
const o={surface:s,body:rex,m:rex.m,unbreakable:true,near:5};
const shakeFixed=(r)=>{ const L=M.jump.shake(r,o); const list=[].concat(L||[]); if(!r.pushOff && r.v>0) list.push(P.impulseSource(s,P.vToMomentum(r.v,rex.m),r.push.t)); return list; };
const test=(u)=>P.plasterOver(shakeFixed(P.jump(Object.assign(ctx(1e9,'granite',ON),{use:u}))),5);
const sr=R.search(test,0.01*rex.m*g,1e9*g,false,null); while(sr.use===undefined) sr.step();
console.log('granite jump plaster onset with push-off always counted (kgf):',(sr.use/g).toExponential(3));
