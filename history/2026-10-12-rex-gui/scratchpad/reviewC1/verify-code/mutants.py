import os, shutil, subprocess, sys, re
S = sys.argv[1]; BASE = os.path.join(S, 'copy', 'rex-strength-lab')
src = open(os.path.join(BASE, 'src', 'ladder.js')).read()
def rep(s, a, b, count=1):
    assert a in s, a
    return s.replace(a, b) if count == 0 else s.replace(a, b, count)
M = {
 'M1_three_figures_firm': lambda s: rep(rep(s, "num(x, 2))", "num(x, 3))"), "num(100 * x, 2))", "num(100 * x, 3))"),
 'M2_two_figures_rough': lambda s: rep(rep(s, "'roughly ' + num(x, 1)", "'roughly ' + num(x, 2)"), "'roughly ' + num(100 * x, 1)", "'roughly ' + num(100 * x, 2)"),
 'M3_halved_multiple': lambda s: rep(s, ": num(x, 2)) + '× '", ": num(x / 2, 2)) + '× '"),
 'M4_names_bottom_rung': lambda s: s.replace("+ best.short }", "+ lo.short }").replace("'× ' + best.short", "'× ' + lo.short").replace("'% of ' + best.short", "'% of ' + lo.short"),
 'M5_names_next_rung_up': lambda s: s.replace("+ best.short }", "+ (list[list.indexOf(best)+1]||best).short }").replace("'× ' + best.short", "'× ' + (list[list.indexOf(best)+1]||best).short").replace("'% of ' + best.short", "'% of ' + (list[list.indexOf(best)+1]||best).short"),
 'M6_same_rough_1_15': lambda s: rep(s, "const SAME_ROUGH = 1.5;", "const SAME_ROUGH = 1.15;"),
 'M8_above_names_bottom': lambda s: rep(s, "more than its top rung (' + hi.short", "more than its top rung (' + lo.short"),
 'CTRL_same_2': lambda s: rep(s, "const SAME = 1.15;", "const SAME = 2;"),
}
for name, f in M.items():
    d = os.path.join(S, 'mut', name)
    if os.path.exists(d): shutil.rmtree(d)
    os.makedirs(d)
    for sub in ['src', 'test', 'research']: shutil.copytree(os.path.join(BASE, sub), os.path.join(d, sub))
    m = f(src); assert m != src, name
    open(os.path.join(d, 'src', 'ladder.js'), 'w').write(m)
    r = subprocess.run(['node', 'test/ladder.js'], cwd=d, capture_output=True, text=True)
    last = r.stdout.strip().splitlines()[-1]
    fails = [l for l in r.stdout.splitlines() if l.startswith('FAIL')]
    # a sample of what the mutant says
    sample = subprocess.run(['node', '-e', "global.window={};require('./src/data.js');const L=require('./src/ladder.js');const R=window.DINO_DATA.energyRefs;for(const J of [3580,2.3e9,1.4e12,5e8,7e23,6.4e33,1e50])console.log('   ', J.toExponential(2), '->', L.compare(J,R).text)"], cwd=d, capture_output=True, text=True).stdout
    print(name, 'exit', r.returncode, last, ('first FAIL: ' + fails[0][:150]) if fails else '')
    print(sample, end='')
