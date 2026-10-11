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
    E_NM: 16.3 * 1.602176634e-13 / 1.67492750e-27, // J/kg freed when neutron matter decompresses (>= 16 MeV/neutron)
    P_NM: [1.4e19 * 1.602176634e13, 2.1e19 * 1.602176634e13], // Pa, pressure of neutron matter at nuclear density
    RHO_OSMIUM: 22587,       // densest element at everyday pressure, kg/m^3
    M_RESHAPE: 1e-3 * K.M_E, // above this his pull reshapes the planet; moves are no longer modelled
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
    const bondiRate = bondiOutside ? 2 * Math.PI * GM * GM * K.rho0 / Math.pow(K.a0, 3) : 0;   // kg/s, upper bound
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
      decompJ: body.rho >= 1e17 ? m * W8.E_NM : 0,
    };
  }
  // Something released at rest d0 from his middle falls onto him (his pull only).
  function infallFrom(GM, R, d0) {
    if (!(d0 > R)) return { t: 0, v: 0 };
    const x = R / d0;
    return { t: Math.sqrt(d0 * d0 * d0 / (2 * GM)) * (Math.sqrt(x * (1 - x)) + Math.acos(Math.sqrt(x))), v: Math.sqrt(2 * GM * (1 / R - 1 / d0)) };
  }
  // Can his legs move his own weight? Legs push 1.4x the dial (the jump's share); a step loads one leg with ~1.2 W.
  function moveCheck(F, m) {
    const Wt = m * K.g, leg = LEG_SHARE() * F;
    return {
      weight: Wt, legForce: leg, stand: leg >= Wt, walk: leg >= W8.WALK_LOAD * Wt, run: F > Wt,
      standNeedKg: m / LEG_SHARE(), walkNeedKg: W8.WALK_LOAD * m / LEG_SHARE(), runNeedKg: m,
    };
  }
  // The ground under his own weight: stands, sinks a little, punches through a thin layer, or no rock can hold him.
  function groundUnderWeight(body, surface, groundHolds) {
    const Wt = body.m * K.g, Af = 2 * body.footArea, Ab = body.topArea, Lleg = 0.45 * body.H;
    const p1 = Wt / Af, p2 = Wt / Ab, q0f = qultFor(surface, body.footB);
    const out = { weight: Wt, footPressure: p1, bodyPressure: p2, q0: q0f, standRatio: p1 / q0f, rockRatio: Wt / (W8.SIGMA_ROCK * Ab), rockCap: W8.SIGMA_ROCK * Ab, sink: 0, legLength: Lleg };
    if (groundHolds) return Object.assign(out, { regime: 'comic', standRatio: 0 });
    if (Wt > W8.SIGMA_ROCK * Ab) return Object.assign(out, { regime: 'fallsThrough' });
    if (p1 <= q0f) return Object.assign(out, { regime: 'stands' });
    const soil = { sand: W8.NQ.sand, gravel: W8.NQ.gravel, softclay: 1, stiffclay: 1 }[surface.id];
    if (soil) {
      // bearing grows with depth: + gamma D N_q for sand and gravel, + gamma D (overburden only) for clay
      const gN = (surface.rho || 1800) * K.g * soil;
      const D1 = (p1 - q0f) / gN;
      if (D1 <= Lleg) return Object.assign(out, { regime: 'sinks', sink: D1, stage: 'feet' });
      const q0b = qultFor(surface, Math.sqrt(Ab));
      const D2 = Math.max(Lleg, (p2 - q0b) / gN);
      if (D2 <= body.H) return Object.assign(out, { regime: 'sinks', sink: D2, stage: 'body' });
      return Object.assign(out, { regime: 'outOfSight', sink: D2, stage: 'body' });
    }
    if (surface.id === 'granite') return Object.assign(out, { regime: 'sinks', sink: Lleg, stage: 'rock' });
    return Object.assign(out, { regime: 'punchesThrough', layer: surface.id });
  }
  // Falling into the planet: 3-D, non-spinning frame, Earth turning about z. Rock resists motion relative to
  // it with area x (strength + rho v^2) (none in the liquid outer core), plus buoyancy rho V g.
  function fallThrough(body, o) {
    const opt = o || {};
    const m = body.m, A = body.topArea, V = body.volume, kP = K.PONCELET_K, RE = K.R_E;
    const lat = (opt.latDeg || 0) * Math.PI / 180, Om = W8.OMEGA_E;
    const tMax = opt.tMax || 2 * 86400;
    const acc = (s) => {
      const r = Math.hypot(s[0], s[1], s[2]), gr = premG(r);
      let ax = -gr * s[0] / r, ay = -gr * s[1] / r, az = -gr * s[2] / r;
      if (r < RE) {
        const rho = premRho(r), b = rho * V / m * gr;
        ax += b * s[0] / r; ay += b * s[1] / r; az += b * s[2] / r;
        const rx = s[3] + Om * s[1], ry = s[4] - Om * s[0], rz = s[5], vr = Math.hypot(rx, ry, rz);
        if (vr > 0) { const f = A * kP * rho * vr / m; ax -= f * rx; ay -= f * ry; az -= f * rz; }
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
      const dt = Math.min((vrel > 100 || RE - r < 20e3) ? 1 : 10, Math.max(1e-3, 0.002 * r / Math.max(v, 1)));
      const k1 = acc(s), s2 = s.map((q, i) => q + 0.5 * dt * k1[i]);
      const k2 = acc(s2), s3 = s.map((q, i) => q + 0.5 * dt * k2[i]);
      const k3 = acc(s3), s4 = s.map((q, i) => q + dt * k3[i]);
      const k4 = acc(s4);
      const ns = s.map((q, i) => q + dt / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
      t += dt; steps++;
      // rock strength: a friction impulse of at most sigma A dt / m against motion relative to the rock
      const nr = Math.hypot(ns[0], ns[1], ns[2]);
      if (nr < RE && premSolid(nr)) {
        const rel = [ns[3] + Om * ns[1], ns[4] - Om * ns[0], ns[5]], vr = Math.hypot(rel[0], rel[1], rel[2]);
        const dv = W8.SIGMA_ROCK * A * dt / m, k = vr > dv ? (vr - dv) / vr : 0;
        ns[3] = -Om * ns[1] + rel[0] * k; ns[4] = Om * ns[0] + rel[1] * k; ns[5] = rel[2] * k;
        if (k === 0 && Math.abs(m - premRho(nr) * V) * premG(nr) <= W8.SIGMA_ROCK * A) { stuck = { t, r: nr }; s = ns; break; }
      }
      if (nr < minR) minR = nr;
      const vr = vRad(ns);
      if (!innermost && prevVr < 0 && vr >= 0 && t > 10) innermost = true;
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
      const lon = (Math.atan2(s[1], s[0]) - W8.OMEGA_E * t) * 180 / Math.PI;
      end = { t: stuck.t, r: stuck.r, depth: RE - stuck.r, layer: PREM_NAMES[premLayer(stuck.r)], driftKm: lon * Math.PI / 180 * stuck.r / 1000 };
    }
    return { t, steps, minR, maxV, stuck: end, firstPass, stillSinking: !stuck && !firstPass, rEnd, path };
  }
  // Long-term settling for a body that loses little energy per trip: orbit-averaged amplitude decay,
  // each half-trip treated as straight through the centre.
  function settle(body, Amax) {
    const m = body.m, Ab = body.topArea, V = body.volume, kP = K.PONCELET_K, RE = K.R_E;
    const top = Math.min(Amax || RE, RE);
    let rStop = 0;
    { let lo = 0, hi = RE; for (let i = 0; i < 100; i++) { const mid = 0.5 * (lo + hi); const F = (m - premRho(mid) * V) * premG(mid); if (F > W8.SIGMA_ROCK * Ab || !premSolid(mid)) hi = mid; else lo = mid; } rStop = lo; }
    const NT = 200, NA = 600;
    const passFor = (Amp) => {
      let T = 0, dE = 0;
      const phiA = premPhi(Amp);
      for (let i = 0; i < NT; i++) {
        const th = -Math.PI / 2 + (i + 0.5) * Math.PI / NT, r = Math.abs(Amp * Math.sin(th)), dr = Amp * Math.cos(th) * Math.PI / NT;
        const v2 = Math.max(0, 2 * (phiA - premPhi(r))), v = Math.sqrt(v2);
        if (v > 0) T += dr / v;
        dE += Ab * ((premSolid(r) ? W8.SIGMA_ROCK : 0) + kP * premRho(r) * v2) * dr;
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
    if (grav.blackHole) return { regime: 'blackHole', massRatioEarth: m / K.M_E, tff: (Math.PI / 2) * Math.sqrt(Math.pow(K.R_E, 3) / (2 * K.G * (m + K.M_E))), eLow: K.G * m * K.M_E / K.R_E };
    if (m >= K.M_E) return { regime: 'earthFalls', massRatioEarth: m / K.M_E, tff: (Math.PI / 2) * Math.sqrt(Math.pow(K.R_E, 3) / (2 * K.G * (m + K.M_E))), eLow: K.G * m * K.M_E / K.R_E };
    if (m >= W8.M_RESHAPE) return { regime: 'reshapes', massRatioEarth: m / K.M_E, tff: (Math.PI / 2) * Math.sqrt(Math.pow(K.R_E, 3) / (2 * K.G * (m + K.M_E))), eLow: K.G * m * K.M_E / K.R_E };
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
      denserThanOsmium: body.rho > W8.RHO_OSMIUM, nmCaveat: body.rho >= 1e17 ? { J: grav.decompJ, P: W8.P_NM } : null,
    };
    if (planet.regime === 'none' && ground.regime === 'fallsThrough') {
      let cached = weightCache.get(key);
      if (!cached) {
        let fall = fallThrough(body, { record: o.record });
        let st = null, rEnd;
        if (fall.firstPass && fall.firstPass.depthShort < 0.01 * K.R_E) { st = settle(body); rEnd = st.rStop; }
        else if (fall.stuck) rEnd = fall.stuck.r;
        else {
          // several damped swings: keep integrating until he sticks, then average whatever is left
          fall = fallThrough(body, { record: o.record, full: true, tMax: 10 * 86400 });
          if (fall.stuck) rEnd = fall.stuck.r;
          else { st = settle(body, fall.rEnd); rEnd = st.rStop; }
        }
        cached = { fall, settle: st, energyJ: body.m * (0 - premPhi(rEnd)) };
        if (weightCache.size > 64) weightCache.clear();
        weightCache.set(key, cached);
      }
      Object.assign(out, cached);
    }
    return out;
  }
  const selfPull = (m, r) => K.G * m / (r * r);
  const escapeSpeedFrom = (m, r) => Math.sqrt(2 * K.G * m / r);
  // speed left after climbing out of his gravity well from r0 (0 if it can't escape)
  const vInfinity = (v, m, r0) => { const q = v * v - 2 * K.G * m / r0; return q > 0 ? Math.sqrt(q) : 0; };

