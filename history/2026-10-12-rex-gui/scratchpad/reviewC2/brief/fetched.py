import json, re, glob, sys
root = sys.argv[1]
d = json.load(open(root + '/research/reviews/gui-c-research.json'))
fetched = set(); checked = {}
for t in d['topics']:
    for c in t['skeptic']['checks']:
        for u in c.get('fetched', []): fetched.add(u.strip())
        checked.setdefault(c['key'], []).append((t['topic'], c.get('ok')))
r1 = open(root + '/research/reviews/gui-c-round1.json').read()
urls_r1 = set(re.findall(r'https?://[^\s"\'\)\]]+', r1))
facts = {}
for f in glob.glob(root + '/research/final-*.json'):
    for x in json.load(open(f))['facts']: facts[x['key']] = x
sys.path.insert(0, root)
src = open(root + '/build-data.py').read()
m = re.search(r'LADDER\s*=\s*\[(.*?)\n\]', src, re.S)
pairs = re.findall(r"\('(\w+)',\s*'(\w+)'\)", m.group(1))
def norm(u): return u.rstrip('/').replace('http://','https://')
F = {norm(u) for u in fetched}; R1 = {norm(u) for u in urls_r1}
for rid, key in pairs:
    f = facts[key]
    srcs = f['sources']
    st = []
    for s in srcs:
        u = norm(s['url'])
        st.append(('S' if u in F else '-') + ('R' if u in R1 else '-'))
    print(rid.ljust(13), key.ljust(45), f['status'].ljust(9), 'skeptic-checked:' + ('Y' if key in checked else 'N'), ' '.join(st))
