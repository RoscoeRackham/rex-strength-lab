#!/usr/bin/env python3
"""Build the history entry for the Rex lab canon session (14-16 Oct 2026): RUN-canon.md, pull requests 2-5 of BRIEF-canon.md.

Same method and output as build_history.py, which built the first session's history: this script
imports it and only swaps the session-specific settings (session id, log paths, phases, scratchpad
folders, README wording), as build_history_gui.py and build_history_presence.py do. Three things are
new in this session and handled here:
  - Most of the building and fixing was done by subagents started with the Agent tool, not by
    workflows. Each one is shown under the call that started it, with its verbatim prompt and its
    final report (the shared method shows only workflow subagents).
  - All the review rounds ran one workflow script (canon-review) with each round's arguments, so a
    phase can start at a given pull request's round ('workflow_run' below), at a tool call ('tool'),
    or at any of the shared method's markers.
  - The owner's "Try again" reached the log as a queued command, as "Merged. Proceed" did in the
    page-brief session; it is read as the owner's prompt it is.

Reads (inside the session's container):
  - the main session log  ~/.claude/projects/-home-user-rex-strength-lab/<SID>.jsonl
  - the subagent logs beside it: subagents/agent-*.jsonl (Agent tool) and subagents/workflows/wf_*/
  - the workflow scripts  ~/.claude/projects/*/<SID>/workflows/scripts/*.js, and the scripts given
    inline to the Workflow tool (taken from the log)
  - git history of this repository (for the commits)
  - the session scratchpad (only to copy working scripts)

Writes history/<first day of the log>-rex-canon/: README.md, prompts.md, transcript.md
(+ transcript/NN-*.md), transcript.jsonl, scratchpad/.

Run from the repository root:
  python3 history/tools/build_history_canon.py
Options: those of build_history.py (--out, --log, --scratchpad, ...), and --draft, which builds even
while a phase's description is still a placeholder or a phase's start is not yet in the log (that
phase is then left empty and a warning is printed). Without --draft either one is an error.
"""
import collections
import io
import json
import os
import re
import subprocess
import sys

sys.dont_write_bytecode = True  # importing build_history must not leave a __pycache__ in history/tools/

HERE = os.path.dirname(os.path.abspath(__file__))
# In history/tools/ the shared method sits beside this script; drafted elsewhere, it is the repository's copy.
TOOLS = HERE if os.path.exists(os.path.join(HERE, 'build_history.py')) else \
    os.environ.get('REX_HISTORY_TOOLS', '/home/user/rex-strength-lab/history/tools')
REPO = os.path.dirname(os.path.dirname(os.path.abspath(TOOLS)))
sys.path.insert(0, TOOLS)
import build_history as B  # noqa: E402

SID = 'be83ea46-0fb6-5f45-86e4-061daa8f7429'
PROJ = os.path.join(B.HOME, '.claude/projects/-home-user-rex-strength-lab')
SCRATCH = f'/tmp/claude-0/-home-user-rex-strength-lab/{SID}/scratchpad'
SESSION_URL = 'https://claude.ai/code/session_0136zsmhtj8TCY2T2u8SKMVX'
LOG = os.path.join(PROJ, SID + '.jsonl')
BRANCHES = [  # (pull request of BRIEF-canon.md, GitHub number, branch), in stack order
    (2, 33, 'claude/canon-2-recoil'),
    (3, 34, 'claude/canon-3-passenger'),
    (4, 35, 'claude/canon-4-contests'),
    (5, 36, 'claude/canon-5-shimmer'),
]
B.SID = SID
B.LODGE_HASH = {}
B.IMAGE_ASSETS = {}

DRAFT = '--draft' in sys.argv
if DRAFT:
    sys.argv.remove('--draft')


def first_day(path):
    """The UTC date of the log's first timestamp: the day the session started, which names the folder."""
    try:
        with open(path, encoding='utf-8') as f:
            for line in f:
                ts = json.loads(line).get('timestamp') if line.strip() else None
                if ts:
                    return ts[:10]
    except (OSError, ValueError):
        pass
    return '2026-10-14'


OUT_NAME = first_day(LOG) + '-rex-canon'

# A phase description still to be written. Without --draft the script refuses to build while one is left.
PLACEHOLDER = '[TO FILL IN]'

