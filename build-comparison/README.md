# Build Comparison

Men's builds on one scale of muscle level, with height taken out: from ordinary men, through the top of the human record and the comic giants, to Rex and Ollie and the end of the scale. Each build is a flat silhouette and a score range. Empty stretches stay empty until measured art fills them (Step 2). The page also holds a tool that measures a character from an A-pose model sheet.

Live page: https://claude.ai/artifact/DBtZrixDeZnvRwDhZMsCDn (private until shared)

Step 1 of the plan in [BRIEF.md](BRIEF.md). Rex's and Ollie's mass is unchanged (about 2,700 kg each, from the duo picture); Step 2 remeasures them from their turnarounds.

## What it shows

- **The score.** S = 1.8 × fat-free mass ÷ height³: the FFMI (fat-free mass ÷ height², kg/m²) the same body would have at 1.80 m, same shape. It equals plain FFMI at 1.80 m. Height is to the top of the skull. Plain FFMI is shown beside it. Every score is a range across plausible body fat (and height and weight where sources disagree).
- **49 men** from the Build Calculator's data: US Army ANSUR II soldiers, NHANES US men, natural athletes, bodybuilders, strongmen and lifters, 21 comic characters (one in two forms), and Rex and Ollie. Women stay in the Build Calculator.
- **Stops by score band**, each with a one-line verdict: under 25, 25 to 32 (Kouri's natural-sample top to the top measured college footballer), 32 to 45 (the top of the human record; no real man scores above about 42), then the empty stretches and bands the data give: nothing comparable 45 to 62, comic giants 62 to 88, empty 88 to 130, Rex and Ollie 130 to 220, empty to 924, and the meatball.
- **Functional limits** of a drawn body, found by geometry on the median soldier's outline widened at fixed bones and read with the measuring tool: arms forced out (about 41), thighs touching to the knee (about 46), hands unable to reach the face (somewhere from 87 to 200; the model decides). The same tests run on every figure on the chart: drawn from their own girths, the biggest bodybuilders already meet the first two (from about 39), and the page says so. All estimates; see `data/limits.json` and the page's limits section.
- **The meatball (924)**: a solid ball of muscle as tall as the figure, at 1,060 kg/m³ and 7.5% fat. A chosen end of the scale, not a maximum: a cylinder as wide as it is tall would score about 1,400.
- **Every build to scale**: a forest plot of every range on one log axis, with the natural-limit anchors, the limits and the gaps as rows; a close-up mode for 12 to 45.
- **Measure a character**: load a sheet (front, side, back), type the height to the top of the skull and a density; get volume, mass, the seven girths, segment lengths, frontal area and the score, with checks (views differ in height by more than 2%, landmarks that don't line up), uncertainty, a copy button, and a target outline for a chosen score (front and side images at the sheet spec), solved until it measures the target, and withheld when the drawing would fail the tool's own checks. It is validated live on `rex-strength-lab/assets/duo.jpg`.

## Build and test

From `build-comparison/`:

```
node build.js        # data + src -> dist/index.html (never edit dist by hand)
node test/test.js    # model, figures, limits (recomputed), measuring tool, data derivations (28 checks)
node test/duo.js     # the measuring tool on duo.jpg: Rex within 2.52-2.60 m^3 (needs Playwright)
node test/shots.js   # 390 and 1280 px, light and dark; fails on NaN/undefined/Infinity, console
                     # errors, sideways scroll, phone text under 11 px, dead controls, banned
                     # phrases, misplaced 924 marks; opens every figure's details (needs Playwright)
```

Generated data, each rebuilt by its tool (do not edit by hand):

| File | Tool | From |
|---|---|---|
| `data/outline.json` | `tools/derive_outline.js` | the ANSUR II male CSV (landmark fractions, breadth and depth ratios) |
| `data/duo-outlines.json` | `tools/trace_turnarounds.js` | `assets/rex-turnaround.png`, `assets/ollie-turnaround.png` (outlines only) |
| `data/facts.json` | `tools/compile_facts.py` | `research/round1/*.json` and `research/corrections.json` |
| `data/limits.json` | `tools/compute_limits.js` | `data/settings.json` (limits) and `src/figure.js` |
| `dist/index.html` | `build.js` | everything above, plus `build-calculator/data/builds.json` and `src/calc.js` |

`tools/export_targets.js` writes full-size target-outline sheets for Step 2: `node tools/export_targets.js --score 100 --build ansur2_m_p50 --px 2000 --out DIR`, or from a measured sheet with `--sheet my-sheet.png --sheet-height 2.92`.

## Files

- `src/model.js`: scores, body-fat ranges, gaps (Node and browser). `src/figure.js`: silhouettes from data, traced duo outlines, the limit geometry, sheet rendering. `src/measure.js`: the measuring tool. `src/app.html`: the page.
- `data/settings.json`: what the page decides (body-fat classes, per-build choices, stops, anchors, limits text, what it ignores). `data/NOTES.md` explains each judgement call.
- `research/round1/`: the research and verifier outputs (six topics). `research/corrections.json`: every correction applied to a fact, with the reason. `research/reviews/`: the design record and the review rounds.

## Sources

Every number is either sourced or labelled an estimate, with its status (measured, official, reported, derived, estimate). The page's Sources section lists the 133 research facts by topic with their links; each figure's details list the build's own sources from the Build Calculator. The main ones:

- ANSUR II (US Army 2012 anthropometric survey, 4,082 men; Gordon 2014, Hotzman 2011) for the outline template and the soldiers.
- Kouri 1995 (FFMI of 74 non-users and 83 steroid users), Trexler 2017 and Currier 2019 (athletes' FFMI by DXA), Kondo 1994 (sumo fat-free mass).
- NHANES DXA body fat (NCHS), the US Army's 2023 one-site equation and Taylor 2024 (soldiers' DXA) for body fat; contest-day studies for bodybuilders; Kraemer 2020 for strongmen.
- Marvel's Official Handbook (via archive.org) and DK encyclopedias for what comic characters' weight is made of.
- CDC joint range-of-motion norms, Zwerus 2018, Morrey 1981, Vasen 1995 and de Leva 1996 for the functional limits.

## Review history

- **Research** (six topics, each checked by a skeptic who re-fetched sources): 43 corrections applied (`research/corrections.json`), including those from the review rounds.
- **Design**: three proposals, two judges, one synthesis (`research/reviews/design.md`).
- **Review round 1**: five lenses (model, claims, data, UX, code), each finding reproduced or refuted by a skeptic: 76 findings, 69 confirmed, all fixed or partly fixed with the reason stated ([research/reviews/round1.md](research/reviews/round1.md), verbatim results in `round1.json`).

## Known limits

- **The score assumes a body grows at the same shape.** On average, fat-free mass grows about as height squared across adults, so the score rates tall men a little lower than Kouri's height correction does (whether real bodies differ in shape is disputed); giants would need different proportions.
- **Body fat is mostly assumed**, so most scores are estimates and every score is a range. No Marvel or DC source gives any character's body fat.
- **Silhouettes show the build, not the person.** Human and comic figures are drawn from seven girths on the median soldier's proportions, with elliptical trunk sections. Their drawn volume is not forced to match the build's weight; for very muscular builds it runs high (see `data/NOTES.md`).
- **Limits are flat, front-view geometry** on a template widened by one factor everywhere, which looks fat rather than muscular. The hands-to-face limit depends on an elbow model no study has tested above ordinary girths. Figures are drawn with their arms just past where their own outline lets them hang, so wide figures stand with their arms far out.
- **Rex and Ollie**: mass from one front-view picture over clothes, skull heights read off the same picture. Both are estimates until Step 2.
- **The measuring tool** treats slices as ellipses (girths ±5-10%, volume a few percent). Its chest factor (×1.238) is ANSUR's for rib-cage caliper widths; outlines that include the lats read high. It has been validated on one picture (duo.jpg) and on synthetic sheets, not on independent art with a known answer.
