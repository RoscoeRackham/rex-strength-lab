global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const surface = D.surfaces.find((s) => s.id === 'concrete');
const st = (H, m) => {
  const body = P.makeBody({ H, m, build: 'rex' });
  const w = P.weight({ F: 1e5, body, surface, groundHolds: false, mode: 'comic', anchor: 'friction' });
  return { body, w };
};
const settle = P.settle || P._settle || (P.W8 && P.W8.settle);
console.log('exports with settle?', !!P.settle, Object.keys(P).filter(k => /settle|fall|W8|weight/i.test(k)));
for (const [H, m] of [[2, 7.416e16], [3.048, 1.0494e18], [3.048, 1e15], [3.048, 1e12]]) {
  const { body, w } = st(H, m);
  console.log('\nH', H, 'm', m, 'rho', body.rho.toExponential(3), 'settle central', w.settle && w.settle.years.toFixed(1), 'range', w.settleRange && [w.settleRange.yearsMin.toFixed(1), w.settleRange.yearsMax.toFixed(1)]);
  if (!P.settle || !w.settle) continue;
  let out = [];
  let lo = Infinity, hi = 0;
  for (const sigma of [0.1e9, 1.7e9, 4.1e9]) for (const k of [0.5, 1, 2]) for (const cs of [3200, 3500, 6000, 9000, 13700, null]) {
    const o = cs ? { sigma, k, cs } : { sigma, k, noDF: true };
    const y = P.settle(body, undefined, o).years;
    lo = Math.min(lo, y); hi = Math.max(hi, y);
    if (sigma === 1.7e9 && k === 1) out.push((cs || 'noDF') + ':' + y.toFixed(0));
  }
  console.log('  mid-rock k=1 by cs:', out.join(' '), '| corner extremes', lo.toFixed(1), hi.toFixed(1), (lo >= w.settleRange.yearsMin * 0.999 && hi <= w.settleRange.yearsMax * 1.001) ? 'INSIDE' : 'OUTSIDE');
}
