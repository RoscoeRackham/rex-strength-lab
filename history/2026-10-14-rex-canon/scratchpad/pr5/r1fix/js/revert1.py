# Review round 1 of pull request 5: each fix reverted on its own in a scratch tree, and the review's surviving mutants (engine
# and page) and the engine stage's 53 mutants, each run against the checks that guard it on the fixed tree.
# python3 revert1.py [names...]   (W=workers; results in ../revert1-results.json)
import json, os, re, shutil, subprocess, sys, concurrent.futures as cf
SRC = '/home/user/rex-strength-lab/rex-strength-lab'
HERE = os.path.dirname(os.path.abspath(__file__)); TREES = os.path.join(HERE, '..', 'trees')
E, A, S, L = 'src/engine.js', 'src/app.html', 'src/static-data.js', 'src/ladder.js'
TALLY, PAGE, PART1, LADDER = 'tally', 'page', 'part1', 'ladder'
R = {}
def rv(name, kind, test, *edits): R[name] = (kind, test, edits)
# ---------------------------------------------------------------- the fixes, each reverted on its own
rv('F-code1-leg-step-sum', 'revert', TALLY, (E, "        return Math.max(0, Math.min(f.dragE, isFinite(Eend) ? E0 - Eend : E0));\n      };", "        return f.dragE;\n      };"))
rv('F-code2-throw-all', 'revert', TALLY, (E, "      return f0.air ? Math.max(0, Math.min(E1, f0.air.E)) : 0;", "      return r.Eobj;"))
rv('F-code2-fly-tally', 'revert', TALLY, (E, "    const split = (dK < 1 || !!o.tally) && Cd > 0;", "    const split = dK < 1 && Cd > 0;"))
rv('F-code2-toss-all', 'revert', TALLY, (E, ": Math.max(0, Math.min(Ev, f0.dragE));", ": Ev;"))
rv('F-code2-leg-all', 'revert', TALLY, (E, "        if (f.escaped || f.orbit || f.timedOut) return Math.max(0, Math.min(E0, f.dragE));", "        if (f.escaped || f.orbit || f.timedOut) return keFromV(v0, obj.m);"))
rv('F-code3-from-hand', 'revert', TALLY, (E, "      const E1 = keFromV(r.vOut, obj.m) + tbPE(obj.m, body.releaseHeight);", "      const E1 = r.Eobj + tbPE(obj.m, body.releaseHeight);"))
rv('F-copy1-growth-box', 'revert', PAGE, (A, "Canon: energy they absorb goes back into the endless ocean they draw on. Nothing around him changes, but it shows as his shimmer (the Shimmer tile in each what-if below). The growth modes", "Canon: energy they absorb goes back into the endless ocean they draw on, and nothing changes. The growth modes"))
rv('F-copy1-hint', 'revert', PAGE, (A, "Endless ocean: it returns to the store they draw on. Nothing around him changes; it shows only as his shimmer (the Shimmer tile). Gradual:", "Endless ocean: it returns to the store they draw on, and nothing changes. Gradual:"))
rv('F-copy1-callout', 'revert', PAGE, (A, "No mass is added, and nothing around him changes; it shows only as his shimmer (the Shimmer tile). Momentum", "No mass is added, and nothing outside changes. Momentum"))
rv('F-copy1-card', 'revert', PAGE, (S, "By default it returns to the endless store of power they draw on. Nothing around them changes, but it shows as his shimmer (see The shimmer card). The growth modes", "By default it returns to the endless store of power they draw on, and nothing changes. The growth modes"))
rv('F-unbounded-words', 'revert', PAGE, (A, "': at unlimited strength there is no finite figure.';", "': unlimited strength has no physical answer here, so there is no figure.';"))
rv('F-code2-page-escape', 'revert', PAGE, (A, "(real && !real.landed ? ' (real air wouldn’t bring it down: this is the drag on its way out, and it leaves with the rest of its energy)' : '')", "(Math.abs(dragJ - r.Eobj) <= 1e-9 * r.Eobj ? ' (all of its energy: real air wouldn’t bring it down)' : '')"))
rv('F-code2-page-relativistic', 'revert', PAGE, (A, "    if (f.relativistic) items.push(fastThrowText(r, c, o, fa) + (tb.parts.drag > 0 && isFinite(tb.parts.drag) ? ' The shimmer (the Shimmer tile) counts ' + (share >= 1 ? '' : 'the ' + pctAir(share) + ' share of ') + 'what real air would have taken, ' + fmtSI(tb.parts.drag, 'J') + ': past 1% of light speed the lab gives real air all of its energy, an upper bound.' : ''));", "    if (f.relativistic) items.push(fastThrowText(r, c, o, fa));"))
rv('F-code2-card', 'revert', PAGE, (S, "The drag counted is what real air would have taken from the same throw: one more flight at the full drag, from the energy that leaves his own gravity well. Where that flight comes down, it is the energy lost on the way; where real air would never bring it down, the drag on its way out (it leaves with the rest of its energy); past 1% of light speed, all of its energy, an upper bound. It is not the drag along the drag-free path, which the Throw tab also gives:", "The drag counted is what real air would have taken from the same throw (one more flight at the full drag; all of its energy where real air would never bring it down), not the drag along the drag-free path, which the Throw tab also gives:"))
rv('F-copy2-card', 'revert', PAGE, (S, "so it doesn’t shake the ground. Where they stand still, the push back itself carries almost no energy. But with this power on, what their own moves free goes to the endless ocean too, and the Shimmer tile counts it: a catch’s energy (the game of catch and the partner toss; canon: a catch is absorbed) and, in Collide’s charge, the hit’s freed energy (the one hit takes it in) and the charger’s own stop, whose motion goes to his source with its push back. An incoming hit", "so it doesn’t shake the ground; it carries almost no energy, since they don’t move. An incoming hit"))
rv('F-copy4-share-sentence', 'revert', PAGE, (A, "        + (tb.parts.drag > 0 ? ' The shimmer (the Shimmer tile) counts a different figure, ' + fmtSI(tb.parts.drag, 'J') + ': the ' + pctAir(share) + ' share of what real air would take from this same throw at the full drag' + (tb.parts.passenger > 0 ? ', less what is still in their landing, which Safe passenger takes back' : '') + ', not the share their power cancels along the flight it actually flies, which slows less than in real air.'\n          : tb.parts.passenger > 0 ? ' The shimmer (the Shimmer tile) counts what real air would have taken from them once, inside their landing, which Safe passenger takes back.' : '') + handSay);", "        + handSay);"))
rv('F-copy5-card-list', 'revert', PAGE, (S, "a hit’s freed energy (Collide’s charge, with the charger’s They take their own recoil, unless he means it; a throw that reaches the catcher as plasma, with the catcher’s Never knocked back), and in Collide the charger’s own stop, whose motion goes to his source with its push back (They take their own recoil); a person’s landing (Safe passenger); and a catch, which canon absorbs (They take their own recoil). Whatever the switches say, the energy that becomes mass in the Weight tab’s growth what-if counts too: it is a what-if, not a power, so it is the one Shimmer tile left with every power off. Momentum", "a hit’s freed energy (Collide’s charge, unless he means it; a throw that reaches the catcher as plasma), and in Collide the charger’s own stop, whose motion goes to his source with its push back; a person’s landing (Safe passenger); a catch, which canon absorbs (They take their own recoil); and the energy that becomes mass in the Weight tab’s growth what-if. Momentum"))
# ---------------------------------------------------------------- the review's page mutants (code-4) and its control
TB_THROW = "    const tb = takenBack('throw', r, Object.assign({}, c, { obj: o, angle: state.angle }));"
rv('PM-control-stomp-tile', 'mutant', PAGE, (A, "'none', r.vBody > 0.5 ? speedOnly(r.vBody) : ''),\n      shimmerTile(tb)));", "'none', r.vBody > 0.5 ? speedOnly(r.vBody) : '')));"))
rv('PM-a-throw-allout', 'mutant', PAGE, (A, TB_THROW, "    const cAll = Object.assign({}, c, { use: undefined }), tb = takenBack('throw', P.throwObject(cAll, o, state.angle), Object.assign({}, cAll, { obj: o, angle: state.angle }));"))
rv('PM-b-throw-45', 'mutant', PAGE, (A, TB_THROW, "    const tb = takenBack('throw', P.throwObject(c, o, 45), Object.assign({}, c, { obj: o, angle: 45 }));"))
rv('PM-c-wrestle-45', 'mutant', PAGE, (A, "    const tb = takenBack('wrestleThrow', t, { A: cA, B: cB, whoA: nA === 'Rex' ? 'rex' : 'ollie', angle: state.wAngle });", "    const tb = takenBack('wrestleThrow', P.throwPartner(cA, cB, 45), { A: cA, B: cB, whoA: nA === 'Rex' ? 'rex' : 'ollie', angle: 45 });"))
rv('PM-d-backthrow-cut', 'mutant', PAGE, (A, "const backThrow = a.result === 'caught' && a.catch && !a.catch.carried && !a.bursts && !(a.recoil && a.recoil.outOfRange);", "const backThrow = a.result === 'caught' && a.catch;"))
rv('PM-e-floor-note', 'mutant', PAGE, (A, "+ (gl.word === 'too faint to see' ? ' The lab draws no glow below ' + floorRef.short + ' (' + fmtSI(floorRef.J, 'J') + '), its floor: a proposal, not canon.' : '')", "+ ''"))
rv('PM-f-glow-linear', 'mutant', PAGE, (A, "s = gl.none ? 0 : gl.strength, a = Math.sqrt(s);", "s = gl.none ? 0 : gl.strength, a = s;"))
# ---------------------------------------------------------------- the review's engine mutants (code-5: 15, the skeptic's 11 and controls among them)
rv('EM-well-0 (03)', 'mutant', TALLY, (E, "if (L.wells && L.wells.wellDominated) { const run = CATCHGAME.wellRun(L.wells, obj, L.aim.vL); return run.reached ? run.Edrag : keFromV(L.aim.vL, obj.m); }", "if (L.wells && L.wells.wellDominated) { return 0; }"))
rv('EM-overshoot-rel-0 (04)', 'mutant', TALLY, (E, "if (L.relativistic || L.vL >= CATCHGAME.CATCH.V_FIREBALL) return keFromV(L.vL, obj.m);", "if (L.relativistic || L.vL >= CATCHGAME.CATCH.V_FIREBALL) return 0;"))
rv('EM-fallsback-drag (02)', 'mutant', TALLY, (E, "if (!r || !r.canMove || !r.flight || r.fallsBack || !(r.v > 0)) return 0;", "if (!r || !r.canMove || !r.flight || !(r.v > 0)) return 0;"))
rv('EM-wrestle-angle-45 (01)', 'mutant', TALLY, (E, "add(whoA, 'drag', tbDrag(s * realAirThrow(rr, t.obj, opt.angle || 0, A.body), arrive));", "add(whoA, 'drag', tbDrag(s * realAirThrow(rr, t.obj, 45, A.body), arrive));"))
rv('EM-miss-leaves (07)', 'mutant', TALLY, (E, "if (person && T.safePassenger && !L.miss.leaves) arrive", "if (person && T.safePassenger) arrive"))
rv('EM-toss-escapes-0', 'mutant', TALLY, (E, "if (!t || !['caught', 'slams', 'escapes', 'orbit', 'fireball', 'not-modelled'].includes(t.result)", "if (!t || !['caught', 'slams', 'fireball', 'not-modelled'].includes(t.result)"))
rv('EM-reach-no-slams (05)', 'mutant', TALLY, (E, "const reaches = ['caught', 'slams', 'wreckage', 'cant-hold-it'].includes(L.result);", "const reaches = ['caught', 'wreckage'].includes(L.result);"))
rv('EM-toss-slams-0 (06)', 'mutant', TALLY, (E, "(t.result === 'caught' || t.result === 'slams')", "(t.result === 'caught')"))
rv('EM-wrestle-rel (11)', 'mutant', TALLY, (E, "B.unbreakable && f.landed && !f.relativistic && rr.crater > 0", "B.unbreakable && f.landed && rr.crater > 0"))
rv('EM-fullstrength (10)', 'mutant', TALLY, (E, "const hard = L.style === 'hard' || !!L.fullStrength;", "const hard = L.style === 'hard';"))
rv('EM-dragE-cap (C2; followed into lost())', 'mutant', TALLY, (E, "        return Math.max(0, Math.min(f.dragE, isFinite(Eend) ? E0 - Eend : E0));\n      };", "        return 1.01 * Math.max(0, Math.min(f.dragE, isFinite(Eend) ? E0 - Eend : E0));\n      };"))
rv('EM-toss-PE-sign (08; followed: never back -> 0)', 'mutant', TALLY, (E, ": Math.max(0, Math.min(Ev, f0.dragE));", ": 0;"))
rv('EM-hg-airK (09)', 'mutant', TALLY, (E, "const hg = L.hitsGround, own = !(hg.airK > 0) ? hg.E : hg.kept && hg.own ? hg.own.E : 0;", "const hg = L.hitsGround, own = !(hg.airK > 0) ? hg.E : hg.own ? hg.own.E : 0;"))
rv('EM-throw-angle-0 (C1)', 'mutant', TALLY, (E, "add(whoA, 'drag', tbDrag(s * realAirThrow(r, ob, A.angle || 0, body), arrive));", "add(whoA, 'drag', tbDrag(s * realAirThrow(r, ob, 45, body), arrive));"))
rv('EM-collide-stop-bounce', 'mutant', TALLY, (E, "if (r.carry && r.carry.stop) add(whoA, 'stop', r.carry.stop.E);", "if (r.carry && r.carry.stop && r.hitAbsorbed && r.hitAbsorbed.E > 0) add(whoA, 'stop', r.carry.stop.E);"))
# ---------------------------------------------------------------- the engine stage's 53 mutants (scratchpad pr5/engine-mutants), 7 followed
ns = {'__file__': os.path.join(HERE, '..', '..', 'engine-mutants', 'mutants.py')}
exec(open(ns['__file__']).read().split('def run(m):')[0], ns)
CMD = {' '.join(ns['TALLY']): TALLY, ' '.join(ns['LADDER']): LADDER, ' '.join(ns['PART1']): PART1}
E1 = "      const E1 = keFromV(r.vOut, obj.m) + tbPE(obj.m, body.releaseHeight);"
FOLLOW = {
  'drag-ocean': (E1, "      if (r.flight.ocean) return r.flight.ocean.E;\n" + E1),
  'drag-escape-0': ("      return f0.air ? Math.max(0, Math.min(E1, f0.air.E)) : 0;", "      return 0;"),
  'drag-rel-0': ("      if (r.flight.relativistic) return r.Eobj;\n" + E1, "      if (r.flight.relativistic) return 0;\n" + E1),
  'drag-no-PE': (E1, "      const E1 = keFromV(r.vOut, obj.m);"),
  'toss-flight-0': ("      return f0.landed && !f0.escaped && !f0.orbit && !f0.timedOut ? Math.max(0, Ev - keFromV(f0.vImpact, obj.m)) : Math.max(0, Math.min(Ev, f0.dragE));", "      return 0;"),
  'leg-flight-swap': ("hStop: hard ? 0 : L.hStop, Dend: L.Dfl }, hard ? { xStop: L.Dfl } : {}, full)), vE, hard ? 0 : L.hStop);", "hStop: hard ? L.hStop : 0, Dend: L.Dfl }, hard ? {} : { xStop: L.Dfl }, full)), vE, hard ? L.hStop : 0);"),
  'mutates-result': (E1, "      r.realAirTake = true;\n" + E1),
}
for (mid, what, f, old, new, cmd) in ns['M']:
    if mid in FOLLOW: old, new = FOLLOW[mid]; mid = mid + ' (followed)'
    rv('ES-' + mid, 'mutant', CMD[' '.join(cmd)], (f, old, new))
