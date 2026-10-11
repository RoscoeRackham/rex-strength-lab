import re,html,sys
for f in sys.argv[1:]:
    t=open(f,encoding='utf-8',errors='replace').read()
    t=re.sub(r'(?is)<(script|style|noscript)[^>]*>.*?</\1>',' ',t)
    t=re.sub(r'(?i)</(p|div|h\d|li|tr|br)>|<br\s*/?>','\n',t)
    t=re.sub('<[^>]+>',' ',t); t=html.unescape(t)
    t=re.sub(r'[ \t]+',' ',t); t=re.sub(r'\n\s*\n+','\n',t)
    open(f.rsplit('.',1)[0]+'.txt','w').write(t)
