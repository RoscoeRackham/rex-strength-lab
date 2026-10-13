import sys, subprocess, shutil, re
M = sys.argv[1]; D = sys.argv[2]
lad = open(D + '/ladder.orig.js', encoding='utf-8').read()
dat = open(D + '/data.orig.js', encoding='utf-8').read()
muts = {
 'no end band (bottom)': ('L', "if (J < lo.J / band(lo))", "if (J < lo.J)"),
 'no end band (top)': ('L', "if (J > hi.J * band(hi))", "if (J > hi.J)"),
 'no end band (both)': ('L2', [("if (J < lo.J / band(lo))", "if (J < lo.J)"), ("if (J > hi.J * band(hi))", "if (J > hi.J)")]),
 'end band x2': ('L2', [("if (J < lo.J / band(lo))", "if (J < lo.J / 2)"), ("if (J > hi.J * band(hi))", "if (J > hi.J * 2)")]),
 'negative J compared': ('L', "if (!(J > 0) || !isFinite(J))", "if (!(J !== 0) || J !== J || J === -Infinity)"),
 'no sort': ('L', "const list = refs.slice().sort((a, b) => a.J - b.J);\n    const lo", "const list = refs.slice();\n    const lo"),
 'same uses <=': ('L', "if (x < b && x > 1 / b)", "if (x <= b && x >= 1 / b)"),
 'rough band 1.4': ('L', "const SAME_ROUGH = 1.5;", "const SAME_ROUGH = 1.4;"),
 'rough band 1.6': ('L', "const SAME_ROUGH = 1.5;", "const SAME_ROUGH = 1.6;"),
 'SAME 1.12': ('L', "const SAME = 1.15;", "const SAME = 1.12;"),
 'SAME 1.17': ('L', "const SAME = 1.15;", "const SAME = 1.17;"),
 '3 figures': ('L', "num(x, 2)", "num(x, 3)"),
 'share 3 figures': ('L', "num(100 * x, 2)", "num(100 * x, 3)"),
 'rough 2 figs': ('L', "'roughly ' + num(x, 1)", "'roughly ' + num(x, 2)"),
 'beyond text': ('L', "beyond the ladder: more than", "off the ladder: more than"),
 'MAX_GAP 1000 (gaps)': ('L', "const MAX_GAP = 100;", "const MAX_GAP = 1000;"),
 'infinite text': ('L', "more than any finite amount", "infinite"),
 'about->approx': ('L', "(best.rough ? 'roughly' : 'about')", "(best.rough ? 'roughly' : 'approximately')"),
 'times sign x': ('L', "'× ' + best.short", "'x ' + best.short"),
 'nearest linear': ('L', "if (Math.abs(Math.log(J / r.J)) < Math.abs(Math.log(J / best.J))) best = r;", "if (Math.abs(J - r.J) < Math.abs(J - best.J)) best = r;"),
 'nearest below-only': ('L', "if (Math.abs(Math.log(J / r.J)) < Math.abs(Math.log(J / best.J))) best = r;", "if (r.J <= J) best = r;"),
 'tie goes up': ('L', "if (Math.abs(Math.log(J / r.J)) < Math.abs(Math.log(J / best.J))) best = r;", "if (Math.abs(Math.log(J / r.J)) <= Math.abs(Math.log(J / best.J))) best = r;"),
 'num floor': ('L', "const r = Math.round(x * p) / p;", "const r = Math.floor(x * p) / p;"),
 'num ceil': ('L', "const r = Math.round(x * p) / p;", "const r = Math.ceil(x * p) / p;"),
}
# data.js mutants
def rung_line(i): pass
dmuts = {}
# flip rough of lightning
dmuts['flip rough lightning'] = [(re.compile(r'("id":\s*"lightning"[^}]*?"rough":\s*)true'), r'\1false')]
dmuts['flip rough grenade'] = [(re.compile(r'("id":\s*"grenade"[^}]*?"rough":\s*)false'), r'\1true')]
dmuts['remove sunlightyear rung'] = [(re.compile(r'\{[^{}]*"id":\s*"sunlightyear"[^{}]*\},?\s*'), '')]
dmuts['remove tnt rung'] = [(re.compile(r'\{[^{}]*"id":\s*"tnt"[^{}]*\},?\s*'), '')]
dmuts['change hiroshima J'] = [(re.compile(r'("id":\s*"hiroshima"[^}]*?"J":\s*)[0-9.e+]+'), r'\g<1>7e13')]
dmuts['short with trailing dot'] = [(re.compile(r'("id":\s*"truck",\s*"short":\s*"[^"]*)"'), r'\1."')]
results = []
def run():
    p = subprocess.run(['node', 'test/ladder.js'], cwd=M, capture_output=True, text=True)
    fails = [l for l in p.stdout.splitlines() if l.startswith('FAIL')]
    return p.returncode, fails
for name, spec in muts.items():
    src = lad
    pairs = spec[1] if spec[0] == 'L2' else [(spec[1], spec[2])]
    for a, b in pairs:
        assert a in src, (name, a)
        src = src.replace(a, b)
    open(M + '/src/ladder.js', 'w', encoding='utf-8').write(src)
    rc, fails = run()
    print(('CAUGHT ' if rc else 'MISSED ') + name, len(fails), (fails[0][:150] if fails else ''))
open(M + '/src/ladder.js', 'w', encoding='utf-8').write(lad)
for name, subs in dmuts.items():
    src = dat
    for rx, rep in subs:
        src2 = rx.sub(rep, src, count=1)
        if src2 == src: print('NOAPPLY', name)
        src = src2
    open(M + '/src/data.js', 'w', encoding='utf-8').write(src)
    rc, fails = run()
    print(('CAUGHT ' if rc else 'MISSED ') + name, len(fails), (fails[0][:150] if fails else ''))
open(M + '/src/data.js', 'w', encoding='utf-8').write(dat)
