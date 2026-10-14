const { P, obj, rex, ollie, ctx, K } = require('./env.js');
const g = K.g;
const seen = {};
let maxV = 0;
for (const kg of [1e5, 1e9, 1e12]) for (const [oid, Dd] of [['car', 30], ['baseball', 30], ['piano', 100], ['shot', 1000]]) for (const style of ['easy', 'hard']) {
  const cR = { F: kg * g, mode: 'comic', body: rex(), surface: require('./env.js').surf('concrete'), anchor: 'friction', keepForm: true };
  const cO = Object.assign({}, cR, { body: ollie() });
  const b = P.catchLeg(cR, cO, obj(oid), Dd, style);
  seen[b.result] = (seen[b.result] || 0) + 1;
  if (b.aim) maxV = Math.max(maxV, b.aim.vL);
}
console.log('results with keepForm on over the test grid:', JSON.stringify(seen), 'max launch speed / c =', (maxV / K.c).toExponential(3));
// and a dial past 1% c with keepForm on and share 0.5 -> fireball (would pass the test as written)
const L = P.catchLeg(ctx(1.81436948e23, rex(), { airAbsorb: 0.5 }), ctx(1.81436948e23, ollie(), { airAbsorb: 0.5 }), obj('baseball'), 30, 'hard');
const broke = ['crushed-launch', 'breaks-up', 'burns-up', 'wreckage'];
console.log('All-Star, 50%, keepForm on, D 30 m: result', L.result, '-> counted as broken by the test list?', broke.includes(L.result) || !!L.bursts);