only = sys.argv[1:]
def run(name):
    kind, test, edits = R[name]
    safe = re.sub(r'[^\w.-]+', '_', name)
    root = os.path.join(TREES, safe); d = os.path.join(root, 'rex-strength-lab')
    shutil.rmtree(root, ignore_errors=True); os.makedirs(d)
    for x in ['src', 'test']: shutil.copytree(os.path.join(SRC, x), os.path.join(d, x))
    for x in ['build.js', 'build-data.py']: shutil.copy(os.path.join(SRC, x), d)
    for x in ['research', 'assets']: os.symlink(os.path.join(SRC, x), os.path.join(d, x))
    for f, old, new in edits:
        p = os.path.join(d, f); s = open(p, encoding='utf-8').read()
        if s.count(old) != 1: shutil.rmtree(root, ignore_errors=True); return name, {'error': 'pattern count %d: %s' % (s.count(old), old[:90])}
        open(p, 'w', encoding='utf-8').write(s.replace(old, new))
    res = {'kind': kind, 'test': test}
    if test == PAGE:
        if any(f == S for f, _, _ in edits): subprocess.run(['python3', 'build-data.py'], cwd=d, capture_output=True)
        b = subprocess.run(['node', 'build.js'], cwd=d, capture_output=True, text=True)
        if b.returncode: res['build'] = b.stderr[-300:]
        p = subprocess.run(['node', 'test/shots.js', '--pr5'], cwd=d, capture_output=True, text=True, timeout=1800)
        out = p.stdout + p.stderr
        pl = ' '.join(l for l in out.splitlines() if l.startswith('PROBLEM'))
        res['fails'] = sorted(set(re.findall(r'pr5 \[[\w-]+\]', pl))) or ([pl[:300]] if pl else [])
    else:
        cmd = {TALLY: ['node', 'test/powers.js', '--skip-off', '--tally-only'], PART1: ['node', 'test/powers.js', '--off-only'], LADDER: ['node', 'test/ladder.js']}[test]
        p = subprocess.run(cmd, cwd=d, capture_output=True, text=True, timeout=1800)
        out = p.stdout + p.stderr
        res['fails'] = [re.sub(r'\s+', ' ', l[5:])[:110] for l in out.splitlines() if l.startswith('FAIL ')]
        if p.returncode and not res['fails']: res['fails'] = ['crash: ' + ' '.join(out.strip().splitlines()[-2:])[:200]]
    res['exit'] = p.returncode; res['killed'] = p.returncode != 0
    shutil.rmtree(root, ignore_errors=True)
    return name, res
names = [n for n in R if not only or any(n.startswith(o) for o in only)]
out = {}
with cf.ThreadPoolExecutor(max_workers=int(os.environ.get('W', '3'))) as ex:
    for name, res in ex.map(run, names):
        out[name] = res
        print(('KILLED ' if res.get('killed') else 'SURVIVED ' if 'error' not in res else 'ERROR ') + name, json.dumps(res.get('fails', res.get('error')))[:400], flush=True)
rp = os.path.join(HERE, '..', 'revert1-results.json')
prev = json.load(open(rp)) if os.path.exists(rp) else {}
prev.update(out); json.dump(prev, open(rp, 'w'), indent=1)
