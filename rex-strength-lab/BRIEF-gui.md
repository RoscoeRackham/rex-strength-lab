# Brief: page organisation, their powers, and corrections

For the Rex lab (`rex-strength-lab/`). Written by the collaborator's session, 12 Oct 2026, from the collaborator's review of the page (decisions agreed with the owner where marked), for the owner's agent to build. Each item says where it is now, what changes, and what must not change. Work in the house pattern (CLAUDE.md): research where needed, build, tests, adversarial review rounds, README.

## Summary

1. **One banner, "Their powers"**, for every comic-physics option, which today are scattered over three panels and a menu.
2. **Sidebar order**: strength dial, then size and density, then ground, then their powers.
3. **Footing is binary**: just standing, or bolted to the planet. "Claws dug in" goes.
4. **Rex + Ollie gets its own element** below Rex's test bay, collapsed until opened; Rex's tabs are the page's centre.
5. **Four new powers, on by default** (engine work): air resistance absorbed (a slider), things keep their form, unbreakable footing (the ground still shakes), and they take their own recoil.
6. **More points of comparison for energy** (research first), so the page never says "300 hand grenades".
7. Two corrections, and what is out of scope.

## Order of work

Three pull requests, in this order, each with its own tests and review:
- **A. Page organisation: sections 1–4 and correction 1.** No engine change. Until B lands, Comic ground, Gentle hold and Cool flight move into the banner as they are; B replaces them.
- **B. The new powers: section 5.** Engine and page; review rounds on its physics.
- **C. The energy comparisons: section 6.** Research, then data and page.

## Rules for every item

- **Physics doesn't change, except in section 5.** The engine (`src/engine.js`) stays as it is unless an item says otherwise. Sections 1–4 are page changes; section 6 changes the research data and the page's comparison wording. Section 5 adds four powers to the engine; with all four off (5a at 0%), every engine result must match today's exactly, so `test/calibration.js`, `test/presence.js`, the sweep and the all-out baseline pass unchanged when run with them off.
- **Saved pages still load.** Keep the saved-state keys where a control only moves (`state.mode`, `state.anchor`, `state.oAnchor`, `state.absorb`, the switch keys, ...). Where a section retires a key (`state.group` in section 4; `groundHolds`, `gentleHold` and `coolFlight` in section 5; `'braced'` in section 3), migrate it as that section says.
- **Same tests, both widths.** `test/shots.js` must pass at 390 and 1280 px, light and dark. Update its selectors where controls move (it uses `#absorb`, `#grp-solo` and `#grp-duo` today).

## Needs the owner

- **Confirm 5d** (they take their own recoil). It came after the owner agreed to the other powers, so it is the collaborator's call until confirmed; it is in CLAUDE.md marked that way.
- **Decide** whether to raise the moves' bearing for sand (correction 2).

## 1. One banner for their powers

**Why.** Rex and Ollie both visibly run on comic-book physics, and mechanically all of it is the same thing: their power of absorption, used on purpose (CLAUDE.md, Absorption and Restraint). The page scatters those options across three panels and a menu, and the Comic switches panel has to tell readers that two of them are elsewhere. Put every one in one place. The flavour text comes later; for now the hint can say plainly that each option is their absorption at work.

**Name.** The panel is called **Their powers**. It replaces the "Comic switches" panel (`#comic-setup`), in the same spot in the sidebar.

**What moves into it.**

