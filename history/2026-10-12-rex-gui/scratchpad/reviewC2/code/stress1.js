global.window = {};
const R0='/home/user/rex-strength-lab/rex-strength-lab/';
require(R0+'src/data.js');
const D = window.DINO_DATA;
const L = require(R0+'src/ladder.js');
const R = D.energyRefs.slice().sort((a,b)=>a.J-b.J);
console.log('rungs', R.length);
for (let i=0;i<R.length;i++) console.log(i, R[i].id, R[i].J.toExponential(3), R[i].rough?'ROUGH':'', i? (R[i].J/R[i-1].J).toFixed(1)+'x':'', '|', R[i].short);
// ids unique
const ids = R.map(r=>r.id); console.log('dup ids', ids.filter((x,i)=>ids.indexOf(x)!==i));
const Js = R.map(r=>r.J); console.log('dup J', Js.filter((x,i)=>Js.indexOf(x)!==i));
const shorts = R.map(r=>r.short); console.log('dup shorts', shorts.filter((x,i)=>shorts.indexOf(x)!==i));
