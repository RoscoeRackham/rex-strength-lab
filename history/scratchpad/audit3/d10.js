global.window = {};
require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
console.log(Object.keys(D));
const s = JSON.stringify(D.sourceRows)+JSON.stringify(D.assumptions);
for (const k of ['Cd','0.8 m','frontal','0.3%','0.3 m','claw','dig','2.5','0.9','0.6 m','stomp','clap','drag','whip','release','stance']) console.log(k, s.includes(k));
console.log(JSON.stringify(D.assumptions,null,1));
