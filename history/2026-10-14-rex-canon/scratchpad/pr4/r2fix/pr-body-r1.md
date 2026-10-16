Third of four stacked pull requests built by the owner's session from `rex-strength-lab/RUN-canon.md`. **Stacked on #34 (which is stacked on #33): merge #33, then #34, then this one.** This one's base is `claude/canon-3-passenger`, so the diff shows only this pull request's changes. After #34 merges, its base should move to `main`; retarget it by hand if not.

## What changed

Item 4 of `rex-strength-lab/BRIEF-canon.md`, under the rulings of 14 Oct 2026 (CLAUDE.md):
- In contests, force moves. In a contest the other's push is real, and only the push each puts on himself is absorbed.
- A charger's push back from his own hit is his own recoil, so he doesn't slow.
- Where the one he hits is held without limit, the collision has no physical answer.
- Never knocked back is a default power for each of them, with a switch each, both on by default.

**Collide, the charge.** With They take their own recoil on, the charger acts as a body of unbounded mass.
- The one hit is carried along at the charger's speed (splat) or sent off at twice it (bounce; relativistically near c). The charger's source supplies the momentum: the one hit's gain plus what holds him (his footing, or the ground's bearing from above) hands the ground over the hit.
- The hit pushes with the plush squash's own force plus that hold, for the whole squash, so the force of the hit times its time is what the source supplies (review round 1).
- The default sprint: Rex carried at 18.1 m/s. Ollie's source supplies about 55,000 kg·m/s, the hit pushes with 1.59 MN over 35 ms, and 494 kJ is freed and taken back by default. Rex slides 27.3 m once Ollie stops at the end of the squash.
- Where their powers hold the one hit without limit, the collision has no physical answer (`'paradox'`). That covers bolted on Unbreakable footing, and landed on from above with Unbreakable footing on (the jump and stomp charges). The tab explains this first, and the effort box says the lab can't judge the hit's harm: it judges only the charge and its take-off (review round 1).
- Bolted on real rock and hit from the side, the rock tears out and he is carried with a plug of rock. Landed on from above, a bolted Rex is driven in, bolts and all, and the ground's bearing holds him, as standing (review round 1).
- The hit's energy is taken back by default. It is real when the reader picks a blast preset ("when he means it").

**Collide, the steady push.** The pusher's push isn't capped by his own footing, so at the default dial Ollie drives Rex back with 890 kN, against the old dead heat. The one driven back is followed as the shoving match follows a shove-off: 37.6 m/s and 109 m all-out, so the least disruptive effort is now 5,470 kg-force. A bolted Rex on real rock is torn loose past the rock's tear load (about 697 kN) and driven back the same way (review round 1).

**Wrestle.**
- The shoving match: no push costs the pusher his grip, so two equal pushers are both shoved apart (26.6 m/s, about 57 m at the default dial). With the power on that happens at any effort. A walk-out happens only when just one push beats the other's grip. A bolted wrestler shoves the other off, and his bolts take the other's push as a pulse that shakes the ground.
- A single bolted wrestler on real rock is torn loose once the other's push passes the rock's tear load, at any strength; then only his feet hold him. At unlimited strength, the push into bolts their power holds has no physical answer, but the bolted one's own push is real and shoves the other off at just under light speed (review round 1).
- Both at once: each is shoved by the other's shove (at unlimited strength with one bolted, as above).
- The Lift tab's text is corrected.

**Arm wrestling, reading B.** Each pad (standing, each one's feet) holds the other's press. In a pin with the winner's power on, the winner's pad holds only the loser's press; the loser's pad still carries what turns his own forearm against the winner's hand. Past what the table carries, that breaks the table in the pin, as with the power off (review round 1: the build checked only the winner's pad and said a pin never breaks the table). Standing, his own footing no longer caps his own press. The brief's reading A (no pad carries anything) is physically incoherent: a real press would act on each hand with nothing holding it. The README gives the reasoning; please confirm.

