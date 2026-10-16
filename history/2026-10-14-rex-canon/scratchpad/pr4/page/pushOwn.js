  // The shoving match with They take their own recoil on (BRIEF-canon.md item 4, decision 8; canon, the rulings of 14 Oct
  // 2026: in a contest force moves, the other's push is real, and only the push each puts on himself is absorbed). No push
  // costs the pusher his grip: each pushes with the effort he uses, and only his feet (or bolts) hold him against the
  // other's push. Engine outcomes: 'bothShoved', 'walkOut', 'shovedOff', 'deadlock', the one-sided 'paradox', and
  // 'bothBolted' as before.
  function wrestlePushOwn(r, cR, cO) {
    const out = [];
    const W = r.winner ? WHO[r.winner] : null, L = r.winner ? WHO[r.winner === 'A' ? 'B' : 'A'] : null;
    const eqN = (a, b) => a === b || (isFinite(a) && isFinite(b) && Math.abs(a - b) <= 1e-6 * Math.max(a, b));
    const pushes = eqN(r.DA, r.DB) ? fmtN(r.DA) + ' each' : 'Rex ' + fmtN(r.DA) + ', Ollie ' + fmtN(r.DB);
    const holds = eqN(r.HA, r.HB) ? fmtN(r.HA) + ' each' : 'Rex ' + fmtN(r.HA) + ', Ollie ' + fmtN(r.HB);
    const moved = r.outcome === 'bothShoved' || r.outcome === 'shovedOff';
    const fast = (x) => (x >= 0.01 * K.c ? fmtSpeed(x) : speedOnly(x));
    const slideOf = (x, vv) => (vv >= 0.01 * K.c || !isFinite(x) ? 'until something stops him' : fmtDist(x));
    const tornName = r.tornA ? 'Rex' : r.tornB ? 'Ollie' : null;
    let v;
    if (r.outcome === 'bothBolted') v = r.clash === 'paradox' ? 'Nothing moves, and there is no physical answer: both are bolted to ground their power holds, and each unlimited push meets the other’s bolts, a hold without limit. Each one’s push back goes to the endless ocean (They take their own recoil), and the two pushes on the planet are equal and opposite.'
      : r.clash ? clashVerdict(r.clash, 'Rex', 'Ollie')
        : 'Neither moves: both are bolted to the planet. Each pushes with ' + fmtSI(r.contact, 'N') + '; his push back goes to the endless ocean, and the other’s push goes through his bolts into the ground, so the ground between their feet is stretched' + (r.tear > 1 ? ': it tears up around the bolts (' + fmtRatio(r.tear) + ' its limit).' : ', which holds.');
    else if (r.outcome === 'paradox') { const ollieHeld = cO.anchor === 'bolted' && P.holdsGround(cO) && !isFinite(r.DA); v = clashVerdict('paradox', ollieHeld ? 'Rex' : 'Ollie', ollieHeld ? 'Ollie' : 'Rex', null, true); }
    else if (r.outcome === 'bothShoved') {
      const ratio = Math.min(r.DA / r.HB, r.DB / r.HA);
      const sameV = Math.abs(r.vA - r.vB) <= 0.01 * Math.max(r.vA, r.vB);
      v = 'Pushing straight across, both are shoved apart. They take their own recoil, so neither push costs the pusher his grip: each pushes with the effort he uses (' + pushes + '), ' + (isFinite(ratio) && ratio >= 2 ? 'about ' + (ratio >= 10 ? Math.round(ratio) : sig(ratio, 2)) + ' times' : 'more than') + ' what holds the other (' + holds + ').'
        + (tornName ? ' The rock around ' + tornName + '’s bolts tears out.' : '')
        + (r.relativistic ? ' They fly apart at ' + (sameV ? fast(r.vA) + ' each' : 'Rex ' + fast(r.vA) + ', Ollie ' + fast(r.vB)) + ', into the air as fireballs.'
          : sameV ? ' They fly apart at ' + speedOnly(r.vA) + ' each and slide about ' + slideOf(Math.max(r.slideA, r.slideB), r.vA) + '.' : ' Rex flies back at ' + speedOnly(r.vA) + ' and slides ' + slideOf(r.slideA, r.vA) + '; Ollie at ' + speedOnly(r.vB) + ', sliding ' + slideOf(r.slideB, r.vB) + '.');
    } else if (r.outcome === 'shovedOff') {
      const cw = r.winner === 'A' ? cR : cO, vl = r.winner === 'A' ? r.vB : r.vA, sl = r.winner === 'A' ? r.slideB : r.slideA, Dl = r.winner === 'A' ? r.DB : r.DA;
      v = W + (cw.anchor === 'bolted' ? ' is bolted, so he can’t walk ' : ' can’t walk, so he can’t walk ') + L + ' out, but his push is real (a contest lets force move): he shoves ' + L + ' off at ' + fast(vl) + (vl >= 0.01 * K.c ? ', into the air as a fireball.' : ', and ' + L + ' slides ' + slideOf(sl, vl) + '.') + (tornName ? ' The rock around ' + tornName + '’s bolts tears out.' : '') + ' ' + L + '’s push (' + fmtN(Dl) + ') can’t move ' + W + (cw.anchor === 'bolted' ? '’s bolts.' : '.');
    } else if (r.outcome === 'walkOut') {
      const Dw = r.winner === 'A' ? r.DA : r.DB, Dl = r.winner === 'A' ? r.DB : r.DA, Hl = r.winner === 'A' ? r.HB : r.HA, Hw = r.winner === 'A' ? r.HA : r.HB;
      v = 'Pushing straight across: ' + W + ' walks ' + L + ' out of the ring in ' + fmtTime(r.t) + (r.v >= 5 ? ', hitting ' + speedOnly(r.v) : '') + '. ' + W + '’s push (' + fmtN(Dw) + ') beats what holds ' + L + ' (' + fmtN(Hl) + '), but ' + L + '’s (' + fmtN(Dl) + ') doesn’t beat ' + W + '’s hold (' + fmtN(Hw) + '). ' + (r.aFeet < r.aLoser ? W + '’s own feet set the pace: they can speed his body up only so fast against ' + L + '’s push.' : W + '’s push sets the pace.');
    } else v = 'Pushing straight across: dead heat. Neither push beats what holds the other (' + holds + ').';
    if (r.gravityLock) v += ' Their gravity holds them together with ' + fmtSI(r.grav.F, 'N') + '; neither can push the other away.';
    out.push(verdict(v));
    if (r.outcome !== 'bothBolted' && (r.canLiftA || r.canLiftB)) out.push(callout(r.canLiftA && r.canLiftB ? 'Each is strong enough to lift the other, so a real bout goes to whoever gets lower first and pushes upward, taking the weight off the other’s feet. The sim can’t model that.' : (r.canLiftA ? 'Rex' : 'Ollie') + ' is strong enough to lift ' + (r.canLiftA ? 'Ollie' : 'Rex') + ', so by getting under him and pushing upward he takes the weight off ' + (r.canLiftA ? 'Ollie' : 'Rex') + '’s feet and wins (see Lift).'));
    const rockOut = r.clash === 'rockGives';
    out.push(el('div', { class: 'status-row' },
      rockOut ? status('bad', 'Rex’s rock tears loose') : status('info', 'Rex holds ' + fmtN(r.HA) + ' · pushes ' + fmtN(r.DA)),
      rockOut ? status('bad', 'Ollie’s rock tears loose') : status('info', 'Ollie holds ' + fmtN(r.HB) + ' · pushes ' + fmtN(r.DB)),
      tornName && !rockOut ? status('bad', 'Rock tears out around ' + tornName + '’s bolts') : null,
      r.tear > 1 && !rockOut ? status('bad', 'Ground tears around the bolts') : null,
      r.outcome === 'bothShoved' ? status('bad', 'Both shoved apart') : r.outcome === 'shovedOff' ? status('bad', L + ' shoved off') : null,
      r.outcome === 'paradox' || r.clash === 'paradox' ? status('warn', 'No physical answer') : null,
      r.grav.F > 1e-3 * Math.min(cR.body.m, cO.body.m) * g ? status('warn', 'Their own gravity: ' + fmtSI(r.grav.F, 'N')) : null));
    const leaves = (who, vv, sl) => (vv > 0.01 ? speedTile(who + ' leaves at', vv, vv >= 0.01 * K.c ? 'into the air as a fireball' : 'slides ' + slideOf(sl, vv)) : null);
    out.push(tiles(
      tile('Winner', r.outcome === 'walkOut' ? W : 'nobody', r.outcome === 'walkOut' ? 'walks the other out' : r.outcome === 'bothShoved' ? 'both are shoved apart' : r.outcome === 'shovedOff' ? W + ' shoves ' + L + ' off' : rockOut ? 'they’re shoved apart' : r.outcome === 'paradox' || r.clash === 'paradox' ? 'no physical answer' : 'stalemate'),
      r.outcome === 'walkOut' ? tile('Time out of the ring', fmtTime(r.t), 'ring ' + fmtDist(r.ring) + ' across') : null,
      r.outcome === 'walkOut' ? tile('Speed at the edge', speedOnly(r.v), r.v >= r.vCap * 0.999 ? 'his top running speed' : '') : null,
      moved ? leaves('Rex', r.vA, r.slideA) : null,
      moved ? leaves('Ollie', r.vB, r.slideB) : null,
      // (each push is real one way, on the other; its push back goes to the pusher's source: not the same both ways)
      tile('Rex’s push', fmtN(r.DA), 'real on Ollie; its push back goes to Rex’s source'),
      tile('Ollie’s push', fmtN(r.DB), 'real on Rex; its push back goes to Ollie’s source')));
    out.push(logBars('Strength, footing and push', [
      { label: 'Rex’s strength', value: cR.F, highlight: true }, isFinite(r.holdA) ? { label: 'Rex’s footing holds', value: r.holdA } : null, { label: 'Rex’s push', value: r.DA },
      { label: 'Ollie’s strength', value: cO.F, highlight: true }, isFinite(r.holdB) ? { label: 'Ollie’s footing holds', value: r.holdB } : null, { label: 'Ollie’s push', value: r.DB },
    ].filter((x) => x && isFinite(x.value)), (x) => fmtSI(x, 'N')));
    const items = [];
    items.push('With They take their own recoil on, a shoving match is decided at the feet of the one being pushed. Each one’s push back goes to his source, so pushing costs him no grip: each pushes with the effort he uses. The other’s push on him is real (a contest lets force move), and only his feet hold against it. (That assumes each leans into the push; upright, a body tips over at a few hundred newtons.)');
    // equal bodies: even the search's floor beats the grip on every ground (decision 8)
    if (cR.body.m === cO.body.m && r.outcome !== 'bothBolted') {
      const needKg = P.W8.WALK_LOAD * cR.body.m / P.MUSCLE.jump.forceFrac;
      items.push('Equal bodies on equal ground are always shoved apart with the power on: even the least effort the lab lets them use, enough to stand and walk (as hard as lifting ' + fmtMass(needKg) + ' each), is more than either one’s grip on any ground here (μ × his weight, μ at most 0.84, on gravel). So with the power on there is no dead heat between them.');
    }
    if (r.outcome === 'walkOut') items.push('Walking him out is paced by ' + W + '’s own feet, as on the Pull tab: he moves ' + L + ' no faster than the smaller of (his push − ' + L + '’s hold) ÷ ' + L + '’s mass and (his footing − ' + L + '’s push) ÷ his own mass, here ' + sig(r.accel, 2) + ' m/s².');
    if (moved) items.push('Each is pushed by the other’s push, less his own hold, over the shove’s stroke (' + fmtDist(r.d) + ', an estimate) while their hands stay on each other; then each slides to a stop on his feet against friction and air drag. A real body would tumble; the lab keeps him upright.' + (r.realUpper ? ' With real muscle the push falls as the hands speed up, so these speeds are an upper bound.' : ''));
    if (moved && r.recoilAbsorbedA && r.recoilAbsorbedB) {
      const eqJ = eqN(r.recoilAbsorbedA.J, r.recoilAbsorbedB.J), eqF = eqN(r.footA, r.footB);
      items.push('They take their own recoil: each one’s push back goes to the endless ocean (' + (eqJ ? momFig(r.recoilAbsorbedA) + ' each' : 'Rex ' + momFig(r.recoilAbsorbedA) + ', Ollie ' + momFig(r.recoilAbsorbedB)) + ', over the push), so none of it reaches the ground. His feet hand the ground only what they hold against the other’s push (' + (eqF ? momFig({ J: r.footA }) + ' each' : 'Rex ' + momFig({ J: r.footA }) + ', Ollie ' + momFig({ J: r.footB })) + '), a friction drag' + (r.outcome === 'shovedOff' ? ', or, bolted, through his bolts.' : ' while he slides.'));
    }
    if (r.outcome === 'bothBolted') items.push('Both bolted: each one’s push goes through the other’s bolts into the ground, and his push back goes to the endless ocean. ' + (P.holdsGround(cR) ? (cR.groundHolds ? 'With the ground treated as holding' : 'Unbreakable footing: the ground never breaks') + ', so nothing gives.' : 'The ground between their feet is stretched, and rock and concrete are weak in tension.'));
    out.push(happens(items, 8));
    out.push(math(['Push = the effort he uses, if he can stand (They take their own recoil: pushing costs him no grip); 0 lying flat. Hold = min(strength, footing), or the footing alone if he is too heavy to stand; footing = μ × min(m g, what the ground under his feet bears). Bolted: unlimited, whatever his strength (the bolts hold, not his muscles).',
      'Both pushes beat the other’s hold: each is pushed by (the other’s push − his hold) over the stroke d = ' + fmtDist(r.d || Math.min(cR.body.strokes.throw, cO.body.strokes.throw)) + ' (the shove’s, an estimate), with momentum p = F t and relativistic speeds; slide x = m/(2k) ln(1 + k v²/R), k = ½ρ C_d A.',
      'Walk-out: a = min((push − loser’s hold) ÷ m_loser, (his footing − loser’s push) ÷ m_winner), capped at his running speed, over half the ring (' + fmtDist(r.ring / 2) + ').']));
    return out;
  }
