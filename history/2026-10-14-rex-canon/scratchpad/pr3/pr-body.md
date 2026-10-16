Second of four stacked pull requests built by the owner's session from `rex-strength-lab/RUN-canon.md`. **Stacked on #33: merge #33 first.** This one's base is `claude/canon-2-recoil`, so the diff shows only this pull request's changes. After #33 merges, its base should move to `main` (GitHub does that when the merged branch is deleted); retarget it by hand if not.

## What changed

Item 5 of `rex-strength-lab/BRIEF-canon.md`. Canon: "*Safe passenger* (RT 4.2): someone he throws or catches feels a manageable force unless he knows they can take it", listed among the default powers ("on unless they choose otherwise"). The ruling of 14 Oct 2026: it also covers where the person lands and the air's drag on them.

- **On by default.** Their powers gives Safe passenger its own heading, "People they throw or catch". The intro and the summary line count it among the default powers.
- **What it covers.** With it on, a person he throws or catches feels only a manageable push, spread through their whole body, at the launch, in the air and when they land. The passenger hazard (the ride limits) never fires, on Throw or in the game of catch.
- **The landing.** The person comes down unharmed: the landing's energy is taken back. Its momentum still reaches the ground, so it shakes the ground as a real landing does. That shaking now sets the person throw's courtesy ceiling. Past what the ground bears under the landing's downward push, the ground gives way where they land (review rounds 1 and 2).
- **Heat isn't covered.** Where the flight would burn them (Things keep their form off), the page doesn't call them unharmed, on Throw and in the game of catch.
- **With the switch off**, everything is as before, and the page says the lab doesn't judge the fall.
- **Saves.** The save mark goes to 3. An unmarked save, or one marked 2, loads with Safe passenger on; a save marked 3 keeps the reader's choice.
- **Engine** (`src/engine.js`): `passengerLaunch`, `passengerDrag` and `passenger` (the hazard, never with the switch on); `passengerLanding` (the landing's energy taken back, and its momentum); no landing blast for a person with the switch on; `PASSENGER.landGround` (where the ground gives way under a person's landing); `catchMissAngle` (how steeply a missed catch comes down, worked out again from the leg); and, in the game of catch, `hitsGround.own` (a kept person's own share of a ground hit, only with Things keep their form on). None of these adds a key to any powers-off result.
- **Page, cards, data, README:** the copy on Throw, Catch, the effort box and the cards; the drag fact relabelled in `research/final-presence.json`; a README section "Safe passenger on by default" with decisions 1–11, what moved, and what is left.

## Decisions (README, decisions 1–11; the review rounds checked them)

For you to confirm or overrule: 1, 2 and 5.

1. **The save mark is 3, not pull request 1's 2.** STATUS asks you to republish after #31. A save written on that page carries the mark 2 with Safe passenger off as the old default, and reading it as a choice would leave the new default off for that visitor.
2. **The landing's split, and where the ground gives way** (the brief's reading, with the rule the review rounds added; please confirm). The landing's momentum stays real and whole, and its energy is taken back. The ground's pulse is the person's own quick stop (31 ms, about 59 g on average at the least disruptive effort), spread through them, not a slow, gentle stop. Read as a gentle 1.5 g stop instead, the landing would never crack plaster, and the person throw would have no ceiling at the default dial. Taking back the energy doesn't take back the force, so past what the ground bears under the **downward part** of the landing's push over that stop (its bearing over the person's whole facing area, less their weight), the ground gives way where they land. The lab doesn't size the hole or count it as harm, and its shaking figures are rough there. Straight down that is about 100 m/s on the concrete slab or asphalt, 140 m/s on ice, 1.8 km/s on steel, 2.7 km/s on granite and 20–50 m/s on sand, gravel and clay (estimates). A slanting landing has to be faster (on the slab about 120 m/s at 45°, reached all-out at a dial of about 202,000 kg), and one that skims in nearly level presses down far less.
3. **No landing blast** for a person with the switch on, since its energy is taken back.
4. **Heat isn't covered.** Where the flight would burn them (Things keep their form off), the page doesn't call them unharmed. The game of catch uses the Throw tab's rule: Things keep their form off, some of the air's drag left, and the air at the nose past 1,200 K.
5. **The game of catch with a person** is covered too (please confirm the ground hit). A missed catch's landing is taken back like a throw's, and the ground gives way past what it bears, as in 2. A throw past 1% of light speed and more than about 12 km apart hits the ground before it reaches the catcher. Where the person comes through it whole, it is their landing:
   - With all of the drag absorbed it meets no air, and all its energy is taken back.
   - Below 100%, with Things keep their form on, only their own share is taken back. The air they swept up (its heat and motion) is real and makes its own crater, quake and blast: at a 10¹⁶ kg dial 31.6 km apart and 99.9% absorbed, a 66 m crater, not the 181 m of the whole hit.
   - Its push still reaches the ground and gives way there. A push big enough to move the whole Earth carries at least p²/2M of real energy into it (from a dial of about 6.5 × 10²³ kg), which counts as the hit's blast. At unlimited strength the push is unbounded, so the page says the hit has no physical answer. Reading that excess as "the ground's share it can't bear" would be new canon, so it isn't used.
   - With Things keep their form off, its plasma and debris hit, with the crater, quake and blast, as before.

