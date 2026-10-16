import json, sys, difflib
n = json.load(open(sys.argv[1])); b = json.load(open(sys.argv[2]))
fields = ['verdict', 'status', 'tiles', 'effort', 'happens', 'callouts', 'math']
same = 0; diffs = {}
for k in n:
    if k not in b: continue
    df = [f for f in fields if n[k].get(f) != b[k].get(f)]
    if not df: same += 1; continue
    diffs[k] = df
print('compared', sum(1 for k in n if k in b), 'same', same, 'differ', len(diffs))
by = {}
for k, df in diffs.items():
    by.setdefault(k.split('|')[0] + '|' + k.split('|')[1] + ':' + ','.join(df), []).append(k)
for g, ks in sorted(by.items()):
    print(g, len(ks), ks[:3])
show = sys.argv[3] if len(sys.argv) > 3 else None
if show:
    for k, df in diffs.items():
        if show not in k: continue
        for f in df:
            a = json.dumps(n[k].get(f), ensure_ascii=False); c = json.dumps(b[k].get(f), ensure_ascii=False)
            sm = difflib.SequenceMatcher(None, c, a)
            for op, i1, i2, j1, j2 in sm.get_opcodes():
                if op != 'equal': print(k, f, op, 'OLD:', c[max(0,i1-60):i2+60][:400], '\n      NEW:', a[max(0,j1-60):j2+60][:400])
