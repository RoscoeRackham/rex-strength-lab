# Review round 2, the first publish and the pull request

2026-10-11 20:42:57 UTC to 2026-10-11 22:50:11 UTC. 36 assistant events, 5 commit events, 10 subagent events, 107 tool call events, 5 wakeup events.

The round 1 build was published to the live page (its version 6), main merged in, and pull request #11 opened. Review round 2 checked every round 1 fix: 68 findings, all confirmed. Among them, the round 1 saturation stop could end a search on a plateau that was not the top (goals and hazards reported as never when all-out reached them). Fixes and guard tests followed (313 checks), and the page was republished (version 7).

Events are in the order they happened in the session; each workflow’s subagents are listed under the call that launched it, with their own start times.

**Claude · 2026-10-11 20:43:03 UTC**

Round 1 committed (dd459c6). Launching review round 2: same five lenses, told what round 1 fixed so they check the fixes hold and look for regressions.


- `Bash` Build the round 2 prior-fixes summary: `python3 - <<'EOF'` (+7 lines)
- `Bash` Preview the prior summary JSON string: `python3 -c "` (+1 lines)


### Workflow `rex-presence-review` · 2026-10-11 20:43:20 UTC

- `Workflow` rex-presence-review: Adversarial review of the Rex lab presence build (effort, Walk tab, comic switches, growth): lenses find defects, one skeptic per lens reproduces or refutes each finding
  - run `wf_cb78ed7e-fde`: 4 subagents, listed below

**Subagent `review:physics`** · rex-presence-review · started 2026-10-11 20:43:30 UTC

- findings: 8 (1 critical, 4 major, 3 minor); verified ok: 18.
- Most severe: Effort searches stop at a speed plateau that is not the top. Jump and…; Two-player search treats an unchanged 'can't hold it' result as…; Stomp shaking gives the ground about 9× the momentum the stomp has… (+2 more).

<details>
<summary>Prompt, verbatim (6,412 characters)</summary>

Workflow run `wf_cb78ed7e-fde`, phase `Review`, agent `ab4121b38ca0944d7`.

```text
You are reviewing new work in the Rex Super-Strength Lab (/home/user/rex-strength-lab/rex-strength-lab/), a self-contained HTML page (claude.ai Artifact) that simulates Rex and Ollie (canon in CLAUDE.md, already loaded). The work implements /home/user/rex-strength-lab/rex-strength-lab/BRIEF-presence.md: read it first. It adds (1) effort, separate from strength, on every solo tab (the strength used for a move's push; the page opens on the least disruptive effort: the gentlest push that reaches each move's stated goal), a courtesy ceiling (the most effort before a hazard: sonic boom, air blast over 100 Pa within the 'near' distance, ground shaking over 12.7 mm/s there, ground breaking under him, his hands crushing the object) and not-so-heroic presets, and one shared effort in the two-player tests; (2) a Walk tab on ground vibration from their footsteps (gait scaled by Froude number, heel-strike impact energy, a scaled-distance PPV law, thresholds for feeling, a rippling water glass, rattling, cosmetic damage, losing footing; footprints); (3) comic switches (gentle hold, safe passenger, silent strike, soft landing, cool flight) and (4) absorbed-energy modes (endless ocean, gradual, instant, runaway growth) with growth forms (mix, size, density) and a growth what-if on the Weight tab.
Code: src/engine.js (search for driveStrength, RESTRAINT, VIB, WALK, walkStep, footprint, presence, PASSENGER, GROW, grownBody, gradualGrowth, instantGrowth, runawayGrowth; jump's landing; throw's gentleHold, launchG, dragLoss; catch's gentleT/gentleC/cool), src/app.html (search for EFFORT_PRESETS, resolveEffort, effortReadout, duoHarm, resolveDuoEffort, bayWalk, ppvChart, growthItems, absorbBlock, growthWhatIf, passengerText), src/static-data.js (assumption cards), build-data.py, research/final-presence.json (the new verified facts, with statuses and sources; the raw research and verifier outputs are in /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/wfout/), README.md, test/presence.js, test/calibration.js, test/shots.js.
Build: cd /home/user/rex-strength-lab/rex-strength-lab && python3 build-data.py && node build.js. Tests: node test/presence.js; node test/calibration.js (about 80 s); node test/shots.js (about 70 s; writes dist/preview.html and shots/). Render the page yourself with Playwright: require('/opt/node22/lib/node_modules/playwright'); chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); load dist/preview.html (after running test/shots.js once) from a file URL. Settings persist in localStorage key 'rex-lab-v1' (some reset on every load: effort, absorb, growWhat, stepEffort, duoEffort, oEffortOwn). window.DinoPhys is the engine and window.DINO_DATA the data.
The owner is a professional critic: factual accuracy and honest labelling come first (see CLAUDE.md). Do NOT edit anything under /home/user/rex-strength-lab. Write scratch scripts and screenshots under /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/review2/ (create it). Every finding must be reproduced: give the exact input or place, what the page or code does (quote it, or the script output), what is correct with your derivation or source, and a minimal fix. Report real defects only: wrong physics or formulas, wrong or unsupported claims, mislabelled status, contradictions between parts of the page, broken layout or controls, tests that don't test what they say. Skip style preferences.

This is review round 2. Earlier rounds found and fixed the items summarised below; check that each fix holds and look for regressions and anything missed:
Round 1 found 78 findings (77 confirmed) across physics, claims, data, UX and code; fixes are in commits 0ab5706 and dd459c6 on branch claude/rex-presence. Read rex-strength-lab/research/reviews/presence-round1.json: every finding has an 'outcome' (status and the change made). Check that each fix holds on the current HEAD (rebuild first), and look hard for regressions the fixes introduced: the courtesy-ceiling search now scans seven points inside the onset bracket and stops when a move saturates; effort searches run in the background after a 40 ms budget (the page shows all-out labelled 'working it out' until done); a soil rule (sinking into sand, gravel or clay is a footprint, not broken ground) now applies to every move; soft landing keeps the landing force; the Stomp tab's shaking uses the drill stamp's effective mass; the Walk tab judges the water glass on side-to-side shaking; WALK.SOFT is 0.51; a 'passenger' hazard (launch peak g and air drag g); instant growth's launch is capped by the ground's bearing; subsonic punches and claps are shown as thumps. The one item left unfixed on purpose: physics-real-jump-ground-flip (documented in the README's known limits).

LENS: PHYSICS AND MODEL. Recompute independently with your own scripts: (1) effort: all-out reproduces the old engine; the least-disruptive search really finds the gentlest effort that reaches each goal (try several strengths incl. unlimited, both muscle modes, several grounds, the calibration body and a 50 m Rex); hazard onsets and the courtesy ceiling (is 'below' truly harmless, and does the named hazard start just above?); non-monotone cases; the two-player cap (does clamping to walking strength behave?); (2) the Walk tab: gait formulas and their inputs, the impact energies, the PPV law and its constants against the cited sources and their validity range (energies, distances, soils), the thresholds and which component/frequency they assume, footprints (sand estimate, clay N_c depth rule), the elephant comparison; (3) switches: gentle hold changes only grip/launch crush; silent strike, soft landing and cool flight absorb only their own energy and keep momentum; passenger g (felt g formula, the limits by duration); (4) growth: E/c^2, the three forms, the gradual-growth monopole pressure and shove speed, the instant-growth piston pressure, air and ground energy, the runaway ratio and the self-gravity term (is 0.3(2 - s/3) r_s/R right? is the binding-energy feedback argument sound?), and the Weight-tab physics applied to the grown body. Report any wrong formula, unit, sign, or a constant used outside its fitted range without saying so.

Under verified_ok, list what you checked and found correct. Prefix finding ids with "physics-".
```

</details>

**Subagent `review:claims`** · rex-presence-review · started 2026-10-11 20:43:32 UTC

- findings: 25 (1 critical, 3 major, 21 minor); verified ok: 12.
- Most severe: Throw: the saturation stop makes heavy throws claim 'even all-out he…; Two-player readout says 'Nothing in this test can harm anything…; Hazards are tested only at exactly 5 m, but the page says 'within 5… (+1 more).

<details>
<summary>Prompt, verbatim (6,152 characters)</summary>

Workflow run `wf_cb78ed7e-fde`, phase `Review`, agent `a25dfc5d539b660f6`.

```text
You are reviewing new work in the Rex Super-Strength Lab (/home/user/rex-strength-lab/rex-strength-lab/), a self-contained HTML page (claude.ai Artifact) that simulates Rex and Ollie (canon in CLAUDE.md, already loaded). The work implements /home/user/rex-strength-lab/rex-strength-lab/BRIEF-presence.md: read it first. It adds (1) effort, separate from strength, on every solo tab (the strength used for a move's push; the page opens on the least disruptive effort: the gentlest push that reaches each move's stated goal), a courtesy ceiling (the most effort before a hazard: sonic boom, air blast over 100 Pa within the 'near' distance, ground shaking over 12.7 mm/s there, ground breaking under him, his hands crushing the object) and not-so-heroic presets, and one shared effort in the two-player tests; (2) a Walk tab on ground vibration from their footsteps (gait scaled by Froude number, heel-strike impact energy, a scaled-distance PPV law, thresholds for feeling, a rippling water glass, rattling, cosmetic damage, losing footing; footprints); (3) comic switches (gentle hold, safe passenger, silent strike, soft landing, cool flight) and (4) absorbed-energy modes (endless ocean, gradual, instant, runaway growth) with growth forms (mix, size, density) and a growth what-if on the Weight tab.
Code: src/engine.js (search for driveStrength, RESTRAINT, VIB, WALK, walkStep, footprint, presence, PASSENGER, GROW, grownBody, gradualGrowth, instantGrowth, runawayGrowth; jump's landing; throw's gentleHold, launchG, dragLoss; catch's gentleT/gentleC/cool), src/app.html (search for EFFORT_PRESETS, resolveEffort, effortReadout, duoHarm, resolveDuoEffort, bayWalk, ppvChart, growthItems, absorbBlock, growthWhatIf, passengerText), src/static-data.js (assumption cards), build-data.py, research/final-presence.json (the new verified facts, with statuses and sources; the raw research and verifier outputs are in /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/wfout/), README.md, test/presence.js, test/calibration.js, test/shots.js.
Build: cd /home/user/rex-strength-lab/rex-strength-lab && python3 build-data.py && node build.js. Tests: node test/presence.js; node test/calibration.js (about 80 s); node test/shots.js (about 70 s; writes dist/preview.html and shots/). Render the page yourself with Playwright: require('/opt/node22/lib/node_modules/playwright'); chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); load dist/preview.html (after running test/shots.js once) from a file URL. Settings persist in localStorage key 'rex-lab-v1' (some reset on every load: effort, absorb, growWhat, stepEffort, duoEffort, oEffortOwn). window.DinoPhys is the engine and window.DINO_DATA the data.
The owner is a professional critic: factual accuracy and honest labelling come first (see CLAUDE.md). Do NOT edit anything under /home/user/rex-strength-lab. Write scratch scripts and screenshots under /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/review2/ (create it). Every finding must be reproduced: give the exact input or place, what the page or code does (quote it, or the script output), what is correct with your derivation or source, and a minimal fix. Report real defects only: wrong physics or formulas, wrong or unsupported claims, mislabelled status, contradictions between parts of the page, broken layout or controls, tests that don't test what they say. Skip style preferences.

This is review round 2. Earlier rounds found and fixed the items summarised below; check that each fix holds and look for regressions and anything missed:
Round 1 found 78 findings (77 confirmed) across physics, claims, data, UX and code; fixes are in commits 0ab5706 and dd459c6 on branch claude/rex-presence. Read rex-strength-lab/research/reviews/presence-round1.json: every finding has an 'outcome' (status and the change made). Check that each fix holds on the current HEAD (rebuild first), and look hard for regressions the fixes introduced: the courtesy-ceiling search now scans seven points inside the onset bracket and stops when a move saturates; effort searches run in the background after a 40 ms budget (the page shows all-out labelled 'working it out' until done); a soil rule (sinking into sand, gravel or clay is a footprint, not broken ground) now applies to every move; soft landing keeps the landing force; the Stomp tab's shaking uses the drill stamp's effective mass; the Walk tab judges the water glass on side-to-side shaking; WALK.SOFT is 0.51; a 'passenger' hazard (launch peak g and air drag g); instant growth's launch is capped by the ground's bearing; subsonic punches and claps are shown as thumps. The one item left unfixed on purpose: physics-real-jump-ground-flip (documented in the README's known limits).

LENS: CLAIMS AND COPY. Render the page and read every sentence, number, chip and label in the new parts: the effort box on each solo tab (every preset, at strengths from record-human to unlimited, on several grounds), the two-player effort box on all four two-player tabs, the Walk tab (every walker, pace, step effort and distance; several grounds), the comic switches panel and every place a switch shows its effect (Lift, Throw incl. the 'A person' object, Jump, Punch, Clap, Catch), the absorbed-energy blocks in each growth mode and form, and the Weight tab growth what-if (each energy, each mode). For each claim check it against the engine numbers and research/final-presence.json. Find: sentences the numbers do not support; estimates presented as fact or missing their 'estimate' label; contradictions between the effort readout, the verdicts and the chips; wrong grammar that changes meaning (e.g. preset text that says the opposite); numbers that break the house rules (no huge percentages, no long digit strings, no '≈' for a big gap, rounding to what the data supports); the canon target sentences on the Walk tab; anything that changes canon (CLAUDE.md) rather than a labelled what-if.

Under verified_ok, list what you checked and found correct. Prefix finding ids with "claims-".
```

</details>

**Subagent `verify:claims`** · rex-presence-review · started 2026-10-11 21:23:19 UTC

- verdicts: 25 (25 confirmed).

<details>
<summary>Prompt, verbatim (33,973 characters)</summary>

Workflow run `wf_cb78ed7e-fde`, phase `Verify`, agent `a8827226be2c1cf09`.

