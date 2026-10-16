# Pull request 5, engine stage: the energy taken back, and the shimmer's level

Branch `claude/canon-5-shimmer`, commit `3cb9f60` ("Pull request 5 of BRIEF-canon.md, engine: the energy taken back and the shimmer's level"), on `1a3b91b`. Not pushed. The engine and tests only; the page is the next stage.

What was built:
- `RESTRAINT.takenBack(move, r, o)` in `src/engine.js`: the energy taken back in one run, by part and by who takes it in.
- `EnergyLadder.glow(J, refs)` in `src/ladder.js`: the shimmer's level, word, glow strength and named steps, with the anchors found in the ladder by key.
- Tests: `test/powers.js` section 9 (29 checks; `node test/powers.js --skip-off --tally-only` runs it alone, about 25 s) and `test/ladder.js` section 9 (16 checks).
- Nothing else changed: no result, `reach()`, `plan()` or `planNow()` gains a key; no data changed; `dist/index.html` is rebuilt (it inlines the two source files, and the page doesn't call the new code yet).

## 1. The tally: `P.RESTRAINT.takenBack(move, r, o)`

Returns `{ E, unbounded, parts, by }`, in joules:
- `E`: the total. A finite number ≥ 0, or `Infinity` with `unbounded: true`.
- `parts`: `{ drag, footing, soft, silent, hit, stop, passenger, catch, growth }`, each summed over both of them. Every key is always present (0 when nothing).
- `by`: `{ rex: { E, unbounded, parts }, ollie: { E, unbounded, parts } }`, what each takes in himself. The glow on Rex's art should use `by.rex.E` (spec decision 3). A solo tab is all Rex's.
- No figure is ever NaN or negative. A figure with no physical answer (the paradox, an undefined result) adds nothing.

**Unlimited runs.** `E` is `Infinity` and `unbounded` is `true` (also `by.rex.unbounded` or `by.ollie.unbounded`). `glow(Infinity)` returns `unbounded: true`, level 1, strength 1, text "a blinding flare". The page should say "unbounded" and give no figure. `compare(Infinity)` says "more than any finite amount". Never print `Infinity` or "∞".

**What to pass for each tab** (`c` is the page's context for the run shown, from `ctx()`, with `use` set to the effort shown):

| Tab | Call | Parts it can give |
|---|---|---|
| Throw | `takenBack('throw', r, Object.assign({}, c, { obj: o, angle: state.angle }))`, where `r` is the run the tab shows (`bayThrow`'s `r`) | drag, passenger (a person) |
| Jump | `takenBack('jump', r, c)` | soft |
| Stomp | `takenBack('stomp', r, c)` | footing |
| Punch, Clap | `takenBack('punch', r, c)`, `takenBack('clap', r, c)` | silent |
| Weight | `takenBack('weight', null, { growE: ref.J })` when `state.growWhat !== 'none'` (`ref` as in `growthWhatIf`); `{}` otherwise | growth |
| Wrestle throw | `takenBack('wrestleThrow', t, { A: cA, B: cB, whoA, angle: state.wAngle })`, where `t = P.throwPartner(cA, cB, state.wAngle)` and `whoA` is `'rex'` or `'ollie'`, the thrower | drag (the thrower's), footing (the thrown one's) |
| Game of catch | `takenBack('catch', { a, b }, { A: cR, B: cO, whoA: 'rex', obj: o })`, with the page's `a` and `b` (pass `b = a` where the page reuses `a` for the return leg) | catch (the catcher's), hit (a fireball, the catcher's), passenger (a person's ground hit, the thrower's), drag (the thrower's) |
| Game of catch, "if he misses" | `takenBack('catch', { a }, { A: cR, B: cO, whoA: 'rex', obj: o, miss: true })`: every leg passed that reaches its catcher counts as missed (a person's landing beside him); the page's callout is about leg a, so pass `{ a }` alone | passenger, drag |
| Partner toss | `takenBack('toss', t, { A: cR, B: cO, whoA: 'rex' })`, with `t` from `P.tossPartner(cR, …)` | catch, drag (both Rex's) |
| Collide, charge | `takenBack('collide', r, { A: cA, B: cB, whoA: ollieX ? 'ollie' : 'rex' })`, with the page's `r` (made with `meanIt: duoMeanDraw`) | hit (the one hit's), stop (the charger's) |
| Walk, Lift, Sprint, Pull, Arm wrestle, the other Wrestle moves, Collide's steady push | `'walk'`, `'lift'`, `'sprint'`, `'pull'`, `'arm'`, `'wrestle'`, `'standoff'`: always 0 | none (momentum without motion only) |

An unknown move name, or a `whoA` other than `'rex'` or `'ollie'`, throws.

**The parts** (each needs its own power on, so with every power off `E` is 0):

| Part | Power | Read from | Whose |
|---|---|---|---|
| drag | Air resistance absorbed | the share absorbed × what real air would take from the same throw: one more flight at the full drag (the Throw tab's `dragLoss0` formula, at any speed); all of the object's energy if that flight escapes, orbits, never lands, or is past 1% of light speed. The Wrestle throw: the same, on the partner. The toss: straight up and back to his hands. A leg of the game of catch: its own flight to the catcher at the full drag. Worked out in the tally, never in `throwObject`. Counted once where the arrival is taken back too (decision 1, below). | the thrower |
| footing | Unbreakable footing | the stomp's `absorbed` (0 where the ground wouldn't break). The Wrestle throw: the thrown partner's landing (`r.Eimpact`) where real ground would take a crater (`r.crater > 0`), on his own footing. The jump's footing is 0. | whose footing |
| soft | Soft landing | the jump's `landing.absorbed` | Rex |
| silent | Silent strike | the punch's or clap's `E` when `mach >= 1` (the page's `absorbBlock` rule) | Rex |
| hit | They take their own recoil (Collide's charger); Never knocked back (the catcher) | Collide's `hitAbsorbed.E` (0 when meant, 0 in a bounce, only in the `'carried'` outcome); the game of catch's fireball, `knockAbsorbed.E` | the one hit |
| stop | They take their own recoil (the charger) | Collide's `carry.stop.E`: the charger stops himself at the end of the squash, and the engine sends his motion to his source | the charger |
| passenger | Safe passenger | the Throw tab's `MOVES.throw.passengerLanding(r, o).absorbed`; in the game of catch a person's ground hit (`hitsGround.E` with no air on the way; below 100%, with Things keep their form, `hitsGround.own.E`), and in the what-if their landing when missed (`miss.E`) | the thrower |
| catch | They take their own recoil (the catcher) | `catch.Ecatch` in every outcome where it reaches him (caught, slams, wreckage, can't hold it), and the partner toss's | the catcher |
| growth | none (a what-if) | `o.growE` | Rex |

## 2. The level: `EnergyLadder.glow(J, refs)`

`refs` is `D.energyRefs`. The anchors are found by key (`EnergyLadder.GLOW_KEYS`): floor `energy_usain_bolt_top_speed`, flicker `energy_corolla_100kmh_kinetic`, flare `energy_chicxulub_impact`. A ladder without one of them throws.

Returns `{ J, none, unbounded, level, strength, word, rough, text, held, steps, floor, flicker, flare }`:
- `none`: true when nothing is taken back (0, negative, NaN, missing). Then `level` and `word` are null and `strength` is 0: no tile, no glow.
- `unbounded`: true for `Infinity`. Level 1, strength 1, word "blinding flare", text "a blinding flare".
- `level`: log scale, 0 at the flicker, 1 at the flare. Held at 1 above the flare (`held: true`). Negative below the flicker (the floor is at −0.103).
- `strength`: the glow's strength, 0 at the floor or below, 1 at the flare, linear in the log of the energy between them. A car crash (the flicker) is 0.093 on this scale; the page may want a visible minimum for a flicker (a design choice for the page stage).
- `word`: "too faint to see" below the floor; "faint flicker" from the floor up to the flicker (canon: a faint flicker below a car crash); from the flicker up, the nearest named step on the log scale: "flicker", "faint glow", "glow", "bright", "blinding flare".
- `rough`: the step's word takes "roughly" (see decision 6). `text`: the phrase: "too faint to see", "a faint flicker", then "about a flicker", "about a faint glow", "about a glow", "roughly bright", "roughly a blinding flare".
- `steps`: `[{ word, level, J, text, rough }]` for the five named steps; `floor`, `flicker`, `flare`: `{ J, level, text, key, rough }`. Each `text` is `compare()`'s wording of that energy.

The steps (from the data; the spec's wordings reproduce exactly):

| Step | Level | Energy | `compare()` | Rough |
|---|---|---|---|---|
| floor (faint flicker fades out) | −0.103 | 7.33 kJ | "about the same as Usain Bolt at top speed" | no |
| flicker | 0 | 517 kJ | "about the same as a Toyota Corolla at 100 km/h" | no |
| faint glow | ¼ | 16.2 GJ | "about the same as a fully loaded A380 at cruising speed" | no |
| glow | ½ | 508 TJ | "24% of the Chelyabinsk meteor of 2013" | no |
| bright | ¾ | 1.59 × 10¹⁹ J | "roughly 30% of the heat an average hurricane releases in a day" | yes |
| blinding flare | 1 | 5 × 10²³ J | "roughly the same as the asteroid that killed the dinosaurs" | yes |

## 3. Figures on the spec's runs

From the engine (made by `scratchpad/pr5/proto/report-figures.js`; the spec's figures are its table "The brief's figures (at 3,000 kg)"). The 3,000 kg bodies, concrete, people 5 m away, the page's default powers (Silent strike and Soft landing off unless named), the page's dial of 100 short tons unless stated.

| Run | Spec | Engine | Level, word |
|---|---|---|---|
| Car thrown 30 m, least disruptive (22,100 kg-force) | 35.0 kJ, a faint flicker | drag 35.0 kJ (fly()'s drag-free tally would say 42.4 kJ) | −0.065, a faint flicker |
| The same, all-out | 0.27 MJ, a faint flicker | drag 270 kJ | −0.016, a faint flicker |
| Stomp all-out | 0.10 MJ, a faint flicker | footing 103 kJ | −0.039, a faint flicker |
| Stomp all-out at 10⁹ kg | 1.1 GJ, 0.19: "nearest step a flicker" | footing 1.14 GJ | 0.186, **about a faint glow** (see below) |
| Ollie charges Rex at 0.1% of light speed | 135 TJ, 0.47, about a glow | Rex's hit 135 TJ (level 0.468, about a glow); **plus Ollie's own stop, 135 TJ** (decision 3); total 270 TJ (0.485) | Rex's: 0.468, about a glow |
| Person thrown 30 m, least disruptive (3,340 kg-force), Safe passenger | 14.6 kJ, a faint flicker | passenger 14.6 kJ (the 2.63 kJ real air would have taken is inside the landing, counted once; Safe passenger off, it is the drag part) | −0.086, a faint flicker |

The differences:
- **Stomp at 10⁹ kg.** The spec's "nearest step a flicker" contradicts its own rule ("the nearest named step on the log scale"). Level 0.186 is 0.064 from the quarter step and 0.186 from the flicker, so the nearest step is the faint glow. The brief had said "between a flicker and a faint glow". I followed the rule. If the owner wants "flicker" here, the rule would have to be "the step at or below" (and then 135 TJ at 0.468 would be "faint glow", not the spec's "about a glow").
- **Collide.** The spec's 135 TJ is Rex's part. The tally also gives Ollie's own stop (decision 3).

Other runs (all from the engine; the full table is `scratchpad/pr5/proto/report-figures.md`):

| Run | Taken back | Level, word |
|---|---|---|
| Car all-out at 10⁹ kg | drag 7.32 GJ | 0.231, about a faint glow |
| Car all-out at 10¹² kg (past 1% of light speed) | drag 7.32 TJ | 0.398, about a glow |
| Car, unlimited | unbounded | the flare, no figure |
| Stomp, least disruptive (127 kg-force) | nothing (the ground wouldn't break) | no tile |
| Jump all-out, Soft landing | soft 50.2 kJ (10⁹ kg: 15.0 MJ) | −0.056, a faint flicker (10⁹: 0.081, about a flicker) |
| Punch, clap all-out, Silent strike, at the dial (Mach 0.12 and 0.11) | nothing | no tile |
| Punch, clap at 10⁹ kg | silent 637 MJ, 1.05 GJ | 0.172 and 0.184, about a faint glow |
| Collide sprint (Ollie into Rex, all-out) | Rex's hit 499 kJ; Ollie's stop 494 kJ | Rex's: −0.001, a faint flicker |
| Collide 0.1% of light speed, meant (a blast preset), or a bounce | Rex nothing; Ollie's stop 135 TJ | Ollie's: 0.468 |
| Game of catch, fastball, 10 m (a round trip) | catch 3.30 kJ each | too faint to see |
| Game of catch, car, gentle lob, 10 m | catch 49.3 kJ each | a faint flicker |
| Game of catch, car, fastball, 10 m, 10⁹ kg | catch 7.32 GJ each | 0.231, about a faint glow |
| Game of catch, a person, gentle lob, 10 m | catch 3.73 kJ each; missed (what-if) 5.58 kJ, Safe passenger | each one's too faint to see; the round trip's total (7.46 kJ) a faint flicker |
| Fastball at 10¹⁴ kg, Things keep their form off, half the drag (pull request 4's fireball) | Ollie's hit 3.21 TJ | 0.378, about a glow |
| A person 31.6 km apart at 10¹⁶ kg (hits the ground) | passenger 32.7 PJ (the leg's `hitsGround.E`) | 0.601, about a glow |
| Partner toss, gentle, 10 m up; all-out | catch 322 kJ; 676 kJ | −0.011, a faint flicker; 0.006, about a flicker |
| Wrestle throw at 45°, the dial | drag 44.9 kJ (Rex's) | −0.059, a faint flicker |
| Wrestle throw at 45°, 10⁹ kg (a 27.7 m crater on real ground) | footing 7.70 GJ (Ollie's) | 0.232, about a faint glow |
| Weight what-ifs: Krakatoa, the dinosaur-killer, the Sun for a second | growth 5.23 × 10¹⁷ J, 5 × 10²³ J, 3.83 × 10²⁶ J | 0.667, roughly bright; roughly a blinding flare; the flare (held) |

## 4. Decisions the spec didn't settle

Numbered for the owner; 2, 3, 4 and 7 add to or read canon.

1. **The drag is counted once.** With drag absorbed, the energy real air would have taken stays in the object and arrives with it. Where that arrival is taken back too (a catch, a person's landing under Safe passenger, a person's ground hit, a fireball's hit, the partner's crater-sized landing on his footing), adding the drag part on top would count the same joules twice (a person thrown hard would show about twice their energy). So the drag part is only what exceeds the arrival's part: `max(0, share × real air's take − the arrival's part)`. In practice it is 0 wherever the arrival is taken back. This is what makes the brief's person figure come out at 14.6 kJ. The other way to keep both powers' credit is to split the arrival (drag, then the arrival less the drag), which gives the same total; in the game of catch that would move part of the catcher's catch onto the thrower, so I chose "the arrival's whole energy, to whoever takes the arrival back".
   - Related physics for review: where the arrival is real (a car that lands), the drag part counts energy the air didn't get, not energy that left the world: by energy conservation the car lands with it. That was the brief's open decision ("which drag figure"); the spec settled it as real air's take, and the tally follows the spec.
2. **The Wrestle throw's landing (a footing part, not in the spec's list).** CLAUDE.md: "the energy that would break the ground under them goes to the endless ocean". Where the thrown partner lands hard enough that real ground would take a crater (`r.crater > 0`), his own Unbreakable footing holds it, and the page already says so ("Landing: Unbreakable footing: the ground under him holds … nothing breaks"). The tally counts that landing's energy (`r.Eimpact`), the thrown one's, as the stomp's rule does (`absorbed = E` where real ground would break). Below crater speed the engine has no break test for a thrown body's landing, so nothing is counted there.
3. **The charger's own stop (Collide, not in the spec's list).** The engine's carried hit says the charger stops himself at the end of the squash, "so its push back (his momentum, J) and his motion (E) go to his source too" (`carry.stop.E`). That is energy taken in, so the tally counts it as the charger's `stop` part: at 0.1% of light speed Ollie takes in his own 135 TJ as Rex takes in the hit's 135 TJ. Meant or bounced, the stop is still there. If the owner reads the stop as no shimmer (his own motion, not something absorbed from outside), drop the part: one line.
4. **Whose hit.** The hit's freed energy is the one hit's (Rex's when Ollie charges). Canon lists "a charge" among incoming hits and says the freed energy "shows in his shimmer" under Never knocked back, the one hit's power; the brief's table puts Ollie's charge into Rex's glow. The engine only takes the hit back when the charger takes his own recoil (pull request 4's gate), so with the charger's power off nothing is taken back (today's physics), whatever the one hit's switches say.
5. **The jump's footing is 0** (the spec's decision 2, kept): with Unbreakable footing the power supplies momentum without motion, and his bent legs stop his landing over the same stroke either way. Soft landing's part is the landing's.
6. **"Roughly" and "about".** A step's word takes "roughly" when the rung `compare()` words its energy against is rough (the ladder's own rule): the flare (its own rung) and the three-quarter step (beside the hurricane). The flicker, quarter and half steps take "about". This keeps the spec's "about a glow" at 135 TJ. Another reading: the steps hang on the flare, whose energy is uncertain by 33× (its high estimate is 1.7 × 10²⁵ J), so the quarter, half and three-quarter steps' energies are uncertain by 2.4×, 5.8× and 14×; by the ladder's 2× rule all three would be rough. The data the page carries has no ranges (`energyRefs` has `rough`, not the range), so that reading would need a data change.
   - Above the flare the word stays "roughly a blinding flare" for any finite energy (the flare's own energy is disputed); only an unbounded run is "a blinding flare". The page may prefer plain "a blinding flare" well past the flare.
7. **The faint flicker is a band, not a step.** Canon: "a faint flicker below a car crash". So everything from the floor up to the flicker is "a faint flicker", and the nearest-step rule applies from the flicker up. That is why the car all-out (level −0.016) is "a faint flicker", as the spec's table says, not "about a flicker". Below the floor: "too faint to see", and the tile still shows the energy (the spec's decision 4).
8. **The game of catch is a round trip.** Leg a's catch is Ollie's, the return leg's Rex's. With the same bodies the page reuses `a` for `b`; pass it as `b` and the tally gives the return leg to the right people. Pass `{ a }` alone for leg a only (then Rex takes in nothing but his throw's drag). I recommend the round trip: the verdict describes one.
9. **The "if he misses" what-if** is an option (`miss: true`), not the default: the tile follows the run (the catch). The page can show the miss's figure in its own callout, as now.
10. **Unlimited Collide.** At an unbounded charge (a set speed of light speed) the engine keeps today's "unstoppable" (pull request 4: its hit's energy is real, no `hitAbsorbed`), so the tally takes nothing back there, while a finite 0.1% of light speed glows. That is pull request 4's behaviour, unchanged here; flag for the owner if the shimmer should show at light speed too.
11. **Growth.** The Weight tab's what-if counts its energy whatever the switches say (it is a what-if, not a power). The growth modes on other tabs (gradual, instant, runaway) turn the same absorbed energy into mass; that energy is already its part (silent, soft or footing), so nothing more is added. In runaway mode the side effects are paid from it and taken back as growth too, so exactly the absorbed energy becomes mass.

## 5. For the page stage

- The tile's numbers come from `takenBack`; its word, glow strength and comparison from `glow()` and `compare()`. Never print "∞" or `Infinity`: say "unbounded".
- Copy that now contradicts the tally:
  - the Catch tab: "Stopping it puts … into his palms and arms. It ends up as heat in his indestructible plush" (`bayCatch`, and the partner toss's "which ends up as heat in his plush"). With the catcher's power on the catch is taken back (canon Q5; the `catch` part).
  - Collide and the fireball: "(it shows as his shimmer, which the lab doesn't draw yet)".
- STATUS.md "Waiting on" needs the spec's decision 3 question (does Ollie show absorption, and how?), and the README needs this pull request's section; neither is in this stage.
- Decisions 1–4, 6, 7 and 10 above belong in the README section and the PR body's numbered list for the owner.

## 6. Tests

- `node test/calibration.js`: all checks passed.
- `node test/presence.js`: 383 checks, all passed.
- `node test/powers.js`: 210/210 (181 before, 29 new in section 9). Part 1 (the powers-off fixture, 15,533 cases plus the 8 Safe-passenger ones) passes; the fixture and part 1's code are unchanged.
- `node test/ladder.js`: 578/578 (562 before, 16 new in section 9).
- `test/shots.js` and `test/sweep.js` not run (the page doesn't call the new code; the page stage runs the full line).

Section 9 of `test/powers.js`:
- 9a: the spec's table, each figure from the engine's own run (the least disruptive effort found as the page finds it), the real-air take recomputed in the test; Collide meant, bounced, and with the charger's power off.
- 9b: every power off, nothing taken back (61 runs, every part, both of them); each power alone gives only its own parts, and each of them somewhere; with every power on, no NaN and `unbounded` exactly when Infinity.
- 9c: the drag part is the share × real air's take (recomputed in the test) and never exceeds the object's energy plus its release height's potential energy: 666 throws (car, person, baseball; level, 45°, straight up; half-decade dials to 10²⁰ kg and unlimited; all and half the drag), with orbits, escapes and throws past 1% of light speed; fly()'s drag-free tally would break the bound in 286 of them. Through the orbit threshold the drag part never falls. A throw even real air can't bring down (the staff straight up at 10^12.5 kg, 79 km/s) gives all of its energy. The Wrestle throw, the toss and the game of catch's legs (81 runs, every kind of leg: caught, fast, fireball, overshoots, burns up; the toss caught, escaping and as a fireball): the drag part equals the recomputed take and never exceeds what was thrown.
- 9d: no double count: the jump with Soft landing and Unbreakable footing; a catch against a hit; the drag inside an arrival (the toss, the Wrestle throw's crater landing, a person's ground hit, a round trip).
- 9e: whose: Collide both ways, the game of catch's legs, the Wrestle throw (its landing only on the thrown one's own Unbreakable footing), the toss, a solo tab.
- 9f: Soft landing, Silent strike below and past sound, the fireball (on, meant, off), a person's ground hit (100%, 99.9%, Safe passenger off), the "if he misses" what-if, the Weight what-ifs.
- 9g: unbounded runs; light speed into Rex, into the truly immovable thought experiment and into a bolted Rex take nothing back; NaN figures add nothing; unknown names are refused.
- 9h: the tally changes nothing it reads (eight runs with the powers on, a plan's runs, `reach()`), and RESTRAINT has no `shimmer` key.

Section 9 of `test/ladder.js`: the anchors by key; the steps' energies, wordings and roughness; the words at every boundary; held at the flare; unbounded; no energy; the strength; monotonic over 1,651 energies from 1 mJ to 10³⁰ J and unbounded; a copy of the ladder with the flare, flicker or floor changed moves what depends on it, and nothing else (another rung changed, the rungs reordered); a ladder missing a rung is refused.

## 7. Mutants

Each mutant (`scratchpad/pr5/engine-mutants/mutants.py`; results in `results.json` and `results.md` there) copies the lab's `src/`, `test/` and `research/` into its own scratch tree, breaks one thing, and runs the checks that guard it: `node test/powers.js --skip-off --tally-only` for the tally, `node test/powers.js --off-only` (part 1, the powers-off fixture) for a result or `reach()` gaining a key, `node test/ladder.js` for the level. Run on the final tree (commit 3cb9f60).

**52 of 53 fail a check.** The one that doesn't, `nan-guard`, is equivalent: it removes one of the tally's two NaN guards (`tbJ`), and the other (`add()` skips a falsy value) still keeps NaN out; `nan-guard-both` removes both and fails 9g. Two gaps found on the first run were closed before the final run: a throw that even real air can't bring down (`drag-escape-0`: 9c now checks the staff straight up at 10^12.5 kg) and the Wrestle throw's footing switch (`wrestle-footing-power`: 9e now turns the thrown one's Unbreakable footing off and on). A Collide check that crashed on the `hit-charger` mutant instead of failing now fails cleanly.

| Mutant | What it breaks | Fails | Checks that fail (first words) |
|---|---|---|---|
| `drag-ocean` | drag from fly()'s drag-free tally (ocean.E), the brief's risk | yes, 8 | 9a: a car thrown 30 m, least disruptive (2.21e+4 kg-force):; 9a: a person thrown 30 m, least disruptive (3.34e+3 kg-force; 9c: a car thrown level through the orbit threshold (4 to 10; 9c: a throw even real air would not bring down (the staff, s; 9c: the Wrestle throw, the partner toss and the game of catc; 9c: the drag part is the share absorbed times what real air; 9d: the drag that real air would have taken is still in what; 9e: the Wrestle throw's crater-sized landing is taken back o |
| `drag-no-share` | drag without the share absorbed (all of real air's take at any share) | yes, 2 | 9c: a throw even real air would not bring down (the staff, s; 9c: the drag part is the share absorbed times what real air |
| `drag-twice` | the drag counted again on top of an arrival taken back (no count-once) | yes, 7 | 9a: a person thrown 30 m, least disruptive (3.34e+3 kg-force; 9d: a catch and a hit: a throw that reaches Ollie as a fireb; 9d: the drag that real air would have taken is still in what; 9e: the Wrestle throw's crater-sized landing is taken back o; 9e: the game of catch: leg a's catch is Ollie's, the return; 9f: a person caught in the game of catch: the catch (3.90e+3; 9f: a person thrown in the game of catch who hits the ground |
| `drag-escape-0` | a throw real air would not bring down (an escape) gives the drag nothing | yes, 1 | 9c: a throw even real air would not bring down (the staff, s |
| `drag-rel-0` | a throw past 1% of light speed gives the drag nothing | yes, 2 | 9c: the Wrestle throw, the partner toss and the game of catc; 9c: the drag part is the share absorbed times what real air |
| `drag-no-PE` | real air's take without the release height's potential energy | yes, 6 | 9a: a car thrown 30 m, least disruptive (2.21e+4 kg-force):; 9a: a person thrown 30 m, least disruptive (3.34e+3 kg-force; 9c: the Wrestle throw, the partner toss and the game of catc; 9c: the drag part is the share absorbed times what real air; 9e: the Wrestle throw's crater-sized landing is taken back o; 9e: the Wrestle throw: the drag is the thrower's, the landin |
| `toss-v-energy` | the toss past 1% of light speed: its energy from the rounded speed (not unbounded at an unlimited dial) | yes, 1 | 9g: at an unlimited dial the throw, stomp, punch (Silent str |
| `toss-flight-0` | the toss below 1% of light speed gives the drag nothing | yes, 2 | 9c: the Wrestle throw, the partner toss and the game of catc; 9d: the drag that real air would have taken is still in what |
| `leg-fast-0` | a game-of-catch throw past 1% of light speed (a straight line) gives the drag nothing | yes, 1 | 9c: the Wrestle throw, the partner toss and the game of catc |
| `leg-fireball-0` | a game-of-catch fireball gives the drag nothing | yes, 2 | 9c: the Wrestle throw, the partner toss and the game of catc; 9f: the fireball (a fastball 10 m apart at 10^14 kg, Things |
| `leg-overshoots-0` | a game-of-catch throw that overshoots gives the drag nothing | yes, 1 | 9c: the Wrestle throw, the partner toss and the game of catc |
| `leg-flight-swap` | the game-of-catch flight with the lob's and the fastball's ends swapped | yes, 1 | 9c: the Wrestle throw, the partner toss and the game of catc |
| `stomp-E` | the stomp's footing part is its whole energy, whether or not real ground would break | yes, 1 | 9a: the stomp, Unbreakable footing keeping the concrete whol |
| `jump-footing` | the jump adds a footing part (its landing's energy) beside Soft landing's | yes, 2 | 9d: the jump: Soft landing's part is its landing.absorbed, a; 9f: Soft landing: the jump's landing taken back, 5.02e+4 J a |
| `soft-E` | Soft landing's part is the landing's whole energy, not what it takes back | yes, 2 | 9d: the jump: Soft landing's part is its landing.absorbed, a; 9f: Soft landing: the jump's landing taken back, 5.02e+4 J a |
| `silent-mach` | Silent strike takes back a punch or clap below the speed of sound too | yes, 1 | 9f: Silent strike: nothing below the speed of sound (the pun |
| `silent-power` | Silent strike's part without the switch | yes, 2 | 9b: each power alone takes back only its own parts, and each; 9b: with every power off (the four, Safe passenger, Silent s |
| `hit-Q` | the hit's part is the splat's Q, meant or not | yes, 1 | 9a: the same hit, meant (a blast preset): its energy is real |
| `hit-charger` | the hit's freed energy goes to the charger, not the one hit | yes, 2 | 9a: Ollie charges Rex at 0.1% of light speed (the defaults):; 9e: Collide: the one hit takes in the hit's freed energy, th |
| `stop-none` | the charger's own stop left out | yes, 4 | 9a: Ollie charges Rex at 0.1% of light speed (the defaults):; 9a: the same hit, meant (a blast preset): its energy is real; 9b: each power alone takes back only its own parts, and each; 9e: Collide: the one hit takes in the hit's freed energy, th |
| `passenger-power` | a thrown person's landing counted with Safe passenger off | yes, 4 | 9a: a person thrown 30 m, least disruptive (3.34e+3 kg-force; 9b: each power alone takes back only its own parts, and each; 9b: with every power off (the four, Safe passenger, Silent s; 9c: the drag part is the share absorbed times what real air |
| `catch-power` | a catch counted while the catcher doesn't take his own recoil | yes, 3 | 9b: each power alone takes back only its own parts, and each; 9b: with every power off (the four, Safe passenger, Silent s; 9c: the Wrestle throw, the partner toss and the game of catc |
| `catch-thrower` | a catch counted as the thrower's | yes, 2 | 9e: the game of catch: leg a's catch is Ollie's, the return; 9f: a person caught in the game of catch: the catch (3.73e+3 |
| `catch-return-leg` | the return leg (b) of the game of catch left out | yes, 2 | 9d: the drag that real air would have taken is still in what; 9e: the game of catch: leg a's catch is Ollie's, the return |
| `fireball-E` | the fireball's hit part is all its energy, not the motion freed at him (knockAbsorbed.E) | yes, 2 | 9d: a catch and a hit: a throw that reaches Ollie as a fireb; 9f: the fireball (a fastball 10 m apart at 10^14 kg, Things |
| `ground-hit-none` | a person's ground hit in the game of catch not read from hitsGround | yes, 2 | 9d: the drag that real air would have taken is still in what; 9f: a person thrown in the game of catch who hits the ground |
| `ground-hit-whole` | below 100% the ground hit counts all of its energy, the swept air's included | yes, 1 | 9f: a person thrown in the game of catch who hits the ground |
| `miss-ignored` | the "if he misses" what-if ignored | yes, 1 | 9f: a person caught in the game of catch: the catch (3.73e+3 |
| `wrestle-footing-power` | the Wrestle throw's landing taken back without the partner's Unbreakable footing | yes, 1 | 9e: the Wrestle throw's crater-sized landing is taken back o |
| `wrestle-footing-thrower` | the Wrestle throw's landing on the partner's footing counted as the thrower's | yes, 2 | 9e: the Wrestle throw's crater-sized landing is taken back o; 9e: the Wrestle throw: the drag is the thrower's, the landin |
| `toss-catch-power` | the partner toss's catch counted without his own recoil taken | yes, 4 | 9b: each power alone takes back only its own parts, and each; 9b: with every power off (the four, Safe passenger, Silent s; 9c: the Wrestle throw, the partner toss and the game of catc; 9d: the drag that real air would have taken is still in what |
| `toss-drag-twice` | the toss's drag counted on top of its catch | yes, 1 | 9d: the drag that real air would have taken is still in what |
| `growth-none` | the growth what-if left out | yes, 1 | 9f: the Weight tab's growth what-if: the energy that becomes |
| `solo-ollie` | a solo tab's parts put on Ollie | yes, 2 | 9e: the Wrestle throw: the drag is the thrower's, the landin; 9f: the Weight tab's growth what-if: the energy that becomes |
| `nan-guard` | NaN passes tbJ (one of two guards: add() skips a falsy value too, so NaN still adds nothing: equivalent) | no | none (equivalent, above) |
| `nan-guard-both` | NaN figures pass through (both guards gone) | yes, 1 | 9g: no NaN: a finite run isn't unbounded; light speed into R |
| `wrestle-footing-thrower-switch` | the Wrestle throw's landing taken back on the thrower's Unbreakable footing, not the thrown one's | yes, 1 | 9e: the Wrestle throw's crater-sized landing is taken back o |
| `unbounded-flag` | an unlimited run not flagged unbounded | yes, 2 | 9b: with every power on, no figure is NaN or negative, and E; 9g: at an unlimited dial the throw, stomp, punch (Silent str |
| `mutates-result` | the tally writes what it works out back into the throw's result | yes, 1 | 9h: the tally adds no key to, and changes nothing in, the re |
| `key-on-throw` | throwOnce's result gains a key (the tally kept in the result) | yes, 2 | powers explicitly off (airAbsorb 0, keepForm, unbreakable an; powers left out: every engine result matches the engine befo |
| `key-on-reach` | reach() gains a key (the glow beside the water-glass ripple) | yes, 4 | powers explicitly off (airAbsorb 0, keepForm, unbreakable an; powers left out: every engine result matches the engine befo; powers left out: the 8 planner cases run with Safe passenger |
| `level-linear` | the level on a linear scale | yes, 5 | 9: the anchors' levels: the flicker 0, the flare 1, the floo; 9: the flare from the data: ten times the dinosaur-killer's; 9: the flicker from the data: ten times the Corolla's energy; 9: the glow's strength is 0 at the floor and below, 1 at the; 9: the word for each energy: too faint to see below the floo |
| `anchors-copied` | the anchors as copied numbers, not the ladder's rungs | yes, 3 | 9: the flare from the data: ten times the dinosaur-killer's; 9: the flicker from the data: ten times the Corolla's energy; 9: the floor from the data: ten times Usain Bolt's energy mo |
| `anchors-by-position` | the anchors read by their place in the ladder, not by key | yes, 2 | 9: a ladder without one of the three rungs is refused, not r; 9: only those three rungs count: changing another rung's val |
| `no-hold` | the level not held at the flare | yes, 2 | 9: above the flare the level is held at 1 (held), the glow a; 9: the level never falls as the energy rises (1651 energies |
| `no-faint-band` | below the flicker the nearest step, not the canon's faint flicker | yes, 2 | 9: the floor from the data: ten times Usain Bolt's energy mo; 9: the word for each energy: too faint to see below the floo |
| `no-floor` | the glow's strength from the flicker, not the floor | yes, 2 | 9: the floor from the data: ten times Usain Bolt's energy mo; 9: the glow's strength is 0 at the floor and below, 1 at the |
| `no-too-faint` | below the floor still a faint flicker | yes, 2 | 9: the floor from the data: ten times Usain Bolt's energy mo; 9: the word for each energy: too faint to see below the floo |
| `rough-never` | no step rough | yes, 2 | 9: a step is rough by the ladder's rule (the rung it is word; 9: the word for each energy: too faint to see below the floo |
| `step-below` | the step at or below the level, not the nearest | yes, 1 | 9: the word for each energy: too faint to see below the floo |
| `steps-fifths` | the steps at fifths of the span | yes, 4 | 9: a step is rough by the ladder's rule (the rung it is word; 9: the named steps are the flicker, a quarter, a half and th; 9: the steps' wordings are the brief's: about the same as a; 9: the word for each energy: too faint to see below the floo |
| `unbounded-nan` | unbounded energy gets no special case | yes, 2 | 9: the level never falls as the energy rises (1651 energies; 9: unbounded energy (an unlimited run) is the flare at full |
| `no-none` | no energy still gets a level | yes, 1 | 9: no energy (0, negative, NaN, missing) is no tile: none, n |
