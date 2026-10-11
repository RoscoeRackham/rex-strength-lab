# Rex Super-Strength Lab

A physics simulator for Rex, an indestructible, tireless dinosaur, and his boyfriend Ollie, a bull-man who is just as strong and just as indestructible. Set the strength anywhere from the world-record human (511 kg deadlift) to infinite. On his own, Rex can walk, lift, throw, jump, stomp, punch, clap, sprint or pull, or just stand there at any density (the Weight tab). With Ollie he can arm-wrestle, wrestle, play catch, or test the unstoppable force against the immovable object. Each tab shows what the physics does to the two of them, the object, the ground and the air. Every number on the page is either sourced or labelled an estimate.

Strength is how strong he is; **effort** is how hard he chooses to push. They want to be seen as heroes, so the page opens on the least disruptive effort: the gentlest push that still does what each move is for. Each move also shows its **courtesy ceiling** (the most effort before something nearby comes to harm, and which hazard sets it) and **not-so-heroic presets**, each set by a hazard (rattle the windows, crack the plaster, break windows across the street, break the ground, flatten the houses next door, level a block), up to all-out. The **Walk** tab shows what being near them is like: how hard their footsteps shake the ground, how far away people feel it and a glass of water ripples, and their footprints. **Comic switches** suspend one piece of real physics each, on purpose (gentle hold, safe passenger, silent strike, soft landing, cool flight), and the energy they absorb can go back to the endless store they draw on (canon) or, as a what-if, become growth.

Live page: https://claude.ai/artifact/YFpbHtX8tM2Qwffd6znbZP (private until shared)

## The default bodies

Rex is 10 ft (3.048 m) tall by his owner's ruling. Ollie measures 3.06 m to his horn tips, which is 10 ft within measuring error.

Their mass is also by ruling: Rex is 2,700 kg without his tail, and Ollie weighs the same as Rex in all. Rex's tail is about 307 kg (measured from the picture), so each weighs **3,007 kg** in all (Ollie's tail is about 11 kg, so about 2,996 kg of his is body). At 1,060 kg/m³ that is 2.84 m³ each.

The rest comes from their reference picture (`assets/duo.jpg`), which on its own measured less volume:

