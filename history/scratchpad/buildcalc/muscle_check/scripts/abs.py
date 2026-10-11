import json,sys,re
for f in sys.argv[1:]:
    d=json.load(open(f))
    for r in d.get('resultList',{}).get('result',[]):
        print('=====',r.get('pmid'),r.get('title'))
        print(r.get('journalInfo',{}).get('journal',{}).get('title'), r.get('pubYear'))
        a=r.get('abstractText','')
        print(re.sub('<[^>]+>','',a))
        print()
