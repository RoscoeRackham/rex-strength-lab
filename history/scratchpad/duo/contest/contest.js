// Prototype of the arm-wrestling and wrestling design (scratch; not project code).
global.window = {};
const P = require('/home/user/dino-strength-sim/src/engine.js');
require('/home/user/dino-strength-sim/src/data.js');
const D = window.DINO_DATA;
const K = P.K, g = K.g;
const G = 6.67430e-11; // CODATA 2022

// ---- constants proposed for engine.js
const AW = {
  forceFrac: 0.11,       // arm-wrestling side force at the hand, share of full strength (both modes)
  lever: 0.19,           // humerus axis to grip centre, share of height (ANSUR II 0.199 H to olecranon rear, less ~1 cm/1.76 m)
  forearm: 0.1525,       // elbow to wrist (radiale-stylion), share of height: ANSUR II men 26.79 / 175.62 cm
  effMass: 0.022 * Math.pow(0.827 * 0.1525 / 0.19, 2), // forearm+hand inertia about elbow / lever^2, share of body mass
  pinAngle: Math.PI / 2, // quarter turn from upright to the touch pad
  elbowLoad: 0.036,      // forearm+hand (2.2%) + half the upper arm (1.4%) rest on the elbow pad
  holdArm: 0.022 * 0.682 * 0.1525 / 0.19, // forearm+hand weight moment at the hand lever, share of body weight (arm horizontal)
};
const TABLE = { refH: 1.7562, depth: 0.660, elbowCap: 10e3, impactRating: 102, padSpacing: 0.38 };
const RING_D = 4.55;       // m, at the default 2 m size (scaled with mean height / 2)
const HUMERUS_TORQUE = 190; // N m, theoretical human humerus torsional strength (Sabick 2004: 92 N m = 48%)

const rEq = (b) => Math.cbrt(3 * b.volume / (4 * Math.PI));
function mutualGravity(bA, bB, d) {
  const M = bA.m + bB.m;
  return { d, F: G * bA.m * bB.m / (d * d), vEsc: Math.sqrt(2 * G * M / d), Ebind: G * bA.m * bB.m / d };
}
function fallTogether(bA, bB, d0, d1) {
  const mu = G * (bA.m + bB.m), x = d1 / d0;
  if (!(d0 > d1)) return { t: 0, vRel: 0, E: 0 };
  const t = Math.sqrt(d0 * d0 * d0 / (2 * mu)) * (Math.sqrt(x * (1 - x)) + Math.acos(Math.sqrt(x)));
  const vRel = Math.sqrt(2 * mu * (1 / d1 - 1 / d0));
  return { t, vRel, E: G * bA.m * bB.m * (1 / d1 - 1 / d0) };
}
const isBlackHole = (b) => 2 * G * b.m / (K.c * K.c) >= rEq(b);
const footing = (c, mA) => P.anchorCapacity({ body: c.body, surface: c.surface, theta: 0, anchor: c.anchor, groundHolds: c.groundHolds, mA });
// Tear-out limit of the ground around a bolted (or dug-in) stance: the same shear x buried area the
// engine uses for claws dug in. Comic ground never tears.
const groundTear = (c) => (c.groundHolds ? Infinity : c.surface.shear * c.body.digArea);
const same = (a, b) => a === b || (isFinite(a) && isFinite(b) && Math.abs(a - b) <= 1e-9 * Math.max(Math.abs(a), Math.abs(b)));