```text
You are reviewing new work in the Rex Super-Strength Lab (/home/user/rex-strength-lab/rex-strength-lab/), a self-contained HTML page (claude.ai Artifact) that simulates Rex and Ollie (canon in CLAUDE.md, already loaded). The work implements /home/user/rex-strength-lab/rex-strength-lab/BRIEF-presence.md: read it first. It adds (1) effort, separate from strength, on every solo tab (the strength used for a move's push; the page opens on the least disruptive effort: the gentlest push that reaches each move's stated goal), a courtesy ceiling (the most effort before a hazard: sonic boom, air blast over 100 Pa within the 'near' distance, ground shaking over 12.7 mm/s there, ground breaking under him, his hands crushing the object) and not-so-heroic presets, and one shared effort in the two-player tests; (2) a Walk tab on ground vibration from their footsteps (gait scaled by Froude number, heel-strike impact energy, a scaled-distance PPV law, thresholds for feeling, a rippling water glass, rattling, cosmetic damage, losing footing; footprints); (3) comic switches (gentle hold, safe passenger, silent strike, soft landing, cool flight) and (4) absorbed-energy modes (endless ocean, gradual, instant, runaway growth) with growth forms (mix, size, density) and a growth what-if on the Weight tab.
Code: src/engine.js (search for driveStrength, RESTRAINT, VIB, WALK, walkStep, footprint, presence, PASSENGER, GROW, grownBody, gradualGrowth, instantGrowth, runawayGrowth; jump's landing; throw's gentleHold, launchG, dragLoss; catch's gentleT/gentleC/cool), src/app.html (search for EFFORT_PRESETS, resolveEffort, effortReadout, duoHarm, resolveDuoEffort, bayWalk, ppvChart, growthItems, absorbBlock, growthWhatIf, passengerText), src/static-data.js (assumption cards), build-data.py, research/final-presence.json (the new verified facts, with statuses and sources; the raw research and verifier outputs are in /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/wfout/), README.md, test/presence.js, test/calibration.js, test/shots.js.
Build: cd /home/user/rex-strength-lab/rex-strength-lab && python3 build-data.py && node build.js. Tests: node test/presence.js; node test/calibration.js (about 80 s); node test/shots.js (about 70 s; writes dist/preview.html and shots/). Render the page yourself with Playwright: require('/opt/node22/lib/node_modules/playwright'); chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); load dist/preview.html (after running test/shots.js once) from a file URL. Settings persist in localStorage key 'rex-lab-v1' (some reset on every load: effort, absorb, growWhat, stepEffort, duoEffort, oEffortOwn). window.DinoPhys is the engine and window.DINO_DATA the data.
The owner is a professional critic: factual accuracy and honest labelling come first (see CLAUDE.md). Do NOT edit anything under /home/user/rex-strength-lab. Write scratch scripts and screenshots under /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/review2/ (create it). Every finding must be reproduced: give the exact input or place, what the page or code does (quote it, or the script output), what is correct with your derivation or source, and a minimal fix. Report real defects only: wrong physics or formulas, wrong or unsupported claims, mislabelled status, contradictions between parts of the page, broken layout or controls, tests that don't test what they say. Skip style preferences.

This is review round 2. Earlier rounds found and fixed the items summarised below; check that each fix holds and look for regressions and anything missed:
Round 1 found 78 findings (77 confirmed) across physics, claims, data, UX and code; fixes are in commits 0ab5706 and dd459c6 on branch claude/rex-presence. Read rex-strength-lab/research/reviews/presence-round1.json: every finding has an 'outcome' (status and the change made). Check that each fix holds on the current HEAD (rebuild first), and look hard for regressions the fixes introduced: the courtesy-ceiling search now scans seven points inside the onset bracket and stops when a move saturates; effort searches run in the background after a 40 ms budget (the page shows all-out labelled 'working it out' until done); a soil rule (sinking into sand, gravel or clay is a footprint, not broken ground) now applies to every move; soft landing keeps the landing force; the Stomp tab's shaking uses the drill stamp's effective mass; the Walk tab judges the water glass on side-to-side shaking; WALK.SOFT is 0.51; a 'passenger' hazard (launch peak g and air drag g); instant growth's launch is capped by the ground's bearing; subsonic punches and claps are shown as thumps. The one item left unfixed on purpose: physics-real-jump-ground-flip (documented in the README's known limits).

Another reviewer (claims lens) reported the findings below. For EACH one, try hard to REFUTE it: reproduce it yourself with your own script or browser run, independently of theirs. Mark real=true only if you reproduced it. Confirm the severity and give the best minimal fix (exact code or text). Default to real=false if you cannot reproduce it.

FINDINGS:
[
 {
  "id": "claims-throw-saturation-false-unreachable",
  "severity": "critical",
  "title": "Throw: the saturation stop makes heavy throws claim 'even all-out he can't' reach the goal when all-out does, and crashes the tab on granite",
  "location": "src/engine.js RESTRAINT.search (the `same` stop) + plan().same; src/app.html resolveEffort ('least' branch: EFF_HAZ[ce.by].what with ce.by null)",
  "evidence": "Default comic mode and concrete, Throw tab, object M1A2 Abrams tank, strength 100,000 t (logKg 8). The page says: 'The tank flies 10.8 m.' / 'Even all-out he can’t land the tank 30 m away, and past 0.29% (lifting 294 t) the ground under his feet gives way.' Engine at the same settings, all-out: v 43.7 m/s, range 188 m. Semi at 10,000 t: 'Even all-out he can’t land the semi 30 m away' while all-out throws it 61.1 m. Why: comic mode holds back to the footing, so launch speed is flat over half a decade (tank: 9.79 m/s at both 1e6 and 3e6 kg; granite: 8.40 m/s at 3e5 and 1e6), `same()` declares the move saturated, and the goal and every hazard search return 'never'. On granite (tank, 100,000 t or more; also soft clay with Comic ground from 10,000 t) the hazards are real at all-out, ceiling() returns by:null and the tab shows 'Calculation failed: Cannot read properties of undefined (reading 'what')' with a console TypeError. My engine scan of the throw (4 surfaces x comic ground x 2 modes x 8 strengths x 8 objects, script scratchpad/review2/claims/scan_sat.js) found 63 settings where the goal is falsely called unreachable, 13 where the page crashes, and the same 13 where 'Courtesy ceiling: none ... even all-out' is shown although all-out has boom, plaster, ground or crush hazards. Other moves: none found.",
  "expected": "A plateau caused by the footing hold-back, or by switching between muscle models, is not saturation: more effort still throws farther (tank 9.79 -> 43.7 m/s). The goal search should find the 30 m throw, and the ceiling should name the hazard that all-out actually trips.",
  "fix": "Only stop when the result is the same at the top of the range too (e.g. also compare with run(hi)), or require the speed to stay flat over a full decade and to equal the all-out speed. In resolveEffort, guard `ce.by` null (treat it as no ceiling and fall back to all-out). Add a test: tank and semi on concrete and granite at 1e7-1e10 kg, goal reached iff all-out reaches it."
 },
 {
  "id": "claims-duo-bodies-not-harm",
  "severity": "major",
  "title": "Two-player readout says 'Nothing in this test can harm anything nearby' while 3-tonne bodies slide through the 5 m zone at 9-156 m/s",
  "location": "src/app.html duoHarm ('wrestle' shove: only supersonic counts; 'collide': only blast; 'catch': thrower recoil not counted) and duoEffortBox readout",
  "evidence": "Wrestle, move Shove, default 100 t: verdict 'Ollie flies back at 14.4 m/s and slides 17.5 m, well out of the ring. Rex recoils at 14.5 m/s.' (630 kJ, 150 g TNT); readout 'All-out: no cap needed. Nothing in this test can harm anything nearby, so they go all-out.' At 10,000 t (logKg 7): 'Ollie flies back at 156 m/s and slides 857 m ... Rex recoils at 156 m/s' (73.6 MJ) with the same readout. At unlimited strength the least-disruptive cap stops only at 'someone flies off faster than sound', so both slide 1.6 km at 340 m/s. Collide default: 'Rex is knocked back at 8.97 m/s and the two slide 6.97 m before they stop' + 'Nothing in this test can harm anything nearby'. Catch, car fastball, 1,000,000 t, Gentle hold, least disruptive: 'Throwing it shoves Rex back at 151 m/s and slides about 838 m' under 'The hardest both can go while nothing around them breaks.' People and buildings are taken to be 5 m away (state.near).",
  "expected": "A 3 t body moving at 9-156 m/s, sliding farther than the 5 m 'near' distance, is a harm to people and buildings there (a 52 km/h car crash at the default). The readout cannot claim nothing nearby can be harmed.",
  "fix": "Count a body (Rex, Ollie, or the thrown partner) that slides or is knocked past state.near at more than walking speed as harm in duoHarm for shove, collide and catch (thrower recoil); otherwise reword to 'Nothing the lab checks here (table, object, sonic boom, air blast) is harmed' and say the bodies' own slide is not counted."
 },
 {
  "id": "claims-near-within-contradiction",
  "severity": "major",
  "title": "Hazards are tested only at exactly 5 m, but the page says 'within 5 m', so the ceiling and 'none' lines contradict their own reach figures",
  "location": "src/app.html effortFields label 'People and buildings within (m)'; effortReadout ('within ' + near, 'harms anyone within'); engine HAZARDS test ppvAt(..., o.near)",
  "evidence": "Stomp, default 100 t, concrete, preset Courtesy ceiling: 'Plaster may crack within 5 m from 68% (lifting 61 t); now out to 1.76 m.' (engine: 22 mm/s at 1 m, 12.7 mm/s at 1.76 m). Stomp on loose sand, opening view (least disruptive): 'Plaster may crack within 5 m from 0.6% (lifting 540 kg); now out to 1.14 m.' Stomp on loose sand at record-human strength (511 kg), All-out: 'Courtesy ceiling: none. Nothing this move does harms anyone within 5 m, even all-out.' and 'None of the hazards ... (ground shaking that may crack plaster ...) can happen', while the engine gives 50.7 mm/s at 1 m and 12.7 mm/s out to 4.82 m.",
  "expected": "Either the hazard covers everything closer than the distance (then plaster cracking at 1.14-4.82 m is a hazard), or the copy must say the nearest people and buildings are 5 m away.",
  "fix": "Relabel the input 'Nearest people and buildings (m)', and write 'at 5 m' / '5 m or more away' in the hazard list, the ceiling line and the 'none' line; or test the hazards at RMIN (1 m) up to near."
 },
 {
  "id": "claims-preset-blast-upper-bound-as-fact",
  "severity": "major",
  "title": "Presets and 'At this effort it also...' state upper-bound blast effects as fact ('blasts houses 5 m away flat'), against the page's own upper-bound label and the source's caveat",
  "location": "src/app.html PRESET_WHAT and effortReadout ('At this effort it also ...'); preset labels 'Crack the plaster next door', 'Flatten the houses next door', 'Level a block'; engine PRESETS (DP_HOUSES 26.8 kPa)",
  "evidence": "Punch, 10,000 t (logKg 7), preset Rattle the windows: verdict 'His fist reaches 340 m/s. Every punch cracks like a whip, only louder.'; readout 'The least effort that rattles windows ...' then 'At this effort it also blasts houses 5 m away flat.' and 'Air blast ... now out to 820 m from him'. The energy is 3.92 MJ (0.94 kg TNT); Kinney–Graham gives 26.8 kPa at 5.13 m only if all of it becomes blast. The bay's own blast chart says 'Upper bound: real moves couple far less energy into air than explosives do', and the card says the radii 'are upper bounds'. research/final-environment.json blast_residential_collapse notes: 'Derived from 1 kt (nuclear, long-duration) blast; short-duration blasts from small charges need higher peak pressure for the same damage.' The 'plaster' preset uses 12.7 mm/s, which the card itself calls a safe limit 'below which cracks are very unlikely' (Siskind: 5% chance at 13 mm/s), yet the preset is labelled 'Crack the plaster next door'. The lowest preset ('Rattle the windows') here already flattens houses, so the 'rising scales' are one step.",
  "expected": "Blast-based preset effects worded as upper bounds ('could blast houses flat, as an upper bound'), house collapse from a sub-kilogram charge not stated as fact, and the plaster preset worded as 'risks cracking plaster'.",
  "fix": "Add 'up to' / 'could' to PRESET_WHAT's windows, houses and block text and to the 'At this effort it also' line for blast items, with a short note that blasts assume all the energy goes into the air; rename the preset 'Risk cracking the plaster next door'; make the punch verdict past Mach 1 say what the readout says (or say the blast is an upper bound)."
 },
 {
  "id": "claims-math-share-of-dial-under-effort",
  "severity": "minor",
  "title": "Show-the-math and tiles say the push is a share of 'the dial's force' / 'full strength' when it is a share of the effort; one verdict blames strength for an effort cap",
  "location": "src/app.html bayJump math (line ~1407), bayThrow math (line ~1327) and the 'His throwing push' tile and can't-throw verdict (lines ~1206-1211)",
  "evidence": "Jump, default, least disruptive: dial 'Lifts 90.7 t / 890 kN of force'; math 'Legs push his body (2,920 kg) up ... with 149 kN (66% of the dial’s force, constant)'. 66% of 890 kN is 587 kN; 149 kN is 66% of the 23 t effort. Throw default: 'Drive: 261 kN (52% of full strength per hand, capped at his full strength ...)'; 261 kN is 29% of his full strength. Throw, locomotive, 100,000 t, Comic ground, preset Courtesy ceiling: verdict 'Rex can hold it, but can’t throw it at any angle: his throwing push (610.3 kN) is less than the weight ... (1.816 MN)' beside tiles 'His full strength 980.7 MN' and 'His throwing push 610.3 kN, 17% of full strength per hand'.",
  "expected": "Under effort the drive is a share of the strength used (the effort), and a throw blocked by the effort cap is not a strength limit.",
  "fix": "Use 'of the strength he uses' (or 'of his effort') when c.use < c.F, show the effort in the 'His full strength' tile, and make the verdict say 'at this effort'."
 },
 {
  "id": "claims-catch-safe-passenger-drag",
  "severity": "minor",
  "title": "Catch with Safe passenger: air drag on the thrown person is not counted, contradicting the Throw tab's rule",
  "location": "src/app.html catchPassengerG (returns null when state.safePassenger) and duoHarm('catch')",
  "evidence": "Rex + Ollie > Catch, object 'A person', Fastball, Safe passenger on, default strength: 'Rex fires the person at 78.2 m/s'; readout 'All-out: no cap needed. Nothing in this test can harm anything nearby' and chip 'Safe passenger: throw and catch spread through them'. Engine PASSENGER.dragG(person, 78.2) = 3.26 g, above noHarm(1) = 1.5 g and noHarm(0.093 s) = 2 g. The Throw tab at 80.3 m/s with the same switch shows 'Safe passenger, but air drag 3.4 g' and '...past the 1.5 g rides allow for that long; Safe passenger covers only his push, not the air' and counts it as the passenger hazard. Without the switch the Catch tab never checks drag either.",
  "expected": "The same rule on both tabs: drag on a flying person is real and counts against the ride limit.",
  "fix": "In catchPassengerG check PASSENGER.dragG(o, L.aim.vL) against noHarm(1) whatever the switch, and show it as on the Throw tab."
 },
 {
  "id": "claims-safe-passenger-switch-and-landing",
  "severity": "minor",
  "title": "Safe passenger switch promises 'no harmful g-force', and the landing caveat disappears from the readout when the switch is on",
  "location": "src/app.html #sw-passenger label (line 355); effortReadout ('For a person this covers the launch only...' only when !state.safePassenger); 'Hazards checked' text",
  "evidence": "Switch text: 'so they feel no harmful g-force. The landing stays real.' Throw a person, All-out, default strength, switch on: chip 'Safe passenger, but air drag 3.4 g' and '... past the 1.5 g rides allow'. Least disruptive with the switch on: 'The gentlest push that lands the person 30 m away' and a courtesy ceiling with no landing caveat, while the bay says 'they hit the ground at 17 m/s, like falling 14.7 m, unless someone catches them.' The 'Hazards checked' sentence lists five hazards and leaves out the sixth (a thrown person past ride limits) that the card lists.",
  "expected": "The switch text should say drag in flight is still felt; the readout's 'landing not counted' note applies with or without the switch; the hazard list should name all six.",
  "fix": "Switch text: '...so his push puts no g-force on them; air drag in flight and the landing stay real.' Drop `&& !state.safePassenger` from the landing-note condition; add 'a thrown person past ride limits' to the 'Hazards checked' list."
 },
 {
  "id": "claims-elephant-measured-distance",
  "severity": "minor",
  "title": "Elephant tile says the elephant 'was measured walking past 50 m away' when the only measurement is at 20 m; the comparison has no estimate label",
  "location": "src/app.html bayWalk elSub ('it was measured walking past ' + fmtDist(dE) + ' away')",
  "evidence": "Walk, Rex, loose sand, listener 50 m: tile 'Compared with an elephant: 20× the elephant / both on sandy ground, as the elephant was; it was measured walking past 50 m away'. The note below says 'a wild African elephant measured 20 m from a seismometer, falling about as 1 ÷ distance'. research elephant_steinmann2025_walk_20m_ppv (derived, 20 m only) and elephant_anchor_ppv_vs_distance (estimate, 'Order of magnitude only'). The '30×/70×/700× the elephant' value carries no status label.",
  "expected": "The tile should say the elephant was measured at 20 m and scaled to the listener's distance, labelled as an estimate.",
  "fix": "elSub: 'both on sandy ground, as the elephant was; measured at 20 m, scaled as 1 ÷ distance to ' + fmtDist(dE) + ' · estimate'."
 },
 {
  "id": "claims-duo-least-headline-contradicts-note",
  "severity": "minor",
  "title": "Two-player readout says 'The hardest both can go while nothing around them breaks' right above 'Nothing is harmless here'",
  "location": "src/app.html duoEffortBox (head text for state.duoEffort === 'least')",
  "evidence": "Catch, 'A person', default strength: 'Effort: 2.8% of his strength. (each as hard as lifting 2.58 t). The hardest both can go while nothing around them breaks.' followed by 'Nothing is harmless here: even at the least they need to stand, the throw presses the person harder than amusement rides allow.' Arm wrestle with 'Ollie sets his own effort': same headline, then 'Ollie’s own what-if effort does it at any shared effort: the table tears apart.' The head also prints 'of his strength. (each as ...).' with a stray full stop before the parenthesis.",
  "expected": "When the note says nothing is harmless, the 'why' sentence must not claim nothing breaks (the solo readout already replaces it, ux-9).",
  "fix": "When eff.note is set, use 'The least they need to stand; nothing gentler exists.' (or similar) as the why-sentence; build the head as 'Effort: X of his strength (each as hard as lifting Y).'"
 },
 {
  "id": "claims-runaway-nothing-breaks",
  "severity": "minor",
  "title": "Runaway growth says 'nothing outside breaks' in the same list that says the ground gives under his soles",
  "location": "src/app.html growthItems (runaway branch of the air-blast item)",
  "evidence": "Punch, Silent strike, 10^20 kg, All-out, absorb Runaway: 'In runaway mode that blast’s energy (880 mg TNT to 1.9 g TNT) is taken back as growth too, so nothing outside breaks.' then 'Momentum isn’t absorbed ... (72.8 MPa under his feet in all). The concrete slab bears only 2.5 MPa: it gives, and his soles are driven into it.' Weight tab, Dinosaur-killer impact, Runaway, pure size: same pair (1.72 GPa against 2.5 MPa).",
  "expected": "Only the air blast is taken back; the ground load is momentum and still breaks the slab.",
  "fix": "Say 'so the air blast breaks no windows' instead of 'nothing outside breaks'."
 },
 {
  "id": "claims-growth-own-harms-when-harmless",
  "severity": "minor",
  "title": "Readout says the growth what-if 'has its own harms' when the growth block says it is unnoticeable or harmless",
  "location": "src/app.html effortReadout (line ~3005)",
  "evidence": "Punch, Silent strike, 10,000 t, All-out, absorb Gradual: readout 'The courtesy ceiling covers the move itself, not the growth what-if below, which has its own harms.' while the block says 'It becomes 7.09 × 10⁻⁸ g of new mass ... unnoticeable.' At 10^20 kg, Gradual over 60 s: 'Over 60 s it is harmless'. Throw car at 10^12 kg, Cool flight, Instant: growth '0.0648 g ... unnoticeable' with the same 'has its own harms' line.",
  "expected": "Only mention the growth's harms when the growth block reports one (instant/runaway blast, unsafe gradual time, ground giving).",
  "fix": "Show the line only when the absorbed energy gives growth of 1% or more and the chosen mode is not harmless; otherwise say 'The growth what-if below is harmless here'."
 },
 {
  "id": "claims-krakatoa-table-1x",
  "severity": "minor",
  "title": "Weight tab what-if table still prints '(1×)' for Krakatoa's 0.3% gain (round-1 fix covered only the list)",
  "location": "src/app.html growthWhatIf rows (fmtRatio(gB.ratio))",
  "evidence": "Weight tab, Absorb the energy of: Krakatoa: 'MIX (DEFAULT) 3.02 t (1×) 3.05 m 1,060 kg/m³', and the same three values for PURE SIZE and PURE DENSITY. The list below says 'about 0.3% of his mass: unnoticeable.' Round 1 claims-krakatoa-1x: '1× his mass for a 0.3% gain' marked fixed.",
  "expected": "'+0.3%' (or 'unnoticeable') rather than '1×'; the rows otherwise show nothing changing.",
  "fix": "In the table use the same rule as growthItems: under 10% show '+X%'; under 1% show 'unnoticeable (+0.3%)'."
 },
 {
  "id": "claims-stomp-subsonic-blast-chart",
  "severity": "minor",
  "title": "Stomp still draws a blast-damage chart for a 2 m/s foot, against the subsonic 'thump' rule the readout and card use",
  "location": "src/app.html bayStomp (blastBlock(r.E, 'ground-level') unconditionally)",
  "evidence": "Stomp, opening view (least disruptive, foot 2.13 m/s, 418 J): chart 'Windows shatter 62 cm / Houses collapse 24 cm / Eardrums start to burst 21 cm / Lung damage 14 cm / Pressure kills half 6.8 cm'. The card: 'a blast counts only when something moves past the speed of sound or makes a fireball; slower, the air flows out of the way and the release is a thump'. Punch and Clap show the THUMP callout below Mach 1 (round-1 claims-mach1-gate-ceiling), the stomp was missed.",
  "expected": "Below Mach 1 the stomp shows the thump callout, as Punch and Clap do.",
  "fix": "bayStomp: r.footMach < 1 ? callout(THUMP('his foot')) : blastBlock(...)."
 },
 {
  "id": "claims-soft-landing-absorbed-amount",
  "severity": "minor",
  "title": "Soft landing reports the whole landing energy as absorbed, about 8× what it takes from the surroundings",
  "location": "src/engine.js jumpOnce (landing.absorbed = soft ? Eland : 0); src/app.html Jump absorbBlock",
  "evidence": "Jump, default, least disruptive, Soft landing: 'Soft landing: the landing’s energy: 88.7 kJ (21 g TNT) absorbed.' Engine at the same effort: with the switch off the feet put Eimpact = 10.8 kJ into the ground and the landing force is 146 kN; with it on Eimpact = 0 and the force is the same 146 kN. The other 77.9 kJ is stopped by his bent legs either way. The switch text says 'the impact’s energy is taken back'. In the growth modes the 88.7 kJ is what turns into mass.",
  "expected": "The absorbed figure should be the energy that would have gone into the surroundings (the feet's impact, or the ground's share when the feet punch in), or the text must say it also counts what his legs would soak up.",
  "fix": "landing.absorbed = soft ? (the off-switch Eimpact, or Eland when landRatio > 1) : 0; or relabel 'the landing’s energy, including what his legs would take anyway'."
 },
 {
  "id": "claims-catch-full-strength-label",
  "severity": "minor",
  "title": "Catch fastball tile says 'full strength' when the throw is capped by the shared effort",
  "location": "src/app.html bayCatch throw tile (line ~2419)",
  "evidence": "Catch, car, Fastball, default strength, least disruptive: readout 'Effort: 39% of his strength. (each as hard as lifting 35.5 t)'; tile 'Throw 16.7 m/s / 6.4° up · full strength'. Same at 10,000 t ('Effort: 0.35% ...' and '· full strength').",
  "expected": "The fastball is his hardest throw at the effort used, not at full strength.",
  "fix": "Use 'hardest at this effort' when duoCap is below his strength."
 },
 {
  "id": "claims-cool-flight-catch-split",
  "severity": "minor",
  "title": "Throw tab says 'the Catch tab' splits the heat from the drag loss; the Catch tab gives no figure",
  "location": "src/app.html bayThrow Cool flight callout (line 1315) and bayCatch Cool flight item (line 2457)",
  "evidence": "Throw, Cool flight: '... this tab doesn’t split it (the Catch tab does), so the figure here is an upper bound'. Catch, shot put, Fastball, 1,000,000 t, All-out, Cool flight: 'The air takes 4.93 MJ from it in all (heat plus the wind it stirs); the heat share of that is what cool flight takes back.' No heat-share number, and the brief asks every switch to show how much energy was absorbed.",
  "expected": "Either the Catch tab shows the absorbed heat share as a number, or the Throw tab does not say it does.",
  "fix": "Show the heat share in joules in the Catch item (and route it through absorbBlock), or drop '(the Catch tab does)'."
 },
 {
  "id": "claims-walk-canon-grammar",
  "severity": "minor",
  "title": "Walk canon sentence reads 'a glass 3 m away ripples with not even an all-out stomp' on hard ground",
  "location": "src/app.html bayWalk tgt sentence (byStomp inserted after 'ripples with' / 'feel')",
  "evidence": "Walk, Rex, granite, ordinary steps: 'On granite, a glass 3 m away ripples with not even an all-out stomp at this strength, and people 3 m away feel not even an all-out stomp at this strength.'",
  "expected": "'On granite, not even an all-out stomp at this strength ripples a glass 3 m away or can be felt there.'",
  "fix": "Build the clause differently when the effort is Infinity and the stomp fails (e.g. '... a glass 3 m away doesn’t ripple even from an all-out stomp at this strength')."
 },
 {
  "id": "claims-walk-hardcoded-3007",
  "severity": "minor",
  "title": "Walk note says 'At 3,007 kg, Rex and Ollie each weigh about as much as an adult female African elephant' whatever body is set",
  "location": "src/app.html bayWalk notes (hard-coded string)",
  "evidence": "Walk with Rex's mass set to 6,000 kg in Settings: the note still says 'At 3,007 kg, Rex and Ollie each weigh about as much as an adult female African elephant.' Same with the 2 m, 180 kg calibration body.",
  "expected": "The sentence should use the current bodies' masses, or say it describes the canon bodies.",
  "fix": "Show it only when the bodies are the canon 3,007 kg, or compute it from c.body.m (step_elephant_match_3007kg)."
 },
 {
  "id": "claims-mired-past-knee",
  "severity": "minor",
  "title": "'Sinks ... past the knee' is not what the model computes (half the hip height is below the knee)",
  "location": "src/app.html bayWalk mired verdict",
  "evidence": "Walk, Ollie, soft clay: 'Ollie sinks into the soft clay past the knee at every step and gets stuck'. The engine calls him mired past half his hip height, 0.45 × 3.048 / 2 = 0.69 m; knee height is about 0.28 of height (step_ansur_leg_proportions) = 0.85 m. The detail text itself says 'the foot would sink past half his hip height'.",
  "expected": "'sinks past mid-shin' or 'sinks more than 69 cm'.",
  "fix": "Use the model's own criterion in the verdict: 'sinks more than ' + fmtDist(mired depth) + ' at every step and gets stuck'."
 },
 {
  "id": "claims-preset-houses-wording",
  "severity": "minor",
  "title": "Preset text 'blasts houses 5 m from where it lands flat' (misplaced 'flat'); throw presets say 'from where it lands' when the object never lands",
  "location": "src/app.html PRESET_WHAT.houses and fromW()",
  "evidence": "Throw, preset Flatten the houses next door: 'Even all-out, this move doesn’t blast houses 5 m from where it lands flat.' (reads as 'where it lands flat'). Throw car at unlimited strength, preset Break windows across the street: verdict 'It never lands: the air in front of it turns into a fireball.' and readout 'The least effort that breaks windows 15 m from where it lands, across a street.' and 'Air blast ... now out to 947 km from where it lands'.",
  "expected": "'blasts flat the houses 5 m from where it lands'; for a fireball, distances from the fireball (or from him), not from a landing point that doesn't exist.",
  "fix": "PRESET_WHAT.houses: 'flattens houses ' + dist + fromW(); make fromW() and the air reach say 'from the fireball' when r.flight.relativistic or the object never lands."
 },
 {
  "id": "claims-punch-goal-elite-boxers",
  "severity": "minor",
  "title": "Punch goal text says 'measured in elite boxers'; the research corrected that label",
  "location": "src/app.html GOALS.punch text",
  "evidence": "Punch readout: 'The gentlest push that throws a punch as fast as the strongest human’s (10.4 m/s in this model, inside the 6.6–12.5 m/s measured in elite boxers).' research/final-humans.json punch_fist_speed_elite_measured notes: Whiting et al. 1988, 'only four experienced boxers'; 'Label corrected from 'elite': 11.95 is an amateur mean.' The calibration card says 'measured in boxers'.",
  "expected": "'measured in boxers' (four experienced boxers, Whiting et al. 1988).",
  "fix": "Drop 'elite' from GOALS.punch."
 },
 {
  "id": "claims-glass-threshold-unlabelled",
  "severity": "minor",
  "title": "The water-glass threshold, the canon test, appears in the Walk bay without saying it is a model estimate (no measurement exists)",
  "location": "src/app.html bayWalk (verdict, chips, threshold list, canon sentence, notes)",
  "evidence": "Walk default: 'A glass of water ripples (0.2 mm/s): not even 1 m away.', chip 'A glass of water ripples', and the canon sentence 'a glass 3 m away ripples with ordinary steps', with no status anywhere in the bay; the notes label only rattling ('about 1 mm/s is our estimate'). research ripple_no_measured_threshold (not_quantified) and ripple_threshold_shimmer (estimate: 'from a model, not measured; range 0.02–1 mm/s'). The brief asks to 'find a measured value or derive one, and label which'.",
  "expected": "The bay should say the glass thresholds are our model estimates (0.2 mm/s side to side, range 0.02-1), not measured.",
  "fix": "Add to the notes: 'Nobody has measured when a glass visibly ripples: 0.2 mm/s side to side (rings 0.7 mm/s) is our estimate from a model, good to about 10× either way.'"
 },
 {
  "id": "claims-soil-rule-craters",
  "severity": "minor",
  "title": "On sand the soil rule calls 68 cm craters a footprint: the ceiling jump 'leaves two craters behind' with a 'Ground gives' chip and no ground hazard",
  "location": "src/engine.js RESTRAINT.MOVES.jump.ground (SOIL skip); src/app.html bayJump chips",
  "evidence": "Jump, loose sand, 1,000,000 t, preset Courtesy ceiling: verdict 'Rex jumps 6.84 m high and leaves two craters behind.'; chip 'Ground gives: feet sink 68 cm'; 'His feet punch 68 cm into the ground at up to 58.9 m/s ... The ground takes 570 g TNT' and the landing '7.3× what loose sand can bear, so his feet punch in, up to 2.21 m'; readout 'The most he can use before something nearby comes to harm.' with no 'The ground breaks' line.",
  "expected": "The soil rule (round-1 claims-soft-ground-harm) was meant for footprints; craters with half a kilogram of TNT equivalent going into the sand are broken ground, and the chip and readout should agree.",
  "fix": "Apply the soil rule only up to a footprint depth (e.g. the Walk tab's 'deep footprints' 10 cm or the mired depth) or ground energy; past that count it as broken ground."
 },
 {
  "id": "claims-rex-recoil-not-a-hazard",
  "severity": "minor",
  "title": "Rex's own recoil past Mach 4 is shown in the verdict but never counted as a sonic boom or other hazard",
  "location": "src/engine.js RESTRAINT.HAZARDS boom (tests M.speed(r), the object only)",
  "evidence": "Throw, locomotive, 1,000,000 t, default ground, All-out: verdict 'The locomotive flies 250 m. Rex gets shoved backward at 1,570 m/s.'; hazard list 'Where each hazard starts (2)': ground and crush only, no sonic boom. EFF_HAZ.boom says 'something he moves breaks the sound barrier'.",
  "expected": "His own body moving at Mach 4.6 (3.7 GJ) breaks the sound barrier and endangers anything behind him.",
  "fix": "Include max(object speed, recoilV) in the boom test (and reach), or add a 'he is thrown back' hazard."
 },
 {
  "id": "claims-tiny-percentages",
  "severity": "minor",
  "title": "Effort and ceiling shown as '3.4 × 10⁻⁶%' and '6.5 × 10⁻⁵%': not plain numbers",
  "location": "src/app.html pctOf / atText2",
  "evidence": "Throw car, 10^12 kg (logKg 12), All-out: 'Courtesy ceiling: 3.4 × 10⁻⁶% (lifting 34 t).' and 'The ground breaks from 6.5 × 10⁻⁵% (lifting 650 t)'. CLAUDE.md: 'Plain numbers: no huge percentages, long digit strings'.",
  "expected": "Below about 0.01% the share says nothing a reader can use; the mass already carries it.",
  "fix": "In pctOf, below 0.01% print 'a tiny share' (or omit the percent) and keep '(lifting 34 t)'."
 }
]
```

