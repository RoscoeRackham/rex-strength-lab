# Writes rex-strength-lab/research/reviews/canon-5-round2.json: round 2's lenses and findings as the review gave them
# (verified_ok kept as given), each finding with its outcome (the fix, the covering check, the revert result), from
# scratchpad pr5/round2-raw.json and this round's results (pr5/r2fix/revert2-results.json).
import json, os, sys
SP = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/pr5'
raw = json.load(open(os.path.join(SP, 'round2-raw.json')))
res = json.load(open(os.path.join(SP, 'r2fix', 'revert2-results.json')))
facts = json.load(open(os.path.join(SP, 'r2fix', 'rec2-facts.json')))
def rr(*names):
    out = []
    for n in names:
        r = res.get(n)
        if not r: out.append(n + ' -> (not run)'); continue
        if 'error' in r: out.append(n + ' -> ERROR ' + r['error']); continue
        f = r.get('fails') or []
        out.append(n + ' -> ' + ('fails ' + '; '.join(x[:110] for x in f) if r.get('killed') else 'PASSES'))
    return '; '.join(out)
O = json.load(open(os.path.join(SP, 'r2fix', 'rec2-outcomes.json')))
for L in raw:
    for f in L['findings']:
        o = O[f['id']]
        f['outcome'] = o['text'].replace('{REVERTS}', rr(*o.get('reverts', [])))
rec = {
  'round': 2,
  'what': facts['what'],
  'script': 'workflow canon-review (args {pr: 5, round: 2, lenses: [design, copy, code]}); kept in history at the end of the run',
  'counts': {'findings': 9, 'confirmed': 9, 'refuted': [], 'no_verdict': [], 'reports': 9, 'merged': []},
  'lenses': raw,
}
json.dump(rec, open(sys.argv[1], 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
print('wrote', sys.argv[1])
