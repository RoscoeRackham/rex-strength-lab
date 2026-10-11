# Review round 2, the pull request and this history

2026-10-11 07:25:54 UTC to 2026-10-11 09:28:20 UTC. 36 assistant events, 3 commit events, 8 subagent events, 104 tool call events, 1 wakeup events.

The page was republished with the round 1 fixes and pull request #5 opened; the collaborator merged it at that state while review round 2 ran. Round 2 checked every round 1 fix and looked for regressions (40 findings, all confirmed, among them a measuring-tool defect with arms held far out); its fixes were made, the page republished again, the branch restarted from main with the round 2 commit, and this history entry written for a second pull request.

Events are in the order they happened in the session; each workflow’s subagents are listed under the call that launched it, with their own start times.


### Workflow `build-comparison-review-r2` · 2026-10-11 07:25:54 UTC

- `Workflow` build-comparison-review-r2: Review round 2 of the Build Comparison page: check every round 1 fix, and look for regressions in the changed code, then a skeptic per lens reproduces or refutes each finding
  - run `wf_9bab17b6-d0f`: 8 subagents, listed below

**Subagent `review2:fixcheck`** · build-comparison-review-r2 · started 2026-10-11 07:25:54 UTC

- findings: 11 (11 minor); verified ok: 17.

<details>
<summary>Prompt, verbatim (4,124 characters)</summary>

Workflow run `wf_9bab17b6-d0f`, phase `Review`, agent `ab052f03c87e25fd3`.

```text
You are reviewing "Build Comparison", a self-contained HTML page (claude.ai Artifact) in /home/user/rex-strength-lab/build-comparison/ on git branch claude/hopeful-keller-vly1s9 (HEAD 7061d55). It ranks men's builds by a size-independent score S = 1.8 x fat-free mass / height^3 (FFMI the body would have at 1.80 m, same shape), from ordinary men to two original 3 m characters (Rex and Ollie), with silhouettes drawn from data, empty stretches left visibly empty, three "functional limits" found by geometry on widened template figures and measured with the page's own measuring tool, a "meatball" end of scale (924), and a measuring tool for A-pose model sheets (now run in a Web Worker) with a target-outline solver.
This is review ROUND 2. Round 1 found 76 issues; the record of what was fixed, and how, is /home/user/rex-strength-lab/build-comparison/research/reviews/round1.md (verbatim findings and verdicts in round1.json). Since then these changed: tools/compute_limits.js (measured limit scores, chart_figures, met_by), src/figure.js (solveTarget, armClearAt, sheetSkullRows), src/measure.js (side-view check, skull-row validation, per-view refinement, sliceRotated), src/app.html (arms at rest angle, per-grid column widths with one drawing height, met-sooner text, worker measuring, lazy tool start, focus fixes, forest labels, sheet picker, alpha sheets, copy inputs), data/settings.json, research/corrections.json, tools/compile_facts.py (archive.org quotes and item links), tools/fetch_archive_snippets.py, test/test.js, test/shots.js, .github/workflows/test.yml. Use git log and git diff 3cd65f5..HEAD to see them.
Read: /home/user/rex-strength-lab/build-comparison/BRIEF.md, round1.md, data/NOTES.md, and the code above. Builds come from /home/user/rex-strength-lab/build-calculator/data/builds.json via /home/user/rex-strength-lab/build-calculator/src/calc.js.
Build: cd /home/user/rex-strength-lab/build-comparison && node build.js. Tests: node test/test.js; node test/duo.js; node test/shots.js. Render the page yourself with Playwright: require('/opt/node22/lib/node_modules/playwright'); chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); wrap dist/index.html in '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + page + '</body></html>' and load it from a file. Fonts: see test/shots.js routeFonts (fallback fonts are fine for logic). window.__bc exposes LIST, GAPS, SEQ, HUMAN_TOP, MEAT, AX, sc. The measuring tool starts when #tool scrolls near: scroll it into view first.
The owner is a professional critic: factual accuracy and honest labelling come first (see CLAUDE.md, already loaded). Do NOT edit anything under /home/user/rex-strength-lab (another session may be editing the working tree: work on a copy made with git archive HEAD if you need a stable tree). Write scratch scripts and screenshots under /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/review2/ (create it). Every finding must be reproduced: give the exact input or place, what the page or code does (quote it, or the script output), what is correct with your derivation or source, and a minimal fix. Report real defects only: wrong maths or physics, wrong or unsupported claims, mislabelled status, contradictions between parts of the page, broken layout or controls, tests that do not test what they say, fixes that did not fix or that broke something else. Skip style preferences, and do not re-report round 1 items that round1.md records as fixed and that you confirm are fixed.

LENS: FIX CHECK. For every finding in round1.json that the verifiers confirmed (verdict.real true), check on HEAD that it is fixed as round1.md says, with your own reproduction (re-run the original repro idea). Report each one that is not fixed, only partly fixed without saying so, or fixed in a way that is wrong. Also report any statement in round1.md, README.md or data/NOTES.md about the fixes that is not true.

Under verified_ok, list what you checked and found correct.
```

</details>

**Subagent `review2:modelclaims`** · build-comparison-review-r2 · started 2026-10-11 07:25:55 UTC

- findings: 10 (5 major, 5 minor); verified ok: 12.
- Most severe: Face-limit band (87–200, 'about 190', 'about 87') is inflated 14–18%…; 'Meet this test sooner' compares two bases: weight-based scores at…; 'The width sits where their own girths put it' is false for most of… (+2 more).

<details>
<summary>Prompt, verbatim (4,857 characters)</summary>

Workflow run `wf_9bab17b6-d0f`, phase `Review`, agent `a632de63a24dfdca8`.

```text
You are reviewing "Build Comparison", a self-contained HTML page (claude.ai Artifact) in /home/user/rex-strength-lab/build-comparison/ on git branch claude/hopeful-keller-vly1s9 (HEAD 7061d55). It ranks men's builds by a size-independent score S = 1.8 x fat-free mass / height^3 (FFMI the body would have at 1.80 m, same shape), from ordinary men to two original 3 m characters (Rex and Ollie), with silhouettes drawn from data, empty stretches left visibly empty, three "functional limits" found by geometry on widened template figures and measured with the page's own measuring tool, a "meatball" end of scale (924), and a measuring tool for A-pose model sheets (now run in a Web Worker) with a target-outline solver.
This is review ROUND 2. Round 1 found 76 issues; the record of what was fixed, and how, is /home/user/rex-strength-lab/build-comparison/research/reviews/round1.md (verbatim findings and verdicts in round1.json). Since then these changed: tools/compute_limits.js (measured limit scores, chart_figures, met_by), src/figure.js (solveTarget, armClearAt, sheetSkullRows), src/measure.js (side-view check, skull-row validation, per-view refinement, sliceRotated), src/app.html (arms at rest angle, per-grid column widths with one drawing height, met-sooner text, worker measuring, lazy tool start, focus fixes, forest labels, sheet picker, alpha sheets, copy inputs), data/settings.json, research/corrections.json, tools/compile_facts.py (archive.org quotes and item links), tools/fetch_archive_snippets.py, test/test.js, test/shots.js, .github/workflows/test.yml. Use git log and git diff 3cd65f5..HEAD to see them.
Read: /home/user/rex-strength-lab/build-comparison/BRIEF.md, round1.md, data/NOTES.md, and the code above. Builds come from /home/user/rex-strength-lab/build-calculator/data/builds.json via /home/user/rex-strength-lab/build-calculator/src/calc.js.
Build: cd /home/user/rex-strength-lab/build-comparison && node build.js. Tests: node test/test.js; node test/duo.js; node test/shots.js. Render the page yourself with Playwright: require('/opt/node22/lib/node_modules/playwright'); chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); wrap dist/index.html in '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + page + '</body></html>' and load it from a file. Fonts: see test/shots.js routeFonts (fallback fonts are fine for logic). window.__bc exposes LIST, GAPS, SEQ, HUMAN_TOP, MEAT, AX, sc. The measuring tool starts when #tool scrolls near: scroll it into view first.
The owner is a professional critic: factual accuracy and honest labelling come first (see CLAUDE.md, already loaded). Do NOT edit anything under /home/user/rex-strength-lab (another session may be editing the working tree: work on a copy made with git archive HEAD if you need a stable tree). Write scratch scripts and screenshots under /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/review2/ (create it). Every finding must be reproduced: give the exact input or place, what the page or code does (quote it, or the script output), what is correct with your derivation or source, and a minimal fix. Report real defects only: wrong maths or physics, wrong or unsupported claims, mislabelled status, contradictions between parts of the page, broken layout or controls, tests that do not test what they say, fixes that did not fix or that broke something else. Skip style preferences, and do not re-report round 1 items that round1.md records as fixed and that you confirm are fixed.

LENS: MODEL AND CLAIMS OF THE CHANGED PARTS. (1) Recompute the limits independently: for the median-soldier template, find the width factor where each test is reached and measure the drawn shape's score yourself; check the bands, the face band's two models, met_by and chart_figures in data/limits.json, and that the page's text about them (limit cards, band notes, gap copy: "meet this test sooner", "already meet this test") is true, including which builds and scores it names. (2) Check the arms-at-rest-angle drawing: are arms clear of the body, and is the key's description right? (3) The target tool: does it reach targets across 15 to 900 on every template shape, refuse what it says it refuses, and say true things in its status? (4) The measuring tool's new checks: the side-view check (could it reject a real side view of a very round character? try extreme but plausible shapes) and skull-row validation (could it reject a valid row, e.g. under horns or a crest?). (5) Every sentence of copy that changed since 3cd65f5 (settings.json, app.html strings, facts labels and source titles): true, sourced, labelled, rounded by the house rules?

Under verified_ok, list what you checked and found correct.
```

</details>

**Subagent `review2:ux`** · build-comparison-review-r2 · started 2026-10-11 07:51:32 UTC

- findings: 10 (3 major, 7 minor); verified ok: 15.
- Most severe: Loading a new sheet while the worker is still measuring shows and…; Fields edited while the worker measures are not marked stale: the…; 'Meet this test (sooner)' reads as 'pass this test', the opposite of….

<details>
<summary>Prompt, verbatim (4,600 characters)</summary>

Workflow run `wf_9bab17b6-d0f`, phase `Review`, agent `a6bbfeca41cf0a2cb`.

```text
You are reviewing "Build Comparison", a self-contained HTML page (claude.ai Artifact) in /home/user/rex-strength-lab/build-comparison/ on git branch claude/hopeful-keller-vly1s9 (HEAD 7061d55). It ranks men's builds by a size-independent score S = 1.8 x fat-free mass / height^3 (FFMI the body would have at 1.80 m, same shape), from ordinary men to two original 3 m characters (Rex and Ollie), with silhouettes drawn from data, empty stretches left visibly empty, three "functional limits" found by geometry on widened template figures and measured with the page's own measuring tool, a "meatball" end of scale (924), and a measuring tool for A-pose model sheets (now run in a Web Worker) with a target-outline solver.
This is review ROUND 2. Round 1 found 76 issues; the record of what was fixed, and how, is /home/user/rex-strength-lab/build-comparison/research/reviews/round1.md (verbatim findings and verdicts in round1.json). Since then these changed: tools/compute_limits.js (measured limit scores, chart_figures, met_by), src/figure.js (solveTarget, armClearAt, sheetSkullRows), src/measure.js (side-view check, skull-row validation, per-view refinement, sliceRotated), src/app.html (arms at rest angle, per-grid column widths with one drawing height, met-sooner text, worker measuring, lazy tool start, focus fixes, forest labels, sheet picker, alpha sheets, copy inputs), data/settings.json, research/corrections.json, tools/compile_facts.py (archive.org quotes and item links), tools/fetch_archive_snippets.py, test/test.js, test/shots.js, .github/workflows/test.yml. Use git log and git diff 3cd65f5..HEAD to see them.
Read: /home/user/rex-strength-lab/build-comparison/BRIEF.md, round1.md, data/NOTES.md, and the code above. Builds come from /home/user/rex-strength-lab/build-calculator/data/builds.json via /home/user/rex-strength-lab/build-calculator/src/calc.js.
Build: cd /home/user/rex-strength-lab/build-comparison && node build.js. Tests: node test/test.js; node test/duo.js; node test/shots.js. Render the page yourself with Playwright: require('/opt/node22/lib/node_modules/playwright'); chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); wrap dist/index.html in '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + page + '</body></html>' and load it from a file. Fonts: see test/shots.js routeFonts (fallback fonts are fine for logic). window.__bc exposes LIST, GAPS, SEQ, HUMAN_TOP, MEAT, AX, sc. The measuring tool starts when #tool scrolls near: scroll it into view first.
The owner is a professional critic: factual accuracy and honest labelling come first (see CLAUDE.md, already loaded). Do NOT edit anything under /home/user/rex-strength-lab (another session may be editing the working tree: work on a copy made with git archive HEAD if you need a stable tree). Write scratch scripts and screenshots under /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/review2/ (create it). Every finding must be reproduced: give the exact input or place, what the page or code does (quote it, or the script output), what is correct with your derivation or source, and a minimal fix. Report real defects only: wrong maths or physics, wrong or unsupported claims, mislabelled status, contradictions between parts of the page, broken layout or controls, tests that do not test what they say, fixes that did not fix or that broke something else. Skip style preferences, and do not re-report round 1 items that round1.md records as fixed and that you confirm are fixed.

LENS: LAYOUT, ACCESSIBILITY, READING after the changes. Render at 360x740, 390x844, 768x1024, 1024x768 and 1280x900, light and dark. Check the new per-grid figure columns (one drawing height across all stops in both Figures modes and both views; giants with arms out fit; no clipping or overflow), the limit cards with their new text, the forest axis and phone value cells, focus rings, the drawer at tablet widths, accessible names, the sheet picker buttons, the worker-based measuring (status text, elapsed time, results), the lazy tool start (does anything on the page wait for it or show empty boxes before it starts?), and the target outline display. Judge the limits section and gap copy for a general reader: is it clear what "meet this test sooner" means? Save evidence screenshots in /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/review2/.

Under verified_ok, list what you checked and found correct.
```

</details>

**Subagent `review2:code`** · build-comparison-review-r2 · started 2026-10-11 08:01:04 UTC

- findings: 9 (4 major, 5 minor); verified ok: 18.
- Most severe: The measuring tool drops near-level arms without a warning and slices…; 'Front and back landmarks line up' rejects sheets whose back view is…; A measurement still running when a new sheet is loaded lands on the… (+1 more).

<details>
<summary>Prompt, verbatim (4,756 characters)</summary>

Workflow run `wf_9bab17b6-d0f`, phase `Review`, agent `a15856a3099dacd95`.

