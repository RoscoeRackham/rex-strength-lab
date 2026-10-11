# Build Comparison: design record

How the page design was chosen (Step 1). A design workflow ran three independent proposals, each with a rendered mockup (angles: a scientific instrument, a police lineup, phone-first reading), two judges (an accuracy critic and a general-reader critic) who scored every proposal from screenshots, and one synthesis that wrote the spec the page was built from. The workflow script is in `history/` with this session's transcript.

What the build changed from the spec is listed at the end.

## Judges

### Accuracy critic

| Proposal | Accuracy | Readability | Phone | Distinctiveness | Feasibility |
|---|---|---|---|---|---|
| Scientific instrument: slide-rule log ruler hero + forest-plot ranking | 6.5 | 6 | 6 | 7 | 7 |
| Police lineup / museum specimen parade: figures first in score order o | 6 | 8 | 7 | 8 | 7 |
| Phone-first scroll: a sticky to-scale log tape rail beside score-band  | 7 | 8 | 8 | 7 | 6.5 |

**Recommendation.** Build on the reader proposal (C, the scroll-down tape), and graft in the instrument's ranking and labelling devices plus the lineup's strip and wording.

Why C: it is the only proposal whose limits use '?' and whose widened template is geometrically consistent with its labels (score = 23 × f²). Its tool honours the Step 1 rule: it validates on duo.jpg, not the turnarounds, and labels height as skull-top. Its stop-plus-verdict structure suits a general reader with ADHD on a phone. Its outlines are already real geometry.

Must-fix before build, confirmed in the screenshots:
1. Say on the page that the rail is a log scale. Use the instrument's line: 'Equal steps are equal ratios: 20 to 40 is the same distance as 100 to 200.'
2. Name stops by score band, not by group. 'Ordinary men' currently holds Reeves, natural pros, elite bodybuilders and comic heroes.
3. Draw every figure, Rex, Ollie and the meatball included, at one skull-top height by default.
4. Fix the meatball circle being clipped by the next cell (both widths). Drop 'the ceiling' wording; 924 is a chosen end point.
5. Show Wolverine as 'not scored', as the instrument does, unless the adamantium mass is sourced.
6. Give a spread to scores from measured body fat, and put a status chip on the lede's headline numbers.
7. Resolve the edge-vocabulary clash with the house chips. Adopt the instrument's dotted = template, dash-dot = art (needs owner sign-off), or give template a pattern unused by the chips.

Graft from the instrument (A):
- An 'All 49' forest-plot view: one range bar per build on a shared log track, with 'Bars that overlap can't be ranked against each other'.
- Status-bordered boxes on every number.
- The 'measured humans end' rule, plus an EXTRAPOLATED chip on each build beyond it.
- Gap rows placed in score order.
- The left arrow on the bar for rock and steel comics.

Graft from the lineup (B):
- The strip's hollow dots for overstated comics.
- The drawer that states the per-region edge marking in words.
- Construction-line ghost figures for the limits once they are computed.
- 'The scale ends at 924' wording.

Reject:
- The instrument's 'No body can score above 924' and 'past 924: impossible' (false).
- Any mock that loads a turnaround into the tool and reports a new mass, or prefills crest height. A and B both do this.
- Specific T/A/F bands or '≈60/95/150' positions before the geometry is run.
- Widening rules with made-up per-part exponents whose volume is not checked against the score label.

Shared risk to raise with the owner: every widened template reads as obese. The widening rule needs a sourced basis (ANSUR girth-versus-FFMI, or bodybuilder girth ratios) before any limit position is published.

Scratch crops used for this review are in /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/critic-honest/.

#### Scientific instrument: slide-rule log ruler hero + forest-plot ranking of all 49 builds (instrument/)

Best ideas:

1. The forest-plot ranking is the most honest uncertainty display of the three. Every build gets its own range bar on one shared log track. Hatched means body fat assumed, solid means measured. The copy says "Bars that overlap can't be ranked against each other". Graft this as the 'all builds' view whatever layout wins.
2. A status-bordered box around every number in a row (height, weight, fat range), so status sits on the number itself, not in a footnote.
3. A red 'measured humans end' rule, plus an EXTRAPOLATED chip on every row beyond it. Only this proposal labels extrapolation per build, which the brief requires.
4. Gap rows placed in score order ('Nothing from 42 to 57 · Empty until Step 2'), computed from full ranges. Lane ranges are drawn per build, never as a group span, so no lane appears to bridge a void.
5. Wolverine sits after the meatball as 'not scored', because his adamantium weight is unknown. That is more honest than subtracting an unsourced number.
6. A red left-pointing arrow on the bar for rock and steel ('the true score is lower'). It puts the overstatement on the mark itself.
7. The log gloss 'Equal steps on this ruler are equal ratios: 20 to 40 is the same distance as 100 to 200'. It is the best one-line explanation of the log axis in any proposal.
8. The edge-vocabulary fix: dotted means template, matching the house chips' dotted = derived, and dash-dot means art. It removes the clash the other two only flag.
9. 'Zoom 15 to 50' on the same log mapping, which makes the crowded human ranges readable (1280-modes.png).

Problems:

1. False claim, repeated in several places. The lede says 'No body can score above 924'. The ruler says 'past 924: impossible' and shades the stretch. The meatball row says 'Nothing can score higher.' A cylinder as tall holds 1.5x a ball's volume and a cube about 1.9x, so all of this is wrong. Proposals 2 and 3 caught it; this one did not.
2. Hero labels may not match the drawn shapes. The template man is labelled with exact scores 48, 96, 192 and 384, but widen() grows each part by (S/24)^(e/2) with made-up exponents (WIDEN_E). Nothing checks that the drawn volume matches the label. The figures also read as obese, not muscular.
3. T/A/F are drawn as three specific, ordered spans (T about 48–72, A about 60–110, F about 120–260). F runs past the stated 40–200 guess. Even labelled 'placeholder', the drawing implies a known order and position. One 40–200 '?' bracket would be honest until the geometry is run.
4. The bench sample breaks the Step 1 rule. It is loaded with Rex's turnaround and reports a mass of 2,450 kg, against the 2,700 kg in Rex's ranking row on the same page. The brief forbids measuring mass or girths from the turnarounds in Step 1. The 'back' view is a mirrored front, so the PASS on 'Landmarks line up within 1.5%' is not a real check. The copy also says the guide lines are 'found on the front view', but the code places them at fixed fractions.
5. The detail panel draws Coleman's derived 89 cm thigh as 'dotted: template', but the key says dotted means 'no girth for this part'.
6. On phones the range bars shrink to just a diamond at the default 15–1,000 scale, so the uncertainty the design is built around disappears at 390 px.
7. The page is dense for the stated reader. The ruler carries a second (kg) conversion scale with 't' units, plus six lanes and three bracket rows. It is 10,100 px on desktop and 14,800 px on a phone, and the bench sheet scrolls sideways inside its box.

#### Police lineup / museum specimen parade: figures first in score order on a studio wall, gap tiles of hatched floor, to-scale log strip below (lineup/)

Best ideas:

1. It caught the brief's false meatball claim and words it honestly: 'The scale ends at 924', never 'no body can pass 924'. It also gives the cylinder arithmetic (about 1,390).
2. The figures-first lineup on the turnarounds' blue-grey wall, with ANSUR landmark guide lines, is the most immediate read of 'only the build differs'. The meatball is a disc as tall as the drawn figure, with a drafting centre cross.
3. The to-scale strip is honest: per-build range bars greedy-packed in lanes, labelled hatched EMPTY bands, a dashed 'three body limits fall somewhere in 40–200 (not yet worked out)' bracket, and hollow middle dots for overstated comics. It also glosses the log scale in plain words: 'each step to the right multiplies the score'.
4. The drawer caption states the per-region marking in words ('Solid edge: chest, waist, flexed arm and calf from his reported girths. Dashed: thigh, forearm and neck…'), so the marking doesn't depend on seeing a 2 px dash pattern.
5. Planned for the build: once computed, each functional limit becomes a construction-line ghost figure (outline only, no fill) at its rank in the lineup.

Problems:

1. The spacing mixes two signals. Figures are rank-ordered with no scale, but gap tiles are 'log-proportional with a minimum', and the last gap stretches to fill its row. In the mock the 189–924 floor is about 7x the width of the 81–140 tile, against a true log ratio of about 2.9x. Meanwhile 39–50 and 81–140 render at nearly equal widths. A reader cannot tell which widths carry meaning. Make all tiles equal and let only the strip carry proportion.
2. A lineup in 'score order' implies a ranking, yet the ranges overlap heavily (Reeves 24–27, Army 95th 26–29, Batman 25–29). No copy warns that overlapping figures can't be ranked.
3. 'Key 20' is a selection that decides which builds the reader sees first; the selection rule is not stated yet.
4. The status labels contradict each other. The drawer marks the score ESTIMATE but plain FFMI DERIVED, though both come from the same assumed body fat. Meanwhile the key says both 'carry the chip's status'. It also uses an 'ASSUMED' chip, which is outside the house vocabulary.
5. The limits section prints '≈ 60 / ≈ 95 / ≈ 150' for positions no one has computed. Even with MOCK POSITION chips, specific '≈' numbers contradict 'not worked out yet', and the house standard bars '≈' for a big gap.
6. The tool would teach wrong inputs and break the Step 1 rule:
   - The sample is the turnaround, reporting a new mass (2,450 kg); Step 1 forbids measuring mass or girths from the turnarounds.
   - The height field is just 'HEIGHT', prefilled with 3.048 m, the crest height, while the score must use skull-top height.
   - The 'detected guide lines' are fixed ANSUR human fractions laid over a dinosaur.
7. Edge vocabulary: dashed means template and dotted means art, which clashes with the chips beside them (dashed = reported, dotted = derived).
8. At the 92 px phone figure size, dashed and dotted edges are hard to tell apart. There is no flag on the figure itself for overstated comics, only a small red text line on the plate.

#### Phone-first scroll: a sticky to-scale log tape rail beside score-band 'stops' with verdict headlines and lineups (reader/)

Best ideas:

1. The functional limits are the most honest of the three. A '?' badge stands in place of any score, the stop is tagged 'Score 40 to 200?', and 'Each "?" becomes a score once the geometry is run.' The widened template is real geometry: widths x1, x1.5, x2 and x2.6 give 23, 51, 90 and 152 (23 × f²), so the labels and drawings agree.
2. The tool opens on its own validation case (Rex from duo.jpg, front only, which must land within 2.52 to 2.60 m³), never on the turnarounds.
   - The height field says 'Height to top of skull' with the hint 'Not crest or horn tips.'
   - Checks are honest SKIP/NOTE items ('No side view: depths come from ANSUR II depth-to-width ratios (soldiers, not dinosaurs)').
   - Results carry 'measured from art · estimate'.
3. The meatball is framed honestly: 'This is a chosen end point, not a law of geometry.' It stands next to the Army median for scale.
4. Gap stops ('EMPTY', 'NO BUILDS HERE', with what Step 2 will add) make each empty stretch impossible to skim past. The sentence 'as big as from an ordinary man to Ronnie Coleman' is computed from score ratios.
5. The desktop rail is a true to-scale overview: vertical range bars per group lane, hatched EMPTY bands, the Kouri 25 line, a dotted 'LIMITS SOMEWHERE HERE?' bracket and the 924 circle. A box shows the current stop, and tapping the tape jumps to a stop.
6. Notes catch things the others miss: 'The soldiers are percentiles of each measure, not real people', and 'Comic … shapes are not [official]: every girth is filled from a template, so every edge is dashed.'
7. The outlines are real geometry from figure.js, not hand mocks.

Problems:

1. The page never tells the reader the rail is logarithmic. 'Log' appears only in code and aria-labels; no visible text says so. On the rail, 15–41 takes about 24% of the height and 188–924 about 38%. A general reader will read it as linear and think the empty top is about 750 points of nothing at equal weight. Add a one-line gloss like the instrument's 'equal steps are equal ratios'.
2. The stop headlines name a group but hold others. 'ORDINARY MEN' (score up to 25) contains Steve Reeves, Chappell's natural pros, the Thai elite bodybuilders, Fry's non-elite bodybuilders and four comic heroes. 'Trained hard' contains Kingpin ('much of his weight is fat') and armoured Colossus. Name the stops by score band, or make the headline true.
3. Same height is broken across stops. Rex, Ollie and the meatball are drawn at a 230 px skull height (140 px on phone), while every other figure gets 150 px (86 px on phone). Next to 'about twice the Hulk', the larger drawing visually exaggerates the duo against the comic stop above.
4. The meatball circle is clipped by the neighbouring cell at both 1280 and 390 px, so the to-scale mark is not fully drawn.
5. Wolverine is scored (33–36) after subtracting an unsourced 'about 45 kg' of adamantium. The brief treats him as excluded, and the instrument's 'not scored' is the defensible choice.
6. Copy calls 924 'the ceiling' in the 188–924 stop, which contradicts 'chosen end point' one stop later.
7. The status labels are inconsistent:
   - Builds with measured body fat show a single number ('28 DERIVED') with no spread.
   - The '[geometry]' chip is outside the house vocabulary.
   - The lede's headline numbers carry no status chip.
