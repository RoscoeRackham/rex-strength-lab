# Mutation driver: each mutant = (name, kind, [(file, old, new)]); kind 'engine' runs powers.js --skip-off,
# 'page' rebuilds and runs the shots.js round 2+3 blocks, 'both' does both.
import os, sys, subprocess, shutil, json, time
BASE = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r3-recheck/fixes'
MB = BASE + '/mutbase'
A, S, E = 'src/app.html', 'src/static-data.js', 'src/engine.js'
old_card = subprocess.run(['git', '-C', BASE + '/repo', 'show', '4ea43ef:rex-strength-lab/src/static-data.js'], capture_output=True, text=True).stdout
cur_card = open(MB + '/' + S, encoding='utf-8').read()
def seg(t, a, b):
    i = t.index(a); j = t.index(b, i) + len(b); return t[i:j]
c2d_old = seg(old_card, 'or a punch (a punch into air', 'more than it says).')
c2d_cur = seg(cur_card, 'or a punch (a punch into air', 'may shake the ground more than it says.')
M = [
 ('E1-r3-legs-revert', 'engine', [(E, "aFeet = Math.min(anc.R, LEG_SHARE() * usable) / body.m", "aFeet = anc.R / body.m")]),
 ('E2-r3-legs-1x', 'engine', [(E, "aFeet = Math.min(anc.R, LEG_SHARE() * usable) / body.m", "aFeet = Math.min(anc.R, usable) / body.m")]),
 ('E3-r3-legs-bolted-only', 'engine', [(E, "aFeet = Math.min(anc.R, LEG_SHARE() * usable) / body.m", "aFeet = (ctx.anchor === 'bolted' ? Math.min(anc.R, LEG_SHARE() * usable) : anc.R) / body.m")]),
 ('E4-r3-legs-dial', 'engine', [(E, "aFeet = Math.min(anc.R, LEG_SHARE() * usable) / body.m", "aFeet = Math.min(anc.R, LEG_SHARE() * ctx.F) / body.m")]),
 ('E5-r3-legs-friction-only', 'engine', [(E, "aFeet = Math.min(anc.R, LEG_SHARE() * usable) / body.m", "aFeet = (ctx.anchor === 'bolted' ? anc.R : Math.min(anc.R, LEG_SHARE() * usable)) / body.m")]),
 ('E6-r3-legs-2x', 'engine', [(E, "aFeet = Math.min(anc.R, LEG_SHARE() * usable) / body.m", "aFeet = Math.min(anc.R, 2 * usable) / body.m")]),
 ('P0-engine-revert-page', 'page', [(E, "aFeet = Math.min(anc.R, LEG_SHARE() * usable) / body.m", "aFeet = anc.R / body.m")]),
 ('P1-allReach', 'page', [(A, "      const thrownLegs = legs.filter((L) => !!(L && (L.recoilAbsorbedT || L.toGroundT)));\n      out.allReach = thrownLegs.length > 0 && thrownLegs.every((L) => CAUGHT.includes(L.result));\n      out.thrown = thrownLegs.length > 0;\n",
    "      out.allReach = legs.some(Boolean) && legs.every((L) => !L || CAUGHT.includes(L.result));\n      out.thrown = legs.some((L) => !!(L && (L.recoilAbsorbedT || L.toGroundT)));\n")]),
 ('P2-code1', 'page', [(A, "if (eff.real && factsTop('real').models.ground)", "if (eff.real && eff.p.factsAt(eff.p.hi, 'real').models.ground)")]),
 ('P3-vh-hazard', 'page', [(A, "': not counted with They take their own recoil off.'", "': not counted with They take their own recoil off (as before the power existed).'")]),
 ('P4-vh-box', 'page', [(A, "With They take their own recoil off the lab doesn’t count a pull’s ground shaking, so a quick, hard pull", "With They take their own recoil off the lab doesn’t count a pull’s ground shaking (as before the power existed), so a quick, hard pull")]),
 ('P5-vh-card', 'page', [(S, "With it off the lab counts no pull’s shaking: his footing", "With it off the lab counts no pull’s shaking, as before the power existed: his footing")]),
 ('P6-card-quick', 'page', [(S, "which all-out can be quick (0.31 s for a car at the page’s default dial; about 2 s for a locomotive, and longer at a low dial)", "which all-out takes a fraction of a second")]),
 ('P7-legs-item', 'page', [(A, "'Bolted, his feet can’t slide, so grip doesn’t limit his pull. His legs still move his own body, with at most ' + legX + ' the strength he uses (' + fmtSI(legsR, 'N') + ')' + (r.footLimited ? ', so his own body sets the pace: he pulls with ' + fmtSI(r.ropeT, 'N') + ' of the ' + fmtSI(r.usable, 'N') + ' he could, as hard as keeps the load at his pace. ' : '; here they keep up, so he pulls with all of the strength he uses and the load sets the pace. ')",
    "'Bolted, his feet can’t slide, so grip limits neither his pull nor his own steps: he pulls with all of the strength he uses, and the load alone sets the pace (his bolted feet keep his own body with it). '")]),
 ('P8-legs-steps', 'page', [(A, "(legsSet ? ' (his legs cap it: at most ' + legX + ' the strength he uses, ' + fmtSI(legsR, 'N') + (state.anchor === 'bolted' ? '' : ', less than his footing, ' + fmtSI(r.anchor.R, 'N')) + ').' : ' (his grip caps it: his footing, ' + fmtSI(r.anchor.R, 'N') + ', is the most his steps can push with).')",
    "(state.anchor === 'bolted' ? ' (bolted, nothing caps it: the quicker the pull, the harder his feet push).' : ' (his grip caps it: his footing, ' + fmtSI(r.anchor.R, 'N') + ', is the most his steps can push with).')")]),
 ('P9-legs-why', 'page', [(A, "(state.anchor === 'bolted' ? 'Bolted, his legs cap it: they push his own body with at most ' + legX + ' the strength he uses (about ' + fmtSI(legs, 'N') + ' here), so only a strong, quick pull shakes the ground.'\n        : legs < pr.anchor.R ? 'His legs cap it (at most ' + legX + ' the strength he uses, about ' + fmtSI(legs, 'N') + ' here, less than his footing), so it stays small.' : 'His grip caps it (his footing, about ' + fmtSI(pr.anchor.R, 'N') + ' here), so it stays small.')",
    "(state.anchor === 'bolted' ? 'Bolted, nothing caps it, so a quick, hard pull shakes the ground.' : 'His grip caps it (his footing, about ' + fmtSI(pr.anchor.R, 'N') + ' here), so it stays small.')")]),
 ('P10-legs-math-bolted', 'page', [(A, "'. They take their own recoil: the rope’s pull back goes to the endless ocean; acceleration = the smaller of (the strength he uses − resistance) ÷ load mass and his legs’ push ÷ his mass, legs’ push = ' + sig(LEG, 2) + ' × the strength he uses = ' + fmtSI(legsR, 'N') + '; the rope pulls as hard as keeps the load at that pace; his steps push the ground with his own body’s momentum, m v, over the pull'",
    "'. They take their own recoil: the rope’s pull back goes to the endless ocean, so pull = the strength he uses; acceleration = (pull − resistance) ÷ load mass (his bolted feet keep his own body at that pace); his steps push the ground with his own body’s momentum, m v, over the pull'")]),
 ('P10b-legs-math-friction', 'page', [(A, "'They take their own recoil: acceleration = the smaller of (the strength he uses − resistance) ÷ load mass and his feet’s push ÷ his mass; his feet push with the smaller of his footing, μ × his weight = ' + fmtSI(a.R, 'N') + ', and his legs’ push, ' + sig(LEG, 2) + ' × the strength he uses = ' + fmtSI(legsR, 'N') + '; the rope pulls as hard as keeps the load at that pace; his steps push the ground with his own body’s momentum, m v, over the pull'",
    "'They take their own recoil: pull = the strength he uses; acceleration = min((pull − resistance) ÷ load mass, footing ÷ his mass), footing = μ × his weight = ' + fmtSI(a.R, 'N') + '; his steps push the ground with his own body’s momentum, m v, over the pull'")]),
 ('P11-legs-status', 'page', [(A, "r.ownRecoil && r.footLimited && r.canMove ? status('warn', legsSet ? 'His legs set the pace' : 'His own footing sets the pace') : null,", "ownPull && r.footLimited && r.canMove ? status('warn', 'His own footing sets the pace') : null,")]),
 ('P12-legs-card', 'page', [(S, "his legs push his own body with at most 1.4× the strength he uses, and on friction his grip caps them too, so it stays small; bolted, only his legs cap them, so only a strong, quick pull shakes the ground", "on friction his grip caps them, so it stays small; bolted, nothing does, and a quick, hard pull shakes the ground")]),
 ('P13-legs-friction-walks', 'page', [(A, "' He still walks with it: his feet move his own body with at most the smaller of his footing (' + fmtSI(r.anchor.R, 'N') + '; walking runs on friction) and his legs’ push (' + fmtSI(legsR, 'N') + ', at most ' + legX + ' the strength he uses), so they can speed it up by at most ' + sig(Math.min(r.anchor.R, legsR) / c.body.m, 2) + ' m/s².'",
    "' He still walks with it, and walking runs on friction: his footing (' + fmtSI(r.anchor.R, 'N') + ') can speed his own body up by at most ' + sig(r.anchor.R / c.body.m, 2) + ' m/s².'")]),
 ('P14-legs-hazard', 'page', [(A, "': from his own steps only (the move itself: his legs push his own body with at most ' + sig(P.MUSCLE.jump.forceFrac, 2) + '× the strength he uses' + (state.anchor === 'bolted' ? '' : ', and his grip caps that too') + '); the rope’s", "': from his own steps only (the move itself); the rope’s")]),
 ('P15-legs-bar', 'page', [(A, "      r.ownRecoil ? { label: 'His legs (move his own body)', value: legsR } : null,\n", "")]),
 ('P16-legs-friction-pace', 'page', [(A, "(legsSet ? 'his own legs set' : 'his own footing sets')", "'his own footing sets'")]),
 ('C2a-caught', 'page', [(A, "        out.caught = !!t.catch;\n", "")]),
 ('C2b-friction-steps', 'page', [(A, " : ' (his grip caps it: his footing, ' + fmtSI(r.anchor.R, 'N') + ', is the most his steps can push with).')", " : '.')")]),
 ('C2c-why-bolted', 'page', [(A, "(state.anchor === 'bolted' ? 'Bolted, his legs cap it:", "(false ? 'Bolted, his legs cap it:")]),
 ('C2d-card', 'page', [(S, c2d_cur, c2d_old)]),
 ('C2e-hazard-on', 'page', [(A, "      else if (move === 'pull') items.push(el('li', {}, el('b', { text: 'Ground shaking' }), ': from his own steps only", "      else if (false) items.push(el('li', {}, el('b', { text: 'Ground shaking' }), ': from his own steps only")]),
 ('C2e-hazard-off', 'page', [(A, "move === 'pull' ? ': not counted with They take their own recoil off.' : ': not modelled for this move.'", "move === 'pull' && state.ownRecoil ? ': none: the rope’s pull back goes to the endless ocean, so nothing of the pull reaches the ground.' : ': not modelled for this move.'")]),
]
only = sys.argv[1].split(',') if len(sys.argv) > 1 and sys.argv[1] != 'all' else None
kinds = sys.argv[2].split(',') if len(sys.argv) > 2 else ['engine', 'page']
res = {}
for name, kind, reps in M:
    if only and not any(name.startswith(o) for o in only): continue
    if kind not in kinds: continue
    d = BASE + '/mut/' + name
    if os.path.exists(d): shutil.rmtree(d)
    shutil.copytree(MB, d, ignore=shutil.ignore_patterns('preview*.html'))
    okrep = True
    for f, old, new in reps:
        p = d + '/' + f; t = open(p, encoding='utf-8').read(); c = t.count(old)
        if c != 1: print(name, 'REPLACEMENT COUNT', c, f, old[:80]); okrep = False; break
        open(p, 'w', encoding='utf-8', newline='\n').write(t.replace(old, new))
    if not okrep: res[name] = 'bad-replacement'; continue
    log = BASE + '/logs/mut-' + name + '.log'
    t0 = time.time()
    with open(log, 'w') as L:
        if kind == 'engine':
            r = subprocess.run(['node', 'test/powers.js', '--skip-off'], cwd=d, stdout=L, stderr=subprocess.STDOUT)
        else:
            b = subprocess.run('python3 build-data.py && node build.js', shell=True, cwd=d, stdout=L, stderr=subprocess.STDOUT)
            if b.returncode: res[name] = 'build-failed'; continue
            r = subprocess.run(['node', BASE + '/scripts/blocks.js', d, 'both'], cwd=d, stdout=L, stderr=subprocess.STDOUT)
    out = open(log, encoding='utf-8').read()
    fails = [l[:400] for l in out.splitlines() if l.startswith('FAIL') or l.startswith('PROBLEM') or 'PAGE ERRORS' in l]
    res[name] = ('CAUGHT' if r.returncode else 'SURVIVED') + ' exit ' + str(r.returncode) + ' %.0fs' % (time.time() - t0)
    print(name, res[name], flush=True)
    for l in fails: print('   ', l, flush=True)
print(json.dumps(res, indent=1))
