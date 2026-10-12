# Status

Who is working on what. Update it before every push (see "Two people, two accounts" in CLAUDE.md). Newest entries at the top of each section.

## Claimed

| Folder or file | Who | Branch | Since |
|---|---|---|---|
| `rex-strength-lab/` (all of it), root `README.md` (Rex lab row only), `history/` (a new entry for this session, if it runs long) | Collaborator | `terantic/rex-followups` | 2026-10-12 |

## In progress

- Rex lab follow-ups from the owners' answers (collaborator, `terantic/rex-followups`): built and tested; pull request open, waiting for the owner's review. Live page not yet republished (owner's account).
- Rex lab, restraint and presence (owner's cloud session, `claude/rex-presence`): `rex-strength-lab/BRIEF-presence.md` is built. Pull request #11 (research, the build, review rounds 1 and 2) was merged at `b1916a8`. Pull request #12 (same branch) carries the rest:
  - Round 2's code-lens fixes and its record (`research/reviews/presence-round2.json`).
  - Review round 3 (it checked round 2's fixes): 60 findings, 59 confirmed; all fixed, one partly (documented in the README's known limits). Record: `rex-strength-lab/research/reviews/presence-round3.json`. Among them: three round 2 fixes had not fully held (soft landing's was in the engine but not on the page); a solo throw's recoil slide is now a hazard; the single-event plaster level follows RI 8507 Figure B-1; the 1 MJ crater line in soil is labelled as our estimate.
  - CLAUDE.md's Rex lab build line now runs `node test/presence.js` (as CI does).
  - The session's `history/` entry.
  - Published this build to the live page (version 8). `history/2026-10-11-rex-presence/` written. Next: owner reviews and merges #12.

## Waiting on

- Owner: review the Rex lab follow-ups pull request (`terantic/rex-followups`), then republish the live page. Please confirm two rulings the collaborator relayed and recorded in `CLAUDE.md`: growth never bounces them up (the lift goes to the endless ocean, an exception to "momentum is never absorbed"), and the energy their gravity releases goes to the endless ocean. With these, the runaway loop is a round trip and the half-life control never acts; say whether to keep that control.
- Owner, optional: the moves' quick-load bearing for sand (37 kPa at 0.316 m, the textbook value) sits about 5–10× below what the elephant's sand bore. Raising it would change all-out results across the moves; left unchanged (README, known limits).
- Owner review of Build Comparison design decisions listed in `build-comparison/data/NOTES.md` ("Design decisions to review"): the edge marking, the palette change, the stop edges, Thor's and the Thing's treatment, the group colours' contrast, and figures drawn with their arms at their rest angle. (The meatball sentence is now reworded in the brief.)
- Step 2 (collaborator): regenerate Rex's and Ollie's turnarounds to the model-sheet spec (fixes listed in BRIEF.md, "The turnarounds") and measure them; make gap-filler figures from target outlines with GPT Images 2.5.
  - **Blocker to solve first:** the measuring tool cannot follow arms that cannot hang clear of the body (rest angle near 90°; above about 100 on the median soldier, so most of the 88–170 and 220–924 stretches). It refuses such sheets. The target tool still draws and scores those outlines but says the tool cannot check art drawn from them. See `build-comparison/research/reviews/round2.md`, "Still open"; one way is to cut the arms at the shoulder line before slicing.
  - The tool also reads raised arms a few percent (35°) to about 20% (near level) high on any sheet, because it counts each arm at torso depth where it meets the shoulder.

## Done

- 2026-10-12: Rex lab follow-ups built (`terantic/rex-followups`): instant growth about his middle, never thrown up; the runaway as a round trip; heel-first gait canon; the Weight tab's standing sink rule replaced (elephant print 18 mm at 350 kPa, against 0.23 m before). Tests: calibration, presence (382 checks), shots, sweep.
- 2026-10-12: the presence build's four open questions answered (instant growth about the middle; runaway side effects paid from absorbed energy; heel-first gait; revise the sinking rule). Canon in `CLAUDE.md`; the Rex lab changes are listed under Waiting on.
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
