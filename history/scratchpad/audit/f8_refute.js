const { P, D, g, S, O, ctx } = require('./common');
const sand = S.sand, phi = 30 * Math.PI / 180, gam = sand.rho * g;
const KpR = Math.tan(Math.PI / 4 + phi / 2) ** 2;
function KpCoulomb(phi, del) { // vertical wall, level backfill
  const num = Math.cos(phi) ** 2;
  const den = Math.cos(del) * (1 - Math.sqrt(Math.sin(phi + del) * Math.sin(phi) / Math.cos(del))) ** 2;
  return num / den;
}
const KpC = KpCoulomb(phi, phi / 2);
console.log('Kp Rankine', KpR.toFixed(2), ' Kp Coulomb delta=phi/2', KpC.toFixed(2));
for (const H of [0.4, 2, 50]) {
  const b = P.makeBody({ H, m: 180 * (H / 2) ** 3 });
  const W = b.m * g;
  const a = P.anchorCapacity({ body: b, surface: sand, theta: 0, anchor: 'braced' });
  const B = 2 * Math.sqrt(b.footArea);           // two feet side by side
  const Deng = b.digArea / B;                     // depth implied if digArea is the bearing face
  console.log(`\nH=${H} m, m=${b.m.toFixed(1)} kg: engine braced R=${a.R.toFixed(0)} N (mu W=${(sand.mu*W).toFixed(0)}, dig=${(sand.shear*b.digArea).toFixed(0)}); width B=${B.toFixed(3)} m; engine-implied buried depth=${Deng.toFixed(3)} m`);
  for (const Dd of [0.1 * b.s, 0.2 * b.s, 0.3 * b.s, Deng]) {
    const base = 0.5 * gam * Dd * Dd * B;
    const lo = base * KpR, hi = base * KpC * 2;   // hi: wall friction + 3D end effects ~2x
    const totLo = sand.mu * W + lo, totHi = sand.mu * W + hi;
    console.log(`  D=${Dd.toFixed(3)} m: passive ${lo.toFixed(0)}..${hi.toFixed(0)} N; anchor ${totLo.toFixed(0)}..${totHi.toFixed(0)} N; engine/real ${(a.R/totHi).toFixed(2)}..${(a.R/totLo).toFixed(2)}x`);
  }
}
// Headline verdicts on braced sand at default size: pulls and sprint
const c = ctx(511, { surface: 'sand', anchor: 'braced' });
for (const k of ['car', 'bus', 'tank', 'b747']) { const r = P.pull(c, O[k]); console.log('pull', k, 'resist', r.resist.toFixed(0), 'usable', r.usable.toFixed(0), 'canMove', r.canMove); }
for (const kg of [511, 1e4, 1e9]) { const s = P.sprint(ctx(kg, { surface: 'sand', anchor: 'braced' })); console.log('sprint', kg, 'kg: thrust', s.thrust.toFixed(0), 'vTop', s.vTop.toFixed(1), s.topLimit, 'accelG', s.accelG.toFixed(2)); }
