global.window={};require('/home/user/dino-strength-sim/src/data.js');const D=window.DINO_DATA;
const P0=require('/home/user/dino-strength-sim/src/engine.js');
const P=require('./r4_engine_patched.js');const K=P.K;
const cases=[[Math.log10(90718.474),'concrete'],[6,'concrete'],[4.5,'concrete'],[30,'granite'],[12,'steel'],[Math.log10(90718.474),'gravel'],[Math.log10(90718.474),'sand'],[6,'asphalt'],[6,'ice']];
for(const [lk,sid] of cases){const s=D.surfaces.find(x=>x.id===sid);
 for(const mode of ['real','comic']){
  const c={F:Math.pow(10,lk)*K.g,mode,body:P.makeBody({H:2,m:180}),surface:s,groundHolds:false,anchor:'friction'};
  const a=P0.jump(c), b=P.jump(c);
  console.log(mode.padEnd(5),sid.padEnd(9),lk.toFixed(2),'OLD fails',a.groundFails,'E',a.Eground.toPrecision(4),'v',a.v.toFixed(3),'| NEW fails',b.groundFails,'E',b.Eground.toPrecision(4),'RBxB',(b.groundLimitForce*b.push.xB).toPrecision(4),'vBmax',b.push.vBmax,'vBend',b.push.vB.toFixed(2),'v',b.v.toFixed(3));
 }}
