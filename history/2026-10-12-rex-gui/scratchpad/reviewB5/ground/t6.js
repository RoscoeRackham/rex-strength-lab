const { P, D, surf, obj, rex, ollie, tons, ctx } = require('./lib.js');
const M = P.RESTRAINT.MOVES;
const fmt = (x) => (typeof x === 'number' ? x.toPrecision(4) : x);
for (const s of ['sand', 'concrete']) for (const t of [10, 100, 1000]) {
  const cR = ctx({ body: rex(), surface: s, kg: tons(t) }), cO = ctx({ body: ollie(), surface: s, kg: tons(t) });
  const tp = P.throwPartner(cR, cO, 45);
  const r = tp.r; if (!r.canMove) { console.log(s, t, 'cant'); continue; }
  const mo = { obj: tp.obj, surface: cR.surface, body: cR.body, anchor: cR.anchor, angle: 45, near: 5, airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true };
  const land = M.throw.landShake(r, mo);
  const B = cO.body, Nmax = P.qultFor(cR.surface, B.footB) * 2 * B.footArea, bear = Math.max(0, Nmax - B.m * 9.80665);
  const L = tp.obj.L, v = r.flight.vImpact, J = B.m * v, T = Math.max(1e-3, L / v);
  const capJ = Math.min(J, bear * T);
  const capped = P.impulseSource(cR.surface, capJ, T);
  console.log(s, t + 't', 'vImpact', fmt(v), 'J', fmt(J), 'T', fmt(T), 'Ollie bear', fmt(bear), 'ppv5 landing', fmt(P.ppvAt(land, 5) * 1e3), 'plaster', fmt(P.plasterReach(land)), '| jump-style cap J', fmt(capJ), 'ppv5', fmt(P.ppvAt(capped, 5) * 1e3), 'plaster', fmt(P.plasterReach(capped)), 'crater(real)', fmt(r.crater), 'Eimpact', fmt(r.Eimpact));
}
