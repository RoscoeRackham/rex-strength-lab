// Prototype: unstoppable force vs immovable object (Rex vs Ollie). Port into engine.js.
global.window = global.window || {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
const K = P.K, c = K.c;
const COL = {
  SQUASH: 0.25,        // estimate: each body squashes by a quarter of its depth at the soft (plush) end
  V_SOUND_MAX: 36100,  // m/s, Trachenko et al. 2020 upper bound on sound speed in condensed matter
  ROCK_T: 8.38e6,      // Pa, granite quasi-static Brazilian tensile strength (Padmanabha et al. 2021)
  ROCK_C: 2.0e8,       // Pa, granite UCS (existing fact ground_granite_ucs)
  CRUST: 41.1e3,       // m, weighted mean continental crust thickness (Christensen & Mooney 1995)
  I_FACTOR: 0.3308,    // Earth's I/(M R^2), NASA Earth fact sheet
  T_SID: 23.9345 * 3600, // s, sidereal rotation period, NASA
  RUNUP: 10,           // start distance, body heights (estimate)
  M_RESHAPE: 1e-3 * K.M_E,
  ROCK_FAIL_SIGMA: 1.7e9, // density design's deep-rock strength (fall-through gate)
};
const HEMI = (G, M, R) => 3 * G * M * M / (16 * R * R); // pull between two halves of a uniform sphere
const F_HALVES = HEMI(K.G, K.M_E, K.R_E);

const depth = (b) => 2 * P.eqRadius(b);
const same = (a, b) => a === b || (isFinite(a) && isFinite(b) && Math.abs(a - b) <= 1e-9 * Math.max(Math.abs(a), Math.abs(b), 1e-300));
const canStand = (cx) => !isFinite(cx.F) || P.MUSCLE.jump.forceFrac * cx.F >= cx.body.m * K.g;
const fallsThrough = (cx) => !cx.groundHolds && cx.body.m * K.g > COL.ROCK_FAIL_SIGMA * cx.body.topArea;

// ---- momentum and energy of a head-on hit: body A (momentum p) into body T at rest (mass mT, may be Infinity)
function hit(p, mA, mT) {
  const out = { p, mA, mT };
  if (!(p > 0)) return Object.assign(out, { none: true, Q: 0, V: 0, pStar: 0, KA: 0, el: { pA: 0, pT: 0, vA: 0, vT: 0 }, inel: { V: 0, pT: 0 } });
  if (!isFinite(p) && !isFinite(mT)) return Object.assign(out, { undefinedResult: true, Q: NaN, KA: Infinity });
  const KA = P.momentumToKE(p, mA);
  out.KA = KA;
  if (!isFinite(mT)) { // truly immovable: infinite inertia
    return Object.assign(out, { Q: KA, pStar: p, Mstar: Infinity,
      inel: { V: 0, pT: p, KE: 0 }, el: { pA: -p, pT: 2 * p, vA: -P.momentumToV(p, mA), vT: 0, KA: KA, KT: 0 } });
  }
  if (!isFinite(p)) { // infinite momentum into a finite mass
    // ultra-relativistic elastic limit: charger's final rapidity -> ln(mA/mT)
    const wA = Math.log(mA / mT);
    return Object.assign(out, { Q: Infinity, pStar: Infinity, Mstar: Infinity,
      inel: { V: c, pT: Infinity, KE: Infinity },
      el: { pA: mA * c * Math.sinh(wA), pT: Infinity, vA: c * Math.tanh(wA), vT: c, KA: 2 * mA * c * c * Math.sinh(wA / 2) ** 2, KT: Infinity } });
  }
  const EA = Math.sqrt((mA * c * c) ** 2 + (p * c) ** 2);       // J
  const Ms = Math.sqrt(mA * mA + mT * mT + 2 * mT * EA / (c * c)); // invariant mass, kg
  const Q = 2 * mT * KA / (Ms + mA + mT);                          // energy freed in a perfectly inelastic hit, J
  const pStar = p * mT / Ms;                                        // each body's momentum in the centre-of-momentum frame
  const V = P.momentumToV(p, Ms);
  const inel = { V, pT: p, KE: P.momentumToKE(p, Ms) };
  let el;
  if (p / (mA * c) < 1e-6) {
    const v = p / mA, M = mA + mT;
    const vA = (mA - mT) / M * v, vT = 2 * mA / M * v;
    el = { vA, vT, pA: mA * vA, pT: mT * vT, KA: 0.5 * mA * vA * vA, KT: 0.5 * mT * vT * vT };
  } else {
    const wA = Math.asinh(p / (mA * c));
    const Etot = EA + mT * c * c;
    const bcm = p * c / Etot;   // speed of the centre of momentum, as a fraction of c
    const wcm = bcm < 0.5 ? Math.atanh(bcm) : Math.log((Etot + p * c) / (Ms * c * c));
    const wA2 = 2 * wcm - wA, wT2 = 2 * wcm;
    el = { vA: c * Math.tanh(wA2), vT: c * Math.tanh(wT2), pA: mA * c * Math.sinh(wA2), pT: mT * c * Math.sinh(wT2),
      KA: 2 * mA * c * c * Math.sinh(wA2 / 2) ** 2, KT: 2 * mT * c * c * Math.sinh(wT2 / 2) ** 2 };
  }
  return Object.assign(out, { Q, pStar, Mstar: Ms, inel, el });
}

// Newtonian hit with both bodies moving (gravity-assisted approach): CM speed u, closing speed w.
function hitCM(mA, mB, u, w) {
  const M = mA + mB, mu = mA * mB / M;
  return { Q: 0.5 * mu * w * w, pStar: mu * w, KA: 0.5 * mu * w * w,
    inel: { V: u, pT: mB * u, KE: 0.5 * M * u * u },
    el: { vA: u - mB / M * w, vT: u + mA / M * w, pA: mA * (u - mB / M * w), pT: mB * (u + mA / M * w) } };
}

// contact force and time, three stiffness levels
function contact(h, bA, bB, mA) {
  const LA = depth(bA), LB = depth(bB), Lmin = Math.min(LA, LB);
  const s = 2 * COL.SQUASH * Lmin;        // each body squashes a quarter of the smaller body's depth
  const Q = h.Q, ps = h.pStar;
  if (!isFinite(Q) || !isFinite(ps)) return { s, soft: { F: Infinity, t: 0 }, softEl: { F: Infinity, t: 0 }, matter: { F: Infinity, t: Lmin / COL.V_SOUND_MAX }, light: { F: Infinity, t: 0 } };
  if (!(Q > 0)) return { s, soft: { F: 0, t: 0 }, softEl: { F: 0, t: 0 }, matter: { F: 0, t: 0 }, light: { F: 0, t: 0 } };
  const gb = ps / (mA * c), gam = Math.sqrt(1 + gb * gb), beta = gb / gam;   // charger in the CM frame
  const tLight = Lmin / (gam * c * (1 + beta));
  const tMatter = Lmin / COL.V_SOUND_MAX;
  return {
    s, LA, LB, Lmin,
    soft: { F: Q / s, t: ps * s / Q },                         // plush splat: constant crush force over stroke s
    softEl: { F: 2 * Q / s, t: 0.5 * Math.PI * ps * s / Q },    // plush perfect bounce: linear spring, peak force
    matter: { F: ps / tMatter, t: tMatter, supersonic: h.vRel > COL.V_SOUND_MAX },
    light: { F: ps / tLight, t: tLight },                       // hard ceiling: no signal faster than light
  };
}

// rock around an anchor that carries force C into the planet
function rockLoad(C, cHold, dSep) {
  if (!(C > 0)) return { C: 0, rT: 0, rC: 0, crackThrough: false, beyondCrust: false, planet: false, tear: 0 };
  const rT = Math.sqrt(C / (2 * Math.PI * COL.ROCK_T));
  const rC = Math.sqrt(C / (2 * Math.PI * COL.ROCK_C));
  const tearCap = cHold.groundHolds ? Infinity : cHold.surface.shear * cHold.body.digArea;
  return { C, rT, rC, crackThrough: rT >= dSep / 2, beyondCrust: rT > COL.CRUST, planet: C >= F_HALVES, tear: C / tearCap, tearCap };
}

function slide(m, v, R, A) {
  if (!(v > 0)) return 0;
  if (v >= 0.01 * c) return NaN; // relativistic: no slide model
  if (!(R > 0)) return Infinity;
  const k = 0.5 * K.rho0 * 1.0 * A;
  return m / (2 * k) * Math.log1p(k * v * v / R);
}

// holder's hold against a horizontal push or blow
function holdOf(cB, horiz) {
  const b = cB.body;
  const anc = P.anchorCapacity({ body: b, surface: cB.surface, theta: 0, anchor: cB.anchor === 'bolted' ? 'friction' : cB.anchor, groundHolds: cB.groundHolds, mA: b.m });
  if (cB.immovable) return { H: Infinity, R: Infinity, anc, why: 'immovable' };
  if (cB.anchor === 'bolted') return { H: Infinity, R: Infinity, anc, why: 'bolted' };
  if (horiz) {
    const stand = canStand(cB);
    const H = stand ? Math.min(cB.F, anc.R) : anc.R;
    return { H, R: anc.R, anc, why: !stand ? 'lying' : (cB.F < anc.R ? 'strength' : 'footing'), stand };
  }
  const H = cB.groundHolds ? Infinity : Math.max(0, anc.Nmax - b.m * K.g);
  return { H, R: H, anc, why: cB.groundHolds ? 'comicGround' : 'bearing' };
}

// ---- static reading: A pushes with everything, B braces
function standoff(cA, cB) {
  if (P.isBlackHole(cA.body) || P.isBlackHole(cB.body)) return { blackHole: true };
  const ancA = P.anchorCapacity({ body: cA.body, surface: cA.surface, theta: 0, anchor: cA.anchor, groundHolds: cA.groundHolds, mA: cA.body.m });
  const RA = cA.anchor === 'bolted' ? Infinity : ancA.R;
  const DA = Math.min(cA.F, RA);
  const hb = holdOf(cB, true);
  const HB = hb.H;
  const dSep = 0.5 * (cA.body.H + cB.body.H);
  const grav = P.mutualGravity(cA.body, cB.body);
  const out = { DA, RA, FA: cA.F, HB, holdWhy: hb.why, dSep, grav, pusherSlips: cA.F > RA };
  if (!isFinite(DA) && !isFinite(HB)) {
    out.outcome = cB.groundHolds && cA.groundHolds ? 'paradox' : 'rockGives';
    out.contact = NaN;
    return out;
  }
  if (same(DA, HB)) { out.outcome = 'stalemate'; out.contact = DA; }
  else if (DA > HB) { out.outcome = 'forceWins'; out.contact = HB; out.net = DA - HB; }
  else { out.outcome = 'objectHolds'; out.contact = DA; }
  if (cB.anchor === 'bolted' && isFinite(out.contact)) out.rock = cB.groundHolds ? { comic: true, C: out.contact } : rockLoad(out.contact, cB, dSep);
  return out;
}

// ---- collision reading
function chargeSpeed(cA, source, setV) {
  if (source === 'set') return { v: setV, dir: 'h' };
  if (source === 'sprint') {
    const s = P.sprint(cA);
    if (s.cantStand || !(s.vTop > 0)) return { v: 0, dir: 'h', why: 'cantSprint', run: s };
    // proper speed (gamma v) at top speed: the sprint's drag balance read relativistically (engine: return s.uTop)
    const b = cA.body, W = b.m * K.g;
    const uDrag = Math.sqrt(2 * s.thrust / (K.rho0 * b.Cd * b.frontArea));
    const Fcal = P.CAL_LIFT_KG * K.g - 180 * K.g;
    const ratio = isFinite(cA.F) ? Math.max(0, (cA.F - W) / Fcal) * (180 / b.m) * b.s : Infinity;
    let uLeg = P.MUSCLE.run.atCal * Math.sqrt(ratio);
    if (cA.mode === 'real') uLeg = Math.min(uLeg, P.MUSCLE.run.cap * b.s);
    const u = Math.min(uDrag, uLeg);
    return { v: s.vTop, u, dir: 'h', run: s };
  }
  if (source === 'jump') {
    const j = P.jump(cA), f = j.flight;
    if (!(j.v > 0)) return { v: 0, dir: 'v', why: 'cantJump', jump: j };
    if (j.relativistic || f.relativistic || f.escaped || f.orbit || f.timedOut || !f.landed) return { v: 0, dir: 'v', why: 'neverLands', jump: j };
    return { v: f.vImpact, dir: 'v', jump: j, apex: f.apex };
  }
  if (source === 'stomp') {
    const st = P.stomp(cA), f = st.bodyFlight;
    if (st.bolted || !(st.vBody > 0)) return { v: 0, dir: 'v', why: st.bolted ? 'boltedStomp' : 'noLaunch', stomp: st };
    if (f.relativistic || f.escaped || f.orbit || f.timedOut || !f.landed) return { v: 0, dir: 'v', why: 'neverLands', stomp: st };
    return { v: f.vImpact, dir: 'v', stomp: st, apex: f.apex };
  }
  throw new Error('source');
}

// Plush splat (perfectly inelastic, constant crush force over squash s) with the holder held back by H < F_held.
// Non-relativistic. Reduces to the free hit as H -> 0 and to the held hit as H -> m_A v^2/(2s).
function splatWithFooting(mA, mB, v, s, H) {
  const mu = mA * mB / (mA + mB);
  const arel = v * v / (2 * s);
  const F = mu * (arel + H / mB);
  const tau = v / arel;               // = 2s/v
  const V = Math.max(0, v - F * tau / mA);
  const xB = 0.5 * ((F - H) / mB) * tau * tau;
  return { F, tau, V, Q: F * s, xB, Efoot: H * xB, Jearth: H * tau, Jcharger: mA * (v - V) };
}

function collide(cA, cB, o) {
  const bA = cA.body, bB = cB.body, mA = bA.m, mB = bB.m;
  if (P.isBlackHole(bA) || P.isBlackHole(bB)) return { blackHole: true };
  if (mA >= COL.M_RESHAPE || mB >= COL.M_RESHAPE) return { planetScale: true };
  const sp = chargeSpeed(cA, o.source, o.v);
  const out = { source: o.source, dir: sp.dir, speed: sp };
  if (!(sp.v > 0)) return Object.assign(out, { noCharge: sp.why || 'zero' });
  const v0 = sp.v;
  // mutual gravity on the way in (Newtonian; gate keeps G m / (r c^2) tiny)
  const dC = P.eqRadius(bA) + P.eqRadius(bB);
  const d0 = Math.max(COL.RUNUP * Math.max(bA.H, bB.H), 1.0001 * dC);
  const ft = P.fallTogether(bA, bB, d0, dC);
  const gNear = P.mutualGravity(bA, bB, dC);
  const gFar = P.mutualGravity(bA, bB, d0);
  const relativistic = !isFinite(v0) || v0 >= 0.01 * c;
  const vRel = relativistic ? v0 : Math.sqrt(v0 * v0 + ft.vRel * ft.vRel);
  const gravBoost = !relativistic && vRel > 1.001 * v0;
  out.v0 = v0; out.vRel = vRel;
  out.airRunUp = relativistic ? 0.5 * K.rho0 * bA.Cd * bA.frontArea * (sp.u != null ? sp.u : P.vToMomentum(v0, 1)) ** 2 * d0 : 0; // rough out.gravBoost = gravBoost; out.d0 = d0; out.dC = dC; out.fall = ft; out.gNear = gNear; out.gFar = gFar;
  out.bound = !relativistic && 0.5 * (mA * mB / (mA + mB)) * v0 * v0 < gFar.Ebind; // Ebind = G mA mB / d0
  const horiz = sp.dir === 'h';
  const hb = holdOf(cB, horiz);
  out.hold = hb;
  // momentum of the charger (relative to the holder at rest)
  const pA = (sp.u != null && !gravBoost) ? mA * sp.u : (!isFinite(vRel) || vRel >= c ? Infinity : (o.gb != null && !gravBoost ? o.gb * mA * c : P.vToMomentum(vRel, mA)));
  out.pA = pA;
  // dragged in by gravity before the hit?
  const dragged = gravBoost && gNear.F > hb.H;
  out.dragged = dragged;
  const mTheld = cB.immovable ? Infinity : mB + K.M_E;
  const hHeld = hit(pA, mA, mTheld);
  const Fheld = contact(Object.assign({ vRel }, hHeld), bA, bB, mA).soft.F;
  let held;
  if (dragged) held = false;
  else if (cB.immovable) held = true;
  else if (!isFinite(pA)) held = !isFinite(hb.H);      // infinite momentum: a bolted holder takes Earth with him
  else held = !isFinite(hb.H) || hb.H >= Fheld;
  out.held = held;
  out.Fheld = Fheld;
  let h;
  if (held) h = hHeld;
  else if (dragged) h = hitCM(mA, mB, mA * v0 / (mA + mB), vRel);
  else h = hit(pA, mA, mB);
  h.vRel = vRel;
  out.h = h;
  if (h.undefinedResult) return Object.assign(out, { outcome: 'paradox' });
  out.contact = contact(h, bA, bB, mA);
  // footing that is a real fraction of the blow: splat bound solved with the footing in (non-relativistic)
  const sq = out.contact.s;
  if (!held && !dragged && !relativistic && isFinite(pA) && isFinite(hb.H) && hb.H > 0) {
    const pf = splatWithFooting(mA, mB, vRel, sq, hb.H);
    out.partial = pf;
    h.Q = pf.Q; h.inel = { V: pf.V, pT: mB * pf.V, KE: 0.5 * (mA + mB) * pf.V * pf.V };
    out.contact.soft = { F: pf.F, t: pf.tau };
    // perfect-bounce bound stays the free result: an upper bound on how fast he is knocked away
    out.elasticUpper = hb.H > 0.1 * Fheld;
  }
  out.footingShare = held ? 1 : (isFinite(hb.H) ? hb.H / out.contact.soft.F : 1);
  // Earth's share
  if (held && !cB.immovable) {
    const pE_inel = h.inel.pT, pE_el = h.el.pT;
    const Mt = mB + K.M_E;
    out.earth = {
      dvInel: P.momentumToV(pE_inel, Mt), dvEl: P.momentumToV(pE_el, Mt),
      dayInel: horiz && isFinite(pE_inel) ? COL.T_SID * COL.T_SID * pE_inel * K.R_E / (2 * Math.PI * COL.I_FACTOR * K.M_E * K.R_E * K.R_E) : 0,
      runUpCancels: o.source !== 'set',
    };
  }
  // after the hit
  const aA = P.anchorCapacity({ body: bA, surface: cA.surface, theta: 0, anchor: cA.anchor === 'bolted' ? 'friction' : cA.anchor, groundHolds: cA.groundHolds, mA }).R;
  const aB = hb.anc.R;
  const gslide = (x) => (out.bound && gravBoost ? null : x);
  if (horiz) {
    const A = Math.max(bA.frontArea, bB.frontArea);
    out.after = held ? {
      inel: { slidePair: 0 },
      el: { vA: h.el.vA, slideA: gslide(slide(mA, Math.abs(h.el.vA), aA, bA.frontArea)) },
    } : {
      inel: { V: h.inel.V, slidePair: slide(mA + mB, h.inel.V, aA + Math.min(aB, hb.H), A), pushedDuringHit: out.partial ? out.partial.xB : null },
      el: { vA: h.el.vA, vB: h.el.vT, slideA: gslide(slide(mA, Math.abs(h.el.vA), aA, bA.frontArea)), slideB: gslide(slide(mB, h.el.vT, Math.min(aB, hb.H), bB.frontArea)) },
    };
  } else {
    const q = P.qultFor(cB.surface, bB.footB), rho = cB.surface.rho || 2000, A2 = 2 * bB.footArea;
    const sink = (m, v) => {
      if (held || cB.groundHolds) return { depth: 0 };
      if (!(v > 0)) return { depth: 0 };
      const E = P.momentumToKE(P.vToMomentum(v, m), m);
      if (v >= 2000) { const L = Math.cbrt(6 * m / (Math.PI * 1000)); return Object.assign({ E }, P.craterDiameter({ L, v, rhoI: bB.rho, rhoT: rho, angleDeg: 90, E })); }
      return { depth: P.penetrationDepth(m, A2, v, q, rho), E };
    };
    out.after = held ? { inel: { depth: 0 }, el: { vA: h.el.vA } } : {
      inel: Object.assign({ V: h.inel.V }, sink(mA + mB, h.inel.V)),
      el: Object.assign({ vA: h.el.vA, vB: h.el.vT }, sink(mB, h.el.vT)),
    };
  }
  // rock under a bolted / held holder carries the blow
  if (held && !cB.immovable && cB.anchor === 'bolted') out.rock = cB.groundHolds ? { comic: true } : rockLoad(out.contact.soft.F, cB, 0.5 * (bA.H + bB.H));
  // energy and environment
  out.Q = h.Q;
  out.tnt = h.Q / K.TNT_J_per_kg;
  out.quakeUpper = held ? P.seismicMagnitude(h.Q) : -Infinity;
  out.relativistic = relativistic;
  out.Vrel = h.inel.V >= 0.01 * c;
  out.outcome = !isFinite(pA) ? 'unstoppable' : (cB.immovable ? 'immovable' : (held ? 'held' : 'moved'));
  return out;
}

module.exports = { COL, F_HALVES, hit, hitCM, contact, rockLoad, slide, holdOf, standoff, chargeSpeed, collide, same, depth, canStand, fallsThrough };