```text
You are reviewing "Build Comparison", a self-contained HTML page (claude.ai Artifact) in /home/user/rex-strength-lab/build-comparison/ on git branch claude/hopeful-keller-vly1s9 (HEAD 7061d55). It ranks men's builds by a size-independent score S = 1.8 x fat-free mass / height^3 (FFMI the body would have at 1.80 m, same shape), from ordinary men to two original 3 m characters (Rex and Ollie), with silhouettes drawn from data, empty stretches left visibly empty, three "functional limits" found by geometry on widened template figures and measured with the page's own measuring tool, a "meatball" end of scale (924), and a measuring tool for A-pose model sheets (now run in a Web Worker) with a target-outline solver.
This is review ROUND 2. Round 1 found 76 issues; the record of what was fixed, and how, is /home/user/rex-strength-lab/build-comparison/research/reviews/round1.md (verbatim findings and verdicts in round1.json). Since then these changed: tools/compute_limits.js (measured limit scores, chart_figures, met_by), src/figure.js (solveTarget, armClearAt, sheetSkullRows), src/measure.js (side-view check, skull-row validation, per-view refinement, sliceRotated), src/app.html (arms at rest angle, per-grid column widths with one drawing height, met-sooner text, worker measuring, lazy tool start, focus fixes, forest labels, sheet picker, alpha sheets, copy inputs), data/settings.json, research/corrections.json, tools/compile_facts.py (archive.org quotes and item links), tools/fetch_archive_snippets.py, test/test.js, test/shots.js, .github/workflows/test.yml. Use git log and git diff 3cd65f5..HEAD to see them.
Read: /home/user/rex-strength-lab/build-comparison/BRIEF.md, round1.md, data/NOTES.md, and the code above. Builds come from /home/user/rex-strength-lab/build-calculator/data/builds.json via /home/user/rex-strength-lab/build-calculator/src/calc.js.
Build: cd /home/user/rex-strength-lab/build-comparison && node build.js. Tests: node test/test.js; node test/duo.js; node test/shots.js. Render the page yourself with Playwright: require('/opt/node22/lib/node_modules/playwright'); chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); wrap dist/index.html in '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + page + '</body></html>' and load it from a file. Fonts: see test/shots.js routeFonts (fallback fonts are fine for logic). window.__bc exposes LIST, GAPS, SEQ, HUMAN_TOP, MEAT, AX, sc. The measuring tool starts when #tool scrolls near: scroll it into view first.
The owner is a professional critic: factual accuracy and honest labelling come first (see CLAUDE.md, already loaded). Do NOT edit anything under /home/user/rex-strength-lab (another session may be editing the working tree: work on a copy made with git archive HEAD if you need a stable tree). Write scratch scripts and screenshots under /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/review2/ (create it). Every finding must be reproduced: give the exact input or place, what the page or code does (quote it, or the script output), what is correct with your derivation or source, and a minimal fix. Report real defects only: wrong maths or physics, wrong or unsupported claims, mislabelled status, contradictions between parts of the page, broken layout or controls, tests that do not test what they say, fixes that did not fix or that broke something else. Skip style preferences, and do not re-report round 1 items that round1.md records as fixed and that you confirm are fixed.

LENS: CODE AND TESTS after the changes. Check: the Web Worker path (built from the inlined measure.js via a Blob; does it work, fall back cleanly, handle two quick measurements, leak workers or object URLs, and return the same numbers as the main thread?); measure.js changes (refineViews crops and margins: can neighbouring views or a height bar be damaged? same results as before within a small tolerance on the example and duo.jpg?); Figure.solveTarget edge cases (targets below and above reach, failing sheets inside the bracket, non-monotone scores); compute_limits.js determinism (two runs give identical output?) and test time; tools/compile_facts.py and fetch_archive_snippets.py (deterministic, no network at compile time, archive quote picking correct for each fact?); CI (.github/workflows/test.yml) actually catches stale facts.json and limits.json; tests that pass vacuously; the Build Calculator's tests (cd /home/user/rex-strength-lab/build-calculator && node test/test.js && node test/shots.js); XSS through file names or user text.

Under verified_ok, list what you checked and found correct.
```

</details>

**Subagent `verify2:modelclaims`** · build-comparison-review-r2 · started 2026-10-11 08:21:28 UTC

- verdicts: 10 (10 confirmed).

<details>
<summary>Prompt, verbatim (18,464 characters)</summary>

Workflow run `wf_9bab17b6-d0f`, phase `Verify`, agent `a207eb32335b4215d`.

```text
You are reviewing "Build Comparison", a self-contained HTML page (claude.ai Artifact) in /home/user/rex-strength-lab/build-comparison/ on git branch claude/hopeful-keller-vly1s9 (HEAD 7061d55). It ranks men's builds by a size-independent score S = 1.8 x fat-free mass / height^3 (FFMI the body would have at 1.80 m, same shape), from ordinary men to two original 3 m characters (Rex and Ollie), with silhouettes drawn from data, empty stretches left visibly empty, three "functional limits" found by geometry on widened template figures and measured with the page's own measuring tool, a "meatball" end of scale (924), and a measuring tool for A-pose model sheets (now run in a Web Worker) with a target-outline solver.
This is review ROUND 2. Round 1 found 76 issues; the record of what was fixed, and how, is /home/user/rex-strength-lab/build-comparison/research/reviews/round1.md (verbatim findings and verdicts in round1.json). Since then these changed: tools/compute_limits.js (measured limit scores, chart_figures, met_by), src/figure.js (solveTarget, armClearAt, sheetSkullRows), src/measure.js (side-view check, skull-row validation, per-view refinement, sliceRotated), src/app.html (arms at rest angle, per-grid column widths with one drawing height, met-sooner text, worker measuring, lazy tool start, focus fixes, forest labels, sheet picker, alpha sheets, copy inputs), data/settings.json, research/corrections.json, tools/compile_facts.py (archive.org quotes and item links), tools/fetch_archive_snippets.py, test/test.js, test/shots.js, .github/workflows/test.yml. Use git log and git diff 3cd65f5..HEAD to see them.
Read: /home/user/rex-strength-lab/build-comparison/BRIEF.md, round1.md, data/NOTES.md, and the code above. Builds come from /home/user/rex-strength-lab/build-calculator/data/builds.json via /home/user/rex-strength-lab/build-calculator/src/calc.js.
Build: cd /home/user/rex-strength-lab/build-comparison && node build.js. Tests: node test/test.js; node test/duo.js; node test/shots.js. Render the page yourself with Playwright: require('/opt/node22/lib/node_modules/playwright'); chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); wrap dist/index.html in '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + page + '</body></html>' and load it from a file. Fonts: see test/shots.js routeFonts (fallback fonts are fine for logic). window.__bc exposes LIST, GAPS, SEQ, HUMAN_TOP, MEAT, AX, sc. The measuring tool starts when #tool scrolls near: scroll it into view first.
The owner is a professional critic: factual accuracy and honest labelling come first (see CLAUDE.md, already loaded). Do NOT edit anything under /home/user/rex-strength-lab (another session may be editing the working tree: work on a copy made with git archive HEAD if you need a stable tree). Write scratch scripts and screenshots under /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/review2/ (create it). Every finding must be reproduced: give the exact input or place, what the page or code does (quote it, or the script output), what is correct with your derivation or source, and a minimal fix. Report real defects only: wrong maths or physics, wrong or unsupported claims, mislabelled status, contradictions between parts of the page, broken layout or controls, tests that do not test what they say, fixes that did not fix or that broke something else. Skip style preferences, and do not re-report round 1 items that round1.md records as fixed and that you confirm are fixed.

Another reviewer (modelclaims lens) reported the findings below. For EACH one, try hard to REFUTE it: reproduce it yourself with your own script or browser run, independently of theirs, on the current HEAD (git log -1 tells you which; the working tree may have moved on since the reviewer ran: say so if a finding is already fixed). Mark real=true only if you reproduced it. Confirm the severity and give the best minimal fix (exact code or text). Default to real=false if you cannot reproduce it.

FINDINGS:
[
 {
  "id": "R2-M1",
  "severity": "major",
  "title": "Face-limit band (87–200, 'about 190', 'about 87') is inflated 14–18% because the tool silently reads the level arms as torso",
  "location": "tools/compute_limits.js scoreAt() (arms drawn at max(35, rest+2) = 92° at the face factors, 70.1° at f=1.786); src/measure.js frontLandmarks/volume (arms with < 0.1·Hp rows dropped, their pixels counted as torso width × trunk depth); data/limits.json items.face (score 189.14, range [86.89, 199.43], models); page: face limit card, forest row, empty-2 gap copy and gap tile 'HANDS TO FACE · 87–200'",
  "evidence": "Scripts in scratchpad/review2. face_arms.js measures each template's face shape two ways: (a) the tool on the full drawing (the stored value) and (b) the tool on head and body only, plus both arms as solids of revolution outside the body outline. Results, (a) vs (b): p50 189.1 vs 164.3 (tool arms volume 0.0000, sheet ok, no arm warning); p5 179.2 vs 154.3; p95 199.4 vs 174.5; Reeves 164.1 vs 139.6; Coleman 177.1 vs 154.2; largest arm 158.2 vs 137.2. The tool is 14–18% high. facelow.js and jump.js show the tool's score jumping where the arms are no longer detected: f 1.74 (arms at 69°, found) gives 75.5; f 1.75 (68.2°, not found) gives 83.8, an 11% jump for 0.6% more width. The pessimistic point f=1.786 reads 86.9 with arms not found. facelow2.js counts the arms as limbs there: 71.3. My own polygon integration (limits_indep.js) reproduces the stored f values (1.2539, 1.3464, 2.8373), but gives 164.6 for the face shape. Round 1 had already flagged that the face score depends on the arm pose (152.6 at 20°, 191.9 at rest); the fix chose the one pose the tool cannot parse.",
  "expected": "With the arms counted as arms, contact geometry gives about 165 for the median soldier, and about 137–175 across the six templates. The pessimistic end is about 71 (arms as limbs), or about 79 if the tool's own curve is carried past the jump (75.2 × (1.786/1.74)²). The band is therefore roughly 70–175, not 87–200. The 'about 190' and 'about 87' labels on the card are wrong.",
  "fix": "Score the limit shapes in a way that does not depend on the tool finding the arms. Either measure head and body with the tool and add both arms as solids of revolution, or have measureSheet keep a separated arm run shorter than 0.1·Hp, and warn whenever no arms are found. Regenerate limits.json. Add a test that the measured score stays smooth in f through the 60–80° arm range."
 },
 {
  "id": "R2-M2",
  "severity": "major",
  "title": "'Meet this test sooner' compares two bases: weight-based scores at each build's own fat against limit scores read from drawings at 7.5% fat",
  "location": "src/app.html metSooner() and its callers: the band note in 'top' ('15 of them, from Arnold Schwarzenegger (about 27) up'), the gap 'empty' ('three of them, from Ronnie Coleman (about 39) up'), the limit cards ('already meet this test: 24 … / 11 … from …') and the limits verdict",
  "evidence": "The limit scores (arms 41 [37–41], thighs 46 [42–49]) are the tool's reading of a drawing at 1,060 kg/m³ and 7.5% fat. The figures' scores quoted beside them are weight-based, at each figure's assumed fat (5–19%). metby_basis.js scores each met_by figure's own drawing the way the limits are scored. Arms: Arnold 35.0 (page 27.5), Oliva 37.3, Bane 37.7, Doomsday 39.2, Hafthor 39.5, Kraemer 40.0, Heath 40.0, Yates 40.6, Lasha 40.9, Cutler 41.1, Wolverine 42.0, Kingpin 42.4, Eddie Hall 42.5, Coleman 44.4. Thighs: Coleman 44.4 (page 39.2), Big Ramy 44.6 (39.3), Luke Cage 46.9 (41.1).",
  "expected": "Scored on the same basis, only Arnold (about 35) clearly meets the arms test before the 37–41 band. No figure meets the thighs test before the 42–49 band. Most of the gap between 'from 27' or 'from 39' and 41 or 46 comes from the basis: Arnold's drawing holds 34% more than his weight, and the strongmen are at 19% fat against 7.5%.",
  "fix": "Quote each figure's outline scored like the limit shapes (for example, 'Arnold's outline, scored like the limit figures, is about 35'). Or drop 'sooner' and say that their outlines meet the test at scores inside the band."
 },
 {
  "id": "R2-M3",
  "severity": "major",
  "title": "'The width sits where their own girths put it' is false for most of the figures counted: 18 of 24 (arms) and 10 of 11 (thighs) are template shapes",
  "location": "src/app.html limit cards: 'The chart's own figures, drawn from their girths, already meet this test … Their outlines are not an evenly widened soldier: the width sits where their own girths put it, and reported girths can run high'; metSooner(): 'drawn from their girths'",
  "evidence": "I listed the girth status for every met_by id. Arms (24): only Arnold, Heath, Cutler and Coleman have their own arm, chest and waist numbers; Oliva and Yates are partly derived. The other 18 have every girth filled from a template build scaled to their weight: Bane from Oliva; Doomsday and Wolverine from Yates; Hafthor, Kraemer, Lasha, Eddie Hall and Kingpin from the ANSUR largest-arm soldier; Big Ramy, Luke Cage, the Thing, Thor, Darkseid, the Hulks, Juggernaut and the Abomination from Coleman. Thighs (11): 10 use Coleman's template. Coleman's own thigh is status 'derived', with value_basis 'midpoint of 34 in (FitnessVolt) and 36 in (GreatestPhysiques); no source prints it' (builds.json).",
  "expected": "The thighs evidence is one shape, Coleman's, resting on an unprinted fan-site thigh figure and drawn at 11 sizes. Most of the arms evidence is four template shapes. The text should not call these widths 'their own girths'.",
  "fix": "Count only figures whose deciding girths are their own (arms: arm, chest and waist; thighs: thigh). Name the template behind the rest, for example: '11 figures, all Coleman's shape (his thigh is a fan-site figure)'."
 },
 {
  "id": "R2-M4",
  "severity": "major",
  "title": "Target tool: no outline reaches about 76–83, misses are reported as successes, and outlines above about 85 are mis-measured, including the copied chest of 4.98 m",
  "location": "src/app.html drawTarget(); src/figure.js solveTarget() (final 'return { f: fl, score: scoreAt(fl) }'); tools/export_targets.js; src/measure.js arm detection; the status line and 'Copy target numbers'",
  "evidence": "In the page (page_targets.js): 'Army men, median … × 1.71 …: it measures 73 (target 80) … and passes the tool's checks.' Likewise target 78 gives 71, Reeves 75 gives 69, Coleman 75 gives 70, largest-arm 75 gives 69. jump.js: f 1.74 gives 75.5 (arms found) and f 1.75 gives 83.8 (arms not found), so no width factor scores 76–83. solveTarget then returns the passing side below with no reason, and the page treats it as success. The test claims it 'says when no passing sheet reaches the target' but only tries 5, 20, 217 and 900. Above the jump, every outline has its arms at 70–92° (sweep: from target 150 up, 'armDeg 92.0'); the sheet spec asks for an A-pose at 30–40°, yet the panel says the outlines are 'at the model-sheet spec'. Their readings are inflated (target_true.js): target 100 reads 100.1 by the tool but 82.5 with the arms as limbs (+21%); target 150, 129.1 (+16%); target 300, 266.1 (+13%). The copied numbers for the page's default target 100 (target_copy.js): \"chest\": 4.9802, \"arm_flexed\": null, \"forearm\": null. warn100.js: arms landmarks [null,null], no warning about the arms.",
  "expected": "Targets that no outline can reach should be refused, with the reason given. For targets above about 85, the stated score should come from a reading that counts the arms. The chest of the widened soldier is about 2.07 m (1.067 m × 1.937), not 4.98 m.",
  "fix": "Fix the arm-aware measurement as in R2-M1. In solveTarget, return {f:null, reason:'gap', bestF, bestScore} when the loop ends outside tolerance, and have the page say so. Draw targets with the arms inside the A-pose spec, or flag when they cannot be. Do not export girths for sites the tool did not find, nor a chest that includes the arms. Test targets 70–90 on all six shapes."
 },
 {
  "id": "R2-M5",
  "severity": "major",
  "title": "The 'Drawing check' in the details of all eight comic giants overstates the drawing by about 20 points (level arms read as torso)",
  "location": "src/app.html drawingCheck() (arms drawn at max(35, armAngle(e)) = 66–86° for the giants)",
  "evidence": "Page drawers (drawer_check.js): Hulk (savage) 'weighs 17% more than the weight counted'; Darkseid 18%; Abomination 15%; the Thing 22%. drawcheck.js gives the same reading with the tool's arms volume at 0.0000 for all eight; with the arms counted as limbs, the figures are Darkseid −5%, Hulk Marvel.com −4%, Juggernaut −4%, Hulk savage −5%, Hulk grey −5%, Abomination −5%, Thing +1%, Thor +1%, against the page's 18, 19, 19, 17, 15, 15, 22 and 22%.",
  "expected": "The giants' drawings hold about their counted weight (−5% to +1%), not 15–22% more.",
  "fix": "Use the arm-aware volume from R2-M1, or measure the drawing check with the arms at the A-pose and the arms' overlap removed. Re-state the 'from 3% less to 34% more' range in NOTES."
 },
 {
  "id": "R2-m1",
  "severity": "minor",
  "title": "Pessimistic face factor 1.786 is applied relative to the median soldier, but the fitted model's reference (k=1) is normal-BMI men; the median soldier is k≈1.09",
  "location": "data/settings.json limits.face.pessimistic_girth_factor; tools/compute_limits.js faceLow = scoreAt(mainM, wedge)",
  "evidence": "Fact elbow_flexion_vs_girth_wedge_model: tan((180−φ)/2) = 0.3153·k^1.69, k = (flexed biceps + flexed forearm)/0.614 m, with k=1 giving 145° (normal-BMI men) and 'ansur_overall_median_k': 1.086. The median soldier's sum is 0.667 m (0.684 m at 1.80 m). Widening him by 1.786 gives k≈1.94, so φ≈92° (script output 'phi at k=1.786*1.086: 92.0'), already past the 100° threshold. 100° falls at k=1.785, a width factor of 1.643 (1.602 on absolute girth). facelow3.js reads the tool there at 66.8 (63.6), arms found.",
  "expected": "The steep-fit end of the face band is about 64–67, not 87 (and not the about 71–79 of R2-M1 either).",
  "fix": "Use f = 1.785 / k_soldier, or state that both models anchor k=1 at the median soldier and re-derive the factor on that basis."
 },
 {
  "id": "R2-m2",
  "severity": "minor",
  "title": "The front/back landmark check fails on an exact mirror image, so the target tool refuses reachable targets",
  "location": "src/measure.js measureSheet (the 'front and back landmarks line up' check compares detected argmin rows); src/app.html drawTarget() full-size step",
  "evidence": "In the page: largest-arm 40, p95 60 and p5 15 each give 'The full-size outline fails the tool's own checks (front and back landmarks line up (within 2% of the height)), so it is not offered. Try another shape.' The details (target_sweep2.js) are 'off: waist (front 395, back 689)', 'off: waist (front 747, back 395), crotch (front 800, back 598)' and 'off: neck (front 197, back 219)'. renderSheet draws the back view as the exact mirror of the front. mirror2.js: torso widths at rows 390 and 690 are 211 and 210 px, so the waist argmin over that flat profile flips by about 300 px on one pixel of rasterisation. The same check would reject real sheets whose back view is near-symmetric.",
  "expected": "A mirror image always lines up, and the reachable targets are offered.",
  "fix": "Compare landmarks only where they are well conditioned. For example, pass if the back view's width at the front's row is within 1–2 px of its minimum, or compare width profiles. Use the guide-line rows when present. Add the three cases above as tests."
 },
 {
  "id": "R2-m3",
  "severity": "minor",
  "title": "Face card says 'None of the chart's own figures meets this test', which is true only under contact geometry; the band's other model puts the giants past it",
  "location": "src/app.html limit cards (met line); tools/compute_limits.js chart_figures.face (crease model only)",
  "evidence": "The card's band and definition use both models; the 'met' line uses only the crease model. The fact's steep fit, tan((180−φ)/2)=0.3153·k^1.69, applied to each figure's own arm and forearm girths (k scaled to 1.755 m) gives Darkseid 78°, Hulk Marvel.com 77°, Hulk savage 72°, Abomination 68°, Hulk grey 69°, Juggernaut 76°, Thor 85° and the Thing 85°. All are below the 100° threshold (43–81° on absolute girth).",
  "expected": "Under the steep fit, eight chart figures meet the face test.",
  "fix": "Write 'None meets it by contact geometry; by the body-fat fit the comic giants, Thor and the Thing would', or store met_by under both models."
 },
 {
  "id": "R2-m4",
  "severity": "minor",
  "title": "The side-view check rejects Rex's real side view whenever his tail cannot be masked, which is always so in the page",
  "location": "src/measure.js the 'side view is a side view' check; src/app.html measure() (no exclusion option)",
  "evidence": "sideview_tail.js on assets/rex-turnaround.png with the READINGS skull rows. With the tails excluded (Node only) it passes: '0.94 at the waist, 0.60 at the hips'. With the tails kept, as the page must: 'FAIL depth ÷ front width 0.99 at the waist, 0.94 at the hips; a front or back view in the side position gives about 1', and the crotch row moves from 531 to 400. With the tail only in the side view, it passes (0.99 and 0.82). For comparison, ANSUR II buttock depth over hip breadth peaks at 0.87 across 4,082 men, so a tail-less real side view should not fail. The page does say the turnarounds are not measured there, so the impact is limited.",
  "expected": "A real side view should not be refused with a message saying it looks like a front or back view.",
  "fix": "Skip the hip ratio when the crotch is suspect or a tail is present. Otherwise name the likely cause in the detail ('a tail or object behind the hips adds depth') and offer a tail mask."
 },
 {
  "id": "R2-m5",
  "severity": "minor",
  "title": "A sentence in the 'Shape' line of What this ignores starts in lower case",
  "location": "data/settings.json ignores[0]",
  "evidence": "Rendered text: '…is disputed (Burton 2010). giants and monsters would need thicker bones and different proportions…'",
  "expected": "'Giants and monsters would need…'",
  "fix": "Capitalise 'Giants'."
 }
]
```

