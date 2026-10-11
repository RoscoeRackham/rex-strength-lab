# usage: python3 -I inside.py <identifier> <query> <outdir>
import json, sys, urllib.request, urllib.parse, os, ssl
ident, q, outdir = sys.argv[1], sys.argv[2], sys.argv[3]
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=90) as r: return r.read()
meta = json.loads(get(f"https://archive.org/metadata/{ident}"))
server = meta.get('server') or meta.get('d1'); d = meta.get('dir')
files = [f['name'] for f in meta.get('files', [])]
docs = [f[:-len('_djvu.xml')] for f in files if f.endswith('_djvu.xml')] or [f[:-len('_chocr.html.gz')] for f in files if f.endswith('_chocr.html.gz')]
if not docs:
    docs = [f.rsplit('.',1)[0] for f in files if f.endswith('_jp2.zip')]
docs = [x.replace('_jp2','') for x in docs]
print('server', server, 'dir', d, 'docs', docs[:3])
for doc in docs[:1]:
    url = f"https://{server}/fulltext/inside.php?" + urllib.parse.urlencode({'item_id': ident, 'doc': doc, 'path': d, 'q': q})
    print('URL', url)
    raw = get(url)
    fn = os.path.join(outdir, f"inside_{ident}_{abs(hash(q))%10**6}.json")
    open(fn, 'wb').write(raw)
    try:
        j = json.loads(raw)
    except Exception:
        print(raw[:500]); continue
    for m in j.get('matches', []):
        pages = sorted({b.get('page') for p in m.get('par', []) for b in p.get('boxes', [])})
        print('--- page idx', pages, ':', m.get('text','').replace('\n',' '))
