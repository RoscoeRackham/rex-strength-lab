# Pull request 3: two review rounds

2026-10-14 20:36:36 UTC to 2026-10-15 02:30:07 UTC. 7 assistant events, 2 commit events, 10 subagent events, 16 tool call events, 4 wakeup events.

Two review rounds (physics and claims; code, layout and the migration): 8 and 8 findings; 15 confirmed and fixed, 1 refuted. Round 1's major: in the game of catch a missed person was called unharmed beside a "skin melts" chip. Round 2 reworked where the ground gives way under a person's landing (only the downward part of its push, over the person's own stop), so a person landing at 10 km/s on granite is no longer told "no crater". The close-out updated #34's description and started CI (it passed, run 61).

Events are in the order they happened in the session; each workflow’s subagents are listed under the call that launched it, with their own start times.


### Workflow `canon-review` · 2026-10-14 20:36:36 UTC

- `Workflow` canon-review: Adversarial review round of a BRIEF-canon.md pull request: one reviewer per lens finds defects, one skeptic per lens reproduces or refutes each finding with code (pull request 3, round 1)
  - run `wf_d5a3b3c0-042`: 4 subagents, listed below

**Subagent `review:physics`** · canon-review · started 2026-10-14 20:36:36 UTC

- findings: 6 (1 major, 5 minor); verified ok: 15.
- Most severe: Game of catch: a missed person is called 'unharmed' while the same….

<details>
<summary>Prompt, verbatim (7,650 characters)</summary>

Workflow run `wf_d5a3b3c0-042`, phase `Review`, agent `a43d163dfb3ea9c3e`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/a43d163dfb3ea9c3e.txt](prompts/a43d163dfb3ea9c3e.txt).

```text
You are an independent reviewer of a change to the Rex Super-Strength Lab (rex-strength-lab/ in the repo /home/user/rex-strength-lab), a self-contained HTML page (a claude.ai Artifact) that simulates Rex and Ollie. CLAUDE.md is already loaded for you: its canon (especially "Rulings of 14 Oct 2026", "Momentum", "Default powers", "Restraint and absorption") and the owner's standard apply. The change is pull request 3 of rex-strength-lab/BRIEF-canon.md, on branch claude/canon-3-passenger (base claude/canon-2-recoil). It turns Safe passenger on by default and makes it cover the landing and the air's drag: engine MOVES.throw.passengerLaunch/passengerDrag/passenger (never with the switch on), passengerLanding {absorbed: the landing's energy, J: its momentum} with the switch on, no landing blast for a person with the switch on; page DEFAULTS.safePassenger true, the save mark 3 (an unmarked save or one marked 2 loads with it on), its own heading 'People they throw or catch', the summary line, the copy on Throw, Catch, the effort box and the cards; research relabel of comic_passenger_drag_g; tests (powers.js part 1 shim for the 8 Safe-passenger fixture keys, section 7, presence.js turned round, nine shots.js checks). Pull request #34 (stacked on #33, pull request 2: their own recoil to their source, already reviewed). Its diff: git diff claude/canon-2-recoil...claude/canon-3-passenger.
Read BRIEF-canon.md (item 5 and the Answers (Q8), plus item 6's note that a person's landing energy is shimmer; "Rules for every item"; the Answers) and RUN-canon.md. The author's decisions are in the README section named below and the pull request; check whether each is justified by the canon, the physics and the code, and stated where the owner will see it. Do not report a decision as a defect merely because it departs from the brief's letter, unless it is wrong, unjustified or not stated.
DECISIONS AND CONTEXT FROM THE AUTHOR:
See rex-strength-lab/README.md, section 'Safe passenger on by default (BRIEF-canon.md pull request 3)', decisions 1-11 and 'What moved', and pull request #34's description (mcp__github__pull_request_read, owner RoscoeRackham, repo rex-strength-lab, pullNumber 34). Key readings to check: the save mark 3 (why not 2); the landing's split (momentum real, energy taken back; the pulse is the person's own quick stop, about 31 ms and 59 g at the least effort, spread through them, not a gentle stop); no landing blast for a person with the switch on; heat not covered; only the person is a passenger; the game of catch with a person covered (a missed catch's landing taken back). With every power off (Safe passenger included) every result equals main's; with only the four defaults off and Safe passenger on, the 8 fixture cases go through a shim.
WORK IN YOUR OWN CLONE, never in /home/user/rex-strength-lab (another process may be using it): mkdir -p /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r1/<your-lens>/ && git clone -q /home/user/rex-strength-lab /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r1/<your-lens>/repo && cd /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r1/<your-lens>/repo && git checkout -q claude/canon-3-passenger && git log --oneline -1. Diff: git diff cl … [1,741 more characters on this line; the full prompt is in prompts/a43d163dfb3ea9c3e.txt]
The owner is a professional critic: factual accuracy and honest labelling come first. Every finding must be REPRODUCED: give the exact input or place, what the page or code does (quote it, or your script's output), what is correct and why (with numbers), and a minimal fix. Report real defects only: wrong physics or formulas, momentum or energy bookkeeping errors, behaviour the brief or canon requires that is missing or wrong, results that changed with the powers off, wrong or unsupported claims, contradictions between page text and engine numbers, broken layout or controls, accessibility failures, state or migration bugs, tests that don't test what they say. Skip style preferences. Do NOT edit /home/user/rex-strength-lab; do not commit or push anything.

LENS: PHYSICS AND CLAIMS. The landing's split (the brief: 'confirm in review'): with the switch on, is it right that the person comes down unharmed while the landing's momentum still reaches the ground as the person's own quick stop (about the person's size over the landing speed: 31 ms, about 59 g mean at the least effort), and its energy (r.Eimpact) is taken back? Is 'a manageable push, spread through them' at 59 g (and at the all-out 81 m/s landing, and at very fast landings) consistent with canon ('feels a manageable force')? Is the alternative (a gentle stop) better? Check the drag covera … [1,046 more characters on this line; the full prompt is in prompts/a43d163dfb3ea9c3e.txt]

Under verified_ok, list what you checked and found correct (with the numbers). Prefix finding ids with "physics-".
```

</details>

**Subagent `review:code`** · canon-review · started 2026-10-14 20:36:37 UTC

- findings: 2 (1 major, 1 minor); verified ok: 20.
- Most severe: A missed catch calls the person "unharmed" even when the page says….

<details>
<summary>Prompt, verbatim (7,657 characters)</summary>

Workflow run `wf_d5a3b3c0-042`, phase `Review`, agent `a4d3e87c94f1b9754`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/a4d3e87c94f1b9754.txt](prompts/a4d3e87c94f1b9754.txt).

```text
You are an independent reviewer of a change to the Rex Super-Strength Lab (rex-strength-lab/ in the repo /home/user/rex-strength-lab), a self-contained HTML page (a claude.ai Artifact) that simulates Rex and Ollie. CLAUDE.md is already loaded for you: its canon (especially "Rulings of 14 Oct 2026", "Momentum", "Default powers", "Restraint and absorption") and the owner's standard apply. The change is pull request 3 of rex-strength-lab/BRIEF-canon.md, on branch claude/canon-3-passenger (base claude/canon-2-recoil). It turns Safe passenger on by default and makes it cover the landing and the air's drag: engine MOVES.throw.passengerLaunch/passengerDrag/passenger (never with the switch on), passengerLanding {absorbed: the landing's energy, J: its momentum} with the switch on, no landing blast for a person with the switch on; page DEFAULTS.safePassenger true, the save mark 3 (an unmarked save or one marked 2 loads with it on), its own heading 'People they throw or catch', the summary line, the copy on Throw, Catch, the effort box and the cards; research relabel of comic_passenger_drag_g; tests (powers.js part 1 shim for the 8 Safe-passenger fixture keys, section 7, presence.js turned round, nine shots.js checks). Pull request #34 (stacked on #33, pull request 2: their own recoil to their source, already reviewed). Its diff: git diff claude/canon-2-recoil...claude/canon-3-passenger.
Read BRIEF-canon.md (item 5 and the Answers (Q8), plus item 6's note that a person's landing energy is shimmer; "Rules for every item"; the Answers) and RUN-canon.md. The author's decisions are in the README section named below and the pull request; check whether each is justified by the canon, the physics and the code, and stated where the owner will see it. Do not report a decision as a defect merely because it departs from the brief's letter, unless it is wrong, unjustified or not stated.
DECISIONS AND CONTEXT FROM THE AUTHOR:
See rex-strength-lab/README.md, section 'Safe passenger on by default (BRIEF-canon.md pull request 3)', decisions 1-11 and 'What moved', and pull request #34's description (mcp__github__pull_request_read, owner RoscoeRackham, repo rex-strength-lab, pullNumber 34). Key readings to check: the save mark 3 (why not 2); the landing's split (momentum real, energy taken back; the pulse is the person's own quick stop, about 31 ms and 59 g at the least effort, spread through them, not a gentle stop); no landing blast for a person with the switch on; heat not covered; only the person is a passenger; the game of catch with a person covered (a missed catch's landing taken back). With every power off (Safe passenger included) every result equals main's; with only the four defaults off and Safe passenger on, the 8 fixture cases go through a shim.
WORK IN YOUR OWN CLONE, never in /home/user/rex-strength-lab (another process may be using it): mkdir -p /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r1/<your-lens>/ && git clone -q /home/user/rex-strength-lab /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r1/<your-lens>/repo && cd /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r1/<your-lens>/repo && git checkout -q claude/canon-3-passenger && git log --oneline -1. Diff: git diff cl … [1,741 more characters on this line; the full prompt is in prompts/a4d3e87c94f1b9754.txt]
The owner is a professional critic: factual accuracy and honest labelling come first. Every finding must be REPRODUCED: give the exact input or place, what the page or code does (quote it, or your script's output), what is correct and why (with numbers), and a minimal fix. Report real defects only: wrong physics or formulas, momentum or energy bookkeeping errors, behaviour the brief or canon requires that is missing or wrong, results that changed with the powers off, wrong or unsupported claims, contradictions between page text and engine numbers, broken layout or controls, accessibility failures, state or migration bugs, tests that don't test what they say. Skip style preferences. Do NOT edit /home/user/rex-strength-lab; do not commit or push anything.

LENS: CODE, LAYOUT AND THE MIGRATION. (1) The save mark: load the page with saves of every kind (no mark with safePassenger false/true; mark 2 with false/true; mark 3 with false/true; mark 2 with m 3007; malformed marks; saves from main and from pull request 2's branch, e.g. build those branches' pages and save from them) and check what loads and what is saved back; check VALID, the migration order, and that a reader's own choice on this page survives a reload. (2) The powers-off equivalence: part 1's shim (does it hide anything besides the 8 keys? regenerate the fixture from main's engine wit … [1,056 more characters on this line; the full prompt is in prompts/a4d3e87c94f1b9754.txt]

Under verified_ok, list what you checked and found correct (with the numbers). Prefix finding ids with "code-".
```

</details>

**Subagent `verify:physics`** · canon-review · started 2026-10-14 21:07:23 UTC

- verdicts: 6 (5 confirmed, 1 refuted).
- Refuted: physics-feel-vs-no-stress.

<details>
<summary>Prompt, verbatim (18,980 characters)</summary>

Workflow run `wf_d5a3b3c0-042`, phase `Verify`, agent `a7c2fbd45565948f0`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/a7c2fbd45565948f0.txt](prompts/a7c2fbd45565948f0.txt).

