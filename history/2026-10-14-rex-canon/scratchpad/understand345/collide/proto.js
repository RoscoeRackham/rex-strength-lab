// A prototype of item 4's Collide: a charger who takes his own recoil acts as a body of unbounded mass at his speed.
// Built on the exported engine pieces only (the engine is not edited).
const { P } = require('./common');
const K = P.K, c = K.c;
const slideTo = (m, v, R, A) => { if (!(v > 0)) return 0; if (v >= 0.01 * c) return NaN; if (!(R > 0)) return Infinity; const k = 0.5 * K.rho0 * 1.0 * A; return m / (2 * k) * Math.log1p(k * v * v / R); };
const addV = (u, w) => (u + w) / (1 + u * w / (c * c));       // relativistic velocity addition
// held without limit: bolted on ground that can't break, or landed on from above where it can't
function heldWithoutLimit(cB, horiz) {
  if (cB.immovable) return null;
  if (!P.holdsGround(cB)) return null;
  if (cB.anchor === 'bolted') return 'bolted';
  if (!horiz) return cB.groundHolds ? 'comicGround' : 'unbreakable';
  return null;
}
function newCollide(cA, cB, o) {
  const old = P.collide(cA, cB, o);
  if (!cA.ownRecoil || cB.immovable || old.blackHole || old.planetScale || old.noCharge) return old;
  const out = Object.assign({}, old);
  const horiz = old.dir === 'h', mB = cB.body.m;
  const lim = heldWithoutLimit(cB, horiz);
  out.unbounded = true;
  if (lim) return Object.assign(out, { outcome: 'paradox', paradox: 'unboundedCharger', heldBy: lim, h: null, contact: null, after: null, toGround: undefined, earth: undefined, rock: undefined, Q: NaN, Elocal: undefined, held: true });
  const v = old.vRel;                                   // closing speed (gravity's pull included, as today)
  if (!isFinite(old.pA)) return old;                   // light speed: today's unstoppable (the one hit leaves at just under c)
  const pB = P.vToMomentum(v, mB);
  const h = P.headOn(pB, mB, Infinity);                 // in the charger's frame: the one hit meets an immovable body
  const vB = o.bounce ? addV(v, v) : v;                 // splat: carried at his speed; bounce: twice it (relativistically)
  const pGain = P.vToMomentum(vB, mB);
  const cf = P.contactForces(h, cB.body, cA.body, mB);
  const cfx = o.bounce ? cf.softEl : cf.soft;
  const hb = old.hold, Rb = Math.min(hb.R, hb.H);
  // his footing during the hit: what the ground takes through his feet (real: the other's push is real)
  const Heff = process.env.HEFF === "min" ? Math.min(hb.H, cfx.F) : hb.H;
  const Jfoot = isFinite(Heff) && Heff > 0 ? Heff * cfx.t : 0;
  const Tl = P.limbPulse(cB.body);
  out.carry = { V: v, vB, pGain, supplied: pGain + Jfoot, rockGives: cB.anchor === 'bolted' && !P.holdsGround(cB) };
  out.h = { Q: h.Q, KA: h.KA, pStar: h.pStar, inel: { V: v, pT: pB }, el: { vA: old.v0, vT: vB, pT: pGain } };
  out.contact = cf;
  out.Q = h.Q;                                           // freed at the hit (absorbed unless he means it)
  out.absorbedE = o.meanIt ? 0 : (o.bounce ? 0 : h.Q);
  out.held = false;
  out.outcome = 'carried';
  if (horiz) {
    out.after = { splat: { V: v, slide: slideTo(mB, v, Rb, cB.body.frontArea) }, bounce: { vA: old.v0, vB, slideA: 0, slideB: slideTo(mB, vB, Rb, cB.body.frontArea) } };
    out.after.splat.moved = out.after.splat.slide;
  } else {
    const q = P.qultFor(cB.surface, cB.body.footB), rho = cB.surface.rho || 2000, A2 = 2 * cB.body.footArea;
    const sink = (m, vv) => { const E = P.momentumToKE(P.vToMomentum(vv, m), m); if (vv >= 2000) { const L = Math.cbrt(6 * m / (Math.PI * cB.body.rho)); return Object.assign({ Eground: E }, P.craterDiameter({ L, v: vv, rhoI: cB.body.rho, rhoT: rho, angleDeg: 90, E })); } return { depth: P.penetrationDepth(m, A2, vv, q, rho), Eground: E }; };
    out.after = { splat: Object.assign({ V: v }, sink(mB, v)), bounce: Object.assign({ vA: old.v0, vB }, sink(mB, vB)) };
  }
  out.toGround = undefined;
  if ((cA.unbreakable || cB.unbreakable || o.toGround) && Jfoot > 0) out.toGround = { J: Jfoot, T: Math.max(Tl, cfx.t), how: 'carried' };
  out.earth = undefined; out.rock = undefined; out.partial = undefined; out.boltsLate = false;
  out.KA = old.KA;
  out.Elocal = old.relativistic ? h.Q + P.momentumToKE(pGain, mB) + old.airRunUp : h.Q;
  return out;
}
module.exports = { newCollide, slideTo, addV, heldWithoutLimit };
