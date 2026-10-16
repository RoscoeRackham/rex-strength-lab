const root = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr4-r3/verify-copy/repo/rex-strength-lab';
const P = require(root + '/src/engine.js'); global.window = {}; require(root + '/src/data.js'); const D = window.DINO_DATA;
const surf = D.surfaces.find(s => s.id === 'concrete');
const mk = (b, kg, anchor, extra) => Object.assign({ F: kg * P.K.g, mode: 'comic', body: P.makeBody({ build: b, ...P.DEFAULT_BODIES[b] }), surface: surf, anchor, airAbsorb: 1, keepForm: false, unbreakable: false, ownRecoil: true }, extra || {});
const holdArm = 0.022 * 0.682 * 0.1525 / 0.19, effMass = 0.022 * Math.pow(0.827 * 0.1525 / 0.19, 2);
console.log('holdArm', holdArm, 'effMass', effMass, 'net', holdArm - effMass);
for (const [ra, ol] of [[100 * 907.18474, 1000], [1e7, 1000]]) {
  const r = P.armWrestle(mk('rex', ra, 'friction', {unbreakable:true}), mk('ollie', ol, 'friction', {unbreakable:true}));
  const r2 = P.armWrestle(mk('rex', ra, 'friction'), mk('ollie', ol, 'friction'));
  const Pw = r.AA, Pl = r.AB, ml = 3000, M = 0.0097 * 6000;
  const aPrint = (Pw - Pl) / M;
  const printed = Math.abs(0.012 * ml * aPrint - (Pl + 0.0097 * ml * aPrint));
  const aEx = (Pw - Pl) / (effMass * 6000);
  const exact = Math.abs(holdArm * ml * aEx - (Pl + effMass * ml * aEx));
  const net4 = Math.abs(0.00235 * ml * aEx - Pl);
  console.log({ rexKg: ra, loserPadLoad: r.loserPadLoad, loserElbow: r.loserElbow, standingLoserElbow: r2.loserElbow, exact, printed, aPrint, aEx, net_00235_with_exact_a: net4, net_00235_with_printed_a: Math.abs(0.00235*ml*aPrint - Pl) });
}
