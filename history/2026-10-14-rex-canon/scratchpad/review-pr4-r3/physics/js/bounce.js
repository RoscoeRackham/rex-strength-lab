const { P, D, g, R3, O3, c3, dial, sig, surf, conc } = require('./h.js');
const ch = (F, o) => P.collide(c3(F, O3), c3(F, R3), o);
for (const kg of [2600, 2800, 3000, 3100, 3200, 3310, 3400, 4260, 90718]) {
  { const r0 = ch(kg * g, { source: "sprint", bounce: true }); if (!r0.carry) { console.log(kg, r0.outcome, r0.noCharge); continue; } }
  const r = ch(kg * g, { source: 'sprint', bounce: true });
  const k = r.carry, cf = r.contact;
  const duringEl = k.v * cf.softEl.t;   // the charger's front moves v T; the gap returns to zero, so Rex moves v T
  console.log(kg, 'v', sig(k.v), 'vB', sig(k.vB), 'T_el', sig(cf.softEl.t), 's', sig(cf.s), 'during(bounce) v*T', sig(duringEl), 'pi*s', sig(Math.PI * cf.s), 'slideB', sig(r.after.bounce.slideB), 'total', sig(duringEl + r.after.bounce.slideB));
}
// splat at the same efforts for comparison
for (const kg of [4260]) { const r = ch(kg * g, { source: 'sprint' }); console.log('splat', kg, 'during', sig(r.after.splat.during), 'slide', sig(r.after.splat.slide), 'moved', sig(r.after.splat.moved)); }
