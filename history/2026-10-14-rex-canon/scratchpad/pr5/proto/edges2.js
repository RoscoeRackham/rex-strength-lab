global.window = {};
const M = '/home/user/rex-strength-lab/rex-strength-lab';
const P = require(M + '/src/engine.js'); require(M + '/src/data.js');
const D = window.DINO_DATA, g = P.K.g, TB = P.RESTRAINT.takenBack;
const sf = (id) => D.surfaces.find((s) => s.id === id), ob = (id) => D.objects.find((o) => o.id === id);
const DEF = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true };
const R3 = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex }), O3 = P.makeBody({ build: 'ollie', ...P.DEFAULT_BODIES.ollie });
const c9 = (F, body, x) => Object.assign({ F, mode: 'comic', body: body || R3, surface: sf('concrete'), anchor: 'friction' }, DEF, x || {});
const dial = 100 * 907.18474 * g;
for (const [lab, B] of [['plain', c9(dial)], ['immovable', Object.assign(c9(dial), { immovable: true })]]) {
  const r = P.collide(c9(dial, O3), B, { source: 'set', gb: Infinity });
  console.log(lab, r.outcome, r.h && r.h.undefinedResult, r.Q, r.hitAbsorbed, JSON.stringify(TB('collide', r, { A: c9(dial, O3), B, whoA: 'ollie' })));
}
const r0 = P.collide(c9(dial, O3, { ownRecoil: false }), c9(dial, R3, { ownRecoil: false }), { source: 'sprint' });
console.log('own off', r0.outcome, r0.Q, JSON.stringify(TB('collide', r0, { A: c9(dial, O3, { ownRecoil: false }), B: c9(dial, R3, { ownRecoil: false }), whoA: 'ollie' }).E));
