# Dump research and verify results from the research workflow journals into scratchpad/wfout/
import json, glob, os
SCR = '/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/wfout/'
W = '/root/.claude/projects/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/subagents/workflows/'
for d in ['wf_bb193dee-61c', 'wf_83090d59-a30', 'wf_01258728-142']:
    for line in open(W + d + '/journal.jsonl'):
        j = json.loads(line)
        if j.get('type') != 'result': continue
        r = j['result']
        if 'facts' in r:
            t = r['facts'][0]['category'] if r['facts'] else 'unknown'
            t = {'thresholds': 'thresholds'}.get(t, t)
            json.dump(r, open(SCR + 'research_' + t + '.json', 'w'), indent=1, ensure_ascii=False)
        elif 'checks' in r:
            # which topic? match keys to research files
            keys = {c['key'] for c in r['checks']}
            for f in glob.glob(SCR + 'research_*.json'):
                rr = json.load(open(f))
                if keys & {x['key'] for x in rr['facts']}:
                    json.dump(r, open(f.replace('research_', 'verify_'), 'w'), indent=1, ensure_ascii=False)
print(sorted(os.listdir(SCR)))
