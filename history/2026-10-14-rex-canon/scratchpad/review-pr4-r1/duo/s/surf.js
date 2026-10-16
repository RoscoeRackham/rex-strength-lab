const { P, D, g, rex, ollie, surf, ON, OFF, ctx, DIAL } = require('./env.js');
const need = (m) => P.W8.WALK_LOAD * m * g / P.MUSCLE.jump.forceFrac;
const lo = Math.max(need(rex.m), need(ollie.m));
console.log('lo kgf', lo / g);
for (const s of D.surfaces) for (const mode of ['comic', 'real']) {
  const cR = Object.assign(ctx(1, rex, ON), { F: lo, surface: s, mode }), cO = Object.assign(ctx(1, ollie, ON), { F: lo, surface: s, mode });
  const r = P.pushMatch(cR, cO);
  console.log(s.id.padEnd(10), mode, r.outcome, 'D', Math.round(r.DA), 'H', Math.round(r.HA), Math.round(r.HB), 'holdA', Math.round(r.holdA), r.vA && r.vA.toFixed(3));
}
