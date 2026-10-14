const { P, obj, rex, ollie, ctx, K } = require('./env.js');
const kg = 1.81436948e23, b = obj('baseball');
const res = {};
for (const share of [0, 0.5]) {
  const L = P.catchLeg(ctx(kg, rex(), { airAbsorb: share }), ctx(kg, ollie(), { airAbsorb: share }), b, 1e6, 'hard');
  const fb = L.fireball; res[share] = fb;
  const fa = P.fastAir(b, fb.E, 0, 1 - share);
  console.log(`share=${share} catch: Egap/E=${(fb.Egap/fb.E).toFixed(4)} sweep=${fb.sweep.toExponential(3)} m kind=${fb.kind} | fastAir same E: E/E=${(fa.E/fb.E).toFixed(4)} sweepK=${fa.sweepK.toExponential(3)}`);
}
console.log('catch ratio 50%/0% =', (res[0.5].Egap / res[0].Egap).toFixed(4));
const fa0 = P.fastAir(b, res[0].E, 0, 1), fa5 = P.fastAir(b, res[0].E, 0, 0.5);
console.log('fastAir ratio 50%/0% (level) =', (fa5.E / fa0.E).toFixed(4));
