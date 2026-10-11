const { P, D, g, S, O, T, ctx } = require('./common');
const c = ctx(1e6, { surface: 'concrete' });
const l = P.lift(c, O.tank);
const a = P.anchorCapacity({ body: c.body, surface: S.concrete, theta: Math.PI / 2, extraMass: O.tank.m });
console.log('lift tab, tank on concrete: groundRatio', l.groundRatio.toFixed(3), '(holds)');
console.log('throw-tab anchor at 90deg holding tank: R =', a.R.toFixed(0), 'N; tank weight to hold statically =', (O.tank.m * g).toFixed(0), 'N -> engine says footing fails by', (O.tank.m * g / a.R).toFixed(2) + 'x');
console.log('engine implied ground load at static hold:', ((c.body.m + O.tank.m) * g + O.tank.m * g).toFixed(0), 'N vs true', ((c.body.m + O.tank.m) * g).toFixed(0), 'N; Nmax', S.concrete.qult * 2 * c.body.footArea);
// sand braced: engine dig vs passive earth pressure estimate
const b = P.makeBody({});
const W = b.m * g, mu = 0.5, gam = 1600 * g, Kp = Math.tan(Math.PI / 4 + 15 * Math.PI / 180) ** 2;
for (const Dd of [0.1, 0.2, 0.3]) {
  const width = 2 * Math.sqrt(b.footArea);
  const Pp = 0.5 * gam * Dd * Dd * Kp * width;
  const tauAvg = gam * (Dd / 2) * Math.tan(30 * Math.PI / 180);
  console.log('sand claw depth', Dd, 'm: passive Pp', Pp.toFixed(0), 'N; mean shear strength over depth', tauAvg.toFixed(0), 'Pa (engine uses 20000 Pa); engine dig', (20e3 * b.digArea).toFixed(0), 'N; anchor engine', (mu * W + 20e3 * b.digArea).toFixed(0), 'vs', (mu * W + Pp).toFixed(0));
}
