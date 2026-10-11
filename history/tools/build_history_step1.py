#!/usr/bin/env python3
"""Build the history entry for the Build Comparison Step 1 session (11 Oct 2026).

Same method and output as build_history.py, which built the first session's history: this script
imports it and only swaps the session-specific settings (session id, log paths, phases, scratchpad
folders, README wording).

Reads (inside the session's container):
  - the main session log  ~/.claude/projects/-home-user-rex-strength-lab/<SID>.jsonl
  - the workflow subagent logs beside it
  - the workflow scripts  ~/.claude/projects/*/<SID>/workflows/scripts/*.js
  - git history of this repository (for the commits)
  - the session scratchpad (only to copy working scripts)

Writes history/2026-10-11-build-comparison-step1/: README.md, prompts.md, transcript.md
(+ transcript/NN-*.md), transcript.jsonl, scratchpad/.

Run from the repository root:
  python3 history/tools/build_history_step1.py
"""
import collections
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build_history as B  # noqa: E402

SID = '9b81b796-3162-56bd-85b7-22e02b6583e2'
PROJ = os.path.join(B.HOME, '.claude/projects/-home-user-rex-strength-lab')
B.SID = SID
B.LODGE_HASH = {}
B.IMAGE_ASSETS = {}

# Phases: (slug, title, how the phase starts, one-paragraph description for the README).
B.PHASES = [
    ('01-request-research-tool', 'The request, research and the measuring tool', ('start',),
     'The owner asked for Step 1 of the Build Comparison and went to bed. A research workflow (six topics, each checked by a skeptic) and a design workflow (three proposals, two judges, one synthesis) were launched, and while they ran the data derivations (ANSUR II outline template, skull-top heights, turnaround traces), the measuring tool and its duo.jpg validation, the score model, the first page and the functional limits were built and committed.'),
    ('02-page-to-spec', 'The page rebuilt to the design spec', ('after_commit', 'Build Comparison: functional limits'),
     'The design synthesis arrived and the page was rebuilt around it: score-band stops, a glance tape and a pinned locator, equal gap tiles with limit posts, a forest plot, the tool layout. The comics research relabelled Thor, the Thing and Luke Cage, and the verifiers\' corrections (Army body-fat equations, Kouri\'s normalised 25, the hands-to-face band, the outline ratios) were applied. A context compaction happened at the start of this phase.'),
    ('03-review-rounds', 'Review rounds and fixes', ('workflow', 'build-comparison-review-r1'),
     'Adversarial review rounds (five lenses, each finding reproduced or refuted by a skeptic), the fixes after each, the README and notes, and the first publish of the page.'),
]

B.DIRS = collections.OrderedDict([
    ('research', 'The research agents\' scripts (by topic): ANSUR II analyses, fact checks, PDF figure counts, comics full-text searches.'),
    ('design', 'The design agents\' mockups and the judges\' measurement scripts (reader/, lineup/, instrument/, phonereview/, critic-honest/, final/).'),
    ('review1', 'Review round 1: the reviewers\' and verifiers\' repro scripts.'),
    ('review2', 'Review round 2: the reviewers\' and verifiers\' repro scripts.'),
    ('review3', 'Review round 3: the reviewers\' and verifiers\' repro scripts.'),
    ('page', 'Page render helpers used throughout: shot.js and diag.js render dist/index.html and run a snippet.'),
    ('trace', 'Turnaround tracing probes (masks, view splits, tail polygons) before tools/trace_turnarounds.js.'),
    ('duo', 'duo.jpg segmentation and front-only validation probes before test/duo.js.'),
    ('fig', 'Silhouette previews before src/figure.js settled.'),
    ('targets', 'Target-outline exports from tools/export_targets.js.'),
    ('wfout', 'Each workflow agent\'s structured result, extracted from the logs by extract.py (research, verifiers, design proposals, judges, synthesis).'),
])
B.EXTRA_FILES = ['extract.py', 'elbow.js', 'limits.js', 'limits2.js', 'segtest.js', 'sheettest.js', 'synth.js', 'volcheck.js']
B.SNAPSHOT_DIRS = ()
_skip = B.skip_reason


