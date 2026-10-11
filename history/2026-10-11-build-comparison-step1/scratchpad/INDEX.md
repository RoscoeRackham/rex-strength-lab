# Scratchpad scripts

Working scripts from the session scratchpad that the repository cites (in README files, NOTES.md, fact notes and review records) but does not contain. They were written by Claude and its subagents to reproduce findings, measure the picture, compile data and sweep the pages. Paths inside them point at the session scratchpad and the old project folder (/home/user/dino-strength-sim), so most will not run as-is from here.

Copied: scripts up to 300 KB, plus JSON and text results up to 100 KB in mass/ and bcdata/. Listed but not copied: copies of project code, raw downloads, larger files and binaries (table at the end).

Each folder lists the files whose purpose is known (from the file's own header comment, or a one-liner written for this index); the full file list is collapsed below it. Most of the remaining files are short single-purpose repro scripts named after the finding they test.

## research/

The research agents' scripts (by topic): ANSUR II analyses, fact checks, PDF figure counts, comics full-text searches.

42 files, 69 KB.

- `research/comic-composition/scripts/ftsq.sh`: usage: ftsq.sh &lt;outfile&gt; &lt;query&gt;
- `research/comic-composition/scripts/inside.py`: usage: python3 -I inside.py &lt;identifier&gt; &lt;query&gt; &lt;outdir&gt;
- `research/function-check/scripts/arm_hang_v.py`: Front-view rest abduction angle of a straight arm vs a width factor k (ANSUR II male medians, metres).
- `research/functional-limits/scripts/ansur_armangle.py`: Seated arm abduction angle implied by forearm-forearm breadth (ANSUR II men).
- `research/functional-limits/scripts/ansur_thighgap.py`: Legs-vertical stance: gap between the two thighs just above the knee (ANSUR lower thigh circumference site).
- `research/functional-limits/scripts/arm_hang.py`: Front-view rest abduction angle of a straight arm vs a width factor k (ANSUR II male medians, metres).
- `research/functional-limits/scripts/reach.py`: Planar reach check: can any point of the hand get as close to the shoulder joint (GH) as the mouth is?
- `research/natural-limit/scripts/anchor_conversions.py`: Convert natural-limit anchors to the rescaled index S = 1.8*FFM/H^3.
- `research/natural-limit/scripts/butt_ansur.py`: Butt's max-LBM formula applied to every ANSUR II man (his own stature, wrist, ankle).
- `research/natural-limit/scripts/count_dots.py`: Count the circles in Kouri 1995 Fig. 2 and Fig. 3 (dot-plot histograms).
- `research/natural-limit/scripts/frame_models.py`: Frame-based and rule-based natural-limit predictions, converted to FFMI and to the
- `research/natural-limit/scripts/kouri_t2_S.py`: Kouri 1995 Table 2 normalized FFMI (k = 6.1) converted to S = 1.8*F/H, using each winner's
- `research/natural-limit/scripts/todd_table.py`: Recompute Jan Todd (2008, Iron Game History 10(3)) table of Mr America normalized FFMI.
- `research/outline/scripts/aist_limbs.py`: Limb cross-section shape from the AIST Human Body Dimensions Database 1991-92.
- `research/outline/scripts/ansur_outline.py`: ANSUR II (male) numbers for drawing a body outline.
- `research/outline/scripts/epmc.py`: Query Europe PMC REST API; save raw JSON to outdir; print metadata and abstracts.

<details><summary>All 42 files</summary>

`research/bodyfat/scripts/ansur_bf.py`, `research/bodyfat/scripts/epmc.py`, `research/bodyfat/scripts/tables.py`, `research/comic-composition/scripts/derive.py`, `research/comic-composition/scripts/extract.py`, `research/comic-composition/scripts/fts.py`, `research/comic-composition/scripts/ftsq.sh`, `research/comic-composition/scripts/inside.py`, `research/comic-composition/scripts/wikigrep.py`, `research/comics-check/extract.py`, `research/comics-check/totext.py`, `research/fat-check/scripts/ansur_check.py`, `research/fat-check/scripts/ansur_vs_taylor.py`, `research/fat-check/scripts/x2t.py`, `research/function-check/scripts/arm_hang_v.py`, `research/function-check/scripts/arm_hang_v2.py`, `research/function-check/scripts/h2t.py`, `research/functional-limits/scripts/ansur_armangle.py`, `research/functional-limits/scripts/ansur_limits.py`, `research/functional-limits/scripts/ansur_thighgap.py`, `research/functional-limits/scripts/arm_hang.py`, `research/functional-limits/scripts/elbow_fit.py`, `research/functional-limits/scripts/reach.py`, `research/index_check/scripts/ansur_check.py`, `research/natural-limit-check/scripts/butt_check.py`, `research/natural-limit-check/scripts/count_rows.py`, `research/natural-limit-check/scripts/recheck.py`, `research/natural-limit/scripts/anchor_conversions.py`, `research/natural-limit/scripts/butt_ansur.py`, `research/natural-limit/scripts/count_dots.py`, `research/natural-limit/scripts/frame_models.py`, `research/natural-limit/scripts/h2t.py`, `research/natural-limit/scripts/kouri_t2_S.py`, `research/natural-limit/scripts/santos_t4.py`, `research/natural-limit/scripts/santos_t5.py`, `research/natural-limit/scripts/todd_table.py`, `research/outline/scripts/aist_limbs.py`, `research/outline/scripts/ansur_outline.py`, `research/outline/scripts/epmc.py`, `research/outline_check/scripts/recheck.py`, `research/size_index/scripts/ansur_index_vs_height.py`, `research/size_index/scripts/derived.py`

</details>

## design/

The design agents' mockups and the judges' measurement scripts (reader/, lineup/, instrument/, phonereview/, critic-honest/, final/).

28 files, 78 KB.

- `design/instrument/work/export.js`: Mock data for the design mockup only. Heights, weights and girths come from builds.json;
- `design/instrument/work/trace.py`: Mock-grade tracer: turnaround -&gt; flat silhouette paths (front + side), tails split off.
- `design/lineup/validate_palette.js`: Validate a categorical chart palette against the computable data-viz checks.
- `design/lineup/vp.mjs`: Validate a categorical chart palette against the computable data-viz checks.
- `design/reader/gen.js`: Generates mock figure geometry + mock scores for the design mockup. Scratch only.

<details><summary>All 28 files</summary>

`design/final/contrast.py`, `design/final/search.mjs`, `design/instrument/work/dbg.js`, `design/instrument/work/export.js`, `design/instrument/work/gen.js`, `design/instrument/work/mask.py`, `design/instrument/work/modes.js`, `design/instrument/work/shots.js`, `design/instrument/work/slice.py`, `design/instrument/work/trace.py`, `design/lineup/build.js`, `design/lineup/search.mjs`, `design/lineup/search2.mjs`, `design/lineup/shot.js`, `design/lineup/trace.py`, `design/lineup/validate_palette.js`, `design/lineup/vp.mjs`, `design/phonereview/dbg.js`, `design/phonereview/dbg2.js`, `design/phonereview/fonts.js`, `design/phonereview/modes.js`, `design/phonereview/scroll.js`, `design/reader/build.js`, `design/reader/gen.js`, `design/reader/overflow.js`, `design/reader/shots.js`, `design/reader/shots2.js`, `design/reader/zoom.js`

</details>

## review1/

Review round 1: the reviewers' and verifiers' repro scripts.

117 files, 213 KB.

- `review1/armdeg.js`: Same target shape (median soldier, widths x f), measured with the arms at 20 deg (tools/export_targets.js
- `review1/claims/mybuild.js`: Builds dist/index.html: src/app.html with the data and the scripts inlined.
- `review1/copy_stale.js`: Measure the example at 1.80 m, then change the height field without measuring again, and copy.
- `review1/details.js`: innerText skips the contents of closed &lt;details&gt;. How much text does the shots audit never see?
- `review1/frontback.js`: A sheet with front and back views only (no side view): the default order front, side, back
- `review1/fuzz.js`: Simple shapes as sheet views: does measureSheet ever return NaN/Infinity/negative numbers?
- `review1/harness.js`: Shared Playwright harness: loads build-comparison/dist/index.html in the artifact-like skeleton.
- `review1/limits_stale.js`: Re-runs exactly the limits.json assertion from test/test.js against a settings.json whose
- `review1/mybuild.js`: Builds dist/index.html: src/app.html with the data and the scripts inlined.
- `review1/odd_ui.js`: Loads each odd sheet through the page's own file input, types a height, presses Measure,
- `review1/parity.js`: The page (slimmed builds.json, browser) and Node (full builds.json) give the same scores and gaps.
- `review1/perf.js`: Timing: first render, the measuring tool's example, the duo.jpg validation, the target outline.
- `review1/probe.js`: Usage: node probe.js &lt;versionDir&gt; &lt;outJson&gt;
- `review1/target.js`: Target outline: does the drawn shape measure the score asked for, across the allowed 15-900?
- `review1/target_node.js`: The page's drawTarget in Node: why does the outline miss the target, and does iterating at the final size fix it?
- `review1/throttle.js`: Load at 390 px with the CPU slowed 4x (Chrome DevTools' mid-range phone setting): long tasks on load.
- `review1/v/h.js`: shared harness for my independent verification
- `review1/verify/f4.js`: The page's drawTarget(), line for line, in Node.

<details><summary>All 117 files</summary>

`review1/aria.js`, `review1/armdeg.js`, `review1/axisedge.js`, `review1/build_redirect.js`, `review1/claims/glance.js`, `review1/claims/mybuild.js`, `review1/claims/render.js`, `review1/clipfig.js`, `review1/closeup.js`, `review1/closevis.js`, `review1/clusters.js`, `review1/contrast.js`, `review1/copy_stale.js`, `review1/dcv/bc.js`, `review1/dcv/chip.js`, `review1/details.js`, `review1/drawcheck_node.js`, `review1/drawer768.js`, `review1/drawers.js`, `review1/drawers2.js`, `review1/drawers3.js`, `review1/drawvol.js`, `review1/dump.js`, `review1/elshots.js`, `review1/elshots2.js`, `review1/f21.js`, `review1/fcp.js`, `review1/figcontrast.js`, `review1/firstscreen.js`, `review1/fpbg.js`, `review1/frontback.js`, `review1/fuzz.js`, `review1/gaptext.js`, `review1/gutter.js`, `review1/harness.js`, `review1/heights.js`, `review1/keyboard.js`, `review1/lib.js`, `review1/limits_check2.js`, `review1/limits_f2.js`, `review1/limits_stale.js`, `review1/matrix.js`, `review1/mybuild.js`, `review1/odd_ui.js`, `review1/parity.js`, `review1/parts.js`, `review1/perf.js`, `review1/picker.js`, `review1/plates.js`, `review1/probe.js`, `review1/probe2.js`, `review1/probe3.js`, `review1/prof.js`, `review1/render.js`, `review1/repro_drawer.js`, `review1/scores.js`, `review1/segfocus.js`, `review1/srcs.js`, `review1/storage.js`, `review1/synth.js`, `review1/synth_mod.js`, `review1/tapejump.js`, `review1/target.js`, `review1/target_node.js`, `review1/theme.js`, `review1/throttle.js`, `review1/toolval.js`, `review1/v/f1.js`, `review1/v/f1b.js`, `review1/v/f2.js`, `review1/v/f3.js`, `review1/v/f3b.js`, `review1/v/f3c.js`, `review1/v/f4.js`, `review1/v/f5.js`, `review1/v/f6.js`, `review1/v/f7.js`, `review1/v/f7fix.js`, `review1/v/fixes.js`, `review1/v/h.js`, `review1/v/l1.js`, `review1/v/l10.js`, `review1/v/l10b.js`, `review1/v/l11.js`, `review1/v/l12.js`, `review1/v/l13.js`, `review1/v/l14.js`, `review1/v/l15.js`, `review1/v/l16.js`, `review1/v/l17.js`, `review1/v/l2.js`, `review1/v/l2b.js`, `review1/v/l2dbg.js`, `review1/v/l3.js`, `review1/v/l4.js`, `review1/v/l5.js`, `review1/v/l6.js`, `review1/v/l6b.js`, `review1/v/l6c.js`, `review1/v/l7.js`, `review1/v/l8.js`, `review1/v/l8b.js`, `review1/v/l9.js`, `review1/v/page.js`, `review1/v/page2.js`, `review1/v/shot_cole.js`, `review1/vals.js`, `review1/verify/f12_f10.js`, `review1/verify/f13.js`, `review1/verify/f2.js`, `review1/verify/f3.js`, `review1/verify/f4.js`, `review1/verify/f5.js`, `review1/verify/f5t.js`, `review1/verify/f7.js`, `review1/verify/make_odd.js`, `review1/verify/ui.js`

</details>

## review2/

Review round 2: the reviewers' and verifiers' repro scripts.

118 files, 300 KB.

- `review2/arm_overlap.js`: For every chart figure drawn as the page draws it (arms at max(20, rest + 2)), the area where the
- `review2/cmp_refine.js`: Compare the old whole-sheet refinement (3cd65f5) with the new per-view crops (HEAD) on duo.jpg, the turnarounds and the page's example sheet.
- `review2/code/disc.js`: Score vs width factor near the p50 target-80 solution: rest angle and measured score at 300 and 1,000 px.
- `review2/code/drawcheck.js`: The page's "Drawing check" (drawingCheck in app.html) for every chart figure: are the arms found,
- `review2/code/drawcheck2.js`: Cleaner check: tool volume of the drawn figure vs (tool volume without arms) + arms sliced across their own axis (sliceRotated, round).
- `review2/code/drawcheck3.js`: Tool volume of the drawn figure (as the page's drawing check measures it) vs the tool's volume of the
- `review2/code/example_gap.js`: Why does the page's example (25.7) differ from the limits' reading of the same shape (27.3)?
- `review2/code/face_arms.js`: The limit readings in compute_limits.js: arms drawn at max(35, rest + 2). Are the arms found on each limit sheet?
- `review2/code/fallback.js`: Worker blocked by CSP (worker-src 'none'), and a worker script that fails to load: does the tool fall back?
- `review2/code/mirror_scan.js`: Sheets whose back view is the exact mirror of the front: how often does "front and back landmarks line up" fail?
- `review2/code/page_target.js`: The page's drawTarget, run in Node with the same modules: solve at 300 px, then up to two sqrt steps at 1,000 px.
- `review2/code/race_fields.js`: Change the height field while a measurement is running, then copy.
- `review2/code/slice_old.js`: Does the sliceRotated regression test fail on the old (3cd65f5) code?
- `review2/code/target_time.js`: How long the target drawing blocks the page (it runs on the main thread).
- `review2/code/two_quick.js`: Start measuring a big sheet, then press "Soldier sheet" at once: what does the status show, and when does the soldier result come?
- `review2/code/waist.js`: Waist row and girth from detection (no guide lines) vs the build's own waist, on sheets drawn from data.
- `review2/drawcheck.js`: Replicates the page's drawingCheck (details panel) for every chart figure, and compares the
- `review2/face_arms.js`: The face-limit shapes have their arms drawn at 92 degrees (rest angle 90 = cannot clear). How does
- `review2/harness.js`: Shared Playwright harness: wraps dist/index.html like the artifact host and opens it.
- `review2/jump.js`: Score of the median-soldier target drawing against the width factor, near where the tool stops finding the arms.
- `review2/limits_indep.js`: Independent recomputation of the median soldier's limits.
- `review2/limits_ok.js`: Are the sheets compute_limits.js reads (800 px) accepted by the tool's own checks?
- `review2/measure-old.js`: Measuring tool: measures a character from an A-pose model sheet (front, side and back views at
- `review2/metby_basis.js`: The limits are scored from the drawn shape (tool reading, 1,060 kg/m^3, 7.5% fat); "met sooner"
- `review2/mirror.js`: The target tool draws the back view as the exact mirror of the front, yet some full-size sheets
- `review2/mirror2.js`: Why does an exact mirror fail the front/back check? Inspect the waist width profile and the crotch scan.
- `review2/mk_sheets.js`: A large valid sheet (the 95th percentile soldier, 2,000 px figure) and a small different one.
- `review2/race_load.js`: Load a new sheet while an earlier measurement is still running.
- `review2/render.js`: Render dist/index.html and run a callback; usage: node render.js &lt;out.json&gt; [width]
- `review2/s/codecheck.js`: Code F2 (front+back), F3 (skull rows), F9 (messages) in Node.
- `review2/s/drawers.js`: Open every figure's details and save its text.
- `review2/s/emptyboxes.js`: What the target area shows from the moment the tool starts until the first outline is drawn.
- `review2/s/f21.js`: Claims F21: tool example (median soldier "at 1.80 m") vs limits card score_at_f1.
- `review2/s/facearms.js`: How much of the face-limit reading is arm pixels read at torso depth?
- `review2/s/figs.js`: One drawing height across all stops, both Figures modes and both views; no clipping; overflow.
- `review2/s/h.js`: Shared harness: load the built page in Chromium like test/shots.js does.
- `review2/s/l8.js`: L8: tapping the 924 ring on the glance tape and the locator; records which stop jump() targets.
- `review2/s/measure_old.js`: Measuring tool: measures a character from an A-pose model sheet (front, side and back views at
- `review2/s/mksheets.js`: Make two test sheets with the page's own drawing code: a large Coleman sheet and a small soldier sheet.
- `review2/s/race.js`: A measurement still running in the worker when a new sheet is loaded.
- `review2/s/refine.js`: Code F5: per-view refinement vs whole-sheet refinement (old measure.js), same inputs.
- `review2/s/refine_browser.js`: Time old (whole-sheet) vs new (per-view) refinement in Chromium on the 2,000 px sheet.
- `review2/s/stale.js`: Fields edited while the worker is still measuring: are the results then marked stale?
- `review2/s/tool.js`: Code F10 (lazy start, main-thread time), model F3 / code F4 (target tool), code F8 (copy), L15 (sheet picker).
- `review2/s/ux1.js`: L2 drawers at tablet widths, L3 aria labels, L9 hidden drawer, L12 focus return.
- `review2/s/ux2.js`: L4 (Kouri label overlap), L5 (value cells' ground), L6 (plate overflow), L11 (1,000 label), one drawing height per figure.
- `review2/s/worker.js`: Code F5 (worker), F8 (copy after edits), F9 (alpha sheets), F3 (skull rows in the page), L15 (picker), F2 (front+back) in the page.
- `review2/sideview_tail.js`: The side-view check on the real turnarounds, with and without their tails excluded (the page's
- `review2/sideview_tail2.js`: Rex as a Step 2 sheet would be: no tail over the legs in the front and back views (spec fix),
- `review2/skullrow_aa.js`: Skull-row validation on an anti-aliased sheet (a 4x render box-filtered down, as a drawing program
- `review2/solve_scan.js`: Scan Figure.solveTarget over the page's template shapes and a range of targets, as the page does (300 px).
- `review2/target_sweep.js`: Replicates the page's drawTarget() (src/app.html) in Node for every base shape and many targets.
- `review2/target_sweep2.js`: Replicates the page's drawTarget() (src/app.html) in Node for every base shape and many targets.
- `review2/target_true.js`: For target outlines the page offers (median soldier), the tool's reading vs the drawn body with its
- `review2/worker_same.js`: Worker result vs main-thread Measure.measureSheet on the same posted image and options.
- `review2/worker_test.js`: Is the Web Worker actually used, and does it give the same numbers as the main thread?

<details><summary>All 118 files</summary>

`review2/arm_overlap.js`, `review2/cards.js`, `review2/cmp_refine.js`, `review2/code/disc.js`, `review2/code/disc_parts.js`, `review2/code/drawcheck.js`, `review2/code/drawcheck2.js`, `review2/code/drawcheck3.js`, `review2/code/drawer_check.js`, `review2/code/example_gap.js`, `review2/code/example_text.js`, `review2/code/face_arms.js`, `review2/code/face_fig.js`, `review2/code/fallback.js`, `review2/code/mirror_scan.js`, `review2/code/page_target.js`, `review2/code/page_target_pw.js`, `review2/code/page_target_pw80.js`, `review2/code/race_fields.js`, `review2/code/slice_old.js`, `review2/code/speed.js`, `review2/code/target_time.js`, `review2/code/turn_checks.js`, `review2/code/two_quick.js`, `review2/code/waist.js`, `review2/drawcheck.js`, `review2/drawer_check.js`, `review2/dump_text.js`, `review2/face_arms.js`, `review2/facelow.js`, `review2/facelow2.js`, `review2/facelow3.js`, `review2/gaps.js`, `review2/harness.js`, `review2/jump.js`, `review2/limits_indep.js`, `review2/limits_ok.js`, `review2/measure-old.js`, `review2/metby_basis.js`, `review2/mirror.js`, `review2/mirror2.js`, `review2/mk_sheets.js`, `review2/page_targets.js`, `review2/race_load.js`, `review2/render.js`, `review2/s/armsall.js`, `review2/s/ax.js`, `review2/s/caps.js`, `review2/s/codecheck.js`, `review2/s/dc14.js`, `review2/s/drawer.js`, `review2/s/drawerfocus.js`, `review2/s/drawers.js`, `review2/s/drawertime.js`, `review2/s/early.js`, `review2/s/emptyboxes.js`, `review2/s/f21.js`, `review2/s/facearms.js`, `review2/s/figs.js`, `review2/s/focus.js`, `review2/s/focus.py`, `review2/s/focus2.js`, `review2/s/focus3.js`, `review2/s/forest.js`, `review2/s/gaptiles.js`, `review2/s/h.js`, `review2/s/jumps.js`, `review2/s/l16.js`, `review2/s/l8.js`, `review2/s/lazy.js`, `review2/s/lib.js`, `review2/s/limits.js`, `review2/s/loclabel.js`, `review2/s/measure_old.js`, `review2/s/misc.js`, `review2/s/mksheets.js`, `review2/s/prof.js`, `review2/s/race.js`, `review2/s/realverdict.js`, `review2/s/refine.js`, `review2/s/refine_browser.js`, `review2/s/stale.js`, `review2/s/stopshots.js`, `review2/s/target.js`, `review2/s/text.js`, `review2/s/tfail.js`, `review2/s/tool.js`, `review2/s/toollayout.js`, `review2/s/ux1.js`, `review2/s/ux2.js`, `review2/s/worker.js`, `review2/s/workerfb.js`, `review2/sideview_tail.js`, `review2/sideview_tail2.js`, `review2/skullrow_aa.js`, `review2/solve_scan.js`, `review2/solve_trace.js`, `review2/target_copy.js`, `review2/target_sweep.js`, `review2/target_sweep2.js`, `review2/target_true.js`, `review2/v/ax.js`, `review2/v/caps.js`, `review2/v/counts.js`, `review2/v/empty.js`, `review2/v/empty2.js`, `review2/v/empty3.js`, `review2/v/h.js`, `review2/v/limfig.js`, `review2/v/loc.js`, `review2/v/mk.js`, `review2/v/race.js`, `review2/v/realv.js`, `review2/v/stale.js`, `review2/v/text.js`, `review2/warn100.js`, `review2/worker_same.js`, `review2/worker_test.js`

</details>

## page/

Page render helpers used throughout: shot.js and diag.js render dist/index.html and run a snippet.

2 files, 4 KB.

- `page/diag.js`: Open the built page at a size and run a snippet; prints JSON.

<details><summary>All 2 files</summary>

`page/diag.js`, `page/shot.js`

</details>

## duo/

duo.jpg segmentation and front-only validation probes before test/duo.js.

1 files, 1 KB.


<details><summary>All 1 files</summary>

`duo/val.js`

</details>

## fig/

Silhouette previews before src/figure.js settled.

1 files, 2 KB.


<details><summary>All 1 files</summary>

`fig/preview.js`

</details>

## wfout/

Each workflow agent's structured result, extracted from the logs by extract.py (research, verifiers, design proposals, judges, synthesis).

37 files, 1048 KB.


<details><summary>All 37 files</summary>

`wfout/design_instrument.json`, `wfout/design_lineup.json`, `wfout/design_reader.json`, `wfout/design_synthesis.json`, `wfout/judge_critic.json`, `wfout/judge_reader.json`, `wfout/research_comics.json`, `wfout/research_fat.json`, `wfout/research_function.json`, `wfout/research_index.json`, `wfout/research_natural.json`, `wfout/research_outline.json`, `wfout/review2_code.json`, `wfout/review2_fixcheck.json`, `wfout/review2_modelclaims.json`, `wfout/review2_ux.json`, `wfout/review_claims.json`, `wfout/review_code.json`, `wfout/review_data.json`, `wfout/review_model.json`, `wfout/review_ux.json`, `wfout/synthesis.txt`, `wfout/verify2_code.json`, `wfout/verify2_fixcheck.json`, `wfout/verify2_modelclaims.json`, `wfout/verify2_ux.json`, `wfout/verify_claims.json`, `wfout/verify_code.json`, `wfout/verify_comics.json`, `wfout/verify_data.json`, `wfout/verify_fat.json`, `wfout/verify_function.json`, `wfout/verify_index.json`, `wfout/verify_model.json`, `wfout/verify_natural.json`, `wfout/verify_outline.json`, `wfout/verify_ux.json`

</details>

## Top level

One-off scripts at the top of the scratchpad.

8 files, 12 KB.

- `volcheck.js`: Drawn figure volume x body density (Siri, from the build's working fat) vs the build's weight.

<details><summary>All 8 files</summary>

`extract.py`, `elbow.js`, `limits.js`, `limits2.js`, `segtest.js`, `sheettest.js`, `synth.js`, `volcheck.js`

</details>

## workflows/

The workflow orchestration scripts (each Workflow launch). They compute the subagent prompts quoted in the transcript.

4 files, 47 KB.

- `workflows/build-comparison-design-wf_ff7816d2-f41.js`: build-comparison-design: Design the Build Comparison page: three independent proposals with mockups, two judges, one synthesis with the chosen chart style recorded for review
- `workflows/build-comparison-research-wf_94de1f40-a68.js`: build-comparison-research: Research sourced facts for the Build Comparison chart (size-independent index, natural limit, body-fat ranges, comic non-muscle mass, functional limits, body outlines), then adversarially verify each topic
- `workflows/build-comparison-review-r1-wf_8b48fe3b-227.js`: build-comparison-review-r1: Adversarial review round 1 of the Build Comparison page: five lenses find defects, then one skeptic per lens reproduces or refutes every finding
- `workflows/build-comparison-review-r2-wf_9bab17b6-d0f.js`: build-comparison-review-r2: Review round 2 of the Build Comparison page: check every round 1 fix, and look for regressions in the changed code, then a skeptic per lens reproduces or refutes each finding

<details><summary>All 4 files</summary>

`workflows/build-comparison-design-wf_ff7816d2-f41.js`, `workflows/build-comparison-research-wf_94de1f40-a68.js`, `workflows/build-comparison-review-r1-wf_8b48fe3b-227.js`, `workflows/build-comparison-review-r2-wf_9bab17b6-d0f.js`

</details>

## Not copied

Copies of project code are earlier states of engine.js, data.js and the tests, kept for diffing (the patched engine variants in audit/, the catch-base and src-before-armduo baselines, backup/ and old/ trees). The released versions are in the repository.

| Folder | Why | Files | Total size | Main types |
|---|---|---|---|---|
| review1 | copy of project code | 4788 | 439.4 MB | .png, .csv, .json, .html |
| review2 | copy of project code | 4275 | 234.0 MB | .png, .json, .jsonl, .html |
| review1 | binary or output | 404 | 146.8 MB | .png, .pdf, .html, .txt |
| research | binary or output | 489 | 132.2 MB | .pdf, .png, .txt, .xml |
| research | raw download | 391 | 74.1 MB | .pdf, .txt, .json, .html |
| design | binary or output | 276 | 71.6 MB | .png, .jpg, .html, .json |
| review2 | binary or output | 1906 | 52.2 MB | .png, (none), .html, .json |
| page | binary or output | 80 | 35.8 MB | .png, .html, .txt |
| trace | binary or output | 2 | 4.9 MB | .png |
| duo | binary or output | 9 | 2.3 MB | .png |
| design | too large | 1 | 1.1 MB | .js |
| fig | binary or output | 10 | 0.8 MB | .svg, .png |
| targets | binary or output | 4 | 0.2 MB | .png |

Other scratchpad folders that the repository does not cite (earlier probes, backups, page previews) were not copied.
