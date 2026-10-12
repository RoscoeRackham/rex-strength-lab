global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id);
const obj = (id) => D.objects.find((o) => o.id === id);
const ctxOf = (kg, o) => Object.assign({ F: kg === Infinity ? Infinity : kg * g, mode: 'comic', body: P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), surface: surf('concrete'), groundHolds: false, anchor: 'friction' }, o || {});
module.exports = { P, D, g, surf, obj, ctxOf };