8. Stop membership uses the middle score while ranges straddle the stop edges (Luke Cage 38–41 against a gap starting at 41).
9. On phone the rail shows only middle ticks, not ranges.
10. Edge vocabulary: dashed means template and dotted means art, the same clash with the chips as the lineup.
11. Arm 'seam' hairlines add interior detail the brief's style key avoids.
12. Feasibility risks:
   - The sticky rail relies on 100svh inside the artifact frame.
   - The page is 1.1 MB, mostly unsimplified traced outlines.
   - Scroll-sync for the current-stop box adds complexity.

### General-reader critic

| Proposal | Accuracy | Readability | Phone | Distinctiveness | Feasibility |
|---|---|---|---|---|---|
| Scientific instrument (slide-rule hero + 49-row forest plot) | 6 | 5 | 5 | 7 | 8 |
| Police lineup / museum-specimen parade | 7 | 7 | 7 | 8 | 6 |
| Phone-first scroll tape with stops and a pinned to-scale rail | 8 | 8 | 8 | 7 | 7 |

**Recommendation.** Build on the reader proposal (phone-first stops with a pinned to-scale rail). It is the only one where a phone reader with ADHD gets a one-line verdict at every step, readable type (nothing under 11 px except the rail numbers), full-word status chips, and correct copy about 924.

Fix its two phone weaknesses first:
1. Put "Jump to Rex and Ollie" in the lede, label the duo's mark on the rail, and add a visible "tap the tape to jump" hint or a phone Go-to menu.
2. Move the 6-item edge key below the first lineup, or shrink it to one line with a "how to read a figure" toggle.

Graft from the lineup proposal:
- Its hatched-floor gap tiles and the meatball disc at the end of the empty floor. These are stronger than plain hatched boxes.
- The landmark wall rules.
- A tap-a-figure drawer at H≈230 with per-part marking explained in words. Without it the edge marking cannot be read on a phone.

Graft from the instrument proposal:
- Its "Zoom 15 to 50" idea, for a to-scale lane of humans.
- The detail panel's girth-by-girth outline list and "What this ignores".
- The bench's PASS/CHECK chips with numbers and its ± column.
- The worked plain-FFMI-versus-score table.

