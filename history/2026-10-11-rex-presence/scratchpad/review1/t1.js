const { P, D, g, surf, obj, rex, ollie, cal, big, ctxOf } = require('./h.js');
console.log(D.surfaces.map(s=>s.id).join(','));
console.log(D.objects.map(o=>o.id+':'+o.m).join(', '));
const t0=Date.now();
const p = P.RESTRAINT.planNow('throw', ctxOf(1e7*g), { obj: obj('car'), angle: 45, target: 30 });
console.log('ms', Date.now()-t0, 'runs', p.runs());
console.log(p.goal(), p.ceiling(), p.presets());
