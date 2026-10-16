const R='/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r2/verify-physics/repo/rex-strength-lab';
const P = require(R+'/src/engine.js'); global.window = {}; require(R+'/src/data.js'); const D = window.DINO_DATA;
const o = D.objects.find(x=>x.passenger), g = P.K.g;
const surface = D.surfaces.find(s => s.id === 'concrete');
const mk = (b, lk, air, kf) => ({ F: Math.pow(10, lk)*g, mode: 'comic', body: P.makeBody({ build: b, ...P.DEFAULT_BODIES[b] }), surface, anchor: 'friction', airAbsorb: air, keepForm: kf, unbreakable: true, ownRecoil: true, safePassenger: true });
for (const kf of [true, false]) for (const air of [1, 0.999, 0.99, 0.9, 0.5]) {
  const cR = mk('rex', 16, air, kf), cO = mk('ollie', 16, air, kf);
  const Dd = Math.max(P.catchMinD(cR.body, cO.body, o), Math.pow(10, 4.5));
  const a = P.catchLeg(cR, cO, o, Dd, 'hard');
  const h = a.hitsGround || {};
  console.log('keepForm', kf, 'air', air, 'result', a.result, 'E', h.E && h.E.toExponential(4), 'airK', h.airK, 'airHeat', h.airHeat && h.airHeat.toExponential(3), 'kept', h.kept, 'own share', h.airHeat!=null ? ((h.E-h.airHeat)/h.E).toFixed(4) : '-', 'crater', h.crater && h.crater.toFixed(0), 'quake', h.quake && h.quake.toFixed(2));
}
