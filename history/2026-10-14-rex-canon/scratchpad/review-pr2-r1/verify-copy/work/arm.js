const R = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r1/verify-copy/repo/rex-strength-lab';
const P = require(R + '/src/engine.js'); global.window = {}; require(R + '/src/data.js'); const D = window.DINO_DATA;
const rex = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex }), ollie = P.makeBody({ build: 'ollie', ...P.DEFAULT_BODIES.ollie });
const surface = D.surfaces.find(s => s.id === 'concrete');
const mk = (body, kg) => ({ F: kg * P.K.g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, use: kg * P.K.g });
const r = P.armWrestle(mk(rex, 90718.474), mk(ollie, Math.pow(10, 4.5)));
console.log('recoilAbsorbed', JSON.stringify(r.recoilAbsorbed), 'toGround', JSON.stringify(r.toGround), 'pin t', r.pin && r.pin.t);
// punch default
const c = mk(rex, 90718.474); c.use = 3340 * P.K.g;
const p = P.punch(c);
console.log('punch recoilAbsorbed', JSON.stringify(p.recoilAbsorbed), 'v', p.v);
