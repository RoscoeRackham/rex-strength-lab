import json, os, shutil, subprocess, sys
BASE = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr5-r1/code/repo/rex-strength-lab'
WORK = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr5-r1/code/emut'
MUT = [
 ('well-0', "if (L.wells && L.wells.wellDominated) { const run = CATCHGAME.wellRun(L.wells, obj, L.aim.vL); return run.reached ? run.Edrag : keFromV(L.aim.vL, obj.m); }", "if (L.wells && L.wells.wellDominated) { return 0; }"),
 ('overshoot-rel-0', "if (L.relativistic || L.vL >= CATCHGAME.CATCH.V_FIREBALL) return keFromV(L.vL, obj.m);", "if (L.relativistic || L.vL >= CATCHGAME.CATCH.V_FIREBALL) return 0;"),
 ('fallsback-drag', "if (!r || !r.canMove || !r.flight || r.fallsBack || !(r.v > 0)) return 0;", "if (!r || !r.canMove || !r.flight || !(r.v > 0)) return 0;"),
 ('wrestle-angle-45', "add(whoA, 'drag', tbDrag(s * realAirThrow(rr, t.obj, opt.angle || 0, A.body), arrive));", "add(whoA, 'drag', tbDrag(s * realAirThrow(rr, t.obj, 45, A.body), arrive));"),
 ('miss-leaves', "if (person && T.safePassenger && !L.miss.leaves) arrive", "if (person && T.safePassenger) arrive"),
 ('toss-escapes-0', "if (!t || !['caught', 'slams', 'escapes', 'orbit', 'fireball', 'not-modelled'].includes(t.result)", "if (!t || !['caught', 'slams', 'fireball', 'not-modelled'].includes(t.result)"),
 ('reach-no-slams', "const reaches = ['caught', 'slams', 'wreckage', 'cant-hold-it'].includes(L.result);", "const reaches = ['caught', 'wreckage'].includes(L.result);"),
 ('toss-slams-0', "(t.result === 'caught' || t.result === 'slams')", "(t.result === 'caught')"),
 ('wrestle-rel', "B.unbreakable && f.landed && !f.relativistic && rr.crater > 0", "B.unbreakable && f.landed && rr.crater > 0"),
 ('fullstrength', "const hard = L.style === 'hard' || !!L.fullStrength;", "const hard = L.style === 'hard';"),
 ('dragE-cap', "return f0.relativistic || f0.escaped || f0.orbit || f0.timedOut ? keFromV(vE, obj.m) : f0.dragE;", "return f0.relativistic || f0.escaped || f0.orbit || f0.timedOut ? keFromV(vE, obj.m) : 1.01 * f0.dragE;"),
 ('toss-PE-sign', "return f0.landed && !f0.escaped && !f0.orbit && !f0.timedOut ? Math.max(0, Ev - keFromV(f0.vImpact, obj.m)) : Ev;", "return f0.landed && !f0.escaped && !f0.orbit && !f0.timedOut ? Math.max(0, Ev - keFromV(f0.vImpact, obj.m)) : 0;"),
 ('hg-airK', "const hg = L.hitsGround, own = !(hg.airK > 0) ? hg.E : hg.kept && hg.own ? hg.own.E : 0;", "const hg = L.hitsGround, own = !(hg.airK > 0) ? hg.E : hg.own ? hg.own.E : 0;"),
 ('throw-angle-0', "add(whoA, 'drag', tbDrag(s * realAirThrow(r, ob, A.angle || 0, body), arrive));", "add(whoA, 'drag', tbDrag(s * realAirThrow(r, ob, 45, body), arrive));"),
 ('collide-stop-bounce', "if (r.carry && r.carry.stop) add(whoA, 'stop', r.carry.stop.E);", "if (r.carry && r.carry.stop && r.hitAbsorbed && r.hitAbsorbed.E > 0) add(whoA, 'stop', r.carry.stop.E);"),
]
only = sys.argv[1:]
src = open(BASE + '/src/engine.js').read()
res = {}
for name, a, b in MUT:
    if only and name not in only: continue
    assert src.count(a) == 1, (name, src.count(a))
    d = WORK + '/' + name
    if os.path.exists(d): shutil.rmtree(d)
    os.makedirs(d)
    for sub in ('src', 'test', 'research'): shutil.copytree(BASE + '/' + sub, d + '/' + sub)
    open(d + '/src/engine.js', 'w').write(src.replace(a, b))
    p = subprocess.run(['node', 'test/powers.js', '--skip-off', '--tally-only'], cwd=d, capture_output=True, text=True)
    fails = [l[:110] for l in p.stdout.splitlines() if l.startswith('FAIL')]
    res[name] = {'exit': p.returncode, 'fails': fails}
    print(name, 'KILLED' if p.returncode else 'SURVIVED', len(fails), fails[:3], flush=True)
    shutil.rmtree(d)
json.dump(res, open(WORK + '-results.json', 'w'), indent=1)
