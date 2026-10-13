const { P, obj, rex, ollie, ctx, K } = require('./env.js');
const kg = 1.81436948e23, b = obj('baseball');
for (const share of [0.5, 0.01]) for (const keep of [true, false]) {
  const L = P.catchLeg(ctx(kg, rex(), { airAbsorb: share, keepForm: keep }), ctx(kg, ollie(), { airAbsorb: share, keepForm: keep }), b, 1e6, 'hard');
  console.log(`share=${share} keepForm=${keep} result=${L.result} kept=${L.kept} fireball.kind=${L.fireball && L.fireball.kind} Egap/E=${L.fireball && (L.fireball.Egap / L.fireball.E).toFixed(4)} vapRatio=${L.fireball && L.fireball.vapRatio.toExponential(2)}`);
}
// also game: does catchGame produce fireball too?
const g = P.catchGame(ctx(kg, rex(), { airAbsorb: 0.5 }), ctx(kg, ollie(), { airAbsorb: 0.5 }), b, 1e6, 'hard');
console.log('game keys', Object.keys(g).join(','));
