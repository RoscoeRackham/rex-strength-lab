Fourth of four stacked pull requests built by the owner's session from `rex-strength-lab/RUN-canon.md`. **Stacked on #35 (which is stacked on #34, on #33): merge #33, then #34, then #35, then this one.** This one's base is `claude/canon-4-contests`, so the diff shows only this pull request's changes. After #35 merges, its base should move to `main`; retarget it by hand if not.

## What changed

Item 6 of `rex-strength-lab/BRIEF-canon.md`, the absorption shimmer, under CLAUDE.md's canon ("*Where absorbed energy goes*": his eyes, feather tips and mouth-glow shimmer in proportion to what he takes in; gently warm, never scalding) and the rulings of 14 Oct 2026 (a faint flicker below a car crash, the blinding flare at a dinosaur-killer-scale hit, the growth what-ifs too). The owner confirmed drawing the glow over the art; the image files are unchanged.

**Engine** (commit `3cb9f60`). `RESTRAINT.takenBack(move, r, o)` adds up the energy their powers take back in the run a tab shows: the total, each part (the air's drag, the ground kept whole, Soft landing, Silent strike, a hit's freed energy, a charger's own stop, a person's landing, a catch, growth) and what each of them takes in. It adds no key to any result, so every powers-off result is still byte-identical (`test/powers.js` part 1). `EnergyLadder.glow(J, refs)` gives the level on a log scale between a car crash (a flicker) and the dinosaur-killer (the flare), its anchors and floor found in the ladder by key, with named steps worded by `compare()`.
- The drag counted is what real air would have taken from the same throw, not the drag along the drag-free path (the brief's risk: that can be hundreds of times the throw's energy). The brief's car throw is now 35.0 kJ, not 42 kJ.
- Where a throw's arrival is taken back too, the drag is counted once, there.

**The Shimmer tile.** At the end of the tile row of Throw, Jump (Soft landing), Stomp, Punch and Clap (Silent strike), the Wrestle throw, the game of catch, the partner toss and Collide's charge, and in the Weight tab's growth what-if box. It gives the level in words, the energy taken in and what it comes from, the ladder's comparison, and once that the glow is gently warm, never scalding. In the two-player runs it names who takes each part in; its level word is Rex's (canon gives him the shimmer). At unlimited strength it says the energy is unbounded, with no figure. None with every power off. Plain text, like the other tiles: it is what a screen reader hears.

**The glow on his art.** A warm layer over his eyes, feather tips and mouth on the header picture and the Collide picture, at positions measured from the image files, in a box that clips it; `aria-hidden`, no clicks. The header follows the run on Rex's own tab, the Collide picture the charge, both with Rex's take only. Static under reduced motion; a gentle shimmer otherwise. No layout shift, no sideways scroll.

**Copy and cards.** A catch's energy (the game of catch, the partner toss) goes to the endless ocean with the catcher's power on; it had said it ends up as heat in his plush. Collide and the fireball no longer say the shimmer isn't drawn yet. The Throw tab names the shimmer's drag figure beside the drag-free one. Collide's carry gives the charger's motion going to his source. A new card on the shimmer, its figures filled in from the ladder. STATUS.md asks the owners whether Ollie shows absorption, and how.

