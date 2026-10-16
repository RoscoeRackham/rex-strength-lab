const { P, mk, ol, g } = require('./common.js');
for (const kg of [3600, 3700, 3800, 5470, 5500]) { const r = P.standoff(ol({ F: kg * g }), mk()); const dv = r.drive; console.log('standoff', kg, r.outcome, dv && JSON.stringify({ d: dv.d, vB: dv.vB, slideB: dv.slideB, total: dv.d + dv.slideB })); }
for (const kg of [7300, 7400, 7500, 9060]) { const r = P.pushMatch(mk({ F: kg * g }), ol({ F: kg * g })); console.log('pushMatch', kg, r.outcome, 'vA', r.vA.toFixed(3), 'slideA', r.slideA.toFixed(3), 'during', (r.vA * r.t / 2).toFixed(3), 'total', (r.vA * r.t / 2 + r.slideA).toFixed(3)); }
const c = P.collide(ol(), mk(), { source: 'sprint' }); console.log('collide', c.outcome, JSON.stringify(c.after && c.after.splat));
// shove tab
const s = P.shove(mk({ F: 3000 * g }), ol({ F: 3000 * g })); console.log('shove 3000', s.vB, s.slideB, s.d);
