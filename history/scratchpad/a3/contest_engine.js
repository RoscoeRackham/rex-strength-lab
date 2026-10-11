  // ---------------------------------------------------------------------------
  // Two-player contests: arm wrestling and wrestling (Rex vs Ollie). Each side is a full context
  // { F, mode, body, surface, groundHolds, anchor }. Newton's third law makes the push between them
  // equal both ways, so once both out-muscle what holds them in place, the weakest link decides.
  // ---------------------------------------------------------------------------
  const AW = {
    forceFrac: 0.11,       // sideways force at the clasped hands, share of full strength (estimate, both modes)
    lever: 0.19,           // upper-arm axis to the grip, share of height
    effMass: 0.022 * Math.pow(0.827 * 0.1525 / 0.19, 2), // forearm + hand inertia about the elbow / lever^2, share of body mass
    pinAngle: Math.PI / 2, // a quarter turn from upright to the touch pad
    elbowLoad: 0.036,      // forearm + hand + half the upper arm rest on the elbow pad, share of body weight
    holdArm: 0.022 * 0.682 * 0.1525 / 0.19, // forearm weight moment at the grip (forearm level), share of body weight
  };
  const TABLE = { refH: 1.7562, depth: 0.660, elbowCap: 10e3, slamJ: 102 };
  const RING_D = 4.55;          // sumo ring diameter at a mean height of 2 m
  const HUMERUS_NM = 190;       // rough torsional strength of a human upper-arm bone, N m (estimate)
  const sameForce = (a, b) => a === b || (isFinite(a) && isFinite(b) && Math.abs(a - b) <= 1e-9 * Math.max(Math.abs(a), Math.abs(b)));
  const footingOf = (c, mA) => anchorCapacity({ body: c.body, surface: c.surface, theta: 0, anchor: c.anchor, groundHolds: c.groundHolds, mA });
  // tear-out limit of the ground around a bolted stance (the same shear x buried area as claws dug in)
  const groundTear = (c) => (c.groundHolds ? Infinity : c.surface.shear * c.body.digArea);
  const shoveShare = (c) => (c.mode === 'real' ? MUSCLE.throwPush.forceFrac : MUSCLE.throwPush.comicFrac);
  const shoveDrive = (c) => Math.min(c.F, 2 * c.F * shoveShare(c));

  function armWrestle(cA, cB) {
    const A = cA.body, B = cB.body;
    if (isBlackHole(A) || isBlackHole(B)) return { blackHole: true };
    const PA = cA.F * AW.forceFrac, PB = cB.F * AW.forceFrac;
    const fA = footingOf(cA), fB = footingOf(cB);
    const AA = Math.min(PA, fA.R), AB = Math.min(PB, fB.R);
    const out = { PA, PB, RA: fA.R, RB: fB.R, AA, AB, footLimitedA: fA.R < PA, footLimitedB: fB.R < PB, LA: AW.lever * A.H, LB: AW.lever * B.H };
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
    out.pulledTogether = out.grav.F > Math.min(fA.R, fB.R) && out.grav.F > Math.max(shoveDrive(cA), shoveDrive(cB));
    out.torqueA = AA * out.LA; out.torqueB = AB * out.LB;
    out.humerusRatioA = out.torqueA / HUMERUS_NM; out.humerusRatioB = out.torqueB / HUMERUS_NM;
    out.tearA = cA.anchor === 'bolted' ? AA / groundTear(cA) : 0;
    out.tearB = cB.anchor === 'bolted' ? AB / groundTear(cB) : 0;
    if (!isFinite(AA) && !isFinite(AB)) { out.outcome = 'undefined'; return out; }
    if (sameForce(AA, AB)) { out.outcome = 'stalemate'; out.contact = AA; return out; }
    const aWins = AA > AB;
    const Aw = aWins ? AA : AB, Al = aWins ? AB : AA, bw = aWins ? A : B, bl = aWins ? B : A, cw = aWins ? cA : cB;
    const s = AW.pinAngle * AW.lever * bl.H;
    const M = AW.effMass * (A.m + B.m);
    const Pw = aWins ? PA : PB, Rw = aWins ? fA.R : fB.R;
    // comic: constant net push; real: the winner's arm force falls with hand speed (Hill), capped by his footing
    const push = cw.mode === 'real'
      ? pushApart({ F: Pw, Fcap: Rw < Pw ? Rw : undefined, d: s, mA: M, mB: M, RA: Infinity, RB: Al, mode: 'real', vmax: MUSCLE.punch.vmax * bw.s })
      : pushApart({ F: Aw, d: s, mA: M, mB: M, RA: Infinity, RB: Al, mode: 'comic' });
    Object.assign(out, { outcome: 'pin', winner: aWins ? 'A' : 'B', contact: Al, pin: { s, M, t: push.t, v: push.vB, E: push.EB, dA: Aw - Al } });
    out.slamRatio = push.EB / out.slamCap;
    const v = push.vB, E = push.EB;
    out.relativistic = v >= 0.01 * K.c;
    if (!cA.groundHolds && v >= 2000 && !out.relativistic && isFinite(E)) {
      const rhoW = bw.rho;
      const cr = craterDiameter({ L: Math.cbrt(6 * M / (Math.PI * rhoW)), v, rhoI: rhoW, rhoT: cA.surface.rho || 2000, angleDeg: 90, E });
      out.crater = cr.D; out.craterExtrapolated = !!cr.extrapolated;
    } else out.crater = 0;
    out.quake = seismicMagnitude(E);
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
    const HA = bolt(cA) ? Infinity : Math.min(cA.F, fA.R), HB = bolt(cB) ? Infinity : Math.min(cB.F, fB.R);
    const DA = Math.min(cA.F, drive(cA, fA)), DB = Math.min(cB.F, drive(cB, fB));
    const out = { HA, HB, DA, DB, holdA: fA.R, holdB: fB.R };
    out.grav = mutualGravity(A, B);
    out.ring = RING_D * ((A.H + B.H) / 2) / 2;
    out.gravityLock = out.grav.F > Math.max(shoveDrive(cA), shoveDrive(cB));
    if (bolt(cA) && bolt(cB)) {
      const both = !isFinite(cA.F) && !isFinite(cB.F);
      out.outcome = 'bothBolted';
      out.contact = both ? NaN : Math.max(cA.F, cB.F);
      out.tear = both ? NaN : out.contact / Math.min(groundTear(cA), groundTear(cB));
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
    const fA = footingOf(cA, mA), fB = footingOf(cB);
    const d0 = eqRadius(A) + eqRadius(B);
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
      slideA: slide(vA, fA, A), slideB: slide(vB, fB, B), Fg, gravityLock: push.stalled && Fg >= Fdrive,
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
    const Fg = K.G * A.m * B.m / (dOver * dOver);
    const pullOut = cB.anchor === 'bolted' ? Infinity : (cB.anchor === 'braced' ? (cB.groundHolds ? Infinity : cB.surface.shear * B.digArea) : 0);
    const need = B.m * K.g + Fg + pullOut;
    return { weight: B.m * K.g, Fg, pullOut, need, can: cA.F >= need * (1 - 1e-9) && !l.cantStand, cantStand: l.cantStand, margin: cA.F / need,
      groundRatio: l.groundRatio, pressure: l.pressure, qult: l.qult, dOver, bolted: cB.anchor === 'bolted' };
  }
  function throwPartner(cA, cB, theta) {
    const A = cA.body, B = cB.body;
    if (cB.anchor === 'bolted') return { bolted: true };
    const obj = { m: B.m, area: B.frontArea, Cd: B.Cd, CdSup: 1.75, rho: B.rho, L: Math.cbrt(6 * B.volume / Math.PI) };
    const r = throwObject(cA, obj, theta);
    const dOver = Math.max(0.65 * A.H + 0.1 * B.H, eqRadius(A) + eqRadius(B));
    const vEsc = Math.sqrt(2 * K.G * (A.m + B.m) / dOver);
    const rhoT = cA.surface.rho || 2000;
    return { r, obj, vEsc, fallsBack: r.canMove && r.v < vEsc && vEsc > 1, newtonDepth: obj.L * B.rho / rhoT, penetrates: B.rho / rhoT > 10 };
  }

