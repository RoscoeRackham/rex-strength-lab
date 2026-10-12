const { P, D, g, surf, obj, rex, ollie, cal, big, ctxOf } = require('./h.js');
const K = P.K;
console.log('energyRefs', JSON.stringify(D.energyRefs));
for (const [nm, E] of [['krakatoa', 8.4e17], ['chicxulub', 4.2e23], ['sun', 3.828e26]]) for (const f of ['mix', 'size', 'density']) {
  const G = P.gradualGrowth(rex, E, f), I = P.instantGrowth(rex, E, f), R = P.runawayGrowth(rex, E, f);
  const gb = G.grown;
  console.log(nm, f, 'H', gb.H.toFixed(2), 'rho', gb.rho.toExponential(2), 'dV', gb.dV.toExponential(2), 'dH', gb.dH.toFixed(3), '| gradual T', G.T.toFixed(2), 'by', G.by, 'Tp', G.Tp.toFixed(3), 'Tu', G.Tu.toFixed(2), 'Tl', G.Tl.toFixed(3), 'kV', G.shape.kV.toFixed(2), 'kH', G.shape.kH.toFixed(2), 'compact', G.compact,
    '| instant tau ms', (I.tau*1000).toFixed(2), 'u', I.u.toFixed(0), 'uHead', I.uHead.toFixed(0), 'dpLo', I.dpLo.toExponential(2), 'dpHi', I.dpHi.toExponential(2), 'Elo', I.Elo.toExponential(2), 'Ehi', I.Ehi.toExponential(2), 'launch m', I.launch.toFixed(1), 'Pground', I.groundPressure.toExponential(2),
    '| runaway k', R.k.toExponential(2), 'kAir', R.kAir.toExponential(2), 'kGrav', R.kGrav.toExponential(2), 'kGravNow', R.kGravNow.toExponential(2));
}
