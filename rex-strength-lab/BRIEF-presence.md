# Rex lab: restraint and presence (brief)

The plan for a new part of the Rex Super-Strength Lab. Read `/CLAUDE.md` first, especially the canon on restraint; its standards apply here. Drafted by the collaborator for a cloud run; nothing here is built yet.

## Why

The lab answers "what happens at strength X?" Most moves run all-out: throws, jumps, stomps, punches and claps drive with their full share of the dial. Canon now says Rex and Ollie do the opposite. They want to be seen as heroes, so by default each uses the least disruptive way to exist in the world, and uses comic-book physics selectively and on purpose. Restrained, they feel about kaiju-like on a local scale: footsteps you can feel, water glasses rippling a few metres away. Nothing is harmed.

The lab has no way to show that. This brief adds three things.

## 1. Effort, separate from strength

- The dial stays "how strong he is". A new control sets **effort**: how hard he chooses to push, from gentle to all-out (a share of the dial, or a target such as "throw it 30 m").
- **The default is least disruptive:** the gentlest effort that still does what the move is for. Each move needs a stated goal. For example: lift it clear of the ground; throw it to a target distance (the game of catch already aims an "easy" lob); jump to a height; walk at a pace.
- **Courtesy ceiling:** for each move, the most effort he can use before something nearby comes to harm. The hazards are the ones the engine already computes (windows breaking at a distance, people knocked down, the ground giving way, an object crushed, quakes felt, sonic booms), plus the new presence hazards below. Show which hazard sets the ceiling, and how far it reaches.
- **The page opens in least-disruptive mode** (owners' decision). A first-time visitor sees the heroic default and chooses anything louder.
- **Not-so-heroic modes** (owners' decision): named effort presets for when they want to enjoy some property damage, at rising scales. Each preset is set by a hazard, not by a number. For example, rattle the windows, break windows on the street, flatten a parked car, crack the road, level a block. Each says what it would do and how far it reaches. All-out is the last preset, and the page says plainly what it does to the surroundings.
- **One effort for both of them in the two-player tests** (owners' decision), unless the visitor gives Ollie his own as a what-if, the same way his strength works today.
- Reuse the existing physics and its threshold machinery (the strength ladder's `thresholdDefs` already bisects "the strength at which X happens"). Effort is mostly a new framing of it.

## 2. Selective comic physics

Named switches, off by default. Each one says exactly what it changes; everything else stays real.

**How it works (canon):** the energy they put out comes from them, so they can take it back, absorbing what they dish out. Energy is conserved: it goes back into them, so from outside it only looks as if it vanished. Momentum is not absorbed: it still goes into them and through their feet into the ground (restrained effort makes that gentle). So there are two kinds of switch.

**Material limit suspended** (energy and momentum go where real physics sends them):
- **Gentle hold (tactile telekinesis):** his push is spread through the whole held object in proportion to its mass, so his grip doesn't stress it (it accelerates like a falling body, with no internal load). It removes grip crushing in Lift, Throw and the game of catch, the hands punching through at launch, and an object sagging under its own weight. It does **not** remove the ground's load under him, his recoil, air pressure on a thrown object's front (break-up, heating), or the impact where it lands.
- **Safe passenger:** the same spread push applied to a person he carries or throws to safety, so they feel no harmful g-force. The lab doesn't model passengers yet; add the simplest version (a person's mass and a survivable g limit, sourced).
- **Comic ground** (exists): his footing never fails.
- **Bolted to the planet** (exists): his feet never slide; the Earth takes the recoil.

**Absorbed** (the energy that would harm the surroundings goes back into them):
- **Silent strike:** no blast or sonic boom from a punch or clap.
- **Soft landing:** no crater or quake when he lands or catches something. The momentum still reaches the ground, gently.
- **Cool flight:** no drag heating on a fast-thrown object. That heat is the object's own kinetic energy turned to heat by the air, so taking it away means absorbing it. The object still slows down, and its momentum still goes into the air.

**Not offered:** "no recoil". Absorbing energy cannot remove momentum.

All four new switches are wanted (owners' decision). Label every switch wherever its effect shows, with what it suspends or how much energy was absorbed. Propose any further switch before building it.

### What happens to absorbed energy (canon: four modes)

These apply wherever an absorbed switch is on.

1. **Endless ocean (default).** The energy goes back into the store of infinite power they draw on but don't manifest: "a drop in an endless ocean". No mass gain, no consequences. Show how much energy was absorbed, and label this as the canon mechanism.
2. **Gradual growth.** The energy becomes mass (E ÷ c²) over a chosen duration. Duration is the safety factor: slow growth shoves the surroundings aside harmlessly, but a surface that expands fast enough pushes a pressure wave and the growth itself becomes a blast. Compute the new size and weight, and the **shortest safe duration** for each amount absorbed.
3. **Instant growth.** All at once, and the surroundings deal with being shoved aside. Truly zero duration means infinite energy, so choose and state a physical timescale (for example, the time sound takes to cross the body). Size the blast from how much air and ground is displaced, and how fast.
4. **Runaway.** As 3, but the consequences are absorbed as growth too, so it can feed back. If it would run away, a **half-life** dumps the absorbed energy into the endless ocean (mode 1) to bring it to a halt instead of growing forever.
   - Rough first look, to verify: for ordinary blasts the feedback dies out at once, because shoving the surroundings aside returns roughly 10⁻¹⁵ of the energy the growth itself took.
   - A real runaway needs a feedback term comparable to their own mass-energy. Their own gravity is the candidate, and it approaches that only near black-hole density, which the Weight tab already computes. If that holds, the half-life matters only in that regime.
   - Show the loop's ratio and where it crosses 1.
   - Settled by the owners (12 Oct 2026; CLAUDE.md): the side effects are paid from the absorbed energy (a round trip, which adds nothing), and the energy gravity releases goes to the endless ocean. So the loop never crosses 1, and the half-life control was removed (owner, 12 Oct 2026). Instant growth happens about his middle; the lift the ground's push would give him goes to the endless ocean, so he is never thrown up.

In the growth modes (2–4), show the mass gained once it is worth mentioning, and apply the Weight tab's physics (their own gravity, sinking) to the heavier body.

**Growth form** (for modes 2–4; canon, three options):
- **Mix (default):** both size and density grow. Even split unless research suggests better: volume and density each take the square root of the mass ratio, so height grows with its sixth root. A slider between the two pure forms is fine, with the even split as default.
- **Pure size:** height grows with the cube root of the mass ratio at the same density.
- **Pure density:** same size, denser; the Weight tab's physics applies (ground failure, sinking, their own gravity).

Worked examples to check against (mass ratio from 3,007 kg, at 10 ft):
- Krakatoa's energy (8.4 × 10¹⁷ J) adds about 9 kg: unnoticeable in any form.
- Chicxulub's (4.2 × 10²³ J) adds about 4,700 t (×1,560): mix ≈10 m and ≈42,000 kg/m³; pure size ≈35 m; pure density ≈1.7 × 10⁶ kg/m³.
- One second of the Sun's output (3.8 × 10²⁶ J) adds about 4.3 × 10⁶ t (×1.4 × 10⁶): mix ≈32 m and ≈1.3 × 10⁶ kg/m³; pure size ≈340 m; pure density ≈1.5 × 10⁹ kg/m³ (white-dwarf matter).

## 3. Presence: a new Walk tab

What being near them is like. Inputs: the walker (Rex, Ollie or both, using the default bodies), pace, effort per step (from soft-footed to a deliberate heavy step), the surface, and the distance to a listener.

**Outputs:**
- Peak ground vibration (peak particle velocity) at chosen distances, and how it falls with distance.
- **Thresholds, each sourced:**
  - when people feel it
  - when a water glass visibly ripples (the "Jurassic Park" test; find a measured value or derive one, and label which)
  - when ornaments and windows rattle
  - when cosmetic damage to buildings starts
- The ground under each step: pressure against bearing capacity, and footprint depth on soft ground.
- Sound of each step, if it can be sourced.
- **The canon target as a result, not an assumption:** the effort at which glasses ripple a few metres away, and the effort at which presence stops being harmless.

**Physics approach** (to research and verify):
- **Step force.** Walking ground reaction is about 1.2× body weight per step. The engine already uses this rule: `W8.WALK_LOAD` and `moveCheck`. A heavier deliberate step is a short drop or stamp, which ties into the existing Stomp model at low effort.
- **Vibration at a distance.** Scaled-distance attenuation laws from dynamic soil compaction (weights dropped from a height), for example Mayne, Jones & Dumas (1984), which relate peak particle velocity to the square root of impact energy over distance. Check the fitted constants, the ground types, and how far down in energy they hold.
- **A real anchor.** At 3,007 kg each, Rex and Ollie weigh about as much as an African elephant, and elephant footfalls have been measured seismically in field studies (O'Connell-Rodwell's work on seismic communication; Mortimer et al. on classifying elephant behaviour from ground vibration). "About like an elephant walking past" should be a sourced comparison, not a guess.
- **Perception and damage thresholds:** standards such as BS 5228-2, ISO 2631-2, BS 7385-2 and DIN 4150-3. Find the actual tables.

The names above are leads for the research step to fetch and verify, not facts.

## What to build first

1. Research (verified facts, as in the house pattern): step forces, attenuation laws, the elephant measurements, the thresholds, the water-glass value, a whole-object stress argument for gentle hold, a survivable g limit for safe passenger, and the physics each growth mode needs.
2. **The Walk tab** with effort and presence: the centre of this brief.
3. **Effort, the courtesy ceiling and the not-so-heroic presets on the existing solo tabs.** Lift is already restrained; then Stomp, Clap, Jump, Throw, Punch, Sprint and Pull. Then the two-player tabs with shared effort.
4. **The comic switches:** gentle hold first, then safe passenger, silent strike, soft landing and cool flight, with endless ocean as the absorption mode.
5. **The growth modes and growth forms.**
6. Adversarial review rounds with fixes; publish; pull request; a `history/` entry.

If time runs short, 1 and 2 are the core. Stop at a clean point, record it in `STATUS.md`, and leave the rest for a later run.

## Tests

- The engine's presence functions are monotone (more effort or less distance never gives less vibration) and reproduce the sourced anchors: the elephant comparison, and each threshold's own worked example.
- All-out effort reproduces today's results exactly; the page's opening view differs only because it opens least-disruptive. Least-disruptive effort achieves each move's goal and stays under every hazard.
- Gentle hold changes only grip, launch-crush and sag results, never ground, recoil, air or impact results.
- An absorbed switch removes only its own hazard and conserves momentum (the ground still gets the impulse). In endless ocean mode nothing outside changes and no mass is added. The growth modes reproduce the worked examples above, and the runaway loop's ratio is reported.
- The existing calibration, sweep and screenshot tests still pass; the screenshot test covers the new tab at 390 and 1280 px, light and dark.

## Open questions for the owners

None open. Settled:
- the page opens least-disruptive
- both share one effort unless Ollie's is set as a what-if
- named not-so-heroic presets for property damage at rising scales
- all four candidate comic switches
- four absorption modes, with endless ocean as the default
- three growth forms, with mix as the default

## Not in scope

- Changing their canon strength, size, mass or anything else in `CLAUDE.md`. The growth modes change size and mass only within a what-if, and the page resets to canon.
- Effort in the Build Calculator or Build Comparison.
