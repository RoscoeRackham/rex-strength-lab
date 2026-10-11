import sys,re,html
for fn in sys.argv[1:]:
    s=open(fn,encoding='utf-8',errors='replace').read()
    s=re.sub(r'(?is)<script.*?</script>',' ',s); s=re.sub(r'(?is)<style.*?</style>',' ',s)
    s=re.sub(r'<[^>]+>','\n',s); s=html.unescape(s)
    s=re.sub(r'\n\s*\n+','\n',s)
    open(fn.replace('.html','.txt'),'w').write(s)
