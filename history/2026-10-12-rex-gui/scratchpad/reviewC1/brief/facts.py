import json,glob,sys
facts={}
for f in glob.glob('research/final-*.json'):
    for x in json.load(open(f))['facts']:
        facts.setdefault(x['key'],[]).append((f,x))
import re
src=open('build-data.py').read()
m=re.search(r'LADDER\s*=\s*\[(.*?)\n\]',src,re.S)
print(m.group(0)[:200] if m else 'no LADDER')
