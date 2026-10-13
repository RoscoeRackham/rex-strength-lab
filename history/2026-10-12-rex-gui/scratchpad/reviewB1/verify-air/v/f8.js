const { P, obj, rex, ollie, ctx, K } = require('./env.js');
const car = obj('car');
for (const kg of [1e6, 1e8]) for (const share of [0, 0.5, 0.9]) {
  const L = P.catchLeg(ctx(kg, rex(), { airAbsorb: share }), ctx(kg, ollie(), { airAbsorb: share }), car, 1000, 'hard');
  if (!L.aim || !L.drag) { console.log(`kg=${kg} share=${share} result=${L.result}`); continue; }
  const KE = 0.5 * car.m * L.aim.vL ** 2;
  console.log(`kg=${kg.toExponential(0)} share=${share} result=${L.result} vL=${L.aim.vL.toFixed(1)} m/s (Mach ${(L.aim.vL/K.a0).toFixed(2)}) KE=${KE.toExponential(3)} drag.E=${L.drag.E.toExponential(3)} (${(L.drag.E/KE*100).toFixed(1)}% of KE) nearT=${L.drag.nearT.toExponential(3)} | throw-tab rule (1-share)*drag.E=${((1-share)*L.drag.E).toExponential(3)}`);
}
