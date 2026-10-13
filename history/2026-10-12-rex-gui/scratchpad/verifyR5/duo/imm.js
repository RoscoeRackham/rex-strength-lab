// Collide, truly immovable Rex, Ollie jumps on him: the take-off's shaking vs the hit's blast, at 61.1 t and 100 t
const { P, g, ctxOf, oCtx, sig, ollie } = require('./h.js');
for (const kg of [61.1e3, 1e5]) {
  const cR = Object.assign(ctxOf(kg), { immovable: true }), cO = oCtx(ctxOf(kg));
  const r = P.collide(cO, cR, { source: 'jump', gb: 1, bounce: false });
  const tk = r.speed.jump.pushOff, s = P.impulseSource(cO.surface, tk.J, tk.T);
  const Q = r.h.Q, R = P.RESTRAINT.R;
  console.log(kg / 1000 + ' t: outcome', r.outcome, 'take-off J', sig(tk.J), 'T', sig(tk.T), 'ppv at 30 m', sig(P.ppvAt(s, 30) * 1000), 'mm/s (rattle at', P.VIB.TH.rattle * 1000, 'mm/s)', 'rattle reach', sig(P.ppvReach(s, P.VIB.TH.rattle)), 'm | hit Q', sig(Q), 'J, air rattle reach', sig(P.blastRadius(Q, R.DP_RATTLE)), 'm');
}