```text
You are an independent reviewer of a change to the Rex Super-Strength Lab (rex-strength-lab/ in the repo /home/user/rex-strength-lab), a self-contained HTML page (a claude.ai Artifact) that simulates Rex and Ollie. CLAUDE.md is already loaded for you: its canon (especially "Rulings of 14 Oct 2026", "Momentum", "Default powers", "Restraint and absorption") and the owner's standard apply. The change is pull request 3 of rex-strength-lab/BRIEF-canon.md, on branch claude/canon-3-passenger (base claude/canon-2-recoil). It turns Safe passenger on by default and makes it cover the landing and the air's drag: engine MOVES.throw.passengerLaunch/passengerDrag/passenger (never with the switch on), passengerLanding {absorbed: the landing's energy, J: its momentum} with the switch on, no landing blast for a person with the switch on; page DEFAULTS.safePassenger true, the save mark 3 (an unmarked save or one marked 2 loads with it on), its own heading 'People they throw or catch', the summary line, the copy on Throw, Catch, the effort box and the cards; research relabel of comic_passenger_drag_g; tests (powers.js part 1 shim for the 8 Safe-passenger fixture keys, section 7, presence.js turned round, nine shots.js checks). Pull request #34 (stacked on #33, pull request 2: their own recoil to their source, already reviewed). Its diff: git diff claude/canon-2-recoil...claude/canon-3-passenger.
Read BRIEF-canon.md (item 5 and the Answers (Q8), plus item 6's note that a person's landing energy is shimmer; "Rules for every item"; the Answers) and RUN-canon.md. The author's decisions are in the README section named below and the pull request; check whether each is justified by the canon, the physics and the code, and stated where the owner will see it. Do not report a decision as a defect merely because it departs from the brief's letter, unless it is wrong, unjustified or not stated.
DECISIONS AND CONTEXT FROM THE AUTHOR:
See rex-strength-lab/README.md, section 'Safe passenger on by default (BRIEF-canon.md pull request 3)', decisions 1-11 and 'What moved', and pull request #34's description (mcp__github__pull_request_read, owner RoscoeRackham, repo rex-strength-lab, pullNumber 34). Key readings to check: the save mark 3 (why not 2); the landing's split (momentum real, energy taken back; the pulse is the person's own quick stop, about 31 ms and 59 g at the least effort, spread through them, not a gentle stop); no landing blast for a person with the switch on; heat not covered; only the person is a passenger; the game of catch with a person covered (a missed catch's landing taken back). With every power off (Safe passenger included) every result equals main's; with only the four defaults off and Safe passenger on, the 8 fixture cases go through a shim.
WORK IN YOUR OWN CLONE, never in /home/user/rex-strength-lab (another process may be using it): mkdir -p /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r1/<your-lens>/ && git clone -q /home/user/rex-strength-lab /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r1/<your-lens>/repo && cd /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r1/<your-lens>/repo && git checkout -q claude/canon-3-passenger && git log --oneline -1. Diff: git diff cl … [1,741 more characters on this line; the full prompt is in prompts/a7c2fbd45565948f0.txt]
The owner is a professional critic: factual accuracy and honest labelling come first. Every finding must be REPRODUCED: give the exact input or place, what the page or code does (quote it, or your script's output), what is correct and why (with numbers), and a minimal fix. Report real defects only: wrong physics or formulas, momentum or energy bookkeeping errors, behaviour the brief or canon requires that is missing or wrong, results that changed with the powers off, wrong or unsupported claims, contradictions between page text and engine numbers, broken layout or controls, accessibility failures, state or migration bugs, tests that don't test what they say. Skip style preferences. Do NOT edit /home/user/rex-strength-lab; do not commit or push anything.

Another reviewer (physics lens) reported the findings below. For EACH one, try hard to REFUTE it: reproduce it yourself with your own script or browser run, independently of theirs, in your own clone under /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r1/verify-physics/. Mark real=true only if you reproduced it; put the command and its output in reproduction. Check whether it is a real defect under the canon and the brief (a recorded, justified decision is not a defect). Confirm the severity and give the best minimal fix (exact code or text). Default to real=false if you cannot reproduce it.

FINDINGS:
[
 {
  "id": "physics-catch-heat-unharmed",
  "severity": "major",
  "title": "Game of catch: a missed person is called 'unharmed' while the same view says the flight melts their skin (decision 6 not applied on Catch)",
  "location": "rex-strength-lab/src/app.html:3028 (the new miss callout for a person); also the catch tile at 2926 ('Safe passenger: spread through them, no harm') and src/static-data.js 'Game of catch' card ('if the catch is missed they come down unharmed')",
  "evidence": "Page (dist/index.html, 1280 px), save {duoOpen:true, duoAction:'catch', cObj:'person', cStyle:'hard', airAbsorb:0, keepForm:false, saveV:3, cMiss:true, logKg:8, cLogD:2}, effort All-out. Status row: 'Nose air 2,800 °C: skin melts'. Callout: 'If Ollie misses, they land 309 m behind him at 155 m/s. Safe passenger spreads the landing through them and takes back its energy (1.08 MJ), so they come down unharmed, with no crater or blast.' The same at airAbsorb 0.5 (they land 522 m behind him at 258 m/s). With airAbsorb 0.9, logKg 9, cLogD 3 the chip says 'Nose air 12,000 °C: loses 0.82–4.9%' and the callout again says 'so they come down unharmed'. The same save on pull request 2's page (base branch, safePassenger true) says only 'If Ollie misses, it lands 309 m behind him at 155 m/s: 1.08 MJ (260 g TNT).', so the 'unharmed' claim is new in this pull request. The Throw tab handles this case (passengerText's burns test gives 'so the lab can't say they come down unharmed'), but the catch branch at 3028 tests only o.passenger && state.safePassenger and never looks at heat. (Related and older: the catch judges a person's heating as steel, because OBJ_MATERIAL has no entry for a person, e.g. '380 °C, below the 1,538 °C where steel starts to melt, so it only warms up'.)",
  "expected": "README decision 6 and the switch's own text say Safe passenger doesn't cover heating. Where Things keep their form is off and the page says the person melts, burns or loses mass, it must not also call them unharmed. A person whose skin melts (2,800 °C at the nose) or who loses 1–5% of their mass is not unharmed.",
  "fix": "In the miss branch, and in the tile's '(Safe passenger: spread through them, no harm)', test the heat first. When !a.kept && a.heat && a.heat.kind !== 'warm' (or the Throw tab's rule, maxStagT > 1200 K with some drag left), say: 'Safe passenger takes back the landing's energy (X) and spreads its push through them, but it doesn't cover the heating in flight, so the lab can't say they come down unharmed.' Add the heat caveat to the Game of catch card too. Add a shots.js check for this save."
 },
 {
  "id": "physics-fast-landing-bearing",
  "severity": "minor",
  "title": "A fast person's landing: the page says 'no crater' but sends the whole push into ground that can bear only a small fraction of it (no bearing cap, unlike Soft landing, the analogue the PR cites)",
  "location": "rex-strength-lab/src/engine.js MOVES.throw.landShake (~3955) and passengerLanding (~3981); src/app.html:1631 (Impact line) and 3028 (catch miss); README decisions 4–5",
  "evidence": "Engine (my script). Person at 45°, four powers on, Safe passenger on, all-out at 10^9.15 kg: lands at 10,110 m/s, J = 912,500 kg·m/s over T = 1 ms (landShake's floor), so the mean push is 9.1e8 N. The 10 cm concrete slab's qult is 2.5 MPa. Even over the person's whole 0.67 m² frontal area it bears 1.675e6 N, so the push is 545 times that. ppvNonlinear(…, 5 m) is true. The page shows 'Impact: 1.1 t TNT, all of it taken back by Safe passenger, so no crater, quake or blast where they land. The landing's push still reaches the ground and shakes it.' and the effort box shows 'Plaster … [1,079 more characters on this line; the full prompt is in prompts/a7c2fbd45565948f0.txt]
  "expected": "With the energy taken back and no crater, the ground can take only what it bears; the rest is canon's listed momentum case, 'the ground's share it can't bear'. That is the rule the engine already applies to his own Soft landing with Unbreakable footing on, and the README calls this landing 'as Soft landing does'. Or, if the full push is kept, the ground gives way and 'no crater' is wrong. As it stands the page claims both.",
  "fix": "In landShake (or a passenger-specific shake) with Safe passenger on, cap the ground's take at the landing site's bearing over the pulse: J ≤ max(0, qult × contact area − weight) × T, as jump's cap() does. Send the rest to the endless ocean, and add a line saying so. Or keep the full push and drop 'no crater' above the bearing speed. Either way, say in the README where the model stops (about 100 m/s on the default slab)."
 },
 {
  "id": "physics-no-quake-claim",
  "severity": "minor",
  "title": "Very fast impact line says 'no … quake' while the same tab says the landing cracks plaster 247 m away",
  "location": "rex-strength-lab/src/app.html:1631",
  "evidence": "Save {action:'throw', obj:'person', logKg:9.15}, effort All-out (the shots.js case). The happenings list says 'Impact: 1.1 t TNT, all of it taken back by Safe passenger, so no crater, quake or blast where they land. The landing's push still reaches the ground and shakes it.' The effort box says 'Plaster may crack at 5 m from lifting 27 t; now out to 247 m from where it lands'. RESTRAINT.reach for the same run gives plaster 246.7 m, rattle 5,062 m and feel 12,780 m. With the switch off, the old line never mentioned a quake for this landing (r.quake = 0.58, below its threshold of 2), so 'no quake' is a new claim. Even with the bearing cap above, plaster still cracks out to 13 m.",
  "expected": "Shaking that cracks plaster hundreds of metres away and is felt for kilometres is what a reader calls a quake. Taking back the energy removes the energy-based magnitude (r.quake), not the momentum's shaking, which the page itself counts.",
  "fix": "Drop 'quake': 'Impact: X, all of it taken back by Safe passenger, so no crater or blast where they land. The landing's push still reaches the ground and shakes it (the effort box gives how far).' Update the shots.js regex to match."
 },
 {
  "id": "physics-hits-ground-exception",
  "severity": "minor",
  "title": "Decision 7's exception (a person who hits the ground past 1% of light speed keeps the full blast, crater and quake) rests on a reason that doesn't apply: at 100% absorbed there is no air and no fireball",
  "location": "rex-strength-lab/src/app.html:2721 (catch verdict, hits-ground) and catch harm; README decisions 5 and 7; engine catchGame hitsGround (~3326)",
  "evidence": "Default powers (Air resistance absorbed 100%, Safe passenger on), save {duoOpen:true, duoAction:'catch', cObj:'person', cStyle:'hard', cMiss:true, logKg:16, cLogD:4.5}, All-out. Verdict: 'Rex fires the person at 8.95% of light speed in a straight line (no air: their power …). … The person hits the ground about 1.15 km from Rex, carrying 32.7 PJ (7.8 Mt TNT), and blasts a crater up to 181 m across …, felt like a magnitude 5.1 quake.' The README excludes this regime because 'Past 1% of light speed … there the \"landing\" part is the fireball in the air, not a landing'. That holds on the Throw tab, but hits-ground happens with no air at all (100% absorbed: 'no air: their power'), so this is a ground landing. Decision 7 justifies it as 'a harm to the ground, not to the person', but decision 5 removes the landing blast, also a harm to the ground and not the person, because Safe passenger takes back the landing's energy.",
  "expected": "The 14 Oct ruling says Safe passenger covers where the person lands. Read as decision 5 reads it (energy taken back, momentum real), the person's ground hit at 100% absorbed should lose its blast, crater and quake as any other landing does. If not, the page needs a reason that actually separates the cases, stated on the page.",
  "fix": "Treat a person's hits-ground with no air (airK = 0) as a landing under Safe passenger: take back E (shimmer), keep the momentum in the ground with the bearing cap, and don't count the crater or blast as harm. Or state a different, valid reason in README decision 7 and on the page, and say what happens to the person."
 },
 {
  "id": "physics-feel-vs-no-stress",
  "severity": "minor",
  "title": "The copy says the push is spread 'as gravity is' with 'no internal stress', then that they 'feel' a manageable push. By its own physics they would feel nothing (free fall)",
  "location": "rex-strength-lab/src/app.html:1320 (passengerText) and 348 (switch label); src/static-data.js 'Their powers' card",
  "evidence": "Throw text: 'Safe passenger: his push is spread through their whole body in proportion to its mass, as gravity is, so at the launch they feel only a manageable push.' Card: 'his hands put no stress on them (a body pushed that way has no internal stress: Cauchy's equation of motion), and the air's drag in flight and the landing are spread through them too. They feel a manageable push throughout'. A body force proportional to mass at every point gives zero stress and, by the equivalence principle, no sensation (the otoliths are pushed too). The person feels what they would in free fall, which is what the old switch text said ('they float as if falling'). The 'so' in the Throw text is a non sequitur. It matters most at the landing: about 59 g mean (118 g peak) at the least effort, 1,200 g mean at the default all-out, and about 10^6 g at a 10 km/s landing (T floored at 1 ms), all 'felt' only as 'manageable'.",
  "expected": "Canon's 'feels a manageable force' is met by zero felt force, so the page can keep canon's word without contradicting its own mechanism. It follows the brief's requested wording, but as written the physics sentence and the 'feel' sentence disagree.",
  "fix": "For example: 'his push is spread through their whole body in proportion to its mass, as gravity is, so it puts no stress on them: they feel no more than a manageable push (spread perfectly, they float as if falling).' Use the same in the card and the switch."
 },
 {
  "id": "physics-catch-squash-person",
  "severity": "minor",
  "title": "Default catch of a person says the first hit squashes the person by 3–7.6 cm, while Safe passenger (now on by default) spreads the catch through them with no stress",
  "location": "rex-strength-lab/src/app.html:2943 (catch happenings, first-hit text)",
  "evidence": "Fresh defaults, save {duoOpen:true, duoAction:'catch', cObj:'person'}. Happenings: '… When it hits them they move off together, and 59% of its energy goes into squashing his palms and the person by about 3 cm to 7.6 cm (an estimate).' In the same view: chip 'Safe passenger: throw, flight and catch spread through them', tile '28 g or more on the person (Safe passenger: spread through them, no harm)', and the card says his push 'has no internal stress'. The sentence is older, but until this pull request it showed with Safe passenger on only if the reader chose it. Now it is the default view of the person catch.",
  "expected": "With the stop spread through them in proportion to mass, the person isn't squashed. The first hit's deformation (and its share of the energy) belongs to his palms only, as the next item already says ('Stopping it puts 3.73 kJ … into his palms and arms').",
  "fix": "For a passenger with Safe passenger on, say 'squashing his palms (Safe passenger spreads it through the person, who isn't squashed)', or leave 'and the person' out of that sentence."
 }
]
```

