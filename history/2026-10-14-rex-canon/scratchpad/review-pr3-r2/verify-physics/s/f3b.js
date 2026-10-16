const R='/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r2/verify-physics/repo/rex-strength-lab';
const P = require(R+'/src/engine.js'); global.window = {}; require(R+'/src/data.js'); const D = window.DINO_DATA;
const o = D.objects.find(x=>x.passenger), g = P.K.g, c = P.K.c;
const surface = D.surfaces.find(s => s.id === 'concrete');
const mk = (b, air) => ({ F: 1e16*g, mode: 'comic', body: P.makeBody({ build: b, ...P.DEFAULT_BODIES[b] }), surface, anchor: 'friction', airAbsorb: air, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true });
for (const air of [0.999, 0.99, 0.9]) {
  const cR = mk('rex', air), cO = mk('ollie', air);
  const a = P.catchLeg(cR, cO, o, Math.pow(10, 4.5), 'hard');
  const h = a.hitsGround, E = h.E, m = o.m;
  const gam = 1 + E/(m*c*c), unit = m/(P.K.rho0*o.area), x = h.path/unit*(1-air);
  const v = c*Math.sqrt(1-1/(gam*gam)), vL = v/(1 + x/gam), gL = 1/Math.sqrt(1-(vL/c)**2);
  const Eperson = (gL-1)*m*c*c;
  console.log('air', air, 'path', h.path.toFixed(0), 'x', x.toFixed(4), 'E', E.toExponential(4), 'airHeat', h.airHeat.toExponential(3), '(E-airHeat)/E', ((E-h.airHeat)/E).toFixed(4), 'person KE at hit', Eperson.toExponential(4), 'share', (Eperson/E).toFixed(4));
}
