global.window = {};
const P = require('./head/rex-strength-lab/src/engine.js');
require('./head/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const c = { F: Infinity, mode: 'real', body: rex, surface: surf('ice'), groundHolds: false, anchor: 'friction' };
const a = P.throwObject(c, obj('liberty'), 45);
console.log('allout heldBack', a.heldBack, 'R', a.anchor && a.anchor.R, 'F used', a.F, 'v', a.v);
const b = P.throwObject(Object.assign({}, c, { use: a.anchor.R }), obj('liberty'), 45);
console.log('use=R v', b.v, 'same', a.v === b.v);
const b2 = P.throwObject(Object.assign({}, c, { use: a.anchor.R * 1.01 }), obj('liberty'), 45);
console.log('use=1.01R v', b2.v);
for (const kg of [2e5, 3e5, 5e5, 1e6, 1e7, 1e9]) { const r = P.throwObject(Object.assign({}, c, { use: kg * g }), obj('liberty'), 45); console.log(kg, 'heldBack', r.heldBack, 'v', r.v, 'canMove', r.canMove); }
