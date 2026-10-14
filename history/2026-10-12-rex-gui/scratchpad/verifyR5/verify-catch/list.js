global.window = {}; const P = require('/home/user/rex-strength-lab/rex-strength-lab/src/engine.js'); require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
for (const o of D.objects) console.log(o.id, o.m, o.area, o.noThrow ? 'noThrow' : '', o.indestructible ? 'indes' : '');
