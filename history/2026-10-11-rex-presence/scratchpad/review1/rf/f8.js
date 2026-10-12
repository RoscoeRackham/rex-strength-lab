const { P, D, g, surf, obj, ctx, rex } = require('./lib.js');
const b = rex();
const E = 4.2e23;
for (const s of [0.5, 1]) {
  const I = P.instantGrowth(b, E, s), G = I.grown;
  console.log('s', s, 'm', G.m.toExponential(3), 'H', G.H.toFixed(2), 'tau', I.tau.toExponential(3), 'vcm', I.vcm.toFixed(1), 'Fground-W', (I.Fground - G.m*g).toExponential(3), 'pressure', I.groundPressure.toExponential(3), 'soles', I.soles.toFixed(2), 'launch', I.launch.toFixed(0));
  for (const sid of ['concrete', 'granite']) {
    const sf = surf(sid);
    const q = sf.qult; // check qultFor
    const gb = P.grownMakeBody(b, E, s);
    const qq = P.qultFor ? P.qultFor(sf, gb.footB) : q;
    const Jmax = Math.max(0, qq * I.soles - G.m * g) * I.tau;
    const v = Jmax / G.m;
    const gu = P.groundUnderWeight(gb, sf, false);
    console.log('  ', sid, 'qult', qq.toExponential(3), 'q*soles', (qq*I.soles).toExponential(3), 'weight', (G.m*g).toExponential(3), 'max impulse', Jmax.toExponential(3), 'v', v.toFixed(2), 'rise', (v*v/2/g).toFixed(2), 'regime', gu.regime);
  }
}
