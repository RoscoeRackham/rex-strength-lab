const R = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr4-r1/physics/repo/rex-strength-lab';
const P = require(R + '/src/engine.js'); global.window = {}; require(R + '/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g;
const rex = () => P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex });
const ollie = () => P.makeBody({ build: 'ollie', ...P.DEFAULT_BODIES.ollie });
const surf = (id) => D.surfaces.find(s => s.id === id);
const DIAL = 100 * 907.18474;
function ctx(over) { return Object.assign({ F: DIAL * g, mode: 'comic', body: rex(), surface: surf('concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true }, over || {}); }
function octx(over) { return Object.assign(ctx(), { body: ollie() }, over || {}); }
module.exports = { P, D, g, rex, ollie, surf, DIAL, ctx, octx, K: P.K };
