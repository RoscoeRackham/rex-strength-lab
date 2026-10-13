const {P, obj, ctx, rex, ollie, ALL} = require('./load.js');
const c=P.K.c;
for (const kg of [1e17, 1e20, 1.8e23]) for (const anchor of ['bolted','friction']) for (const s of [1, 0.999999, 0.9999, 0.99]) {
  const cR = ctx(kg, Object.assign({}, ALL, { airAbsorb: s, anchor })), cO = Object.assign({}, cR, { body: ollie });
  const L = P.catchLeg(cR, cO, obj('baseball'), 1000, 'hard');
  const k = L.catch || {};
  const E = L.fireball ? L.fireball.E : (L.sheath ? null : null);
  console.log(kg.toExponential(1), anchor, s, L.result, 'vArr/c', L.vArrive && (L.vArrive/c), 'time', L.time, 'sheath', L.sheath && L.sheath.share.toExponential(3), 'pIn', k.pIn && k.pIn.toExponential(4), 'Ecatch', k.Ecatch && k.Ecatch.toExponential(4), 'Ediss', k.Ediss && k.Ediss.toExponential(4), 'E1', k.E1 && k.E1.toExponential(3), 'carried', k.carried, 'uAfter/c', k.uAfter/c, 'Eride', k.Eride && k.Eride.toExponential(3), 'shockPa', L.shockPa && L.shockPa.toExponential(3), 'g2', L.shockGamma2 && L.shockGamma2.toExponential(3));
}
