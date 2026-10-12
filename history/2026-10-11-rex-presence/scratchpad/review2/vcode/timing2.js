const repo = process.argv[2];
global.window = {};
const P = require(repo + '/rex-strength-lab/src/engine.js');
require(repo + '/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const c = { F: Infinity, mode:'real', body: rex, surface: surf('sand'), groundHolds: false, anchor: 'friction' };
let t=performance.now(); P.throwObject(c, obj('pickup'), 45); console.log('all-out single throw ms', (performance.now()-t).toFixed(0));
const times=[];
for (let i=0;i<70;i++){ const u = 30*g*Math.pow(10,i/2); const t1=performance.now(); P.throwObject(Object.assign({},c,{use:u}), obj('pickup'), 45); times.push([(u/g).toExponential(1), (performance.now()-t1).toFixed(0)]); }
console.log(times.filter(x=>x[1]>100).map(x=>x.join(':')).join(' '));
