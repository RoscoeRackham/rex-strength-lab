const R = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r3/physics/fix';
const P = require(R + '/src/engine.js'); global.window = global.window || {}; require(R + '/src/data.js'); const D = window.DINO_DATA;
const rex = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex });
const surf = (id) => D.surfaces.find((s) => s.id === id);
module.exports = { P, D, rex, surf };
