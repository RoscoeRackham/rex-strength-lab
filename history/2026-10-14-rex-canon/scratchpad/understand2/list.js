global.window = {};
const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA;
console.log(D.objects.map(o => o.id + ':' + o.m + (o.passenger ? '(p)' : '')).join(', '));
console.log(D.surfaces.map(s => s.id + ' mu=' + s.mu + ' q=' + s.qult + (s.granular ? ' gran' : '')).join('\n'));
