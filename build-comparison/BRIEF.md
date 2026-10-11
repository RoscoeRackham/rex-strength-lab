# Build Comparison: brief

The owner's request, and what is already known going in. Read `/CLAUDE.md` first; its standards apply here.

## What the owner wants

A build comparison chart that measures "muscle level" irrespective of height. It extends the Build Calculator. Each build gets a silhouette, and the builds line up on one scale running from normal, through the limits of human possibility, to the outright monstrous.

## What exists to build on

- `build-calculator/` has 55 builds (ANSUR II percentiles, NHANES adults, natural athletes, bodybuilders, strongmen, 21 comic characters, Rex and Ollie). Each has a height, a weight and seven girths, every value with a status and sources. `src/calc.js` already computes FFMI, with Kouri's height normalisation applied only between 1.55 and 2.05 m.
- `build-calculator/data/ansur2/` has the ANSUR II CSVs: about 6,000 soldiers with 90-odd measurements each. These include landmark heights (acromial, chest, waist, crotch, knee, ankle), breadths (biacromial, bideltoid, chest, waist, hip) and depths (chest, waist, buttock). These can draw a body outline at any height from data alone.
- `rex-strength-lab/research/reviews/body-estimate-from-picture.json` and `history/scratchpad/mass/` (branch `session-transcript`) show how Rex and Ollie were measured from their picture: ellipse slices, with depth-to-width ratios taken from ANSUR II.

## Problems to solve, not assume away

1. **"Irrespective of height" needs a size-independent measure.** FFMI is fat-free mass over height squared. A body scaled up at the same shape gains mass with height cubed, so its FFMI grows in proportion to height. At 10 ft Rex would score about 1.7× higher on FFMI than the same shape at 1.80 m (for example, at an assumed 10% body fat: FFMI about 262 at 3.048 m, about 155 scaled to 1.80 m). Kouri's correction is fitted only to human heights. Choose a measure that stays the same for the same shape at any size, for example fat-free mass over height cubed, or FFMI after rescaling the body to a reference height. Source the choice, and show plain FFMI beside it so readers can relate it to the familiar scale.
2. **Body fat is mostly unknown.** Only 7 of the 55 builds have a body-fat value; the rest assume one (5% for pro bodybuilders, 15% by default). Every muscle score built on an assumed body fat is an estimate. Show the range across plausible body-fat values, not a single number.
3. **Girths are patchy.** Even Ronnie Coleman (2004 Olympia, 1.80 m, 134 kg, reported) has a reported chest, waist, flexed arm and calf, a derived thigh, and no forearm or neck. Comic characters have official heights and weights only. The silhouette must show which outlines come from measurements and which are filled from a template build.
4. **The anchors of the scale need sources.** Candidates:
   - average men and women (ANSUR II, NHANES)
   - the natural limit (Kouri 1995's FFMI 25 is the top of one sample of 74 non-users, not a hard ceiling; check frame-based predictions such as Casey Butt's and say how good their evidence is)
   - enhanced pros and strongmen
   - comic characters (official stats, derived shapes)
   - Rex and Ollie (measured from their picture)

   Past the human data, every value is an extrapolation and must be labelled as one.
5. **The silhouettes must be honest.** Draw them from numbers: landmark heights as fractions of stature, widths from girths through measured breadth-to-girth and depth-to-girth ratios. Show them at the same height so only the build differs, with an option to show real heights side by side. Where a girth is missing or past the human data, the outline should look different (for example dashed or hatched), not just carry a note somewhere else on the page.

## Art

The chart should not need art assets: outlines drawn from measurements are more honest than drawings and carry no copyright problems. Do not trace or embed photos of real people. Use their published measurements instead.

The owner may supply:
- a style reference for how the silhouettes should look
- front-and-side turnaround art of Rex and Ollie (or other characters) at a known height, which would replace the assumed depth ratios with measured ones.

If the design would clearly gain from an asset, describe exactly what is needed (view, pose, background, scale marker) and ask the owner. Do not draw the characters yourself.

## Deliverable

A third project folder, `build-comparison/`, following the house pattern in `/CLAUDE.md`. Reuse `build-calculator/data/builds.json` and `src/calc.js` rather than copying them; if they need changing, change them in place and keep the Build Calculator's tests passing. Publish the page as a new Artifact. Add the project to the root README.
