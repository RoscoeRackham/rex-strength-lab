# Density + Ollie

2026-10-09 22:01:15 UTC to 2026-10-10 00:45:29 UTC. 47 assistant events, 1 compaction events, 8 subagent events, 217 tool call events, 1 user events, 2 wakeup events.

Density and weight from plush to black hole, and Ollie with four two-player tests (arm wrestling, wrestling, catch, unstoppable force vs immovable object). A design workflow with four adversarial critiques fed the engine work. The second context compaction happened at the end of this phase.

### Owner · 2026-10-09 22:01:15 UTC

```text
New feature: adding density and weight, and the effect that would have on the environment. Like if Rex were the density of a neutron star. Also maybe adding in Rex’s boyfriend, Ollie, who is equally as overpowered and indestructible, for two person simulations. (Arm wrestling, regular wrestling, games of catch, unstoppable force vs immovable objects)
```

- Attached image: `e4a745ec-image.jpg` → rex-strength-lab/assets/duo.jpg, first version (replaced on 10 Oct by f61017b0-image.jpg)


- `Bash` Check what survived in the new container: `ls /home/user; ls /home/user/dino-strength-sim 2>&1 | head; cd /home/user/lodge-docs 2>/dev/null && git branch --show-current && git log --oneline -3 && ls r...`
- `Bash` Check branch and default branch state: `git fetch origin 2>&1 | tail -2; git status -sb | head -3; git log --oneline origin/claude/dinosaur-strength-physics-8o13ft -1; git remote show origin 2>/dev...`
- `Bash` Read engine constants and body model: `cd /home/user/dino-strength-sim && sed -n 1,120p src/engine.js`
- `Bash` Find state, validation, and mass control code: `grep -n "VALID\|state.m\b\|state.m =\|#mass\|'mass'\|function ctx\|const state\|setKg\|function save\|function load" src/app.html | head -40; sed -n 180,290p...`
- `Bash` Inspect research fact format and build helpers: `python3 -c "` (+7 lines)
- `Bash` Inspect research file top-level structure: `python3 -c "` (+5 lines)
- `Workflow` rex-ollie-design: Research and design the physics for density/weight effects and four Rex-and-Ollie two-person simulations, each adversarially checked
  - run `wf_173e4620-19f`: 8 subagents, listed below

<details>
<summary>Subagent `design:density` (rex-ollie-design, 2026-10-09 22:06:30 UTC): Density sets Rex's mass at his current size. Mass is density × 0.18 m³ at 2 m, and the volume scales with height cubed. Returned facts: 32 (e.g. density_plush_stuffing_estimate; density_human_body_measured), tests: 29.</summary>

Workflow run `wf_173e4620-19f`, phase `Design`, agent `aba0aa8a82dfded90`. Prompt, verbatim:

```text
Project: "Rex Super-Strength Lab", a single-page physics simulator for Rex, an indestructible, tireless plush kaiju-dinosaur (default 2 m tall, 180 kg). A strength dial sets his maximum force as a lift capacity from 10 kg to 1e34 kg, plus infinity. Moves today: lift, throw, jump, stomp, punch, clap, sprint, pull. Two muscle models: "comic" (fixed share of strength at any speed) and "real" (Hill force-velocity curve; limb speed caps). Settings: ground surface (sand, gravel, soft clay, stiff clay, asphalt, concrete, lake ice, steel deck, granite), "comic ground" (never breaks), anchoring (friction / claws dug in / bolted to the planet), height (isometric scaling) and mass.
Read these before designing (do NOT edit anything under /home/user/dino-strength-sim; put scratch files in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo/):
- /home/user/dino-strength-sim/src/engine.js: the physics engine (SI units; relativistic momentum helpers momentumToV/momentumToKE/vToMomentum; pushApart two-body push in comic or Hill mode; anchorCapacity footing model; fly() RK4 flight over a round Earth with drag and Kepler arcs; craterDiameter Collins et al.; blastRadius Kinney-Graham; seismicMagnitude; stagnationT; lift/throw/jump/stomp/punch/clap/sprint/pull).
- /home/user/dino-strength-sim/src/app.html (the bay* functions show how results become page text), /home/user/dino-strength-sim/src/static-data.js (assumptions text), /home/user/dino-strength-sim/build-data.py (how sourced facts become the sources table).
- Fact format used by the project: /home/user/dino-strength-sim/research/final-environment.json ("facts" entries with key, category, label, status in {verified, canon_stated, reported, estimate, claimed, disputed, not_quantified}, value_si, unit_si, low_si, high_si, display, sources [{title, url}], notes).
NEW FEATURES being added (the owner's request): (1) "density and weight, and the effect that would have on the environment, like if Rex were the density of a neutron star"; (2) Rex's boyfriend Ollie, "equally as overpowered and indestructible", for two-person simulations: arm wrestling, regular wrestling, games of catch, unstoppable force vs immovable object. Ollie, from the owner's image, is a plush bull-man: horns, nose ring, leather vest, cargo pants, laced boots (no visible claws), about Rex's height and build. Do not invent other canon for him; default him to Rex's size, mass and strength, with his own adjustable settings.
The owner is a professional critic: factual accuracy and honest labelling come first. Every number must be either sourced (fetch the source and confirm the number on the page; give the exact URL) or labelled an estimate with the reasoning. Prefer primary or authoritative sources (journals, textbooks, NASA/ESA, standards bodies). Never present speculation as fact; say what the model ignores. The page's tone is plain, specific and readable for a general audience (short sentences, no jargon without a gloss).

YOUR AREA: Density and weight
Design a density control for Rex (and Ollie) and a new solo tab, "Weight", that shows what his density does to him and his surroundings just by standing there; also how mass changes the existing moves.
Cover: (a) a log-scale density setting at fixed size with sourced reference presets: plush toy stuffing, a typical body (human body density), water, steel, osmium (densest element), white-dwarf matter, neutron-star / nuclear density, and the density at which Rex's own size equals his Schwarzschild radius (computed, not sourced). Give Rex's mass at each preset for the default 2 m body (volume 0.18 m^3 at 1,000 kg/m^3) and sourced comparison masses (e.g. ships, Phobos, Deimos, the Moon, Earth). (b) Can he stand, walk, jump at his strength setting given his weight? (c) Ground: foot pressure vs bearing (existing model); when he sinks a little, when he punches into rock, and when he falls through the planet. If he falls through Earth: a sourced real-Earth gravity profile and gravity-tunnel time (e.g. Klotz 2015, Am. J. Phys.), drag through rock with bearing strength plus inertia, damping per pass, Earth's rotation, and where he ends up; energy released. (d) Self-gravity: distance at which his gravity beats Earth's; his surface gravity and escape speed (treat his body as a sphere of equal volume, say so); tidal stretch on a person nearby; whether he holds an atmosphere (Jeans-type rule, sourced); the radius inside which air or rock falls onto him (Bondi radius; rock crushed where rock strength < rho G M / r); infall heating. (e) Where Rex's mass exceeds Earth's: Earth falls onto him instead; at the Schwarzschild threshold he is a black hole. (f) Honest caveat that neutron-star matter only stays that dense under a star's gravity; outside it would decompress violently (source it); in the sim his indestructibility holds it together. (g) Effects on existing moves: recoil and footing scale with mass; a thrown object must first escape his own gravity well (patched-conic: v_inf^2 = v^2 - 2GM/r_hand) and otherwise falls back onto him; jumps need force beyond his weight. (h) Mutual gravity between Rex and Ollie when both are dense: the force between them vs strength and footing (feeds the two-person sims).

Deliver a design an engineer can implement directly in engine.js and app.html without further research. Research every fact you use on the web (WebSearch/WebFetch; fetch each source and confirm the number on the page). Work numbers through for the default 2 m, 180 kg body and for a neutron-star-dense body, and give concrete test cases with expected values you computed (show the arithmetic in reasoning). Use scratch scripts in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo/density/ to compute (node is available; you may require the engine: global.window = {}; const P = require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA).
```

</details>

<details>
<summary>Subagent `design:contest` (rex-ollie-design, 2026-10-09 22:06:31 UTC): Two strength contests between Rex and Ollie. ARM WRESTLING: each arm pushes sideways on the clasped hands with 11% of its owner's strength, in both muscle models. Returned facts: 22 (e.g. aw_waf_table_dimensions; aw_elbow_pad_spacing), tests: 30.</summary>

Workflow run `wf_173e4620-19f`, phase `Design`, agent `a942f6239c2d00a09`. Prompt, verbatim:

```text
Project: "Rex Super-Strength Lab", a single-page physics simulator for Rex, an indestructible, tireless plush kaiju-dinosaur (default 2 m tall, 180 kg). A strength dial sets his maximum force as a lift capacity from 10 kg to 1e34 kg, plus infinity. Moves today: lift, throw, jump, stomp, punch, clap, sprint, pull. Two muscle models: "comic" (fixed share of strength at any speed) and "real" (Hill force-velocity curve; limb speed caps). Settings: ground surface (sand, gravel, soft clay, stiff clay, asphalt, concrete, lake ice, steel deck, granite), "comic ground" (never breaks), anchoring (friction / claws dug in / bolted to the planet), height (isometric scaling) and mass.
Read these before designing (do NOT edit anything under /home/user/dino-strength-sim; put scratch files in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo/):
- /home/user/dino-strength-sim/src/engine.js: the physics engine (SI units; relativistic momentum helpers momentumToV/momentumToKE/vToMomentum; pushApart two-body push in comic or Hill mode; anchorCapacity footing model; fly() RK4 flight over a round Earth with drag and Kepler arcs; craterDiameter Collins et al.; blastRadius Kinney-Graham; seismicMagnitude; stagnationT; lift/throw/jump/stomp/punch/clap/sprint/pull).
- /home/user/dino-strength-sim/src/app.html (the bay* functions show how results become page text), /home/user/dino-strength-sim/src/static-data.js (assumptions text), /home/user/dino-strength-sim/build-data.py (how sourced facts become the sources table).
- Fact format used by the project: /home/user/dino-strength-sim/research/final-environment.json ("facts" entries with key, category, label, status in {verified, canon_stated, reported, estimate, claimed, disputed, not_quantified}, value_si, unit_si, low_si, high_si, display, sources [{title, url}], notes).
NEW FEATURES being added (the owner's request): (1) "density and weight, and the effect that would have on the environment, like if Rex were the density of a neutron star"; (2) Rex's boyfriend Ollie, "equally as overpowered and indestructible", for two-person simulations: arm wrestling, regular wrestling, games of catch, unstoppable force vs immovable object. Ollie, from the owner's image, is a plush bull-man: horns, nose ring, leather vest, cargo pants, laced boots (no visible claws), about Rex's height and build. Do not invent other canon for him; default him to Rex's size, mass and strength, with his own adjustable settings.
The owner is a professional critic: factual accuracy and honest labelling come first. Every number must be either sourced (fetch the source and confirm the number on the page; give the exact URL) or labelled an estimate with the reasoning. Prefer primary or authoritative sources (journals, textbooks, NASA/ESA, standards bodies). Never present speculation as fact; say what the model ignores. The page's tone is plain, specific and readable for a general audience (short sentences, no jargon without a gloss).

YOUR AREA: Arm wrestling and wrestling
Design two strength contests between Rex and Ollie: ARM WRESTLING and WRESTLING (shoving match / sumo-style push, plus lifting or throwing the other).
Physics to get right: Newton's third law makes the contact force between them equal, so strength alone decides nothing once both exceed what their footing, the table, or the ground can transmit; then the weakest link in the load path decides (table top and elbow pads, friction or claw/boot grip, ground bearing, the ground between them when both are bolted, which is put in tension). For arm wrestling: model the hands, forearm lever about the elbow, the torque each arm can make from its strength share (source real arm-wrestling force or torque data and arm/forearm dimensions; source the known humerus spiral-fracture risk in human arm wrestling as context), what the table and elbow pads must carry (source a regulation table or typical table dimensions and wood/steel strength as estimates), and the outcome when strengths differ (the stronger pins: time to pin from torque difference and arm inertia) or are equal (stalemate; what breaks first). For wrestling: pushing contest with each body's footing (friction mu*m*g, claws dug in, bolted, comic ground), mass and density from the new density setting, the "both too strong for their footing" case (they shove each other apart like skaters; reuse the engine's two-body push), lifting the other (needs strength > partner's weight; dense partners), and a toss of the partner (reuse throw physics with the partner as the object). Include unequal strengths and sizes, infinite strength on one or both sides (infinity minus infinity is undefined: say so), and mutual gravity when both are very dense (the density area will supply G m1 m2 / d^2).

Deliver a design an engineer can implement directly in engine.js and app.html without further research. Research every fact you use on the web (WebSearch/WebFetch; fetch each source and confirm the number on the page). Work numbers through for the default 2 m, 180 kg body and for a neutron-star-dense body, and give concrete test cases with expected values you computed (show the arithmetic in reasoning). Use scratch scripts in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo/contest/ to compute (node is available; you may require the engine: global.window = {}; const P = require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA).
```

</details>

<details>
<summary>Subagent `design:catch` (rex-ollie-design, 2026-10-09 22:44:30 UTC): Rex throws an object (any throwable object, or his partner tossed straight up) to Ollie at a chosen distance, from 5 m to the far side of the planet (20,015 km). Ollie catches it, then throws it back. Returned facts: 18 (e.g. catch_anthro_ansur2_reach_chest; catch_stroke_fraction), tests: 22.</summary>

Workflow run `wf_173e4620-19f`, phase `Design`, agent `a0fb3adb889b8c422`. Prompt, verbatim:

```text
Project: "Rex Super-Strength Lab", a single-page physics simulator for Rex, an indestructible, tireless plush kaiju-dinosaur (default 2 m tall, 180 kg). A strength dial sets his maximum force as a lift capacity from 10 kg to 1e34 kg, plus infinity. Moves today: lift, throw, jump, stomp, punch, clap, sprint, pull. Two muscle models: "comic" (fixed share of strength at any speed) and "real" (Hill force-velocity curve; limb speed caps). Settings: ground surface (sand, gravel, soft clay, stiff clay, asphalt, concrete, lake ice, steel deck, granite), "comic ground" (never breaks), anchoring (friction / claws dug in / bolted to the planet), height (isometric scaling) and mass.
Read these before designing (do NOT edit anything under /home/user/dino-strength-sim; put scratch files in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo/):
- /home/user/dino-strength-sim/src/engine.js: the physics engine (SI units; relativistic momentum helpers momentumToV/momentumToKE/vToMomentum; pushApart two-body push in comic or Hill mode; anchorCapacity footing model; fly() RK4 flight over a round Earth with drag and Kepler arcs; craterDiameter Collins et al.; blastRadius Kinney-Graham; seismicMagnitude; stagnationT; lift/throw/jump/stomp/punch/clap/sprint/pull).
- /home/user/dino-strength-sim/src/app.html (the bay* functions show how results become page text), /home/user/dino-strength-sim/src/static-data.js (assumptions text), /home/user/dino-strength-sim/build-data.py (how sourced facts become the sources table).
- Fact format used by the project: /home/user/dino-strength-sim/research/final-environment.json ("facts" entries with key, category, label, status in {verified, canon_stated, reported, estimate, claimed, disputed, not_quantified}, value_si, unit_si, low_si, high_si, display, sources [{title, url}], notes).
NEW FEATURES being added (the owner's request): (1) "density and weight, and the effect that would have on the environment, like if Rex were the density of a neutron star"; (2) Rex's boyfriend Ollie, "equally as overpowered and indestructible", for two-person simulations: arm wrestling, regular wrestling, games of catch, unstoppable force vs immovable object. Ollie, from the owner's image, is a plush bull-man: horns, nose ring, leather vest, cargo pants, laced boots (no visible claws), about Rex's height and build. Do not invent other canon for him; default him to Rex's size, mass and strength, with his own adjustable settings.
The owner is a professional critic: factual accuracy and honest labelling come first. Every number must be either sourced (fetch the source and confirm the number on the page; give the exact URL) or labelled an estimate with the reasoning. Prefer primary or authoritative sources (journals, textbooks, NASA/ESA, standards bodies). Never present speculation as fact; say what the model ignores. The page's tone is plain, specific and readable for a general audience (short sentences, no jargon without a gloss).

YOUR AREA: Game of catch
Design a GAME OF CATCH between Rex and Ollie at a chosen distance (e.g. 10 m to across the planet) with any object from the existing object list (and optionally the other partner as the "ball"). Reuse the engine's throw (throwObject) and flight (fly) for the pitch: the thrower aims so the object reaches the catcher (solve the launch angle for the distance if reachable, flat throw vs lob; note drag). Then the catch: the catcher's hands give over a catch stroke (source human catching hand travel/time, e.g. baseball mitt studies) so the catch force F = p/t or m v^2 / (2 d) (relativistic where needed), whether his strength can stop it within the stroke, his recoil and footing slide (reuse anchorCapacity and two-body momentum), and what the object suffers (crush strength already in the object data; heating). Find the speed and distance limits: beyond about 1% of light speed the object turns into a fireball in the air before arriving (the engine already treats relativistic throws as fireballs; quantify the distance over which it sweeps up its own mass of air), supersonic heating, objects that escape Earth or orbit before arriving, flight time over long distances (round trip for a "game"). If the catcher misses, what the impact does (existing crater/quake/blast). Include infinite strength, unequal strengths, and dense partners (the ball must climb out of the thrower's gravity and falls into the catcher's: patched conic; the density area supplies G m).

Deliver a design an engineer can implement directly in engine.js and app.html without further research. Research every fact you use on the web (WebSearch/WebFetch; fetch each source and confirm the number on the page). Work numbers through for the default 2 m, 180 kg body and for a neutron-star-dense body, and give concrete test cases with expected values you computed (show the arithmetic in reasoning). Use scratch scripts in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo/catch/ to compute (node is available; you may require the engine: global.window = {}; const P = require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA).
```

</details>

<details>
<summary>Subagent `design:collide` (rex-ollie-design, 2026-10-09 22:48:45 UTC): The Collide tab answers the old question in two ways. In the Push, one partner shoves with everything while the other braces. Returned facts: 16 (e.g. collide_paradox_premises; collide_no_rigid_bodies), tests: 30.</summary>

Workflow run `wf_173e4620-19f`, phase `Design`, agent `a2c684b8cbd97e171`. Prompt, verbatim:

```text
Project: "Rex Super-Strength Lab", a single-page physics simulator for Rex, an indestructible, tireless plush kaiju-dinosaur (default 2 m tall, 180 kg). A strength dial sets his maximum force as a lift capacity from 10 kg to 1e34 kg, plus infinity. Moves today: lift, throw, jump, stomp, punch, clap, sprint, pull. Two muscle models: "comic" (fixed share of strength at any speed) and "real" (Hill force-velocity curve; limb speed caps). Settings: ground surface (sand, gravel, soft clay, stiff clay, asphalt, concrete, lake ice, steel deck, granite), "comic ground" (never breaks), anchoring (friction / claws dug in / bolted to the planet), height (isometric scaling) and mass.
Read these before designing (do NOT edit anything under /home/user/dino-strength-sim; put scratch files in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo/):
- /home/user/dino-strength-sim/src/engine.js: the physics engine (SI units; relativistic momentum helpers momentumToV/momentumToKE/vToMomentum; pushApart two-body push in comic or Hill mode; anchorCapacity footing model; fly() RK4 flight over a round Earth with drag and Kepler arcs; craterDiameter Collins et al.; blastRadius Kinney-Graham; seismicMagnitude; stagnationT; lift/throw/jump/stomp/punch/clap/sprint/pull).
- /home/user/dino-strength-sim/src/app.html (the bay* functions show how results become page text), /home/user/dino-strength-sim/src/static-data.js (assumptions text), /home/user/dino-strength-sim/build-data.py (how sourced facts become the sources table).
- Fact format used by the project: /home/user/dino-strength-sim/research/final-environment.json ("facts" entries with key, category, label, status in {verified, canon_stated, reported, estimate, claimed, disputed, not_quantified}, value_si, unit_si, low_si, high_si, display, sources [{title, url}], notes).
NEW FEATURES being added (the owner's request): (1) "density and weight, and the effect that would have on the environment, like if Rex were the density of a neutron star"; (2) Rex's boyfriend Ollie, "equally as overpowered and indestructible", for two-person simulations: arm wrestling, regular wrestling, games of catch, unstoppable force vs immovable object. Ollie, from the owner's image, is a plush bull-man: horns, nose ring, leather vest, cargo pants, laced boots (no visible claws), about Rex's height and build. Do not invent other canon for him; default him to Rex's size, mass and strength, with his own adjustable settings.
The owner is a professional critic: factual accuracy and honest labelling come first. Every number must be either sourced (fetch the source and confirm the number on the page; give the exact URL) or labelled an estimate with the reasoning. Prefer primary or authoritative sources (journals, textbooks, NASA/ESA, standards bodies). Never present speculation as fact; say what the model ignores. The page's tone is plain, specific and readable for a general audience (short sentences, no jargon without a gloss).

YOUR AREA: Unstoppable force vs immovable object
Design "UNSTOPPABLE FORCE VS IMMOVABLE OBJECT" between Rex and Ollie (Ollie is a bull, so "Ollie charges, Rex holds his ground" is a natural default; allow swapping roles). Cover both readings: (1) a static contest: one pushes with all his strength, the other braces (this overlaps the wrestling contest: equal strengths stalemate; the ground or anchors decide; both bolted puts the planet's crust between them in tension or compression, source rock tensile and compressive strength); (2) a collision: the charger arrives at a speed from his sprint or a stomp-launch or a jump (existing engine moves) or an arbitrary speed, and hits the braced partner. Use momentum conservation with two bounds for an indestructible plush body: perfectly elastic (bounce) and perfectly inelastic (energy released at the contact as heat, sound and a blast; reuse blastRadius, seismicMagnitude); the "immovable" one is only as immovable as his anchoring: friction, claws, bolted to the planet (then Earth's mass 5.97e24 kg takes the momentum: compute Earth's speed change), comic ground, or his own mass from the density setting. Contact force over the contact time (rigid bodies mean infinite force; real bodies have finite contact times set by stiffness or sound speed: source this, e.g. no perfectly rigid bodies in relativity because signals travel at most at c). Relativistic speeds (energy release, fireball). Infinite strength on both sides: explain plainly why the paradox has no answer in physics (an unstoppable force needs unbounded momentum, an immovable object unbounded inertia or anchoring; they cannot coexist; with either finite, the finite one gives), with a source for the standard resolution if one exists (or say it is the standard logical argument). Give the honest physics verdict for each combination.

Deliver a design an engineer can implement directly in engine.js and app.html without further research. Research every fact you use on the web (WebSearch/WebFetch; fetch each source and confirm the number on the page). Work numbers through for the default 2 m, 180 kg body and for a neutron-star-dense body, and give concrete test cases with expected values you computed (show the arithmetic in reasoning). Use scratch scripts in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo/collide/ to compute (node is available; you may require the engine: global.window = {}; const P = require('/home/user/dino-strength-sim/src/engine.js'); require('/home/user/dino-strength-sim/src/data.js'); const D = window.DINO_DATA).
```

</details>

<details>
<summary>Subagent `check:contest` (rex-ollie-design, 2026-10-09 23:22:18 UTC): Needs revision before build. Most sources check out. Returned fact_checks: 22 (e.g. aw_waf_table_dimensions; aw_elbow_pad_spacing), physics_issues: 14, missing: 13, test_corrections: 9.</summary>

Workflow run `wf_173e4620-19f`, phase `Check`, agent `ababec29a9871d36c`. Prompt, verbatim:

```text
Project: "Rex Super-Strength Lab", a single-page physics simulator for Rex, an indestructible, tireless plush kaiju-dinosaur (default 2 m tall, 180 kg). A strength dial sets his maximum force as a lift capacity from 10 kg to 1e34 kg, plus infinity. Moves today: lift, throw, jump, stomp, punch, clap, sprint, pull. Two muscle models: "comic" (fixed share of strength at any speed) and "real" (Hill force-velocity curve; limb speed caps). Settings: ground surface (sand, gravel, soft clay, stiff clay, asphalt, concrete, lake ice, steel deck, granite), "comic ground" (never breaks), anchoring (friction / claws dug in / bolted to the planet), height (isometric scaling) and mass.
Read these before designing (do NOT edit anything under /home/user/dino-strength-sim; put scratch files in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo/):
- /home/user/dino-strength-sim/src/engine.js: the physics engine (SI units; relativistic momentum helpers momentumToV/momentumToKE/vToMomentum; pushApart two-body push in comic or Hill mode; anchorCapacity footing model; fly() RK4 flight over a round Earth with drag and Kepler arcs; craterDiameter Collins et al.; blastRadius Kinney-Graham; seismicMagnitude; stagnationT; lift/throw/jump/stomp/punch/clap/sprint/pull).
- /home/user/dino-strength-sim/src/app.html (the bay* functions show how results become page text), /home/user/dino-strength-sim/src/static-data.js (assumptions text), /home/user/dino-strength-sim/build-data.py (how sourced facts become the sources table).
- Fact format used by the project: /home/user/dino-strength-sim/research/final-environment.json ("facts" entries with key, category, label, status in {verified, canon_stated, reported, estimate, claimed, disputed, not_quantified}, value_si, unit_si, low_si, high_si, display, sources [{title, url}], notes).
NEW FEATURES being added (the owner's request): (1) "density and weight, and the effect that would have on the environment, like if Rex were the density of a neutron star"; (2) Rex's boyfriend Ollie, "equally as overpowered and indestructible", for two-person simulations: arm wrestling, regular wrestling, games of catch, unstoppable force vs immovable object. Ollie, from the owner's image, is a plush bull-man: horns, nose ring, leather vest, cargo pants, laced boots (no visible claws), about Rex's height and build. Do not invent other canon for him; default him to Rex's size, mass and strength, with his own adjustable settings.
The owner is a professional critic: factual accuracy and honest labelling come first. Every number must be either sourced (fetch the source and confirm the number on the page; give the exact URL) or labelled an estimate with the reasoning. Prefer primary or authoritative sources (journals, textbooks, NASA/ESA, standards bodies). Never present speculation as fact; say what the model ignores. The page's tone is plain, specific and readable for a general audience (short sentences, no jargon without a gloss).

Adversarially check this design for the area "Arm wrestling and wrestling". Default to suspicion. (1) For EVERY fact: fetch the source URL and confirm the number and wording; mark ok=false with the correct value and a better source if wrong, unsupported, or mislabelled (e.g. an estimate called verified). (2) Re-derive every equation and recompute every test case independently (write scripts in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo/contest-check/); report physics errors, wrong regimes, missing forces or effects, double counting, unit slips, and anything that would show a reader a false or misleading claim, with concrete fixes. (3) List what is missing for an honest, complete simulation of the brief. (4) Check that the page text never overstates certainty.

BRIEF:
Design two strength contests between Rex and Ollie: ARM WRESTLING and WRESTLING (shoving match / sumo-style push, plus lifting or throwing the other).
Physics to get right: Newton's third law makes the contact force between them equal, so strength alone decides nothing once both exceed what their footing, the table, or the ground can transmit; then the weakest link in the load path decides (table top and elbow pads, friction or claw/boot grip, ground bearing, the ground between them when both are bolted, which is put in tension). For arm wrestling: model the hands, forearm lever about the elbow, the torque each arm can make from its strength share (source real arm-wrestling force or torque data and arm/forearm dimensions; source the known humerus spiral-fracture risk in human arm wrestling as context), what the table and elbow pads must carry (source a regulation table or typical table dimensions and wood/steel strength as estimates), and the outcome when strengths differ (the stronger pins: time to pin from torque difference and arm inertia) or are equal (stalemate; what breaks first). For wrestling: pushing contest with each body's footing (friction mu*m*g, claws dug in, bolted, comic ground), mass and density from the new density setting, the "both too strong for their footing" case (they shove each other apart like skaters; reuse the engine's two-body push), lifting the other (needs strength > partner's weight; dense partners), and a toss of the partner (reuse throw physics with the partner as the object). Include unequal strengths and sizes, infinite strength on one or both sides (infinity minus infinity is undefined: say so), and mutual gravity when both are very dense (the density area will supply G m1 m2 / d^2).

DESIGN:
{
 "area": "Arm wrestling and wrestling: Rex vs Ollie (shoving match, shove, lift, throw)",
 "summary": "Two strength contests between Rex and Ollie. ARM WRESTLING: each arm pushes sideways on the clasped hands with 11% of its owner's strength, in both muscle models. That share is an estimate set so a record-strength human arm twists its upper-arm bone with about 190 N·m, roughly the theoretical torsional strength of a human humerus. Newton's third law makes the hand-to-hand push the same both ways, and that push goes through each body into his feet. So each side can use only min(arm force, footing). For a 180 kg body standing on concrete the limit is 1,059 N, far below the 97,861 N a Hulk-strength arm can make. Once both are footing-limited, strength stops mattering: equal footing is a dead heat at any strength, and otherwise the heavier or better-anchored one wins. When one side has a force surplus, it spins both forearms (each acts like 0.97% of its owner's mass at the grip) through a quarter turn to the pin pad. That gives a time to pin, a hand speed and a slam energy, which is compared with what a regulation WAF table (19 mm plywood on a steel frame) can take. WRESTLING has four parts. (1) A sustained shoving match, decided by each side's walking drive against the other's hold, with the loser walked out of a 4.55 m sumo ring. (2) An explosive shove that reuses pushApart with both footings. When both out-muscle their feet, they fly apart like skaters: 49 m/s each at the default Hulk setting. (3) Lifting the partner: strength must exceed his weight, plus any dug-in pull-out, plus mutual gravity. (4) A toss that reuses throwObject with the partner as the object. Mutual gravity G m1 m2/d^2 is negligible at normal density (4.4 µN at contact). At neutron-star density (7.2e16 kg each) it is 7.05e23 N, about a million times their Earth weight, so it glues them together before any contest starts.",
 "facts": [
  {
   "key": "aw_waf_table_dimensions",
   "label": "World Armwrestling Federation regulation table: dimensions and construction",
   "status": "verified",
   "value_si": 1.016,
   "unit_si": "m",
   "display": "Stand-up table 101.6 cm (40 in) from floor to top; top 91.4 cm across × 66.0 cm deep; elbow pads 17.8 cm square, 5.1 cm thick, set 5.1 cm from their edge; touch (pin) pads 25.4 × 10.2 cm; hand pegs 2.5 cm across, 15.2 cm high; top normally 1.9 cm (3/4 in) plywood; frame of steel tubing no wider than 5.1 cm",
   "sources": [
    {
     "title": "WAF: Armwrestling Table (official rules page)",
     "url": "https://www.waf-armwrestling.com/armwrestling-rules/armwrestling-table/"
    }
   ],
   "notes": "Confirmed on the WAF page (fetched). The sit-down table is 71.1 cm. The page gives no centre-to-centre spacing for the elbow pads (see aw_elbow_pad_spacing). Equipment makers quote 104 cm; the WAF page says 101.6 cm."
  },
  {
   "key": "aw_elbow_pad_spacing",
   "label": "Distance between elbow-pad centres on a WAF table",
   "status": "estimate",
   "value_si": 0.38,
   "unit_si": "m",
   "display": "~38 cm (computed from the WAF dimensions)",
   "sources": [
    {
     "title": "WAF: Armwrestling Table",
     "url": "https://www.waf-armwrestling.com/armwrestling-rules/armwrestling-table/"
    }
   ],
   "notes": "My arithmetic, not a published value: 66.0 cm depth − 2 × (5.1 cm edge gap + 17.8/2 cm half-pad) = 38.0 cm. Assumes the 5.1 cm is measured to the pad's outer edge. Used only to place the bodies across the table."
  },
  {
   "key": "aw_pin_and_elbow_foul_rules",
   "label": "Arm wrestling: what counts as a pin, and the elbow foul",
   "status": "verified",
   "display": "Pin: the fingers or wrist go below the pin line (touching the pin pad is not required). Fouls include the elbow losing contact with the pad (up, or off the front, back or sides). Any two fouls lose the match.",
   "sources": [
    {
     "title": "Canadian Armwrestling Federation: Rules (summarized), Sept 2023",
     "url": "https://cawf.ca/rulessummarized"
    }
   ],
   "notes": "Confirmed on the CAWF page (fetched). The page does not say whether it follows WAF wording word for word. The WAF rulebook PDFs (armsport.sk mirrors) were blocked, so the WAF text itself was not seen."
  },
  {
   "key": "aw_humeral_fracture_series_ogawa_1997",
   "label": "Humeral shaft fractures from arm wrestling: 30-case series",
   "status": "verified",
   "value_si": 30,
   "unit_si": "cases",
   "display": "30 humeral shaft fractures from arm wrestling (28 men, 2 women; age 15-60, mean 30): all spiral; 23% with a medial butterfly fragment, 23% with radial nerve palsy; all happened while full force was being exerted",
   "sources": [
    {
     "title": "Ogawa K, Ui M. Humeral shaft fracture sustained during arm wrestling: report on 30 cases and review of the literature. J Trauma 1997;42(2):243-6 (PubMed 9042875)",
     "url": "https://pubmed.ncbi.nlm.nih.gov/9042875/"
    }
   ],
   "notes": "Abstract confirmed through NCBI E-utilities (efetch, PMID 9042875), because the PubMed page needs cookies. The authors attribute the fractures to the shoulder internal rotators switching suddenly from maximal concentric to eccentric contraction, which produces an intense rotational force. Context only: Rex and Ollie are indestructible."
  },
  {
   "key": "aw_humeral_torque_pitchers_sabick_2004",
   "label": "Peak torque about the humerus's long axis in professional pitchers",
   "status": "verified",
   "value_si": 92,
   "unit_si": "N m",
   "low_si": 76,
   "high_si": 108,
   "display": "92 ± 16 N·m (25 professional pitchers in games), averaging 48% of the humerus's theoretical torsional strength",
   "sources": [
    {
     "title": "Sabick MB et al. Humeral torque in professional baseball pitchers. Am J Sports Med 2004;32(4):892-8 (PubMed 15150034)",
     "url": "https://pubmed.ncbi.nlm.nih.gov/15150034/"
    },
    {
     "title": "Boise State ScholarWorks record of the same paper",
     "url": "https://scholarworks.boisestate.edu/mecheng_facpubs/27/"
    }
   ],
   "notes": "Abstract confirmed on both pages. low/high are mean ± 1 SD."
  },
  {
   "key": "aw_humerus_torsional_strength",
   "label": "Twist that breaks a human upper-arm bone (humerus)",
   "status": "estimate",
   "value_si": 190,
   "unit_si": "N m",
   "low_si": 25,
   "high_si": 190,
   "display": "~190 N·m theoretical for a healthy adult humerus; drilled cadaver humeri failed at 25-31 N·m",
   "sources": [
    {
     "title": "Sabick et al. 2004 (92 N·m = 48% of theoretical strength)",
     "url": "https://pubmed.ncbi.nlm.nih.gov/15150034/"
    },
    {
     "title": "Dini AA et al. 2021, Arthroscopy, Sports Medicine, and Rehabilitation: humeri with tenodesis drill holes failed at 31.35 and 25.08 N·m (DOAJ record)",
     "url": "https://doaj.org/article/e5c4f2c4ef3943bda8c6198bdf01cfcb"
    }
   ],
   "notes": "192 N·m is my arithmetic (92 / 0.48), not a measured failure. The Dini cadaver bones had drill holes, which act as stress raisers, so they are a low bound rather than a typical value. A textbook figure of 60 N·m (Kane & Sternheim, reproduced on a Harvard demonstrations page) could not be fetched (403) and is not used."
  },
  {
   "key": "aw_internal_rotation_torque_lo_2013",
   "label": "Shoulder internal-rotation torque in arm-wrestling position (ordinary young men)",
   "status": "verified",
   "value_si": 79.55,
   "unit_si": "N m",
   "low_si": 66.32,
   "high_si": 86.02,
   "display": "Winners 79.6 ± 19.3 N·m concentric and 86.0 ± 21.3 N·m eccentric at 45°/s; losers 66.3 ± 11.5 and 71.2 ± 14.6 N·m (30 men, 66 kg, 1.74 m; Biodex)",
   "sources": [
    {
     "title": "Lo K-C, Wu H-W, Hong M-K, Wang L-H. Armwrestling exercise and shoulder internal rotation strength. ISBS 2013 proceedings",
     "url": "https://ojs.ub.uni-konstanz.de/cpa/article/view/5698"
    }
   ],
   "notes": "Read in the full PDF (Table 1). Elbow at 90° in the arm-wrestling start position; the body was not strapped down. These are untrained university volunteers, not elite athletes."
  },
  {
   "key": "aw_elite_hook_force_kamayev_2024",
   "label": "Hand force of elite arm wrestlers in a hook-pull test",
   "status": "verified",
   "value_si": 818.9,
   "unit_si": "N",
   "low_si": 459,
   "high_si": 818.9,
   "display": "Up to 83.5 kgf (819 N), right arm, a 90 kg multiple world champion; 75.6 kgf (741 N) for a 136 kg champion; 46.8-49.4 kgf for a 62 kg champion",
   "sources": [
    {
     "title": "Kamayev O et al. Features of the manifestation of strength and speed-strength abilities of elite armwrestlers of different weight categories. Slobozhanskyi Herald of Science and Sport 2024;28(2) (Table 1)",
     "url": "https://shssjournal.com/index.php/journal/article/view/153"
    }
   ],
   "notes": "Read in the PDF (https://shssjournal.com/index.php/journal/article/download/153/41/349). Measured with a Kern FL1K strain-gauge dynamometer on an armwrestling table. The 'hook' pulls a handle toward the chest, so it is not the pure sideways twist of a match. Used only to bound the arm-force share."
  },
  {
   "key": "aw_force_share",
   "label": "Arm-wrestling force at the hand as a share of full strength",
   "status": "estimate",
   "value_si": 0.11,
   "unit_si": "1",
   "low_si": 0.05,
   "high_si": 0.16,
   "display": "11% of full strength, sideways at the clasped hands (both muscle models)",
   "sources": [
    {
     "title": "Sabick et al. 2004 (humerus theoretical strength)",
     "url": "https://pubmed.ncbi.nlm.nih.gov/15150034/"
    },
    {
     "title": "Lo et al. 2013 (ordinary men's internal-rotation torque)",
     "url": "https://ojs.ub.uni-konstanz.de/cpa/article/view/5698"
    },
    {
     "title": "Kamayev et al. 2024 (elite hook force)",
     "url": "https://shssjournal.com/index.php/journal/article/view/153"
    }
   ],
   "notes": "Estimate. The share is set so the sim's record-human strength (511 kg deadlift, 5,011 N) twists a human-sized arm with about the theoretical humerus strength: 191.7 N·m / (0.19 × 1.7562 m × 5,011.2 N) = 0.1146, rounded to 0.11. Reasoning: humeral fractures happen at full effort (Ogawa & Ui). Low bound: ordinary men's ~80 N·m over a 0.33 m lever gives 240 N, 0.05 of record strength. High bound: the elite 819 N hook pull is 0.16 (not a pure twist). One share serves both modes because the contest is mostly isometric; comic mode is therefore never weaker than real."
  },
  {
   "key": "anthro_forearm_center_of_grip_ansur2",
   "label": "Elbow-to-grip length (US Army men, ANSUR II)",
   "status": "verified",
   "value_si": 0.349,
   "unit_si": "m",
   "low_si": 0.331,
   "high_si": 0.367,
   "display": "Forearm-center of grip length 34.90 cm (SD 1.80) for men whose mean stature is 175.62 cm, i.e. 0.199 of height",
   "sources": [
    {
     "title": "Gordon CC et al. 2012 Anthropometric Survey of U.S. Army Personnel: Methods and Summary Statistics, NATICK/TR-15/007 (2014), dimension 37 and 75",
     "url": "https://tools.openlab.psu.edu/publicData/ANSURII-TR15-007.pdf"
    }
   ],
   "notes": "Measured horizontally from the olecranon (back of the elbow) to the centre of a gripped 1-1/4 in dowel, elbow at 90°. low/high are ±1 SD. 34.90/175.62 = 0.1987 (my arithmetic)."
  },
  {
   "key": "anthro_radiale_stylion_ansur2",
   "label": "Forearm length, elbow to wrist (US Army men, ANSUR II)",
   "status": "verified",
   "value_si": 0.2679,
   "unit_si": "m",
   "display": "Radiale-stylion length 26.79 cm (SD 1.54), i.e. 0.1525 of the 175.62 cm mean stature",
   "sources": [
    {
     "title": "Gordon CC et al. NATICK/TR-15/007 (2014), dimension 67",
     "url": "https://tools.openlab.psu.edu/publicData/ANSURII-TR15-007.pdf"
    }
   ],
   "notes": "Used as the elbow-wrist length for the Dempster/Winter forearm+hand inertia."
  },
  {
   "key": "anthro_forearm_hand_inertia",
   "label": "Forearm + hand segment: mass, centre of mass, radius of gyration",
   "status": "verified",
   "value_si": 0.022,
   "unit_si": "1",
   "display": "2.2% of body mass; centre of mass 0.682, radius of gyration about the elbow 0.827 of the elbow-wrist length",
   "sources": [
    {
     "title": "BMClab (M. Duarte): Dempster body-segment parameters as adapted by Winter (2009), data table",
     "url": "https://raw.githubusercontent.com/BMClab/BMC/master/data/BSP_DempsterWinter.txt"
    },
    {
     "title": "BMClab notebook: Body segment parameters",
     "url": "https://nbviewer.jupyter.org/github/demotu/BMC/blob/master/notebooks/BodySegmentParameters.ipynb"
    }
   ],
   "notes": "Row 'Forearm hand, EJC-STYL: 0.022, 0.682, 0.318, 0.468, 0.827, 0.565'. This is a university lab's reproduction of Winter (2009) Table 4.1; it was not checked against the printed book. Consistent with the project's verified Dempster fractions (forearm 1.6% + hand 0.6%)."
  },
  {
   "key": "aw_lever_and_effective_mass",
   "label": "Arm-wrestling lever and forearm effective mass",
   "status": "estimate",
   "value_si": 0.19,
   "unit_si": "1 (× height)",
   "display": "Lever from the humerus axis to the grip = 0.19 × height (0.38 m at 2 m). Each forearm + hand acts like 0.97% of its owner's body mass at the grip.",
   "sources": [
    {
     "title": "ANSUR II NATICK/TR-15/007",
     "url": "https://tools.openlab.psu.edu/publicData/ANSURII-TR15-007.pdf"
    },
    {
     "title": "BMClab Dempster/Winter table",
     "url": "https://raw.githubusercontent.com/BMClab/BMC/master/data/BSP_DempsterWinter.txt"
    }
   ],
   "notes": "Lever: ANSUR's 0.199 H is measured from the back of the elbow; the bone's long axis sits about 1-2 cm in front of that, so 0.19 H is used. Effective mass: 0.022 × (0.827 × 0.1525 / 0.19)^2 = 0.009693 of body mass. The upper arm spinning about its own axis would add under 10%; it is ignored. Human proportions are applied to Rex and Ollie, as the project already does for segment masses."
  },
  {
   "key": "table_ps2_panel_requirements",
   "label": "Minimum strength of a 19 mm structural floor panel (US PS 2-18)",
   "status": "verified",
   "value_si": 2450,
   "unit_si": "N",
   "display": "Single Floor 24 o.c. panels: ultimate concentrated static load at least 2.45 kN (550 lbf); impact test 102 N·m (75 lbf·ft), after which the panel must still carry 1.78 kN (400 lbf)",
   "sources": [
    {
     "title": "NIST Voluntary Product Standard PS 2-18, Performance Standard for Wood Structural Panels, Table 2",
     "url": "https://www.nist.gov/document/ps2-18finalapr2019dfareviewedpdf"
    }
   ],
   "notes": "Read in Table 2 and Section 7.1 (ASTM E661: a 76 mm disc at mid-span, 610 mm span). These are minimums for a pass, not typical failure loads."
  },
  {
   "key": "table_elbow_capacity",
   "label": "Downward load a regulation table takes under one elbow pad",
   "status": "estimate",
   "value_si": 10000,
   "unit_si": "N",
   "low_si": 2500,
   "high_si": 50000,
   "display": "~10 kN (2.5-50 kN) at regulation size; scaled with table size squared",
   "sources": [
    {
     "title": "NIST PS 2-18 Table 2",
     "url": "https://www.nist.gov/document/ps2-18finalapr2019dfareviewedpdf"
    },
    {
     "title": "WAF table construction",
     "url": "https://www.waf-armwrestling.com/armwrestling-rules/armwrestling-table/"
    }
   ],
   "notes": "Estimate. PS 2 guarantees at least 2.45 kN for a 19 mm panel under a 76 mm disc at mid-span. Elbow pads sit 5 cm from the edge, over the steel frame, and spread the load over 18 × 18 cm, so the real capacity should be several times higher; the 5 cm steel-tube legs take tens of kN. Matters only at high density."
  },
  {
   "key": "table_slam_rating",
   "label": "Slam energy the table top is built to survive",
   "status": "estimate",
   "value_si": 102,
   "unit_si": "J",
   "display": "~100 J at regulation size (the PS 2 impact test); scaled with table size cubed",
   "sources": [
    {
     "title": "NIST PS 2-18 Table 2, note (b)",
     "url": "https://www.nist.gov/document/ps2-18finalapr2019dfareviewedpdf"
    }
   ],
   "notes": "Estimate. A pin slam up to this energy: table holds. Up to 10×: may crack the top. Over 10×: goes through the table. The 10× cut-off is a judgment call."
  },
  {
   "key": "sumo_ring_diameter",
   "label": "Sumo ring (dohyō) inner circle",
   "status": "verified",
   "value_si": 4.55,
   "unit_si": "m",
   "display": "Bouts are confined to an inner circle a little over 4.55 m across (platform 6.7 m square, 60 cm high)",
   "sources": [
    {
     "title": "Japan Sumo Association: Sumo introduction (English PDF)",
     "url": "https://www.sumo.or.jp/pdf/en/sumo_introduction.pdf"
    }
   ],
   "notes": "Confirmed in the PDF text. The sim uses 4.55 m at the default 2 m size and scales it with the pair's mean height."
  },
  {
   "key": "codata_G",
   "label": "Newtonian constant of gravitation",
   "status": "verified",
   "value_si": 6.6743e-11,
   "unit_si": "m^3 kg^-1 s^-2",
   "low_si": 6.67415e-11,
   "high_si": 6.67445e-11,
   "display": "6.674 30(15) × 10⁻¹¹ m³ kg⁻¹ s⁻² (CODATA 2022)",
   "sources": [
    {
     "title": "NIST CODATA: Newtonian constant of gravitation",
     "url": "https://physics.nist.gov/cgi-bin/cuu/Value?bg"
    }
   ],
   "notes": "Probably also supplied by the density area; use one shared K.G."
  },
  {
   "key": "newton_impact_depth",
   "label": "Newton's impact-depth approximation",
   "status": "verified",
   "display": "D ≈ L × ρ_impactor / ρ_target; valid when friction is negligible and the impact is slower than sound in the target",
   "sources": [
    {
     "title": "Wikipedia: Impact depth",
     "url": "https://en.wikipedia.org/wiki/Impact_depth"
    }
   ],
   "notes": "A rough approximation. It is used only to say that a far-denser thrown partner punches in rather than making a crater; Collins crater scaling is fitted to impactors of rock or iron density."
  },
  {
   "key": "ollie_footing_assumption",
   "label": "Ollie's grip on the ground (boots, no claws)",
   "status": "estimate",
   "display": "Same traction as Rex's feet on each surface. 'Dug in' for Ollie means boots kicked into footholds, given the same buried area as Rex's claws (0.2 m² at 2 m).",
   "sources": [
    {
     "title": "Project fact set: ground traction coefficients (research/final-environment.json)",
     "url": "https://www.tugraz.at/fileadmin/user_upload/Institute/IAG/Files/18_Bearing_Capacity_of_Soils-USACE.pdf"
    }
   ],
   "notes": "Assumption, not sourced: no canon says how Ollie's boots grip. Rubber soles on dry pavement grip in roughly the same range as the sim's claw values; on ice and steel the values are rough for both."
  },
  {
   "key": "ground_tear_around_anchor",
   "label": "Force at which the ground around a bolted stance tears out",
   "status": "estimate",
   "display": "Ground shear strength × 0.2 m² buried area at 2 m: concrete 300 kN, granite 7.2 MN, loose sand 200 N",
   "sources": [
    {
     "title": "Project surface data (shear values used for 'claws dug in')",
     "url": "https://www.tugraz.at/fileadmin/user_upload/Institute/IAG/Files/18_Bearing_Capacity_of_Soils-USACE.pdf"
    }
   ],
   "notes": "Estimate that reuses the engine's dug-in limit. Bolted to the planet never gives; only the surface layer around the bolts breaks. Real tensile strengths differ from these shear values by up to about 3× either way (concrete ~2-3 MPa, granite roughly 5-25 MPa)."
  },
  {
   "key": "duo_gravity_distances",
   "label": "Centre-to-centre distances used for their mutual gravity",
   "status": "estimate",
   "display": "Touching: two balls of their volume (0.70 m at 2 m). Across the table: 0.66 m table depth (scaled) + 0.25 × mean height (1.25 m). One held overhead: 0.65 × lifter's height + 0.1 × partner's height (1.5 m).",
   "sources": [
    {
     "title": "WAF table depth",
     "url": "https://www.waf-armwrestling.com/armwrestling-rules/armwrestling-table/"
    }
   ],
   "notes": "Estimates. Treating tall bodies as balls changes the force by up to about 2× at contact (two touching 2 m cylinders pull roughly 1.4× harder than the equal-volume balls)."
  }
 ],
 "inputs": "Contexts already built by app.html. cR = ctx() for Rex and cO = ctxOllie() for Ollie. Each is { F (N, may be Infinity), mode 'comic'|'real', body = P.makeBody({H, m}) with H, s = H/2, m, volume (0.18 s^3 m^3), rho, footArea, footB, digArea (0.2 s^2), frontArea (0.8 s^2), Cd 1.0, handEff (0.022 m), strokes.throw (1.6 s), surface (shared: mu, shear, qult, rho, granular, Bref), groundHolds (shared comic-ground flag), anchor 'friction'|'braced'|'bolted' (Ollie's own: state.oAnchor) }. New UI state, to be added to DEFAULTS and VALID: wrestleMove 'push'|'shove'|'lift'|'throw' (default 'push'); wrestleWho 'rex'|'ollie'|'both' (default 'rex'; 'both' only for shove); the throw reuses state.angle. Engine values used: K.g, K.c, K.rho0, MUSCLE.punch.vmax (17 m/s at 2 m, the arm's top speed in real mode), MUSCLE.throwPush {forceFrac 0.523, comicFrac ≈ 0.1682, vmax 35}, MUSCLE.k 0.25, anchorCapacity, pushApart, momentumToV/KE, sprint (walking speed cap), lift, throwObject (via throwOnce), craterDiameter, seismicMagnitude, blastRadius. From the density area (use if it exists, otherwise add here): K.G = 6.67430e-11, an isBlackHole(body) flag (2Gm/c^2 ≥ equivalent-sphere radius), a canStand(ctx) flag (strength vs own weight), and the sinking flag (standRatio > 1 off comic ground, via P.lift(c, {m: 0}).standRatio). New engine constants (P.AW): forceFrac 0.11, lever 0.19, forearm 0.1525, effMass 0.009693, pinAngle π/2, elbowLoad 0.036, holdArm 0.012043. TABLE: refH 1.7562 m, depth 0.660 m, elbowCap 10e3 N, slamJ 102 J. RING_D 4.55 m (at a mean height of 2 m). HUMERUS_NM 190. A working reference prototype of every function below is at /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo/contest/contest.js, with the runner final.js (node final.js) that prints every test value.",
 "equations": "E1. Newton's third law at the hands or chests: F_Rex→Ollie = −F_Ollie→Rex. The whole push C reaches each body. With ΣF = 0, each one's feet must supply C, so each can press only as hard as his footing R_i allows. Strength beyond R_i just makes him slide.\nE2. Footing (existing anchorCapacity, θ = 0): R_i = μ·min(m_i g, N_max) + [dug in] τ_s·A_dig, where N_max = q_ult·2A_foot (∞ on comic ground). Bolted: R = ∞. Default: 0.6 × 180 × 9.80665 = 1,059.12 N; dug in on concrete adds 1.5 MPa × 0.2 m² = 300 kN.\nE3. Arm force: P_i = 0.11·F_i in both modes. Calibration: 92 N·m / 0.48 = 191.7 N·m (theoretical humerus strength); 191.7 / (0.19 × 1.7562 m × 511 × 9.80665 N) = 0.1146, rounded to 0.11. Valid as a share at any strength (comic premise).\nE4. Usable force: A_i = min(P_i, R_i). If A_R = A_O (relative 1e-9, finite only): stalemate with contact C = A. If both are ∞ (both bolted and infinite): undefined, ∞ − ∞. Otherwise the larger one pins.\nE5. Lever L_i = 0.19 H_i. Twist on the upper arm τ_i = A_i·L_i (N·m), compared with 190 N·m. In a stalemate τ = C·L.\nE6. Arm inertia: I_i = 0.022 m_i (0.827 × 0.1525 H_i)^2 about the elbow. At the grip m_eff,i = I_i/L_i^2 = 0.009693 m_i, independent of height. M = 0.009693 (m_R + m_O).\nE7. Pin. Path s = (π/2)·L_loser: a quarter turn, because the pin line (top of a 10.2 cm touch pad) is about level with the elbow pivot (5.1 cm pad + elbow). Comic, constant net ΔA = A_w − A_l, relativistic constant force: x(t) = (M c²/ΔA)(√(1 + (ΔA t/Mc)²) − 1), so t = (M c/ΔA)·√((1 + ΔA s/(M c²))² − 1), v = momentumToV(ΔA t, M), slam energy E = ΔA·s (work-energy, exact). Below 1% of c: t = √(2sM/ΔA), v = √(2ΔA s/M). This is exactly pushApart({F: A_w, d: s, mA: M, mB: M, RA: Infinity, RB: A_l, mode: 'comic'}), with side A fixed and the loser resisting statically. Real: pushApart({F: P_w, Fcap: R_w if R_w < P_w, d: s, mA: M, mB: M, RA: Infinity, RB: A_l, mode: 'real', vmax: 17·s_w}); the winner's force is P_w·Hill(v/vmax) with k = 0.25, and the loser resists with A_l at any speed (engine Hill(u ≤ 0) = 1). Terminal speed v_t = vmax(1 − r)/(1 + r/k) with r = A_l/P_w.\nE8. Holding the forearm up: P_i ≥ 0.012043 m_i g, from 0.022 m g × 0.682 × 0.1525 H / 0.19 H with the forearm horizontal (worst case).\nE9. Table scaled to the pair: s_t = ((H_R + H_O)/2)/1.7562. Elbow load W_e,i = 0.036 m_i g (forearm + hand 2.2% plus half the upper arm 1.4%, Dempster). Capacity Q_e = 10 kN·s_t² (∞ on comic ground). Slam rating E_t = 102 J·s_t³. Report W_e/Q_e and E/E_t.\nE10. Slam effects, mirroring stomp. If 2 km/s ≤ v < 0.01c and not comic ground: craterDiameter({L: (6M/(π ρ_w))^(1/3), v, rhoI: ρ_w, rhoT: surface.rho, angleDeg: 90, E}). Always: seismicMagnitude(E), and blast via blastBlock(E). At v ≥ 0.01c: energy release only, no crater fit.\nE11. Ground around a bolted stance: T_tear,i = τ_s × A_dig,i (∞ on comic ground). Ratio A_i/T_tear,i in arm wrestling; C/min(T_tear) in the pushing match.\nE12. Pushing match. Hold H_i = min(F_i, R_i) (bolted: ∞). Drive D_i = min(F_i, μ·min(m_i g, N_max,i) + [dug in] 0.25 τ_s A_dig); 0 if bolted or unable to stand. The 0.25 factor is the engine's sprint rule for claws while moving. Net n_R = D_R − H_O and n_O = D_O − H_R. Since D ≤ H, at most one is positive. Walk-out: a = n/(m_R + m_O); x = ring radius = 4.55 m × H̄/2 m / 2 (2.275 m by default); v_cap = sprint(c_w).vTop. If √(2ax) ≤ v_cap: t = √(2x/a), v = √(2ax). Otherwise t = v_cap/a + (x − v_cap²/2a)/v_cap and v = v_cap. Deadlock contact C = min(H_R, H_O). Both bolted: C = max(F_R, F_O), undefined if both are ∞.\nE13. Shove. F_s = min(F_A, 2·share·F_A), with share = comicFrac 0.1682 or real 0.523 per hand, as in the throw's shove. Stroke d = strokes.throw (1.6 m × s_A). m_arms = 2 handEff_A; mA = m_A − m_arms; mB = m_B + m_arms. RA(F) = Rslide_A(F) + F_g; RB = R_B + F_g, where F_g is mutual gravity at contact, held constant (an upper bound). Then pushApart, blended comic/real like comicAtLeastReal on v_B, with throwOnce's held-back variant. Momentum split as in throwOnce: p_B' = p_B m_B/(m_B + m_arms); p_A' = max(0, p_A − p_B m_arms/(m_B + m_arms)). Slide after contact: m v dv/dx = −(R + k v²) with k = ½ρ0 Cd A_front, so x = (m/2k)·ln(1 + k v²/R) (below 0.01c; R = 0 gives ∞). Out of the ring if x_B,stroke + x_slide,B ≥ x. Bound together if v_A' + v_B' < √(2G(m_A + m_B)/(d0 + d)). Gravity lock if the push stalls and F_g ≥ F_s.\nE14. Lift. Need = m_B g + G m_A m_B/d_over² + T_pull, with T_pull = τ_s A_dig,B if B is dug in and ∞ if bolted. The ground under the lifter carries (m_A + m_B) g / (2 A_foot) against q_ult (P.lift). Mutual gravity is internal to the pair and does not load the ground. The partner pushing down on the lifter is internal too, so he cannot make himself heavier.\nE15. Throw. throwObject(c_A, {m: m_B, area: A_front,B, Cd: 1.0, CdSup: 1.75, rho: ρ_B, L: (6V_B/π)^(1/3), extraHold: F_g + T_pull, extraResist: F_g}, θ). Requires two new optional fields in throwOnce: needed = mB g + extraHold, and RB += extraResist (both default 0, so existing results are unchanged). The partner escapes the thrower if v ≥ √(2G(m_A + m_B)/d_over). If ρ_B/ρ_ground > 10, crater scaling is invalid; report Newton's depth D ≈ L ρ_B/ρ_ground instead.\nE16. Mutual gravity: F_g = G m_A m_B/d². Equivalent-ball radius r = (3V/4π)^(1/3) = 0.3503 m at 2 m. d_contact = r_A + r_B; d_table = max(0.660 s_t + 0.25 H̄, r_A + r_B); d_over = max(0.65 H_A + 0.1 H_B, r_A + r_B). Escape speed v_esc = √(2G(m_A + m_B)/d). Falling together from rest at d0 to d1, with μ = G(m_A + m_B) and x = d1/d0: t = √(d0³/2μ)·[√(x(1−x)) + arccos√x]; v_rel = √(2μ(1/d1 − 1/d0)); E = G m_A m_B (1/d1 − 1/d0). Newtonian gravity is fine: G m/(r c²) = 1.5e-10 even for a neutron-star-dense 2 m body. Black hole when 2Gm/c² ≥ r, i.e. ρ ≥ 1.31e27 kg/m³ at 2 m.",
 "algorithm": "ENGINE (engine.js). Add the constants AW, TABLE, RING_D and HUMERUS_NM (values in inputs). Add K.G if the density area has not. Add these helpers:\n- rEq(b) = cbrt(3 b.volume/(4π)).\n- mutualGravity(bA, bB, d) → {d, F, vEsc, Ebind}.\n- fallTogether(bA, bB, d0, d1) → {t, vRel, E}; returns zeros when d0 ≤ d1.\n- footing(c, mA) = anchorCapacity({body: c.body, surface: c.surface, theta: 0, anchor: c.anchor, groundHolds: c.groundHolds, mA}).\n- groundTear(c) = c.groundHolds ? ∞ : c.surface.shear × c.body.digArea.\n- same(a, b) = a === b || (isFinite(a) && isFinite(b) && |a − b| ≤ 1e-9·max(|a|, |b|)). This guard matters: a naive relative test calls ∞ equal to any finite number.\n- shoveDrive(c) = min(c.F, 2·c.F·(real ? 0.523 : comicFrac)).\nPrelude for every duo function: if isBlackHole(A or B), return {blackHole: true}. If !groundHolds and either body's standRatio > 1, set sinks flags and rerun the contest with groundHolds = true (the bay prefixes the verdict accordingly).\n\narmWrestle(cA, cB):\n1. P_i = 0.11 F_i; f_i = footing(c_i); A_i = min(P_i, f_i.R); footLimited_i = f_i.R < P_i; L_i = 0.19 H_i.\n2. armHold_i = 0.012043 m_i g; canHoldArm_i = P_i ≥ armHold_i.\n3. s_t = mean H / 1.7562; elbowCap = groundHolds ? ∞ : 10e3 s_t²; elbowLoad_i = 0.036 m_i g; tableRatio = max(elbowLoad)/elbowCap; slamCap = groundHolds ? ∞ : 102 s_t³.\n4. d_t = max(0.660 s_t + 0.25 H̄, rA + rB); grav = mutualGravity(A, B, d_t); fall = fallTogether(A, B, d_t, rA + rB); pulledTogether = grav.F > min(R_A, R_B) && grav.F > max(shoveDrive_A, shoveDrive_B).\n5. If both A_i are infinite, outcome = 'undefined' and return.\n6. If same(A_A, A_B): outcome 'stalemate', contact = A_A.\n7. Otherwise w = argmax A. s = (π/2)·0.19·H_loser; M = 0.009693 (m_A + m_B); vmax = 17·s_w. Comic: push = pushApart({F: A_w, d: s, mA: M, mB: M, RA: Infinity, RB: A_l, mode: 'comic'}). Real: push = pushApart({F: P_w, Fcap: f_w.R < P_w ? f_w.R : undefined, d: s, mA: M, mB: M, RA: Infinity, RB: A_l, mode: 'real', vmax}). pin = {t: push.t, v: push.vB, E: push.EB, s, M, dA: A_w − A_l}; contact = A_l; slamRatio = E/slamCap.\n8. Slam effects per E10, using the winner's density.\n9. τ_i = A_i L_i; humerusRatio_i = τ_i/190; tear_i = bolted_i ? A_i/groundTear(c_i) : 0.\n\npushMatch(cA, cB):\n1. f_i = footing(c_i); H_i = bolted ? ∞ : min(F_i, f_i.R).\n2. drive_i = (bolted || !canStand) ? 0 : μ·min(m_i g, f_i.Nmax) + (braced ? 0.25 τ_s A_dig : 0); D_i = min(F_i, drive_i).\n3. ring = 4.55 (H_A + H_B)/4; x = ring/2; Fg = mutualGravity(A, B, rA + rB).\n4. If both bolted: outcome 'bothBolted'; contact = (both F infinite) ? NaN (undefined) : max(F_A, F_B); tear = contact/min(groundTear).\n5. nA = D_A − H_B; nB = D_B − H_A; tol = 1e-9·max(D_A, D_B). If nA > tol, A walks B out; else if nB > tol, B walks A out; else deadlock: contact = min(H_A, H_B); allOut = neither bolted && F_A > R_A && F_B > R_B; if allOut, attach shoveBoth(cA, cB).\n6. Walk-out: M = m_A + m_B; a = n/M; vCap = sprint(c_w).vTop (if 0, treat the drive as 0). Timing per E12.\n7. Flags: canLift_i (liftPartner(c_i, c_other).can); gravityLock = Fg.F > max(shoveDrive_A, shoveDrive_B).\n\nshove(cA, cB) = comicAtLeastReal-style blend of shoveOnce on vB (metric r.vB, cap sizeVmax('throwPush', A)). shoveOnce follows E13 and copies throwOnce's held-back loop: if F_s > Rlim = (f_A.R + F_g)(1 − 1e-9) > RB, try Fcap/F = Rlim × [1, 1.25, 1.6, 2, 3, 5, 10] in real mode or Rlim in comic mode, and keep the largest pB. Return {Fdrive, d, push, heldBack, vA, vB, EA, EB, slideA, slideB, outOfRing, Fg, gravityLock, boundTogether, vEsc, stalled, relativistic (v > 0.01c), basis}.\nshoveBoth(cA, cB): if shoveDrive_A ≥ shoveDrive_B, shove(cA, cB) with shover 'A'; otherwise shove(cB, cA) with shover 'B'. Both infinite on finite footing is just an infinite push.\n\nliftPartner(cA, cB): per E14. Return {weight, Fg, dOver, pullOut, need, can, margin = F/need, pressure, qult, groundRatio}, with ground values from P.lift(cA, {m: m_B}). If B is bolted, need = ∞.\n\nthrowPartner(cA, cB, θ): if B is bolted, return {bolted: true}. If F_A < m_B g + F_g + T_pull, return canHold false. Otherwise r = throwObject(cA, obj, θ) per E15. Add vEsc and fallsBack = r.v < vEsc; penetrates = ρ_B/ρ_ground > 10; newtonDepth = L ρ_B/ρ_ground. When penetrates, the bay suppresses the crater.\n\nExport: AW, TABLE, armWrestle, pushMatch, shove, shoveBoth, liftPartner, throwPartner, mutualGravity, fallTogether, rEq (plus isBlackHole if not provided elsewhere).\n\nAPP (app.html).\nbayArm(): cR = ctx(), cO = ctxOllie(); r = P.armWrestle(cR, cO); render duoHeader, then verdict, chips, tiles, logBars, happens and math (see page_text).\nbayWrestle(): a sub-move chip row (Shoving match / Shove / Lift / Throw) and a who row (Rex → Ollie, Ollie → Rex, and 'Both at once' for Shove only). For Throw, add angleControl(). Map who to (cA, cB) = (cR, cO) or (cO, cR) and name the actors accordingly. Throw rendering can reuse bayThrow's flight text by passing a pseudo-object {short: 'Ollie'|'Rex', ...}.\nPersist wrestleMove and wrestleWho in state.",
 "edge_cases": "INFINITE STRENGTH. One side infinite on finite footing: A = R, so infinity buys nothing past the feet (the ∞ Rex vs record-human test gives a pin with only 507.9 N to spare). Infinite and bolted against a finite side: comic pin in s/c = 1.99 ns at light speed with unbounded slam energy (blast and quake 'unbounded'; the ground around his bolts tears, ratio ∞ unless comic ground). Real muscle: the hand tops out near 17 m/s (vmax) with ~504 J. Both infinite and both bolted: arm wrestling and pushing match return 'undefined'. Say so plainly: infinity minus infinity has no value, and an unstoppable force meeting an immovable object is a contradiction, not a result. Both infinite with finite footing: arm wrestling and pushing match are footing-limited stalemates. An all-out shove-off is an infinite push on finite resistance, so both leave at light speed with unbounded energy. That is well defined (∞ force against finite R), not ∞ − ∞. Guard: the same() check must treat ∞ vs finite as unequal; NaN contact (∞ vs ∞) maps to 'undefined', never a number.\nBOTH TOO STRONG FOR THEIR FOOTING (the default Hulk pair on concrete). Arm wrestling is a stalemate at 1,059 N each; pushing all-out would drag each off his pad (a foul in competition). The pushing match is a deadlock at 1,059 N, and allOut shows the skater shove-off: 49.3 m/s each, sliding 138-143 m. A heavier body or dug-in claws/boots break the tie; strength does not.\nBOLTED. Bolted bodies cannot walk (drive 0), so a bolted winner can only shove. A bolted body cannot be lifted or thrown (need = ∞), and a shove against him just recoils the shover. Both bolted in the pushing match: nothing moves; C = max(F_R, F_O) stretches the ground between them, and the ground around the bolts tears above τ_s × A_dig (concrete 300 kN, so 2.97× at the default Hulk strength; granite 7.2 MN holds). Comic ground: no tearing and no table damage.\nCOMIC GROUND. Sets the table and the ground to unbreakable (elbowCap and slamCap ∞, no crater, no tear). Friction still limits footing (engine convention). Dug-in shear also stays at τ_s A_dig, as in the solo moves.\nEXTREME DENSITY. Plush (30 kg/m³, 5.4 kg each): footing is 31.8 N, so everything is a footing stalemate. A shove sends a plush body off at 285 m/s, but air drag stops it in ~39 m, and a thrown plush Ollie flies only 35 m despite a 226 m/s launch. Below air density (ρ ≤ 1.225 kg/m³) he floats: footing is 0 if the density area applies buoyancy (apparent weight max(0, m − ρ_air V)g), so any push just drifts both apart. Real dense materials (osmium 22,590 kg/m³, 4,066 kg): the table still holds (elbow load 1.44 kN against 13 kN). Neutron-star density (example 4e17 kg/m³, 7.2e16 kg each; the density area supplies the final value): they cannot hold their forearms up without 8.5e15 N of arm force; elbow load 2.5e16 N against 13 kN (2e12×); both sink on real ground (flag, then rerun on comic ground); mutual gravity across the table is 2.2e23 N, so they fall together in 0.39 ms at 3,476 m/s, releasing 2.2e23 J; at contact 7.05e23 N, about 1e6× their weight, and pulling apart needs a dial setting of at least 7.2e22 kg. A normal-density Ollie meets a neutron-star Rex with 1.76e9 N, so he is gravity-locked (his 299 kN shove cannot break it). A thrown neutron-star Ollie penetrates (Newton depth 1.2e14 m, far deeper than Earth is wide), so suppress the crater and defer to the density area's sinking result. Black hole (ρ ≥ ~1.3e27 kg/m³ at 2 m): return blackHole and show no contest.\nRELATIVISTIC. The pin and shove use relativistic momentum (pushApart). Slide distances are computed only below 0.01c; above that, flag relativistic and reuse the throw bay's fireball wording. Slam energy E = ΔA·s holds exactly at any speed.\nCOMIC VS REAL. Arm force uses the same 11% share in both modes, and the comic pin (constant force) is always at least as fast as the real one (Hill). Shove and throw use comicAtLeastReal: heavy record-human shoves fall back to real muscle (3.57 vs 2.2 m/s).\nUNEQUAL SIZES. P does not depend on size (strength is a force); the lever 0.19 H and the pin path use the loser's lever; M sums both. The table and ring scale with the mean height. If the height ratio exceeds 1.5, add an info chip: 'Sizes too different for a fair table; numbers are rough.' A body whose strength is less than its own weight cannot stand (density area's canStand): its drive is 0, and the bay says so (the 50 m Ollie at Hulk strength weighs 27.6 MN against 0.89 MN of strength).\nZERO/NaN GUARDS. Mass > 0 and F ≥ 10 kg·g are enforced by state validation. Use Math.max(..., 1e-300) in tolerances. vCap = 0 means no walk. fallTogether returns zeros if d0 ≤ d1. Ratios against ∞ capacity are 0. Ratios ∞/∞ are 'undefined'. log1p is used in the slide formula. R = 0 gives an infinite slide (drag alone never quite stops him), so report 'coasts until something stops him'.",
 "outputs": "armWrestle → {blackHole?, sinksA, sinksB, PA, PB (N, arm force), RA, RB (N, footing; ∞ if bolted), AA, AB (N, usable), footLimitedA/B (bool), LA, LB (m), armHoldA/B (N), canHoldArmA/B (bool), sT (table scale), elbowCap (N), elbowLoadA/B (N), tableRatio, slamCap (J), grav {d (m), F (N), vEsc (m/s), Ebind (J)}, fall {t (s), vRel (m/s), E (J)}, pulledTogether (bool), outcome 'stalemate'|'pin'|'undefined', winner 'A'|'B', contact (N), pin {t (s), v (m/s), E (J), s (m), M (kg), dA (N)}, slamRatio, crater (m), craterExtrapolated, quake (magnitude), relativistic (bool), torqueA/B (N·m), humerusRatioA/B, tearA/B}.\npushMatch → {HA, HB, DA, DB (N), holdA, holdB (N), grav, ring (m), outcome 'walkOut'|'deadlock'|'bothBolted', winner, net (N), accel (m/s²), x (m), t (s), v (m/s), vCap (m/s), contact (N, NaN = undefined), tear, allOut (bool), shoveOff (shoveBoth result), canLiftA/B, gravityLock}.\nshove / shoveBoth → {Fdrive (N), d (m), push (pushApart result), heldBack, basis, vA, vB (m/s, final speeds after the arm momentum split), EA, EB (J), slideA, slideB (m), outOfRing (bool), Fg (N), gravityLock, boundTogether, vEsc (m/s), stalled, relativistic, shover}.\nliftPartner → {weight, Fg, pullOut, need (N), can, margin, pressure (Pa), qult (Pa), groundRatio, dOver (m)}.\nthrowPartner → {bolted?} or {r (throwObject result: v, flight, Eobj, Eimpact, crater, quake, recoilV, heldBack, basis), vEsc (m/s), fallsBack, newtonDepth (m), penetrates}.",
 "page_text": "ARM WRESTLE BAY. duoHeader(cR, cO), then the parts below.\nVERDICT (first match wins):\n1. blackHole: 'No contest: at this density [Rex/Ollie] is a black hole (see Weight).'\n2. Either one sinks (off comic ground): prefix 'On real [surface] [they sink/he sinks] just standing here (see Weight). If the ground could hold them: ' and continue with the rerun result.\n3. pulledTogether: 'They never get to arm-wrestle. Their own gravity drags them together across the table: they meet at [vRel] within [t], with [E] ([TNT]).'\n4. !canHoldArm: '[Name] can't even hold his forearm up: at this density it weighs more than his arm can push ([armHold] vs [P]).'\n5. tableRatio > 1: 'The table collapses under their elbows before they start: each elbow presses [elbowLoad]; the table takes about [elbowCap].'\n6. undefined: 'Unstoppable force meets immovable object. Both are infinitely strong and bolted down, so the push between them is infinity against infinity. That has no answer, and the sim won't invent one.'\n7. stalemate, both footLimited: 'Dead heat. Each arm could push [P], but their feet only hold [R]. Past that they'd just drag themselves off the table, so strength stops mattering.'\n8. stalemate, otherwise: 'Dead heat: [C] each way, arms locked upright.'\n9. pin, winner footLimited: '[W] wins, but only by [dA]: his feet hold [R_w], not his full [P_w].' Then the speed clause.\n10. pin: '[W] pins [L] in [t].' Speed clause when v ≥ 1 m/s: ' The back of [L]'s hand hits the pad at [v]' plus ', and goes through the table' (slamRatio > 10), ', cracking the top' (1-10), or '.' At v ≥ 0.01c: ' at [x]% of light speed: [E or unbounded].'\nSTATUS CHIPS:\n- 'Arm force: Rex [A_R] · Ollie [A_O]' (info).\n- Per side: good 'Rex's feet hold' when R ≥ P; bad 'Rex's feet slip above [R]' when footLimited; info 'Rex bolted' when bolted.\n- Table: info 'Comic ground: table never breaks'; good 'Table holds' (tableRatio ≤ 1 and slamRatio ≤ 1); warn 'Pin may crack the table' (1 < slamRatio ≤ 10); bad 'Pin smashes the table' (> 10); bad 'Table crushed by their elbows' (tableRatio > 1).\n- bad 'Ground around [X]'s bolts tears out' when tear > 1.\n- warn 'Their own gravity: [Fg]' when Fg > 1e-3 × the lighter one's weight.\n- info 'Sizes too different for a fair table' when the height ratio is over 1.5.\nTILES:\n- 'Pushing force' — [A_R] vs [A_O], sub 'arm 11% of strength, capped by footing'.\n- 'Time to pin' — [t] or 'Stalemate'.\n- 'Hand speed at the pin' — speedTile(v).\n- 'Slam' — [E], sub [TNT] · '[slamRatio]× what the table top is built to take'.\n- 'Twist on each upper arm' — [τ], sub '[humerusRatio]× what breaks a human humerus (~190 N·m, estimate)'.\n- 'Feet hold' — R_R / R_O.\nCHART: logBars('Forces, newtons', rows) with rows Rex's arm P_R; Rex's feet hold R_R (skip if ∞); Ollie's arm P_O; Ollie's feet hold R_O; Table under one elbow Q_e (skip if ∞); Their mutual gravity F_g (only if > 1e-3 N). Highlight the two used values A.\nHAPPENS (choose up to 5, in this order of relevance):\n(a) 'Newton's third law: the push between their hands is the same both ways. It reaches each of them sideways, so each can only press as hard as his feet hold: [R] standing on [surface].'\n(b) footLimited: 'Push harder and his feet slide; his elbow leaves the pad, which is a foul in competition (two fouls lose).'\n(c) pin: '[W]'s [dA] surplus spins both forearms (together they act like [M] at the hand) a quarter turn, [s], down to the pad.'\n(d) table: 'A regulation table (World Armwrestling Federation: 19 mm plywood on a steel frame, scaled ×[s_t] to their size) is built for people. This pin delivers [E], [slamRatio]× the 102 J impact a 19 mm floor panel must survive in US panel tests.'\n(e) human: 'In people, a full-force twist like this is how the upper arm snaps: in one series of 30 arm-wrestling fractures, every one was a spiral break of the humerus. A healthy humerus takes roughly 190 N·m in theory (an estimate). Rex and Ollie are indestructible.'\n(f) gravity: 'At [ρ] each weighs [m]. Across the table their gravity pulls them together with [Fg], [ratio]× their weight on Earth.'\n(g) infinite on finite footing: 'Infinite strength doesn't help here: his feet still let go at [R].'\n(h) bolted with tear > 1: 'Bolted to the planet holds, but the ground around the bolts doesn't: past about [T] the surface breaks up around his feet.'\nMATH (Show the math):\n- 'Arm force = 11% of strength in both muscle models (estimate): Rex [P_R], Ollie [P_O].'\n- 'Usable = min(arm force, footing); footing = μ m g [+ shear × buried area if dug in; unlimited if bolted].'\n- 'Pin: net [dA] on M = 0.0097 × (m_Rex + m_Ollie) = [M] over s = (π/2) × 0.19 H = [s]; comic t = √(2 s M / ΔF) with relativistic momentum; real muscle force falls with hand speed (Hill, top speed [vmax]).'\n- 'Twist τ = force × 0.19 H.'\n- 'Gravity F = G m₁ m₂ / d², d = [d].'\n\nWRESTLE BAY. Sub-move chips and who chips, then:\nSHOVING MATCH VERDICTS:\n- bothBolted, undefined: 'Unstoppable force meets immovable object: both bolted, both infinitely strong. No answer.'\n- bothBolted: 'Neither moves: both are bolted to the planet. They press with [C], and that stretches the ground between their feet' + ' — it tears up around the bolts ([tear]× its limit).' or ' — it holds.'\n- deadlock with allOut: 'Dead heat. Both are far stronger than their footing (each holds only [R]), so strength stops mattering. Pushing all-out, they'd just shove each other apart like skaters: [vR] and [vO], sliding [x].'\n- deadlock with a bolted side: '[Bolted] can't be moved, and being bolted he can't walk [other] out either. Stalemate (he can still shove him: see Shove).'\n- deadlock: 'Dead heat at [C].'\n- walkOut: '[W] walks [L] out of the ring in [t]' + (v ≥ 5 m/s ? ', hitting [v]' : '') + '. [L]'s ' + (H_l < R_l ? 'muscles give at [H_l]' : 'feet only hold [H_l]') + '.'\n- Suffixes: gravityLock adds ' Their gravity holds them together with [Fg]; neither can push the other away.' canLift of the winner (or of either, in a deadlock) adds ' [X] could also just lift [Y] off his feet (Lift).'\nSHOVING MATCH CHIPS: 'Rex holds [H_R] · drives [D_R]', 'Ollie holds [H_O] · drives [D_O]', a ground-tear chip, and a gravity chip.\nSHOVING MATCH CHART: logBars of strength, footing hold and walking drive for each.\nSHOVING MATCH TILES: Winner / Time out of the ring / Speed at the edge / Push between them.\nSHOVE VERDICTS:\n- stalled with gravityLock: '[B] is held to [A] by gravity ([Fg]); [A]'s shove ([F]) can't break it.'\n- stalled: 'Nobody moves: [A]'s shove ([F]) can't beat [B]'s footing ([R_B]) and his own ([R_A]).'\n- relativistic: '[B] leaves at [x]% of light speed.' Then reuse the throw bay's fireball bullet with 'Ollie' as the object.\n- otherwise: '[B] flies back at [vB] and slides [slideB] before he stops' + (outOfRing ? ', well out of the ring.' : ', still inside the ring.') + (vA > 0.01 ? ' [A] recoils at [vA].' : '') + (boundTogether ? ' Their gravity pulls them straight back together.' : '').\n- Both at once adds: 'The stronger shove sets the push: the weaker one's arms can't extend against it. Evenly matched, both arms could extend, so this is a low estimate.'\nSHOVE BULLETS: Newton's third law (each gets the same push for the same time), footing, held-back, slide physics ('friction and air drag stop him; a real body would tumble').\nLIFT VERDICTS:\n- bolted: '[B] is bolted to the planet: lifting him means lifting the planet. Can't be done.'\n- can: '[A] lifts [B] overhead with [margin]× the force needed.' Then (dug in) ' First he tears [B]'s [claws/boots] out of the ground ([pullOut]).', (Fg > 1% of W) ' Their gravity adds [Fg], [ratio]× [B]'s weight.', and (groundRatio > 1) ' [A]'s feet sink: both their weights press [pressure] into ground that holds [qult].'\n- cannot: '[A] can't lift [B]: it takes [need], he has [F].'\n- Bullet: '[B] can't make himself heavier by pushing down on [A]: that push stays between the two of them. Only his grip on the ground counts.'\nTHROW: reuse bayThrow's verdicts, tiles and chart with the object short name 'Ollie'/'Rex' and his frontArea and Cd. Additional verdicts: bolted 'He's bolted to the planet: there's nothing to throw.'; fallsBack 'Their gravity pulls [B] straight back to [A].'; penetrates '[B] is so dense ([ρ]) that he doesn't make a crater: he punches into the ground (Newton's rough estimate: [depth]), far deeper than any crater. See Weight.' (suppress the crater tile).\n\nASSUMPTIONS CARD (static-data.js) — one new entry, 'Rex vs Ollie': see caveats.",
 "caveats": "For the assumptions card, in plain language:\n- Ollie. He is assumed to be as strong, tough and big as Rex unless his own settings say otherwise. He wears boots, so the sim gives his boots the same grip as Rex's feet on each surface. 'Dug in' for Ollie means boots kicked into footholds, treated like Rex's buried claws. Nothing else about him is invented.\n- Arm wrestling. Each arm pushes sideways at the hands with 11% of its owner's strength in both muscle models. That share is an estimate: at record-human strength it twists a human-sized upper arm with about 190 N·m, roughly the most a healthy humerus can take in theory, and arm-wrestling fractures happen at full effort. Measured values point anywhere from 5% to 16%. Wrist, finger and body-lean technique are ignored.\n- Who wins. The push between their hands is the same both ways and goes down through each body to his feet. Neither can use more force than his feet hold. When both are stronger than that, the heavier or better-anchored one wins whatever the strength. Leaning, toppling, leverage and the table's own grip are not modelled.\n- Arms. Forearms have human proportions (US Army ANSUR II survey and Dempster's cadaver data), scaled with height. A pin is a quarter turn of both forearms.\n- The table. It is a regulation World Armwrestling Federation table (19 mm plywood on a steel frame), scaled to their size. Its strength is an estimate from US plywood floor-panel test minimums: about 10 kN under an elbow and about 100 J of slam at regulation size.\n- Wrestling. A sustained push uses full strength, as the Pull move does. Walking someone backward uses friction plus a quarter of the claw grip, as the sprint does. Bolted or dug-in stances can resist but can't walk. A shove uses the throw's two-handed push. When both shove at once, the stronger shove sets the push, which is a low estimate for an even match. After a shove they slide to a stop against friction and air drag as if they stayed upright; real bodies would tumble. The sumo ring is 4.55 m across at the default 2 m size, scaled with their height.\n- Bolted to the planet. The bolts never give, but the ground around them does. It is estimated with the same shear limit the sim uses for dug-in claws, within a factor of about 3 of real tensile strengths.\n- Lifting and throwing a partner. A partner who is dug in has to be torn out of the ground first (same shear estimate). A bolted partner can't be lifted or thrown. A partner far denser than the ground punches in instead of making a crater (Newton's rough impact-depth rule).\n- Their own gravity. It is G m₁ m₂ / d² with each body treated as a ball of the same volume, which is good to about a factor of 2 for tall bodies close together. It matters only at extreme density.\n- Infinity. Infinite strength against a finite foothold is still limited by the foothold. Infinite strength on both sides, with both bolted down, is infinity against infinity: the sim says 'no answer' rather than inventing one.",
 "tests": [
  {
   "name": "AW-1 default pair: footing decides",
   "inputs": "Both H 2 m, m 180 kg, strength 90,718.474 kg (F = 889,644 N), comic, concrete (mu 0.6, shear 1.5 MPa), both friction, groundHolds false",
   "expected": "outcome stalemate; P = 97,860.9 N each; R = 1,059.12 N each; A = 1,059.12 N; footLimited both true; torque 402.47 N·m each (humerusRatio 2.118)",
   "reasoning": "P = 0.11 × 889,644 = 97,860.9 N. R = 0.6 × 180 × 9.80665 = 1,059.12 N. A = min(P, R) = 1,059.12 for both, so they are equal: stalemate. τ = 1,059.12 × 0.19 × 2 = 402.47 N·m; 402.47 / 190 = 2.118.",
   "tolerance": "1e-6 relative"
  },
  {
   "name": "AW-2 both dug in",
   "inputs": "As AW-1, both anchor braced",
   "expected": "stalemate; A = 97,860.9 N each (footLimited false; R = 301,059 N); torque 37,187 N·m",
   "reasoning": "R = 1,059.12 + 1.5e6 × 0.2 = 301,059 N > P, so A = P on both sides: equal. τ = 97,860.9 × 0.38.",
   "tolerance": "1e-6 relative"
  },
  {
   "name": "AW-3 Hulk vs record human, both dug in, comic",
   "inputs": "Rex as AW-2; Ollie strength 511 kg, braced",
   "expected": "pin by Rex; dA = 97,309.6 N; M = 3.48954 kg; s = 0.596903 m; t = 6.5430 ms; v = 182.46 m/s; E = 58,084 J (13.9 g TNT); slamCap 150.65 J so slamRatio 385.6 ('smashes the table'); torques Rex 37,187 / Ollie 209.47 N·m",
   "reasoning": "A_O = 0.11 × 511 × 9.80665 = 551.232 N. dA = 97,860.9 − 551.2 = 97,309.6 N. M = 0.009693 × 360 = 3.48954 kg. s = (π/2) × 0.38 = 0.596903 m. t = √(2 × 0.596903 × 3.48954 / 97,309.6) = √4.2810e-5 = 6.543e-3 s. v = dA·t/M = 182.46 m/s. E = dA × s = 58,084 J. s_t = 2/1.7562 = 1.13882, so slamCap = 102 × 1.13882³ = 150.65 J.",
   "tolerance": "1e-4 relative"
  },
  {
   "name": "AW-3r same, real muscle",
   "inputs": "AW-3 with mode real for both",
   "expected": "pin by Rex; t = 37.88 ms; v = 16.532 m/s; E = 476.8 J; slamRatio 3.17 ('may crack the top')",
   "reasoning": "Hill with vmax = 17 m/s and k = 0.25: r = 551.232/97,860.9 = 0.0056329; terminal u = (1 − r)/(1 + r/k) = 0.97246, so v_t = 16.532 m/s, reached in ~2 ms. t ≈ 0.5969/16.532 + transient ≈ 37.9 ms. E = ½ M v² = 0.5 × 3.48954 × 16.532² = 476.8 J.",
   "tolerance": "1% (numerical integration)"
  },
  {
   "name": "AW-4 infinite Rex vs record human, both standing",
   "inputs": "Rex F = Infinity, friction; Ollie 511 kg, friction; concrete; comic (real gives the same)",
   "expected": "pin by Rex with A_R = 1,059.12 N (footing-limited) vs A_O = 551.232 N; dA = 507.886 N; t = 90.567 ms; v = 13.1815 m/s; E = 303.16 J",
   "reasoning": "min(∞, 1,059.12) = 1,059.12. t = √(2 × 0.596903 × 3.48954 / 507.886) = √8.2024e-3 = 0.090567 s. v = 507.886 × 0.090567 / 3.48954 = 13.18 m/s. In real mode Fcap = R keeps the force at 1,059 N below vmax, so the result is the same.",
   "tolerance": "1e-4 relative"
  },
  {
   "name": "AW-5 both infinite and bolted",
   "inputs": "Both F = Infinity, both bolted",
   "expected": "outcome 'undefined' (no numbers); verdict 'Unstoppable force meets immovable object...'",
   "reasoning": "A = min(∞, ∞) = ∞ on both sides, so the difference ∞ − ∞ is undefined. same() must not report equality and no pin must be computed.",
   "tolerance": "exact"
  },
  {
   "name": "AW-6 infinite bolted vs Hulk bolted",
   "inputs": "Rex F = Infinity, bolted; Ollie Hulk, bolted; comic, then real",
   "expected": "Comic: pin in t = s/c = 1.99105e-9 s; v = c; E = Infinity; tearA = Infinity, tearB = 0.3262. Real: v = 16.995 m/s, t = 35.13 ms, E = 503.9 J",
   "reasoning": "pushApart with F = ∞ returns t = d/c = 0.596903/299,792,458. Ollie's 97,860.9 N against the 300 kN concrete tear limit gives 0.326. In real mode Hill caps the hand at vmax = 17 m/s.",
   "tolerance": "1e-6 (comic), 1% (real)"
  },
  {
   "name": "AW-7 lake ice",
   "inputs": "AW-1 bodies; surface ice (mu 0.1); Rex Hulk, Ollie 511 kg; both friction",
   "expected": "stalemate at 176.52 N (both footing-limited, despite a 177× strength gap)",
   "reasoning": "R = 0.1 × 1,765.2 = 176.52 N < 551.232 N < 97,860.9 N.",
   "tolerance": "1e-6 relative"
  },
  {
   "name": "AW-8 record human vs record human",
   "inputs": "Both 511 kg, friction, concrete",
   "expected": "stalemate at 551.232 N; torque 209.47 N·m at Rex's 0.38 m lever (183.9 N·m at a 1.756 m human's 0.3337 m lever ≈ 190 N·m calibration)",
   "reasoning": "P = 551.232 < R = 1,059.12. τ = 551.232 × 0.38 = 209.47 N·m.",
   "tolerance": "1e-6 relative"
  },
  {
   "name": "AW-9 record human vs half strength",
   "inputs": "Rex 511 kg, Ollie 255.5 kg, friction, concrete",
   "expected": "Real: t = 0.2580 s, v = 2.808 m/s, E = 13.76 J (slamRatio 0.091, table holds). Comic: t = 0.12294 s, v = 9.710 m/s, E = 164.5 J (slamRatio 1.09)",
   "reasoning": "dA = 275.616 N. Comic: t = √(2 × 0.596903 × 3.48954 / 275.616) = 0.12294 s. Real: r = 0.5 gives u = 0.5/(1 + 2) = 1/6, so v_t = 2.833 m/s; t ≈ 0.597/2.81 ≈ 0.26 s, a realistic human pin.",
   "tolerance": "1e-4 (comic), 1% (real)"
  },
  {
   "name": "AW-10 neutron-star density pair",
   "inputs": "Both H 2 m, m = 7.2e16 kg (4e17 kg/m³ × 0.18 m³), Hulk strength, concrete, comic",
   "expected": "canHoldArm false (needs 8.503e15 N vs 97,860.9 N); elbowLoad 2.5419e16 N vs elbowCap 12,969 N (1.96e12×); d_table 1.25162 m; Fg 2.2086e23 N; fall together in 0.3903 ms at 3,475.9 m/s, releasing 2.1747e23 J; pulledTogether true; sinks on real ground",
   "reasoning": "armHold = 0.012043 × 7.2e16 × 9.80665. elbowLoad = 0.036 × 7.2e16 × 9.80665. d_t = 0.660 × 1.13882 + 0.25 × 2 = 1.25162 m. Fg = 6.6743e-11 × (7.2e16)² / 1.25162² = 2.2086e23 N. Fall with μ = G × 1.44e17 = 9.611e6 and x = 0.70053/1.25162 = 0.5597: t = √(1.9607/1.9222e7) × (0.49642 + 0.72475) = 3.903e-4 s.",
   "tolerance": "1e-4 relative"
  },
  {
   "name": "AW-11 comic ground",
   "inputs": "AW-3 with groundHolds true",
   "expected": "Same pin numbers as AW-3; elbowCap and slamCap Infinity; slamRatio 0; chip 'Comic ground: table never breaks'",
   "reasoning": "Comic ground makes the table unbreakable. Friction and the dug-in limit are unchanged.",
   "tolerance": "exact"
  },
  {
   "name": "AW-12 plush pair",
   "inputs": "Both 2 m, m 5.4 kg (30 kg/m³), Hulk, friction, concrete",
   "expected": "stalemate at 31.774 N",
   "reasoning": "R = 0.6 × 5.4 × 9.80665 = 31.774 N, far below P.",
   "tolerance": "1e-6 relative"
  },
  {
   "name": "W-1 shoving match, default pair",
   "inputs": "AW-1 settings",
   "expected": "deadlock; contact 1,059.12 N; allOut true; shoveBoth: Ollie 49.263 m/s, Rex 49.271 m/s, contact time 31.05 ms, slides 138.26 m / 142.71 m (comic)",
   "reasoning": "H = D = min(889,644, 1,059.12) for both, so net = 0. Both F > R gives allOut. Shove: F_s = 2 × 0.16818 × 889,644 = 299,240 N. Ollie's final p = p_B × 180/187.92 gives 49.263 m/s. Slide = (180/0.98) ln(1 + 0.49 × 49.263²/1,059.12) = 138.26 m.",
   "tolerance": "0.5% (depends on the engine's comicFrac)"
  },
  {
   "name": "W-2 Rex dug in vs Ollie standing",
   "inputs": "Rex braced, Ollie friction, Hulk both, concrete; comic, then real",
   "expected": "Rex walks Ollie out: drive 76,059.1 N; Ollie holds 1,059.12 N; net 75,000 N; a = 208.33 m/s²; x = 2.275 m. Comic: t = 0.14778 s, v = 30.79 m/s. Real (cap 17.9 m/s): t = 0.17006 s, v = 17.9 m/s",
   "reasoning": "drive = 1,059.12 + 0.25 × 300,000. a = 75,000/360. Comic: t = √(2 × 2.275/208.33) and v = √(2 × 208.33 × 2.275) = 30.79 < vCap 205.4. Real: 17.9/208.33 + (2.275 − 17.9²/416.67)/17.9 = 0.08592 + 0.08414.",
   "tolerance": "1e-4 relative"
  },
  {
   "name": "W-3 heavier body wins regardless of strength",
   "inputs": "Rex m 360 kg, Ollie 180 kg, both friction, concrete, Hulk (also true at 511 kg each)",
   "expected": "Rex walks Ollie out: net 1,059.12 N; a = 1.96133 m/s²; t = 1.5231 s; v = 2.987 m/s",
   "reasoning": "Rex holds and drives 0.6 × 360 × 9.80665 = 2,118.24; Ollie holds 1,059.12. a = 1,059.12/540. t = √(2 × 2.275/1.96133).",
   "tolerance": "1e-4 relative"
  },
  {
   "name": "W-4 both bolted",
   "inputs": "Both bolted, Hulk, concrete; then granite",
   "expected": "bothBolted; contact 889,644 N; tear 2.965 on concrete (300 kN, the ground tears), 0.1236 on granite (7.2 MN, holds)",
   "reasoning": "C = max(F) = 889,644. Limit = shear × 0.2 m²: 1.5e6 × 0.2 = 3e5; 36e6 × 0.2 = 7.2e6.",
   "tolerance": "1e-6 relative"
  },
  {
   "name": "W-5 both bolted and infinite",
   "inputs": "Both bolted, F = Infinity",
   "expected": "contact undefined (NaN mapped to 'undefined'); no tear number",
   "reasoning": "max(∞, ∞) pressed between two immovable anchors: an unbounded push against an unbounded hold.",
   "tolerance": "exact"
  },
  {
   "name": "W-6 bolted Rex vs standing Ollie",
   "inputs": "Rex bolted, Ollie friction, Hulk both",
   "expected": "deadlock (Rex drive 0, Rex hold ∞); contact 1,059.12 N; allOut false",
   "reasoning": "A bolted body cannot walk, and nobody can push a bolted body back.",
   "tolerance": "exact"
  },
  {
   "name": "W-7 weak Rex gives way before his feet do",
   "inputs": "Rex strength 100 kg (980.665 N), Ollie Hulk, both friction",
   "expected": "Ollie walks Rex out: H_Rex = 980.665 N (muscles, not feet); net 78.453 N; a = 0.21793 m/s²; t = 4.569 s",
   "reasoning": "H = min(F, R) = 980.665 < 1,059.12. Net = 1,059.12 − 980.665.",
   "tolerance": "1e-4 relative"
  },
  {
   "name": "SH-3 record human shoves record human",
   "inputs": "Both 511 kg, friction, concrete, comic (falls back to real)",
   "expected": "basis real; F_s 5,011.2 N; Ollie 3.568 m/s, Rex 3.659 m/s; Ollie travels 0.757 + 1.079 = 1.836 m < 2.275 m (stays in the ring)",
   "reasoning": "Real 2 × 0.523 F is capped at F. Comic 0.336 F is slower, so the blend picks real (as comicAtLeastReal does).",
   "tolerance": "0.5%"
  },
  {
   "name": "SH-4 infinite bolted Rex shoves standing Ollie",
   "inputs": "Rex F = Infinity, bolted; Ollie Hulk, friction",
   "expected": "Comic: Ollie at c (relativistic flag, E = Infinity, no slide number). Real: Ollie 35.0 m/s (vmax 35), slides 82.47 m",
   "reasoning": "pushApart with infinite F returns c. Real muscle caps at vmax_throwPush = 35 m/s. Slide = (180/0.98) ln(1 + 0.49 × 35²/1,059.12).",
   "tolerance": "1% (real)"
  },
  {
   "name": "SH-5 shoving a bolted partner",
   "inputs": "Rex Hulk friction shoves Ollie bolted",
   "expected": "Ollie doesn't move; Rex recoils at 71.19 m/s (comic) and slides 227.6 m",
   "reasoning": "RB = ∞, so the whole stroke goes into Rex's own recoil.",
   "tolerance": "0.5%"
  },
  {
   "name": "SH-6 gravity lock",
   "inputs": "Ollie (Hulk, 180 kg) shoves Rex (m 7.2e16 kg), comic ground",
   "expected": "stalled; gravityLock true; Fg = 1.7626e9 N > F_s 299,240 N",
   "reasoning": "Fg = 6.6743e-11 × 180 × 7.2e16 / 0.70053² = 1.7626e9 N, about 1e6× Ollie's weight.",
   "tolerance": "1e-4 relative"
  },
  {
   "name": "L-1/2/3 lifting Ollie",
   "inputs": "Rex Hulk; Ollie 180 kg standing / dug in / bolted; concrete",
   "expected": "Standing: need 1,765.2 N, margin 503.99, foot pressure 39.23 kPa (1.57% of 2.5 MPa). Dug in: need 301,765 N, margin 2.948. Bolted: cannot (need ∞)",
   "reasoning": "W = 180 × 9.80665. Pull-out = 1.5e6 × 0.2. Pressure = 360 × 9.80665 / 0.09.",
   "tolerance": "1e-6 relative"
  },
  {
   "name": "L-5/6 lifting a neutron-star partner",
   "inputs": "Both 7.2e16 kg, comic ground; Rex strength 1e23 kg, then 1e22 kg",
   "expected": "need 1.5378e23 N (mutual gravity at d_over 1.5 m; weight 7.06e17 N is 0.0005% of it); 1e23 kg can (6.38×), 1e22 kg cannot (0.638×)",
   "reasoning": "d_over = 0.65 × 2 + 0.1 × 2 = 1.5 m. Fg = 6.6743e-11 × 5.184e33 / 2.25 = 1.5378e23 N.",
   "tolerance": "1e-4 relative"
  },
  {
   "name": "T-1 Rex throws Ollie",
   "inputs": "Rex Hulk, friction, concrete, comic, 45°; Ollie 180 kg (area 0.8 m², Cd 1.0, CdSup 1.75)",
   "expected": "v = 64.67 m/s, range 238.4 m, Rex recoil 10.32 m/s; with Rex dug in: 71.23 m/s, 266.5 m",
   "reasoning": "Reuses throwObject unchanged, with extraHold and extraResist ≈ 0 at normal density.",
   "tolerance": "0.5% (depends on the engine)"
  },
  {
   "name": "T-5 throwing a neutron-star Ollie",
   "inputs": "Rex strength 1e23 kg, bolted, normal density; Ollie 7.2e16 kg; comic ground; 45°",
   "expected": "penetrates true (density ratio 1.67e14); Newton depth 1.17e14 m; crater suppressed; fallsBack false (v 3,829 m/s > vEsc 2,531 m/s)",
   "reasoning": "L = (6 × 0.18/π)^(1/3) = 0.7005 m; D = 0.7005 × 4e17/2400. vEsc = √(2G × 7.2e16 / 1.5).",
   "tolerance": "1e-3 relative"
  },
  {
   "name": "G-1/G-2 mutual gravity at contact",
   "inputs": "Two 2 m bodies, d = 2 × 0.35026 = 0.70053 m; 180 kg each, then 7.2e16 kg each",
   "expected": "180 kg: 4.4066e-6 N (the weight of 0.45 mg). 7.2e16 kg: 7.0505e23 N = 998,546× their weight; vEsc 5,238 m/s; pulling apart needs a dial setting of at least 7.19e22 kg",
   "reasoning": "G m²/d² = 6.6743e-11 × 32,400 / 0.490738, and 6.6743e-11 × 5.184e33 / 0.490738.",
   "tolerance": "1e-4 relative"
  },
  {
   "name": "Guard: infinity vs finite is not a tie",
   "inputs": "same(Infinity, 97860.9)",
   "expected": "false (the naive |a−b| ≤ 1e-9 max(|a|,|b|) test wrongly returns true)",
   "reasoning": "∞ ≤ 1e-9 × ∞ is true in IEEE arithmetic. This bug made the prototype call infinite-vs-finite a stalemate before it was fixed.",
   "tolerance": "exact"
  }
 ],
 "open_questions": "1. The arm-force share 0.11 is the softest number. Sources support 0.05 (ordinary men's ~80 N·m twist) up to 0.16 (an elite 819 N hook pull, which is not a pure twist). The owner may prefer to show the range on the page.\n2. The WAF rulebook PDF itself was blocked by the proxy. The pin and elbow-foul wording comes from the Canadian federation's summary; check it against the WAF text if wording matters.\n3. Comic ground currently leaves the dug-in shear finite (the engine convention). Should comic ground also make dug-in claws and boots unbreakable?\n4. 'Both shove at once' uses the stronger shove over one arm's stroke. Evenly matched pairs could extend both arms (up to √2 faster); the rule is discontinuous at exact equality if changed.\n5. Coordinate names with the density area: K.G, isBlackHole, canStand, the sinking flag, buoyancy and apparent weight, and the neutron-star density value. Tests here use 4e17 kg/m³ only as an example.\n6. Table strength (10 kN per elbow, 102 J slam) is an estimate built from PS 2 minimums. Pins in comic mode at record-human strength (164 J) will read 'may crack the top', which is a comic-mode exaggeration; real-mode human pins are 1-15 J.\n7. No toppling, leaning or leverage (sumo technique of getting low and lifting is approximated only by the separate Lift move). Gravity torque of the forearms is ignored in the pin. Unequal-height arm wrestling is rough.\n8. Mutual-gravity distances (equal-volume balls) are good to about 2×. If the density area models body shape differently, reuse its distances."
}
```

</details>

<details>
<summary>Subagent `check:density` (rex-ollie-design, 2026-10-09 23:26:53 UTC): The arithmetic and most sources hold up. I fetched all the cited pages and confirmed the numbers. Returned fact_checks: 33 (e.g. density_plush_stuffing_estimate; density_human_body_measured), physics_issues: 20, missing: 10, test_corrections: 9.</summary>

Workflow run `wf_173e4620-19f`, phase `Check`, agent `ac3c502da532a17a2`. Prompt, verbatim:

```text
Project: "Rex Super-Strength Lab", a single-page physics simulator for Rex, an indestructible, tireless plush kaiju-dinosaur (default 2 m tall, 180 kg). A strength dial sets his maximum force as a lift capacity from 10 kg to 1e34 kg, plus infinity. Moves today: lift, throw, jump, stomp, punch, clap, sprint, pull. Two muscle models: "comic" (fixed share of strength at any speed) and "real" (Hill force-velocity curve; limb speed caps). Settings: ground surface (sand, gravel, soft clay, stiff clay, asphalt, concrete, lake ice, steel deck, granite), "comic ground" (never breaks), anchoring (friction / claws dug in / bolted to the planet), height (isometric scaling) and mass.
Read these before designing (do NOT edit anything under /home/user/dino-strength-sim; put scratch files in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo/):
- /home/user/dino-strength-sim/src/engine.js: the physics engine (SI units; relativistic momentum helpers momentumToV/momentumToKE/vToMomentum; pushApart two-body push in comic or Hill mode; anchorCapacity footing model; fly() RK4 flight over a round Earth with drag and Kepler arcs; craterDiameter Collins et al.; blastRadius Kinney-Graham; seismicMagnitude; stagnationT; lift/throw/jump/stomp/punch/clap/sprint/pull).
- /home/user/dino-strength-sim/src/app.html (the bay* functions show how results become page text), /home/user/dino-strength-sim/src/static-data.js (assumptions text), /home/user/dino-strength-sim/build-data.py (how sourced facts become the sources table).
- Fact format used by the project: /home/user/dino-strength-sim/research/final-environment.json ("facts" entries with key, category, label, status in {verified, canon_stated, reported, estimate, claimed, disputed, not_quantified}, value_si, unit_si, low_si, high_si, display, sources [{title, url}], notes).
NEW FEATURES being added (the owner's request): (1) "density and weight, and the effect that would have on the environment, like if Rex were the density of a neutron star"; (2) Rex's boyfriend Ollie, "equally as overpowered and indestructible", for two-person simulations: arm wrestling, regular wrestling, games of catch, unstoppable force vs immovable object. Ollie, from the owner's image, is a plush bull-man: horns, nose ring, leather vest, cargo pants, laced boots (no visible claws), about Rex's height and build. Do not invent other canon for him; default him to Rex's size, mass and strength, with his own adjustable settings.
The owner is a professional critic: factual accuracy and honest labelling come first. Every number must be either sourced (fetch the source and confirm the number on the page; give the exact URL) or labelled an estimate with the reasoning. Prefer primary or authoritative sources (journals, textbooks, NASA/ESA, standards bodies). Never present speculation as fact; say what the model ignores. The page's tone is plain, specific and readable for a general audience (short sentences, no jargon without a gloss).

Adversarially check this design for the area "Density and weight". Default to suspicion. (1) For EVERY fact: fetch the source URL and confirm the number and wording; mark ok=false with the correct value and a better source if wrong, unsupported, or mislabelled (e.g. an estimate called verified). (2) Re-derive every equation and recompute every test case independently (write scripts in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo/density-check/); report physics errors, wrong regimes, missing forces or effects, double counting, unit slips, and anything that would show a reader a false or misleading claim, with concrete fixes. (3) List what is missing for an honest, complete simulation of the brief. (4) Check that the page text never overstates certainty.

BRIEF:
Design a density control for Rex (and Ollie) and a new solo tab, "Weight", that shows what his density does to him and his surroundings just by standing there; also how mass changes the existing moves.
Cover: (a) a log-scale density setting at fixed size with sourced reference presets: plush toy stuffing, a typical body (human body density), water, steel, osmium (densest element), white-dwarf matter, neutron-star / nuclear density, and the density at which Rex's own size equals his Schwarzschild radius (computed, not sourced). Give Rex's mass at each preset for the default 2 m body (volume 0.18 m^3 at 1,000 kg/m^3) and sourced comparison masses (e.g. ships, Phobos, Deimos, the Moon, Earth). (b) Can he stand, walk, jump at his strength setting given his weight? (c) Ground: foot pressure vs bearing (existing model); when he sinks a little, when he punches into rock, and when he falls through the planet. If he falls through Earth: a sourced real-Earth gravity profile and gravity-tunnel time (e.g. Klotz 2015, Am. J. Phys.), drag through rock with bearing strength plus inertia, damping per pass, Earth's rotation, and where he ends up; energy released. (d) Self-gravity: distance at which his gravity beats Earth's; his surface gravity and escape speed (treat his body as a sphere of equal volume, say so); tidal stretch on a person nearby; whether he holds an atmosphere (Jeans-type rule, sourced); the radius inside which air or rock falls onto him (Bondi radius; rock crushed where rock strength < rho G M / r); infall heating. (e) Where Rex's mass exceeds Earth's: Earth falls onto him instead; at the Schwarzschild threshold he is a black hole. (f) Honest caveat that neutron-star matter only stays that dense under a star's gravity; outside it would decompress violently (source it); in the sim his indestructibility holds it together. (g) Effects on existing moves: recoil and footing scale with mass; a thrown object must first escape his own gravity well (patched-conic: v_inf^2 = v^2 - 2GM/r_hand) and otherwise falls back onto him; jumps need force beyond his weight. (h) Mutual gravity between Rex and Ollie when both are dense: the force between them vs strength and footing (feeds the two-person sims).

DESIGN:
{
 "area": "Density and weight. This covers the density control for Rex and Ollie, a new solo \"Weight\" tab, Rex's self-gravity, the ground under his own weight, falling through the Earth, planet-scale and black-hole limits, how his mass changes the existing moves, and Rex–Ollie mutual gravity for the two-player tests.",
 "summary": "Density sets Rex's mass at his current size. Mass is density × 0.18 m³ at 2 m, and the volume scales with height cubed. The new Weight tab shows what that mass does while he simply stands there: whether his legs can move it, whether the ground holds or he sinks, and whether any rock can carry him at all. On concrete he stands up to 22,900 kg. His feet punch into granite above 1.56 × 10⁷ kg. Above 5.2 × 10⁷ kg (2.9 × 10⁸ kg/m³ at 2 m) no rock can hold him and he falls into the planet. That fall is integrated in 3-D through PREM's real gravity profile. Rock resists him with its strength plus its inertia, and Earth turns beneath him. A white-dwarf-dense Rex (5.0 × 10⁸ kg) sinks at up to 2 km/s and sticks in the solid inner core about 216 km from the centre after 1.9 hours. A neutron-star-dense Rex (7.4 × 10¹⁶ kg, about 7 Phobos masses) falls clean through in 38 minutes. He turns back about 3 m short of the far-side surface, 7.3° (810 km at the equator) west of the antipode. He then swings back and forth for roughly 5,000 years (2,000 to 30,000 depending on rock assumptions) before settling at the centre, releasing 3.6 × 10²⁴ J. His own gravity is computed by treating him as a ball of equal volume (35 cm radius at 2 m). It only matters above about 10¹⁰ kg. At neutron-star density it beats Earth's within 710 m, pulls in air from 43 m (the Bondi radius), crushes rock within about 8 m, and would let him hold an atmosphere. Above Earth's mass the planet falls onto him. At 39.5 Earth masses (1.31 × 10²⁷ kg/m³ at 2 m) he is a black hole. The same functions give the Rex–Ollie pull for the duo tests: 7.5 × 10²³ N at contact when both are neutron-star dense.",
 "facts": [
  {
   "key": "density_plush_stuffing_estimate",
   "label": "Plush toy stuffing (packed polyester fiberfill): density",
   "status": "estimate",
   "value_si": 30,
   "unit_si": "kg/m^3",
   "low_si": 10,
   "high_si": 60,
   "display": "~30 kg/m³ (estimate). Loose fiberfill batts measure 5.6–9.6 kg/m³; one commercial batting about 21 kg/m³.",
   "sources": [
    {
     "title": "US Patent 4,395,455 (DuPont, 1983): Polyester fiberfill batting having improved thermal insulating properties",
     "url": "https://patents.google.com/patent/US4395455A/en"
    }
   ],
   "notes": "No measured density for stuffed-toy filling was found; only retail listings and vendor blogs turned up. The DuPont patent gives fiberfill batting layers of 0.35–0.60 lb/ft³ (0.0056–0.0096 g/cm³), describes denser fiberfill as 1.0 lb/ft³ (0.016 g/cm³) or more, and gives commercial 'Sontique' batting as about 1.3 lb/ft³ (0.021 g/cm³). A stuffed toy is packed firmer than loose batting, so the sim uses 30 kg/m³. That is our estimate, plausibly 15–60. It ignores the fabric skin. At 2 m it gives 5.4 kg."
  },
  {
   "key": "density_human_body_measured",
   "label": "Whole human body density (young adults, hydrostatic weighing)",
   "status": "verified",
   "value_si": 1060,
   "unit_si": "kg/m^3",
   "low_si": 1047.5,
   "high_si": 1072.7,
   "display": "1.048–1.073 g/mL (women ~1.05, men ~1.07)",
   "sources": [
    {
     "title": "Tesch, Papadopoulos, Dolgener & Tinsley (2022), New Equations for Hydrostatic Weighing without Head Submersion, J Funct Morphol Kinesiol 7(3):70, Table 2",
     "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9506326/"
    }
   ],
   "notes": "Criterion head-under hydrostatic weighing of 90 + 45 adults aged 18–36. Males 1.0727 ± 0.0102 and 1.0662 ± 0.0187 g/mL; females 1.0528 ± 0.0134 and 1.0475 ± 0.0157 g/mL. These values have residual lung air removed; with full lungs a person floats. The sim's default Rex (1,000 kg/m³) is about 6% lighter than a person of the same volume. 1,060 is the midpoint, used as a comparison only."
  },
  {
   "key": "density_water_4c",
   "label": "Density of fresh water at 4 °C",
   "status": "verified",
   "value_si": 999.84,
   "unit_si": "kg/m^3",
   "low_si": 996.69,
   "high_si": 1000,
   "display": "0.9998395 g/mL at 4 °C (USGS table rounds to 1.00000)",
   "sources": [
    {
     "title": "USGS Water Science School: Water Density",
     "url": "https://www.usgs.gov/water-science-school/science/water-density"
    }
   ],
   "notes": "The USGS table also lists 0.99802 at 21 °C and 0.99669 at 26.7 °C. The sim uses 1,000 kg/m³, Rex's default. That is BASE_V = 0.18 m³ for 180 kg at 2 m, already in engine.js."
  },
  {
   "key": "density_structural_steel",
   "label": "Density of structural steel",
   "status": "verified",
   "value_si": 7850,
   "unit_si": "kg/m^3",
   "low_si": 7850,
   "high_si": 8005,
   "display": "7,850 kg/m³ (490 lb/ft³); Eurocode unit weight 77.0–78.5 kN/m³",
   "sources": [
    {
     "title": "Eurocode Applied: steel design properties (EN 1991-1-1 Table A.4; ρ ≈ 7850 kg/m³)",
     "url": "https://cdn.eurocodeapplied.com/design/en1993/steel-design-properties"
    },
    {
     "title": "Iowa DOT IM 569, Computing structural steel weight (mass): 'Steel 490 lb./ft.3 (7850 kg/m3)'",
     "url": "https://ia.iowadot.gov/erl/archiveapril2015/IM/content/569.htm"
    }
   ],
   "notes": "Divided by g, the 77.0–78.5 kN/m³ unit weight is 7,852–8,005 kg/m³. 7,850 matches the steel-deck surface already in data.js. A 2 m steel Rex weighs 1,413 kg."
  },
  {
   "key": "density_osmium",
   "label": "Density of osmium, the densest element, at 20 °C",
   "status": "verified",
   "value_si": 22587,
   "unit_si": "kg/m^3",
   "low_si": 22578,
   "high_si": 22596,
   "display": "22.587 g/cm³ (iridium 22.562), 20 °C",
   "sources": [
    {
     "title": "Girolami (2012), Osmium weighs in, Nature Chemistry 4:954, doi:10.1038/nchem.1479",
     "url": "https://www.nature.com/articles/nchem.1479"
    },
    {
     "title": "Author PDF of the same essay",
     "url": "https://girolami-group.chemistry.illinois.edu/publications/publications/Nature%20Chem.%202012,%204,%20954.pdf"
    }
   ],
   "notes": "Quote: 'the current values, 22.587 (Os) and 22.562 (Ir) g cm–3 at 20 °C differ by only 0.1%.' The essay describes osmium as the densest known metal. A search snippet gave ±0.009 g/cm³ from a 2007 Platinum Metals Review article that was not opened. The sim uses this as the densest matter that exists at everyday pressure. A 2 m osmium Rex weighs 4,066 kg."
  },
  {
   "key": "sirius_b_mass_radius",
   "label": "Sirius B (white dwarf): mass and radius",
   "status": "verified",
   "value_si": 2.0222e+30,
   "unit_si": "kg",
   "low_si": 1.9725e+30,
   "high_si": 2.0719e+30,
   "display": "1.017 ± 0.025 M☉; radius 0.803 ± 0.011 R☉/100 (0.808 with the Gaia DR2 parallax)",
   "sources": [
    {
     "title": "Joyce, Barstow, Casewell et al. (2018), The gravitational redshift of Sirius B, MNRAS 481:2361 (arXiv:1809.01240)",
     "url": "https://arxiv.org/abs/1809.01240"
    },
    {
     "title": "ESA/Hubble heic0516: 98% of the Sun's mass, 12,000 km diameter",
     "url": "https://esahubble.org/news/heic0516/"
    }
   ],
   "notes": "The mass comes from the measured gravitational redshift (80.65 ± 0.77 km/s) and the known radius. The radius 0.803 ± 0.011 R☉/100 is from the paper's text. M☉ = 1.9884 × 10³⁰ kg is the project's sun_mass fact; R☉ = 6.957 × 10⁸ m is the IAU nominal value."
  },
  {
   "key": "density_white_dwarf_sirius_b_mean",
   "label": "White-dwarf matter: Sirius B average density (computed)",
   "status": "estimate",
   "value_si": 2770000000,
   "unit_si": "kg/m^3",
   "low_si": 2150000000,
   "high_si": 2800000000,
   "display": "~2.8 × 10⁹ kg/m³ (2.8 tonnes per cm³), Sirius B's average",
   "sources": [
    {
     "title": "Joyce et al. (2018), MNRAS 481:2361",
     "url": "https://arxiv.org/abs/1809.01240"
    },
    {
     "title": "ESA/Hubble heic0516",
     "url": "https://esahubble.org/news/heic0516/"
    }
   ],
   "notes": "Our calculation: 1.017 × 1.9884e30 kg divided by (4/3)π(0.00803 × 6.957e8 m)³ gives 2.77e9 kg/m³. ESA's rounded figures (98%, 12,000 km) give 2.15e9. The centre of a white dwarf is denser than its average. A 2 m white-dwarf Rex weighs 4.99 × 10⁸ kg, about 4.8 Nimitz-class carriers."
  },
  {
   "key": "neutron_star_typical",
   "label": "Typical neutron star: mass, radius, central density",
   "status": "verified",
   "display": "~1.5 M☉, radius ~12 km, central density up to 5–10 × n₀ (n₀ ≈ 0.16 fm⁻³)",
   "sources": [
    {
     "title": "Lattimer & Prakash (2004), The Physics of Neutron Stars, Science 304:536 (arXiv:astro-ph/0405262)",
     "url": "https://arxiv.org/abs/astro-ph/0405262"
    }
   ],
   "notes": "Quote: 'a mass M on the order of 1.5 solar masses, a radius R of ~12 km, and a central density nc as high as 5 to 10 times the nuclear equilibrium density n0 ≃ 0.16 fm−3'."
  },
  {
   "key": "density_neutron_star_mean",
   "label": "Neutron star: average density (computed)",
   "status": "estimate",
   "value_si": 412000000000000000,
   "unit_si": "kg/m^3",
   "low_si": 300000000000000000,
   "high_si": 710000000000000000,
   "display": "~4.1 × 10¹⁷ kg/m³ (about 400 million tonnes per cm³); ~1.5 × an atomic nucleus",
   "sources": [
    {
     "title": "Lattimer & Prakash (2004), Science 304:536",
     "url": "https://arxiv.org/abs/astro-ph/0405262"
    }
   ],
   "notes": "Our calculation: 1.5 × 1.9884e30 kg divided by (4/3)π(12,000 m)³ gives 4.12e17. The range covers 1.4 M☉ in 13 km (3.0e17) up to 2.0 M☉ in 11 km (7.1e17). A 2 m neutron-star Rex weighs 7.42 × 10¹⁶ kg, about 7.0 Phobos masses."
  },
  {
   "key": "nuclear_saturation_density",
   "label": "Nuclear saturation density (inside an atomic nucleus)",
   "status": "verified",
   "value_si": 270000000000000000,
   "unit_si": "kg/m^3",
   "display": "ρ₀ = 2.7 × 10¹⁴ g/cm³ (n₀ = 0.16 fm⁻³)",
   "sources": [
    {
     "title": "Hebeler, Lattimer, Pethick & Schwenk (2010), Constraints on neutron star radii based on chiral effective field theory interactions, PRL 105:161102 (arXiv:1007.1746)",
     "url": "https://arxiv.org/abs/1007.1746"
    },
    {
     "title": "Lattimer & Prakash (2004)",
     "url": "https://arxiv.org/abs/astro-ph/0405262"
    }
   ],
   "notes": "Hebeler et al. give 'saturation density ρ0 = 2.7 × 10^14 g cm−3', defined as nucleon mass × baryon density. Check: 0.16 fm⁻³ × 1.675e-27 kg = 2.68e17 kg/m³. The sim uses it as a comparison row and as the threshold (10¹⁷ kg/m³ and above) for showing the neutron-matter caveat."
  },
  {
   "key": "neutron_matter_energy_per_particle",
   "label": "Energy stored in pure neutron matter at saturation density",
   "status": "verified",
   "value_si": 1559200000000000,
   "unit_si": "J/kg",
   "low_si": 1350000000000000,
   "high_si": 1770000000000000,
   "display": "16.3 ± 2.2 MeV per neutron (≈ 1.56 × 10¹⁵ J/kg ≈ 370 kt TNT per kg)",
   "sources": [
    {
     "title": "Hebeler et al. (2010), PRL 105:161102",
     "url": "https://arxiv.org/abs/1007.1746"
    }
   ],
   "notes": "Quote: 'The inclusion of 3N forces leads to En(ρ0)/N = 16.3 ± 2.2 MeV'. With nucleon-nucleon forces only it is 10.4 MeV. The J/kg conversion is ours: 16.3 MeV × 1.602e-13 J/MeV / 1.6749e-27 kg. This is energy relative to free neutrons at rest, so it is released if the matter expands freely. Later beta decays and nuclear reactions add more. Treat it as a lower estimate for denser-than-ρ₀ matter."
  },
  {
   "key": "neutron_star_matter_pressure_saturation",
   "label": "Pressure of neutron-star matter at saturation density",
   "status": "verified",
   "value_si": 2.8e+32,
   "unit_si": "Pa",
   "low_si": 2.24e+32,
   "high_si": 3.36e+32,
   "display": "P(ρ₀) = 1.4–2.1 MeV fm⁻³ ≈ 2.2–3.4 × 10³² Pa (about 3 × 10²⁷ atmospheres)",
   "sources": [
    {
     "title": "Hebeler et al. (2010), PRL 105:161102",
     "url": "https://arxiv.org/abs/1007.1746"
    }
   ],
   "notes": "Quote: 'for the values of the pressure we find, P(ρ0) = 1.4 − 2.1 MeV fm−3'. The conversion uses 1 MeV/fm³ = 1.602e32 Pa. This is the pressure that only a neutron star's gravity holds in. In the sim, Rex's indestructibility holds it."
  },
  {
   "key": "neutron_star_matter_decompression",
   "label": "What freed neutron-star matter does",
   "status": "verified",
   "display": "It expands, forms neutron-rich nuclear clusters, loses neutrons, then beta-decays toward r-process nuclei",
   "sources": [
    {
     "title": "Lattimer, Mackie, Ravenhall & Schramm (1977), The decompression of cold neutron star matter, ApJ 213:225",
     "url": "https://inspirehep.net/files/b46a0e2d39730f7ee382f8edaa0ac6c5"
    }
   ],
   "notes": "Abstract: 'as the density falls below nuclear density, nuclear clusters are formed ... these nuclei lose neutrons to the external sea of neutrons ... when the β-decay time scale becomes shorter than the expansion time scale, β-decays take place'. The paper's motivating case is tidal disruption by a black hole. It does not give an explosion energy; the sim's energy figure comes from Hebeler et al. 2010."
  },
  {
   "key": "gravitational_constant",
   "label": "Newtonian constant of gravitation",
   "status": "verified",
   "value_si": 6.6743e-11,
   "unit_si": "m^3 kg^-1 s^-2",
   "display": "6.674 30(15) × 10⁻¹¹ m³ kg⁻¹ s⁻² (CODATA 2022)",
   "sources": [
    {
     "title": "NIST CODATA: Newtonian constant of gravitation",
     "url": "https://physics.nist.gov/cgi-bin/cuu/Value?bg"
    }
   ],
   "notes": "Used for Rex's and Ollie's own gravity. Earth itself keeps the engine's GM = 3.986004418e14."
  },
  {
   "key": "schwarzschild_radius",
   "label": "Schwarzschild radius (event-horizon radius of a non-spinning black hole)",
   "status": "verified",
   "display": "r_s = 2GM/c²; Earth's would be about 9 mm, the Sun's about 3.0 km",
   "sources": [
    {
     "title": "Wikipedia: Schwarzschild radius",
     "url": "https://en.wikipedia.org/wiki/Schwarzschild_radius"
    }
   ],
   "notes": "Check: 2 × 3.986e14 / c² = 8.87 mm for Earth. The sim calls Rex a black hole when r_s ≥ the radius of a ball with his volume."
  },
  {
   "key": "buchdahl_bound",
   "label": "Buchdahl's limit: how compact a static body can be",
   "status": "verified",
   "display": "2GM/(Rc²) ≤ 8/9, so R ≥ 9/8 of the Schwarzschild radius (isotropic pressure, density not rising outward)",
   "sources": [
    {
     "title": "Andréasson (2008), Sharp bounds on 2m/r of general spherically symmetric static objects, J. Diff. Eq. 245:2243 (arXiv:gr-qc/0702137)",
     "url": "https://arxiv.org/abs/gr-qc/0702137"
    },
    {
     "title": "Buchdahl (1959), General Relativistic Fluid Spheres, Phys. Rev. 116:1027",
     "url": "https://link.aps.org/doi/10.1103/PhysRev.116.1027"
    }
   ],
   "notes": "Andréasson's abstract: 'In 1959 Buchdahl obtained the inequality 2M/R ≤ 8/9 under the assumptions that the energy density is non-increasing outwards and that the pressure is isotropic.' The APS page itself was not readable. Andréasson shows the bound loosens toward 1 for materials allowed stronger stresses, which is how an indestructible Rex can get closer."
  },
  {
   "key": "density_black_hole_rex_2m",
   "label": "Density at which a 2 m Rex is a black hole (computed)",
   "status": "estimate",
   "value_si": 1.3102e+27,
   "unit_si": "kg/m^3",
   "display": "3c²/(8πGR²) = 1.31 × 10²⁷ kg/m³ at 2 m (mass 2.36 × 10²⁶ kg = 39.5 Earths); scales as 1/height²",
   "sources": [
    {
     "title": "Wikipedia: Schwarzschild radius",
     "url": "https://en.wikipedia.org/wiki/Schwarzschild_radius"
    },
    {
     "title": "NIST CODATA G",
     "url": "https://physics.nist.gov/cgi-bin/cuu/Value?bg"
    }
   ],
   "notes": "Computed, not sourced. R = (3 × 0.18/4π)^⅓ = 0.350263 m; setting r_s = R gives m = Rc²/2G = 2.358e26 kg. Other sizes: 0.4 m plush 3.28e28 kg/m³ (7.9 Earths); 50 m kaiju 2.10e24 kg/m³ (987 Earths). Buchdahl's limit is reached at 8/9 of this mass, 2.10e26 kg at 2 m."
  },
  {
   "key": "phobos_mass",
   "label": "Mass of Phobos",
   "status": "verified",
   "value_si": 10618000000000000,
   "unit_si": "kg",
   "display": "1.06 × 10¹⁶ kg (GM 0.0007087 ± 0.0000006 km³/s²)",
   "sources": [
    {
     "title": "JPL Solar System Dynamics: Planetary satellite physical parameters",
     "url": "https://ssd.jpl.nasa.gov/sats/phys_par/"
    },
    {
     "title": "NASA NSSDC Mars Fact Sheet (Phobos 10.6 × 10¹⁵ kg)",
     "url": "https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html"
    }
   ],
   "notes": "Mass = GM/G = 7.087e5 / 6.6743e-11 = 1.062e16 kg. The JPL GM comes from the MAR097 ephemeris; the NSSDC table (updated 19 May 2025) agrees at 10.6e15."
  },
  {
   "key": "deimos_mass",
   "label": "Mass of Deimos",
   "status": "verified",
   "value_si": 1441000000000000,
   "unit_si": "kg",
   "display": "1.44 × 10¹⁵ kg (GM 0.0000962 ± 0.0000028 km³/s²)",
   "sources": [
    {
     "title": "JPL Solar System Dynamics: Planetary satellite physical parameters",
     "url": "https://ssd.jpl.nasa.gov/sats/phys_par/"
    }
   ],
   "notes": "9.62e4 / 6.6743e-11 = 1.441e15 kg. The NSSDC Mars fact sheet still lists an older 2.4e15 kg; the JPL value is newer and used here."
  },
  {
   "key": "prem_density_polynomials",
   "label": "PREM density profile of the Earth (polynomials in x = r/6371 km)",
   "status": "verified",
   "display": "Inner core 13.0885 − 8.8381x²; outer core 12.5815 − 1.2638x − 3.6426x² − 5.5281x³; lower mantle 7.9565 − 6.4761x + 5.5283x² − 3.0807x³; then 5.3197 − 1.4836x (5701–5771 km), 11.2494 − 8.0298x (to 5971), 7.1089 − 3.8045x (to 6151), 2.6910 + 0.6924x (to 6346.6), 2.900 (to 6356), 2.600 (to 6368), ocean 1.020 (g/cm³)",
   "sources": [
    {
     "title": "Dziewonski & Anderson (1981), Preliminary reference Earth model, PEPI 25:297 (doi:10.1016/0031-9201(81)90046-7)",
     "url": "https://doi.org/10.1016/0031-9201(81)90046-7"
    },
    {
     "title": "GENIE PREM implementation (code listing of the PREM density polynomials)",
     "url": "https://hep.ph.liv.ac.uk/~costasa/genie_doxygen/master/html/namespacegenie_1_1utils_1_1prem.html"
    }
   ],
   "notes": "The coefficients were read from the GENIE code listing; the original paper is paywalled. They were checked by integrating them: mass 5.976e24 kg, g = 10.68 m/s² at the core-mantle boundary, 4.40 at the inner-core boundary, central pressure 364 GPa, and Earth's binding energy 2.490e32 J. All agree with the published PREM values (next fact) to 0.1%. The sim replaces the 3 km ocean layer with 2,600 kg/m³ crust because Rex starts on land."
  },
  {
   "key": "prem_checkpoints",
   "label": "PREM values used to check the integration",
   "status": "verified",
   "display": "Central pressure 363.852 GPa; inner/outer core boundary g 4.4002 m/s²; core–mantle boundary g 10.6823 m/s²; surface g 9.8156 m/s²; outer core liquid, inner core solid",
   "sources": [
    {
     "title": "Rodríguez-Mozos & Moya (2022), Internal structure and magnetic moment of rocky planets, A&A, Table 1 'Earth physical characteristics according to PREM' (arXiv:2203.01065)",
     "url": "https://arxiv.org/abs/2203.01065"
    }
   ],
   "notes": "The same paper's text: 'the outer core is dominated by liquid Fe ... and the inner core, which is composed by crystalline solid Fe'. The sim therefore gives the outer core no strength."
  },
  {
   "key": "gravity_tunnel_time",
   "label": "Fall time straight through the Earth (gravity tunnel)",
   "status": "verified",
   "value_si": 2280,
   "unit_si": "s",
   "display": "38 minutes along a diameter with the real (seismic) density profile; 42 minutes for a uniform Earth",
   "sources": [
    {
     "title": "Klotz (2015), The gravity tunnel in a non-uniform Earth, Am. J. Phys. 83:231 (arXiv:1308.1342)",
     "url": "https://arxiv.org/abs/1308.1342"
    }
   ],
   "notes": "Abstract: 'The time taken to fall along the diameter is found to be 38 rather than 42 minutes.' Our PREM integration gives 38 min 10 s (2,290 s) and a top speed of 9,916 m/s at the centre. The uniform-Earth value is 42.17 min."
  },
  {
   "key": "earth_sidereal_rotation",
   "label": "Earth's sidereal rotation period",
   "status": "verified",
   "value_si": 86164.2,
   "unit_si": "s",
   "display": "23.9345 h, so Ω = 7.2921 × 10⁻⁵ rad/s",
   "sources": [
    {
     "title": "NASA NSSDC Earth Fact Sheet",
     "url": "https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html"
    }
   ],
   "notes": "Ω = 2π/(23.9345 × 3600). Anderson's Theory of the Earth, Table A-5, gives 7.2921 × 10⁻⁵ rad/s."
  },
  {
   "key": "energy_earth_binding_prem_computed",
   "label": "Earth's gravitational binding energy, integrated from PREM (check)",
   "status": "estimate",
   "value_si": 2.4904e+32,
   "unit_si": "J",
   "display": "2.49 × 10³² J (our integral of G M(r) dm / r over PREM)",
   "sources": [
    {
     "title": "Dziewonski & Anderson (1981) via GENIE coefficients",
     "url": "https://hep.ph.liv.ac.uk/~costasa/genie_doxygen/master/html/namespacegenie_1_1utils_1_1prem.html"
    }
   ],
   "notes": "This reproduces the 2.49e32 J that data.js holds as 'claimed' (energy_earth_gravitational_binding). That row could cite this computation as an independent check."
  },
  {
   "key": "walking_running_peak_vertical_force",
   "label": "Peak vertical ground force in walking and running",
   "status": "verified",
   "value_si": 1.2,
   "unit_si": "body weights",
   "low_si": 1,
   "high_si": 1.5,
   "display": "Walking 1.0–1.5 × body weight (rising with speed); running 2.0–2.9 ×",
   "sources": [
    {
     "title": "Nilsson & Thorstensson (1989), Ground reaction forces at different speeds of human walking and running, Acta Physiol Scand 136:217 (PubMed 2782094)",
     "url": "https://pubmed.ncbi.nlm.nih.gov/2782094/"
    }
   ],
   "notes": "Abstract, read through the Europe PMC API: 'The peak amplitude of the vertical reaction force in walking and running increased with speed from approximately 1.0 to 1.5 b.w. and 2.0 to 2.9 b.w. respectively' (12 men, 1.0–3.0 m/s walking). The sim uses 1.2 for walking, which is our choice for normal pace."
  },
  {
   "key": "bearing_factor_nq",
   "label": "Bearing capacity factor N_q (depth term) for sand and gravel",
   "status": "verified",
   "value_si": 18.4,
   "low_si": 18.4,
   "high_si": 64.19,
   "display": "N_q = 18.40 at φ = 30° (loose sand), 64.19 at φ = 40° (dense sand and gravel)",
   "sources": [
    {
     "title": "USACE EM 1110-1-1905 Bearing Capacity of Soils (1992), Table 4-4 (Meyerhof, Hansen, Vesic factors)",
     "url": "https://www.tugraz.at/fileadmin/user_upload/Institute/IAG/Files/18_Bearing_Capacity_of_Soils-USACE.pdf"
    }
   ],
   "notes": "Same source and friction angles as the project's sand and gravel bearing facts. In the sim the soil above a sinking foot adds γ·D·N_q of strength. Shape and depth factors are left out, which slightly overstates the sinking."
  },
  {
   "key": "atmosphere_retention_rule",
   "label": "Rule of thumb for keeping an atmosphere",
   "status": "verified",
   "value_si": 6,
   "display": "A gas evaporates if v_rms > v_esc/6, so a body keeps it if v_esc > 6 v_rms",
   "sources": [
    {
     "title": "SFU PHYS 390 Lecture 9, Planetary atmospheres (text: Carroll & Ostlie ch. 18.3, 21.5)",
     "url": "https://www.sfu.ca/~boal/390lecs/390lec9.pdf"
    }
   ],
   "notes": "Quote: 'It is found that vrms > vesc/6 is good enough for the atmosphere to evaporate.' Other teaching sources use 6× the mean speed, or a stricter 10× for billions of years; those were seen only in search snippets. It is a rule of thumb. Air at 288.15 K: v_rms = √(3 × 287.05 × 288.15) = 498 m/s, so the threshold is 2,989 m/s."
  },
  {
   "key": "bondi_radius_and_rate",
   "label": "Bondi accretion: radius and rate",
   "status": "verified",
   "display": "r_B = GM/c_s²; Ṁ = 2πG²M²ρ∞/(c∞² + v∞²)^(3/2)",
   "sources": [
    {
     "title": "Edgar (2004), A review of Bondi–Hoyle–Lyttleton accretion, New Astron. Rev. 48:843 (arXiv:astro-ph/0406166), eqs. 30–31",
     "url": "https://arxiv.org/abs/astro-ph/0406166"
    }
   ],
   "notes": "Inside r_B, gas 'becomes supersonic and moves towards a freefall solution'. Eq. 31 is Bondi's interpolation formula; at rest it is 2πG²M²ρ/c³. The same review reports simulations in which heating and radiation pressure cut the rate far below the Bondi–Hoyle prediction, so the sim labels the rate an upper bound."
  },
  {
   "key": "iau_nominal_solar_radius",
   "label": "Nominal solar radius",
   "status": "verified",
   "value_si": 695700000,
   "unit_si": "m",
   "display": "1 R☉ = 6.957 × 10⁸ m",
   "sources": [
    {
     "title": "IAU 2015 Resolution B3 (arXiv:1510.07674)",
     "url": "https://arxiv.org/abs/1510.07674"
    }
   ],
   "notes": "Used to turn Sirius B's radius into metres."
  },
  {
   "key": "stevenson_core_probe",
   "label": "Stevenson's proposal: sinking a probe to Earth's core in molten iron",
   "status": "verified",
   "display": "10⁸–10¹⁰ kg of molten iron; about a week to reach the core",
   "sources": [
    {
     "title": "Stevenson (2003), Mission to Earth's core: a modest proposal, Nature 423:239 (Caltech record)",
     "url": "https://authors.library.caltech.edu/39229"
    }
   ],
   "notes": "Comparison only. Stevenson's mass sinks by cracking the rock open (molten iron in a crack), which is a different mechanism from Rex shoving rock aside. A 10⁸ kg Rex in the sim takes about 2.8 hours to stick at the inner core."
  },
  {
   "key": "earth_surface_heat_flow",
   "label": "Earth's total surface heat flow",
   "status": "verified",
   "value_si": 47000000000000,
   "unit_si": "W",
   "low_si": 45000000000000,
   "high_si": 49000000000000,
   "display": "47 ± 2 TW",
   "sources": [
    {
     "title": "Davies & Davies (2010), Earth's surface heat flux, Solid Earth 1:5",
     "url": "https://se.copernicus.org/articles/1/5/2010/"
    }
   ],
   "notes": "Comparison for the average heat a settling neutron-star Rex dumps into the planet: about 23 TW over ~5,000 years."
  },
  {
   "key": "deep_rock_strength_assumption",
   "label": "Strength of rock against a body pushed through it, at any depth (sim assumption)",
   "status": "estimate",
   "value_si": 1700000000,
   "unit_si": "Pa",
   "low_si": 100000000,
   "high_si": 4100000000,
   "display": "1.7 GPa in all solid layers (crust, mantle, inner core); 0 in the liquid outer core",
   "sources": [
    {
     "title": "Project fact ground_granite_ultimate_bearing_small_punch (USACE EM 1110-1-2908; Hoek)",
     "url": "https://www.cedengineering.com/userfiles/Rock%20Foundations-R1.pdf"
    },
    {
     "title": "Rodríguez-Mozos & Moya (2022): liquid outer core, solid inner core",
     "url": "https://arxiv.org/abs/2203.01065"
    }
   ],
   "notes": "Our assumption. The surface granite bearing value is reused everywhere because no measurement exists for rock resisting a body at these depths and speeds. Deep rock is hotter, which weakens it, and far more confined, which strengthens it. The 3-D integration shows that only bodies within a few times the fall-through threshold, and the late phase of settling, depend on this number. For a neutron-star Rex, 0.1–4.1 GPa moves the settling time between about 2,200 and 29,000 years."
  }
 ],
 "inputs": "From the page state:\n- Rex: state.H (0.1–500 m), state.m (kg; density = state.m / P.bodyVolume(state.H)), strength F = 10^state.logKg × g (or Infinity when state.inf), state.mode (only used for the jump chip), state.surface, state.groundHolds (comic ground), state.anchor. In the Weight tab, anchor changes nothing: \"bolted\" stops sliding but not sinking, as in the Lift tab.\n- Ollie (duo tests, mutual gravity only): state.oH, state.oM, and his own strength.\n- Latitude is fixed at 0° (equator). There is no new control; the page says so.\n\nFrom engine.js (existing): K.g, K.GM, K.R_E, K.c, K.rho0, K.a0, K.T0, K.PONCELET_K (=1), K.TNT_J_per_kg, K.EARTH_BIND, P.bodyVolume(H) (0.18 m³ × (H/2)³), makeBody → {H, s, m, volume, rho, footArea (0.045 s²), footB, topArea (0.3 s²), digArea}, P.qultFor(surface, B), P.stagnationT(v), P.jump(ctx), P.throwOnce/throwObject, P.lift, MUSCLE.jump.forceFrac (1.4).\n\nNew constants (put in K):\n- G = 6.6743e-11\n- M_E = 5.9722e24\n- OMEGA_E = 2π/(23.9345 × 3600) = 7.29212e-5 rad/s\n- SIGMA_ROCK = 1.7e9 Pa\n- RHO_ROCK = 2700 kg/m³\n- UCS_ROCK = 2.0e8 Pa\n- R_AIR = 287.0528 J/(kg K)\n- NQ = {sand: 18.40, gravel: 64.19}\n- WALK_LOAD = 1.2\n- JEANS = 6\n- E_NM = 1.5592e15 J/kg (16.3 MeV per neutron mass)\n- P_NM = [2.24e32, 3.36e32] Pa\n- RHO_OSMIUM = 22587\n- RHO_NM_CAVEAT = 1e17 (show the neutron-matter caveat at or above this)\n- M_RESHAPE = 1e-3 × M_E = 5.9722e21 kg\n- Person used for tidal stretch: L = 1.8 m (illustrative).\n- Rex's hand: the throw starts at r0 = max(R, 0.25 H) from his middle; held objects sit at r_l = 0.5 H + L_o/2.\n\nNew data (build-data.py → data.js):\n- D.densities: [{id, chip, short, rho, note, keys}]:\n  - plush: 30, chip 'Plush'\n  - water: 1000, chip 'Water (default)'\n  - human: 1060, chip null (comparison only)\n  - steel: 7850, chip 'Steel'\n  - osmium: 22587, chip 'Osmium'\n  - whitedwarf: 2.77e9, chip 'White dwarf'\n  - nucleus: 2.7e17, chip null\n  - neutronstar: 4.12e17, chip 'Neutron star'\n  - The app appends a computed chip 'Black hole' with rho = P.blackHoleDensity(state.H). densityControl must skip entries with chip == null.\n- D.massRefs for the mass chart: Deimos 1.441e15, Phobos 1.062e16 (new); reuse D.objects masses for bowling ball, piano, car, tank, Titanic, Nimitz, Empire State, Great Pyramid, Everest, the sky (5.1e18), Moon, Earth, Sun.",
 "equations": "All values are SI. \"Default\" means the 2 m, 180 kg body; \"NS\" means 4.12e17 kg/m³ (m = 7.416e16 kg); \"WD\" means 2.77e9 kg/m³ (m = 4.986e8 kg).\n\nE1 Size, mass and density\nV(H) = 0.18 (H/2)³ m³ (P.bodyVolume). m = ρV and ρ = m/V. Equal-volume radius R = (3V/4π)^⅓ = 0.350263 m at 2 m. Every self-gravity number treats him as a uniform ball of this radius, and as a point mass outside it. The page says so.\n\nE2 Weight\nW = m g (g = 9.80665). Valid while m ≪ M_E; above 1e-3 M_E the sim switches to the planet regimes (E18).\n\nE3 Can he move his own weight?\nHis legs push at most F_leg = 1.4 F. That is MUSCLE.jump.forceFrac, the share the jump already uses; comic mode never does worse than real, so 1.4 F applies in both modes.\n- Get up / stand up: F_leg ≥ W, i.e. lift ≥ m/1.4.\n- Walk: F_leg ≥ 1.2 W, i.e. lift ≥ 0.857 m. Each step puts 1.0–1.5 W on one leg (Nilsson & Thorstensson 1989).\n- Run: F > W, the existing Sprint rule.\n- Jump: P.jump(ctx).v > 0. The engine already pushes against (m − feet) g.\n- Standing still needs no muscle: his indestructible body carries the load.\nDefault: stand needs 128.6 kg lift, walk 154.3 kg, run 180 kg. This is pessimistic for weak strengths (real near-straight legs are stronger than at the bottom of a squat), which does not matter on a log scale of super-strength.\n\nE4 Pressure on the ground\n- Feet: p1 = W / (2 A_foot), with A_foot = 0.045 s².\n- Whole underside: p2 = W / A_b, with A_b = topArea = 0.3 s².\n- Surface limit: q0f = qultFor(surface, footB). Under the body: q0b = qultFor(surface, √A_b). Granular soils grow ∝ B; others are constant.\n- Default: p1 = 1765.2 / 0.09 = 19,613 Pa.\n\nE5 Sinking a little: two stages\nSand and gravel: q(D) = q0 + γ D N_q, with γ = ρ_soil g; N_q = 18.40 for sand (φ 30°), 64.19 for gravel (φ 40°).\nClays: q(D) = q0 + γ D. This counts only the weight of soil above (no Skempton depth factor), so it is conservative.\n- Stage 1, feet: D1 = (p1 − q0f) / (γN). Stop if D1 ≤ 0.45 H (leg length).\n- Stage 2, whole underside: D2 = max(0.45 H, (p2 − q0b) / (γN)). If D2 ≤ H he is in to his hips or chest. If D2 > H he is out of sight: he goes down through the soil to bedrock, at a depth the sim cannot know.\n- Thin layers (asphalt, the 10 cm slab, lake ice, steel deck): if p1 > q0 he punches through into whatever is below. Below ice he sinks to the lake bottom, because he is denser than water whenever p1 > 5 MPa.\n- Granite: if p1 > 1.7 GPa but p2 ≤ 1.7 GPa, his feet punch in and he stops at D = 0.45 H.\n\nE6 Falls through the planet\nW > σ_rock A_b = 1.7e9 × 0.3 s² N. At 2 m that is m > 5.2006e7 kg, i.e. ρ > 2.889e8 kg/m³; at 50 m, ρ > 1.156e7. This check comes before the surface checks, because the rock under any soil cannot hold him either.\n\nE7 PREM gravity\nρ(r) is the polynomial for the layer containing r (x = r/6371 km; table in facts; top 3 km set to 2,600).\n- Mass inside r, closed form per layer: M(r) = Σ_layers 4π Σ_k 1000 a_k R_E^−k (r2^(k+3) − r1^(k+3)) / (k+3).\n- g(r) = K.GM × [M(r)/M_PREM] / r², normalised so g(R_E) = K.GM/R_E² = 9.8203.\n- Φ(r) − Φ(R_E) = −∫_r^R g dr: a 1 km Simpson table, plus analytic in the inner core:\n  Φ_ic(r) = 4πG·s·1000 (13.0885 r²/6 − 8.8381 r⁴/(20 R_E²)) + const, with s = K.GM/(G M_PREM).\n- Checks: g(3480 km) = 10.683; g(1221.5 km) = 4.401; Φ(R) − Φ(0) = 4.9164e7 J/kg; v_max = √(2 × 4.9164e7) = 9,916 m/s; diameter fall time 38 min 10 s (Klotz: 38 min); central pressure 364.1 GPa (published 363.85); binding energy 2.4904e32 J.\n\nE8 Motion through the Earth\nUse a non-spinning frame with the origin at Earth's centre and z along the spin axis; Ω = 7.29212e-5 rad/s. The rock moves at Ω × r. His velocity relative to the rock is u = v − Ω × r = (vx + Ω y, vy − Ω x, vz).\na = −g(r) r̂ + (ρ(r) V/m) g(r) r̂ − (k ρ(r) A_b / m) |u| u − (strength impulse, E9).\n- The second term is buoyancy; the third is inertial drag with k = K.PONCELET_K = 1. This is the same Poncelet/cavity-expansion form the engine uses for stomps (penetrationDepth) and jumps (cB).\n- Start at latitude 0: r0 = (R_E, 0, 0), v0 = Ω × r0 = (0, 465.1, 0) m/s.\n\nE9 Rock strength as friction\nRock strength σ(r) = 1.7 GPa in solid layers, 0 in the outer core (1,221.5–3,480 km). It acts against u with magnitude σ A_b, but never reverses u. After each step: u ← u × max(0, 1 − σ A_b dt / (m |u|)).\nHe is stuck for good when u = 0 and |m − ρ(r) V| g(r) ≤ σ A_b. Rotation terms (≤ 0.34% of g at the surface) are ignored in that check.\n\nE10 Long-term settling (orbit average)\nUsed when the first trip loses little energy. Treat each half-trip as straight through the centre with amplitude A (outermost radius).\n- v²(r) = 2 [Φ(A) − Φ(|r|)]\n- Loss per half-trip: ΔE(A) = ∫_{−A}^{A} A_b [σ(r) + k ρ(r) v²] dr\n- Duration: T(A) = ∫ dr / v\n- Energy: E(A) = m [Φ(A) − Φ(0)], so dE/dA = m g(A)\n- Half-trips: N = ∫_{r_stop}^{R_E} m g(A) (1 − ρV/m) / ΔE(A) dA; time t = ∫ T(A) dN.\n- Rest radius r_stop: the largest solid-layer r with (m − ρV) g(r) ≤ σ A_b. NS: 1.88 mm. WD: 280 km.\n- Quadrature uses r = A sin θ with θ in (−π/2, π/2). Validated against full 3-D runs: m = 1e10 kg 5.6 h vs 6.1 h; 3e10 kg 17.2 vs 17.5 h; 1e11 kg 57.9 vs 58.8 h.\n\nE11 Energy released into the planet\nE = m [Φ(R_E) − Φ(r_end)].\n- NS: 7.416e16 × 4.9164e7 = 3.646e24 J (8.7 × the Chicxulub value 4.2e23).\n- WD, stopping at 216 km: 2.45e16 J (5.8 Mt).\n- Per first trip (NS): ΔE(R_E) = 2.373e18 J (567 Mt, 11 × Tsar Bomba). That is m g × 3.26 m, which is why he turns back about 3 m short.\n\nE12 His own gravity (equal-volume ball)\nGM_R = G m. Surface gravity g_s = G m / R². Escape speed v_esc = min(c, √(2 G m / R)).\nHis pull beats Earth's within d_beat = √(G m / g); this only matters when d_beat > R, i.e. m > g R²/G = 1.80e10 kg at 2 m.\nSomething dropped from rest at distance d0 (centre to centre, his pull only):\n- speed on arrival: v = √(2 G m (1/R − 1/d0))\n- time: t = √(d0³ / (2 G m)) [√(x(1−x)) + arccos √x], with x = R/d0.\nNS: GM = 4.9497e6; g_s = 4.0345e7 m/s² (4.11 million g); v_esc = 5,316 m/s; d_beat = 710.4 m; from 10 m an object arrives in 15.7 ms at 5,222 m/s.\nDefault: g_s = 9.79e-8 m/s²; v_esc = 0.26 mm/s; d_beat = 35 µm, which is inside him.\n\nE13 Tidal stretch on a person (L = 1.8 m, lying along the line to him)\nΔa(d) = G m [1/(d − L/2)² − 1/(d + L/2)²], with d ≥ R + L/2. Far away, Δa ≈ 2 G m L / d³.\nd_1g is where Δa = g, found by bisection; it is 0 if Δa(R + L/2) < g.\nThe pull through the person's middle is about m_p Δa / 8 for a uniform body.\nNS: d_1g = 122.0 m (far-field check (2 × 4.9497e6 × 1.8 / 9.80665)^⅓ = 122.0); at 10 m, Δa = 1,847 g.\n\nE14 Air falling onto him\nBondi radius r_B = G m / c_s², c_s = K.a0 = 340.29 m/s. Rate (upper bound) Ṁ = 2π G² m² ρ0 / c_s³. Heat per kg arriving = G m / R. Power = Ṁ G m / R. Arrival temperature = P.stagnationT(v_esc) (sea-level stagnation table, an upper bound), shown only if v_esc < 0.01 c.\nNS: r_B = 42.74 m; Ṁ = 4.785e6 kg/s; 1.413e7 J/kg; 6.76e13 W; about 7,460 K.\nAir falls in only when r_B > R, i.e. m > 6.08e14 kg at 2 m.\n\nE15 Holding an atmosphere (alone in space, 288 K)\nHe holds air if v_esc > 6 v_rms, with v_rms = √(3 R_air T0) = 498.1 m/s.\nAt 2 m: m > (6 v_rms)² R / (2G) = 2.344e16 kg (ρ > 1.30e17). NS: yes (5,316 > 2,989).\n\nE16 Rock crushed by his pull\nThe weight of rock around a point mass gives pressure P(r) = ρ_rock G m / r. Rock fails where P > σ, i.e. within r_crush = ρ_rock G m / σ.\nWith σ = 1.7 GPa (rock hemmed in, the sim's rock value): NS r_crush = 2700 × 4.9497e6 / 1.7e9 = 7.86 m.\nLoose surface rock (σ = UCS 200 MPa) fails 8.5× farther out: 66.8 m.\nr_crush = R_E at m = 6.0e22 kg, about 0.01 M_E.\n\nE17 Black hole\nr_s = 2 G m / c². He is a black hole if r_s ≥ R, i.e. ρ ≥ ρ_BH(H) = 3c² / (8π G R²).\n- 2 m: 1.3102e27 kg/m³, m = 2.3583e26 kg (39.49 M_E)\n- 0.4 m: 3.275e28\n- 50 m: 2.096e24\nBuchdahl flag: r_s > (8/9) R, i.e. m > 0.889 m_BH. Ordinary matter with isotropic pressure cannot stay static there; the sim lets his indestructibility hold until the horizon.\n\nE18 Planet regimes\n- 'reshapes' when M_RESHAPE ≤ m < M_E (r_crush ≳ 0.1 R_E).\n- 'earthFalls' when m ≥ M_E. Earth's surface falls onto him in t_ff = (π/2) √(R_E³ / (2 G (m + M_E))). At m = M_E that is 632.6 s; at the black-hole Rex (2.358e26 kg) it is 140.6 s.\n- Energy released, order of magnitude: E ≈ G m M_E / R_E. For the black-hole Rex this is 1.475e34 J, 59 × Earth's binding energy.\n\nE19 Neutron-matter caveat (ρ ≥ 1e17)\nE_release ≥ m × 1.5592e15 J/kg. NS: 1.156e32 J, 0.46 × Earth's binding energy. Pressure that must be held in: 2.2–3.4e32 Pa.\n\nE20 Effects on the existing moves\nMass already enters every move through body.m. Dempster segment masses scale with m, so a ρ-times-denser Rex needs ρ-times the strength to move his own limbs the same way. Recoil falls and friction footing (μ m g) rises with m. These need no new code.\nNew code is needed only for self-gravity, applied when G m / (0.5 H)² ≥ 1e-3 g (m ≥ 1.47e7 kg at 2 m):\n- Lift: object weight W_o = m_o (g + G m / r_l²), with r_l = 0.5 H + L_o/2 and L_o = obj.L || ∛(m_o/ρ_o). For example, an NS Rex holding a Corolla overhead: r_l = 2.134 m, g_s = 1.087e6, W_o = 1.457e9 N.\n- Throw, holding check: needed = hypot(m_B g, m_o G m / r_l²) ≤ F_drive.\n- Throw, escape: after throwOnce gives v, v_out² = v² − 2 G m / r0, with r0 = max(R, 0.25 H). This exactly accounts for the pull during the stroke and after release when the push does the same work (comic mode; it is approximate for real muscle). If v_out² ≤ 0 the object never gets away: it falls back onto him. Otherwise fly() with v_out (patched conic: his well, extent ~d_beat, is crossed in under a second).\n  NS: escape needs v > √(2 × 4.9497e6 / 0.5) = 4,450 m/s. Real muscle tops out at 84.6 m/s for a baseball, so nothing he throws escapes. In comic mode a baseball gets away above 1.47e21 kg of lift.\n- Jump: no change; his pull on the ground and Earth's pull on him are the same pair of forces. Gated per E18 and the ground regime.\n\nE21 Rex–Ollie gravity (duo tests)\nF = G mA mB / d², with d ≥ dc = R_A + R_B (equal-volume balls touching).\n- Binding at contact: G mA mB / dc.\n- Each body's footing (friction μ m g) slips when d < √(G m_other / (μ g)). The pull equals one body weight at d = √(G m_other / g).\n- Falling together from d0: radial Kepler with M = mA + mB:\n  t = √(d0³/(2GM)) [√(x(1−x)) + arccos √x], x = dc/d0; v = √(2GM (1/dc − 1/d0)).\n- Catch: the ball must cross the saddle of Φ(x) = −G mA/x − G mB/(d − x) at x* = d/(1 + √(mB/mA)). Need ½ v0² ≥ Φ(x*) − Φ(r0). Arrival speed: ½ v_f² = ½ v0² + Φ(r0) − Φ(x_catch).\nNS pair:\n- dc = 0.7005 m; F = 7.480e23 N (1.03 million × each weight; separating needs 7.63e22 kg of lift)\n- E_bind = 5.240e23 J; equal-weight distance 710.4 m; footing slips (μ 0.6) within 917 m\n- from 10 m apart they meet in 11.1 ms at 5.13 km/s, releasing 4.87e23 J\n- at 10 m, a ball released 0.5 m from Rex needs 4,109 m/s and arrives at Ollie at the same speed\nDefault pair: 4.41e-6 N, the weight of 0.45 mg.",
 "algorithm": "A working prototype of everything below is at /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo/density/calc/weight.js. The test values come from final.js in the same folder; prem.js has the independent PREM integration. Port weight.js into engine.js inside the IIFE and export the functions.\n\n1. Constants. Add to K: G, M_E, OMEGA_E, SIGMA_ROCK, RHO_ROCK, UCS_ROCK, R_AIR, NQ, WALK_LOAD, JEANS, E_NM, P_NM, RHO_OSMIUM, M_RESHAPE. Define LEG_SHARE = MUSCLE.jump.forceFrac.\n\n2. PREM module.\n   - Store PREM as an array of [rTop m, [a0..a3] g/cm³, solid]:\n     [1221.5e3, [13.0885, 0, −8.8381, 0], true], [3480e3, [12.5815, −1.2638, −3.6426, −5.5281], false], [5701e3, [7.9565, −6.4761, 5.5283, −3.0807], true], [5771e3, [5.3197, −1.4836, 0, 0], true], [5971e3, [11.2494, −8.0298, 0, 0], true], [6151e3, [7.1089, −3.8045, 0, 0], true], [6346.6e3, [2.6910, 0.6924, 0, 0], true], [6356e3, [2.9, 0, 0, 0], true], [6371e3, [2.6, 0, 0, 0], true].\n   - premLayer(r) is a linear scan. premRho(r) evaluates the cubic with x = r/K.R_E, × 1000.\n   - shellMass(a, r1, r2) is the closed form in E7. Precompute cumulative layer masses and M_PREM. premMassFrac(r) = (cum[i] + shellMass(a_i, r_{i−1}, r)) / M_PREM.\n   - premG(r) = K.GM × premMassFrac(min(r, R_E)) / r², with premG(0) = 0.\n   - Φ table: PHI[i] at i km (i = 0…6371), with PHI[6371] = 0 and PHI[i] = PHI[i+1] − Simpson(g over [i, i+1] km). premPhi(r): r ≥ R_E → K.GM/R_E − K.GM/r; r ≤ 1221.5 km → PHI0 + Φ_ic(r) (analytic, E7, with PHI0 matched at 1221.5 km); else interpolate the table linearly. The table costs about 20k premG calls once at load.\n\n3. bodyGravity(body) returns, with R = cbrt(3 body.volume / 4π) and GM = K.G m:\n   - {GM, R, gSurf, vEsc (min c), dBeat, beatsOutside (dBeat > R)\n   - rBondi = GM/K.a0², bondiOutside, bondiRate (only if bondiOutside), heatPerKg = GM/R, infallPower\n   - infallT = vEsc < 0.01c ? P.stagnationT(vEsc) : Infinity\n   - holdsAir = vEsc > 6 √(3 K_R_AIR K.T0)\n   - rCrush = RHO_ROCK·GM/SIGMA_ROCK, rCrushUnconfined = RHO_ROCK·GM/UCS_ROCK\n   - tidal1g (E13 bisection on [R + 0.9, 1e12]; 0 if Δa(R + 0.9) < g)\n   - rs = 2GM/c², blackHole (rs ≥ R), buchdahl (rs > 8R/9)\n   - decompJ = body.rho ≥ 1e17 ? m E_NM : 0}\n   Also export blackHoleDensity(H) = 3c²/(8πG R(H)²) and infallFrom(GM, R, d0) → {t, v}.\n\n4. moveCheck(F, m) → {weight, legForce: 1.4F, stand: 1.4F ≥ W, walk: 1.4F ≥ 1.2W, run: F > W, standNeedKg: m/1.4, walkNeedKg: 1.2m/1.4, runNeedKg: m}. F = Infinity makes all three true. The app adds P.jump(ctx) for the jump chip.\n\n5. groundUnderWeight(body, surface, groundHolds), implementing E4–E6, in this order:\n   - groundHolds → 'comic'\n   - W > SIGMA_ROCK·topArea → 'fallsThrough'\n   - p1 ≤ q0f → 'stands'\n   - sand/gravel/softclay/stiffclay → two-stage depth (E5): 'sinks' {sink, stage: 'feet' | 'body'} or 'outOfSight'\n   - granite → 'sinks' {sink: 0.45H, stage: 'rock'}\n   - else → 'punchesThrough' {layer}\n   Return {regime, weight, footPressure, bodyPressure, q0, standRatio, rockRatio, sink, stage, legLength}. Map surfaces by id (sand→NQ.sand, gravel→NQ.gravel, clays→1). If new surfaces arrive later, add a \"kind\" field to D.surfaces rather than keying on ids.\n\n6. fallThrough(body, {latDeg = 0, tMax = 2 days, record}).\n   - State s = [x, y, z, vx, vy, vz] in the inertial frame; start as in E8.\n   - Each step:\n     a. vrel = |u|. dt = min((vrel > 100 || R_E − r < 20 km) ? 1 : 10, max(1e-3, 0.002 r/|v|)).\n     b. One RK4 step with gravity, buoyancy and inertial drag only. Drag and buoyancy apply only when r < R_E; above the surface use gravity alone (he never gets there with drag on).\n     c. If the new r < R_E and premSolid(r), apply the strength impulse of E9 to u and rebuild v = Ω × r + u.\n     d. If that made u = 0, test the stuck condition. If met, record stuck = {t, r} and stop.\n     e. Track minR, max |v|, and radial velocity v_r = r·v/|r|.\n     f. The first sign change of v_r from − to + marks the innermost point.\n     g. The next change from + to − is the far turnaround. Refine it with r_top = r_prev + v_r,prev² / (2 g). Record t, depthShort = R_E − r_top, Earth-fixed longitude lon = atan2(y, x) − Ω t, dLon = wrap(lon − 180°) (negative means west), and latitude asin(z/r). Then stop; the long term goes to step 7.\n     h. Stop at 400,000 steps or tMax, whichever comes first. If tMax is reached without stuck or a turnaround, return {stillSinking: true, r}.\n   - If record is set, push Earth-fixed points every ~30 s for the cut-away chart: (x cos Ωt + y sin Ωt, −x sin Ωt + y cos Ωt).\n   - Typical cost is 1,700–11,000 steps (5–60 ms in Node).\n   - Drift for stuck bodies: Earth-fixed longitude of the end point × r, about 10–20 km east.\n\n7. settle(body, Amax = R_E) implements E10.\n   - Quadrature: 200 points in θ per amplitude, 600 log-spaced amplitudes from max(r_stop, 1 m) to Amax. This takes about 12 ms and agrees with 3000 × 400 to 0.01%.\n   - Return {rStop, halfPasses, years, firstPassLossJ: ΔE(0.99999 R_E), energyJ: m (0 − Φ(rStop))}.\n   - Use it only when the 3-D first trip ended at a far turnaround with depthShort < 0.01 R_E. Otherwise keep integrating in 3-D until stuck (raise tMax to 10 days, all steps 10 s when slow); this covers 1e10–1e12 kg. If still not stuck, run settle(body, current amplitude) for the remainder.\n\n8. planetRegime(m, grav) returns the first match: 'blackHole' (grav.blackHole); 'earthFalls' (m ≥ K.M_E) with collapse = {tff, eLow: K.G m K.M_E / K.R_E}; 'reshapes' (m ≥ K.M_RESHAPE); 'none'.\n\n9. weight(ctx) wrapper for the tab returns\n   {m, rho, V, R, W, strengthRatio: F/W, move, ground, grav, planet, fall, settle, energyJ, denserThanOsmium: rho > 22587, nmCaveat: rho ≥ 1e17 ? {J, P: K.P_NM} : null}.\n   - Run fallThrough and settle only when ground.regime === 'fallsThrough' && !groundHolds && planet.regime === 'none'.\n   - energyJ is m (0 − Φ(r_end)), where r_end is the stuck radius or settle.rStop.\n\n10. Self-gravity hooks in the existing moves (E20), guarded by the 1e-3 g threshold so ordinary densities are unaffected:\n   - lift(): add selfPull to W and gripPressure.\n   - throwOnce(): change canHold and add v_out with a fallsBack flag. Keep v as the push result; pass v_out to fly(). Report escapeNeeded = √(2Gm/r0).\n   - Export selfPull(m, r) = G m/r², escapeSpeedFrom(m, r), vInfinity(v, m, r0).\n\n11. Duo helpers (E21): mutualGravity(mA, RA, mB, RB, d), fallTogether(mA, mB, dc, d0), catchMinSpeed(mA, mB, d, r0). The duo designer wires these into the arm-wrestle, wrestle, catch and collide bays.\n\n12. app.html\n   - Add bayWeight(c) to BAYS (ACTIONS already lists 'weight').\n   - Gate the move tabs: if planet.regime ≠ 'none', each move bay shows a callout and no results (\"His own gravity reshapes the planet at this mass; the move models assume a small Rex on a fixed Earth\"). If ground.regime === 'fallsThrough' && !groundHolds, show the callout \"No rock can hold him at this weight: he sinks into the planet (see Weight). Moves below assume he has something to push on; turn on Comic ground for a fair test\" and keep computing.\n   - The density chips skip chip == null and append a computed Black hole chip.\n   - Add D.densities and D.massRefs to build-data.py, plus source rows for every fact above (label \"Density: …\" etc.).\n   - Add the four assumption cards to static-data.js (see page_text).\n\n13. Numerical guards\n   - m must be finite and > 0, else use BASE_M s³.\n   - Clamp density to 10–1e30 on the slider; the mass box can go below.\n   - Every sqrt takes max(0, …).\n   - Cap vEsc at c and treat rs ≥ R as a black hole before any infall maths.\n   - Bisection loops are capped at 200 iterations.\n   - fallThrough never runs for planet regimes, or for m < 5.2e7 s² kg (no fall).",
 "edge_cases": "- Infinite strength: stand, walk and run are all true and jump follows the engine (light speed in comic mode). Ground, gravity and planet results do not depend on strength, so the Weight tab still shows sinking or falling through. The verdict adds: \"Strength doesn't help: there's nothing under him that can push back.\"\n- Zero or very low strength: the dial minimum is 10 kg. A 180 kg Rex can't get up (needs 128.6 kg) but can stand still: \"his body takes the load\". The jump chip shows \"Can't jump\".\n- Both infinite (infinite strength and black-hole density): the planet regime wins and all moves are gated.\n- Plush (30 kg/m³, 5.4 kg at 2 m): every surface holds (sand at 2.4% of its limit). Self-gravity ~3e-9 of Earth's. Show the human-body comparison: \"about 1/35 of a person's density\".\n- Default (1,000): stands everywhere (loose sand 79%). Nothing self-gravitational.\n- Steel (1,413 kg): sinks 0.45 m in loose sand and 0.9 m (to the hips) in soft clay; stands on gravel (96%).\n- Osmium (4,066 kg): to the hips in sand and soft clay, 0.22 m into gravel, stands on stiff clay (92%), concrete (18%) and granite.\n- Above osmium: show the \"nothing denser exists at everyday pressure\" note.\n- White dwarf (5.0e8 kg): falls through and sticks 216 km from the centre after 1.9 h. Self-gravity is still inside his body (d_beat 5.8 cm < R 35 cm).\n- Neutron star (7.4e16 kg): first trip 38.2 min; turns back ~3 m short, 810 km west of the antipode at the equator; settles in ~4,900 years.\n- Black hole and above: a planet regime, no fall-through and no moves.\n- Near the fall-through threshold (5.2e7–1e8 kg): he sinks slowly (≤ 500–820 m/s) and sticks just inside the solid inner core (~1,195–1,217 km from the centre) after 2.8–10.6 h. Say the result is sensitive to the assumed rock strength (0.1–4 GPa) and could equally be \"stops in the mantle\".\n- Between 1e10 and ~1e12 kg: several damped swings; integrate in 3-D to stuck (hours to days).\n- Above ~1e13 kg: averaged settling (years to millions of years). At 1e18 kg settling takes ~66,000 years; at 1e20 kg, 6.6 million.\n- Relativistic speeds: vEsc is capped at c. Infall temperature is not shown above 0.01c (\"far hotter than the sim's air table goes\"). Below the black-hole density all fall-through speeds stay under 10 km/s, because Earth's potential well caps them.\n- Comic ground: the floor never breaks, so the regime is 'comic' with no sinking or fall. The air, tidal and self-gravity effects still show, phrased \"while he stands on the surface\". Planet regimes still apply: \"Comic ground keeps the floor whole, but at this mass his pull reshapes the planet itself.\"\n- Bolted anchor: does not stop sinking. That matches the Lift tab, where only Comic ground keeps the floor from failing. The math line says so.\n- Unequal sizes: all formulas use each body's own R(H) and V(H). The black-hole density scales as 1/H². The fall-through density threshold scales as 1/H (weight ∝ H³, area ∝ H²): 2.9e8 at 2 m, 1.16e7 at 50 m. A 50 m kaiju at default density stands on sand at the same 79% as the 2 m Rex (granular strength grows with foot width).\n- Duo: with mutual gravity, a dense pair can't be separated unless strength exceeds G mA mB / dc. Their footings slip toward each other inside √(G m / (μ g)). For bodies of very different mass, use each body's own weight in the slip check.\n- Zero, negative or NaN mass or height: fall back to defaults before any computation (state validation already rejects m ≤ 0).\n- Mass box below the slider minimum (e.g. 0.1 kg): formulas stay valid; the density readout shows < 10 kg/m³.\n- Latitude: the sim starts at the equator (sideways drift is largest there). The drift is ~7.3° of longitude at any latitude, so 810 km × cos(latitude), and none at the poles. The page text says this rather than adding a control.\n- Ocean: PREM's 3 km ocean is replaced with crust (he starts on land). The far-side turnaround point would often be under the sea in reality.\n- Ice: punching through drops him into the lake. At any density that breaks 5 MPa ice he is far denser than water, so he sinks to the bottom.",
 "outputs": "P.weight(ctx) returns:\n- m (kg), rho (kg/m³), V (m³), R (m, equal-volume radius), W (N), strengthRatio (F/W; Infinity when strength is infinite).\n- move: {weight N, legForce N, stand, walk, run (booleans), standNeedKg, walkNeedKg, runNeedKg}.\n- ground: {regime: 'comic' | 'stands' | 'sinks' | 'outOfSight' | 'punchesThrough' | 'fallsThrough', footPressure Pa, bodyPressure Pa, q0 Pa, standRatio, rockRatio, sink m, stage: 'feet' | 'body' | 'rock', legLength m, layer}.\n- grav: {GM m³/s², R m, gSurf m/s², vEsc m/s, dBeat m, beatsOutside, rBondi m, bondiOutside, bondiRate kg/s, heatPerKg J/kg, infallPower W, infallT K, holdsAir, rCrush m, rCrushUnconfined m, tidal1g m, rs m, blackHole, buchdahl, decompJ J}.\n- planet: {regime: 'none' | 'reshapes' | 'earthFalls' | 'blackHole', massRatioEarth, tff s, eLow J}.\n- fall (only when falling through):\n  - stuck: {t s, r m, depth m, layer: 'inner core' | 'mantle' | …, driftKm}, or\n  - firstPass: {t s, depthShort m, dLonDeg, westKm, latDeg, minR m, vMax m/s}, plus stillSinking.\n  - path (optional), as Earth-fixed [x, y] points in m.\n- settle (oscillating case): {rStop m, halfPasses, years, firstPassLossJ J, energyJ J}.\n- energyJ (J released into the planet), denserThanOsmium (bool), nmCaveat: {J, P: [Pa, Pa]} or null.\n\nMove-tab additions:\n- lift: weight now includes selfPull; result gets selfPullG (in g).\n- throw: canHold uses selfPull; adds escapeNeeded (m/s), vOut (m/s) and fallsBack (bool).\n\nDuo helpers:\n- mutualGravity: {F N, dContact m, Fcontact N, Ebind J, dEqualWeight m}\n- fallTogether: {t s, v m/s}\n- catchMinSpeed: m/s",
 "page_text": "WEIGHT TAB (solo group, tab label \"Weight\", title \"What his density does just standing there\")\n\nBay controls: a compact row of the same density chips as Settings (Plush, Water (default), Steel, Osmium, White dwarf, Neutron star, Black hole), so people can jump presets without opening Settings. No other controls.\n\nVERDICT. Use the first rule that applies; numbers come from the fmt helpers.\n\n1. Black hole (grav.blackHole): \"Rex is a black hole. At {fmtMass(m)}, {sig(m/M_E,3)} times Earth's mass, he fits inside his own event horizon ({fmtDist(rs)} in radius).\"\n2. Earth falls onto him (planet 'earthFalls'): \"Rex outweighs the Earth {fmtRatio(m/M_E)}. The planet falls onto him in about {fmtTime(tff)} and is crushed around him.\"\n3. Reshapes the planet (planet 'reshapes'): \"Rex has {sig(100 m/M_E,2)}% of Earth's mass, as much as {nearest massRef}. He sinks to the centre and his pull crushes the planet's rock out to {fmtDist(rCrush)}.\"\n4. Falls through and oscillates (fallsThrough, firstPass): \"Rex falls straight through the Earth. {fmtTime(t)} later he coasts to a stop {fmtDist(depthShort)} under the far side's surface, then falls back in.\"\n5. Falls through and sticks (fallsThrough, stuck): \"Rex sinks through the Earth and stops {fmtDist(R_E − r)} down, in the {layer}, {fmtTime(t)} later.\" For the inner core use \"…stops in the solid inner core, {fmtDist(r)} from the centre, …\".\n6. Out of sight: \"Rex sinks out of sight. The {surface.short} can't hold him, so he goes down until he reaches bedrock.\"\n7. Punches through:\n   - Slab, asphalt or steel deck: \"Rex goes straight through {surface.short}.\"\n   - Ice: \"Rex breaks through the ice and sinks to the bottom of the lake.\"\n8. Sinks:\n   - Feet stage: \"Rex sinks {fmtDist(sink)} into the {surface.short} and stops.\"\n   - Body stage: \"Rex sinks in up to his hips ({fmtDist(sink)}) and stops.\"\n   - Rock stage: \"Rex's feet punch into the granite. He sinks in up to his hips and stops.\"\n9. Stands: \"Rex stands fine.\"\n10. Comic ground: \"Comic ground holds him up.\"\n\nSuffixes for rules 8–10, based on legs:\n- !stand: \" But he's too heavy for his own legs: he can't get up, walk or jump.\"\n- stand && !walk: \" He can stand, but he's too heavy to walk.\"\n\nSuffix when beatsOutside: \" Anything within {fmtDist(dBeat)} falls onto him.\"\n\nSTATUS CHIPS (in this order)\n- Ground:\n  - comic → info \"Ground: comic, never breaks\"\n  - stands → good \"Ground holds ({sig(100·standRatio,2)}% of limit)\"\n  - sinks → warn \"Sinks {fmtDist(sink)}\"\n  - outOfSight / punchesThrough → bad \"Ground fails: {fmtRatio(standRatio)} its limit\"\n  - fallsThrough → bad \"No rock can hold him\"\n  - planet regimes → bad \"Reshapes the planet\" / \"Earth falls onto him\" / \"Black hole\"\n- Legs (only for comic / stands / sinks):\n  - walk → good \"Can walk\" (+ \"and run\" if run)\n  - stand && !walk → warn \"Can stand, can't walk\"\n  - !stand → bad \"Too heavy to get up\"\n- Jump (same regimes): v > 0 → good \"Jumps {fmtDist(apex)}\"; else bad \"Can't jump\".\n- Gravity:\n  - beatsOutside → warn \"His pull beats Earth's within {fmtDist(dBeat)}\"\n  - else, when ρ > 1e6 → info \"His gravity: {sci(gSurf/g,2)} of Earth's at his skin\"\n- Air: bondiOutside → bad \"Air falls onto him\".\n- Caveat: rho > 22,587 → info \"Held together only by being indestructible\".\n\nTILES (up to 6)\n- \"Mass\": fmtMass(m), sub \"≈ {fmtRatio(m/ref)} {ref.short}\" against the nearest lower massRef, or \"{fmtDensity(rho)}\".\n- \"Weight\": fmtSI(W,'N'), sub \"strength is {big(F/W,3)}× his weight\". Use \"…{sig(100F/W,2)}% of his weight\" below 1; \"unlimited strength\" if infinite.\n- \"Pressure under his feet\": fmtSI(p1,'Pa'), sub \"ground limit {fmtSI(q0,'Pa')}\" or \"comic ground\".\n- \"Gravity at his skin\": \"{sig(gSurf/g,2)} g\", sub \"as a ball of the same volume, {fmtDist(R)} radius\".\n- \"Escape speed from him\": speedOnly(vEsc), sub \"Earth's: 11.2 km/s\".\n- Regime tile (one of):\n  - firstPass → \"Time to the far side\" fmtTime(t), sub \"{fmtDist(depthShort)} short of the surface\"\n  - stuck → \"Where he stops\" \"{fmtDist(depth)} down\", sub \"after {fmtTime(t)}, top speed {speedOnly(vMax)}\"\n  - settle → \"Settles at the centre after\" \"~{sig(years,2)} years\", sub \"{big(halfPasses/2,2)} round trips\"\n  - earthFalls → \"Earth falls onto him in\" fmtTime(tff)\n  - blackHole → \"Event horizon radius\" fmtDist(rs)\n  - otherwise → \"His pull beats Earth's within\" fmtDist(dBeat), or \"nowhere outside him\"\n- Energy tile when falling through or in a planet regime: \"Energy released\" fmtSI(E,'J'), sub fmtTNT(E) · compareEnergy(E).\n\nCHARTS\na) Always: logBars(\"Rex's mass vs …\", rows) using fmtMass.\n   - Rows: massRefs and D.objects masses within six decades either side of m, plus the nearest one beyond each end.\n   - Highlighted row: \"Rex ({fmtDensity(rho)})\".\nb) When not comic and not fallsThrough: logMeter(\"Ground: pressure under his feet vs what {surface.short} can take\", standRatio).\n   When fallsThrough: logMeter(\"Weight vs what bedrock can carry under his whole body\", rockRatio).\nc) Earth cut-away, for fallsThrough with a path. An SVG circle at chartW, square aspect.\n   - Rings at 1,221.5, 3,480, 5,701 and 6,371 km, labelled inner core, outer core (liquid), mantle, crust; fills use surface tokens.\n   - Rex's path is an accent polyline in the Earth-fixed frame, rotated so the start is at the top. Mark the start (\"starts here\") and the end (\"turns back {depthShort} short\" or \"stops here\").\n   - aria-label: \"Cut-away of the Earth seen from above the North Pole. Rex's path from his starting point to {end}.\"\n   - Caption: \"Seen from above the North Pole. Earth turns under him while he falls, so he comes up west of the exact opposite point. At the poles there would be no drift.\"\n\nWHAT HAPPENS (bullets; `happens` keeps the first 5, so order by priority)\n\nB1, legs (comic / stands / sinks only):\n- !stand: \"His legs push with at most 1.4× the dial's force ({fmtSI(legForce,'N')}). His weight is {fmtSI(W,'N')}. He can stand still, because his indestructible body takes the load, but he can't bend his knees and push himself up again.\"\n- stand && !walk: \"Each step puts about 1.2× his weight on one leg (people measure 1.0–1.5×). His legs can't manage that, so he stays put.\"\n- walk && rho ≠ 1000: \"Walking needs about 1.2× his weight on one leg at each step. He has {fmtRatio(legForce/(1.2W))} what that takes.\"\n\nB2, ground:\n- stands: \"His feet press {fmtSI(p1,'Pa')} into the {surface.short}, which gives at about {fmtSI(q0,'Pa')}.\"\n- sinks (feet or body): \"The {surface.short} gives way under him ({fmtRatio(standRatio)} its limit). Soil gets stronger the deeper he goes, because the soil above presses it down (sand and gravel much more than clay), so he stops at {fmtDist(sink)}.\" Body stage adds: \"His legs go in first; once his wider body reaches the ground, the load spreads out.\"\n- rock: \"Granite gives way under a foot at about 1.7 GPa (rough: 0.1–4 GPa). His feet press {fmtSI(p1,'Pa')}, but his whole body spreads the load to {fmtSI(p2,'Pa')}, which the rock can carry.\"\n- outOfSight: \"Soil can't stop him. Soil layers are usually metres to tens of metres thick, so he sinks to bedrock, which can carry up to {fmtSI(σA,'N')} under his whole body. He weighs {fmtSI(W,'N')}.\"\n- punchesThrough: \"The {surface.short} is a thin layer. Once it breaks he's in whatever is underneath, and the sim doesn't know what that is.\"\n- fallsThrough: \"No rock can hold him. Even bedrock gives at about 1.7 GPa (a rough figure; real rock runs 0.1–4 GPa), and his weight presses {fmtSI(p2,'Pa')} on it. Strength doesn't help: there's nothing under him that can push back.\"\n\nB3, fall details:\n- firstPass: \"He falls through Earth's layers like a stone dropped down a tunnel through the planet. With Earth's real density profile the trip takes 38 minutes (Klotz 2015 found the same) and he passes the centre at {speedOnly(vMax)}. Shoving rock aside costs him {fmtTNT(ΔE)} per trip, so he comes back up {fmtDist(depthShort)} short of the far side, {fmtDist(westKm·1000)} west of the exact opposite point, because Earth turns under him.\"\n- settle (second bullet): \"He keeps swinging back and forth for about {sig(years,2)} years, each trip a little shorter, and ends up at the centre. The time is rough: depending on how rock resists him it could be 2,000 to 30,000 years. On the way he releases {fmtSI(E,'J')} as heat ({compareEnergy(E)}), on average about half of the 47 TW Earth already leaks from its interior.\"\n- stuck: \"He sinks at up to {speedOnly(vMax)}, pushing rock aside (like the ground under a stomp) and breaking it. In the liquid outer core only the shoving is left. Gravity weakens toward the centre, and the solid inner core holds him {fmtDist(r)} from it. Earth's spin drifts him about {fmtDist(drift)} east of straight down.\"\n\nB4, his gravity:\n- beatsOutside: \"Within {fmtDist(dBeat)} his gravity is stronger than Earth's. Something dropped 10 m from him hits him {fmtTime(t10)} later at {speedOnly(v10)}. Within {fmtDist(tidal1g)}, the pull on a person's near side beats their far side by more than 1 g, enough to stretch them.\"\n- ρ ≥ 1e6 && !beatsOutside: \"His gravity is real but tiny: {sci(gSurf/g,2)} of Earth's at his skin. It would only beat Earth's {fmtDist(dBeat)} from his middle, inside his own body.\"\n\nB5, air (bondiOutside; phrase \"while he stands on the surface\"):\n\"Air within about {fmtDist(rB)} can't push back against his pull (the Bondi radius). It falls in at up to {speedOnly(vEsc)} and slams to a stop at his skin, heating to about {fmtTemp(infallT)} (an upper bound). Bondi's formula gives {big(bondiRate/1000,2)} tonnes of air a second, carrying {fmtSI(power,'W')} of heat. The heat would push air back out, so the real rate would be lower.\"\nIf holdsAir, add: \"Out in space at room temperature he could even hold onto an atmosphere of his own.\"\n\nB6, caveat (rho > 22,587):\n\"Osmium is the densest element at everyday pressure (22,587 kg/m³). Anything this dense exists in nature only crushed inside a star.\"\nIf rho ≥ 1e17, add: \"Neutron-star matter stays this dense only under a neutron star's gravity, at a pressure of about 3 × 10³² Pa. Freed, it expands violently and turns into neutron-rich nuclei that then decay (Lattimer et al. 1977). It gives up at least 16 MeV per neutron (Hebeler et al. 2010), about 370 kt of TNT per kilogram. For this Rex that's {fmtSI(decompJ,'J')}, {sig(100·decompJ/2.49e32,2)}% of the energy it takes to blow Earth apart. In the sim his indestructibility holds it together.\"\n\nB7, black hole:\n\"Squeezed this hard, his mass fits inside its own event horizon (r_s = 2GM/c²; the sim treats him as a ball of his volume). General relativity says ordinary matter can't even hold its shape once it's within 9/8 of that radius (Buchdahl's limit). Only his indestructibility keeps him in one piece up to the horizon. Earth falls in within about {fmtTime(tff)}. How fast it disappears depends on how fast the heat can escape, which the sim doesn't model.\"\n\nB8, earth falls / reshapes:\n\"Rock can't hold itself up against his pull: his gravity alone crushes rock out to {fmtDist(rCrush)}. Earth falls onto him in about {fmtTime(tff)}, releasing roughly {fmtSI(eLow,'J')}, {fmtRatio(eLow/2.49e32)} the energy that holds Earth together. Read that as an order of magnitude.\"\nFor 'reshapes': \"Past 1/1,000 of Earth's mass his pull reshapes the planet around him; the sim stops modelling moves and the fall in detail.\"\n\nSHOW THE MATH\n- \"Volume = 0.18 m³ × (height ÷ 2 m)³ = {V}; mass = density × volume = {rho} × {V} = {fmtMass(m)}; weight W = m g = {W}\"\n- \"Legs push up to 1.4 × strength = {legForce}. Stand: ≥ W. Walk: ≥ 1.2 W (Nilsson & Thorstensson 1989). Run (Sprint tab): strength > W.\"\n- \"Feet: W ÷ (2 × {A_foot} m²) = {p1}. Whole underside: W ÷ {A_b} m² = {p2}. Sand and gravel: limit + γ·depth·N_q (N_q 18.4 or 64.2; USACE EM 1110-1-1905). Clay: limit + γ·depth.\"\n- \"Bedrock carries up to 1.7 GPa × his underside = {σA} (estimate). Bolted to the planet stops sliding, not sinking; only Comic ground keeps the floor whole.\"\n- \"Inside Earth: PREM gravity (Dziewonski & Anderson 1981); resistance = area × (rock strength + ρv²) against his motion relative to the turning rock; no strength in the liquid outer core; 3-D RK4, Earth turning once per 23.93 h.\"\n- \"His gravity treats him as a ball of equal volume, radius {R}. Surface gravity GM/R², escape speed √(2GM/R), G = 6.674 × 10⁻¹¹. His pull equals Earth's at √(GM/g) = {dBeat}.\"\n- \"Air: Bondi radius GM/c² with c = 340 m/s = {rB}; rate 2πG²M²ρ/c³ (upper bound). Rock crushed where ρ_rock GM/r tops 1.7 GPa: {rCrush} (loose surface rock, 200 MPa: {rCrushU}).\"\n- \"Black hole when 2GM/c² ≥ R: density ≥ 3c²/(8πGR²) = {rhoBH} at this height.\"\n\nCHANGES TO OTHER TABS\n- Lift: when selfPullG ≥ 0.001, add the tile \"His pull on it\", \"{sig(selfPullG,2)} g on top of Earth's\", and a bullet: \"At his density his own gravity adds to the weight of whatever he holds.\"\n- Throw:\n  - fallsBack, verdict: \"The {o.short} can't get away from him. It needs {speedOnly(escapeNeeded)} to escape his own gravity, but leaves his hand at {speedOnly(v)}, so it falls back onto him.\"\n  - Otherwise, when escapeNeeded > 1% of v, bullet: \"Climbing out of his own gravity costs it speed: it leaves at {speedOnly(v)} and keeps {speedOnly(vOut)}.\"\n  - Real-muscle note: \"Real muscle can't throw faster than {cap}, so nothing he throws escapes him.\"\n- Every move tab gets the gating callouts described in the algorithm.\n\nASSUMPTIONS CARDS (static-data.js)\n- \"Density and weight\": \"Density sets his mass at his size: 0.18 m³ at 2 m, scaling with height cubed. Heavier limbs need more strength to move, so every move uses his mass. Only Rex is indestructible: at extreme densities that includes holding together matter that in nature only exists inside stars.\"\n- \"His own gravity\": \"Treated as a ball of the same volume (35 cm radius at 2 m) and as a point beyond that, so numbers within about his own height of him are rough. Air falling in uses Bondi's estimate, an upper bound. Holding an atmosphere uses the rule of thumb 'escape speed above 6× the speed of the gas molecules'.\"\n- \"Sinking and falling through the Earth\": \"Soil gets stronger with depth. Bedrock is set at 1.7 GPa everywhere down to the core, except the liquid outer core, which has none. Rock also has to be shoved aside (ρv²). Earth's insides follow PREM, with its 3 km ocean replaced by crust. Earth's spin is included; tides, Earth's flattening and the channel of melted rock are not. Settling over many trips is averaged and good to a factor of a few.\"\n- \"Planet-scale masses\": \"Past 1/1,000 of Earth's mass his pull reshapes the planet and moves are not modelled. Past Earth's mass the planet falls onto him. When his mass fits inside 2GM/c² he is a black hole.\"",
 "caveats": "- Self-gravity treats Rex as a uniform ball of his own volume. He is a 2 m dinosaur, not a 35 cm ball, so anything within about his height of him (hand-held objects, tidal stretch near him, the throw-escape speed) is rough, maybe ±50%.\n- Whether a body this shape forms a horizon is fuzzier than the ball threshold (Thorne's hoop conjecture). The black-hole density is a ball-equivalent figure.\n- Matter denser than osmium does not exist at everyday pressure. White-dwarf and neutron-star matter are held in by a star's gravity, at up to ~3 × 10³² Pa for neutron-star matter. The sim's Rex holds it in by being indestructible. If he weren't, neutron-star Rex would release at least ~1.2 × 10³² J. The sim never models that release.\n- The deep-rock strength (1.7 GPa) is the project's surface-granite bearing estimate, reused everywhere. Nobody has measured how rock resists a body pushed through it at these depths and speeds. Results for bodies within a few times the fall-through threshold (5 × 10⁷ to ~10⁹ kg at 2 m) could change a lot, e.g. stopping in the mantle instead of the inner core. The long settling time of a neutron-star Rex varies ~2,000–30,000 years across plausible strength and drag values.\n- Drag through rock uses the same Poncelet form as stomps (k = 1). At ~10 km/s rock is shocked, melted and vaporised. The sim does not model the channel he leaves, heat flow, or how the planet rings.\n- PREM is a spherically averaged Earth. It ignores continents, oceans (replaced with crust), Earth's flattening, lateral differences, the Moon and the Sun.\n- The start is fixed at the equator. The drift toward the west is ~7.3° of longitude at any latitude, so less ground distance toward the poles.\n- The orbit-averaged settling treats each trip as straight through the centre. Earth's spin actually makes each pass miss the centre by up to ~300 km; the 3-D check agrees within ~10%.\n- Bondi infall is an upper bound. Heating pushes air back, and the compressed ball of air that would pile up on him is not modelled. The arrival temperature uses the sim's sea-level stagnation table, also an upper bound.\n- The walking and standing rules are simple. Legs push 1.4× the dial; walking needs 1.2× body weight on one leg. This is cautious for weak strengths, where real near-straight legs do better.\n- Sinking in soil adds strength with depth (N_q for sand and gravel, overburden only for clay), without shape or depth factors and without friction on his legs. Real sinking is somewhat shallower. Under soil the sim can't know how deep bedrock is.\n- \"Bolted to the planet\" does not stop sinking, matching the Lift tab. Only \"Comic ground\" keeps the floor whole.\n- Above 1/1,000 of Earth's mass the planet would reshape around him. The sim describes this but does not model it. The energy for Earth falling onto him is an order-of-magnitude estimate (G m M_E / R_E).\n- The black-hole regime says nothing about radiation or how fast Earth is actually swallowed.\n- The plush-stuffing density is our estimate; no measured value for stuffed toys was found.",
 "tests": [
  {
   "name": "Preset masses at 2 m",
   "inputs": "H = 2 m (V = 0.18 m³); rho = 30, 1060, 7850, 22587, 2.77e9, 4.12e17",
   "expected": "m = 5.4 kg; 190.8 kg; 1,413 kg; 4,065.7 kg; 4.986e8 kg; 7.416e16 kg",
   "reasoning": "m = rho × 0.18. Example: 4.12e17 × 0.18 = 7.416e16 kg, which is 6.98 × Phobos (1.062e16). WD: 4.986e8 / 1.0394e8 = 4.8 Nimitz carriers.",
   "tolerance": "0.1%"
  },
  {
   "name": "Equal-volume radius",
   "inputs": "H = 2 m",
   "expected": "R = 0.350263 m",
   "reasoning": "(3 × 0.18 / 4π)^⅓ = 0.042972^⅓ = 0.350263",
   "tolerance": "1e-5 relative"
  },
  {
   "name": "Black-hole density scales with 1/height²",
   "inputs": "blackHoleDensity(H) for H = 0.4, 2, 50 m",
   "expected": "3.275e28, 1.3102e27, 2.096e24 kg/m³. At 2 m, m = 2.3583e26 kg = 39.49 Earth masses; Buchdahl mass 2.096e26 kg",
   "reasoning": "ρ = 3c²/(8πGR²) = 2.696266e17 / (25.1327 × 6.6743e-11 × 0.122684) = 2.696266e17 / 2.05795e-10 = 1.3102e27. Mass = ρV = 2.3583e26 = Rc²/2G. Divided by 5.9722e24 that is 39.49. Buchdahl = 8/9 × 2.3583e26.",
   "tolerance": "0.1%"
  },
  {
   "name": "Default Rex: self-gravity negligible",
   "inputs": "H 2, m 180",
   "expected": "GM 1.2014e-8; gSurf 9.79e-8 m/s²; vEsc 2.62e-4 m/s; dBeat 3.50e-5 m (beatsOutside false); rBondi 1.04e-13 m (bondiOutside false); rs 2.67e-25 m; blackHole false",
   "reasoning": "GM = 6.6743e-11 × 180. gSurf = 1.2014e-8 / 0.122684. vEsc = √(2 × 1.2014e-8 / 0.350263) = √6.860e-8. dBeat = √(1.2014e-8 / 9.80665).",
   "tolerance": "0.5%"
  },
  {
   "name": "Neutron-star Rex self-gravity",
   "inputs": "H 2, rho 4.12e17 (m 7.416e16)",
   "expected": "GM 4.9497e6; gSurf 4.0345e7 m/s² (4.114e6 g); vEsc 5,316 m/s; dBeat 710.4 m; rBondi 42.74 m; bondiRate 4.785e6 kg/s; heatPerKg 1.413e7 J/kg; infallPower 6.76e13 W; infallT ≈ 7,460 K; holdsAir true; rCrush 7.861 m (unconfined 66.82 m); tidal1g 122.0 m; Δa at 10 m = 1,847 g; rs 1.10e-10 m",
   "reasoning": "vEsc = √(2 × 4.9497e6 / 0.350263) = √2.8263e7 = 5,316. dBeat = √(4.9497e6 / 9.80665) = √504,729 = 710.4. rB = 4.9497e6 / 340.29² = 4.9497e6 / 115,797 = 42.74. Ṁ = 2π × (4.9497e6)² × 1.225 / 340.29³ = 1.8857e14 / 3.9405e7 = 4.785e6. Heat = 4.9497e6 / 0.350263 = 1.4131e7. rCrush = 2700 × 4.9497e6 / 1.7e9. tidal1g far-field: (2 × 4.9497e6 × 1.8 / 9.80665)^⅓ = (1.817e6)^⅓ = 122.0. Holds air: 5,316 > 6 × 498.1 = 2,989.",
   "tolerance": "0.5% (infallT ±2% because it is interpolated)"
  },
  {
   "name": "Infall onto neutron-star Rex",
   "inputs": "GM 4.9497e6, R 0.350263, dropped from rest at d0 = 10 m",
   "expected": "Arrives after 15.74 ms at 5,222 m/s",
   "reasoning": "v = √(2 × 4.9497e6 × (1/0.350263 − 0.1)) = √(9.8994e6 × 2.75500) = 5,222. With x = 0.0350263: t = √(1000 / 9.8994e6) × (√(x(1 − x)) + acos(√x)) = 0.010051 × (0.18384 + 1.38341) = 0.01575 s.",
   "tolerance": "0.5%"
  },
  {
   "name": "White-dwarf Rex: gravity stays inside him",
   "inputs": "rho 2.77e9 (m 4.986e8)",
   "expected": "gSurf 0.2712 m/s² (0.028 g); vEsc 0.436 m/s; dBeat 0.0583 m < R, so beatsOutside false; rBondi 2.87e-7 m",
   "reasoning": "GM = 0.033278. dBeat = √(0.033278 / 9.80665) = 0.0583 m, which is less than R = 0.350 m.",
   "tolerance": "0.5%"
  },
  {
   "name": "Self-gravity thresholds at 2 m",
   "inputs": "Solve each condition for m",
   "expected": "Pull beats Earth's outside him above m = 1.80e10 kg (ρ 1.00e11). Air falls in above m = 6.08e14 kg. Holds air above m = 2.344e16 kg (ρ 1.30e17). vEsc reaches Earth's 11.186 km/s at m = 3.28e17 kg. r_crush reaches R_E at m = 6.0e22 kg.",
   "reasoning": "g R²/G = 9.80665 × 0.122684 / 6.6743e-11 = 1.8026e10. a0² R/G = 115,797 × 0.350263 / 6.6743e-11 = 6.077e14. (6 × 498.1)² × R / (2G) = 2.344e16. 11186² R/(2G) = 3.283e17. σ R_E / (ρ_rock G) = 1.7e9 × 6.371e6 / (2700 × 6.6743e-11) = 6.01e22.",
   "tolerance": "0.5%"
  },
  {
   "name": "PREM integration checks",
   "inputs": "premG, premPhi, PREM mass",
   "expected": "g(R_E) = 9.8203 (equals K.GM/R_E²); g(3480 km) = 10.683; g(1221.5 km) = 4.401; Φ(R_E) − Φ(0) = 4.916e7 J/kg; v at centre 9,916 m/s. Optional integrals: central pressure ≈ 364 GPa; binding energy 2.49e32 J",
   "reasoning": "Published PREM checkpoints (Rodríguez-Mozos & Moya 2022, Table 1): 10.6823, 4.4002, 363.852 GPa. Our integration gave 10.689 / 4.403 / 364.09 GPa unscaled (PREM's own mass, G = 6.6743e-11). Scaling to the engine's GM changes these by <0.03%.",
   "tolerance": "0.2%"
  },
  {
   "name": "Gravity tunnel time (no drag, from the pole)",
   "inputs": "fallThrough(NS body, latDeg 90, noDrag) to the far turnaround",
   "expected": "38.19–38.2 minutes; top speed 9,916 m/s",
   "reasoning": "Klotz (2015): 38 min along a diameter with seismic density (uniform Earth: 42 min). Our 1-D integral ∫dr/v gives 38 min 10 s. The uniform-Earth check is π√(R³/GM) = 42.17 min.",
   "tolerance": "±0.1 min"
  },
  {
   "name": "Default and kaiju Rex stand on sand",
   "inputs": "Default 2 m / 180 kg on loose sand, concrete, granite; 50 m kaiju at 1,000 kg/m³ on sand",
   "expected": "Sand ratio 0.790 (stands), concrete 0.785%, granite 0.0012%. Kaiju on sand also 0.790; kaiju on concrete 19.6%",
   "reasoning": "p1 = 1765.2 / 0.09 = 19,613 Pa. q0 sand = 37,000 × 0.212132 / 0.316 = 24,838 → 0.790. Kaiju: p1 ∝ s and granular q0 ∝ B ∝ s, so the ratio is the same. Kaiju p1 = 2.8125e6 × 9.80665 / 56.25 = 490,333 Pa vs 2.5 MPa on concrete.",
   "tolerance": "0.5%"
  },
  {
   "name": "Sinking a little (two-stage)",
   "inputs": "Steel Rex (1,413 kg) on loose sand and soft clay; osmium Rex (4,065.7 kg) on dense gravel, loose sand, soft clay",
   "expected": "Steel: sand 0.447 m (feet); soft clay 0.90 m (body stage, to the hips); gravel stands (95.6%). Osmium: gravel 0.224 m; sand 0.90 m; soft clay 0.90 m; stiff clay stands (92.3%)",
   "reasoning": "Steel on sand: p1 = 13,857 / 0.09 = 153,962; γN = 1600 × 9.80665 × 18.40 = 288,707; D1 = (153,962 − 24,838) / 288,707 = 0.4473 m < 0.9. Osmium on gravel: p1 = 443,012; q0 = 240,000 × 0.212132 / 0.316 = 161,113; γN = 2000 × 9.80665 × 64.19 = 1,258,978; D1 = 0.2239. Osmium on sand: D1 = 1.448 > 0.9; p2 = 39,871 / 0.3 = 132,903; q0b = 37,000 × 0.547723 / 0.316 = 64,132; D2 = max(0.9, (132,903 − 64,132) / 288,707 = 0.238) = 0.9.",
   "tolerance": "0.5%"
  },
  {
   "name": "Surface and fall-through thresholds",
   "inputs": "2 m body; 50 m body",
   "expected": "Concrete holds up to m = 22,944 kg (ρ 1.27e5). Granite under the feet up to 1.560e7 kg (ρ 8.67e7). Falls through above 5.2006e7 kg (ρ 2.889e8). 50 m kaiju falls through above ρ 1.156e7 (m 3.25e10 kg)",
   "reasoning": "2.5e6 × 0.09 / 9.80665. 1.7e9 × 0.09 / 9.80665. 1.7e9 × 0.3 / 9.80665 = 5.2006e7, then ÷ 0.18. Kaiju: 1.7e9 × 0.3 × 625 / 9.80665 = 3.250e10, ÷ 2,812.5 m³ = 1.156e7.",
   "tolerance": "0.1%"
  },
  {
   "name": "Embedded in rock, through a slab, out of sight in soil",
   "inputs": "m = 2e7 kg at 2 m on granite, concrete, loose sand",
   "expected": "Granite: 'sinks' (rock stage), 0.9 m, to the hips. Concrete: 'punchesThrough'. Sand: 'outOfSight' (model depth 2,264 m, shown only as 'out of sight, down to bedrock')",
   "reasoning": "W = 1.961e8 N < σ A_b = 5.1e8, so no fall-through. On granite p1 = 2.179e9 > 1.7e9 but p2 = 6.54e8 < 1.7e9. Concrete p1 ≫ 2.5 MPa. Sand: D2 = (6.54e8 − 64,132) / 288,707 = 2,264 m > H.",
   "tolerance": "regime exact"
  },
  {
   "name": "Ice",
   "inputs": "m = 5e4 kg at 2 m on lake ice",
   "expected": "'punchesThrough'; page text says he sinks to the lake bottom",
   "reasoning": "p1 = 5.45 MPa > 5 MPa. Density 2.8e5 > 1,000.",
   "tolerance": "exact"
  },
  {
   "name": "Can he move his own weight?",
   "inputs": "Default 180 kg at dial 90,718 kg (default), 150 kg, 10 kg; NS Rex at the default dial",
   "expected": "Needs: stand 128.6 kg lift, walk 154.3 kg, run 180 kg. Default dial: all true. 150 kg: stand true, walk false, run false. 10 kg: all false. NS at default dial: all false (needs 5.30e16 / 6.36e16 / 7.42e16 kg)",
   "reasoning": "stand: m/1.4; walk: 1.2m/1.4; run: F > W.",
   "tolerance": "exact"
  },
  {
   "name": "Neutron-star Rex: first trip through the Earth",
   "inputs": "fallThrough(NS body, latDeg 0, comic ground off) to the first far-side turnaround",
   "expected": "Turns back at t = 38.23 min, depthShort ≈ 3.2 m (3.2–3.7 depending on step size). dLon = −7.28° (809 km west of the antipode at the equator). Passes 298.7 km from the centre. vMax 9,910 m/s. Not stuck. At latDeg 45: dLon −7.28°, latitude −44.98°, closest approach 211 km",
   "reasoning": "The orbit-averaged loss per trip is 2.373e18 J, which equals m g Δh with Δh = 2.373e18 / (7.416e16 × 9.82) = 3.26 m. No-drag control run: depthShort ≈ 0 (±0.1 m). Earth turns 360° × 2293.6 s / 86164 s = 9.58° during the trip. PREM's centrally concentrated gravity sweeps him ~2.3° further east than a uniform Earth would, leaving 7.28° west.",
   "tolerance": "t ±0.1 min; depthShort 2.5–4.5 m; dLon ±0.05°; minR ±2 km"
  },
  {
   "name": "Neutron-star Rex settles",
   "inputs": "settle(NS body)",
   "expected": "About 4,920 years; 9.39e7 half-trips; rStop 1.88 mm; firstPassLossJ 2.373e18 J (567 Mt); energyJ 3.646e24 J (8.7 × Chicxulub's 4.2e23); average power 23.5 TW",
   "reasoning": "rStop = σA_b / (m × dg/dr) = 5.1e8 / (7.416e16 × 3.657e-6) = 1.88e-3 m. Energy = 7.416e16 × 4.9164e7. Power = 3.646e24 / (4,919 × 3.15576e7). Sensitivity: σ 0.1–4.1 GPa and k 0.5–2 give 2,240–29,100 years.",
   "tolerance": "years ±5%; energy 0.2%"
  },
  {
   "name": "White-dwarf Rex sinks and sticks",
   "inputs": "fallThrough(WD body, latDeg 0)",
   "expected": "Stuck after 1.89 h at r ≈ 216 km from the centre (inner core). vMax ≈ 1,977 m/s. Drifts ≈ 20 km east. Energy ≈ 2.45e16 J (5.8 Mt)",
   "reasoning": "In the solid inner core g ≈ 3.66e-6 r. The static hold radius is σ A_b / (m × 3.66e-6) = 5.1e8 / (4.986e8 × 3.66e-6) = 280 km. He coasts past it and stops at ~216 km. Energy = m (Φ(R) − Φ(216 km)).",
   "tolerance": "r ±3 km; t ±0.05 h; vMax ±1%"
  },
  {
   "name": "Near-threshold body",
   "inputs": "m = 5.25e7 kg at 2 m; and m = 1e8 kg",
   "expected": "5.25e7: stuck at ≈1,216 km after ≈10.0–10.6 h, vMax ≈ 499 m/s. 1e8: stuck at ≈1,195 km after 2.78 h, vMax ≈ 800–820 m/s",
   "reasoning": "Weight just exceeds σA_b = 5.1e8 N at the surface. g rises to 10.68 at the core–mantle boundary, so he keeps going. The liquid outer core has no strength. The inner core boundary (g = 4.40) holds him: 5.25e7 × 4.40 = 2.31e8 < 5.1e8.",
   "tolerance": "r ±5 km; t ±0.5 h"
  },
  {
   "name": "Averaged settling agrees with full 3-D",
   "inputs": "m = 1e11 kg and 3e10 kg",
   "expected": "1e11: 3-D stuck after 58.8 h at 1.27 km; settle() gives 57.9 h. 3e10: 17.5 h vs 17.2 h",
   "reasoning": "Validates the orbit-averaged method used for the neutron-star case.",
   "tolerance": "5%"
  },
  {
   "name": "Earth falls onto him",
   "inputs": "m = 2.3583e26 kg (black-hole Rex) and m = M_E",
   "expected": "tff = 140.6 s and eLow = 1.475e34 J (59 × 2.49e32). For m = M_E: tff = 632.6 s, eLow = 3.737e32 J",
   "reasoning": "(π/2) √(2.58596e20 / (2 × 6.6743e-11 × 2.41802e26)) = (π/2) × √8011.7 = (π/2) × 89.51 = 140.6. eLow = 6.6743e-11 × 2.3583e26 × 5.9722e24 / 6.371e6.",
   "tolerance": "0.2%"
  },
  {
   "name": "Planet regimes and black-hole flags",
   "inputs": "2 m body at m = 1e21, 6e21, 6e24, 2.1e26, 2.36e26 kg; comic ground on",
   "expected": "none (falls through if comic off); reshapes; earthFalls; earthFalls with buchdahl true and blackHole false; blackHole. Comic ground does not change the planet regime",
   "reasoning": "Thresholds: M_RESHAPE = 5.972e21; M_E = 5.9722e24; Buchdahl 2.096e26; black hole 2.358e26.",
   "tolerance": "exact"
  },
  {
   "name": "Neutron-matter caveat energy",
   "inputs": "NS body",
   "expected": "decompJ = 1.156e32 J (46% of Earth's binding energy 2.49e32 J); per kg 1.559e15 J/kg (≈ 3.73e5 t TNT)",
   "reasoning": "16.3 MeV × 1.602177e-13 J/MeV / 1.674927e-27 kg = 1.5592e15. × 7.416e16 = 1.1563e32.",
   "tolerance": "0.2%"
  },
  {
   "name": "Rex–Ollie mutual gravity",
   "inputs": "Both 2 m at 4.12e17 kg/m³ (7.416e16 kg each); both default 180 kg",
   "expected": "NS pair at contact (dc = 0.7005 m): F = 7.480e23 N = 1.03e6 × each one's weight; separating needs 7.63e22 kg of lift; Ebind 5.240e23 J; pull equals one body weight at 710.4 m; footings slip (μ 0.6) within 917 m; from 10 m apart they meet in 11.07 ms at 5,127 m/s, releasing 4.873e23 J. Default pair: 4.41e-6 N (the weight of 0.45 mg)",
   "reasoning": "F = 6.6743e-11 × (7.416e16)² / 0.7005² = 6.6743e-11 × 5.4997e33 / 0.49070. Weight = 7.2726e17 N. Two-body Kepler with M = 1.4832e17. Default: 6.6743e-11 × 32,400 / 0.49070.",
   "tolerance": "0.5%"
  },
  {
   "name": "Catch between neutron-star-dense Rex and Ollie",
   "inputs": "Equal masses 7.416e16 kg, centres 10 m apart, ball released 0.5 m from Rex's centre toward Ollie",
   "expected": "Minimum release speed 4,109 m/s to pass the midpoint; it reaches Ollie's hand (0.5 m from his centre) at the release speed",
   "reasoning": "½v² ≥ GM [(1/0.5 + 1/9.5) − (1/5 + 1/5)] = 4.9497e6 × 1.70526 = 8.4405e6, so v ≥ 4,108.6. The potential is symmetric, so the arrival speed equals the release speed.",
   "tolerance": "0.2%"
  },
  {
   "name": "Throwing out of his own gravity",
   "inputs": "NS body, comic mode, bolted, comic ground, concrete, baseball at 45°, lift = 1e22 kg; same in real mode; threshold search",
   "expected": "escapeNeeded = 4,450 m/s (r0 = 0.5 m). Comic: throw v = 11,610 m/s, vOut = 10,723 m/s. Real muscle: v = 84.6 m/s, so fallsBack is true. Comic threshold lift for a baseball to escape ≈ 1.47e21 kg",
   "reasoning": "√(2 × 4.9497e6 / 0.5) = √1.97988e7 = 4,449.6. vOut = √(11,610² − 1.97988e7) = √1.14992e8 = 10,723. The real-muscle whip speed is capped near 84.6 m/s.",
   "tolerance": "vOut 0.5%; threshold ±5%"
  },
  {
   "name": "Held object weighs more near a dense Rex",
   "inputs": "NS body lifting the Toyota Corolla (1,340 kg, ρ_o 115)",
   "expected": "L_o = 2.267 m; r_l = 2.134 m; selfPull 1.087e6 m/s² (1.11e5 g); object weight 1.457e9 N",
   "reasoning": "L_o = (1340/115)^⅓ = 2.267. r_l = 1 + 1.134. g_s = 4.9497e6 / 2.134² = 1.0874e6. W = 1340 × (9.80665 + 1.0874e6).",
   "tolerance": "0.5%"
  },
  {
   "name": "Guards",
   "inputs": "m = 0 or NaN; H = 0.1 m with density 1e30; infinite strength with the NS body",
   "expected": "Bad mass falls back to the default body. H 0.1 / 1e30: R = 0.0175 m, ρ_BH = 5.24e29, so blackHole true. Infinite strength: move.stand, walk and run all true, but ground.regime is still 'fallsThrough' (comic ground off) and the verdict says strength doesn't help",
   "reasoning": "State validation already rejects m ≤ 0. Ground and planet results do not depend on strength.",
   "tolerance": "exact"
  }
 ],
 "open_questions": "1. Deep-rock strength. The 1.7 GPa reused at all depths is our assumption. Should the page offer a \"weak / typical / strong rock\" choice (0.1 / 1.7 / 4.1 GPa) so readers see the spread? It matters for bodies of 5e7–1e9 kg and for the settling time.\n2. Plush density (30 kg/m³) is an estimate; no measured stuffed-toy density was found. The owner could weigh a plush and measure its volume (water displacement in a bag) to replace it.\n3. Rule for keeping an atmosphere. The source uses v_esc > 6 v_rms. Other teaching material uses 10× the mean speed for billions of years. Keep 6 (the opened source), or show \"holds air for a while / for billions of years\" with both?\n4. Bolted anchor. For consistency with the Lift tab it does not stop sinking. If the owner reads \"bolted to the planet\" as holding him up too, both tabs need to change together.\n5. Latitude. The start is fixed at the equator. A latitude control would only change the drift distance (cos latitude) and the closest approach; probably not worth a control.\n6. Walking rule. 1.4 × strength ≥ 1.2 × weight is cautious at low strength. Fine for super-strength, but a weak, heavy Rex is told he can't walk when a real person of that build could. An alternative is \"walk if he can stand\".\n7. The 1/1,000-Earth-mass \"reshapes the planet\" cut-off is a judgement call (r_crush ≈ 0.1 R_E there). The moves are gated above it.\n8. Black-hole and \"Earth falls on him\" outcomes stop at free-fall times and an order-of-magnitude energy. Radiation, accretion rate and Hawking effects are not modelled; say so on the page.\n9. PREM coefficients were confirmed via the GENIE code listing and by reproducing published checkpoints, not from the paywalled 1981 paper itself. If the owner wants a primary-page check, the scanned table in Anderson's Theory of the Earth appendix (Caltech) is image-only and would need OCR.\n10. The existing data.js row for Earth's binding energy (status 'claimed', Wikipedia) could be upgraded with our PREM integral (2.4904e32 J) as an independent check.\n11. For Ollie (bull, boots, no claws), the duo designer should decide whether \"Claws dug in\" applies to him. Density and self-gravity functions are body-agnostic."
}
```

</details>

<details>
<summary>Subagent `check:collide` (rex-ollie-design, 2026-10-09 23:40:55 UTC): The core momentum and energy model is correct, but several outcomes and page claims are wrong and need fixing before this ships. I reimplemented headOn independently with Lorentz velocity transforms at 60-digit precision. Returned fact_checks: 18 (e.g. collide_paradox_premises; collide_no_rigid_bodies), physics_issues: 19, missing: 17, test_corrections: 13.</summary>

Workflow run `wf_173e4620-19f`, phase `Check`, agent `a7c3e4c78d9bbd16b`. Prompt, verbatim:

```text
Project: "Rex Super-Strength Lab", a single-page physics simulator for Rex, an indestructible, tireless plush kaiju-dinosaur (default 2 m tall, 180 kg). A strength dial sets his maximum force as a lift capacity from 10 kg to 1e34 kg, plus infinity. Moves today: lift, throw, jump, stomp, punch, clap, sprint, pull. Two muscle models: "comic" (fixed share of strength at any speed) and "real" (Hill force-velocity curve; limb speed caps). Settings: ground surface (sand, gravel, soft clay, stiff clay, asphalt, concrete, lake ice, steel deck, granite), "comic ground" (never breaks), anchoring (friction / claws dug in / bolted to the planet), height (isometric scaling) and mass.
Read these before designing (do NOT edit anything under /home/user/dino-strength-sim; put scratch files in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo/):
- /home/user/dino-strength-sim/src/engine.js: the physics engine (SI units; relativistic momentum helpers momentumToV/momentumToKE/vToMomentum; pushApart two-body push in comic or Hill mode; anchorCapacity footing model; fly() RK4 flight over a round Earth with drag and Kepler arcs; craterDiameter Collins et al.; blastRadius Kinney-Graham; seismicMagnitude; stagnationT; lift/throw/jump/stomp/punch/clap/sprint/pull).
- /home/user/dino-strength-sim/src/app.html (the bay* functions show how results become page text), /home/user/dino-strength-sim/src/static-data.js (assumptions text), /home/user/dino-strength-sim/build-data.py (how sourced facts become the sources table).
- Fact format used by the project: /home/user/dino-strength-sim/research/final-environment.json ("facts" entries with key, category, label, status in {verified, canon_stated, reported, estimate, claimed, disputed, not_quantified}, value_si, unit_si, low_si, high_si, display, sources [{title, url}], notes).
NEW FEATURES being added (the owner's request): (1) "density and weight, and the effect that would have on the environment, like if Rex were the density of a neutron star"; (2) Rex's boyfriend Ollie, "equally as overpowered and indestructible", for two-person simulations: arm wrestling, regular wrestling, games of catch, unstoppable force vs immovable object. Ollie, from the owner's image, is a plush bull-man: horns, nose ring, leather vest, cargo pants, laced boots (no visible claws), about Rex's height and build. Do not invent other canon for him; default him to Rex's size, mass and strength, with his own adjustable settings.
The owner is a professional critic: factual accuracy and honest labelling come first. Every number must be either sourced (fetch the source and confirm the number on the page; give the exact URL) or labelled an estimate with the reasoning. Prefer primary or authoritative sources (journals, textbooks, NASA/ESA, standards bodies). Never present speculation as fact; say what the model ignores. The page's tone is plain, specific and readable for a general audience (short sentences, no jargon without a gloss).

Adversarially check this design for the area "Unstoppable force vs immovable object". Default to suspicion. (1) For EVERY fact: fetch the source URL and confirm the number and wording; mark ok=false with the correct value and a better source if wrong, unsupported, or mislabelled (e.g. an estimate called verified). (2) Re-derive every equation and recompute every test case independently (write scripts in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo/collide-check/); report physics errors, wrong regimes, missing forces or effects, double counting, unit slips, and anything that would show a reader a false or misleading claim, with concrete fixes. (3) List what is missing for an honest, complete simulation of the brief. (4) Check that the page text never overstates certainty.

BRIEF:
Design "UNSTOPPABLE FORCE VS IMMOVABLE OBJECT" between Rex and Ollie (Ollie is a bull, so "Ollie charges, Rex holds his ground" is a natural default; allow swapping roles). Cover both readings: (1) a static contest: one pushes with all his strength, the other braces (this overlaps the wrestling contest: equal strengths stalemate; the ground or anchors decide; both bolted puts the planet's crust between them in tension or compression, source rock tensile and compressive strength); (2) a collision: the charger arrives at a speed from his sprint or a stomp-launch or a jump (existing engine moves) or an arbitrary speed, and hits the braced partner. Use momentum conservation with two bounds for an indestructible plush body: perfectly elastic (bounce) and perfectly inelastic (energy released at the contact as heat, sound and a blast; reuse blastRadius, seismicMagnitude); the "immovable" one is only as immovable as his anchoring: friction, claws, bolted to the planet (then Earth's mass 5.97e24 kg takes the momentum: compute Earth's speed change), comic ground, or his own mass from the density setting. Contact force over the contact time (rigid bodies mean infinite force; real bodies have finite contact times set by stiffness or sound speed: source this, e.g. no perfectly rigid bodies in relativity because signals travel at most at c). Relativistic speeds (energy release, fireball). Infinite strength on both sides: explain plainly why the paradox has no answer in physics (an unstoppable force needs unbounded momentum, an immovable object unbounded inertia or anchoring; they cannot coexist; with either finite, the finite one gives), with a source for the standard resolution if one exists (or say it is the standard logical argument). Give the honest physics verdict for each combination.

DESIGN:
{
 "area": "Unstoppable force vs immovable object (the Collide tab in Rex + Ollie: a static push and a charge)",
 "summary": "The Collide tab answers the old question in two ways. In the Push, one partner shoves with everything while the other braces. Each can only use as much force as his footing takes, so strength past the feet just makes them slide. Two bolted partners only load the rock between them, and real granite cracks around the bolts. In the Charge, Ollie hits a braced Rex at his sprint speed, at the speed he lands from a jump or a stomp-launch, or at any set speed. Momentum and energy are exact, relativity included, for two bounds: a plush splat (no bounce, with the lost energy freed as heat, sound and blast) and a perfect bounce. Rex is only as immovable as what holds him: friction, claws, bolts that hand the momentum to Earth's 5.97 × 10^24 kg, or his own mass from the density setting. At the defaults, Ollie arrives at 46.5 m/s, frees 97 kJ (23 g of TNT) and knocks Rex 43 m. Bolted, Rex doesn't budge and Earth's speed changes by 1.4 × 10^-21 m/s. Earth gets exactly that back, because Ollie's run-up pushed it the other way. How hard they hit depends on how squishy they are, which nobody knows for an indestructible plush. A plush squash gives about 278 kN, and the hard ceiling is 1.8 × 10^12 N, never infinite, because relativity forbids perfectly rigid bodies. Unlimited momentum against unlimited inertia has no answer, because momentum conservation would have to divide ∞ by ∞. That matches the standard resolution: the two premises can't both hold.",
 "facts": [
  {
   "key": "collide_paradox_premises",
   "label": "Unstoppable force vs immovable object: why the paradox has no answer",
   "status": "verified",
   "display": "The paradox 'rests on two incompatible premises—that there can exist simultaneously such things as unstoppable forces and immovable objects'; both are implicitly assumed to be indestructible",
   "sources": [
    {
     "title": "Wikipedia: Irresistible force paradox (cites Mike Alder 2004, 'Newton's Flaming Laser Sword', Philosophy Now 46: 29-33)",
     "url": "https://en.wikipedia.org/wiki/Irresistible_force_paradox"
    }
   ],
   "notes": "Quoted from the raw article text (fetched 2026-10-09): 'The paradox arises because it rests on two incompatible premises—that there can exist simultaneously such things as unstoppable forces and immovable objects.' Also: 'The immovable object and the unstoppable force are both implicitly assumed to be indestructible, or else the question would have a trivial resolution.' The article carries a 'more citations needed' banner. Its one source (Alder 2004) was not opened. The physics reading the page uses is our own standard argument, not quoted from a source: an unstoppable force needs unbounded momentum, an immovable object needs unbounded inertia, and momentum conservation would need ∞/∞."
  },
  {
   "key": "collide_no_rigid_bodies",
   "label": "No perfectly rigid bodies in relativity; the stiffest possible material has sound speed c",
   "status": "verified",
   "display": "Truly rigid solids are incompatible with relativity, because no influence can travel through a body faster than light. A relativistic 'rigid' body is one whose sound speed equals c.",
   "sources": [
    {
     "title": "Natário (2020) Rigid elastic solids in relativity, Class. Quantum Grav. (doi 10.1088/1361-6382/abbd10); arXiv:1912.08221, Introduction",
     "url": "https://arxiv.org/abs/1912.08221"
    },
    {
     "title": "Wikipedia: Born rigidity (Definition section)",
     "url": "https://en.wikipedia.org/wiki/Born_rigidity"
    }
   ],
   "notes": "Natário, Introduction: 'truly rigid solids are incompatible with Einstein's relativity, since no influence can propagate on any given medium faster than the speed of light' and 'the speeds of sound cannot be greater than the speed of light, and so a relativistic rigid body should be defined as one where this maximum limit is attained.' Wikipedia: 'A body that could maintain its own rigidity would violate special relativity, as its speed of sound would be infinite.' Used for the light-speed ceiling on the contact force: the hit can't be shorter than a light signal's crossing of the smaller body."
  },
  {
   "key": "collide_sound_speed_upper_bound",
   "label": "Upper bound on the speed of sound in atom-built (condensed) matter",
   "status": "verified",
   "value_si": 36100,
   "unit_si": "m/s",
   "display": "v_u = α (m_e / 2m_p)^½ c ≈ 36.1 km/s, about twice the speed of sound in diamond",
   "sources": [
    {
     "title": "Trachenko, Monserrat, Pickard & Brazhkin (2020) Speed of sound from fundamental physical constants, Science Advances 6, eabc8662; arXiv:2004.04818",
     "url": "https://arxiv.org/abs/2004.04818"
    }
   ],
   "notes": "Abstract: the combination of α and m_p/m_e 'provides the upper bound for the speed of sound in condensed phases'. Eq. (9) in the PDF: v_u ≈ 36,100 m/s. Text: 'vu is about twice as large as v in diamond'. Recomputed with CODATA constants: 36,100.8 m/s. It applies to ordinary matter made of atoms, not neutron-star matter. Used for the 'as stiff as any real material' force: F = p*/(L/36.1 km/s), shown only while the closing speed is below 36.1 km/s."
  },
  {
   "key": "collide_granite_tensile_strength",
   "label": "Granite: tensile strength (rock pulled apart)",
   "status": "verified",
   "value_si": 8380000,
   "unit_si": "Pa",
   "low_si": 5880000,
   "high_si": 10880000,
   "display": "8.38 ± 2.5 MPa (Malsburg granite, quasi-static Brazilian test). Fast loading raises it 1.5-5×. Rock's tensile strength is typically about 1/10 of its compressive strength.",
   "sources": [
    {
     "title": "Padmanabha, Schäfer, Rae & Kenkmann (2021) Dynamic split tensile strength of basalt, granite, marble and sandstone, arXiv:2110.10072, Table 1",
     "url": "https://arxiv.org/abs/2110.10072"
    },
    {
     "title": "Hoek, Practical Rock Engineering, Ch. 11 (Rock mass properties), Eq. 15 and the m_i table",
     "url": "https://www.rocscience.com/assets/resources/learning/hoek/Practical-Rock-Engineering-Chapter-11-Rock-Mass-Properties.pdf"
    }
   ],
   "notes": "Padmanabha et al. Table 1: granite (MaGr) tensile strength 8.38 ± 2.5 MPa, density 2.62 g/cm³. Text: 'Rocks are generally weak in tension, where the uniaxial tensile strength is typically 1/10th of the uniaxial compressive strength' and 'the dynamic tensile strength of the rocks is higher than the quasi-static tensile strength (1.5 to 5 times)'. Cross-check with Hoek Eq. 15, σ_t = s σ_ci / m_b; for intact rock s = 1 and m_b = m_i = 32 ± 3 for granite. With the project's 200 MPa UCS that gives about 6.3 MPa, inside the measured range. The Brazilian test is indirect, and the low and high values are the paper's ±. A hit loads the rock in milliseconds, so the quasi-static value overstates cracking by up to √5 ≈ 2.2× in radius."
  },
  {
   "key": "collide_crust_thickness",
   "label": "Continental crust: average thickness",
   "status": "verified",
   "value_si": 41100,
   "unit_si": "m",
   "display": "41.1 km (weighted global average for continental crust)",
   "sources": [
    {
     "title": "Christensen & Mooney (1995) Seismic velocity structure and composition of the continental crust: a global view, J. Geophys. Res. (USGS publication page)",
     "url": "https://www.usgs.gov/publications/seismic-velocity-structure-and-composition-continental-crust-a-global-view"
    }
   ],
   "notes": "USGS page: 'The weighted average crustal thickness based on these values is 41.1 km.' Continental crust only; oceanic crust is much thinner (not verified here). Used only as the depth past which the rock-cracking estimate stops: deeper rock is squeezed by the weight above and gets much stronger."
  },
  {
   "key": "collide_earth_inertia_rotation",
   "label": "Earth: mass, moment of inertia factor, sidereal rotation, mean radius",
   "status": "verified",
   "value_si": 5.9722e+24,
   "unit_si": "kg",
   "display": "M = 5.9722 × 10^24 kg; I/(MR²) = 0.3308; sidereal rotation 23.9345 h; mean radius 6,371.000 km",
   "sources": [
    {
     "title": "NASA NSSDCA Earth Fact Sheet",
     "url": "https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html"
    }
   ],
   "notes": "All four read from the fact sheet on 2026-10-09. The engine already has M_E = 5.9722e24 and R_E = 6.371e6. Moment of inertia I = 0.3308 M R² = 8.019 × 10^37 kg m². Used for Earth's speed change (Δv = p/(M_E + m)) and the length-of-day change for a set-speed hit along the equator (ΔT = T² p / (2π × 0.3308 × M_E × R_E))."
  },
  {
   "key": "collide_restitution_definition",
   "label": "Coefficient of restitution: the two bounds",
   "status": "verified",
   "display": "e = 1 is a perfectly elastic collision (no kinetic energy lost); e = 0 is perfectly inelastic (the bodies don't rebound and end up stuck together). Most real collisions fall between.",
   "sources": [
    {
     "title": "Wikipedia: Coefficient of restitution",
     "url": "https://en.wikipedia.org/wiki/Coefficient_of_restitution"
    }
   ],
   "notes": "Quote: 'In most real-world collisions, the coefficient of restitution is between 0 and 1, where 1 represents a perfectly elastic collision (in which the objects rebound with no loss of kinetic energy but in the opposite directions) and 0 a perfectly inelastic collision (in which the objects do not rebound at all, and end up coalescing).' The page shows both bounds. Below 1% of light speed, the energy freed at restitution e is (1 − e²) times the splat value (standard result, not quoted)."
  },
  {
   "key": "collide_people_restitution",
   "label": "People colliding: measured coefficient of restitution",
   "status": "reported",
   "value_si": 0.3,
   "unit_si": "1",
   "low_si": 0.1,
   "high_si": 0.5,
   "display": "0.1-0.5, measured by swinging harnessed people into each other (pendulum test)",
   "sources": [
    {
     "title": "Alonso-Marroquin, Lozano, Ramírez-Gómez & Busch (2014) Simulation of counter flow pedestrian dynamics using spheropolygons, Phys. Rev. E 90, 063305; arXiv:1310.8482",
     "url": "https://arxiv.org/abs/1310.8482"
    }
   ],
   "notes": "Text: 'a pendulum test was conducted ... collisions between pedestrians suspended by ropes by harnesses in a rock climbing venue. By measuring the velocities before and after impact ... we obtained coefficients of restitution within the range 0.1–0.5.' The model used 0.3 in the text and 0.4 in Table 1, an inconsistency in the paper. It is an informal test described in one paragraph, hence 'reported'. Used only to say soft bodies sit near the splat end: e = 0.1-0.5 frees 75-99% of the splat energy."
  },
  {
   "key": "collide_collision_formulas",
   "label": "Collision formulas: inelastic energy loss, invariant mass, elastic reversal in the centre-of-momentum frame, rapidity",
   "status": "verified",
   "display": "Inelastic loss ΔKE = ½ μ u_rel² (μ = m₁m₂/(m₁+m₂)); invariant mass M² = (E₁+E₂)² − |p₁+p₂|² (c = 1); in an elastic hit each body's momentum reverses in the centre-of-momentum frame; rapidities add along a line",
   "sources": [
    {
     "title": "Wikipedia: Inelastic collision",
     "url": "https://en.wikipedia.org/wiki/Inelastic_collision"
    },
    {
     "title": "Wikipedia: Invariant mass (two-particle collision)",
     "url": "https://en.wikipedia.org/wiki/Invariant_mass"
    },
    {
     "title": "Wikipedia: Elastic collision (one-dimensional relativistic)",
     "url": "https://en.wikipedia.org/wiki/Elastic_collision"
    },
    {
     "title": "Wikipedia: Rapidity",
     "url": "https://en.wikipedia.org/wiki/Rapidity"
    }
   ],
   "notes": "Inelastic collision: 'ΔKE = ½ μ u²_rel' and 'The reduction of total kinetic energy is equal to the total kinetic energy before the collision in a center of momentum frame'. Elastic collision: 'Relative to the center of momentum frame, the momentum of each colliding body does not change magnitude after collision, but reverses its direction'. Rapidity: β = tanh w, additive. Checked in our code: energy and momentum are conserved to about 1e-15 at 0.5c, 0.999999c and a 180 kg : 7.4 × 10^16 kg mass ratio. The cancellation-free form Q = 2 m_T K_A / (M + m_A + m_T) is our algebra from M² − (m_A + m_T)² = 2 m_T K_A / c²."
  },
  {
   "key": "collide_universe_age",
   "label": "Age of the universe (for 'Earth would take N × the age of the universe to move 1 mm')",
   "status": "verified",
   "value_si": 435080000000000000,
   "unit_si": "s",
   "display": "13.787 ± 0.020 billion years",
   "sources": [
    {
     "title": "Planck Collaboration (2020) Planck 2018 results VI: Cosmological parameters, arXiv:1807.06209, Table 2",
     "url": "https://arxiv.org/abs/1807.06209"
    }
   ],
   "notes": "Table 2, combined TT,TE,EE+lowE+lensing+BAO column: Age 13.787 ± 0.020 Gyr. Converted with 1 yr = 3.15576 × 10^7 s."
  },
  {
   "key": "collide_squash_estimate",
   "label": "How far a plush body squashes in a hit (soft end of the contact force)",
   "status": "estimate",
   "value_si": 0.35,
   "unit_si": "m",
   "display": "Each body squashes by a quarter of the smaller body's depth: 0.35 m in all between two 2 m bodies (depth = 0.70 m, the diameter of a ball of equal volume)",
   "sources": [],
   "notes": "Not measured; nobody knows the stiffness of an indestructible plush. Reasoning: a hugged plush toy squashes by a quarter of its thickness or more, and so does a person's chest in a hard frontal hit. The smaller body sets the dent, so a 2 m Ollie hitting a 50 m Rex makes a local dent, not a 17 m squash. It scales with size. It changes only the force and the contact time, never momentum or energy. With a constant crush force F over squash s, F = Q/s and the time is 2s/v. For a linear spring (bounce), peak F = 2Q/s and the time is (π/2)·2s/v. Real bodies stiffen as they compress, so treat this as the soft end of a range whose top is the light-speed ceiling."
  },
  {
   "key": "collide_runup_estimate",
   "label": "Starting distance for the charge (used only for gravity on the way in and the air swept up)",
   "status": "estimate",
   "value_si": 20,
   "unit_si": "m",
   "display": "10 body heights (20 m at 2 m)",
   "sources": [],
   "notes": "A choice. It matters only for super-dense bodies, where it sets the gravitational infall energy G m₁m₂(1/d − 1/d₀) (the 1/d term dominates, so doubling it changes the result by under 4%), and for the rough air-heating estimate in relativistic runs."
  },
  {
   "key": "collide_rock_failure_radius",
   "label": "How far rock fails around a bolt carrying force C",
   "status": "estimate",
   "display": "r ≈ √(C / (2πσ)): a force C spread over a half-sphere of radius r averages C/(2πr²)",
   "sources": [
    {
     "title": "Padmanabha et al. 2021 (tensile strength used)",
     "url": "https://arxiv.org/abs/2110.10072"
    },
    {
     "title": "Hoek, Practical Rock Engineering Ch. 11 (UCS context)",
     "url": "https://www.rocscience.com/assets/resources/learning/hoek/Practical-Rock-Engineering-Chapter-11-Rock-Mass-Properties.pdf"
    }
   ],
   "notes": "Our geometry, not a published formula. Force balance on a buried half-sphere gives an average stress C/(2πr²). Exact point-load fields (Boussinesq/Cerruti) fall off the same way, with angular factors of order 1. With σ_t = 8.38 MPa (pulled apart, between the two partners) and σ_c = 200 MPa (crushed, on the far side), the rock cracks through between their anchors once r_t reaches half their spacing (1 m): C ≥ 5.27 × 10^7 N, a dial of 5,370 t. It reaches past the 41.1 km crust at C ≥ 8.89 × 10^16 N (dial 9.07 × 10^15 kg), where the estimate stops. Intact granite is assumed; jointed rock is far weaker (the project's surface notes: up to about 17×)."
  },
  {
   "key": "collide_planet_halves_pull",
   "label": "Pull holding Earth's two halves together (planet-scale marker)",
   "status": "estimate",
   "value_si": 1.0997e+25,
   "unit_si": "N",
   "display": "About 1.1 × 10^25 N (3GM²/(16R²) for a uniform-density Earth)",
   "sources": [
    {
     "title": "NASA Earth Fact Sheet (M, R)",
     "url": "https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html"
    }
   ],
   "notes": "Our derivation: inside a uniform ball g = −GMr/R³, so the force on the upper half is (3/4π)·∫z dV = 3GM²/(16R²) (with G = M = R = 1 this is 0.1875). A 400,000-pair Monte Carlo gave 0.1864. With G = 6.6743e-11 (CODATA 2022, already in the engine): 1.0997 × 10^25 N, a dial of 1.12 × 10^24 kg. Real Earth is centrally dense, so this is a marker, not a threshold. The page uses it only to say 'planet-scale: the planet itself would come apart'."
  },
  {
   "key": "collide_anchor_spacing_estimate",
   "label": "Distance between the two partners' anchors in a push",
   "status": "estimate",
   "value_si": 2,
   "unit_si": "m",
   "display": "One mean body height (2 m at default size)",
   "sources": [],
   "notes": "Leaning into each other chest to chest, their feet end up about a body height apart. Used only to decide when the cracked zones around the two anchors meet (r_t ≥ spacing/2)."
  },
  {
   "key": "collide_relativistic_sprint_estimate",
   "label": "Relativistic reading of the sprint's drag-limited top speed",
   "status": "estimate",
   "display": "Drag ½ρC_dA(γv)²: the engine's drag balance √(2F/(ρC_dA)) is read as the proper speed γv, not v",
   "sources": [],
   "notes": "In the runner's frame, air comes at him with density γρ and momentum γρv per unit volume. The momentum flux, and so the drag, grows as γ²v². This matches ½ρC_dAv² below 1% of light speed, so nothing changes there. Above it, momentum is m·u with u = min(√(2·thrust/(ρ₀C_dA)), leg cap), computed before the engine caps speed at c. That keeps a finite strength from giving infinite momentum. Rough: real relativistic drag on a body in air isn't modelled anywhere in the sim."
  }
 ],
 "inputs": "From the page (app.html state). Existing: Rex: H, m, strength dial (logKg, inf), anchor; Ollie: oH, oM, oSame/oLogKg/oInf, oAnchor; shared: mode (comic/real), surface, groundHolds (comic ground). New state keys, added to DEFAULTS and VALID:\n- colMode: 'charge' | 'push' (default 'charge').\n- colWho: 'ollie' | 'rex' (default 'ollie': Ollie charges or pushes, Rex holds).\n- colSrc: 'sprint' | 'jump' | 'stomp' | 'set' (default 'sprint').\n- colGB: log10(γβ) for the set speed, number in [−8.48, 4] (default log10(100/c) = −6.4768, i.e. 100 m/s). v = c·γβ/√(1+γβ²).\n- colInf: boolean, light speed (unlimited momentum) for the set speed (default false).\n- colBounce: 'splat' | 'bounce' (default 'splat').\n- colImm: boolean (default false): 'Make the holder truly immovable (infinite mass, a thought experiment)'.\n\nContexts: cR = ctx(), cO = ctxOllie(). Charger and holder are (cA, cB) = colWho === 'ollie' ? (cO, cR) : (cR, cO). If colImm, set cB.immovable = true. If !groundHolds and fallsThrough(cA or cB) (density design's 'fallsThrough' regime; fallback m·g > 1.7e9 Pa × body.topArea), rerun with groundHolds = true for both and prefix the sink callout.\n\nEngine values used (all existing): K.g, K.c, K.G, K.M_E, K.R_E, K.rho0, K.a0, K.TNT_J_per_kg, K.EARTH_BIND; makeBody fields (m, H, s, rho, volume, footArea, footB, frontArea, topArea, digArea, Cd); eqRadius, isBlackHole, mutualGravity, fallTogether; momentumToV, momentumToKE, vToMomentum; anchorCapacity (θ = 0, mA = own mass); qultFor; penetrationDepth; craterDiameter; seismicMagnitude; blastRadius (through the bay's blastBlock); sprint, jump, stomp (charge speeds); MUSCLE.jump.forceFrac (1.4, for 'can he stand'); MUSCLE.run, CAL_LIFT_KG. Surfaces: shear (claw/tear capacity), mu, qult, rho.\n\nNew constants (COL in engine.js): SQUASH 0.25; V_SOUND_MAX 36100 m/s; ROCK_T 8.38e6 Pa; ROCK_C 2.0e8 Pa (existing fact ground_granite_ucs); CRUST 41.1e3 m; I_FACTOR 0.3308; T_SID 86164.2 s (23.9345 h; the density design's K.OMEGA_E can be reused); RUNUP 10 body heights; AGE_U 4.3508e17 s; M_RESHAPE 1e-3 × M_E (from the density design); ROCK_FAIL 1.7e9 Pa (from the density design); F_HALVES = 3 G M_E² / (16 R_E²) = 1.0997e25 N.\n\nReused existing facts for source rows: ground_granite_ucs, seismic_efficiency_impact, blast_kinney_graham_peak_overpressure, energy_earth_gravitational_binding, energy_chicxulub_impact, earth_escape_velocity_surface (speed chip); from the density design: density_neutron_star_mean, gravitational_constant, earth_sidereal_rotation. From the contest design: the 'same()' tolerance helper and the holder's-hold convention min(strength, footing).",
 "equations": "Notation: charger A (mass m_A, depth L_A = 2·eqRadius), holder B (m_B, L_B); L = min(L_A, L_B); c = light speed; g = 9.80665.\n\nE1 Holder's hold H (what keeps B in place). Horizontal blow or push: bolted → ∞; truly immovable → ∞. Otherwise R = anchorCapacity({anchor: friction|braced, θ = 0, mA = m_B}).R; standing (1.4·F_B ≥ m_B g) → H = min(F_B, R), the contest design's rule (muscle holds his stance); lying flat (too heavy for his strength) → H = R. Blow from above (jump- or stomp-landing): H = ∞ if bolted or comic ground, else N_max − m_B g with N_max = qult·2·footArea (the engine's bearing). Bracing can't help against a blow from above; if his legs fold he is pressed onto the same ground. Defaults (180 kg, concrete): friction R = 0.6 × 180 × 9.80665 = 1,059.12 N; claws add 1.5 MPa × 0.2 m² = 300 kN → 301,059 N; bearing = 2.5 MPa × 0.09 m² − 1,765.2 = 223,235 N.\n\nE2 Static push (Reading 1). Pusher's usable push D_A = min(F_A, R_A) (bolted R_A = ∞). Compare with H_B using same() (relative 1e-9, ∞ never 'same' as a finite number). D_A = H_B → stalemate, contact C = D_A. D_A > H_B → force wins, C = H_B, net = D_A − H_B (walk-out or shove details come from the contest design's pushMatch/shove). D_A < H_B → object holds, C = D_A; if F_A > R_A, the pusher's own feet slip first. Both infinite (D_A = H_B = ∞): comic ground → 'paradox' (∞ − ∞ has no value); real ground → 'rockGives' (the rock around the bolts can't carry unlimited force). Newton's third law: the same C goes into both footings, which is why footing, not strength, decides.\n\nE3 Rock under bolts (static C, or the held blow's force F). A force C spread over a half-sphere of radius r averages C/(2πr²), so rock fails out to r_t = √(C/(2π·8.38 MPa)) in tension (between the partners: when both push toward each other, their anchors push the ground apart) and r_c = √(C/(2π·200 MPa)) crushed on the far side. Cracks meet between the anchors when r_t ≥ d_sep/2 (d_sep = mean height). Past the 41.1 km crust the estimate stops. Planet scale when C ≥ F_HALVES = 3GM²/(16R²) = 1.0997e25 N. The surface layer tears at C/(surface.shear × digArea) (contest design's ratio). Comic ground: nothing cracks.\n\nE4 Charge speed (Reading 2). Sprint: v = sprint(cA).vTop, proper speed u = min(√(2·thrust/(ρ₀C_dA_front)), legCap), computed before the engine caps at c (a relativistic reading of ½ρC_dA(γv)²; identical below 1% c). Jump: v = jump(cA).flight.vImpact, a blow from above; unavailable if the jump escapes, orbits, times out or is relativistic. Stomp-launch: v = stomp(cA).bodyFlight.vImpact, a blow from above; unavailable if bolted (no launch). Set: u = γβ·c, v = c·γβ/√(1+γβ²), ∞ = light speed. Momentum p = m_A·u (sprint/set) or vToMomentum(v, m_A) (drops).\n\nE5 Gravity on the way in (Newtonian; the planet-scale gate keeps GM/(rc²) < 1e-5). d₀ = 10·max(H_A, H_B), d = r_A + r_B (touching balls). Below 1% c: v_rel² = v² + v_f², with v_f = fallTogether(bA, bB, d₀, d).vRel = √(2G(m_A+m_B)(1/d − 1/d₀)). Above 1% c, gravity is ignored (< 0.4% of c at the gate). If mutualGravity at contact > H_B, the holder is dragged in too: both move, with total momentum m_A·v and relative speed v_rel (Newtonian CM split, E8).\n\nE6 Head-on hit, A (momentum p) into B at rest (mass m_T = m_B free, m_B + M_E held, ∞ immovable). E_A = √((m_A c²)² + (pc)²); K_A = momentumToKE(p, m_A); invariant mass M = √(m_A² + m_T² + 2 m_T E_A/c²). Splat (e = 0): they move off as one body of mass M with momentum p, V = momentumToV(p, M); energy freed Q = (M − m_A − m_T)c² = 2 m_T K_A/(M + m_A + m_T) (cancellation-free; → ½μv² below 1% c, μ = m_A m_T/(m_A+m_T)). Bounce (e = 1): below γβ = 1e-6, classical v_A' = (m_A − m_T)/(m_A + m_T)·v, v_T' = 2m_A/(m_A + m_T)·v. Otherwise rapidities: w_A = asinh(p/(m_A c)); β_cm = pc/(E_A + m_T c²); w_cm = atanh(β_cm) if β_cm < 0.5, else ln((E_A + m_T c² + pc)/(Mc²)); w_A' = 2w_cm − w_A, w_T' = 2w_cm; v = c·tanh(w), p = m·c·sinh(w). Centre-of-momentum momentum p* = p·m_T/M. Limits: m_T = ∞ → splat V = 0, Q = K_A; bounce v_A' = −v. p = ∞, m_T finite → Q = ∞, V = c; bounce v_A' = c·tanh(ln(m_A/m_T)) (0 for equal masses, −0.6c for 180 kg → 360 kg), v_T' = c. p = ∞ and m_T = ∞ → undefined (∞/∞): the paradox.\n\nE7 Held or not. F_held = Q_held/s, where Q_held is E6 with m_T = m_B + M_E (or ∞ if immovable) and s is from E9. Held if H_B ≥ F_held (any H = ∞ counts as held, except p = ∞ against a finite mass). Held: Earth takes the momentum, Δv_E = momentumToV(p_T, m_B + M_E). Day change (horizontal, set speed only): ΔT = T_sid²·p_T/(2π·0.3308·M_E·R_E). Run-up sources (sprint/jump/stomp): the charger got p by pushing on Earth, so Earth's net change over the whole episode is zero.\n\nE8 Splat with footing (non-relativistic, finite H, not held): constant crush force over squash s, holder resisted by H. F = μ(v²/(2s) + H/m_B), τ = 2s/v, V = max(0, v − Fτ/m_A), Q = F·s, holder moved during the hit x_B = ½((F − H)/m_B)τ², footing work H·x_B, impulse into Earth H·τ. H → 0 recovers the free splat; H → m_A v²/(2s) = F_held gives V = 0, so it joins E7 continuously. Energy check at defaults with claws: 194,532 J = ½·360·10.645² (20,397) + Q (149,991) + H·x_B (24,145). The bounce bound stays the free result (flagged as an upper bound when H > 0.1·F_held). Dragged by gravity: splat V = m_A v/(m_A + m_B), Q = ½μv_rel²; bounce v_A' = u − (m_B/M)v_rel, v_B' = u + (m_A/M)v_rel.\n\nE9 Contact force and time. Squash s = 2 × 0.25 × L (0.350263 m between two 2 m bodies). Plush splat: F = Q/s, t = p*·s/Q (= 2s/v below 1% c). Plush bounce: peak F = 2Q/s, t = (π/2)·p*·s/Q. Stiffest atom-built body: t_m = L/36,100 m/s, F_m = p*/t_m, shown only while v_rel < 36.1 km/s. Hard ceiling (no rigid bodies; signals ≤ c): the charger's centre-of-momentum γ*β* = p*/(m_A c), t_c = L/(γ* c (1 + β*)), F_c = p*/t_c. A perfectly rigid body would give t = 0 and F = ∞; relativity forbids it.\n\nE10 After the hit. Horizontal: slide x = m/(2k)·ln(1 + kV²/R), k = ½ρ₀·1.0·A_front (contest E13; R = 0 → ∞; V ≥ 0.01c → none). Splat pair: m_A + m_B, R = R_A + min(R_B, H_B), A = larger front area. Bounce: each body alone. Gravitationally bound runs (gravity boost and ½μv² < G m_A m_B/d₀): no slide, because they fall back together. From above, not held: splat pair driven down x_B + penetrationDepth(m_A + m_B, 2·footArea_B, V, qult, ρ_ground); at V ≥ 2 km/s use craterDiameter as the stomp does. Energy into the ground = H·x_B + ½(m_A+m_B)V².\n\nE11 Environment. Blast: blastBlock(Q, 'where they meet'), an upper bound as in the other tabs. Quake: seismicMagnitude(Q) only for held hits, labelled an upper bound (as if all of Q went into the ground); for drops that aren't held, seismicMagnitude(energy into ground). Earth 'time to move 1 mm' = 1e-3/Δv_E, compared with the age of the universe (4.3508e17 s). Relativistic run-up (v ≥ 0.01c): air heated ≈ ½ρ₀C_dA_front·u²·d₀ (rough, labelled) and the existing xkcd/plasma wording. Restitution between the bounds: (1 − e²)·Q_splat below 1% c.\n\nValidity: Newtonian gravity (gated); relativistic kinematics exact for a head-on 1-D hit; E8 and the slides below 1% c only; the force numbers depend on the squash estimate, and momentum and energy don't.",
 "algorithm": "A complete, tested reference implementation is at /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo/collide/collide-ref.js. The test runner is final-tests.js and its output is final-tests.out. Port the body into engine.js inside the IIFE: drop `P.`, use local names, and export COL, headOn, headOnCM, splatWithFooting, contactForces, rockLoad, slideTo, holdOf, standoff, chargeSpeed and collide. Reuse the contest design's same() and the density design's fallsThrough if they exist; otherwise use the versions in the file.\n\nENGINE\n1. Constants: add COL (values in inputs) and COL.F_HALVES = 3·K.G·K.M_E²/(16·K.R_E²).\n2. sprint(): compute `const vDragRaw = Math.sqrt(2 * thrust / (K.rho0 * body.Cd * body.frontArea))` before the c-cap. Return `uTop: Math.min(vDragRaw, legCap)` (Infinity when thrust and legCap are infinite; equal to vTop below 1% c). Nothing else changes. Until then, chargeSpeed recomputes it, as in the file.\n3. headOn(p, mA, mT) per E6, in this order:\n   - p ≤ 0 → zeros.\n   - p = ∞ and mT = ∞ → {undefinedResult}.\n   - mT = ∞ → immovable branch.\n   - p = ∞ → unlimited branch.\n   - otherwise: EA, M, Q (cancellation-free), p*, splat V = momentumToV(p, M); bounce classical below γβ 1e-6, else rapidity with the atanh/log switch at β_cm = 0.5.\n   - Zero a bounce v_A smaller than 1e-9·v (equal-mass round-off, e.g. −6.7e-8 m/s at 0.9c).\n4. headOnCM(mA, mB, u, w): Newtonian, for the gravity-dragged case.\n5. splatWithFooting(mA, mB, v, s, H) per E8.\n6. contactForces(h, bA, bB, mA) per E9:\n   - Infinite Q or p* → F = ∞, t = 0.\n   - Q = 0 → zeros.\n7. rockLoad(C, cHold, dSep) per E3.\n8. slideTo(m, v, R, A) per E10:\n   - v ≥ 0.01c → NaN (relativistic).\n   - R = 0 → ∞.\n9. holdOf(cB, horiz) per E1: canStand = !isFinite(F) || 1.4F ≥ m g. Also return R and why ∈ {immovable, bolted, lying, strength, footing, comicGround, bearing}.\n10. standoff(cA, cB) per E2/E3:\n   - black-hole gate;\n   - D_A, R_A, H_B, outcome;\n   - rock for a bolted holder;\n   - gravityLock = mutualGravity(contact).F > min(R_A, R_B).\n11. chargeSpeed(cA, source, gb) per E4, with why codes: zero, cantSprint, cantJump, neverLands, boltedStomp, noLaunch.\n12. collide(cA, cB, {source, gb}):\n   a. Gates: isBlackHole(A or B) → {blackHole}; m ≥ 1e-3 M_E → {planetScale}.\n   b. sp = chargeSpeed; if v ≤ 0 → {noCharge}.\n   c. Gravity (E5): d₀, dC, fall, gNear, gFar, vRel, gravBoost (vRel > 1.001·v), bound.\n   d. hb = holdOf(cB, dir === 'h'); p_A = gravBoost ? m_A·vRel : (u != null ? m_A·u : vToMomentum(v, m_A)).\n   e. dragged = gravBoost && gNear.F > hb.H.\n   f. hHeld = headOn(p_A, m_A, immovable ? ∞ : m_B + M_E); F_held = contactForces(hHeld).soft.F.\n   g. Held (E7): dragged → false; immovable → true; p = ∞ → !isFinite(H); else !isFinite(H) || H ≥ F_held.\n   h. h = held ? hHeld : (dragged ? headOnCM(m_A, m_B, m_A v/(m_A+m_B), vRel) : headOn(p_A, m_A, m_B)). If undefinedResult → outcome 'paradox'.\n   i. contact = contactForces(h).\n   j. If not held, not dragged, not relativistic, p finite, H finite and > 0: pf = splatWithFooting. Overwrite h.Q, h.inel and contact.soft with pf; set elasticUpper = H > 0.1·F_held.\n   k. Held and not immovable: earth = {dvSplat, dvBounce, dayChange (horizontal only), runUpCancels: source !== 'set', t1mm}.\n   l. After-motion per E10: horizontal slides, or downward depth/crater. Slides are null when bound.\n   m. If held, bolted and not immovable: rock = comic ? {comic} : rockLoad(contact.soft.F, cB, mean height).\n   n. Q, quakeHeld, airRunUp, outcome ∈ {moved, held, immovable, unstoppable, paradox}.\n13. Guards:\n   - Every sqrt is of a non-negative value.\n   - Masses are > 0 (state validation).\n   - ∞/∞ never becomes a number: NaN contact means 'undefined'.\n   - Ratios against ∞ capacity are 0.\n   - Display |v| < 1e-9·v₀ as 0.\n   - log1p in the slide.\n   - In headOn, atanh is used for small β_cm (otherwise a 180 kg : 7.4e16 kg hit loses all precision; this was found and fixed in testing).\n\nAPP (app.html)\n14. State keys (see inputs) in DEFAULTS and VALID; persist them with save().\n15. bayCollide(c):\n   - Controls first, in one .bay-controls div so slider drags keep focus:\n     - mode chips: Charge / Push;\n     - who chips: 'Ollie charges, Rex holds' / 'Rex charges, Ollie holds' (label the push as 'pushes' in Push mode);\n     - Charge only: source chips Sprint / Jump onto him / Stomp-launch onto him / Set speed;\n     - Set only: a range input over colGB with the label 'Speed: ' + fmtSpeed(v), preset chips (10 m/s; Speed of sound 340 m/s; 1 km/s; Escape speed 11.2 km/s; 1% of light; 50%; 90%; 99.99%), and a checkbox 'Light speed (unlimited momentum)';\n     - bounce chips 'Splat (no bounce)' / 'Perfect bounce';\n     - checkbox 'Make the holder truly immovable (infinite mass, a thought experiment)'.\n   - Then duoHeader(cR, cO).\n   - Then sink/gate callouts, verdict, status row, tiles, chart, blastBlock, happens, the four-cases grid, and math (page_text gives the text).\n16. Add a small caseGrid(title, rowLabels, colLabels, cells, activeRow, activeCol) helper: a 2×2 table; the active cell gets aria-current and the accent outline. It must fit at 390 px: stack it to four labelled rows under 480 px.\n17. build-data.py: put the new facts in research/final-duo.json (shared with the other duo designs) and add 'duo' to the topic list. Add rows such as row('Collide: why the paradox has no answer', fact('collide_paradox_premises')['display'], ['collide_paradox_premises']), and likewise for every fact listed. Reuse ground_granite_ucs, seismic_efficiency_impact and blast_kinney_graham_peak_overpressure.\n18. static-data.js: add the assumptions card from page_text.\n19. Tests (test/duo-collide.js or appended to test/sanity.js): the cases in 'tests'. Also assert that both modes render without exceptions for every combination of source × anchor × groundHolds × colImm × colInf at the default, Strongest-human, Hulk, Earth-bench and ∞ strength, and at 30, 1000, 22587, 2.77e9 and 4.12e17 kg/m³ (each value finite or a defined ∞/NaN outcome).\n\nCost: collide() calls sprint/jump/stomp once. jump and stomp run fly(); everything else is closed form. Under 20 ms in Node per run.",
 "edge_cases": "INFINITE STRENGTH\n- Charger, plain feet: sprint thrust is capped by friction (1,059 N at 180 kg on concrete), so he charges at 46.49 m/s, exactly as at Hulk strength (C1 = C16). Say it: 'Infinite strength isn't unstoppable: a charge needs grip.'\n- Charger, bolted: thrust ∞ → u = ∞ → p = ∞ → outcome 'unstoppable'. The holder, and the planet if he is bolted, is knocked away at light speed with unbounded energy. Since Ollie's own infinite momentum came from pushing on Earth, Earth's net motion is ∞ − ∞, undefined. Say so and print no Earth number.\n- Holder: H = min(∞, R) = R, so infinite strength holds only his footing. 'Infinite strength isn't immovable either.'\n\nBOTH INFINITE\n- Push, both bolted, comic ground: 'paradox' (∞ − ∞).\n- Push, both bolted, real ground: 'rockGives'.\n- Push, both on plain feet: a footing stalemate at 1,059 N (S9).\n- Charge: no strength setting gives infinite inertia. Unlimited momentum (set speed ∞, or a bolted charger with ∞ strength) against the immovable toggle → 'paradox' (∞/∞). Against anything finite, including bolted to Earth with comic ground → 'unstoppable'. Comic ground stops the ground from breaking, but the planet still has finite mass.\n\nEXTREME DENSITY\n- Plush (30 kg/m³, 5.4 kg holder): footing 31.8 N, so the charger barely slows. Splat: the pair moves at 45.13 m/s, frees 5,677 J and travels 123 m. Bounce: Rex at 90.27 m/s (about 2v), Ollie carries on at 43.78 m/s; air drag stops Rex in 26.7 m.\n- Below air density (≤ 1.225 kg/m³): defer to the density design's buoyancy. If footing is 0, H = 0, so the hit is free and the slide is ∞ ('coasts until something stops him').\n- Heavier than ~5.2 × 10^7 kg at 2 m on real ground: he falls through the rock (density design). Rerun with comic ground and prefix the callout.\n- Neutron-star Rex (7.416 × 10^16 kg) on comic ground vs a normal Ollie:\n  - Rex can't stand (1.4F ≪ W), so he lies flat and friction holds 4.36 × 10^17 N.\n  - His gravity pulls Ollie in from 20 m at 3,692.7 m/s whatever the run-up (vRel 3,693.0).\n  - Held; 1.227 × 10^9 J (293 kg TNT) freed. Ollie can't bounce away (bound). In Push mode the gravity lock flag is set (1.8 × 10^9 N vs 1,059 N).\n- Both neutron-star dense: gravity drags both. Closing speed 5,222 m/s; the splat frees 5.06 × 10^23 J, 1.2× the dinosaur-killing asteroid, and the pair drifts at 0.5 m/s.\n- A neutron-star charger can't sprint, jump or stomp-launch (cantSprint), so use Set speed.\n- m ≥ 1e-3 Earth masses (5.97 × 10^21 kg) → planetScale callout. Black hole (ρ ≥ 1.31 × 10^27 kg/m³ at 2 m) → blackHole callout.\n\nRELATIVISTIC SPEEDS\n- Kinematics are exact. Slides, the footing-aware splat and the gravity boost switch off at ≥ 1% c, where footing is negligible against forces ≥ 10^19 N.\n- The run-up air estimate and the plasma/xkcd wording apply. A free splat pair moving on at ≥ 1% c is a fireball too (V = 0.627c at 0.9c).\n- Show the 'stiffest real material' bar only while v_rel < 36.1 km/s.\n- 'Light speed (to the last digit)' and '≈ light speed' use the existing fmtSpeed and speedTile.\n\nCOMIC GROUND\n- Holds bearing (∞), so drops are held. No rock cracking and no surface tear.\n- Friction still limits sideways footing (engine convention), so a non-bolted Rex still slides from a sprint hit.\n\nBOLTED\n- Holder: Earth takes the momentum. The rock check applies unless the ground is comic. A bolted stomp has no launch (boltedStomp).\n- Charger bolted: sprint thrust = strength (engine convention 'perfect grip'). After the hit, his slide uses friction (bolts can't be fixed mid-run).\n\nUNEQUAL SIZES\n- Squash uses the smaller depth.\n- The light ceiling uses the smaller body; d₀ = 10 × the larger height; anchor spacing is the mean height.\n- A 50 m Rex (2.81 × 10^6 kg) can't stand at Hulk strength. He lies flat with 1.65 × 10^7 N of friction, so a 2 m Ollie's sprint hit (555 kN) is held.\n\nZERO/NaN\n- Set speed 0 → noCharge 'zero'.\n- Q = 0 → contact zeros and no blast.\n- p = ∞ and m = ∞ → NaN, shown as 'undefined', never a number.\n- same() treats ∞ vs finite as unequal.\n- All logBars rows with ∞ get a text label.\n- t1mm = ∞ when Δv = 0.",
 "outputs": "standoff(cA, cB) →\n- {blackHole}, or\n- {outcome: 'stalemate' | 'forceWins' | 'objectHolds' | 'paradox' | 'rockGives';\n  DA (N, usable push; ∞ when bolted with ∞ strength);\n  RA (N, pusher's footing; ∞ when bolted);\n  FA, FB (N, strengths);\n  HB (N, holder's hold);\n  RB (N);\n  holdWhy;\n  contact (N; NaN = undefined);\n  net (N, forceWins);\n  pusherSlips (bool);\n  dSep (m);\n  gravF (N, mutual gravity at contact);\n  gravityLock (bool);\n  rock?: {comic} or {C N, rT m, rC m, tear (ratio), tearCap N, crackThrough, beyondCrust, planet (bools)}}.\n\ncollide(cA, cB, {source, gb}) →\n- {blackHole} | {planetScale} | {noCharge: why, speed}, or\n- {outcome: 'moved' | 'held' | 'immovable' | 'unstoppable' | 'paradox';\n  dir 'h' | 'v';\n  speed {v m/s, u m/s (γv), jump/stomp/run result, apex m};\n  v0, vRel (m/s);\n  d0, dC (m);\n  fall {t s, vRel m/s, E J};\n  gNear, gFar (mutualGravity results, N);\n  gravBoost, bound, dragged, relativistic (bools);\n  hold {H N, R N, why};\n  pA (kg m/s; ∞ allowed);\n  held (bool);\n  Fheld (N);\n  h {KA J, Q J, pStar kg m/s, Mstar kg, inel {V m/s, pT}, el {vA, vT m/s, pA, pT}};\n  partial? {F N, tau s, V m/s, Q J, xB m, Efoot J, Jearth N s};\n  elasticUpper (bool);\n  contact {s m, L m, soft {F N, t s}, softEl {F, t}, matter {F, t}, light {F, t}};\n  earth? {dvSplat, dvBounce m/s, dayChange s, runUpCancels, t1mm s};\n  after: horizontal {splat {V, during m, slide m, moved m}, bounce {vA, vB, slideA, slideB (m, null if bound, NaN if relativistic)}}, or from above {splat {V, depth m or D crater m, Eground J}, bounce {...}};\n  rock? (as above);\n  Q (J, splat energy freed);\n  quakeHeld (magnitude, upper bound);\n  airRunUp (J, rough)}.\n\nDisplay units: fmtSpeed, fmtSI(N | J | Pa), fmtTNT, fmtDist, fmtTime, sci for Earth's Δv (m/s).",
 "page_text": "Names: X is the charger or pusher and Y is the holder (default X = Ollie, Y = Rex). 'surface' is c.surface.short.\n\nTAB INTRO (one muted line under the controls)\n'What happens when an unstoppable force meets an immovable object? Two ways to ask it: a push, and a charge.'\n\nGATES (callout, then stop, except the sink callout)\n- blackHole: 'At this density {name} is a black hole (see Weight). There's nothing left to collide with.'\n- planetScale: 'At {mass}, {name}'s own gravity reshapes the planet (see Weight). A charge across Earth's surface stops making sense here.'\n- sink (real ground and fallsThrough): 'On real ground {name} sinks into the planet just standing there (see Weight). This test assumes Comic ground.' Then compute with comic ground.\n\nCHARGE: NO-CHARGE VERDICTS\n- cantSprint: '{X} can't charge. At {mass} his strength ({F}) can't hold up his own weight ({W}), so he can't run. Try Set speed.'\n- cantJump: '{X} can't get off the ground, so he can't land on {Y}.'\n- neverLands: '{X}'s {jump | stomp-launch} carries him off the planet{ at {v}}. He never comes down on {Y}.'\n- boltedStomp: 'Bolted to the planet, {X}'s stomp can't launch him, so there's nothing to land on {Y}.'\n- noLaunch: '{X}'s stomp doesn't lift him off the ground.'\n- zero: 'Set a speed above zero.'\n\nCHARGE: VERDICT (splat; bounce variant after the slash)\n- moved, sideways, splat:\n  - default: '{X} hits {Y} at {vRel}. {Y} is knocked back at {V} and the two slide {moved} before they stop.'\n  - if moved < 1 m: '{X} hits {Y} at {vRel}. {Y}'s {claws | footing} take most of it: he's shoved back {moved}.'\n  - if V ≥ 1% c: '... The two of them carry on together at {V}, a fireball.'\n- moved, sideways, bounce:\n  - equal masses: '{X} stops dead and {Y} flies off at {vB}, like Newton's cradle.'\n  - otherwise: '{X} {bounces back at |vA| | keeps going at vA} and {Y} is knocked away at {vB}.'\n- moved, from above, splat: '{X} lands on {Y} at {vRel}. The ground gives: the two are driven {depth} into {surface}.' With a crater: '... and blast a crater up to {D} wide.'\n- moved, from above, bounce: '{Y} is driven {depth} into {surface}; {X} {stops on top | bounces back up at v}.'\n- held, sideways: '{Y} doesn't budge. {X} {stops dead against him | bounces straight back at |vA|}, and the blow goes through {his feet | his bolts} into the planet.'\n- held, from above: '{Y} doesn't budge: {the ground under him holds | comic ground can't give | his bolts hold}. {X} {stops on his head | bounces back up at v}.'\n- immovable: '{Y} is truly immovable here (infinite mass, a thought experiment), so {X} {stops dead | bounces back at v}. All {fmtTNT(K)} of his energy is {freed at the hit | handed back to him as motion}.'\n- unstoppable: '{X} carries unlimited momentum. Nothing with finite mass can stop him: {Y}{, and the planet he's bolted to,} is knocked away at light speed, with unlimited energy.'\n- paradox: 'No answer. {X} has unlimited momentum and {Y} has unlimited inertia, so momentum conservation would have to divide one infinity by another. That has no value. Physics doesn't settle the paradox; it says the two can't exist together.'\n- gravity boost (append): '{Y}'s gravity pulls {X} in: he arrives at {vRel} however fast he ran.' If dragged: 'Their gravity drags them together before anyone charges.'\n\nCHARGE: STATUS CHIPS\n- Charge:\n  - info 'Charge: {speed} ({his top sprint | falling from his {apex} jump | falling back after a stomp-launch | set speed})';\n  - warn 'Sonic boom on the way in' if v ≥ 340 m/s and < 1% c;\n  - bad 'Fireball on the way in' if ≥ 1% c.\n- Hold:\n  - held + bolted: info 'Bolted: Earth takes the blow';\n  - held + comicGround: info 'Comic ground takes the blow';\n  - held otherwise: good '{Y} holds: {H} vs a {Fheld} hit';\n  - moved: bad '{Y} gives: holds {H}, needs {Fheld}';\n  - immovable: info 'Thought experiment: infinite mass';\n  - dragged: bad 'Gravity drags {Y} in first'.\n- Rock (bolted):\n  - comic: info 'Comic ground: the rock can't crack';\n  - planet: bad 'Planet-scale load on the rock';\n  - rT ≥ 0.05 m: bad 'Rock cracks {rT} around his bolts';\n  - otherwise: good 'Rock around his bolts holds'.\n- Quake (held only): the existing quakeChip(Q, quakeHeld). The tile sub-line says 'upper bound'.\n- partial with H/F_held > 0.1: info 'His footing soaks up part of the blow'.\n- Bounce selected and elasticUpper: info 'Bounce ignores his footing (upper bound)'.\n\nCHARGE: TILES\n1. speedTile('Charge speed', vRel, source label; with gravity boost: 'his own run: ' + speedOnly(v0)).\n2. 'Energy freed at the hit':\n   - splat: fmtSI(Q, 'J'), sub fmtTNT(Q) + ' · ' + compareEnergy(Q);\n   - bounce: 'none', sub 'a perfect bounce keeps it as motion; a splat frees ' + fmtTNT(Qsplat);\n   - Q = ∞: 'unbounded'.\n3. Holder result:\n   - moved sideways: speedTile('{Y} knocked back at', V or vB, 'moves ' + fmtDist(moved) + ' in all');\n   - moved from above: tile('{Y} driven into the ground', fmtDist(depth), surface);\n   - held: tile('{Y} moves', 'not at all', why text);\n   - unstoppable: tile('{Y} moves', 'at light speed', 'unlimited momentum').\n4. tile('Force of the hit', fmtSI(F_soft or F_softEl, 'N'), 'over ' + fmtTime(t) + ' (plush squash, estimate)'). For Q = ∞: 'unbounded'.\n5. Held and not immovable: tile('Earth's speed change', sci(dv) + ' m/s', t1mm > age of universe ? 'Earth would take ' + sig(t1mm/AGE_U, 2) + '× the age of the universe to move 1 mm' : 'Earth would take ' + fmtTime(t1mm) + ' to move 1 mm'). Unstoppable + bolted: tile('Earth', 'knocked away at light speed', 'unlimited momentum').\n\nCHARGE: CHART\nlogBars('Forces at the hit', ...), skipped when Q is 0 or ∞. Rows:\n- {label 'What holds {Y}', value H; text 'no limit (bolted)' or 'no limit (comic ground)' when ∞};\n- {label 'The hit, plush squash', value F_soft, highlight};\n- {label 'As stiff as any real material', value F_m} (omit when supersonic);\n- {label 'Stiffest body physics allows', value F_c}.\nCaption (muted): 'A perfectly rigid body would make the hit infinite. Relativity forbids one, so the hit is never infinite.'\nThen blastBlock(Q, 'where they meet') for splat and finite Q > 0. For Q = ∞: callout 'The energy is unbounded, so no finite blast radius applies.'\n\nCHARGE: WHAT HAPPENS (happens(), max 5, in this priority)\na) Always: 'Momentum is never lost. Whatever {X} brings in, the two of them (plus whatever holds {Y}) carry away. A splat shares it and frees the rest of the energy as heat, sound and blast. A perfect bounce keeps all the energy as motion. Soft bodies sit near the splat end: people swung into each other on ropes bounced back with 10–50% of their closing speed, which frees 75–99% of the splat energy.'\nb) Always (one line chosen by why): '“Immovable” only means what holds {Y} in place.' followed by:\n   - footing: ' Standing on {surface}, friction holds him with {R}{ plus his claws}. Stopping {X} dead takes {Fheld}, so he {gets knocked back | holds}.'\n   - strength: ' His claws could hold {R}, but his muscles keep his stance against only {F_B}.'\n   - lying: ' At {mass} he's too heavy for his strength to stand, so he lies flat and friction alone holds him: {R}.'\n   - bearing: ' Bracing can't help against a blow from above. Only the ground under his feet holds him up: {H} on {surface}.'\n   - bolted: ' Bolted, he is part of the planet: the bolts hand the momentum to Earth's 5.97 × 10²⁴ kg.'\n   - comicGround: ' On comic ground nothing gives under him, so Earth takes it.'\n   - immovable: ' Here he gets infinite mass, which no real setting allows. Even bolted to an unbreakable planet he would be only as immovable as Earth's 5.97 × 10²⁴ kg.'\nc) Always (finite Q > 0): 'How hard they hit depends on how squishy they are, which nobody knows for an indestructible plush. If each squashes a quarter of his depth ({s} in all), the hit lasts {t} and pushes with about {F}. A perfectly rigid body would make the force infinite, but relativity forbids one: no push travels through a body faster than light. Even the stiffest body physics allows takes {t_c} to stop, which caps the force at {F_c}.'\nd) unstoppable/paradox (replaces c): 'An unstoppable force would need unlimited momentum, so nothing with finite mass could stop it. An immovable object would need unlimited inertia, so nothing with finite momentum could move it. Put them together and momentum conservation asks for ∞ ÷ ∞, which has no value. So the honest answer is that the two can't exist in the same universe: if one does, the other doesn't. That is the standard resolution of the paradox.'\ne) relativistic: 'At {v} the air ahead of {X} can't get out of the way: it's shock-heated into plasma. His last {d0} of run-up alone dumps very roughly {fmtTNT(air)} into the air before he arrives.' Then the existing xkcd sentence: '(Air only starts to fuse much closer to light speed …)' below 50% c, or '(… air nuclei start to fuse too …)' above.\nf) gravity boost: 'At {density}, gravity between them matters. Starting {d0} apart, {Y}'s pull alone brings {X} in at {fall.vRel}.' Add, by case: ' They're bound together: after a bounce they fall back.' ' The pull ({gNear}) beats what holds {Y} ({H}), so it drags him in too.'\ng) infinite strength:\n   - charger not unstoppable: 'Infinite strength isn't unstoppable: a charge needs grip. On {surface} his feet push off with only {thrust}, so he tops out at {v}.'\n   - holder moved: 'Infinite strength isn't immovable either: holding still needs footing, and his feet give at {R}.'\nh) Earth (held, not immovable): 'Earth takes the momentum: its speed changes by {dv}.' Then:\n   - runUpCancels: ' And {X} got his speed by pushing on Earth in the first place, so Earth just gets its own momentum back. Overall, nothing moves.'\n   - set speed: ' Arriving from outside, his momentum stays with Earth{; if he hits along the equator, the day gets {dayChange} longer or shorter}.'\ni) rock (bolted, not comic): 'The bolts are comic; the rock isn't. The blow loads the rock around his bolts with {F}: granite pulls apart within about {rT} and is crushed within about {rC}{, and the {surface} on top tears at {tear}× its limit}.' Add:\n   - beyondCrust: ' That reaches deeper than the crust (41 km on average under continents), where this estimate stops.'\n   - planet: ' That is more than the gravity holding Earth's two halves together (about 1.1 × 10²⁵ N): the planet itself would come apart.'\nOrder when there are too many: a, b, c|d, e, f, g, h, i. Truncate at 5.\n\nFOUR CASES GRID (always, under 'What happens'; title 'The four cases')\n- Rows: 'Finite momentum', 'Unlimited momentum (light speed)'.\n- Columns: 'Finite inertia (anything real, even bolted to Earth)', 'Unlimited inertia (truly immovable)'.\n- Cells:\n  - [0,0] 'Both move. They share the momentum; the softer the hit, the more energy it frees.'\n  - [0,1] 'The charger stops or bounces. The object doesn't budge, so the force was stoppable.'\n  - [1,0] 'The object is knocked away at light speed (the planet too, if bolted), so it was movable.'\n  - [1,1] 'No answer: ∞ ÷ ∞. The two can't exist in the same universe.'\n- Highlight row = isFinite(pA) ? 0 : 1, column = immovable ? 1 : 0.\n\nCHARGE: SHOW THE MATH (lines)\n- 'Charge: {source} → v = {v0}; momentum p = γ m v = {pA}.' + (relativistic sprint: ' Top speed read relativistically: drag ½ρC_dA(γv)² balances the push, so γv = √(2F/(ρC_dA)).')\n- gravity boost: 'Gravity on the way in: v_rel² = v² + 2G(m₁+m₂)(1/d − 1/d₀), d₀ = {d0}, d = {dC} → {vRel}.'\n- 'Splat: they move off as one body. Invariant mass M = √(m₁² + m₂² + 2m₂E₁/c²); energy freed Q = (M − m₁ − m₂)c² = {Q} (½μv² below 1% of light speed, μ = m₁m₂/(m₁+m₂)).'\n- 'Perfect bounce: each body's momentum reverses in the centre-of-momentum frame. Below 1% of light speed: v₁′ = (m₁−m₂)/(m₁+m₂)·v, v₂′ = 2m₁/(m₁+m₂)·v.'\n- held: 'Held: {Y} and Earth act as one body of {m + M_E}. Earth's Δv = p/(m + M_E) = {dv}.'\n- partial: 'His footing ({H}) pushes back during the hit: crush force F = μ(v²/2s + H/m₂) = {F}, contact 2s/v = {t}, he leaves at {V}.'\n- 'Force: squash s = ½ × the smaller depth = {s}; F = Q/s (splat) or 2Q/s peak (bounce). Real matter can't carry sound faster than 36.1 km/s: F ≤ p*/(L ÷ 36.1 km/s) = {Fm}. Nothing travels faster than light: F ≤ p*/(L/(γ*c(1+β*))) = {Fc}. Here p* = {pStar} is the momentum in the centre-of-momentum frame and L = {L}.'\n- 'Slide: x = m/(2k)·ln(1 + kV²/R), k = ½ρ₀C_dA.'\n- bolted: 'Rock: a force C spread over a half-sphere of radius r averages C/(2πr²); granite pulls apart at 8.4 MPa and crushes at 200 MPa, so r = √(C/2πσ).'\n- 'Blast radii: Kinney & Graham (1985), as if all of Q became a blast (upper bound). Quake: 1 part in 10,000 of Q, upper bound.'\n- Ollie charging: 'Ollie's horns don't change the momentum or the energy; they only put the force on a smaller patch.'\n\nPUSH: VERDICT\n- stalemate: 'Dead heat. {X} pushes with {C} and {Y} holds {C}. Neither moves.' If both footing-limited: ' Both are pushing as hard as their feet allow: the ground is the limit, not strength.'\n- objectHolds:\n  - pusherSlips: '{Y} doesn't move. {X}'s own feet slide back first: they hold only {RA}, far less than his {FA} of strength.'\n  - plainly weaker: '{Y} doesn't move. {X} pushes with {DA}, less than {Y}'s hold of {HB}.'\n  - both bolted: 'Neither moves. Both are bolted to the planet, so {X}'s {C} push goes into the rock between them and stretches it.'\n  - immovable: '{Y} doesn't move: here he's truly immovable.'\n- forceWins:\n  - '{X} wins. He pushes with {DA} and {Y} can hold only {HB}, so {Y} is driven back.' Add the contest walk-out time and speed when available. If X is bolted: ' Bolted, {X} can't walk him out; he can only shove him away (see Wrestle).'\n  - DA = ∞: '{X} pushes with unlimited force from bolted feet. {Y}'s hold is finite ({HB}), so he is shoved away at light speed with unlimited energy.'\n- rockGives: 'Unlimited push, real rock: the rock gives. The crust between them is torn apart, and {Y} is carried off with the rock he's bolted to.'\n- paradox: 'No answer. An unlimited push meets an unlimited hold on ground that can't break, and infinity minus infinity has no value. Physics doesn't settle it; it says the two can't exist together.'\n\nPUSH: CHIPS\n- '{X} pushes {DA}': info, or warn '{X}'s feet slip first'.\n- '{Y} holds {HB}': good when he holds, bad when he gives.\n- Rock chips as in Charge.\n- gravityLock: warn 'Gravity glues them together ({gravF})'.\n\nPUSH: TILES\n- '{X}'s push' fmtSI(DA), sub 'strength ' + F_A + ' · feet hold ' + (RA ∞ ? 'no limit (bolted)' : RA).\n- '{Y}'s hold' fmtSI(HB) or '∞', sub why: 'his footing' | 'his strength' | 'lying flat: friction' | 'bolted' | 'truly immovable'.\n- 'Force between them' fmtSI(C), or 'undefined'.\n- Bolted: 'Rock pulls apart out to' fmtDist(rT), sub 'crushed within ' + fmtDist(rC).\n\nPUSH: CHART\nlogBars('Forces', [{X}'s strength, {X}'s footing, {Y}'s strength, {Y}'s footing]), with ∞ rows texted 'no limit'.\n\nPUSH: WHAT HAPPENS\n- 'Newton's third law: {X} pushes {Y} exactly as hard as {Y} pushes back, and both forces end up in the ground. So each can use only as much force as his footing takes. Strength past that just makes his feet slide.'\n- 'Footing here: {X}'s feet hold {RA} ({why}); {Y} holds {HB} ({why}).'\n- Rock bullet as in Charge, with C.\n- Infinite strength: 'Infinite strength isn't unstoppable on plain feet: {X}'s push is capped at {RA}.'\n- gravityLock: 'At this density their gravity ({gravF}) beats {X}'s footing ({RA}): they're stuck together before anyone pushes.'\n- 'For a walk-out or a shove-off, see Wrestle.'\n\nPUSH: FOUR CASES GRID\n- Rows: 'Finite push', 'Unlimited push (unlimited strength, bolted)'.\n- Columns: 'Finite hold', 'Unlimited hold (bolted on unbreakable ground, or truly immovable)'.\n- Cells:\n  - [0,0] 'The bigger usable force wins; equal is a dead heat.'\n  - [0,1] 'He holds. The push goes into the ground, and real rock cracks around the bolts.'\n  - [1,0] 'He's shoved away at light speed.'\n  - [1,1] 'No answer: ∞ − ∞. On real rock, the rock gives first.'\n\nASSUMPTIONS CARD (static-data.js)\n{ t: 'Unstoppable force vs immovable object', d: 'Momentum and energy are exact, relativity included. Two bounds bracket every hit: a splat (no bounce; the lost energy comes out as heat, sound and blast) and a perfect bounce. How hard they hit depends on how squishy they are, which nobody knows for an indestructible plush. The sim lets each squash by a quarter of the smaller body's depth, and also shows the most any body could do, because relativity forbids perfectly rigid bodies. Bracing uses the same friction and claw model as the other tabs. Bolts never fail, but the granite around them does: it pulls apart at about 8 MPa and crushes at 200 MPa. Hits are straight and head-on: spin, glancing blows, horns and the air during the hit are ignored.' }",
 "caveats": "- Squishiness is unknown. Nobody knows how stiff an indestructible plush is. The force and contact time rest on an assumed squash (a quarter of the smaller body's depth). The true force could be anywhere from that up to the light-speed ceiling. Momentum, energy, speeds and who moves do not depend on it, except the 'does he hold?' test. That test uses the soft (plush) force, so a stiffer pair would knock a braced Rex loose a bit more easily.\n- Two bounds, not one answer. Real hits fall between splat and bounce. Soft bodies are near the splat end, based on one informal test with people (restitution 0.1–0.5).\n- Footing. Standing holders hold with the smaller of strength and footing (the same rule as Wrestle). Too-heavy holders lie flat and use friction alone. The 'splat with footing' treats footing as a constant push-back during the hit. The bounce bound ignores footing, so it is the most he could be knocked away.\n- Landings from above. The landing speed is the speed Ollie would hit the ground at, so the extra 2 m of fall to Rex's head is ignored. Only the ground's bearing holds Rex up. The ground's own inertia during the 20 ms hit is ignored.\n- Rock. The cracking radius is an average-stress estimate for intact granite at slow loading rates. A real hit loads it faster, which makes it up to 5× stronger, so the cracks are overstated by up to about 2×. Jointed rock is much weaker. The estimate stops at crust depth. The planet-scale marker assumes a uniform-density Earth.\n- Earth. Earth is treated as one rigid ball taking the momentum; really it rings with seismic waves. The quake magnitude for held hits is an upper bound, as if all the energy went into the ground. Any momentum Ollie got from pushing on Earth goes back to Earth.\n- Gravity. Gravity is Newtonian between two balls of equal volume, starting 10 body heights apart. Super-dense bodies sink through real ground, so those runs assume comic ground. Past 0.1% of Earth's mass the test stops.\n- Relativity. Momentum and energy are exact. Sliding, footing and gravity are switched off at 1% of light speed. The relativistic sprint speed and the air heated by a relativistic run-up are rough.\n- Geometry. Blast radii are upper bounds. Bodies hit head-on in a straight line. Spin, glancing blows, horns and air flow during the hit are ignored.",
 "tests": [
  {
   "name": "headOn: equal masses, non-relativistic splat and bounce",
   "inputs": "headOn(p = 180 × 46.4916, 180, 180)",
   "expected": "Q = 97,266 J; splat V = 23.2458 m/s; bounce vA = 0, vT = 46.4916 m/s; p* = 4,184.24 kg m/s",
   "reasoning": "μ = 90 kg; Q = ½ × 90 × 46.4916² = 45 × 2,161.47 = 97,266. V = p/(2m). Equal-mass elastic swaps speeds (Newton's cradle). p* = p·m_T/M ≈ 90 × 46.4916.",
   "tolerance": "1e-6 relative"
  },
  {
   "name": "headOn: 0.5c into twice the mass (relativistic, unequal)",
   "inputs": "headOn(p = 0.577350 × 180 × c, 180, 360)",
   "expected": "Q = 1.64072e18 J; V = 0.183013c; bounce vA = −0.177219c, vT = 0.354163c; momentum and energy conserved to 1e-12",
   "reasoning": "γβ = 0.5/√0.75 = 0.57735. E_tot = (1.1547 × 180 + 360)c² = 567.85c² kg; V = p/E_tot·c² = 103.92/567.85 = 0.18301c. M = √(180² + 360² + 2 × 360 × 207.85) = 568.47... Q = (M − 540)c², computed without cancellation. Bounce from rapidity reversal; checked by summing momenta and energies.",
   "tolerance": "1e-9 relative (conservation 1e-12)"
  },
  {
   "name": "headOn: 0.9c equal masses",
   "inputs": "headOn(p = 2.0647416 × 180 × c, 180, 180)",
   "expected": "Q = 9.16899e18 J (2.19 Gt TNT); V = 0.626789c; bounce vA = 0 (after the 1e-9 round-off guard), vT = 0.9c",
   "reasoning": "γ = 2.2942; M = 180√(2 + 2γ) = 180 × 2.5667 = 462.0 kg; Q = (462.0 − 360)c² ≈ 9.17e18. V = γβm/(γm + m) = 2.0647/3.2942 = 0.62679c.",
   "tolerance": "1e-6 relative"
  },
  {
   "name": "headOn: heavy target precision (180 kg into 7.416e16 kg at γβ = 1e-5)",
   "inputs": "headOn(1e-5 × 180 × c, 180, 7.416e16)",
   "expected": "bounce vT = 2V = 4.8544e-20 c; momentum conserved to 1e-12; Q = 8.0888e8 J",
   "reasoning": "Using ln((E + pc)/(Mc²)) for the centre-of-momentum rapidity loses all digits here (gave a momentum error of 18,000×). atanh(pc/E_tot) fixes it. Q ≈ ½ × 180 × (2,997.9)² = 8.0888e8.",
   "tolerance": "1e-9 relative"
  },
  {
   "name": "headOn: infinities",
   "inputs": "headOn(∞, 180, 360); headOn(∞, 180, 180); headOn(∞, 180, ∞); headOn(8368.48, 180, ∞)",
   "expected": "Q = ∞, splat V = c, bounce vA = −0.6c; bounce vA = 0; {undefinedResult}; Q = 194,532 J, splat V = 0, bounce vA = −46.4916 m/s",
   "reasoning": "In the ultra-relativistic limit the charger's final rapidity is ln(m_A/m_T): tanh(ln 0.5) = (0.25 − 1)/(0.25 + 1) = −0.6. An infinite target takes no speed and frees all of K_A = ½ × 180 × 46.4916². ∞/∞ has no value.",
   "tolerance": "exact flags; 1e-9 relative"
  },
  {
   "name": "C1 default charge: Ollie sprints into standing Rex",
   "inputs": "Both 2 m, 180 kg, Hulk (100 short tons, F = 889,644 N), comic, concrete, friction, comic ground off; collide(cO, cR, {source: 'sprint'})",
   "expected": "v0 = vRel = 46.4916 m/s; H = 1,059.12 N (footing); F_held = 555,388 N → moved; splat Q = 97,451 J (23.3 g TNT), V = 23.2015 m/s, during 0.1748 m, slide 43.112 m, moved 43.29 m; force 278,223 N over 15.068 ms; bounce Ollie 0, Rex 46.4916 m/s, slide 127.31 m; ceiling F_c = 1.7907e12 N (t 2.3367 ns); matter F_m = 2.156e8 N",
   "reasoning": "Sprint thrust = 0.6 × 180 × 9.80665 = 1,059.12 N; drag top speed √(2 × 1,059.12/(1.225 × 0.8)) = 46.4916. s = 0.5 × 0.700527 = 0.350263. F_held = ½ × 180 × 2,161.47/0.350263. Partial: F = 90 × (3,085.48 + 5.884) = 278,223; τ = 2s/v = 0.0150678; V = 46.4916 − 278,223 × 0.0150678/180 = 23.2015; Q = F·s. Slide = 367.35 × ln(1 + 0.49 × 538.31/2,118.24) = 43.11. Bounce slide = 183.67 × ln(2.000) = 127.31. F_c = 4,184.24/(0.700527/c).",
   "tolerance": "1e-4 relative"
  },
  {
   "name": "C2 bolted Rex: Earth takes it",
   "inputs": "As C1 but Rex anchor 'bolted'",
   "expected": "held; Q = 194,532 J (46.5 g TNT); force 555,388 N; Earth Δv = 1.40124e-21 m/s (bounce 2.80248e-21); 1 mm takes 7.137e17 s = 1.64× the age of the universe; day change 7.86e-19 s (run-up cancels); rock rT = 0.1027 m, rC = 0.0210 m, concrete tear 1.85×; quake −2.34 (no noticeable quake); bounce: Ollie back at 46.4916 m/s, slides 127.31 m",
   "reasoning": "Target m_B + M_E: Q ≈ K_A = ½ × 180 × 2,161.47 = 194,532. Δv = 8,368.48/5.9722e24. 1e-3/1.40124e-21 = 7.137e17 s ÷ 4.3508e17 = 1.64. rT = √(555,388/(2π × 8.38e6)) = √0.010548. Tear = 555,388/(1.5e6 × 0.2).",
   "tolerance": "1e-4 relative"
  },
  {
   "name": "C3 claws in granite hold",
   "inputs": "Both on granite, Ollie friction, Rex 'braced'",
   "expected": "v0 = 42.4408 m/s; H = 889,644 N (his strength; claws alone 7.2009e6 N); F_held = 462,823 N ≤ H → held; Q = 162,110 J; Earth Δv = 1.27915e-21 m/s",
   "reasoning": "Granite μ 0.5: thrust 882.6 N → √(2 × 882.6/0.98) = 42.44 m/s. Claws R = 0.5 × 1,765.2 + 36 MPa × 0.2 m² = 7.2009e6; standing H = min(889,644, R). F_held = ½ × 180 × 1,801.22/0.350263.",
   "tolerance": "1e-4 relative"
  },
  {
   "name": "C4 claws in concrete: partly held",
   "inputs": "Default but Rex 'braced' on concrete",
   "expected": "moved (partial); H = 301,059 N; splat F = 428,223 N; V = 10.645 m/s; Q = 149,991 J; Rex moves 0.0802 m during the hit + 0.0675 m slide = 0.148 m; elasticUpper = true",
   "reasoning": "F = 90 × (3,085.48 + 301,059/180 = 1,672.55) = 428,223. V = 46.4916 − 428,223 × 0.0150678/180 = 10.645. x_B = ½ × (127,164/180) × 0.0150678² = 0.0802. Energy check: 20,397 + 149,991 + 301,059 × 0.0802 = 194,532 = initial KE.",
   "tolerance": "1e-3 relative"
  },
  {
   "name": "C5 Ollie jumps and lands on Rex (concrete)",
   "inputs": "Default, source 'jump'",
   "expected": "v0 = 32.7222 m/s (jump apex 57.8 m); H = 223,235 N (bearing); F_held = 275,126 N → moved (partial); splat F = 249,180 N, V = 3.0858 m/s, Q = 87,279 J; driven 0.0406 m into the slab (0.0330 during the hit + 0.0076 after)",
   "reasoning": "Bearing = 2.5e6 × 0.09 − 1,765.2. F = 90 × (1,070.74/0.700527 + 223,235/180) = 90 × 2,768.67. τ = 0.70053/32.7222 = 0.021408. penetrationDepth(360, 0.09, 3.0858, 2.5e6, 2400) = 0.8333 × ln(1.009141) = 0.0076.",
   "tolerance": "1e-3 relative"
  },
  {
   "name": "C6 stomp-launch landing is held by the ground",
   "inputs": "Default, source 'stomp'",
   "expected": "v0 = 6.4664 m/s; held (F_held 10,744 N < 223,235 N); Q = 3,763 J; Earth Δv = 1.949e-22 m/s",
   "reasoning": "½ × 180 × 6.4664² / 0.350263 = 10,744.",
   "tolerance": "1e-3 relative"
  },
  {
   "name": "C7 set speed 0.9c into standing Rex",
   "inputs": "collide(cO, cR, {source: 'set', gb: 2.0647416})",
   "expected": "moved; Q = 9.16899e18 J (2.19 Gt TNT); splat V = 1.87907e8 m/s (0.6268c), no slide (relativistic); bounce Ollie 0, Rex 0.9c; soft F = 2.6177e19 N over 1.658 ns; ceiling 3.878e19 N over 1.119 ns; matter bar hidden (supersonic); air run-up ≈ 3.75e18 J (rough)",
   "reasoning": "Footing 1,059 N is negligible against 1e19 N, so the free hit applies. Light ceiling: γ*β* = p*/(m_A c) = 4.3408e10/(180c) = 0.80443 → γ* = 1.28339, β* = 0.62680 → t = 0.700527/(1.28339 × c × 1.6268). Air = 0.49 × (2.06474c)² × 20.",
   "tolerance": "1e-4 relative"
  },
  {
   "name": "C8 set speed 0.9c into bolted Rex",
   "inputs": "As C7, Rex bolted",
   "expected": "held; Q = 2.09364e19 J (5.00 Gt TNT); Earth Δv = 1.8656e-14 m/s (kept: set speed); day change 1.046e-11 s; quake upper bound 7.01; rock beyond crust (rT = 1,065 km), not planet-scale",
   "reasoning": "Q ≈ K_A = (2.2942 − 1) × 180c² = 2.0936e19. M = (log10(2.0936e15) − 4.8)/1.5 = 7.01. ΔT = 86,164.2² × 1.11419e11/(2π × 0.3308 × 5.9722e24 × 6.371e6).",
   "tolerance": "1e-4 relative"
  },
  {
   "name": "C9/C10 light speed: unstoppable vs paradox",
   "inputs": "Set speed ∞ into bolted Rex; set speed ∞ into Rex with colImm",
   "expected": "C9 outcome 'unstoppable', Q = ∞, Earth to light speed, rock planet = true. C10 outcome 'paradox' with no numbers.",
   "reasoning": "Unlimited momentum into a finite mass, Earth included, gives light speed and unbounded energy. Into an infinite mass it gives ∞/∞.",
   "tolerance": "exact"
  },
  {
   "name": "C11 sprint into a truly immovable Rex",
   "inputs": "Default, colImm",
   "expected": "outcome 'immovable'; Q = 194,532 J; splat Ollie stops; bounce Ollie back at 46.4916 m/s; no Earth tile",
   "reasoning": "m_T = ∞ gives Q = K_A and v_A' = −v.",
   "tolerance": "1e-6"
  },
  {
   "name": "C12 normal Ollie sprints at neutron-star-dense Rex (comic ground)",
   "inputs": "Rex m = 4.12e17 × 0.18 = 7.416e16 kg, groundHolds true; Ollie default",
   "expected": "gravBoost; fall.vRel = 3,692.73 m/s, vRel = 3,693.03 m/s; Rex lying, H = 4.3636e17 N; held; Q = 1.2275e9 J (293 kg TNT); bound = true (bounce slide null); Earth Δv = 1.113e-19 m/s; gNear = 1.8155e9 N",
   "reasoning": "μ_G = G(m_A + m_B) = 4.94966e6; v_f² = 2 × 4.94966e6 × (1/0.700527 − 1/20) = 1.36363e7. v_rel = √(2,161.47 + 1.36363e7). He can't stand: 1.4 × 889,644 ≪ 7.27e17 N, so R = 0.6 × 7.416e16 × 9.80665. Q ≈ ½ × 180 × 3,693.03².",
   "tolerance": "1e-4 relative"
  },
  {
   "name": "C13 both neutron-star dense (comic ground), set 1 m/s",
   "inputs": "Both m = 7.416e16 kg, groundHolds; set gb = 1/c",
   "expected": "dragged; vRel = 5,222.3 m/s; splat Q = 5.0563e23 J (1.20× the 4.2e23 J dinosaur-killing asteroid); pair V = 0.5 m/s, slides 0.0212 m; bounce speeds ±2,611 m/s, slides null (bound)",
   "reasoning": "Mutual gravity at contact 7.48e23 N ≫ friction 4.36e17 N, so both fall. Q = G m² (1/0.700527 − 1/20) + ½μ(1)² = 6.6743e-11 × 5.4997e33 × 1.377497 = 5.0563e23. CM speed = m_A × 1/(2m) = 0.5.",
   "tolerance": "1e-4 relative"
  },
  {
   "name": "C14 neutron-star Ollie can't sprint",
   "inputs": "Ollie m = 7.416e16 kg, sprint",
   "expected": "noCharge 'cantSprint'",
   "reasoning": "sprint() returns cantStand when F ≤ W.",
   "tolerance": "exact"
  },
  {
   "name": "C15 real muscle",
   "inputs": "Default with mode 'real'",
   "expected": "v0 = 17.9 m/s (leg cap); Q = 14,604 J; V = 8.835 m/s; Rex moves 6.75 m; force 41,694 N over 39.1 ms",
   "reasoning": "Real-muscle sprint cap = 17.9 × s. Partial: F = 90 × (320.41/0.700527 + 5.884) = 41,694.",
   "tolerance": "1e-3 relative"
  },
  {
   "name": "C16/C17 infinite strength",
   "inputs": "Both F = ∞, friction; then both F = ∞ and bolted",
   "expected": "C16 identical to C1 (46.49 m/s, grip-limited). C17 'unstoppable', runUpCancels true, so Earth's net motion is printed as undefined.",
   "reasoning": "Thrust = min(∞, friction cap) = 1,059.12 N. Bolted thrust = ∞ → uTop = ∞ → p = ∞.",
   "tolerance": "exact / 1e-6"
  },
  {
   "name": "C18 relativistic sprint with finite strength",
   "inputs": "Ollie bolted, dial 1e20 kg; Rex bolted",
   "expected": "u = 6.8266e9 m/s (γβ = 22.77, leg-limited); p = 1.22880e12 kg m/s; Q = 3.5256e20 J (84 Gt TNT); held; Earth Δv = 2.058e-13 m/s; quake upper bound 7.83",
   "reasoning": "uDrag = √(2 × 9.80665e20/0.98) = 4.4737e10. uLeg = 12.42 × √((9.80665e20 − 1,765.2)/3,246.0) = 6.8266e9, so the leg cap is smaller. γ = √(1 + 22.77²) = 22.79; K = 21.79 × 180c².",
   "tolerance": "1e-3 relative"
  },
  {
   "name": "C19/C20 set speeds 11.2 km/s and 0",
   "inputs": "Default, set gb = 11200/c; set gb = 0",
   "expected": "Q = 5.6448e9 J (1.35 t TNT), V = 5,600 m/s, slide 3,266 m; bounce Rex 11,200 m/s, slide 2,015 m. gb = 0 → noCharge 'zero'",
   "reasoning": "½ × 90 × 11,200² = 5.6448e9. Footing is negligible.",
   "tolerance": "1e-3 relative"
  },
  {
   "name": "C21/C22 unequal bodies",
   "inputs": "Rex 50 m at 1,000 kg/m³ (2.8125e6 kg); Rex at 30 kg/m³ (5.4 kg)",
   "expected": "50 m: lying, H = 1.65487e7 N, s = 0.350263 m (smaller depth), held, Q = 194,532 J. Plush: H = 31.77 N, splat V = 45.135 m/s, Q = 5,677 J, moved 123.3 m; bounce Rex 90.27 m/s (slide 26.68 m), Ollie 43.78 m/s",
   "reasoning": "Squash uses min(L_A, L_B). Plush μ = 5.2426 kg; Q ≈ ½μv² + footing term; bounce v_T = 2 × 180/185.4 × 46.49 = 90.27.",
   "tolerance": "1e-3 relative"
  },
  {
   "name": "C23/C24 gates",
   "inputs": "Rex at 1.31e27 kg/m³ (black hole), Rex m = 1e22 kg",
   "expected": "{planetScale} for both (the planet gate runs first on mass; isBlackHole is checked first in code, so expect blackHole when isBlackHole is true)",
   "reasoning": "1e22 > 1e-3 M_E = 5.97e21. At 2 m the black-hole density is 1.3102e27 kg/m³: just above it (1.31e27 × 0.18 = 2.358e26 kg), isBlackHole may round either way. Use 2e27 kg/m³ to test the blackHole branch.",
   "tolerance": "exact"
  },
  {
   "name": "S1-S4 static push basics",
   "inputs": "Default both friction; Rex braced; Ollie bolted vs Rex friction; both bolted",
   "expected": "S1 stalemate at 1,059.12 N (both footing-limited, pusherSlips true). S2 objectHolds, contact 1,059.12 N, H = 301,059. S3 forceWins, net 888,585 N. S4 objectHolds, contact 889,644 N, rock rT = 0.12999 m, rC = 0.02661 m, tear 2.9655×, no crack-through",
   "reasoning": "D_A = min(889,644, 1,059.12). The bolted pusher's D = F. rT = √(889,644/5.26531e7) = √0.016896. Tear = 889,644/300,000, matching the contest design's 2.97×.",
   "tolerance": "1e-6 relative"
  },
  {
   "name": "S5/S14/S6 rock thresholds",
   "inputs": "Both bolted at dial 1e10 kg; 1e16 kg; 5.9722e24 kg",
   "expected": "1e10: rT = 43.16 m, rC = 8.834 m, crackThrough. 1e16: rT = 43,157 m > 41,100 → beyondCrust. 5.9722e24: C = 5.8567e25 N ≥ 1.0997e25 → planet",
   "reasoning": "C = dial × 9.80665. Crack-through threshold 5.2653e7 N (dial 5.37e6 kg); beyond-crust threshold 8.894e16 N (dial 9.07e15 kg).",
   "tolerance": "1e-4 relative"
  },
  {
   "name": "S7-S10 infinite strength in the push",
   "inputs": "Both ∞ + bolted + comic ground; both ∞ + bolted + real ground; both ∞ on friction; Ollie ∞ bolted vs Rex friction",
   "expected": "paradox (contact NaN); rockGives; stalemate at 1,059.12 N; forceWins with DA = ∞ (contact 1,059.12, net ∞)",
   "reasoning": "∞ − ∞ is undefined. Real rock can't carry unlimited force. Footing caps infinite strength. ∞ against finite gives a light-speed shove (contest shove).",
   "tolerance": "exact"
  },
  {
   "name": "S11-S13 density and strength limits",
   "inputs": "Normal Ollie vs neutron-star Rex (comic ground); strongmen (511 kg) with Rex at 300 kg; bolted strongman Ollie vs braced strongman Rex",
   "expected": "S11 objectHolds, H = 4.3636e17 N (lying), gravityLock true (gravF 1.8155e9 N). S12 objectHolds: Rex holds 1,765.2 N vs Ollie's 1,059.12. S13 stalemate at 5,011.2 N (Rex strength-limited; claws could hold 301,059)",
   "reasoning": "Heavier body means more friction. Standing hold = min(F, R).",
   "tolerance": "1e-6 relative"
  },
  {
   "name": "F_HALVES and the human-restitution energy range",
   "inputs": "3 G M_E² / (16 R_E²); (1 − e²) for e = 0.1 and 0.5",
   "expected": "1.09967e25 N; 0.99 and 0.75",
   "reasoning": "Monte Carlo of the hemisphere attraction gave 0.1864 vs the analytic 0.1875 (G = M = R = 1).",
   "tolerance": "1e-4 relative"
  },
  {
   "name": "Render sweep",
   "inputs": "Both modes × every source × anchor ∈ {friction, braced, bolted} × groundHolds × colImm × colInf × strength ∈ {511 kg, Hulk, Earth-bench, ∞} × density ∈ {30, 1000, 22587, 2.77e9, 4.12e17}",
   "expected": "No exceptions; every displayed number is finite, or a defined '∞', 'unbounded' or 'undefined' label; no 'NaN' text",
   "reasoning": "Guards in E10-E13.",
   "tolerance": "exact"
  }
 ],
 "open_questions": "1. The holder's strength cap. In a collision, should a standing holder resist with min(strength, footing), the contest design's rule used here, or with footing alone? His body is indestructible; folding legs only lengthen the squash. Using footing alone changes only rare cases, such as claws in granite with strength below 7.2 MN.\n2. Function names. The contest design's pushMatch/shove (walk-out and shove-off details for a Push 'force wins') and the density design's groundUnderWeight/fallsThrough are referenced by name. Confirm the final names when they are implemented. collide-ref.js has fallbacks.\n3. Squash setting. Should the owner get a 'How squishy' control (plush / stiffest real material / light-speed stiff) instead of the fixed 25% squash plus the chart? Only the force and time change, and the 'does he hold' test.\n4. Ollie's horns. They are mentioned only to say they don't change momentum or energy. A horn-tip pressure tile would need a horn tip area, which would be invented canon, so it is left out.\n5. Run-up air heating in relativistic runs is a rough drag-times-distance estimate. If the audit wants it sourced or removed, drop that bullet; nothing else depends on it.\n6. The partly-held bounce bound is the free result (an upper bound on his speed). A spring-plus-friction solution exists, but piecewise. It isn't worth it unless the audit flags it."
}
```

</details>

<details>
<summary>Subagent `check:catch` (rex-ollie-design, 2026-10-09 23:48:54 UTC): The design is not ready to ship. It's careful and mostly well sourced, and much of its arithmetic holds up. Returned fact_checks: 18 (e.g. catch_anthro_ansur2_reach_chest; catch_stroke_fraction), physics_issues: 17, missing: 14, test_corrections: 12.</summary>

Workflow run `wf_173e4620-19f`, phase `Check`, agent `abedf1939d7dbd525`. Prompt, verbatim:

```text
Project: "Rex Super-Strength Lab", a single-page physics simulator for Rex, an indestructible, tireless plush kaiju-dinosaur (default 2 m tall, 180 kg). A strength dial sets his maximum force as a lift capacity from 10 kg to 1e34 kg, plus infinity. Moves today: lift, throw, jump, stomp, punch, clap, sprint, pull. Two muscle models: "comic" (fixed share of strength at any speed) and "real" (Hill force-velocity curve; limb speed caps). Settings: ground surface (sand, gravel, soft clay, stiff clay, asphalt, concrete, lake ice, steel deck, granite), "comic ground" (never breaks), anchoring (friction / claws dug in / bolted to the planet), height (isometric scaling) and mass.
Read these before designing (do NOT edit anything under /home/user/dino-strength-sim; put scratch files in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo/):
- /home/user/dino-strength-sim/src/engine.js: the physics engine (SI units; relativistic momentum helpers momentumToV/momentumToKE/vToMomentum; pushApart two-body push in comic or Hill mode; anchorCapacity footing model; fly() RK4 flight over a round Earth with drag and Kepler arcs; craterDiameter Collins et al.; blastRadius Kinney-Graham; seismicMagnitude; stagnationT; lift/throw/jump/stomp/punch/clap/sprint/pull).
- /home/user/dino-strength-sim/src/app.html (the bay* functions show how results become page text), /home/user/dino-strength-sim/src/static-data.js (assumptions text), /home/user/dino-strength-sim/build-data.py (how sourced facts become the sources table).
- Fact format used by the project: /home/user/dino-strength-sim/research/final-environment.json ("facts" entries with key, category, label, status in {verified, canon_stated, reported, estimate, claimed, disputed, not_quantified}, value_si, unit_si, low_si, high_si, display, sources [{title, url}], notes).
NEW FEATURES being added (the owner's request): (1) "density and weight, and the effect that would have on the environment, like if Rex were the density of a neutron star"; (2) Rex's boyfriend Ollie, "equally as overpowered and indestructible", for two-person simulations: arm wrestling, regular wrestling, games of catch, unstoppable force vs immovable object. Ollie, from the owner's image, is a plush bull-man: horns, nose ring, leather vest, cargo pants, laced boots (no visible claws), about Rex's height and build. Do not invent other canon for him; default him to Rex's size, mass and strength, with his own adjustable settings.
The owner is a professional critic: factual accuracy and honest labelling come first. Every number must be either sourced (fetch the source and confirm the number on the page; give the exact URL) or labelled an estimate with the reasoning. Prefer primary or authoritative sources (journals, textbooks, NASA/ESA, standards bodies). Never present speculation as fact; say what the model ignores. The page's tone is plain, specific and readable for a general audience (short sentences, no jargon without a gloss).

Adversarially check this design for the area "Game of catch". Default to suspicion. (1) For EVERY fact: fetch the source URL and confirm the number and wording; mark ok=false with the correct value and a better source if wrong, unsupported, or mislabelled (e.g. an estimate called verified). (2) Re-derive every equation and recompute every test case independently (write scripts in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo/catch-check/); report physics errors, wrong regimes, missing forces or effects, double counting, unit slips, and anything that would show a reader a false or misleading claim, with concrete fixes. (3) List what is missing for an honest, complete simulation of the brief. (4) Check that the page text never overstates certainty.

BRIEF:
Design a GAME OF CATCH between Rex and Ollie at a chosen distance (e.g. 10 m to across the planet) with any object from the existing object list (and optionally the other partner as the "ball"). Reuse the engine's throw (throwObject) and flight (fly) for the pitch: the thrower aims so the object reaches the catcher (solve the launch angle for the distance if reachable, flat throw vs lob; note drag). Then the catch: the catcher's hands give over a catch stroke (source human catching hand travel/time, e.g. baseball mitt studies) so the catch force F = p/t or m v^2 / (2 d) (relativistic where needed), whether his strength can stop it within the stroke, his recoil and footing slide (reuse anchorCapacity and two-body momentum), and what the object suffers (crush strength already in the object data; heating). Find the speed and distance limits: beyond about 1% of light speed the object turns into a fireball in the air before arriving (the engine already treats relativistic throws as fireballs; quantify the distance over which it sweeps up its own mass of air), supersonic heating, objects that escape Earth or orbit before arriving, flight time over long distances (round trip for a "game"). If the catcher misses, what the impact does (existing crater/quake/blast). Include infinite strength, unequal strengths, and dense partners (the ball must climb out of the thrower's gravity and falls into the catcher's: patched conic; the density area supplies G m).

DESIGN:
{
 "area": "Game of catch (Rex and Ollie)",
 "summary": "Rex throws an object (any throwable object, or his partner tossed straight up) to Ollie at a chosen distance, from 5 m to the far side of the planet (20,015 km). Ollie catches it, then throws it back. Each throw is aimed on purpose. The \"Gentle lob\" uses the least launch speed that reaches him; the \"Fastball\" uses full strength along the flattest path that reaches his hands. Both use the engine's existing throw model and a lightly extended flight model (stop at the catcher's hand height or at his distance; nose heating added up along the way). The catch is the gentlest steady force that stops the object while his hands give 0.3 × his height (60 cm at 2 m), from full reach to his chest. If the stopping force is more than his footing holds, he slides. If it is more than his strength, the object shoves his hands back and slams into his chest. The main physics shows up at the extremes. Air, not strength, limits light objects: a baseball never gets much past 470 m at default strength, and no survivable speed gets it to 1 km. A 2 m, 180 kg Rex catching his own 629 m/s fastball 10 m away feels 34 kN (86% of a home-run hit's squeeze on the ball). At neutron-star density the ball must leave the thrower at 4.3 km/s just to climb out of his gravity, and it falls into a dense catcher's hands at 2.2 km/s even from a 10 m/s lob. Above 1% of light speed the object becomes plasma within m/(ρA) of the hand, so whether Ollie is hit by a ball, by plasma or by a blast depends on that distance. A working reference implementation with passing tests is at /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo/catch/ (flyto.js, catch2.js, tests.js).",
 "facts": [
  {
   "key": "catch_anthro_ansur2_reach_chest",
   "category": "catch",
   "label": "US Army men (ANSUR II): thumbtip reach, chest depth and stature, means",
   "status": "verified",
   "value_si": 0.8119,
   "unit_si": "m",
   "display": "Thumbtip reach 81.19 cm (SD 4.37), chest depth 25.38 cm (SD 2.62), stature 175.62 cm (SD 6.86); 4,082 men",
   "sources": [
    {
     "title": "Gordon et al. (2014), 2012 Anthropometric Survey of U.S. Army Personnel: Methods and Summary Statistics, NATICK/TR-15/007: (80) Thumbtip Reach pp. 203-204, (25) Chest Depth pp. 93-94, (75) Stature pp. 193-194",
     "url": "https://tools.openlab.psu.edu/publicData/ANSURII-TR15-007.pdf"
    }
   ],
   "notes": "Thumbtip reach is the horizontal distance from a back wall (shoulders against it) to the tip of the thumb, with the arm stretched forward. Chest depth is the front-to-back depth at nipple level. Read from the PDF's summary tables (male columns)."
  },
  {
   "key": "catch_stroke_fraction",
   "category": "catch",
   "label": "Catch stroke: how far his hands give while stopping the object",
   "status": "estimate",
   "value_si": 0.3,
   "unit_si": "x height",
   "low_si": 0.05,
   "high_si": 0.318,
   "display": "0.30 × height (60 cm for a 2 m Rex or Ollie)",
   "sources": [
    {
     "title": "ANSUR II (Gordon et al. 2014), thumbtip reach and chest depth",
     "url": "https://tools.openlab.psu.edu/publicData/ANSURII-TR15-007.pdf"
    }
   ],
   "notes": "Our estimate. From full reach to touching the chest, a man's hand travels (81.19 - 25.38) / 175.62 = 0.318 of his height. We round down to 0.30 to leave room for the object between hands and chest. Rex and Ollie are assumed to have human-proportioned arms. We found no measured study of how far hands give in a catch (searches turned up only textbook examples). Real catchers with mitts stop a ball in a few centimetres, so 0.3 × height is the softest catch a body this size could make, not a typical one. Stepping back is not modelled."
  },
  {
   "key": "catch_eccentric_force_ratio",
   "category": "catch",
   "label": "Muscle force while being stretched (eccentric) compared with holding still (isometric)",
   "status": "verified",
   "value_si": 1.2,
   "unit_si": "ratio",
   "low_si": 1.2,
   "high_si": 1.8,
   "display": "Plateau near 1.8× maximum isometric force in isolated muscle; about 1.2× in living people",
   "sources": [
    {
     "title": "Franchi, Reeves & Narici (2017), Skeletal Muscle Remodeling in Response to Eccentric vs. Concentric Loading, Front. Physiol. 8:447",
     "url": "https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2017.00447/full"
    }
   ],
   "notes": "Quoted: the force 'rises until it reaches a plateau at a value close to 1.8 times the maximum isometric force' (in vitro); in vivo 'about 1.2 times the maximum isometric force'. The sim caps catching force at full strength (1.0×) in both muscle modes, so it slightly understates how hard a real-muscle catch can be."
  },
  {
   "key": "catch_force_cap_model",
   "category": "catch",
   "label": "Most force he can stop an object with",
   "status": "estimate",
   "value_si": 1,
   "unit_si": "x dial strength",
   "display": "His full strength (the dial), same as holding a weight",
   "sources": [
    {
     "title": "Franchi et al. (2017) on eccentric force",
     "url": "https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2017.00447/full"
    }
   ],
   "notes": "Modelling choice. Catching is resisting a load, like holding one, so the cap is the dial value (two arms, 2 × 52.3% in the throw model, capped at 100%). The eccentric bonus (about 1.2× in living people) is left out."
  },
  {
   "key": "sutton_graves_air",
   "category": "heating",
   "label": "Sutton–Graves stagnation-point convective heating, Earth air",
   "status": "verified",
   "value_si": 0.00017415,
   "unit_si": "kg^0.5/m (q in W/m^2 = k sqrt(rho/r_n) v^3)",
   "display": "q = 1.74 × 10⁻⁴ √(ρ/rₙ) v³ W/m²; original form q = K √(pₛ/rₙ)(hₛ − h_w), K = 0.1113 kg s⁻¹ m⁻³ᐟ² atm⁻¹ᐟ² for air",
   "sources": [
    {
     "title": "Sutton & Graves (1971), A General Stagnation-Point Convective-Heating Equation for Arbitrary Gas Mixtures, NASA TR R-376 (Table II, air: K = 0.1113)",
     "url": "https://ntrs.nasa.gov/api/citations/19720003329/downloads/19720003329.pdf"
    },
    {
     "title": "Wikipedia: Planar reentry equations (k = 1.74153 × 10⁻⁴ for Earth, W/m²)",
     "url": "https://en.wikipedia.org/wiki/Planar_reentry_equations"
    }
   ],
   "notes": "Fitted for enthalpies of 2.3-116.2 MJ/kg (about 2.1-15 km/s), pressures of 0.001-100 atm and wall temperatures of 300 and 1,111 K, with radiation neglected (all stated in the report). Converting K with pₛ ≈ ρv² and hₛ ≈ v²/2 gives 0.1113 / (2 √101,325) = 1.748 × 10⁻⁴, within 0.4% of the 1.7415 × 10⁻⁴ used here. At sea level the stagnation pressure passes 100 atm at √(100 × 101,325 / 1.225) = 2,876 m/s, so heating above that is an extrapolation and the page flags it."
  },
  {
   "key": "shock_layer_radiation_onset",
   "category": "heating",
   "label": "When glowing shock-layer air starts adding heat (radiation)",
   "status": "verified",
   "value_si": 11000,
   "unit_si": "m/s",
   "low_si": 11000,
   "high_si": 15000,
   "display": "Negligible at orbital entry speed; secondary at lunar return (~11 km/s); rises rapidly above 12 km/s and is over half the heat load at 15 km/s",
   "sources": [
    {
     "title": "NASA TM X-58091 (1972), Radiative Heating to the Apollo Command Module: Engineering Prediction and Flight Measurement",
     "url": "https://ntrs.nasa.gov/api/citations/19720017314/downloads/19720017314.pdf"
    },
    {
     "title": "Cornette & Sullivan (1971), Instrumentation Requirements for a Flight Reentry Heating Experiment at Interplanetary Return Velocity, NASA TN D-6265",
     "url": "https://ntrs.nasa.gov/api/citations/19710018541/downloads/19710018541.pdf"
    }
   ],
   "notes": "These are entry conditions at high altitude. Radiation grows faster with air density than convection does, so at sea level it matters at lower speeds. The sim's heating, which leaves radiation out, is therefore a lower bound above 11 km/s, and the page says so."
  },
  {
   "key": "baseball_terminal_speed_adair",
   "category": "objects",
   "label": "Baseball: speed at which drag equals its weight (terminal speed)",
   "status": "verified",
   "value_si": 42,
   "unit_si": "m/s",
   "display": "About 95 mph (42 m/s)",
   "sources": [
    {
     "title": "Adair (1995), The physics of baseball, Physics Today 48(5): 26-31, p. 27",
     "url": "https://aip.brightspotcdn.com/PTO.v48.i5.26_1.online.pdf"
    }
   ],
   "notes": "Quoted: 'at about 95 mph (42 m/s), the drag force is equal to the force of gravity.' The sim's baseball (Cd 0.35, 42.7 cm²) gives √(2mg/(ρ Cd A)) = 39.5 m/s, 6% lower, and its long throws come down at 38-39 m/s. This is a check, not an input."
  },
  {
   "key": "baseball_bat_collision_force",
   "category": "objects",
   "label": "Peak squeeze on a baseball in a home-run bat collision",
   "status": "verified",
   "value_si": 40000,
   "unit_si": "N",
   "display": "About 9,000 lb (40,000 N); collision about 1 ms, most momentum transfer in 0.6 ms",
   "sources": [
    {
     "title": "Adair (1995), The physics of baseball, Physics Today 48(5), p. 31",
     "url": "https://aip.brightspotcdn.com/PTO.v48.i5.26_1.online.pdf"
    }
   ],
   "notes": "Baseballs survive this, so it is a known-safe level, not a breaking strength. The object data has no crush figure for the baseball. The page compares the catch force with this number and makes no claim above it."
  },
  {
   "key": "iron_melting_heats",
   "category": "heating",
   "label": "Iron: melting point, heat of fusion, heat capacity",
   "status": "verified",
   "value_si": 1811,
   "unit_si": "K",
   "display": "Melts at 1,538 °C; heat of fusion 13.81 kJ/mol (247 kJ/kg); molar heat capacity 25.10 J/(mol·K) (0.449 kJ/kg·K)",
   "sources": [
    {
     "title": "Wikipedia: Iron (infobox)",
     "url": "https://en.wikipedia.org/wiki/Iron"
    }
   ],
   "notes": "Per-kg values use 55.845 g/mol. Steels melt a little lower (roughly 1,400-1,500 °C). Damage threshold for 'steel' objects."
  },
  {
   "key": "aluminium_melting_heats",
   "category": "heating",
   "label": "Aluminium: melting point, heat of fusion, heat capacity",
   "status": "verified",
   "value_si": 933.47,
   "unit_si": "K",
   "display": "Melts at 660.32 °C; heat of fusion 10.71 kJ/mol (397 kJ/kg); 24.20 J/(mol·K) (0.897 kJ/kg·K)",
   "sources": [
    {
     "title": "Wikipedia: Aluminium (infobox)",
     "url": "https://en.wikipedia.org/wiki/Aluminium"
    }
   ],
   "notes": "Damage threshold for aircraft and the shuttle stack. Alloys melt somewhat lower."
  },
  {
   "key": "copper_melting_heats",
   "category": "heating",
   "label": "Copper: melting point, heat of fusion, heat capacity",
   "status": "verified",
   "value_si": 1357.77,
   "unit_si": "K",
   "display": "Melts at 1,084.62 °C; heat of fusion 13.26 kJ/mol (209 kJ/kg); 24.44 J/(mol·K) (0.385 kJ/kg·K)",
   "sources": [
    {
     "title": "Wikipedia: Copper (infobox)",
     "url": "https://en.wikipedia.org/wiki/Copper"
    }
   ],
   "notes": "Damage threshold for the Statue of Liberty (copper skin)."
  },
  {
   "key": "wood_char_base_temperature",
   "category": "heating",
   "label": "Wood: temperature at the base of the char layer",
   "status": "verified",
   "value_si": 573,
   "unit_si": "K",
   "display": "Generally taken to be 300 °C (550 °F ≈ 288 °C)",
   "sources": [
    {
     "title": "White & Dietenberger (2010), Fire Safety of Wood Construction, Wood Handbook ch. 18, USDA FPL-GTR-190",
     "url": "https://research.fs.usda.gov/download/treesearch/37415.pdf"
    }
   ],
   "notes": "Quoted: 'The temperature at the base of the char layer is generally taken to be 300 °C or 550 °F (288 °C).' Used for every 'organic' object (piano wood; we assume the same for the baseball's leather and yarn and the bowling ball's resin, which we did not source separately)."
  },
  {
   "key": "limestone_calcination",
   "category": "heating",
   "label": "Limestone breaks down to quicklime",
   "status": "verified",
   "value_si": 1098,
   "unit_si": "K",
   "display": "Above 825 °C",
   "sources": [
    {
     "title": "Wikipedia: Calcium oxide",
     "url": "https://en.wikipedia.org/wiki/Calcium_oxide"
    }
   ],
   "notes": "Quoted: 'This is accomplished by heating the material to above 825 °C.' Damage threshold for the pyramid and the Empire State Building's limestone facade."
  },
  {
   "key": "heat_to_melt_per_kg",
   "category": "heating",
   "label": "Heat needed to melt or char 1 kg of an object's skin",
   "status": "estimate",
   "value_si": 1000000,
   "unit_si": "J/kg",
   "low_si": 500000,
   "high_si": 1400000,
   "display": "About 1 MJ/kg for every object",
   "sources": [
    {
     "title": "Wikipedia: Iron",
     "url": "https://en.wikipedia.org/wiki/Iron"
    },
    {
     "title": "Wikipedia: Aluminium",
     "url": "https://en.wikipedia.org/wiki/Aluminium"
    }
   ],
   "notes": "Our estimate. Heating from 15 °C to melting plus the heat of fusion, at room-temperature heat capacity: iron 0.449 × 1,523 + 247 = 931 kJ/kg; aluminium 0.897 × 645 + 397 = 976 kJ/kg; copper 0.385 × 1,070 + 209 = 620 kJ/kg. Heat capacity rises with temperature, so the true values are a bit higher. Wood and stone are taken as the same. Used only for the rough 'share it could melt' upper bound."
  },
  {
   "key": "newton_impact_depth_air",
   "category": "relativistic",
   "label": "Newton's impact-depth rule, used for how far a relativistic object gets through air",
   "status": "estimate",
   "display": "D ≈ L × ρ_object / ρ_target: it stops after pushing aside its own mass of target. In air: sweep = m / (ρ₀ A) (baseball 27.8 m, car 126 m, shot 524 m, tank 1.9 km, pyramid 141 km)",
   "sources": [
    {
     "title": "Wikipedia: Impact depth",
     "url": "https://en.wikipedia.org/wiki/Impact_depth"
    }
   ],
   "notes": "The rule rests only on momentum conservation and is stated for speeds high enough to ignore friction but below the target's speed of sound. At 1% of light speed and above we are far outside that, so the sweep length is an order-of-magnitude scale for where most of the energy goes into the air. The existing Throw tab already uses the same length."
  },
  {
   "key": "air_column_mass",
   "category": "atmosphere",
   "label": "Mass of air above each square metre at sea level",
   "status": "verified",
   "value_si": 10332,
   "unit_si": "kg/m^2",
   "display": "About 1.03 kg per cm² (10.3 t per m²); the engine uses p₀/g = 10,332 kg/m²",
   "sources": [
    {
     "title": "Wikipedia: Atmospheric pressure",
     "url": "https://en.wikipedia.org/wiki/Atmospheric_pressure"
    }
   ],
   "notes": "An object with less mass per frontal area (m/A) than about this, divided by the sine of its climb angle, can't punch through the atmosphere at any survivable speed. That is why a thrown car or baseball has a hard range limit set by air."
  },
  {
   "key": "relativistic_arrival_classes",
   "category": "relativistic",
   "label": "What reaches the catcher above 1% of light speed",
   "status": "estimate",
   "display": "D < 1% of sweep: arrives nearly whole (≥99% of its energy). 1-100%: he is hit by its plasma. Beyond the sweep length: it is a fireball before it reaches him and only the blast does",
   "sources": [
    {
     "title": "Wikipedia: Impact depth",
     "url": "https://en.wikipedia.org/wiki/Impact_depth"
    }
   ],
   "notes": "Our estimate (snowplow picture). Momentum is kept while it scoops up air, so the energy still moving with it is E/(1 + D/sweep). The thermalised share D/sweep sets how fast its vapour spreads sideways, about v√(D/sweep), so over a flight of D it widens by about D√(D/sweep). At D = 1% of sweep that is 10% of D. The 1% cut is a judgement call."
  },
  {
   "key": "earth_radius_rotation",
   "category": "earth",
   "label": "Earth's mean radius and rotation (for the far-side distance and the spin caveat)",
   "status": "verified",
   "value_si": 6371000,
   "unit_si": "m",
   "display": "Volumetric mean radius 6,371.000 km (so the far side of the planet is π × 6,371 = 20,015 km away along the surface); sidereal rotation 23.9345 h; equator moves at 465.1 m/s",
   "sources": [
    {
     "title": "NASA NSSDC Earth Fact Sheet",
     "url": "https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html"
    },
    {
     "title": "Wikipedia: Earth's rotation (465.10 m/s at the equator)",
     "url": "https://en.wikipedia.org/wiki/Earth%27s_rotation"
    }
   ],
   "notes": "The sim's Earth doesn't spin. In a 79-minute antipode throw the ground at the equator moves 465.1 × 4,715 s = 2,190 km, so a real long throw would have to lead Ollie by up to about that much."
  }
 ],
 "inputs": "From the page (app.html):\n- ctxR = ctx(), ctxO = ctxOllie(). Each has F (N, may be Infinity), mode ('comic'|'real'), body (makeBody: H, m, volume, rho, palmArea, frontArea, Cd, releaseHeight = 0.9 H, strokes), surface (shared), groundHolds (comic ground, shared) and anchor (each has his own: friction|braced|bolted).\n- Ball: an object from D.objects with !noThrow (fields m, area, Cd, CdSup, rho, crush?, L?, and a NEW field material), or the partner. Partner-as-ball becomes the object partnerAsObject(body, name) = { id:'partner', name, short:name, m: body.m, area: body.frontArea, Cd: body.Cd, CdSup: 1.75, rho: body.rho, L: body.H, indestructible: true }.\n- D: ground distance between them, m, along the curved surface. Log slider from Dmin = pushStartRadius(thrower) + heldRadius(catcher, obj) + 0.3 × H_catcher + 1 m (about 3.1 m at default size; clamp up to it) to π R_E = 20,015 km. Chips: 10 m, 100 m, 1 km, 100 km, 1,000 km, 10,000 km, 'Other side of the planet' (20,015 km). When the ball is the partner, the same slider becomes 'Toss height' (log, 3 m to 100 km; chips 10 m, 100 m, 1 km).\n- style: 'easy' ('Gentle lob': least launch speed that reaches him) or 'hard' ('Fastball': full strength, flattest path).\n- miss: boolean, 'Show what happens if he misses'.\nNew app state keys and validators: cObj (default 'baseball'; a valid D.objects id with !noThrow, or 'partner'), cLogD (default 1 = 10 m; num(log10 Dmin_floor = 0.5, log10 20,015,000)), cStyle ('easy'|'hard', default 'easy'), cMiss (boolean, default false). Add them to DEFAULTS and VALID.\nEngine values reused: K (g, c, rho0, p0, a0, R_E, GM, G, M_E), eqRadius, isBlackHole, mutualGravity, fallTogether, bodyGravity, groundUnderWeight, planetRegime, heldRadius, selfGravityOn, selfPull (local consts already in engine.js), throwObject/throwOnce, pushApart (via throw), anchorCapacity, fly (extended), stagnationT, cdAt, rhoAt, conicTo, craterDiameter, seismicMagnitude, overpressureAt, blastRadius, keFromV, momentumToV, momentumToKE, vToMomentum.\nNew data: objects.material in {steel, aluminium, copper, organic, stone}. Mapping: baseball, bowling, piano = organic; shot, motorcycle, car, pickup, bus, semi, tank, loco, eiffel, titanic, nimitz, bar511, backlift, desoto, ruyi = steel; cc177, b777, shuttle = aluminium; liberty = copper; esb, pyramid = stone. Also a MATERIALS table: steel {tC 1538, verb 'melt'}, aluminium {660, 'melt'}, copper {1085, 'melt'}, organic {300, 'char'}, stone {825, 'break down'}.",
 "equations": "Notation: T = thrower, C = catcher, m = object mass, A = its frontal area, M = catcher's mass, d = catch stroke, R = his footing limit (anchorCapacity), F_cap = his strength (dial force), g = 9.80665, ρ₀ = 1.225 kg/m³.\n\nE1. Catch stroke: d = 0.3 H_C (0.6 m at 2 m). ANSUR II gives (81.19 − 25.38)/175.62 = 0.318 from full reach to the chest, rounded down. Add strokes.catch = 0.3·H to makeBody.\n\nE2. Aiming over a round Earth with air: the flight is fly() extended with three backward-compatible options.\n (a) hStop: stop when the object comes DOWN through height hStop (the catcher's hands, 0.9 H_C). A flag 'above' starts as h0 ≥ hStop and turns true once it has risen to hStop. Until then the stop surface is the ground, and stopping there sets belowStop. The vacuum shortcut uses conicTo(..., R_E + hStop) when above, and integrates otherwise. Near the stop surface the descending step limit uses height above hStop: dt ≤ max(0.5, 0.05 (r − R_E − hStop))/v.\n (b) xStop: stop when the ground distance R_E·|φ| reaches xStop (interpolate within the step). Report hAtX, vAtX and angleAtXDeg (positive = descending). If a space (Kepler) jump carries it past xStop, set crossedX with hAtX = ∞ (it passes high overhead).\n (c) Rn (nose radius, √(A/π)): add up Sutton–Graves heating, q = k √(ρ(h)/Rn) v³ with k = 1.7415×10⁻⁴, as heatLoad += q·dt (J/m²). Also keep qMax.\n With hStop = 0 and no xStop the result is identical to today's fly() (test T1).\n\nE3. Gentle lob (aimEasy): v_E(θ) = least speed whose flight (hStop = hand height of C) comes down at range ≥ D. Bisect on ln v in [1 mm/s, 0.999 × 0.01c]; an overshoot (orbit, escape or time-out) counts as reaching. Then minimise over θ: scan 5, 15, …, 75°, then golden-section to 0.1°. It doesn't depend on strength, so cache by (object, D, h0, hStop). Check: in a vacuum on flat ground, v = √(gD) at 45° (9.903 m/s for 10 m); the sim gives 10.16 m/s at 45.1° because of drag.\n\nE4. Fastball (aimHard): v(θ) = the thrower's full-strength release speed. Find the smallest θ in [−80°, 89°] (it may aim downward) whose flight, with xStop = D, passes ground distance D at or above C's hand height. Scan a grid, then bisect to 10⁻⁶ relative. If any grid angle gives v ≥ 0.01c it is a fireball (E10). If a flight escapes or orbits before any angle reaches D, report 'overshoots'. If no angle reaches D, report 'too weak'. The flight reported is the xStop flight; arrival speed is vAtX and the angle max(0, angleAtXDeg).\n\nE5. Release speed versus angle (releaseTable): v(θ) = throwObject(ctxT, obj, θ).v (canMove, else 0) at θ = 0, 7.5, …, 90°, linearly interpolated. Also keep holdLoad = needed and canHold from the 45° throw, and E0 = Eobj at 0°. This uses throwOnce's raw release speed, before the dense-thrower well correction. Add ctx.noFlight to throwOnce so it skips its internal fly() and the crater/impact block (about 10× faster).\n\nE6. Gentle lob too weak: if v_L(θ_easy) > v(θ_easy), compute farthest() at full strength (golden-section on θ of range(v(θ), θ), capped below 0.01c). If farthest ≥ D, use aimHard and flag fullStrength. Otherwise 'too weak', reporting farthest and the easy speed needed with its heat verdict. (Heavy objects need this: a car at 30 m can't be lobbed gently by the default Rex, but his 47.9° full-strength throw at 18.2 m/s gets there.)\n\nE7. Two gravity wells (dense partners). The density area supplies G m. GM_X = G m_X when selfGravityOn(body), else 0. Partners are point masses on the line between them; x is measured from T's centre.\n Φ(x) = −GM_T/x − GM_C/(D − x).\n Release point x₀ = pushStartRadius(T) = max(eqRadius(T), 0.25 H_T). This is the radius throwOnce already uses; factor it into a function.\n C's hands meet it at r_meet = heldRadius(C, obj) + d, and it ends held at r_held = heldRadius(C, obj). So x₁ = max(x₀, D − r_meet).\n Saddle: x* = D/(1 + √(GM_C/GM_T)) if both are dense; x₁ if only T is; x₀ if only C is. Clamp to [x₀, x₁]. Φ is concave, so this is its top.\n barrier = max(0, Φ(x*) − Φ(x₀)), gain = Φ(x₀) − Φ(x₁), inStroke = GM_C (1/r_held − 1/r_meet) (energy per kg C's pull adds while he brings it in).\n Launch: v_L² = v_E² + 2·barrier, where v_E is the air-arc speed from E3/E4 (fastball: v_E = √(v_max² − 2·barrier), and 0 means it falls back).\n Arrival: v_meet² = v_E,arrive² + 2(barrier + gain). This is exact energy bookkeeping with no drag inside the wells, and Earth's potential cancels when the two heights are equal; otherwise it is in v_E,arrive. For a light thrower and dense catcher it reduces to v_meet² = v_arrive² + 2GM_C(1/r_meet − 1/(D − x₀)). For a dense thrower with D → ∞ it reduces to the engine's vInfinity.\n Wells dominate when D < √(GM_T/g) + √(GM_C/g) (their pull beats Earth's over the whole gap). Then the throw is aimed straight at him (θ = 0, arrival angle 0). The gentle speed is v_E = √(gD), a small margin over the hump. Time is t = ∫ dx / √(v_E² + 2(Φ(x*) − Φ(x))) from x₀ to x₁ (4,000-step midpoint rule). Heat load is k √(ρ₀/Rn) ∫ v² dx. Drag is ignored, and flagged if the path is longer than 0.2 × the supersonic e-folding length 2m/(ρ₀ CdSup A).\n\nE8. The catch (catchIt, classical, valid below 1% c where γ − 1 < 5×10⁻⁵):\n v_eff² = v_meet² + 2·inStroke.\n hold = m √(g² + g_self²), with g_self = GM_C/r_held².\n R = anchorCapacity({body: C, surface, theta: γ (arrival angle below horizontal, clamped ≥ 0), anchor, groundHolds, mA: M, mB: m}).R.\n If his feet hold: F_A = m v_eff²/(2d), used when F_A ≤ R. Otherwise he slides while stopping it: F_B = (v_eff²/(2d) + R/M)/(1/m + 1/M), which is the constant force that closes the relative speed over the relative distance d; F_B > R exactly when F_A > R.\n Need = max(F, hold). Clean catch if F_cap ≥ need.\n If not clean: F = F_cap, relative deceleration a_rel = F/m + max(0, F − R)/M, and it hits his chest at v_slam = √(max(0, v_eff² − 2 a_rel d)). The object then sticks to him (perfectly inelastic). If F_cap < hold he can't hold it at all ('cant-hold-it').\n Stroke time: t_s = (√v_eff² − v_slam)/a_rel.\n His speed at the end of the stroke: v_c = (F − R)/M · t_s when F > R. Pair speed afterwards: u = v_c (clean) or (m(v_c + v_slam) + M v_c)/(m + M).\n Slide: during the stroke ½ a_c t_s² cos γ; afterwards (M + m)/(2k) · ln(1 + k u_h²/R_s), where u_h = u cos γ, R_s = anchorCapacity(theta 0, mA: M + m).R (friction or shear) and k = ½ ρ₀ max(Cd_C·frontArea_C, CdSup·A). That is friction plus air drag (at km/s speeds air dominates). Bolted means no slide.\n Object: deceleration F/(m g). Grip ratio = max(F, hold)/(A_contact · crush), with A_contact = min(2 palmArea, A); plate needed = max(F, hold)/crush. Baseball: ratio to 40,000 N (known safe).\n Feet: sinkRatio = anc.N(F)/anc.Nmax (comic ground gives 0).\n Example, 10 m gentle lob: F = 0.1453 × 9.674²/(2 × 0.6) = 11.33 N, t_s = 2d/v = 0.124 s.\n\nE9. Heat verdict (object only; partner is 'immune'): nose temperature T_n = stagnationT(peak speed below 80 km) − 273.15 °C. Share it could melt or char, upper bound: f = heatLoad × A / (m × 1 MJ/kg).\n kind = 'warm' if T_n < material threshold; 'skin' if f < 1%; 'loses' if 1% ≤ f < 50%; 'destroyed' if f ≥ 50%.\n Flags: extrapolated if peak speed in air > 2,876 m/s (sea-level stagnation pressure above the fit's 100 atm); radiation if > 11 km/s.\n Check: baseball at 629 m/s gives T_n = 288.15 (1 + 0.2 (629.1/340.29)²) − 273.15 = 212 °C, under the 300 °C char point, so 'warm'.\n\nE10. At or above 1% of light speed: E = Eobj (exact, may be ∞), p = vToMomentum(v, m), sweep = m/(ρ₀ A), x = D/sweep.\n 'arrives' if x < 0.01; 'plasma' if 0.01 ≤ x < 1; 'before' if x ≥ 1.\n Energy still moving with it: E_arr = E/(1 + x) (snowplow: momentum kept, air scooped up). Energy dumped into the air between them: E − E_arr.\n 'before': blast at the catcher = overpressureAt(E, max(D − sweep, H_C)).\n 'arrives': relativistic catch, F_need = E_arr/d (work-energy, exact for force along the motion). Clean if F_cap ≥ F_need and both are finite; ∞ against ∞ is undefined. Recoil: momentumToV(p, M + m) unless bolted, in which case Earth recoils at p/M_E.\n\nE11. Miss: flight(obj, v_E, θ, h0, hStop = 0) to the ground. E = keFromV. Crater = craterDiameter if v ≥ 2 km/s (same call as throwOnce). Quake = seismicMagnitude(E). Blast = blastBlock(E). 'past' = range − D.\n\nE12. Partner as the ball (tossPartner): T throws the partner straight up (θ = 90°) and catches him at release height. Gentle: bisect v until the apex reaches the chosen toss height. Hard: full-strength v from throwObject(ctxT, partner, 90). Flight: flyTo(θ 90, h0 = hStop = 0.9 H_T). Catch: catchIt(ctxT, partner, vImpact, 90°). With theta 90 the anchor can't slide (R = ∞), but the feet can sink: sinkRatio = (mA g + F)/Nmax.\n\nE13. Can they stand apart? F_pull = mutualGravity(bR, bO, D).F, compared with each footing limit anchorCapacity(theta 0, own mass).R. If F_pull exceeds the smaller one, they fall together: fallTogether(bR, bO, D, dContact) gives t and vRel. Bolted means they hold.\n\nE14. Round trip: if both legs are clean catches, t_A + t_B + t_s,A + t_s,B.",
 "algorithm": "Engine (engine.js). The reference implementation is in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo/catch/flyto.js and catch2.js; port them. The tests in tests.js all pass against the live engine.\n1. Constants: CATCH = { STROKE: 0.3, ECC: 1.0, V_FIREBALL: 0.01*K.c, E_STAR: 1e6, SG_K: 1.7415e-4, SG_V100ATM: Math.sqrt(100*101325/K.rho0), V_RAD: 11000, BASEBALL_SAFE_N: 40000, ARRIVE_FRAC: 0.01 }. Add a MATERIALS table (inputs). In makeBody add strokes.catch = 0.3*s*2.\n2. fly(o): add o.hStop, o.xStop and o.Rn exactly as in flyto.js. Keep all existing outputs; add heatLoad, qMax, belowStop, crossedX, hAtX, vAtX, angleAtXDeg and inSpaceAtX. Guards: xStop defaults to Infinity. With a finite xStop, skip the whole-flight vacuum shortcut and integrate. Interpolate the xStop crossing inside the RK4 step, adding the partial heat. In the space branch, if R·|φ + Δφ| ≥ xStop, set crossedX with hAtX = Infinity and break.\n3. throwOnce: if ctx.noFlight, skip fly() and the impact/crater block (flight = null, Eimpact = 0). throwObject passes it through. Factor r0 into pushStartRadius(body).\n4. catchFlight(obj, v, θ, h0, hStop, record) = fly({v0:v, thetaDeg:θ, h0, hStop, m, A: area, Cd, CdSup, Rn: √(area/π), record}). reaches(f, D) = relativistic || escaped || orbit || timedOut || (landed && !belowStop && range ≥ D).\n5. aimEasy(obj, D, h0, hStop): cached Map, cleared above 300 entries. For each θ in [5, 15, …, 75], vNeededAt = bisection on ln v up to a ratio of 1 + 2e-4, warm-started at ±25% of the last solution. Take the best, golden-section between its neighbours to 0.1°, return {reachable, thetaDeg, v}. Cold cost 0.2-0.8 s; cached afterwards. Strength changes never invalidate it.\n6. releaseTable(ctxT, obj): 13 throwObject calls with noFlight (θ = 0…90 step 7.5) → vOf(θ) (linear), at45 (canHold, needed), E0, r0. Cache per (ctx strength, mode, anchor, surface, body, obj) for the render.\n7. aimHard(obj, D, h0, hStop, vOfE): grid [−80, −60, −45, −30, −20, −10, −5, −2, −1, −0.5, 0, 0.25, 0.5, 1, 2, 3, 5, 7.5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 89]. ok(f) = crossedX && hAtX ≥ hStop, using fly with hStop 0 and xStop D. The first ok angle is bisected against the previous one. v ≥ V_FIREBALL gives fireball. Escaped or orbit without crossedX gives overshoots. No ok angle gives short.\n8. farthest(obj, h0, hStop, vOf): ranges at θ = 1, 10, 20, 30, 40, 45, 50, 60, 70, 80 with v capped at 0.999 × V_FIREBALL (escape or orbit counts as ∞), then golden-section around the best to 0.2°.\n9. catchWells(bT, bC, obj, D): E7, returning {GT, GC, x0, x1, xs, rHeld, rMeet, barrier, gain, inStroke, phi, dBeatT, dBeatC, wellDominated}. wellPath(w, obj, vE): time, heatLoad, vmax, length (E7).\n10. catchIt(ctxC, obj, v, γ, w): E8. Returns {stroke, Fcap, Fneed, F, clean, slips, R, holdLoad, canHold, tStroke, decelG, vSlam, uAfter, slide, contact, gripRatio, plateNeeded, baseballRatio, sinkRatio, Ecatch}.\n11. heatVerdict(obj, heatLoad, stagT, vMaxAir): E9. fireballAt(obj, v, D, ctxC, Eknown): E10.\n12. catchLeg(ctxT, ctxC, obj, D, style):\n a. isBlackHole(T) → 'thrower-black-hole'.\n b. w = catchWells; tab = releaseTable; !tab.at45.canHold → 'cant-hold' (holdNeeded).\n c. vOfE(θ) = √(max(0, vOf(θ)² − 2·barrier)).\n d. If w.wellDominated: E7 straight line. v_L ≥ V_FIREBALL → 'fireball'. v_L > vMax or v_E ≤ 0 → 'falls-back' (escapeNeeded = √(2·barrier)). Otherwise time and heat come from wellPath, with arrival from E7 and angle 0.\n e. Otherwise, easy: aimEasy, which may be unreachable (then 'unreachable' with farthestAny at the cap speed). Apply E6. Hard: aimHard (fireball, overshoots, too-weak or ok). Then the final flight (record: true): catchFlight with hStop for easy, or fly with xStop D for hard (vImpact = vAtX, angle = max(0, angleAtXDeg)). Arrival speed from E7. Heat from E9.\n f. catch = catchIt(ctxC, obj, vArrive, angle, w). result = clean ? 'caught' : (canHold ? 'slams' : 'cant-hold-it').\n g. Unless wells dominate: miss = E11.\n Returns {result, aim {thetaDeg, vE, vL, vMax}, flight (with path), time, vArrive, angleDeg, heat, catch, miss, wells, fullStrength, farthest, needFactor, fireball, holdNeeded}.\n13. tossPartner(ctxT, partnerBody, name, style, hTarget): E12. Results caught, slams, too-weak, cant-hold, unreachable, escapes, orbit or fireball.\n14. catchGame(ctxR, ctxO, ball, D, style): A = leg(R→O), B = leg(O→R) (for a partner ball: A = tossPartner(ctxR, bO), B = tossPartner(ctxO, bR)), plus E13 (pull, holdR, holdO, together) and E14 (round). Export catchGame, catchLeg, catchIt, tossPartner, catchWells, aimEasy, aimHard, farthest, heatVerdict, fireballAt, partnerAsObject, pushStartRadius, CATCH, MATERIALS.\nPage (app.html bayCatch(c)):\n15. cR = ctx(), cO = ctxOllie(). Push duoHeader(cR, cO). Push bay-controls: Ball select (objectPicker(!noThrow) plus an optgroup 'Partner' option 'Ollie: Rex tosses him up and catches him'), Distance or Toss-height log slider with chips, segmented control Gentle lob | Fastball, and a Miss checkbox.\n16. Gates. Run soloGate(cR) and soloGate(cO) with the names swapped in. A stop gate (black hole, or a body that reshapes the planet) shows the callout and returns. A sinking gate (fallsThrough) shows a warn chip and continues. If the result has 'together', the verdict is the fall-together sentence and the game below is shown greyed with 'if both were bolted'.\n17. r = P.catchGame(cR, cO, ball, D, state.cStyle). Render the leg-A verdict, a status row, tiles, the trajectory chart (r.a.flight.path; no ghost; for a hard throw, endNote null; label 'Flight path of the ' + short), a one-line return leg (B), happens bullets (≤5), the miss block if cMiss, and math.\n18. Performance: aimEasy is cached and independent of strength. The strength slider re-runs only releaseTable (13 throwOnce calls with noFlight), aimHard (~20-40 short flights), farthest (only when too weak) and catchIt. Keep the existing rAF throttle. Distance and object changes go through scheduleBay (30 ms).\nData (build-data.py, static-data.js):\n19. Add material to each object. Add sourceRows for every fact listed. Add an assumptions item 'Game of catch' (caveats text, shortened).\n20. Tests: copy tests.js into test/catch.js (require ../src/engine.js and ../src/data.js), replacing X.leg with P.catchLeg and so on.",
 "edge_cases": "Infinite strength (thrower). The gentle lob is unaffected (it uses only the speed needed). The fastball becomes a fireball: Eobj = ∞, so the page says 'unbounded energy', not a number. fireballAt still classifies by D against the sweep length (a baseball at 10 m is 'plasma': Ollie is inside). No blast radius is given for infinite energy.\nInfinite strength (catcher). Any finite incoming momentum is a clean catch at the gentlest force. The slide and object damage don't depend on his strength, because he still gives over d.\nBoth infinite. Lobs are normal. A fastball 'arrives' case is ∞ against ∞, so clean is undefined; the page says the sim can't compare two infinities and points to the Collide tab's unstoppable-vs-immovable discussion.\nUnequal strengths. Each leg uses its own thrower and catcher context, so either leg can be too-weak, slams or cant-hold while the other is fine. The round trip is shown only if both are clean ('The game stops here: Ollie can't throw it back that far (his best: X)').\nDense partners. The thrower can't hold anything when his own arm weighs more than his strength: at neutron-star density the arm's effective mass is 0.003 × 7.4×10¹⁶ = 2.2×10¹⁴ kg, so holding even a baseball needs 2.18×10¹⁵ N, a dial of about 2.2×10¹⁴ kg. The object falls back into his hand when vMax² < 2·barrier. A dense catcher pulls the ball in, so a 10 m/s lob arrives at 2.2 km/s. Two partners can't stand apart when their mutual pull beats the weaker footing: neutron-star Rex and a normal Ollie 10 m apart attract with 8.9 MN against Ollie's 1.06 kN, so Ollie is dragged in within 15.7 ms at 3.6 km/s, unless both are bolted. Dense bodies on ordinary ground fall into the planet (soloGate warns; comic ground fixes it).\nFrom the plush to black-hole densities: below about 10⁻³ g of self-pull at H/2 (selfGravityOn false), GM is 0 and the game is ordinary. A black-hole thrower can't throw. A black-hole catcher (isBlackHole) swallows anything that reaches him; there is nothing to catch, so the leg reads 'disappears into him'. These are rare because soloGate stops first.\nRelativistic speeds. Below 1% c the catch is classical; the error is under 0.01% because γ − 1 < 5×10⁻⁵. At or above 1% c the object never flies as an object (project convention). Either the plasma or blast reaches him, or (D < 1% of sweep, dense heavy objects) it arrives nearly whole, and a relativistic work-energy catch applies with recoil momentumToV(p, M + m). Bolted means Earth recoils at p/M_E.\nComic ground. sinkRatio = 0; friction still limits sliding. Bolted means R = ∞: no slide and no recoil, and the planet takes the momentum.\nUnequal sizes. Release height is 0.9 H_T and catch height 0.9 H_C. The fastball may aim downward (a 50 m kaiju throws a baseball at −23° to a 2 m Ollie 100 m away). A lob to a taller catcher must rise to his hands. If it never gets up to hand height, flight.belowStop makes it count as not reaching.\nLong ranges. Ranges above π R_E aren't requested, because D is capped at the far side. The easy solution never orbits (the minimum-energy path is sub-orbital), but overshoot counts as reaching inside the bisection. A fastball can 'overshoot': too fast to land on him at any angle, it either ploughs into air and falls short or leaves Earth.\nAir wall. Objects with m/A much less than 10,332 kg/m² have a range limit that more speed barely changes (baseball about 470 m at default strength, about 1 km even at 1% c). The easy aim finds an absurd speed, the heat verdict calls it 'destroyed', and the page explains the air limit instead of quoting the speed as achievable.\nZero and NaN guards. vOf returns 0 when canMove is false. Bisection bounds are positive. v_E ≤ 0 means falls-back. The slide log1p handles k = 0. D is clamped to [Dmin, π R_E]. hold uses hypot. A_contact = min(2 palm, area) > 0. Fneed = ∞ only on infinite input.\nPartner as ball. Indestructible: no crush, no heat damage (heat kind 'immune'). A neutron-star partner needs a dial of at least m_partner (7.4×10¹⁶ kg) just to hold. The catcher's feet sink: a hard toss of Ollie at the default dial puts 1.42× the slab's limit on Rex's feet.",
 "outputs": "catchGame(ctxR, ctxO, ball, D, style) → { a: Leg (Rex throws, Ollie catches), b: Leg (Ollie throws back), round: s or null, pull: mutualGravity result {F: N, d: m, dContact: m}, holdR: N, holdO: N, together: null | {t: s, vRel: m/s, E: J} }.\nLeg = {\n result: 'caught' | 'slams' | 'cant-hold-it' | 'too-weak' | 'unreachable' | 'overshoots' | 'fireball' | 'falls-back' | 'cant-hold' | 'thrower-black-hole'.\n style: 'easy' | 'hard'; fullStrength: bool (the lob became a full-strength throw).\n D, h0, hStop: m.\n aim: {thetaDeg: deg (may be negative), vE: m/s (speed for the air arc), vL: m/s (speed leaving his hand), vMax: m/s (his full-strength speed at that angle)}.\n flight: the extended fly output {path [[x m, h m]], apex m, range m, time s, heatLoad J/m², qMax W/m², maxStagT K, maxMach, eFold m, …}.\n time: s. vArrive: m/s (when his hands meet it). angleDeg: deg below horizontal.\n heat: {kind: 'warm'|'skin'|'loses'|'destroyed'|'immune', mat {label, tC, verb}, noseC: °C, frac: share it could melt (upper bound), heatLoad: J/m², extrapolated: bool, radiation: bool}.\n catch: {stroke m, Fcap N, Fneed N, F N, clean, slips, R N, holdLoad N, canHold, tStroke s, decelG, vSlam m/s, uAfter m/s, slide m, contact m², gripRatio, plateNeeded m², baseballRatio, sinkRatio, Ecatch J}.\n miss: {vImpact m/s, E J, crater m, craterExtrapolated, quake (magnitude), past m}.\n wells: {GT, GC m³/s², barrier J/kg, gain J/kg, inStroke J/kg, x0, x1, xs, rHeld, rMeet m, dBeatT, dBeatC m, wellDominated}.\n farthest: {range m, thetaDeg}; farthestAny (same); needFactor (speed needed / speed he has); easyNeed {thetaDeg, vL, vE}.\n fireball: {E J, p kg·m/s, sweep m, kind 'arrives'|'plasma'|'before', Earr J, Eair J, rBlast m, overpressure Pa, catch {Fneed N, Fcap N, clean, undefinedInf, recoilV m/s, earthRecoilV m/s, stroke m}}.\n holdNeeded: N; escapeNeeded: m/s; dragIgnored: bool.\n}\ntossPartner → {result, obj, v m/s, flight, catch, holdNeeded N, vMax}.",
 "page_text": "Tab: 'Catch' (duo group). Controls: 'Ball' select; 'Distance' (or 'Toss height' when the ball is a partner) with chips 10 m · 100 m · 1 km · 100 km · 1,000 km · 10,000 km · Other side of the planet; 'Throw' segmented control: 'Gentle lob' (title: the slowest throw that reaches him) | 'Fastball' (title: as hard as he can, flattest path); checkbox 'Show what happens if he misses'.\n\nVERDICT (leg A; swap the names for B). Use the first condition that applies:\n- together: 'They can't play at this distance. Their pull on each other ({F}) beats {name}'s footing ({R}), so they slam together in {t} at {vRel}. Bolt both to the planet to play.'\n- thrower-black-hole: 'Rex is a black hole at this density. Nothing he throws can get out.'\n- cant-hold: 'Rex can't throw the {short}: he can't even hold it up.' Add ' His own arm weighs more than his strength can hold.' when holdNeeded comes mostly from his arm (needed > 2 × object weight with self-pull).\n- falls-back: 'Rex's own gravity wins. The {short} needs {escapeNeeded} just to climb out of his pull, and his best throw is {vMax}. It drops back into his hand.'\n- unreachable: 'No throw gets the {short} {D}. Air stops it within about {farthestAny} at any speed below 1% of light speed.'\n- too-weak, heat destroyed: 'Rex can't throw the {short} {D}: his best goes {farthest}. Air is the wall. It would need about {easyNeed.vL}, and at that speed it would {melt|char|break down} away long before it got there.'\n- too-weak, otherwise: 'Rex can't throw the {short} that far. His best throw goes {farthest}.' Add 'It needs {needFactor}× the speed he has' if finite.\n- overshoots: 'Thrown as hard as Rex can, the {short} can't come down on Ollie: kept low, it burns its speed in the air; aimed higher, it {leaves Earth for good | goes into orbit}. Switch to Gentle lob.'\n- fireball, before: 'At {v} the {short} turns into a fireball within about {sweep} of Rex's hand, before it reaches Ollie. What reaches him {D} away is the blast.' Or, for infinite energy: '…unbounded energy, so no finite blast size applies.'\n- fireball, plasma: 'At {v} the {short} turns to plasma at once. Ollie, {D} away, is inside the fireball: about {Earr} of it hits him.'\n- fireball, arrives: 'The {short} is so heavy for its size that it reaches Ollie before it has pushed aside its own weight in air. It arrives white-hot at {v}, carrying {Earr}.' Then: clean → ' Ollie stops it in {stroke} with {Fneed}.'; not clean → ' Ollie can't stop it ({Fneed} needed). It carries him off at {recoilV}.'; undefinedInf → ' Infinite strength against infinite energy: the sim can't call it.'\n- caught, easy: 'Rex lobs the {short} {D} to Ollie at {vL}, {θ}° up. It reaches Ollie {time} later at {vArrive}, and he stops it by giving with it over {stroke}.'\n- caught, hard: 'Rex fires the {short} at {vL}{, Mach N}. It reaches Ollie {time} later at {vArrive}. Stopping it in {stroke} takes {F}{; his feet slide {slide}}.'\n- caught, fullStrength: prefix 'It's too heavy to lob gently that far, so Rex throws it as hard as he can. '\n- slams: 'Ollie can't stop it with his arms. Catching it in {stroke} takes {Fneed}; he has {Fcap}. It shoves his hands back to his chest and hits him at {vSlam}. He's fine. The {short} isn't.'\n- cant-hold-it: 'Ollie can't even hold the {short} up ({holdLoad}). It knocks him back {slide}. He's fine.'\nAdd a second sentence, B summary: 'Ollie throws it back: {B verdict, shortened}.' If both are clean: ' One round trip takes {round}.'\nPartner ball: 'Rex tosses Ollie {apex} up. He comes back down {time} later at {vImpact}, and Rex catches him with {F}.' Add '{Rex's feet punch into {surface}}' if sinkRatio > 1.\n\nSTATUS CHIPS (≤5):\n- Reach: good 'Gentle lob: {vL}' | warn 'Full strength needed' | bad 'Out of reach (best {farthest})' | bad 'Fireball, no ball arrives'.\n- Catch: good 'Clean catch: {F/Fcap %} of Ollie's strength' | bad 'Too fast to stop: needs {Fneed}' | bad 'Too heavy to hold'.\n- Footing: info 'Bolted to the planet' | good 'Feet hold' | warn 'Slides {slide}' | bad 'Feet sink: {sinkRatio}× the ground's limit' (if > 1).\n- Object (not for a partner): good 'Survives the catch' (gripRatio ≤ 1, or no crush) | bad 'Hands punch into it' (gripRatio > 1) | for the baseball, info '{baseballRatio}× a home-run hit's squeeze' (warn if > 1).\n- Heat: info 'Nose air {noseC} °C' with the verdict: 'warms up' | 'skin {chars/melts}' | 'loses up to {frac}%' | bad 'burns up on the way'. Add 'Supersonic: sonic boom' (warn) if vL ≥ a0 and < 1% c.\n\nTILES:\n- 'Throw': {vL} (Mach if supersonic); sub '{θ}° up · gentle lob | full strength'. For a dense thrower, sub '{escape} just to get away from Rex'.\n- 'Flight': {time}; sub 'top {apex}' (or 'straight line through their pull').\n- 'Arrives at': {vArrive}; sub '{angleDeg}° down'. For a dense catcher, sub 'sped up by Ollie's pull'.\n- 'Catch force': {F}; sub '{F/Fcap %} of Ollie's strength · {decelG} g on the {short}'.\n- 'Ollie slides': {slide} (or 'nothing' / 'bolted'); sub 'feet hold up to {R}'.\n- 'Round trip': {round}; sub 'both throws and catches' (only if round).\n\nCHART: trajectoryChart(r.a.flight.path, null, 'Flight path of the ' + short, apex) when a flight path exists and wells don't dominate. Add a dashed vertical tick at x = D labelled 'Ollie'. Skip it for fireball, well-dominated or partner-toss results; for the toss, show the existing height tile instead.\n\nHAPPENS (choose ≤5, in this order of priority):\n1. Lob: 'The gentlest throw that gets there leaves at about {θ}°. With no air it would be 45° at {√(gD)}; drag asks for {pct}% more.' (Only if D < 10 km.)\n2. Air wall (too-weak or unreachable with m/A < 10,332 kg/m², or farthest < D): 'More speed hardly helps a {short}. Above the speed of sound it loses 63% of its speed every {eFold} of air, then falls at about its terminal speed. The air above each square metre of ground weighs 10.3 t, far more than the {short} carries per square metre of its front ({m/A} kg/m²).'\n3. Catch physics: 'Catching is stopping momentum. Ollie's hands give {stroke}, from full reach to his chest, so the force is the {short}'s energy spread over that distance: ½mv²/d = {F}. A real catcher's mitt gives a few centimetres, so his hands feel {stroke/0.05}× more.' (For the default human scale; otherwise drop the last sentence.)\n4. Footing (slips): 'His feet hold only {R} along that line, so he skids {slide} while he stops it, the way you slide back catching a heavy medicine ball on ice.' Bolted: 'Bolted to the planet, he doesn't move: Earth takes the momentum.'\n5. Object: grip > 1: 'His palms press {F/contact} into the {short}, which gives way at about {crush}. To catch it whole he'd need a plate {plateNeeded}.' Baseball: 'That's {ratio}× the ~40,000 N squeeze of a home-run hit, which baseballs survive. Past that, the sim can't say when it bursts.'\n6. Heat: warm: 'The air at its nose peaks at {noseC} °C, below the {tC} °C where {material} {verb}s, so it only warms up.' skin: 'Air at its nose reaches {noseC} °C, past the {tC} °C where {material} {verb}s, but it's only in the air {time}: its surface {verb}s while the inside stays cool.' loses/destroyed: 'Air heating could {verb} away up to {frac}% of it on the way (rough upper bound).' Flags: '(Above 2.9 km/s at sea level this is beyond the heating formula's tested range.)'; '(Above 11 km/s glowing air adds radiant heat the sim leaves out, so it would be worse.)'\n7. Dense thrower: 'Rex's own pull at his hands is {selfPullG} g. The {short} needs {√(2 barrier)} just to get away from him, and it leaves his pull at only {vE}.' Dense catcher: 'Ollie's pull grabs it: a {vL} lob hits his hands at {vArrive}, and it adds {inStroke energy} more while he brings it in.'\n8. Long flights (time > 60 s): 'Each throw takes {time}; it climbs {apex}, {above the Kármán line (100 km) if apex > 100 km}. A round trip takes {round}.'\n9. Fireball: 'Past 1% of light speed the air can't get out of the way. The {short} keeps its momentum while it scoops up air and is spent after about {sweep}, where it has met its own mass of air.' For 'arrives': 'The air it ploughs through between them still takes {Eair} ({compareEnergy}).'\n10. Unequal: 'Ollie can't throw it back that far: his best goes {B.farthest}.' (when B is too-weak).\n\nMISS BLOCK (cMiss and result has miss): 'If Ollie misses, it lands {past} behind him at {vImpact}: {E} ({fmtTNT}).' If E > 4.184e9 J, add crater/quake as in the throw tab (crater only if vImpact ≥ 2 km/s) and blastBlock(E, 'where it lands'). For a partner: 'If Rex misses, Ollie lands on his feet at {vImpact}', with the same crater/quake treatment.\n\nMATH (Show the math):\n'Aim: the gentlest throw is the angle needing the least launch speed, each speed solved so the arc comes down at Ollie's hand height ({hStop}) {D} away. Same air and round-Earth model as Throw.'\n'Fastball: his full-strength speed at each angle; the flattest angle whose path passes Ollie's hands.'\n'Catch: F = m v²/(2d) if his footing holds (F ≤ R = {R}); otherwise F = (v²/(2d) + R/M)/(1/m + 1/M) and he slides. d = 0.3 × his height = {stroke}.'\n'Slide: the pair coasts to a stop against friction and air drag: x = (M+m)/(2k)·ln(1 + k u²/R).'\nDense: 'Their gravity: Φ(x) = −G m_Rex/x − G m_Ollie/(D − x). Launch v² = v_air² + 2 × (top of Φ − Φ at release); arrival adds the drop into Ollie's well.'\nHeat: 'Nose heating (Sutton–Graves, NASA): q = 1.74×10⁻⁴ √(ρ/rₙ) v³ W/m², added up along the path; share it could melt ≈ heat × frontal area / (mass × 1 MJ/kg).'\nFireball: 'Above 1% of c: sweep = m/(ρ₀A) = {sweep}; energy reaching him ≈ E/(1 + D/sweep).'\n\nASSUMPTIONS ITEM (static-data.js), title 'Game of catch': 'Each throw is aimed: the gentle lob is the slowest throw that reaches the catcher's hands, the fastball his hardest along the flattest path. Catching is the gentlest steady force that stops it while his hands give 0.3 × his height (full reach to chest, from US Army body measurements); his strength caps that force, and his footing decides whether he slides. Air heating uses NASA's stagnation-point formula as a rough upper bound and leaves out glowing-gas radiation above 11 km/s. Dense partners are treated as points with their mass at the centre. Earth doesn't spin here, there is no spin on the ball and no wind, and above 1% of light speed nothing arrives as a ball unless it is far heavier than the air in its way.'",
 "caveats": "What the model leaves out, in plain words:\n- Catching is idealised. The hands give a fixed 0.3 × height (0.6 m at 2 m) with a perfectly steady force, the softest catch a person this size could make. No study measuring how far hands give was found. Real catches with a mitt stop a ball in a few centimetres with a higher, peaked force. Stepping back, falling over and bouncing out of the hands are not modelled. Catch force is capped at his full strength; real muscle resists about 1.2× harder while being stretched, so real-muscle catches are a little stronger than shown.\n- Footing during a slide uses the static grip limit as the sliding friction. After a fast catch, sliding off at km/s, he would really be knocked off his feet and flung. The 'slide' then means how far he and the object travel before air and ground stop them.\n- Object damage: the crush check uses the existing rough crush strengths. The baseball has no crush figure; it is compared only with the force of a home-run hit, which it survives. Heating is a rough upper bound: the stagnation-point flux is applied over the whole front, a single 1 MJ/kg melting heat is used for all materials, and melting doesn't feed back into the flight. Above 2.9 km/s at sea level the heating formula is used beyond its tested pressure range. Above 11 km/s radiant heat from glowing air is missing, so the damage there is a lower bound.\n- Above 1% of light speed the 'how far it gets' scale (m/(ρA), Newton's impact-depth rule) is an order of magnitude. The rule is meant for slower impacts. The 1% cut between 'arrives' and 'plasma' is a judgement call.\n- Dense partners are point masses at their centres, with the hands at fixed distances. A real 2 m body's gravity near its surface depends on its shape, so this is good to about a factor of two that close. Where their pull beats Earth's over the whole gap, the throw is a straight line with no drag and no Earth gravity. Elsewhere their wells are added to an Earth-only flight. Their own pull on the surrounding air (which the Weight tab describes) is not included in the flight. Both partners are assumed to stay put: on real ground a neutron-star-dense body sinks into the planet, and two dense partners pull each other together unless bolted.\n- Flight: same as the Throw tab, so no spin, lift, wind or Earth rotation. Earth turns about 0.25° a minute. In a 79-minute throw to the far side, the ground at the equator moves about 2,200 km, so a real throw would have to lead the catcher by up to that much. The Moon and Sun are ignored.\n- The gentle-lob search finds the least launch speed to about 0.02% in speed and 0.1° in angle. Near the minimum the speed barely changes with angle, so the angle shown is the less certain number.\n- Ollie uses the same body model as Rex (proportions, palms, Dempster segment masses). 'Dug in' for him means boots kicked into footholds, with the same buried area.",
 "tests": [
  {
   "name": "T1 fly() extension is backward compatible",
   "inputs": "baseball (m 0.1453 kg, A 0.00427 m², Cd 0.35/0.92), v0 200 m/s, θ 30°, h0 1.8 m; fly() vs extended fly with no hStop/xStop",
   "expected": "range 348.867 m from both, identical",
   "tolerance": "1e-9 m",
   "reasoning": "With hStop = 0 and xStop = ∞ the new code takes exactly the old path. Rn only adds a heat accumulator."
  },
  {
   "name": "T2 Sutton–Graves peak flux",
   "inputs": "baseball, v0 3,000 m/s, θ 45°, h0 = hStop = 1.8 m, Rn = √(0.00427/π) = 0.036868 m",
   "expected": "qMax = 2.710e7 W/m²",
   "tolerance": "±0.01e7",
   "reasoning": "q = 1.7415e-4 × √(1.225/0.036868) × 3000³ = 1.7415e-4 × 5.7643 × 2.7e10 = 2.7104e7 W/m², at launch at sea level."
  },
  {
   "name": "T3 Gentle lob of a baseball, 10 m, default bodies",
   "inputs": "Rex and Ollie 2 m/180 kg, comic, concrete, friction, dial 100 short tons (90,718 kg); ball baseball; D 10 m; style easy",
   "expected": "launch 10.16 m/s at 45.1°; flight 1.446 s; arrives 9.674 m/s at 46.4° down; catch force 11.33 N; stroke time 0.124 s; footing holds; heat 'warm'",
   "tolerance": "speed ±0.05 m/s, angle ±1.5°, time ±0.01 s, arrival ±0.03 m/s, force ±0.1 N",
   "reasoning": "With no air on flat ground the minimum is √(gD) = √(9.80665 × 10) = 9.903 m/s at 45°, flight 2v sin45°/g = 1.428 s. Drag raises the speed 2.6% and the time to 1.446 s. Catch: F = m v²/(2d) = 0.1453 × 9.674²/(2 × 0.6) = 0.1453 × 93.59/1.2 = 11.33 N, below the footing limit (about 4.2 kN at 46°). t = 2d/v = 1.2/9.674 = 0.1240 s."
  },
  {
   "name": "T4 Fastball baseball, 10 m",
   "inputs": "same as T3, style hard",
   "expected": "launch 629.1 m/s at about 0.008°; arrives 533.1 m/s; catch force 34,390 N; slips; slide 0.0152 m; 0.860× the home-run squeeze; heat 'warm' (nose 212 °C)",
   "tolerance": "speeds ±1 m/s, force ±100 N, slide ±0.001 m",
   "reasoning": "Supersonic drag e-folding length λ = 2m/(ρ Cd A) = 0.2906/(1.225 × 0.92 × 0.00427) = 60.39 m, so v(10 m) = 629.14 × e^(−10/60.39) = 629.14 × 0.8474 = 533.1 m/s. F_A = 0.1453 × 533.14²/1.2 = 34,416 N, more than R = 0.6 × 180 × 9.80665 = 1,059 N, so he slides. F_B = (236,865 + 1,059/180)/(1/0.1453 + 1/180) = 236,871/6.8879 = 34,390 N. 34,390/40,000 = 0.860. Nose: 288.15 × (1 + 0.2 × (629.1/340.29)²) = 485.1 K = 212 °C, below the 300 °C char point."
  },
  {
   "name": "T5 Gentle lob of a car, 10 m: Ollie slides",
   "inputs": "as T3, ball car (1,340 kg, 8.7 m², Cd 1.15/1.75)",
   "expected": "launch 10.09 m/s at 45°; arrives 9.737 m/s at 46.0°; R = 43,330 N; catch force 50,734 N; slide 1.27 m",
   "tolerance": "force ±200 N, slide ±0.05 m",
   "reasoning": "F_A = 1340 × 9.737²/1.2 = 105,870 N, more than R (anchorCapacity at 46° with the car held on the line) = 43,330 N, so F_B = (9.737²/1.2 + 43,330/180)/(1/1340 + 1/180) = (79.0 + 240.7)/0.006302 = 50,734 N. a_rel = 50,734/1340 + (50,734 − 43,330)/180 = 37.86 + 41.13 = 78.99 m/s², t = 9.737/78.99 = 0.1233 s. Pair speed u = (1340 × 9.737 − 43,330 × 0.1233)/1520 = 5.07 m/s, horizontal 3.52 m/s. Afterwards: Rs = 0.6 × 1520 × 9.80665 = 8,944 N, k = ½ × 1.225 × 1.75 × 8.7 = 9.33, so x = 1520/(2 × 9.33) × ln(1 + 9.33 × 12.39/8944) = 1.046 m. During the stroke: ½ × 41.13 × 0.1233² × cos46° = 0.217 m. Total 1.26 m."
  },
  {
   "name": "T6 Air is the wall for a baseball at 1 km",
   "inputs": "as T3, D 1,000 m, easy",
   "expected": "result too-weak; farthest at full strength 470.6 m (at about 25°); the lob would need about 2.6×10⁶ m/s and the heat verdict is 'destroyed'",
   "tolerance": "farthest ±3 m",
   "reasoning": "m/A = 34 kg/m², about 300× less than the 10,332 kg/m² of air above the ground. Speed falls 63% every 60 m above the speed of sound, so even 3 km/s at 45° only reaches about 496 m. The 629 m/s best throw tops out at 471 m."
  },
  {
   "name": "T7 Terminal speed sanity check",
   "inputs": "baseball data",
   "expected": "√(2mg/(ρ Cd A)) = 39.45 m/s; Adair (1995) gives about 42 m/s",
   "tolerance": "±0.05 m/s",
   "reasoning": "2 × 0.1453 × 9.80665/(1.225 × 0.35 × 0.00427) = 2.8498/0.0018307 = 1556.7, √ = 39.45. That is 6% under Adair's drag-equals-weight speed, consistent with the sim's Cd of 0.35."
  },
  {
   "name": "T8 Round trip, default lob",
   "inputs": "catchGame(default, default, baseball, 10 m, easy)",
   "expected": "3.140 s",
   "tolerance": "±0.02 s",
   "reasoning": "2 × (1.4459 flight + 0.1240 catch) = 3.1398 s; both legs are symmetric."
  },
  {
   "name": "T9 Neutron-star Rex must give the ball escape speed",
   "inputs": "Rex density 4.12e17 kg/m³ (m = 7.416e16 kg), both bolted, comic ground, both dials 1e22 kg; Ollie default; baseball; D 10 m; easy",
   "expected": "barrier 9.308e6 J/kg; launch 4,315 m/s; arrives 9.903 m/s (straight line, wells dominate)",
   "tolerance": "barrier ±0.002e6, launch ±2 m/s, arrival ±0.01",
   "reasoning": "GM = 6.6743e-11 × 7.416e16 = 4.9497e6 m³/s². Release x₀ = max(0.3503, 0.5) = 0.5 m. Ollie's held radius = 1 + 0.5 × ∛(0.1453/680) = 1.02989 m, r_meet = 1.62989, x₁ = 8.37011 m. barrier = GM(1/0.5 − 1/8.37011) = 4.9497e6 × 1.880527 = 9.3080e6. v_E = √(gD) = 9.903, so v_L = √(98.07 + 1.86160e7) = 4,314.6. Wells dominate (√(GM/g) = 710 m > 10 m). Ollie has no well, so barrier + gain = 0 and arrival = v_E."
  },
  {
   "name": "T9b Neutron-star Rex at the default dial can't even hold the ball",
   "inputs": "T9 bodies but friction, dial 100 short tons",
   "expected": "result cant-hold; holdNeeded 2.182e15 N",
   "tolerance": "±0.002e15",
   "reasoning": "throwOnce holds the object plus the effective hand mass 0.003 × 7.416e16 = 2.2248e14 kg: × 9.80665 = 2.1818e15 N, far above the 8.9e5 N dial."
  },
  {
   "name": "T10 A neutron-star Ollie pulls in a gentle lob",
   "inputs": "Rex default, Ollie density 4.12e17, both bolted, comic ground, dials 1e22 kg; baseball, 10 m, easy",
   "expected": "arrival 2,243 m/s; catch force 1.0377e6 N (clean)",
   "tolerance": "arrival ±1 m/s, force ±0.001e6 N",
   "reasoning": "gain = GM(1/r_meet − 1/(D − x₀)) = 4.9497e6 × (0.613538 − 0.105263) = 2.5158e6 J/kg, so v = √(98.07 + 5.0316e6) = 2,243.1. inStroke = GM(1/1.02989 − 1/1.62989) = 1.7692e6, v_eff² = 8.5701e6, F = 0.1453 × 8.5701e6/1.2 = 1.0377e6 N."
  },
  {
   "name": "T10b Same, both at the default dial: it slams into him",
   "inputs": "T10 with dials 100 short tons",
   "expected": "result slams; v_slam 1,105.8 m/s",
   "tolerance": "±1 m/s",
   "reasoning": "F_cap = 889,644 N is less than 1.0377e6 needed (hold 6.78e5 N is fine). Remaining v² = 8.5701e6 − 2 × (889,644/0.1453) × 0.6 = 8.5701e6 − 7.3474e6 = 1.2227e6, √ = 1,105.8."
  },
  {
   "name": "T11 Neutron-star Rex and normal Ollie can't stand 10 m apart",
   "inputs": "catchGame(NS Rex friction, default Ollie friction, baseball, 10 m)",
   "expected": "pull 8.909e6 N; Ollie's footing 1,059 N; they fall together in 0.01566 s",
   "tolerance": "pull ±0.002e6, time ±0.0002 s",
   "reasoning": "F = 6.6743e-11 × 7.416e16 × 180/10² = 8.909e6 N. fallTogether with contact 0.70053 m: t = √(10³/(2 × 4.9497e6)) × (√(x(1−x)) + acos√x), x = 0.070053, which is 0.010051 × 1.55811 = 0.015661 s."
  },
  {
   "name": "T12 Two neutron-star partners: over the hump between them",
   "inputs": "both 4.12e17 kg/m³, bolted, comic ground, dials 1e22 kg; baseball; 10 m; easy",
   "expected": "barrier 8.440e6 J/kg; launch 4,109 m/s; arrival 1,816 m/s",
   "tolerance": "±0.002e6; ±2 m/s; ±2 m/s",
   "reasoning": "Saddle at 5 m: Φ(5) = −0.4 GM, Φ(0.5) = −(2 + 1/9.5) GM = −2.105263 GM, so barrier = 1.705263 × 4.9497e6 = 8.4405e6. v_L = √(98.07 + 1.68809e7) = 4,108.7. gain = Φ(0.5) − Φ(8.37011) = (−2.105263 + 0.733011) GM = −6.7922e6, so arrival = √(98.07 + 2 × (8.4405e6 − 6.7922e6)) = 1,815.7."
  },
  {
   "name": "T13 Infinite-strength fastball: the plasma reaches Ollie",
   "inputs": "both infinite strength, baseball, 10 m, hard",
   "expected": "result fireball, kind 'plasma', sweep 27.78 m, energy unbounded",
   "tolerance": "sweep ±0.01 m",
   "reasoning": "sweep = 0.1453/(1.225 × 0.00427) = 27.778 m; D/sweep = 0.36, between 1% and 100%."
  },
  {
   "name": "T13b A relativistic pyramid arrives nearly whole",
   "inputs": "dials 1e30 kg, bolted; pyramid (6e9 kg, 34,700 m²); 10 m; hard",
   "expected": "kind 'arrives', sweep 141.15 km, clean catch (F needed 8.80e30 N < 9.81e30 N)",
   "tolerance": "sweep ±0.1 km",
   "reasoning": "6e9/(1.225 × 34,700) = 141,152 m; D/sweep = 7.1e-5 < 1%. F = E_arr/0.6 m."
  },
  {
   "name": "T14 Rex tosses Ollie 10 m up and catches him",
   "inputs": "default bodies and settings, partner ball, easy, toss height 10 m",
   "expected": "toss speed 12.83 m/s; flight 2.585 s; catch force 23,630 N; sink ratio 0.113",
   "tolerance": "±0.05 m/s; ±0.02 s; ±150 N",
   "reasoning": "With no air, √(2g × 8.2 m) = 12.68 m/s and 2v/g = 2.586 s; drag on a 0.8 m² body (λ = 367 m) adds a little speed. He comes down at 12.55 m/s, so F = 180 × 12.55²/1.2 = 23,627 N. Load on the feet (1,765 + 23,627 N)/(2.5 MPa × 0.09 m²) = 0.113."
  },
  {
   "name": "T14b Full-strength toss of Ollie sinks Rex into the slab",
   "inputs": "as T14, hard",
   "expected": "apex 163.3 m; comes back at 46.0 m/s; catch 3.17e5 N; sink ratio 1.418",
   "tolerance": "apex ±1 m; sink ±0.01",
   "reasoning": "71.2 m/s up (throwObject at 90°). F = 180 × 45.99²/1.2 = 317,270 N, and (1,765 + 317,270)/225,000 = 1.418 > 1, so his feet punch into the 10 cm slab."
  },
  {
   "name": "T15 A game of catch across the planet",
   "inputs": "both dials 1e17 kg, bolted, comic ground; pyramid; D 20,000 km; easy",
   "expected": "launch 9,798 m/s at about 21°; one way 78.6 min; round trip 2.62 h; arrives 7.3 km/s; heat 'skin' (about 0.07% could melt); catch 2.7e17 N; his palms punch in (plate 8.9e9 m², about 94 km square)",
   "tolerance": "speed ±30 m/s; time ±0.5 min; round ±0.02 h",
   "reasoning": "m/A = 173,000 kg/m², 17× the air column, so it punches through the air. A vacuum minimum-energy arc to the far side is about orbital speed (7.9 km/s) at a low angle; air and the 20° climb push that to 9.8 km/s. Plate side = √8.918e9 = 94.4 km."
  },
  {
   "name": "T16 Unequal strengths: Ollie with a 1 t dial and a car",
   "inputs": "Rex default; Ollie dial 1,000 kg; car; 10 m; easy",
   "expected": "leg A: cant-hold-it (car weighs 13,141 N > Ollie's 9,807 N); leg B: cant-hold; no round trip",
   "tolerance": "exact flags",
   "reasoning": "Weight 1340 × 9.80665 = 13,141 N, more than 1,000 × 9.80665."
  },
  {
   "name": "T17 Heavy object: the gentle lob is out of reach but a full-strength throw works",
   "inputs": "defaults; car; 30 m; easy",
   "expected": "caught with fullStrength = true at about 47.9°, 18.2 m/s; force 9.18e4 N; slide 4.56 m",
   "tolerance": "angle ±0.5°, speed ±0.1 m/s",
   "reasoning": "The gentlest arc needs 18.14 m/s at 44°, but his full-strength car throw at 44° is only 16.65 m/s. The farthest at full strength is 45.6 m (at 60°), more than 30 m, so the flattest full-strength angle that reaches is used."
  },
  {
   "name": "T18 Unequal sizes: kaiju thrower aims down",
   "inputs": "Rex 50 m (dial 1e9 kg), Ollie default; baseball; 100 m; hard",
   "expected": "θ about −23.3°, launch 2,978 m/s, arrives about 493 m/s, clean catch",
   "tolerance": "angle ±0.5°",
   "reasoning": "Release at 45 m, hands at 1.8 m: atan(43.2/100) = 23.4° below level, so the flattest path is a downward line. Drag over about 109 m of path takes the speed from 2,978 to about 493 m/s (supersonic λ = 60.4 m, e^(−1.8) = 0.165)."
  }
 ],
 "open_questions": "1. Partner as the ball. With only two people, I designed it as 'Rex tosses Ollie straight up and catches him', and the return leg is Ollie tossing Rex. The alternative is throwing the partner to a spot D away, where he lands on his feet (that is just Throw with a partner as the object). Please confirm the vertical toss is what the owner wants.\n2. Catch stroke. No measured study of how far hands give in a catch turned up. 0.3 × height is anatomical (ANSUR II reach minus chest depth) and is the softest possible catch. Do we want a 'Hard hands (mitt, 5 cm)' option? Forces would be 12× higher.\n3. Real-muscle eccentric bonus. Should real-muscle catches get the ~1.2× living-human eccentric factor (Franchi et al. 2017)? I left it at 1.0× to stay conservative and simple.\n4. Heating detail. Materials are five classes with sourced damage temperatures and one 1 MJ/kg melting heat. This needs a new material field per object in build-data.py. Is the coarse 'warm / skin / loses / burns up' verdict enough, or should the page show the heat load in J/m² as well?\n5. Earth rotation is ignored, as in the Throw tab. For flights over a few minutes this shifts the landing point by up to thousands of km (about 2,200 km in the 79-minute far-side throw). Do we want a 'lead the catcher' note computed from latitude, or just the caveat?\n6. Performance. The cold gentle-lob solve takes 0.2-0.8 s per new object or distance (cached afterwards). Adding ctx.noFlight to throwOnce makes the per-frame strength-dial path about 10× cheaper. The engineer may want a 'computing…' state or a Web Worker if long-range distances feel sluggish.\n7. Black-hole catcher wording ('it disappears into him') and the ∞ vs ∞ fireball catch should match the Collide area's language. Please coordinate.\n8. The dense-partner model uses the engine's heldRadius (0.5 H + half the object) and pushStartRadius (0.25 H). Those belong to the density area; if they change, tests T9-T12 change with them."
}
```

</details>

**Claude · 2026-10-09 22:06:35 UTC**

While the design agents work, I'm preparing the page scaffolding (Ollie's settings, the solo/duo switch, the density control) and the new image.


- `Skill` artifact-design
- `ToolSearch` select:TaskCreate
- `TaskCreate` Research + design density and duo physics (workflow)
- `TaskCreate` Build UI scaffolding: Ollie settings, density control, solo/duo tabs, new image
- `TaskCreate` Implement engine: density/weight, arm wrestle, wrestle, catch, collide
- `TaskCreate` Build new bays, data rows, assumptions; adversarial audit; publish, commit, push
- `TaskUpdate` #6 status=in_progress
- `TaskUpdate` #7 status=in_progress
- `Bash` Inspect build script, assets, and image tooling: `cat build.js; ls -la assets; python3 -c "import PIL; print(PIL.__version__)" 2>&1; file /root/.claude/uploads/6435a7db-fe21-5f3b-bca9-e49ba2609387/e4a745ec-i...`
- `Bash` Crop and compress the Rex and Ollie image: `python3 -I - <<'EOF'` (+9 lines)

**Claude · 2026-10-09 22:06:58 UTC**

Image is ready (54 KB). Now wiring Ollie and density into the page state.


- `Bash` Read state defaults, validation, ctx and tab code: `sed -n 420,465p src/app.html; grep -n "ACTIONS\b\|function buildTabs\|#tabs\|tab-' + \|'tab-'" src/app.html | head -20`
- `Bash` Check existing moves for NaN at extreme masses: `node -e "` (+10 lines)
- `Bash` Read page head, tokens and control CSS: `sed -n 1,95p src/app.html`
- `Bash` Add body volume and density to the engine body model: `python3 - <<'EOF'` (+24 lines)
- `Bash` Read engine export block: `sed -n 955,975p src/engine.js`
- `Bash` Export volume helpers; read controls builder: `sed -i 's/    K, MUSCLE, CAL_LIFT_KG, V_ESC, makeBody, qultFor,/    K, MUSCLE, CAL_LIFT_KG, V_ESC, BASE_V, makeBody, bodyVolume, qultFor,/' src/engine.js && ...`

**Claude · 2026-10-09 22:08:04 UTC**

Writing the scaffolding: density slider with presets, Ollie's settings panel, and a "Rex alone / Rex + Ollie" switch with its own tabs.


- `Bash` Add density field, Ollie panel, group switch, image embedding: `cat > /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/scaffold1.py <<'PYEOF'` (+100 lines)
- `Bash` Add Ollie and group state with validation: `cat > /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/scaffold2.py <<'PYEOF'` (+46 lines)
- `Bash` Add density, Ollie and tab-group controls: `cat > /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/scaffold3.py <<'PYEOF'` (+111 lines)
- `Bash` Add tab lists, bay stubs, and density summary: `cat > /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/scaffold4.py <<'PYEOF'` (+55 lines)
- `Bash` Fix feat runner group; build and smoke test: `python3 - <<'EOF'` (+7 lines)
- `Bash` Screenshot new settings and duo tab group: `cat > /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/aside.js <<'EOF'` (+19 lines)
- `Read` /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/aside-390.png
- `Read` /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/main-390.png
- `Bash` Fix checkbox label style; check workflow progress: `python3 - <<'EOF'` (+7 lines)
- `Bash` Locate hint CSS rules: `grep -n "^\.hint\|\.field \.hint" src/app.html | head; python3 - <<'EOF'` (+5 lines)
- `Bash` Add checkbox label style override: `python3 - <<'EOF'` (+6 lines)

**Claude · 2026-10-09 22:10:28 UTC**

Scaffolding works: the density slider, Ollie's panel and the "Rex alone / Rex + Ollie" switch render at 390 px and 1280 px with no errors. Two of the four physics designers are still working.


- `TaskUpdate` #7 status=completed
- `Bash` Check designer transcript sizes and scratch output: `ls -la /root/.claude/projects/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/subagents/workflows/wf_173e4620-19f/; ls /tmp/claude-0/-home-user/6435a7db-fe21...`

**Claude · 2026-10-09 22:10:43 UTC**

While the designers work, I'm building a shared Rex-vs-Ollie header that all four two-player tabs will use.


- `Bash` Add shared Rex vs Ollie header component: `python3 - <<'EOF'` (+29 lines)
- `Bash` Wait for the next workflow journal event: `J=/root/.claude/projects/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/subagents/workflows/wf_173e4620-19f/journal.jsonl; n0=$(wc -l < $J); for i in $(seq ...`
- `Bash` Peek at designer agents' latest activity: `cd /root/.claude/projects/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/subagents/workflows/wf_173e4620-19f/ && for f in agent-*.jsonl; do echo "== $f $(wc...` (+11 lines)

**Claude · 2026-10-09 22:21:07 UTC**

The designers are still researching (sources for white-dwarf density, body dimensions and so on). Waiting for the first designs to land.


- `Bash` Wait for the next workflow journal event: `J=/root/.claude/projects/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/subagents/workflows/wf_173e4620-19f/journal.jsonl; n0=$(wc -l < $J); for i in $(seq ...`
- `Bash` Wait for the next workflow journal event: `J=/root/.claude/projects/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/subagents/workflows/wf_173e4620-19f/journal.jsonl; n0=$(wc -l < $J); for i in $(seq ...`
- `Bash` Peek at designer progress: `cd /root/.claude/projects/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/subagents/workflows/wf_173e4620-19f/ && for f in agent-*.jsonl; do echo "== $f $(wc...` (+10 lines)
- `Bash` List density prototype files: `ls -la /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo/density/calc/; wc -l /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49...`
- `Read` /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo/density/calc/weight.js
- `Bash` Wait for the next workflow journal event: `J=/root/.claude/projects/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/subagents/workflows/wf_173e4620-19f/journal.jsonl; n0=$(wc -l < $J); for i in $(seq ...`

**Claude · 2026-10-09 22:44:32 UTC**

The arm-wrestling and wrestling design is in. Reading it now and starting on that engine code while the other designs continue.


- `Bash` Extract finished design JSON from the journal: `cd /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo && python3 -c "` (+7 lines)
- `Bash` Read contest design summary and equations: `cd /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo && python3 -c "` (+5 lines)
- `Bash` Read contest algorithm, edge cases, outputs: `cd /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo && python3 -c "` (+5 lines)
- `Bash` Add shared self-gravity helpers to the engine: `cd /home/user/dino-strength-sim && python3 - <<'EOF'` (+41 lines)
- `Bash` Wait for the next workflow journal event: `J=/root/.claude/projects/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/subagents/workflows/wf_173e4620-19f/journal.jsonl; n0=$(wc -l < $J); for i in $(seq ...`
- `Bash` Save density design and read its core: `cd /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo && python3 -c "` (+16 lines)

**Claude · 2026-10-09 22:49:00 UTC**

Density design is in (Earth density model, falling through the planet, self-gravity, air, black-hole limit). Reading the rest of it; the catch and collision designs are still running.


- `Bash` Read density algorithm, edge cases, outputs: `python3 -c "` (+5 lines)
- `Bash` Read density page text and caveats: `python3 -c "` (+5 lines)

**Claude · 2026-10-09 22:49:16 UTC**

Starting the density engine port now (the designer's prototype is tested); the adversarial check of it will run later and I'll patch whatever it finds.


- `Bash` Read and run the density prototype test script: `cat /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo/density/calc/final.js; cd /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e...`
- `Bash` Find insertion point before the moves section: `cd /home/user/dino-strength-sim && grep -n "^  // Moves. Each takes a shared context" src/engine.js && grep -n "function penetrationDepth" -A6 src/engine.js ...`
- `Bash` Port density engine and run preset checks: `cat > /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/density_engine.js <<'EOF'` (+296 lines)
- `Bash` Check fall-through regimes and runtime across masses: `node -e "` (+8 lines)
- `Bash` Test fall integrator accuracy versus time-step cap: `for cap in 1 3 6; do sed "s/const dt = Math.min((vrel > 100 || RE - r < 20e3) ? 1 : 10,/const dt = Math.min((RE - r < 20e3) ? 1 : (vrel > 100 ? $cap : 10),/"...` (+3 lines)
- `Bash` Test a radius floor in the step-size limit: `for fl in 2e5 1e6; do sed "s/Math.max(1e-3, 0.002 \* r \/ Math.max(v, 1)));/Math.max(1e-3, 0.002 * Math.max(r, $fl) \/ Math.max(v, 1)));/" src/engine.js > /t...` (+3 lines)
- `Bash` Apply step tuning and sweep masses for timing: `python3 - <<'EOF'` (+19 lines)
- `Bash` Use averaged settling after the first trip; re-time: `python3 - <<'EOF'` (+28 lines)
- `Bash` Route heavily damped falls to full 3-D; re-check: `python3 - <<'EOF'` (+23 lines)

**Claude · 2026-10-09 22:53:05 UTC**

The density engine runs in under 0.2 s at every mass. Next: the self-gravity hooks in Lift and Throw, so a neutron-star Rex can't throw anything that escapes his own gravity.


- `Bash` Read current lift function: `grep -n "function lift(ctx, obj)" -A30 src/engine.js | head -35`
- `Bash` Add self-gravity to lift and throw; test: `python3 - <<'EOF'` (+57 lines)
  - result: Exit code 1
  - result: ok
  - result:      tank at 112 km/s: landed true escaped false orbit false timedOut false range km 30
- `Bash` Test neutron-star Rex throw and lift: `node -e "` (+6 lines)
- `Bash` List workflow journal events: `python3 -c "` (+5 lines)
- `Bash` List density design facts and sources: `python3 -c "` (+5 lines)

**Claude · 2026-10-09 22:55:04 UTC**

While the last two designs finish, I'm building the Weight tab itself: verdict, status chips, tiles, a mass-comparison chart, and a cut-away of Earth showing his path.


- `Bash` Locate UI helpers and available reference data: `grep -n "function verdict\|function callout\|function math(\|function status(\|const happens\|function logMeter\|function compareEnergy\|function heightRefs"...`
- `Bash` Read status, verdict, callout, math helpers: `sed -n 545,575p src/app.html; grep -n "function verdict\|const verdict\|const callout\|const math\b\|function math\|const math =" src/app.html`
- `TaskUpdate` #8 status=in_progress
- `Bash` Inspect object and surface data fields: `node -e "global.window={};require('./src/data.js');const D=window.DINO_DATA;console.log(Object.keys(D.objects[0]), D.objects.find(o=>o.id==='everest'), Objec...`
- `Bash` Add the Weight tab, Earth cut-away chart and density chips: `cat > /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/bayweight.js <<'EOF'` (+195 lines)
- `Bash` Create density research file and load it in the build: `python3 - <<'EOF'` (+15 lines)
- `Bash` Add density presets and mass references to the data build: `python3 - <<'EOF'` (+35 lines)
- `Bash` Render the Weight tab for neutron-star and white-dwarf Rex: `cat > /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/weightshot.js <<'EOF'` (+21 lines)
- `Read` /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/w-ns.png
- `Bash` Fix Weight tab wording, chart labels and bar value room: `python3 - <<'EOF'` (+28 lines)
- `Bash` Find the gravity bullet text: `grep -n "His gravity is real but tiny" src/app.html | cut -c1-200`

**Claude · 2026-10-09 22:58:16 UTC**

Fixing layout issues found in the Weight tab screenshot (clipped bar values, overlapping core labels).


- `Bash` Apply the Weight tab fixes: `python3 - <<'EOF'` (+26 lines)
- `Bash` Gate solo moves at planet-scale masses; re-render: `python3 - <<'EOF'` (+22 lines)
- `Bash` Regenerate preview and recheck gated tabs: `node test/shots.js weight >/dev/null 2>&1; node /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/weightshot.js '[["w-ns2",390,{"ac...`

**Claude · 2026-10-09 22:59:26 UTC**

Throw and Lift need wording for the self-gravity cases (object falls back onto him; his pull adds to what he holds). Adding that now.


- `Bash` Add self-gravity wording to Throw and Lift: `python3 - <<'EOF'` (+38 lines)
- `Bash` Check Throw and Lift with a neutron-star Rex: `python3 - <<'EOF'` (+7 lines)

**Claude · 2026-10-09 23:00:11 UTC**

Throw and Lift now handle a neutron-star Rex correctly. Checking whether the catch and collision designs have landed.


- `Bash` List workflow journal events: `python3 -c "` (+6 lines)
- `Bash` Read contest prototype size and page text: `wc -l /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo/contest/contest.js; python3 -c "` (+4 lines)

**Claude · 2026-10-09 23:00:32 UTC**

Density and Weight are working end to end. Waiting for the catch and collision designs before building the two-player engine, so I build it once.


- `Bash` Wait for the next workflow event: `J=/root/.claude/projects/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/subagents/workflows/wf_173e4620-19f/journal.jsonl; n0=$(wc -l < $J); for i in $(seq ...` (+5 lines)

**Claude · 2026-10-09 23:10:18 UTC**

Still running. I'll port the arm-wrestling and wrestling prototype into the engine now and patch it when its check comes back.


- `Read` /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo/contest/contest.js

**Claude · 2026-10-09 23:10:27 UTC**

While the last designs run, I'm adding regression tests for the density physics: Earth-model checkpoints, the 38-minute fall through the Earth, and the black-hole threshold.


- `Bash` Add density regression tests and run them: `python3 - <<'EOF'` (+36 lines)

**Claude · 2026-10-09 23:11:47 UTC**

All 12 new density tests pass. Waiting on the catch and collision designs.


- `Bash` Wait for the next workflow event: `J=/root/.claude/projects/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/subagents/workflows/wf_173e4620-19f/journal.jsonl; n0=$(wc -l < $J); for i in $(seq ...` (+5 lines)
- `Bash` Check progress of the catch and collide designers: `ls -la /root/.claude/projects/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/subagents/workflows/wf_173e4620-19f/; ls /tmp/claude-0/-home-user/6435a7db-fe21...` (+10 lines)

**Claude · 2026-10-09 23:21:41 UTC**

Both remaining designers are writing up their final functions. I'll build the arm-wrestling and wrestling engine and panels now.


- `Bash` Port the contest engine and smoke-test it: `cat > /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/contest_engine.js <<'EOF'` (+207 lines)
- `Bash` Add arm wrestling and wrestling panels; render them: `cat > /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/bay_contest.js <<'EOF'` (+257 lines)
- `Bash` Rename clashing constant and re-render duo panels: `grep -n "const NAMES" src/app.html | head; sed -i "s/  const NAMES = { A: 'Rex', B: 'Ollie' };/  const WHO = { A: 'Rex', B: 'Ollie' };/; s/NAMES\[r.winner\]/...`

**Claude · 2026-10-09 23:25:54 UTC**

Arm wrestling and wrestling panels render correctly at phone width. Checking on the remaining designs.


- `Bash` Check workflow progress: `python3 -c "` (+5 lines)
- `Bash` Save and read the collision design: `cd /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo && python3 -c "` (+9 lines)

**Claude · 2026-10-09 23:26:06 UTC**

Collision design is in. The catch design and the four checks are still running (roughly an hour at two agents at a time). Building the collision engine from its prototype meanwhile.


- `Bash` List collide prototype files and read algorithm: `ls -la /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo/collide/ /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/sc...` (+4 lines)
- `Bash` Wait for the next workflow event: `J=/root/.claude/projects/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/subagents/workflows/wf_173e4620-19f/journal.jsonl; n0=$(wc -l < $J); for i in $(seq ...` (+5 lines)
- `Bash` Save and read the catch design: `cd /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo && python3 -c "` (+9 lines)

**Claude · 2026-10-09 23:27:03 UTC**

Catch design is in too. All four designs are done; the adversarial checks are running. Porting the collision engine from its reference code now.


- `Bash` Read the collision reference implementation: `cat /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo/collide/collide-ref.js`
- `Bash` Port the collision engine inside a scoped block: `cd /home/user/dino-strength-sim && python3 - <<'EOF'` (+24 lines)
- `Bash` Verify the ported collision engine matches the reference output: `D=/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo/collide; sed "s#const C = require('./collide-ref.js');#const C = P;#" $D/final...`
- `Bash` Find which helpers the test expects: `D=/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo/collide; sed -n 20,40p $D/final-tests-engine.out; grep -n "F_HALVES\|C.fallsTh...`
- `Bash` Compare engine port against reference across all tests: `D=/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo/collide; sed "s#const C = require('./collide-ref.js');#const C = Object.assign...`

**Claude · 2026-10-09 23:27:39 UTC**

The collision engine port matches the reference output exactly on all test cases. Now porting the catch engine.


- `Bash` Read the catch flight extension: `cat /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo/catch/flyto.js`
- `Bash` Read the catch reference implementation: `cat /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo/catch/catch2.js`
- `Bash` Read throwOnce flight section: `cd /home/user/dino-strength-sim && grep -n "const fallsBack = sgOn" -A22 src/engine.js`
- `Bash` Port the catch engine and add a no-flight throw option: `python3 - <<'EOF'` (+38 lines)
- `Bash` Run catch tests against reference and engine port: `D=/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo/catch; cd $D && (time node tests.js > tests-ref.out 2>&1); sed "s#const X = re...`

**Claude · 2026-10-09 23:28:25 UTC**

Catch engine port matches the reference on all 52 tests. Checking how long a catch calculation takes at long distances.


- `Bash` Time catch games across distances and strengths: `cd /home/user/dino-strength-sim && node -e "` (+7 lines)
- `Bash` Check workflow progress: `python3 -c "` (+5 lines)

**Claude · 2026-10-09 23:28:51 UTC**

While the checks run, building the Catch and Collide panels. Reading their page specs.


- `Bash` Read catch page text and outputs: `python3 -c "` (+5 lines)
- `Bash` Read the object picker control: `grep -n "function objectPicker" -A16 src/app.html`
- `Bash` Add the Catch panel and render several cases: `cat > /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/bay_catch.js <<'EOF'` (+208 lines)
- `Bash` Render more catch cases: car, partner, far, neutron star: `node /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/weightshot.js '[["c-car",390,{"group":"duo","duoAction":"catch","cObj":"car"...`

**Claude · 2026-10-09 23:31:54 UTC**

Found three bugs in the catch results: a lob "to the other side of the planet" picked an escaping arc, the dense-pair case quoted a meaningless no-air comparison, and a doubled "the". Fixing.


- `Bash` Fix catch overshoot, wording, and surface article: `python3 - <<'EOF'` (+24 lines)
- `Bash` Find doubled article patterns with surface names: `grep -n "the ' + c\.surface\.short\|the ' + cR\.surface\.short\|the ' + cO\.surface\.short\|the ' + c.surface.short" src/app.html | cut -c1-180`
- `Bash` Add a surface-article helper and fix doubled articles: `python3 - <<'EOF'` (+12 lines)
- `Bash` Check workflow and read collide page text: `python3 -c "` (+9 lines)

**Claude · 2026-10-09 23:32:25 UTC**

Writing the Collide panel (push and charge, splat and bounce, the four-cases grid).


- `Bash` Add the Collide panel and render key cases: `cat > /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/bay_collide.js <<'EOF'` (+242 lines)
- `Bash` Render paradox, bolted push and jump-landing cases: `python3 - <<'EOF'` (+11 lines)
- `Bash` Tidy speed wording in Collide; check workflow: `python3 - <<'EOF'` (+22 lines)

**Claude · 2026-10-09 23:36:08 UTC**

All four two-player panels now render. While the checks finish, I'm adding the sources-table rows and assumption cards for the new physics.


- `Bash` List facts from the three two-player designs: `cd /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo && python3 -c "` (+7 lines)
- `Bash` Create the duo research file and add source rows: `cd /home/user/dino-strength-sim && python3 - <<'EOF'` (+30 lines)
- `Bash` Read contest caveats for the assumptions card: `python3 -c "` (+4 lines)
- `Bash` Add assumption cards; rebuild and test: `python3 - <<'EOF'` (+13 lines)

**Claude · 2026-10-09 23:37:48 UTC**

Everything is wired and tests pass. Waiting on the adversarial checks before patching and running the full review.


- `Bash` Wait for the next workflow event: `J=/root/.claude/projects/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/subagents/workflows/wf_173e4620-19f/journal.jsonl; n0=$(wc -l < $J); for i in $(seq ...` (+5 lines)
- `Bash` Read the contest critique: `cd /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo && python3 -c "` (+13 lines)
  - result: Exit code 1
  - result: Traceback (most recent call last):
  - result:   File "<string>", line 7, in <module>
- `Bash` Inspect result entries in the journal: `python3 -c "` (+6 lines)
- `Bash` Save and read the contest critique: `cd /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo && python3 -c "` (+15 lines)
- `Bash` Check which checks have finished: `J=/root/.claude/projects/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/subagents/workflows/wf_173e4620-19f/journal.jsonl; python3 -c "` (+5 lines)

**Claude · 2026-10-09 23:41:45 UTC**

Applying the arm-wrestling and wrestling fixes while the other checks run.


- `Bash` Find shear-strength sources used for surfaces: `cd /home/user/dino-strength-sim && grep -n "ground_concrete_punching\|ground_granite_ucs\|'shear'" research/final-environment.json build-data.py | head -8; g...`

**Claude · 2026-10-09 23:41:48 UTC**

Now the engine changes for the contest fixes.


- `Bash` Apply contest engine fixes and smoke-test: `python3 - <<'EOF'` (+117 lines)

**Claude · 2026-10-09 23:42:31 UTC**

Engine fixes work: equal-strength Hulks now break the table (about 6.5 kN) before their feet matter, and on comic ground strength decides. Updating the panel wording to match.


- `Bash` Update contest wording and re-render: `python3 - <<'EOF'` (+72 lines)

**Claude · 2026-10-09 23:43:56 UTC**

Contest fixes are in. Checking for the density and collision critiques.


- `Bash` Wait for the next critique result: `J=/root/.claude/projects/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/subagents/workflows/wf_173e4620-19f/journal.jsonl; n0=$(grep -c '"result"' $J); for ...` (+5 lines)
- `Bash` Save and read the density critique: `cd /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo && python3 -c "` (+14 lines)
- `Bash` Check sprint standing rule and the Chicxulub reference: `cd /home/user/dino-strength-sim && grep -n "function sprint" -A12 src/engine.js | head -20; node -e "global.window={};require('./src/data.js');console.log(JS...`
- `Bash` Apply density engine fixes and check results: `python3 - <<'EOF'` (+105 lines)
- `Bash` Debug settling time versus mass: `node -e "` (+2 lines)
- `Bash` Switch to Ostriker gravitational drag and fix turnaround: `python3 - <<'EOF'` (+47 lines)
- `Bash` Add no-gravity-drag bound to ranges; rerun tests: `python3 - <<'EOF'` (+38 lines)

**Claude · 2026-10-09 23:54:51 UTC**

Gravity-drag ranges now match the independent check (neutron-star Rex turns back about 3–9 m short of the far side). Updating the Weight tab wording for the 20 density points.


- `Bash` Apply density wording fixes, gating, and rebuild: `python3 - <<'EOF'` (+94 lines)
- `Bash` Add density regression tests and combined-mass duo gates: `python3 - <<'EOF'` (+26 lines)

**Claude · 2026-10-09 23:58:35 UTC**

Density fixes are done and tested. Checking for the collision and catch critiques.


- `Bash` Check workflow status: `J=/root/.claude/projects/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/subagents/workflows/wf_173e4620-19f/journal.jsonl; python3 -c "` (+5 lines)

**Claude · 2026-10-09 23:58:41 UTC**

While the last two checks run, I'm running a browser sweep over every tab, including the new ones, at several densities and strengths.


- `Bash` Write a full sweep script and regenerate the preview: `cat > /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/check2.js <<'EOF'` (+41 lines)
- `Bash` Run the full UI sweep in the background: `node /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/check2.js 2>&1 | tail -40`
- `Bash` Wait for the collide or catch critique: `J=/root/.claude/projects/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/subagents/workflows/wf_173e4620-19f/journal.jsonl; n0=$(grep -c '"result"' $J); for ...` (+5 lines)
- `Bash` Save and read the next critique: `cd /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo && python3 -c "` (+15 lines)
- `Bash` Locate charge speed and collide functions in the engine: `cd /home/user/dino-strength-sim && grep -n "function chargeSpeed" -A20 src/engine.js | head -30; grep -n "    function collide(cA, cB, o) {" src/engine.js`
- `Bash` Read the collide function body in the engine: `sed -n 1691,1790p src/engine.js`
- `Bash` Apply collision engine fixes and spot-check cases: `python3 - <<'EOF'` (+137 lines)
- `Bash` Update Collide wording for the fixes; rebuild and test: `python3 - <<'EOF'` (+62 lines)
- `Bash` Find the paradox bullet line: `grep -n "An unstoppable force would need unlimited momentum" src/app.html | cut -c1-120`
- `Bash` Prepare to rerun the collide wording patch: `sed -i "s/^      items.push('An unstoppable force would need unlimited momentum/items.push('An unstoppable force would need unlimited momentum/" /dev/null; p...` (+9 lines)
- `Bash` Rerun the collide wording patch with the fixed anchor: `python3 - <<'EOF'` (+61 lines)

**Claude · 2026-10-10 00:06:20 UTC**

Collision fixes are in and tests pass. Checking the browser sweep and the last (catch) critique.


- `Bash` Check sweep output and workflow status: `cat /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/tasks/b99y0o626.output | tail -30; python3 -c "` (+5 lines)
- `Bash` Wait for the catch critique: `J=/root/.claude/projects/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/subagents/workflows/wf_173e4620-19f/journal.jsonl; n0=$(grep -c '"result"' $J); for ...`


*Woken · 2026-10-10 00:11:08 UTC · Background task b99y0o626 completed: Background command "Run the full UI sweep in the background" completed (exit code 0).*


*Woken · 2026-10-10 00:11:15 UTC · Background task w3r2vwzbz completed: Dynamic workflow "Research and design the physics for density/weight effects and four Rex-and-Ollie two-person simulations, each adversarially checked" completed. Next: Workflow done; the browser sweep was clean (1,512 page states, no broken text or errors). Reading the catch critique.*

**Claude · 2026-10-10 00:11:18 UTC**

Workflow done; the browser sweep was clean (1,512 page states, no broken text or errors). Reading the catch critique.


- `Bash` Read the catch critique: `cd /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo && python3 -c "` (+12 lines)


---

## Context compaction · 2026-10-10 00:13:09 UTC

The conversation ran out of context here. Everything before this point was replaced, in the model’s working context, by the summary below. The raw log above is complete.

<details>
<summary>The summary written at this point</summary>

```text
This session is being continued from a previous conversation that ran out of context. The summary below covers the earlier portion of the conversation.

Summary:
1. Primary Request and Intent:
   - Original project: build the "Rex Super-Strength Lab". It simulates an indestructible, inexhaustible plush dinosaur (Rex) doing physics of famous feats of strength, at strengths from the strongest human to infinite, and shows forces, what he can lift or throw, and effects on his surroundings. This was done earlier, with 3 audit rounds; commit a5795ee is pushed and the artifact is published.
   - **Current request (latest user message):** "New feature: adding density and weight, and the effect that would have on the environment. Like if Rex were the density of a neutron star. Also maybe adding in Rex’s boyfriend, Ollie, who is equally as overpowered and indestructible, for two person simulations. (Arm wrestling, regular wrestling, games of catch, unstoppable force vs immovable objects)". The user attached an image of Ollie: a plush bull-man with horns, nose ring, leather vest, cargo pants and laced boots (no claws). Rex is shown as a dark scaly kaiju with orange spines.
   - Standing preferences:
     - Act as a professional critic, not a cheerleader; loyalty only to factual accuracy, clarity and intellectual honesty.
     - Say "I don't know" or "I cannot verify this" when information is lacking; admit mistakes briefly; no filler niceties.
     - "Always run in ADHD Mode": i-have-adhd rules are lead with the action, number steps, cap lists at 5, no preamble or recap, restate state, give specific time estimates, end with one concrete next action.
   - Constraints:
     - Develop on branch `claude/dinosaur-strength-physics-8o13ft` in lodge-docs; push with `git push -u origin <branch>`; do NOT create a PR unless asked.
     - Commit messages end with:
       Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
       Claude-Session: https://claude.ai/code/session_01SsJhZqR8L4f82P9Dfpr4zn
     - No model identifiers in artifacts or code.
     - Ultracode is on: use workflows for substantive tasks; concurrency is 2 agents.
     - Don't invent canon for Ollie beyond the image. Default him to Rex's size, mass and strength, with his own adjustable settings.

2. Key Technical Concepts:
   - Density = m / V, with V = 0.18·(H/2)³ m³ (BASE_V). Equal-volume radius R = (3V/4π)^(1/3) (0.3503 m at 2 m). Black-hole density 3c²/(8πGR²) is 1.31e27 kg/m³ at 2 m.
   - Self-gravity:
     - g_s = GM/R²; v_esc = √(2GM/R); dBeat = √(GM/g)
     - Bondi radius GM/a0², rate 4πλG²M²ρ/c³ with λ = 0.625 (rough)
     - rCrush = ρ_rock·GM/σ; Jeans 6×v_rms; tidal tension at 10 m = 80·Δa/8
     - atmosphere loss time = 5.1e18 kg / Bondi rate
   - PREM Earth model, gravity tunnel ≈ 38 min (Klotz 2015).
   - 3-D RK4 fall through a rotating Earth:
     - buoyancy, Poncelet ρv² drag, and rock strength (1.7 GPa, range 0.1–4.1 GPa) as a friction impulse
     - Ostriker (1999) dynamical friction F = 4πG²m²ρI(M)/v² (c_s = 6 km/s, lnΛ = 5)
     - orbit-averaged settling
   - Planet regimes: reshapes (≥ 1e-3 M_E), earthFalls (≥ M_E), blackHole. Their energies are floors.
   - Contests: Newton's third law; footing via anchorCapacity; arm force 25% of strength (estimate, 10–40%); the table carries the push until latCap (5 kN × sT²) is exceeded, then feet-only; pinning via pushApart on forearm effective mass; walk-out; shove; lift; throw.
   - Collisions:
     - relativistic headOn with splat and bounce bounds; contactForces (plush squash, matter 36.1 km/s, light-limit)
     - held test per bound; boltsLate regime (stress wave c_rock·t vs charger mass)
     - run-up speed u = u_drag·√(1 − e^(−2kx/m))
     - dipole rock load; unlimited momentum cases
   - Catch: aimed throws (aimEasy/aimHard over flyTo), catch over 0.3H stroke, Sutton–Graves heating, gravity wells (patched), fireball sweep m/(ρ0A).
   - Artifact page contract (tokens with dark mode, Google Fonts, phone width), Playwright screenshots, Node tests.

3. Files and Code Sections:
   - **/home/user/dino-strength-sim/src/engine.js** (main physics; heavily extended)
     - K additions: `G: 6.6743e-11`, `M_E: 5.9722e24`. `BASE_V = 0.18`, `bodyVolume(H)`. makeBody adds `volume, rho: m/volume`.
     - Self-gravity helpers: `eqRadius(body)`, `blackHoleDensity(H)`, `isBlackHole(body)`, `mutualGravity(bA,bB,d)` → {d, dContact, F, vEsc, Ebind}, `fallTogether(bA,bB,d0,d1)` → {t, vRel, E}.
     - Density section (inserted before "Moves"):
       - `W8` constants: OMEGA_E, SIGMA_ROCK 1.7e9, RHO_ROCK 2700, UCS_ROCK 2e8, R_AIR, NQ {sand 18.40, gravel 64.19}, WALK_LOAD 1.2, JEANS 6, E_NM, P_NM, RHO_OSMIUM 22587, M_RESHAPE 1e-3·M_E, SIGMA_LOW 0.1e9, SIGMA_HIGH 4.1e9, CS_ROCK 6000, BONDI_LAMBDA 0.625
       - PREM table and functions
       - `bodyGravity(body)` (includes tidal10 via d10Tension, atmosphereLossT, rCrush, rCrushUnconfined, tidal1g, decompJ)
       - `infallFrom`, `moveCheck(F,m)` (stand 1.4F ≥ W, walk 1.4F ≥ 1.2W, run F > W)
       - `groundUnderWeight` → regimes comic/stands/sinks/outOfSight/punchesThrough/fallsThrough, plus strongRockHolds/weakRockFails/rockCap
       - `dfI(M)` and `dfCoef(m,rho,v)` (Ostriker)
       - `fallThrough(body,{record,full,tMax,sigma,k,noDF,noDrag,latDeg})`:
         - innermost-pass detection requires `minR < 0.5*RE`
         - dt = `Math.min((RE - r < 20e3) ? 1 : (vrel > 100 ? 3 : 10), Math.max(1e-3, 0.002 * Math.max(r, 1e6) / Math.max(v, 1)))`
       - `settle(body,Amax,{sigma,k,noDF})`, `planetRegime(m,grav)` (eLowIsFloor)
       - `weight(ctx,{record})`, cached; it computes fall, settle, energyJ, stuckRange, shortRange, settleRange, gravDragDominant
     - Helpers: `selfPull`, `selfGravityOn(body)` (G m/(0.5H)² ≥ 1e-3 g), `heldRadius(body,obj)`, `escapeSpeedFrom`, `vInfinity`.
     - lift():
       - `gSelf`; W = m(g + gSelf); `move = moveCheck`
       - canLift requires move.stand
       - returns cantStand, standNeedKg, selfPullG
     - throwOnce():
       - `holdLoad = mB*g + obj.m*gSelf`
       - r0 = max(eqRadius, 0.25H); escapeNeeded; vOut; fallsBack; rMax; landsNear
       - `ctx.noFlight` option skips the flight
     - Contest section:
       - constants: `AW {forceFrac: 0.25, lever 0.19, effMass, pinAngle, elbowLoad 0.036, holdArm}`, `TABLE {refH 1.7562, depth 0.660, elbowCap 10e3, slamJ 102, latCap 5e3}`, RING_D 4.55, HUMERUS_NM 190
       - helpers: sameForce, footingOf, groundTear, shoveShare, shoveDrive
       - `armWrestle`: tableLat, tableBreaks, A = tableBreaks ? min(P,R) : P
       - `pushMatch`: holdOf2 lying rule, canLiftA/B, undefinedPush when both bolted and either F is ∞
       - `shoveOnce` (undefinedPush, fAwhole for the shover's slide), `shove`, `shoveBoth`
       - `liftPartner`: Fg = max(overhead, 0.385·G mA mB/dC²)
       - `throwPartner`: bolting-aware vEsc, vApart, fallsBack, heavierPartner, sinks
     - `COLLIDE` IIFE (ported from collide-ref.js):
       - COL constants, plus C_ROCK 5000
       - headOn, headOnCM, splatWithFooting, contactForces, rockLoad(C,cHold,dSep,dipole), slideTo, holdOf, standoff
       - `chargeSpeed(cA, source, gb, runUp)`: returns v, u, vTopRun, x95, runUp
       - `collide(cA,cB,{source,gb,bounce})`: held per bound, heldOnlyIfSquishy, boltsLate (+ out.bolts {Eground,total,crater}), unlimitedVsBolted ('closedSystem' | 'rockGives' | 'planetMoves'), Elocal, KA, airStopsHim, airRunUp capped, outcome includes 'boltsLate'
     - `CATCHGAME` IIFE (ported from flyto.js + catch2.js):
       - CATCH constants, MATERIALS, OBJ_MATERIAL, flyTo (hStop, xStop, Rn heating)
       - aimEasy (cached), aimHard, farthest, releaseTable (uses noFlight ctx), wells, wellPath, catchIt, heatVerdict, fireballAt
       - `leg`: plus a 'no-arc' result when the lob overshoots
       - tossPartner, game, partnerAsObject, pushStartRadius
     - Exports include:
       - BASE_V, bodyVolume, eqRadius, blackHoleDensity, isBlackHole, mutualGravity, fallTogether
       - W8, PREM, premRho, premG, premPhi, premSolid, bodyGravity, infallFrom, moveCheck, groundUnderWeight, fallThrough, settle, planetRegime, weight, selfPull, escapeSpeedFrom, vInfinity
       - AW, TABLE, RING_D, HUMERUS_NM, armWrestle, pushMatch, shove, shoveBoth, liftPartner, throwPartner
       - CATCH, flyTo, catchGame, catchLeg, tossPartner, catchIt, partnerAsObject, catchMaterials, `catchMinD: (bT,bC,obj) => pushStartRadius(bT)+heldRadius(bC,obj)+0.3*bC.H+1`
       - COL, headOn, standoff, chargeSpeed, collide, holdOf, rockLoad, contactForces
   - **/home/user/dino-strength-sim/src/app.html** (page; heavily extended)
     - HTML: density field; Ollie `<details id="ollie-setup">` with `__DUO_IMG__`; group seg `#grp-solo/#grp-duo`.
     - CSS: group-seg, tabs (3 columns; .n4 2 columns), dens-read, duo-img, o-dial, o-big, .hint, `.field label.check`, duo-head/fighter, table.cases (stacks under 480 px).
     - State DEFAULTS add:
       - group 'solo', duoAction 'arm'
       - oSame true, oLogKg, oInf, oH 2, oM 180, oAnchor
       - wrestleMove 'push', wrestleWho 'rex'
       - cObj 'baseball', cLogD 1, cStyle 'easy', cMiss false
       - colMode 'charge', colWho 'ollie', colSrc 'sprint', colGB log10(100/c), colInf false, colBounce 'splat', colImm false
       - all with VALID validators
     - Functions:
       - ctxOllie, isDuo, curAction, tabList, setAction, buildTabs
       - densityPresets(H), densityControl, renderDensity, fmtDensity, densityCompare, theSurf
       - compareEnergy: "roughly N×" for Chicxulub
       - soloGate (black hole / planet / rCrushUnconfined ≥ 1 km / fallsThrough callout)
       - fighterCard/duoHeader, duoGate (per-body regimes, combined mass ≥ 1e-3 M_E, combined horizon, sinks)
       - bayWeight (+ earthCutaway, massRefs, nearestMassRef, densityChipRow, fmtDuration, YEAR)
       - bayArm, wrestle bays, catch bays (scheduleBaySlow 180 ms), collide bays (fmtV, COLAGE, caseGrid, rockBullet, rockChip)
       - strength slider uses requestAnimationFrame
     - Throw bay: fallsBack/landsNear branch and an escape-cost bullet. Lift bay: cantStand verdict and chip, plus a "His pull on it" tile.
   - **/home/user/dino-strength-sim/build.js**: embeds dino.jpg and duo.jpg (`.replace('__DUO_IMG__', duo)`).
   - **/home/user/dino-strength-sim/build-data.py**:
     - topics: humans, fiction, objects, environment, density, duo
     - densities list: plush 30, water 1000 (default), human 1060 (chip None), steel 7850, osmium 22587, whitedwarf 2.77e9, nucleus 2.7e17 (chip None), neutronstar 4.12e17
     - massRefs (Deimos, Phobos)
     - a loop adding rows for all density and duo facts; data includes densities and massRefs; 222 source rows
   - **research/final-density.json** (32 facts from the density design) and **research/final-duo.json** (56 facts from the contest, catch and collide designs). Facts still need the critique corrections, e.g. WD range 2.59e9–2.96e9, Ollie footing/ground tear sources, Dini URL, Adair p. 28.
   - **src/static-data.js**: new assumption cards: Density and weight; His own gravity; Sinking and falling through the Earth; Rex and Ollie; Game of catch; Unstoppable force vs immovable object (with critique wording fixes).
   - **test/calibration.js**: added the infinite-strength = top-of-dial check, the comic-share drift check, and the density tests listed above. All pass.
   - **assets/duo.jpg** (new, 54 KB).
   - Scratch scripts in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/: weightshot.js (renders states and dumps bay text), check2.js (full sweep), edge.js, aside.js, ladder.js, patch scripts.
   - Design and critique JSONs in scratchpad/duo/: design-{density,contest,catch,collide}.json and critique-{contest,density,collide,catch}.json, plus prototypes (density/calc/weight.js, contest/contest.js, collide/collide-ref.js, catch/flyto.js and catch2.js).
   - lodge-docs repo copy at /home/user/lodge-docs/rex-strength-lab (README updated earlier; needs syncing with all new work).

4. Errors and fixes:
   - In-page `const NAMES` clash (already used for number names): renamed the duo map to `WHO`.
   - Python patch assertions failed when anchors didn't match (the gravity bullet's leading "} else if"; the paradox bullet's leading "if (...)"). Fixed by using the exact substring and rerunning the whole patch.
   - fallThrough was slow (up to 1 s) at 1e11–1e12 kg. Fixed with an r-floor dt, the 3 s cap, averaged settling after the first pass, and full 3-D only when depthShort > 0.3 R_E.
   - The settle "remainder" missed elapsed time. Fixed by adding fall.t.
   - Turnaround hysteresis used a stale speed (depthShort 0). Fixed: plain prevVr plus a `minR < 0.5*RE` requirement.
   - A BHL drag first attempt gave wrong low-speed behaviour. Replaced with Ostriker dynamical friction. The no-drag test now uses the `noDrag` option.
   - The catch lob to the antipode picked an escaping arc. Added the 'no-arc' result.
   - Doubled article ("the the concrete slab"). Added the `theSurf()` helper.
   - logBars clipped long values. padR is now computed from value-text width.
   - The weightshot output was stale because preview.html is only regenerated by `node test/shots.js`. I now run shots.js after each build.

5. Problem Solving:
   - All four designs were adversarially checked. The contest, density and collide critiques are fully applied in the engine and page. Key results after the fixes:
     - Hulk-vs-Hulk arm wrestling breaks the table at about 6.5 kN, then becomes a feet-only dead heat at 1.06 kN. On comic ground, strength decides.
     - Neutron-star Rex: first trip 38.2 min, turns back 5.3 m short (range 2.8–8.5 m), 809 km west, settles in 126 years (range 81–29,000).
     - White-dwarf Rex sticks about 216 km from the centre (range 0–646 km).
     - Default collide: run-up 19.3 m gives 14.7 m/s.
   - The browser sweep (an older build, before the critique fixes) covered 1,512 states with 0 bad text and 0 errors.
   - **Catch critique (just read, NOT yet applied).** Required fixes:
     1. Critical: hand inertia. Use a first-contact inelastic collision with m_h = 2×handEff (7.9 kg at default), energy ½μv² absorbed over a palm give of 2–5 cm (estimate). The stroke then stops m + m_h from v·m/(m + m_h). Base the baseball and grip checks on the peak contact force.
     2. Critical: a survival gate before 'caught'. The object breaks up in flight when ρ(h)v² exceeds crush strength (Collins 2005); heat 'destroyed' uses the plasma wording; if F/A_front exceeds crush, the verdict is "stops the wreckage". Rename 'Clean catch' to "His arms can stop it" and never show it next to "Hands punch into it".
     3. Relativistic classes: 'arrives' becomes a white-hot plasma/debris front with no hand catch (momentum push only); 'before' is an order-of-magnitude blast; use a relativistic snowplow for γ ≫ 1.
     4. Sliding friction: use anc.Rslide(F) by bisection when the catcher slips; include gravity along the path (v_eff² += 2 g d sin γ); pass the full line force to N(F); add Ollie's weight to the foot load in the partner toss.
     5. Drag on dense-partner straight-line flights (integrate it; bisect the launch speed); flag drag when its energy exceeds 1% of launch energy.
     6. Radiation: show heat as a range (convection only to plus σT⁴); flag from about 8 km/s or nose > 1 m; never call it an "upper bound".
     7. Page text: print ½mv²/d only when he doesn't slip; cut or fix the mitt sentence.
     8. Consistent reach geometry: chest at max(eqRadius, 0.07H) + L/2, hands 0.3H further out.
     9. Environmental effects: drag energy near the thrower and catcher via blastBlock, sonic boom at the catcher, catch energy in TNT.
     10. Object size: when it is larger than the catcher, "lands on and around him".
     11. Minor: v_L = 0 "just lets go" for a dense catcher without a hump; 'unreachable' wording when air limits a fastball; no-air comparison with Δh; add push.t to the round trip; subsonic Cd for slides; limestone 2.5 MJ/kg; Adair p. 28; extrapolated flag below 2,145 m/s; skin sentence → "the heat reaching it could melt under 1% of it (rough)"; shuttle tiles note.

6. All user messages:
   - (Earlier, from the prior summary) The first message requested the super-strength simulator with the plush dinosaur image. A second message: "His name is Rex by the way. Basic I know but still. I'm going to bed so just get as far as you can."
   - Current: [image of Ollie and Rex] "New feature: adding density and weight, and the effect that would have on the environment. Like if Rex were the density of a neutron star. Also maybe adding in Rex’s boyfriend, Ollie, who is equally as overpowered and indestructible, for two person simulations. (Arm wrestling, regular wrestling, games of catch, unstoppable force vs immovable objects)"

7. Pending Tasks:
   - Apply the catch critique fixes (list in section 5) in engine.js CATCHGAME and in bayCatch/catchPartner.
   - Update the research facts per the critiques:
     - WD density range 2.59e9–2.96e9; Bondi λ note
     - Ollie footing as a plain assumption; ground tear citing ground_concrete_punching_shear_stress_aci
     - Dini 2021 PubMed URL (33615250); Adair p. 28
     - limestone heat; aw_force_share range 0.1–0.4; table lateral capacity estimate fact
     - collide fixes: squash comparisons, runup, rock radius, F_HALVES, people restitution
   - Then rebuild: `python3 build-data.py; node build.js; node test/shots.js`; run `node test/calibration.js`; run the test/sweep.js engine sweep and the check2.js browser sweep on the current build.
   - Run a final adversarial audit workflow over the new features (lenses: claims/physics, regression, data, ux; verify each finding), then fix.
   - Sync the dino-strength-sim files to /home/user/lodge-docs/rex-strength-lab:
     - src/*, build.js, build-data.py, tests, research/final-*.json (including density and duo), assets/duo.jpg, dist/index.html
     - update the README (new features, test times)
   - Commit with the attribution trailers; push to claude/dinosaur-strength-physics-8o13ft.
   - Copy dist/index.html to scratchpad rex-strength-lab.html and republish the artifact at the same path (URL https://claude.ai/artifact/YFpbHtX8tM2Qwffd6znbZP).
   - Mark tasks #6–#9 complete.
   - Final ADHD-style message: link first, headline physics findings (neutron-star Rex falls through the Earth, etc.), what was verified, remaining caveats, commit, one next action. No PR.

8. Current Work:
   I had just extracted and read the catch critique (saved to scratchpad/duo/critique-catch.json). Its verdict: "The design is not ready to ship." Critical issues: hand inertia ignored ("For anything lighter than Ollie's hands (7.9 kg), about 98% of the ball's energy goes into a first-contact collision"), and "'Caught' and 'Clean catch' are shown for objects that are already destroyed". It also lists several major issues (relativistic classes, sliding friction, drag on dense-partner flights, radiation, page-text equation, reach geometry, environmental effects, object size). The contest, density and collide critique fixes were already applied, and calibration tests pass ("all checks passed"). The workflow wf_173e4620-19f is complete.

9. Optional Next Step:
   Apply the catch critique fixes, starting with the two critical ones in engine.js CATCHGAME.catchIt and the bayCatch text:
   - first-contact collision with hand mass m_h = 2×handEff and a labelled palm-give estimate
   - a survival gate (ram pressure ρv² vs crush, heat 'destroyed', F/A_front vs crush), and rename "Clean catch" to "His arms can stop it"
   Then do sliding friction via Rslide, gravity along the stroke, relativistic 'arrives' as a plasma front, and the environmental-effects block. After that: rebuild, test, run the final audit workflow, sync and commit to lodge-docs, and republish. This continues the user's request: "adding in Rex’s boyfriend, Ollie ... for two person simulations. (Arm wrestling, regular wrestling, games of catch, unstoppable force vs immovable objects)".

If you need specific details from before compaction (like exact code snippets, error messages, or content you generated), read the full transcript at: /root/.claude/projects/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387.jsonl
Continue the conversation from where it left off without asking the user any further questions. Resume directly — do not acknowledge the summary, do not recap what was happening, do not preface with "I'll continue" or similar. Pick up the last task as if the break never happened.
```

</details>

---


- `Bash` Locate catch-game code in engine: `cd /home/user/dino-strength-sim && wc -l src/engine.js src/app.html && grep -n "CATCHGAME\|function catchIt\|function heatVerdict\|function fireballAt\|funct...`
- `Bash` Print catch critique: `cd /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo && python3 -c "` (+1 lines)
- `Bash` Print rest of catch critique: `cd /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo && python3 -c "` (+1 lines)
- `Bash` Show CATCHGAME engine code: `cd /home/user/dino-strength-sim && sed -n 1823,2345p src/engine.js`
- `Read` /home/user/dino-strength-sim/src/engine.js
- `Bash` Locate catch bay functions in page: `grep -n "function bayCatch\|function catchPartner\|function catchLegText\|catchGame\|catchLeg\|tossPartner\|Clean catch\|function bayToss" src/app.html | hea...`
- `Read` /home/user/dino-strength-sim/src/app.html

**Claude · 2026-10-10 00:15:52 UTC**

Working on the catch-game fixes now (hand inertia, survival gate, sliding friction, drag, radiation, environment). Checking the engine helpers they depend on.


- `Bash` Find helper functions used by catch: `grep -n "function anchorCapacity\|Rslide\|handEff\|whipEff\|function stagnationT\|function throwObject\|function throwOnce\|crush:\|function overpressureAt\|...`
- `Bash` Read anchorCapacity, stagnationT, throwOnce: `sed -n 295,360p src/engine.js; sed -n 1015,1135p src/engine.js; grep -n "crush" src/engine.js | head -20; grep -n "crush\|  L:" src/static-data.js | head -10`
- `Bash` Find object data with crush strength: `ls src; grep -rn "crush" src/*.js | grep -v engine.js | head -5; grep -n "function catchBall\|OBJECTS\b" src/app.html | head; sed -n 860,880p src/app.html; s...`
- `Bash` List objects with mass, size, crush: `node -e "` (+4 lines)
- `Bash` Inspect flyTo heat lines and body fields: `sed -n 1823,1850p src/engine.js && grep -n "if (Rn > 0)" src/engine.js && grep -n "throwStyle = \|function throwStyle" src/engine.js && sed -n 75,100p src/en...`
- `Bash` Add radiation, ram pressure, drag tracking to flyTo: `cp src/engine.js /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/engine.pre-catchfix.js && python3 - <<'EOF'` (+40 lines)

**Claude · 2026-10-10 00:20:33 UTC**

Now rewriting the catch engine section (constants, geometry, wells with drag, catch with hand inertia, survival gate, relativistic snowplow).


- `Bash` Check the section start lines: `awk 'NR>=2002 && NR<=2030' src/engine.js`
- `Bash` Write new catch constants and geometry block: `mkdir -p /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/catchfix && cd /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba260938...` (+44 lines)
- `Bash` Write and splice new catch engine logic: `cd /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/catchfix && cat > tail.js <<'EOF'` (+342 lines)
- `Bash` Fix catchMinD export and run calibration: `python3 - <<'EOF'` (+7 lines)
- `Bash` See how tests build catch contexts: `grep -n "catch\|function ctxOf\|makeCtx\|const ctx" test/calibration.js | head -30; ls /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchp...`
- `Bash` Find test-case setups in critique probes: `cd /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo/catch-check/ && grep -n "T9\|T10\|T12\|T13b\|T15\|T14\|T5\b\|T4\b\|T3\b\|mk("...`
- `Bash` Read probe setups for T13b, T15, wells: `cd /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo/catch-check/ && sed -n 1,40p probe_b.js; sed -n 1,30p probe_wells.js`

**Claude · 2026-10-10 00:23:37 UTC**

Probing the new catch engine against the critique's test cases.


- `Bash` Run critique test cases on new engine: `cd /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/catchfix && cat > probe.js <<'EOF'` (+40 lines)
- `Bash` Apply radiation and stroke fixes, rerun probes: `cd /home/user/dino-strength-sim && python3 - <<'EOF'` (+26 lines)

**Claude · 2026-10-10 00:26:25 UTC**

Engine numbers now match the critique's corrected expectations (within the new reach geometry). Rewriting the catch page text next.


- `Bash` Locate page formatting helpers: `cd /home/user/dino-strength-sim && grep -n "function speedOnly\|function fmtSpeed\|function fmtMach\|function fmtRatio\|function fmtArea\|const capital\|func...`
- `Bash` Read formatting helper definitions: `sed -n 465,510p src/app.html; grep -n "const speedOnly\|speedOnly =\|const happens\|happens =\|const math =\|const tiles\|const tile =\|const verdict\|verdic...`
- `Bash` Check for section-heading pattern in bays: `grep -n "el('h3'\|el('h4'\|subhead\|class: 'sec'" src/app.html | head; grep -n "\.happens\b\|\.happens " src/app.html | head -3`
- `Bash` Look for an existing surroundings section style: `grep -n "Effects\|Around him\|surroundings\|envHead\|'What it does" src/app.html | head; sed -n 140,160p src/app.html`
- `Bash` Splice new catch page text into app.html: `cd /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/catchfix && cat > page.js <<'EOF'` (+251 lines)
- `Bash` Check page has g constant: `grep -n "K.g;\|g = K.g\|, g }\|{ g,\| g } = " src/app.html | head -5; grep -n "too-big" src/app.html | head -3`

**Claude · 2026-10-10 00:28:25 UTC**

Page text rewritten. Building and rendering the catch bay to check the text.


- `Bash` Fix height expression; inspect render script: `sed -i "s|' tall. It lands on and around him|' tall. It lands on and around him|; s|fmtDist(L.wells ? 2 \* L.hStop / 1.8 : 2)|fmtDist(L.hStop / 0.9)|" src/ap...`
- `Bash` Rebuild page and render catch states: `python3 build-data.py >/dev/null && node build.js >/dev/null && node test/shots.js >/dev/null 2>&1; ls -la dist/ | head; S=/tmp/claude-0/-home-user/6435a7db-...`
- `Bash` Add bursts flag; render more catch states: `python3 - <<'EOF'` (+26 lines)
- `Bash` Fix tile label; show state defaults: `sed -i "s/sig(a.aim.thetaDeg, 2) + '° up · ' + (a.style === 'easy' ? 'gentle lob' : 'full strength')/sig(a.aim.thetaDeg, 2) + '° up · ' + (a.style === 'easy'...`
- `Bash` Render dense, far, relativistic catch states: `python3 build-data.py >/dev/null && node build.js >/dev/null && node test/shots.js >/dev/null 2>&1; S=/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2...`
- `Bash` Show verdicts for dense and shot cases: `grep -n "function compareEnergy" -A 12 src/app.html | head -20; S=/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad; NS=$(python3 -c "...`

**Claude · 2026-10-10 00:31:21 UTC**

Fixing wording issues found in the render: stone verbs, angle display, wreckage/burn-up tiles, neutron-star "can't hold" text, and fireball surroundings.


- `Bash` Apply page wording and tile fixes: `python3 - <<'EOF'` (+76 lines)
- `Bash` Find exact too-weak text: `grep -n "would need about" src/app.html`
- `Bash` Patch too-weak verb text via sed: `sed -i "s/', and at that speed it would ' + verbOf(L.heat) + ' away long before it got there.';/', and at that speed it would ' + verbAway(L.heat) + ' long b...`
- `Bash` Rebuild and re-render problem catch states: `python3 - <<'EOF'` (+71 lines)
- `Bash` Make math lines and chips conditional: `python3 - <<'EOF'` (+25 lines)
- `Bash` Read Game of catch assumptions card: `grep -n "Game of catch" src/static-data.js | head -2; python3 -c "` (+1 lines)
- `Bash` Update Game of catch assumptions card: `python3 - <<'EOF'` (+10 lines)
- `Bash` List research fact keys and structure: `python3 -c "` (+7 lines)
- `Bash` List failed fact checks across critiques: `cd /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/duo && python3 -c "` (+7 lines)
- `Bash` Print facts that need critique corrections: `cd /home/user/dino-strength-sim && python3 -c "` (+10 lines)
- `Bash` Check engine constants referenced by facts: `grep -n "forceFrac\|latCap\|HUMERUS_NM\|C_ROCK\|RUNUP\|runUp\b" src/engine.js | head -12; grep -n "settleRange\|126 years\|29,000\|81" src/app.html | head -5`
- `ToolSearch` select:TaskUpdate
- `TaskUpdate` #6 status=completed
- `TaskUpdate` #8 activeForm=Applying catch critique fixes and fact corrections
- `Bash` Check page uses of humerus, Newton depth, halves: `grep -n "HUMERUS_NM\|25–31\|31 N·m" src/app.html | head -5; grep -n "Newton\|impact depth" src/app.html | head -5; grep -n "planet itself would come apart\|1...`

**Claude · 2026-10-10 00:33:50 UTC**

Page already reflects the contest/collide fixes. Updating the research facts to match.


- `Bash` Apply critique corrections to research facts: `grep -n "F_HALVES" src/engine.js src/app.html | head; python3 - <<'EOF'` (+102 lines)
- `Bash` Find ACI punching-shear fact source: `grep -l "ground_concrete_punching_shear_stress_aci" research/*.json; python3 -c "` (+6 lines)
- `Bash` Fix source URL, rebuild, run calibration: `python3 - <<'EOF'` (+8 lines)
- `Bash` Inspect calibration test helpers: `grep -n "catch\|function check\|function near\|const ok\b\|^function\|mk(" test/calibration.js | head -30; tail -30 test/calibration.js`
- `Bash` Read calibration header helpers: `sed -n 1,20p test/calibration.js`
- `Bash` Add catch regression checks and run them: `python3 - <<'EOF'` (+37 lines)
- `Bash` Make toss foot-load test explicit: `python3 - <<'EOF'` (+10 lines)
- `Bash` Replace toss test line by index: `python3 - <<'EOF'` (+9 lines)

**Claude · 2026-10-10 00:40:20 UTC**

Catch fixes in and tested. Running the engine sweep and full browser sweep on the current build.


- `Bash` Run engine sweep; inspect browser sweep script: `(time node test/sweep.js 2>&1 | tail -8) 2>&1; head -30 /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/check2.js`
- `Bash` Add catch states to browser sweep: `cd /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3 && python3 - <<'EOF'` (+7 lines)
- `Bash` Run full browser sweep in background: `cd /home/user/dino-strength-sim && node /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/check2.js > /tmp/claude-0/-home-user/6435...`

**Claude · 2026-10-10 00:45:29 UTC**

While the browser sweep runs (~1 h), launching the final adversarial audit of the new features.

