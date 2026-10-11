import re,html,sys
t=open(sys.argv[1],encoding='utf-8').read()
t=re.sub(r'</(td|th)>',' | ',t); t=re.sub(r'</(tr|p|title|caption|label)>','\n',t); t=re.sub('<[^>]+>','',t)
t=html.unescape(t)
open(sys.argv[2],'w').write(t)
