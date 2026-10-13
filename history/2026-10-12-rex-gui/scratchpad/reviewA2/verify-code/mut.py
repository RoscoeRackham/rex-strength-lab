import sys, os, shutil, subprocess
V = os.path.dirname(os.path.abspath(__file__))
name = sys.argv[1]
M = {
 'leak-isduo': [("const isDuo = () => duoMode;", "const isDuo = () => duoMode || state.duoOpen;")],
 'leak-cap': [("    finally { duoCap = { R: Infinity, O: Infinity }; }\n", "\n"),
              ("      duoCap = { R: Infinity, O: Infinity };\n      if (duo) {", "      if (duo) {"),
              ("isDuo() ? duoCap.R : Infinity), mode:", "(isDuo() || state.duoOpen) ? duoCap.R : Infinity), mode:")],
 'kill-duo': [("else if (!duo) stopPlan();", "else if (!duo) { stopPlan(); duoRunning = null; }")],
}
d = os.path.join(V, 'm-' + name)
if os.path.exists(d): shutil.rmtree(d)
shutil.copytree(os.path.join(V, 'lab'), d, ignore=shutil.ignore_patterns('shots'))
f = os.path.join(d, 'src', 'app.html'); t = open(f, encoding='utf-8').read()
for a, b in M[name]:
    assert t.count(a) == 1, (name, a, t.count(a)); t = t.replace(a, b)
open(f, 'w', encoding='utf-8').write(t)
subprocess.check_call(['node', 'build.js'], cwd=d)
subprocess.check_call(['node', os.path.join(V, 'wrap.js'), os.path.join(d, 'dist', 'index.html'), os.path.join(V, 'pages', name + '.html')])
print('built', d)
