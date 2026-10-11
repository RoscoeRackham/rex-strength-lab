import sys
p='/home/user/dino-strength-sim/src/app.html'; s=open(p).read()
def R(old,new,count=1):
    global s
    n=s.count(old)
    if n!=count: sys.exit('count %d != %d for: %s'%(n,count,old[:160]))
    s=s.replace(old,new)
R("""    const groundBinds = r.heldBack && rFree && (rFree.flight.escaped || rFree.flight.relativistic || rFree.flight.apex > 1.02 * f.apex);""",
  """    const groundBinds = r.heldBack && rFree && rFree.v > 1.01 * r.v;""")
# ---- stomp
R("""    out.push(el('div', { class: 'status-row' },
      quakeChip(r.E, r.quake),""","""    out.push(el('div', { class: 'status-row' },
      basisChip(r),
      quakeChip(r.E, r.quake),""")
R("""tile('Crater', 'up to ' + fmtDist(r.crater) + ' wide', r.craterExtrapolated ? 'extrapolated: same energy at 20 km/s' : 'impact scaling, upper bound');""",
  """tile('Crater', 'up to ' + fmtDist(r.crater) + ' wide', r.craterBeyondFit ? 'far past the fitted range (a few hundred km): rough size only' : (r.craterExtrapolated ? 'extrapolated: same energy at 20 km/s' : 'impact scaling, upper bound'));""")
R("""      tile('Foot speed at impact', speedOnly(r.vFoot), fmtMach(r.vFoot)),""","""      speedTile('Foot speed at impact', r.vFoot, fmtMach(r.vFoot)),""")
R("""      tile(r.vBody > 2 ? 'He gets launched' : 'Recoil hop', r.vBody > 0.5 ? (bf.relativistic ? fmtSpeed(r.vBody) : (bf.escaped ? 'Escapes Earth' : fmtDist(bf.apex) + ' up')) : 'none', r.vBody > 0.5 && !bf.relativistic ? speedOnly(r.vBody) : '')));""",
  """      bf.relativistic ? speedTile('He gets launched', r.vBody, '') : tile(r.vBody > 2 ? 'He gets launched' : 'Recoil hop', r.vBody > 0.5 ? (bf.escaped ? 'Escapes Earth' : fmtDist(bf.apex) + ' up') : 'none', r.vBody > 0.5 ? speedOnly(r.vBody) : '')));""")
R("""    else if (r.crater > 0 && !r.disrupts) items.push('Above about 2 km/s the foot doesn’t dig a hole""",
  """    else if (r.craterBeyondFit && !r.disrupts) items.push('Crater scaling is fitted to craters up to a few hundred km on flat ground. This one would be about ' + fmtDist(r.crater) + ' across on a curved planet, so read it as a rough basin size, not a definite crater.');
    else if (r.crater > 0 && !r.disrupts) items.push('Above about 2 km/s the foot doesn’t dig a hole""")
R("""(state.mode === 'real' ? 'with real muscle the recoil never gets beyond a small hop.'""","""((r.basis || state.mode) === 'real' ? 'with real muscle the recoil never gets beyond a small hop.'""")
# ---- punch
R("""    out.push(el('div', { class: 'status-row' },
      r.mach >= 1 ? status('warn', 'Sonic boom from the fist') : status('good', 'Subsonic'),""","""    out.push(el('div', { class: 'status-row' },
      basisChip(r),
      r.mach >= 1 ? status('warn', 'Sonic boom from the fist') : status('good', 'Subsonic'),""")
R("""      tile('Fist speed', speedOnly(r.vFist), fmtMach(r.vFist)),""","""      speedTile('Fist speed', r.vFist, fmtMach(r.vFist)),""")
R("""    if (r.vFist >= 0.01 * K.c) items.push('At this speed the air ahead of the fist is shock-heated into plasma and the energy comes out as a blast at his knuckles. (Air only starts to fuse much closer to light speed: xkcd’s “Relativistic Baseball” is pitched at 90% of it.)');""",
  """    if (r.vFist >= 0.01 * K.c) items.push('At this speed the air ahead of the fist is shock-heated into plasma and the energy comes out as a blast at his knuckles.' + (r.vFist < 0.5 * K.c ? ' (Air only starts to fuse much closer to light speed: xkcd’s “Relativistic Baseball” is pitched at 90% of it.)' : ' This close to light speed, air nuclei start to fuse too, as in xkcd’s “Relativistic Baseball”.'));""")
R("""    if (state.mode === 'real') items.push('Real muscle caps fist speed""","""    if ((r.basis || state.mode) === 'real') items.push('Real muscle caps fist speed""")
# ---- clap
R("""status('good', 'Subsonic hands'), status('info', 'Recoil cancels: left and right push equally')));""",
  """status('good', 'Subsonic hands'), status('info', 'Recoil cancels: left and right push equally'), basisChip(r)));""")
R("""      tile('Hand speed', speedOnly(r.vHand), fmtMach(r.vHand)),""","""      speedTile('Hand speed', r.vHand, fmtMach(r.vHand)),""")
R("""      state.mode === 'real' ? 'In real-muscle mode the hands cap near""","""      (r.basis || state.mode) === 'real' ? 'In real-muscle mode the hands cap near""")
# ---- sprint
R("""      tile('Top speed', r.relativistic ? fmtSpeed(r.vTop) : speedOnly(r.vTop), fmtMach(r.vTop)),""","""      speedTile('Top speed', r.vTop, fmtMach(r.vTop)),""")
open(p,'w').write(s); print('ok')