</details>

**Subagent `verify:physics`** · rex-presence-review · started 2026-10-11 21:26:14 UTC

- verdicts: 8 (8 confirmed).

<details>
<summary>Prompt, verbatim (22,010 characters)</summary>

Workflow run `wf_cb78ed7e-fde`, phase `Verify`, agent `a2f53451d080954b7`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/a2f53451d080954b7.txt](prompts/a2f53451d080954b7.txt).

```text
You are reviewing new work in the Rex Super-Strength Lab (/home/user/rex-strength-lab/rex-strength-lab/), a self-contained HTML page (claude.ai Artifact) that simulates Rex and Ollie (canon in CLAUDE.md, already loaded). The work implements /home/user/rex-strength-lab/rex-strength-lab/BRIEF-presence.md: read it first. It adds (1) effort, separate from strength, on every solo tab (the strength used for a move's push; the page opens on the least disruptive effort: the gentlest push that reaches each move's stated goal), a courtesy ceiling (the most effort before a hazard: sonic boom, air blast over 100 Pa within the 'near' distance, ground shaking over 12.7 mm/s there, ground breaking under him, his hands crushing the object) and not-so-heroic presets, and one shared effort in the two-player tests; (2) a Walk tab on ground vibration from their footsteps (gait scaled by Froude number, heel-strike impact energy, a scaled-distance PPV law, thresholds for feeling, a rippling water glass, rattling, cosmetic damage, losing footing; footprints); (3) comic switches (gentle hold, safe passenger, silent strike, soft landing, cool flight) and (4) absorbed-energy modes (endless ocean, gradual, instant, runaway growth) with growth forms (mix, size, density) and a growth what-if on the Weight tab.
Code: src/engine.js (search for driveStrength, RESTRAINT, VIB, WALK, walkStep, footprint, presence, PASSENGER, GROW, grownBody, gradualGrowth, instantGrowth, runawayGrowth; jump's landing; throw's gentleHold, launchG, dragLoss; catch's gentleT/gentleC/cool), src/app.html (search for EFFORT_PRESETS, resolveEffort, effortReadout, duoHarm, resolveDuoEffort, bayWalk, ppvChart, growthItems, absorbBlock, growthWhatIf, passengerText), src/static-data.js (assumption cards), build-data.py, research/final-presence.json (the new verified facts, with statuses and sources; the raw research and verifier outputs are in /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/wfout/), README.md, test/presence.js, test/calibration.js, test/shots.js.
Build: cd /home/user/rex-strength-lab/rex-strength-lab && python3 build-data.py && node build.js. Tests: node test/presence.js; node test/calibration.js (about 80 s); node test/shots.js (about 70 s; writes dist/preview.html and shots/). Render the page yourself with Playwright: require('/opt/node22/lib/node_modules/playwright'); chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); load dist/preview.html (after running test/shots.js once) from a file URL. Settings persist in localStorage key 'rex-lab-v1' (some reset on every load: effort, absorb, growWhat, stepEffort, duoEffort, oEffortOwn). window.DinoPhys is the engine and window.DINO_DATA the data.
The owner is a professional critic: factual accuracy and honest labelling come first (see CLAUDE.md). Do NOT edit anything under /home/user/rex-strength-lab. Write scratch scripts and screenshots under /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/review2/ (create it). Every finding must be reproduced: give the exact input or place, what the page or code does (quote it, or the script output), what is correct with your derivation or source, and a minimal fix. Report real defects only: wrong physics or formulas, wrong or unsupported claims, mislabelled status, contradictions between parts of the page, broken layout or controls, tests that don't test what they say. Skip style preferences.

This is review round 2. Earlier rounds found and fixed the items summarised below; check that each fix holds and look for regressions and anything missed:
Round 1 found 78 findings (77 confirmed) across physics, claims, data, UX and code; fixes are in commits 0ab5706 and dd459c6 on branch claude/rex-presence. Read rex-strength-lab/research/reviews/presence-round1.json: every finding has an 'outcome' (status and the change made). Check that each fix holds on the current HEAD (rebuild first), and look hard for regressions the fixes introduced: the courtesy-ceiling search now scans seven points inside the onset bracket and stops when a move saturates; effort searches run in the background after a 40 ms budget (the page shows all-out labelled 'working it out' until done); a soil rule (sinking into sand, gravel or clay is a footprint, not broken ground) now applies to every move; soft landing keeps the landing force; the Stomp tab's shaking uses the drill stamp's effective mass; the Walk tab judges the water glass on side-to-side shaking; WALK.SOFT is 0.51; a 'passenger' hazard (launch peak g and air drag g); instant growth's launch is capped by the ground's bearing; subsonic punches and claps are shown as thumps. The one item left unfixed on purpose: physics-real-jump-ground-flip (documented in the README's known limits).

Another reviewer (physics lens) reported the findings below. For EACH one, try hard to REFUTE it: reproduce it yourself with your own script or browser run, independently of theirs. Mark real=true only if you reproduced it. Confirm the severity and give the best minimal fix (exact code or text). Default to real=false if you cannot reproduce it.

FINDINGS:
[
 {
  "id": "physics-saturation-false-stop",
  "severity": "critical",
  "title": "Effort searches stop at a speed plateau that is not the top. Jump and heavy throws then report 'never' goals, missing hazards and a courtesy ceiling of 'none' while all-out does real harm",
  "location": "src/engine.js RESTRAINT.plan `same` (~l.3226) and RESTRAINT.search's saturation branch `if (s.i >= n || (same && s.i > 0 && same(grid(s.i - 1), u)))` (~l.3186); jumpOnce held-back push (~l.1200); throwOnce held-back push (~l.1103)",
  "evidence": "In comic mode the jump and the throw hold back to the ground or footing limit over a range of efforts, so the speed is identical there. Past that range the full push wins and the speed rises again. `same` sees equal speeds at two grid points half a decade apart and marks every job not yet found as never/saturated. Engine trace (review2/jump1.js), Rex, comic, ice, dial 1e12 kg: v = 38.88 m/s at effort 10^6, 10^6.5 and 10^7 kg ('h', held back), then 62.6 m/s at 10^7.5 with [air, ground] and 1,100 m/s at 10^10 with [boom, air, ground]. The plan reports boom/air/plaster/ground all ' … [1,649 more characters on this line; the full prompt is in prompts/a2f53451d080954b7.txt]
  "expected": "Equal speeds at two efforts only show saturation if nothing changes at higher effort. Here the plateau is a held-back regime that ends. A job may be declared 'never' only if the test is also false all-out (at hi, and at Infinity when unlimited). The ceiling must not be 'none' while the all-out run trips a hazard the same page displays.",
  "fix": "In search(), when `same` fires, probe test(hi) (and test(Infinity) if unlimited) before stopping. If it holds, keep walking the grid, or bisect between the plateau and hi. Alternatively, let `same` count only results capped by something permanent (real-muscle vmax, the sprint leg cap) and never held-back runs (r.heldBack). Add presence.js cases for Jump on ice at 1e12 kg (comic), Jump on concrete at 1e7 kg, and the locomotive throw at 1e12 kg, each asserting 'never' ⇒ !test(all-out)."
 },
 {
  "id": "physics-duo-saturation-cant-hold",
  "severity": "major",
  "title": "Two-player search treats an unchanged 'can't hold it' result as saturation, so Catch with heavy objects says 'no cap needed' and then shows harm at that same effort",
  "location": "src/app.html duoPlanFor: `const same = (u0, u1) => { ... return !!a && a === b; }` (~l.3320) with duoHarm('catch')'s duoSig fp(...) (~l.3266)",
  "evidence": "The fingerprint is a string, so it is always truthy. Unlike the solo `same`, which needs a moving result (a > 0), any identical outcome counts as saturation, including 'cant-hold' on both legs. Engine (review2, catchLeg at the search grid, lo = 1.2·3007 g/1.4 = 2,577 kg): bus is 'cant-hold' at 2,580 and 8,150 kg, 'too-weak' at 25,800 kg and 'caught' from 81,500 kg; semi and loco are 'cant-hold' for the first 3–4 grid points. The search stops after grid points 0 and 1 and declares 'never'. Page (review2/duopage2.js), Catch, bus, Hard throw, concrete, logKg 7, effort Least disruptive: 'All-out: no cap needed. Nothing in this test can harm anything nearby, so they go all-out. Courtesy ceiling: none. Nothing in this test harms anything nearby, even all-out.' followed in the same box by 'At this effort the catch crushes the bus in his palms'. Same contradiction for semi, bus, tank and loco at logKg 12 ('At this effort a throw breaks the sound barrier'), on concrete, ice and sand.",
  "expected": "The least-disruptive cap should be the hardest effort with no harm. For the bus at 1e7 kg that is below the effort where the catch crushes it, not all-out. A test that does nothing yet (can't hold, can't move) is not saturated.",
  "fix": "Count saturation only when the fingerprint shows the test actually ran (e.g. a leg has an aim, or a nonzero speed), as the solo plan does. Or, before declaring 'never', evaluate harmAt(hi) (and harmAt(Infinity)) and keep searching if it is harmful."
 },
 {
  "id": "physics-stomp-shake-momentum",
  "severity": "major",
  "title": "Stomp shaking gives the ground about 9× the momentum the stomp has: half his body counted as arriving at the foot's speed while the same page says his body is pushed up",
  "location": "src/engine.js RESTRAINT.MOVES.stomp.shake: impulseSource(o.surface, momentumOf(r.vFoot, Math.max(o.body.legEff, stampMass(o.body))), ...) and stampMass (~l.3060, 3097)",
  "evidence": "stampMass(Rex) = ½·6.5·W·footPulse / v_stamp = 1,648 kg (9.0 × legEff 183 kg). It comes from a measured drill stamp at 3.73 m/s, where part of the body's fall is arrested (step_stamp_contact_speed_estimate: 'a stamp also arrests part of the body's fall: effective mass perhaps a third to a half of M'). The engine multiplies it by any foot speed. review2/stomp2.js, Rex at 1e9 kg on concrete: the plaster hazard and the 'Crack the plaster next door' preset start at 61.5 t effort with vFoot 27.1 m/s. The modelled impulse is 44,700 N·s, against a leg momentum of 4,970 N·s. stompOnce pushes the body up (vBody 1.06 m/s). Page (Stomp, concrete, logKg 7, preset 'Crack the plaster next door'): 'Recoil hops him 5.7 cm up ... Newton’s third law again: driving the foot down pushes the rest of him up just as hard ... Plaster may crack within 5 m from 0.61% (lifting 61 t)'. With the body share held at the measured stamp speed (J = legEff·vFoot + (stampMass − legEff)·min(vFoot, 3.73 m/s); review2/stomp4.js), the goal is unchanged (122 kg at 2.13 m/s, below stamp speed). The plaster onset moves from 61 t (27 m/s) to 3.9 million kg (214 m/s) on concrete, and from 540 kg to 1.75 t on sand, where it sets the courtesy ceiling.",
  "expected": "The impulse a stomp puts into the ground in the foot's contact time can't exceed the foot and shank's momentum plus whatever body mass is actually moving down, and that body mass moves at most at stamp speed. In stompOnce the body is moving up. Matching the Walk tab at 3.7 m/s doesn't justify scaling the body's share with foot speeds of 27–340 m/s.",
  "fix": "Use J = legEff·vFoot + (stampMass − legEff)·min(vFoot, √(2 g·0.233 H)). Equivalently, cap the extra body share at the measured stamp. Re-run the stomp plaster hazard and preset, and add a test that the stomp impulse ≤ legEff·vFoot + the stamp's body share."
 },
 {
  "id": "physics-elephant-comparison-ground",
  "severity": "major",
  "title": "'N× the elephant' compares the model on the lab's loose sand (c_s 120 m/s) with a measurement on ground the model was validated at c_s 280 m/s; on that sand the model's own elephant reads 10–20× the measured one",
  "location": "src/app.html bayWalk elephant tile (~l.3170: onSand = P.presence(x.b, sandSf, o); ratioE = ... / P.elephantPPV(dE)); test/presence.js section 3b elephant check (ground {rho 1800, cs 280, xi 0.03}); VIB.GROUND.sand",
  "evidence": "Page (Walk, sand, Rex, soft-footed, 3 m): 'Compared with an elephant: 30× the elephant. both on sandy ground, as the elephant was'. The note credits the gap to harder feet: 'That Rex’s feet and Ollie’s boots hit harder is our inference, built into the heel-strike pulse above.' Steinmann's station is 'sandy dry ground', with no measured shear speed. The project's own check (vib_model_check_elephant; test/presence.js 'elephant-like footfall ... inside the measured band at 20 m') uses c_s 280 m/s from O'Connell-Rodwell's measured 248–264 m/s wave speed. review2/eleph2.js: that same 10 kN footfall (ramp 0.05 / 0.1 s) gives 14.8 / 6.6 µm/s on c_s 280 (inside the band). On the lab's loose sand it gives 104 / 46 µm/s, which is 21× / 9× the 5 µm/s anchor. An elephant forefoot (0.55 × 3,000 kg × g, rise 0.2–0.5 s) on lab sand reads 2.6–6.4× the measured value (review2/eleph.js). Rex soft-footed at 20 m: 34× on lab sand, 8× on the c_s 280 ground the check used. Even the weight ramp alone (no heel strike) is 14× the elephant on lab sand.",
  "expected": "A like-for-like comparison: put Rex on the ground the model was checked against for elephants (or a stated range of c_s, since the site's ground is unmeasured). Or compare model to model: Rex's PPV ÷ the model's PPV for an elephant footfall on the same ground. That puts Rex at roughly 5–15× (soft-footed to ordinary), not 30–70×. Only the part beyond the model's own elephant excess can be credited to Rex's harder feet.",
  "fix": "Compute the ratio as ppv(Rex)/ppv(model elephant: 0.55 W forefoot ramp, no heel strike) on the same ground, and multiply by the measured anchor if a PPV is shown. Or run the comparison on c_s ≈ 280 m/s ground, and say the measured site's ground is unknown, giving the 120–280 m/s spread. Reword the 'hit harder' note accordingly."
 },
 {
  "id": "physics-houses-preset-long-duration",
  "severity": "major",
  "title": "'Flatten the houses next door' uses a nuclear long-duration collapse pressure for about 1 kg TNT releases, and comes out gentler than 'Break windows across the street'",
  "location": "src/engine.js RESTRAINT.R.DP_HOUSES = 26800 and PRESETS 'houses' and 'block' (~l.3155); src/app.html EFFORT_PRESETS order and PRESET_WHAT.houses",
  "evidence": "The data fact blast_residential_collapse (26.8 kPa, Glasstone via Collins) carries the note: 'Derived from 1 kt (nuclear, long-duration) blast; short-duration blasts from small charges need higher peak pressure for the same damage.' review2/presets.js with the engine's blastRadius: 26.8 kPa at 5 m needs 0.865 kg TNT, while 6.9 kPa at 15 m (windows) needs 1.39 kg. Punch at 1e7 kg: 'houses' 6.15e6 kg-force is less than 'windows' 9.13e6. Clap: rattle = windows = houses = 7.29e6. Page (Punch, concrete, logKg 7, 'Flatten the houses next door'): 'His fist reaches 340 m/s ... Effort: 61% ... The least effort that blasts houses 5 m away flat.' with a 940 g TNT blast. A 1 kg TNT event has a positive phase of a few milliseconds at 5 m (scaled ~2–3 ms/kg^⅓), far shorter than a house's racking period (~0.1 s). That is the impulse-limited regime, where peak overpressure alone overstates damage, as the fact's own note warns. The dropdown lists the presets 'at rising scales' (rattle, plaster, windows, ground, houses, block), but 'houses' fires before 'windows'.",
  "expected": "Either a damage criterion valid for short blasts (pressure-impulse curves for house damage, e.g. Baker et al. 1983 / Jarrett 1968), or the 26.8 kPa value applied only where the positive phase is long compared with a house's response, and labelled as such. Presets labelled as rising should be ordered by their computed effort.",
  "fix": "Judge 'houses' and 'block' with a pressure-impulse test (Kinney–Graham impulse at the distance against a house P–I curve), or state on the page that 26.8 kPa is a long-duration (nuclear) value and an upper bound on damage for small releases. Sort or label presets by the effort actually found."
 },
 {
  "id": "physics-plaster-threshold-frequency",
  "severity": "minor",
  "title": "The 12.7 mm/s plaster limit (RI 8507, below 40 Hz) is applied to landing pulses at 50–200 Hz, where RI 8507's safe level is 50.8 mm/s, and it sets the courtesy ceiling for a shot or bowling ball",
  "location": "src/engine.js HAZARDS 'plaster' and PRESETS 'plaster' (VIB.TH.plaster) with MOVES.throw.shake pulse T = L/v (~l.3083)",
  "evidence": "thr_usbm_ri8507_safe_levels (verified) quotes: 'For frequencies above 40 Hz, a safe particle velocity maximum of 2.0 in/sec is recommended for all houses' (12.7 mm/s is the low-frequency plaster value). review2/shot.js and freq.js: default strength, shot put, target 30 m, sand: ceiling by plaster at 1.35 t, landing 15.4 m/s with a 7.8 ms pulse (129 Hz). On concrete: 4.89 t, 23.2 m/s, 194 Hz. Bowling ball on concrete: 157 Hz; on sand: 99.5 Hz. A person landing on concrete: 52 Hz. So the page's ceiling line reads 'Past that, the ground shakes hard enough that plaster may crack 5 m from where it lands' for a 7 kg shot landing at 15 m/s on loose sand. By the same rule, a record-like 13.7 m/s shot landing gives 9.7 mm/s at 5 m on lab sand.",
  "expected": "Use the RI 8507 level for the pulse's frequency: 12.7 mm/s below 40 Hz, 50.8 mm/s above (or the Appendix B curve). The elastic model was checked only with a 30 ms pulse (Pisa), so short pulses with PPV ∝ T^-2.5 are also outside its checked range and should say so.",
  "fix": "Threshold = f(1/T): 12.7 mm/s for f ≤ 40 Hz, 50.8 mm/s above, applied in HAZARDS.plaster, PRESETS.plaster and the reach list. Flag pulses much shorter than ~30 ms as outside the checked range."
 },
 {
  "id": "physics-sand-print-ignores-stamp",
  "severity": "minor",
  "title": "On sand and gravel a drill stamp leaves the same print as a soft step, while stiffer clay sinks 75 mm",
  "location": "src/engine.js footprint(), granular branch: depth uses p (stance pressure) only; impact.p is ignored (~l.2994)",
  "evidence": "review2 (footprint vs step effort): Rex on loose sand (bears 65 kPa) prints 8.3 mm at e = 0, 0.5, 0.75 and 1 (peak 108 → 618 kPa). On stiff clay (480 kPa) the stamp sinks 75 mm, and on soft clay 264 mm. Ollie on sand: 14.4 mm at every effort, peak up to 1,278 kPa. The engine's own Schanz rule (depth ∝ p^1.27 × B) at the stamp's 618 kPa gives 75 mm for Rex. Schanz's anchor (18 mm at 350 kPa) is itself the elephant's dynamic-plus-static stress (3.5 × static, step_schanz2013_elephant_footprint), so the print rule is a peak-stress rule.",
  "expected": "The weakest ground shouldn't take the shallowest stamp print. The granular print should grow with the landing peak, as the clay branch does via the impact.",
  "fix": "In the granular branch use max(p, impact.p) in the Schanz rule (or add the Poncelet impact depth, as for clay). Show the stamp's print on the Walk tab."
 },
 {
  "id": "physics-soft-landing-energy-double-count",
  "severity": "minor",
  "title": "Soft landing reports the whole landing energy as absorbed while the feet still sink by the full-energy Poncelet depth",
  "location": "src/engine.js jumpOnce landing: absorbed = soft ? Eland : 0; landSink = penetrationDepth(body.m, A2, vLand, ...) kept under soft (~l.1228–1236); src/app.html bayJump landAbsorb absorbBlock(L.E, 'Soft landing: the landing’s energy') (~l.1402)",
  "evidence": "review2/switches.js, Rex at 1e5 kg on sand, all-out jump. Without the switch: E 36.9 kJ, ratio 1.93, sink 0.714 m, Eground 36.9 kJ. With soft landing: absorbed 36.9 kJ and Eground 0, but the same 0.714 m sink. The sink is the Poncelet depth for the body's whole kinetic energy; against the ground's bearing alone (40.4 kN) it is about 29 kJ of work. The switch label says 'the impact’s energy is taken back' (the feet's Eimpact, 4.5 kJ, is what leaves the shaking). The bay's absorb block and any growth-mode mass use the full 36.9 kJ.",
  "expected": "Energy is conserved: E_landing = E_absorbed + work done on the ground (+ any left in his legs). Either the ground still takes its share and only the rest is absorbed, or all of it is absorbed and the sink is set by the force alone, not by the full-energy Poncelet depth.",
  "fix": "Report absorbed = Eland − (work on the ground over the sink), or recompute the soft-landing sink without the kinetic-energy term. Make the switch label and the absorb block name the same quantity."
 }
]
```

