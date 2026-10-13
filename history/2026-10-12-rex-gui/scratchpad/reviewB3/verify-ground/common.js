const L = '/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB3/verify-ground/lab';
const P = require(L + '/src/engine.js');
global.window = {}; require(L + '/src/data.js');
const D = window.DINO_DATA;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const rex = () => P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const ctx = (kg, o) => Object.assign({ F: kg * P.K.g, mode: 'comic', body: rex(), surface: surf('concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }, o || {});
module.exports = { P, D, surf, rex, ctx, L };
