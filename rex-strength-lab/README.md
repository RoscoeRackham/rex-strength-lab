# Rex Super-Strength Lab

A physics simulator for Rex, an indestructible, tireless plush dinosaur. Set his strength anywhere from the world-record human (511 kg deadlift) to infinite, then lift, throw, jump, stomp, punch, clap, sprint or pull and see what the physics does to him, the object and the ground.

Live page: https://claude.ai/artifact/YFpbHtX8tM2Qwffd6znbZP (private until shared)

## Build

```
python3 build-data.py   # research/final-*.json + src/static-data.js -> src/data.js
node build.js           # inline engine, data and image -> dist/index.html
```

## Test

```
node test/calibration.js   # record-human calibration, monotonicity, infinite-strength limits, flight, blast, quake checks (~1 min)
node test/sweep.js         # every move across 5,184 setting combinations; flags NaN/negatives (~9 min)
node test/shots.js         # headless Chromium screenshots at 1280 px and 390 px (needs Playwright)
```

## Files

- `src/engine.js`: the physics. Two-body push (relativistic constant force, or Hill force-velocity with an implicit integrator), footing and ground limits, drag flight over a round Earth with Kepler arcs above 150 km, Kinney-Graham blast, Gutenberg-Richter quakes, Collins et al. craters, equilibrium-air heating.
- `src/app.html`: the page. Every sentence a reader sees is generated in the `bay*` functions from engine numbers.
- `research/final-*.json`: the sourced facts behind every number (humans, fiction, objects, environment), each researched and then checked by two independent verifiers.
- `build-data.py`: picks the facts the page uses and writes `src/data.js` with status and sources.

## Review history

The physics and page went through three adversarial review rounds (engine, claims, data, UX). Round 3 checked the 77 confirmed round-2 findings against the build (66 held) and found about 35 smaller issues, mostly side effects of the fixes. All of those are addressed in the current build. The reports are in `research/reviews/round1.json` to `round3.json` (each finding with its repro, the verifier's verdict and the suggested fix); the tests above cover the regressions they found.

## Known limits

- Real-muscle speeds follow the Hill curve with a single-muscle shape factor; whole limbs are flatter, so real-muscle results are a model, not a measurement.
- Ground is a bearing-capacity-plus-inertia model. It does not model ice sheets snapping in bending, layered soils, or ejecta.
- Crater sizes past a few hundred km and anything near Earth's binding energy are rough or flagged as planet-scale.
- Flight counts only Earth's gravity; arcs past the Moon's orbit are flagged as rough.