</details>


### Workflow `rex-presence-review` · 2026-10-11 20:43:24 UTC

- `Workflow` rex-presence-review: Adversarial review of the Rex lab presence build (effort, Walk tab, comic switches, growth): lenses find defects, one skeptic per lens reproduces or refutes each finding
  - run `wf_f32540b9-687`: 4 subagents, listed below

**Subagent `review:ux`** · rex-presence-review · started 2026-10-11 20:43:32 UTC

- findings: 12 (4 major, 8 minor); verified ok: 15.
- Most severe: Mouse-dragging a two-player slider stops after the first move: the…; The effort slider and its screen-reader value go stale whenever the…; Above about 10^18 kg the effort and ceiling percentages are wrong… (+1 more).

<details>
<summary>Prompt, verbatim (5,952 characters)</summary>

Workflow run `wf_f32540b9-687`, phase `Review`, agent `a25c62041b2c11c39`.

```text
You are reviewing new work in the Rex Super-Strength Lab (/home/user/rex-strength-lab/rex-strength-lab/), a self-contained HTML page (claude.ai Artifact) that simulates Rex and Ollie (canon in CLAUDE.md, already loaded). The work implements /home/user/rex-strength-lab/rex-strength-lab/BRIEF-presence.md: read it first. It adds (1) effort, separate from strength, on every solo tab (the strength used for a move's push; the page opens on the least disruptive effort: the gentlest push that reaches each move's stated goal), a courtesy ceiling (the most effort before a hazard: sonic boom, air blast over 100 Pa within the 'near' distance, ground shaking over 12.7 mm/s there, ground breaking under him, his hands crushing the object) and not-so-heroic presets, and one shared effort in the two-player tests; (2) a Walk tab on ground vibration from their footsteps (gait scaled by Froude number, heel-strike impact energy, a scaled-distance PPV law, thresholds for feeling, a rippling water glass, rattling, cosmetic damage, losing footing; footprints); (3) comic switches (gentle hold, safe passenger, silent strike, soft landing, cool flight) and (4) absorbed-energy modes (endless ocean, gradual, instant, runaway growth) with growth forms (mix, size, density) and a growth what-if on the Weight tab.
Code: src/engine.js (search for driveStrength, RESTRAINT, VIB, WALK, walkStep, footprint, presence, PASSENGER, GROW, grownBody, gradualGrowth, instantGrowth, runawayGrowth; jump's landing; throw's gentleHold, launchG, dragLoss; catch's gentleT/gentleC/cool), src/app.html (search for EFFORT_PRESETS, resolveEffort, effortReadout, duoHarm, resolveDuoEffort, bayWalk, ppvChart, growthItems, absorbBlock, growthWhatIf, passengerText), src/static-data.js (assumption cards), build-data.py, research/final-presence.json (the new verified facts, with statuses and sources; the raw research and verifier outputs are in /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/wfout/), README.md, test/presence.js, test/calibration.js, test/shots.js.
Build: cd /home/user/rex-strength-lab/rex-strength-lab && python3 build-data.py && node build.js. Tests: node test/presence.js; node test/calibration.js (about 80 s); node test/shots.js (about 70 s; writes dist/preview.html and shots/). Render the page yourself with Playwright: require('/opt/node22/lib/node_modules/playwright'); chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); load dist/preview.html (after running test/shots.js once) from a file URL. Settings persist in localStorage key 'rex-lab-v1' (some reset on every load: effort, absorb, growWhat, stepEffort, duoEffort, oEffortOwn). window.DinoPhys is the engine and window.DINO_DATA the data.
The owner is a professional critic: factual accuracy and honest labelling come first (see CLAUDE.md). Do NOT edit anything under /home/user/rex-strength-lab. Write scratch scripts and screenshots under /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/review2/ (create it). Every finding must be reproduced: give the exact input or place, what the page or code does (quote it, or the script output), what is correct with your derivation or source, and a minimal fix. Report real defects only: wrong physics or formulas, wrong or unsupported claims, mislabelled status, contradictions between parts of the page, broken layout or controls, tests that don't test what they say. Skip style preferences.

This is review round 2. Earlier rounds found and fixed the items summarised below; check that each fix holds and look for regressions and anything missed:
Round 1 found 78 findings (77 confirmed) across physics, claims, data, UX and code; fixes are in commits 0ab5706 and dd459c6 on branch claude/rex-presence. Read rex-strength-lab/research/reviews/presence-round1.json: every finding has an 'outcome' (status and the change made). Check that each fix holds on the current HEAD (rebuild first), and look hard for regressions the fixes introduced: the courtesy-ceiling search now scans seven points inside the onset bracket and stops when a move saturates; effort searches run in the background after a 40 ms budget (the page shows all-out labelled 'working it out' until done); a soil rule (sinking into sand, gravel or clay is a footprint, not broken ground) now applies to every move; soft landing keeps the landing force; the Stomp tab's shaking uses the drill stamp's effective mass; the Walk tab judges the water glass on side-to-side shaking; WALK.SOFT is 0.51; a 'passenger' hazard (launch peak g and air drag g); instant growth's launch is capped by the ground's bearing; subsonic punches and claps are shown as thumps. The one item left unfixed on purpose: physics-real-jump-ground-flip (documented in the README's known limits).

LENS: LAYOUT, ACCESSIBILITY, READING. Render at 360x740, 390x844, 768x1024 and 1280x900, light and dark (prefers-color-scheme, and also data-theme on <html>). Check the new parts: the effort controls and readout, the Walk tab (controls, chart labels overlapping or clipped, legend), the comic switches panel, the growth what-if table on phones, the two-player effort box and fighter cards. Check: horizontal overflow; clipped or overlapping text; text under 11 CSS px; contrast (WCAG text 4.5:1, marks 3:1); keyboard reach and visible focus for every new control; slider drags (does dragging the effort slider keep working, update the readout, and not lag badly: time renders with performance.now for the throw at unlimited strength in real-muscle mode); that controls each visibly change the page; that the page opens least-disruptive on a fresh visit and after a reload with saved settings; and a first-screen judgement for a reader with ADHD on a phone: is the effort box too heavy before the result?

Under verified_ok, list what you checked and found correct. Prefix finding ids with "ux-".
```

</details>

**Subagent `review:code`** · rex-presence-review · started 2026-10-11 20:43:32 UTC

- findings: 9 (4 major, 5 minor); verified ok: 14.
- Most severe: Effort search stops at a speed plateau. Jump hazards and presets come…; The two-player search treats 'too weak to start' at two low efforts…; A background two-player search keeps running with the new settings… (+1 more).

<details>
<summary>Prompt, verbatim (5,967 characters)</summary>

Workflow run `wf_f32540b9-687`, phase `Review`, agent `a34436b6d3364a866`.

```text
You are reviewing new work in the Rex Super-Strength Lab (/home/user/rex-strength-lab/rex-strength-lab/), a self-contained HTML page (claude.ai Artifact) that simulates Rex and Ollie (canon in CLAUDE.md, already loaded). The work implements /home/user/rex-strength-lab/rex-strength-lab/BRIEF-presence.md: read it first. It adds (1) effort, separate from strength, on every solo tab (the strength used for a move's push; the page opens on the least disruptive effort: the gentlest push that reaches each move's stated goal), a courtesy ceiling (the most effort before a hazard: sonic boom, air blast over 100 Pa within the 'near' distance, ground shaking over 12.7 mm/s there, ground breaking under him, his hands crushing the object) and not-so-heroic presets, and one shared effort in the two-player tests; (2) a Walk tab on ground vibration from their footsteps (gait scaled by Froude number, heel-strike impact energy, a scaled-distance PPV law, thresholds for feeling, a rippling water glass, rattling, cosmetic damage, losing footing; footprints); (3) comic switches (gentle hold, safe passenger, silent strike, soft landing, cool flight) and (4) absorbed-energy modes (endless ocean, gradual, instant, runaway growth) with growth forms (mix, size, density) and a growth what-if on the Weight tab.
Code: src/engine.js (search for driveStrength, RESTRAINT, VIB, WALK, walkStep, footprint, presence, PASSENGER, GROW, grownBody, gradualGrowth, instantGrowth, runawayGrowth; jump's landing; throw's gentleHold, launchG, dragLoss; catch's gentleT/gentleC/cool), src/app.html (search for EFFORT_PRESETS, resolveEffort, effortReadout, duoHarm, resolveDuoEffort, bayWalk, ppvChart, growthItems, absorbBlock, growthWhatIf, passengerText), src/static-data.js (assumption cards), build-data.py, research/final-presence.json (the new verified facts, with statuses and sources; the raw research and verifier outputs are in /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/wfout/), README.md, test/presence.js, test/calibration.js, test/shots.js.
Build: cd /home/user/rex-strength-lab/rex-strength-lab && python3 build-data.py && node build.js. Tests: node test/presence.js; node test/calibration.js (about 80 s); node test/shots.js (about 70 s; writes dist/preview.html and shots/). Render the page yourself with Playwright: require('/opt/node22/lib/node_modules/playwright'); chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); load dist/preview.html (after running test/shots.js once) from a file URL. Settings persist in localStorage key 'rex-lab-v1' (some reset on every load: effort, absorb, growWhat, stepEffort, duoEffort, oEffortOwn). window.DinoPhys is the engine and window.DINO_DATA the data.
The owner is a professional critic: factual accuracy and honest labelling come first (see CLAUDE.md). Do NOT edit anything under /home/user/rex-strength-lab. Write scratch scripts and screenshots under /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/review2/ (create it). Every finding must be reproduced: give the exact input or place, what the page or code does (quote it, or the script output), what is correct with your derivation or source, and a minimal fix. Report real defects only: wrong physics or formulas, wrong or unsupported claims, mislabelled status, contradictions between parts of the page, broken layout or controls, tests that don't test what they say. Skip style preferences.

This is review round 2. Earlier rounds found and fixed the items summarised below; check that each fix holds and look for regressions and anything missed:
Round 1 found 78 findings (77 confirmed) across physics, claims, data, UX and code; fixes are in commits 0ab5706 and dd459c6 on branch claude/rex-presence. Read rex-strength-lab/research/reviews/presence-round1.json: every finding has an 'outcome' (status and the change made). Check that each fix holds on the current HEAD (rebuild first), and look hard for regressions the fixes introduced: the courtesy-ceiling search now scans seven points inside the onset bracket and stops when a move saturates; effort searches run in the background after a 40 ms budget (the page shows all-out labelled 'working it out' until done); a soil rule (sinking into sand, gravel or clay is a footprint, not broken ground) now applies to every move; soft landing keeps the landing force; the Stomp tab's shaking uses the drill stamp's effective mass; the Walk tab judges the water glass on side-to-side shaking; WALK.SOFT is 0.51; a 'passenger' hazard (launch peak g and air drag g); instant growth's launch is capped by the ground's bearing; subsonic punches and claps are shown as thumps. The one item left unfixed on purpose: physics-real-jump-ground-flip (documented in the README's known limits).

LENS: CODE AND TESTS. Read the diff of this branch against main (git -C /home/user/rex-strength-lab diff main...HEAD -- rex-strength-lab .github). Check: CI runs every test and rebuilds/compares generated files; test/presence.js really tests what each check's name says (try breaking the engine in a scratch copy to see whether the test catches it); the all-out fixture test compares against the pre-effort engine; test/shots.js covers 390 and 1280 px in light and dark and fails on broken text; the background plan stepping (stepPlan, planRunning, planCache) cannot loop forever, leak, or render stale results after a setting change; resolveEffort/ensure can't hang the main thread for long (measure the worst case: unlimited strength, real muscle, Jump and Throw, preset 'ceiling'); localStorage validation for every new state key (corrupt values, removed keys); duoCap is always reset; XSS paths; and that test/sweep.js still runs and passes for a sample (node test/sweep.js may take minutes: run a reduced copy).

Under verified_ok, list what you checked and found correct. Prefix finding ids with "code-".
```

</details>

**Subagent `verify:ux`** · rex-presence-review · started 2026-10-11 21:14:43 UTC

- verdicts: 12 (12 confirmed).

<details>
<summary>Prompt, verbatim (22,342 characters)</summary>

Workflow run `wf_f32540b9-687`, phase `Verify`, agent `a16597eb27bd111bd`.

