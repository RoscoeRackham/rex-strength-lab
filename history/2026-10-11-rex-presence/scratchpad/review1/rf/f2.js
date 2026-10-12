const { P, D, g, surf, obj, ctx, rex, ollie } = require('./lib.js');
console.log('blastRadius(1 J,100 Pa)', P.blastRadius(1, 100), ' (1e5 J)', P.blastRadius(1.7e5, 100));
const near = 5, win = (E) => isFinite(E) ? E > 0 && P.blastRadius(E, P.RESTRAINT.R.DP_HARM) >= near : E > 0;
for (const kg of [1000, 3000, 5000, 10000, 30000]) {
  const cR = ctx({ F: kg * g }), cO = ctx({ F: kg * g, body: ollie() });
  const t = P.throwPartner(cR, cO, 45);
  if (!t.r) { console.log(kg, 'no r'); continue; }
  console.log(kg, 'kg canMove', t.r.canMove, 'v', t.r.v, 'range', t.r.flight && t.r.flight.range.toFixed(2), 'vImpact', t.r.flight && t.r.flight.vImpact.toFixed(2), 'Eimpact', String(t.r.Eimpact), 'R100Pa', P.blastRadius(t.r.Eimpact||0,100).toFixed(0),
    'HEADrule', win(t.r.Eimpact), 'WTrule', win(P.RESTRAINT.MOVES.throw.blast(t.r)));
}
