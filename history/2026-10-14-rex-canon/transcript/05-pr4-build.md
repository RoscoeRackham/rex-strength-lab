# Pull request 4 (contests, Never knocked back): the build

2026-10-15 02:30:14 UTC to 2026-10-15 06:31:37 UTC. 6 assistant events, 2 commit events, 2 subagent events, 8 tool call events, 2 wakeup events.

On claude/canon-4-contests, stacked on #34, two background subagents built item 4: the engine and its tests (0f27012), then the page, the cards and the tests (238f570). In their contests (arm wrestling, every Wrestle move, Collide's charge and steady push, the partner toss) force moves: the other's push is real, and only each one's own recoil goes to his source. A charger doesn't slow, and where the one he hits is held without limit the collision has no physical answer, which the Collide tab now explains. The two Never knocked back switches, one each, were added beside Bolted, both on. Pull request 4 was opened as #35.

Events are in the order they happened in the session; each workflow’s subagents are listed under the call that launched it, with their own start times.


- `Bash` Create the PR 4 branch and add lessons to its spec: `git checkout -q -b claude/canon-4-contests claude/canon-3-passenger && git push -q -u origin claude/canon-4-contests 2>&1 | tail -1; git branch --show-curren...` (+10 lines)

**Claude · 2026-10-15 02:30:20 UTC**

PR 3 is closed out (both rounds done, description updated, CI started). Starting PR 4's engine stage on `claude/canon-4-contests`.


- `Agent` Build PR 4 engine and engine tests (general-purpose, in the background)

**Subagent `Build PR 4 engine and engine tests`** · Agent tool, in the background · started 2026-10-15 02:30:40 UTC · reported 2026-10-15 04:17:14 UTC

