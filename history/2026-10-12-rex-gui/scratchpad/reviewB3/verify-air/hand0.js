const { P, D, g, obj, rex, ollie, ctxOf, sig } = require('./common.js');
const M = P.RESTRAINT.MOVES;
for (const kg of [1e7, 1e9]) for (const share of [0, 0.01, 0.5, 1]) {
  const ex = { airAbsorb: share, keepForm: true, unbreakable: true, ownRecoil: true };
  const cx = ctxOf(kg * g, ex);
  const o = Object.assign({}, cx, { obj: obj('baseball'), angle: 45, target: 0 });
  const r = M.throw.run(cx, o);
  const b = M.throw.blastParts(r, o);
  const h = M.throw.hand(r, o);
  const E = M.throw.blast(r, o);
  // 100 Pa reach via overpressure model
  let lo = 0.1, hi = 1e7; for (let i = 0; i < 200; i++) { const mid = Math.sqrt(lo * hi); if (P.overpressureAt(E, mid) > 100) lo = mid; else hi = mid; }
  console.log('kg', kg, 'share', share, 'v', sig(r.v), 'Eobj', sig(r.Eobj), 'blast', sig(E), 'hand.E', h ? sig(h.E) : '-', 'b.hand', b.hand != null ? sig(b.hand) : 'not counted', '100Pa reach m', sig(hi));
}