## What moved (against #33's branch)

- **Person thrown 30 m at 45°, default dial:**
  - Least disruptive goes from 333 kg-force (the person goes 3.0 m) to 3,342 kg-force (30 m, released at 16.4 m/s, landing at 18 m/s with 14,600 J taken back).
  - The courtesy ceiling goes from 334 kg-force (the person's g-force) to about 27,000 kg-force, where plaster may crack 5 m from the landing.
  - At 100% Air resistance absorbed, this move comes only from the new default.
- **Below 100% absorbed:** the drag no longer counts with the switch on (at 0%, about 39,300–39,600 kg-force → no ceiling).
- **At a 10⁹ kg dial:**
  - The windows preset moves from about 1.8 million to 388 million kg-force, and houses from 1.6 million to 241 million: no landing blast.
  - The ceiling (plaster) and the boom are unchanged.
- **The game of catch:** no ride-limit harm with a person by default (the fastball in real air was flagged for its drag); a person's ground hit is a landing (5).
- **The review rounds' give-way rule and ground hit change only the page's words,** not a preset or a ceiling: the ground giving way isn't counted as harm, and in the game of catch his throwing hand's sound barrier and its own air come first (checked against round 1's build in seven states).

## How it was tested

The full Rex lab line on this branch, one test at a time (18 minutes here without the sweep, which CI doesn't run; about 11 minutes estimated on CI for all three projects, inside its 20):
- calibration: 117 checks, all pass
- presence: 383 checks
- shots: 83 ok lines, 0 problems at 390 and 1280 px, light and dark; its powers-off page comparison unchanged
- powers: 162/162
- ladder: 562/562
- sweep: 7,776 settings, 0 problems

**Powers-off fixture.** `test/powers.js` part 1 checks 15,533 powers-off cases byte-identical to `main`. The 8 fixture cases that run with Safe passenger on go through a shim that restores the old rule, and the test checks that exactly those 8 differ without it.

**Page checks.** Nine `test/shots.js` checks each fail on #33's page. Round 1 added a block of checks for its fixes, and round 2 added another block and a check for ice and the steel deck.

**Mutants.** Each of these fails a check, on the final tree too:
- the drag hazard firing with the switch on
- the landing's energy dropped
- its momentum vanishing
- the landing blast kept
- the migration skipped
- a save marked 2 read as a choice

**Review rounds:** two, per `RUN-canon.md` (physics and claims; code, layout and the migration). Both are complete. Each finding was reproduced or refuted by a skeptic, and each fix was reverted in a scratch copy to see its check fail.
- **Round 1** (at 95a22f9): 8 findings, 7 confirmed and fixed, 1 refuted (`rex-strength-lab/research/reviews/canon-3-round1.json`). The main ones: a missed person was called unharmed beside a "skin melts" chip; past what the ground bears the page now says the ground gives way, not "no crater"; no "no quake" claim; a person's ground hit with no air as a landing; the first hit squashes only his palms.
- **Round 2** (at 2449bc2): 8 findings, all confirmed and fixed (`rex-strength-lab/research/reviews/canon-3-round2.json`). The main ones:
  - The give-way rule compares only the downward part of the push, over the person's own stop with no 1 ms floor. Steel and granite give way from 1.8 and 2.7 km/s, not 5.6 and 13 km/s; a landing that skims in no longer "gives way".
  - A kept person's ground hit below 100% counts only the swept air.
  - An unbounded push has no physical answer, and an Earth-moving one counts its least energy.
  - On ice and the steel deck the page no longer says the landing's shaking counts.
  - Two of round 1's card fixes gained checks, and this description was updated.

## What it needs

- **Owner:** confirm or overrule decisions 1, 2 and 5. Merge #33 first, then this one, with merge commits; start CI on this branch before merging, if the session hasn't.
- **Collaborator:** nothing.
- **Left for later:** pull request 5's shimmer reads the energy Safe passenger takes back (`passengerLanding`, the missed person's landing, and a ground hit's own share).
- **Found, not fixed (older than this pull request, for any object):** in the game of catch, a missed throw near or past orbital speed with none of the drag acting never comes down. The page reports it as landing 0 m behind him at 0 m/s.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_0136zsmhtj8TCY2T2u8SKMVX
