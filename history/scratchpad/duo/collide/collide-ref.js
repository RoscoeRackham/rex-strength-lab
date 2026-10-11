// Reference implementation: "Unstoppable force vs immovable object" (Rex vs Ollie).
// Paste the body (from COL down) inside engine.js's IIFE, replacing `P.` with the local names,
// and export COL, headOn, splatWithFooting, contactForces, rockLoad, standoff, chargeSpeed, collide.
// Needs from the density design: nothing beyond eqRadius, isBlackHole, mutualGravity, fallTogether
// (already in engine.js). One small engine change: sprint() returns uTop (see chargeSpeed).
global.window = global.window || {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
const K = P.K, c = K.c;

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
  M_RESHAPE: 1e-3 * K.M_E,     // density design's "his gravity reshapes the planet" gate
  ROCK_FAIL: 1.7e9,            // density design's deep-rock strength (falls-through gate)
};
COL.F_HALVES = 3 * K.G * K.M_E * K.M_E / (16 * K.R_E * K.R_E); // pull between the halves of a uniform Earth, 1.10e25 N

const depthOf = (b) => 2 * P.eqRadius(b);
const same = (a, b) => a === b || (isFinite(a) && isFinite(b) && Math.abs(a - b) <= 1e-9 * Math.max(Math.abs(a), Math.abs(b), 1e-300));
const canStand = (cx) => !isFinite(cx.F) || P.MUSCLE.jump.forceFrac * cx.F >= cx.body.m * K.g;
const fallsThrough = (cx) => !cx.groundHolds && cx.body.m * K.g > COL.ROCK_FAIL * cx.body.topArea;

