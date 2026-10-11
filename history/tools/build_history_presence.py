#!/usr/bin/env python3
"""Build the history entry for the Rex lab presence session (11 Oct 2026): BRIEF-presence.md built.

Same method and output as build_history.py, which built the first session's history: this script
imports it and only swaps the session-specific settings (session id, log paths, phases, scratchpad
folders, README wording).

Reads (inside the session's container):
  - the main session log  ~/.claude/projects/-home-user-rex-strength-lab/<SID>.jsonl
  - the workflow subagent logs beside it
  - the workflow scripts  ~/.claude/projects/*/<SID>/workflows/scripts/*.js
  - git history of this repository (for the commits)
  - the session scratchpad (only to copy working scripts)

Writes history/2026-10-11-rex-presence/: README.md, prompts.md, transcript.md
(+ transcript/NN-*.md), transcript.jsonl, scratchpad/.

Run from the repository root:
  python3 history/tools/build_history_presence.py
"""
import collections
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build_history as B  # noqa: E402

SID = 'ba090f8f-9962-5883-b4ec-f77afa579575'
PROJ = os.path.join(B.HOME, '.claude/projects/-home-user-rex-strength-lab')
B.SID = SID
B.LODGE_HASH = {}
B.IMAGE_ASSETS = {}

# Phases: (slug, title, how the phase starts, one-paragraph description for the README).
B.PHASES = [
    ('01-request-research-build', 'The request, the research and the first build', ('start',),
     'The owner asked for BRIEF-presence.md to be built and went to bed. rex-strength-lab/ was claimed in STATUS.md, three research workflows were launched (seven topics: step, attenuation, elephant, thresholds, ripple, comic, growth; each topic checked by a skeptic), and while they ran the engine got effort (the strength used for a push), the restraint solver (goals, hazards, courtesy ceiling, presets), the comic switches, the absorption and growth modes, the two-player effort and a Walk tab on a provisional step model, with an all-out test that compares every move against the engine on main.'),
    ('02-research-compiled', 'Research compiled and the models rebuilt on it', ('workflow', 'rex-presence-compile'),
     'Compile workflows applied each verifier\'s corrections and wrote the final facts (267 in research/final-presence.json). The Walk tab was rebuilt on the elastic-ground pulse model (Lamb\'s problem) checked against the Pisa drop test, with the verified thresholds, the elephant comparison, a 1 g footing cap and footprints re-anchored to an elephant print; the growth modes were rebuilt on the verified limits; a 7,776-case sweep found no broken output.'),
    ('03-review-round-1', 'Review round 1 and its fixes', ('workflow', 'rex-presence-review'),
     'Review round 1: five lenses (physics, claims, data, UX, code), each finding reproduced or refuted by a skeptic. 78 findings, 77 confirmed. The fixes: least disruptive never above the courtesy ceiling, a compact readout after the verdict, background searches that stop when a move saturates (two page freezes of 53 s and 91 s), the water glass judged on side-to-side shaking, a passenger hazard, a soil rule, soft landing that keeps its force, the Stomp and Walk tabs sharing the measured drill stamp, clay footprints and mired walkers, the instant-growth launch capped by the ground, subsonic punches as thumps, stronger tests. A context compaction happened during this phase.'),
    ('04-review-round-2', 'Review round 2, the first publish and the pull request', ('after_commit', 'Rex lab: review round 1 fixes (physics and claims lenses)'),
     'The round 1 build was published to the live page (its version 6), main merged in, and pull request #11 opened. Review round 2 checked every round 1 fix: 68 findings, all confirmed. Among them, the round 1 saturation stop could end a search on a plateau that was not the top (goals and hazards reported as never when all-out reached them). Fixes and guard tests followed (313 checks), and the page was republished (version 7).'),
    ('05-review-round-3', 'Review round 3, the last publish and this history', ('after_commit', 'Rex lab: review round 2 fixes (code lens)'),
     'Review round 3 looked for regressions from round 2.'),
]