- Scale: Rex is 790 px from crest tip to floor, so each pixel is 3.86 mm.
- Volume: each body is cut into 1-pixel slices, and each slice is treated as an ellipse. Its front-to-back depth is its visible width times a depth ratio taken from US Army body measurements (ANSUR II). Limbs are sliced across their own axis. Only one arm of each is fully visible, so both arms are sized from that one. Rex's tail includes the part hidden behind his hips. Rex comes out at 2.55 m³ and Ollie at 2.53 m³, tails included. Three independent methods agreed within 3% once each one's errors were corrected. The ruled mass needs both bodies about 12% bigger than this at the same density, most likely deeper front to back than the borrowed ratios; side views will test it.
- Density: 1,060 kg/m³. Lean bodybuilders measure 1,081 kg/m³ with lung air removed (Fry, Cisar & Housh 1987); about 2% comes off for the air in the lungs and gut.
- From the same picture: facing area 4.4 m² for Rex (tail trailing) and 4.5 m² for Ollie, and one foot's sole 0.31 m² (Rex's paws) and 0.15 m² (Ollie's boots).

In the engine these are the `rex` and `ollie` builds (`BUILDS` and `DEFAULT_BODIES` in `src/engine.js`): volume 0.10017 × height³ (from the ruled mass), with areas scaling as height². The ruling, the picture method and its checks are in `research/final-duo.json` (`rex_ollie_picture_build`, `density_bodybuilders_fry1987`).

The strength dial is calibrated on a separate, human-sized body: 2 m, 180 kg, 1,000 kg/m³. At record-human strength it reproduces the shot put, pitching and sprint records in both muscle models. You can pick it from the **Calibration body (2 m, 180 kg)** chip under Size. The real-human feats (deadlift, shot put, Bolt's sprint, and so on) run on it when you press Simulate, because at those strengths the 10 ft, 3,007 kg Rex can't get up. The density chips include **His build (default)** at 1,060 kg/m³ and **Water** (1,000 kg/m³, fresh water at 4 °C, the calibration body's density).

## Art on the page

All images are in `assets/` and are inlined into the page by `build.js`:

- `dino.jpg`: the header picture of Rex.
- `duo.jpg`: Ollie and Rex side by side. It sits in the Ollie settings, and the body estimate above is measured from it.
- `face-rex.jpg` and `face-ollie.jpg`: the faces on the fighter cards of the two-player tabs.
- `art-rig.jpg`: Rex holding a giant dumbbell in a test rig, on the Lift tab. It has a chip that sets the dial to the rig's live load.
- `art-arm.jpg`: the arm-wrestling grip, on the Arm tab.
- `art-unstoppable.jpg`: Rex's take on the unstoppable force, on the Collide tab.

## Build

```
python build-data.py    # research/final-*.json + src/static-data.js -> src/data.js (about 1 s)
node build.js           # inline engine, data and images -> dist/index.html (about 1 s)
```

On macOS and Linux the Python command may be `python3`. On Windows, set `PYTHONUTF8=1` first, or Python reads the UTF-8 research files with the system code page and fails.

## Test

```
node test/shots.js         # writes dist/preview.html; Chromium screenshots of every tab at 1280 and 390 px, light and dark; fails on overflow, console errors or broken numbers in the text (needs Playwright, about 70 s)
node test/calibration.js   # calibration, physics invariants and the regressions from each review round (about 80 s; ends "all checks passed")
node test/presence.js      # effort, restraint, the Walk tab's model, the comic switches and growth (about 30 s; ends "all checks passed")
node test/sweep.js         # every solo move across 7,776 setting combinations (the calibration body and the default 10 ft Rex and Ollie); flags NaN and negative outputs (about 9 min)
```

The usual run is `python build-data.py && node build.js && node test/calibration.js && node test/presence.js && node test/shots.js`, about 3 min in all.

`test/presence.js` checks, among others: that all-out effort reproduces the engine as it was before effort existed (`test/fixtures/allout-baseline.json`, written from `main`'s engine by `test/make-baseline.js`, 432 setting combinations); that the least disruptive effort reaches each move's goal and stays under every hazard whenever the ceiling allows; that ground shaking never falls with more effort or less distance; the Pisa drop test, the elephant band and each threshold's conversion; that gentle hold changes only grip results and the absorbed switches keep the momentum; and the brief's growth examples.

## Files

- `src/engine.js`: the physics. Bodies and builds; two-body push (relativistic constant force, or Hill force-velocity with an implicit integrator); footing and ground limits; drag flight over a round Earth with Kepler arcs above 150 km; the Weight tab's self-gravity, PREM fall through the Earth and settling; arm wrestling, wrestling, the game of catch and the collide test; Kinney-Graham blast, Gutenberg-Richter quakes and Collins et al. craters.
- `src/app.html`: the page. Every sentence a reader sees is generated in the `bay*` functions from engine numbers.
- `src/static-data.js`: the assumption cards and the height references.
- `research/final-*.json`: the sourced facts behind every number (humans, fiction, objects, environment, density, duo, presence). Each fact carries its status, sources and notes. `final-presence.json` (268 facts: step forces, ground shaking, elephants, thresholds, the water glass, comic switches, growth) was first assembled by `research/merge_presence.py` from the compiled research of this brief (each topic researched, checked by a skeptic who re-fetched the sources, and compiled with every correction applied; the compiled topic files are in the session's history scratchpad). Since review round 1 it is edited by hand and is the source of truth: re-running the merge would undo the review fixes.
- `build-data.py`: picks the facts the page uses and writes `src/data.js` with status and sources.
- `research/reviews/`: the review records (see Review history).

## Review history

- Rounds 1-3 (solo moves): three adversarial review rounds over engine, claims, data and UX. Reports: `research/reviews/round1.json` to `round3.json`.
- Density and Rex + Ollie: four design critiques (density, contests, collide, catch), each checked against its sources and an independent re-calculation, then applied (`duo-design-critiques.json`).
- Round 4: a four-lens audit of the new features confirmed 54 findings (`round4.json`). All were fixed in serial batches and re-verified on the final build; the leftovers and side effects from that round were fixed and verified too (`round4-fixes.json`).
- The 10 ft body estimate: three independent methods and a checker (`body-estimate-from-picture.json`).
- Final checks on this build: `test/calibration.js` all 117 checks pass; `test/sweep.js` 5,184 setting combinations with no problems (about 5 min); a browser sweep of 1,512 page states across every tab with no broken text, slow renders or page errors.

## Known limits

- Ground shaking (Walk tab and the restraint checks) comes from an elastic-ground model fed with force pulses. It matched one drop test within about 2× to 60 m, one recorded person walking past at 53 m on sandy ground (Steinmann 2025) within about 2×, and elephant footfalls roughly; read it as uncertain by about 3–5×, more past 60 m (where it falls no faster than the measured r^-1.3). The ground constants for each surface are our picks. Lake ice and a steel deck are not modelled. Indoors, floors and walls can make shaking 2–4× stronger.
- Their gait is people's gait scaled to their size (equal Froude number) from an estimated hip height (0.45 of height); their real gait, and how Rex's paws and Ollie's boots cushion a step, are not canon. The soft-footed factor (0.51 of an ordinary heel strike: the cut people make walking quietly at their normal speed) is an estimate.
- Footprints in sand are scaled from one measured elephant print. The Weight tab's sinking rule for standing (bearing growing with depth, D = (p − q₀)/(ρ g N_q)) overpredicts that elephant's print about tenfold; it is unchanged here, but the Walk tab doesn't use it.
- Thresholds: rattling and losing one's footing have no standard; ours are estimates (1 mm/s; 1 g up and down at the step's frequency). 7.6 and 12.7 mm/s are safe limits for plaster, not the point where cracks start.
- Effort and the courtesy ceiling check six hazards near him (a sonic boom, an air blast over 100 Pa, ground shaking over 12.7 mm/s, ground breaking under him, a crushed object, a thrown person pressed past ride limits). An air blast counts only when something moves past Mach 1 or makes a fireball (or, in Collide, when the hit is quicker than sound crossing the damage zone); slower releases are thumps, and the Punch and Clap tabs say so. In soil (sand, gravel, clay), sinking in is a footprint, not broken ground; only a crater counts. Running steps (Sprint) are not checked for ground shaking. The two-player tests share one effort, clamped to what they need to stand and walk.
- The effort searches walk a log grid (two points a decade, then seven more inside the bracket where a hazard first appears) and bisect to 0.5% (5% in the two-player tests). They stop early only when the move comes out the same at two efforts and all-out. They run in the background after a 40 ms budget; one probe runs the whole move once, so for heavy real-muscle throws and the game of catch a probe can still block the page for up to about a second (there is no Web Worker). While a search runs, the page shows all-out, labelled 'working it out'. A hazard that switches on and off within a narrower window can still be missed. One known case: a real-muscle jump at huge strength (about 10⁸ kg), where two pushes give the same jump to a part in 100,000 and the engine's choice between them (one breaks the ground) flickers with effort; fixing that choice would change all-out results, which must match the earlier engine exactly.
- The passenger limits are ride-design limits for seated, supported people (worst axis); nobody has measured them for someone held in hands. Real-muscle throws are judged by the push's peak, comic ones by its average. Air drag in flight is judged against the held 1.5 g limit; Safe passenger doesn't remove it. A thrown person's landing is reported as a fall height, with no injury threshold, and the courtesy ceiling doesn't count it.
- Cool flight on the Throw tab absorbs at most the energy drag takes from the object (heat plus the wind it stirs): an upper bound, because only the object's heating is taken back and that tab doesn't split it.
- Growth: the gradual-growth limits (100 Pa, 0.25 m/s) are borrowed from blasting and robot safety; the instant-growth timescale and the blast range are estimates; instant growth from the soles would throw him into the air unless he is bolted down, but only as far as the ground can push (past its bearing his soles are driven in instead). The runaway loop's gravity share uses the weak-field formula; relativity raises it to 1 only at his event horizon. Two canon questions are open for the owners (see STATUS.md).
- Walking: a foot that would sink past half his hip height in clay counts as mired (he can't walk there); Ollie's boots on soft clay do. A heavy landing past the clay's bearing drives the foot in like a small stomp (Poncelet penetration, an upper bound).

- Real-muscle speeds follow the Hill curve with a single-muscle shape factor. Whole limbs are flatter, so real-muscle results are a model, not a measurement.
- The body mass is set by ruling (3,007 kg each). Rex's tail share (about 307 kg) is an estimate from one picture, and the picture alone measured about 12% less body; side views will show whether the bodies are that much deeper. Dinosaur-style air sacs could make Rex about 7% lighter at the same size.
- Ground is a bearing-capacity-plus-inertia model. It does not model ice sheets snapping in bending, layered soils, or ejecta.
- Crater sizes past a few hundred km and anything near Earth's binding energy are rough or flagged as planet-scale.
- Flight counts only Earth's gravity; arcs past the Moon's orbit are flagged as rough.
- In the game of catch, the arm stroke has a set time only when it is forced (he slides or needs at least half his strength). Otherwise he can bring the catch in as slowly as he likes, and the round trip counts only the throws and flights.
