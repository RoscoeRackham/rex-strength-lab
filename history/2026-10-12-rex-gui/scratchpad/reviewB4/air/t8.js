const {P, obj, ctx, rex, ollie, ALL} = require('./load.js');
const run = (s) => { const cR = ctx(1e20, Object.assign({}, ALL, { airAbsorb: s })), cO = Object.assign({}, cR, { body: ollie }); return P.catchLeg(cR, cO, obj('baseball'), 1000, 'hard'); };
let lo = 0.99, hi = 0.9999;  // lo: fireball, hi: caught
for (let i = 0; i < 60; i++) { const mid = 0.5*(lo+hi); if (run(mid).result === 'fireball') lo = mid; else hi = mid; }
for (const s of [lo, hi]) {
  const L = run(s); const fb = L.fireball || (L.sheath ? null : null);
  console.log('share', s.toFixed(8), L.result, L.fireball ? ['kind', L.fireball.kind, 'Egap/E', (L.fireball.Egap/L.fireball.E).toFixed(5), 'Eblast', L.fireball.Eblast.toExponential(3), 'Ehere', L.fireball.Ehere.toExponential(3), 'recoilV/c', (L.fireball.push.recoilV/P.K.c).toFixed(5)] : ['sheath share', L.sheath.share.toFixed(5), 'sheath E', L.sheath.E.toExponential(3), 'Ecatch', L.catch.Ecatch.toExponential(3), 'Enear', (L.catch.Enear||0).toExponential(3), 'uAfter/c', (L.catch.uAfter/P.K.c).toFixed(5)], 'hand', L.hand && L.hand.E.toExponential(3));
}
console.log('threshold share', ((lo+hi)/2).toFixed(6));
