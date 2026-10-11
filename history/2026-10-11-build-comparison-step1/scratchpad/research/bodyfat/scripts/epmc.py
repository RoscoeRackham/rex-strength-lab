import sys,json,urllib.request,urllib.parse
q=sys.argv[1]; n=int(sys.argv[2]) if len(sys.argv)>2 else 5
u='https://www.ebi.ac.uk/europepmc/webservices/rest/search?'+urllib.parse.urlencode({'query':q,'resultType':'core','format':'json','pageSize':n})
d=json.load(urllib.request.urlopen(u))
for r in d['resultList']['result']:
    print('###',r.get('pmid'),r.get('pmcid'),r.get('doi'),'|',r.get('authorString','')[:80],'|',r.get('journalTitle'),r.get('pubYear'))
    print('TITLE:',r.get('title'))
    print('ABS:',(r.get('abstractText') or '')[:3000])
    print()
