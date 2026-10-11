# Build Comparison, Step 2: working checklist

Step 2 of [BRIEF.md](BRIEF.md): measure Rex and Ollie properly from their turnarounds, and fill the empty stretches of the scale with measured figures. The collaborator does this locally: the art in GPT Images 2.5, the code in Claude Code. Read `/CLAUDE.md` first.

## Decisions (owners, 11 Oct 2026)

1. **Art is drawn over control outlines that already have the canon volume.** The mass is set by ruling (3,007 kg each; 2.84 m³ at 1,060 kg/m³), so the tool exports outlines at that volume, the art is rendered over them, and measuring confirms that the two agree.
   - The current turnarounds are rejected by the tool (see "Where things stand"). Their provisional readings, about 3.3 m³ each, are overstated, because the near arm is counted in the side view.
2. **Gap fillers are featureless bodies:** male, no face, hair or clothing detail, in the same A-pose sheet format as the duo's turnarounds. They show build only. The duo's own turnarounds will be refined toward the same standard as the look develops.
3. **Targets, for now:** 50 and 56 (gap 45–62); 100, 125 and 150 (gap 88–170); 280, 450 and 700 (gap about 220–924). Revisit once the first ones show what the scale looks like.

## Where things stand

The measuring tool's results on the current turnarounds (11 Oct 2026, both rejected):

| Problem | Rex | Ollie | Cause |
|---|---|---|---|
| Front and back landmarks don't line up | fail | fail | in the back views the arms touch the torso, so the armpits aren't found |
| Crotch not found | fail | fail (back) | the tail hangs between the legs |
| Side view reads as wide as the front | warning | fail | the near arm covers the torso |
| Resolution | about 750 px | about 770 px | the spec asks for at least 2,000 px |
| Skull top | not marked | not marked | the height is taken to the crest or horns |

The exporter can't make a passing outline from the current Rex sheet at any width ("no passing sheet").

## A. Measuring-tool fixes (code, first)

- [ ] **Arms cut at the shoulder line**, then measured as limbs along their own axis. This fixes the blocker (arms that can't hang clear, from about 100 on the median soldier) and the 4–20% over-reading of raised arms.
- [ ] **Tails:** accept a tail layer or a tail-free sheet, so the crotch is found and the tail's volume is measured separately and left out of the score.
- [ ] **Side view without the near arm:** accept an armless side view (or the arm as its own layer), so the torso depth is the torso's.
- [ ] **Skull-top mark:** read a short tick in the left margin at the skull-top row; a typed row still overrides.
- [ ] **Masks:** accept a solid silhouette sheet alongside the art sheet, and prefer it for segmenting.
- [ ] Tests: synthetic sheets with known answers for each of the above, plus the existing `duo.jpg` regression test. Everything else in `test/` still passes.

## B. Rex and Ollie, version 2 (art, then measure)

- [ ] Export control outlines for each at canon volume: front, side and back, at least 2,000 px tall, with guide lines, a height bar and a skull tick. Also a tail-free version and an armless side view.
- [ ] Render each character over its outline (GPT Images 2.5). Deliver per character, all on the same canvas size:
  - the art sheet: flat, no perspective, plain background, no floor shadow
  - a silhouette mask: solid black figure on white
  - a tail-free version, or the tail as its own layer
  - a side view without the near arm, or the arm as its own layer
  - the skull top marked, or its pixel row given
- [ ] Measure each; iterate until every check passes and the volume matches 2.84 m³ within the tool's stated uncertainty.
- [ ] Replace the front-only girths and skull heights in `build-calculator/data/builds.json` and `data/settings.json` with the measured ones (status "measured from art, estimate"). The mass stays as ruled.

## C. Gap fillers

For each target score: export the outline, generate a featureless body over it, measure, and accept it if it passes every check and lands within about ±5% of the target.

| Target | Gap | Outline exported | Art | Measured | Added |
|---|---|---|---|---|---|
| 50 | 45–62 | [ ] | [ ] | [ ] | [ ] |
| 56 | 45–62 | [ ] | [ ] | [ ] | [ ] |
| 100 | 88–170 | [ ] (needs A) | [ ] | [ ] | [ ] |
| 125 | 88–170 | [ ] (needs A) | [ ] | [ ] | [ ] |
| 150 | 88–170 | [ ] (needs A) | [ ] | [ ] | [ ] |
| 280 | 220–924 | [ ] (needs A) | [ ] | [ ] | [ ] |
| 450 | 220–924 | [ ] (needs A) | [ ] | [ ] | [ ] |
| 700 | 220–924 | [ ] (needs A) | [ ] | [ ] | [ ] |

50 and 56 can start before A is done; their arms still hang clear.

## D. Into the data and the page

- [ ] A new group, "Illustrative figures", in `build-calculator/data/builds.json`: featureless, measured from art, status estimate, at 7.5% body fat like the duo (to confirm). Decide whether the Build Calculator shows the group too.
- [ ] Settings in Build Comparison: each figure comparable, its body-fat class, and how it's labelled (traced from art, not a person).
- [ ] The page, its tests and the screenshots; README and NOTES. The owner republishes after merging.

## Pull requests

One for A (tool fixes); one for B (the duo, version 2); then C and D in batches as figures are accepted.