| Option | Where it is now | In the banner |
|---|---|---|
| Muscle physics: Comic book / Real muscle | Settings (`#mode-comic`, `#mode-real`, `#mode-hint`) | First in the banner, same two-way choice and hint. Comic book stays the default. |
| Comic ground | Settings (`#ground-holds`) | Removed: replaced by **Unbreakable footing** (section 5) |
| Bolted to the planet, Rex | Settings, option in "How he holds his ground" (`#anchor`) | A switch for Rex. It replaces that menu (section 3). |
| Bolted to the planet, Ollie | Ollie panel, option in "How Ollie holds his ground" (`#o-anchor`) | A switch for Ollie, next to Rex's. It replaces that menu (section 3). |
| Gentle hold | Comic switches | Replaced by **Things keep their form** (section 5) |
| Safe passenger | Comic switches | Unchanged, under the "Material limit suspended" heading |
| Silent strike, Soft landing | Comic switches | Unchanged, under the "Absorbed" heading |
| Cool flight | Comic switches | Replaced by **Air resistance absorbed** (section 5) |
| (new) Air resistance absorbed (a slider, 100% by default), Things keep their form, Unbreakable footing, They take their own recoil | — | Section 5; on by default |
| Absorbed energy goes to, with growth form, duration and half-life | Comic switches | Unchanged |

**Shared or per character.** Everything is shared by Rex and Ollie, as today, except Bolted, which stays one per character (a contest can bolt one side and not the other).

**Bolted as a switch.** See section 3: the "holds his ground" menus go, and the Bolted switches are the only footing control.

**What stays where it is.**
- Rex's body and the ground stay outside the banner, in the order of section 2.
- Ollie's strength, size, density and mass move into the Rex + Ollie element (section 4).
- The Collide tab keeps its two thought experiments, "Truly immovable" and "Light speed". They are about the test, not their powers. The banner's hint can mention that they are there.
- The Walk tab's step effort (soft-footed to a stamp) is effort, not a power, and stays on the Walk tab.

**Details.**
- The banner's summary line (today `#comic-sum`) lists what is on: the muscle model, then the switches, Bolted with who, and the growth mode. The summaries of the panels the options leave (`#setup-sum`, `#ollie-sum`) drop the muscle model, Comic ground and the footing.
- Delete the hint that points to Settings ("Comic ground and Bolted to the planet are under Settings").
- Status chips on the tabs that name a retired option ("Ground: comic, never breaks", "Gentle hold", "Cool flight") take section 5's labels when it lands. The rest ("Comic mode: real muscle does better here...") keep their wording until the flavour pass.
- Keep the "Each switch suspends one piece of real physics, on purpose. Everything else stays real" line, and add one plain sentence: all of these are their absorption at work, used on purpose.
- Accessibility: every switch keeps a real label; the Bolted pair reads "Bolted to the planet: Rex" and "...: Ollie" to a screen reader.

**Tests to add.**
- `test/shots.js`: open the banner and check every control in the table is inside it, and that none is left in Settings or the Ollie panel.
- A saved state with `mode: 'real'`, `anchor: 'bolted'` and `oAnchor: 'bolted'`, and the section 5 powers off, loads with the same results on the Weight, Jump and Collide tabs as before the change (compare the result text).

## 2. Sidebar order

**Now.** Strength dial, then a collapsible "Settings" panel (open by default at 920 px and wider) holding, in order: muscle physics, ground type, Comic ground, size chips, height, density, mass, how he holds his ground. Then the Ollie panel, then Comic switches.

**New order, top to bottom:**
1. **Strength dial** (unchanged, first).
2. **Size and density**: size chips, height, density slider and chips, mass, in today's order and with today's hint. Directly under the dial, so the two things that shape every result sit together. It keeps the Settings panel's behaviour (collapsible, open by default on desktop); rename it "Size and density".
3. **Ground**: the ground type menu.
4. **Their powers** (section 1).

The Ollie panel leaves the sidebar for the Rex + Ollie element (section 4), so the sidebar is Rex's: his strength, his body, the ground, and the powers they share.

After sections 1 and 3, only the ground menu is left of Settings. If it looks thin as its own panel, it may sit at the bottom of "Size and density" under its own heading instead; either way it comes after size and density.

**Tests.** `test/shots.js`: check the order of the sidebar's sections at both widths, and that "Size and density" is open on first load at 1280 px.

## 3. Footing is binary: standing or bolted

