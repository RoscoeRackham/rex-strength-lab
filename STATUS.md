# Status

Who is working on what. Update it before every push (see "Two people, two accounts" in CLAUDE.md). Newest entries at the top of each section.

## Claimed

| Folder or file | Who | Branch | Since |
|---|---|---|---|
| `build-comparison/` | Owner (cloud), Step 1 | not started | |
| `build-calculator/data/builds.json`, `build-calculator/src/calc.js` | Owner (cloud), for Build Comparison Step 1 | not started | |

## In progress

- Build Comparison Step 1: the brief is final (`build-comparison/BRIEF.md`: decisions, silhouettes, measuring tool, model-sheet spec, two steps). Next: the owner starts a fresh cloud session with the prompt in the PR that updated the brief.

## Waiting on

- Art (collaborator): A-pose turnarounds of Rex and Ollie (front, side, back) to the model-sheet spec in BRIEF.md. Attach to the Step 1 prompt if ready; otherwise they wait for Step 2.
- Step 2 (collaborator, after Step 1 merges): measure the turnarounds; make gap-filler figures from target outlines with GPT Images 2.5.

## Done

- 2026-10-11: Build Comparison decisions: men only; Rex and Ollie at 7.5% body fat (5–10%); Rex's tail excluded from his score; scale up to the "meatball" (about 924); gaps left empty for measured art; a two-step plan.
- 2026-10-11: doc fixes (`claude/fix-doc-nits`): CLAUDE.md's build commands now run one after the other from the repo root; BRIEF.md no longer points at the `session-transcript` branch for `history/scratchpad/mass/`, which is on `main`.
- 2026-10-11: collaboration setup (`CLAUDE.md`, `STATUS.md`, CI, Windows build fixes, session history merged).