</details>

**Subagent `verify2:fixcheck`** · build-comparison-review-r2 · started 2026-10-11 08:31:30 UTC

- verdicts: 11 (11 confirmed).

<details>
<summary>Prompt, verbatim (19,206 characters)</summary>

Workflow run `wf_9bab17b6-d0f`, phase `Verify`, agent `a457c1303c7f10acb`.

```text
You are reviewing "Build Comparison", a self-contained HTML page (claude.ai Artifact) in /home/user/rex-strength-lab/build-comparison/ on git branch claude/hopeful-keller-vly1s9 (HEAD 7061d55). It ranks men's builds by a size-independent score S = 1.8 x fat-free mass / height^3 (FFMI the body would have at 1.80 m, same shape), from ordinary men to two original 3 m characters (Rex and Ollie), with silhouettes drawn from data, empty stretches left visibly empty, three "functional limits" found by geometry on widened template figures and measured with the page's own measuring tool, a "meatball" end of scale (924), and a measuring tool for A-pose model sheets (now run in a Web Worker) with a target-outline solver.
This is review ROUND 2. Round 1 found 76 issues; the record of what was fixed, and how, is /home/user/rex-strength-lab/build-comparison/research/reviews/round1.md (verbatim findings and verdicts in round1.json). Since then these changed: tools/compute_limits.js (measured limit scores, chart_figures, met_by), src/figure.js (solveTarget, armClearAt, sheetSkullRows), src/measure.js (side-view check, skull-row validation, per-view refinement, sliceRotated), src/app.html (arms at rest angle, per-grid column widths with one drawing height, met-sooner text, worker measuring, lazy tool start, focus fixes, forest labels, sheet picker, alpha sheets, copy inputs), data/settings.json, research/corrections.json, tools/compile_facts.py (archive.org quotes and item links), tools/fetch_archive_snippets.py, test/test.js, test/shots.js, .github/workflows/test.yml. Use git log and git diff 3cd65f5..HEAD to see them.
Read: /home/user/rex-strength-lab/build-comparison/BRIEF.md, round1.md, data/NOTES.md, and the code above. Builds come from /home/user/rex-strength-lab/build-calculator/data/builds.json via /home/user/rex-strength-lab/build-calculator/src/calc.js.
Build: cd /home/user/rex-strength-lab/build-comparison && node build.js. Tests: node test/test.js; node test/duo.js; node test/shots.js. Render the page yourself with Playwright: require('/opt/node22/lib/node_modules/playwright'); chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); wrap dist/index.html in '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + page + '</body></html>' and load it from a file. Fonts: see test/shots.js routeFonts (fallback fonts are fine for logic). window.__bc exposes LIST, GAPS, SEQ, HUMAN_TOP, MEAT, AX, sc. The measuring tool starts when #tool scrolls near: scroll it into view first.
The owner is a professional critic: factual accuracy and honest labelling come first (see CLAUDE.md, already loaded). Do NOT edit anything under /home/user/rex-strength-lab (another session may be editing the working tree: work on a copy made with git archive HEAD if you need a stable tree). Write scratch scripts and screenshots under /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/review2/ (create it). Every finding must be reproduced: give the exact input or place, what the page or code does (quote it, or the script output), what is correct with your derivation or source, and a minimal fix. Report real defects only: wrong maths or physics, wrong or unsupported claims, mislabelled status, contradictions between parts of the page, broken layout or controls, tests that do not test what they say, fixes that did not fix or that broke something else. Skip style preferences, and do not re-report round 1 items that round1.md records as fixed and that you confirm are fixed.

Another reviewer (fixcheck lens) reported the findings below. For EACH one, try hard to REFUTE it: reproduce it yourself with your own script or browser run, independently of theirs, on the current HEAD (git log -1 tells you which; the working tree may have moved on since the reviewer ran: say so if a finding is already fixed). Mark real=true only if you reproduced it. Confirm the severity and give the best minimal fix (exact code or text). Default to real=false if you cannot reproduce it.

FINDINGS:
[
 {
  "id": "R2-FIX-01",
  "severity": "minor",
  "title": "Claims F21 is not fixed: the page's new explanation for the 26 vs 27 gap is wrong, and the example is not 'the same shape'",
  "location": "build-comparison/src/app.html:1509 (writeResults, example sentence) and :1421 exampleSheet()",
  "evidence": "The page now says: \"The example is the median soldier at 1.80 m ... The limits section reads the same shape at 27 from a larger drawing; the reading moves by a few percent with the drawing's size.\" exampleSheet() still draws e.girths, his own girths at 1.755 m, on a 1.80 m frame. compute_limits.js uses calc.compute({heightM: 1.8}), his shape scaled to 1.80 m. Script scratchpad/review2/s/f21.js, page settings (1,060 kg/m³, 7.5% fat):\n- page example, own girths, 700 px, default refine: 25.70 (90.0 kg)\n- own girths at 800 px: 25.82\n- own girths at 1,600 px: 25.82\n- girths at 1.80 m, 800 px: 27.26, which is limits.json score_at_f1\nA larger drawing changes the reading by 0.5%. The girth basis changes it by (1.8/1.755)² = 5.2%. The round 1 verifier gave this cause and fix (round1.json, claims F21 better_fix). HEAD kept the explanation the verifier had shown to be wrong. round1.md says all 23 confirmed claims findings were fixed.",
  "expected": "The tool example and the limits card read one stated shape and give one number. Otherwise the page gives the true cause of the difference.",
  "fix": "In exampleSheet(), take girths at 1.80 m as drawTarget does: var r0 = calc.compute({ buildId: 'ansur2_m_p50', heightM: 1.8 }); BuildCalc.SITES.forEach(function (s) { g[s] = r0.girths[s].value; }). Then delete the sentence 'The limits section reads the same shape at ... with the drawing's size.' The example then measures about 27, the same as the card."
 },
 {
  "id": "R2-FIX-02",
  "severity": "minor",
  "title": "UX L8 is only half fixed: tapping the 924 ring at its centre or anywhere on its left half still jumps to 'Empty to the end'",
  "location": "build-comparison/src/app.html:1218 stopAt (now d <= best.d) and :1727 tapeJump; research/reviews/round1.md:83",
  "evidence": "Script scratchpad/review2/s/l8.js taps the circle.m924 ring at offsets from its centre and records the id that jump() scrolls to. At 1280 px and 390 px (touch), on both the glance tape (ring 14 px) and the locator (ring 7 px): -6, -4, -2, -1 and 0 px go to 'empty-3'; +1 to +4 px go to 'meatball'. The round 1 verifier predicted this (round1.json L8): 'Changing to d <= best.d alone does not fix it: a tap a hair left of the ring centre still has gap d=0 and meatball d>0.' Its fix, a snap in tapeJump, was not applied. round1.md:83 says 'L8: the 924 ring jumps to the meatball.'",
  "expected": "A tap anywhere on the ring, which marks the meatball, jumps to the meatball stop.",
  "fix": "In tapeJump, before stopAt: if (Math.abs(x - X(MEAT)) <= 8) { jump('meatball'); return; }. Here x is the tap position in the host and X = host._X. Add the dx = -3 tap to shots.js."
 },
 {
  "id": "R2-FIX-03",
  "severity": "minor",
  "title": "UX L1 is partly fixed: on the pressed segmented buttons the inside focus ring is 2.3:1 (light) and 1.7:1 (dark) against the button",
  "location": "build-comparison/src/app.html:58 (.seg button:focus-visible { outline-offset: -4px }); research/reviews/round1.md:76",
  "evidence": "Script scratchpad/review2/s/focus3.js focuses each segmented button with focusVisible. The ring now sits inside the button, so the button's fill is on both sides of it.\n- Light, pressed hSame/vFront/zAll: ring rgb(31,79,166) on rgb(21,24,31), contrast 2.31:1\n- Dark, pressed: ring rgb(148,181,255) on rgb(232,233,238), contrast 1.68:1. Screenshot scratchpad/review2/shots/f-hSame-dark.png shows a faint pale-blue ring.\nThe unpressed buttons are fine (7.3 and 8.3:1). The pressed buttons are the defaults (Same height, Front, Whole scale), so a keyboard user meets these first. The round 1 verifier's fix included 'a sheet-coloured inner ring so it also shows on the pressed (ink) button'. That part was not applied, and round1.md does not say so.",
  "expected": "A focus indicator of at least 3:1 against the colours next to it (WCAG 1.4.11) on every segmented button, pressed or not.",
  "fix": "Add: .seg button[aria-pressed=\"true\"]:focus-visible { outline-color: var(--sheet); }. The sheet colour on the pressed fill gives 16.7:1 (light) and 13.9:1 (dark). Alternatively use the verifier's box-shadow: inset 0 0 0 4px var(--sheet)."
 },
 {
  "id": "R2-FIX-04",
  "severity": "minor",
  "title": "Claims F6 is partly fixed: the key still defines ESTIMATE as 'body fat assumed', but Brian Shaw's ESTIMATE rests on a reported body fat",
  "location": "build-comparison/src/app.html:1698 (key: 'ESTIMATE: body fat assumed. DERIVED: body fat measured.') and :439 (forest sub: 'Every range is an estimate (body fat assumed) unless ...')",
  "evidence": "scoreStatus now returns 'estimate' unless bodyFat.status is 'measured', so Brian Shaw's plate and forest row read ESTIMATE. His drawer shows 'BODY FAT 18% (15–21%) REPORTED The build's own measured or reported value' (scratchpad/review2/drawers.json). He is the only build with bodyFat.status 'reported' (node check over model.all()). The key and the forest sub explain his chip as 'body fat assumed', which his own drawer contradicts. The round 1 verifier's better_fix was to reword both texts to 'ESTIMATE: body fat assumed or only reported'. They were not changed.",
  "expected": "The key's meaning for each chip matches every build that carries it.",
  "fix": "Key: 'ESTIMATE: body fat assumed or only reported. DERIVED: body fat measured in a study.' Forest sub: '... an estimate (body fat assumed or only reported) unless it carries a DERIVED chip (body fat measured)'."
 },
 {
  "id": "R2-FIX-05",
  "severity": "minor",
  "title": "Claims F9 is partly fixed: the Kouri drawer heading still says 'Gym athletes', directly above '56 gym athletes and 18 volunteers from a testosterone trial'",
  "location": "build-calculator/data/builds.json:1922 (kouri1995_nonusers.name), shown as the drawer heading",
  "evidence": "Drawer text (scratchpad/review2/drawers.json, kouri1995_nonusers): 'GYM ATHLETES WHO NEVER USED STEROIDS (KOURI 1995, N=74) Group means of Kouri 1995's 74 non-users (56 gym athletes and 18 volunteers from a testosterone trial) ...'. The round 1 verifier flagged this remaining contradiction and asked for the name to be changed. round1.md lists 'Kouri's labels' as fixed.",
  "expected": "The heading matches the description: 74 non-users, not all of them gym athletes.",
  "fix": "Claim builds.json in STATUS.md, then set name to 'Men who never used steroids (Kouri 1995, n=74)'. Rebuild both pages."
 },
 {
  "id": "R2-FIX-06",
  "severity": "minor",
  "title": "DC-14 is partly fixed: the DISPUTED chip still renders as a REPORTED chip, with the 'magazine, fan site' tooltip, in the key and in Sources",
  "location": "build-comparison/src/app.html:1413 (Sources: chip(f.status === 'disputed' ? 'reported' : f.status, f.status)) and :1703 (key: chip(s === 'disputed' ? 'reported' : s, s))",
  "evidence": "Script scratchpad/review2/s/dc14.js lists both chips whose text is 'disputed'. Each has class 'chip reported' and title 'Stated by a magazine, fan site, the athlete, or a secondary source; not independently measured.' One is the key's own row, next to the correct text 'Facts only (kept from the research): sources disagree.' The other is on 'Is the human mass-height exponent really about 2, or nearer 3?', whose sources are Med Hypotheses, Ann Hum Biol and AJCN. VOCAB already has a 'disputed' entry, so the remapping is not needed.",
  "expected": "The DISPUTED chip's style and hover text say 'sources disagree', not the REPORTED definition.",
  "fix": "Use chip('disputed') in both places, so the title comes from VOCAB.disputed and the class is 'chip disputed'. Add a .chip.disputed rule (for example, the reported style with a distinct border), so it does not look identical to REPORTED."
 },
 {
  "id": "R2-FIX-07",
  "severity": "minor",
  "title": "Rex's tail: the page says 306 kg, while NOTES.md and builds.json say 307 kg; the round 1 verifier ruled 307 correct",
  "location": "build-comparison/data/settings.json:514-515 (mass_kg 306, basis '0.289 m^3 ... 306 kg'), test/test.js:72-77; build-comparison/data/NOTES.md:43 ('Rex 307 kg'); build-calculator/data/builds.json rex tail (mass_kg_at_1060 307, 'about 307 kg'); research/reviews/round1.md:52",
  "evidence": "The Rex drawer reads 'WEIGHT COUNTED 2,390 kg: 2,700 kg less 306 kg of tail ... tail 0.289 m^3 at 1,060 kg/m^3 ...: 306 kg'. NOTES.md:43 says 'Rex 307 kg (0.289 m³ at 1,060 kg/m³ ...)', and builds.json says 307. The verifier rejected F23 because 307 is the correct value: history/scratchpad/mass/checker/results_checker.json has tail 0.2894122456, and 0.28941 × 1,060 = 306.8, which rounds to 307. Its better_fix was to revert to 307. round1.md:52 says only 'was judged not a defect; the page uses 306', so the record hides that the change it kept was judged the less accurate one. The repo now gives two values for one quantity.",
  "expected": "One tail mass everywhere, the one the unrounded measurement gives (307 kg).",
  "fix": "Set settings.json rex exclude_mass mass_kg 307 with basis 'tail 0.2894 m^3 at 1,060 kg/m^3 ...: 307 kg', and test.js to 2700 − 307. Rebuild. Reword round1.md:52 to give the verdict (307 kept)."
 },
 {
  "id": "R2-FIX-08",
  "severity": "minor",
  "title": "README statements about the fixes are not true: test count, comic body-fat sentence, and 'all fixed or partly fixed with the reason stated'",
  "location": "build-comparison/README.md:25, :69, :63",
  "evidence": "- README.md:25 says 'node test/test.js ... (28 checks)'. On HEAD, test.js prints '30 passed, 0 failed', and round1.md's 'After the fixes' also says 30. README counts were reported in L17, DC-13 and code F14, and round1.md says they were fixed.\n- README.md:69 still says 'No Marvel or DC source gives any character's body fat.' The DC-4 verifier asked for this exact README sentence to be changed. The page now says 'No body-fat figure ... was found in the Marvel and DC sources searched', and the Kingpin drawer cites a possible 2004 handbook figure.\n- README.md:63 says the 69 confirmed findings were 'all fixed or partly fixed with the reason stated'. Findings R2-FIX-01 to 07 here are not fixed, or are partly fixed with no reason given.",
  "expected": "README numbers and claims match the code, the page and the review record.",
  "fix": "Change ':25' to '(30 checks)', or drop the count. Change ':69' to 'No body-fat figure for a comic character was found in the Marvel and DC sources searched.' Correct ':63' once round 2's fixes land, or list the items that are only partly fixed."
 },
 {
  "id": "R2-FIX-09",
  "severity": "minor",
  "title": "round1.md overstates the per-view refinement speed-up ('about a third faster')",
  "location": "build-comparison/research/reviews/round1.md:100 (code F5 row)",
  "evidence": "Scripts scratchpad/review2/s/prof.js and s/refine_browser.js compare measure.js at 3cd65f5 (whole-sheet refinement) with HEAD (refineViews). The input is the 2,000 px median-soldier sheet, 4,479 × 2,320 px, made with templateViews and renderSheet.\n- Node, refinement only: 8,866 and 8,244 ms (old) against 7,091 and 7,115 ms (new), 14–20% faster\n- Node, full measureSheet: 10,723 and 10,014 ms against 8,819 and 8,986 ms\n- Chromium, full measureSheet: 11,481 and 10,737 ms against 9,611 and 10,698 ms (0–16%)\nThe masks are identical (0 pixels differ) and so is the score (26.95). The worker and 'about 10 s' parts of the row are true: 10.1 s in the page, with a largest timer gap of 171 ms while it runs.",
  "expected": "The review record gives the speed-up it measured.",
  "fix": "Change 'about a third faster' to 'about 10–20% faster (refinement 8.2–8.9 s down to 7.1 s on a 2,000 px sheet)'. Alternatively, make it faster, for example by refining only a band a few pixels wide around the coarse mask edge."
 },
 {
  "id": "R2-FIX-10",
  "severity": "minor",
  "title": "round1.md says each archive.org API source now shows its quote and its book's page; 4 of 21 show neither, including the official 1987 handbook hit",
  "location": "build-comparison/research/reviews/round1.md:58 (DC-1 row); build-comparison/tools/compile_facts.py:84-133 (QUOTE_PICK, OFFICIAL_ITEMS)",
  "evidence": "A Python check over data/facts.json found 21 page_production sources, 4 with no 'it matched' quote. All 4 are in asgardian_tissue_density_ohotmu ('OHOTMU 1987 TPB vol 4: same phrases'; 'times the density' AND Asgardian; 'dense/denser/density') and asgardian_tissue_density_dk. research/archive_snippets.json stores a hit for the 1987 handbook (officialhandbook04grue, an official item): '... bone is about 3 times {{{denser than similar human tissue}}}, contributing to the Asgardians ...'. QUOTE_PICK for this fact requires 'Asgardian flesh and bone|flesh and bone is about (three|3) times', and the highlight begins at 'and bone', so neither the quote nor the item page is added. The asgardian_tissue_density_dk search is stored as {'error': 'HTTP Error 400: Bad Request'}. DC-1 itself was rejected as a defect, so this concerns only the accuracy of the record.",
  "expected": "The record's description of the hardening matches facts.json, or the 1987 handbook quote and its item link are added as described.",
  "fix": "Widen QUOTE_PICK['asgardian_tissue_density_ohotmu'] to r'(flesh and )?bone is about (three|3) times|denser than similar human tissue', re-run tools/compile_facts.py and rebuild. Reword round1.md:58 to say which sources have no stored match."
 },
 {
  "id": "R2-FIX-11",
  "severity": "minor",
  "title": "NOTES.md numbers about the redrawn figures are stale: drawn volume vs weight, and the giants' arm angles",
  "location": "build-comparison/data/NOTES.md:65 (Drawn volume vs weight) and :60 ('The comic giants' arms rest 64-84° out')",
  "evidence": "Each drawer's drawing check, read from all 49 drawers (scratchpad/review2/drawers.json), against NOTES.md:65:\n- NOTES: '3% less to 34% more ... (median +10%). Soldiers are within −3% to +8%; ... (Arnold +34%, Oliva +26%, Coleman +21%)'\n- Page: ansur2_m_p5 −4%, ansur2_m_p95 +7%, Oliva +27%, Coleman +20%, Arnold +34%, median about +12% (11.5, Colossus armoured excluded)\nThe drawing check now uses each figure's own arm angle, Math.max(35, armAngle(e)).\nNOTES.md:60, '64-84°': the comic giants band (Darkseid, the Hulks, Juggernaut, Abomination) rests at 70.2–84.1° in limits.json chart_figures. The 63.5° and 63.8° belong to the Thing and Thor, who sit in the 45–62 gap, not in the giants band.",
  "expected": "The notes give the numbers the current page shows.",
  "fix": "NOTES.md:65: 'from 4% less to 34% more (median about +12%). Soldiers are within −4% to +7% ... (Arnold +34%, Oliva +27%, Coleman +20%)'. Better, generate these from the build. NOTES.md:60: 'The comic giants' arms rest 70–84° out (Thor and the Thing about 64°)'."
 }
]
```

