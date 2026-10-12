const { P, D, g, surf, obj, rex, ctxOf } = require('./lib.js');
const TNT = P.K.TNT_J_per_kg;
const need = (dp, d) => { let lo = 1e-6, hi = 1e9; for (let i = 0; i < 200; i++) { const m = Math.sqrt(lo * hi); if (P.blastRadius(m * TNT, dp) >= d) hi = m; else lo = m; } return hi; };
console.log('houses 26.8kPa@5m kg TNT', need(26800, 5).toFixed(3), 'windows 6.9kPa@15m', need(6900, 15).toFixed(3), 'block 26.8@100', need(26800, 100).toFixed(1), 'rattle 36Pa@5', need(36, 5).toExponential(2), 'harm 100Pa@5', need(100, 5).toExponential(2));
for (const mv of ['punch', 'clap']) {
  const c = ctxOf(1e7);
  const p = P.RESTRAINT.planNow(mv, c, { target: mv === 'punch' ? 10.4 : 6, near: 5 });
  console.log(mv, p.presets().map(x => x.id + ':' + (x.never ? 'never' : (x.use / g).toPrecision(3))).join(' '));
}
// positive phase duration for ~1 kg TNT at 5 m: Kinney-Graham td/W^(1/3) (ms/kg^(1/3))
const Z = 5 / Math.cbrt(0.865);
const td = 980 * (1 + Math.pow(Z / 0.54, 10)) / ((1 + Math.pow(Z / 0.02, 3)) * (1 + Math.pow(Z / 0.74, 6)) * Math.sqrt(1 + Math.pow(Z / 6.9, 2)));
console.log('Z', Z.toFixed(2), 'Kinney-Graham td ms', (td * Math.cbrt(0.865)).toFixed(2));
// impulse at 5 m: Kinney-Graham I/A
const I = 0.067 * Math.sqrt(1 + Math.pow(Z / 0.23, 4)) / (Z * Z * Math.cbrt(1 + Math.pow(Z / 1.55, 3)));
console.log('impulse Pa*s', (I * 1e5 * Math.cbrt(0.865) / 1000).toFixed(1), '(bar-ms/kg^1/3 scaled)', I.toFixed(4));
