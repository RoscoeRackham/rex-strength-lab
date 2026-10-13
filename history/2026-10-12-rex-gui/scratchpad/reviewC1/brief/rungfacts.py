import json,glob,re,sys
facts={}
for f in glob.glob('research/final-*.json'):
    for x in json.load(open(f))['facts']:
        facts[x['key']]=x
src=open('build-data.py').read()
lad=re.findall(r"\('(\w+)', '(\w+)'\)", re.search(r'LADDER = \[(.*?)\n\]',src,re.S).group(1))
full = len(sys.argv)>1
for rid,k in lad:
    f=facts[k]
    print('==',rid,k,f['status'],'%.4g'%f['value_si'],'lo=%s hi=%s'%(f.get('low_si'),f.get('high_si')),'rough=%s'%f.get('rough'),'|',f['display'])
    print('   short:',f.get('page_short'),'| who:',f.get('who_when'))
    for s in f['sources']: print('   src:',s['url'],'|',s.get('title','')[:90])
    if full: print('   notes:',f['notes'])
