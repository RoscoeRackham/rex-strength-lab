const {P, obj, ctx, rex, ollie, ALL} = require('./load.js');
const run = (lk) => { const cR = ctx(Math.pow(10, lk), Object.assign({}, ALL, { airAbsorb: 0.99 })), cO = Object.assign({}, cR, { body: ollie }); return P.catchLeg(cR, cO, obj('baseball'), 1000, 'hard'); };
let lo = 20, hi = 23.26;
for (let i = 0; i < 50; i++) { const mid = 0.5*(lo+hi); if (run(mid).result === 'fireball') lo = mid; else hi = mid; }
for (const lk of [lo - 0.01, hi + 0.01]) {
  const L = run(lk);
  console.log('logKg', lk.toFixed(3), L.result, L.fireball ? ['kind', L.fireball.kind, 'Egap/E', (L.fireball.Egap/L.fireball.E).toFixed(4), 'E', L.fireball.E.toExponential(3), 'Eblast', L.fireball.Eblast.toExponential(3)] : ['sheath', L.sheath.share.toFixed(4), 'Ecatch', L.catch.Ecatch.toExponential(3), 'carried', L.catch.carried, 'Enear', (L.catch.Enear||0).toExponential(3), 'sheathE', L.sheath.E.toExponential(3)]);
}
