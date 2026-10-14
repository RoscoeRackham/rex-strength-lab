# Scratchpad scripts

Working scripts from the session scratchpad that the repository cites (in README files, NOTES.md, fact notes and review records) but does not contain. They were written by Claude and its subagents to reproduce findings, measure the picture, compile data and sweep the pages. Paths inside them point at the session scratchpad and the repository at /home/user/rex-strength-lab, so most will not run as-is from here.

Copied: scripts up to 300 KB, plus the compiled research topics (researchC/compiled/), the merge records (mergeC/), the fix scripts' records (fixC1/) and the pull request drafts. Listed but not copied: copies of project code, raw downloads, larger files and binaries (table at the end).

Each folder lists the files whose purpose is known (from the file's own header comment, or a one-liner written for this index); the full file list is collapsed below it. Most of the remaining files are short single-purpose repro scripts named after the finding they test.

## understand/

Pull request B's understand-and-design workflow: its readers' and designers' scripts.

66 files, 112 KB.

- `understand/5d/proto.js`: prototype of the recommended 5d semantics on the HEAD engine (no file edits): ownRecoil = bolted footing for the
- `understand/alias.js`: groundHolds (Comic ground) vs unbreakable (5c) in the working-tree engine: where do they differ?
- `understand/simload-b.js`: The proposed in-place migration (keep 'rex-lab-v1'): app.html's saved-state block with the three retired keys
- `understand/simload.js`: Runs app.html's saved-state block (EFFORT_PRESETS .. save) on a fake localStorage, to show what a save becomes.
- `understand/soft.js`: shots.js's soft-landing check: page jump vs engine ctx, with and without the new defaults (working-tree engine)
- `understand/thr.js`: Does each power change the ladder's predicates (working-tree engine)? thKey today = [mode, H, m, surface, anchor, groundHolds]

<details><summary>All 66 files</summary>

`understand/5d/allstar.js`, `understand/5d/bus.js`, `understand/5d/bus2.js`, `understand/5d/car.js`, `understand/5d/floor.js`, `understand/5d/inf.js`, `understand/5d/moves.js`, `understand/5d/proto.js`, `understand/5d/punch.js`, `understand/5d/sand.js`, `understand/5d/shake.js`, `understand/alias.js`, `understand/allstar.js`, `understand/blastrule.js`, `understand/c1.js`, `understand/c10.js`, `understand/c2.js`, `understand/c3.js`, `understand/c4.js`, `understand/c5.js`, `understand/c6.js`, `understand/c7.js`, `understand/c8.js`, `understand/c9.js`, `understand/catchcmp.js`, `understand/critic/base.js`, `understand/critic/t1.js`, `understand/critic/t2.js`, `understand/critic/t3.js`, `understand/critic/t4.js`, `understand/critic/t5.js`, `understand/critic/t6.js`, `understand/critic/t7.js`, `understand/ident.js`, `understand/load.js`, `understand/mkpatch.js`, `understand/mkpatch2.js`, `understand/mkpatch3.js`, `understand/objs.js`, `understand/pagecheck.js`, `understand/presets.js`, `understand/rel.js`, `understand/s1.js`, `understand/s10.js`, `understand/s11.js`, `understand/s12.js`, `understand/s2.js`, `understand/s3.js`, `understand/s4.js`, `understand/s5.js`, `understand/s6.js`, `understand/s7.js`, `understand/s8.js`, `understand/s9.js`, `understand/shares.js`, `understand/simload-b.js`, `understand/simload.js`, `understand/soft.js`, `understand/t1.js`, `understand/t2.js`, `understand/t3.js`, `understand/t4.js`, `understand/t5.js`, `understand/t6.js`, `understand/t7.js`, `understand/thr.js`

</details>

## reviewA1/

A, review round 1: the reviewers' and verifiers' repro scripts.

143 files, 265 KB.

- `reviewA1/brief/compare.js`: Compare full bay text between main's page and the branch's page for many saved states.
- `reviewA1/code/compare.js`: main vs branch: full text of the bay for each state x tab
- `reviewA1/code/probe1.js`: state migration and validators, closed/open behaviour
- `reviewA1/code/probe10.js`: a close that lands while the search is running: does the search stop?
- `reviewA1/code/probe11.js`: a Rex's-bay redraw while the two-player search runs in the background: does the two-player search finish?
- `reviewA1/code/probe12.js`: shots.js's section 3 loop, under CPU throttling (a slow CI runner): fixed 400 ms waits for the deferred redraw
- `reviewA1/code/probe2.js`: effort-cap leak: Rex's bay and the ladder with the Rex + Ollie element open (capped effort) vs closed
- `reviewA1/code/probe3.js`: controls that call resolveDuoEffort from an event handler: main vs branch
- `reviewA1/copy/dump.js`: node dump.js &lt;which&gt; &lt;label&gt; '&lt;json state&gt;'  -&gt; writes out/&lt;which&gt;-&lt;label&gt;-&lt;tab&gt;.txt for every tab
- `reviewA1/equivalence/cases.js`: Build the case list: a seeded random sample of saved states plus systematic edge cases.
- `reviewA1/equivalence/compare-braced.js`: Braced states: the branch loading 'braced' must give exactly what 'friction' gives (on the branch, and on main after
- `reviewA1/equivalence/compare.js`: Compare main vs branch results, after mapping main's text through the intended wording changes.
- `reviewA1/equivalence/harness.js`: Equivalence harness: load main's build and the branch's build with the same saved state, visit tabs, and
- `reviewA1/equivalence/probe/dup-ids.js`: With both bays drawn, list ids used more than once in the document, for every pair of Rex's tab and a two-player tab.
- `reviewA1/equivalence/probe/near-focus.js`: Two bays each with an effort box: both have an input with id "near". Type a distance in the Rex + Ollie bay's
- `reviewA1/equivalence/probe/stale.js`: Open the Rex + Ollie element, close it, change Rex's strength, reopen: what does the duo bay show right after?
- `reviewA1/equivalence/probe/stale2.js`: Open the Rex + Ollie element, close it, change Rex's strength, reopen: what does the duo bay show right after?
- `reviewA1/equivalence/probe/stale3.js`: Open the Rex + Ollie element, close it, change Rex's strength, reopen: what does the duo bay show right after?
- `reviewA1/equivalence/probe/stomp84.js`: rand84's Stomp tab timed out on both pages: is a search stuck, or does the result text say "working"?
- `reviewA1/equivalence/probe/switches.js`: Interaction equivalence: on main pick the footing menus (#anchor, #o-anchor); on the branch click the Bolted
- `reviewA1/verify-copy/harness.js`: Render a build of the Rex lab with a saved state and return bay text.

<details><summary>All 143 files</summary>

`reviewA1/brief/behave.js`, `reviewA1/brief/collide.js`, `reviewA1/brief/compare.js`, `reviewA1/brief/dupids.js`, `reviewA1/brief/focus.js`, `reviewA1/brief/labels.js`, `reviewA1/brief/look.js`, `reviewA1/brief/perf.js`, `reviewA1/brief/sticky.js`, `reviewA1/code/breaks/mk.py`, `reviewA1/code/compare.js`, `reviewA1/code/lib.js`, `reviewA1/code/probe1.js`, `reviewA1/code/probe10.js`, `reviewA1/code/probe11.js`, `reviewA1/code/probe12.js`, `reviewA1/code/probe13.js`, `reviewA1/code/probe14.js`, `reviewA1/code/probe15.js`, `reviewA1/code/probe16.js`, `reviewA1/code/probe2.js`, `reviewA1/code/probe2b.js`, `reviewA1/code/probe3.js`, `reviewA1/code/probe4.js`, `reviewA1/code/probe5.js`, `reviewA1/code/probe6.js`, `reviewA1/code/probe7.js`, `reviewA1/code/probe8.js`, `reviewA1/code/probe9.js`, `reviewA1/code/showdiff.py`, `reviewA1/code/wrap.js`, `reviewA1/copy/dump.js`, `reviewA1/copy/lib.js`, `reviewA1/copy/t1.js`, `reviewA1/copy/t2.js`, `reviewA1/copy/t3.js`, `reviewA1/copy/t4.js`, `reviewA1/copy/t5.js`, `reviewA1/equivalence/braced-cases.js`, `reviewA1/equivalence/cases.js`, `reviewA1/equivalence/compare-braced.js`, `reviewA1/equivalence/compare.js`, `reviewA1/equivalence/harness.js`, `reviewA1/equivalence/intended.js`, `reviewA1/equivalence/probe/dup-ids.js`, `reviewA1/equivalence/probe/labels.js`, `reviewA1/equivalence/probe/near-focus.js`, `reviewA1/equivalence/probe/stale.js`, `reviewA1/equivalence/probe/stale2.js`, `reviewA1/equivalence/probe/stale3.js`, `reviewA1/equivalence/probe/stomp84.js`, `reviewA1/equivalence/probe/switches.js`, `reviewA1/ux/allon.js`, `reviewA1/ux/angle.js`, `reviewA1/ux/arrows.js`, `reviewA1/ux/asideh.js`, `reviewA1/ux/ax.js`, `reviewA1/ux/common.js`, `reviewA1/ux/compare-first.js`, `reviewA1/ux/contrast.js`, `reviewA1/ux/counttest.js`, `reviewA1/ux/dupids.js`, `reviewA1/ux/dupids2.js`, `reviewA1/ux/focus.js`, `reviewA1/ux/hidden.js`, `reviewA1/ux/kbd.js`, `reviewA1/ux/layout.js`, `reviewA1/ux/live.js`, `reviewA1/ux/near.js`, `reviewA1/ux/reopen.js`, `reviewA1/ux/reopen2.js`, `reviewA1/ux/rexctl.js`, `reviewA1/ux/rexctl2.js`, `reviewA1/ux/rig.js`, `reviewA1/ux/sticky.js`, `reviewA1/ux/stickyfix.js`, `reviewA1/ux/stickyfix2.js`, `reviewA1/ux/tabvis.js`, `reviewA1/ux/timing.js`, `reviewA1/ux/timing2.js`, `reviewA1/verify-brief/b1.js`, `reviewA1/verify-brief/b1b.js`, `reviewA1/verify-brief/b2.js`, `reviewA1/verify-brief/b2b.js`, `reviewA1/verify-brief/b2c.js`, `reviewA1/verify-brief/b2d.js`, `reviewA1/verify-brief/b2e.js`, `reviewA1/verify-brief/b4a.js`, `reviewA1/verify-brief/b4b.js`, `reviewA1/verify-brief/b5.js`, `reviewA1/verify-brief/b5b.js`, `reviewA1/verify-brief/b5c.js`, `reviewA1/verify-brief/lib.js`, `reviewA1/verify-brief/wrap.js`, `reviewA1/verify-code/h.js`, `reviewA1/verify-code/v1.js`, `reviewA1/verify-code/v2.js`, `reviewA1/verify-code/v2b.js`, `reviewA1/verify-code/v2c.js`, `reviewA1/verify-code/v3.js`, `reviewA1/verify-code/v4.js`, `reviewA1/verify-code/v5.js`, `reviewA1/verify-code/v6.js`, `reviewA1/verify-code/v7.js`, `reviewA1/verify-copy/c1.js`, `reviewA1/verify-copy/c2.js`, `reviewA1/verify-copy/c2b.js`, `reviewA1/verify-copy/c3.js`, `reviewA1/verify-copy/c4.js`, `reviewA1/verify-copy/c5.js`, `reviewA1/verify-copy/c67.js`, `reviewA1/verify-copy/harness.js`, `reviewA1/verify-equivalence/dup-fixed.js`, `reviewA1/verify-equivalence/dup.js`, `reviewA1/verify-equivalence/focus-fixed.js`, `reviewA1/verify-equivalence/focus.js`, `reviewA1/verify-equivalence/scan.js`, `reviewA1/verify-equivalence/stale.js`, `reviewA1/verify-equivalence/stale2-fixed.js`, `reviewA1/verify-equivalence/stale2-fixed2.js`, `reviewA1/verify-equivalence/stale2.js`, `reviewA1/verify-ux/lib.js`, `reviewA1/verify-ux/ux1.js`, `reviewA1/verify-ux/ux1b.js`, `reviewA1/verify-ux/ux1c.js`, `reviewA1/verify-ux/ux1fix.js`, `reviewA1/verify-ux/ux1fix2.js`, `reviewA1/verify-ux/ux2.js`, `reviewA1/verify-ux/ux2b.js`, `reviewA1/verify-ux/ux2c.js`, `reviewA1/verify-ux/ux2d.js`, `reviewA1/verify-ux/ux2e.js`, `reviewA1/verify-ux/ux2f.js`, `reviewA1/verify-ux/ux2fix.js`, `reviewA1/verify-ux/ux2g.js`, `reviewA1/verify-ux/ux3.js`, `reviewA1/verify-ux/ux3b.js`, `reviewA1/verify-ux/ux3c.js`, `reviewA1/verify-ux/ux3fix.js`, `reviewA1/verify-ux/ux4.js`, `reviewA1/verify-ux/ux4b.js`, `reviewA1/verify-ux/ux5.js`, `reviewA1/verify-ux/ux5fix.js`

</details>

## reviewA2/

A, review round 2: the reviewers' and verifiers' repro scripts.

95 files, 346 KB.

- `reviewA2/code/s/equiv.js`: main's page vs the branch's page: same result text for many states and tabs (after the intended edits)
- `reviewA2/code/s/h.js`: harness: wrap a dist/index.html into a page under scratch and give helpers
- `reviewA2/code/s/mutate.py`: make a mutated copy of the lab: python3 mutate.py NAME ; patches src/app.html then builds
- `reviewA2/code/s/p1-math.js`: "Show the math" open state is one variable for both bays
- `reviewA2/code/s/p10-migrate.js`: saved-state migration and validators
- `reviewA2/code/s/p11-stale.js`: shots.js s3 step: after a Bolted switch, it waits 400 ms, then reads the element unless it says 'working it out'.
- `reviewA2/code/s/p12-flows.js`: interaction flows with the element open: after each, both bays must show what a fresh load of the same state shows
- `reviewA2/code/s/p13-nested.js`: A full redraw of the Rex + Ollie element while its distance box holds a typed, uncommitted value: Chromium fires
- `reviewA2/code/s/p14-reopen.js`: close, change settings while closed (no two-player calls may run), reopen: the element shows the new settings' result
- `reviewA2/code/s/p5-midsearch.js`: shots.js's mid-search check, with a choice of Rex tab: does the two-player search still finish?
- `reviewA2/code/s/p7-drag.js`: main-thread blocking while a sidebar slider other than the strength dial is dragged, element open vs closed
- `reviewA2/code/s/p8-rexopen.js`: Rex's Throw with the Rex + Ollie element closed vs open (after a redraw of both bays)
- `reviewA2/code/s/p9-angle.js`: dragging Rex's Throw angle slider: how long the main thread is blocked, element closed vs open (each tab)
- `reviewA2/copy/cases.js`: Focused cases for the footing claims.
- `reviewA2/copy/collide.js`: Collide footing lines under footing combos.
- `reviewA2/copy/harness.js`: Shared harness: wrap a build in a page and open it with a given saved state.
- `reviewA2/copy/panels.js`: Open every sidebar panel and the Rex + Ollie element; dump their text.
- `reviewA2/copy/sidebar.js`: Read the sidebar text and summaries in many states.
- `reviewA2/copy/sweep.js`: Every tab in both bays across footing/switch states: collect text, search for retired wording, save texts.
- `reviewA2/copy/whole.js`: Whole-page text outside the bays (sources table, assumption cards, feats, ladder) for both builds.
- `reviewA2/equivalence/cases.js`: Round 2 case list: a seeded random sample of saved states plus systematic edge cases.
- `reviewA2/equivalence/cases2.js`: Targeted cases: braced migration, saved group 'duo', settings changed through the controls while the Rex + Ollie
- `reviewA2/equivalence/compare.js`: Compare main vs branch results after mapping main's text through the intended wording changes.
- `reviewA2/equivalence/compare2.js`: Targeted cases: braced migration (branch(braced) == branch(friction) == main(friction) after the intended edits),
- `reviewA2/equivalence/harness.js`: Round 2 equivalence harness: load main's build and the branch's build with the same saved state, visit tabs, and
- `reviewA2/equivalence/intended.js`: main's text -&gt; the branch's text, for the wording changes the branch makes on purpose (from git diff main...claude/rex-gui-a)
- `reviewA2/equivalence/probe/seq2.js`: Reproduce seq2-open: footing toggled with the two-player tests showing, then read Rex's Throw courtesy ceiling.
- `reviewA2/verify-copy/h.js`: usage: node h.js &lt;page: new|main&gt; '&lt;json state&gt;' &lt;which: solo|duo&gt; [more states...]
- `reviewA2/verify-equivalence/sprint-gentle.js`: Reproduce: bolted Sprint at an effort below his own weight (engine returns tooGentle)
- `reviewA2/verify-equivalence/sprint-presets.js`: Can a heroic preset (least / ceiling) land a bolted Sprint below his weight (tooGentle) without the slider?
- `reviewA2/verify-ux/live.js`: Watch #duo-live. Open on Arm wrestle, click Collide, close the element after `closeAfter` ms (by clicking its summary),
- `reviewA2/verify-ux/reach.js`: With the Rex + Ollie element open and scrolled into view, wheel over the sidebar until Their powers / Bolted is on screen.
- `reviewA2/verify-ux/wheel.js`: Turn the mouse wheel over the sidebar and record page scrollY / sidebar scrollTop after each notch.

<details><summary>All 95 files</summary>

`reviewA2/brief/cmp.js`, `reviewA2/brief/probe1.js`, `reviewA2/brief/probe2.js`, `reviewA2/brief/probe3.js`, `reviewA2/brief/probe4.js`, `reviewA2/brief/probe5.js`, `reviewA2/brief/probe6.js`, `reviewA2/brief/probe7.js`, `reviewA2/brief/probe8.js`, `reviewA2/brief/shot1.js`, `reviewA2/brief/wrap.js`, `reviewA2/code/s/equiv.js`, `reviewA2/code/s/h.js`, `reviewA2/code/s/mutate.py`, `reviewA2/code/s/p-sand.js`, `reviewA2/code/s/p1-math.js`, `reviewA2/code/s/p10-migrate.js`, `reviewA2/code/s/p11-stale.js`, `reviewA2/code/s/p12-flows.js`, `reviewA2/code/s/p13-nested.js`, `reviewA2/code/s/p14-reopen.js`, `reviewA2/code/s/p15-focus.js`, `reviewA2/code/s/p5-midsearch.js`, `reviewA2/code/s/p7-drag.js`, `reviewA2/code/s/p8-rexopen.js`, `reviewA2/code/s/p9-angle.js`, `reviewA2/copy/cases.js`, `reviewA2/copy/catch.js`, `reviewA2/copy/collide.js`, `reviewA2/copy/eng.js`, `reviewA2/copy/harness.js`, `reviewA2/copy/mainarm.js`, `reviewA2/copy/panels.js`, `reviewA2/copy/sidebar.js`, `reviewA2/copy/sweep.js`, `reviewA2/copy/whole.js`, `reviewA2/equivalence/cases.js`, `reviewA2/equivalence/cases2.js`, `reviewA2/equivalence/compare.js`, `reviewA2/equivalence/compare2.js`, `reviewA2/equivalence/harness.js`, `reviewA2/equivalence/intended.js`, `reviewA2/equivalence/probe/group.js`, `reviewA2/equivalence/probe/seq2.js`, `reviewA2/equivalence/probe/sprint-min.js`, `reviewA2/ux/arrows.js`, `reviewA2/ux/ax.js`, `reviewA2/ux/contrast.js`, `reviewA2/ux/edge.js`, `reviewA2/ux/elshots.js`, `reviewA2/ux/focus.js`, `reviewA2/ux/layout.js`, `reviewA2/ux/lib.js`, `reviewA2/ux/live.js`, `reviewA2/ux/live2.js`, `reviewA2/ux/live2fix.js`, `reviewA2/ux/misc.js`, `reviewA2/ux/phone.js`, `reviewA2/ux/reach.js`, `reviewA2/ux/reachfix.js`, `reviewA2/ux/rexonly.js`, `reviewA2/ux/slider.js`, `reviewA2/ux/taborder.js`, `reviewA2/ux/timing.js`, `reviewA2/ux/touch.js`, `reviewA2/ux/wheel.js`, `reviewA2/ux/wheel2.js`, `reviewA2/ux/wheel3.js`, `reviewA2/ux/wheelfix.js`, `reviewA2/verify-brief/probe.js`, `reviewA2/verify-brief/probe_walk.js`, `reviewA2/verify-code/c1-resize.js`, `reviewA2/verify-code/c2-open-vs-closed.js`, `reviewA2/verify-code/c3-midsearch.js`, `reviewA2/verify-code/c4-math.js`, `reviewA2/verify-code/fixall/test/shots2.js`, `reviewA2/verify-code/h.js`, `reviewA2/verify-code/lab/test/shots2.js`, `reviewA2/verify-code/m-kill-duo/test/shots2.js`, `reviewA2/verify-code/m-leak-cap/test/shots2.js`, `reviewA2/verify-code/m-leak-isduo/test/shots2.js`, `reviewA2/verify-code/mut.py`, `reviewA2/verify-code/shots2.js`, `reviewA2/verify-code/wrap.js`, `reviewA2/verify-copy/c2b.js`, `reviewA2/verify-copy/c5.js`, `reviewA2/verify-copy/duo-cases.js`, `reviewA2/verify-copy/eng-sprint.js`, `reviewA2/verify-copy/h.js`, `reviewA2/verify-equivalence/effort-text.js`, `reviewA2/verify-equivalence/sprint-gentle.js`, `reviewA2/verify-equivalence/sprint-presets.js`, `reviewA2/verify-ux/live.js`, `reviewA2/verify-ux/reach.js`, `reviewA2/verify-ux/wheel.js`

</details>

## reviewA3/

A, review round 3: the reviewers' and verifiers' repro scripts.

116 files, 238 KB.

- `reviewA3/code/closed.js`: With the Rex + Ollie element closed, settings changes, Rex's tabs, a record-book run and a resize run no two-player
- `reviewA3/code/equiv.js`: Compare every tab's result text between main's build and the branch build for a few saved states.
- `reviewA3/code/h.js`: helper: wrap a dist/index.html into a page and open it
- `reviewA3/code/lag.js`: Does moving a Rex-only control (his Throw effort slider) redraw the Rex + Ollie element, and how much main-thread
- `reviewA3/code/leak.js`: Probe the two-player effort cap: every solo engine call made outside a two-player render or probe must get Rex's full
- `reviewA3/code/mutfx.js`: What the surviving mutants do on the page (and the real page for comparison), plus the arrow keys in both tab rows.
- `reviewA3/code/nested.js`: Rex's distance box with a typed, uncommitted value when a redraw removes it (a resize): main vs the branch, and the
- `reviewA3/code/solo-open.js`: Every Rex tab reads the same with the Rex + Ollie element closed, open, and open with its search running in the
- `reviewA3/equivalence/cases-extra.js`: Extra cases: braced migration, saved group 'duo', the element closed, and a 390 px subset.
- `reviewA3/equivalence/cases.js`: Round 3 equivalence cases: a seeded random sample of saved states plus systematic edge cases.
- `reviewA3/equivalence/compare.js`: Compare main vs branch results after mapping main's text through the intended wording changes.
- `reviewA3/equivalence/harness.js`: Round 3 equivalence harness: load main's build and the branch's build with the same saved state, visit tabs, and
- `reviewA3/equivalence/intended.js`: main's text -&gt; the branch's text, for each wording change the branch makes on purpose (git diff main...claude/rex-gui-a).
- `reviewA3/equivalence/probe/seq.js`: Interaction sequences on the branch page, then the same final saved state loaded fresh on main (and on the branch):
- `reviewA3/equivalence/probe/sprint-claim.js`: "in this sim his speed comes only from the force he has beyond his own weight" (branch Sprint, too-gentle item):
- `reviewA3/equivalence/probe/wrestle-soft-canon.js`: Wrestle push on sand with a heavy Rex: does the walking-drive sentence and formula match the engine's numbers?
- `reviewA3/equivalence/probe/wrestle-soft.js`: Wrestle push on sand with a heavy Rex: does the walking-drive sentence and formula match the engine's numbers?
- `reviewA3/ux/bgfocus.js`: focus inside each bay while that bay's (or the other bay's) background search finishes
- `reviewA3/ux/cuefix.js`: Patched copy: scroll shadows on the sticky sidebar (CSS only), light and dark, top/middle/end of its own scroll
- `reviewA3/ux/jump.js`: Reading the Rex + Ollie result at 1280x900: does a sidebar change make it jump?
- `reviewA3/ux/odrag.js`: Ollie's density slider moved 10 steps by keyboard with a slow two-player test showing: long tasks, branch vs main
- `reviewA3/ux/reveal.js`: Scroll the page top to bottom with the pointer over the results (not the sidebar), as a reader does.
- `reviewA3/ux/reveal2.js`: Same as reveal.js with real mouse-wheel notches over the results column, 1366x768, branch and main
- `reviewA3/ux/ringclip.js`: Tab through the sticky sidebar: is any focused control's 3px+2px focus ring cut off by the sidebar's scroll box?
- `reviewA3/ux/scrollbars.js`: What the stuck sidebar looks like with real scrollbars: classic (Windows/Linux default) and overlay (macOS, touch)
- `reviewA3/ux/slowgrid.js`: the slowest two-player redraws after a strength chip, with the element open (1280x900)
- `reviewA3/verify-equivalence/run-allout.js`: usage: node run.js &lt;branch|main&gt; '&lt;json state&gt;' [regex filter]
- `reviewA3/verify-equivalence/run.js`: usage: node run.js &lt;branch|main&gt; '&lt;json state&gt;' [regex filter]
- `reviewA3/verify-ux/v1.js`: Independent check of ux-1: does page scrolling (pointer over results) ever bring Ground / Their powers on screen?
- `reviewA3/verify-ux/v2.js`: Real wheel notches over the results column; screenshots of the stuck sidebar; what is at the clip line.
- `reviewA3/verify-ux/v3.js`: (a) classic scrollbars: is there a scrollbar cue when not hidden? (b) a candidate fix injected into a copy.

<details><summary>All 116 files</summary>

`reviewA3/brief/eng.js`, `reviewA3/brief/lib.js`, `reviewA3/brief/p1.js`, `reviewA3/brief/p10.js`, `reviewA3/brief/p2.js`, `reviewA3/brief/p3.js`, `reviewA3/brief/p3b.js`, `reviewA3/brief/p4.js`, `reviewA3/brief/p5.js`, `reviewA3/brief/p6.js`, `reviewA3/brief/p7.js`, `reviewA3/brief/p8.js`, `reviewA3/brief/p9.js`, `reviewA3/code/closed.js`, `reviewA3/code/equiv.js`, `reviewA3/code/h.js`, `reviewA3/code/lag.js`, `reviewA3/code/leak.js`, `reviewA3/code/mainthrow.js`, `reviewA3/code/mutfx.js`, `reviewA3/code/nested.js`, `reviewA3/code/solo-open.js`, `reviewA3/copy/duo.js`, `reviewA3/copy/eng.js`, `reviewA3/copy/lib.js`, `reviewA3/copy/mainduo.js`, `reviewA3/copy/solo.js`, `reviewA3/copy/sweep.js`, `reviewA3/copy/t1.js`, `reviewA3/copy/t2.js`, `reviewA3/copy/t3.js`, `reviewA3/copy/t4.js`, `reviewA3/equivalence/cases-extra.js`, `reviewA3/equivalence/cases.js`, `reviewA3/equivalence/compare.js`, `reviewA3/equivalence/harness.js`, `reviewA3/equivalence/intended.js`, `reviewA3/equivalence/probe/arm-sand.js`, `reviewA3/equivalence/probe/seq.js`, `reviewA3/equivalence/probe/sprint-claim.js`, `reviewA3/equivalence/probe/widths.js`, `reviewA3/equivalence/probe/wrestle-soft-canon.js`, `reviewA3/equivalence/probe/wrestle-soft.js`, `reviewA3/ux/arrows.js`, `reviewA3/ux/asidex.js`, `reviewA3/ux/ax.js`, `reviewA3/ux/bgfocus.js`, `reviewA3/ux/closedcalls.js`, `reviewA3/ux/contrast.js`, `reviewA3/ux/cuefix.js`, `reviewA3/ux/focus.js`, `reviewA3/ux/jump.js`, `reviewA3/ux/layout.js`, `reviewA3/ux/lib.js`, `reviewA3/ux/live.js`, `reviewA3/ux/live2.js`, `reviewA3/ux/loadpaint.js`, `reviewA3/ux/math.js`, `reviewA3/ux/misc.js`, `reviewA3/ux/odrag.js`, `reviewA3/ux/phone.js`, `reviewA3/ux/reach.js`, `reviewA3/ux/reveal.js`, `reviewA3/ux/reveal2.js`, `reviewA3/ux/ringclip.js`, `reviewA3/ux/scrollbars.js`, `reviewA3/ux/slowgrid.js`, `reviewA3/ux/sticky.js`, `reviewA3/ux/stuckshots.js`, `reviewA3/ux/summarykeys.js`, `reviewA3/ux/taborder.js`, `reviewA3/ux/targets.js`, `reviewA3/ux/timing.js`, `reviewA3/ux/view.js`, `reviewA3/ux/wheel.js`, `reviewA3/verify-brief/v1.js`, `reviewA3/verify-brief/v1b.js`, `reviewA3/verify-brief/v2.js`, `reviewA3/verify-brief/v2b.js`, `reviewA3/verify-brief/v2c.js`, `reviewA3/verify-brief/v2d.js`, `reviewA3/verify-brief/v3.js`, `reviewA3/verify-brief/v3b.js`, `reviewA3/verify-brief/v3c.js`, `reviewA3/verify-brief/v3d.js`, `reviewA3/verify-code/mkmut.py`, `reviewA3/verify-code/v12.js`, `reviewA3/verify-code/v2full.js`, `reviewA3/verify-code/v3.js`, `reviewA3/verify-code/v4.js`, `reviewA3/verify-code/v4b.js`, `reviewA3/verify-code/v4c.js`, `reviewA3/verify-copy/c1.js`, `reviewA3/verify-copy/c1b.js`, `reviewA3/verify-copy/c2.js`, `reviewA3/verify-copy/c2b.js`, `reviewA3/verify-copy/c3.js`, `reviewA3/verify-copy/c4.js`, `reviewA3/verify-copy/c5.js`, `reviewA3/verify-copy/c6.js`, `reviewA3/verify-copy/c7.js`, `reviewA3/verify-copy/c7b.js`, `reviewA3/verify-copy/c8.js`, `reviewA3/verify-copy/c8b.js`, `reviewA3/verify-copy/c9.js`, `reviewA3/verify-copy/e5.js`, `reviewA3/verify-copy/eng1.js`, `reviewA3/verify-copy/lib.js`, `reviewA3/verify-equivalence/footing-probe.js`, `reviewA3/verify-equivalence/run-allout.js`, `reviewA3/verify-equivalence/run.js`, `reviewA3/verify-equivalence/sprint-probe.js`, `reviewA3/verify-ux/v1.js`, `reviewA3/verify-ux/v2.js`, `reviewA3/verify-ux/v3.js`, `reviewA3/verify-ux/v4.js`

</details>

## reviewA4/

A, review round 4: the reviewers' and verifiers' repro scripts.

84 files, 127 KB.

- `reviewA4/code/p1-cue.js`: cue staleness: content in the sidebar grows below the edge with no scroll, toggle or resize
- `reviewA4/code/p2-bg.js`: the two-player effort found by a background search (every two-player call slowed) equals the one found in a render
- `reviewA4/code/p3-mutA.js`: mutant A (probes outside a render run without two-player mode): what the page shows when the search finishes in the background
- `reviewA4/code/p6-nested.js`: the round 2 scenario: a typed, uncommitted distance in the element, then a resize. Does Rex's bay get drawn while two-player mode is on?
- `reviewA4/code/p7-drag.js`: type a goal, then grab Rex's effort slider and drag it: does the drag survive the goal's commit (main: sync redraw; branch: deferred)?
- `reviewA4/code/p8-cue2.js`: the cue when the sidebar starts to overflow from a change inside it, with no scroll, toggle or resize
- `reviewA4/copy/e1.js`: Does the Sources 'Ground shear strength' row's clay value drive anything besides the bolted tear-out?
- `reviewA4/copy/p20.js`: The Walk tab's clay footprint uses the clay values of the Sources row 'Ground shear strength (where the ground tears out around bolted feet)'
- `reviewA4/copy/p4.js`: For each solo tab, compare bay text with Rex bolted vs standing, over grounds and strengths and efforts
- `reviewA4/ux/ax.js`: Accessibility tree: Bolted names, tab list names, aria-controls/labelledby pairs, the h2 in the summary, the cue
- `reviewA4/ux/copy360.js`: The round 3 copy changes at phone width: overflow, broken text, and that the new sentences appear
- `reviewA4/ux/cueback.js`: Shift+Tab from Rex's selected tab back into the sidebar: is the control focused under the cue?
- `reviewA4/ux/cuechip.js`: The cue against content whose height changes without a scroll, toggle or resize: the strength dial's text
- `reviewA4/ux/cuechip2.js`: The cue against content whose height changes without a scroll, toggle or resize: the strength dial's text
- `reviewA4/ux/cueclick.js`: A mouse click on a control showing through the cue's fade
- `reviewA4/ux/cuecontrast.js`: The cue's text against what is painted behind it, in every theme combination (from a screenshot of the cue band
- `reviewA4/ux/cuefocus.js`: Tab through the sidebar on a wide screen: is a focused control ever under the 'More below' cue?
- `reviewA4/ux/cuefocus2.js`: Tab through the sidebar on a wide screen: is a focused control ever under the 'More below' cue?
- `reviewA4/ux/cueself.js`: The cue's own space keeps it showing after everything else fits: 1280x720, close Size and density
- `reviewA4/ux/cueshots.js`: screenshots of keyboard focus landing under the cue
- `reviewA4/ux/cuestale.js`: Does the cue follow content changes inside the sidebar that are not a scroll, a details toggle or a resize?
- `reviewA4/ux/cuestale2.js`: Branch: the cue hidden because everything fits; a strength chip with a longer quote then pushes Their powers below
- `reviewA4/ux/cuesum.js`: 1280x700 and 1280x720: close Size and density, then click the middle of the 'Their powers' summary text
- `reviewA4/ux/h.js`: shared helpers for the round 4 ux lens
- `reviewA4/ux/keys.js`: Keyboard: the Tab sequence with the element open, focus visibility, the cue never focused, arrow keys in both lists
- `reviewA4/ux/layout.js`: The viewport x theme matrix: overflow, sidebar order, Size and density default, the cue, the element closed and
- `reviewA4/ux/longtask.js`: Longest main-thread block after a change, branch (element open) vs main (Rex + Ollie view), real-muscle Catch with a bus
- `reviewA4/ux/stuck.js`: The sticky sidebar beside the open element at 1280x900, light and dark: screenshots while reading the element
- `reviewA4/ux/timing.js`: Response time with the element open: strength chip and surface changes on the slowest two-player tests.
- `reviewA4/ux/typed.js`: Typed boxes (setIn now redraws after a timeout): focus after Enter and after Tab, in each bay and the sidebar,
- `reviewA4/verify-code/c1-bg.js`: code-1: the effort a background two-player search settles on, branch vs mutant A, with and without slowed calls
- `reviewA4/verify-code/c2-nested.js`: code-2: round 2's scenario (typed, uncommitted distance in the element, then a resize): does Rex's bay get drawn
- `reviewA4/verify-code/c3-ground.js`: code-3: where the Ground menu sits, and the proposed shots.js check, on the branch and on mutant C
- `reviewA4/verify-ux/click.js`: Mouse: click a control that shows through the cue's transparent fade
- `reviewA4/verify-ux/focus.js`: Tab through the page from the top; for each focused control inside the sidebar, record its rect, the cue rect,
- `reviewA4/verify-ux/patch.js`: Build patched copies of the branch's dist: fix2 = ux-2's proposed JS fix; fix123 = all three fixes
- `reviewA4/verify-ux/scan.js`: Scan window heights: in each state after a strength chip / slider change, is the cue's state wrong?
- `reviewA4/verify-ux/selfsust.js`: (a) close Size and density while the cue shows; does the cue stay up only because of its own height?
- `reviewA4/verify-ux/stale.js`: (b) the cue is hidden (box at its end); a strength chip makes the dial taller; does the cue come back?

<details><summary>All 84 files</summary>

`reviewA4/code/lib.js`, `reviewA4/code/p1-cue.js`, `reviewA4/code/p2-bg.js`, `reviewA4/code/p3-mutA.js`, `reviewA4/code/p4-state.js`, `reviewA4/code/p5-cuefocus.js`, `reviewA4/code/p6-nested.js`, `reviewA4/code/p7-drag.js`, `reviewA4/code/p8-cue2.js`, `reviewA4/copy/e1.js`, `reviewA4/copy/e2.js`, `reviewA4/copy/lib.js`, `reviewA4/copy/lib2.js`, `reviewA4/copy/p1.js`, `reviewA4/copy/p10.js`, `reviewA4/copy/p11.js`, `reviewA4/copy/p12.js`, `reviewA4/copy/p13.js`, `reviewA4/copy/p14.js`, `reviewA4/copy/p15.js`, `reviewA4/copy/p16.js`, `reviewA4/copy/p17.js`, `reviewA4/copy/p18.js`, `reviewA4/copy/p19.js`, `reviewA4/copy/p2.js`, `reviewA4/copy/p20.js`, `reviewA4/copy/p21.js`, `reviewA4/copy/p3.js`, `reviewA4/copy/p4.js`, `reviewA4/copy/p5.js`, `reviewA4/copy/p6.js`, `reviewA4/copy/p7.js`, `reviewA4/copy/p8.js`, `reviewA4/copy/p9.js`, `reviewA4/copy/wrap.js`, `reviewA4/ux/ax.js`, `reviewA4/ux/copy360.js`, `reviewA4/ux/cueback.js`, `reviewA4/ux/cuechip.js`, `reviewA4/ux/cuechip2.js`, `reviewA4/ux/cueclick.js`, `reviewA4/ux/cuecontrast.js`, `reviewA4/ux/cuefocus.js`, `reviewA4/ux/cuefocus2.js`, `reviewA4/ux/cueself.js`, `reviewA4/ux/cueshots.js`, `reviewA4/ux/cuestale.js`, `reviewA4/ux/cuestale2.js`, `reviewA4/ux/cuesum.js`, `reviewA4/ux/forced.js`, `reviewA4/ux/forced2.js`, `reviewA4/ux/h.js`, `reviewA4/ux/keys.js`, `reviewA4/ux/layout.js`, `reviewA4/ux/live.js`, `reviewA4/ux/longtask.js`, `reviewA4/ux/phone.js`, `reviewA4/ux/scrollcost.js`, `reviewA4/ux/stuck.js`, `reviewA4/ux/timing.js`, `reviewA4/ux/typed.js`, `reviewA4/verify-code/c1-bg.js`, `reviewA4/verify-code/c2-nested.js`, `reviewA4/verify-code/c3-ground.js`, `reviewA4/verify-code/mutate.py`, `reviewA4/verify-code/mutate2.py`, `reviewA4/verify-copy/h.js`, `reviewA4/verify-copy/v1.js`, `reviewA4/verify-copy/v2.js`, `reviewA4/verify-copy/v3a.js`, `reviewA4/verify-copy/v3e.js`, `reviewA4/verify-copy/v3p.js`, `reviewA4/verify-copy/v4.js`, `reviewA4/verify-ux/before.js`, `reviewA4/verify-ux/click.js`, `reviewA4/verify-ux/common.js`, `reviewA4/verify-ux/focus.js`, `reviewA4/verify-ux/forced.js`, `reviewA4/verify-ux/load1250.js`, `reviewA4/verify-ux/patch.js`, `reviewA4/verify-ux/scan.js`, `reviewA4/verify-ux/selfsust.js`, `reviewA4/verify-ux/shot.js`, `reviewA4/verify-ux/stale.js`

</details>

## a/

A: page probes (the sidebar cue, the Rex + Ollie element, smoke tests).

7 files, 11 KB.


<details><summary>All 7 files</summary>

`a/cue.js`, `a/cueclick.js`, `a/cuefocus.js`, `a/diffcases.js`, `a/pending.js`, `a/shot2.js`, `a/smoke.js`

</details>

## reviewB1/

B, review round 1: the reviewers' and verifiers' repro scripts.

181 files, 214 KB.

- `reviewB1/air/page.js`: usage: const {withPage} = require('./page.js'); await withPage(async (page, load) =&gt; { await load(state, effort); ... })
- `reviewB1/code/mut/effect.js`: does each mutation change a powers-off result that the page can show?
- `reviewB1/code/mut/run-off.js`: node run-off.js &lt;engine file&gt;: part 1 of test/powers.js (powers left out) against a given engine
- `reviewB1/code/mut2/emut.js`: engine mutations against test/powers.js --skip-off (each in its own copy of the lab)
- `reviewB1/code/off-page-allout.js`: main's page (its comic switches off) against the branch's page with the four powers off: every solo tab at a few
- `reviewB1/code/off-page.js`: main's page (its comic switches off) against the branch's page with the four powers off: every solo tab at a few
- `reviewB1/code/side-fast.js`: the lower-the-slider hint when its 0% search has to finish in the background: the page's clock runs 200x fast, so
- `reviewB1/code/side-slow.js`: the lower-the-slider hint when its 0% search has to finish in the background (each throw slowed by 3 ms)
- `reviewB1/copy/claims/h.js`: harness: node h.js scenarios.json  -&gt; prints bay text per scenario
- `reviewB1/copy/dump.js`: node dump.js '&lt;json array of specs&gt;'  spec: {state, tab, duo, effort, label}
- `reviewB1/copy/h.js`: Reconstructed shared harness (the copy-lens reviewer overwrote an earlier h.js here by accident; this restores the
- `reviewB1/ground/page.js`: usage: node page.js '&lt;json state&gt;' [selector-to-print] [waitSeconds]
- `reviewB1/verify-copy/s/page.js`: usage: node page.js '&lt;state json&gt;' [effortValue] [duoEffortValue] [sel]

<details><summary>All 181 files</summary>

`reviewB1/air/env.js`, `reviewB1/air/p1-allstar.js`, `reviewB1/air/p2-catch.js`, `reviewB1/air/p3-burst.js`, `reviewB1/air/p4-default.js`, `reviewB1/air/page.js`, `reviewB1/air/t1-vacuum.js`, `reviewB1/air/t10-shakefrom.js`, `reviewB1/air/t11-firstcontact.js`, `reviewB1/air/t12-hand.js`, `reviewB1/air/t2-ocean.js`, `reviewB1/air/t3-sweep.js`, `reviewB1/air/t4-allstar.js`, `reviewB1/air/t5-catchfast.js`, `reviewB1/air/t6-catchblast.js`, `reviewB1/air/t7-relcatch.js`, `reviewB1/air/t8-snowplow.js`, `reviewB1/air/t9-relcatch2.js`, `reviewB1/brief/p1.js`, `reviewB1/brief/p10.js`, `reviewB1/brief/p11.js`, `reviewB1/brief/p2.js`, `reviewB1/brief/p3.js`, `reviewB1/brief/p4.js`, `reviewB1/brief/p5.js`, `reviewB1/brief/p6.js`, `reviewB1/brief/p7.js`, `reviewB1/brief/p8.js`, `reviewB1/brief/p9.js`, `reviewB1/brief/page.js`, `reviewB1/brief/setup.js`, `reviewB1/brief/t1.js`, `reviewB1/brief/t10.js`, `reviewB1/brief/t11.js`, `reviewB1/brief/t12.js`, `reviewB1/brief/t13.js`, `reviewB1/brief/t2.js`, `reviewB1/brief/t3.js`, `reviewB1/brief/t4.js`, `reviewB1/brief/t5.js`, `reviewB1/brief/t6.js`, `reviewB1/brief/t7.js`, `reviewB1/brief/t8.js`, `reviewB1/brief/t9.js`, `reviewB1/code/allstar-off.js`, `reviewB1/code/catch-fireball-page.js`, `reviewB1/code/catch-snowplow.js`, `reviewB1/code/collide-ground.js`, `reviewB1/code/coverage.js`, `reviewB1/code/coverage2.js`, `reviewB1/code/dense-catch.js`, `reviewB1/code/dense-catch2.js`, `reviewB1/code/dense-catch3.js`, `reviewB1/code/duo-ceiling.js`, `reviewB1/code/duo-custom.js`, `reviewB1/code/duo-ground.js`, `reviewB1/code/duo-weak.js`, `reviewB1/code/harness.js`, `reviewB1/code/mut/effect.js`, `reviewB1/code/mut/effect2.js`, `reviewB1/code/mut/make.js`, `reviewB1/code/mut/run-off.js`, `reviewB1/code/mut2/emut.js`, `reviewB1/code/mut2/lab/test/shots5.js`, `reviewB1/code/mut2/pmut.js`, `reviewB1/code/off-page-allout.js`, `reviewB1/code/off-page.js`, `reviewB1/code/side-fast.js`, `reviewB1/code/side-slow.js`, `reviewB1/code/side-switch.js`, `reviewB1/copy/claims/crop.js`, `reviewB1/copy/claims/elshot.js`, `reviewB1/copy/claims/h.js`, `reviewB1/copy/dump.js`, `reviewB1/copy/e1.js`, `reviewB1/copy/e2.js`, `reviewB1/copy/e3.js`, `reviewB1/copy/h.js`, `reviewB1/copy/sweep.js`, `reviewB1/copy/t1.js`, `reviewB1/copy/t2.js`, `reviewB1/copy/t3.js`, `reviewB1/copy/t4.js`, `reviewB1/copy/t5.js`, `reviewB1/copy/t6.js`, `reviewB1/ground/common.js`, `reviewB1/ground/page.js`, `reviewB1/ground/t1.js`, `reviewB1/ground/t10.js`, `reviewB1/ground/t11.js`, `reviewB1/ground/t12.js`, `reviewB1/ground/t13.js`, `reviewB1/ground/t14.js`, `reviewB1/ground/t15.js`, `reviewB1/ground/t16.js`, `reviewB1/ground/t17.js`, `reviewB1/ground/t18.js`, `reviewB1/ground/t2.js`, `reviewB1/ground/t3.js`, `reviewB1/ground/t4.js`, `reviewB1/ground/t5.js`, `reviewB1/ground/t6.js`, `reviewB1/ground/t7.js`, `reviewB1/ground/t8.js`, `reviewB1/ground/t9.js`, `reviewB1/verify-air/v/env.js`, `reviewB1/verify-air/v/f1.js`, `reviewB1/verify-air/v/f10.js`, `reviewB1/verify-air/v/f11.js`, `reviewB1/verify-air/v/f2.js`, `reviewB1/verify-air/v/f3.js`, `reviewB1/verify-air/v/f4.js`, `reviewB1/verify-air/v/f5.js`, `reviewB1/verify-air/v/f8.js`, `reviewB1/verify-air/v/f8b.js`, `reviewB1/verify-air/v/f9.js`, `reviewB1/verify-air/v/page.js`, `reviewB1/verify-air/v/pcatch.js`, `reviewB1/verify-air/v/plegend.js`, `reviewB1/verify-air/v/plegend2.js`, `reviewB1/verify-air/v/pthrow.js`, `reviewB1/verify-brief/pw.js`, `reviewB1/verify-brief/v1.js`, `reviewB1/verify-brief/v1fix.js`, `reviewB1/verify-brief/v1p.js`, `reviewB1/verify-brief/v2.js`, `reviewB1/verify-brief/v2h.js`, `reviewB1/verify-brief/v2h2.js`, `reviewB1/verify-brief/v2p.js`, `reviewB1/verify-brief/v3.js`, `reviewB1/verify-brief/v3p.js`, `reviewB1/verify-brief/v3p2.js`, `reviewB1/verify-brief/v4.js`, `reviewB1/verify-brief/v4fix.js`, `reviewB1/verify-brief/v4p.js`, `reviewB1/verify-brief/v5p.js`, `reviewB1/verify-brief/v6p.js`, `reviewB1/verify-brief/v7.js`, `reviewB1/verify-brief/v7p.js`, `reviewB1/verify-brief/v8p.js`, `reviewB1/verify-code/f1-duo-ground.js`, `reviewB1/verify-code/f1-fix.js`, `reviewB1/verify-code/f1-probe.js`, `reviewB1/verify-code/f2-catch.js`, `reviewB1/verify-code/f2-page.js`, `reviewB1/verify-code/f3-ceiling.js`, `reviewB1/verify-code/f3-fix.js`, `reviewB1/verify-code/f4-page.js`, `reviewB1/verify-code/f5-weak.js`, `reviewB1/verify-code/f6/effect.js`, `reviewB1/verify-code/f6/fixcheck.js`, `reviewB1/verify-code/f6/main-vs-branch.js`, `reviewB1/verify-code/f6/results.js`, `reviewB1/verify-code/f7/effect8.js`, `reviewB1/verify-code/f7/effect8b.js`, `reviewB1/verify-code/lib.js`, `reviewB1/verify-copy/s/env.js`, `reviewB1/verify-copy/s/f1.js`, `reviewB1/verify-copy/s/f10.js`, `reviewB1/verify-copy/s/f10b.js`, `reviewB1/verify-copy/s/f10c.js`, `reviewB1/verify-copy/s/f12.js`, `reviewB1/verify-copy/s/f2.js`, `reviewB1/verify-copy/s/f8.js`, `reviewB1/verify-copy/s/page.js`, `reviewB1/verify-ground/f1.js`, `reviewB1/verify-ground/f10.js`, `reviewB1/verify-ground/f2.js`, `reviewB1/verify-ground/f3.js`, `reviewB1/verify-ground/f3b.js`, `reviewB1/verify-ground/f4.js`, `reviewB1/verify-ground/f5.js`, `reviewB1/verify-ground/f6.js`, `reviewB1/verify-ground/f7.js`, `reviewB1/verify-ground/f7b.js`, `reviewB1/verify-ground/f8.js`, `reviewB1/verify-ground/f9.js`, `reviewB1/verify-ground/f9b.js`, `reviewB1/verify-ground/h.js`, `reviewB1/verify-ground/page.js`, `reviewB1/verify-ground/page2.js`

</details>

## reviewB2/

B, review round 2: the reviewers' and verifiers' repro scripts.

180 files, 781 KB.

- `reviewB2/air/page.js`: usage: node page.js '&lt;json state&gt;' [effort] [bay]  -&gt; prints bay text
- `reviewB2/brief/dump.js`: node dump.js '&lt;json state&gt;' outprefix [effortValue] [duoEffortValue]
- `reviewB2/brief/e3.js`: Unbreakable footing on: does any two-player test or remaining solo move break or sink into the ground?
- `reviewB2/brief/harness.js`: Render the page with a saved state and return bay texts.
- `reviewB2/code/emut/run.sh`: run powers.js --skip-off against a mutant engine: copy lab test dir structure with engine replaced
- `reviewB2/code/genA/make-powers-off.js`: Writes test/fixtures/powers-off.json: a fingerprint of every engine result in test/powers-off-cases.js, from an
- `reviewB2/code/genA/powers-off-cases.js`: The engine calls compared by the powers-off check (test/powers.js): with the four powers of BRIEF-gui.md section 5
- `reviewB2/code/genB/make-powers-off.js`: Writes test/fixtures/powers-off.json: a fingerprint of every engine result in test/powers-off-cases.js, from an
- `reviewB2/code/genB/powers-off-cases.js`: The engine calls compared by the powers-off check (test/powers.js): with the four powers of BRIEF-gui.md section 5
- `reviewB2/code/mut/run1.js`: usage: node run1.js engineFile  -&gt; runs powers-off cases against the committed fixture, stops at first diff
- `reviewB2/code/pmut/make.js`: creates one lab copy per page mutation under pmut/&lt;name&gt;/ (src, test, build.js, assets symlinked), applies it, builds
- `reviewB2/copy/s/batch.js`: usage: node batch.js cases.json &gt; out.txt ; cases: [{label, state, effort, duoEffort, duo, sidebar}]
- `reviewB2/copy/s/full.js`: dump the whole bay text: node full.js '&lt;state&gt;' '&lt;opts&gt;'
- `reviewB2/copy/s/run.js`: usage: node run.js '&lt;state json&gt;' '&lt;opts json&gt;' [label]
- `reviewB2/verify-brief/e-collide.js`: Collide (Ollie charges, Rex bolted) at shared efforts, real ground vs Unbreakable footing
- `reviewB2/verify-brief/e-push.js`: Push match and Collide push, both bolted, on real ground and with Unbreakable footing
- `reviewB2/verify-brief/page.js`: usage: node page.js '&lt;json state&gt;' &lt;bay: duo|solo&gt; &lt;effort id or ''&gt; [custom js]
- `reviewB2/verify-code/buildmut.js`: node buildmut.js &lt;name&gt; &lt;search&gt; &lt;replace&gt;   -&gt; pmut/&lt;name&gt;.html (dist body), from the repo's src
- `reviewB2/verify-code/buildmut2.js`: node buildmut.js &lt;name&gt; &lt;search&gt; &lt;replace&gt;   -&gt; pmut/&lt;name&gt;.html (dist body), from the repo's src
- `reviewB2/verify-code/emut.sh`: emut.sh &lt;name&gt; &lt;python-literal search&gt; &lt;python-literal replace&gt; : run powers.js --skip-off on a mutated engine copy
- `reviewB2/verify-code/f1-densecatch.js`: Finding 1: dense catcher, powers off, branch vs main
- `reviewB2/verify-code/f6-ground.js`: the exact check of test/shots.js lines 457-460, on a given page
- `reviewB2/verify-code/mutrun.js`: usage: node mutrun.js &lt;name&gt; &lt;search&gt; &lt;replace&gt; [keyRegex]
- `reviewB2/verify-copy/page.js`: usage: node page.js &lt;branch|main&gt; '&lt;json spec&gt;'

<details><summary>All 180 files</summary>

`reviewB2/air/allstar.js`, `reviewB2/air/chord.js`, `reviewB2/air/disc.js`, `reviewB2/air/fly1.js`, `reviewB2/air/fly2.js`, `reviewB2/air/fly3.js`, `reviewB2/air/hand2.js`, `reviewB2/air/hand3.js`, `reviewB2/air/k2.js`, `reviewB2/air/near1.js`, `reviewB2/air/page.js`, `reviewB2/air/relcatch.js`, `reviewB2/air/vout.js`, `reviewB2/brief/dump.js`, `reviewB2/brief/e1.js`, `reviewB2/brief/e2.js`, `reviewB2/brief/e3.js`, `reviewB2/brief/e4.js`, `reviewB2/brief/e5.js`, `reviewB2/brief/e6.js`, `reviewB2/brief/e7.js`, `reviewB2/brief/e8.js`, `reviewB2/brief/harness.js`, `reviewB2/brief/p1.js`, `reviewB2/brief/p2.js`, `reviewB2/code/emut/make.js`, `reviewB2/code/emut/run.sh`, `reviewB2/code/genA/make-powers-off.js`, `reviewB2/code/genA/powers-off-cases.js`, `reviewB2/code/genB/make-powers-off.js`, `reviewB2/code/genB/powers-off-cases.js`, `reviewB2/code/lab/test/shots-p.js`, `reviewB2/code/mut/make.js`, `reviewB2/code/mut/run1.js`, `reviewB2/code/pagecmp/cmp.js`, `reviewB2/code/pagecmp/cmpsolo.js`, `reviewB2/code/pmut/make.js`, `reviewB2/code/pmut/p01_preset_moves_slider/test/shots-p.js`, `reviewB2/code/pmut/p02_duo_real_variant_off/test/shots-p.js`, `reviewB2/code/pmut/p03_duo_no_override/test/shots-p.js`, `reviewB2/code/pmut/p04_solo_cE_ignores_real/test/shots-p.js`, `reviewB2/code/pmut/p05_planFor_key_no_air/test/shots-p.js`, `reviewB2/code/pmut/p06_duoKey_no_air/test/shots-p.js`, `reviewB2/code/pmut/p07_hint_always/test/shots-p.js`, `reviewB2/code/pmut/p08_migrate_groundHolds/test/shots-p.js`, `reviewB2/code/pmut/p09_duo_airhint_off/test/shots-p.js`, `reviewB2/code/pmut/p10_slider_no_save/test/shots-p.js`, `reviewB2/code/t/densecatch.js`, `reviewB2/code/t/densecatch2.js`, `reviewB2/code/t/densecatch3.js`, `reviewB2/code/t/densecatch4.js`, `reviewB2/code/t/densecatch5.js`, `reviewB2/code/t/densefast.js`, `reviewB2/code/t/densefast2.js`, `reviewB2/code/t/densesearch.js`, `reviewB2/code/t/handcatch.js`, `reviewB2/code/t/welldom.js`, `reviewB2/code/t2/carried.js`, `reviewB2/code/t2/catchfire.js`, `reviewB2/code/t2/densepage.js`, `reviewB2/code/t2/densepage2.js`, `reviewB2/code/t2/drag.js`, `reviewB2/code/t2/duohint.js`, `reviewB2/code/t2/duohint14.js`, `reviewB2/code/t2/throw14.js`, `reviewB2/copy/s/batch.js`, `reviewB2/copy/s/eng.js`, `reviewB2/copy/s/full.js`, `reviewB2/copy/s/grow.js`, `reviewB2/copy/s/lib.js`, `reviewB2/copy/s/panel.js`, `reviewB2/copy/s/run.js`, `reviewB2/copy/s/shotpanel.js`, `reviewB2/ground/h.js`, `reviewB2/ground/p1.js`, `reviewB2/ground/p2.js`, `reviewB2/ground/p3.js`, `reviewB2/ground/p4.js`, `reviewB2/ground/p5.js`, `reviewB2/ground/page.js`, `reviewB2/ground/t1.js`, `reviewB2/ground/t10.js`, `reviewB2/ground/t11.js`, `reviewB2/ground/t12.js`, `reviewB2/ground/t13.js`, `reviewB2/ground/t14.js`, `reviewB2/ground/t15.js`, `reviewB2/ground/t16.js`, `reviewB2/ground/t17.js`, `reviewB2/ground/t18.js`, `reviewB2/ground/t2.js`, `reviewB2/ground/t3.js`, `reviewB2/ground/t4.js`, `reviewB2/ground/t5.js`, `reviewB2/ground/t6.js`, `reviewB2/ground/t7.js`, `reviewB2/ground/t8.js`, `reviewB2/ground/t9.js`, `reviewB2/verify-air/bend.js`, `reviewB2/verify-air/chord.js`, `reviewB2/verify-air/common.js`, `reviewB2/verify-air/gamma.js`, `reviewB2/verify-air/hand1.js`, `reviewB2/verify-air/hand2.js`, `reviewB2/verify-air/k2.js`, `reviewB2/verify-air/most.js`, `reviewB2/verify-air/near1.js`, `reviewB2/verify-air/p_bend.js`, `reviewB2/verify-air/p_catch.js`, `reviewB2/verify-air/p_hand.js`, `reviewB2/verify-air/p_hand2.js`, `reviewB2/verify-air/p_near.js`, `reviewB2/verify-air/p_wrestle.js`, `reviewB2/verify-air/page.js`, `reviewB2/verify-air/relcatch.js`, `reviewB2/verify-brief/e-catch.js`, `reviewB2/verify-brief/e-collide.js`, `reviewB2/verify-brief/e-pull.js`, `reviewB2/verify-brief/e-pull2.js`, `reviewB2/verify-brief/e-push.js`, `reviewB2/verify-brief/page.js`, `reviewB2/verify-code/buildmut.js`, `reviewB2/verify-code/buildmut2.js`, `reviewB2/verify-code/emut.sh`, `reviewB2/verify-code/f1-defaults.js`, `reviewB2/verify-code/f1-densecatch.js`, `reviewB2/verify-code/f1-fixcheck.js`, `reviewB2/verify-code/f1-gamma.js`, `reviewB2/verify-code/f1-page-fix.js`, `reviewB2/verify-code/f1-page.js`, `reviewB2/verify-code/f1-page2.js`, `reviewB2/verify-code/f1-share.js`, `reviewB2/verify-code/f1-threshold.js`, `reviewB2/verify-code/f2-coverage.js`, `reviewB2/verify-code/f3-fix.js`, `reviewB2/verify-code/f3-handcatch.js`, `reviewB2/verify-code/f3-page.js`, `reviewB2/verify-code/f4-page.js`, `reviewB2/verify-code/f5-page.js`, `reviewB2/verify-code/f6-ground.js`, `reviewB2/verify-code/f7-pass.js`, `reviewB2/verify-code/f8-fix-settles.js`, `reviewB2/verify-code/f8-fix.js`, `reviewB2/verify-code/f8-slider.js`, `reviewB2/verify-code/mutrun.js`, `reviewB2/verify-code/pagelib.js`, `reviewB2/verify-copy/eng.js`, `reviewB2/verify-copy/f1.js`, `reviewB2/verify-copy/f10c.js`, `reviewB2/verify-copy/f13.js`, `reviewB2/verify-copy/f2.js`, `reviewB2/verify-copy/f2b.js`, `reviewB2/verify-copy/f4.js`, `reviewB2/verify-copy/f5.js`, `reviewB2/verify-copy/f6.js`, `reviewB2/verify-copy/f7.js`, `reviewB2/verify-copy/f9.js`, `reviewB2/verify-copy/page.js`, `reviewB2/verify-ground/f1.js`, `reviewB2/verify-ground/f1b.js`, `reviewB2/verify-ground/f2.js`, `reviewB2/verify-ground/f2b.js`, `reviewB2/verify-ground/f2c.js`, `reviewB2/verify-ground/f2d.js`, `reviewB2/verify-ground/f3.js`, `reviewB2/verify-ground/f3b.js`, `reviewB2/verify-ground/f4.js`, `reviewB2/verify-ground/f4b.js`, `reviewB2/verify-ground/f5.js`, `reviewB2/verify-ground/f6.js`, `reviewB2/verify-ground/f6b.js`, `reviewB2/verify-ground/f6c.js`, `reviewB2/verify-ground/f7.js`, `reviewB2/verify-ground/h.js`, `reviewB2/verify-ground/p1.js`, `reviewB2/verify-ground/p2.js`, `reviewB2/verify-ground/p3.js`, `reviewB2/verify-ground/p3b.js`, `reviewB2/verify-ground/p4.js`, `reviewB2/verify-ground/page.js`

</details>

## reviewB3/

B, review round 3: the reviewers' and verifiers' repro scripts.

160 files, 450 KB.

- `reviewB3/air/page.js`: usage: node page.js '&lt;json state&gt;' [effort] [duoEffort] [duo] &gt; out
- `reviewB3/brief/h.js`: harness: node h.js cases.json  -&gt; prints results
- `reviewB3/code/mut.js`: node mut.js &lt;engine.js&gt; [keyRegex] : compare powers-off fingerprints with the committed fixture
- `reviewB3/code/p-sweep.js`: broad sweep: tabs x power combos x dials x efforts; flags NaN/undefined/bare Infinity, 'Calculation failed', console errors
- `reviewB3/code/pw.js`: helpers: open the page with a saved state, settle, read text
- `reviewB3/code/sweep-powers.js`: sweep.js's checks (NaN, negatives) with the four powers on (and at a half share), on the default Rex, plus RESTRAINT blast/shake/reach
- `reviewB3/verify-air/page.js`: usage: node page.js '&lt;json array of cases&gt;'  each case: { id, state, duo: bool, pick }
- `reviewB3/verify-brief/page.js`: usage: node page.js '&lt;json state&gt;' [effortValue] [duoEffortValue] [outname]
- `reviewB3/verify-brief/page_main.js`: usage: node page.js '&lt;json state&gt;' [effortValue] [duoEffortValue] [outname]
- `reviewB3/verify-code/emut/run.js`: engine mutants for test/powers.js --skip-off
- `reviewB3/verify-code/pmut/make.sh`: usage: make.sh id file 'from' 'to'
- `reviewB3/verify-copy/harness.js`: usage: node harness.js cases.json [htmlpath]  -&gt; prints JSON results

<details><summary>All 160 files</summary>

`reviewB3/air/allstar.js`, `reviewB3/air/catchblast.js`, `reviewB3/air/disc.js`, `reviewB3/air/disc2.js`, `reviewB3/air/eiffel.js`, `reviewB3/air/esc.js`, `reviewB3/air/gal.js`, `reviewB3/air/hand0.js`, `reviewB3/air/page.js`, `reviewB3/air/pyr.js`, `reviewB3/air/pyr2.js`, `reviewB3/air/relc.js`, `reviewB3/air/relc2.js`, `reviewB3/air/sheath.js`, `reviewB3/air/split.js`, `reviewB3/air/t1.js`, `reviewB3/air/t2.js`, `reviewB3/air/t3.js`, `reviewB3/air/t4.js`, `reviewB3/air/t5.js`, `reviewB3/air/t6.js`, `reviewB3/air/t7.js`, `reviewB3/air/vac.js`, `reviewB3/brief/e1.js`, `reviewB3/brief/e2.js`, `reviewB3/brief/e3.js`, `reviewB3/brief/e4.js`, `reviewB3/brief/e5.js`, `reviewB3/brief/e6.js`, `reviewB3/brief/h.js`, `reviewB3/brief/t1.js`, `reviewB3/brief/t2.js`, `reviewB3/brief/t3.js`, `reviewB3/brief/t4.js`, `reviewB3/brief/t5.js`, `reviewB3/brief/t6.js`, `reviewB3/code/calib.js`, `reviewB3/code/credit.js`, `reviewB3/code/hand0.js`, `reviewB3/code/mut.js`, `reviewB3/code/p-calib.js`, `reviewB3/code/p-colreal.js`, `reviewB3/code/p-credit.js`, `reviewB3/code/p-credit2.js`, `reviewB3/code/p-duoswitch.js`, `reviewB3/code/p-side.js`, `reviewB3/code/p-sweep.js`, `reviewB3/code/pmutrun/base/test/shots5.js`, `reviewB3/code/pmutrun/e6_shakefrom_landing/test/shots5.js`, `reviewB3/code/pmutrun/p10_old_save_maps_off/test/shots5.js`, `reviewB3/code/pmutrun/p11_hint_always/test/shots5.js`, `reviewB3/code/pmutrun/p12_duo_powers_off_shake/test/shots5.js`, `reviewB3/code/pmutrun/p1_preset_moves_slider/test/shots5.js`, `reviewB3/code/pmutrun/p2_no_solo_hint/test/shots5.js`, `reviewB3/code/pmutrun/p3_no_duo_real/test/shots5.js`, `reviewB3/code/pmutrun/p4_migration_keeps_old/test/shots5.js`, `reviewB3/code/pmutrun/p5_duokey_no_air/test/shots5.js`, `reviewB3/code/pmutrun/p6_no_duo_hint/test/shots5.js`, `reviewB3/code/pmutrun/p7_override_leaks/test/shots5.js`, `reviewB3/code/pmutrun/p8_solo_real_not_drawn/test/shots5.js`, `reviewB3/code/pmutrun/p9_collide_real_no_push/test/shots5.js`, `reviewB3/code/pw.js`, `reviewB3/code/relcatch.js`, `reviewB3/code/shots5.js`, `reviewB3/code/side-scan.js`, `reviewB3/code/side-scan2.js`, `reviewB3/code/sweep-powers.js`, `reviewB3/code/walk.js`, `reviewB3/copy/drop.js`, `reviewB3/copy/dump1.js`, `reviewB3/copy/dump10.js`, `reviewB3/copy/dump11.js`, `reviewB3/copy/dump2.js`, `reviewB3/copy/dump3.js`, `reviewB3/copy/dump4.js`, `reviewB3/copy/dump5.js`, `reviewB3/copy/dump6.js`, `reviewB3/copy/dump7.js`, `reviewB3/copy/dump8.js`, `reviewB3/copy/dump9.js`, `reviewB3/copy/eng.js`, `reviewB3/copy/h.js`, `reviewB3/copy/haz.js`, `reviewB3/copy/ov390.js`, `reviewB3/copy/pr.js`, `reviewB3/copy/pr2.js`, `reviewB3/copy/shotpanel.js`, `reviewB3/ground/common.js`, `reviewB3/ground/p1.js`, `reviewB3/ground/p2.js`, `reviewB3/ground/p3.js`, `reviewB3/ground/p4.js`, `reviewB3/ground/p5.js`, `reviewB3/ground/page.js`, `reviewB3/ground/t1.js`, `reviewB3/ground/t10.js`, `reviewB3/ground/t11.js`, `reviewB3/ground/t12.js`, `reviewB3/ground/t13.js`, `reviewB3/ground/t14.js`, `reviewB3/ground/t2.js`, `reviewB3/ground/t3.js`, `reviewB3/ground/t4.js`, `reviewB3/ground/t5.js`, `reviewB3/ground/t5b.js`, `reviewB3/ground/t6.js`, `reviewB3/ground/t7.js`, `reviewB3/ground/t8.js`, `reviewB3/ground/t9.js`, `reviewB3/verify-air/catchblast.js`, `reviewB3/verify-air/common.js`, `reviewB3/verify-air/disc.js`, `reviewB3/verify-air/eiffel.js`, `reviewB3/verify-air/esc.js`, `reviewB3/verify-air/fixcheck.js`, `reviewB3/verify-air/hand0.js`, `reviewB3/verify-air/page.js`, `reviewB3/verify-air/relc.js`, `reviewB3/verify-air/sheath.js`, `reviewB3/verify-air/sheath2.js`, `reviewB3/verify-brief/common.js`, `reviewB3/verify-brief/f1.js`, `reviewB3/verify-brief/f1b.js`, `reviewB3/verify-brief/f2.js`, `reviewB3/verify-brief/f2b.js`, `reviewB3/verify-brief/f3.js`, `reviewB3/verify-brief/f4.js`, `reviewB3/verify-brief/f5.js`, `reviewB3/verify-brief/page.js`, `reviewB3/verify-brief/page_main.js`, `reviewB3/verify-code/e1-credit.js`, `reviewB3/verify-code/e2-calib.js`, `reviewB3/verify-code/e3-hand.js`, `reviewB3/verify-code/e3b-hint.js`, `reviewB3/verify-code/e5-collide.js`, `reviewB3/verify-code/e5b.js`, `reviewB3/verify-code/emut/run.js`, `reviewB3/verify-code/emut/sem.js`, `reviewB3/verify-code/lib.js`, `reviewB3/verify-code/p1-credit.js`, `reviewB3/verify-code/p1b-credit.js`, `reviewB3/verify-code/p2-calib.js`, `reviewB3/verify-code/p3-hand.js`, `reviewB3/verify-code/p3b-hint.js`, `reviewB3/verify-code/p5-leak.js`, `reviewB3/verify-code/p9-real.js`, `reviewB3/verify-code/pmut/make.sh`, `reviewB3/verify-copy/hand.js`, `reviewB3/verify-copy/harness.js`, `reviewB3/verify-copy/jump.js`, `reviewB3/verify-ground/common.js`, `reviewB3/verify-ground/f1a.js`, `reviewB3/verify-ground/f1b.js`, `reviewB3/verify-ground/f2.js`, `reviewB3/verify-ground/f3.js`, `reviewB3/verify-ground/f4.js`, `reviewB3/verify-ground/f5.js`, `reviewB3/verify-ground/f5b.js`, `reviewB3/verify-ground/f7.js`, `reviewB3/verify-ground/page.js`

</details>

## reviewB4/

B, review round 4: the reviewers' and verifiers' repro scripts.

186 files, 231 KB.

- `reviewB4/air/page.js`: usage: node page.js '&lt;json state&gt;' [effort] [duoEffort] [selector]
- `reviewB4/code/colreal.js`: Collide, Rex bolted, Ollie's charge, 'Break the ground' with Unbreakable footing on: what the effort box says vs the tab
- `reviewB4/code/duochk.js`: generic: load a state into the branch page, optionally pick a duo effort, print the effort box and tab texts
- `reviewB4/code/esc.js`: does any powers-off case reach a supersonic, non-relativistic throw that never lands (the throwBlast fallback)?
- `reviewB4/code/mutate.js`: usage: node mutate.js  -&gt; writes mut/&lt;id&gt;.js for each mutation, checks the find string occurs exactly once
- `reviewB4/code/p9chk.js`: The shots.js two-player break-the-ground check, and a near = 3 m jump case, on a page
- `reviewB4/code/pagecmp.js`: Compare solo and duo tab results between main's page and the branch's page with the four powers off.
- `reviewB4/code/runoff.js`: usage: node runoff.js &lt;engine.js&gt; [filterRegex] [extra: off|none]
- `reviewB4/code/scan.js`: Scan many settings with the powers on (and partly on) for broken text (NaN, undefined, bare Infinity) and page errors.
- `reviewB4/copy/js/run.js`: node run.js scen.js -&gt; writes txt/&lt;name&gt;.txt
- `reviewB4/copy/sd_main.js`: Hand-written parts of the dataset: model assumptions and simple reference scales.
- `reviewB4/ground/page.js`: usage: node page.js '&lt;json state&gt;' [effort] [duo] -&gt; prints bay text
- `reviewB4/verify-air/page.js`: usage: node page.js '&lt;json state&gt;' '&lt;effort&gt;' [duoEffort] [outname]
- `reviewB4/verify-code/page.js`: helper: load page with a saved state, optionally choose duo effort, return #duo-bay text
- `reviewB4/verify-copy/h.js`: usage: node h.js cases.json   -&gt; prints bay text per case

<details><summary>All 186 files</summary>

`reviewB4/air/load.js`, `reviewB4/air/page.js`, `reviewB4/air/t1.js`, `reviewB4/air/t10.js`, `reviewB4/air/t11.js`, `reviewB4/air/t12.js`, `reviewB4/air/t13.js`, `reviewB4/air/t14.js`, `reviewB4/air/t2.js`, `reviewB4/air/t3.js`, `reviewB4/air/t4.js`, `reviewB4/air/t5.js`, `reviewB4/air/t6.js`, `reviewB4/air/t7.js`, `reviewB4/air/t8.js`, `reviewB4/air/t9.js`, `reviewB4/brief/cap.js`, `reviewB4/brief/cap2.js`, `reviewB4/brief/dump.js`, `reviewB4/brief/h.js`, `reviewB4/brief/pg.js`, `reviewB4/brief/t1.js`, `reviewB4/brief/t10.js`, `reviewB4/brief/t11.js`, `reviewB4/brief/t12.js`, `reviewB4/brief/t13.js`, `reviewB4/brief/t14.js`, `reviewB4/brief/t15.js`, `reviewB4/brief/t16.js`, `reviewB4/brief/t17.js`, `reviewB4/brief/t18.js`, `reviewB4/brief/t19.js`, `reviewB4/brief/t2.js`, `reviewB4/brief/t20.js`, `reviewB4/brief/t21.js`, `reviewB4/brief/t3.js`, `reviewB4/brief/t4.js`, `reviewB4/brief/t5.js`, `reviewB4/brief/t6.js`, `reviewB4/brief/t7.js`, `reviewB4/brief/t8.js`, `reviewB4/brief/t9.js`, `reviewB4/brief/toss.js`, `reviewB4/brief/win.js`, `reviewB4/code/capchk.js`, `reviewB4/code/capchk2.js`, `reviewB4/code/capchk3.js`, `reviewB4/code/col1.js`, `reviewB4/code/colreal.js`, `reviewB4/code/duochk.js`, `reviewB4/code/esc.js`, `reviewB4/code/liftchk.js`, `reviewB4/code/liftchk2.js`, `reviewB4/code/mutate.js`, `reviewB4/code/mutate2.js`, `reviewB4/code/mutate3.js`, `reviewB4/code/p9chk.js`, `reviewB4/code/pagecmp.js`, `reviewB4/code/runmut.sh`, `reviewB4/code/runmut2.sh`, `reviewB4/code/runoff.js`, `reviewB4/code/runpt.sh`, `reviewB4/code/scan.js`, `reviewB4/code/showdiff.js`, `reviewB4/copy/js/e1.js`, `reviewB4/copy/js/e2.js`, `reviewB4/copy/js/e3.js`, `reviewB4/copy/js/e4.js`, `reviewB4/copy/js/h.js`, `reviewB4/copy/js/l1.js`, `reviewB4/copy/js/l2.js`, `reviewB4/copy/js/l3.js`, `reviewB4/copy/js/l4.js`, `reviewB4/copy/js/p1.js`, `reviewB4/copy/js/run.js`, `reviewB4/copy/js/s1.js`, `reviewB4/copy/js/s10.js`, `reviewB4/copy/js/s11.js`, `reviewB4/copy/js/s12.js`, `reviewB4/copy/js/s13.js`, `reviewB4/copy/js/s14.js`, `reviewB4/copy/js/s2.js`, `reviewB4/copy/js/s3.js`, `reviewB4/copy/js/s4.js`, `reviewB4/copy/js/s5.js`, `reviewB4/copy/js/s6.js`, `reviewB4/copy/js/s7.js`, `reviewB4/copy/js/s8.js`, `reviewB4/copy/js/s9.js`, `reviewB4/copy/sd_main.js`, `reviewB4/ground/h.js`, `reviewB4/ground/p1.js`, `reviewB4/ground/p10.js`, `reviewB4/ground/p11.js`, `reviewB4/ground/p12.js`, `reviewB4/ground/p13.js`, `reviewB4/ground/p14.js`, `reviewB4/ground/p2.js`, `reviewB4/ground/p3.js`, `reviewB4/ground/p4.js`, `reviewB4/ground/p5.js`, `reviewB4/ground/p6.js`, `reviewB4/ground/p7.js`, `reviewB4/ground/p8.js`, `reviewB4/ground/p9.js`, `reviewB4/ground/page.js`, `reviewB4/ground/t1.js`, `reviewB4/ground/t10.js`, `reviewB4/ground/t11.js`, `reviewB4/ground/t12.js`, `reviewB4/ground/t13.js`, `reviewB4/ground/t14.js`, `reviewB4/ground/t15.js`, `reviewB4/ground/t16.js`, `reviewB4/ground/t17.js`, `reviewB4/ground/t18.js`, `reviewB4/ground/t19.js`, `reviewB4/ground/t2.js`, `reviewB4/ground/t3.js`, `reviewB4/ground/t4.js`, `reviewB4/ground/t5.js`, `reviewB4/ground/t6.js`, `reviewB4/ground/t7.js`, `reviewB4/ground/t8.js`, `reviewB4/ground/t9.js`, `reviewB4/verify-air/page.js`, `reviewB4/verify-air/perf.js`, `reviewB4/verify-air/v1.js`, `reviewB4/verify-air/v1b.js`, `reviewB4/verify-air/v1c.js`, `reviewB4/verify-air/v2.js`, `reviewB4/verify-air/v2b.js`, `reviewB4/verify-brief/f1.js`, `reviewB4/verify-brief/f1b.js`, `reviewB4/verify-brief/f1c.js`, `reviewB4/verify-brief/f2.js`, `reviewB4/verify-brief/f2b.js`, `reviewB4/verify-brief/f2c.js`, `reviewB4/verify-brief/f2d.js`, `reviewB4/verify-brief/f4.js`, `reviewB4/verify-brief/f5.js`, `reviewB4/verify-brief/h.js`, `reviewB4/verify-brief/p1.js`, `reviewB4/verify-brief/p2.js`, `reviewB4/verify-brief/p2b.js`, `reviewB4/verify-brief/p3.js`, `reviewB4/verify-brief/p5.js`, `reviewB4/verify-brief/p5b.js`, `reviewB4/verify-brief/p6.js`, `reviewB4/verify-brief/pg.js`, `reviewB4/verify-code/fix1/game.js`, `reviewB4/verify-code/fix1/sweep.js`, `reviewB4/verify-code/page.js`, `reviewB4/verify-code/v1game.js`, `reviewB4/verify-code/v1page.js`, `reviewB4/verify-code/v1sweep.js`, `reviewB4/verify-code/v1toss.js`, `reviewB4/verify-code/v2page.js`, `reviewB4/verify-code/v3collide.js`, `reviewB4/verify-code/v3eng.js`, `reviewB4/verify-code/v4pull.js`, `reviewB4/verify-code/v4sheath.js`, `reviewB4/verify-code/v4sheath2.js`, `reviewB4/verify-copy/e1.js`, `reviewB4/verify-copy/e2.js`, `reviewB4/verify-copy/e3.js`, `reviewB4/verify-copy/e4.js`, `reviewB4/verify-copy/e5.js`, `reviewB4/verify-copy/h.js`, `reviewB4/verify-ground/harness.js`, `reviewB4/verify-ground/p1.js`, `reviewB4/verify-ground/p12.js`, `reviewB4/verify-ground/p2.js`, `reviewB4/verify-ground/p2b.js`, `reviewB4/verify-ground/p3.js`, `reviewB4/verify-ground/p5.js`, `reviewB4/verify-ground/v1.js`, `reviewB4/verify-ground/v10.js`, `reviewB4/verify-ground/v2.js`, `reviewB4/verify-ground/v3.js`, `reviewB4/verify-ground/v4.js`, `reviewB4/verify-ground/v5.js`, `reviewB4/verify-ground/v6.js`, `reviewB4/verify-ground/v7.js`, `reviewB4/verify-ground/v8.js`, `reviewB4/verify-ground/v9.js`

</details>

## reviewB5/

B, review round 5: the reviewers' and verifiers' repro scripts.

155 files, 398 KB.

- `reviewB5/air/page.js`: usage: node page.js '&lt;json: {state, duo?: bool, effort?: "allout"|..., duoEffort?: ...}&gt;' [outfile]
- `reviewB5/brief/page.js`: usage: node page.js cases.json  -&gt; prints results as JSON lines
- `reviewB5/code/mut/harness.js`: node harness.js &lt;engine.js&gt; [off]: runs the powers-off cases against the committed fixture, prints diffs
- `reviewB5/code/pagerun.js`: node pagerun.js '&lt;json state&gt;' [selectEffort] [duo] : loads the page with the state, prints the bay text
- `reviewB5/code/pagerun2.js`: node pagerun.js '&lt;json state&gt;' [selectEffort] [duo] : loads the page with the state, prints the bay text
- `reviewB5/copy/h.js`: harness: node h.js cases.json -&gt; prints bay text for each case
- `reviewB5/ground/pg.js`: usage: node pg.js '&lt;json array of cases&gt;'  each case { state, effort?, duoEffort?, custom? (log kg), bay: 'bay'|'duo-bay', grep?: regex }
- `reviewB5/ground/t1.js`: 5c: same push, same shaking: stomp, jump, throw on sand & concrete, unbreakable on vs off at equal efforts
- `reviewB5/ground/t2.js`: jump: landing shaking on vs off at equal efforts; where real ground holds (landRatio &lt;= 1)
- `reviewB5/verify-air/pg.js`: node pg.js '&lt;json {state, duo, effort, duoEffort}&gt;' outfile
- `reviewB5/verify-code/page-fix3.js`: usage: node page.js '&lt;json state&gt;' [effortPick] [duoEffortPick] [bayId] [grepRegex]
- `reviewB5/verify-code/page.js`: usage: node page.js '&lt;json state&gt;' [effortPick] [duoEffortPick] [bayId] [grepRegex]

<details><summary>All 155 files</summary>

`reviewB5/air/allstar.js`, `reviewB5/air/dragpath.py`, `reviewB5/air/fireD.js`, `reviewB5/air/flip.js`, `reviewB5/air/hitsground.js`, `reviewB5/air/kepler.py`, `reviewB5/air/load.js`, `reviewB5/air/page.js`, `reviewB5/air/relcatch.js`, `reviewB5/air/sweep.js`, `reviewB5/brief/e1.js`, `reviewB5/brief/e10.js`, `reviewB5/brief/e11.js`, `reviewB5/brief/e2.js`, `reviewB5/brief/e3.js`, `reviewB5/brief/e4.js`, `reviewB5/brief/e5.js`, `reviewB5/brief/e6.js`, `reviewB5/brief/e7.js`, `reviewB5/brief/e8.js`, `reviewB5/brief/e9.js`, `reviewB5/brief/page.js`, `reviewB5/brief/readbox.js`, `reviewB5/code/capbind.js`, `reviewB5/code/colreal.js`, `reviewB5/code/duoflow.js`, `reviewB5/code/inf-cap.js`, `reviewB5/code/inf-cap2.js`, `reviewB5/code/m02probe.js`, `reviewB5/code/m32probe.js`, `reviewB5/code/mut/harness.js`, `reviewB5/code/mut/make.js`, `reviewB5/code/pagerun.js`, `reviewB5/code/pagerun2.js`, `reviewB5/code/pgm/make.js`, `reviewB5/code/pgm/pA_solo_real_run_gone/test/shots5.js`, `reviewB5/code/pgm/pG_override_leaks/test/shots5.js`, `reviewB5/code/pgm/pH_hint_any_share/test/shots5.js`, `reviewB5/code/pm/make.js`, `reviewB5/code/shots5.js`, `reviewB5/copy/h.js`, `reviewB5/copy/pull1.js`, `reviewB5/copy/shots.js`, `reviewB5/copy/shots2.js`, `reviewB5/copy/sum.js`, `reviewB5/copy/t1.js`, `reviewB5/copy/t10.js`, `reviewB5/copy/t11.js`, `reviewB5/copy/t12.js`, `reviewB5/copy/t13.js`, `reviewB5/copy/t14.js`, `reviewB5/copy/t15.js`, `reviewB5/copy/t16.js`, `reviewB5/copy/t17.js`, `reviewB5/copy/t18.js`, `reviewB5/copy/t19.js`, `reviewB5/copy/t2.js`, `reviewB5/copy/t20.js`, `reviewB5/copy/t21.js`, `reviewB5/copy/t22.js`, `reviewB5/copy/t23.js`, `reviewB5/copy/t24.js`, `reviewB5/copy/t25.js`, `reviewB5/copy/t26.js`, `reviewB5/copy/t27.js`, `reviewB5/copy/t28.js`, `reviewB5/copy/t3.js`, `reviewB5/copy/t4.js`, `reviewB5/copy/t5.js`, `reviewB5/copy/t6.js`, `reviewB5/copy/t7.js`, `reviewB5/copy/t8.js`, `reviewB5/copy/t9.js`, `reviewB5/ground/lib.js`, `reviewB5/ground/pg.js`, `reviewB5/ground/t1.js`, `reviewB5/ground/t10.js`, `reviewB5/ground/t11.js`, `reviewB5/ground/t12.js`, `reviewB5/ground/t13.js`, `reviewB5/ground/t14.js`, `reviewB5/ground/t15.js`, `reviewB5/ground/t2.js`, `reviewB5/ground/t3.js`, `reviewB5/ground/t4.js`, `reviewB5/ground/t5.js`, `reviewB5/ground/t6.js`, `reviewB5/ground/t7.js`, `reviewB5/ground/t8.js`, `reviewB5/ground/t9.js`, `reviewB5/verify-air/f1.js`, `reviewB5/verify-air/f2.js`, `reviewB5/verify-air/f3.js`, `reviewB5/verify-air/f5.js`, `reviewB5/verify-air/f6.js`, `reviewB5/verify-air/h.js`, `reviewB5/verify-air/pg.js`, `reviewB5/verify-brief/f1.js`, `reviewB5/verify-brief/f1b.js`, `reviewB5/verify-brief/f1page.js`, `reviewB5/verify-brief/f2.js`, `reviewB5/verify-brief/f2b.js`, `reviewB5/verify-brief/f2c.js`, `reviewB5/verify-brief/f3.js`, `reviewB5/verify-brief/f3page.js`, `reviewB5/verify-brief/f3page2.js`, `reviewB5/verify-brief/f4page.js`, `reviewB5/verify-brief/f5page.js`, `reviewB5/verify-brief/f5page2.js`, `reviewB5/verify-brief/fgate.js`, `reviewB5/verify-brief/fpatch.js`, `reviewB5/verify-brief/fpatch2.js`, `reviewB5/verify-brief/harness.js`, `reviewB5/verify-brief/harness2.js`, `reviewB5/verify-code/colreal.js`, `reviewB5/verify-code/gaps.js`, `reviewB5/verify-code/land.js`, `reviewB5/verify-code/orbit.js`, `reviewB5/verify-code/page-fix3.js`, `reviewB5/verify-code/page.js`, `reviewB5/verify-code/pusht.js`, `reviewB5/verify-code/stomp-inf-fixed.js`, `reviewB5/verify-code/stomp-inf.js`, `reviewB5/verify-code/throw-inf-fixed.js`, `reviewB5/verify-code/throw-inf.js`, `reviewB5/verify-copy/f1.js`, `reviewB5/verify-copy/f1b.js`, `reviewB5/verify-copy/f2.js`, `reviewB5/verify-copy/f3.js`, `reviewB5/verify-copy/f3e.js`, `reviewB5/verify-copy/f3f.js`, `reviewB5/verify-copy/f3g.js`, `reviewB5/verify-copy/f4.js`, `reviewB5/verify-copy/f5.js`, `reviewB5/verify-copy/f6.js`, `reviewB5/verify-copy/f7.js`, `reviewB5/verify-copy/f8.js`, `reviewB5/verify-copy/f9.js`, `reviewB5/verify-copy/f9b.js`, `reviewB5/verify-copy/f9c.js`, `reviewB5/verify-copy/f9d.js`, `reviewB5/verify-copy/harness.js`, `reviewB5/verify-copy/v1.js`, `reviewB5/verify-ground/common.js`, `reviewB5/verify-ground/p1.js`, `reviewB5/verify-ground/p2.js`, `reviewB5/verify-ground/page.js`, `reviewB5/verify-ground/t1.js`, `reviewB5/verify-ground/t2.js`, `reviewB5/verify-ground/t2b.js`, `reviewB5/verify-ground/t2fix.js`, `reviewB5/verify-ground/t3.js`, `reviewB5/verify-ground/t4.js`, `reviewB5/verify-ground/t5.js`, `reviewB5/verify-ground/t6.js`

</details>

## verifyR5/

B, the re-check of round 5's fixes: checkers' and verifiers' scripts.

148 files, 210 KB.

- `verifyR5/blast/lib.js`: load engine from a tree (new|old)
- `verifyR5/blast/pg.js`: node pg.js &lt;tree&gt; '&lt;stateJSON&gt;' &lt;effort&gt; &lt;outfile&gt; [duo]
- `verifyR5/catch/pg.js`: usage: node pg.js '&lt;json array of {name, state, effort}&gt;'
- `verifyR5/copy/mut/muts.js`: [name, from, to] applied to src/engine.js (exactly one occurrence required)
- `verifyR5/duo/imm.js`: Collide, truly immovable Rex, Ollie jumps on him: the take-off's shaking vs the hit's blast, at 61.1 t and 100 t
- `verifyR5/duo/jumppo.js`: solo Jump tab: the push-off source's plaster reach versus effort (powers on, concrete)
- `verifyR5/duo/land.js`: partner landing: ground take and ppv at 5 m versus effort (Rex throws Ollie, powers on, concrete)
- `verifyR5/duo/land2.js`: duoFacts' wrestle throw shaking list [landS, ownS] and the plaster test at near, versus effort
- `verifyR5/duo/land3.js`: duoFacts' wrestle throw shaking list [landS, ownS] and the plaster test at near, versus effort
- `verifyR5/duo/land4.js`: default Wrestle throw (Rex throws Ollie at 45 deg, dial 100 short tons, powers on, concrete): does real ground bear
- `verifyR5/duo/landfix.js`: proposed rule for the thrown partner's landing: sideways whole (he skids it out on unbroken ground) and the downward
- `verifyR5/duo/pg.js`: usage: node pg.js scenarios.json   (array of {name, state, effort, grep})
- `verifyR5/duo/pg2.js`: usage: node pg.js scenarios.json   (array of {name, state, effort, grep})
- `verifyR5/duo/tk.js`: the charger's take-off (chargeTakeoff's rule) versus effort: Ollie jumps / stomp-launches onto standing Rex, powers on
- `verifyR5/ground/jump-land.js`: the landing parts alone (body stop + feet blow), and the push-off alone, vs effort; ON powers
- `verifyR5/ground/jump-land2.js`: the landing parts alone (body stop + feet blow), and the push-off alone, vs effort; ON powers
- `verifyR5/ground/page.js`: usage: node page.js '&lt;state json&gt;' [effort] [grep regex] [duo]
- `verifyR5/ground/pagep.js`: usage: node page.js '&lt;state json&gt;' [effort] [grep regex] [duo]
- `verifyR5/verify-blast/pgfix.js`: usage: node pg.js '&lt;state json&gt;' &lt;effort&gt; &lt;outfile&gt;
- `verifyR5/verify-catch/t1.js`: Sheath-catch flight time: engine's out.time vs numerical integral of ds / v(s) using the engine's own v(s) law
- `verifyR5/verify-catch/t2.js`: check the proposed fix (average of 1/v at the two ends) and the round trip using the engine's legs
- `verifyR5/verify-copy/eff.js`: node eff.js &lt;dir&gt; : the four cases each mutant changes
- `verifyR5/verify-copy/fixcheck.js`: node fixcheck.js &lt;dir&gt;: the sheath check's own cases (arrival speeds) and the proposed extra assertions
- `verifyR5/verify-ground/mono.js`: landing-only (and whole-jump) shaking vs effort, powers on; reports first drop per surface

<details><summary>All 148 files</summary>

`verifyR5/blast/cmp.js`, `verifyR5/blast/indep.py`, `verifyR5/blast/lib.js`, `verifyR5/blast/pg.js`, `verifyR5/blast/t1.js`, `verifyR5/blast/t2.js`, `verifyR5/blast/t3.js`, `verifyR5/blast/t4.js`, `verifyR5/blast/t5.js`, `verifyR5/catch/common.js`, `verifyR5/catch/pg.js`, `verifyR5/catch/pgsolo.js`, `verifyR5/catch/probe1.js`, `verifyR5/catch/probe2.js`, `verifyR5/catch/probe3.js`, `verifyR5/catch/probe4.js`, `verifyR5/catch/probe5.js`, `verifyR5/catch/probe6.js`, `verifyR5/catch/probe7.js`, `verifyR5/catch/probe8.js`, `verifyR5/catch/probeOld.js`, `verifyR5/copy/mut/eq.js`, `verifyR5/copy/mut/m19.js`, `verifyR5/copy/mut/m23.js`, `verifyR5/copy/mut/muts.js`, `verifyR5/copy/mut/muts2.js`, `verifyR5/copy/mut/runmut.js`, `verifyR5/copy/mut/runmut2.js`, `verifyR5/copy/s/eng.js`, `verifyR5/copy/s/harness.js`, `verifyR5/copy/s/j1.js`, `verifyR5/copy/s/p1.js`, `verifyR5/copy/s/p10.js`, `verifyR5/copy/s/p11.js`, `verifyR5/copy/s/p2.js`, `verifyR5/copy/s/p3.js`, `verifyR5/copy/s/p4.js`, `verifyR5/copy/s/p5.js`, `verifyR5/copy/s/p6.js`, `verifyR5/copy/s/p7.js`, `verifyR5/copy/s/p8.js`, `verifyR5/copy/s/p9.js`, `verifyR5/copy/s/repro.js`, `verifyR5/duo/h.js`, `verifyR5/duo/imm.js`, `verifyR5/duo/jumppo.js`, `verifyR5/duo/land.js`, `verifyR5/duo/land2.js`, `verifyR5/duo/land3.js`, `verifyR5/duo/land4.js`, `verifyR5/duo/landfix.js`, `verifyR5/duo/pg.js`, `verifyR5/duo/pg2.js`, `verifyR5/duo/tk.js`, `verifyR5/ground/collide.js`, `verifyR5/ground/env.js`, `verifyR5/ground/envfix.js`, `verifyR5/ground/envfix2.js`, `verifyR5/ground/envfix3.js`, `verifyR5/ground/envfix4.js`, `verifyR5/ground/inf-angled.js`, `verifyR5/ground/inf-angled3.js`, `verifyR5/ground/jump-land.js`, `verifyR5/ground/jump-land2.js`, `verifyR5/ground/jump-mono.js`, `verifyR5/ground/jump-prof.js`, `verifyR5/ground/jump-reach.js`, `verifyR5/ground/land-onoff.js`, `verifyR5/ground/nan-callers.js`, `verifyR5/ground/page.js`, `verifyR5/ground/pagep.js`, `verifyR5/ground/stomp-c.js`, `verifyR5/ground/stomp-c2.js`, `verifyR5/ground/stomp-c3.js`, `verifyR5/ground/stomp-c3f.js`, `verifyR5/ground/stomp-hand.js`, `verifyR5/ground/stomp-mono.js`, `verifyR5/ground/throw-fric.js`, `verifyR5/ground/throw-fric2.js`, `verifyR5/ground/throw-step.js`, `verifyR5/verify-blast/dhalf.js`, `verifyR5/verify-blast/e1.js`, `verifyR5/verify-blast/e1old.js`, `verifyR5/verify-blast/e2.js`, `verifyR5/verify-blast/eng.js`, `verifyR5/verify-blast/pg.js`, `verifyR5/verify-blast/pgfix.js`, `verifyR5/verify-blast/scan.js`, `verifyR5/verify-blast/skeptic-seam/e1.js`, `verifyR5/verify-blast/skeptic-seam/e1old.js`, `verifyR5/verify-blast/skeptic-seam/e2.js`, `verifyR5/verify-blast/skeptic-seam/pgseam.js`, `verifyR5/verify-catch/dense.js`, `verifyR5/verify-catch/eng.js`, `verifyR5/verify-catch/list.js`, `verifyR5/verify-catch/off.js`, `verifyR5/verify-catch/page.js`, `verifyR5/verify-catch/pg.js`, `verifyR5/verify-catch/probe.js`, `verifyR5/verify-catch/probe_old.js`, `verifyR5/verify-catch/t1.js`, `verifyR5/verify-catch/t2.js`, `verifyR5/verify-copy/e1.js`, `verifyR5/verify-copy/e2.js`, `verifyR5/verify-copy/e3.js`, `verifyR5/verify-copy/eff.js`, `verifyR5/verify-copy/eng.js`, `verifyR5/verify-copy/eng2.js`, `verifyR5/verify-copy/fixcheck.js`, `verifyR5/verify-copy/p1.js`, `verifyR5/verify-copy/page.js`, `verifyR5/verify-copy/pastprint/page.js`, `verifyR5/verify-copy/pastprint/scan.js`, `verifyR5/verify-copy/repro.js`, `verifyR5/verify-copy/repro2.js`, `verifyR5/verify-copy/sk/eng2.js`, `verifyR5/verify-copy/sk/page.js`, `verifyR5/verify-duo/imm/fixrun/pg.js`, `verifyR5/verify-duo/imm/imm.js`, `verifyR5/verify-duo/imm/oldrun/pg.js`, `verifyR5/verify-duo/imm/pg.js`, `verifyR5/verify-duo/p1.js`, `verifyR5/verify-duo/run.js`, `verifyR5/verify-duo/runfix.js`, `verifyR5/verify-duo/s1.js`, `verifyR5/verify-duo/s2.js`, `verifyR5/verify-duo/s3.js`, `verifyR5/verify-duo/s4.js`, `verifyR5/verify-duo/s5.js`, `verifyR5/verify-duo/sk-bay/eng.js`, `verifyR5/verify-duo/sk-bay/pg.js`, `verifyR5/verify-duo/skep-shove/pg.js`, `verifyR5/verify-duo/skep/eng.js`, `verifyR5/verify-duo/skep/page.js`, `verifyR5/verify-duo/skeptic-land/jump.js`, `verifyR5/verify-duo/skeptic-land/land.js`, `verifyR5/verify-duo/skeptic-land/landfix.js`, `verifyR5/verify-duo/skeptic-land/landfix2.js`, `verifyR5/verify-duo/skeptic-land/page.js`, `verifyR5/verify-ground/inf.js`, `verifyR5/verify-ground/j1.js`, `verifyR5/verify-ground/land2.js`, `verifyR5/verify-ground/mono.js`, `verifyR5/verify-ground/page.js`, `verifyR5/verify-ground/partner.js`, `verifyR5/verify-ground/scan.js`, `verifyR5/verify-ground/stomp-band-old.js`, `verifyR5/verify-ground/stomp-band.js`

</details>

## probe/

B: page probes.

1 files, 1 KB.


<details><summary>All 1 files</summary>

`probe/duoplaster.js`

</details>

## researchC/

C: the research agents' and skeptics' scripts by topic, and the compiled topic files (compiled/*.json) that were merged into research/final-energy.json. Downloads (papers, handbooks, pages) are listed, not copied.

40 files, 512 KB.

- `researchC/audit/scripts/prem_binding.py`: Gravitational binding energy of Earth from PREM (Dziewonski & Anderson 1981, Table I density polynomials)
- `researchC/compile-scripts/compile_audit.py`: Compile the 'audit' topic (the eleven existing energy rungs) with the skeptic's corrections.
- `researchC/compile-scripts/compile_disaster.py`: Compile the 'disaster' band (about 1e11 to 1e17 J) from the researcher's output and the skeptic's checks.
- `researchC/compile-scripts/compile_explosive.py`: Compile the 'explosive' band (about 0.5 MJ to 50 GJ) from the researcher's output and the skeptic's checks.
- `researchC/compiled-scripts/geophysical.py`: Compile the geophysical topic (researcher output + skeptic corrections) into the lab's research format.
- `researchC/compiled/scripts/le_check.py`: Lane-Emden: moment of inertia factor and binding coefficient for polytrope n
- `researchC/disaster/scripts/derive.py`: Derivations for the "disaster" band (1e11-1e17 J). Inputs from fetched sources (see notes in facts).
- `researchC/stellar-compile/build.py`: Compile the stellar topic (researcher output + skeptic corrections) into compiled/stellar.json

<details><summary>All 40 files</summary>

`researchC/audit-check/scripts/check.py`, `researchC/audit-check/scripts/gaps.py`, `researchC/audit/scripts/derive.py`, `researchC/audit/scripts/prem_binding.py`, `researchC/compile-scripts/compile_audit.py`, `researchC/compile-scripts/compile_disaster.py`, `researchC/compile-scripts/compile_explosive.py`, `researchC/compile-scripts/compile_small.py`, `researchC/compiled-scripts/geophysical.py`, `researchC/compiled/audit.json`, `researchC/compiled/disaster.json`, `researchC/compiled/explosive.json`, `researchC/compiled/geophysical.json`, `researchC/compiled/planetary.json`, `researchC/compiled/scripts/build_planetary.py`, `researchC/compiled/scripts/le_check.py`, `researchC/compiled/scripts/planetary_check.py`, `researchC/compiled/small.json`, `researchC/compiled/stellar.json`, `researchC/disaster-check/scripts/check.py`, `researchC/disaster/scripts/derive.py`, `researchC/disaster/scripts/h2t.py`, `researchC/explosive-check/scripts/recompute.py`, `researchC/explosive/scripts/calc.py`, `researchC/geophysical-check-scripts/recompute.py`, `researchC/planetary-check/scripts/check.py`, `researchC/planetary-check/scripts/le.py`, `researchC/planetary-check/scripts/prem.py`, `researchC/planetary-check/scripts/qs.py`, `researchC/planetary/scripts/compute.py`, `researchC/planetary/scripts/facts.py`, `researchC/planetary/scripts/pluto.py`, `researchC/planetary/scripts/structure.py`, `researchC/small-check/scripts/minE.js`, `researchC/small-check/scripts/recompute.py`, `researchC/small/scripts/calc.py`, `researchC/small/scripts/facts.py`, `researchC/stellar-check/scripts/recompute.py`, `researchC/stellar-check/scripts/scan.py`, `researchC/stellar-compile/build.py`

</details>

## mergeC/

C: the merge of the seven topics (merge.py), the merge log and decisions, and the writer of research/reviews/gui-c-research.json.

4 files, 17 KB.

- `mergeC/merge.py`: Merge the seven compiled research topics into rex-strength-lab/research/final-energy.json.
- `mergeC/write-research-record.py`: Write rex-strength-lab/research/reviews/gui-c-research.json from the four workflow journals and the merge log.

<details><summary>All 4 files</summary>

`mergeC/decisions.json`, `mergeC/merge-log.json`, `mergeC/merge.py`, `mergeC/write-research-record.py`

</details>

## fixC1/

C: the scripts that applied each review round's research-data fixes, and the writers of the round records.

9 files, 41 KB.

- `fixC1/facts1.py`: Round 1 research-data fixes (source lenses srclow, srcmid).
- `fixC1/facts2.py`: Round 1 research-data fixes (brief and code lenses).
- `fixC1/facts3.py`: Round 1 fixes (srchigh and copy lenses): plain displays for every rung's sources-table row, page phrases.
- `fixC1/facts4.py`: Round 2 research-data fixes.
- `fixC1/facts5.py`: Round 2 fixes (code and copy lenses): plain source titles for every rung; SN 1998bw is its blast; Earth binding check row.
- `fixC1/facts6.py`: Round 3 research-data fixes.

<details><summary>All 9 files</summary>

`fixC1/facts1.py`, `fixC1/facts2.py`, `fixC1/facts3.py`, `fixC1/facts4.py`, `fixC1/facts5.py`, `fixC1/facts6.py`, `fixC1/write-r1.py`, `fixC1/write-r2.py`, `fixC1/write-r3.py`

</details>

## reviewC1/

C, review round 1: the reviewers' and verifiers' repro scripts.

81 files, 113 KB.

- `reviewC1/brief/page.js`: usage: node page.js '&lt;json state&gt;' [width] [selector]
- `reviewC1/srcmid/hoover_check.py`: Hoover Dam annual net generation (EIA-923 via EIA API v2), plants 154 (NV) + 8902 (AZ)
- `reviewC1/verify-copy/notation.js`: counts notation styles in sources rows (D.sources) for a data.js
- `reviewC1/verify-copy/pw.js`: usage: node pw.js &lt;dist/index.html&gt; &lt;out.json&gt; ; runs scenarios against a wrapped copy
- `reviewC1/verify-srclow/scripts/repro.sh`: Reproduces srclow-1 and srclow-2. Run from anywhere; downloads go to ../dl
- `reviewC1/verify-srcmid/check_all.sh`: Re-run the source checks for the five srcmid findings (downloads already in dl/)

<details><summary>All 81 files</summary>

`reviewC1/brief/dial.js`, `reviewC1/brief/duo.js`, `reviewC1/brief/facts.py`, `reviewC1/brief/fetched.py`, `reviewC1/brief/page.js`, `reviewC1/brief/rungfacts.py`, `reviewC1/brief/rungs.js`, `reviewC1/brief/sweep-allout.js`, `reviewC1/brief/sweep-page.js`, `reviewC1/code/factdiff.py`, `reviewC1/code/mut/run.py`, `reviewC1/code/probe1.js`, `reviewC1/code/probe2.js`, `reviewC1/code/probe3.js`, `reviewC1/code/probe4.py`, `reviewC1/code/probe5.js`, `reviewC1/code/probe6.js`, `reviewC1/code/pw/duo.js`, `reviewC1/code/pw/duo2.js`, `reviewC1/code/pw/duo3.js`, `reviewC1/code/pw/duo4.js`, `reviewC1/code/pw/inject.js`, `reviewC1/code/pw/milestones.js`, `reviewC1/code/pw/tiles.js`, `reviewC1/code/pw/tiles2.js`, `reviewC1/code/pw/tiles390.js`, `reviewC1/code/pw/weight-hi.js`, `reviewC1/code/pw/weight-main.js`, `reviewC1/code/pw/weight.js`, `reviewC1/copy/scripts/common.js`, `reviewC1/copy/scripts/duo.js`, `reviewC1/copy/scripts/duo2.js`, `reviewC1/copy/scripts/edges.js`, `reviewC1/copy/scripts/edges2.js`, `reviewC1/copy/scripts/growth.js`, `reviewC1/copy/scripts/nm.js`, `reviewC1/copy/scripts/nm2.js`, `reviewC1/copy/scripts/notation.js`, `reviewC1/copy/scripts/rows.js`, `reviewC1/copy/scripts/rungs.js`, `reviewC1/copy/scripts/status.js`, `reviewC1/copy/scripts/tables.js`, `reviewC1/copy/scripts/tiles.js`, `reviewC1/copy/scripts/tiles2.js`, `reviewC1/copy/scripts/weight.js`, `reviewC1/copy/scripts/weight2.js`, `reviewC1/copy/scripts/weight390.js`, `reviewC1/srchigh/dois.py`, `reviewC1/srchigh/dump.py`, `reviewC1/srchigh/dumpall.py`, `reviewC1/srchigh/layers.py`, `reviewC1/srchigh/prem.py`, `reviewC1/srchigh/recompute.py`, `reviewC1/srclow/recompute.py`, `reviewC1/srclow/refs.js`, `reviewC1/srclow/rows.js`, `reviewC1/srcmid/hoover_check.py`, `reviewC1/srcmid/rows.js`, `reviewC1/srcmid/rungs.js`, `reviewC1/verify-brief/b1.js`, `reviewC1/verify-brief/b2.js`, `reviewC1/verify-brief/b3probe.js`, `reviewC1/verify-brief/lad.js`, `reviewC1/verify-code/mutants.py`, `reviewC1/verify-code/probe1.js`, `reviewC1/verify-code/probe4.js`, `reviewC1/verify-code/probe4b.js`, `reviewC1/verify-copy/dbg.js`, `reviewC1/verify-copy/dbg2.js`, `reviewC1/verify-copy/grow.js`, `reviewC1/verify-copy/notation.js`, `reviewC1/verify-copy/pw.js`, `reviewC1/verify-copy/srctable.js`, `reviewC1/verify-srchigh/bind.js`, `reviewC1/verify-srchigh/rough.js`, `reviewC1/verify-srchigh/sn.js`, `reviewC1/verify-srchigh/srcrows.js`, `reviewC1/verify-srclow/scripts/repro.sh`, `reviewC1/verify-srclow/scripts/tank.py`, `reviewC1/verify-srcmid/check_all.sh`, `reviewC1/verify-srcmid/hoover_eia.py`

</details>

## reviewC2/

C, review round 2: the reviewers' and verifiers' repro scripts.

62 files, 101 KB.

- `reviewC2/brief/ladder.orig.js`: Rex Super-Strength Lab: the energy ladder's wording (BRIEF-gui.md section 6). Text only, no physics.
- `reviewC2/brief/probe-slow.js`: usage: node probe.js &lt;dist/index.html&gt; &lt;json list of [state, clickSel?, allout?]&gt;
- `reviewC2/brief/probe.js`: usage: node probe.js &lt;dist/index.html&gt; &lt;json list of [state, clickSel?, allout?]&gt;
- `reviewC2/code/ladder.orig.js`: Rex Super-Strength Lab: the energy ladder's wording (BRIEF-gui.md section 6). Text only, no physics.
- `reviewC2/verify-code/mut/test/ladder.fixed.js`: Checks for the energy ladder (BRIEF-gui.md section 6): its rungs, their facts and sources, and the wording rule.
- `reviewC2/verify-srcfix/repro.sh`: srcfix-1

<details><summary>All 62 files</summary>

`reviewC2/brief/fetched.py`, `reviewC2/brief/ladder.orig.js`, `reviewC2/brief/probe-slow.js`, `reviewC2/brief/probe.js`, `reviewC2/brief/probe2.js`, `reviewC2/brief/probe3.js`, `reviewC2/brief/probe4.js`, `reviewC2/brief/rungs.js`, `reviewC2/code/facts.js`, `reviewC2/code/labels.js`, `reviewC2/code/ladder.orig.js`, `reviewC2/code/mutate.py`, `reviewC2/code/probe1.js`, `reviewC2/code/probe2.js`, `reviewC2/code/probe3.js`, `reviewC2/code/probe4.js`, `reviewC2/code/probe5.js`, `reviewC2/code/probe6.js`, `reviewC2/code/probe7.js`, `reviewC2/code/probe8.js`, `reviewC2/code/rows.js`, `reviewC2/code/stress1.js`, `reviewC2/code/stress2.js`, `reviewC2/code/stress3.js`, `reviewC2/code/weightmax.js`, `reviewC2/copy/an.js`, `reviewC2/copy/dump.js`, `reviewC2/copy/duo.js`, `reviewC2/copy/duo2.js`, `reviewC2/copy/frames.js`, `reviewC2/copy/grow2.js`, `reviewC2/copy/one.js`, `reviewC2/copy/rows.js`, `reviewC2/copy/rows2.js`, `reviewC2/copy/rows3.js`, `reviewC2/copy/scan.js`, `reviewC2/copy/shot.js`, `reviewC2/copy/srct.js`, `reviewC2/copy/titles.js`, `reviewC2/copy/weight.js`, `reviewC2/srcfix/diffr1.py`, `reviewC2/srcfix/dump.py`, `reviewC2/srcfix/rungs.py`, `reviewC2/srcfix/toyota_map.py`, `reviewC2/verify-brief/bisect.js`, `reviewC2/verify-brief/eia-browser.js`, `reviewC2/verify-brief/probe-ladder.js`, `reviewC2/verify-brief/probe.js`, `reviewC2/verify-code/grow.js`, `reviewC2/verify-code/mut/test/ladder.fixed.js`, `reviewC2/verify-code/weight.js`, `reviewC2/verify-copy/c1.js`, `reviewC2/verify-copy/c2.js`, `reviewC2/verify-copy/c2b.js`, `reviewC2/verify-copy/c3.js`, `reviewC2/verify-copy/c3m.js`, `reviewC2/verify-copy/c6.js`, `reviewC2/verify-copy/page.js`, `reviewC2/verify-copy/page2.js`, `reviewC2/verify-copy/page3.js`, `reviewC2/verify-srcfix/eia_check.py`, `reviewC2/verify-srcfix/repro.sh`

</details>

## reviewC3/

C, review round 3: the reviewers' and verifiers' repro scripts.

45 files, 165 KB.

- `reviewC3/verify-fixes/fix2-check.js`: the proposed fixes-2 check, on the head page's and the mutant's strings
- `reviewC3/verify-fixes/grow-probe.js`: Probe the growth what-if box for a rough rung in each absorb mode.
- `reviewC3/verify-fixes/mk-sec6.sh`: usage: mk-sec6.sh &lt;project copy dir&gt;  -&gt; writes &lt;dir&gt;/test/sec6.js : shots.js lines 1-35 + section 6 (531-616)

<details><summary>All 45 files</summary>

`reviewC3/fixes/m0/test/sec6-fast.js`, `reviewC3/fixes/m0/test/sec6-full.js`, `reviewC3/fixes/mA/test/sec6-fast.js`, `reviewC3/fixes/mA/test/sec6-full.js`, `reviewC3/fixes/mB/test/sec6-fast.js`, `reviewC3/fixes/mB/test/sec6-full.js`, `reviewC3/fixes/mC/test/sec6-fast.js`, `reviewC3/fixes/mC/test/sec6-full.js`, `reviewC3/fixes/probe/common.js`, `reviewC3/fixes/probe/grow.js`, `reviewC3/fixes/probe/milestone.js`, `reviewC3/fixes/scanrows.js`, `reviewC3/fixes/sec6-fast.js`, `reviewC3/fixes/sec6-full.js`, `reviewC3/fixes/sec6-template.js`, `reviewC3/fresh/catch.js`, `reviewC3/fresh/dump.js`, `reviewC3/fresh/duo.js`, `reviewC3/fresh/duo2.js`, `reviewC3/fresh/grow.js`, `reviewC3/fresh/grow2.js`, `reviewC3/fresh/grow3.js`, `reviewC3/fresh/growcheck.js`, `reviewC3/fresh/narrow.js`, `reviewC3/fresh/pw.js`, `reviewC3/fresh/shot.js`, `reviewC3/fresh/srcrows.js`, `reviewC3/fresh/steps.js`, `reviewC3/fresh/sweep.js`, `reviewC3/fresh/tip.js`, `reviewC3/fresh/viz.js`, `reviewC3/fresh/weight.js`, `reviewC3/verify-fixes/fix2-check.js`, `reviewC3/verify-fixes/grow-probe.js`, `reviewC3/verify-fixes/mk-sec6.sh`, `reviewC3/verify-fixes/rows.js`, `reviewC3/verify-fresh/f1.js`, `reviewC3/verify-fresh/f2.js`, `reviewC3/verify-fresh/f2b.js`, `reviewC3/verify-fresh/f2c.js`, `reviewC3/verify-fresh/f2d.js`, `reviewC3/verify-fresh/f3.js`, `reviewC3/verify-fresh/f4.js`, `reviewC3/verify-fresh/f4b.js`, `reviewC3/verify-fresh/f4c.js`

</details>

## wfC/

C: the review workflow script and the decisions and prior findings passed to it.

3 files, 46 KB.


<details><summary>All 3 files</summary>

`wfC/decisions.txt`, `wfC/prior1.txt`, `wfC/review.js`

</details>

## Top level

One-off scripts at the top of the scratchpad.

16 files, 103 KB.

- `probe.js`: probe: load states into the built page, pick a duo or solo effort, print the effort box

<details><summary>All 16 files</summary>

`erange.js`, `probe.js`, `probeW.js`, `probeG.js`, `probeG2.js`, `probeG3.js`, `write-r2.py`, `write-r3.py`, `write-r4.py`, `write-r5.py`, `write-v5.py`, `r3-args.py`, `r5-args.py`, `pr-b-decisions.md`, `pr-b-body-final.md`, `pr-c-body.md`

</details>

## workflows/

The workflow orchestration scripts (each Workflow launch). They compute the subagent prompts quoted in the transcript.

9 files, 141 KB.

- `workflows/gui-a-review.js`: rex-gui-a-review: Adversarial review of the Rex lab page reorganisation (BRIEF-gui.md sections 1-4): five lenses find defects, one skeptic per lens reproduces or refutes each finding with code
- `workflows/gui-b-escape-facts-wf_909fdc19-f12.js`: gui-b-escape-facts: Research and skeptic-check the escape-speed facts for very fast throws (BRIEF-gui.md 5a)
- `workflows/gui-b-understand-wf_e338a4a0-768.js`: gui-b-understand: Map engine.js and app.html for the four new powers (BRIEF-gui.md section 5)
- `workflows/review.js`: rex-gui-c-review: Adversarial review of the Rex lab energy ladder (BRIEF-gui.md section 6): six lenses find defects, one skeptic per lens reproduces or refutes each finding with code
- `workflows/rex-energy-ladder-research-wf_6266beb2-161.js`: rex-energy-ladder-research: Research the Rex lab energy-comparison ladder (BRIEF-gui.md section 6): one researcher per energy band and one auditor of the existing rungs, a skeptic who fetches every source, and a compiler who applies the corrections
- `workflows/rex-gui-a-review-wf_1e3e4c47-3d7.js`: rex-gui-a-review: Adversarial review of the Rex lab page reorganisation (BRIEF-gui.md sections 1-4): five lenses find defects, one skeptic per lens reproduces or refutes each finding with code
- `workflows/rex-gui-b-review-wf_120495b4-d70.js`: rex-gui-b-review: Adversarial review of the Rex lab default powers (BRIEF-gui.md section 5): five lenses find defects, one skeptic per lens reproduces or refutes each finding with code
- `workflows/rex-gui-b-review.js`: rex-gui-b-review: Adversarial review of the Rex lab default powers (BRIEF-gui.md section 5): five lenses find defects, one skeptic per lens reproduces or refutes each finding with code
- `workflows/rex-gui-b-verify-r5-wf_1b1c7cb1-837.js`: rex-gui-b-verify-r5: Focused re-check of round 5 fixes on the Rex lab default powers: five checkers try to break the fixes, a skeptic reproduces each finding

<details><summary>All 9 files</summary>

`workflows/gui-a-review.js`, `workflows/gui-b-escape-facts-wf_909fdc19-f12.js`, `workflows/gui-b-understand-wf_e338a4a0-768.js`, `workflows/review.js`, `workflows/rex-energy-ladder-research-wf_6266beb2-161.js`, `workflows/rex-gui-a-review-wf_1e3e4c47-3d7.js`, `workflows/rex-gui-b-review-wf_120495b4-d70.js`, `workflows/rex-gui-b-review.js`, `workflows/rex-gui-b-verify-r5-wf_1b1c7cb1-837.js`

</details>

## Not copied

Copies of project code are the reviewers' snapshots and clones of the repository and their mutated copies of the lab's files (one line changed, to see whether a test catches it). The released versions are in the repository.

| Folder | Why | Files | Total size | Main types |
|---|---|---|---|---|
| verifyR5 | copy of project code | 3348 | 988.7 MB | .png, .json, .html, .js |
| reviewA1 | copy of project code | 12048 | 882.2 MB | .png, .json, .html, .pack |
| reviewA2 | copy of project code | 2194 | 813.1 MB | .png, .json, .html, .js |
| reviewC1 | copy of project code | 12926 | 779.2 MB | .png, .json, .html, .js |
| reviewA4 | copy of project code | 6899 | 736.3 MB | .png, .json, .html, .js |
| reviewA3 | copy of project code | 1887 | 696.2 MB | .png, .json, .html, .js |
| reviewB3 | copy of project code | 1939 | 681.4 MB | .png, .json, .html, .js |
| reviewB1 | copy of project code | 6600 | 525.3 MB | .png, .json, .html, .js |
| reviewC3 | copy of project code | 11582 | 508.5 MB | .png, .json, .html, .js |
| researchC | raw download or render | 461 | 451.9 MB | .pdf, .html, .txt, .json |
| reviewB5 | copy of project code | 1295 | 408.7 MB | .png, .json, .html, .js |
| reviewB2 | copy of project code | 1083 | 380.5 MB | .png, .json, .html, .js |
| reviewB4 | copy of project code | 5940 | 307.9 MB | .png, .json, .js, .html |
| reviewC2 | copy of project code | 6365 | 287.0 MB | .png, .json, (none), .pack |
| reviewC1 | raw download or render | 201 | 264.1 MB | .pdf, .html, .txt, .xml |
| reviewA3 | raw download or render | 53 | 76.7 MB | .html |
| reviewA1 | image | 89 | 76.5 MB | .png |
| mutC | copy of project code | 512 | 69.4 MB | .json, .js, .html, .jpg |
| reviewC2 | raw download or render | 49 | 67.8 MB | .pdf, .html, .json |
| reviewA4 | raw download or render | 47 | 67.2 MB | .html |
| reviewA3 | image | 76 | 65.1 MB | .png |
| reviewA3 | binary or output | 53 | 61.7 MB | .jsonl, .json, .txt, .diff |
| reviewA2 | image | 40 | 61.4 MB | .png |
| reviewA2 | raw download or render | 42 | 60.8 MB | .html |
| reviewA1 | raw download or render | 42 | 58.6 MB | .html |
| reviewA2 | binary or output | 63 | 56.7 MB | .jsonl, .json, .txt, .log |
| reviewB3 | raw download or render | 43 | 51.2 MB | .html |
| verifyR5 | raw download or render | 31 | 50.7 MB | .html |
| reviewB1 | image | 45 | 49.2 MB | .png |
| reviewB5 | raw download or render | 29 | 44.1 MB | .html |
| reviewA1 | binary or output | 117 | 43.9 MB | .jsonl, .json, .txt, .diff |
| reviewB2 | raw download or render | 23 | 32.9 MB | .html |
| reviewC3 | raw download or render | 18 | 31.7 MB | .html, .pdf, .json |
| reviewB1 | raw download or render | 19 | 27.8 MB | .html |
| reviewB4 | raw download or render | 17 | 25.7 MB | .html |
| researchC | binary or output | 143 | 16.2 MB | .txt, .tmp, .json, .bin |
| researchC | image | 78 | 16.0 MB | .png |
| verifyR5 | binary or output | 255 | 10.8 MB | .txt, .json, .log, .out |
| understand | copy of project code | 58 | 7.7 MB | .json, .js, .html, .py |
| reviewA4 | image | 78 | 7.5 MB | .png |
| reviewC1 | image | 52 | 6.9 MB | .png |
| reviewB4 | binary or output | 302 | 6.2 MB | .json, .txt, .diff, .out |
| reviewB3 | image | 18 | 4.9 MB | .png |
| reviewB3 | binary or output | 138 | 4.5 MB | .json, .txt, .diff, .log |
| reviewB2 | binary or output | 225 | 3.9 MB | .json, .txt, .diff, .log |
| reviewB1 | binary or output | 96 | 3.8 MB | .json, .txt, .diff, .log |
| reviewC1 | binary or output | 57 | 3.7 MB | .txt, .json, .log |
| reviewB4 | image | 13 | 3.5 MB | .png |
| a | image | 15 | 3.2 MB | .png |
| reviewB5 | image | 8 | 2.3 MB | .png |
| reviewC2 | binary or output | 60 | 2.2 MB | .txt, .json, .xml, (none) |
| probe | raw download or render | 1 | 1.6 MB | .html |
| reviewB5 | binary or output | 141 | 1.5 MB | .diff, .txt, .out, .log |
| understand | raw download or render | 1 | 1.5 MB | .html |
| a | raw download or render | 1 | 1.4 MB | .html |
| reviewC2 | image | 28 | 1.3 MB | .png |
| reviewC3 | image | 13 | 1.2 MB | .png |
| reviewB2 | image | 5 | 0.9 MB | .png |
| mut6 | copy of project code | 4 | 0.8 MB | .js |
| reviewC3 | binary or output | 42 | 0.8 MB | .txt, .log, .md, .out |
| mut5 | copy of project code | 4 | 0.8 MB | .js |
| reviewA4 | binary or output | 39 | 0.5 MB | .txt, .diff, .log, .json |
| llnlchk | image | 1 | 0.4 MB | .png |
| understand | binary or output | 2 | 0.0 MB | .out |

Other scratchpad folders that the repository does not cite (earlier probes, backups, page previews) were not copied.
