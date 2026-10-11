# Rex lab: restraint and presence (brief)

The plan for a new part of the Rex Super-Strength Lab. Read `/CLAUDE.md` first, especially the canon on restraint; its standards apply here. Drafted by the collaborator for a cloud run; nothing here is built yet.

## Why

The lab answers "what happens at strength X?" Most moves run all-out: throws, jumps, stomps, punches and claps drive with their full share of the dial. Canon now says Rex and Ollie do the opposite. They want to be seen as heroes, so by default each uses the least disruptive way to exist in the world, and uses comic-book physics selectively and on purpose. Restrained, they feel about kaiju-like on a local scale: footsteps you can feel, water glasses rippling a few metres away. Nothing is harmed.

The lab has no way to show that. This brief adds three things.

## 1. Effort, separate from strength

- The dial stays "how strong he is". A new control sets **effort**: how hard he chooses to push, from gentle to all-out (a share of the dial, or a target such as "throw it 30 m").
- **The default is least disruptive:** the gentlest effort that still does what the move is for. Each move needs a stated goal. For example: lift it clear of the ground; throw it to a target distance (the game of catch already aims an "easy" lob); jump to a height; walk at a pace.
- **Courtesy ceiling:** for each move, the most effort he can use before something nearby comes to harm. The hazards are the ones the engine already computes (windows breaking at a distance, people knocked down, the ground giving way, an object crushed, quakes felt, sonic booms), plus the new presence hazards below. Show which hazard sets the ceiling, and how far it reaches.
- **All-out stays one click away,** and the page says plainly what it does to the surroundings.
- Reuse the existing physics and its threshold machinery (the strength ladder's `thresholdDefs` already bisects "the strength at which X happens"). Effort is mostly a new framing of it.

## 2. Selective comic physics

Named switches, off by default. Each states exactly which real limit it suspends, and everything else stays real (momentum and energy are conserved).

- **Gentle hold (tactile telekinesis):** his push is spread through the whole held object in proportion to its mass, so the object is not stressed by his grip (it accelerates like a falling body, with no internal load). It removes grip crushing in Lift, Throw and the game of catch, the hands punching through at launch, and an object sagging under its own weight. It does **not** remove the ground's load under him, his recoil, air pressure on a thrown object's front (break-up, heating), or the impact where it lands.
- **Comic ground** already exists ("never breaks").
- Others only if a move clearly needs one; propose each before building it.
- Label each switch as fiction wherever its effect shows.

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

1. Research (verified facts, as in the house pattern): step forces, attenuation laws, the elephant measurements, the thresholds, the water-glass value, and a whole-object stress argument for gentle hold.
2. **The Walk tab** with effort and presence: the centre of this brief.
3. **Effort and a courtesy ceiling on the existing solo tabs.** Lift is already restrained; then Stomp, Clap, Jump, Throw, Punch, Sprint and Pull.
4. **Gentle hold** as the first comic switch.
5. Adversarial review rounds with fixes; publish; pull request; a `history/` entry.

If time runs short, 1 and 2 are the core and the rest can be a later run.

## Tests

- The engine's presence functions are monotone (more effort or less distance never gives less vibration) and reproduce the sourced anchors: the elephant comparison, and each threshold's own worked example.
- Effort at 100% reproduces today's results exactly, so nothing already on the page changes unless the visitor lowers effort. Least-disruptive effort achieves each move's goal and stays under every hazard.
- Gentle hold changes only grip, launch-crush and sag results, never ground, recoil, air or impact results.
- The existing calibration, sweep and screenshot tests still pass; the screenshot test covers the new tab at 390 and 1280 px, light and dark.

## Open questions for the owners

1. Should the page open in least-disruptive mode, so a first-time visitor sees the heroic default and has to choose all-out? The canon suggests yes; today the page opens all-out.
2. Does effort apply to Ollie separately in the two-player tests, or do both share one effort setting?
3. "For the most part": should the page name a deliberate not-so-heroic mode, or simply leave all-out available without comment?
4. Which further comic switches, if any, beyond gentle hold and comic ground?

## Not in scope

- Changing strength, size, mass or any other canon.
- Effort in the Build Calculator or Build Comparison.