// =============================================================== arm wrestling
function armWrestle(cA, cB) {
  const A = cA.body, B = cB.body;
  if (isBlackHole(A) || isBlackHole(B)) return { blackHole: true };
  const PA = cA.F * AW.forceFrac, PB = cB.F * AW.forceFrac;
  const fA = footing(cA), fB = footing(cB);
  const AA = Math.min(PA, fA.R), AB = Math.min(PB, fB.R);
  const out = { PA, PB, RA: fA.R, RB: fB.R, AA, AB, footLimitedA: fA.R < PA, footLimitedB: fB.R < PB };
  const LA = AW.lever * A.H, LB = AW.lever * B.H;
  out.LA = LA; out.LB = LB;
  // arm weight: can each hold his own forearm up?
  out.armHoldA = AW.holdArm * A.m * g; out.armHoldB = AW.holdArm * B.m * g;
  out.canHoldArmA = PA >= out.armHoldA; out.canHoldArmB = PB >= out.armHoldB;
  // table scaled to their mean height
  const sT = ((A.H + B.H) / 2) / TABLE.refH;
  out.sT = sT;
  out.elbowCap = cA.groundHolds ? Infinity : TABLE.elbowCap * sT * sT;
  out.elbowLoadA = AW.elbowLoad * A.m * g; out.elbowLoadB = AW.elbowLoad * B.m * g;
  out.tableRatio = Math.max(out.elbowLoadA, out.elbowLoadB) / out.elbowCap;
  out.impactCap = cA.groundHolds ? Infinity : TABLE.impactRating * sT * sT * sT;
  // mutual gravity across the table
  const dAW = Math.max(TABLE.depth * sT + 0.25 * (A.H + B.H) / 2, rEq(A) + rEq(B));
  out.grav = mutualGravity(A, B, dAW);
  out.fall = fallTogether(A, B, dAW, rEq(A) + rEq(B));
  if (!isFinite(AA) && !isFinite(AB)) { out.outcome = 'undefined'; return out; }
  if (same(AA, AB)) {
    out.outcome = 'stalemate';
    out.contact = AA;
  } else {
    const aWins = AA > AB;
    const w = aWins ? 'A' : 'B';
    const Aw = aWins ? AA : AB, Al = aWins ? AB : AA;
    const bw = aWins ? A : B, bl = aWins ? B : A;
    const cw = aWins ? cA : cB;
    const s = AW.pinAngle * AW.lever * bl.H;
    const meff = AW.effMass * (A.m + B.m);
    const vmax = P.MUSCLE.punch.vmax * bw.s;
    // Comic: constant force A_w. Real: the arm's Hill force, capped at what his footing holds.
    const Pw = aWins ? PA : PB, Rw = aWins ? fA.R : fB.R;
    const push = cw.mode === 'real'
      ? P.pushApart({ F: Pw, Fcap: Rw < Pw ? Rw : undefined, d: s, mA: meff, mB: meff, RA: Infinity, RB: Al, mode: 'real', vmax })
      : P.pushApart({ F: Aw, d: s, mA: meff, mB: meff, RA: Infinity, RB: Al, mode: 'comic' });
    out.outcome = 'pin'; out.winner = w; out.pin = { s, meff, t: push.t, v: push.vB, E: push.EB, dA: Aw - Al };
    out.contact = Al;
    out.impactRatio = push.EB / out.impactCap;
  }
  out.torqueA = AA * LA; out.torqueB = AB * LB;
  out.humerusRatio = out.torqueA / HUMERUS_TORQUE;
  // bolted stance: does the ground around the anchors tear?
  out.tearA = cA.anchor === 'bolted' ? AA / groundTear(cA) : 0;
  out.tearB = cB.anchor === 'bolted' ? AB / groundTear(cB) : 0;
  return out;
}

