# Scratchpad scripts

Working scripts from the session scratchpad that the repository cites (in README files, NOTES.md, fact notes and review records) but does not contain. They were written by Claude and its subagents to map the code, build each pull request, reproduce or refute review findings and check the fixes. Paths inside them point at the session scratchpad and the repository at /home/user/rex-strength-lab, so most will not run as-is from here.

Copied: scripts up to 300 KB, plus, in the build folders (understand2/, understand345/, pr345/, pr2/, pr3/, pr4/, pr5/, page/), JSON, Markdown and text: up to 250 KB in the folder itself (the specs given to the build subagents, the mapping and review results, the pull request descriptions and the commit messages) and up to 100 KB in its subfolders. Listed but not copied: copies of project code, raw downloads, larger files and binaries (table at the end).

Each folder lists the files whose purpose is known (from the file's own header comment, or a one-liner written for this index); the full file list is collapsed below it. Most of the remaining files are short single-purpose repro scripts named after the finding they test.

## understand2/

Pull request 2's mapping workflow (canon-2-understand): the readers' probes and sweeps of the engine on main, and the ledger prototype (ledger.js, ledger2.js).

56 files, 755 KB.

- `understand2/ledger.js`: A prototype of the item 3 ledger on today's engine: each party's momentum (x forward, y up), N s, from reported
- `understand2/offcheck.js`: powers-off fixture, on a subset of keys, against the patched engine (kV pinned as test/powers.js does)
- `understand2/repro2.js`: Copy of runs.js's item-2 part. argv[2]: 'old' pins kV 0.10017 & m 3007 (as runs.json was made); 'now' uses DEFAULT_BODIES (3000 kg, kV 0.099947)
- `understand2/rs/catch20.js`: Q5 at 10^20 kg: the catcher held (as a proxy, Ollie bolted) vs carried off today: what is freed at the catch
- `understand2/rs/groundalt.js`: The throw's 'break the ground' preset if it set aside They take their own recoil too (option A), vs today's
- `understand2/rs/ledger3.js`: item 3's 'Old and new' ledger figures, at the brief's pin (3,007 kg, kV 0.10017) and at 3,000 kg
- `understand2/rs/sink.js`: The throw's 'ground' preset (run on real ground with ownRecoil still on): is it set by the push's downward part on
- `understand2/rs/sweep2.js`: Like ../sweep.js, with a third column 'full': the shake patch AND his push's downward part taken off the ground's
- `understand2/sweep.js`: Risk sweep for BRIEF-canon item 2: does the throw's courtesy ceiling or any preset move when his push stops shaking
- `understand2/t5.js`: the checks in test/powers.js that read figures the change removes (3,007 kg bodies, as the test builds them)
- `understand2/t7.js`: where does his own push (toGround) set the throw's plaster ceiling or a shaking preset today, with their powers on?
- `understand2/t7b.js`: where does his own push (toGround) set the throw's plaster ceiling or a shaking preset today, with their powers on?

<details><summary>All 56 files</summary>

`understand2/arm.js`, `understand2/arm2.js`, `understand2/armc.js`, `understand2/base.js`, `understand2/bus.js`, `understand2/catch.js`, `understand2/catch2.js`, `understand2/duo.js`, `understand2/fb.js`, `understand2/flips.js`, `understand2/game.js`, `understand2/grep1.txt`, `understand2/h.js`, `understand2/ledger.js`, `understand2/ledger2.js`, `understand2/list.js`, `understand2/newcol.js`, `understand2/nums.js`, `understand2/offcheck.js`, `understand2/offcmp.js`, `understand2/patch.js`, `understand2/repro2-now.json`, `understand2/repro2-old.json`, `understand2/repro2.js`, `understand2/rs/catch20.js`, `understand2/rs/far1k.json`, `understand2/rs/far200.json`, `understand2/rs/groundalt.js`, `understand2/rs/ledger3.js`, `understand2/rs/s2-all-a.json`, `understand2/rs/s2-all-b.json`, `understand2/rs/s2-nu.json`, `understand2/rs/sink.js`, `understand2/rs/sweep2.js`, `understand2/shove.js`, `understand2/slam.js`, `understand2/sw-a.json`, `understand2/sw-b.json`, `understand2/sw-c.json`, `understand2/sweep.js`, `understand2/t1.js`, `understand2/t1.json`, `understand2/t2.js`, `understand2/t3.js`, `understand2/t4.js`, `understand2/t5.js`, `understand2/t520.js`, `understand2/t6.js`, `understand2/t7-hits.txt`, `understand2/t7.js`, `understand2/t7b.js`, `understand2/t8.js`, `understand2/t9.js`, `understand2/tests-pr2.js`, `understand2/toss.js`, `understand2/wthrow.js`

</details>

## understand345/

The mapping of pull requests 3-5 (canon-345-understand) on a read-only worktree of main: the readers' scripts by topic (passenger, collide, pr4-push, shimmer).

40 files, 87 KB.

- `understand345/collide/proto.js`: A prototype of item 4's Collide: a charger who takes his own recoil acts as a body of unbounded mass at his speed.
- `understand345/collide/search.js`: Emulates the page's two-player effort search for Collide's charge (duoFacts / makeDuoPlan / DUO_PRESET_TEST),
- `understand345/passenger/blast.js`: The landing blast with Safe passenger: main engine vs the scratch PR3 engine (landing energy taken back), a person
- `understand345/passenger/catch.js`: The game of catch with a person: catchPassengerG as the page computes it (main), and with PR3's order (SP first)
- `understand345/passenger/fixture.js`: Which powers-off fixture cases (test/powers.js part 1) change if MOVES.throw.passenger stops firing with Safe passenger on?
- `understand345/passenger/fixture2.js`: The scratch PR3 engine (passenger split; landing blast taken back with Safe passenger) against the powers-off fixture:
- `understand345/passenger/landing.js`: The person's landing: energy, momentum, the shaking pulse; the landing blast at high dials; what PR3's landing
- `understand345/passenger/table.js`: Reproduce BRIEF-canon.md item 5's table at 3,000 kg, with and without PR2's recoil rule emulated.
- `understand345/pr4-push/push2.js`: A sketch of pushMatch with ownRecoil (PR4), for numbers only: each push is real on the other, its push back absorbed.
- `understand345/shimmer/runs.js`: Shimmer lens: energy taken back by each power, today's engine, at 3,000 kg (DEFAULT_BODIES)

<details><summary>All 40 files</summary>

`understand345/collide/bolted.js`, `understand345/collide/common.js`, `understand345/collide/extra.js`, `understand345/collide/proto.js`, `understand345/collide/realjump.js`, `understand345/collide/run-table.js`, `understand345/collide/search.js`, `understand345/collide/standoff.js`, `understand345/collide/table.js`, `understand345/passenger/blast.js`, `understand345/passenger/catch.js`, `understand345/passenger/fixture.js`, `understand345/passenger/fixture2.js`, `understand345/passenger/landing.js`, `understand345/passenger/onset.js`, `understand345/passenger/table.js`, `understand345/pr4-push/arm1.js`, `understand345/pr4-push/arm2.js`, `understand345/pr4-push/common.js`, `understand345/pr4-push/fire1.js`, `understand345/pr4-push/fire2.js`, `understand345/pr4-push/fire3.js`, `understand345/pr4-push/fire4.js`, `understand345/pr4-push/lo.js`, `understand345/pr4-push/push1.js`, `understand345/pr4-push/push2.js`, `understand345/pr4-push/shove1.js`, `understand345/pr4-push/standoff1.js`, `understand345/pr4-push/standoff2.js`, `understand345/pr4-push/timing.js`, `understand345/shimmer/art.py`, `understand345/shimmer/catch.js`, `understand345/shimmer/features.py`, `understand345/shimmer/grid.py`, `understand345/shimmer/ladder.js`, `understand345/shimmer/layout.js`, `understand345/shimmer/mark.py`, `understand345/shimmer/orbit.js`, `understand345/shimmer/realair.js`, `understand345/shimmer/runs.js`

</details>

## pr345/

The mapping workflow's results for pull requests 3-5 (map.json), read when each was built.

1 files, 135 KB.


<details><summary>All 1 files</summary>

`pr345/map.json`

</details>

## pr2/

Pull request 2: the specs given to the build subagents (SPEC.md, SPEC-page.md), the mapping's results (map.json, page-sites.txt), each review round's raw results (round*-raw.json) and the arguments passed to the next, the pull request's description (pr-body.md), and each fixer's scripts (r1fix/, r2fix/, r3fix/, rcfix/ for the re-check) and mutant runs.

77 files, 1190 KB.

- `pr2/r1fix/block.js`: ---- review round 1 of BRIEF-canon.md pull request 2 (research/reviews/canon-2-round1.json): each of these fails on
- `pr2/r1fix/c3.js`: code-3: where the throw's own-recoil plaster credit fires (the page's offPlasterHim), and copy-3: the bolted pull's time
- `pr2/r1fix/c5.js`: copy-1's figures at the 3,000 kg bodies: the shove's push back, Ollie's share and his feet's, at 8.74 t and 2.57 t
- `pr2/r1fix/f4.js`: README 'What moved', first bullet: all-out plaster reach for level throws on sand, main vs branch (powers on)
- `pr2/r1fix/mutate-build.js`: Mutants for pull request 2's review: put his own push back into the ground in one move at a time, then run
- `pr2/r1fix/mutate-r1.js`: Round 1 fixes: revert each behaviour fix (or apply the reviewer's surviving mutant) in a scratch copy of the engine,
- `pr2/r1fix/probe.js`: Probe the page texts changed by round 1's fixes. Usage: node probe.js &lt;dist/index.html&gt; [ids...]
- `pr2/r1fix/runblock.js`: Runs the round 1 shots.js block (block.js, or the block cut out of a shots.js) against a given dist/index.html, with
- `pr2/r2fix/mutate-r2.js`: Review round 2 of pull request 2: every engine mutant that matters, run against test/powers.js --skip-off in a scratch
- `pr2/r2fix/pagemut.js`: Page reverts for review round 2: copy the repo's page sources into a scratch dir, apply one change (to app.html,
- `pr2/r2fix/presets-sample.js`: The throw's courtesy ceiling, least effort and every preset but rattle at the page's default dial (100 short tons), all four powers on, near 5 m, goal 30 m:
- `pr2/r2fix/presets.js`: The throw's courtesy ceiling, least effort and every preset but rattle at the page's default dial (100 short tons), all four powers on, near 5 m, goal 30 m:
- `pr2/r2fix/probe.js`: usage: node probe.js &lt;page.html&gt; &lt;cases.json&gt;   cases: [{label, state, pick?, sel?:[...]}]
- `pr2/r2fix/pull1.js`: the pull with the power on, friction and bolted, at the default dial and 10^6 kg: this branch's engine (argv[2] or the repo's) vs main's
- `pr2/r2fix/rattle.js`: The throw's rattle preset at the page's default dial (100 short tons), all four powers on, near 5 m, goal 30 m:
- `pr2/r2fix/reviewer-mutants.js`: The round 2 code reviewer's full mutant suite (scratchpad review-pr2-r2/code/mutants.js and mutants2.js), applied to
- `pr2/r2fix/runblock2.js`: Runs a review round's shots.js block (cut out of a shots.js; ROUND=1 or 2, default 2) against a given dist/index.html,
- `pr2/r3fix/fricsweep.js`: branch: does any friction pull (power on) have a courtesy ceiling? every pull object, surface and dial 1e3.5..1e15
- `pr2/r3fix/mutate-r3.js`: Review round 3 of pull request 2: every engine mutant that matters, run against test/powers.js --skip-off in a scratch
- `pr2/r3fix/pagemut3.js`: Page reverts for review round 3 of pull request 2: copy the repo's page sources into a scratch dir, apply one change
- `pr2/r3fix/probe.js`: usage: node probe.js &lt;dist/index.html&gt; &lt;cases.json&gt;
- `pr2/r3fix/pullceil3.js`: main (960fdfa) vs this branch (round 3's fixes): the pull's courtesy ceiling and presets, planned as the page plans
- `pr2/r3fix/pullleast3.js`: main vs branch: the pull's least disruptive effort (kg-force) and its time, and all-out times, by load and footing
- `pr2/r3fix/runblock3.js`: Runs a review round's shots.js block (cut out of a shots.js; ROUND=1 or 2, default 2) against a given dist/index.html,
- `pr2/rcfix/fricsweep-rc.js`: branch: does any friction pull (power on) have a courtesy ceiling? every pull object, surface and dial 1e3.5..1e15
- `pr2/rcfix/mutate-rc.js`: Review round 3's re-check of pull request 2: every engine mutant that matters, run against test/powers.js --skip-off in
- `pr2/rcfix/pagemut-rc.js`: Page reverts for review round 3's re-check of pull request 2: copy the repo's page sources into a scratch dir, apply
- `pr2/rcfix/pullceil-rc.js`: main (960fdfa) vs this branch (the re-check's fixes): the pull's courtesy ceiling and presets, planned as the page plans
- `pr2/rcfix/pullleast-rc.js`: main vs branch: the pull's least disruptive effort (kg-force) and its time, and all-out times, by load and footing
- `pr2/rcfix/quick.js`: re-check fixes: the pull's figures with the 1.0x leg rule (this branch's engine), and the bolted sprint over 10 m
- `pr2/rcfix/reach.js`: the bolted car all-out at the default dial (concrete, all powers on): the reach of plaster cracking and rattling
- `pr2/rcfix/render.js`: node render.js &lt;dist/index.html&gt; '&lt;json array of [state, effort|null]&gt;' -&gt; prints verdict, status, happens, math, effort-read
- `pr2/rcfix/runblock.js`: Runs a review round's shots.js block (cut out of a shots.js; ROUND=1 or 2, default 2) against a given dist/index.html,
- `pr2/work/figures.js`: The brief's figures for pull request 2 (BRIEF-canon.md items 2 and 3; SPEC.md's list), at today's 3,000 kg bodies:
- `pr2/work/mutate.js`: Mutants for pull request 2's review: put his own push back into the ground in one move at a time, then run
- `pr2/work/sec5.js`: 5. 5d: They take their own recoil. Canon (CLAUDE.md, RT A7; BRIEF-canon.md item 2): the push back from their own moves
- `pr2/work/sec5e.js`: 5e. They take their own recoil, the rest of BRIEF-canon.md item 2 (pull request 2's decisions): the power wins over
- `pr2/work/sec6.js`: 6. The momentum ledger (BRIEF-canon.md item 3). For each move, at three dials (the page's 100 short tons, 10^9 kg and

<details><summary>All 77 files</summary>

`pr2/SPEC-page.md`, `pr2/SPEC.md`, `pr2/args-r2.json`, `pr2/map.json`, `pr2/page-sites-dump.txt`, `pr2/page-sites.txt`, `pr2/pr-body.md`, `pr2/prior-r1.txt`, `pr2/r1fix/block.js`, `pr2/r1fix/c1.js`, `pr2/r1fix/c2.js`, `pr2/r1fix/c3.js`, `pr2/r1fix/c5.js`, `pr2/r1fix/f4.js`, `pr2/r1fix/make_record.py`, `pr2/r1fix/mutate-build.js`, `pr2/r1fix/mutate-r1.js`, `pr2/r1fix/probe-new.txt`, `pr2/r1fix/probe-pin.js`, `pr2/r1fix/probe.js`, `pr2/r1fix/runblock.js`, `pr2/r2fix/c-duo.json`, `pr2/r2fix/c-pull.json`, `pr2/r2fix/commit-msg.txt`, `pr2/r2fix/make_record2.py`, `pr2/r2fix/mutate-r2.js`, `pr2/r2fix/pagemut.js`, `pr2/r2fix/presets-sample.js`, `pr2/r2fix/presets.js`, `pr2/r2fix/probe.js`, `pr2/r2fix/pull1.js`, `pr2/r2fix/rattle.js`, `pr2/r2fix/reviewer-mutants.js`, `pr2/r2fix/runblock2.js`, `pr2/r3fix/c-duo.json`, `pr2/r3fix/c-gw.json`, `pr2/r3fix/c-pull.json`, `pr2/r3fix/commit-msg.txt`, `pr2/r3fix/fricsweep.js`, `pr2/r3fix/gw-branch.txt`, `pr2/r3fix/gw-var.txt`, `pr2/r3fix/make_record3.py`, `pr2/r3fix/mutate-r3.js`, `pr2/r3fix/pagemut3.js`, `pr2/r3fix/pr-body-before-r3.md`, `pr2/r3fix/probe.js`, `pr2/r3fix/pullceil3.js`, `pr2/r3fix/pullleast3.js`, `pr2/r3fix/quick.js`, `pr2/r3fix/runblock3.js`, `pr2/rcfix/commit-msg.txt`, `pr2/rcfix/counts-rc.json`, `pr2/rcfix/fricsweep-rc.js`, `pr2/rcfix/make_record_rc.py`, `pr2/rcfix/mutate-rc.js`, `pr2/rcfix/pagemut-rc.js`, `pr2/rcfix/pr-body-before-rc.md`, `pr2/rcfix/pullceil-rc.js`, `pr2/rcfix/pullleast-rc.js`, `pr2/rcfix/quick.js`, `pr2/rcfix/reach.js`, `pr2/rcfix/render.js`, `pr2/rcfix/runblock.js`, `pr2/recheck-raw.json`, `pr2/round1-raw.json`, `pr2/round2-detail.txt`, `pr2/round2-pretty.txt`, `pr2/round2-raw.json`, `pr2/round3-detail.txt`, `pr2/round3-raw.json`, `pr2/tests-runs-dump.txt`, `pr2/work/cov.js`, `pr2/work/figures.js`, `pr2/work/mutate.js`, `pr2/work/sec5.js`, `pr2/work/sec5e.js`, `pr2/work/sec6.js`

</details>

## page/

Pull request 2's page stage: page probes (probe.js, harness.js, block.js and others).

10 files, 21 KB.

- `page/block.js`: BRIEF-canon.md items 2 and 7: their own recoil goes to their source, the endless ocean, not into the planet. With the
- `page/harness.js`: runs the new shots.js block (block.js) against a page build: node harness.js &lt;dist/index.html&gt;
- `page/look.js`: load the built page with saved states and print the bay text (scratch helper)

<details><summary>All 10 files</summary>

`page/arm.js`, `page/block.js`, `page/credit.js`, `page/credit2.js`, `page/harness.js`, `page/look.js`, `page/moved.js`, `page/powshot.js`, `page/probe.js`, `page/probe2.js`

</details>

## pr3/

Pull request 3: the spec, the build subagent's probes, each review round's raw results, the pull request's description and the fixers' scripts (r1fix/, r2fix/).

37 files, 296 KB.

- `pr3/block.js`: Runs only pull request 3's block of test/shots.js against a built page, so each check can be tried on pull request
- `pr3/figures.js`: The brief's figures for item 5 (a person thrown 30 m at 45°, default dial, 3,000 kg Rex), on this branch's engine.
- `pr3/gentle.js`: The other reading of 'manageable' at the landing: a gentle 1.5 g stop. Where would the ceiling go?
- `pr3/moved.js`: What moved against pull request 2's branch: a person thrown 30 m at 45°, the planner as the page runs it, on PR2's
- `pr3/r1fix/narrow.js`: the new texts' states at 390 px, light and dark: no sideways scroll, no NaN/undefined/Infinity, no page errors
- `pr3/r1fix/presets.js`: the duo effort read for each preset, for a few catch states: node presets.js &lt;rex-strength-lab dir&gt; '&lt;states&gt;'
- `pr3/r1fix/record.py`: Writes rex-strength-lab/research/reviews/canon-3-round1.json from round1-raw.json plus each finding's outcome.
- `pr3/r1fix/revert.py`: Make a scratch copy of the working tree with one fix reverted, rebuild it, and print where it is.
- `pr3/r1fix/runall.sh`: build each revert and run pull request 3's shots block (and powers.js for the engine one) against it
- `pr3/r1fix/runmut.sh`: the build's six mutants on the fixed tree: powers.js --skip-off, presence.js and pull request 3's shots block
- `pr3/r2fix/load.js`: load the engine and data from a lab dir: const { P, D } = require('./load.js')(dir)
- `pr3/r2fix/narrow.js`: the new texts' states at 390 px, light and dark: no sideways scroll, no NaN/undefined/Infinity, no page errors
- `pr3/r2fix/presets.js`: the effort box of a few states on two builds: node presets.js &lt;dirA&gt; &lt;dirB&gt;
- `pr3/r2fix/record.py`: Writes rex-strength-lab/research/reviews/canon-3-round2.json from round2-raw.json plus each finding's outcome.
- `pr3/r2fix/revert.py`: Make a scratch copy of the working tree with one fix (or one mutant) reverted, rebuild it, and print where it is.
- `pr3/r2fix/runall.sh`: build each revert and run pull request 3's shots block against it; for engine reverts also powers.js --skip-off, and
- `pr3/view.js`: dump the page text for a few saved states. node view.js &lt;rex-strength-lab dir&gt; '&lt;json array of states&gt;' [selector]

<details><summary>All 37 files</summary>

`pr3/SPEC.md`, `pr3/block.js`, `pr3/dbg.js`, `pr3/dbgpage.js`, `pr3/figures.js`, `pr3/gentle.js`, `pr3/haz.js`, `pr3/map-pr3.json`, `pr3/moved.js`, `pr3/pr-body.md`, `pr3/r1bear.js`, `pr3/r1ceil.js`, `pr3/r1fix/narrow.js`, `pr3/r1fix/new.txt`, `pr3/r1fix/old.txt`, `pr3/r1fix/presets.js`, `pr3/r1fix/record.py`, `pr3/r1fix/revert.py`, `pr3/r1fix/runall.sh`, `pr3/r1fix/runmut.sh`, `pr3/r2fix/commit-msg.txt`, `pr3/r2fix/ee.js`, `pr3/r2fix/hg.js`, `pr3/r2fix/load.js`, `pr3/r2fix/misses.js`, `pr3/r2fix/narrow.js`, `pr3/r2fix/presets.js`, `pr3/r2fix/readme-pr3-new.md`, `pr3/r2fix/readme-pr3-old.md`, `pr3/r2fix/record.py`, `pr3/r2fix/revert.py`, `pr3/r2fix/runall.sh`, `pr3/r2fix/thresh.js`, `pr3/r2fix/zero.js`, `pr3/round1-raw.json`, `pr3/round2-raw.json`, `pr3/view.js`

</details>

## pr4/

Pull request 4: the spec, the mapping and the ledger, the engine and page stages' probes (scratch/, page/), each review round's raw results, the pull request's description, commit messages and the fixers' scripts (r1fix/, r2fix/, r3fix/, rcfix/ for the re-check).

234 files, 2394 KB.

- `pr4/page/collideCharge.js`: Collide's charge when the one hit is held without limit by their powers, the charger taking his own recoil
- `pr4/page/pr4block.js`: ---- BRIEF-canon.md item 4, pull request 4: contests (force moves: the other's push is real, only each one's own push
- `pr4/page/probe.js`: probe.js &lt;html file&gt; &lt;cases.json | inline JSON&gt; [out.json]
- `pr4/page/pushOwn.js`: The shoving match with They take their own recoil on (BRIEF-canon.md item 4, decision 8; canon, the rulings of 14 Oct
- `pr4/page/timing.js`: timing.js &lt;html&gt; [reps]: the engine time the two-player effort search spends in two-player calls, per test, at the
- `pr4/r1fix/js/blk.js`: Runs part of shots.js's pull request 4 block against a built page: node blk.js &lt;shots.js&gt; &lt;ROOT with dist/ and test/&gt; &lt;r1|all&gt;
- `pr4/r1fix/js/offpage.js`: The two-player tabs with every power off, on several pages: node offpage.js out.json page1.html [page2.html ...]
- `pr4/r1fix/js/probe.js`: node probe.js &lt;dist dir root&gt; &lt;states.json&gt; [out.txt]
- `pr4/r1fix/js/render.js`: node render.js &lt;ROOT&gt; &lt;states.json&gt; &lt;outdir&gt;: each state at 390/1280, light/dark; overflow, clipped svg text, bad tokens, page errors
- `pr4/r1fix/js/rep.py`: usage: python3 rep.py file  (reads pairs from a python file given as argv[2])
- `pr4/r1fix/js/revert.py`: Each round 1 fix reverted on its own in a scratch tree; its covering checks run there.
- `pr4/r1fix/js/sec.js`: Runs chosen sections of test/powers.js against an engine: node sec.js &lt;engine.js&gt; &lt;powers.js&gt; &lt;section numbers, e.g. 6 8&gt;
- `pr4/r2fix/js/blk.js`: Runs parts of shots.js's pull request 4 block against a built page: node blk.js &lt;shots.js&gt; &lt;ROOT with dist/ and test/&gt; &lt;mode&gt;
- `pr4/r2fix/js/common.js`: node common helpers for round 2 fix scripts: require('./common.js')(rootOfRexLab)
- `pr4/r2fix/js/dump.js`: node dump.js &lt;ROOT&gt; &lt;states.json&gt; [sections]: prints each state's duo-bay text by section (1280 px, light)
- `pr4/r2fix/js/offpage.js`: The two-player tabs with every power off, on several pages: node offpage.js out.json page1.html [page2.html ...]
- `pr4/r2fix/js/rec2.py`: Writes research/reviews/canon-4-round2.json: round2-raw.json's lenses verbatim, each finding with its outcome and the
- `pr4/r2fix/js/render.js`: node render.js &lt;ROOT&gt; &lt;states.json&gt; &lt;outdir&gt;: each state at 390/1280, light/dark; overflow, clipped svg text, bad tokens, page errors
- `pr4/r2fix/js/revert1.py`: Each round 1 fix reverted on its own in a scratch tree; its covering checks run there.
- `pr4/r2fix/js/revert2.py`: Each review round 2 fix reverted on its own in a scratch tree; its covering checks run there.
- `pr4/r2fix/js/rx.js`: node rx.js &lt;ROOT&gt; &lt;state json&gt; &lt;pick&gt; &lt;selector&gt; &lt;regex&gt;: tests a regex on a state's duo-bay text
- `pr4/r2fix/js/sec.js`: Runs chosen sections of test/powers.js against an engine: node sec.js &lt;engine.js&gt; &lt;powers.js&gt; &lt;section numbers, e.g. 6 8&gt;
- `pr4/r2fix/js/timing.js`: node timing.js &lt;rootBefore&gt; &lt;rootAfter&gt; &lt;runs&gt;: two-player search time (reload to settled) per test, before vs after
- `pr4/r3fix/js/blk3.js`: Runs parts of shots.js's pull request 4 block against a built page: node blk3.js &lt;shots.js&gt; &lt;ROOT with dist/ and test/&gt; &lt;mode&gt;
- `pr4/r3fix/js/lists.py`: Copy check (review round 3, copy-owner-confirm-lists-differ): the README's list of decisions for the owner to confirm (pull
- `pr4/r3fix/js/probe-page.js`: node probe-page.js &lt;dist/index.html&gt; '&lt;state json&gt;' &lt;effort&gt; [selectors...]: loads a state, picks an effort, prints the duo bay's parts
- `pr4/r3fix/js/readme63.py`: Copy check (review round 3, copy-readme-63200-wrong-distance): README 'What moved' gives the real-ground jump's old ceiling at
- `pr4/r3fix/js/rec3.py`: Writes research/reviews/canon-4-round3.json from the round's raw findings, each confirmed finding's outcome (the fix, its
- `pr4/r3fix/js/render.js`: node render.js &lt;ROOT&gt; &lt;states.json&gt; &lt;outdir&gt;: each state at 390/1280, light/dark; overflow, clipped svg text, bad tokens, page errors
- `pr4/r3fix/js/revert2b.py`: Review round 2's fix reverts, re-run on review round 3's fixed tree (a copy of r2fix/js/revert2.py; trees and results of its own).
- `pr4/r3fix/js/revert3.py`: Each review round 3 fix reverted on its own in a scratch tree; its covering checks run there. Also the review's surviving
- `pr4/r3fix/js/sec.js`: Runs chosen sections of test/powers.js against an engine: node sec.js &lt;engine.js&gt; &lt;powers.js&gt; &lt;section numbers, e.g. 6 8&gt;
- `pr4/r3fix/js/timing3.js`: node timing3.js &lt;rootBefore&gt; &lt;rootAfter&gt; &lt;runs&gt;: two-player search time (reload to settled, polled every 30 ms), before vs after
- `pr4/r3fix/js/timing3b.js`: node timing3.js &lt;rootBefore&gt; &lt;rootAfter&gt; &lt;runs&gt;: two-player search time (reload to settled, polled every 30 ms), before vs after
- `pr4/r3fix/line.sh`: The full Rex lab test line, one test at a time, each timed.
- `pr4/r3fix/time-before.sh`: Times shots.js on the f25f9b4 copy, one run at a time: --pr4, then the full file.
- `pr4/rcfix/blk3.js`: Runs parts of shots.js's pull request 4 block against a built page: node blk3.js &lt;shots.js&gt; &lt;ROOT with dist/ and test/&gt; &lt;mode&gt;
- `pr4/rcfix/line.sh`: The full Rex lab test line and sweep.js, one test at a time, each timed (the re-check's close-out).
- `pr4/rcfix/probe-page.js`: node probe-page.js &lt;dist/index.html&gt; '&lt;state json&gt;' &lt;effort&gt; [selectors...]: loads a state, picks an effort, prints the duo bay's parts
- `pr4/rcfix/rc-record.py`: Writes research/reviews/canon-4-round3-recheck.json from the re-check's raw result (pr4/recheck-raw.json), the
- `pr4/rcfix/revert-rc.py`: The re-check of review round 3 of pull request 4: each round 3 fix the re-check found unguarded, reverted on its own
- `pr4/scratch/section8.js`: 8. Contests and Never knocked back (BRIEF-canon.md item 4, pull request 4; canon, the rulings of 14 Oct 2026). Every
- `pr4/scratch/timing.js`: Times each two-player engine function over an effort sweep like the page's two-player effort search (60 efforts,

<details><summary>All 234 files</summary>

`pr4/SPEC.md`, `pr4/cc.txt`, `pr4/commit-msg-page.txt`, `pr4/commit-msg.txt`, `pr4/contests-entry.txt`, `pr4/contests-map.txt`, `pr4/engine-diff.txt`, `pr4/ledger.txt`, `pr4/map-pr4.txt`, `pr4/mutants/mutate.py`, `pr4/mutants/results.json`, `pr4/page/c1.json`, `pr4/page/c2.json`, `pr4/page/c3.json`, `pr4/page/c4.json`, `pr4/page/c5.json`, `pr4/page/c6.json`, `pr4/page/c7.json`, `pr4/page/c8.json`, `pr4/page/c9.json`, `pr4/page/cmp6.txt`, `pr4/page/coff.json`, `pr4/page/collideCharge.js`, `pr4/page/eng.js`, `pr4/page/limits.txt`, `pr4/page/out1.json`, `pr4/page/out10.json`, `pr4/page/out11.json`, `pr4/page/out12.json`, `pr4/page/out3.json`, `pr4/page/out4.json`, `pr4/page/out5.json`, `pr4/page/out7.json`, `pr4/page/pr4block.js`, `pr4/page/probe.js`, `pr4/page/pushOwn.js`, `pr4/page/readme-pr4.md`, `pr4/page/show.js`, `pr4/page/timing-cur-5.json`, `pr4/page/timing-cur.json`, `pr4/page/timing-pr3-5.json`, `pr4/page/timing-pr3-5b.json`, `pr4/page/timing-pr3.json`, `pr4/page/timing.js`, `pr4/page/v2a.txt`, `pr4/page/v2b.txt`, `pr4/page/v2c.txt`, `pr4/page/v3.txt`, `pr4/page/v4.txt`, `pr4/page/v5.txt`, `pr4/page/v9.txt`, `pr4/pr-body.md`, `pr4/r1fix/commit-msg.txt`, `pr4/r1fix/findings/_verified_copy.txt`, `pr4/r1fix/findings/_verified_duo.txt`, `pr4/r1fix/findings/_verified_physics.txt`, `pr4/r1fix/findings/copy__copy-bothatonce-shove-tile.txt`, `pr4/r1fix/findings/copy__copy-fireball-before-split.txt`, `pr4/r1fix/findings/copy__copy-nkb-note.txt`, `pr4/r1fix/findings/copy__copy-paradox-coexist.txt`, `pr4/r1fix/findings/copy__copy-paradox-pronoun.txt`, `pr4/r1fix/findings/copy__copy-pin-never-breaks.txt`, `pr4/r1fix/findings/copy__copy-powers-card-five.txt`, `pr4/r1fix/findings/copy__copy-powers-off-claim.txt`, `pr4/r1fix/findings/copy__copy-push-bars-390.txt`, `pr4/r1fix/findings/copy__copy-push-harm.txt`, `pr4/r1fix/findings/copy__copy-shovingmatch-paradox-nothing-moves.txt`, `pr4/r1fix/findings/copy__copy-shovingmatch-torn-unbounded.txt`, `pr4/r1fix/findings/duo__duo-arm-loser-bolts-tear.txt`, `pr4/r1fix/findings/duo__duo-arm-reading-b-justification.txt`, `pr4/r1fix/findings/duo__duo-card-five-powers.txt`, `pr4/r1fix/findings/duo__duo-mutant-survivors.txt`, `pr4/r1fix/findings/duo__duo-nkb-note-energy.txt`, `pr4/r1fix/findings/duo__duo-one-sided-paradox-nothing-moves.txt`, `pr4/r1fix/findings/duo__duo-paradox-claimed-harmless.txt`, `pr4/r1fix/findings/duo__duo-push-ground-preset-reason.txt`, `pr4/r1fix/findings/duo__duo-ratio-long-digits.txt`, `pr4/r1fix/findings/duo__duo-shoving-shake-reason.txt`, `pr4/r1fix/findings/duo__duo-steady-push-no-harm.txt`, `pr4/r1fix/findings/physics__physics-armwrestle-pin-loser-pad.txt`, `pr4/r1fix/findings/physics__physics-carry-force-omits-hold-and-cap.txt`, `pr4/r1fix/findings/physics__physics-from-above-bolted-real-rock.txt`, `pr4/r1fix/findings/physics__physics-shoving-match-bolted-rock-claim.txt`, `pr4/r1fix/findings/physics__physics-steady-push-bolted-real-rock.txt`, `pr4/r1fix/js/blk.js`, `pr4/r1fix/js/common.js`, `pr4/r1fix/js/e1.py`, `pr4/r1fix/js/e10.py`, `pr4/r1fix/js/e11.py`, `pr4/r1fix/js/e12.py`, `pr4/r1fix/js/e13.py`, `pr4/r1fix/js/e14.py`, `pr4/r1fix/js/e15.py`, `pr4/r1fix/js/e16.py`, `pr4/r1fix/js/e17.py`, `pr4/r1fix/js/e18.py`, `pr4/r1fix/js/e19.py`, `pr4/r1fix/js/e2.py`, `pr4/r1fix/js/e3.py`, `pr4/r1fix/js/e4.py`, `pr4/r1fix/js/e5.py`, `pr4/r1fix/js/e6.py`, `pr4/r1fix/js/e7.py`, `pr4/r1fix/js/e8.py`, `pr4/r1fix/js/e9.py`, `pr4/r1fix/js/fig0.js`, `pr4/r1fix/js/offpage.js`, `pr4/r1fix/js/pm.js`, `pr4/r1fix/js/probe.js`, `pr4/r1fix/js/rd1.py`, `pr4/r1fix/js/rd2.py`, `pr4/r1fix/js/rd3.py`, `pr4/r1fix/js/render.js`, `pr4/r1fix/js/rep.py`, `pr4/r1fix/js/revert.py`, `pr4/r1fix/js/s1.json`, `pr4/r1fix/js/s2.json`, `pr4/r1fix/js/s3.json`, `pr4/r1fix/js/s4.json`, `pr4/r1fix/js/s5.json`, `pr4/r1fix/js/s6.json`, `pr4/r1fix/js/sall.json`, `pr4/r1fix/js/sec.js`, `pr4/r1fix/js/t1.py`, `pr4/r1fix/js/t2.py`, `pr4/r1fix/js/t3.py`, `pr4/r1fix/js/t4.py`, `pr4/r1fix/js/t5.py`, `pr4/r1fix/js/t6.py`, `pr4/r1fix/js/t7.py`, `pr4/r1fix/js/toggle.js`, `pr4/r1fix/mutants/mutate.py`, `pr4/r1fix/mutants/results.json`, `pr4/r1fix/ok-before.txt`, `pr4/r1fix/ok-now.txt`, `pr4/r1fix/rec/build_json.py`, `pr4/r1fix/rec/outcomes.py`, `pr4/r1fix/rec/what.txt`, `pr4/r1fix/revert-results.json`, `pr4/r1fix/view/s1.txt`, `pr4/r1fix/view/s2.txt`, `pr4/r1fix/view/s3.txt`, `pr4/r1fix/view/s4.txt`, `pr4/r1fix/view/s5.txt`, `pr4/r1fix/view/s6.txt`, `pr4/r2-copy.txt`, `pr4/r2-duo.txt`, `pr4/r2fix/edits/p8ac.py`, `pr4/r2fix/edits/p8fghi.py`, `pr4/r2fix/edits/p8i.py`, `pr4/r2fix/edits/readme1.py`, `pr4/r2fix/edits/readme2.py`, `pr4/r2fix/edits/readme3.py`, `pr4/r2fix/edits/readme4.py`, `pr4/r2fix/edits/s1.py`, `pr4/r2fix/edits/s2.py`, `pr4/r2fix/js/blk.js`, `pr4/r2fix/js/common.js`, `pr4/r2fix/js/dump.js`, `pr4/r2fix/js/mkmeta.py`, `pr4/r2fix/js/offpage.js`, `pr4/r2fix/js/p13.json`, `pr4/r2fix/js/q1.js`, `pr4/r2fix/js/q2.js`, `pr4/r2fix/js/rec2-meta.json`, `pr4/r2fix/js/rec2-what.txt`, `pr4/r2fix/js/rec2.py`, `pr4/r2fix/js/render.js`, `pr4/r2fix/js/revert1.py`, `pr4/r2fix/js/revert2.py`, `pr4/r2fix/js/rx.js`, `pr4/r2fix/js/s-air.json`, `pr4/r2fix/js/s-arm.json`, `pr4/r2fix/js/s-both.json`, `pr4/r2fix/js/s-col.json`, `pr4/r2fix/js/s-inf.json`, `pr4/r2fix/js/s-push.json`, `pr4/r2fix/js/s-render.json`, `pr4/r2fix/js/s-wr.json`, `pr4/r2fix/js/sec.js`, `pr4/r2fix/js/timing.js`, `pr4/r2fix/md5-before.txt`, `pr4/r2fix/mutants/mutate.py`, `pr4/r2fix/mutants/results.json`, `pr4/r2fix/pr-body-draft.md`, `pr4/r2fix/pr-body-r1.md`, `pr4/r2fix/revert1-results.json`, `pr4/r2fix/revert2-results.json`, `pr4/r3fix/js/blk3.js`, `pr4/r3fix/js/lists.py`, `pr4/r3fix/js/p13.json`, `pr4/r3fix/js/probe-page.js`, `pr4/r3fix/js/probe1.js`, `pr4/r3fix/js/readme63.py`, `pr4/r3fix/js/rec3-figs.json`, `pr4/r3fix/js/rec3-what.txt`, `pr4/r3fix/js/rec3.py`, `pr4/r3fix/js/render.js`, `pr4/r3fix/js/revert2b.py`, `pr4/r3fix/js/revert3.py`, `pr4/r3fix/js/s-render3.json`, `pr4/r3fix/js/sec.js`, `pr4/r3fix/js/timing3.js`, `pr4/r3fix/js/timing3b.js`, `pr4/r3fix/line.sh`, `pr4/r3fix/md5-before.txt`, `pr4/r3fix/mutants/mutate.py`, `pr4/r3fix/mutants/results.json`, `pr4/r3fix/pr-body-r2.md`, `pr4/r3fix/revert2b-results.json`, `pr4/r3fix/revert3-results.json`, `pr4/r3fix/time-before.sh`, `pr4/rcfix/blk3.js`, `pr4/rcfix/commit-msg.txt`, `pr4/rcfix/line.sh`, `pr4/rcfix/pr-body-before-rc.md`, `pr4/rcfix/probe-page.js`, `pr4/rcfix/rc-record.py`, `pr4/rcfix/rc-results.json`, `pr4/rcfix/revert-rc.py`, `pr4/recheck-raw.json`, `pr4/round1-majors.txt`, `pr4/round1-raw.json`, `pr4/round2-raw.json`, `pr4/round3-raw.json`, `pr4/scratch/arm_patch.py`, `pr4/scratch/common.js`, `pr4/scratch/contests.js`, `pr4/scratch/fig.js`, `pr4/scratch/fire_patch.py`, `pr4/scratch/offcompare.js`, `pr4/scratch/probe.js`, `pr4/scratch/section8.js`, `pr4/scratch/timing.js`

</details>

## pr5/

Pull request 5: the spec, the prototypes of the energy tally (proto/), the engine report and its mutant runs (engine-mutants/), the page stage's probes and page mutants (page/, page-mutants/), the review lenses (lenses.json), the README draft and the pull request's description.

103 files, 997 KB.

- `pr5/engine-mutants/mutants.py`: Mutants for pull request 5's engine stage (the energy taken back, and the shimmer's level).
- `pr5/page-mutants/fails.js`: the pr5 check ids that failed in a shots.js log (node fails.js &lt;log&gt;)
- `pr5/page-mutants/mutants.py`: Page mutants for pull request 5's shots.js block: each copies the lab, reverts or breaks one part of the page build,
- `pr5/page/look.js`: screenshots of the two pictures with the glow at 0 and full, and the bays, at 390/1280, light/dark
- `pr5/page/pr5block.js`: ---- BRIEF-canon.md item 6, pull request 5: the absorption shimmer. The Shimmer tile (the energy their powers take back
- `pr5/page/render.js`: every changed view at 390 and 1280 px, light and dark: the bay with its Shimmer tile (and the pictures)
- `pr5/page/smoke.js`: quick look at the shimmer tile and glow in a set of states. node smoke.js [dist path]
- `pr5/proto/figures.js`: The spec's runs through RESTRAINT.takenBack (engine on this branch). Run: node figures.js
- `pr5/proto/report-figures.js`: The engine report's figures, printed as Markdown rows from the engine and the ladder (no figure typed by hand).
- `pr5/r1fix/js/docs1.py`: Copy checks for review round 1 of pull request 5 on the README and the pull request's description (no page shows these).
- `pr5/r1fix/js/figs.js`: the figures review round 1 moves, from the engine before (1d92534) and after (this tree); and the README's other runs
- `pr5/r1fix/js/rec1.py`: Builds rex-strength-lab/research/reviews/canon-5-round1.json from the round's raw findings (verified_ok, findings and verdicts
- `pr5/r1fix/js/revert1.py`: Review round 1 of pull request 5: each fix reverted on its own in a scratch tree, and the review's surviving mutants (engine
- `pr5/r1fix/line.sh`: the full Rex lab test line, one test at a time, each timed (review round 1 of pull request 5)
- `pr5/r2fix/js/coltip.py`: Review round 2 of pull request 5: the Collide picture's last spike tip (0.619, 0.090) sits on the sky beside its spike.
- `pr5/r2fix/js/crops.js`: screenshots of the header picture's glow at none, a faint glow (the stomp at 10^9 kg) and full, at 390 and 1280 px,
- `pr5/r2fix/js/docs2.py`: Copy checks for review round 2 of pull request 5 on the README and the pull request's description (no page shows these).
- `pr5/r2fix/js/eng.js`: quick engine probes for review round 2's fixes: node eng.js [repo rex-strength-lab dir]
- `pr5/r2fix/js/figs2.js`: the figures review round 2 moves, from the engine before (f6d20c3) and after (this tree); and the README's other runs (round 1's
- `pr5/r2fix/js/n29.js`: N29 (tbDrag without its arrive === Infinity guard): where does a drag part meet an unbounded arrival?
- `pr5/r2fix/js/n30.js`: N30: is there a game-of-catch leg whose full-drag flight (as realAirLeg flies it) times out? A grid of objects,
- `pr5/r2fix/js/overlap2.py`: glow-weighted share of each crest glow over the grey backdrop and over tan crest pixels (the review's overlap.py, for
- `pr5/r2fix/js/probe.js`: probe the built page for review round 2's states: node probe.js [repo rex-strength-lab dir]
- `pr5/r2fix/js/probe2.js`: the game of catch past 1% of light speed: does the page label the shimmer's drag figure (all of its energy) there?
- `pr5/r2fix/js/rec2.py`: Writes rex-strength-lab/research/reviews/canon-5-round2.json: round 2's lenses and findings as the review gave them
- `pr5/r2fix/js/revert2.py`: Review round 2 of pull request 5: each of this round's fixes reverted on its own in a scratch tree, and every earlier
- `pr5/r2fix/js/revert2b.py`: Review round 2 of pull request 5: each of this round's fixes reverted on its own in a scratch tree, and every earlier
- `pr5/r2fix/js/tips.py`: Review round 2 of pull request 5, design-crest-tips-off-feathers: measure the header picture's crest-feather tips from
- `pr5/r2fix/js/views.js`: screenshots of round 2's changed views at 390 and 1280 px, light and dark: the Arm tab's tile and sentence, the Wrestle
- `pr5/r2fix/line2.sh`: the full Rex lab test line, one test at a time, each timed (review round 2 of pull request 5)

<details><summary>All 103 files</summary>

`pr5/SPEC.md`, `pr5/commit-msg-page.txt`, `pr5/commit-msg.txt`, `pr5/engine-mutants/mutants.py`, `pr5/engine-mutants/results.json`, `pr5/engine-mutants/results.md`, `pr5/engine-report.md`, `pr5/final-calibration.txt`, `pr5/final-ladder.txt`, `pr5/final-powers.txt`, `pr5/final-presence.txt`, `pr5/fullline/status-after-build.txt`, `pr5/fullline/status-before.txt`, `pr5/fullline/times.txt`, `pr5/lenses-r2.json`, `pr5/lenses.json`, `pr5/page-mutants/fails.js`, `pr5/page-mutants/mutants.py`, `pr5/page-mutants/results-first.md`, `pr5/page-mutants/results.json`, `pr5/page-mutants/results.md`, `pr5/page/card.js`, `pr5/page/col.js`, `pr5/page/crop.py`, `pr5/page/dbg.js`, `pr5/page/eng-catch.js`, `pr5/page/figures-now.md`, `pr5/page/look.js`, `pr5/page/pr5block.js`, `pr5/page/render.js`, `pr5/page/smoke.js`, `pr5/page/sweep.js`, `pr5/page/views/report.txt`, `pr5/page/wt.js`, `pr5/powers-baseline.txt`, `pr5/powers-full.txt`, `pr5/pr-body.md`, `pr5/proto/edges.js`, `pr5/proto/edges2.js`, `pr5/proto/esc.js`, `pr5/proto/figures.js`, `pr5/proto/over.js`, `pr5/proto/prof.js`, `pr5/proto/report-figures.js`, `pr5/proto/report-figures.md`, `pr5/proto/timer.js`, `pr5/proto/who.js`, `pr5/proto/wr.js`, `pr5/r1fix/figs.txt`, `pr5/r1fix/js/cases.js`, `pr5/r1fix/js/cases2.js`, `pr5/r1fix/js/common.js`, `pr5/r1fix/js/docs1.py`, `pr5/r1fix/js/explore1.js`, `pr5/r1fix/js/figs.js`, `pr5/r1fix/js/legesc.js`, `pr5/r1fix/js/page.js`, `pr5/r1fix/js/probe1.js`, `pr5/r1fix/js/probe2.js`, `pr5/r1fix/js/reach.js`, `pr5/r1fix/js/rec1.py`, `pr5/r1fix/js/revert1.py`, `pr5/r1fix/js/rnd.js`, `pr5/r1fix/js/toss08.js`, `pr5/r1fix/line.sh`, `pr5/r1fix/line/times.txt`, `pr5/r1fix/md5-a.txt`, `pr5/r1fix/pr-body-before.md`, `pr5/r1fix/rec1-facts.json`, `pr5/r1fix/revert1-results.json`, `pr5/r2fix/design/cands.json`, `pr5/r2fix/design/cands2.json`, `pr5/r2fix/design/tips-R7.txt`, `pr5/r2fix/design/tips-R9.txt`, `pr5/r2fix/js/coltip.py`, `pr5/r2fix/js/crops.js`, `pr5/r2fix/js/docs2.py`, `pr5/r2fix/js/eng.js`, `pr5/r2fix/js/figs2.js`, `pr5/r2fix/js/follow2.json`, `pr5/r2fix/js/n29.js`, `pr5/r2fix/js/n30.js`, `pr5/r2fix/js/over.js`, `pr5/r2fix/js/over2.js`, `pr5/r2fix/js/overlap2.py`, `pr5/r2fix/js/probe.js`, `pr5/r2fix/js/probe2.js`, `pr5/r2fix/js/rec2.py`, `pr5/r2fix/js/revert2.py`, `pr5/r2fix/js/revert2b.py`, `pr5/r2fix/js/tips.py`, `pr5/r2fix/js/views.js`, `pr5/r2fix/line/times.txt`, `pr5/r2fix/line2.sh`, `pr5/r2fix/pr-body-before.md`, `pr5/r2fix/r2code-mutants.json`, `pr5/r2fix/rec2-facts.json`, `pr5/r2fix/rec2-outcomes.json`, `pr5/r2fix/revert2-results.json`, `pr5/readme-section.md`, `pr5/round1-raw.json`, `pr5/round2-raw.json`, `pr5/tests-para.md`

</details>

## review-pr2-r1/

Pull request 2, review round 1: the reviewers' and skeptics' repro scripts, one folder per lens. Their clones of the repository are listed, not copied.

58 files, 94 KB.

- `review-pr2-r1/code/cmpmut.js`: node cmpmut.js &lt;mutant&gt; : compare catch legs of the branch and a mutant engine over a grid (own recoil on)
- `review-pr2-r1/code/fp.js`: node fp.js &lt;engine&gt; &lt;data&gt; &lt;out.json&gt; : fingerprints of every powers-off case with {} and OFF, current kV
- `review-pr2-r1/code/mutate.js`: node mutate.js &lt;name&gt; : makes mut/&lt;name&gt;/rex-strength-lab with the mutant applied (from mutants.js)
- `review-pr2-r1/code/newchecks.js`: node newchecks.js &lt;dist/index.html&gt; : the checks pull request 2 added to test/shots.js, run alone on any page
- `review-pr2-r1/code/probe.js`: node probe.js &lt;dist&gt; '&lt;json state&gt;' [effort] [regex] : load a state on the page and print the bay's text (or matching sentences)
- `review-pr2-r1/code/run-shots.sh`: run-shots.sh &lt;mutant&gt;... : build each mutant's page and run the full test/shots.js on it
- `review-pr2-r1/code/scan.js`: node scan.js &lt;dist&gt; : page text for NaN/undefined/bare Infinity and page errors across states with their powers on
- `review-pr2-r1/code/timing.js`: node timing.js &lt;dist&gt; : time the Catch tab's first render and settle, defaults and real muscle
- `review-pr2-r1/code/timing2.js`: node timing2.js &lt;dist&gt; : wall time of the Catch tab: load to settled, and picking presets, defaults and real muscle
- `review-pr2-r1/copy/dump.js`: dump.js &lt;dist html&gt; &lt;outdir&gt; &lt;scenarios.json&gt; [width] [scheme]
- `review-pr2-r1/physics/s/hv.js`: load either engine: VER=main or branch
- `review-pr2-r1/verify-code/page.js`: usage: node page.js '&lt;json state&gt;' [allout] [bay]
- `review-pr2-r1/verify-copy/work/page.js`: usage: node page.js '&lt;json state&gt;' [actions json]

<details><summary>All 58 files</summary>

`review-pr2-r1/code/cmpmut.js`, `review-pr2-r1/code/eng.js`, `review-pr2-r1/code/fp.js`, `review-pr2-r1/code/mutants.js`, `review-pr2-r1/code/mutate.js`, `review-pr2-r1/code/newchecks.js`, `review-pr2-r1/code/probe.js`, `review-pr2-r1/code/run-mutants.sh`, `review-pr2-r1/code/run-shots.sh`, `review-pr2-r1/code/scan.js`, `review-pr2-r1/code/sweep-own.js`, `review-pr2-r1/code/timing.js`, `review-pr2-r1/code/timing2.js`, `review-pr2-r1/copy/arm.js`, `review-pr2-r1/copy/dump.js`, `review-pr2-r1/copy/eng.js`, `review-pr2-r1/copy/mkscen.js`, `review-pr2-r1/copy/mkscen2.js`, `review-pr2-r1/physics/s/h.js`, `review-pr2-r1/physics/s/hv.js`, `review-pr2-r1/physics/s/pg1.js`, `review-pr2-r1/physics/s/t1.js`, `review-pr2-r1/physics/s/t10.js`, `review-pr2-r1/physics/s/t11.js`, `review-pr2-r1/physics/s/t12.js`, `review-pr2-r1/physics/s/t13.js`, `review-pr2-r1/physics/s/t14.js`, `review-pr2-r1/physics/s/t15.js`, `review-pr2-r1/physics/s/t2.js`, `review-pr2-r1/physics/s/t3.js`, `review-pr2-r1/physics/s/t4.js`, `review-pr2-r1/physics/s/t5.js`, `review-pr2-r1/physics/s/t6.js`, `review-pr2-r1/physics/s/t7.js`, `review-pr2-r1/physics/s/t8.js`, `review-pr2-r1/physics/s/t9.js`, `review-pr2-r1/verify-code/c1.js`, `review-pr2-r1/verify-code/c2.js`, `review-pr2-r1/verify-code/c3.js`, `review-pr2-r1/verify-code/page.js`, `review-pr2-r1/verify-copy/work/arm.js`, `review-pr2-r1/verify-copy/work/page.js`, `review-pr2-r1/verify-copy/work/pull.js`, `review-pr2-r1/verify-copy/work/pull2.js`, `review-pr2-r1/verify-copy/work/shove.js`, `review-pr2-r1/verify-physics/s/f1.js`, `review-pr2-r1/verify-physics/s/f2.js`, `review-pr2-r1/verify-physics/s/f2page.js`, `review-pr2-r1/verify-physics/s/f3.js`, `review-pr2-r1/verify-physics/s/f3page.js`, `review-pr2-r1/verify-physics/s/f3page2.js`, `review-pr2-r1/verify-physics/s/f3page3.js`, `review-pr2-r1/verify-physics/s/f3page4.js`, `review-pr2-r1/verify-physics/s/f4.js`, `review-pr2-r1/verify-physics/s/f4page.js`, `review-pr2-r1/verify-physics/s/f4page2.js`, `review-pr2-r1/verify-physics/s/f4page3.js`, `review-pr2-r1/verify-physics/s/page.js`

</details>

## review-pr2-r2/

Pull request 2, review round 2: the reviewers' and skeptics' repro scripts, one folder per lens. Their clones of the repository are listed, not copied.

52 files, 104 KB.

- `review-pr2-r2/code/mutants.js`: Engine mutants for review round 2 (code lens). Each: id, what, edits [[find, replace]] (find must occur once).
- `review-pr2-r2/code/mutants2.js`: second batch: round 1's four catcher mutants and the code-1 revert (re-checked), and more subtle ones
- `review-pr2-r2/code/mutcmp.js`: compare the pristine engine with one mutant on given cases
- `review-pr2-r2/code/page-reverts-list.js`: one round 1 fix reverted each: [file ('app'|'engine'), find (current), replace (as at 51782b3 or a no-op of the fix)]
- `review-pr2-r2/code/page-reverts.js`: node page-reverts.js [ids]: builds the page with one round 1 fix reverted, runs r1check.js on it
- `review-pr2-r2/code/probe.js`: node probe.js &lt;dist html&gt; '&lt;json array of {state, effort?, duo?}&gt;' : prints the bay's text parts for each state
- `review-pr2-r2/code/r1check.js`: node r1check.js &lt;dist html&gt; : runs test/shots.js's round 1 block (pull request 2) on that page; prints which items fail
- `review-pr2-r2/code/run-mutants.js`: node run-mutants.js [ids...]: applies each engine mutant to mut/src/engine.js and runs mut/test/powers.js --skip-off
- `review-pr2-r2/code/run-mutants2.js`: node run-mutants.js [ids...]: applies each engine mutant to mut/src/engine.js and runs mut/test/powers.js --skip-off
- `review-pr2-r2/code/scan.js`: node scan.js &lt;dist html&gt; : NaN/undefined/bare Infinity in the page text, page errors and slow settles, at unlimited
- `review-pr2-r2/code/timing.js`: node timing.js &lt;dist html&gt; &lt;label&gt; : wall time from reload to settled (both bays), and for picking presets, per state
- `review-pr2-r2/copy/work/dump.js`: usage: node dump.js &lt;page.html&gt; &lt;cases.json&gt; &lt;out.json&gt; [width] [scheme]
- `review-pr2-r2/physics/work/page.js`: node page.js cases.json [branch|main]: each case { id, state, effort?, duoEffort?, bay: 'bay'|'duo-bay' }
- `review-pr2-r2/physics/work/sweepw.js`: usage: node sweepw.js &lt;which: branch|main&gt; &lt;kg&gt; &lt;angles csv&gt; &lt;objs csv&gt; &lt;surfs csv&gt; -&gt; JSON lines
- `review-pr2-r2/verify-code/c8.js`: the copy-2 check of test/shots.js's round-1 block, verbatim predicate, on a given page
- `review-pr2-r2/verify-code/probe.js`: usage: node probe.js &lt;page.html&gt; &lt;cases.json&gt;   cases: [{label, state, pick?, sel?:[...]}]
- `review-pr2-r2/verify-copy/work/page.js`: usage: node page.js &lt;branch|main&gt; '&lt;json state&gt;' [effortPreset] [duo]  -&gt; prints the bay's text parts

<details><summary>All 52 files</summary>

`review-pr2-r2/code/canthold.js`, `review-pr2-r2/code/eng.js`, `review-pr2-r2/code/esweep.js`, `review-pr2-r2/code/mutants.js`, `review-pr2-r2/code/mutants2.js`, `review-pr2-r2/code/mutcmp.js`, `review-pr2-r2/code/page-reverts-list.js`, `review-pr2-r2/code/page-reverts.js`, `review-pr2-r2/code/probe.js`, `review-pr2-r2/code/r1check.js`, `review-pr2-r2/code/run-mutants.js`, `review-pr2-r2/code/run-mutants2.js`, `review-pr2-r2/code/scan.js`, `review-pr2-r2/code/timing.js`, `review-pr2-r2/copy/work/arm.js`, `review-pr2-r2/copy/work/diffoff.py`, `review-pr2-r2/copy/work/diffon.py`, `review-pr2-r2/copy/work/dump.js`, `review-pr2-r2/copy/work/mkcases.js`, `review-pr2-r2/copy/work/mkpresets.js`, `review-pr2-r2/copy/work/moved.js`, `review-pr2-r2/copy/work/probe.js`, `review-pr2-r2/copy/work/pull.js`, `review-pr2-r2/copy/work/pull2.js`, `review-pr2-r2/copy/work/semi.js`, `review-pr2-r2/copy/work/show.py`, `review-pr2-r2/physics/work/a1.js`, `review-pr2-r2/physics/work/a2.js`, `review-pr2-r2/physics/work/a3.js`, `review-pr2-r2/physics/work/a4.js`, `review-pr2-r2/physics/work/h.js`, `review-pr2-r2/physics/work/page.js`, `review-pr2-r2/physics/work/sweepw.js`, `review-pr2-r2/verify-code/c1e.js`, `review-pr2-r2/verify-code/c2e.js`, `review-pr2-r2/verify-code/c3e.js`, `review-pr2-r2/verify-code/c6e.js`, `review-pr2-r2/verify-code/c8.js`, `review-pr2-r2/verify-code/eng.js`, `review-pr2-r2/verify-code/probe.js`, `review-pr2-r2/verify-copy/engine-main.js`, `review-pr2-r2/verify-copy/work/moved.js`, `review-pr2-r2/verify-copy/work/moved2.js`, `review-pr2-r2/verify-copy/work/page.js`, `review-pr2-r2/verify-copy/work/pull.js`, `review-pr2-r2/verify-physics/work/page.js`, `review-pr2-r2/verify-physics/work/ppv.js`, `review-pr2-r2/verify-physics/work/pull.js`, `review-pr2-r2/verify-physics/work/rattle.js`, `review-pr2-r2/verify-physics/work/sweep.js`, `review-pr2-r2/verify-physics/work/throw.js`, `review-pr2-r2/verify-physics/work/toss.js`

</details>

## review-pr2-r3/

Pull request 2, review round 3: the reviewers' and skeptics' repro scripts, one folder per lens. Their clones of the repository are listed, not copied.

71 files, 99 KB.

- `review-pr2-r3/code/work/engmut.js`: Engine/page mutants: node engmut.js &lt;name&gt;  -&gt; copies the branch's rex-strength-lab, applies the named mutation, runs
- `review-pr2-r3/code/work/nansweep.js`: NaN/undefined/Infinity sweep at unlimited strength and the dial's top
- `review-pr2-r3/code/work/pagemut.sh`: usage: pagemut.sh &lt;name&gt; "&lt;blocks&gt;" &lt;hunk-file-to-reverse | js-transform-file&gt;
- `review-pr2-r3/code/work/pagetime.js`: time to a settled result, main vs branch, interleaved
- `review-pr2-r3/code/work/probe-li.js`: probe.js &lt;index.html&gt; &lt;json list of [label, state, pickSel, pickVal, selectors...]&gt;
- `review-pr2-r3/code/work/probe.js`: probe.js &lt;index.html&gt; &lt;json list of [label, state, pickSel, pickVal, selectors...]&gt;
- `review-pr2-r3/code/work/pullceil.js`: courtesy ceiling and plaster/rattle presets for friction and bolted pulls: main vs branch, all four powers on
- `review-pr2-r3/code/work/pullceil2.js`: courtesy ceiling and plaster/rattle presets for friction and bolted pulls: main vs branch, all four powers on
- `review-pr2-r3/code/work/runblock.js`: Run selected check blocks of a shots.js against a given dist/index.html.
- `review-pr2-r3/copy/cmp.js`: node cmp.js main.json br.json [filterRegex]
- `review-pr2-r3/copy/dump.js`: node dump.js &lt;dist/index.html&gt; &lt;cases.json&gt; &lt;out.json&gt; [width height scheme]
- `review-pr2-r3/copy/ownstr.js`: node ownstr.js &lt;html&gt; : the can't-hold-it catch and the quick pin, with Ollie's own strength
- `review-pr2-r3/copy/r12.js`: node r12.js &lt;dist/index.html&gt; : runs test/shots.js's round 1 and round 2 blocks of pull request 2 against a page
- `review-pr2-r3/physics/work/probe.js`: usage: node probe.js &lt;dist html&gt; &lt;states.json&gt;  ; states: [{name, state, effort?, duoEffort?, eval?}]
- `review-pr2-r3/verify-code/work/probe.js`: usage: node probe.js &lt;dist/index.html&gt; &lt;cases.json&gt;
- `review-pr2-r3/verify-code/work/pullceil.js`: node pullceil.js : main vs branch pull ceilings and presets, page-style plan

<details><summary>All 71 files</summary>

`review-pr2-r3/code/pm/allReach-false.js`, `review-pr2-r3/code/pm/allReach-true.js`, `review-pr2-r3/code/pm/caught-false.js`, `review-pr2-r3/code/pm/caught-true.js`, `review-pr2-r3/code/pm/gen.js`, `review-pr2-r3/code/pm/hazlist-pull-off-generic.js`, `review-pr2-r3/code/pm/hazlist-pull-on-none.js`, `review-pr2-r3/code/pm/landGap-noAllReach.js`, `review-pr2-r3/code/pm/landGap-none.js`, `review-pr2-r3/code/pm/noteFn-pullOnWhy-none.js`, `review-pr2-r3/code/pm/pull-item-friction-cap-text.js`, `review-pr2-r3/code/pm/pull-item-walk-none.js`, `review-pr2-r3/code/pm/pullOnWhy-bolted-text.js`, `review-pr2-r3/code/pm/setaside-factsTop.js`, `review-pr2-r3/code/pm/thrown-false.js`, `review-pr2-r3/code/pm/thrown-true.js`, `review-pr2-r3/code/pm/topU-hi.js`, `review-pr2-r3/code/pm/topU-inf.js`, `review-pr2-r3/code/pm2/shove-ground-wording.js`, `review-pr2-r3/code/work/armprobe.js`, `review-pr2-r3/code/work/engmut.js`, `review-pr2-r3/code/work/nansweep.js`, `review-pr2-r3/code/work/pagemut.sh`, `review-pr2-r3/code/work/pagetime.js`, `review-pr2-r3/code/work/presetsweep.js`, `review-pr2-r3/code/work/probe-li.js`, `review-pr2-r3/code/work/probe.js`, `review-pr2-r3/code/work/pullceil.js`, `review-pr2-r3/code/work/pullceil2.js`, `review-pr2-r3/code/work/pullprobe.js`, `review-pr2-r3/code/work/runblock.js`, `review-pr2-r3/code/work/settletime.js`, `review-pr2-r3/code/work/timing.js`, `review-pr2-r3/copy/cmp.js`, `review-pr2-r3/copy/dump.js`, `review-pr2-r3/copy/eng.js`, `review-pr2-r3/copy/mkcases.js`, `review-pr2-r3/copy/mkspecial.js`, `review-pr2-r3/copy/muts.py`, `review-pr2-r3/copy/ownstr.js`, `review-pr2-r3/copy/r12.js`, `review-pr2-r3/copy/show.js`, `review-pr2-r3/copy/snap.js`, `review-pr2-r3/copy/t1.js`, `review-pr2-r3/copy/t2.js`, `review-pr2-r3/copy/t3.js`, `review-pr2-r3/copy/t4.js`, `review-pr2-r3/copy/t5.js`, `review-pr2-r3/copy/t6.js`, `review-pr2-r3/physics/work/catchsweep.js`, `review-pr2-r3/physics/work/env.js`, `review-pr2-r3/physics/work/envf.js`, `review-pr2-r3/physics/work/envm.js`, `review-pr2-r3/physics/work/fixcmp.js`, `review-pr2-r3/physics/work/mutate.py`, `review-pr2-r3/physics/work/probe.js`, `review-pr2-r3/physics/work/pullplan.js`, `review-pr2-r3/physics/work/throwplan.js`, `review-pr2-r3/physics/work/toss.js`, `review-pr2-r3/verify-code/work/probe.js`, `review-pr2-r3/verify-code/work/pullceil.js`, `review-pr2-r3/verify-copy/ceil.js`, `review-pr2-r3/verify-copy/page.js`, `review-pr2-r3/verify-copy/page2.js`, `review-pr2-r3/verify-copy/t3.js`, `review-pr2-r3/verify-copy/t3b.js`, `review-pr2-r3/verify-physics/catch1.js`, `review-pr2-r3/verify-physics/page.js`, `review-pr2-r3/verify-physics/page2.js`, `review-pr2-r3/verify-physics/pull1.js`, `review-pr2-r3/verify-physics/pull2.js`

</details>

## review-pr2-r3-recheck/

Pull request 2, the re-check of round 3's fixes: the reviewers' and skeptics' repro scripts, one folder per lens. Their clones of the repository are listed, not copied.

14 files, 38 KB.

- `review-pr2-r3-recheck/fixes/scripts/blocks.js`: Runs test/shots.js's review round 2 and round 3 blocks (verbatim, extracted from the clone's def9546 test) against
- `review-pr2-r3-recheck/fixes/scripts/legsweep.js`: Independent sweep: with They take their own recoil on, the pull's feet push on his own body (walkPush J/T) never
- `review-pr2-r3-recheck/fixes/scripts/mutants.py`: Mutation driver: each mutant = (name, kind, [(file, old, new)]); kind 'engine' runs powers.js --skip-off,
- `review-pr2-r3-recheck/fixes/scripts/plans.js`: main vs branch: the pull's courtesy ceiling, presets, least effort and all-out time, as the page plans them
- `review-pr2-r3-recheck/fixes/scripts/render.js`: Dump the Pull bay's text for given states. node render.js &lt;dir&gt; '&lt;json array of [state, effort]&gt;'
- `review-pr2-r3-recheck/verify-fixes/work/render.js`: node render.js &lt;dist/index.html&gt; '&lt;json array of [state, effort|null]&gt;' -&gt; prints verdict, status, happens, math, effort-read
- `review-pr2-r3-recheck/verify-fixes/work/runblock.js`: node runblock.js &lt;dist/index.html&gt; &lt;shots.js&gt; &lt;round: 2|3&gt;  -- runs that review block of shots.js against the html

<details><summary>All 14 files</summary>

`review-pr2-r3-recheck/fixes/scripts/blocks.js`, `review-pr2-r3-recheck/fixes/scripts/catchlegs.js`, `review-pr2-r3-recheck/fixes/scripts/catchlegs2.js`, `review-pr2-r3-recheck/fixes/scripts/legsweep.js`, `review-pr2-r3-recheck/fixes/scripts/mutants.py`, `review-pr2-r3-recheck/fixes/scripts/plans.js`, `review-pr2-r3-recheck/fixes/scripts/ppv.js`, `review-pr2-r3-recheck/fixes/scripts/render.js`, `review-pr2-r3-recheck/verify-fixes/work/eng.js`, `review-pr2-r3-recheck/verify-fixes/work/fixcheck.js`, `review-pr2-r3-recheck/verify-fixes/work/mutate.py`, `review-pr2-r3-recheck/verify-fixes/work/render.js`, `review-pr2-r3-recheck/verify-fixes/work/runblock.js`, `review-pr2-r3-recheck/verify-fixes/work/sprint10.js`

</details>

## review-pr3-r1/

Pull request 3, review round 1: the reviewers' and skeptics' repro scripts, one folder per lens. Their clones of the repository are listed, not copied.

29 files, 81 KB.

- `review-pr3-r1/code/work/cases.js`: The engine calls compared by the powers-off check (test/powers.js): with the four powers of BRIEF-gui.md section 5
- `review-pr3-r1/code/work/fp.js`: node fp.js &lt;engine&gt; &lt;out.json&gt; &lt;extraJSON&gt; [kV]
- `review-pr3-r1/code/work/mutate.js`: node mutate.js &lt;id&gt;: writes the mutant into mut/rex-strength-lab/src and rebuilds dist
- `review-pr3-r1/code/work/pr3check.js`: Runs shots.js's pull request 3 checks (lines 856-928, verbatim) and its mass migration check on a given page file
- `review-pr3-r1/physics/s/offsame.js`: compare PR engine vs base engine with Safe passenger off (and on for non-person objects): plan results must match
- `review-pr3-r1/verify-code/scripts/c2fix.js`: the proposed shots.js assertion, run standalone on a page
- `review-pr3-r1/verify-physics/view.js`: usage: node view.js &lt;page.html&gt; '&lt;state json&gt;' &lt;effortPick|-&gt; &lt;bay|duo-bay&gt; [regex...]

<details><summary>All 29 files</summary>

`review-pr3-r1/code/work/cases.js`, `review-pr3-r1/code/work/catchhot.js`, `review-pr3-r1/code/work/catchhot2.js`, `review-pr3-r1/code/work/edge.js`, `review-pr3-r1/code/work/eng1.js`, `review-pr3-r1/code/work/fp.js`, `review-pr3-r1/code/work/layout.js`, `review-pr3-r1/code/work/mutate.js`, `review-pr3-r1/code/work/plan-off.js`, `review-pr3-r1/code/work/pr3check.js`, `review-pr3-r1/code/work/runmut.sh`, `review-pr3-r1/code/work/saves.js`, `review-pr3-r1/code/work/sums.js`, `review-pr3-r1/code/work/throwread.js`, `review-pr3-r1/code/work/wrap.js`, `review-pr3-r1/physics/s/common.js`, `review-pr3-r1/physics/s/fast.js`, `review-pr3-r1/physics/s/fig1.js`, `review-pr3-r1/physics/s/fig2.js`, `review-pr3-r1/physics/s/gentle.js`, `review-pr3-r1/physics/s/offsame.js`, `review-pr3-r1/physics/s/page.js`, `review-pr3-r1/physics/s/supland.js`, `review-pr3-r1/verify-code/scripts/c1.js`, `review-pr3-r1/verify-code/scripts/c2.js`, `review-pr3-r1/verify-code/scripts/c2fix.js`, `review-pr3-r1/verify-physics/cap.js`, `review-pr3-r1/verify-physics/land.js`, `review-pr3-r1/verify-physics/view.js`

</details>

## review-pr3-r2/

Pull request 3, review round 2: the reviewers' and skeptics' repro scripts, one folder per lens. Their clones of the repository are listed, not copied.

36 files, 72 KB.

- `review-pr3-r2/code/tools/pr3harness.js`: Runs shots.js's pull-request-3 block (and the mass migration check) against a given repo's dist/index.html.
- `review-pr3-r2/code/tools/sweep.js`: NaN/undefined/Infinity sweep for a person on Throw and Catch, plus overflow of any element in the bays, and the summary line.
- `review-pr3-r2/physics/s/r1check.js`: replicates test/shots.js's pull request 3 round 1 checks and the very-fast impact check on one viewport
- `review-pr3-r2/physics/s/view.js`: usage: node view.js '&lt;state json&gt;' [effort] [bay|duo-bay] [htmlpath]
- `review-pr3-r2/verify-code/tools/pr3block.js`: Runs shots.js's pull request 3 block (taken verbatim from the reference clone) against the page built in &lt;repo&gt;

<details><summary>All 36 files</summary>

`review-pr3-r2/code/tools/count.js`, `review-pr3-r2/code/tools/eng1.js`, `review-pr3-r2/code/tools/eng2.js`, `review-pr3-r2/code/tools/migrate.js`, `review-pr3-r2/code/tools/mutate.py`, `review-pr3-r2/code/tools/pr3harness.js`, `review-pr3-r2/code/tools/run-eng-mutants.sh`, `review-pr3-r2/code/tools/run-page-mutants.sh`, `review-pr3-r2/code/tools/shots4.js`, `review-pr3-r2/code/tools/summary.js`, `review-pr3-r2/code/tools/sweep.js`, `review-pr3-r2/code/tools/text.js`, `review-pr3-r2/physics/s/catchmiss.js`, `review-pr3-r2/physics/s/env.js`, `review-pr3-r2/physics/s/mutate.py`, `review-pr3-r2/physics/s/r1check.js`, `review-pr3-r2/physics/s/sweep1.js`, `review-pr3-r2/physics/s/view.js`, `review-pr3-r2/verify-code/tools/ice.js`, `review-pr3-r2/verify-code/tools/ice2.js`, `review-pr3-r2/verify-code/tools/ice3.js`, `review-pr3-r2/verify-code/tools/pr3block.js`, `review-pr3-r2/verify-physics/s/f1.js`, `review-pr3-r2/verify-physics/s/f1b.js`, `review-pr3-r2/verify-physics/s/f2.js`, `review-pr3-r2/verify-physics/s/f2c.js`, `review-pr3-r2/verify-physics/s/f2d.js`, `review-pr3-r2/verify-physics/s/f2e.js`, `review-pr3-r2/verify-physics/s/f3.js`, `review-pr3-r2/verify-physics/s/f3b.js`, `review-pr3-r2/verify-physics/s/f4.js`, `review-pr3-r2/verify-physics/s/p1.js`, `review-pr3-r2/verify-physics/s/p2.js`, `review-pr3-r2/verify-physics/s/p3.js`, `review-pr3-r2/verify-physics/s/p4.js`, `review-pr3-r2/verify-physics/s/page.js`

</details>

## review-pr4-r1/

Pull request 4, review round 1: the reviewers' and skeptics' repro scripts, one folder per lens. Their clones of the repository are listed, not copied.

72 files, 106 KB.

- `review-pr4-r1/copy/s/render-base.js`: usage: node render.js cases.json outdir [w h scheme]
- `review-pr4-r1/copy/s/render.js`: usage: node render.js cases.json outdir [w h scheme]
- `review-pr4-r1/verify-copy/work/harness.js`: usage: node harness.js &lt;html&gt; '&lt;json state list&gt;' [effort] [width]
- `review-pr4-r1/verify-duo/work/page.js`: usage: node page.js '&lt;json state&gt;' [pick] [extra js to run before reading]

<details><summary>All 72 files</summary>

`review-pr4-r1/copy/cards.js`, `review-pr4-r1/copy/s/crop.js`, `review-pr4-r1/copy/s/crop2.js`, `review-pr4-r1/copy/s/eng.js`, `review-pr4-r1/copy/s/probe.js`, `review-pr4-r1/copy/s/probe2.js`, `review-pr4-r1/copy/s/render-base.js`, `review-pr4-r1/copy/s/render.js`, `review-pr4-r1/copy/s/t1.js`, `review-pr4-r1/copy/s/t2.js`, `review-pr4-r1/copy/s/t3.js`, `review-pr4-r1/copy/s/t4.js`, `review-pr4-r1/copy/s/t5.js`, `review-pr4-r1/copy/s/t6.js`, `review-pr4-r1/copy/s/t7.js`, `review-pr4-r1/duo/s/arm2.js`, `review-pr4-r1/duo/s/armpage.js`, `review-pr4-r1/duo/s/armtear.js`, `review-pr4-r1/duo/s/both2.js`, `review-pr4-r1/duo/s/c2.js`, `review-pr4-r1/duo/s/emut.js`, `review-pr4-r1/duo/s/env.js`, `review-pr4-r1/duo/s/fb.js`, `review-pr4-r1/duo/s/fb2.js`, `review-pr4-r1/duo/s/fbpre.js`, `review-pr4-r1/duo/s/fbtoggle.js`, `review-pr4-r1/duo/s/fbtoggle2.js`, `review-pr4-r1/duo/s/p10.js`, `review-pr4-r1/duo/s/para1.js`, `review-pr4-r1/duo/s/pmshake.js`, `review-pr4-r1/duo/s/pmshake2.js`, `review-pr4-r1/duo/s/pmut.js`, `review-pr4-r1/duo/s/pmutr.js`, `review-pr4-r1/duo/s/presets.js`, `review-pr4-r1/duo/s/prof.js`, `review-pr4-r1/duo/s/rows.js`, `review-pr4-r1/duo/s/shot.js`, `review-pr4-r1/duo/s/surf.js`, `review-pr4-r1/duo/s/sweep.js`, `review-pr4-r1/duo/s/timing.js`, `review-pr4-r1/duo/s/timing2.js`, `review-pr4-r1/physics/s/c1.js`, `review-pr4-r1/physics/s/c10.js`, `review-pr4-r1/physics/s/c2.js`, `review-pr4-r1/physics/s/c3.js`, `review-pr4-r1/physics/s/c4.js`, `review-pr4-r1/physics/s/c5.js`, `review-pr4-r1/physics/s/c6.js`, `review-pr4-r1/physics/s/c7.js`, `review-pr4-r1/physics/s/c8.js`, `review-pr4-r1/physics/s/c9.js`, `review-pr4-r1/physics/s/h.js`, `review-pr4-r1/physics/s/p1.js`, `review-pr4-r1/physics/s/p2.js`, `review-pr4-r1/physics/s/pg.js`, `review-pr4-r1/verify-copy/work/arm.js`, `review-pr4-r1/verify-copy/work/catchall.js`, `review-pr4-r1/verify-copy/work/clip.js`, `review-pr4-r1/verify-copy/work/eng.js`, `review-pr4-r1/verify-copy/work/grid.js`, `review-pr4-r1/verify-copy/work/harness.js`, `review-pr4-r1/verify-duo/work/eng.js`, `review-pr4-r1/verify-duo/work/page.js`, `review-pr4-r1/verify-physics/scripts/common.js`, `review-pr4-r1/verify-physics/scripts/f1.js`, `review-pr4-r1/verify-physics/scripts/f1b.js`, `review-pr4-r1/verify-physics/scripts/f2.js`, `review-pr4-r1/verify-physics/scripts/f3.js`, `review-pr4-r1/verify-physics/scripts/f3b.js`, `review-pr4-r1/verify-physics/scripts/f4.js`, `review-pr4-r1/verify-physics/scripts/f5.js`, `review-pr4-r1/verify-physics/scripts/page.js`

</details>

## review-pr4-r2/

Pull request 4, review round 2: the reviewers' and skeptics' repro scripts, one folder per lens. Their clones of the repository are listed, not copied.

58 files, 124 KB.

- `review-pr4-r2/copy/js/dump.js`: usage: node dump.js cases.json outdir
- `review-pr4-r2/duo/js/blk.js`: Runs part of shots.js's pull request 4 block against a built page: node blk.js &lt;shots.js&gt; &lt;ROOT with dist/ and test/&gt; &lt;r1|all&gt;
- `review-pr4-r2/duo/js/mut.py`: Each round 1 fix reverted on its own in a scratch tree; its covering checks run there.
- `review-pr4-r2/duo/js/probe-slow.js`: node probe.js &lt;dist/index.html&gt; &lt;cases.json&gt; &lt;out.json&gt; [width]
- `review-pr4-r2/duo/js/probe.js`: node probe.js &lt;dist/index.html&gt; &lt;cases.json&gt; &lt;out.json&gt; [width]
- `review-pr4-r2/duo/js/probe390.js`: node probe.js &lt;dist/index.html&gt; &lt;cases.json&gt; &lt;out.json&gt; [width]
- `review-pr4-r2/duo/js/revert.py`: Each round 1 fix reverted on its own in a scratch tree; its covering checks run there.
- `review-pr4-r2/duo/js/revert2.py`: Each round 1 fix reverted on its own in a scratch tree; its covering checks run there.
- `review-pr4-r2/duo/js/sec.js`: Runs chosen sections of test/powers.js against an engine: node sec.js &lt;engine.js&gt; &lt;powers.js&gt; &lt;section numbers, e.g. 6 8&gt;
- `review-pr4-r2/physics/js/findings.js`: Reproductions for review round 2, physics lens (PR 4). Run: node findings.js
- `review-pr4-r2/physics/js/pg.js`: usage: node pg.js '&lt;json state&gt;' [effort] [ollieLogKg]
- `review-pr4-r2/verify-copy/scripts/render.js`: usage: node render.js '&lt;json array of {name, state, pick, width, ollieKg, wm}&gt;'
- `review-pr4-r2/verify-duo/js/h.js`: usage: node h.js &lt;dist/index.html&gt; '&lt;json array of [state, pick]&gt;'
- `review-pr4-r2/verify-duo/js/inplace.js`: the round-1 check 'a Never knocked back switch turned over in place gives what a fresh load gives', copied from test/shots.js

<details><summary>All 58 files</summary>

`review-pr4-r2/copy/js/dump.js`, `review-pr4-r2/copy/js/eng.js`, `review-pr4-r2/copy/js/powers.js`, `review-pr4-r2/duo/js/blk.js`, `review-pr4-r2/duo/js/cmpoff.py`, `review-pr4-r2/duo/js/eng.js`, `review-pr4-r2/duo/js/inplace.js`, `review-pr4-r2/duo/js/mkcases.py`, `review-pr4-r2/duo/js/mut.py`, `review-pr4-r2/duo/js/offcmp.js`, `review-pr4-r2/duo/js/offcmp2.js`, `review-pr4-r2/duo/js/probe-slow.js`, `review-pr4-r2/duo/js/probe.js`, `review-pr4-r2/duo/js/probe390.js`, `review-pr4-r2/duo/js/revert.py`, `review-pr4-r2/duo/js/revert2.py`, `review-pr4-r2/duo/js/scan.py`, `review-pr4-r2/duo/js/sec.js`, `review-pr4-r2/duo/js/switches.js`, `review-pr4-r2/physics/js/a1.js`, `review-pr4-r2/physics/js/a2.js`, `review-pr4-r2/physics/js/b1.js`, `review-pr4-r2/physics/js/c1.js`, `review-pr4-r2/physics/js/e1.js`, `review-pr4-r2/physics/js/f1.js`, `review-pr4-r2/physics/js/findings.js`, `review-pr4-r2/physics/js/h.js`, `review-pr4-r2/physics/js/m1.js`, `review-pr4-r2/physics/js/pg.js`, `review-pr4-r2/physics/js/q1.js`, `review-pr4-r2/physics/js/s1.js`, `review-pr4-r2/verify-copy/scripts/common.js`, `review-pr4-r2/verify-copy/scripts/f1.js`, `review-pr4-r2/verify-copy/scripts/f2.js`, `review-pr4-r2/verify-copy/scripts/f4.js`, `review-pr4-r2/verify-copy/scripts/f7.js`, `review-pr4-r2/verify-copy/scripts/render.js`, `review-pr4-r2/verify-duo/js/both.js`, `review-pr4-r2/verify-duo/js/h.js`, `review-pr4-r2/verify-duo/js/inplace.js`, `review-pr4-r2/verify-physics/js/common.js`, `review-pr4-r2/verify-physics/js/f1.js`, `review-pr4-r2/verify-physics/js/f1fix.js`, `review-pr4-r2/verify-physics/js/f2.js`, `review-pr4-r2/verify-physics/js/f2grid.js`, `review-pr4-r2/verify-physics/js/f3.js`, `review-pr4-r2/verify-physics/js/f4.js`, `review-pr4-r2/verify-physics/js/f5.js`, `review-pr4-r2/verify-physics/js/f5b.js`, `review-pr4-r2/verify-physics/js/f6.js`, `review-pr4-r2/verify-physics/js/f7.js`, `review-pr4-r2/verify-physics/js/p1.js`, `review-pr4-r2/verify-physics/js/p2.js`, `review-pr4-r2/verify-physics/js/p3.js`, `review-pr4-r2/verify-physics/js/p47.js`, `review-pr4-r2/verify-physics/js/p5.js`, `review-pr4-r2/verify-physics/js/p6.js`, `review-pr4-r2/verify-physics/js/page.js`

</details>

## review-pr4-r3/

Pull request 4, review round 3: the reviewers' and skeptics' repro scripts, one folder per lens. Their clones of the repository are listed, not copied.

58 files, 171 KB.

- `review-pr4-r3/copy/js/render.js`: usage: node render.js cases.json [out.json]
- `review-pr4-r3/copy/rv/revert2.py`: Each review round 2 fix reverted on its own in a scratch tree; its covering checks run there.
- `review-pr4-r3/duo/tools/diff.js`: node diff.js &lt;a.json&gt; &lt;b.json&gt;: per state and effort, which parts differ (verdict, status, tiles, effort, happens, math)
- `review-pr4-r3/duo/tools/mkr2.js`: node mkr2.js &lt;shots.js in&gt; &lt;out&gt;: the PR4 block with everything before round 2's checks skipped when R2ONLY is set
- `review-pr4-r3/duo/tools/mkstates.js`: node mkstates.js &lt;out.json&gt; &lt;powers: on|recoilOff|off&gt; [dials]
- `review-pr4-r3/duo/tools/narrow.js`: node narrow.js &lt;page&gt; &lt;states.json&gt;: at 390 px light and dark, horizontal overflow and SVG text past the svg's box
- `review-pr4-r3/duo/tools/prescan.js`: node prescan.js &lt;presets sweep.json&gt;: preset readouts against the all-out view of the same state
- `review-pr4-r3/duo/tools/rv.py`: python3 rv.py &lt;name...&gt;   each revert/mutant in its own scratch tree; runs powers.js section 8 and/or the round-2-only
- `review-pr4-r3/duo/tools/scan.js`: node scan.js &lt;sweep out.json&gt;: flags bad tokens, unsettled views, page errors, 'harmless' beside movement, and
- `review-pr4-r3/duo/tools/sweep.js`: node sweep.js &lt;dist/index.html&gt; &lt;states.json&gt; &lt;out.json&gt; [efforts comma list]
- `review-pr4-r3/verify-copy/scripts/page.js`: usage: node page.js &lt;dist/index.html&gt; '&lt;json list of cases: {state, effort, ollieLog, label}&gt;'
- `review-pr4-r3/verify-duo/scripts/mutate.js`: usage: node mutate.js &lt;rex-strength-lab dir&gt; &lt;mutant ids comma-separated&gt;
- `review-pr4-r3/verify-duo/scripts/page.js`: usage: node page.js &lt;rex-strength-lab dir&gt; &lt;case,...&gt;
- `review-pr4-r3/verify-physics/page.js`: usage: node page.js '&lt;state json&gt;' '&lt;ollieLogKg or ""&gt;' '&lt;effort&gt;' [extra js]

<details><summary>All 58 files</summary>

`review-pr4-r3/copy/js/eng.js`, `review-pr4-r3/copy/js/gen.py`, `review-pr4-r3/copy/js/render.js`, `review-pr4-r3/copy/js/show.py`, `review-pr4-r3/copy/js/t1.js`, `review-pr4-r3/copy/js/t2.js`, `review-pr4-r3/copy/js/t3.js`, `review-pr4-r3/copy/rv/revert2.py`, `review-pr4-r3/duo/tools/diff.js`, `review-pr4-r3/duo/tools/eng.js`, `review-pr4-r3/duo/tools/mkr2.js`, `review-pr4-r3/duo/tools/mkstates.js`, `review-pr4-r3/duo/tools/nan.js`, `review-pr4-r3/duo/tools/narrow.js`, `review-pr4-r3/duo/tools/prescan.js`, `review-pr4-r3/duo/tools/rv.py`, `review-pr4-r3/duo/tools/scan.js`, `review-pr4-r3/duo/tools/sweep.js`, `review-pr4-r3/physics/js/arm1.js`, `review-pr4-r3/physics/js/arm2.js`, `review-pr4-r3/physics/js/bounce.js`, `review-pr4-r3/physics/js/bounce2.js`, `review-pr4-r3/physics/js/figs.js`, `review-pr4-r3/physics/js/fire.js`, `review-pr4-r3/physics/js/grav.js`, `review-pr4-r3/physics/js/h.js`, `review-pr4-r3/physics/js/hill.js`, `review-pr4-r3/physics/js/pArm.js`, `review-pr4-r3/physics/js/pBoth.js`, `review-pr4-r3/physics/js/pBothB.js`, `review-pr4-r3/physics/js/pBounce.js`, `review-pr4-r3/physics/js/pCol.js`, `review-pr4-r3/physics/js/pPar.js`, `review-pr4-r3/physics/js/pWr.js`, `review-pr4-r3/physics/js/pw.js`, `review-pr4-r3/physics/js/rattle.js`, `review-pr4-r3/physics/js/shv.js`, `review-pr4-r3/physics/js/sweep1.js`, `review-pr4-r3/physics/js/sweep2.js`, `review-pr4-r3/physics/js/sweep3.js`, `review-pr4-r3/physics/js/t1.js`, `review-pr4-r3/physics/js/walk.js`, `review-pr4-r3/physics/mut.py`, `review-pr4-r3/verify-copy/scripts/f1.js`, `review-pr4-r3/verify-copy/scripts/f4.js`, `review-pr4-r3/verify-copy/scripts/f5.js`, `review-pr4-r3/verify-copy/scripts/page.js`, `review-pr4-r3/verify-duo/pr4block.js`, `review-pr4-r3/verify-duo/scripts/cap.js`, `review-pr4-r3/verify-duo/scripts/eng.js`, `review-pr4-r3/verify-duo/scripts/mutate.js`, `review-pr4-r3/verify-duo/scripts/page.js`, `review-pr4-r3/verify-duo/scripts/u3.js`, `review-pr4-r3/verify-physics/f1.js`, `review-pr4-r3/verify-physics/f1fix.js`, `review-pr4-r3/verify-physics/f2.js`, `review-pr4-r3/verify-physics/f3.js`, `review-pr4-r3/verify-physics/page.js`

</details>

## review-pr4-r3-recheck/

Pull request 4, the re-check of round 3's fixes: the reviewers' and skeptics' repro scripts, one folder per lens. Their clones of the repository are listed, not copied.

17 files, 160 KB.

- `review-pr4-r3-recheck/fixes/js/eng.js`: load the engine of a given rex-strength-lab dir
- `review-pr4-r3-recheck/fixes/js/oldwait.js`: on the R1 page (every two-player redraw 800 ms late), the old block's pick (selectOption, 300 ms, then settle) reads a stale bay
- `review-pr4-r3-recheck/fixes/js/probe.js`: load a lab's dist page in Chromium at given states and print the two-player bay's texts
- `review-pr4-r3-recheck/fixes/new-blk.js`: ---- BRIEF-canon.md item 4, pull request 4: contests (force moves: the other's push is real, only each one's own push
- `review-pr4-r3-recheck/fixes/old-blk.js`: ---- BRIEF-canon.md item 4, pull request 4: contests (force moves: the other's push is real, only each one's own push
- `review-pr4-r3-recheck/fixes/py/hunks.py`: split git diff f25f9b4..ad1aa9c of a file into hunks; list them, or write a patch of the chosen hunks
- `review-pr4-r3-recheck/fixes/py/mktree.py`: build a scratch tree with chosen round 3 fixes reverted (hunks of git diff f25f9b4..ad1aa9c, and/or string edits)
- `review-pr4-r3-recheck/fixes/py/reverts.py`: the round 3 fixes, each reverted on its own (whole fix: every hunk of git diff f25f9b4..ad1aa9c it made), and the
- `review-pr4-r3-recheck/fixes/py/run.py`: build each revert's tree and run its covering checks; one at a time
- `review-pr4-r3-recheck/fixes/py/trim.py`: make a trimmed shots.js: helpers of the pull request 4 block + the chosen sub-blocks (build, r1, r2, r3)
- `review-pr4-r3-recheck/verify-fixes/probe.js`: usage: node probe.js &lt;rex-strength-lab dir&gt; &lt;json list of cases&gt;

<details><summary>All 17 files</summary>

`review-pr4-r3-recheck/fixes/js/arm1.js`, `review-pr4-r3-recheck/fixes/js/bounce1.js`, `review-pr4-r3-recheck/fixes/js/bounce2.js`, `review-pr4-r3-recheck/fixes/js/eng.js`, `review-pr4-r3-recheck/fixes/js/oldwait.js`, `review-pr4-r3-recheck/fixes/js/probe.js`, `review-pr4-r3-recheck/fixes/js/walk1.js`, `review-pr4-r3-recheck/fixes/new-blk.js`, `review-pr4-r3-recheck/fixes/old-blk.js`, `review-pr4-r3-recheck/fixes/py/hunks.py`, `review-pr4-r3-recheck/fixes/py/mktree.py`, `review-pr4-r3-recheck/fixes/py/reverts.py`, `review-pr4-r3-recheck/fixes/py/run.py`, `review-pr4-r3-recheck/fixes/py/trim.py`, `review-pr4-r3-recheck/verify-fixes/eng-arm.js`, `review-pr4-r3-recheck/verify-fixes/mutate.py`, `review-pr4-r3-recheck/verify-fixes/probe.js`

</details>

## review-pr5-r1/

Pull request 5, review round 1: the reviewers' and skeptics' repro scripts, one folder per lens. Their clones of the repository are listed, not copied.

65 files, 128 KB.

- `review-pr5-r1/code/s/pw.js`: usage: node pw.js &lt;dist/index.html&gt; ; probes the Shimmer tile in states
- `review-pr5-r1/copy/work/h.js`: harness: node h.js scenarios.json out.json [width]
- `review-pr5-r1/verify-design/work/repro.js`: Reproduce the two design findings in the built page

<details><summary>All 65 files</summary>

`review-pr5-r1/code/s/catch-spur.js`, `review-pr5-r1/code/s/catch-sweep.js`, `review-pr5-r1/code/s/drag-sweep.js`, `review-pr5-r1/code/s/emut.py`, `review-pr5-r1/code/s/esc.js`, `review-pr5-r1/code/s/h.js`, `review-pr5-r1/code/s/off-sweep.js`, `review-pr5-r1/code/s/pmut.py`, `review-pr5-r1/code/s/probe1.js`, `review-pr5-r1/code/s/probe2.js`, `review-pr5-r1/code/s/probe3.js`, `review-pr5-r1/code/s/pw.js`, `review-pr5-r1/copy/work/card.js`, `review-pr5-r1/copy/work/eng.js`, `review-pr5-r1/copy/work/h.js`, `review-pr5-r1/copy/work/mk.js`, `review-pr5-r1/copy/work/mk2.js`, `review-pr5-r1/copy/work/shot.js`, `review-pr5-r1/copy/work/wbox.js`, `review-pr5-r1/design/work/a11y.js`, `review-pr5-r1/design/work/art.js`, `review-pr5-r1/design/work/card.js`, `review-pr5-r1/design/work/common.js`, `review-pr5-r1/design/work/crops.js`, `review-pr5-r1/design/work/forced.js`, `review-pr5-r1/design/work/isolate.js`, `review-pr5-r1/design/work/montage.py`, `review-pr5-r1/design/work/motion.js`, `review-pr5-r1/design/work/peek.js`, `review-pr5-r1/design/work/shift.js`, `review-pr5-r1/design/work/sweep.js`, `review-pr5-r1/design/work/sweep2.js`, `review-pr5-r1/design/work/tileonly.js`, `review-pr5-r1/design/work/tiles.js`, `review-pr5-r1/design/work/wcontrast.js`, `review-pr5-r1/design/work/weight.js`, `review-pr5-r1/verify-code/scripts/c1.js`, `review-pr5-r1/verify-code/scripts/c1b.js`, `review-pr5-r1/verify-code/scripts/c2.js`, `review-pr5-r1/verify-code/scripts/c3.js`, `review-pr5-r1/verify-code/scripts/c4d.js`, `review-pr5-r1/verify-code/scripts/c5b.js`, `review-pr5-r1/verify-code/scripts/c5c.js`, `review-pr5-r1/verify-code/scripts/c5diff.js`, `review-pr5-r1/verify-code/scripts/c5reach.js`, `review-pr5-r1/verify-code/scripts/common.js`, `review-pr5-r1/verify-code/scripts/fixtry.js`, `review-pr5-r1/verify-code/scripts/muteng.js`, `review-pr5-r1/verify-code/scripts/mutpage.js`, `review-pr5-r1/verify-code/scripts/p1.js`, `review-pr5-r1/verify-code/scripts/p3.js`, `review-pr5-r1/verify-code/scripts/p4.js`, `review-pr5-r1/verify-code/scripts/page.js`, `review-pr5-r1/verify-copy/scripts/c1.js`, `review-pr5-r1/verify-copy/scripts/c1b.js`, `review-pr5-r1/verify-copy/scripts/c1c.js`, `review-pr5-r1/verify-copy/scripts/c2.js`, `review-pr5-r1/verify-copy/scripts/c2p.js`, `review-pr5-r1/verify-copy/scripts/c3.js`, `review-pr5-r1/verify-copy/scripts/c4.js`, `review-pr5-r1/verify-copy/scripts/c5.js`, `review-pr5-r1/verify-copy/scripts/c6.js`, `review-pr5-r1/verify-copy/scripts/h.js`, `review-pr5-r1/verify-design/work/eng.js`, `review-pr5-r1/verify-design/work/repro.js`

</details>

## review-pr5-r2/

Pull request 5, review round 2: the reviewers' and skeptics' repro scripts, one folder per lens. Their clones of the repository are listed, not copied.

76 files, 166 KB.

- `review-pr5-r2/code/js/flysweep.js`: fly() outputs, base (canon-4) vs this branch, with tally unset, over a sweep
- `review-pr5-r2/code/js/h.js`: helpers: load the engine from a repo dir (default: my clone)
- `review-pr5-r2/code/js/mut.js`: mutation runner: node mut.js &lt;mutants.json&gt; [outfile]
- `review-pr5-r2/code/js/mutants-engine.js`: engine mutants: round 1's reverts (R*), round 1's code-5 mutants (M*), and new ones for this lens (N*)
- `review-pr5-r2/code/js/mutants-ladder.js`: ladder (glow) mutants, each against node test/ladder.js
- `review-pr5-r2/code/js/mutants-page.js`: page mutants, each checked against node test/shots.js --pr5
- `review-pr5-r2/code/js/mutants-page2.js`: round 1's page fixes reverted (code-2's page words, code-4's effort and floor note), each against shots --pr5
- `review-pr5-r2/code/js/mutcase.js`: load a mutated engine from a temp copy and compare a case: node mutcase.js
- `review-pr5-r2/code/js/pagedata.js`: render a dist/index.html and read the shimmer card, two tiles and the glows: node pagedata.js &lt;dist/index.html&gt; &lt;tag&gt;
- `review-pr5-r2/code/js/spurious.js`: count-once: legs whose arrival is taken back (a catch) but still leave a drag part, at the page's defaults
- `review-pr5-r2/code/js/spy.js`: Lens item 6: the page passes takenBack exactly the run it shows. Spies on the page's own engine calls (window.DinoPhys
- `review-pr5-r2/code/js/sweep1.js`: Lens item 1: the drag part over a sweep of throws (every throwable object, angles, dials from a lob to light speed,
- `review-pr5-r2/code/js/sweep3.js`: Lens items 2-3: every move over a wide sweep; with every power off E is exactly 0; each power alone gives only its own
- `review-pr5-r2/copy/js/figs-before.js`: Round 2 copy lens: the README's and the description's engine figures, recomputed from this clone's engine
- `review-pr5-r2/copy/js/figs.js`: Round 2 copy lens: the README's and the description's engine figures, recomputed from this clone's engine
- `review-pr5-r2/copy/js/revert.py`: Round 2 copy lens: revert each of round 1's copy fixes on its own in a scratch tree (from this reviewer's clone),
- `review-pr5-r2/copy/js/sweep.js`: Round 2 copy lens: load many page states, dump the Shimmer tile(s), the header and Collide glow, and the bay text
- `review-pr5-r2/design/js/dpr1.js`: DPR 1 shots of the header at none, the stomp at 10^9 kg and full, 1280 light; and spot geometry vs features
- `review-pr5-r2/design/js/lib.js`: shared helpers: load the built page into Playwright, set a saved state, wait for it to settle
- `review-pr5-r2/design/js/render.js`: crops of both pictures at none / middling / full, 390 and 1280 px, light and dark, reduced motion
- `review-pr5-r2/design/js/spill.js`: same page state, glow on vs glow layer hidden: pixels changed outside each picture box, and where inside
- `review-pr5-r2/design/js/states.js`: the glow never sticks: tabs, widths, themes, reload, the duo element opening and closing
- `review-pr5-r2/design/js/tiles.js`: the Shimmer tile: place, presence (powers on / every relevant power off), a11y tree, contrast
- `review-pr5-r2/verify-copy/js/pg.js`: usage: node pg.js '&lt;json state&gt;' [effort] [regex to extract]

<details><summary>All 76 files</summary>

`review-pr5-r2/code/fullline.sh`, `review-pr5-r2/code/js/arm.js`, `review-pr5-r2/code/js/armpage.js`, `review-pr5-r2/code/js/armpage2.js`, `review-pr5-r2/code/js/ec.js`, `review-pr5-r2/code/js/figs.js`, `review-pr5-r2/code/js/fixtry.js`, `review-pr5-r2/code/js/flysweep.js`, `review-pr5-r2/code/js/h.js`, `review-pr5-r2/code/js/mut.js`, `review-pr5-r2/code/js/mutants-engine.js`, `review-pr5-r2/code/js/mutants-ladder.js`, `review-pr5-r2/code/js/mutants-ladder2.js`, `review-pr5-r2/code/js/mutants-page.js`, `review-pr5-r2/code/js/mutants-page2.js`, `review-pr5-r2/code/js/mutcase.js`, `review-pr5-r2/code/js/n15.js`, `review-pr5-r2/code/js/n18.js`, `review-pr5-r2/code/js/n18b.js`, `review-pr5-r2/code/js/n32.js`, `review-pr5-r2/code/js/pagedata.js`, `review-pr5-r2/code/js/person12.js`, `review-pr5-r2/code/js/personthrow.js`, `review-pr5-r2/code/js/readme-figs.js`, `review-pr5-r2/code/js/spurious.js`, `review-pr5-r2/code/js/spy.js`, `review-pr5-r2/code/js/sweep1.js`, `review-pr5-r2/code/js/sweep3.js`, `review-pr5-r2/copy/js/col.js`, `review-pr5-r2/copy/js/fast.js`, `review-pr5-r2/copy/js/figs-before.js`, `review-pr5-r2/copy/js/figs.js`, `review-pr5-r2/copy/js/half.js`, `review-pr5-r2/copy/js/rel.js`, `review-pr5-r2/copy/js/revert.py`, `review-pr5-r2/copy/js/share.js`, `review-pr5-r2/copy/js/stomp.js`, `review-pr5-r2/copy/js/sweep.js`, `review-pr5-r2/design/js/a11y.js`, `review-pr5-r2/design/js/art.js`, `review-pr5-r2/design/js/dpr1.js`, `review-pr5-r2/design/js/geo.js`, `review-pr5-r2/design/js/lib.js`, `review-pr5-r2/design/js/narrow.js`, `review-pr5-r2/design/js/phone.js`, `review-pr5-r2/design/js/render.js`, `review-pr5-r2/design/js/spill.js`, `review-pr5-r2/design/js/states.js`, `review-pr5-r2/design/js/tiles.js`, `review-pr5-r2/verify-code/js/c1.js`, `review-pr5-r2/verify-code/js/c1dbg.js`, `review-pr5-r2/verify-code/js/c1fix.js`, `review-pr5-r2/verify-code/js/c1page.js`, `review-pr5-r2/verify-code/js/c2.js`, `review-pr5-r2/verify-code/js/c2dig.js`, `review-pr5-r2/verify-code/js/c2fix.js`, `review-pr5-r2/verify-code/js/c2page.js`, `review-pr5-r2/verify-code/js/c2sweep.js`, `review-pr5-r2/verify-code/js/c3a.js`, `review-pr5-r2/verify-code/js/c3b.js`, `review-pr5-r2/verify-code/js/c3page.js`, `review-pr5-r2/verify-code/js/c4p13.js`, `review-pr5-r2/verify-code/js/c4page.js`, `review-pr5-r2/verify-code/js/page.js`, `review-pr5-r2/verify-code/js/setup-fix1.js`, `review-pr5-r2/verify-code/js/setup-fix2.js`, `review-pr5-r2/verify-code/js/setup-mutB.js`, `review-pr5-r2/verify-code/js/setup.js`, `review-pr5-r2/verify-copy/js/eng.js`, `review-pr5-r2/verify-copy/js/fast.js`, `review-pr5-r2/verify-copy/js/pg.js`, `review-pr5-r2/verify-design/ctl.js`, `review-pr5-r2/verify-design/overlap.py`, `review-pr5-r2/verify-design/render.js`, `review-pr5-r2/verify-design/render2.js`, `review-pr5-r2/verify-design/tips.py`

</details>

## workflows/

The workflow orchestration scripts (each Workflow launch). They compute the subagent prompts quoted in the transcript.

3 files, 26 KB.

- `workflows/canon-2-understand-wf_5e1b4d7b-a47.js`: canon-2-understand: Map every change site for pull request 2 of BRIEF-canon.md (recoil into their source, ledger test, copy)
- `workflows/canon-345-understand-wf_dd4a10fa-8a1.js`: canon-345-understand: Map the change sites for pull requests 3, 4 and 5 of BRIEF-canon.md on a read-only copy of main
- `workflows/canon-review-wf_4184e806-762.js`: canon-review: Adversarial review round of a BRIEF-canon.md pull request: one reviewer per lens finds defects, one skeptic per lens reproduces or refutes each finding with code

<details><summary>All 3 files</summary>

`workflows/canon-2-understand-wf_5e1b4d7b-a47.js`, `workflows/canon-345-understand-wf_dd4a10fa-8a1.js`, `workflows/canon-review-wf_4184e806-762.js`

</details>

## Not copied

Copies of project code are main-tree/ (a worktree of main), the reviewers' clones of the repository (repo/ and the other git checkouts), and the build and fix subagents' copies of the lab's files, most with one line mutated to see whether a test catches it. The released versions are in the repository.

| Folder | Why | Files | Total size | Main types |
|---|---|---|---|---|
| review-pr2-r3 | copy of project code | 87707 | 2546.8 MB | .json, .png, .pack, .html |
| review-pr5-r2 | copy of project code | 87469 | 2041.1 MB | (none), .pack, .json, .jsonl |
| review-pr4-r2 | copy of project code | 71534 | 1651.9 MB | .png, .pack, .json, .js |
| review-pr4-r3 | copy of project code | 44658 | 1439.3 MB | .html, .png, .pack, .json |
| review-pr4-r1 | copy of project code | 61821 | 1402.1 MB | .pack, .png, (none), .json |
| review-pr2-r2 | copy of project code | 68606 | 1195.8 MB | .json, .png, .jsonl, .js |
| review-pr5-r1 | copy of project code | 34332 | 913.9 MB | .pack, (none), .png, .json |
| review-pr3-r2 | copy of project code | 38241 | 909.3 MB | .pack, .json, .png, (none) |
| review-pr2-r1 | copy of project code | 33450 | 886.8 MB | .json, .pack, .png, .js |
| pr4 | copy of project code | 4705 | 824.5 MB | .js, .json, .html, .png |
| review-pr4-r3-recheck | copy of project code | 12757 | 791.5 MB | .json, .html, .js, .png |
| review-pr3-r1 | copy of project code | 37303 | 751.9 MB | .pack, .png, .json, .jsonl |
| pr3 | copy of project code | 4657 | 729.0 MB | .json, .html, .js, .jpg |
| review-pr2-r3-recheck | copy of project code | 12090 | 632.8 MB | .json, .html, .js, .pack |
| pr2 | copy of project code | 1155 | 364.2 MB | .js, .html, .json, .py |
| review-pr2-r2 | built page or render | 67 | 115.9 MB | .html |
| review-pr4-r3 | built page or render | 54 | 101.3 MB | .html |
| pr3 | built page or render | 52 | 92.2 MB | .html |
| pr4 | image | 195 | 83.3 MB | .png |
| main-tree | copy of project code | 4522 | 59.0 MB | .json, .jsonl, .js, .md |
| review-pr2-r3-recheck | built page or render | 31 | 53.0 MB | .html |
| pr4 | built page or render | 24 | 44.8 MB | .html |
| review-pr2-r3 | built page or render | 25 | 43.3 MB | .html |
| review-pr5-r2 | built page or render | 21 | 41.4 MB | .html |
| review-pr2-r1 | built page or render | 21 | 36.1 MB | .html |
| review-pr3-r1 | built page or render | 19 | 32.1 MB | .html |
| review-pr4-r3 | binary or output | 110 | 26.5 MB | .json, .txt, .log, .diff |
| review-pr5-r2 | image | 83 | 25.0 MB | .png |
| review-pr3-r2 | built page or render | 14 | 24.4 MB | .html |
| review-pr4-r1 | built page or render | 12 | 22.1 MB | .html |
| pr5 | image | 158 | 20.0 MB | .png |
| review-pr4-r3 | image | 50 | 19.9 MB | .png |
| review-pr4-r2 | binary or output | 198 | 19.7 MB | .json, .txt, .diff, .log |
| review-pr5-r1 | built page or render | 10 | 19.6 MB | .html |
| review-pr4-r2 | image | 30 | 17.0 MB | .png |
| pr5 | copy of project code | 88 | 15.9 MB | .json, .html, .js, .jpg |
| pr2 | built page or render | 12 | 14.8 MB | .html |
| review-pr4-r2 | built page or render | 8 | 14.7 MB | .html |
| review-pr4-r3-recheck | built page or render | 8 | 14.1 MB | .html |
| pr5 | built page or render | 7 | 13.8 MB | .html |
| review-pr5-r1 | image | 109 | 11.9 MB | .png |
| review-pr3-r2 | image | 29 | 7.6 MB | .png |
| review-pr2-r1 | binary or output | 415 | 7.4 MB | .json, .txt, .diff, .out |
| page | built page or render | 4 | 6.9 MB | .html |
| review-pr2-r2 | binary or output | 91 | 6.7 MB | .json, .txt, .diff, .jsonl |
| review-pr2-r3 | binary or output | 184 | 5.8 MB | .json, .log, .diff, .txt |
| review-pr4-r1 | image | 11 | 5.7 MB | .png |
| pr4 | too large | 11 | 5.3 MB | .json, .txt |
| review-pr3-r1 | binary or output | 50 | 4.1 MB | .json, .txt, .diff, .log |
| review-pr2-r1 | image | 20 | 4.1 MB | .png |
| review-pr4-r1 | binary or output | 180 | 4.0 MB | .json, .txt, .diff, .log |
| review-pr5-r2 | binary or output | 54 | 3.4 MB | .json, .log, .md, .diff |
| understand345 | built page or render | 2 | 3.4 MB | .html |
| understand345 | image | 12 | 2.0 MB | .png |
| page | copy of project code | 1 | 1.7 MB | .html |
| understand2 | copy of project code | 6 | 1.4 MB | .js |
| review-pr3-r1 | image | 6 | 1.4 MB | .png |
| pr4 | binary or output | 79 | 1.2 MB | .log, (none) |
| pr3 | binary or output | 87 | 1.1 MB | .log, (none), .res |
| review-pr2-r2 | image | 6 | 1.0 MB | .png |
| pr2 | binary or output | 62 | 0.9 MB | .log, .before |
| review-pr5-r1 | binary or output | 30 | 0.9 MB | .json, .diff, .txt, .md |
| pr5 | binary or output | 77 | 0.7 MB | .log |
| page | image | 5 | 0.7 MB | .png |
| review-pr4-r3-recheck | binary or output | 52 | 0.7 MB | .md, .log, .patch, .txt |
| understand345 | copy of project code | 2 | 0.6 MB | .js |
| pr5 | too large | 3 | 0.5 MB | .md, .json |
| review-pr2-r3 | image | 3 | 0.5 MB | .png |
| review-pr3-r2 | binary or output | 24 | 0.5 MB | .log, .diff, .time |
| review-pr2-r3-recheck | binary or output | 43 | 0.4 MB | .log, .md |
| page | binary or output | 8 | 0.1 MB | .log |
| understand2 | binary or output | 8 | 0.0 MB | .log |

Not covered above: baseline.log (the test line's output on main before the run), history-build/ (where this builder was drafted and tested).
