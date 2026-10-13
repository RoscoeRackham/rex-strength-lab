const { P, D, body, surf, ctx } = require('./eng.js');
const ob = P.makeBody({ build: 'ollie', H: 3.06, m: 3007 });
const cR = ctx(1e20), cO = Object.assign(ctx(1e20), { body: ob });
const o = D.objects.find((x) => x.id === 'baseball');
for (const share of [1, 0.5]) {
  const L = P.catchLeg(Object.assign({}, cR, { airAbsorb: share }), Object.assign({}, cO, { airAbsorb: share }), o, 10, 'hard');
  console.log('share', share, 'result', L.result, 'kept', L.kept, 'vArrive/c', L.vArrive / P.K.c);
  if (L.catch) console.log('  carried', L.catch.carried, 'uAfter/c', L.catch.uAfter / P.K.c, 'slide', L.catch.slide, 'Ecatch', L.catch.Ecatch.toPrecision(3), 'KE after (classical, Ollie+ball)', (0.5 * (ob.m + o.m) * L.catch.uAfter ** 2).toPrecision(3));
  if (L.fireball) console.log('  fireball E', L.fireball.E && L.fireball.E.toPrecision(3), Object.keys(L.fireball).join(','));
  console.log('  drag', L.drag && L.drag.E, 'aim vL', L.aim && L.aim.vL);
  const hand = P.handAir ? P.handAir(body, o, L.aim.vL, 1 + 0) : null;
  console.log('  keys', Object.keys(L).join(','));
}