**Why.** "How he holds his ground" (`#anchor`, `#o-anchor`) has three options: just standing (friction), claws or boots dug in (ground shear), bolted to the planet. "Dug in" doesn't hold up: at their strength the ground tears apart around the claws, so it adds a mode that mostly describes the ground failing. And Bolted is now one of their powers (section 1). So footing becomes binary.

**Change.**
- Remove both "holds his ground" menus. The only footing control is each character's **Bolted to the planet** switch in Their powers: off means just standing (friction, `anchor: 'friction'`), on means bolted (`anchor: 'bolted'`). The same for Ollie (`oAnchor`).
- Saved states: `'bolted'` loads with the switch on; `'braced'` loads as `'friction'` (switch off). Afterwards the state validators (`anchor`, `oAnchor` in `app.html`) accept only `'friction'` and `'bolted'`.
- Remove the page text that only applies to dug-in footing, now dead: the Sprint tab's 'shear' limit text and its push-off formula's claw term; the "dug in" wording in `holdText`, the wrestling and pull-out lines, the Collide footing lines and the footing formula on the Throw tab; `ANCHOR_SHORT.braced`; "claws dug in" in the summaries. Search `src/app.html` for `braced`, `dug in` and `claw` and check each hit. Keep claws as body parts (grip, the hands card).
- Assumption card "Newton's third law stays on" (`src/static-data.js`): drop "or dug-in claws".
- Sources table: drop the row "Claw shear strength used when dug in" (`build-data.py`), since nothing on the page uses it.
- **Engine unchanged.** `src/engine.js` keeps `'braced'` (the tests and the all-out baseline use it); only the page stops offering it. Say so in the README.

**Tests.**
- `test/shots.js`: no "dug in" text on any tab; turning Bolted on and off for each character changes the Collide and Wrestle results the way picking the menu option did before.
- A saved state with `anchor: 'braced'` loads as standing, with no page errors.

## 4. Rex + Ollie as its own element

**Why.** This is the Rex strength lab: Rex should be front and centre. Today one test bay (`<main>`, `#tabs`, `#bay`) switches between "Rex alone" and "Rex + Ollie" with a two-way bar (`#grp-solo`, `#grp-duo`; `state.group`), so the two-player tests compete with Rex's for the same space.

**Change.**
- Remove the "Rex alone / Rex + Ollie" bar. The main test bay always shows Rex's tabs (Walk, Lift, Throw, Jump, Stomp, Punch, Clap, Sprint, Pull, Weight), with no heading change: it is the page's centre.
- Add a separate **Rex + Ollie** element directly below Rex's test bay, in the same column (the sidebar stays alongside, so the shared settings, ground and Their powers, are in reach). It has its own heading, its own tab row (Arm wrestle, Wrestle, Catch, Collide) and its own result area.
- **Collapsed until opened.** It starts closed and computes nothing until opened (the two-player tests can take 2–3 s; see README, Known limits). Opening it renders its current tab; while open, a settings change re-renders both bays. The page remembers whether it was open (new state key, for example `duoOpen`, default false), so a reader who uses it finds it open next time. Its closed header shows a one-line summary (Ollie's strength and size, and the current tab).
- **Ollie's settings move into it**, at its top: his strength (same as Rex's, or the what-if dial), height, density and mass, with their hints and the duo picture (`#ollie-setup` today). His Bolted switch stays in Their powers next to Rex's (sections 1 and 3).
- The Walk tab stays in Rex's bay, including its choice of who walks (Rex, Ollie or both).

**Code notes.**
- Today everything goes through one `renderBay()` with `isDuo()`, `curAction()` and `setAction()` choosing between `state.action` and `state.duoAction`. Split it into two renderers, one per element, each with its own tab row and container. Keep `state.action` and `state.duoAction`; `state.group` is no longer needed (a saved `group: 'duo'` should open the Rex + Ollie element once, then be dropped).
- The background effort searches and "working it out" placeholders are keyed to the one bay today. Make sure a search in one element never writes into the other, and that closing the Rex + Ollie element cancels its search.
- The record books' "run" buttons (around `r.action` near the end of `app.html`) switch `state.group` back to solo; they now only need to set Rex's tab and scroll to his bay.
- Two tab lists: give each its own `aria-label` ("Rex's moves", "Rex and Ollie's tests") and keep the arrow-key behaviour inside each.

