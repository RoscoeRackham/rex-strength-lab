global.window = {};
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const surf = (id) => D.surfaces.find(s => s.id === id);
const obj = (id) => D.objects.find(o => o.id === id);
const ctx = (o) => Object.assign({ F: 1e6 * P.K.g, mode: 'comic', body, surface: surf('concrete'), anchor: 'friction' }, o || {});
module.exports = { D, P, body, surf, obj, ctx };
