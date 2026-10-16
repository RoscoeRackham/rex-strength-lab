const R = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr4-r1/verify-copy/repo/rex-strength-lab';
const P = require(R + '/src/engine.js'); global.window = {}; require(R + '/src/data.js'); const D = window.DINO_DATA;
const rex = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex }), ollie = P.makeBody({ build: 'ollie', ...P.DEFAULT_BODIES.ollie });
const surf = D.surfaces.find(s => s.id === 'concrete');
const ctx = (body, o = {}) => Object.assign({ F: 90718.474 * P.K.g, mode: 'comic', body, surface: surf, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true }, o);
module.exports = { P, D, rex, ollie, surf, ctx };