</details>

**Subagent `verify:code`** · canon-review · started 2026-10-14 21:37:33 UTC

- verdicts: 2 (2 confirmed).

<details>
<summary>Prompt, verbatim (12,621 characters)</summary>

Workflow run `wf_d5a3b3c0-042`, phase `Verify`, agent `a708af6d785653c05`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/a708af6d785653c05.txt](prompts/a708af6d785653c05.txt).

```text
You are an independent reviewer of a change to the Rex Super-Strength Lab (rex-strength-lab/ in the repo /home/user/rex-strength-lab), a self-contained HTML page (a claude.ai Artifact) that simulates Rex and Ollie. CLAUDE.md is already loaded for you: its canon (especially "Rulings of 14 Oct 2026", "Momentum", "Default powers", "Restraint and absorption") and the owner's standard apply. The change is pull request 3 of rex-strength-lab/BRIEF-canon.md, on branch claude/canon-3-passenger (base claude/canon-2-recoil). It turns Safe passenger on by default and makes it cover the landing and the air's drag: engine MOVES.throw.passengerLaunch/passengerDrag/passenger (never with the switch on), passengerLanding {absorbed: the landing's energy, J: its momentum} with the switch on, no landing blast for a person with the switch on; page DEFAULTS.safePassenger true, the save mark 3 (an unmarked save or one marked 2 loads with it on), its own heading 'People they throw or catch', the summary line, the copy on Throw, Catch, the effort box and the cards; research relabel of comic_passenger_drag_g; tests (powers.js part 1 shim for the 8 Safe-passenger fixture keys, section 7, presence.js turned round, nine shots.js checks). Pull request #34 (stacked on #33, pull request 2: their own recoil to their source, already reviewed). Its diff: git diff claude/canon-2-recoil...claude/canon-3-passenger.
Read BRIEF-canon.md (item 5 and the Answers (Q8), plus item 6's note that a person's landing energy is shimmer; "Rules for every item"; the Answers) and RUN-canon.md. The author's decisions are in the README section named below and the pull request; check whether each is justified by the canon, the physics and the code, and stated where the owner will see it. Do not report a decision as a defect merely because it departs from the brief's letter, unless it is wrong, unjustified or not stated.
DECISIONS AND CONTEXT FROM THE AUTHOR:
See rex-strength-lab/README.md, section 'Safe passenger on by default (BRIEF-canon.md pull request 3)', decisions 1-11 and 'What moved', and pull request #34's description (mcp__github__pull_request_read, owner RoscoeRackham, repo rex-strength-lab, pullNumber 34). Key readings to check: the save mark 3 (why not 2); the landing's split (momentum real, energy taken back; the pulse is the person's own quick stop, about 31 ms and 59 g at the least effort, spread through them, not a gentle stop); no landing blast for a person with the switch on; heat not covered; only the person is a passenger; the game of catch with a person covered (a missed catch's landing taken back). With every power off (Safe passenger included) every result equals main's; with only the four defaults off and Safe passenger on, the 8 fixture cases go through a shim.
WORK IN YOUR OWN CLONE, never in /home/user/rex-strength-lab (another process may be using it): mkdir -p /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r1/<your-lens>/ && git clone -q /home/user/rex-strength-lab /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r1/<your-lens>/repo && cd /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r1/<your-lens>/repo && git checkout -q claude/canon-3-passenger && git log --oneline -1. Diff: git diff cl … [1,741 more characters on this line; the full prompt is in prompts/a708af6d785653c05.txt]
The owner is a professional critic: factual accuracy and honest labelling come first. Every finding must be REPRODUCED: give the exact input or place, what the page or code does (quote it, or your script's output), what is correct and why (with numbers), and a minimal fix. Report real defects only: wrong physics or formulas, momentum or energy bookkeeping errors, behaviour the brief or canon requires that is missing or wrong, results that changed with the powers off, wrong or unsupported claims, contradictions between page text and engine numbers, broken layout or controls, accessibility failures, state or migration bugs, tests that don't test what they say. Skip style preferences. Do NOT edit /home/user/rex-strength-lab; do not commit or push anything.

Another reviewer (code lens) reported the findings below. For EACH one, try hard to REFUTE it: reproduce it yourself with your own script or browser run, independently of theirs, in your own clone under /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r1/verify-code/. Mark real=true only if you reproduced it; put the command and its output in reproduction. Check whether it is a real defect under the canon and the brief (a recorded, justified decision is not a defect). Confirm the severity and give the best minimal fix (exact code or text). Default to real=false if you cannot reproduce it.

FINDINGS:
[
 {
  "id": "code-1",
  "severity": "major",
  "title": "A missed catch calls the person \"unharmed\" even when the page says their skin melts or part of them melts away (breaks decision 6)",
  "location": "rex-strength-lab/src/app.html line 3028 (bayCatch, the new `else if (o.passenger && state.safePassenger)` miss callout); rex-strength-lab/src/static-data.js, the Catch card sentence \"if the catch is missed they come down unharmed\"",
  "evidence": "Reproduced in Chromium on the built page (dist/index.html). Saved state: {saveV:3, duoOpen:true, duoAction:'catch', cObj:'person', cStyle:'hard', cMiss:true, cLogD:1, logKg:8, airAbsorb:0, keepForm:false}, with #duo-effort set to 'allout'. Safe passenger is on (the default).\n\nThe chips say: \"Fastball: 2,690 m/s … Safe passenger: throw, flight and catch spread through them … Nose air 2,800 °C: skin melts\".\n\nThe text says: \"Air at its nose reaches 2,800 °C, past the 1,538 °C where steel starts to melt, but the heat reaching it could melt under 1% of it (rough).\"\n\nThe new … [1,323 more characters on this line; the full prompt is in prompts/a708af6d785653c05.txt]
  "expected": "Safe passenger covers the push at the launch, the drag and the landing, not heating (decision 6, and the switch's own label: \"It doesn't cover heating in a very fast flight\"). Where Things keep their form is off, the air takes some of the drag, and the flight heats the person past 'warm' (the heat verdict is skin, loses or destroyed, or nose air above 1,200 K as on Throw), the miss callout should say the landing's energy is taken back and its push spread through them. It must not say they come down unharmed, as the Throw tab does.",
  "fix": "In bayCatch, compute `const hotC = !state.keepForm && airShareOf(cR) < 1 && a.heat && !['warm', 'immune'].includes(a.heat.kind);`. When hotC is true, end the callout with \"…takes back its energy (X), but it doesn't cover the heating in flight (above), so the lab can't say they come down unharmed. Its push still reaches the ground and shakes it.\" Add \"(not the heating in a very fast flight: Things keep their form covers that)\" to the Catch card sentence. Add a shots.js check on the state above that fails on today's page. Optionally give the \"no harm\" palm tile the same guard."
 },
 {
  "id": "code-2",
  "severity": "minor",
  "title": "No test guards the Throw tab's two Safe-passenger texts that used to say it doesn't cover the drag; restoring either old text passes every check",
  "location": "rex-strength-lab/test/shots.js (pull request 3 block, lines 856-928); rex-strength-lab/src/app.html passengerChip (line 1310) and passengerText's drag sentence (line 1321)",
  "evidence": "Mutant 'oldChip' brings back the old chip: `if (c.safePassenger) return dg > L.noHarm(1) ? status(..., 'Safe passenger, but air drag ' + sig(dg, 2) + ' g') : ...`. On a person thrown all-out at the default dial with Air resistance absorbed at 0% (saveV 3), the page then shows the chip \"Safe passenger, but air drag 3.5 g\" (warn or bad), in place of \"Safe passenger: a manageable push, spread through them\".\n\nMutant 'oldDragText' brings back the old sentence, giving \"…past the 1.5 g rides allow for that long; Safe passenger covers only his push, not the air.\"\n\nBoth mutants … [988 more characters on this line; the full prompt is in prompts/a708af6d785653c05.txt]
  "expected": "These are the two places that contradicted the 14 Oct 2026 ruling (Safe passenger covers the air's drag), so a check should fail if either comes back.",
  "fix": "In the pull request 3 block, load {saveV:3, action:'throw', obj:'person', airAbsorb:0} and pick all-out. Assert that the chip row contains 'Safe passenger: a manageable push, spread through them' and not 'but air drag'. Assert that .happens contains 'Safe passenger spreads that through them too' and not 'covers only his push'. Check that the new assertions fail on the two mutants."
 }
]
```

</details>

**Claude · 2026-10-14 20:36:40 UTC**

PR 3 round 1 is running. Meanwhile I'm drafting PR 5's spec from the shimmer mapping.


- `Bash` Read the PR 5 shimmer mapping: `cd /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad && python3 -c "` (+9 lines)
- `Write` /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/pr5/SPEC.md

**Claude · 2026-10-14 20:37:25 UTC**

PR 5's spec draft is written. Waiting on PR 3's review round 1.


*Woken · 2026-10-14 21:53:12 UTC · Background task wffh9ust3 completed: Dynamic workflow "Adversarial review round of a BRIEF-canon.md pull request: one reviewer per lens finds defects, one skeptic per lens reproduces or refutes each finding with code" completed. Next: Round 1 of PR 3: 8 findings, 7 confirmed (two describe the same major: a missed catch calls the person "unharmed" while the view says their skin melts). Reading the minor ones to decide fixes.*


- `Bash` Summarise PR 3 round 1 findings: `cd /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad && mkdir -p pr3 && python3 - <<'EOF'` (+10 lines)

**Claude · 2026-10-14 21:53:24 UTC**

Round 1 of PR 3: 8 findings, 7 confirmed (two describe the same major: a missed catch calls the person "unharmed" while the view says their skin melts). Reading the minor ones to decide fixes.


- `Bash` Read PR 3 round 1 minor findings: `cd /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad && python3 - <<'EOF'` (+9 lines)
- `Agent` Fix PR 3 review round 1 findings (general-purpose, in the background)

**Subagent `Fix PR 3 review round 1 findings`** · Agent tool, in the background · started 2026-10-14 21:53:51 UTC · reported 2026-10-14 23:06:41 UTC

- Review round 1 of pull request 3: 7 confirmed findings fixed, committed as 2449bc2. All 7 confirmed findings are fixed and committed on claude/canon-3-passenger (not pushed). Each fix has a check that I saw fail with the fix reverted in a scratch copy, 14 reverts in all.

<details>
<summary>Prompt, verbatim (4,356 characters)</summary>

Agent `a4c0e92c53ba32be9` (general-purpose).

