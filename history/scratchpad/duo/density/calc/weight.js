// Prototype of the proposed engine additions for the "Weight" tab (density, self-gravity,
// ground under his own weight, falling through the planet). Mirrors the design document.
global.window = global.window || {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
const K = P.K;

const W = {
  G: 6.6743e-11,                 // CODATA 2022
  M_E: 5.9722e24,                // NASA Earth fact sheet
  OMEGA_E: 2 * Math.PI / (23.9345 * 3600), // sidereal rotation (NASA Earth fact sheet)
  SIGMA_ROCK: 1.7e9,             // granite ultimate bearing (project estimate) used for all solid rock
  RHO_ROCK: 2700,                // granite
  R_AIR: 287.0528,               // J/(kg K)
  NQ: { sand: 18.40, gravel: 64.19 }, // USACE EM 1110-1-1905 Table 4-4 (phi 30, 40 deg)
  WALK_LOAD: 1.2,                // peak vertical force in walking, x body weight (1.0-1.5, Nilsson & Thorstensson 1989)
  LEG_SHARE: 1.4,                // legs push 1.4 x the dial's force (the jump's real-muscle share)
  JEANS: 6,                      // keeps a gas if v_esc > 6 v_rms (Carroll & Ostlie, via SFU PHYS 390)
  E_NEUTRON_MATTER: 16.3 * 1.602176634e-13 / 1.67492750e-27, // J/kg, Hebeler et al. 2010
  P_NEUTRON_MATTER: [1.4 * 1.602176634e32, 2.1 * 1.602176634e32], // Pa, Hebeler et al. 2010
};
W.V_RMS_AIR = Math.sqrt(3 * W.R_AIR * K.T0);

// ---------------------------------------------------------------- PREM (Dziewonski & Anderson 1981)
const RE = K.R_E;
const PREM = [ // rTop (m), a0..a3 (g/cm3, polynomial in x = r/6371 km), solid
  [1221.5e3, [13.0885, 0, -8.8381, 0], true],
  [3480.0e3, [12.5815, -1.2638, -3.6426, -5.5281], false],
  [5701.0e3, [7.9565, -6.4761, 5.5283, -3.0807], true],
  [5771.0e3, [5.3197, -1.4836, 0, 0], true],
  [5971.0e3, [11.2494, -8.0298, 0, 0], true],
  [6151.0e3, [7.1089, -3.8045, 0, 0], true],
  [6346.6e3, [2.6910, 0.6924, 0, 0], true],
  [6356.0e3, [2.900, 0, 0, 0], true],
  [6371.0e3, [2.600, 0, 0, 0], true], // PREM's 3 km ocean replaced by upper crust: Rex starts on land
];
function premLayer(r) { for (let i = 0; i < PREM.length; i++) if (r <= PREM[i][0]) return i; return -1; }
function premRho(r) {
  const i = premLayer(r); if (i < 0) return 0;
  const a = PREM[i][1], x = r / RE;
  return 1000 * (a[0] + x * (a[1] + x * (a[2] + x * a[3])));
}
function premSolid(r) { const i = premLayer(r); return i >= 0 && PREM[i][2]; }
// closed-form mass inside r: integral of 4 pi r^2 sum a_k (r/RE)^k dr
function shellMass(a, r1, r2) {
  let m = 0;
  for (let k = 0; k < 4; k++) if (a[k]) m += 1000 * a[k] / Math.pow(RE, k) * (Math.pow(r2, k + 3) - Math.pow(r1, k + 3)) / (k + 3);
  return 4 * Math.PI * m;
}
const PREM_CUM = []; { let acc = 0, lo = 0; for (const [top, a] of PREM) { PREM_CUM.push(acc); acc += shellMass(a, lo, top); lo = top; } PREM_CUM.push(acc); }
const PREM_MTOT = PREM_CUM[PREM_CUM.length - 1];
function premMassFrac(r) {
  if (r >= RE) return 1;
  const i = premLayer(r); const lo = i ? PREM[i - 1][0] : 0;
  return (PREM_CUM[i] + shellMass(PREM[i][1], lo, r)) / PREM_MTOT;
}
function premG(r) { if (r <= 0) return 0; return K.GM * premMassFrac(Math.min(r, RE)) / (r * r); }
// potential table (1 km steps), Phi(r) - Phi(RE); Phi(RE) = -GM/RE
const PHI_N = 6371, PHI = new Float64Array(PHI_N + 1);
let PHI0 = null; const premPhi0 = () => { if (PHI0 == null) { const rb = PREM[0][0], f = rb / RE * PHI_N, i = Math.floor(f), t = f - i; PHI0 = PHI[i] * (1 - t) + PHI[i + 1] * t - PHI_IC(rb); } return PHI0; };
{ PHI[PHI_N] = 0; const dr = RE / PHI_N; for (let i = PHI_N - 1; i >= 0; i--) { const ra = i * dr, rb = (i + 1) * dr, rm = 0.5 * (ra + rb); PHI[i] = PHI[i + 1] - dr / 6 * (premG(ra) + 4 * premG(rm) + premG(rb)); } }
const IC = PREM[0][1], GSCALE = K.GM / (W.G * PREM_MTOT);   // scale PREM to the engine's GM
const PHI_IC = (r) => 4 * Math.PI * W.G * GSCALE * 1000 * (IC[0] * r * r / 6 + IC[2] * r * r * r * r / (20 * RE * RE));
function premPhi(r) { // relative to the surface (0 at RE, negative inside)
  if (r >= RE) return K.GM / RE - K.GM / r;
  if (r <= PREM[0][0]) return premPhi0() + PHI_IC(r);
  const f = r / RE * PHI_N, i = Math.min(PHI_N - 1, Math.floor(f)), t = f - i;
  return PHI[i] * (1 - t) + PHI[i + 1] * t;
}

// ---------------------------------------------------------------- body & self-gravity
function eqRadius(V) { return Math.cbrt(3 * V / (4 * Math.PI)); }
function blackHoleDensity(H) { const R = eqRadius(P.bodyVolume(H)); return 3 * K.c * K.c / (8 * Math.PI * W.G * R * R); }
function selfGravity(body) {
  const m = body.m, R = eqRadius(body.volume), GM = W.G * m;
  const rs = 2 * GM / (K.c * K.c);
  const vEsc = Math.min(K.c, Math.sqrt(2 * GM / R));
  const dBeat = Math.sqrt(GM / K.g);
  const rB = GM / (K.a0 * K.a0);
  const bondi = 2 * Math.PI * GM * GM * K.rho0 / Math.pow(K.a0, 3); // kg/s, Bondi interpolation at rest
  const heatPerKg = GM / R;
  return {
    GM, R, rs, compact: rs / R, blackHole: rs >= R, buchdahl: rs >= (8 / 9) * R,
    gSurf: GM / (R * R), vEsc, dBeat, beatsOutside: dBeat > R,
    rBondi: rB, bondiOutside: rB > R, bondiRate: rB > R ? bondi : 0, heatPerKg, infallPower: rB > R ? bondi * heatPerKg : 0,
    infallT: P.stagnationT(vEsc),
    holdsAir: vEsc > W.JEANS * W.V_RMS_AIR,
    rCrush: W.RHO_ROCK * GM / W.SIGMA_ROCK, rCrushUnconfined: W.RHO_ROCK * GM / 200e6,
    tidal: (d, L) => GM * (1 / Math.pow(d - L / 2, 2) - 1 / Math.pow(d + L / 2, 2)),
    // distance at which a 1.8 m person is stretched by 1 g head to toe (bisection)
    tidal1g: (() => { const L = 1.8; const f = (d) => GM * (1 / Math.pow(d - L / 2, 2) - 1 / Math.pow(d + L / 2, 2)) - K.g; let lo = R + L / 2, hi = 1e12; if (f(lo) < 0) return 0; for (let i = 0; i < 300; i++) { const mid = Math.sqrt(lo * hi); if (f(mid) > 0) lo = mid; else hi = mid; } return lo; })(),
    decompJ: m * W.E_NEUTRON_MATTER,
  };
}
// time and speed for a small object falling from rest at d0 onto him (radius R), his pull only
function infall(GM, R, d0) {
  if (!(d0 > R)) return { t: 0, v: 0 };
  const x = R / d0;
  const t = Math.sqrt(d0 * d0 * d0 / (2 * GM)) * (Math.sqrt(x * (1 - x)) + Math.acos(Math.sqrt(x)));
  return { t, v: Math.sqrt(2 * GM * (1 / R - 1 / d0)) };
}

// ---------------------------------------------------------------- moving his own weight
function moveCheck(F, m) {
  const Wt = m * K.g, leg = W.LEG_SHARE * F;
  return { weight: Wt, legForce: leg, stand: leg >= Wt, walk: leg >= W.WALK_LOAD * Wt, run: F > Wt,
    standNeedKg: Wt / W.LEG_SHARE / K.g, walkNeedKg: W.WALK_LOAD * Wt / W.LEG_SHARE / K.g, runNeedKg: m };
}

// ---------------------------------------------------------------- ground under his weight
function groundUnderWeight(body, surface, groundHolds) {
  const m = body.m, Wt = m * K.g;
  const Af = 2 * body.footArea, Ab = body.topArea, Lleg = 0.45 * body.H;
  const p1 = Wt / Af, p2 = Wt / Ab;
  const q0f = P.qultFor(surface, body.footB);
  const out = { weight: Wt, footPressure: p1, bodyPressure: p2, q0: q0f, standRatio: p1 / q0f,
    rockRatio: Wt / (W.SIGMA_ROCK * Ab), sink: 0, legLength: Lleg };
  if (groundHolds) return Object.assign(out, { regime: 'comic', standRatio: 0 });
  if (Wt > W.SIGMA_ROCK * Ab) return Object.assign(out, { regime: 'fallsThrough' });
  if (p1 <= q0f) return Object.assign(out, { regime: 'stands' });
  const id = surface.id;
  const soil = { sand: W.NQ.sand, gravel: W.NQ.gravel, softclay: 1, stiffclay: 1 }[id];
  if (soil) {
    // bearing grows with depth: + gamma D Nq (sand, gravel) or + gamma D (clay, overburden only)
    const gN = (surface.rho || 1800) * K.g * soil;
    const D1 = (p1 - q0f) / gN;                       // feet only
    if (D1 <= Lleg) return Object.assign(out, { regime: 'sinks', sink: D1, stage: 'feet' });
    const q0b = P.qultFor(surface, Math.sqrt(Ab));    // his whole underside, once his legs are in
    const D2 = Math.max(Lleg, (p2 - q0b) / gN);
    if (D2 <= body.H) return Object.assign(out, { regime: 'sinks', sink: D2, stage: 'body' });
    return Object.assign(out, { regime: 'outOfSight', sink: D2, stage: 'body' });
  }
  if (id === 'granite') return Object.assign(out, { regime: 'sinks', sink: Lleg, stage: 'rock' });
  return Object.assign(out, { regime: 'punchesThrough', layer: id });   // asphalt, slab, ice, steel deck
}

// ---------------------------------------------------------------- falling through the planet
// 3-D, inertial frame, Earth spins about z. Resistance relative to the rock: A (sigma + rho v^2),
// sigma = SIGMA_ROCK in solid layers, 0 in the liquid outer core; Archimedes buoyancy rho V g.
function fallThrough(body, o) {
  const opt = o || {};
  const m = body.m, A = body.topArea, V = body.volume, kP = K.PONCELET_K;
  const lat = (opt.latDeg || 0) * Math.PI / 180, Om = W.OMEGA_E;
  const tMax = opt.tMax || 4 * 3600;
  let x = RE * Math.cos(lat), y = 0, z = RE * Math.sin(lat);
  let vx = 0, vy = Om * RE * Math.cos(lat), vz = 0;
  const acc = (s) => {
    const [px, py, pz, ux, uy, uz] = s;
    const r = Math.hypot(px, py, pz);
    const g = premG(r);
    let ax = -g * px / r, ay = -g * py / r, az = -g * pz / r;
    if (r < RE) {
      const rho = premRho(r);
      const b = opt.noDrag ? 0 : rho * V / m * g; ax += b * px / r; ay += b * py / r; az += b * pz / r;
      const rx = ux + Om * py, ry = uy - Om * px, rz = uz;   // v - Omega x r
      const vr = Math.hypot(rx, ry, rz);
      if (vr > 0 && !opt.noDrag) {
        const f = A * kP * rho * vr / m;               // inertial (rho v^2) term only
        ax -= f * rx; ay -= f * ry; az -= f * rz;
      }
    }
    return [ux, uy, uz, ax, ay, az];
  };
  let s = [x, y, z, vx, vy, vz], t = 0;
  let minR = RE, minRt = 0, firstTurn = null, prevVr = -1, maxV = 0, stuck = null, steps = 0;
  const vRad = (s) => (s[0] * s[3] + s[1] * s[4] + s[2] * s[5]) / Math.hypot(s[0], s[1], s[2]);
  while (t < tMax && steps < 2e6) {
    const r = Math.hypot(s[0], s[1], s[2]);
    const v = Math.hypot(s[3], s[4], s[5]);
    const vrelNow = Math.hypot(s[3] + Om * s[1], s[4] - Om * s[0], s[5]);
    const dt = Math.min(opt.dtMax || ((vrelNow > 100 || RE - r < 20e3) ? 1 : 10), Math.max(1e-3, 0.002 * r / Math.max(v, 1)));
    const k1 = acc(s), s2 = s.map((q, i) => q + 0.5 * dt * k1[i]);
    const k2 = acc(s2), s3 = s.map((q, i) => q + 0.5 * dt * k2[i]);
    const k3 = acc(s3), s4 = s.map((q, i) => q + dt * k3[i]);
    const k4 = acc(s4);
    const ns = s.map((q, i) => q + dt / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
    t += dt; steps++;
    // rock strength: a friction impulse of at most sigma A dt / m against the motion relative
    // to the rock, never reversing it (operator splitting keeps stick-slip stable at any step)
    const nr = Math.hypot(ns[0], ns[1], ns[2]);
    if (nr < RE && premSolid(nr) && !opt.noDrag) {
      const rel = [ns[3] + Om * ns[1], ns[4] - Om * ns[0], ns[5]];
      const vrel = Math.hypot(rel[0], rel[1], rel[2]);
      const dv = W.SIGMA_ROCK * A * dt / m;
      const k = vrel > dv ? (vrel - dv) / vrel : 0;
      ns[3] = Om * -ns[1] + rel[0] * k; ns[4] = Om * ns[0] + rel[1] * k; ns[5] = rel[2] * k;
      if (k === 0) {
        // at rest in the rock: stuck for good if the strength can hold his weight here
        const g = premG(nr), rho = premRho(nr);
        const net = Math.abs(m - rho * V) * g;                // weight minus buoyancy (rotation negligible)
        if (net <= W.SIGMA_ROCK * A) { stuck = { t, r: nr }; s = ns; break; }
      }
    }
    if (nr < minR) { minR = nr; minRt = t; }
    const vr = vRad(ns);
    if (firstTurn == null && prevVr < 0 && vr >= 0 && t > 10) firstTurn = { t, r: nr, kind: 'innermost' };
    if (firstTurn && firstTurn.kind === 'innermost' && !firstTurn.out && vr <= 0 && prevVr > 0) {
      // first outer turning point: where on the far side, relative to the antipode on the spinning Earth
      const ang = Om * t;                                   // Earth has turned this much
      let lon = (Math.atan2(ns[1], ns[0]) - ang) * 180 / Math.PI; // Earth-fixed longitude, start at 0
      let dLon = ((lon - 180) % 360 + 540) % 360 - 180;     // from the antipode, + east / - west
      const latOut = Math.asin(ns[2] / nr) * 180 / Math.PI;
      const rTop = Math.hypot(s[0], s[1], s[2]) + prevVr * prevVr / (2 * premG(nr));
      firstTurn.out = { t, r: rTop, depth: RE - rTop, dLonFromAntipode: dLon, latDeg: latOut };
    }
    prevVr = vr;
    maxV = Math.max(maxV, Math.hypot(ns[3], ns[4], ns[5]));
    s = ns;
    if (opt.stopAtFirstTurn && firstTurn && firstTurn.out) break;
  }
  return { t, steps, minR, minRt, firstTurn, maxV, stuck, final: Math.hypot(s[0], s[1], s[2]), state: s };
}

// Long-term settling for a body that loses little energy per pass: orbit-averaged decay of the
// amplitude A (deepest-to-outermost radius), passes treated as straight through the centre.
function settle(body) {
  const m = body.m, Ab = body.topArea, V = body.volume;
  const kP = K.PONCELET_K;
  // rest radius: inner-core linear gravity, static strength holds him
  let rStop = 0; { let lo = 0, hi = RE; for (let i = 0; i < 100; i++) { const mid = 0.5 * (lo + hi); const F = (m - premRho(mid) * V) * premG(mid); if (F > W.SIGMA_ROCK * Ab || !premSolid(mid)) hi = mid; else lo = mid; } rStop = lo; }
  const passFor = (Amp) => {     // one half-oscillation (surface-to-surface-ish) at amplitude Amp
    const n = body._n || 400; let T = 0, dE = 0;
    const phiA = premPhi(Amp);
    for (let i = 0; i < n; i++) {       // r = Amp sin(th), th in (-pi/2, pi/2)
      const th = -Math.PI / 2 + (i + 0.5) * Math.PI / n, dth = Math.PI / n;
      const r = Math.abs(Amp * Math.sin(th)), dr = Amp * Math.cos(th) * dth;
      const v2 = Math.max(0, 2 * (phiA - premPhi(r)));
      const v = Math.sqrt(v2);
      if (v > 0) T += dr / v;
      const sig = premSolid(r) ? W.SIGMA_ROCK : 0;
      dE += Ab * (sig + kP * premRho(r) * v2) * dr;
    }
    return { T, dE };
  };
  // integrate n and t over A from rStop to RE
  const N = body._N || 3000; let passes = 0, time = 0;
  const lo = Math.max(rStop, 1), grid = [];
  for (let i = 0; i <= N; i++) grid.push(lo * Math.pow(RE / lo, i / N));
  let prev = null;
  for (const Amp of grid) {
    const { T, dE } = passFor(Amp);
    const dndA = m * premG(Amp) * (1 - premRho(Amp) * V / m) / dE;   // half-passes per metre of amplitude
    const cur = { Amp, dndA, dtdA: dndA * T };
    if (prev) { const h = Amp - prev.Amp; passes += 0.5 * h * (prev.dndA + cur.dndA); time += 0.5 * h * (prev.dtdA + cur.dtdA); }
    prev = cur;
  }
  const first = passFor(RE * 0.99999);
  return { rStop, halfPasses: passes, years: time / (365.25 * 86400), firstPassLossJ: first.dE, firstHalfPeriod: first.T,
    energyJ: m * (0 - premPhi(rStop)) };
}

function earthCollapse(m) {
  const tff = Math.PI / 2 * Math.sqrt(RE * RE * RE / (2 * W.G * (m + W.M_E)));
  return { tff, Elow: W.G * m * W.M_E / RE };
}
function mutualGravity(mA, RA, mB, RB, d) {
  const dc = RA + RB, dd = d == null ? dc : Math.max(d, dc);
  const F = W.G * mA * mB / (dd * dd);
  return { F, dContact: dc, Fcontact: W.G * mA * mB / (dc * dc), Ebind: W.G * mA * mB / dc,
    dEqualWeight: Math.sqrt(W.G * Math.max(mA, mB) / K.g) };
}
function fallTogether(mA, mB, dc, d0) {
  const GM = W.G * (mA + mB);
  if (!(d0 > dc)) return { t: 0, v: 0 };
  const x = dc / d0;
  return { t: Math.sqrt(d0 * d0 * d0 / (2 * GM)) * (Math.sqrt(x * (1 - x)) + Math.acos(Math.sqrt(x))), v: Math.sqrt(2 * GM * (1 / dc - 1 / d0)) };
}
// objects near him
function selfPull(m, r) { return W.G * m / (r * r); }
function escapeSpeedFrom(m, r) { return Math.sqrt(2 * W.G * m / r); }
function vInfinity(v, m, r0) { const q = v * v - 2 * W.G * m / r0; return q > 0 ? Math.sqrt(q) : 0; }

module.exports = { W, PREM, premRho, premSolid, premMassFrac, premG, premPhi, PREM_MTOT, eqRadius, blackHoleDensity, selfGravity, infall,
  moveCheck, groundUnderWeight, fallThrough, settle, earthCollapse, mutualGravity, fallTogether, selfPull, escapeSpeedFrom, vInfinity, P, K };
