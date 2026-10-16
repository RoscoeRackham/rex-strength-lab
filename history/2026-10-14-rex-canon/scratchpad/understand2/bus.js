const { P, g, sig, rex, ollie, ctx, ppv, ob, F0, sf } = require('./h.js');
for (const [oid, D, lg, style] of [['bus', 10, Math.log10(F0 / g), 'hard'], ['tank', 10, 6, 'hard'], ['tank', 31.6, 6, 'easy']]) for (const anchor of ['friction', 'bolted']) {
  const c = ctx({ F: Math.pow(10, lg) * g }), cO = ctx({ F: Math.pow(10, lg) * g, anchor }, ollie);
  const L = P.catchLeg(c, cO, ob(oid), D, style), k = L.catch;
  console.log(oid, D, sig(lg), style, anchor, L.result, 'vArrive', sig(L.vArrive), 'Fneed', sig(k.Fneed), 'Fcap', sig(k.Fcap), 'F', sig(k.F), 'vSlam', sig(k.vSlam), 'uAfter', sig(k.uAfter), 'slide', sig(k.slide), 'toGroundC', L.toGroundC && sig(L.toGroundC.J), 'pIn', sig(P.vToMomentum(L.vArrive, ob(oid).m)));
}
