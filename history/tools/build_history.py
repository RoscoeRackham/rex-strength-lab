#!/usr/bin/env python3
"""Rebuild history/ from the raw Claude Code session logs of the Rex Strength Lab session.

Reads:
  - the main session log  ~/.claude/projects/-home-user/<SID>.jsonl
  - the workflow subagent logs  ~/.claude/projects/-home-user/<SID>/subagents/workflows/wf_*/
  - the workflow scripts  ~/.claude/projects/*/<SID>/workflows/scripts/*.js
  - git history of this repository (for the commits, placed by commit time)
  - the session scratchpad (only to copy the working scripts the repo cites)

Writes (into --out, default: the history/ folder this script lives in):
  README.md, prompts.md, transcript.md (+ transcript/NN-*.md when long), transcript.jsonl,
  scratchpad/ (copied scripts + INDEX.md)

Run from the repository root:
  python3 history/tools/build_history.py
It prints the counts and exits non-zero if any human message in the raw log is missing from prompts.md.
"""
import argparse
import collections
import datetime as dt
import glob
import json
import os
import re
import shutil
import subprocess
import sys

SID = '6435a7db-fe21-5f3b-bca9-e49ba2609387'
HOME = os.path.expanduser('~')

# The session's commits were made in lodge-docs on branch claude/dinosaur-strength-physics-8o13ft.
# That branch was later moved into this repository with its history filtered to the two project
# folders, which rewrote the hashes. Both are shown; the lodge-docs hash is the one reported at the time.
LODGE_HASH = {
    'Add Rex Super-Strength Lab: physics simulator for a super-strong dinosaur': 'cb1296f',
    'Rex lab: fix second-audit findings': 'c22dc45',
    'Rex lab: fix third-review findings': 'a5795ee',
    'Add Build Calculator: weight and girths from height and build': '4a03723',
    'Rex lab: density and weight, Ollie and two-player tests, 10 ft bodies': '64526fb',
    'Rex lab README: record the final sweep results': '15f8d53',
}

# Attached images: upload file name -> what it became in this repository.
IMAGE_ASSETS = {
    'bf4de929-image.jpg': 'rex-strength-lab/assets/dino.jpg (resized; the header picture of Rex)',
    'e4a745ec-image.jpg': 'rex-strength-lab/assets/duo.jpg, first version (replaced on 10 Oct by f61017b0-image.jpg)',
    'f61017b0-image.jpg': 'rex-strength-lab/assets/duo.jpg (current version, resized to 720x480)',
    '89c1d7ad-image.jpg': 'no asset of its own: the same side-by-side art re-sent with the 10 ft request; it was the input to the picture-based body estimate',
    'aafcb1d5-image.jpg': 'rex-strength-lab/assets/art-rig.jpg',
    '2ec73892-image.jpg': 'rex-strength-lab/assets/art-unstoppable.jpg and rex-strength-lab/assets/face-rex.jpg (crop)',
    'ccd62227-image.jpg': 'rex-strength-lab/assets/face-ollie.jpg (crop)',
    'c1679e47-image.jpg': 'rex-strength-lab/assets/art-arm.jpg (cropped banner)',
}

# Phases: (slug, title, how the phase starts, one-paragraph description for the README).
# Start markers: ('start',), ('workflow', script name), ('prompt', text prefix), ('after_commit', subject prefix).
PHASES = [
    ('01-rex-lab-v1', 'Rex lab v1: research, engine and page', ('start',),
     'The first request: a physics simulator for an indestructible plush dinosaur at strengths from the strongest human to infinite. A research workflow gathered and verified the data; the physics engine, the tests and the page were built; the owner named him Rex and went to bed.'),
    ('02-review-rounds-1-3', 'Review rounds 1-3 and first release', ('workflow', 'dino-engine-audit'),
     'Unattended overnight work: three adversarial review rounds (engine audit, page audit, fix verification), the fixes after each, the first publish of the page and the first three commits. The first context compaction happened in this phase.'),
    ('03-density-ollie', 'Density + Ollie', ('prompt', 'New feature: adding density'),
     'Density and weight from plush to black hole, and Ollie with four two-player tests (arm wrestling, wrestling, catch, unstoppable force vs immovable object). A design workflow with four adversarial critiques fed the engine work. The second context compaction happened at the end of this phase.'),
    ('04-round-4-art-10ft', 'Round 4 audit, new art and 10 ft bodies', ('workflow', 'rex-duo-density-audit'),
     'The catch critique was applied and the round-4 audit launched. The owner sent new art, ruled that Ollie is as strong and resilient as Rex, and asked for a 10 ft Rex with a mass taken from the picture; a three-method body-volume workflow answered. The art went onto the page.'),
    ('05-build-calculator', 'Build Calculator', ('prompt', 'A similar secondary project'),
     'A second project: a character build calculator (weight and seven girths from height and build). Research workflow, data compile, page build, audit and fixes, publish and commit, while the round-4 fix workflow ran in parallel for the Rex lab.'),
    ('06-round-4-fixes-release', 'Round 4 fixes and release', ('after_commit', 'Add Build Calculator'),
     'The round-4 fixes landed, a final leftover-fix round updated the text for the 10 ft bodies, the sweeps passed, and the Rex lab was committed, pushed and republished.'),
    ('07-new-repo', 'Moving to a new repo', ('prompt', 'Can we clear all of the old lodge stuff'),
     'The owner asked to drop the old lodge material; they chose a separate repository. The two project folders were moved here with their history filtered, and deleting the old branch from lodge-docs was refused by GitHub (HTTP 403), so the owner was asked to delete it.'),
    ('08-transcript', 'This transcript', ('prompt', 'Please produce a readable and machine-parseable transcript'),
     'The request that produced this history folder. The third context compaction happened while it was being built.'),
]

# ---------------------------------------------------------------------------- redaction
EMAIL_KEEP = {'noreply@anthropic.com'}
REDACTIONS = [
    (re.compile(r'\b(gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})'), '[redacted]'),
    (re.compile(r'\bsk-(?:ant-)?[A-Za-z0-9_-]{20,}'), '[redacted]'),
    (re.compile(r'\bAKIA[0-9A-Z]{16}\b'), '[redacted]'),
    (re.compile(r'\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}'), '[redacted]'),
    (re.compile(r'(?i)\b(bearer)\s+[A-Za-z0-9._~+/-]{16,}=*'), r'\1 [redacted]'),
    (re.compile(r'(?i)\b(authorization|cookie|set-cookie|x-api-key|api[_-]?key|access[_-]?token|client[_-]?secret|password)(\s*[:=]\s*)(["\']?)[^\s"\'&,;]{8,}'), r'\1\2\3[redacted]'),
    (re.compile(r'(https?://)[^/\s:@"\']+:[^/\s@"\']+@'), r'\1[redacted]@'),
    (re.compile(r'(?i)([?&](?:x-amz-signature|x-amz-credential|x-amz-security-token|x-goog-signature|signature|sig|token|access_token|key|expires)=)[^&\s"\'<>)]+'), r'\1[redacted]'),
]
EMAIL_RE = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b')
REDACT_COUNT = collections.Counter()
PERSONAL_RES = []


