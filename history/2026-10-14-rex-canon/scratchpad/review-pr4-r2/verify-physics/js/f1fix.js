const P = require('/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr4-r2/verify-physics/patch/engine.js');
const { g, R3, O3, dial, c3 } = require('./common.js');
const cl = P.K.c;
for (const [lab, o, xO, xR, s] of [['sprint', { source: 'sprint' }], ['1 m/s', { source: 'set', gb: 1 / cl }], ['jump UF off granite', { source: 'jump' }, { unbreakable: false }, { unbreakable: false }, 'granite']]) {
  const r = P.collide(c3(dial, O3, xO, s), c3(dial, R3, xR, s), o);
  const k = r.carry, Fs = k.F * r.contact.s, work = k.F * r.vRel * k.T, KE = 0.5 * 3000 * r.vRel ** 2;
  console.log(lab, 'Q', r.Q.toFixed(0), 'F*s', Fs.toFixed(0), 'balance work-(KE+hold*during+Q)', (work - KE - k.hold * r.after.splat.during - r.Q).toExponential(2));
}
