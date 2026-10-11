# Status

Who is working on what. Update it before every push (see "Two people, two accounts" in CLAUDE.md). Newest entries at the top of each section.

## Claimed

| Folder or file | Who | Branch | Since |
|---|---|---|---|
| `build-comparison/` (Step 2: the measuring tool, the exporter, the duo's measurements, gap-filler figures), `build-calculator/data/builds.json` and `src/calc.js` (for the duo's measured girths and the new figures) | Collaborator | `terantic/step2` | 2026-10-11 |

## In progress

- Build Comparison Step 2 (collaborator, `terantic/step2`): the working checklist is `build-comparison/STEP2.md`. Decisions: art drawn over canon-volume control outlines; gap fillers are featureless bodies; targets 50, 56, 100, 125, 150, 280, 450, 700. First: the measuring-tool fixes (arms cut at the shoulder, tails, armless side view, skull mark, masks).

## Waiting on

- Owner: build `rex-strength-lab/BRIEF-presence.md` in a fresh cloud session (claim `rex-strength-lab/` first).
- Owner: republish all three live pages from `main` (the mass correction changed all three).
- Owner review of Build Comparison design decisions listed in `build-comparison/data/NOTES.md` ("Design decisions to review"): the edge marking, the palette change, the stop edges, Thor's and the Thing's treatment, the group colours' contrast, and figures drawn with their arms at their rest angle. (The meatball sentence is now reworded in the brief.)
- Collaborator: Step 2 art (the duo, version 2, and the featureless gap fillers), once the tool fixes land; see `build-comparison/STEP2.md`.

## Done

- 2026-10-11: Restraint and presence planned (pull request #9, `terantic/presence-brief`): the grip card, new canon (restraint, absorption, growth), `rex-strength-lab/BRIEF-presence.md`, the extended sweep, and the session record.
- 2026-10-11: Canon mass correction merged (pull request #8, `terantic/duo-mass`): Rex 2,700 kg of body + 307 kg tail = 3,007 kg; Ollie the same 3,007 kg in all. Density 1,060 kg/m³, so 2.84 m³ each. All three projects updated and tested.
- 2026-10-11: Build Comparison Step 1 merged (pull requests #5 and #6; cloud session, branch `claude/hopeful-keller-vly1s9`). Research (six topics, each verified; 43 corrections), design (three proposals, two judges, one spec), the page, the measuring tool (validated on duo.jpg), functional limits, tests, two adversarial review rounds (76 and 40 findings; records in `build-comparison/research/reviews/`), and the session history (`history/2026-10-11-build-comparison-step1/`). Live: https://claude.ai/artifact/DBtZrixDeZnvRwDhZMsCDn (version 3, matches `main`).
- 2026-10-11: Build Calculator republished (version 2, matches `main`): the Kouri 1995 non-users build now uses Table 1 of the full paper and is named "Men who never used steroids" (18 of the 74 were trial volunteers).
- 2026-10-11: Rex and Ollie A-pose turnarounds added (`build-comparison/assets/`) for Step 1's style key and outlines; Ollie's tail excluded from his score, like Rex's.
- 2026-10-11: Build Comparison decisions: men only; Rex and Ollie at 7.5% body fat (5–10%); Rex's tail excluded from his score; scores use height to the top of the skull; scale up to the "meatball" (about 924); gaps left empty for measured art; a two-step plan.
- 2026-10-11: doc fixes (`claude/fix-doc-nits`): CLAUDE.md's build commands now run one after the other from the repo root; BRIEF.md no longer points at the `session-transcript` branch for `history/scratchpad/mass/`, which is on `main`.
- 2026-10-11: collaboration setup (`CLAUDE.md`, `STATUS.md`, CI, Windows build fixes, session history merged).
