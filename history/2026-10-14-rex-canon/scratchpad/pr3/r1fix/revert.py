# Make a scratch copy of the working tree with one fix reverted, rebuild it, and print where it is.
# python3 revert.py <name>
import json, os, shutil, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = '/home/user/rex-strength-lab/rex-strength-lab'
REV = {
 'hot-callout': [('src/app.html', "(hotC ? 'Safe passenger takes back the landing’s energy", "(false ? 'Safe passenger takes back the landing’s energy")],
 'hot-tile': [('src/app.html', "(hotC ? ' (Safe passenger: spread through them; it doesn’t cover", "(false ? ' (Safe passenger: spread through them; it doesn’t cover")],
 'hot-card': [('src/static-data.js', " It doesn’t cover heating in a very fast flight (Things keep their form does): with that off and some of the air’s drag left, the lab can’t say they come down unharmed.", "")],
 'bear-throw': [('src/app.html', " + landGivesText(o, f.vImpact, c.surface, !!P.groundOf(c.surface));", ";")],
 'bear-impact': [('src/app.html', "'blast where they land (the ground still gives way under its push: above)' : 'crater or blast where they land'", "'crater or blast where they land' : 'crater or blast where they land'")],
 'bear-catch': [('src/app.html', "noHole = givesM ? 'with no blast' : 'with no crater or blast'", "noHole = 'with no crater or blast'"), ('src/app.html', " + landGivesText(o, m.vImpact, cO.surface)));", "));")],
 'bear-engine': [('src/engine.js', "return { push, bear, gives: push > bear, vBear, T };", "return { push, bear, gives: false, vBear, T };")],
 'quake': [('src/app.html', "'blast where they land (the ground still gives way under its push: above)' : 'crater or blast where they land'", "'quake or blast where they land (the ground still gives way under its push: above)' : 'crater, quake or blast where they land'")],
 'hits-ground': [('src/app.html', "const spHitsGround = (L, o, sp) => !!(", "const spHitsGround = (L, o, sp) => false && !!(")],
 'hits-ground-block': [('src/app.html', " && !spHitsGround(a, o, state.safePassenger)) out.push(blastBlock(a.hitsGround.E, 'where it hits the ground'));", ") out.push(blastBlock(a.hitsGround.E, 'where it hits the ground'));")],
 'squash': [('src/app.html', "' of its energy goes into squashing ' + (o.passenger && state.safePassenger ?", "' of its energy goes into squashing ' + (false ?")],
 'old-chip': [('src/app.html', "if (c.safePassenger) return status('info', 'Safe passenger: a manageable push, spread through them');", "if (c.safePassenger) return dg > L.noHarm(1) ? status(dg > L.injury(2) ? 'bad' : 'warn', 'Safe passenger, but air drag ' + sig(dg, 2) + ' g') : status('info', 'Safe passenger: a manageable push, spread through them');")],
 'old-drag-text': [('src/app.html', "(sp ? '; Safe passenger spreads that through them too, so it stays a manageable push' : '')", "(sp ? '; Safe passenger covers only his push, not the air' : '')")],
 'card-bearing': [('src/static-data.js', " Past what the ground bears, even with that push spread over their whole facing area, the ground gives way where they land (taking back the energy doesn’t take back the force, as with Soft landing): from a landing at about 100 m/s on the concrete slab or asphalt, 140 m/s on ice, 5.6 km/s on steel and 13 km/s on granite, and at 20–50 m/s on sand, gravel and clay (estimates). The lab doesn’t size the hole, and its shaking figures are rough past that point.", "")],
 'm-a-drag': [('src/engine.js', "passenger: (r, o) => !o.safePassenger && (MOVES.throw.passengerLaunch(r, o) || MOVES.throw.passengerDrag(r, o)),", "passenger: (r, o) => (!o.safePassenger && MOVES.throw.passengerLaunch(r, o)) || MOVES.throw.passengerDrag(r, o),")],
 'm-b-energy': [('src/engine.js', "? { absorbed: r.Eimpact, J: momentumOf(r.flight.vImpact, o.obj.m) } : null),", "? { absorbed: 0, J: momentumOf(r.flight.vImpact, o.obj.m) } : null),")],
 'm-c-momentum': [('src/engine.js', "          if (!r.canMove || !r.flight || !r.flight.landed || !(r.flight.vImpact > 0)) return null;\n          const L = o.obj.L", "          if (!r.canMove || !r.flight || !r.flight.landed || !(r.flight.vImpact > 0)) return null;\n          if (o.safePassenger && o.obj.passenger) return null;\n          const L = o.obj.L")],
 'm-d-blast': [('src/engine.js', "const land = r.flight.landed && !(o && o.safePassenger && o.obj && o.obj.passenger) ? shock(r.flight.vImpact, r.Eimpact) : 0;", "const land = r.flight.landed ? shock(r.flight.vImpact, r.Eimpact) : 0;")],
 'm-e-migration': [('src/app.html', "  if (savedV < 3) state.safePassenger = true;\n", "")],
 'm-f-mark2': [('src/app.html', "  if (savedV < 3) state.safePassenger = true;", "  if (savedV < 2) state.safePassenger = true;")],
}
name = sys.argv[1]
dst = os.path.join(HERE, name, 'rex-strength-lab')
if os.path.exists(os.path.dirname(dst)): shutil.rmtree(os.path.dirname(dst))
os.makedirs(dst)
for x in ['build.js', 'build-data.py', 'src', 'assets', 'test', 'research']:
    p = os.path.join(SRC, x)
    (shutil.copytree if os.path.isdir(p) else shutil.copy)(p, os.path.join(dst, x))
for f, old, new in REV[name]:
    fp = os.path.join(dst, f); s = open(fp, encoding='utf-8').read()
    assert s.count(old) == 1, (name, f, s.count(old)); open(fp, 'w', encoding='utf-8').write(s.replace(old, new))
os.makedirs(os.path.join(dst, 'dist'), exist_ok=True)
subprocess.run(['python3', 'build-data.py'], cwd=dst, check=True, stdout=subprocess.DEVNULL)
subprocess.run(['node', 'build.js'], cwd=dst, check=True, stdout=subprocess.DEVNULL)
print(dst)
