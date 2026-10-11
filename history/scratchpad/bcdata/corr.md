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