</details>

**Subagent `verify2:ux`** · build-comparison-review-r2 · started 2026-10-11 08:34:34 UTC

- verdicts: 10 (10 confirmed).

<details>
<summary>Prompt, verbatim (18,813 characters)</summary>

Workflow run `wf_9bab17b6-d0f`, phase `Verify`, agent `a28a050fd18640c0a`.

```text
You are reviewing "Build Comparison", a self-contained HTML page (claude.ai Artifact) in /home/user/rex-strength-lab/build-comparison/ on git branch claude/hopeful-keller-vly1s9 (HEAD 7061d55). It ranks men's builds by a size-independent score S = 1.8 x fat-free mass / height^3 (FFMI the body would have at 1.80 m, same shape), from ordinary men to two original 3 m characters (Rex and Ollie), with silhouettes drawn from data, empty stretches left visibly empty, three "functional limits" found by geometry on widened template figures and measured with the page's own measuring tool, a "meatball" end of scale (924), and a measuring tool for A-pose model sheets (now run in a Web Worker) with a target-outline solver.
This is review ROUND 2. Round 1 found 76 issues; the record of what was fixed, and how, is /home/user/rex-strength-lab/build-comparison/research/reviews/round1.md (verbatim findings and verdicts in round1.json). Since then these changed: tools/compute_limits.js (measured limit scores, chart_figures, met_by), src/figure.js (solveTarget, armClearAt, sheetSkullRows), src/measure.js (side-view check, skull-row validation, per-view refinement, sliceRotated), src/app.html (arms at rest angle, per-grid column widths with one drawing height, met-sooner text, worker measuring, lazy tool start, focus fixes, forest labels, sheet picker, alpha sheets, copy inputs), data/settings.json, research/corrections.json, tools/compile_facts.py (archive.org quotes and item links), tools/fetch_archive_snippets.py, test/test.js, test/shots.js, .github/workflows/test.yml. Use git log and git diff 3cd65f5..HEAD to see them.
Read: /home/user/rex-strength-lab/build-comparison/BRIEF.md, round1.md, data/NOTES.md, and the code above. Builds come from /home/user/rex-strength-lab/build-calculator/data/builds.json via /home/user/rex-strength-lab/build-calculator/src/calc.js.
Build: cd /home/user/rex-strength-lab/build-comparison && node build.js. Tests: node test/test.js; node test/duo.js; node test/shots.js. Render the page yourself with Playwright: require('/opt/node22/lib/node_modules/playwright'); chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); wrap dist/index.html in '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + page + '</body></html>' and load it from a file. Fonts: see test/shots.js routeFonts (fallback fonts are fine for logic). window.__bc exposes LIST, GAPS, SEQ, HUMAN_TOP, MEAT, AX, sc. The measuring tool starts when #tool scrolls near: scroll it into view first.
The owner is a professional critic: factual accuracy and honest labelling come first (see CLAUDE.md, already loaded). Do NOT edit anything under /home/user/rex-strength-lab (another session may be editing the working tree: work on a copy made with git archive HEAD if you need a stable tree). Write scratch scripts and screenshots under /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/review2/ (create it). Every finding must be reproduced: give the exact input or place, what the page or code does (quote it, or the script output), what is correct with your derivation or source, and a minimal fix. Report real defects only: wrong maths or physics, wrong or unsupported claims, mislabelled status, contradictions between parts of the page, broken layout or controls, tests that do not test what they say, fixes that did not fix or that broke something else. Skip style preferences, and do not re-report round 1 items that round1.md records as fixed and that you confirm are fixed.

Another reviewer (ux lens) reported the findings below. For EACH one, try hard to REFUTE it: reproduce it yourself with your own script or browser run, independently of theirs, on the current HEAD (git log -1 tells you which; the working tree may have moved on since the reviewer ran: say so if a finding is already fixed). Mark real=true only if you reproduced it. Confirm the severity and give the best minimal fix (exact code or text). Default to real=false if you cannot reproduce it.

FINDINGS:
[
 {
  "id": "UX2-1",
  "severity": "major",
  "title": "Loading a new sheet while the worker is still measuring shows and copies the old sheet's results under the new file's name",
  "location": "build-comparison/src/app.html:1552-1575 (loadFile does not invalidate the in-flight run), 1461-1466 (the callback checks only tool.run), 1476-1478 (the elapsed-time interval keeps running)",
  "evidence": "Script: scratchpad/review2/s/race.js (sheets from s/mksheets.js, drawn with the page's own Figure.renderSheet). Steps at 1280x900: load coleman-2000.png (4992x2320), type 1.80, press Measure. After 1.5 s, load soldier-500.png (1241x580). Output while the first job is still running: the status reads 'Measuring… 2 s … 4 s' instead of 'Loaded. Type the height…', and the Measure button stays disabled. When the old job finishes, the page shows sheetName 'soldier-500.png (1241 × 580 px)' with captions 'front · 2002 px / side · 2002 px / back · 2002 px', Volume 0.146 m³, Mass 155 kg and Chest 247.4 cm. The height field is empty. Copy then says 'Copied: 118 lines' and the entry has name 'soldier-500.png', weight 154.9 and the note 'score 44.2 (42.3-46.2)'. Measured on its own, soldier-500.png gives 0.088 m³ and 93 kg. Screenshot scratchpad/review2/race-tool.png: the gutter labels (chest, waist, crotch, knee, ground) fall into the checks list, because the landmark rows of the 2,320 px image are placed on the 580 px one.",
  "expected": "A result belongs to the image and inputs it was measured from. When the sheet changes, a pending measurement must be discarded: its status ticker stopped, the button re-enabled and nothing written. Otherwise a wrong build entry can be pasted into builds.json under another file's name.",
  "fix": "In loadFile, and in the Soldier-sheet handler, add `tool.run++`, clear the pending ticker (keep it as tool.tick and clear it in done) and set `$('measureBtn').disabled = false`. Belt and braces: in measure() capture `var img = tool.img`, and in the callback return early when `img !== tool.img`."
 },
 {
  "id": "UX2-2",
  "severity": "major",
  "title": "Fields edited while the worker measures are not marked stale: the results and the copy use the old height while the field shows the new one (round 1 F8 still leaks)",
  "location": "build-comparison/src/app.html:1643-1646 (the input/change listeners mark only the result already on screen) and 1461-1466 (the new result is stored without comparing it with the current fields)",
  "evidence": "Script: scratchpad/review2/s/stale.js, at 1280x900. Load coleman-2000.png, type 1.80, press Measure. After 1 s, type 2.50 and press Tab, all while the worker is running. When the result arrives, the field shows '2.50' but the table shows 'Mass 155 kg' and the normal status, with no warning. Copy reports 'Copied: 118 lines, ready to paste as a build entry.' with height_m 1.8. Pressing Measure again with 2.50 gives 'Mass 415 kg' (155 × (2.5/1.8)³ = 415). Without the Tab, the copy happens to be refused, because clicking Copy blurs the field and fires 'change'. The guard works by accident, not by design.",
  "expected": "Round 1 F8 says 'Copy uses the inputs that were measured and refuses after the fields change.' A change made during an asynchronous measurement is still a change after the button press, so the result should arrive marked stale, or be discarded.",
  "fix": "Keep a counter `tool.fieldsVer` that every input/change event on tH, tRho, tBf, tArmK, tSkull and tOrder increments. Capture it in measure(). In the callback, if it differs, set `r.stale = true` after writeResults and show 'The fields changed since this measurement: press Measure to update the results.' Or compare r.inputs with num() of the current fields."
 },
 {
  "id": "UX2-3",
  "severity": "major",
  "title": "'Meet this test (sooner)' reads as 'pass this test', the opposite of what is meant, and gives different counts for the same test without saying why",
  "location": "build-comparison/src/app.html:707-712 (metSooner), 731 (gap copy), 902 (band note), 1361-1362 (limit cards); data/settings.json:721 (limits verdict)",
  "evidence": "Rendered text (scratchpad/review2/s/text.js, 1280 px). Limits verdict: 'The chart's own drawings of the biggest bodybuilders already meet the first two.' Face card: 'None of the chart's own figures meets this test.' In plain English, meeting a test means passing it, so a general reader takes this as 'every figure can still reach its face', or 'their arms pass'. The intended meaning is that the body has reached the limit: the arms can no longer hang down. The band note in 'The top of the human record' comes about 7,000 px before the limits section that introduces 'the same three tests'. It reads: 'Limit · arms out · about 41 … The chart's own figures, drawn from their girths, meet this test sooner: 15 of them, from Arnold Schwarzenegger (about 27) up.' The arms card says: 'already meet this test: 24 of them, from Arnold Schwarzenegger (about 27) up.' The 45–62 gap says: 'meet the thighs test sooner: three of them, from Ronnie Coleman (about 39) up.' The thighs card says: '11 of them, from Ronnie Coleman (about 39) up.' The same claim pattern carries different counts (15 vs 24, 3 vs 11), and no sentence says that 'sooner' counts only figures scoring below the limit (metSooner(L, L.score)) or below the stretch (metSooner(L, g.from)). The gap copy also uses 'the evenly widened soldier' before the page has explained it.",
  "expected": "The owner's standard asks for plain, specific wording that a general reader cannot read backwards. Each count should say what it counts.",
  "fix": "Name the outcome, not a test. Cards: 'Already past this limit in their own drawings: 24 of the chart's figures (their arms cannot hang closer than 30°), from Arnold Schwarzenegger (about 27) up.' Face: 'None of the chart's own figures is past this limit.' Band and gap notes: '15 figures scoring under 41 are already past it in their drawings, from Arnold Schwarzenegger (about 27) up.' Verdict: '…already reach the first two limits.' In the gap copy, gloss 'evenly widened soldier' or link it to #limits."
 },
 {
  "id": "UX2-4",
  "severity": "minor",
  "title": "In Real heights mode the lineup still says 'Everyone is drawn at the same height'",
  "location": "build-comparison/src/app.html:420 (static verdict) and 1707-1712 (modeNote updates only #modeNote)",
  "evidence": "Script: scratchpad/review2/s/realverdict.js, 1280x900. After clicking 'Real heights' (aria-pressed=true), #lineup .verdict still reads 'Everyone is drawn at the same height, in score order. Only the build differs.' The figures are now drawn at different heights: Bruce Banner 90 px, the median soldier 90 px, Hulk (savage) 110 px, Rex 158 px. The mode note just above says 'Real heights: one scale for every figure.' Screenshot: scratchpad/review2/ux/real-heights-verdict-1280.png.",
  "expected": "A section verdict that is true in the mode on screen. In Real heights: 'Everyone is drawn to one scale, at their real heights, in score order.'",
  "fix": "Give the verdict an id and set it in modeNote() from state.heights, for example: same → 'Everyone is drawn at the same height, in score order. Only the build differs.'; real → 'Everyone is drawn to one scale at his real height, in score order.'"
 },
 {
  "id": "UX2-5",
  "severity": "minor",
  "title": "The hands-to-face limit card shrinks its figure to 85% height, below the skull line and the landmark lines drawn for the other cards",
  "location": "build-comparison/src/app.html:1329-1336 (limitFigure lowers k when the figure is wider than W−8, but wall() still draws the skull and landmark lines for the full Hd)",
  "evidence": "Script: scratchpad/review2/s/limits.js, at every width from 360 to 1280. The skull line is at y=10 and the floor at y=210 in each card. The median soldier, arms and thighs figures have their top at y=10.0–10.2. The face figure's top is at y=39.9: it is drawn 170 of 200 units tall. The cause is the face figure's width, 2.03 m in limits.json against the 192/111.1 = 1.73 m that fits, so k drops from 111.1 to 94.6 px/m. Screenshots scratchpad/review2/limits-1280-light.png and limits-390-dark.png: the fourth figure is visibly shorter, with its head well under the blue line. The key says 'Blue line across the wall: the top of the skull. Every figure is drawn to it', and the limits method says each template is drawn at 1.80 m.",
  "expected": "All four limit figures at the same 1.80 m drawing height, skull on the blue line, with the shoulder, chest, waist, crotch and knee lines at the figure's own landmarks.",
  "fix": "Keep k = Hd/H and widen that card's viewBox instead: W = max(200, ceil((bb[2]−bb[0])·k) + 8). The SVG is width:100%, height:auto, so the card scales it down. Or compute one k for all four cards from the widest figure and draw the wall at Hd = 1.8·k."
 },
 {
  "id": "UX2-6",
  "severity": "minor",
  "title": "Locator tape's accessible name says 'scores 920 to 924' for the meatball and drops 'empty' for empty stretches",
  "location": "build-comparison/src/app.html:1232-1234 (markStop: the aria-label uses sc(s.lo) and never the gap/meat wording)",
  "evidence": "Script: scratchpad/review2/s/loclabel.js, at 390 and 1280. At #meatball the visible line reads 'To scale · now: score 924' but the aria-label is 'To-scale tape. Now showing scores 920 to 924.' sc() rounds 924.1 to two significant figures, 920, which breaks the round 1 rule that 924 is never rounded. At #empty the visible line is 'now: empty 45 to 62' while the aria-label is 'Now showing scores 45 to 62.' The same goes for 88 to 130 and 220 to 924. CDP confirms #locTape has role=image with that name.",
  "expected": "The accessible name says what the visible line says: 'score 924' for the meatball, and 'empty 45 to 62' for an empty stretch.",
  "fix": "Build one string and use it for both: `var now = (s.kind === 'gap' ? 'empty ' : 'score ') + (s.kind === 'meat' ? MEAT_TXT : s === STOPS[0] ? 'under ' + hi : lo + ' to ' + hi);` then set `$('locNow').textContent = 'To scale · now: ' + now` and the aria-label to 'To-scale tape. Now showing ' + now + '.'"
 },
 {
  "id": "UX2-7",
  "severity": "minor",
  "title": "Tool status lines are not live regions, so measuring, results, failures and copy confirmations are never announced",
  "location": "build-comparison/src/app.html:490 (#validation), 503 (#toolStatus), 516 (#targetStatus)",
  "evidence": "No element in the page has aria-live or role=status: grep for 'aria-live|role=\"status\"' in src/app.html returns nothing. CDP Accessibility.getPartialAXTree (scratchpad/review2/s/ax.js) gives #toolStatus, #targetStatus and #validation as role=paragraph with no live property. Measuring now runs asynchronously in a worker: the 2,000 px sheet in race.js took about 10–12 s. A screen-reader user who presses Measure, Draw or Copy hears nothing: not 'Measuring…', not the result, not 'The sheet failed a check, so treat these numbers as rejected', not 'Copied'.",
  "expected": "Status messages announced politely (WCAG 4.1.3), above all now that results arrive seconds after the button press.",
  "fix": "Add role=\"status\" (implicit aria-live=polite) to #toolStatus and #targetStatus, and to #validation if wanted. Keep the per-second 'Measuring… N s' ticker out of the live text, for example in an aria-hidden span, so it is not read every second."
 },
 {
  "id": "UX2-8",
  "severity": "minor",
  "title": "The hidden file input is still exposed to screen readers as a second, unlabelled 'Choose File' button",
  "location": "build-comparison/src/app.html:482",
  "evidence": "CDP AX tree (scratchpad/review2/s/ax.js): #file gives role=button, name 'Choose File', not ignored. It has class .sr and tabindex=-1, which removes it from the Tab order only. A screen reader's virtual cursor still finds it next to 'Choose a sheet…', with a generic name and no context.",
  "expected": "One control for choosing a sheet. The proxy input is hidden from assistive technology, since #tChoose triggers it.",
  "fix": "Add aria-hidden=\"true\" to <input type=file id=file> (it is never focused by keyboard anyway)."
 },
 {
  "id": "UX2-9",
  "severity": "minor",
  "title": "Sheet view captions run together on phones ('FRONT · 702SIDE · 702BACK · 702', with 'PX' on its own line)",
  "location": "build-comparison/src/app.html:329-330 (.viewcaps: flex, space-around, no gap, wrapping allowed) and 1447",
  "evidence": "Script: scratchpad/review2/s/caps.js. At 360 px the three captions each break onto 2 lines; the gap between 'front · 702 px' (x 93–172) and 'side · 702 px' (x 172–244) is 0 px, and between side and back it is 2 px. At 390 and 414 px each caption still wraps, leaving 'PX' alone on a second line (gaps 11–19 px). Screenshot scratchpad/review2/ux/viewcaps-360.png (dpr 3) reads 'FRONT · 702SIDE · 702BACK · 702' over 'PX PX PX'. A 2,000 px sheet makes each caption one character longer ('2002 px').",
  "expected": "Three separate captions under the three views, each on one line or clearly apart.",
  "fix": "`.viewcaps { gap: 8px; } .viewcaps span { white-space: nowrap; }` and below 720 px drop ' px' or use a smaller form ('front 702'). Better, place each caption under its view's centre from res.views[v].x0/x1, as the gutter labels are placed."
 },
 {
  "id": "UX2-10",
  "severity": "minor",
  "title": "Target outline boxes show broken-image icons until the first outline is drawn",
  "location": "build-comparison/src/app.html:517 (<img> with no src), 1595 (none() removes src), 1649 (drawTarget runs 400 ms after the lazy start, then blocks about 2 s)",
  "evidence": "Script: scratchpad/review2/s/emptyboxes.js, 1280x900, clicking the 'Measure a character' jump link. When the solver starts (762 ms), the target status reads 'Drawing…', #tgtFront has no src and naturalWidth 0, and the image is in view. The outline appears only at 2,602 ms, and the main thread is blocked for about 1.9 s in between (long task in s/lazy.js), so that frame stays on screen. Screenshot scratchpad/review2/ux/target-before-start-390.png shows the two 220–320 px boxes with Chromium's broken-image icon and the alt text 'Target outline, front view'. The same boxes return after any refused target, because none() removes the src. Screen readers also announce two images that do not exist.",
  "expected": "No broken-image placeholders: an empty, labelled area ('The outline appears here') or nothing until an outline exists.",
  "fix": "Put `hidden` on .target-imgs until the first successful draw, and set it again in none(). Or give the boxes a CSS placeholder and set the alt only when a src is set."
 }
]
```

