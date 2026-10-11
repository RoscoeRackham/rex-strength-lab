import json,glob,sys,os
base='/root/.claude/projects/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/subagents/workflows/'
out_dir='/tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/wfout/'
for f in sorted(glob.glob(base+'*/agent-*.jsonl')):
    out=None
    for l in open(f):
        d=json.loads(l); m=d.get('message',{}); cont=m.get('content')
        if isinstance(cont,list):
            for c in cont:
                if c.get('type')=='tool_use' and c.get('name')=='StructuredOutput': out=c['input']
    meta=json.load(open(f.replace('.jsonl','.meta.json')))
    lab=meta['description'].replace(':','_')
    if out:
        json.dump(out, open(out_dir+lab+'.json','w'), indent=1)
    print(lab, 'DONE' if out else 'running')
