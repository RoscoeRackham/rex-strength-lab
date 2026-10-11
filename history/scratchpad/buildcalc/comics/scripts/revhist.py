# usage: python3 -I revhist.py <api_base> <page> <outdir>
# Samples one revision per year (latest in each year) and prints Height/Weight fields.
import json,sys,re,urllib.request,urllib.parse,os,time
api,page,outdir=sys.argv[1],sys.argv[2],sys.argv[3]
UA={'User-Agent':'buildcalc-research/0.1 (personal research)'}
def get(params):
    url=api+'?'+urllib.parse.urlencode(params)
    for i in range(3):
        try:
            return json.load(urllib.request.urlopen(urllib.request.Request(url,headers=UA),timeout=60))
        except Exception as e:
            time.sleep(2)
    raise
revs=[];cont={}
while True:
    p={'action':'query','prop':'revisions','titles':page,'rvprop':'ids|timestamp|size','rvlimit':'500','format':'json','rvdir':'newer','redirects':1}
    p.update(cont)
    d=get(p)
    for pg in d['query']['pages'].values():
        revs+=pg.get('revisions',[])
    if 'continue' in d: cont=d['continue']
    else: break
byyear={}
for r in revs: byyear[r['timestamp'][:4]]=r
fn=os.path.join(outdir,'rev_'+re.sub(r'[^A-Za-z0-9_-]','',page)+'.txt')
out=open(fn,'w')
print('==',page,'revisions:',len(revs))
for y in sorted(byyear):
    r=byyear[y]
    d=get({'action':'query','prop':'revisions','revids':r['revid'],'rvprop':'content|timestamp','rvslots':'main','format':'json'})
    pg=list(d['query']['pages'].values())[0]
    c=pg['revisions'][0]['slots']['main']['*']
    out.write('##### rev %s %s\n%s\n'%(r['revid'],r['timestamp'],c))
    hs=[];
    for k in ['Height','Weight']:
        m=re.search(r'\|\s*'+k+r'\s*=([^\n]*)',c)
        if m: hs.append(k+'='+m.group(1).strip()[:300])
    print(' ',r['timestamp'][:10],'rev',r['revid'],' | '.join(hs))
