const { P, D, rex, surf, obj, ctxOf } = require('./common.js');
const ollie = P.makeBody({ build: 'ollie', H: 3.06, m: 3007 });
const g = P.K.g;
for (const sid of ['concrete', 'sand']) for (const kg of [1e9, 1e7, 1e6]) {
  const s = surf(sid);
  const cA = ctxOf({ F: kg * g, surface: s }), cB = Object.assign(ctxOf({ F: kg * g, surface: s }), { body: ollie });
  const t = P.throwPartner(cA, cB, +(process.argv[2]||30));
  const r = t.r;
  const o = { body: rex, surface: s, obj: t.obj, unbreakable: true, ownRecoil: true, near: 5 };
  const land = P.RESTRAINT.MOVES.throw.landShake(r, o);
  if (!land) { console.log(sid, kg, 'no landing', r.flight && r.flight.landed, r.flight && r.flight.relativistic); continue; }
  const v = r.flight.vImpact, J = v * t.obj.m, T = land.T;
  const Nmax = P.qultFor(s, ollie.footB) * 2 * ollie.footArea, bear = Math.max(0, Nmax - ollie.m * g);
  const th = r.flight.impactAngleDeg * Math.PI / 180;
  const Jd = J * Math.sin(th), Jh = J * Math.cos(th);
  const capped = Math.hypot(Jh, Math.min(Jd, bear * T));
  const srcC = P.impulseSource(s, capped, T), srcV = P.impulseSource(s, Math.min(J, bear * T), T);
  console.log(`${sid} ${kg}kg: vImpact=${v.toExponential(3)} angle=${r.flight.impactAngleDeg.toFixed(1)} J=${J.toExponential(3)} T=${(T*1000).toFixed(3)}ms crater=${r.crater.toFixed(1)}m Eimp=${(r.Eimpact/4.184e9).toFixed(2)}tTNT plaster=${P.plasterReach(land).toFixed(0)}m | bear=${bear.toFixed(0)} rule-with-sideways-whole J=${capped.toExponential(3)} plaster=${P.plasterReach(srcC).toFixed(0)}m | vertical-only cap J=${Math.min(J, bear*T).toFixed(0)} plaster=${P.plasterReach(srcV).toFixed(1)}m`);
}
