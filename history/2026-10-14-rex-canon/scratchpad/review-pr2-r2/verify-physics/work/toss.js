const R='/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r2/verify-physics/repo/rex-strength-lab';
const P = require(R+'/src/engine.js'); global.window = {}; require(R+'/src/data.js'); const D = window.DINO_DATA;
const rex = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex }), ollie = P.makeBody({ build: 'ollie', ...P.DEFAULT_BODIES.ollie });
const surface = D.surfaces.find(s => s.id === 'concrete');
const F = 90718.474 * P.K.g;
const ctx = { F, mode: 'comic', body: rex, surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, groundHolds: false };
for (const style of ['easy', 'hard']) {
  const r = P.tossPartner(ctx, ollie, 'Ollie', style, 10, 'friction');
  const a = r.recoilAbsorbedT; if (!a) { console.log(style, r.result); continue; }
  const W = ollie.m * P.K.g * a.T;
  console.log(style, r.result, 'J', a.J.toFixed(0), 'T', a.T.toFixed(4), 'Ollie m', ollie.m, 'W*T', W.toFixed(0), 'J+W*T', (a.J + W).toFixed(0), 'share', (W/(a.J+W)*100).toFixed(1)+'%');
}
