#!/usr/bin/env python3
"""Build the history entry for the Rex lab page-brief session (12-13 Oct 2026): BRIEF-gui.md built in three pull requests.

Same method and output as build_history.py, which built the first session's history: this script
imports it and only swaps the session-specific settings (session id, log paths, phases, scratchpad
folders, README wording), as build_history_presence.py does.

Reads (inside the session's container):
  - the main session log  ~/.claude/projects/-home-user-rex-strength-lab/<SID>.jsonl
  - the workflow subagent logs beside it
  - the workflow scripts  ~/.claude/projects/*/<SID>/workflows/scripts/*.js, and the ones the session ran
    from its scratchpad (workflows/gui-a-review.js, rex-gui-b-review.js, wfC/review.js)
  - git history of this repository (for the commits)
  - the session scratchpad (only to copy working scripts)

Writes history/2026-10-12-rex-gui/: README.md, prompts.md, transcript.md
(+ transcript/NN-*.md), transcript.jsonl, scratchpad/.

Run from the repository root:
  python3 history/tools/build_history_gui.py
"""
import collections
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build_history as B  # noqa: E402

SID = '70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09'
PROJ = os.path.join(B.HOME, '.claude/projects/-home-user-rex-strength-lab')
SCRATCH = f'/tmp/claude-0/-home-user-rex-strength-lab/{SID}/scratchpad'
B.SID = SID
B.LODGE_HASH = {}
B.IMAGE_ASSETS = {}

# Phases: (slug, title, how the phase starts, one-paragraph description for the README).
B.PHASES = [
    ('01-request-and-a', 'The request and pull request A (page organisation)', ('start',),
     'The owner asked for BRIEF-gui.md to be built in three pull requests, one at a time. rex-strength-lab/ was claimed in STATUS.md on claude/rex-gui-a, and A (sections 1-4: the Their powers panel, the sidebar order, footing standing or bolted, Rex + Ollie in its own element) was built on the page alone. '
     'Four review rounds (27, 18, 19 and 10 findings; 73 confirmed and fixed, 1 refuted) each checked the last round\'s fixes. Pull request #20 was merged and the page republished (version 11).'),
    ('02-b-build', 'Pull request B: the four default powers, built', ('workflow', 'gui-b-understand'),
     'After the owner\'s "Start B", an understand-and-design workflow mapped the engine and drafted the rules for the four default powers (air resistance absorbed, things keep their form, unbreakable footing, they take their own recoil). '
     'They were built into the engine, gated so that with all four off every one of 15,541 engine results matches main\'s engine exactly (test/powers.js), and then onto the page with the two-player presets and ground shaking.'),
    ('03-b-review', 'Pull request B: five review rounds and a re-check', ('workflow', 'rex-gui-b-review'),
     'Five review rounds (52, 49, 45, 32 and 35 findings; 210 confirmed and fixed) and a narrower re-check of round 5\'s fixes (26, all fixed). The rounds did not converge quickly: each round\'s fixes opened new cases, mostly at the edges (light-speed throws, weak ground, bolted contests). '
     'Pull request #22 was opened with 27 recorded decisions, CI passed, and the owner merged it.'),
    ('04-c-research', 'Pull request C: the energy ladder researched and built', ('after_commit', 'STATUS: B merged and republished'),
     'After "Start part C", main was tested and republished (version 12). Seven research topics (an audit of the old rungs and six energy bands) ran in four parallel workflows, each researched, then checked by a skeptic who fetched every source (157 URLs, 154 facts, 33 corrected), then compiled. '
     'The topics were merged by hand into research/final-energy.json (140 facts; one conflict settled on the LLNL handbook\'s page image), and the 58-rung ladder, its wording (src/ladder.js) and its tests (test/ladder.js) were built.'),
    ('05-c-review', 'Pull request C: three review rounds, the merge and this history', ('workflow', 'rex-gui-c-review'),
     'Three review rounds (29, 19 and 11 findings; 51 confirmed and fixed, 8 refuted): the Weight tab\'s Earth-binding ratios, tests that could pass a broken ladder, rungs wrongly firm or verified, false precision from rough rungs. '
     'Pull request #23 was opened, CI passed and the owner merged it; the page was republished (version 13) and this history written.'),
]

