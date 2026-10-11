// Reference implementation v2 of the "Game of catch" (Rex and Ollie). Port to engine.js.
const { flyTo, SG_K, P, K } = require('./flyto.js');

const CATCH = {
  STROKE: 0.3,              // x height: hands give from full reach to the chest (ANSUR II men: (81.19 - 25.38) / 175.62 = 0.318, rounded down)
  ECC: 1.0,                 // catching force cap = his full strength (real muscle resists ~1.2x harder while stretched; left out)
  V_FIREBALL: 0.01 * K.c,   // project convention: above this the object never lands as an object
  E_STAR: 1e6,              // J/kg to melt or char 1 kg of skin (iron 0.93, aluminium 0.98, copper 0.62 MJ/kg from handbook data)
  AIR_COLUMN: K.p0 / K.g,   // 10,332 kg of air over each square metre at sea level
  D_MAX: Math.PI * K.R_E,   // other side of the planet, along the surface: 20,015 km
  SG_P_MAX: Math.sqrt(100 * 101325 / K.rho0), // speed at which sea-level stagnation pressure passes 100 atm (top of the fit): 2,876 m/s
  V_RAD: 11000,             // lunar-return speed: shock-layer radiation (left out) stops being negligible
  BASEBALL_SAFE_N: 40000,   // Adair (1995): a home-run hit squeezes a baseball with ~40,000 N; it survives
};
const MATERIALS = {
  steel: { label: 'steel', tC: 1538, verb: 'melt', src: 'iron melts at 1,538 °C' },
  aluminium: { label: 'aluminium', tC: 660, verb: 'melt', src: 'aluminium melts at 660 °C' },
  copper: { label: 'copper', tC: 1085, verb: 'melt', src: 'copper melts at 1,085 °C' },
  organic: { label: 'wood, leather or plastic', tC: 300, verb: 'char', src: 'wood chars from about 300 °C' },
  stone: { label: 'limestone', tC: 825, verb: 'break down', src: 'limestone breaks down to quicklime above 825 °C' },
};
const OBJ_MATERIAL = {
  baseball: 'organic', shot: 'steel', bowling: 'organic', piano: 'organic', motorcycle: 'steel', car: 'steel', pickup: 'steel',
  bus: 'steel', semi: 'steel', tank: 'steel', loco: 'steel', cc177: 'aluminium', b777: 'aluminium', shuttle: 'aluminium',
  liberty: 'copper', eiffel: 'steel', titanic: 'steel', nimitz: 'steel', esb: 'stone', pyramid: 'stone', bar511: 'steel',
  backlift: 'steel', desoto: 'steel', ruyi: 'steel',
};

const heldRadius = (body, obj) => Math.max(P.eqRadius(body), 0.5 * body.H + 0.5 * (obj.L || Math.cbrt(obj.m / (obj.rho || 1000))));
const pushStartRadius = (body) => Math.max(P.eqRadius(body), 0.25 * body.H);
const selfGravityOn = (body) => K.G * body.m / Math.pow(0.5 * body.H, 2) >= 1e-3 * K.g;
const GMof = (body) => (selfGravityOn(body) ? K.G * body.m : 0);
const noseRadius = (obj) => Math.sqrt(obj.area / Math.PI);

function partnerAsObject(body, name) {
  return { id: 'partner', name, short: name, m: body.m, area: body.frontArea, Cd: body.Cd, CdSup: 1.75, rho: body.rho, L: body.H, indestructible: true };
}

function flight(obj, v, th, h0, hStop, record) {
  return flyTo({ v0: v, thetaDeg: th, h0, hStop, m: obj.m, A: obj.area, Cd: obj.Cd, CdSup: obj.CdSup, Rn: noseRadius(obj), record });
}
const overshoot = (f) => f.escaped || f.orbit || f.timedOut;
function reaches(f, D) { return f.relativistic || overshoot(f) || (f.landed && !f.belowStop && f.range >= D); }

