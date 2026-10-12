#!/bin/bash
# usage: epmc.sh "query" -> prints id, title, journal, year, abstract
q=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$1")
curl -sS "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=$q&resultType=core&format=json&pageSize=${2:-3}" | python3 -c "
import json,sys
d=json.load(sys.stdin)
for r in d.get('resultList',{}).get('result',[]):
    print('###',r.get('pmid'),r.get('pmcid'),r.get('doi'),'|',r.get('title'),'|',r.get('journalInfo',{}).get('journal',{}).get('title'),r.get('pubYear'),'|',r.get('authorString','')[:120])
    print(r.get('abstractText','(no abstract)'))
    print()
"
