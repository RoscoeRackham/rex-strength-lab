const R='/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r2/verify-physics/repo/rex-strength-lab';
const P = require(R+'/src/engine.js'); global.window = {}; require(R+'/src/data.js'); const D = window.DINO_DATA;
const o = D.objects.find(x=>x.passenger), g = P.K.g;
const body = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex });
const L = Math.cbrt(6*o.m/(Math.PI*(o.rho||1000)));
for (const [lk, sid] of [[7.5,'granite'],[9.15,'concrete'],[9.15,'granite']]) {
  const surface = D.surfaces.find(s => s.id === sid);
  const c = { F: Math.pow(10, lk)*g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true };
  const r = P.throwObject(c, o, 45), v = r.flight.vImpact, lg = P.PASSENGER.landGround(o, v, surface);
  console.log(lk, sid, 'v', v.toFixed(0), 'current gives', lg.gives, (lg.push/lg.bear).toFixed(1), 'no-floor ratio', (o.m*v*v/L/lg.bear).toFixed(2));
}
