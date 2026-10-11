# Status

Who is working on what. Update it before every push (see "Two people, two accounts" in CLAUDE.md). Newest entries at the top of each section.

## Claimed

| Folder or file | Who | Branch | Since |
|---|---|---|---|

Nothing is claimed. Build Comparison Step 1 is merged, so `build-comparison/` and `build-calculator/data/builds.json` / `src/calc.js` are free for Step 2.

## In progress

- Nothing.

## Waiting on

- Owner review of Build Comparison design decisions listed in `build-comparison/data/NOTES.md` ("Design decisions to review"): the edge marking, the brief's meatball sentence (false as geometry), the palette change, the stop edges, Thor's and the Thing's treatment, the group colours' contrast, and figures drawn with their arms at their rest angle.
- Step 2 (collaborator): regenerate Rex's and Ollie's turnarounds to the model-sheet spec (fixes listed in BRIEF.md, "The turnarounds") and measure them; make gap-filler figures from target outlines with GPT Images 2.5.
  - **Blocker to solve first:** the measuring tool cannot follow arms that cannot hang clear of the body (rest angle near 90°; above about 100 on the median soldier, so most of the 88–130 and 220–924 stretches). It refuses such sheets. The target tool still draws and scores those outlines but says the tool cannot check art drawn from them. See `build-comparison/research/reviews/round2.md`, "Still open"; one way is to cut the arms at the shoulder line before slicing.
  - The tool also reads raised arms a few percent (35°) to about 20% (near level) high on any sheet, because it counts each arm at torso depth where it meets the shoulder.

## Done

- 2026-10-11: Build Comparison Step 1 merged (pull requests #5 and #6; cloud session, branch `claude/hopeful-keller-vly1s9`). Research (six topics, each verified; 43 corrections), design (three proposals, two judges, one spec), the page, the measuring tool (validated on duo.jpg), functional limits, tests, two adversarial review rounds (76 and 40 findings; records in `build-comparison/research/reviews/`), and the session history (`history/2026-10-11-build-comparison-step1/`). Live: https://claude.ai/artifact/DBtZrixDeZnvRwDhZMsCDn (version 3, matches `main`).
- 2026-10-11: Build Calculator republished (version 2, matches `main`): the Kouri 1995 non-users build now uses Table 1 of the full paper and is named "Men who never used steroids" (18 of the 74 were trial volunteers).
- 2026-10-11: Rex and Ollie A-pose turnarounds added (`build-comparison/assets/`) for Step 1's style key and outlines; Ollie's tail excluded from his score, like Rex's.
- 2026-10-11: Build Comparison decisions: men only; Rex and Ollie at 7.5% body fat (5–10%); Rex's tail excluded from his score; scores use height to the top of the skull; scale up to the "meatball" (about 924); gaps left empty for measured art; a two-step plan.
- 2026-10-11: doc fixes (`claude/fix-doc-nits`): CLAUDE.md's build commands now run one after the other from the repo root; BRIEF.md no longer points at the `session-transcript` branch for `history/scratchpad/mass/`, which is on `main`.
- 2026-10-11: collaboration setup (`CLAUDE.md`, `STATUS.md`, CI, Windows build fixes, session history merged).
