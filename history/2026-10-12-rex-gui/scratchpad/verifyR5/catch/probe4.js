const { P, K, ON, leg, sig, obj, ctxOf } = require('./common.js');
const c2 = K.c * K.c;
// hits-ground: energy, crater, airHeat across share, distance, kept
const show = (kg, extra, Dd, oid) => {
  const L = leg(kg, extra, oid || 'baseball', Dd);
  const o = obj(oid || 'baseball');
  const r0 = P.throwObject(ctxOf(kg * K.g, extra), o, L.aim ? L.aim.thetaDeg : 0);
  const hg = L.hitsGround || {};
  const vAtGround = hg.path != null && hg.airK > 0 ? P.catchLeg && null : null;
  return { kg, share: extra.airAbsorb, kept: !!extra.keepForm, D: Dd, result: L.result, E_over_Ethrow: hg.E != null ? sig(hg.E / r0.Eobj, 8) : null, at: sig(hg.at), path: sig(hg.path), airHeatShare: hg.airHeat != null ? sig(hg.airHeat / hg.E) : null, crater: sig(hg.crater), craterX: hg.craterExtrapolated, quake: sig(hg.quake, 3), sheath: L.sheath ? sig(L.sheath.share) : null, Ecatch: L.catch ? sig(L.catch.Ecatch) : null, vArr: sig(L.vArrive) };
};
for (const kept of [true, false]) for (const sh of [0, 0.5, 0.99, 1]) for (const Dd of [11000, 11700, 11900, 12500, 20000, 1e5]) {
  console.log(JSON.stringify(show(1e15, Object.assign({}, ON, { airAbsorb: sh, keepForm: kept }), Dd)));
}
