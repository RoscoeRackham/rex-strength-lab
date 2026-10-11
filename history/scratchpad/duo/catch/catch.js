// Reference implementation of the "Game of catch" design (Rex and Ollie).
// Uses the live engine for throwObject, pushApart, anchorCapacity, crater/quake/blast,
// and flyTo (fly + hStop + Sutton-Graves heat) from ./flyto.js.
const { flyTo, SG_K, P, K } = require('./flyto.js');

const C = {
  CATCH_STROKE: 0.3,     // x height: arm travel from full reach to the chest (ANSUR II: (81.19-25.38)/175.62 = 0.318, rounded down)
  ECC: 1.0,              // catching force cap = full strength (eccentric bonus ~1.2x in vivo ignored)
  V_FIREBALL: 0.01 * K.c,
  E_STAR: 1e6,           // J/kg: rough energy to melt or char 1 kg of an object's skin (estimate)
  AIR_COLUMN: K.p0 / K.g, // kg/m^2 of air above each square metre at sea level (10,332)
  D_MAX: Math.PI * K.R_E, // antipode, great-circle (20,015 km)
};

const heldRadius = (body, obj) => Math.max(P.eqRadius(body), 0.5 * body.H + 0.5 * (obj.L || Math.cbrt(obj.m / (obj.rho || 1000))));
const pushStartRadius = (body) => Math.max(P.eqRadius(body), 0.25 * body.H);
const selfGravityOn = (body) => K.G * body.m / Math.pow(0.5 * body.H, 2) >= 1e-3 * K.g;
const GMof = (body) => (selfGravityOn(body) ? K.G * body.m : 0);
const noseRadius = (obj) => Math.sqrt(obj.area / Math.PI);

// The partner as the ball: his body as an object (indestructible: no crush, no burn).
function partnerAsObject(body, name) {
  return { id: 'partner', name, short: name, m: body.m, area: body.frontArea, Cd: body.Cd, CdSup: 1.75, rho: body.rho, L: body.H, indestructible: true };
}

// ---------------------------------------------------------------- flight helpers
function flight(obj, v, th, h0, hStop, record) {
  return flyTo({ v0: v, thetaDeg: th, h0, hStop, m: obj.m, A: obj.area, Cd: obj.Cd, CdSup: obj.CdSup, Rn: noseRadius(obj), record });
}
// does a throw at (v, th) get at least D along the ground before coming down to the catch height?
// overshoot (orbit/escape/time-out) counts as reaching.
function reaches(f, D) {
  if (f.relativistic) return true;
  if (f.escaped || f.orbit || f.timedOut) return true;
  return f.landed && !f.belowStop && f.range >= D;
}
// lowest speed at angle th that reaches D (Infinity if even vCap falls short)
function vNeededAt(obj, D, th, h0, hStop, vCap, guess) {
  const fCap = flight(obj, vCap, th, h0, hStop);
  if (!reaches(fCap, D)) return { v: Infinity, fCap };
  let lo = 0, hi = vCap;
  if (guess && guess < vCap) {
    // bracket around the previous solution
    let a = guess / 1.3, b = Math.min(vCap, guess * 1.3);
    if (!reaches(flight(obj, a, th, h0, hStop), D) && reaches(flight(obj, b, th, h0, hStop), D)) { lo = a; hi = b; }
  }
  if (lo === 0) lo = Math.min(1e-3, vCap / 2);
  for (let i = 0; i < 60; i++) {
    const mid = Math.sqrt(lo * hi);
    if (reaches(flight(obj, mid, th, h0, hStop), D)) hi = mid; else lo = mid;
    if (hi / lo < 1 + 2e-4) break;
  }
  return { v: hi };
}
// Gentlest throw: the angle and speed that need the least launch speed (golden section on angle).
function aimEasy(obj, D, h0, hStop, vCap) {
  const key = [obj.id, obj.m, obj.area, D, h0, hStop, vCap].join('|');
  if (aimEasy.cache.has(key)) return aimEasy.cache.get(key);
  let calls = 0;
  let guess = null;
  const g = (th) => { calls++; const r = vNeededAt(obj, D, th, h0, hStop, vCap, guess); if (isFinite(r.v)) guess = r.v; return r.v; };
  // coarse scan first (robust to plateaus of Infinity), then golden section around the best
  const grid = [5, 15, 25, 35, 45, 55, 65, 75];
  let best = { th: 45, v: Infinity };
  const vals = grid.map((th) => { const v = g(th); if (v < best.v) best = { th, v }; return v; });
  if (!isFinite(best.v)) { const out = { reachable: false, calls }; aimEasy.cache.set(key, out); return out; }
  const i = grid.indexOf(best.th);
  let a = i > 0 ? grid[i - 1] : 0.5, b = i < grid.length - 1 ? grid[i + 1] : 85;
  const gr = (Math.sqrt(5) - 1) / 2;
  let c = b - gr * (b - a), d = a + gr * (b - a), gc = g(c), gd = g(d);
  for (let k = 0; k < 18 && b - a > 0.1; k++) {
    if (gc < gd) { b = d; d = c; gd = gc; c = b - gr * (b - a); gc = g(c); }
    else { a = c; c = d; gc = gd; d = a + gr * (b - a); gd = g(d); }
  }
  const th = gc < gd ? c : d;
  const v = Math.min(gc, gd, best.v === Math.min(gc, gd, best.v) ? best.v : Infinity);
  const thUse = v === best.v && best.v < Math.min(gc, gd) ? best.th : th;
  const out = { reachable: true, thetaDeg: thUse, v, calls };
  if (aimEasy.cache.size > 200) aimEasy.cache.clear();
  aimEasy.cache.set(key, out);
  return out;
}
aimEasy.cache = new Map();

