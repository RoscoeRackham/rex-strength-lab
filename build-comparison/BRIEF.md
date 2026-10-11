# Build Comparison: brief

The request, the decisions already made, and what is known going in. Read `/CLAUDE.md` first; its standards apply here.

## What we want

A build comparison chart that measures "muscle level" irrespective of height. It extends the Build Calculator. Each build is shown as a flat silhouette, and the builds line up on one scale running from ordinary men, through the limits of human possibility, to the outright monstrous.

## Decisions already made

- **Men only.** The chart compares male builds. FFMI norms differ by sex and Kouri's natural-limit sample was men, so one mixed scale would mislead. The women's builds (ANSUR II, NHANES, She-Hulk) stay in the Build Calculator but are not on this chart.
- **Rex and Ollie are 7.5% body fat** (canon: 5–10%, from their definition and occasional vascularity). Use 7.5% with 5–10% as the range.
- **Rex's tail does not count** toward his muscle score. Exclude its volume and mass from the score, and say so on the page. His total mass elsewhere is unchanged.
- **The scale tops out at the "meatball".** A figure can't hold more volume than a ball as tall as itself. A solid ball of muscle at 7.5% fat scores about 924 on the height-independent FFMI below (1,060 kg/m³ × π/6 × 0.925 × 1.8). Below that, find and mark where the body stops working, by geometry on the drawn silhouettes: the arms can no longer hang down by the sides, the thighs touch all the way to the knee, and the hands can't reach the face. Run the axis from about 15 to 1,000, on a log scale or a broken axis.

## What exists to build on

- `build-calculator/` has 55 builds (ANSUR II percentiles, NHANES adults, natural athletes, bodybuilders, strongmen, 21 comic characters, Rex and Ollie). Each has a height, a weight and seven girths, every value with a status and sources. `src/calc.js` already computes FFMI, with Kouri's height normalisation applied only between 1.55 and 2.05 m.
- `build-calculator/data/ansur2/` has the ANSUR II CSVs: about 6,000 soldiers with 90-odd measurements each. These include landmark heights (acromial, chest, waist, crotch, knee, ankle), breadths (biacromial, bideltoid, chest, waist, hip) and depths (chest, waist, buttock). These can draw a body outline at any height from data alone.
- `rex-strength-lab/research/reviews/body-estimate-from-picture.json` and `history/scratchpad/mass/` show how Rex and Ollie were measured from `rex-strength-lab/assets/duo.jpg`: ellipse slices, with depth-to-width ratios taken from ANSUR II. Three methods agreed within 3% (Rex 2.55 m³, Ollie 2.53 m³).

## Problems to solve, not assume away

1. **"Irrespective of height" needs a size-independent measure.** FFMI is fat-free mass over height squared. A body scaled up at the same shape gains mass with height cubed, so its FFMI grows in proportion to height. At 7.5% fat, Rex's plain FFMI is about 269 at 3.048 m but about 159 for the same shape scaled to 1.80 m (tail included; without it, roughly 141). Kouri's correction is fitted only to human heights. Use FFMI after rescaling the body to 1.80 m at the same shape (equivalently 1.8 × fat-free mass / height³), unless research finds a better-sourced choice; source it either way. Show plain FFMI beside it so readers can relate it to the familiar scale.
2. **Body fat is mostly unknown.** Only 7 of the 55 builds have a body-fat value; the rest need an assumption. Every score built on an assumed body fat is an estimate. Show the range across plausible body-fat values, not a single number.
3. **Girths are patchy.** Even Ronnie Coleman (2004 Olympia, 1.80 m, 134 kg, reported) has a reported chest, waist, flexed arm and calf, a derived thigh, and no forearm or neck. Comic characters have official heights and weights only, and some of that weight is not muscle (Wolverine's adamantium, the Thing's rock). The silhouette must show which outlines come from measurements and which are filled from a template build.
4. **The anchors of the scale need sources.** Candidates:
   - average men (ANSUR II, NHANES)
   - the natural limit (Kouri 1995's FFMI 25 is the top of one sample of 74 non-users, not a hard ceiling; check frame-based predictions such as Casey Butt's and say how good their evidence is)
   - enhanced pros and strongmen
   - comic characters (official stats, derived shapes)
   - Rex and Ollie (measured from art)
   - the functional limits and the meatball (geometry)

   A rough first pass (rescaled FFMI, assumed body fat) puts the Army median at about 24, Coleman at about 38, the heaviest comic characters at 57–81 and Rex at about 141 without his tail. That leaves gaps with no anchors: about 39–50, about 81–140, and everything above Rex. **Leave the gaps visibly empty.** They will be filled later by measured art (see "Step 2"). Past the human data, every value is an extrapolation and must be labelled as one.
