import sys
whiches, path = sys.argv[1].split('+'), sys.argv[2]
s = open(path, encoding='utf-8').read()
def rep(old, new):
    global s
    assert s.count(old) == 1, (old, s.count(old))
    s = s.replace(old, new)
for which in whiches:
    if which == 'D':
        rep("function renderSolo(keepControls) { const was = duoMode; duoMode = false; try { renderInto(BAY.solo, keepControls); } finally { duoMode = was; } }",
            "function renderSolo(keepControls) { renderInto(BAY.solo, keepControls); }")
    elif which == 'E':  # setIn redraws synchronously, as before round 3
        rep("clearTimeout(setInTimer); setInTimer = setTimeout(update, 0); };", "update(); };")
    elif which == 'I':  # instrument: count Rex's bay renders entered while two-player mode is on
        rep("  function renderSolo(keepControls) {", "  function renderSolo(keepControls) { if (duoMode) window.__nested = (window.__nested || 0) + 1;")
open(path, 'w', encoding='utf-8').write(s)
print('mutated', whiches)
