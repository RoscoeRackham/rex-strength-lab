import sys, re, html
for p in sys.argv[1:]:
    s = open(p, encoding='utf-8', errors='replace').read()
    s = re.sub(r'<script.*?</script>', ' ', s, flags=re.S)
    s = re.sub(r'<style.*?</style>', ' ', s, flags=re.S)
    t = re.sub(r'<[^>]+>', ' ', s)
    t = html.unescape(t)
    t = re.sub(r'\s+', ' ', t)
    print('=====', p)
    for kw in ['HEIGHT', 'crowd-sourced', 'Height']:
        for m in re.finditer(kw, t):
            print('   ', kw, '::', t[max(0,m.start()-80):m.start()+200])
