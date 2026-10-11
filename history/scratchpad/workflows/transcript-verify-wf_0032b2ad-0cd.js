export const meta = {
  name: 'transcript-verify',
  description: 'Independently verify the session-history files against the raw logs: completeness, accuracy, redaction and readability',
  phases: [{ title: 'Verify', detail: 'two independent checkers' }],
}

const CTX = `CONTEXT
A script, /home/user/rex-strength-lab/history/tools/build_history.py, builds a transcript of a Claude Code session from its raw logs. Outputs are in /home/user/rex-strength-lab/history/: README.md, prompts.md, transcript.md (index) + transcript/NN-*.md (one per phase), transcript.jsonl, scratchpad/ (copied working scripts + INDEX.md).
Raw logs: main log /root/.claude/projects/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387.jsonl; workflow subagent logs under /root/.claude/projects/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/subagents/workflows/wf_*/ (journal.jsonl, agent-*.jsonl); workflow scripts under /root/.claude/projects/*/6435a7db-fe21-5f3b-bca9-e49ba2609387/workflows/scripts/. Git history: /home/user/rex-strength-lab (all branches) and /home/user/lodge-docs.
The owner's spec: every user message verbatim with timestamp; Claude's replies to the user in full; tool calls one line each (name + key arg); every subagent with description, full prompt verbatim and a 2-3 line result summary; compaction points marked; each git commit (hash + subject) placed in the timeline; wake-ups if any. Redact tokens, keys, cookies, signed URLs, personal email addresses and other personal data not already public in the repo (noreply@anthropic.com is public). JSONL fields exactly {seq, ts, kind, phase, text, tool, args, agent_description, commit}, missing = null.
RULES: Read-only. Do NOT edit or write any file under /home/user. You may write throwaway scripts only in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/verify/. The current phase (08-transcript) is still being written, so ignore events after 2026-10-11T00:14 except to check redaction. Report only concrete, reproducible problems, each with file, line or seq, and the evidence. Do not report style preferences.`

const SCHEMA = {
  type: 'object',
  properties: {
    checked: { type: 'array', items: { type: 'string' }, description: 'what you checked and how, one line each' },
    problems: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          severity: { type: 'string', enum: ['blocker', 'major', 'minor'] },
          where: { type: 'string' },
          problem: { type: 'string' },
          evidence: { type: 'string' },
          fix: { type: 'string' },
        },
        required: ['severity', 'where', 'problem', 'evidence', 'fix'],
      },
    },
  },
  required: ['checked', 'problems'],
}

phase('Verify')
const [a, b] = await parallel([
  () => agent(`${CTX}

YOUR JOB: completeness and accuracy against the raw logs. Write your own independent parser (do not import build_history.py) and check:
1. Every human-typed user message in the main log (exclude tool results, isMeta, isCompactSummary, task notifications, stop-hook feedback, sidechain) appears verbatim in prompts.md, in order, with the right timestamp. Note any image attachments and whether prompts.md lists them.
2. Every assistant text block in the main log appears in the transcript markdown (normalise whitespace; allow redaction). Count how many are missing, list up to 5.
3. Every subagent in every wf_* journal (started events) appears in transcript.jsonl as kind=subagent, and for a sample of 10 spread across workflows, the prompt in args.prompt matches the agent's first user message in its agent-*.jsonl (after stripping any harness wrapper) — report any truncation or alteration.
4. Compaction points (compact_boundary / isCompactSummary) are all marked, with correct timestamps.
5. Commits: every commit made during the session (lodge-docs branch claude/dinosaur-strength-physics-8o13ft and rex-strength-lab main) is present with correct hash, subject and position. Check the lodge-to-new hash mapping in README by subject.
6. Every Workflow / Agent tool call is present as a tool_call; tool_call count is plausible versus tool_use blocks in the main log (report the two numbers).
7. README counts and claims (prompts, subagents, commits, compactions, workflow launches, refused launches, stopped run) match what you computed.`, { label: 'verify:completeness', phase: 'Verify', schema: SCHEMA }),
  () => agent(`${CTX}

YOUR JOB: redaction, schema and readability.
1. Redaction: scan every file under /home/user/rex-strength-lab/history/ (including scratchpad/ and transcript.jsonl) for secrets and personal data: API keys and tokens (GitHub, Anthropic, AWS, JWTs, bearer values), cookies, signed URL parameters, URL credentials, any email address other than noreply@anthropic.com, the owner's email or any part of its local part (find the owner's address in the raw main log yourself; do not write it into your report — refer to it as "the owner's email"), phone numbers, street addresses, and session or proxy credentials (e.g. values of HTTPS_PROXY with credentials, Authorization headers). Report each hit with file and line, with the secret itself masked.
2. JSONL schema: every line parses; key set is exactly the 9 fields; kind in the allowed set; seq is 1..N; missing fields are null not absent or empty-string where a value is missing.
3. Markdown readability: for each transcript/NN-*.md and prompts.md, check code fences are balanced and nested fences cannot break (a fence inside verbatim text must use a longer fence), <details>/<summary> blocks are balanced and have the blank line needed for markdown inside, headings follow a sane order, and nothing renders as a giant unformatted wall. Sample several subagent blocks and Claude replies across phases and say whether a reader could follow them.
4. scratchpad/INDEX.md: does every copied file appear in it; do the specific files the owner named exist (bcdata/scripts/compile.py, facts_fix.py, girths.py; mass-estimate scripts in mass/; audit and final-verify scripts)? Are any large binaries copied that should have been listed instead? Total size of scratchpad.
5. README.md: links resolve to files that exist; regeneration instructions are correct (check the script's argparse).`, { label: 'verify:redaction-readability', phase: 'Verify', schema: SCHEMA }),
])
return { completeness: a, redaction: b }
