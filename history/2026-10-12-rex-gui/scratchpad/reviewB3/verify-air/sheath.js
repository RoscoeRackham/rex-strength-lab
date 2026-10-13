const { P, D, g, obj, rex, ollie, ctxOf, sig } = require('./common.js');
const c = P.K.c;
for (const dial of [1.81e23, 1e20]) for (const share of [0.99, 0.9999, 1]) {
  const ex = { airAbsorb: share, keepForm: true, unbreakable: true, ownRecoil: true };
  const cR = ctxOf(dial * g, ex), cO = Object.assign({}, cR, { body: ollie, anchor: 'bolted' });
  const b = obj('baseball');
  const L = P.catchLeg(cR, cO, b, 1000, 'hard');
  const tab = P.catchReleaseTable(cR, Object.assign({}, b, share < 1 ? { dragK: 1 - share } : {}));
  const E0 = L.sheath ? L.sheath.E / L.sheath.share : (L.catch ? P.momentumToKE(L.catch.pIn, b.m) : NaN);
  const k = L.catch;
  const pTrue = isFinite(E0) ? Math.sqrt(E0 * E0 + 2 * E0 * b.m * c * c) / c : NaN;
  console.log('dial', dial, 'share', share, 'result', L.result, 'sheath', L.sheath ? sig(L.sheath.E) + ' (' + sig(L.sheath.share) + ')' : '-', 'Eobj', sig(E0), 'Ecatch', k ? sig(k.Ecatch) : '-', 'frac', k ? sig(k.Ecatch / E0) : '-', 'pIn', k ? sig(k.pIn) : '-', 'pTrue', sig(pTrue), 'vArrive/c', sig(L.vArrive / c), 'toGroundC', L.toGroundC ? sig(L.toGroundC.J) : '-');
}
// friction catcher
for (const share of [0.99, 1]) {
  const ex = { airAbsorb: share, keepForm: true, unbreakable: true, ownRecoil: true };
  const cR = ctxOf(1.81e23 * g, ex), cO = Object.assign({}, cR, { body: ollie, anchor: 'friction' });
  const L = P.catchLeg(cR, cO, obj('baseball'), 1000, 'hard');
  console.log('friction share', share, L.result, 'uAfter/c', L.catch && sig(L.catch.uAfter / c), 'carried', L.catch && L.catch.carried);
}
