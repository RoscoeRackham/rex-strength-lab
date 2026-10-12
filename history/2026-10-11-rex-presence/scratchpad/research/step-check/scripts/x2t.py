import sys,re,html
s=open(sys.argv[1],encoding='utf-8').read()
s=re.sub(r'<(/?)(p|title|tr|caption|label|sec|table-wrap|fig)[^>]*>',lambda m:'\n',s)
s=re.sub(r'</t[dh]>',' | ',s)
s=re.sub(r'<[^>]+>','',s)
s=html.unescape(s)
s=re.sub(r'[ \t]+',' ',s)
s=re.sub(r'\n\s*\n+','\n',s)
open(sys.argv[2],'w',encoding='utf-8').write(s)