// =============================================================== shoving match (sustained push)
function pushMatch(cA, cB) {
  const A = cA.body, B = cB.body;
  if (isBlackHole(A) || isBlackHole(B)) return { blackHole: true };
  const fA = footing(cA), fB = footing(cB);
  const bolt = (c) => c.anchor === 'bolted';
  const drive = (c, f) => {
    if (bolt(c)) return 0;
    const N = Math.min(c.body.m * g, f.Nmax);
    return c.surface.mu * N + (c.anchor === 'braced' ? 0.25 * c.surface.shear * c.body.digArea : 0);
  };
  const HA = bolt(cA) ? Infinity : Math.min(cA.F, fA.R), HB = bolt(cB) ? Infinity : Math.min(cB.F, fB.R);
  const DA = Math.min(cA.F, drive(cA, fA)), DB = Math.min(cB.F, drive(cB, fB));
  const out = { HA, HB, DA, DB, holdA: fA.R, holdB: fB.R };
  out.grav = mutualGravity(A, B, rEq(A) + rEq(B));
  out.ring = RING_D * ((A.H + B.H) / 2) / 2;
  if (bolt(cA) && bolt(cB)) {
    out.outcome = 'bothBolted';
    out.contact = (!isFinite(cA.F) && !isFinite(cB.F)) ? NaN : Math.max(cA.F, cB.F);
    out.tear = out.contact / Math.min(groundTear(cA), groundTear(cB));
    return out;
  }
  const netA = DA - HB, netB = DB - HA;
  const tol = 1e-9 * Math.max(DA, DB, 1e-300);
  let w = null, net = 0;
  if (netA > tol) { w = 'A'; net = netA; } else if (netB > tol) { w = 'B'; net = netB; }
  if (!w) {
    out.outcome = 'deadlock';
    out.contact = Math.min(HA, HB);
    out.allOut = !bolt(cA) && !bolt(cB) && cA.F > fA.R && cB.F > fB.R;
    return out;
  }
  const M = A.m + B.m, a = net / M, x = out.ring / 2; // loser starts at the centre: half the diameter
  const cw = w === 'A' ? cA : cB;
  const vCap = P.sprint(cw).vTop;
  let t, v;
  const vFree = Math.sqrt(2 * a * x);
  if (vFree <= vCap) { t = Math.sqrt(2 * x / a); v = vFree; }
  else { t = vCap / a + (x - vCap * vCap / (2 * a)) / vCap; v = vCap; }
  Object.assign(out, { outcome: 'walkOut', winner: w, net, accel: a, x, t, v, vCap });
  return out;
}

// =============================================================== shove (explosive, one side)
function shoveOnce(cA, cB) {
  const A = cA.body, B = cB.body;
  const key = 'throwPush';
  const frac = cA.mode === 'real' ? P.MUSCLE[key].forceFrac : P.MUSCLE[key].comicFrac;
  const Fdrive = Math.min(cA.F, cA.F * frac * 2);
  const d = A.strokes.throw;
  const armMass = 2 * A.handEff;
  const mA = A.m - armMass, mB = B.m + armMass;
  const fA = P.anchorCapacity({ body: A, surface: cA.surface, theta: 0, anchor: cA.anchor, groundHolds: cA.groundHolds, mA });
  const fB = footing(cB);
  const d0 = rEq(A) + rEq(B);
  const Fg = G * A.m * B.m / (d0 * d0);
  const RA = (F) => fA.Rslide(F) + Fg, RB = fB.R + Fg;
  const vmax = P.MUSCLE[key].vmax * A.s;
  let push = P.pushApart({ F: Fdrive, d, mA, mB, RA, RB, mode: cA.mode, vmax });
  let heldBack = false;
  const Rlim = (fA.R + Fg) * (1 - 1e-9);
  if ((isFinite(Fdrive) || cA.mode === 'real') && Fdrive > Rlim && Rlim > RB) {
    const caps = cA.mode === 'real' ? [1, 1.25, 1.6, 2, 3, 5, 10] : [1];
    for (const f of caps) {
      const Fc = Rlim * f;
      if (!(Fc < Fdrive)) continue;
      const held = P.pushApart(cA.mode === 'real' ? { F: Fdrive, Fcap: Fc, d, mA, mB, RA, RB, mode: 'real', vmax } : { F: Fc, d, mA, mB, RA, RB, mode: 'comic' });
      if (held.pB > push.pB) { push = held; heldBack = f === 1; }
    }
  }
  // The follow-through stops A's arms inside him: B keeps pB*mB0/mB, A recoils with pA - pB*armMass/mB.
  const pObj = push.pB === Infinity ? Infinity : push.pB * B.m / mB;
  const pRec = push.pA === Infinity ? Infinity : Math.max(0, push.pA - push.pB * armMass / mB);
  const vB = P.momentumToV(pObj, B.m), vA = P.momentumToV(pRec, A.m);
  const EB = P.momentumToKE(pObj, B.m), EA = P.momentumToKE(pRec, A.m);
  // After contact ends each slides to a stop against his footing R and air drag k v^2 (k = rho0 Cd A / 2):
  // m v dv/dx = -(R + k v^2)  =>  x = m/(2k) ln(1 + k v^2 / R). Below 1% of light speed only.
  const slide = (v, f, b) => {
    if (!(v > 0)) return 0;
    if (v > 0.01 * K.c || !isFinite(f.R)) return f.R === Infinity ? 0 : Infinity;
    const k = 0.5 * K.rho0 * b.Cd * b.frontArea;
    if (!(f.R > 0)) return Infinity;
    return b.m / (2 * k) * Math.log1p(k * v * v / f.R);
  };
  const vRel = vA + vB;
  const esc = Math.sqrt(2 * G * (A.m + B.m) / (d0 + d));
  return { Fdrive, d, push, heldBack, vA, vB, EA, EB, slideB: slide(vB, fB, B), slideA: slide(vA, fA, A), gravityLock: push.stalled && Fg >= Fdrive, Fg, boundTogether: !push.stalled && vRel < esc, vEsc: esc, stalled: push.stalled, relativistic: vB > 0.01 * K.c || vA > 0.01 * K.c };
}
function shove(cA, cB) {
  const run = (c) => shoveOnce(c, cB);
  const r = run(cA);
  if (cA.mode !== 'comic') return r;
  const rr = run(Object.assign({}, cA, { mode: 'real' }));
  return rr.vB > r.vB ? Object.assign(rr, { basis: 'real' }) : r;
}
// Both shove at once: the stronger shove sets the push (the weaker one's arms can't extend against it).
function shoveBoth(cA, cB) {
  const drive = (c) => Math.min(c.F, c.F * 2 * (c.mode === 'real' ? P.MUSCLE.throwPush.forceFrac : P.MUSCLE.throwPush.comicFrac));
  const dA = drive(cA), dB = drive(cB);
  if (dA >= dB) return Object.assign(shove(cA, cB), { shover: 'A' });
  const r = shove(cB, cA);
  return Object.assign(r, { shover: 'B' });
}

