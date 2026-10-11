# Build calculator data: notes

This folder holds the data for the build calculator.

- `builds.json` holds 55 builds, 139 facts and the log of every correction.
- This file lists the corrections, the judgement calls and the gaps.

Units are SI throughout. Girths are in metres. 1 in = 0.0254 m. 1 lb = 0.45359237 kg.

## How builds.json is laid out

- `meta`: inputs, file paths, the NHANES PDF hash.
- `status_vocabulary`: measured, official, reported, derived, estimate, unknown. Facts also keep the research status `disputed`; builds never use it as a status.
- `schema`: what each field means.
- `girth_sites`: the seven sites and the ANSUR II definition of each.
- `template_methods`: geometric, isometric, ansur_predictor.
- `conversions`: natural waist to navel waist; flexed vs relaxed arm.
- `groups`: Everyday, Natural athletes, Bodybuilders, Strongmen and lifters, Comic characters, Rex and Ollie.
- `builds`: one record per build.
- `facts`: every research fact, keyed by its key, with the verifier result and the changes applied.
- `corrections_applied`: the same change log as below, as data.

Each build has a reference height and weight. Each has a status, source keys, a plain basis, an exact `cite` list, and a range when sources disagree. Each girth has a status, a definition, and a flag that says whether the definition differs from ANSUR II. A missing girth is `{value_m: null, status: "unknown"}`. The `template` says which build fills it.

"Disputed" is a flag in the builds, not a status. The status says what kind of source it is. The `range` shows the dispute. The `value_basis` says why the reference value was picked.

## Corrections applied

There are 93 log entries. The last one was added by the Build Comparison work on 2026-10-11 (see below).

- 23 checks had ok=false. All 23 corrections are applied.
  - 20 are on facts. Each fact is edited.
  - 3 are on the model summary and have no fact. Each is applied as a note on the nearest fact.
- 12 are checks with ok=true that still gave corrected text. Those are applied too.
- 44 are checks with ok=true and only an issue note. The note is added, or the wording is fixed.
- 5 are consistency edits by the compiler. They carry a verifier correction to other facts that repeat the same claim.
- 8 are summary-level items from the verifier verdicts. The research summaries are not carried into builds.json, so these are recorded only.

Every ok=false check is covered. Every check with corrected text is covered. The script asserts that each replaced phrase exists, so no edit failed silently.

### Anthro (23 entries)

- `ansur2_measurement_definitions` (ok=true, corrected text given): Neck, thigh and calf protocol wording replaced with the corrected text; Table G-1 marked as allowable thresholds.
- `ansur2_dataset` (ok=true, issue note only): Added: the OPEN Lab page now redirects to /datasets/ansur2/ and says the sample 'is still not an approximation of the US Civilian population'.
- `ansur2_biceps_flexed` (ok=true, issue note only): Softened 'matches a bodybuilder's flexed-arm number' (pose and pump differ).
- `ansur2_thigh` (ok=true, issue note only): Added: tape perpendicular to the thigh axis; male SD 5.84 vs TR 5.85 is rounding.
- `ansur2_lower_thigh` (ok=true, corrected text given): Replaced 'Not cross-checked against a TR table' with 'Matches TR-15/007 table (60)'.
- `ansur2_calf` (ok=false, required): Notes replaced: the highest of three readings is kept (TR-15/007); research gap #8 deleted.
- `ansur2_neck` (ok=true, issue note only): Label fixed: the tape sits at the lower edge of the Adam's apple, not below it.
- `ansur2_wrist` (ok=true, corrected text given): Replaced 'Not cross-checked' with 'Matches TR-15/007 table (92)'.
- `ansur2_hip` (ok=true, corrected text given): Replaced 'Not cross-checked' with 'Matches TR-15/007 table (16)'; noted it is the buttock-level girth.
- `ansur2_selfreport_bias` (ok=true, corrected text given): Added the excluded record (Weightlbs=0) and the median biases.
- `ansur2_girth_scaling_male` (ok=false, required): Replaced 'how soldiers differ, which is mostly fat' with the Forbes/Hall 2007 estimate wording; values kept.
- `ansur2_girth_scaling_female` (ok=true, issue note only): Added the same no-body-composition caveat as the male entry.
- `ansur2_girth_predictor_male` (ok=false, required): Replaced 'whose extra weight is mostly fat' with the corrected wording.
- `ansur2_volume_model_male` (ok=false, required): Replaced 'Being physical, it scales sensibly to extreme builds' with the estimate-labelled caveat.
- `ansur2_volume_model_female` (ok=true, issue note only): Added: the extreme-build caveat of the male entry applies.
- `ansur2_segments_male` (ok=true, issue note only): Added: status covers measured values; derived lengths and ratios are flagged in notes.
- `ansur2_segments_female` (ok=true, issue note only): Added: same mixed-status note as the male entry.
- `ansur2_male_subgroups` (ok=false, required): Replaced 'That is the direction a muscular build shifts the girths' with the selection-rule caveat.
- `ansur2_female_subgroups` (ok=true, issue note only): Added the selection-circularity caveat for chest and waist k.
- `ansur2_female_largest_arms` (ok=false, required): Replaced 'not to muscular ones' with the corrected sentence (muscularity unknown).
- `(summary/gaps)` (summary-level, from the verifier verdict): Gap #8 (calf reduction unknown) deleted: TR-15/007 keeps the highest of three readings.
- `(summary/gaps)` (summary-level, from the verifier verdict): Gap #10 corrected: p5/p50/p95 match the TR tables within 0.03, but 1st/99th percentiles differ by up to 0.85 (e.g. F weight p99 97.45 vs TR 98.30 kg). Cite TR tables directly for 1st/99th.
- `(summary)` (summary-level, from the verifier verdict): Summary claim that girth exponents reflect 'mostly fat' differences re-worded to the Forbes/Hall estimate (see ansur2_girth_scaling_male).