```text
You are fixing the confirmed findings of review round 1 of pull request 3 of rex-strength-lab/BRIEF-canon.md (Safe passenger on by default; pull request #34, stacked on #33), in /home/user/rex-strength-lab on branch claude/canon-3-passenger (stay on it; don't push, merge or edit GitHub). CLAUDE.md is loaded. Context: /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/pr3/SPEC.md (the decisions) and the README section "Safe passenger on by default (BRIEF-canon.md pull request 3)". The build commit is 95a22f9.

The round's findings, with each reviewer's evidence and the skeptic's verdict and better fix, are in /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/pr3/round1-raw.json (lenses physics and code). 7 of 8 are confirmed; physics-catch-heat-unharmed and code-1 are the same defect (fix once, record under both). The refuted one (physics-feel-vs-no-stress) needs no change.

Decisions from the session lead:
- physics-catch-heat-unharmed / code-1 (major): apply decision 6 on the Catch tab too: where Things keep their form is off and the flight heats the person (use the Throw tab's rule, or the catch's own heat verdict), the miss callout, the catch tile and the 'Game of catch' card must not call them unharmed; say Safe passenger takes back the landing's energy and spreads its push but doesn't cover the heating in flight, so the lab can't say they come down unharmed.
- physics-fast-landing-bearing: keep the landing's momentum real and whole (no new canon), but past the speed where the landing's mean push exceeds what the ground bears over the person's area, don't claim 'no crater': say Safe passenger takes back its energy, but its push is more than the ground bears, so the ground gives way where they land (the lab doesn't size the hole) — Soft landing's precedent for his own feet. State the threshold (about 100 m/s on the default concrete slab; compute it per surface) in README decision 4 and Known limits, and that the shaking is rough past it.
- physics-no-quake-claim: drop 'quake' from the Impact line (the landing still shakes the ground; point to the effort box's reach).
- physics-hits-ground-exception: take the skeptic's preferred fix: in the game of catch, a person who hits the ground with no air (Air resistance absorbed at 100%) is a landing under Safe passenger: its energy is taken back (no crater, quake or blast counted as harm; with the bearing rule above, the ground gives way), its momentum reaches the ground; below 100% keep the fireball reading. Fix README decision 5/7 accordingly.
- physics-catch-squash-person and code-2: the skeptics' better fixes.

For each fix that changes behaviour or text, add or tighten a check that fails without it (confirm by reverting the fix in a scratch copy under /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/pr3/r1fix/). Keep powers-off results byte-identical (powers.js part 1 with its shim) and the powers-off page comparison passing; re-run the build's six mutants and confirm each still fails.

Run the full line one test at a time: cd rex-strength-lab && python3 build-data.py && node build.js && node test/calibration.js && node test/presence.js && node test/shots.js && node test/powers.js && node test/ladder.js && node test/sweep.js. All must pass.

Write rex-strength-lab/research/reviews/canon-3-round1.json in the format of canon-2-round1.json (round 1; what: the two lenses (physics and claims; code, layout and the migration), reviewed at 95a22f9/58c5374, each finding reproduced or refuted by a skeptic; script: 'workflow canon-review (args {pr: 3, round: 1, lenses: [physics, code]}); kept in history at the end of the run'; counts {findings: 8, confirmed: 7, refuted: ['physics-feel-vs-no-stress'], no_verdict: []}; lenses verbatim from round1-raw.json with an 'outcome' on each finding). Add a 'Review history' line in the README for pull request 3's round 1. Commit (with rebuilt dist/index.html and src/data.js) with a message ending:
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_0136zsmhtj8TCY2T2u8SKMVX

Report back: per finding the outcome and covering check (seen failing with the fix reverted); the bearing threshold per surface; test counts; anything not fixed.
```

</details>

<details>
<summary>Its report, verbatim (7,795 characters)</summary>

```text
## Review round 1 of pull request 3: 7 confirmed findings fixed, committed as 2449bc2

All 7 confirmed findings are fixed and committed on `claude/canon-3-passenger` (not pushed). Each fix has a check that I saw fail with the fix reverted in a scratch copy, 14 reverts in all. The build's six mutants still fail. The full test line passes, run one test at a time.

The commit holds the rebuilt `dist/index.html` and `src/data.js`, the new record `rex-strength-lab/research/reviews/canon-3-round1.json`, and the README changes. I didn't touch `STATUS.md` or the PR body. The working tree is clean.

The record's lenses are copied word for word from `round1-raw.json` (checked by script), with an `outcome` added to each finding. Its counts are {findings 8, confirmed 7, refuted [physics-feel-vs-no-stress], no_verdict []}.

### Per finding

- **physics-catch-heat-unharmed and code-1 (major, same defect, fixed once and recorded under both).**
  - The Catch tab now uses the Throw tab's rule. A person is "hot" when Safe passenger is on, Things keep their form is off (`!a.kept`), some drag is left, and the air at the nose passes 1,200 K. I didn't use `heat.kind`, because the catch judges a person against steel.
  - Where the person is hot, the miss callout says: "Safe passenger takes back the landing's energy (…) and spreads its push through them, with no blast, but it doesn't cover the heating in flight (above), so the lab can't say they come down unharmed."
  - The palm tile now reads "(Safe passenger: spread through them; it doesn't cover the heating in flight)" instead of "no harm". The Game of catch card has the heat caveat.
  - **Check:** the shots.js round 1 block, using code-1's state (cLogD 1, logKg 8, air 0%, Things keep their form off, all-out). Reverts hot-callout, hot-tile and hot-card each fail it.
  - **Not fixed (older than this PR):** the catch's heat item still judges a person against steel's 1,538 °C, because OBJ_MATERIAL has no person entry.
- **physics-fast-landing-bearing.**
  - New engine helper `PASSENGER.landGround(o, v, surface)`. It gives the landing's average push: its momentum over landShake's own stop, which matches landShake exactly. It also gives what the ground bears: its bearing pressure times the person's 0.67 m² facing area, less their weight. On sand and gravel the bearing scales with a width of √0.67 m. It also returns whether the ground gives way, and the speed where it starts.
  - The momentum stays real and whole, with no new canon. Past that speed the page drops "no crater" and adds: "But past a landing of about 100 m/s, that push is more than the concrete slab bears, even spread over their whole facing area, so the ground gives way where they land (the lab doesn't size the hole, and its shaking figures are rough there)." On ice and steel, which have no shaking figures, the last clause is left out.
  - This text is on the Throw landing text, the Impact line and the Catch miss callout. The two cards, README decision 4 and Known limits give the thresholds.
  - **Checks:**
    - powers.js section 7 (new): the push equals landShake's average push; the threshold falls in the right place on every ground; the rounded speeds; no give-way at the default dial all-out; 545 times past it at 10^9.15 kg; granite bears it.
    - shots.js: the 10^9.15 kg check on the slab and on granite, the Catch miss at 155 m/s against 60 m/s, and the card's speeds.
    - Reverts bear-throw, bear-impact, bear-catch and card-bearing each fail a page check. bear-engine (`gives` always false) fails powers.js at 155/156 and two page checks.
- **physics-no-quake-claim.** The Impact line now reads "…so no blast where they land (the ground still gives way under its push: above). Its push still reaches the ground and shakes it (the effort box gives how far)." Where the ground bears the push it says "no crater or blast". **Check:** the shots.js very-fast-impact check forbids "quake". Revert quake fails it.
- **physics-hits-ground-exception (the skeptic's preferred fix).** A person with Safe passenger on who hits the ground with no air (`hitsGround.airK` not above 0) is now treated as a landing.
  - The verdict says the energy (32.7 PJ) is taken back, so no blast, and they come down unharmed. Its push (2.4 billion kg·m/s) still reaches the ground, and the ground gives way where they land.
  - There is no crater or quake line and no "where it hits the ground" blast block. The effort box's blast leaves the hit's energy out, and its harm wording changed. Below 100% absorbed, the fireball reading stays.
  - README decisions 5 and 7 and the card say so.
  - It moves no effort preset: in two states compared with 58c5374, his hand's own air sets every preset first. The new harm wording sits behind the hand's sound-barrier harm, so it never shows.
  - **Check:** the shots.js round 1 block at logKg 16, cLogD 4.5, with 50% absorbed as the control. Reverts hits-ground and hits-ground-block each fail it.
- **physics-catch-squash-person (the skeptic's fix).** With Safe passenger on, the item says the first hit squashes only his palms; with it off, the text is as before. The card says so too. **Check:** the shots.js round 1 block checks both on and off. Revert squash fails it.
- **code-2 (the skeptic's check).** The Throw tab's drag chip and sentence in real air are now checked. The reviewer's two mutants, old-chip and old-drag-text, rebuilt on the fixed tree, each fail it.
- **physics-feel-vs-no-stress:** refuted, no change.

### Where the ground gives way under a person's landing (rounded on the page)

| Ground | Speed |
|---|---|
| Concrete slab (default) | 102 m/s |
| Asphalt | 102 m/s |
| Ice | 144 m/s |
| Steel deck | 5,570 m/s |
| Granite | 12,600 m/s |
| Loose sand | 19.8 m/s |
| Soft clay | 23.0 m/s |
| Stiff clay | 44.6 m/s |
| Dense gravel | 50.8 m/s |

At the default dial the person throw stays below the slab's threshold even all-out (81 m/s). An all-out 45° throw reaches it at a dial of about 145,000 kg.

### Mutants and tests

The build's six mutants, rebuilt on the fixed tree, each still fail:
- **Drag:** powers.js (5a and 7) and presence.js.
- **Landing energy:** powers.js and the page.
- **Landing momentum:** powers.js and the page's ceiling check.
- **Landing blast:** powers.js.
- **Migration skipped:** the page.
- **A mark-2 save read as a choice:** the page.

The full line, one test at a time, all passed:

| Test | Result |
|---|---|
| calibration | 117 checks, all passed |
| presence | 383 checks, all passed |
| shots | 81 ok lines, 0 problems; the powers-off page comparison shows 16 states the same and 0 changed |
| powers | 160/160; part 1 has the 15,533 cases byte-identical and the 8 Safe-passenger cases identical through the shim |
| ladder | 562/562 |
| sweep | 7,776 contexts, 0 problems |

I also checked the new texts' states at 390 px in light and dark: no sideways scroll, broken text or page errors.

### Still open (in Known limits or the record)

- **Ice:** nothing counts a person breaking through ice, which has no shaking model. At a 10^9 kg dial the courtesy ceiling is set by the boom, at a landing of about 340 m/s. That is past ice's 144 m/s, so a person can break through the ice below the ceiling.
- **The hole isn't harm:** the lab doesn't count the hole where a person lands as harm. That matches every other thrown object, where only blast and shaking count. On sand and soft clay the ceiling's landing speed (26 to 28 m/s) is past the threshold; as with his own feet in soil, that isn't harm.
- **Pull request 5's shimmer:** a catch person's ground-hit energy isn't in `passengerLanding`. The shimmer should read it from `hitsGround.E`.

Scratch files are in `scratchpad/pr3/r1fix/`: `revert.py`, `runall.sh`, `runmut.sh`, `record.py` and `full.log`.
```

</details>

**Claude · 2026-10-14 21:53:53 UTC**

The PR 3 round 1 fixer is running in the background.


> **Commit** `2449bc2` · 2026-10-14 23:06:13 UTC · Review round 1 of pull request 3 (Safe passenger): fix the 7 confirmed findings  [rex-strength-lab]


- `Bash` Push PR 3 round 1 fixes and note a PR 5 input: `git status --short | head -3; git log --oneline -2 && git push -q origin claude/canon-3-passenger 2>&1 | tail -1; echo "- From pull request 3's round 1: a pe...`


*Woken · 2026-10-14 23:06:42 UTC · Background task a4c0e92c53ba32be9 completed: Agent "Fix PR 3 review round 1 findings" finished. Next: PR 3 round 1 fixes pushed (2449bc2). Launching PR 3's round 2, the last of its two.*

**Claude · 2026-10-14 23:06:55 UTC**

PR 3 round 1 fixes pushed (`2449bc2`). Launching PR 3's round 2, the last of its two.


### Workflow `canon-review` · 2026-10-14 23:07:10 UTC

- `Workflow` canon-review: Adversarial review round of a BRIEF-canon.md pull request: one reviewer per lens finds defects, one skeptic per lens reproduces or refutes each finding with code (pull request 3, round 2)
  - run `wf_0d247280-8ed`: 4 subagents, listed below

**Subagent `review:physics`** · canon-review · started 2026-10-14 23:07:10 UTC

- findings: 5 (5 minor); verified ok: 14.

<details>
<summary>Prompt, verbatim (7,527 characters)</summary>

Workflow run `wf_0d247280-8ed`, phase `Review`, agent `a7fc8a8202e0aa107`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/a7fc8a8202e0aa107.txt](prompts/a7fc8a8202e0aa107.txt).

