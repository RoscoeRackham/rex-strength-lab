import json,sys,urllib.request,urllib.parse
q=sys.argv[1]
url="https://archive.org/services/search/beta/page_production/?"+urllib.parse.urlencode({'user_query':q,'service_backend':'fts','hits_per_page':25,'page_type':'collection_details','page_target':'texts'})
try:
    d=json.load(urllib.request.urlopen(url,timeout=60))
except urllib.error.HTTPError as e:
    print('HTTP',e.code,e.read()[:500]); sys.exit()
r=d.get('response',{})
if r.get('error'): print('ERR',r['error']); sys.exit()
hits=r['body']['hits']
print('total',hits.get('total'))
for h in hits.get('hits',[]):
    f=h.get('fields',{}); hl=h.get('highlight') or {}
    print(f.get('identifier'),'|',f.get('title'),'|',f.get('year') or f.get('date'))
    for k,v in hl.items():
        for s in v[:3]: print('    ',k,':',s.replace('\n',' ')[:400])
