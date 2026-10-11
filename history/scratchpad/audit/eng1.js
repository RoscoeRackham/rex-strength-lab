global.window={}; const P=require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js'); const D=window.DINO_DATA;
const surf=D.surfaces.find(s=>s.id==='concrete');
const mk=(kg,o={})=>Object.assign({F:kg*9.80665,mode:'comic',body:P.makeBody({H:2,m:180}),surface:surf,groundHolds:false,anchor:'friction'},o);
const G=6.6743e-11;
const L=P.liftPartner(mk(100*907.18474),mk(100*907.18474));
console.log('lift Fg',L.Fg,'dOver',L.dOver,'G m^2/1.5^2',G*180*180/2.25, '0.385 G m^2/0.7005^2', 0.385*G*180*180/Math.pow(0.70053,2));
// fallThrough 1e8 Stevenson note
const b=P.makeBody({H:2,m:1e8});
if (P.fallThrough) { const f=P.fallThrough(b,{}); console.log('1e8 stuck', f.stuck, f.t/3600, 'h', f.rStop); }
console.log(Object.keys(P).join(' '));
