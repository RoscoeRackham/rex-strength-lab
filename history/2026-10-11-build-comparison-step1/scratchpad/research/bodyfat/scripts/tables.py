import re,sys
x=open(sys.argv[1]).read()
kws=sys.argv[2:] 
t=re.sub(r'\s+',' ',re.sub(r'<[^>]+>',' ',x))
for t2 in re.finditer(r'<table-wrap .*?</table-wrap>',x,re.S):
    s=t2.group(0)
    cap=re.sub(r'\s+',' ',re.sub('<[^>]+>','',re.search(r'<caption>(.*?)</caption>',s,re.S).group(1))) if '<caption>' in s else ''
    print('=== ',cap[:300])
    for row in re.findall(r'<tr[^>]*>(.*?)</tr>',s,re.S):
        cells=[re.sub(r'\s+',' ',re.sub('<[^>]+>','',c)).strip() for c in re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>',row,re.S)]
        print(' | '.join(cells))
    f=re.search(r'<table-wrap-foot>(.*?)</table-wrap-foot>',s,re.S)
    if f: print('FOOT:',re.sub(r'\s+',' ',re.sub('<[^>]+>',' ',f.group(1)))[:600])
for kw in kws:
    for m in list(re.finditer(kw,t))[:3]:
        print('['+kw+']',t[max(0,m.start()-250):m.start()+350]);print()
