import sys
p='/home/user/dino-strength-sim/src/app.html'; s=open(p).read()
def R(old,new,count=1):
    global s
    n=s.count(old)
    if n!=count: sys.exit('count %d != %d for: %s'%(n,count,old[:160]))
    s=s.replace(old,new)

PAST_MOON = "' Its arc goes past the Moon’s orbit (384,400 km). The sim counts only Earth’s pull; the Moon and Sun would bend an arc this long, so where it lands is rough.'"

# ---- bayThrow
R("""    const key = r.style === 'whip' ? 'throwWhip' : 'throwPush';
    if (!r.canHold || !r.canMove) {
      out.push(verdict(!r.canHold ? 'Rex can’t throw it. He can’t even hold it up.' : 'Rex can hold it, but can’t throw it at any angle: his throwing push (' + fmtSI(r.Fdrive, 'N') + ') is less than its weight (' + fmtSI(r.needed, 'N') + ').'));
      out.push(tiles(
        tile('Weight to hold up', fmtSI(o.m * g, 'N'), fmtMass(o.m)),
        tile('His full strength', fmtSI(c.F, 'N'), ''),
        r.canHold ? tile('His throwing push', fmtSI(r.Fdrive, 'N'), shareText(key) + ' of full strength per hand, ' + r.hands + ' hand' + (r.hands > 1 ? 's' : '')) : null));
      out.push(happens([
        state.mode === 'real' ? 'A fast throw can’t use full strength: muscles deliver much less force while moving quickly than while holding still.' : 'A throw uses a fixed share of his strength, the share that matches real throwers at record-human strength.',
        'Try a lighter object, or about ' + fmtRatio(r.needed / Math.max(r.Fdrive, 1e-9)) + ' more strength.',
      ]));
      return out;
    }""","""    const key = r.style === 'whip' ? 'throwWhip' : 'throwPush';
    const mode = r.basis || state.mode;
    if (!r.canHold || !r.canMove) {
      // Comic mode falls back to real muscle when that is stronger, so advise from the better of the two.
      const rReal = state.mode === 'comic' ? P.throwObject(Object.assign({}, c, { mode: 'real', record: true }), o, state.angle) : r;
      const Fbest = Math.max(r.Fdrive, rReal.Fdrive);
      const close = Math.abs(r.Fdrive / r.needed - 1) < 0.05, nd = close ? 4 : 3;
      const handsText = (r.hands > 1 ? 'his throwing hands and forearms' : 'his throwing hand and forearm');
      out.push(verdict(!r.canHold ? 'Rex can’t throw it. He can’t even hold it up.' : 'Rex can hold it, but can’t throw it at any angle: his throwing push (' + fmtSI(r.Fdrive, 'N', nd) + ') is less than the weight of the ' + o.short + ' plus ' + handsText + ' (' + fmtSI(r.needed, 'N', nd) + ').'));
      out.push(tiles(
        tile('Weight to hold up', fmtSI(r.needed, 'N', nd), fmtMass(o.m) + ' ' + o.short + ' + ' + fmtMass(r.armMass) + ' of ' + (r.hands > 1 ? 'hands and forearms' : 'hand and forearm')),
        tile('His full strength', fmtSI(c.F, 'N', nd), ''),
        r.canHold ? tile('His throwing push', fmtSI(r.Fdrive, 'N', nd), shareText(key, mode) + ' of full strength per hand, ' + r.hands + ' hand' + (r.hands > 1 ? 's' : '')) : null));
      const need = r.needed / Math.max(Fbest, 1e-9);
      out.push(happens([
        !r.canHold ? 'To throw it he first has to hold it up: the ' + o.short + ' plus ' + handsText + ' weigh ' + fmtSI(r.needed, 'N') + ', more than his full strength.'
          : (mode === 'real' ? 'A fast throw can’t use full strength: muscles deliver much less force while moving quickly than while holding still.' : 'A throw uses a fixed share of his strength, the share that matches real throwers at record-human strength.'),
        'Try a lighter object, or ' + (need < 2 ? 'about ' + sig((need - 1) * 100, 2) + '% more strength.' : 'about ' + fmtRatio(need) + ' the strength he has.'),
      ]));
      return out;
    }""")
R("""    const straightUp = state.angle >= 90;   // range at 90° is round-off, not a distance""",
"""    const straightUp = state.angle >= 90;   // range at 90° is round-off, not a distance
    const pastMoon = !f.relativistic && !f.escaped && !f.orbit && f.apex > 3.844e8;""")
R("""    if (r.recoilV > 1) v += ' Rex gets shoved backward at ' + speedOnly(r.recoilV) + '.';
    out.push(verdict(v));
    const chips = [];""","""    if (r.recoilV > 1) v += ' Rex gets shoved backward at ' + speedOnly(r.recoilV) + '.';
    if (pastMoon) v += """ + PAST_MOON + """;
    out.push(verdict(v));
    const chips = [];
    if (basisChip(r)) chips.push(basisChip(r));""")