```text
You are an independent reviewer of a change to the Rex Super-Strength Lab (rex-strength-lab/ in the repo /home/user/rex-strength-lab), a self-contained HTML page (a claude.ai Artifact) that simulates Rex and Ollie. CLAUDE.md is already loaded for you: its canon (especially "Rulings of 14 Oct 2026", "Momentum", "Default powers", "Restraint and absorption") and the owner's standard apply. The change is pull request 3 of rex-strength-lab/BRIEF-canon.md, on branch claude/canon-3-passenger (base claude/canon-2-recoil). It turns Safe passenger on by default and makes it cover the landing and the air's drag (pull request #34, stacked on #33). Round 1's fixes are in commit 2449bc2; its record (every finding, verdict and outcome) is rex-strength-lab/research/reviews/canon-3-round1.json: read it. Diff: git diff claude/canon-2-recoil...claude/canon-3-passenger.
Read BRIEF-canon.md (item 5 and the Answers (Q8), plus item 6's note that a person's landing energy is shimmer; "Rules for every item"; the Answers) and RUN-canon.md. The author's decisions are in the README section named below and the pull request; check whether each is justified by the canon, the physics and the code, and stated where the owner will see it. Do not report a decision as a defect merely because it departs from the brief's letter, unless it is wrong, unjustified or not stated.
DECISIONS AND CONTEXT FROM THE AUTHOR:
See rex-strength-lab/README.md, section 'Safe passenger on by default (BRIEF-canon.md pull request 3)', decisions 1-11 and 'What moved', and pull request #34's description (mcp__github__pull_request_read, owner RoscoeRackham, repo rex-strength-lab, pullNumber 34). Key readings: the save mark 3; the landing's split (momentum real and whole, energy taken back; the pulse is the person's own quick stop, spread through them); past the speed where the landing's mean push exceeds what the ground bears over the person's facing area (PASSENGER.landGround: about 102 m/s on the default slab, 19.8 m/s on loose sand, 12,600 m/s on granite), the ground gives way where they land (the lab doesn't size the hole; the shaking is rough there) and the page doesn't claim 'no crater'; no landing blast for a person with the switch on; heat not covered (on Throw and Catch); only the person is a passenger; the game of catch with a person covered, including a person who hits the ground with no air (100% absorbed) treated as a landing; below 100% absorbed past 1% of light speed the fireball reading stays.
WORK IN YOUR OWN CLONE, never in /home/user/rex-strength-lab (another process may be using it): mkdir -p /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r2/<your-lens>/ && git clone -q /home/user/rex-strength-lab /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r2/<your-lens>/repo && cd /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r2/<your-lens>/repo && git checkout -q claude/canon-3-passenger && git log --oneline -1. Diff: git diff cl … [1,741 more characters on this line; the full prompt is in prompts/a7fc8a8202e0aa107.txt]
The owner is a professional critic: factual accuracy and honest labelling come first. Every finding must be REPRODUCED: give the exact input or place, what the page or code does (quote it, or your script's output), what is correct and why (with numbers), and a minimal fix. Report real defects only: wrong physics or formulas, momentum or energy bookkeeping errors, behaviour the brief or canon requires that is missing or wrong, results that changed with the powers off, wrong or unsupported claims, contradictions between page text and engine numbers, broken layout or controls, accessibility failures, state or migration bugs, tests that don't test what they say. Skip style preferences. Do NOT edit /home/user/rex-strength-lab; do not commit or push anything.

This is review round 2. Earlier rounds found and fixed the items below; check each fix holds, look for regressions, and look for anything missed:
Round 1 (canon-3-round1.json): 8 findings, 7 confirmed and fixed in 2449bc2: the missed catch called a person 'unharmed' while the view said their skin melts (major; the catch now uses the Throw tab's heat rule); fast landings past the ground's bearing (new PASSENGER.landGround; the page says the ground gives way past the threshold); 'no quake' dropped from the Impact line; a person hitting the ground with no air in the catch treated as a landing; the catch's squash text (only his palms with the switch on); missing checks for the Throw tab's drag chip and sentence. Refuted: physics-feel-vs-no-stress. Check each fix holds (revert it in a scratch copy and see its check fail), look for regressions, and look for anything round 1 missed.

LENS: PHYSICS AND CLAIMS. First, round 1's physics fixes with your own numbers: PASSENGER.landGround (the push it compares, the bearing it uses per surface, the person's facing area and width for sand and gravel, the thresholds in the cards and README), the give-way text on Throw, the Impact line and the Catch miss; the no-air hits-ground landing in the catch (its energy, momentum and the effort box's harms); the catch's heat rule for a person. Then a fresh pass: the landing's split at every speed from a gentle lob to light-speed fractions; the drag at every absorbed share; the game of catch with a person (lob, fastball, a miss, at unlimited strength); the person thrown straight up and straight down (0 deg, 90 deg, negative angles if possible); every figure and claim in the README section, the cards, the switch's hint and the PR description. Report wrong physics and wrong or unsupported claims with numbers.

Under verified_ok, list what you checked and found correct (with the numbers). Prefix finding ids with "physics-".
```

</details>

**Subagent `review:code`** · canon-review · started 2026-10-14 23:07:11 UTC

- findings: 3 (3 minor); verified ok: 16.

<details>
<summary>Prompt, verbatim (7,638 characters)</summary>

Workflow run `wf_0d247280-8ed`, phase `Review`, agent `a3923f7dd4a677372`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/a3923f7dd4a677372.txt](prompts/a3923f7dd4a677372.txt).

```text
You are an independent reviewer of a change to the Rex Super-Strength Lab (rex-strength-lab/ in the repo /home/user/rex-strength-lab), a self-contained HTML page (a claude.ai Artifact) that simulates Rex and Ollie. CLAUDE.md is already loaded for you: its canon (especially "Rulings of 14 Oct 2026", "Momentum", "Default powers", "Restraint and absorption") and the owner's standard apply. The change is pull request 3 of rex-strength-lab/BRIEF-canon.md, on branch claude/canon-3-passenger (base claude/canon-2-recoil). It turns Safe passenger on by default and makes it cover the landing and the air's drag (pull request #34, stacked on #33). Round 1's fixes are in commit 2449bc2; its record (every finding, verdict and outcome) is rex-strength-lab/research/reviews/canon-3-round1.json: read it. Diff: git diff claude/canon-2-recoil...claude/canon-3-passenger.
Read BRIEF-canon.md (item 5 and the Answers (Q8), plus item 6's note that a person's landing energy is shimmer; "Rules for every item"; the Answers) and RUN-canon.md. The author's decisions are in the README section named below and the pull request; check whether each is justified by the canon, the physics and the code, and stated where the owner will see it. Do not report a decision as a defect merely because it departs from the brief's letter, unless it is wrong, unjustified or not stated.
DECISIONS AND CONTEXT FROM THE AUTHOR:
See rex-strength-lab/README.md, section 'Safe passenger on by default (BRIEF-canon.md pull request 3)', decisions 1-11 and 'What moved', and pull request #34's description (mcp__github__pull_request_read, owner RoscoeRackham, repo rex-strength-lab, pullNumber 34). Key readings: the save mark 3; the landing's split (momentum real and whole, energy taken back; the pulse is the person's own quick stop, spread through them); past the speed where the landing's mean push exceeds what the ground bears over the person's facing area (PASSENGER.landGround: about 102 m/s on the default slab, 19.8 m/s on loose sand, 12,600 m/s on granite), the ground gives way where they land (the lab doesn't size the hole; the shaking is rough there) and the page doesn't claim 'no crater'; no landing blast for a person with the switch on; heat not covered (on Throw and Catch); only the person is a passenger; the game of catch with a person covered, including a person who hits the ground with no air (100% absorbed) treated as a landing; below 100% absorbed past 1% of light speed the fireball reading stays.
WORK IN YOUR OWN CLONE, never in /home/user/rex-strength-lab (another process may be using it): mkdir -p /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r2/<your-lens>/ && git clone -q /home/user/rex-strength-lab /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r2/<your-lens>/repo && cd /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r2/<your-lens>/repo && git checkout -q claude/canon-3-passenger && git log --oneline -1. Diff: git diff cl … [1,741 more characters on this line; the full prompt is in prompts/a3923f7dd4a677372.txt]
The owner is a professional critic: factual accuracy and honest labelling come first. Every finding must be REPRODUCED: give the exact input or place, what the page or code does (quote it, or your script's output), what is correct and why (with numbers), and a minimal fix. Report real defects only: wrong physics or formulas, momentum or energy bookkeeping errors, behaviour the brief or canon requires that is missing or wrong, results that changed with the powers off, wrong or unsupported claims, contradictions between page text and engine numbers, broken layout or controls, accessibility failures, state or migration bugs, tests that don't test what they say. Skip style preferences. Do NOT edit /home/user/rex-strength-lab; do not commit or push anything.

This is review round 2. Earlier rounds found and fixed the items below; check each fix holds, look for regressions, and look for anything missed:
Round 1 (canon-3-round1.json): 8 findings, 7 confirmed and fixed in 2449bc2: the missed catch called a person 'unharmed' while the view said their skin melts (major; the catch now uses the Throw tab's heat rule); fast landings past the ground's bearing (new PASSENGER.landGround; the page says the ground gives way past the threshold); 'no quake' dropped from the Impact line; a person hitting the ground with no air in the catch treated as a landing; the catch's squash text (only his palms with the switch on); missing checks for the Throw tab's drag chip and sentence. Refuted: physics-feel-vs-no-stress. Check each fix holds (revert it in a scratch copy and see its check fail), look for regressions, and look for anything round 1 missed.

LENS: CODE, LAYOUT AND THE MIGRATION. First, revert each of round 1's fixes in a scratch copy and confirm the check its outcome names fails. Then: the save mark (no mark, marks 1, 2, 3, malformed, with safePassenger false and true, with m 3007; saves written by main's, #33's and this branch's pages); VALID and what is saved back; the summary line in every combination of the five default powers; mutants (the drag with the switch on, the landing energy, the landing momentum, the blast, the migration, a mark-2 save read as a choice, a catch drag counted, safePassenger in anyPower, landGround always false or always true, the heat rule dropped on Catch): report survivors. NaN/undefined/Infinity in text for a person at unlimited strength and at light-speed fractions, on Throw and Catch. Layout and accessibility of every new text at 390 and 1280 px, light and dark (the give-way sentences are long: check wrapping). Do the shots.js checks test what they say? Time test/shots.js and the whole line: will CI's 20-minute limit hold?

Under verified_ok, list what you checked and found correct (with the numbers). Prefix finding ids with "code-".
```

</details>

**Subagent `verify:physics`** · canon-review · started 2026-10-14 23:26:16 UTC

- verdicts: 5 (5 confirmed).

<details>
<summary>Prompt, verbatim (19,421 characters)</summary>

Workflow run `wf_0d247280-8ed`, phase `Verify`, agent `a93d8045400844e50`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/a93d8045400844e50.txt](prompts/a93d8045400844e50.txt).

