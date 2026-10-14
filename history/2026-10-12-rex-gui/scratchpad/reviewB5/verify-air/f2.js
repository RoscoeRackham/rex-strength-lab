const { P, obj, ctxs, rex } = require('./h.js');
const bb = obj('baseball');
const kg = 200e18 * 907.18474;
const R = P.K.R_E;
for (const [Dd, s, kf, ub] of [[1e7, 0.5, true, true], [1e7, 0, true, true], [1e6, 0.5, false, true], [1e5, 0.5, false, true], [1e6, 0, false, true], [1e6, 0, false, false], [2e4, 0.5, false, true], [1.5e4, 0.5, false, true], [1.2e4,0.5,false,true]]) {
  const [a, b] = ctxs(kg, { airAbsorb: s, keepForm: kf, unbreakable: ub, ownRecoil: ub });
  const L = P.catchLeg(a, b, bb, Dd, 'hard');
  const o = { D: Dd, s, keepForm: kf, ub, result: L.result, th: L.thetaDeg != null ? L.thetaDeg : L.aim && L.aim.thetaDeg };
  if (L.fireball) Object.assign(o, { kind: L.fireball.kind, Egap: +(L.fireball.Egap / L.fireball.E).toFixed(4), Eblast: +(L.fireball.Eblast / L.fireball.E).toFixed(3) });
  if (L.hitsGround) Object.assign(o, { hitAt: +L.hitsGround.at.toFixed(1) });
  // geometry: line from h0 at angle th: height above ground at D
  const h0 = rex.releaseHeight, th = (o.th || 0) * Math.PI / 180;
  o.lineHeightAtOllie_km = +((h0 + Dd * Math.tan(th) + Dd * Dd / (2 * R)) / 1000).toFixed(2);
  // the chord check: does a chord from hand to hand go underground?
  o.chordMaxDepth_m = +(Dd * Dd / (8 * R) - h0).toFixed(1);
  console.log(JSON.stringify(o));
}
console.log('sqrt(8 R h0) km', Math.sqrt(8 * R * rex.releaseHeight) / 1000);