R("""      tile('Launch speed', speedOnly(r.v), [fmtMach(r.v), r.v < 0.01 * K.c ? big(r.v * 3.6, 3) + ' km/h' : ''].filter(Boolean).join(' · ')),""",
"""      speedTile('Launch speed', r.v, [fmtMach(r.v), r.v < 0.01 * K.c ? big(r.v * 3.6, 3) + ' km/h' : ''].filter(Boolean).join(' · ')),""")
R("""      tile('His recoil', r.recoilV > 0.01 ? speedOnly(r.recoilV) : 'none',""","""      (r.recoilV > 0.01 ? speedTile : tile)('His recoil', r.recoilV > 0.01 ? r.recoilV : 'none',""")
R("""    if (!f.relativistic && f.path && f.path.length > 1) {
      const ghost = vac && vac.landed && vac.path && vac.range < 40 * Math.max(f.range, 1) ? vac.path : null;
      out.push(trajectoryChart(f.path, ghost, 'Flight path of the ' + o.short, f.apex));
    }""","""    if (!f.relativistic && f.path && f.path.length > 1 && !straightUp) {
      const ghost = vac && vac.landed && vac.path && vac.range < 40 * Math.max(f.range, 1) ? vac.path : null;
      const endNote = (f.landed || f.timedOut) ? null : (f.orbit ? 'in orbit →' : 'leaves Earth →');
      out.push(trajectoryChart(f.path, ghost, 'Flight path of the ' + o.short, f.apex, endNote));
    }""")
R("""    if (r.heldBack) items.push('Pushing with everything would make his feet slide and waste the throw, so he holds back to what his footing can take (' + fmtSI(r.anchor.R, 'N') + ').');""",
"""    if (r.heldBack) items.push('Pushing with everything would make his feet slide and waste the throw, so he holds back to what his footing can take (' + fmtSI(r.anchor.R, 'N') + ').');
    if (r.basis === 'real' && state.mode === 'comic') items.push('Comic mode’s fixed ' + shareText(key, 'comic') + ' share of strength would throw this slower than real muscle does at this load, so the result shown is real muscle’s.');""")
R("""      items.push('Past about 1% of light speed the air ahead can’t get out of the way""","""      items.push('Past about 1% of light speed the air ahead can’t get out of the way""")
R("""    if (f.landed && r.Eimpact > 4.184e9) items.push('Impact: ' + fmtTNT(r.Eimpact) + (r.planetScale ? '. That is planet-scale: crater scaling no longer applies' : (r.crater > 0 ? ', crater up to ' + fmtDist(r.crater) + ' across (impact scaling; rock and concrete make smaller craters)' : ''))""",
"""    if (f.landed && r.Eimpact > 4.184e9) items.push('Impact: ' + fmtTNT(r.Eimpact) + (r.planetScale ? '. That is planet-scale: crater scaling no longer applies' : (r.crater > 0 ? ', crater up to ' + fmtDist(r.crater) + ' across' + (r.craterBeyondFit ? ' (far past the few-hundred-km range the scaling is fitted to; rough size only)' : ' (impact scaling; rock and concrete make smaller craters)') : ''))""")
R("""      'Drive: ' + fmtSI(r.Fdrive, 'N') + ' (' + shareText(key) + ' of full strength per hand' + (state.mode === 'real' ? ', falling with speed per the Hill curve' : ', constant') + ') over a '""",
"""      'Drive: ' + fmtSI(r.Fdrive, 'N') + ' (' + shareText(key, mode) + ' of full strength per hand' + (r.hands * (mode === 'real' ? P.MUSCLE[key].forceFrac : P.MUSCLE[key].comicFrac) > 1 ? ', capped at his full strength' : '') + (mode === 'real' ? ', falling with speed per the Hill curve' : ', constant') + (r.heldBack ? '; he holds back to ' + fmtSI(r.anchor.R, 'N') + ' so his feet don’t slide' : '') + ') over a '""")
R("""Above 150 km the arc is solved exactly (Kepler).',""","""Above 150 km the arc is solved exactly as an Earth-only Kepler arc (no Moon or Sun pull).',""")
R("""      r.crater ? 'Crater: Collins, Melosh & Marcus (2005) gravity-regime scaling.' : null,
    ]));""","""      r.crater ? 'Crater: Collins, Melosh & Marcus (2005) gravity-regime scaling.' : null,
      r.basis === 'real' && state.mode === 'comic' ? 'Comic mode’s fixed ' + shareText(key, 'comic') + ' share would throw this slower than real muscle, so the real-muscle result is shown (comic mode never does worse than real muscle).' : null,
    ]));""")

# ---- bayJump
R("""  function bayJump(c) {
    const r = P.jump(c);
    const f = r.flight;
    const RB = r.groundLimitForce;
    const rFree = !c.groundHolds && (r.groundFails || r.heldBack) ? P.jump(Object.assign({}, c, { groundHolds: true })) : null;""",
"""  function bayJump(c) {
    const r = P.jump(c);
    const mode = r.basis || state.mode;
    const f = r.flight;
    const RB = r.groundLimitForce;
    const rFree = !c.groundHolds && (r.groundFails || r.heldBack) ? P.jump(Object.assign({}, c, { groundHolds: true })) : null;
    // holding back only matters if rigid ground would have sent him noticeably higher
    const groundBinds = r.heldBack && rFree && (rFree.flight.escaped || rFree.flight.relativistic || rFree.flight.apex > 1.02 * f.apex);""")
