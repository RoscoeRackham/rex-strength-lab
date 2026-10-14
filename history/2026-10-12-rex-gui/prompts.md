# User prompts

Every message the owner typed in this session, verbatim, in order (4 prompts). Times are UTC: the time the message was typed, and, when it waited in the queue while Claude was working, when it was delivered. Attached images are listed by their upload file name and what they became in this repository; image data is not included.

## 1. 2026-10-12 04:06:57 UTC

```text
Read CLAUDE.md, then STATUS.md, then rex-strength-lab/BRIEF-gui.md. Start from a fresh main.

Task: build BRIEF-gui.md, in the three pull requests its "Order of work" gives:
  A. Page organisation (sections 1–4). Page only; no engine change.
  B. The four new powers (section 5). Engine and page.
  C. More points of comparison for energy (section 6). Research first.
All the canon the brief relies on is confirmed and recorded in CLAUDE.md; nothing in it waits on a decision.

How to work:
- Claim rex-strength-lab/ in STATUS.md (and any other files you'll touch), on your own claude/... branch. Release the claim when you finish.
- Follow the house pattern in CLAUDE.md: every number sourced or labelled an estimate; tests for each change; the full Rex lab build line from CLAUDE.md passing; README and known limits updated; adversarial review rounds with every finding reproduced in code before it counts, and the records in rex-strength-lab/research/reviews/.
- Keep to the brief's rules: in A the engine is untouched and every existing test passes unchanged. In B, with all four powers off (5a at 0%), every engine result matches today's exactly (calibration, presence, the all-out baseline, the sweep). Saved pages still load, with retired settings migrated as each section says.
- Section 6 needs the full research process (a researcher, then a skeptic who fetches every source), run the way the presence research was (history/scratchpad/workflows/). The candidate references in the brief are unverified starting points.
- Where the brief is unclear, or the code doesn't match what it describes, check the code, decide, and note the decision in the pull request. Ask me only about canon.
- One pull request at a time. Open A when it's done and tested, then stop and tell me. I'll merge it and tell you to start B. Then the same for C. Let CI finish before I merge.
- After each merge, rebuild and republish the live Rex lab page to its existing URL (listed in the root README).
- Update STATUS.md before every push. This is a long run, so finish with a history/ entry built the same way as the existing ones.
```

## 2. 2026-10-12 16:24:04 UTC

```text
Start B
```

- In reply to Claude’s message of 2026-10-12 15:31:19 UTC, which ended: “I haven't set another check-in. **What I need from you:** say "start B" and I'll begin the four new powers.”

## 3. 2026-10-13 15:38:07 UTC

```text
Start part C
```

- In reply to Claude’s message of 2026-10-13 09:45:00 UTC, which ended: “Otherwise I'll wait for your word. After you merge I'll rebuild and republish the live page, then start C with the research step.”

## 4. 2026-10-13 19:53:51 UTC

```text
Merged. Proceed
```

- In reply to Claude’s message of 2026-10-13 19:53:51 UTC, which ended: “PR #23 is merged. Cancelling the check-in, then rebuilding from a fresh `main`, testing and republishing the live page.”
