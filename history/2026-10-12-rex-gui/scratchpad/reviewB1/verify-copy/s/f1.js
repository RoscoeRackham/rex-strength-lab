const { P, ctx, off } = require('./env');
for (const kg of [1e6, 1e8]) {
  for (const own of [true, false]) {
    const cO = ctx(kg, { ownRecoil: own }), cR = ctx(kg, { ownRecoil: own });
    const r = P.collide(cO, cR, { source: 'stomp', gb: 1 });
    console.log(kg, 'ownRecoil', own, 'noCharge', r.noCharge, 'v0', r.v0, 'outcome', r.outcome);
  }
}
