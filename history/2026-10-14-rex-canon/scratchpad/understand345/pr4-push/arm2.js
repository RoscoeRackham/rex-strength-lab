global.window = {};
const M = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/main-tree/rex-strength-lab';
const P0 = require(M + '/src/engine.js'); require(M + '/src/data.js'); const P1 = require('./engine-pr4.js');
const D = window.DINO_DATA, g = P0.K.g, surf = (id) => D.surfaces.find((x) => x.id === id);
const sig = (x) => (typeof x === 'number' ? x.toPrecision(4) : String(x));
const DIAL = 100 * 907.18474 * g;
const mk = (P, F, x, b) => Object.assign({ F, mode: 'comic', body: P.makeBody({ build: b, ...P.DEFAULT_BODIES[b] }), surface: surf('concrete'), anchor: 'friction' }, x);
const brief = (r) => [r.outcome, r.winner, 'AA ' + sig(r.AA), 'AB ' + sig(r.AB), r.tableBreaks ? 'table breaks (' + r.tableBreaksBy + ')' : 'table holds', 'padLoad ' + sig(r.padLoad), 'slamRatio ' + sig(r.slamRatio), r.pin ? 'pin v ' + sig(r.pin.v) + ' m/s, t ' + sig(r.pin.t) + ' s, E ' + sig(r.pin.E) + ' J' : '', r.drag ? 'drag v ' + sig(r.drag.v) : '', r.clash ? 'clash ' + r.clash + ' via ' + r.via : '', 'humerus ' + sig(Math.max(r.humerusRatioA, r.humerusRatioB))].filter(Boolean).join(', ');
const X = { airAbsorb: 1, keepForm: false, unbreakable: true, ownRecoil: true };
for (const [lab, x] of [['ON but Things keep their form off', X], ['ON', Object.assign({}, X, { keepForm: true })]]) for (const [FR, FO, fl] of [[DIAL, DIAL, 'both at the dial'], [DIAL, 1000 * g, 'Rex dial vs Ollie 1,000 kgf'], [1e5 * g, 2e5 * g, '100 t vs 200 t'], [2e3 * g, 1e3 * g, '2 t vs 1 t'], [Infinity, Infinity, 'both unlimited'], [Infinity, DIAL, 'Rex unlimited vs dial']]) {
  const r0 = P0.armWrestle(mk(P0, FR, x, 'rex'), mk(P0, FO, x, 'ollie')), r1 = P1.armWrestle(mk(P1, FR, x, 'rex'), mk(P1, FO, x, 'ollie'));
  if (JSON.stringify(r0) !== JSON.stringify(r1)) console.log(lab + ', ' + fl, '\n   main: ' + brief(r0), '\n   new:  ' + brief(r1));
  else console.log(lab + ', ' + fl, ': same');
}
// standing reachable with ownRecoil on? scan
let standing = 0, n = 0;
for (const lg of [2.5, 3, 3.5, 4, 5, 6, 9, 12, 20]) for (const lo of [2, 2.5, 3, 4, 6, 9]) for (const sid of ['sand', 'concrete', 'ice', 'granite', 'softclay']) for (const anc of ['friction', 'bolted']) for (const kf of [false, true]) for (const ub of [false, true]) {
  const x = { ownRecoil: true, keepForm: kf, unbreakable: ub, surface: surf(sid), anchor: anc };
  const r = P1.armWrestle(mk(P1, Math.pow(10, lg) * g, x, 'rex'), mk(P1, Math.pow(10, lo) * g, x, 'ollie')); n++; if (r.tableBreaks) standing++;
}
console.log('table breaks with ownRecoil on (new):', standing, 'of', n);
let diff = 0; for (const lg of [3, 4, 9, 20]) for (const kf of [false, true]) for (const anc of ['friction', 'bolted']) { const x = { keepForm: kf, anchor: anc }; if (JSON.stringify(P0.armWrestle(mk(P0, Math.pow(10, lg) * g, x, 'rex'), mk(P0, 1e3 * g, x, 'ollie'))) !== JSON.stringify(P1.armWrestle(mk(P1, Math.pow(10, lg) * g, x, 'rex'), mk(P1, 1e3 * g, x, 'ollie')))) diff++; }
console.log('powers-off differences', diff);