// Hardest throw: full-strength speed v(th); the flattest angle whose arc comes down at D.
function aimHard(obj, D, h0, hStop, vOf) {
  const grid = [0.25, 0.5, 1, 2, 3, 5, 7.5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 89];
  let prev = 0, prevRange = 0;
  for (const th of grid) {
    const v = vOf(th);
    if (!(v > 0)) { prev = th; continue; }
    if (v >= C.V_FIREBALL) return { fireball: true, v, thetaDeg: th };
    const f = flight(obj, v, th, h0, hStop);
    if (f.escaped || f.orbit || f.timedOut) return { overshoots: true, v, thetaDeg: th, flight: f, escaped: f.escaped, orbit: f.orbit, lastRange: prevRange };
    if (f.landed && !f.belowStop && f.range >= D) {
      // bisect between prev and th
      let lo = prev, hi = th;
      for (let i = 0; i < 40; i++) {
        const mid = 0.5 * (lo + hi);
        const fm = flight(obj, vOf(mid), mid, h0, hStop);
        if (reaches(fm, D) && !(fm.escaped || fm.orbit)) hi = mid; else lo = mid;
        if (hi - lo < 1e-4) break;
      }
      return { ok: true, thetaDeg: hi, v: vOf(hi) };
    }
    prev = th; prevRange = f.landed && !f.belowStop ? f.range : 0;
  }
  return { short: true };
}

// Farthest the thrower can get it at full strength (capped below the fireball speed): golden section on angle.
function farthest(obj, h0, hStop, vOf) {
  const R = (th) => { const v = Math.min(vOf(th), C.V_FIREBALL * 0.999); if (!(v > 0)) return 0; const f = flight(obj, v, th, h0, hStop); return f.escaped || f.orbit ? Infinity : (f.landed && !f.belowStop ? f.range : 0); };
  const grid = [1, 10, 20, 30, 40, 45, 50, 60, 70, 80];
  let best = { th: 45, r: -1 };
  for (const th of grid) { const r = R(th); if (r > best.r) best = { th, r }; if (r === Infinity) return { range: Infinity, thetaDeg: th }; }
  const i = grid.indexOf(best.th);
  let a = i > 0 ? grid[i - 1] : 0.5, b = i < grid.length - 1 ? grid[i + 1] : 89;
  const gr = (Math.sqrt(5) - 1) / 2;
  let c = b - gr * (b - a), d = a + gr * (b - a), rc = R(c), rd = R(d);
  for (let k = 0; k < 16 && b - a > 0.2; k++) {
    if (rc > rd) { b = d; d = c; rd = rc; c = b - gr * (b - a); rc = R(c); }
    else { a = c; c = d; rc = rd; d = a + gr * (b - a); rd = R(d); }
  }
  const r = Math.max(rc, rd, best.r);
  return { range: r, thetaDeg: r === best.r ? best.th : (rc > rd ? c : d) };
}

