// Independent fine-step integration of the Hill leg push (continuum check of first microseconds)
const k = 0.25, vmax = 12, g = 9.80665;
const hill = (u) => u <= 0 ? 1 : u >= 1 ? 0 : (1 - u) / (1 + u / k);
const m = 180, mB = 0.029 * m, mA = m - mB, RA = mA * g;
function run(F0, RB, c, d = 0.5) {
  let vA = 0, vB = 0, xA = 0, xB = 0, t = 0, vBmax = 0, Fmax = 0, work = 0;
  // implicit step with bisection on S, dt adaptive: small while F changes fast
  while (xA + xB < d) {
    const dt = Math.min(2e-5, Math.max(1e-13, 0.002 * (mA * vmax) / Math.max(F0 * hill((vA + vB) / vmax), 1)));
    const step = (v, F, R, cc, mm) => { if (v <= 0 && F <= R) return 0; const b = v + dt * (F - R) / mm; if (b <= 0) return 0; const a = cc * dt / mm; return a > 0 ? 2 * b / (1 + Math.sqrt(1 + 4 * a * b)) : b; };
    let lo = 0, hi = vmax;
    for (let i = 0; i < 80; i++) { const S = (lo + hi) / 2; const F = F0 * hill(S / vmax); const s2 = step(vA, F, RA, 0, mA) + step(vB, F, RB, c, mB); if (s2 > S) lo = S; else hi = S; }
    const F = F0 * hill(lo / vmax);
    const nA = step(vA, F, RA, 0, mA), nB = step(vB, F, RB, c, mB);
    xA += 0.5 * (vA + nA) * dt; xB += 0.5 * (vB + nB) * dt; vA = nA; vB = nB; t += dt;
    vBmax = Math.max(vBmax, vB); Fmax = Math.max(Fmax, F);
    if (t > 1) break;
  }
  return { t, vA, vB, xA, xB, vBmax, Fmax };
}
const A2 = 0.09;
console.log('concrete Hulk', run(1.246e6, 2.25e5, 1.0 * 2400 * A2));
console.log('granite 1e8kg', run(1.373e9, 1.53e8, 1.0 * 2700 * A2));
console.log('granite 1e12kg', run(1.4 * 1e12 * g, 1.53e8, 1.0 * 2700 * A2));
console.log('granite 1e14kg', run(1.4 * 1.36e14 * g, 1.53e8, 1.0 * 2700 * A2));
