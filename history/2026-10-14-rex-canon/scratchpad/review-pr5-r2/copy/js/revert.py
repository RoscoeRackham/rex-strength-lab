# Round 2 copy lens: revert each of round 1's copy fixes on its own in a scratch tree (from this reviewer's clone),
# rebuild, run node test/shots.js --pr5, record the failing checks. 'BASE' runs the unmodified tree.
import json, os, re, shutil, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '..', 'repo', 'rex-strength-lab')
TREES = os.path.join(HERE, '..', 'trees')
A, S = 'src/app.html', 'src/static-data.js'
R = {}
def rv(name, *edits): R[name] = edits
rv('BASE')
rv('F-copy1-growth-box', (A, "Canon: energy they absorb goes back into the endless ocean they draw on. Nothing around him changes, but it shows as his shimmer (the Shimmer tile in each what-if below). The growth modes", "Canon: energy they absorb goes back into the endless ocean they draw on, and nothing changes. The growth modes"))
rv('F-copy1-hint', (A, "Endless ocean: it returns to the store they draw on. Nothing around him changes; it shows only as his shimmer (the Shimmer tile). Gradual:", "Endless ocean: it returns to the store they draw on, and nothing changes. Gradual:"))
rv('F-copy1-callout', (A, "No mass is added, and nothing around him changes; it shows only as his shimmer (the Shimmer tile). Momentum", "No mass is added, and nothing outside changes. Momentum"))
rv('F-copy1-card', (S, "By default it returns to the endless store of power they draw on. Nothing around them changes, but it shows as his shimmer (see The shimmer card). The growth modes", "By default it returns to the endless store of power they draw on, and nothing changes. The growth modes"))
rv('F-copy3-unbounded-words', (A, "': at unlimited strength there is no finite figure.';", "': unlimited strength has no physical answer here, so there is no figure.';"))
rv('F-copy2-card', (S, "so it doesn’t shake the ground. Where they stand still, the push back itself carries almost no energy. But with this power on, what their own moves free goes to the endless ocean too, and the Shimmer tile counts it: a catch’s energy (the game of catch and the partner toss; canon: a catch is absorbed) and, in Collide’s charge, the hit’s freed energy (the one hit takes it in) and the charger’s own stop, whose motion goes to his source with its push back. An incoming hit", "so it doesn’t shake the ground; it carries almost no energy, since they don’t move. An incoming hit"))
rv('F-copy4-share-sentence', (A, "        + (tb.parts.drag > 0 ? ' The shimmer (the Shimmer tile) counts a different figure, ' + fmtSI(tb.parts.drag, 'J') + ': the ' + pctAir(share) + ' share of what real air would take from this same throw at the full drag' + (tb.parts.passenger > 0 ? ', less what is still in their landing, which Safe passenger takes back' : '') + ', not the share their power cancels along the flight it actually flies, which slows less than in real air.'\n          : tb.parts.passenger > 0 ? ' The shimmer (the Shimmer tile) counts what real air would have taken from them once, inside their landing, which Safe passenger takes back.' : '') + handSay);", "        + handSay);"))
rv('F-copy5-card-list', (S, "a hit’s freed energy (Collide’s charge, with the charger’s They take their own recoil, unless he means it; a throw that reaches the catcher as plasma, with the catcher’s Never knocked back), and in Collide the charger’s own stop, whose motion goes to his source with its push back (They take their own recoil); a person’s landing (Safe passenger); and a catch, which canon absorbs (They take their own recoil). Whatever the switches say, the energy that becomes mass in the Weight tab’s growth what-if counts too: it is a what-if, not a power, so it is the one Shimmer tile left with every power off. Momentum", "a hit’s freed energy (Collide’s charge, unless he means it; a throw that reaches the catcher as plasma), and in Collide the charger’s own stop, whose motion goes to his source with its push back; a person’s landing (Safe passenger); a catch, which canon absorbs (They take their own recoil); and the energy that becomes mass in the Weight tab’s growth what-if. Momentum"))
rv('F-realair-page-escape', (A, "(real && !real.landed ? ' (real air wouldn’t bring it down: this is the drag on its way out, and it leaves with the rest of its energy)' : '')", "(Math.abs(dragJ - r.Eobj) <= 1e-9 * r.Eobj ? ' (all of its energy: real air wouldn’t bring it down)' : '')"))
rv('F-realair-page-relativistic', (A, "    if (f.relativistic) items.push(fastThrowText(r, c, o, fa) + (tb.parts.drag > 0 && isFinite(tb.parts.drag) ? ' The shimmer (the Shimmer tile) counts ' + (share >= 1 ? '' : 'the ' + pctAir(share) + ' share of ') + 'what real air would have taken, ' + fmtSI(tb.parts.drag, 'J') + ': past 1% of light speed the lab gives real air all of its energy, an upper bound.' : ''));", "    if (f.relativistic) items.push(fastThrowText(r, c, o, fa));"))
rv('F-realair-card', (S, "The drag counted is what real air would have taken from the same throw: one more flight at the full drag, from the energy that leaves his own gravity well. Where that flight comes down, it is the energy lost on the way; where real air would never bring it down, the drag on its way out (it leaves with the rest of its energy); past 1% of light speed, all of its energy, an upper bound. It is not the drag along the drag-free path, which the Throw tab also gives:", "The drag counted is what real air would have taken from the same throw (one more flight at the full drag; all of its energy where real air would never bring it down), not the drag along the drag-free path, which the Throw tab also gives:"))
only = sys.argv[1:]
def run(name):
    edits = R[name]
    safe = re.sub(r'[^\w.-]+', '_', name)
    root = os.path.join(TREES, safe); d = os.path.join(root, 'rex-strength-lab')
    shutil.rmtree(root, ignore_errors=True); os.makedirs(d)
    for x in ['src', 'test']: shutil.copytree(os.path.join(SRC, x), os.path.join(d, x))
    for x in ['build.js', 'build-data.py']: shutil.copy(os.path.join(SRC, x), d)
    for x in ['research', 'assets']: os.symlink(os.path.abspath(os.path.join(SRC, x)), os.path.join(d, x))
    for f, old, new in edits:
        p = os.path.join(d, f); s = open(p, encoding='utf-8').read()
        if s.count(old) != 1: return {'error': 'pattern count %d: %s' % (s.count(old), old[:90])}
        open(p, 'w', encoding='utf-8').write(s.replace(old, new))
    res = {}
    subprocess.run(['python3', 'build-data.py'], cwd=d, capture_output=True)
    b = subprocess.run(['node', 'build.js'], cwd=d, capture_output=True, text=True)
    if b.returncode: res['build'] = b.stderr[-300:]
    p = subprocess.run(['node', 'test/shots.js', '--pr5'], cwd=d, capture_output=True, text=True, timeout=1800)
    out = p.stdout + p.stderr
    open(os.path.join(HERE, '..', 'logs', safe + '.log'), 'w').write(out)
    pl = ' '.join(l for l in out.splitlines() if l.startswith('PROBLEM'))
    res['fails'] = sorted(set(re.findall(r'pr5 \[[\w-]+\]', pl))) or ([pl[:300]] if pl else [])
    res['exit'] = p.returncode
    shutil.rmtree(root, ignore_errors=True)
    return res
os.makedirs(os.path.join(HERE, '..', 'logs'), exist_ok=True)
rp = os.path.join(HERE, '..', 'revert-results.json')
prev = json.load(open(rp)) if os.path.exists(rp) else {}
for name in [n for n in R if not only or n in only]:
    res = run(name); prev[name] = res
    print(name, json.dumps(res), flush=True)
    json.dump(prev, open(rp, 'w'), indent=1)
