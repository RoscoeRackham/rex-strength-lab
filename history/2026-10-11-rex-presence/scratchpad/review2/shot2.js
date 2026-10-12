const { P, D, g, surf, obj, rex, ollie, ctxOf } = require('./common.js');
const R = P.RESTRAINT;
for (const [oid, sid] of [['shot', 'sand'], ['bowling', 'sand'], ['shot', 'concrete']]) {
  const o = obj(oid), sf = surf(sid);
  const c = ctxOf(90718 * g, { surface: sf });
  const p = R.planNow('throw', c, { near: 5, obj: o, angle: 45, target: 30 });
  const ce = p.ceiling(); const r = p.run(ce.use); const v = r.flight.vImpact;
  const L = o.L || Math.cbrt(6 * o.m / (Math.PI * (o.rho || 1000)));
  const A = o.area; const q = P.qultFor(sf, Math.sqrt(A));
  const depth = P.penetrationDepth(o.m, A, v, q, sf.rho);
  const Tpen = Math.max(L / v, 2 * depth / v);
  const J = o.m * v;
  const engine = P.ppvAt(P.vibSource(sf, 'hann', 2 * J / (L / v), L / v), 5), pen = P.ppvAt(P.vibSource(sf, 'hann', 2 * J / Tpen, Tpen), 5);
  console.log(oid, sid, 'v', v.toFixed(1), 'L', L.toFixed(3), 'Poncelet depth', depth.toFixed(3), 'm; T engine', (L / v * 1000).toFixed(1), 'ms vs with penetration', (Tpen * 1000).toFixed(1), 'ms; PPV@5m', (engine * 1000).toFixed(1), '->', (pen * 1000).toFixed(2), 'mm/s');
}
// record shot put landing ~ 13.7 m/s
const sf = surf('sand'), o = obj('shot'); const v = 13.7; const L = Math.cbrt(6 * o.m / (Math.PI * o.rho));
console.log('record-like shot landing 13.7 m/s on lab sand, engine rule PPV@5 m', (P.ppvAt(P.vibSource(sf, 'hann', 2 * o.m * v / (L / v), L / v), 5) * 1000).toFixed(1), 'mm/s; on concrete', (P.ppvAt(P.vibSource(surf('concrete'), 'hann', 2 * o.m * v / (L / v), L / v), 5) * 1000).toFixed(1));
