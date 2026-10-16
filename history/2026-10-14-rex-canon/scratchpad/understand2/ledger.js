// A prototype of the item 3 ledger on today's engine: each party's momentum (x forward, y up), N s, from reported
// figures only. 'ground' and 'ocean' are what the engine reports; 'unreported' is what is left (the planet's share the
// engine doesn't report). rel = |residual| / largest entry.
const { P, D, g, surf, obj, rex, ollie, ON, ctxOf, sig } = require('./base.js');
const M = P.RESTRAINT.MOVES;
const v2 = (a, th) => [a * Math.cos(th), a * Math.sin(th)];
const add = (...vs) => vs.reduce((s, v) => [s[0] + v[0], s[1] + v[1]], [0, 0]);
const mag = (v) => Math.hypot(v[0], v[1]);
const pOf = (v, m) => (v > 0 ? P.vToMomentum(v, m) : 0);
const rad = (d) => d * Math.PI / 180;
function report(name, parts) {
  const named = Object.entries(parts).filter(([, v]) => v);
  const tot = add(...named.map(([, v]) => v)), big = Math.max(...named.map(([, v]) => mag(v)), 1e-300);
  return { name, rel: mag(tot) / big, tot, ocean: named.filter(([k]) => /^ocean/.test(k)).map(([k, v]) => k + ' ' + sig(mag(v))).join(', ') };
}
// a weakGround-style figure { J, whole?, supplied?, suppliedDown?, suppliedSide? } for a push along th below the horizontal
// (backward), split into the ground's part and the ocean's
function wg(x, th, dirX) {
  if (!x) return [null, null];
  const whole = x.whole != null ? x.whole : x.J, sx = dirX == null ? -1 : dirX;
  if (!x.supplied) return [[sx * whole * Math.cos(th), -whole * Math.sin(th)], null];
  const sH = x.suppliedSide || 0, sD = x.suppliedDown || 0;
  const oc = [sx * sH, -sD], gr = [sx * (whole * Math.abs(Math.cos(th)) - sH), -(whole * Math.max(0, Math.sin(th)) - sD)];
  return [gr, oc];
}
const out = [];
const dials = [90718.474, 1e9, 1e12];
const states = [['off', {}], ['on', ON], ['UB only', { unbreakable: true }], ['OR only', { ownRecoil: true }]];
for (const kg of dials) for (const [lab, ex] of states) {
  const tag = sig(kg) + ' ' + lab;
  const c = ctxOf(kg, ex), o = Object.assign({ surface: c.surface, body: rex, m: rex.m }, ex);
  for (const th of [0, 45, 90]) {
    const r = P.throwObject(c, obj('car'), th), t = rad(th);
    if (!r.canMove) continue;
    const pO = r.flight && r.flight.relativistic ? Math.sqrt(r.Eobj * r.Eobj + 2 * r.Eobj * obj('car').m * P.K.c ** 2) / P.K.c : pOf(r.v, obj('car').m);
    const [gr, oc] = wg(r.toGround, t);
    const parts = { object: v2(pO, t), body: v2(-pOf(r.recoilV, rex.m), t), ground: gr, oceanSupplied: oc };
    const rep = report('throw ' + th, parts);
    rep.unreported = mag(rep.tot);
    out.push([tag, rep]);
  }
  { const st = P.stomp(c), pB = st.push.pB, pA = pOf(st.vBody, rex.m);
    // the foot's momentum into the ground; his body; Earth's pull on his body during the push (m_A g t, while he rises)
    const w = st.vBody > 0 ? (rex.m - rex.legEff) * g * st.push.t : null;
    const rep = report('stomp', { footIntoGround: [0, -pB], body: [0, pA], weightPlanet: w ? [0, w] : null });
    out.push([tag, rep]); }
  { const pu = P.punch(c); out.push([tag, report('punch (stroke)', { fist: [pu.push.pB, 0], body: [-pu.push.pA, 0] })]); }
  { const cl = P.clap(c); out.push([tag, report('clap', { hand1: [cl.push.pB, 0], hand2: [-cl.push.pB, 0] })]); }
  { const j = P.jump(c), p = pOf(j.v, rex.m);
    const parts = { body: [0, p] };
    if (j.pushOff) { parts.ground = [0, -j.pushOff.J]; parts.oceanSupplied = [0, -j.pushOff.supplied]; }
    out.push([tag, report('jump (push-off)', parts)]); }
  { const pl = P.pull(c, obj('bus')), t = pl.t10m, bus = obj('bus');
    const parts = { load: [pOf(pl.vEnd, bus.m), 0], body: [pOf(pl.vEnd, rex.m), 0], groundUnderLoad: [pl.resist * t, 0] };
    if (pl.ownRecoil) { parts.feetWalking = [-rex.m * pl.accel * t, 0]; parts.planetRope = [-pl.ropeT * t, 0]; }
    else parts.feet = [-pl.usable * t, 0];
    out.push([tag, report('pull bus 10 m', parts)]); }
  { const cO = Object.assign({}, c, { body: ollie }), sh = P.shove(c, cO);
    const fB = P.anchorCapacity({ body: ollie, surface: c.surface, theta: 0, anchor: 'friction', groundHolds: P.holdsGround(cO), mA: ollie.m }).R;
    const parts = { ollie: [pOf(sh.vB, ollie.m), 0], rex: [-pOf(sh.vA, rex.m), 0], groundUnderOllie: sh.vB > 0 ? [fB * sh.push.t, 0] : null, groundUnderRex: sh.toGround ? [-sh.toGround.J, 0] : null };
    out.push([tag, report('shove', parts)]); }
  { const cO = Object.assign({}, c, { body: ollie }), tp = P.throwPartner(c, cO, 45), r = tp.r, t = rad(45);
    const [gr, oc] = wg(r.toGround, t);
    out.push([tag, report('wrestle throw (push)', { ollie: v2(pOf(r.v, ollie.m), t), rex: v2(-pOf(r.recoilV, rex.m), t), ground: gr, oceanSupplied: oc })]);
    const f = r.flight;
    if (f && f.landed && f.vImpact > 0) { const ti = rad(f.impactAngleDeg); const pin = [pOf(f.vImpact, ollie.m) * Math.cos(ti), -pOf(f.vImpact, ollie.m) * Math.sin(ti)];
      const lt = tp.landToGround; let parts = { ollieArrives: pin };
      if (lt) { parts.ground = [-lt.sideTaken, (lt.whole * Math.sin(ti) - lt.suppliedDown)]; parts.oceanSupplied = [-(lt.suppliedSide || 0), lt.suppliedDown]; }
      out.push([tag, report('wrestle throw (landing)', parts)]); } }
  { const cO = Object.assign({}, c, { body: ollie }), L = P.catchLeg(c, cO, obj('car'), 30, 'hard');
    if (L.aim) { const t = rad(L.aim.thetaDeg), car = obj('car');
      const [gr, oc] = wg(L.toGroundT, t);
      out.push([tag, report('catch leg (throw) ' + L.result, { object: v2(pOf(L.aim.vL, car.m), t), thrower: v2(-pOf(L.recoil.v, rex.m), t), ground: gr, oceanSupplied: oc })]);
      if (L.catch && !L.catch.relativistic) { const a = rad(L.angleDeg), pin = [pOf(L.vArrive, car.m) * Math.cos(a), -pOf(L.vArrive, car.m) * Math.sin(a)];
        const pair = (ollie.m + car.m) * L.catch.uAfter;
        const [g2, o2] = wg(L.toGroundC, a, 1);
        // the catcher's stop: the ground under him takes it forward and down
        const parts = { arrives: pin, pairAfter: [-pair * Math.cos(a), pair * Math.sin(a)] };
        if (g2) parts.ground = [-g2[0], g2[1]].map((x, i) => i ? x : x);   // placeholder, fixed below
        if (L.toGroundC) { const whole = L.toGroundC.whole != null ? L.toGroundC.whole : L.toGroundC.J; parts.ground = [-(whole * Math.cos(a) - (L.toGroundC.suppliedSide || 0)), (whole * Math.sin(a) - (L.toGroundC.suppliedDown || 0))]; if (L.toGroundC.supplied) parts.oceanSupplied = [-(L.toGroundC.suppliedSide || 0), L.toGroundC.suppliedDown || 0]; }
        // (sign convention: the stop's push on the ground is along the arrival, so the catcher's ledger is arrival - pair - ground)
        out.push([tag, report('catch leg (catch) ' + L.result, { arrives: pin, pairAfter: [-pair * Math.cos(a), pair * Math.sin(a)], ground: parts.ground, oceanSupplied: parts.oceanSupplied })]); } } }
  for (const bounce of [false, true]) { const cA = Object.assign({}, c, { body: ollie }), r = P.collide(cA, c, { source: 'sprint', bounce });
    if (!r.h) continue;
    const after = r.held ? (bounce ? [ollie.m * r.h.el.vA, 0] : [0, 0]) : (bounce ? [ollie.m * r.h.el.vA + rex.m * r.h.el.vT, 0] : [(ollie.m + rex.m) * r.h.inel.V, 0]);
    const tg = r.toGround, gw = tg ? (tg.whole != null ? tg.whole : tg.J) : null;
    out.push([tag, report('collide sprint ' + (bounce ? 'bounce' : 'splat') + ' ' + r.outcome, { charger: [r.pA, 0], after: [-after[0], 0], ground: tg ? [-tg.J, 0] : null, oceanSupplied: tg && tg.supplied ? [-tg.supplied, 0] : null })]); }
}
for (const E of [1e6, 1e15, 4.2e23]) for (const [lab, gnd] of [['off', { surface: surf('concrete') }], ['UB', { surface: surf('concrete'), unbreakable: true }]]) {
  const I = P.instantGrowth(rex, E, 0.5, gnd), G = I.grown;
  const parts = { oceanLift: [0, I.Pocean] };
  if (I.gives) parts.groundPush = [0, -(I.Fground - G.m * g) * I.tau];
  else if (I.toGround) { parts.ground = [0, -I.toGround.J]; parts.oceanSupplied = [0, -I.toGround.supplied]; }
  out.push([sig(E) + ' J ' + lab, report('instant growth', parts)]);
}
for (const [tag, r] of out) console.log(tag.padEnd(16), r.name.padEnd(34), 'resid', sig(r.rel).padEnd(10), r.ocean ? 'ocean: ' + r.ocean : '');