# Phases: (slug, title, how the phase starts, one-paragraph description for the README).
# Start markers: those of build_history.py (('start',), ('workflow', name), ('prompt', text prefix),
# ('after_commit', subject prefix)), plus ('workflow_run', name, {arg: value, ...}) for a workflow run
# with those arguments, and ('tool', tool name, prefix of the call's one-line key).
PHASES = [
    ('01-pr2-build', 'Pull request 2 (their own recoil): the plan and the build', ('start',),
     'The owner\'s one request: carry out RUN-canon.md, pull requests 2-5 of BRIEF-canon.md on stacked branches with the full review rounds, '
     'without merging, publishing or force-pushing. After a baseline run of the test line on main, two mapping workflows read the code: one for pull request 2, '
     'and one, on a read-only worktree of main, for pull requests 3-5. rex-strength-lab/ was claimed in STATUS.md on claude/canon-2-recoil, '
     'and two background subagents built items 2, 3 and 7: the engine and its tests (87c9dc3), then the page, the copy and the page tests (ba45ba9). '
     'With They take their own recoil on, the push back from their own moves goes to their source, not the planet, so none of it shakes the ground; '
     'a ledger test checks every move\'s momentum, and the header has its new tagline. Pull request 2 was opened as #33.'),
    ('02-pr2-review', 'Pull request 2: three review rounds and a re-check', ('workflow_run', 'canon-review', {'pr': 2, 'round': 1}),
     'Three review rounds (physics; code and tests; copy and layout), each finding reproduced or refuted by a skeptic, and a re-check of round 3\'s fixes '
     'with each fix\'s test reverted in a scratch copy: 12, 19, 8 and 5 findings; 41 confirmed and fixed, 3 refuted. A background subagent fixed each round. '
     'The main ones: an unlimited shove into a bolted partner sent the shover off at light speed; the mutants of the catcher\'s code that no test caught; '
     'a bolted pull whose steps shook the ground while the page said none, then (round 3 and the re-check) legs that pushed with unlimited force and then towed a car faster than he can sprint. '
     'The close-out updated #33\'s description and STATUS.md, and CI was started on the branch (it passed, run 60).'),
    ('03-pr3-build', 'Pull request 3 (Safe passenger): the build', ('tool', 'Bash', 'Create the PR 3 branch'),
     'On claude/canon-3-passenger, stacked on #33, one background subagent built item 5 (95a22f9). Safe passenger is on by default, with its own heading in Their powers: '
     'a person he throws or catches feels only a manageable push at the launch, in the air and when they land. The landing\'s energy is taken back, but its push still '
     'reaches the ground, so it shakes the ground as a real landing does. Pull request 3 was opened as #34.'),
    ('04-pr3-review', 'Pull request 3: two review rounds', ('workflow_run', 'canon-review', {'pr': 3, 'round': 1}),
     'Two review rounds (physics and claims; code, layout and the migration): 8 and 8 findings; 15 confirmed and fixed, 1 refuted. '
     'Round 1\'s major: in the game of catch a missed person was called unharmed beside a "skin melts" chip. '
     'Round 2 reworked where the ground gives way under a person\'s landing (only the downward part of its push, over the person\'s own stop), '
     'so a person landing at 10 km/s on granite is no longer told "no crater". The close-out updated #34\'s description and started CI (it passed, run 61).'),
    ('05-pr4-build', 'Pull request 4 (contests, Never knocked back): the build', ('tool', 'Bash', 'Create the PR 4 branch'),
     'On claude/canon-4-contests, stacked on #34, two background subagents built item 4: the engine and its tests (0f27012), then the page, the cards and the tests (238f570). '
     'In their contests (arm wrestling, every Wrestle move, Collide\'s charge and steady push, the partner toss) force moves: the other\'s push is real, and only each one\'s own recoil goes to his source. '
     'A charger doesn\'t slow, and where the one he hits is held without limit the collision has no physical answer, which the Collide tab now explains. '
     'The two Never knocked back switches, one each, were added beside Bolted, both on. Pull request 4 was opened as #35.'),
    ('06-pr4-review', 'Pull request 4: three review rounds and a re-check', ('workflow_run', 'canon-review', {'pr': 4, 'round': 1}),
     'Three review rounds (physics; the two-player tests; copy) and a re-check of round 3\'s fixes: 28, 19, 18 and 4 findings; 66 confirmed and fixed, 3 refuted. '
     'The main ones: Collide\'s carried hit left the hold out of its force, then out of its energy; a pin never checked the loser\'s elbow pad, which can break the table; '
     'a bolted Rex\'s bolts were said to hold past his rock\'s tear load; the paradox was called harmless; and the new page checks (about 5 minutes) put CI near its time limit, '
     'so test/shots.js now waits for what each check reads and the job\'s timeout is 30 minutes. Round 1\'s fixer stopped when the account hit its weekly usage limit; '
     'after the owner\'s "Try again" it was resumed where it stopped. The context was compacted once, between round 3\'s findings and its fixes. CI passed on #35 (run 62).'),
    ('07-pr5-build', 'Pull request 5 (the shimmer): the build', ('tool', 'Bash', 'Create and push the PR 5 branch'),
     'On claude/canon-5-shimmer, stacked on #35, two background subagents built item 6. The engine (3cb9f60) adds up the energy their powers take back in each run '
     'and turns it into the shimmer\'s level on the energy ladder, up to a blinding flare at a dinosaur-killer-scale hit. The page (1d92534) adds a Shimmer tile to each tab whose run takes energy back, '
     'and a warm glow over his eyes, feather tips and mouth on two of the owner\'s pictures, drawn over them with the image files unchanged. '
     'The container restarted during the page stage; the subagent\'s edits survived and it was resumed. Pull request 5 was opened as #36.'),
    ('08-pr5-review', 'Pull request 5: two review rounds', ('workflow_run', 'canon-review', {'pr': 5, 'round': 1}),
     'Two review rounds, each with three lenses (design and accessibility; copy; code and data), each finding reproduced or refuted by a skeptic: '
     '11 and 9 findings; 18 confirmed and fixed, 2 refuted. A background subagent fixed each round, reverting each fix in a scratch copy to see its check fail. '
     'Round 1\'s major: four page texts still said absorbed energy changes nothing, against canon\'s "it shows". Its minors included the drag figure for a throw real air '
     'would not bring down (all of its energy, now the drag on its way out) and a dense Rex\'s climb out of his own gravity counted as drag. '
     'Round 2 found six of the header\'s eleven crest-tip glows on the grey background beside the feathers (re-measured from the image file, with a check that reads it), '
     'an arm-wrestling pin held by Unbreakable footing that took nothing back (now the winner\'s take, a new decision for the owner), and false drag parts beside fast catches. '
     'The close-out updated #36\'s description and STATUS.md, and CI passed on the branch (run 63).'),
    ('09-close-and-history', 'The close-out, STATUS and this history', ('after_commit', 'Review round 2 of pull request 5'),
     'Pull request 5 was closed out and CI passed on it (run 63). STATUS.md was updated (the four pull requests open and stacked, CI passed on each, and what the owner does next: merge them in order with merge commits, then rebuild and republish once), and this history was written.'),
]
B.PHASES = PHASES

