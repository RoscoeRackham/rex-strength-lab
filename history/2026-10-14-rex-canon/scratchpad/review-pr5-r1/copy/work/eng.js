const P = require('../repo/rex-strength-lab/src/engine.js'); global.window = {}; require('../repo/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const L = require('../repo/rex-strength-lab/src/ladder.js');
const g = P.K.g;
const mk = (o) => Object.assign({ F: 100 * 907.18474 * g, mode: 'comic', body: P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), surface: D.surfaces.find((x) => x.id === 'concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true }, o || {});
const O = () => P.makeBody(Object.assign({ build: 'ollie' }, P.DEFAULT_BODIES.ollie));
const obj = (id) => D.objects.find((x) => x.id === id);
module.exports = { P, D, L, g, mk, O, obj };
