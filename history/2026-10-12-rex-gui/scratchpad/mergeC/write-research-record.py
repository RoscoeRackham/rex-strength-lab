"""Write rex-strength-lab/research/reviews/gui-c-research.json from the four workflow journals and the merge log."""
import json, os
W = '/root/.claude/projects/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/subagents/workflows/'
RUNS = {'wf_6266beb2-161': ['audit', 'small'], 'wf_f7e4278f-12d': ['explosive', 'disaster'], 'wf_e345056e-ab1': ['geophysical', 'planetary'], 'wf_61bcfc42-2ae': ['stellar']}
HERE = os.path.dirname(os.path.abspath(__file__))
topics = {}
for run, names in RUNS.items():
    labels = {}
    results = {}
    for line in open(W + run + '/journal.jsonl'):
        d = json.loads(line)
        if d.get('type') == 'started': labels[d['agentId']] = d['label']
        if d.get('type') == 'result': results[d['agentId']] = d['result']
    for aid, res in results.items():
        stage, topic = labels[aid].split(':')
        if topic not in names: continue   # the stopped first run's explosive/disaster research (redone in its own run)
        t = topics.setdefault(topic, {'topic': topic})
        if stage == 'research':
            t['research'] = {'summary': res['summary'], 'gaps': res['gaps'], 'n_facts': len(res['facts']),
                             'proposed_rungs': [{'key': r['key'], 'J': r['J'], 'page_short': r['page_short']} for r in res['proposed_rungs']]}
        elif stage == 'verify':
            t['skeptic'] = {'verdict': res['verdict'], 'rung_issues': res['rung_issues'], 'missing': res['missing'],
                            'checks': [{k: c.get(k) for k in ('key', 'ok', 'fetched', 'issue', 'corrected') if c.get(k) is not None} for c in res['checks']]}
        elif stage == 'compile':
            t['compile'] = {k: res.get(k) for k in ('n_facts', 'rungs', 'changes', 'dropped', 'open_issues')}
order = ['audit', 'small', 'explosive', 'disaster', 'geophysical', 'planetary', 'stellar']
for k in order: assert all(s in topics[k] for s in ('research', 'skeptic', 'compile')), k
checks = sum(len(topics[k]['skeptic']['checks']) for k in order)
notok = sum(1 for k in order for c in topics[k]['skeptic']['checks'] if not c['ok'])
fetched = sorted({u for k in order for c in topics[k]['skeptic']['checks'] for u in c['fetched']})
merge = json.load(open(os.path.join(HERE, 'merge-log.json')))
decisions = json.load(open(os.path.join(HERE, 'decisions.json')))
rec = {
    'what': 'Research for the energy ladder (BRIEF-gui.md section 6, pull request C), 13 Oct 2026. Seven topics: an audit of the eleven old rungs, then six energy bands (small 0.1 J to 300 kJ, explosive 300 kJ to 100 GJ, disaster 100 GJ to 1e17 J, geophysical 1e17 to 1e26 J, planetary 1e26 to 1e36 J, stellar 1e36 to about 1e48 J). Each topic: a researcher, then a skeptic who fetched every cited source and recomputed every derived number, then a compiler who applied every correction the skeptic marked. The compiled facts were merged by hand into research/final-energy.json.',
    'script': 'workflow rex-energy-ladder-research (one pipeline per topic: research, verify, compile); run as four runs in parallel; the script is kept in history at the end of the run',
    'counts': {'topics': len(order), 'facts_checked_by_skeptics': checks, 'facts_marked_not_ok_and_corrected': notok, 'distinct_urls_fetched_by_skeptics': len(fetched)},
    'merge': merge, 'decisions': decisions,
    'topics': [topics[k] for k in order],
}
p = '/home/user/rex-strength-lab/rex-strength-lab/research/reviews/gui-c-research.json'
open(p, 'w', encoding='utf-8', newline='\n').write(json.dumps(rec, ensure_ascii=False, indent=1) + '\n')
print(rec['counts'], os.path.getsize(p) // 1024, 'KB')
