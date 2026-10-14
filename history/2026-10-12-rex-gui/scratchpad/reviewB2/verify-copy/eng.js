global.window = {};
const R = __dirname + '/repo/rex-strength-lab/src/';
require(R + 'data.js');
const P = require(R + 'engine.js');
const D = window.DINO_DATA;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const surf = (id) => D.surfaces.find((s) => s.id === id);
const ctx = (kg, o) => Object.assign({ F: kg * P.K.g, mode: 'comic', body, surface: surf('concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }, o || {});
module.exports = { P, D, body, surf, ctx };
