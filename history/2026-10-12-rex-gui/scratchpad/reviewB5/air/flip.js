const { P, body, obj, ctx } = require('./load.js');
const ollie = P.makeBody({ build: 'ollie', H: 3.06, m: 3007 });
const bb = obj('baseball');
const F = 1e17 * P.K.g;
for (const D of [55, 58, 60, 61, 62, 63, 64, 66, 70]) {
  const cR = ctx({ F, airAbsorb: 0.5, keepForm: true, unbreakable: true, ownRecoil: true });
  const cO = Object.assign({}, cR, { body: ollie });
  const L = P.catchLeg(cR, cO, bb, D, 'hard');
  const fb = L.fireball || (L.sheath ? null : null);
  console.log(D, L.result, L.sheath ? 'sheath share ' + L.sheath.share.toFixed(3) : '', fb ? 'kind ' + fb.kind + ' Egap/E ' + (fb.Egap / fb.E).toFixed(3) + ' Eblast/E ' + (fb.Eblast / fb.E).toFixed(3) : '', L.catch ? 'carried ' + L.catch.carried + ' uAfter/c ' + (L.catch.uAfter / P.K.c).toFixed(4) + ' Ecatch ' + L.catch.Ecatch.toExponential(3) + ' Enear ' + (L.catch.Enear || 0).toExponential(3) : '');
}
