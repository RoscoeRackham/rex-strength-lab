const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const surface = D.surfaces.find(s => s.id === 'concrete');
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: P.DEFAULT_BODIES.ollie.H, m: P.DEFAULT_BODIES.ollie.m });
const F = 113e3 * P.K.g; // 113 t
const base = { mode: 'comic', surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: false, ownRecoil: true };
const cA = Object.assign({}, base, { F, body: ollie }), cB = Object.assign({}, base, { F, body: rex });
for (const tg of [false, true]) {
  const r = P.collide(cA, cB, { source: 'jump', gb: Math.pow(10, Math.log10(100 / 299792458)), bounce: false, toGround: tg });
  const src = r.toGround ? P.impulseSource(surface, r.toGround.J, Math.max(1e-9, r.toGround.T)) : null;
  console.log('toGround option', tg, 'v0', r.v0, 'outcome', r.outcome, 'toGround', r.toGround, 'plaster reach', src ? P.plasterReach(src) : 0);
}
