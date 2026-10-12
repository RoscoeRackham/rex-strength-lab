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
    G: 6.6743e-11,           // Newtonian constant of gravitation, m^3/(kg s^2) (CODATA 2022)
    M_E: 5.9722e24,          // Earth's mass, kg (NASA Earth fact sheet)
  };
  const V_ESC = Math.sqrt(2 * K.GM / K.R_E);

  // ---------------------------------------------------------------------------
  // Body model. Isometric scaling from a 2.0 m, 180 kg baseline.
  // ---------------------------------------------------------------------------
  const BASE_H = 2.0;
  const BASE_M = 180;
  // Body volume at the baseline size: 180 kg at 1,000 kg/m^3 (about the density of water and of a
  // human body). Volume scales with height cubed; density = mass / volume.
  const BASE_V = 0.18;
  // Builds: body volume as a multiple of height cubed, frontal area and one foot's sole as multiples
  // of height squared, and the default density. 'human' is the calibration body above (2 m, 180 kg).
  // 'rex' and 'ollie': areas measured from their reference picture; volume set by the owners' ruling on
  // mass at the build density (see research/final-duo.json).
  const BUILDS = {
    human: { kV: BASE_V / 8, kFront: 0.2, kFoot: 0.01125, rho: 1000 },
    rex: { kV: 0.10017, kFront: 0.4736, kFoot: 0.03337, rho: 1060 },   // 2.84 m^3, 4.4 m^2 (tail trailing), 0.31 m^2 paws at 10 ft
    ollie: { kV: 0.10017, kFront: 0.4844, kFoot: 0.01615, rho: 1060 }, // 2.84 m^3, 4.5 m^2, 0.15 m^2 boots at 10 ft
  };
  // Default bodies on the page: 10 ft by the owners' ruling. Mass by ruling too: Rex is 2,700 kg without
  // his tail (307 kg, measured from the picture), and Ollie weighs the same in all.
  const DEFAULT_BODIES = { rex: { H: 3.048, m: 3007 }, ollie: { H: 3.048, m: 3007 } };
  const buildOf = (b) => (typeof b === 'string' ? BUILDS[b] : b) || BUILDS.human;
  function bodyVolume(H, build) { const h = H || BASE_H; return buildOf(build).kV * h * h * h; }

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
    const B = buildOf(o.build);
    const volume = B.kV * H * H * H;
    const m = o.m || B.rho * volume;
    const footArea = B.kFoot * H * H;  // one foot's sole, m^2
    return {
      H, s, m, build: typeof o.build === 'string' ? o.build : 'human',
      volume, rho: m / volume,
      footArea,
      footB: Math.sqrt(footArea),  // equivalent square footing width, m
      palmArea: 0.015 * s * s,     // one hand, m^2
      frontArea: B.kFront * H * H, // facing the direction of travel, m^2
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
  // Self-gravity. His body is treated as a ball of the same volume (the "equivalent radius").
  // ---------------------------------------------------------------------------
  function eqRadius(body) { return Math.cbrt(3 * body.volume / (4 * Math.PI)); }
  // Density at which a body of height H fits inside its own Schwarzschild radius 2Gm/c^2.
  function blackHoleDensity(H, build) { const r = Math.cbrt(3 * bodyVolume(H, build) / (4 * Math.PI)); return 3 * K.c * K.c / (8 * Math.PI * K.G * r * r); }
  function isBlackHole(body) { return 2 * K.G * body.m / (K.c * K.c) >= eqRadius(body); }
  // Pull between two bodies whose centres are d apart (never closer than touching).
  function mutualGravity(bA, bB, d) {
    const dc = eqRadius(bA) + eqRadius(bB), dd = d == null ? dc : Math.max(d, dc);
    const mu = K.G * (bA.m + bB.m);
    return { d: dd, dContact: dc, F: K.G * bA.m * bB.m / (dd * dd), vEsc: Math.sqrt(2 * mu / dd), Ebind: K.G * bA.m * bB.m / dd };
  }
  // Two bodies released at rest d0 apart fall together to d1 (radial Kepler orbit).
  function fallTogether(bA, bB, d0, d1) {
    if (!(d0 > d1)) return { t: 0, vRel: 0, E: 0 };
    const mu = K.G * (bA.m + bB.m), x = d1 / d0;
    return {
      t: Math.sqrt(d0 * d0 * d0 / (2 * mu)) * (Math.sqrt(x * (1 - x)) + Math.acos(Math.sqrt(x))),
      vRel: Math.sqrt(2 * mu * (1 / d1 - 1 / d0)),
      E: K.G * bA.m * bB.m * (1 / d1 - 1 / d0),
    };
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
    let tEst = Math.max(tComic, d / vmax);
    // Barely past what holds them, the push creeps at the Hill speed where its force meets that
    // resistance. Size the step to that crawl, or the stroke takes hundreds of thousands of steps.
    const Rmin = Math.min(aFree ? RA0 : Infinity, bFree ? RB : Infinity);
    if (isFinite(Rmin) && Rmin > 0) {
      let lo = 0, hi = vmax;
      for (let i = 0; i < 60; i++) { const mid = 0.5 * (lo + hi); if (force(mid) > Rmin) lo = mid; else hi = mid; }
      if (lo > 0 && d / lo > 20 * tEst) tEst = d / lo;
    }
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
  // Density, weight and the planet under him
  // ---------------------------------------------------------------------------
  const W8 = {
    OMEGA_E: 2 * Math.PI / (23.9345 * 3600), // Earth's sidereal spin, rad/s (NASA Earth fact sheet)
    SIGMA_ROCK: 1.7e9,       // rock strength resisting him at any depth, Pa (the granite bearing estimate)
    RHO_ROCK: 2700,          // granite density, kg/m^3
    UCS_ROCK: 2.0e8,         // unconfined compressive strength of strong rock near the surface, Pa
    R_AIR: 287.0528,         // specific gas constant of dry air, J/(kg K)
    NQ: { sand: 18.40, gravel: 64.19 }, // bearing factor N_q (USACE EM 1110-1-1905, phi 30 and 40 deg)
    WALK_LOAD: 1.2,          // peak load on one leg per step, x body weight (people: 1.0-1.5)
    JEANS: 6,                // keeps a gas if escape speed > 6 x the molecules' rms speed
    E_NM: 16.3 * 1.602176634e-13 / 1.67492750e-27, // J/kg freed when neutron matter decompresses: 16.3 +- 2.2 MeV per neutron at nuclear density (Hebeler et al. 2010)
    P_NM: [1.4e19 * 1.602176634e13, 2.1e19 * 1.602176634e13], // Pa, pressure of neutron matter at nuclear density
    RHO_NUC: 2.7e17,         // nuclear saturation density, kg/m^3 (Hebeler et al. 2010); the neutron-matter caveat starts at 1e17
    RHO_DRIP: 4e14,          // neutron drip: above ~4e11 g/cm^3 free neutrons leave the nuclei (Chamel & Haensel 2008, Living Rev. Relativ. 11:10)
    RHO_CRUST_CORE: 1e17,    // base of a neutron star's crust, ~rho0/3 ~ 1e14 g/cm^3: nuclei dissolve into uniform neutron matter (same source)
    RHO_NS_CORE: 2.7e18,     // densest neutron-star cores, about 10 x nuclear density (Lattimer & Prakash 2004: up to 5-10 n0)
    RHO_OSMIUM: 22587,       // densest element at everyday pressure, kg/m^3
    M_RESHAPE: 1e-3 * K.M_E, // above this his pull reshapes the planet; moves are no longer modelled
    SIGMA_LOW: 0.1e9, SIGMA_HIGH: 4.1e9, // plausible range of rock strength (weak to strong rock), Pa
    CS_ROCK: 6000,           // typical speed of sound in rock for the gravitational-drag term, m/s (estimate)
    CS_LOW: 3200,            // slowest PREM wave speed in solid rock (crustal S waves), m/s: the fast end of the settling range
    BONDI_LAMBDA: 0.625,     // Bondi's accretion eigenvalue for air (gamma = 1.4)
  };
  W8.V_RMS_AIR = Math.sqrt(3 * W8.R_AIR * K.T0);
  const LEG_SHARE = () => MUSCLE.jump.forceFrac;

  // PREM (Dziewonski & Anderson 1981): density polynomials in x = r / 6371 km, g/cm^3.
  // Its 3 km ocean is replaced by upper crust: Rex starts on land.
  const PREM = [
    [1221.5e3, [13.0885, 0, -8.8381, 0], true],
    [3480.0e3, [12.5815, -1.2638, -3.6426, -5.5281], false],
    [5701.0e3, [7.9565, -6.4761, 5.5283, -3.0807], true],
    [5771.0e3, [5.3197, -1.4836, 0, 0], true],
    [5971.0e3, [11.2494, -8.0298, 0, 0], true],
    [6151.0e3, [7.1089, -3.8045, 0, 0], true],
    [6346.6e3, [2.6910, 0.6924, 0, 0], true],
    [6356.0e3, [2.900, 0, 0, 0], true],
    [6371.0e3, [2.600, 0, 0, 0], true],
  ];
  const PREM_NAMES = ['inner core', 'outer core', 'lower mantle', 'lower mantle', 'transition zone', 'upper mantle', 'upper mantle', 'crust', 'crust'];
  function premLayer(r) { for (let i = 0; i < PREM.length; i++) if (r <= PREM[i][0]) return i; return -1; }
  function premRho(r) {
    const i = premLayer(r); if (i < 0) return 0;
    const a = PREM[i][1], x = r / K.R_E;
    return 1000 * (a[0] + x * (a[1] + x * (a[2] + x * a[3])));
  }
  function premSolid(r) { const i = premLayer(r); return i >= 0 && PREM[i][2]; }
  function premShellMass(a, r1, r2) {
    let m = 0;
    for (let k = 0; k < 4; k++) if (a[k]) m += 1000 * a[k] / Math.pow(K.R_E, k) * (Math.pow(r2, k + 3) - Math.pow(r1, k + 3)) / (k + 3);
    return 4 * Math.PI * m;
  }
  const PREM_CUM = [];
  { let acc = 0, lo = 0; for (const [top, a] of PREM) { PREM_CUM.push(acc); acc += premShellMass(a, lo, top); lo = top; } PREM_CUM.push(acc); }
  const PREM_MTOT = PREM_CUM[PREM_CUM.length - 1];
  function premMassFrac(r) {
    if (r >= K.R_E) return 1;
    const i = premLayer(r), lo = i ? PREM[i - 1][0] : 0;
    return (PREM_CUM[i] + premShellMass(PREM[i][1], lo, r)) / PREM_MTOT;
  }
  // gravity inside the Earth, scaled so it matches the engine's GM at the surface
  function premG(r) { if (r <= 0) return 0; return K.GM * premMassFrac(Math.min(r, K.R_E)) / (r * r); }
  // potential relative to the surface (0 at R_E, negative inside): 1 km Simpson table, analytic in the inner core
  const PHI_N = 6371, PHI = new Float64Array(PHI_N + 1);
  {
    const dr = K.R_E / PHI_N;
    for (let i = PHI_N - 1; i >= 0; i--) { const ra = i * dr, rb = (i + 1) * dr; PHI[i] = PHI[i + 1] - dr / 6 * (premG(ra) + 4 * premG(0.5 * (ra + rb)) + premG(rb)); }
  }
  const PREM_IC = PREM[0][1], PREM_GS = K.GM / (K.G * PREM_MTOT);
  const phiIC = (r) => 4 * Math.PI * K.G * PREM_GS * 1000 * (PREM_IC[0] * r * r / 6 + PREM_IC[2] * r * r * r * r / (20 * K.R_E * K.R_E));
  const PHI_ICB = (() => { const rb = PREM[0][0], f = rb / K.R_E * PHI_N, i = Math.floor(f), t = f - i; return PHI[i] * (1 - t) + PHI[i + 1] * t - phiIC(rb); })();
  function premPhi(r) {
    if (r >= K.R_E) return K.GM / K.R_E - K.GM / r;
    if (r <= PREM[0][0]) return PHI_ICB + phiIC(r);
    const f = r / K.R_E * PHI_N, i = Math.min(PHI_N - 1, Math.floor(f)), t = f - i;
    return PHI[i] * (1 - t) + PHI[i + 1] * t;
  }

  // His own gravity, treating him as a ball of his volume (a point mass outside it).
  function bodyGravity(body) {
    const m = body.m, R = eqRadius(body), GM = K.G * m;
    const rs = 2 * GM / (K.c * K.c);
    const vEsc = Math.min(K.c, Math.sqrt(2 * GM / R));
    const dBeat = Math.sqrt(GM / K.g);
    const rB = GM / (K.a0 * K.a0);
    const bondiOutside = rB > R;
    // Bondi rate 4 pi lambda G^2 M^2 rho / c^3 with lambda = 0.625: rough, with no heating feedback.
    // He can't swallow the air, so in reality it piles up on him and the inflow slows.
    const bondiRate = bondiOutside ? 4 * Math.PI * W8.BONDI_LAMBDA * GM * GM * K.rho0 / Math.pow(K.a0, 3) : 0;
    const tidal = (d, L) => GM * (1 / Math.pow(d - L / 2, 2) - 1 / Math.pow(d + L / 2, 2));
    // distance at which a 1.8 m person lying along the line to him is stretched by 1 g
    let tidal1g = 0;
    { const L = 1.8, f = (d) => tidal(d, L) - K.g; let lo = R + L / 2, hi = 1e12; if (f(lo) > 0) { for (let i = 0; i < 200; i++) { const mid = Math.sqrt(lo * hi); if (f(mid) > 0) lo = mid; else hi = mid; } tidal1g = lo; } }
    return {
      GM, R, rs, blackHole: rs >= R, buchdahl: rs > (8 / 9) * R,
      gSurf: GM / (R * R), vEsc, dBeat, beatsOutside: dBeat > R,
      rBondi: rB, bondiOutside, bondiRate, heatPerKg: GM / R, infallPower: bondiRate * GM / R,
      infallT: vEsc < 0.01 * K.c ? stagnationT(vEsc) : Infinity,
      holdsAir: vEsc > W8.JEANS * W8.V_RMS_AIR,
      rCrush: W8.RHO_ROCK * GM / W8.SIGMA_ROCK, rCrushUnconfined: W8.RHO_ROCK * GM / W8.UCS_ROCK,
      tidal, tidal1g,
      // stretch on an 80 kg, 1.8 m person lying along the line to him at 10 m: tension through their middle
      tidal10: d10Tension(tidal, R),
      decompJ: body.rho >= W8.RHO_CRUST_CORE ? m * W8.E_NM : 0,
      atmosphereLossT: bondiRate > 0 ? 5.1e18 / bondiRate : Infinity,
    };
  }
  function d10Tension(tidal, R) { const d = Math.max(10, R + 0.9); return { d, da: tidal(d, 1.8), T: 80 * tidal(d, 1.8) / 8 }; }
  // Something released at rest d0 from his middle falls onto him (his pull only).
  function infallFrom(GM, R, d0) {
    if (!(d0 > R)) return { t: 0, v: 0 };
    const x = R / d0;
    return { t: Math.sqrt(d0 * d0 * d0 / (2 * GM)) * (Math.sqrt(x * (1 - x)) + Math.acos(Math.sqrt(x))), v: Math.sqrt(2 * GM * (1 / R - 1 / d0)) };
  }
  // Can his legs move his own weight? Both legs together push up to 1.4x the dial (the jump's share). Stand: that beats W.
  // Walk: it beats the ~1.2 W a step puts on one leg (rough rule: one near-straight leg is taken to match both legs'
  // squat push). Run: the Sprint tab's rough rule, strength above his weight (real running peaks of 2-2.9 W per stance
  // come from springy, near-straight legs, which the dial doesn't model).
  function moveCheck(F, m) {
    const Wt = m * K.g, leg = LEG_SHARE() * F;
    return {
      weight: Wt, legForce: leg, stand: leg >= Wt, walk: leg >= W8.WALK_LOAD * Wt, run: F > Wt,
      standNeedKg: m / LEG_SHARE(), walkNeedKg: W8.WALK_LOAD * m / LEG_SHARE(), runNeedKg: m,
    };
  }
  // The ground under his own weight: stands (leaving a print in soil), sinks, punches through a thin layer, or no rock
  // can hold him. Soil uses standDepth, the Walk tab's footprint rules at his standing pressure: first under his feet,
  // then, once they are in past his leg length, under his whole underside.
  function groundUnderWeight(body, surface, groundHolds) {
    const Wt = body.m * K.g, Af = 2 * body.footArea, Ab = body.topArea, Lleg = 0.45 * body.H;
    const p1 = Wt / Af, p2 = Wt / Ab, sd1 = standDepth(surface, p1, body.footB, body.H);
    const q0f = sd1 ? sd1.qFail : qultFor(surface, body.footB);
    // once buried, the rock buoys him up: the same test fallThrough uses to decide he is held (PREM crust, surface gravity)
    const Wnet = (body.m - premRho(K.R_E - 1) * body.volume) * premG(K.R_E);
    const out = { weight: Wt, footPressure: p1, bodyPressure: p2, q0: q0f, standRatio: p1 / q0f, rockRatio: Wnet / (W8.SIGMA_ROCK * Ab), rockCap: W8.SIGMA_ROCK * Ab, sink: 0, print: 0, legLength: Lleg,
      strongRockHolds: Wnet <= W8.SIGMA_HIGH * Ab, weakRockFails: Wnet > W8.SIGMA_LOW * Ab };
    if (groundHolds) return Object.assign(out, { regime: 'comic', standRatio: 0 });
    if (Wnet > W8.SIGMA_ROCK * Ab) return Object.assign(out, { regime: 'fallsThrough' });
    if (sd1) {
      if (p1 <= q0f) return Object.assign(out, { regime: 'stands', print: sd1.depth, extrapolated: sd1.extrapolated });
      if (sd1.depth <= Lleg) return Object.assign(out, { regime: 'sinks', sink: sd1.depth, stage: 'feet' });
      const sd2 = standDepth(surface, p2, Math.sqrt(Ab), body.H);
      const D2 = Math.max(Lleg, sd2.depth);
      if (D2 <= body.H) return Object.assign(out, { regime: 'sinks', sink: D2, stage: 'body' });
      return Object.assign(out, { regime: 'outOfSight', sink: D2, stage: 'body' });
    }
    if (p1 <= q0f) return Object.assign(out, { regime: 'stands' });
    if (surface.id === 'granite') return Object.assign(out, { regime: 'sinks', sink: Lleg, stage: 'rock' });
    return Object.assign(out, { regime: 'punchesThrough', layer: surface.id });
  }
  // Falling into the planet: 3-D, non-spinning frame, Earth turning about z. Rock resists motion relative to
  // it with area x (strength + rho v^2) (none in the liquid outer core), plus buoyancy rho V g.
  // Gravitational drag (dynamical friction): his own pull piles up a wake of rock behind him that pulls him
  // back. Ostriker's (1999) form for a gas, F = 4 pi G^2 m^2 rho I(M) / v^2 with M = v / c_s, used for rock as a
  // rough estimate. It grows as m^2, so it dominates for very dense bodies. dfCoef returns F / (m v), the
  // factor that multiplies his velocity relative to the rock.
  const DF_LNL = 5;   // Coulomb logarithm for supersonic motion (estimate, 3-10)
  function dfI(M) {
    if (M < 1e-3) return M * M * M / 3;
    if (M < 1) return Math.min(DF_LNL, 0.5 * Math.log((1 + M) / (1 - M)) - M);
    return Math.max(0, Math.min(DF_LNL, 0.5 * Math.log(Math.max(1e-300, 1 - 1 / (M * M))) + DF_LNL));
  }
  function dfCoef(m, rho, v, csIn) {
    const cs = csIn || W8.CS_ROCK, M = v / cs;
    const Iv3 = M < 1e-3 ? 1 / (3 * cs * cs * cs) : dfI(M) / (v * v * v);
    return 4 * Math.PI * K.G * K.G * m * rho * Iv3;
  }
  function fallThrough(body, o) {
    const opt = o || {};
    const m = body.m, A = body.topArea, V = body.volume, kP = opt.k || K.PONCELET_K, RE = K.R_E, SIG = opt.sigma || W8.SIGMA_ROCK;
    const lat = (opt.latDeg || 0) * Math.PI / 180, Om = W8.OMEGA_E;
    const tMax = opt.tMax || 2 * 86400;
    const acc = (s) => {
      const r = Math.hypot(s[0], s[1], s[2]), gr = premG(r);
      let ax = -gr * s[0] / r, ay = -gr * s[1] / r, az = -gr * s[2] / r;
      if (r < RE && !opt.noDrag) {
        const rho = premRho(r), b = rho * V / m * gr;
        ax += b * s[0] / r; ay += b * s[1] / r; az += b * s[2] / r;
        const rx = s[3] + Om * s[1], ry = s[4] - Om * s[0], rz = s[5], vr = Math.hypot(rx, ry, rz);
        if (vr > 0) { const f = A * kP * rho * vr / m + (opt.noDF ? 0 : dfCoef(m, rho, vr, opt.cs)); ax -= f * rx; ay -= f * ry; az -= f * rz; }
      }
      return [s[3], s[4], s[5], ax, ay, az];
    };
    let s = [RE * Math.cos(lat), 0, RE * Math.sin(lat), 0, Om * RE * Math.cos(lat), 0], t = 0;
    let minR = RE, maxV = 0, stuck = null, firstPass = null, innermost = false, prevVr = -1, steps = 0, lastRec = -Infinity;
    const path = opt.record ? [[RE, 0]] : null;
    const vRad = (q) => (q[0] * q[3] + q[1] * q[4] + q[2] * q[5]) / Math.hypot(q[0], q[1], q[2]);
    while (t < tMax && steps < 400000) {
      const r = Math.hypot(s[0], s[1], s[2]), v = Math.hypot(s[3], s[4], s[5]);
      const vrel = Math.hypot(s[3] + Om * s[1], s[4] - Om * s[0], s[5]);
      // gravity inside the Earth is smooth (nearly linear in the core), so the step needs no shrinking near the centre
      const dt = Math.min((RE - r < 20e3) ? 1 : (vrel > 100 ? 3 : 10), Math.max(1e-3, 0.002 * Math.max(r, 1e6) / Math.max(v, 1)));
      const k1 = acc(s), s2 = s.map((q, i) => q + 0.5 * dt * k1[i]);
      const k2 = acc(s2), s3 = s.map((q, i) => q + 0.5 * dt * k2[i]);
      const k3 = acc(s3), s4 = s.map((q, i) => q + dt * k3[i]);
      const k4 = acc(s4);
      const ns = s.map((q, i) => q + dt / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
      t += dt; steps++;
      // rock strength: a friction impulse of at most sigma A dt / m against motion relative to the rock
      const nr = Math.hypot(ns[0], ns[1], ns[2]);
      if (nr < RE && premSolid(nr) && !opt.noDrag) {
        const rel = [ns[3] + Om * ns[1], ns[4] - Om * ns[0], ns[5]], vr = Math.hypot(rel[0], rel[1], rel[2]);
        const dv = SIG * A * dt / m, k = vr > dv ? (vr - dv) / vr : 0;
        ns[3] = -Om * ns[1] + rel[0] * k; ns[4] = Om * ns[0] + rel[1] * k; ns[5] = rel[2] * k;
        if (k === 0 && Math.abs(m - premRho(nr) * V) * premG(nr) <= SIG * A) { stuck = { t, r: nr }; s = ns; break; }
      }
      if (nr < minR) minR = nr;
      const vr = vRad(ns);
      // a real pass: he went deep (past half the radius) and the radial speed turned with some margin
      // (friction can zero his speed near the surface, which flips the sign by round-off)
      if (!innermost && prevVr < 0 && vr >= 0 && minR < 0.5 * RE) innermost = true;
      if (innermost && !firstPass && vr <= 0 && prevVr > 0) {
        // far turnaround: where on the far side, relative to the antipode on the turning Earth
        const lon = (Math.atan2(ns[1], ns[0]) - Om * t) * 180 / Math.PI;
        const dLon = ((lon - 180) % 360 + 540) % 360 - 180;
        const rTop = Math.hypot(s[0], s[1], s[2]) + prevVr * prevVr / (2 * premG(nr));
        firstPass = { t, r: rTop, depthShort: Math.max(0, RE - rTop), dLonDeg: dLon, westKm: -dLon * Math.PI / 180 * RE / 1000, latDeg: Math.asin(ns[2] / nr) * 180 / Math.PI };
      }
      prevVr = vr;
      maxV = Math.max(maxV, Math.hypot(ns[3], ns[4], ns[5]));
      s = ns;
      if (path && t - lastRec >= 20) { const c = Math.cos(Om * t), sn = Math.sin(Om * t); path.push([s[0] * c + s[1] * sn, -s[0] * sn + s[1] * c]); lastRec = t; }
      if (firstPass && !opt.full) break;
    }
    if (path) { const c = Math.cos(Om * t), sn = Math.sin(Om * t); path.push([s[0] * c + s[1] * sn, -s[0] * sn + s[1] * c]); }
    const rEnd = Math.hypot(s[0], s[1], s[2]);
    let end = null;
    if (stuck) {
      // where he stops on the turning Earth, as an angle from where he went in, wrapped to -180..180 degrees.
      // Past 90 degrees he stopped on the far side of the centre (he swung through it): no east/west drift then.
      const lonRaw = (Math.atan2(s[1], s[0]) - W8.OMEGA_E * t) * 180 / Math.PI;
      const lon = ((lonRaw % 360) + 540) % 360 - 180;
      const farSide = Math.abs(lon) > 90;
      // passedCentre: he went past his closest approach to the centre (deep, radial speed turned) before rock held him
      end = { t: stuck.t, r: stuck.r, depth: RE - stuck.r, layer: PREM_NAMES[premLayer(stuck.r)], lonDeg: lon, farSide, passedCentre: innermost || farSide, driftKm: farSide ? 0 : lon * Math.PI / 180 * stuck.r / 1000 };
    }
    return { t, steps, minR, maxV, stuck: end, firstPass, stillSinking: !stuck && !firstPass, rEnd, path };
  }
  // Farthest from the centre that rock of strength SIG can hold him at rest (his weight less buoyancy vs SIG x area).
  function restRadius(body, SIG) {
    const m = body.m, Ab = body.topArea, V = body.volume;
    let lo = 0, hi = K.R_E;
    for (let i = 0; i < 100; i++) { const mid = 0.5 * (lo + hi); const F = (m - premRho(mid) * V) * premG(mid); if (F > SIG * Ab || !premSolid(mid)) hi = mid; else lo = mid; }
    return lo;
  }
  // Long-term settling for a body that loses little energy per trip: orbit-averaged amplitude decay,
  // each half-trip treated as straight through the centre.
  function settle(body, Amax, o) {
    const opt = o || {};
    const m = body.m, Ab = body.topArea, V = body.volume, kP = opt.k || K.PONCELET_K, RE = K.R_E, SIG = opt.sigma || W8.SIGMA_ROCK;
    const top = Math.min(Amax || RE, RE);
    const rStop = restRadius(body, SIG);
    const NT = 200, NA = 600;
    const passFor = (Amp) => {
      let T = 0, dE = 0;
      const phiA = premPhi(Amp);
      for (let i = 0; i < NT; i++) {
        const th = -Math.PI / 2 + (i + 0.5) * Math.PI / NT, r = Math.abs(Amp * Math.sin(th)), dr = Amp * Math.cos(th) * Math.PI / NT;
        const v2 = Math.max(0, 2 * (phiA - premPhi(r))), v = Math.sqrt(v2);
        if (v > 0) T += dr / v;
        const rho = premRho(r);
        // forces (N) times distance: rock strength, shoving (rho v^2), gravitational drag (m x dfCoef x v)
        dE += (Ab * (premSolid(r) ? SIG : 0) + Ab * kP * rho * v2 + (opt.noDF ? 0 : m * dfCoef(m, rho, v, opt.cs) * v)) * dr;
      }
      return { T, dE };
    };
    let halfPasses = 0, time = 0, prev = null;
    const lo = Math.max(rStop, 1);
    for (let i = 0; i <= NA; i++) {
      const Amp = lo * Math.pow(top / lo, i / NA);
      const { T, dE } = passFor(Amp);
      const dndA = m * premG(Amp) * (1 - premRho(Amp) * V / m) / dE;
      const cur = { Amp, dndA, dtdA: dndA * T };
      if (prev) { const h = Amp - prev.Amp; halfPasses += 0.5 * h * (prev.dndA + cur.dndA); time += 0.5 * h * (prev.dtdA + cur.dtdA); }
      prev = cur;
    }
    const first = passFor(top * 0.99999);
    return { rStop, halfPasses, years: time / (365.25 * 86400), firstPassLossJ: first.dE, firstHalfPeriod: first.T, energyJ: m * (0 - premPhi(rStop)) };
  }
  function planetRegime(m, grav) {
    if (grav.blackHole) return { regime: 'blackHole', eLowIsFloor: true, massRatioEarth: m / K.M_E, tff: (Math.PI / 2) * Math.sqrt(Math.pow(K.R_E, 3) / (2 * K.G * (m + K.M_E))), eLow: K.G * m * K.M_E / K.R_E };
    if (m >= K.M_E) return { regime: 'earthFalls', eLowIsFloor: true, massRatioEarth: m / K.M_E, tff: (Math.PI / 2) * Math.sqrt(Math.pow(K.R_E, 3) / (2 * K.G * (m + K.M_E))), eLow: K.G * m * K.M_E / K.R_E };
    // he sinks to the centre: at least the energy of sinking through the undisturbed Earth (the planet squeezing round him adds more)
    if (m >= W8.M_RESHAPE) return { regime: 'reshapes', eLowIsFloor: true, massRatioEarth: m / K.M_E, eLow: m * (0 - premPhi(0)) };
    return { regime: 'none', massRatioEarth: m / K.M_E };
  }
  // The Weight tab: what his mass does to him and the planet while he just stands there.
  const weightCache = new Map();
  function weight(ctx, opts) {
    const o = opts || {};
    const { body, surface, groundHolds } = ctx;
    const key = [body.m, body.H, surface.id, groundHolds, !!o.record].join('|');
    const grav = bodyGravity(body);
    const planet = planetRegime(body.m, grav);
    const ground = groundUnderWeight(body, surface, groundHolds);
    const move = moveCheck(ctx.F, body.m);
    const out = {
      m: body.m, rho: body.rho, V: body.volume, R: grav.R, W: body.m * K.g, strengthRatio: ctx.F / (body.m * K.g),
      move, ground, grav, planet, fall: null, settle: null, energyJ: 0,
      denserThanOsmium: body.rho > W8.RHO_OSMIUM,
      // neutron-star matter (up to the densest neutron-star cores), or denser than any known matter
      nmCaveat: body.rho >= W8.RHO_CRUST_CORE ? { J: grav.decompJ, P: W8.P_NM, rhoNuc: W8.RHO_NUC, beyondNS: body.rho > W8.RHO_NS_CORE } : null,
      // between neutron drip and the base of the crust, squeezed matter is neutron-rich nuclei in a sea of free neutrons
      innerCrust: body.rho >= W8.RHO_DRIP && body.rho < W8.RHO_CRUST_CORE,
    };
    if (planet.regime === 'none' && ground.regime === 'fallsThrough') {
      let cached = weightCache.get(key);
      if (!cached) {
        // First trip in full 3-D. If he comes back up the far side, the rest is many damped swings:
        // average them (checked against full 3-D runs to within about 10%).
        // Heavily damped swings (the first trip ends far below the far side) are integrated in full 3-D.
        let fall = fallThrough(body, { record: o.record });
        if (fall.firstPass && fall.firstPass.depthShort > 0.3 * K.R_E) fall = fallThrough(body, { record: o.record, full: true, tMax: 4 * 86400 });
        let st = null, rEnd;
        if (fall.stuck) rEnd = fall.stuck.r;
        else if (fall.firstPass && fall.t < 2 * fall.firstPass.t) { st = settle(body); rEnd = st.rStop; }
        else { st = settle(body, fall.rEnd); st.years += fall.t / (365.25 * 86400); rEnd = st.rStop; }
        cached = { fall, settle: st, energyJ: body.m * (0 - premPhi(rEnd)) };
        // the same fall with weak and strong rock (and less or more drag), since deep-rock strength is a guess.
        // The most drag: strong rock, k = 2, and gravitational drag with the slowest wave speed in solid rock.
        const MOST = { sigma: W8.SIGMA_HIGH, k: 2, cs: W8.CS_LOW };
        if (fall.stuck) {
          // follow each run until it sticks: weak rock can let him swing through the centre first
          const runs = [[W8.SIGMA_LOW, { sigma: W8.SIGMA_LOW, k: 0.5 }], [W8.SIGMA_HIGH, MOST]].map(([sig, o2]) => {
            const f2 = fallThrough(body, Object.assign({ full: true, tMax: 4 * 86400 }, o2));
            return { r: f2.stuck ? f2.stuck.r : restRadius(body, sig), swings: !!f2.firstPass };
          });
          const rs = runs.map((x) => x.r);
          cached.stuckRange = { rMin: Math.min(...rs, fall.stuck.r), rMax: Math.max(...rs, fall.stuck.r), swings: runs.some((x) => x.swings) };
        }
        if (fall.firstPass) {
          const shorts = [fallThrough(body, { noDF: true }), fallThrough(body, MOST)].map((f) => (f.firstPass ? f.firstPass.depthShort : null)).filter((x) => x != null);
          cached.shortRange = { min: Math.min(fall.firstPass.depthShort, ...shorts), max: Math.max(fall.firstPass.depthShort, ...shorts) };
        }
        if (st) {
          // fastest: strong rock, more drag, gravitational drag with slow waves; slowest: weak rock, less drag, no gravitational drag
          const fast = settle(body, undefined, MOST), slow = settle(body, undefined, { sigma: W8.SIGMA_LOW, k: 0.5, noDF: true });
          cached.settleRange = { yearsMin: Math.min(fast.years, slow.years, st.years), yearsMax: Math.max(fast.years, slow.years, st.years) };
        }
        // past this, his gravity drags the rock around him more than his body pushes it aside
        cached.gravDragDominant = body.m * dfCoef(body.m, 5000, 9900) * 9900 > body.topArea * K.PONCELET_K * 5000 * 9900 * 9900;
        if (weightCache.size > 64) weightCache.clear();
        weightCache.set(key, cached);
      }
      Object.assign(out, cached);
    }
    return out;
  }
  const selfPull = (m, r) => K.G * m / (r * r);
  const selfGravityOn = (body) => K.G * body.m / Math.pow(0.5 * body.H, 2) >= 1e-3 * K.g;
  // where a held object sits: half his height plus half the object, never inside his equal-volume ball
  const heldRadius = (body, obj) => Math.max(eqRadius(body), 0.5 * body.H + 0.5 * (obj.L || Math.cbrt(obj.m / (obj.rho || 1000))));
  const escapeSpeedFrom = (m, r) => Math.sqrt(2 * K.G * m / r);
  // speed left after climbing out of his gravity well from r0 (0 if it can't escape)
  const vInfinity = (v, m, r0) => { const q = v * v - 2 * K.G * m / r0; return q > 0 ? Math.sqrt(q) : 0; };

  // ---------------------------------------------------------------------------
  // Moves. Each takes a shared context:
  //   { F, mode: 'comic'|'real', body, surface, groundHolds, anchor: 'friction'|'braced'|'bolted' }
  // ---------------------------------------------------------------------------
  function sizeVmax(key, body) { return MUSCLE[key].vmax * body.s; }
  // Effort: how hard he chooses to push. ctx.use is the strength he puts into a move's drive (N), never more
  // than the dial (ctx.F); left out, he goes all-out. Standing, walking and holding a load up still get his
  // full strength: effort only sets the push. With real muscle it scales the force at every speed.
  const driveStrength = (ctx) => (ctx.use == null ? ctx.F : Math.min(ctx.F, ctx.use));
  function actionForce(ctx, key) {
    return driveStrength(ctx) * (ctx.mode === 'real' ? MUSCLE[key].forceFrac : MUSCLE[key].comicFrac);
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
    // At extreme density his own pull adds to what his arms hold. That pull is internal to the pair,
    // so the ground still carries only their Earth weight.
    const gSelf = selfGravityOn(body) ? selfPull(body.m, heldRadius(body, obj)) : 0;
    const W = obj.m * (K.g + gSelf);
    const N = (body.m + obj.m) * K.g;
    const move = moveCheck(ctx.F, body.m);
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
      canLift: ctx.F >= W * (1 - 1e-9) && move.stand,
      cantStand: !move.stand, standNeedKg: move.standNeedKg,
      strengthMargin: ctx.F / W,
      weight: W, selfPullG: gSelf / K.g,
      pressure, qult,
      groundRatio: ctx.groundHolds ? 0 : pressure / qult,
      standRatio: ctx.groundHolds ? 0 : (body.m * K.g / feet) / qult,
      footAreaNeeded,
      gripPressure,
      // gentle hold (comic switch): his push is spread through the whole object, so his grip doesn't stress it
      gentle: !!ctx.gentleHold,
      gripRatio: obj.crush && !ctx.gentleHold ? gripPressure / obj.crush : 0,
      gripRatioRaw: obj.crush ? gripPressure / obj.crush : 0,
      plateNeeded: obj.crush && !ctx.gentleHold ? W / obj.crush : 0,
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
    const sgOn = selfGravityOn(body);
    const gSelf = sgOn ? selfPull(body.m, heldRadius(body, obj)) : 0;
    // Holding it ready to throw: Earth's pull on the load and on his own hand and arm, plus his own pull
    // on the load. Held up at his shoulder, his pull points mostly down too, so adding them is a slight
    // overestimate. For a dense thrower most of this is the weight of his own arm (armMass).
    const holdLoad = mB * K.g + obj.m * gSelf;
    const canHold = ctx.F >= holdLoad * (1 - 1e-9);
    const Fdrive = Math.min(driveStrength(ctx), actionForce(ctx, key) * hands);
    // The arms also hold the load up at right angles to the push: only the rest drives it.
    const perp = mB * K.g * Math.cos(th);
    const F = isFinite(Fdrive) ? Math.sqrt(Math.max(0, Fdrive * Fdrive - perp * perp)) : Infinity;
    const RB = mB * K.g * Math.sin(th);
    const anc = anchorCapacity({ body, surface: ctx.surface, theta: th, anchor: ctx.anchor, groundHolds: ctx.groundHolds, mA, mB });
    const out = { F, Fdrive, style, hands, canHold, anchor: anc, mB, armMass, needed: holdLoad, selfPullG: gSelf / K.g };
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
    // A dense Rex's own gravity: the object must climb out of his well (patched conic, from where the
    // push starts). Exact for a constant push; approximate for real muscle.
    const r0 = Math.max(eqRadius(body), 0.25 * body.H);
    const escapeNeeded = sgOn ? escapeSpeedFrom(body.m, r0) : 0;
    const vOut = sgOn && v < 0.01 * K.c ? vInfinity(v, body.m, r0) : v;
    const fallsBack = sgOn && v > 0 && v < 0.01 * K.c && !(vOut > 0);
    const rMax = fallsBack ? 1 / Math.max(1e-300, 1 / r0 - v * v / (2 * K.G * body.m)) : 0;
    const landsNear = fallsBack && rMax > Math.sqrt(K.G * body.m / K.g);
    // ctx.noFlight: release speed only (the catch game aims its own flights)
    const flight = ctx.noFlight ? { landed: false, vImpact: 0, impactAngleDeg: 0, range: 0, apex: 0, time: 0 }
      : fallsBack ? fly({ v0: 0, thetaDeg, h0: body.releaseHeight, m: obj.m, A: obj.area, Cd: obj.Cd, CdSup: obj.CdSup })
      : fly({ v0: vOut, thetaDeg, h0: body.releaseHeight, m: obj.m, A: obj.area, Cd: obj.Cd, CdSup: obj.CdSup, record: !!ctx.record });
    const Eimp = !fallsBack && flight.landed && flight.vImpact > 0 ? keFromV(flight.vImpact, obj.m) : 0;
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
      push, v, mach: v / K.a0, Eobj, heldBack, escapeNeeded, vOut, fallsBack, landsNear, rMax,
      recoilV, recoilE,
      gentle: !!ctx.gentleHold,
      gripRatio: obj.crush && !ctx.gentleHold ? handF / contact / obj.crush : 0,
      gripRatioRaw: obj.crush ? handF / contact / obj.crush : 0,
      plateNeeded: obj.crush && !ctx.gentleHold ? handF / obj.crush : 0,
      // mean acceleration over the throw (what a thrown person feels), and how long it lasts
      launchG: !push.stalled && push.t > 0 && isFinite(push.t) ? v / push.t / K.g : (v > 0 ? Infinity : 0), launchT: push.t,
      // the hardest moment of the push: real muscle pushes hardest at the start (force falls with speed); comic is constant
      launchGPeak: isFinite(Fused) && isFinite(F) ? Math.max(0, Math.min(F, Fused) - RB) / mB / K.g : Infinity,
      // energy the air takes from it in flight (heat and air motion): what "cool flight" absorbs, for flights that land
      dragLoss: !fallsBack && flight.landed && !flight.relativistic ? Math.max(0, Eobj + obj.m * (K.GM / K.R_E - K.GM / (K.R_E + body.releaseHeight)) - Eimp) : null,
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
    // The landing: he comes down on bent legs and stops over the same leg stroke he pushed off with, so the
    // ground takes a mean force m v^2 / (2 d) + m g for 2 d / v. Past what the ground bears, his feet punch in
    // (rigid-foot penetration, an upper bound on depth). Soft landing (comic switch) absorbs the landing's
    // energy instead: the momentum still reaches the ground, gently.
    const landed = v > 0 && v < 0.01 * K.c && flight.landed;
    const vLand = landed ? flight.vImpact : 0;
    const Eland = landed ? keFromV(vLand, body.m) : 0;
    const soft = !!ctx.softLanding;
    const landF = landed ? body.m * vLand * vLand / (2 * d) + body.m * K.g : 0;
    const landT = landed && vLand > 0 ? 2 * d / vLand : 0;
    // soft landing takes back the energy, not the force: stopping m v within the leg stroke still needs landF
    const landRatio = landed && !ctx.groundHolds ? landF / RB : 0;
    const landSink = landRatio > 1 ? penetrationDepth(body.m, A2, vLand, qultFor(surface, body.footB), surface.rho || 2000) : 0;
    // what shakes the ground: the feet and shanks (2 x legEff) stopping at touchdown, as in a stomp; his bent legs
    // take the rest of the energy over the stroke
    const EimpactFeet = landed ? 0.5 * 2 * body.legEff * vLand * vLand : 0;
    const Eimpact = soft ? 0 : EimpactFeet;
    // soft landing takes back what the landing would put into the ground: the feet's impact, and (if the ground gives)
    // the work it takes; his bent legs stop the rest either way
    const landing = { landed, v: vLand, E: Eland, Eimpact, F: landF, t: landT, ratio: landRatio, sink: landSink, soft, absorbed: soft ? (landRatio > 1 ? Eland : EimpactFeet) : 0,
      // when the feet punch in, the ground takes the energy they lose doing it: the work against its bearing and inertia
      Eground: landRatio > 1 && !soft ? Eland : 0 };
    return {
      F, push, v, mach: v / K.a0, flight, vacuumApex: vacuumApex(v, 0),
      sink: push.xB, footSpeed: push.vBmax || push.vB, groundFails, heldBack, groundLimitForce: RB,
      overLimit: !ctx.groundHolds && F > RB,
      vTerminal: vTerm,
      Ebody: momentumToKE(p, body.m),
      Eground, groundQuake: seismicMagnitude(Eground), groundDisrupts: Eground >= K.EARTH_BIND,
      relativistic: v > 0.01 * K.c,
      landing,
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
    // effort: the strength he puts into running (his full strength still carries him)
    const Fu = driveStrength(ctx);
    if (!(Fu > W)) {
      return { thrust: 0, limit: 'effort', accel: 0, accelG: 0, vTop: 0, topLimit: 'effort', mach: 0, t100: Infinity, dragPower: 0, airPerSecond: 0, stagT: K.T0, relativistic: false, tooGentle: true };
    }
    if (ctx.anchor === 'bolted') { thrust = Fu; limit = Fu < ctx.F ? 'effort' : 'strength'; }
    else {
      // Average normal force over a stride equals his weight; each stance briefly carries
      // about 2.5x body weight on one foot. A soft surface caps that.
      const qult = qultFor(surface, body.footB);
      const stanceCap = ctx.groundHolds ? Infinity : qult * body.footArea / 2.5;
      sinks = stanceCap < W;
      const Nuse = Math.min(W, stanceCap);
      const dig = ctx.anchor === 'braced' ? surface.shear * body.digArea * 0.25 : 0;
      const cap = surface.mu * Nuse + dig;
      thrust = Math.min(Fu, cap);
      limit = Fu < cap ? (Fu < ctx.F ? 'effort' : 'strength') : (ctx.anchor === 'braced' ? 'shear' : (sinks ? 'soft ground' : 'friction'));
    }
    let vDrag = Math.sqrt(2 * thrust / (K.rho0 * body.Cd * body.frontArea));
    if (!isFinite(vDrag) || vDrag > K.c) vDrag = K.c;
    let vTop = vDrag;
    let topLimit = 'air drag';
    // Leg speed: Bolt's speed at record strength. Comic speeds grow as sqrt(net force x stroke /
    // mass) like every other comic move; real muscle stops at the cap (scaled with size).
    const Fcal = CAL_LIFT_KG * K.g - BASE_M * K.g;
    const ratio = isFinite(Fu) ? Math.max(0, (Fu - W) / Fcal) * (BASE_M / body.m) * body.s : Infinity;
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
    // dragging a load means walking with it, so his legs must be able to walk under his own weight
    const move = moveCheck(ctx.F, body.m);
    const usable = Math.min(driveStrength(ctx), anc.R);
    const net = move.walk ? usable - resist : 0;
    const M = obj.m + body.m;
    const accel = net > 0 ? net / M : 0;
    // Time to cover 10 m from rest under constant force, relativistically exact.
    const t10m = net > 0 ? Math.sqrt(2 * 10 / accel + (10 / K.c) ** 2) : Infinity;
    return {
      resist, crr, rolling: obj.crr != null, anchor: anc, usable,
      canMove: net > 0, accel, t10m, vEnd: net > 0 ? momentumToV(net * t10m, M) : 0,
      cantWalk: !move.walk, cantStand: !move.stand, walkNeedKg: move.walkNeedKg,
      limitedBy: !move.walk ? 'legs' : ctx.F < resist ? 'strength' : driveStrength(ctx) < resist && anc.R >= resist ? 'effort' : (anc.R < resist ? anc.limit : null),
    };
  }

  // Smallest strength at which predicate(x) flips to true. Log-space bisection; assumes the
  // predicate is monotone in x.
  // ---------------------------------------------------------------------------
  // Two-player contests: arm wrestling and wrestling (Rex vs Ollie). Each side is a full context
  // { F, mode, body, surface, groundHolds, anchor }. Newton's third law makes the push between them
  // equal both ways, so once both out-muscle what holds them in place, the weakest link decides.
  // ---------------------------------------------------------------------------
  const AW = {
    forceFrac: 0.25,       // sideways force at the clasped hands, share of full strength (estimate, both modes; plausible 0.1-0.4)
    lever: 0.19,           // upper-arm axis to the grip, share of height
    effMass: 0.022 * Math.pow(0.827 * 0.1525 / 0.19, 2), // forearm + hand inertia about the elbow / lever^2, share of body mass
    pinAngle: Math.PI / 2, // a quarter turn from upright to the touch pad
    elbowLoad: 0.036,      // forearm + hand + half the upper arm rest on the elbow pad, share of body weight
    holdArm: 0.022 * 0.682 * 0.1525 / 0.19, // forearm weight moment at the grip (forearm level), share of body weight
  };
  // Regulation table (WAF), scaled to their size. latCap: the sideways push the pegs, pad bolts and frame
  // carry between the two competitors before something tears out (estimate: a 25 mm steel peg gripped
  // 7.5 cm up yields at roughly 3-9 kN).
  const TABLE = { refH: 1.7562, depth: 0.660, elbowCap: 10e3, slamJ: 102, latCap: 5e3 };
  const RING_D = 4.55;          // sumo ring diameter at a mean height of 2 m
  const HUMERUS_NM = 190;       // rough torsional strength of a human upper-arm bone, N m (estimate)
  const sameForce = (a, b) => a === b || (isFinite(a) && isFinite(b) && Math.abs(a - b) <= 1e-9 * Math.max(Math.abs(a), Math.abs(b)));
  const footingOf = (c, mA) => anchorCapacity({ body: c.body, surface: c.surface, theta: 0, anchor: c.anchor, groundHolds: c.groundHolds, mA });
  // tear-out limit of the ground around a bolted stance (the same shear x buried area as claws dug in)
  const groundTear = (c) => (c.groundHolds ? Infinity : c.surface.shear * c.body.digArea);
  // One rule for every tab (Arm, Wrestle, Collide): an unlimited push between two bodies that both hold
  // without limit (both bolted). The bodies and bolts never break. On comic ground nothing else can either:
  // the push stays inside one unbreakable system (the two of them and the planet), so nothing moves and the
  // force between them has no upper limit ('paradox'). On real rock the rock around the bolts is the weak
  // link: it tears out at a finite load (tearA, tearB), and once loose, the unlimited push shoves them apart
  // at just under light speed, each with a plug of rock ('rockGives').
  const unlimitedClash = (cA, cB) => (cA.groundHolds && cB.groundHolds
    ? { clash: 'paradox' } : { clash: 'rockGives', tearA: groundTear(cA), tearB: groundTear(cB) });
  const shoveShare = (c) => (c.mode === 'real' ? MUSCLE.throwPush.forceFrac : MUSCLE.throwPush.comicFrac);
  const shoveDrive = (c) => Math.min(c.F, 2 * c.F * shoveShare(c));

  // Arm wrestling. Under the rules each competitor grips the table's peg and his elbow sits on a pad bolted
  // to it, so the push between their hands runs through the table, not their feet. While the table holds,
  // arm strength decides. If both arms out-push the table, or forcing the weaker arm down loads the winner's
  // elbow pad past what the table carries, it tears apart and they are left arm-wrestling standing up, where
  // only their feet hold (and they would topple before sliding unless they lean in). Standing up, the loser's
  // arm folds (a pin) only if the winner presses harder than that arm; otherwise the arm holds and his feet
  // slide, so his whole body is dragged sideways.
  function armWrestle(cA, cB) {
    const A = cA.body, B = cB.body;
    if (isBlackHole(A) || isBlackHole(B)) return { blackHole: true };
    const PA = cA.F * AW.forceFrac, PB = cB.F * AW.forceFrac;
    const fA = footingOf(cA), fB = footingOf(cB);
    const sT0 = ((A.H + B.H) / 2) / TABLE.refH;
    const tableLat = cA.groundHolds ? Infinity : TABLE.latCap * sT0 * sT0;
    let tableBreaks = Math.min(PA, PB) > tableLat, tableBreaksBy = tableBreaks ? 'push' : null;
    // A pin on the table: the winner's elbow pad holds the loser's arm force plus what spins both forearms.
    // Torques about each elbow: R_w = P_l + (I_l / L^2 + m_w r_w / L) a, with a = (P_w - P_l) / M. Largest at the
    // start of the pin (real muscle is strongest at rest), so that is the load the table has to carry.
    let padLoad = 0, padBy = null;
    if (!tableBreaks && !sameForce(PA, PB)) {
      const aStr = PA > PB, Pw = aStr ? PA : PB, Pl = aStr ? PB : PA, mw = aStr ? A.m : B.m, ml = aStr ? B.m : A.m;
      padLoad = Pl + (Pw - Pl) * (AW.effMass * ml + AW.holdArm * mw) / (AW.effMass * (A.m + B.m));
      padBy = aStr ? 'A' : 'B';
      if (padLoad > tableLat) { tableBreaks = true; tableBreaksBy = 'pin'; }
    }
    const AA = tableBreaks ? Math.min(PA, fA.R) : PA, AB = tableBreaks ? Math.min(PB, fB.R) : PB;
    const out = { PA, PB, RA: fA.R, RB: fB.R, AA, AB, tableLat, tableBreaks, tableBreaksBy, padLoad, padBy, footLimitedA: tableBreaks && fA.R < PA, footLimitedB: tableBreaks && fB.R < PB, LA: AW.lever * A.H, LB: AW.lever * B.H };
    out.armHoldA = AW.holdArm * A.m * K.g; out.armHoldB = AW.holdArm * B.m * K.g;
    out.canHoldArmA = PA >= out.armHoldA; out.canHoldArmB = PB >= out.armHoldB;
    const sT = ((A.H + B.H) / 2) / TABLE.refH;
    out.sT = sT;
    out.elbowCap = cA.groundHolds ? Infinity : TABLE.elbowCap * sT * sT;
    out.elbowLoadA = AW.elbowLoad * A.m * K.g; out.elbowLoadB = AW.elbowLoad * B.m * K.g;
    out.tableRatio = Math.max(out.elbowLoadA, out.elbowLoadB) / out.elbowCap;
    out.slamCap = cA.groundHolds ? Infinity : TABLE.slamJ * sT * sT * sT;
    const dT = Math.max(TABLE.depth * sT + 0.25 * (A.H + B.H) / 2, eqRadius(A) + eqRadius(B));
    out.grav = mutualGravity(A, B, dT);
    out.fall = fallTogether(A, B, dT, eqRadius(A) + eqRadius(B));
    out.pulledTogether = out.grav.F > Math.min(fA.R, fB.R) && out.grav.F > Math.max(cA.F, cB.F);
    out.torqueA = AA * out.LA; out.torqueB = AB * out.LB;
    out.humerusRatioA = out.torqueA / HUMERUS_NM; out.humerusRatioB = out.torqueB / HUMERUS_NM;
    out.tearA = cA.anchor === 'bolted' ? AA / groundTear(cA) : 0;
    out.tearB = cB.anchor === 'bolted' ? AB / groundTear(cB) : 0;
    if (!isFinite(AA) && !isFinite(AB)) {
      // unlimited arms on both sides. While the table holds (comic ground) it carries the push between them:
      // one unbreakable system, nothing moves. Once it breaks, the push goes through two bolted stances.
      Object.assign(out, tableBreaks ? unlimitedClash(cA, cB) : { clash: 'paradox', via: 'table' });
      out.outcome = out.clash; out.contact = Infinity;
      return out;
    }
    out.tableRatio2 = Math.min(PA, PB) / tableLat;
    if (sameForce(AA, AB)) { out.outcome = 'stalemate'; out.contact = AA; return out; }
    const aWins = AA > AB;
    const Aw = aWins ? AA : AB, Al = aWins ? AB : AA, bw = aWins ? A : B, bl = aWins ? B : A, cw = aWins ? cA : cB, cl = aWins ? cB : cA;
    const Pw = aWins ? PA : PB, Rw = tableBreaks ? (aWins ? fA.R : fB.R) : Infinity;
    const Pl = aWins ? PB : PA, Rl = tableBreaks ? (aWins ? fB.R : fA.R) : Infinity;
    // What gives on the loser's side: his arm, if the winner presses harder than it (a pin); otherwise his arm
    // holds and his feet slide, and the winner drags his whole body sideways (only once the table is gone).
    const pins = !tableBreaks || (Aw > Pl && !sameForce(Aw, Pl));
    // comic: constant net push; real: the winner's arm force falls with hand speed (Hill; top hand speed
    // borrowed from the punch), capped by his footing once the table is gone
    const run = (s, M, R) => (cw.mode === 'real'
      ? pushApart({ F: Pw, Fcap: Rw < Pw ? Rw : undefined, d: s, mA: M, mB: M, RA: Infinity, RB: R, mode: 'real', vmax: MUSCLE.punch.vmax * bw.s })
      : pushApart({ F: Aw, d: s, mA: M, mB: M, RA: Infinity, RB: R, mode: 'comic' }));
    const tw = Aw * AW.lever * bw.H;
    let push;
    if (pins) {
      // both forearms spin a quarter turn about the elbows; the loser's arm resists with its full force
      const s = AW.pinAngle * AW.lever * bl.H, M = AW.effMass * (A.m + B.m);
      push = run(s, M, Pl);
      Object.assign(out, { outcome: 'pin', winner: aWins ? 'A' : 'B', contact: Pl, pin: { s, M, t: push.t, v: push.vB, E: push.EB, dA: Aw - Pl } });
      // standing up, a loser whose feet hold less than his arm is also pulled along by it
      out.loserSlides = tableBreaks && Rl < Pl;
      out.slamRatio = tableBreaks ? 0 : push.EB / out.slamCap;
      // each upper arm carries its own owner's push: the loser's arm resists with all it has
      if (aWins) { out.torqueA = tw; out.torqueB = Pl * out.LB; } else { out.torqueB = tw; out.torqueA = Pl * out.LA; }
    } else {
      // the winner's hand sweeps a quarter turn and drags the loser's whole body (plus his own forearm) with it
      const s = AW.pinAngle * AW.lever * bw.H, M = bl.m + AW.effMass * bw.m;
      push = run(s, M, Rl);
      Object.assign(out, { outcome: 'drag', winner: aWins ? 'A' : 'B', contact: Aw, drag: { s, M, t: push.t, v: push.vB, E: push.EB, dA: Aw - Rl } });
      out.slamRatio = 0;
      // the loser's arm doesn't give, so it carries the whole push
      if (aWins) { out.torqueA = tw; out.torqueB = Aw * out.LB; } else { out.torqueB = tw; out.torqueA = Aw * out.LA; }
    }
    out.humerusRatioA = out.torqueA / HUMERUS_NM; out.humerusRatioB = out.torqueB / HUMERUS_NM;
    const v = push.vB, E = push.EB;
    out.relativistic = v >= 0.01 * K.c;
    if (pins && !cA.groundHolds && v >= 2000 && !out.relativistic && isFinite(E)) {
      const rhoW = bw.rho, M = out.pin.M;
      const cr = craterDiameter({ L: Math.cbrt(6 * M / (Math.PI * rhoW)), v, rhoI: rhoW, rhoT: cA.surface.rho || 2000, angleDeg: 90, E });
      out.crater = cr.D; out.craterExtrapolated = !!cr.extrapolated;
    } else out.crater = 0;
    out.quake = pins ? seismicMagnitude(E) : 0;
    return out;
  }

  // Sustained shoving match: each side drives with what his walking grip gives and holds with his footing.
  function pushMatch(cA, cB) {
    const A = cA.body, B = cB.body;
    if (isBlackHole(A) || isBlackHole(B)) return { blackHole: true };
    const fA = footingOf(cA), fB = footingOf(cB);
    const bolt = (c) => c.anchor === 'bolted';
    const drive = (c, f) => {
      if (bolt(c) || !moveCheck(c.F, c.body.m).walk) return 0;
      return c.surface.mu * Math.min(c.body.m * K.g, f.Nmax) + (c.anchor === 'braced' ? 0.25 * c.surface.shear * c.body.digArea : 0);
    };
    // a body too heavy for his strength to stand lies flat: friction alone holds him
    const holdOf2 = (c, f) => (bolt(c) ? Infinity : moveCheck(c.F, c.body.m).stand ? Math.min(c.F, f.R) : f.R);
    const HA = holdOf2(cA, fA), HB = holdOf2(cB, fB);
    const DA = Math.min(cA.F, drive(cA, fA)), DB = Math.min(cB.F, drive(cB, fB));
    const out = { HA, HB, DA, DB, holdA: fA.R, holdB: fB.R };
    // can either get under the other and lift him (a push angled up unloads the other's feet)?
    out.canLiftA = cA.F > B.m * K.g; out.canLiftB = cB.F > A.m * K.g;
    out.grav = mutualGravity(A, B);
    out.ring = RING_D * ((A.H + B.H) / 2) / 2;
    out.gravityLock = out.grav.F > Math.max(cA.F, cB.F);
    if (bolt(cA) && bolt(cB)) {
      out.outcome = 'bothBolted';
      // an unlimited push between two unlimited holds: the shared rule (unlimitedClash)
      if (!isFinite(cA.F) || !isFinite(cB.F)) Object.assign(out, unlimitedClash(cA, cB));
      out.contact = Math.max(cA.F, cB.F);
      out.tear = out.clash === 'paradox' ? 0 : out.contact / Math.min(groundTear(cA), groundTear(cB));
      return out;
    }
    const netA = DA - HB, netB = DB - HA, tol = 1e-9 * Math.max(DA, DB, 1e-300);
    let w = null, net = 0;
    if (netA > tol) { w = 'A'; net = netA; } else if (netB > tol) { w = 'B'; net = netB; }
    if (!w) {
      out.outcome = 'deadlock';
      out.contact = Math.min(HA, HB);
      out.allOut = !bolt(cA) && !bolt(cB) && cA.F > fA.R && cB.F > fB.R;
      return out;
    }
    const M = A.m + B.m, a = net / M, x = out.ring / 2;   // the loser starts at the centre
    const vCap = sprint(w === 'A' ? cA : cB).vTop;
    let t, v;
    if (!(vCap > 0)) { out.outcome = 'deadlock'; out.contact = Math.min(HA, HB); return out; }
    const vFree = Math.sqrt(2 * a * x);
    if (vFree <= vCap) { t = Math.sqrt(2 * x / a); v = vFree; } else { t = vCap / a + (x - vCap * vCap / (2 * a)) / vCap; v = vCap; }
    return Object.assign(out, { outcome: 'walkOut', winner: w, net, accel: a, x, t, v, vCap, contact: w === 'A' ? HB : HA });
  }

  // Explosive two-handed shove of B by A (the throw's shove, with B on his footing as the "object").
  function shoveOnce(cA, cB) {
    const A = cA.body, B = cB.body;
    const Fdrive = shoveDrive(cA), d = A.strokes.throw, armMass = 2 * A.handEff;
    const mA = A.m - armMass, mB = B.m + armMass;
    const fA = footingOf(cA, mA), fB = footingOf(cB), fAwhole = footingOf(cA);
    const d0 = eqRadius(A) + eqRadius(B);
    if (!isFinite(Fdrive) && !isFinite(fA.R) && !isFinite(fB.R)) {
      // both bolted, unlimited shove: the shared rule. Comic ground: nothing moves. Real rock: the rock around
      // the bolts tears out and they fly apart at just under light speed.
      const k = unlimitedClash(cA, cB), go = k.clash === 'rockGives';
      return Object.assign(k, { Fdrive, d, stalled: !go, relativistic: go, vA: go ? K.c : 0, vB: go ? K.c : 0, EA: go ? Infinity : 0, EB: go ? Infinity : 0,
        slideA: go ? Infinity : 0, slideB: go ? Infinity : 0, Fg: 0, ring: RING_D * ((A.H + B.H) / 2) / 2 });
    }
    const Fg = K.G * A.m * B.m / (d0 * d0);   // held at its contact value: an upper bound
    const RA = (F) => fA.Rslide(F) + Fg, RB = fB.R + Fg;
    const vmax = MUSCLE.throwPush.vmax * A.s;
    let push = pushApart({ F: Fdrive, d, mA, mB, RA, RB, mode: cA.mode, vmax });
    let heldBack = false;
    const Rlim = (fA.R + Fg) * (1 - 1e-9);
    if ((isFinite(Fdrive) || cA.mode === 'real') && Fdrive > Rlim && Rlim > RB) {
      for (const f of (cA.mode === 'real' ? [1, 1.25, 1.6, 2, 3, 5, 10] : [1])) {
        const Fc = Rlim * f;
        if (!(Fc < Fdrive)) continue;
        const held = pushApart(cA.mode === 'real' ? { F: Fdrive, Fcap: Fc, d, mA, mB, RA, RB, mode: 'real', vmax } : { F: Fc, d, mA, mB, RA, RB, mode: 'comic' });
        if (held.pB > push.pB) { push = held; heldBack = f === 1; }
      }
    }
    // the follow-through stops A's arms inside him: B keeps his share, A recoils with the rest
    const pB = push.pB === Infinity ? Infinity : push.pB * B.m / mB;
    const pA = push.pA === Infinity ? Infinity : Math.max(0, push.pA - push.pB * armMass / mB);
    const vB = momentumToV(pB, B.m), vA = momentumToV(pA, A.m);
    // afterwards each slides to a stop: m v dv/dx = -(R + k v^2), k = rho0 Cd A / 2
    const slide = (v, f, b) => {
      if (!(v > 0)) return 0;
      if (v > 0.01 * K.c) return Infinity;
      if (!isFinite(f.R)) return 0;
      if (!(f.R > 0)) return Infinity;
      const k = 0.5 * K.rho0 * b.Cd * b.frontArea;
      return b.m / (2 * k) * Math.log1p(k * v * v / f.R);
    };
    const vEsc = Math.sqrt(2 * K.G * (A.m + B.m) / (d0 + d));
    return {
      Fdrive, d, push, heldBack, vA, vB, EA: momentumToKE(pA, A.m), EB: momentumToKE(pB, B.m),
      slideA: slide(vA, fAwhole, A), slideB: slide(vB, fB, B), Fg, gravityLock: push.stalled && Fg >= Fdrive,
      boundTogether: !push.stalled && vA + vB < vEsc, vEsc, stalled: push.stalled, relativistic: vB > 0.01 * K.c || vA > 0.01 * K.c,
      ring: RING_D * ((A.H + B.H) / 2) / 2,
    };
  }
  function shove(cA, cB) {
    const r = shoveOnce(cA, cB);
    if (cA.mode !== 'comic') return r;
    const rr = shoveOnce(Object.assign({}, cA, { mode: 'real' }), cB);
    return rr.vB > r.vB * (1 + 1e-9) ? Object.assign(rr, { basis: 'real' }) : r;
  }
  // Both shove at once: the stronger shove sets the push (the weaker one's arms can't extend against it).
  function shoveBoth(cA, cB) {
    return shoveDrive(cA) >= shoveDrive(cB) ? Object.assign(shove(cA, cB), { shover: 'A' }) : Object.assign(shove(cB, cA), { shover: 'B' });
  }
  function liftPartner(cA, cB) {
    const A = cA.body, B = cB.body;
    const l = lift(cA, { m: B.m });
    const dOver = Math.max(0.65 * A.H + 0.1 * B.H, eqRadius(A) + eqRadius(B));
    // their pull is largest partway up a lift that starts beside him: about 0.385 G mA mB / d_contact^2
    const dC = eqRadius(A) + eqRadius(B);
    const FgOver = K.G * A.m * B.m / (dOver * dOver), FgPath = 0.385 * K.G * A.m * B.m / (dC * dC);
    const Fg = Math.max(FgOver, FgPath), gPeakOnPath = FgPath > FgOver;
    const pullOut = cB.anchor === 'bolted' ? Infinity : (cB.anchor === 'braced' ? (cB.groundHolds ? Infinity : cB.surface.shear * B.digArea) : 0);
    const need = B.m * K.g + Fg + pullOut;
    return { weight: B.m * K.g, Fg, pullOut, need, can: cA.F >= need * (1 - 1e-9) && !l.cantStand, cantStand: l.cantStand, margin: cA.F / need,
      groundRatio: l.groundRatio, pressure: l.pressure, qult: l.qult, dOver, dC, gPeakOnPath, bolted: cB.anchor === 'bolted' };
  }
  function throwPartner(cA, cB, theta) {
    const A = cA.body, B = cB.body;
    if (cB.anchor === 'bolted') return { bolted: true };
    const obj = { m: B.m, area: B.frontArea, Cd: B.Cd, CdSup: 1.75, rho: B.rho, L: Math.cbrt(6 * B.volume / Math.PI) };
    const r = throwObject(cA, obj, theta);
    const dOver = Math.max(0.65 * A.H + 0.1 * B.H, eqRadius(A) + eqRadius(B));
    // A bolted thrower can't fall toward his partner, so the partner only has to climb out of the thrower's
    // pull. A free thrower recoils, so compare their speed apart with the escape speed of the pair.
    const boltedT = cA.anchor === 'bolted' || cA.groundHolds;
    const vEsc = Math.sqrt(2 * K.G * (boltedT ? A.m : A.m + B.m) / dOver);
    const vApart = r.canMove ? r.v + (boltedT ? 0 : (r.recoilV || 0)) : 0;
    const fallsBack = r.canMove && vApart < vEsc && vEsc > 1e-3;
    // a partner no rock can hold sinks into the planet where he lands (see the Weight tab)
    const sinks = !cA.groundHolds && groundUnderWeight(B, cA.surface, false).regime === 'fallsThrough';
    return { r, obj, vEsc, vApart, fallsBack, heavierPartner: B.m > A.m, sinks };
  }

  // ---------------------------------------------------------------------------
  // Unstoppable force vs immovable object: a static push, or one partner charging into the other.
  // Exact relativistic momentum and energy for two bounds (plush splat, perfect bounce).
  // ---------------------------------------------------------------------------
  const COLLIDE = (() => {
    const c = K.c;
    const COL = {
      SQUASH: 0.25,          // estimate: each body squashes by a quarter of the smaller body's depth (plush end)
      V_SOUND_MAX: 36100,    // m/s: upper bound on sound speed in atom-built matter (Trachenko et al. 2020)
      ROCK_T: 8.38e6,        // Pa: granite tensile strength, quasi-static Brazilian test (Padmanabha et al. 2021)
      ROCK_C: 2.0e8,         // Pa: granite uniaxial compressive strength (existing fact ground_granite_ucs)
      CRUST: 41.1e3,         // m: weighted mean continental crust thickness (Christensen & Mooney 1995)
      I_FACTOR: 0.3308,      // Earth's moment of inertia / (M R^2) (NASA Earth fact sheet)
      T_SID: 23.9345 * 3600, // s: Earth's sidereal rotation period (NASA Earth fact sheet)
      RUNUP: 10,             // estimate: they start 10 body heights apart (20 m at 2 m)
      AGE_U: 13.787e9 * 3.15576e7, // s: age of the universe (Planck 2018), for the "move 1 mm" comparison
      C_ROCK: 5000,          // m/s: stress-wave speed in rock, an estimate between granite's bar speed (3.71 km/s, Padmanabha et al. 2021) and its faster P-wave speed
      M_RESHAPE: 1e-3 * K.M_E,     // density design's "his gravity reshapes the planet" gate
      ROCK_FAIL: 1.7e9,            // density design's deep-rock strength (falls-through gate)
    };
    COL.F_HALVES = 3 * K.G * K.M_E * K.M_E / (16 * K.R_E * K.R_E); // pull between the halves of a uniform Earth, 1.10e25 N

    const depthOf = (b) => b.volume / b.frontArea;   // mean front-to-back thickness: volume ÷ facing area
    const same = (a, b) => a === b || (isFinite(a) && isFinite(b) && Math.abs(a - b) <= 1e-9 * Math.max(Math.abs(a), Math.abs(b), 1e-300));
    const canStand = (cx) => !isFinite(cx.F) || MUSCLE.jump.forceFrac * cx.F >= cx.body.m * K.g;
    const fallsThrough = (cx) => !cx.groundHolds && cx.body.m * K.g > COL.ROCK_FAIL * cx.body.topArea;

    // Head-on hit: body A with momentum p (may be Infinity) into body T at rest (mass mT, may be Infinity).
    // Exact relativistic bounds: perfectly inelastic (splat) and perfectly elastic (bounce).
    function headOn(p, mA, mT) {
      if (!(p > 0)) return { none: true, Q: 0, KA: 0, pStar: 0, inel: { V: 0, pT: 0 }, el: { vA: 0, vT: 0, pA: 0, pT: 0 } };
      if (!isFinite(p) && !isFinite(mT)) return { undefinedResult: true, Q: NaN, KA: Infinity, pStar: NaN };
      const KA = momentumToKE(p, mA);
      if (!isFinite(mT)) {   // truly immovable (thought experiment): infinite inertia
        return { KA, Q: KA, pStar: p, Mstar: Infinity, inel: { V: 0, pT: p }, el: { vA: -momentumToV(p, mA), vT: 0, pA: -p, pT: 2 * p } };
      }
      if (!isFinite(p)) {    // unlimited momentum into a finite mass. Bounce limit: charger's rapidity -> ln(mA/mT)
        const w = Math.log(mA / mT);
        return { KA: Infinity, Q: Infinity, pStar: Infinity, Mstar: Infinity, inel: { V: c, pT: Infinity }, el: { vA: c * Math.tanh(w), vT: c, pA: mA * c * Math.sinh(w), pT: Infinity } };
      }
      const c2 = c * c;
      const EA = Math.sqrt((mA * c2) ** 2 + (p * c) ** 2);
      const Ms = Math.sqrt(mA * mA + mT * mT + 2 * mT * EA / c2);   // invariant mass of the pair
      const Q = 2 * mT * KA / (Ms + mA + mT);                         // = (Ms - mA - mT) c^2 without cancellation
      const pStar = p * mT / Ms;                                       // each body's momentum in the centre-of-momentum frame
      const inel = { V: momentumToV(p, Ms), pT: p };
      let el;
      if (p / (mA * c) < 1e-6) {
        const v = p / mA, M = mA + mT, vA = (mA - mT) / M * v, vT = 2 * mA / M * v;
        el = { vA, vT, pA: mA * vA, pT: mT * vT };
      } else {               // reverse each body's rapidity about the centre-of-momentum rapidity
        const wA = Math.asinh(p / (mA * c)), Etot = EA + mT * c2, bcm = p * c / Etot;
        const wcm = bcm < 0.5 ? Math.atanh(bcm) : Math.log((Etot + p * c) / (Ms * c2));
        const wA2 = 2 * wcm - wA, wT2 = 2 * wcm;
        el = { vA: c * Math.tanh(wA2), vT: c * Math.tanh(wT2), pA: mA * c * Math.sinh(wA2), pT: mT * c * Math.sinh(wT2) };
      }
      if (Math.abs(el.vA) < 1e-9 * momentumToV(p, mA)) { el.vA = 0; el.pA = 0; }   // round-off for equal masses
      return { KA, Q, pStar, Mstar: Ms, inel, el };
    }

    // Newtonian hit when both bodies are moving (gravity pulled them together): CM speed u, closing speed w.
    function headOnCM(mA, mB, u, w) {
      const M = mA + mB, mu = mA * mB / M;
      return { KA: 0.5 * mu * w * w, Q: 0.5 * mu * w * w, pStar: mu * w, inel: { V: u, pT: mB * u },
        el: { vA: u - mB / M * w, vT: u + mA / M * w, pA: mA * (u - mB / M * w), pT: mB * (u + mA / M * w) } };
    }

    // Plush splat with the holder held back by a constant force H (0 < H < the held-case force). Non-relativistic.
    // Constant crush force F over squash s: F = mu (v^2/(2s) + H/mB). H -> 0 gives the free splat; H -> mA v^2/(2s) gives V = 0.
    function splatWithFooting(mA, mB, v, s, H) {
      const mu = mA * mB / (mA + mB), arel = v * v / (2 * s);
      const F = mu * (arel + H / mB), tau = v / arel;
      const V = Math.max(0, v - F * tau / mA);
      const xB = 0.5 * ((F - H) / mB) * tau * tau;
      return { F, tau, V, Q: F * s, xB, Efoot: H * xB, Jearth: H * tau };
    }

    // How hard and for how long, at three stiffness levels. J = pStar (centre-of-momentum impulse).
    function contactForces(h, bA, bB, mA) {
      const LA = depthOf(bA), LB = depthOf(bB), L = Math.min(LA, LB);
      const s = 2 * COL.SQUASH * L;
      const out = { s, L };
      if (!isFinite(h.Q) || !isFinite(h.pStar)) return Object.assign(out, { soft: { F: Infinity, t: 0 }, softEl: { F: Infinity, t: 0 }, matter: { F: Infinity, t: L / COL.V_SOUND_MAX }, light: { F: Infinity, t: 0 } });
      if (!(h.Q > 0)) return Object.assign(out, { soft: { F: 0, t: 0 }, softEl: { F: 0, t: 0 }, matter: { F: 0, t: 0 }, light: { F: 0, t: 0 } });
      const gb = h.pStar / (mA * c), gam = Math.sqrt(1 + gb * gb), beta = gb / gam;   // charger, centre-of-momentum frame
      const tLight = L / (gam * c * (1 + beta));      // a light-speed signal crossing the smaller body
      const tMatter = L / COL.V_SOUND_MAX;
      return Object.assign(out, {
        soft: { F: h.Q / s, t: h.pStar * s / h.Q },                         // splat: constant crush force
        softEl: { F: 2 * h.Q / s, t: 0.5 * Math.PI * h.pStar * s / h.Q },   // bounce: linear spring, peak force
        matter: { F: h.pStar / tMatter, t: tMatter },                       // stiffest atom-built body (ceiling for real matter)
        light: { F: h.pStar / tLight, t: tLight },                          // stiffest body relativity allows (hard ceiling)
      });
    }

    // Rock around a bolted anchor carrying force C. Average stress over a half-sphere of radius r is C/(2 pi r^2).
    // dipole: two bolted pushers load the ground equal and opposite, dSep apart, so beyond dSep the stress
    // falls as 1/r^3 and the failure radius grows only as (C dSep / 2 pi sigma)^(1/3)
    function rockLoad(C, cHold, dSep, dipole) {
      if (!(C > 0)) return { C: 0, rT: 0, rC: 0 };
      const tearCap = cHold.groundHolds ? Infinity : cHold.surface.shear * cHold.body.digArea;
      const rad = (sig) => { const r = Math.sqrt(C / (2 * Math.PI * sig)); return dipole && r > dSep ? Math.cbrt(C * dSep / (2 * Math.PI * sig)) : r; };
      const rT = rad(COL.ROCK_T);
      return { C, rT, rC: rad(COL.ROCK_C), tear: C / tearCap, tearCap, crackThrough: rT >= dSep / 2, beyondCrust: rT > COL.CRUST, planet: false, dipole: !!dipole };
    }

    // Slide to a stop against footing R and air drag (contest design E13): x = m/(2k) ln(1 + k v^2/R).
    function slideTo(m, v, R, A) {
      if (!(v > 0)) return 0;
      if (v >= 0.01 * c) return NaN;
      if (!(R > 0)) return Infinity;
      const k = 0.5 * K.rho0 * 1.0 * A;
      return m / (2 * k) * Math.log1p(k * v * v / R);
    }

    // What holds the braced body in place.
    function holdOf(cB, horiz) {
      const b = cB.body;
      const anc = anchorCapacity({ body: b, surface: cB.surface, theta: 0, anchor: cB.anchor === 'bolted' ? 'friction' : cB.anchor, groundHolds: cB.groundHolds, mA: b.m });
      if (cB.immovable) return { H: Infinity, R: Infinity, anc, why: 'immovable' };
      if (cB.anchor === 'bolted') return { H: Infinity, R: Infinity, anc, why: 'bolted' };
      if (horiz) {
        const stand = canStand(cB);
        // standing: muscle holds his stance, so min(strength, footing) (contest convention); lying flat: friction alone
        return { H: stand ? Math.min(cB.F, anc.R) : anc.R, R: anc.R, anc, why: !stand ? 'lying' : (cB.F < anc.R ? 'strength' : 'footing') };
      }
      // landed on from above: the ground's bearing under his feet (his body can't break; if his legs fold he is pressed onto the same ground)
      const H = cB.groundHolds ? Infinity : Math.max(0, anc.Nmax - b.m * K.g);
      return { H, R: H, anc, why: cB.groundHolds ? 'comicGround' : 'bearing' };
    }

    // ---------------- Reading 1: a static push. A pushes with everything from where he stands; B braces.
    function standoff(cA, cB) {
      if (isBlackHole(cA.body) || isBlackHole(cB.body)) return { blackHole: true };
      const ancA = anchorCapacity({ body: cA.body, surface: cA.surface, theta: 0, anchor: cA.anchor, groundHolds: cA.groundHolds, mA: cA.body.m });
      const RA = cA.anchor === 'bolted' ? Infinity : ancA.R;
      const DA = Math.min(cA.F, RA);
      const hb = holdOf(cB, true), HB = hb.H;
      const dSep = 0.5 * (cA.body.H + cB.body.H);
      const grav = mutualGravity(cA.body, cB.body);
      const out = { DA, RA, FA: cA.F, FB: cB.F, HB, RB: hb.R, holdWhy: hb.why, dSep, gravF: grav.F,
        pusherSlips: cA.F > RA, gravityLock: grav.F > Math.min(RA, hb.R) };
      if (!isFinite(DA) && !isFinite(HB)) {
        // an unlimited push (bolted pusher) against an unlimited hold: no upper limit on the force between them
        out.contact = Infinity;
        if (cB.immovable && !(cB.anchor === 'bolted' && cA.groundHolds && cB.groundHolds)) {
          // A truly immovable body needs no anchor and never moves, so the push drives the pusher back instead.
          // His bolts hand it to the ground under him: unbreakable ground takes the planet with him
          // ('pusherPlanet'); real rock tears out around his bolts first ('pusherTorn').
          out.outcome = cA.groundHolds ? 'pusherPlanet' : 'pusherTorn';
          out.tearA = groundTear(cA);
        } else {
          Object.assign(out, unlimitedClash(cA, cB));
          out.outcome = out.clash;
        }
        return out;
      }
      if (same(DA, HB)) { out.outcome = 'stalemate'; out.contact = DA; }
      else if (DA > HB) { out.outcome = 'forceWins'; out.contact = HB; out.net = DA - HB; }
      else { out.outcome = 'objectHolds'; out.contact = DA; }
      if (cB.anchor === 'bolted' && isFinite(out.contact)) out.rock = cB.groundHolds ? { comic: true, C: out.contact } : rockLoad(out.contact, cB, dSep, cA.anchor === 'bolted');
      return out;
    }

    // ---------------- Reading 2: a collision.
    // source: 'sprint' | 'jump' (lands on him from the top of his jump) | 'stomp' (lands on him after a stomp-launch) | 'set' (gb = gamma*beta, Infinity = light speed)
    function chargeSpeed(cA, source, gb, runUp) {
      if (source === 'set') {
        if (!(gb > 0)) return { v: 0, u: 0, dir: 'h', why: 'zero' };
        return { v: isFinite(gb) ? c * gb / Math.sqrt(1 + gb * gb) : c, u: gb * c, dir: 'h' };
      }
      if (source === 'sprint') {
        const s = sprint(cA);
        if (s.cantStand || !(s.vTop > 0)) return { v: 0, u: 0, dir: 'h', why: 'cantSprint', run: s };
        // Proper speed gamma*v at top speed. ENGINE: add to sprint(): uTop = min(sqrt(2 thrust/(rho0 Cd A)), legCap)
        // computed before the cap at c (drag on swept air grows as (gamma v)^2, so the same balance gives gamma*v).
        const b = cA.body, W = b.m * K.g;
        const uDrag = Math.sqrt(2 * s.thrust / (K.rho0 * b.Cd * b.frontArea));
        const Fcal = CAL_LIFT_KG * K.g - 180 * K.g;
        const ratio = isFinite(cA.F) ? Math.max(0, (cA.F - W) / Fcal) * (180 / b.m) * b.s : Infinity;
        let uLeg = MUSCLE.run.atCal * Math.sqrt(ratio);
        if (cA.mode === 'real') uLeg = Math.min(uLeg, MUSCLE.run.cap * b.s);
        const uTop = Math.min(uDrag, uLeg);
        // speed reached from rest over the run-up: m u du/dx = T - k u^2 gives u = uDrag sqrt(1 - exp(-2kx/m)),
        // capped by his legs; reaching 95% of the drag-limited top speed takes x95 = (m/2k) ln(1/(1 - 0.95^2))
        const k = 0.5 * K.rho0 * b.Cd * b.frontArea;
        const x = runUp || Infinity;
        const uRun = !isFinite(uDrag) ? uTop : Math.min(uTop, uDrag * Math.sqrt(-Math.expm1(-2 * k * x / b.m)));
        const vRun = isFinite(uRun) ? uRun / Math.sqrt(1 + (uRun / c) * (uRun / c)) : c;
        return { v: vRun, u: uRun, vTopRun: s.vTop, x95: b.m / (2 * k) * Math.log(1 / (1 - 0.9025)), runUp: x, dir: 'h', run: s };
      }
      if (source === 'jump') {
        const j = jump(cA), f = j.flight;
        if (!(j.v > 0)) return { v: 0, dir: 'v', why: 'cantJump', jump: j };
        if (j.relativistic || f.relativistic || f.escaped || f.orbit || f.timedOut || !f.landed) return { v: 0, dir: 'v', why: 'neverLands', jump: j };
        return { v: f.vImpact, dir: 'v', jump: j, apex: f.apex };
      }
      if (source === 'stomp') {
        const st = stomp(cA), f = st.bodyFlight;
        if (st.bolted) return { v: 0, dir: 'v', why: 'boltedStomp', stomp: st };
        if (!(st.vBody > 0)) return { v: 0, dir: 'v', why: 'noLaunch', stomp: st };
        if (f.relativistic || f.escaped || f.orbit || f.timedOut || !f.landed) return { v: 0, dir: 'v', why: 'neverLands', stomp: st };
        return { v: f.vImpact, dir: 'v', stomp: st, apex: f.apex };
      }
      throw new Error('unknown source');
    }

    function collide(cA, cB, o) {
      const bA = cA.body, bB = cB.body, mA = bA.m, mB = bB.m;
      if (isBlackHole(bA) || isBlackHole(bB)) return { blackHole: true };
      if (mA >= COL.M_RESHAPE || mB >= COL.M_RESHAPE) return { planetScale: true };
      // they start RUNUP body heights apart; mutual gravity on the way in is Newtonian (the gates keep
      // G m/(r c^2) below ~1e-5)
      const dC = eqRadius(bA) + eqRadius(bB);
      const d0 = Math.max(COL.RUNUP * Math.max(bA.H, bB.H), 1.0001 * dC);
      const sp = chargeSpeed(cA, o.source, o.gb, d0 - dC);
      const out = { source: o.source, dir: sp.dir, speed: sp };
      if (!(sp.v > 0)) return Object.assign(out, { noCharge: sp.why || 'zero' });
      const v0 = sp.v, horiz = sp.dir === 'h';
      const fall = fallTogether(bA, bB, d0, dC);
      const gNear = mutualGravity(bA, bB, dC), gFar = mutualGravity(bA, bB, d0);
      const relativistic = v0 >= 0.01 * c;
      const vRel = relativistic ? v0 : Math.sqrt(v0 * v0 + fall.vRel * fall.vRel);
      const gravBoost = !relativistic && vRel > 1.001 * v0;
      Object.assign(out, { v0, vRel, d0, dC, fall, gNear, gFar, gravBoost, relativistic,
        bound: gravBoost && 0.5 * (mA * mB / (mA + mB)) * v0 * v0 < gFar.Ebind });
      const hb = holdOf(cB, horiz);
      out.hold = hb;
      const pA = gravBoost ? mA * vRel : (sp.u != null ? mA * sp.u : vToMomentum(v0, mA));   // u = gamma v
      out.pA = pA;
      const dragged = gravBoost && gNear.F > hb.H;    // his gravity pulls the holder off his feet before the hit
      out.dragged = dragged;
      // Does the brace hold? Test against the force of a held (Earth-backed) splat at the plush end.
      const mHeld = cB.immovable ? Infinity : mB + K.M_E;
      const hHeld = headOn(pA, mA, mHeld);
      const cfHeld = contactForces(hHeld, bA, bB, mA);
      // a bounce's spring peak is twice the splat's steady crush; test the bound being shown
      const Fheld = o.bounce ? cfHeld.softEl.F : cfHeld.soft.F;
      // Unlimited momentum into a bolted holder on real rock: the bolts are comic, the rock isn't. It tears out
      // at a finite load, so the Earth keeps only a finite share and he leaves with a plug of rock.
      const rockGives = !isFinite(pA) && cB.anchor === 'bolted' && !cB.groundHolds && !cB.immovable;
      let held;
      if (dragged) held = false;
      else if (cB.immovable) held = true;
      else if (!isFinite(pA)) held = !isFinite(hb.H) && !rockGives;   // bolted to unbreakable ground, he takes the planet with him
      else held = !isFinite(hb.H) || hb.H >= Fheld;
      // the squash is a guess: would a stiffer pair (ordinary solids) knock him loose?
      out.heldOnlyIfSquishy = held && isFinite(hb.H) && !cB.immovable && hb.H < cfHeld.matter.F;
      // A bolted holder is backed by the planet only if the rock under him can respond during the hit:
      // a stress wave crosses c_rock * t in the contact time, and that rock must outweigh the charger.
      const tHit = cfHeld.soft.t, rWave = COL.C_ROCK * tHit;
      const boltsLate = held && cB.anchor === 'bolted' && !cB.groundHolds && !cB.immovable && isFinite(pA) &&
        (2 / 3) * Math.PI * Math.pow(rWave, 3) * (cB.surface.rho || 2700) < mA;
      if (boltsLate) held = false;
      out.boltsLate = boltsLate;
      out.held = held; out.Fheld = Fheld;
      const h = held ? hHeld : (dragged ? headOnCM(mA, mB, mA * v0 / (mA + mB), vRel) : headOn(pA, mA, mB));
      out.h = h;
      if (h.undefinedResult) return Object.assign(out, { outcome: 'paradox' });
      // Unlimited momentum gained by pushing on the same planet the bolted holder is fixed to: the system
      // (charger, holder, planet) started at rest and stays at rest overall. On real rock the bolts tear out.
      if (!isFinite(pA) && cB.anchor === 'bolted' && !cB.immovable) {
        out.unlimitedVsBolted = rockGives ? 'rockGives' : (o.source === 'set' ? 'planetMoves' : 'closedSystem');
      }
      out.contact = contactForces(h, bA, bB, mA);
      // footing that is a real share of the blow: solve the splat with it (non-relativistic, finite hold)
      if (!held && !dragged && !relativistic && !boltsLate && isFinite(pA) && isFinite(hb.H) && hb.H > 0) {
        const pf = splatWithFooting(mA, mB, vRel, out.contact.s, hb.H);
        out.partial = pf;
        h.Q = pf.Q; h.inel = { V: pf.V, pT: mB * pf.V };
        out.contact.soft = { F: pf.F, t: pf.tau };
        out.elasticUpper = hb.H > 0.1 * Fheld;   // bounce numbers ignore the footing: an upper bound on his speed
      }
      // Earth's share (held): momentum and day length; the run-up gave Earth the opposite momentum first
      if (held && !cB.immovable) {
        const M = mB + K.M_E;
        out.earth = {
          dvSplat: momentumToV(h.inel.pT, M), dvBounce: momentumToV(h.el.pT, M),
          dayChange: horiz && isFinite(h.inel.pT) ? COL.T_SID * COL.T_SID * h.inel.pT / (2 * Math.PI * COL.I_FACTOR * K.M_E * K.R_E) : 0,
          runUpCancels: o.source !== 'set',
        };
        out.earth.t1mm = out.earth.dvSplat > 0 ? 1e-3 / out.earth.dvSplat : Infinity;
      }
      // after the hit
      const ancA = anchorCapacity({ body: bA, surface: cA.surface, theta: 0, anchor: cA.anchor === 'bolted' ? 'friction' : cA.anchor, groundHolds: cA.groundHolds, mA }).R;
      const Rb = Math.min(hb.R, hb.H);
      const noSlide = (x) => (out.bound ? null : x);    // gravitationally bound: they fall back together
      if (horiz) {
        out.after = held ? {
          splat: { slide: 0, moved: 0 },
          bounce: { vA: h.el.vA, slideA: noSlide(slideTo(mA, Math.abs(h.el.vA), ancA, bA.frontArea)) },
        } : {
          splat: { V: h.inel.V, during: out.partial ? out.partial.xB : 0, slide: slideTo(mA + mB, h.inel.V, ancA + Rb, Math.max(bA.frontArea, bB.frontArea)) },
          bounce: { vA: h.el.vA, vB: h.el.vT, slideA: noSlide(slideTo(mA, Math.abs(h.el.vA), ancA, bA.frontArea)), slideB: noSlide(slideTo(mB, h.el.vT, Rb, bB.frontArea)) },
        };
        if (!held) out.after.splat.moved = out.after.splat.during + out.after.splat.slide;
      } else {
        const q = qultFor(cB.surface, bB.footB), rho = cB.surface.rho || 2000, A2 = 2 * bB.footArea;
        const sink = (m, v, during) => {
          if (held || cB.groundHolds || !(v > 0)) return { depth: during || 0, Eground: 0 };
          const E = momentumToKE(vToMomentum(v, m), m);
          if (v >= 2000 || !isFinite(E)) { const L = Math.cbrt(6 * m / (Math.PI * bB.rho)); return Object.assign({ Eground: E }, craterDiameter({ L, v, rhoI: bB.rho, rhoT: rho, angleDeg: 90, E })); }
          return { depth: (during || 0) + penetrationDepth(m, A2, v, q, rho), Eground: E };
        };
        out.after = held ? { splat: { depth: 0 }, bounce: { vA: h.el.vA } } : {
          splat: Object.assign({ V: h.inel.V }, sink(mA + mB, h.inel.V, out.partial ? out.partial.xB : 0)),
          bounce: Object.assign({ vA: h.el.vA, vB: h.el.vT }, sink(mB, h.el.vT, 0)),
        };
        if (!held && out.partial) out.after.splat.Eground += out.partial.Efoot;
      }
      if (held && !cB.immovable && cB.anchor === 'bolted') out.rock = cB.groundHolds ? { comic: true } : rockLoad(out.contact.soft.F, cB, 0.5 * (bA.H + bB.H));
      out.Q = h.Q;                                       // splat: energy freed at the contact
      out.quakeHeld = held ? seismicMagnitude(h.Q) : -Infinity;   // energy input is an upper bound (all of Q reaches the ground); the seismic share is the middle value
      // Bolts too slow: after the free hit the bolts stop the pair, dumping the rest of his energy into the ground
      if (boltsLate) {
        const KA = momentumToKE(pA, mA), Eground = Math.max(0, KA - h.Q);
        const L = 2 * eqRadius(bA), rhoT = cB.surface.rho || 2700;
        out.bolts = { Eground, total: KA, crater: isFinite(Eground) && h.inel.V > 0 ? craterDiameter({ L, v: Math.max(h.inel.V, 1), rhoI: Math.max(bA.rho, 1), rhoT, angleDeg: 90, E: Eground }).D : 0 };
      }
      // Above about 1% of light speed everything he carries ends up as heat near the hit, not just the splat share
      const KA = momentumToKE(pA, mA);
      const air = relativistic ? 0.5 * K.rho0 * bA.Cd * bA.frontArea * sp.u * sp.u * d0 : 0;   // rough
      out.airStopsHim = relativistic && air > KA;
      out.airRunUp = Math.min(air, KA);
      out.Elocal = relativistic || boltsLate ? KA + out.airRunUp : h.Q;
      out.KA = KA;
      out.outcome = !isFinite(pA) ? 'unstoppable' : (cB.immovable ? 'immovable' : (held ? 'held' : (boltsLate ? 'boltsLate' : 'moved')));
      return out;
    }
    return { COL, headOn, headOnCM, splatWithFooting, contactForces, rockLoad, slideTo, holdOf, standoff, chargeSpeed, collide };
  })();

  // ---------------------------------------------------------------------------
  // A game of catch between Rex and Ollie: aimed throws over a round Earth (gentle lob or fastball),
  // the catch over a stroke of his hands, heating on the way, and the partners' own gravity wells.
  // ---------------------------------------------------------------------------
  const CATCHGAME = (() => {
    const SG_K = 1.7415e-4;   // Sutton & Graves (1971) stagnation heating constant for Earth air, SI
    const SIGMA_SB = 5.670374419e-8;
    // Radiation ceiling counted only below this height, where the air is densest. Sutton & Hartung (1990)
    // tabulate 30-84 km and show radiation still beating flow heating above 30 km for big fast noses;
    // the sim leaves that out (a blackbody would overstate thin air), so the top end is low for high flights.
    const RAD_H = 30e3;
    const NEAR = 3e3;         // m: drag energy left in the air this close to each partner is reported
    function flyTo(oIn) {
      let o = oIn;
      const { v0, m, A } = o;
      const Cd = o.Cd, CdSup = o.CdSup;
      const theta = (o.thetaDeg == null ? 45 : o.thetaDeg) * Math.PI / 180;
      const h0 = o.h0 || 0;
      const hStop = o.hStop || 0;
      const R = K.R_E;
      const Rs = R + hStop;
      const SPACE = 150e3;
      const machCd = cdAt(Cd, CdSup, v0 / K.a0);
      const Rn = o.Rn || 0;
      const out = {
        v0, range: 0, apex: h0, time: 0, vImpact: 0, impactAngleDeg: 0,
        escaped: false, orbit: false, landed: false, timedOut: false, relativistic: false, belowStop: false,
        maxMach: v0 / K.a0, maxStagT: stagnationT(v0),
        eFold: Cd > 0 ? 2 * m / (K.rho0 * machCd * A) : Infinity,
        heatLoad: 0, qMax: 0, radLoad: 0, qDynMax: rhoAt(h0) * v0 * v0,
        dragE: 0, dragNear0: 0, dragNear1: 0,
        crossedX: false, hAtX: 0, vAtX: 0, angleAtXDeg: 0,
        steps: 0,
      };
      const xStop = o.xStop || Infinity;
      // o.Dend: ground distance to the catcher, to split off the drag energy dumped near each end
      const nearX = o.Dend ? Math.min(NEAR, 0.5 * o.Dend) : 0;
      const accum = (hh, vv, dtt, xg) => {
        const rho = rhoAt(hh);
        if (Rn > 0) {
          const q = SG_K * Math.sqrt(rho / Rn) * vv * vv * vv;
          out.heatLoad += q * dtt; out.qMax = Math.max(out.qMax, q);
          if (hh < RAD_H) out.radLoad += SIGMA_SB * Math.max(0, Math.pow(stagnationT(vv), 4) - Math.pow(K.T0, 4)) * dtt;   // blackbody ceiling on shock-layer radiation
        }
        const qd = rho * vv * vv;
        if (qd > out.qDynMax) out.qDynMax = qd;
        const eD = 0.5 * cdAt(Cd, CdSup, vv / K.a0) * rho * A * vv * vv * vv * dtt;
        out.dragE += eD;
        if (o.Dend) { if (xg < nearX) out.dragNear0 += eD; if (xg > o.Dend - nearX) out.dragNear1 += eD; }
      };
      if (!(v0 > 0)) { out.landed = true; return out; }
      if (v0 > 0.01 * K.c || !isFinite(v0)) { out.relativistic = true; return out; }
      const vacuum = !(Cd > 0);
      let x = 0, y = R + h0;
      let vx = v0 * Math.cos(theta), vy = v0 * Math.sin(theta);
      let t = 0, ang = 0;
      const tMax = o.tMax || 400 * 86400;
      const path = o.record ? [[0, h0]] : null;
      let above = h0 >= hStop;   // has it been at or above the catch height yet?

      if (vacuum && !o._noVac) {
        if (!above || isFinite(xStop)) return flyTo(Object.assign({}, o, { Cd: 1e-30, CdSup: 1e-30, _noVac: true }));
        const c = conicTo(x, y, vx, vy, Rs);
        if (c.radial) return flyTo(Object.assign({}, o, { Cd: 1e-30, CdSup: 1e-30, _noVac: true }));
        if (c.escaped) { out.escaped = true; return out; }
        if ((c.orbit ? c.ra : c.apexR) > K.R_HILL) { out.escaped = true; out.leavesHill = true; out.apex = (c.orbit ? c.ra : c.apexR) - R; return out; }
        if (c.orbit) { out.orbit = true; out.apex = c.ra - R; return out; }
        out.apex = c.apexR - R;
        out.time = c.dt; out.range = R * Math.abs(c.dPhi); out.landed = true;
        out.vImpact = Math.hypot(c.vx, c.vy);
        out.impactAngleDeg = Math.asin(Math.min(1, Math.abs(c.x * c.vx + c.y * c.vy) / (Rs * out.vImpact))) * 180 / Math.PI;
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
      let steps = 0, maxMach = 0, lastRec = 0;
      while (true) {
        if (steps >= 3000000 || t > tMax) { out.timedOut = true; break; }
        const r = Math.hypot(x, y);
        if (r > K.R_HILL) { out.escaped = true; out.leavesHill = true; break; }
        const v = Math.hypot(vx, vy);
        const hNow = r - R;
        if (hNow > SPACE && !o._noVac && (x * vx + y * vy) > 0) {
          const c = conicTo(x, y, vx, vy, R + SPACE);
          if (c.radial) { o = Object.assign({}, o, { _noVac: true }); continue; }
          if (c.escaped) { out.escaped = true; break; }
          if ((c.orbit ? c.ra : c.apexR) > K.R_HILL) { out.escaped = true; out.leavesHill = true; out.apex = Math.max(out.apex, (c.orbit ? c.ra : c.apexR) - R); break; }
          if (c.orbit) { out.orbit = true; out.apex = Math.max(out.apex, c.ra - R); break; }
          out.apex = Math.max(out.apex, c.apexR - R);
          if (R * Math.abs(ang + c.dPhi) >= xStop) { out.crossedX = true; out.hAtX = Infinity; out.vAtX = NaN; out.inSpaceAtX = true; break; }
          if (path) {
            const segs = 48;
            for (let i = 1; i <= segs; i++) {
              const fr = i / segs;
              const phi = ang + c.dPhi * fr;
              const hh = c.p / (1 + c.e * Math.cos(c.f0 + Math.abs(c.dPhi) * fr)) - R;
              path.push([R * Math.abs(phi), Math.max(0, hh), true]);
            }
          }
          x = c.x; y = c.y; vx = c.vx; vy = c.vy; t += c.dt; ang += c.dPhi;
          above = true;
          continue;
        }
        const [ax, ay] = acc(x, y, vx, vy);
        const a = Math.hypot(ax, ay);
        let dt = 0.002 * Math.max(v, 1e-3) / Math.max(a, 1e-9);
        dt = Math.min(dt, 0.002 * r / Math.max(v, 1e-9));
        const hAboveStop = above ? r - Rs : hNow;
        if (x * vx + y * vy < 0) dt = Math.min(dt, Math.max(0.5, 0.05 * hAboveStop) / Math.max(v, 1e-9));
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
        // ground distance xStop reached first (direct throws): state where it passes him
        if (isFinite(xStop) && R * Math.abs(ang + dAng) >= xStop && nr >= R) {
          const f = (xStop - R * Math.abs(ang)) / Math.max(R * Math.abs(dAng), 1e-12);
          const ix = x + (nx - x) * f, iy = y + (ny - y) * f, ivx = vx + (nvx - vx) * f, ivy = vy + (nvy - vy) * f;
          const ir = Math.hypot(ix, iy), vI = Math.hypot(ivx, ivy), vr = (ix * ivx + iy * ivy) / ir;
          accum(hNow, v, dt * f, R * Math.abs(ang));
          t += dt * f; ang += dAng * f;
          out.crossedX = true; out.hAtX = ir - R; out.vAtX = vI; out.angleAtXDeg = -Math.asin(Math.max(-1, Math.min(1, vr / Math.max(vI, 1e-12)))) * 180 / Math.PI;
          if (path) path.push([R * Math.abs(ang), ir - R]);
          break;
        }
        // stop surface: the catch height once it has been above it, otherwise the ground
        const rStop = above ? Rs : R;
        if (nr < rStop) {
          const f = (r - rStop) / Math.max(r - nr, 1e-12);
          ang += dAng * f;
          t += dt * f;
          accum(hNow, v, dt * f, R * Math.abs(ang));
          const ivx = vx + (nvx - vx) * f, ivy = vy + (nvy - vy) * f;
          const ix = x + (nx - x) * f, iy = y + (ny - y) * f;
          const ir = Math.hypot(ix, iy);
          const vr = (ix * ivx + iy * ivy) / ir;
          const vImp = Math.hypot(ivx, ivy);
          out.vImpact = vImp;
          out.impactAngleDeg = Math.asin(Math.min(1, Math.abs(vr) / Math.max(vImp, 1e-12))) * 180 / Math.PI;
          out.landed = true;
          out.belowStop = !above && hStop > 0;
          if (path) path.push([R * Math.abs(ang), rStop - R]);
          break;
        }
        accum(hNow, v, dt, R * Math.abs(ang));
        x = nx; y = ny; vx = nvx; vy = nvy; t += dt; ang += dAng;
        if (!above && nr >= Rs) above = true;
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

    const CATCH = {
      STROKE: 0.3,              // x height: arm travel from full reach to the chest (ANSUR II men: (81.19 - 25.38) / 175.62 = 0.318, rounded down); an estimate
      CHEST: 0.07,              // x height: front of the chest ahead of his centre line (ANSUR II chest depth 25.38 / 175.62, halved)
      GIVE_LO: 0.01,            // x height: palm and object squash 2-5 cm (at 2 m) on first contact; an estimate
      GIVE_HI: 0.025,
      ECC: 1.0,                 // catching force cap = his full strength (real muscle resists ~1.2x harder while stretched; left out)
      V_FIREBALL: 0.01 * K.c,   // project convention: above this the object never lands as an object
      AIR_COLUMN: K.p0 / K.g,   // 10,332 kg of air over each square metre at sea level
      D_MAX: Math.PI * K.R_E,   // other side of the planet, along the surface: 20,015 km
      SG_P_MAX: Math.sqrt(100 * 101325 / K.rho0), // speed at which sea-level stagnation pressure passes 100 atm (top of the fit): 2,876 m/s
      SG_V_MIN: Math.sqrt(2 * 2.3e6), // 2,145 m/s: below the fit's lowest tested enthalpy (2.3 MJ/kg)
      BASEBALL_SAFE_N: 40000,   // Adair (1995): a home-run hit squeezes a baseball with ~40,000 N at its peak; it survives
    };
    // eStar: J/kg to heat 1 kg from room temperature and melt (or char, or calcine) it.
    // eVap: J/kg to heat it to boiling, melt and boil it (fact heat_to_vaporise_per_kg): iron from JANAF
    // via Fegley & Schaefer; aluminium and copper from their heats; water stands in for organics, forsterite for stone.
    const MATERIALS = {
      steel: { label: 'steel', tC: 1538, verb: 'melt', eStar: 0.93e6, eVap: 8.6e6, src: 'iron melts at 1,538 °C' },
      aluminium: { label: 'aluminium', tC: 660, verb: 'melt', eStar: 0.98e6, eVap: 13.1e6, src: 'aluminium melts at 660 °C' },
      copper: { label: 'copper', tC: 1085, verb: 'melt', eStar: 0.62e6, eVap: 5.9e6, src: 'copper melts at 1,085 °C' },
      organic: { label: 'wood, leather or plastic', tC: 300, verb: 'char', eStar: 1e6, eVap: 2.6e6, src: 'wood chars from about 300 °C' },
      stone: { label: 'limestone', tC: 825, verb: 'break down', eStar: 2.5e6, eVap: 8.4e6, src: 'limestone breaks down to quicklime at 825-840 °C' },
    };
    const OBJ_MATERIAL = {
      baseball: 'organic', shot: 'steel', bowling: 'organic', piano: 'organic', motorcycle: 'steel', car: 'steel', pickup: 'steel',
      bus: 'steel', semi: 'steel', tank: 'steel', loco: 'steel', cc177: 'aluminium', b777: 'aluminium', shuttle: 'aluminium',
      liberty: 'copper', eiffel: 'steel', titanic: 'steel', nimitz: 'steel', esb: 'stone', pyramid: 'stone', bar511: 'steel',
      backlift: 'steel', desoto: 'steel', ruyi: 'steel',
    };
    const MATERIAL_NOTE = { shuttle: 'Its orbiter is covered in heat-shield tiles and its booster casings are steel; the sim uses aluminium’s 660 °C for the whole stack.' };

    // One reach geometry for every catch: the object is held against his chest, and his hands meet it
    // one arm stroke further out. A dense body's chest sits on its equal-volume sphere.
    const sizeOf = (obj) => obj.L || Math.cbrt(obj.m / (obj.rho || 1000));
    const chestRadius = (body, obj) => Math.max(eqRadius(body), CATCH.CHEST * body.H) + 0.5 * sizeOf(obj);
    const meetRadius = (body, obj) => chestRadius(body, obj) + CATCH.STROKE * body.H;
    const pushStartRadius = (body) => Math.max(eqRadius(body), 0.25 * body.H);
    const selfGravityOn = (body) => K.G * body.m / Math.pow(0.5 * body.H, 2) >= 1e-3 * K.g;
    const GMof = (body) => (selfGravityOn(body) ? K.G * body.m : 0);
    const noseRadius = (obj) => Math.sqrt(obj.area / Math.PI);
    const strokeOf = (body, obj) => (throwStyle(obj).style === 'whip' ? body.strokes.whip : body.strokes.throw);

    function partnerAsObject(body, name) {
      return { id: 'partner', name, short: name, m: body.m, area: body.frontArea, Cd: body.Cd, CdSup: 1.75, rho: body.rho, L: body.H, indestructible: true };
    }

    function flight(obj, v, th, h0, hStop, record) {
      return flyTo({ v0: v, thetaDeg: th, h0, hStop, m: obj.m, A: obj.area, Cd: obj.Cd, CdSup: obj.CdSup, Rn: noseRadius(obj), record });
    }
    const overshoot = (f) => f.escaped || f.orbit || f.timedOut;
    function reaches(f, D) { return f.relativistic || overshoot(f) || (f.landed && !f.belowStop && f.range >= D); }

    // ---------------------------------------------------------------- aiming
    // Least launch speed at angle th that reaches D (to 0.05%), and the flight at that speed.
    function vNeededAt(obj, D, th, h0, hStop, vCap, guess) {
      let fh = flight(obj, vCap, th, h0, hStop);
      if (!reaches(fh, D)) return { v: Infinity, f: null };
      let lo = Math.min(1e-3, vCap / 2), hi = vCap;
      if (guess && guess < vCap) {
        const a = guess / 1.25, b = Math.min(vCap, guess * 1.25);
        if (!reaches(flight(obj, a, th, h0, hStop), D)) { const fb = flight(obj, b, th, h0, hStop); if (reaches(fb, D)) { lo = a; hi = b; fh = fb; } }
      }
      for (let i = 0; i < 80 && hi / lo > 1 + 5e-4; i++) {
        const mid = Math.sqrt(lo * hi), fm = flight(obj, mid, th, h0, hStop);
        if (reaches(fm, D)) { hi = mid; fh = fm; } else lo = mid;
      }
      return { v: hi, f: fh };
    }
    const easyCache = new Map();
    // Gentlest throw: least launch speed over angles (scan, then golden section). Independent of strength: cached.
    function aimEasy(obj, D, h0, hStop) {
      const vCap = CATCH.V_FIREBALL * 0.999;
      const key = [obj.id, obj.m, obj.area, obj.Cd, obj.CdSup, D, h0, hStop].join('|');
      if (easyCache.has(key)) return easyCache.get(key);
      let guess = null, anyReach = null;
      // the search counts escaping or orbiting throws as reaching him, so it stays monotone in speed;
      // an angle whose least such speed overshoots has no arc that comes down at D: skip it
      const g = (th) => {
        const { v, f } = vNeededAt(obj, D, th, h0, hStop, vCap, guess);
        if (!isFinite(v)) return v;
        guess = v;
        if (overshoot(f)) { if (!anyReach || v < anyReach.v) anyReach = { thetaDeg: th, v }; return Infinity; }
        return v;
      };
      const grid = [5, 15, 25, 35, 45, 55, 65, 75];
      let bi = -1, bv = Infinity;
      grid.forEach((th, i) => { const v = g(th); if (v < bv) { bv = v; bi = i; } });
      let out;
      if (bi < 0) out = anyReach ? { reachable: true, noArc: true, thetaDeg: anyReach.thetaDeg, v: anyReach.v } : { reachable: false };
      else {
        let a = bi > 0 ? grid[bi - 1] : 0.5, b = bi < grid.length - 1 ? grid[bi + 1] : 85;
        const gr = (Math.sqrt(5) - 1) / 2;
        let c = b - gr * (b - a), d = a + gr * (b - a), gc = g(c), gd = g(d);
        while (b - a > 0.25) {
          if (gc < gd) { b = d; d = c; gd = gc; c = b - gr * (b - a); gc = g(c); }
          else { a = c; c = d; gc = gd; d = a + gr * (b - a); gd = g(d); }
        }
        let th = gc < gd ? c : d, v = Math.min(gc, gd);
        if (bv < v) { th = grid[bi]; v = bv; }
        out = { reachable: true, thetaDeg: th, v };
      }
      if (easyCache.size > 300) easyCache.clear();
      easyCache.set(key, out);
      return out;
    }
    // Hardest throw: full strength, flattest path that passes his hands at D (may be aimed a hair downward).
    // Predicate: at ground distance D the object is at or above his hand height (or still up in space).
    // At 1% of light speed and up it flies straight: it is a fireball aimed at him only if that straight
    // line meets him (between his feet and the top of his head); a steeper one goes up, not toward him.
    function aimHard(obj, D, h0, hStop, vOf) {
      const fx = (th) => flyTo({ v0: vOf(th), thetaDeg: th, h0, hStop: 0, xStop: D, m: obj.m, A: obj.area, Cd: obj.Cd, CdSup: obj.CdSup, Rn: noseRadius(obj) });
      const ok = (f) => f.crossedX && f.hAtX >= hStop;
      const drop = D * D / (2 * K.R_E);                  // the ground curving away under a straight line
      const lineAt = (th) => h0 + D * Math.tan(th * Math.PI / 180) - drop;
      const thAim = Math.atan2(hStop - h0 + drop, D) * 180 / Math.PI;   // straight at his hands
      const grid = [-80, -60, -45, -30, -20, -10, -5, -2, -1, -0.5, 0, 0.25, 0.5, 1, 2, 3, 5, 7.5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 89];
      let prev = null;
      for (const th of grid) {
        const v = vOf(th);
        if (v >= CATCH.V_FIREBALL) {
          const y = lineAt(th);
          if (y < 0) { prev = th; continue; }           // aimed into the ground short of him
          const vAim = vOf(thAim);
          if (vAim >= CATCH.V_FIREBALL) return { fireball: true, v: vAim, thetaDeg: Math.max(0, thAim) };
          if (y <= hStop / 0.9) return { fireball: true, v, thetaDeg: Math.max(0, th) };
          return { overshoots: true, relativistic: true, v, thetaDeg: th };
        }
        if (!(v > 0)) { prev = th; continue; }
        const f = fx(th);
        if (overshoot(f) && !f.crossedX) return { overshoots: true, v, thetaDeg: th, escaped: f.escaped, orbit: f.orbit };
        if (ok(f)) {
          if (prev == null) return { ok: true, thetaDeg: th, v, f };
          let lo = prev, hi = th, fh = f;
          while (hi - lo > 1e-6 * Math.max(1, Math.abs(hi))) {
            const mid = 0.5 * (lo + hi), fm = fx(mid);
            if (ok(fm)) { hi = mid; fh = fm; } else lo = mid;
          }
          return { ok: true, thetaDeg: hi, v: vOf(hi), f: fh };
        }
        prev = th;
      }
      return { short: true };
    }
    // Farthest at full strength (golden section on angle), below the fireball speed.
    function farthest(obj, h0, hStop, vOf) {
      const R = (th) => { const v = Math.min(vOf(th), CATCH.V_FIREBALL * 0.999); if (!(v > 0)) return 0; const f = flight(obj, v, th, h0, hStop); return overshoot(f) ? Infinity : (f.landed && !f.belowStop ? f.range : 0); };
      const grid = [1, 10, 20, 30, 40, 45, 50, 60, 70, 80];
      let bi = 0, br = -1;
      for (let i = 0; i < grid.length; i++) { const r = R(grid[i]); if (r === Infinity) return { range: Infinity, thetaDeg: grid[i] }; if (r > br) { br = r; bi = i; } }
      let a = bi > 0 ? grid[bi - 1] : 0.5, b = bi < grid.length - 1 ? grid[bi + 1] : 89;
      const gr = (Math.sqrt(5) - 1) / 2;
      let c = b - gr * (b - a), d = a + gr * (b - a), rc = R(c), rd = R(d);
      while (b - a > 0.2) {
        if (rc > rd) { b = d; d = c; rd = rc; c = b - gr * (b - a); rc = R(c); }
        else { a = c; c = d; rc = rd; d = a + gr * (b - a); rd = R(d); }
      }
      const best = Math.max(rc, rd);
      return best >= br ? { range: best, thetaDeg: rc > rd ? c : d } : { range: br, thetaDeg: grid[bi] };
    }
    // farthest() does not depend on the distance between them: cache it while the distance slider moves
    const farCache = new Map();
    function farthestCached(key, obj, h0, hStop, vOf) {
      const k = [key, obj.id, obj.m, obj.area, h0, hStop].join('|');
      if (!farCache.has(k)) { if (farCache.size > 200) farCache.clear(); farCache.set(k, farthest(obj, h0, hStop, vOf)); }
      return farCache.get(k);
    }
    // Full-strength release speed vs angle: exact throws at 16 angles, then linear interpolation.
    // On yielding ground the footing limit grows as 1/cos(angle) near vertical, so the angles bunch up
    // there, and the table stops at 89°: straight up the footing model has no sideways limit at all
    // (anchorCapacity), and interpolating toward that value overstated near-vertical throws up to ~100x.
    // Checked against exact throws: within ~15% at any angle up to 89°.
    const TABLE_TOP = 89;
    const tableCache = new Map();
    function releaseTable(ctxT, obj) {
      const b = ctxT.body, s = ctxT.surface || {};
      const key = [ctxT.F, ctxT.mode, ctxT.noBlend, ctxT.anchor, ctxT.groundHolds, s.id, b.H, b.m, b.build, obj.id, obj.m, obj.area].join('|');
      if (tableCache.has(key)) return tableCache.get(key);
      const ths = [0, 7.5, 15, 22.5, 30, 37.5, 45, 52.5, 60, 67.5, 75, 80, 84, 86, 88, TABLE_TOP];
      const noFl = Object.assign({}, ctxT, { noFlight: true });
      const rs = ths.map((th) => throwObject(noFl, obj, th));
      const vs = rs.map((r) => (r.canMove ? r.v : 0));
      const E0 = rs[0].canMove ? rs[0].Eobj : 0;
      const vOf = (thIn) => {
        const th = Math.min(TABLE_TOP, Math.max(0, thIn));
        let i = 0;
        while (i < ths.length - 2 && th > ths[i + 1]) i++;
        const t = (th - ths[i]) / (ths[i + 1] - ths[i]);
        return vs[i] * (1 - t) + vs[i + 1] * t;
      };
      // the exact throw at one angle (the one he actually uses), for its energy and his recoil
      const exact = new Map();
      const at = (th) => { const k = Math.min(TABLE_TOP, Math.max(0, th)); if (!exact.has(k)) exact.set(k, throwObject(noFl, obj, k)); return exact.get(k); };
      const out = { key, vOf, at, ths, vs, vTop: Math.max(...vs), at45: rs[6], E0, r0: rs[0] };
      if (tableCache.size > 60) tableCache.clear();
      tableCache.set(key, out);
      return out;
    }

    // ---------------------------------------------------------------- gravity wells of dense partners
    function wells(bT, bC, obj, D) {
      const GT = GMof(bT), GC = GMof(bC);
      const x0 = pushStartRadius(bT);
      const rHeld = chestRadius(bC, obj), stroke = CATCH.STROKE * bC.H, rMeet = rHeld + stroke;
      const x1 = Math.max(x0, D - rMeet);
      const phi = (x) => -(GT > 0 ? GT / x : 0) - (GC > 0 ? GC / Math.max(D - x, 1e-9) : 0);
      let xs = GT > 0 && GC > 0 ? D / (1 + Math.sqrt(GC / GT)) : (GT > 0 ? x1 : x0);
      xs = Math.min(x1, Math.max(x0, xs));
      const dBeatT = Math.sqrt(GT / K.g), dBeatC = Math.sqrt(GC / K.g);
      const wellDominated = GT + GC > 0 && D < dBeatT + dBeatC;
      return {
        GT, GC, x0, x1, xs, rHeld, rMeet, stroke, phi, dBeatT, dBeatC,
        barrier: Math.max(0, phi(xs) - phi(x0)),       // J/kg needed at release to get over the top
        gain: phi(x0) - phi(x1),                       // J/kg gained from release to where his hands meet it
        inStroke: GC > 0 ? GC * (1 / rHeld - 1 / rMeet) : 0, // J/kg his pull adds while he brings it in
        wellDominated,
        // their pulls beat Earth's over a good part of an ordinary arc: the Earth-only arc is rough
        rough: !wellDominated && Math.max(dBeatT, dBeatC) > 0.1 * D,
      };
    }
    // Straight line between them (their pull beats Earth's all the way), with sea-level drag:
    // d(v^2)/dx = -2 dPhi/dx - (rho0 Cd A / m) v^2, stepped exactly for a constant slope and drag over each step.
    function wellRun(w, obj, vL, light) {
      const n = 3000, Rn = noseRadius(obj), k0 = K.rho0 * obj.area / obj.m, sg = SG_K * Math.sqrt(K.rho0 / Rn);
      const dx = (w.x1 - w.x0) / n;
      let x = w.x0, v2 = vL * vL, t = 0, heat = 0, rad = 0, vmax = vL;
      for (let i = 0; i < n; i++) {
        const xb = w.x0 + (i + 1) * dx;
        const v = Math.sqrt(v2);
        const a = k0 * cdAt(obj.Cd, obj.CdSup, v / K.a0) * dx;
        const dPhi = w.phi(xb) - w.phi(x);
        const decay = Math.exp(-a);
        const v2n = v2 * decay - 2 * dPhi * (a > 1e-9 ? (1 - decay) / a : 1);
        if (!(v2n > 0)) return { reached: false, xStop: x - w.x0 };
        if (!light) {
          const vm = 0.5 * (v + Math.sqrt(v2n)), dt = dx / vm;
          t += dt;
          heat += sg * vm * vm * vm * dt;
          rad += SIGMA_SB * Math.max(0, Math.pow(stagnationT(Math.min(vm, CATCH.V_FIREBALL)), 4) - Math.pow(K.T0, 4)) * dt;
          vmax = Math.max(vmax, Math.sqrt(v2n));
        }
        v2 = v2n; x = xb;
      }
      return {
        reached: true, vArrive: Math.sqrt(v2), time: t, heatLoad: heat, radLoad: rad, vmax, qDynMax: K.rho0 * vmax * vmax,
        Edrag: Math.max(0, obj.m * (0.5 * vL * vL + w.phi(w.x0) - w.phi(w.x1) - 0.5 * v2)),
      };
    }
    // Least launch speed that still reaches him along the line (0: just let go).
    function wellNeed(w, obj) {
      if (wellRun(w, obj, 0, true).reached) return 0;
      let lo = 0, hi = Math.max(1, Math.sqrt(2 * w.barrier));
      while (!wellRun(w, obj, hi, true).reached) { lo = hi; hi *= 2; if (hi > CATCH.V_FIREBALL) return Infinity; }
      for (let i = 0; i < 40 && hi - lo > 1e-6 * hi; i++) { const mid = 0.5 * (lo + hi); if (wellRun(w, obj, mid, true).reached) hi = mid; else lo = mid; }
      return hi;
    }

    // ---------------------------------------------------------------- the catch itself
    // v: speed when his hands meet it; gammaDeg: how steeply it comes down (0 = level).
    // 1. First contact: his hands wait at full reach, at rest, and stick to the object. That collision's
    //    energy loss goes into squashing palm and object by a few cm (an estimate), not into the arm stroke.
    // 2. The stroke: his arms bring object and hands to rest over 0.3 x his height, against Earth's pull
    //    along the line and his own pull (dense catcher). If his feet slip, sliding friction still grows with the load.
    function catchIt(ctxC, obj, v, gammaDeg, w) {
      const body = ctxC.body, M = body.m, m = obj.m;
      const d = CATCH.STROKE * body.H;
      const gm = gammaDeg * Math.PI / 180, sinG = Math.max(0, Math.sin(gm)), cosG = Math.cos(gm);
      const gSelf = w && w.GC > 0 ? w.GC / (w.rHeld * w.rHeld) : 0;
      const holdLoad = Math.hypot(m * K.g, m * gSelf);
      const Fcap = CATCH.ECC * ctxC.F;
      const mh = 2 * body.handEff, mS = m + mh, Mb = Math.max(M - mh, 1e-9);
      const v1 = v * m / mS;
      const E1 = 0.5 * m * mh / mS * v * v;
      const give = [CATCH.GIVE_LO * body.H, CATCH.GIVE_HI * body.H];
      const F1 = [E1 / give[1], E1 / give[0]];        // mean contact force: soft end, hard end
      const E2 = 0.5 * mS * v1 * v1 + m * (w ? w.inStroke : 0) + m * K.g * d * sinG;
      const vEff2 = 2 * E2 / mS;
      const anc = anchorCapacity({ body, surface: ctxC.surface, theta: gm, anchor: ctxC.anchor, groundHolds: ctxC.groundHolds, mA: M, mB: m });
      const R = anc.R;
      const FA = E2 / d;                               // footing holds: the arms do all the stopping over d
      const relNeed = vEff2 / (2 * d);
      let Fneed = FA, slips = false;
      if (FA > R && isFinite(FA)) {
        // he slides while he stops it: F/mS + (F - Rslide(F))/Mb = v_eff^2/(2d)
        slips = true;
        const gap = (F) => F / mS + (F - anc.Rslide(F)) / Mb - relNeed;
        let lo = R, hi = FA;
        for (let i = 0; i < 200 && hi - lo > 1e-12 * hi; i++) { const mid = 0.5 * (lo + hi); if (gap(mid) > 0) hi = mid; else lo = mid; }
        Fneed = hi;
      }
      const need = Math.max(Fneed, holdLoad);
      const clean = Fcap >= need * (1 - 1e-9);
      const F = clean ? Fneed : Fcap;
      const aC = F > R ? (F - anc.Rslide(F)) / Mb : 0;
      // The stroke at the stated arm force F. Along the stroke, Earth's pull (m g sin angle) and his own
      // (m x inStroke / d on average) push the object on toward his chest, so the net force slowing object
      // and hands is F_net = F - m g sin(angle) - m inStroke / d. Relative to his sliding body the
      // deceleration is a_net = F_net / (m + m_h) + aC, and the time is t = (v1 - vSlam) / a_net. At the
      // least force that works it stops exactly at his chest: a_net = v1^2 / 2d, so t = 2d / v1.
      const Fpull = m * K.g * sinG + m * (w ? w.inStroke : 0) / d;
      const aNet = (F - Fpull) / mS + aC;
      let tStroke, vSlam = 0;
      if (clean) tStroke = 2 * d / Math.max(v1, 1e-300);
      else {
        const rem = v1 * v1 - 2 * aNet * d;
        vSlam = rem > 0 ? Math.sqrt(rem) : 0;
        tStroke = Math.abs(aNet) > 1e-12 * Math.max(v1 * v1 / d, 1e-300) ? (v1 - vSlam) / aNet : d / Math.max(v1, 1e-300);
      }
      // Forced stroke: he slides, can't stop it, or needs most of his strength. Then the stroke time is set by
      // physics. Otherwise he has strength to spare: the catch itself is over at first contact (for a light
      // object) and how long he takes to bring it to his chest is up to him, so it is no fixed time.
      const forced = slips || !clean || F >= 0.5 * Fcap;
      const tContact = [2 * CATCH.GIVE_LO * body.H / Math.max(v, 1e-300), 2 * CATCH.GIVE_HI * body.H / Math.max(v, 1e-300)];
      const vc = aC * tStroke;
      const uAfter = clean ? vc : (mS * (vc + vSlam) + Mb * vc) / (mS + Mb);
      const Rs = anchorCapacity({ body, surface: ctxC.surface, theta: 0, anchor: ctxC.anchor, groundHolds: ctxC.groundHolds, mA: M + m }).R;
      const uH = uAfter * cosG;
      // the pair coasts to a stop against friction and air drag: (M+m) v dv/dx = -Rs - 1/2 rho Cd A v^2
      const kAir = 0.5 * K.rho0 * Math.max(body.Cd * body.frontArea, cdAt(obj.Cd || 1, obj.CdSup || 1, uH / K.a0) * obj.area);
      const slideAfter = coastDist(M + m, uH, Rs, kAir);
      const slideDuring = 0.5 * aC * tStroke * tStroke * cosG;
      const contact = Math.min(2 * body.palmArea, obj.area);
      const Fobj = F * m / mS;                         // the part of the arm force that stops the object itself
      const Fhand = Math.max(Fobj, holdLoad);
      const press = [Math.max(F1[0], Fhand), Math.max(F1[1], Fhand)];
      const E0 = 0.5 * m * v * v;
      return {
        stroke: d, Fcap, Fneed: need, F, Fpeak: Math.max(F, holdLoad), clean, slips, R, holdLoad, canHold: Fcap >= holdLoad * (1 - 1e-9),
        tStroke, forced, tContact, Fpull, aNet, decelG: Fobj / m / K.g, vSlam,
        uAfter, slide: slideDuring + slideAfter,
        mh, v1, E1, give, F1, firstShare: E0 > 0 ? E1 / E0 : 0,
        contact, press,
        // gentle hold: the catcher's stop is spread through the whole object, so his palms put no load on it
        gripRatio: obj.crush && !ctxC.gentleHold ? press[0] / contact / obj.crush : 0, gripRatioHi: obj.crush && !ctxC.gentleHold ? press[1] / contact / obj.crush : 0,
        gripRatioRaw: obj.crush ? press[0] / contact / obj.crush : 0,
        plateNeeded: obj.crush && !ctxC.gentleHold ? press[0] / obj.crush : 0,
        // the hardest push on it (first hit or arm stroke) spread over its average cross-section:
        // past 1, no plate can spread the load enough and it crumples
        wholeFront: obj.crush ? press[0] / obj.area / obj.crush : 0,
        // a linear-spring contact peaks at twice its mean force
        baseballRatio: obj.id === 'baseball' ? Math.max(2 * F1[0], Fhand) / CATCH.BASEBALL_SAFE_N : 0,
        baseballRatioHi: obj.id === 'baseball' ? Math.max(2 * F1[1], Fhand) / CATCH.BASEBALL_SAFE_N : 0,
        sinkRatio: isFinite(anc.Nmax) ? anc.N(F) / anc.Nmax : 0,
        Ecatch: E0 + m * (w ? w.inStroke : 0) + m * K.g * d * sinG,
      };
    }

    // ---------------------------------------------------------------- what the air does to the object
    // Convection (Sutton-Graves) is the low end; adding a blackbody ceiling on glowing-air radiation
    // below 30 km gives the high end. Share = heat x frontal area / (mass x heat to melt 1 kg).
    function heatVerdict(obj, heatLoad, stagT, vMaxAir, radLoad) {
      if (obj.indestructible) return { kind: 'immune', heatLoad, stagT };
      const mat = MATERIALS[obj.material || OBJ_MATERIAL[obj.id] || 'steel'];
      const noseC = stagT - 273.15;
      const per = obj.area / (obj.m * mat.eStar);
      const frac = heatLoad * per, fracHi = (heatLoad + (radLoad || 0)) * per;
      const kindOf = (f) => (noseC < mat.tC ? 'warm' : f < 0.01 ? 'skin' : f < 0.5 ? 'loses' : 'destroyed');
      const kind = kindOf(frac), kindHi = kindOf(fracHi);
      return {
        kind, kindHi, mat, noseC, frac, fracHi, heatLoad, radLoad: radLoad || 0, stagT, note: MATERIAL_NOTE[obj.id] || null,
        extrapolated: vMaxAir > CATCH.SG_P_MAX || vMaxAir < CATCH.SG_V_MIN,
        radiation: kind !== 'warm' && (radLoad || 0) > 0.1 * heatLoad,
      };
    }

    // ---------------------------------------------------------------- relativistic pitch (1% of light speed and up)
    // Snowplow: the object keeps its momentum while it scoops up air at rest. With x = swept air mass / m,
    // energy and momentum conservation give the heat made so far exactly (relativity included):
    //   heat = 2 E x / (S + 1 + x),  S = sqrt((1 + x)^2 + 2 (gamma - 1) x),  E = (gamma - 1) m c^2.
    // Half its motion energy has become heat at x = 1 + (gamma - 1)/4: that is the 'sweep' length.
    function fireballAt(obj, v, D, ctxC, Eknown) {
      const m = obj.m, E = Eknown != null ? Eknown : momentumToKE(vToMomentum(v, m), m);
      // momentum from the energy (pc = sqrt(E^2 + 2 E m c^2)): exact even when v rounds to c
      const p = isFinite(E) ? Math.sqrt(E * E + 2 * E * m * K.c * K.c) / K.c : Infinity;
      const gm1 = isFinite(E) ? E / (m * K.c * K.c) : Infinity;
      const unit = m / (K.rho0 * obj.area);
      const sweep = isFinite(gm1) ? unit * (1 + gm1 / 4) : Infinity;
      const heatAt = (x) => (isFinite(E) ? 2 * E * x / (Math.sqrt((1 + x) * (1 + x) + 2 * gm1 * x) + 1 + x) : Infinity);
      const xg = D / unit;
      const xr = D / sweep;
      const kind = xr < 0.01 ? 'arrives' : (xr < 1 ? 'plasma' : 'before');
      const Egap = heatAt(xg);                          // heat made in the air between them
      const Earr = isFinite(E) ? E - Egap : Infinity;   // motion energy still carried toward him
      const gamma = 1 + gm1;
      const mat = MATERIALS[obj.material || OBJ_MATERIAL[obj.id] || 'steel'];
      const out = { E, p, gamma, sweep, unit, kind, Egap, Earr, Eair: Egap, vapRatio: isFinite(Egap) ? Egap / (m * mat.eVap) : Infinity, mat,
        vLumpAt: isFinite(gamma) ? v / (1 + xg / gamma) : v };
      const body = ctxC.body, bolted = ctxC.anchor === 'bolted';
      if (kind === 'before') {
        // the fireball keeps rushing toward him; a point blast at the sweep distance is an order of magnitude, probably low
        const r = Math.max(D - sweep, body.H); out.rBlast = r; out.overpressure = isFinite(E) ? overpressureAt(E, r) : Infinity;
      }
      // The lump's rest mass when it reaches him: the object, the air it swept up, and the heat it carries
      // (heat has mass, E/c^2; at these speeds it can outweigh the object).
      const mLump = isFinite(Egap) ? m * (1 + xg) + Egap / (K.c * K.c) : Infinity;
      // whatever arrives (debris and plasma) carries almost all the momentum; no hand catch applies
      out.push = { recoilV: bolted ? 0 : momentumToV(p, body.m + mLump), earthRecoilV: bolted ? p / K.M_E : 0 };
      // Energy where he stands ('arrives', 'plasma'): the heat made on the way rides inside the lump, so it
      // all reaches him. Stopping it there frees everything except the motion left afterwards: the Earth's
      // recoil p^2/2M_E if he is bolted (tiny), or the motion he and the lump share if he is free. That
      // shared motion goes on with him and turns to heat in the air within about one sweep of the pair.
      const Eafter = !isFinite(p) || !isFinite(mLump) ? Infinity : momentumToKE(p, bolted ? K.M_E : body.m + mLump);
      out.Ehere = isFinite(E) ? Math.max(0, E - Eafter) : Infinity;
      out.Eafter = Eafter;
      out.Ecarry = bolted ? 0 : Eafter;
      out.Enear = 0;
      if (!bolted && isFinite(Eafter)) {
        const mm = body.m + mLump, aa = Math.max(obj.area, body.frontArea), g1 = Eafter / (mm * K.c * K.c);
        out.sweepOn = mm / (K.rho0 * aa) * (1 + g1 / 4);
        // A level ride stays in the dense lower air for about sqrt(2 R_E H_s) (~320 km): by then the ground
        // has curved one scale height away. Snowplow heat of the pair over that stretch.
        out.Lnear = Math.sqrt(2 * K.R_E * K.Hs);
        const x2 = K.rho0 * aa * out.Lnear / mm;
        out.Enear = 2 * Eafter * x2 / (Math.sqrt((1 + x2) * (1 + x2) + 2 * g1 * x2) + 1 + x2);
      }
      // what the blast sees: everything freed near him (all of it when bolted, less the Earth's tiny recoil)
      out.Eblast = kind === 'before' ? E : out.Ehere + out.Enear;
      return out;
    }

    // ---------------------------------------------------------------- one throw: T to C
    function leg(ctxT, ctxC, obj, D, style) {
      const bT = ctxT.body, bC = ctxC.body;
      const h0 = bT.releaseHeight, hStop = bC.releaseHeight;
      const out = { style, D, h0, hStop };
      if (isBlackHole(bT)) return Object.assign(out, { result: 'thrower-black-hole' });
      const w = wells(bT, bC, obj, D);
      out.wells = w;
      const Dfl = Math.max(1e-3, w.x1 - w.x0);        // from where his push starts to where Ollie's hands meet it
      out.Dfl = Dfl;
      out.size = sizeOf(obj);
      const tab = releaseTable(ctxT, obj);
      // holding it before the throw: Earth's pull and his own, plus the catcher's pull across the gap on it and his hand
      const pullC = w.GC > 0 ? (obj.m + (tab.at45.armMass || 0)) * w.GC / Math.pow(Math.max(D - w.x0, 1e-9), 2) : 0;
      out.partnerPull = pullC;
      out.holdNeeded = Math.hypot(tab.at45.needed, pullC);
      out.armHold = (tab.at45.armMass || 0) * K.g;     // the part that is his own hand and arm (dense thrower)
      if (!tab.at45.canHold || !(ctxT.F >= out.holdNeeded * (1 - 1e-9))) return Object.assign(out, { result: 'cant-hold' });
      const vOfE = (th) => { const v = tab.vOf(th); const q = v * v - 2 * w.barrier; return q > 0 ? Math.sqrt(q) : 0; };
      const vTopE = Math.sqrt(Math.max(0, tab.vTop * tab.vTop - 2 * w.barrier));
      // he holds it but can't push it any faster than holding it up takes: no throw at all
      const cantMove = !(tab.vTop > 0);
      let vE, vL, th, vMax;
      if (w.wellDominated) {
        // aimed straight at him: the wells, not Earth, shape the path
        th = 0; vMax = tab.vOf(0);
        const need = wellNeed(w, obj);
        out.vNeed = need;
        if (cantMove && need > 0) return Object.assign(out, { result: 'cant-move' });
        if (style === 'hard' && vMax >= CATCH.V_FIREBALL) return Object.assign(out, { result: 'fireball', vL: vMax, thetaDeg: 0, recoil: recoilOf(ctxT, obj, 0, vMax, true, tab, D), fireball: fireballAt(obj, vMax, Dfl, ctxC, tab.E0) });
        if (!(vMax >= need * (1 - 1e-9))) return Object.assign(out, { result: 'falls-back', vL: vMax, vMax, escapeNeeded: need });
        vL = style === 'easy' ? need : vMax;
        const run = wellRun(w, obj, vL);
        if (!run.reached) return Object.assign(out, { result: 'falls-back', vL, vMax, escapeNeeded: need });
        vE = vL;
        out.letsGo = vL === 0;
        out.aim = { thetaDeg: 0, vE, vL, vMax };
        out.time = run.time;
        out.vArrive = run.vArrive;
        out.angleDeg = 0;
        out.drag = { E: run.Edrag, gap: true, share: run.Edrag / Math.max(1e-300, run.Edrag + 0.5 * obj.m * run.vArrive * run.vArrive) };
        out.qDynMax = run.qDynMax;
        out.heat = heatVerdict(obj, run.heatLoad, stagnationT(Math.min(run.vmax, CATCH.V_FIREBALL)), run.vmax, run.radLoad);
      } else {
        if (cantMove) return Object.assign(out, { result: 'cant-move' });
        // with no air his best throw would get there: then air, not strength, is what stops it
        out.airWall = vTopE * vTopE / K.g >= Dfl;
        if (w.barrier > 0 && !(vTopE > 0)) {
          // his own pull takes all the speed he can give it: it never gets away from him
          const e = aimEasy(obj, Dfl, h0, hStop);
          return Object.assign(out, { result: 'falls-back', vMax: tab.vTop, escapeNeeded: e.reachable && !e.noArc ? Math.sqrt(e.v * e.v + 2 * w.barrier) : Infinity });
        }
        if (style === 'easy') {
          const e = aimEasy(obj, Dfl, h0, hStop);
          if (!e.reachable) return Object.assign(out, { result: 'unreachable', farthestAny: farthestCached('any', obj, h0, hStop, () => CATCH.V_FIREBALL * 0.999) });
          // every arc fast enough to get there goes into orbit or leaves the Earth
          if (e.noArc) return Object.assign(out, { result: 'no-arc', thetaDeg: e.thetaDeg, vL: Math.sqrt(e.v * e.v + 2 * w.barrier) });
          th = e.thetaDeg; vE = e.v; vL = Math.sqrt(vE * vE + 2 * w.barrier); vMax = tab.vOf(th);
          if (vL > vMax * (1 + 1e-6)) {
            // too weak for the gentlest arc; a steeper or flatter full-strength throw may still get there
            const far = farthestCached(tab.key + '|' + w.barrier, obj, h0, hStop, vOfE);
            if (!(far.range >= Dfl)) return Object.assign(out, { result: 'too-weak', farthest: far, needFactor: vMax > 0 ? vL / vMax : null, easyNeed: { thetaDeg: th, vL, vE }, heat: (() => { const f0 = flight(obj, vE, th, h0, hStop); return heatVerdict(obj, f0.heatLoad, f0.maxStagT, f0.maxMach * K.a0, f0.radLoad); })() });
            const hd = aimHard(obj, Dfl, h0, hStop, vOfE);
            if (!hd.ok) return Object.assign(out, { result: 'too-weak', farthest: far });
            out.fullStrength = true;
            style = 'hard';
            th = hd.thetaDeg; vE = hd.v; vL = tab.vOf(th); vMax = vL;
          }
        } else {
          const hd = aimHard(obj, Dfl, h0, hStop, vOfE);
          if (hd.fireball) {
            // the speed and energy of the throw that is aimed at him (exact at that angle when it is relativistic)
            const r = tab.at(hd.thetaDeg), rel = r.canMove && r.v >= CATCH.V_FIREBALL;
            const v = rel ? r.v : hd.v;
            return Object.assign(out, { result: 'fireball', vL: v, thetaDeg: hd.thetaDeg, recoil: recoilOf(ctxT, obj, hd.thetaDeg, v, true, tab, D), fireball: fireballAt(obj, v, Dfl, ctxC, rel ? r.Eobj : null) });
          }
          if (hd.overshoots) return Object.assign(out, { result: 'overshoots', escaped: hd.escaped, orbit: hd.orbit, relativistic: !!hd.relativistic, thetaDeg: hd.thetaDeg, vL: hd.relativistic ? hd.v : tab.vOf(hd.thetaDeg), farthest: farthestCached(tab.key + '|' + w.barrier, obj, h0, hStop, vOfE) });
          if (!hd.ok) {
            const far = farthestCached(tab.key + '|' + w.barrier, obj, h0, hStop, vOfE);
            // air, not strength, is the wall when no speed below 1% of light gets it there
            const farAny = farthestCached('any', obj, h0, hStop, () => CATCH.V_FIREBALL * 0.999);
            if (!(farAny.range >= Dfl)) return Object.assign(out, { result: 'unreachable', farthestAny: farAny, farthest: far });
            return Object.assign(out, { result: 'too-weak', farthest: far, vMax: tab.vOf(45) });
          }
          th = hd.thetaDeg; vE = hd.v; vL = tab.vOf(th); vMax = vL;
        }
        // safety net: a thrown arc that never comes back down can't be caught
        if (style === 'easy' && overshoot(flight(obj, vE, th, h0, hStop))) return Object.assign(out, { result: 'no-arc', thetaDeg: th, vL });
        const fl = style === 'easy' ? flyTo({ v0: vE, thetaDeg: th, h0, hStop, m: obj.m, A: obj.area, Cd: obj.Cd, CdSup: obj.CdSup, Rn: noseRadius(obj), record: true, Dend: Dfl })
          : flyTo({ v0: vE, thetaDeg: th, h0, hStop: 0, xStop: Dfl, m: obj.m, A: obj.area, Cd: obj.Cd, CdSup: obj.CdSup, Rn: noseRadius(obj), record: true, Dend: Dfl });
        if (style !== 'easy') { fl.vImpact = fl.inSpaceAtX ? fl.vImpact : fl.vAtX; fl.impactAngleDeg = Math.max(0, fl.angleAtXDeg); }
        out.flight = fl;
        out.aim = { thetaDeg: th, vE, vL, vMax };
        out.time = fl.time;
        out.vArrive = Math.sqrt(Math.max(0, fl.vImpact * fl.vImpact + 2 * (w.barrier + w.gain)));
        out.angleDeg = fl.impactAngleDeg;
        out.drag = { E: fl.dragE, nearT: fl.dragNear0, nearC: fl.dragNear1, near: Math.min(NEAR, 0.5 * Dfl), share: fl.dragE / Math.max(1e-300, 0.5 * obj.m * vE * vE) };
        out.qDynMax = fl.qDynMax;
        out.heat = heatVerdict(obj, fl.heatLoad, fl.maxStagT, fl.maxMach * K.a0, fl.radLoad);
      }
      out.qDynMax = Math.max(out.qDynMax, rhoAt(h0) * vL * vL);
      out.tPush = vL > 0 ? 2 * strokeOf(bT, obj) / vL : 0;     // a steady push from rest; about, for real muscle
      // his steady push on it over the throw stroke, spread over its average cross-section
      out.launchStroke = strokeOf(bT, obj);
      out.launchPush = vL > 0 ? obj.m * vL * vL / (2 * out.launchStroke) : 0;
      out.launchRatio = obj.crush ? out.launchPush / (obj.area * obj.crush) : 0;
      out.recoil = recoilOf(ctxT, obj, th, vL, style === 'hard', tab, D);
      out.catch = catchIt(ctxC, obj, out.vArrive, out.angleDeg, w);
      const k = out.catch;
      const breakable = !obj.indestructible;
      // survival gate: what reaches him has to be the object, whole, before anyone can catch it
      // comic switches: gentle hold spreads the thrower's push and the catcher's stop through the whole object (no
      // crushing by hands); cool flight absorbs the heat of drag. Neither touches the air's push on its front.
      out.gentleT = !!ctxT.gentleHold; out.gentleC = !!ctxC.gentleHold; out.cool = !!ctxT.coolFlight;
      if (breakable && obj.crush && out.launchRatio > 1 && !out.gentleT) out.result = 'crushed-launch';    // no plate spreads his push enough
      else if (breakable && obj.crush && out.qDynMax > obj.crush) out.result = 'breaks-up';       // Collins et al. (2005): rho v^2 > strength
      else if (breakable && out.heat && out.heat.kind === 'destroyed' && !out.cool) out.result = 'burns-up';
      else if (out.size > 2 * hStop) out.result = 'too-big';
      else if (!k.clean) out.result = k.canHold ? 'slams' : 'cant-hold-it';
      else if (breakable && obj.crush && k.wholeFront > 1 && !out.gentleC) out.result = 'wreckage';
      else out.result = 'caught';
      out.breakAtLaunch = !!(breakable && obj.crush && rhoAt(h0) * vL * vL > obj.crush);
      out.bursts = out.result === 'caught' && obj.id === 'baseball' && k.baseballRatio > 1 && !out.gentleC;   // the first hit on his palms bursts it
      // the bow shock it carries hits him with it: stagnation pressure ~ rho v^2
      out.shockPa = out.vArrive > K.a0 ? rhoAt(hStop) * out.vArrive * out.vArrive : 0;
      // if he misses: on to the ground beside him
      if (!w.wellDominated) {
        const fm = flight(obj, vE, th, h0, 0);
        const Eimp = keFromV(fm.vImpact, obj.m);
        const L = obj.L || Math.cbrt(6 * obj.m / (Math.PI * (obj.rho || 1000)));
        const cr = fm.vImpact >= 2000 ? craterDiameter({ L, v: fm.vImpact, rhoI: obj.rho || 1000, rhoT: ctxC.surface.rho || 2000, angleDeg: fm.impactAngleDeg, E: Eimp }) : { D: 0 };
        out.miss = { vImpact: fm.vImpact, E: Eimp, crater: cr.D, craterExtrapolated: !!cr.extrapolated, quake: seismicMagnitude(Eimp), past: fm.range + w.x0 - D };
      }
      return out;
    }

    // A body shoved at u coasts to a stop against sliding friction R and air drag k u^2: M u du/dx = -R - k u^2.
    function coastDist(M, u, R, k) {
      if (!isFinite(R) || !(u > 0)) return 0;
      return k > 0 ? M / (2 * k) * Math.log1p(k * u * u / R) : M * u * u / (2 * R);
    }
    // The thrower's recoil, as in Throw: his footing takes what it can and past that he is shoved back.
    // Full strength: the Throw tab's own throw at this angle. A gentle lob: the steady push that gives
    // exactly this launch speed (same push model, constant force).
    function recoilOf(ctxT, obj, th, vL, full, tab, D) {
      const body = ctxT.body;
      let v = 0;
      if (vL > 0 && ctxT.anchor !== 'bolted') {
        if (full) { const r = tab.at(th); v = r.canMove ? r.recoilV : 0; }
        else {
          const { style, hands } = throwStyle(obj);
          const d = strokeOf(body, obj), armMass = hands * (style === 'whip' ? body.whipEff : body.handEff);
          const mB = obj.m + armMass, mA = body.m - armMass, t = th * Math.PI / 180, RB = mB * K.g * Math.sin(t);
          const anc = anchorCapacity({ body, surface: ctxT.surface, theta: t, anchor: ctxT.anchor, groundHolds: ctxT.groundHolds, mA, mB });
          const F0 = RB + mB * vL * vL / (2 * d);
          if (F0 > anc.R) {
            const run = (F) => pushApart({ F, d, mA, mB, RA: anc.Rslide, RB, mode: 'comic' });
            let lo = F0 * (1 - 1e-12), hi = 2 * F0;
            for (let i = 0; i < 200 && !(run(hi).vB >= vL); i++) { lo = hi; hi *= 2; }
            for (let i = 0; i < 100 && hi - lo > 1e-9 * hi; i++) { const mid = 0.5 * (lo + hi); if (run(mid).vB >= vL) hi = mid; else lo = mid; }
            const p = run(hi);
            v = p.stalled ? 0 : momentumToV(Math.max(0, p.pA - p.pB * armMass / Math.max(mB, 1e-300)), body.m);
          }
        }
      }
      const Rs = anchorCapacity({ body, surface: ctxT.surface, theta: 0, anchor: ctxT.anchor, groundHolds: ctxT.groundHolds }).R;
      const slide = coastDist(body.m, v * Math.cos(th * Math.PI / 180), Rs, 0.5 * K.rho0 * body.Cd * body.frontArea);
      // shoved back farther than the gap (or past 1% of light speed): no longer in range for the throw back
      const fireball = v >= CATCH.V_FIREBALL;
      return { v, slide: fireball ? Infinity : slide, fireball, outOfRange: fireball || slide > D };
    }

    // ---------------------------------------------------------------- the partner as the ball: straight up and back
    // anchorP: the partner's footing. Bolted to the planet, he can't be lifted at all (as in Wrestle > Lift).
    // hTarget: how high he goes above the point where he is let go (the release height), not above the ground.
    function tossPartner(ctxT, bP, name, style, hTarget, anchorP) {
      const obj = partnerAsObject(bP, name);
      if (anchorP === 'bolted') return { obj, result: 'bolted' };
      const h0 = ctxT.body.releaseHeight;
      const t = throwObject(ctxT, obj, 90);
      const out = { obj, holdNeeded: t.needed };
      if (!t.canHold) return Object.assign(out, { result: 'cant-hold' });
      const vMax = t.canMove ? t.v : 0;
      // he can hold him up but can't push any harder than that: no toss
      if (!(vMax > 0)) return Object.assign(out, { result: 'cant-move' });
      let v;
      if (style === 'easy') {
        const apex = (vv) => { const f = flight(obj, vv, 90, h0, h0); return overshoot(f) ? Infinity : f.apex - h0; };
        let lo = 1e-3, hi = CATCH.V_FIREBALL * 0.999;
        if (apex(hi) < hTarget) return Object.assign(out, { result: 'unreachable' });
        for (let i = 0; i < 80 && hi / lo > 1 + 1e-5; i++) { const mid = Math.sqrt(lo * hi); if (apex(mid) >= hTarget) hi = mid; else lo = mid; }
        v = hi;
        if (v > vMax * (1 + 1e-6)) return Object.assign(out, { result: 'too-weak', v, vMax });
      } else v = vMax;
      if (v >= CATCH.V_FIREBALL) return Object.assign(out, { result: 'fireball', v });
      const fl = flight(obj, v, 90, h0, h0);
      out.v = v; out.flight = fl;
      out.rise = Math.max(0, fl.apex - h0);           // height above the release point
      // a flight the integrator gave up on is not an orbit or an escape: say it isn't modelled
      if (fl.timedOut && !fl.escaped && !fl.orbit) return Object.assign(out, { result: 'not-modelled' });
      if (overshoot(fl)) return Object.assign(out, { result: fl.escaped ? 'escapes' : 'orbit' });
      // he comes straight down: Earth's pull on Ollie and on Rex's hands adds to the stopping force and the foot load
      out.catch = catchIt(ctxT, obj, fl.vImpact, 90, null);
      out.result = out.catch.clean ? 'caught' : 'slams';
      return out;
    }

    function game(ctxR, ctxO, obj, D, style) {
      const a = leg(ctxR, ctxO, obj, D, style);
      const b = leg(ctxO, ctxR, obj, D, style);
      const pull = mutualGravity(ctxR.body, ctxO.body, D);
      const holdR = anchorCapacity({ body: ctxR.body, surface: ctxR.surface, theta: 0, anchor: ctxR.anchor, groundHolds: ctxR.groundHolds }).R;
      const holdO = anchorCapacity({ body: ctxO.body, surface: ctxO.surface, theta: 0, anchor: ctxO.anchor, groundHolds: ctxO.groundHolds }).R;
      const together = pull.F > Math.min(holdR, holdO) ? fallTogether(ctxR.body, ctxO.body, D, pull.dContact) : null;
      const round = roundTrip(a, b);
      return { a, b, round, pull, holdR, holdO, together };
    }
    // both throws (push, flight), plus each catch's arm stroke only when it is forced (he slides or needs most
    // of his strength); with strength to spare he brings it in as slowly as he likes, so that part has no set time.
    // None if a throw shoves the thrower out of range.
    function roundTrip(a, b) {
      const ok = (L) => L && L.result === 'caught' && L.catch && !L.bursts && !(L.recoil && L.recoil.outOfRange);
      const stroke = (L) => (L.catch.forced ? L.catch.tStroke : 0);
      return ok(a) && ok(b) ? a.time + b.time + stroke(a) + stroke(b) + (a.tPush || 0) + (b.tPush || 0) : null;
    }
    return { CATCH, MATERIALS, OBJ_MATERIAL, flyTo, aimEasy, aimHard, farthest, releaseTable, wells, wellRun, wellNeed, catchIt, heatVerdict, fireballAt, leg, tossPartner, game, roundTrip, partnerAsObject, pushStartRadius, meetRadius, chestRadius, coastDist };
  })();

  // ---------------------------------------------------------------------------
  // Presence: ground vibration from what he does to the ground (Walk tab, and the restraint checks).
  // An elastic-ground model (Lamb's problem, Poisson ratio 1/4): a vertical force on the surface sends out a
  // near field that falls as 1/r and a Rayleigh wave that falls as 1/sqrt(r), damped with distance. A source is a
  // force history on one patch of ground: { kind: 'hann', F, T } (a pulse of peak F lasting T: a footfall's impact,
  // a stamp, a landing) or { kind: 'ramp', F, tau } (a load that rises to F over tau and stays: the weight coming
  // onto a foot), with the ground's density, shear-wave speed and damping. A list of sources gives the largest.
  //   Hann pulse: near = 0.375 F / (rho cs^2 T r), far = 0.620 F / (rho cs^2.5 T^1.5 sqrt r)
  //   ramp:       near = 0.1875 F / (rho cs^2 tau r), far = 0.181 F / (rho cs^2.5 tau^1.5 sqrt r)
  //   PPV (vertical) = max(near, far) x D(zeta), zeta = xi r / (0.919 cs T)
  // Checked against a 130 kg drop test at Pisa (within about 2x over 2.5-60 m, with the contact time fitted) and
  // elephant footfalls (within about 2-4x, guessed inputs); one recorded person walking past at 53 m on sandy ground (Steinmann 2025) within about 3x (firm to loose sand). Uncertain by about 3-5x. Past 60 m, the furthest it was checked, its
  // damping makes a short pulse fade as r^-2 to r^-3, faster than any measured impact (r^-1.0 to r^-1.6: Pisa r^-1.28,
  // dropped weights r^-1.1 to r^-1.35), so there it falls no faster than r^-1.3 from its 60 m value (an estimate).
  // Sources and status: research/final-presence.json (vib_*).
  // ---------------------------------------------------------------------------
  const VIB = {
    // density (kg/m^3), shear-wave speed (m/s) and damping ratio of each surface's ground: our near-surface picks
    // (estimates; mostly inside the code class ranges, but gravel's 300 m/s is below the 400-700 m/s given for dense
    // sand and gravel at depth). Paving and slabs are taken as their subgrade. Lake ice and a steel deck bend as
    // plates rather than carry ground waves: not modelled.
    GROUND: {
      sand: { rho: 1600, cs: 120, xi: 0.04 }, gravel: { rho: 2000, cs: 300, xi: 0.03 },
      softclay: { rho: 1700, cs: 120, xi: 0.05 }, stiffclay: { rho: 1900, cs: 250, xi: 0.03 },
      asphalt: { rho: 2000, cs: 250, xi: 0.03 }, concrete: { rho: 2000, cs: 250, xi: 0.03 },
      granite: { rho: 2700, cs: 3000, xi: 0.01 },
      // firmer sand, as in the model's elephant check (shear waves at 280 m/s, near the 248-264 m/s measured where
      // Asian elephants walked; O'Connell-Rodwell): the elephant comparison's other end, since the measured site's
      // stiffness is unknown (estimate)
      firmsand: { rho: 1800, cs: 280, xi: 0.03 },
    },
    STRAIN: 1e-4,       // the ground stays elastic while its strain is below about 1e-4 (estimate)
    RMIN: 1,            // closest distance the model covers, m
    RFIT: 60, NFAR: 1.3, // past 60 m: no faster than r^-1.3
    // thresholds, peak particle velocity at the ground, m/s (research/final-presence.json, thr_* and ripple_*):
    //   feel: just perceptible indoors (BS 5228-2 Table B.1, 0.3 mm/s; 0.14-1)
    //   feelOnce: one isolated event (a stomp) 'barely perceptible' (Caltrans 2020 Table 20, transient: 1.0 mm/s); the average
    //     person needs more than 3 mm/s: 3.3 mm/s for a half-second jolt, more for a shorter one (USBM RI 8507 Table 15)
    //   shimmer: a glass of water visibly ripples (estimate: about 0.2 mm/s side to side, 0.02-1); compared with the
    //     horizontal shaking, not the vertical (see HV)
    //   rings: concentric rings in the glass, the film look (estimate from a ripple model: about 0.5-1 mm/s vertical)
    //   rattle: windows and ornaments rattle (our estimate, no standard sets it: about 1 mm/s, 0.3-3)
    //   plasterWalk: cosmetic damage from repeated steps (Caltrans older homes, continuous: 7.6 mm/s)
    //   plaster: cosmetic damage from one event, a stomp or a landing (US Bureau of Mines RI 8507, plaster: 12.7 mm/s)
    //   footing: people lose their footing (estimate from earthquakes: about 300 mm/s, 80-600)
    // PLASTER_B1: one event's safe level for plaster houses against frequency (USBM RI 8507 Figure B-1,
    // thr_usbm_ri8507_figure_b1_curve): 0.030 in displacement at the lowest frequencies, 0.50 in/s from about 2.7 Hz,
    // 0.008 in displacement from about 10 Hz, 2.0 in/s from about 40 Hz
    PLASTER_B1: { dLow: 0.030 * 0.0254, v: 0.50 * 0.0254, dMid: 0.008 * 0.0254, vHigh: 2.0 * 0.0254 },
    TH: { feel: 0.3e-3, feelOnce: 0.04 * 0.0254, shimmer: 0.2e-3, rings: 0.7e-3, rattle: 1e-3, plasterWalk: 7.6e-3, plaster: 12.7e-3, footing: 0.3 },
    // horizontal over vertical shaking at the surface of uniform ground (Poisson's ratio 1/4): 1/3 in the near field,
    // 0.68 for Rayleigh waves (vib_rayleigh_horizontal_and_resultant, derived). Only the water glass's shimmer uses it.
    HV: { near: 1 / 3, far: 0.68 },
    HORIZ: { shimmer: true },
    // a wild African elephant walking 20 m from a seismometer on sandy ground (Steinmann et al. 2025; our reading
    // of their figure): about 0.005 mm/s, falling about as 1/D from 5 to 100 m; real ones vary 0.15x to 8x
    ELEPHANT: { v: 0.005e-3, d: 20, lo: 0.15, hi: 8, dMin: 5, dMax: 100 },
  };
  const groundOf = (surface) => (surface ? VIB.GROUND[surface.id] || null : null);
  function vibSource(surface, kind, F, t) {
    const g = groundOf(surface);
    if (!g || !(F > 0)) return null;
    return kind === 'ramp' ? { kind, F, tau: t, ground: g } : { kind: 'hann', F, T: t, ground: g };
  }
  // a pulse that carries impulse J over T: a Hann pulse of peak 2 J / T
  const impulseSource = (surface, J, T) => vibSource(surface, 'hann', 2 * J / T, T);
  function ppvAt(src, d, horiz) {
    if (!src) return 0;
    if (Array.isArray(src)) return src.reduce((m, x) => Math.max(m, ppvAt(x, d, horiz)), 0);
    if (!(src.F > 0)) return 0;
    if (!isFinite(src.F)) return Infinity;
    if (d > VIB.RFIT) return Math.max(ppvElastic(src, d, horiz), ppvElastic(src, VIB.RFIT, horiz) * Math.pow(VIB.RFIT / d, VIB.NFAR));
    return ppvElastic(src, d, horiz);
  }
  // horiz: the side-to-side shaking instead of the up-and-down
  function ppvElastic(src, d, horiz) {
    const { rho, cs, xi } = src.ground, r = Math.max(d, VIB.RMIN);
    const ramp = src.kind === 'ramp', T = ramp ? src.tau : src.T;
    const near = (horiz ? VIB.HV.near : 1) * (ramp ? 0.1875 : 0.375) * src.F / (rho * cs * cs * T * r);
    const far = (horiz ? VIB.HV.far : 1) * (ramp ? 0.181 : 0.620) * src.F / (rho * Math.pow(cs, 2.5) * Math.pow(T, 1.5) * Math.sqrt(r));
    const z = xi * r / (0.919 * cs * T);
    const D = ramp ? Math.pow(1 + Math.pow(z / 0.195, 2.05), -1.5 / 2.05) : Math.pow(1 + Math.pow(z / 0.224, 1.4), -2.5 / 1.4);
    return Math.max(near, far) * D;
  }
  // distance at which the vibration falls to v (m/s); 0 if it is below v even at the closest distance covered
  function ppvReach(src, v, horiz) {
    if (!(ppvAt(src, VIB.RMIN, horiz) >= v)) return 0;
    if (ppvAt(src, 1e7, horiz) >= v) return Infinity;
    let lo = VIB.RMIN, hi = 1e7;
    for (let i = 0; i < 100 && hi / lo > 1 + 1e-6; i++) { const mid = Math.sqrt(lo * hi); if (ppvAt(src, mid, horiz) >= v) lo = mid; else hi = mid; }
    return lo;
  }
  // past the ground's elastic range at distance d? The wave strain is about PPV / cs; close to the foot the static
  // strain (1 - nu) F / (2 pi rho cs^2 r^2) is larger. Past about 1e-4 the ground yields: which way that moves the
  // shaking is not known (yielding soaks up energy, softening lets it move more).
  const ppvNonlinear = (src, d) => { const list = Array.isArray(src) ? src : [src]; const r = Math.max(d, VIB.RMIN); return list.some((x) => x && Math.max(ppvAt(x, d) / x.ground.cs, 0.75 * x.F / (2 * Math.PI * x.ground.rho * x.ground.cs * x.ground.cs * r * r)) > VIB.STRAIN); };
  const elephantPPV = (d) => VIB.ELEPHANT.v * VIB.ELEPHANT.d / d;
  // One event's plaster check: the RI 8507 Figure B-1 safe level at the pulse's frequency (12.7 mm/s from about 2.7 to
  // 10 Hz, rising as 0.2 mm of displacement to 50.8 mm/s at 40 Hz and above). It rises smoothly with frequency, so a
  // harder push that shortens the pulse can't switch the hazard off. A pulse of length T is taken at frequency 1/T (a
  // ramp: 1/(2 tau)); that is our estimate. plasterOver: does any part reach its limit at d?
  const pulseHz = (x) => (x.kind === 'ramp' ? 1 / (2 * x.tau) : 1 / x.T);
  const plasterLimitHz = (f) => { const B = VIB.PLASTER_B1, w = 2 * Math.PI * f; return Math.min(B.vHigh, Math.max(Math.min(w * B.dLow, B.v), w * B.dMid)); };
  const plasterLimit = (x) => plasterLimitHz(pulseHz(x));
  const plasterOver = (src, d) => { const list = Array.isArray(src) ? src : [src]; return list.some((x) => x && ppvAt(x, d) >= plasterLimit(x)); };
  const plasterReach = (src) => { const list = Array.isArray(src) ? src : [src]; return Math.max(0, ...list.filter(Boolean).map((x) => ppvReach(x, plasterLimit(x)))); };

  // ---------------------------------------------------------------------------
  // Presence: walking. People's gait scaled to their size by dynamic similarity (equal Froude number
  // Fr = v^2 / (g h) on hip height h): pace, step rate and stance. Each step has two parts:
  //   the weight-bearing load, k x body weight through the stance (1.0-1.5, rising with pace), and
  //   the impact as the foot lands (heel strike): the energy absorbed at touchdown, which drives the ground
  //   shaking. Effort per step runs from soft-footed through an ordinary step to a soldier's drill stamp.
  // Sources and status: research/final-presence.json (step_*).
  // ---------------------------------------------------------------------------
  const WALK = {
    HIP: 0.45,                 // hip height, share of height (our measurement from the turnarounds; estimate)
    PACES: { stroll: 0.1, walk: 0.18, brisk: 0.3, fast: 0.5 },   // Froude numbers: elephant-like, comfortable, brisk, the walk-run switch
    CADENCE: [0.789, 0.211],   // step rate = 0.789 Fr^0.211 sqrt(g / h) (fitted to the CADENCE-adults data)
    DUTY: [0.7, 0.55],         // share of a stride each foot is down: very slow walk, fast walk (Alexander 2004)
    // load per step, x body weight: 1.2 at 1.5 m/s for people (Keller et al. 1996), rising 0.25 per m/s (Nilsson &
    // Thorstensson 1989: 1.0-1.5 over 1-3 m/s); taken at the same Froude number on a 0.9 m human hip
    LOAD: { at: 1.2, vh: 1.5, slope: 0.25, lo: 1.0, hi: 1.5, hRef: 0.9 },
    // heel strike: 2.7 J absorbed vertically per step at 1.3 m/s (Baines et al. 2018: 76.7 kg, hip about 0.9 m),
    // scaled as M g h; effective mass 11% of the body, heel at 0.57 m/s, about 30 ms
    HS: { J: 2.7, m: 76.7, h: 0.9, share: 0.11, v: 0.57, t: 0.03 },
    SOFT: 0.51,                // soft-footed: the impact cut to 0.51 (walking quietly at the same speed cut the impact loading rate 48.7%, Yoon et al. 2025; 69% only when also 23% slower; estimate)
    RAMP: 0.15,                // the weight comes onto the foot over about 0.15 s on a 0.875 m hip (Keller et al.'s 8 body weights per second; estimate)
    // a drill stamp from thigh-horizontal: the leg (16% of the body) meets the ground at 3.7 m/s by gravity, peak
    // force 6.5 x body weight, trained soldiers' average on rigid force plates (Carden et al. 2015; individuals reach
    // 8 or more), 16-36 ms to peak (Rawcliffe et al. 2020)
    STAMP: { share: 0.16, thigh: 0.233, kPeak: 6.5, t: 0.026 },
  };
  // the human-equivalent walking speed at Froude Fr (for the load rule)
  const walkLoad = (Fr) => { const L = WALK.LOAD, vh = Math.sqrt(Fr * K.g * L.hRef); return Math.min(L.hi, Math.max(L.lo, L.at + L.slope * (vh - L.vh))); };
  // effort per step e: 0 soft-footed, 0.5 an ordinary step, 1 a drill stamp. Impact energy and peak force are
  // interpolated on a log scale between the three anchors.
  function walkStep(body, surface, o) {
    const opt = o || {};
    const h = WALK.HIP * body.H, Fr = typeof opt.pace === 'number' ? opt.pace : (WALK.PACES[opt.pace || 'walk'] || WALK.PACES.walk);
    const v = Math.sqrt(Fr * K.g * h);
    const stepRate = WALK.CADENCE[0] * Math.pow(Fr, WALK.CADENCE[1]) * Math.sqrt(K.g / h);
    const duty = WALK.DUTY[0] + (WALK.DUTY[1] - WALK.DUTY[0]) * Math.min(1, Math.max(0, (Fr - 0.05) / (0.4 - 0.05)));
    const stance = duty * 2 / stepRate;
    const W = body.m * K.g;
    const kLoad = walkLoad(Fr);
    const e = opt.effort == null ? 0.5 : Math.min(1, Math.max(0, opt.effort));
    const hs = WALK.HS, sc = Math.sqrt(h / hs.h);
    // The footfall's impact, as a force pulse (what shakes the ground): an ordinary heel strike stops 11% of the body
    // moving down at 0.57 m/s (scaled) in 30 ms (scaled), a pulse of about 0.43 x body weight; soft-footed cuts it to
    // 0.51 of that (people walking quietly at the same speed); a drill stamp peaks at 6.5 x body weight, 26 ms after contact (scaled). Peak and length are
    // interpolated on a log scale between the three. Absorbed energy at touchdown (2.7 J per human step) is shown too.
    const Thv = hs.t * sc, Fhs = 2 * hs.share * body.m * hs.v * sc / Thv;
    const Enorm = hs.J * (body.m / hs.m) * (h / hs.h);
    const st = WALK.STAMP, vSt = Math.sqrt(2 * K.g * st.thigh * body.H);
    const A = [
      { F: WALK.SOFT * Fhs, T: Thv, E: WALK.SOFT * WALK.SOFT * Enorm, v: WALK.SOFT * hs.v * sc },
      { F: Fhs, T: Thv, E: Enorm, v: hs.v * sc },
      { F: st.kPeak * W, T: 2 * st.t * sc, E: 0.5 * st.share * body.m * vSt * vSt, v: vSt },
    ];
    const lerp = (a, b, f) => Math.exp(Math.log(a) + (Math.log(b) - Math.log(a)) * f);
    const [a, b, f] = e <= 0.5 ? [A[0], A[1], e / 0.5] : [A[1], A[2], (e - 0.5) / 0.5];
    const Fpulse = lerp(a.F, b.F, f), Tpulse = lerp(a.T, b.T, f), Eimp = lerp(a.E, b.E, f), vImp = lerp(a.v, b.v, f);
    const tRamp = WALK.RAMP * Math.sqrt(h / 0.875);
    const kPeak = Math.max(kLoad, Fpulse / W + (e > 0.5 ? 0 : kLoad * 0));
    const Fpeak = Math.max(kLoad * W, Fpulse);
    const q = qultFor(surface, body.footB);
    // the ground carries the weight-bearing load for the whole stance; the impact peak lasts a few hundredths of a second
    const Fhold = Math.min(kLoad, kPeak) * W;
    const pressure = Fhold / body.footArea, peakPressure = Fpeak / body.footArea;
    const ratio = opt.groundHolds ? 0 : pressure / q, peakRatio = opt.groundHolds ? 0 : peakPressure / q;
    const src = [vibSource(surface, 'hann', Fpulse, Tpulse), vibSource(surface, 'ramp', kLoad * W, tRamp)].filter(Boolean);
    return { h, Fr, v, stepRate, stride: 2 * v / stepRate, stance, kLoad, W, effort: e, Eimp, Fpulse, Tpulse, tRamp, heelV: hs.v * sc, heelT: Thv, kPeak, Fpeak, Fhold, pressure, peakPressure, q, ratio, peakRatio,
      // the impact as a mass m_eff = (pulse impulse) / (foot speed) driven in at the foot speed, for the footprint
      footprint: footprint(body, surface, pressure, opt.groundHolds, { p: peakPressure, J: 0.5 * Fpulse * Tpulse, v: vImp }), src: src.length ? src : null, modelled: !!groundOf(surface) };
  }
  // Footprint depth under a step. Sand and gravel: scaled from the one measured large-animal print. A weighed 2,530 kg
  // African elephant cow left 20-26 mm forefoot prints in loose-to-medium sand (Schanz et al. 2013), and the authors'
  // calibrated model of that sand gives 8 mm at 185 kPa and 18 mm at 350 kPa: depth grows as pressure^1.27, and with
  // foot width. Our loose sand is taken as that sand; firmer gravel takes a print shallower in proportion to its
  // bearing strength. Clay: the foot sinks until the bearing, which grows with depth (N_c x1.15, 1.24, 1.36, 1.43 and
  // 1.46 at 0.5, 1, 2, 3 and 4 foot-widths: EM 1110-1-1905 Table 4-7; never past 9), carries it; past half his hip
  // height he is mired. A landing pulse past the ground's bearing also drives the foot in (as in a stomp: Poncelet
  // penetration), in clay; on paving, slabs, ice, steel and rock it breaks the surface. All estimates.
  const PRINT = { d: 0.018, p: 350e3, lo: 99e3, n: 1.27, B: 0.274 };
  const NC_DEPTH = [[0, 1], [0.5, 1.15], [1, 1.24], [2, 1.36], [3, 1.43], [4, 1.46]];
  const ncDepth = (x) => { const T = NC_DEPTH; if (x >= T[T.length - 1][0]) return T[T.length - 1][1]; for (let i = 1; i < T.length; i++) if (x <= T[i][0]) return T[i - 1][1] + (T[i][1] - T[i - 1][1]) * (x - T[i - 1][0]) / (T[i][0] - T[i - 1][0]); return 1; };
  // Depth at which clay carries pressure p under a footing of width B (Infinity past hi).
  function clayDepth(surface, p, B, hi) {
    const q = qultFor(surface, B), su = surface.shear, Nc0 = q / su;
    const Nc = (D) => Math.min(9, Nc0 * ncDepth(D / B));
    const gam = (surface.rho || 1800) * K.g;
    if (p <= q) return 0;
    if (Nc(hi) * su + gam * hi < p) return Infinity;
    let lo = 0;
    for (let i = 0; i < 60; i++) { const mid = 0.5 * (lo + hi); if (Nc(mid) * su + gam * mid >= p) hi = mid; else lo = mid; }
    return hi;
  }
  // Sand and gravel: the print the elephant rule gives at pressure p under a footing of width B.
  const SAND_Q = 37e3 / 0.316;   // the loose sand's bearing per metre of foot width (the elephant print's sand)
  function sandPrint(surface, p, B) {
    const q = qultFor(surface, B), qSand = SAND_Q * B;
    return { depth: PRINT.d * Math.pow(p / PRINT.p, PRINT.n) * (B / PRINT.B) * Math.min(1, qSand / q), extrapolated: p > PRINT.p * (1 + 1e-9) || p < PRINT.lo * (1 - 1e-9), qSand, q };
  }
  // Standing still, in soil (null on other surfaces). Sand and gravel: the elephant's sand carried its forefoot with
  // only a 20-26 mm print, at 350 kPa by Schanz's calibrated model (181 kPa by force-plate peaks), so we take failure
  // to start at qFail = 350 kPa x (B / 0.274 m), and more for gravel in proportion to its bearing (our estimate; a
  // lower bound only if the 350 kPa is right). Below qFail the foot leaves the elephant rule's print; past it the foot plunges until the bearing,
  // growing with depth as gamma D N_q (USACE EM 1110-1-1905), carries it, and never less than the print. Clay: the Walk
  // tab's rule (bearing growing with depth, N_c up to 9; nothing until the bearing is passed). All estimates.
  function standDepth(surface, p, B, H) {
    if (surface.granular) {
      const pr = sandPrint(surface, p, B), qFail = PRINT.p * (B / PRINT.B) * Math.max(1, pr.q / pr.qSand);
      const Nq = W8.NQ[surface.id] || W8.NQ.sand;
      const plunge = Math.max(0, (p - qFail) / ((surface.rho || 1800) * K.g * Nq));
      return { depth: Math.max(pr.depth, plunge), print: pr.depth, plunge, qFail, extrapolated: plunge === 0 && pr.extrapolated };
    }
    if (surface.id === 'softclay' || surface.id === 'stiffclay') {
      const q = qultFor(surface, B);
      return { depth: clayDepth(surface, p, B, 10 * H), print: 0, plunge: 0, qFail: q, extrapolated: false };
    }
    return null;
  }
  function footprint(body, surface, p, groundHolds, impact) {
    if (groundHolds) return { depth: 0, kind: 'comic' };
    const q = qultFor(surface, body.footB), B = body.footB;
    const pPeak = impact ? impact.p : p;
    if (surface.granular) {
      // Schanz's anchor stress is the elephant's dynamic (peak) stress, so the print follows the step's peak
      // the rule was fitted from 99 to 350 kPa (Schanz's model): past that it is extrapolated
      const pp = Math.max(p, pPeak), pr = sandPrint(surface, pp, B);
      return { depth: pr.depth, kind: 'print', extrapolated: pp > PRINT.p * (1 + 1e-9) };
    }
    if (surface.id === 'softclay' || surface.id === 'stiffclay') {
      // the landing pulse, if it is past the clay's bearing, drives the foot in like a small stomp
      const dImp = impact && pPeak > q && impact.v > 0 ? penetrationDepth(impact.J / impact.v, body.footArea, impact.v, q, surface.rho || 1800) : 0;
      const mired = WALK.HIP * body.H / 2;   // a foot sunk past half the hip height: he is stuck
      if (p <= q) return dImp > mired ? { depth: Infinity, kind: 'mired' } : { depth: dImp, kind: dImp > 0 ? 'sinks' : 'holds' };
      const d = clayDepth(surface, p, B, 10 * body.H);
      if (!isFinite(d)) return { depth: Infinity, kind: 'mired' };
      const depth = Math.max(d, dImp);
      return depth > mired ? { depth: Infinity, kind: 'mired' } : { depth, kind: 'sinks' };
    }
    return { depth: 0, kind: pPeak > q ? 'breaks' : 'holds' };
  }
  // A walker's presence: the step, the ground shaking at a distance, and how far each threshold reaches.
  function presence(body, surface, o) {
    const st = walkStep(body, surface, o);
    const reach = {};
    for (const k of Object.keys(VIB.TH)) reach[k] = ppvReach(st.src, VIB.TH[k], !!VIB.HORIZ[k]);
    return { step: st, ppv: (d) => ppvAt(st.src, d), ppvH: (d) => ppvAt(st.src, d, true), nonlinear: (d) => ppvNonlinear(st.src, d), reach };
  }
  // The Walk tab's thresholds for one step: losing one's footing is capped at 1 g up and down at the footfall's own
  // frequency (peak velocity g T / (2 pi) for a pulse of length T), below the 300 mm/s earthquake value.
  const walkThresholds = (step) => Object.assign({}, VIB.TH, { footing: Math.min(VIB.TH.footing, K.g * step.Tpulse / (2 * Math.PI)) });
  // The least step effort (0..1) at which the vibration at distance d reaches threshold v; Infinity if not even a stamp.
  // horiz: compare the side-to-side shaking (the water glass's shimmer).
  function walkEffortFor(body, surface, o, v, d, horiz) {
    const f = (e) => ppvAt(walkStep(body, surface, Object.assign({}, o, { effort: e })).src, d, horiz) >= v;
    if (f(0)) return 0;
    if (!f(1)) return Infinity;
    let lo = 0, hi = 1;
    for (let i = 0; i < 40; i++) { const mid = 0.5 * (lo + hi); if (f(mid)) hi = mid; else lo = mid; }
    return hi;
  }

  // ---------------------------------------------------------------------------
  // Restraint: the least disruptive way to do each move, the most effort that stays harmless (the courtesy
  // ceiling), and the not-so-heroic presets, each set by a hazard. Effort is the strength used for the drive
  // (ctx.use). Every search assumes the hazard or goal, once reached, stays reached at higher effort.
  // ---------------------------------------------------------------------------
  const RESTRAINT = (() => {
    const R = {
      NEAR: 5,       // people and buildings this close to him (m): estimate, the page lets the visitor change it
      STREET: 15,    // windows across a street (m): estimate
      BLOCK: 100,    // a city block (m): estimate
      DP_HARM: 100,       // Pa, the most air blast that stays harmless at a house: 134 dB, USBM RI 8485's safe maximum (comic_airblast_safe_max)
      DP_RATTLE: 36,      // Pa, windows start to rattle: complaints from about 120 dB on a 6 Hz meter, roughly 36 Pa unfiltered (airblast_rattle_onset_unfiltered, derived)
      DP_WINDOWS: 6900,   // Pa, the top of the 3.4-6.9 kPa band where windows usually shatter (data: blast_window_breakage)
      DP_HOUSES: 26800,   // Pa, houses collapse (data: blast_residential_collapse)
      TOL: 0.005,    // searches stop within 0.5%
      // J into soil past which a jump's sinking feet leave craters, not deep footprints: our estimate (soil_crater_cutoff)
      CRATER_E: 1e6,
    };
    const range = (f) => (f.relativistic || f.escaped || f.orbit || f.leavesHill || f.timedOut ? Infinity : f.landed ? f.range : 0);
    const momentumOf = (v, m) => (v >= K.c ? Infinity : vToMomentum(v, m));
    // a foot's contact pulse: a drill stamp peaks 26 ms after contact, so about 52 ms, scaled with size
    const footPulse = (body) => 2 * WALK.STAMP.t * Math.sqrt(WALK.HIP * body.H / WALK.HS.h);
    // the effective mass of a drill stamp: its impulse (half the 6.5 W peak times the pulse) over the leg's speed
    const stampSpeed = (body) => Math.sqrt(2 * K.g * WALK.STAMP.thigh * body.H);
    const stampMass = (body) => 0.5 * WALK.STAMP.kPeak * body.m * K.g * footPulse(body) / stampSpeed(body);
    // Energy counts as an air blast only when it is let go faster than sound can carry it off: something moving
    // past Mach 1 (a shock wave), or a fireball. Slower, it is a thump or a crash, not a blast wave.
    const shock = (v, E) => (v >= K.a0 ? E : 0);
    function throwBlast(r, o) {
      if (!r.canMove || !r.flight) return { land: 0, path: 0 };
      if (r.flight.relativistic) return { land: r.Eobj, path: 0 };
      const land = r.flight.landed ? shock(r.flight.vImpact, r.Eimpact) : 0;
      const drag = o && o.coolFlight ? 0 : shock(r.v, r.dragLoss != null ? r.dragLoss : r.Eobj);
      return { land, path: drag + shock(r.recoilV || 0, r.recoilE || 0) };
    }
    function recoilSlide(r, o) {
      if (!r.canMove || !(r.recoilV > 0) || o.anchor === 'bolted') return 0;
      const Rs = anchorCapacity({ body: o.body, surface: o.surface, theta: 0, anchor: o.anchor, groundHolds: o.groundHolds }).R;
      return (r.push && r.push.xA || 0) + CATCHGAME.coastDist(o.body.m, r.recoilV * Math.cos((o.angle || 0) * Math.PI / 180), Rs, 0.5 * K.rho0 * o.body.Cd * o.body.frontArea);
    }
    const SOIL = new Set(['sand', 'gravel', 'softclay', 'stiffclay']);
    // Each move: run, what it is for (goal), the fastest thing it sets moving, and what it does to the ground and air.
    const MOVES = {
      throw: {
        run: (c, o) => throwObject(c, o.obj, o.angle),
        goal: (r, o) => r.canMove && !r.fallsBack && (o.angle >= 90 ? r.flight.relativistic || r.flight.escaped || r.flight.apex >= o.target : range(r.flight) >= o.target),
        speed: (r) => (r.canMove ? r.v : 0),
        // the boom counts the object and his own recoil
        boomSpeed: (r) => (r.canMove ? Math.max(r.v, r.recoilV || 0) : 0),
        ground: (r, o) => !SOIL.has(o.surface && o.surface.id) && r.canMove && r.sinkRatio > 1,
        crush: (r, o) => !o.gentleHold && r.canMove && r.gripRatio > 1,
        // the landing past Mach 1; and a launch past Mach 1, whose drag loss goes into the air along the first stretch
        // of its path (all its energy if it never comes down; none with Cool flight), plus his own recoil past Mach 1.
        // The larger counts: they happen in different places. blastFrom says which.
        blast: (r, o) => { const b = throwBlast(r, o); return Math.max(b.land, b.path); },
        blastFrom: (r, o) => { const b = throwBlast(r, o); return r.flight && r.flight.relativistic ? 'fire' : b.path > b.land ? 'path' : 'landing'; },
        // his recoil: the lurch during the push, then the coast against his footing and the air (as Catch counts it)
        slide: (r, o) => recoilSlide(r, o),
        // the object stops in about its own size: a pulse carrying its momentum over L / v
        shake: (r, o) => {
          if (!r.canMove || !r.flight || !r.flight.landed || !(r.flight.vImpact > 0)) return null;
          const L = o.obj.L || Math.cbrt(6 * o.obj.m / (Math.PI * (o.obj.rho || 1000))), v = r.flight.vImpact;
          return impulseSource(o.surface, momentumOf(v, o.obj.m), Math.max(1e-3, L / v));
        },
        // a person thrown without the safe-passenger switch: the launch presses them past the ride limits
        // ... and air drag in flight, which Safe passenger can't take away (it lasts the flight: the held 1.5 g limit)
        passenger: (r, o) => !!o.obj.passenger && r.canMove && ((!o.safePassenger && r.launchG > 0 && PASSENGER.felt(Math.max(r.launchG, r.launchGPeak || 0), o.angle) > PASSENGER.noHarm(r.launchT)) || PASSENGER.dragG(o.obj, r.v) > PASSENGER.noHarm(1)),
        where: 'where it lands',
      },
      jump: {
        run: (c) => jump(c),
        goal: (r, o) => r.v > 0 && (r.relativistic || r.flight.escaped || r.flight.apex >= o.target),
        speed: (r) => r.v,
        // the boom counts his feet driven into the ground too (the air blast below comes from them)
        boomSpeed: (r) => Math.max(r.v, r.footSpeed || 0),
        // take-off or landing: on paving, slabs, rock, ice or steel the surface breaks; in soil his feet only sink in
        // (in soil only a crater counts: over a megajoule into the ground, the Jump tab's 'two craters')
        ground: (r, o) => (SOIL.has(o.surface && o.surface.id) ? (r.groundFails && r.Eground >= R.CRATER_E) || !!(r.landing && r.landing.Eground >= R.CRATER_E)
          : r.groundFails || !!(r.landing && r.landing.ratio > 1)),
        blast: (r) => shock(r.footSpeed, r.Eground || 0),
        // the landing, if he comes back down (soft landing absorbs it)
        // the landing on bent legs (the body stopped over the leg stroke) and the feet hitting the ground first
        shake: (r, o) => {
          const L = r.landing;
          if (!L || !L.landed || !(L.v > 0)) return null;
          // soft landing takes back the feet's impact energy; his body still stops over the leg stroke
          return [impulseSource(o.surface, momentumOf(L.v, o.m), L.t), L.soft ? null : impulseSource(o.surface, 2 * o.body.legEff * L.v, footPulse(o.body))].filter(Boolean);
        },
        where: 'around him',
      },
      stomp: {
        run: (c) => stomp(c),
        // one stomp is a single event: 'barely perceptible' from 1 mm/s (Caltrans transient)
        goal: (r, o) => ppvAt(MOVES.stomp.shake(r, o), o.near) >= VIB.TH.feelOnce,
        speed: (r) => r.vFoot,
        // paving, slabs, rock, ice and steel break when the foot punches a 1 cm hole; in soil a dent is only a
        // footprint, so only a crater counts there
        ground: (r, o) => r.crater > 0 || (!SOIL.has(o.surface && o.surface.id) && r.holeDepth >= 0.01),
        blast: (r) => shock(r.vFoot, r.E),
        // the foot and shank stop on the ground: their momentum over a foot's contact time (or the time the hole takes)
        // A measured drill stamp (6.5 x body weight over about 52 ms, scaled) stops more than the leg: about 0.2 body-weight
        // seconds, as if half his body stopped from the leg's 3.7 m/s. The stomp takes the same effective mass, so the
        // Stomp and Walk tabs agree when the foot lands at the same speed.
        // (the leg at the foot's speed; the rest of the stamp's effective mass at most at the stamp's own leg speed,
        // since his body is pushed up, not down, by a harder stomp)
        shake: (r, o) => (r.vFoot > 0 ? impulseSource(o.surface, momentumOf(r.vFoot, o.body.legEff) + Math.max(0, stampMass(o.body) - o.body.legEff) * Math.min(r.vFoot, stampSpeed(o.body)), Math.max(footPulse(o.body), 2 * (r.holeDepth || 0) / r.vFoot)) : null),
        where: 'around him',
      },
      punch: {
        run: (c) => punch(c),
        goal: (r, o) => r.vFist >= o.target,
        speed: (r) => r.vFist,
        blast: (r, o) => (o.silentStrike ? 0 : shock(r.vFist, r.E)),
        where: 'at his fist',
      },
      clap: {
        run: (c) => clap(c),
        goal: (r, o) => r.vHand >= o.target,
        speed: (r) => r.vHand,
        blast: (r, o) => (o.silentStrike ? 0 : shock(r.vHand, r.E)),
        where: 'between his hands',
      },
      sprint: {
        run: (c) => sprint(c),
        goal: (r, o) => r.vTop >= o.target,
        speed: (r) => r.vTop,
        ground: (r, o) => !SOIL.has(o.surface && o.surface.id) && !!r.sinks && r.vTop > 0,
        where: 'along his path',
      },
      pull: {
        run: (c, o) => pull(c, o.obj),
        goal: (r, o) => r.canMove && r.t10m <= o.target,
        speed: (r) => r.vEnd,
        where: 'behind him',
      },
    };
    // Hazards that set the courtesy ceiling: harm to people or property nearby.
    const HAZARDS = [
      { id: 'boom', test: (m, r, o) => !(o.silentStrike && m.silent) && (m.boomSpeed || m.speed)(r) >= K.a0 },
      { id: 'air', test: (m, r, o) => !!m.blast && blastRadius(m.blast(r, o), R.DP_HARM) >= o.near },
      { id: 'plaster', test: (m, r, o) => !!m.shake && plasterOver(m.shake(r, o), o.near) },
      { id: 'ground', test: (m, r, o) => !!m.ground && !o.groundHolds && m.ground(r, o) },
      { id: 'crush', test: (m, r, o) => !!m.crush && m.crush(r, o) },
      { id: 'passenger', test: (m, r, o) => !!m.passenger && m.passenger(r, o) },
      // his own body shoved back past the nearest people (the two-player Catch's rule)
      { id: 'slide', test: (m, r, o) => !!m.slide && m.slide(r, o) >= o.near },
    ];
    MOVES.punch.silent = true; MOVES.clap.silent = true;
    // Not-so-heroic presets, at rising scales: each is the least effort that does what it says.
    const PRESETS = [
      { id: 'rattle', test: (m, r, o) => (!!m.shake && ppvAt(m.shake(r, o), o.near) >= VIB.TH.rattle) || (!!m.blast && blastRadius(m.blast(r, o), R.DP_RATTLE) >= o.near) },
      { id: 'plaster', test: (m, r, o) => !!m.shake && plasterOver(m.shake(r, o), o.near) },
      { id: 'windows', test: (m, r, o) => !!m.blast && blastRadius(m.blast(r, o), R.DP_WINDOWS) >= R.STREET },
      { id: 'ground', test: (m, r, o) => !!m.ground && !o.groundHolds && m.ground(r, o) },
      { id: 'houses', test: (m, r, o) => !!m.blast && blastRadius(m.blast(r, o), R.DP_HOUSES) >= o.near },
      { id: 'block', test: (m, r, o) => !!m.blast && blastRadius(m.blast(r, o), R.DP_HOUSES) >= R.BLOCK },
    ];
    // Search bounds for the strength used: from a hundredth of his weight to the dial (or 10^34 kg-force when unlimited).
    const bounds = (ctx) => [Math.max(1e-6, 0.01 * ctx.body.m * K.g), isFinite(ctx.F) ? ctx.F : 1e34 * K.g];
    // A resumable search for the least effort at which test(use) first holds: it walks a log grid from lo to hi
    // (two points a decade, shared by every search through the memo), then bisects the first step where it turns
    // on. Finds the first onset even when a hazard later turns off again (a thrown object that flies off and never
    // lands). step() runs one probe; .use is set when done (lo if it already holds there; Infinity if it never does,
    // or only at unlimited strength: .onlyUnlimited). same(u0, u1), if given, says the move came out exactly the same at
    // two efforts: something else (footing, the ground, the object's own limit) caps it, so more effort changes
    // nothing and the grid stops there.
    const FINE = 7;
    function search(test, lo, hi, unlimited, same, tol) {
      const n = Math.max(1, Math.ceil(2 * Math.log10(hi / lo)));
      const grid = (i) => (i >= n ? hi : lo * Math.pow(10, i / 2));
      // .below: the most effort that stays short of it (0 if even the least does it; hi, or unlimited, if nothing does)
      const s = { use: undefined, i: 0, a: lo, b: hi, never: false, bisect: false };
      s.step = () => {
        if (s.use !== undefined) return;
        if (!s.bisect) {
          const u = grid(s.i);
          if (test(u)) {
            if (s.i === 0) { s.use = lo; s.below = 0; return; }
            s.a = grid(s.i - 1); s.b = u; s.bisect = true; s.fine = 1; s.a0 = s.a; s.b0 = u; return;
          }
          if (s.i >= n || (same && s.i > 0 && same(grid(s.i - 1), u))) {
            s.use = Infinity;
            s.saturated = s.i < n;
            if (unlimited && test(Infinity)) { s.onlyUnlimited = true; s.below = hi; } else { s.never = true; s.below = unlimited ? Infinity : hi; }
            return;
          }
          s.i++; return;
        }
        // a hazard can switch on and off again (a run changes which muscle model wins): first scan the bracket at
        // FINE points for an earlier onset, then bisect the first step where it turns on
        if (s.fine && s.fine <= FINE) {
          const x = s.a0 * Math.pow(s.b0 / s.a0, s.fine / (FINE + 1));
          if (test(x)) { s.b = x; s.fine = 0; } else { s.a = x; s.fine++; }
          return;
        }
        if (s.b / s.a < 1 + (tol || R.TOL)) { s.use = s.b; s.below = s.a; return; }
        const mid = Math.sqrt(s.a * s.b);
        if (test(mid)) s.b = mid; else s.a = mid;
      };
      return s;
    }
    // Everything the page needs for one move. Jobs: 'goal', 'hazard:<id>', 'preset:<id>'. ensure(name) finishes one
    // job now; step() advances the rest a probe at a time and returns true when all are done.
    // o: { obj, angle, target, near, gentleHold, silentStrike, softLanding, groundHolds, m }
    function plan(move, ctx, o) {
      const M = MOVES[move];
      const opt = Object.assign({ near: R.NEAR, groundHolds: ctx.groundHolds, m: ctx.body.m, body: ctx.body, surface: ctx.surface, anchor: ctx.anchor, coolFlight: !!ctx.coolFlight }, o || {});
      const memo = new Map();
      const at = (u) => {
        const key = u === Infinity ? 'inf' : u;
        let r = memo.get(key);
        if (!r) { r = M.run(Object.assign({}, ctx, { use: u }), opt); memo.set(key, r); }
        return r;
      };
      const [lo, hi] = bounds(ctx);
      const unlimited = !isFinite(ctx.F);
      // (soil: sand, gravel and clay)
    // the move has saturated when it comes out at the same nonzero speed (to a part in a million) at two efforts
      // half a decade apart: real muscle tops out at its limb speed, footing and the ground cap the push
      // ... and only if all-out comes out the same too: a run held back to the footing or the ground can sit on a flat
      // stretch, then rise again where the full push wins
      const eqv = (a, b) => a > 0 && isFinite(a) && Math.abs(b - a) <= 1e-6 * a;
      const same = (u0, u1) => { const a = M.speed(at(u0)), b = M.speed(at(u1)); return eqv(a, b) && eqv(b, M.speed(at(hi))); };
      const jobs = new Map();
      jobs.set('goal', search((u) => M.goal(at(u), opt), lo, hi, unlimited, same));
      for (const h of HAZARDS) jobs.set('hazard:' + h.id, search((u) => h.test(M, at(u), opt), lo, hi, unlimited, same));
      for (const p of PRESETS) jobs.set('preset:' + p.id, search((u) => p.test(M, at(u), opt), lo, hi, unlimited, same));
      const result = (name) => {
        const j = jobs.get(name);
        if (!j || j.use === undefined) return null;
        return { id: name.split(':')[1] || name, use: j.use, below: j.below, never: j.never, onlyUnlimited: !!j.onlyUnlimited, atLowest: j.use === lo };
      };
      const out = { move, opt, lo, hi, unlimited, done: false };
      out.ensure = (name) => { const j = jobs.get(name); while (j.use === undefined) j.step(); return result(name); };
      // one probe of one job; true once that job is done
      out.stepJob = (name) => { const j = jobs.get(name); if (j.use === undefined) j.step(); return j.use !== undefined; };
      out.result = result;
      out.goal = () => { const g = out.ensure('goal'); return Object.assign(g, { reached: !g.never && !g.onlyUnlimited }); };
      // the courtesy ceiling: just under the first hazard to start (null `by`: nothing harmful even all-out)
      out.ceiling = () => {
        let first = null;
        for (const h of HAZARDS) { const r = out.ensure('hazard:' + h.id); if (!r.never && (!first || r.use < first.use)) first = r; }
        return first ? { use: first.use, below: first.below, by: first.id, atLowest: first.atLowest, onlyUnlimited: first.onlyUnlimited } : { use: unlimited ? Infinity : hi, below: unlimited ? Infinity : hi, by: null };
      };
      out.hazards = () => HAZARDS.map((h) => out.ensure('hazard:' + h.id));
      out.presets = () => PRESETS.map((p) => out.ensure('preset:' + p.id));
      out.step = () => {
        if (out.done) return true;
        for (const j of jobs.values()) if (j.use === undefined) { j.step(); return false; }
        out.done = true;
        return true;
      };
      out.run = (u) => at(u);
      out.runs = () => memo.size;
      return out;
    }
    function planNow(move, ctx, o) { const p = plan(move, ctx, o); while (!p.step()); return p; }
    // How far each hazard reaches at a given result (m), or 0 / null when it doesn't apply.
    function reach(move, r, o) {
      const M = MOVES[move], opt = Object.assign({ near: R.NEAR }, o || {});
      if (M.shake && (!opt.surface || !opt.body)) throw new Error('RESTRAINT.reach needs o.surface and o.body');
      const E = M.blast ? M.blast(r, opt) : 0, src = M.shake ? M.shake(r, opt) : null;
      return {
        air: E > 0 ? blastRadius(E, R.DP_HARM) : 0,
        airRattle: E > 0 ? blastRadius(E, R.DP_RATTLE) : 0,
        windows: E > 0 ? blastRadius(E, R.DP_WINDOWS) : 0,
        houses: E > 0 ? blastRadius(E, R.DP_HOUSES) : 0,
        feel: src ? ppvReach(src, VIB.TH.feel) : 0,
        shimmer: src ? ppvReach(src, VIB.TH.shimmer) : 0,
        rattle: src ? ppvReach(src, VIB.TH.rattle) : 0,
        plaster: src ? plasterReach(src) : 0,
        boom: !(opt.silentStrike && M.silent) && (M.boomSpeed || M.speed)(r) >= K.a0,
        ground: !!M.ground && !opt.groundHolds && M.ground(r, opt),
        crush: !!M.crush && M.crush(r, opt),
        passenger: !!M.passenger && M.passenger(r, opt),
        slide: M.slide ? M.slide(r, opt) : 0,
      };
    }
    return { R, SOIL, MOVES, HAZARDS, PRESETS, plan, planNow, reach, bounds, search };
  })();

  // ---------------------------------------------------------------------------
  // Absorbed energy and growth (canon: they can take back the energy they put out). By default it returns to the
  // store of power they draw on (the "endless ocean": nothing changes). In the growth modes it becomes mass,
  // dm = E / c^2. Growth form: s is the share of the mass ratio that goes into volume (1 = pure size, 0 = pure
  // density, 0.5 = the even mix), so volume grows as ratio^s, density as ratio^(1-s) and height as ratio^(s/3).
  // Momentum is never absorbed.
  // ---------------------------------------------------------------------------
  // A person he throws: the most acceleration an ordinary, unprepared person takes with no harm, and the level
  // that starts to injure (research/final-presence.json: comic_passenger_no_harm_limit, comic_passenger_injury_level).
  // Ride-design limits are for seated, supported riders; nobody has measured them for someone held in hands, so these
  // are a best case. Unknown orientation (a tumbling throw, a catch face-first) takes the worst axis, eyes-front (-Gx):
  // ASTM F2291-06a Fig. 7 runs from 2 g at 0.2 s to 1.5 g at 0.5 s, then 1.5 g held. The standard doesn't cover pushes
  // shorter than 0.2 s; keeping 2 g there is our estimate. Injury becomes possible past what harnessed volunteers took
  // uninjured (Eiband 1959): 45 g for 0.044 s, 40 g for 0.1 s, 25 g for 0.2 s, 13 g for 0.6 s, 10 g for 1.6 s.
  const PASSENGER = {
    noHarm: (t) => (t <= 0.2 ? 2 : t >= 0.5 ? 1.5 : 2 - 0.5 * (t - 0.2) / 0.3),
    EIBAND: [[0.044, 45], [0.1, 40], [0.2, 25], [0.6, 13], [1.6, 10]],
    injury(t) {
      const E = PASSENGER.EIBAND;
      if (t <= E[0][0]) return E[0][1];
      if (t >= E[E.length - 1][0]) return E[E.length - 1][1];
      for (let i = 1; i < E.length; i++) if (t <= E[i][0]) { const [t0, g0] = E[i - 1], [t1, g1] = E[i]; return Math.exp(Math.log(g0) + (Math.log(g1) - Math.log(g0)) * Math.log(t / t0) / Math.log(t1 / t0)); }
      return E[E.length - 1][1];
    },
    // air drag on a flying person, in g, at speed v (strongest at release): 1/2 rho v^2 Cd A / (m g) (comic_passenger_drag_g)
    dragG: (o, v) => (v > 0 ? 0.5 * K.rho0 * v * v * (v >= K.a0 ? (o.CdSup || o.Cd || 1) : (o.Cd || 1)) * (o.area || 0.67) / (o.m * K.g) : 0),
    // what the person feels: the push plus holding them up against gravity, n = |a + g| / g with a along the throw
    felt: (aG, thetaDeg) => { const th = thetaDeg * Math.PI / 180; return Math.hypot(aG * Math.cos(th), aG * Math.sin(th) + 1); },
  };
  const GROW = {
    TISSUE_C: 1540,   // speed of sound in soft tissue, m/s: instant growth takes the time sound needs to cross the body (estimate of the timescale)
    SAFE_DP: 100,     // air pulse that stays harmless at a house: 134 dB, USBM RI 8485's safe level, Pa
    SAFE_U: 0.25,     // a moving surface slow enough for a person to get out of the way: OSHA's 250 mm/s for robots, m/s
    GAP: 2,           // a bystander stands this far from his final surface, m (estimate)
    MIX: 0.5,         // the even mix
    DP_WIN: [3400, 6900],   // windows usually shatter, Pa (data: blast_window_breakage)
  };
  const formShare = (form) => (typeof form === 'number' ? Math.min(1, Math.max(0, form)) : form === 'size' ? 1 : form === 'density' ? 0 : GROW.MIX);
  // The body after absorbing E joules as mass. lnr = ln(mass ratio), kept exact for tiny energies.
  function grownBody(body, E, form) {
    const s = formShare(form);
    const dm = E / (K.c * K.c);
    const lnr = isFinite(dm) ? Math.log1p(dm / body.m) : Infinity;
    const H = body.H * Math.exp(lnr * s / 3);
    const V = body.volume * Math.exp(lnr * s);
    const m = body.m + dm;
    return { E, dm, s, lnr, ratio: Math.exp(lnr), H, m, V, rho: m / V, R0: eqRadius(body), R: Math.cbrt(3 * V / (4 * Math.PI)),
      dV: body.volume * Math.expm1(lnr * s), dH: body.H * Math.expm1(lnr * s / 3) };
  }
  // A grown body in the engine's body format (for the Weight tab's physics): same build, new height and mass.
  function grownMakeBody(body, E, form) {
    const g = grownBody(body, E, form);
    return makeBody({ H: g.H, m: g.m, build: body.build });
  }
  // Overpressure in front of a flat piston pushed into still air at speed u (normal-shock relations): about rho0 a0 u
  // when slow, about 1.2 rho0 u^2 when fast. The upper bound for a growing surface.
  function pistonOverpressure(u) {
    const q = (K.gammaAir + 1) * u / (4 * K.a0), M = q + Math.sqrt(q * q + 1);
    return K.p0 * (2 * K.gammaAir / (K.gammaAir + 1)) * (M * M - 1);
  }
  // At the surface of a sphere expanding at constant speed u (Taylor 1946; our solution, checked two ways): about
  // k rho0 u^2, with k from 1.16 at 0.3 a0 to 1.00 past 1.5 a0. Slower than that the planar onset rho0 a0 u applies.
  function sphereOverpressure(u) {
    const x = u / K.a0, T = [[0.3, 1.16], [0.45, 1.08], [0.6, 1.04], [0.8, 1.02], [1.0, 1.01], [1.5, 1.0]];
    if (x < 0.3) return Math.min(K.rho0 * K.a0 * u, 1.16 * K.rho0 * u * u + K.rho0 * K.a0 * u * Math.max(0, 1 - x / 0.3));
    let k = 1.0;
    for (let i = 1; i < T.length; i++) if (x <= T[i][0]) { k = T[i - 1][1] + (T[i][1] - T[i - 1][1]) * (x - T[i - 1][0]) / (T[i][0] - T[i - 1][0]); break; }
    return k * K.rho0 * u * u;
  }
  // Gradual growth over T with a smooth start and stop: the share of the mass added by time t is
  // t/T - sin(2 pi t/T) / (2 pi), so the rate goes as 1 - cos(2 pi t/T) (our choice of profile). Returns the peak
  // volume acceleration and the peak rate of height growth, as k_V = max|V''| T^2 / dV and k_H = max(H') T / dH.
  function growthShape(body, E, form) {
    const g = grownBody(body, E, form), N = 400;
    if (!(g.dV > 0) || !isFinite(g.lnr)) return { kV: 2 * Math.PI, kH: 2 };
    const at = (u) => { const sh = u - Math.sin(2 * Math.PI * u) / (2 * Math.PI), lnk = Math.log1p(Math.expm1(g.lnr) * sh); return { V: Math.exp(lnk * g.s), H: Math.exp(lnk * g.s / 3) }; };
    let kV = 0, kH = 0;
    const h = 1 / N;
    for (let i = 1; i < N; i++) {
      const a = at((i - 1) * h), b = at(i * h), c2 = at((i + 1) * h);
      kV = Math.max(kV, Math.abs(c2.V - 2 * b.V + a.V) / (h * h));
      kH = Math.max(kH, (c2.H - a.H) / (2 * h));
    }
    const dVr = Math.expm1(g.lnr * g.s), dHr = Math.expm1(g.lnr * g.s / 3);
    return { kV: kV / dVr, kH: kH / dHr };
  }
  // Gradual growth: the shortest duration that stays harmless to a bystander GAP metres from his final surface.
  // Air: the growing body is a compact source of volume flow; on rigid ground the pressure at r is rho0 V''/(2 pi r)
  // (twice the free-field monopole), peaking at rho0 k_V dV / (2 pi r T^2). Shove: the top of his head rises at up to
  // k_H dH / T; anything above or beside him has to be able to get out of the way. Lift: a growth faster than
  // sqrt(pi dH / g) would lift his middle off the ground, but that lift goes to the endless ocean (canon), so it sets
  // no limit (Tl is reported only; it never set the time for growth the page shows, only below about 5 mm).
  function gradualGrowth(body, E, form, o) {
    const opt = o || {};
    const g = grownBody(body, E, form);
    const gap = opt.gap == null ? GROW.GAP : opt.gap, dpSafe = opt.dp || GROW.SAFE_DP, uSafe = opt.u || GROW.SAFE_U;
    const sh = growthShape(body, E, form), r = g.R + gap;
    const Tp = g.dV > 0 ? Math.sqrt(K.rho0 * sh.kV * g.dV / (2 * Math.PI * r * dpSafe)) : 0;
    const Tu = g.dH > 0 ? sh.kH * g.dH / uSafe : 0;
    const Tl = g.dH > 0 ? Math.sqrt(Math.PI * g.dH / K.g) : 0;
    const T = Math.max(Tp, Tu);
    const pAt = (Tc) => (g.dV > 0 ? K.rho0 * sh.kV * g.dV / (2 * Math.PI * r * Tc * Tc) : 0);
    const uAt = (Tc) => (g.dH > 0 ? sh.kH * g.dH / Tc : 0);
    return { grown: g, shape: sh, T, Tp, Tu, Tl, by: T === Tu ? 'shove' : 'pressure', r, pAt, uAt, compact: T > 10 * g.H / K.a0 };
  }
  // Instant growth: all at once, over the time sound takes to cross his new body (height / 1,540 m/s; an estimate).
  // He grows about his middle, all the way through (canon): his sides move out at about dR / t, the top of his head
  // rises at dH / 2t and his soles move down at the same speed. The air at his surface gets from the expanding-sphere
  // value (low end) to the flat-piston value at his head's speed (high end); the excess energy pushed into the air,
  // dp x dV, is a blast; on hard ground it counts double (an upper bound: it counts the downward share as air too).
  // The ground: the lift its push would give him goes to the endless ocean (canon, 12 Oct 2026), so his middle
  // stays put.
  // gnd (optional): { surface, groundHolds }. Real ground gives: his soles are driven dH/2 in at dH / 2t, and the ground
  // takes that work, its bearing plus the inertia of the soil pushed aside (the Poncelet rule the lab uses for feet
  // driven into the ground). Comic ground (or none given) doesn't give: he grows upward from his soles instead, his
  // middle rising dH/2, and ends at rest (the lift goes to the endless ocean). Bolting stops sliding, not sinking.
  function instantGrowth(body, E, form, gnd) {
    const g = grownBody(body, E, form);
    const tau = g.H / GROW.TISSUE_C;
    const dR = g.R - g.R0;
    const u = dR / tau;
    const vSole = 0.5 * g.dH / tau;                              // his soles' speed down, relative to his middle
    const soles = 2 * body.footArea * Math.exp(g.lnr * g.s * 2 / 3);
    const gives = !!(gnd && gnd.surface && !gnd.groundHolds) && g.dH > 0;
    let qGround = Infinity, Fground = 0, sink = 0, Eground = 0, rise = 0, Pocean = 0;
    if (gives) {
      qGround = qultFor(gnd.surface, body.footB * Math.exp(g.lnr * g.s / 3));
      Fground = soles * (qGround + K.PONCELET_K * (gnd.surface.rho || 2000) * vSole * vSole);
      sink = 0.5 * g.dH;
      Eground = Fground * sink;
      Pocean = Math.max(0, Fground - g.m * K.g) * tau;           // the ground's upward impulse, beyond holding his weight
    } else if (g.dH > 0) {
      rise = 0.5 * g.dH;
      Pocean = g.m * vSole;                                      // his rise, stopped when the growth ends
    }
    // the lift he would have had: the speed that impulse gives him, and how high it would throw him (no drag)
    const vWould = Pocean / g.m, launchWould = vWould * vWould / (2 * K.g);
    // the head rises at the soles' speed relative to his middle, plus his middle's own rise when the ground holds
    const uHead = vSole + (gives ? 0 : vSole);
    const dpLo = g.dV > 0 ? sphereOverpressure(u) : 0;
    const dpHi = g.dV > 0 ? pistonOverpressure(uHead) / 3 + 2 * pistonOverpressure(u) / 3 : 0;
    const Elo = 2 * dpLo * g.dV, Ehi = 2 * dpHi * g.dV;          // x2: rigid ground reflects it (equivalent free-air energy)
    return { grown: g, tau, u, uHead, vSole, mach: u / K.a0, machHead: uHead / K.a0, dpLo, dpHi, Elo, Ehi, Eatm: K.p0 * g.dV, soles,
      gives, qGround, Fground, groundPressure: gives ? Fground / soles : 0, sink, Eground, rise, Pocean, vWould, launchWould, launch: 0,
      quake: Eground > 0 ? seismicMagnitude(Eground) : null };
  }
  // Runaway: the side effects of the growth are paid from the energy absorbed and taken back as growth too (canon).
  // The air pushed back (p0 + dp over dV) and the ground driven in are spent and then returned: a round trip, so in the
  // end all of E becomes mass, no more. The binding energy his own gravity releases as he grows goes to the endless
  // ocean (canon, 12 Oct 2026), so it adds nothing. Loop ratio k = side effects / energy absorbed; each round returns k of
  // the last, so the loop dies out at once and can never run away (so the page has no half-life control). The gravity share is
  // still reported: binding energy of a uniform ball, 3 G M^2 / (5 R), so 0.3 (2 - s/3) r_s / R in weak gravity.
  function runawayGrowth(body, E, form, gnd) {
    const inst = instantGrowth(body, E, form, gnd), g = inst.grown;
    const bind = (m, R) => 0.6 * K.G * m * m / R;
    const ok = isFinite(E) && E > 0;
    const fAir = ok ? (K.p0 + inst.dpHi) * g.dV / E : 0;
    const fGround = ok ? inst.Eground / E : 0;
    const fGrav = ok ? Math.max(0, bind(g.m, g.R) - bind(body.m, g.R0)) / E : 0;
    const kGravNow = 0.3 * (2 - g.s / 3) * 2 * K.G * g.m / (g.R * K.c * K.c);
    const rs = 2 * K.G * g.m / (K.c * K.c);
    return { instant: inst, grown: g, k: fAir + fGround, kAir: fAir, kGround: fGround, kGrav: fGrav, Egrav: fGrav * E, kGravNow,
      runs: false, total: E, rs, rsOverR: rs / g.R };
  }

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
    K, MUSCLE, CAL_LIFT_KG, V_ESC, BASE_V, BUILDS, DEFAULT_BODIES, makeBody, bodyVolume, qultFor,
    eqRadius, blackHoleDensity, isBlackHole, mutualGravity, fallTogether,
    W8, PREM, premRho, premG, premPhi, premSolid, bodyGravity, infallFrom, moveCheck, groundUnderWeight, fallThrough, settle, planetRegime, weight,
    selfPull, escapeSpeedFrom, vInfinity,
    AW, TABLE, RING_D, HUMERUS_NM, armWrestle, pushMatch, shove, shoveBoth, liftPartner, throwPartner,
    CATCH: CATCHGAME.CATCH, flyTo: CATCHGAME.flyTo, catchGame: CATCHGAME.game, catchLeg: CATCHGAME.leg, tossPartner: CATCHGAME.tossPartner, catchIt: CATCHGAME.catchIt, partnerAsObject: CATCHGAME.partnerAsObject, catchMaterials: CATCHGAME.OBJ_MATERIAL, catchMinD: (bT, bC, obj) => CATCHGAME.pushStartRadius(bT) + CATCHGAME.meetRadius(bC, obj) + 1, catchRoundTrip: CATCHGAME.roundTrip, catchMeetRadius: CATCHGAME.meetRadius, catchWellNeed: CATCHGAME.wellNeed, catchReleaseTable: CATCHGAME.releaseTable,
    COL: COLLIDE.COL, headOn: COLLIDE.headOn, standoff: COLLIDE.standoff, chargeSpeed: COLLIDE.chargeSpeed, collide: COLLIDE.collide, holdOf: COLLIDE.holdOf, rockLoad: COLLIDE.rockLoad, contactForces: COLLIDE.contactForces,
    momentumToV, momentumToKE, vToMomentum, keFromV, xOfT,
    hill, pushApart, anchorCapacity,
    rhoAt, stagnationT, stagnationTIdeal, cdAt, conicTo, fly, vacuumApex, craterDiameter, seismicMagnitude,
    kgRatio, overpressureAt, blastRadius, penetrationDepth,
    lift, throwObject, jump, stomp, punch, clap, sprint, pull, threshold, calibrateComic,
    throwOnce, jumpOnce, stompOnce, punchOnce, clapOnce,
    driveStrength, PASSENGER, VIB, ppvAt, ppvNonlinear, groundOf, vibSource, elephantPPV, sphereOverpressure, growthShape, WALK, walkStep, walkThresholds, plasterOver, plasterReach, plasterLimitHz, footprint, standDepth, presence, walkEffortFor, ppvReach, RESTRAINT, GROW, formShare, grownBody, grownMakeBody, pistonOverpressure, gradualGrowth, instantGrowth, runawayGrowth,
  };
});
