const repo = process.argv[2];
global.window = {};
const P = require(repo + '/rex-strength-lab/src/engine.js');
require(repo + '/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, g = P.K.g;
const surf = (id) => D.surfaces.find((s) => s.id === id), obj = (id) => D.objects.find((o) => o.id === id);
const rex = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
for (const F of [90718*g, 1e7*g, Infinity]) for (const [mv,o] of [['jump',{target:3}],['throw',{ obj: obj('car'), angle: 45, target: 30 }]]) {
 const c = { F, mode:'comic', body: rex, surface: surf('sand'), groundHolds: false, anchor: 'friction' };
 const p = P.RESTRAINT.planNow(mv, c, o); const gl=p.goal(), ce=p.ceiling(); const M=P.RESTRAINT.MOVES[mv];
 const r=p.run(gl.use); const bad=P.RESTRAINT.HAZARDS.filter(h=>h.test(M,r,p.opt)).map(h=>h.id);
 console.log(mv, (F/g).toPrecision(3), 'goal', (gl.use/g).toPrecision(3), 'ceiling by', ce.by, ce.by? (ce.below/g).toPrecision(3):'', 'hazards at goal:', bad.join(','), mv==='jump' ? 'Eground '+(r.Eground||0).toPrecision(3)+' landing Eground '+(r.landing&&r.landing.Eground||0).toPrecision(3)+' groundFails '+r.groundFails : '');
}
