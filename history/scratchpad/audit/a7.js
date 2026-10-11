const { P, D, g, S, O, T, ctx } = require('./common');
const f = (x) => (typeof x === 'number' ? x.toPrecision(4) : String(x));
for (const deg of [0, 1]) {
  const c = ctx(3000, { surface: 'sand' });
  const r = P.throwObject(c, O.car, deg);
  console.log('car on sand lift 3000kg deg', deg, 'Fthrow', f(r.F), 'anchor R', f(r.anchor.R), r.anchor.limit, '| v', f(r.v), 'recoilV', f(r.recoilV), 'range', f(r.flight.range), 'canMove', r.canMove);
}
// lift(): standing on sand with a car: W > Nmax
const c = ctx(3000, { surface: 'sand' });
console.log('Nmax sand', 150e3 * 0.09, 'W dino+car', (180 + 1360) * g, 'lift groundRatio', P.lift(c, O.car).groundRatio.toFixed(3));
// Jump chip mismatch: UI uses c.F/RB, engine groundFails uses r.F (= comicFrac*F)
for (const [sid, kg] of [['concrete', 1.0e5], ['concrete', 1.2e5], ['asphalt', 2.0e4], ['sand', 1500]]) {
  const cc = ctx(kg, { surface: sid });
  const r = P.jump(cc);
  const chipRatio = cc.F / r.groundLimitForce;
  console.log('jump chip', sid, 'lift', kg, 'chip ratio c.F/RB =', chipRatio.toFixed(3), chipRatio > 1 ? '"Ground fails"' : '"Ground holds"', '| engine groundFails', r.groundFails, 'r.F/RB', (r.F / r.groundLimitForce).toFixed(3), 'apex', r.flight.apex.toFixed(2), 'sink', r.sink);
}
