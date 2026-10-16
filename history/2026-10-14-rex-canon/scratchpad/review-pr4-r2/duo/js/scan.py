import json, re, sys
d = json.load(open(sys.argv[1]))
filt = sys.argv[2] if len(sys.argv) > 2 else ''
mode = sys.argv[3] if len(sys.argv) > 3 else 'flags'
bad = re.compile(r'\bNaN\b|undefined|\bInfinity\b|\bnull\b|\[object')
harmless = re.compile(r'Nothing in this test does harm|no cap needed|Even all-out, this test doesn’t|Nothing the lab checks in this test can do harm')
for k, r in d.items():
    if filt and not re.search(filt, k):
        continue
    a = r['all'] or ''
    fl = []
    if bad.search(a): fl.append('BADTOKEN:' + bad.search(a).group(0) + ':' + a[max(0, bad.search(a).start()-80):bad.search(a).start()+40])
    if r['errs']: fl.append('ERR:' + r['errs'][0][:200])
    if r.get('scroll'): fl.append('HSCROLL')
    if r['ms'] == -1: fl.append('TIMEOUT')
    if harmless.search(' '.join(r['effort'])): fl.append('HARMLESS')
    if mode == 'flags':
        if fl: print(k, fl)
    else:
        print('=====', k, r['ms'], fl)
        print('V:', r['verdict'])
        print('S:', ' / '.join(r['status']))
        print('E:', ' / '.join(r['effort']))
        if mode == 'full':
            print('T:', ' / '.join(r['tiles']))
            print('H:', ' / '.join(r['happens'])[:3000])
