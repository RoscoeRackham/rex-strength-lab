global.window = {};
const P = require('./head/engine.js');
require('./head/data.js');
const D = window.DINO_DATA;
const o = D.objects.find((x) => x.id === 'person');
console.log('dragG(78.2)', P.PASSENGER.dragG(o, 78.2), 'dragG(80.3)', P.PASSENGER.dragG(o, 80.3), 'noHarm(1)', P.PASSENGER.noHarm(1), 'noHarm(0.093)', P.PASSENGER.noHarm(0.093));
console.log(P.PASSENGER.dragG.toString().slice(0, 600));
console.log(P.PASSENGER.noHarm.toString().slice(0, 600));