def skip_reason(top, rel, size, ext, head=''):
    """Like the first session's rule, plus: keep the extracted workflow results (JSON) in wfout/."""
    if top == 'wfout' and ext in ('.json', '.txt') and size <= 400_000:
        return None
    return _skip(top, rel, size, ext, head)


B.skip_reason = skip_reason


def write_readme(out, events, starts, phase_lines, counts, compactions, scratch_stats, missing):
    hs = B.human_events(events)
    first, last = events[0]['ts'], max(e['ts'] for e in events if e['ts'])
    commits = [e for e in events if e['kind'] == 'commit']
    wakes = [e for e in events if e['kind'] == 'wakeup' and e['tool'] == 'task-notification']
    wf_calls = [e for e in events if e['kind'] == 'tool_call' and e['tool'] == 'Workflow']
    L = ['# Session history: Build Comparison, Step 1', '',
         'A transcript of the Claude Code session that built Step 1 of the Build Comparison (`build-comparison/`), for readers who cannot open the session. '
         f'It runs from {B.ts_fmt(first)} to {B.ts_fmt(last)} and was rebuilt from the raw session logs on disk, not from memory, '
         'with the same tool and format as the first session\'s history in the parent folder.', '',
         '## Files', '',
         '- [prompts.md](prompts.md): the owner’s prompts only, numbered, verbatim, with timestamps. Start here.',
         '- [transcript.md](transcript.md): the full readable transcript, split into one file per phase under [transcript/](transcript/).',
         '- [transcript.jsonl](transcript.jsonl): one JSON object per event: `{seq, ts, kind, phase, text, tool, args, agent_description, commit}`; `kind` is one of user, assistant, tool_call, subagent, compaction, commit, wakeup. Missing fields are null. '
         '`seq` follows the transcript order: each workflow’s subagents follow the call that launched it, and a subagent’s `ts` is its own start time, so `ts` is not strictly increasing. '
         'For a subagent, `text` is the short account of its result and `args.prompt` the full prompt.',
         '- [scratchpad/](scratchpad/INDEX.md): the working scripts and the workflows\' extracted results, with an index.',
         '- [../tools/build_history_step1.py](../tools/build_history_step1.py): the script that builds this folder (it reuses ../tools/build_history.py).', '',
         '## Counts', '',
         f'- Owner prompts: **{len(hs)}**.',
         f'- Claude replies (text blocks shown to the owner): {counts["assistant"]}.',
         f'- Tool calls: {counts["tool_call"]}.',
         f'- Workflow launches: {len(wf_calls)} ({sum(1 for e in wf_calls if e.get("_wf"))} ran), with **{counts["subagent"]}** subagents in all. Every subagent appears with its label, up to three lines on what it returned and its verbatim prompt.',
         f'- Commits: **{len(commits)}**.',
         f'- Context compactions: **{len(compactions)}**.',
         f'- Background-task notifications that woke the session: {len(wakes)}.', '',
         '## Timeline', '',
         '| Phase | Starts (UTC) | Transcript lines | What happened |', '|---|---|---|---|']
    for st, slug, title, desc in starts:
        L.append(f'| [{title}](transcript/{slug}.md) | {B.ts_fmt(st)[:16]} | {phase_lines.get(slug, 0)} | {desc} |')
    L += ['', 'Phases are time windows. Work overlapped: background workflows kept running while other work went on, so a phase can contain the tail of earlier work.', '',
          '## Commits', '', '| When (UTC) | Commit | Subject |', '|---|---|---|']
    for c in commits:
        L.append(f'| {B.ts_fmt(c["ts"])[:16]} | `{c["commit"]}` | {c["text"].split("  [")[0]} |')
    L += ['', 'All are on branch `claude/hopeful-keller-vly1s9`. The commit that adds this history folder, and anything after it, is not in the transcript.', '',
          '## Context compactions', '']
    for c in compactions:
        L.append(f'- {B.ts_fmt(c["ts"])}: the context was replaced by a written summary (shown collapsed in the transcript at that point). The raw log keeps everything before it, so nothing in this history depends on the summaries.')
    L += ['', '## Overnight work', '',
          'The owner\'s one prompt ends “I\'m going to bed, so get as far as you can.” The whole session ran unattended. '
          'There were no scheduled wake-ups; the session was re-invoked each time a background job finished (a workflow or a wait on one). '
          'Each of those notifications is marked “Woken” in the transcript, with what it led to.', '',
          '## What could not be recovered, and what was left out on purpose', '',
          f'- Nothing had to be reconstructed: the raw main log and all {len(set(e["_wf"] for e in events if e.get("_wf")))} workflow folders were on disk, including everything before each compaction.',
          '- Tool results are omitted, except errors (first 3 lines). Claude’s private reasoning, the system prompt and harness reminders are not included.',
          '- Subagent prompts are shown as the workflow script computed them. Each subagent’s result is summarised in up to three lines; the full results are in scratchpad/wfout/ and, for the research and reviews, in `build-comparison/research/`.',
          '- Image data is not included.',
          (f'- Scratchpad: {scratch_stats[0]} scripts and small result files were copied; {scratch_stats[1]} other files (downloads, renders, binaries and large files) are listed by folder and type instead (see scratchpad/INDEX.md).'
           if scratch_stats else '- Scratchpad: not regenerated in this run (the session scratchpad was not found).'),
          '- Redaction: tokens, keys, cookies, signed URLs, personal email addresses and the name part of those addresses are replaced with [redacted]. '
          + (f'This run replaced {sum(B.REDACT_COUNT.values())} item(s) ({", ".join(f"{k}: {v}" for k, v in B.REDACT_COUNT.items())}).' if B.REDACT_COUNT else 'This run found none to replace in the included text.'), '',
          '## How to regenerate', '',
          'The inputs exist only inside the session’s container: the raw main log (`~/.claude/projects/-home-user-rex-strength-lab/' + SID + '.jsonl`), the workflow folders beside it, '
          'the workflow scripts (`~/.claude/projects/*/' + SID + '/workflows/scripts/`) and the session scratchpad (`/tmp/claude-0/-home-user-rex-strength-lab/' + SID + '/scratchpad`). With them present, from the repository root:', '',
          '```', 'python3 history/tools/build_history_step1.py', '```', '']
    if missing:
        L += ['**Check failed:** these owner messages were not found in prompts.md: ' + '; '.join(missing), '']
    open(os.path.join(out, 'README.md'), 'w', encoding='utf-8').write('\n'.join(L))


