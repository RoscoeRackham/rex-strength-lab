# Status

Who is working on what. Update it before every push (see "Two people, two accounts" in CLAUDE.md). Newest entries at the top of each section.

## Claimed

| Folder or file | Who | Branch | Since |
|---|---|---|---|
| `build-comparison/` | Owner (cloud), Step 1 | `claude/hopeful-keller-vly1s9` | 2026-10-11 |
| `build-calculator/data/builds.json`, `build-calculator/src/calc.js` | Owner (cloud), for Build Comparison Step 1 | `claude/hopeful-keller-vly1s9` | 2026-10-11 |

## In progress

- Build Comparison Step 1 (cloud session, branch `claude/hopeful-keller-vly1s9`, started 2026-10-11). Also claims root `README.md` (one row for the new page), `.github/workflows/test.yml` (build and test steps for the new project) and a new `history/` entry for this session.
  - Done: research (six topics, each verified; 26 corrections applied), design (three proposals, two judges, one spec: `build-comparison/research/reviews/design.md`), the page, the measuring tool (validated on duo.jpg), functional limits, tests (`test/test.js`, `test/duo.js`, `test/shots.js`), README and `data/NOTES.md`.
  - In progress: adversarial review rounds and fixes; then publish as a new Artifact, open the pull request, and write the `history/` entry.
  - `build-calculator/data/builds.json` and `src/calc.js` are claimed but have not been changed.

## Waiting on

- Owner review of Build Comparison design decisions listed in `build-comparison/data/NOTES.md` ("Design decisions to review"): the edge marking, the brief's meatball sentence (false as geometry), the palette change, the stop edges, and Thor's treatment.

- Step 2 (collaborator, after Step 1 merges): regenerate Rex's and Ollie's turnarounds to the model-sheet spec (fixes listed in BRIEF.md, "The turnarounds") and measure them; make gap-filler figures from target outlines with GPT Images 2.5.

## Done

- 2026-10-11: Rex and Ollie A-pose turnarounds added (`build-comparison/assets/`) for Step 1's style key and outlines; Ollie's tail excluded from his score, like Rex's.
- 2026-10-11: Build Comparison decisions: men only; Rex and Ollie at 7.5% body fat (5–10%); Rex's tail excluded from his score; scores use height to the top of the skull; scale up to the "meatball" (about 924); gaps left empty for measured art; a two-step plan.
- 2026-10-11: doc fixes (`claude/fix-doc-nits`): CLAUDE.md's build commands now run one after the other from the repo root; BRIEF.md no longer points at the `session-transcript` branch for `history/scratchpad/mass/`, which is on `main`.
- 2026-10-11: collaboration setup (`CLAUDE.md`, `STATUS.md`, CI, Windows build fixes, session history merged).
