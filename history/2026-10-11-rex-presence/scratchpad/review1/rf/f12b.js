const { P, D, g, surf, obj, ctx } = require('./lib.js');
const per = obj('person');
const c = ctx();
const k = P.MUSCLE.k;
for (const kg of [3938.4, 406.4]) {
  const r = P.throwObject(Object.assign({}, c, { use: kg * g }), per, 45);
  const vmax = P.MUSCLE.throwPush.vmax * c.body.s;
  const mB = r.mB, RB = mB * g * Math.sin(Math.PI / 4), F0 = r.F, d = c.body.strokes.throw;
  let v = 0, x = 0, t = 0, dt = 1e-5; const lim = (tt) => P.PASSENGER.noHarm(tt);
  let tAbove15 = 0, tAbove2 = 0, peak = 0;
  while (x < d && t < 5) {
    const F = F0 * (v <= 0 ? 1 : v >= vmax ? 0 : (1 - v / vmax) / (1 + v / vmax / k));
    const a = (F - RB) / mB; const n = P.PASSENGER.felt(a / g, 45); peak = Math.max(peak, n);
    if (n > 1.5) tAbove15 += dt; if (n > 2) tAbove2 += dt;
    v += a * dt; x += v * dt; t += dt;
  }
  console.log('kg', kg, 'engine v', r.v.toFixed(2), 't', r.push.t.toFixed(3), 'my v', v.toFixed(2), 't', t.toFixed(3), 'peak felt', peak.toFixed(2), 'time >1.5 g', tAbove15.toFixed(3), 'time >2 g', tAbove2.toFixed(3), 'Hill k', k, 'vmax', vmax.toFixed(1));
}
// time-above-level check at the ceiling
{
  const kg = 406.4; const r = P.throwObject(Object.assign({}, c, { use: kg * g }), per, 45);
  const vmax = P.MUSCLE.throwPush.vmax * c.body.s, mB = r.mB, RB = mB * g * Math.sin(Math.PI / 4), F0 = r.F, d = c.body.strokes.throw;
  const ns = []; let v = 0, x = 0, dt = 1e-5;
  while (x < d) { const F = F0 * ((1 - v / vmax) / (1 + v / vmax / k)); const a = (F - RB) / mB; ns.push(P.PASSENGER.felt(a / g, 45)); v += a * dt; x += v * dt; }
  for (const n of [1.5, 1.6, 1.7, 1.75, 1.8]) { const tAbove = ns.filter((q) => q > n).length * dt; const allowed = n >= 2 ? 0.2 : n <= 1.5 ? Infinity : 0.2 + 0.3 * (2 - n) / 0.5; console.log('level', n, 'time above', tAbove.toFixed(3), 'allowed', allowed.toFixed(3), tAbove > allowed ? 'EXCEEDS' : 'ok'); }
}