### Muscle (28 entries)

- `kouri1995_ffmi_natural_limit` (ok=false, required): Label rewritten (sample maximum, not a hard limit); per-value statuses added (non-user limit measured, Mr America mean estimate); soft-line note added.
- `kouri1995_group_means` (ok=true, issue note only): Added: Helms says some users reached about 32; McDonald miscalls the winners Mr USA.
- `kouri1995_normalization_constant` (ok=true, issue note only): Added: gap is at most 0.05 FFMI units for 1.55-2.05 m; recommend 6.1 with a footnote.
- `withers1997_elite_bb_4C` (ok=true, corrected text given): Implied height set to 1.776-1.783 m and derived FFMI to about 27.8 (27.7-27.9).
- `sukwong2022_thai_elite_bodybuilders` (ok=false, required): Description corrected (national team incl. world and Asian champions); flexed-minus-relaxed arm gap +4.75 cm (~13%) recorded as a measured conversion.
- `chappell2019_natural_pro_bodybuilders` (ok=false, required): Label changed to 'all PROs polygraphed, top placers urine-tested'; note 'end-of-prep self-reported weight'.
- `ronnie_coleman_height_weight` (ok=true, corrected text given): Added 1999 contest weight 257 lb; 2003 recorded as 286-287 lb.
- `big_ramy_height_weight` (ok=false, required): height_orig now lists 5'9", 5'10" (FLEX 2015) and 5'11"; weight_heard_2015_lb replaced by weighin_2015_clothed_lb 316 (143.3 kg); 2015 stage 305-310 lb marked estimate.
- `hafthor_bjornsson_height_weight` (ok=true, corrected text given): Renamed boxing_weighin_19Mar2022_kg to boxing_weighin_18Mar2022_kg (fight 19 Mar 2022).
- `eddie_hall_height_weight` (ok=true, corrected text given): Boxing weigh-in set to 142.2 kg (313.5 lb), dated 18 Mar 2022.
- `derived_ffmi_pros` (ok=false, required): Bauer sensitivity corrected to 0.3-2.6 units; normalized values added; Coleman range 33.0-39.2; Ramy 40.7-43.1 (41.9 at 5'10"); Arnold 28.7-30.4.
- `arnold_schwarzenegger_height_weight` (ok=true, issue note only): Added his self-description 6'1.75" (1.873 m); book figures marked self-reported, second-hand.
- `arnold_schwarzenegger_girths` (ok=true, issue note only): Fact status changed from 'disputed' to 'reported'; only the waist kept as disputed.
- `jay_cutler_height_weight` (ok=true, issue note only): Added FitnessVolt competition 274 lb and the 2007 caption 267 lb.
- `phil_heath_height_weight` (ok=true, issue note only): Added: the 2010 report also says 'At 242'; the 2009 report says he was also 227 the year before.
- `phil_heath_girths` (ok=true, issue note only): Added UI requirement: show 'fan site, unverified, no date or method'.
- `brian_shaw_height_weight` (ok=true, issue note only): Added: the bodyweight and fat figures are reported (self-filmed test relayed by FitnessVolt), not lab-published; 6'6.75" is exactly 2.000 m.
- `brian_shaw_girths` (ok=true, issue note only): Fact status changed from 'disputed' to 'unknown'.
- `lasha_talakhadze_height_weight` (ok=true, issue note only): Added: weigh-ins are Olympedia's compilation of the official results; 492 kg total WR on 17 Dec 2021.
- `mr_america_1938_1954_program_girths` (ok=true, issue note only): Added the verifier caveat: these program heights and weights imply a mean normalized FFMI of 27.4 at 5% fat, against Kouri 25.4 for the same era.
- `demoraes2019_competition_day_girths` (ok=true, issue note only): Added: chest was taken 'expired'; arm is 'upper arm', flexed/relaxed not stated; height SD of 0.01 m is probably a typo.
- `balshaw2024_eddie_hall_mri` (ok=true, issue note only): Added: upper body was not scanned because of the size of his shoulders and arms; paper says 'twice World Deadlift Champion'.
- `sergio_oliva_girths` (ok=true, issue note only): Added: Rick Wayne's figures are a journalist's anecdote, not a recorded measurement.
- `steve_reeves_presteroid` (ok=true, issue note only): Added the normalized FFMI 26.4 (verifier recompute).
- `rossow2013_natural_pro_case` (ok=true, issue note only): Added: the Biolayne 1RMs were not re-checked by the verifier.
- `derived_ffmi_pros` (consistency edit by the compiler): Renamed value key 'Kouri_natural_ceiling' to 'Kouri_nonuser_max_normalized' (25.0 is a sample maximum, not a ceiling).
- `(summary)` (summary-level, from the verifier verdict): Kouri 25.0 described as a sample maximum and soft line, not a natural ceiling; Mr America mean 25.4 is an estimate.
- `(summary)` (summary-level, from the verifier verdict): Derived stage FFMIs in the summary superseded by derived_ffmi_pros (normalized values and ranges added).

### Comics (17 entries)

- `superman` (ok=false, required): 225 lb alternative re-sourced to the 1989 DC-licensed Mayfair sourcebook (status reported); DK 2019 guide added as a fourth source for 235 lb / 107 kg.
- `batman` (ok=true, issue note only): Marked the DK 2021 line as OCR-corrected (raw OCR: 'HEIGHT Gft 2in WEIGHT 210 los').
- `captain_america` (ok=false, required): Status set to disputed; height 6 ft 2 in (1.88 m; DK prints 1.87 m); weight 220 lb (DK Avengers guides 2010/2013) vs 240 lb (Marvel.com, DK 2019), range 220-240 lb; DK Avengers sources added.
- `thor` (ok=true, issue note only): Added caution: the same DK OCR gives 6 ft 6 in / 640 lbs for Ragnarok and Thunderstrike too.
- `hulk_savage` (ok=true, issue note only): Added: the 7 ft / 1,040 lb end is official (DK 2019); the 8 ft / 1,400 lb end is fan-wiki reported.
- `juggernaut` (ok=true, issue note only): Added: default to 6 ft 10 in / 900 lb because Marvel flags the 9 ft 5 in figure as unverified; the wiki infobox shows 9'5"/1,900 since 2025-10-31.
- `wolverine` (ok=true, issue note only): Added: DK's 195 lb most likely matches Marvel.com's 'without adamantium' figure.
- `kingpin` (ok=false, required): Quote fixed ('Most of Fisk's bulk is actually muscle, not fat'); derived FFMI restated: 44-49 only at <=10% fat or 9 lb fat; 34-39 at 20-30%; >25 below ~48% fat.
- `bane` (ok=false, required): Notes reworded: FFMI about 33 at 10% fat is above 30, a level the Kouri abstract reports only some users exceeding (no maximum given).
- `doomsday` (ok=true, issue note only): Added: the DK 2021 OCR literally reads 'HEIGHT /ft GIN', so 7 ft 6 in is an OCR interpretation, supported by DC Database's Prime Earth infobox.
- `darkseid` (ok=true, issue note only): Added the DK 2016 Batman Character Encyclopedia as a further source.
- `dc_com_no_stats` (ok=true, issue note only): Added: the Doomsday page's Character Facts list only Powers and First Appearance.
- `human_ref_kouri_ffmi` (ok=true, issue note only): Added: men-only sample, so not a valid ceiling for She-Hulk or other female builds; 25.0 is a sample maximum.
- `plausibility_metrics` (ok=false, required): Captain America verdict made fat-dependent (exceeds 25 only below ~17% fat at 240 lb; within range at 220 lb); She-Hulk FFMI marked as having no valid human reference; Kingpin and Bane wording fixed; Superman at the limit only at ~12.6% fat.
- `colossus_density_check` (ok=true, issue note only): Added: using osmium's density instead of steel would make the gap about 3x larger (not fetched).
- `human_ref_kouri_ffmi` (consistency edit by the compiler): Label changed from 'ceiling' to 'non-user maximum'.
- `(summary)` (summary-level, from the verifier verdict): Captain America 220 lb is licensed DK data (disputed 220-240), Superman 225 lb has a licensed 1989 source; Kingpin and Bane FFMI verdicts reworded.

### Model (24 entries)

- `brozek_equation` (ok=true, corrected text given): Added: a 0.9007/1.100 mix gives 497.1/D - 451.9; Brozek's equation comes from a reference body (endpoints imply 0.889 and 1.103 g/cm3).
- `whole_body_density_sample` (ok=false, required): Excluded cases 42, 48, 76, 96, 182 (n=247); range 0.995-1.0983 g/cm3, mean 1.0552, P2.5 1.0210, P97.5 1.0896.
- `density_from_fat_table` (ok=true, issue note only): Added: 0.900 vs 0.9007; tissue density only; the summary's +3% lean-build correction is an estimate (ANSUR fat % unknown), from check summary_density_reference_20pct.
- `ffmi_height_correction` (ok=true, corrected text given): Kouri implied exponent 2.45 (c=6.3) or 2.44 (c=6.1); Trexler-based p 2.2 labelled not significantly different from 2.
- `heymsfield_2011_circumferences` (ok=true, corrected text given): Replaced 'univariate height powers' with 'height powers adjusted for age and race (not for weight or BMI)'.
- `ansur_frustum_volume_model` (ok=false, required): Added calculator-inputs-only figures: SD 2.31% men (P95 4.6%), 2.78% women (P95 5.5%), k 1052.5 / 1052.8; 2.1/2.4% reported only as the full-input figure.
- `trunk_cross_section_shape` (ok=false, required): Wording fixed (true area 16-25% smaller; circle overstates by 19-34%); weight shift vs ANSUR baseline about 6% at 0.5 and 11% at 0.4.
- `yeadon_model_accuracy` (ok=false, required): Dropped 'Dempster' from Gittoes (attributed to Williams 2013); 2.1% relabelled 'Yeadon model with direct measurements, n = 5 (Gittoes 2009)'.
- `ansur_extrapolation_tests` (ok=true, issue note only): Added the corrected robustness wording from check summary_loglinear_robustness_claims.
- `ansur_geometric_law_test` (ok=true, issue note only): Added: 'accurate to about 1%' holds for height changes of about 10% or less; 1.8 to 2.2 m gives about 2.7% (waist) and 3.5% (neck).
- `ansur_mass_height_exponent` (ok=true, issue note only): Added: neither OLS nor RMA should be used as p for 'the same build at another height'.
- `ffmi_athletes` (ok=true, issue note only): Added: Trexler max 31.7 is height-adjusted; sample BF 19.8%, height 184.7 cm; Currier reference height not stated in the abstract.
- `ffmi_definition_kouri_limit` (ok=true, issue note only): Added: limit applies to normalized FFMI; non-use self-reported; some secondary pages reverse the 83/74 split.
- `ponderal_somatogram` (ok=true, issue note only): Added: the <1.5 kg agreement is for data-set means, not individuals.
- `action_toy_allometry_precedent` (ok=true, issue note only): Added: 'classical allometry' to 1.78 m is in effect a p = 3 copy (girths proportional to height).
- `muscle_tissue_density` (ok=true, issue note only): Added: fixed-muscle values are mean +/- SE (n=54).
- `ansur_girth_allometry` (consistency edit by the compiler): Replaced 'because between-person weight differences are mostly fat' with estimate wording.
- `absi_waist_allometry` (consistency edit by the compiler): Replaced 'because between-person weight differences are largely fat' with estimate wording.
- `ffmi_definition_kouri_limit` (consistency edit by the compiler): Label changed from "the 'natural limit' of 25" to 'the non-user maximum of 25'.
- `summary_brozek_derivation` (ok=false, required; this check is on the summary, so no fact exists): Summary finding (1) corrected: Siri's 495/D - 450 follows from 0.900/1.100; Brozek's 457/D - 414.2 is from a reference body (endpoints 0.889 and 1.103 g/cm3). Applied as a note on brozek_equation.
- `summary_loglinear_robustness_claims` (ok=false, required; this check is on the summary, so no fact exists): Design note C corrected: top 2.5% by BMI bias -1.1%; top 2.5% flexed arm +0.1%; the Penrose test used a separate 5-girth equation (bias +0.1%, SD 2.8%). Applied as a note on ansur_extrapolation_tests.
- `summary_density_reference_20pct` (ok=false, required; this check is on the summary, so no fact exists): The +3% lean-build density correction is labelled an estimate; ANSUR's fat % is unknown. Applied as a note on density_from_fat_table.
- `(summary)` (summary-level, from the verifier verdict): Whole-body density range in the summary ('0.995 to 1.109 g/cm3', '252 men') superseded by whole_body_density_sample (0.995-1.098, n=247).
- `(summary)` (summary-level, from the verifier verdict): Trunk-shape wording and frustum-error labelling in the summary superseded by the corrected facts trunk_cross_section_shape and ansur_frustum_volume_model.

## Judgement calls

### Facts

- Fact `values` were JSON strings in the research. They are parsed into objects here. Nothing else about them changed except the corrections.
- Corrections with ok=true were applied too, not only the required ok=false ones. They fix real errors or missing caveats.
- The "mostly fat" claim was corrected by the anthro verifier. The same claim appears in two model facts (`ansur_girth_allometry`, `absi_waist_allometry`). I reworded those too.
- Kouri's 25.0 is called a sample maximum, not a ceiling, in three more places: a value key in `derived_ffmi_pros` and the labels of `human_ref_kouri_ffmi` and `ffmi_definition_kouri_limit`. The key `kouri1995_ffmi_natural_limit` keeps its name.
- Normalized FFMIs added to `derived_ffmi_pros` use 6.1, as the verifier suggested. The abstract prints 6.3. The difference is at most 0.05 units.
- I added 5 facts. Each is marked `topic: "added"` and `verify.ok: null`:
  - `nhanes_2015_2018_adults`: numbers I read in the CDC PDF (Tables 3, 5, 9, 11, 14, 15, 19, 20, 22, 23).
  - `ansur1988_natural_vs_omphalion_waist`: proposed by the anthro verifier. I recomputed it from the verifier's CSVs and got the same result (men 0.975, women 0.920).
  - `rex_ollie_picture_mass` and `rex_ollie_picture_girths`.
  - `build_templates_rule`.

### Builds

- ANSUR II percentile builds use each measure's own percentile. No single soldier has all of them. Each is marked measured, because each is a percentile of measured values that matches TR-15/007.
- I added three more ANSUR II builds to the Everyday group: the lean-but-heavy men (n=39), the lean-but-heavy women (n=70), and the one man with the largest flexed arm. Each has all seven girths from measured data (subgroup medians, or one person), and they serve as templates.
- NHANES builds use medians. Means are listed under `other`. The NHANES waist is taken at the iliac crest, not the navel. It stays in the waist slot, flagged as a different definition. The NHANES arm is relaxed, so it goes in `extra_girths.arm_relaxed`, not in `arm_flexed`.
- Natural athletes:
  - Chappell 2019 natural PROs: tested federation, self-reported height and end-of-prep weight.
  - Kouri 1995 non-users: approximate means from secondary sources (about 1.8 m, 82 kg, 13% fat).
  - Mr. America winners 1938-1954 and Steve Reeves are placed here as pre-steroid-era, presumed drug-free, not tested. Each build has a `drug_status` field that says this.
- The Mr. America build is the mean of the 15 program rows. I did not add each winner as a build.
- Steve Reeves: the 1956 program row is the reference (it is dated: when he won). The fan-site set gives the other end of each range.
- Reference weights for the pros:
  - Coleman: 2004 Olympia, 296 lb (heaviest contest weight). Iron Man's 291 lb gives the low end.
  - Arnold: the book's 235 lb at 6'2", because his girth set comes from the same book.
  - Yates: 1993 Olympia, 116.57 kg (Guinness).
  - Cutler: 2009 Olympia, 271 lb.
  - Heath: 2011 Olympia, 248 lb.
  - Big Ramy: 2014 Olympia, 285 lb (a direct report; the 2015 stage figure is an inference).
  - Oliva: 1967 Olympia, about 225 lb.
  - Other dated weights are kept under `other`.
- Disputed heights use the midpoint when no source is clearly better (Yates, Cutler, Shaw). Big Ramy uses 5'10", the middle value and the FLEX 2015 figure. Arnold uses his book's 6'2". Talakhadze uses the official Tokyo 2020 profile (1.95 m).
- Disputed girths: the reference value comes from the better-documented source when one exists (book over fan site, dated program over undated site, two agreeing sites over one). Otherwise it is the midpoint. `value_basis` says which.
- Bodybuilder arm figures go in `arm_flexed`, but the definition says flexed or relaxed is not stated. Their waist, chest and thigh landmarks are also not stated.
- Strongmen: Shaw uses his Feb 2024 hydrostatic test (174.5 kg, 17.6%). Bjornsson uses his self-reported 200 kg (Jul 2025). Hall uses the lab measurement (1.90 m, 172.0 kg). Talakhadze uses the Tokyo 2020 weigh-in (177.00 kg).
- Not built (no height or no weight in the sources): Rossow 2013, Mitchell 2018, Malcolm Cooper, Graybeal 2020, Katch 1980. They stay as facts.
- Comics:
  - Each character in the research is a build. Colossus is split into two builds (human and armoured), because his two forms differ a lot. Bruce Banner is a separate build, as in the research.
  - Human forms with their own stats (Donald Blake, Jennifer Walters, Emil Blonsky) and Bane with Venom are `variants`, not builds.
  - Where official sources disagree, the default is the publisher's own site, except where the publisher flags its own page as unverified. So: Captain America 240 lb, She-Hulk 700 lb, Juggernaut 6'10" / 900 lb (Marvel flags its 9'5" page). Savage Hulk uses the official DK end (7 ft, 1,040 lb).
  - Doomsday uses the DK 2019 guide (8'10", 915 lb), because it is legible and prints metric. The 2021 height is an OCR reading. All three editions are listed. Height and weight ranges must not be mixed across editions.
  - Wolverine's reference weight is 300 lb with adamantium. His girths are scaled from the 195 lb body (`girth_basis_weight_kg`), because the metal sits inside the bones and adds no girth.
  - Superman's 225 lb is an alternative (licensed RPG, reported), not a range. The verifier kept 235 lb as the official value.
- Rex and Ollie:
  - Height 3.048 m and density 1,060 kg/m^3 are marked estimate, source picture measurement. Mass was 2,700 kg (2,300-3,000) from the picture; on 11 Oct 2026 it was set by ruling: Rex is 2,700 kg without his tail and Ollie weighs the same in all, so both are 3,007 kg, still marked estimate because Rex's tail share is. Volume follows at 1,060 kg/m^3 (2.84 m^3); the picture's own volume is kept as `volume_m3.picture_m3`. Body fat 7.5% (5-10%), the owners' canon.
  - Ollie measures 3.06 m to his horn tips at Rex's scale. The checker's own volume for Ollie is 2.531 m^3. Both are noted.
  - Sex is not stated, so it is null.
  - Their girths are derived (from picture). See "Rex and Ollie: how the girths were derived" below.

### Templates

- Rule: same sex; pick the shape class from the source; then pick the build with recorded girths whose W/H^3 is closest (log distance).
- Muscular class (heroes and bodybuilders): Reeves, Mr. America mean, de Moraes, Arnold, Oliva, Heath, Yates, Cutler, Coleman.
- Pros lack neck and forearm. Their template is the closest muscular build that has them, which is the Mr. America mean. A chain is allowed: if a template lacks a site, use its own template.
- Strongmen use the ANSUR II largest-arm man. No strongman girths exist. He is the heaviest full measured tape set, with a thick waist like a strongman's (about 17-19% fat), and his W/H^3 (21.4) is the closest measured value. A stage-lean bodybuilder shape would make their waists too small.
- Kingpin also uses the ANSUR II largest-arm man, because Marvel compares him to a sumo wrestler.
- Colossus armoured uses his human form, scaled by height only (isometric). His stated weight implies a density no human-density scaling should assume.
- Bruce Banner and the NHANES builds use the ANSUR II average-shape predictor. They are ordinary bodies inside the ANSUR II range.
- She-Hulk uses the ANSUR II lean-but-heavy women. No female athlete girths exist here. The largest-arm woman was rejected: she is obese-shaped (waist 133 cm). Male bodybuilder shapes were rejected for proportions.
- Comics above W/H^3 23 (Thor, the Hulks, Juggernaut, Thing, Darkseid, Abomination) still take Coleman, the highest W/H^3 in the muscular class. They are flagged.
- Rex and Ollie were not used as templates for anyone. Their shapes are not human.
- Flags:
  - `beyond_human_girth_data` is set when BMI is above 43.45, the highest BMI of anyone with measured girths here (ANSUR II men). It is set only for builds whose girths come from a template.
  - `outside_template_range` is set when W/H^3 differs from the template's by more than 10%.
- The comics verifier said: beyond about BMI 45, show "unknown / beyond human data" rather than extrapolate. The brief says to show template girths as derived. Both are recorded. The page must choose. My suggestion: show these girths only with a clear "estimate, beyond human data" label.

### Template table

Girths filled from a template are derived. W/H^3 in kg/m^3.

| Build | W/H^3 | Template | Method | Template W/H^3 | Flags |
|---|---|---|---|---|---|
| US men 20 and over, median (NHANES 2015-2018) | 16.2 | US Army men, 50th percentile (ANSUR II) | ansur_predictor | - | - |
| US women 20 and over, median (NHANES 2015-2018) | 17.4 | US Army women, 50th percentile (ANSUR II) | ansur_predictor | - | - |
| British natural PRO bodybuilders, men (Chappell 2019, n=8) | 14.8 | Steve Reeves (Mr. America 1947) | geometric | 15.2 | - |
| Men who never used steroids (Kouri 1995, n=74) | 14.1 | Steve Reeves (Mr. America 1947) | geometric | 15.2 | - |
| Ronnie Coleman (8x Mr. Olympia) | 22.9 | Mr. America winners 1938-1954, mean of program figures | geometric | 16.4 | outside template range |
| Arnold Schwarzenegger (7x Mr. Olympia) | 16.1 | Mr. America winners 1938-1954, mean of program figures | geometric | 16.4 | - |
| Dorian Yates (6x Mr. Olympia) | 21.2 | Mr. America winners 1938-1954, mean of program figures | geometric | 16.4 | outside template range |
| Jay Cutler (4x Mr. Olympia) | 22.4 | Mr. America winners 1938-1954, mean of program figures | geometric | 16.4 | outside template range |
| Phil Heath (7x Mr. Olympia) | 20.9 | Mr. America winners 1938-1954, mean of program figures | geometric | 16.4 | outside template range |
| Mamdouh 'Big Ramy' Elssbiay (Mr. Olympia 2020, 2021) | 23.0 | Ronnie Coleman (8x Mr. Olympia) | geometric | 22.9 | - |
| Sergio Oliva (3x Mr. Olympia) | 18.2 | Mr. America winners 1938-1954, mean of program figures | geometric | 16.4 | outside template range |
| Brazilian national-level bodybuilders, contest day (de Moraes 2019, n=15) | 15.7 | Steve Reeves (Mr. America 1947) | geometric | 15.2 | - |
| Thai national-team bodybuilders (Sukwong 2022, n=10) | 16.5 | Mr. America winners 1938-1954, mean of program figures | geometric | 16.4 | - |
| Male bodybuilders (McInnis & Balady 1999, n=14) | 17.0 | Mr. America winners 1938-1954, mean of program figures | geometric | 16.4 | - |
| Elite male bodybuilders 5 days before a contest (Withers 1997, n=3) | 16.5 | Mr. America winners 1938-1954, mean of program figures | geometric | 16.4 | - |
| Non-elite male bodybuilders at competition (Fry 1991, n=36) | 15.1 | Steve Reeves (Mr. America 1947) | geometric | 15.2 | - |
| Brian Shaw (4x World's Strongest Man) | 21.3 | US Army man with the largest flexed arm (ANSUR II, one person) | geometric | 21.4 | - |
| Hafthor Julius Bjornsson (WSM 2018) | 23.2 | US Army man with the largest flexed arm (ANSUR II, one person) | geometric | 21.4 | beyond human girth data |
| Eddie Hall (WSM 2017) | 25.1 | US Army man with the largest flexed arm (ANSUR II, one person) | geometric | 21.4 | beyond human girth data, outside template range |
| Lasha Talakhadze (3x Olympic weightlifting champion) | 23.9 | US Army man with the largest flexed arm (ANSUR II, one person) | geometric | 21.4 | beyond human girth data, outside template range |
| Elite strongman competitors (Kraemer 2020, n=18) | 23.2 | US Army man with the largest flexed arm (ANSUR II, one person) | geometric | 21.4 | beyond human girth data |
| Superman | 15.4 | Steve Reeves (Mr. America 1947) | geometric | 15.2 | - |
| Batman | 14.4 | Steve Reeves (Mr. America 1947) | geometric | 15.2 | - |
| Captain America (Steve Rogers) | 16.4 | Mr. America winners 1938-1954, mean of program figures | geometric | 16.4 | - |
| Thor (Thor Odinson) | 37.3 | Ronnie Coleman (8x Mr. Olympia) | geometric | 22.9 | beyond human girth data, outside template range |
| Bruce Banner (human form) | 10.8 | US Army men, 50th percentile (ANSUR II) | ansur_predictor | - | - |
| Hulk, savage green form | 48.6 | Ronnie Coleman (8x Mr. Olympia) | geometric | 22.9 | beyond human girth data, outside template range |
| Hulk, grey 'Joe Fixit' form | 52.5 | Ronnie Coleman (8x Mr. Olympia) | geometric | 22.9 | beyond human girth data, outside template range |
| Hulk (as listed on Marvel.com) | 43.7 | Ronnie Coleman (8x Mr. Olympia) | geometric | 22.9 | beyond human girth data, outside template range |
| The Thing (Ben Grimm) | 37.1 | Ronnie Coleman (8x Mr. Olympia) | geometric | 22.9 | beyond human girth data, outside template range |
| Juggernaut (Cain Marko) | 45.2 | Ronnie Coleman (8x Mr. Olympia) | geometric | 22.9 | beyond human girth data, outside template range |
| Piotr Rasputin (Colossus, human form) | 14.6 | Steve Reeves (Mr. America 1947) | geometric | 15.2 | - |
| Colossus (armoured form) | 19.6 | Piotr Rasputin (Colossus, human form) | isometric | - | beyond human girth data |
| Wolverine (Logan) | 21.6 | Dorian Yates (6x Mr. Olympia) | geometric | 21.2 | - |
| Kingpin (Wilson Fisk) | 25.3 | US Army man with the largest flexed arm (ANSUR II, one person) | geometric | 21.4 | beyond human girth data, outside template range |
| Luke Cage | 24.8 | Ronnie Coleman (8x Mr. Olympia) | geometric | 22.9 | beyond human girth data |
| Black Panther (T'Challa) | 14.8 | Steve Reeves (Mr. America 1947) | geometric | 15.2 | - |
| Bane | 18.9 | Sergio Oliva (3x Mr. Olympia) | geometric | 18.2 | - |
| Doomsday | 21.3 | Dorian Yates (6x Mr. Olympia) | geometric | 21.2 | beyond human girth data |
| Darkseid | 43.4 | Ronnie Coleman (8x Mr. Olympia) | geometric | 22.9 | beyond human girth data, outside template range |
| She-Hulk (Jennifer Walters) | 39.3 | US Army women, 'lean but heavy' subgroup (ANSUR II, n=70) | geometric | 17.3 | beyond human girth data, outside template range |
| Abomination (Emil Blonsky) | 53.0 | Ronnie Coleman (8x Mr. Olympia) | geometric | 22.9 | beyond human girth data, outside template range |

## Rex and Ollie: how the girths were derived

- Source: the picture-measurement work in `scratchpad/mass/` (final.json, the checker files, Methods A, B and C).
- Scale: the checker's 3.048 m / 790 px = 0.0038582 m per pixel (Rex's crest tip to the floor under his ankles).
- Width: the frontal width at each girth site, perpendicular to the limb axis. Readings come from the checker where it gave one, then Methods B and C, then the Method A region masks. `derivation.width_source` in each girth says which.
- Depth: k x width. k is the depth ratio the checker's reconciled volume model used at that site: chest 1.05, waist 0.80, legs 1.0, Rex upper arm 0.90, Ollie upper arm 0.95, forearm 0.85, Rex neck 1.05, Ollie neck 1.0.
- Girth: Ramanujan perimeter of an ellipse with those two axes.
- Range: the width range combined with the k range. The chest, waist and leg k ranges are the checker's. The arm, forearm and neck k ranges are mine (about +/-0.1).

| Site | Rex width (px) | k | Rex girth (m) | Rex range (m) | Ollie width (px) | k | Ollie girth (m) | Ollie range (m) |
|---|---|---|---|---|---|---|---|---|
| chest | 278 | 1.05 | 3.45 | 3.16-3.86 | 297 | 1.05 | 3.69 | 3.34-4.20 |
| waist | 237 | 0.80 | 2.59 | 2.38-2.82 | 320 | 0.80 | 3.50 | 3.12-3.80 |
| arm_flexed | 165 | 0.90 | 1.90 | 1.75-2.04 | 148 | 0.95 | 1.75 | 1.29-1.99 |
| forearm | 145 | 0.85 | 1.63 | 1.52-1.83 | 108 | 0.85 | 1.21 | 0.96-1.35 |
| thigh | 158 | 1.00 | 1.92 | 1.69-2.10 | 164 | 1.00 | 1.99 | 1.74-2.19 |
| calf | 165 | 1.00 | 2.00 | 1.75-2.22 | 172 | 1.00 | 2.08 | 1.85-2.27 |
| neck | 128 | 1.05 | 1.59 | 1.42-1.76 | 122 | 1.00 | 1.48 | 1.38-1.59 |

Width choices:

- Rex chest: 278 px at row 250 (checker). Masks give 274-282 px over rows 220-300.
- Rex waist: 237 px (Method C, at its navel row, about 365). His navel is hidden by the tank top, so the level is estimated. Masks give 235-242 px at rows 360-370. Both waist edges are visible against the background.
- Rex upper arm: 165 px at the biceps belly of the fully visible arm (checker and Method C agree).
- Rex forearm: 145 px (checker), just below the elbow, above the wrist strap.
- Rex thigh: 158 px just below the crotch (Method B, 160/158 px). The checker gives 150-165 px.
- Rex calf: 165 px (Method C). Method B gives 174/165 px; the checker 150-165 px.
- Rex neck: 128 px, the midpoint of Method B (135) and Method C (120).
- Ollie chest: 297 px at row 240 (mask). Method C gives 290 px, Method B 307 px.
- Ollie waist: 320 px at the navel (Method C; masks give 319-320 px). Both edges are partly behind his fists.
- Ollie upper arm: 148 px mid-arm, from the Method A mask with the checker's 2 px fur erosion. Method C read 115 px. The checker judged Method C's arms too small, so the mask reading is used and 115 sets the low end.
- Ollie forearm: 108 px, the mean of the widest stretch of the eroded mask. Method C read 90 px, which sets the low end.
- Ollie thigh: 164 px (Methods B and C agree within 2 px).
- Ollie calf: 172 px (Method C). The two leg masks give 167 and 177 px.
- Ollie neck: 122 px, the midpoint of Method B (125) and Method C (120).

Clothing:

- Rex wears a tank top and cargo pants. Chest and waist are over the tank top (and the belt at the waist). Thigh and calf are over the cargo pants. Arm, forearm and neck are bare.
- Ollie wears cargo pants, boots and an open vest. Chest and waist include the vest at the sides. Thigh and calf are over the cargo pants; the calf is taken above the boots. Arm, forearm and neck are bare (fur).
- Each girth has `includes_clothing` and a `clothing_note`.

Tail:

- Rex's large tail is about 0.29 m^3 (about 307 kg at 1,060 kg/m^3, about 11% of his volume). It was inside the old 2,700 kg; since 11 Oct 2026 it is on top of his 2,700 kg of body (3,007 kg in all). It adds weight but has no listed girth.
- Ollie has a small tufted tail, about 0.01 m^3 (about 11 kg), part of his 3,007 kg (about 2,996 kg of body).

Caveats:

- Depth is not visible in a front view. Every girth depends on k.
- Method check on ANSUR II medians: the same construction from chest breadth (0.289 m, k 1.05) gives 0.931 m, but the real chest tape is 1.056 m. That is 12% short. The waist check is 2% short. So the chests of Rex and Ollie probably read low. I did not adjust them; the brief fixed the method.
- The arms are not in a flexed pose. The page field is "flexed upper arm", so the definition differs.
- Rex's calf reads larger than his thigh. His baggy pants bunch at the knee and calf.
- Ollie's waist reads close to his chest because the open vest hangs at the sides.


## Gaps

Girths:

- No girths exist for any strongman, for Big Ramy, or for any comic character. All of theirs come from templates.
- No neck or forearm exists for any modern pro bodybuilder. Those come from the Mr. America mean.
- No female athlete girths exist. She-Hulk's template is an athletic-ish soldier shape, not a bodybuilder's.
- Pro bodybuilder girths come from fan or profile sites. They are undated and the method is unknown (flexed or relaxed, cold or pumped, which landmark).
- Nothing tests a template at bodybuilder or comic scale. The largest measured flexed arm in ANSUR II is 49.0 cm.
- NHANES 2015-2018 has no chest, forearm, thigh, calf or neck in the report.
- There is no sourced conversion from the NHANES iliac-crest waist to the ANSUR navel waist.
- There is no flexed-vs-relaxed arm conversion for ordinary people. The only one (+4.75 cm) is from 10 elite bodybuilders.
- The natural-to-navel waist ratio is from 1988 soldiers, not from bodybuilders.
- Mid-thigh girth (the usual bodybuilding site) is not measured in ANSUR II or NHANES.

Heights, weights and body fat:

- Body fat is unknown for most builds, including every pro bodybuilder, every comic, Eddie Hall, Bjornsson and Talakhadze.
- Big Ramy's 2020 and 2021 stage weights were not found.
- Bjornsson's 205 kg at the 2025 World Deadlift Championships appears only in a Wikipedia note.
- Shaw's 6'6.75" comes from his own video via Wikipedia; it was not watched.
- The Kouri 1995 full text was not read. 6.1 vs 6.3 is not settled.
- The 1956 program weights imply a pre-steroid FFMI of about 27.4, against Kouri's 25.4 for the same winners. One source uses different weights or a different fat assumption.
- No OHOTMU edition was read directly. DC's own Who's Who was not found.
- Rossow 2013, Mitchell 2018 and Malcolm Cooper lack height or weight, so they are not builds.

Rex and Ollie:

- One front-view picture. Depth is assumed.
- The chest construction under-reads a human chest tape by about 12%.
- Clothing is counted as body.
- Ollie's waist edges are partly hidden by his hands.
- Mass depends on density (1,020-1,080 kg/m^3). Air sacs, if they had them, would lower it about 7%.

Open decision for the page:

- Show template girths for builds flagged `beyond_human_girth_data` as labelled estimates, or show "unknown". The verifier preferred "unknown". The brief asked for derived girths. The data supports both.

## Changes after the page audit (2026-10-10)

`tools/audit_fixes.py` applies these to a freshly compiled builds.json. It asserts the old state first.

- Midpoints that no source prints are `derived`, not `reported`: Dorian Yates and Jay Cutler height, Brian Shaw height, Yates chest, waist, flexed arm and calf, Cutler calf, Coleman thigh, Oliva chest and flexed arm. Ranges are kept.
- Captain America, DK Avengers guides: 1.8796 m (6 ft 2 in, as printed; the book also prints 1.87 m).
- Ollie: height 3.063 m to the horn tips, the height at which his girths, volume and mass were measured (Rex's 10 ft fixes the scale). Volume 2.53 m^3 (his own central value, 2.531). Rex keeps 3.048 m and 2.55 m^3.
- `ansur_geometric_law_test` residual SD%: waist 5.7, arm 5.2, forearm 4.5, calf 4.2, neck 4.3 (recomputed on the ANSUR II male CSV; the stored 5.9 for the waist could not be reproduced).
- Beyond-human flag notes rewritten as reader text; the limit is 43.45 (ANSUR II male maximum) everywhere.
- SDs moved out of text into numbers with units: `height_m.sd_m`, `weight_kg.sd_kg`, `weight_kg.other[].sd_kg`, `body_fat_pct.sd_pct`. The page converts them.
- Process words (verifier, compiler, "the fact", raw site keys) removed from reader-facing build text and from a few fact notes.

The model now also treats heights more than 10% outside the ANSUR II stature range (below 1.28 m or above 2.19 m) as beyond human girth data (`src/calc.js`).

## Reproduce

Scripts are in `/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/bcdata/scripts/`:

- `facts_fix.py`: loads the research and applies every correction, with assertions.
- `girths.py`: Rex and Ollie girths (writes `rexollie_girths.json`).
- `compile.py`: writes builds.json. Run `python3 -I compile.py /home/user/build-calc/data/builds.json`.
- `resolve_test.py`: fills every template chain and prints all girths in inches, as a check.
- `ansur1_waist.py`, `mra.py`: the ANSUR 1988 waist ratio and the Mr. America means.
- Then `python3 -I tools/audit_fixes.py data/builds.json` (in this project) for the page-audit fixes.

The NHANES PDF is in `scratchpad/bcdata/nhanes_dl/` (sha256 936396720de7ce66b69e392a3b964d552f3170fc241f91fc9e93efb74c447b2d).

## Change from the Build Comparison research (2026-10-11)

- `kouri1995_nonusers`: height 1.80 m, weight 82.06 kg and body fat 12.5% now come from Table 1 of Kouri 1995's full paper (status measured; new fact `kouri1995_table1`), read and verified for the Build Comparison (`build-comparison/data/facts.json`, key `kouri1995_fulltext_methods`). They replace approximate second-hand means (1.8 m, 82.0 kg, 13%, reported). The description now says the 74 non-users were 56 gym athletes and 18 volunteers from a testosterone trial.

