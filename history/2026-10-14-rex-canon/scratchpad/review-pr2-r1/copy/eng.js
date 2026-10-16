const R = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r1/copy/repo/rex-strength-lab/';
const P = require(R + 'src/engine.js'); global.window = {}; require(R + 'src/data.js'); const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex });
const surf = (id) => D.surfaces.find((s) => s.id === id);
const obj = (id) => D.objects.find((o) => o.id === id);
const ctx = (o) => Object.assign({ F: 90718.474 * P.K.g, mode: 'comic', body, surface: surf('concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }, o || {});
module.exports = { P, D, body, surf, obj, ctx };