// ---------------------------------------------------------------- the two gravity wells (dense partners)
// Partners as point masses; x measured from the thrower's centre toward the catcher along the line.
function wells(bT, bC, obj, D) {
  const GT = GMof(bT), GC = GMof(bC);
  const x0 = pushStartRadius(bT);
  const rHeld = heldRadius(bC, obj), stroke = C.CATCH_STROKE * bC.H;
  const rMeet = rHeld + stroke;
  const x1 = Math.max(x0, D - rMeet);
  const phi = (x) => -(GT > 0 ? GT / x : 0) - (GC > 0 ? GC / Math.max(D - x, 1e-9) : 0);
  let xs;
  if (GT > 0 && GC > 0) xs = D / (1 + Math.sqrt(GC / GT));
  else if (GT > 0) xs = x1; else xs = x0;
  xs = Math.min(x1, Math.max(x0, xs));
  const barrier = Math.max(0, phi(xs) - phi(x0));    // J/kg the ball must have at release to get over the top
  const gain = phi(x0) - phi(x1);                     // J/kg it gains (or loses) from release to his hands
  const inStroke = GC > 0 ? GC * (1 / rHeld - 1 / rMeet) : 0;   // J/kg more the catcher's pull adds during the catch
  const dBeatT = Math.sqrt(GT / K.g), dBeatC = Math.sqrt(GC / K.g);
  return { GT, GC, x0, x1, xs, rHeld, rMeet, stroke, barrier, gain, inStroke, phi, wellDominated: GT + GC > 0 && D < dBeatT + dBeatC, dBeatT, dBeatC };
}
// time along the straight line through the wells (Earth's pull ignored), speed v(x)^2 = vE^2 + 2(phi(xs) - phi(x))
function wellTime(w, vE) {
  const n = 4000;
  let t = 0;
  for (let i = 0; i < n; i++) {
    const xa = w.x0 + (w.x1 - w.x0) * i / n, xb = w.x0 + (w.x1 - w.x0) * (i + 1) / n, xm = 0.5 * (xa + xb);
    const v2 = vE * vE + 2 * (w.phi(w.xs) - w.phi(xm));
    t += (xb - xa) / Math.sqrt(Math.max(v2, 1e-12));
  }
  return t;
}

