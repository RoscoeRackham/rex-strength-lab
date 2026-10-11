const { P } = require('./common.js');
// Reference: explicit RK4 with tiny steps (non-stiff cases), same model: F = F0 hill((vA+vB)/vmax), side i moves only if F > R_i or v_i > 0.
function ref(o) {
  const { F: F0, d, mA, mB, vmax } = o; const RA = o.RA ?? 0, RB = o.RB ?? 0, cA = o.cA || 0, cB = o.cB || 0, k = 0.25;
  const hill = (u) => u <= 0 ? 1 : u >= 1 ? 0 : (1 - u) / (1 + u / k);
  const acc = (vA, vB) => {
    const F = F0 * hill((vA + vB) / vmax);
    const aA = (isFinite(RA) && (vA > 0 || F > RA)) ? (F - RA - cA * vA * vA) / mA : 0;
    const aB = (isFinite(RB) && (vB > 0 || F > RB)) ? (F - RB - cB * vB * vB) / mB : 0;
    return [aA, aB];
  };
  let xA = 0, xB = 0, vA = 0, vB = 0, t = 0;
  const dt = o.dt;
  while (xA + xB < d) {
    const k1 = acc(vA, vB), k2 = acc(vA + 0.5 * dt * k1[0], vB + 0.5 * dt * k1[1]), k3 = acc(vA + 0.5 * dt * k2[0], vB + 0.5 * dt * k2[1]), k4 = acc(vA + dt * k3[0], vB + dt * k3[1]);
    const nvA = Math.max(0, vA + dt / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0])), nvB = Math.max(0, vB + dt / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]));
    xA += 0.5 * (vA + nvA) * dt; xB += 0.5 * (vB + nvB) * dt; vA = nvA; vB = nvB; t += dt;
    if (t > 100) break;
  }
  return { vA, vB, t };
}
const g = P.K.g;
const cases = [
  ['punch 511 bolted', { F: 0.3 * 511 * g, d: 0.7, mA: 176.04, mB: 3.96, RA: Infinity, RB: 0, vmax: 17, dt: 2e-6 }],
  ['punch 511 friction', { F: 0.3 * 511 * g, d: 0.7, mA: 176.04, mB: 3.96, RA: 1036, RB: 0, vmax: 17, dt: 2e-6 }],
  ['punch 1e5 friction', { F: 0.3 * 1e5 * g, d: 0.7, mA: 176.04, mB: 3.96, RA: 1036, RB: 0, vmax: 17, dt: 2e-8 }],
  ['jump 511 rigid', { F: 1.4 * 511 * g, d: 0.5, mA: 174.78, mB: 5.22, RA: 174.78 * g, RB: Infinity, vmax: 12, dt: 2e-6 }],
  ['jump 1e4 sand', { F: 1.4 * 1e4 * g, d: 0.5, mA: 174.78, mB: 5.22, RA: 174.78 * g, RB: 2232, cB: 144, vmax: 12, dt: 2e-7 }],
  ['jump 1e4.5 softclay', { F: 1.4 * Math.pow(10, 4.5) * g, d: 0.5, mA: 174.78, mB: 5.22, RA: 174.78 * g, RB: 11610, cB: 153, vmax: 12, dt: 1e-7 }],
  ['jump 1e5 concrete', { F: 1.4 * 1e5 * g, d: 0.5, mA: 174.78, mB: 5.22, RA: 174.78 * g, RB: 225000, cB: 216, vmax: 12, dt: 1e-7 }],
  ['shot 511', { F: 2580, d: 1.6, mA: 176.04, mB: 11.22, RA: Infinity, RB: 11.22 * g * Math.sin(37 * Math.PI / 180), vmax: 35, dt: 2e-6 }],
];
for (const [label, o] of cases) {
  const e = P.pushApart(Object.assign({ mode: 'real' }, o));
  const r = ref(o);
  console.log(label.padEnd(22), 'engine vA', e.vA.toFixed(4), 'vB', e.vB.toFixed(4), 't', e.t.toExponential(4), '| ref vA', r.vA.toFixed(4), 'vB', r.vB.toFixed(4), 't', r.t.toExponential(4));
}