// ---------------------------------------------------------------- aiming
function vNeededAt(obj, D, th, h0, hStop, vCap, guess) {
  if (!reaches(flight(obj, vCap, th, h0, hStop), D)) return Infinity;
  let lo = Math.min(1e-3, vCap / 2), hi = vCap;
  if (guess && guess < vCap) {
    const a = guess / 1.25, b = Math.min(vCap, guess * 1.25);
    if (!reaches(flight(obj, a, th, h0, hStop), D) && reaches(flight(obj, b, th, h0, hStop), D)) { lo = a; hi = b; }
  }
  for (let i = 0; i < 80 && hi / lo > 1 + 2e-4; i++) {
    const mid = Math.sqrt(lo * hi);
    if (reaches(flight(obj, mid, th, h0, hStop), D)) hi = mid; else lo = mid;
  }
  return hi;
}
const easyCache = new Map();
// Gentlest throw: least launch speed over angles (scan, then golden section). Independent of strength: cached.
function aimEasy(obj, D, h0, hStop) {
  const vCap = CATCH.V_FIREBALL * 0.999;
  const key = [obj.id, obj.m, obj.area, obj.Cd, obj.CdSup, D, h0, hStop].join('|');
  if (easyCache.has(key)) return easyCache.get(key);
  let guess = null;
  const g = (th) => { const v = vNeededAt(obj, D, th, h0, hStop, vCap, guess); if (isFinite(v)) guess = v; return v; };
  const grid = [5, 15, 25, 35, 45, 55, 65, 75];
  let bi = -1, bv = Infinity;
  grid.forEach((th, i) => { const v = g(th); if (v < bv) { bv = v; bi = i; } });
  let out;
  if (bi < 0) out = { reachable: false };
  else {
    let a = bi > 0 ? grid[bi - 1] : 0.5, b = bi < grid.length - 1 ? grid[bi + 1] : 85;
    const gr = (Math.sqrt(5) - 1) / 2;
    let c = b - gr * (b - a), d = a + gr * (b - a), gc = g(c), gd = g(d);
    while (b - a > 0.1) {
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
function aimHard(obj, D, h0, hStop, vOf) {
  const fx = (th) => flyTo({ v0: vOf(th), thetaDeg: th, h0, hStop: 0, xStop: D, m: obj.m, A: obj.area, Cd: obj.Cd, CdSup: obj.CdSup, Rn: noseRadius(obj) });
  const ok = (f) => f.crossedX && f.hAtX >= hStop;
  const grid = [-80, -60, -45, -30, -20, -10, -5, -2, -1, -0.5, 0, 0.25, 0.5, 1, 2, 3, 5, 7.5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 89];
  let prev = null;
  for (const th of grid) {
    const v = vOf(th);
    if (v >= CATCH.V_FIREBALL) return { fireball: true, v, thetaDeg: 0 };
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
// Full-strength release speed vs angle: 13 throws, then linear interpolation (speed varies smoothly with angle).
function releaseTable(ctxT, obj) {
  const ths = [0, 7.5, 15, 22.5, 30, 37.5, 45, 52.5, 60, 67.5, 75, 82.5, 90];
  const rs = ths.map((th) => P.throwObject(ctxT, obj, th));
  const vs = rs.map((r) => (r.canMove ? r.v : 0));
  const E0 = rs[0].canMove ? rs[0].Eobj : 0;
  const vOf = (th) => { const x = Math.min(90, Math.max(0, th)) / 7.5, i = Math.min(11, Math.floor(x)), t = x - i; return vs[i] * (1 - t) + vs[i + 1] * t; };
  return { vOf, ths, vs, at45: rs[6], E0, r0: rs[0] };
}

// ---------------------------------------------------------------- gravity wells of dense partners
function wells(bT, bC, obj, D) {
  const GT = GMof(bT), GC = GMof(bC);
  const x0 = pushStartRadius(bT);
  const rHeld = heldRadius(bC, obj), stroke = CATCH.STROKE * bC.H, rMeet = rHeld + stroke;
  const x1 = Math.max(x0, D - rMeet);
  const phi = (x) => -(GT > 0 ? GT / x : 0) - (GC > 0 ? GC / Math.max(D - x, 1e-9) : 0);
  let xs = GT > 0 && GC > 0 ? D / (1 + Math.sqrt(GC / GT)) : (GT > 0 ? x1 : x0);
  xs = Math.min(x1, Math.max(x0, xs));
  const dBeatT = Math.sqrt(GT / K.g), dBeatC = Math.sqrt(GC / K.g);
  return {
    GT, GC, x0, x1, xs, rHeld, rMeet, stroke, phi, dBeatT, dBeatC,
    barrier: Math.max(0, phi(xs) - phi(x0)),       // J/kg needed at release to get over the top
    gain: phi(x0) - phi(x1),                       // J/kg gained from release to where his hands meet it
    inStroke: GC > 0 ? GC * (1 / rHeld - 1 / rMeet) : 0, // J/kg his pull adds while he brings it in
    wellDominated: GT + GC > 0 && D < dBeatT + dBeatC,
  };
}
// Straight line between them (their pull beats Earth's all the way): time and nose heat. Drag left out.
function wellPath(w, obj, vE) {
  const n = 4000, Rn = noseRadius(obj);
  let t = 0, v2int = 0, vmax = 0;
  for (let i = 0; i < n; i++) {
    const xa = w.x0 + (w.x1 - w.x0) * i / n, xb = w.x0 + (w.x1 - w.x0) * (i + 1) / n, xm = 0.5 * (xa + xb);
    const v2 = Math.max(vE * vE + 2 * (w.phi(w.xs) - w.phi(xm)), 1e-12);
    t += (xb - xa) / Math.sqrt(v2);
    v2int += v2 * (xb - xa);
    vmax = Math.max(vmax, Math.sqrt(v2));
  }
  return { time: t, heatLoad: SG_K * Math.sqrt(K.rho0 / Rn) * v2int, vmax, length: w.x1 - w.x0 };
}

// ---------------------------------------------------------------- the catch itself
// v: speed when his hands meet it; gammaDeg: how steeply it comes down (0 = level).
function catchIt(ctxC, obj, v, gammaDeg, w) {
  const body = ctxC.body, M = body.m, m = obj.m;
  const d = CATCH.STROKE * body.H;
  const gm = gammaDeg * Math.PI / 180;
  const gSelf = w && w.GC > 0 ? w.GC / (w.rHeld * w.rHeld) : 0;
  const holdLoad = Math.hypot(m * K.g, m * gSelf);
  const Fcap = CATCH.ECC * ctxC.F;
  const vEff2 = v * v + 2 * (w ? w.inStroke : 0);
  const anc = P.anchorCapacity({ body, surface: ctxC.surface, theta: gm, anchor: ctxC.anchor, groundHolds: ctxC.groundHolds, mA: M, mB: m });
  const R = anc.R;
  const FA = m * vEff2 / (2 * d);                 // footing holds: all the stopping is done by the hands over d
  let Fneed, slips;
  if (!(FA > R)) { Fneed = FA; slips = false; }
  else { Fneed = (vEff2 / (2 * d) + R / M) / (1 / m + 1 / M); slips = true; }   // he slides while he stops it
  const need = Math.max(Fneed, holdLoad);
  const clean = Fcap >= need * (1 - 1e-9);
  const F = clean ? Fneed : Fcap;
  const aC = F > R ? (F - R) / M : 0;
  const aRel = F / m + aC;
  let tStroke, vSlam = 0;
  if (clean) tStroke = Math.sqrt(vEff2) / aRel;
  else { const rem = vEff2 - 2 * aRel * d; vSlam = rem > 0 ? Math.sqrt(rem) : 0; tStroke = (Math.sqrt(vEff2) - vSlam) / Math.max(aRel, 1e-300); }
  const vc = aC * tStroke;
  const uAfter = clean ? vc : (m * (vc + vSlam) + M * vc) / (m + M);
  const Rs = P.anchorCapacity({ body, surface: ctxC.surface, theta: 0, anchor: ctxC.anchor, groundHolds: ctxC.groundHolds, mA: M + m }).R;
  const uH = uAfter * Math.cos(gm);
  // the pair coasts to a stop against friction and air drag: (M+m) v dv/dx = -Rs - 1/2 rho Cd A v^2
  const kAir = 0.5 * K.rho0 * Math.max(body.Cd * body.frontArea, (obj.CdSup || 1) * obj.area);
  const slideAfter = !isFinite(Rs) || !(uH > 0) ? 0 : (kAir > 0 ? (M + m) / (2 * kAir) * Math.log1p(kAir * uH * uH / Rs) : (M + m) * uH * uH / (2 * Rs));
  const slideDuring = 0.5 * aC * tStroke * tStroke * Math.cos(gm);
  const contact = Math.min(2 * body.palmArea, obj.area);
  const Fhand = Math.max(F, holdLoad);
  return {
    stroke: d, Fcap, Fneed: need, F, clean, slips, R, holdLoad, canHold: Fcap >= holdLoad * (1 - 1e-9),
    tStroke, decelG: F / m / K.g, vSlam,
    uAfter, slide: slideDuring + slideAfter,
    contact, gripRatio: obj.crush ? Fhand / contact / obj.crush : 0, plateNeeded: obj.crush ? Fhand / obj.crush : 0,
    baseballRatio: obj.id === 'baseball' ? Fhand / CATCH.BASEBALL_SAFE_N : 0,
    sinkRatio: isFinite(anc.Nmax) ? anc.N(F) / anc.Nmax : 0,
    Ecatch: 0.5 * m * vEff2,
  };
}

// ---------------------------------------------------------------- what the air does to the object
function heatVerdict(obj, heatLoad, stagT, vMaxAir) {
  if (obj.indestructible) return { kind: 'immune', heatLoad, stagT };
  const mat = MATERIALS[obj.material || OBJ_MATERIAL[obj.id] || 'steel'];
  const noseC = stagT - 273.15;
  const frac = heatLoad * obj.area / (obj.m * CATCH.E_STAR);
  let kind;
  if (noseC < mat.tC) kind = 'warm';
  else if (frac < 0.01) kind = 'skin';
  else if (frac < 0.5) kind = 'loses';
  else kind = 'destroyed';
  return { kind, mat, noseC, frac, heatLoad, stagT, extrapolated: vMaxAir > CATCH.SG_P_MAX, radiation: vMaxAir > CATCH.V_RAD };
}

// ---------------------------------------------------------------- relativistic pitch (1% of light speed and up)
// Snowplow: the object keeps its momentum while it scoops up air; once it has met its own mass of air
// (Newton's impact depth, m / (rho A)) most of its energy has gone into the air as a fireball.
function fireballAt(obj, v, D, ctxC, Eknown) {
  const m = obj.m, E = Eknown != null ? Eknown : P.momentumToKE(P.vToMomentum(v, m), m);
  const p = isFinite(E) ? P.vToMomentum(v, m) : Infinity;
  const sweep = m / (K.rho0 * obj.area);
  const x = D / sweep;
  const kind = x < 0.01 ? 'arrives' : (x < 1 ? 'plasma' : 'before');
  const Earr = isFinite(E) ? E / (1 + x) : Infinity;   // energy still moving with it when it reaches him
  const out = { E, p, sweep, kind, Earr, Eair: isFinite(E) ? E - Earr : Infinity };
  if (kind === 'before') { const r = Math.max(D - sweep, ctxC.body.H); out.rBlast = r; out.overpressure = isFinite(E) ? P.overpressureAt(E, r) : Infinity; }
  if (kind === 'arrives') {
    const body = ctxC.body, d = CATCH.STROKE * body.H;
    const Fneed = Earr / d;
    const Fcap = CATCH.ECC * ctxC.F;
    out.catch = { Fneed, Fcap, clean: Fcap >= Fneed && isFinite(Fneed), undefinedInf: !isFinite(Fneed) && !isFinite(Fcap), recoilV: ctxC.anchor === 'bolted' ? 0 : P.momentumToV(p, body.m + m), earthRecoilV: ctxC.anchor === 'bolted' ? p / K.M_E : 0, stroke: d };
  }
  return out;
}

// ---------------------------------------------------------------- one throw: T to C
function leg(ctxT, ctxC, obj, D, style) {
  const bT = ctxT.body, bC = ctxC.body;
  const h0 = bT.releaseHeight, hStop = bC.releaseHeight;
  const out = { style, D, h0, hStop };
  if (P.isBlackHole(bT)) return Object.assign(out, { result: 'thrower-black-hole' });
  const w = wells(bT, bC, obj, D);
  out.wells = w;
  const tab = releaseTable(ctxT, obj);
  out.holdNeeded = tab.at45.needed;
  if (!tab.at45.canHold) return Object.assign(out, { result: 'cant-hold' });
  const vOfE = (th) => { const v = tab.vOf(th); const q = v * v - 2 * w.barrier; return q > 0 ? Math.sqrt(q) : 0; };
  let vE, vL, th, vMax;
  if (w.wellDominated) {
    // aimed straight at him: the wells, not Earth, shape the path
    th = 0; vMax = tab.vOf(0);
    if (style === 'easy') { vE = Math.sqrt(K.g * D); vL = Math.sqrt(vE * vE + 2 * w.barrier); }
    else { vL = vMax; vE = vOfE(0); }
    if (vL >= CATCH.V_FIREBALL) return Object.assign(out, { result: 'fireball', vL, fireball: fireballAt(obj, vL, D, ctxC, style === 'hard' ? tab.E0 : null) });
    if (vL > vMax * (1 + 1e-9) || !(vE > 0)) return Object.assign(out, { result: 'falls-back', vL, vMax, escapeNeeded: Math.sqrt(2 * w.barrier) });
    const path = wellPath(w, obj, vE);
    out.aim = { thetaDeg: 0, vE, vL, vMax };
    out.time = path.time;
    out.vArrive = Math.sqrt(Math.max(0, vE * vE + 2 * (w.barrier + w.gain)));
    out.angleDeg = 0;
    out.heat = heatVerdict(obj, path.heatLoad, P.stagnationT(Math.min(path.vmax, CATCH.V_FIREBALL)), path.vmax);
    out.dragIgnored = path.length > 0.2 * (2 * obj.m / (K.rho0 * obj.CdSup * obj.area));
  } else {
    if (style === 'easy') {
      const e = aimEasy(obj, D, h0, hStop);
      if (!e.reachable) return Object.assign(out, { result: 'unreachable', farthestAny: farthest(obj, h0, hStop, () => CATCH.V_FIREBALL * 0.999) });
      th = e.thetaDeg; vE = e.v; vL = Math.sqrt(vE * vE + 2 * w.barrier); vMax = tab.vOf(th);
      if (vL > vMax * (1 + 1e-6)) {
        // too weak for the gentlest arc; a steeper or flatter full-strength throw may still get there
        const far = farthest(obj, h0, hStop, vOfE);
        if (!(far.range >= D)) return Object.assign(out, { result: 'too-weak', farthest: far, needFactor: vL / Math.max(vMax, 1e-12), easyNeed: { thetaDeg: th, vL, vE } , heat: (() => { const f0 = flight(obj, vE, th, h0, hStop); return heatVerdict(obj, f0.heatLoad, f0.maxStagT, f0.maxMach * K.a0); })() });
        const hd = aimHard(obj, D, h0, hStop, vOfE);
        if (!hd.ok) return Object.assign(out, { result: 'too-weak', farthest: far });
        out.fullStrength = true;
        style = 'hard';
        th = hd.thetaDeg; vE = hd.v; vL = tab.vOf(th); vMax = vL;
      }
    } else {
      const hd = aimHard(obj, D, h0, hStop, vOfE);
      if (hd.fireball) { const v = tab.vOf(0); return Object.assign(out, { result: 'fireball', vL: v, fireball: fireballAt(obj, v, D, ctxC, tab.E0) }); }
      if (hd.overshoots) return Object.assign(out, { result: 'overshoots', escaped: hd.escaped, orbit: hd.orbit, thetaDeg: hd.thetaDeg, vL: tab.vOf(hd.thetaDeg), farthest: farthest(obj, h0, hStop, vOfE) });
      if (!hd.ok) return Object.assign(out, { result: 'too-weak', farthest: farthest(obj, h0, hStop, vOfE), vMax: tab.vOf(45) });
      th = hd.thetaDeg; vE = hd.v; vL = tab.vOf(th); vMax = vL;
    }
    const fl = style === 'easy' ? flight(obj, vE, th, h0, hStop, true)
      : flyTo({ v0: vE, thetaDeg: th, h0, hStop: 0, xStop: D, m: obj.m, A: obj.area, Cd: obj.Cd, CdSup: obj.CdSup, Rn: noseRadius(obj), record: true });
    if (style !== 'easy') { fl.vImpact = fl.inSpaceAtX ? fl.vImpact : fl.vAtX; fl.impactAngleDeg = Math.max(0, fl.angleAtXDeg); }
    out.flight = fl;
    out.aim = { thetaDeg: th, vE, vL, vMax };
    out.time = fl.time;
    out.vArrive = Math.sqrt(Math.max(0, fl.vImpact * fl.vImpact + 2 * (w.barrier + w.gain)));
    out.angleDeg = fl.impactAngleDeg;
    out.heat = heatVerdict(obj, fl.heatLoad, fl.maxStagT, fl.maxMach * K.a0);
  }
  out.catch = catchIt(ctxC, obj, out.vArrive, out.angleDeg, w);
  out.result = out.catch.clean ? 'caught' : (out.catch.canHold ? 'slams' : 'cant-hold-it');
  // if he misses: on to the ground beside him
  if (!w.wellDominated) {
    const fm = flight(obj, vE, th, h0, 0);
    const Eimp = P.keFromV(fm.vImpact, obj.m);
    const L = obj.L || Math.cbrt(6 * obj.m / (Math.PI * (obj.rho || 1000)));
    const cr = fm.vImpact >= 2000 ? P.craterDiameter({ L, v: fm.vImpact, rhoI: obj.rho || 1000, rhoT: ctxC.surface.rho || 2000, angleDeg: fm.impactAngleDeg, E: Eimp }) : { D: 0 };
    out.miss = { vImpact: fm.vImpact, E: Eimp, crater: cr.D, craterExtrapolated: !!cr.extrapolated, quake: P.seismicMagnitude(Eimp), past: fm.range - D };
  }
  return out;
}

// ---------------------------------------------------------------- the partner as the ball: straight up and back
function tossPartner(ctxT, bP, name, style, hTarget) {
  const obj = partnerAsObject(bP, name);
  const h0 = ctxT.body.releaseHeight;
  const t = P.throwObject(ctxT, obj, 90);
  const out = { obj, holdNeeded: t.needed };
  if (!t.canHold) return Object.assign(out, { result: 'cant-hold' });
  const vMax = t.canMove ? t.v : 0;
  let v;
  if (style === 'easy') {
    const apex = (vv) => { const f = flight(obj, vv, 90, h0, h0); return overshoot(f) ? Infinity : f.apex; };
    let lo = 1e-3, hi = CATCH.V_FIREBALL * 0.999;
    if (apex(hi) < hTarget) return Object.assign(out, { result: 'unreachable' });
    for (let i = 0; i < 80 && hi / lo > 1 + 1e-5; i++) { const mid = Math.sqrt(lo * hi); if (apex(mid) >= hTarget) hi = mid; else lo = mid; }
    v = hi;
    if (v > vMax * (1 + 1e-6)) return Object.assign(out, { result: 'too-weak', v, vMax });
  } else v = vMax;
  if (v >= CATCH.V_FIREBALL) return Object.assign(out, { result: 'fireball', v });
  const fl = flight(obj, v, 90, h0, h0);
  out.v = v; out.flight = fl;
  if (overshoot(fl)) return Object.assign(out, { result: fl.escaped ? 'escapes' : 'orbit' });
  out.catch = catchIt(ctxT, obj, fl.vImpact, 90, null);
  out.result = out.catch.clean ? 'caught' : 'slams';
  return out;
}

function game(ctxR, ctxO, obj, D, style) {
  const a = leg(ctxR, ctxO, obj, D, style);
  const b = leg(ctxO, ctxR, obj, D, style);
  const pull = P.mutualGravity(ctxR.body, ctxO.body, D);
  const holdR = P.anchorCapacity({ body: ctxR.body, surface: ctxR.surface, theta: 0, anchor: ctxR.anchor, groundHolds: ctxR.groundHolds }).R;
  const holdO = P.anchorCapacity({ body: ctxO.body, surface: ctxO.surface, theta: 0, anchor: ctxO.anchor, groundHolds: ctxO.groundHolds }).R;
  const together = pull.F > Math.min(holdR, holdO) ? P.fallTogether(ctxR.body, ctxO.body, D, pull.dContact) : null;
  const round = a.result === 'caught' && b.result === 'caught' ? a.time + b.time + a.catch.tStroke + b.catch.tStroke : null;
  return { a, b, round, pull, holdR, holdO, together };
}

module.exports = { CATCH, MATERIALS, OBJ_MATERIAL, flight, aimEasy, aimHard, farthest, releaseTable, wells, wellPath, catchIt, heatVerdict, fireballAt, leg, tossPartner, game, partnerAsObject, heldRadius, pushStartRadius, GMof, noseRadius, P, K, flyTo, SG_K };
