global.window = {};
require(process.argv[2] + '/src/data.js');
const D = window.DINO_DATA; const L = require(process.argv[2] + '/src/ladder.js');
const R = D.energyRefs.slice().sort((a,b)=>a.J-b.J);
for (const r of R) {
  console.log([L.compare(r.J*3.1,R), L.compare(r.J*0.42,R), L.compare(r.J,R)].map(c=>c.text).join('  ||  '));
}
console.log(L.compare(1e48,R).text); console.log(L.compare(0.3,R).text);
