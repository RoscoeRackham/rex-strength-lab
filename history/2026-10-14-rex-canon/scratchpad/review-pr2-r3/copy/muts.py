import subprocess, sys, os
D = os.path.dirname(os.path.abspath(__file__))
M = os.path.join(D, 'mut/rex-strength-lab')
muts = [
 ('pull-rs', "const rs = r.rolling ? 'rolling' : 'sliding';", "const rs = 'rolling';"),
 ('pull-allout-label', "the pull takes all-out'", "the pull takes'"),
 ('hint-weight', "The weight of what they hold up while they push stays on their feet, as on the Lift tab. ", ""),
 ('plasma-item', "if (a.result === 'fireball' && a.fireball.kind !== 'before' && cO.ownRecoil)", "if (false)"),
 ('catch-math', "(cO.ownRecoil ? 'Then his feet hold", "(false ? 'Then his feet hold"),
 ('allReach', "out.allReach = legs.some(Boolean) && legs.every((L) => !L || CAUGHT.includes(L.result));", "out.allReach = true;"),
 ('factsTop', "const topU = isFinite(Math.max(fullF('R'), fullF('O'))) ? eff.p.hi : Infinity", "const topU = eff.p.hi"),
 ('oneSided', "clashVerdict(r.clash, pusher, target, null, r.oneSided)", "clashVerdict(r.clash, pusher, target, null)"),
 ('cant-hold', ": a.result === 'cant-hold-it' ?", ": false ?"),
 ('stall-tile', "cP.ownRecoil ? 'the shove is weaker than '", "false ? 'the shove is weaker than '"),
 ('stall-math', "(cP.ownRecoil ? 'It moves nobody unless it beats '", "(false ? 'It moves nobody unless it beats '"),
 ('bolted-pull-word', "' (bolted, nothing caps it", "' (gently, nothing caps it"),
 ('toss-caught', ": f.caught ? 'They take their own recoil: the toss and the catch", ": true ? 'They take their own recoil: the toss and the catch"),
]
only = sys.argv[1:]
for name, a, b in muts:
    if only and name not in only: continue
    p = os.path.join(M, 'src/app.html')
    s = open(p, encoding='utf8').read()
    assert s.count(a) == 1, name
    open(p, 'w', encoding='utf8').write(s.replace(a, b))
    subprocess.run(['node', 'build.js'], cwd=M, check=True, capture_output=True)
    r = subprocess.run(['node', os.path.join(D, 'r12.js'), os.path.join(M, 'dist/index.html')], capture_output=True, text=True, timeout=1200)
    lines = [l for l in r.stdout.splitlines() if l.startswith('PROBLEM') or l.startswith('problems')]
    print('MUT', name, '=>', ' | '.join(l[:400] for l in lines), flush=True)
    subprocess.run(['git', 'checkout', '--', 'src/app.html'], cwd=M, check=True)
