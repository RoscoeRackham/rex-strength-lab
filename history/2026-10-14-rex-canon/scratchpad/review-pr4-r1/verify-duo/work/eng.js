const REPO = process.env.REPO || '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr4-r1/verify-duo/repo';
const P = require(REPO + '/rex-strength-lab/src/engine.js'); global.window = {}; require(REPO + '/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g;
const mk = (o) => Object.assign({ F: 100 * 907.18474 * g, mode: 'comic', body: P.makeBody(Object.assign({ build: (o && o.build) || 'rex' }, P.DEFAULT_BODIES[(o && o.build) || 'rex'])), surface: D.surfaces.find((s) => s.id === 'concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true }, o || {});
module.exports = { P, D, g, mk };
