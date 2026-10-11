import json,sys,re,urllib.request,urllib.parse,time
api,page,pat=sys.argv[1],sys.argv[2],sys.argv[3]
UA={'User-Agent':'buildcalc-research/0.1 (personal research)'}
def get(params):
    url=api+'?'+urllib.parse.urlencode(params)
    return json.load(urllib.request.urlopen(urllib.request.Request(url,headers=UA),timeout=60))
cont={}
while True:
    p={'action':'query','prop':'revisions','titles':page,'rvprop':'ids|timestamp|comment|user','rvlimit':'500','format':'json','redirects':1}
    p.update(cont); d=get(p)
    for pg in d['query']['pages'].values():
        for r in pg.get('revisions',[]):
            c=r.get('comment','')
            if re.search(pat,c,re.I): print(r['timestamp'][:10],r['revid'],r.get('user'),'|',c[:300])
    if 'continue' in d: cont=d['continue']
    else: break
