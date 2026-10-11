import sys, re, html
p = sys.argv[1]; pats = sys.argv[2:]
s = open(p, encoding='utf-8', errors='replace').read()
if p.endswith('.html'):
    s = re.sub(r'<script.*?</script>', ' ', s, flags=re.S)
    s = re.sub(r'<style.*?</style>', ' ', s, flags=re.S)
    s = re.sub(r'<[^>]+>', ' ', s)
    s = html.unescape(s)
s = re.sub(r'\s+', ' ', s)
for pat in pats:
    for m in re.finditer(pat, s, flags=re.I):
        print('['+pat+']', s[max(0,m.start()-200):m.end()+200])
        print('--')
