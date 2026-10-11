#!/usr/bin/env python3
"""Assemble research/final-presence.json from the compiled presence topics.

Each topic (step, attenuation, elephant, thresholds, ripple, comic, growth) was researched by one agent, checked by a
skeptical verifier, and compiled by a third agent that applied every verifier correction (see the session history,
history/2026-10-11-rex-presence/). This script only merges those compiled files, checks the format, and refuses
duplicate keys or a status outside the house vocabulary.

  python3 research/merge_presence.py <folder with step.json, attenuation.json, ...>

Used once, to build the first final-presence.json. Since review round 1 that file is edited by hand and is the source
of truth; re-running this script would undo the review fixes. The script refuses to overwrite it unless given --force.
"""
import json
import os
import sys

TOPICS = ['step', 'attenuation', 'elephant', 'thresholds', 'ripple', 'comic', 'growth']
STATUS = {'verified', 'derived', 'estimate', 'reported', 'disputed', 'not_quantified'}
FIELDS = ['key', 'category', 'label', 'status', 'value_si', 'unit_si', 'low_si', 'high_si', 'display', 'sources', 'notes', 'who_when']

src = sys.argv[1]
here = os.path.dirname(os.path.abspath(__file__))
facts, gaps, seen = [], {}, set()
for t in TOPICS:
    p = os.path.join(src, t + '.json')
    if not os.path.exists(p):
        print('missing topic:', t)
        continue
    d = json.load(open(p, encoding='utf-8'))
    for f in d['facts']:
        assert f['key'] not in seen, 'duplicate key ' + f['key']
        assert f['status'] in STATUS, (f['key'], f['status'])
        for k in ('key', 'label', 'status', 'display', 'sources', 'notes'):
            assert f.get(k) is not None, (f['key'], k)
        for k in ('value_si', 'low_si', 'high_si'):
            v = f.get(k)
            assert v is None or isinstance(v, (int, float)), (f['key'], k, v)
        seen.add(f['key'])
        out = {k: f.get(k) for k in FIELDS}
        out['category'] = 'presence_' + t
        if f.get('values_json'):
            out['values_json'] = f['values_json']
        facts.append(out)
    gaps[t] = d.get('gaps', '')
dest = os.path.join(here, 'final-presence.json')
if os.path.exists(dest) and '--force' not in sys.argv:
    sys.exit('final-presence.json exists and is edited by hand since review round 1; pass --force to overwrite it')
json.dump({'facts': facts, 'gaps': gaps}, open(dest, 'w', encoding='utf-8', newline='\n'), ensure_ascii=False, indent=1)
print(len(facts), 'facts from', len(gaps), 'topics')