def learn_personal(raw):
    """Redact the bare name part of any personal email in the raw log (e.g. a summary quoting it without the domain)."""
    names = set()
    for m in EMAIL_RE.finditer(raw):
        e = m.group(0).lower()
        if e in EMAIL_KEEP or e.endswith('@example.com'):
            continue
        local = e.split('@')[0]
        names.add(local)
        names.update(w for w in re.split(r'[._+-]', local) if len(w) >= 5)
    PERSONAL_RES[:] = [re.compile(r'(?i)(?<![A-Za-z0-9])' + re.escape(n) + r'(?![A-Za-z0-9])') for n in sorted(names, key=len, reverse=True)]


def redact(s):
    if not isinstance(s, str) or not s:
        return s
    for rx, rep in REDACTIONS:
        s, n = rx.subn(rep, s)
        if n:
            REDACT_COUNT[rx.pattern[:40]] += n

    def em(m):
        if m.group(0).lower() in EMAIL_KEEP or m.group(0).lower().endswith('@example.com'):
            return m.group(0)
        REDACT_COUNT['email'] += 1
        return '[redacted]'
    s = EMAIL_RE.sub(em, s)
    for rx in PERSONAL_RES:
        s, n = rx.subn('[redacted]', s)
        if n:
            REDACT_COUNT['email name'] += n
    return s


# ---------------------------------------------------------------------------- helpers
def ts_fmt(ts):
    if not ts:
        return '?'
    return ts.replace('T', ' ').replace('Z', '')[:19] + ' UTC'


def parse_ts(ts):
    return dt.datetime.fromisoformat(ts.replace('Z', '+00:00'))


def first_sentences(s, n=2, cap=360):
    s = re.sub(r'\s+', ' ', s or '').strip()
    s = re.sub(r'[*_`#|]+', '', s)
    parts = re.split(r'(?<=[.!?])\s+', s)
    out = ' '.join(parts[:n])
    return out if len(out) <= cap else out[:cap].rsplit(' ', 1)[0] + ' ...'


def fence(text, lang='text'):
    ticks = '```'
    while ticks in text:
        ticks += '`'
    return f'{ticks}{lang}\n{text}\n{ticks}'


def workflow_meta(script):
    m = re.search(r"name:\s*'([^']+)'", script or '')
    d = re.search(r"description:\s*'([^']+)'", script or '')
    return (m.group(1) if m else None), (d.group(1) if d else None)


def key_arg(name, inp, scripts):
    inp = inp or {}
    if name == 'Bash':
        cmd = (inp.get('command') or '').strip().splitlines()
        first = cmd[0] if cmd else ''
        if len(first) > 160:
            first = first[:157] + '...'
        extra = f' (+{len(cmd) - 1} lines)' if len(cmd) > 1 else ''
        d = inp.get('description')
        return (d + ': ' if d else '') + '`' + first.replace('`', "'") + '`' + extra
    if name in ('Read', 'Write', 'Edit', 'NotebookEdit'):
        return inp.get('file_path', '')
    if name in ('Glob', 'Grep'):
        return inp.get('pattern', '') + (f" in {inp['path']}" if inp.get('path') else '')
    if name == 'WebSearch':
        return inp.get('query', '')
    if name == 'WebFetch':
        return inp.get('url', '')
    if name == 'Workflow':
        script = inp.get('script')
        if not script and inp.get('scriptPath'):
            script = scripts.get(os.path.basename(inp['scriptPath']), '')
        n, d = workflow_meta(script)
        if inp.get('resumeFromRunId'):
            d = (d or '') + f" (resume {inp['resumeFromRunId']})"
        return f"{n or inp.get('name') or inp.get('scriptPath') or '?'}: {d or ''}".strip()
    if name == 'Skill':
        return inp.get('skill', '') + (f" {inp['args']}" if inp.get('args') else '')
    if name == 'Artifact':
        return ' '.join(str(x) for x in (inp.get('action') or 'publish', inp.get('url') or '', inp.get('file_path') or '', inp.get('intent') or '') if x)
    if name == 'TaskCreate':
        return inp.get('subject', '')
    if name == 'TaskUpdate':
        return f"#{inp.get('taskId')} " + ' '.join(f'{k}={v}' for k, v in inp.items() if k in ('status', 'subject', 'activeForm'))
    if name == 'TaskStop':
        return str(inp.get('task_id') or inp.get('taskId') or inp)
    if name == 'ToolSearch':
        return inp.get('query', '')
    if name == 'Monitor':
        return inp.get('description') or (inp.get('command') or '')[:120]
    if name == 'AskUserQuestion':
        return ' | '.join(q.get('question', '') for q in inp.get('questions', []))
    s = json.dumps(inp, ensure_ascii=False)
    return s if len(s) <= 200 else s[:197] + '...'


def summarize_result(r):
    if r is None:
        return 'No result recorded (the agent was stopped, skipped or failed).'
    if isinstance(r, str):
        return first_sentences(r, 3, 420)
    if isinstance(r, dict):
        parts = []
        for k in ('summary', 'verdict', 'plainSummary', 'method', 'reasoning', 'notes', 'newIssues'):
            v = r.get(k)
            if isinstance(v, str) and v.strip():
                parts.append(first_sentences(v, 2, 320))
                break
        counts = []
        for k, v in r.items():
            if isinstance(v, list):
                c = f'{k}: {len(v)}'
                titles = [x.get('title') or x.get('key') or x.get('id') or x.get('item') for x in v[:2] if isinstance(x, dict)]
                titles = [str(t)[:90] for t in titles if t]
                if titles:
                    c += ' (e.g. ' + '; '.join(titles) + ')'
                counts.append(c)
        if counts:
            parts.append('Returned ' + ', '.join(counts) + '.')
        if not parts:
            parts.append('Returned fields: ' + ', '.join(list(r)[:10]) + '.')
        return ' '.join(parts)
    return str(r)[:300]


def computed_prompt(agent_lines):
    """The prompt the workflow script computed for this agent, without the harness wrapper."""
    users = []
    for e in agent_lines[:12]:
        if e.get('type') != 'user':
            continue
        c = e.get('message', {}).get('content')
        s = c if isinstance(c, str) else '\n'.join(b.get('text', '') for b in (c or []) if isinstance(b, dict) and b.get('type') == 'text')
        if s:
            users.append(s)
    marker = 'The computed task text follows:\n'
    for s in users:
        if marker in s:
            body = s.split(marker, 1)[1]
            return '\n'.join(l[2:] if l.startswith('  ') else l for l in body.split('\n'))
    return users[0] if users else ''


