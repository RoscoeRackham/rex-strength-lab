const { P, D, g, surf, obj, ctx } = require('./lib.js');
const per = obj('person'); const c = ctx(); const k = P.MUSCLE.k; const L = P.PASSENGER;
// inverse of the limit curves: allowed duration at level n
const allowedRide = (n) => n <= 1.5 ? Infinity : n >= 2 ? 0.2 : 0.2 + 0.3 * (2 - n) / 0.5;
const allowedEib = (n) => { // Eiband table: duration where injury(t) == n (decreasing with t)
  let lo = 1e-4, hi = 100; if (L.injury(hi) >= n) return Infinity; if (L.injury(lo) < n) return 0;
  for (let i = 0; i < 80; i++) { const m = Math.sqrt(lo * hi); if (L.injury(m) >= n) lo = m; else hi = m; } return lo; };
let prev = null;
for (let i = 0; i <= 300; i++) {
  const kg = 100 * Math.pow(c.F / g / 100, i / 300);
  const r = P.throwObject(Object.assign({}, c, { use: kg * g }), per, 45);
  if (!r.canMove) continue;
  const nMean = L.felt(r.launchG, 45);
  const vMean = nMean > L.injury(r.launchT) ? 'injury' : nMean > L.noHarm(r.launchT) ? 'ride' : 'ok';
  let vProf = vMean;
  if (r.basis === 'real') {
    const vmax = P.MUSCLE.throwPush.vmax * c.body.s, mB = r.mB, RB = mB * g * Math.sin(Math.PI / 4), F0 = r.F, d = c.body.strokes.throw;
    const ns = []; let v = 0, x = 0, dt = r.push.t / 20000;
    while (x < d) { const F = F0 * ((1 - v / vmax) / (1 + v / vmax / k)); const a = (F - RB) / mB; ns.push(L.felt(a / g, 45)); v += a * dt; x += v * dt; }
    const levels = []; for (let n = 1.01; n < Math.max(...ns); n *= 1.02) levels.push(n);
    const over = (allowed) => levels.some((n) => ns.filter((q) => q > n).length * dt > allowed(n));
    vProf = over(allowedEib) ? 'injury' : over(allowedRide) ? 'ride' : 'ok';
  }
  const key = (r.basis || 'comic') + ' mean:' + vMean + ' profile:' + vProf;
  if (key !== prev) { console.log(kg.toFixed(0), 'kg', key, 'meanFelt', nMean.toFixed(2), 't', r.launchT.toFixed(3)); prev = key; }
}
