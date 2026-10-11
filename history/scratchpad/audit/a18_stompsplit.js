const { P, g, ctx } = require('./lib.js');
for (const lg of [2.71, 4, 8, 14, 18, 20, 24, 34]) {
  const c = ctx({ logKg: lg, mode: 'comic', surface: 'granite' });
  const r = P.stomp(c);
  const claimed = 100 * (1 - c.body.legEff / c.body.m);
  console.log('lift 1e' + lg, '| foot share of energy', (100 * r.push.EB / (r.push.EA + r.push.EB)).toFixed(1) + '%', '| UI claims', claimed.toFixed(1) + '%');
}
// punch lurch at max slider vs infinity
const a = P.punch(ctx({ logKg: 34 })), b = P.punch(ctx({ inf: true }));
console.log('punch lurch at 1e34 kg', a.lurch.toFixed(4), 'm; at infinite strength', b.lurch.toFixed(4), 'm; fist energy share at 1e34', (a.push.EB / (a.push.EA + a.push.EB)).toFixed(3));
