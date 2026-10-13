const { P, K, ON, leg, sig } = require('./common.js');
for (const kg of [1e15, 1e17, 1.81436948e23]) for (const sh of [0, 0.5, 0.99, 0.9999, 0.999999, 1]) for (const Dd of [100, 1000, 11000]) {
  const L = leg(kg, Object.assign({}, ON, { airAbsorb: sh }), 'baseball', Dd);
  const k = L.catch;
  console.log(JSON.stringify({ kg: sig(kg, 3), sh, D: Dd, result: L.result, vArr_c: sig(L.vArrive / K.c), sheath: L.sheath ? sig(L.sheath.share) : null, Ecatch: k ? sig(k.Ecatch) : null, carried: k ? k.carried : null, uAfter: k ? sig(k.uAfter) : null, time: sig(L.time) }));
}