</details>

**Subagent `verify2:code`** · build-comparison-review-r2 · started 2026-10-11 08:42:21 UTC

- verdicts: 9 (9 confirmed).

<details>
<summary>Prompt, verbatim (19,996 characters)</summary>

Workflow run `wf_9bab17b6-d0f`, phase `Verify`, agent `abb9ca67b9d534a6c`. Lines over 1,500 characters are cut here; the full prompt is in [prompts/abb9ca67b9d534a6c.txt](prompts/abb9ca67b9d534a6c.txt).

```text
You are reviewing "Build Comparison", a self-contained HTML page (claude.ai Artifact) in /home/user/rex-strength-lab/build-comparison/ on git branch claude/hopeful-keller-vly1s9 (HEAD 7061d55). It ranks men's builds by a size-independent score S = 1.8 x fat-free mass / height^3 (FFMI the body would have at 1.80 m, same shape), from ordinary men to two original 3 m characters (Rex and Ollie), with silhouettes drawn from data, empty stretches left visibly empty, three "functional limits" found by geometry on widened template figures and measured with the page's own measuring tool, a "meatball" end of scale (924), and a measuring tool for A-pose model sheets (now run in a Web Worker) with a target-outline solver.
This is review ROUND 2. Round 1 found 76 issues; the record of what was fixed, and how, is /home/user/rex-strength-lab/build-comparison/research/reviews/round1.md (verbatim findings and verdicts in round1.json). Since then these changed: tools/compute_limits.js (measured limit scores, chart_figures, met_by), src/figure.js (solveTarget, armClearAt, sheetSkullRows), src/measure.js (side-view check, skull-row validation, per-view refinement, sliceRotated), src/app.html (arms at rest angle, per-grid column widths with one drawing height, met-sooner text, worker measuring, lazy tool start, focus fixes, forest labels, sheet picker, alpha sheets, copy inputs), data/settings.json, research/corrections.json, tools/compile_facts.py (archive.org quotes and item links), tools/fetch_archive_snippets.py, test/test.js, test/shots.js, .github/workflows/test.yml. Use git log and git diff 3cd65f5..HEAD to see them.
Read: /home/user/rex-strength-lab/build-comparison/BRIEF.md, round1.md, data/NOTES.md, and the code above. Builds come from /home/user/rex-strength-lab/build-calculator/data/builds.json via /home/user/rex-strength-lab/build-calculator/src/calc.js.
Build: cd /home/user/rex-strength-lab/build-comparison && node build.js. Tests: node test/test.js; node test/duo.js; node test/shots.js. Render the page yourself with Playwright: require('/opt/node22/lib/node_modules/playwright'); chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); wrap dist/index.html in '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + page + '</body></html>' and load it from a file. Fonts: see test/shots.js routeFonts (fallback fonts are fine for logic). window.__bc exposes LIST, GAPS, SEQ, HUMAN_TOP, MEAT, AX, sc. The measuring tool starts when #tool scrolls near: scroll it into view first.
The owner is a professional critic: factual accuracy and honest labelling come first (see CLAUDE.md, already loaded). Do NOT edit anything under /home/user/rex-strength-lab (another session may be editing the working tree: work on a copy made with git archive HEAD if you need a stable tree). Write scratch scripts and screenshots under /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/review2/ (create it). Every finding must be reproduced: give the exact input or place, what the page or code does (quote it, or the script output), what is correct with your derivation or source, and a minimal fix. Report real defects only: wrong maths or physics, wrong or unsupported claims, mislabelled status, contradictions between parts of the page, broken layout or controls, tests that do not test what they say, fixes that did not fix or that broke something else. Skip style preferences, and do not re-report round 1 items that round1.md records as fixed and that you confirm are fixed.

Another reviewer (code lens) reported the findings below. For EACH one, try hard to REFUTE it: reproduce it yourself with your own script or browser run, independently of theirs, on the current HEAD (git log -1 tells you which; the working tree may have moved on since the reviewer ran: say so if a finding is already fixed). Mark real=true only if you reproduced it. Confirm the severity and give the best minimal fix (exact code or text). Default to real=false if you cannot reproduce it.

FINDINGS:
[
 {
  "id": "C2-1",
  "severity": "major",
  "title": "The measuring tool drops near-level arms without a warning and slices them as torso, adding about 10% volume. This skews the target tool, the face-limit band and the giants' drawing checks",
  "location": "src/measure.js frontLandmarks() arms (`if (pts.length < 0.1 * Hp) return null;`) and measureSheet volume(). Callers: tools/compute_limits.js scoreAt() (arms drawn at Math.max(35, rest + 2), which is 92° when rest = 90); src/app.html drawingCheck(), drawTarget(); tools/export_targets.js",
  "evidence": "An arm is kept only if its run spans at least 10% of the figure's height in image rows. A widened figure's arms rest 65–90° out, so they span fewer rows and are dropped. Nothing warns: `problems` only reports a missing armpit. Those rows are then sliced as torso (front width × torso side depth).\n\n**Reproduced with scratchpad/review2/code/disc.js and disc_parts.js** (ansur2_m_p50 template, 1,000 px):\n- f = 1.7408: arms 68.6°, both found. Torso 0.1674 m³, arms 0.0095 m³, score 75.32.\n- f = 1.75: arms [null, null]. Torso 0.2043 m³, arms 0, score 83.82.\n- So the score rises 11% … [1,571 more characters on this line; the full prompt is in prompts/abb9ca67b9d534a6c.txt]
  "expected": "The volume of a figure should change smoothly with its width. Arms at any angle up to horizontal should be found and sliced across their own axis. If they can't be found, the tool should warn and refuse, not count them as torso. The face band, the giants' drawing checks and the target outlines all depend on this reading.",
  "fix": "- In frontLandmarks, accept an arm by its length along its axis (row span ÷ cos(angle), or the path of the run centres), not by its row span. Add a warning when an armpit is found but no arm.\n- Or slice arms with sliceRotated, the way frontOnly does.\n- In compute_limits.js, cap the drawing angle at 90° (do not draw at rest + 2 when rest = 90).\n- Then recompute limits.json and the drawing checks.\n- Add a test that the score is continuous through f = 1.70–1.80 on the median template."
 },
 {
  "id": "C2-2",
  "severity": "major",
  "title": "'Front and back landmarks line up' rejects sheets whose back view is the exact mirror of the front. The target tool and the CLI then refuse valid targets, and the CLI refuses every target on the 5th-percentile base",
  "location": "src/measure.js frontLandmarks() waist (argmin of the torso width between chest + 5% and crotch − 5%) and the front/back check in measureSheet (compares detected Fdet with B). Also Figure.solveTarget (gives up if f = 1 fails), tools/export_targets.js noSheet(), tools/compute_limits.js scoreAt() (does not check r.ok)",
  "evidence": "renderSheet draws the back view as the exact mirror of the front. The waist row is the argmin of a nearly flat width profile, so one-pixel rasterisation differences move it a long way.\n\n**Mirror sheets rejected (code/mirror_scan.js):**\n- ansur2_m_p5 at f = 1, 800 px: \"off: waist (front 316, back 368)\", 6.5% of the height against a 2% tolerance. Rejected.\n- 6 of 90 mirror sheets fail (6 shapes × f 0.8–1.2 × 600, 800 and 1,000 px).\n- ansur2_m_p95 at f = 1.1, 1,000 px: \"waist (front 395, back 683)\".\n\n**Detected waist (code/waist.js):** without guide lines the waist lands at 0.685 of stature, the top edge of its search band, on p50, p95 and the largest-arm soldier. The template's waist is at 0.601.\n\n**On the page (code/page_target_pw.js):** 'Army men, 5th percentile' with target 23 or 18 gives \"The full-size outline fails the tool's own checks (front and back landmarks line up (within 2% of the height)), so it is not offered.\" Emulating the page (code/page_target.js) also refuses p5 at 15, 22 and 24, p95 at 60, and the largest-arm soldier at 40.\n\n**CLI:** `node tools/export_targets.js --score 30 --build ansur2_m_p5` (default --px) gives \"No passing sheet reaches 30 on this base: beyond widths x 1.00 (score NaN) the drawing fails the tool's own checks.\" Scores 60 and 200 give the same, so every target is refused, and the message prints NaN.\n\n**compute_limits.js** stores p5's score_at_f1 (22.99) from a sheet that fails this check.",
  "expected": "A sheet whose back view is the mirror image of its front should pass a check meant to catch misaligned views. A 2% alignment test needs landmarks that are stable to within 2%.",
  "fix": "- Take the waist as the middle of the rows within about 1% of the minimum width. Or, when the sheet's guide lines are found (they cross every view), use those rows for both views. Or test the front's width at the back's waist row rather than comparing the two argmin rows.\n- In solveTarget, do not stop when f = 1 fails; search nearby.\n- Print 'the base sheet fails …', not 'score NaN'.\n- Make compute_limits scoreAt require r.ok."
 },
 {
  "id": "C2-3",
  "severity": "major",
  "title": "A measurement still running when a new sheet is loaded lands on the new sheet, and Copy exports its numbers under the new file's name",
  "location": "src/app.html loadFile() (does not invalidate the running job: tool.run is not bumped) and the measure() callback (`if (run !== tool.run) return;` then writeResults on tool.img)",
  "evidence": "Reproduced with scratchpad/review2/race_load.js:\n1. Load big-p95.png (a 2,000 px figure, about 10 s to measure), type 1.80 and press Measure.\n2. 0.3 s later, load small-wide.png.\n3. When the first result returns, the page shows sheetName \"small-wide.png (1564 × 580 px)\" with viewCaps \"front · 2002 px side · 2002 px back · 2002 px\" and the p95 results table. The p95 landmarks are drawn over the new image, and tH is empty.\n4. Press Copy. It exports `name=small-wide.png weight=110.8` with notes `score 31.6 (30.2-33.1) at 7.5% fat`: the first sheet's measurement, labelled 'measured from art' under the second sheet's name.",
  "expected": "A result belongs only to the image and inputs it was measured from. Loading a new sheet should discard any measurement still running.",
  "fix": "- Increment tool.run, and clear the status timer, in loadFile and in the Soldier-sheet handler.\n- In the callback, also require that the measured image is still tool.img.\n- Optionally terminate and recreate the worker, so the stale job stops."
 },
 {
  "id": "C2-4",
  "severity": "major",
  "title": "The example-sheet note blames the 26 vs 27 gap on drawing size. The real cause is that the example draws the soldier's unscaled girths at 1.80 m, so it is not the same shape",
  "location": "src/app.html exampleSheet() (uses byId('ansur2_m_p50').girths) and writeResults() example text",
  "evidence": "The page says (code/example_text.js): \"The example is the median soldier at 1.80 m … The limits section reads the same shape at 27 from a larger drawing; the reading moves by a few percent with the drawing's size.\" The example measures 26 (24–28).\n\nexampleSheet() draws his own girths, measured at his height of 1.755 m (chest 1.056 m), on a 1.80 m figure. The limits and the target tool use calc.compute({heightM: 1.8}), whose girths are scaled up by 1.8/1.755 (chest 1.083 m).\n\nReadings (code/example_gap.js, refine 0):\n\n| Girths | 700 px | 800 px |\n|---|---|---|\n| The page's (unscaled) | 25.83 | 25.82 |\n| Scaled to 1.80 m | 27.01 | 27.26 |\n\nDrawing size moves the reading by 1% or less. The roughly 6% gap comes from a 2.5% narrower shape.",
  "expected": "The page should either use the same shape, or give the true reason for the difference.",
  "fix": "Draw the example from calc.compute({ buildId: 'ansur2_m_p50', heightM: 1.8 }) girths. It then reads about 27, as the limits do, and the sentence can drop the drawing-size explanation. Otherwise, say that it is his own girths drawn at 1.80 m, a slimmer shape."
 },
 {
  "id": "C2-5",
  "severity": "minor",
  "title": "Figure.solveTarget treats a failing sheet inside the bracket as 'above target', loses the root, and returns a 10.8% miss as a success",
  "location": "src/figure.js solveTarget(): the else branch `fh = f; if (ok(s)) sh = s;` and the final `return { f: fl, score: scoreAt(fl) }`",
  "evidence": "Traced with code/../solve_trace.js (ansur2_m_p5, target 15, 300 px, as the page solves):\n1. Narrowing hits a failure at 0.667. edge() finds 0.692 (12.55), so the bracket is [0.692 → 12.55, 1 → 22.74].\n2. The first false-position point, f = 0.7729, fails the checks. Its score is 14.82, below 15, but it is treated as high: fh = 0.7729 while sh keeps the stale 22.74.\n3. The root, near 0.78, is now outside the bracket.\n4. After 41 evaluations it returns {\"f\":0.7208,\"score\":13.378}, a −10.8% miss with a non-null f, which callers treat as converged.\n\nOther misses from solve_scan.out: p5 target 22 gives 21.19 (−3.7%); Coleman 250 gives −0.32% after 33 evaluations. The test covers only p50 targets 20, 217 and 900, where no sheet fails.",
  "expected": "The solver should hit the 0.2% tolerance, or report that it could not.",
  "fix": "- On NaN, never put a stale score on the new endpoint. Bisect between the passing endpoint and the failing point, or probe both sides of the failure.\n- When the tolerance is not reached, return f: null with reason 'fails' (or a converged: false flag that drawTarget and export_targets check).\n- Add a regression test on ansur2_m_p5 at target 15."
 },
 {
  "id": "C2-6",
  "severity": "minor",
  "title": "Two quick measurements: two elapsed-time counters overwrite each other, and the new job waits behind the abandoned one",
  "location": "src/app.html measureAsync() (a new setInterval per call) and the tSoldier handler (calls measure() while the button is disabled)",
  "evidence": "code/two_quick.js: measure big-p95.png, then press 'Soldier sheet' 2.5 s later.\n- The status alternates \"Measuring… 3 s\", \"Measuring… 1 s\", \"Measuring… 4 s\", \"Measuring… 2 s\" and so on, up to 10.4 s.\n- The soldier sheet, normally under 1 s, returns after about 8 s, because it is queued in the single worker behind the superseded 2,000 px job. Nothing terminates that job.",
  "expected": "One counter for the current run, and the superseded job cancelled.",
  "fix": "Keep the interval handle on `tool` and clear it when a new run starts. When a newer run or a new sheet supersedes a job, call worker.terminate() and set worker = null, so the next call builds a fresh worker."
 },
 {
  "id": "C2-7",
  "severity": "minor",
  "title": "The archive quote shown for Luke Cage is garbled OCR without the claimed words, and the Abomination quote stops before the claim",
  "location": "tools/compile_facts.py QUOTE_PICK and OFFICIAL_ITEMS",
  "evidence": "**Luke Cage.** The Sources section shows, for luke_cage_dense_tissue: \"it matched “…DiaMoNDBAcK—but graduated to battling bone tissue, and steel-hard skin. He recovers three times faster % from injury…”\". It does not contain 'dense'.\n\nThe same search (archive_snippets.json, \"steel-hard skin\") has a clean hit from item marvelcomicsency0000unse: \"strength, very dense muscle and bone tissue and steel-hard skin. He recovers three times faster from injury\". That hit is dropped because the item is not in OFFICIAL_ITEMS. The fact's own notes say \"A clean copy of the same DK text appears in the full-text search snippet.\"\n\n**Abomination.** The pattern r'Abomination.s body fortified|pounds of bone marrow and muscle' matches the first highlight: \"…Hulk’s. The gamma radiation that mutated the Abomination’s body fortified his cellular structure and added…\". That stops before \"over 800 pounds of bone marrow and muscle tissue\", which is the fact's label. The second highlight contains it.",
  "expected": "The quote shown under each source should contain the words the fact relies on.",
  "fix": "- Luke Cage: use r'dense muscle and bone tissue' and add marvelcomicsency0000unse to OFFICIAL_ITEMS (labelled as the DK Marvel Comics Encyclopedia).\n- Abomination: put r'pounds of bone marrow and muscle' alone (or first, with a preference for the most specific alternative).\n- Add a check that each picked quote matches a key phrase of the fact."
 },
 {
  "id": "C2-8",
  "severity": "minor",
  "title": "Tests do not cover what the round-1 fixes claim: no test sees the worker path, and an arms-flag assertion cannot fail",
  "location": "test/shots.js (tool waits); test/test.js \"the chart's own figures …\" and \"each headline limit's score …\"",
  "evidence": "- **Worker.** shots.js waits only for results rows and the duo.jpg validation. With a worker script that throws on load, or Worker undefined, the page falls back to the main thread and shows the same score, \"Score 26 (24–28)\" (code/fallback.js). A broken worker therefore passes CI, although the F5 fix is 'measuring runs in a Web Worker'.\n- **Arms flag.** `assert.strictEqual(c.arms, c.rest_deg >= L.arms.angle_deg)` compares the fresh run's flag with the fresh run's own rest angle. compute_limits defines arms as exactly rest >= angle, so this can fail only through the 0.1° rounding of rest_deg.\n- **Thighs and face flags** are never checked against Fig.thighContact or Fig.elbowFlexion.\n- **Face limit.** The 'headline limit … tool's reading' test re-measures only arms and thighs, so the face reading (arms at 92°, not found; see C2-1) is untested.",
  "expected": "Each test should be able to fail on the defect its name describes.",
  "fix": "- In shots.js, record Worker construction and a message from it with an init script, and fail if the tool fell back.\n- Recompute the thighs and face flags from the figure in the test.\n- Add the face item to the re-measure test, with an assertion that the arms were found."
 },
 {
  "id": "C2-9",
  "severity": "minor",
  "title": "round1.md overstates the per-view crop speed-up",
  "location": "research/reviews/round1.md, code F5: \"Refinement runs on each view's crop: about a third faster\"",
  "evidence": "code/speed.js, measureSheet on a 4490 × 2320 sheet (2,000 px figure, refinement on):\n- 3cd65f5 code: 12.2 s and 11.1 s\n- HEAD: 10.1 s and 9.5 s\n\nThat is about 15% faster. On the turnarounds (code/../cmp_refine.js): Rex 2.00 s before, 2.07 s after; Ollie 2.01 s before, 1.68 s after.",
  "expected": "The review record should state what was measured.",
  "fix": "Change it to 'about 15% faster on a 2,000 px sheet, little change on the 800 px turnarounds', or measure again and quote the numbers."
 }
]
```

