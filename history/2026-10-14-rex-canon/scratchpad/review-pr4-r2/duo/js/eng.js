const R = process.env.REPO || '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr4-r2/duo/repo';
const P = require(R + '/rex-strength-lab/src/engine.js'); global.window = {}; require(R + '/rex-strength-lab/src/data.js'); const D = window.DINO_DATA, g = P.K.g;
const body = (b) => P.makeBody(Object.assign({ build: b }, P.DEFAULT_BODIES[b]));
const mk = (b, o) => Object.assign({ F: 90718.474 * g, mode: 'comic', body: body(b), surface: D.surfaces.find((s) => s.id === 'concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true }, o || {});
module.exports = { P, D, g, mk, body };