```text
You are an independent reviewer of a change to the Rex Super-Strength Lab (rex-strength-lab/ in the repo /home/user/rex-strength-lab), a self-contained HTML page (a claude.ai Artifact) that simulates Rex and Ollie. CLAUDE.md is already loaded for you: its canon (especially "Rulings of 14 Oct 2026", "Momentum", "Default powers", "Restraint and absorption") and the owner's standard apply. The change is pull request 3 of rex-strength-lab/BRIEF-canon.md, on branch claude/canon-3-passenger (base claude/canon-2-recoil). It turns Safe passenger on by default and makes it cover the landing and the air's drag (pull request #34, stacked on #33). Round 1's fixes are in commit 2449bc2; its record (every finding, verdict and outcome) is rex-strength-lab/research/reviews/canon-3-round1.json: read it. Diff: git diff claude/canon-2-recoil...claude/canon-3-passenger.
Read BRIEF-canon.md (item 5 and the Answers (Q8), plus item 6's note that a person's landing energy is shimmer; "Rules for every item"; the Answers) and RUN-canon.md. The author's decisions are in the README section named below and the pull request; check whether each is justified by the canon, the physics and the code, and stated where the owner will see it. Do not report a decision as a defect merely because it departs from the brief's letter, unless it is wrong, unjustified or not stated.
DECISIONS AND CONTEXT FROM THE AUTHOR:
See rex-strength-lab/README.md, section 'Safe passenger on by default (BRIEF-canon.md pull request 3)', decisions 1-11 and 'What moved', and pull request #34's description (mcp__github__pull_request_read, owner RoscoeRackham, repo rex-strength-lab, pullNumber 34). Key readings: the save mark 3; the landing's split (momentum real and whole, energy taken back; the pulse is the person's own quick stop, spread through them); past the speed where the landing's mean push exceeds what the ground bears over the person's facing area (PASSENGER.landGround: about 102 m/s on the default slab, 19.8 m/s on loose sand, 12,600 m/s on granite), the ground gives way where they land (the lab doesn't size the hole; the shaking is rough there) and the page doesn't claim 'no crater'; no landing blast for a person with the switch on; heat not covered (on Throw and Catch); only the person is a passenger; the game of catch with a person covered, including a person who hits the ground with no air (100% absorbed) treated as a landing; below 100% absorbed past 1% of light speed the fireball reading stays.
WORK IN YOUR OWN CLONE, never in /home/user/rex-strength-lab (another process may be using it): mkdir -p /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r2/<your-lens>/ && git clone -q /home/user/rex-strength-lab /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r2/<your-lens>/repo && cd /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r2/<your-lens>/repo && git checkout -q claude/canon-3-passenger && git log --oneline -1. Diff: git diff cl … [1,741 more characters on this line; the full prompt is in prompts/a93d8045400844e50.txt]
The owner is a professional critic: factual accuracy and honest labelling come first. Every finding must be REPRODUCED: give the exact input or place, what the page or code does (quote it, or your script's output), what is correct and why (with numbers), and a minimal fix. Report real defects only: wrong physics or formulas, momentum or energy bookkeeping errors, behaviour the brief or canon requires that is missing or wrong, results that changed with the powers off, wrong or unsupported claims, contradictions between page text and engine numbers, broken layout or controls, accessibility failures, state or migration bugs, tests that don't test what they say. Skip style preferences. Do NOT edit /home/user/rex-strength-lab; do not commit or push anything.

This is review round 2. Earlier rounds found and fixed the items below; check each fix holds, look for regressions, and look for anything missed:
Round 1 (canon-3-round1.json): 8 findings, 7 confirmed and fixed in 2449bc2: the missed catch called a person 'unharmed' while the view said their skin melts (major; the catch now uses the Throw tab's heat rule); fast landings past the ground's bearing (new PASSENGER.landGround; the page says the ground gives way past the threshold); 'no quake' dropped from the Impact line; a person hitting the ground with no air in the catch treated as a landing; the catch's squash text (only his palms with the switch on); missing checks for the Throw tab's drag chip and sentence. Refuted: physics-feel-vs-no-stress. Check each fix holds (revert it in a scratch copy and see its check fail), look for regressions, and look for anything round 1 missed.

Another reviewer (physics lens) reported the findings below. For EACH one, try hard to REFUTE it: reproduce it yourself with your own script or browser run, independently of theirs, in your own clone under /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r2/verify-physics/. Mark real=true only if you reproduced it; put the command and its output in reproduction. Check whether it is a real defect under the canon and the brief (a recorded, justified decision is not a defect). Confirm the severity and give the best minimal fix (exact code or text). Default to real=false if you cannot reproduce it.

FINDINGS:
[
 {
  "id": "physics-landground-1ms-floor",
  "severity": "minor",
  "title": "The steel and granite give-way speeds (5.6 km/s, 13 km/s) and the granite page's 'no crater' rest on the shaking model's 1 ms pulse floor, not on the stop the README describes",
  "location": "rex-strength-lab/src/engine.js PASSENGER.landGround (T = Math.max(1e-3, L / v), ~4327); README decision 4 and Known limits; Their powers card (src/static-data.js); test/powers.js section 7 (r2(vb('steel')) === 5600, r2(vb('granite')) === 13000, !lgOf(all9,'granite').gives); test/shots.js very-fast impact on granite",
  "evidence": "README decision 4 says the ground's pulse is 'the person's own stop, about their size over the landing speed'. landGround instead uses T = max(1 ms, L/v). The 1 ms floor is landShake's, from the Walk tab's ground-wave model (commit 3f550ef), not a stop time. L = 0.5594 m, so the floor applies above L/1 ms = 559 m/s. The slab, asphalt, ice and soil thresholds (102, 144, 19.8-50.8 m/s) are below that and unaffected, but steel and granite are above it. My script gives bear = 5.025e8 N (steel) and 1.139e9 N (granite). landGround's vBear is 5,567 and 12,619 m/s. With the README's stop (T = L/v, mean push m v²/L) the thresholds are sqrt(bear L/m) = 1,765 m/s (steel) and 2,657 m/s (granite). At its vBear the floored stop moves the person v T/2 = 2.8 m (steel) and 6.3 m (granite) into the ground: 5 to 11 times their own size, so the ground has given way. Page, {action:'throw', obj:'person', logKg:9.15, surface:'granite'}, all-out: 'They land at 10.1 km/s ... Impact: 1.1 t TNT, all of it taken back by Safe passenger, so no crater or blast where they land.' Over the stop in their own size the mean push is 90.26 × 10,110² / 0.5594 = 1.65e10 N, 14.5 times what granite bears over 0.67 m². Even the engine's own floored Hann pulse peaks at 2 × 9.13e8 = 1.83e9 N, past the 1.14e9 N bearing.",
  "expected": "With the stop decision 4 states, a person landing on granite gives the ground way from about 2.7 km/s, and on the steel deck from about 1.8 km/s. A 10.1 km/s landing on granite pushes about 15 times past what granite bears, so the page shouldn't say 'no crater'.",
  "fix": "In landGround, compare the bearing with the push over the stop decision 4 describes, T = L / v, with no 1 ms floor (keep the floor in landShake, where it belongs to the shaking model): push = vToMomentum(v, m) · v / L, vBear = sqrt(bear · L / m). Update the README (decision 4, Known limits) and the Their powers card to about 1.8 km/s on steel and 2.7 km/s on granite. In powers.js expect 1,800 and 2,700 m/s. Move the shots.js granite case to a landing below 2.7 km/s (for example a 10^7.5 kg dial, which lands at 1.5 km/s), or expect the give-way sentence at 10^9.15 kg."
 },
 {
  "id": "physics-landground-angle",
  "severity": "minor",
  "title": "landGround compares the whole landing momentum with a vertical bearing capacity, so a grazing landing is said to make 'the ground give way' when its downward push is a small fraction of what the ground bears",
  "location": "rex-strength-lab/src/engine.js PASSENGER.landGround (~4320); src/app.html landGivesText (Throw), the Catch miss callout (givesM) and the hits-ground text; test/shots.js round 1 block (cLogD 2, logKg 8, air 0: expects the give-way sentence at 155 m/s)",
  "evidence": "landGround takes push = |p| / T and ignores the landing angle. The engine's own rule for landings, weakGround, splits the momentum. It compares the downward part J·sinθ with the bearing, and the sideways part with friction ('Sideways his landing goes in whole, as on real ground (he skids it out: nothing breaks for it)', engine.js ~2024). My script, over landShake's own T = L/v on the concrete slab: (1) Throw tab, {action:'throw', obj:'person', logKg:5.5, angle:0}, all-out. The page says 'They land at 151 m/s ... But past a landing of about 100 m/s, that push is more than the con … [913 more characters on this line; the full prompt is in prompts/a93d8045400844e50.txt]
  "expected": "For a shallow landing the ground bears the downward part; the sideways part is a skid that, by the engine's own precedent, breaks nothing. A person skimming in at 2-3° at 150 m/s presses down with about a tenth of what the slab bears, so 'the ground gives way where they land' is wrong there.",
  "fix": "Pass the landing angle to landGround and compare J·sin(θ)/T with the bearing, as weakGround does. On Throw use r.flight.impactAngleDeg. In the Catch, record impactAngleDeg in out.miss (fm.impactAngleDeg) and use the chord's angle for hits-ground. State that the README and card speeds are for a landing straight down (about 120 m/s at 45° on the slab). Update the shots.js catch case, whose 2° landing should no longer give way. The landing's shaking also treats the whole momentum as a vertical pulse, which overstates it for shallow landings; that is older than this pull request but now sets the person throw's ceiling, so mention it in Known limits."
 },
 {
  "id": "physics-hits-ground-below-100",
  "severity": "minor",
  "title": "Below 100% absorbed, a person held whole who hits the ground is still counted with the full blast, crater and quake, though almost all of that energy is their own landing, which Safe passenger covers",
  "location": "rex-strength-lab/src/app.html spHitsGround (requires !(hitsGround.airK > 0)), the hits-ground verdict, the blast block and duoFacts; README decision 7",
  "evidence": "Page, {duoOpen:true, duoAction:'catch', cObj:'person', cStyle:'hard', cMiss:true, logKg:16, cLogD:4.5, saveV:3}, all-out. At airAbsorb 1: 'That is their landing, and Safe passenger covers it: it takes back all of that energy, so no blast ...'. The same at airAbsorb 0.999 (Things keep their form on): '... the air it meets turns to plasma around it, from the 0% of the drag that still acts, and their power keeps it whole ... The person hits the ground about 1.15 km from Rex, carrying 32.7 PJ (7.8 Mt TNT), the heat of the air it swept up on the way included, and blasts a crater up to 181 m across ..., felt like a magnitude 5.1 quake.' Safe passenger isn't mentioned. Engine (catchLeg, the same settings): hitsGround.E = 3.266e16 J and airHeat (the swept air's heat) = 3.37e14 J at 99.9%, so the person's own share is 99.0%. At 99% it is 90.6%, and at 90% it is 49%. Decision 7 justifies the exception as 'Below 100% the air it meets turns to plasma and rides with it into the ground'. That is true of only 1% of the energy at 99.9%, so the page jumps from no blast at 100% to a 7.8 Mt crater at 99.9%.",
  "expected": "With Things keep their form on (kept: the person comes through whole) and Safe passenger on, the person's own landing energy, E minus the swept air's heat, is their landing and is taken back, as decision 7 says for 100%. Only the plasma's share (airHeat) is a real blast, crater or quake.",
  "fix": "In spHitsGround, also accept airK > 0 when hitsGround.kept. Take back E − airHeat as the person's landing, and count only airHeat in the blast block, the crater and quake text, and duoFacts' Eair. Keep the old reading only where the person isn't kept (Things keep their form off: 'Its plasma and debris hit'). Say so in README decision 7 and the Game of catch card."
 },
 {
  "id": "physics-hits-ground-unbounded-push",
  "severity": "minor",
  "title": "At unlimited strength or the top of the dial, the no-air hits-ground text says an unbounded (or 1.1 × 10²⁶ kg·m/s) push into the Earth merely 'shakes it'",
  "location": "rex-strength-lab/src/app.html, the hits-ground verdict for spHitsGround ('Its push (...) still reaches the ground and shakes it.') and duoFacts' harm; README decision 7",
  "evidence": "Page, {duoOpen:true, duoAction:'catch', cObj:'person', cStyle:'hard', cMiss:true, inf:true, cLogD:4.5}, all-out: '... carrying unbounded energy. That is their landing, and Safe passenger covers it: it takes back all of that energy, so no blast, and spreads the stop through them, so they come down unharmed. Its push (unbounded) still reaches the ground and shakes it. But past a landing of about 100 m/s ... the ground gives way where they land (the lab doesn't size the hole).' Pull request 2's page said 'carrying unbounded energy: planet-scale, so crater scaling no longer applies.' At logKg 34 the page gives 'Its push (110 septillion kg·m/s) still reaches the ground and shakes it.' Decision 4 keeps that momentum real and whole. Delivered to the whole Earth, 1.1e26 kg·m/s gives it 1.1e26 / 5.97e24 = 18 m/s and at least p²/(2 M_E) = 1.0e27 J of motion, about 2,500 times the Chicxulub impact (about 4 × 10²³ J). None of that is the person's energy that Safe passenger takes back. Any part of the ground smaller than the whole planet would get far more. An unbounded push can't be taken by the planet at all. The effort box lists only the hand's sound barrier.",
  "expected": "With the momentum real and whole, a push this large isn't a local shake: at the top of the dial it moves the whole planet and carries a planet-scale energy, and an unbounded push has no physical answer. The page should say so, not 'shakes it'. Alternatively the owners could rule that the excess is 'the ground's share it can't bear' (canon's momentum case; Q9 covers a push with no push time at unlimited strength). That would be a new reading for the owners to confirm.",
  "fix": "In the spHitsGround text, give the Earth's recoil p / M_E and the least energy that momentum carries into it, p²/(2 M_E), and call it planet-scale once that passes the page's planet-scale line. When p is unbounded, say the push is unbounded, so no ground or planet can take it and the lab can't model it. Count it as planet-scale harm in duoFacts. Or put the ruling question in STATUS.md under Waiting on, and say on the page which reading it uses."
 },
 {
  "id": "physics-pr-description-stale",
  "severity": "minor",
  "title": "Pull request #34's description wasn't updated after round 1: stale test count, 'review rounds under way', and none of round 1's readings",
  "location": "GitHub pull request #34 description; STATUS.md 'In progress' ('Its two review rounds are next')",
  "evidence": "The PR body (head 2449bc2) says 'powers: 159/159'. The round 1 record gives 160/160 after the fixes, with a new powers.js check. The body also says 'Review rounds: two ... They're under way; this description and the README's review history will be updated as each closes.' Round 1 closed in 2449bc2 and the README was updated, but the description wasn't. Its decisions list says the landing 'shakes the ground as a real landing does' and that 'A missed catch's landing is taken back like a throw's'. It doesn't mention round 1's readings that the owner is asked to judge: past what the ground bears the ground gives way where they land and the lab doesn't size the hole, the no-air hits-ground throw as a Safe passenger landing with the fireball kept below 100%, or the 1,200 K heat rule on Catch. STATUS.md still says the two review rounds 'are next'.",
  "expected": "The owner decides from the pull request, so the description should match the branch: the test counts, the rounds done, and the readings added in round 1.",
  "fix": "Update the PR description: powers 160/160; round 1 done (8 findings, 7 fixed, record canon-3-round1.json); add the give-way reading, the hits-ground reading and the Catch heat rule to its decisions. Update STATUS.md's 'In progress' line."
 }
]
```

</details>

**Subagent `verify:code`** · canon-review · started 2026-10-15 00:55:56 UTC

- verdicts: 3 (3 confirmed).

<details>
<summary>Prompt, verbatim (15,689 characters)</summary>

Workflow run `wf_0d247280-8ed`, phase `Verify`, agent `a388076f8d49487ca`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/a388076f8d49487ca.txt](prompts/a388076f8d49487ca.txt).

