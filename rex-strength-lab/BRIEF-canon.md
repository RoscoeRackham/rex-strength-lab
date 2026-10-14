# Brief: the canon follow-ups (14 Oct 2026)

For the Rex lab (`rex-strength-lab/`), and for item 1 also the Build Calculator and Build Comparison. Written by the collaborator's session, 14 Oct 2026, from the canon update in pull request #25 (agreed in #26), for whichever session builds it. It plans the page work #25 listed under Waiting on. Each item says what changes, why (the canon line, quoted from CLAUDE.md), the files and functions it touches, the tests, the risks, and what changes on concrete runs. Questions only the owner can answer are marked **Q1**, **Q2**, … and collected in "Questions for the owner". Nothing here adds canon. Work in the house pattern (CLAUDE.md): research where needed, build, tests, adversarial review rounds, README.

**Where the numbers come from.** Every old and new result below is an engine run on `main` at `f57d440`, made by `research/brief-canon/runs.js` (run it from `rex-strength-lab/`; its output is saved beside it as `runs.json`). "Old" is the engine as it is. "New" changes the script's own copy of the engine to do what the item says (the body volume, where the recoil goes, Safe passenger), so it shows the size of each change before anyone builds it. The build must reproduce these figures or say why not. For item 4, "new" uses the engine's existing sums for a truly immovable body, with the momentum sent to the endless ocean.

Unless a run says otherwise: the default 10 ft Rex, on concrete, comic muscle, just standing (friction), the four default powers on, the nearest people 5 m away, and the page's default dial (100 short tons, about 90,700 kg-force). "Least disruptive" is the page's default effort; "all-out" is the whole dial. Momentum is given in kg·m/s (mass times speed); ground shaking as the ground's peak speed 5 m away, in mm/s.

## Summary

1. **Mass:** 3,000 kg each, 300 kg of it Rex's tail (was 3,007 and 307). Results move by about 0.2%, mostly below the figures the page shows.
2. **They take their own recoil:** the push back now goes into their source, not the planet. The ground no longer shakes from their own recoil.
3. **Momentum rule:** an audit of every place the engine absorbs momentum, against the canon's list. Two gaps (items 2 and 4), one borderline case, and a wrong engine comment.
4. **Never knocked back:** incoming hits don't move Rex. Collide and the two-player tests change. Ollie needs a ruling.
5. **Safe passenger on by default.** It moves the person-throw's courtesy ceiling, and exposes a gap: the lab doesn't count where a thrown person lands.
6. **The absorption shimmer:** a glow that scales with the energy taken back, on a log scale between two rungs of the energy ladder.
7. **Copy:** the "still obeys Newton" tagline and the "momentum is never absorbed" wording.
8. **Optional:** euphoria steps, flight, a just-under-sonic run on Sprint.

The proposed order of pull requests and their review rounds is at the end.

## Rules for every item

- **Powers off, nothing changes.** With every power off (the four default powers, Safe passenger, Silent strike, Soft landing), every engine result stays exactly what `main` gives for the same body. The powers-off fixture (`test/powers.js`) and the all-out baseline (`test/presence.js`) keep passing. The new canon changes only the runs with powers on, and the default mass.
- **The frozen comparisons keep the body they were written with**: 3,007 kg, volume 0.10017 × height³. How: item 1, Tests.
- **Saved pages still load.** This work adds one save marker (for example `saveV: 2`), written on every save. A save without it gets the migrations in items 1 and 5. A save with it is taken as the reader's choice.
- **Same tests, both widths.** `test/shots.js` passes at 390 and 1280 px, light and dark.
- **CI by hand.** Since #27, CI runs only when someone starts it. Each pull request here changes code or data, so start CI before merging it.

## 1. Mass: 3,000 kg each

**Canon.** "Rex: … **3,000 kg in all, 300 kg of it tail** (RT, 13 Oct 2026; replaces 2,700 kg + 307 kg measured). At the working 1,060 kg/m³ that is 2.83 m³." "Ollie: … the same mass in all (his tail is about 11 kg)."

**What changes.**
- Rex and Ollie: 3,007 → 3,000 kg each. Volume 2.84 → 2.83 m³ at 1,060 kg/m³.
- Rex's tail: 307 → 300 kg, now by ruling. The picture's 307 kg stays in the notes as the earlier measurement. Rex without his tail stays 2,700 kg (3,000 − 300, as 3,007 − 307 was).
- Ollie without his tail: 2,996 → 2,989 kg.
- The volume still follows the mass at the build density: `kV` = 3,000 ÷ 1,060 ÷ 3.048³ = 0.09995 (was 0.10017). The facing areas and soles are measured from the picture and don't change.
- The note that the ruled bodies are bigger than the picture measured (2.55 m³ for Rex, 2.53 m³ for Ollie) still holds: 11% and 12%, as before to the nearest percent.

**Where the old figure lives.** Found by searching for `3,007`, `3007`, `2,996`, `307 kg`, `2.84 m`, `0.10017`, `2.8368` and `0.8782`. The build should search again.

Rex lab:

| File | What changes |
|---|---|
| `src/engine.js` | `BUILDS.rex.kV` and `BUILDS.ollie.kV` (0.10017) and their comments (2.84 m³); `DEFAULT_BODIES` (`m: 3007`) and its comment (2,700 kg + 307 kg) |
| `src/app.html` | `DEFAULTS` reads `DEFAULT_BODIES`, so no number changes there. Add the saved-mass migration beside the existing 2,700 kg one (`if (state.m === 2700) …`): an unmarked save with 3,007 kg loads as 3,000 |
| `src/static-data.js` | the cards "Density and weight" (2.84 m³), "Rex and Ollie" (3,007 kg) and "Rex's body" (2,700 kg without his tail, plus about 307 kg, an estimate from his picture) |
| `build-data.py` | the default-body note ("10 ft and 3,007 kg each") and the comment about the 10 ft, 3,007 kg Rex who can't get up for the human feats |
| `research/final-duo.json` | `rex_ollie_picture_build` (value 3007, its display and notes; the 307 kg tail becomes the earlier measurement); `catch_hand_first_contact` (132 kg at 3,007 kg: still 132 kg) |
| `research/final-presence.json` | the facts that quote 3,007 kg or 2.84 m³: `step_rex_ollie_walking_foot_load`, `step_rex_ollie_heel_strike_estimate`, `step_elephant_match_3007kg`, `vib_rex_step_examples`, `vib_linear_strain_limit`, `elephant_ren2008_masses` (its notes), `comic_soft_landing_force`, `comic_absorb_residual_energy`, `growth_body_baseline` (2.84 → 2.83 m³; radius 0.878 → 0.877 m), `growth_worked_krakatoa`, `growth_worked_chicxulub`, `growth_worked_sun_second`, `growth_brief_number_check`, `growth_black_hole_thresholds`. Recompute each; statuses stay as they are. Keep the key `step_elephant_match_3007kg` (renaming breaks references) and say in its notes why it names the old mass |
| `README.md` | "The default bodies" (2,700 + 307 = 3,007 kg; 2.84 m³; volume 0.10017 × height³), the calibration paragraph ("the 10 ft, 3,007 kg Rex"), and Known limits ("The body mass is set by ruling (3,007 kg each)…") |
| `BRIEF-presence.md` | its worked examples use "mass ratio from 3,007 kg". It is a brief, so leave it as written and add one dated line: figures at 3,007 kg; at 3,000 kg each moves by about 0.2% |