B.DIRS = collections.OrderedDict([
    ('understand', 'Pull request B\'s understand-and-design workflow: its readers\' and designers\' scripts.'),
    ('reviewA1', 'A, review round 1: the reviewers\' and verifiers\' repro scripts.'),
    ('reviewA2', 'A, review round 2: the reviewers\' and verifiers\' repro scripts.'),
    ('reviewA3', 'A, review round 3: the reviewers\' and verifiers\' repro scripts.'),
    ('reviewA4', 'A, review round 4: the reviewers\' and verifiers\' repro scripts.'),
    ('a', 'A: page probes (the sidebar cue, the Rex + Ollie element, smoke tests).'),
    ('reviewB1', 'B, review round 1: the reviewers\' and verifiers\' repro scripts.'),
    ('reviewB2', 'B, review round 2: the reviewers\' and verifiers\' repro scripts.'),
    ('reviewB3', 'B, review round 3: the reviewers\' and verifiers\' repro scripts.'),
    ('reviewB4', 'B, review round 4: the reviewers\' and verifiers\' repro scripts.'),
    ('reviewB5', 'B, review round 5: the reviewers\' and verifiers\' repro scripts.'),
    ('verifyR5', 'B, the re-check of round 5\'s fixes: checkers\' and verifiers\' scripts.'),
    ('mut5', 'B: mutation harness (one-line reverts of fixes, to see whether a test catches each).'),
    ('mut6', 'B: mutation harness for the round 5 re-check.'),
    ('probe', 'B: page probes.'),
    ('researchC', 'C: the research agents\' and skeptics\' scripts by topic, and the compiled topic files (compiled/*.json) that were merged into research/final-energy.json. Downloads (papers, handbooks, pages) are listed, not copied.'),
    ('mergeC', 'C: the merge of the seven topics (merge.py), the merge log and decisions, and the writer of research/reviews/gui-c-research.json.'),
    ('llnlchk', 'C: the LLNL handbook page (Table 5-2) rendered to settle the Comp B Grade A conflict.'),
    ('fixC1', 'C: the scripts that applied each review round\'s research-data fixes, and the writers of the round records.'),
    ('mutC', 'C: mutation harness for test/ladder.js (the reviewers\' mutants re-run against the strengthened test).'),
    ('reviewC1', 'C, review round 1: the reviewers\' and verifiers\' repro scripts.'),
    ('reviewC2', 'C, review round 2: the reviewers\' and verifiers\' repro scripts.'),
    ('reviewC3', 'C, review round 3: the reviewers\' and verifiers\' repro scripts.'),
    ('wfC', 'C: the review workflow script and the decisions and prior findings passed to it.'),
])
B.EXTRA_FILES = ['erange.js', 'probe.js', 'probeW.js', 'probeG.js', 'probeG2.js', 'probeG3.js', 'write-r2.py', 'write-r3.py', 'write-r4.py', 'write-r5.py', 'write-v5.py',
                 'r3-args.py', 'r5-args.py', 'pr-b-decisions.md', 'pr-b-body-final.md', 'pr-c-body.md']
B.SNAPSHOT_DIRS = ()
_load = B.load_workflow_scripts


def load_workflow_scripts(pattern):
    """Some workflows ran from files in the scratchpad (scriptPath); read those too."""
    scripts = _load(pattern)
    for p in ('workflows/gui-a-review.js', 'rex-gui-b-review.js', 'wfC/review.js'):
        scripts.update(_load(os.path.join(SCRATCH, p)))
    return scripts


B.load_workflow_scripts = load_workflow_scripts
_load_jsonl = B.load_jsonl


def load_jsonl(path):
    """A prompt the owner typed while Claude was working ('Merged. Proceed') reaches the log as a queued_command
    attachment absorbed mid-turn, not as a user entry; read it as the owner's prompt it is."""
    rows = _load_jsonl(path)
    out = []
    for e in rows:
        a = e.get('attachment') or {}
        if e.get('type') == 'attachment' and a.get('type') == 'queued_command' and (a.get('origin') or {}).get('kind') == 'human' \
                and a.get('commandMode') == 'prompt' and not str(a.get('prompt', '')).lstrip().startswith('<task-notification>'):
            out.append({'type': 'user', 'timestamp': e.get('timestamp'), 'message': {'role': 'user', 'content': a.get('prompt', '')}})
            continue
        out.append(e)
    return out


B.load_jsonl = load_jsonl
_skip = B.skip_reason

REPO_COPY_RE = re.compile(r'(^|/)(history|build-comparison|build-calculator|rex-strength-lab|\.github|repo|clone|wt)/')
_LAB = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'rex-strength-lab')
LAB_FILES = {os.path.relpath(os.path.join(r, f), _LAB).replace(os.sep, '/')
             for r, ds, fs in os.walk(_LAB) if 'node_modules' not in r for f in fs}
TEXT_DIRS = ('mergeC', 'fixC1', 'wfC')