// Head-on hit: body A with momentum p (may be Infinity) into body T at rest (mass mT, may be Infinity).
// Exact relativistic bounds: perfectly inelastic (splat) and perfectly elastic (bounce).
function headOn(p, mA, mT) {
  if (!(p > 0)) return { none: true, Q: 0, KA: 0, pStar: 0, inel: { V: 0, pT: 0 }, el: { vA: 0, vT: 0, pA: 0, pT: 0 } };
  if (!isFinite(p) && !isFinite(mT)) return { undefinedResult: true, Q: NaN, KA: Infinity, pStar: NaN };
  const KA = P.momentumToKE(p, mA);
  if (!isFinite(mT)) {   // truly immovable (thought experiment): infinite inertia
    return { KA, Q: KA, pStar: p, Mstar: Infinity, inel: { V: 0, pT: p }, el: { vA: -P.momentumToV(p, mA), vT: 0, pA: -p, pT: 2 * p } };
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
  const inel = { V: P.momentumToV(p, Ms), pT: p };
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
  if (Math.abs(el.vA) < 1e-9 * P.momentumToV(p, mA)) { el.vA = 0; el.pA = 0; }   // round-off for equal masses
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
function rockLoad(C, cHold, dSep) {
  if (!(C > 0)) return { C: 0, rT: 0, rC: 0 };
  const tearCap = cHold.groundHolds ? Infinity : cHold.surface.shear * cHold.body.digArea;
  return {
    C, rT: Math.sqrt(C / (2 * Math.PI * COL.ROCK_T)), rC: Math.sqrt(C / (2 * Math.PI * COL.ROCK_C)),
    tear: C / tearCap, tearCap,
    crackThrough: Math.sqrt(C / (2 * Math.PI * COL.ROCK_T)) >= dSep / 2,
    beyondCrust: Math.sqrt(C / (2 * Math.PI * COL.ROCK_T)) > COL.CRUST,
    planet: C >= COL.F_HALVES,
  };
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
  const anc = P.anchorCapacity({ body: b, surface: cB.surface, theta: 0, anchor: cB.anchor === 'bolted' ? 'friction' : cB.anchor, groundHolds: cB.groundHolds, mA: b.m });
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
  if (P.isBlackHole(cA.body) || P.isBlackHole(cB.body)) return { blackHole: true };
  const ancA = P.anchorCapacity({ body: cA.body, surface: cA.surface, theta: 0, anchor: cA.anchor, groundHolds: cA.groundHolds, mA: cA.body.m });
  const RA = cA.anchor === 'bolted' ? Infinity : ancA.R;
  const DA = Math.min(cA.F, RA);
  const hb = holdOf(cB, true), HB = hb.H;
  const dSep = 0.5 * (cA.body.H + cB.body.H);
  const grav = P.mutualGravity(cA.body, cB.body);
  const out = { DA, RA, FA: cA.F, FB: cB.F, HB, RB: hb.R, holdWhy: hb.why, dSep, gravF: grav.F,
    pusherSlips: cA.F > RA, gravityLock: grav.F > Math.min(RA, hb.R) };
  if (!isFinite(DA) && !isFinite(HB)) {
    out.outcome = cA.groundHolds && cB.groundHolds ? 'paradox' : 'rockGives';
    out.contact = NaN;
    return out;
  }
  if (same(DA, HB)) { out.outcome = 'stalemate'; out.contact = DA; }
  else if (DA > HB) { out.outcome = 'forceWins'; out.contact = HB; out.net = DA - HB; }
  else { out.outcome = 'objectHolds'; out.contact = DA; }
  if (cB.anchor === 'bolted' && isFinite(out.contact)) out.rock = cB.groundHolds ? { comic: true, C: out.contact } : rockLoad(out.contact, cB, dSep);
  return out;
}

// ---------------- Reading 2: a collision.
// source: 'sprint' | 'jump' (lands on him from the top of his jump) | 'stomp' (lands on him after a stomp-launch) | 'set' (gb = gamma*beta, Infinity = light speed)
function chargeSpeed(cA, source, gb) {
  if (source === 'set') {
    if (!(gb > 0)) return { v: 0, u: 0, dir: 'h', why: 'zero' };
    return { v: isFinite(gb) ? c * gb / Math.sqrt(1 + gb * gb) : c, u: gb * c, dir: 'h' };
  }
  if (source === 'sprint') {
    const s = P.sprint(cA);
    if (s.cantStand || !(s.vTop > 0)) return { v: 0, u: 0, dir: 'h', why: 'cantSprint', run: s };
    // Proper speed gamma*v at top speed. ENGINE: add to sprint(): uTop = min(sqrt(2 thrust/(rho0 Cd A)), legCap)
    // computed before the cap at c (drag on swept air grows as (gamma v)^2, so the same balance gives gamma*v).
    const b = cA.body, W = b.m * K.g;
    const uDrag = Math.sqrt(2 * s.thrust / (K.rho0 * b.Cd * b.frontArea));
    const Fcal = P.CAL_LIFT_KG * K.g - 180 * K.g;
    const ratio = isFinite(cA.F) ? Math.max(0, (cA.F - W) / Fcal) * (180 / b.m) * b.s : Infinity;
    let uLeg = P.MUSCLE.run.atCal * Math.sqrt(ratio);
    if (cA.mode === 'real') uLeg = Math.min(uLeg, P.MUSCLE.run.cap * b.s);
    return { v: s.vTop, u: Math.min(uDrag, uLeg), dir: 'h', run: s };
  }
  if (source === 'jump') {
    const j = P.jump(cA), f = j.flight;
    if (!(j.v > 0)) return { v: 0, dir: 'v', why: 'cantJump', jump: j };
    if (j.relativistic || f.relativistic || f.escaped || f.orbit || f.timedOut || !f.landed) return { v: 0, dir: 'v', why: 'neverLands', jump: j };
    return { v: f.vImpact, dir: 'v', jump: j, apex: f.apex };
  }
  if (source === 'stomp') {
    const st = P.stomp(cA), f = st.bodyFlight;
    if (st.bolted) return { v: 0, dir: 'v', why: 'boltedStomp', stomp: st };
    if (!(st.vBody > 0)) return { v: 0, dir: 'v', why: 'noLaunch', stomp: st };
    if (f.relativistic || f.escaped || f.orbit || f.timedOut || !f.landed) return { v: 0, dir: 'v', why: 'neverLands', stomp: st };
    return { v: f.vImpact, dir: 'v', stomp: st, apex: f.apex };
  }
  throw new Error('unknown source');
}

function collide(cA, cB, o) {
  const bA = cA.body, bB = cB.body, mA = bA.m, mB = bB.m;
  if (P.isBlackHole(bA) || P.isBlackHole(bB)) return { blackHole: true };
  if (mA >= COL.M_RESHAPE || mB >= COL.M_RESHAPE) return { planetScale: true };
  const sp = chargeSpeed(cA, o.source, o.gb);
  const out = { source: o.source, dir: sp.dir, speed: sp };
  if (!(sp.v > 0)) return Object.assign(out, { noCharge: sp.why || 'zero' });
  const v0 = sp.v, horiz = sp.dir === 'h';
  // mutual gravity on the way in (Newtonian is fine: the gates keep G m/(r c^2) below ~1e-5)
  const dC = P.eqRadius(bA) + P.eqRadius(bB);
  const d0 = Math.max(COL.RUNUP * Math.max(bA.H, bB.H), 1.0001 * dC);
  const fall = P.fallTogether(bA, bB, d0, dC);
  const gNear = P.mutualGravity(bA, bB, dC), gFar = P.mutualGravity(bA, bB, d0);
  const relativistic = v0 >= 0.01 * c;
  const vRel = relativistic ? v0 : Math.sqrt(v0 * v0 + fall.vRel * fall.vRel);
  const gravBoost = !relativistic && vRel > 1.001 * v0;
  Object.assign(out, { v0, vRel, d0, dC, fall, gNear, gFar, gravBoost, relativistic,
    bound: gravBoost && 0.5 * (mA * mB / (mA + mB)) * v0 * v0 < gFar.Ebind });
  const hb = holdOf(cB, horiz);
  out.hold = hb;
  const pA = gravBoost ? mA * vRel : (sp.u != null ? mA * sp.u : P.vToMomentum(v0, mA));   // u = gamma v
  out.pA = pA;
  const dragged = gravBoost && gNear.F > hb.H;    // his gravity pulls the holder off his feet before the hit
  out.dragged = dragged;
  // Does the brace hold? Test against the force of a held (Earth-backed) splat at the plush end.
  const mHeld = cB.immovable ? Infinity : mB + K.M_E;
  const hHeld = headOn(pA, mA, mHeld);
  const Fheld = contactForces(hHeld, bA, bB, mA).soft.F;
  let held;
  if (dragged) held = false;
  else if (cB.immovable) held = true;
  else if (!isFinite(pA)) held = !isFinite(hb.H);   // a bolted holder takes the planet with him
  else held = !isFinite(hb.H) || hb.H >= Fheld;
  out.held = held; out.Fheld = Fheld;
  const h = held ? hHeld : (dragged ? headOnCM(mA, mB, mA * v0 / (mA + mB), vRel) : headOn(pA, mA, mB));
  out.h = h;
  if (h.undefinedResult) return Object.assign(out, { outcome: 'paradox' });
  out.contact = contactForces(h, bA, bB, mA);
  // footing that is a real share of the blow: solve the splat with it (non-relativistic, finite hold)
  if (!held && !dragged && !relativistic && isFinite(pA) && isFinite(hb.H) && hb.H > 0) {
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
      dvSplat: P.momentumToV(h.inel.pT, M), dvBounce: P.momentumToV(h.el.pT, M),
      dayChange: horiz && isFinite(h.inel.pT) ? COL.T_SID * COL.T_SID * h.inel.pT / (2 * Math.PI * COL.I_FACTOR * K.M_E * K.R_E) : 0,
      runUpCancels: o.source !== 'set',
    };
    out.earth.t1mm = out.earth.dvSplat > 0 ? 1e-3 / out.earth.dvSplat : Infinity;
  }
  // after the hit
  const ancA = P.anchorCapacity({ body: bA, surface: cA.surface, theta: 0, anchor: cA.anchor === 'bolted' ? 'friction' : cA.anchor, groundHolds: cA.groundHolds, mA }).R;
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
    const q = P.qultFor(cB.surface, bB.footB), rho = cB.surface.rho || 2000, A2 = 2 * bB.footArea;
    const sink = (m, v, during) => {
      if (held || cB.groundHolds || !(v > 0)) return { depth: during || 0, Eground: 0 };
      const E = P.momentumToKE(P.vToMomentum(v, m), m);
      if (v >= 2000 || !isFinite(E)) { const L = Math.cbrt(6 * m / (Math.PI * bB.rho)); return Object.assign({ Eground: E }, P.craterDiameter({ L, v, rhoI: bB.rho, rhoT: rho, angleDeg: 90, E })); }
      return { depth: (during || 0) + P.penetrationDepth(m, A2, v, q, rho), Eground: E };
    };
    out.after = held ? { splat: { depth: 0 }, bounce: { vA: h.el.vA } } : {
      splat: Object.assign({ V: h.inel.V }, sink(mA + mB, h.inel.V, out.partial ? out.partial.xB : 0)),
      bounce: Object.assign({ vA: h.el.vA, vB: h.el.vT }, sink(mB, h.el.vT, 0)),
    };
    if (!held && out.partial) out.after.splat.Eground += out.partial.Efoot;
  }
  if (held && !cB.immovable && cB.anchor === 'bolted') out.rock = cB.groundHolds ? { comic: true } : rockLoad(out.contact.soft.F, cB, 0.5 * (bA.H + bB.H));
  out.Q = h.Q;                                       // splat: energy freed at the contact
  out.quakeHeld = held ? P.seismicMagnitude(h.Q) : -Infinity;   // upper bound: as if all of it went into the ground
  out.airRunUp = relativistic ? 0.5 * K.rho0 * bA.Cd * bA.frontArea * sp.u * sp.u * d0 : 0;   // rough
  out.outcome = !isFinite(pA) ? 'unstoppable' : (cB.immovable ? 'immovable' : (held ? 'held' : 'moved'));
  return out;
}

module.exports = { COL, same, canStand, fallsThrough, depthOf, headOn, headOnCM, splatWithFooting, contactForces, rockLoad, slideTo, holdOf, standoff, chargeSpeed, collide };
