import json,sys,urllib.request,urllib.parse
q=sys.argv[1]; n=int(sys.argv[2]) if len(sys.argv)>2 else 5
url="https://www.ebi.ac.uk/europepmc/webservices/rest/search?"+urllib.parse.urlencode({'query':q,'resultType':'core','format':'json','pageSize':n})
d=json.load(urllib.request.urlopen(url))
for r in d['resultList']['result']:
    print('PMID',r.get('pmid'),'PMCID',r.get('pmcid'),'DOI',r.get('doi'))
    print(r.get('title')); print(r.get('authorString'))
    ji=r.get('journalInfo',{})
    print(ji.get('journal',{}).get('title'), ji.get('volume'), ji.get('issue'), r.get('pageInfo'), r.get('pubYear'))
    print(r.get('abstractText')); print('-----')
