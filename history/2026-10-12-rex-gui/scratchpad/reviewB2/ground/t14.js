const { P, D, rex, surf, obj, ctx, ON, K } = require('./h.js');
const M = P.RESTRAINT.MOVES;
const run = (kg) => { const c = Object.assign(ctx({ F: kg*K.g, surface: surf('granite') }), ON); const j = P.jump(c); const o = { surface: c.surface, body: c.body, m: c.body.m, unbreakable: true, near: 5 }; return { j, reach: P.plasterReach(M.jump.shake(j, o)), ppv5: P.ppvAt(M.jump.shake(j, o), 5) }; };
let lo = 1e8, hi = 3e8;
for (let i = 0; i < 60; i++) { const mid = Math.sqrt(lo*hi); if (run(mid).j.overLimitReal) hi = mid; else lo = mid; }
for (const kg of [lo, hi]) { const r = run(kg); console.log((kg).toPrecision(8), 'kgf overLimitReal', r.j.overLimitReal, 'v', r.j.v.toFixed(2), 'vLand', r.j.landing.v.toFixed(1), 'plaster reach', r.reach.toFixed(1), 'm; ppv@5m', (r.ppv5*1000).toFixed(0), 'mm/s'); }
// off (real ground) at same efforts
for (const kg of [lo, hi]) { const c = ctx({ F: kg*K.g, surface: surf('granite') }); const j = P.jump(c); const o = { surface: c.surface, body: c.body, m: c.body.m, near: 5 }; console.log('OFF', kg.toPrecision(8), 'v', j.v.toFixed(2), 'reach', P.plasterReach(M.jump.shake(j, o)).toFixed(1)); }
