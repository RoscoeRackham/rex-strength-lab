global.window = {};
require(process.argv[2] + '/src/data.js');
const D = window.DINO_DATA; const L = require(process.argv[2] + '/src/ladder.js');
const R = D.energyRefs; console.log('rungs', R.length, 'rough', R.filter(r=>r.rough).map(r=>r.id).join(','));
const i = R.findIndex(r=>r.id==='snblast'); const a=R[i-1], b=R[i+1];
console.log('neighbours', a.id, a.J, b.id, b.J, 'blast named from', Math.sqrt(a.J*1e44).toExponential(2), 'to', Math.sqrt(b.J*1e44).toExponential(2));
for (let e=43.0; e<=44.25; e+=0.125) { const J=10**e; const c=L.compare(J,R); console.log(J.toExponential(2), c.text); }