```text
You are reviewing new work in the Rex Super-Strength Lab (/home/user/rex-strength-lab/rex-strength-lab/), a self-contained HTML page (claude.ai Artifact) that simulates Rex and Ollie (canon in CLAUDE.md, already loaded). The work implements /home/user/rex-strength-lab/rex-strength-lab/BRIEF-presence.md: read it first. It adds (1) effort, separate from strength, on every solo tab (the strength used for a move's push; the page opens on the least disruptive effort: the gentlest push that reaches each move's stated goal), a courtesy ceiling (the most effort before a hazard: sonic boom, air blast over 100 Pa within the 'near' distance, ground shaking over 12.7 mm/s there, ground breaking under him, his hands crushing the object) and not-so-heroic presets, and one shared effort in the two-player tests; (2) a Walk tab on ground vibration from their footsteps (gait scaled by Froude number, heel-strike impact energy, a scaled-distance PPV law, thresholds for feeling, a rippling water glass, rattling, cosmetic damage, losing footing; footprints); (3) comic switches (gentle hold, safe passenger, silent strike, soft landing, cool flight) and (4) absorbed-energy modes (endless ocean, gradual, instant, runaway growth) with growth forms (mix, size, density) and a growth what-if on the Weight tab.
Code: src/engine.js (search for driveStrength, RESTRAINT, VIB, WALK, walkStep, footprint, presence, PASSENGER, GROW, grownBody, gradualGrowth, instantGrowth, runawayGrowth; jump's landing; throw's gentleHold, launchG, dragLoss; catch's gentleT/gentleC/cool), src/app.html (search for EFFORT_PRESETS, resolveEffort, effortReadout, duoHarm, resolveDuoEffort, bayWalk, ppvChart, growthItems, absorbBlock, growthWhatIf, passengerText), src/static-data.js (assumption cards), build-data.py, research/final-presence.json (the new verified facts, with statuses and sources; the raw research and verifier outputs are in /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/wfout/), README.md, test/presence.js, test/calibration.js, test/shots.js.
Build: cd /home/user/rex-strength-lab/rex-strength-lab && python3 build-data.py && node build.js. Tests: node test/presence.js; node test/calibration.js (about 80 s); node test/shots.js (about 70 s; writes dist/preview.html and shots/). Render the page yourself with Playwright: require('/opt/node22/lib/node_modules/playwright'); chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); load dist/preview.html (after running test/shots.js once) from a file URL. Settings persist in localStorage key 'rex-lab-v1' (some reset on every load: effort, absorb, growWhat, stepEffort, duoEffort, oEffortOwn). window.DinoPhys is the engine and window.DINO_DATA the data.
The owner is a professional critic: factual accuracy and honest labelling come first (see CLAUDE.md). Do NOT edit anything under /home/user/rex-strength-lab. Write scratch scripts and screenshots under /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/review2/ (create it). Every finding must be reproduced: give the exact input or place, what the page or code does (quote it, or the script output), what is correct with your derivation or source, and a minimal fix. Report real defects only: wrong physics or formulas, wrong or unsupported claims, mislabelled status, contradictions between parts of the page, broken layout or controls, tests that don't test what they say. Skip style preferences.

This is review round 2. Earlier rounds found and fixed the items summarised below; check that each fix holds and look for regressions and anything missed:
Round 1 found 78 findings (77 confirmed) across physics, claims, data, UX and code; fixes are in commits 0ab5706 and dd459c6 on branch claude/rex-presence. Read rex-strength-lab/research/reviews/presence-round1.json: every finding has an 'outcome' (status and the change made). Check that each fix holds on the current HEAD (rebuild first), and look hard for regressions the fixes introduced: the courtesy-ceiling search now scans seven points inside the onset bracket and stops when a move saturates; effort searches run in the background after a 40 ms budget (the page shows all-out labelled 'working it out' until done); a soil rule (sinking into sand, gravel or clay is a footprint, not broken ground) now applies to every move; soft landing keeps the landing force; the Stomp tab's shaking uses the drill stamp's effective mass; the Walk tab judges the water glass on side-to-side shaking; WALK.SOFT is 0.51; a 'passenger' hazard (launch peak g and air drag g); instant growth's launch is capped by the ground's bearing; subsonic punches and claps are shown as thumps. The one item left unfixed on purpose: physics-real-jump-ground-flip (documented in the README's known limits).

Another reviewer (ux lens) reported the findings below. For EACH one, try hard to REFUTE it: reproduce it yourself with your own script or browser run, independently of theirs. Mark real=true only if you reproduced it. Confirm the severity and give the best minimal fix (exact code or text). Default to real=false if you cannot reproduce it.

FINDINGS:
[
 {
  "id": "ux-duo-slider-drag-dies",
  "severity": "major",
  "title": "Mouse-dragging a two-player slider stops after the first move: the effort slider, Ollie's effort slider and Catch's distance slider all freeze where you pressed. This is a regression from round 1.",
  "location": "src/app.html:2169-2173 (scheduleBaySlow renders synchronously inside the input handler) with :3449 (`const old = keepControls && bay.contains(document.activeElement) ? ...`). Affects #duo-effort-use (:3366), #o-effort-use (:3376) and #c-dist (:2193). Introduced in 3454988 (fixes ux-2 and ux-12).",
  "evidence": "review2/ux/s8-duo-drag.js presses 20% along each slider at 1280x900, drags to 80% in 21 mouse moves, then releases. Output on HEAD: `catch #duo-effort-use inputs 1 distinct values 1 [\"3.72\"] focus at first input BODY | final 3.72 expected about 4.65 same element false`. Arm and Collide give the same result. `catch c-dist #c-dist inputs 1 ... final 1.92 expected about 5.95 same element false`. When the first input event fires, focus is still on BODY. The synchronous renderBay(true) therefore does not keep the controls: it replaces the bay and destroys the slider under the pointer. #o-effort-use works only because focus was already in the bay on the checkbox. Solo sliders render in requestAnimationFrame, after focus has moved, so they work (`solo throw ... inputs 21 ... same element true`). On the pre-round-1 build (0850eca, review2/ux/s8-old.js) the same Catch distance drag works: `#c-dist inputs 21 distinct values 21 ... final 5.96 ... same element true`. In review2/ux/s5-drag-timing.js the readout stays at 'Effort: 4% of his strength...' through the whole drag on Catch and Collide.",
  "expected": "A drag keeps the slider element in place and updates the result as the thumb moves, as it does on the solo tabs and as #c-dist did on main.",
  "fix": "Keep the bay controls when the event came from inside the bay, not only when focus is already there. Two ways: pass the input's target to renderBay (`renderBay(true, e.target)`, keeping when `bay.contains(from)`), or call `e.target.focus()` before scheduleBaySlow(). Alternatively, make scheduleBaySlow's first render wait for requestAnimationFrame like scheduleBay."
 },
 {
  "id": "ux-effort-slider-stale-in-bay",
  "severity": "major",
  "title": "The effort slider and its screen-reader value go stale whenever the effort changes while focus is inside the bay: after a background search finishes, or while dragging the move's own controls",
  "location": "src/app.html:3449-3452 (the keep branch keeps the whole first .bay-controls, which also holds the effort fields from effortFields :2955-2985 and duoEffortBox :3357-3378); stepPlan :2862 and stepDuoPlan call renderBay(true)",
  "evidence": "(1) review2/ux/s2-stale.js: unlimited strength, real muscle, Throw. Focus #obj and pick 'person'. Readout: 'Effort: as hard as lifting 333 kg. The most he can do with nothing nearby harmed.' Slider: value 34, aria-valuetext 'All-out'. After a full render it is 2.52, 'As hard as lifting 333 kg'. Bus: readout 21.3 t, slider stays at 34 'All-out'. Tank: readout 294 t, slider 34 'All-out'. (2) review2/ux/s19-angle-stale.js, default Throw: drag the launch angle from 45 to 80 degrees. Readout: 'Effort: 23% of his strength (as hard as lifting 21.3 t)'. Slider: 4.43, 'As hard as lifting 26.6 t' (the 45-degree value). (3) review2/ux/s3b-duo-stale-hard.js, Catch with Fastball at the default strength: focus #c-obj and pick car. After 8.3 s the readout says 'Effort: 39% of his strength... 35.5 t', but #duo-effort-use stays at 4.95, 'All-out'. A fresh render gives 4.55. If the visitor then presses an arrow key, the effort jumps from 39% to about 98% of his strength.",
  "expected": "The slider thumb and aria-valuetext always match the effort in the readout. Only the slider being dragged should be left alone.",
  "fix": "In the keep branch of renderBay, after `old.after(...)`, copy min, max, value and aria-valuetext from the freshly built #effort-use, #duo-effort-use and #o-effort-use into the kept ones, except the one that is document.activeElement. Or build the effort fields outside the kept .bay-controls so they are always rebuilt."
 },
 {
  "id": "ux-tiny-percent-clamped",
  "severity": "major",
  "title": "Above about 10^18 kg the effort and ceiling percentages are wrong: pctOf clamps the share to 10⁻¹²% and prints the clamp as the value. Smaller shares come out as scientific-notation percentages.",
  "location": "src/app.html:2945 `const pctOf = (use, F) => (use >= F * (1 - 1e-9) ? '100%' : sig(Math.max(100 * use / F, 1e-12), 2) + '%');`, used by amountText, atText, atText2 and the two-player head :3388",
  "evidence": "review2/ux/s17-tinypct.js. Dial 10^20 kg, Throw: 'Effort: 10⁻¹²% of his strength (as hard as lifting 26.6 t)'. The true share is 26,600 / 10^20 = 2.7 × 10⁻¹⁴%. 'Courtesy ceiling: 10⁻¹²% (lifting 34 t)' should be 3.4 × 10⁻¹⁴%; it prints the same figure as the effort for a different amount. Pull at 10^25 kg: 'Effort: 10⁻¹²% of his strength (as hard as lifting 105 kg)'; the true share is 1.05 × 10⁻²¹%, so it is off by 9 orders of magnitude. Arm wrestle at 10^20: 'Effort: 10⁻¹²% of his strength. (each as hard as lifting 6.14 t)'. Lower down the dial: stomp at 10^15 gives 'Effort: 1.2 × 10⁻¹¹% of his strength', and the strength-dial drag gave 'Effort: 3.5 × 10⁻⁵% of his strength'. CLAUDE.md asks for plain numbers.",
  "expected": "Every number shown is correct. A share too small to read is replaced by the mass alone, as the page already does at unlimited strength ('as hard as lifting 26.6 t').",
  "fix": "Remove the 1e-12 clamp. In pctOf and its callers, when use/F < 1e-4 (under 0.01%), drop the percentage and use the unlimited-strength wording ('as hard as lifting X', 'Courtesy ceiling: lifting 34 t'). For example: `const tiny = use / F < 1e-4; ... tiny ? 'as hard as lifting ' + fmtMass(use / g) : pctOf(...)`."
 },
 {
  "id": "ux-within-claim",
  "severity": "major",
  "title": "'People and buildings within (m)' and 'Nothing this move does harms anyone within 5 m' describe a zone, but the hazards are tested only at its edge: the default Jump landing shakes the ground past the page's own plaster-crack level 2 m away",
  "location": "src/app.html:2974 (label 'People and buildings within (m)'), :3001 ('Courtesy ceiling: none. Nothing this move does harms anyone within ' + near); src/engine.js HAZARDS :3145-3146 (`ppvAt(m.shake(r, o), o.near)` and `blastRadius(...) >= o.near`: only at near)",
  "evidence": "On a fresh visit the Jump tab (default 90.7 t, concrete) reads 'Courtesy ceiling: none. Nothing this move does harms anyone within 5 m, even all-out.' (review2/ux/s6-reload.js FRESH jump). The engine (review2/ux/n1-within.js) gives the all-out landing as `jump concrete logKg 4.9577 comic | all-out: PPV 1 m 35.2 mm/s, 2 m 17.5 mm/s (plaster 12.7 mm/s)`. That is above VIB.TH.plaster (12.7 mm/s, 'Plaster may crack'), 2 m away, inside 5 m. Real muscle at 10^6–10^8 kg gives the same pattern (18.8–21.4 mm/s at 2 m), and so does Stomp with comic ground (23.8–27.7 mm/s at 2 m). The code's own comment (engine.js:3042) defines NEAR as 'people and buildings this close to him': the nearest distance, not a zone.",
  "expected": "The label and the sentence say what is checked: the nearest people and buildings are 5 m away, and nothing harms them there or beyond.",
  "fix": "Rename the field 'Nearest people and buildings (m)'. Change the readout to 'Nothing this move does harms anyone 5 m or more away'; the hazard list's 'within 5 m' becomes 'at 5 m'. Alternatively, test the hazards at a minimum standoff (for example VIB.RMIN = 1 m) if 'within' is meant."
 },
 {
  "id": "ux-catch-search-slow",
  "severity": "minor",
  "title": "The two-player least-disruptive search for Catch with Fastball takes 8–15 s at the default strength. Meanwhile the bay shows the all-out catch (object destroyed), and the screen-reader live region announces that verdict.",
  "location": "src/app.html resolveDuoEffort :3343-3355 and stepDuoPlan (each probe runs both catchLeg calls); bay-live timer :3456-3457",
  "evidence": "review2/ux/s3b-duo-stale-hard.js at the default 90.7 t with Fastball, focus #c-obj. Picking car: 'Effort: working it out...' for 8,320 ms. The verdict during that time: 'Rex fires the car at 26.1 m/s... his feet slide 4.64 m. His palms punch into it.' The settled least-disruptive result is 39% (35.5 t). Picking piano: 15,499 ms. Gentle lob with car took 1,158 ms (s3-duo-stale.js). The 600 ms live-region timer fires during the wait and reads out the all-out verdict, with no 'working it out' context.",
  "expected": "The heroic default appears within a second or so, or the pending state shows no destructive verdict.",
  "fix": "Search the two-player cap more coarsely (stop at about 5% in effort, or reuse the bracket from the previous object), and cache across objects. While pending, show the last capped result or a neutral placeholder instead of the all-out bay, and don't update #bay-live until the search is done."
 },
 {
  "id": "ux-slider-end-not-allout",
  "severity": "minor",
  "title": "The right end of every effort slider ('gentle ↔ all-out') stops short of all-out (98–99%), because min and max are not on the 0.01 step grid",
  "location": "src/app.html:2978 (#effort-use: min = log10(p.lo/g), max = log10(F/g), step 0.01) and :3365 (#duo-effort-use)",
  "evidence": "review2/ux/s4-slider-end.js: focus the slider and press End. Throw: min 1.478133, max 4.957696 → value 4.948133. Readout: 'Effort: 98% of his strength (as hard as lifting 88.7 t). Set by hand.'; aria-valuetext 'As hard as lifting 88.7 t'. Picking All-out from the select gives 'All-out. Everything he has.' and 'The car flies 71.7 m.' Punch: the same 98%. Arm wrestle: 'Effort: 99% of his strength. (each as hard as lifting 89.4 t)'. Jump at 10^6 kg: 'Effort: 100% of his strength (as hard as lifting 996 t)'. Chromium snaps the value to min + n × step ≤ max, so the max is never reached.",
  "expected": "Dragging or pressing End reaches all-out, which the label promises.",
  "fix": "Align the grid to the top: `min = hi - Math.ceil((hi - lo) / 0.01) * 0.01`. Or use step='any'. Or in oninput treat `v >= +max - 0.01` as state.effort = 'allout' (and duoEffort = 'allout')."
 },
 {
  "id": "ux-walk-labels-on-wrong-lines",
  "severity": "minor",
  "title": "Walk chart: threshold labels pushed apart to avoid overlap now sit on the neighbouring threshold's line, so 'glass ripples' reads as the 0.3 mm/s 'felt' line. The round-1 ux-7 fix doesn't hold.",
  "location": "src/app.html ppvChart :3070-3080 (labels at sy(TH)-3, pushed up by 13 px with no check against other lines)",
  "evidence": "review2/ux/s12-label-strike.js finds a threshold line through the middle of the label's glyph box at every width (default Walk tab). At 360: 'glass ripples (side to side) struck by line #1' (#1 is the felt line, 0.3 mm/s) and 'felt struck by line #2' (rings, 0.7 mm/s). At 768 and 1280, 'rings in the glass (the film look)' is also struck by #3 (rattle). Screenshot review2/ux/viz-both-390x3.png: the label 'glass ripples (side to side)' lies on the 0.3 mm/s dashed line, with dashes showing between its words ('glass-ripples-(side-to-side)'). Its own 0.2 mm/s line is below it, linked only by a 1 px leader tick at the right edge.",
  "expected": "Each label is clearly attached to its own line, and no threshold line runs through another threshold's label.",
  "fix": "Put the labels in a right-hand gutter outside the plot area (wider padR) with leader lines. At phone width, key the lines with numbers or colours to the list below the chart. Or, when a pushed label would cross another line, place it in the next free gap and lengthen the leader."
 },
 {
  "id": "ux-legend-dash-mismatch",
  "severity": "minor",
  "title": "The Walk chart legend draws every patterned curve as a CSS dashed line, while two curves are dotted: the legend doesn't match the chart, and the dotted curves look like the dashed threshold lines",
  "location": "src/app.html:3085 (`border-top: ... (cv.dash ? 'dashed ' : 'solid ')`)",
  "evidence": "review2/ux/s20-legend.js, Walk with both walkers (Ollie 6,000 kg). Legend swatches: '1.5px dashed var(--ink-3)', '1.5px dashed var(--olive)', '1.5px dashed var(--accent)'. Chart paths: ink-3 'dash=6 4', olive 'dash=2 3', accent 'dash=1 3'. In legend-both-390x3.png and viz-both-390x3.png, 'Ollie alone' and 'Side to side' are dotted on the chart but dashed in the legend. They differ only by olive versus orange, the same dashed style the threshold lines use.",
  "expected": "Legend swatches use the same stroke pattern as the curves.",
  "fix": "Draw each legend swatch as a small inline SVG <line> with the curve's stroke, width and stroke-dasharray."
 },
 {
  "id": "ux-gentle-hold-unlabelled-throw",
  "severity": "minor",
  "title": "With Gentle hold on, the Throw courtesy ceiling rises 19× and the crush hazard disappears from the list, but nothing on the tab names Gentle hold (at the default least-disruptive effort)",
  "location": "src/app.html effortReadout :2996-3024 (hazards a switch removes are skipped as 'never'); src/engine.js:3068",
  "evidence": "review2/ux/s15-gentle-throw.js, Throw car at 10^7 kg. Off: 'Courtesy ceiling: 0.34% (lifting 34 t). Past that, his hands crush the object.' and 'Where each hazard starts (3) ... He crushes the object from 0.34%'. On: 'Courtesy ceiling: 6.5% (lifting 650 t). Past that, the ground under his feet gives way.' and 'Where each hazard starts (2)', with crush gone. The chips are unchanged ('Grip: object holds'), and the bay contains no 'Gentle hold' text. The label appears only at all-out ('Gentle hold: his grip can't crush it'). The brief says to label every switch wherever its effect shows.",
  "expected": "When a switch removes a hazard from the ceiling, the readout says so.",
  "fix": "In the hazard list, list each hazard removed by a switch, for example 'He crushes the object: never (Gentle hold is on)'. Do the same for Silent strike's boom and air hazards. Add the switch name to the ceiling line when that hazard would otherwise have set it."
 },
 {
  "id": "ux-half-life-inert",
  "severity": "minor",
  "title": "The 'Half-life if it runs away (s)' input changes nothing: it feeds no calculation and is echoed only inside a sentence for a case the page says never happens outside a black hole",
  "location": "src/app.html:377 (#half-life), :825 (handler), :1069 (only use: `RW.runs ? '...the half-life (' + fmtTime(state.halfLife) + ...`)",
  "evidence": "review2/ux/s18-halflife.js: Weight tab, runaway mode, The Sun for 1 second. Setting the half-life from 1 to 1000 s leaves the text unchanged ('half-life changes the text: false'), with the canon body and with the neutron-star and black-hole density chips. The text shown: 'That is far below 1, so the loop dies out at once...'. grep shows state.halfLife used nowhere else in app.html or engine.js.",
  "expected": "Every control visibly changes the page. A setting that can never act is stated as text, not offered as an input.",
  "fix": "Hide #half-row unless RW.runs is true for the current what-if, and keep the explanation sentence. Or make the half-life drive a real result: the final mass after the drain."
 },
 {
  "id": "ux-duo-readout-punctuation",
  "severity": "minor",
  "title": "The two-player effort line reads 'Effort: 6.8% of his strength. (each as hard as lifting 6.14 t).' on the default Arm wrestle tab",
  "location": "src/app.html:3388-3389 (head ends with '.' and then appends each + '.')",
  "evidence": "Fresh visit, Rex + Ollie, Arm wrestle (review2/ux/s6-reload.js FRESH arm): 'Effort: 6.8% of his strength. (each as hard as lifting 6.14 t). The hardest both can go while nothing around them breaks.' The same pattern shows on Catch: 'Effort: 39% of his strength. (each as hard as lifting 35.5 t).' 'his' also refers to two people.",
  "expected": "'Effort: 6.8% of their strength (each as hard as lifting 6.14 t).'",
  "fix": "Leave the period off the bold part when `each` follows, and say 'their strength' (or 'each one's strength') in the two-player box."
 },
 {
  "id": "ux-instant-growth-range-phrase",
  "severity": "minor",
  "title": "Instant growth reads 'The air at his surface jumps by 122 kPa to 764 kPa': a low-to-high range written so it reads as 'rises by 122 kPa, reaching 764 kPa'",
  "location": "src/app.html:1059",
  "evidence": "review2/ux/s13-growth.js, Weight tab, Instant growth, Dinosaur-killer impact, mix: 'The air at his surface jumps by 122 kPa to 764 kPa. As a blast that is 6.4 kg TNT to 40 kg TNT...'. The two numbers are the ball and piston estimates (I.dpLo, I.dpHi), as the next sentence explains. Read plainly, it says a 122 kPa jump ends at 764 kPa, which doesn't add up from about 101 kPa ambient.",
  "expected": "'The air at his surface jumps by 122–764 kPa' (or 'by between 122 kPa and 764 kPa').",
  "fix": "Use the en-dash range format the page uses elsewhere ('24.9 m–86.7 m'): 'jumps by ' + fmtSI(I.dpLo,'Pa') + '–' + fmtSI(I.dpHi,'Pa')."
 }
]
```

</details>

**Subagent `verify:code`** · rex-presence-review · started 2026-10-11 22:00:36 UTC

- verdicts: 9 (9 confirmed).

<details>
<summary>Prompt, verbatim (23,915 characters)</summary>

Workflow run `wf_f32540b9-687`, phase `Verify`, agent `a16221678909cf2cc`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/a16221678909cf2cc.txt](prompts/a16221678909cf2cc.txt).

```text
You are reviewing new work in the Rex Super-Strength Lab (/home/user/rex-strength-lab/rex-strength-lab/), a self-contained HTML page (claude.ai Artifact) that simulates Rex and Ollie (canon in CLAUDE.md, already loaded). The work implements /home/user/rex-strength-lab/rex-strength-lab/BRIEF-presence.md: read it first. It adds (1) effort, separate from strength, on every solo tab (the strength used for a move's push; the page opens on the least disruptive effort: the gentlest push that reaches each move's stated goal), a courtesy ceiling (the most effort before a hazard: sonic boom, air blast over 100 Pa within the 'near' distance, ground shaking over 12.7 mm/s there, ground breaking under him, his hands crushing the object) and not-so-heroic presets, and one shared effort in the two-player tests; (2) a Walk tab on ground vibration from their footsteps (gait scaled by Froude number, heel-strike impact energy, a scaled-distance PPV law, thresholds for feeling, a rippling water glass, rattling, cosmetic damage, losing footing; footprints); (3) comic switches (gentle hold, safe passenger, silent strike, soft landing, cool flight) and (4) absorbed-energy modes (endless ocean, gradual, instant, runaway growth) with growth forms (mix, size, density) and a growth what-if on the Weight tab.
Code: src/engine.js (search for driveStrength, RESTRAINT, VIB, WALK, walkStep, footprint, presence, PASSENGER, GROW, grownBody, gradualGrowth, instantGrowth, runawayGrowth; jump's landing; throw's gentleHold, launchG, dragLoss; catch's gentleT/gentleC/cool), src/app.html (search for EFFORT_PRESETS, resolveEffort, effortReadout, duoHarm, resolveDuoEffort, bayWalk, ppvChart, growthItems, absorbBlock, growthWhatIf, passengerText), src/static-data.js (assumption cards), build-data.py, research/final-presence.json (the new verified facts, with statuses and sources; the raw research and verifier outputs are in /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/wfout/), README.md, test/presence.js, test/calibration.js, test/shots.js.
Build: cd /home/user/rex-strength-lab/rex-strength-lab && python3 build-data.py && node build.js. Tests: node test/presence.js; node test/calibration.js (about 80 s); node test/shots.js (about 70 s; writes dist/preview.html and shots/). Render the page yourself with Playwright: require('/opt/node22/lib/node_modules/playwright'); chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); load dist/preview.html (after running test/shots.js once) from a file URL. Settings persist in localStorage key 'rex-lab-v1' (some reset on every load: effort, absorb, growWhat, stepEffort, duoEffort, oEffortOwn). window.DinoPhys is the engine and window.DINO_DATA the data.
The owner is a professional critic: factual accuracy and honest labelling come first (see CLAUDE.md). Do NOT edit anything under /home/user/rex-strength-lab. Write scratch scripts and screenshots under /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/review2/ (create it). Every finding must be reproduced: give the exact input or place, what the page or code does (quote it, or the script output), what is correct with your derivation or source, and a minimal fix. Report real defects only: wrong physics or formulas, wrong or unsupported claims, mislabelled status, contradictions between parts of the page, broken layout or controls, tests that don't test what they say. Skip style preferences.

