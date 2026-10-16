const B='/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r2/verify-physics/';
global.window = {}; const P = require(B + 'repo/rex-strength-lab/src/engine.js'); require(B + 'repo/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex });
const surface = D.surfaces.find(s => s.id === 'concrete'), obj = D.objects.find(o => o.id === 'semi');
const ctx = { F: 90718.474 * P.K.g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, groundHolds: false };
const M = P.RESTRAINT.MOVES.throw, o = { obj, angle: 10, near: 5, surface, body, ownRecoil: true, unbreakable: true, keepForm: true, airAbsorb: 1 };
const r = M.run(Object.assign({}, ctx, { use: ctx.F }), o);
console.log('rattle TH', P.VIB.TH.rattle, 'ppv at 5 m (mm/s)', (P.ppvAt(M.shake(r, o), 5) * (P.VIB.TH.rattle < 0.01 ? 1000 : 1)).toFixed(3), 'raw', P.ppvAt(M.shake(r, o), 5));
