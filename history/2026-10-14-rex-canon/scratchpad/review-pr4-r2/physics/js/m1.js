const {P,D,rex,ollie,ctx,show,fmt,DIAL}=require('./h.js');
const K=P.K;
const keys=['outcome','winner','noAnswer','DA','DB','HA','HB','contact','d','t','vA','vB','pA','pB','slideA','slideB','footA','footB','recoilAbsorbedA.J','recoilAbsorbedB.J','tornA','tornB','tearA','tearB','holdAfterA','holdAfterB','accel','aLoser','aFeet','clash','oneSided'];
const pm=(label,a,b)=>{const r=P.pushMatch(ctx(Object.assign({body:rex()},a)),ctx(Object.assign({body:ollie()},b)));
 console.log(label+':', show(r,keys.filter(k=>k.split('.').reduce((x,y)=>x==null?x:x[y],r)!==undefined)));
 if (r.t!=null){ // ledger: each recoil J = what he gives other... A's push DA*t = pB + footB? (B's momentum gain + B's feet)
   const JA=r.recoilAbsorbedA?r.recoilAbsorbedA.J:0, JB=r.recoilAbsorbedB?r.recoilAbsorbedB.J:0;
   console.log('   ledger: A push J',fmt(JA),' -> B gain+B feet',fmt((r.pB||0)+(r.footB||0)),' | B push J',fmt(JB),' -> A gain + A feet', fmt((r.pA||0)+(r.footA||0)));
 }
 return r;};
pm('default dial',{},{});
pm('least 2570kg',{kg:2570},{kg:2570});
pm('9.06t',{kg:9060},{kg:9060});
pm('rex bolted ub',{anchor:'bolted'},{});
pm('rex bolted real rock',{anchor:'bolted',unbreakable:false},{unbreakable:false});
pm('rex bolted real rock 5.47t',{anchor:'bolted',unbreakable:false,kg:5470},{unbreakable:false,kg:5470});
pm('rex bolted real rock 71t',{anchor:'bolted',unbreakable:false,kg:71000},{unbreakable:false,kg:71000});
pm('rex bolted real rock 72t',{anchor:'bolted',unbreakable:false,kg:72000},{unbreakable:false,kg:72000});
pm('ollie bolted ub unlimited',{kg:Infinity},{anchor:'bolted',kg:Infinity});
pm('rex bolted ub unlimited',{anchor:'bolted',kg:Infinity},{kg:Infinity});
pm('both bolted ub unlimited',{anchor:'bolted',kg:Infinity},{anchor:'bolted',kg:Infinity});
pm('rex bolted real unlimited',{anchor:'bolted',kg:Infinity,unbreakable:false},{kg:Infinity,unbreakable:false});
pm('unequal: rex dial vs ollie 1t',{},{kg:1000});
pm('unequal: rex dial vs ollie 3t',{},{kg:3000});
pm('unequal: rex 3t vs ollie 1.8t',{kg:3000},{kg:1800});
pm('unequal: rex 2t vs ollie 1t',{kg:2000},{kg:1000});
pm('ice default',{surface:'ice'},{surface:'ice'});
pm('real muscle default',{mode:'real'},{mode:'real'});
pm('powers off',{ownRecoil:false},{ownRecoil:false});
