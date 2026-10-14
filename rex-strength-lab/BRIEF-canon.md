# Brief: the canon follow-ups (14 Oct 2026)

For the Rex lab (`rex-strength-lab/`), and for item 1 also the Build Calculator and Build Comparison. Written by the collaborator's session, 14 Oct 2026, from the canon update in pull request #25 (agreed in #26), for whichever session builds it. It plans the page work #25 listed under Waiting on. Each item says what changes, why (the canon line, quoted from CLAUDE.md), the files and functions it touches, the tests, the risks, and what changes on concrete runs. The questions the plan couldn't answer alone are marked **Q1**, **Q2**, …. The collaborator answered them on 14 Oct 2026 (see "Answers"), and the items below follow those answers. The answers that are canon are also recorded in CLAUDE.md, marked "owner to confirm". Nothing else here adds canon. Work in the house pattern (CLAUDE.md): research where needed, build, tests, adversarial review rounds, README.

**Where the numbers come from.** Every old and new result below is an engine run on `main` at `f57d440`, made by `research/brief-canon/runs.js` (run it from `rex-strength-lab/`; its output is saved beside it as `runs.json`). "Old" is the engine as it is. "New" changes the script's own copy of the engine to do what the item says (the body volume, where the recoil goes, Safe passenger), so it shows the size of each change before anyone builds it. The build must reproduce these figures or say why not. For item 4, "new" uses the engine's existing sums for a truly immovable body, with the momentum sent to the endless ocean.

Unless a run says otherwise: the default 10 ft Rex, on concrete, comic muscle, just standing (friction), the four default powers on, the nearest people 5 m away, and the page's default dial (100 short tons, about 90,700 kg-force). "Least disruptive" is the page's default effort; "all-out" is the whole dial. Momentum is given in kg·m/s (mass times speed); ground shaking as the ground's peak speed 5 m away, in mm/s.

## Summary

1. **Mass:** 3,000 kg each, 300 kg of it Rex's tail (was 3,007 and 307). Results move by about 0.2%, mostly below the figures the page shows.
2. **They take their own recoil:** the push back now goes into their source, not the planet. The ground no longer shakes from their own recoil.
3. **Momentum rule:** an audit of every place the engine absorbs momentum, against the canon's list. Two gaps (items 2 and 4) and a wrong engine comment.
4. **Never knocked back, and contests:** every Rex + Ollie test is a contest, where force moves: the other's push is real and only each one's own push back is absorbed. A charger doesn't slow, so he carries the one he hits along; a hit's energy is absorbed unless he means it. Never knocked back itself acts on no test the page has yet.
5. **Safe passenger on by default**, now covering the landing and the air's drag too. It moves the person-throw's courtesy ceiling.
6. **The absorption shimmer:** a glow that scales with the energy taken back, on a log scale from a car crash to the dinosaur-killer, drawn on his eyes, feather tips and mouth.
7. **Copy:** the tagline becomes "Indestructible · never tires · unlimited"; the "momentum is never absorbed" wording goes.
8. **Optional:** euphoria steps, flight, a default run of 339 m/s on Sprint.

The proposed order of pull requests and their review rounds is at the end.

## Rules for every item

- **Powers off, nothing changes.** With every power off (the four default powers, Safe passenger, Never knocked back, Silent strike, Soft landing), every engine result stays exactly what `main` gives for the same body. The powers-off fixture (`test/powers.js`) and the all-out baseline (`test/presence.js`) keep passing. The new canon changes only the runs with powers on, and the default mass.
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
| Partner toss | `CATCHGAME.tossPartner` (`toGroundT`, `toGroundC`) | his push as he tosses Ollie up; with Unbreakable footing, his catch | none: the catch's stop is his own push back too (**Q5**) |
| Game of catch, catcher | `CATCHGAME.leg` (`toGroundC`), `catchIt`, `relCatch` | with Unbreakable footing, the catcher's stop goes into the ground; past about 1% of light speed he can be carried off | his stop is his own push back: it goes to his source, so nothing goes into the ground and he is never carried off (**Q5**). With the power off, today's physics |
| Arm wrestle | `armWrestle` (`toGround`) | not covered by the power today. A quick pin leaves no net push, because the swing's push back and the slam cancel | the pin is the winner's own move, so its push back goes to his source. Then nothing cancels the slam's blow on the table, and with Unbreakable footing it reaches the ground whole at any swing time. **Q12** confirms it: in arm wrestling only each one's own push back is absorbed |
| Collide | `COLLIDE.chargeSpeed` | the charger's take-off is the move itself | the take-off is unchanged. The hit's push back on the charger is his own recoil too (**Q4**): item 4 |
| Weak ground | `weakGround` (sideways, "as if bolted, their recoil taken: the planet takes it") | used wherever a recoil push reached the ground | keep it for catches, landings and a bolted body; drop the recoil case |