R("""    else if (r.relativistic) v = 'Rex leaves at ' + fmtSpeed(r.v) + '. The ground under him turns to plasma.';""",
"""    else if (r.relativistic) v = 'Rex leaves at ' + fmtSpeed(r.v) + (c.groundHolds ? '.' : (r.groundDisrupts ? '. His push-off puts more energy into the ground than it takes to blow Earth apart.' : '. The ground under him turns to plasma.'));""")
R("""    else v = 'Rex jumps ' + fmtDist(f.apex) + ' high' + (r.groundFails ? (r.Eground >= 1e6 ? ' and leaves two craters behind.' : ' and leaves two deep footprints.') : '.');
    out.push(verdict(v));""","""    else v = 'Rex jumps ' + fmtDist(f.apex) + ' high' + (r.groundFails ? (r.Eground >= 1e6 ? ' and leaves two craters behind.' : ' and leaves two deep footprints.') : '.');
    if (up && f.landed && f.apex > 3.844e8) v += """ + PAST_MOON.replace('Its arc', 'His arc') + """;
    out.push(verdict(v));""")
R("""    else if (r.heldBack) gchip = status('warn', 'Ground at its limit: he holds back');
    else if (r.groundFails) gchip = status('bad', 'Ground gives: feet sink ' + fmtDist(r.sink));""",
"""    else if (groundBinds) gchip = status('warn', 'Ground at its limit: he holds back');
    else if (r.heldBack) gchip = status('good', 'Ground holds: he keeps under its limit');
    else if (r.groundDisrupts) gchip = status('bad', 'Earth blown apart');
    else if (r.groundFails) gchip = status('bad', 'Ground gives: feet sink ' + fmtDist(r.sink));""")
R("""    out.push(el('div', { class: 'status-row' }, gchip, r.v >= K.a0 && !r.relativistic ? status('warn', 'Sonic boom at takeoff') : null));""",
"""    out.push(el('div', { class: 'status-row' }, basisChip(r), gchip, r.v >= K.a0 && !r.relativistic ? status('warn', 'Sonic boom at takeoff') : null));""")
R("""      tile('Takeoff speed', speedOnly(r.v), fmtMach(r.v)),""","""      speedTile('Takeoff speed', r.v, fmtMach(r.v)),""")
R("""    if (r.heldBack) items.push('The ground is the limit. On ' + c.surface.short + ' his feet can push off with at most ' + fmtSI(RB, 'N') + ' before it gives, so he holds back to that: pushing a bit harder only sinks his feet and wastes the stroke.' + (rFree && !rFree.flight.escaped ? ' Rigid ground would send him ' + fmtDist(rFree.flight.apex) + '.' : ''));""",
"""    if (groundBinds) items.push('The ground is the limit. On ' + c.surface.short + ' his feet can push off with at most ' + fmtSI(RB, 'N') + ' before it gives, so he holds back to that: pushing a bit harder only sinks his feet and wastes the stroke.' + (rFree && !rFree.flight.escaped && !rFree.flight.relativistic ? ' Rigid ground would send him ' + fmtDist(rFree.flight.apex) + '.' : ''));
    else if (r.heldBack) items.push('On ' + c.surface.short + ' his feet can push off with at most ' + fmtSI(RB, 'N') + ' before it gives, so he keeps his push under that. Here it costs him nothing: rigid ground would give the same jump.');""")
R("""    if (state.mode === 'real') items.push('Real muscle caps his leg speed""","""    if (mode === 'real') items.push('Real muscle caps his leg speed""")
R("""      'Legs push his body (' + sig(c.body.m - c.body.feetMass, 3) + ' kg) up and his feet (' + sig(c.body.feetMass, 2) + ' kg) down with ' + fmtSI(r.F, 'N') + (state.mode === 'real' ? ' at most (1.4× the dial: the legs also carry his body weight)' : '') + ' over ' + sig(c.body.strokes.leg, 2) + ' m.',""",
"""      'Legs push his body (' + sig(c.body.m - c.body.feetMass, 3) + ' kg) up and his feet (' + sig(c.body.feetMass, 2) + ' kg) down with ' + fmtSI(r.F, 'N') + (mode === 'real' ? ' at most (' + shareText('jump', 'real') + ' of the dial’s force: the legs also carry his body weight), falling with speed per the Hill curve' : ' (' + shareText('jump', 'comic') + ' of the dial’s force, constant)') + ' over ' + sig(c.body.strokes.leg, 2) + ' m.' + (r.basis === 'real' && state.mode === 'comic' ? ' Comic mode’s fixed share would jump lower here, so the real-muscle result is shown.' : ''),""")
open(p,'w').write(s); print('ok')
