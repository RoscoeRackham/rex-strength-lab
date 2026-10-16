global.window = {};
const M = '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(M + '/src/engine.js'); require(M + '/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const sf = (id) => D.surfaces.find((s) => s.id === id);
const R3 = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex }), O3 = P.makeBody({ build: 'ollie', ...P.DEFAULT_BODIES.ollie });
const OFF9 = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false, safePassenger: false, silentStrike: false, softLanding: false, noKnockback: false };
const c9 = (F, body, x) => Object.assign({ F, mode: 'comic', body: body || R3, surface: sf('concrete'), anchor: 'friction' }, x || {});
for (const pw of [OFF9, Object.assign({}, OFF9, { airAbsorb: 1 }), Object.assign({}, OFF9, { unbreakable: true })]) for (const e of [5, 9, 16]) {
  const w = P.throwPartner(c9(Math.pow(10, e) * g, R3, pw), c9(Math.pow(10, e) * g, O3, pw), 45);
  console.log(JSON.stringify(pw).slice(0, 40), e, w.r && w.r.canMove, w.fallsBack, w.r && w.r.flight && w.r.flight.landed, w.r && w.r.flight && w.r.flight.relativistic, w.r && w.r.crater, w.r && w.r.flight && w.r.flight.vImpact);
}