B.write_readme = write_readme


def git_commits(repo):
    """Only this session's commits: each carries its session URL in the message trailer."""
    import subprocess
    try:
        out = subprocess.run(['git', '-C', repo, 'log', '--all', '--format=%H%x09%cI%x09%s%x09%b%x1e'], capture_output=True, text=True, check=True).stdout
    except Exception:
        return []
    rows = []
    for rec in out.split('\x1e'):
        rec = rec.strip('\n')
        if not rec:
            continue
        h, ts, subj, body = (rec.split('\t', 3) + [''])[:4]
        if SESSION_URL not in body:
            continue
        t = B.parse_ts(ts)
        rows.append({'hash': h[:7], 'ts': t.astimezone(B.dt.timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.000Z'), 'subject': subj})
    return rows


SESSION_URL = 'https://claude.ai/code/session_01XyFK2XFUBxTrrW7LVavrcu'
B.git_commits = git_commits

if __name__ == '__main__':
    here = os.path.dirname(os.path.abspath(__file__))
    defaults = {
        '--log': os.path.join(PROJ, SID + '.jsonl'),
        '--subagents': os.path.join(PROJ, SID, 'subagents/workflows'),
        '--scripts': os.path.join(B.HOME, '.claude/projects/*', SID, 'workflows/scripts/*.js'),
        '--scratchpad': f'/tmp/claude-0/-home-user-rex-strength-lab/{SID}/scratchpad',
        '--out': os.path.join(os.path.dirname(here), '2026-10-11-build-comparison-step1'),
        '--since': '2026-10-11T00:50:00Z',
        '--until': '2026-10-12T23:59:59Z',
    }
    for k, v in defaults.items():
        if k not in sys.argv:
            sys.argv += [k, v]
    B.main()
