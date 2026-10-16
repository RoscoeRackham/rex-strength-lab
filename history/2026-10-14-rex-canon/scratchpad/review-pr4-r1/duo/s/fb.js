const { P, D, g, rex, ollie, surf, ON, OFF, ctx, DIAL } = require('./env.js');
const o = D.objects.find((x) => x.id === 'baseball');
for (const nk of [true, false]) for (const mean of [false, true]) for (const [aR, aO] of [['friction','friction'],['friction','bolted']]) {
  const base = Object.assign({}, ON, { keepForm: false, airAbsorb: 0.5 });
  const cR = ctx(1e14, rex, Object.assign({}, base, { anchor: aR, noKnockback: nk, meanIt: mean })), cO = ctx(1e14, ollie, Object.assign({}, base, { anchor: aO, noKnockback: nk, meanIt: mean }));
  const L = P.catchLeg(cR, cO, o, 10, 'hard');
  const fbk = L.fireball;
  console.log('nkb', nk, 'mean', mean, aR, aO, L.result, fbk && JSON.stringify({ kind: fbk.kind, E: fbk.E, Egap: fbk.Egap, Earr: fbk.Earr, Eblast: fbk.Eblast, Ehere: fbk.Ehere, push: fbk.push, kA: fbk.knockAbsorbed, p: fbk.p }));
}
