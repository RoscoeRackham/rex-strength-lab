const lab = process.argv[2];
const P = require(lab + '/src/engine.js'); global.window = {}; require(lab + '/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g, person = D.objects.find((o) => o.id === 'person');
console.log('person', JSON.stringify({ m: person.m, area: person.area, L: person.L, rho: person.rho, passenger: person.passenger }));
for (const s of D.surfaces) { const lg = P.PASSENGER.landGround(person, 1, s); console.log(s.id.padEnd(12), (s.short || '').padEnd(28), 'vBear', lg.vBear.toPrecision(4), 'bear', lg.bear.toPrecision(4), 'groundOf', !!P.groundOf(s)); }
// edge speeds
const conc = D.surfaces.find((s) => s.id === 'concrete');
for (const v of [0, 1e-9, 50, 101, 103, 559, 560, 1e4, P.K.c * 0.5, P.K.c, Infinity]) { const lg = P.PASSENGER.landGround(person, v, conc); console.log('v', v, JSON.stringify(lg)); }
