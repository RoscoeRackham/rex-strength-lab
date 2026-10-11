// Independent reference for pushApartHill in the strong limit.
const P = require('/home/user/dino-strength-sim/src/engine.js');
if (!global.window) global.window = {}; require("/home/user/dino-strength-sim/src/data.js"); const D = window.DINO_DATA;
const g = P.K.g, k = P.MUSCLE.k;
// (1) closed-form F0->inf limit, keeping external impulses
function limit(o) {
  const { d, mA, mB, vmax } = o; const RA = o.RA ?? 0, RB = o.RB ?? 0;
  const aF = isFinite(RA), bF = isFinite(RB);
  if (!aF && !bF) return { vA: 0, vB: 0 };
  if (!aF) return { vA: 0, vB: vmax };
  if (!bF) return { vA: vmax, vB: 0 };
  const M = mA + mB, T = d / vmax, vB0 = vmax * mA / M, net = RA - RB;
  let vB = vB0;
  if (net > 0) { const t1 = (vmax - vB0) * M / net; vB = t1 >= T ? vB0 + net * T / M : vmax; }
  else if (net < 0) { const t1 = vB0 * M / -net; vB = t1 >= T ? vB0 + net * T / M : 0; }
  return { vA: vmax - vB, vB };
}
// (2) brute-force: finite but huge F0, tiny fixed dt with sub-stepping, implicit-ish via small dt
function brute(o, F0) {
  const { d, mA, mB, vmax } = o; const RA = o.RA ?? 0, RB = o.RB ?? 0;
  const aF = isFinite(RA), bF = isFinite(RB);
  let xA = 0, xB = 0, vA = 0, vB = 0, t = 0;
  // stiff: relaxation time ~ m*vmax/F0; choose dt << that
  const tau = Math.min(mA, mB) * vmax / F0 / (1 + 1 / k);
  const T = d / vmax;
  const dt = Math.min(tau / 20, T / 2e5);
  while (xA + xB < d) {
    const u = (vA + vB) / vmax;
    const F = F0 * P.hill(u, k);
    let aA = 0, aB = 0;
    if (aF && (vA > 0 || F > RA)) aA = (F - RA) / mA;
    if (bF && (vB > 0 || F > RB)) aB = (F - RB) / mB;
    const nvA = Math.max(0, vA + aA * dt), nvB = Math.max(0, vB + aB * dt);
    xA += 0.5 * (vA + nvA) * dt; xB += 0.5 * (vB + nvB) * dt;
    vA = nvA; vB = nvB; t += dt;
    if (t > 100 * T) break;
  }
  return { vA, vB, t };
}
module.exports = { limit, brute };
if (require.main === module) {
  const body = P.makeBody({});
  const surf = (id) => D.surfaces.find(s => s.id === id);
  const jumpCase = (sid) => ({ d: body.strokes.leg, mA: body.m - body.feetMass, mB: body.feetMass, RA: (body.m - body.feetMass) * g, RB: surf(sid).qult * 2 * body.footArea, vmax: 30 });
  for (const sid of ['sand', 'clay', 'concrete', 'granite']) {
    const c = jumpCase(sid);
    const eng = P.pushApart(Object.assign({}, c, { F: 1.36e14 * g, mode: 'real' }));
    const lim = limit(c);
    const F0 = 1e3 * (c.RB + c.mA * 900 / 0.5);
    const br = brute(c, F0);
    console.log(sid.padEnd(9), 'engine sat vA', eng.vA.toFixed(4), '| limit vA', lim.vA.toFixed(4), '| brute(F0=' + F0.toExponential(1) + ') vA', br.vA.toFixed(4), 'vB', br.vB.toFixed(4));
  }
}
