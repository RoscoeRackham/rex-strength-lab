import sys, re, shutil, os, subprocess
S = sys.argv[1]; name = sys.argv[2]
src = os.path.join(S, 'repo', 'rex-strength-lab')
dst = os.path.join(S, 'breaks', name, 'rex-strength-lab')
if os.path.exists(os.path.dirname(dst)): shutil.rmtree(os.path.dirname(dst))
shutil.copytree(src, dst, ignore=shutil.ignore_patterns('shots', 'preview.html'))
p = os.path.join(dst, 'src', 'app.html'); t = open(p, encoding='utf-8').read()
def rep(a, b, n=1):
    global t
    c = t.count(a)
    assert c == n, (name, a[:60], c)
    t = t.replace(a, b)
if name == 'B1':   # computes while closed
    rep("    if (!state.duoOpen) return;\n    duoMode = true;", "    duoMode = true;")
    rep("  function scheduleDuo(keepControls) {\n    if (!state.duoOpen) return;", "  function scheduleDuo(keepControls) {")
elif name == 'B2':  # closing doesn't stop the search
    rep("      else stopDuo();\n", "\n")
    rep("duoRunning !== p || !state.duoOpen || duoKey", "duoRunning !== p || duoKey")
elif name == 'B3':  # Ollie's panel left in the sidebar
    a = t.index('        <details class="setup" id="ollie-setup">'); b = t.index('        </details>\n', a) + len('        </details>\n')
    block = t[a:b]; t = t[:a] + t[b:]
    rep("      </details>\n    </aside>", "      </details>\n" + block + "    </aside>")
elif name == 'B4':  # dug-in wording back
    rep("footing = μ m g; unlimited if bolted.", "footing = μ m g, plus shear × buried area if dug in; unlimited if bolted.")
elif name == 'B7':  # probes run without the two-player cap outside a render
    rep("        duoMode = true;\n        try { memo.set(k, duoHarm(act));", "        try { memo.set(k, duoHarm(act));")
elif name == 'B8':  # a solo render stops the two-player search
    rep("  function renderSolo(keepControls) { renderInto(BAY.solo, keepControls); }", "  function renderSolo(keepControls) { duoRunning = null; renderInto(BAY.solo, keepControls); }")
elif name == 'B9':  # closing doesn't cancel the queued redraw, and renderDuo doesn't check (compute on close only via queued)
    rep("  function stopDuo() { duoGen++; duoQueued = false; duoKeepAll = true; duoRunning = null; }", "  function stopDuo() { }")
    rep("duoRunning !== p || !state.duoOpen || duoKey", "duoRunning !== p || duoKey")
    rep("    if (!state.duoOpen) return;\n    duoMode = true;", "    duoMode = true;")
open(p, 'w', encoding='utf-8').write(t)
subprocess.run(['node', 'build.js'], cwd=dst, check=True, stdout=subprocess.DEVNULL)
print('built', name)
