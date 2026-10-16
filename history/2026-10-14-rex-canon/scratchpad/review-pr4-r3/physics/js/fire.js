const { P, D, g, R3, O3, c3, dial, sig, surf, conc } = require('./h.js');
const obj = (id) => P.OBJECTS ? P.OBJECTS.find((o) => o.id === id) : null;
const O = (id) => (P.OBJECTS || []).find((o) => o.id === id) || (window.DINO_DATA.objects || []).find((o) => o.id === id);
const ball = O('baseball');
for (const air of [0, 0.5]) for (const nkb of [true, false]) for (const anc of ['friction', 'bolted']) {
  const cT = c3(1e14 * g, R3, { keepForm: false, airAbsorb: air });
  const L = P.catchLeg(cT, Object.assign({}, cT, { body: O3, noKnockback: nkb, anchor: anc }), ball, 10, 'hard');
  const f = L.fireball;
  console.log('air', air, 'nkb', nkb, anc, L.result, f && f.kind, 'p', sig(f && f.p), 'E', sig(f && f.E), 'Egap', sig(f && f.Egap), 'Earr', sig(f && f.Earr), 'Ehere', sig(f && f.Ehere), 'Eblast', sig(f && f.Eblast), 'recoilV', sig(f && f.push.recoilV), 'Ecarry', sig(f && f.Ecarry), 'Enear', sig(f && f.Enear), 'kA', f && f.knockAbsorbed && sig(f.knockAbsorbed.E));
}
