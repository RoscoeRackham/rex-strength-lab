const { P, D, g, surf, obj, R0, F0, ON, OFF4, M, cOf, oOf, planOf, sig } = require('./common.js');
const person = obj('person');
console.log('person', JSON.stringify({ m: person.m, L: person.L, rho: person.rho, area: person.area, Cd: person.Cd, passenger: person.passenger }));
for (const sp of [true, false]) {
  const p = planOf(F0, {}, sp);
  const gl = p.goal(), ce = p.ceiling();
  const r = p.run(gl.use);
  console.log('sp', sp, 'goal use', sig(gl.use / g), 'reached', gl.reached, 'v', sig(r.v), 'range', sig(r.flight.range), 'vImpact', sig(r.flight.vImpact), 'Eimpact', sig(r.Eimpact));
  console.log('  ceiling by', ce.by, 'below', sig(ce.below / g), 'use', sig(ce.use / g), 'onset geo', sig(Math.sqrt(ce.below * ce.use) / g), 'pct', sig(100 * ce.below / F0));
  const pl = M.throw.passengerLanding(r, p.opt);
  console.log('  passengerLanding', JSON.stringify(pl));
  const ls = M.throw.landShake(r, p.opt);
  console.log('  landShake', JSON.stringify(ls));
  const L = person.L || Math.cbrt(6 * person.m / (Math.PI * (person.rho || 1000)));
  console.log('  L', L, 'T', L / r.flight.vImpact, 'mean decel g', r.flight.vImpact / (L / r.flight.vImpact) / g, 'fall h', r.flight.vImpact ** 2 / (2 * g));
  const rAll = p.run(F0);
  console.log('  all-out v', sig(rAll.v), 'range', sig(rAll.flight.range), 'vImpact', sig(rAll.flight.vImpact), 'launchG', sig(rAll.launchG), 'launchT', rAll.launchT, 'Eimpact', sig(rAll.Eimpact));
  const Lall = L, Tall = Lall / rAll.flight.vImpact;
  console.log('  all-out landing T', Tall, 'mean g', rAll.flight.vImpact / Tall / g);
  const hz = p.hazards().map(h => h.id + ':' + (h.never ? 'never' : sig(h.use / g)));
  console.log('  hazards', hz.join(' '));
  const pr = p.presets().map(h => h.id + ':' + (h.never ? 'never' : sig(h.use / g)));
  console.log('  presets', pr.join(' '));
}