- Pull request 4 engine: report. Everything is committed on claude/canon-4-contests as 0f27012 (on top of 34's add3dcf). Nothing is pushed.

<details>
<summary>Prompt, verbatim (4,704 characters)</summary>

Agent `acc8ee4b7eb65a903` (general-purpose).

```text
You are building the ENGINE part of pull request 4 of rex-strength-lab/BRIEF-canon.md (item 4: contests, and the two Never knocked back switches) in /home/user/rex-strength-lab on branch claude/canon-4-contests (stay on it; don't push, merge or edit GitHub). It is stacked on pull request 3 (#34, Safe passenger) and pull request 2 (#33, their own recoil to their source), both built and reviewed; this branch starts from #34's last commit. CLAUDE.md is loaded: its "Rulings of 14 Oct 2026" are the canon for this pull request.

Read first: rex-strength-lab/BRIEF-canon.md item 4 (all of it), "Rules for every item", the Answers (Q1–Q4, Q12–Q15); RUN-canon.md; the README sections for pull requests 2 and 3 (their decisions stand; pull request 2's lists what it left for this one); the build spec /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/pr4/SPEC.md (decisions 1–16, the brief's figures at 3,000 kg, the tests, and the lessons at its end); the `pr4_collide` and `pr4_contests` entries of /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/pr345/map.json (sites on main, with prototypes in ../understand345/collide/ and ../understand345/pr4-push/, including engine-pr4.js and proto.js). Line numbers in the map are main's: re-find every site here.

Your scope: rex-strength-lab/src/engine.js and rex-strength-lab/test/powers.js (and test/powers-off-cases.js only to add cases, never changing existing fingerprints). Do NOT touch src/app.html, src/static-data.js, README.md or test/shots.js: a second agent does the page after you, so document every new engine figure and outcome in comments (names, units, directions, when present, what the page should say).

Build the engine part of SPEC.md: decisions 1–11 and 13 (Collide's charger of unbounded mass, how long he is carried, the paradox, the thought experiment unchanged, the hit's energy with a 'meanIt' option the page will pass, from above on real ground, the steady push, the shoving match's bothShoved / walk-out / shovedOff with a motion model, Both at once, arm wrestling — build the brief's reading A unless you find it physically incoherent; then build B and say why in a comment and your report — the Lift tab's reading, the fireball's push and energy with the catcher's Never knocked back, keyed on new ctx keys `noKnockback` for each body's context, the power winning over Bolted), and fix Collide's not-held bounce over-count with Unbreakable footing (pull request 2's Known limit). Every new branch must be guarded so that with every power off every engine result stays byte-identical (powers.js part 1). Never add `noKnockback` to `anyPower`.

Tests in test/powers.js: a new section for item 4 (SPEC.md 'Tests'), rewrite the '5d: the shoving match, arm wrestling and Collide are unchanged' check into it, extend section 6's ledger to Collide with the charger's source supplying (to 1e-9) and to the fireball with Never knocked back, the brief's figures at 3,000 kg (a check), and time each two-player function before and after (a scratch script comparing with #34's engine: report the times; the new branches must not slow the two-player effort search noticeably).

Verify one test at a time: cd /home/user/rex-strength-lab/rex-strength-lab && python3 build-data.py && node build.js && node test/powers.js && node test/calibration.js && node test/presence.js && node test/sweep.js && node test/ladder.js. All must pass. (test/shots.js may fail where the page reads changed engine figures; that is the page stage's job: run it and list what fails in your report, but don't fix the page.) Mutation check in scratch copies under /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/pr4/mutants/: the charger slowing, the one hit not carried, the source supplying the wrong momentum, no paradox where held without limit, a paradox where not held, the shoving match deadlocking, the steady push capped by the pusher's footing, the fireball still pushing the catcher with Never knocked back on, the hit's energy real by default: each must fail a check.

Commit on the branch (with the rebuilt dist/index.html) with a message ending:
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_0136zsmhtj8TCY2T2u8SKMVX

Report back: what you built per decision (and whether you built A or B for arm wrestling, and why); the new engine figures and outcomes the page must read (names, units, meaning); the brief's figures as reproduced; the timings; the mutation results; the test counts; what test/shots.js now reports failing; anything you decided that the spec didn't settle.
```

</details>

<details>
<summary>Its report, verbatim (11,944 characters)</summary>

```text
## Pull request 4 engine: report

Everything is committed on `claude/canon-4-contests` as **0f27012** (on top of #34's add3dcf). Nothing is pushed. The commit touches only `rex-strength-lab/src/engine.js`, `rex-strength-lab/test/powers.js` and the rebuilt `dist/index.html`. I didn't need to change `test/powers-off-cases.js`.

**Tests:** the full Rex test line passes (build-data, build, powers.js 180/180 including part 1, calibration, presence 383, sweep with 0 problems, ladder 562/562).
- With every power off, all 15,533 powers-off cases are byte-identical, plus the 8 Safe passenger shim cases.
- I compared 4,928 two-player results against #34's engine with only They take their own recoil off. All are identical except 192 knocked-back bounces, which only lose `toGround`: that is the intended fix (decision list, last bullet in Collide).
- `noKnockback` is not in `anyPower`, and a check confirms it.

**test/shots.js fails, as expected for the page stage.** It aborts at its first exception, in the "no recoil into the planet" check (Collide tab, Rex and Ollie both bolted, line 519). `collideCharge` reads `h.Q` on the new paradox, which has no `h`, and throws, so `#duo-effort` never renders. A browser probe (`scratchpad/pr4/scratch/probe.js`) found:
- **The page throws** on Collide jump, stomp at 10⁹ kg, and sprint with Rex bolted (all the new paradox).
- **Old wording on new numbers:**
  - Collide sprint says "Rex is knocked back at 7.31 m/s and the two slide…" for what is now the carried outcome.
  - Wrestle push says "undefined walks Rex out…" for `bothShoved`, which has no winner.
- Known checks that break by design are in the SPEC (Rex bolted, jump, 10⁶ kg plaster preset; the real-ground ceiling). Nothing after line 519 has run.

### Arm wrestling: I built reading B, not A
Reading A is physically incoherent. Canon says the other's press is real on him (Q12, Q15). His forearm is pivoted on his elbow pad, so it can only hold against that press by pushing back on the pad, or by moving. Under A neither pad carries anything, so in a stalemate a real force acts on each hand and nothing moves. Momentum would vanish outside canon's list, since Never knocked back is set aside in contests.

Under B, each pad (or, standing, each one's feet) holds the other's press:
- **On the table:** the 'push' break is unchanged.
- **A pin with the winner's power on:** `padLoad` is the loser's press. Spinning the forearms is the winner's swing, so it goes to his source (pull request 2). A pin therefore never breaks the table: 0 of 2,160 runs. The pin itself and its slam are unchanged.
- **Standing (Things keep their form off, table broken by the presses):**
  - His own footing no longer caps his own press (`AA = PA`), so the stronger always pins.
  - New flag `winnerSlides`: the loser's press beats the winner's footing.
  - New flags `draggedA` / `draggedB` on a standing stalemate. The lab doesn't follow that motion (a known limit).
  - `tearA` / `tearB` use the other's press.
  - Both presses unlimited: new outcomes 'paradox', 'rockGives' or `'flungApart'`.

The comment above `armWrestle` records all of this.

### What I built, by decision
1. **Unbounded charger** (`collide` → `carriedHit`, keyed on the charger's `ownRecoil && !cB.immovable`): 'carried' with `carry`, a swapped-frame `h`, and `contact`. The charger's source supplies the gain plus the footing's share. An infinite pA (light speed) keeps today's 'unstoppable'.
2. **How long he is carried:** the charger stops himself at the end of the squash. `carry.stop {J, E}` is his own push, so its push back and his motion go to his source. Rex then slides from v (or sinks, from above).
3. **The paradox:** `holdsGround(cB) && (bolted || from above)` → `outcome 'paradox', unbounded: true, heldBy`. It has no h, contact, toGround, after, earth or rock; speed, v0, vRel and pA are kept. Bolted on real rock is carried, with `carry.rockGives`.
4. **Truly immovable is unchanged** (test 8d). The steady push also sets the pusher's own recoil aside for it.
5. **The hit's energy:** `hitAbsorbed {E}` and `o.meanIt`. The one hit's own air past 1% of c and the run-up air stay real (in `Elocal`).
6. **From above on real ground:** today's sink model, applied to Rex alone at the charger's speed.
7. **Steady push** (`standoff`): with the pusher's own recoil, `DA` is his full strength and `pusherSlips` is false. An unlimited push against a hold without limit is the one-sided 'paradox'. On real rock it is a one-sided 'rockGives' with `tearB` only. No rock dipole.
8. **Shoving match** (`pushMatch`, new branch `pushMatchOwn`, used when both have the power on): 'bothShoved' with the motion model, 'walkOut' at the Pull tab's pace, 'shovedOff', 'deadlock', and the one-sided 'paradox'. The 'bothBolted' block is unchanged apart from DA/DB being the pushes.
9. **Both at once** (`shoveBoth`, when both have the power on): each one is shoved by the other's shove, an upper bound. The stronger shove's frame is kept, plus `both: true`, `back` (the other's shove), `tearA`/`tearB` and `toGroundA`.
10. **Arm wrestling:** reading B, above.
11. **Lift and throw a partner:** no engine change; a comment says the lift models a partner who doesn't resist.
13. **The fireball** (`fireballAt`, keyed on the catcher's `ctxC.noKnockback`):
    - He isn't moved, bolted or not: `push {recoilV 0, earthRecoilV 0}`, and `Eafter`, `Ecarry`, `Enear` are 0.
    - Its momentum goes to the endless ocean: `knockAbsorbed {J: p, E: E−Egap}`, with E = 0 when `ctxC.meanIt`.
    - `Ehere = E`. `Eblast = Egap` (plus the motion part when meant). A 'before' fireball's overpressure uses the same real energy.

**Plus pull request 2's Known limit, fixed:** a knocked-back bounce no longer books a footing share in `toGround`. The bounce bound ignores the footing, as its speeds already did. The ledger now closes there.

### New engine figures the page must read (all documented in engine comments)
- **`collide`, outcome 'carried'** (`unbounded: true`, `held: false`; splat reads "carried along at v", bounce "sent off at vB"):
  - `carry`: v, vB (m/s); pGain, footJ, supplied (kg·m/s); F (N); T (s); rockGives; tear (N); stop {J kg·m/s, E J}.
  - `h`: KA, Q (J); inel {V: v, pT}; el {vA: v (he keeps his speed), vT, pA, pT}.
  - `hitAbsorbed {E J}`; `meanIt`; `Elocal` (J, the real energy near the hit, for the blast); `elasticUpper`.
  - `after` sideways: splat {V, during, slide, moved}, bounce {vA, vB, slideA 0, slideB}. From above: splat/bounce {depth, Eground} (or a crater).
  - `toGround {J: footJ, T, how: 'carried'}`, only with Unbreakable footing or o.toGround.
- **`collide`, outcome 'paradox'** with `unbounded: true` and `heldBy` ('bolted' | 'unbreakable' | 'comicGround'). The old light-speed-into-immovable paradox has `h.undefinedResult` instead. The page must explain the paradox first.
- **`standoff`:** `ownRecoil: true`; outcome 'paradox' or 'rockGives' with `oneSided: true` (rockGives also has `tearB`). In forceWins, `contact` stays the hold, as before.
- **`pushMatch`** (`ownRecoil: true`):
  - DA/DB are the pushes (N); HA/HB are the holds.
  - 'bothShoved' / 'shovedOff': d (m), t (s), vA, vB (m/s), pA, pB (kg·m/s), EA, EB (J), slideA, slideB (m), relativistic, footA, footB (kg·m/s), recoilAbsorbedA/B {J, T, thetaDeg 0}, tornA/tornB, realUpper. 'shovedOff' also has winner.
  - 'walkOut': accel (m/s²), aLoser, aFeet, contact (N), t, v, vCap.
  - 'deadlock': contact is the larger push.
  - 'paradox' (oneSided).
- **`shoveBoth`:** `both: true`, `back`, `toGroundA`, `tearA`, `tearB`; clash 'rockGives' or 'paradox'.
- **`armWrestle`:** `padLoad` (N), `winnerSlides`, `draggedA`/`draggedB`, 'flungApart', and `ownRecoil` on the unlimited standing outcomes.
- **fireball:** `knockAbsorbed {J, E}`.

### The brief's figures, reproduced at 3,000 kg (test 8l)
- **Sprint, splat:** Rex carried at 18.1 m/s. The source supplies 55,000 kg·m/s (54,400 gain + 612 footing). 494 kJ freed and absorbed. Rex slides 27.3 m.
- **Sprint, bounce:** Rex sent off at 36.3 m/s; the source supplies **109,000** kg·m/s. The SPEC said "about 110,000" because it added a 961 footing share. I didn't, because the bounce bound ignores the footing; the brief's own table says 109,000.
- **Jump (286 m/s) and stomp-launch (166 m/s) at 10⁹ kg:** both the paradox.
- **0.1% of c:** splat carried at 300 km/s, 8.99 × 10⁸ kg·m/s, 135 TJ. Bounce 600 km/s, 1.80 × 10⁹ kg·m/s.
- **Power off:** today's physics (8.97 m/s, 250 kJ).
- **Shoving match at the default dial:** 889,644 N against a 17,652 N grip (50×). Both shoved apart at 26.6 m/s; slides of 57.2 and 57.1 m.
- **Other figures:** at the least effort (2,570 kg-force) they still separate at 2.48 m/s on every ground. Walk-out a = 1.05 m/s² (gravel) and 5.88 m/s² (Ollie lying flat). Steady push 889,644 N against 17,652 N; rock cracks to 13 cm.

### Timings (ms per 60-effort sweep, best of 5, defaults on; PR 3 → PR 4)

| Function | PR 3 | PR 4 |
|---|---|---|
| pushMatch | 0.55 | 1.95 (bisection, about 30 µs a call) |
| shoveBoth | 55 | 111 (two shoves: about 1 ms more per probe) |
| armWrestle | 0.52 | 0.55 |
| collide jump | 800 | 780 |
| collide sprint | 0.7 | 0.5 |

Everything else is within noise, with the powers on and off. The new branches don't noticeably slow the two-player search.

### Mutation checks: 18 of 18 fail `test/powers.js`
- The nine you asked for all fail named checks:

| Mutant | Fails |
|---|---|
| 1. charger slows | 6, 8a |
| 2. one hit not carried | 8a, 8l |
| 3. wrong source momentum | 6, 8a, 8l |
| 4. no paradox where held | 6, 8b, 8l |
| 5. paradox where not held | 6, 8a |
| 6. shoving match deadlocks | four 8g checks, 8l |
| 7. steady push capped | 8f |
| 8. fireball still pushes with Never knocked back | 6, 8k |
| 9. hit energy real by default | 8c |

- I also ran nine extra mutants: the bounce over-count put back, reading A, the old pad load, Both at once old, standing press capped, fireball energy all real, the old walk-out pace, the rock dipole kept, and the immovable test without the exemption. Each fails a check.
- Mutant 6 first crashed the test instead of failing a check; I hardened section 8 so it now fails cleanly.

### Test changes
- The old 5d "unchanged" check is replaced by section 8 (8a–8l, 20 checks).
- Section 6's ledger now covers Collide (sprint, 0.1% of c and jump; carried with the source supplying to 1e-9, held, knocked back, and the paradox) and the fireball with Never knocked back on and off (new bucket 'ocean:hit').
- I moved 6b's Both-at-once line into 8h, because decision 9 changes it by design.

### Decisions the spec didn't settle
- **Bounce footing:** the bounce bound ignores the footing in both paths, so footJ is 0 and the source figure is 109,000, not about 110,000.
- **Footing cap:** footing is capped at the contact force, min(H, F) × t. On real rock it is min(tear, F) × t, about 24,000 kg·m/s at the default sprint.
- **Speed used for the one hit:** its momentum comes from vRel (which includes the run-up's tiny gravity pull) below 1% of c, and from the proper speed above it.
- **`meanIt` source:** for Collide it is read from `o.meanIt`; for the fireball from the catcher's context (`ctxC.meanIt`), since the page's variants arrive through ctx overrides.
- **Mixed switches:** with only one of them on (a test-only case), the shoving match and Both at once keep the old rule. Collide and the steady push key on the mover, and arm wrestling per person.
- **Shoving match stroke:** the shorter of the two `strokes.throw` (2.44 m).
- **Bolted winner who can't walk:** 'shovedOff'.
- **Unlimited push into a partner bolted on real rock:** 'torn', flung at just under light speed.

Scratch scripts are in `/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/pr4/`: `scratch/timing.js`, `scratch/offcompare.js`, `scratch/probe.js`, and `mutants/mutate.py` (results in `mutants/run2.log`).
```

</details>

**Claude · 2026-10-15 02:30:41 UTC**

PR 4's engine stage is running. PR 3's CI run is also in flight; I'll check it when the builder reports.


> **Commit** `0f27012` · 2026-10-15 04:16:25 UTC · Pull request 4 of BRIEF-canon.md, engine: contests and Never knocked back  [rex-strength-lab]

**Claude · 2026-10-15 04:17:19 UTC**

PR 4's engine is committed (`0f27012`): powers 180/180, every powers-off result identical, and all 18 mutants killed. It built arm wrestling as reading B, not A: under A a real press acts on each hand and nothing holds it, so momentum would vanish outside canon's list. That reasoning holds, so B stands, and the physics review will check it. Pushing, checking PR 3's CI, then launching the page stage.


- `Bash` Push the PR 4 engine commit: `git status --short | head -3; git log --oneline -2 && git push -q origin claude/canon-4-contests 2>&1 | tail -1`
- `mcp__github__actions_list` list_workflow_runs test.yml


*Woken · 2026-10-15 04:17:14 UTC · Background task acc8ee4b7eb65a903 completed: Agent "Build PR 4 engine and engine tests" finished. Next: CI passed on PR 3 too (run 61). Writing the engine report into PR 4's page spec and launching the page stage.*

**Claude · 2026-10-15 04:17:29 UTC**

CI passed on PR 3 too (run 61). Writing the engine report into PR 4's page spec and launching the page stage.


- `Bash` Append the PR 4 engine report to its spec: `cat >> /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/pr4/SPEC.md <<'EOF'` (+13 lines)
- `Agent` Build PR 4 page, copy and page tests (general-purpose, in the background)

**Subagent `Build PR 4 page, copy and page tests`** · Agent tool, in the background · started 2026-10-15 04:18:09 UTC · reported 2026-10-15 06:31:05 UTC

- Pull request 4, page stage: done and committed. The page stage is committed at 238f570 on claude/canon-4-contests, on top of the engine commit 0f27012. I did not push, merge or touch GitHub, and the working tree is clean.

<details>
<summary>Prompt, verbatim (6,959 characters)</summary>

Agent `aa8c51351fbe3b086` (general-purpose).

```text
You are building the PAGE part of pull request 4 of rex-strength-lab/BRIEF-canon.md (item 4: contests, and the two Never knocked back switches) in /home/user/rex-strength-lab on branch claude/canon-4-contests (stay on it; don't push, merge or edit GitHub). The engine is done and committed (0f27012; read git show 0f27012 and the engine's comments). It is stacked on #34 (Safe passenger) and #33 (their own recoil). CLAUDE.md is loaded: follow its standard (factual accuracy, honest labelling, plain short sentences, plain numbers) and its "Rulings of 14 Oct 2026".

Read first: BRIEF-canon.md item 4 and the Answers; the README sections for pull requests 2 and 3; /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/pr4/SPEC.md (all decisions; the lessons; and 'The engine as built' at its end, which lists every figure and outcome you must read); the `pr4_collide` and `pr4_contests` entries of /tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/pr345/map.json (page sites on main with proposed text; re-find them here).

Scope: src/app.html, src/static-data.js (then python3 build-data.py), the Rex lab README.md, test/shots.js, and STATUS.md (one line). Not the engine (report any engine bug; fix only if small, then rerun test/powers.js in full).

Do SPEC.md's page work:
- Collide: the page must not throw on the paradox; explain the paradox FIRST (X takes his own recoil so nothing can slow him; Y is held without limit by their powers — bolts on ground that can't break, or the ground Unbreakable footing holds up from above; one of them has to give and neither can, so physics has no answer: the canon's ruling; the page isn't broken); verdicts for carried along, sent off, carried with a plug of rock; chips, tiles (no 'Bolted: Earth takes the blow' for the paradox), the energy tile (the hit's energy taken back by default, shown later as his shimmer; real with a blast preset), the items ('Momentum is never lost…' → his source supplies it, canon's 'their own recoil'; "'Immovable' only means…"), the four-cases grid relabelled, the math (the swapped-frame sums), the thought experiment's one sentence; the steady push (no 'from bolted feet'; the one-sided paradox and rock; the Newton item; the tile 'Force between them … the same both ways' made true).
- Wrestle: the shoving match's new outcomes (bothShoved: both slide, with figures; walkOut; shovedOff; deadlock; one-sided paradox) and the item 'A shoving match is decided at the feet…' rewritten; that with the power on two equal bodies are always shoved apart at any effort; Both at once; the Lift tab's text that is false under the contest rule; arm wrestling as built (reading B: each pad holds the other's press; the pin never breaks the table with the winner's power; standing: his own footing doesn't cap his press, winnerSlides, dragged; the new unlimited outcomes).
- The two-player effort search: duoFacts' harms (both sliding in the shoving match; the one hit carried at the charger's speed in Collide; the Collide hit's blast only with a blast preset: a 'mean' duo variant passing meanIt; the fireball's energy with Never knocked back: real only when meant); out.ground for carry.rockGives; duoNoModel's shoving-match reason with the power on.
- Never knocked back: state keys noKnockback and oNoKnockback (default true; old saves load with both on; validators; never in anyPowerOn); two switches next to the Bolted pair, 'Never knocked back: Rex' and 'Never knocked back: Ollie' (each with an accessible name), each with its note (in their contests — every test here — they let force move, and catches are taken back through They take their own recoil; the one case here is a throw that reaches the catcher as a fireball or plasma in the game of catch, with Things keep their form off and some air left, an incoming hit outside a contest); the summary line; the 'Their powers' card one sentence; pass each body's switch into its context; the Catch tab's fireball/plasma text with the switch on (not moved; momentum to the endless ocean; the energy split) and off (today's); fix bayCatch's 'same' legs comparison so Rex's switch can show (the return leg's push when they differ). The plasma-hit item pull request 2 added ('Never knocked back's case, not in the lab yet') must now describe the switch.
- Cards: 'Unstoppable force vs immovable object', 'Two-player effort', 'Their powers', 'Game of catch'. README: a section for this pull request (what changed, the decisions 1–16 in plain words including arm-wrestling B and why, what moved against #34 with figures, the tests; Known limits incl. how long the one hit is carried, the dragged-but-not-followed standing stalemate, from above on real ground, mixed switches); remove pull request 2's Known limit on Collide's bounce over-count (fixed).
- test/shots.js: fix what breaks (by design: Rex bolted jump 10⁶ kg plaster preset; the real-ground ceiling: move those to the power off), add checks for: the Collide verdicts with the power on and off (the paradox explained first, carried, sent off, rock); the shoving match and Both at once; arm wrestling's new texts; the switches (decision 15: on by default, each with its note; turning either off changes no result on any tab except the fireball case — set up with Things keep their form off, air below 100%, a 10¹⁴ kg dial, a fastball, all-out — which shows the change; an old save loads with both on); every new check must fail on #34's page. Time the two-player effort search on each test against #34's page.

Verify one test at a time: cd /home/user/rex-strength-lab/rex-strength-lab && python3 build-data.py && node build.js && node test/calibration.js && node test/presence.js && node test/shots.js && node test/powers.js && node test/ladder.js && node test/sweep.js. All must pass. Before reporting, render every changed view (Collide charge sprint/jump/stomp/set speed, bolted and standing, power on and off, at least effort, all-out, 10⁹ kg, unlimited; Collide push; Wrestle push, shove, both at once, lift, throw; Arm wrestle on the table and standing; Catch with the fireball case; Their powers) at 390 and 1280 px, light and dark, and read every sentence against the engine and against the other sentences on the view; fix contradictions. Look at the screenshots.

Commit with the rebuilt dist/index.html and src/data.js, and a STATUS.md line under In progress that pull request 4 is built on claude/canon-4-contests with its review rounds next (CI passed on #34: run 61). End the commit message with:
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_0136zsmhtj8TCY2T2u8SKMVX

Report back: page changes by area (quote key new sentences), the README, the shots.js changes (and how you confirmed each new check fails on #34's page), test counts, the timings, any engine issue found, and anything you decided that the spec didn't settle.
```

</details>

<details>
<summary>Its report, verbatim (11,734 characters)</summary>

```text
## Pull request 4, page stage: done and committed

The page stage is committed at **238f570** on `claude/canon-4-contests`, on top of the engine commit 0f27012. I did not push, merge or touch GitHub, and the working tree is clean.

The commit holds `src/app.html`, `src/static-data.js`, the rebuilt `src/data.js` and `dist/index.html`, `README.md`, `test/shots.js` and `STATUS.md`. The STATUS line goes under In progress: "…is built on `claude/canon-4-contests` (engine, page, cards, README, tests), stacked on `claude/canon-3-passenger`; its review rounds are next. CI passed on #34 (run 61)." The commit message ends with the two attribution lines.

**Verification:** the full line passed: `python3 build-data.py && node build.js && calibration && presence && shots && powers && ladder && sweep`, exit 0, 34m46s.
- calibration: all checks passed.
- presence: 383 checks, all passed.
- shots.js: 85 ok lines, plus 390/1280 light and dark with no overflow, page errors or broken text. The new pull request 4 block is one ok line holding 26 checks.
- powers.js: 180/180.
- ladder.js: 562/562.
- sweep.js: 7,776 contexts, 0 problems.

**Against #34, powers off:** 22 tests, each at least effort and all-out (44 states).
- 43 are identical.
- The one difference is an added note, not a changed result. In the all-out fireball case the page now says: "Ollie doesn't catch it: it hits him, an incoming hit from outside any contest. That is Never knocked back's case, and Ollie's switch is off (Their powers), so it carries him off, as above."

## Page changes by area

**Collide, the charge**
- Carried along (the default sprint, all-out): "Ollie hits Rex at 18.1 m/s and doesn't slow: he takes his own recoil, so the push back from the hit goes to his source. Rex is carried along at 18.1 m/s. When Ollie stops, at the end of the squash, Rex slides 27.3 m before he stops."
- Bounce: "Rex bounces off him and is sent off at 36.3 m/s, twice his speed, and slides 102 m."
- Bolted on real rock: "the rock around his bolts tears out (at about 697 kN), and he is carried along at 18.1 m/s with a plug of rock."
- The paradox is explained first, and the page doesn't throw: "No physical answer here, and the page isn't broken: this is the canon's ruling. Ollie takes his own recoil, so nothing can slow him… One of them has to give, and neither can, so physics has no answer."
  - Then it quotes the canon and says why neither can give.
  - It adds what happens with Unbreakable footing off ("Rex is driven 55 cm into the concrete slab") and with own recoil off ("Rex doesn't budge, and Ollie stops dead").
- Momentum item, with the parts to three figures and the total to two so they visibly add up: "everything Rex gains (54,400 kg·m/s), and what his footing hands the ground during the hit (612 kg·m/s), comes from Ollie's source: about 55,000 kg·m/s in all. That is canon's case 'their own recoil'…"
- "'Immovable' only means what holds Rex in place. Against a charger who can't slow, any hold with a limit gives…"
- Carry-duration item: "How far Ollie carries him is up to Ollie… The lab ends the carry at the end of the squash."
- Energy tile: "· taken back by default (canon: it shows as his shimmer, not drawn here yet)". It reads "real: he means it" under a blast preset.
- The four-cases grid is relabelled for a charger who can or can't slow. Thought experiment: "(The thought experiment sets Ollie's own recoil aside too: it is about the test, not their powers.)"

**Collide, the steady push**
- The pusher's own footing no longer caps his push. The one-sided paradox and the torn rock are both shown.
- The "Force between them" tile now shows the push between their hands, "the same both ways…; Y's feet pass HB of it to the ground…". This fixes the old contradiction of 17.7 kN against an 890 kN push.

**Wrestle**
- New shoving-match outcomes: both shoved apart, walk-out, shoved off, deadlock, paradox. Example: "They shove each other apart: each is shoved by the other's shove, and each one's push back goes to the endless ocean."
- The equal-bodies item shows only when both are shoved, with equal bodies and neither bolted.
- Both at once uses the same rule.
- Lift: "The lift models a partner who lets himself be lifted…"
- Arm wrestling is built as reading B. Newton item: "each pad holds the other's press". Pad item: "So with the power on a pin never breaks the table". The standing clash can be flung apart, rock gives, or a paradox, and the winner can slide.

**Two-player effort search**
- New harms: carried slide ("Rex is carried along at v and ends up X away, past the nearest people…"), both shoved apart, shoved off, and the steady push's ground load.
- A "mean" variant runs for blast presets. The "They mean it" paragraph appears only where a meant hit is drawn.
- `duoNoModel` gives the shoving reason with the power on.

**Never knocked back**
- State keys `noKnockback` and `oNoKnockback`, both true by default. Old saves load with both on. Each has a validator, and neither is in `anyPowerOn`.
- Two switches sit next to Bolted, named "Never knocked back: Rex" and "…: Ollie", with one shared note: "…So this switch acts in one case only: a throw that reaches the catcher as a fireball or plasma in the game of catch…"
- The summary line, the Their powers sentence and each body's context pick them up.
- Catch, fireball with the switch on: "Never knocked back: it doesn't move Ollie. Its momentum (1 million kg·m/s) goes to the endless ocean…" The air's heat (422 GJ) is real; the 3.21 TJ of motion is taken back unless meant. There is a new status chip, "Never knocked back: Ollie isn't moved".
- The `bayCatch` `same` test now includes the switches, so Rex's switch shows on the return leg. Pull request 2's plasma item is rewritten for on and off.

**Cards:** Unstoppable force vs immovable object, Two-player effort, Their powers, Newton's third law, Rex and Ollie, Game of catch.

## README

There is a new section, "Contests and the two Never knocked back switches (BRIEF-canon.md pull request 4)":
- what changed;
- decisions 1–16, including arm reading B and why reading A is physically incoherent;
- what moved against #34, with figures (below);
- the tests;
- what the owner still has to confirm.

Known limits:
- A new list for contests with own recoil on: carry duration, bolts on an unbreakable planet (about 3×10²⁷ N against 1.10×10²⁵ N), squash below the hold, from above on real ground, the standing stalemate not followed, the steady push's motion not followed, a single bolted wrestler's rock unchecked, Lift's partner doesn't resist, and mixed switches.
- Pull request 2's bounce over-count limit is removed.

**What moved against #34:**

| Case | #34 | Now |
|---|---|---|
| Collide sprint, all-out | knocked back 8.97 m/s, slides 6.97 m | carried 18.1 m/s, slides 27.3 m; Ollie's source supplies 55,000 kg·m/s; 494 kJ taken back |
| Bounce | 18.1 m/s | 36.3 m/s, slides 102 m, 110,000 kg·m/s |
| Collide sprint, least effort | 8,430 kg-force | 4,260 kg-force |
| Jump at 10⁹ kg dial, least effort | 173 t | 1,210 t |
| Steady push | dead heat | Ollie drives Rex back with 890 kN |
| Shoving match | dead heat | both shoved apart at 26.6 m/s, about 57 m; least effort 9,060 kg-force |
| Bolted Rex, shoving match | holds | shoves Ollie off at 37.6 m/s |
| Both at once | Ollie alone flies off | both at 21.1 m/s, about 37 m |
| Arm, Things keep their form off | table breaks under the pin | pin on the table at 83 m/s |
| Fireball, 10¹⁴ kg dial | carried off at 343 m/s | not moved; 1.03 million kg·m/s to the ocean; blast 3.63 TJ → 422 GJ |

## test/shots.js

**Checks this pull request breaks by design**, now run with the power set off:
- `colRead` bolted and the `dgR` check (`ownRecoil: false`);
- pull request 2's copy check 5 (`oNoKnockback: false`, new item regex).

**Other changes:**
- `POWERS_OFF` adds both switches.
- `IN_POWERS` adds `nkb-rex`, `nkb-ollie` and `nkb-note`, and there is an aria-label check.
- Pull request 3's summary expectations gain " · never knocked back".

**New pull request 4 block, 26 checks:**
- Collide: carried, bounce, off, the paradox (bolted, the 10⁹ kg jump and stomp), real rock, 0.1% c, least effort, the 10⁹ kg jump, the thought experiment, the steady push on and off, the unlimited push into a bolted Rex.
- The shoving match: both shoved apart and dead heat, bolted shove-off, walk-out.
- Both at once and the Lift.
- Arm wrestling, four checks.
- Never knocked back, three checks: defaults and old save, each switch off changes nothing at defaults, and the fireball setup (Things keep their form off, 50% air, 10¹⁴ kg, fastball, all-out).
- The cards.
- Each check is compared against the engine where it can be.

`node test/shots.js --pr4` runs only this block. I ran it with the final shots.js against #34's dist (`scratchpad/pr4/pr3tree/pr4-on-pr3-final.log`): it exits 1, and all 26 checks fail, each with #34's text as the evidence.

## Timings

Engine milliseconds in the top-level two-player calls at least effort, median of 5. For #34 there are two runs, separated by "/".

| Test | #34 | Now |
|---|---|---|
| arm | 0/0 | 0 |
| arm, Things keep their form off | 0/1 | 0 |
| push | 2/3 | 1 |
| shove | 12/7 | 7 |
| Both at once | 9/9 | 16 (now runs two shoves) |
| lift | 0/0 | 0 |
| throw | 22/26 | 26 |
| catch, baseball | 345/321 | 320 |
| catch, car at 1 km | 393/373 | 431 |
| partner toss | 1615/1686 | 1664 |
| fireball case | 236/238 | 216 |
| collide sprint | 1/1 | 1 |
| bounce | 1/1 | 1 |
| jump | 123/116 | 139 (two extra calls: search outcome and the paradox counterfactuals) |
| jump at 10⁹ kg | 176/156 | 174 |
| stomp | 57/48 | 50 |
| set speed | 0 | 0 |
| bolted | 1 | 1 |
| collide push | 0 | 0 |

There is no meaningful slowdown.

## Engine issues (reported, not fixed; both written up as Known limits)

1. **carriedHit:** when the plush squash force is below the hold that gives, `footJ = min(H, F)·T` equals `pGain`. This happens in a slow charge into a Rex bolted on real rock, or from above on real ground. The hold then books as much momentum as the one hit gains, and the hit figures are only the squash's. Example: from above on real ground, the source supplies 99,000 kg·m/s, of which the ground takes 49,700. The page notes there: "The lab's figures for the hit are the squash's, so here they are rough."
2. **pushMatchOwn** doesn't check the rock around a single bolted wrestler's bolts against the other's finite push. 890 kN is more than the 697 kN tear on real rock.

## Decisions the spec didn't settle

- One shared note for both switches.
- `duoKey` adds the switches only for Catch.
- The "mean" variant also covers Catch when a fireball is possible, plus a `meanAir0` variant.
- The "they mean it" note appears only where a meant hit is drawn.
- Carried-slide harm text: "ends up X away".
- "Force between them" shows the pusher's whole push when he wins.
- The grid labels mention a charger who can or can't slow.
- The paradox tab adds the counterfactual items (Unbreakable footing off; own recoil off).
- The shimmer reads "not drawn here yet".
- A Both-at-once verdict for when one side is held.
- Wording for the arm wrestle's one-sided standing paradox.
- A Never knocked back chip on Catch.
- The bolts-on-unbreakable-planet reasoning sits in Known limits.
- Momentum figures: the parts to three figures with "about" on a two-figure total. With no footing share (bounce) it is two figures throughout, matching the tile.
- The `--pr4` flag in shots.js.

Files are in `/home/user/rex-strength-lab/rex-strength-lab/`:
- `src/app.html`
- `src/static-data.js`
- `README.md`
- `test/shots.js`
- `dist/index.html`
- `src/data.js`

`STATUS.md` is at `/home/user/rex-strength-lab/STATUS.md`.
```

</details>

**Claude · 2026-10-15 04:18:10 UTC**

PR 4's page stage is running in the background.


> **Commit** `238f570` · 2026-10-15 06:30:24 UTC · Pull request 4 of BRIEF-canon.md, page: contests and Never knocked back  [rex-strength-lab]

**Claude · 2026-10-15 06:31:13 UTC**

PR 4's page stage is committed (`238f570`); the full line passes and all 26 new checks fail on #34's page. It reported two engine gaps, both written up as known limits for the reviewers:
- a slow carried hit can book its footing share equal to the gain;
- the shoving match doesn't check the rock around a single bolted wrestler.

Pushing, opening PR 4 and starting its review round 1.


- `Bash` Push PR 4: `git status --short | head -3; git log --oneline -3 && git push -q origin claude/canon-4-contests 2>&1 | tail -1`


*Woken · 2026-10-15 06:31:06 UTC · Background task aa8c51351fbe3b086 completed: Agent "Build PR 4 page, copy and page tests" finished. Next: PR 4 (35) is open and its review round 1 is running: physics, the two-player tests, and copy, each with a skeptic.*


- `mcp__github__create_pull_request` Rex lab: contests, and the two Never knocked back switches (BRIEF-canon.md pull request 4; stacked on #34, merge #33 and #34 first) (head claude/canon-4-contests, base claude/canon-3-passenger)
