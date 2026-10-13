const { P, obj, ctxs } = require('./h.js');
const bb = obj('baseball');
const kg = 200e18 * 907.18474;
const [cR] = ctxs(kg);
const E0 = P.throwObject(Object.assign({}, cR, { noFlight: true }), bb, 0).Eobj;
console.log('E0 level throw', E0.toExponential(4));
for (const [Dd, s, kf] of [[1e6, 0.5, true], [5e6, 0.5, true], [1e5, 0, true], [1e6, 1, true], [1e4, 0.5, true], [1e6, 0.5, false], [1e5,0.5,false]]) {
  const [a, b] = ctxs(kg, { airAbsorb: s, keepForm: kf });
  const L = P.catchLeg(a, b, bb, Dd, 'hard');
  const out = { D: Dd, s, keepForm: kf, result: L.result, aimTh: L.aim && L.aim.thetaDeg, thetaDeg: L.thetaDeg };
  if (L.hitsGround) Object.assign(out, { hitAt: L.hitsGround.at, path: L.hitsGround.path, E: L.hitsGround.E.toExponential(4), EoverE0: (L.hitsGround.E / E0).toFixed(4) });
  if (L.sheath) out.sheathShare = L.sheath.share;
  if (L.fireball) Object.assign(out, { fbKind: L.fireball.kind, fbEgap: (L.fireball.Egap/L.fireball.E).toFixed(4), Eblast: (L.fireball.Eblast / L.fireball.E).toFixed(3) });
  console.log(JSON.stringify(out));
}
