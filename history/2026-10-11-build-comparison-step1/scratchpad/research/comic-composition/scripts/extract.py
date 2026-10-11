import sys, re, html
from html.parser import HTMLParser
class P(HTMLParser):
    def __init__(s):
        super().__init__(); s.out=[]; s.skip=0
    def handle_starttag(s,t,a):
        if t in ('script','style','noscript'): s.skip+=1
        if t in ('p','div','li','br','h1','h2','h3','h4','span','section'): s.out.append('\n')
    def handle_endtag(s,t):
        if t in ('script','style','noscript'): s.skip-=1
    def handle_data(s,d):
        if s.skip==0: s.out.append(d)
for fn in sys.argv[1:]:
    p=P(); p.feed(open(fn,encoding='utf-8',errors='replace').read())
    txt=re.sub(r'\n\s*\n+','\n',''.join(p.out))
    open(fn.replace('.html','.txt').replace('/raw/','/text/'),'w').write(txt)
    print(fn, len(txt))