**Tests.**
- `test/shots.js` uses `#grp-solo` and `#grp-duo` to reach the two-player tabs: replace that with opening the Rex + Ollie element. Screenshot both elements at both widths, light and dark, with no sideways scroll.
- On first load the Rex + Ollie element is closed and none of its engine calls run (check that `P.armWrestle`, `P.catchGame` and friends are not called, or time the first render).
- A saved state with `group: 'duo'` and `duoAction: 'catch'` opens the element on the Catch tab with the same result text as before.
- Changing Ollie's settings inside the element changes the two-player results and leaves Rex's bay unchanged.

## 5. Four new powers, on by default

**Why.** By default Rex and Ollie should be able to throw, hold and stand on things without the side effects real physics would force on them, while what they do still reaches the world around them on purpose. Comic ground today makes the ground unbreakable, which contradicts the effort presets: on the Collide tab it "takes the blow", the ground gets nothing, and a preset like "risk cracking the plaster" has nothing to work with. These powers replace Comic ground, Gentle hold and Cool flight. All four sit in Their powers, are **on by default** and can be turned off (5a by sliding it to 0%). **Canon** (owner and collaborator agreed, 12 Oct 2026; recorded in CLAUDE.md, "Default powers"): comic-book physics is their default, and they choose when not to use it. Absorbed air resistance and Unbreakable footing's push on weak ground are exceptions to "momentum is never absorbed", like the growth lift. 5d (their own recoil) was added afterwards by the collaborator and needs the owner's confirmation; it keeps momentum (the planet takes it), so it is not an exception.

**Its own pull request** (B in the order of work). Sections 1–4 change only the page. This section changes the engine, so build and review it separately, after sections 1–4, and run the review rounds on its physics.

