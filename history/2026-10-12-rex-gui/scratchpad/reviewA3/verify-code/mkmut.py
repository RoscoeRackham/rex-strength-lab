import sys, shutil, os, subprocess
S = os.path.dirname(os.path.abspath(__file__))
muts = {
 'mutA_nobolt': [("    $('#bolt-rex').checked = state.anchor === 'bolted';\n    $('#bolt-ollie').checked = state.oAnchor === 'bolted';\n", "")],
 'mutB_nowangle': [("  if (!savedWAngle) state.wAngle = state.angle;\n", "")],
 'mutC_noplaceholder': [("      else { stopDuo(); duoPlaceholder(); }\n", "      else { stopDuo(); clearTimeout(BAY.duo.liveTimer); BAY.duo.spoken = null; }\n")],
}
for name, reps in muts.items():
    d = os.path.join(S, name)
    if os.path.exists(d): shutil.rmtree(d)
    shutil.copytree(os.path.join(S, 'base'), d, ignore=shutil.ignore_patterns('shots'))
    p = os.path.join(d, 'src', 'app.html')
    t = open(p, encoding='utf8').read()
    for a, b in reps:
        assert t.count(a) == 1, (name, a)
        t = t.replace(a, b)
    open(p, 'w', encoding='utf8').write(t)
    subprocess.run(['node', 'build.js'], cwd=d, check=True)
    print(name, 'built')
