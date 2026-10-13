const { P, D, surf, obj, rex, ollie, tons, ctx } = require('./lib.js');
const M = P.RESTRAINT.MOVES;
const fmt = (x) => (typeof x === 'number' ? x.toPrecision(4) : x);
for (const s of ['concrete', 'sand', 'granite']) for (const lk of [8, 9, 10]) {
  const kg = Math.pow(10, lk);
  const cR = ctx({ body: rex(), surface: s, kg }), cO = ctx({ body: ollie(), surface: s, kg });
  const tp = P.throwPartner(cR, cO, 30);
  const r = tp.r; if (!r.canMove || !r.flight.landed) { console.log(s, lk, 'no landing', r.flight && r.flight.escaped); continue; }
  const mo = { obj: tp.obj, surface: cR.surface, body: cR.body, anchor: cR.anchor, angle: 30, near: 5, airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
  const land = M.throw.landShake(r, mo);
  const B = cO.body, Nmax = P.qultFor(cR.surface, B.footB) * 2 * B.footArea, bear = Math.max(0, Nmax - B.m * 9.80665);
  const L = tp.obj.L, v = r.flight.vImpact, J = P.vToMomentum(v, B.m), T = Math.max(1e-3, L / v);
  const capJ = Math.min(J, bear * T), capped = P.impulseSource(cR.surface, capJ, T);
  console.log(s, '1e' + lk, 'vImpact', fmt(v), 'Eimpact', fmt(r.Eimpact), 'crater(real)', fmt(r.crater), 'heldText', r.Eimpact > 4.184e9 && r.crater > 0, 'J', fmt(J), 'T', fmt(T), '| ppv5', fmt(P.ppvAt(land, 5) * 1e3), 'plaster', fmt(P.plasterReach(land)), '| capped J', fmt(capJ), 'ppv5', fmt(P.ppvAt(capped, 5) * 1e3), 'plaster', fmt(P.plasterReach(capped)));
}