def skip_reason(top, rel, size, ext, head=''):
    """Like the presence session's rule: list (do not copy) reviewers' snapshots and mutated copies of the
    repository, and raw downloads; keep the compiled research topics, the merge's records and the PR drafts."""
    if top in ('reviewA1', 'reviewA2', 'reviewA3', 'reviewA4', 'reviewB1', 'reviewB2', 'reviewB3', 'reviewB4', 'reviewB5', 'verifyR5',
               'reviewC1', 'reviewC2', 'reviewC3', 'mut5', 'mut6', 'mutC', 'understand') and \
            (REPO_COPY_RE.search(rel) or any(rel.endswith('/' + p) for p in LAB_FILES)):
        return 'copy of project code'
    if re.search(r'(^|/)(dl|dl\d*|downloads?|raw|pdfs?|html)/', rel) or ext in ('.pdf', '.html', '.png', '.jpg', '.jpeg', '.gif', '.webp'):
        return 'raw download or render' if ext != '.png' else 'image'
    if top == 'researchC' and re.match(r'researchC/compiled/[a-z]+\.json$', rel) and size <= 400_000:
        return None
    if (top in TEXT_DIRS or top == '') and ext in ('.json', '.md', '.txt') and size <= 400_000:
        return None
    return _skip(top, rel, size, ext, head)


B.skip_reason = skip_reason
_copy_scratchpad = B.copy_scratchpad

# The index's fixed text was written for the first session; say what is true of this one.
INDEX_FIXES = [
    ('the old project folder (/home/user/dino-strength-sim)', 'the repository at /home/user/rex-strength-lab'),
    ('plus JSON and text results up to 100 KB in mass/ and bcdata/. ', 'plus the compiled research topics (researchC/compiled/), the merge records (mergeC/), the fix scripts\' records (fixC1/) and the pull request drafts. '),
    ('Copies of project code are earlier states of engine.js, data.js and the tests, kept for diffing (the patched engine variants in audit/, '
     'the catch-base and src-before-armduo baselines, backup/ and old/ trees). The released versions are in the repository.',
     'Copies of project code are the reviewers\' snapshots and clones of the repository and their mutated copies of the lab\'s files '
     '(one line changed, to see whether a test catches it). The released versions are in the repository.'),
]


def copy_scratchpad(out, scratch, scripts):
    stats = _copy_scratchpad(out, scratch, scripts)
    p = os.path.join(out, 'scratchpad', 'INDEX.md')
    if stats and os.path.exists(p):
        txt = open(p, encoding='utf-8').read()
        for a, b in INDEX_FIXES:
            assert txt.count(a) == 1, a
            txt = txt.replace(a, b)
        open(p, 'w', encoding='utf-8').write(txt)
    return stats


B.copy_scratchpad = copy_scratchpad


