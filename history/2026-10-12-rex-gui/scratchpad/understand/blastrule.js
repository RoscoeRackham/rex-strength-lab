global.window={};
const P=require('./engine-trial.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D=window.DINO_DATA, K=P.K, g=K.g;
const surface=D.surfaces.find(s=>s.id==='concrete');
const body=P.makeBody({build:'rex',H:3.048,m:3007});
const sig=(x)=>typeof x==='number'?Number(x.toPrecision(3)):x;
const M=P.RESTRAINT.MOVES.throw;
console.log('obj dial angle | v mach | dragLoss0/Eobj | dragLoss50/dragLoss0 | blast(1-s)*dragLoss_f ratio | landed0 landed50');
for (const [id,lk,ang] of [['shot',6,45],['shot',7,30],['shot',8,45],['baseball',5.5,30],['baseball',6,45],['bowling',7,45],['car',8,45],['car',9,45],['tank',10,30],['tank',11,30],['pyramid',16,45],['pyramid',18,45],['nimitz',15,45],['esb',17,45]]) {
  const o=D.objects.find(x=>x.id===id);
  const c={F:Math.pow(10,lk)*g,mode:'comic',body,surface,groundHolds:false,anchor:'friction'};
  const r0=P.throwObject(Object.assign({},c,{airAbsorb:0}),o,ang), r5=P.throwObject(Object.assign({},c,{airAbsorb:0.5}),o,ang);
  const b0=M.blast(r0,{obj:o,airAbsorb:0}), b5=M.blast(r5,{obj:o,airAbsorb:0.5});
  console.log(id,lk,ang,'|',sig(r0.v),sig(r0.v/K.a0),'|',sig(r0.dragLoss/r0.Eobj),'|',sig(r5.dragLoss/r0.dragLoss),'|',sig(b5/b0),'|',r0.flight.landed,r5.flight.landed, M.blastFrom(r0,{obj:o,airAbsorb:0}), M.blastFrom(r5,{obj:o,airAbsorb:0.5}));
}
// passenger
const person=D.objects.find(o=>o.id==='person');
const c={F:90718.474*g,mode:'comic',body,surface,groundHolds:false,anchor:'friction'};
const tAll=P.throwObject(c,person,45);
const dg=P.PASSENGER.dragG(person,tAll.v);
console.log('person all-out v',tAll.v,'dragG',dg,'at 50%',0.5*dg,'share needed to be under 1.5 g',1-1.5/dg);
for (const v of [10,30,50,80.28,100,340.29]) console.log(' dragG at',v,'m/s',sig(P.PASSENGER.dragG(person,v)));
