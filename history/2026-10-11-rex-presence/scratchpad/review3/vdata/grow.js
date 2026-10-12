global.window = {};
const L = '/home/user/rex-strength-lab/rex-strength-lab/';
const P = require(L + 'src/engine.js'); require(L + 'src/data.js');
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
for (const [n, E] of [['chicxulub', 4.2e23], ['sun1s', 3.828e26]]) for (const s of [0.5, 1]) {
  const a = P.gradualGrowth(rex, E, s), b = P.gradualGrowth(rex, E, s, { gap: 5 });
  console.log(n, 's=' + s, 'T', (a.T / 60).toFixed(2), 'min by', a.by, '| air-only Tp at 2 m', a.Tp.toFixed(2), 's; at 5 m', b.Tp.toFixed(2), 's; T at 5 m', (b.T / 60).toFixed(2));
}
console.log('GAP', P.GROW.GAP);
