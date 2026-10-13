global.window = global.window || {};
const L = process.env.LAB || require('path').join(__dirname, '../lab');
const P = require(L + '/src/engine.js'); require(L + '/src/data.js');
const D = window.DINO_DATA;
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }), ollie = P.makeBody({ build: 'ollie', H: 3.048, m: 3007 });
const surf = (id) => D.surfaces.find((s) => s.id === id);
const ON = { airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
const ctxOf = (F, o) => Object.assign({ F, mode: 'comic', body: rex, surface: surf('concrete'), anchor: 'friction', airAbsorb: 0, keepForm: false, unbreakable: false, ownRecoil: false }, o || {});
module.exports = { P, D, rex, ollie, surf, ON, ctxOf, g: P.K.g };