Rules for the build, whichever base is used:
- Never write "no body can score above 924" or "nothing can score higher". The instrument mock does both, and the claim is false: a cylinder of the same height scores about 1.5 times as much.
- Default to all 49 builds, not "Key 20".
- Don't put an empty decorative log tape over anything that is not to scale.
- Keep every label at 11 px or more on the phone, including SVG guide labels (the lineup's are 4.1 px).
- Default the tool's height field to skull-top height, not 3.048 m.
- Simplify the inlined outlines well below 1 MB.

My crops and measurements are in /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/phonereview/: fonts.js gives the font-size census, modes.js the control check, ins-hero.png shows the label collisions, and v-reader-dpr2.png shows the rail at Rex's stop.

#### Scientific instrument (slide-rule hero + 49-row forest plot)

Best ideas:

1. Sticky score axis over the ranking. It works at 390 px, and its hatched voids plus the 'EXTRAPOLATED →' mark stay visible while you scroll (checked by scrolling to y=9900).
2. The 'Zoom 15 to 50' option. On a phone this is the only thing that makes the human bars readable as ranges (390-modes.png). Without it, the bars shrink to a diamond.
3. Gap rows placed in score order ('NOTHING FROM 90 TO 151' with a hatched block on the track). They make the voids part of the list, not a footnote.
4. The detail panel lists every girth with the outline it produced ('91 cm · solid outline', 'unknown · dotted: template'), followed by 'What this ignores'. It is the clearest provenance explanation of the three.
5. Measuring-bench checks and results: PASS/CHECK chips with numbers, a ± column, a bold top three rows (volume, mass, score), and the duo.jpg validation line.
6. The worked table in 'How the score works' (Army median / Coleman / Rex: plain FFMI next to score), plus 'Every 1% of height moves the score about 3%'.

Problems:

1. False claim. The verdict says 'No body can score above 924', and the meatball row says 'Nothing can score higher.' As the other two proposals note, a cylinder of the same height holds 1.5 times the volume of a ball. The owner would fail this.
2. Small text on the phone. A computed-style pass at 390 px found about 1,350 characters at 9.5 px, 50 at 7 px and the rest of the hero at 9–10 px. That covers the ruler numbers, lane names, Kouri/extrapolation/frame labels, row 'SCORE' and 'estimate' chips, and the bench guide labels (7–7.8 px).
3. Lines run through labels in the hero at 390 px: the Kouri hairline cuts '100 kg', and the red extrapolation rule cuts 'FAT-FREE' (crop: phonereview/ins-hero.png). The 924 circle sits over about 570 on the ruler, not over its 924 tick, on both phone and desktop. In a design where horizontal position is the meaning, that is a mis-registration.
4. Too many ideas in one hero for an ADHD reader on a phone: two scales on one ruler (score and kg of fat-free mass), T/A/F brackets, Kouri, the frame bracket, the extrapolation rule, voids and 6 lanes. The first screen has no control and no figure. It is verdict, then spec line, then more prose.
5. On a phone at full scale, the range bars shrink to a diamond plus caps, so 'each score is a range' shows only in text. Every row carries 3–4 boxed values plus 2 chips. The black 'measured' pills (height and weight) are the heaviest marks, so the eye goes to them, not to the score.
6. Length. The page is 14,812 px. Rex's own row is about 12 screens down (y≈9,950). The hero places him on screen 2, but only with a 10 px label.
7. In real-heights and side view, phone rows show about 20 px figures, which are unreadable.

#### Police lineup / museum-specimen parade

Best ideas:

1. Best five-second test of the three. The first 844 px holds the verdict (with 160/180 and an 'all estimates' chip), the three controls, the lineup verdict and the first row of figures. Rex and Ollie are about 2.4 screens down (y≈2,000), so a phone reader sees the point quickly.
2. Gap tiles of bare hatched floor inside the lineup, with plates such as '81–140 / Empty. No build measured here yet.' The final '189–924' floor runs out to the meatball disc. This is the most physical way to show the voids.
3. The drawer at H=230, with a caption that says in words which parts are solid and which are dashed. This is where the per-part marking can actually be read on a phone.
4. It calls 924 a chosen end ('The scale ends at 924') and gives the cylinder argument. That is honest.
5. Wall rules at ANSUR landmark heights (skull, waist, knee) behind every figure. With them, same-height figures read as comparable.
6. The limits strip of four template figures, with the deciding body part outlined in chalk blue. It shows each functional limit as a picture, not a bracket.

Problems:

1. The mock's controls do nothing. Clicking 'Real heights', 'All 49' or 'Side' at 390 px leaves the page height (8,075 px) and its markup unchanged. The 49-build phone lineup (their own estimate is about 3,000 px) and the side and real-height modes are unproven.
2. 'Key 20' is the default, so 29 builds are hidden on arrival. To a critic this reads as cherry-picking unless the selection rule sits right beside the toggle, and the mock does not show that rule.
3. The full-bleed log tape at the top has no builds on it and sits directly above a lineup that is not to scale. That invites the reader to read figure positions against the tape. The sub-line saying 'not to scale' is 12 px grey text.
4. Plate type is small on the phone: names 11 px, 'FFMI x–y' 9.5 px, and the overstated flags ('▲ DENSER TISSUE CLAIMED') 9.5 px in red capitals. The status chips are 8.5 px abbreviations (EST/DER/ART), so the reader has to look them up in the key.
5. Bench sheet guide labels render at 4.1 px, which is unreadable. The tool's 'HEIGHT' field defaults to 3.048 m, which is crest height. That contradicts the canon that scores use height to the top of the skull.
6. On the phone, the 81–140 gap tile is narrower than one figure cell. It reads as a small gap even though it is as large as everyday-to-Coleman.
7. The limit figures use '≈ 60 / ≈ 95 / ≈ 150', which look like findings despite their MOCK chips. The widened template looks obese.

#### Phone-first scroll tape with stops and a pinned to-scale rail

Best ideas:

1. Every stop opens with a yellow score tag ('SCORE 41 TO 57'), a display headline and a one-line verdict ('Nothing measured scores 41 to 57. No human and no comic character.'). That is the right shape for an ADHD reader.
2. It has the most legible phone type of the three. Plate scores are 17 px, chips use full words (ESTIMATE, DERIVED), and FFMI and the overstated notes are 11–11.5 px. Only the rail numbers (9.5 px) and the bench sheet labels (7.8 px) fall below 11 px.
3. A sticky to-scale rail with a current-stop box. While scrolling at Rex's stop it shows the box sitting at 150–190 on the log tape (v-reader-dpr2.png). Proportion stays visible while the figures get room.
4. Gap edges and comparison sentences are computed, not typed ('as big as from an ordinary man to Ronnie Coleman', 'about twice the Hulk').
5. The meatball stop calls 924 'a chosen end point, not a law of geometry' and shows the formula. The natural-limit stop has status-chipped anchor rows and 'The top of one sample, not a ceiling'.
6. Real-height mode adds 1 m, 2 m and 3 m wall lines (z-real-top.png). The tool opens on its own validation case (duo.jpg) rather than on the turnarounds.

Problems:

1. 'Where does Rex sit?' needs a long scroll. His figures are at y≈7,555 of 11,880 (about 9 screens). On the phone the rail marks are unlabelled ticks in a 14 px strip. There is no Go-to menu below 720 px, and nothing on the page says the tape can be tapped to jump, so that affordance is hidden.
2. The first phone screen spends about 250 px on a 6-item edge key before the reader has seen a figure. The key swatches use four different group fills, so the fill colour looks as if it carries the edge meaning.
3. The 46 px rail takes width from 3-up figures at 86 px, where the dashed and dotted edges are hard to tell apart at 1x. Rail labels are 9.5 px.
4. The page carries about 1.1 MB of inlined figure data. In headless Chromium, a viewport scrolled 1.2 s after load painted blank, and it rendered after about 3 s. That needs Ramer-Douglas-Peucker simplification before shipping, as the proposal itself notes.
5. The 'GEOMETRY' chip is outside the agreed status vocabulary. Gap stops are equal-height boxes, so their size shows only on the rail.
6. The sticky rail depends on 100svh inside the claude.ai frame, which is unverified.

## The spec (synthesis)

### Chosen style

Studio lineup on a tailor's sheet. This is the lineup proposal's style A, kept because the current build already uses it, with its group palette re-stepped and every accent given one job.

- **The lineups.** Every lineup stands against the turnarounds' blue-grey studio wall, ruled at ANSUR II landmark heights, on a light floor that carries each build's plate.
- **The page around them** is the Build Calculator's measurement sheet: the same paper, ink, yellow tape, chalk blue, fonts (Big Shoulders Display, Public Sans, IBM Plex Mono) and status chips. The two pages read as one family.
- **Figures.** Flat fills, one per group, from the art. The ink edge alone says where each part of an outline came from.
- **One job per accent colour:**
  - Yellow tape is the scale: the log tapes and the score tags on each stretch.
  - Chalk blue is geometry: the skull-top line, the functional limits, the meatball and template outlines.
  - Alarm red is a warning: not comparable, may be overstated, beyond human data, FAIL.
  - Ink is data and anchors: edges, Kouri's 25, text.
- **No dashes on any drawing.** Dashed borders mean "reported" on the house chips, so figures, walls and limit marks use only solid, dotted and dash-dot lines.
- **Palette fix.** The current fills failed the all-pairs colour-blind check: Rex and Ollie's maroon against the strongmen's umber scored ΔE 4.5, and 12.0 for normal vision. That pair could not be told apart in a legend or in a mixed lineup. Two fills move:
  - Rex and Ollie: Ollie's maroon briefs, moved toward plum.
  - Comic characters: the navy briefs, lifted a little.

  Validated numbers are under style_alternatives.

### Style alternatives

Three styles were considered.

**1. Studio lineup (picked).**
- The wall is the turnarounds' own backdrop (#888898, lightened), so traced figures and figures drawn from data stand in one world.
- Each group's fill comes from the art:

  | Group | Fill | Taken from |
  |---|---|---|
  | Everyday men | slate | the studio |
  | Natural athletes | crest gold | Rex's crest glint |
  | Bodybuilders | rust | Ollie's skin |
  | Strongmen and lifters | umber | Rex's scales |
  | Comic characters | navy | Rex's briefs |
  | Rex and Ollie | plum | Ollie's maroon briefs, shifted |

- It keeps the sister page's fonts, chips and tape.
- It is already built, so the rework is small.

**2. Umber print (the reader proposal's style C).**
- Every figure gets the same umber fill. Group shows only as a floor tile and a swatch by the name.
- It is the strictest reading of "builds differ only in their outline marking", and its edges read best.
- Rejected as the default: a skimming reader can no longer see at a glance that every giant is a comic character, or that Superman stands among ordinary men.
- Kept as the fallback if review finds group colour competes with the edges. To switch, set every --g-* fill to #4A3324 (light) or #C9A27E (dark) and keep the swatches.

**3. Dark single-accent looks.** These are the instrument's brass dial, the lineup's night gallery and the reader's cyanotype sheet: an umber or navy ground with gold or white engraving.
- They are dramatic and close to Rex's palette.
- Rejected because they drift into the templated near-black-plus-one-accent look. Their pale tints fail colour-blind and normal-vision separation, and they break the tie with the daylight Build Calculator.

**Also looked at, not shortlisted:**
- The instrument's "studio plate": same family, but its slide-rule hero carried two scales, six lanes and three bracket rows, which is too dense for the reader.
- "Turnaround grey" (the chart on #888898): white 11 px text at about 3:1, and no light or dark theming.

**Validator record.** dataviz scripts/validate_palette.js, all pairs:

| Theme | Surfaces | Worst colour-blind ΔE | Normal-vision floor | Result |
|---|---|---|---|---|
| Light | wall #DADCE4, sheet #F8F8FA | 11.7 (deutan, plum against umber) | 15.7 | PASS |
| Dark | wall #262833, sheet #1B1D23 | 13.5 (protan, plum against blue) | 15.0 | PASS |

Some checks fail on purpose:
- **Lightness band:** light umber (L 0.37); dark slate, gold and umber.
- **Chroma floor:** slate, the neutral reference group, and umber.
- **Contrast WARN:** gold at 1.7–2.2:1 in light, umber at 1.9–2.2:1 in dark.

What covers them: every figure has an ink edge, every plate and every bar row carries a text name, and fill colour never carries meaning alone.

Text tokens were checked for WCAG contrast. Everything is 4.5:1 or better, on paper, sheet, wall and floor in both themes; the lowest is dark --ink-3 on the dark floor, at 4.9:1.

The palette search script is at /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/final/search.mjs, and the contrast check at /tmp/claude-0/-home-user-rex-strength-lab/9b81b796-3162-56bd-85b7-22e02b6583e2/scratchpad/design/final/contrast.py.

### Tokens

```css
:root {
  /* surfaces */
  --paper:#ECEDF1; --sheet:#F8F8FA; --wall:#DADCE4; --wall-line:#C2C5D1; --floor:#F1F1F4; --floor-edge:#A9ADBB;
  /* text and rules */
  --ink:#15181F; --ink-2:#464C5A; --ink-3:#5C6270; --rule:#C4C7D0; --rule-2:#E0E2E8;
  /* accents, one job each */
  --tape:#EDBE2E; --tape-ink:#231D07;                                        /* scale */
  --chalk:#1F4FA6; --chalk-bg:#E3E9F5; --chalk-band:rgba(31,79,166,.10);     /* geometry */
  --alarm:#B0321D; --alarm-bg:#F6E2DC;                                       /* warnings */
  --void:#9EA2B0; --void-bg:#E6E7EC;                                         /* empty stretches and not-comparable hatch */
  /* group fills (validated, all pairs) */
  --g-every:#7D8599; --g-natural:#CFA23A; --g-bb:#B9592A; --g-strong:#5A3624; --g-comic:#3A55B0; --g-duo:#8A2F6E;
  --g-geom:#A4A7B3;                                                          /* geometry fill: meatball, limit templates */
  /* drawing */
  --edge-w:3.8px;                                                            /* stroke under the fill: 1.9 px shows */
  --dot:0.1 6.4; --dashdot:8 6.4 0.1 6.4;                                    /* stroke-dasharray, round caps */
  /* type */
  --font-display:"Big Shoulders Display","Arial Narrow","Roboto Condensed",sans-serif;
  --font-body:"Public Sans","Helvetica Neue",Arial,sans-serif;
  --font-mono:"IBM Plex Mono",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  --fs-11:0.6875rem; --fs-12:0.75rem; --fs-13:0.8125rem; --fs-14:0.875rem; --fs-15:0.9375rem;
  --fs-17:1.0625rem; --fs-18:1.125rem; --fs-22:1.375rem; --fs-24:1.5rem;
  --fs-stop:clamp(1.625rem,4.2vw,1.875rem); --fs-h1:clamp(2.6rem,8vw,4.4rem);
  --radius:3px;
  color-scheme:light;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --paper:#14151A; --sheet:#1B1D23; --wall:#262833; --wall-line:#373A49; --floor:#30323D; --floor-edge:#555A6B;
    --ink:#E8E9EE; --ink-2:#B4B8C3; --ink-3:#9CA1AF; --rule:#3A3E4A; --rule-2:#272A33;
    --tape:#DDB02C; --tape-ink:#1B1604;
    --chalk:#94B5FF; --chalk-bg:#22304F; --chalk-band:rgba(148,181,255,.12);
    --alarm:#FF8C75; --alarm-bg:#3A1C16;
    --void:#5A5E6E; --void-bg:#23252D;
    --g-every:#9AB4D0; --g-natural:#E8C25A; --g-bb:#D9763F; --g-strong:#7A4536; --g-comic:#6680E0; --g-duo:#B85C8C;
    --g-geom:#6E7080;
    color-scheme:dark;
  }
}
:root[data-theme="dark"] {
  --paper:#14151A; --sheet:#1B1D23; --wall:#262833; --wall-line:#373A49; --floor:#30323D; --floor-edge:#555A6B;
  --ink:#E8E9EE; --ink-2:#B4B8C3; --ink-3:#9CA1AF; --rule:#3A3E4A; --rule-2:#272A33;
  --tape:#DDB02C; --tape-ink:#1B1604;
  --chalk:#94B5FF; --chalk-bg:#22304F; --chalk-band:rgba(148,181,255,.12);
  --alarm:#FF8C75; --alarm-bg:#3A1C16;
  --void:#5A5E6E; --void-bg:#23252D;
  --g-every:#9AB4D0; --g-natural:#E8C25A; --g-bb:#D9763F; --g-strong:#7A4536; --g-comic:#6680E0; --g-duo:#B85C8C;
  --g-geom:#6E7080;
  color-scheme:dark;
}
body { background:var(--paper); color:var(--ink); font:400 var(--fs-15)/1.5 var(--font-body); -webkit-text-size-adjust:100%; }
.num, .mono { font-variant-numeric:tabular-nums; }

/* Status chips: the house vocabulary, raised to 11 px. No other chip words (no ASSUMED, ART, GEOMETRY, EST/DER). */
.chip { display:inline-block; font:500 var(--fs-11)/1 var(--font-mono); letter-spacing:.06em; text-transform:uppercase; padding:4px 6px 3px; border-radius:2px; border:1.5px solid var(--ink); color:var(--ink); white-space:nowrap; vertical-align:middle; }
.chip.measured { background:var(--ink); color:var(--sheet); }
.chip.official { border-style:double; border-width:3.5px; padding:2.5px 5px 1.5px; }
.chip.reported { border-style:dashed; }
.chip.derived  { border-style:dotted; border-width:2px; padding:3.5px 5.5px 2.5px; }
.chip.estimate { border-style:dotted; border-width:2px; padding:3.5px 5.5px 2.5px; background:repeating-linear-gradient(135deg,var(--rule) 0 1.5px,transparent 1.5px 5px); }
.chip.unknown  { border-color:var(--rule); color:var(--ink-3); font-style:italic; }
/* Flags: the words carry the meaning; colour only says "warning". */
.chip.over   { border-color:var(--alarm); color:var(--alarm); background:var(--alarm-bg); }  /* NOT COMPARABLE, MAY BE OVERSTATED */
.chip.beyond { border-color:var(--alarm); color:var(--alarm); background:transparent; }    /* BEYOND HUMAN DATA */
/* Tool check results */
.chip.pass  { border-color:var(--ink); }
.chip.note  { border-color:var(--ink-3); color:var(--ink-2); }
.chip.check { border-color:var(--alarm); color:var(--alarm); }
.chip.fail  { border-color:var(--alarm); background:var(--alarm); color:var(--sheet); }
/* Stop tag (scale position) */
.tag { display:inline-block; font:600 var(--fs-11)/1 var(--font-mono); letter-spacing:.08em; text-transform:uppercase; background:var(--tape); color:var(--tape-ink); padding:4px 8px 3px; border-radius:2px; }
:focus-visible { outline:2px solid var(--chalk); outline-offset:2px; }
@media (prefers-reduced-motion: reduce) { * { transition:none !important; scroll-behavior:auto !important; } }
```

SVG patterns are defined once in a hidden `<svg>`. Their colours are set by CSS classes (for example `.hatch-void rect{fill:var(--void-bg)} .hatch-void line{stroke:var(--void)}`), never by var() in presentation attributes, so Safari themes them too.
- **#hatch-void:** a --void-bg rect, with 1.5 px --void lines at 135°, 5 px apart.
- **#hatch-g-{group}:** a --wall rect, with 1.5 px lines in the group colour at 45°, 5 px apart (for tails).

### Fonts

Google Fonts is the only outside request. Use the sister page's exact link:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@600;700;800&family=IBM+Plex+Mono:wght@400;500;600&family=Public+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap">
```

Roles:

- **Big Shoulders Display 800, uppercase:**
  - H1 at --fs-h1, line-height .92, letter-spacing .01em.
  - Section h2 at --fs-24.
  - Stop headlines at --fs-stop.
  - Plate score ranges: 24 px desktop, 20 px phone, tabular.
  - Big values in limit plates and anchor rows: 28 px.
- **Big Shoulders Display 700:** the "NO BUILDS HERE" label in gap tiles, 22 px, in --ink-3.
- **Public Sans:**
  - Body 15/1.5.
  - Verdicts 600 at 18 px desktop, 17 px phone.
  - Lede 18/1.45 desktop, 17/1.45 phone, with numbers in 700.
  - Build names on plates 600 at 13 px desktop, 12 px phone.
  - Forest names 500 at 13 px.
  - Sub and note text 13–14 px in --ink-2.
- **IBM Plex Mono:** every data line, axis label, chip, tag, eyebrow and spec line.
  - Eyebrows and labels: 11 px, 600, uppercase, letter-spacing .08–.1em.
  - Data: 11–13 px, 400/500, tabular numbers.

Hard rule: no visible text under 11 CSS px at 390 px wide. That includes axis and tape labels, chips and the tool's guide labels.

To keep that true in charts, SVGs carry shapes only. Every chart label is HTML, positioned with percent offsets over the chart, so it renders at real CSS px however the chart scales.

### Layout

Breakpoints: phone below 720 px; desktop from 720; masthead two columns from 960. Under 360 px, lineups drop to three figures a row. The wrap is max-width 1280 px with a 16 px side gutter (content 1,248 px at 1280). Every section opens with an eyebrow or tag, an uppercase heading, a bold one-line verdict, then at most two lines of grey support text. There is no horizontal scroll at any width, in any mode.

## Desktop (1280)

### 1. Masthead (padding 28 px top, 20 px bottom)
- Grid 7fr 5fr, gap 40.
- **Left column:**
  - mono eyebrow;
  - H1 "BUILD COMPARISON";
  - lede (60ch, 18 px), whose numbers are links to their stops, with an ESTIMATE chip after the duo sentence and a DERIVED chip after the 924 sentence.
- **Right column, bottom-aligned:**
  - a "The score" box: --sheet background, 1 px --rule border, 3 px radius, padding 14×16, 14 px text;
  - under it, a three-item edge key with drawn 56×18 swatches.
- **Full-width spec line:** mono 12, --ink-3.
- **Glance block (full width):**
  - a caption line (mono 11 label plus a 13 px sentence);
  - the glance tape, 84 px tall (spec in chart_spec);
  - a jump row: mono 12 links separated by " · ", on one line.

### 2. Controls row (padding 14 px, no border)
- Two segmented controls, FIGURES and VIEW, with mono 11 labels above them.
- When Real heights or Side is on, a one-line 13 px --ink-2 note sits under the row.

### 3. The lineup, in stops (border-top 1 px --rule)
- **Intro:** verdict, then the sub-line, then the edge strip: one line, mono 12, three drawn samples plus a "Full key" link.
- **Sticky locator:** 48 px high, full content width, top 0, sticky inside this section only.
- **Ten stops,** each with padding-top 36 px and border-top 1 px --rule (none on the first):
  1. under 25
  2. 25 to 32
  3. 32 to 42
  4. GAP 42 to 59
  5. 59 to 88
  6. GAP 88 to 130
  7. Rex and Ollie, 130 to 220
  8. GAP 220 to 924
  9. Meatball 924
  10. Measure (that one is a later section, not a stop)

  The ranges are computed. The figures above are from today's data; the builder must not type them.
- **Stop head** (max-width 76ch): the tag row (.tag, plus a BEYOND HUMAN DATA chip when the stop starts at 42 or above), the headline, the verdict, the here-line (mono 12, --ink-2) and the note (14 px, --ink-2, 70ch). Then the lineup row, 14 px below.
- **Lineup row:** a flex-wrap row with 14 px row gap and no column gap.
  - Figure cells: width 120 px, growing to at most 200 px (flex 1 0 120px; max-width 200px). They are buttons.
  - Each row ends with a filler wall cell (flex 1 1 0, aria-hidden) that carries the wall and floor to the right edge.
  - Cell SVG: H = 150 px from skull top to floor; headroom 0.09H = 14 px; floor band 8 px; SVG height 172.
  - Plate: min-height 124, padding 8/8/10, on --floor, with a 1 px --floor-edge top border.
- **Gap stop:** one tile, 100% wide and 296 px tall (the height of a figure row plus its plate), so every gap tile is the same size. Spec in chart_spec.
- **Drawer:** inserted at the end of the tapped figure's stop.
  - --sheet background, 3 px --chalk top border, padding 20.
  - Grid 280px | 1fr, gap 28: the figure on a wall panel at H = 240, then the facts.
  - Rows are a dl in a grid of 150px | 1fr: label mono 11 uppercase, value 15 px.
  - Close button at top right.

### 4. How to read a figure
- A `<details>` element, open on desktop.
- Two columns, 1.2fr | 1fr:
  - left: edges and the plate;
  - right: the six group swatches plus geometry, then the five status chips with their definitions from builds.json status_vocabulary.

### 5. Every build, to scale (forest plot)
- Section head, then the SCALE segmented control and a legend row (mono 12, wraps).
- Then the plot: a sticky axis header 44 px tall, and rows on the grid 250px | 1fr | 120px, row height 24 px (spec in chart_spec).
- About 62 rows: about 1,500 px.

### 6. Where the body stops working
- Head, then four figure cards in a row (grid repeat(4,1fr), gap 12):
  - 1. the median soldier's shape at the start (27);
  - 2. arms out;
  - 3. thighs touch;
  - 4. hands to face.
- Each card: a wall panel with the figure at H = 200, then a plate with the big value (28 px), the range line, a chip, the label (600) and the definition (13 px).
- Notes follow as a bullet list, 70ch.

### 7. The score, and the natural limit
- Two --sheet cards, grid 1fr 1fr, gap 24.
- **Left card:** the formula block (mono 15 on --chalk-bg, with a 3 px chalk left border), the body text, a worked table (Build | Height | Fat-free mass | Plain FFMI | Score) and the meatball paragraph.
- **Right card:** the natural anchors, one per row. Each row is a 64 px value column (Big Shoulders 28) then: the label (600), the kind (mono 11, --ink-3, plain text, never chip-styled), the status chip, and the text (13 px).

### 8. Measure a character
- A --sheet card in two columns, 5fr | 7fr, gap 28.
- **Left column:**
  - the example select;
  - the sheet viewer (the SVG at the column's width, with an HTML label gutter of 64 px at its left);
  - the checks list.
- **Right column:**
  - the tool test line;
  - the inputs, in a three-column grid;
  - Measure and Copy results buttons;
  - the status line;
  - the results table.
- **Below, spanning both columns:** the target outline. Grid 260px | 1fr: inputs on the left; on the right, two images side by side, each 320 px tall.

### 9. What this ignores
Bullets at 76ch.

### 10. Sources
`<details>` per topic, then the colophon (13 px, --ink-3).

**Estimated length:** about 11,000 px.

## Phone (390; content 358 px)

### 1. Masthead (one column)
- Mono 11 eyebrow, H1 (41.6 px, one line), lede at 17 px (about 7 lines, with chips).
- The spec line (mono 12, wraps to 3 lines) also holds the score definition. There is no right-hand box; the edge key moves to the lineup intro.
- Glance caption (2–3 lines).
- Glance tape, 76 px tall: ticks 20 px, tape 24 px, labels 30 px; labels in short form.
- Jump row, wrapping to 2 lines.
- The first frame (844 px) reaches the stop 1 tag and verdict, and the tops of the first figures sit near 780–840 px.

### 2. Controls
- One row: FIGURES [Same | Real] about 190 px, then VIEW [Front | Side] about 130 px.
- Buttons are 36 px tall, 14 px text.

### 3. Lineup
- Intro verdict (17 px), sub (13 px) and the edge strip (two lines).
- **Sticky locator** (48 px):
  - Line 1: "TO SCALE · NOW: 32 TO 42", mono 11.
  - Line 2: a 26 px tape.
- **Stops** use the same structure as desktop: tag; headline at 26 px; verdict at 17 px; here-line in mono 12, wrapping; note at 14 px.
- **Cells:** four a row (flex 1 0 84px, max 120px), H = 92, headroom 8, floor 6, SVG 106 px tall.
- **Plates:** min-height 120, padding 6/5/8:
  - range in Big Shoulders 20;
  - "39 at 6% fat" in mono 11;
  - the chip (11 px; "ESTIMATE" is about 70 px wide);
  - a 9×9 swatch and the name (12 px, 600, up to 3 lines; short names from settings);
  - "FFMI 37–40" in mono 11;
  - any flag lines (alarm, 11.5 px).
- **Gap tiles:** 358 px wide, 226 px tall.
- **Drawer:** stacked. The figure panel is full width with the figure at H = 200, then the facts dl in one column (label above value).
- Lineup length: about 5,700 px.

### 4. Key
`<details>`, closed by default (summary "How to read a figure: the full key"), one column.

### 5. Forest plot
- Two-line rows, 32 px each:
  - line 1: swatch, name (13 px), and the range on the right (mono 13), with a DERIVED chip when one applies;
  - line 2: the full-width 12 px track.
- Sticky axis header, 44 px.
- About 2,000 px.

### 6. Limits
Cards in a 2×2 grid, figures at H = 140.

### 7. Score and natural limit
The two cards stack. The worked table has 4 columns: Height and Fat-free mass merge into one cell as "1.75 m · 64 kg".

### 8. Tool
- Stacked: example select, sheet viewer (full width, never its own scroll box; the label gutter shrinks to 52 px with 11 px labels), checks, test line, inputs (two a row; the third wraps), buttons, status line, results.
- Results table: 3 columns, 120 | 1fr | 1fr, one quantity per row, 13 px.
- Target outline: inputs, then the two images side by side at 46% width each, 220 px tall.

### 9–10. Ignores, sources, colophon
One column.

**Estimated length:** about 17,000–18,000 px. It is long because every one of the 49 builds is shown twice: once as a figure, once as a bar. The jump row and the sticky locator are the way around it.

## Ordering rationale
The figures come first: that is the hook, and the brief's "line up on one scale". The glance tape above them and the pinned locator keep proportion visible all the way down. The forest plot follows as the honest to-scale ranking. Method sections follow.

The design record for the project: copy this spec's style choice, palette validation and the judges' fixes into build-comparison/research/reviews/design.md, or data/NOTES.md, per CLAUDE.md.

### Chart spec

## Shared axis

- Log10 scale. Domain [12, 1000], so Bruce Banner's low end, 12.8, sits on the scale. The brief says "about 15"; 12 is the honest start.
- Mapping: x(s) = (log10 s − log10 12) / (log10 1000 − log10 12) × W.
- Close-up domain [12, 45], on the same formula.
- Not a broken axis: a break would cut out exactly the empty stretches the brief wants visibly empty.
- Ticks:

  | | Labelled ticks |
  |---|---|
  | Desktop | 12, 15, 20, 30, 40, 50, 70, 100, 150, 200, 300, 500, 1,000 |
  | Phone | 15, 20, 30, 50, 100, 200, 500, 1,000 |
  | Close-up | 12, 15, 20, 25, 30, 35, 40, 45 |

  Minor ticks, unlabelled: 13, 14, 16–19, 25, 35, 45, 60, 80, 90, 400, 600, 700, 800, 900. A label is dropped if it would sit within 4 px of a neighbour.
- Axis title, mono 11: "SCORE: FFMI AT 1.80 M, SAME SHAPE (KG/M²)".

## Number format, everywhere

- **Scores and FFMI:** whole numbers below 100. From 100 up, 2 significant figures: 160, 180, 130–190, 220.
- **The one exception: 924.** It is a defined end point with its formula shown, and it is never rounded.
- **Ranges:** an en dash with no spaces, "37–40". If a range rounds to one number, write "about 31".
- **Thousands** take a comma: 1,060.
- **Banned:** "≈" and percent increases.
- **Body fat:** whole percents, except 7.5%.
- **Masses:** whole kg below 1,000; 3 significant figures at 1,000 and above (about 2,390 kg).

## Computed values (never typed)

- **Real men end:** realEnd = the highest score.hi among Everyday, Natural athletes, Bodybuilders, and Strongmen and lifters. It is 41.5 today (Big Ramy), shown as 42.
- **Gaps:** model.gaps(list, 924, 1.25). Today: 42–59, 88–130 and 220–924.
- **Stops:**
  - Fixed edges at 25 (Kouri's sample top) and 32 (31.7, Trexler's top college footballer). Both are sourced anchors.
  - Every other edge comes from the gaps.
  - Membership is by working score.
  - A not-comparable build inside a gap belongs to that gap stop. Today that is the Thing, at 58.7.

## A. Glance tape (masthead): the whole scale at once

**Size:** an SVG at its container's pixel width (redrawn on ResizeObserver). 84 px tall on desktop, 76 on phone.

**Tick row** (y 0–22; 0–20 on phone):
- Every build is a 2 px × 18 px rect at x(working score), in its group fill.
- Each rect has a 1 px --paper stroke drawn first (paint-order: stroke), so dense ticks stay separate.
- Each gap is a hatched rect (#hatch-void) from x(from) to x(to) over the tick row.
- 924 is a chalk ring: r 7, stroke 1.5, no fill, centred at x(924). A test asserts its centre is within 1 px of x(924).

**Tape** (y 24–50; 22–46 on phone):
- A --tape rect.
- Major ticks 9 px and minor ticks 5 px, hanging from the tape's top edge in --tape-ink.
- Labels are HTML, mono 11 500, inside the tape at the bottom.

**Cluster labels** (y 54–84). These are HTML buttons in two lines, mono 11: the name in uppercase 600 with the range under it in --ink-2.

| Cluster | Desktop name | Phone name | Range |
|---|---|---|---|
| All stops below the first gap | EVERY REAL MAN | REAL MEN | 13–42 |
| Comic giants | COMIC GIANTS | GIANTS | 59–88 |
| The duo | REX AND OLLIE | REX, OLLIE | 130–220 |
| End | END OF SCALE | 924 | 924 |

- Each label is centred under its cluster, and the 924 label is right-aligned. A collision pass pushes labels apart with at least 6 px between them.
- Tapping a label scrolls to that stop.
- Positions checked at 358 px: men centred at 54, giants at 145, duo at 212, 924 right-aligned at 352. These fit with the short phone names.

## B. Sticky locator (in the lineup section only)

**Size:** position: sticky; top 0; z-index 5; 48 px tall; --paper background; 1 px --rule bottom border.

**Line 1** (16 px), mono 11 600 uppercase, --ink-2:
- "TO SCALE · NOW: SCORE {lo} TO {hi}"; for a gap stop, "NOW: EMPTY {lo} TO {hi}".
- Desktop only, right-aligned: "Tap the tape to jump", in --ink-3.

**Line 2** (26 px):
- An 8 px tick row: builds as 1.5 × 8 px ticks, gaps hatched.
- An 18 px tape with ticks, and labels in mono 11 inside it.

**Current-stop window:**
- A rect with a 2 px --chalk border and --chalk-band fill, from x(stop lo) to x(stop hi), covering the tick row and the tape.
- Minimum width 10 px; radius 2; it moves with a 150 ms transform transition.

**Behaviour:**
- An IntersectionObserver on the stops (rootMargin −45% 0 −50% 0) sets the current stop.
- A click or tap on the tape inverts x to a score and scrolls to the stop that contains it, or the nearest one.
- The SVG has role="img" and aria-label "To-scale tape. Now showing scores {lo} to {hi}." The jump row is the keyboard route.

## C. Gap tile (inside the lineup)

**Structure:**
- One tile, 100% wide, the same height as a figure row with its plate.
- Its wall area matches a figure cell's: the chalk skull-top line and the landmark lines.
- Below it, the floor area is filled with #hatch-void.

**Centre label:** "NO BUILDS HERE", Big Shoulders 700, 22 px, --ink-3, uppercase, centred in the wall area. If a post or a figure collides with it, it moves down 30%.

**Mini-scale** along the floor line:
- A 1 px --ink-3 line from 4% to 96% of the tile width.
- Log positions between the gap's from and to values.
- End labels in mono 11: "{from}" on the left, "{to}" on the right.
- It is to scale only within the tile. All gap tiles are the same size, whatever their real width; the real width shows on the tapes and the forest plot.

**Limit posts:**
- Each functional limit whose headline score falls inside the gap is a 1.5 px solid --chalk vertical line, from the floor line to the skull line, at its x on the mini-scale.
- Its label sits at the top in mono 11, --chalk, on a --wall halo (padding 1 px 3 px): "ARMS OUT · 42", "THIGHS TOUCH · 49", "HANDS TO FACE · 220".
- Today: 42 and 49 fall in 42–59; 220 falls in 220–924, at its left edge.

**A not-comparable build inside a gap** (the Thing) is drawn in its not-comparable style, centred at its x and clamped inside the tile, with its normal plate under it.

## D. Forest plot: every build, to scale

**Rows are HTML.** The track is a positioned div. Marks use left% and width%, computed from x() / W × 100, so no resize maths is needed.

**Rows, in score order:**
- the 49 builds;
- 6 anchor rows (from settings.anchors);
- 3 limit rows;
- 3 gap rows;
- 1 meatball row (always last).

Each row is sorted by its working score, or by its headline value.

**Desktop row** (grid 250px | 1fr | 120px, column gap 12, min-height 24):
- **Name cell:** a 9×9 group swatch (radius 2, 1 px ink border), then the short name at 13/1.25, 500. The name is a button that opens that build's drawer, scrolling to its stop.
- **Track:** 24 px tall.
  - The range bar sits at top 8, 8 px tall, radius 4, in the group fill.
  - The working value is a 2 × 14 px --ink tick at top 5, with a 1 px --sheet ring.
- **Value cell:** mono 13 tabular, right-aligned, "37–40", plus a DERIVED chip only when body fat was measured.

**Phone row:**
- Grid 1fr auto; areas "name value" / "track track"; min-height 32.
- Track 12 px tall; bar 6 px tall, radius 3; tick 2 × 10.

**Status:**
- The section states once: every range is an estimate unless it carries DERIVED.
- Anchor and limit rows show their own chip at every width.

**Not comparable** (the Thing; Colossus, armoured):
- The bar is hollow: a 1.5 px outline in the group colour, no fill.
- An --alarm left-pointing arrowhead (8 × 8) sits just left of the bar's low end.
- After the name, in --alarm 12 px: "rock, not muscle" or "steel, not muscle".

**May be overstated** (Thor): a filled bar plus the same arrowhead at 60% opacity, and "may be overstated" after the name. Only shown if a sourced fact exists; see open questions.

**Anchor rows:**
- The name is italic, --ink-2, with a 9 px ink ring instead of a swatch.
- Mark: a single value is an 8 px ink ring at x; a range is a 1.5 px ink-outline pill, 8 px tall.
- The value cell shows "25", "28", "26–29" and so on, plus its status chip.
- Rows:
  - Kouri 1995: highest of 74 drug-free men (25, MEASURED);
  - College athletes, top 2.5% (28, MEASURED);
  - Pre-steroid Mr America winners, photo estimates (26–29, ESTIMATE);
  - Casey Butt's frame formula, not peer-reviewed (24–27, REPORTED);
  - Long-term steroid users, middle half (24–28, MEASURED);
  - Largest fat-free mass in a study: a sumo wrestler (34, MEASURED).

**Limit rows:**
- The name is in --chalk, 500: "Limit: arms can no longer hang down", "Limit: thighs touch to the knee", "Limit: hands can't reach the face".
- Mark: a pill with --chalk-bg fill and a 1.5 px --chalk border from the band's low to high end, plus a 2 px --chalk tick at the headline value.
- Values and chips: "42 (37–43)", "49 (42–53)" and "220 (86–230)", each ESTIMATE.

**Gap rows:**
- Min-height 28.
- Name: mono 12, uppercase, --ink-2, "NOTHING COMPARABLE · 42 TO 59", "EMPTY · 88 TO 130", "EMPTY · 220 TO 924".
- Track: a #hatch-void segment from x(from) to x(to), with a 1 px --void border.

**Meatball row:**
- A 10 px --chalk ring at x(924).
- Name "The meatball: end of the scale"; value "924" plus DERIVED.

**Background layers** (absolutely positioned across the rows container, behind the rows):
- gap columns in #hatch-void at 50% opacity;
- limit bands in --chalk-band;
- 1 px --rule-2 gridlines at the labelled ticks;
- Kouri at 25: 1 px --ink-3 solid;
- real men end at realEnd: 1.5 px --alarm solid;
- 924: 1.5 px --chalk solid.

No dashed lines anywhere.

**Sticky axis header:**
- position: sticky; top 0; --paper background; same grid columns as the rows. It shows "BUILD" in the name column and "SCORE RANGE" in the value column, both mono 11.
- Track column, 44 px:
  - A 16 px label line: "KOURI 25" in --ink-2, centred on its line. Then "no real man past here →" in --alarm, left-anchored 4 px right of the realEnd line. If that would run off the right edge, it is right-anchored 4 px left of the line with the text "← real men end here".
  - Then a 26 px yellow tape: major ticks 10 px and minor 5 px from the top, and labels in mono 11 500 at baseline 22.
- Checked at 358 px: Kouri sits at x 59 and the alarm label spans 104–256, so they don't collide.

**Close-up mode:**
- Rows whose low end is above 45 show "off this scale: {range} →" in mono 11, --ink-3, right-aligned in the track.
- Bars that cross 45 are clipped, with a 6 px "→" chevron at the right edge.

**Legend row** above the plot (mono 12, wraps):
- bar = range across plausible body fat;
- tick = at the working body fat;
- hollow bar with ◄ = not comparable, the true score is lower;
- chalk band = a limit of the drawn body;
- hatched = nothing comparable;
- red line = no real man past here.

**Interaction:** a row highlights in --rule-2 on hover or focus. There are no tooltips: every value is printed. Each row's accessible text reads "{name}, score {lo} to {hi}, {status}".

## E. Acceptance checks for test/shots.js and test/test.js

At 390 and 1280, in light and dark, and in each mode (Real heights, Side, Close-up):

1. No horizontal scroll.
2. No NaN, undefined or Infinity in text, and no console errors.
3. Font census: no visible text element under 11 CSS px.
4. The meatball circle's bounding box sits inside its cell.
5. The glance and forest 924 marks sit within 1 px of x(924).
6. Each mode changes the layout. Page height or markup must differ, so a dead control fails.
7. Page text never contains "≈", "No body can", "Nothing can score higher", "impossible" or "the ceiling".
8. Stop and gap edges, and the comparison sentences, come from the model. A test recomputes them and compares them with the rendered text.
9. Headline claims hold:
   - every member of the 59–88 stop is a comic character;
   - "every real man" is inside the first cluster;
   - the duo-to-top-comic ratio is between 1.75 and 2.4 for "roughly twice".

### Figure spec

## Fills
Each build's fill is its group's colour:

| Group | Token |
|---|---|
| Everyday men | --g-every |
| Natural athletes | --g-natural |
| Bodybuilders | --g-bb |
| Strongmen and lifters | --g-strong |
| Comic characters | --g-comic |
| Rex and Ollie | --g-duo |

Geometry (the meatball and the limit templates) uses --g-geom and is never a group colour. There is no interior detail: no seams, no muscle lines. Hands and feet are simple mitts and heads are average, following the turnarounds' clean contours.

## Edge marking (per part, so it can change along one figure)
**Drawing order:** each part's outline is stroked first in --ink, width --edge-w (3.8 px), with vector-effect: non-scaling-stroke and round line joins. Then all fills are drawn on top. Only the outer 1.9 px of the stroke shows, and the seams inside the body vanish.

**Marks:**

| Mark | Meaning | Stroke |
|---|---|---|
| Solid | This build's own number: the girth's status is measured, official or reported | butt caps |
| Dotted | Filled in: the girth is derived, either from a template build scaled to this build's weight or calculated from its other numbers. It matches the house DERIVED chip, which is dotted too. | dasharray var(--dot) = 0.1 6.4, round caps (3.8 px dots, 2.6 px clear gaps) |
| Dash-dot | Traced from art (Rex and Ollie, the whole outline) | dasharray var(--dashdot) = 8 6.4 0.1 6.4, round caps |
| No edge | Average head, hands and feet on human figures | none |

**Rule**, from figure.js bandEdges and the arm segments: mark = 'own' if the status is in {measured, official, reported}; 'derived' if the status is derived or the part is template-filled; 'none' for the head, hands and feet; 'art' for the duo.

**What this means per build:**
- Coleman: solid chest, waist, flexed arm and calf; dotted thigh (derived), forearm and neck (template).
- The ANSUR percentile builds: solid all over.
- Comic characters: dotted all over, because no publisher gives a girth.

This replaces the current dashed template edge. No drawing anywhere uses a dashed line, because dashed means "reported" on the chips.

## Tails (drawn, not counted)
- The tail region is filled with #hatch-g-duo (the group colour in lines over the wall colour), drawn after the body.
- It gets a 1 px solid outline in the group colour and no ink edge.
- Front view: Rex's tail shows as a hatched bulb between his legs. Ollie's is hidden, and his plate says "tail not counted".
- Side view: both tails show in full, hatched. Their cells widen to fit.

## Not comparable (the Thing; Colossus, armoured)
- The body is filled with #hatch-void (grey hatch), so it reads as struck out.
- Edges are marked per part as usual (dotted for comics).
- The plate carries the NOT COMPARABLE chip and its flag line.

## May be overstated (Thor)
- Normal fill.
- The plate carries a MAY BE OVERSTATED chip and a flag. Only if a sourced fact backs it; see open questions.

## Wolverine
- Normal fill, scored at Marvel's official 195 lb "without adamantium" (settings).
- Flag: "Weight without his adamantium skeleton (Marvel)".

## The wall and floor in every cell
- **Wall:** --wall.
- **Skull-top datum:** a 1 px --chalk line at 60% opacity, at y = headroom. The first cell of each stop labels it in HTML: "top of skull", mono 11, --chalk.
- **Landmark lines:** 1 px --wall-line at the ANSUR II median fractions of stature from outline.json: acromial 0.820, chest 0.735, waist (omphalion) 0.601, crotch 0.482, knee (mid-patella) 0.278.
- **Floor:** --floor, with a 1 px --floor-edge line.

## Same height (the default)
- Every figure is scaled so the skull top to the floor is H: 150 px desktop, 92 phone, 240 or 200 in the drawer.
- Rex, Ollie and the meatball use the same H. Nothing is enlarged.
- Headroom is 0.09H for every cell. Rex's crest (+4.4%) and Ollie's horns (+5.3%) rise above the skull line into it.
- Skull-top rows for the duo come from the turnaround traces, normalised to their duo.jpg skull heights: Rex 2.92 m, Ollie 2.91 m (measured from art, estimate).

## Real heights (the option)
- One px-per-metre for the whole lineup: H / 2.92, so Rex and Ollie's skulls sit on the same line as in same-height mode. Humans shrink to about 0.6H.
- The skull line is replaced by 1 px --wall-line rules at 1, 2 and 3 m, labelled in HTML (mono 11) in each stop's first cell.
- The meatball is drawn 1.80 m tall, the reference height.
- Plates do not change.

## Front and side
- **Front** is the default.
- **Side:**
  - Humans use figure.js side profiles from ANSUR II depth-to-width ratios.
  - Rex and Ollie use their traced side views, tails hatched.
  - Cell widths follow each figure's bounding box.

## Geometry figures
- **Meatball:**
  - A circle with diameter H, sitting on the floor, centred in its own cell. The cell's width is at least H + 24 px, so nothing clips it.
  - --g-geom fill, a 1.5 px --chalk outline, and a 10 px --chalk centre cross.
  - Beside it, in a 120 px cell: the median soldier's outline as a ghost, with no fill and a 1.5 px --chalk stroke, for scale.
- **Limit templates** (limits section):
  - --g-geom fill with no ink edge.
  - The part that decides each limit gets a 2.5 px solid --chalk outline: upper arm and forearm for arms out; both thighs for thighs touch; upper arm and forearm for hands to face.
  - Optional, if time allows: a small inset of the arm bent as far as it goes, for hands to face.

## Key swatches
56 × 18 px rectangles filled with --g-geom, each with one edge pattern. Fill colour carries no meaning in the key. This fixes the reader mock, where the coloured swatches looked as if the fill was the code.

## Drawer figure
- The same rules, at H = 240 (desktop) or 200 (phone).
- Under it, a caption in words built from the part marks. For example: "Solid edge: chest, waist, flexed arm and calf, from his reported numbers. Dotted: thigh, calculated from his other numbers; forearm and neck, filled in from Mr America winners 1938–54, scaled to his weight. No edge: average head, hands and feet."
- The words are what a phone reader relies on.

## Weight
Simplify the duo traces with Ramer-Douglas-Peucker at 1.0 px at 2,000 px scale. Target a dist/index.html under 700 KB; it is 842 KB now.

### Controls

Few controls, and each one visibly changes something. The current "Groups shown" filter chips are removed: all 49 builds always show, so nothing reads as cherry-picked.

## 1. FIGURES: [Same height | Real heights]
- Segmented buttons with aria-pressed.
- Applies to every lineup, the gap tiles and the meatball.
- Real heights adds the note line described in the copy.

## 2. VIEW: [Front | Side]
- Segmented, aria-pressed.
- Applies to the lineup and the drawer figure.
- Side adds its note line.

## 3. SCALE: [Whole scale | Close-up, 12 to 45]
- Segmented, aria-pressed, in the forest-plot section only. It re-maps the forest's track and axis.
- The glance tape and the locator always show the whole scale.

## Figure selection
- Each lineup cell is a `<button>` with aria-label "{name}, score {lo} to {hi}, {status}. Open details".
- Click, tap, Enter or Space opens that build's drawer at the end of its stop.
- When it opens:
  - the plate gets a 3 px --chalk top bar;
  - the drawer scrolls into view (block: nearest; smooth unless reduced motion);
  - focus moves to the drawer heading.
- The drawer's "Close" button (min 44 × 32) returns focus to the cell. Esc also closes it.
- Opening another figure moves the drawer.
- A forest-plot row name opens the same drawer.

## Jumping
- **Jump row** (masthead) links to stop anchors: #rex-and-ollie, #empty (the first gap), #limits, #to-scale, #measure.
- **Glance-tape cluster labels** are buttons that scroll to their stop.
- **Locator:** tap the tape to jump.
- These are bare #anchors, with no other URL state.

## Hover
Cells and forest rows highlight on hover and focus. Nothing exists only on hover; every value is printed.

## Remembered choices
- FIGURES, VIEW and SCALE are remembered per viewer in localStorage under key "bc.prefs".
- Every read and write is wrapped in try/catch, so the page renders the defaults if storage is missing or blocked.

## Defaults
- Same height, Front, Whole scale.
- Key `<details>` open on desktop (≥720 px) and closed on phone, set once at load.
- There is no theme toggle: the page follows prefers-color-scheme and [data-theme].

## Tool controls
See tool_ui.

### Tool ui

Section "MEASURE A CHARACTER": a --sheet card, two columns on desktop (5fr | 7fr), stacked on a phone. The rule from BRIEF.md holds: the turnarounds are never loaded or measured here in Step 1.

## Left column
### 1. Example
A select labelled "EXAMPLE":
- "Soldier sheet, drawn on this page (average soldier at 1.80 m)". This is the default, the current synthetic sheet: front, side and back, so every check runs.
- "Choose a sheet…", a file input styled as a button. The chosen file name shows beside it, and drag and drop also works.

### 2. Sheet viewer
- An SVG of the sheet at the column's width, with no inner horizontal scroll. Labels live in an HTML gutter on the left (64 px desktop, 52 px phone; mono 11, --chalk) and are never drawn as SVG text. This fixes labels that rendered at 4–8 px.
- Overlay:
  - one ground line, 1.5 px --ink;
  - a "top of skull" line, 1.5 px --chalk;
  - guide lines in 1 px --chalk at shoulder, chest, waist, crotch and knee, found on the front view and carried across all views. The copy must say how they were found: "found on the front view's outline".
  - the chest width and depth slices, as 2 px --alarm marks on the front and side views;
  - an outline around any left-out region (a tail), 1.5 px --alarm with a hatch.
- Captions under each view, mono 11: "FRONT · 702 px", "SIDE · 702 px", "BACK · 702 px".

### 3. Checks
A list. Each item has a chip (PASS / NOTE / CHECK / FAIL), then a bold claim and the numbers:
- "Views agree in height. Front 702, side 702, back 702 px: 0.0% apart (limit 2%)." A FAIL here rejects the sheet.
- "One shared ground line, within 1% of the height."
- "Front and back landmarks line up within 2% of the height: neck, armpits, waist, crotch, knees."
- "Side-view neck lines up with the front within 3%."
- NOTE: "The figure is 702 px tall; the sheet spec asks for at least 2,000 px. Edges count for more at low resolution."
- NOTE: "Side view: the depth at each row is the widest run. If the near arm overlaps the torso, chest and waist depth read high. The spec asks for a side view without the near arm."
- With no side view, a NOTE: "No side view: depths come from ANSUR II depth-to-width ratios (soldiers, not dinosaurs)."

## Right column
### 4. Tool test
Shown first, as a PASS line run at load:

"Tool test: run now on duo.jpg (Rex, front view only, the old depth ratios), it measures {2.54} m³. The three earlier methods gave 2.52 to 2.60 m³ (reconciled 2.55)."

A "Show the test picture" toggle reveals duo.jpg with Rex's slices drawn over it, if measure.js exposes them. Optional.

### 5. Inputs
Three fields: a grid on desktop, two a row on a phone. 16 px input text, labels in mono 11 uppercase, hints in 12 px --ink-2.

| Label | Default | Hint |
|---|---|---|
| "HEIGHT TO TOP OF SKULL (M)" | 1.80 | "Not the crest or horn tips." |
| "DENSITY (KG/M³)" | 1060 | "Lean body: about 1,060. Rex and Ollie: 1,060." |
| "BODY FAT FOR THE SCORE (%)" | 7.5 | "Used only for the score." |

Advanced fields stay in a `<details>` element labelled "Sheet layout": views left to right, skull-top rows, arm depth/width.

### 6. Buttons
- "Measure" (primary: ink background, sheet text).
- "Copy results" (secondary).

### 7. Status line
Above the table:

"Every result is measured from art: an estimate [ESTIMATE]. Slices are treated as ellipses, so girths can be off by 5 to 10% and volume by a few percent."

### 8. Results table
- Columns: Result | Value | Likely range.
- Group header rows (mono 11 uppercase):
  - **SIZE:** Volume, Mass, Frontal area. Volume, mass and score are bold.
  - **SCORE:** Score, Plain FFMI.
  - **GIRTHS · EACH ±5–10%:** Chest, Waist, Flexed upper arm, Forearm, Thigh, Calf, Neck.
  - **LENGTHS:** head, neck to crotch, crotch height, thigh, shank, ankle height, armpit to elbow, elbow to wrist, wrist to fingertip, arm angle.
- Values are tabular mono 13. On a phone it is one quantity per row in 3 columns, never wider than the screen.

### 9. Copy results
- Calls navigator.clipboard.writeText inside the click handler. The text is a ready-to-paste builds.json entry with status "derived" for girths and the note "measured from art, estimate".
- On success: "Copied: {n} lines, ready to paste as a build entry."
- On failure: show a read-only textarea with the text selected, and the line "Copy is blocked here. The text is selected below: press Ctrl+C, or long-press and choose Copy."

## Target outline (full width, below)
Heading "DRAW AN OUTLINE FOR ANY SCORE" and its verdict.

**Inputs** (260 px column on desktop):
- "TARGET SCORE": a number, default 100, allowed 15–900.
- "BASE SHAPE": a select of the six limit templates. Median soldier, the default; 5th-percentile soldier; 95th-percentile soldier; Steve Reeves; Ronnie Coleman; the soldier with the largest arm.
- "Draw" button.

**Result line:** "{shape} at 1.80 m with every width and depth × {f}: it measures {s} (target {t}) at 7.5% fat and 1,060 kg/m³."

**Images:**
- Front and side, black fill on white, drawn at the sheet spec with the five guide lines and the ground line.
- Each is rendered to a canvas, then shown as an `<img>` (toDataURL), so right-click or long-press can save it where the browser allows.
- Both images are the same height (320 px desktop, 220 px phone), side by side, object-fit: contain. This fixes the current mismatch, where the front image was small and the side image large.
- Captions: "Front · score {s}" and "Side · score {s}".

**Note:** "This page can't start a download. To keep an image, right-click or long-press it and save, if your browser allows. For full-size 2,000 px sheets, run tools/export_targets.js in the repository."

**"Copy target numbers"** copies the target score, base shape, factor and each girth. It has the same success and fallback behaviour as Copy results.

The validation stays a node test as well (test/duo.js), with the 2.52–2.60 m³ spread.

### Copy

Text in {braces} is computed. The values shown are today's data, for checking. [CHIP] marks a status chip.

## Masthead
- **Eyebrow:** MEN'S BUILDS · MUSCLE LEVEL WITH HEIGHT TAKEN OUT
- **H1:** BUILD COMPARISON
- **Lede:** "Drawn at one height, the median US Army man scores about {21}. The biggest bodybuilders on stage reach about {39}, and the heaviest comic characters about {84}. Rex and Ollie score about {160} and {180}. [ESTIMATE] The scale ends at 924, the score of a solid ball of muscle as tall as the figure. [DERIVED]"
- **Spec line:** "score = 1.8 × fat-free mass ÷ height³: the FFMI a body would have at 1.80 m, same shape · {49} men · every number says how sure it is"
- **"The score" box** (desktop): "**The score** is fat-free mass ÷ height³ × 1.8. That is the FFMI (fat-free mass ÷ height², in kg/m²) the same body would have if it were 1.80 m tall. Body fat is mostly unknown, so every score is a range."
- **Glance caption:** "THE WHOLE SCALE, TO SCALE" + "Each tick is one build. Hatched: nothing there. Equal steps are equal ratios: 20 to 40 is as far as 100 to 200. Tap a stretch to jump to it."
- **Cluster labels:** see chart_spec A.
- **Jump row:** "Jump to: Rex and Ollie · The empty stretches · Body limits · Every build to scale · Measure a character"

## Controls
- Labels: "FIGURES" [Same height | Real heights]; "VIEW" [Front | Side].
- Real heights note: "Real heights: one scale for every figure. Wall lines mark 1, 2 and 3 m. The meatball is drawn 1.80 m tall, the height the score uses. Edges are hard to read this small, so tap a figure for its full drawing."
- Side note: "Side view: human depths come from ANSUR II depth-to-width ratios (soldiers). Rex and Ollie are traced from their side views, and their tails show in full, hatched."

## Lineup intro
- **Verdict:** "Everyone is drawn at the same height, in score order. Only the build differs."
- **Sub:** "The figures are in order, not to scale. The tape pinned to the top of the screen is to scale. Neighbours whose ranges overlap can't be ranked against each other. Tap a figure for its numbers and sources."
- **Edge strip:** "EDGES [solid] its own number · [dotted] filled in · [dash-dot] traced from art · Full key"
- **Locator:** "TO SCALE · NOW: SCORE {32} TO {42}" (a gap reads "NOW: EMPTY {42} TO {59}"); desktop adds "Tap the tape to jump".

## Stops (tag / headline / verdict / here-line / note)
The here-line, for every build stop, in mono: "HERE: {13} BUILDS · {5} EVERYDAY · {2} NATURAL · {2} BODYBUILDERS · {4} COMIC". Counts are in fixed group order, and zero counts are left out.

### 1. Under 25
- Tag: SCORE UNDER 25
- Headline: WHERE MOST MEN SIT
- Verdict: "Soldiers and US men score {21} to {22} here. [ESTIMATE] Every drug-free man in Kouri's study scored under 25. [MEASURED]"
- Note: "Bruce Banner, the Hulk at rest, is the slimmest build on the chart. The 5th, 50th and 95th percentile soldiers are statistics, not real people."

### 2. 25 to 32
- Tag: SCORE 25 TO 32
- Headline: PAST KOURI'S 25
- Verdict: "No drug-free man in Kouri's study reached this far. [MEASURED] A few measured athletes do: the top 2.5% of college footballers start at 28, and the top one reached 32. [MEASURED]"
- Note: "Those studies did no drug tests of their own, and many of those athletes carry 15 to 20% fat."

### 3. 32 to 42
- Tag: SCORE 32 TO {42}
- Headline: THE TOP OF THE HUMAN RECORD
- Verdict: "The biggest bodybuilders on stage and the strongest strongmen top out here, at about {39}. [ESTIMATE] No real man on this chart scores above {42}. [ESTIMATE]"
- Note: "Pro weights are contest-day figures from magazines, and their body fat is assumed. Strongmen carry more fat, so their bars are wider. The largest fat-free mass measured in any study, a sumo wrestler's, scores 34. [MEASURED]"

### 4. Gap
- Tag: SCORE {42} TO {59} [BEYOND HUMAN DATA]
- Headline: NOTHING COMPARABLE. Use "EMPTY" when no not-comparable build sits inside the gap.
- Verdict: "Nothing comparable scores {42} to {59}. [ESTIMATE] From here on every score is an extrapolation: no real man on this chart scores above {42}."
- Note: "The Thing would land at {59}, but most of his weight is rock, so he doesn't count. Two limits of the drawn body fall in this stretch: the arms can no longer hang down (about {42}), and the thighs touch all the way to the knee (about {49}). [ESTIMATE] On this scale the stretch is as wide as the step from the median soldier ({21}) to the soldier with the largest arm ({29}). Step 2 fills it with figures drawn to order, each labelled "measured from art"."
- How the comparison is chosen: the gap ratio is to/from. Pick the real man whose working score is closest to the median soldier's score × that ratio, and use him only if he is within 4%. Otherwise drop the sentence.

### 5. 59 to 88
- Tag: SCORE {59} TO {88} [BEYOND HUMAN DATA]
- Headline: COMIC GIANTS. Only if every member is a comic character; otherwise use "SCORE {lo} TO {hi}".
- Verdict: "The heaviest comic characters score {62} to {84}, if their published weights are flesh and bone. [ESTIMATE] For some they are not."
- Note: "Comic heights and weights are official. Their shapes are not: no publisher gives a girth, so every outline is filled in from a template build, and every edge is dotted. Their body fat is assumed, 8 to 20%."

### 6. Gap
- Tag: SCORE {88} TO {130} [BEYOND HUMAN DATA]
- Headline: EMPTY
- Verdict: "Nothing scores {88} to {130}. [ESTIMATE]"
- Note: "On this scale that is as wide as the step from the median soldier ({21}) to Sergio Oliva ({31}). Step 2 fills it with figures drawn to order, each labelled "measured from art"."

### 7. Rex and Ollie
- Tag: SCORE {130} TO {220} [BEYOND HUMAN DATA]
- Headline: REX AND OLLIE
- Verdict: "Rex scores about {160} and Ollie about {180}, roughly twice the top comic giants. [ESTIMATE]"
- Note: "Both are scored at 7.5% body fat (5 to 10%). Height is to the top of the skull, read off duo.jpg: Rex {2.92} m, Ollie {2.91} m. [ESTIMATE] Their crest and horns rise above the skull line, and their tails are left out. Their mass is the current canon, about 2,700 kg each, measured from one picture. Step 2 measures them again from their turnarounds. Their art shows arms held out and thighs touching: by the drawn body's own limits, they are past the first two."

### 8. Gap
- Tag: SCORE {220} TO 924 [BEYOND HUMAN DATA]
- Headline: EMPTY TO THE END
- Verdict: "Nothing scores between Ollie's top, {220}, and the end of the scale, 924. [ESTIMATE]"
- Note: "The third limit sits at the start of this stretch: the hands can no longer reach the face at about {220}, though its band runs from {86} to {230}. [ESTIMATE] 924 is more than {four} times Ollie's top score."

### 9. Meatball
- Tag: SCORE 924
- Headline: THE MEATBALL
- Verdict: "The scale ends at 924: a solid ball of muscle as tall as the figure. [DERIVED]"
- Note: "1.8 × 1,060 kg/m³ × π/6 × (1 − 0.075) = 924; 900 to 950 at 5 to 10% fat. It is a chosen end point, not a law of geometry: a cylinder of muscle as wide as it is tall would score about 1,400, and a cube about 1,800. Beside it, for size: the median soldier's outline."

### Gap tiles
- Centre: "NO BUILDS HERE"
- Posts: "ARMS OUT · {42}", "THIGHS TOUCH · {49}", "HANDS TO FACE · {220}"

## Plates
- Range in large type.
- Then "{39} at {6}% fat".
- Then the chip: ESTIMATE when body fat is assumed, DERIVED when it was measured.
- Then the swatch and name, then "FFMI {37–40}".
- Flags, in alarm text:
  - The Thing: [NOT COMPARABLE] "Rock, not muscle"
  - Colossus (armoured): [NOT COMPARABLE] "Steel skin, not muscle"
  - Thor: [MAY BE OVERSTATED] "Tissue said to be denser than ours". Only if sourced.
  - Kingpin: "Much of his weight may be fat (assumed 15–35%)"
  - Wolverine: "Weight without his adamantium skeleton (Marvel)"
  - Rex and Ollie: "Traced from art · tail not counted"
  - Every build whose working score is above {42}: [BEYOND HUMAN DATA]

## Drawer
Order: group eyebrow, then name (h3), then the description from builds.json, then these rows:

- **SCORE:** "{37–40} [ESTIMATE] · {39} at {6}% fat. The range covers body fat {4–8}% and weight {132–134} kg."
- **PLAIN FFMI:** "{37–40}", plus one of:
  - "The same as the score, because he is 1.80 m tall."
  - "Higher than the score, because he is {2.92} m tall. Plain FFMI grows with height at the same shape; the score takes that out."
  - "Lower than the score, because he is shorter than 1.80 m."
- **HEIGHT COUNTED**, with its chip and basis.
- **WEIGHT COUNTED**, with its chip and basis. Duo: "{2,390} kg: 2,700 kg less {307} kg of tail".
- **BODY FAT:** "{6}% ({4–8}%) [ESTIMATE] · assumed for this group: {class label}"
- **DRUG STATUS.**
- **GIRTHS:** a table of edge sample | girth | value | chip | where it came from (builds.json basis).
- **OUTLINE:** the caption in words.
- **WHAT THIS IGNORES:** two or three computed lines, each shown when it applies:
  - "Body fat is assumed for his group."
  - "Parts with a dotted edge are filled in."
  - "Not comparable: …"
  - "Beyond human data: no real man scores this high, so his shape and body fat are extrapolated."
- **SOURCES:** exact URLs as links. File-only cites read "project record: {file}".
- Close button: "Close"

## How to read a figure (key)
- **H2:** HOW TO READ A FIGURE
- **Verdict:** "Every figure is a flat shape. Its edge says where each part came from."
- **Edges:**
  - "Solid: this build's own number. A measured, official or reported girth sets that part's width."
  - "Dotted: filled in. There is no girth for this part, or it was calculated from other numbers, so it comes from a template build scaled to this build's weight. Same dots as the DERIVED chip."
  - "Dash-dot: traced from art. Rex and Ollie, from their turnarounds."
  - "No edge: average head, hands and feet."
  - "Hatched in the figure's colour: drawn, not counted (tails)."
  - "Grey hatch: not comparable. The weight is rock or steel, not muscle."
  - "Blue line across the wall: the top of the skull. Every figure is drawn to it; crests and horns rise above it. Thin lines: average shoulder, chest, waist, crotch and knee heights."
  - "Blue outline and grey fill: geometry, not a build (the meatball, the limit templates)."
- **Plate:**
  - "Big number: the score range across plausible body fat. Under it: the score at the working body fat."
  - "Chip: how sure the score is. ESTIMATE: body fat assumed. DERIVED: body fat measured."
  - "FFMI: plain FFMI, fat-free mass ÷ height² (kg/m²), for comparison with the familiar scale. Same status as the score."
  - "Red text: not comparable, may be overstated, or beyond human data."
- **Groups:** Everyday men · Natural athletes · Bodybuilders · Strongmen and lifters · Comic characters · Rex and Ollie · Geometry (not a build).
- **Status chips:** the five builds.json status_vocabulary definitions, verbatim.

## Every build, to scale
- **H2:** EVERY BUILD, TO SCALE
- **Verdict:** "Each bar spans a build's score across plausible body fat. Bars that overlap can't be ranked against each other."
- **Sub:** "A log scale: equal steps are equal ratios, so 20 to 40 is the same distance as 100 to 200. Every range is an estimate (body fat assumed) unless it carries a DERIVED chip (body fat measured). Rows in italics are reference points, not builds."
- **Control:** "SCALE" [Whole scale | Close-up, 12 to 45]
- **Legend, header labels, gap/anchor/limit/meatball row text:** see chart_spec D.

## Where the body stops working
- **Verdict and method:** from limits.json.
- **Start card:** "{27}" + "The median soldier's own shape, scored lean (7.5% fat). His real score, at his own body fat, is {21}." [ESTIMATE]
- **Limit cards:** "{42}" + "{37–43} across six templates" [ESTIMATE] + label + definition (limits.json).
- **Notes:** limits.json notes, plus: "Widening every width and depth by one factor is the simplest rule, not a measured way muscle grows. It widens the waist as fast as the chest, so these figures look fat rather than muscular. A rule fitted to real bodybuilders' girths would move the limits."

## The score, and the natural limit
- **H2:** THE SCORE, AND THE NATURAL LIMIT
- **Verdict:** "The score asks how much fat-free mass a body would carry if it were 1.80 m tall, at the same shape. No hard natural limit is known."
- Keep the current body text and worked table, including "Each 1% of height moves the score by about 3%."
- **Meatball paragraph:** "The meatball (924). A solid ball of muscle as tall as the figure, at 1,060 kg/m³ and 7.5% fat (900 to 950 at 5 to 10%). It ends the scale; it is not a hard maximum. A body wider than it is tall could hold more: a cylinder as wide as it is tall would score about 1,400, a cube about 1,800."
- **Right card:** "WHERE THE NATURAL LIMIT MIGHT BE" / "No study shows a hard limit. These are the best anchors, on this page's scale (at 1.80 m they equal normalised FFMI)." Then the anchors from settings, kind as plain text plus a status chip.

## Measure a character
- **H2:** MEASURE A CHARACTER
- **Verdict:** "Load an A-pose model sheet, type the height and density, and get the volume, mass, girths and score."
- **Sub:** "The sheet needs front, side and back views at one scale. Nothing leaves this page: copy the results, or save the outline images by hand. The turnarounds are not measured here; Step 2 does that once they are redrawn to the sheet spec."
- **Target heading:** DRAW AN OUTLINE FOR ANY SCORE / "Pick a score and a base shape. You get front and side outlines at the model-sheet spec, to use as control images."
- Other tool strings: see tool_ui.

## Closing sections
- **What this ignores:** "The score is a mass ratio. It says nothing about strength, health, or whether a body that size could stand." Then the settings.ignores bullets.
- **Sources:** "Every number above comes from one of these, with its status."
- **Colophon:** keep the current text, ending with "No photograph or comic art was traced."

### Grafted

## Base
The **reader** proposal (C): the page as a sequence of score-band stops. Each stop opens with a yellow score tag, a display headline and a one-line verdict, then shows its lineup. Both judges picked it as the strongest base.

## From the reader (C)
- One skull-top height for every figure, the duo and the meatball included.
- The tool opens on an honest example plus its own validation line, never on the turnarounds. The height field reads "to top of skull", with the hint "Not the crest or horn tips."
- Computed comparison sentences ("as wide as the step from the median soldier to Sergio Oliva").
- The meatball shown beside the median soldier for size.
- Wall lines at 1, 2 and 3 m in real-height mode.
- The notes "The 5th, 50th and 95th percentile soldiers are statistics, not real people" and "every girth is filled from a template, so every edge is dotted".
- The pinned to-scale tape with a current-stop window. Rebuilt as a horizontal sticky locator, so it no longer takes 46 px of width from phone figures and needs no 100svh.
- Umber print kept as the fallback style.

## From the instrument (A)
- The forest plot of all 49 builds on one log track, with "Bars that overlap can't be ranked against each other".
- The log gloss "equal steps are equal ratios: 20 to 40 is the same distance as 100 to 200", now shown on the page.
- Gap rows in score order.
- The red "real men end" rule, plus a per-build BEYOND HUMAN DATA chip, reusing the Build Calculator's existing .chip.beyond.
- The left arrowhead on hollow bars for rock and steel.
- The edge vocabulary fix: dotted means filled in or derived, matching the DERIVED chip; dash-dot means traced from art; nothing on a figure is dashed.
- The "Close-up 12 to 45" zoom.
- The detail panel's girth-by-girth table with the edge each girth produced, plus "What this ignores".
- PASS/CHECK chips with numbers, a ± column and the bold top rows in the tool.
- The worked plain-FFMI-against-score table, and "Every 1% of height moves the score about 3%".

## From the lineup (B)
- The studio wall ruled at ANSUR landmarks, with floor plates. This is the chosen style, already built.
- The meatball disc with a drafting centre cross.
- The drawer at a large size, with the per-part marking said in words.
- "The scale ends at 924", with the cylinder and cube arithmetic.
- Limit templates with the deciding part outlined.
- Limit posts placed at their score, now chalk and inside the gap tiles.
- Hatched-floor gap tiles, now all the same size.

## From the current build and data
The model's computed ranges, gaps and limits (limits.json: 42, 49, 220, computed rather than placeholders), settings anchors and text, Wolverine's sourced 195 lb weight without adamantium, and the existing score, natural-limit and ignores copy.

## Judges' problems, and the fix for each
**Both judges:**
- False 924 claims: banned strings, plus "chosen end point" copy.
- Dead controls: a shots test that every mode changes the page.
- Specific limit positions: now computed values, with ESTIMATE chips and bands.
- Turnaround loaded in the tool, and crest height as the default: replaced by the soldier example and a skull-top field.
- Edge vocabulary clash: the new mapping.

**Judge 1:**
- Log scale unexplained: the gloss in the glance caption and the forest sub.
- Group-named stops holding other groups: band-true headlines, plus computed here-lines and tests.
- Duo drawn larger: fixed, one height.
- Meatball clipped: its own wide cell, plus a test.
- "the ceiling" wording: banned.
- Measured body fat shown with no spread: always ranges.
- Lede numbers without chips: chips added.
- Out-of-vocabulary ASSUMED, GEOMETRY, ART and EST/DER chips: removed.
- Packed lanes reading as group spans: replaced by per-build forest rows.

**Judge 2:**
- Small phone text: an 11 px floor, with all chart text in HTML.
- Lines through labels: halos and collision passes.
- 924 mark off its tick: a position test.
- Key 20 default: all 49 always.
- Decorative tape over a lineup not to scale: replaced by a glance tape with every build.
- 4.1 px tool labels: an HTML gutter.
- 9.5 px FFMI and 8.5 px abbreviated chips: 11 px and full words.
- Narrow gap tile on a phone: tiles are full width.
- Rex nine screens down: glance labels, the jump row and the locator.
- Key before the figures: a compact edge strip, with the full key after the lineup.
- 1.1 MB page: RDP simplification, target under 700 KB.

**Palette:** the all-pairs colour-blind failure, found while validating this spec, is fixed by re-stepping the duo and comic fills.

### Open questions

## For the owner

1. **Edge vocabulary.** The brief's example was solid / dashed / dotted. This spec uses:
   - solid: own number;
   - dotted: filled in or derived;
   - dash-dot: traced from art;
   - no edge: average head, hands and feet.

   The reason: the house chips already use dashed for "reported" and dotted for "derived". This needs the owner's sign-off.

2. **The brief's meatball sentence is false as geometry.** It says "a figure can't hold more volume than a ball as tall as itself". A cylinder as wide as it is tall holds 1.5 times as much (about 1,400), and a cube about 1.9 times (about 1,800). The page calls 924 a chosen end point. The owner should confirm the wording, or reword the brief.

3. **Palette change.** Rex and Ollie move from maroon #8E2440 to plum #8A2F6E (dark mode #B85C8C), and comic characters from #34489A to #3A55B0. Without this, the duo and the strongmen can't be told apart by readers with red-green colour blindness. The owner may prefer another fix, such as giving the strongmen a different hue.

4. **Thor's "denser tissue".** facts.json has no sourced fact for it. Either research one (Marvel's handbook text, with a URL), or drop Thor's MAY BE OVERSTATED flag. The flag stays off until a source exists.

5. **The Thing's placement.** He is drawn inside the 42–59 gap tile, as not comparable, at his score. The tile is then headed "NOTHING COMPARABLE" instead of "EMPTY". The alternative, moving him into the comic stop, breaks score order without saying so.

6. **Stop edges at 25 and 32.** These are sourced anchors: Kouri's sample top, and Trexler's top college footballer at 31.7. The other edges are computed from the data. The owner may prefer only computed edges, which would make one large stop covering 13–42.

7. **Rounding.** Scores from 100 up round to 2 significant figures (Rex "160", Ollie "180", gap "88 to 130"); 924 stays exact as a defined constant.

## Open risks

8. **Templates read as fat.** Every widened template (the limit figures, target outlines) looks fat rather than muscular, because the rule widens everything by one factor. The page now says so. A sourced widening rule, such as ANSUR girth against FFMI or bodybuilders' girth ratios, would move the limits. Step 2 or later.

9. **Unverified inside the published claude.ai frame.** These need checking after publishing:
   - sticky positioning (the locator, the forest axis);
   - long-press or right-click saving of the outline images;
   - clipboard writes.

   If image saving fails, the "Copy target numbers" route and tools/export_targets.js remain.

10. **Page length.** About 17,000–18,000 px on a phone. The jump row, glance labels and locator are the way around it. If review still finds it too long, the next step would be a closed-by-default forest plot on phones. Not recommended, because the overlap message would hide.

11. **Very small figures.** Edges in real-heights mode on a phone (humans about 55 px tall) are too small to read. The note tells readers to tap a figure.

12. **Coleman past the arms limit.** limits.json says Coleman's own drawn shape already rests its arms about 39° out, past the 30° arms limit. That could make a good line in the limits section ("Ronnie Coleman's own drawn shape is already past the first limit"). It is model output, so it needs checking before use. Not in the copy yet.

## Art assets
None are needed for this design.

## Proposals in brief

### Instrument: A scientific instrument. The chart is the page: one log ruler from 15 to 1,000, drawn like a slide rule. Every build is a range bar with its own silhouette hanging off that ruler. Uncertainty and status are always drawn, never left to footnotes: bars are ranges, hatching means "assumed", empty stretches are hatched voids, and the extrapolation boundary is a red rule.

The mockup is a single page in the Build Calculator's type system (Big Shoulders Display, Public Sans, IBM Plex Mono) and its status-chip vocabulary. The page is a stack of plates, the way an instrument is a stack of panels:
1. Masthead: one verdict sentence carrying the four anchor numbers (20 to 26, 38, 160 and 180, 924).
2. "The scale" plate, which is the hero. A widened template man (ANSUR II proportions, grey, dotted, labelled NOT A BUILD) stands at 24, 48, 96, 192 and 384, then the meatball circle at 924. The T/A/F functional-limit brackets sit between those figures and the ruler. The ivory slide-rule ruler carries dense log ticks. Its bottom edge is a conversion scale: the same reading as kg of fat-free mass for a 1.80 m man (S × 3.24). Below the ruler are six group lanes: every build is a thin range plus a tick at its working value. Hatched voids run through the lanes wherever no build's range reaches. Further marks: the Kouri 25 hairline, the frame-based prediction bracket, a red "measured humans end, extrapolation beyond" rule, and a shaded "past 924: impossible" end. The plate also holds the key (outline marking, bar anatomy, status chips).
3. "The ranking" plate: a forest plot of all 49 builds, lowest to highest. Each row has a silhouette (same height, skull-top datum line), name, the build's height, weight and fat range each boxed in its status border, a bar on the shared log track, the score range, plain FFMI and status chips. Gap rows such as "Nothing from 42 to 57 · Empty until Step 2" are inserted in sequence. The list closes with the meatball row, then Wolverine as "not scored". The axis is sticky. Controls: figure size, scale zoom, view, group filters. Clicking a name expands a detail panel (inputs with sources, each girth and which outline it produced, what the model ignores).
4. "How the score works": a formula block and a worked table (Army median, Coleman, Rex: plain FFMI against score).
5. "Measuring bench": the sample sheet (Rex's traced turnaround) with guide lines carried across the views, the tail painted out, and width/depth slice markers. Beside it: inputs, a checks list (PASS/CHECK/FAIL chips with numbers), a results table with ± columns, a Copy button and the duo.jpg validation line. Below: "Target outline" with front and side black-on-white outline images at the sheet spec.
6. "Known limits", in short bullet form.

Rex and Ollie are real traces from the turnarounds. My mock-grade tracer uses a saturation/dark/warm mask, hole fill, Moore boundary tracing and Ramer-Douglas-Peucker simplification. The tails are split off with hand-placed polygons, and the skull-top lines are eyeballed. Human figures are generated from outline.json fractions: skeletal joints stay fixed, and part widths scale by each part's girth÷height against ANSUR, or by mass when the girth is unknown. All numbers are mock, but built from builds.json heights, weights and girths with made-up body-fat ranges. Checks pass at 390 and 1280 in light and dark: no horizontal scroll, no NaN, undefined or Infinity, no console errors. That includes the option modes (zoom, real heights, side view).

Picked style: A. Studio plate. It is the only one of the three that keeps six groups distinguishable (validated) and keeps the voids readable as voids. It also stays recognisably a sibling of the Build Calculator. Its colours all come from the turnarounds: the backdrop is the plate, Rex's scales and the crest glint mark the duo, and the briefs and skin give the human groups. Things for review to note:
- The "measured" value boxes are solid black pills (the house convention), so they are the heaviest marks in a row.
- Everyday grey and the duo's umber deliberately fall outside the validator's chroma and lightness bands.

### Lineup: Police lineup / museum-specimen parade. The figures come first. Every build stands at the same drawn height against a studio wall, in score order, on a floor plate that carries its score. Empty stretches of the scale are tiles of bare, hatched floor. The last stretch of empty floor runs out to the meatball at the far end. A to-scale log tape (the Build Calculator's yellow tape, made logarithmic) sits under the lineup and places all 49 builds.

The mockup is built and screenshotted at 390x844 and 1280x900 in light and dark. I checked full-page shots too, fixed what read badly, and re-shot. scrollWidth equals the viewport in all four, and there are no console errors.

Page order:
1. A full-bleed log tape band (15 to 1,000).
2. Masthead: a one-line verdict lede marked "all estimates".
3. Three segmented controls.
4. THE LINEUP, the hero. A wall ruled at ANSUR median landmark heights (skull top, shoulder 82%, chest 74%, waist 60%, crotch 48%, knee 28%). There is a landmark post at the start, and figures follow in rank order. Each floor plate shows: score range in Big Shoulders, an EST/DER/ART status chip, a group swatch and name, plain FFMI, and a red overstated flag where it applies. Kouri 25 is a dashed vertical post placed between figures. Gap tiles have log-proportional base widths. The final gap grows so the meatball stands alone at the row's end.
5. A detail drawer for the selected figure. The mock shows Ronnie Coleman with marking that varies by body region.
6. HOW TO READ A FIGURE: the key.
7. TO SCALE: group lanes with body-fat range bars on the log tape. Empty bands are hatched. A dashed bracket over 40–200 marks where the body limits fall, with no positions yet. Kouri sits at 25 and the meatball end post at 924.
8. WHERE THE BODY STOPS WORKING: four template figures, with the deciding part outlined in blue and positions marked as mock.
9. Score and natural-limit cards.
10. MEASURE A CHARACTER: the tool, with the sample sheet, guide-line overlay, checks, results with likely error, a copy button, and target-outline canvases.

How the figures are drawn:
- Humans come from a parametric A-pose template built on the ANSUR II fractions in build-comparison/data/outline.json. Girth factors change widths, and the arm angle is the smallest that clears the torso, the same geometry the first limit needs.
- Rex and Ollie are real traces of their turnaround front views. The method is a saturation-or-dark mask, the largest component, hole fill, a Gaussian smooth, Moore boundary tracing and RDP simplification, about 240 points each. They are normalised to an estimated skull-top line, so the crest and horns rise above it.
- Every number on the mock is a placeholder marked with purple MOCK chips. The lede copy was changed from "no body can pass 924" to "the scale ends at 924", because a body as wide as it is tall could score about 1.5x more.

Picked style: A. Studio lineup. A blue-grey studio wall from the turnarounds' background, with landmark guide lines like a police-lineup height chart. A light floor carries the score plates. Flat fills in the art's six colours, one per group. Ink edges carry the outline marking. The Build Calculator's fonts (Big Shoulders Display, Public Sans, IBM Plex Mono), status chips and yellow tape are kept, and the tape becomes the log scale. I suggest noting this choice for review.

### Reader: Phone-first reading for a general audience with ADHD. The page is one long tape you scroll down, from ordinary men to the meatball. A to-scale log tape (15 to 1,000) stays pinned beside the figures. Each stop opens with a tape-yellow score tag, a display headline and a one-line verdict, then shows its lineup of flat figures. The desktop layout comes from the same structure: the pinned tape widens into a to-scale overview.

Proposal: "the tape you scroll down". On a phone a 46 px sticky rail sits at the left. It is a yellow tailor's tape with log graduations from 15 to 1,000, drawn to scale. It marks every build as a coloured tick, shows the empty gaps hatched, draws Kouri's 25 as a dashed line, puts a chalk-blue dotted bracket over 40 to 200 (where the functional limits fall, position not yet worked out) and a chalk circle at 924. A box shows which stop you are reading, and tapping the tape jumps to a stop.

The stops scroll on the right, in this order:
- Ordinary men (up to 25)
- The natural limit (anchor rows)
- Trained hard (25 to 32)
- The biggest humans on record (32 to 41)
- EMPTY (41 to 57)
- Comic giants (57 to 88)
- Where the body stops working (geometry)
- EMPTY (88 to 152)
- Rex and Ollie (152 to 188, drawn larger)
- EMPTY to the top (188 to 924)
- The meatball (924)

After the stops comes the measuring tool, then collapsed Sources / What the score ignores / Review history.

Every lineup stands against the turnarounds' studio wall: a pale blue-grey band, a light floor strip and a dashed top-of-skull line. Every figure is scaled to that line. In the duo stop, the crest and horns rise above it.

The figures in the mock are real geometry, not placeholders. Humans come from build-comparison/src/figure.js human() using calc.js girths (own versus template). Rex and Ollie come from traced(). Only the scores are mock (geometric mid of guessed body-fat ranges), and every number on the page is marked as mock.

The desktop page uses the same parts:
- a two-column masthead
- a sticky control bar with a Go-to menu
- a 330 px sticky overview: the tape plus six group lanes with range bars, hatched EMPTY bands and stop labels with leader lines
- lineups six to a row
- the tool in two columns

A separate styles.html shows the three proposed chart styles on the same seven figures.

Picked style: A. Studio wall. Family continuity with the Build Calculator (tokens, fonts, tape, status chips), the art's own wall and floor behind every lineup, and one fill per group from the turnaround palette, while the edge marking alone carries provenance. Note the choice for review: C (Umber print) is the fallback if group colour is judged to compete with the marking.

## What the build changed from the spec

- **Rows of figures use equal columns** (CSS grid), not growing flex cells. With flex cells a part-filled last row drew its figures larger than full rows, which broke "same height".
- **Thor, the Thing and Luke Cage are "may be overstated"**, from the comics research that arrived after the spec: Marvel's official handbook says Asgardian flesh and bone is about three times as dense as ours; the Thing's official description is a rock-like hide (so the earlier "most of his weight is rock" was unsupported and was dropped); Luke Cage's tissue is "very dense". Overstated and not-comparable builds do not bound an empty stretch, so the first gap runs 42 to 62 and holds the Thing and Thor, drawn in a row under the gap tile instead of inside it.
- **Kingpin's body fat** is assumed like the other comic brutes (8 to 20%), not 15 to 35%: Marvel says his bulk is muscle, not fat.
- **Gap tiles** keep the spec's single size, mini-scale and limit posts; the "No builds here" label moves onto the floor when posts or markers leave no room on the wall.
- **Phone forest rows** keep the two-line layout; the axis header is sticky inside the plot.
- **Duo traces were not simplified** with Ramer-Douglas-Peucker: the outline's bumps are the art's muscle contours, and the page is under 800 KB after trimming the inlined Build Calculator data to what the page uses.

