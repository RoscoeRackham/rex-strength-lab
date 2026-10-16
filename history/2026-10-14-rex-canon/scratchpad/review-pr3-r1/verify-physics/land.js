const R = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r1/verify-physics/repo/rex-strength-lab';
const P = require(R + '/src/engine.js'); global.window = {}; require(R + '/src/data.js'); const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex });
const o = D.objects.find((x) => x.id === 'person');
const surface = D.surfaces.find((s) => s.id === 'concrete');
console.log('person m', o.m, 'L', o.L, 'area?', o.A, o.area, 'passenger', o.passenger);
for (const logKg of [Math.log10(90718.474), 5.1614, 6, 8, 9.15]) {
  const kg = Math.pow(10, logKg);
  const c = { F: kg * P.K.g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, use: kg * P.K.g };
  const r = P.throwObject(c, o, 45);
  const oo = Object.assign({}, c, { obj: o, angle: 45, near: 5 });
  const pl = P.RESTRAINT.MOVES.throw.passengerLanding(r, oo);
  const L = o.L || Math.cbrt(6 * o.m / (Math.PI * (o.rho || 1000)));
  const v = r.flight.vImpact, T = Math.max(1e-3, L / v), J = pl ? pl.J : NaN;
  const Fmean = J / T, bear = surface.qult * 0.67;
  const reach = P.RESTRAINT.reach('throw', r, oo);
  const src = P.RESTRAINT.MOVES.throw.landShake(r, oo);
  const blast = P.RESTRAINT.MOVES.throw.blastParts(r, oo);
  // capped
  const Jcap = Math.min(J, bear * T);
  const srcCap = P.impulseSource ? P.impulseSource(surface, Jcap, T) : null;
  console.log(JSON.stringify({ logKg: +logKg.toFixed(3), v: +v.toFixed(1), J: Math.round(J), T: +T.toFixed(4), Fmean: Fmean.toExponential(3), bearOverPersonArea: bear.toExponential(3), ratio: +(Fmean / bear).toFixed(1), Eimpact: r.Eimpact.toExponential(3), absorbed: pl && pl.absorbed.toExponential(3), plaster: +reach.plaster.toFixed(1), rattle: +reach.rattle.toFixed(0), feel: +reach.feel.toFixed(0), land_blast: blast.land, quake: r.quake, crater: r.crater }));
}
console.log('impulseSource exported?', typeof P.impulseSource, 'ppvNonlinear?', typeof P.ppvNonlinear);
