const { P, g, ON, OFF, sig, rex, ollie, obj, ctxOf } = require('./common.js');
const hits = {};
for (const air of [0, 0.3, 0.5, 0.9, 0.99, 0.999, 0.9999]) for (const kf of [true, false]) for (const lg of [14, 15, 16, 18, 20, 24]) for (const oid of ['baseball', 'shot', 'car', 'person', 'piano']) for (const D0 of [10, 100, 1000, 1e4, 1e5]) {
  const x = Object.assign({}, ON, { airAbsorb: air, keepForm: kf });
  const cR = ctxOf(Math.pow(10, lg) * g, x, rex), cO = ctxOf(Math.pow(10, lg) * g, x, ollie);
  const L = P.catchLeg(cR, cO, obj(oid), D0, 'hard');
  if (L && L.result === 'fireball') { const k = 'kf' + kf + ' kind ' + L.fireball.kind + ' kept ' + !!L.kept; hits[k] = (hits[k] || 0) + 1; if (hits[k] <= 2) console.log(k, 'air', air, 'lg', lg, oid, D0, 'p', sig(L.fireball.p), 'recoilV', sig(L.fireball.push.recoilV), 'Eblast', sig(L.fireball.Eblast)); }
}
console.log(hits);
