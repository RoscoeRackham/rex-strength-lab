const R = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr4-r2/verify-copy/repo/rex-strength-lab';
const P = require(R + '/src/engine.js'); global.window = {}; require(R + '/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g;
const dial = 90718.474;
function ctx(build, o = {}) {
  const body = P.makeBody({ build, ...P.DEFAULT_BODIES[build] });
  return Object.assign({ F: dial * g, mode: 'comic', body, surface: D.surfaces.find(s => s.id === 'concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }, o);
}
const mk = (o) => ctx('rex', o), ol = (o) => ctx('ollie', o);
module.exports = { R, P, D, g, dial, mk, ol, ctx };
