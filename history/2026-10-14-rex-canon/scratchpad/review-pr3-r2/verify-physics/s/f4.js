const R='/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r2/verify-physics/repo/rex-strength-lab';
const P = require(R+'/src/engine.js'); global.window = {}; require(R+'/src/data.js'); const D = window.DINO_DATA;
const o = D.objects.find(x=>x.passenger), g = P.K.g, c = P.K.c, ME = P.K.M_E;
const surface = D.surfaces.find(s => s.id === 'concrete');
const mk = (b, F) => ({ F, mode: 'comic', body: P.makeBody({ build: b, ...P.DEFAULT_BODIES[b] }), surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true });
console.log('M_E', ME, 'EARTH_BIND', P.K.EARTH_BIND);
for (const lk of [16, 20, 24, 28, 30, 32, 34, Infinity]) {
  const F = isFinite(lk) ? Math.pow(10, lk)*g : Infinity;
  const cR = mk('rex', F), cO = mk('ollie', F);
  const Dd = Math.max(P.catchMinD(cR.body, cO.body, o), Math.pow(10, 4.5));
  const a = P.catchLeg(cR, cO, o, Dd, 'hard');
  const E = a.hitsGround && a.hitsGround.E;
  const p = isFinite(E) ? Math.sqrt(E*E + 2*E*o.m*c*c)/c : Infinity;
  console.log('logKg', lk, a.result, 'E', E, 'p', p.toExponential(3), 'vEarth', (p/ME).toExponential(3), 'KE_E', (p*p/(2*ME)).toExponential(3), 'x Chicxulub(5e23)', (p*p/(2*ME)/5e23).toExponential(2));
}
