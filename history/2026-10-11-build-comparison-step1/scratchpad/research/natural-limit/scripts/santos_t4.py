import re, html, sys
t = open(sys.argv[1], encoding='utf-8').read()
m = re.search(r'<table-wrap id="pone-0097846-t004".*?</table-wrap>', t, re.S)
tab = m.group(0)
rows = re.findall(r'<tr[^>]*>(.*?)</tr>', tab, re.S)
for r in rows:
    cells = [re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', c))).strip() for c in re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', r, re.S)]
    print(' | '.join(cells))
