  // Collide's charge when the one hit is held without limit by their powers, the charger taking his own recoil
  // (BRIEF-canon.md item 4, decision 3; canon, the rulings of 14 Oct 2026). The tab explains it first, so a reader doesn't
  // take it for a broken page: the charger can't slow, the one hit can't move, so physics has no answer. Nothing of the
  // hit is worked out (the engine gives no h, contact or ground push); the charge itself is real, so its speed and its
  // take-off's shaking are.
  function collideParadox(r, cA, cB, X, Y, srcLabel, gb) {
    const out = [], hb = r.hold;
    const comic = cB.groundHolds;
    const held = r.heldBy === 'bolted'
      ? Y + ' is bolted to ' + (comic ? 'ground the lab treats as holding (they would sink here otherwise)' : 'ground that Unbreakable footing never lets break') + ', and whatever push the ground can’t bear, their power supplies, so nothing limits his hold'
      : r.heldBy === 'unbreakable' ? X + ' comes down on him from above, and the ground under ' + Y + '’s feet holds him up. Unbreakable footing never lets it give: whatever push it can’t bear, their power supplies, so nothing limits that hold'
        : X + ' comes down on him from above, and the ground under ' + Y + '’s feet holds him up. The lab treats that ground as holding (they would sink here otherwise), so nothing limits that hold';
    out.push(verdict('No physical answer here, and the page isn’t broken: this is the canon’s ruling. ' + X + ' takes his own recoil, so nothing can slow him: the push back from his hit goes to his source. ' + held + '. One of them has to give, and neither can, so physics has no answer.'));
    const chips = [status('info', 'Charge: ' + fmtV(r.v0) + ' (' + srcLabel + ')'), status('warn', 'No physical answer: the canon’s ruling')];
    if (r.v0 >= 0.01 * K.c) chips.push(status('bad', 'Fireball on the way in'));
    else if (r.v0 >= 1000) chips.push(status(r.v0 >= 3000 ? 'bad' : 'warn', 'Air ahead of him heats to ' + big(P.stagnationT(r.v0) - 273.15, 2) + ' °C'));
    else if (r.v0 >= K.a0) chips.push(status('warn', 'Sonic boom on the way in'));
    // the charger's take-off still pushes on the ground (his jump's push-off or his stomp-launch)
    const tk = chargeTakeoff(r, cA), tkShake = groundShake(cA.surface, tk);
    if (tkShake) chips.push(groundShakeChip(tkShake, cA.surface, X + '’s take-off'));
    out.push(el('div', { class: 'status-row' }, chips));
    out.push(tiles(
      isFinite(r.vRel) && r.vRel < K.c * (1 - 1e-12) ? speedTile(state.colSrc === 'set' ? 'Speed at contact' : 'Charge speed', r.vRel, srcLabel) : tile('Charge speed', 'just under light speed', 'unlimited momentum'),
      tile(X + ' slows', 'never', 'his own recoil goes to his source'),
      tile(Y + ' moves', 'never', 'held without limit: ' + (r.heldBy === 'bolted' ? 'bolted, on ground their power holds' : holdWhy[r.heldBy] || ''))));
    const items = [];
    items.push('Canon (the rulings of 14 Oct 2026): “A charger’s push back from his own hit is his own recoil: it goes to his source, so he doesn’t slow. Where the one he hits is held without limit (never knocked back, or held up by their powers), the collision has no physical answer.” Collide is a contest, so Never knocked back is set aside here; what holds ' + Y + ' without limit is ' + (r.heldBy === 'bolted' ? 'his bolts on ground their power holds.' : 'the ground their power holds up under him.'));
    items.push('Why neither can give. ' + X + ' could slow only by keeping the push back from the hit, and his goes to his source. ' + Y + ' could move only if what holds him gave, and ' + (r.heldBy === 'bolted' ? 'his bolts are fixed to the planet: carrying him would mean carrying the ground, and ' : 'landed on from above, he can only go down into the ground, and ') + (comic ? 'the lab treats that ground as holding.' : 'Unbreakable footing supplies whatever push the ground can’t bear (canon’s case “the ground’s share it can’t bear”).') + ' This is the old paradox in the lab’s terms: an unstoppable force (a charger who can’t slow) meets an immovable object (a body their powers hold without limit). Momentum conservation can’t share out a hit that neither side can take, so the two settings can’t both hold.');
    // what gives when one of the two settings is off (their own answers, on the same charge)
    if (!comic && cB.unbreakable) {
      const q = P.collide(cA, Object.assign({}, cB, { unbreakable: false }), { source: state.colSrc, gb, bounce: state.colBounce === 'bounce' });
      const qa = q && q.after, qs = qa && (state.colBounce === 'bounce' ? qa.bounce : qa.splat);
      if (q && q.outcome === 'carried' && qs) items.push('With Unbreakable footing off (or the Break the ground preset), the ground is real and gives: ' + (q.carry.rockGives ? 'the rock around ' + Y + '’s bolts tears out (at about ' + fmtSI(q.carry.tear, 'N') + '), and he is ' + (state.colBounce === 'bounce' ? 'sent off at ' + fmtV(q.carry.vB) : 'carried along at ' + fmtV(q.carry.v)) + ' with a plug of rock.' : Y + ' is driven ' + (qs.D > 0 ? 'in and blasts a crater up to ' + fmtDist(qs.D) + ' wide.' : fmtDist(qs.depth || 0) + ' into ' + theSurf(cB.surface) + '.')));
    }
    if (cA.ownRecoil) {
      const q0 = P.collide(Object.assign({}, cA, { ownRecoil: false }), cB, { source: state.colSrc, gb, bounce: state.colBounce === 'bounce' });
      if (q0 && q0.held && q0.h && !q0.h.undefinedResult) items.push('With They take their own recoil off, ' + X + ' slows as real physics says, and the hit has an answer: ' + Y + ' doesn’t budge, and ' + X + (state.colBounce === 'bounce' ? ' bounces back at ' + speedOnly(Math.abs(q0.h.el.vA)) : ' stops dead') + '.');
    }
    if (r.relativistic) items.push('At ' + fmtV(r.v0) + ' the air ahead of ' + X + ' can’t get out of the way: it’s shock-heated into plasma on the way in. That much is real; the hit itself has no answer.');
    if (tk) items.push('The take-off goes into the ground: ' + tk.what + ', ' + pushFig(tk) + ' over ' + fmtTime(tk.T) + ', a body width from ' + Y + ' (his Unbreakable footing, as on the ' + (state.colSrc === 'jump' ? 'Jump' : 'Stomp') + ' tab). ' + suppliedText(tk) + groundShakeText(tkShake, cA.surface));
    out.push(happens(items, 10));
    out.push(caseGrid('The four cases', COL_ROWS, COL_COLS, COL_CELLS, 1, 1));
    out.push(unstoppableArt());
    out.push(math([
      'Charge: ' + srcLabel + ' → v = ' + fmtV(r.v0) + '; momentum p = γ m v = ' + (isFinite(r.pA) ? big(r.pA, 3) + ' kg·m/s' : '∞') + '.',
      'A charger who takes his own recoil keeps his speed, so he acts as a body of unbounded mass at v. In his frame ' + Y + ' arrives at v and meets an immovable body. Held without limit too, ' + Y + ' has nowhere to go in any frame: there is no momentum share that both can take.',
    ]));
    return out;
  }
  // the Collide charge's four cases (light speed and the thought experiment, and their powers' own unlimited cases)
  const COL_ROWS = ['Finite momentum (a charger who can slow)', 'Unlimited momentum (light speed, or a charger who takes his own recoil)'];
  const COL_COLS = ['Finite hold (anything real: his footing, bolts on real rock, or the whole Earth)', 'Unlimited hold (truly immovable, or held without limit by their powers)'];
  const COL_CELLS = [['Both move. They share the momentum; the softer the hit, the more energy it frees.', 'The charger stops or bounces. The object doesn’t budge, so the force was stoppable.'],
    ['The object is carried along at his speed or sent off at twice it (at light speed, knocked away at just under it; then the planet goes too, but only if he’s bolted to unbreakable ground and the charger’s recoil isn’t taken), so it was movable.', 'No answer: one of them has to give, and neither can (at light speed into a truly immovable body, ∞ ÷ ∞). The two can’t exist in the same universe.']];
  let duoRealDraw = false;
  function collideCharge(cA, cB, X, Y) {
    const gb = state.colInf ? Infinity : Math.pow(10, state.colGB);
    // (meanIt: the tab drawn for a blast preset, with the charger taking his own recoil: they mean it, so the hit's freed
    // energy is real)
    const r = P.collide(cA, cB, { source: state.colSrc, gb, bounce: state.colBounce === 'bounce', toGround: duoRealDraw, meanIt: duoMeanDraw }), out = [];
    if (r.blackHole) return [callout('At this density one of them is a black hole (see Weight). There’s nothing left to collide with.')];
    if (r.planetScale) return [callout('At this mass one of them reshapes the planet with his own gravity (see Weight). A charge across the Earth’s surface stops making sense here.')];
    if (r.noCharge) {
      const why = { cantSprint: X + ' can’t charge. At ' + fmtMass(cA.body.m) + ' his strength (' + fmtN(cA.F) + ') can’t hold up his own weight (' + fmtSI(cA.body.m * g, 'N') + '), so he can’t run. Try Set speed.', cantJump: X + ' can’t get off the ground, so he can’t land on ' + Y + '.', neverLands: X + '’s ' + (state.colSrc === 'jump' ? 'jump' : 'stomp-launch') + ' carries him off the planet. He never comes down on ' + Y + '.', boltedStomp: 'Bolted to the planet, ' + X + '’s stomp can’t launch him, so there’s nothing to land on ' + Y + '.', noLaunch: X + '’s stomp doesn’t lift him off the ground.', zero: 'Set a speed above zero.' }[r.noCharge];
      return [verdict(why)];
    }
    const sr = r.speed || {};
    const srcLabel = { sprint: 'his sprint after a ' + fmtDist(sr.runUp || 0) + ' run-up', jump: 'falling from his ' + (r.speed.apex ? fmtDist(r.speed.apex) + ' ' : '') + 'jump', stomp: 'falling back after a stomp-launch', set: 'set speed' }[state.colSrc];
    // the charger takes his own recoil and the one hit is held without limit: no physical answer, explained first
    if (r.unbounded && r.outcome === 'paradox') return out.concat(collideParadox(r, cA, cB, X, Y, srcLabel, gb));
    const splat = state.colBounce === 'splat', h = r.h, horiz = r.dir === 'h';
    const af = r.after || {};
    // the charger takes his own recoil: he doesn't slow, and the one hit is carried along or sent off (decision 1)
    const cr = r.outcome === 'carried' ? r.carry : null;
    // Unbreakable footing: would real ground have broken here (the rock round his bolts, a crater, a holder driven in)?
    // Only then does the page credit their power with holding it.
    const gReal = cB.unbreakable && !cB.groundHolds && !cB.immovable ? (() => {
      const q = P.collide(cA, Object.assign({}, cB, { unbreakable: false }), { source: state.colSrc, gb, bounce: state.colBounce === 'bounce' });
      if (!q || q.noCharge) return null;
      const rk = q.rock, sp = q.after && (splat ? q.after.splat : q.after.bounce);
      return { rock: rk, broke: rockBroke(rk) || !!(q.bolts && q.bolts.crater > 0) || !!(sp && (sp.D > 0 || (sp.depth >= 0.01 && !P.RESTRAINT.SOIL.has(cB.surface.id)))) };
    })() : null;
    let v;
    if (r.outcome === 'paradox') v = 'No answer. ' + X + ' has unlimited momentum and ' + Y + ' has unlimited inertia, so momentum conservation would have to divide one infinity by another. That has no value. Physics doesn’t settle the paradox; it says the two can’t exist together.';
    else if (cr) {
      const keep = X + (horiz ? ' hits ' : ' lands on ') + Y + ' at ' + fmtV(cr.v) + ' and doesn’t slow: he takes his own recoil, so the push back from the hit goes to his source.';
      const torn = cr.rockGives ? ' ' + Y + ' is bolted, but on real rock: the rock around his bolts tears out (at about ' + fmtSI(cr.tear, 'N') + '),' : '';
      const sB = af.bounce || {}, sS = af.splat || {};
      if (horiz && splat) v = keep + (torn ? torn + ' and he is carried along at ' + fmtV(cr.v) + ' with a plug of rock.' : ' ' + Y + ' is carried along at ' + fmtV(cr.v) + '.')
        + (cr.v >= 0.01 * K.c ? ' Past 1% of light speed ' + Y + '’s body meets the air as a fireball.' : ' When ' + X + ' stops, at the end of the squash, ' + Y + ' slides ' + (isFinite(sS.slide) ? fmtDist(sS.slide) : 'until something stops him') + ' before he stops.');
      else if (horiz) v = keep + (torn ? torn + ' and he' : ' ' + Y) + ' bounces off him and is sent off at ' + fmtV(cr.vB) + ', ' + (cr.vB >= 0.01 * K.c ? 'just under twice his speed (relativistic velocity addition)' : 'twice his speed') + (sB.slideB != null && isFinite(sB.slideB) ? ', and slides ' + fmtDist(sB.slideB) + '.' : cr.vB >= 0.01 * K.c ? '. Past 1% of light speed his body meets the air as a fireball.' : '.');
      // from above, only on real ground (Unbreakable footing off; decision 6)
      else { const s = splat ? sS : sB; v = keep + ' Unbreakable footing is off, so the ground under ' + Y + ' is real and gives: ' + (splat ? 'carried down at ' + fmtV(cr.v) : 'sent down at ' + fmtV(cr.vB) + ', twice that speed') + ', he is driven ' + (s.D > 0 ? 'in and blasts a crater up to ' + fmtDist(s.D) + ' wide.' : fmtDist(s.depth || 0) + ' into ' + theSurf(cB.surface) + '.'); }
    }
    else if (r.outcome === 'unstoppable') v = r.unlimitedVsBolted === 'closedSystem' ? 'Unbounded energy at the hit. ' + X + ' got his unlimited momentum by pushing on the same planet ' + Y + ' is bolted to, so the planet gets it straight back: the Earth ends up exactly as still as it started.'
      : r.unlimitedVsBolted === 'rockGives' ? X + ' carries unlimited momentum. The bolts are comic, the rock isn’t: ' + Y + ' is torn loose with a plug of rock and knocked away at just under light speed, with unlimited energy.'
      : r.unlimitedVsBolted === 'planetMoves' ? X + ' arrives with unlimited momentum from outside. ' + Y + ', and the unbreakable planet he’s bolted to, are knocked away at just under light speed, with unlimited energy.'
      : X + ' carries unlimited momentum. Nothing with finite mass can stop him: ' + Y + ' is knocked away at just under light speed, with unlimited energy.';
    else if (r.outcome === 'boltsLate') v = 'Too fast for the planet to brace ' + Y + ': the hit is over in ' + fmtTime(r.contact.soft.t) + ', before the rock under his bolts can respond. They move off together at ' + fmtV(h.inel.V) + ', and a moment later the bolts stop them, dumping ' + (isFinite(r.bolts.Eground) ? fmtTNT(r.bolts.Eground) : 'unbounded energy') + ' into the ground' + (r.bolts.crater > 0 ? ' (a crater up to ' + fmtDist(r.bolts.crater) + ' across)' : '') + '.';
    // (the thought experiment sets the charger's own recoil aside: decision 4)
    else if (r.outcome === 'immovable') v = Y + ' is truly immovable here (infinite mass, a thought experiment), so ' + X + (splat ? ' stops dead' : ' bounces back at ' + speedOnly(Math.abs(h.el.vA))) + '. All ' + fmtTNT(h.KA) + ' of his energy is ' + (splat ? 'freed at the hit.' : 'handed back to him as motion.') + (cA.ownRecoil ? ' (The thought experiment sets ' + X + '’s own recoil aside too: it is about the test, not their powers.)' : '');
    else if (r.held && horiz) v = Y + ' doesn’t budge. ' + X + (splat ? ' stops dead against him' : ' bounces straight back at ' + speedOnly(Math.abs(h.el.vA))) + ', and the blow goes through ' + (cB.anchor === 'bolted' ? 'his bolts' : 'his feet') + ' into the planet.';
    else if (r.held) v = Y + ' doesn’t budge: ' + (cB.anchor === 'bolted' ? 'his bolts hold' : cB.groundHolds ? 'the ground is treated as holding' : cB.unbreakable ? 'the ground under him can’t give (Unbreakable footing)' : 'the ground under him holds') + '. ' + X + (splat ? ' stops on his head.' : ' bounces back up at ' + speedOnly(Math.abs(h.el.vA)) + '.');
    else if (horiz && splat) {
      const s = af.splat || {};
      if (s.V >= 0.01 * K.c) v = X + ' hits ' + Y + ' at ' + fmtSpeed(r.vRel) + '. The two of them carry on together at ' + fmtSpeed(s.V) + ', a fireball.';
      else if (s.moved < 1) v = X + ' hits ' + Y + ' at ' + speedOnly(r.vRel) + '. ' + Y + '’s footing takes most of it: he’s shoved back ' + fmtDist(s.moved) + '.';
      else v = X + ' hits ' + Y + ' at ' + speedOnly(r.vRel) + '. ' + Y + ' is knocked back at ' + speedOnly(s.V) + ' and the two slide ' + (isFinite(s.moved) ? fmtDist(s.moved) : 'until something stops them') + ' before they stop.';
    } else if (horiz) {
      const b = af.bounce || {};
      v = Math.abs(b.vA) < 1e-6 * r.vRel ? X + ' stops dead and ' + Y + ' flies off at ' + speedOnly(b.vB) + ', like Newton’s cradle.' : X + (b.vA < 0 ? ' bounces back at ' + speedOnly(Math.abs(b.vA)) : ' keeps going at ' + speedOnly(b.vA)) + ' and ' + Y + ' is knocked away at ' + speedOnly(b.vB) + '.';
    } else if (splat) { const s = af.splat || {}; v = X + ' lands on ' + Y + ' at ' + speedOnly(r.vRel) + '. The ground gives: the two are driven ' + fmtDist(s.depth || 0) + ' into ' + theSurf(cB.surface) + (s.D > 0 ? ' and blast a crater up to ' + fmtDist(s.D) + ' wide.' : '.'); }
    else { const b = af.bounce || {}; v = Y + ' is driven ' + fmtDist(b.depth || 0) + ' into ' + theSurf(cB.surface) + '; ' + X + (Math.abs(b.vA) < 0.01 ? ' stops on top.' : ' bounces back up at ' + speedOnly(Math.abs(b.vA)) + '.'); }
    if (r.dragged) v += ' Their gravity drags them together before anyone charges.';
    else if (r.gravBoost) v += ' ' + Y + '’s gravity pulls ' + X + ' in: he arrives at ' + speedOnly(r.vRel) + ' however fast he ran.';
    out.push(verdict(v));
    const Q = splat ? h.Q : 0, F = r.contact ? (splat ? r.contact.soft : r.contact.softEl) : null;
    const chips = [status('info', 'Charge: ' + fmtV(r.v0) + ' (' + srcLabel + ')')];
    if (r.v0 >= 0.01 * K.c) chips.push(status('bad', 'Fireball on the way in'));
    else if (r.v0 >= 1000) chips.push(status(r.v0 >= 3000 ? 'bad' : 'warn', 'Air ahead of him heats to ' + big(P.stagnationT(r.v0) - 273.15, 2) + ' °C'));
    else if (r.v0 >= K.a0) chips.push(status('warn', 'Sonic boom on the way in'));
    if (cr) {
      chips.push(status('info', X + ' doesn’t slow: his recoil goes to his source'));
      chips.push(status('bad', cr.rockGives ? Y + ' torn loose with a plug of rock' : !horiz ? Y + ' driven into the ground' : splat ? Y + ' carried along at ' + fmtV(cr.v) : Y + ' sent off at ' + fmtV(cr.vB)));
      if (splat && r.hitAbsorbed && r.hitAbsorbed.E > 0) chips.push(status('info', 'The hit’s energy is taken back: their power'));
      else if (splat && r.meanIt) chips.push(status('warn', 'He means it: the hit’s energy is real'));
    }
    else if (cB.immovable) chips.push(status('info', 'Thought experiment: infinite mass'));
    else if (r.dragged) chips.push(status('bad', 'Gravity drags ' + Y + ' in first'));
    else if (r.held && cB.anchor === 'bolted') chips.push(status('info', 'Bolted: Earth takes the blow'));
    else if (r.held && P.holdsGround(cB) && !horiz && (cB.groundHolds || (gReal && gReal.broke))) chips.push(status('info', cB.groundHolds ? 'Ground treated as holding takes the blow' : 'The ground holds the blow: their power'));
    else if (r.held) chips.push(status(r.heldOnlyIfSquishy ? 'warn' : 'good', Y + ' holds: ' + fmtN(r.hold.H) + ' vs a ' + fmtSI(r.Fheld, 'N') + ' hit' + (r.heldOnlyIfSquishy ? ' (only if they’re squishy)' : '')));
    else if (r.unlimitedVsBolted === 'rockGives') chips.push(status('bad', 'Rock gives way around his bolts'));
    else if (r.outcome === 'boltsLate') chips.push(status('bad', 'Too fast for the bolts to help'));
    else if (r.outcome === 'moved') chips.push(status('bad', Y + ' gives: holds ' + fmtN(r.hold.H) + ', needs ' + fmtN(r.Fheld)));
    chips.push(rockChip(r.rock, gReal && gReal.rock));
    // Unbreakable footing: the hit's push reaches the ground through the holder's feet and shakes it (the stomp's
    // ground-wave model), in place of the quake estimate from all of the hit's energy
    const gShake = groundShake(cB.surface, r.toGround);
    // ... and the charger's own take-off (his jump's push-off or his stomp-launch), with his Unbreakable footing on
    const tk = chargeTakeoff(r, cA), tkShake = groundShake(cA.surface, tk);
    if (tkShake && (!gShake || tkShake.plaster > gShake.plaster || (tkShake.plaster === gShake.plaster && tkShake.feel > gShake.feel))) chips.push(groundShakeChip(tkShake, cA.surface, X + '’s take-off'));
    else if (gShake) chips.push(groundShakeChip(gShake, cB.surface, 'The hit'));
    else if (r.held && splat && isFinite(h.Q) && h.Q > 0 && !cB.immovable) chips.push(quakeChip(h.Q, r.quakeHeld));
    if (r.partial && r.hold.H / r.Fheld > 0.1) chips.push(status('info', 'His footing soaks up part of the blow'));
    if (!splat && r.elasticUpper) chips.push(status('info', cr && cr.rockGives ? 'Bounce ignores the rock holding him (upper bound)' : 'Bounce ignores his footing (upper bound)'));
    out.push(el('div', { class: 'status-row' }, chips));
    let holderTile = null;
    if (cr) holderTile = !horiz ? tile(Y + ' driven into the ground', (splat ? af.splat : af.bounce).D > 0 ? 'a crater' : fmtDist((splat ? af.splat.depth : af.bounce.depth) || 0), (splat ? af.splat : af.bounce).D > 0 ? 'up to ' + fmtDist((splat ? af.splat : af.bounce).D) + ' wide' : cB.surface.short)
      : speedTile(Y + (splat ? ' carried along at' : ' sent off at'), splat ? cr.v : cr.vB, (() => { const x = splat ? af.splat.slide : af.bounce.slideB; return x != null && isFinite(x) ? 'then slides ' + fmtDist(x) + (splat ? ' once ' + X + ' stops' : '') : ''; })());
    else if (r.outcome === 'unstoppable') holderTile = r.unlimitedVsBolted === 'closedSystem' ? tile(Y + ' moves', 'not overall', 'the planet gets its momentum back') : tile(Y + ' moves', 'just under light speed', r.unlimitedVsBolted === 'rockGives' ? 'torn loose with a plug of rock' : 'unlimited momentum');
    else if (r.held || r.outcome === 'immovable') holderTile = tile(Y + ' moves', 'not at all', holdWhy[r.hold.why] || '');
    else if (horiz) holderTile = speedTile(Y + ' knocked back at', splat ? af.splat.V : af.bounce.vB, splat && isFinite(af.splat.moved) ? 'moves ' + fmtDist(af.splat.moved) + ' in all' : '');
    else holderTile = tile(Y + ' driven into the ground', fmtDist((splat ? af.splat.depth : af.bounce.depth) || 0), cB.surface.short);
    // the hit's freed energy with the charger's power on: taken back by default, real only when he means it (decision 5)
    const eSub = !cr ? null : r.meanIt ? ' · real: he means it (this preset)' : ' · taken back by default (canon); it will show as his shimmer';
    out.push(tiles(
      isFinite(r.vRel) && r.vRel < K.c * (1 - 1e-12) ? speedTile(state.colSrc === 'set' ? 'Speed at contact' : 'Charge speed', r.vRel, r.gravBoost ? 'his own run: ' + speedOnly(r.v0) : srcLabel + (state.colSrc === 'sprint' && sr.vTopRun > 1.05 * r.v0 && isFinite(sr.x95) ? ' (his top speed, ' + speedOnly(sr.vTopRun) + ', takes about ' + fmtDist(sr.x95) + ')' : '')) : tile('Charge speed', 'just under light speed', 'unlimited momentum'),
      tile('Energy freed at the hit', splat ? (isFinite(Q) ? fmtSI(Q, 'J') : 'unbounded') : 'none', splat ? (isFinite(Q) ? fmtTNT(Q) + (eSub || ' · ' + compareEnergy(Q)) : '') : 'a perfect bounce keeps it as motion; a splat frees ' + (isFinite(h.Q) ? fmtTNT(h.Q) : 'unbounded energy') + (cr ? ', taken back by default' : '')),
      holderTile,
      F ? tile('Force of the hit', isFinite(F.F) ? fmtSI(F.F, 'N') : 'unbounded', isFinite(F.F) ? 'over ' + fmtTime(F.t) + ' (plush squash, estimate)' : '') : null,
      // the momentum the charger's source supplies (canon's case 'their own recoil')
      cr ? tile(X + '’s source supplies', pushFig({ J: cr.supplied }), cr.footJ > 0 ? Y + '’s gain, ' + pushFig({ J: cr.pGain }) + ', plus what his ' + (cr.rockGives ? 'rock' : 'footing') + ' hands the ground' : 'all of ' + Y + '’s gain') : null,
      // a massive body never reaches light speed: unlimited momentum reads 'just under light speed', never 3 x 10^8 m/s
      r.unlimitedVsBolted === 'planetMoves' ? tile('Earth', 'just under light speed', 'knocked away with ' + Y)
        : r.unlimitedVsBolted === 'closedSystem' ? tile('Earth', 'ends up still', 'it gets its own momentum back')
        : r.held && r.earth && isFinite(r.pA) ? tile('Earth’s speed change', sci(splat ? r.earth.dvSplat : r.earth.dvBounce, 2) + ' m/s', r.earth.t1mm > COLAGE ? 'it would take ' + big(r.earth.t1mm / COLAGE, 2) + '× the age of the universe to move 1 mm' : 'it would take ' + fmtDuration(r.earth.t1mm) + ' to move 1 mm') : null));
    if (r.contact && F && isFinite(F.F) && F.F > 0) {
      const ct = r.contact;
      const rows = [
        cr && cr.rockGives ? { label: 'What holds ' + Y + ': the rock around his bolts', value: cr.tear, highlight: false } : { label: 'What holds ' + Y, value: r.hold.H, text: isFinite(r.hold.H) ? null : (cB.anchor === 'bolted' ? 'no limit (bolted)' : 'no limit'), highlight: false },
        { label: 'The hit, plush squash', value: F.F, highlight: true },
        r.vRel < 36100 ? { label: 'As stiff as any real material', value: ct.matter.F } : null,
        { label: 'Stiffest body physics allows', value: ct.light.F },
      ].filter(Boolean);
      out.push(logBars('Forces at the hit', rows, (x) => fmtSI(x, 'N')));
      out.push(el('p', { class: 'muted', style: 'font-size:.85rem', text: 'A perfectly rigid body would make the hit infinite. Relativity forbids one, so the hit is never infinite.' }));
    }
    // (carried: the real energy near the hit, Elocal: the splat's only when he means it, plus past 1% of light speed the
    // one hit's motion in the air and the run-up's air)
    const Eb = cr ? r.Elocal : r.Elocal != null && (r.relativistic || r.outcome === 'boltsLate') ? r.Elocal : (splat ? Q : 0);
    if (isFinite(Eb) && Eb > 0) {
      // a blast wave needs the energy released faster than sound crosses the damage zone
      const tRel = F ? F.t : 0, Rb = P.blastRadius(Eb, 6900);
      if (tRel * K.a0 > Math.max(Rb, 0.5)) out.push(callout('A loud thump: the hit lasts ' + fmtTime(tRel) + ', too slow to make a blast wave, so the ' + fmtTNT(Eb) + ' goes into heating and squashing them.'));
      else out.push(blastBlock(Eb, cr ? (r.relativistic ? Y + '’s motion and the air on the way in, near the hit' : 'where they meet (he means it)') : r.relativistic || r.outcome === 'boltsLate' ? 'everything he carried, released where they meet' : 'where they meet'));
    } else if (!isFinite(Eb)) out.push(callout('The energy is unbounded, so no finite blast radius applies.'));
    const items = [];
    const hb = r.hold;
    if (cr) {
      // momentum still balances: the charger's source supplies what the one hit gains (canon's case 'their own recoil')
      items.push('Momentum still balances, and canon says where it comes from. ' + X + ' doesn’t slow, so everything ' + Y + ' gains (' + pushFig({ J: cr.pGain }) + ')' + (cr.footJ > 0 ? ', and what ' + (cr.rockGives ? 'the rock around his bolts' : 'his footing') + ' hands the ground during the hit (' + pushFig({ J: cr.footJ }) + '),' : '') + ' comes from ' + X + '’s source: ' + pushFig({ J: cr.supplied }) + (cr.footJ > 0 ? ' in all' : '') + '. That is canon’s case “their own recoil”: the push back from his own hit goes to his source. ' + (splat ? 'A splat frees ' + Y + '’s motion energy as ' + X + ' sees it (below).' : 'A perfect bounce frees no energy.'));
      items.push('“Immovable” only means what holds ' + Y + ' in place. Against a charger who can’t slow, any hold with a limit gives: here ' + (cr.rockGives ? 'the rock around his bolts, which tears out at about ' + fmtSI(cr.tear, 'N') + ' on ' + cB.surface.short : horiz ? (holdWhy[hb.why] || 'his footing') + ', ' + fmtN(hb.H) : 'the ground under his feet, which bears ' + fmtN(hb.H) + ' on ' + cB.surface.short) + '. Only a hold their powers make limitless can’t give (bolts on ground that Unbreakable footing keeps whole, or Unbreakable footing holding him up from below), and then there is no answer.');
      // how long the one hit is carried (decision 2): the charger's choice; the lab ends it at the end of the squash
      items.push(horiz && splat ? 'How far ' + X + ' carries him is up to ' + X + ': he never slows, so he could push on for as long as he likes. The lab ends the carry at the end of the squash, ' + fmtTime(cr.T) + ' in: ' + X + ' stops himself there (his own push, so its push back, ' + pushFig(cr.stop) + ', goes to his source too), and ' + Y + ' slides on from ' + fmtV(cr.v) + '.'
        : horiz ? 'In a perfect bounce ' + Y + ' leaves him as the hit ends. ' + X + ' never slows, so the lab has him stop himself then (his own push, so its push back, ' + pushFig(cr.stop) + ', goes to his source too).'
          : 'Unbreakable footing is off here, so the ground under ' + Y + ' is real: driven down at ' + X + '’s speed, he goes in as the lab drives any landing in (its penetration model, an estimate). ' + X + ' never slows, so the lab has him stop himself as the hit ends (his own push, its push back to his source).');
      // the hit's freed energy (decision 5)
      if (splat && isFinite(h.Q) && h.Q > 0) items.push('The hit frees ' + fmtSI(h.Q, 'J') + ' (' + fmtTNT(h.Q) + '): ' + Y + '’s motion energy as ' + X + ' sees it. Canon: a hit’s freed energy is taken back by default (it will show as his shimmer) and is real only when he means it. ' + (r.meanIt ? 'This preset means it, so here it is real.' : 'The lab reads a blast preset (rattle the windows, break windows, flatten houses, a block) as meaning it.'));
    } else {
      items.push('Momentum is never lost. Whatever ' + X + ' brings in, the two of them (plus whatever holds ' + Y + ') carry away. A splat shares it and frees the rest of the energy as heat, sound and blast. A perfect bounce keeps all the energy as motion. Soft bodies sit near the splat end.');
      const whyText = { footing: ' Standing on ' + cB.surface.short + ', friction holds him with ' + fmtN(hb.R) + '. Stopping ' + X + ' dead takes ' + fmtN(r.Fheld) + ', so he ' + (r.held ? 'holds.' : 'gets knocked back.'), strength: ' His footing could hold ' + fmtN(hb.R) + ', but his muscles keep his stance against only ' + fmtN(cB.F) + '.', lying: ' At ' + fmtMass(cB.body.m) + ' he’s too heavy for his strength to stand, so he lies flat and friction alone holds him: ' + fmtN(hb.R) + '.', bearing: ' Bracing can’t help against a blow from above. Only the ground under his feet holds him up: ' + fmtN(hb.H) + ' on ' + cB.surface.short + '.', bolted: r.unlimitedVsBolted === 'rockGives' ? ' Bolted, he would be part of the planet, but the bolts hold only as well as the rock around them. The rock around his bolts tears out, so the Earth keeps almost none of the momentum.' : ' Bolted, he is part of the planet: the bolts hand the momentum to the Earth’s 5.97 × 10²⁴ kg.', comicGround: ' On ground treated as holding nothing gives under him, so the Earth takes it.', unbreakable: ' With Unbreakable footing nothing gives under him, so the Earth takes it.', immovable: ' Here he gets infinite mass, which no real setting allows. Even bolted to an unbreakable planet he would be only as immovable as the Earth’s 5.97 × 10²⁴ kg.' }[hb.why] || '';
      items.push('“Immovable” only means what holds ' + Y + ' in place.' + whyText + (horiz && hb.why !== 'bolted' && hb.why !== 'immovable' && hb.why !== 'lying' ? ' (A standing body hit at chest height would tip over at a few hundred newtons long before his feet slide; the sim assumes he braces low.)' : ''));
    }
    if (r.heldOnlyIfSquishy) items.push('That depends on the squash: he holds only if they’re as squishy as plush. Two ordinary solids would hit harder for a shorter time and knock him loose.');
    if (r.outcome === 'boltsLate') items.push('In ' + fmtTime(r.contact.soft.t) + ' a stress wave in rock travels only about ' + fmtDist(P.COL.C_ROCK * r.contact.soft.t) + ' (at about ' + sig(P.COL.C_ROCK / 1000, 2) + ' km/s, an estimate), so the planet can’t brace him during the hit. Momentum still ends up in the Earth once the bolts catch them, along with the rest of the energy: ' + (isFinite(r.bolts.Eground) ? fmtSI(r.bolts.Eground, 'J') : 'unbounded') + '.');
    if (r.airStopsHim) items.push('At this speed the air over the last ' + fmtDist(r.d0) + ' would take more energy than he carries: he can’t arrive at this speed through air. Read the set speed as his speed at contact.');
    if (r.outcome === 'unstoppable' || r.outcome === 'paradox') items.push('An unstoppable force would need unlimited momentum, so nothing with finite mass could stop it. An immovable object would need unlimited inertia, so nothing with finite momentum could move it. Put them together and momentum conservation asks for ∞ ÷ ∞, which has no value. So the two can’t exist in the same universe: if one does, the other doesn’t. That is the usual answer to the paradox. (In real physics neither can exist at all: unlimited momentum needs unlimited energy.)');
    else if (r.contact && isFinite(h.Q) && h.Q > 0) items.push('How hard they hit depends on how squishy they are, which nobody knows for an indestructible plush. If they squash by a quarter of the smaller body’s thickness (' + fmtDist(r.contact.s) + ' in all), the hit lasts ' + fmtTime(F.t) + ' and pushes with about ' + fmtSI(F.F, 'N') + '. A perfectly rigid body would make the force infinite, but relativity forbids one: no push travels through a body faster than light. Even the stiffest body physics allows takes ' + fmtTime(r.contact.light.t) + ' to stop, which limits the average force to about ' + fmtSI(r.contact.light.F, 'N') + '.');
    if (r.relativistic) items.push('At ' + fmtV(r.v0) + ' the air ahead of ' + X + ' can’t get out of the way: it’s shock-heated into plasma.' + (isFinite(r.airRunUp) ? ' His last ' + fmtDist(r.d0) + ' of run-up alone dumps very roughly ' + fmtTNT(r.airRunUp) + ' into the air before he arrives.' : '') + (cr ? ' Carried off at that speed, ' + Y + '’s body meets real air too (their own bodies do), so his motion ends up as heat near the hit.' : ''));
    if (r.gravBoost) items.push('At this density, gravity between them matters. Starting ' + fmtDist(r.d0) + ' apart, their pull alone brings ' + X + ' in at ' + speedOnly(r.fall.vRel) + '.' + (r.bound ? ' They’re bound together: after a bounce they fall back.' : '') + (r.dragged ? ' The pull (' + fmtSI(r.gNear.F, 'N') + ') beats what holds ' + Y + ', so it drags him in too.' : ''));
    if (!isFinite(cA.F) && r.outcome !== 'unstoppable' && r.outcome !== 'paradox' && state.colSrc === 'sprint') items.push(cr ? 'Unlimited strength doesn’t make his charge any faster: a charge needs grip. On ' + cA.surface.short + ' his feet push off with only ' + fmtSI(r.speed.run ? r.speed.run.thrust : 0, 'N') + ', so he tops out at ' + speedOnly(r.v0) + '. (At the hit he doesn’t slow: his own recoil goes to his source.)' : 'Infinite strength isn’t unstoppable: a charge needs grip. On ' + cA.surface.short + ' his feet push off with only ' + fmtSI(r.speed.run ? r.speed.run.thrust : 0, 'N') + ', so he tops out at ' + speedOnly(r.v0) + '.');
    if (!isFinite(cB.F) && (r.outcome === 'moved' || (cr && horiz && !cr.rockGives))) items.push('Infinite strength isn’t immovable either: holding still needs footing, and his feet give at ' + fmtN(hb.R) + '.');
    if (r.held && r.earth && isFinite(r.pA)) items.push('The Earth takes the momentum: its speed changes by ' + sci(splat ? r.earth.dvSplat : r.earth.dvBounce, 2) + ' m/s.' + (r.earth.runUpCancels ? ' And ' + X + ' got his speed by pushing on the Earth in the first place, so the Earth just gets its own momentum back and ends up exactly as still as it started.' : ' Arriving from outside, his momentum stays with the Earth' + (r.earth.dayChange > 0 ? '; if he hits along the equator, the day gets ' + fmtTime(r.earth.dayChange) + ' longer or shorter.' : '.')));
    // the rock figures come from the steady crush (the splat's force) in both modes
    const rb = rockBullet(r.rock, r.rock && r.rock.C, cB);
    items.push(rb && !splat && r.rock && isFinite(r.rock.rT) ? rb + ' (That is the steady crush; a perfect bounce peaks at twice it, briefly.)' : rb);
    if (r.toGround) items.push((gReal && gReal.broke ? 'Unbreakable footing: the ground under ' + Y + ' doesn’t break, but the push still goes in. ' : 'The push still goes into the ground under ' + Y + '. ') + (r.toGround.how === 'held' ? 'Held, he hands the hit’s momentum to the planet' : r.toGround.how === 'carried' ? (cr && cr.rockGives ? 'Carried along, the rock around his bolts hands the ground what it carried as it tore' : horiz ? 'Carried along, his footing hands the ground what it held during the hit' : 'Driven into the ground, he hands it what it bore under him during the hit') : horiz ? 'Knocked back, the ground takes what his footing held during the hit' : 'Driven into the ground, he hands it what it bore under him during the hit') + ': ' + pushFig(r.toGround) + ' over ' + fmtTime(r.toGround.T) + (r.toGround.T > (F ? F.t : 0) * (1 + 1e-9) ? ' (it reaches the ground through his legs, which spread it over at least a stamp’s contact time, an estimate)' : '') + '. ' + suppliedText(r.toGround) + groundShakeText(gShake, cB.surface));
    if (tk) items.push('The take-off goes into the ground too: ' + tk.what + ', ' + pushFig(tk) + ' over ' + fmtTime(tk.T) + ', a body width from the hit (his Unbreakable footing, as on the ' + (state.colSrc === 'jump' ? 'Jump' : 'Stomp') + ' tab). ' + suppliedText(tk) + groundShakeText(tkShake, cA.surface));
    out.push(happens(items, 10));
    out.push(caseGrid('The four cases', COL_ROWS, COL_COLS, COL_CELLS, isFinite(r.pA) && !cr ? 0 : 1, cB.immovable ? 1 : 0));
    out.push(unstoppableArt());
    out.push(math([
      'Charge: ' + srcLabel + ' → v = ' + fmtV(r.v0) + '; momentum p = γ m v = ' + (isFinite(r.pA) ? big(r.pA, 3) + ' kg·m/s' : '∞') + '.',
      r.gravBoost ? 'Gravity on the way in: v_rel² = v² + 2G(m₁+m₂)(1/d − 1/d₀), d₀ = ' + fmtDist(r.d0) + ', d = ' + fmtDist(r.dC) + ' → ' + speedOnly(r.vRel) + '.' : null,
      // the charger who takes his own recoil: the immovable sums with the roles swapped (the brief's 'after Q13' sums)
      cr ? 'A charger who takes his own recoil doesn’t slow, so he acts as a body of unbounded mass at speed v. In his frame ' + Y + ' arrives at v and meets an immovable body: a splat stops ' + Y + ' against him, so in the ground frame ' + Y + ' leaves with him at v; a perfect bounce sends ' + Y + ' back at v in his frame, so in the ground frame ' + Y + ' leaves at v′ = 2v/(1 + v²/c²) (relativistic velocity addition: c tanh 2w, w his rapidity).' : 'Splat: they move off as one body. Invariant mass M = √(m₁² + m₂² + 2m₂E₁/c²); energy freed Q = (M − m₁ − m₂)c² (½μv² below 1% of light speed, μ = m₁m₂/(m₁+m₂)).',
      cr ? 'Momentum ' + Y + ' gains: γ m v (splat) or 2γ² m v (bounce), here ' + big(cr.pGain, 3) + ' kg·m/s. ' + X + '’s source supplies it, plus what ' + Y + '’s ' + (cr.rockGives ? 'rock' : 'footing') + ' hands the ground during the hit (its hold, at most the hit’s force, × the hit’s time; none in the bounce bound): ' + big(cr.supplied, 3) + ' kg·m/s. Energy freed in a splat: ' + Y + '’s motion energy in ' + X + '’s frame, (γ − 1) m c² (½ m v² below 1% of light speed) = ' + (isFinite(h.Q) ? fmtSI(h.Q, 'J') : 'unbounded') + '.' : 'Perfect bounce: each body’s momentum reverses in the centre-of-momentum frame. Below 1% of light speed: v₁′ = (m₁−m₂)/(m₁+m₂)·v, v₂′ = 2m₁/(m₁+m₂)·v.',
      r.held && !cB.immovable ? 'Held: ' + Y + ' and the Earth act as one body; Earth’s Δv = p/(m + M_Earth).' : null,
      r.contact ? 'Force: squash s = ½ × the smaller depth = ' + fmtDist(r.contact.s) + '; F = Q/s (splat) or 2Q/s peak (bounce). Ordinary solids and liquids at everyday pressures can’t carry sound faster than about 36 km/s; nothing travels faster than light, which limits the average force.' : null,
      state.colSrc === 'sprint' ? 'Run-up: m u du/dx = T − k u², so u = u_top √(1 − e^(−2kx/m)) over x = ' + fmtDist(sr.runUp || 0) + ', capped by his legs.' : null,
      'Slide: x = m/(2k)·ln(1 + kV²/R), k = ½ρ₀C_dA.',
      cr && cr.rockGives ? 'Rock: the rock around his bolts tears out at its shear strength × the buried area of his feet, about ' + fmtSI(cr.tear, 'N') + ' here (an estimate).' : cB.anchor === 'bolted' ? 'Rock: a force C spread over a half-sphere of radius r averages C/(2πr²); granite pulls apart at 8.4 MPa and crushes at 200 MPa, so r = √(C/2πσ).' : null,
      'Blast radii: Kinney & Graham (1985), as if all of Q became a blast (upper bound). ' + (r.toGround ? 'Ground shaking (' + (duoRealDraw ? 'real ground: Break the ground sets Unbreakable footing aside' : 'Unbreakable footing') + '): the momentum the ground takes, J, as a pulse over the longer of the contact time and a limb’s contact time T (peak force 2J/T: his legs spread it), through the same ground-wave model as the stomp; plaster by the USBM RI 8507 safe level at the pulse’s frequency.' : cB.immovable ? 'A truly immovable body needs no ground, so nothing reaches it: no quake.' : 'Quake: 1 part in 10,000 of Q (the usual share, give or take ⅔ of a magnitude), as if all of Q reached the ground, which overstates it.'),
      X === 'Ollie' ? 'Ollie’s horns don’t change the momentum or the energy; they only put the force on a smaller patch.' : null,
    ]));
    return out;
  }
