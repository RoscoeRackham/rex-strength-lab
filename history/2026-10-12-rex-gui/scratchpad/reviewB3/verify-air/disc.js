const { P, D, g, obj, rex, ollie, ctxOf, sig } = require('./common.js');
const M = P.RESTRAINT.MOVES;
const c = P.K.c;
for (const share of [0, 0.5, 0.9]) for (const kg of [8.06e14, 8.39e14]) {
  const ex = { airAbsorb: share, keepForm: true, unbreakable: true, ownRecoil: true };
  const cx = ctxOf(kg * g, ex);
  const o = Object.assign({}, cx, { obj: obj('car'), angle: 45, target: 0 });
  const r = M.throw.run(cx, o);
  const b = M.throw.blastParts(r, o);
  console.log('share', share, 'kg', kg, 'v/c', sig(r.v / c), 'rel', !!r.flight.relativistic, 'Eobj', sig(r.Eobj), 'blast', sig(M.throw.blast(r, o)), 'land', sig(b.land), 'path', sig(b.path), 'dragLoss0', r.dragLoss0 != null ? sig(r.dragLoss0) : '-', 'flight.air.E', r.flight.air ? sig(r.flight.air.E) : '-', 'eFold', r.flight.eFold ? sig(r.flight.eFold) : '-');
}