This is review round 2. Earlier rounds found and fixed the items summarised below; check that each fix holds and look for regressions and anything missed:
Round 1 found 78 findings (77 confirmed) across physics, claims, data, UX and code; fixes are in commits 0ab5706 and dd459c6 on branch claude/rex-presence. Read rex-strength-lab/research/reviews/presence-round1.json: every finding has an 'outcome' (status and the change made). Check that each fix holds on the current HEAD (rebuild first), and look hard for regressions the fixes introduced: the courtesy-ceiling search now scans seven points inside the onset bracket and stops when a move saturates; effort searches run in the background after a 40 ms budget (the page shows all-out labelled 'working it out' until done); a soil rule (sinking into sand, gravel or clay is a footprint, not broken ground) now applies to every move; soft landing keeps the landing force; the Stomp tab's shaking uses the drill stamp's effective mass; the Walk tab judges the water glass on side-to-side shaking; WALK.SOFT is 0.51; a 'passenger' hazard (launch peak g and air drag g); instant growth's launch is capped by the ground's bearing; subsonic punches and claps are shown as thumps. The one item left unfixed on purpose: physics-real-jump-ground-flip (documented in the README's known limits).

Another reviewer (code lens) reported the findings below. For EACH one, try hard to REFUTE it: reproduce it yourself with your own script or browser run, independently of theirs. Mark real=true only if you reproduced it. Confirm the severity and give the best minimal fix (exact code or text). Default to real=false if you cannot reproduce it.

FINDINGS:
[
 {
  "id": "code-solo-saturation-plateau",
  "severity": "major",
  "title": "Effort search stops at a speed plateau. Jump hazards and presets come out as 'never' while all-out sets them off, and the page calls all-out harmless.",
  "location": "rex-strength-lab/src/engine.js:3185-3188 (search(): stops on `same`, then never/onlyUnlimited without testing hi) and :3224 (plan's same(): equal speed at two grid points) at HEAD 64a38a1",
  "evidence": "Scripts are in /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/review2/. All were re-run on a clean clone of 64a38a1 (ci/repo).\n\n(1) jump-scan.js (comic, concrete, 10^12 kg dial): the jump speed is 27.363 m/s at both grid 8 (3.01e5 kg) and grid 9 (9.51e5 kg), then 34.9 m/s at 3.01e6 kg with groundFails true. same() fires at grid 8/9 and ends every job still open.\n\n(2) jump-plan.js:\n- 'jump ice comic 1e12: ceiling {by:null}; hazard boom never, air never, ground never ... all-out: v 11283.5 hazards now boom,air,ground'.\n- 'jump concr … [1,417 more characters on this line; the full prompt is in prompts/a16221678909cf2cc.txt]
  "expected": "Equal speed at two efforts is not saturation here. Past the ground's bearing the jump speeds up again (19,412 m/s all-out at 10^12 kg on concrete). A job may only conclude 'never' or 'only at unlimited' if its test is false at hi. The full grid gives ground at 1.8e6 kg, air at 2.7e7 kg and boom at 3.1e8 kg on concrete.",
  "fix": "In plan's same(), also require the speed at hi to match: `eqv(a,b) && eqv(b, M.speed(at(hi)))`. Alternatively, in search(), probe test(hi) before setting never/onlyUnlimited, and resume the grid if it holds.\n\nAdd a test: for each plan, every goal, hazard or preset reported never is false at all-out.\n\nNote: uncommitted work in the working tree at 21:53 UTC makes exactly this change and adds test 2c. On a read-only snapshot of it, ice at 1e12 gives a ceiling set by air at 1.12e7 kg, and concrete at 1e7 gives ground at 1.75e6 kg. Re-verify once it is committed."
 },
 {
  "id": "code-duo-saturation-fingerprint",
  "severity": "major",
  "title": "The two-player search treats 'too weak to start' at two low efforts as saturation. The default least-disruptive effort then reads 'nothing around them breaks' (or 'no cap needed') beside actual destruction.",
  "location": "rex-strength-lab/src/app.html:3321 (duoPlanFor same()), feeding engine.js search() :3185-3188; readout :3388-3399 at HEAD 64a38a1",
  "evidence": "Scripts are in /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/review2/.\n\n(1) duo-search.js replicates duoPlanFor for Catch (car, 1 km, Fastball, comic, unlimited). Output: 'lo 2577 kg; search: use Infinity below 1e34 kg; saturated true onlyUnlimited true grid i 1'.\n- The fingerprints at 2.58 t and 8.15 t are identical: 'undefined|undefined|too-weak|undefined|…'.\n- Real harm starts by 1e10 kg: '1e10 kg harmful? true … crushed-launch'.\n\n(2) Page, HEAD build, saved {group:'duo', duoAction:'catch', cObj:'car', inf:true, mode:'comic',  … [1,122 more characters on this line; the full prompt is in prompts/a16221678909cf2cc.txt]
  "expected": "Identical 'nothing happened yet' fingerprints at low effort (too-weak, no charge) don't show that more effort changes nothing. The search should find the onset near 1e9-1e10 kg for the car and cap the effort below it.",
  "fix": "Make same() also match the fingerprint at hi: `harmAt(hi); … && b === sigs.get(hi)`. Alternatively, never count as saturated a fingerprint with no positive speed.\n\nAdd a check that a 'never' or 'only unlimited' two-player result has harmAt(hi) == null.\n\nWhile there: the ceiling line appends ', even all-out.' whenever isFinite(eff.p.hi). That is always true, because hi is 1e34 g at unlimited strength. Test isFinite(fullF('R')) instead.\n\n(The uncommitted working-tree change at 21:53 UTC adds the hi comparison.)"
 },
 {
  "id": "code-duo-stale-state",
  "severity": "major",
  "title": "A background two-player search keeps running with the new settings after a change and caches wrong results under the old settings' key",
  "location": "rex-strength-lab/src/app.html:3233-3234 (duoHarm reads live state: ctx(), ctxOllie(), state.cObj, state.near…), :3312-3320 (harmAt memoizes into the plan), :3331-3341 (stepDuoPlan tick only stops when duoRunning changes), :3349 (resolveDuoEffort hands duoRunning over only when the new search goes pending) at HEAD 64a38a1",
  "evidence": "Script: /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/review2/pw-duo-stale2.js, run on the HEAD build. Saved state: {group:'duo', duoAction:'catch', cObj:'person', inf:true, mode:'real', cLogD:1.5, cStyle:'hard'}.\n\n- Fresh load, settled: 'Effort: as hard as lifting 4.11 t … Courtesy ceiling: lifting 4.11 t. Past that, the throw presses the person harder than amusement rides allow.'\n- Reload, and while it reads 'working it out', set Ball to 'Rex tosses Ollie' (partner). That search finishes inside the 40 ms budget, so stepDuoPlan is never called and duoRunning stays on the person plan. Wait 15 s, then set Ball back to the person: 'Effort: as hard as lifting 4.17 t … Courtesy ceiling: lifting 4.17 t'.\n- Switching to the bus instead gives 4.13 t. Each result is the same on every run.\n- Control: switching to the baseball, whose search goes to the background and takes over duoRunning, gives 4.11 t on return.\n\nThe old plan's remaining probes called duoHarm('catch') with cObj 'partner' or 'bus' and memoized the answers under the person's key. The cached plan now calls 4.17 t harmless, although harm starts at about 4.11 t.\n\nSolo plans are not affected: they capture ctx and opt at creation, and the engine is pure.",
  "expected": "Every probe of a plan uses the settings in that plan's key. A superseded search must stop, or at least not write into the cache.",
  "fix": "In duoPlanFor, take a snapshot of state (and duoCap's inputs) when the plan is created. Pass it through harmAt to duoHarm, ctx and ctxOllie, for example ctx(overrides, st).\n\nAlso clear duoRunning whenever resolveDuoEffort resolves a different plan synchronously. In tick, return if the plan's key no longer equals the key for the current state."
 },
 {
  "id": "code-presence-mutations-uncaught",
  "severity": "major",
  "title": "test/presence.js misses 18 of 23 one-line engine mutations, including seven that undo round-1 fixes and every growth mode beyond grownBody",
  "location": "rex-strength-lab/test/presence.js (sections 2, 5, 6) at HEAD 64a38a1",
  "evidence": "Script: /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/review2/h-mutate.js. Each mutation goes into its own copy of the 64a38a1 engine, with src/data.js, test/ and research/ copied alongside; output in hmut/.\n\nCaught (5): fine-scan-off, sat-zero-speed, passenger-no-drag, air-hazard-1000Pa, soft-0.31.\n\nNot caught (suite ends 'all checks passed'):\n- Soil rule removed for Throw, Jump, Sprint and Stomp (round-1 claims-soft-ground-harm).\n- Jump landing no longer counts as breaking the ground (physics-jump-landing-hazard).\n- Stomp shak … [1,045 more characters on this line; the full prompt is in prompts/a16221678909cf2cc.txt]
  "expected": "Each round-1 fix and each claim in a check name or the README is protected by a check that fails when it is undone.",
  "fix": "Add targeted checks:\n- On sand, Throw, Jump and Sprint: the 'ground' hazard is false at the least-disruptive effort.\n- Jump on concrete: a landing ratio above 1 sets the ground hazard.\n- ppvAt(MOVES.stomp.shake({vFoot: stamp speed, holeDepth: 0}), 5) equals the Walk stamp's ppvAt(src[0], 5). My stamp-agree.js shows exact agreement today.\n- The stomp goal threshold equals VIB.TH.feelOnce.\n- The passenger hazard fires on launchGPeak.\n- instantGrowth on concrete for Chicxulub: launch 0 m (15 km uncapped), and vLeave ≤ (Fmax − m g) τ / m.\n- gradualGrowth T, Tp and Tu for Krakatoa and Chicxulub against hand-computed values.\n- Clap with Silent strike, as for Punch.\n- Ollie on soft clay is mired."
 },
 {
  "id": "code-presence-silent-skip",
  "severity": "minor",
  "title": "Section 2's 'stays under every hazard' check is skipped silently when the goal sits above the ceiling, so a regression removes checks instead of failing them",
  "location": "rex-strength-lab/test/presence.js:46 (`if (gl.use <= ce.below) {`)",
  "evidence": "At HEAD the output has 41 'least-disruptive reaches its goal' checks but 38 'stays under every hazard' checks.\n\nWith the soil-jump mutation, the lines 'jump least-disruptive stays under every hazard (sand)' and 'jump courtesy ceiling is harmless and plaster starts just above it (sand)' disappear from the output. In their place is 'jump courtesy ceiling is harmless and ground starts just above it (sand)', and the run still ends 'all checks passed'. Diff of the outputs from /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/review2/mut/soil-jump against the baseline. The README says presence.js checks that the least disruptive effort 'stays under every hazard whenever the ceiling allows'.",
  "expected": "Cases where the goal is expected to be harmless should fail when the goal rises above the ceiling, not drop out.",
  "fix": "List the expected-above-ceiling combinations explicitly; there are 3 today. For every other combination assert gl.use <= ce.below. Alternatively, assert the number of hazard checks run."
 },
 {
  "id": "code-background-search-cost",
  "severity": "minor",
  "title": "Heavy real-muscle throws: the background effort search takes about 15-20 s of main-thread time in chunks of up to 0.9 s, keeps running after leaving the tab, and drags run at about 1 s a frame (main: 0.3 s)",
  "location": "rex-strength-lab/src/app.html:2858-2872 (stepPlan: returns on p.done without cancelling the running plan; nothing cancels it on a non-effort tab), :2875-2878 (ready: the 40 ms budget can't bound a single probe)",
  "evidence": "Scripts are in /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/review2/.\n\n- Node, timing2.js: Throw pickup, sand, real, unlimited takes 25.6 s CPU for the plan (68 runs; longest single probe 1.6 s). Liberty on ice, real, unlimited: single probe 1.4 s.\n- Browser, pw-bg.js on the HEAD build with {action:'throw', obj:'pickup', surface:'sand', mode:'real', inf:true}: 'working it out' for 15.4 s; 53 long tasks summing 17.4 s, longest 924 ms. The same state on main: 4 long tasks, 1.4 s.\n- h-pw-leave.js: click Lift right after load. Over the next 20 s on the Lift tab there are 36 long tasks summing 11.9 s, longest 718 ms, with evaluate round-trips up to 471 ms.\n- pw-drag.js, dragging the dial from 1e20 to 1e29 kg in 12 frames:\n  - Throw pickup, real, sand, least: 581-1324 ms a frame (main: 292-383 ms).\n  - Throw car, real, soft clay, Courtesy ceiling: 871-1445 ms.\n  - Round 1's '100-140 ms a frame' holds only for light cases: Jump 69-168 ms, comic Throw about 100 ms.\n- Selecting 'Courtesy ceiling' once a plan exists stays short: 52-459 ms.",
  "expected": "Background work stops once its result can no longer be shown. A drag stays near main's cost.",
  "fix": "In renderBay, when the bay has no effort move, clearTimeout(planTimer) and set planRunning = null. In stepPlan, cancel the old timer and plan before returning for a done plan.\n\nDuring dial drags, use a zero budget and start the background search only after input settles (debounce). Optionally, run the preset jobs only once the effort select is opened."
 },
 {
  "id": "code-shots-closed-details",
  "severity": "minor",
  "title": "test/shots.js reads body.innerText, which skips closed <details>, so broken numbers in the hazard list, 'Show the math' or folded cards pass",
  "location": "rex-strength-lab/test/shots.js:39",
  "evidence": "In a scratch copy (/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/review2/shotmut) I prepended ' NaN ' to every hazard-list item in effortReadout and inserted 'NaN' into Pull's Show-the-math line.\n\n`node test/shots.js throw` and `node test/shots.js pull` print 'broken-text=[]' for all four views and exit 0.\n\npw-nan-dom.js on that build: 'throw NaN in body innerText: 0 | in bay textContent: 1 | closed details holding it: [haz-list]' and 'pull … [math]'. Round 1's code-7 fix moved the check to body.innerText, but innerText omits content that isn't rendered.",
  "expected": "The test fails on NaN, undefined or a bare Infinity anywhere in the page text, as the README says.",
  "fix": "Check the text of a clone of document.body with script and style removed (textContent), or open every <details> before reading innerText. My pw-corrupt.js does this and finds no broken text in the current build."
 },
 {
  "id": "code-ci-stale-dist",
  "severity": "minor",
  "title": "At HEAD 64a38a1 the committed dist/index.html does not match its sources, so CI's 'Committed builds match the sources' step fails",
  "location": "rex-strength-lab/dist/index.html line 3260 (commit 64a38a1); .github/workflows/test.yml step 'Committed builds match the sources'",
  "evidence": "On a fresh clone at 64a38a1 I ran CI's build steps: rex-strength-lab build-data.py and build.js; build-calculator build.js; build-comparison compile_facts.py and build.js. Then I ran CI's `git diff --exit-code --stat -- rex-strength-lab/src/data.js '*/dist/index.html' build-comparison/data/facts.json`. It exits 1 with 'rex-strength-lab/dist/index.html | 2 +-'.\n\nThe committed page still has the engine comment '…guessed inputs); footsteps were never measured.' The committed src/engine.js says '…one recorded person walking past at 53 m on sandy ground (Steinmann 2025) within about 2x.'\n\nThe engine.js edit (21:35:34) came after the dist rebuild in the round-2 data-lens commit.",
  "expected": "Generated files match their sources at every pushed commit.",
  "fix": "Run python build-data.py && node build.js, then commit dist/index.html."
 },
 {
  "id": "code-input-range-mismatch",
  "severity": "minor",
  "title": "Goal, growth-time and half-life inputs accept values that the load validation rejects, so the setting works for this visit and silently resets on reload",
  "location": "rex-strength-lab/src/app.html:2969 (goal input accepts any v > 0), :824-825 (#grow-t, #half-life accept any v > 0) against :650 and :654 (VALID: gThrow 0.1-1e9, gJump 0.01-1e9, gSprint 0.1-3e8, gPull 0.01-1e9, growT and halfLife 1e-3 to 1e12)",
  "evidence": "Script: /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/review2/pw-persist.js. On the Sprint tab, open 'Adjust effort', set the goal to 0.05 and press Enter.\n\n- Before reload: {goal: '0.05', saved: 0.05, line: 'The gentlest push that runs at 0.05 m/s.'}\n- After reload: {goal: '12.42', saved: 12.42}.\n\nThe same applies to a throw goal under 0.1 m or over 1e9 m, a jump goal under 1 cm, a pull goal under 10 ms, and growth times outside 1 ms to 1e12 s.",
  "expected": "Anything the page accepts survives a reload, or the input refuses it.",
  "fix": "Validate each input with the same num(lo, hi) as VALID (one shared table) and set min and max on the inputs. Alternatively, widen VALID to match the inputs."
 }
]
```

</details>


### Workflow `rex-presence-review` · 2026-10-11 20:43:30 UTC

- `Workflow` rex-presence-review: Adversarial review of the Rex lab presence build (effort, Walk tab, comic switches, growth): lenses find defects, one skeptic per lens reproduces or refutes each finding
  - run `wf_fc1e3d66-353`: 2 subagents, listed below

**Subagent `review:data`** · rex-presence-review · started 2026-10-11 20:43:32 UTC

- findings: 14 (1 major, 13 minor); verified ok: 21.
- Most severe: The stomp goal says 'most people can just feel' 1 mm/s, but the cited….

<details>
<summary>Prompt, verbatim (6,117 characters)</summary>

Workflow run `wf_fc1e3d66-353`, phase `Review`, agent `aa0b3ee58fd6a178e`.

```text
You are reviewing new work in the Rex Super-Strength Lab (/home/user/rex-strength-lab/rex-strength-lab/), a self-contained HTML page (claude.ai Artifact) that simulates Rex and Ollie (canon in CLAUDE.md, already loaded). The work implements /home/user/rex-strength-lab/rex-strength-lab/BRIEF-presence.md: read it first. It adds (1) effort, separate from strength, on every solo tab (the strength used for a move's push; the page opens on the least disruptive effort: the gentlest push that reaches each move's stated goal), a courtesy ceiling (the most effort before a hazard: sonic boom, air blast over 100 Pa within the 'near' distance, ground shaking over 12.7 mm/s there, ground breaking under him, his hands crushing the object) and not-so-heroic presets, and one shared effort in the two-player tests; (2) a Walk tab on ground vibration from their footsteps (gait scaled by Froude number, heel-strike impact energy, a scaled-distance PPV law, thresholds for feeling, a rippling water glass, rattling, cosmetic damage, losing footing; footprints); (3) comic switches (gentle hold, safe passenger, silent strike, soft landing, cool flight) and (4) absorbed-energy modes (endless ocean, gradual, instant, runaway growth) with growth forms (mix, size, density) and a growth what-if on the Weight tab.
Code: src/engine.js (search for driveStrength, RESTRAINT, VIB, WALK, walkStep, footprint, presence, PASSENGER, GROW, grownBody, gradualGrowth, instantGrowth, runawayGrowth; jump's landing; throw's gentleHold, launchG, dragLoss; catch's gentleT/gentleC/cool), src/app.html (search for EFFORT_PRESETS, resolveEffort, effortReadout, duoHarm, resolveDuoEffort, bayWalk, ppvChart, growthItems, absorbBlock, growthWhatIf, passengerText), src/static-data.js (assumption cards), build-data.py, research/final-presence.json (the new verified facts, with statuses and sources; the raw research and verifier outputs are in /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/wfout/), README.md, test/presence.js, test/calibration.js, test/shots.js.
Build: cd /home/user/rex-strength-lab/rex-strength-lab && python3 build-data.py && node build.js. Tests: node test/presence.js; node test/calibration.js (about 80 s); node test/shots.js (about 70 s; writes dist/preview.html and shots/). Render the page yourself with Playwright: require('/opt/node22/lib/node_modules/playwright'); chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); load dist/preview.html (after running test/shots.js once) from a file URL. Settings persist in localStorage key 'rex-lab-v1' (some reset on every load: effort, absorb, growWhat, stepEffort, duoEffort, oEffortOwn). window.DinoPhys is the engine and window.DINO_DATA the data.
The owner is a professional critic: factual accuracy and honest labelling come first (see CLAUDE.md). Do NOT edit anything under /home/user/rex-strength-lab. Write scratch scripts and screenshots under /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/review2/ (create it). Every finding must be reproduced: give the exact input or place, what the page or code does (quote it, or the script output), what is correct with your derivation or source, and a minimal fix. Report real defects only: wrong physics or formulas, wrong or unsupported claims, mislabelled status, contradictions between parts of the page, broken layout or controls, tests that don't test what they say. Skip style preferences.

This is review round 2. Earlier rounds found and fixed the items summarised below; check that each fix holds and look for regressions and anything missed:
Round 1 found 78 findings (77 confirmed) across physics, claims, data, UX and code; fixes are in commits 0ab5706 and dd459c6 on branch claude/rex-presence. Read rex-strength-lab/research/reviews/presence-round1.json: every finding has an 'outcome' (status and the change made). Check that each fix holds on the current HEAD (rebuild first), and look hard for regressions the fixes introduced: the courtesy-ceiling search now scans seven points inside the onset bracket and stops when a move saturates; effort searches run in the background after a 40 ms budget (the page shows all-out labelled 'working it out' until done); a soil rule (sinking into sand, gravel or clay is a footprint, not broken ground) now applies to every move; soft landing keeps the landing force; the Stomp tab's shaking uses the drill stamp's effective mass; the Walk tab judges the water glass on side-to-side shaking; WALK.SOFT is 0.51; a 'passenger' hazard (launch peak g and air drag g); instant growth's launch is capped by the ground's bearing; subsonic punches and claps are shown as thumps. The one item left unfixed on purpose: physics-real-jump-ground-flip (documented in the README's known limits). New research-file changes to check: airblast_rattle_onset_unfiltered (new derived fact), statuses changed to estimate on three facts, the footprint fact's display, and every new number the round 1 fixes put on the page (drag g, ASTM ramp, 1 mm/s transient stomp goal, 0.51 soft factor, N_c table interpolation).

LENS: DATA AND CITATIONS. Check research/final-presence.json fact by fact against its sources: fetch at least 25 of the cited URLs (ToolSearch "select:WebSearch,WebFetch"; curl PDFs) and confirm each number, unit conversion and quote; check statuses follow the house vocabulary (verified only if the number was seen in a fetched primary or authoritative source; derived for our computations, with the formula; estimate for assumptions; reported for secondary or weak sources); check the verifiers' corrections (in the scratchpad wfout/verify_*.json) were applied; check that every constant in the engine's new code (VIB, WALK, PRINT, PASSENGER, RESTRAINT.R, GROW) matches a fact or is labelled an estimate on the page and in the Sources table, and that build-data.py puts each new fact the page uses into the Sources table with the right status and link.

Under verified_ok, list what you checked and found correct. Prefix finding ids with "data-".
```

</details>

**Subagent `verify:data`** · rex-presence-review · started 2026-10-11 21:16:49 UTC

- verdicts: 14 (14 confirmed).

<details>
<summary>Prompt, verbatim (26,354 characters)</summary>

Workflow run `wf_fc1e3d66-353`, phase `Verify`, agent `a12398ab96ace8f8a`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/a12398ab96ace8f8a.txt](prompts/a12398ab96ace8f8a.txt).

```text
You are reviewing new work in the Rex Super-Strength Lab (/home/user/rex-strength-lab/rex-strength-lab/), a self-contained HTML page (claude.ai Artifact) that simulates Rex and Ollie (canon in CLAUDE.md, already loaded). The work implements /home/user/rex-strength-lab/rex-strength-lab/BRIEF-presence.md: read it first. It adds (1) effort, separate from strength, on every solo tab (the strength used for a move's push; the page opens on the least disruptive effort: the gentlest push that reaches each move's stated goal), a courtesy ceiling (the most effort before a hazard: sonic boom, air blast over 100 Pa within the 'near' distance, ground shaking over 12.7 mm/s there, ground breaking under him, his hands crushing the object) and not-so-heroic presets, and one shared effort in the two-player tests; (2) a Walk tab on ground vibration from their footsteps (gait scaled by Froude number, heel-strike impact energy, a scaled-distance PPV law, thresholds for feeling, a rippling water glass, rattling, cosmetic damage, losing footing; footprints); (3) comic switches (gentle hold, safe passenger, silent strike, soft landing, cool flight) and (4) absorbed-energy modes (endless ocean, gradual, instant, runaway growth) with growth forms (mix, size, density) and a growth what-if on the Weight tab.
Code: src/engine.js (search for driveStrength, RESTRAINT, VIB, WALK, walkStep, footprint, presence, PASSENGER, GROW, grownBody, gradualGrowth, instantGrowth, runawayGrowth; jump's landing; throw's gentleHold, launchG, dragLoss; catch's gentleT/gentleC/cool), src/app.html (search for EFFORT_PRESETS, resolveEffort, effortReadout, duoHarm, resolveDuoEffort, bayWalk, ppvChart, growthItems, absorbBlock, growthWhatIf, passengerText), src/static-data.js (assumption cards), build-data.py, research/final-presence.json (the new verified facts, with statuses and sources; the raw research and verifier outputs are in /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/wfout/), README.md, test/presence.js, test/calibration.js, test/shots.js.
Build: cd /home/user/rex-strength-lab/rex-strength-lab && python3 build-data.py && node build.js. Tests: node test/presence.js; node test/calibration.js (about 80 s); node test/shots.js (about 70 s; writes dist/preview.html and shots/). Render the page yourself with Playwright: require('/opt/node22/lib/node_modules/playwright'); chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); load dist/preview.html (after running test/shots.js once) from a file URL. Settings persist in localStorage key 'rex-lab-v1' (some reset on every load: effort, absorb, growWhat, stepEffort, duoEffort, oEffortOwn). window.DinoPhys is the engine and window.DINO_DATA the data.
The owner is a professional critic: factual accuracy and honest labelling come first (see CLAUDE.md). Do NOT edit anything under /home/user/rex-strength-lab. Write scratch scripts and screenshots under /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/review2/ (create it). Every finding must be reproduced: give the exact input or place, what the page or code does (quote it, or the script output), what is correct with your derivation or source, and a minimal fix. Report real defects only: wrong physics or formulas, wrong or unsupported claims, mislabelled status, contradictions between parts of the page, broken layout or controls, tests that don't test what they say. Skip style preferences.

This is review round 2. Earlier rounds found and fixed the items summarised below; check that each fix holds and look for regressions and anything missed:
Round 1 found 78 findings (77 confirmed) across physics, claims, data, UX and code; fixes are in commits 0ab5706 and dd459c6 on branch claude/rex-presence. Read rex-strength-lab/research/reviews/presence-round1.json: every finding has an 'outcome' (status and the change made). Check that each fix holds on the current HEAD (rebuild first), and look hard for regressions the fixes introduced: the courtesy-ceiling search now scans seven points inside the onset bracket and stops when a move saturates; effort searches run in the background after a 40 ms budget (the page shows all-out labelled 'working it out' until done); a soil rule (sinking into sand, gravel or clay is a footprint, not broken ground) now applies to every move; soft landing keeps the landing force; the Stomp tab's shaking uses the drill stamp's effective mass; the Walk tab judges the water glass on side-to-side shaking; WALK.SOFT is 0.51; a 'passenger' hazard (launch peak g and air drag g); instant growth's launch is capped by the ground's bearing; subsonic punches and claps are shown as thumps. The one item left unfixed on purpose: physics-real-jump-ground-flip (documented in the README's known limits). New research-file changes to check: airblast_rattle_onset_unfiltered (new derived fact), statuses changed to estimate on three facts, the footprint fact's display, and every new number the round 1 fixes put on the page (drag g, ASTM ramp, 1 mm/s transient stomp goal, 0.51 soft factor, N_c table interpolation).

Another reviewer (data lens) reported the findings below. For EACH one, try hard to REFUTE it: reproduce it yourself with your own script or browser run, independently of theirs. Mark real=true only if you reproduced it. Confirm the severity and give the best minimal fix (exact code or text). Default to real=false if you cannot reproduce it.

FINDINGS:
[
 {
  "id": "data-stomp-goal-most-people-feel",
  "severity": "major",
  "title": "The stomp goal says 'most people can just feel' 1 mm/s, but the cited data put the average person's threshold for a short jolt at about 2.4–3.3 mm/s",
  "location": "src/app.html:2829 (GOALS.stomp text); src/static-data.js:14 ('Effort is not strength' card); src/engine.js:2853 (VIB.TH.feelOnce comment); research/final-presence.json thr_rec_feel (display)",
  "evidence": "With default settings the Stomp tab says: 'Effort: 0.13% of his strength (as hard as lifting 122 kg). The gentlest push that makes a stomp most people can just feel 5 m away (1 mm/s, the level for one isolated jolt).' The card repeats the claim ('...1 mm/s, the level for one isolated jolt: Caltrans'). The engine comment calls it 'barely felt by most people'.\n\nThe sources, fetched:\n- Caltrans 2020 (tcvgm-apr2020-a11y.pdf) Table 20 lists 'Barely perceptible 0.04' in/s for transient sources. It gives no share of people.\n- Caltrans Table 6 says its transient scale is 'another st … [1,070 more characters on this line; the full prompt is in prompts/a12398ab96ace8f8a.txt]
  "expected": "1 mm/s is Caltrans's 'barely perceptible' level for one jolt. The data behind it (Wiss & Parmelee via USBM RI 8507) make that the average person's level only for 5 s events. For a jolt of a few tens of milliseconds, only sensitive people would notice 1 mm/s; the average person needs about 3 mm/s (0.5 s row, 0.130 in/s).",
  "fix": "Reword the goal, card and engine comment, for example: 'a stomp at the level Caltrans calls barely perceptible for one jolt (1 mm/s); sensitive people notice it, the average person needs about 3 mm/s for a jolt this short (USBM RI 8507 Table 15)'. Alternatively, set VIB.TH.feelOnce = 3.3e-3 with that label. Correct the thr_rec_feel display so it no longer says 'most people from about 1 mm/s'. On the Walk tab, label 0.3 mm/s 'just perceptible (sensitive people, indoors)'."
 },
 {
  "id": "data-windows-break-3p4kpa",
  "severity": "minor",
  "title": "Growth text says breaking windows 'takes about 3.4 kPa', against the project's own verified glass data; 'windows break' means three different pressures on the page",
  "location": "src/app.html:1058 (instant growth winText), src/app.html:1048 (gradual growth '(windows break from 3.4 kPa)'), src/app.html:1056, src/engine.js:3047 (DP_WINDOWS 6900)",
  "evidence": "Reproduction (scratchpad review2/win_check.js): instantGrowth(Rex, 1e19 J, mix, concrete) gives dpLo 1,098 Pa and dpHi 2,061 Pa. Since dpHi < 3400, the page prints ', too little to break windows (that takes about 3.4 kPa).'\n\nThe sources, fetched:\n- USBM RI 8485 (resolutionmineeis PDF), p. 60: 'there is a consensus that damage becomes improbable below approximately 0.030 lb/in2 (140 dB)'.\n- RI 8485 App. G: 'glass under strain could fail at overpressures as low as 0.10 lb/in2 (151 dB)', which is 690 Pa.\n- The project's verified fact comic_glass_breakage_low_end adds precracked panes failing from 364 Pa.\n- Glasstone Table 5.145 (fourmilab eonw_5.pdf): 'Glass windows, large and small | Shattering usually, occasional frame failure | 0.5-1.0' psi. So 3.4 kPa is where windows usually shatter, not where breaking starts.\n\nOn the same page:\n- The 'Break windows across the street' preset and the Stomp blast chart use 6.9 kPa ('Windows shatter').\n- Instant growth's 'windows break out to X–Y' uses 6.9 kPa at the low end and 3.4 kPa at the high end.\n- The gradual text says 'windows break from 3.4 kPa'.",
  "expected": "At 1–2 kPa, weak or precracked panes near him can break (from about 364–690 Pa per RI 8485). 3.4–6.9 kPa is the band where windows usually shatter. One wording per threshold.",
  "fix": "Replace 'too little to break windows (that takes about 3.4 kPa)' and '(windows break from 3.4 kPa)' with 'below the 3.4 kPa at which windows usually shatter (Glasstone & Dolan); weak or cracked panes can break from about 0.4–0.7 kPa (USBM RI 8485)'. Optionally, add a 'some panes may break' reach at 690 Pa. Name the 6.9 kPa threshold 'windows shatter' everywhere, preset included."
 },
 {
  "id": "data-plaster-preset-name",
  "severity": "minor",
  "title": "Preset 'Crack the plaster next door' fires at the 12.7 mm/s safe limit (about a 5% worst-case chance of hairline cracks), and the page never shows the 50% point the verifier asked for",
  "location": "src/app.html:587 (EFFORT_PRESETS label), src/engine.js RESTRAINT.PRESETS.plaster (VIB.TH.plaster)",
  "evidence": "The select label reads 'Crack the plaster next door'. PRESETS.plaster fires when ppvAt(...) >= VIB.TH.plaster = 12.7 mm/s.\n\nThe sources, fetched:\n- Caltrans 2020 Table 13, after Siskind: 'Threshold damage: loosening of paint, small plaster cracks ... 0.5 [5%] 0.7 [10%] 2.5 [50%] 9.0 [90%]' in/s.\n- USBM RI 8507 Conclusion 6 calls 0.50 in/s a 'practical safe' level.\n\nThe verifier's correction for thr_rec_cosmetic_damage (wfout/verify_thresholds.json) says: 'The page should give the 50% point (about 64 mm/s, Siskind via Caltrans) alongside it.' grep '64 mm' over src/app.html and src/static-data.js finds nothing. The preset's own description ('plaster may crack') is accurate; the select label is not.",
  "expected": "At 12.7 mm/s cracking is possible but unlikely (at most 5% of houses in the worst case). The least effort that actually cracks plaster in a typical house is nearer 64 mm/s (50%).",
  "fix": "Rename the preset 'Risk cracking the plaster next door' (12.7 mm/s, the safe limit). Or move it to the 64 mm/s 50% point and say 'about half of houses get hairline cracks (Siskind 1980 via Caltrans)'. Show 64 mm/s next to the safe limit in the ceiling card or the hazard list."
 },
 {
  "id": "data-merge-script-reverts-fixes",
  "severity": "minor",
  "title": "The documented build of final-presence.json would silently undo every round 1 data fix, and its inputs are not in the repo",
  "location": "rex-strength-lab/research/merge_presence.py; README.md:64",
  "evidence": "README.md:64: 'final-presence.json (267 facts ...) is assembled by research/merge_presence.py from the compiled research'.\n\nI copied the script with its output redirected to the scratchpad (review2/merge_copy.py) and ran it on scratchpad/compiled. It wrote '267 facts from 7 topics'. Compared with the committed file:\n- airblast_rattle_onset_unfiltered (the new derived fact) is missing.\n- 9 facts differ, including the status of step_rex_ollie_walking_foot_load, step_elephant_vs_rex_footfall and growth_slow_tmin_examples (back to 'derived'), the footprint display, the shimmer and rings displays, and comic_airblast_rattle_onset's label.\n\nThe compiled topic files exist only in the session scratchpad, not in the repo, so the collaborator cannot rerun the script at all. The committed file now has 268 facts, not 267.",
  "expected": "The repo states which file is the source of truth, and its count is right. Rerunning a documented step must not lose reviewed corrections.",
  "fix": "Either commit the compiled topic files and a patch step that applies the review fixes, or mark final-presence.json as the hand-maintained source of truth (in the script docstring and README) and stop documenting it as generated. Update '267 facts' to 268."
 },
 {
  "id": "data-round1-status-notes-boilerplate",
  "severity": "minor",
  "title": "Round 1 status changes carry one pasted reason that is partly wrong for each fact, and the same rule was applied unevenly",
  "location": "research/final-presence.json: step_rex_ollie_walking_foot_load, step_elephant_vs_rex_footfall, growth_slow_tmin_examples (notes); step_rex_ollie_stamp_load (status)",
  "evidence": "All three notes end with: 'Review round 1 (data lens): status estimate (was derived): the numbers rest on estimated inputs (sole areas from the picture; the side factor and the growth profile).' The gradual-growth durations use no sole areas, and the two foot-load facts use neither a side factor nor a growth profile.\n\nstep_rex_ollie_stamp_load has the same structure as walking_foot_load: a force from canon mass times a measured multiple, plus pressures from the picture-estimated soles ('Rex's paw 420–620 kPa, Ollie's boot 870–1,280 kPa'). It is still 'derived', while walking_foot_load was moved to 'estimate' for exactly that reason.",
  "expected": "Each note gives that fact's own reason, and facts with the same basis get the same status.",
  "fix": "Write a separate reason per fact: 'sole areas from the picture' for the two foot facts, 'equivalent-ball side factor and the 1 − cos growth profile (our choices)' for growth_slow_tmin_examples. Set step_rex_ollie_stamp_load to estimate, or split it into a derived force and estimated pressures."
 },
 {
  "id": "data-glass-threshold-unlabelled",
  "severity": "minor",
  "title": "Walk tab shows the water-glass thresholds (0.2 and 0.7 mm/s) and the canon result without saying they are model estimates",
  "location": "src/app.html:3189-3192 (threshold list), 3166 (verdict), 3212 (canon sentence)",
  "evidence": "Walk tab text at default settings:\n- 'A glass of water ripples (0.2 mm/s): not even 1 m away.'\n- 'Rings in the glass (the film look) (0.7 mm/s): not even 1 m away.'\n- Verdict: 'Close to what a glass of water shows.'\n- Canon sentence: 'a glass 3 m away ripples with ordinary steps (46% of the way from soft-footed to a stamp)'.\n\nNone of these carries a status. On the same tab, the 3 m tile says 'estimate, about 3–5× either way' and the rattle note says '1 mm/s is our estimate'.\n\nThe research: ripple_no_measured_threshold is 'Unknown: no measured value found'. ripple_threshold_shimmer and ripple_threshold_rings are estimates from a model with an assumed 10-arcmin visibility criterion, 'Likely error up to a factor of 10'. The brief requires: 'find a measured value or derive one, and label which'. Only the assumptions card mentions it.",
  "expected": "Where the glass thresholds appear, the page says they are our estimates from a ripple model (no measurement exists), uncertain by up to 10×.",
  "fix": "Add '(our estimate from a ripple model; nobody has measured it; could be 10× either way)' to the two glass lines and to the canon sentence's glass clause, as the rattle line already does."
 },
 {
  "id": "data-threshold-tests-untested",
  "severity": "minor",
  "title": "presence.js claims to check each threshold's conversion, but most thresholds can change tenfold and every test still passes",
  "location": "rex-strength-lab/test/presence.js:90, 111-117; README.md:57",
  "evidence": "Section header (test/presence.js:90): 'reproduces its sourced anchors and each threshold's worked conversion'. README: tests check 'each threshold's conversion'.\n\nOnly plaster (0.5 in/s) and plasterWalk (0.3 in/s) are compared with their sources. Line 117 ('the other walking thresholds are the sourced ones') compares the engine with itself: thw.feel === P.VIB.TH.feel.\n\nMutation run on a copy in the scratchpad (review2/mut): VIB.TH set to feel 3e-3, feelOnce 3.3e-3, shimmer 2e-3, rings 7e-3, rattle 10e-3. Result: '239 checks, all checks passed'.",
  "expected": "Each sourced or estimated threshold, and the other new constants, are pinned to the fact they come from.",
  "fix": "Add checks that read value_si from research/final-presence.json:\n- feel 0.3 mm/s (thr_bs5228_2_table_b1_effects), feelOnce 0.04 in/s (thr_caltrans2020_table20...), shimmer and rings (ripple_threshold_*), rattle (thr_rec_rattle), footing (thr_rec_footing).\n- DP_RATTLE vs airblast_rattle_onset_unfiltered, DP_HARM vs comic_airblast_safe_max.\n- PASSENGER.EIBAND vs comic_eiband_voluntary_limits.\n- WALK.SOFT = 1 − 0.487 (step_yoon2025_quiet_walking).\n- NC_DEPTH vs step_em1110_clay_depth_factor."
 },
 {
  "id": "data-sources-truncation-hides-basis",
  "severity": "minor",
  "title": "The Sources table keeps only two links per fact, so the rows for the recommended rattle and walk-past plaster values don't link the source that sets the number shown",
  "location": "rex-strength-lab/build-data.py:48 (src(..., limit=2)) and :393",
  "evidence": "thr_rec_rattle shows 'About 1 mm/s PPV (range 0.3-3 mm/s)'. Its sources are ordered Caltrans, FTA, RI 8507, EMS-98, ShakeMap, and the row links only Caltrans and FTA. Both of those say rattling happens at or below perception (about 0.25–0.3 mm/s). The 1 mm/s comes from 'the lower edge of intensity IV acceleration (1.4-3.9 %g, Wald 1999)' (the fact's notes), which is the dropped 5th source. I confirmed IV = 1.4–3.9 %g in ShakeMap Figure 2.5 (USGS TM 12-A1, p. 56).\n\nthr_rec_cosmetic_damage shows 'a walk past (repeated steps): 7.6 mm/s' but links RI 8507 and BS 5228. The 7.6 mm/s is Caltrans Table 19 ('Older residential structures ... 0.3' in/s continuous, fetched), its dropped 3rd source.",
  "expected": "Each row links at least the source behind the number it displays.",
  "fix": "In build-data.py, show all sources for thr_rec_* rows (as already done for heat_to_vaporise_per_kg). Or reorder those facts' sources so the value-setting source comes first: ShakeMap for rattle, Caltrans for cosmetic damage."
 },
 {
  "id": "data-raw-keys-in-sources",
  "severity": "minor",
  "title": "Sources-table text points readers to a research key they cannot find on the page",
  "location": "research/final-presence.json: comic_airblast_rattle_onset and growth_airblast_usbm_ri8485 (display), shown in the Sources table",
  "evidence": "Rendered rows:\n- 'Comic switches: airblast at which people start to notice rattling ... (20 Pa as read on that meter; about 36 Pa unfiltered, our conversion: see airblast_rattle_onset_unfiltered)'.\n- 'Growth: airblast levels that rattle houses but do no damage | ... (about 36 Pa unfiltered by our conversion: airblast_rattle_onset_unfiltered)'.\n\nThe table shows labels, not keys. The row this refers to is labelled 'Comic switches: rattling onset as an unfiltered peak pressure (our conversion of USBM's 120 dB on a 6 Hz meter)'.",
  "expected": "Cross-references in page text use names a reader can find.",
  "fix": "Change both displays to 'see the row \"Rattling onset as an unfiltered peak pressure\"', or drop the pointer."
 },
 {
  "id": "data-label-casing-names",
  "severity": "minor",
  "title": "The round 1 casing fix still lowercases names in Sources labels ('taylor's', 'sirius B', 'newtonian', 'schwarzschild')",
  "location": "rex-strength-lab/build-data.py:28-39 (NAMES, lower_first)",
  "evidence": "Rendered presence row: 'Growth: taylor's expanding sphere (1946), as described by Courant & Friedrichs'. NAMES has 'Taylor' but not \"Taylor's\".\n\nThe same function also lowercases these rows:\n- 'Weight: sirius B (white dwarf): mass and radius'\n- 'Weight: newtonian constant of gravitation'\n- 'Weight: schwarzschild radius ...'\n- \"Weight: buchdahl's limit ...\"\n- \"Weight: stevenson's proposal ...\"\n- 'Arm wrestling and wrestling: world Armwrestling Federation regulation table ...'\n- 'Arm wrestling and wrestling: newtonian constant of gravitation'",
  "expected": "Proper names keep their capitals.",
  "fix": "Strip a trailing ’s/'s before the NAMES lookup, and add Sirius, Newtonian, Schwarzschild, Buchdahl, Stevenson and World to NAMES. Or lowercase only words on an explicit list of common nouns."
 },
 {
  "id": "data-stale-code-comments",
  "severity": "minor",
  "title": "Engine comments give a stale status and an old fact key for two new constants",
  "location": "src/engine.js:2856, src/engine.js:3046",
  "evidence": "engine.js:2856: '//   rings: concentric rings in the glass, the film look (derived: about 0.5-1 mm/s vertical)'. ripple_threshold_rings is 'estimate'; round 1 changed its display from 'derived, not measured' to 'estimate from a model'.\n\nengine.js:3046: 'DP_RATTLE: 36, // ... roughly 36 Pa unfiltered (growth_airblast_usbm_ri8485)'. Round 1 moved this number to its own derived fact, airblast_rattle_onset_unfiltered, which says it is 'Used by ... RESTRAINT.R.DP_RATTLE'.",
  "expected": "Code comments name the right fact and status, because they are how a constant is traced to its source.",
  "fix": "Change 'derived' to 'estimate' on line 2856, and cite airblast_rattle_onset_unfiltered (derived) on line 3046."
 },
 {
  "id": "data-weak-energy-ranges-unlabelled",
  "severity": "minor",
  "title": "Growth what-if calls encyclopedia figures quoted in an unrefereed preprint 'published estimates' without saying so",
  "location": "src/app.html:1657-1658 (growthWhatIf 'firm' texts)",
  "evidence": "The page says: 'Claimed: 8.4 × 10¹⁷ J (200 Mt) is a popular figure. Published estimates run from about 10¹⁷ to 6.3 × 10¹⁸ J ...'.\n\nThat range comes from growth_krakatoa_energy_spread (status 'disputed'; notes: 'An unrefereed preprint by an outlier author'). I fetched Lobanovsky (arXiv:1311.6565). The 1.5 Gt (6.3 × 10¹⁸ J) is from 'another encyclopedic resource', the 200 Mt from Wikipedia, and 10¹⁷ J from 'a book published by the American Geological Society'.\n\nThe Chicxulub line 'Disputed: published estimates run from about 10²³ to 10²⁴ J' rests on energy_chicxulub_impact, which cites only Wikipedia and an arXiv preprint. CLAUDE.md: 'Fan sites and magazines only when nothing better exists, and then say so.'",
  "expected": "The text says where the weak ranges come from.",
  "fix": "Use 'Figures quoted in encyclopedias and a popular book run from about 10¹⁷ to 6.3 × 10¹⁸ J (as collected in an unrefereed preprint, Lobanovsky 2013)' and 'Wikipedia's summary of the literature: about 10²³ to 10²⁴ J'."
 },
 {
  "id": "data-punch-goal-elite-boxers",
  "severity": "minor",
  "title": "The punch goal says 6.6–12.5 m/s was 'measured in elite boxers'; the source studied four experienced boxers, and the research had already removed 'elite'",
  "location": "src/app.html:2830 (GOALS.punch text)",
  "evidence": "Punch tab: '...throws a punch as fast as the strongest human’s (10.4 m/s in this model, inside the 6.6–12.5 m/s measured in elite boxers).'\n\nWhiting et al. 1988 abstract (Europe PMC, PMID 3377096, fetched): 'four experienced boxers were filmed ... peak velocities of 6.6 to 12.5 m/s'.\n\nThe research fact punch_fist_speed_elite_measured notes: 'Label corrected from 'elite': 11.95 is an amateur mean.'",
  "expected": "'measured in experienced boxers (four, filmed; Whiting et al. 1988)'.",
  "fix": "Replace 'elite boxers' with 'experienced boxers' in GOALS.punch."
 },
 {
  "id": "data-footsteps-never-measured",
  "severity": "minor",
  "title": "Page says footsteps were never measured, but the research file holds a measured human walking record that the model matches within 2×",
  "location": "src/static-data.js:18 ('nobody has measured footsteps this way'); src/app.html:3219 (Walk math 'footsteps themselves were never measured'); src/engine.js:2832; README.md:78",
  "evidence": "elephant_steinmann2025_other_animals (derived, from Steinmann et al. 2025 Fig. 3c, fetched and viewed: 'human, NWP05, 53 m', displacement axis ×1e-8) gives a human at 53 m on the same sandy dry station as the elephant: about 0.002 mm/s (1.6e-8 m at 20 Hz).\n\nThe engine, for an ordinary step (effort 0.5, comfortable walk) of a 1.75 m, 76.7 kg person on 'sand' at 53 m, gives 1.19e-3 mm/s (scratchpad review2/human_check.js). That is within 2× of the record.\n\nSo a footstep was measured this way, and it checks the model directly. The page instead claims no footstep measurement exists and relies on a drop test and 'loosely' on elephants.",
  "expected": "State the one human anchor and its result, with its caveats: one record, gait and mass unknown, camera-trap distance.",
  "fix": "Replace 'footsteps themselves were never measured' with 'one recorded human walk (Steinmann et al. 2025, 53 m on sandy ground, about 0.002 mm/s) agrees within about 2× for an average adult'. Add it to test/presence.js as an anchor."
 }
]
```

</details>


- `Artifact` read https://claude.ai/artifact/YFpbHtX8tM2Qwffd6znbZP

**Claude · 2026-10-11 20:43:44 UTC**

The live page is the previous build (version 1791741325-b30e). Publishing the round 1 build to the same URL.


- `Artifact` publish https://claude.ai/artifact/YFpbHtX8tM2Qwffd6znbZP /home/user/rex-strength-lab/rex-strength-lab/dist/index.html

**Claude · 2026-10-11 20:44:03 UTC**

Published (version 6 at the same URL). Updating task tracking and STATUS, then opening the pull request now so CI runs while round 2 continues.


- `ToolSearch` select:TaskUpdate,mcp__github__create_pull_request,mcp__github__get_me
- `TaskUpdate` #2 status=completed
- `TaskUpdate` #3 status=completed
- `TaskUpdate` #4 status=completed
- `TaskUpdate` #5 status=completed
- `Bash` STATUS update; check branch is up to date with main: `cd /home/user/rex-strength-lab; python3 - <<'EOF'` (+9 lines)
  - result: Exit code 1
  - result: bf35e82 Merge pull request #10 from RoscoeRackham/claude/hopeful-keller-vly1s9
  - result: dfdbe27 STATUS: live pages republished from main; PR #9 merged


> **Commit** `da39a14` · 2026-10-11 20:44:13 UTC · STATUS: round 1 build published (version 6); review round 2 running  [rex-strength-lab]

**Claude · 2026-10-11 20:44:19 UTC**

`main` has moved on (PR #10 merged). Merging it into the branch before opening the PR.


- `Bash` See what main changed since the branch point: `cd /home/user/rex-strength-lab; B=$(git merge-base HEAD origin/main); git log --oneline $B..origin/main; git diff --stat $B origin/main | tail -15`
- `Bash` Show main's STATUS change and merge main: `cd /home/user/rex-strength-lab; git diff $(git merge-base HEAD origin/main) origin/main -- STATUS.md; git merge --no-edit origin/main 2>&1 | tail -3; git sta...`
- `Bash` Show the conflicted STATUS file: `cd /home/user/rex-strength-lab; cat STATUS.md | head -80`
- `Bash` Resolve STATUS conflict, commit merge, push: `cd /home/user/rex-strength-lab; python3 - <<'EOF'` (+29 lines)


> **Commit** `d048813` · 2026-10-11 20:44:41 UTC · Merge main into claude/rex-presence (STATUS from #10)  [rex-strength-lab]

**Claude · 2026-10-11 20:44:47 UTC**

Merged `main` (only STATUS changed there). Opening the pull request.


- `mcp__github__create_pull_request` {"owner": "RoscoeRackham", "repo": "rex-strength-lab", "head": "claude/rex-presence", "base": "main", "title": "Rex lab: restraint and presence (BRIEF-presence.md): effort, courtesy ceiling, Walk t...
- `mcp__claude-code-remote__subscribe_pr_activity` {"owner": "RoscoeRackham", "repo": "rex-strength-lab", "pullNumber": 11}

**Claude · 2026-10-11 20:45:14 UTC**

PR #11 is open and I'm subscribed to its CI and review events. Checking for repo-specific PR guidance.


- `Bash` Check for steward/babysit skills and CI config: `cd /home/user/rex-strength-lab; ls .claude/skills 2>/dev/null; ls .claude 2>/dev/null; cat .github/workflows/test.yml | head -60`

**Claude · 2026-10-11 20:45:20 UTC**

Status: PR #11 is open (https://github.com/RoscoeRackham/rex-strength-lab/pull/11) and the round 1 build is live as version 6 at the existing URL. Review round 2 (all five lenses) and CI are running; I'll fix what round 2 confirms, republish, then write the `history/` entry.


*Woken · 2026-10-11 20:45:22 UTC · Background task None pending: 1 unread notification (GitHub activity on a subscribed PR: 1). Next: CI is running on the PR (no Claude Approvals check in this repo). Arming one safety-net check-in in case an event is lost.*


- `ReadNotifications` {}
- `ToolSearch` select:mcp__github__pull_request_read,mcp__github__actions_list,mcp__github__get_job_logs
- `mcp__github__pull_request_read` {"method": "get_check_runs", "owner": "RoscoeRackham", "repo": "rex-strength-lab", "pullNumber": 11}

**Claude · 2026-10-11 20:45:34 UTC**

CI is running on the PR (no Claude Approvals check in this repo). Arming one safety-net check-in in case an event is lost.


- `mcp__claude-code-remote__send_later` {"delay_minutes": 50, "message": "Safety-net check-in for PR #11 (RoscoeRackham/rex-strength-lab): check CI on the current head, mergeability and review threads; act on anything red. Also check the...

**Claude · 2026-10-11 20:45:37 UTC**

Waiting on CI for PR #11 and on review round 2. A check-in is set for 21:36 UTC.


- `ReadNotifications` {}
- `mcp__github__pull_request_read` {"method": "get_check_runs", "owner": "RoscoeRackham", "repo": "rex-strength-lab", "pullNumber": 11}

**Claude · 2026-10-11 20:49:55 UTC**

CI passed on PR #11 (head d048813, 4.5 minutes). Waiting for review round 2.


*Woken · 2026-10-11 21:32:05 UTC · Background task wrlfihny2 completed: Dynamic workflow "Adversarial review of the Rex lab presence build (effort, Walk tab, comic switches, growth): lenses find defects, one skeptic per lens reproduces or refutes each finding" completed. Next: The model gives 0.0012 mm/s for a person walking 53 m away on sand, against 0.002 mm/s recorded (Steinmann 2025): within 2×. Adding that as an anchor and applying the other data fixes.*


- `Bash` Print round 2 data findings with verdicts: `cd /root/.claude/projects/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/subagents/workflows/wf_fc1e3d66-353; python3 - <<'EOF'` (+8 lines)
- `Bash` Read the fact values for threshold tests: `cd /home/user/rex-strength-lab/rex-strength-lab; python3 - <<'EOF'` (+8 lines)
- `Bash` Read the human walk record and feel display: `cd /home/user/rex-strength-lab/rex-strength-lab; python3 - <<'EOF'` (+6 lines)
- `Bash` Model a person walking at 53 m on sand: `cd /home/user/rex-strength-lab/rex-strength-lab; node -e "` (+2 lines)

**Claude · 2026-10-11 21:32:46 UTC**

The model gives 0.0012 mm/s for a person walking 53 m away on sand, against 0.002 mm/s recorded (Steinmann 2025): within 2×. Adding that as an anchor and applying the other data fixes.


- `Bash` Fact fixes: feel display, status reasons, stamp load, row pointers: `cd /home/user/rex-strength-lab/rex-strength-lab; python3 - <<'EOF'` (+20 lines)
- `Bash` All sources for recommended thresholds; name casing: `cd /home/user/rex-strength-lab/rex-strength-lab; python3 - <<'EOF'` (+11 lines)
- `Bash` Page, card and engine text fixes from the data lens: `cd /home/user/rex-strength-lab/rex-strength-lab; python3 - <<'EOF'` (+42 lines)
- `Bash` Clean the glass label; find merge-script docs: `cd /home/user/rex-strength-lab/rex-strength-lab; python3 - <<'EOF'` (+6 lines)
- `Bash` README: facts file is hand-maintained since round 1: `cd /home/user/rex-strength-lab/rex-strength-lab; head -12 research/merge_presence.py; python3 - <<'EOF'` (+6 lines)
- `Bash` Merge script docstring; find its write: `cd /home/user/rex-strength-lab/rex-strength-lab; python3 - <<'EOF'` (+12 lines)

**Claude · 2026-10-11 21:33:51 UTC**

Fixing round 2's data-lens findings: making the merge script refuse to overwrite the hand-edited facts file, then adding threshold tests checked against the research file.


- `Bash` Merge-script guard; threshold-vs-research tests and human walk anchor: `cd /home/user/rex-strength-lab/rex-strength-lab; python3 - <<'EOF'` (+34 lines)
- `Bash` Use the exact 0.04 in/s for one jolt: `cd /home/user/rex-strength-lab/rex-strength-lab; sed -i "s/TH: { feel: 0.3e-3, feelOnce: 1e-3,/TH: { feel: 0.3e-3, feelOnce: 0.04 * 0.0254,/" src/engine.js; ...`
- `Bash` Find remaining 'never measured' and 'elite' claims: `cd /home/user/rex-strength-lab/rex-strength-lab; grep -n "never measured\|elite" README.md src/*.js src/app.html | cut -c1-200`
- `Bash` Update 'never measured' in README and engine comment: `cd /home/user/rex-strength-lab/rex-strength-lab; sed -n 78p README.md | cut -c1-400; sed -i "2832s/footsteps were never measured\./one recorded person walkin...` (+6 lines)
- `Bash` Start the round 2 outcome notes: `cat > /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/dev/r2_outcomes.json <<'EOF'` (+18 lines)
- `Bash` Run the screenshot test: `cd /home/user/rex-strength-lab/rex-strength-lab; timeout 300 node test/shots.js 2>&1 | tail -5`

**Claude · 2026-10-11 21:37:04 UTC**

Round 2 data-lens fixes pass all tests; committing them. The other two round 2 workflows (physics/claims, UX/code) are still running.


- `Bash` Commit and push round 2 data fixes: `cd /home/user/rex-strength-lab; git add -A rex-strength-lab; git reset -q rex-strength-lab/shots rex-strength-lab/dist/preview.html 2>/dev/null; git status -...` (+3 lines)


> **Commit** `64a38a1` · 2026-10-11 21:37:09 UTC · Rex lab: review round 2 fixes (data lens): one stomp's 1 mm/s worded as barely perceptible; window and plaster thresholds named for what they are; glass thresholds labelled as model estimates; a recorded person walking past at 53 m as a new anchor (within 2x); thresholds tested against the research file; every source shown for the recommended thresholds; facts file marked hand-maintained  [rex-strength-lab]


- `Bash` Check round 2 physics/claims and UX/code progress: `cd /root/.claude/projects/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/subagents/workflows; for d in wf_cb78ed7e-fde wf_f32540b9-687; do ...` (+2 lines)
- `Bash` Dump round 2 physics, claims, UX and code findings: `cd /root/.claude/projects/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/subagents/workflows; python3 - <<'EOF' > /tmp/claude-0/-home-user-...` (+14 lines)
- `Read` /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/r2_findings.txt
- `Bash` Find jump crater wording and shove slide fields: `cd /home/user/rex-strength-lab/rex-strength-lab/src; grep -n "craters behind\|leaves two craters" app.html | head -3; grep -n "function shoveBoth\|function s...`
- `Bash` Engine: plateau-safe saturation, stomp impulse, plaster frequency, prints, soft landing, soil craters, recoil boom: `cd /home/user/rex-strength-lab/rex-strength-lab/src; python3 - <<'EOF'` (+67 lines)

**Claude · 2026-10-11 21:39:18 UTC**

Engine changes in. Exporting the new plaster helpers and running the tests.


- `Bash` Export helpers, use them in the Walk sentence, run tests: `cd /home/user/rex-strength-lab/rex-strength-lab/src; sed -i "s/WALK, walkStep, walkThresholds,/WALK, walkStep, walkThresholds, plasterOver, plasterReach,/" e...` (+10 lines)
- `Bash` Fix soft-landing test; inspect check counts: `cd /home/user/rex-strength-lab/rex-strength-lab; python3 - <<'EOF'` (+7 lines)

**Claude · 2026-10-11 21:41:43 UTC**

Adding regression tests for the plateau cases the reviewers found (comic jump on ice at 10¹² kg, tank and semi throws).


- `Bash` Test that 'never' results hold at all-out: `cd /home/user/rex-strength-lab/rex-strength-lab; python3 - <<'EOF'` (+21 lines)
- `Bash` Confirm the new test catches the old plateau bug: `cd /home/user/rex-strength-lab/rex-strength-lab; cp src/engine.js /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/e...`

**Claude · 2026-10-11 21:44:08 UTC**

The new test catches the old bug in all six cases and passes with the fix. Now the two-player side: same plateau rule, a coarser search, and the drag regression.


- `Bash` Duo plateau rule, coarser duo search, keep controls on first input, quiet live region while pending: `cd /home/user/rex-strength-lab/rex-strength-lab/src; python3 - <<'EOF'` (+32 lines)
- `Bash` Sync kept sliders; slider grid ends at all-out: `cd /home/user/rex-strength-lab/rex-strength-lab/src; python3 - <<'EOF'` (+25 lines)

**Claude · 2026-10-11 21:44:43 UTC**

Now the page-text batch (tiny percentages, "within" wording, preset wording, two-player head, growth lines, stomp thump, switches in the hazard list).


- `Bash` Locate text targets: `cd /home/user/rex-strength-lab/rex-strength-lab/src; grep -n "const pctOf\|const atText = \|const atText2\|const amountText" app.html | cut -c1-120; grep -n ...`
- `Bash` Read share helpers and stomp blast line: `cd /home/user/rex-strength-lab/rex-strength-lab/src; sed -n 2947,2956p app.html; sed -n 1430,1445p app.html | cut -c1-200`
- `Bash` Page text fixes batch 1: `cd /home/user/rex-strength-lab/rex-strength-lab/src; python3 - <<'EOF'` (+57 lines)
- `Bash` Fix 'could' preset grammar; find share-of-dial texts: `cd /home/user/rex-strength-lab/rex-strength-lab/src; python3 - <<'EOF'` (+6 lines)
- `Bash` Read the throw and jump strength texts: `cd /home/user/rex-strength-lab/rex-strength-lab/src; sed -n 1203,1210p app.html | cut -c1-500; sed -n 1409p app.html | cut -c1-500; grep -n "'Drive: '" app.h...`
- `Bash` Share-of-strength wording under an effort cap: `cd /home/user/rex-strength-lab/rex-strength-lab/src; python3 - <<'EOF'` (+24 lines)

**Claude · 2026-10-11 21:45:47 UTC**

Fixing the remaining two-player and Walk texts.


- `Bash` Read the catch throw tile text: `cd /home/user/rex-strength-lab/rex-strength-lab/src; sed -n 2424p app.html | grep -o "fullSt[^:]*:[^)]*)" | head -3; sed -n 2424p app.html | cut -c300-700`
- `Bash` Catch label and drag; two-player head wording: `cd /home/user/rex-strength-lab/rex-strength-lab/src; python3 - <<'EOF'` (+31 lines)
- `Bash` Inspect shove, catch recoil and collide fields: `cd /home/user/rex-strength-lab/rex-strength-lab; node -e "` (+7 lines)
- `Bash` Inspect collide aftermath structure: `cd /home/user/rex-strength-lab/rex-strength-lab; node -e "` (+5 lines)
- `Bash` Count bodies sliding past the nearest people as harm: `cd /home/user/rex-strength-lab/rex-strength-lab/src; python3 - <<'EOF'` (+24 lines)


*Woken · 2026-10-11 21:46:56 UTC · Background task wrrqjmli3 completed: Dynamic workflow "Adversarial review of the Rex lab presence build (effort, Walk tab, comic switches, growth): lenses find defects, one skeptic per lens reproduces or refutes each finding" completed. Next: Still on round 2 fixes: rewriting the Walk tab's canon sentence so it reads correctly on hard ground.*


- `Bash` Print physics and claims round 2 verdicts: `cd /root/.claude/projects/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/subagents/workflows/wf_cb78ed7e-fde; python3 - <<'EOF'` (+10 lines)
- `Bash` Locate the remaining text targets: `cd /home/user/rex-strength-lab/rex-strength-lab/src; grep -n "const EL = P.VIB.ELEPHANT" -A8 app.html | cut -c1-260; grep -n "At 3,007 kg, Rex and Ollie each...`
- `Bash` Read the elephant note: `cd /home/user/rex-strength-lab/rex-strength-lab/src; sed -n 3207p app.html | cut -c1-900`
- `Bash` Elephant comparison as a firm-to-loose sand range; notes: `cd /home/user/rex-strength-lab/rex-strength-lab/src; python3 - <<'EOF'` (+33 lines)
- `Bash` Read the growth table, growth-harm line and canon sentence code: `cd /home/user/rex-strength-lab/rex-strength-lab/src; sed -n 1655,1660p app.html | cut -c1-400; sed -n 3015,3016p app.html | cut -c1-400; grep -n "const bySto...`
- `Bash` Table percent, growth line, cool-flight text; prepare canon clauses: `cd /home/user/rex-strength-lab/rex-strength-lab/src; python3 - <<'EOF'` (+13 lines)

**Claude · 2026-10-11 21:47:58 UTC**

Still on round 2 fixes: rewriting the Walk tab's canon sentence so it reads correctly on hard ground.


- `Bash` Canon sentence clauses; mired depth wording; tests: `cd /home/user/rex-strength-lab/rex-strength-lab/src; python3 - <<'EOF'` (+15 lines)

**Claude · 2026-10-11 21:48:54 UTC**

Now the Walk chart: labels move into a gutter beside the plot (numbered keys on phones, matched in the list below), and legend swatches drawn as the real line styles.


- `Bash` Gutter labels with leaders, numbered keys, SVG legend swatches: `cd /home/user/rex-strength-lab/rex-strength-lab/src; python3 - <<'EOF'` (+62 lines)
- `Bash` Define stepAt before its first use: `cd /home/user/rex-strength-lab/rex-strength-lab/src; python3 - <<'EOF'` (+8 lines)
- `Read` /home/user/rex-strength-lab/rex-strength-lab/shots/walk-390-light.png

**Claude · 2026-10-11 21:50:06 UTC**

Walk tab looks right on a phone (numbered keys match the list; elephant shown as a range). Now the code lens results.


- `Bash` Print round 2 code-lens findings: `cd /root/.claude/projects/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/subagents/workflows/wf_f32540b9-687; python3 - <<'EOF'` (+12 lines)

**Claude · 2026-10-11 21:50:17 UTC**

Code lens is still running. Adding one last guard (no ceiling found → fall back cleanly), then running the full test set and committing round 2's other fixes.


- `Bash` Guard no-ceiling case; run all three test suites: `cd /home/user/rex-strength-lab/rex-strength-lab/src; python3 - <<'EOF'` (+11 lines)

**Claude · 2026-10-11 21:53:52 UTC**

All three suites pass. Re-checking load times, since the saturation fix adds an all-out run to each search.


- `Bash` Re-measure load and drag timings: `cd /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/dev; node perf.js '{"group":"duo","inf":true,"duoAction":"catch"...`

**Claude · 2026-10-11 21:54:32 UTC**

Timings hold (Catch fastball settles in 4.9 s, was 8.3 s; Liberty loads in 4.9 s; drags about 100 ms a frame). Committing round 2's physics, claims and UX fixes.


- `Bash` Record round 2 outcomes; commit and push: `python3 - <<'EOF'` (+58 lines)


> **Commit** `b1916a8` · 2026-10-11 21:55:00 UTC · Rex lab: review round 2 fixes (physics, claims, UX lenses)  [rex-strength-lab]

**Claude · 2026-10-11 21:55:06 UTC**

Round 2 fixes for physics, claims, UX and data are pushed (b1916a8). Waiting on the round 2 code lens; given how much round 2 changed, I'll run a third round after it.


*Woken · 2026-10-11 21:55:08 UTC · Background task None pending: 2 unread notifications (scheduled trigger (the stored prompt of a routine or task on this account): 1, GitHub activity on a subscribed PR: 1). Next: CI failed on commit 64a38a1. Reading the job log.*


- `ReadNotifications` {}

**Claude · 2026-10-11 21:55:14 UTC**

CI failed on commit 64a38a1. Reading the job log.


- `mcp__github__get_job_logs` {"owner": "RoscoeRackham", "repo": "rex-strength-lab", "job_id": 114581744899, "return_content": true, "tail_lines": 60}

**Claude · 2026-10-11 21:55:19 UTC**

The failure is "generated files out of date" on 64a38a1: I edited an engine comment after the last build in that commit. Checking whether the current head (b1916a8) is consistent.


- `Bash` Reproduce CI's generated-file check on HEAD: `cd /home/user/rex-strength-lab/rex-strength-lab && python3 build-data.py >/dev/null && node build.js >/dev/null && cd .. && cd build-calculator && node build...`
- `mcp__github__pull_request_read` {"method": "get_check_runs", "owner": "RoscoeRackham", "repo": "rex-strength-lab", "pullNumber": 11}
- `mcp__claude-code-remote__send_later` {"delay_minutes": 50, "message": "Safety-net check-in for PR #11 (RoscoeRackham/rex-strength-lab): check CI on the current head (b1916a8 or later), mergeability and review threads; act on anything ...

**Claude · 2026-10-11 21:55:37 UTC**

The red run came from an intermediate commit, and the head already has the fix. Waiting for CI on b1916a8 and for the round 2 code lens.


- `ReadNotifications` {}
- `mcp__github__pull_request_read` {"method": "get_check_runs", "owner": "RoscoeRackham", "repo": "rex-strength-lab", "pullNumber": 11}

**Claude · 2026-10-11 21:59:57 UTC**

CI is green on b1916a8. Still waiting on the round 2 code lens.


*Woken · 2026-10-11 22:38:21 UTC · Background task wt2yvwl55 completed: Dynamic workflow "Adversarial review of the Rex lab presence build (effort, Walk tab, comic switches, growth): lenses find defects, one skeptic per lens reproduces or refutes each finding" completed. Next: Round 2 code lens: 9 findings, all confirmed. Two are already fixed (plateau saturation, stale dist).*


- `Bash` Print round 2 code-lens findings and verdicts: `cd /root/.claude/projects/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/subagents/workflows/wf_f32540b9-687; python3 - <<'EOF'` (+12 lines)

**Claude · 2026-10-11 22:38:37 UTC**

Round 2 code lens: 9 findings, all confirmed. Two are already fixed (plateau saturation, stale dist). Reading the full list of mutations the tests missed.


- `Bash` Read the full mutation-test finding: `cd /root/.claude/projects/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/subagents/workflows/wf_f32540b9-687; python3 - <<'EOF'` (+6 lines)

**Claude · 2026-10-11 22:38:46 UTC**

Writing the targeted tests the code lens asked for (each guards a fix that a one-line change could silently undo).


- `Bash` Get growth reference values from the engine: `cd /home/user/rex-strength-lab/rex-strength-lab; node -e "` (+6 lines)
- `Bash` Add review-fix guard tests and the above-ceiling list check: `cd /home/user/rex-strength-lab/rex-strength-lab; python3 - <<'EOF'` (+58 lines)
- `Bash` Find which goals sit above the ceiling today: `cd /home/user/rex-strength-lab/rex-strength-lab; sed -i "30s/^  const moves = /  const ABOVE = new Set([]);\n  const moves = /" test/presence.js; node test/p...`
- `Bash` Investigate the sand throw/jump and concrete landing cases: `cd /home/user/rex-strength-lab/rex-strength-lab; node -e "` (+10 lines)
- `Bash` Find a concrete landing past bearing; sand sink flags: `cd /home/user/rex-strength-lab/rex-strength-lab; node -e "` (+6 lines)
- `Bash` Rework soil and landing guards; list above-ceiling goals: `cd /home/user/rex-strength-lab/rex-strength-lab; python3 - <<'EOF'` (+19 lines)

**Claude · 2026-10-11 22:41:23 UTC**

Tests are at 313 and pass. Spot-checking that four of the new guards fail when their fix is undone.


- `Bash` Mutation spot-check of the new guard tests: `cd /home/user/rex-strength-lab/rex-strength-lab; B=/tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/engine.bak2.js; ...` (+7 lines)

**Claude · 2026-10-11 22:44:51 UTC**

The passenger guard didn't catch its mutation (at that effort both the mean and the peak exceed the limit). Finding an effort where only the peak does.


- `Bash` Find an effort where only the peak passes the ride limit: `cd /home/user/rex-strength-lab/rex-strength-lab; node -e "` (+4 lines)
- `Bash` Fix the passenger guard and re-check the mutation: `cd /home/user/rex-strength-lab/rex-strength-lab; python3 - <<'EOF'` (+12 lines)
- `Bash` Read duo plan key and VALID ranges: `cd /home/user/rex-strength-lab/rex-strength-lab/src; grep -n "function duoPlanFor" -A4 app.html | head -6; grep -n "gThrow: \|growT: \|halfLife: " app.html |...`
- `Bash` Find grow-time and half-life handlers: `cd /home/user/rex-strength-lab/rex-strength-lab/src; grep -n "#grow-t').\|#half-life').\|'#grow-t'\|'#half-life'" app.html | head; grep -n "^  const DEFAULTS...`
- `Bash` Shared input ranges; duo plan tied to its settings; 'even all-out' fix: `cd /home/user/rex-strength-lab/rex-strength-lab/src; python3 - <<'EOF'` (+59 lines)
- `Bash` Cancel searches off-tab; pause them during dial drags: `cd /home/user/rex-strength-lab/rex-strength-lab/src; python3 - <<'EOF'` (+39 lines)

**Claude · 2026-10-11 22:47:11 UTC**

Still on round 2 code-lens fixes: same pause for the two-player search, then the screenshot test's text check.


- `Bash` Duo pause and no run while pending; shots reads folded text; test: `cd /home/user/rex-strength-lab/rex-strength-lab/src; python3 - <<'EOF'` (+23 lines)

**Claude · 2026-10-11 22:49:06 UTC**

Screenshot test now reads folded text too and still passes. Verifying the two-player slider drag works with a real mouse drag.


- `Bash` Mouse-drag test of two-player and solo sliders: `cat > /tmp/claude-0/-home-user-rex-strength-lab/ba090f8f-9962-5883-b4ec-f77afa579575/scratchpad/dev/duodrag.js <<'EOF'` (+23 lines)

**Claude · 2026-10-11 22:49:35 UTC**

All three drags land where the mouse ends. Updating the README limits, then committing and writing the round 2 record.


- `Bash` README limit; rebuild all generated files before commit: `cd /home/user/rex-strength-lab/rex-strength-lab; python3 - <<'EOF'` (+7 lines)
- `Bash` Full git status; add code-lens outcomes: `cd /home/user/rex-strength-lab; git status --short; python3 - <<'EOF'` (+16 lines)
- `Bash` Build the round 2 review record: `cd /home/user/rex-strength-lab; python3 - <<'EOF'` (+19 lines)
- `Bash` STATUS update; commit and push round 2 code fixes and record: `cd /home/user/rex-strength-lab; python3 - <<'EOF'` (+11 lines)


> **Commit** `a62c4fd` · 2026-10-11 22:50:11 UTC · Rex lab: review round 2 fixes (code lens) and the round 2 record  [rex-strength-lab]

