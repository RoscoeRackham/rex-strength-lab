const { P, ON, OFF, ctx } = require('./h.js');
for (const kg of [1e4, 1e5, 1e6]) {
  for (const [n, pw] of [['on', ON], ['off', OFF], ['on,no recoil', Object.assign({}, ON, { ownRecoil: false })]]) {
    const cO = ctx(kg, { build: 'ollie', pw }), cR = ctx(kg, { pw });
    const r = P.collide(cO, cR, { source: 'stomp' });
    console.log(kg, n, r.noCharge || '', r.v0 != null ? r.v0.toFixed(3) : '', r.outcome || '', r.held ? 'held' : '');
  }
}
