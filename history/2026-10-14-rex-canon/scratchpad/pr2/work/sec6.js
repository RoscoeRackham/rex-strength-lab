// 6. The momentum ledger (BRIEF-canon.md item 3). For each move, at three dials (the page's 100 short tons, 10^9 kg and
// 10^12 kg), with the powers on, off, Unbreakable footing alone, They take their own recoil alone, and bolted with all
// four on and with none: add up the momentum each party gains in the push or contact event, along each axis (x level,
// along his push; y up): the object (or partner, or load), his body, the ground, and the endless ocean. Each entry is
// labelled with what it is, the ocean's with its canon case ('ocean:recoil' their own recoil, 'ocean:supplied' the
// ground's share it can't bear, 'ocean:growthLift' the lift from growth). The total must be zero to a part in a million
// of the largest entry, and the buckets must be right (a mutant that books his recoil in the ground would still close):
//   - with They take their own recoil on, none of his own push back is in the ground (the catcher's stop included), and
//     the test never works it out for him: the engine must report it, or the sum stays open;
//   - with it off, nothing is booked as his recoil taken back;
//   - with every power off, nothing goes to the ocean but canon's growth lift (instantGrowth reports it whatever the
//     switches say: it is canon, not a power);
//   - every ocean entry is one of canon's cases.
// Flights are left out: the share of the air's drag that is absorbed is a pair of equal and opposite pushes, both taken
// back (the object isn't slowed and the air isn't pushed), so it adds nothing net (and fly() reports only its size).
// Where the engine reports no ground figure (with the powers off, and the parts the lab never reports: a stomp's
// standing foot, a punch's footing, the shove partner's footing), the test works the planet's share out from the push
// itself ('derived'): the push's own impulses, the masses and anchorCapacity. Momenta come from energies where speeds
// round near c (p = sqrt(E^2 + 2 E m c^2) / c). Unbounded pushes are checked as unbounded on both sides (section 6b).
{
  const R3 = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), O3 = P.makeBody(Object.assign({ build: 'ollie' }, P.DEFAULT_BODIES.ollie));
  const car = obj('car'), bus = obj('bus'), cl = P.K.c;
  const pE = (E, m) => (E > 0 ? (isFinite(E) ? Math.sqrt(E * E + 2 * E * m * cl * cl) / cl : Infinity) : 0);
  const pV = (v, m) => (v > 0 ? P.vToMomentum(v, m) : 0);
  const rad = (d) => d * Math.PI / 180;
  // a unit vector at d degrees above level (cos 90 rounds to 6e-17: no sideways part)
  const dirOf = (d) => [Math.abs(d) === 90 ? 0 : Math.cos(rad(d)), Math.sin(rad(d))];
  const OCEAN = new Set(['ocean:recoil', 'ocean:supplied', 'ocean:growthLift']);
  const HIS_RECOIL = new Set(['ground:recoil', 'ground:catch']);
  const bad = [], seen = {};
  let ledgers = 0, worst = 0;
  const STATES = [['off', {}], ['on', ON], ['Unbreakable only', { unbreakable: true }], ['own recoil only', { ownRecoil: true }], ['on, bolted', Object.assign({ anchor: 'bolted' }, ON)], ['off, bolted', { anchor: 'bolted' }]];
  const DIALS = [[100 * 907.18474 * g, '100 short tons'], [1e9 * g, '10^9 kg'], [1e12 * g, '10^12 kg']];
  // entries: [label, x, y, derived?]: the momentum each party gains, kg m/s
  const book = (tag, st, entries) => {
    ledgers++;
    const list = entries.filter((e) => e && (e[1] !== 0 || e[2] !== 0));
    const why = [];
    let sx = 0, sy = 0, big = 0;
    for (const [, x, y] of list) { sx += x; sy += y; big = Math.max(big, Math.abs(x), Math.abs(y)); }
    const res = big > 0 ? Math.hypot(sx, sy) / big : 0;
    if (!(res <= 1e-6)) why.push('open by ' + sig(res) + ' of the largest entry (' + list.map((e) => e[0] + ' ' + sig(e[1]) + ',' + sig(e[2])).join('; ') + ')');
    worst = Math.max(worst, isFinite(res) ? res : 1);
    for (const [lab, , , der] of list) {
      seen[lab] = (seen[lab] || 0) + 1;
      if (/^ocean/.test(lab) && !OCEAN.has(lab)) why.push('an ocean entry that is no canon case: ' + lab);
      if (st.ownRecoil && HIS_RECOIL.has(lab)) why.push('his own push back in the ground with They take their own recoil on (' + lab + ')');
      if (st.ownRecoil && der && HIS_RECOIL.has(lab)) why.push('derived recoil with the power on');
      if (!st.ownRecoil && lab === 'ocean:recoil') why.push('recoil taken back with the power off');
      if (!st.ownRecoil && !st.unbreakable && /^ocean/.test(lab) && lab !== 'ocean:growthLift') why.push('an ocean entry with the powers off (' + lab + ')');
    }
    if (why.length) bad.push(tag + ': ' + why.join('; '));
  };
  // a push into the ground reported by the engine, pointing along (ux, uy) (the way the ground is pushed; uy <= 0), split
  // where Unbreakable footing capped it into the ground's take and the part their power supplied
  const wg = (tag, x, ux, uy, lab) => {
    if (!x) return [];
    if (x.whole == null) return [[lab, x.J * ux, x.J * uy]];
    const sx = Math.sign(ux);
    if (!(near(x.J, Math.hypot(x.sideTaken, x.downTaken), 1e-12) && near(x.sideTaken + x.suppliedSide || 1e-300, x.whole * Math.abs(ux) || 1e-300, 1e-9) && near(x.downTaken + x.suppliedDown || 1e-300, x.whole * Math.abs(uy) || 1e-300, 1e-9))) bad.push(tag + ': the weak-ground split doesn\'t add up (' + JSON.stringify(x) + ')');
    return [[lab, sx * x.sideTaken, -x.downTaken], ['ocean:supplied', sx * x.suppliedSide, -x.suppliedDown]];
  };
  const own = (x, J, u, sense) => (x ? [['ocean:recoil', sense * x.J * u[0], sense * x.J * u[1]]] : []);
  for (const [lab, st] of STATES) for (const [F, dl] of DIALS) {
    const tag0 = lab + ', ' + dl, c = ctxOf(F, Object.assign({ body: R3 }, st)), cO = Object.assign({}, c, { body: O3, anchor: 'friction' });
    // the throw (a car at 0, 45 and 90 degrees): at the end of the push and follow-through
    for (const th of [0, 45, 90]) {
      const r = P.throwObject(c, car, th), tag = tag0 + ', throw ' + th;
      if (!r.canMove) continue;
      const u = dirOf(th), pO = pE(r.Eobj, car.m), pB = pE(r.recoilE, R3.m), e = [['object', pO * u[0], pO * u[1]], ['body', -pB * u[0], -pB * u[1]]];
      e.push(...wg(tag, r.toGround, -u[0], -u[1], 'ground:recoil'), ...own(r.recoilAbsorbed, 0, u, -1));
      if (r.recoilAbsorbed && r.recoilAbsorbed.thetaDeg !== th) bad.push(tag + ': recoilAbsorbed.thetaDeg ' + r.recoilAbsorbed.thetaDeg);
      if (!st.ownRecoil && !r.toGround) { const pp = r.push, J = pp.pB * car.m / r.mB - Math.max(0, pp.pA - pp.pB * r.armMass / r.mB); e.push(['ground:recoil', -J * u[0], -J * u[1], true]); }
      book(tag, st, e);
    }
    // the stomp (y): his body, the foot's blow on the ground (the move: the stamp's extra effective mass in the shaking
    // model is not a momentum transfer, so a cap splits the foot's own momentum in proportion), his standing foot
    { const s = P.stomp(c), pp = s.push, tag = tag0 + ', stomp', pF = pE(s.E, R3.legEff), oS = Object.assign({ surface: c.surface, body: R3 }, st);
      const b = M.stomp.blow(s, oS), sup = b && b.supplied > 0 ? pF * b.supplied / b.whole : 0;
      const e = [['body', 0, pV(s.vBody, R3.m)], ['ground:blow', 0, -(pF - sup)], ['ocean:supplied', 0, -sup], ...own(s.recoilAbsorbed, 0, [0, -1], -1)];
      if (s.recoilAbsorbed && s.recoilAbsorbed.thetaDeg !== -90) bad.push(tag + ': thetaDeg ' + s.recoilAbsorbed.thetaDeg);
      // (his standing foot unloads, or his bolts pull the planet up: never reported by the engine)
      if (!st.ownRecoil) e.push(['ground:recoil', 0, pp.pB - pp.pA, true]);
      book(tag, st, e); }
    // the punch (x), at the end of the push: the fist, his body, his footing; the arm's stop hands it all back later
    { const pu = P.punch(c), pp = pu.push, tag = tag0 + ', punch';
      const e = [['fist', pE(pu.Efist, R3.handEff), 0], ['body', -pE(pu.recoilE, R3.m - R3.handEff), 0], ...own(pu.recoilAbsorbed, 0, [1, 0], -1)];
      if (pu.recoilAbsorbed && !(pu.recoilAbsorbed.returned === true && pu.recoilAbsorbed.thetaDeg === 0)) bad.push(tag + ': not marked returned');
      if (!st.ownRecoil) e.push(['ground:recoil', -(pp.pB - pp.pA), 0, true]);
      book(tag, st, e); }
    // the clap: his two hands, equal and opposite
    { const k = P.clap(c), p = pE(k.push.EB, R3.handEff); book(tag0 + ', clap', st, [['hand', p, 0], ['other hand', -p, 0], ...own(k.recoilAbsorbed, 0, [1, 0], -1)]); }
    // the jump (y): his push-off is the move itself, not recoil; Unbreakable footing caps what the ground takes
    { const j = P.jump(c), tag = tag0 + ', jump', p = pE(j.Ebody, R3.m), e = [['body', 0, p], ...own(j.recoilAbsorbed, 0, [0, 1], -1)];
      if (j.pushOff) { e.push(['ground:pushOff', 0, -j.pushOff.J], ['ocean:supplied', 0, -j.pushOff.supplied]); if (!near(j.pushOff.whole, p, 1e-9)) bad.push(tag + ': push-off whole ' + sig(j.pushOff.whole) + ' vs ' + sig(p)); }
      else e.push(['ground:pushOff', 0, -p, true]);
      book(tag, st, e); }
    // the pull (a bus over 10 m; x the way he walks): the load and his body at the end, the ground under the load (its
    // rolling resistance), his walking (his own body's momentum: the move), and the rope's pull back on him
    { const pl = P.pull(c, bus), tag = tag0 + ', pull';
      if (pl.canMove) {
        const t = pl.t10m, pL = pV(pl.vEnd, bus.m), pBd = pV(pl.vEnd, R3.m);
        const e = [['load', pL, 0], ['body', pBd, 0], ['ground:load', pl.resist * t, 0], ['ground:walk', -pBd, 0], ...own(pl.recoilAbsorbed, 0, [1, 0], -1)];
        if (!st.ownRecoil) e.push(['ground:recoil', -(pl.usable * t - pBd), 0, true]);
        book(tag, st, e);
      } }
    // the shove (Ollie on his own footing; x toward him): his partner, the shover, the partner's footing during the push
    // (anchorCapacity), and the shover's push back; their mutual pull is equal and opposite, so it cancels
    { const sh = P.shove(c, cO), tag = tag0 + ', shove';
      if (!sh.stalled && sh.push) {
        const pp = sh.push, fB = P.anchorCapacity({ body: O3, surface: cO.surface, theta: 0, anchor: cO.anchor, groundHolds: P.holdsGround(cO), mA: O3.m }).R;
        const fBt = pp.pB > 0 ? fB * pp.t : 0;
        const e = [['partner', pE(sh.EB, O3.m), 0], ['body', -pE(sh.EA, R3.m), 0], ['ground:partnerFooting', fBt, 0], ...wg(tag, sh.toGround, -1, 0, 'ground:recoil'), ...own(sh.recoilAbsorbed, 0, [1, 0], -1)];
        if (!st.ownRecoil && !sh.toGround) e.push(['ground:recoil', -(pp.pB - pp.pA + fBt), 0, true]);
        book(tag, st, e);
      } }
    // the wrestle throw at 45 degrees: the throw's push back, then (where Unbreakable footing caps it) Ollie's landing
    { const tp = P.throwPartner(c, cO, 45), r = tp.r, tag = tag0 + ', wrestle throw';
      if (r && r.canMove) {
        const u = dirOf(45), pO = pE(r.Eobj, O3.m), pB = pE(r.recoilE, R3.m), e = [['partner', pO * u[0], pO * u[1]], ['body', -pB * u[0], -pB * u[1]]];
        e.push(...wg(tag, r.toGround, -u[0], -u[1], 'ground:recoil'), ...own(r.recoilAbsorbed, 0, u, -1));
        if (!st.ownRecoil && !r.toGround) { const pp = r.push, J = pp.pB * O3.m / r.mB - Math.max(0, pp.pA - pp.pB * r.armMass / r.mB); e.push(['ground:recoil', -J * u[0], -J * u[1], true]); }
        book(tag, st, e);
        const f = r.flight, lt = tp.landToGround;
        if (lt) { const a = rad(f.impactAngleDeg), pIn = pV(f.vImpact, O3.m), ua = [Math.cos(a), -Math.sin(a)];
          book(tag + ' (landing)', st, [['partner', -pIn * ua[0], -pIn * ua[1]], ...wg(tag + ' (landing)', lt, ua[0], ua[1], 'ground:landing')]); }
      } }
    // the game of catch (a car 30 m apart, thrown hard): the thrower's push and the catcher's stop, as two events
    { const L = P.catchLeg(c, cO, car, 30, 'hard'), tag = tag0 + ', catch ' + L.result;
      const th = L.aim ? L.aim.thetaDeg : L.thetaDeg;
      if (th != null) {
        // the throw: the exact throw at that angle (the release table's, not the interpolated release speed)
        const tb = P.catchReleaseTable(c, car).at(th), u = dirOf(th), pO = pE(tb.Eobj, car.m), pB = pV(L.recoil ? L.recoil.v : 0, R3.m);
        const e = [['object', pO * u[0], pO * u[1]], ['thrower', -pB * u[0], -pB * u[1]], ...wg(tag + ' (throw)', L.toGroundT, -u[0], -u[1], 'ground:recoil'), ...own(L.recoilAbsorbedT, 0, u, -1)];
        if (L.recoilAbsorbedT && L.recoilAbsorbedT.thetaDeg !== th) bad.push(tag + ': recoilAbsorbedT.thetaDeg');
        if (!st.ownRecoil && !L.toGroundT) e.push(['ground:recoil', -(pO - pB) * u[0], -(pO - pB) * u[1], true]);
        book(tag + ' (throw)', st, e);
      }
      if (L.catch && ['caught', 'slams', 'wreckage', 'cant-hold-it'].includes(L.result)) {
        // the stop, along its arrival (forward and down): what it brings, what he and it keep moving with, the ground
        // under him, and his source
        const k = L.catch, a = rad(L.angleDeg || 0), ua = [Math.cos(a), -Math.sin(a)];
        const pIn = k.relativistic ? k.pIn : pV(L.vArrive, car.m), pair = k.relativistic ? (k.uAfter > 0 ? k.pIn : 0) : (O3.m + car.m) * k.uAfter;
        const e = [['object and catcher', (pair - pIn) * ua[0], (pair - pIn) * ua[1]], ...wg(tag + ' (stop)', L.toGroundC, ua[0], ua[1], 'ground:catch'), ...own(L.recoilAbsorbedC, 0, ua, 1)];
        if (L.recoilAbsorbedC && L.recoilAbsorbedC.angleDeg !== (L.angleDeg || 0)) bad.push(tag + ': recoilAbsorbedC.angleDeg');
        if (st.ownRecoil && !(k.uAfter === 0 && k.slide === 0 && !k.carried)) bad.push(tag + ': the catcher moves with his recoil taken');
        if (!st.ownRecoil && !L.toGroundC) e.push(['ground:catch', (pIn - pair) * ua[0], (pIn - pair) * ua[1], true]);
        book(tag + ' (stop)', st, e);
      } }
    // the partner toss (Ollie 10 m up, gently; y): Rex's toss and his catch
    { const t = P.tossPartner(c, O3, 'Ollie', 'easy', 10, 'friction'), tag = tag0 + ', toss ' + t.result;
      if (t.v > 0) {
        const pO = pV(t.v, O3.m), e = [['partner', 0, pO], ...wg(tag, t.toGroundT, 0, -1, 'ground:recoil'), ...own(t.recoilAbsorbedT, 0, [0, 1], -1)];
        if (!st.ownRecoil && !t.toGroundT) e.push(['ground:recoil', 0, -pO, true]);
        book(tag + ' (toss)', st, e);
      }
      if (t.catch) {
        const pIn = pV(t.flight.vImpact, O3.m), pair = (R3.m + O3.m) * (t.catch.uAfter || 0);
        const e = [['partner and catcher', 0, pIn - pair], ...wg(tag, t.toGroundC, 0, -1, 'ground:catch'), ...own(t.recoilAbsorbedC, 0, [0, -1], 1)];
        if (!st.ownRecoil && !t.toGroundC) e.push(['ground:catch', 0, -(pIn - pair), true]);
        book(tag + ' (catch)', st, e);
      } }
    // Collide, Ollie sprinting into Rex (unchanged in this pull request: the hit's push into the ground through Rex's
    // feet is a hit in a contest, not Rex's own push back). Splat and bounce; held or knocked back (the footing's share)
    for (const bounce of [false, true]) {
      const cA = Object.assign({}, c, { body: O3 }), r = P.collide(cA, c, { source: 'sprint', bounce }), tag = tag0 + ', collide ' + (bounce ? 'bounce' : 'splat');
      if (!r.h || r.noCharge || r.dragged || r.boltsLate || r.relativistic || r.h.undefinedResult) continue;
      const h = r.h, pA = r.pA, e = [];
      if (r.held) { e.push(['charger', (bounce ? h.el.pA : 0) - pA, 0]); e.push(r.toGround ? ['ground:hit', r.toGround.J, 0] : ['ground:hit', bounce ? h.el.pT : h.inel.pT, 0, true]); }
      else if (!bounce) { e.push(['charger', O3.m * h.inel.V - pA, 0], ['Rex', h.inel.pT, 0], ['ground:hit', r.partial ? r.partial.Jearth : 0, 0]); if (r.toGround && r.toGround.J !== r.partial.Jearth) bad.push(tag + ': toGround is not the footing\'s share'); }
      else {
        // (knocked back, the bounce's after-speeds ignore his footing (the engine's elasticUpper), while its toGround
        // books the splat's footing share: about 1.1% too much in this ledger. Left out of the sum; item 4 (pull
        // request 4) rewrites Collide. Here: the two bodies keep the momentum, and the footing's share stays small.)
        e.push(['charger', h.el.pA - pA, 0], ['Rex', h.el.pT, 0]);
        if (r.toGround && !(r.toGround.J < 0.02 * pA)) bad.push(tag + ': the bounce\'s footing share is ' + sig(r.toGround.J / pA) + ' of the hit');
      }
      if (r.toGround && r.toGround.supplied > 0) e.push(['ocean:supplied', r.toGround.supplied, 0]);
      book(tag, st, e);
    }
  }
  // the arm-wrestle pin on the table (Rex at the dial, Ollie at half; Things keep their form on so the table holds): the
  // forearms start and end at rest; the swing's push back on the winner (up) and the slam (down)
  for (const [lab, st] of [['off (table held)', {}], ['on', ON], ['Unbreakable only', { unbreakable: true }], ['own recoil only', { ownRecoil: true }]]) for (const [F, dl] of DIALS) {
    const x = Object.assign({ keepForm: true }, st), aw = P.armWrestle(ctxOf(F, Object.assign({ body: R3 }, x)), Object.assign(ctxOf(F / 2, x), { body: O3 })), tag = lab + ', ' + dl + ', arm pin';
    if (aw.outcome !== 'pin' || aw.tableBreaks || !(aw.pin.v > 0)) { bad.push(tag + ': ' + aw.outcome); continue; }
    const pF = pE(aw.pin.E, aw.pin.M), e = [...own(aw.recoilAbsorbed, 0, [0, -1], -1)];
    // the slam: the move (reported with Unbreakable footing; without it the lab doesn't count its shaking)
    e.push(aw.toGround ? ['ground:slam', 0, -aw.toGround.J] : ['ground:slam', 0, -pF, true]);
    // the swing's push back through his body and feet, with his recoil not taken (a quick one cancels the slam there:
    // the engine reports neither then)
    if (!st.ownRecoil) e.push(aw.toGround || !st.unbreakable ? ['ground:recoil', 0, pF, true] : ['ground:recoil', 0, pF, true]);
    if (aw.recoilAbsorbed && !(aw.recoilAbsorbed.thetaDeg === -90 && aw.recoilAbsorbed.T === aw.pin.t)) bad.push(tag + ': direction or time');
    book(tag, st, e);
  }
  // instant growth (no dial: the energy he takes in): the ground's push and the lift (canon's growth lift)
  for (const E of [1e6, 1e15, 4.2e23]) for (const [lab, gnd, st] of [['off', { surface: surf('concrete') }, {}], ['Unbreakable only', { surface: surf('concrete'), unbreakable: true }, { unbreakable: true }]]) {
    const I = P.instantGrowth(R3, E, 0.5, gnd), G = I.grown, tag = lab + ', growth ' + sig(E) + ' J';
    const e = [['ocean:growthLift', 0, I.Pocean]];
    if (I.gives) e.push(['ground:growth', 0, -Math.max(0, I.Fground - G.m * g) * I.tau]);
    else if (I.toGround) e.push(['ground:growth', 0, -I.toGround.J], ['ocean:supplied', 0, -I.toGround.supplied]);
    book(tag, st, e);
  }
  ok('6: the momentum ledger closes for every move (a throw at 0, 45 and 90 degrees, stomp, punch, clap, jump, pull, shove, wrestle throw and landing, a catch\'s throw and stop, the partner toss and its catch, a Collide splat and bounce, the arm-wrestle pin, instant growth), with the powers on, off, Unbreakable footing alone, They take their own recoil alone and bolted, at three dials: object + body + ground + ocean = 0 to a part in a million, and every share in its canon bucket (' + ledgers + ' ledgers)', !bad.length, bad.length ? bad.length + ' bad: ' + bad.slice(0, 4).join(' | ') : 'worst ' + sig(worst) + '; ' + Object.entries(seen).map(([k, v]) => k + ' ' + v).join(', '));
  // the buckets were exercised: his recoil reached the ocean with the power on and the ground with it off, the
  // catcher's stop both ways, and each of canon's cases appeared
  ok('6: the ledger saw each bucket: their own recoil in the ocean (power on) and in the ground (power off), the catcher\'s stop both ways, the ground\'s share it can't bear, the growth lift', seen['ocean:recoil'] > 50 && seen['ground:recoil'] > 50 && seen['ground:catch'] > 5 && seen['ocean:supplied'] > 5 && seen['ocean:growthLift'] === 6, JSON.stringify(seen));
}

