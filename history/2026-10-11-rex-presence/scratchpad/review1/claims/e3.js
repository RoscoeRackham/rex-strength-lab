const { P, D, g, surf, rex } = require('./e1.js');
const o = { pace: 'walk', groundHolds: false };
for (const sf of ['softclay', 'sand', 'concrete']) {
  const one = P.walkEffortFor(rex, surf(sf), o, P.VIB.TH.plasterWalk, 3), two = P.walkEffortFor(rex, surf(sf), o, P.VIB.TH.plasterWalk / 2, 3);
  const r1 = P.walkEffortFor(rex, surf(sf), o, P.VIB.TH.shimmer, 3), r2 = P.walkEffortFor(rex, surf(sf), o, P.VIB.TH.shimmer / 2, 3);
  console.log(sf, 'plaster@3m effort one walker', one.toFixed(3), 'both in step', two.toFixed(3), '| ripple one', r1.toFixed(3), 'both', r2.toFixed(3));
}
// granite: stomp PPV at 3 m vs glass threshold, at several strengths
for (const kg of [90718.474, 1e7, 1e9]) {
  const c = { F: kg * g, mode: 'comic', body: rex, surface: surf('granite'), groundHolds: false, anchor: 'friction' };
  const r = P.stomp(c);
  const src = P.RESTRAINT.MOVES.stomp.shake(r, { near: 3, body: rex, surface: surf('granite'), m: rex.m });
  console.log('granite stomp', kg, 'kg-f: PPV@3m', (P.ppvAt(src, 3) * 1e3).toPrecision(3), 'mm/s (glass 0.2, feel 0.3)');
}
