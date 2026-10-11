global.window = global.window || {};
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
for (const o of D.objects) console.log([o.id, o.short, o.m, o.area, o.Cd, o.CdSup, o.rho, o.L, o.crush, o.noThrow ? 'noThrow' : '', o.material || '-', (o.m/(1.225*o.area)).toFixed(1), (o.m/o.area).toFixed(0)].join(' | '));
console.log(D.surfaces.map(s => [s.id, s.mu, s.qult, s.shear, s.rho].join(',')).join('\n'));