# Scratchpad folders worth copying from, in the order the index lists them. Review folders are added
# below from what is on disk, so rounds run after this was written are covered too.
B.DIRS = collections.OrderedDict([
    ('understand2', 'Pull request 2\'s mapping workflow (canon-2-understand): the readers\' probes and sweeps of the engine on main, and the ledger prototype (ledger.js, ledger2.js).'),
    ('understand345', 'The mapping of pull requests 3-5 (canon-345-understand) on a read-only worktree of main: the readers\' scripts by topic (passenger, collide, pr4-push, shimmer).'),
    ('pr345', 'The mapping workflow\'s results for pull requests 3-5 (map.json), read when each was built.'),
    ('pr2', 'Pull request 2: the specs given to the build subagents (SPEC.md, SPEC-page.md), the mapping\'s results (map.json, page-sites.txt), each review round\'s raw results (round*-raw.json) and the arguments passed to the next, '
            'the pull request\'s description (pr-body.md), and each fixer\'s scripts (r1fix/, r2fix/, r3fix/, rcfix/ for the re-check) and mutant runs.'),
    ('page', 'Pull request 2\'s page stage: page probes (probe.js, harness.js, block.js and others).'),
    ('pr3', 'Pull request 3: the spec, the build subagent\'s probes, each review round\'s raw results, the pull request\'s description and the fixers\' scripts (r1fix/, r2fix/).'),
    ('pr4', 'Pull request 4: the spec, the mapping and the ledger, the engine and page stages\' probes (scratch/, page/), each review round\'s raw results, the pull request\'s description, '
            'commit messages and the fixers\' scripts (r1fix/, r2fix/, r3fix/, rcfix/ for the re-check).'),
    ('pr5', 'Pull request 5: the spec, the prototypes of the energy tally (proto/), the engine report and its mutant runs (engine-mutants/), the page stage\'s probes and page mutants (page/, page-mutants/), '
            'the review lenses (lenses.json), the README draft and the pull request\'s description.'),
    ('main-tree', 'A read-only worktree of main, made for the mapping of pull requests 3-5. All of it is project code, so it is listed, not copied.'),
])


def _review_desc(name):
    m = re.fullmatch(r'review-pr(\d+)-r(\d+)(-recheck)?', name)
    if not m:
        return None
    what = f'the re-check of round {m.group(2)}\'s fixes' if m.group(3) else f'review round {m.group(2)}'
    return f'Pull request {m.group(1)}, {what}: the reviewers\' and skeptics\' repro scripts, one folder per lens. Their clones of the repository are listed, not copied.'


def _review_key(name):
    m = re.fullmatch(r'review-pr(\d+)-r(\d+)(-recheck)?', name)
    return (int(m.group(1)), int(m.group(2)), bool(m.group(3)))


if os.path.isdir(SCRATCH):
    for _d in sorted((d for d in os.listdir(SCRATCH) if _review_desc(d)), key=_review_key):
        B.DIRS[_d] = _review_desc(_d)
B.EXTRA_FILES = []
B.SNAPSHOT_DIRS = ()
BUILD_DIRS = ('understand2', 'understand345', 'pr345', 'pr2', 'pr3', 'pr4', 'pr5', 'page')

# ---------------------------------------------------------------------------- reading the log
AGENT_DESC = {}   # agent id -> the description it was started with (Agent tool)
RESTARTS = []     # (ts, 'container' | 'worker')
API_ERRORS = []   # (ts, text)
_load_jsonl = B.load_jsonl


def load_jsonl(path):
    """As build_history.load_jsonl, plus:
    - a prompt the owner typed while Claude was working ("Try again") reaches the log as a queued_command
      attachment absorbed mid-turn, not as a user entry; read it as the owner's prompt it is;
    - an error the API showed in place of a reply (the weekly usage limit) is labelled as one;
    - note the restarts and which agent id each Agent call started, for the transcript and the README."""
    rows = _load_jsonl(path)
    main = os.path.abspath(path) == os.path.abspath(ACTIVE_LOG[0])
    out, agent_calls, queued = [], {}, []
    for e in rows:
        a = e.get('attachment') or {}
        if e.get('type') == 'attachment' and a.get('type') == 'queued_command' and (a.get('origin') or {}).get('kind') == 'human' \
                and a.get('commandMode') == 'prompt' and not str(a.get('prompt', '')).lstrip().startswith('<task-notification>'):
            out.append({'type': 'user', 'timestamp': e.get('timestamp'), 'message': {'role': 'user', 'content': a.get('prompt', '')}})
            queued.append(out[-1])
            continue
        if main and e.get('type') == 'assistant' and e.get('isApiErrorMessage'):
            content = [dict(b, text='[Error from the API, shown in place of a reply] ' + b['text']) if b.get('type') == 'text' else b
                       for b in e.get('message', {}).get('content', [])]
            API_ERRORS.append((e.get('timestamp'), ' '.join(b.get('text', '') for b in e.get('message', {}).get('content', []) if b.get('type') == 'text')))
            e = dict(e, message=dict(e['message'], content=content))
        if main and e.get('type') == 'assistant':
            for b in e.get('message', {}).get('content', []):
                if b.get('type') == 'tool_use' and b.get('name') == 'Agent':
                    agent_calls[b['id']] = (b.get('input') or {}).get('description')
        if main and e.get('type') == 'user':
            c = e.get('message', {}).get('content')
            tur = e.get('toolUseResult')
            if isinstance(c, list) and isinstance(tur, dict) and tur.get('agentId'):
                for b in c:
                    if b.get('type') == 'tool_result' and b.get('tool_use_id') in agent_calls:
                        AGENT_DESC[tur['agentId']] = agent_calls[b['tool_use_id']]
            s = c if isinstance(c, str) else '\n'.join(b.get('text', '') for b in (c or []) if isinstance(b, dict) and b.get('type') == 'text')
            if e.get('isMeta') and 'The container was restarted' in s[:200]:
                RESTARTS.append((e.get('timestamp'), 'container'))
            elif e.get('isMeta') and s.startswith("This session's worker process was restarted"):
                RESTARTS.append((e.get('timestamp'), 'worker'))
        out.append(e)
    # The queued prompt is logged where the turn absorbed it, after replies written later than it was typed
    # ("Try again" at 12:17:55 sits after a 12:18:10 reply). Put it back at its own time, so the transcript
    # and the reply context in prompts.md follow what happened.
    for q in queued:
        i = next(k for k, x in enumerate(out) if x is q)
        j = i
        while j > 0 and (not out[j - 1].get('timestamp') or out[j - 1]['timestamp'] > (q.get('timestamp') or '')):
            j -= 1
        out.insert(j, out.pop(i))
    return out


ACTIVE_LOG = [LOG]
B.load_jsonl = load_jsonl


def _round_words(r):
    r = str(r)
    return f'the re-check of round {r.split("-")[0]}' if r.endswith('-recheck') else f'round {r}'


_key_arg = B.key_arg