Build Calculator (`data/builds.json` and `src/calc.js` are shared with Build Comparison; both are claimed in `STATUS.md` on `terantic/canon-followups`):

| File | What changes |
|---|---|
| `data/builds.json` | Rex's and Ollie's `weight_kg` (3007 → 3000) and its basis; their `volume` (2.84 → 2.83); Rex's tail `mass_kg_at_1060` (307 → 300) and its note ("on top of his 2,700 kg of body: 3,000 kg in all", by ruling); Ollie's tail note (part of his 3,000 kg, about 2,989 kg of body); the two notes "Mass by ruling: 3,007 kg in all". Leave `rex_ollie_picture_mass.values.mass_kg_each` (2700): it is the picture's own estimate, not canon |
| `src/calc.js` | nothing: no mass constant in it (it reads `builds.json`) |
| `README.md`, `data/NOTES.md` | the sentences with 3,007, 2,700, 307 and 2,996 kg |
| `test/test.js` | `weight_kg.value === 3007` → 3000 |

Build Comparison:

| File | What changes |
|---|---|
| `data/settings.json` | Rex's `exclude_mass` (307 → 300 kg); its basis becomes "by ruling (13 Oct 2026)" instead of "Picture measurement: tail 0.2894 m³ at 1,060 kg/m³: 307 kg"; the Rex and Ollie note (3,007 kg each; tails 307 and 11 kg) |
| `src/app.html` | the footer ("3,007 kg each in all; Rex 2,700 kg and Ollie about 2,996 kg without their tails") |
| `README.md`, `data/NOTES.md` | the same sentences. `BRIEF.md` is a brief: add a dated line rather than rewrite it |
| `test/test.js` | `rex.mass` 3007 − 307 → 3000 − 300 (2,700 either way); `ollie.mass` 3007 − 11 → 3000 − 11 (2,989). Rex's score expectations use 2,700 kg and don't move |

Rex's muscle score doesn't change: his body without the tail is 2,700 kg either way. Ollie's falls by 0.23% (2,996 → 2,989 kg).

Review records in `research/reviews/` (all three projects) keep the old figures: they are records.

**Old and new** (`runs.json`, "1 mass"):

| Run | Old (3,007 kg) | New (3,000 kg) |
|---|---|---|
| Body at 10 ft | 2.84 m³ | 2.83 m³ |
| Throw a car 30 m at 45°, least disruptive | 22,100 kg-force; 16.4 m/s | the same to 3 figures |
| The same, all-out | 30.9 m/s; lands 100 m away | the same |
| Jump 3 m, least disruptive | 23,000 kg-force | 22,900 kg-force |
| Jump all-out | 14 m up at 16.6 m/s | the same |
| Walking soft-footed: shaking 3 m away | 0.169 mm/s | 0.168 mm/s |
| Standing on both feet | 47.6 kPa | 47.4 kPa |

**Tests.**
- **Frozen comparisons stay at 3,007 kg.** `test/powers.js` part 1 (`fixtures/powers-off.json`) and `test/presence.js`'s all-out baseline (`fixtures/allout-baseline.json`) were written with 3,007 kg bodies and `kV` 0.10017. Run those parts with `P.BUILDS.rex.kV` and `P.BUILDS.ollie.kV` set back to 0.10017, then restore them. Pinning the body object alone isn't enough: `grownMakeBody` rebuilds a grown body from its build's name.
- **The page comparison** (`fixtures/page-before.json`, from `main` at `f526ce1`) can't be pinned the same way: the page builds its own bodies. It guarded pull requests A and B, both merged. Retire it in this pull request and write a new one from this pull request's own page, with the same cases and the powers off, so the later pull requests here are checked against the new mass. `test/make-page-fixture.js` needs adapting first: today it refuses any page that has the Rex + Ollie element, and its cases use the old page's `group` and `duoAction` states. Say so in the README.
- **New checks.** `DEFAULT_BODIES` is 3,000 kg each; 2.83 m³ and 1,060 kg/m³ at 10 ft; the cards quote them. In `test/calibration.js` ("cards quote the engine's default bodies"): `2.83 m³ at 10 ft`, `3,000 kg`, and `m === 3000` for both; the radius stays 88 cm. In `test/shots.js`: an unmarked save with 3,007 kg loads as 3,000; a marked save keeps a reader's 3,007.
- `test/shots.js`'s soft-landing check and `test/ladder.js`'s page comparison build a 3,007 kg Rex: use `DEFAULT_BODIES`.
- `test/presence.js` and `test/powers.js` build 3,007 kg bodies throughout. Keep them where a check compares with a frozen result. Move the checks of canon's worked growth figures to `DEFAULT_BODIES`, with recomputed expectations.
- Build Calculator and Build Comparison `test/test.js` as above. Rebuild all three `dist/index.html`.

**Interacts with.** Every later item: do this first, so their fixtures and figures are at 3,000 kg. Step 2 (paused on `terantic/step2`) edits `builds.json` too: whoever resumes it merges this first.

**Risks.**
- A wrong pin would hide a real change. The review should remove the pin and see the frozen comparisons fail.
- The tail is now a ruling, not a measurement. Build Comparison must stop calling it a "picture measurement", or the page claims a measurement it no longer uses.

## 2. They take their own recoil: into their source

**Canon.** "*They take their own recoil* (RT A7): the push back from their own moves goes into their source, not into the planet, so they stay planted and the ground isn't shoved." And: "Momentum: absorbed in the cases listed here and nowhere else: their own recoil, …". Before #25, the push went "through their feet into the planet, as if bolted … the ground still shakes from it".