**Never knocked back.**
- Two switches in Their powers, "Never knocked back: Rex" and "Never knocked back: Ollie", both on by default, with a note. Their contests (arm wrestling, every Wrestle move, Collide, the partner toss) let force move, and catches are taken back through They take their own recoil. So the switches act in one case only: a throw that reaches the catcher as a fireball or plasma in the game of catch (Things keep their form off, some air left).
- There, with the switch on, he isn't moved and its momentum goes to the endless ocean. Its motion freed as it stops at him is taken back unless meant; the heat made in the air on the way stays real.
- Old saves load with both switches on.

**Engine, page, cards, README.** Pull request 2's Known limit on Collide's bounce over-count is fixed. The Their powers card counts six powers on by default.

## Decisions for you to confirm (README section "Contests and the two Never knocked back switches")
1. **Arm wrestling, reading B** (above), including the loser's pad in a pin.
2. **The paradox cases:** bolted on Unbreakable footing, and from above with Unbreakable footing.
3. **"When he means it"** is the blast presets.
4. **How long the one hit is carried:** the lab ends the carry at the end of the squash.
5. **The shoving match's new outcome**, and that two equal bodies are always shoved apart with the power on.
6. **The fireball's energy with Never knocked back:** the motion freed at him is taken back; the air's heat stays real.
7. **The steady push's one driven back** is followed as a shove-off over the shove's stroke; the pusher pushes from where he stands.

## How it was tested

The full Rex lab line on this branch after review round 1, one test at a time: calibration 117, presence 383, shots 84 ok lines with 0 problems (its powers-off page comparison unchanged, and the pull request 4 block's 42 checks passing), powers 181/181, ladder 562/562, sweep 7,776 contexts with 0 problems. Every changed view was rendered at 390 and 1280 px, light and dark, with no sideways scroll, clipped label, broken text or page error.

**Against `main`:** every powers-off engine result is byte-identical (powers.js part 1).

**Against #34:** with every power off, every two-player result (verdict, chips, tiles, effort box and items) is the same in 109 of 112 page states (28 states at four efforts); the three are the fireball case's added note. The Collide four-cases grids have new labels covering both settings (decision 16). With They take their own recoil off, the engine's two-player results equal #34's (4,928 calls), apart from the bounce fix.

**Engine mutants:** the build's 18, re-run after review round 1, and each fails a check (one, the rock dipole kept, needed a both-bolted case below the rock's tear load in powers.js 8f, since round 1's tear fix had sent the old case down the torn branch). They include the charger slowing, the one hit not carried, the wrong source momentum, no paradox where held, a paradox where not held, the shoving match deadlocking, the steady push capped, the fireball still pushing with Never knocked back on, and the hit's energy real by default.

**Page checks:** shots.js's pull request 4 block has 42 checks. The build's 26 each fail on #34's page; review round 1's 16 each fail on the build's page (`238f570`), or, for three guarding against the review's surviving mutants, on that mutant.

**Timings:** the two-player effort search isn't noticeably slower.

**Review rounds:** three and a re-check, per `RUN-canon.md`: physics; the two-player tests; copy.
- **Round 1** (reviewed at `238f570`): 28 findings, 26 confirmed and fixed, 2 refuted (`research/reviews/canon-4-round1.json`). The majors: the carried hit's force left out the hold and capped its share; a pin never checked the loser's pad; the steady push said a bolted Rex's bolts held past his rock's tear load, and called itself harmless while driving Rex back; the paradox was called harmless; at unlimited strength with one bolted, the shoving match and Both at once said nothing moves. Each fix was reverted on its own in a scratch copy and its check seen failing.
- Rounds 2 and 3 and the re-check are next; this description and the README's review history will be updated as each closes.

## What it needs

- **Owner:** confirm or overrule decisions 1–7. Merge #33, #34, then this one, with merge commits; start CI on this branch before merging, if the session hasn't.
- **Collaborator:** the switches go in now with their note, as you asked. They act only on the plasma/fireball catch; revisit them when a test first has something hit them outside a contest.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_0136zsmhtj8TCY2T2u8SKMVX
