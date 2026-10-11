# Status

Who is working on what. Update it before every push (see "Two people, two accounts" in CLAUDE.md). Newest entries at the top of each section.

## Claimed

| Folder or file | Who | Branch | Since |
|---|---|---|---|
| `build-comparison/` | Owner (cloud), Step 1 | `claude/hopeful-keller-vly1s9` | 2026-10-11 |
| `build-calculator/data/builds.json`, `build-calculator/src/calc.js` | Owner (cloud), for Build Comparison Step 1 | `claude/hopeful-keller-vly1s9` | 2026-10-11 |

## In progress

- Build Comparison Step 1 (cloud session, branch `claude/hopeful-keller-vly1s9`, started 2026-10-11). Also claims root `README.md` (one row for the new page), one build line in `CLAUDE.md`, `.github/workflows/test.yml` (build and test steps for the new project) and a new `history/` entry for this session (`history/2026-10-11-build-comparison-step1/`, built by `history/tools/build_history_step1.py`).
  - Done: research (six topics, each verified), design (three proposals, two judges, one spec: `build-comparison/research/reviews/design.md`), the page, the measuring tool (validated on duo.jpg), functional limits, tests (`test/test.js`, `test/duo.js`, `test/shots.js`), README and `data/NOTES.md`.
  - Done: review round 1 (five lenses, each finding reproduced or refuted by a skeptic): 76 findings, 69 confirmed, all fixed or partly fixed with the reason stated in `build-comparison/research/reviews/round1.md`. 43 research corrections now applied (`research/corrections.json`). CI now also regenerates `build-comparison/data/facts.json` and fails if it differs.
  - Done: review round 2 (every round 1 fix re-checked, plus regressions): 40 findings, all confirmed, all fixed or partly fixed as listed in `build-comparison/research/reviews/round2.md`. Main change: the page's own figures are scored as drawn (head and body by the measuring tool, arms as round limbs), after the tool was found to lose arms held far out. Still open for Step 2: the tool cannot follow arms that cannot hang clear of the body.
  - Published (private): https://claude.ai/artifact/DBtZrixDeZnvRwDhZMsCDn, republished with the round 2 fixes. Pull request: https://github.com/RoscoeRackham/rex-strength-lab/pull/5 (not merged).
  - In progress: the `history/` entry for this session.
  - `build-calculator/data/builds.json`: two changes to the Kouri 1995 non-users build (Table 1 of the full paper; renamed "Men who never used steroids", as 18 of the 74 were trial volunteers), logged in its NOTES.md; Build Calculator rebuilt and tested. `src/calc.js` is unchanged.

## Waiting on

- Owner review of Build Comparison design decisions listed in `build-comparison/data/NOTES.md` ("Design decisions to review"): the edge marking, the brief's meatball sentence (false as geometry), the palette change, the stop edges, Thor's and the Thing's treatment, the group colours' contrast, and figures drawn with their arms at their rest angle.

- Step 2 (collaborator, after Step 1 merges): regenerate Rex's and Ollie's turnarounds to the model-sheet spec (fixes listed in BRIEF.md, "The turnarounds") and measure them; make gap-filler figures from target outlines with GPT Images 2.5.

## Done

- 2026-10-11: Rex and Ollie A-pose turnarounds added (`build-comparison/assets/`) for Step 1's style key and outlines; Ollie's tail excluded from his score, like Rex's.
- 2026-10-11: Build Comparison decisions: men only; Rex and Ollie at 7.5% body fat (5–10%); Rex's tail excluded from his score; scores use height to the top of the skull; scale up to the "meatball" (about 924); gaps left empty for measured art; a two-step plan.
- 2026-10-11: doc fixes (`claude/fix-doc-nits`): CLAUDE.md's build commands now run one after the other from the repo root; BRIEF.md no longer points at the `session-transcript` branch for `history/scratchpad/mass/`, which is on `main`.
- 2026-10-11: collaboration setup (`CLAUDE.md`, `STATUS.md`, CI, Windows build fixes, session history merged).