B.DIRS = collections.OrderedDict([
    ('research', 'The research agents\' scripts (by topic). Downloads (papers, standards, pages) are listed, not copied.'),
    ('compile_att', 'Compile agent for the attenuation topic: fit and check scripts.'),
    ('compile_elephant', 'Compile agent for the elephant topic: checks.'),
    ('compile_ripple', 'Compile agent for the ripple topic: checks.'),
    ('compile_thresholds', 'Compile agent for the thresholds topic: checks.'),
    ('compile_comic', 'Compile agent for the comic topic: checks.'),
    ('compile-growth', 'Compile agent for the growth topic: checks.'),
    ('compiled', 'The compiled topic files that research/merge_presence.py merged into research/final-presence.json.'),
    ('review1', 'Review round 1: the reviewers\' and verifiers\' repro scripts.'),
    ('review2', 'Review round 2: the reviewers\' and verifiers\' repro scripts.'),
    ('review3', 'Review round 3, if run: the reviewers\' and verifiers\' repro scripts.'),
    ('dev', 'Development helpers: bays.js renders any tab in any state with Playwright; compile-wf.js and review-wf.js are the compile and review workflow scripts; dump_research.py extracts workflow results.'),
    ('wfout', 'Each research and verifier agent\'s structured result, extracted from the logs (research_*.json, verify_*.json and readable *.txt).'),
])
B.EXTRA_FILES = ['compile_step.py', 'step_gaps.txt', 'sweep1.txt']
B.SNAPSHOT_DIRS = ()
_load = B.load_workflow_scripts


def load_workflow_scripts(pattern):
    """The research workflow's script was persisted by the harness; the compile and review workflows ran
    from files in the scratchpad's dev/ folder, so read those too."""
    scripts = _load(pattern)
    scripts.update(_load(f'/tmp/claude-0/-home-user-rex-strength-lab/{SID}/scratchpad/dev/*-wf.js'))
    return scripts


B.load_workflow_scripts = load_workflow_scripts
_skip = B.skip_reason


REPO_COPY_RE = re.compile(r'(^|/)(history|build-comparison|build-calculator|rex-strength-lab|\.github)/')
# Paths of the Rex lab's own files (e.g. test/presence.js, build-data.py): reviewers copied the
# project into their folders, often with one line mutated, to test whether the tests catch it.
_LAB = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'rex-strength-lab')
LAB_FILES = {os.path.relpath(os.path.join(r, f), _LAB).replace(os.sep, '/')
             for r, ds, fs in os.walk(_LAB) if 'node_modules' not in r for f in fs}


def skip_reason(top, rel, size, ext, head=''):
    """Like the first session's rule, plus: keep the extracted workflow results (JSON) in wfout/,
    and list (do not copy) the reviewers' snapshots and mutated copies of the repository."""
    if top == 'wfout' and ext in ('.json', '.txt') and size <= 400_000:
        return None
    if top.startswith('review') and (REPO_COPY_RE.search(rel) or any(rel.endswith('/' + p) for p in LAB_FILES)):
        return 'copy of project code'
    if re.search(r'(^|/)dl/', rel):
        return 'raw download'
    return _skip(top, rel, size, ext, head)


B.skip_reason = skip_reason
_copy_scratchpad = B.copy_scratchpad

