const { P, D, g, S, O, ctx } = require('./common.js');
const T = (id) => D.tiers.find((t) => t.id === id);
const lgT = (id) => Math.log10(T(id).liftKg);
const rows = [];
const chk = (name, c) => {
  const pu = P.punch(c), cl = P.clap(c), j = P.jump(c), tb = P.throwObject(c, O('baseball'), 45), ts = P.throwObject(c, O('shot'), 45);
  console.log(name.padEnd(40), 'punch', pu.vFist.toFixed(3), '/', (17 * c.body.s).toFixed(2), ' clap', cl.vHand.toFixed(3), ' jump v', j.v.toFixed(3), '/', (12 * c.body.s).toFixed(2), 'apex', j.flight.apex.toFixed(2), ' ball', tb.v.toFixed(2), '/', (84.6 * c.body.s).toFixed(1), 'range', tb.flight && tb.flight.range.toFixed(1), ' shot', ts.v.toFixed(2));
};
chk('steel braced lg16', ctx({ mode: 'real', surface: 'steel', anchor: 'braced', lg: 16 }));
chk('steel braced lg20', ctx({ mode: 'real', surface: 'steel', anchor: 'braced', lg: 20 }));
for (const t of ['allstar', 'earth']) chk('granite braced ' + t, ctx({ mode: 'real', surface: 'granite', anchor: 'braced', lg: lgT(t) }));
chk('granite braced inf', ctx({ mode: 'real', surface: 'granite', anchor: 'braced', inf: true }));
chk('granite friction lg17', ctx({ mode: 'real', surface: 'granite', lg: 17 }));
chk('granite friction lg25', ctx({ mode: 'real', surface: 'granite', lg: 25 }));
chk('plush granite lg20', ctx({ mode: 'real', surface: 'granite', lg: 20, H: 0.4 }));
chk('plush steel braced lg20', ctx({ mode: 'real', surface: 'steel', anchor: 'braced', lg: 20, H: 0.4 }));
chk('plush steel braced inf', ctx({ mode: 'real', surface: 'steel', anchor: 'braced', inf: true, H: 0.4 }));
chk('kaiju granite bolted lg30', ctx({ mode: 'real', surface: 'granite', anchor: 'bolted', lg: 30, H: 50 }));
// exhaustive worst ratio scan
let worst = 0, where = '';
for (const sid of D.surfaces.map((s) => s.id)) for (const anchor of ['friction', 'braced', 'bolted']) for (const holds of [false, true]) for (const H of [0.4, 1, 2, 8, 50]) for (const lg of [2.708, 4, 8, 12, 14, 16, 17, 18, 20, 24, 28, 34, Infinity]) {
  const c = ctx({ mode: 'real', surface: sid, anchor, holds, H, lg: isFinite(lg) ? lg : 1, inf: !isFinite(lg) });
  const s = c.body.s;
  const L = [['punch', P.punch(c).vFist, 17 * s], ['clap', P.clap(c).vHand, 17 * s], ['jump', P.jump(c).v, 11.66 * s], ['stomp', P.stomp(c).vFoot, 16 * s]];
  for (const [nm, ob] of [['baseball', 'whip'], ['shot', 'push'], ['car', 'push']]) { const r = P.throwObject(c, O(nm), 45); if (r.canMove) L.push([nm, r.v, (ob === 'whip' ? 84.6 : 35) * s]); }
  for (const [nm, v, cap] of L) { if (!isFinite(v) || isNaN(v)) { console.log('NONFINITE', nm, sid, anchor, holds, H, lg, v); continue; } const r = v / cap; if (r > worst) { worst = r; where = [nm, sid, anchor, holds, H, lg, v].join(' '); } }
}
console.log('worst', worst, where);
