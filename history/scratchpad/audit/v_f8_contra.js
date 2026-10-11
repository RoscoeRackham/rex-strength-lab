const { P, D, g, ctx, obj } = require('./lib.js');
for (const [id, ang, lg] of [['shot', 80, 12], ['tank', 60, 14]]) {
  const c = ctx({ logKg: lg, surface: 'granite', groundHolds: true });
  const r = P.throwObject(c, obj(id), ang), f = r.flight;
  const flat = r.v * r.v / g;
  console.log(id, ang, '1e' + lg, 'v', r.v.toFixed(0), 'escaped', f.escaped, 'range', f.range.toExponential(3), '0.2*v^2/g', (0.2 * flat).toExponential(3),
    '=> verdict "leaves Earth for good" AND sentence "Without air it would have gone', Math.min(flat, 2e7) / 1e3, 'km":', f.escaped && f.range < 0.2 * flat);
}
// real mode reachability
for (const lg of [9, 10, 12, 15]) { const j = P.jump(ctx({ logKg: lg, surface: 'granite', groundHolds: true, mode: 'real' })); console.log('real jump 1e' + lg, j.v.toFixed(1)); }
