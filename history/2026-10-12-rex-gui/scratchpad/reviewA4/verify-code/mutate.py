import sys
which, path = sys.argv[1], sys.argv[2]
s = open(path, encoding='utf-8').read()
def rep(old, new, count=1):
    global s
    assert s.count(old) == count, (which, old, s.count(old))
    s = s.replace(old, new)
if which == 'A':
    rep("""        duoCap = { R: Math.max(u, lo), O: state.oEffortOwn ? Math.max(Math.pow(10, state.oEffortLogKg) * g, lo) : Math.max(u, lo) };
        duoMode = true;
""", """        duoCap = { R: Math.max(u, lo), O: state.oEffortOwn ? Math.max(Math.pow(10, state.oEffortLogKg) * g, lo) : Math.max(u, lo) };
""")
elif which == 'C':
    rep("""        <div class="field">
          <label for="mass">Mass (kg)</label>""", """        <div class="field">
          <label for="surface">Ground</label>
          <select id="surface" aria-describedby="ground-hint"></select>
        </div>
        <div class="field">
          <label for="mass">Mass (kg)</label>""")
    rep("""        <label for="surface" class="side-head">Ground</label>
        <select id="surface" aria-describedby="ground-hint"></select>
        <span class="hint" id="ground-hint">""", """        <span class="hint" id="ground-hint">""")
elif which == 'D':
    rep("function renderSolo(keepControls) { const was = duoMode; duoMode = false; try { renderInto(BAY.solo, keepControls); } finally { duoMode = was; } }",
        "function renderSolo(keepControls) { renderInto(BAY.solo, keepControls); }")
open(path, 'w', encoding='utf-8').write(s)
print('mutated', which)
