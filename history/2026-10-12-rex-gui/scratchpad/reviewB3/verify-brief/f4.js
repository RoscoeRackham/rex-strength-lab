const { P, D, rex, surf, ctx } = require('./common.js');
const ollie = P.makeBody({ build: 'ollie', H: 3.06, m: 3007 });
const car = D.objects.find(o => o.id === 'car');
let E0;
for (const share of [0, 0.5, 0.75, 0.9]) {
  const cR = ctx({ F: 1e9 * P.K.g, airAbsorb: share }), cO = ctx({ F: 1e9 * P.K.g, body: ollie, airAbsorb: share });
  const L = P.catchLeg(cR, cO, car, 100, 'hard');
  const k = P.dragFactor(cR);
  const judged = k * (L.drag.E || 0);
  if (share === 0) E0 = L.drag.E;
  console.log(`share=${share} k=${k} vL=${L.aim && L.aim.vL.toFixed(0)} result=${L.result} L.drag.E=${(L.drag.E/1e9).toFixed(3)}GJ judged(k*E)=${(judged/1e9).toFixed(3)}GJ ratio judged/E0=${(judged/E0).toFixed(3)} hand=${L.hand ? (L.hand.E/1e9).toFixed(4)+'GJ' : '-'}`);
}
