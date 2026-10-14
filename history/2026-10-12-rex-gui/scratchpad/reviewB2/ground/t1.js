const { P, D, rex, surf, obj, ctx, ON, K } = require('./h.js');
console.log(Object.keys(P).join(' '));
console.log(D.surfaces.map(s=>s.id).join(' '));
console.log(D.objects.map(o=>o.id+':'+o.m).join(' '));