// 6b. Unbounded pushes (comic mode at unlimited strength): the ledger can't add infinities, so each must be unbounded on
// both sides: the object (or his own body) gains an unbounded momentum, and what pushed it back takes an unbounded one
{
  const R3 = P.makeBody(Object.assign({ build: 'rex' }, P.DEFAULT_BODIES.rex)), O3 = P.makeBody(Object.assign({ build: 'ollie' }, P.DEFAULT_BODIES.ollie));
  const c = ctxOf(Infinity, Object.assign({ body: R3 }, ON)), cO = Object.assign({}, c, { body: O3 });
  const r = P.throwObject(c, obj('car'), 45), st = P.stomp(c), sh = P.shove(c, cO), j = P.jump(c), cU = ctxOf(Infinity, Object.assign({ body: R3 }, ON, { ownRecoil: false })), jU = P.jump(cU);
  ok('6b: unbounded pushes with their recoil taken: a throw (the car\'s momentum and his source\'s take), a stomp (the foot\'s and the upward push taken back) and a shove are unbounded on both sides; nothing reaches the ground', r.Eobj === Infinity && r.recoilAbsorbed && r.recoilAbsorbed.J === Infinity && !r.toGround && st.push.pB === Infinity && st.recoilAbsorbed && st.recoilAbsorbed.J === Infinity && sh.vB === P.K.c && sh.recoilAbsorbed && sh.recoilAbsorbed.J === Infinity && !sh.toGround);
  ok('6b: the comic jump at unlimited strength (Q9): unbounded upward, and their power supplies all of it, unbounded (the ground takes none: no push time)', j.v === P.K.c && j.pushOff && j.pushOff.whole === Infinity && j.pushOff.supplied === Infinity && j.pushOff.J === 0 && j.pushOff.T === 0 && jU.pushOff && jU.pushOff.supplied === Infinity);
}

