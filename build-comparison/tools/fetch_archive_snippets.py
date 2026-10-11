#!/usr/bin/env python3
"""Fetch the archive.org full-text search results that the comics facts cite, and keep the matched text.

The comics research quotes Marvel's Official Handbook through archive.org's full-text search API
(https://archive.org/services/search/beta/page_production/?service_backend=fts...). That API often
fails (HTTP 400 wrapping a 502), and the handbooks are lending-library items whose OCR text is not
public, so the search result is the only public copy of each quote. This script fetches each search
once more (with retries), and writes research/archive_snippets.json: per search URL, the items hit,
their titles and the highlighted passages. tools/compile_facts.py uses it to put the matched text in
each source and to add the item's stable archive.org page beside the API link.

Run from build-comparison/ (needs network):  python3 tools/fetch_archive_snippets.py
A response saved earlier (for example with curl, when the API happened to answer) can be added with
  python3 tools/fetch_archive_snippets.py --import URL saved.json
"""
import datetime
import json
import os
import re
import sys
import time
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
R1 = os.path.join(ROOT, 'research', 'round1')
OUT = os.path.join(ROOT, 'research', 'archive_snippets.json')


def search_urls():
    urls = []
    for name in sorted(os.listdir(R1)):
        if not name.startswith('research_'):
            continue
        with open(os.path.join(R1, name), encoding='utf-8') as f:
            text = f.read()
        for u in re.findall(r'https://archive\.org/services/search/beta/page_production/\?[^"\s\\]+', text):
            if u not in urls:
                urls.append(u)
    return urls


def fetch(url, tries=6):
    last = None
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'rex-strength-lab research (archive_snippets)'})
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.load(r)
        except Exception as e:  # HTTP 400/502 from the API: wait and retry
            last = e
            time.sleep(5 * (i + 1))
    raise RuntimeError(str(last))


def hits_of(d):
    hits = []
    for h in d['response']['body']['hits']['hits']:
        fl = h.get('fields', {})
        hits.append({'identifier': fl.get('identifier'), 'title': fl.get('title'), 'date': (fl.get('date') or '')[:4],
                     'collection': fl.get('collection'), 'highlights': (h.get('highlight') or {}).get('text', [])})
    return hits


def main():
    out = {'about': 'Written by tools/fetch_archive_snippets.py. Each archive.org full-text search URL the comics research cites, with the items it hit and the highlighted passages ({{{ }}} marks the matched words). Do not edit by hand.',
           'fetched': datetime.date.today().isoformat(), 'searches': {}}
    if os.path.exists(OUT):
        with open(OUT, encoding='utf-8') as f:
            out['searches'] = json.load(f).get('searches', {})
    if '--import' in sys.argv:
        i = sys.argv.index('--import')
        u, path = sys.argv[i + 1], sys.argv[i + 2]
        assert u in search_urls(), 'not a URL the research cites'
        with open(path, encoding='utf-8') as f:
            out['searches'][u] = {'hits': hits_of(json.load(f)), 'imported': 'saved response, fetched ' + datetime.date.fromtimestamp(os.path.getmtime(path)).isoformat()}
    for u in search_urls():
        if u in out['searches'] and out['searches'][u].get('hits'):
            continue
        try:
            d = fetch(u)
        except RuntimeError as e:
            out['searches'][u] = {'error': e.args[0]}
            print('FAILED', u[:120], e)
            continue
        out['searches'][u] = {'hits': hits_of(d)}
        hits = out['searches'][u]['hits']
        print(len(hits), 'hits', u[:120])
        time.sleep(2)
    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
        f.write('\n')
    print('wrote', OUT)


if __name__ == '__main__':
    main()