**What changes.** With the power on they still stay planted after their own moves: no slide, no lurch, no hop. That part doesn't change. What changes is where the push goes. The momentum their feet used to hand the planet now goes to the endless ocean. So:
- **Nothing of their recoil reaches the ground**: no shaking from it and no "push into the ground" figure. Unbreakable footing's weak-ground cap no longer applies to it, because there is nothing for the ground to bear.
- **The energy taken back is about zero.** They don't move, and the endless ocean takes the momentum without motion. That matters for the shimmer (item 6).
- **The move itself still reaches the world**: the object's flight and landing, the stomp's foot on the ground, the pulled load.
- With the power off, today's physics: friction footing; with Unbreakable footing on, the ground takes what his footing hands it.

**Every place recoil goes into the planet today** (engine, `src/engine.js`):

| Move | Function | Today, power on | New |
|---|---|---|---|
| Throw | `throwOnce` (`ownAnchor`, the `toGround` block) | his footing acts bolted; the ground takes the object's momentum (`toGround`), capped by `weakGround` when Unbreakable footing is on | no `toGround` when `ownRecoil` is on; report the momentum taken back instead (for example `recoilAbsorbed`) |
| Throw's shaking | `RESTRAINT.MOVES.throw.shake`, `.shakeFrom` | the larger of his push and the landing | the landing only |
| Punch | `punchOnce` | footing bolted; no net push reaches the ground (the arm's stop hands it back) | the same numbers; only the wording changes |
| Stomp | `stompOnce` (`bolted` when `ownRecoil`) | the upward push on his body goes through his standing foot into the planet. The shaking counts only the foot's blow, called an upper bound because the standing foot's pull partly cancels it | the foot's blow stays: it is the move. The upward push goes to his source, so nothing cancels the blow and the "upper bound" caveat goes |
| Pull | `pull` (`ownLimit`, `ropeT`); `MOVES.pull.shake` (`shakeWithPower: 'ownRecoil'`) | the rope's pull back goes through his feet (or bolts) into the planet and shakes the ground | to his source: no shaking. Drop `MOVES.pull.shake` and `shakeWithPower`; Pull then has no shaking source at all, and says why, as Punch does |
| Shove | `shoveOnce` (`toGround`) | the shover's feet hand the ground his push | nothing from the shover. The bolted partner's bolts (`toGroundB`) stay; see item 4 |
| Wrestle throw | `throwPartner` (through `throwObject`) | the thrower's push into the ground | none; the partner's landing (`landToGround`) stays |
| Game of catch, thrower | `CATCHGAME.leg` (`pushT`, `toGroundT`), `throwPushJ`, `easyPush`, `recoilOf` | the thrower's push into the ground, every throw | none |
| Partner toss | `CATCHGAME.tossPartner` (`toGroundT`) | his push as he tosses Ollie up | none. His catch (`toGroundC`) follows **Q5** |
| Arm wrestle | `armWrestle` (`toGround`) | not covered by the power today. A quick pin leaves no net push, because the swing's push back and the slam cancel | the pin is the winner's own move, so its push back goes to his source. Then nothing cancels the slam's blow on the table, and with Unbreakable footing it reaches the ground whole at any swing time. This follows from the canon; confirm it in review |
| Collide | `COLLIDE.chargeSpeed` | the charger's take-off is the move itself | unchanged. The hit is item 4 (and **Q4**) |
| Weak ground | `weakGround` (sideways, "as if bolted, their recoil taken: the planet takes it") | used wherever a recoil push reached the ground | keep it for catches, landings and a bolted body; drop the recoil case |

**Every page sentence that sends recoil into the planet** (`src/app.html` unless named):
- Throw (`bayThrow`): "His recoil goes into the planet, so he isn't shoved back"; the chip "His recoil goes into the planet: their power"; the item "…that push goes through his feet into the planet, as if he were bolted…".
- Stomp (`bayStomp`): the chip; the item "…goes through his standing foot into the planet"; the math line "…whose push back goes into the planet".
- Punch (`bayPunch`): the chip and the item.
- Pull (`bayPull`, `pullNoShake`): the chip "The load's pull back goes into the planet: their power"; the item; "The rope's pull back goes through his feet into the planet over the pull…"; the bolted line ("Bolted, the rope's pull back goes through his bolts into the planet…").
- Wrestle (`wrestleShove`, `wrestleThrow`): the chips and items.
- Catch (`bayCatch`, `catchPartner`): "…goes through Rex's feet into the planet…".
- Their powers: the switch's hint (`#sw-recoil`).
- `duoFacts`: with the power on, drop the thrower's and shover's push from `shake` and the harm text "the push through the shover's / thrower's feet shakes the ground…". The catcher's line follows **Q5**.
- The effort box (`effortReadout`, `offBy`): credit They take their own recoil with the plaster hazard where the same move with the power off cracks plaster from him. Today it is credited only with the slide.
- Cards (`src/static-data.js`): "The courtesy ceiling and the not-so-heroic presets" (the rope's pull "into the planet over the pull, and that shaking counts"), "Their powers" ("the planet keeps the momentum, and the ground still shakes"), and "Newton's third law stays on" (item 7).
- README: the intro's description of the power; Known limits: the hazard paragraph ("Pull without They take their own recoil (with it, … into the planet …)"), the paragraph "With Unbreakable footing and They take their own recoil both off…", and "They take their own recoil covers…".

**What the shaking and hazard results become.**
- Throw: only the landing shakes the ground. For most throws that land, the landing shook it more anyway, so the plaster reach, the courtesy ceiling and the presets don't move. A throw that never comes down (it leaves the Earth, orbits, or ends in a fireball) now shakes nothing.
- Stomp, punch, clap, jump, sprint: unchanged.
- Pull: no ground shaking.
- Shove and the game of catch: the shover's or thrower's push no longer counts in the two-player effort search. Their other harms (the partner's slide, the landing, the boom) stay.
- The recoil-slide hazard is already off with the power on. Unchanged.

**Old and new** (`runs.json`, "2 recoil"):

| Run | Old: into the planet | New: into their source |
|---|---|---|
| Throw a car 30 m, least disruptive (22,100 kg-force) | his push puts 22,000 kg·m/s into the ground: 0.43 mm/s 5 m away. The landing: 1.2 mm/s. No hazard | his push: nothing. The landing: 1.2 mm/s. No hazard |
| The same throw, all-out | his push 2.0 mm/s; the landing 6.4 mm/s; plaster may crack out to 2.3 m (from the landing) | his push: nothing. The rest is unchanged |
| All-out at a 10¹² kg dial: the car leaves the Earth at 105 km/s | the ground takes 9.9 × 10⁷ kg·m/s sideways; their power supplies another 9.9 × 10⁷ downward (the weak-ground rule); plaster may crack out to 3.6 km | no ground shaking at all. The courtesy ceiling (plaster, from the landing, at 209,000 kg-force) and every preset are unchanged |
| A bus thrown 1 km straight up, 10⁹ kg dial, least disruptive (588,000 kg-force, held at the ceiling) | his push 11 mm/s; the landing 13 mm/s | his push: nothing. The ceiling stays at 590,000 kg-force: the landing set it |
| Rex shoves Ollie | Ollie flies off at 21 m/s and slides 37 m. Rex's feet hand the ground 66,800 kg·m/s: 2.3 mm/s, enough to rattle windows (our estimate: from 1 mm/s) | the same shove. Nothing from Rex's feet |
| Game of catch, a fastball 10 m apart, 10⁹ kg dial (thrown at 22 km/s) | the thrower's push 3,250 kg·m/s: 0.92 mm/s | nothing from the thrower. The catcher's stop (0.28 mm/s) follows **Q5** |
| Pull a car, all-out | the rope's pull: 0.005 mm/s | nothing |

**Tests to change.**
- `test/powers.js`, section 5 (5d). These change: "…and its push goes into the planet…" and "on concrete that push alone shakes the ground…" (now no `toGround`, no shaking from his push, and the momentum taken back equals the object's momentum); "a bolted pull … shakes the ground" and "a pull with it on … shakes the ground" (now no shaking); "with only They take their own recoil on, the shove hands the ground his push" (now none); the partner toss's "the toss's push … go into the ground" (now only the catch, per **Q5**); "the catch thrower's push into the ground matches the Throw tab's" and "a catch throw that becomes a fireball still pushes the ground" (now none). These stay: no slide, no lurch, no hop; the All-Star baseball doesn't move Rex; the stomp-launch is unchanged; the clap, jump and sprint are unchanged.
- `test/powers.js`, the round 4 and round 5 weak-ground checks. The throw checks that run with `ownRecoil: true` (for example the car on sand at 30°) move to Unbreakable footing alone (`ownRecoil: false`), where his footing's push still reaches the ground. The checks already at `ownRecoil: false` stay.
- `test/presence.js` runs with the powers off, so its recoil checks (the bus-on-ice slide hazard, the locomotive's boom from his recoil) don't change.
- New: the momentum ledger (item 3), for each move with the power on and off.
- `test/shots.js`: no recoil "into the planet" on any tab or card; Pull says why it has no shaking.
- Mutants for the review: put the push back into the ground in one move at a time; each must fail a check.

**Interacts with.** Item 3 (this closes the audit's first gap). Item 4: the charger's push back in Collide (**Q4**) and the shoved partner. Item 6: recoil adds almost no energy to the shimmer. Item 7: the copy. Unbreakable footing: its weak-ground cap now matters for recoil only with this power off. Bolted to the planet: unchanged, still the setting for being pushed by someone else.

**Risks.**
- The courtesy ceiling rises wherever his push set it. In every run above the landing set it, but the review should look for a case where his push did (a far throw on soft ground, say) and check the page's figures.
- The arm-wrestle change (the slam no longer cancelled) is a reading of the canon. Confirm it in review.

## 3. The momentum rule: an audit

**Canon.** "Momentum: absorbed in the cases listed here and nowhere else: their own recoil, the air's drag on what they throw, the ground's share it can't bear, the lift from growth, and incoming hits (he is never knocked back, RT 5.1)."

**Method.** Every place the engine changes a momentum without passing it on was read. The search covered `supplied`, `ocean`, `Pocean`, `toGround`, `ownAnchor`, `immovable` and `bolted`, and the runs above checked the cases that matter. The pull request turns this reading into a ledger test (below).

| Path | Where | What it does | Against the list |
|---|---|---|---|
| Air resistance absorbed | `fly`, `CATCHGAME.flyTo` (`out.ocean.P`) | the share of the drag taken back goes to the endless ocean | listed: the air's drag on what they throw |
| Weak ground, downward | `weakGround` (`suppliedDown`); the jump's `pushOff`; the stomp's `blow` cap; Collide's `toGround.supplied`; the thrown partner's `landToGround`; `instantGrowth`'s `toGround` | the ground takes its bearing over the pulse; their power supplies the rest | listed: the ground's share it can't bear |
| Weak ground, sideways | `weakGround` (`suppliedSide`) | standing on friction, the ground takes at most its friction on what it bears; their power supplies the rest | listed, read as the same share sideways |
| A push with no push time | the jump's `pushOff` with `T = 0` (comic mode at unlimited strength), and any capped push with no time | the ground takes none; their power supplies all of it, unbounded | borderline. A push in no time is one no ground can bear, so it fits "the ground's share it can't bear". **Q9** |
| Growth lift | `instantGrowth` (`Pocean`) | the lift the ground's push would give him goes to the endless ocean | listed |
| Their own recoil | item 2's table | goes into the planet | **not absorbed where the list says it is**: item 2 |
| Incoming hits | `COLLIDE.collide`; `shoveOnce`; the catch (`relCatch`, `catchIt`) | a hit moves him, or goes through his feet or bolts into the planet | **not absorbed where the list says it is**: item 4 |
| The air's drag on what they hold | — | no move carries or swings a held load fast enough for drag to matter (Pull ignores the load's drag) | nothing to do |
| Soft landing, Silent strike, the sheath catch (Things keep their form), Safe passenger | `jumpOnce`; `MOVES.punch.blast`, `MOVES.clap.blast`; `relCatch`; `PASSENGER` | energy only; the momentum still reaches the ground or the catcher | consistent |
| Truly immovable (Collide's thought experiment) | `headOn` with infinite mass | infinite inertia takes the momentum without moving | not one of their powers, and labelled a thought experiment. Item 4 reuses its sums |
| Comic ground (retired switch, kept for the tests) | `holdsGround` | the ground takes any push, into the planet | not absorption |

**Findings.**
1. Their own recoil is not absorbed: item 2.
2. Incoming hits are not absorbed: item 4.
3. The push with no push time is borderline: **Q9**.
4. The comment above `PASSENGER` in `src/engine.js` ("Momentum is never absorbed.") and the README's "an exception to 'momentum is never absorbed'" are wrong now: item 7.
5. A tension inside the canon, not in the engine. The Growth line says "absorption cancels his own pull on everything he doesn't mean to affect". If his pull on a thing is cancelled but its pull on him isn't, momentum isn't kept, and that case isn't on the list (**Q10**). The engine doesn't model the cancellation yet.

**The ledger test (new, in `test/powers.js`).** For each move (a throw at 0°, 45° and 90°, a stomp, punch, clap, jump, pull, shove, the wrestle throw, a catch leg, a Collide splat and bounce, instant growth), at three dials, with the powers on and off, add up the momentum along each axis: the object, his body, what the ground takes, and what the endless ocean takes (the air's share, the supplied push, the growth lift, the recoil, a hit). The total must be zero to a part in a million. With the powers off the ocean's share is zero; with them on, every share in the ocean is one of the five on the list. Where the engine doesn't report a figure the ledger needs (a direction, a split), add it.

**Old and new.**
- Least-disruptive car throw. Old: the ledger closes with the planet taking his 22,000 kg·m/s of recoil, and nothing in the ocean. New: 22,000 kg·m/s in the ocean (recoil), nothing in the ground.
- All-out car throw at a 10¹² kg dial. Old: 9.9 × 10⁷ kg·m/s in the ground and 9.9 × 10⁷ in the ocean (weak ground). New: all of his push in the ocean (recoil), nothing in the ground.
- The comic jump at unlimited strength: the ground takes none and the ocean all of it, unbounded, both old and new, pending **Q9**.

## 4. Never knocked back

**Canon.** "Momentum: absorbed in the cases listed here …: … and incoming hits (he is never knocked back, RT 5.1)." This is in Rex's canon. Ollie's isn't ruled (**Q1**).

**What changes for Rex.** When something hits Rex, he doesn't move, and the hit's momentum goes to the endless ocean: not into his feet, the ground or his bolts. The charger meets him as he would meet a truly immovable body, and the engine already has those sums (`headOn` with infinite mass):
- In a splat the charger stops dead. In a bounce he comes straight back at the speed he arrived, and Rex takes twice his momentum.
- After the hit: no slide and no sink, no push into the ground from the hit (so no shaking from it), no load on the rock around his bolts, no "bolts too late", and no change to the Earth's spin.
- The hit's energy. In a splat, all of the charger's energy of motion is freed at the contact, as against a truly immovable body. A body that can be knocked back frees less. For equal masses it is twice what the page shows now. Whether that energy is real or absorbed (showing only as his shimmer) is **Q3**.
- What counts as an incoming hit is **Q2**. This plan covers the Collide charge for certain and lists the rest.

**Engine.** In `COLLIDE.collide`, a holder option (for example `noKnockback`, per character, so Ollie's follows **Q1**). It takes the immovable branch's sums (`headOn` with infinite mass, `held = true`). It reports the momentum taken (`out.absorbed = { P }`: p in a splat, 2p in a bounce) instead of `out.earth`, `out.toGround`, `out.rock`, `out.bolts` and the motion in `out.after`. `standoff`, `shoveOnce`, `pushMatch`, `throwPartner`, `liftPartner`, `armWrestle` and the catch follow **Q2**. Keep "Truly immovable" as the thought experiment it is (infinite inertia, nothing to do with their powers). With Rex as the holder it now gives the same motion, so the page should say so, or offer it only for Ollie (**Q1**).

**Page.** The verdicts in `collideCharge` and `collidePush` ("…doesn't budge… the blow goes through … into the ground"); the items "Momentum is never lost…" and "'Immovable' only means what holds … in place…"; the Collide footing lines. In `duoFacts` for Collide, the harms "the hit, carried into the ground, shakes it…" and "one of them slides…" go when Rex is the one hit; `models.shake` keeps only the charger's take-off.

**The two-player effort search.** With Rex unmoved, the harms left in an Ollie-into-Rex charge are the charge breaking the sound barrier, the hit's air blast (**Q3**) and Ollie's take-off shaking the ground. The rattle and plaster presets may become unreachable there. The page must say so, as the solo tabs do.

**Old and new** (`runs.json`, "4 collide"; Ollie charges Rex):

| Run | Old | New: Rex never knocked back |
|---|---|---|
| Ollie sprints into Rex, splat, default dial. Ollie arrives at 18 m/s (his run-up and grip set the speed, not the dial) | Rex is knocked back; they slide 7.0 m together, starting at 9.0 m/s. His footing hands the ground 615 kg·m/s. The splat frees 250 kJ | Rex doesn't move. Ollie stops dead. 54,600 kg·m/s goes to the endless ocean. The splat frees 495 kJ, real or absorbed (**Q3**) |
| The same, bounce | Ollie stops; Rex flies off at 18 m/s and slides 27 m | Ollie comes back at 18 m/s. Rex takes 109,000 kg·m/s |
| Ollie jumps onto Rex, splat, 10⁹ kg dial. He lands at 287 m/s; Unbreakable footing holds Rex | the ground takes 95,700 kg·m/s through Rex's feet and their power supplies the other 766,000. Plaster may crack out to 7.7 m. 124 MJ freed | nothing of the hit reaches the ground (Ollie's take-off still does). 862,000 kg·m/s to the endless ocean. 124 MJ freed |
| All-out: a set speed of 0.1% of light speed (300 km/s), splat | they leave together at 150 km/s and slide 15.7 km. 68 TJ freed (about the Hiroshima bomb) | Rex doesn't move. 9.0 × 10⁸ kg·m/s to the endless ocean. 135 TJ freed (about twice the Hiroshima bomb) |
| The same, bounce | Ollie stops; Rex flies off at 300 km/s and slides 9.2 km | Ollie comes back at 300 km/s. Rex takes 1.8 × 10⁹ kg·m/s |

**Options for Ollie (Q1).** Listed, not chosen.
- **A. The same as Rex: never knocked back.** Symmetric with "as strong, tough and big as Rex", and the canon calls Ollie "pure absorption". The one being hit in Collide then never moves, whoever charges. If pushes count as hits (**Q2**), the shove, the shoving match's walk-out and the standing arm-wrestle drag can't move either of them. And if a charger's push back counts as his own recoil (**Q4**), a charge into Ollie has no physical answer: both keep their momentum.
- **B. Real physics for Ollie, as today.** Rex charging into Ollie is unchanged; Ollie charging into Rex follows the table above. Asymmetric.
- **C. A per-character switch, "Never knocked back", in Their powers next to Bolted.** Rex's is on by canon; Ollie's default is your ruling. A reader can still run today's contest. It costs one more control and a saved-state key.

**Tests.** `test/powers.js`, a new section: with the option on, the holder in Collide never moves (splat and bounce, every charge source, bolted or not, Unbreakable footing on or off); the momentum taken is p in a splat and 2p in a bounce; the hit puts nothing into the ground; in a splat the energy freed equals the charger's energy of motion. With it off, every result as now (the powers-off identity, and today's 5d check "Collide unchanged"). The two-player presets say when they are out of reach. `test/shots.js`: the Collide verdicts and items.

**Interacts with.** Item 2 (**Q4**, the charger's push back). Item 3 (this closes the audit's second gap). Item 6 (an absorbed hit is the largest shimmer source, **Q3**). Bolted to the planet (redundant for Rex when he is hit; still the setting for Ollie under option B). Unbreakable footing (its Collide `toGround` path goes for Rex as the holder).

**Risks.**
- Doubling the energy freed in a splat lowers Collide's least disruptive effort wherever the blast sets it, if **Q3** says the energy is real.
- The two-player tests can take 2–3 s already. The new branches must not slow them.

## 5. Safe passenger on by default

**Canon.** "*Safe passenger* (RT 4.2): someone he throws or catches feels a manageable force unless he knows they can take it." It is listed under Default powers: "On unless they choose otherwise".

**What changes.**
- On by default (`DEFAULTS.safePassenger: true`). The switch moves from the "Material limit suspended" heading to the default powers in Their powers. The summary line lists it with them.
- **Saved states.** Every save stores `safePassenger`, false by default until now, so the key alone can't tell an old default from a choice. Use the save marker: an unmarked save loads with it on.
- **"Unless he knows they can take it."** Only the person object is a passenger (`passenger=True` in `build-data.py`). Ollie, thrown or caught, never is. That is already so.
- **The engine doesn't change.** `MOVES.throw.passenger` and the page's `catchPassengerG` already skip the launch and the catch when the switch is on. They still judge the air's drag in flight against the held 1.5 g limit, times the share of the drag that acts. At the default 100% Air resistance absorbed there is no drag, so by default the passenger hazard never fires.
- **Copy.** The switch says the launch "puts no load on them; they float as if falling". The canon says "a manageable force". Say they feel the push, spread through them, within the ride limits.
- **The effort box** credits Safe passenger where the same throw with it off presses the person past the ride limits.

**The effort search and the courtesy ceiling.** For a thrown person, the passenger hazard set the ceiling at a few hundred kg-force. With Safe passenger on, the ceiling moves to the next hazard: the shaking from the person's landing, then the boom.

**Old and new** (`runs.json`, "5 safe passenger"; a person thrown 30 m at 45°):

| | Old: off | New: on |
|---|---|---|
| Least disruptive | held at 333 kg-force: the person goes 3.0 m (the 30 m goal is out of reach without harm) | 3,350 kg-force: the person goes 30 m, released at 16 m/s |
| Courtesy ceiling | 335 kg-force, set by the person's g-force | 27,000 kg-force, set by plaster cracking (from the person's landing) |
| All-out | 81 m/s; lands 670 m away; the launch is past the ride limits | the same throw; the launch no longer counts |
| All four powers off | ceiling 335 kg-force (the launch) | ceiling 39,800 kg-force (air drag past 1.5 g in flight, which Safe passenger doesn't cover) |

**Risk, and a question (Q8).** The lab doesn't count where a thrown person lands ("The landing is a fall unless someone catches them, and the lab doesn't count it"). With Safe passenger on by default, the least disruptive throw of a person lands them at 18 m/s, like a fall of about 16 m, and the page would call it harmless. The canon also says "he never kills" (Bystanders). There are three ways out: Safe passenger covers the landing too (canon); the lab counts the landing as a hazard (research first: a sourced fall-injury threshold); or a person's goal becomes a catch. Until one is chosen, the person throw must say plainly that the landing isn't covered.

**Tests.** `test/shots.js`: a fresh page has Safe passenger on; an unmarked old save with it off loads with it on; a marked save with it off keeps it off; the person throw's least effort and ceiling move as in the table. `test/presence.js`'s Safe passenger checks (the launch hazard removed, the drag kept) stay.

**Interacts with.** Air resistance absorbed (the drag on a person below 100%). The game of catch with a person. Item 7 (copy). **Q8**.

## 6. The absorption shimmer

**Canon.** "*Where absorbed energy goes* (RT 2, 4.4): back into the store of infinite power they draw on ('a drop in an endless ocean'). It shows: his eyes, feather tips and mouth-glow shimmer in proportion to what he takes in (a flicker for a car crash, a blinding flare for a planet-scale hit). His glow is gently warm, never scalding."

**Proposal.**
- **Engine: one tally per run**, for example `RESTRAINT.absorbedEnergy(move, r, o)`: the energy taken back in that run, by part. The parts: the air's drag on what he throws (but see the risk below); what Unbreakable footing takes back to keep the ground whole (the stomp's `absorbed`, and the jump's where real ground would have taken energy); Soft landing (`landing.absorbed`); Silent strike (the blast energy it takes: a punch's or clap's energy past Mach 1); an incoming hit, if absorbed (**Q3**); and the energy the growth what-ifs turn into mass (**Q6**). Momentum taken back without motion (his recoil, the weak ground's supplied push) carries almost no energy and adds nothing.
- **Page: a "Shimmer" tile** on each tab whose run takes energy back. It has a swatch with a warm CSS glow whose strength follows the level, a word for the level, the energy, and its ladder comparison (`src/ladder.js`). It is not drawn over the art, because the art is the owner's (CLAUDE.md); the glow sits beside it unless you say otherwise (**Q6**).
- **The level** runs on a log scale between the canon's two anchors. A linear scale would make a car crash 10⁻²⁶ of a planet-scale flare, which is invisible. Both anchors are ladder rungs with sourced facts:
  - a flicker: a car crash, the rung `energy_corolla_100kmh_kinetic` (a Toyota Corolla at 100 km/h, 517 kJ);
  - a blinding flare: a planet-scale hit. Either `energy_chicxulub_impact` (the asteroid that killed the dinosaurs, 5 × 10²³ J, a rough rung) or `energy_earth_gravitational_binding` (the energy to blow Earth apart, 2.5 × 10³² J). **Q6**.
  - Below a flicker: nothing visible, or a faint flicker down to some floor (**Q6**). Above the flare: the flare. It doesn't grow brighter, because the canon gives no step past it.
- **Named steps** at a quarter, a half and three quarters of the log span, each beside its nearest rung:

| Level | Flare at the dinosaur-killer | Flare at blowing Earth apart |
|---|---|---|
| flicker | 517 kJ: a car crash | 517 kJ: a car crash |
| faint glow (¼) | about 2 × 10¹⁰ J: a loaded A380 at cruising speed | about 2 × 10¹² J: the Beirut explosion (a rough rung) |
| glow (½) | about 5 × 10¹⁴ J: between the Hiroshima bomb and the Chelyabinsk meteor | about 1 × 10¹⁹ J: an average hurricane's heat for a day (a rough rung) |
| bright (¾) | about 2 × 10¹⁹ J: an average hurricane's heat for a day (a rough rung) | about 5 × 10²⁵ J: between a year of sunlight on Earth and the Sun's output for a second |
| blinding flare | 5 × 10²³ J | 2.5 × 10³² J |

- **"Gently warm, never scalding":** the glow is never a heat hazard. The tile's note says so once.

**Old and new.** The page shows no shimmer today. New (`runs.json`, "6 shimmer"; level from 0, a flicker, to 1, the flare):

| Run | Energy taken back | Level (flare at the dinosaur-killer / at Earth) |
|---|---|---|
| Throw a car 30 m, least disruptive | about 42 kJ of drag | below a flicker |
| The same, all-out | 0.47 MJ of drag | just under a flicker |
| Stomp all-out (Unbreakable footing keeps the concrete whole) | 0.10 MJ | below a flicker |
| Stomp all-out at a 10⁹ kg dial | 1.1 GJ | 0.19 / 0.13: between a flicker and a faint glow |
| Ollie hits Rex at 0.1% of light speed, if the hit is absorbed (**Q3**) | 135 TJ | 0.47 / 0.32: about a glow / a faint glow |

**Risk: which drag figure.** The lab's tally for Air resistance absorbed is the drag the air would have taken along the path the object actually flies, drag-free. A drag-free object keeps its speed, so the tally can far exceed the object's own energy. A car thrown all-out at a 10⁹ kg dial carries 7.3 GJ, but the tally is 2.5 TJ. Fed to the shimmer, that would make a car throw glow like a nuclear test. Use instead what real air would have taken from that throw (the Throw tab's `dragLoss0`, at most the object's energy). That is a decision for review, not canon.

**Tests.** The anchors and steps come from the ladder facts by key, with no copied numbers. The tile appears only when energy is taken back. The level never falls as the energy rises. The swatch has a text alternative. Both themes; no sideways scroll at 390 px.

**Interacts with.** Items 2 and 4 (recoil adds nothing; an absorbed hit adds the most). Air resistance absorbed, Unbreakable footing, Soft landing, Silent strike. The growth what-ifs (**Q6**).

## 7. Copy

**Canon.** The momentum list above; and "Absorption follows **knowledge × intention**".

| Where | Now | Change |
|---|---|---|
| The header's eyebrow (`src/app.html`) | "Indestructible · never tires · still obeys Newton" | No longer true: their recoil and incoming hits are absorbed. The new wording is yours (**Q7**). Plain options, not canon: "Indestructible · never tires · unlimited"; "Indestructible · never tires · takes back what he doesn't mean" |
| `suppliedText` (`src/app.html`) | "(canon: an exception to 'momentum is never absorbed'; it goes to the endless ocean)" | "(canon: one of the few cases where momentum is absorbed; it goes to the endless ocean)" |
| `src/engine.js`, the comment above `PASSENGER` | "Momentum is never absorbed." | the canon's list |
| The card "Newton's third law stays on" (`src/static-data.js`) | "Every push pushes him back. …" | retitle (for example "Newton's third law, except where they take it back") and list where momentum goes to the endless ocean |
| Collide's items (`collideCharge`) | "Momentum is never lost…"; "'Immovable' only means what holds … in place…" | rewrite for a Rex who is never knocked back (item 4) |
| Recoil "into the planet" | about 20 page sentences, two cards, the switch's hint, the README | item 2's list |
| README | the intro's description of the powers; Known limits: "an exception to 'momentum is never absorbed'" (under Unbreakable footing and Growth) | as above |

Briefs (`BRIEF-gui.md`, `BRIEF-presence.md`) and review records keep their wording: they are records.

**Old and new.** No numbers change; only the words above.

**Tests.** `test/shots.js`: no "still obeys Newton", no "momentum is never absorbed", and no recoil "into the planet" on any tab or card.

## 8. Optional (separate; not in the order of work)

| Item | Canon | What it takes | Size | Worth doing now? |
|---|---|---|---|---|
| Euphoria steps, and a 0–100 euphoria score on the Weight tab | "Under rising load, each new ×10 past his best is one strain, breakthrough and euphoria cycle, and he chooses to triple his mass; breadth ramps up to strong by the Sun-mass step and caps at 2× his height, after which growth goes into density." And "Strain and euphoria (RT 6.5, 10.6, 10.7, 13.5)" | A load ladder on the Weight tab in ×10 steps, with his mass tripling each step and the breadth ramp and cap, tied to the growth forms. The score's definition is in Rex Theoreticals, not CLAUDE.md, so that text is needed first (**Q11**). No run is possible: the engine has none of it | Large | Not yet. It is character more than physics, and it needs the score's definition |
| Flight | "flies as a 'flying brick', from a hover up to faster than light" | A Fly tab: hover, cruise, the air's heating and booms (the Sprint and Throw air models), and what pushes him. A flying brick pushes on nothing, so its momentum comes from somewhere the canon's list doesn't name (**Q11**). Faster than light breaks the lab's relativity (nothing passes light speed). No run is possible | Large to very large | Not until **Q11**. The lab's air and blast models would carry much of it |
| A just-under-sonic default on Sprint | "default run just under the speed of sound, unlimited when he pushes" | Today (`runs.json`, "8 sprint"): at the default dial his legs cap him at 61 m/s; on friction he tops out at about 81 m/s on concrete (74 m/s on granite) at any strength, where his grip balances the air's drag. A run just under the speed of sound (330 m/s, say; the number is yours, **Q11**) needs about 2,600 tonnes-force on the dial and a grip only their power gives (the weak-ground exception, sideways). It also needs a footfall model for running, because Sprint has no ground-shaking model, and a 3-tonne body at 330 m/s should show one | Medium | Worth doing after items 1–5: it makes the default run the canon's |

## Questions for the owner

- **Q1. Ollie and hits** (item 4). Is Ollie never knocked back too (A), real physics as today (B), or a per-character switch with your default (C)?
- **Q2. What counts as an incoming hit** (item 4)? Collide's charge only, or also: a static push (Collide's push reading), a shove, the shoving match, being lifted or thrown by Ollie, a caught object, a thrown partner landing on him?
- **Q3. The hit's freed energy** (items 4 and 6). Is it real (heat, sound and blast near him), or absorbed by default and real only when he means it (knowledge × intention)? For equal masses, never being knocked back doubles it in a splat: at 0.1% of light speed, 68 TJ becomes 135 TJ.
- **Q4. The charger's push back** (items 2 and 4). When Rex charges, is the hit's push back on him his own recoil (to his source, so he doesn't slow down) or real (he stops or bounces)? If his recoil is absorbed and the one he hits is never knocked back, a charge has no physical answer.
- **Q5. A catch** (items 2 and 4). Is the catcher's stop absorbed (as his own move's push back, or as an incoming hit), so he is never carried off and nothing goes into the ground? Or is it real, as today: the ground takes the stop, and a fast enough throw carries him off (at a 10²⁰ kg dial, at 3,980 km/s)?
- **Q6. The shimmer** (item 6). (a) Which planet-scale anchor: the dinosaur-killer or blowing Earth apart? (b) Below a car crash: nothing, or a faint flicker? (c) In the growth what-ifs, does he still shimmer when the energy becomes mass? (d) May the glow be drawn over the art, or only beside it?
- **Q7. The tagline** (item 7).
- **Q8. Safe passenger and the landing** (item 5). Does it cover where a thrown person lands, or should the lab count the landing, or make a person's goal a catch? And does it cover the air's drag on them when Air resistance absorbed is below 100%?
- **Q9. A push with no push time** (item 3). In comic mode at unlimited strength, the ground takes none of it and their power supplies all of it, unbounded. Is that "the ground's share it can't bear"?
- **Q10. Cancelling his own pull** (item 3). If absorption cancels his gravity on things he doesn't mean to affect, momentum isn't kept. Is that a sixth case on the momentum list, or does it work some other way?
- **Q11. The optional items** (item 8): the euphoria score's definition; where a flying brick's momentum goes, and whether faster than light is in the lab; the number for "just under the speed of sound".

## Other canon in #25 that this plan doesn't cover

Each needs its own decision before it becomes work.

| Canon | The lab today | Note |
|---|---|---|
| Knowledge × intention (RT 2, 4, 10.3): "a consequence Rex foresees and doesn't want is absorbed" | absorption happens only through the named switches; the courtesy ceiling and presets assume harm happens unless a power stops it | Under this canon, harm he foresees and doesn't want wouldn't happen, and a preset is what he means. That changes what the courtesy ceiling means |
| Bystanders (RT 4.3, 10.4): he never kills; harm stays short of permanent; people can be knocked off their feet | the presets go up to "flatten the houses next door" and "level a block" without saying whether people are there | Decide how the presets present people (and see **Q8**) |
| The floor (RT 7.2, 7.4): never smaller or less dense than his standard build | Rex's height box goes down to 0.1 m and his density slider to 10 kg/m³ (the calibration body is a separate body) | Clamp Rex's controls at the floor, or label lower values as not Rex |
| Never collapses (RT 7): "Up to black-hole density and at any size he warps space like a black hole but never collapses" | the two-player tests return `blackHole` and stop; the Weight tab has black-hole outcomes | Review those outcomes |
| Cancelling his own pull (Growth) | not modelled | **Q10** |
| "At kaiju sizes his footsteps always cause minor quakes" | the Walk tab scales the step with size | Check at kaiju sizes |
| Things keep their form: a thrown thing falls back into real physics when it hits something comparable or larger, unless going through it is the point (RT 13.2); whatever a lifted thing was attached to tears normally (RT 5.5); grip has no size limit (RT 5.4) | no thrown-object collisions besides the landing (deferred in `BRIEF-gui.md`); the Lift tab's grip works through palm contact | The deferred collision work now has canon to follow |
| Unbreakable footing: "Landings leave a claw print or a few cracks, not a crater" | a print in soil; hard ground held only where it would break by the hazard's rule (a hole of 1 cm or more) | A copy check, and maybe "a few cracks" on hard ground |
| Body (RT 9): four clawed fingers and a thumb, three clawed toes, a tail as strong as his arms, unlimited bite | the footprint and grip models don't use these; the tail is not a limb | — |
| Ollie and Rex "share one infinite source: alone, Rex is pure radiance and Ollie pure absorption" | — | May bear on **Q1** |

## Order of pull requests and review rounds

Each pull request records its review rounds in `research/reviews/` (for example `canon-1-round1.json`), counts a finding only once it is reproduced with code, updates the README's review history and known limits, and has CI started by hand before it merges. After each merge the owner rebuilds and republishes. A long run ends with a `history/` entry.

| Order | Pull request | Depends on | Review rounds |
|---|---|---|---|
| 1 | **Mass** (item 1), all three projects | the claim on `builds.json` and `calc.js` (held on `terantic/canon-followups`) | Two. Data and claims: every figure that quotes the mass, in all three projects, against the canon and the research. Code and tests: the pinned comparisons (remove the pin and see them fail), the migration, the rebuilt `dist` files |
| 2 | **Recoil into their source** (item 2), with item 3's ledger test and the recoil copy from item 7 | 1 | Three and a re-check, as for pull request B. Physics: each move's momentum, the ledger. Code and tests: mutants that put the push back into the ground one move at a time. Copy and layout |
| 3 | **Safe passenger by default** (item 5) | 1; **Q8** only for the landing's text | One or two: claims and layout; code and the migration |
| 4 | **Never knocked back** (item 4) | 2; **Q1**–**Q5** | Three and a re-check. Physics of the hit and the two-player tests. Code and tests, including the two-player search's time. Copy |
| 5 | **The shimmer** (item 6) | 4 (for an absorbed hit); **Q6** | Two. Design, copy and accessibility. Code and data, including the drag figure |
| 6 | **The tagline and the remaining copy** (item 7) | **Q7**; can ride with 4 or 5 | One: copy |

The optional items (section 8) each need their own brief, after **Q11**.