```text
You are an independent reviewer of a change to the Rex Super-Strength Lab (rex-strength-lab/ in the repo /home/user/rex-strength-lab), a self-contained HTML page (a claude.ai Artifact) that simulates Rex and Ollie. CLAUDE.md is already loaded for you: its canon (especially "Rulings of 14 Oct 2026", "Momentum", "Default powers", "Restraint and absorption") and the owner's standard apply. The change is pull request 3 of rex-strength-lab/BRIEF-canon.md, on branch claude/canon-3-passenger (base claude/canon-2-recoil). It turns Safe passenger on by default and makes it cover the landing and the air's drag (pull request #34, stacked on #33). Round 1's fixes are in commit 2449bc2; its record (every finding, verdict and outcome) is rex-strength-lab/research/reviews/canon-3-round1.json: read it. Diff: git diff claude/canon-2-recoil...claude/canon-3-passenger.
Read BRIEF-canon.md (item 5 and the Answers (Q8), plus item 6's note that a person's landing energy is shimmer; "Rules for every item"; the Answers) and RUN-canon.md. The author's decisions are in the README section named below and the pull request; check whether each is justified by the canon, the physics and the code, and stated where the owner will see it. Do not report a decision as a defect merely because it departs from the brief's letter, unless it is wrong, unjustified or not stated.
DECISIONS AND CONTEXT FROM THE AUTHOR:
See rex-strength-lab/README.md, section 'Safe passenger on by default (BRIEF-canon.md pull request 3)', decisions 1-11 and 'What moved', and pull request #34's description (mcp__github__pull_request_read, owner RoscoeRackham, repo rex-strength-lab, pullNumber 34). Key readings: the save mark 3; the landing's split (momentum real and whole, energy taken back; the pulse is the person's own quick stop, spread through them); past the speed where the landing's mean push exceeds what the ground bears over the person's facing area (PASSENGER.landGround: about 102 m/s on the default slab, 19.8 m/s on loose sand, 12,600 m/s on granite), the ground gives way where they land (the lab doesn't size the hole; the shaking is rough there) and the page doesn't claim 'no crater'; no landing blast for a person with the switch on; heat not covered (on Throw and Catch); only the person is a passenger; the game of catch with a person covered, including a person who hits the ground with no air (100% absorbed) treated as a landing; below 100% absorbed past 1% of light speed the fireball reading stays.
WORK IN YOUR OWN CLONE, never in /home/user/rex-strength-lab (another process may be using it): mkdir -p /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r2/<your-lens>/ && git clone -q /home/user/rex-strength-lab /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r2/<your-lens>/repo && cd /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r2/<your-lens>/repo && git checkout -q claude/canon-3-passenger && git log --oneline -1. Diff: git diff cl … [1,741 more characters on this line; the full prompt is in prompts/a388076f8d49487ca.txt]
The owner is a professional critic: factual accuracy and honest labelling come first. Every finding must be REPRODUCED: give the exact input or place, what the page or code does (quote it, or your script's output), what is correct and why (with numbers), and a minimal fix. Report real defects only: wrong physics or formulas, momentum or energy bookkeeping errors, behaviour the brief or canon requires that is missing or wrong, results that changed with the powers off, wrong or unsupported claims, contradictions between page text and engine numbers, broken layout or controls, accessibility failures, state or migration bugs, tests that don't test what they say. Skip style preferences. Do NOT edit /home/user/rex-strength-lab; do not commit or push anything.

This is review round 2. Earlier rounds found and fixed the items below; check each fix holds, look for regressions, and look for anything missed:
Round 1 (canon-3-round1.json): 8 findings, 7 confirmed and fixed in 2449bc2: the missed catch called a person 'unharmed' while the view said their skin melts (major; the catch now uses the Throw tab's heat rule); fast landings past the ground's bearing (new PASSENGER.landGround; the page says the ground gives way past the threshold); 'no quake' dropped from the Impact line; a person hitting the ground with no air in the catch treated as a landing; the catch's squash text (only his palms with the switch on); missing checks for the Throw tab's drag chip and sentence. Refuted: physics-feel-vs-no-stress. Check each fix holds (revert it in a scratch copy and see its check fail), look for regressions, and look for anything round 1 missed.

Another reviewer (code lens) reported the findings below. For EACH one, try hard to REFUTE it: reproduce it yourself with your own script or browser run, independently of theirs, in your own clone under /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr3-r2/verify-code/. Mark real=true only if you reproduced it; put the command and its output in reproduction. Check whether it is a real defect under the canon and the brief (a recorded, justified decision is not a defect). Confirm the severity and give the best minimal fix (exact code or text). Default to real=false if you cannot reproduce it.

FINDINGS:
[
 {
  "id": "code-ice-shaking-counts",
  "severity": "minor",
  "title": "On ice and the steel deck the person throw's effort box says the landing's shaking 'counts' and the Impact line says 'the effort box gives how far'. The same box says the lab can't judge shaking there.",
  "location": "rex-strength-lab/src/app.html:3836-3837 (effort box person paragraph, Safe passenger on and off) and :1642 (Throw tab Impact line for a Safe-passenger person)",
  "evidence": "Built page at 2449bc2, 1280 px, Throw tab.\n\nSave {saveV:3, action:'throw', obj:'person', surface:'ice'}, least disruptive. The effort box reads: 'Courtesy ceiling: none. ... It has no ground-wave model for the ice, so it can't judge the ground shaking here. ... For a person, Safe passenger covers the launch, the air in flight and the landing. The landing's energy is taken back, so they come down unharmed; its push still reaches the ground, and the shaking from it counts. ... Ground shaking: no ground-wave model for the ice.' The steel deck gives the same text.\n\nWith safePass … [1,118 more characters on this line; the full prompt is in prompts/a388076f8d49487ca.txt]
  "expected": "Where P.groundOf(c.surface) is false (ice, steel deck), nothing counts the landing's shaking. The effort box shouldn't say it counts, and the Impact line shouldn't send the reader to a distance the box doesn't give. On the seven grounds that have a model, both claims hold: on concrete at 10^9.15 kg all-out the box gives 'now out to 247 m from where it lands'.",
  "fix": "In the effort box, only claim the count where the ground has a model:\n- Safe passenger on: (landsP ? '. The landing's energy is taken back' + ... + '; its push still reaches the ground' + (P.groundOf(c.surface) ? ', and the shaking from it counts.' : ' (the lab has no ground-wave model for ' + theSurf(c.surface) + ', so it can't judge that shaking).') : '.')\n- Safe passenger off: only add '(its shaking still counts)' when P.groundOf(c.surface).\n\nIn the Impact line, replace ' (the effort box gives how far)' with boxShake(c, 'gives how far').\n\nAdd a shots.js check: a person thrown on ice, at least effort and at 10^9.15 kg all-out, with no 'shaking from it counts', 'shaking still counts' or 'effort box gives how far'."
 },
 {
  "id": "code-r1-card-fixes-unchecked",
  "severity": "minor",
  "title": "Two of round 1's Game of catch card fixes have no covering check: reverting either passes every test",
  "location": "rex-strength-lab/src/static-data.js, the 'Game of catch' card; rex-strength-lab/test/shots.js:952-971 (the review round 1 block)",
  "evidence": "Each revert was applied in a scratch clone and rebuilt with python3 build-data.py && node build.js. Then shots.js's pull request 3 block was run verbatim on the page (harness: tools/pr3harness.js).\n\n(1) card-squash: remove ' (so the first hit squashes only his palms)'. This is part of the physics-catch-squash-person fix: its outcome says 'The Game of catch card adds ...'. Result: HARNESS ALL OK.\n\n(2) card-hitsground: remove ' With all of the drag absorbed, a person thrown so fast that the straight chord runs underground is landing too: Safe passenger takes back the energy of that hit, so it makes no blast, but its push is far more than the ground bears, so the ground gives way there.' This is part of the physics-hits-ground-exception fix: its outcome says 'README decisions 5 and 7 and the Game of catch card say so'. Result: HARNESS ALL OK.\n\nNo test file contains either sentence. grep -rn 'squashes only his palms|is landing too' test/ finds only a code comment. The only test that reads cards (calibration.js:413) checks body figures.\n\nThe round 1 record says 'Each fix's check was seen failing with the fix reverted', but its reverts covered only the bayCatch squash text (revert 'squash') and the verdict and blast block (reverts 'hits-ground' and 'hits-ground-block'). The other card parts of round 1 are covered: reverting the heat sentence or the bearing speeds each fails a check.",
  "expected": "Every part of a confirmed fix that a reader sees should fail a check when reverted, as RUN-canon.md's re-check asks and as pull request 2's re-check did for its two uncovered page fixes.",
  "fix": "In shots.js's review round 1 block, extend the existing `cards` assertion to also match /A person thrown in the game of catch is covered by Safe passenger \\(on by default\\): the throw, the flight and the catch are spread through them \\(so the first hit squashes only his palms\\)/ and /With all of the drag absorbed, a person thrown so fast that the straight chord runs underground is landing too: Safe passenger takes back the energy of that hit, so it makes no blast, but its push is far more than the ground bears, so the ground gives way there\\./."
 },
 {
  "id": "code-pr34-description-stale",
  "severity": "minor",
  "title": "Pull request #34's description wasn't updated after round 1: stale counts, and the new readings the owner is asked to confirm are missing",
  "location": "GitHub pull request #34 description (RoscoeRackham/rex-strength-lab); head 2449bc2",
  "evidence": "Read with mcp__github__pull_request_read get, pullNumber 34, head sha 2449bc2.\n\nIt says 'powers: 159/159'. On 2449bc2, node test/powers.js gives '160/160 passed', and the round 1 record says 160/160.\n\nIt says 'Nine new test/shots.js checks each fail on #33's page'. Round 1 added a tenth block of checks.\n\nIt promises: 'Review rounds: two ... They're under way; this description and the README's review history will be updated as each closes.' Round 1 closed in 2449bc2 and the README's history was updated; the description was not.\n\nIts 'Decisions' list (1-5) and 'What it needs: Owner: confirm or overrule decisions 1–2' leave out the readings round 1 added, which the README now states as decisions to confirm:\n- decision 4's ground giving way past what it bears (PASSENGER.landGround: about 100 m/s on the default slab, 20 m/s on loose sand, 13 km/s on granite). The page no longer says 'no crater' there, and the hole isn't counted as harm.\n- decision 7's change: a person who hits the ground with no air in the game of catch is treated as a Safe passenger landing, with no crater, quake or blast.\n- decision 6 extended to the Catch tab (the 1,200 K heat rule).\n\nThe description still says 'The person comes down unharmed: the landing's energy is taken back. Its momentum still reaches the ground, so it shakes the ground as a real landing does', with no mention of the ground giving way.",
  "expected": "CLAUDE.md rule 3 says the pull request states what changed, how it was tested and what it needs from the other person. The brief and RUN-canon.md ask the owner to confirm the landing's reading, and the task asks that each decision be stated where the owner will see it. After a round changes the readings, the description should carry them and the current test counts. Pull request 2's re-check counted the same lapse ('the pull request's description still gave round 2's pull').",
  "fix": "Update #34's body:\n- powers 160/160.\n- Round 1's checks added to the shots line.\n- Decisions for the ground giving way past its bearing (with the per-ground speeds, and that the lab neither sizes the hole nor counts it as harm), the no-air hits-ground landing in the game of catch, and the heat rule on Catch, each listed under 'What it needs' for the owner to confirm.\n- A line saying round 1 is done, with a link to research/reviews/canon-3-round1.json."
 }
]
```

</details>

**Claude · 2026-10-14 23:07:12 UTC**

PR 3 round 2 is running in the background.


*Woken · 2026-10-15 01:12:00 UTC · Background task wq1drmeab completed: Dynamic workflow "Adversarial review round of a BRIEF-canon.md pull request: one reviewer per lens finds defects, one skeptic per lens reproduces or refutes each finding with code" completed. Next: PR 3's close-out fixer is running. PR 4 will be built in two stages like PR 2 (engine with its tests, then page, copy and page tests), since it's the largest.*


- `Bash` Summarise PR 3 round 2 findings: `cd /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad && python3 - <<'EOF'` (+11 lines)
- `Agent` Fix PR 3 round 2 and close out (general-purpose, in the background)

**Subagent `Fix PR 3 round 2 and close out`** · Agent tool, in the background · started 2026-10-15 01:12:33 UTC · reported 2026-10-15 02:29:19 UTC

- Round 2 of pull request 3: all 8 findings fixed and committed. The commit is add3dcf on claude/canon-3-passenger. Nothing is pushed, merged or posted.

<details>
<summary>Prompt, verbatim (4,920 characters)</summary>

