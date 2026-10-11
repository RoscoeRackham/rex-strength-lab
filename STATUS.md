# Status

Who is working on what. Update it before every push (see "Two people, two accounts" in CLAUDE.md). Newest entries at the top of each section.

## Claimed

| Folder or file | Who | Branch | Since |
|---|---|---|---|
| `rex-strength-lab/` (all of it), root `README.md` (Rex lab row only), `.github/workflows/test.yml` (Rex lab steps only), `history/2026-10-11-rex-presence/` (new) | Owner (cloud session) | `claude/rex-presence` | 2026-10-11 |
| `CLAUDE.md` canon, `rex-strength-lab/src/static-data.js` (grip card), `rex-strength-lab/test/sweep.js` and `README.md`, `rex-strength-lab/BRIEF-presence.md`, `build-comparison/BRIEF.md`, `build-comparison/data/NOTES.md`, `build-comparison/tools/compile_facts.py`, `history/2026-10-11-collaborator-canon-and-planning.md` | Collaborator | `terantic/presence-brief` (includes `terantic/grip`) | 2026-10-11 |

## In progress

- Rex lab, restraint and presence (owner's cloud session, `claude/rex-presence`), building `rex-strength-lab/BRIEF-presence.md` in its order:
  - Research: seven topics, each checked by a skeptic (step forces, ground shaking, elephants, thresholds, the water glass, comic switches, growth). Done: 267 facts in `research/final-presence.json`.
  - Built (on the branch, not yet reviewed): effort and the courtesy ceiling on every solo tab, the not-so-heroic presets, shared effort in the two-player tests, the Walk tab (elastic-ground model checked against a drop test and elephant footfalls), the comic switches, the absorption modes and growth what-if, `test/presence.js`, `test/shots.js` in four views.
  - Review round 1 done: 78 findings, 77 confirmed by the skeptics; all fixed except one documented limit (a real-muscle jump's ground flicker at about 10⁸ kg, which can't change without changing all-out results). Record: `rex-strength-lab/research/reviews/presence-round1.json`. History builder ready (`history/tools/build_history_presence.py`).
  - Published the round 1 build to the live page (version 6). Review round 2 running; pull request open for review.
  - Next: round 2 fixes, republish, `history/` entry.
- Pull request #9 (collaborator, `terantic/presence-brief`), now merged:
  - a "Hands and grip" assumption card in the Rex lab
  - **new canon:** restraint, absorption (four modes) and growth (three forms)
  - `rex-strength-lab/BRIEF-presence.md`: complete, with no open questions, for the owner's cloud session to build
  - `build-comparison/BRIEF.md` brought up to date (scores after the mass ruling; the meatball sentence corrected)
  - `compile_facts.py` writes LF line endings on every machine
  - the Rex lab sweep (`test/sweep.js`) now also covers the default 10 ft Rex and Ollie (7,776 combinations)
  - a readable record of the session: `history/2026-10-11-collaborator-canon-and-planning.md`

## Waiting on

- Owners (canon questions from the presence build; the page labels both as open):
  - Instant growth: does he grow from his soles (then the push that lifts his middle would throw him into the air unless he is bolted down) or about his middle (then his feet are driven into the ground)? The page assumes the soles.
  - Runaway growth: are the side effects of growth (air pushed back, his own gravity) paid from the energy they absorbed or from the endless store? Only the first makes the runaway loop add anything; the page shows the loop ratio either way.
  - Rex's and Ollie's gait (heel-first, like people, is assumed) and hip height (0.45 of height, measured from the turnarounds) are not canon.
- Owner: the Weight tab's sinking rule for standing overpredicts a measured elephant footprint about tenfold (found by the presence research); left unchanged, decide whether to revise it.
- Owner: confirm the new canon (restraint, absorption, growth) in the pull request above, then build `BRIEF-presence.md` in a fresh cloud session.
- Owner: republish all three live pages from `main` (the mass correction changed all three).
- Owner review of Build Comparison design decisions listed in `build-comparison/data/NOTES.md` ("Design decisions to review"): the edge marking, the palette change, the stop edges, Thor's and the Thing's treatment, the group colours' contrast, and figures drawn with their arms at their rest angle. (The meatball sentence is now reworded in the brief.)
- Step 2 (collaborator): regenerate Rex's and Ollie's turnarounds to the model-sheet spec (fixes listed in BRIEF.md, "The turnarounds") and measure them; make gap-filler figures from target outlines with GPT Images 2.5.
  - **Blocker to solve first:** the measuring tool cannot follow arms that cannot hang clear of the body (rest angle near 90°; above about 100 on the median soldier, so most of the 88–170 and 220–924 stretches). It refuses such sheets. The target tool still draws and scores those outlines but says the tool cannot check art drawn from them. See `build-comparison/research/reviews/round2.md`, "Still open"; one way is to cut the arms at the shoulder line before slicing.
  - The tool also reads raised arms a few percent (35°) to about 20% (near level) high on any sheet, because it counts each arm at torso depth where it meets the shoulder.

## Done

- 2026-10-11: Canon mass correction merged (pull request #8, `terantic/duo-mass`): Rex 2,700 kg of body + 307 kg tail = 3,007 kg; Ollie the same 3,007 kg in all. Density 1,060 kg/m³, so 2.84 m³ each. All three projects updated and tested.
- 2026-10-11: Build Comparison Step 1 merged (pull requests #5 and #6; cloud session, branch `claude/hopeful-keller-vly1s9`). Research (six topics, each verified; 43 corrections), design (three proposals, two judges, one spec), the page, the measuring tool (validated on duo.jpg), functional limits, tests, two adversarial review rounds (76 and 40 findings; records in `build-comparison/research/reviews/`), and the session history (`history/2026-10-11-build-comparison-step1/`). Live: https://claude.ai/artifact/DBtZrixDeZnvRwDhZMsCDn (version 3, matches `main`).
- 2026-10-11: Build Calculator republished (version 2, matches `main`): the Kouri 1995 non-users build now uses Table 1 of the full paper and is named "Men who never used steroids" (18 of the 74 were trial volunteers).
- 2026-10-11: Rex and Ollie A-pose turnarounds added (`build-comparison/assets/`) for Step 1's style key and outlines; Ollie's tail excluded from his score, like Rex's.
- 2026-10-11: Build Comparison decisions: men only; Rex and Ollie at 7.5% body fat (5–10%); Rex's tail excluded from his score; scores use height to the top of the skull; scale up to the "meatball" (about 924); gaps left empty for measured art; a two-step plan.
- 2026-10-11: doc fixes (`claude/fix-doc-nits`): CLAUDE.md's build commands now run one after the other from the repo root; BRIEF.md no longer points at the `session-transcript` branch for `history/scratchpad/mass/`, which is on `main`.
- 2026-10-11: collaboration setup (`CLAUDE.md`, `STATUS.md`, CI, Windows build fixes, session history merged).