def write_readme(out, events, starts, phase_lines, counts, compactions, scratch_stats, missing):
    hs = B.human_events(events)
    first, last = events[0]['ts'], max(e['ts'] for e in events if e['ts'])
    commits = [e for e in events if e['kind'] == 'commit']
    wakes = [e for e in events if e['kind'] == 'wakeup' and e['tool'] == 'task-notification']
    wf_calls = [e for e in events if e['kind'] == 'tool_call' and e['tool'] == 'Workflow']
    L = ['# Session history: Rex lab page brief (BRIEF-gui.md, pull requests A, B and C)', '',
         'A transcript of the Claude Code session that built `rex-strength-lab/BRIEF-gui.md` into the Rex Super-Strength Lab in three pull requests: '
         'A, the page organisation (#20); B, the four default powers (#22); C, the energy comparisons on a researched ladder (#23). It is for readers who cannot open the session. '
         f'It runs from {B.ts_fmt(first)} to {B.ts_fmt(last)} and was rebuilt from the raw session logs on disk, not from memory, '
         'with the same tool and format as the earlier histories in the parent folder.', '',
         '## Files', '',
         '- [prompts.md](prompts.md): the owner’s prompts only, numbered, verbatim, with timestamps. Start here.',
         '- [transcript.md](transcript.md): the full readable transcript, split into one file per phase under [transcript/](transcript/).',
         '- [transcript.jsonl](transcript.jsonl): one JSON object per event: `{seq, ts, kind, phase, text, tool, args, agent_description, commit}`; `kind` is one of user, assistant, tool_call, subagent, compaction, commit, wakeup. Missing fields are null. '
         '`seq` follows the transcript order: each workflow’s subagents follow the call that launched it, and a subagent’s `ts` is its own start time, so `ts` is not strictly increasing. '
         'For a subagent, `text` is the short account of its result and `args.prompt` the full prompt.',
         '- [scratchpad/](scratchpad/INDEX.md): the working scripts, the compiled research and the merge records, with an index.',
         '- [../tools/build_history_gui.py](../tools/build_history_gui.py): the script that builds this folder (it reuses ../tools/build_history.py).', '',
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
    L += ['', 'They were made on branches `claude/rex-gui-a`, `claude/rex-gui-b` and `claude/rex-gui-c`, merged by the owner as pull requests #20, #22 and #23. The commit that adds this history folder, on `claude/rex-gui-history`, and anything after it, is not in the transcript.', '',
          '## Context compactions', '']
    for c in compactions:
        L.append(f'- {B.ts_fmt(c["ts"])}: the context was replaced by a written summary (shown collapsed in the transcript at that point). The raw log keeps everything before it, so nothing in this history depends on the summaries.')
    L += ['', '## How the run went', '',
          'The owner asked for the three pull requests one at a time: open each when done and tested, stop, wait for the merge, then republish the live page and start the next. '
          'Between prompts the session ran unattended. It was re-invoked each time a background job finished (a workflow, a test run, or a wait on one); those notifications are marked “Woken” in the transcript, with what it led to. '
          'After each pull request opened, GitHub events (CI results, the merge) reached the session as queued notifications, read with the ReadNotifications tool (shown as tool calls), '
          'and it armed one-off safety-net check-ins with `send_later` while a pull request waited on CI. '
          'This container ran at most two workflow agents at a time, so C\'s research and reviews were split into parallel workflow runs.', '',
          '## What could not be recovered, and what was left out on purpose', '',
          f'- Nothing had to be reconstructed: the raw main log and all {len(set(e["_wf"] for e in events if e.get("_wf")))} workflow folders were on disk, including everything before each compaction.',
          '- Tool results are omitted, except errors (first 3 lines). Claude’s private reasoning, the system prompt and harness reminders are not included.',
          '- Subagent prompts are shown as the workflow script computed them. Several review workflows ran from a script file in the scratchpad that was edited between rounds (the decisions and the prior findings passed to each round); the history reads its last version, so an early round\'s prompt may show text added later. The scripts\' arguments in the transcript give each round, and its records in `rex-strength-lab/research/reviews/` hold what each round found.',
          '- Each subagent’s result is summarised in up to three lines; the full results are in `rex-strength-lab/research/reviews/` (the review rounds and the research record).',
          '- Image data is not included.',
          (f'- Scratchpad: {scratch_stats[0]} scripts and small result files were copied; {scratch_stats[1]} other files (reviewers\' copies of the repository, downloads, renders, binaries and large files) are listed by folder and type instead (see scratchpad/INDEX.md).'
           if scratch_stats else '- Scratchpad: not regenerated in this run (the session scratchpad was not found).'),
          '- Redaction: tokens, keys, cookies, signed URLs, personal email addresses and the name part of those addresses are replaced with [redacted]. '
          + (f'This run replaced {sum(B.REDACT_COUNT.values())} item(s) ({", ".join(f"{k}: {v}" for k, v in B.REDACT_COUNT.items())}).' if B.REDACT_COUNT else 'This run found none to replace in the included text.'), '',
          '## How to regenerate', '',
          'The inputs exist only inside the session’s container: the raw main log (`~/.claude/projects/-home-user-rex-strength-lab/' + SID + '.jsonl`), the workflow folders beside it, '
          'the workflow scripts (`~/.claude/projects/*/' + SID + '/workflows/scripts/`) and the session scratchpad (`' + SCRATCH + '`). With them present, from the repository root:', '',
          '```', 'python3 history/tools/build_history_gui.py', '```', '']
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
        if SESSION_URL not in body or subj.startswith('History:'):
            continue
        t = B.parse_ts(ts)
        rows.append({'hash': h[:7], 'ts': t.astimezone(B.dt.timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.000Z'), 'subject': subj})
    return rows


SESSION_URL = 'https://claude.ai/code/session_01Uj6G3iasxRWVsuqr1BAzrS'
B.git_commits = git_commits

if __name__ == '__main__':
    here = os.path.dirname(os.path.abspath(__file__))
    defaults = {
        '--log': os.path.join(PROJ, SID + '.jsonl'),
        '--subagents': os.path.join(PROJ, SID, 'subagents/workflows'),
        '--scripts': os.path.join(B.HOME, '.claude/projects/*', SID, 'workflows/scripts/*.js'),
        '--scratchpad': SCRATCH,
        '--out': os.path.join(os.path.dirname(here), '2026-10-12-rex-gui'),
        '--since': '2026-10-12T00:00:00Z',
        '--until': '2026-10-14T23:59:59Z',
    }
    for k, v in defaults.items():
        if k not in sys.argv:
            sys.argv += [k, v]
    B.main()
