# Status

Who is working on what. Update it before every push (see "Two people, two accounts" in CLAUDE.md). Newest entries at the top of each section.

## Claimed

| Folder or file | Who | Branch | Since |
|---|---|---|---|
| `build-comparison/` (Step 2: the measuring tool, the exporter, the duo's measurements, gap-filler figures), `build-calculator/data/builds.json` and `src/calc.js` (for the duo's measured girths and the new figures) | Collaborator | `terantic/step2` | 2026-10-11 |

## In progress

- Build Comparison Step 2 (collaborator, `terantic/step2`): the working checklist is `build-comparison/STEP2.md`. Decisions: art drawn over canon-volume control outlines; gap fillers are featureless bodies; targets 50, 56, 100, 125, 150, 280, 450, 700. First: the measuring-tool fixes (arms cut at the shoulder, tails, armless side view, skull mark, masks).

## Waiting on

- Owners (canon questions from the presence build; the page labels both as open):
  - Instant growth: does he grow from his soles (then the push that lifts his middle would throw him into the air unless he is bolted down) or about his middle (then his feet are driven into the ground)? The page assumes the soles.
  - Runaway growth: are the side effects of growth (air pushed back, his own gravity) paid from the energy they absorbed or from the endless store? Only the first makes the runaway loop add anything; the page shows the loop ratio either way.
  - Rex's and Ollie's gait (heel-first, like people, is assumed) and hip height (0.45 of height, measured from the turnarounds) are not canon.
- Owner: the Weight tab's sinking rule for standing overpredicts a measured elephant footprint about tenfold (found by the presence research); left unchanged, decide whether to revise it.
- Owner review of Build Comparison design decisions listed in `build-comparison/data/NOTES.md` ("Design decisions to review"): the edge marking, the palette change, the stop edges, Thor's and the Thing's treatment, the group colours' contrast, and figures drawn with their arms at their rest angle. (The meatball sentence is now reworded in the brief.)
- Collaborator: Step 2 art (the duo, version 2, and the featureless gap fillers), once the tool fixes land; see `build-comparison/STEP2.md`.

## Done

- 2026-10-12: Rex lab presence build finished (pull request #12, `claude/rex-presence`): review round 2 code fixes and round 3 (60 findings, 59 confirmed, all fixed or partly fixed), live page version 8, and the session history (`history/2026-10-11-rex-presence/`).
- 2026-10-11: Rex lab presence build merged (pull request #11 at `b1916a8`, merged by the collaborator): effort and the courtesy ceiling, not-so-heroic presets, the Walk tab, comic switches, absorption and growth, research (268 facts), review rounds 1 and 2.
- 2026-10-11: all three live pages republished from `main` (`43cf5e6`, after pull requests #8 and #9): Rex lab version 5, Build Calculator version 3, Build Comparison version 4. Each was built from a clean checkout of `main` and passed its tests first.
- 2026-10-11: presence brief merged (pull request #9, collaborator, `terantic/presence-brief`, including `terantic/grip`): a "Hands and grip" assumption card in the Rex lab; new canon on restraint, absorption (four modes) and growth (three forms); `rex-strength-lab/BRIEF-presence.md`; `build-comparison/BRIEF.md` brought up to date; `compile_facts.py` writes LF line endings; the Rex lab sweep covers the default 10 ft Rex and Ollie; and a record of the session in `history/2026-10-11-collaborator-canon-and-planning.md`.
- 2026-10-11: Canon mass correction merged (pull request #8, `terantic/duo-mass`): Rex 2,700 kg of body + 307 kg tail = 3,007 kg; Ollie the same 3,007 kg in all. Density 1,060 kg/m³, so 2.84 m³ each. All three projects updated and tested.
- 2026-10-11: Build Comparison Step 1 merged (pull requests #5 and #6; cloud session, branch `claude/hopeful-keller-vly1s9`). Research (six topics, each verified; 43 corrections), design (three proposals, two judges, one spec), the page, the measuring tool (validated on duo.jpg), functional limits, tests, two adversarial review rounds (76 and 40 findings; records in `build-comparison/research/reviews/`), and the session history (`history/2026-10-11-build-comparison-step1/`). Live: https://claude.ai/artifact/DBtZrixDeZnvRwDhZMsCDn (version 3 then).
- 2026-10-11: Build Calculator republished (version 2): the Kouri 1995 non-users build now uses Table 1 of the full paper and is named "Men who never used steroids" (18 of the 74 were trial volunteers).
- 2026-10-11: Rex and Ollie A-pose turnarounds added (`build-comparison/assets/`) for Step 1's style key and outlines; Ollie's tail excluded from his score, like Rex's.
- 2026-10-11: Build Comparison decisions: men only; Rex and Ollie at 7.5% body fat (5–10%); Rex's tail excluded from his score; scores use height to the top of the skull; scale up to the "meatball" (about 924); gaps left empty for measured art; a two-step plan.
- 2026-10-11: doc fixes (`claude/fix-doc-nits`): CLAUDE.md's build commands now run one after the other from the repo root; BRIEF.md no longer points at the `session-transcript` branch for `history/scratchpad/mass/`, which is on `main`.
- 2026-10-11: collaboration setup (`CLAUDE.md`, `STATUS.md`, CI, Windows build fixes, session history merged).