## Decisions for you to confirm (README section "The absorption shimmer", What is left: the same eleven, in the same order)
1. **The drag figure** (decisions 2 and 8): what real air would have taken from the same throw, counted once where the arrival is taken back too; not the drag along the drag-free path.
2. **The floor** (decision 4): the faint flicker fades to nothing at Usain Bolt at top speed (7.33 kJ); below it the tile says "too faint to see" and no glow is drawn.
3. **Whose shimmer** (decisions 3 and 19): in the two-player runs the tile's level is Rex's, Ollie's take is named without a glow word, and the glow on Rex's art shows only Rex's take, until the canon question in STATUS.md is ruled.
4. **Catches are a source** (decision 2): a catch's energy is taken back with the catcher's They take their own recoil on, the partner toss's included.
5. **The Wrestle throw's crater-sized landing counts, as the thrown one's Unbreakable footing** (decision 9).
6. **The charger's own stop counts as his take** (decision 10); the alternative is to leave his own motion out of the shimmer.
7. **The one hit takes in the hit's freed energy** (decision 11).
8. **"Roughly" and "about", and the nearest step** (decisions 13 and 14): the stomp at 10⁹ kg is "about a faint glow".
9. **The faint flicker is a band from the floor up to a car crash** (decision 14).
10. **At light speed Collide shows no shimmer** (decision 17, pull request 4's behaviour).
11. **How the glow looks** (decisions 20–22): the square root of the strength, the spots on the art, the header following Rex's tab, a gentle shimmer where motion is allowed.

## How it was tested

The full Rex lab line on this branch, one test at a time in the 4-CPU cloud sandbox, and all pass: build-data.py and build.js; calibration.js all checks passed (98 s); presence.js 383 (42 s); shots.js 85 checks, no problems (806 s; pull request 4's was 843 s, so within run-to-run noise, though the new block adds about a minute: `--pr5` alone took 57 s and 64 s); powers.js 210 of 210 (200 s); ladder.js 578 of 578 (1 s); sweep.js 7,776 contexts with no NaN or negative output (477 s).

**Against `main`:** every powers-off engine result is byte-identical (powers.js part 1); the tally adds no key to any result.

**Engine stage** (`3cb9f60`): `test/powers.js` section 9 (29 checks) and `test/ladder.js` section 9 (16 checks). 52 of 53 engine mutants fail a check; the 53rd is equivalent (one of two NaN guards).

**Page stage:** `test/shots.js`, pull request 5's block, 13 checks, reading figures from the engine in the page and waiting for the condition each reads (no fixed sleeps):
- `solo-tiles`, `duo-tiles`, `duo-who`: the tile ends its row on every tab above, with the engine's energy, what it comes from, the ladder's wording and the level's word, the note once, one line for each of them who takes something in; none where nothing is taken back.
- `powers-off`, `weight`, `unbounded`: no tile or glow with every power off; the growth what-if box; "unbounded" in words at unlimited strength, never "∞".
- `a11y`: the tile is in the accessibility tree like the other tiles; the glow layers are `aria-hidden`, ignored by it, and take no clicks.
- `follows`: the header glow follows Rex's tab, the Collide picture Rex's own take (none when he means the hit).
- `copy`: the six copy fixes.
- `glow-features`: screenshots of both pictures with the glow at none and at full, at 390 and 1280 px, light and dark: brighter at every eye and mouth glow by 75 to 165 levels (of 255) and at the feather tips by 50 to 71 on average, unchanged (within 1.9) on the background, the spires and the caption. It samples the features where they were measured from the image files, not the page's own layer.
- `layout`, `no-scroll`, `motion`: each picture's box is its image's own size (no layout shift; the header at the 16 px gutter at 390 px) and clips the glow; no sideways scroll at 390 px; static under reduced motion.

Each of the 13 fails on pull request 4's page (`1a3b91b`). 29 page mutants, each reverting or breaking one part of the build in a scratch copy, each fail the check that guards it. Two survived a first run and were closed before the final one: the glow check had read the spots from the page's own layer, and the game of catch's round-trip rule had no case.

Every changed view was rendered at 390 and 1280 px, light and dark, and looked at; a sweep of 336 page states (the changed tabs at four dials, least disruptive and all-out, with the powers on, Bolted and every power off) showed 182 tiles, all last in their row, none with "∞", NaN or undefined, and no page error.

## Review rounds

Two, per `RUN-canon.md`: design, copy and accessibility (the glow's placement on both pictures at both widths and in both themes, the tile read by screen readers); code and data (which drag figure feeds the shimmer, the floor, the steps taken from the ladder by key). Next.

## What it needs

- **Owner:** confirm or overrule decisions 1–11. Merge #33, #34, #35, then this one, with merge commits, after CI passes (start it by hand: `gh workflow run test.yml --ref claude/canon-5-shimmer`).
- **Owner and collaborator (canon):** does Ollie show absorption, and how? (STATUS.md, Waiting on.) Until then the tile names what he takes in, without a glow word, and nothing is drawn on him.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_0136zsmhtj8TCY2T2u8SKMVX
