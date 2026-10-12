const { P, D, g, surf, obj, rex, ollie, ctxOf } = require('./common.js');
const R = P.RESTRAINT.R;
const need = (dp, r) => P.threshold((E) => P.blastRadius(E, dp) >= r, 1, 1e20);
for (const near of [5, 10, 15]) {
  const ew = need(R.DP_WINDOWS, R.STREET), eh = need(R.DP_HOUSES, near), er = need(R.DP_RATTLE, near), eb = need(R.DP_HOUSES, R.BLOCK);
  console.log('near', near, 'kg TNT: rattle', (er/4.184e6).toPrecision(2), 'windows@15m', (ew/4.184e6).toPrecision(3), 'houses@near', (eh/4.184e6).toPrecision(3), 'block', (eb/4.184e6).toPrecision(3));
}
// Presets for each move at default settings
for (const [mv, o] of [['throw', { obj: obj('car'), angle: 45, target: 30 }], ['jump', { target: 3 }], ['stomp', {}], ['punch', { target: 10.4 }], ['clap', { target: 6 }]]) for (const F of [1e7, Infinity]) {
  const p = P.RESTRAINT.planNow(mv, ctxOf(F * g), Object.assign({ near: 5 }, o));
  console.log(mv, F, P.RESTRAINT.PRESETS.map((x) => { const r = p.result('preset:' + x.id); return x.id + ':' + (r.never ? 'never' : (r.use / g).toPrecision(3)); }).join(' '));
}
