const { P, D, g, rex, ollie, surf, ON, OFF, ctx, DIAL } = require('./env.js');
for (const own of [true, false]) {
  const x = { keepForm: false, unbreakable: false, ownRecoil: own, airAbsorb: 1 };
  const r = P.armWrestle(ctx(1e6, rex, x), ctx(DIAL, ollie, Object.assign({ anchor: 'bolted' }, x)));
  console.log('ownRecoil', own, r.outcome, 'winner', r.winner, 'tableBreaks', r.tableBreaks, 'AA', r.AA.toExponential(3), 'AB', r.AB.toExponential(3), 'tearB', r.tearB, 'loserSlides', r.loserSlides, 'winnerSlides', r.winnerSlides, 'contact', r.contact);
}