Agent `a5886d1d3f18a8050` (general-purpose).

```text
You are fixing the confirmed findings of review round 2 (the last round) of pull request 3 of rex-strength-lab/BRIEF-canon.md (Safe passenger on by default; pull request #34, stacked on #33), in /home/user/rex-strength-lab on branch claude/canon-3-passenger (stay on it; don't push, merge or edit GitHub). CLAUDE.md is loaded. Context: /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/pr3/SPEC.md, the README section "Safe passenger on by default (BRIEF-canon.md pull request 3)", and round 1's record rex-strength-lab/research/reviews/canon-3-round1.json (its fixes are in 2449bc2).

Round 2's findings with the skeptics' verdicts and better fixes are in /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/pr3/round2-raw.json. All 8 are confirmed. Fix every one, preferring the verdict's better_fix after checking it against the code:
- physics-landground-1ms-floor: landGround compares the bearing with the push over the stop decision 4 describes (T = L / v, no 1 ms floor; keep the floor in landShake, where it belongs to the shaking model); update the thresholds everywhere (README decision 4, Known limits, the cards, powers.js, shots.js's granite case).
- physics-landground-angle: compare only the downward part of the landing's push (pass the landing angle), as weakGround does; don't add keys to powers-off results (out.miss in the catch: compute the angle on the page or add a key only where Safe passenger is on).
- physics-hits-ground-below-100: a person held whole (Things keep their form on) who hits the ground below 100% absorbed: take back only the person's own landing energy (the skeptic's Ep formula), count the rest (the air's heat and swept air) as real; an engine key only in a powers-on case.
- physics-hits-ground-unbounded-push: an unbounded (or Earth-scale) push is not 'it shakes the ground': no physical answer at unbounded; past the blast-block line, what the whole Earth takes; count it as harm in duoFacts.
- code-ice-shaking-counts: on ice and steel say the lab has no ground-wave model there.
- code-r1-card-fixes-unchecked: add the two card checks.
- physics-pr-description-stale and code-pr34-description-stale (the same): write the updated pull request description to /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/pr3/pr-body.md (fetch the current body with mcp__github__pull_request_read, method get, owner RoscoeRackham, repo rex-strength-lab, pullNumber 34; keep its structure; bring the counts, decisions (add round 1's and round 2's readings for the owner to confirm: the ground gives way past what it bears under the landing's downward push, with the thresholds; the no-air hits-ground person as a landing; the kept-whole person below 100%), what moved and the review rounds up to date; say both review rounds are complete). The session lead posts it.

For each behaviour or text fix, add or tighten a check that fails with the fix reverted (scratch copies under /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/pr3/r2fix/). Keep every powers-off result byte-identical (powers.js part 1 with its shim) and the powers-off page comparison passing. Re-run the build's six mutants and round 1's reverts and confirm each still fails.

Run the full line one test at a time: cd rex-strength-lab && python3 build-data.py && node build.js && node test/calibration.js && node test/presence.js && node test/shots.js && node test/powers.js && node test/ladder.js && node test/sweep.js. All must pass. Also time the whole line (CI allows 20 minutes for all three projects; report the Rex lab's share).

Write rex-strength-lab/research/reviews/canon-3-round2.json in the same format as canon-3-round1.json (round 2; reviewed at 2449bc2; counts {findings: 8, confirmed: 8, refuted: [], no_verdict: []}; lenses verbatim with an 'outcome' on each finding). Close out the README: round 2's Review history line, and make the pull request 3 section read as a closed record (both rounds done; what is left and for which pull request, e.g. the shimmer reads the person's landing energy and the hits-ground energy in pull request 5). Update STATUS.md: pull request 3 built and reviewed (two rounds; records canon-3-round1.json and canon-3-round2.json), open as #34 on claude/canon-3-passenger, stacked on #33; pull request 4 next on claude/canon-4-contests; and under Waiting on, the owner's confirmations for #34 (the save mark 3; the landing's split; the give-way rule). Commit (with rebuilt dist/index.html and src/data.js) with a message ending:
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_0136zsmhtj8TCY2T2u8SKMVX

Report back: per finding the outcome and covering check (seen failing with the fix reverted); the new thresholds; test counts and times; anything not fixed.
```

</details>

<details>
<summary>Its report, verbatim (7,207 characters)</summary>

```text
## Round 2 of pull request 3: all 8 findings fixed and committed

The commit is `add3dcf` on `claude/canon-3-passenger`. Nothing is pushed, merged or posted. The full Rex lab test line passes, run one test at a time. Every powers-off result is still byte-identical, and the powers-off page comparison is unchanged.

### Each finding, and the check that covers it
Each revert was run in a scratch copy (`scratchpad/pr3/r2fix/revert.py`, run with `runall.sh`).

- **physics-landground-1ms-floor: fixed.** `PASSENGER.landGround` now uses the person's own stop time (their size over the landing speed), with no 1 ms floor. The floor stays in `landShake`. README decision 4, Known limits and the Their powers card now give 1.8 km/s for steel and 2.7 km/s for granite.
  - At a 10^9.15 kg dial, granite now gives way and the page no longer says "no crater". The "granite bears it" case moved to a 10^7.5 kg dial (1,510 m/s).
  - Checks: the tightened `powers.js` section 7 check, and the `shots.js` very-fast-impact check.
  - Revert `r2-floor` fails `powers.js` section 7 and two page checks. `r2-card-speeds` fails the card check.
- **physics-landground-angle: fixed.** `landGround` now takes the landing angle and compares only the downward part of the push. The Throw tab passes the flight's impact angle.
  - For the game of catch I added an engine function, `catchMissAngle`, instead of a key on the miss. The fixture has 32 person catch cases with `safePassenger` in their contexts, so a key would have changed powers-off results. The function rebuilds the miss's angle from the leg; its speed matches the leg's miss exactly.
  - Results:
    - A 151 m/s landing at 2.8° (thrown level) no longer gives way.
    - The catch fastball's 155 m/s miss at 2.1° no longer gives way.
    - A lob's 176 m/s miss at 45° does give way.
    - On the slab at 45° the threshold is 121 m/s, reached at a dial of about 202,000 kg.
  - Known limits now notes that `landShake` treats the whole push as downward.
  - Checks: new `powers.js` 7 checks; `shots.js` round-1 checks moved and tightened.
  - Reverts `r2-angle-engine`, `-throw`, `-catch` and `-hits` each fail.
- **physics-hits-ground-below-100: fixed.** It uses the skeptic's exact snowplow formula. The engine adds `hitsGround.own` only when Things keep their form is on, a powers-on case.
  - The person's own share is 97.9% at 99.9% absorbed, 82% at 99% and 24% at 90%.
  - The page takes back that share; only the swept air's energy counts. At 99.9% that is 672 TJ and a 66 m crater, not 181 m. The blast block and the effort-box blast count it.
  - With Things keep their form off, the old fireball reading stays.
  - Checks: `powers.js` 7 and the `shots.js` round 2 block. Reverts `r2-own` and `r2-own-engine`, plus round 1's `hits-ground` and `hits-ground-block`, each fail.
- **physics-hits-ground-unbounded-push: fixed.** No new canon.
  - At unlimited strength the page says the push "has no physical answer".
  - Once the least energy the push gives the whole Earth passes 1 kg of TNT (from a dial of about 6.5×10²³ kg), it is stated and counted as the hit's blast. At 10³⁴ kg that is 18.2 m/s and 9.9×10²⁶ J.
  - Checks: the `shots.js` round 2 block. Reverts `r2-unbounded`, `r2-earth` and `r2-earth-block` fail.
- **code-ice-shaking-counts: fixed** with the verdict's fix. A new `shots.js` check covers ice (least effort, Safe passenger on and off; and 10^9.15 kg all-out) and the steel deck. Reverts `r2-ice-box-on`, `-off` and `-impact` each fail it.
- **code-r1-card-fixes-unchecked: fixed.** Both card sentences now have checks. Reverts `r2-card-squash` and `r2-card-hits` fail them.
- **physics-pr-description-stale and code-pr34-description-stale (the same issue): fixed.** The updated description is at `scratchpad/pr3/pr-body.md`, keeping the current structure; it is not posted. It says both rounds are complete. It asks the owner to confirm decisions 1 (save mark 3), 2 (the landing's split and the give-way rule, with thresholds) and 5 (the ground hit as a landing, including the person kept whole below 100%).

### Two reverts survive, as in round 1
`r2-duo-blast` and `r2-duo-harm` survive every check. They change the game of catch's effort-box blast and harm for a person who hits the ground. No page state shows them: the thrower's hand breaking the sound barrier is always first in the harm list, and his hand's own air is always counted in that blast. I compared seven states against a build of 2449bc2 and every preset and ceiling is the same.

### Older checks still fail as they should
- All 14 of round 1's reverts, re-expressed on the new code, still fail.
- The build's six mutants still fail:
  - drag: `powers.js` and `presence.js`
  - landing energy: `powers.js` and the page
  - landing momentum: `powers.js` and the page
  - landing blast: `powers.js`
  - migration skipped: the page
  - save marked 2 read as a choice: the page

### New thresholds (straight down; a slanting landing must be 1/√(sin angle) faster)
| Ground | Gives way from |
|---|---|
| Concrete slab, asphalt | 102 m/s (about 121 m/s at 45°) |
| Ice | 144 m/s (171 at 45°) |
| Steel deck | 1,765 m/s (was 5,567) |
| Granite | 2,657 m/s (was 12,619) |
| Sand, soft clay, stiff clay, gravel | 19.8 / 23.0 / 44.6 / 50.8 m/s |

### Test counts and times (local)
| Test | Result | Time |
|---|---|---|
| build | – | 1 s |
| calibration | 117 checks | 127 s |
| presence | 383 checks | 56 s |
| shots | 83 ok, 0 problems | 667 s (2449bc2: 640 s) |
| powers | 162/162 | 240 s |
| ladder | 562/562 | 1 s |
| sweep | 7,776 contexts, 0 problems | 667 s |

- **Whole line:** 1,759 s (29 minutes).
- **CI's Rex lab share:** CI doesn't run the sweep, so the share is 1,092 s (18.2 minutes) locally. Scaled by #33's CI-to-local ratios, that is about 600 s on CI, against 524 s on #33. That puts the whole CI run for all three projects at about 11.5 minutes, inside the 20-minute limit.
- **Layout:** the new states at 390 px, light and dark, have no sideways scroll, broken text or page errors.

### Records and docs
- `research/reviews/canon-3-round2.json` is written: round 2, reviewed at 2449bc2, counts {8, 8, [], []}, both lenses verbatim with an outcome on each finding.
- The README's pull request 3 section now reads as a closed record and ends with what is left:
  - For the owner: decisions 2, 4 and 7.
  - For pull request 5: the shimmer reads `passengerLanding.absorbed`, the missed person's `miss.E`, and `hitsGround.E` or `hitsGround.own.E`.
- The README's Review history has round 2's line.
- `STATUS.md`: pull request 3 is built and reviewed, open as #34 and stacked on #33. Pull request 4 is next on `claude/canon-4-contests`. Waiting on lists the owner's confirmations for #34.

### Not fixed: a new defect, older than this pull request
In the game of catch, a missed throw at or above orbital speed with none of the drag acting never comes down. The page reports it as landing 0 m behind him at 0 m/s, with 0 J. Examples: a person at a 10^9 kg dial, fastball at 10 km; a baseball at 22 km/s does the same. It affects any object and is outside this round's findings. It is recorded in the README's "What is left", the round 2 record and the PR body.
```

</details>

**Claude · 2026-10-15 01:12:39 UTC**

PR 3's close-out fixer is running. PR 4 will be built in two stages like PR 2 (engine with its tests, then page, copy and page tests), since it's the largest.


> **Commit** `add3dcf` · 2026-10-15 02:28:53 UTC · Review round 2 of pull request 3 (Safe passenger): fix the 8 confirmed findings  [rex-strength-lab]


- `Bash` Push PR 3's final state: `git status --short | head -3; git log --oneline -2 && git push -q origin claude/canon-3-passenger 2>&1 | tail -1; wc -c /tmp/claude-0/-home-user-rex-strength...`


*Woken · 2026-10-15 02:29:20 UTC · Background task a5886d1d3f18a8050 completed: Agent "Fix PR 3 round 2 and close out" finished. Next: PR 3 is closed out (both rounds done, description updated, CI started). Starting PR 4's engine stage on claude/canon-4-contests.*


- `Read` /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/pr3/pr-body.md
- `mcp__github__update_pull_request` #34: body updated (body 10,613 characters)
- `mcp__github__actions_run_trigger` run_workflow test.yml on claude/canon-3-passenger
- `TaskUpdate` #2 status=completed
- `TaskUpdate` #3 status=in_progress
