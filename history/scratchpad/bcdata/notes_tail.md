
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
  - Height 3.048 m, mass 2,700 kg (2,300-3,000), volume 2.55 m^3 and density 1,060 kg/m^3 are all marked estimate, source picture measurement, as instructed.
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
  - `beyond_human_girth_data` is set when BMI is above 43.5, the highest BMI of anyone with measured girths here (ANSUR II, 43.45). It is set only for builds whose girths come from a template.
  - `outside_template_range` is set when W/H^3 differs from the template's by more than 10%.
- The comics verifier said: beyond about BMI 45, show "unknown / beyond human data" rather than extrapolate. The brief says to show template girths as derived. Both are recorded. The page must choose. My suggestion: show these girths only with a clear "estimate, beyond human data" label.

