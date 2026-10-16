const R = __dirname + '/repo/rex-strength-lab/src/';
const P = require(R + 'engine.js'); global.window = {}; require(R + 'data.js'); const D = window.DINO_DATA;
const surf = (id) => D.surfaces.find(s => s.id === id);
const rex = P.makeBody({ build: 'rex', ...P.DEFAULT_BODIES.rex }), ol = P.makeBody({ build: 'ollie', ...P.DEFAULT_BODIES.ollie });
const ctx = (kg, body, o) => Object.assign({ F: kg * P.K.g, mode: 'comic', body, surface: surf('concrete'), anchor: 'friction', airAbsorb: 1, keepForm: false, unbreakable: false, ownRecoil: true }, o || {});
const pick = (o, ks) => Object.fromEntries(ks.filter(k => k in o).map(k => [k, o[k]]));
const ks = ['outcome','winner','PA','PB','RA','RB','tableBreaks','tableBreaksBy','tableLat','padLoad','loserPadLoad','tearA','tearB','loserElbow','loserSlides','winnerSlides','draggedA','draggedB','contact'];
let a = P.armWrestle(ctx(1e7, rex), ctx(1000, ol, { anchor: 'bolted' }));
console.log('pin:', pick(a, ks));
const tearLoad = surf('concrete').shear * ol.digArea; console.log('groundTear(B)=', tearLoad);
let b = P.armWrestle(ctx(10**6.5, rex), ctx(10**6.5, ol, { anchor: 'bolted' }));
console.log('stalemate:', pick(b, ks));
const m = P.pushMatch(ctx(10**6.5, rex), ctx(10**6.5, ol, { anchor: 'bolted' }));
console.log('pushMatch:', pick(m, ['outcome','tornB','tearB','holdAfterB','vA','vB','slideA','slideB','xA','xB']));
// winner bolted, torn by loser's press
let c = P.armWrestle(ctx(10**7, rex, { anchor: 'bolted' }), ctx(10**6.4, ol));
console.log('bolted winner:', pick(c, ks));
