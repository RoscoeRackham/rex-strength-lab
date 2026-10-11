// Independent recomputation of the contest design's test values (no project code used).
const g = 9.80665, c = 299792458, G = 6.67430e-11, rho0 = 1.225;
const f = (x, n = 6) => (typeof x !== 'number' ? String(x) : !isFinite(x) ? String(x) : (Math.abs(x) >= 1e6 || (Math.abs(x) < 1e-3 && x !== 0)) ? x.toExponential(n - 1) : String(+x.toPrecision(n)));
const log = (...a) => console.log(...a.map((x) => (typeof x === 'number' ? f(x) : x)));
const HULK = 100 * 907.18474 * g, HUMAN = 511 * g;
const share = 0.11, lever = 0.19, effM = 0.022 * Math.pow(0.827 * 0.1525 / 0.19, 2);
log('calibration share', 92 / 0.48 / (0.19 * 1.7562 * HUMAN), 'effMass', effM, 'holdArm', 0.022 * 0.682 * 0.1525 / 0.19);
// friction footing
const R = (m, mu) => mu * m * g;
// comic pin (relativistic constant force)
function pinComic(dA, M, s) {
  const t = (M * c / dA) * Math.sqrt(Math.pow(1 + dA * s / (M * c * c), 2) - 1);
  const p = dA * t, v = p / Math.sqrt(M * M + p * p / (c * c));
  return { t, v, E: dA * s, tNewton: Math.sqrt(2 * s * M / dA) };
}
// real pin: winner force P*Hill(v/vmax) capped at Fcap, loser resists Al; mass M; RK4 small steps
function hill(u, k = 0.25) { if (u <= 0) return 1; if (u >= 1) return 0; return (1 - u) / (1 + u / k); }
function pinReal(P, Fcap, Al, M, s, vmax) {
  let x = 0, v = 0, t = 0; const dt = 1e-7;
  const a = (vv) => (Math.min(Fcap, P * hill(vv / vmax)) - Al) / M;
  while (x < s) {
    const k1 = a(v), k2 = a(v + 0.5 * dt * k1), k3 = a(v + 0.5 * dt * k2), k4 = a(v + dt * k3);
    const nv = v + dt / 6 * (k1 + 2 * k2 + 2 * k3 + k4);
    x += 0.5 * (v + nv) * dt; v = nv; t += dt;
    if (t > 100) break;
  }
  return { t, v, E: 0.5 * M * v * v, vt: vmax * (1 - Al / P) / (1 + (Al / P) / 0.25) };
}
const s2 = (Math.PI / 2) * 0.19 * 2, M2 = effM * 360;
log('--- AW');
log('AW-1 P', share * HULK, 'R', R(180, 0.6), 'torque', R(180, 0.6) * 0.38, 'ratio', R(180, 0.6) * 0.38 / 190);
log('AW-2 R braced', R(180, 0.6) + 1.5e6 * 0.2, 'torque', share * HULK * 0.38);
const Ah = share * HUMAN, dA3 = share * HULK - Ah;
log('AW-3 Ah', Ah, 'dA', dA3, 'M', M2, 's', s2, pinComic(dA3, M2, s2), 'TNT g', dA3 * s2 / 4.184e6 * 1000);
const sT = 2 / 1.7562; log('slamCap', 102 * sT ** 3, 'slamRatio AW-3', dA3 * s2 / (102 * sT ** 3), 'elbowCap', 10e3 * sT * sT);
const r3 = pinReal(share * HULK, Infinity, Ah, M2, s2, 17); log('AW-3r', r3, 'slamRatio', r3.E / (102 * sT ** 3));
const dA4 = R(180, 0.6) - Ah; log('AW-4 dA', dA4, pinComic(dA4, M2, s2));
const r4 = pinReal(Infinity, R(180, 0.6), Ah, M2, s2, 17); log('AW-4 real', r4);
log('AW-6 comic t', s2 / c);
const r6 = pinReal(1e12, Infinity, share * HULK, M2, s2, 17); log('AW-6 real (F=1e12 proxy)', r6, 'tearB', share * HULK / 3e5);
log('AW-7 R ice', R(180, 0.1));
log('AW-8 torque', Ah * 0.38, 'human lever', Ah * 0.19 * 1.7562);
const dA9 = Ah / 2; log('AW-9 comic', pinComic(dA9, M2, s2), 'slamRatio', dA9 * s2 / (102 * sT ** 3));
const r9 = pinReal(Ah, Infinity, Ah / 2, M2, s2, 17); log('AW-9 real', r9, 'slamRatio', r9.E / (102 * sT ** 3));
// AW-10 neutron density
const mNS = 4e17 * 0.18, rEq = Math.cbrt(3 * 0.18 / (4 * Math.PI));
const dT = 0.660 * sT + 0.25 * 2;
log('AW-10 armHold', 0.022 * 0.682 * 0.1525 / 0.19 * mNS * g, 'elbowLoad', 0.036 * mNS * g, 'ratio', 0.036 * mNS * g / (10e3 * sT * sT), 'dT', dT, 'Fg', G * mNS * mNS / dT ** 2);
// fall together: analytic and numerical
function fallAnalytic(m1, m2, d0, d1) { const mu = G * (m1 + m2), x = d1 / d0; return { t: Math.sqrt(d0 ** 3 / (2 * mu)) * (Math.sqrt(x * (1 - x)) + Math.acos(Math.sqrt(x))), v: Math.sqrt(2 * mu * (1 / d1 - 1 / d0)), E: G * m1 * m2 * (1 / d1 - 1 / d0) }; }
function fallNumeric(m1, m2, d0, d1) { const mu = G * (m1 + m2); let d = d0, v = 0, t = 0; const dt = 1e-9; while (d > d1) { const a = mu / (d * d); v += a * dt; d -= v * dt; t += dt; } return { t, v }; }
log('AW-10 fall analytic', fallAnalytic(mNS, mNS, dT, 2 * rEq), 'numeric', fallNumeric(mNS, mNS, dT, 2 * rEq));
log('AW-12 plush R', R(5.4, 0.6));
log('--- W');
// W-1 shove both comic: comicFrac from engine design 0.1682 (engine-calibrated). Here independent with value given.
function shove(F, mAbody, mBbody, RA, RB, armFrac, d) {
  const arm = 2 * armFrac * mAbody, mA = mAbody - arm, mB = mBbody + arm;
  const aA = Math.max(0, F - RA) / mA, aB = Math.max(0, F - RB) / mB;
  const t = Math.sqrt(2 * d / (aA + aB));
  const pA = mA * aA * t, pB = mB * aB * t;
  const pB2 = pB * mBbody / mB, pA2 = Math.max(0, pA - pB * arm / mB);
  return { t, vA: pA2 / mAbody, vB: pB2 / mBbody, xA: 0.5 * aA * t * t, xB: 0.5 * aB * t * t };
}
const slide = (m, v, Rf) => { const k = 0.5 * rho0 * 1.0 * 0.8; return m / (2 * k) * Math.log1p(k * v * v / Rf); };
const cf = 0.16818; const Fs = 2 * cf * HULK;
const sh1 = shove(Fs, 180, 180, 0.6 * (180 - 2 * 0.022 * 180) * g, R(180, 0.6), 0.022, 1.6);
log('W-1 Fs', Fs, sh1, 'slideB', slide(180, sh1.vB, R(180, 0.6)), 'slideA', slide(180, sh1.vA, R(180, 0.6)));
const wo = (net, M, x, vcap) => { const a = net / M, vf = Math.sqrt(2 * a * x); return vf <= vcap ? { a, t: Math.sqrt(2 * x / a), v: vf } : { a, t: vcap / a + (x - vcap * vcap / (2 * a)) / vcap, v: vcap }; };
log('W-2', 'drive', R(180, 0.6) + 0.25 * 3e5, 'comic', wo(75000, 360, 2.275, 205.4), 'real', wo(75000, 360, 2.275, 17.9));
log('W-3', wo(R(360, 0.6) - R(180, 0.6), 540, 2.275, 65.7));
log('W-4 tear concrete', HULK / 3e5, 'granite', HULK / 7.2e6);
log('W-7', wo(R(180, 0.6) - 100 * g, 360, 2.275, 46), 'Rex 100kg can stand? 1.4F >= W', 1.4 * 100 * g >= 180 * g, 'walk 1.4F>=1.2W', 1.4 * 100 * g >= 1.2 * 180 * g);
const sh5 = shove(Fs, 180, 1e300, 0.6 * (180 - 7.92) * g, Infinity, 0.022, 1.6);
{ const arm = 7.92, mA = 180 - arm; const aA = (Fs - 0.6 * mA * g) / mA; const t = Math.sqrt(2 * 1.6 / aA); const pA = mA * aA * t; log('SH-5 recoil', pA / 180, 'slide', slide(180, pA / 180, R(180, 0.6))); }
log('SH-4r slide at 35 m/s', slide(180, 35, R(180, 0.6)));
log('SH-6 Fg', G * 180 * mNS / (2 * rEq) ** 2, 'xWeight', G * 180 * mNS / (2 * rEq) ** 2 / (180 * g));
log('--- L');
log('L-1 need', 180 * g, 'margin', HULK / (180 * g), 'pressure', 360 * g / 0.09, 'ratio', 360 * g / 0.09 / 2.5e6);
log('L-2 need', 180 * g + 3e5, 'margin', HULK / (180 * g + 3e5));
const FgOver = G * mNS * mNS / 1.5 ** 2; log('L-5 FgOver', FgOver, 'need', FgOver + mNS * g, 'weight share %', 100 * mNS * g / (FgOver + mNS * g), 'margin1e23', 1e23 * g / (FgOver + mNS * g), 'margin1e22', 1e22 * g / (FgOver + mNS * g));
// peak vertical component of mutual pull along a lift path that rises beside the lifter at horizontal offset x
for (const x of [2 * rEq, 0.5, 0.6]) { let best = 0, yb = 0; for (let y = 0; y <= 2; y += 1e-4) { const F = G * mNS * mNS * y / Math.pow(x * x + y * y, 1.5); if (F > best) { best = F; yb = y; } } log('lift path x', x, 'peak vertical pull', best, 'at y', yb, 'x FgOver', best / FgOver); }
log('--- T-5');
const L = Math.cbrt(6 * 0.18 / Math.PI); log('L', L, 'Newton depth', L * 4e17 / 2400, 'vEsc pair', Math.sqrt(2 * G * (mNS + 180) / 1.5), 'vEsc from Rex alone', Math.sqrt(2 * G * 180 / 1.5));
log('--- G');
const dc = 2 * rEq; const F1 = G * 180 * 180 / dc ** 2, F2 = G * mNS * mNS / dc ** 2;
log('G-1', F1, 'mg', F1 / g * 1e6, 'G-2', F2, 'xW', F2 / (mNS * g), 'vEsc', Math.sqrt(2 * G * 2 * mNS / dc), 'kg', F2 / g, 'BH rho', 3 * c * c / (8 * Math.PI * G * rEq * rEq), 'GM/rc2', G * mNS / (rEq * c * c));
