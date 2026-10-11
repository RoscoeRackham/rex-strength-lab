import sys,re,html
from xml.etree import ElementTree as ET
p=sys.argv[1]
s=open(p,encoding='utf-8',errors='replace').read()
# crude: turn table cells into ' | ', rows into newlines
s=re.sub(r'</t[dh]>',' | ',s)
s=re.sub(r'</tr>','\n',s)
s=re.sub(r'</(p|title|caption|label|table-wrap|sec|fn)>','\n',s)
s=re.sub(r'<[^>]+>','',s)
s=html.unescape(s)
s=re.sub(r'[ \t]+',' ',s)
s=re.sub(r'\n\s*\n+','\n',s)
open(sys.argv[2],'w').write(s)