// ---------------------------------------------------------------- the catch
// v: closing speed when his hands meet it; gamma: angle below horizontal it comes in at.
function catchIt(ctxC, obj, v, gammaDeg, w) {
  const body = ctxC.body, M = body.m, m = obj.m;
  const d = C.CATCH_STROKE * body.H;
  const g = gammaDeg * Math.PI / 180;
  const gSelf = w && w.GC > 0 ? w.GC / (w.rHeld * w.rHeld) : 0;
  const holdLoad = Math.hypot(m * K.g, m * gSelf);
  const Fcap = C.ECC * ctxC.F;
  // energy the hands must take out: its kinetic energy plus what his own pull adds during the stroke
  const vEff2 = v * v + 2 * (w ? w.inStroke : 0);
  const anc = P.anchorCapacity({ body, surface: ctxC.surface, theta: g, anchor: ctxC.anchor, groundHolds: ctxC.groundHolds, mA: M, mB: m });
  const R = anc.R;
  const FA = m * vEff2 / (2 * d);
  let Fneed, slips;
  if (!(FA > R)) { Fneed = FA; slips = false; }
  else { Fneed = (vEff2 / (2 * d) + R / M) / (1 / m + 1 / M); slips = true; }
  const Fneed2 = Math.max(Fneed, holdLoad);
  const clean = Fcap >= Fneed2 * (1 - 1e-9);
  let F = clean ? Fneed : Fcap;     // he gives with it at the gentlest force that stops it in his arms
  const aC = slips || F > R ? Math.max(0, F - R) / M : 0;
  const aRel = F / m + aC;
  let tStroke, vSlam = 0;
  if (clean) tStroke = Math.sqrt(vEff2) / aRel;
  else {
    const rem = vEff2 - 2 * aRel * d;
    vSlam = rem > 0 ? Math.sqrt(rem) : 0;
    tStroke = (Math.sqrt(vEff2) - vSlam) / Math.max(aRel, 1e-30);
  }
  // momentum along the incoming line, then the pair slides off what is left (horizontal part)
  const vc = aC * tStroke;                                  // his speed at the end of the stroke
  // after a slam the object (lab speed vc + vSlam) sticks to him (perfectly inelastic)
  const uAfter = clean ? vc : (m * (vc + vSlam) + M * vc) / (m + M);
  const ancSlide = P.anchorCapacity({ body, surface: ctxC.surface, theta: 0, anchor: ctxC.anchor, groundHolds: ctxC.groundHolds, mA: M + m });
  const Rs = ancSlide.R;
  const uH = uAfter * Math.cos(g);
  const slideAfter = isFinite(Rs) && uH > 0 ? (M + m) * uH * uH / (2 * Rs) : 0;
  const slideDuring = 0.5 * aC * tStroke * tStroke * Math.cos(g);
  const contact = Math.min(2 * body.palmArea, obj.area);
  const gripRatio = obj.crush ? Math.max(F, holdLoad) / contact / obj.crush : 0;
  const sinkRatio = isFinite(anc.Nmax) ? anc.N(F) / anc.Nmax : 0;
  return {
    stroke: d, Fcap, Fneed: Fneed2, F, clean, slips, R, holdLoad, canHold: Fcap >= holdLoad,
    tStroke, decelG: F / m / K.g, vSlam, slamKmh: vSlam * 3.6,
    uAfter, slide: slideDuring + slideAfter, slideDuring, slideAfter, Rslide: Rs,
    contact, gripRatio, plateNeeded: obj.crush ? Math.max(F, holdLoad) / obj.crush : 0, sinkRatio,
    Ecatch: 0.5 * m * vEff2,
  };
}

// ---------------------------------------------------------------- heating verdict for the object
function heating(obj, fl) {
  const Qin = fl.heatLoad * obj.area;          // J, upper bound: stagnation flux over the whole frontal area
  return { heatLoad: fl.heatLoad, qMax: fl.qMax, Qin, meltFrac: obj.indestructible ? 0 : Qin / (obj.m * C.E_STAR), stagT: fl.maxStagT };
}