def key_arg(name, inp, scripts):
    """One line per tool call: name each review run's pull request and round (they share one script),
    and give the Agent, SendMessage and GitHub calls a readable line instead of raw JSON."""
    inp = inp or {}
    if name == 'Workflow':
        k = _key_arg(name, inp, scripts)
        a = inp.get('args') if isinstance(inp.get('args'), dict) else {}
        if a.get('pr') is not None:
            k += f' (pull request {a["pr"]}, {_round_words(a.get("round"))})'
        return k
    if name == 'Agent':
        return f'{inp.get("description", "")} ({inp.get("subagent_type") or "general-purpose"}' + (', in the background)' if inp.get('run_in_background') else ')')
    if name == 'SendMessage':
        to = inp.get('to') or inp.get('recipient') or ''
        who = f'the subagent “{AGENT_DESC[to]}”' if to in AGENT_DESC else to
        return f'to {who}: {inp.get("summary") or ""}. “{B.cut(inp.get("message") or inp.get("content") or "", 200)}”'
    if name == 'mcp__github__create_pull_request':
        return f'{inp.get("title", "")} (head {inp.get("head")}, base {inp.get("base")})'
    if name == 'mcp__github__update_pull_request':
        parts = [k for k in ('title', 'body', 'base', 'state') if k in inp]
        return f'#{inp.get("pullNumber")}: ' + ', '.join(parts) + ' updated' + (f' (body {len(inp["body"]):,} characters)' if inp.get('body') else '')
    if name == 'mcp__github__actions_run_trigger':
        return f'{inp.get("method")} {inp.get("workflow_id")} on {inp.get("ref")}'
    if name in ('mcp__github__actions_get', 'mcp__github__actions_list'):
        return f'{inp.get("method")} {inp.get("resource_id") or ""}'.strip()
    if name == 'mcp__claude-code-remote__send_later':
        return f'in {inp.get("delay_minutes") or inp.get("at")} min: {B.cut(inp.get("message", ""), 200)}'
    return _key_arg(name, inp, scripts)


B.key_arg = key_arg


def add_notification(add, ts, text, seen):
    """As build_history.add_notification, but a notification with no task id (the container restart,
    the queued GitHub and scheduled-task notifications) is named for what it is, not 'task None'."""
    if text in seen:
        return
    seen.add(text)
    tid = re.search(r'<task-id>([^<]+)</task-id>', text)
    tid = tid.group(1) if tid else None
    status = re.search(r'<status>([^<]+)</status>', text)
    status = status.group(1) if status else 'event'
    ttype = re.search(r'<task-type>([^<]+)</task-type>', text)
    summary = re.search(r'<summary>([\s\S]*?)</summary>', text)
    event = re.search(r'<event>([\s\S]*?)</event>', text)
    who = f'Background task {tid}' if tid else ('Notifications' if ttype and 'notification' in ttype.group(1) else 'Background work')
    s = f"{who} {status}: {summary.group(1).strip() if summary else ''}".strip()
    if event and event.group(1).strip():
        s += f' Event: {B.cut(event.group(1), 200)}'
    add('wakeup', ts, tool='task-notification', text=s, args={'task_id': tid})


B.add_notification = add_notification

# ---------------------------------------------------------------------------- the build, extended
_build = B.build


def agent_report(path):
    """The subagent's final report (its SubagentHandback message, else its last text), when it reported, and when it started."""
    rows = _load_jsonl(path)
    started = next((x.get('timestamp') for x in rows if x.get('timestamp')), None)
    report, last_text, at = None, None, None
    for e in rows:
        if e.get('type') != 'assistant':
            continue
        for b in e.get('message', {}).get('content', []):
            if b.get('type') == 'tool_use' and b.get('name') == 'SubagentHandback':
                report, at = (b.get('input') or {}).get('message'), e.get('timestamp')
            elif b.get('type') == 'text' and b.get('text', '').strip():
                last_text = b['text']
    return started, report, at, last_text


def report_summary(report, last_text=None):
    """One line on what the subagent reported: its first sentences, headings read as sentences."""
    if not report:
        return 'No final report recorded (the agent was stopped, or was still running when this was built).' + \
            (' Its last message: ' + B.first_sentences(last_text, 2, 300) if last_text else '')
    lines = []
    for l in report.split('\n'):
        s = l.strip()
        if s.startswith('#'):
            s = s.lstrip('#').strip()
            if s and s[-1] not in '.!?:':
                s += '.'
        lines.append(s)
    return B.first_sentences('\n'.join(lines), 3, 420)


def find_start(events, marker):
    kind = marker[0]
    if kind == 'start':
        return events[0]['ts']
    if kind == 'workflow':
        return next((x['ts'] for x in events if x['kind'] == 'tool_call' and x['tool'] == 'Workflow' and x['args']['key'].startswith(marker[1] + ':')), None)
    if kind == 'workflow_run':
        name, want = marker[1], marker[2]
        for x in events:
            if x['kind'] == 'tool_call' and x['tool'] == 'Workflow' and x['args']['key'].startswith(name + ':'):
                a = (x.get('_input') or {}).get('args')
                a = a if isinstance(a, dict) else {}
                if all(str(a.get(k)) == str(v) for k, v in want.items()):
                    return x['ts']
        return None
    if kind == 'tool':
        return next((x['ts'] for x in events if x['kind'] == 'tool_call' and x['tool'] == marker[1] and x['args']['key'].startswith(marker[2])), None)
    if kind == 'prompt':
        return next((x['ts'] for x in events if x['kind'] == 'user' and x.get('_human') and (x['text'] or '').startswith(marker[1])), None)
    if kind == 'after_commit':
        c = next((x for x in events if x['kind'] == 'commit' and x['text'].startswith(marker[1])), None)
        return (B.parse_ts(c['ts']) + B.dt.timedelta(milliseconds=1)).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z' if c else None
    raise SystemExit(f'unknown phase marker: {marker}')


MISSING_MARKERS = []


