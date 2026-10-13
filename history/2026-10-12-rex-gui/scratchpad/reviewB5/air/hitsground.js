const { P, body, obj, ctx } = require('./load.js');
const ollie = P.makeBody({ build: 'ollie', H: 3.06, m: 3007 });
const bb = obj('baseball');
const F = 200e18 * 907.18474 * P.K.g;
for (const [D, s] of [[20e3, 0.5], [1e6, 0.5], [1e6, 0.9], [5e6, 0.5], [20e3, 1], [1e6, 1]]) {
  const cR = ctx({ F, airAbsorb: s, keepForm: true, unbreakable: true, ownRecoil: true });
  const cO = Object.assign({}, cR, { body: ollie });
  const L = P.catchLeg(cR, cO, bb, D, "hard");
  if (!L) { console.log('no CATCHGAME export', Object.keys(P).filter(k=>/catch|game|leg/i.test(k))); break; }
  const E0 = P.throwObject(Object.assign({}, cR, { noFlight: true }), bb, 0).Eobj;
  console.log('D', D, 'share', s, 'result', L.result, 'hitsGround', JSON.stringify(L.hitsGround && { at: L.hitsGround.at, path: L.hitsGround.path, E: L.hitsGround.E, EoverE0: L.hitsGround.E / E0 }), 'sheath', JSON.stringify(L.sheath), 'aim', JSON.stringify(L.aim), 'E0', E0.toExponential(4));
}
