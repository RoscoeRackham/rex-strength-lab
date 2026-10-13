import subprocess, shutil, os, re, sys, json
S = sys.argv[1]
BASE = S + '/repo/rex-strength-lab'
W = S + '/mut/work'
def fresh():
    if os.path.exists(W): shutil.rmtree(W)
    os.makedirs(W)
    for d in ['src', 'test', 'research']:
        shutil.copytree(os.path.join(BASE, d), os.path.join(W, d))
def edit(rel, old, new, count=1):
    p = os.path.join(W, rel); t = open(p, encoding='utf-8').read()
    assert old in t, (rel, old)
    t = t.replace(old, new, count); open(p, 'w', encoding='utf-8').write(t)
def edit_re(rel, pat, new):
    p = os.path.join(W, rel); t = open(p, encoding='utf-8').read()
    t2, n = re.subn(pat, new, t, count=1, flags=re.S); assert n == 1, (rel, pat)
    open(p, 'w', encoding='utf-8').write(t2)
MUTS = {
 'M1 firm multiples/shares to 3 figures': [('src/ladder.js', "num(x, 2)) + '×", "num(x, 3)) + '×"), ('src/ladder.js', "num(100 * x, 2)) + '%", "num(100 * x, 3)) + '%")],
 'M2 rough to 2 figures': [('src/ladder.js', "'roughly ' + num(x, 1)", "'roughly ' + num(x, 2)"), ('src/ladder.js', "'roughly ' + num(100 * x, 1)", "'roughly ' + num(100 * x, 2)")],
 'M3 wrong number printed (x/2)': [('src/ladder.js', "num(x, 2)) + '×", "num(x / 2, 2)) + '×")],
 'M4 names the wrong rung (always the bottom rung) in same/times/share': [('src/ladder.js', "' the same as ' + best.short", "' the same as ' + lo.short"), ('src/ladder.js', "'× ' + best.short", "'× ' + lo.short"), ('src/ladder.js', "'% of ' + best.short", "'% of ' + lo.short")],
 'M5 same band 2x': [('src/ladder.js', 'const SAME = 1.15;', 'const SAME = 2;')],
 'M6 rough same band 1.15': [('src/ladder.js', 'const SAME_ROUGH = 1.5;', 'const SAME_ROUGH = 1.15;')],
 'M7 beyond text changed': [('src/ladder.js', "'beyond the ladder: more than its top rung (' + hi.short + ')'", "'off the scale'")],
 'M8 beyond names wrong end rung': [('src/ladder.js', "'beyond the ladder: more than its top rung (' + hi.short + ')'", "'beyond the ladder: more than its top rung (' + lo.short + ')'")],
 'M9 below-end check removed (share of the bottom rung down to 0)': [('src/ladder.js', "if (J < lo.J / band(lo)) return", "if (false) return")],
}
def data_mut(name, fn):
    MUTS[name] = fn
# data mutations operate on data.js via a JS snippet appended
def append_data(js):
    p = os.path.join(W, 'src/data.js'); open(p, 'a', encoding='utf-8').write('\n' + js + '\n')
DATA = {
 'D1 remove rung sugar': "window.DINO_DATA.energyRefs = window.DINO_DATA.energyRefs.filter(r => r.id !== 'sugar');",
 'D2 remove rung chelyabinsk (gap 229x)': "window.DINO_DATA.energyRefs = window.DINO_DATA.energyRefs.filter(r => r.id !== 'chelyabinsk');",
 'D3 flip rough lightning': "window.DINO_DATA.energyRefs.find(r => r.id === 'lightning').rough = false;",
 'D4 flip rough on (tnt)': "window.DINO_DATA.energyRefs.find(r => r.id === 'tnt').rough = true;",
 'D5 change a rung energy x1.5 (moab)': "window.DINO_DATA.energyRefs.find(r => r.id === 'moab').J *= 1.5;",
 'D6 wrong short (hiroshima says Nagasaki)': "window.DINO_DATA.energyRefs.find(r => r.id === 'hiroshima').short = 'the Nagasaki bomb';",
 'D7 remove sources row of a rung': "window.DINO_DATA.sourceRows = window.DINO_DATA.sourceRows.filter(r => r.label !== 'Energy: Hoover Dam: electricity generated in an average year');",
 'D8 sources row status changed (krakatoa verified)': "window.DINO_DATA.sourceRows.find(r => /^Energy: Krakatoa/.test(r.label)).status = 'verified';",
 'D9 remove top rung gw150914': "window.DINO_DATA.energyRefs = window.DINO_DATA.energyRefs.filter(r => r.id !== 'gw150914');",
 'D10 remove the 4 highest rungs': "window.DINO_DATA.energyRefs = window.DINO_DATA.energyRefs.filter(r => r.J < 1e46);",
}
res = []
for name, edits in MUTS.items():
    fresh()
    for e in edits: edit(*e)
    r = subprocess.run(['node', 'test/ladder.js'], cwd=W, capture_output=True, text=True)
    fails = [l for l in r.stdout.splitlines() if l.startswith('FAIL')]
    res.append((name, r.returncode, len(fails), (fails[0][:160] if fails else r.stderr.strip()[-200:])))
for name, js in DATA.items():
    fresh(); append_data(js)
    r = subprocess.run(['node', 'test/ladder.js'], cwd=W, capture_output=True, text=True)
    fails = [l for l in r.stdout.splitlines() if l.startswith('FAIL')]
    res.append((name, r.returncode, len(fails), (fails[0][:160] if fails else r.stderr.strip()[-200:])))
for x in res: print(('CAUGHT ' if x[1] else 'MISSED ') + x[0], '| fails', x[2], '|', x[3])
