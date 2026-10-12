global.window = {};
const P = require('./head/rex-strength-lab/src/engine.js');
require('./head/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const c = { F: Infinity, mode: 'real', body: rex, surface: surf('ice'), groundHolds: false, anchor: 'friction' };
let t = Date.now();
const r1 = P.throwObject(Object.assign({}, c, {use: 1e20*g}), obj('liberty'), 45);
console.log('one throw', Date.now()-t, 'ms v', r1.v);
for (const u of [1e6,1e10,1e20,1e30,1e34]) { const r = P.throwObject(Object.assign({}, c, {use: u*g}), obj('liberty'), 45); console.log(u, r.v, r.canMove); }
const p = P.RESTRAINT.plan('throw', c, { obj: obj('liberty'), angle: 45, target: 30, near: 5 });
t = Date.now(); const gl = p.goal(); console.log('goal', Date.now()-t, 'ms', JSON.stringify(gl), 'runs', p.runs());
t = Date.now(); const ce = p.ceiling(); console.log('ceiling', Date.now()-t, 'ms', JSON.stringify(ce), 'runs', p.runs());
