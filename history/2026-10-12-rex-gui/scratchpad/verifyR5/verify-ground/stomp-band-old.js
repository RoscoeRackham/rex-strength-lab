global.window = {};
const P = require('./engine-old.js');
require('/home/user/rex-strength-lab/rex-strength-lab/src/data.js');
const D = window.DINO_DATA, K = P.K;
const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 });
const surface = D.surfaces.find(s => s.id === 'concrete');
const run = (lg) => {
  const ctx = { F: Math.pow(10, lg) * K.g, mode: 'comic', body, surface, anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
  const r = P.stomp(ctx);
  const b = P.RESTRAINT.MOVES.stomp.blow(r, { body, surface, unbreakable: true, groundHolds: false });
  const m = body.legEff, c = K.c;
  const pE = Math.sqrt(r.E * r.E + 2 * r.E * m * c * c) / c;
  // the stamp's extra term
  const extra = b ? (b.whole != null ? b.whole : b.J) - (isFinite(r.vFoot) ? 0 : 0) : null;
  return { lg, vFootMinusC: r.vFoot - c, E: r.E, J: b && b.J, whole: b && b.whole, pE, ratio: b && b.whole ? b.whole / pE : null, realBreaks: r.realBreaks };
};
const args = process.argv.slice(2).map(Number);
for (const lg of (args.length ? args : [24, 25, 25.5, 26, 26.5, 26.8, 26.9, 27, 30, 32.96, 32.97, 32.98])) console.log(JSON.stringify(run(lg)));
console.log('legEff', body.legEff);
