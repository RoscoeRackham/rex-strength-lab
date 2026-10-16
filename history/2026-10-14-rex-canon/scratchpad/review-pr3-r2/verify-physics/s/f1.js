const R='/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r2/verify-physics/repo/rex-strength-lab';
const P = require(R+'/src/engine.js'); global.window = {}; require(R+'/src/data.js'); const D = window.DINO_DATA;
const o = D.objects.find(x=>x.passenger);
console.log('person', JSON.stringify(o).slice(0,300));
const L = o.L || Math.cbrt(6*o.m/(Math.PI*(o.rho||1000)));
console.log('L', L, 'L/1ms', L/1e-3);
for (const s of D.surfaces) {
  const lg = P.PASSENGER.landGround(o, 10, s);
  const vNoFloor = Math.sqrt(lg.bear*L/o.m);
  const vb = lg.vBear;
  console.log(s.id.padEnd(12), 'bear', lg.bear.toExponential(3), 'vBear', vb.toFixed(1), 'noFloor', vNoFloor.toFixed(1), 'pen at vBear (vT/2) m', (vb*Math.max(1e-3, L/vb)/2).toFixed(2));
}
// granite at 10.11 km/s
const gr = D.surfaces.find(s=>s.id==='granite');
const lgg = P.PASSENGER.landGround(o, 10110, gr);
console.log('granite 10.11km/s', lgg, 'push over L/v', o.m*10110*10110/L, 'ratio', o.m*10110*10110/L/lgg.bear, 'hann peak floored', 2*lgg.push);
