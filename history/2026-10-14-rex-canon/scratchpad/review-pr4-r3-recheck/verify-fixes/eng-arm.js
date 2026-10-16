const R = process.argv[2];
const P = require(R + '/rex-strength-lab/src/engine.js'); global.window = {}; require(R + '/rex-strength-lab/src/data.js'); const D = window.DINO_DATA;
const g = P.K.g;
const mk = (o) => Object.assign({ F: 1e7 * g, mode: 'comic', body: P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), surface: D.surfaces.find((x) => x.id === 'concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true, noKnockback: true }, o || {});
const r = P.armWrestle(mk({ keepForm: false, unbreakable: false, anchor: 'bolted' }), mk({ F: Math.pow(10, 6.4) * g, keepForm: false, unbreakable: false, body: P.makeBody(Object.assign({ build: 'ollie' }, P.DEFAULT_BODIES.ollie)) }));
console.log(JSON.stringify({ outcome: r.outcome, winner: r.winner, tableBreaks: r.tableBreaks, tearA: r.tearA, tornA: r.tornA, holdAfterA: r.holdAfterA, RA: r.RA, winnerSlides: r.winnerSlides, loserSlides: r.loserSlides, PA: r.PA, PB: r.PB }));