**Every page sentence that sends recoil into the planet** (`src/app.html` unless named):
- Throw (`bayThrow`): "His recoil goes into the planet, so he isn't shoved back"; the chip "His recoil goes into the planet: their power"; the item "…that push goes through his feet into the planet, as if he were bolted…".
- Stomp (`bayStomp`): the chip; the item "…goes through his standing foot into the planet"; the math line "…whose push back goes into the planet".
- Punch (`bayPunch`): the chip and the item.
- Pull (`bayPull`, `pullNoShake`): the chip "The load's pull back goes into the planet: their power"; the item; "The rope's pull back goes through his feet into the planet over the pull…"; the bolted line ("Bolted, the rope's pull back goes through his bolts into the planet…").
- Wrestle (`wrestleShove`, `wrestleThrow`): the chips and items.
- Catch (`bayCatch`, `catchPartner`): "…goes through Rex's feet into the planet…".
- Their powers: the switch's hint (`#sw-recoil`).
- `duoFacts`: with the power on, drop the thrower's and shover's push from `shake` and the harm text "the push through the shover's / thrower's feet shakes the ground…". The catcher's stop is his own push back too (**Q5**), so his line goes.
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
| Game of catch, a fastball 10 m apart, 10⁹ kg dial (thrown at 22 km/s) | the thrower's push 3,250 kg·m/s: 0.92 mm/s | nothing from the thrower, and nothing from the catcher either: his stop (0.28 mm/s today) is absorbed (**Q5**) |
| Pull a car, all-out | the rope's pull: 0.005 mm/s | nothing |

