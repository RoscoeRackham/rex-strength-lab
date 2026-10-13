const { P, D, g, obj, rex, ollie, ctxOf, sig } = require('./common.js');
const pageBlast = (cR, L) => {
  const Eair = L.result === 'fireball' ? L.fireball.E : L.result === 'hits-ground' ? L.hitsGround.E : L.aim && L.aim.vL >= P.K.a0 && L.drag ? P.dragFactor(cR) * (L.drag.E || 0) : 0;
  const Eh = L.hand ? L.hand.E : 0;
  return { Eair, Eh, tot: (L.result === 'fireball' || L.result === 'hits-ground') ? Math.max(Eair, Eh) : Eair + Eh, dragE: L.drag && L.drag.E, ocean: L.flight && L.flight.ocean };
};
for (const [id, dial, Dd] of [['bus', 1e9, 30], ['car', 1e9, 30], ['baseball', 1e7, 30], ['bus', 1e9, 300]]) {
  let base = null;
  for (const share of [0, 0.5, 0.9]) {
    const ex = { airAbsorb: share, keepForm: true, unbreakable: true, ownRecoil: true };
    const cR = ctxOf(dial * g, ex), cO = Object.assign({}, cR, { body: ollie });
    const L = P.catchLeg(cR, cO, obj(id), Dd, 'hard');
    const b = pageBlast(cR, L);
    if (share === 0) base = b;
    // the full-drag work along the slowed path: dragE + ocean.E
    const full = (b.dragE || 0) + (b.ocean ? b.ocean.E : 0);
    console.log(id, dial, Dd, 'share', share, L.result, 'vL', sig(L.aim && L.aim.vL), 'drag.E', sig(b.dragE), 'fullDragAlongPath', sig(full), 'dragE/full', sig(b.dragE / full), 'pageEair', sig(b.Eair), 'frac of 0%', sig(b.Eair / base.Eair), 'hand', sig(b.Eh));
  }
}
