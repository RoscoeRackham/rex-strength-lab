  // ---------------------------------------------------------------- two-player helpers
  const NAMES = { A: 'Rex', B: 'Ollie' };
  const fmtN = (F) => (isFinite(F) ? fmtSI(F, 'N') : 'unlimited');
  // Shared gate: black holes, planet-scale masses, and anyone who sinks into the ground just standing there.
  function duoGate(cR, cO) {
    for (const [who, c] of [['Rex', cR], ['Ollie', cO]]) {
      const pl = P.planetRegime(c.body.m, P.bodyGravity(c.body));
      if (pl.regime === 'blackHole') return { stop: true, text: 'No contest: at this density ' + who + ' is a black hole (see the Weight tab for what that does).' };
      if (pl.regime !== 'none') return { stop: true, text: 'No contest: at ' + fmtMass(c.body.m) + ' ' + who + '’s own gravity reshapes the planet (see the Weight tab).' };
    }
    const sinks = [['Rex', cR], ['Ollie', cO]].filter(([, c]) => { const gd = P.groundUnderWeight(c.body, c.surface, c.groundHolds); return !['comic', 'stands'].includes(gd.regime); }).map(([w]) => w);
    if (sinks.length) return { stop: false, text: 'On ' + cR.surface.short + ' ' + (sinks.length === 2 ? 'they both sink' : sinks[0] + ' sinks') + ' just standing there (see the Weight tab). The results below treat the ground as if it held them.', sinks };
    return null;
  }
  const holdText = (c, R) => (c.anchor === 'bolted' ? 'bolted to the planet' : (c.groundHolds ? 'comic ground' : (c.anchor === 'braced' ? 'dug in on ' : 'standing on ') + c.surface.short) + (isFinite(R) ? ', holds ' + fmtSI(R, 'N') : ''));

  // ---------------------------------------------------------------- arm wrestling
  function bayArm() {
    let cR = ctx(), cO = ctxOllie();
    const out = [duoHeader(cR, cO)];
    const gate = duoGate(cR, cO);
    if (gate && gate.stop) { out.push(callout(gate.text)); return out; }
    if (gate) { out.push(callout(gate.text)); cR = Object.assign({}, cR, { groundHolds: true }); cO = Object.assign({}, cO, { groundHolds: true }); }
    const r = P.armWrestle(cR, cO);
    const W = r.winner ? NAMES[r.winner] : null, L = r.winner ? NAMES[r.winner === 'A' ? 'B' : 'A'] : null;
    const cW = r.winner === 'A' ? cR : cO;
    const Rw = r.winner === 'A' ? r.RA : r.RB, Pw = r.winner === 'A' ? r.PA : r.PB;
    let v;
    if (r.pulledTogether) v = 'They never get to arm-wrestle. Their own gravity drags them together across the table: they meet at ' + speedOnly(r.fall.vRel) + ' within ' + fmtTime(r.fall.t) + ', releasing ' + fmtSI(r.fall.E, 'J') + ' (' + fmtTNT(r.fall.E) + ').';
    else if (!r.canHoldArmA || !r.canHoldArmB) { const who = !r.canHoldArmA ? 'Rex' : 'Ollie'; v = who + ' can’t even hold his forearm up: at this density it weighs more than his arm can push (' + fmtSI(!r.canHoldArmA ? r.armHoldA : r.armHoldB, 'N') + ' vs ' + fmtSI(!r.canHoldArmA ? r.PA : r.PB, 'N') + ').'; }
    else if (r.tableRatio > 1) v = 'The table collapses under their elbows before they start: an elbow presses ' + fmtSI(Math.max(r.elbowLoadA, r.elbowLoadB), 'N') + ' and the table takes about ' + fmtSI(r.elbowCap, 'N') + '.';
    else if (r.outcome === 'undefined') v = 'Unstoppable force meets immovable object. Both are infinitely strong and bolted down, so the push between them is infinity against infinity. That has no answer, and the sim won’t invent one.';
    else if (r.outcome === 'stalemate' && r.footLimitedA && r.footLimitedB) v = 'Dead heat. Each arm could push ' + fmtN(Math.min(r.PA, r.PB)) + ', but their feet only hold ' + fmtSI(r.contact, 'N') + '. Past that they’d just drag themselves off the table, so strength stops mattering.';
    else if (r.outcome === 'stalemate') v = 'Dead heat: ' + fmtSI(r.contact, 'N') + ' each way, arms locked upright.';
    else {
      const pin = r.pin;
      v = W + ' pins ' + L + ' in ' + fmtTime(pin.t) + '.';
      if ((r.winner === 'A' ? r.footLimitedA : r.footLimitedB)) v = W + ' wins, but only by ' + fmtSI(pin.dA, 'N') + ': his feet hold ' + fmtSI(Rw, 'N') + ', not his full ' + fmtN(Pw) + '. He pins ' + L + ' in ' + fmtTime(pin.t) + '.';
      if (pin.v >= 0.01 * K.c) v += ' The back of ' + L + '’s hand hits at ' + fmtSpeed(pin.v) + ': ' + (isFinite(pin.E) ? fmtTNT(pin.E) : 'unbounded energy') + '.';
      else if (pin.v >= 1) v += ' The back of ' + L + '’s hand hits the pad at ' + speedOnly(pin.v) + (r.slamRatio > 10 ? ' and goes through the table.' : r.slamRatio > 1 ? ', cracking the top.' : '.');
    }
    out.push(verdict(v));
    const chips = [status('info', 'Arm force: Rex ' + fmtN(r.AA) + ' · Ollie ' + fmtN(r.AB))];
    for (const [who, c, R, lim] of [['Rex', cR, r.RA, r.footLimitedA], ['Ollie', cO, r.RB, r.footLimitedB]]) {
      if (c.anchor === 'bolted') chips.push(status('info', who + ' bolted'));
      else chips.push(lim ? status('bad', who + '’s feet slip above ' + fmtSI(R, 'N')) : status('good', who + '’s feet hold'));
    }
    if (cR.groundHolds) chips.push(status('info', 'Comic ground: the table never breaks'));
    else if (r.tableRatio > 1) chips.push(status('bad', 'Table crushed by their elbows'));
    else if (r.slamRatio > 10) chips.push(status('bad', 'Pin smashes the table'));
    else if (r.slamRatio > 1) chips.push(status('warn', 'Pin may crack the table'));
    else chips.push(status('good', 'Table holds'));
    if (r.tearA > 1) chips.push(status('bad', 'Ground around Rex’s bolts tears out'));
    if (r.tearB > 1) chips.push(status('bad', 'Ground around Ollie’s bolts tears out'));
    if (r.grav.F > 1e-3 * Math.min(cR.body.m, cO.body.m) * g) chips.push(status('warn', 'Their own gravity: ' + fmtSI(r.grav.F, 'N')));
    if (Math.max(cR.body.H, cO.body.H) / Math.min(cR.body.H, cO.body.H) > 1.5) chips.push(status('info', 'Sizes too different for a fair table'));
    out.push(el('div', { class: 'status-row' }, chips));
    out.push(tiles(
      tile('Pushing force', fmtN(r.AA) + ' vs ' + fmtN(r.AB), 'arm 11% of strength, capped by footing'),
      tile('Time to pin', r.outcome === 'pin' ? fmtTime(r.pin.t) : r.outcome === 'undefined' ? 'no answer' : 'stalemate', r.outcome === 'pin' ? W + ' wins' : ''),
      r.outcome === 'pin' ? speedTile('Hand speed at the pin', r.pin.v, fmtMach(r.pin.v)) : null,
      r.outcome === 'pin' ? tile('Slam', isFinite(r.pin.E) ? fmtSI(r.pin.E, 'J') : '∞', (isFinite(r.pin.E) ? fmtTNT(r.pin.E) : 'unbounded') + (isFinite(r.slamCap) ? ' · ' + fmtRatio(r.slamRatio) + ' what the table top is built to take' : '')) : null,
      tile('Twist on each upper arm', fmtSI(Math.max(r.torqueA, r.torqueB), 'N·m'), fmtRatio(Math.max(r.humerusRatioA, r.humerusRatioB)) + ' what breaks a human upper-arm bone (~190 N·m, estimate)'),
      tile('Feet hold', fmtN(r.RA) + ' / ' + fmtN(r.RB), 'Rex / Ollie')));
    const rows = [
      { label: 'Rex’s arm', value: r.PA, highlight: r.AA === r.PA },
      isFinite(r.RA) ? { label: 'Rex’s feet hold', value: r.RA, highlight: r.AA === r.RA } : null,
      { label: 'Ollie’s arm', value: r.PB, highlight: r.AB === r.PB },
      isFinite(r.RB) ? { label: 'Ollie’s feet hold', value: r.RB, highlight: r.AB === r.RB } : null,
      isFinite(r.elbowCap) ? { label: 'Table under one elbow', value: r.elbowCap } : null,
      r.grav.F > 1e-3 ? { label: 'Their mutual gravity', value: r.grav.F } : null,
    ].filter(Boolean);
    out.push(logBars('Forces', rows, (x) => fmtSI(x, 'N')));
    const items = [];
    items.push('Newton’s third law: the push between their hands is the same both ways. It reaches each of them sideways, so each can only press as hard as his feet hold: Rex ' + holdText(cR, r.RA) + '; Ollie ' + holdText(cO, r.RB) + '.');
    if (r.footLimitedA || r.footLimitedB) items.push('Push harder and his feet slide and his elbow leaves the pad, which is a foul in competition. ' + (!isFinite(cR.F) || !isFinite(cO.F) ? 'Infinite strength doesn’t help here: his feet still let go at the same force.' : 'Strength past that point buys nothing.'));
    if (r.outcome === 'pin') items.push(W + '’s ' + fmtSI(r.pin.dA, 'N') + ' surplus spins both forearms (together they act like ' + fmtMass(r.pin.M) + ' at the hand) a quarter turn, ' + fmtDist(r.pin.s) + ', down to the pad.' + (cW.mode === 'real' ? ' With real muscle the arm’s force falls as it speeds up, so the hand tops out near ' + speedOnly(P.MUSCLE.punch.vmax * cW.body.s) + '.' : ''));
    if (r.outcome === 'pin' && isFinite(r.slamCap) && r.slamRatio > 1) items.push('A regulation table (World Armwrestling Federation: plywood on a steel frame, scaled to their size) is built for people. This pin delivers ' + (isFinite(r.pin.E) ? fmtSI(r.pin.E, 'J') : 'unbounded energy') + ', ' + fmtRatio(r.slamRatio) + ' the impact a floor panel of that plywood is tested to survive.');
    items.push('In people, a full-force twist like this is how the upper arm snaps: arm-wrestling fractures are typically spiral breaks of the humerus. A healthy humerus takes roughly 190 N·m (an estimate). Rex and Ollie are indestructible.');
    if (r.grav.F > 1e-3 * Math.min(cR.body.m, cO.body.m) * g) items.push('Across the table their gravity pulls them together with ' + fmtSI(r.grav.F, 'N') + ', ' + fmtRatio(r.grav.F / (Math.min(cR.body.m, cO.body.m) * g)) + ' the lighter one’s weight on Earth.');
    if (r.tearA > 1 || r.tearB > 1) items.push('Bolted to the planet holds, but the ground around the bolts doesn’t: past about ' + fmtSI(Math.min(groundTearOf(cR), groundTearOf(cO)), 'N') + ' the surface breaks up around his feet.');
    out.push(happens(items));
    out.push(math([
      'Arm force = 11% of strength in both muscle models (estimate): Rex ' + fmtN(r.PA) + ', Ollie ' + fmtN(r.PB) + '.',
      'Usable = min(arm force, footing); footing = μ m g, plus shear × buried area if dug in; unlimited if bolted.',
      r.outcome === 'pin' ? 'Pin: net ' + fmtSI(r.pin.dA, 'N') + ' on M = 0.0097 × (m_Rex + m_Ollie) = ' + fmtMass(r.pin.M) + ' over s = (π/2) × 0.19 × height = ' + fmtDist(r.pin.s) + '; relativistic momentum; real muscle force falls with hand speed (Hill).' : null,
      'Twist on the upper arm = usable force × 0.19 × height.',
      'Gravity between them: F = G m₁ m₂ / d², d = ' + fmtDist(r.grav.d) + ' across the table.',
    ]));
    return out;
  }
  const groundTearOf = (c) => (c.groundHolds ? Infinity : c.surface.shear * c.body.digArea);

  // ---------------------------------------------------------------- wrestling
  const WRESTLE_MOVES = [{ id: 'push', label: 'Shoving match' }, { id: 'shove', label: 'Shove' }, { id: 'lift', label: 'Lift' }, { id: 'throw', label: 'Throw' }];
  function wrestleControls() {
    const moves = el('div', { class: 'chips', role: 'group', 'aria-label': 'Wrestling move', style: 'margin-top:0' },
      WRESTLE_MOVES.map((m) => el('button', { type: 'button', class: 'chip', id: 'wm-' + m.id, 'aria-pressed': String(state.wrestleMove === m.id), onclick: () => { state.wrestleMove = m.id; if (m.id !== 'shove' && state.wrestleWho === 'both') state.wrestleWho = 'rex'; update(); } }, m.label)));
    const whoOpts = state.wrestleMove === 'push' ? [] : [['rex', 'Rex → Ollie'], ['ollie', 'Ollie → Rex']].concat(state.wrestleMove === 'shove' ? [['both', 'Both at once']] : []);
    const who = whoOpts.length ? el('div', { class: 'chips', role: 'group', 'aria-label': 'Who does it', style: 'margin-top:6px' },
      whoOpts.map(([id, label]) => el('button', { type: 'button', class: 'chip', id: 'ww-' + id, 'aria-pressed': String(state.wrestleWho === id), onclick: () => { state.wrestleWho = id; update(); } }, label))) : null;
    return el('div', { class: 'bay-controls' }, el('div', { class: 'field', style: 'margin-top:0;flex:1 1 100%' }, el('span', { class: 'lbl', text: 'Move' }), moves, who), state.wrestleMove === 'throw' ? angleControl() : null);
  }
  function bayWrestle() {
    let cR = ctx(), cO = ctxOllie();
    const out = [wrestleControls(), duoHeader(cR, cO)];
    const gate = duoGate(cR, cO);
    if (gate && gate.stop) { out.push(callout(gate.text)); return out; }
    if (gate) { out.push(callout(gate.text)); cR = Object.assign({}, cR, { groundHolds: true }); cO = Object.assign({}, cO, { groundHolds: true }); }
    const ollieFirst = state.wrestleWho === 'ollie';
    const cA = ollieFirst ? cO : cR, cB = ollieFirst ? cR : cO;
    const nA = ollieFirst ? 'Ollie' : 'Rex', nB = ollieFirst ? 'Rex' : 'Ollie';
    const mv = state.wrestleMove;
    if (mv === 'push') return out.concat(wrestlePush(cR, cO));
    if (mv === 'shove') return out.concat(wrestleShove(cR, cO, cA, cB, nA, nB));
    if (mv === 'lift') return out.concat(wrestleLift(cA, cB, nA, nB));
    return out.concat(wrestleThrow(cA, cB, nA, nB));
  }
  function wrestlePush(cR, cO) {
    const r = P.pushMatch(cR, cO), out = [];
    let v;
    if (r.outcome === 'bothBolted') v = isNaN(r.contact) ? 'Unstoppable force meets immovable object: both bolted, both infinitely strong. No answer.' : 'Neither moves: both are bolted to the planet. They press with ' + fmtSI(r.contact, 'N') + ', and that stretches the ground between their feet' + (r.tear > 1 ? ': it tears up around the bolts (' + fmtRatio(r.tear) + ' its limit).' : ', which holds.');
    else if (r.outcome === 'deadlock' && r.allOut) { const s = P.shoveBoth(cR, cO); v = 'Dead heat. Both are far stronger than their footing (each holds only ' + fmtSI(Math.min(r.holdA, r.holdB), 'N') + '), so strength stops mattering. Pushing all-out, they’d just shove each other apart like skaters: Rex at ' + speedOnly(s.shover === 'A' ? s.vA : s.vB) + ', Ollie at ' + speedOnly(s.shover === 'A' ? s.vB : s.vA) + '.'; }
    else if (r.outcome === 'deadlock' && (cR.anchor === 'bolted' || cO.anchor === 'bolted')) { const b = cR.anchor === 'bolted' ? 'Rex' : 'Ollie', o = b === 'Rex' ? 'Ollie' : 'Rex'; v = b + ' can’t be moved, and being bolted he can’t walk ' + o + ' out either. Stalemate (he can still shove him: see Shove).'; }
    else if (r.outcome === 'deadlock') v = 'Dead heat at ' + fmtSI(r.contact, 'N') + '.';
    else { const W = NAMES[r.winner], L = NAMES[r.winner === 'A' ? 'B' : 'A']; const Hl = r.winner === 'A' ? r.HB : r.HA, cl = r.winner === 'A' ? cO : cR; v = W + ' walks ' + L + ' out of the ring in ' + fmtTime(r.t) + (r.v >= 5 ? ', hitting ' + speedOnly(r.v) : '') + '. ' + L + '’s ' + (cl.F < (r.winner === 'A' ? r.holdB : r.holdA) ? 'muscles give at ' : 'feet only hold ') + fmtSI(Hl, 'N') + '.'; }
    if (r.gravityLock) v += ' Their gravity holds them together with ' + fmtSI(r.grav.F, 'N') + '; neither can push the other away.';
    out.push(verdict(v));
    out.push(el('div', { class: 'status-row' },
      status('info', 'Rex holds ' + fmtN(r.HA) + ' · drives ' + fmtN(r.DA)),
      status('info', 'Ollie holds ' + fmtN(r.HB) + ' · drives ' + fmtN(r.DB)),
      r.tear > 1 ? status('bad', 'Ground tears around the bolts') : null,
      r.grav.F > 1e-3 * Math.min(cR.body.m, cO.body.m) * g ? status('warn', 'Their own gravity: ' + fmtSI(r.grav.F, 'N')) : null));
    out.push(tiles(
      tile('Winner', r.outcome === 'walkOut' ? NAMES[r.winner] : (r.outcome === 'bothBolted' && isNaN(r.contact) ? 'no answer' : 'nobody'), r.outcome === 'walkOut' ? 'walks the other out' : 'stalemate'),
      r.outcome === 'walkOut' ? tile('Time out of the ring', fmtTime(r.t), 'ring ' + fmtDist(r.ring) + ' across') : null,
      r.outcome === 'walkOut' ? tile('Speed at the edge', speedOnly(r.v), r.v >= r.vCap * 0.999 ? 'his top running speed' : '') : null,
      tile('Push between them', isNaN(r.contact) ? '∞ vs ∞' : fmtN(r.contact), 'the same both ways')));
    out.push(logBars('Strength, footing and drive', [
      { label: 'Rex’s strength', value: cR.F, highlight: true }, isFinite(r.holdA) ? { label: 'Rex’s footing holds', value: r.holdA } : null, { label: 'Rex’s walking drive', value: r.DA },
      { label: 'Ollie’s strength', value: cO.F, highlight: true }, isFinite(r.holdB) ? { label: 'Ollie’s footing holds', value: r.holdB } : null, { label: 'Ollie’s walking drive', value: r.DB },
    ].filter(Boolean), (x) => fmtSI(x, 'N')));
    out.push(happens([
      'A shoving match is decided at the feet. To push forward, each one has to grip the ground; to stay put, each one has to grip it too. Strength past that grip just makes feet slide.',
      'Walking drive is friction under his own weight (plus a little claw or boot bite if dug in): ' + fmtSI(r.DA, 'N') + ' for Rex, ' + fmtSI(r.DB, 'N') + ' for Ollie. Holding still can use his full footing.',
      'Equal bodies on equal ground stay equal at any strength. A heavier body, or one dug in, wins.',
      r.outcome === 'bothBolted' ? 'Both bolted: the push runs from one through the ground to the other. The ground between their feet is stretched, and rock and concrete are weak in tension.' : null,
    ]));
    out.push(math(['Hold = min(strength, footing); footing = μ m g (+ shear × buried area if dug in; unlimited if bolted).', 'Drive = min(strength, μ m g + ¼ shear × buried area if dug in); 0 if bolted or too heavy to walk.', 'Winner: the one whose drive beats the other’s hold. Walk-out: a = (drive − hold) / (m_Rex + m_Ollie), capped at his running speed, over half the ring (' + fmtDist(r.ring / 2) + ').']));
    return out;
  }
  function wrestleShove(cR, cO, cA, cB, nA, nB) {
    const both = state.wrestleWho === 'both';
    const r = both ? P.shoveBoth(cR, cO) : P.shove(cA, cB);
    const pusher = both ? (r.shover === 'A' ? 'Rex' : 'Ollie') : nA, target = both ? (r.shover === 'A' ? 'Ollie' : 'Rex') : nB;
    const out = [];
    let v;
    if (r.stalled && r.gravityLock) v = target + ' is held to ' + pusher + ' by gravity (' + fmtSI(r.Fg, 'N') + '); ' + pusher + '’s shove (' + fmtSI(r.Fdrive, 'N') + ') can’t break it.';
    else if (r.stalled) v = 'Nobody moves: ' + pusher + '’s shove (' + fmtSI(r.Fdrive, 'N') + ') can’t beat the footing on both sides.';
    else if (r.relativistic) v = target + ' leaves at ' + fmtSpeed(r.vB) + '. The air in front of him turns into a fireball.';
    else v = target + ' flies back at ' + speedOnly(r.vB) + ' and slides ' + (isFinite(r.slideB) ? fmtDist(r.slideB) : 'until something stops him') + (r.slideB > r.ring / 2 ? ', well out of the ring.' : ', still inside the ring.') + (r.vA > 0.01 ? ' ' + pusher + ' recoils at ' + speedOnly(r.vA) + '.' : '') + (r.boundTogether ? ' Their gravity pulls them straight back together.' : '');
    out.push(verdict(v));
    out.push(el('div', { class: 'status-row' }, basisChip(r), r.heldBack ? status('warn', pusher + ' holds back so his feet don’t slide') : null, r.vA > 0.01 ? status('warn', pusher + ' recoils too') : status('good', pusher + ' stays put')));
    out.push(tiles(
      tile('Shove force', fmtN(r.Fdrive), 'two hands, over ' + fmtDist(r.d)),
      speedTile(target + ' leaves at', r.vB, fmtMach(r.vB)),
      speedTile(pusher + ' recoils at', r.vA, ''),
      !r.relativistic ? tile(target + ' slides', isFinite(r.slideB) ? fmtDist(r.slideB) : 'no end', 'friction and air drag stop him') : null,
      tile('Energy', fmtSI(r.EA + r.EB, 'J'), fmtTNT(r.EA + r.EB))));
    out.push(happens([
      'Newton’s third law: ' + target + ' pushes back on ' + pusher + ' exactly as hard, for exactly as long. Their momenta come out equal and opposite; the lighter or less anchored one moves faster.',
      both ? 'Both shove at once: the stronger shove sets the push, because the weaker one’s arms can’t extend against it. Evenly matched, both arms would extend, so this is a low estimate.' : null,
      r.heldBack ? 'Shoving with everything would make ' + pusher + '’s feet slide and waste the push, so he holds back to what his footing can take.' : null,
      'After the push, ' + target + ' slides on his feet against friction and air drag. A real body would tumble; the sim keeps him upright.',
      r.relativistic ? 'Past about 1% of light speed the air ahead can’t get out of the way: it is shock-heated into plasma. ' + target + ' is indestructible; everything around him isn’t.' : null,
    ]));
    out.push(math(['Shove: two hands at ' + shareText('throwPush', r.basis || state.mode) + ' of strength each, capped at full strength, over a ' + fmtDist(r.d) + ' stroke; same two-body push as the throw, with ' + target + '’s footing resisting.', 'Slide: m v dv/dx = −(footing + ½ρ Cd A v²) → x = m/(2k) ln(1 + k v²/footing).']));
    return out;
  }
  function wrestleLift(cA, cB, nA, nB) {
    const r = P.liftPartner(cA, cB), out = [];
    let v;
    if (r.bolted) v = nB + ' is bolted to the planet: lifting him means lifting the planet. Can’t be done.';
    else if (r.cantStand) v = nA + ' can’t lift ' + nB + ': ' + nA + ' is too heavy to get up himself (see Weight).';
    else if (r.can) {
      v = nA + ' lifts ' + nB + ' overhead with ' + fmtRatio(r.margin) + ' the force needed.';
      if (r.pullOut > 0 && isFinite(r.pullOut)) v += ' First he tears ' + nB + '’s ' + (nB === 'Rex' ? 'claws' : 'boots') + ' out of the ground (' + fmtSI(r.pullOut, 'N') + ').';
      if (r.Fg > 0.01 * r.weight) v += ' Their gravity adds ' + fmtSI(r.Fg, 'N') + ', ' + fmtRatio(r.Fg / r.weight) + ' ' + nB + '’s weight.';
      if (r.groundRatio > 1) v += ' ' + nA + '’s feet sink: both their weights press ' + fmtSI(r.pressure, 'Pa') + ' into ground that holds ' + fmtSI(r.qult, 'Pa') + '.';
    } else v = nA + ' can’t lift ' + nB + ': it takes ' + fmtN(r.need) + ', he has ' + fmtN(cA.F) + '.';
    out.push(verdict(v));
    out.push(tiles(
      tile(nB + '’s weight', fmtSI(r.weight, 'N'), fmtMass(cB.body.m)),
      r.Fg > 1e-6 ? tile('Their gravity', fmtSI(r.Fg, 'N'), 'centres ' + fmtDist(r.dOver) + ' apart') : null,
      r.pullOut > 0 ? tile('Pulling him out of the ground', fmtN(r.pullOut), cB.anchor === 'bolted' ? 'bolted' : 'dug in') : null,
      tile('Total needed', fmtN(r.need), nA + ' has ' + fmtN(cA.F))));
    out.push(happens([
      nB + ' can’t make himself heavier by pushing down on ' + nA + ': that push stays between the two of them. Only his grip on the ground counts.',
      'The ground under ' + nA + ' carries both of them: ' + fmtSI(r.pressure, 'Pa') + ' under his feet.',
    ]));
    return out;
  }
  function wrestleThrow(cA, cB, nA, nB) {
    const t = P.throwPartner(cA, cB, state.angle), out = [];
    if (t.bolted) { out.push(verdict(nB + ' is bolted to the planet: there’s nothing to throw.')); return out; }
    const r = t.r, f = r.flight;
    let v;
    if (!r.canHold || !r.canMove) v = nA + ' can’t throw ' + nB + ': his throwing push (' + fmtN(r.Fdrive) + ') can’t beat ' + nB + '’s weight plus his own arms (' + fmtSI(r.needed, 'N') + ').';
    else if (t.fallsBack) v = 'Their gravity pulls ' + nB + ' straight back to ' + nA + '.';
    else if (f.relativistic) v = nB + ' leaves at ' + fmtSpeed(r.v) + '. The air in front of him turns into a fireball.';
    else if (f.escaped) v = nB + ' leaves the Earth for good.';
    else if (f.orbit) v = nB + ' goes into orbit.';
    else if (state.angle >= 90) v = nB + ' goes ' + fmtDist(f.apex) + ' straight up and comes back down on ' + nA + ' ' + fmtTime(f.time) + ' later.';
    else v = nA + ' throws ' + nB + ' ' + fmtDist(f.range) + '.';
    if (r.canMove && r.recoilV > 1) v += ' ' + nA + ' gets shoved backward at ' + speedOnly(r.recoilV) + '.';
    if (t.penetrates && f && f.landed && !t.fallsBack) v += ' ' + nB + ' is so dense that he doesn’t make a crater: he punches straight into the ground (see Weight).';
    out.push(verdict(v));
    if (r.canMove && f && !t.fallsBack) {
      out.push(tiles(
        speedTile('Launch speed', r.v, fmtMach(r.v)),
        tile('Energy in ' + nB, fmtSI(r.Eobj, 'J'), fmtTNT(r.Eobj)),
        !f.relativistic && f.landed ? tile('Distance', fmtDist(f.range), 'top ' + fmtDist(f.apex) + ' · ' + fmtTime(f.time)) : null,
        !f.relativistic && f.landed ? tile('Lands at', speedOnly(f.vImpact), fmtTNT(r.Eimpact) + ' on impact') : null,
        tile(nA + '’s recoil', r.recoilV > 0.01 ? speedOnly(r.recoilV) : 'none', '')));
      if (!f.relativistic && f.path && f.path.length > 1 && state.angle < 90) out.push(trajectoryChart(f.path, null, 'Flight path of ' + nB, f.apex, (f.landed || f.timedOut) ? null : (f.orbit ? 'in orbit →' : 'leaves Earth →')));
      const items = [];
      items.push(nB + ' is just an object here: ' + fmtMass(cB.body.m) + ' with a ' + sig(cB.body.frontArea, 2) + ' m² front. He doesn’t fight the throw; for that, see Shove.');
      if (r.heldBack) items.push('Pushing with everything would make ' + nA + '’s feet slide, so he holds back to what his footing can take (' + fmtSI(r.anchor.R, 'N') + ').');
      if (f.landed && r.Eimpact > 4.184e9 && !t.penetrates) items.push('Impact: ' + fmtTNT(r.Eimpact) + (r.crater > 0 ? ', crater up to ' + fmtDist(r.crater) + ' across' : '') + '. ' + nB + ' is indestructible; the ground isn’t.');
      items.push('Landing: ' + nB + ' is indestructible, so the landing is the ground’s problem.');
      out.push(happens(items));
    }
    return out;
  }
