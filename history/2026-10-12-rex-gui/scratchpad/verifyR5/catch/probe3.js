const { P, K, ON, leg, sig, obj, ctxOf, ollie } = require('./common.js');
const c2 = K.c * K.c;
// energy and momentum conservation of the sheath catch at slow lump speeds
const check = (kg, sh, Dd, oid, oExtra) => {
  const L = leg(kg, Object.assign({}, ON, { airAbsorb: sh }), oid, Dd, 'hard', oExtra);
  if (!L.catch || !L.sheath) return console.log(JSON.stringify({ kg, sh, D: Dd, oid, result: L.result, vL: L.aim && sig(L.aim.vL / K.c) }));
  const k = L.catch, o = obj(oid);
  const x = (1 - sh) * L.Dfl / (o.m / (K.rho0 * o.area));
  const mL = o.m * (1 + x) + L.sheath.E / c2;
  const p = k.pIn, E0 = P.momentumToKE(p, mL);
  // throw's energy and momentum from the start
  const Ethrow = L.sheath.E / L.sheath.share;
  const pThrow = Math.sqrt(Ethrow * Ethrow + 2 * Ethrow * o.m * c2) / K.c;
  // after: held -> planet takes p, all of E0 freed; slips -> pair moves at uAfter with rest mass Mf
  const M = ollie.m, Mtot = M + mL;
  const KEafter = k.slips ? P.momentumToKE(p, (k.uAfter > 0 ? p / (k.uAfter / Math.sqrt(1 - (k.uAfter / K.c) ** 2)) : Infinity)) : 0;
  const balance = (E0 - k.E1 - k.Ediss - KEafter) / E0;
  const pAfter = k.slips ? (Mtot + (k.E1 + k.Ediss) / c2) * k.uAfter / Math.sqrt(1 - (k.uAfter / K.c) ** 2) : p;
  // the classical catch of the same lump (all slow): v1 = v m/(m+mh), E1 = 1/2 m mh v^2/(m+mh)
  const v = L.vArrive, mh = k.mh, E1cl = 0.5 * mL * mh / (mL + mh) * v * v;
  console.log(JSON.stringify({ kg, sh, D: Dd, oid, result: L.result, vL_c: sig(L.aim.vL / K.c), vArr_kms: sig(v / 1000), lumpKg: sig(mL), pThrow_over_pIn: sig(pThrow / p, 12), E0: sig(E0), Ethrow_minus_Egap_over_E0: sig((Ethrow - L.sheath.E) / E0, 10), E1: sig(k.E1), E1classical: sig(E1cl), energyBalance: sig(balance, 3), momentumBalance: sig((pAfter - p) / p, 3), slips: k.slips, uAfter: sig(k.uAfter), slide: sig(k.slide), tStroke: sig(k.tStroke), tContact: k.tContact.map((t) => sig(t)) }));
};
for (const kg of [1.5e13, 2e13, 3e13]) check(kg, 0, 11500, 'baseball');
check(1e15, 0, 11500, 'baseball');
check(1e15, 0.5, 1000, 'baseball');
check(1e15, 0, 5000, 'bowling');
check(1e16, 0, 5000, 'person');
check(1e18, 0, 2000, 'car');
check(1e18, 0, 2000, 'car', { anchor: 'bolted' });
check(2e13, 0, 11500, 'baseball', { anchor: 'bolted' });