// =============================================================== lift the partner
function liftPartner(cA, cB) {
  const A = cA.body, B = cB.body;
  const r = P.lift(cA, { m: B.m });
  const dOver = Math.max(0.65 * A.H + 0.1 * B.H, rEq(A) + rEq(B));
  const Fg = G * A.m * B.m / (dOver * dOver);
  const pullOut = cB.anchor === 'bolted' ? Infinity : (cB.anchor === 'braced' ? cB.surface.shear * B.digArea : 0);
  const need = B.m * g + Fg + pullOut;
  return { weight: B.m * g, Fg, pullOut, need, can: cA.F >= need * (1 - 1e-9), margin: cA.F / need, groundRatio: r.groundRatio, pressure: r.pressure, qult: r.qult, dOver };
}

// =============================================================== throw the partner
function throwPartner(cA, cB, theta) {
  const A = cA.body, B = cB.body;
  if (cB.anchor === 'bolted') return { bolted: true };
  const obj = { m: B.m, area: B.frontArea, Cd: B.Cd, CdSup: 1.75, rho: B.rho, L: Math.cbrt(6 * B.volume / Math.PI) };
  const r = P.throwObject(cA, obj, theta);
  const dOver = Math.max(0.65 * A.H + 0.1 * B.H, rEq(A) + rEq(B));
  const vEsc = Math.sqrt(2 * G * (A.m + B.m) / dOver);
  // Crater scaling (Collins et al.) is fitted to impactor/target density ratios near 1. A much denser
  // partner punches in instead: Newton's impact depth D = L * rho_i / rho_t.
  const rhoT = cA.surface.rho || 2000;
  const newtonDepth = obj.L * B.rho / rhoT;
  return { r, vEsc, fallsBack: r.v < vEsc, obj, newtonDepth, penetrates: B.rho / rhoT > 10 };
}

module.exports = { shove, shoveBoth, AW, TABLE, G, rEq, mutualGravity, fallTogether, isBlackHole, armWrestle, pushMatch, shoveOnce, liftPartner, throwPartner, P, D, K };