5. **The silhouettes must be honest.** See "Silhouettes" below.

## Silhouettes

- **Flat filled shapes for every build**, so outlines traced from art and outlines drawn from data look alike. Builds can differ only in how their outline is marked: measured, derived from a template, or measured from art (for example solid, dashed and dotted edges). Explain the marking in a key.
- **Real and comic builds are drawn from their numbers** on a human template with ANSUR II proportions: landmark heights as fractions of stature, widths from girths through measured breadth-to-girth and depth-to-girth ratios. Never use the duo's shapes as the base for a human build; their proportions are not human.
- **Rex and Ollie are traced from their art.** Until new turnarounds are measured (Step 2), trace `duo.jpg`.
- **Style key:** the duo's art (and their turnarounds, if attached to the first prompt) sets how silhouettes are drawn: contour smoothness, level of interior detail, how hands, feet and heads are simplified. Propose two or three chart styles from the art's palette, pick one, and note the choice for review. A fill colour per group (everyday, natural athletes, enhanced, strongmen, comic, the duo) is a reasonable default.
- Show every figure at the same height so only the build differs, with an option to show real heights side by side.
- Do not trace or embed photos of real people, or the art of Marvel and DC characters. Use their published measurements.

## The measuring tool

Build a tool in this project that measures a character from an A-pose model sheet:

- **Input:** one sheet with front, side and back views at the same scale (spec below), plus the character's height and a density.
- **Output:** volume and mass; the seven girths (chest, waist, flexed arm, forearm, thigh, calf, neck), each from the front width and side depth of its slice; segment lengths; frontal area; the score. Ready to add as a build with the status "measured from art, estimate".
- **Checks:** reject a sheet whose views differ in height by more than about 2%, or whose landmarks don't line up across views. Report the uncertainty: slices are not perfect ellipses, so girths may be off by about 5–10%; volume by a few percent.
- **Validation:** run it on `duo.jpg` (front view only, with the old ANSUR depth ratios) and reproduce Rex's 2.55 m³ within the old methods' spread. Make this a test.
- **Target outlines:** export the outline for any target score (a measured shape's proportions, widths scaled to the target) as front and side PNGs at the sheet spec. The collaborator uses these as control images in GPT Images 2.5 to make gap-filler figures that land on the target.
- Reuse `history/scratchpad/mass/` where it helps.

## Art: model-sheet spec

For Rex and Ollie's turnarounds and every gap-filler figure:

- One sheet; front, side and back views side by side; identical scale, no perspective.
- A-pose, arms about 30–40° out, palms in, feet shoulder-width apart.
- One shared ground line, a height bar, and thin horizontal guide lines at shoulder, chest, waist, crotch and knee across all views.
- Plain flat background, no shadows, even lighting. Ideally also a solid silhouette layer or mask as a separate PNG.
- Side view: the near arm on its own layer, or a second side view without it.
- Marked heights: top of the skull; Rex's crest tip; Ollie's horn tips and boot-sole thickness.
- Clothing removed, or the extra bulk marked.
- PNG, at least 2,000 px tall.

## Two steps

**Step 1 (this run):** research and verify the anchors; build the chart and the measuring tool; validate the tool on `duo.jpg`; leave the gaps empty; adversarial review rounds with fixes; publish as a new Artifact; open a pull request. Do not change Rex's or Ollie's mass in this run, even if new turnarounds are attached.

**Step 2 (later, separate pull requests, mostly done by the collaborator locally):**
- Measure Rex and Ollie from their turnarounds. If their mass or volume changes, update their canon across all three projects (Build Calculator, Rex lab defaults, this chart) in one pull request that both people agree.
- Make the gap fillers: export a target outline, generate the figure over it, measure the sheet, and add it as a build labelled "measured from art". One pull request per batch.

## Deliverable

A third project folder, `build-comparison/`, following the house pattern in `/CLAUDE.md`. Reuse `build-calculator/data/builds.json` and `src/calc.js` rather than copying them; if they need changing, change them in place and keep the Build Calculator's tests passing. Publish the page as a new Artifact. Add the project to the root README.
