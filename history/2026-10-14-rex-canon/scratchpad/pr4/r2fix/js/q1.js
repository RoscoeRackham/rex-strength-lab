const root = process.argv[2] || '/home/user/rex-strength-lab/rex-strength-lab';
const { P, g, R3, O3, dial, c3, on, sig, surf } = require('./common.js')(root);
const charge = (F, o, xR, xO) => P.collide(c3(F, O3, xO || on()), c3(F, R3, xR || on()), o);
for (const [lab, F, o, xR, xO] of [['sprint', dial, { source: 'sprint' }], ['1 m/s', dial, { source: 'set', gb: 1 / P.K.c }], ['jump real', dial, { source: 'jump' }, on({ unbreakable: false }), on({ unbreakable: false })], ['bolted real rock', dial, { source: 'sprint' }, on({ anchor: 'bolted', unbreakable: false }), on({ unbreakable: false })], ['least', 4260 * g, { source: 'sprint' }]]) {
  const r = charge(F, o, xR, xO), k = r.carry, s = r.contact.s, during = r.after.splat.during;
  const work = k.F * k.v * k.T, ke = P.momentumToKE(k.pGain, R3.m);
  console.log(lab, 'Q', sig(r.Q), 'F*s', sig(k.F * s), 'hitAbs', sig(r.hitAbsorbed.E), 'work', sig(work), 'KE+H*during+Q', sig(ke + k.hold * during + r.Q), 'supplied', sig(k.supplied), 'Elocal', r.Elocal, 'Eair', k.Eair);
}
for (const gb of [0.001 / Math.sqrt(1 - 1e-6), 0.0099, 0.0101, 500 / P.K.c, 300 / P.K.c, 200 / P.K.c]) for (const bounce of [false, true]) {
  const r = charge(dial, { source: 'set', gb, bounce });
  console.log('set gb', sig(gb), bounce ? 'bounce' : 'splat', 'vB', sig(r.carry.vB), 'Elocal', sig(r.Elocal), 'Eair', r.carry.Eair && sig(r.carry.Eair), 'KE', sig(P.momentumToKE(r.carry.pGain, R3.m)), 'slide', r.after && r.after.splat && sig(r.after.splat.slide));
}
