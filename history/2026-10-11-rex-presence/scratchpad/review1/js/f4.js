const { P, g, surf, rex, ollie } = require('./env.js');
for (const sid of ['concrete', 'sand']) {
  const sf = surf(sid), o = { pace: 'walk', effort: 0, groundHolds: false };
  const TH = P.VIB.TH;
  const one = [P.walkEffortFor(rex, sf, o, TH.shimmer, 3, true), P.walkEffortFor(rex, sf, o, TH.feel, 3), P.walkEffortFor(rex, sf, o, TH.plasterWalk, 3)];
  const two = [P.walkEffortFor(rex, sf, o, TH.shimmer / 2, 3, true), P.walkEffortFor(rex, sf, o, TH.feel / 2, 3), P.walkEffortFor(rex, sf, o, TH.plasterWalk / 2, 3)];
  const twoO = [P.walkEffortFor(ollie, sf, o, TH.shimmer / 2, 3, true), P.walkEffortFor(ollie, sf, o, TH.feel / 2, 3), P.walkEffortFor(ollie, sf, o, TH.plasterWalk / 2, 3)];
  console.log(sid, 'one walker (ripple, feel, plaster)', one.map((x) => (100 * x).toFixed(1)), ' both in step (Rex):', two.map((x) => (100 * x).toFixed(1)), ' (Ollie):', twoO.map((x) => (100 * x).toFixed(1)));
  console.log('  verdict PPV both at e=0, 3m:', (2 * Math.max(P.presence(rex, sf, o).ppv(3), P.presence(ollie, sf, o).ppv(3)) * 1e3).toFixed(3), 'mm/s');
}