**Tests to change.**
- `test/powers.js`, section 5 (5d). These change: "…and its push goes into the planet…" and "on concrete that push alone shakes the ground…" (now no `toGround`, no shaking from his push, and the momentum taken back equals the object's momentum); "a bolted pull … shakes the ground" and "a pull with it on … shakes the ground" (now no shaking); "with only They take their own recoil on, the shove hands the ground his push" (now none); the partner toss's "the toss's push … go into the ground" (now none: his catch is absorbed too, **Q5**); "the catch thrower's push into the ground matches the Throw tab's" and "a catch throw that becomes a fireball still pushes the ground" (now none). These stay: no slide, no lurch, no hop; the All-Star baseball doesn't move Rex; the stomp-launch is unchanged; the clap, jump and sprint are unchanged.
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
| A push with no push time | the jump's `pushOff` with `T = 0` (comic mode at unlimited strength), and any capped push with no time | the ground takes none; their power supplies all of it, unbounded | listed: a push in no time is one no ground can bear, so it is the ground's share it can't bear (**Q9**: yes) |
| Growth lift | `instantGrowth` (`Pocean`) | the lift the ground's push would give him goes to the endless ocean | listed |
| Their own recoil | item 2's table | goes into the planet | **not absorbed where the list says it is**: item 2 |
| Incoming hits | `COLLIDE.collide`; `shoveOnce`; the catch (`relCatch`, `catchIt`) | a hit moves him, or goes through his feet or bolts into the planet | every hit in the lab is part of a contest (**Q13**, **Q14**), where the other's push is real; what the canon absorbs there is each one's own push back, the catcher's (item 2) and the charger's (item 4). **Not absorbed today** |
| The air's drag on what they hold | — | no move carries or swings a held load fast enough for drag to matter (Pull ignores the load's drag) | nothing to do |
| Soft landing, Silent strike, the sheath catch (Things keep their form), Safe passenger | `jumpOnce`; `MOVES.punch.blast`, `MOVES.clap.blast`; `relCatch`; `PASSENGER` | energy only; the momentum still reaches the ground or the catcher | consistent |
| Truly immovable (Collide's thought experiment) | `headOn` with infinite mass | infinite inertia takes the momentum without moving | not one of their powers, and labelled a thought experiment. Item 4 reuses its sums |
| Comic ground (retired switch, kept for the tests) | `holdsGround` | the ground takes any push, into the planet | not absorption |

**Findings.**
1. Their own recoil is not absorbed: item 2.
2. Incoming hits: every one in the lab is part of a contest, so what must be absorbed is each one's own push back, the catcher's (item 2) and the charger's (item 4). Neither is absorbed today.
3. The push with no push time is within the list (**Q9**: yes). Nothing to change.
4. The comment above `PASSENGER` in `src/engine.js` ("Momentum is never absorbed.") and the README's "an exception to 'momentum is never absorbed'" are wrong now: item 7.
5. Cancelling his own pull (the Growth line: "absorption cancels his own pull on everything he doesn't mean to affect") cancels it both ways, so momentum is kept and the list needs no new case (**Q10**: B). The engine doesn't model the cancellation yet.
6. Flight is now canon with its own momentum case: a flying brick's push goes to the endless ocean (**Q11**). That is a sixth case on the list, recorded in CLAUDE.md. The lab has no flight yet (item 8), so the engine has nothing to check.

**The ledger test (new, in `test/powers.js`).** For each move (a throw at 0°, 45° and 90°, a stomp, punch, clap, jump, pull, shove, the wrestle throw, a catch leg, a Collide splat and bounce, instant growth), at three dials, with the powers on and off, add up the momentum along each axis: the object, his body, what the ground takes, and what the endless ocean takes (the air's share, the supplied push, the growth lift, the recoil, a hit). The total must be zero to a part in a million. With the powers off the ocean's share is zero; with them on, every share in the ocean is one of the cases on the list. Where the engine doesn't report a figure the ledger needs (a direction, a split), add it.

**Old and new.**
- Least-disruptive car throw. Old: the ledger closes with the planet taking his 22,000 kg·m/s of recoil, and nothing in the ocean. New: 22,000 kg·m/s in the ocean (recoil), nothing in the ground.
- All-out car throw at a 10¹² kg dial. Old: 9.9 × 10⁷ kg·m/s in the ground and 9.9 × 10⁷ in the ocean (weak ground). New: all of his push in the ocean (recoil), nothing in the ground.
- The comic jump at unlimited strength: the ground takes none and the ocean all of it, unbounded, both old and new (**Q9**: within the list).

## 4. Never knocked back, and contests

**Canon.** "Momentum: absorbed in the cases listed here …: … and incoming hits (he is never knocked back, RT 5.1)." And the rulings of 14 Oct 2026 (collaborator, answering this brief; owner to confirm; recorded in CLAUDE.md):
- Never knocked back is a power for each of them, with a switch each, both on by default (**Q1**). Incoming hits are a charge, a steady push, a shove, the shoving match, being lifted or thrown by the other, a caught object, and a partner landing on him (**Q2**).
- In contests, force moves, so Never knocked back is set aside. Contests are every Rex + Ollie test: arm wrestling, every Wrestle move, Collide's charge and steady push, and the partner toss (**Q12**, **Q13**, **Q14**).
- In a contest the other's push is real. Only the push each puts on himself is absorbed: his own recoil (**Q12**, **Q15**).
- A charger's push back from his own hit is his own recoil, so he doesn't slow (**Q4**).
- A hit's freed energy is absorbed by default, and real only when he means it (**Q3**).
- A catch is absorbed, unless he chooses otherwise (**Q5**).

**What this leaves for Never knocked back.** Every test in the Rex + Ollie element is a contest. A catch is absorbed anyway, because the catcher's stop is the push back of his own push (They take their own recoil, item 2). So no test the page has today has anything hit them that Never knocked back would stop. **Q1** asked for a switch each, but a switch that changes nothing on any tab would puzzle readers. Proposal, which needs your yes because it holds back part of Q1's answer: say in the "Their powers" card that in their contests they let force move and nothing else in the lab hits them yet, and add the two switches with the first test they change (for example the deferred collisions of thrown objects).

**What changes in the contests.** Each one's own push back goes to his source (item 2's rule, applied to every contest move). The other's push on him is real.

| Test | Today (powers on) | New |
|---|---|---|
| Arm wrestle | the pin, and the drag once the table breaks; the presses load the table through each one's elbow pad and peg | see "Arm wrestling" below |
| Wrestle, the shove | the shover stays put (his recoil goes into the planet); Ollie flies off at 21 m/s and slides 37 m | the same, with nothing from the shover's feet into the ground (item 2) |
| Wrestle, the shoving match | each pushes with what his walking grip gives and holds with his footing; two equal bodies deadlock | no push costs the pusher his grip, so each pushes with the effort he uses, and each is held only by his footing against the other's push. At the default dial a push (up to 890,000 N) is about 50 times either one's grip on concrete (17,700 N), so two equal pushers both get shoved apart and the match ends. A new outcome (for example `bothShoved`); one walks the other out only when just one push beats the other's grip |
| Wrestle, lift and throw | he lifts and throws his partner | the same; the thrower's push back goes to his source (item 2). Holding the partner up is not counted as recoil: the partner's weight still rests on the ground through the lifter, as on the Lift tab (a reading; confirm in review) |
| Collide, the charge | the one hit is held by his footing or bolts, or knocked back; the charger stops or bounces as physics says | the charger doesn't slow: he acts as a body of unbounded mass at his own speed. The one hit, on his footing, is carried along at the charger's speed (splat) or sent off at twice it (bounce; by relativistic velocity addition near light speed), and the charger's source supplies the momentum. Where their powers hold the one hit without limit (Bolted on Unbreakable footing, or landed on from above, where Unbreakable footing's weak-ground rule supplies whatever the ground can't bear), the charger can't slow and the one hit can't move: the collision has no physical answer, and the page says so (the outcome `'paradox'`) |
| Collide, the steady push | the pusher pushes up to what his footing holds; the one pushed holds with his | the pusher's push isn't capped by his own footing (its push back goes to his source); the one pushed holds with his footing, or his bolts and the rock around them, as today |
| Catch, the partner toss | Rex tosses Ollie up and catches him | the same; the toss's push and the catch's stop are Rex's own push back, so nothing goes into the ground (item 2) |
| Catch, an object | the catcher's stop goes into the ground; at a 10²⁰ kg dial he is carried off at 3,980 km/s | his stop's push back goes to his source (item 2): never carried off, nothing into the ground (**Q5**). With They take their own recoil off ("unless he chooses otherwise"), today's physics |

So the default Collide gives an answer for a sprint or a set speed (Rex is carried along), and the paradox for the jump and stomp charges (Rex landed on from above, held up by Unbreakable footing) and for a bolted Rex.

**Arm wrestling (Q12).** Never knocked back would make it a deadlock, and the point is two forces against each other: each means to tip the other. So the other's push on him is real, and the only absorption is the push each puts on himself. This plan reads that as follows; confirm it in review:
- The pin and, once the table is gone, the drag stay as today: the stronger tips the other.
- Each one's own push back goes to his source, so it no longer loads the table through his elbow pad and peg. The table then carries only the forearms' slam, and can't tear apart from the presses or from the pin's load on the winner's pad. (That only shows with Things keep their form off: with it on the table never breaks anyway.)
- Standing, once the table is gone, each one's footing no longer caps his own press; the loser's footing still resists being dragged, because the winner's push on him is real.
- The pin's slam reaches the ground whole at any swing time (item 2).

**The hit's energy (Q3).** In a splat, the energy the hit frees is absorbed by default and shows only as his shimmer (item 6). It is real only when he means it. On the page, that is when the reader picks a not-so-heroic preset whose hazard is the blast (rattle by air, the windows, the houses, a block), the way "break the ground" sets Unbreakable footing aside. That mapping is this plan's reading of "when he means it"; confirm it in review.

**Engine.**
- `COLLIDE.collide`: a charger with `ownRecoil` is a body of unbounded mass at his speed. `headOn` handles an infinite target and an infinite momentum today, but not this. In the charger's frame the one hit arrives at the charger's speed and meets an immovable body, so the immovable sums apply with the roles swapped (that is how `runs.js` works out the table below). Report the momentum the charger's source supplies. Where the one hit is held without limit, return `'paradox'`.
- `standoff`: with `ownRecoil`, the pusher's push isn't capped by his own footing.
- `pushMatch`: with `ownRecoil`, no walking-grip cap on the drive; each is held by his footing against the other's push; the new outcome.
- `armWrestle`: as in "Arm wrestling" above.
- `liftPartner`, `throwPartner`, `shoveOnce`, `CATCHGAME.tossPartner` and the catch: item 2's rule.
- Never knocked back: nothing in the engine until a test needs it (above).

**Page.** The Collide verdicts for the carried-along and paradox outcomes; the items "Momentum is never lost…" (the charger's source now supplies momentum) and "'Immovable' only means what holds … in place…"; the shoving match's new outcome and its item "A shoving match is decided at the feet…"; in `duoFacts`, the harms for both sliding in the shoving match and for the one hit carried along in Collide. The "Truly immovable" thought experiment stays as it is.

**The two-player effort search.** Bodies move in the contests again, so the slide harm ("one of them slides past the nearest people") stays, now with both sliding in the shoving match and the one hit carried at the charger's speed in Collide. The hit's energy is absorbed by default, so its air blast counts only with a blast preset.

**Old and new** (`runs.json`, "4 collide" and "4 collide after Q13"; Ollie charges Rex, the defaults on):

| Run | Old | New |
|---|---|---|
| Ollie sprints into Rex, splat, default dial. Ollie arrives at 18 m/s (his run-up and grip set the speed, not the dial) | Rex is knocked back; they slide 7.0 m together, starting at 9.0 m/s. His footing hands the ground 615 kg·m/s. The splat frees 250 kJ | Ollie doesn't slow. Rex is carried along at 18 m/s, and Ollie's source supplies 54,600 kg·m/s. The splat frees 495 kJ, absorbed by default |
| The same, bounce | Ollie stops; Rex flies off at 18 m/s and slides 27 m | Rex flies off at 36 m/s; Ollie's source supplies 109,000 kg·m/s |
| Ollie jumps onto Rex, 10⁹ kg dial. He lands at 287 m/s; Unbreakable footing holds Rex | the ground takes 95,700 kg·m/s through Rex's feet and their power supplies the other 766,000. Plaster may crack out to 7.7 m. 124 MJ freed | the paradox: Ollie can't slow and Rex can't sink |
| All-out: a set speed of 0.1% of light speed (300 km/s), splat | they leave together at 150 km/s and slide 15.7 km. 68 TJ freed (about the Hiroshima bomb) | Rex is carried along at 300 km/s; Ollie's source supplies 9.0 × 10⁸ kg·m/s. 135 TJ freed (about twice the Hiroshima bomb), absorbed by default |
| The same, bounce | Ollie stops; Rex flies off at 300 km/s and slides 9.2 km | Rex flies off at 600 km/s; Ollie's source supplies 1.8 × 10⁹ kg·m/s |

With They take their own recoil off, every row is today's physics.

**Tests.** `test/powers.js`, a new section:
- a charger with his recoil taken keeps his speed; the one hit, on his footing, leaves at the charger's speed (splat) or about twice it (bounce), and the charger's source supplies exactly the momentum the one hit gains;
- `'paradox'` where the one hit is held without limit (bolted on Unbreakable footing; landed on from above with it on);
- the shoving match's new outcome at the default dial, and the walk-out where only one push beats the other's grip;
- the steady push, uncapped by the pusher's own footing;
- arm wrestling as above;
- with They take their own recoil off, every result as now.

`test/shots.js`: the Collide and Wrestle verdicts with the power on and off.

**Interacts with.** Item 2 (the same rule, in contests; the catches now come under item 2). Item 3 (every hit in the lab is part of a contest, so the audit's second gap closes through each one's own push back, not through Never knocked back). Item 6 (the hit's energy). Bolted to the planet and Unbreakable footing (they make the paradox cases).

**Risks.**
- The paradox is the default for the jump and stomp charges. Readers may take it for a broken page, so the Collide tab must explain it first.
- Readings to confirm in review: "when he means it" as the blast presets; holding a partner up not counted as recoil; the shoving match's new outcome; the paradox cases; the arm-wrestling consequences.
- The two-player tests can take 2–3 s already. The new branches must not slow them.

## 5. Safe passenger on by default

**Canon.** "*Safe passenger* (RT 4.2): someone he throws or catches feels a manageable force unless he knows they can take it." It is listed under Default powers: "On unless they choose otherwise". And the ruling of 14 Oct 2026 (collaborator; owner to confirm; recorded in CLAUDE.md): Safe passenger also covers where the person lands, and the air's drag on them (**Q8**: a 1, b yes).

**What changes.**
- On by default (`DEFAULTS.safePassenger: true`). The switch moves from the "Material limit suspended" heading to the default powers in Their powers. The summary line lists it with them.
- **Saved states.** Every save stores `safePassenger`, false by default until now, so the key alone can't tell an old default from a choice. Use the save marker: an unmarked save loads with it on.
- **"Unless he knows they can take it."** Only the person object is a passenger (`passenger=True` in `build-data.py`). Ollie, thrown or caught, never is: the two of them are covered by item 4 instead. That is already so.
- **The engine changes a little.** `MOVES.throw.passenger` and the page's `catchPassengerG` already skip the launch and the catch while the switch is on. Now they skip the air's drag in flight too, so with Safe passenger on the passenger hazard never fires.
- **The landing.** With the switch on, the person comes down unharmed. The landing's momentum still reaches the ground, so its shaking stays real (it is what now sets the person throw's ceiling). Its energy, the harm a fall would do, is taken back, as Soft landing does for his own landings, and counts in the shimmer (item 6). That split (momentum real, energy taken back) is this plan's reading of "covers the landing"; confirm it in review. With the switch off, the landing stays a fall the lab doesn't judge, as today, and the page says so.
- **Copy.** The switch says the launch "puts no load on them; they float as if falling". The canon says "a manageable force". Say they feel a manageable push, spread through them, at the launch, in the air and when they land.
- **The effort box** credits Safe passenger where the same throw with it off presses the person past the ride limits.

**Why the landing matters.** At the new least-disruptive effort (below), the person lands at 18 m/s, like a fall of about 16 m. Before this ruling the page would have called that harmless without covering it.

**The effort search and the courtesy ceiling.** For a thrown person, the passenger hazard set the ceiling at a few hundred kg-force. With Safe passenger on, the ceiling moves to the next hazard: the shaking from the person's landing, then the boom.

**Old and new** (`runs.json`, "5 safe passenger"; a person thrown 30 m at 45°):

| | Old: off | New: on |
|---|---|---|
| Least disruptive | held at 333 kg-force: the person goes 3.0 m (the 30 m goal is out of reach without harm) | 3,350 kg-force: the person goes 30 m, released at 16 m/s, and lands unharmed |
| Courtesy ceiling | 335 kg-force, set by the person's g-force | 27,000 kg-force, set by plaster cracking (from the person's landing) |
| All-out | 81 m/s; lands 670 m away; the launch is past the ride limits | the same throw; the launch, the drag and the landing no longer count as harm to the person |
| All four powers off | ceiling 335 kg-force (the launch) | no ceiling: nothing harms anyone 5 m away even all-out (plaster may crack only within 1.4 m of where the person lands) |

**Tests.** `test/shots.js`: a fresh page has Safe passenger on; an unmarked old save with it off loads with it on; a marked save with it off keeps it off; the person throw's least effort and ceiling move as in the table; the landing's text with the switch on and off. `test/presence.js`: the check "all-out, the air drag on them is past the held limit too, and Safe passenger can't take that away" turns round (now it does take it away); the launch check stays. `test/powers.js` or `test/presence.js`, new: with the switch on, a thrown person's landing energy is taken back and its momentum still reaches the ground.

**Interacts with.** Air resistance absorbed (with the drag covered, the slider no longer matters for a person's safety). The game of catch with a person. Item 6 (the landing's energy is shimmer). Item 7 (copy).

## 6. The absorption shimmer

**Canon.** "*Where absorbed energy goes* (RT 2, 4.4): back into the store of infinite power they draw on ('a drop in an endless ocean'). It shows: his eyes, feather tips and mouth-glow shimmer in proportion to what he takes in (a flicker for a car crash, a blinding flare for a planet-scale hit). His glow is gently warm, never scalding." And the rulings of 14 Oct 2026 (collaborator; owner to confirm; recorded in CLAUDE.md): the planet-scale hit is the dinosaur-killer; below a car crash he still shows a faint flicker; he shimmers in the growth what-ifs too (**Q6**: a 1, b 2, c yes). The glow may be drawn over the art (**Q6** d); the art is the owner's, so the owner confirms that one.

**Proposal.**
- **Engine: one tally per run**, for example `RESTRAINT.absorbedEnergy(move, r, o)`: the energy taken back in that run, by part. The parts: the air's drag on what he throws (but see the risk below); what Unbreakable footing takes back to keep the ground whole (the stomp's `absorbed`, and the jump's where real ground would have taken energy); Soft landing (`landing.absorbed`); Silent strike (the blast energy it takes: a punch's or clap's energy past Mach 1); a hit's freed energy, which is absorbed by default (item 4); a thrown person's landing with Safe passenger on (item 5); and, in the growth what-ifs, the energy that becomes mass. Momentum taken back without motion (his recoil, the weak ground's supplied push, a hit's momentum) carries almost no energy and adds nothing.
- **On the art.** A warm glow drawn over his eyes, feather tips and mouth on the header picture (`assets/dino.jpg`) and the Collide picture (`assets/art-unstoppable.jpg`, where his eyes already glow), as a CSS layer positioned on those features. The image files stay untouched; the positions are measured from the pictures and kept with them. The glow's strength follows the level.
- **A "Shimmer" tile** beside the results on each tab whose run takes energy back: a word for the level, the energy, and its ladder comparison (`src/ladder.js`). The tile carries the numbers and is what a screen reader hears; the glow on the art is decoration.
- **The level** runs on a log scale between the canon's two anchors. A linear scale would make a car crash 10⁻¹⁸ of the flare, which is invisible. Both anchors are ladder rungs with sourced facts:
  - a flicker: a car crash, the rung `energy_corolla_100kmh_kinetic` (a Toyota Corolla at 100 km/h, 517 kJ);
  - a blinding flare: the dinosaur-killer, the rung `energy_chicxulub_impact` (5 × 10²³ J). It is a rough rung (uncertain by more than 2×), so the page says "about" for the flare and the steps near it.
  - Below a flicker: a faint flicker, fading to nothing at a floor. Proposal (a design choice for review, not canon): the floor is the rung `energy_usain_bolt_top_speed` (Usain Bolt at top speed, 7.3 kJ), about 70 times below a car crash.
  - Above the flare: the flare. It doesn't grow brighter, because the canon gives no step past it.
- **Named steps** at a quarter, a half and three quarters of the log span, each beside its nearest rung:

| Level | Energy | The nearest rung |
|---|---|---|
| faint flicker | 7.3 kJ to 517 kJ | Usain Bolt at top speed, up to a car crash |
| flicker | 517 kJ | a car crash (a Corolla at 100 km/h) |
| faint glow (¼) | about 2 × 10¹⁰ J | a loaded A380 at cruising speed |
| glow (½) | about 5 × 10¹⁴ J | between the Hiroshima bomb and the Chelyabinsk meteor |
| bright (¾) | about 2 × 10¹⁹ J | an average hurricane's heat for a day (a rough rung) |
| blinding flare | about 5 × 10²³ J | the asteroid that killed the dinosaurs (a rough rung) |

- **"Gently warm, never scalding":** the glow is never a heat hazard. The tile's note says so once.

**Old and new.** The page shows no shimmer today. New (`runs.json`, "6 shimmer"; level from 0, a flicker, to 1, the flare):

| Run | Energy taken back | Level |
|---|---|---|
| Throw a car 30 m, least disruptive | about 42 kJ of drag | a faint flicker |
| The same, all-out | 0.47 MJ of drag | a faint flicker, just under a flicker |
| Stomp all-out (Unbreakable footing keeps the concrete whole) | 0.10 MJ | a faint flicker |
| Stomp all-out at a 10⁹ kg dial | 1.1 GJ | 0.19: between a flicker and a faint glow |
| Ollie charges Rex at 0.1% of light speed (the defaults: Rex is carried along and the hit's energy is absorbed, item 4) | 135 TJ | 0.47: about a glow |

**Risk: which drag figure.** The lab's tally for Air resistance absorbed is the drag the air would have taken along the path the object actually flies, drag-free. A drag-free object keeps its speed, so the tally can far exceed the object's own energy. A car thrown all-out at a 10⁹ kg dial carries 7.3 GJ, but the tally is 2.5 TJ. Fed to the shimmer, that would make a car throw glow like a nuclear test. Use instead what real air would have taken from that throw (the Throw tab's `dragLoss0`, at most the object's energy). That is a decision for review, not canon.

**Tests.** The anchors, the floor and the steps come from the ladder facts by key, with no copied numbers. The tile appears only when energy is taken back. The level never falls as the energy rises. The glow sits on the features at both widths (screenshots). The tile is read by screen readers; the glow layer is hidden from them. Both themes; no sideways scroll at 390 px.

**Interacts with.** Items 2 and 4 (recoil and a hit's momentum add nothing; a hit's energy adds the most). Item 5 (a person's landing). Air resistance absorbed, Unbreakable footing, Soft landing, Silent strike. The growth what-ifs.

## 7. Copy

**Canon.** The momentum list above; and "Absorption follows **knowledge × intention**".

| Where | Now | Change |
|---|---|---|
| The header's eyebrow (`src/app.html`) | "Indestructible · never tires · still obeys Newton" | "Indestructible · never tires · unlimited" (**Q7**: A). The old line is no longer true: their recoil and incoming hits are absorbed |
| `suppliedText` (`src/app.html`) | "(canon: an exception to 'momentum is never absorbed'; it goes to the endless ocean)" | "(canon: one of the few cases where momentum is absorbed; it goes to the endless ocean)" |
| `src/engine.js`, the comment above `PASSENGER` | "Momentum is never absorbed." | the canon's list |
| The card "Newton's third law stays on" (`src/static-data.js`) | "Every push pushes him back. …" | retitle (for example "Newton's third law, except where they take it back") and list where momentum goes to the endless ocean |
| Collide's items (`collideCharge`) | "Momentum is never lost…"; "'Immovable' only means what holds … in place…" | rewrite for Never knocked back and the paradox (item 4) |
| Recoil "into the planet" | about 20 page sentences, two cards, the switch's hint, the README | item 2's list |
| README | the intro's description of the powers; Known limits: "an exception to 'momentum is never absorbed'" (under Unbreakable footing and Growth) | as above |

Briefs (`BRIEF-gui.md`, `BRIEF-presence.md`) and review records keep their wording: they are records.

**Old and new.** No numbers change; only the words above.

**Tests.** `test/shots.js`: no "still obeys Newton", no "momentum is never absorbed", and no recoil "into the planet" on any tab or card.

## 8. Optional (separate; not in the order of work)

| Item | Canon | What it takes | Size | Worth doing now? |
|---|---|---|---|---|
| Euphoria steps, and a 0–100 euphoria score on the Weight tab | "Under rising load, each new ×10 past his best is one strain, breakthrough and euphoria cycle, and he chooses to triple his mass; breadth ramps up to strong by the Sun-mass step and caps at 2× his height, after which growth goes into density." "Strain and euphoria (RT 6.5, 10.6, 10.7, 13.5)". The score (**Q11**): 0 is his normal state; 100 is "utterly mad with power" | A load ladder on the Weight tab in ×10 steps, with his mass tripling each step and the breadth ramp and cap, tied to the growth forms; and the score. The canon gives the score's two ends, not the rule between them (how far one cycle moves it, and whether it falls back), so that item's own brief proposes a rule for the owner to confirm. No run is possible: the engine has none of it | Large | Not yet. It is character more than physics |
| Flight | "flies as a 'flying brick', from a hover up to faster than light". Ruled (**Q11**): its push goes to the endless ocean; flight is unlimited, so faster than light is in | A Fly tab: hover, cruise, the air's heating and booms (the Sprint and Throw air models), with his push going to the endless ocean (a sixth case on the momentum list). Faster than light is beyond the lab's physics, which gets every speed from momentum, so nothing passes light speed. The page can work out everything up to light speed, then say plainly that past it he leaves physics behind (no numbers past it). No run is possible | Large | After items 1–5. The lab's air and blast models would carry the part below light speed |
| A default run of 339 m/s on Sprint | "default run just under the speed of sound, unlimited when he pushes". Ruled (**Q11**): 339 m/s, just under the 340.29 m/s the lab uses for sea level | Today (`runs.json`, "8 sprint"): at the page's default dial his legs cap him at 61 m/s; on friction he tops out at about 81 m/s on concrete (74 m/s on granite) at any strength, where his grip balances the air's drag. 339 m/s needs about 2,700 tonnes-force on the dial and a grip only their power gives (the weak-ground exception, sideways). So the canon's default run is out of reach at the page's default dial: either Sprint says so at that dial, or the default dial rises (a decision for that brief). It also needs a footfall model for running: Sprint has no ground-shaking model, and a 3-tonne body at 339 m/s should show one | Medium | Worth doing after items 1–5: it makes the default run the canon's |

## Answers

The collaborator answered on 14 Oct 2026. The answers that are canon are recorded in CLAUDE.md, marked "owner to confirm".

| Question | Answer | What it means for the plan |
|---|---|---|
| **Q1.** Is Ollie never knocked back too? | C, on by default | A switch each, both on by default. Since every two-player test is a contest (**Q13**, **Q14**), the switches would change nothing on the page yet: item 4 proposes adding them with the first test they affect (needs your yes) |
| **Q2.** What counts as an incoming hit? | All of them: a charge, a steady push, a shove, the shoving match, being lifted or thrown by the other, a caught object, a partner landing on him | In contests these are set aside (**Q12**–**Q15**); what's left on the page is catches, absorbed through item 2 |
| **Q3.** The hit's freed energy | B: absorbed by default, real only when he means it | It is shimmer (item 6). This plan reads "when he means it" as the blast presets (item 4); confirm in review |
| **Q4.** The charger's push back | B: his own recoil, so he doesn't slow | A charger with They take their own recoil on acts as a body of unbounded mass: he carries the one he hits along, and meets a paradox only where their powers hold the one hit without limit (item 4) |
| **Q5.** A catch | A: absorbed, unless Rex chooses otherwise | Never carried off, nothing into the ground: the catcher's stop is his own push back (item 2). "Unless he chooses otherwise" is They take their own recoil turned off |
| **Q6.** The shimmer | (a) the dinosaur-killer; (b) a faint flicker below a car crash; (c) yes, in the growth what-ifs too; (d) yes, it may be drawn over the art | Item 6. The floor of the faint flicker is a proposal (7.3 kJ); drawing on the art needs the owner's yes, since the art is the owner's |
| **Q7.** The tagline | A: "Indestructible · never tires · unlimited" | Item 7; it ships with pull request 2 |
| **Q8.** Safe passenger and the landing | (a) Safe passenger covers the landing; (b) and the air's drag | Item 5. The landing's momentum stays real and its energy is taken back: a reading; confirm in review |
| **Q9.** A push with no push time | Yes: the ground's share it can't bear | Nothing to change (item 3) |
| **Q10.** Cancelling his own pull | B: both ways, so momentum is kept | No new case on the list; the engine doesn't model it yet (item 3, "Other canon") |
| **Q11.** The optional items | Euphoria: 0 is his normal state, 100 "utterly mad with power". Flight: its push goes to the endless ocean; unlimited, so faster than light. The default run: 339 m/s | Item 8. Flight adds a sixth case to the momentum list (CLAUDE.md) |
| **Q12.** Arm wrestling | Never knocked back doesn't apply: it would make a deadlock, and both mean to tip the other. The only absorption is the push each puts on himself | Item 4's arm-wrestling paragraph (the table no longer carries their presses; standing, a press isn't capped by his own footing). Readings; confirm in review |
| **Q13.** The Wrestle contests | Contests should let force move in general | Never knocked back is set aside in every Wrestle move (item 4) |
| **Q14.** Which other tests are contests | Collide's charge and steady push, and the partner toss | Every Rex + Ollie test is a contest; only catches of objects are left, and item 2 absorbs those |
| **Q15.** Own push back in contests | The arm-wrestle rule: the other's push is real, only his own push back is absorbed | The shove stays as now; in the shoving match two equal pushers both get shoved apart; the steady push isn't capped by the pusher's footing; a charger doesn't slow (item 4) |

**Still open.**
- **Never knocked back's switches** (item 4). Every test on the page is a contest, so the switches would change nothing yet. The plan proposes adding them with the first test they change; that holds back part of Q1's answer, so it needs your yes.
- **The owner** confirms the rulings in CLAUDE.md, and says yes or no to the glow drawn on the art.
- **Review** confirms the plan's readings: "when he means it" as the blast presets; "unless Rex enables otherwise" as They take their own recoil turned off; a person's landing with its momentum real and its energy taken back; the arm-wrestling consequences, the shoving match's new outcome, holding a partner up not counted as recoil, and the paradox cases (item 4); the shimmer's floor; and the drag figure the shimmer uses.

## Other canon in #25 that this plan doesn't cover

Each needs its own decision before it becomes work.

| Canon | The lab today | Note |
|---|---|---|
| Knowledge × intention (RT 2, 4, 10.3): "a consequence Rex foresees and doesn't want is absorbed" | absorption happens only through the named switches; the courtesy ceiling and presets assume harm happens unless a power stops it | Under this canon, harm he foresees and doesn't want wouldn't happen, and a preset is what he means. That changes what the courtesy ceiling means |
| Bystanders (RT 4.3, 10.4): he never kills; harm stays short of permanent; people can be knocked off their feet | the presets go up to "flatten the houses next door" and "level a block" without saying whether people are there | Decide how the presets present people |
| The floor (RT 7.2, 7.4): never smaller or less dense than his standard build | Rex's height box goes down to 0.1 m and his density slider to 10 kg/m³ (the calibration body is a separate body) | Clamp Rex's controls at the floor, or label lower values as not Rex |
| Never collapses (RT 7): "Up to black-hole density and at any size he warps space like a black hole but never collapses" | the two-player tests return `blackHole` and stop; the Weight tab has black-hole outcomes | Review those outcomes |
| Cancelling his own pull (Growth), both ways, so momentum is kept (**Q10**: B) | not modelled | Model it with the Weight tab's self-gravity, his lifts and throws out of his own well, and the two-player pulls |
| "At kaiju sizes his footsteps always cause minor quakes" | the Walk tab scales the step with size | Check at kaiju sizes |
| Things keep their form: a thrown thing falls back into real physics when it hits something comparable or larger, unless going through it is the point (RT 13.2); whatever a lifted thing was attached to tears normally (RT 5.5); grip has no size limit (RT 5.4) | no thrown-object collisions besides the landing (deferred in `BRIEF-gui.md`); the Lift tab's grip works through palm contact | The deferred collision work now has canon to follow |
| Unbreakable footing: "Landings leave a claw print or a few cracks, not a crater" | a print in soil; hard ground held only where it would break by the hazard's rule (a hole of 1 cm or more) | A copy check, and maybe "a few cracks" on hard ground |
| Body (RT 9): four clawed fingers and a thumb, three clawed toes, a tail as strong as his arms, unlimited bite | the footprint and grip models don't use these; the tail is not a limb | — |
| Ollie and Rex "share one infinite source: alone, Rex is pure radiance and Ollie pure absorption" | — | Nothing to build; Ollie's Never knocked back is now ruled (**Q1**) |

## Order of pull requests and review rounds

Each pull request records its review rounds in `research/reviews/` (for example `canon-1-round1.json`), counts a finding only once it is reproduced with code, updates the README's review history and known limits, and has CI started by hand before it merges. After each merge the owner rebuilds and republishes. A long run ends with a `history/` entry.

| Order | Pull request | Depends on | Review rounds |
|---|---|---|---|
| 1 | **Mass** (item 1), all three projects | the claim on `builds.json` and `calc.js` (held on `terantic/canon-followups`) | Two. Data and claims: every figure that quotes the mass, in all three projects, against the canon and the research. Code and tests: the pinned comparisons (remove the pin and see them fail), the migration, the rebuilt `dist` files |
| 2 | **Recoil into their source** (item 2), the catches included, with item 3's ledger test, the recoil copy and the new tagline (item 7) | 1 | Three and a re-check, as for pull request B. Physics: each move's momentum, the ledger. Code and tests: mutants that put the push back into the ground one move at a time. Copy and layout |
| 3 | **Safe passenger by default**, covering the landing and the drag (item 5) | 1 | Two. Physics and claims, including the landing's split (momentum real, energy taken back). Code, layout and the migration |
| 4 | **Contests** (item 4) | 2 (the same rule, in contests) | Three and a re-check. Physics: the charger of unbounded mass, the paradox cases, the shoving match, the standing arm wrestle. The two-player tests: every row of item 4's table, and the search's time. Copy, including how the Collide tab explains the paradox |
| 5 | **The shimmer** (item 6) | 3 and 4 (a person's landing and a hit's energy are shimmer sources); the owner's yes to drawing on the art | Two. Design, copy and accessibility, including the glow's placement on the art. Code and data, including the drag figure and the floor |

The optional items (section 8) each need their own brief.
