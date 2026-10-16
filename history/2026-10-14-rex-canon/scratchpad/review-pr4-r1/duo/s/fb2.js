const { P, D, g, rex, ollie, surf, ON, OFF, ctx, DIAL } = require('./env.js');
const o = D.objects.find((x) => x.id === 'baseball');
for (const kg of [1e10, 1e12, 1e14, 1e16, 1e20, Infinity]) for (const nk of [true, false]) for (const [lbl, PW] of [['OFF', OFF], ['kf-off air0.5', Object.assign({}, ON, { keepForm: false, airAbsorb: 0.5 })], ['kf-off air0', Object.assign({}, ON, { keepForm: false, airAbsorb: 0 })]]) {
  const cR = ctx(kg, rex, Object.assign({}, PW, { noKnockback: nk })), cO = ctx(kg, ollie, Object.assign({}, PW, { noKnockback: nk }));
  for (const st of ['hard', 'easy']) {
    const L = P.catchLeg(cR, cO, o, 10, st);
    const f = L && L.fireball;
    console.log(lbl, kg, 'nkb', nk, st, L && L.result, f ? JSON.stringify({ kind: f.kind, push: f.push, kA: !!f.knockAbsorbed, Eblast: f.Eblast }) : '');
  }
}