def build(args):
    """build_history.build with every phase starting at the start (so it cannot fail on a marker it does
    not know), then: the Agent tool's subagents put under their calls, the inline workflow scripts kept,
    and the phases found with the markers above."""
    ACTIVE_LOG[0] = args.log
    real = B.PHASES
    B.PHASES = [(s, t, ('start',), d) for s, t, m, d in real]
    try:
        events, _starts, log, scripts = _build(args)
    finally:
        B.PHASES = real

    # ---- the Agent tool's subagents, each under the call that started it
    agent_dir = os.path.dirname(os.path.normpath(args.subagents))
    merged = []
    for ev in events:
        merged.append(ev)
        if ev['kind'] != 'tool_call' or ev['tool'] != 'Agent':
            continue
        m = re.search(r'agentId: (a[0-9a-f]+)', ev.get('_result') or '')
        inp = ev.get('_input') or {}
        aid = m.group(1) if m else None
        path = os.path.join(agent_dir, f'agent-{aid}.jsonl') if aid else None
        started, report, at, last_text = agent_report(path) if path and os.path.exists(path) else (None, None, None, None)
        merged.append({'kind': 'subagent', 'ts': started or ev['ts'], 'tool': 'Agent', 'commit': None, '_anchor_ts': ev['ts'],
                       'agent_description': B.redact(inp.get('description') or aid or '?'),
                       'text': B.redact(report_summary(report, last_text)),
                       'args': {'via': 'Agent', 'agent_id': aid, 'subagent_type': inp.get('subagent_type'),
                                'background': bool(inp.get('run_in_background')), 'reported_at': at,
                                'prompt': B.redact(inp.get('prompt') or ''), 'report': B.redact(report) if report else None}})
    events[:] = merged

    # ---- workflow scripts given inline (not persisted by the harness): keep them with the others
    for ev in events:
        if ev['kind'] == 'tool_call' and ev['tool'] == 'Workflow' and (ev.get('_input') or {}).get('script'):
            txt = ev['_input']['script']
            if txt not in scripts.values():
                name = B.workflow_meta(txt)[0] or 'workflow'
                scripts[f'{name}-{ev.get("_wf") or "inline"}.js'] = txt

    # ---- phases
    starts = []
    for slug, title, marker, desc in real:
        st = find_start(events, marker)
        if st is None:
            if not DRAFT:
                raise SystemExit(f'phase marker not found: {marker} (phase {slug}); with --draft the phase is left empty')
            MISSING_MARKERS.append((slug, marker))
            st = (B.parse_ts(max(e['ts'] for e in events if e['ts'])) + B.dt.timedelta(seconds=1)).strftime('%Y-%m-%dT%H:%M:%S.000Z')
        starts.append((st, slug, title, desc))
    if [s[0] for s in starts] != sorted(s[0] for s in starts):
        raise SystemExit('phase starts are out of order: ' + ', '.join(f'{s[1]} {s[0]}' for s in starts))
    for ev in events:
        key = ev.get('_anchor_ts') or ev['ts'] or ''
        ph = starts[0]
        for s in starts:
            if key >= s[0]:
                ph = s
        ev['phase'] = ph[1]
    return events, starts, log, scripts


B.build = build
_render = B.render_event


def render_event(ev, pf, rel_from):
    """An Agent-tool subagent: its label, one line on its report, and its prompt and report, verbatim and collapsed."""
    a = ev.get('args') or {}
    if ev['kind'] != 'subagent' or a.get('via') != 'Agent':
        return _render(ev, pf, rel_from)
    prompt, link = pf.show(a['agent_id'] or 'agent', a['prompt'] or '(prompt not recorded)', rel_from)
    how = 'Agent tool, in the background' if a.get('background') else 'Agent tool'
    L = [f'**Subagent `{ev["agent_description"]}`** · {how} · started {B.ts_fmt(ev["ts"])}' + (f' · reported {B.ts_fmt(a["reported_at"])}' if a.get('reported_at') else ''), '']
    L += [f'- {B.md_text(line)}' for line in (ev['text'] or '').split('\n')] + ['']
    L += ['<details>', f'<summary>Prompt, verbatim ({len(a["prompt"] or ""):,} characters)</summary>', '',
          f'Agent `{a["agent_id"]}` ({a.get("subagent_type") or "general-purpose"}).'
          + (f' Lines over {B.PROMPT_LINE_MAX:,} characters are cut here; the full prompt is in [{link}]({link}).' if link else ''), '',
          B.fence(prompt), '', '</details>', '']
    if a.get('report'):
        L += ['<details>', f'<summary>Its report, verbatim ({len(a["report"]):,} characters)</summary>', '', B.fence(a['report']), '', '</details>', '']
    return L


B.render_event = render_event

# ---------------------------------------------------------------------------- the scratchpad copy
_skip = B.skip_reason
REPO_COPY_RE = re.compile(r'(^|/)(history|build-comparison|build-calculator|rex-strength-lab|\.github|\.git|repo|clone|wt|node_modules)/')
_LAB = os.path.join(REPO, 'rex-strength-lab')
LAB_FILES = {os.path.relpath(os.path.join(r, f), _LAB).replace(os.sep, '/')
             for r, ds, fs in os.walk(_LAB) if 'node_modules' not in r for f in fs}
SCRATCH_USED = [SCRATCH]
_IN_CHECKOUT = {}


def in_checkout(rel):
    """True when a folder above this file is a git clone or worktree (it holds a .git entry), e.g. a reviewer's mut/ or base/."""
    d, chain, res = os.path.dirname(rel), [], False
    while d:
        if d in _IN_CHECKOUT:
            res = _IN_CHECKOUT[d]
            break
        chain.append(d)
        if os.path.lexists(os.path.join(SCRATCH_USED[0], d, '.git')):
            res = True
            break
        d = os.path.dirname(d)
    for c in chain:
        _IN_CHECKOUT[c] = res
    return res


def lab_copy(rel):
    """True when the path ends in one of the lab's own files (src/engine.js, test/powers.js, ...): a copy, often with one line mutated."""
    parts = rel.split('/')
    return any('/'.join(parts[i:]) in LAB_FILES for i in range(1, len(parts)))


def _lab_heads():
    """The opening of each of the lab's larger text files, here and in the scratchpad's worktree of main:
    a renamed copy (shots-ad1aa9c.js, orig/powers.js) starts the same way."""
    heads = set()
    for lab in (_LAB, os.path.join(SCRATCH, 'main-tree', 'rex-strength-lab')):
        for r, ds, fs in os.walk(lab):
            if 'node_modules' in r:
                continue
            for f in fs:
                p = os.path.join(r, f)
                if os.path.splitext(f)[1].lower() in B.SCRIPT_EXT and os.path.getsize(p) > 20_000:
                    with open(p, 'rb') as fh:
                        heads.add(fh.read(400).decode('utf-8', 'replace')[:200])
    return heads


