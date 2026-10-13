const { P, ctx, obj, K } = require('./common');
const ollie = P.makeBody({ build: 'ollie', H: P.DEFAULT_BODIES.ollie.H, m: P.DEFAULT_BODIES.ollie.m });
for (const share of [1, 0.9999, 0.99, 0.9]) {
  const cR = ctx(1e16, { airAbsorb: share }), cO = ctx(1e16, { body: ollie, airAbsorb: share });
  const L = P.catchLeg(cR, cO, obj('baseball'), 100, 'hard');
  const fb = L.fireball;
  console.log('share', share, 'result', L.result, 'kept', L.kept, fb ? ('kind ' + fb.kind + ' Egap/E ' + (fb.Egap / fb.E).toExponential(2) + ' vLumpAt/c ' + (fb.vLumpAt / K.c).toFixed(4) + ' Eblast ' + fb.Eblast.toExponential(2)) : ('vArrive/c ' + (L.vArrive / K.c).toFixed(4) + ' catch carried ' + (L.catch && L.catch.carried) + ' uAfter/c ' + (L.catch && (L.catch.uAfter / K.c).toFixed(4))));
}
