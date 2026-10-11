# Build Comparison data: notes

The judgement calls behind `settings.json`, the derived files, and what is still open. Units are SI. Statuses follow the house vocabulary (measured, official, reported, derived, estimate).

## The score

- **S = 1.8 × FFM ÷ H³.** The FFMI (FFM ÷ H²) the same body would have scaled to 1.80 m at the same shape. Chosen because the chart compares bodies from 1.6 m to 3 m: plain FFMI grows in proportion to height at the same shape (Rex's plain FFMI is about 260), and Kouri's height correction is fitted to men of 1.55-2.05 m only. Research: `research/round1/research_index.json` and its verifier. Precedent for FFM ∝ H³ across growth: Forbes's FFM = 10.3 H³ and Wang 2012 (exponent 2.95, males 5-59); within adults FFM scales nearer H² (Heymsfield 2007; Wells & Cole 2002), so S rates tall men a little lower than plain or Kouri-normalised FFMI. The page says so.
- **Height is to the top of the skull** (owner's ruling). Each 1% of height is about 3% of score.
- **Rex's and Ollie's mass is set by ruling** (11 Oct 2026): Rex is 2,700 kg without his tail, and the two weigh the same in all, 3,007 kg each (`build-calculator/data/builds.json`). Tails are left out of the score as before (`exclude_mass` in settings), so Rex counts 2,700 kg and Ollie about 2,996 kg. The old 2,700 kg each was picture volume × density with the tails inside it, which is about 12% less body than the ruling. The ruled mass has no range, so their score ranges now cover only body fat and skull height: Rex 170-189 (was 126-189), Ollie 189-217 (was 144-216), and the empty stretch below them runs from 88 to 170 (was 88 to 126).
- **Rounding on the page:** whole numbers below 100, two significant figures from 100 (Rex 180, Ollie 200), 924 exact. Score ranges are the low end at the highest body fat, lowest weight and greatest height, and the reverse.
- **Kouri's 25** is height-normalised FFMI (6.1 per metre from 1.80 m). It equals S only for a 1.80 m man; the verifier puts Kouri's 1.59 m drug-free lifter at about 27 on S. The page labels the 25 as normalised wherever it appears. The stop edge at 25 is kept as the familiar marker.

## Body fat (`fat_classes`, per-build `fat`)

- **Soldiers (ANSUR II builds):** no measured body fat exists for them. Estimated from each build's navel waist and weight with two equations fitted to soldiers' DXA: the Army's official 2023 one-site tape equation and Taylor 2024's (1,261 men, RMSE 3.35 points). Working value = their mean; range = both ± 3.35. The verifier showed the official equation reads about 2-3 points low against DXA on a cohort the size of ANSUR's, so the earlier single-equation centre (± 4) was biased low. Taylor's column order (men vs women) in his tables is inferred by the researcher from the matching bias; stated in the fact.
- **NHANES men:** the measured DXA median and interquartile range (24.1-32.1%, working 28%).
- **Kouri's non-users:** the paper's measured group mean, 12.5%, ± 3 points for skinfolds.
- **Natural contest day:** 4-10% (working 6). Only one contest-day value is confirmed by DXA (Barakat 2022, 6.3%, one natural pro); the rest are field methods. Range is an estimate around them.
- **Pre-steroid contest:** 6-16% (working 10). Pope made blind estimates from photographs for Kouri 1995, which did not publish them; he later recalled the range to Todd (2008).
- **Enhanced pros on stage:** 4-8% (working 5). No lab measurement of a top pro on stage exists; the range rests on Withers 1997 (5.0%, 4-compartment, five days out; drug status not stated), an IFBB pro at 5.9% by skinfolds, and the natural values.
- **Strongmen and lifters:** 12-28% (working 19). Kraemer 2020's elite strongmen measured 18.7 ± 6.2% by DXA; 12% is about mean − 1.1 SD (raised by judgement), 28% covers the sumo and heavy-powerlifter means.
- **Comic characters:** no body-fat percentage was found in the sources searched (DK Marvel 2019, DK DC 2021 and 2019, Marvel.com, the Official Handbook Deluxe); the 2004-2010 handbooks were not fully searched. Assumed: lean heroes 5-12%, brutes 8-20%, Bruce Banner like an everyday man (15-34%). Kingpin: 2-20% (working 12): Marvel says his bulk "is actually muscle, not fat" and likens him to a sumo wrestler; a fan wiki gives 9 lb of fat (2%), citing the 2004 Daredevil handbook (not verified).
- **Rex and Ollie:** 7.5% (5-10%), the owner's canon.

## Comic characters: what the weight is

From `research/round1/research_comics.json` (official = Marvel's Official Handbook via archive.org full-text search, Marvel.com, DK encyclopedias):

- **Thor:** "Asgardian flesh and bone is about three times denser than similar human tissue" (Handbook); DK says skin and bones; the 2004 handbook gives Thor the Asgardian attributes "to a much greater degree". Marked *may be overstated*; the details give the score of the same body in ordinary tissue for 2 to 4 times the density (about 15 to 31). He is not moved on the chart, because the factor is a round in-universe "about three".
- **Superman:** DK's DC Comics Encyclopedia (2021) gives Kryptonians a "dense molecular structure", no figure: *may be overstated*, like Luke Cage.
- **The Thing:** Marvel describes rock-like, "actually supple" skin; nothing says what is under it or what it weighs. *Composition unknown*: kept out of the gaps, but not called overstated, because the direction is unknown. (Earlier labels, "most of his weight is rock" and then "may be overstated", went beyond the sources and were removed after the comics verifier.)
- **Luke Cage:** "very dense muscle and bone tissue" (DK); no figure. *May be overstated*.
- **Colossus, armoured:** his whole body becomes "an organic, steel-like substance" (Marvel). *Not comparable*: shown, not ranked, grey-hatched.
- **Wolverine:** scored at Marvel's official 195 lb without adamantium (the metal adds 105 lb).
- **Hulks and the Abomination:** the Handbook calls the added mass "bone marrow and (muscle) tissue": comparable, with that note.
- **Juggernaut:** no source says whether his 900 lb includes his helmet. Note only.
- **Darkseid, Doomsday:** no official DC statement on composition was found; density claims are fan-wiki only.

Overstated, uncertain and not-comparable builds never bound an empty stretch, so the first gap runs from the top comparable score below (Kingpin's high end, about 45, at 2% fat) to Darkseid's low end (about 62), with the Thing and Thor shown inside it.

## Rex and Ollie

- **Skull-top heights** read off `rex-strength-lab/assets/duo.jpg` at its scale (fact `duo_skull_heights`): Rex 2.92 m (2.90-2.95), Ollie 2.91 m (2.87-2.95, barefoot, less about 7 cm of boot sole). Estimates; Step 2 replaces them from the turnarounds.
- **Tails out of the score:** Rex 307 kg (0.2894 m³ at 1,060 kg/m³, from the picture measurement), Ollie about 11 kg (core plus tuft at 15% packing). Total mass elsewhere unchanged.
- **Outlines** traced from the turnarounds (`tools/trace_turnarounds.js`): outlines only; no mass or girth is measured from them in Step 1.

## Stops, gaps and the end of the data

- **Gaps:** stretches no comparable build's range reaches, wider than a factor of 1.25, from the highest range top below to the lowest range bottom above (`model.gaps`), plus the stretch from the top build to 924.
- **Stop edges:** 25 (Kouri's sample top, normalised) and 32 (Trexler's top college footballer, 31.7) are fixed; every other edge comes from a gap. Membership is by working score.
- **Real men end** at the highest range top of any real man (Big Ramy, 41.5): past it every score is marked *beyond human data*.

## Functional limits (`limits`, `limits.json`)

Built by `tools/compute_limits.js` on six template shapes (5th, 50th and 95th percentile soldiers, Steve Reeves, Ronnie Coleman, the soldier with the largest arm), each drawn at 1.80 m and widened at fixed bones (every width and depth × f; shoulder joints, hip joints, elbows fixed). The score at a limit is the widened drawing's volume at 1,060 kg/m³ and 7.5% fat: the measuring tool reads the head and body from the front and side views, and the arms are added as round limbs along their own axis (the stretch outside the body outline; hands flat, 0.35 of their breadth thick, an estimate). The head, hands, feet and joints are not widened and widened thighs merge, so the drawn shape grows more slowly than f².
  - Round 1 found the first version used S(f=1) × f²; round 2 found the tool, reading the whole drawing, lost arms held far out and counted them as torso (face shapes 15-19% high), and even where it follows an arm it counts it at torso depth where it meets the shoulder (about 4% high at 35°, 20% at 84°). Hence the arms as limbs.
  - Headline: the median soldier; band: across the six templates. Arms out about 38 (34-38), thighs touch about 43 (39-45), hands to face 58-170.

- **Arms out:** the arms can't rest closer than 30° from vertical (tested below chest height, beyond the deltoid cap). 30° is the low end of the model-sheet A-pose; no ANSUR soldier exceeds about 26° on a seated, derived measure, but ANSUR soldiers are weight-screened.
- **Thighs touch to the knee:** straight legs under the hip joints (half spacing 0.05 of stature, Hara 2016 and de Leva), inner thighs meeting from the crotch to the top of the kneecap. Obese men reach this shape at lower scores; the page says so.
- **Hands to face:** the forearm meets the upper arm before 100° of elbow bend (the mouth needs about 99° with the wrist flexed). The contact model's crease is calibrated so the median soldier bends a normal 145°. The verifier showed the only data fit (elbow flexion across BMI groups, p ≈ 1.7) puts this far lower than pure geometry, and neither is tested above ordinary girths. The steep end is derived from the fact (`elbow_flexion_vs_girth_wedge_model`): bend falls to 100° at k = 1.785, i.e. an arm-plus-forearm girth of 1.10 m; the median soldier's drawn girths at 1.80 m reach it at width × 1.60, scoring about 58. Contact geometry puts it near 160. The page shows the band 58-170 with no headline.
- Uniform widening is the simplest rule, not how muscle grows: it widens the waist as fast as the chest, so the figures look fat. A rule fitted to bodybuilders' girths would move the limits.
- **The chart's own figures** are tested too (`limits.json`, `chart_figures`), each at its own height and girths, and drawn with the arms just past their own rest angle (at least 20°, at most 88°), so no arm passes through a body. Each outline is scored the same way as the limit shapes (lean, from the drawing), so it compares with the limits; the chart's own scores (weight at each build's body fat) do not.
  - As drawn, 24 figures are past the arms limit, the lowest Arnold Schwarzenegger's outline at about 32; only six are on their own published girths (Arnold, Oliva, Heath, Yates, Cutler, Coleman), the rest on Oliva's, Yates's, the largest-arm soldier's and Coleman's shapes scaled to their weights.
  - 11 are past the thighs limit, the lowest Coleman's at about 41; all but Coleman are drawn on his shape (his thigh girth is a fan-site figure).
  - By contact geometry none is past the face limit; by the steep fit, the 11 whose arm and forearm girths reach 1.10 m are (Doomsday, Kingpin, Luke Cage, Thor, the Thing and the comic giants).
  - The comic giants' arms rest 70-84° out, nearly level (the Thing and Thor about 64°).

## Silhouettes (`outline.json`, `src/figure.js`)

- Landmark heights are ANSUR II median fractions of stature; front widths are ANSUR breadth/girth ratios (chest 0.274, waist 0.348, hip 0.339); depths are solved so the section's ellipse, times ANSUR's tape-to-ellipse ratio (chest 1.238, waist 1.054), gives the girth. Limbs are round (width = girth ÷ π); the upper arm is not round in life (skin aspect about 0.65-0.7, which side is wider unknown), so its drawn width is off by −15% to +25%. The chest outline width is not measured anywhere: the drawing uses ANSUR's rib-cage ratio (0.274 × girth); a light-contact caliper gives 0.325 (AIST, lean Japanese men), and a silhouette with the lats would be wider still. The research's suggestion of one 0.38-0.39 × girth width for chest, waist and hip was rejected by its verifier: that is an equivalent-ellipse parameter, not a silhouette width, and would draw waists 9% and hips 14% too wide.
- **Drawn volume vs weight.** The outline is drawn from girths, not fitted to weight. Measured as drawn (head and body by the tool, arms as limbs) at each build's body-fat density, the drawn human and comic figures hold from 8% less to 22% more volume than their weights (median +1%; the armoured Colossus, drawn on human girths, 24% less). Soldiers are within −8% to +2%; bodybuilders with magazine girths run highest (Arnold +22%, Oliva +14%, Coleman and Big Ramy +10%), which fits either inflated reported girths or the template's sections being too full for very muscular shapes. (Round 1 gave −3% to +34%: the tool, reading the whole drawing, counted the arms at torso depth where they meet the shoulders, and lost the giants' level arms entirely.) Scores use the weight, never the drawing. The details panel states each build's figure.
- ANSUR's chest breadth is a caliper pressed to the rib cage (no lats). For the drawn figures this is consistent (the tool reads back the girth within 3%); for art outlines that show the lats, the tool's chest girth reads high (AIST's light-contact chest gives a tape-to-ellipse factor of about 1.12, not 1.238), so the tool's chest range runs 20% down.

## Measuring tool

- Segmentation by colour against the sheet's margin background, view splitting by mask columns, landmarks on the front view's outline, volume by front-width × side-depth ellipse slices (trunk), circular limbs with an arm depth/width setting, checks for view heights (2%), ground line (1%), front/back landmarks (2%) and side neck (3%).
- Front-only mode with depth ratios reproduces the old picture measurement of Rex on duo.jpg: 2.545 m³ against the old methods' 2.52-2.60 (test/duo.js, and live on the page).

## Design decisions to review (owner)

1. **Edge marking:** solid = own number, dotted = filled in (template or derived), dash-dot = traced from art; nothing drawn dashed, because dashed means "reported" on the house chips. The brief's example was solid/dashed/dotted.
2. **The brief's meatball sentence** ("a figure can't hold more volume than a ball as tall as itself") is false as geometry: a cylinder as wide as it is tall holds 1.5 times as much (score about 1,400), a cube about 1.9 times. The page calls 924 a chosen end point. Suggest rewording the brief.
3. **Palette:** Rex and Ollie moved from maroon to plum, comics from navy to a lighter blue, so the duo and the strongmen stay apart for red-green colour-blind readers.
4. **Stop edges at 25 and 32** are sourced anchors; the alternative is one computed stop from about 13 to 42.
5. **Thor** is flagged, not moved; the alternative is to plot him at a third of his listed mass.
6. **The Thing** is "composition unknown" and kept out of the gaps; the alternative is to treat him as comparable (his weight is official), which would close part of the first gap.
7. **Group colours and contrast** (review round 1, L10): forest bars, tape ticks and limit figures now have a 1 px edge, so they pass 3:1. The fills themselves are unchanged: in light mode the natural athletes' gold is 1.7:1 on the wall, which shows on their unedged head, hands and feet. The reviewer's darker gold (#97720F) passes contrast but becomes nearly identical to the bodybuilders' orange for deuteranopes, so a fix needs a new hue for one of the two groups.
8. **Figures drawn with their arms at their rest angle** (review round 1, model F2): wide figures stand with their arms far out, and the comic giants' are nearly level. This is what the drawn outlines allow; the alternative, a fixed 20° for everyone, draws arms through bodies.
