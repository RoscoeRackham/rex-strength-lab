global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const body = (b) => P.makeBody(Object.assign({ build: b }, P.DEFAULT_BODIES[b]));
const ctx = (o) => Object.assign({ F: 100 * 907.18474 * g, mode: 'comic', body: body('rex'), surface: D.surfaces.find((x) => x.id === 'concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true }, o || {});
const cO = (o) => ctx(Object.assign({ body: body('ollie') }, o || {}));
module.exports = { P, D, g, body, ctx, cO };
