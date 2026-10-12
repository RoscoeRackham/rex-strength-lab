# Scratchpad scripts

Working scripts from the session scratchpad that the repository cites (in README files, NOTES.md, fact notes and review records) but does not contain. They were written by Claude and its subagents to reproduce findings, measure the picture, compile data and sweep the pages. Paths inside them point at the session scratchpad and the repository at /home/user/rex-strength-lab, so most will not run as-is from here.

Copied: scripts up to 300 KB, plus the workflows' extracted results (JSON and text up to 400 KB) in wfout/. Listed but not copied: copies of project code, raw downloads, larger files and binaries (table at the end).

Each folder lists the files whose purpose is known (from the file's own header comment, or a one-liner written for this index); the full file list is collapsed below it. Most of the remaining files are short single-purpose repro scripts named after the finding they test.

## research/

The research agents' scripts (by topic). Downloads (papers, standards, pages) are listed, not copied.

69 files, 364 KB.

- `research/attenuation/scripts/lamb_check.py`: Compare (a) Pekeris-type closed form for step vertical point load (nu=1/4, as recalled)
- `research/attenuation/scripts/lamb_common.py`: Compare (a) Pekeris-type closed form for step vertical point load (nu=1/4, as recalled)
- `research/comic/scripts/derive.py`: Derived numbers for the comic-switch research (topic: comic).
- `research/elephant/scripts/autoframe.py`: Find plot frame and dashed gridlines in a seismogram crop.
- `research/elephant/scripts/digitize.py`: Digitize extreme values of the grey (102,102,102) trace inside a plot frame.
- `research/elephant/scripts/lamb.py`: Sanity check: Rayleigh-wave vertical surface displacement from a vertical harmonic point force
- `research/elephant/scripts/scal.py`: Brightness-weighted dominant frequency of a scalogram crop (log y axis).
- `research/growth-check/scripts/taylor_mine.py`: Independent solution of Taylor's (1946) constant-speed expanding sphere, self-similar. Pure python RK4.
- `research/growth/scripts/piston_hydro.py`: Independent check of the expanding-sphere solution: 1-D spherical Lagrangian hydro with
- `research/growth/scripts/taylor_sphere.py`: Self-similar flow ahead of a sphere expanding at constant speed (Taylor 1946 problem),
- `research/ripple_check/scripts/green.py`: Numerical check of the radiated amplitude from an oscillating meniscus pressure P(x)=rho*A*zm*exp(-|x|/lc)
- `research/step/derive.py`: Derived numbers for the 'step' research topic.
- `research/step/epmc.sh`: usage: epmc.sh "query" -&gt; prints id, title, journal, year, abstract

<details><summary>All 69 files</summary>

`research/attenuation-check/scripts/damp.py`, `research/attenuation-check/scripts/dbg.py`, `research/attenuation-check/scripts/maxcheck.py`, `research/attenuation-check/scripts/maxcheck2.py`, `research/attenuation-check/scripts/model.py`, `research/attenuation-check/scripts/mono.py`, `research/attenuation-check/scripts/pekeris.py`, `research/attenuation-check/scripts/pekeris2.py`, `research/attenuation-check/scripts/pisa_all.py`, `research/attenuation-check/scripts/pisa_far.py`, `research/attenuation-check/scripts/pulse.py`, `research/attenuation-check/scripts/rayleigh.py`, `research/attenuation/scripts/damping.py`, `research/attenuation/scripts/empirical.py`, `research/attenuation/scripts/engine_formula.py`, `research/attenuation/scripts/facts_all.py`, `research/attenuation/scripts/facts_part1.py`, `research/attenuation/scripts/facts_part2.py`, `research/attenuation/scripts/facts_part3.py`, `research/attenuation/scripts/facts_part4.py`, `research/attenuation/scripts/facts_part5.py`, `research/attenuation/scripts/facts_part6.py`, `research/attenuation/scripts/farfield.py`, `research/attenuation/scripts/fit.py`, `research/attenuation/scripts/lamb_check.py`, `research/attenuation/scripts/lamb_check2.py`, `research/attenuation/scripts/lamb_common.py`, `research/attenuation/scripts/model.py`, `research/attenuation/scripts/ppv_table.py`, `research/attenuation/scripts/rayleigh.py`, `research/attenuation/scripts/rex_examples.py`, `research/comic-check/scripts/recompute.py`, `research/comic/scripts/derive.py`, `research/elephant-check/scripts/derive_check.py`, `research/elephant-check/scripts/dig.py`, `research/elephant-check/scripts/dig2.py`, `research/elephant-check/scripts/dig3.py`, `research/elephant-check/scripts/lamb_check.py`, `research/elephant-check/scripts/scal.py`, `research/elephant/scripts/autoframe.py`, `research/elephant/scripts/derive.py`, `research/elephant/scripts/digitize.py`, `research/elephant/scripts/lamb.py`, `research/elephant/scripts/scal.py`, `research/growth-check/scripts/anchor_check.py`, `research/growth-check/scripts/check_all.py`, `research/growth-check/scripts/gr_check.py`, `research/growth-check/scripts/taylor_mine.py`, `research/growth/scripts/growth_calc.py`, `research/growth/scripts/hydro_check.py`, `research/growth/scripts/kg.py`, `research/growth/scripts/make_facts.py`, `research/growth/scripts/piston_hydro.py`, `research/growth/scripts/taylor_sphere.py`, `research/growth/scripts/worked.py`, `research/ripple_check/scripts/check.py`, `research/ripple_check/scripts/green.py`, `research/ripple_scripts/derive.py`, `research/ripple_scripts/final.py`, `research/step-check/scripts/derive_check.py`, `research/step-check/scripts/fr.py`, `research/step-check/scripts/x2t.py`, `research/step/derive.py`, `research/step/epmc.sh`, `research/step/fukuchi_fr.py`, `research/step/xml2txt.py`, `research/thresholds-check/scripts/recompute.py`, `research/thresholds/scripts/conv.py`, `research/thresholds/scripts/facts.py`

</details>

## compile_att/

Compile agent for the attenuation topic: fit and check scripts.

2 files, 44 KB.


<details><summary>All 2 files</summary>

`compile_att/chk.py`, `compile_att/compile.py`

</details>

## compile_elephant/

Compile agent for the elephant topic: checks.

1 files, 35 KB.

- `compile_elephant/compile.py`: Compile the elephant topic: researcher facts + verifier corrections -&gt; compiled/elephant.json.

<details><summary>All 1 files</summary>

`compile_elephant/compile.py`

</details>

## compile_ripple/

Compile agent for the ripple topic: checks.

2 files, 35 KB.


<details><summary>All 2 files</summary>

`compile_ripple/build.py`, `compile_ripple/check.py`

</details>

## compile_thresholds/

Compile agent for the thresholds topic: checks.

1 files, 51 KB.


<details><summary>All 1 files</summary>

`compile_thresholds/build.py`

</details>

## compile_comic/

Compile agent for the comic topic: checks.

1 files, 55 KB.

- `compile_comic/build.py`: Compile the verified 'comic' research facts into scratchpad/compiled/comic.json.

<details><summary>All 1 files</summary>

`compile_comic/build.py`

</details>

## compile-growth/

Compile agent for the growth topic: checks.

2 files, 59 KB.

- `compile-growth/build.py`: Compile the growth topic: research facts + verifier corrections -&gt; compiled/growth.json.

<details><summary>All 2 files</summary>

`compile-growth/build.py`, `compile-growth/nums.py`

</details>

## review1/

Review round 1: the reviewers' and verifiers' repro scripts.

198 files, 250 KB.

- `review1/baseline-cases.js`: The setting combinations and the outputs compared by the all-out regression check (test/presence.js).
- `review1/claims/h.js`: claims harness: node h.js spec.json [brief]
- `review1/cmpbase.js`: generate the all-out baseline from main's engine and compare with the committed fixture
- `review1/js/h.js`: Harness: open the page with given saved state, pick tab and effort, return bay text.
- `review1/make-baseline.js`: Writes test/fixtures/allout-baseline.json from an engine file (default: this one). Used once, with the engine as it
- `review1/mutate.js`: Apply one mutation to a scratch copy of the engine and run test/presence.js against it
- `review1/pw-ceiling.js`: worst case: ceiling preset selected, then a setting change makes a fresh plan that must be solved synchronously
- `review1/pw-corrupt.js`: Corrupt saved settings for every new key: the page must load cleanly and normalise them
- `review1/pw-drag-main.js`: Dial drag on the Jump / Throw tab with the default least-disruptive effort: time of each frame's bay render
- `review1/pw-drag.js`: Dial drag on the Jump / Throw tab with the default least-disruptive effort: time of each frame's bay render
- `review1/pw-drag2.js`: Dial drag on the Jump / Throw tab with the default least-disruptive effort: time of each frame's bay render
- `review1/pw-freeze.js`: Load the page with a saved setting that makes the default (least disruptive) effort solve slowly, and time the freeze
- `review1/pw-fuzz.js`: Drive the page through non-default states; flag NaN/undefined/Infinity anywhere in the page text, console errors, overflow
- `review1/pw.js`: usage: node pw.js '&lt;json state overrides&gt;' tab [evalJS] [shot.png]
- `review1/sweep-new.js`: Sweep the new engine paths (effort, presence, growth) for NaN / negative values
- `review1/sweep-small.js`: Sweep every action across strengths, sizes, surfaces, modes and anchors; flag NaN/undefined/negative outputs.
- `review1/vc/drag.js`: node drag.js head|main '&lt;state json&gt;'
- `review1/vc/drag2.js`: node drag.js head|main '&lt;state json&gt;'
- `review1/vc/load.js`: usage: node load.js head|main '&lt;json state&gt;' [timeoutSec]
- `review1/vc/mut.js`: node mut.js &lt;id&gt;  : applies mutation &lt;id&gt; to a copy of HEAD's src+test and runs test/presence.js

<details><summary>All 198 files</summary>

`review1/acc.py`, `review1/baseline-cases.js`, `review1/claims/e1.js`, `review1/claims/e2.js`, `review1/claims/e3.js`, `review1/claims/e4.js`, `review1/claims/h.js`, `review1/claims/sweep.js`, `review1/claims/t-aria.js`, `review1/claims/t-own.js`, `review1/claims/t-panel.js`, `review1/cmpbase.js`, `review1/damp.py`, `review1/g1.js`, `review1/h.js`, `review1/js/env.js`, `review1/js/f1.js`, `review1/js/f10p.js`, `review1/js/f11p.js`, `review1/js/f12p.js`, `review1/js/f16p.js`, `review1/js/f17p.js`, `review1/js/f18p.js`, `review1/js/f1n.js`, `review1/js/f2.js`, `review1/js/f20p.js`, `review1/js/f22p.js`, `review1/js/f2p.js`, `review1/js/f2p2.js`, `review1/js/f3.js`, `review1/js/f3p.js`, `review1/js/f3q.js`, `review1/js/f4.js`, `review1/js/f4p.js`, `review1/js/f5p.js`, `review1/js/f6p.js`, `review1/js/f7n.js`, `review1/js/f7p.js`, `review1/js/f8p.js`, `review1/js/f9p.js`, `review1/js/h.js`, `review1/lamb.py`, `review1/lib.js`, `review1/make-baseline.js`, `review1/mem.js`, `review1/mkprev.js`, `review1/mutate.js`, `review1/one-main.js`, `review1/one.js`, `review1/pisa.js`, `review1/pulse.py`, `review1/pw-catch-person.js`, `review1/pw-ceiling.js`, `review1/pw-check-nan.js`, `review1/pw-corrupt.js`, `review1/pw-drag-main.js`, `review1/pw-drag.js`, `review1/pw-drag2.js`, `review1/pw-duo-main.js`, `review1/pw-duo.js`, `review1/pw-freeze.js`, `review1/pw-fuzz.js`, `review1/pw-timing.js`, `review1/pw-walk-math.js`, `review1/pw.js`, `review1/render.js`, `review1/render2.js`, `review1/render3.js`, `review1/render4.js`, `review1/render5.js`, `review1/rf/b1.js`, `review1/rf/b12.js`, `review1/rf/b16.js`, `review1/rf/b2.js`, `review1/rf/b3.js`, `review1/rf/b3b.js`, `review1/rf/b5.js`, `review1/rf/b8.js`, `review1/rf/b9.js`, `review1/rf/f1.js`, `review1/rf/f11.js`, `review1/rf/f12.js`, `review1/rf/f12b.js`, `review1/rf/f12c.js`, `review1/rf/f13.js`, `review1/rf/f14.js`, `review1/rf/f16.js`, `review1/rf/f1b.js`, `review1/rf/f2.js`, `review1/rf/f3.js`, `review1/rf/f4.js`, `review1/rf/f5.js`, `review1/rf/f6.js`, `review1/rf/f7.js`, `review1/rf/f8.js`, `review1/rf/lib.js`, `review1/rf/pwlib.js`, `review1/s1-views.js`, `review1/s10-weak.js`, `review1/s11-first.js`, `review1/s12-reload.js`, `review1/s13-goal.js`, `review1/s14-controls.js`, `review1/s15-both.js`, `review1/s16-strike.js`, `review1/s17-select.js`, `review1/s18-fresh.js`, `review1/s19-own.js`, `review1/s2-sanity.js`, `review1/s20-shift.js`, `review1/s21-inf.js`, `review1/s22-near.js`, `review1/s23-absorbsel.js`, `review1/s24-shot.js`, `review1/s25-grow0.js`, `review1/s26-collide.js`, `review1/s3-chart.js`, `review1/s4-drag.js`, `review1/s5-timing.js`, `review1/s6-presets.js`, `review1/s7-keyboard.js`, `review1/s8-kbd-slider.js`, `review1/s9-stale.js`, `review1/scan.js`, `review1/shimmer.js`, `review1/stomp.js`, `review1/sweep-new.js`, `review1/sweep-small.js`, `review1/t1.js`, `review1/t10.js`, `review1/t11.js`, `review1/t12.js`, `review1/t13.js`, `review1/t14.js`, `review1/t15.js`, `review1/t16.js`, `review1/t17.js`, `review1/t2.js`, `review1/t3.js`, `review1/t4.js`, `review1/t5.js`, `review1/t6.js`, `review1/t7.js`, `review1/t8.js`, `review1/t9.js`, `review1/timing.js`, `review1/timing2.js`, `review1/vc/bodynan.js`, `review1/vc/catchp.js`, `review1/vc/catchp2.js`, `review1/vc/drag.js`, `review1/vc/drag2.js`, `review1/vc/load.js`, `review1/vc/mkprev.js`, `review1/vc/mut.js`, `review1/vc/nanvis.js`, `review1/vc/pace.js`, `review1/vc/sat.js`, `review1/vc/t2.js`, `review1/vc/throwp.js`, `review1/vc/walkmath.js`, `review1/vd/base.js`, `review1/vd/grow.js`, `review1/vd/kaiju.js`, `review1/vd/multi.js`, `review1/vd/pass.js`, `review1/vd/pw.js`, `review1/vd/shim.js`, `review1/vd/throwc.js`, `review1/vd/throwp.js`, `review1/vd/walk1.js`, `review1/vux/lib.js`, `review1/vux/libnew.js`, `review1/vux/u1.js`, `review1/vux/u10-new.js`, `review1/vux/u10.js`, `review1/vux/u11.js`, `review1/vux/u12.js`, `review1/vux/u12b.js`, `review1/vux/u13.js`, `review1/vux/u1b.js`, `review1/vux/u2.js`, `review1/vux/u3-new.js`, `review1/vux/u3.js`, `review1/vux/u3b.js`, `review1/vux/u3c.js`, `review1/vux/u3d-new.js`, `review1/vux/u3d.js`, `review1/vux/u4.js`, `review1/vux/u5.js`, `review1/vux/u5b.js`, `review1/vux/u6.js`, `review1/vux/u7.js`, `review1/vux/u7b.js`, `review1/vux/u8.js`, `review1/vux/u9.js`, `review1/w1.js`, `review1/walk.js`

</details>

## review2/

Review round 2: the reviewers' and verifiers' repro scripts.

205 files, 369 KB.

- `review2/claims/h.js`: harness: open the page with saved state, run steps, return bay text
- `review2/deepcmp.js`: Deep-compare all-out results of main's engine and HEAD's on the same inputs (switches off, no use).
- `review2/h-sat-check.js`: For each solo plan: does stopping at saturation (same speed at two efforts) change any job's answer?
- `review2/h.js`: harness: open the page with saved state, run steps, return bay text
- `review2/merge_copy.py`: Assemble research/final-presence.json from the compiled presence topics.
- `review2/pw-drag.js`: Dial drag on the Jump / Throw tab with the default least-disruptive effort: time of each frame's bay render
- `review2/pw-duo-stale.js`: Does a background two-player plan keep running with the new settings after a change, and cache wrong results?
- `review2/pw-effort.js`: load a solo state, pick an effort preset, wait for the search, print the verdict and effort readout
- `review2/sat-check.js`: For each solo plan: does stopping at saturation (same speed at two efforts) change any job's answer?
- `review2/satur.js`: Does the saturation stop (same speed at two efforts) miss hazards that keep growing after the speed saturates?
- `review2/satur3.js`: Does the saturation stop (same speed at two efforts) miss hazards that keep growing after the speed saturates?
- `review2/scan.js`: Dense scan of every effort move: goal minimal, ceiling harmless below, named hazard on at use, presets minimal.
- `review2/sweep-small.js`: Sweep every action across strengths, sizes, surfaces, modes and anchors; flag NaN/undefined/negative outputs.
- `review2/testcopy/baseline-cases.js`: The setting combinations and the outputs compared by the all-out regression check (test/presence.js).
- `review2/testcopy/calibration.js`: Asserts the record-human calibration and core physics invariants. Run: node test/calibration.js
- `review2/testcopy/fit-v2.js`: Fit throwPush.forceFrac and throwWhip.vmax so real-muscle throws at record strength hit the records.
- `review2/testcopy/make-baseline.js`: Writes test/fixtures/allout-baseline.json from an engine file (default: this one). Used once, with the engine as it
- `review2/testcopy/presence.js`: Checks for restraint, presence, the comic switches and growth (BRIEF-presence.md, "Tests"). Run: node test/presence.js
- `review2/testcopy/sweep.js`: Sweep every action across strengths, sizes, surfaces, modes and anchors; flag NaN/undefined/negative outputs.
- `review2/ux/n1-within.js`: Is "Nothing this move does harms anyone within 5 m" true when the hazards are only checked at 5 m?
- `review2/ux/s10-preset-stale.js`: Pick each effort preset from the select (focus stays on it) at unlimited strength, real muscle: does the slider follow
- `review2/ux/s11-walk-variants.js`: Walk tab variants: chart text overlapping or clipped, legend, broken numbers.
- `review2/ux/s12-label-strike.js`: Walk chart: does any threshold line (dashed, full width) or a curve pass through a threshold label's glyph box?
- `review2/ux/s13-growth.js`: Growth modes and comic switches at phone width: overflow, broken numbers, what each switch visibly changes.
- `review2/ux/s14-switches.js`: Each comic switch: does its tab visibly change, with a label naming the switch?
- `review2/ux/s16-dial.js`: The strength dial: do the effort sliders follow (range, value, value text) during and after a drag?
- `review2/ux/s19-angle-stale.js`: Drag the launch angle (in the bay): the least-disruptive effort changes; does the effort slider follow?
- `review2/ux/s2-stale.js`: After a background effort search finishes while a control in the bay has focus, are the effort slider and its
- `review2/ux/s3-duo-stale.js`: Two-player tabs: after the background effort search finishes with focus inside the bay, does the duo slider follow?
- `review2/ux/s3b-duo-stale-hard.js`: Two-player tabs: after the background effort search finishes with focus inside the bay, does the duo slider follow?
- `review2/ux/s4-slider-end.js`: Can the effort sliders reach all-out at their right end? Press End on each and read the readout.
- `review2/ux/s5-drag-timing.js`: Drag the effort sliders with the mouse; time each render (rAF callbacks and timers) and long tasks; check the readout follows.
- `review2/ux/s6-reload.js`: Fresh visit and reload with saved settings: does every tab open least disruptive?
- `review2/ux/s7-first.js`: First screen on a phone: where the result sits, how big the effort box is, per tab, with the default (folded) controls.
- `review2/ux/s8-duo-drag.js`: Mouse-drag the two-player sliders (#duo-effort-use, #o-effort-use, and Catch's #c-dist for comparison): does the drag
- `review2/ux/s8-old.js`: Mouse-drag the two-player sliders (#duo-effort-use, #o-effort-use, and Catch's #c-dist for comparison): does the drag
- `review2/ux/s9-keyboard.js`: Keyboard: Tab through the bay and the comic switches; record each stop and whether a visible focus ring is drawn.
- `review2/v/merge/merge_presence.py`: Assemble research/final-presence.json from the compiled presence topics.
- `review2/vcode/mutdiff.js`: compare original vs mutant engine on targeted inputs
- `review2/vcode/pw.js`: helper: open a page with saved state
- `review2/verify_claims/vh.js`: my own harness (verify_claims)

<details><summary>All 205 files</summary>

`review2/catchF.js`, `review2/claims/dial.js`, `review2/claims/dump1.js`, `review2/claims/duo.js`, `review2/claims/duo2.js`, `review2/claims/grow.js`, `review2/claims/h.js`, `review2/claims/presets.js`, `review2/claims/presets2.js`, `review2/claims/scan_sat.js`, `review2/claims/scan_sat2.js`, `review2/claims/walk.js`, `review2/common.js`, `review2/deepcmp.js`, `review2/drag_check.js`, `review2/dump.js`, `review2/dump1.js`, `review2/duo-search.js`, `review2/duo.js`, `review2/duo1.js`, `review2/duopage.js`, `review2/duopage2.js`, `review2/eleph.js`, `review2/eleph2.js`, `review2/freq.js`, `review2/grow.js`, `review2/growth.js`, `review2/h-duo-search.js`, `review2/h-jump-plan.js`, `review2/h-jump-scan.js`, `review2/h-mutate.js`, `review2/h-pw-duofuzz.js`, `review2/h-pw-leave.js`, `review2/h-sat-check.js`, `review2/h-timing2.js`, `review2/h.js`, `review2/human_check.js`, `review2/jump-plan.js`, `review2/jump-scan.js`, `review2/jump1.js`, `review2/lib.js`, `review2/loco.js`, `review2/merge_copy.py`, `review2/mkbase.js`, `review2/mutate.js`, `review2/page.js`, `review2/page2.js`, `review2/person.js`, `review2/presets.js`, `review2/presets2.js`, `review2/print_check.js`, `review2/pw-bg.js`, `review2/pw-ceil.js`, `review2/pw-corrupt.js`, `review2/pw-drag.js`, `review2/pw-duo-leave.js`, `review2/pw-duo-stale.js`, `review2/pw-duo-stale2.js`, `review2/pw-duofuzz.js`, `review2/pw-effort.js`, `review2/pw-leave.js`, `review2/pw-nan-dom.js`, `review2/pw-persist.js`, `review2/pw-text.js`, `review2/sat-check.js`, `review2/satur.js`, `review2/satur2.js`, `review2/satur3.js`, `review2/scan.js`, `review2/shot.js`, `review2/shot2.js`, `review2/stamp-agree.js`, `review2/stomp1.js`, `review2/stomp2.js`, `review2/stomp3.js`, `review2/stomp4.js`, `review2/sweep-small.js`, `review2/sweep-use.js`, `review2/switches.js`, `review2/testcopy/baseline-cases.js`, `review2/testcopy/calibration.js`, `review2/testcopy/fit-v2.js`, `review2/testcopy/make-baseline.js`, `review2/testcopy/presence.js`, `review2/testcopy/shots.js`, `review2/testcopy/sweep.js`, `review2/time1.js`, `review2/timing.js`, `review2/timing2.js`, `review2/ux/lib.js`, `review2/ux/n1-within.js`, `review2/ux/n2-none.js`, `review2/ux/s1-views.js`, `review2/ux/s10-preset-stale.js`, `review2/ux/s11-walk-variants.js`, `review2/ux/s12-label-strike.js`, `review2/ux/s13-growth.js`, `review2/ux/s14-switches.js`, `review2/ux/s15-gentle-throw.js`, `review2/ux/s16-dial.js`, `review2/ux/s17-tinypct.js`, `review2/ux/s18-halflife.js`, `review2/ux/s19-angle-stale.js`, `review2/ux/s2-stale.js`, `review2/ux/s20-legend.js`, `review2/ux/s3-duo-stale.js`, `review2/ux/s3b-duo-stale-hard.js`, `review2/ux/s4-slider-end.js`, `review2/ux/s5-drag-timing.js`, `review2/ux/s6-reload.js`, `review2/ux/s7-first.js`, `review2/ux/s8-duo-drag.js`, `review2/ux/s8-old.js`, `review2/ux/s9-keyboard.js`, `review2/v/catchslow.js`, `review2/v/drag-arm.js`, `review2/v/drag.js`, `review2/v/dumptabs.js`, `review2/v/duostale.js`, `review2/v/gentle.js`, `review2/v/grow.js`, `review2/v/halflife.js`, `review2/v/halflife2.js`, `review2/v/halflife3.js`, `review2/v/human.js`, `review2/v/instant.js`, `review2/v/jumptext.js`, `review2/v/legend.js`, `review2/v/lib.js`, `review2/v/merge/merge_presence.py`, `review2/v/mkprev.js`, `review2/v/nearlabel.js`, `review2/v/punchE.js`, `review2/v/punchWin.js`, `review2/v/rows.js`, `review2/v/rw.js`, `review2/v/sliderend.js`, `review2/v/stale.js`, `review2/v/stale2.js`, `review2/v/tiny.js`, `review2/v/walklbl.js`, `review2/v/walkzoom.js`, `review2/v/win.js`, `review2/v/within.js`, `review2/vcode/bg.js`, `review2/vcode/details.js`, `review2/vcode/drag.js`, `review2/vcode/duoCheck.js`, `review2/vcode/duoStale.js`, `review2/vcode/duoStale2.js`, `review2/vcode/duofuzz.js`, `review2/vcode/jsand.js`, `review2/vcode/jump.js`, `review2/vcode/landmut.js`, `review2/vcode/mkprev.js`, `review2/vcode/mut.js`, `review2/vcode/mutdiff.js`, `review2/vcode/neversweep.js`, `review2/vcode/pageDuo.js`, `review2/vcode/pageJump.js`, `review2/vcode/persist.js`, `review2/vcode/pw.js`, `review2/vcode/tc.js`, `review2/vcode/timing.js`, `review2/vcode/timing2.js`, `review2/verify_claims/all.js`, `review2/verify_claims/f1.js`, `review2/verify_claims/f12.js`, `review2/verify_claims/f14e.js`, `review2/verify_claims/f16.js`, `review2/verify_claims/f16b.js`, `review2/verify_claims/f16c.js`, `review2/verify_claims/f18b.js`, `review2/verify_claims/f19e.js`, `review2/verify_claims/f19s.js`, `review2/verify_claims/f1e.js`, `review2/verify_claims/f1fix.js`, `review2/verify_claims/f2.js`, `review2/verify_claims/f22.js`, `review2/verify_claims/f24e.js`, `review2/verify_claims/f24p.js`, `review2/verify_claims/f2e.js`, `review2/verify_claims/f3.js`, `review2/verify_claims/f3e.js`, `review2/verify_claims/f6e.js`, `review2/verify_claims/vh.js`, `review2/vp/dc.js`, `review2/vp/dpg.js`, `review2/vp/el.js`, `review2/vp/fix1.js`, `review2/vp/fpr.js`, `review2/vp/fq.js`, `review2/vp/hs.js`, `review2/vp/j1.js`, `review2/vp/j2.js`, `review2/vp/lib.js`, `review2/vp/pg.js`, `review2/vp/scan.js`, `review2/vp/sl.js`, `review2/vp/st.js`, `review2/vp/wpg.js`, `review2/w-jump-plan.js`, `review2/walk.js`, `review2/walk1.js`, `review2/win_check.js`

</details>

## review3/

Review round 3, if run: the reviewers' and verifiers' repro scripts.

190 files, 270 KB.

- `review3/claims/hc.js`: claims-lens harness: load page with saved state, pick tab, set controls, dump bay text
- `review3/code/drag.js`: Drag a slider in the two-player Catch test (real muscle) and record long tasks: does the search pause like it does
- `review3/code/run.js`: Mutation runner (code lens): node run.js muts.json [parallel]. Each mutant gets its own copy of src/engine.js,
- `review3/corrupt.js`: Load the page with corrupt saved settings for every new key; report page errors and what the page saved back.
- `review3/duo-own.js`: Ollie's own effort after a drag of the shared effort slider: which value does the checkbox start him at?
- `review3/duolong.js`: Long tasks in the two-player tests: load a duo tab, then click the infinite chip and real muscle, until settled.
- `review3/duostep.js`: CPU time of each step of the two-player 'least disruptive' search for Catch, reproducing makeDuoPlan's harmAt/same
- `review3/h.js`: harness: open the page with saved state, run steps, return bay text
- `review3/longtask.js`: Worst main-thread blocking: pick an effort preset, then change a setting that starts a new plan (the infinite chip,
- `review3/mut/mutate.sh`: usage: mutate.sh name 'perl substitution'
- `review3/peek.js`: Print the bay text for a given saved state and effort: node peek.js '&lt;state json&gt;' &lt;effort&gt; [regex]
- `review3/samecheck.js`: Does the search's early stop (same) ever change a result? Compare the engine's plan with a copy whose `same` is off.
- `review3/shotsmut/verify.js`: Confirms the injected overflow is real on the Walk tab and absent on the tabs shots.js measures (load, Collide).
- `review3/stalefire.js`: fromFire is set in effortReadout, after resolveEffort has already written its note: does a stale value leak?
- `review3/statesweep.js`: Browser sweep of non-default page states: every solo tab, two strengths, both muscle modes, all comic switches on,
- `review3/sweep/test/sweep-small.js`: Sweep every action across strengths, sizes, surfaces, modes and anchors; flag NaN/undefined/negative outputs.
- `review3/ux/s10-preset-stale.js`: Pick each effort preset from the select (focus stays on it) at unlimited strength, real muscle: does the slider follow
- `review3/ux/s11-walk-variants.js`: Walk tab variants: chart text overlapping or clipped, legend, broken numbers.
- `review3/ux/s13-growth.js`: Growth modes and comic switches at phone width: overflow, broken numbers, what each switch visibly changes.
- `review3/ux/s14-switches.js`: Each comic switch: does its tab visibly change, with a label naming the switch?
- `review3/ux/s16-dial.js`: The strength dial: do the effort sliders follow (range, value, value text) during and after a drag?
- `review3/ux/s2-stale.js`: After a background effort search finishes while a control in the bay has focus, are the effort slider and its
- `review3/ux/s21-focus-loss.js`: Keyboard focus on something in the bay after the controls (a summary), while a background effort search finishes:
- `review3/ux/s22-slow-efforts.js`: Which slider positions make a render slow? Step the effort slider through its range (input events) and time each render.
- `review3/ux/s23-drag-detail.js`: Mouse-drag the effort slider and log each animation-frame callback's duration with the slider value at that moment.
- `review3/ux/s24-fine.js`: Time the render at each slider position on a fine grid (input events, one per frame).
- `review3/ux/s25-comic-drag.js`: The throw at unlimited strength in comic mode: does a mouse drag of the effort slider move it?
- `review3/ux/s26-readouts.js`: Full effort readouts on a fresh visit at 390 px, with word counts and heights, and a screenshot of the first screen
- `review3/ux/s27-presets.js`: Each effort preset on each solo tab at the default settings: the effort it picks, in order, against the least-disruptive one.
- `review3/ux/s28-duo-near.js`: The two-player courtesy ceiling depends on 'Nearest people and buildings', but is that field on the two-player tabs?
- `review3/ux/s29-gentle-throw.js`: Gentle hold on the Throw tab: what the visible readout says, and what the folded hazard list says.
- `review3/ux/s3-duo-stale.js`: Two-player tabs: after the background effort search finishes with focus inside the bay, does the duo slider follow?
- `review3/ux/s30-runaway-overflow.js`: Runaway growth: horizontal overflow at each width, and the element that causes it.
- `review3/ux/s31-duo-own.js`: Two-player effort box with Ollie's own effort, at 360 px: layout, cards, readout; and Ollie's slider drag and keyboard.
- `review3/ux/s32-slider-min.js`: Effort sliders at their left end (Home key): the spoken value, the readout and the fighter cards.
- `review3/ux/s33-out-of-range.js`: Typing an out-of-range value into a number field: what does the page do and say?
- `review3/ux/s34-right-end.js`: Drag the effort slider all the way right with the mouse (past the end) at the default strength: is it all-out?
- `review3/ux/s35-select-clip.js`: Every option of the new selects, selected in turn at 360 px: does its text fit the closed select?
- `review3/ux/s36-passenger-lift.js`: Safe passenger says it covers a person he lifts: does the Lift tab change at all?
- `review3/ux/s37-live.js`: The screen-reader live region while a two-player search is pending, and after.
- `review3/ux/s4-slider-end.js`: Can the effort sliders reach all-out at their right end? Press End on each and read the readout.
- `review3/ux/s5-drag-timing.js`: Drag the effort sliders with the mouse; time each render (rAF callbacks and timers) and long tasks; check the readout follows.
- `review3/ux/s5b.js`: Drag the effort sliders with the mouse; time each render (rAF callbacks and timers) and long tasks; check the readout follows.
- `review3/ux/s6-reload.js`: Fresh visit and reload with saved settings: does every tab open least disruptive?
- `review3/ux/s7-first.js`: First screen on a phone: where the result sits, how big the effort box is, per tab, with the default (folded) controls.
- `review3/ux/s8-duo-drag.js`: Mouse-drag the two-player sliders (#duo-effort-use, #o-effort-use, and Catch's #c-dist for comparison): does the drag
- `review3/ux/s9-keyboard.js`: Keyboard: Tab through the bay and the comic switches; record each stop and whether a visible focus ring is drawn.
- `review3/vcode/drive.js`: node drive.js '&lt;state json&gt;' [effort] [regex]; env ABSORB, W
- `review3/vcode/guards.js`: Proposed guards: node guards.js &lt;rexlab dir&gt;
- `review3/vcode/longtask.js`: node longtask.js '&lt;state&gt;' [seconds]
- `review3/vcode/mut.js`: node mut.js : each mutant in its own copy of src/test/research; runs node test/presence.js
- `review3/vdata/render.js`: usage: node render.js '&lt;state json&gt;' [effort] [extra-js]

<details><summary>All 190 files</summary>

`review3/claims/default.js`, `review3/claims/duo.js`, `review3/claims/eng.js`, `review3/claims/growsw.js`, `review3/claims/hc.js`, `review3/claims/sweep1.js`, `review3/claims/switches.js`, `review3/claims/t_E.js`, `review3/claims/t_eleph.js`, `review3/claims/t_jump.js`, `review3/claims/t_jump2.js`, `review3/claims/t_plaster.js`, `review3/claims/t_plaster2.js`, `review3/claims/t_push.js`, `review3/claims/t_soft.js`, `review3/claims/t_throw.js`, `review3/claims/t_throw15.js`, `review3/claims/t_throw2.js`, `review3/claims/t_throwpage.js`, `review3/claims/t_walk.js`, `review3/claims/t_wthrow.js`, `review3/claims/walk.js`, `review3/claims/weight.js`, `review3/code/drag.js`, `review3/code/run.js`, `review3/corrupt.js`, `review3/crater.js`, `review3/dump1.js`, `review3/dump2.js`, `review3/dump3.js`, `review3/dump4.js`, `review3/dump5.js`, `review3/duo-own.js`, `review3/duolong.js`, `review3/duostep.js`, `review3/grow.js`, `review3/h.js`, `review3/human.js`, `review3/longtask.js`, `review3/mut/mutate.sh`, `review3/peek.js`, `review3/physics/calibjump.js`, `review3/physics/dense.js`, `review3/physics/dense2.js`, `review3/physics/duo.js`, `review3/physics/eleph.js`, `review3/physics/grow.js`, `review3/physics/ph.js`, `review3/physics/piano.js`, `review3/physics/plwin.js`, `review3/physics/pw.js`, `review3/physics/recoil.js`, `review3/physics/sat.js`, `review3/physics/shot.js`, `review3/physics/silent.js`, `review3/physics/soft.js`, `review3/physics/stompfly.js`, `review3/physics/tank.js`, `review3/plaster.js`, `review3/samecheck.js`, `review3/shotsmut/verify.js`, `review3/stalefire.js`, `review3/statesweep.js`, `review3/step.js`, `review3/sweep/test/sweep-small.js`, `review3/ux/lib.js`, `review3/ux/n1-throw-time.js`, `review3/ux/n2-prof.js`, `review3/ux/n3-scan.js`, `review3/ux/s1-views.js`, `review3/ux/s10-preset-stale.js`, `review3/ux/s11-walk-variants.js`, `review3/ux/s13-growth.js`, `review3/ux/s14-switches.js`, `review3/ux/s16-dial.js`, `review3/ux/s2-stale.js`, `review3/ux/s20-legend.js`, `review3/ux/s21-focus-loss.js`, `review3/ux/s21b-focus-loss.js`, `review3/ux/s22-slow-efforts.js`, `review3/ux/s23-drag-detail.js`, `review3/ux/s24-fine.js`, `review3/ux/s25-comic-drag.js`, `review3/ux/s26-readouts.js`, `review3/ux/s27-presets.js`, `review3/ux/s28-duo-near.js`, `review3/ux/s29-gentle-throw.js`, `review3/ux/s3-duo-stale.js`, `review3/ux/s30-runaway-overflow.js`, `review3/ux/s30b-runaway-shot.js`, `review3/ux/s31-duo-own.js`, `review3/ux/s32-slider-min.js`, `review3/ux/s33-out-of-range.js`, `review3/ux/s34-right-end.js`, `review3/ux/s35-select-clip.js`, `review3/ux/s36-passenger-lift.js`, `review3/ux/s37-live.js`, `review3/ux/s4-slider-end.js`, `review3/ux/s5-drag-timing.js`, `review3/ux/s5b.js`, `review3/ux/s6-reload.js`, `review3/ux/s7-first.js`, `review3/ux/s8-duo-drag.js`, `review3/ux/s9-keyboard.js`, `review3/v/f1.js`, `review3/v/f10.js`, `review3/v/f11.js`, `review3/v/f1fix.js`, `review3/v/f2.js`, `review3/v/f2b.js`, `review3/v/f3.js`, `review3/v/f4n.js`, `review3/v/f4p.js`, `review3/v/f4q.js`, `review3/v/f5.js`, `review3/v/f5b.js`, `review3/v/f5c.js`, `review3/v/f5d.js`, `review3/v/f6.js`, `review3/v/f7.js`, `review3/v/f8.js`, `review3/v/f9.js`, `review3/v/f9z.js`, `review3/v/h.js`, `review3/v/lib.js`, `review3/v/mkprev.js`, `review3/v/n.js`, `review3/v/t1.js`, `review3/v/t11.js`, `review3/v/t12.js`, `review3/v/t12b.js`, `review3/v/t15.js`, `review3/v/t16.js`, `review3/v/t2.js`, `review3/v/t3.js`, `review3/v/t4.js`, `review3/v/t5.js`, `review3/v/t5b.js`, `review3/v/t6.js`, `review3/v/t7.js`, `review3/v/t8.js`, `review3/v/t9.js`, `review3/v/t_throw.js`, `review3/vcode/airnear.js`, `review3/vcode/catchtime.js`, `review3/vcode/drive.js`, `review3/vcode/duoown.js`, `review3/vcode/effect.js`, `review3/vcode/guards.js`, `review3/vcode/longtask.js`, `review3/vcode/longtask2.js`, `review3/vcode/mkprev.js`, `review3/vcode/mut.js`, `review3/vcode/negscan.js`, `review3/vcode/ovall.js`, `review3/vcode/ovtab.js`, `review3/vcode/soft.js`, `review3/vcode/walker.js`, `review3/vdata/crater.js`, `review3/vdata/crater2.js`, `review3/vdata/grow.js`, `review3/vdata/human.js`, `review3/vdata/mutate.sh`, `review3/vdata/plaster.js`, `review3/vdata/render.js`, `review3/vdata/srcrows.js`, `review3/vdata/stomp.js`, `review3/vdata/win.js`, `review3/vphys/f1.js`, `review3/vphys/f1b.js`, `review3/vphys/f2eng.js`, `review3/vphys/f2page.js`, `review3/vphys/f2scan.js`, `review3/vphys/f3eng.js`, `review3/vphys/f3page.js`, `review3/vphys/f4eng-b1.js`, `review3/vphys/f4eng.js`, `review3/vphys/f4page.js`, `review3/vphys/f4person.js`, `review3/vphys/f4scan-b1.js`, `review3/vphys/f4scan.js`, `review3/vphys/f5eng.js`, `review3/vphys/f5page.js`, `review3/vphys/f6page.js`, `review3/vphys/f7eng.js`, `review3/vphys/f7page.js`, `review3/vphys/f8eng.js`, `review3/vphys/f8page.js`, `review3/vphys/mkprev.js`, `review3/vphys/pw.js`

</details>

## dev/

Development helpers: bays.js renders any tab in any state with Playwright; compile-wf.js and review-wf.js are the compile and review workflow scripts; dump_research.py extracts workflow results.

7 files, 23 KB.

- `dev/bays.js`: Usage: node bays.js '&lt;json state overrides&gt;' tab1,tab2 ...   prints bay text per tab
- `dev/drag.js`: node drag.js '&lt;json state&gt;' tab : drag the strength dial over 12 steps, time each frame's work
- `dev/dump_research.py`: Dump research and verify results from the research workflow journals into scratchpad/wfout/
- `dev/perf.js`: node perf.js '&lt;json state&gt;' : load time, long tasks, and the bay's effort text after settling

<details><summary>All 7 files</summary>

`dev/bays.js`, `dev/compile-wf.js`, `dev/drag.js`, `dev/dump_research.py`, `dev/duodrag.js`, `dev/perf.js`, `dev/review-wf.js`

</details>

## wfout/

Each research and verifier agent's structured result, extracted from the logs (research_*.json, verify_*.json and readable *.txt).

17 files, 763 KB.


<details><summary>All 17 files</summary>

`wfout/attenuation_read.txt`, `wfout/growth_read.txt`, `wfout/research_attenuation.json`, `wfout/research_comic.json`, `wfout/research_elephant.json`, `wfout/research_growth.json`, `wfout/research_ripple.json`, `wfout/research_step.json`, `wfout/research_thresholds.json`, `wfout/thresholds_comicverify.txt`, `wfout/verify_attenuation.json`, `wfout/verify_comic.json`, `wfout/verify_elephant.json`, `wfout/verify_growth.json`, `wfout/verify_ripple.json`, `wfout/verify_step.json`, `wfout/verify_thresholds.json`

</details>

## Top level

One-off scripts at the top of the scratchpad.

1 files, 37 KB.


<details><summary>All 1 files</summary>

`compile_step.py`

</details>

## workflows/

The workflow orchestration scripts (each Workflow launch). They compute the subagent prompts quoted in the transcript.

3 files, 38 KB.

- `workflows/compile-wf.js`: rex-presence-compile: Apply each research verifier\
- `workflows/review-wf.js`: rex-presence-review: Adversarial review of the Rex lab presence build (effort, Walk tab, comic switches, growth): lenses find defects, one skeptic per lens reproduces or refutes each finding
- `workflows/rex-presence-research-wf_bb193dee-61c.js`: rex-presence-research: Research verified facts for the Rex lab presence brief (step forces, ground vibration, elephants, thresholds, the water-glass ripple, comic switches, growth physics), then adversarially verify each topic

<details><summary>All 3 files</summary>

`workflows/compile-wf.js`, `workflows/review-wf.js`, `workflows/rex-presence-research-wf_bb193dee-61c.js`

</details>

## Not copied

Copies of project code are the reviewers' snapshots of the repository and their mutated copies of the lab's files (one line changed, to see whether a test catches it). The released versions are in the repository.

| Folder | Why | Files | Total size | Main types |
|---|---|---|---|---|
| research | raw download | 551 | 969.2 MB | .pdf, .txt, .png, .pgm |
| review2 | copy of project code | 9178 | 385.0 MB | .json, .js, .html, .jsonl |
| review2 | binary or output | 1460 | 195.0 MB | .png, (none), .pack, .html |
| review1 | copy of project code | 1148 | 186.1 MB | .html, .json, .png, .js |
| review2 | raw download | 98 | 159.9 MB | .pdf, .png, .txt, .xml |
| review3 | raw download | 108 | 134.9 MB | .pdf, .txt, .png, .xml |
| review3 | copy of project code | 538 | 104.8 MB | .json, .png, .js, .html |
| review1 | raw download | 54 | 95.0 MB | .pdf, .txt, .png, .xml |
| research | binary or output | 406 | 85.1 MB | .png, .pdf, .txt, .json |
| review3 | binary or output | 399 | 80.0 MB | .png, .html, .txt, .out |
| review1 | binary or output | 284 | 58.7 MB | .png, .html, .pdf, .txt |
| compile_ripple | binary or output | 2 | 2.7 MB | .pdf, .txt |
| compiled | binary or output | 7 | 0.5 MB | .json |
| compile_thresholds | binary or output | 4 | 0.4 MB | .png, .json |
| dev | binary or output | 4 | 0.0 MB | .json, .txt |
| compile_elephant | binary or output | 1 | 0.0 MB | .txt |
| (top level) | binary or output | 2 | 0.0 MB | .txt |

Other scratchpad folders that the repository does not cite (earlier probes, backups, page previews) were not copied.
