const R = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r3/physics/repo/rex-strength-lab';
const P = require(R + '/src/engine.js'); global.window = {}; require(R + '/src/data.js'); const D = window.DINO_DATA;
const rex = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex });
const ollie = P.makeBody({ build: 'ollie', ...P.DEFAULT_BODIES.ollie });
const surf = (id) => D.surfaces.find((s) => s.id === id);
const DIAL = 90718.474;
const ctx = (o = {}) => Object.assign({ F: (o.kg || DIAL) * P.K.g, mode: 'comic', body: rex, surface: surf(o.surf || 'concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }, o);
const obj = (id) => (D.objects || D.throwables || []).find((x) => x.id === id);
module.exports = { P, D, rex, ollie, surf, DIAL, ctx, obj, R };
