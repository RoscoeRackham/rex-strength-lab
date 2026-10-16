# Pull request 5 build spec: the absorption shimmer (BRIEF-canon.md item 6)

Branch `claude/canon-5-shimmer`, from `claude/canon-4-contests` (after pull request 4's review rounds); its base is `claude/canon-4-contests`. Builds item 6 only.

The mapping (on `main`, before pull requests 2–4) is the `pr5_shimmer` entry of `../pr345/map.json`, with prototypes and marked images in `../understand345/shimmer/` (ladder.js, runs.js, catch.js, realair.js, orbit.js, layout.js, features.py, mark.py, marked-dino.png, marked-art-unstoppable.png, hero-*.png, collide-art-*.png). Pull requests 2–4 changed the throw, catch, pull, Collide, the contests and the copy: re-find every site on this branch and read their README sections first (recoil to their source carries almost no energy; Safe passenger's `passengerLanding`; pull request 4's hit energy, its 'mean it' variant and the fireball's energy with Never knocked back).

## Canon

"*Where absorbed energy goes* (RT 2, 4.4): back into the store of infinite power they draw on ('a drop in an endless ocean'). It shows: his eyes, feather tips and mouth-glow shimmer in proportion to what he takes in (a flicker for a car crash, a blinding flare for a planet-scale hit). His glow is gently warm, never scalding." Rulings of 14 Oct 2026: the shimmer is a faint flicker below a car crash; the blinding flare is a dinosaur-killer-scale hit (about 5 × 10²³ J); he shimmers in the growth what-ifs too. The glow may be drawn over the art (the owner confirmed); the art is the owner's: never redraw it, never change the image files.

## Decisions (record each in a README section and the PR body; the review rounds check them)

1. **One tally per run, in the engine, outside every result.** A new exported function (for example `RESTRAINT.takenBack(move, r, o)`, returning `{ E, parts: { drag, footing, soft, silent, hit, passenger, catch, growth } }`) worked out from the run the page shows and its options. Never add a key to any move result, to `reach()`, `plan()` or `planNow()`: powers-off fixtures hash them. Don't call it `shimmer` in the engine: `VIB.TH.shimmer` and `reach().shimmer` already mean the water-glass ripple. E is 0 when every relevant power is off; guard NaN (headOn gives Q NaN for unlimited momentum against unlimited inertia).
2. **The parts.**
   - **The air's drag (the brief's risk):** NOT fly()'s `ocean.E` tally, which is the drag along a drag-free path (it can exceed the object's own energy hundreds of times, and drops to 0 for an orbit). Use the share absorbed × what real air would have taken from the same throw (the `dragLoss0` formula, at any speed: one extra full-drag flight; all of the object's energy if that flight escapes, orbits, never lands or is relativistic). Compute it in the tally, not inside throwObject (every search probe runs throwObject). The same for the Wrestle throw and the partner toss. Brief's table becomes: least-disruptive car 35.0 kJ, all-out 0.27 MJ, both a faint flicker.
   - **Unbreakable footing:** the stomp's `absorbed` (0 where the ground wouldn't break). The jump's footing part is 0: the power supplies momentum without motion there (the Jump tab says he gets his whole push). Never add a jump's footing and Soft landing's parts for the same landing.
   - **Soft landing:** `landing.absorbed`.
   - **Silent strike:** a punch's or clap's energy past Mach 1 (the page's absorbBlock rule).
   - **A hit's freed energy** (pull request 4): Collide's splat Q with the charger's power on, unless the reader picks a blast preset ('mean it'); the fireball's motion energy freed at the catcher with Never knocked back on (pull request 4's split). No tile for a bounce (Q 0), the paradox, or NaN.
   - **A thrown person's landing** with Safe passenger on: `passengerLanding(r, o).absorbed` (pull request 3).
   - **Catches:** CLAUDE.md counts a caught object and a partner landing on him as incoming hits whose freed energy shows in his shimmer, and a catch is absorbed (Q5): add the catch's freed energy (`Ecatch`) while the catcher takes his own recoil, the partner toss's catch included. (Not in the brief's list; record it.)
   - **Growth what-ifs:** the energy that becomes mass (the Weight tab's what-ifs).
   - **Momentum taken back without motion** (recoil, the weak ground's supplied push, a hit's momentum) carries almost no energy and adds nothing.
3. **Whose shimmer.** Canon gives the glow to Rex ("his eyes, feather tips and mouth-glow"); it says nothing of Ollie's. Interim: in two-player runs the tile names who takes each part in (Rex, Ollie), and the glow on Rex's art shows only what Rex takes in. Write the question into STATUS.md under Waiting on (owner and collaborator: does Ollie show absorption, and how?). It doesn't block this pull request.
4. **The level.** On a log scale between the canon's two anchors, both ladder rungs found BY KEY (no copied numbers): a flicker at `energy_corolla_100kmh_kinetic` (a car crash: a Corolla at 100 km/h), the flare at `energy_chicxulub_impact` (the dinosaur-killer; a rough and disputed rung: say "roughly" for the flare and the steps near it, the ladder's rough-rung word, and say in the tile's note that the flare's energy is disputed). Below a flicker, a faint flicker fading to nothing at the floor `energy_usain_bolt_top_speed` (Usain Bolt at top speed): the floor is a design proposal, not canon: say so. Above the flare, the flare (no brighter). Named steps at ¼, ½ and ¾ of the log span between flicker and flare, each worded with the ladder's `compare()` (house wording): about 1.6 × 10¹⁰ J ("about the same as a fully loaded A380 at cruising speed"), about 5 × 10¹⁴ J ("24% of the Chelyabinsk meteor of 2013"), about 1.6 × 10¹⁹ J ("roughly 30% of the heat an average hurricane releases in a day"). The word for a level is the nearest named step on the log scale (the ladder's nearest-rung rule). Below the floor: the tile says "too faint to see" and no glow is drawn.
5. **The tile.** A "Shimmer" tile at the END of each tab's tile row whose run takes energy back (never between an energy tile and its "Compared with"): the level's word, the energy, and its ladder comparison; the note "gently warm, never scalding" once. It is what a screen reader hears. Weight: in the growth what-if's box. Tabs: Throw, Jump, Stomp, Punch, Clap, the Wrestle throw, the game of catch, the partner toss, Collide, Weight's what-ifs (and any other run with a part).
6. **The glow on the art.** A warm CSS layer over his eyes, feather tips and mouth on the header picture (`assets/dino.jpg`) and the Collide picture (`assets/art-unstoppable.jpg`), positioned at fractions of each picture measured from the pictures (the mapping's coordinates; check them on the marked images and in screenshots) and kept beside the pictures in the code. `aria-hidden="true"`, pointer-events none; wrap each image in a relative, overflow-hidden box so a blur never spills (at 390 px the header image sits at the 16 px gutter). Strength follows the level (0 at the floor or below, 1 at the flare). Any animation sits inside the page's reduced-motion guard (static glow otherwise). The header glow follows the solo bay's current tab's run; the Collide picture follows the Collide run (Rex's take). Keep it off the Collide picture's caption and background spires. Never redraw or alter the art.
7. **Never scalding:** the tile's note says once that the glow is gently warm, never a heat hazard.

## The brief's figures (at 3,000 kg)

| Run | Taken back | Level |
|---|---|---|
| Throw a car 30 m, least disruptive | 35.0 kJ of drag (real air's take; the brief's 42 kJ was the tally) | a faint flicker |
| The same, all-out | 0.27 MJ | a faint flicker |
| Stomp all-out (Unbreakable footing keeps the concrete whole) | 0.10 MJ | a faint flicker |
| Stomp all-out at a 10⁹ kg dial | 1.1 GJ | 0.19: nearest step a flicker |
| Ollie charges Rex at 0.1% of light speed (the defaults; pull request 4) | 135 TJ | 0.47: about a glow |
| A person thrown 30 m, least disruptive (Safe passenger) | 14.6 kJ | a faint flicker |

## Tests

`test/powers.js` (or a new test file wired into the test line and CI only if needed; prefer existing files): the tally's parts on the runs above; it is 0 with every power off; it never adds a key to a result (part 1 still byte-identical); the drag part never exceeds the object's energy; the level never falls as the energy rises (a sweep); the anchors, floor and steps come from the ladder by key (change a rung's value in a copy of the data and see the level move). `test/ladder.js` if the ladder helper lives in `src/ladder.js`. `test/shots.js`: the tile appears only when energy is taken back, at the end of the row, with the ladder's wording; screen readers hear the tile (it is in the accessibility tree) and not the glow layer (aria-hidden); the glow sits on the features at both widths (screenshot crops of the eyes, mouth and feather tips on both pictures at 390 and 1280 px, light and dark; compare pixel brightness at the measured spots with the glow at 0 and at full); reduced motion: no animation; no sideways scroll at 390 px. Each new check must fail on pull request 4's page. The full Rex lab test line and `test/sweep.js` pass.
- From pull request 3's round 1: a person who hits the ground with no air in the game of catch (Safe passenger, 100% absorbed) has its energy taken back; the shimmer must read it from the leg's hitsGround.E (it is not in passengerLanding). The ground-gives-way threshold for a person's landing is PASSENGER.landGround.

## Lessons from pull requests 2–4 (read before building)

- Every sentence on a view you change must agree with the engine and with every other sentence on that view: power on and off, Bolted on, least effort, all-out, a 10⁹ kg dial, unlimited strength. Most review findings in pull requests 2–4 were contradictions between two texts on one view, a sentence true at one effort and false at another, or "∞" in text. Check these yourself before reporting.
- Every new behaviour and every fix needs a check that fails without it. Confirm this by reverting in a scratch copy. A check that reads only one branch of a three-branch fix misses the other two (pull request 4's re-check found two such gaps).
- Never copy a figure by hand. Compute it from the engine or the data, and test the page text against the engine where you can. Where a figure in the README or the PR body comes from the page, say which state it comes from.
- Page checks in test/shots.js must not use fixed sleeps. Wait for the condition the check reads: the bay redrawn after a change, and no search still working. Pull request 4's block shows how (its load/pick/ollieKg/sw helpers). CI's job timeout is 30 minutes, and the Rex lab's screenshots already take about 11 minutes of it on a slow runner. Keep the new checks lean: reuse page loads, and add no more than about a minute of run time.
- Keep the README section for this pull request as a closed record at the end: decisions, what moved, tests, review history, known limits, and the numbered list of decisions for the owner. The PR body mirrors that list (same numbering).
- Pull request 4's built behaviour that the shimmer reads:
  - Collide's carried hit: `hitAbsorbed.E` (Q, 0 when meant), `carry.Eair` (real), `meanIt`.
  - The paradox: no h. The bounce: Q 0.
  - The fireball with Never knocked back: `knockAbsorbed { J, E }`.
  - The contests' own recoil: `recoilAbsorbedA/B`, momentum only.
  - The walk-out's push back: momentum only.
- Pull request 3's: `passengerLanding(r, o)` returns `{ absorbed, ... }`, and `hitsGround.own` holds a kept person's share in the game of catch. A person's ground hit with no air takes its energy from the leg's `hitsGround.E` (see Tests).
