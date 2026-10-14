# make a mutated copy of the lab: python3 mutate.py NAME ; patches src/app.html then builds
import sys, os, shutil, subprocess
S = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
name = sys.argv[1]
M = {
 # 1: closing no longer stops the background search (stopDuo keeps duoRunning; the tick ignores duoOpen)
 'm1-noclose': [("function stopDuo() { duoGen++; duoQueued = false; duoKeepAll = true; duoRunning = null; }", "function stopDuo() { duoGen++; duoQueued = false; duoKeepAll = true; }"),
                ("if (duoRunning !== p || !state.duoOpen || duoKey(state.duoAction) !== p.key)", "if (duoRunning !== p || duoKey(state.duoAction) !== p.key)"),
                ("while (performance.now() - t0 < 20) if (p.step()) { duoRunning = null; renderDuo(true); return; }", "while (performance.now() - t0 < 20) if (p.step()) { duoRunning = null; if (state.duoOpen) renderDuo(true); return; }")],
 # 2: the element computes while closed (draws into its hidden bay)
 'm2-closedcompute': [("  function renderDuo(keepControls) {\n    if (!state.duoOpen) return;\n", "  function renderDuo(keepControls) {\n"),
                      ("  function scheduleDuo(keepControls) {\n    if (!state.duoOpen) return;\n", "  function scheduleDuo(keepControls) {\n")],
 # 3: Comic ground left in Size and density (and Ollie's height left in the sidebar)
 'm3-oldplace': [('        <label class="check"><input type="checkbox" id="ground-holds"><span><b>Comic ground</b> — the floor never breaks</span></label>\n', ''),
                 ('          <span class="hint">Mass and density move together. Changing height keeps his density.</span>\n        </div>\n      </details>',
                  '          <span class="hint">Mass and density move together. Changing height keeps his density.</span>\n        </div>\n        <label class="check"><input type="checkbox" id="ground-holds"><span><b>Comic ground</b> — the floor never breaks</span></label>\n      </details>')],
 # 4: dug-in text back in the Collide footing line
 'm4-dugin': [("const whyText = { footing: ' Standing on ' + cB.surface.short + ', friction holds him with '", "const whyText = { footing: ' Standing on ' + cB.surface.short + ', friction (or claws dug in) holds him with '")],
 # 5: a redraw of Rex's bay stops the two-player search
 'm5-solostopsduo': [("else if (!duo) stopPlan();", "else if (!duo) { stopPlan(); duoRunning = null; }")],
 # 6: a saved group 'duo' no longer opens the element
 'm6-nogroup': [("  if (state.group === 'duo') state.duoOpen = true;\n", "")],
 # 7: two-player mode leaks into Rex's bay whenever the element is open
 'm7-leak': [("const isDuo = () => duoMode;", "const isDuo = () => duoMode || state.duoOpen;")],
 # 8: Rex's bay draws with the two-player cap whenever the element is open (no effort search lost)
 'm9-duostopssolo': [("else if (!duo) stopPlan();", "else stopPlan();")],
 'fix-nested': [("function renderSolo(keepControls) { renderInto(BAY.solo, keepControls); }", "function renderSolo(keepControls) { const was = duoMode; duoMode = false; try { renderInto(BAY.solo, keepControls); } finally { duoMode = was; } }")],
 'm8-capleak': [("finally { duoCap = { R: Infinity, O: Infinity }; }", ""),
                ("Math.pow(10, state.logKg) * g, isDuo() ? duoCap.R : Infinity)", "Math.pow(10, state.logKg) * g, isDuo() || state.duoOpen ? duoCap.R : Infinity)"),
                ("      duoCap = { R: Infinity, O: Infinity };\n      if (duo) {", "      if (duo) {")],
}
d = os.path.join(S, 'mut', name)
if os.path.exists(d): shutil.rmtree(d)
shutil.copytree(os.path.join(S, 'lab'), d, ignore=shutil.ignore_patterns('shots'))
f = os.path.join(d, 'src', 'app.html')
t = open(f, encoding='utf-8').read()
for a, b in M[name]:
    assert t.count(a) == 1, (name, a[:80], t.count(a))
    t = t.replace(a, b)
open(f, 'w', encoding='utf-8').write(t)
subprocess.check_call(['node', 'build.js'], cwd=d)
print('built', d)
