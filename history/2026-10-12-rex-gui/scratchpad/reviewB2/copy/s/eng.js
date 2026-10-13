const LAB = '/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB2/copy/lab';
const P = require(LAB + '/src/engine.js');
global.window = {}; require(LAB + '/src/data.js'); const D = window.DINO_DATA;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const surf = (id) => D.surfaces.find((s) => s.id === id);
const obj = (id) => D.objects.find((o) => o.id === id);
const ctx = (kg, o = {}) => Object.assign({ F: kg * P.K.g, mode: 'comic', body: rex, surface: surf('concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }, o);
const OFF = { airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false };
module.exports = { P, D, rex, surf, obj, ctx, OFF };
