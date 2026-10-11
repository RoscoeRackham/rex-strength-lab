#!/usr/bin/env python3
"""Query Europe PMC REST API; save raw JSON to outdir; print metadata and abstracts.
Usage: python3 -I epmc.py OUTDIR TAG "QUERY" [pageSize]"""
import json, sys, urllib.parse, subprocess, os
outdir, tag, q = sys.argv[1], sys.argv[2], sys.argv[3]
n = sys.argv[4] if len(sys.argv) > 4 else '5'
url = ('https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=' + urllib.parse.quote(q)
       + '&resultType=core&format=json&pageSize=' + n)
fn = os.path.join(outdir, tag + '.json')
subprocess.run(['curl', '-sS', '-o', fn, url], check=True)
d = json.load(open(fn))
print('URL:', url)
for r in d.get('resultList', {}).get('result', []):
    print('==', r.get('title'), '|', r.get('authorString'), '|',
          r.get('journalInfo', {}).get('journal', {}).get('title'), r.get('pubYear'),
          '| vol', r.get('journalInfo', {}).get('volume'), 'pages', r.get('pageInfo'),
          '| PMID', r.get('pmid'), '| DOI', r.get('doi'), '| PMCID', r.get('pmcid'), '| OA', r.get('isOpenAccess'))
    print(r.get('abstractText'))
