const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
global.window = {}; require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const surf = (id) => D.surfaces.find(s => s.id === id);
const ctx = (o) => Object.assign({ F: 1e6 * P.K.g, mode: 'comic', body: rex, surface: surf('concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true }, o);
module.exports = { P, D, rex, surf, ctx };
