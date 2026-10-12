# Status

Who is working on what. Update it before every push (see "Two people, two accounts" in CLAUDE.md). Newest entries at the top of each section.

## Claimed

| Folder or file | Who | Branch | Since |
|---|---|---|---|
| `rex-strength-lab/` (all of it), one line of the root `README.md` (the Rex lab row), and a new `history/` entry at the end | Owner's cloud session | `claude/rex-gui-a` (then `-b`, `-c`) | 2026-10-12 |

## In progress

- Owner's cloud session: building `rex-strength-lab/BRIEF-gui.md` in its three pull requests, one at a time. **A** (page organisation, sections 1–4; no engine change) on `claude/rex-gui-a`: built and tested (engine and existing tests unchanged; new page checks in `test/shots.js`). Review rounds 1 and 2: 27 and 18 findings, all confirmed and fixed (`rex-strength-lab/research/reviews/gui-a-round1.json`, `gui-a-round2.json`); round 3 (checking round 2's fixes) next, then the pull request. B (the four new powers) and C (energy comparisons, research first) follow, each after the one before is merged.

## Waiting on

- Owner: republish the live Rex lab page from `main` (the follow-ups merged in #15, and the half-life control's removal, #18 or later).
- Owner: build `rex-strength-lab/BRIEF-gui.md` (three pull requests in the order it gives: page organisation, the new powers, the energy comparisons). All its canon is confirmed; nothing in it waits on a decision.
- Owner review of Build Comparison design decisions listed in `build-comparison/data/NOTES.md` ("Design decisions to review"): the edge marking, the palette change, the stop edges, Thor's and the Thing's treatment, the group colours' contrast, and figures drawn with their arms at their rest angle. (The meatball sentence is now reworded in the brief.)
- Step 2 (collaborator): regenerate Rex's and Ollie's turnarounds to the model-sheet spec (fixes listed in BRIEF.md, "The turnarounds") and measure them; make gap-filler figures from target outlines with GPT Images 2.5.
  - **Blocker to solve first:** the measuring tool cannot follow arms that cannot hang clear of the body (rest angle near 90°; above about 100 on the median soldier, so most of the 88–170 and 220–924 stretches). It refuses such sheets. The target tool still draws and scores those outlines but says the tool cannot check art drawn from them. See `build-comparison/research/reviews/round2.md`, "Still open"; one way is to cut the arms at the shoulder line before slicing.
  - The tool also reads raised arms a few percent (35°) to about 20% (near level) high on any sheet, because it counts each arm at torso depth where it meets the shoulder.

## Done

- 2026-10-12: owner confirmed all the canon marked "owner to confirm" (the growth rulings, the Restraint wording, the default powers including their own recoil); the half-life control removed (the runaway loop can never run away); the moves' sand bearing left as it is for now. Recorded in CLAUDE.md, the README, the research facts and the brief (`terantic/canon-confirmed`; a test checks the control stays gone).
- 2026-10-12: Rex lab page brief merged (pull request #16): `rex-strength-lab/BRIEF-gui.md` for the owner's agent, and CLAUDE.md canon (Restraint; Default powers, marked "owner to confirm" where the owner hasn't yet). The collaborator's claim on `rex-strength-lab/` is released.
- 2026-10-12: Rex lab follow-ups merged (pull request #15, which also merged #13, the owner's STATUS tidy-up). CI passed on the pull request.
- 2026-10-12: Rex lab page brief written (`BRIEF-gui.md`, `terantic/gui-brief`): one "Their powers" banner, sidebar order, binary footing, Rex + Ollie as its own element, four default powers (the owner agreed to their two momentum exceptions; the rest to confirm), more energy comparisons (research first), corrections.
- 2026-10-12: Rex lab follow-ups built (`terantic/rex-followups`): instant growth about his middle, never thrown up; the runaway as a round trip; heel-first gait canon; the Weight tab's standing sink rule replaced (elephant print 18 mm at 350 kPa, against 0.23 m before). Tests: calibration, presence (382 checks), shots, sweep.
- 2026-10-12: the presence build's four open questions answered (instant growth about the middle; runaway side effects paid from absorbed energy; heel-first gait; revise the sinking rule). Canon in `CLAUDE.md`; the Rex lab changes are listed under Waiting on.
- 2026-10-12: Rex lab presence build finished (pull request #12, merged by the collaborator at `e2a3062`): round 2's code fixes, review round 3 (60 findings, 59 confirmed, all fixed, one partly; `rex-strength-lab/research/reviews/presence-round3.json`), `node test/presence.js` in CLAUDE.md's build line, and the session's history (`history/2026-10-11-rex-presence/`). Live page version 8 matches `main`. `rex-strength-lab/` and the other presence claims released.
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