**5a. Air resistance absorbed: a slider, 0–100%, default 100%.** It sets the share of the air's drag on what they throw (and what they hold while swinging or carrying it) that they take back. The share absorbed goes to the endless ocean, energy and momentum both. The rest is real: the object is slowed by (1 − share) × the real drag, and the air takes that share of the drag's energy as a shock and heated air, so a fast throw still makes a sonic boom and an air blast.
- 100% (default): drag-free flight, no slowing, no boom or blast from its flight. 0%: real air, as today.
- The point of the middle: immense throws that still boom or burst, without the object burning up. Burning up is not this slider's job: 5b (Things keep their form) already stops the air from breaking or burning the object, at any setting here. With 5b off, heating is real at (1 − share) of the drag.
- The sonic boom happens whenever the object is supersonic and the share absorbed is below 100%; its blast energy (the energy the air takes in flight, as the engine counts it now) scales with (1 − share). The courtesy ceiling and the presets judge the boom and blast hazards with that share.
- It applies to thrown and held things only. Their own bodies still meet real air (sprint top speed, jump flight, a punch or clap's blast, which Silent strike still covers).
- Replaces Cool flight (which took back only the heating). Saved `coolFlight` is dropped. New state key, for example `airAbsorb` (0–1, default 1).
- The slider shows its value as a percentage, with a short read-out of what it means at the current setting ("drag-free", "the air takes 30%: it booms").
- **Presets set effort only; they never move this slider** (decided 12 Oct 2026). Each preset stays "the least effort that does X"; lowering the absorption is the reader's own choice, as the canon has them choose when not to use their powers. The effort search judges the boom and blast hazards with the slider's current share, so a reader who lowers it and then picks a preset gets the least effort that does it with that much air let through.
- **When a preset can't be reached because of the slider**, say so instead of only "not reachable". If a preset whose hazard is from the air (rattle the windows by air, windows shatter across the street, houses next door collapse, level a block) finds no effort on the Throw tab or in the game of catch, and the slider is above 0%, the preset says: "At [share]% air resistance absorbed, a throw makes [no / too little] blast to do this. Lower Air resistance absorbed to let the air take some." Show this only when lowering the slider would actually reach it (check at 0%). Presets reachable through ground shaking from the landing still work as now.
- Applies wherever something they threw flies: the Throw tab, the game of catch, a thrown partner (Wrestle's throw), and the Collide charge if the thing hitting was thrown.
- A thrown person: the drag they feel in flight is (1 − share) of the real drag, judged against the held 1.5 g limit as now (none at 100%). Safe passenger still covers the push.
- Engine: a drag factor on the flight code (`fly` and its callers), 1 − share, applied to the drag force and to the energy the air takes; report the energy and momentum that went to the ocean. At share 0 every result must equal today's.
- **Very fast throws (past 1% of light speed).** Today `fly` doesn't fly these: it returns `relativistic: true` with range 0 and no impact, and the Throw tab tells a fixed real-air story (the air turns to plasma, the object vaporizes, its energy comes out as a fireball over the first stretch of its path, or it punches out of the atmosphere glowing). Under 5a and 5b that story is wrong. Replace it:
  - Fly it as a straight line (gravity bends a path that fast by a negligible amount; check and state the deflection). A level or upward throw leaves the Earth as the ground curves away; say so, with where it goes. A downward throw hits the ground at a distance from the geometry; report that impact (energy; the crater and quake as today, flagged planet-scale where they already are).
  - Air: at 100% absorbed, nothing happens in the air. Below 100%, the air takes (1 − share) of what it takes today: the fireball's energy scales with it. With 5b on the object survives the fireball; with 5b off, today's vaporizing text applies.
  - The game of catch and a thrown partner get the same treatment wherever they reach this speed.
  - Tests: an All-Star Superman baseball (1.8 × 10²³ kg dial, comic, level throw) at 100% shows no fireball and leaves the Earth; at 0% with 5b off it shows today's text; the fireball energy at 50% is half the 0% value.

**5b. Things keep their form.** Whatever they hold or throw can't be broken by them or the air: not by their grip, the launch's g-force, its own weight while held (sag), heating, or the air in flight. In a collision with anything else, real physics decides: a bird does nothing to Everest; the Moon breaks it. "Substantial" is whatever the collision's physics says breaks it; there is no threshold to set.
- Replaces Gentle hold (which covered only the grip). Saved `gentleHold` maps to on.
- The crush, launch-crush and sag results become "held together by their power" while it is on; the courtesy ceiling's crush hazard doesn't count them.
- Impacts stay real: the object's landing or collision uses today's impact physics, including breaking up.

**5c. Unbreakable footing.** The ground under them never breaks: they take back the energy that would crater, punch through or sink into it (to the endless ocean, or growth in the growth modes). The push itself, its momentum, still goes into the ground, so the ground **shakes exactly as real physics says**. The effort and the not-so-heroic presets choose how hard.
- Replaces Comic ground. Saved `groundHolds: true` maps to on.
- Where the ground couldn't bear the push a move needs (a big jump, a sprint start, a heavy lift, standing at huge density), their power holds the contact: they still get the full push, as with Comic ground now. Label it as their power where it matters.
- Footprints in soil stay: a print is not breaking the ground. Sinking past the bearing, craters, broken slabs and punching through are what it prevents.
- The "break the ground" preset (and any effort a reader sets past it) turns the absorption off for that move, so the ground can break when they mean it to; say so on the preset.
- **Shaking must still reach the surroundings with it on**, on every tab. The Collide tab is the known case to fix: with Comic ground the blow goes into the ground with no energy and no shaking (`Eground: 0` in `COLLIDE` when `cB.groundHolds`). With Unbreakable footing, the ground still receives the blow's momentum, and its shaking (and the plaster, rattle and feel reaches) come from that, as for a stomp. Check every place that tests `groundHolds` in `src/engine.js` (65 today) and `src/app.html`: each must either keep its shaking or say why there is none.
- The Weight tab: with it on he stands at any density on any ground (as Comic ground does now), and the page says it is their power; with it off, today's ground physics.

**5d. They take their own recoil.** The push back from their own moves (a throw, a punch, a clap, a pull) goes through their feet into the planet, as if bolted: they don't slide or get flung backwards. Otherwise an all-out throw at extreme strength is a way to launch into space (an All-Star Superman baseball shoves Rex back at about 99.7% of light speed today).
- Momentum is kept, not absorbed: the planet takes it, as with Bolted today. With 5c the ground doesn't break, but it still shakes from that push, as real physics says, so a huge recoil is a huge jolt; the effort and presets judge that shaking as for any other push into the ground.
- Off: today's physics (friction only; they slide, and the recoil hazard counts it).
- It covers their own pushes on something else. A jump or a sprint start is the move itself, not recoil, so it is unchanged: jumping into space stays possible when they mean to.
- Bolted to the planet (sections 1 and 3) stays, for being pushed by someone or something else: the two-player contests and the Collide test.
- The courtesy ceiling's recoil-slide hazard ("his own recoil shoving him past the nearest people") never triggers while this is on; the recoil's ground shaking counts instead.
- Tests: with it on, the bus-on-ice throw (the presence test's case) doesn't slide and its recoil shows up as ground shaking; with it off, the slide and the hazard are as today; the All-Star baseball doesn't move Rex.

**Defaults change the opening view.** With these on by default, the page opens with different results from today (no drag on throws, nothing crushed, no broken ground). That is intended. Old saves pick up the new defaults: bump the saved-state key (`rex-lab-v1`) or migrate, so a save from before doesn't turn them off.

**Tests.**
- With all four off (5a at 0%), every engine result matches today's (the all-out baseline, calibration, the sweep).
- 5a: at 100% a thrown car and a baseball fly as in a vacuum (range and apex match the drag-free arc), and the reported ocean momentum equals what the air would have taken; at 0% every throw matches today's; in between, range rises and the air's energy falls steadily as the share rises; a supersonic throw at 50% still sets the boom hazard and its blast energy is about half the 0% value; their own sprint is unchanged at any share; at 100% the Throw tab's "windows shatter across the street" preset shows the lower-the-slider hint when the same throw at 0% reaches it, and doesn't when it can't; presets never change the slider.
- 5b: Everest thrown hits a bird-sized object intact and breaks on the Moon (pick an engine case each); grip, launch and sag never break anything while it is on; impacts are unchanged.
- 5c: on sand, concrete and ice, no move breaks or sinks into the ground with it on, while the ground shaking (ppv at 5 m and the plaster reach) matches the shaking with it off for the same push. The Collide charge into an immovable object shakes the ground, and the "risk cracking the plaster" preset finds an effort there. The "break the ground" preset still breaks it.
- Page: each power shows where it changed a result ("held together by their power", "no drag: their power", "the ground holds: their power").

## 6. More points of comparison for energy (research first)

**Why.** Energies are compared to a ladder of eleven references (`energy` in `build-data.py`, shown by `compareEnergy` in `app.html`): the fastest pitch, a Corolla at 100 km/h, a hand grenade, the MOAB, Hiroshima, Castle Bravo, the Tsar Bomba, Krakatoa, the dinosaur-killing asteroid, the Sun's output for a second, and the energy to blow Earth apart. The page names the nearest rung below and a multiple. The gaps are wide (46,000× from the grenade to the MOAB; a million from the Sun-second to Earth's binding energy), so it says things like "300 hand grenades", which nobody can picture.

**This needs the full research process** (CLAUDE.md, house pattern; the owner's workflows in `history/scratchpad/workflows/`): each new reference researched, checked by a skeptic who fetches the source, and compiled as a fact in `research/` with key, status, sources and notes, before it reaches the page. Prefer primary or authoritative sources (government agencies, journals, standards bodies, the USGS and NASA for natural events). Where the literature gives a range, record the range and the value used, as the asteroid's fact does.

**The display rule.**
- A comparison never shows a multiple above about 10×, or a share below about 10% ("40% of a car crash" is fine; "0.1% of" isn't). If an energy falls in a gap wider than that, the ladder needs a rung there, and the review should find it: test every decade from 100 J to 10⁴⁴ J.
- A reference uncertain by more than about 2× (Tunguska, Tambora, the asteroid) gets only a rough multiple ("roughly 3×"), generalising today's special case for the asteroid.
- The words stay plain: "about 1.5× a lightning bolt", not "1.5 lightning-bolt equivalents".

**Candidate rungs.** Unverified starting points for the research, not facts; drop any that can't be sourced and add better ones.

| Rough energy | Candidate | Gap it fills |
|---|---|---|
| ~2 kJ | a rifle bullet (for example 5.56 mm NATO) | pitch → car crash |
| ~15–20 kJ | a .50-calibre round | pitch → car crash |
| ~14 MJ | a loaded semi-truck at highway speed (kinetic energy) | grenade → MOAB |
| ~1–5 GJ | a lightning bolt | grenade → MOAB |
| 4.2 GJ | one tonne of TNT (by definition) | grenade → MOAB |
| ~1 TJ | a high-speed train at full speed (kinetic energy) | MOAB → Hiroshima |
| ~2–5 TJ | the Beirut port explosion, 2020 | MOAB → Hiroshima |
| ~12 TJ | the Halifax explosion, 1917 | MOAB → Hiroshima |
| ~2 PJ | the Chelyabinsk meteor, 2013 | Hiroshima → Castle Bravo |
| ~10–60 PJ | Tunguska, 1908 | Hiroshima → Castle Bravo |
| ~10¹⁷ J | Mount St Helens, 1980 | around Krakatoa |
| ~10¹⁹ J | Tambora, 1815 | Krakatoa → asteroid |
| ~6 × 10²⁰ J | a year of all human energy use | Krakatoa → asteroid |
| ~1.5 × 10²² J | a day of sunlight reaching Earth | asteroid → Sun-second |
| ~5 × 10²⁴ J | a year of sunlight reaching Earth | asteroid → Sun-second |
| ~10²⁹ J | the energy to blow the Moon apart | Sun-second → Earth |
| ~10³⁴ J | the Sun's output for a year | above Earth |
| ~10⁴⁴ J | a supernova | the top of the scale |

**One shared ladder** (decided 12 Oct 2026): a mix of kinds on one scale. Matching the comparison to the kind of event (impacts to meteors, blasts to explosions, shaking to earthquakes) is a possible later step.

**Also check**, while researching: the existing rungs' values and sources, against the same standard.

**Tests.**
- Every decade from 100 J to 10⁴⁴ J compares with a multiple of at most about 10× (or a share of at least about 10%).
- Each rung on the page has a fact with a status and a fetched source, shown in the sources table.
- Rough-multiple wording for every rung marked uncertain.

## Corrections

1. **Instant growth through a slab.** On concrete (a 10 cm slab), instant growth says his soles are "driven 3.66 m into the concrete slab". A thin layer should read that he punches through it into whatever is underneath, as the Weight tab already says (`groundUnderWeight`'s `punchesThrough`). Fix the wording in `growthItems` (`src/app.html`) for the thin layers (asphalt, concrete, ice, steel deck), which the Weight tab treats the same way.
2. **For the owner to decide, not a fix:** the bearing the moves use for loose sand (37 kPa at 0.316 m, the textbook value) is about 5–10 times below what the elephant's sand bore (README, Known limits). Raising it would change all-out results across the moves and the baseline.

## Not in scope

- New physics or new canon beyond section 5, and the flavour text for their powers (later).
- **Deferred (12 Oct 2026):** a thrown object hitting something in its path (a building, a wall, a person) at a set distance. It needs penetration physics for very fast objects, a research item. For now a throw only flies to where it lands or leaves.
- Build Calculator and Build Comparison.
