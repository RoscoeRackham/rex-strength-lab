const { P, K, ON, leg, sig, obj, ctxOf } = require('./common.js');
// sheath catch at slow lump speeds: baseball, 1e15 dial (7.44% c), kept, 50%
for (const sh of [0.5, 0]) for (const Dd of [100, 1000, 5000, 11000]) {
  const L = leg(1e15, Object.assign({}, ON, { airAbsorb: sh }), 'baseball', Dd);
  const k = L.catch;
  const r = { sh, D: Dd, result: L.result, vL_c: sig(L.aim && L.aim.vL / K.c), vArr_c: sig(L.vArrive / K.c), vArr_kms: sig(L.vArrive / 1000), sheath: L.sheath && sig(L.sheath.share) };
  if (k) Object.assign(r, { rel: k.relativistic, held: !k.slips, uAfter: sig(k.uAfter), Ecatch: sig(k.Ecatch), E1: sig(k.E1), Ediss: sig(k.Ediss), carried: k.carried });
  if (L.miss) Object.assign(r, { missE: sig(L.miss.E), missV: sig(L.miss.vImpact) });
  console.log(JSON.stringify(r));
}
