const R = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr5-r2/verify-code/fix1/rex-strength-lab';
const P = require(R + '/src/engine.js');
global.window = global.window || {};
require(R + '/src/data.js');
const D = window.DINO_DATA;
let L; try { L = require(R + '/src/ladder.js'); } catch (e) { L = window.EnergyLadder; }
if (!L || !L.glow) L = window.EnergyLadder;
const surface = D.surfaces.find(s => s.id === 'concrete');
const body = (b, extra) => P.makeBody(Object.assign({ build: b }, P.DEFAULT_BODIES[b], extra || {}));
const ctx = (kg, b, extra) => Object.assign({ F: kg * P.K.g, mode: 'comic', body: b || body('rex'), surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, silentStrike: true, softLanding: true }, extra || {});
module.exports = { R, P, D, L, surface, body, ctx };