# The index's fixed text was written for the first session; say what is true of this one.
INDEX_FIXES = [
    ('the old project folder (/home/user/dino-strength-sim)', 'the repository at /home/user/rex-strength-lab'),
    ('plus JSON and text results up to 100 KB in mass/ and bcdata/. ', 'plus the workflows\' extracted results (JSON and text up to 400 KB) in wfout/. '),
    ('Copies of project code are earlier states of engine.js, data.js and the tests, kept for diffing (the patched engine variants in audit/, '
     'the catch-base and src-before-armduo baselines, backup/ and old/ trees). The released versions are in the repository.',
     'Copies of project code are the reviewers\' snapshots of the repository and their mutated copies of the lab\'s files '
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
    L = ['# Session history: Rex lab presence build', '',
         'A transcript of the Claude Code session that built `rex-strength-lab/BRIEF-presence.md` into the Rex Super-Strength Lab (effort and the courtesy ceiling, not-so-heroic presets, the Walk tab, comic switches, absorption and growth), for readers who cannot open the session. '
         f'It runs from {B.ts_fmt(first)} to {B.ts_fmt(last)} and was rebuilt from the raw session logs on disk, not from memory, '
         'with the same tool and format as the first session\'s history in the parent folder.', '',
         '## Files', '',
         '- [prompts.md](prompts.md): the owner’s prompts only, numbered, verbatim, with timestamps. Start here.',
         '- [transcript.md](transcript.md): the full readable transcript, split into one file per phase under [transcript/](transcript/).',
         '- [transcript.jsonl](transcript.jsonl): one JSON object per event: `{seq, ts, kind, phase, text, tool, args, agent_description, commit}`; `kind` is one of user, assistant, tool_call, subagent, compaction, commit, wakeup. Missing fields are null. '
         '`seq` follows the transcript order: each workflow’s subagents follow the call that launched it, and a subagent’s `ts` is its own start time, so `ts` is not strictly increasing. '
         'For a subagent, `text` is the short account of its result and `args.prompt` the full prompt.',
         '- [scratchpad/](scratchpad/INDEX.md): the working scripts and the workflows\' extracted results, with an index.',
         '- [../tools/build_history_presence.py](../tools/build_history_presence.py): the script that builds this folder (it reuses ../tools/build_history.py).', '',
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
    L += ['', 'All were made on branch `claude/rex-presence` and go to `main` through pull request #11. The commit that adds this history folder, and anything after it, is not in the transcript.', '',
          '## Context compactions', '']
    for c in compactions:
        L.append(f'- {B.ts_fmt(c["ts"])}: the context was replaced by a written summary (shown collapsed in the transcript at that point). The raw log keeps everything before it, so nothing in this history depends on the summaries.')
    L += ['', '## Overnight work', '',
          'The owner\'s one prompt ends “I\'m going to bed, so get as far as you can.” The whole session ran unattended. '
          'The session was re-invoked each time a background job finished (a workflow or a wait on one); those notifications are marked “Woken” in the transcript, with what it led to. '
          'After the pull request opened, GitHub CI results also reached the session as queued notifications, read with the ReadNotifications tool (shown as tool calls), '
          'and the session armed one-off safety-net check-ins with `send_later` while the pull request waited on CI.', '',
          '## What could not be recovered, and what was left out on purpose', '',
          f'- Nothing had to be reconstructed: the raw main log and all {len(set(e["_wf"] for e in events if e.get("_wf")))} workflow folders were on disk, including everything before each compaction.',
          '- Tool results are omitted, except errors (first 3 lines). Claude’s private reasoning, the system prompt and harness reminders are not included.',
          '- Subagent prompts are shown as the workflow script computed them. Each subagent’s result is summarised in up to three lines; the full results are in scratchpad/wfout/ and, for the research and reviews, in `rex-strength-lab/research/`.',
          '- Image data is not included.',
          (f'- Scratchpad: {scratch_stats[0]} scripts and small result files were copied; {scratch_stats[1]} other files (downloads, renders, binaries and large files) are listed by folder and type instead (see scratchpad/INDEX.md).'
           if scratch_stats else '- Scratchpad: not regenerated in this run (the session scratchpad was not found).'),
          '- Redaction: tokens, keys, cookies, signed URLs, personal email addresses and the name part of those addresses are replaced with [redacted]. '
          + (f'This run replaced {sum(B.REDACT_COUNT.values())} item(s) ({", ".join(f"{k}: {v}" for k, v in B.REDACT_COUNT.items())}).' if B.REDACT_COUNT else 'This run found none to replace in the included text.'), '',
          '## How to regenerate', '',
          'The inputs exist only inside the session’s container: the raw main log (`~/.claude/projects/-home-user-rex-strength-lab/' + SID + '.jsonl`), the workflow folders beside it, '
          'the workflow scripts (`~/.claude/projects/*/' + SID + '/workflows/scripts/`) and the session scratchpad (`/tmp/claude-0/-home-user-rex-strength-lab/' + SID + '/scratchpad`). With them present, from the repository root:', '',
          '```', 'python3 history/tools/build_history_presence.py', '```', '']
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


SESSION_URL = 'https://claude.ai/code/session_013ezjiS1ju8ZAZEyemr7VDs'
B.git_commits = git_commits

if __name__ == '__main__':
    here = os.path.dirname(os.path.abspath(__file__))
    defaults = {
        '--log': os.path.join(PROJ, SID + '.jsonl'),
        '--subagents': os.path.join(PROJ, SID, 'subagents/workflows'),
        '--scripts': os.path.join(B.HOME, '.claude/projects/*', SID, 'workflows/scripts/*.js'),
        '--scratchpad': f'/tmp/claude-0/-home-user-rex-strength-lab/{SID}/scratchpad',
        '--out': os.path.join(os.path.dirname(here), '2026-10-11-rex-presence'),
        '--since': '2026-10-11T17:00:00Z',
        '--until': '2026-10-12T23:59:59Z',
    }
    for k, v in defaults.items():
        if k not in sys.argv:
            sys.argv += [k, v]
    B.main()
