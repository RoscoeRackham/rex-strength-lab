const root = process.argv[2];
const P = require(root + '/src/engine.js'); global.window = {}; require(root + '/src/data.js'); const D = window.DINO_DATA;
const surf = D.surfaces.find(s => s.id === 'concrete');
const mk = (b, kg, anchor, extra) => Object.assign({ F: kg * P.K.g, mode: 'comic', body: P.makeBody({ build: b, ...P.DEFAULT_BODIES[b] }), surface: surf, anchor, airAbsorb: 1, keepForm: false, unbreakable: false, ownRecoil: true }, extra || {});
const pick = (r) => { const o = {}; for (const k of ['outcome','clash','contact','RA','RB','AA','AB','tableBreaks','tableBreaksBy','draggedA','draggedB','loserSlides','winnerSlides','loserElbow','tearA','tearB','winner']) if (r[k] !== undefined) o[k] = r[k]; return o; };
console.log('stalemate 1e6 vs 1e6, Ollie bolted real rock:', pick(P.armWrestle(mk('rex', 1e6, 'friction'), mk('ollie', 1e6, 'bolted'))));
console.log('pin 1e7 vs 1e3 bolted real rock:', pick(P.armWrestle(mk('rex', 1e7, 'friction'), mk('ollie', 1e3, 'bolted'))));
console.log('groundTear concrete Ollie (N):', surf.shear * P.makeBody({ build: 'ollie', ...P.DEFAULT_BODIES.ollie }).digArea);
// power off, for comparison
console.log('power off stalemate 1e6 vs 1e6, Ollie bolted:', pick(P.armWrestle(mk('rex', 1e6, 'friction', {ownRecoil:false}), mk('ollie', 1e6, 'bolted', {ownRecoil:false}))));
// push match same footing
const pm = P.pushMatch ? P.pushMatch(mk('rex', 1e6, 'friction'), mk('ollie', 1e6, 'bolted')) : null;
if (pm) { const o = {}; for (const k of ['outcome','clash','tornB','tearB','holdAfterB','bothShoved','shovedOff']) if (pm[k] !== undefined) o[k] = pm[k]; console.log('pushMatch:', o); }