LAB_HEADS = _lab_heads()
TEXT_TOP_MAX = 250_000   # a build folder's own files: the specs, the mapping and review results, the descriptions
TEXT_DEEP_MAX = 100_000  # deeper (the fixers' and probes' folders), where the larger files are output dumps


def listed_by_path(top, rel, ext):
    """The reason a file is listed, not copied, when its path alone decides it; else None."""
    if top == 'main-tree' or REPO_COPY_RE.search(rel) or in_checkout(rel) or lab_copy(rel):
        return 'copy of project code'
    if ext in ('.png', '.jpg', '.jpeg', '.gif', '.webp'):
        return 'image'
    if ext in ('.html', '.pdf'):
        return 'built page or render'
    if re.search(r'(^|/)(dl|downloads?|raw|pdfs?)/', rel):
        return 'raw download'
    return None


def skip_reason(top, rel, size, ext, head=''):
    """List (do not copy) the worktree of main, the reviewers' clones and every other copy of the repository
    or of the lab's files, the built pages and images; copy the scripts, and in the build folders the specs,
    the mapping and review results, the pull request descriptions and commit messages."""
    why = listed_by_path(top, rel, ext)
    if why:
        return why
    if ext in B.SCRIPT_EXT and size > 20_000 and head[:200] in LAB_HEADS:
        return 'copy of project code'
    if top in BUILD_DIRS and ext in ('.json', '.md', '.txt'):
        if size <= (TEXT_TOP_MAX if rel.count('/') == 1 else TEXT_DEEP_MAX):
            return None
        return 'too large'
    return _skip(top, rel, size, ext, head)


B.skip_reason = skip_reason
_copy_scratchpad = B.copy_scratchpad
_builtin_open = open


def _open(path, mode='r', *a, **k):
    """build_history.copy_scratchpad reads the first 400 bytes of every file for skip_reason. Over half a million
    files that read is most of the run, and for a file its path already lists (a clone, an image) the bytes are
    never used, so give it none. Every other open is the real one."""
    if mode == 'rb' and isinstance(path, str) and path.startswith(SCRATCH_USED[0].rstrip('/') + '/'):
        rel = os.path.relpath(path, SCRATCH_USED[0]).replace(os.sep, '/')
        if listed_by_path(rel.split('/', 1)[0], rel, os.path.splitext(path)[1].lower()):
            return io.BytesIO(b'')
    return _builtin_open(path, mode, *a, **k)


B.open = _open


def index_fixes(scratch):
    """The index's fixed text was written for the first session; say what is true of this one."""
    left = sorted(d + ('/' if os.path.isdir(os.path.join(scratch, d)) else '') for d in os.listdir(scratch) if d not in B.DIRS)
    notes = {'history-build/': 'history-build/ (where this builder was drafted and tested)',
             'baseline.log': 'baseline.log (the test line\'s output on main before the run)'}
    left_txt = ', '.join(notes.get(d, d) for d in left)
    return [
        ('They were written by Claude and its subagents to reproduce findings, measure the picture, compile data and sweep the pages. ',
         'They were written by Claude and its subagents to map the code, build each pull request, reproduce or refute review findings and check the fixes. '),
        ('the old project folder (/home/user/dino-strength-sim)', 'the repository at /home/user/rex-strength-lab'),
        ('plus JSON and text results up to 100 KB in mass/ and bcdata/. ',
         'plus, in the build folders (' + ', '.join(f'{d}/' for d in BUILD_DIRS) + f'), JSON, Markdown and text: up to {TEXT_TOP_MAX // 1000} KB in the folder itself '
         '(the specs given to the build subagents, the mapping and review results, the pull request descriptions and the commit messages) '
         f'and up to {TEXT_DEEP_MAX // 1000} KB in its subfolders. '),
        ('Copies of project code are earlier states of engine.js, data.js and the tests, kept for diffing (the patched engine variants in audit/, '
         'the catch-base and src-before-armduo baselines, backup/ and old/ trees). The released versions are in the repository.',
         'Copies of project code are main-tree/ (a worktree of main), the reviewers\' clones of the repository (repo/ and the other git checkouts), '
         'and the build and fix subagents\' copies of the lab\'s files, most with one line mutated to see whether a test catches it. The released versions are in the repository.'),
        ('Other scratchpad folders that the repository does not cite (earlier probes, backups, page previews) were not copied.',
         ('Not covered above: ' + left_txt + '.') if left_txt else 'Every scratchpad folder is covered above.'),
    ]


def copy_scratchpad(out, scratch, scripts):
    SCRATCH_USED[0] = scratch
    stats = _copy_scratchpad(out, scratch, scripts)
    p = os.path.join(out, 'scratchpad', 'INDEX.md')
    if stats and os.path.exists(p):
        txt = open(p, encoding='utf-8').read()
        for a, b in index_fixes(scratch):
            assert txt.count(a) == 1, a
            txt = txt.replace(a, b)
        open(p, 'w', encoding='utf-8').write(txt)
    return stats


B.copy_scratchpad = copy_scratchpad

# ---------------------------------------------------------------------------- commits
COMMIT_PR = {}  # short hash -> pull request of BRIEF-canon.md it was made for


def _is_ancestor(repo, h, ref):
    return subprocess.run(['git', '-C', repo, 'merge-base', '--is-ancestor', h, ref], capture_output=True).returncode == 0


