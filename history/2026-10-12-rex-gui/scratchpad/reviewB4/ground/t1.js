const { P, D, rex, surf, obj, ctx, ON } = require('./h.js');
console.log(Object.keys(P).join(' '));
console.log(D.surfaces.map(s => s.id + ' q=' + s.qult + ' mu=' + s.mu).join('\n'));
console.log(D.objects.map(o => o.id + ' ' + o.m).join(', '));
console.log('limbPulse rex', P.limbPulse(rex), 'H', rex.H, 'footArea', rex.footArea, 'footB', rex.footB);
