/* Rex Super-Strength Lab: physics engine.
 * Pure functions, SI units throughout (kg, m, s, N, Pa, J).
 * Runs in the browser (window.DinoPhys) and in Node (module.exports) for tests.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.DinoPhys = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------
  const K = {
    g: 9.80665,              // standard gravity, m/s^2
    c: 299792458,            // speed of light, m/s
    GM: 3.986004418e14,      // Earth's gravitational parameter, m^3/s^2
    R_E: 6.371e6,            // Earth mean radius, m
    rho0: 1.225,             // ISA sea-level air density, kg/m^3
    p0: 101325,              // ISA sea-level pressure, Pa
    T0: 288.15,              // ISA sea-level temperature, K
    a0: 340.29,              // ISA sea-level speed of sound, m/s
    gammaAir: 1.4,
    // Exponential-atmosphere scale height chosen so the column mass rho0*Hs equals p0/g (8.43 km).
    Hs: 101325 / (1.225 * 9.80665),
    TNT_J_per_kg: 4.184e6,   // 1 kg TNT = 4.184 MJ (convention)
    seismicEff: 1e-4,        // share of impact energy radiated as seismic waves (Collins et al. 2005)
    EARTH_BIND: 2.49e32,     // Earth's gravitational binding energy, J (PREM)
    R_HILL: 1.5e9,           // Earth's Hill radius, m: beyond it the Sun's pull beats Earth's
    PONCELET_K: 1.0,         // inertial resistance coefficient for a blunt foot driven into ground
  };
  const V_ESC = Math.sqrt(2 * K.GM / K.R_E);

  // ---------------------------------------------------------------------------
  // Body model. Isometric scaling from a 2.0 m, 180 kg baseline.
  // ---------------------------------------------------------------------------
  const BASE_H = 2.0;
  const BASE_M = 180;

  // Reference human strength: the strongman deadlift record used for calibration.
  const CAL_LIFT_KG = 511;

  // Real-muscle (Hill) parameters per move, at baseline size.
  //   vmax: unloaded endpoint speed. Scales in proportion to size: Rex keeps the same muscle
  //         at every size, so longer fibres shorten proportionally faster.
  //   forceFrac: share of whole-body strength the move can use (per hand for throws).
  // Tuned so the record-human setting reproduces the shot put and pitch records (test/calibration.js).
  // comicFrac is set by calibrateComic(): the constant drive force that gives the same result
  // as real muscle at record-human strength.
  const MUSCLE = {
    k: 0.25,                                   // Hill curvature a/F0
    throwPush: { vmax: 35, forceFrac: 0.523 },  // shove-style throw (shot put and heavier), per hand
    throwWhip: { vmax: 84.6, forceFrac: 0.3 },  // overarm whip (objects up to 1 kg)
    punch: { vmax: 17, forceFrac: 0.3 },
    clap: { vmax: 17, forceFrac: 0.3 },
    // Leg extension: vmax and forceFrac fit to a ~0.45 m jump and a loaded-jump V0 of ~5 m/s.
    // forceFrac above 1: leg extensors also carry body weight, which a deadlift record excludes.
    jump: { vmax: 12, forceFrac: 1.4 },
    stomp: { vmax: 16, forceFrac: 0.5 },
    // Sprint: Bolt's 12.42 m/s at record strength; 17.9 m/s (40 mph) is the top of the
    // 35-40 mph range Weyand's group projected in their 2010 press release.
    run: { atCal: 12.42, cap: 17.9 },
  };

  function makeBody(opts) {
    const o = opts || {};
    const H = o.H || BASE_H;
    const s = H / BASE_H;
    const m = o.m || BASE_M * s * s * s;
    const footArea = 0.045 * s * s;  // one foot, m^2 (broad three-toed foot)
    return {
      H, s, m,
      footArea,
      footB: Math.sqrt(footArea),  // equivalent square footing width, m
      palmArea: 0.015 * s * s,     // one hand, m^2
      frontArea: 0.8 * s * s,      // facing the direction of travel, m^2
      topArea: 0.3 * s * s,        // moving head- or feet-first, m^2
      Cd: 1.0,
      handEff: 0.022 * m,          // hand + forearm (Dempster: 0.6% + 1.6%)
      whipEff: 0.003 * m,          // effective mass at the hand at release in an overarm whip
      legEff: 0.061 * m,           // foot + shank (Dempster: 1.45% + 4.65%)
      feetMass: 0.029 * m,         // both feet
      digArea: 0.2 * s * s,        // claws + feet buried when braced, m^2
      strokes: { throw: 1.6 * s, whip: 2.2 * s, punch: 0.7 * s, leg: 0.5 * s, stomp: 0.6 * s, clap: 0.5 * s },
      releaseHeight: 0.9 * H,
    };
  }

  // Ultimate bearing pressure under one of Rex's feet. Granular soils (sand, gravel) scale with
  // footing width (Terzaghi's 1/2 gamma B N_gamma term); cohesive soils, pavement and rock do not.
  function qultFor(surface, B) {
    if (surface.granular) return surface.qult * B / surface.Bref;
    return surface.qult;
  }

  // ---------------------------------------------------------------------------
  // Relativistic helpers
  // ---------------------------------------------------------------------------
  function momentumToV(p, m) {
    if (!(p > 0)) return 0;
    if (!isFinite(p)) return K.c;
    const r = p / (m * K.c);
    if (r < 1e-6) return p / m;
    return Math.min(K.c, K.c * r / Math.sqrt(1 + r * r));
  }
  function momentumToKE(p, m) {
    if (!(p > 0)) return 0;
    if (!isFinite(p)) return Infinity;
    const mc2 = m * K.c * K.c;
    const pc = p * K.c;
    return (pc * pc) / (Math.sqrt(mc2 * mc2 + pc * pc) + mc2);
  }
  function vToMomentum(v, m) {
    const b = Math.min(v / K.c, 1 - 1e-16);
    if (b < 1e-6) return m * v;
    return m * v / Math.sqrt(1 - b * b);
  }
  function keFromV(v, m) { return momentumToKE(vToMomentum(v, m), m); }
  // Distance covered from rest under constant net force f, relativistically (exact, stable form).
  function xOfT(f, m, t) {
    if (!(f > 0)) return 0;
    const u = f * t / (m * K.c);
    return (f * t * t / m) / (Math.sqrt(1 + u * u) + 1);
  }

  // ---------------------------------------------------------------------------
  // Two-body push: an internal force F pushes bodies A and B apart over relative stroke d.
  // Each side i is held back by R_i (static: it moves only once the push exceeds R_i, then
  // R_i keeps acting) plus, optionally, c_i * v^2 (inertial resistance of ground it is driven
  // into). R_i = Infinity means that side cannot move.
  // mode 'comic': F constant at any speed. Relativistic momentum, closed form. A side with
  //   c_i > 0 is treated as reaching its terminal speed at once (light feet in heavy ground).
  // mode 'real': F = F0 * Hill(vRel / vmax), implicit integration (stable at any strength).
  // ---------------------------------------------------------------------------
  function hill(u, k) {
    if (u <= 0) return 1;
    if (u >= 1) return 0;
    return (1 - u) / (1 + u / k);
  }

  // RA may be a number or a function of the current push force (sliding friction grows with
  // the push's downward component once his feet go).
  function pushApart(o) {
    const RAf = typeof o.RA === 'function' ? o.RA : null;
    const RB = o.RB == null ? 0 : o.RB;
    const cA = o.cA || 0, cB = o.cB || 0;
    if (o.mode === 'real') return pushApartHill(o, RAf, RB, cA, cB);
    const { F, d, mA, mB } = o;
    const RA = RAf ? RAf(F) : (o.RA == null ? 0 : o.RA);
    const RAstatic = RAf ? RAf(0) : RA;            // the most the footing holds before it slips
    const aMoves = isFinite(RA) && F > RAstatic, bMoves = isFinite(RB) && F > RB;
    if (!aMoves && !bMoves) {
      return { t: Infinity, stalled: true, xA: 0, xB: 0, pA: 0, pB: 0, vA: 0, vB: 0, vBmax: 0, EA: 0, EB: 0, work: 0, lossA: 0, lossB: 0 };
    }
    if (!isFinite(F)) {
      const both = aMoves && bMoves;
      return {
        t: both ? d / (2 * K.c) : d / K.c, stalled: false,
        xA: aMoves ? (both ? d / 2 : d) : 0, xB: bMoves ? (both ? d / 2 : d) : 0,
        pA: aMoves ? Infinity : 0, pB: bMoves ? Infinity : 0,
        vA: aMoves ? K.c : 0, vB: bMoves ? K.c : 0, vBmax: bMoves ? K.c : 0,
        EA: aMoves ? Infinity : 0, EB: bMoves ? Infinity : 0, work: Infinity,
        lossA: aMoves && cA > 0 ? Infinity : 0, lossB: bMoves && cB > 0 ? Infinity : 0,
      };
    }
    const side = (moves, f, m, c) => {
      if (!moves) return { x: () => 0, p: () => 0, v: () => 0 };
      if (c > 0) {
        // Terminal speed where the push balances the ground's ram pressure c (gamma v)^2,
        // reached at once (light feet in heavy ground). gamma * v = sqrt(f / c) exactly.
        const u = Math.sqrt(f / c);
        const vt = u / Math.sqrt(1 + (u / K.c) * (u / K.c));
        return { x: (t) => vt * t, p: () => m * u, v: () => vt, drag: true };
      }
      return { x: (t) => xOfT(f, m, t), p: (t) => f * t, v: (t) => momentumToV(f * t, m) };
    };
    const fA = aMoves ? Math.max(0, F - RA) : 0, fB = bMoves ? F - RB : 0;
    const A = side(aMoves && fA > 0, fA, mA, cA), B = side(bMoves, fB, mB, cB);
    const S = (t) => A.x(t) + B.x(t);
    let hi = 1e-30;
    while (S(hi) < d) hi *= 2;
    let lo = hi / 2;
    for (let i = 0; i < 200; i++) {
      const mid = 0.5 * (lo + hi);
      if (S(mid) < d) lo = mid; else hi = mid;
      if (hi - lo <= 1e-15 * hi) break;
    }
    const t = hi;
    const pA = A.p(t), pB = B.p(t);
    const xA = A.x(t), xB = B.x(t);
    const EA = momentumToKE(pA, mA), EB = momentumToKE(pB, mB);
    return {
      t, stalled: false, xA, xB, pA, pB,
      vA: A.v(t), vB: B.v(t), vBmax: B.v(t),
      EA, EB, work: F * (xA + xB),
      // energy the resistance on each side soaked up (ground heating, friction)
      lossA: Math.max(0, F * xA - EA), lossB: Math.max(0, F * xB - EB),
    };
  }

  function pushApartHill(o, RAf, RB, cA, cB) {
    const { d, mA, mB } = o;
    const vmax = o.vmax;
    const k = o.k || MUSCLE.k;
    const RA0 = RAf ? RAf(0) : (o.RA == null ? 0 : o.RA);
    const RAof = RAf || (() => RA0);
    const aFree = isFinite(RA0), bFree = isFinite(RB);
    const Fcap = o.Fcap == null ? Infinity : o.Fcap;
    const F0raw = Math.min(o.F, Number.MAX_VALUE);
    const Fmax = Math.min(F0raw, Fcap);
    if ((!aFree || !(Fmax > RA0)) && (!bFree || !(Fmax > RB))) {
      return { t: Infinity, stalled: true, xA: 0, xB: 0, pA: 0, pB: 0, vA: 0, vB: 0, vBmax: 0, EA: 0, EB: 0, work: 0, lossA: 0, lossB: 0 };
    }
    // Beyond ~1e6x the inertial force the result has converged; clamping keeps the numbers finite.
    const F0 = Math.min(F0raw, (aFree ? RA0 : 0) + (bFree ? RB : 0) + 1e6 * Math.max(mA, mB) * vmax * vmax / d);
    const force = (S) => Math.min(Fcap, F0 * hill(S / vmax, k));
    // Implicit step: v' = max(0, v + dt (F - R - c v'^2) / m), with F = F0 Hill(sum v' / vmax).
    const stepV = (v, F, R, c, m, free, dt) => {
      if (!free) return 0;
      if (v <= 0 && F <= R) return 0;
      const b = v + dt * (F - R) / m;
      if (b <= 0) return 0;
      const a = c * dt / m;
      return a > 0 ? (2 * b) / (1 + Math.sqrt(1 + 4 * a * b)) : b;
    };
    const fA0 = aFree ? Math.max(0, Fmax - RA0) : 0, fB0 = bFree ? Math.max(0, Fmax - RB) : 0;
    const tComic = Math.sqrt(2 * d / ((fA0 / mA) + (fB0 / mB)));
    const tEst = Math.max(tComic, d / vmax);
    const dt = tEst / 1500;
    let xA = 0, xB = 0, vA = 0, vB = 0, t = 0, workA = 0, workB = 0, vBmax = 0, steps = 0;
    while (xA + xB < d && steps < 600000) {
      // solve g(S) = s2(S) - S = 0 for the new relative speed S in [0, vmax]. g falls with S, so
      // keep a bracket and step by Illinois false position, bisecting every 8th step and after
      // the 8th (g can jump where his feet start to slide), to adjacent doubles.
      const g = (S) => { const F = force(S); return stepV(vA, F, RAof(F), cA, mA, aFree, dt) + stepV(vB, F, RB, cB, mB, bFree, dt) - S; };
      let lo = 0, hi = vmax, glo = g(0), ghi = g(vmax), side = 0;
      if (!(ghi < 0)) lo = vmax;
      else if (glo > 0) for (let i = 1; i <= 200; i++) {
        let S = (i > 8 || i % 8 === 0) ? 0.5 * (lo + hi) : (lo * ghi - hi * glo) / (ghi - glo);
        if (!(S > lo && S < hi)) S = 0.5 * (lo + hi);
        if (S <= lo || S >= hi) break;
        const gs = g(S);
        if (gs >= 0) { lo = S; glo = gs; if (side === 1) ghi *= 0.5; side = 1; }
        else { hi = S; ghi = gs; if (side === -1) glo *= 0.5; side = -1; }
        if (gs === 0 || hi - lo <= 4e-16 * hi) break;
      }
      const F = force(lo);
      const nvA = stepV(vA, F, RAof(F), cA, mA, aFree, dt), nvB = stepV(vB, F, RB, cB, mB, bFree, dt);
      const dxA = 0.5 * (vA + nvA) * dt, dxB = 0.5 * (vB + nvB) * dt;
      let frac = 1;
      if (xA + xB + dxA + dxB > d) frac = (d - xA - xB) / (dxA + dxB);
      xA += dxA * frac; xB += dxB * frac;
      workA += F * dxA * frac; workB += F * dxB * frac;
      vA = vA + (nvA - vA) * frac; vB = vB + (nvB - vB) * frac;
      if (vB > vBmax) vBmax = vB;
      t += dt * frac; steps++;
      if (nvA === 0 && nvB === 0 && steps > 3) break;
    }
    const stalled = xA + xB < d * 0.999;
    const EA = 0.5 * mA * vA * vA, EB = 0.5 * mB * vB * vB;
    return {
      t, stalled, xA, xB, vA, vB, vBmax, pA: mA * vA, pB: mB * vB, EA, EB, work: workA + workB,
      lossA: Math.max(0, workA - EA), lossB: Math.max(0, workB - EB),
    };
  }

  // ---------------------------------------------------------------------------
  // Ground and anchoring
  // ---------------------------------------------------------------------------
  // Largest push F along a line tilted theta above horizontal that Rex's footing can resist.
  // The reaction drives him backward and down. With mB held on the push line (object + arm):
  //   normal load N(F) = mA g + F sin + mB g cos^2,   needed grip H(F) = F cos - mB g sin cos.
  // The ground supplies N up to Nmax (bearing) and grip up to mu*min(N, Nmax) + claw shear.
  // A failing bearing makes him sink but does not free him along the push line.
  // Rslide(F): once his feet go, sliding friction still grows with the load; the footing then
  // resists F minus cos(theta) times the unbalanced horizontal force.
  function anchorCapacity(o) {
    const { body, surface } = o;
    const theta = o.theta || 0;
    const anchor = o.anchor || 'friction';
    const mA = o.mA == null ? body.m : o.mA;
    const mB = o.mB || 0;
    const qult = qultFor(surface, body.footB);
    const Nmax = o.groundHolds ? Infinity : qult * 2 * body.footArea;
    const sin = Math.sin(theta), cos = Math.cos(theta);
    const N = (F) => mA * K.g + (F > 0 ? F * sin : 0) + mB * K.g * cos * cos;
    if (anchor === 'bolted') return { R: Infinity, Rslide: () => Infinity, limit: 'bolted', Nmax, N };
    const mu = surface.mu;
    const dig = anchor === 'braced' ? surface.shear * body.digArea : 0;
    let R1 = Infinity, R2 = Infinity;
    if (cos - mu * sin > 1e-12) R1 = (mu * (mA * K.g + mB * K.g * cos * cos) + dig + mB * K.g * sin * cos) / (cos - mu * sin);
    if (isFinite(Nmax) && cos > 1e-9) R2 = (mu * Nmax + dig) / cos + mB * K.g * sin;
    const R = Math.min(R1, R2);
    const limit = R === Infinity ? 'none' : (anchor === 'braced' ? 'shear' : 'friction');
    const Rslide = (F) => {
      if (!(F > R) || !isFinite(F) || !isFinite(R)) return R;
      const Hnet = F * cos - mB * K.g * sin * cos - mu * Math.min(N(F), Nmax) - dig;
      return F - cos * Math.max(0, Hnet);
    };
    return { R, Rslide, limit, Nmax, N, normalCapped: R2 < R1 };
  }

  // ---------------------------------------------------------------------------
  // Atmosphere, flight, impact
  // ---------------------------------------------------------------------------
  function rhoAt(h) { return h <= 0 ? K.rho0 : K.rho0 * Math.exp(-h / K.Hs); }

  // Stagnation temperature of sea-level air at speed v. Below 1 km/s the ideal-gas formula;
  // above, an equilibrium-air table (dissociation and ionization soak up energy) computed for
  // this project at sea-level stagnation pressure (rho0 v^2, ~1,500 atm at 11 km/s). The same
  // solver reproduces Anderson's Apollo case (11 km/s at ~0.9 atm, ~11,600 K) to about 2%; at
  // sea-level pressure dissociation is held back, so it gives ~16,400 K. Radiation is ignored,
  // so it is an upper bound.
  const STAG_EQ = [[1000, 767], [1500, 1309], [2000, 2004], [3000, 3614], [4000, 5166], [5000, 7011], [7000, 9836],
    [10000, 14060], [15000, 27313], [20000, 40530], [30000, 74044], [50000, 136822], [80000, 2.296e5],
    [120000, 5.68e5], [200000, 1.137e6], [400000, 5.854e6], [1e6, 4.136e7], [3e6, 3.77e8]];
  function stagnationT(v) {
    if (!(v > 0)) return K.T0;
    if (v <= 1000) { const M = v / K.a0; return K.T0 * (1 + 0.5 * (K.gammaAir - 1) * M * M); }
    let i = 1;
    while (i < STAG_EQ.length - 1 && v > STAG_EQ[i][0]) i++;
    const [v1, T1] = STAG_EQ[i - 1], [v2, T2] = STAG_EQ[i];
    return T1 * Math.pow(T2 / T1, Math.log(v / v1) / Math.log(v2 / v1));
  }
  function stagnationTIdeal(v) { const M = v / K.a0; return K.T0 * (1 + 0.5 * (K.gammaAir - 1) * M * M); }

  // Drag coefficient vs Mach: subsonic value up to Mach 0.8, supersonic value from Mach 1.2.
  function cdAt(Cd, CdSup, mach) {
    if (CdSup == null || mach <= 0.8) return Cd;
    if (mach >= 1.2) return CdSup;
    return Cd + (CdSup - Cd) * (mach - 0.8) / 0.4;
  }

  // Kepler propagation of a free (drag-free) arc from state (x, y, vx, vy) about Earth's centre.
  // Returns where the arc next crosses radius rStop going down, or that it escapes or orbits.
  function conicTo(x, y, vx, vy, rStop) {
    const r = Math.hypot(x, y);
    const v2 = vx * vx + vy * vy;
    const eps = 0.5 * v2 - K.GM / r;
    if (eps >= 0) return { escaped: true };
    const h = x * vy - y * vx;             // signed angular momentum
    const hAbs = Math.abs(h);
    if (hAbs < 1e-6 * r * Math.sqrt(v2)) return { radial: true };
    const p = h * h / K.GM;
    const e = Math.sqrt(Math.max(0, 1 + 2 * eps * h * h / (K.GM * K.GM)));
    const a = -K.GM / (2 * eps);
    const rp = a * (1 - e), ra = a * (1 + e);
    if (rp >= rStop) return { orbit: true, rp, ra };
    const vr = (x * vx + y * vy) / r;
    const fOf = (rr, desc) => {
      const cf = Math.max(-1, Math.min(1, (p / rr - 1) / Math.max(e, 1e-12)));
      const f = Math.acos(cf);
      return desc ? 2 * Math.PI - f : f;
    };
    const f0 = fOf(r, vr < 0);
    const f1 = fOf(rStop, true);
    const EofF = (f) => {
      const E = 2 * Math.atan2(Math.sqrt(1 - e) * Math.sin(f / 2), Math.sqrt(1 + e) * Math.cos(f / 2));
      return E < 0 ? E + 2 * Math.PI : E;
    };
    const n = Math.sqrt(K.GM / (a * a * a));
    const M0 = EofF(f0) - e * Math.sin(EofF(f0)), M1 = EofF(f1) - e * Math.sin(EofF(f1));
    let dM = M1 - M0;
    if (dM < 0) dM += 2 * Math.PI;
    const dt = dM / n;
    let df = f1 - f0;
    if (df < 0) df += 2 * Math.PI;
    const phi0 = Math.atan2(x, y);
    // direction of motion in phi (phi increases clockwise from +y): sign of the phi-velocity
    const s = (vx * Math.cos(phi0) - vy * Math.sin(phi0)) >= 0 ? 1 : -1;
    const phi1 = phi0 + s * df;
    const sq = Math.sqrt(K.GM / p);
    const vr1 = sq * e * Math.sin(f1), vt1 = sq * (1 + e * Math.cos(f1)) * s;
    const rx = Math.sin(phi1), ry = Math.cos(phi1);           // radial unit
    const tx = Math.cos(phi1), ty = -Math.sin(phi1);          // phi unit
    const apex = (f0 < Math.PI && f1 > Math.PI) ? ra : Math.max(r, rStop);
    return {
      x: rStop * rx, y: rStop * ry, vx: vr1 * rx + vt1 * tx, vy: vr1 * ry + vt1 * ty,
      dt, dPhi: s * df, apexR: apex, hAbs, p, e, f0,
    };
  }

  // 2-D ballistic flight over a round, non-rotating Earth with an exponential atmosphere.
  // Above 150 km (air density < 2e-8 of sea level) the arc is propagated analytically.
  function fly(oIn) {
    let o = oIn;
    const { v0, m, A } = o;
    const Cd = o.Cd, CdSup = o.CdSup;
    const theta = (o.thetaDeg == null ? 45 : o.thetaDeg) * Math.PI / 180;
    const h0 = o.h0 || 0;
    const R = K.R_E;
    const SPACE = 150e3;
    const machCd = cdAt(Cd, CdSup, v0 / K.a0);
    const out = {
      v0, range: 0, apex: h0, time: 0, vImpact: 0, impactAngleDeg: 0,
      escaped: false, orbit: false, landed: false, timedOut: false, relativistic: false,
      maxMach: v0 / K.a0, maxStagT: stagnationT(v0),
      // sea-level distance over which drag cuts speed by 63%, at the launch Mach number
      eFold: Cd > 0 ? 2 * m / (K.rho0 * machCd * A) : Infinity,
      steps: 0,
    };
    if (!(v0 > 0)) { out.landed = true; return out; }
    if (v0 > 0.01 * K.c || !isFinite(v0)) { out.relativistic = true; return out; }
    const vacuum = !(Cd > 0);
    let x = 0, y = R + h0;
    let vx = v0 * Math.cos(theta), vy = v0 * Math.sin(theta);
    let t = 0, ang = 0;
    const tMax = o.tMax || 400 * 86400;
    const path = o.record ? [[0, h0]] : null;

    if (vacuum && !o._noVac) {
      const c = conicTo(x, y, vx, vy, R);
      if (c.radial) return fly(Object.assign({}, o, { Cd: 1e-30, CdSup: 1e-30, _noVac: true }));
      if (c.escaped) { out.escaped = true; return out; }
      if ((c.orbit ? c.ra : c.apexR) > K.R_HILL) { out.escaped = true; out.leavesHill = true; out.apex = (c.orbit ? c.ra : c.apexR) - R; return out; }
      if (c.orbit) { out.orbit = true; out.apex = c.ra - R; return out; }
      out.apex = c.apexR - R;
      out.time = c.dt; out.range = R * Math.abs(c.dPhi); out.landed = true;
      out.vImpact = Math.hypot(c.vx, c.vy);
      out.impactAngleDeg = Math.asin(Math.min(1, Math.abs(c.x * c.vx + c.y * c.vy) / (R * out.vImpact))) * 180 / Math.PI;
      if (path) {
        // sample the arc for drawing by integrating a coarse vacuum path
        const sub = fly(Object.assign({}, o, { Cd: 1e-30, CdSup: 1e-30, record: true, tMax: c.dt * 1.01, _noVac: true }));
        out.path = sub.path || null;
      }
      return out;
    }

    const acc = (x_, y_, vx_, vy_) => {
      const r2 = x_ * x_ + y_ * y_;
      const r = Math.sqrt(r2);
      const rho = rhoAt(r - R);
      const v = Math.hypot(vx_, vy_);
      const cd = cdAt(Cd, CdSup, v / K.a0);
      const gk = -K.GM / (r2 * r);
      const dk = -cd * A / (2 * m) * rho * v;
      return [gk * x_ + dk * vx_, gk * y_ + dk * vy_];
    };
    let steps = 0;
    let maxMach = 0;
    let lastRec = 0;
    while (true) {
      if (steps >= 3000000 || t > tMax) { out.timedOut = true; break; }
      const r = Math.hypot(x, y);
      if (r > K.R_HILL) { out.escaped = true; out.leavesHill = true; break; }
      const v = Math.hypot(vx, vy);
      const hNow = r - R;
      // Leave the atmosphere: jump along the drag-free arc to where it comes back down.
      if (hNow > SPACE && !o._noVac && (x * vx + y * vy) > 0) {
        const c = conicTo(x, y, vx, vy, R + SPACE);
        if (c.radial) { o = Object.assign({}, o, { _noVac: true }); continue; }
        if (c.escaped) { out.escaped = true; break; }
        if ((c.orbit ? c.ra : c.apexR) > K.R_HILL) { out.escaped = true; out.leavesHill = true; out.apex = Math.max(out.apex, (c.orbit ? c.ra : c.apexR) - R); break; }
        if (c.orbit) { out.orbit = true; out.apex = Math.max(out.apex, c.ra - R); break; }
        out.apex = Math.max(out.apex, c.apexR - R);
        if (path) {
          // a few points along the arc for the chart
          const segs = 48;
          for (let i = 1; i <= segs; i++) {
            const fr = i / segs;
            const phi = ang + c.dPhi * fr;
            const hh = c.p / (1 + c.e * Math.cos(c.f0 + Math.abs(c.dPhi) * fr)) - R;
            path.push([R * Math.abs(phi), Math.max(0, hh), true]);   // true: keep when thinning
          }
        }
        x = c.x; y = c.y; vx = c.vx; vy = c.vy; t += c.dt; ang += c.dPhi;
        continue;
      }
      const [ax, ay] = acc(x, y, vx, vy);
      const a = Math.hypot(ax, ay);
      let dt = 0.002 * Math.max(v, 1e-3) / Math.max(a, 1e-9);
      dt = Math.min(dt, 0.002 * r / Math.max(v, 1e-9));
      if (x * vx + y * vy < 0) dt = Math.min(dt, Math.max(0.5, 0.05 * hNow) / Math.max(v, 1e-9));
      dt = Math.max(dt, 1e-9);
      const k1v = [ax, ay], k1x = [vx, vy];
      const k2x = [vx + 0.5 * dt * k1v[0], vy + 0.5 * dt * k1v[1]];
      const k2v = acc(x + 0.5 * dt * k1x[0], y + 0.5 * dt * k1x[1], k2x[0], k2x[1]);
      const k3x = [vx + 0.5 * dt * k2v[0], vy + 0.5 * dt * k2v[1]];
      const k3v = acc(x + 0.5 * dt * k2x[0], y + 0.5 * dt * k2x[1], k3x[0], k3x[1]);
      const k4x = [vx + dt * k3v[0], vy + dt * k3v[1]];
      const k4v = acc(x + dt * k3x[0], y + dt * k3x[1], k4x[0], k4x[1]);
      const nx = x + dt / 6 * (k1x[0] + 2 * k2x[0] + 2 * k3x[0] + k4x[0]);
      const ny = y + dt / 6 * (k1x[1] + 2 * k2x[1] + 2 * k3x[1] + k4x[1]);
      const nvx = vx + dt / 6 * (k1v[0] + 2 * k2v[0] + 2 * k3v[0] + k4v[0]);
      const nvy = vy + dt / 6 * (k1v[1] + 2 * k2v[1] + 2 * k3v[1] + k4v[1]);
      const nr = Math.hypot(nx, ny);
      let dAng = Math.atan2(nx, ny) - Math.atan2(x, y);
      if (dAng > Math.PI) dAng -= 2 * Math.PI;
      if (dAng < -Math.PI) dAng += 2 * Math.PI;
      if (nr < R) {
        const f = (r - R) / Math.max(r - nr, 1e-12);
        ang += dAng * f;
        t += dt * f;
        const ivx = vx + (nvx - vx) * f, ivy = vy + (nvy - vy) * f;
        const ix = x + (nx - x) * f, iy = y + (ny - y) * f;
        const ir = Math.hypot(ix, iy);
        const vr = (ix * ivx + iy * ivy) / ir;
        const vImp = Math.hypot(ivx, ivy);
        out.vImpact = vImp;
        out.impactAngleDeg = Math.asin(Math.min(1, Math.abs(vr) / Math.max(vImp, 1e-12))) * 180 / Math.PI;
        out.landed = true;
        if (path) path.push([R * Math.abs(ang), 0]);
        break;
      }
      x = nx; y = ny; vx = nvx; vy = nvy; t += dt; ang += dAng;
      steps++;
      if (path && steps - lastRec >= 1) { path.push([R * Math.abs(ang), nr - R]); lastRec = steps; }
      const hN = nr - R;
      if (hN > out.apex) out.apex = hN;
      const vN = Math.hypot(vx, vy);
      if (hN < 80000) maxMach = Math.max(maxMach, vN / K.a0);
    }
    out.steps = steps;
    out.time = t;
    out.range = R * Math.abs(ang);
    out.maxMach = Math.max(maxMach, v0 / K.a0);
    out.maxStagT = stagnationT(out.maxMach * K.a0);
    if (path) {
      const stride = Math.max(1, Math.ceil(path.length / 400));
      out.path = path.filter((pt, i) => pt[2] || i % stride === 0 || i === path.length - 1);
    }
    return out;
  }

  // Highest point of a vertical launch with no air, over a round Earth (Infinity = escapes).
  function vacuumApex(v, h0) {
    const r0 = K.R_E + (h0 || 0);
    const xe = v * v * r0 / (2 * K.GM);
    if (xe >= 1) return Infinity;
    return r0 * xe / (1 - xe);
  }

  // Crater diameter: Collins, Melosh & Marcus (2005) transient crater (gravity regime),
  // x1.25 for simple craters or eq. 27 for complex ones. Impact speeds above 20 km/s (the
  // fit's range) are mapped to an impactor of the same energy and density at 20 km/s.
  // In rock and concrete, small craters are strength-limited and a few times smaller,
  // so treat this as an upper bound.
  function craterDiameter(o) {
    let { L, v, rhoI, rhoT } = o;
    const E = o.E;
    const th = (o.angleDeg == null ? 90 : o.angleDeg) * Math.PI / 180;
    let extrapolated = false;
    if (!(v > 0)) return { D: 0, extrapolated };
    if (!isFinite(E)) return { D: Infinity, extrapolated: true };
    if (v > 20000) {
      const vEq = 20000;
      const mEq = 2 * E / (vEq * vEq);
      L = Math.cbrt(6 * mEq / (Math.PI * rhoI));
      v = vEq; extrapolated = true;
    }
    const Dtc = 1.161 * Math.pow(rhoI / rhoT, 1 / 3) * Math.pow(L, 0.78) * Math.pow(v, 0.44) *
      Math.pow(K.g, -0.22) * Math.pow(Math.max(Math.sin(th), 1e-3), 1 / 3);
    const Dc = 3200;
    // held at 3.2 km across the simple-to-complex switch so size never falls as energy rises
    const D = 1.25 * Dtc <= Dc ? 1.25 * Dtc : Math.max(Dc, 1.17 * Math.pow(Dtc, 1.13) / Math.pow(Dc, 0.13));
    return { D, extrapolated };
  }

  // Gutenberg-Richter energy-magnitude relation: log10(Es) = 1.5 M + 4.8 (Es in J).
  function seismicMagnitude(E, eff) {
    const Es = E * (eff == null ? K.seismicEff : eff);
    if (!(Es > 0)) return -Infinity;
    if (!isFinite(Es)) return Infinity;
    return (Math.log10(Es) - 4.8) / 1.5;
  }

  // Kinney & Graham (1985) free-air peak overpressure ratio dp/p0 at scaled distance Z (m/kg^(1/3)).
  function kgRatio(Z) {
    return 808 * (1 + (Z / 4.5) ** 2) /
      (Math.sqrt(1 + (Z / 0.048) ** 2) * Math.sqrt(1 + (Z / 0.32) ** 2) * Math.sqrt(1 + (Z / 1.35) ** 2));
  }
  function overpressureAt(E, R) {
    const W = E / K.TNT_J_per_kg;
    if (!(W > 0)) return 0;
    return K.p0 * kgRatio(R / Math.cbrt(W));
  }
  // Distance at which an explosion releasing E joules drops to overpressure dp (Pa).
  function blastRadius(E, dp) {
    if (!(E > 0)) return 0;
    if (!isFinite(E)) return Infinity;
    const W = E / K.TNT_J_per_kg;
    const target = dp / K.p0;
    let lo = 1e-4, hi = 1e6;
    if (kgRatio(lo) < target) return 0;
    for (let i = 0; i < 200; i++) {
      const mid = Math.sqrt(lo * hi);
      if (kgRatio(mid) > target) lo = mid; else hi = mid;
    }
    return Math.sqrt(lo * hi) * Math.cbrt(W);
  }

  // Depth a rigid flat face of mass m and area A reaches when driven into ground at speed v:
  // m v dv/dx = -A (q + k rho v^2)  (Poncelet form)  =>  x = m/(2 k rho A) ln(1 + k rho v^2 / q).
  function penetrationDepth(m, A, v, q, rho) {
    if (!(v > 0)) return 0;
    const kr = K.PONCELET_K * rho;
    return m / (2 * kr * A) * Math.log1p(kr * v * v / q);
  }

  // ---------------------------------------------------------------------------
  // Moves. Each takes a shared context:
  //   { F, mode: 'comic'|'real', body, surface, groundHolds, anchor: 'friction'|'braced'|'bolted' }
  // ---------------------------------------------------------------------------
  function sizeVmax(key, body) { return MUSCLE[key].vmax * body.s; }
  function actionForce(ctx, key) {
    return ctx.F * (ctx.mode === 'real' ? MUSCLE[key].forceFrac : MUSCLE[key].comicFrac);
  }
  // Comic mode is never weaker than real muscle. Its fixed share of strength is tuned to fast
  // moves at record strength, so for slow heavy loads (or below record strength) real muscle can
  // do better; then the real result is used. Real muscle can't beat its own speed cap, so the
  // real run is skipped once the comic result is past it.
  function comicAtLeastReal(ctx, run, metric, cap) {
    const c = run(ctx);
    if (ctx.mode !== 'comic' || ctx.noBlend) return c;
    const mc = metric(c);
    if (mc >= cap) return c;
    const r = run(Object.assign({}, ctx, { mode: 'real' }));
    return metric(r) > mc ? Object.assign(r, { basis: 'real' }) : c;
  }

  function lift(ctx, obj) {
    const { body, surface } = ctx;
    const W = obj.m * K.g;
    const N = (body.m + obj.m) * K.g;
    const feet = 2 * body.footArea;
    const pressure = N / feet;
    const qult = qultFor(surface, body.footB);
    const contact = 2 * body.palmArea;
    const gripPressure = W / contact;
    // plate needed so the ground holds; granular soils get stronger as the plate widens
    let footAreaNeeded;
    if (surface.granular) { const B = Math.cbrt(N * surface.Bref / surface.qult); footAreaNeeded = B * B; }
    else footAreaNeeded = N / surface.qult;
    return {
      canLift: ctx.F >= W * (1 - 1e-9),
      strengthMargin: ctx.F / W,
      weight: W,
      pressure, qult,
      groundRatio: ctx.groundHolds ? 0 : pressure / qult,
      standRatio: ctx.groundHolds ? 0 : (body.m * K.g / feet) / qult,
      footAreaNeeded,
      gripPressure,
      gripRatio: obj.crush ? gripPressure / obj.crush : 0,
      plateNeeded: obj.crush ? W / obj.crush : 0,
    };
  }

  function throwStyle(obj) {
    const style = obj.m <= 1 ? 'whip' : 'push';
    return { style, key: style === 'whip' ? 'throwWhip' : 'throwPush', hands: obj.m > 20 ? 2 : 1 };
  }

  function throwOnce(ctx, obj, thetaDeg) {
    const { body } = ctx;
    const th = thetaDeg * Math.PI / 180;
    // Light objects get an overarm whip; heavier ones a shove, two-handed above 20 kg.
    const { style, key, hands } = throwStyle(obj);
    const d = style === 'whip' ? body.strokes.whip : body.strokes.throw;
    const armMass = hands * (style === 'whip' ? body.whipEff : body.handEff);
    const mB = obj.m + armMass;
    const mA = body.m - armMass;
    const canHold = ctx.F >= mB * K.g * (1 - 1e-9);
    const Fdrive = Math.min(ctx.F, actionForce(ctx, key) * hands);
    // The arms also hold the load up at right angles to the push: only the rest drives it.
    const perp = mB * K.g * Math.cos(th);
    const F = isFinite(Fdrive) ? Math.sqrt(Math.max(0, Fdrive * Fdrive - perp * perp)) : Infinity;
    const RB = mB * K.g * Math.sin(th);
    const anc = anchorCapacity({ body, surface: ctx.surface, theta: th, anchor: ctx.anchor, groundHolds: ctx.groundHolds, mA, mB });
    const out = { F, Fdrive, style, hands, canHold, anchor: anc, mB, armMass, needed: mB * K.g };
    if (!canHold || !(F > RB)) {
      return Object.assign(out, { canMove: false, v: 0, Eobj: 0, recoilV: 0, recoilE: 0, push: null, flight: null });
    }
    const vmax = sizeVmax(key, body);
    let push = pushApart({ F, d, mA, mB, RA: anc.Rslide, RB, mode: ctx.mode, vmax });
    // Pushing past what his footing holds gives much of the stroke to his own slide when the
    // load outweighs him. He can always push less hard, so he also tries pushing only as hard
    // as his footing allows and keeps whichever throws the object faster.
    let heldBack = false;
    const Rlim = anc.R * (1 - 1e-9);
    let Fused = F;
    if ((isFinite(F) || ctx.mode === 'real') && F > Rlim && Rlim > RB) {
      // real muscle: also try caps a little past the slip point (force falls with speed anyway)
      const caps = ctx.mode === 'real' ? [1, 1.25, 1.6, 2, 3, 5, 10] : [1];
      for (const f of caps) {
        const Fc = Rlim * f;
        if (!(Fc < F)) continue;
        const held = pushApart(ctx.mode === 'real'
          ? { F, Fcap: Fc, d, mA, mB, RA: anc.Rslide, RB, mode: 'real', vmax }
          : { F: Fc, d, mA, mB, RA: anc.Rslide, RB, mode: 'comic' });
        if (held.pB > push.pB) { push = held; heldBack = f === 1; Fused = Fc; }
      }
    }
    const pObj = push.pB === Infinity ? Infinity : push.pB * obj.m / mB;   // object and hand share one velocity
    const v = push.vB;
    const Eobj = momentumToKE(pObj, obj.m);
    // The follow-through stops the arm inside him, so his final recoil carries pA - pArm.
    const pRecoil = push.pA === Infinity ? Infinity : Math.max(0, push.pA - push.pB * armMass / mB);
    const recoilV = momentumToV(pRecoil, body.m);
    const recoilE = momentumToKE(pRecoil, body.m);
    const flight = fly({ v0: v, thetaDeg, h0: body.releaseHeight, m: obj.m, A: obj.area, Cd: obj.Cd, CdSup: obj.CdSup, record: !!ctx.record });
    const Eimp = flight.landed && flight.vImpact > 0 ? keFromV(flight.vImpact, obj.m) : 0;
    const L = obj.L || Math.cbrt(6 * obj.m / (Math.PI * (obj.rho || 1000)));
    const crater = flight.vImpact >= 2000 ? craterDiameter({ L, v: flight.vImpact, rhoI: obj.rho || 1000, rhoT: ctx.surface.rho || 2000, angleDeg: flight.impactAngleDeg, E: Eimp }) : { D: 0 };
    const contact = hands * body.palmArea;
    // Load on his feet: the mean push over the stroke (impulse / time). In comic mode this equals
    // the constant push; real muscle reaches its isometric peak only for an instant.
    const Fload = !push.stalled && push.t > 0 && isFinite(push.pB) ? Math.min(Fused, push.pB / push.t + RB) : Fused;
    const Nfeet = isFinite(Fload) ? anc.N(Fload) : (Math.sin(th) > 1e-12 ? Infinity : anc.N(0));
    // Peak force on his palms: the push he actually uses plus holding the load up.
    const handF = isFinite(Fused) ? Math.hypot(Fused, perp) : Fdrive;
    return Object.assign(out, {
      canMove: !push.stalled && v > 0,
      push, v, mach: v / K.a0, Eobj, heldBack,
      recoilV, recoilE,
      gripRatio: obj.crush ? handF / contact / obj.crush : 0,
      plateNeeded: obj.crush ? handF / obj.crush : 0,
      sinkRatio: isFinite(anc.Nmax) ? Nfeet / anc.Nmax : 0,
      flight, Eimpact: Eimp,
      crater: crater.D, craterExtrapolated: !!crater.extrapolated,
      planetScale: Eimp >= K.EARTH_BIND || crater.D > K.R_E,
      craterBeyondFit: crater.D > 3e5,
      quake: seismicMagnitude(Eimp),
    });
  }
  function throwObject(ctx, obj, thetaDeg) {
    const { key } = throwStyle(obj);
    return comicAtLeastReal(ctx, (c) => throwOnce(c, obj, thetaDeg), (r) => (r.canMove ? r.v : 0), sizeVmax(key, ctx.body));
  }

  function jumpOnce(ctx) {
    const { body, surface } = ctx;
    const d = body.strokes.leg;
    const F = actionForce(ctx, 'jump');
    const mA = body.m - body.feetMass;
    const mB = body.feetMass;
    const RA = mA * K.g;
    const A2 = 2 * body.footArea;
    const RB = ctx.groundHolds ? Infinity : qultFor(surface, body.footB) * A2;
    const cB = ctx.groundHolds ? 0 : K.PONCELET_K * (surface.rho || 2000) * A2;
    const vmax = sizeVmax('jump', body);
    const run = (Fj, Fcap) => {
      const pu = pushApart({ F: Fj, Fcap, d, mA, mB, RA, RB, cB, mode: ctx.mode, vmax });
      // Legs lock at full extension: the feet's downward momentum cancels part of the body's.
      return { push: pu, p: Math.max(0, pu.pA - pu.pB), cap: Fcap == null ? Fj : Fcap };
    };
    let best = run(F);
    // Pushing just past the ground's limit wastes stroke sinking the feet; much harder, the
    // ground's inertia pushes back and the jump grows again. Rex can push with any force up to
    // his strength and picks the best (in real muscle, by capping his force).
    let heldBack = false;
    if (!ctx.groundHolds && (isFinite(F) || ctx.mode === 'real') && F > RB) {
      const tries = ctx.mode === 'real' ? [1 - 1e-9, 1.5, 2, 3, 5, 10, 30, 100] : [1 - 1e-9];
      for (const f of tries) {
        const Fc = RB * f;
        if (!(Fc < F)) continue;
        const r = ctx.mode === 'real' ? run(F, Fc) : run(Fc);
        if (r.p > best.p) { best = r; heldBack = f < 1; }
      }
    }
    const push = best.push;
    // Comic mode at unbounded strength: infinity minus infinity, so he simply leaves at light
    // speed. Real muscle converges to a finite push at any strength.
    const finiteRun = isFinite(F) || ctx.mode === 'real';
    const p = finiteRun ? best.p : Infinity;
    const v = momentumToV(p, body.m);
    const flight = fly({ v0: v, thetaDeg: 90, h0: 0, m: body.m, A: body.topArea, Cd: body.Cd, CdSup: 1.75 });
    const vTerm = Math.sqrt(2 * body.m * K.g / (K.rho0 * body.Cd * body.topArea));
    const groundFails = !ctx.groundHolds && push.xB > 1e-3;
    const Eground = groundFails ? (finiteRun ? push.lossB + push.EB : Infinity) : 0;
    return {
      F, push, v, mach: v / K.a0, flight, vacuumApex: vacuumApex(v, 0),
      sink: push.xB, footSpeed: push.vBmax || push.vB, groundFails, heldBack, groundLimitForce: RB,
      overLimit: !ctx.groundHolds && F > RB,
      vTerminal: vTerm,
      Ebody: momentumToKE(p, body.m),
      Eground, groundQuake: seismicMagnitude(Eground), groundDisrupts: Eground >= K.EARTH_BIND,
      relativistic: v > 0.01 * K.c,
    };
  }
  function jump(ctx) { return comicAtLeastReal(ctx, jumpOnce, (r) => r.v, sizeVmax('jump', ctx.body)); }

  function stompOnce(ctx) {
    const { body, surface } = ctx;
    const d = body.strokes.stomp;
    const F = actionForce(ctx, 'stomp');
    const mB = body.legEff;
    const mA = body.m - mB;
    const bolted = ctx.anchor === 'bolted';
    const push = pushApart({ F, d, mA, mB, RA: bolted ? Infinity : mA * K.g, RB: 0, mode: ctx.mode, vmax: sizeVmax('stomp', body) });
    const E = push.EB;
    const vFoot = push.vB;
    const vBody = momentumToV(push.pA, body.m);
    const bodyFlight = fly({ v0: vBody, thetaDeg: 90, h0: 0, m: body.m, A: body.topArea, Cd: body.Cd, CdSup: 1.75 });
    const qult = qultFor(surface, body.footB);
    const rhoT = surface.rho || 2000;
    let holeDepth = 0, crater = { D: 0 };
    if (ctx.groundHolds) {
      // Comic ground never breaks: no hole and no crater (energy, quake and blast still apply).
    } else if (vFoot >= 2000 || !isFinite(E)) {
      const L = Math.cbrt(6 * mB / (Math.PI * 1000));
      crater = craterDiameter({ L, v: vFoot, rhoI: 1000, rhoT, angleDeg: 90, E });
    } else {
      holeDepth = penetrationDepth(mB, body.footArea, vFoot, qult, rhoT);
    }
    const share = !isFinite(push.EA + push.EB) ? 0.5 : ((push.EA + push.EB) > 0 ? push.EB / (push.EA + push.EB) : 1);
    return {
      F, push, E, vFoot, footMach: vFoot / K.a0, vBody, bodyFlight, holeDepth, bolted,
      crater: crater.D, craterExtrapolated: !!crater.extrapolated, footShare: share,
      planetScale: E >= K.EARTH_BIND || crater.D > K.R_E,
      craterBeyondFit: crater.D > 3e5,
      quake: seismicMagnitude(E), disrupts: E >= K.EARTH_BIND,
      tnt: E / K.TNT_J_per_kg,
    };
  }
  function stomp(ctx) { return comicAtLeastReal(ctx, stompOnce, (r) => r.vFoot, sizeVmax('stomp', ctx.body)); }

  function punchOnce(ctx) {
    const { body } = ctx;
    const d = body.strokes.punch;
    const F = actionForce(ctx, 'punch');
    const mB = body.handEff;
    const mA = body.m - mB;
    const anc = anchorCapacity({ body, surface: ctx.surface, theta: 0, anchor: ctx.anchor, groundHolds: ctx.groundHolds, mA });
    const push = pushApart({ F, d, mA, mB, RA: anc.R, RB: 0, mode: ctx.mode, vmax: sizeVmax('punch', body) });
    // Everything the arm put in (fist plus his own recoil) is released when the arm stops.
    const Etotal = push.EA + push.EB;
    return {
      F, push, anchor: anc, vFist: push.vB, mach: push.vB / K.a0, Efist: push.EB, E: Etotal,
      lurch: push.xA, recoilV: push.vA, recoilE: push.EA,
      tnt: Etotal / K.TNT_J_per_kg,
      stagT: stagnationT(push.vB), stagTIdeal: stagnationTIdeal(push.vB),
    };
  }
  function punch(ctx) { return comicAtLeastReal(ctx, punchOnce, (r) => r.vFist, sizeVmax('punch', ctx.body)); }

  function clapOnce(ctx) {
    const { body } = ctx;
    const d = body.strokes.clap;
    const F = actionForce(ctx, 'clap');
    const mB = body.handEff;
    const push = pushApart({ F, d, mA: body.m, mB, RA: Infinity, RB: 0, mode: ctx.mode, vmax: sizeVmax('clap', body) });
    const E = 2 * push.EB;
    return { F, push, vHand: push.vB, mach: push.vB / K.a0, E, tnt: E / K.TNT_J_per_kg };
  }
  function clap(ctx) { return comicAtLeastReal(ctx, clapOnce, (r) => r.vHand, sizeVmax('clap', ctx.body)); }

  function sprint(ctx) {
    const { body, surface } = ctx;
    const W = body.m * K.g;
    if (!(ctx.F > W)) {
      return { thrust: 0, limit: 'too weak to sprint', accel: 0, accelG: 0, vTop: 0, topLimit: 'body weight', mach: 0, t100: Infinity, dragPower: 0, airPerSecond: 0, stagT: K.T0, relativistic: false, cantStand: true };
    }
    let thrust;
    let limit;
    let sinks = false;
    if (ctx.anchor === 'bolted') { thrust = ctx.F; limit = 'strength'; }
    else {
      // Average normal force over a stride equals his weight; each stance briefly carries
      // about 2.5x body weight on one foot. A soft surface caps that.
      const qult = qultFor(surface, body.footB);
      const stanceCap = ctx.groundHolds ? Infinity : qult * body.footArea / 2.5;
      sinks = stanceCap < W;
      const Nuse = Math.min(W, stanceCap);
      const dig = ctx.anchor === 'braced' ? surface.shear * body.digArea * 0.25 : 0;
      const cap = surface.mu * Nuse + dig;
      thrust = Math.min(ctx.F, cap);
      limit = ctx.F < cap ? 'strength' : (ctx.anchor === 'braced' ? 'shear' : (sinks ? 'soft ground' : 'friction'));
    }
    let vDrag = Math.sqrt(2 * thrust / (K.rho0 * body.Cd * body.frontArea));
    if (!isFinite(vDrag) || vDrag > K.c) vDrag = K.c;
    let vTop = vDrag;
    let topLimit = 'air drag';
    // Leg speed: Bolt's speed at record strength. Comic speeds grow as sqrt(net force x stroke /
    // mass) like every other comic move; real muscle stops at the cap (scaled with size).
    const Fcal = CAL_LIFT_KG * K.g - BASE_M * K.g;
    const ratio = isFinite(ctx.F) ? Math.max(0, (ctx.F - W) / Fcal) * (BASE_M / body.m) * body.s : Infinity;
    let legCap = MUSCLE.run.atCal * Math.sqrt(ratio);
    if (ctx.mode === 'real') legCap = Math.min(legCap, MUSCLE.run.cap * body.s);
    if (legCap < vTop) { vTop = legCap; topLimit = 'leg speed'; }
    const accel = thrust / body.m;
    // constant push against drag growing with v^2: t = (vDrag / a) atanh(v / vDrag)
    const t100 = isFinite(accel) ? (vTop > 27.78 ? (vDrag / accel) * Math.atanh(27.78 / vDrag) : Infinity) : 0;
    const vCl = Math.min(vTop, 0.01 * K.c);
    const dragPower = 0.5 * K.rho0 * body.Cd * body.frontArea * Math.pow(vCl, 3);
    return {
      thrust, limit, accel, accelG: accel / K.g, vTop, topLimit, mach: vTop / K.a0, t100, sinks,
      dragPower, airPerSecond: K.rho0 * body.frontArea * vCl,
      stagT: stagnationT(vCl),
      relativistic: vTop > 0.01 * K.c,
    };
  }

  function pull(ctx, obj) {
    const { body, surface } = ctx;
    const crr = obj.crr != null ? obj.crr : 0.5;
    const resist = crr * obj.m * K.g;
    const anc = anchorCapacity({ body, surface, theta: 0, anchor: ctx.anchor, groundHolds: ctx.groundHolds });
    const usable = Math.min(ctx.F, anc.R);
    const net = usable - resist;
    const M = obj.m + body.m;
    const accel = net > 0 ? net / M : 0;
    // Time to cover 10 m from rest under constant force, relativistically exact.
    const t10m = net > 0 ? Math.sqrt(2 * 10 / accel + (10 / K.c) ** 2) : Infinity;
    return {
      resist, crr, rolling: obj.crr != null, anchor: anc, usable,
      canMove: net > 0, accel, t10m, vEnd: net > 0 ? momentumToV(net * t10m, M) : 0,
      limitedBy: ctx.F < resist ? 'strength' : (anc.R < resist ? anc.limit : null),
    };
  }

  // Smallest strength at which predicate(x) flips to true. Log-space bisection; assumes the
  // predicate is monotone in x.
  function threshold(pred, lo, hi) {
    if (pred(lo)) return lo;
    if (!pred(hi)) return Infinity;
    for (let i = 0; i < 80; i++) {
      const mid = Math.sqrt(lo * hi);
      if (pred(mid)) hi = mid; else lo = mid;
      if (hi / lo < 1 + 1e-4) break;
    }
    return hi;
  }

  // Comic mode keeps the drive force a fixed share of full strength at every speed.
  // That share is set so comic and real muscle agree at world-record human strength,
  // using the same moves the page runs (rigid ground, bolted footing).
  const CAL_SHOT = { m: 7.26, area: 0.0113, Cd: 0.46, CdSup: 0.92 };
  const CAL_BALL = { m: 0.1453, area: 0.00427, Cd: 0.35, CdSup: 0.92 };
  function calibrateComic() {
    const body = makeBody({});
    const surface = { qult: 1e9, mu: 0.8, shear: 1e7, rho: 2400 };
    const base = { F: CAL_LIFT_KG * K.g, body, surface, groundHolds: true, anchor: 'bolted', noBlend: true };
    const cases = {
      throwPush: (c) => throwOnce(c, CAL_SHOT, 37).v,
      throwWhip: (c) => throwOnce(c, CAL_BALL, 0).v,
      punch: (c) => punchOnce(c).vFist,
      clap: (c) => clapOnce(c).vHand,
      jump: (c) => jumpOnce(c).v,
      stomp: (c) => stompOnce(c).vFoot,
    };
    for (const [key, fn] of Object.entries(cases)) {
      const target = fn(Object.assign({}, base, { mode: 'real' }));
      let lo = 1e-5, hi = 2;
      for (let i = 0; i < 100; i++) {
        const mid = Math.sqrt(lo * hi);
        MUSCLE[key].comicFrac = mid;
        if (fn(Object.assign({}, base, { mode: 'comic' })) < target) lo = mid; else hi = mid;
      }
      MUSCLE[key].comicFrac = Math.sqrt(lo * hi);
    }
  }
  calibrateComic();

  return {
    K, MUSCLE, CAL_LIFT_KG, V_ESC, makeBody, qultFor,
    momentumToV, momentumToKE, vToMomentum, keFromV, xOfT,
    hill, pushApart, anchorCapacity,
    rhoAt, stagnationT, stagnationTIdeal, cdAt, conicTo, fly, vacuumApex, craterDiameter, seismicMagnitude,
    kgRatio, overpressureAt, blastRadius, penetrationDepth,
    lift, throwObject, jump, stomp, punch, clap, sprint, pull, threshold, calibrateComic,
    throwOnce, jumpOnce, stompOnce, punchOnce, clapOnce,
  };
});