// ---------------------------------------------------------------- one leg: T throws to C
function leg(ctxT, ctxC, obj, D, style) {
  const bT = ctxT.body, bC = ctxC.body;
  const h0 = bT.releaseHeight, hStop = bC.releaseHeight;
  const out = { style, D, h0, hStop };
  if (P.isBlackHole(bT)) return Object.assign(out, { blackHoleThrower: true });
  if (P.isBlackHole(bC)) out.blackHoleCatcher = true;
  const w = wells(bT, bC, obj, D);
  out.wells = w;
  // thrower's full-strength release speed at angle th (before climbing out of his own well)
  const vRelease = (th) => { const r = P.throwObject(ctxT, obj, th); return r.canMove ? r.v : 0; };
  const t0 = P.throwObject(ctxT, obj, 45);
  out.canHold = t0.canHold; out.holdNeeded = t0.needed;
  if (!t0.canHold) return Object.assign(out, { cantHold: true });
  // speed left for the Earth arc after the barrier
  const vEarth = (v) => { const q = v * v - 2 * w.barrier; return q > 0 ? Math.sqrt(q) : 0; };
  const vOfE = (th) => vEarth(vRelease(th));
  let aim;
  if (style === 'easy') {
    const e = aimEasy(obj, D, h0, hStop, C.V_FIREBALL * 0.999);
    if (!e.reachable) {
      const far = farthest(obj, h0, hStop, () => C.V_FIREBALL * 0.999);
      return Object.assign(out, { unreachableAnySpeed: true, farthestAnySpeed: far });
    }
    const vL = Math.sqrt(e.v * e.v + 2 * w.barrier);
    const vMax = vRelease(e.thetaDeg);
    aim = { thetaDeg: e.thetaDeg, vE: e.v, vL, vMax, ok: vMax >= vL * (1 - 1e-6) };
    if (!aim.ok) {
      const far = farthest(obj, h0, hStop, vOfE);
      Object.assign(out, { tooWeak: true, farthest: far, needFactor: (vL / Math.max(vMax, 1e-9)) });
    }
  } else {
    const hrd = aimHard(obj, D, h0, hStop, vOfE);
    if (hrd.fireball) return Object.assign(out, { fireball: true, vL: hrd.v, thetaDeg: hrd.thetaDeg, aim: hrd });
    if (!hrd.ok) {
      const far = farthest(obj, h0, hStop, vOfE);
      return Object.assign(out, { hardFails: true, aimHard: hrd, farthest: far });
    }
    aim = { thetaDeg: hrd.thetaDeg, vE: hrd.v, vL: Math.sqrt(hrd.v * hrd.v + 2 * w.barrier), ok: true };
  }
  out.aim = aim;
  if (aim.vL >= C.V_FIREBALL) return Object.assign(out, { fireball: true });
  const fl = flight(obj, aim.vE, aim.thetaDeg, h0, hStop, true);
  out.flight = fl;
  // arrival speed at his hands
  const vArrE = fl.vImpact;
  const vMeet2 = vArrE * vArrE + 2 * (w.barrier + w.gain);
  out.vArrive = Math.sqrt(Math.max(0, vMeet2));
  out.time = w.wellDominated ? wellTime(w, aim.vE) : fl.time;
  out.heat = heating(obj, fl);
  if (!aim.ok) return out;
  out.catch = catchIt(ctxC, obj, out.vArrive, fl.impactAngleDeg, w);
  // if he misses: on to the ground
  const flMiss = flight(obj, aim.vE, aim.thetaDeg, h0, 0);
  const Eimp = 0.5 * obj.m * flMiss.vImpact * flMiss.vImpact;
  const L = obj.L || Math.cbrt(6 * obj.m / (Math.PI * (obj.rho || 1000)));
  const cr = flMiss.vImpact >= 2000 ? P.craterDiameter({ L, v: flMiss.vImpact, rhoI: obj.rho || 1000, rhoT: ctxC.surface.rho || 2000, angleDeg: flMiss.impactAngleDeg, E: Eimp }) : { D: 0 };
  out.miss = { vImpact: flMiss.vImpact, E: Eimp, crater: cr.D, quake: P.seismicMagnitude(Eimp), range: flMiss.range };
  return out;
}

function game(ctxR, ctxO, obj, D, style) {
  const a = leg(ctxR, ctxO, obj, D, style);
  const b = leg(ctxO, ctxR, obj, D, style);
  const round = a.time != null && b.time != null && a.catch && b.catch && a.catch.clean && b.catch.clean ? a.time + b.time : null;
  // can they even stay apart? (mutual pull vs each footing)
  const pull = P.mutualGravity(ctxR.body, ctxO.body, D);
  const holdR = P.anchorCapacity({ body: ctxR.body, surface: ctxR.surface, theta: 0, anchor: ctxR.anchor, groundHolds: ctxR.groundHolds }).R;
  const holdO = P.anchorCapacity({ body: ctxO.body, surface: ctxO.surface, theta: 0, anchor: ctxO.anchor, groundHolds: ctxO.groundHolds }).R;
  const together = pull.F > Math.min(holdR, holdO) ? P.fallTogether(ctxR.body, ctxO.body, D, pull.dContact) : null;
  return { a, b, round, pull, holdR, holdO, together };
}

// ---------------------------------------------------------------- relativistic pitch: what reaches the catcher
function fireballAt(obj, v, D) {
  const E = P.momentumToKE(P.vToMomentum(v, obj.m), obj.m);
  const sweep = obj.m / (K.rho0 * obj.area);   // Newton impact depth in air: path over which it meets its own mass of air
  return { E, sweep, inside: D <= sweep, overpressure: P.overpressureAt(E, Math.max(D, 1e-3)) };
}

module.exports = { C, flight, aimEasy, aimHard, farthest, wells, wellTime, catchIt, leg, game, heating, fireballAt, partnerAsObject, heldRadius, pushStartRadius, GMof, noseRadius, P, K, flyTo, SG_K };