def git_commits(repo):
    """Only this session's commits: each carries its session URL in the message trailer. The commit that adds
    this history (subject starting 'History:') is left out. Each is matched to the first stacked branch that holds it."""
    try:
        out = subprocess.run(['git', '-C', repo, 'log', '--all', '--format=%H%x09%cI%x09%s%x09%b%x1e'], capture_output=True, text=True, check=True).stdout
    except Exception:
        return []
    refs = []
    for pr, num, br in BRANCHES:
        for ref in (br, 'origin/' + br):
            if subprocess.run(['git', '-C', repo, 'rev-parse', '--verify', '--quiet', ref], capture_output=True).returncode == 0:
                refs.append((pr, num, ref))
                break
    rows = []
    for rec in out.split('\x1e'):
        rec = rec.strip('\n')
        if not rec:
            continue
        h, ts, subj, body = (rec.split('\t', 3) + [''])[:4]
        if SESSION_URL not in body or subj.startswith('History:'):
            continue
        t = B.parse_ts(ts)
        COMMIT_PR[h[:7]] = next(((pr, num) for pr, num, ref in refs if _is_ancestor(repo, h, ref)), None)
        rows.append({'hash': h[:7], 'ts': t.astimezone(B.dt.timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.000Z'), 'subject': subj})
    return rows


B.git_commits = git_commits

# ---------------------------------------------------------------------------- README


def _n(n, word):
    return f'{n} {word}' + ('' if n == 1 else 's')


def write_readme(out, events, starts, phase_lines, counts, compactions, scratch_stats, missing):
    hs = B.human_events(events)
    first, last = events[0]['ts'], max(e['ts'] for e in events if e['ts'])
    commits = [e for e in events if e['kind'] == 'commit']
    wakes = [e for e in events if e['kind'] == 'wakeup' and e['tool'] == 'task-notification']
    stops = [e for e in events if e['kind'] == 'wakeup' and e['tool'] == 'stop-hook']
    wf_calls = [e for e in events if e['kind'] == 'tool_call' and e['tool'] == 'Workflow']
    wf_subs = [e for e in events if e['kind'] == 'subagent' and (e.get('args') or {}).get('via') != 'Agent']
    ag_subs = [e for e in events if e['kind'] == 'subagent' and (e.get('args') or {}).get('via') == 'Agent']
    resumed = sorted({(e.get('_input') or {}).get('to') for e in events if e['kind'] == 'tool_call' and e['tool'] == 'SendMessage'} - {None})
    ci_runs = [e for e in events if e['kind'] == 'tool_call' and e['tool'] == 'mcp__github__actions_run_trigger' and 'run_workflow' in e['args']['key']]
    later = [e for e in events if e['kind'] == 'tool_call' and e['tool'] == 'mcp__claude-code-remote__send_later']
    L = ['# Session history: Rex lab canon follow-ups (BRIEF-canon.md, pull requests 2-5)', '',
         'A transcript of the Claude Code session that carried out `rex-strength-lab/RUN-canon.md`: pull requests 2-5 of `rex-strength-lab/BRIEF-canon.md`, '
         'built one after another on stacked branches, each with its full review rounds. 2: their own recoil goes to their source (#33). 3: Safe passenger on by default (#34). '
         '4: contests and the two Never knocked back switches (#35). 5: the absorption shimmer (#36). It is for readers who cannot open the session. '
         f'It runs from {B.ts_fmt(first)} to {B.ts_fmt(last)} and was rebuilt from the raw session logs on disk, not from memory, '
         'with the same tool and format as the earlier histories in the parent folder.', '',
         '## Files', '',
         '- [prompts.md](prompts.md): the owner’s prompts only, numbered, verbatim, with timestamps. Start here.',
         '- [transcript.md](transcript.md): the full readable transcript, split into one file per phase under [transcript/](transcript/).',
         '- [transcript.jsonl](transcript.jsonl): one JSON object per event: `{seq, ts, kind, phase, text, tool, args, agent_description, commit}`; `kind` is one of user, assistant, tool_call, subagent, compaction, commit, wakeup. Missing fields are null. '
         '`seq` follows the transcript order: each workflow’s subagents and each Agent-tool subagent follow the call that launched them, and a subagent’s `ts` is its own start time, so `ts` is not strictly increasing. '
         'For a subagent, `text` is the short account of its result and `args.prompt` the full prompt; for an Agent-tool subagent (`tool` is "Agent"), `args.report` is its final report, verbatim.',
         '- [scratchpad/](scratchpad/INDEX.md): the working scripts, the specs given to the build subagents, the review rounds\' raw results and the pull request descriptions, with an index.',
         '- [../tools/build_history_canon.py](../tools/build_history_canon.py): the script that builds this folder (it reuses ../tools/build_history.py).', '',
         '## Counts', '',
         f'- Owner prompts: **{len(hs)}**. Stop-hook messages (system feedback, not the owner): {len(stops)}.',
         f'- Claude replies (text blocks shown to the owner): {counts["assistant"]}.',
         f'- Tool calls: {counts["tool_call"]}.',
         f'- Workflow launches: {len(wf_calls)} ({sum(1 for e in wf_calls if e.get("_wf"))} ran), with **{len(wf_subs)}** subagents in all. '
         'Every workflow subagent appears with its label, up to three lines on what it returned and its verbatim prompt.',
         f'- Subagents started with the Agent tool (the builders and fixers): **{len(ag_subs)}**, each with its verbatim prompt and its final report. '
         + (f'{len(resumed)} of them were resumed with SendMessage after being stopped.' if resumed else ''),
         f'- Commits: **{len(commits)}**.',
         f'- Context compactions: **{len(compactions)}**.',
         f'- Background-task notifications that woke the session: {len(wakes)}.', '',
         '## Timeline', '',
         '| Phase | Starts (UTC) | Transcript lines | What happened |', '|---|---|---|---|']
    for st, slug, title, desc in starts:
        L.append(f'| [{title}](transcript/{slug}.md) | {B.ts_fmt(st)[:16]} | {phase_lines.get(slug, 0)} | {desc} |')
    L += ['', 'Phases are time windows. Work overlapped: background subagents and workflows kept running while other work went on, so a phase can contain the tail of earlier work '
          '(for example, the CI result of the pull request before).', '',
          '## Commits', '', '| When (UTC) | Commit | Pull request | Subject |', '|---|---|---|---|']
    for c in commits:
        pr = COMMIT_PR.get(c['commit'])
        L.append(f'| {B.ts_fmt(c["ts"])[:16]} | `{c["commit"]}` | ' + (f'{pr[0]} (#{pr[1]})' if pr else '') + f' | {c["text"].split("  [")[0]} |')
    L += ['', 'They were made on the four stacked branches: ' + '; '.join(f'`{br}` for pull request {pr} (#{num})' for pr, num, br in BRANCHES) + '. '
          'Each pull request\'s base is the branch before it, and the session merged none of them. The commit that adds this history folder, and anything after it, is not in the transcript.', '',
          '## Context compactions', '']
    for c in compactions:
        L.append(f'- {B.ts_fmt(c["ts"])}: the context was replaced by a written summary (shown collapsed in the transcript at that point). The raw log keeps everything before it, so nothing in this history depends on the summaries.')
    worker = [t for t, k in RESTARTS if k == 'worker']
    container = [t for t, k in RESTARTS if k == 'container']
    limit = API_ERRORS[0] if API_ERRORS else None
    L += ['', '## How the run went', '',
          'The owner gave one request and the session ran unattended from there; it did not stop to ask anything. '
          f'The session itself planned each pull request, wrote the specs, pushed, opened and described the pull requests, and started CI {_n(len(ci_runs), "time")}, each after a pull request\'s last review round. '
          'Background subagents started with the Agent tool did the building and the fixing; workflows did the mapping and the review rounds (one reviewer per lens, then one skeptic per lens who reproduced or refuted each finding with code). '
          'The session was re-invoked each time one of them finished; those notifications are marked “Woken” in the transcript, with what it led to. '
          + (f'While CI ran it set {_n(len(later), "one-off check-in")} on itself with `send_later` ('
             + ('it' if len(later) == 1 else 'each') + ' came back as a queued notification, read with the ReadNotifications tool).' if later else ''), '',
          'The stop hook (`~/.claude/stop-hook-git-check.sh`) asks for uncommitted changes to be committed and pushed when a turn ends. Each time it fired, the changes were a background subagent\'s work in progress, '
          'so the session left them for that subagent to test and commit; each message is shown in the transcript as “Stop hook”. They are system feedback, not the owner\'s prompts.', '']
    if limit:
        L += [f'At {B.ts_fmt(limit[0])} the account hit its weekly usage limit (“{limit[1]}”), and the round 1 fixer of pull request 4 stopped part-way, its work uncommitted in the tree. '
              + (f'The owner typed “Try again”; the log shows the session\'s worker process restarting at {B.ts_fmt(worker[0])}. ' if worker else 'The owner typed “Try again”. ')
              + 'The session resumed the fixer with SendMessage, and it finished from where it stopped. The owner then wrote “The limit has been fully reset”.', '']
    if container:
        L += [f'At {B.ts_fmt(container[0])} the container restarted during pull request 5\'s page stage, which stopped its subagent. '
              'Its edits to the page and the scratchpad survived, and the session resumed it with SendMessage.', '']
    L += ['## What could not be recovered, and what was left out on purpose', '',
          f'- Nothing had to be reconstructed: the raw main log, all {len(set(e["_wf"] for e in events if e.get("_wf")))} workflow folders and the logs of all {len(ag_subs)} Agent-tool subagents were on disk, including everything before the compaction.',
          '- Tool results are omitted, except errors (first 3 lines). Claude’s private reasoning, the system prompt and harness reminders are not included. '
          'The error the API showed in place of a reply (the usage limit) is included and labelled as one.',
          '- Workflow subagents\' prompts are shown as the workflow script computed them. All the review rounds ran one script (canon-review) with each round\'s arguments '
          '(the pull request, the round, the lenses, the earlier rounds\' findings); the transcript names each run\'s pull request and round from them. '
          'Each workflow subagent’s result is summarised in up to three lines; the full results are in `rex-strength-lab/research/reviews/canon-*.json` and, raw, in the scratchpad\'s pr*/round*-raw.json.',
          '- Agent-tool subagents are shown with their prompt and their final report, verbatim; their own tool calls are not shown (they are in the subagent logs). '
          + (f'The {len(resumed)} that were stopped and resumed kept one log each, so each appears once, with the report it gave at the end.' if resumed else ''),
          '- Image data is not included.',
          (f'- Scratchpad: {scratch_stats[0]} scripts and small result files were copied; {scratch_stats[1]} other files (the worktree of main, reviewers\' clones of the repository, mutated copies of the lab, built pages, images, binaries and large files) are listed by folder and type instead (see scratchpad/INDEX.md).'
           if scratch_stats else '- Scratchpad: not regenerated in this run (the session scratchpad was not found).'),
          '- Redaction: tokens, keys, cookies, signed URLs, personal email addresses and the name part of those addresses are replaced with [redacted]. '
          + (f'This run replaced {sum(B.REDACT_COUNT.values())} item(s) ({", ".join(f"{k}: {v}" for k, v in B.REDACT_COUNT.items())}).' if B.REDACT_COUNT else 'This run found none to replace in the included text.'), '',
          '## How to regenerate', '',
          'The inputs exist only inside the session’s container: the raw main log (`~/.claude/projects/-home-user-rex-strength-lab/' + SID + '.jsonl`), the subagent and workflow folders beside it, '
          'the workflow scripts (`~/.claude/projects/*/' + SID + '/workflows/scripts/`) and the session scratchpad (`' + SCRATCH + '`). With them present, from the repository root:', '',
          '```', 'python3 history/tools/build_history_canon.py', '```', '']
    if missing:
        L += ['**Check failed:** these owner messages were not found in prompts.md: ' + '; '.join(missing), '']
    open(os.path.join(out, 'README.md'), 'w', encoding='utf-8').write('\n'.join(L))


B.write_readme = write_readme

if __name__ == '__main__':
    todo = [slug for slug, title, marker, desc in PHASES if PLACEHOLDER in desc]
    if todo and not DRAFT:
        sys.exit('phase descriptions still to fill in (' + PLACEHOLDER + '): ' + ', '.join(todo) + '. Write them, or pass --draft for a trial build.')
    defaults = {
        '--log': LOG,
        '--subagents': os.path.join(PROJ, SID, 'subagents/workflows'),
        '--scripts': os.path.join(B.HOME, '.claude/projects/*', SID, 'workflows/scripts/*.js'),
        '--scratchpad': SCRATCH,
        '--repo': REPO,
        '--out': os.path.join(REPO, 'history', OUT_NAME),
        '--since': '2026-10-14T00:00:00Z',
        '--until': '2026-10-31T23:59:59Z',
    }
    for k, v in defaults.items():
        if k not in sys.argv:
            sys.argv += [k, v]
    B.main()
    for slug in todo:
        print(f'warning: phase {slug} still has a placeholder description ({PLACEHOLDER})', file=sys.stderr)
    for slug, marker in MISSING_MARKERS:
        print(f'warning: phase {slug}: start marker {marker} is not in the log yet; the phase was left empty', file=sys.stderr)
