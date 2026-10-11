global.window={};require('/home/user/dino-strength-sim/src/data.js');const D=window.DINO_DATA;
const P=require('/home/user/dino-strength-sim/src/engine.js');const K=P.K;
for(const s of D.surfaces){const rows=[];
 for(let lk=2.5;lk<=30;lk+=0.5){const body=P.makeBody({H:2,m:180});
  const r=P.jump({F:Math.pow(10,lk)*K.g,mode:'real',body,surface:s,groundHolds:false,anchor:'friction'});
  if(r.groundFails) rows.push(lk.toFixed(1)+':xB='+r.push.xB.toExponential(1)+',vB='+r.push.vB.toFixed(1)+',E='+r.Eground.toExponential(1)+',RBxB='+(r.groundLimitForce*r.push.xB).toExponential(1));
  else if(r.heldBack) rows.push(lk.toFixed(1)+':held');
 }
 console.log(s.id, rows.filter((_,i)=>i%3===0).join(' | '));
}
