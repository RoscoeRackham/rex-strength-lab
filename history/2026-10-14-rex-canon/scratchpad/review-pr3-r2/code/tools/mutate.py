import sys, subprocess, os
LAB = sys.argv[1]
name = sys.argv[2]
def rd(p): return open(os.path.join(LAB, p), encoding='utf-8').read()
def wr(p, t): open(os.path.join(LAB, p), 'w', encoding='utf-8').write(t)
subprocess.run(['git', 'checkout', '-q', '--', 'src/app.html', 'src/engine.js', 'src/static-data.js'], cwd=LAB, check=True)
M = {
 # ---- round 1 reverts
 'hot-callout': [('src/app.html', "' + (hotC ? 'Safe passenger takes back the landing", "' + (false ? 'Safe passenger takes back the landing")],
 'hot-tile': [('src/app.html', "(o.passenger && state.safePassenger ? (hotC ? ", "(o.passenger && state.safePassenger ? (false ? ")],
 'hot-card': [('src/static-data.js', " It doesn’t cover heating in a very fast flight (Things keep their form does): with that off and some of the air’s drag left, the lab can’t say they come down unharmed. With all of the drag absorbed", " With all of the drag absorbed")],
 'hotC-false': [('src/app.html', "const hotC = !!(o && o.passenger", "const hotC = false && !!(o && o.passenger")],
 'bearing-throw': [('src/app.html', "' The landing’s push still reaches the ground, so it shakes the ground as a real landing does.' + landGivesText(o, f.vImpact, c.surface, !!P.groundOf(c.surface));", "' The landing’s push still reaches the ground, so it shakes the ground as a real landing does.';")],
 'bearing-impact': [('src/app.html', "so no ' + (P.PASSENGER.landGround(o, f.vImpact, c.surface).gives ? ", "so no ' + (false ? ")],
 'bearing-miss': [('src/app.html', "const givesM = P.PASSENGER.landGround(o, m.vImpact, cO.surface).gives,", "const givesM = false,"), ('src/app.html', "' Its push still reaches the ground and shakes it.' + landGivesText(o, m.vImpact, cO.surface)));", "' Its push still reaches the ground and shakes it.'));")],
 'bearing-miss-text': [('src/app.html', "' Its push still reaches the ground and shakes it.' + landGivesText(o, m.vImpact, cO.surface)));", "' Its push still reaches the ground and shakes it.'));")],
 'quake': [('src/app.html', "'blast where they land (the ground still gives way under its push: above)' : 'crater or blast where they land')", "'quake or blast where they land (the ground still gives way under its push: above)' : 'crater, quake or blast where they land')")],
 'hits-ground': [('src/app.html', "const spHitsGround = (L, o, sp) => !!(", "const spHitsGround = (L, o, sp) => false && !!(")],
 'hits-ground-block': [('src/app.html', "a.hitsGround.E > 4.184e6 && !spHitsGround(a, o, state.safePassenger)) out.push", "a.hitsGround.E > 4.184e6) out.push")],
 'hits-ground-blast-facts': [('src/app.html', "L.result === 'hits-ground' ? (spHitsGround(L, o, cR.safePassenger) ? 0 : L.hitsGround.E)", "L.result === 'hits-ground' ? L.hitsGround.E")],
 'hits-ground-harm': [('src/app.html', "out.harm = spHitsGround(L, o, cR.safePassenger) ? 'the person hits", "out.harm = false ? 'the person hits")],
 'hits-ground-gives': [('src/app.html', "const gl = landGivesText(o, L.miss.vImpact, ctx().surface);", "const gl = '';")],
 'squash': [('src/app.html', "(o.passenger && state.safePassenger ? 'his palms by about '", "(false ? 'his palms by about '")],
 'old-chip': [('src/app.html', "if (c.safePassenger) return status('info', 'Safe passenger: a manageable push, spread through them');", "if (c.safePassenger) return dg > L.noHarm(1) ? status(dg > L.injury(2) ? 'bad' : 'warn', 'Safe passenger, but air drag ' + sig(dg, 2) + ' g') : status('info', 'Safe passenger: a manageable push, spread through them');")],
 'old-drag-text': [('src/app.html', "(sp ? '; Safe passenger spreads that through them too, so it stays a manageable push' : '')", "(sp && dg > L.noHarm(1) ? '; Safe passenger covers only his push, not the air' : '')")],
 'card-speeds': [('src/static-data.js', "from a landing at about 100 m/s on the concrete slab or asphalt, 140 m/s on ice, 5.6 km/s on steel and 13 km/s on granite", "from a landing at about 100 m/s on the concrete slab or asphalt")],
 'card-squash': [('src/static-data.js', " (so the first hit squashes only his palms)", "")],
 'throw-hot-box': [('src/app.html', "hotP = !c.keepForm && airShareOf(c) < 1", "hotP = false && !c.keepForm && airShareOf(c) < 1")],
 'throw-burns': [('src/app.html', "burns = !c.keepForm && f.maxStagT > 1200 && share < 1", "burns = false")],
 # ---- task mutants (engine)
 'drag-on': [('src/engine.js', "passenger: (r, o) => !o.safePassenger && (MOVES.throw.passengerLaunch(r, o) || MOVES.throw.passengerDrag(r, o)),", "passenger: (r, o) => (!o.safePassenger && MOVES.throw.passengerLaunch(r, o)) || MOVES.throw.passengerDrag(r, o),")],
 'land-energy0': [('src/engine.js', "? { absorbed: r.Eimpact, J: momentumOf", "? { absorbed: 0, J: momentumOf")],
 'land-energy-half': [('src/engine.js', "? { absorbed: r.Eimpact, J: momentumOf", "? { absorbed: r.Eimpact / 2, J: momentumOf")],
 'land-mom0': [('src/engine.js', "J: momentumOf(r.flight.vImpact, o.obj.m) } : null),", "J: 0 } : null),")],
 'land-mom-vanish': [('src/engine.js', "if (!r.canMove || !r.flight || !r.flight.landed || !(r.flight.vImpact > 0)) return null;\n          const L = o.obj.L", "if (!r.canMove || !r.flight || !r.flight.landed || !(r.flight.vImpact > 0) || (o.safePassenger && o.obj.passenger)) return null;\n          const L = o.obj.L")],
 'land-mom-gentle': [('src/engine.js', "return impulseSource(o.surface, momentumOf(v, o.obj.m), Math.max(1e-3, L / v));", "return impulseSource(o.surface, momentumOf(v, o.obj.m), o.safePassenger && o.obj.passenger ? v / (1.5 * K.g) : Math.max(1e-3, L / v));")],
 'blast-kept': [('src/engine.js', "const land = r.flight.landed && !(o && o.safePassenger && o.obj && o.obj.passenger) ? shock", "const land = r.flight.landed ? shock")],
 'anypower-sp': [('src/engine.js', "const anyPower = (c) => !!c && (airShare(c) > 0 || !!c.keepForm || !!c.unbreakable || !!c.ownRecoil);", "const anyPower = (c) => !!c && (airShare(c) > 0 || !!c.keepForm || !!c.unbreakable || !!c.ownRecoil || !!c.safePassenger);")],
 'landground-false': [('src/engine.js', "return { push, bear, gives: push > bear, vBear, T };", "return { push, bear, gives: false, vBear, T };")],
 'landground-true': [('src/engine.js', "return { push, bear, gives: push > bear, vBear, T };", "return { push, bear, gives: true, vBear, T };")],
 'landground-noweight': [('src/engine.js', "const bear = Math.max(0, qultFor(surface, Math.sqrt(A)) * A - o.m * K.g);", "const bear = Math.max(0, qultFor(surface, Math.sqrt(A)) * A);")],
 # ---- task mutants (page)
 'no-migration': [('src/app.html', "if (savedV < 3) state.safePassenger = true;", "")],
 'mark2-choice': [('src/app.html', "if (savedV < 3) state.safePassenger = true;", "if (savedV < 2) state.safePassenger = true;")],
 'catch-drag': [('src/app.html', "if (!o.passenger || !L || !L.aim || state.safePassenger) return null;\n    // air drag in flight: the held 1.5 g limit, on the share of the drag that Air resistance absorbed leaves acting\n    const dg = P.PASSENGER.dragG(o, L.aim.vL) * P.dragFactor(cT || ctx());\n    if (dg > P.PASSENGER.noHarm(1)) return { over: true, where: 'drag', n: dg, t: 1, limit: P.PASSENGER.noHarm(1) };\n    if (!(L.tPush > 0)) return null;", "if (!o.passenger || !L || !L.aim) return null;\n    const dg = P.PASSENGER.dragG(o, L.aim.vL) * P.dragFactor(cT || ctx());\n    if (dg > P.PASSENGER.noHarm(1)) return { over: true, where: 'drag', n: dg, t: 1, limit: P.PASSENGER.noHarm(1) };\n    if (state.safePassenger || !(L.tPush > 0)) return null;")],
 'default-off': [('src/app.html', "airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: true,", "airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, safePassenger: false,")],
 'summary-no-sp': [('src/app.html', "state.ownRecoil && state.safePassenger;\n", "state.ownRecoil;\n")],
 'summary-drop-sp': [('src/app.html', "state.keepForm && 'things keep their form', state.safePassenger && 'safe passenger', ", "state.keepForm && 'things keep their form', ")],
 'credit-off': [('src/app.html', "passenger: M.passenger && c.safePassenger && offHappens('passenger', { safePassenger: false }) ? 'Safe passenger' : null };", "passenger: null };")],
 'valid-savev': [('src/app.html', "saveV: (v) => v === DEFAULTS.saveV,", "saveV: (v) => v === 2,")],
'card-hitsground': [('src/static-data.js', " With all of the drag absorbed, a person thrown so fast that the straight chord runs underground is landing too: Safe passenger takes back the energy of that hit, so it makes no blast, but its push is far more than the ground bears, so the ground gives way there.", "")],
 'shakefig-always': [('src/app.html', "(shakeFig ? ', and its shaking figures are rough there' : '')", "', and its shaking figures are rough there'")],
 'givestext-catch-gl': [('src/app.html', "' + (gl ? 'no blast' : 'no crater or blast') + '", "no crater or blast")],
 'credit-text': [('src/app.html', "passenger: 'the person pressed past the ride limits', slide:", "passenger: 'the person', slide:")]
}
if name not in M: print('unknown', name); sys.exit(2)
for p, a, b in M[name]:
    t = rd(p)
    n = t.count(a)
    if n != 1: print('MUTATION', name, 'matches', n, 'in', p, ':', a[:80]); sys.exit(3)
    wr(p, t.replace(a, b))
print('applied', name)
