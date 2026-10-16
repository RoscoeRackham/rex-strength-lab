const {P,D,rex,ollie,ctx,show,fmt,DIAL}=require('./h.js');
const K=P.K;
const st=(label,a,b)=>{const r=P.standoff(ctx(Object.assign({body:ollie()},a)),ctx(Object.assign({body:rex()},b)));
 console.log(label, r.outcome, show(r,['DA','HB','RB','contact','net','rockGives','tearB','drive.d','drive.t','drive.vB','drive.pB','drive.EB','drive.slideB','drive.footB','recoilAbsorbed.J','rock.tear','clash','oneSided']));
 if(r.drive) console.log('   ledger: recoil J', fmt(r.recoilAbsorbed.J), ' = pB+footB', fmt(r.drive.pB + r.drive.footB));
 return r;};
st('default dial',{},{});
st('least 5.47t',{kg:5470},{});
st('bolted rex real rock',{unbreakable:false},{unbreakable:false,anchor:'bolted'});
st('bolted rex real rock 13.5t',{kg:13500,unbreakable:false},{unbreakable:false,anchor:'bolted'});
st('bolted rex unbreakable',{},{anchor:'bolted'});
st('unlimited vs standing',{kg:Infinity},{});
st('unlimited vs bolted ub',{kg:Infinity},{anchor:'bolted'});
st('unlimited vs bolted real',{kg:Infinity,unbreakable:false},{anchor:'bolted',unbreakable:false});
st('bolted pusher unlimited vs bolted real',{kg:Infinity,unbreakable:false, anchor:'bolted'},{anchor:'bolted',unbreakable:false});
st('powers off',{ownRecoil:false},{ownRecoil:false});
// manual check of 37.6 m/s
const f=DIAL*K.g-17652, d=2.4384; console.log('manual v=', Math.sqrt(2*f*d/3000));
// on ice
for (const s of ['ice','sand','softclay','steel','granite','gravel','asphalt']) st('surface '+s,{surface:s},{surface:s});
