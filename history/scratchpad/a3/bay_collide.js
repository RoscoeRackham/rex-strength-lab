  // ---------------------------------------------------------------- unstoppable force vs immovable object
  const COL_PRESETS = [[10, '10 m/s'], [340.29, 'Speed of sound'], [1000, '1 km/s'], [11186, 'Escape speed'], [0.01, '1% of light'], [0.5, '50%'], [0.9, '90%'], [0.9999, '99.99%']];
  const gbOfV = (v) => { const b = v / K.c; return b / Math.sqrt(1 - b * b); };
  const vOfGb = (gb) => (isFinite(gb) ? K.c * gb / Math.sqrt(1 + gb * gb) : K.c);
  function chipRow(label, id, opts, cur, set) {
    return el('div', { class: 'field', style: 'margin-top:0;flex:1 1 100%' }, el('span', { class: 'lbl', id: id + '-lbl', text: label }),
      el('div', { class: 'chips', role: 'group', 'aria-labelledby': id + '-lbl', style: 'margin-top:0' }, opts.map(([v, t]) => el('button', { type: 'button', class: 'chip', id: id + '-' + v, 'aria-pressed': String(cur === v), onclick: () => { set(v); update(); } }, t))));
  }
  function collideControls() {
    const push = state.colMode === 'push';
    const X = state.colWho === 'ollie' ? 'Ollie' : 'Rex', Y = X === 'Ollie' ? 'Rex' : 'Ollie';
    const parts = [
      chipRow('Test', 'cm', [['charge', 'Charge'], ['push', 'Push']], state.colMode, (v) => { state.colMode = v; }),
      chipRow('Who', 'cw', [['ollie', 'Ollie ' + (push ? 'pushes' : 'charges') + ', Rex holds'], ['rex', 'Rex ' + (push ? 'pushes' : 'charges') + ', Ollie holds']], state.colWho, (v) => { state.colWho = v; }),
    ];
    if (!push) {
      parts.push(chipRow('Charge speed', 'cs', [['sprint', 'His sprint'], ['jump', 'Jump onto him'], ['stomp', 'Stomp-launch onto him'], ['set', 'Set speed']], state.colSrc, (v) => { state.colSrc = v; }));
      if (state.colSrc === 'set') {
        const v = state.colInf ? K.c : vOfGb(Math.pow(10, state.colGB));
        const f = el('div', { class: 'field', style: 'flex:1 1 100%' }, el('label', { for: 'col-gb', text: 'Speed: ' + (state.colInf ? 'light speed (unlimited momentum)' : fmtSpeed(v)) }));
        const r = el('input', { id: 'col-gb', type: 'range', min: '-8.48', max: '4', step: '0.01', value: String(state.colGB), disabled: state.colInf || null });
        r.oninput = (e) => { state.colGB = Number(e.target.value); f.querySelector('label').textContent = 'Speed: ' + fmtSpeed(vOfGb(Math.pow(10, state.colGB))); scheduleBay(); };
        f.append(r, el('div', { class: 'chips', role: 'group', 'aria-label': 'Speed presets', style: 'margin-top:4px' }, COL_PRESETS.map(([x, t]) => {
          const gb = x < 1 ? x / Math.sqrt(1 - x * x) : gbOfV(x);
          return el('button', { type: 'button', class: 'chip', id: 'cv-' + String(x).replace('.', '_'), 'aria-pressed': String(!state.colInf && Math.abs(Math.log10(gb) - state.colGB) < 0.005), onclick: () => { state.colInf = false; state.colGB = Math.log10(gb); update(); } }, t);
        })), el('label', { class: 'check' }, el('input', { type: 'checkbox', id: 'col-inf', checked: state.colInf || null, onchange: (e) => { state.colInf = e.target.checked; update(); } }), el('span', { text: 'Light speed (unlimited momentum)' })));
        parts.push(f);
      }
      parts.push(chipRow('The hit', 'cb', [['splat', 'Splat (no bounce)'], ['bounce', 'Perfect bounce']], state.colBounce, (v) => { state.colBounce = v; }));
    }
    parts.push(el('label', { class: 'check', style: 'flex:1 1 100%' }, el('input', { type: 'checkbox', id: 'col-imm', checked: state.colImm || null, onchange: (e) => { state.colImm = e.target.checked; update(); } }), el('span', { text: 'Make ' + Y + ' truly immovable (infinite mass, a thought experiment)' })));
    return el('div', { class: 'bay-controls' }, parts);
  }
  function caseGrid(title, rows, cols, cells, ar, ac) {
    const t = el('table', { class: 'cases' }, el('caption', { text: title }),
      el('thead', {}, el('tr', {}, el('th', { scope: 'col' }), cols.map((c) => el('th', { scope: 'col', text: c })))),
      el('tbody', {}, rows.map((r, i) => el('tr', {}, el('th', { scope: 'row', text: r }), cols.map((c, j) => el('td', { class: i === ar && j === ac ? 'on' : null, 'aria-current': i === ar && j === ac ? 'true' : null, 'data-col': c, text: cells[i][j] }))))));
    return el('div', { class: 'cases-wrap' }, t);
  }
  const holdWhy = { footing: 'his footing', strength: 'his strength', lying: 'lying flat: friction only', bolted: 'bolted', immovable: 'truly immovable', comicGround: 'comic ground', bearing: 'the ground under him' };
  function bayCollide() {
    let cR = ctx(), cO = ctxOllie();
    const out = [collideControls(), duoHeader(cR, cO)];
    out.push(el('p', { class: 'muted', style: 'font-size:.9rem', text: 'What happens when an unstoppable force meets an immovable object? Two ways to ask it: a push, and a charge.' }));
    const gate = duoGate(cR, cO);
    if (gate && gate.stop) { out.push(callout(gate.text)); return out; }
    if (gate) { out.push(callout(gate.text)); cR = Object.assign({}, cR, { groundHolds: true }); cO = Object.assign({}, cO, { groundHolds: true }); }
    const ollieX = state.colWho === 'ollie';
    const X = ollieX ? 'Ollie' : 'Rex', Y = ollieX ? 'Rex' : 'Ollie';
    const cA = ollieX ? cO : cR, cB = Object.assign({}, ollieX ? cR : cO, state.colImm ? { immovable: true } : {});
    return out.concat(state.colMode === 'push' ? collidePush(cA, cB, X, Y) : collideCharge(cA, cB, X, Y));
  }
  function rockBullet(rock, F, cB) {
    if (!rock || rock.comic) return null;
    return 'The bolts are comic; the rock isn’t. The blow loads the rock around his bolts with ' + fmtSI(F, 'N') + ': granite pulls apart within about ' + fmtDist(rock.rT) + ' and is crushed within about ' + fmtDist(rock.rC) + (rock.tear > 1 ? ', and ' + theSurf(cB.surface) + ' on top tears at ' + fmtRatio(rock.tear) + ' its limit' : '') + '.' + (rock.planet ? ' That is more than the gravity holding the Earth’s two halves together (about 1.1 × 10²⁵ N): the planet itself would come apart.' : rock.beyondCrust ? ' That reaches deeper than the crust (41 km on average under continents), where this estimate stops.' : '');
  }
  function rockChip(rock) {
    if (!rock) return null;
    if (rock.comic) return status('info', 'Comic ground: the rock can’t crack');
    if (rock.planet) return status('bad', 'Planet-scale load on the rock');
    if (rock.rT >= 0.05) return status('bad', 'Rock cracks ' + fmtDist(rock.rT) + ' around his bolts');
    return status('good', 'Rock around his bolts holds');
  }
  function collidePush(cA, cB, X, Y) {
    const r = P.standoff(cA, cB), out = [];
    if (r.blackHole) return [callout('At this density one of them is a black hole (see Weight). There’s nothing left to push.')];
    let v;
    if (r.outcome === 'paradox') v = 'No answer. An unlimited push meets an unlimited hold on ground that can’t break, and infinity minus infinity has no value. Physics doesn’t settle it; it says the two can’t exist together.';
    else if (r.outcome === 'rockGives') v = 'Unlimited push, real rock: the rock gives. The crust between them is torn apart, and ' + Y + ' is carried off with the rock he’s bolted to.';
    else if (r.outcome === 'stalemate') v = 'Dead heat. ' + X + ' pushes with ' + fmtSI(r.contact, 'N') + ' and ' + Y + ' holds ' + fmtSI(r.contact, 'N') + '. Neither moves.' + (r.pusherSlips && r.holdWhy === 'footing' ? ' Both are pushing as hard as their feet allow: the ground is the limit, not strength.' : '');
    else if (r.outcome === 'objectHolds') {
      if (r.holdWhy === 'immovable') v = Y + ' doesn’t move: here he’s truly immovable.';
      else if (cA.anchor === 'bolted' && cB.anchor === 'bolted') v = 'Neither moves. Both are bolted to the planet, so ' + X + '’s ' + fmtSI(r.contact, 'N') + ' push goes into the rock between them and stretches it.';
      else if (r.pusherSlips) v = Y + ' doesn’t move. ' + X + '’s own feet slide back first: they hold only ' + fmtSI(r.RA, 'N') + ', far less than his ' + fmtN(r.FA) + ' of strength.';
      else v = Y + ' doesn’t move. ' + X + ' pushes with ' + fmtN(r.DA) + ', less than ' + Y + '’s hold of ' + fmtN(r.HB) + '.';
    } else {
      if (!isFinite(r.DA)) v = X + ' pushes with unlimited force from bolted feet. ' + Y + '’s hold is finite (' + fmtSI(r.HB, 'N') + '), so he is shoved away at light speed with unlimited energy.';
      else v = X + ' wins. He pushes with ' + fmtSI(r.DA, 'N') + ' and ' + Y + ' can hold only ' + fmtSI(r.HB, 'N') + ', so ' + Y + ' is driven back.' + (cA.anchor === 'bolted' ? ' Bolted, ' + X + ' can’t walk him out; he can only shove him away (see Wrestle).' : '');
    }
    out.push(verdict(v));
    out.push(el('div', { class: 'status-row' },
      r.pusherSlips ? status('warn', X + '’s feet slip first') : status('info', X + ' pushes ' + fmtN(r.DA)),
      r.outcome === 'forceWins' ? status('bad', Y + ' gives: holds ' + fmtN(r.HB)) : status('good', Y + ' holds ' + fmtN(r.HB)),
      rockChip(r.rock), r.gravityLock ? status('warn', 'Gravity glues them together (' + fmtSI(r.gravF, 'N') + ')') : null));
    out.push(tiles(
      tile(X + '’s push', fmtN(r.DA), 'strength ' + fmtN(r.FA) + ' · feet hold ' + (isFinite(r.RA) ? fmtSI(r.RA, 'N') : 'no limit (bolted)')),
      tile(Y + '’s hold', fmtN(r.HB), holdWhy[r.holdWhy] || ''),
      tile('Force between them', isNaN(r.contact) ? 'undefined' : fmtN(r.contact), 'the same both ways'),
      r.rock && !r.rock.comic ? tile('Rock pulls apart out to', fmtDist(r.rock.rT), 'crushed within ' + fmtDist(r.rock.rC)) : null));
    const rows = [
      { label: X + '’s strength', value: r.FA, text: isFinite(r.FA) ? null : 'no limit' }, { label: X + '’s footing', value: r.RA, text: isFinite(r.RA) ? null : 'no limit (bolted)' },
      { label: Y + '’s strength', value: r.FB, text: isFinite(r.FB) ? null : 'no limit' }, { label: Y + '’s hold', value: r.HB, text: isFinite(r.HB) ? null : 'no limit', highlight: true },
    ];
    if (rows.some((x) => isFinite(x.value) && x.value > 0)) out.push(logBars('Forces', rows, (x) => fmtSI(x, 'N')));
    out.push(happens([
      'Newton’s third law: ' + X + ' pushes ' + Y + ' exactly as hard as ' + Y + ' pushes back, and both forces end up in the ground. So each can use only as much force as his footing takes. Strength past that just makes his feet slide.',
      'Footing here: ' + X + '’s feet hold ' + (isFinite(r.RA) ? fmtSI(r.RA, 'N') : 'without limit (bolted)') + '; ' + Y + ' holds ' + fmtN(r.HB) + ' (' + (holdWhy[r.holdWhy] || '') + ').',
      rockBullet(r.rock, r.contact, cB),
      !isFinite(r.FA) && isFinite(r.RA) ? 'Infinite strength isn’t unstoppable on plain feet: ' + X + '’s push is capped at ' + fmtSI(r.RA, 'N') + '.' : null,
      r.gravityLock ? 'At this density their gravity (' + fmtSI(r.gravF, 'N') + ') beats ' + X + '’s footing: they’re stuck together before anyone pushes.' : 'For a walk-out or a shove-off, see Wrestle.',
    ]));
    const ar = !isFinite(r.DA) ? 1 : 0, ac = !isFinite(r.HB) && (cB.immovable || cB.groundHolds) ? 1 : 0;
    out.push(caseGrid('The four cases', ['Finite push', 'Unlimited push (unlimited strength, bolted)'], ['Finite hold', 'Unlimited hold (bolted on unbreakable ground, or truly immovable)'],
      [['The bigger usable force wins; equal is a dead heat.', 'He holds. The push goes into the ground, and real rock cracks around the bolts.'], ['He’s shoved away at light speed.', 'No answer: ∞ − ∞. On real rock, the rock gives first.']], ar, ac));
    return out;
  }
  function collideCharge(cA, cB, X, Y) {
    const gb = state.colInf ? Infinity : Math.pow(10, state.colGB);
    const r = P.collide(cA, cB, { source: state.colSrc, gb }), out = [];
    if (r.blackHole) return [callout('At this density one of them is a black hole (see Weight). There’s nothing left to collide with.')];
    if (r.planetScale) return [callout('At this mass one of them reshapes the planet with his own gravity (see Weight). A charge across the Earth’s surface stops making sense here.')];
    if (r.noCharge) {
      const why = { cantSprint: X + ' can’t charge. At ' + fmtMass(cA.body.m) + ' his strength (' + fmtN(cA.F) + ') can’t hold up his own weight (' + fmtSI(cA.body.m * g, 'N') + '), so he can’t run. Try Set speed.', cantJump: X + ' can’t get off the ground, so he can’t land on ' + Y + '.', neverLands: X + '’s ' + (state.colSrc === 'jump' ? 'jump' : 'stomp-launch') + ' carries him off the planet. He never comes down on ' + Y + '.', boltedStomp: 'Bolted to the planet, ' + X + '’s stomp can’t launch him, so there’s nothing to land on ' + Y + '.', noLaunch: X + '’s stomp doesn’t lift him off the ground.', zero: 'Set a speed above zero.' }[r.noCharge];
      return [verdict(why)];
    }
    const splat = state.colBounce === 'splat', h = r.h, horiz = r.dir === 'h';
    const af = r.after || {};
    let v;
    if (r.outcome === 'paradox') v = 'No answer. ' + X + ' has unlimited momentum and ' + Y + ' has unlimited inertia, so momentum conservation would have to divide one infinity by another. That has no value. Physics doesn’t settle the paradox; it says the two can’t exist together.';
    else if (r.outcome === 'unstoppable') v = X + ' carries unlimited momentum. Nothing with finite mass can stop him: ' + Y + (cB.anchor === 'bolted' ? ', and the planet he’s bolted to,' : '') + ' is knocked away at light speed, with unlimited energy.';
    else if (r.outcome === 'immovable') v = Y + ' is truly immovable here (infinite mass, a thought experiment), so ' + X + (splat ? ' stops dead' : ' bounces back at ' + speedOnly(Math.abs(h.el.vA))) + '. All ' + fmtTNT(h.KA) + ' of his energy is ' + (splat ? 'freed at the hit.' : 'handed back to him as motion.');
    else if (r.held && horiz) v = Y + ' doesn’t budge. ' + X + (splat ? ' stops dead against him' : ' bounces straight back at ' + speedOnly(Math.abs(h.el.vA))) + ', and the blow goes through ' + (cB.anchor === 'bolted' ? 'his bolts' : 'his feet') + ' into the planet.';
    else if (r.held) v = Y + ' doesn’t budge: ' + (cB.anchor === 'bolted' ? 'his bolts hold' : cB.groundHolds ? 'comic ground can’t give' : 'the ground under him holds') + '. ' + X + (splat ? ' stops on his head.' : ' bounces back up at ' + speedOnly(Math.abs(h.el.vA)) + '.');
    else if (horiz && splat) {
      const s = af.splat || {};
      if (s.V >= 0.01 * K.c) v = X + ' hits ' + Y + ' at ' + fmtSpeed(r.vRel) + '. The two of them carry on together at ' + fmtSpeed(s.V) + ', a fireball.';
      else if (s.moved < 1) v = X + ' hits ' + Y + ' at ' + speedOnly(r.vRel) + '. ' + Y + '’s ' + (cB.anchor === 'braced' ? 'claws' : 'footing') + ' take most of it: he’s shoved back ' + fmtDist(s.moved) + '.';
      else v = X + ' hits ' + Y + ' at ' + speedOnly(r.vRel) + '. ' + Y + ' is knocked back at ' + speedOnly(s.V) + ' and the two slide ' + (isFinite(s.moved) ? fmtDist(s.moved) : 'until something stops them') + ' before they stop.';
    } else if (horiz) {
      const b = af.bounce || {};
      v = Math.abs(b.vA) < 1e-6 * r.vRel ? X + ' stops dead and ' + Y + ' flies off at ' + speedOnly(b.vB) + ', like Newton’s cradle.' : X + (b.vA < 0 ? ' bounces back at ' + speedOnly(Math.abs(b.vA)) : ' keeps going at ' + speedOnly(b.vA)) + ' and ' + Y + ' is knocked away at ' + speedOnly(b.vB) + '.';
    } else if (splat) { const s = af.splat || {}; v = X + ' lands on ' + Y + ' at ' + speedOnly(r.vRel) + '. The ground gives: the two are driven ' + fmtDist(s.depth || 0) + ' into ' + theSurf(cB.surface) + (s.D > 0 ? ' and blast a crater up to ' + fmtDist(s.D) + ' wide.' : '.'); }
    else { const b = af.bounce || {}; v = Y + ' is driven ' + fmtDist(b.depth || 0) + ' into ' + theSurf(cB.surface) + '; ' + X + (Math.abs(b.vA) < 0.01 ? ' stops on top.' : ' bounces back up at ' + speedOnly(Math.abs(b.vA)) + '.'); }
    if (r.dragged) v += ' Their gravity drags them together before anyone charges.';
    else if (r.gravBoost) v += ' ' + Y + '’s gravity pulls ' + X + ' in: he arrives at ' + speedOnly(r.vRel) + ' however fast he ran.';
    out.push(verdict(v));
    const srcLabel = { sprint: 'his top sprint', jump: 'falling from his ' + (r.speed.apex ? fmtDist(r.speed.apex) + ' ' : '') + 'jump', stomp: 'falling back after a stomp-launch', set: 'set speed' }[state.colSrc];
    const Q = splat ? h.Q : 0, F = r.contact ? (splat ? r.contact.soft : r.contact.softEl) : null;
    const chips = [status('info', 'Charge: ' + (r.v0 >= 0.01 * K.c ? fmtSpeed(r.v0) : speedOnly(r.v0)) + ' (' + srcLabel + ')')];
    if (r.v0 >= 0.01 * K.c) chips.push(status('bad', 'Fireball on the way in')); else if (r.v0 >= K.a0) chips.push(status('warn', 'Sonic boom on the way in'));
    if (cB.immovable) chips.push(status('info', 'Thought experiment: infinite mass'));
    else if (r.dragged) chips.push(status('bad', 'Gravity drags ' + Y + ' in first'));
    else if (r.held && cB.anchor === 'bolted') chips.push(status('info', 'Bolted: Earth takes the blow'));
    else if (r.held && cB.groundHolds && !horiz) chips.push(status('info', 'Comic ground takes the blow'));
    else if (r.held) chips.push(status('good', Y + ' holds: ' + fmtN(r.hold.H) + ' vs a ' + fmtSI(r.Fheld, 'N') + ' hit'));
    else if (r.outcome === 'moved') chips.push(status('bad', Y + ' gives: holds ' + fmtN(r.hold.H) + ', needs ' + fmtN(r.Fheld)));
    chips.push(rockChip(r.rock));
    if (r.held && splat && isFinite(h.Q) && h.Q > 0) chips.push(quakeChip(h.Q, r.quakeHeld));
    if (r.partial && r.hold.H / r.Fheld > 0.1) chips.push(status('info', 'His footing soaks up part of the blow'));
    if (!splat && r.elasticUpper) chips.push(status('info', 'Bounce ignores his footing (upper bound)'));
    out.push(el('div', { class: 'status-row' }, chips));
    let holderTile = null;
    if (r.outcome === 'unstoppable') holderTile = tile(Y + ' moves', 'at light speed', 'unlimited momentum');
    else if (r.held || r.outcome === 'immovable') holderTile = tile(Y + ' moves', 'not at all', holdWhy[r.hold.why] || '');
    else if (horiz) holderTile = speedTile(Y + ' knocked back at', splat ? af.splat.V : af.bounce.vB, splat && isFinite(af.splat.moved) ? 'moves ' + fmtDist(af.splat.moved) + ' in all' : '');
    else holderTile = tile(Y + ' driven into the ground', fmtDist((splat ? af.splat.depth : af.bounce.depth) || 0), cB.surface.short);
    out.push(tiles(
      speedTile('Charge speed', r.vRel, r.gravBoost ? 'his own run: ' + speedOnly(r.v0) : srcLabel),
      tile('Energy freed at the hit', splat ? (isFinite(Q) ? fmtSI(Q, 'J') : 'unbounded') : 'none', splat ? (isFinite(Q) ? fmtTNT(Q) + ' · ' + compareEnergy(Q) : '') : 'a perfect bounce keeps it as motion; a splat frees ' + (isFinite(h.Q) ? fmtTNT(h.Q) : 'unbounded energy')),
      holderTile,
      F ? tile('Force of the hit', isFinite(F.F) ? fmtSI(F.F, 'N') : 'unbounded', isFinite(F.F) ? 'over ' + fmtTime(F.t) + ' (plush squash, estimate)' : '') : null,
      r.held && r.earth ? tile('Earth’s speed change', sci(splat ? r.earth.dvSplat : r.earth.dvBounce, 2) + ' m/s', r.earth.t1mm > COLAGE ? 'it would take ' + big(r.earth.t1mm / COLAGE, 2) + '× the age of the universe to move 1 mm' : 'it would take ' + fmtDuration(r.earth.t1mm) + ' to move 1 mm') : (r.outcome === 'unstoppable' && cB.anchor === 'bolted' ? tile('Earth', 'knocked away at light speed', 'unlimited momentum') : null)));
    if (r.contact && F && isFinite(F.F) && F.F > 0) {
      const ct = r.contact;
      const rows = [
        { label: 'What holds ' + Y, value: isFinite(r.hold.H) ? r.hold.H : 1, text: isFinite(r.hold.H) ? null : (cB.anchor === 'bolted' ? 'no limit (bolted)' : 'no limit'), highlight: false },
        { label: 'The hit, plush squash', value: F.F, highlight: true },
        r.vRel < 36100 ? { label: 'As stiff as any real material', value: ct.matter.F } : null,
        { label: 'Stiffest body physics allows', value: ct.light.F },
      ].filter(Boolean);
      out.push(logBars('Forces at the hit', rows, (x) => fmtSI(x, 'N')));
      out.push(el('p', { class: 'muted', style: 'font-size:.85rem', text: 'A perfectly rigid body would make the hit infinite. Relativity forbids one, so the hit is never infinite.' }));
    }
    if (splat && isFinite(Q) && Q > 0) out.push(blastBlock(Q, 'where they meet'));
    else if (splat && !isFinite(Q)) out.push(callout('The energy is unbounded, so no finite blast radius applies.'));
    const items = [];
    items.push('Momentum is never lost. Whatever ' + X + ' brings in, the two of them (plus whatever holds ' + Y + ') carry away. A splat shares it and frees the rest of the energy as heat, sound and blast. A perfect bounce keeps all the energy as motion. Soft bodies sit near the splat end.');
    const hb = r.hold;
    const whyText = { footing: ' Standing on ' + cB.surface.short + ', friction' + (cB.anchor === 'braced' ? ' and his claws hold' : ' holds') + ' him with ' + fmtN(hb.R) + '. Stopping ' + X + ' dead takes ' + fmtN(r.Fheld) + ', so he ' + (r.held ? 'holds.' : 'gets knocked back.'), strength: ' His footing could hold ' + fmtN(hb.R) + ', but his muscles keep his stance against only ' + fmtN(cB.F) + '.', lying: ' At ' + fmtMass(cB.body.m) + ' he’s too heavy for his strength to stand, so he lies flat and friction alone holds him: ' + fmtN(hb.R) + '.', bearing: ' Bracing can’t help against a blow from above. Only the ground under his feet holds him up: ' + fmtN(hb.H) + ' on ' + cB.surface.short + '.', bolted: ' Bolted, he is part of the planet: the bolts hand the momentum to the Earth’s 5.97 × 10²⁴ kg.', comicGround: ' On comic ground nothing gives under him, so the Earth takes it.', immovable: ' Here he gets infinite mass, which no real setting allows. Even bolted to an unbreakable planet he would be only as immovable as the Earth’s 5.97 × 10²⁴ kg.' }[hb.why] || '';
    items.push('“Immovable” only means what holds ' + Y + ' in place.' + whyText);
    if (r.outcome === 'unstoppable' || r.outcome === 'paradox') items.push('An unstoppable force would need unlimited momentum, so nothing with finite mass could stop it. An immovable object would need unlimited inertia, so nothing with finite momentum could move it. Put them together and momentum conservation asks for ∞ ÷ ∞, which has no value. So the honest answer is that the two can’t exist in the same universe: if one does, the other doesn’t. That is the standard resolution of the paradox.');
    else if (r.contact && isFinite(h.Q) && h.Q > 0) items.push('How hard they hit depends on how squishy they are, which nobody knows for an indestructible plush. If each squashes a quarter of his depth (' + fmtDist(r.contact.s) + ' in all), the hit lasts ' + fmtTime(F.t) + ' and pushes with about ' + fmtSI(F.F, 'N') + '. A perfectly rigid body would make the force infinite, but relativity forbids one: no push travels through a body faster than light. Even the stiffest body physics allows takes ' + fmtTime(r.contact.light.t) + ' to stop, which caps the force at ' + fmtSI(r.contact.light.F, 'N') + '.');
    if (r.relativistic) items.push('At ' + fmtSpeed(r.v0) + ' the air ahead of ' + X + ' can’t get out of the way: it’s shock-heated into plasma. His last ' + fmtDist(r.d0) + ' of run-up alone dumps very roughly ' + (isFinite(r.airRunUp) ? fmtTNT(r.airRunUp) : 'unbounded energy') + ' into the air before he arrives.');
    if (r.gravBoost) items.push('At this density, gravity between them matters. Starting ' + fmtDist(r.d0) + ' apart, their pull alone brings ' + X + ' in at ' + speedOnly(r.fall.vRel) + '.' + (r.bound ? ' They’re bound together: after a bounce they fall back.' : '') + (r.dragged ? ' The pull (' + fmtSI(r.gNear.F, 'N') + ') beats what holds ' + Y + ', so it drags him in too.' : ''));
    if (!isFinite(cA.F) && r.outcome !== 'unstoppable' && r.outcome !== 'paradox' && state.colSrc === 'sprint') items.push('Infinite strength isn’t unstoppable: a charge needs grip. On ' + cA.surface.short + ' his feet push off with only ' + fmtSI(r.speed.run ? r.speed.run.thrust : 0, 'N') + ', so he tops out at ' + speedOnly(r.v0) + '.');
    if (!isFinite(cB.F) && r.outcome === 'moved') items.push('Infinite strength isn’t immovable either: holding still needs footing, and his feet give at ' + fmtN(hb.R) + '.');
    if (r.held && r.earth) items.push('The Earth takes the momentum: its speed changes by ' + sci(splat ? r.earth.dvSplat : r.earth.dvBounce, 2) + ' m/s.' + (r.earth.runUpCancels ? ' And ' + X + ' got his speed by pushing on the Earth in the first place, so the Earth just gets its own momentum back. Overall, nothing moves.' : ' Arriving from outside, his momentum stays with the Earth' + (r.earth.dayChange > 0 ? '; if he hits along the equator, the day gets ' + fmtTime(r.earth.dayChange) + ' longer or shorter.' : '.')));
    items.push(rockBullet(r.rock, F ? F.F : 0, cB));
    out.push(happens(items));
    out.push(caseGrid('The four cases', ['Finite momentum', 'Unlimited momentum (light speed)'], ['Finite inertia (anything real, even bolted to the Earth)', 'Unlimited inertia (truly immovable)'],
      [['Both move. They share the momentum; the softer the hit, the more energy it frees.', 'The charger stops or bounces. The object doesn’t budge, so the force was stoppable.'], ['The object is knocked away at light speed (the planet too, if bolted), so it was movable.', 'No answer: ∞ ÷ ∞. The two can’t exist in the same universe.']],
      isFinite(r.pA) ? 0 : 1, cB.immovable ? 1 : 0));
    out.push(math([
      'Charge: ' + srcLabel + ' → v = ' + (r.v0 >= 0.01 * K.c ? fmtSpeed(r.v0) : speedOnly(r.v0)) + '; momentum p = γ m v = ' + (isFinite(r.pA) ? fmtSI(r.pA, 'kg·m/s') : '∞') + '.',
      r.gravBoost ? 'Gravity on the way in: v_rel² = v² + 2G(m₁+m₂)(1/d − 1/d₀), d₀ = ' + fmtDist(r.d0) + ', d = ' + fmtDist(r.dC) + ' → ' + speedOnly(r.vRel) + '.' : null,
      'Splat: they move off as one body. Invariant mass M = √(m₁² + m₂² + 2m₂E₁/c²); energy freed Q = (M − m₁ − m₂)c² (½μv² below 1% of light speed, μ = m₁m₂/(m₁+m₂)).',
      'Perfect bounce: each body’s momentum reverses in the centre-of-momentum frame. Below 1% of light speed: v₁′ = (m₁−m₂)/(m₁+m₂)·v, v₂′ = 2m₁/(m₁+m₂)·v.',
      r.held && !cB.immovable ? 'Held: ' + Y + ' and the Earth act as one body; Earth’s Δv = p/(m + M_Earth).' : null,
      r.contact ? 'Force: squash s = ½ × the smaller depth = ' + fmtDist(r.contact.s) + '; F = Q/s (splat) or 2Q/s peak (bounce). Real matter can’t carry sound faster than 36.1 km/s; nothing travels faster than light, which caps the force.' : null,
      'Slide: x = m/(2k)·ln(1 + kV²/R), k = ½ρ₀C_dA.',
      cB.anchor === 'bolted' ? 'Rock: a force C spread over a half-sphere of radius r averages C/(2πr²); granite pulls apart at 8.4 MPa and crushes at 200 MPa, so r = √(C/2πσ).' : null,
      'Blast radii: Kinney & Graham (1985), as if all of Q became a blast (upper bound). Quake: 1 part in 10,000 of Q, upper bound.',
      X === 'Ollie' ? 'Ollie’s horns don’t change the momentum or the energy; they only put the force on a smaller patch.' : null,
    ]));
    return out;
  }
  const COLAGE = 13.787e9 * 3.15576e7;