</details>

**Claude · 2026-10-11 07:26:00 UTC**

Round 2 is running in the background (8 agents). Meanwhile: republish the live page with the round 1 fixes, update STATUS.md, and prepare the pull request.


- `Bash` Read STATUS.md and look for a PR template: `cat STATUS.md && ls .github/ && ls .github/*TEMPLATE* docs 2>/dev/null; find . -iname "*pull_request_template*" -not -path "./node_modules/*" 2>/dev/null | head`
- `Bash` Update STATUS.md with round 1 progress: `python3 - <<'EOF'` (+16 lines)
- `Artifact` publish https://claude.ai/artifact/DBtZrixDeZnvRwDhZMsCDn /home/user/rex-strength-lab/build-comparison/dist/index.html

**Claude · 2026-10-11 07:26:18 UTC**

Republished (version 2) at the same URL. Committing STATUS.md, then opening the pull request.


- `Bash` Commit STATUS and check branch versus main: `git add STATUS.md && git commit -q -m "STATUS: review round 1 done, round 2 in progress, page republished` (+3 lines)


> **Commit** `a66d4d4` · 2026-10-11 07:26:21 UTC · STATUS: review round 1 done, round 2 in progress, page republished  [rex-strength-lab]


- `ToolSearch` select:mcp__github__create_pull_request,mcp__github__list_pull_requests
- `mcp__github__list_pull_requests` {"owner": "roscoerackham", "repo": "rex-strength-lab", "state": "all", "fields": ["number", "title", "state", "head", "html_url"], "perPage": 10}
- `mcp__github__create_pull_request` {"owner": "RoscoeRackham", "repo": "rex-strength-lab", "title": "Build Comparison, Step 1: research, page, measuring tool, limits, two review rounds", "head": "claude/hopeful-keller-vly1s9", "base"...

**Claude · 2026-10-11 07:26:58 UTC**

PR opened: https://github.com/RoscoeRackham/rex-strength-lab/pull/5. While round 2 runs, checking CI on it.


- `ToolSearch` select:mcp__github__actions_list,mcp__github__pull_request_read,mcp__github__get_job_logs
- `mcp__github__pull_request_read` {"method": "get_check_runs", "owner": "RoscoeRackham", "repo": "rex-strength-lab", "pullNumber": 5}

**Claude · 2026-10-11 07:27:06 UTC**

CI is running on the PR. Meanwhile, a dry run of the history builder into the scratchpad to make sure it works before the final run.


- `Bash` Dry-run the history builder to a scratch folder: `timeout 600 python3 history/tools/build_history_step1.py --out /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/hist...`
- `Bash` Inspect the dry-run history output size: `cd /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/histtest && du -sh . scratchpad transcript transcript.jsonl && d...`
- `Bash` Find what makes the review scratch folders large: `cd /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/histtest/scratchpad && find review1 review2 -type f | sed 's/.*\...`
- `Bash` Show which review subfolders hold the files: `cd /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/histtest/scratchpad && find review1 review2 -type f | awk -F/ '{...`

**Claude · 2026-10-11 07:27:50 UTC**

The reviewers' repo snapshots (including the existing `history/` folder) would be copied into the new entry, about 28 MB. Adding a skip rule for repo copies, and a phase for round 2.


- `Bash` Skip repo snapshots; split the review phases: `python3 - <<'EOF'` (+32 lines)
- `Bash` Check how phase starts are resolved: `grep -n "after_commit\|'start'\|== 'workflow'\|how\[0\]" history/tools/build_history.py | head -12`
- `Bash` Read the phase start resolution code: `sed -n 555,590p history/tools/build_history.py`
- `Bash` Rerun the history dry run and check sizes: `rm -rf /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/histtest && timeout 600 python3 history/tools/build_history_...`

**Claude · 2026-10-11 07:28:16 UTC**

History dry run is now about 5 MB in total with four phases. Committing the builder change and checking CI.


- `Bash` Commit the history builder update: `git add history/tools/build_history_step1.py && git commit -q -m "History builder (Step 1 session): skip the reviewers' repo snapshots; a phase for review ro...` (+3 lines)


> **Commit** `1f32e2c` · 2026-10-11 07:28:20 UTC · History builder (Step 1 session): skip the reviewers' repo snapshots; a phase for review round 2  [rex-strength-lab]


- `mcp__github__pull_request_read` {"method": "get_check_runs", "owner": "RoscoeRackham", "repo": "rex-strength-lab", "pullNumber": 5}

**Claude · 2026-10-11 07:28:33 UTC**

CI is still running on the earlier head; the newest push will start a new run. While waiting, running the Build Calculator's tests, since its data is shared.


- `Bash` Run the Build Calculator build and tests: `cd /home/user/rex-strength-lab/build-calculator && node build.js | tail -1 && node test/test.js 2>&1 | tail -2 && timeout 600 node test/shots.js 2>&1 | tail ...`
- `ToolSearch` select:TaskUpdate
- `TaskUpdate` #5 status=completed
- `TaskUpdate` #7 status=in_progress

**Claude · 2026-10-11 07:29:22 UTC**

Round 1 is done and the round 1 fixes are live: the page is republished at the same URL. The pull request is open, but nothing is merged and Step 1 isn't finished yet. Review round 2, which re-checks every round 1 fix and looks for regressions, is still running in the background.

**What round 1 changed**
- **Limits:** the three limit scores are now the measuring tool's reading of the widened drawings, not a scaling rule. Arms forced out is about 41 (it was 42), thighs touching is about 46 (it was 49), and hands to face is 87 to 200 (it was 86 to 230).
- **Figures:** the same limit tests now run on every figure on the chart. Each figure is drawn with its arms just past where its outline lets them hang. Drawn from their own girths, the top bodybuilders already meet the first two tests, and the page now says so. The comic giants' arms come out nearly level.
- **Target tool:** it now lands within 0.2% of the target anywhere from 15 to 900. It refuses any outline its own checks would reject.
- **Sources and wording:** I fixed the source attributions, mislabelled numbers and overstated sentences the reviewers confirmed. The full list is in `build-comparison/research/reviews/round1.md`.
- **Measuring tool:** it now refuses a sheet that has a back view where the side view should be, and skull rows outside the head. It runs in the background, so a large sheet no longer freezes the page.
- **Accessibility:** focus outlines, screen-reader labels, the details panel at tablet widths, and contrast on the chart marks.

The reviewers found 76 issues and the checkers confirmed 69. Three are only partly fixed:
- **Contrast:** the light-mode gold for natural athletes is still too faint on the background. A darker gold would look the same as the bodybuilders' orange to red-green colour-blind readers, so this needs your palette decision.
- **Large sheets:** a 2,000 px sheet still takes about 10 seconds to measure. The page stays usable while it runs.
- **Tool start-up:** when you reach the measuring section, the target outline and the duo.jpg check still pause the page for about 1 to 2 seconds.

**Tests:** all model, browser and duo.jpg tests pass locally, and the Build Calculator's tests still pass. CI on the pull request hadn't finished when I last checked.

**Still to do:** fix what round 2 confirms, republish, then write the `history/` entry. A dry run of the history builder works and comes to about 5 MB.

**For you:** eight design decisions are listed in the pull request and in `build-comparison/data/NOTES.md`. Two are new from this round: the colour contrast above, and drawing arms at each figure's rest angle.

Should I watch the pull request, fix CI failures and answer review comments as they come in?

Pull request: https://github.com/RoscoeRackham/rex-strength-lab/pull/5
Live page: https://claude.ai/artifact/DBtZrixDeZnvRwDhZMsCDn


*Woken · 2026-10-11 08:58:59 UTC · Background task womj2qogm completed: Dynamic workflow "Review round 2 of the Build Comparison page: check every round 1 fix, and look for regressions in the changed code, then a skeptic per lens reproduces or refutes each finding" completed. Next: Review round 2 has finished. Extracting the findings and verdicts.*

**Claude · 2026-10-11 08:59:02 UTC**

Review round 2 has finished. Extracting the findings and verdicts.


- `Bash` List round 2 findings and verdicts: `cd /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2 && python3 -c "` (+10 lines)

**Claude · 2026-10-11 08:59:09 UTC**

Round 2: 40 findings, all confirmed. The main one is that the measuring tool misreads near-level arms (the giants' new pose) as torso, which skews several numbers. Reading the major findings in full.


- `Bash` Read the arm-reading findings in full: `cd /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2 && python3 -c "` (+9 lines)
- `Bash` Read frontLandmarks arm detection: `cd /home/user/rex-strength-lab/build-comparison && grep -n "function frontLandmarks" src/measure.js && sed -n "$(grep -n 'function frontLandmarks' src/measur...`
- `Bash` Read the arm-following code and arm volume use: `sed -n "$(( $(grep -n 'function frontLandmarks' src/measure.js | cut -d: -f1)+76 )),+40p" src/measure.js && grep -n "vol.arms\|F.arms\|arms\[" src/measure.js...`

**Claude · 2026-10-11 09:01:09 UTC**

The fixes touch the tool, the limits and the copy, so first I'm reading the remaining findings' details: M2, M3, m1, m2, m4, the fix-check items, and UX2-3, UX2-6 and C2-8.


- `Bash` Read the remaining round 2 findings: `cd /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2 && python3 -c "` (+9 lines)
- `Bash` Inspect figure parts and arm station data: `cd /home/user/rex-strength-lab/build-comparison && grep -n "armStations" src/figure.js | head -5 && node -e "` (+7 lines)
- `Bash` Read arm station and hand construction: `sed -n 225,240p src/figure.js && grep -n "hand" src/figure.js | head -12`
- `Bash` Add analytic arm volume; compare with the tool: `python3 - <<'EOF'` (+52 lines)
- `Bash` Follow arms by length along their axis: `python3 - <<'EOF'` (+25 lines)
- `Bash` Add the arms-followed check; compare tool and analytic readings: `python3 - <<'EOF'` (+26 lines)
- `Bash` Read the steep-fit fact and girth status structure: `python3 -c "` (+8 lines)
- `Bash` Read the page's drawing check: `grep -n "function drawingCheck" -A 16 src/app.html && grep -n "drawCheck\|drawingCheck(" src/app.html | head`

**Claude · 2026-10-11 09:04:58 UTC**

Now writing the new `compute_limits.js`.


- `Write` /home/user/rex-strength-lab/build-comparison/tools/compute_limits.js
- `Bash` Derive the steep-fit factor and recompute the limits: `python3 - <<'EOF'` (+11 lines)
  - result: Exit code 1
  - result: at Object.&lt;anonymous&gt; (/home/user/rex-strength-lab/build-comparison/tools/compute_limits.js:164:15)
  - result: at Module._compile (node:internal/modules/cjs/loader:1706:14)
- `Bash` Show the compute_limits error: `node tools/compute_limits.js 2>&1 | grep -v "^    at" | tail -8`
- `Bash` Width-based front/back check; robust crotch; recompute limits: `python3 - <<'EOF'` (+36 lines)
- `Bash` Inspect new limits, outline scores and drawing checks: `node -e "` (+5 lines)
- `Bash` Score target outlines as drawn; share drawnVolume: `python3 - <<'EOF'` (+135 lines)

**Claude · 2026-10-11 09:07:45 UTC**

Status: the target tool and CLI now score outlines as drawn. Next: the face card's second model, the solver fixes, then the page.


- `Bash` Fix the solver's failure handling; test drawn-score targets: `python3 - <<'EOF'` (+61 lines)

**Claude · 2026-10-11 09:08:17 UTC**

Targets now converge everywhere tested, including 80, where the old reading jumped. Now the page side, starting with the code those changes touch.


- `Bash` Locate tape jump, locator, lineup text and tool markup: `grep -n "function tapeJump" -A 8 src/app.html | head -12; grep -n "function markStop" -A 14 src/app.html | head -18; grep -n "Everyone is drawn at the same h...`
- `Bash` Find the tape tap handler and lineup intro: `grep -n "_X\b.*click\|addEventListener('click', function (ev)\|pointerdown\|function jumpFromTape\|stopAt(" src/app.html | head; grep -n "\.viewcaps" src/app...`
- `Bash` Read the tape click handler: `sed -n 1722,1734p src/app.html`
- `Bash` Locate the limit text helpers to replace: `grep -n "function metSooner" -A 12 src/app.html && grep -n "heads.forEach(function (L) { var m = metSooner" src/app.html && grep -n "metSooner(L, L.score)" s...`

**Claude · 2026-10-11 09:09:05 UTC**

Writing the page patch: limit text on one basis, the drawing check, the target tool, tool state, and the smaller UX items.


- `Bash` Rewrite limit text, cards and drawing check: `python3 - <<'EOF'` (+84 lines)
- `Bash` Read the drawing check doc comment: `sed -n 1068,1078p src/app.html`

**Claude · 2026-10-11 09:09:33 UTC**

Now the target tool, the example sheet, the tool's run state, and the small UX items.


- `Bash` Rewrite the target tool and the example sheet: `python3 - <<'EOF'` (+77 lines)
- `Bash` Find the exact example sentence: `grep -n "The limits section reads the same shape" src/app.html | cut -c1-400`
- `Bash` Fix the example-sheet sentence: `python3 - <<'EOF'` (+10 lines)
- `Bash` Apply the drawing-check comment and example girths: `python3 - <<'EOF'` (+26 lines)

**Claude · 2026-10-11 09:10:16 UTC**

Now the target-tool rewrite, written to a file first so the patch is clean.


- `Bash` Replace drawTarget with the drawn-score version: `cat > /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/drawtarget.js <<'EOF'` (+57 lines)

**Claude · 2026-10-11 09:10:38 UTC**

Now the tool's run state (UX2-1, UX2-2, C2-6) and the remaining small UX items.


- `Bash` Read the current measure and worker code: `sed -n "$(grep -n '  function measure() {' src/app.html | cut -d: -f1),+52p" src/app.html`
- `Bash` Tool run state, live regions, and small UX fixes: `cat > /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/measure_page.js <<'EOF'` (+113 lines)
- `Bash` Fix settings wording; check Rex's tail entry: `python3 - <<'EOF'` (+19 lines)
- `Bash` Confirm Rex's tail volume from the checker results: `cd /home/user/rex-strength-lab && grep -o '"tail[^,]*' history/scratchpad/mass/checker/results_checker.json | head -5; python3 -c "print(0.2894122456*1060)"`
- `Bash` Set Rex's tail to 307 kg in settings and tests: `cd /home/user/rex-strength-lab/build-comparison && python3 - <<'EOF'` (+12 lines)
- `Bash` Find the Kouri build name and its uses: `cd /home/user/rex-strength-lab/build-calculator && sed -n 1921,1926p data/builds.json && grep -n '"Gym athletes who never used steroids' data/builds.json tes...`

**Claude · 2026-10-11 09:11:40 UTC**

Status: tool and page fixes are written. Now the data fixes: the Kouri group name (shared `builds.json`, claimed by this branch), and the archive quote picks. Then regenerate and test.


- `Bash` Rename the Kouri group; fix archive quote picks: `cd /home/user/rex-strength-lab && sed -i 's/"name": "Gym athletes who never used steroids (Kouri 1995, n=74)"/"name": "Men who never used steroids (Kouri 199...` (+25 lines)
- `Bash` Pick the Asgard-matter quote; no quote for garbled OCR: `python3 - <<'EOF'` (+17 lines)
- `Bash` Regenerate limits, rebuild and run Node tests: `node tools/compute_limits.js 2>&1 | tail -2 && node build.js | tail -1 && node test/test.js 2>&1 | grep -v "^ok\|S(f=1)"`

**Claude · 2026-10-11 09:13:28 UTC**

Two tests fail as expected: they still assume the old scoring. Rewriting them, plus the new tests round 2 asked for.


- `Bash` Rewrite limit and solver tests; add arm and mirror tests: `python3 - <<'EOF'` (+93 lines)

**Claude · 2026-10-11 09:14:58 UTC**

33 pass. Checking the mirror test isn't vacuous (that the rendered sheets do have a back view).


- `Bash` Check the rendered sheet has a back view: `node -e "` (+2 lines)
- `Bash` Skip the hip ratio when the crotch is hidden; test on turnarounds: `python3 - <<'EOF'` (+24 lines)
  - result: Exit code 1
  - result: node:fs:560
  - result: return binding.open(
- `Bash` Rerun the turnaround side-view check with tails kept: `node -e "` (+6 lines)
- `Bash` Add browser checks; rebuild and run shots: `python3 - <<'EOF'` (+32 lines)

**Claude · 2026-10-11 09:16:38 UTC**

`window.__bc` is undefined, which suggests the page's init threw. Checking the console.


- `Bash` Look for page errors on load: `cd /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/page && node diag.js 1280 900 light "(()=>({bc:!!window.__bc}))(...`
- `Bash` Syntax-check the page's main script: `cd /home/user/rex-strength-lab/build-comparison && python3 - <<'EOF'` (+9 lines)

**Claude · 2026-10-11 09:16:52 UTC**

Unescaped apostrophe in "soldier's". Fixing, and adding a syntax check to the build so this can't slip through again.


- `Bash` Escape the apostrophe; look at build.js end: `python3 - <<'EOF'` (+8 lines)
- `Bash` Rebuild with a parse check; inspect the tool and limit cards: `python3 - <<'EOF'` (+16 lines)
- `Bash` Fix grammar; default target to 60: `cd /home/user/rex-strength-lab/build-comparison && grep -n 'id="tTarget"' src/app.html | cut -c1-300 && python3 - <<'EOF'` (+12 lines)
- `Bash` Rebuild and run the browser tests: `node build.js | tail -1 && timeout 1500 node test/shots.js 2>&1 | grep -v "^shot " | tail -15`

**Claude · 2026-10-11 09:20:11 UTC**

The test looks for "measures X" and the status now says "scores X as drawn". Updating the test.


- `Bash` Match the new target status in shots.js; rerun: `python3 - <<'EOF'` (+9 lines)

**Claude · 2026-10-11 09:21:27 UTC**

All browser checks pass. Now the records: computing the drawing-check spread and arm angles for NOTES from the regenerated data.


- `Bash` Compute the numbers the notes and README quote: `node -e "` (+12 lines)

**Claude · 2026-10-11 09:21:36 UTC**

Updating `data/NOTES.md` and the README with these numbers and the new method.


- `Bash` Locate the lines in NOTES and README to update: `grep -n "The score at a limit is\|86\b\|near 87\|87-200\|band 87\|chart's own figures\*\*\|Drawn volume vs weight\|64-84\|Tails out\|Rex 307\|measuring tool\...`
- `Bash` Update NOTES and README for round 2: `python3 - <<'EOF'` (+34 lines)
- `Bash` Add the tool's arm limits to the README: `python3 - <<'EOF'` (+11 lines)

**Claude · 2026-10-11 09:22:15 UTC**

Now the round 1 record corrections that round 2 asked for (R2-FIX-08, 09, 10), then the round 2 record.


- `Bash` Correct the round 1 record where round 2 found it wrong: `python3 - <<'EOF'` (+11 lines)
- `Bash` Fix the DC-1 sentence; save round 2 results: `python3 - <<'EOF'` (+15 lines)
- `Bash` Rebuild and test the Build Calculator after the name change: `cd /home/user/rex-strength-lab/build-calculator && node build.js | tail -1 && node test/test.js 2>&1 | tail -1 && timeout 600 node test/shots.js 2>&1 | tail ...`

**Claude · 2026-10-11 09:23:24 UTC**

Both projects build and pass. Writing the round 2 record.


- `Write` /home/user/rex-strength-lab/build-comparison/research/reviews/round2.md
- `Bash` Final regenerate, build and Node tests: `cd /home/user/rex-strength-lab/build-comparison && sed -i 's/"By contact geometry, none … By the steep fit, eleven are: …"/"By contact geometry, none … By th...`

**Claude · 2026-10-11 09:25:27 UTC**

All green. One visual check of the limits section (shared card scale) before committing.


- `Bash` Screenshot the limit cards: `cd /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/page && node diag.js 1280 1000 light "(()=>{document.getElementB...`
- `Read` /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/page/lim2.png

**Claude · 2026-10-11 09:25:40 UTC**

The cards share one scale and read correctly. Committing round 2, updating STATUS.md, pushing and republishing.


- `Bash` Commit and push round 2 fixes with STATUS: `python3 - <<'EOF'` (+47 lines)
- `Artifact` publish https://claude.ai/artifact/DBtZrixDeZnvRwDhZMsCDn /home/user/rex-strength-lab/build-comparison/dist/index.html
- `mcp__github__pull_request_read` {"method": "get_check_runs", "owner": "RoscoeRackham", "repo": "rex-strength-lab", "pullNumber": 5}

**Claude · 2026-10-11 09:26:07 UTC**

Republished (version 3). CI passed on the previous head; the newest push starts a new run. Updating the PR description to reflect round 2.


- `ToolSearch` select:mcp__github__update_pull_request
- `mcp__github__update_pull_request` {"owner": "RoscoeRackham", "repo": "rex-strength-lab", "pullNumber": 5, "body": "Step 1 of `build-comparison/BRIEF.md`.\n\n**Live page (private, same URL as the first publish, now version 3 with bo...

**Claude · 2026-10-11 09:26:33 UTC**

PR description updated. Last step: the history entry. First, pulling the round 2 agents' results into the scratchpad's `wfout/`, then building the entry.


- `Bash` Extract all workflow agent results into wfout: `cd /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad && python3 extract.py 2>&1 | tail -12 && ls wfout | wc -l`
- `Bash` Mark the history entry in STATUS and build it: `python3 - <<'EOF'` (+9 lines)
- `Bash` Check the history entry size and scan for secrets: `cd /home/user/rex-strength-lab/history/2026-10-11-build-comparison-step1 && du -sh . && ls && grep -rIl "[redacted]\|@gmail\.com" . | head; grep -rIoE "[A-Za-z...`

**Claude · 2026-10-11 09:27:04 UTC**

The entry is 5.8 MB, with no personal emails or tokens found, and four phases. Checking prompts.md and whether the root README should point at the new entry.


- `Bash` Check prompts.md and history links in the root README: `cd /home/user/rex-strength-lab && head -20 history/2026-10-11-build-comparison-step1/prompts.md && grep -n "history" README.md | head && tail -5 history/2026...`
- `Bash` Read the root README: `cat README.md | head -40`
- `Bash` Read the rest of the root README: `sed -n 13,40p README.md`
- `Bash` Commit the history entry and push: `printf '\nSession histories, rebuilt from the raw logs: ['history/'](history/) (the session that built the first two projects) and ['history/2026-10-11-build...` (+15 lines)

**Claude · 2026-10-11 09:27:25 UTC**

Pushed. Checking CI on the latest head.


- `mcp__github__pull_request_read` {"method": "get_check_runs", "owner": "RoscoeRackham", "repo": "rex-strength-lab", "pullNumber": 5}
- `mcp__github__actions_list` {"method": "list_workflow_runs", "owner": "RoscoeRackham", "repo": "rex-strength-lab", "workflow_runs_filter": {"branch": "claude/hopeful-keller-vly1s9"}, "perPage": 5}

**Claude · 2026-10-11 09:27:31 UTC**

No CI runs yet for the last two pushes. Checking that the PR head has moved to the latest commit.


- `mcp__github__pull_request_read` {"method": "get", "owner": "RoscoeRackham", "repo": "rex-strength-lab", "pullNumber": 5}
- `Bash` Compare main with the branch after the merge: `git fetch -q origin main && git log --oneline -8 origin/main && echo --- && git log --oneline origin/main..HEAD && echo --- && git diff --stat 1f32e2c origin...`
- `Bash` Restart the branch from main and re-apply round 2: `git status --short | head -3; git checkout -q -B claude/hopeful-keller-vly1s9 origin/main && git cherry-pick 1aba173 2>&1 | tail -2 && git log --oneline -3 &...`


> **Commit** `ecc7032` · 2026-10-11 09:28:01 UTC · Build Comparison: review round 2 fixes  [rex-strength-lab]

**Claude · 2026-10-11 09:28:11 UTC**

Branch restarted from `main`, with the round 2 commit re-applied as `ecc7032`. Now STATUS.md and the history builder's wording, to reflect the merge.


- `Bash` Update STATUS and the history builder; rebuild the entry: `python3 - <<'EOF'` (+21 lines)
