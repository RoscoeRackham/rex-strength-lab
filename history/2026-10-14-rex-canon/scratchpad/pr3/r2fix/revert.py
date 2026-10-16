# Make a scratch copy of the working tree with one fix (or one mutant) reverted, rebuild it, and print where it is.
# python3 revert.py <name>   (round 2's reverts r2-*, round 1's reverts re-expressed on this tree, the build's mutants m-*)
import os, shutil, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = '/home/user/rex-strength-lab/rex-strength-lab'
REV = {
 # ---- round 2's fixes
 'r2-floor': [('src/engine.js', "const T = v > 0 ? L / v : Infinity, push", "const T = v > 0 ? Math.max(1e-3, L / v) : Infinity, push"),
              ('src/engine.js', "vBear: Math.sqrt(bear * L / (o.m * sn)), T, sn };", "vBear: Math.sqrt(bear * L / (o.m * sn)) <= L / 1e-3 ? Math.sqrt(bear * L / (o.m * sn)) : bear * 1e-3 / (o.m * sn), T, sn };")],
 'r2-angle-engine': [('src/engine.js', "const sn = angleDeg == null ? 1 : Math.max(1e-9, Math.sin(Math.min(90, Math.max(0, angleDeg)) * Math.PI / 180));", "const sn = 1;")],
 'r2-angle-throw': [('src/app.html', "landGivesText(o, f.vImpact, c.surface, !!P.groundOf(c.surface), f.impactAngleDeg);", "landGivesText(o, f.vImpact, c.surface, !!P.groundOf(c.surface));"),
                    ('src/app.html', "P.PASSENGER.landGround(o, f.vImpact, c.surface, f.impactAngleDeg).gives", "P.PASSENGER.landGround(o, f.vImpact, c.surface).gives")],
 'r2-angle-catch': [('src/app.html', "const mA = P.catchMissAngle(a, o, cR), angM = mA ? mA.angleDeg : null;", "const angM = null;")],
 'r2-angle-hits': [('src/app.html', "const hr = spHitReal(L, o), mA = P.catchMissAngle(L, o, null), ang = mA ? mA.angleDeg : null;", "const hr = spHitReal(L, o), ang = null;")],
 'r2-own': [('src/app.html', "(!(L.hitsGround.airK > 0) || (L.hitsGround.kept && !!L.hitsGround.own)));", "!(L.hitsGround.airK > 0));")],
 'r2-own-engine': [('src/engine.js', "          if (keptFire.kept) {\n            const mc2", "          if (false) {\n            const mc2")],
 'r2-unbounded': [('src/app.html', "          if (!isFinite(hr.p)) return head + 'unbounded energy.", "          if (false) return head + 'unbounded energy.")],
 'r2-earth': [('src/app.html', "const bigPush = hr.Ee > 4.184e6, gl", "const bigPush = false, gl")],
 'r2-earth-block': [('src/app.html', "if (isFinite(hr.E) && hr.E > 4.184e6) out.push(blastBlock(hr.E,", "if (false) out.push(blastBlock(hr.E,")],
 'r2-duo-blast': [('src/app.html', "(spHitsGround(L, o, cR.safePassenger) ? spHitReal(L, o).E : L.hitsGround.E)", "(spHitsGround(L, o, cR.safePassenger) ? 0 : L.hitsGround.E)")],
 'r2-duo-harm': [('src/app.html', ": !isFinite(spHitReal(L, o).p) ? 'the person hits the ground ' + fmtDist(L.hitsGround.at) + ' away with an unbounded push into the Earth'\n", "\n")],
 'r2-ice-box-on': [('src/app.html', "'; its push still reaches the ground' + (P.groundOf(c.surface) ? ', and the shaking from it counts.' : ' (the lab has no ground-wave model for ' + theSurf(c.surface) + ', so it can’t judge that shaking).') : '.')", "'; its push still reaches the ground, and the shaking from it counts.' : '.')")],
 'r2-ice-box-off': [('src/app.html', "with Safe passenger off the lab doesn’t judge it' + (P.groundOf(c.surface) ? ' (its shaking still counts).' : '.') }));", "with Safe passenger off the lab doesn’t judge it (its shaking still counts).' }));")],
 'r2-ice-impact': [('src/app.html', "'. Its push still reaches the ground and shakes it' + boxShake(c, 'gives how far') + '.');", "'. Its push still reaches the ground and shakes it (the effort box gives how far).');")],
 'r2-card-squash': [('src/static-data.js', " (so the first hit squashes only his palms)", "")],
 'r2-card-hits': [('src/static-data.js', " A person thrown so fast that the straight chord runs underground is landing too, wherever they come through whole (with all of the drag absorbed, or with Things keep their form on): Safe passenger takes back their own energy, but their push is far more than the ground bears, so the ground gives way there. Below 100% absorbed, the air they swept up (its heat and its motion) is real and blasts its own crater. A push big enough to move the whole Earth carries real energy too (at least what it gives the whole planet, counted as a blast), and an unbounded push has no physical answer.", "")],
 'r2-card-speeds': [('src/static-data.js', "1.8 km/s on steel and 2.7 km/s on granite", "5.6 km/s on steel and 13 km/s on granite")],
 'r2-card-catch-bearing': [('src/static-data.js', "Past what the ground bears under the downward part of that push (from a landing at about 100 m/s straight down on the concrete slab, an estimate; a fastball’s miss skims in nearly level and presses down far less), the ground gives way where they land.", "Past what the ground bears under that push (from a landing at about 100 m/s on the concrete slab, an estimate), the ground gives way where they land.")],
 # ---- round 1's fixes, re-expressed on this tree
 'hot-callout': [('src/app.html', "(hotC ? 'Safe passenger takes back the landing’s energy", "(false ? 'Safe passenger takes back the landing’s energy")],
 'hot-tile': [('src/app.html', "(hotC ? ' (Safe passenger: spread through them; it doesn’t cover", "(false ? ' (Safe passenger: spread through them; it doesn’t cover")],
 'hot-card': [('src/static-data.js', " It doesn’t cover heating in a very fast flight (Things keep their form does): with that off and some of the air’s drag left, the lab can’t say they come down unharmed.", "")],
 'bear-throw': [('src/app.html', " + landGivesText(o, f.vImpact, c.surface, !!P.groundOf(c.surface), f.impactAngleDeg);", ";")],
 'bear-impact': [('src/app.html', "'blast where they land (the ground still gives way under its push: above)' : 'crater or blast where they land'", "'crater or blast where they land' : 'crater or blast where they land'")],
 'bear-catch': [('src/app.html', "noHole = givesM ? 'with no blast' : 'with no crater or blast'", "noHole = 'with no crater or blast'"), ('src/app.html', " + landGivesText(o, m.vImpact, cO.surface, false, angM)));", "));")],
 'bear-engine': [('src/engine.js', "return { push, bear, gives: push > bear, vBear:", "return { push, bear, gives: false, vBear:")],
 'quake': [('src/app.html', "'blast where they land (the ground still gives way under its push: above)' : 'crater or blast where they land'", "'quake or blast where they land (the ground still gives way under its push: above)' : 'crater, quake or blast where they land'")],
 'hits-ground': [('src/app.html', "const spHitsGround = (L, o, sp) => !!(", "const spHitsGround = (L, o, sp) => false && !!(")],
 'hits-ground-block': [('src/app.html', " && !spHitsGround(a, o, state.safePassenger)) out.push(blastBlock(a.hitsGround.E, 'where it hits the ground'));", ") out.push(blastBlock(a.hitsGround.E, 'where it hits the ground'));")],
 'squash': [('src/app.html', "' of its energy goes into squashing ' + (o.passenger && state.safePassenger ?", "' of its energy goes into squashing ' + (false ?")],
 'old-chip': [('src/app.html', "if (c.safePassenger) return status('info', 'Safe passenger: a manageable push, spread through them');", "if (c.safePassenger) return dg > L.noHarm(1) ? status(dg > L.injury(2) ? 'bad' : 'warn', 'Safe passenger, but air drag ' + sig(dg, 2) + ' g') : status('info', 'Safe passenger: a manageable push, spread through them');")],
 'old-drag-text': [('src/app.html', "(sp ? '; Safe passenger spreads that through them too, so it stays a manageable push' : '')", "(sp ? '; Safe passenger covers only his push, not the air' : '')")],
 'card-bearing': [('src/static-data.js', " Past what the ground bears under the downward part of that push, even spread over their whole facing area, the ground gives way where they land (taking back the energy doesn’t take back the force, as with Soft landing): from a landing straight down at about 100 m/s on the concrete slab or asphalt, 140 m/s on ice, 1.8 km/s on steel and 2.7 km/s on granite, and at 20–50 m/s on sand, gravel and clay (estimates; a slanting landing has to be faster, about 120 m/s at 45° on the slab, and one that skims in nearly level presses down far less). The lab doesn’t size the hole, and its shaking figures are rough past that point.", "")],
 # ---- the build's six mutants (pull request 3), on this tree
 'm-a-drag': [('src/engine.js', "passenger: (r, o) => !o.safePassenger && (MOVES.throw.passengerLaunch(r, o) || MOVES.throw.passengerDrag(r, o)),", "passenger: (r, o) => (!o.safePassenger && MOVES.throw.passengerLaunch(r, o)) || MOVES.throw.passengerDrag(r, o),")],
 'm-b-energy': [('src/engine.js', "? { absorbed: r.Eimpact, J: momentumOf(r.flight.vImpact, o.obj.m) } : null),", "? { absorbed: 0, J: momentumOf(r.flight.vImpact, o.obj.m) } : null),")],
 'm-c-momentum': [('src/engine.js', "          if (!r.canMove || !r.flight || !r.flight.landed || !(r.flight.vImpact > 0)) return null;\n          const L = o.obj.L", "          if (!r.canMove || !r.flight || !r.flight.landed || !(r.flight.vImpact > 0)) return null;\n          if (o.safePassenger && o.obj.passenger) return null;\n          const L = o.obj.L")],
 'm-d-blast': [('src/engine.js', "const land = r.flight.landed && !(o && o.safePassenger && o.obj && o.obj.passenger) ? shock(r.flight.vImpact, r.Eimpact) : 0;", "const land = r.flight.landed ? shock(r.flight.vImpact, r.Eimpact) : 0;")],
 'm-e-migration': [('src/app.html', "  if (savedV < 3) state.safePassenger = true;\n", "")],
 'm-f-mark2': [('src/app.html', "  if (savedV < 3) state.safePassenger = true;", "  if (savedV < 2) state.safePassenger = true;")],
}
if __name__ == '__main__':
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
