const { P, D, g, ctx, obj } = require('./n.js');
for (const lk of [9, 12, 15]) {
  const c = ctx({ logKg: lk });
  const r = P.throwObject(c, obj('car'), 45);
  const TNT = 4.184e6;
  console.log('logKg', lk, 'v', (r.v/1e3).toFixed(1), 'km/s', 'v/c', (r.v/P.K.c*100).toFixed(3)+'%', 'Eobj t TNT', (r.Eobj/TNT/1000).toPrecision(3), 'dragLoss t TNT', r.dragLoss && (r.dragLoss/TNT/1000).toPrecision(3), 'Eimpact kg TNT', (r.Eimpact/TNT).toPrecision(3), 'vImp', r.flight.vImpact.toFixed(1), 'recoilV', r.recoilV && (r.recoilV/1e3).toFixed(1));
  const M = P.RESTRAINT.MOVES.throw;
  console.log('  blast counted', M.blast(r, {}), ' drag-loss blastRadius 6.9kPa', P.blastRadius(r.dragLoss, 6900).toFixed(0), 'm; 26.8 kPa', P.blastRadius(r.dragLoss, 26800).toFixed(0), 'm; 100Pa', P.blastRadius(r.dragLoss, 100).toFixed(0));
  if (r.recoilV) { const Erec = 0.5 * c.body.m * r.recoilV ** 2; console.log('  recoil KE kt TNT', (Erec/TNT/1e6).toPrecision(3)); }
  const p = P.RESTRAINT.planNow('throw', c, { obj: obj('car'), angle: 45, target: 30, near: 5 });
  console.log('  presets', p.presets().map((x) => x.id + ':' + (x.never ? 'never' : (x.use/g).toPrecision(3))).join(' '));
}