# ---------------------------------------------------------------------------- loading
def load_jsonl(path):
    out = []
    with open(path, encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if line:
                try:
                    out.append(json.loads(line))
                except json.JSONDecodeError:
                    pass
    return out


def load_workflow_scripts():
    scripts = {}
    for p in glob.glob(os.path.join(HOME, '.claude/projects/*', SID, 'workflows/scripts/*.js')):
        scripts[os.path.basename(p)] = open(p, encoding='utf-8').read()
    return scripts


def git_commits(repo):
    try:
        out = subprocess.run(['git', '-C', repo, 'log', '--all', '--format=%H%x09%cI%x09%s'], capture_output=True, text=True, check=True).stdout
    except Exception:
        return []
    rows = []
    for line in out.splitlines():
        h, ts, subj = line.split('\t', 2)
        t = parse_ts(ts)
        rows.append({'hash': h[:7], 'ts': t.astimezone(dt.timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.000Z'), 'subject': subj})
    return rows


# ---------------------------------------------------------------------------- main build
def build(args):
    learn_personal(open(args.log, encoding='utf-8').read())
    log = load_jsonl(args.log)
    scripts = load_workflow_scripts()
    events = []
    tool_names = {}
    pending_images = None
    last_human = None
    seen_notif = set()

    def add(kind, ts, **kw):
        ev = {'kind': kind, 'ts': ts, 'text': None, 'tool': None, 'args': None, 'agent_description': None, 'commit': None}
        ev.update(kw)
        events.append(ev)
        return ev

    msg_text = {}
    for e in log:
        t = e.get('type')
        ts = e.get('timestamp')
        if t == 'attachment':
            a = e.get('attachment') or {}
            if a.get('type') == 'inlined_image_paths' and last_human is not None and not last_human.get('_images'):
                last_human['_images'] = [os.path.basename(p) for p in a.get('paths', [])]
            elif a.get('type') == 'queued_command' and (a.get('commandMode') == 'task-notification' or str(a.get('prompt', '')).startswith('<task-notification>')):
                add_notification(add, ts, a.get('prompt', ''), seen_notif)
            continue
        if t == 'system' and e.get('subtype') == 'compact_boundary':
            add('compaction', ts, text=None)
            continue
        if t == 'assistant' and not e.get('isSidechain'):
            mid = e.get('message', {}).get('id')
            for b in e.get('message', {}).get('content', []):
                if b.get('type') == 'text' and b.get('text', '').strip():
                    prev = events[-1] if events else None
                    if prev and prev['kind'] == 'assistant' and prev.get('_mid') == mid:
                        prev['text'] += '\n\n' + b['text']
                    else:
                        add('assistant', ts, text=b['text'], _mid=mid)
                elif b.get('type') == 'tool_use':
                    tool_names[b['id']] = b['name']
                    ev = add('tool_call', ts, tool=b['name'], args={'key': key_arg(b['name'], b.get('input'), scripts)}, _id=b['id'], _input=b.get('input'))
            continue
        if t != 'user' or e.get('isSidechain'):
            continue
        c = e.get('message', {}).get('content')
        if isinstance(c, str):
            if e.get('isCompactSummary'):
                comp = next((x for x in reversed(events) if x['kind'] == 'compaction' and x['text'] is None), None)
                if comp:
                    comp['text'] = c
                else:
                    add('compaction', ts, text=c)
                continue
            if c.lstrip().startswith('<task-notification>'):
                add_notification(add, ts, c, seen_notif)
                continue
            if c.startswith('Stop hook feedback'):
                add('wakeup', ts, tool='stop-hook', text=c)
                continue
            if e.get('isMeta'):
                continue
            last_human = add('user', ts, text=c, _human=True)
            continue
        if not isinstance(c, list):
            continue
        kinds = [b.get('type') for b in c]
        if 'tool_result' in kinds:
            for b in c:
                if b.get('type') != 'tool_result':
                    continue
                name = tool_names.get(b.get('tool_use_id'))
                rc = b.get('content')
                rs = rc if isinstance(rc, str) else '\n'.join(x.get('text', '') for x in (rc or []) if isinstance(x, dict) and x.get('type') == 'text')
                call = next((x for x in reversed(events) if x.get('_id') == b.get('tool_use_id')), None)
                if call is not None:
                    call['_result'] = rs
                if name == 'AskUserQuestion':
                    pairs = re.findall(r'"(.+?)"="(.+?)"', rs)
                    text = '; '.join(f'{q} → {a}' for q, a in pairs) if pairs else rs
                    add('user', ts, tool='AskUserQuestion', text=text, _answer=True)
                elif b.get('is_error') and call is not None:
                    call['_error'] = '\n'.join(rs.strip().splitlines()[:3])
            continue
        if e.get('isMeta'):
            continue
        text = '\n\n'.join(b.get('text', '') for b in c if b.get('type') == 'text')
        n_img = sum(1 for b in c if b.get('type') == 'image')
        last_human = add('user', ts, text=text, _human=True, _nimg=n_img)

    # ---- workflows and their subagents
    wf_root = args.subagents
    for i, ev in enumerate(list(events)):
        if ev['kind'] != 'tool_call' or ev['tool'] != 'Workflow':
            continue
        res = ev.get('_result') or ''
        m = re.search(r'subagents/workflows/(wf_[A-Za-z0-9-]+)', res)
        ev['_wf'] = m.group(1) if m else None
        rid = re.search(r'Run ID: (wf_[A-Za-z0-9-]+)', res)
        if ev['_wf'] is None and rid:
            ev['_wf'] = rid.group(1)
        if not ev['_wf'] and '<tool_use_error>' in res:
            ev['_error'] = '\n'.join(res.strip().splitlines()[:3])
    subagent_blocks = {}
    for ev in events:
        wf = ev.get('_wf')
        if not wf:
            continue
        d = os.path.join(wf_root, wf)
        if not os.path.isdir(d):
            continue
        journal = load_jsonl(os.path.join(d, 'journal.jsonl')) if os.path.exists(os.path.join(d, 'journal.jsonl')) else []
        results, order, labels = {}, [], {}
        for j in journal:
            if j.get('type') == 'started' and j.get('agentId'):
                order.append(j['agentId'])
                labels[j['agentId']] = (j.get('label'), j.get('phase'))
            if j.get('type') == 'result' and j.get('agentId'):
                results[j['agentId']] = j.get('result')
        for f in sorted(glob.glob(os.path.join(d, 'agent-*.jsonl'))):
            aid = os.path.basename(f)[len('agent-'):-len('.jsonl')]
            if aid not in order:
                order.append(aid)
        name, desc = workflow_meta(ev['_input'].get('script') or scripts.get(os.path.basename(ev['_input'].get('scriptPath') or ''), ''))
        block = []
        for aid in order:
            f = os.path.join(d, f'agent-{aid}.jsonl')
            if not os.path.exists(f):
                continue
            lines = load_jsonl(f)
            meta_p = os.path.join(d, f'agent-{aid}.meta.json')
            meta = json.load(open(meta_p)) if os.path.exists(meta_p) else {}
            label = (labels.get(aid) or (None, None))[0] or meta.get('description') or aid
            wphase = (labels.get(aid) or (None, None))[1] or meta.get('workflowPhase')
            first_ts = next((x.get('timestamp') for x in lines if x.get('timestamp')), ev['ts'])
            block.append({'kind': 'subagent', 'ts': first_ts, 'tool': 'Workflow', 'commit': None,
                          'agent_description': label,
                          'text': summarize_result(results.get(aid)),
                          'args': {'workflow': name, 'workflow_run': wf, 'workflow_phase': wphase, 'agent_id': aid, 'prompt': computed_prompt(lines)}})
        block.sort(key=lambda x: x['ts'])
        ev['_wf_name'], ev['_wf_desc'], ev['_n_agents'] = name, desc, len(block)
        subagent_blocks[id(ev)] = block

    merged = []
    for ev in events:
        merged.append(ev)
        if id(ev) in subagent_blocks:
            for sb in subagent_blocks[id(ev)]:
                sb['_anchor_ts'] = ev['ts']
                merged.append(sb)
    events = merged

    # ---- commits, placed by commit time
    commits = [c for c in git_commits(args.repo) if args.since <= c['ts'] <= args.until]
    for c in sorted(commits, key=lambda x: x['ts']):
        lodge = LODGE_HASH.get(c['subject'])
        ev = {'kind': 'commit', 'ts': c['ts'], 'tool': 'git', 'args': {'repo_hash': c['hash'], 'lodge_docs_hash': lodge},
              'agent_description': None, 'commit': lodge or c['hash'],
              'text': c['subject'] + (f'  [made in lodge-docs as {lodge}; {c["hash"]} in rex-strength-lab after the move]' if lodge else '  [rex-strength-lab]')}
        pos = len(events)
        for k, x in enumerate(events):
            kts = x.get('_anchor_ts') or x['ts']
            if kts and kts > c['ts']:
                pos = k
                break
        events.insert(pos, ev)

    # ---- wakeups: what each one led to
    for k, ev in enumerate(events):
        if ev['kind'] == 'wakeup':
            nxt = next((x for x in events[k + 1:] if x['kind'] in ('assistant', 'user', 'wakeup')), None)
            if nxt and nxt['kind'] == 'assistant':
                ev['_did'] = first_sentences(nxt['text'], 2, 260)

    # ---- phases
    starts = []
    for slug, title, marker, desc in PHASES:
        st = None
        if marker[0] == 'start':
            st = events[0]['ts']
        elif marker[0] == 'workflow':
            st = next((x['ts'] for x in events if x['kind'] == 'tool_call' and x['tool'] == 'Workflow' and x['args']['key'].startswith(marker[1] + ':')), None)
        elif marker[0] == 'prompt':
            st = next((x['ts'] for x in events if x['kind'] == 'user' and x.get('_human') and (x['text'] or '').startswith(marker[1])), None)
        elif marker[0] == 'after_commit':
            c = next((x for x in events if x['kind'] == 'commit' and x['text'].startswith(marker[1])), None)
            st = (parse_ts(c['ts']) + dt.timedelta(milliseconds=1)).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z' if c else None
        if st is None:
            raise SystemExit(f'phase marker not found: {marker}')
        starts.append((st, slug, title, desc))
    for ev in events:
        key = ev.get('_anchor_ts') or ev['ts'] or ''
        ph = starts[0]
        for s in starts:
            if key >= s[0]:
                ph = s
        ev['phase'] = ph[1]

    # ---- redact everything that will be written
    for ev in events:
        ev['text'] = redact(ev['text'])
        if isinstance(ev.get('args'), dict):
            ev['args'] = {k: redact(v) if isinstance(v, str) else v for k, v in ev['args'].items()}
        for k in ('_error', '_did'):
            if ev.get(k):
                ev[k] = redact(ev[k])
    return events, starts, log, scripts


def add_notification(add, ts, text, seen):
    tid = re.search(r'<task-id>([^<]+)</task-id>', text)
    status = re.search(r'<status>([^<]+)</status>', text)
    summary = re.search(r'<summary>([\s\S]*?)</summary>', text)
    key = (tid.group(1) if tid else None, summary.group(1) if summary else text[:80])
    if key in seen:
        return
    seen.add(key)
    s = f"Background task {key[0]} {status.group(1) if status else 'event'}: {summary.group(1).strip() if summary else ''}".strip()
    add('wakeup', ts, tool='task-notification', text=s, args={'task_id': key[0]})


# ---------------------------------------------------------------------------- writers
def human_events(events):
    return [e for e in events if e['kind'] == 'user' and e.get('_human')]


def image_lines(ev):
    imgs = ev.get('_images') or []
    if not imgs and ev.get('_nimg'):
        imgs = ['(attached image, file name not recorded)'] * ev['_nimg']
    return [f'- Attached image: `{im}` → {IMAGE_ASSETS.get(im, "not used as a file in this repository")}' for im in imgs]


def reply_context(events, ev):
    """The end of the Claude message a short prompt answers, so 'Yes please' reads on its own."""
    i = events.index(ev)
    prev = next((e for e in reversed(events[:i]) if e['kind'] == 'assistant' and e['text']), None)
    if prev is None:
        return None
    flat = re.sub(r'\s+', ' ', prev['text']).strip()
    parts = re.split(r'(?<=[.!?:])\s+', flat)
    tail = ' '.join(parts[-2:])
    if len(tail) > 320:
        tail = '… ' + tail[-320:].split(' ', 1)[-1]
    return f'- In reply to Claude’s message of {ts_fmt(prev["ts"])}, which ended: “{tail}”'


def write_prompts(out, events):
    hs = human_events(events)
    L = ['# User prompts', '',
         f'Every message the owner typed in this session, verbatim, in order ({len(hs)} prompts). Times are UTC. '
         'Attached images are listed by their upload file name and what they became in this repository; image data is not included.', '']
    for i, ev in enumerate(hs, 1):
        L += [f'## {i}. {ts_fmt(ev["ts"])}', '']
        L += [fence(ev['text']) if ev['text'] else '*(no text; image only)*', '']
        il = image_lines(ev)
        if il:
            L += il + ['']
        if ev['text'] and len(ev['text']) < 40 and i > 1:
            ctx = reply_context(events, ev)
            if ctx:
                L += [ctx, '']
    ans = [e for e in events if e['kind'] == 'user' and e.get('_answer')]
    if ans:
        L += ['## Answers given through a question card', '',
              'Not typed prompts: these are the owner’s choices in a multiple-choice question.', '']
        for ev in ans:
            L += [f'- {ts_fmt(ev["ts"])}: {ev["text"]}']
        L += ['']
    open(os.path.join(out, 'prompts.md'), 'w', encoding='utf-8').write('\n'.join(L))
    return hs


def render_event(ev):
    k = ev['kind']
    if k == 'user':
        if ev.get('_answer'):
            return [f'**Owner (answer to the question card) · {ts_fmt(ev["ts"])}**', '', '> ' + (ev['text'] or ''), '']
        L = [f'### Owner · {ts_fmt(ev["ts"])}', '', fence(ev['text']) if ev['text'] else '*(no text; image only)*', '']
        il = image_lines(ev)
        return L + (il + [''] if il else [])
    if k == 'assistant':
        return [f'**Claude · {ts_fmt(ev["ts"])}**', '', ev['text'], '']
    if k == 'tool_call':
        L = [f'- `{ev["tool"]}` {ev["args"]["key"]}']
        if ev.get('_error'):
            for line in ev['_error'].splitlines()[:3]:
                L.append(f'  - result: {line[:240]}')
        if ev['tool'] == 'Workflow' and ev.get('_wf'):
            L.append(f'  - run `{ev["_wf"]}`: {ev.get("_n_agents", 0)} subagents, listed below')
        return L
    if k == 'subagent':
        a = ev['args']
        head = f'Subagent `{ev["agent_description"]}` ({a["workflow"] or a["workflow_run"]}, {ts_fmt(ev["ts"])})'
        return ['<details>', f'<summary>{html_escape(head)}: {html_escape(ev["text"])}</summary>', '',
                f'Workflow run `{a["workflow_run"]}`, phase `{a.get("workflow_phase")}`, agent `{a["agent_id"]}`. Prompt, verbatim:', '',
                fence(a['prompt'] or '(prompt not recorded)'), '', '</details>', '']
    if k == 'compaction':
        L = ['', '---', '', f'## Context compaction · {ts_fmt(ev["ts"])}', '',
             'The conversation ran out of context here. Everything before this point was replaced, in the model’s working context, by the summary below. The raw log above is complete.', '']
        if ev['text']:
            L += ['<details>', '<summary>The summary written at this point</summary>', '', fence(ev['text']), '', '</details>', '']
        return L + ['---', '']
    if k == 'commit':
        return ['', f'> **Commit** `{ev["commit"]}` · {ts_fmt(ev["ts"])} · {ev["text"]}', '']
    if k == 'wakeup':
        did = f' Next: {ev["_did"]}' if ev.get('_did') else ''
        if ev['tool'] == 'stop-hook':
            return ['', f'*Stop hook · {ts_fmt(ev["ts"])}: {ev["text"].strip()}*', '']
        return ['', f'*Woken · {ts_fmt(ev["ts"])} · {ev["text"]}.{did}*', '']
    return []


def html_escape(s):
    return (s or '').replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')


def write_transcript(out, events, starts):
    by_phase = collections.OrderedDict((s[1], []) for s in starts)
    for ev in events:
        by_phase[ev['phase']].append(ev)
    titles = {s[1]: (s[2], s[0], s[3]) for s in starts}
    files = {}
    for slug, evs in by_phase.items():
        title, st, desc = titles[slug]
        end = evs[-1]['ts'] if evs else st
        cnt = collections.Counter(e['kind'] for e in evs)
        L = [f'# {title}', '', f'{ts_fmt(st)} to {ts_fmt(end)}. ' + ', '.join(f'{v} {k.replace("_", " ")} events' for k, v in sorted(cnt.items())) + '.', '', desc, '']
        prev_tool = False
        for ev in evs:
            r = render_event(ev)
            if ev['kind'] == 'tool_call':
                if not prev_tool:
                    L.append('')
                prev_tool = True
            else:
                if prev_tool:
                    L.append('')
                prev_tool = False
            L += r
        files[slug] = '\n'.join(L) + '\n'
    total = sum(f.count('\n') for f in files.values())
    head = ['# Session transcript', '',
            'The full session, phase by phase: every owner message verbatim, every Claude reply in full, each tool call on one line, '
            'every subagent with its verbatim prompt (collapsed), the context compactions, the commits at the point they were made, '
            'and the background-task notifications that woke the session. Times are UTC. See README.md for counts and how this was built.', '']
    tdir = os.path.join(out, 'transcript')
    if os.path.isdir(tdir):
        shutil.rmtree(tdir)
    if total > 3000:
        os.makedirs(tdir)
        head += ['The transcript is long, so it is split into one file per phase:', '']
        for slug, txt in files.items():
            fn = f'{slug}.md'
            open(os.path.join(tdir, fn), 'w', encoding='utf-8').write(txt)
            head.append(f'- [{titles[slug][0]}](transcript/{fn}) ({txt.count(chr(10))} lines)')
        open(os.path.join(out, 'transcript.md'), 'w', encoding='utf-8').write('\n'.join(head) + '\n')
    else:
        open(os.path.join(out, 'transcript.md'), 'w', encoding='utf-8').write('\n'.join(head) + '\n' + '\n'.join(files.values()))
    return total, {slug: txt.count('\n') for slug, txt in files.items()}


def write_jsonl(out, events):
    with open(os.path.join(out, 'transcript.jsonl'), 'w', encoding='utf-8') as f:
        for i, ev in enumerate(events, 1):
            text = ev['text']
            if ev['kind'] == 'user' and ev.get('_human'):
                il = image_lines(ev)
                if il:
                    text = (text or '') + ('\n\n' if text else '') + '\n'.join(x[2:] for x in il)
            if ev['kind'] == 'wakeup' and ev.get('_did'):
                text = text + ' | Next: ' + ev['_did']
            args = ev.get('args')
            if ev['kind'] == 'tool_call' and ev.get('_error'):
                args = dict(args, result_excerpt=ev['_error'])
            if ev['kind'] == 'user' and ev.get('_answer'):
                args = {'via': 'AskUserQuestion'}
            rec = {'seq': i, 'ts': ev['ts'], 'kind': ev['kind'], 'phase': ev['phase'], 'text': text,
                   'tool': ev.get('tool'), 'args': args, 'agent_description': ev.get('agent_description'), 'commit': ev.get('commit')}
            f.write(json.dumps(rec, ensure_ascii=False) + '\n')


# ---------------------------------------------------------------------------- scratchpad copy
SCRIPT_EXT = ('.py', '.js', '.mjs', '.sh')
SMALL_TEXT_EXT = ('.json', '.md', '.txt', '.csv')
SCRIPT_MAX = 300_000
DIRS = collections.OrderedDict([
    ('audit', 'Review round 1 (engine audit, 9 Oct): the auditors\' and verifiers\' repro scripts.'),
    ('audit2', 'Review round 2 (page audit, 9 Oct): repro scripts, browser probes and checks.'),
    ('audit3', 'Review round 3 (fix verification, 9 Oct): checks of each fix and regression hunts.'),
    ('duo', 'Density and Rex + Ollie design (9-10 Oct): the designers\' prototypes (density/calc/weight.js, contest/contest.js, collide/collide-ref.js, catch/flyto.js and catch2.js) and the four critiques\' independent checks (*-check/).'),
    ('mass', 'The picture-based body estimate (10 Oct): method A pixel slices (seg.py, regions.py, volume.py, compute.py, final.py and friends), method_b/ segment solids, method_c/ anthropometric scaling, checker/ reconciliation. final.json is the reconciled result.'),
    ('a3', 'Page render and sweep tools used throughout: weightshot.js renders page states and dumps their text; check2.js is the 1,512-state browser sweep; plus one-off probes.'),
    ('reverify', 'Round 4 re-verification (10 Oct): the two re-checkers\' scripts.'),
    ('r4', 'Round 4 leftover fixes (10 Oct): targeted text sweeps (tsweep.js, tsweep2.js).'),
    ('final-verify', 'Final verification of the leftover fixes (10 Oct): mysweep.js, p5.js and others.'),
    ('bcdata', 'Build Calculator data compile (10 Oct): scripts/compile.py builds data/builds.json; facts_fix.py applies the fact-check corrections; girths.py derives Rex and Ollie girths; resolve_test.py checks every template.'),
    ('buildcalc', 'Build Calculator research (10 Oct): ANSUR II analysis and fits, model checks, comic and bodybuilder data scripts.'),
    ('catch-base', 'Catch-game baseline copy used to compare outputs before and after the catch fixes.'),
    ('src-before-armduo', 'Source snapshot taken before the arm-wrestling and duo batch of the round-4 fixes.'),
])
EXTRA_FILES = ['cutshot.js']


def header_comment(path):
    try:
        with open(path, encoding='utf-8', errors='replace') as f:
            head = f.read(3000)
    except Exception:
        return ''
    m = re.match(r'\s*(?:#!.*\n)?(?:\s*(?:import|from) .*\n)*\s*(?:"""|\'\'\')([\s\S]*?)(?:"""|\'\'\')', head)
    if m:
        return first_sentences(m.group(1), 1, 160)
    for line in head.splitlines()[:12]:
        s = line.strip()
        if s.startswith('#!') or not s:
            continue
        if s.startswith(('#', '//', '/*', '*')):
            s = s.lstrip('#/* ').strip()
            if s and not s.startswith(('-*-', 'eslint', 'global ')):
                return s[:160]
        else:
            break
    return ''


# One-liners for key scripts that have no header comment, written from reading each file.
KEY_DESCS = {
    'bcdata/scripts/girths.py': 'Rex and Ollie girths from widths and depths measured on the reference picture (3.048 m per 790 px), using an ellipse perimeter with a shape factor and range per site.',
    'bcdata/scripts/resolve_test.py': 'Resolves the seven girths of every build in a compiled builds.json through its template chain, to check that each one resolves.',
    'bcdata/scripts/mra.py': 'Averages the 1938-1954 Mr America programme heights, weights and girths from the research facts.',
    'bcdata/scripts/ansur1_waist.py': 'Compares natural and omphalion waist girths in ANSUR CSVs (ratio and difference).',
    'mass/final.py': 'Method A final pass: slice volumes per body region with hand-set limb axis angles.',
    'mass/run_all.py': 'Method A run: sets the scale from each figure\'s pixel height (Rex = 3.048 m) and computes region volumes with depth factors per zone.',
    'mass/volume.py': 'First-pass volume from the foreground mask, split into Rex and Ollie.',
    'mass/write_json.py': 'Writes the Method A volume and mass ranges, scale and density to JSON.',
    'mass/sanity.py': 'Sanity check: widest shoulder span of each figure in metres.',
    'mass/method_b/seg3.py': 'Silhouette mask for Method B (segment solids).',
    'final-verify/mysweep.js': 'Headless-browser sweep of the page at phone width, collecting page errors and broken text.',
    'final-verify/p5.js': 'Engine check for one of the leftover fixes, run in node against the built data.',
    'a3/weightshot.js': 'Renders page states given as JSON and dumps their text, for checking wording.',
}

SNAPSHOT_DIRS = ('catch-base', 'src-before-armduo')
SNAPSHOT_PATH_RE = re.compile(r'(^|/)(backup|old|alttest|src)/')
SNAPSHOT_NAME_RE = re.compile(r'^(eng|engine|data|static-data)([_.-][^/]*)?\.js$')


SNAPSHOT_HEAD_RE = re.compile(r'Rex Super-Strength Lab: physics engine|Generated by build-data\.py')


def skip_reason(top, rel, size, ext, head=''):
    """Why a scratchpad file is listed instead of copied, or None to copy it."""
    if top in SNAPSHOT_DIRS or SNAPSHOT_PATH_RE.search(rel) or (SNAPSHOT_NAME_RE.match(os.path.basename(rel)) and size > 20_000):
        return 'copy of project code'
    if ext == '.js' and size > 20_000 and SNAPSHOT_HEAD_RE.search(head):
        return 'copy of project code'
    if re.search(r'(^|/)raw/', rel):
        return 'raw download'
    if ext in SCRIPT_EXT:
        return None if size <= SCRIPT_MAX else 'too large'
    if ext in SMALL_TEXT_EXT and size <= 60_000 and top in ('mass', 'bcdata'):
        return None
    return 'binary or output'


def copy_scratchpad(out, scratch, scripts):
    dst = os.path.join(out, 'scratchpad')
    if os.path.isdir(dst):
        shutil.rmtree(dst)
    os.makedirs(dst)
    copied, skipped = collections.defaultdict(list), collections.defaultdict(lambda: [0, 0])
    redacted_files = 0
    if scratch and os.path.isdir(scratch):
        sources = [(d, os.path.join(scratch, d)) for d in DIRS] + [('', os.path.join(scratch, f)) for f in EXTRA_FILES]
        for top, src in sources:
            if not os.path.exists(src):
                continue
            paths = [src] if os.path.isfile(src) else [os.path.join(r, f) for r, ds, fs in os.walk(src) if '__pycache__' not in r and 'node_modules' not in r for f in fs]
            for p in sorted(paths):
                rel = os.path.relpath(p, scratch)
                size = os.path.getsize(p)
                ext = os.path.splitext(p)[1].lower()
                with open(p, 'rb') as f:
                    head = f.read(400).decode('utf-8', 'replace')
                why = skip_reason(top, rel, size, ext, head)
                if why:
                    k = (top or '(top level)', ext or '(none)', why)
                    skipped[k][0] += 1
                    skipped[k][1] += size
                    continue
                txt = open(p, encoding='utf-8', errors='replace').read()
                red = redact(txt)
                if red != txt:
                    redacted_files += 1
                q = os.path.join(dst, rel)
                os.makedirs(os.path.dirname(q), exist_ok=True)
                open(q, 'w', encoding='utf-8').write(red)
                copied[top or '(top level)'].append((rel, size, KEY_DESCS.get(rel) or header_comment(p)))
    wdst = os.path.join(dst, 'workflows')
    os.makedirs(wdst, exist_ok=True)
    for name, txt in sorted(scripts.items()):
        open(os.path.join(wdst, name), 'w', encoding='utf-8').write(redact(txt))
        n, d = workflow_meta(txt)
        copied['workflows'].append((f'workflows/{name}', len(txt), f'{n}: {d}'))
    L = ['# Scratchpad scripts', '',
         'Working scripts from the session scratchpad that the repository cites (in README files, NOTES.md, fact notes and review records) but does not contain. '
         'They were written by Claude and its subagents to reproduce findings, measure the picture, compile data and sweep the pages. '
         'Paths inside them point at the session scratchpad and the old project folder (/home/user/dino-strength-sim), so most will not run as-is from here.', '',
         f'Copied: scripts up to {SCRIPT_MAX // 1000} KB, plus small JSON and text results in mass/ and bcdata/. '
         'Listed but not copied: copies of project code, raw downloads, larger files and binaries (table at the end).', '',
         'Each folder lists the files whose purpose is known (from the file\'s own header comment, or a one-liner written for this index); the full file list is collapsed below it. '
         'Most of the remaining files are short single-purpose repro scripts named after the finding they test.', '']
    order = list(DIRS) + ['(top level)', 'workflows']
    descs = dict(DIRS)
    descs['(top level)'] = 'One-off scripts at the top of the scratchpad.'
    descs['workflows'] = 'The workflow orchestration scripts (each Workflow launch). They compute the subagent prompts quoted in the transcript.'
    for top in order:
        rows = copied.get(top)
        if not rows:
            continue
        kb = sum(r[1] for r in rows) // 1024
        L += [f'## {top}/' if top != '(top level)' else '## Top level', '', descs.get(top, ''), '', f'{len(rows)} files, {kb} KB.', '']
        for rel, size, hdr in rows:
            if hdr:
                L.append(f'- `{rel}`: {hdr}')
        L += ['', f'<details><summary>All {len(rows)} files</summary>', '', ', '.join(f'`{r[0]}`' for r in rows), '', '</details>', '']
    L += ['## Not copied', '',
          'Copies of project code are earlier states of engine.js, data.js and the tests, kept for diffing (the patched engine variants in audit/, '
          'the catch-base and src-before-armduo baselines, backup/ and old/ trees). The released versions are in the repository.', '',
          '| Folder | Why | Files | Total size | Main types |', '|---|---|---|---|---|']
    grouped = collections.defaultdict(lambda: [0, 0, collections.Counter()])
    for (top, ext, why), (n, sz) in skipped.items():
        g = grouped[(top, why)]
        g[0] += n
        g[1] += sz
        g[2][ext] += sz
    for (top, why), (n, sz, exts) in sorted(grouped.items(), key=lambda x: -x[1][1]):
        L.append(f'| {top} | {why} | {n} | {sz / 1e6:.1f} MB | {", ".join(e for e, _ in exts.most_common(4))} |')
    L += ['', 'Other scratchpad folders that the repository does not cite (earlier probes, backups, page previews) were not copied.', '']
    open(os.path.join(dst, 'INDEX.md'), 'w', encoding='utf-8').write('\n'.join(L))
    return sum(len(v) for v in copied.values()), sum(v[0] for v in skipped.values()), redacted_files


# ---------------------------------------------------------------------------- README
def write_readme(out, events, starts, phase_lines, counts, compactions, scratch_stats, missing):
    hs = human_events(events)
    first, last = events[0]['ts'], events[-1]['ts']
    commits = [e for e in events if e['kind'] == 'commit']
    wakes = [e for e in events if e['kind'] == 'wakeup' and e['tool'] == 'task-notification']
    L = ['# Session history', '',
         'A transcript of the Claude Code session that built the Rex Super-Strength Lab and the Build Calculator, for readers who cannot open the session. '
         f'It runs from {ts_fmt(first)} to {ts_fmt(last)} and was rebuilt from the raw session logs on disk, not from memory.', '',
         '## Files', '',
         '- [prompts.md](prompts.md): the owner’s prompts only, numbered, verbatim, with timestamps. Start here.',
         '- [transcript.md](transcript.md): the full readable transcript, split into one file per phase under [transcript/](transcript/).',
         '- [transcript.jsonl](transcript.jsonl): one JSON object per event: `{seq, ts, kind, phase, text, tool, args, agent_description, commit}`; `kind` is one of user, assistant, tool_call, subagent, compaction, commit, wakeup. Missing fields are null. Events are in transcript order: each workflow’s subagents follow the call that launched it, so `ts` (a subagent’s start time) is not strictly increasing.',
         '- [scratchpad/](scratchpad/INDEX.md): the working scripts the repo cites but does not contain, with an index.',
         '- [tools/build_history.py](tools/build_history.py): the script that builds all of the above.', '',
         '## Counts', '',
         f'- Owner prompts: **{len(hs)}** ({sum(1 for e in hs if e["text"])} with text, {sum(1 for e in hs if not e["text"])} image only), plus {sum(1 for e in events if e.get("_answer"))} answer given through a question card.',
         f'- Claude replies (text blocks shown to the owner): {counts["assistant"]}.',
         f'- Tool calls: {counts["tool_call"]}.',
         f'- Workflow launches: {sum(1 for e in events if e["kind"] == "tool_call" and e["tool"] == "Workflow")} '
         f'({sum(1 for e in events if e["kind"] == "tool_call" and e["tool"] == "Workflow" and e.get("_wf"))} ran; the others were refused at launch), with **{counts["subagent"]}** subagents in all. Every subagent appears with its label, its verbatim prompt and a short summary of what it returned.',
         f'- Commits: **{len(commits)}**.',
         f'- Context compactions: **{len(compactions)}**.',
         f'- Background-task notifications that woke the session: {len(wakes)}; stop-hook messages: {sum(1 for e in events if e["kind"] == "wakeup" and e["tool"] == "stop-hook")}.', '',
         '## Timeline', '',
         '| Phase | Starts (UTC) | Transcript lines | What happened |', '|---|---|---|---|']
    for st, slug, title, desc in starts:
        L.append(f'| [{title}](transcript/{slug}.md) | {ts_fmt(st)[:16]} | {phase_lines.get(slug, 0)} | {desc} |')
    L += ['', 'Phases are time windows. Work overlapped: background workflows kept running while new requests came in, so a phase can contain the tail of earlier work.', '',
          '## Commits', '', '| When (UTC) | Commit | Subject |', '|---|---|---|']
    for c in commits:
        L.append(f'| {ts_fmt(c["ts"])[:16]} | `{c["commit"]}`' + (f' (now `{c["args"]["repo_hash"]}`)' if c['args'].get('lodge_docs_hash') else '') + f' | {c["text"].split("  [")[0]} |')
    L += ['', 'The first six were made in the lodge-docs repository on branch `claude/dinosaur-strength-physics-8o13ft`. On 10 Oct the two project folders were moved into this repository with their history filtered, which rewrote the hashes; both are shown. The commit that adds this history folder is on branch `session-transcript` and is not part of the transcript.', '',
          '## Context compactions', '']
    for c in compactions:
        L.append(f'- {ts_fmt(c["ts"])}: the context was replaced by a written summary (shown collapsed in the transcript at that point). The raw log keeps everything before it, so nothing in this history depends on the summaries.')
    L += ['', '## Overnight work', '',
          f'After prompt 2 (09 Oct 04:24 UTC: “I’m going to bed so just get as far as you can”) the session ran unattended until the owner’s next message at 22:01 UTC. '
          'There were no scheduled wake-ups or loops; the session was re-invoked each time a background job finished (a workflow, a test sweep or a monitor). '
          'Each of those notifications is marked “Woken” in the transcript, with what it led to.', '',
          '## What could not be recovered, and what was left out on purpose', '',
          f'- Nothing had to be reconstructed: the raw main log and all {len(set(e["_wf"] for e in events if e.get("_wf")))} workflow folders were on disk, including everything before each of the {len(compactions)} compactions.',
          '- Tool results are omitted, except errors (first 3 lines) and the owner’s one answer through a question card. Claude’s private reasoning, the system prompt and harness reminders are not included.',
          '- Subagent prompts are shown as the workflow script computed them, without the harness’s wrapper text. Each subagent’s result is summarised in two or three lines; the full results stay in the session logs and, for the reviews, in `rex-strength-lab/research/reviews/`.',
          f'- Subagents with no recorded result: {sum(1 for e in events if e["kind"] == "subagent" and e["text"].startswith("No result recorded"))}. The first fix-verification run was stopped and relaunched.',
          '- The last phase ends when the files were generated: the commit that adds this folder, and anything after it, is not in the transcript.',
          '- Image data is not included. Attached images are named by their upload file and mapped to the asset each one became.',
          f'- Scratchpad: {scratch_stats[0]} scripts and small result files were copied; {scratch_stats[1]} other files (copies of project code, binaries, large files and raw downloads) are listed by folder and type instead (see scratchpad/INDEX.md).',
          '- Redaction: tokens, keys, cookies, signed URLs, personal email addresses and the name part of those addresses are replaced with [redacted]. '
          + (f'This run replaced {sum(REDACT_COUNT.values())} item(s) ({", ".join(f"{k}: {v}" for k, v in REDACT_COUNT.items())}).' if REDACT_COUNT else 'This run found none to replace in the included text.'), '',
          '## How to regenerate', '',
          'The raw logs exist only inside the session’s container (`~/.claude/projects/-home-user/' + SID + '.jsonl` and the folder beside it). With them present, from the repository root:', '',
          '```', 'python3 history/tools/build_history.py', '```', '',
          'It rewrites every file in history/ except tools/, prints the counts, and fails if any owner message in the raw log is missing from prompts.md. '
          'Options: `--log`, `--subagents`, `--scratchpad`, `--repo`, `--out`, and `--since`/`--until` (the window for commits taken from git).', '']
    if missing:
        L += ['**Check failed:** these owner messages were not found in prompts.md: ' + '; '.join(missing), '']
    open(os.path.join(out, 'README.md'), 'w', encoding='utf-8').write('\n'.join(L))


def verify_prompts(out, log):
    """Every human message in the raw log must appear verbatim in prompts.md."""
    text = open(os.path.join(out, 'prompts.md'), encoding='utf-8').read()
    raw = []
    for e in log:
        if e.get('type') != 'user' or e.get('isSidechain') or e.get('isCompactSummary') or e.get('isMeta'):
            continue
        c = e.get('message', {}).get('content')
        if isinstance(c, str):
            if c.lstrip().startswith('<task-notification>') or c.startswith('Stop hook feedback'):
                continue
            raw.append(c)
        elif isinstance(c, list) and not any(b.get('type') == 'tool_result' for b in c):
            raw.append('\n\n'.join(b.get('text', '') for b in c if b.get('type') == 'text'))
    missing = [r[:60] for r in raw if r and redact(r) not in text]
    # last-prompt entries are display copies: newlines flattened, cut at 200 chars with an ellipsis
    flat = ' '.join(text.split())
    last_prompts = {e.get('lastPrompt') for e in log if e.get('type') == 'last-prompt' and e.get('lastPrompt')}
    missing += [p[:60] for p in last_prompts if ' '.join(redact(p).rstrip('…').split()) not in flat]
    return raw, missing


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--log', default=os.path.join(HOME, '.claude/projects/-home-user', SID + '.jsonl'))
    ap.add_argument('--subagents', default=os.path.join(HOME, '.claude/projects/-home-user', SID, 'subagents/workflows'))
    ap.add_argument('--scratchpad', default=f'/tmp/claude-0/-home-user/{SID}/scratchpad')
    ap.add_argument('--repo', default=os.path.dirname(os.path.dirname(here)))
    ap.add_argument('--out', default=os.path.dirname(here))
    ap.add_argument('--since', default='2026-10-09T00:00:00Z')
    ap.add_argument('--until', default='2026-10-11T00:14:00Z')
    args = ap.parse_args()
    if not os.path.exists(args.log):
        sys.exit(f'raw session log not found: {args.log}')
    events, starts, log, scripts = build(args)
    os.makedirs(args.out, exist_ok=True)
    hs = write_prompts(args.out, events)
    total, phase_lines = write_transcript(args.out, events, starts)
    write_jsonl(args.out, events)
    scratch_stats = copy_scratchpad(args.out, args.scratchpad, scripts)
    raw, missing = verify_prompts(args.out, log)
    counts = collections.Counter(e['kind'] for e in events)
    compactions = [e for e in events if e['kind'] == 'compaction']
    write_readme(args.out, events, starts, phase_lines, counts, compactions, scratch_stats, missing)
    print(json.dumps({'human_prompts': len(hs), 'raw_human_messages': len(raw), 'missing_from_prompts_md': missing,
                      'events': len(events), 'by_kind': counts, 'commits': [e['commit'] for e in events if e['kind'] == 'commit'],
                      'compactions': [e['ts'] for e in compactions], 'transcript_lines': total, 'phase_lines': phase_lines,
                      'scratchpad_copied': scratch_stats[0], 'scratchpad_listed': scratch_stats[1], 'scratch_files_redacted': scratch_stats[2],
                      'redactions': REDACT_COUNT}, indent=1, default=str))
    if missing:
        sys.exit(1)


if __name__ == '__main__':
    main()
