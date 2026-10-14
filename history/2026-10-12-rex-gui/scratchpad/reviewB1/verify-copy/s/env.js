const R = '/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB1/verify-copy/repo/rex-strength-lab';
const P = require(R + '/src/engine.js');
global.window = {}; require(R + '/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g;
const rex = () => P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const surf = (id) => D.surfaces.find(s => s.id === id);
const ctx = (kg, o = {}) => Object.assign({ F: kg * g, mode: 'comic', body: rex(), surface: surf('concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }, o);
const off = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
module.exports = { P, D, g, rex, surf, ctx, off, R };
