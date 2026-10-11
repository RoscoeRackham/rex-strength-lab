# Build Calculator

2026-10-10 01:30:03 UTC to 2026-10-10 04:22:29 UTC. 10 assistant events, 1 commit events, 19 subagent events, 38 tool call events, 1 user events, 4 wakeup events.

A second project: a character build calculator (weight and seven girths from height and build). Research workflow, data compile, page build, audit and fixes, publish and commit, while the round-4 fix workflow ran in parallel for the Rex lab.

### Owner · 2026-10-10 01:30:03 UTC

```text
A similar secondary project: the ability to calculate a character’s weight and general measurements (chest, arms, thighs, calves, waist) based on certain builds (comic book characters, record bodybuilders, etc)
```

**Claude · 2026-10-10 01:30:41 UTC**

A body-measurement calculator fits well alongside the strength lab. Plan:

- **What it is:** a separate page (and its own folder in lodge-docs).
- **How it works:**
  1. Pick a build: average people, athletes, record bodybuilders, strongmen, comic-book characters, or Rex and Ollie.
  2. Set a height.
  3. It gives weight plus chest, waist, arms, forearms, thighs, calves and neck, in imperial or metric.
- **Labelling:** every number is marked as measured, reported or derived.

It needs sourced data first, so I'm starting a research workflow now. It runs alongside the Rex jobs, which are still going.


- `Workflow` build-calc-research: Research sourced data for a character build calculator (weight and girths from height and build), then adversarially verify each topic
  - run `wf_16409832-67f`: 8 subagents, listed below

<details>
<summary>Subagent `research:anthro` (build-calc-research, 2026-10-10 01:31:13 UTC): I downloaded the ANSUR II public working databases from Penn State's OPEN Design Lab: the male and female CSVs (4,082 men, 1,986 women), the NSRDEC data memo, technical report NATICK/TR-15/007 and the Measurer's Handbook TR-11/017. The http:// links on the OPEN Lab page now return an HTML app shell, but the same paths ... Returned facts: 31 (e.g. ansur2_dataset; ansur2_measurement_definitions).</summary>

Workflow run `wf_16409832-67f`, phase `Research`, agent `a4ac258e3c5361b3a`. Prompt, verbatim:

```text
Project: a small web calculator. The user picks a BUILD (average man or woman, athlete, record bodybuilder, strongman, comic-book character, or two original characters) and a HEIGHT, and the page shows estimated body WEIGHT and GIRTHS: chest, waist, upper arm (flexed), forearm, thigh, calf and neck. Every number must be sourced or clearly labelled as an estimate. The owner values factual accuracy over flattery: say "unknown" rather than invent, and label magazine-reported or fan-wiki numbers as such.
Write raw downloads and scripts under /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/buildcalc/<topic>/ (create it). Do not edit anything under /home/user. Use WebSearch/WebFetch for sources; prefer primary sources (journals, official databases, publisher handbooks) over wikis. For each fact give: key, label, value(s) with units (SI and the original units), status (measured | official | reported | derived | estimate | disputed), sources (title + URL actually fetched), and notes (what exactly the source says, caveats).

TOPIC: everyday-body baselines from measured data. Download the public ANSUR II data set (US Army 2012 anthropometric survey; male ~4,082 and female ~1,986 subjects; CSVs are published by Penn State's OPEN Design Lab, e.g. https://www.openlab.psu.edu/ansur2/ ) and compute, for men and women separately: stature, weight, and the circumferences chest, waist (natural or omphalion; say which), biceps flexed, forearm, thigh, calf and neck. Give the 5th, 50th and 95th percentiles and means. Then fit and report, with fit statistics, (a) how each girth scales with sqrt(weight/height) (the geometric expectation for a fixed body shape) and (b) a regression predicting weight from height and the girths, with its typical error. Save the fitted coefficients. Also give segment lengths useful for a volume model if available. If the CSV cannot be downloaded, use the ANSUR II technical report tables and say so.
```

</details>

<details>
<summary>Subagent `research:muscle` (build-calc-research, 2026-10-10 01:31:13 UTC): Topic covered: record bodybuilders and strongmen (12 athletes plus a pre-steroid reference) and the peer-reviewed data on bodybuilder body composition and girths. Raw downloads are in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/buildcalc/bodybuilders/dl/. Returned facts: 40 (e.g. kouri1995_ffmi_natural_limit; kouri1995_group_means).</summary>

Workflow run `wf_16409832-67f`, phase `Research`, agent `af5675402b3a338f1`. Prompt, verbatim:

```text
Project: a small web calculator. The user picks a BUILD (average man or woman, athlete, record bodybuilder, strongman, comic-book character, or two original characters) and a HEIGHT, and the page shows estimated body WEIGHT and GIRTHS: chest, waist, upper arm (flexed), forearm, thigh, calf and neck. Every number must be sourced or clearly labelled as an estimate. The owner values factual accuracy over flattery: say "unknown" rather than invent, and label magazine-reported or fan-wiki numbers as such.
Write raw downloads and scripts under /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/buildcalc/<topic>/ (create it). Do not edit anything under /home/user. Use WebSearch/WebFetch for sources; prefer primary sources (journals, official databases, publisher handbooks) over wikis. For each fact give: key, label, value(s) with units (SI and the original units), status (measured | official | reported | derived | estimate | disputed), sources (title + URL actually fetched), and notes (what exactly the source says, caveats).

TOPIC: record bodybuilders and strongmen. For about 12 well-known people (e.g. Ronnie Coleman, Arnold Schwarzenegger, Dorian Yates, Jay Cutler, Phil Heath, Mamdouh "Big Ramy" Elssbiay, Sergio Oliva, Brian Shaw, Hafthor Bjornsson, Eddie Hall, plus a top natural (drug-tested) bodybuilder and an elite Olympic weightlifter super-heavyweight): height, competition weight and off-season weight, and any published girths (arm, chest, waist, thigh, calf, neck). These are mostly magazine or self-reported: mark them 'reported' and give the exact source and date; flag conflicts between sources as 'disputed' with the range. Also find peer-reviewed data on elite bodybuilders' girths and body composition (e.g. studies of competitive bodybuilders' fat-free mass index, girth surveys) and the Kouri et al. (1995) FFMI ~25 natural-limit finding, quoting exact numbers.
```

</details>

<details>
<summary>Subagent `research:comics` (build-calc-research, 2026-10-10 01:44:05 UTC): I found stated heights and weights for all 15 requested characters, plus She-Hulk and Abomination. Hulk is split into four forms and Wolverine into with and without adamantium. Returned facts: 25 (e.g. superman; batman).</summary>

Workflow run `wf_16409832-67f`, phase `Research`, agent `a7a9366e8f1ae0436`. Prompt, verbatim:

```text
Project: a small web calculator. The user picks a BUILD (average man or woman, athlete, record bodybuilder, strongman, comic-book character, or two original characters) and a HEIGHT, and the page shows estimated body WEIGHT and GIRTHS: chest, waist, upper arm (flexed), forearm, thigh, calf and neck. Every number must be sourced or clearly labelled as an estimate. The owner values factual accuracy over flattery: say "unknown" rather than invent, and label magazine-reported or fan-wiki numbers as such.
Write raw downloads and scripts under /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/buildcalc/<topic>/ (create it). Do not edit anything under /home/user. Use WebSearch/WebFetch for sources; prefer primary sources (journals, official databases, publisher handbooks) over wikis. For each fact give: key, label, value(s) with units (SI and the original units), status (measured | official | reported | derived | estimate | disputed), sources (title + URL actually fetched), and notes (what exactly the source says, caveats).

TOPIC: comic-book characters' official heights and weights. For about 15 characters with big builds (e.g. Superman, Batman, Captain America, Thor, Hulk (Banner/Savage/Grey variants), the Thing, Juggernaut, Colossus, Wolverine (with and without adamantium), Bane, Kingpin, Doomsday, Darkseid, Luke Cage, Black Panther), find their stated height and weight in official publisher sources: The Official Handbook of the Marvel Universe (cite edition and year), Marvel.com character pages, DC's Who's Who or DC.com, and say when only fan wikis give a number (status 'reported', not 'official'). Note when editions disagree (status 'disputed', give the range). Comic sources almost never give chest or arm girths: if any official source does, record it; otherwise say unknown. Also note well-known cases where the stated weight is physically implausible for the stated height and build (compute weight/height^3 and compare with humans), without inventing explanations.
```

</details>

<details>
<summary>Subagent `research:model` (build-calc-research, 2026-10-10 01:56:01 UTC): TOPIC: the physics and physiology of turning a build into a weight and a set of girths. Raw downloads, scripts and outputs are in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/buildcalc/physics/ (raw/, scripts/, out/). Returned facts: 38 (e.g. siri_equation; brozek_equation).</summary>

Workflow run `wf_16409832-67f`, phase `Research`, agent `ae656028b2c1616ea`. Prompt, verbatim:

```text
Project: a small web calculator. The user picks a BUILD (average man or woman, athlete, record bodybuilder, strongman, comic-book character, or two original characters) and a HEIGHT, and the page shows estimated body WEIGHT and GIRTHS: chest, waist, upper arm (flexed), forearm, thigh, calf and neck. Every number must be sourced or clearly labelled as an estimate. The owner values factual accuracy over flattery: say "unknown" rather than invent, and label magazine-reported or fan-wiki numbers as such.
Write raw downloads and scripts under /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/buildcalc/<topic>/ (create it). Do not edit anything under /home/user. Use WebSearch/WebFetch for sources; prefer primary sources (journals, official databases, publisher handbooks) over wikis. For each fact give: key, label, value(s) with units (SI and the original units), status (measured | official | reported | derived | estimate | disputed), sources (title + URL actually fetched), and notes (what exactly the source says, caveats).

TOPIC: the physics and physiology of turning a build into weight and girths. Find and quote sources for: (1) human whole-body density and the Siri (1961) and Brozek (1963) equations linking body density to body-fat percentage, and density of fat-free mass (about 1,100 kg/m^3) and fat (about 900 kg/m^3); (2) fat-free mass index FFMI = FFM/height^2 and its normal and elite ranges; (3) geometric scaling: at fixed shape, mass scales with height cubed and girths with height, so girth scales with sqrt(mass/height); find any anthropometric literature testing this (e.g. allometric studies of body mass vs stature, Benn index, the Quetelet/BMI exponent debates, ponderal index); (4) published methods that estimate body volume or mass from circumferences and lengths (segmental cylinder or frustum models, e.g. anthropometric volume equations, Jensen's elliptical zone method), with their accuracy. Write a short design note: how a calculator should derive girths for a chosen build at a new height and weight, how to estimate weight from girths, and what errors to expect, especially when extrapolating to builds far beyond the human data (comic characters).
```

</details>

<details>
<summary>Subagent `verify:anthro` (build-calc-research, 2026-10-10 02:12:14 UTC): The researcher's numbers are accurate and reproducible, so this is a strong base for the calculator. My own download matched their sha256 hashes. Returned checks: 31 (e.g. ansur2_dataset; ansur2_measurement_definitions).</summary>

Workflow run `wf_16409832-67f`, phase `Verify`, agent `a3baa330dbf2469be`. Prompt, verbatim:

```text
Project: a small web calculator. The user picks a BUILD (average man or woman, athlete, record bodybuilder, strongman, comic-book character, or two original characters) and a HEIGHT, and the page shows estimated body WEIGHT and GIRTHS: chest, waist, upper arm (flexed), forearm, thigh, calf and neck. Every number must be sourced or clearly labelled as an estimate. The owner values factual accuracy over flattery: say "unknown" rather than invent, and label magazine-reported or fan-wiki numbers as such.
Write raw downloads and scripts under /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/buildcalc/<topic>/ (create it). Do not edit anything under /home/user. Use WebSearch/WebFetch for sources; prefer primary sources (journals, official databases, publisher handbooks) over wikis. For each fact give: key, label, value(s) with units (SI and the original units), status (measured | official | reported | derived | estimate | disputed), sources (title + URL actually fetched), and notes (what exactly the source says, caveats).

You are a skeptical fact-checker for the topic "anthro". Below are the researcher's facts. Re-fetch at least 10 of the cited URLs (prioritise the numbers the calculator will lean on most) and check each value and status against what the source actually says; recompute any derived statistics you can (for ANSUR data, re-download and recompute a few percentiles). Mark ok=false with a correction for anything wrong, mislabelled (e.g. a fan wiki marked official), or unsupported. List important missing items.

FACTS:
{
 "summary": "I downloaded the ANSUR II public working databases from Penn State's OPEN Design Lab: the male and female CSVs (4,082 men, 1,986 women), the NSRDEC data memo, technical report NATICK/TR-15/007 and the Measurer's Handbook TR-11/017. The http:// links on the OPEN Lab page now return an HTML app shell, but the same paths over https:// serve the real files. CSV units are mm, and weightkg is stored as kg*10. The working databases are stratified random samples matched to the Army's demographics, so plain unweighted statistics are the intended estimates. My computed means, SDs and 5th/50th/95th percentiles match the TR-15/007 summary tables for stature, weight, chest, waist, biceps, forearm, thigh, calf, neck and neck base, which confirms the parsing and units.\n\nMedians (men / women): stature 175.5 / 162.6 cm; weight 84.6 / 66.8 kg; chest 105.6 / 94.0; waist at the navel (omphalion; ANSUR II never measured the natural waist) 93.7 / 85.2; flexed biceps 35.7 / 30.4; flexed forearm 31.0 / 26.3; thigh at the gluteal furrow 62.4 / 61.3; calf 39.2 / 37.2; neck 39.5 / 32.8 cm.\n\nGirth versus sqrt(W/H): chest follows the fixed-shape (geometric) law almost exactly, with exponent b = 1.02 (men) and 1.04 (women); the geometric law predicts b = 1. Waist grows much faster (b about 1.4). Upper thigh (about 1.15) and biceps (1.09 men, 1.24 women) grow somewhat faster. Forearm, calf and neck grow slower (0.62 to 0.85). These patterns reflect how soldiers differ, which is mostly fat, not how muscle gain changes a body.\n\nWeight from height plus 7 girths: the log-log model gives R2 0.987 (men) and 0.981 (women), with RMSE 1.6 and 1.5 kg; 10-fold cross-validated errors are almost identical. A physically motivated form, W = H_m * sum(c_i * G_i^2), does nearly as well: RMSE 1.7 and 1.5 kg. In extrapolation tests (predicting the heaviest 10% or the 10% with the biggest arms from a model fitted without them), the log-log and geometric forms stay within about 1 kg on average. The linear form under-predicts large bodies by about 3 kg. A simple stacked-cone (frustum) volume model built from ANSUR girths and segment lengths calibrates to 1.042 kg per model-litre (men) and 1.044 (women), with a spread of only 2.3 to 2.8% and RMSE about 1.9 kg. It is a sensible physical base for extreme builds.\n\nSegment lengths and breadths with ratios to stature, lean-heavy and big-waist subgroups, and the data ceiling (largest measured flexed arm: 49.0 cm in men, 43.5 cm in women) are included.\n\nFiles are under /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/buildcalc/ansur2/:\n- raw/: downloaded CSVs and PDFs, untouched\n- scripts/: analyze_ansur2.py, extras_ansur2.py, compact.py, make_facts.py; run with python3 -I <script> <raw> <out>\n- out/fits.json: all coefficients and fit statistics, including reduced models and correlations\n- out/ansur2_coefficients_compact.json: a calculator-ready subset\n- out/descriptives.csv and out/segments.csv: the 1/5/25/50/75/95/99th percentiles\n- out/facts.json: these facts",
 "facts": [
  {
   "key": "ansur2_dataset",
   "label": "ANSUR II public working databases: what they are",
   "status": "official",
   "values": "{\"n_male\":4082,\"n_female\":1986,\"age_min_yr\":17,\"age_max_yr\":58,\"male_age_median_yr\":28,\"female_age_median_yr\":27,\"orig\":\"93 directly measured dimensions; CSV units mm, weightkg column = kg*10; survey Oct 2010 - Apr 2012\"}",
   "sources": [
    {
     "title": "OPEN Design Lab ANSUR II page",
     "url": "https://www.openlab.psu.edu/ansur2/"
    },
    {
     "title": "NSRDEC memo 14 Apr 2017: ANSUR II working databases",
     "url": "https://tools.openlab.psu.edu/publicData/ANSURII-MFR.pdf"
    },
    {
     "title": "Gordon et al. 2014, NATICK/TR-15/007 (ANSUR II methods and summary statistics)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSURII-TR15-007.pdf"
    },
    {
     "title": "ANSUR II male CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    },
    {
     "title": "ANSUR II female CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_FEMALE_Public.csv"
    }
   ],
   "notes": "Downloaded both CSVs (sha256 male 0547aea0..., female ed7e800a...) from tools.openlab.psu.edu over HTTPS (the http:// links on the OPEN Lab page now return an HTML app shell; https works). Memo: 'All measurements are recorded in millimeters with the exception of the variable weightkg' (kg*10). TR-15/007 p.33: the working databases are stratified random samples matched to Total Army age/race/component distributions (DMDC 30 Sep 2011), so plain unweighted statistics are the intended population estimates; memo says male and female files should be analysed separately. Population is US Army soldiers aged 17-58 (fitter and younger than the general US adult population); memo cautions it may not represent other populations."
  },
  {
   "key": "ansur2_measurement_definitions",
   "label": "How ANSUR II girths were taken (matters when comparing to bodybuilding tape numbers)",
   "status": "official",
   "values": "{\"allowable_observer_error_chest_m\":0.014,\"allowable_observer_error_waist_m\":0.012,\"allowable_observer_error_biceps_m\":0.006,\"allowable_observer_error_forearm_m\":0.005,\"allowable_observer_error_thigh_m\":0.006,\"allowable_observer_error_calf_m\":0.004,\"allowable_observer_error_neck_m\":0.006,\"allowable_observer_error_weight_kg\":0.3,\"orig\":\"Allowable observer error (mm): chest 14, waist 12, biceps 6, forearm 5, thigh 6, calf 4, neck 6; weight 0.3 kg\"}",
   "sources": [
    {
     "title": "Hotzman et al. 2011, NATICK/TR-11/017 (Measurer's Handbook)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSURII-TR11-017.pdf"
    },
    {
     "title": "Gordon et al. 2014, NATICK/TR-15/007 (ANSUR II methods and summary statistics)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSURII-TR15-007.pdf"
    }
   ],
   "notes": "Measurer's Handbook sec. 6.4: CHEST = horizontal at chest point anterior (fullest part of chest/bust), at the maximum point of QUIET respiration (not a puffed/expanded chest). WAIST (OMPHALION) = horizontal at the centre of the navel, abdomen not tensed; ANSUR II did NOT measure natural-waist (narrowest) circumference (TR-15/007 App. F lists natural-indentation waist only for ANSUR 1988), so omphalion waist runs larger than a 'natural waist' tape number. BICEPS FLEXED = right upper arm horizontal forward, elbow ~90 deg, fist clenched toward head, 'maximum effort in making a muscle', tape at highest point of flexed biceps, perpendicular to arm. FOREARM FLEXED = at the elbow crease, upper arm horizontal, elbow 90 deg, fist tightly clenched. THIGH = at the gluteal furrow (top of thigh), muscles relaxed. LOWER THIGH = at suprapatella (just above knee). CALF = maximum horizontal calf girth, standing. NECK = at infrathyroid landmark (just below Adam's apple), perpendicular to neck axis; NECK BASE is a separate, larger measure. Allowable observer error from Table G-1."
  },
  {
   "key": "ansur2_stature",
   "label": "Stature (standing height)",
   "status": "measured",
   "values": "{\"male_mean_m\":1.7562,\"male_sd_m\":0.0685,\"male_p5_m\":1.648,\"male_p50_m\":1.755,\"male_p95_m\":1.87,\"male_min_m\":1.491,\"male_max_m\":1.993,\"female_mean_m\":1.6285,\"female_sd_m\":0.0642,\"female_p5_m\":1.525,\"female_p50_m\":1.626,\"female_p95_m\":1.74,\"female_min_m\":1.409,\"female_max_m\":1.829,\"orig\":\"male: p5/p50/p95 164.8/175.5/187.0 cm = 64.9/69.1/73.6 in; mean 175.62 SD 6.86 cm; range 149.1-199.3 cm | female: p5/p50/p95 152.5/162.6/174.0 cm = 60.0/64.0/68.5 in; mean 162.85 SD 6.42 cm; range 140.9-182.9 cm\"}",
   "sources": [
    {
     "title": "ANSUR II male CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    },
    {
     "title": "ANSUR II female CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_FEMALE_Public.csv"
    },
    {
     "title": "Gordon et al. 2014, NATICK/TR-15/007 (ANSUR II methods and summary statistics)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSURII-TR15-007.pdf"
    }
   ],
   "notes": "From the CSVs (n=4082 M, 1986 F); definition in ansur2_measurement_definitions. TR-15/007 (75) STATURE: M 5th/50th/95th 164.8/175.5/187.0, mean 175.62 SD 6.86; F 152.5/162.6/174.0, mean 162.85 SD 6.42 - matches."
  },
  {
   "key": "ansur2_weight",
   "label": "Body weight (scale)",
   "status": "measured",
   "values": "{\"male_mean_kg\":85.52,\"male_sd_kg\":14.22,\"male_p5_kg\":64.4,\"male_p50_kg\":84.6,\"male_p95_kg\":110.69,\"male_min_kg\":39.3,\"male_max_kg\":144.2,\"female_mean_kg\":67.76,\"female_sd_kg\":10.98,\"female_p5_kg\":51.3,\"female_p50_kg\":66.8,\"female_p95_kg\":87.08,\"female_min_kg\":35.8,\"female_max_kg\":119.6,\"orig\":\"male: p5/p50/p95 64.4/84.6/110.7 kg = 142/187/244 lb; mean 85.52 SD 14.22 kg; range 39.3-144.2 | female: p5/p50/p95 51.3/66.8/87.1 kg = 113/147/192 lb; mean 67.76 SD 10.98 kg; range 35.8-119.6\"}",
   "sources": [
    {
     "title": "ANSUR II male CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    },
    {
     "title": "ANSUR II female CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_FEMALE_Public.csv"
    },
    {
     "title": "Gordon et al. 2014, NATICK/TR-15/007 (ANSUR II methods and summary statistics)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSURII-TR15-007.pdf"
    }
   ],
   "notes": "From the CSVs (n=4082 M, 1986 F); definition in ansur2_measurement_definitions. TR-15/007 (91) WEIGHT: M 64.4/84.6/110.7 kg, mean 85.52 SD 14.22; F 51.3/66.8/87.1, mean 67.76 SD 10.98 - matches (F p95 87.08 vs 87.10 is a percentile-interpolation difference)."
  },
  {
   "key": "ansur2_bmi",
   "label": "BMI computed from measured stature and weight",
   "status": "derived",
   "values": "{\"male_mean_kg_per_m2\":27.69,\"male_sd_kg_per_m2\":4.04,\"male_p5_kg_per_m2\":21.4,\"male_p50_kg_per_m2\":27.46,\"male_p95_kg_per_m2\":34.8,\"male_min_kg_per_m2\":15.35,\"male_max_kg_per_m2\":43.45,\"female_mean_kg_per_m2\":25.5,\"female_sd_kg_per_m2\":3.49,\"female_p5_kg_per_m2\":20.26,\"female_p50_kg_per_m2\":25.27,\"female_p95_kg_per_m2\":31.66,\"female_min_kg_per_m2\":16.37,\"female_max_kg_per_m2\":40.78,\"orig\":\"male: p5/p50/p95 21.4/27.5/34.8, mean 27.69 | female: p5/p50/p95 20.3/25.3/31.7, mean 25.50\"}",
   "sources": [
    {
     "title": "ANSUR II male CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    },
    {
     "title": "ANSUR II female CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_FEMALE_Public.csv"
    }
   ],
   "notes": "Computed per subject from measured stature and weight in the CSVs (n=4082 M, 1986 F). Not cross-checked against a TR table."
  },
  {
   "key": "ansur2_chest",
   "label": "Chest circumference",
   "status": "measured",
   "values": "{\"male_mean_m\":1.0587,\"male_sd_m\":0.0874,\"male_p5_m\":0.922,\"male_p50_m\":1.056,\"male_p95_m\":1.207,\"male_min_m\":0.774,\"male_max_m\":1.469,\"female_mean_m\":0.9469,\"female_sd_m\":0.0827,\"female_p5_m\":0.824,\"female_p50_m\":0.94,\"female_p95_m\":1.094,\"female_min_m\":0.695,\"female_max_m\":1.266,\"orig\":\"male: p5/p50/p95 92.2/105.6/120.7 cm = 36.3/41.6/47.5 in; mean 105.87 SD 8.74 cm; range 77.4-146.9 cm | female: p5/p50/p95 82.4/94.0/109.4 cm = 32.5/37.0/43.1 in; mean 94.69 SD 8.27 cm; range 69.5-126.6 cm\"}",
   "sources": [
    {
     "title": "ANSUR II male CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    },
    {
     "title": "ANSUR II female CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_FEMALE_Public.csv"
    },
    {
     "title": "Gordon et al. 2014, NATICK/TR-15/007 (ANSUR II methods and summary statistics)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSURII-TR15-007.pdf"
    }
   ],
   "notes": "From the CSVs (n=4082 M, 1986 F); definition in ansur2_measurement_definitions. TR-15/007 (24) CHEST CIRCUMFERENCE: M 92.2/105.6/120.7, mean 105.87 SD 8.74; F 82.4/94.0/109.4, mean 94.69 SD 8.27 - matches. Taken at quiet respiration, not an expanded 'bodybuilding' chest."
  },
  {
   "key": "ansur2_waist_omphalion",
   "label": "Waist circumference at omphalion (navel)",
   "status": "measured",
   "values": "{\"male_mean_m\":0.9406,\"male_sd_m\":0.1117,\"male_p5_m\":0.768,\"male_p50_m\":0.937,\"male_p95_m\":1.131,\"male_min_m\":0.648,\"male_max_m\":1.379,\"female_mean_m\":0.8609,\"female_sd_m\":0.0999,\"female_p5_m\":0.71,\"female_p50_m\":0.852,\"female_p95_m\":1.04,\"female_min_m\":0.611,\"female_max_m\":1.334,\"orig\":\"male: p5/p50/p95 76.8/93.7/113.1 cm = 30.2/36.9/44.5 in; mean 94.06 SD 11.17 cm; range 64.8-137.9 cm | female: p5/p50/p95 71.0/85.2/104.0 cm = 28.0/33.5/40.9 in; mean 86.09 SD 9.99 cm; range 61.1-133.4 cm\"}",
   "sources": [
    {
     "title": "ANSUR II male CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    },
    {
     "title": "ANSUR II female CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_FEMALE_Public.csv"
    },
    {
     "title": "Gordon et al. 2014, NATICK/TR-15/007 (ANSUR II methods and summary statistics)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSURII-TR15-007.pdf"
    }
   ],
   "notes": "From the CSVs (n=4082 M, 1986 F); definition in ansur2_measurement_definitions. TR-15/007 (87) WAIST CIRCUMFERENCE (OMPHALION): M 76.8/93.7/113.1, mean 94.06 SD 11.17; F 71.0/85.2/104.0, mean 86.09 SD 9.99 - matches. This is NAVEL-level waist, not natural (narrowest) waist; ANSUR II has no natural-waist girth."
  },
  {
   "key": "ansur2_biceps_flexed",
   "label": "Upper-arm (biceps) circumference, flexed",
   "status": "measured",
   "values": "{\"male_mean_m\":0.3581,\"male_sd_m\":0.0346,\"male_p5_m\":0.303,\"male_p50_m\":0.357,\"male_p95_m\":0.418,\"male_min_m\":0.246,\"male_max_m\":0.49,\"female_mean_m\":0.3056,\"female_sd_m\":0.0308,\"female_p5_m\":0.259,\"female_p50_m\":0.304,\"female_p95_m\":0.36,\"female_min_m\":0.216,\"female_max_m\":0.435,\"orig\":\"male: p5/p50/p95 30.3/35.7/41.8 cm = 11.9/14.1/16.5 in; mean 35.81 SD 3.46 cm; range 24.6-49.0 cm | female: p5/p50/p95 25.9/30.4/36.0 cm = 10.2/12.0/14.2 in; mean 30.56 SD 3.08 cm; range 21.6-43.5 cm\"}",
   "sources": [
    {
     "title": "ANSUR II male CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    },
    {
     "title": "ANSUR II female CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_FEMALE_Public.csv"
    },
    {
     "title": "Gordon et al. 2014, NATICK/TR-15/007 (ANSUR II methods and summary statistics)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSURII-TR15-007.pdf"
    }
   ],
   "notes": "From the CSVs (n=4082 M, 1986 F); definition in ansur2_measurement_definitions. TR-15/007 (9) BICEPS CIRCUMFERENCE, FLEXED: M 30.3/35.7/41.8, mean 35.81 SD 3.46; F 25.9/30.4/36.0, mean 30.56 SD 3.08 - matches. Flexed with maximal effort, tape at the biceps peak, so the protocol matches a bodybuilder's flexed-arm number. Bodybuilders' figures may be taken cold or pumped and are usually self-reported, so they are not strictly comparable."
  },
  {
   "key": "ansur2_forearm_flexed",
   "label": "Forearm circumference, flexed (at elbow crease)",
   "status": "measured",
   "values": "{\"male_mean_m\":0.3101,\"male_sd_m\":0.022,\"male_p5_m\":0.275,\"male_p50_m\":0.31,\"male_p95_m\":0.348,\"male_min_m\":0.233,\"male_max_m\":0.402,\"female_mean_m\":0.2641,\"female_sd_m\":0.0185,\"female_p5_m\":0.235,\"female_p50_m\":0.263,\"female_p95_m\":0.296,\"female_min_m\":0.2,\"female_max_m\":0.342,\"orig\":\"male: p5/p50/p95 27.5/31.0/34.8 cm = 10.8/12.2/13.7 in; mean 31.01 SD 2.20 cm; range 23.3-40.2 cm | female: p5/p50/p95 23.5/26.3/29.6 cm = 9.3/10.4/11.7 in; mean 26.41 SD 1.85 cm; range 20.0-34.2 cm\"}",
   "sources": [
    {
     "title": "ANSUR II male CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    },
    {
     "title": "ANSUR II female CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_FEMALE_Public.csv"
    },
    {
     "title": "Gordon et al. 2014, NATICK/TR-15/007 (ANSUR II methods and summary statistics)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSURII-TR15-007.pdf"
    }
   ],
   "notes": "From the CSVs (n=4082 M, 1986 F); definition in ansur2_measurement_definitions. TR-15/007 (38) FOREARM CIRCUMFERENCE, FLEXED: M 27.5/31.0/34.8, mean 31.01 SD 2.20; F 23.5/26.3/29.6, mean 26.41 SD 1.85 - matches."
  },
  {
   "key": "ansur2_thigh",
   "label": "Thigh circumference (at gluteal furrow, relaxed)",
   "status": "measured",
   "values": "{\"male_mean_m\":0.6251,\"male_sd_m\":0.0584,\"male_p5_m\":0.532,\"male_p50_m\":0.624,\"male_p95_m\":0.723,\"male_min_m\":0.412,\"male_max_m\":0.843,\"female_mean_m\":0.6161,\"female_sd_m\":0.0558,\"female_p5_m\":0.527,\"female_p50_m\":0.613,\"female_p95_m\":0.711,\"female_min_m\":0.448,\"female_max_m\":0.87,\"orig\":\"male: p5/p50/p95 53.2/62.4/72.3 cm = 20.9/24.6/28.5 in; mean 62.51 SD 5.84 cm; range 41.2-84.3 cm | female: p5/p50/p95 52.7/61.3/71.1 cm = 20.7/24.1/28.0 in; mean 61.62 SD 5.58 cm; range 44.8-87.0 cm\"}",
   "sources": [
    {
     "title": "ANSUR II male CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    },
    {
     "title": "ANSUR II female CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_FEMALE_Public.csv"
    },
    {
     "title": "Gordon et al. 2014, NATICK/TR-15/007 (ANSUR II methods and summary statistics)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSURII-TR15-007.pdf"
    }
   ],
   "notes": "From the CSVs (n=4082 M, 1986 F); definition in ansur2_measurement_definitions. TR-15/007 (78) THIGH CIRCUMFERENCE: M 53.2/62.4/72.3, mean 62.51 SD 5.85; F 52.7/61.3/71.1, mean 61.61 SD 5.58 - matches. Measured at the gluteal furrow (very top of the thigh), relaxed. This is usually the largest thigh girth and runs larger than a mid-thigh tape."
  },
  {
   "key": "ansur2_lower_thigh",
   "label": "Lower thigh circumference (above knee)",
   "status": "measured",
   "values": "{\"male_mean_m\":0.4093,\"male_sd_m\":0.0319,\"male_p5_m\":0.359,\"male_p50_m\":0.408,\"male_p95_m\":0.463,\"male_min_m\":0.29,\"male_max_m\":0.54,\"female_mean_m\":0.4007,\"female_sd_m\":0.0352,\"female_p5_m\":0.347,\"female_p50_m\":0.398,\"female_p95_m\":0.465,\"female_min_m\":0.302,\"female_max_m\":0.6,\"orig\":\"male: p5/p50/p95 35.9/40.8/46.3 cm = 14.1/16.1/18.2 in; mean 40.93 SD 3.19 cm; range 29.0-54.0 cm | female: p5/p50/p95 34.7/39.8/46.5 cm = 13.7/15.7/18.3 in; mean 40.07 SD 3.52 cm; range 30.2-60.0 cm\"}",
   "sources": [
    {
     "title": "ANSUR II male CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    },
    {
     "title": "ANSUR II female CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_FEMALE_Public.csv"
    }
   ],
   "notes": "From the CSVs (n=4082 M, 1986 F); definition in ansur2_measurement_definitions. Not cross-checked against a TR table."
  },
  {
   "key": "ansur2_calf",
   "label": "Calf circumference (maximum)",
   "status": "measured",
   "values": "{\"male_mean_m\":0.3923,\"male_sd_m\":0.0297,\"male_p5_m\":0.346,\"male_p50_m\":0.392,\"male_p95_m\":0.443,\"male_min_m\":0.266,\"male_max_m\":0.523,\"female_mean_m\":0.3733,\"female_sd_m\":0.0285,\"female_p5_m\":0.328,\"female_p50_m\":0.372,\"female_p95_m\":0.423,\"female_min_m\":0.282,\"female_max_m\":0.482,\"orig\":\"male: p5/p50/p95 34.6/39.2/44.3 cm = 13.6/15.4/17.4 in; mean 39.23 SD 2.97 cm; range 26.6-52.3 cm | female: p5/p50/p95 32.8/37.2/42.3 cm = 12.9/14.6/16.7 in; mean 37.33 SD 2.85 cm; range 28.2-48.2 cm\"}",
   "sources": [
    {
     "title": "ANSUR II male CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    },
    {
     "title": "ANSUR II female CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_FEMALE_Public.csv"
    },
    {
     "title": "Gordon et al. 2014, NATICK/TR-15/007 (ANSUR II methods and summary statistics)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSURII-TR15-007.pdf"
    }
   ],
   "notes": "From the CSVs (n=4082 M, 1986 F); definition in ansur2_measurement_definitions. TR-15/007 (21) CALF CIRCUMFERENCE: M 34.6/39.2/44.3, mean 39.23 SD 2.97; F 32.8/37.2/42.3, mean 37.33 SD 2.85 - matches. The handbook has measurers record 3 readings near the maximum; the public file holds one value per subject, and which reduction (max or mean) was used is not stated in the documents read."
  },
  {
   "key": "ansur2_neck",
   "label": "Neck circumference (below Adam's apple)",
   "status": "measured",
   "values": "{\"male_mean_m\":0.3977,\"male_sd_m\":0.0258,\"male_p5_m\":0.36,\"male_p50_m\":0.395,\"male_p95_m\":0.443,\"male_min_m\":0.311,\"male_max_m\":0.514,\"female_mean_m\":0.3298,\"female_sd_m\":0.0192,\"female_p5_m\":0.302,\"female_p50_m\":0.328,\"female_p95_m\":0.363,\"female_min_m\":0.275,\"female_max_m\":0.424,\"orig\":\"male: p5/p50/p95 36.0/39.5/44.3 cm = 14.2/15.6/17.4 in; mean 39.77 SD 2.58 cm; range 31.1-51.4 cm | female: p5/p50/p95 30.2/32.8/36.3 cm = 11.9/12.9/14.3 in; mean 32.98 SD 1.92 cm; range 27.5-42.4 cm\"}",
   "sources": [
    {
     "title": "ANSUR II male CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    },
    {
     "title": "ANSUR II female CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_FEMALE_Public.csv"
    },
    {
     "title": "Gordon et al. 2014, NATICK/TR-15/007 (ANSUR II methods and summary statistics)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSURII-TR15-007.pdf"
    }
   ],
   "notes": "From the CSVs (n=4082 M, 1986 F); definition in ansur2_measurement_definitions. TR-15/007 (62) NECK CIRCUMFERENCE: M 36.0/39.5/44.3, mean 39.76 SD 2.58; F 30.2/32.8/36.3, mean 32.98 SD 1.92 - matches."
  },
  {
   "key": "ansur2_neck_base",
   "label": "Neck circumference at base",
   "status": "measured",
   "values": "{\"male_mean_m\":0.4346,\"male_sd_m\":0.0257,\"male_p5_m\":0.395,\"male_p50_m\":0.433,\"male_p95_m\":0.479,\"male_min_m\":0.35,\"male_max_m\":0.545,\"female_mean_m\":0.3712,\"female_sd_m\":0.0197,\"female_p5_m\":0.34,\"female_p50_m\":0.37,\"female_p95_m\":0.405,\"female_min_m\":0.302,\"female_max_m\":0.457,\"orig\":\"male: p5/p50/p95 39.5/43.3/47.9 cm = 15.6/17.0/18.9 in; mean 43.46 SD 2.57 cm; range 35.0-54.5 cm | female: p5/p50/p95 34.0/37.0/40.5 cm = 13.4/14.6/15.9 in; mean 37.12 SD 1.97 cm; range 30.2-45.7 cm\"}",
   "sources": [
    {
     "title": "ANSUR II male CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    },
    {
     "title": "ANSUR II female CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_FEMALE_Public.csv"
    },
    {
     "title": "Gordon et al. 2014, NATICK/TR-15/007 (ANSUR II methods and summary statistics)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSURII-TR15-007.pdf"
    }
   ],
   "notes": "From the CSVs (n=4082 M, 1986 F); definition in ansur2_measurement_definitions. TR-15/007 (63) NECK CIRCUMFERENCE, BASE: M 39.5/43.3/47.9, mean 43.46; F 34.0/37.0/40.5, mean 37.12 - matches."
  },
  {
   "key": "ansur2_wrist",
   "label": "Wrist circumference",
   "status": "measured",
   "values": "{\"male_mean_m\":0.1759,\"male_sd_m\":0.009,\"male_p5_m\":0.162,\"male_p50_m\":0.176,\"male_p95_m\":0.191,\"male_min_m\":0.141,\"male_max_m\":0.216,\"female_mean_m\":0.1548,\"female_sd_m\":0.0078,\"female_p5_m\":0.142,\"female_p50_m\":0.154,\"female_p95_m\":0.168,\"female_min_m\":0.124,\"female_max_m\":0.183,\"orig\":\"male: p5/p50/p95 16.2/17.6/19.1 cm = 6.4/6.9/7.5 in; mean 17.59 SD 0.90 cm; range 14.1-21.6 cm | female: p5/p50/p95 14.2/15.4/16.8 cm = 5.6/6.1/6.6 in; mean 15.48 SD 0.78 cm; range 12.4-18.3 cm\"}",
   "sources": [
    {
     "title": "ANSUR II male CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    },
    {
     "title": "ANSUR II female CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_FEMALE_Public.csv"
    }
   ],
   "notes": "From the CSVs (n=4082 M, 1986 F). Not cross-checked against a TR table. Useful as a frame-size input; it barely tracks body mass (see girth scaling)."
  },
  {
   "key": "ansur2_hip",
   "label": "Buttock (hip) circumference",
   "status": "measured",
   "values": "{\"male_mean_m\":1.0195,\"male_sd_m\":0.0767,\"male_p5_m\":0.899,\"male_p50_m\":1.017,\"male_p95_m\":1.149,\"male_min_m\":0.737,\"male_max_m\":1.305,\"female_mean_m\":1.0212,\"female_sd_m\":0.0759,\"female_p5_m\":0.901,\"female_p50_m\":1.018,\"female_p95_m\":1.156,\"female_min_m\":0.798,\"female_max_m\":1.341,\"orig\":\"male: p5/p50/p95 89.9/101.7/114.9 cm = 35.4/40.0/45.2 in; mean 101.95 SD 7.67 cm; range 73.7-130.5 cm | female: p5/p50/p95 90.1/101.8/115.6 cm = 35.5/40.1/45.5 in; mean 102.12 SD 7.59 cm; range 79.8-134.1 cm\"}",
   "sources": [
    {
     "title": "ANSUR II male CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    },
    {
     "title": "ANSUR II female CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_FEMALE_Public.csv"
    }
   ],
   "notes": "From the CSVs (n=4082 M, 1986 F). Not cross-checked against a TR table."
  },
  {
   "key": "ansur2_selfreport_bias",
   "label": "Self-reported vs measured height and weight in ANSUR II",
   "status": "derived",
   "values": "{\"male_height_bias_m\":0.0227,\"male_weight_bias_kg\":-0.22,\"female_height_bias_m\":0.0124,\"female_weight_bias_kg\":-0.85,\"orig\":\"Mean self-report minus measured: men +2.27 cm, -0.22 kg; women +1.24 cm, -0.85 kg\"}",
   "sources": [
    {
     "title": "ANSUR II male CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    },
    {
     "title": "ANSUR II female CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_FEMALE_Public.csv"
    },
    {
     "title": "NSRDEC memo 14 Apr 2017: ANSUR II working databases",
     "url": "https://tools.openlab.psu.edu/publicData/ANSURII-MFR.pdf"
    }
   ],
   "notes": "The memo says the Heightin and Weightlbs columns are self-reported. On average people over-report their height by about 1-2 cm, even in this routinely measured population. Worth flagging when the calculator takes reported heights of athletes or celebrities."
  },
  {
   "key": "ansur2_girth_scaling_male",
   "label": "How each girth scales with sqrt(weight/height), males",
   "status": "derived",
   "values": "{\"chest_k_cm_per_sqrt_kg_per_m\":15.2277,\"chest_k_p5\":14.5013,\"chest_k_p95\":15.9904,\"chest_free_b\":1.0191,\"waist_omphalion_k_cm_per_sqrt_kg_per_m\":13.5613,\"waist_omphalion_k_p5\":12.2198,\"waist_omphalion_k_p95\":14.7396,\"waist_omphalion_free_b\":1.4426,\"biceps_flexed_k_cm_per_sqrt_kg_per_m\":5.1529,\"biceps_flexed_k_p5\":4.7432,\"biceps_flexed_k_p95\":5.6303,\"biceps_flexed_free_b\":1.0868,\"forearm_flexed_k_cm_per_sqrt_kg_per_m\":4.4531,\"forearm_flexed_k_p5\":4.1375,\"forearm_flexed_k_p95\":4.8112,\"forearm_flexed_free_b\":0.7603,\"thigh_upper_k_cm_per_sqrt_kg_per_m\":8.998,\"thigh_upper_k_p5\":8.4368,\"thigh_upper_k_p95\":9.527,\"thigh_upper_free_b\":1.1513,\"thigh_lower_k_cm_per_sqrt_kg_per_m\":5.8833,\"thigh_lower_k_p5\":5.5361,\"thigh_lower_k_p95\":6.2417,\"thigh_lower_free_b\":0.9128,\"calf_k_cm_per_sqrt_kg_per_m\":5.6364,\"calf_k_p5\":5.2576,\"calf_k_p95\":6.0431,\"calf_free_b\":0.8447,\"neck_k_cm_per_sqrt_kg_per_m\":5.7093,\"neck_k_p5\":5.3211,\"neck_k_p95\":6.1387,\"neck_free_b\":0.6985,\"orig\":\"girth_cm = k * sqrt(weight_kg / stature_m); fit stats: chest R2 0.869, RMSE 3.17 cm; b 95%CI [1.007,1.031], R2log 0.870; waist_omphalion R2 0.765, RMSE 5.41 cm; b 95%CI [1.424,1.462], R2log 0.844; biceps_flexed R2 0.707, RMSE 1.87 cm; b 95%CI [1.066,1.108], R2log 0.718; forearm_flexed R2 0.587, RMSE 1.41 cm; b 95%CI [0.744,0.777], R2log 0.657; thigh_upper R2 0.843, RMSE 2.32 cm; b 95%CI [1.137,1.165], R2log 0.861; thigh_lower R2 0.775, RMSE 1.51 cm; b 95%CI [0.898,0.927], R2log 0.785; calf R2 0.686, RMSE 1.67 cm; b 95%CI [0.828,0.861], R2log 0.712; neck R2 0.552, RMSE 1.72 cm; b 95%CI [0.684,0.713], R2log 0.675\"}",
   "sources": [
    {
     "title": "ANSUR II male CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    }
   ],
   "notes": "Geometric expectation: if body SHAPE is fixed (isometric scaling, or widening at fixed height), every girth is proportional to sqrt(W/H), i.e. exponent b=1. Two fits per girth. (1) Proportional through the origin, G = k*X with X = sqrt(W[kg]/H[m]). k is a per-girth shape constant, and the per-subject percentiles of G/X show how much shape varies. R2 is measured against the mean of G and is negative for girths that barely track mass (wrist: -0.22 M, -0.17 F). (2) Free power law ln G = ln a + b ln X (OLS). Results: chest tracks the geometric law almost exactly (b about 1.02-1.04). Waist grows much faster than geometric (b about 1.4): in this population extra mass goes to the abdomen. Upper thigh and biceps grow a bit faster (b about 1.09-1.24). Lower thigh is about geometric (0.91 M, 1.02 F). Forearm, calf and neck grow slower (b about 0.62-0.85). These exponents describe how soldiers differ, which is mostly fat. They do NOT describe how a body changes when it adds muscle: a bodybuilder adds girth to arms, chest and thighs, not to the waist, so use them with care outside the sample. Also fitted: ln G = c + p ln W + q ln H (see ansur2_girth_predictor_male). All per-girth values are saved in fits.json."
  },
  {
   "key": "ansur2_girth_scaling_female",
   "label": "How each girth scales with sqrt(weight/height), females",
   "status": "derived",
   "values": "{\"chest_k_cm_per_sqrt_kg_per_m\":14.7336,\"chest_k_p5\":13.6952,\"chest_k_p95\":15.8551,\"chest_free_b\":1.038,\"waist_omphalion_k_cm_per_sqrt_kg_per_m\":13.4215,\"waist_omphalion_k_p5\":12.035,\"waist_omphalion_k_p95\":14.8395,\"waist_omphalion_free_b\":1.405,\"biceps_flexed_k_cm_per_sqrt_kg_per_m\":4.76,\"biceps_flexed_k_p5\":4.3914,\"biceps_flexed_k_p95\":5.1462,\"biceps_flexed_free_b\":1.2418,\"forearm_flexed_k_cm_per_sqrt_kg_per_m\":4.1041,\"forearm_flexed_k_p5\":3.8314,\"forearm_flexed_k_p95\":4.3936,\"forearm_flexed_free_b\":0.8,\"thigh_upper_k_cm_per_sqrt_kg_per_m\":9.5931,\"thigh_upper_k_p5\":8.9893,\"thigh_upper_k_p95\":10.1711,\"thigh_upper_free_b\":1.1587,\"thigh_lower_k_cm_per_sqrt_kg_per_m\":6.2346,\"thigh_lower_k_p5\":5.7548,\"thigh_lower_k_p95\":6.7242,\"thigh_lower_free_b\":1.0182,\"calf_k_cm_per_sqrt_kg_per_m\":5.8024,\"calf_k_p5\":5.3575,\"calf_k_p95\":6.2578,\"calf_free_b\":0.8536,\"neck_k_cm_per_sqrt_kg_per_m\":5.1208,\"neck_k_p5\":4.759,\"neck_k_p95\":5.5263,\"neck_free_b\":0.6229,\"orig\":\"girth_cm = k * sqrt(weight_kg / stature_m); fit stats: chest R2 0.736, RMSE 4.25 cm; b 95%CI [1.011,1.065], R2log 0.737; waist_omphalion R2 0.699, RMSE 5.48 cm; b 95%CI [1.371,1.439], R2log 0.766; biceps_flexed R2 0.763, RMSE 1.50 cm; b 95%CI [1.214,1.269], R2log 0.796; forearm_flexed R2 0.630, RMSE 1.12 cm; b 95%CI [0.775,0.825], R2log 0.674; thigh_upper R2 0.824, RMSE 2.34 cm; b 95%CI [1.137,1.181], R2log 0.842; thigh_lower R2 0.704, RMSE 1.91 cm; b 95%CI [0.989,1.047], R2log 0.707; calf R2 0.623, RMSE 1.75 cm; b 95%CI [0.826,0.881], R2log 0.645; neck R2 0.388, RMSE 1.50 cm; b 95%CI [0.601,0.645], R2log 0.599\"}",
   "sources": [
    {
     "title": "ANSUR II female CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_FEMALE_Public.csv"
    }
   ],
   "notes": "Same method as ansur2_girth_scaling_male; n=1986. Female biceps grows faster with mass (b=1.24) than male (1.09); chest bust-inclusive."
  },
  {
   "key": "ansur2_girth_predictor_male",
   "label": "Predict 'average-shape' girths from weight and height, males",
   "status": "derived",
   "values": "{\"chest_A\":14.5924,\"chest_p_weight\":0.5084,\"chest_q_height\":-0.4917,\"waist_omphalion_A\":5.8855,\"waist_omphalion_p_weight\":0.7277,\"waist_omphalion_q_height\":-0.8234,\"biceps_flexed_A\":4.4491,\"biceps_flexed_p_weight\":0.5485,\"biceps_flexed_q_height\":-0.6257,\"forearm_flexed_A\":6.716,\"forearm_flexed_p_weight\":0.3681,\"forearm_flexed_q_height\":-0.1877,\"thigh_upper_A\":6.6267,\"thigh_upper_p_weight\":0.5733,\"thigh_upper_q_height\":-0.5382,\"thigh_lower_A\":6.6519,\"thigh_lower_p_weight\":0.4462,\"thigh_lower_q_height\":-0.2931,\"calf_A\":7.3905,\"calf_p_weight\":0.4156,\"calf_q_height\":-0.3149,\"neck_A\":10.3419,\"neck_p_weight\":0.351,\"neck_q_height\":-0.3768,\"orig\":\"girth_cm = A * weight_kg^p * stature_m^q; residual SD: chest 3.0%; waist_omphalion 4.7%; biceps_flexed 5.1%; forearm_flexed 4.1%; thigh_upper 3.5%; thigh_lower 3.6%; calf 4.0%; neck 3.7%. Check at median H=1.755 m, W=84.6 kg: predicted chest 105.7, waist 93.6, biceps 35.7, forearm 31.0, thigh 62.3, lower thigh 40.9, calf 39.2, neck 39.7 cm vs observed medians 105.6, 93.7, 35.7, 31.0, 62.4, 40.8, 39.2, 39.5 cm\"}",
   "sources": [
    {
     "title": "ANSUR II male CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    }
   ],
   "notes": "OLS on logs, n=4082. R2 on the log scale: chest 0.870, waist 0.845, biceps 0.719, forearm 0.666, thigh 0.862, lower thigh 0.791, calf 0.714, neck 0.675. The residual SD of ln(girth) is roughly the fractional 1-SD scatter. This is the everyday-body baseline: it gives the girths of a soldier of a given height and weight, whose extra weight is mostly fat. It is valid only inside the sample range (weight 39-144 kg, stature 149-199 cm). Do not use it for bodybuilders or superheroes without a build-specific shape adjustment."
  },
  {
   "key": "ansur2_girth_predictor_female",
   "label": "Predict 'average-shape' girths from weight and height, females",
   "status": "derived",
   "values": "{\"chest_A\":13.8073,\"chest_p_weight\":0.5233,\"chest_q_height\":-0.5704,\"waist_omphalion_A\":6.4553,\"waist_omphalion_p_weight\":0.7186,\"waist_omphalion_q_height\":-0.8967,\"biceps_flexed_A\":3.0808,\"biceps_flexed_p_weight\":0.6316,\"biceps_flexed_q_height\":-0.75,\"forearm_flexed_A\":5.8014,\"forearm_flexed_p_weight\":0.3839,\"forearm_flexed_q_height\":-0.2062,\"thigh_upper_A\":7.0837,\"thigh_upper_p_weight\":0.5757,\"thigh_upper_q_height\":-0.5351,\"thigh_lower_A\":5.9085,\"thigh_lower_p_weight\":0.4979,\"thigh_lower_q_height\":-0.3746,\"calf_A\":7.4246,\"calf_p_weight\":0.4112,\"calf_q_height\":-0.239,\"neck_A\":10.2349,\"neck_p_weight\":0.3049,\"neck_q_height\":-0.2322,\"orig\":\"girth_cm = A * weight_kg^p * stature_m^q; residual SD: chest 4.4%; waist_omphalion 5.5%; biceps_flexed 4.5%; forearm_flexed 3.9%; thigh_upper 3.6%; thigh_lower 4.7%; calf 4.5%; neck 3.6%. Check at median H=1.626 m, W=66.8 kg: predicted chest 94.3, waist 85.5, biceps 30.4, forearm 26.3, thigh 61.3, lower thigh 39.9, calf 37.2, neck 32.9 cm vs observed medians 94.0, 85.2, 30.4, 26.3, 61.3, 39.8, 37.2, 32.8 cm\"}",
   "sources": [
    {
     "title": "ANSUR II female CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_FEMALE_Public.csv"
    }
   ],
   "notes": "OLS on logs, n=1986. R2 on the log scale: chest 0.738, waist 0.770, biceps 0.798, forearm 0.683, thigh 0.842, lower thigh 0.710, calf 0.652, neck 0.602. It is valid only inside the sample range (weight 36-120 kg, stature 141-183 cm). Same caveats as the male predictor."
  },
  {
   "key": "ansur2_weight_regression_male",
   "label": "Weight from height + 7 girths (chest, waist, flexed biceps, flexed forearm, thigh, calf, neck), males",
   "status": "derived",
   "values": "{\"loglog_ln_intercept\":-8.4404,\"loglog_ln_stature_cm\":0.98733,\"loglog_ln_chest_cm\":0.41323,\"loglog_ln_waist_omphalion_cm\":0.30609,\"loglog_ln_biceps_flexed_cm\":0.10894,\"loglog_ln_forearm_flexed_cm\":0.12599,\"loglog_ln_thigh_upper_cm\":0.4389,\"loglog_ln_calf_cm\":0.27805,\"loglog_ln_neck_cm\":0.21877,\"loglog_smearing_factor\":1.00018,\"loglog_r2\":0.9868,\"loglog_rmse_kg\":1.634,\"loglog_cv10_rmse_kg\":1.639,\"loglog_rmse_pct\":1.91,\"loglog_resid_p5_kg\":-2.58,\"loglog_resid_p95_kg\":2.66,\"geom_c_chest\":0.000989,\"geom_c_waist_omphalion\":0.000721,\"geom_c_biceps_flexed\":0.001063,\"geom_c_forearm_flexed\":0.004399,\"geom_c_thigh_upper\":0.002765,\"geom_c_calf\":0.004856,\"geom_c_neck\":0.004353,\"geom_r2\":0.9856,\"geom_rmse_kg\":1.703,\"geom_cv10_rmse_kg\":1.708,\"linear_intercept\":-160.09427,\"linear_stature_cm\":0.47827,\"linear_chest_cm\":0.32586,\"linear_waist_omphalion_cm\":0.29795,\"linear_biceps_flexed_cm\":0.25992,\"linear_forearm_flexed_cm\":0.34307,\"linear_thigh_upper_cm\":0.58804,\"linear_calf_cm\":0.60997,\"linear_neck_cm\":0.46436,\"linear_r2\":0.9825,\"linear_rmse_kg\":1.88,\"linear_cv10_rmse_kg\":1.886,\"height_only_r2\":0.2199,\"height_only_rmse_kg\":12.559,\"orig\":\"LOG-LOG: W_kg = 1.00018 * exp(-8.4404) * H_cm^0.9873 * chest^0.4132 * waist^0.3061 * biceps^0.1089 * forearm^0.1260 * thigh^0.4389 * calf^0.2780 * neck^0.2188 (girths cm); R2 0.9868, RMSE 1.634 kg (1.91%), 10-fold CV RMSE 1.639 kg, 90% of residuals in [-2.58, 2.66] kg; sum of girth exponents 1.89 (geometry predicts 2), height exponent 0.987 (geometry predicts 1). GEOMETRIC: W_kg = H_m * sum(c_i * G_i_cm^2), c = {chest: 0.00099, waist_omphalion: 0.00072, biceps_flexed: 0.00106, forearm_flexed: 0.00440, thigh_upper: 0.00276, calf: 0.00486, neck: 0.00435}; R2 0.9856, RMSE 1.703 kg, CV RMSE 1.708 kg. LINEAR: W_kg = -160.094 + 0.4783*H_cm + 0.3259*chest + 0.2980*waist + 0.2599*biceps + 0.3431*forearm + 0.5880*thigh + 0.6100*calf + 0.4644*neck; R2 0.9825, RMSE 1.88 kg, CV RMSE 1.886 kg. Height alone: R2 0.2199, RMSE 12.559 kg.\"}",
   "sources": [
    {
     "title": "ANSUR II male CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    }
   ],
   "notes": "OLS fits, n=4082. 10-fold cross-validated errors are essentially equal to in-sample errors (no overfitting); the geometric form was fit by non-negative least squares. Extrapolation test 1: trained on all but the heaviest 10%, then predicted the heaviest 10%. Mean error (observed - predicted): linear 3.47 kg (RMSE 4.19), log-log 0.82 kg (RMSE 2.29), geometric -0.51 kg (RMSE 2.35). Extrapolation test 2: trained without the 10% biggest flexed arms, then predicted them. Mean error: linear 1.72 kg, log-log 0.04 kg, geometric -0.92 kg. Recommendation: use the log-log or geometric (H x girth^2) form for extreme builds; the linear form under-predicts large bodies. All three were fitted on soldiers whose largest flexed arm was 49.0 cm, so predictions for 55-60 cm arms are extrapolations and should be labelled estimates. Individual coefficients are not interpretable because the girths are strongly collinear (pairwise r 0.53-0.89). Reduced models (log-log): H+chest+waist gives R2 0.9255, RMSE 3.881 kg; H+chest+waist+biceps+thigh+calf gives R2 0.9832, RMSE 1.843 kg. Their coefficients are in fits.json."
  },
  {
   "key": "ansur2_weight_regression_female",
   "label": "Weight from height + 7 girths (chest, waist, flexed biceps, flexed forearm, thigh, calf, neck), females",
   "status": "derived",
   "values": "{\"loglog_ln_intercept\":-8.37056,\"loglog_ln_stature_cm\":0.99109,\"loglog_ln_chest_cm\":0.33931,\"loglog_ln_waist_omphalion_cm\":0.2191,\"loglog_ln_biceps_flexed_cm\":0.15083,\"loglog_ln_forearm_flexed_cm\":0.08197,\"loglog_ln_thigh_upper_cm\":0.50976,\"loglog_ln_calf_cm\":0.34502,\"loglog_ln_neck_cm\":0.2518,\"loglog_smearing_factor\":1.00024,\"loglog_r2\":0.9813,\"loglog_rmse_kg\":1.502,\"loglog_cv10_rmse_kg\":1.509,\"loglog_rmse_pct\":2.19,\"loglog_resid_p5_kg\":-2.4,\"loglog_resid_p95_kg\":2.34,\"geom_c_chest\":0.000843,\"geom_c_waist_omphalion\":0.000511,\"geom_c_biceps_flexed\":0.002367,\"geom_c_forearm_flexed\":0.003555,\"geom_c_thigh_upper\":0.002832,\"geom_c_calf\":0.005472,\"geom_c_neck\":0.006242,\"geom_r2\":0.9804,\"geom_rmse_kg\":1.539,\"geom_cv10_rmse_kg\":1.546,\"linear_intercept\":-128.39031,\"linear_stature_cm\":0.41265,\"linear_chest_cm\":0.24671,\"linear_waist_omphalion_cm\":0.17197,\"linear_biceps_flexed_cm\":0.36305,\"linear_forearm_flexed_cm\":0.17757,\"linear_thigh_upper_cm\":0.55602,\"linear_calf_cm\":0.6294,\"linear_neck_cm\":0.52302,\"linear_r2\":0.9773,\"linear_rmse_kg\":1.656,\"linear_cv10_rmse_kg\":1.664,\"height_only_r2\":0.2846,\"height_only_rmse_kg\":9.289,\"orig\":\"LOG-LOG: W_kg = 1.00024 * exp(-8.3706) * H_cm^0.9911 * chest^0.3393 * waist^0.2191 * biceps^0.1508 * forearm^0.0820 * thigh^0.5098 * calf^0.3450 * neck^0.2518 (girths cm); R2 0.9813, RMSE 1.502 kg (2.19%), 10-fold CV RMSE 1.509 kg, 90% of residuals in [-2.4, 2.34] kg; sum of girth exponents 1.8978 (geometry predicts 2), height exponent 0.991 (geometry predicts 1). GEOMETRIC: W_kg = H_m * sum(c_i * G_i_cm^2), c = {chest: 0.00084, waist_omphalion: 0.00051, biceps_flexed: 0.00237, forearm_flexed: 0.00356, thigh_upper: 0.00283, calf: 0.00547, neck: 0.00624}; R2 0.9804, RMSE 1.539 kg, CV RMSE 1.546 kg. LINEAR: W_kg = -128.390 + 0.4127*H_cm + 0.2467*chest + 0.1720*waist + 0.3631*biceps + 0.1776*forearm + 0.5560*thigh + 0.6294*calf + 0.5230*neck; R2 0.9773, RMSE 1.656 kg, CV RMSE 1.664 kg. Height alone: R2 0.2846, RMSE 9.289 kg.\"}",
   "sources": [
    {
     "title": "ANSUR II female CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_FEMALE_Public.csv"
    }
   ],
   "notes": "OLS fits, n=1986. 10-fold CV errors are essentially equal to in-sample errors. Extrapolation test 1: trained on all but the heaviest 10%, then predicted the heaviest 10%. Mean error (observed - predicted): linear 2.8 kg (RMSE 3.45), log-log 0.7 kg (RMSE 1.97), geometric -0.26 kg (RMSE 1.96). Extrapolation test 2: trained without the 10% biggest flexed arms, then predicted them. Mean error: linear 1.36 kg, log-log -0.06 kg, geometric -0.78 kg. The largest flexed arm in the female sample is 43.5 cm. Reduced models (log-log): H+chest+waist gives R2 0.8608, RMSE 4.097 kg; H+chest+waist+biceps+thigh+calf gives R2 0.9771, RMSE 1.661 kg. Their coefficients are in fits.json."
  },
  {
   "key": "ansur2_volume_model_male",
   "label": "Calibration of a simple frustum (stacked-cone) body-volume model, males",
   "status": "derived",
   "values": "{\"kg_per_model_litre_median\":1.0422,\"kg_per_model_litre_p5\":1.0066,\"kg_per_model_litre_p95\":1.083,\"kg_per_model_litre_sd\":0.0236,\"model_volume_median_m3\":0.081,\"rmse_kg\":1.95,\"corr_ratio_with_bmi\":-0.233,\"share_head_neck\":0.056,\"share_neck_to_chest\":0.131,\"share_chest_to_waist\":0.227,\"share_waist_to_crotch\":0.197,\"share_thigh_x2\":0.189,\"share_shank_x2\":0.091,\"share_upper_arm_x2\":0.073,\"share_forearm_x2\":0.032,\"orig\":\"weight_kg = 1.0422 * V_model_litres; V_model p5/p50/p95 61.2/81.0/107.1 L\"}",
   "sources": [
    {
     "title": "ANSUR II male CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    }
   ],
   "notes": "The model is a stack of circular frustums (truncated cones), each running between two end circumferences over a length. Head+neck: neck to head circumference, over stature minus cervicale height. Upper trunk: neck base to chest, over cervicale height minus chest height. Mid trunk: chest to waist (omphalion). Lower trunk: waist to buttock circumference, over omphalion height minus crotch height. Thigh: upper to lower thigh, over crotch to midpatella. Shank (midpatella to lateral malleolus): 0.85 x lower thigh to calf over the top third, then calf to ankle over the lower two thirds. Upper arm: flexed biceps to flexed forearm, over acromion-radiale. Forearm: flexed forearm to wrist, over radiale-stylion. Hands and feet are omitted. Frustum volume = L/(12*pi)*(C1^2 + C1*C2 + C2^2). The calibration constant (kg per model litre) is NOT body density: it absorbs non-circular cross-sections, the oversized flexed arm girths and the omitted hands and feet. Its spread is small (SD 2.3% M, 2.7% F), so this geometric model predicts weight about as well as the regressions (RMSE about 1.9 kg). Being physical, it scales sensibly to extreme builds. The ratio falls slightly with BMI (corr -0.23), so very fat bodies run a little lighter per model-litre."
  },
  {
   "key": "ansur2_volume_model_female",
   "label": "Calibration of a simple frustum (stacked-cone) body-volume model, females",
   "status": "derived",
   "values": "{\"kg_per_model_litre_median\":1.0444,\"kg_per_model_litre_p5\":0.9999,\"kg_per_model_litre_p95\":1.0901,\"kg_per_model_litre_sd\":0.0279,\"model_volume_median_m3\":0.064,\"rmse_kg\":1.85,\"corr_ratio_with_bmi\":-0.105,\"share_head_neck\":0.059,\"share_neck_to_chest\":0.127,\"share_chest_to_waist\":0.191,\"share_waist_to_crotch\":0.216,\"share_thigh_x2\":0.216,\"share_shank_x2\":0.097,\"share_upper_arm_x2\":0.062,\"share_forearm_x2\":0.027,\"orig\":\"weight_kg = 1.0444 * V_model_litres; V_model p5/p50/p95 48.7/64.0/84.1 L\"}",
   "sources": [
    {
     "title": "ANSUR II female CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_FEMALE_Public.csv"
    }
   ],
   "notes": "Same model as ansur2_volume_model_male; n=1986."
  },
  {
   "key": "ansur2_segments_male",
   "label": "Segment lengths, heights and breadths for a volume model, males",
   "status": "measured",
   "values": "{\"stature_p50_m\":1.755,\"cervicale_height_p50_m\":1.517,\"acromial_height_p50_m\":1.439,\"suprasternale_height_p50_m\":1.437,\"chest_height_p50_m\":1.289,\"waist_height_omphalion_p50_m\":1.055,\"trochanterion_height_p50_m\":0.899,\"crotch_height_p50_m\":0.845,\"knee_height_midpatella_p50_m\":0.487,\"lateral_femoral_epicondyle_height_p50_m\":0.491,\"tibiale_height_p50_m\":0.4675,\"lateral_malleolus_height_p50_m\":0.073,\"sitting_height_p50_m\":0.918,\"span_p50_m\":1.812,\"acromion_radiale_len_upperarm_p50_m\":0.335,\"radiale_stylion_len_forearm_p50_m\":0.267,\"hand_length_p50_m\":0.193,\"foot_length_p50_m\":0.271,\"head_length_p50_m\":0.2,\"head_breadth_p50_m\":0.154,\"biacromial_breadth_p50_m\":0.415,\"bideltoid_breadth_p50_m\":0.509,\"chest_breadth_p50_m\":0.289,\"chest_depth_p50_m\":0.253,\"waist_breadth_p50_m\":0.325,\"waist_depth_p50_m\":0.234,\"hip_breadth_p50_m\":0.344,\"thigh_len_trochanterion_to_lat_femoral_epicondyle_p50_m\":0.408,\"thigh_len_crotch_to_midpatella_p50_m\":0.357,\"shank_len_tibiale_to_lat_malleolus_p50_m\":0.3945,\"head_neck_len_stature_minus_cervicale_p50_m\":0.239,\"trunk_len_suprasternale_to_crotch_p50_m\":0.593,\"chest_breadth_over_depth_median\":1.1412,\"waist_breadth_over_depth_median\":1.3868,\"orig\":\"cm p5/p50/p95 (median ratio to stature): stature 164.8/175.5/187.0 (1.000); cervicale_height 141.6/151.7/162.3 (0.864); acromial_height 133.9/143.9/154.6 (0.821); suprasternale_height 134.1/143.7/154.0 (0.819); chest_height 120.0/128.9/138.7 (0.735); waist_height_omphalion 97.2/105.5/114.5 (0.602); trochanterion_height 82.4/89.9/98.5 (0.512); crotch_height 77.1/84.5/92.5 (0.481); knee_height_midpatella 44.3/48.7/53.6 (0.278); lateral_femoral_epicondyle_height 44.9/49.1/53.7 (0.280); tibiale_height 42.6/46.8/51.3 (0.266); lateral_malleolus_height 6.4/7.3/8.3 (0.042); sitting_height 86.0/91.8/97.7 (0.524); span 168.0/181.2/195.7 (1.031); acromion_radiale_len_upperarm 30.7/33.5/36.5 (0.191); radiale_stylion_len_forearm 24.4/26.7/29.5 (0.152); hand_length 17.7/19.3/21.0 (0.110); foot_length 25.0/27.1/29.3 (0.154); head_length 18.8/20.0/21.1 (0.114); head_breadth 14.6/15.4/16.3 (0.088); biacromial_breadth 38.4/41.5/44.7 (0.236); bideltoid_breadth 45.9/50.9/56.7 (0.290); chest_breadth 26.1/28.9/32.0 (0.165); chest_depth 21.1/25.3/29.8 (0.144); waist_breadth 27.2/32.5/38.5 (0.186); waist_depth 18.8/23.4/30.0 (0.134); hip_breadth 30.8/34.4/38.7 (0.196); thigh_len_trochanterion_to_lat_femoral_epicondyle 36.4/40.8/45.8 (0.233); thigh_len_crotch_to_midpatella 31.8/35.7/39.8 (0.204); shank_len_tibiale_to_lat_malleolus 35.7/39.5/43.7 (0.225); head_neck_len_stature_minus_cervicale 21.8/23.9/26.0 (0.136); trunk_len_suprasternale_to_crotch 54.2/59.3/64.5 (0.338)\"}",
   "sources": [
    {
     "title": "ANSUR II male CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    },
    {
     "title": "Hotzman et al. 2011, NATICK/TR-11/017 (Measurer's Handbook)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSURII-TR11-017.pdf"
    }
   ],
   "notes": "All values are direct measurements except the derived lengths and the breadth/depth ratios. Derived lengths: thigh = trochanterion height - lateral femoral epicondyle height, or crotch height - knee height midpatella; shank = tibiale height - lateral malleolus height; head+neck = stature - cervicale height; trunk = suprasternale height - crotch height. Chest and waist cross-sections are wider than deep, so use an ellipse, not a circle, when building cross-sections from breadths. Heights are standing landmark heights above the floor. The ratios to stature let a calculator rescale to any height, assuming the same proportions."
  },
  {
   "key": "ansur2_segments_female",
   "label": "Segment lengths, heights and breadths for a volume model, females",
   "status": "measured",
   "values": "{\"stature_p50_m\":1.626,\"cervicale_height_p50_m\":1.393,\"acromial_height_p50_m\":1.332,\"suprasternale_height_p50_m\":1.3265,\"chest_height_p50_m\":1.169,\"waist_height_omphalion_p50_m\":0.9775,\"trochanterion_height_p50_m\":0.844,\"crotch_height_p50_m\":0.78,\"knee_height_midpatella_p50_m\":0.448,\"lateral_femoral_epicondyle_height_p50_m\":0.465,\"tibiale_height_p50_m\":0.437,\"lateral_malleolus_height_p50_m\":0.063,\"sitting_height_p50_m\":0.857,\"span_p50_m\":1.657,\"acromion_radiale_len_upperarm_p50_m\":0.311,\"radiale_stylion_len_forearm_p50_m\":0.2405,\"hand_length_p50_m\":0.18,\"foot_length_p50_m\":0.246,\"head_length_p50_m\":0.19,\"head_breadth_p50_m\":0.147,\"biacromial_breadth_p50_m\":0.365,\"bideltoid_breadth_p50_m\":0.45,\"chest_breadth_p50_m\":0.268,\"chest_depth_p50_m\":0.245,\"waist_breadth_p50_m\":0.298,\"waist_depth_p50_m\":0.209,\"hip_breadth_p50_m\":0.353,\"thigh_len_trochanterion_to_lat_femoral_epicondyle_p50_m\":0.379,\"thigh_len_crotch_to_midpatella_p50_m\":0.333,\"shank_len_tibiale_to_lat_malleolus_p50_m\":0.374,\"head_neck_len_stature_minus_cervicale_p50_m\":0.232,\"trunk_len_suprasternale_to_crotch_p50_m\":0.547,\"chest_breadth_over_depth_median\":1.0922,\"waist_breadth_over_depth_median\":1.4188,\"orig\":\"cm p5/p50/p95 (median ratio to stature): stature 152.5/162.6/174.0 (1.000); cervicale_height 130.0/139.3/149.8 (0.857); acromial_height 124.2/133.2/143.4 (0.820); suprasternale_height 123.6/132.7/142.8 (0.817); chest_height 108.0/116.9/126.6 (0.719); waist_height_omphalion 90.0/97.8/106.4 (0.602); trochanterion_height 77.4/84.4/91.9 (0.519); crotch_height 71.2/78.0/85.7 (0.480); knee_height_midpatella 40.8/44.8/49.3 (0.275); lateral_femoral_epicondyle_height 42.2/46.5/51.1 (0.286); tibiale_height 39.9/43.7/47.9 (0.269); lateral_malleolus_height 5.4/6.3/7.1 (0.039); sitting_height 80.3/85.7/91.2 (0.527); span 152.9/165.7/180.3 (1.018); acromion_radiale_len_upperarm 28.3/31.1/34.0 (0.191); radiale_stylion_len_forearm 21.8/24.1/26.8 (0.148); hand_length 16.5/18.0/19.9 (0.111); foot_length 22.6/24.6/26.8 (0.151); head_length 17.8/19.0/20.2 (0.117); head_breadth 14.0/14.7/15.6 (0.091); biacromial_breadth 33.5/36.5/39.6 (0.225); bideltoid_breadth 40.6/45.0/49.9 (0.276); chest_breadth 24.1/26.8/30.2 (0.165); chest_depth 20.5/24.5/29.6 (0.151); waist_breadth 25.0/29.8/35.6 (0.183); waist_depth 16.9/20.9/27.1 (0.128); hip_breadth 31.1/35.3/40.0 (0.217); thigh_len_trochanterion_to_lat_femoral_epicondyle 34.0/37.9/41.8 (0.233); thigh_len_crotch_to_midpatella 29.7/33.3/37.1 (0.205); shank_len_tibiale_to_lat_malleolus 33.8/37.4/41.5 (0.230); head_neck_len_stature_minus_cervicale 21.4/23.2/25.3 (0.143); trunk_len_suprasternale_to_crotch 50.1/54.7/59.3 (0.336)\"}",
   "sources": [
    {
     "title": "ANSUR II female CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_FEMALE_Public.csv"
    },
    {
     "title": "Hotzman et al. 2011, NATICK/TR-11/017 (Measurer's Handbook)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSURII-TR11-017.pdf"
    }
   ],
   "notes": "Same derivations as ansur2_segments_male."
  },
  {
   "key": "ansur2_male_subgroups",
   "label": "ANSUR II male subgroups: lean-but-heavy vs big-waist vs normal BMI (medians)",
   "status": "derived",
   "values": "{\"leanheavy_n\":39,\"leanheavy_weight_kg\":92.1,\"leanheavy_stature_m\":1.759,\"leanheavy_chest_m\":1.151,\"leanheavy_waist_omphalion_m\":0.93,\"leanheavy_biceps_flexed_m\":0.407,\"leanheavy_thigh_upper_m\":0.655,\"leanheavy_calf_m\":0.403,\"bigwaist_n\":589,\"bigwaist_weight_kg\":102.4,\"bigwaist_stature_m\":1.747,\"bigwaist_chest_m\":1.17,\"bigwaist_waist_omphalion_m\":1.103,\"bigwaist_biceps_flexed_m\":0.389,\"bigwaist_thigh_upper_m\":0.692,\"bigwaist_calf_m\":0.423,\"normalbmi_n\":1061,\"normalbmi_weight_kg\":70.7,\"normalbmi_stature_m\":1.758,\"normalbmi_chest_m\":0.963,\"normalbmi_waist_omphalion_m\":0.818,\"normalbmi_biceps_flexed_m\":0.324,\"normalbmi_thigh_upper_m\":0.563,\"normalbmi_calf_m\":0.364,\"orig\":\"leanheavy [BMI>=28 and chest-waist>=20 cm] n=39 medians: stature 175.9 cm, weight 92.1 kg, BMI 29.5, chest 115.1, waist 93.0, biceps 40.7, forearm 33.9, thigh 65.5, lower thigh 42.3, calf 40.3, neck 41.1 cm; k = chest 15.767, waist 12.702, biceps 5.52, forearm 4.607, thigh 8.973, lower thigh 5.711, calf 5.57, neck 5.643 || bigwaist [BMI>=30 and waist/height>=0.60] n=589 medians: stature 174.7, weight 102.4, BMI 33.5, chest 117.0, waist 110.3, biceps 38.9, forearm 32.7, thigh 69.2, lower thigh 44.3, calf 42.3, neck 42.6; k = chest 15.255, waist 14.426, biceps 5.088, forearm 4.279, thigh 9.047, lower thigh 5.779, calf 5.501, neck 5.562 || normalbmi [BMI 18.5-25] n=1061 medians: stature 175.8, weight 70.7, BMI 23.2, chest 96.3, waist 81.8, biceps 32.4, forearm 29.0, thigh 56.3, lower thigh 37.7, calf 36.4, neck 37.3; k = chest 15.179, waist 12.886, biceps 5.082, forearm 4.562, thigh 8.838, lower thigh 5.942, calf 5.734, neck 5.89\"}",
   "sources": [
    {
     "title": "ANSUR II male CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    }
   ],
   "notes": "Subgroups I selected from the CSV; the rules are in orig. 'leanheavy' = high BMI with a chest far larger than the navel waist, the most athletic shape available in ANSUR II. Its n is small and it is NOT a bodybuilder sample. Compare the shape constants k = girth/sqrt(W/H): the lean-heavy group has higher chest k (15.77 vs 15.26), higher biceps k (5.52 vs 5.09) and lower waist k (12.70 vs 14.43) than the big-waist group. That is the direction a muscular build shifts the girths."
  },
  {
   "key": "ansur2_male_largest_arms",
   "label": "Ceiling of the data: largest flexed arms in ANSUR II, males",
   "status": "measured",
   "values": "{\"top_biceps_flexed_m\":0.49,\"top_weight_kg\":113.9,\"top_stature_m\":1.745,\"orig\":\"3 largest flexed arms (cm, kg): #1 stature 174.5, weight 113.9, BMI 37.4, biceps 49.0, chest 123.2, waist 104.4, forearm 40.2, thigh 73.2, calf 46.1, neck 45.3; #2 stature 190.5, weight 126.2, BMI 34.8, biceps 47.8, chest 124.2, waist 121.1, forearm 35.3, thigh 75.6, calf 44.3, neck 45.0; #3 stature 189.0, weight 114.4, BMI 32.0, biceps 47.7, chest 119.4, waist 101.3, forearm 37.6, thigh 70.0, calf 47.5, neck 42.5\"}",
   "sources": [
    {
     "title": "ANSUR II male CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    }
   ],
   "notes": "Individual anonymous rows of the public database. They mark the edge of the data: the regressions and predictors are not validated beyond these sizes."
  },
  {
   "key": "ansur2_female_subgroups",
   "label": "ANSUR II female subgroups: lean-but-heavy vs big-waist vs normal BMI (medians)",
   "status": "derived",
   "values": "{\"leanheavy_n\":70,\"leanheavy_weight_kg\":76.7,\"leanheavy_stature_m\":1.644,\"leanheavy_chest_m\":1.053,\"leanheavy_waist_omphalion_m\":0.87,\"leanheavy_biceps_flexed_m\":0.326,\"leanheavy_thigh_upper_m\":0.65,\"leanheavy_calf_m\":0.391,\"bigwaist_n\":133,\"bigwaist_weight_kg\":85.2,\"bigwaist_stature_m\":1.626,\"bigwaist_chest_m\":1.09,\"bigwaist_waist_omphalion_m\":1.055,\"bigwaist_biceps_flexed_m\":0.36,\"bigwaist_thigh_upper_m\":0.702,\"bigwaist_calf_m\":0.409,\"normalbmi_n\":936,\"normalbmi_weight_kg\":60.1,\"normalbmi_stature_m\":1.626,\"normalbmi_chest_m\":0.892,\"normalbmi_waist_omphalion_m\":0.79,\"normalbmi_biceps_flexed_m\":0.285,\"normalbmi_thigh_upper_m\":0.58,\"normalbmi_calf_m\":0.357,\"orig\":\"leanheavy [BMI>=26 and chest-waist>=15 cm] n=70 medians: stature 164.4 cm, weight 76.7 kg, BMI 28.3, chest 105.3, waist 87.0, biceps 32.6, forearm 27.5, thigh 65.0, lower thigh 41.9, calf 39.1, neck 34.2 cm; k = chest 15.528, waist 12.941, biceps 4.787, forearm 4.039, thigh 9.537, lower thigh 6.239, calf 5.759, neck 5.004 || bigwaist [BMI>=30 and waist/height>=0.60] n=133 medians: stature 162.6, weight 85.2, BMI 32.6, chest 109.0, waist 105.5, biceps 36.0, forearm 28.9, thigh 70.2, lower thigh 44.8, calf 40.9, neck 35.5; k = chest 14.992, waist 14.514, biceps 4.929, forearm 3.995, thigh 9.653, lower thigh 6.217, calf 5.617, neck 4.902 || normalbmi [BMI 18.5-25] n=936 medians: stature 162.6, weight 60.1, BMI 22.9, chest 89.2, waist 79.0, biceps 28.5, forearm 25.3, thigh 58.0, lower thigh 38.0, calf 35.7, neck 31.8; k = chest 14.653, waist 12.974, biceps 4.69, forearm 4.164, thigh 9.487, lower thigh 6.246, calf 5.876, neck 5.248\"}",
   "sources": [
    {
     "title": "ANSUR II female CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_FEMALE_Public.csv"
    }
   ],
   "notes": "Subgroups I selected from the CSV; the rules are in orig. Women's chest includes the bust, so the chest-minus-waist rule partly selects for bust size, not muscle. The lean-heavy group has higher chest k and lower waist k than the big-waist group, but unlike in men its biceps k is not higher (4.79 vs 4.93). Small n; NOT an athlete sample."
  },
  {
   "key": "ansur2_female_largest_arms",
   "label": "Ceiling of the data: largest flexed arms in ANSUR II, females",
   "status": "measured",
   "values": "{\"top_biceps_flexed_m\":0.435,\"top_weight_kg\":119.6,\"top_stature_m\":1.72,\"orig\":\"3 largest flexed arms (cm, kg): #1 stature 172.0, weight 119.6, BMI 40.4, biceps 43.5, chest 116.1, waist 133.4, forearm 31.1, thigh 87.0, calf 48.2, neck 37.8; #2 stature 164.7, weight 99.5, BMI 36.7, biceps 42.4, chest 107.1, waist 109.3, forearm 31.6, thigh 78.2, calf 45.2, neck 35.6; #3 stature 165.6, weight 100.0, BMI 36.5, biceps 41.5, chest 115.0, waist 116.4, forearm 31.5, thigh 78.2, calf 47.1, neck 34.2\"}",
   "sources": [
    {
     "title": "ANSUR II female CSV (OPEN Design Lab)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_FEMALE_Public.csv"
    }
   ],
   "notes": "Individual anonymous rows of the public database. The largest female arms belong to high-BMI women, not to muscular ones. These rows mark the edge of the data."
  }
 ],
 "gaps": "1. Natural (narrowest) waist was not measured in ANSUR II. Only navel-level (omphalion) waist exists, so any tape number taken at the natural waist will run smaller and should not be compared directly. I did not derive a conversion between the two.\n2. Arm girths exist only flexed (maximal 'make a muscle', and forearm flexed at the elbow crease). There is no relaxed upper-arm or relaxed forearm girth in the public file. The 'mid-thigh' girth used in bodybuilding is not measured either; ANSUR has the gluteal-furrow (top) thigh and a just-above-the-knee lower thigh.\n3. The public file has no body-composition data (no body-fat % or DXA), so the fits cannot separate fat from muscle. The girth-scaling exponents and the girth predictor describe how soldiers differ, which is mostly fat. They are not a model of muscle gain.\n4. The population is US Army soldiers aged 17-58 (2010-2012). They are leaner and younger than the general US population, so a sample like NHANES would be a better 'average man/woman' baseline. I did not fetch NHANES; that is outside this topic.\n5. The data ceiling is a flexed arm of 49.0 cm (men) / 43.5 cm (women), chest 146.9 / 126.6 cm and weight 144.2 / 119.6 kg. Applying any regression to bodybuilders or comic characters beyond these sizes is extrapolation. The extrapolation tests here favour the log-log and geometric forms, but they only test within-sample tails. They have not been validated against measured bodybuilders.\n6. The 'lean-but-heavy' subgroups are my own selection rules with small n (39 men, 70 women). They are not an athlete sample.\n7. The frustum volume model and its calibration constant (about 1.04 kg per model-litre) are my construction, not a published model. The constant is not body density.\n8. The handbook says calf was read 3 times near the maximum. The public file has one value per subject, and the documents I read do not say whether it is the maximum or the mean.\n9. The http:// download links on the OPEN Lab page now serve an HTML shell; https:// works. I used the OPEN Lab mirrors of the TR PDFs rather than DTIC copies.\n10. Percentiles are numpy linear-interpolated and agree with the TR tables to within 0.1 cm, except female weight p95 (87.08 vs 87.10 kg).\n11. The 3D body scans are not public, so cross-section shapes beyond breadth/depth ratios are unknown."
}
```

</details>

<details>
<summary>Subagent `verify:muscle` (build-calc-research, 2026-10-10 02:16:54 UTC): Mostly accurate. I re-fetched about 45 of the cited URLs: 12 Europe PMC abstracts, the Balshaw and Chappell full texts, the de Moraes table and full text, the Helms PDF, the McDonald page, the MuscleMemory table, 15 The Barbell/FLEX reports, 2 Iron Man pages, Guinness, 4 Olympedia pages, the Tokyo 2020 profile, the ... Returned checks: 40 (e.g. kouri1995_ffmi_natural_limit; kouri1995_group_means).</summary>

Workflow run `wf_16409832-67f`, phase `Verify`, agent `a298526fbb4e4c04b`. Prompt, verbatim:

```text
Project: a small web calculator. The user picks a BUILD (average man or woman, athlete, record bodybuilder, strongman, comic-book character, or two original characters) and a HEIGHT, and the page shows estimated body WEIGHT and GIRTHS: chest, waist, upper arm (flexed), forearm, thigh, calf and neck. Every number must be sourced or clearly labelled as an estimate. The owner values factual accuracy over flattery: say "unknown" rather than invent, and label magazine-reported or fan-wiki numbers as such.
Write raw downloads and scripts under /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/buildcalc/<topic>/ (create it). Do not edit anything under /home/user. Use WebSearch/WebFetch for sources; prefer primary sources (journals, official databases, publisher handbooks) over wikis. For each fact give: key, label, value(s) with units (SI and the original units), status (measured | official | reported | derived | estimate | disputed), sources (title + URL actually fetched), and notes (what exactly the source says, caveats).

You are a skeptical fact-checker for the topic "muscle". Below are the researcher's facts. Re-fetch at least 10 of the cited URLs (prioritise the numbers the calculator will lean on most) and check each value and status against what the source actually says; recompute any derived statistics you can (for ANSUR data, re-download and recompute a few percentiles). Mark ok=false with a correction for anything wrong, mislabelled (e.g. a fan wiki marked official), or unsupported. List important missing items.

FACTS:
{
 "summary": "Topic covered: record bodybuilders and strongmen (12 athletes plus a pre-steroid reference) and the peer-reviewed data on bodybuilder body composition and girths. Raw downloads are in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/buildcalc/bodybuilders/dl/. The full fact set is at .../bodybuilders/facts.json, and derived FFMIs are at .../bodybuilders/derived_ffmi.txt. Scripts are in .../buildcalc/scripts/ (build_bb_facts.py, ffmi_bb.py, epmc.py, txt.py).\n\nKey findings:\n\n(1) Kouri et al. 1995. Abstract, verbatim: 157 male athletes (83 steroid users, 74 non-users). Normalized FFMI of non-users 'extended up to a well-defined limit of 25.0'. 20 pre-steroid Mr America winners (1939-1959) had a mean of 25.4. Some users exceeded 30. The authors called the findings preliminary. The abstract gives the height correction as 6.3 x (1.80 - h), but the common formula and McDonald's reading use 6.1, so I marked it disputed. The difference is negligible (<0.1 unit).\n\n(2) Peer-reviewed group data:\n- Graybeal 2020: male bodybuilders, 4-compartment FFMI 25.1 +/- 1.8 at 11.8% fat.\n- Withers 1997: 3 elite bodybuilders, FFM 88 kg at 92.8 kg and 5% fat.\n- McInnis 1999: 99 kg, 1.80 m, 8% fat, FFM 91 kg.\n- Kraemer 2020: 18 elite strongmen by DXA, 1.874 m, 152.9 kg, lean 118 kg, 18.7% fat.\n- Balshaw 2024: lab-measured World's Strongest Man, identifiable as Eddie Hall, 1.90 m and 172.0 kg. MRI leg-muscle volume about 2x untrained controls.\n- Girth surveys: de Moraes 2019 (Brazilian national competitors on contest day: arm about 42.5 cm, chest 112 cm, waist 78-79 cm, thigh 64-65 cm, calf 40-41 cm), Bamman 1993 (contest prep cuts the waist by 6.9 cm and leaves the chest unchanged), Sukwong 2022 and Fry 1991.\n- Natural athletes: Chappell 2019 (WNBF/DFAC pros, self-reported 1.77 m, about 82 kg on stage, FFMI about 25 if 5% fat), Mitchell 2018, and Rossow 2013 (IFPA pro case study, 4.5% fat; FFMI 24.9 per Helms's secondary reading).\n- Bauer 2023 review: male near-contest body fat 5.8-10.7%.\n\n(3) Pre-steroid girth reference: the 1956 Mr USA program table of Mr America winners at the time of their wins (neck, arm, forearm, chest, waist, thigh, calf, wrist, ankle). Arms were about 15.5-18 in and calves 15-17.5 in.\n\n(4) Athletes. Contest weights come mostly from FLEX and Iron Man contest reports (republished by The Barbell / Greg Merritt), which are better than profile sites:\n- Coleman: 249 lb (1998), 286 (2003), 296 (2004, his heaviest contest weight), 275 (2005). His own figure for his biggest off-season weight is 330 lb.\n- Yates: 242 lb (1992) and 257 lb (1993; Guinness gives 116.57 kg).\n- Cutler: 255 (1999), 273 (2004), 271 (2009), 260 (2010).\n- Heath: 227 (2009), 245 (2010), 248 (2011).\n- Elssbiay: 285 (2014), about 305-310 (2015). Self-reported off-season 341 lb (155 kg) in Jan 2022.\n- Arnold: 246 lb (1971), 235 (1975). His book lists 22/57/34/28.5/20 in at 235 lb and 6'2\".\n- Oliva: about 225 lb (1967), about 240 (1972).\n- Shaw: 174.5 kg at 17.6% fat (hydrostatic, Feb 2024).\n- Bjornsson: 152 kg at the 2022 boxing weigh-in; 200 kg self-reported in 2025; heaviest 210 kg in 2012.\n- Talakhadze: official Olympic weigh-ins of 157.34 kg (Rio), 177.00 kg (Tokyo) and 178.45 kg (Paris). Height 1.95 m (Tokyo official) vs 1.97 m elsewhere.\n\nGirths for the bodybuilders come only from fan or profile sites (GreatestPhysiques, FitnessVolt), conflict with each other and carry no measurement method, so they are marked disputed or reported. Derived stage FFMIs at an assumed 5% fat: Arnold 29-30, Oliva about 31, Yates about 35, Heath about 35, Cutler about 38, Coleman 38-39, Elssbiay 41-43. All are far above the natural limit of about 25.",
 "gaps": "- Kouri 1995 full text was not accessible. The group means and SDs, the Mr America table (max 28.0; SD 1.5), the 5% body-fat assumption for the Mr America winners, and the 6.1 vs 6.3 constant come only from secondary sources (Helms in AARR 2014, Lyle McDonald).\n- Paywalled girth numbers I could not read: Katch 1980 (bodybuilder arm, chest, forearm and shoulder girths), Huygens 2002 (Belgian bodybuilders' arm and thigh girths), Borms 1986 (world-class bodybuilders' somatotypes/girths) and the SciELO Brazilian elite study (HTTP 403).\n- Rossow 2013: no height or absolute mass. The FFMI 24.9 and the 16 kg loss are from Helms.\n- The Wayback Machine (archive.org) was blocked (429 / fetch refused). So I could not see:\n  - the old Bodybuilding.com pro profiles that Wikipedia cites for the Arnold, Coleman and Cutler stats;\n  - the archived World's Strongest Man athlete profiles (Shaw 6'8\", Bjornsson 205 cm). The current theworldsstrongestman.com athlete pages return 404.\n- Blocked or unreadable pages: the IWF 2021 results-book PDF (403) and the musclememory.org scans of the 1947 Muscle Power and Iron Man pages (script-rendered). The Muscle Power figures for Reeves are therefore unverified.\n- UNKNOWN (no credible source found): any girths for Big Ramy, Hafthor Bjornsson, Eddie Hall (MRI leg volumes only), Brian Shaw (only contradictory SEO pages) and Lasha Talakhadze.\n- Neck girth was not found for any modern pro. Forearm appears only in the Mr America table and the group studies.\n- Phil Heath's girths rest on a single fan site.\n- Stage weights not found in a fetchable source: Big Ramy at the 2020 and 2021 Olympias (a BarBend 'just under 300 lb' item was in search results only; that URL returned 410), and Arnold, Oliva and Yates off-season weights by year.\n- Heights disputed or unverified: Brian Shaw's 6'6.75\" (from a YouTube short I did not watch; cited via Wikipedia); Arnold 6'1.5\"-6'2\" (6'3\" on one site); Elssbiay 5'9\"-5'11\"; Cutler and Yates 5'9\"-5'10\".\n- Bjornsson's 205 kg at the Sept 2025 World Deadlift Championships appears only in a Wikipedia note; not verified.\n- Natural bodybuilder: I found no individually named drug-tested champion with both height and stage weight from a reliable source. Malcolm Cooper (2023 WNBF Pro Universe) has 174 lb stage weight but no height. Use the Chappell 2019 PRO group or the Rossow case instead.\n- Body-fat percentages for the pro bodybuilders are assumptions (5-6%), so all their FFMIs are derived estimates.\n- Talakhadze body fat is unknown, so no FFMI is given for him.\n- Eddie Hall body fat is unknown, so no FFMI is given for him.",
 "facts": [
  {
   "key": "kouri1995_ffmi_natural_limit",
   "label": "Kouri et al. 1995: FFMI of steroid users vs non-users; natural ceiling ~25",
   "status": "measured",
   "values": "{\"n_total\": 157, \"n_steroid_users\": 83, \"n_nonusers\": 74, \"nonuser_normalized_FFMI_upper_limit_kg_m2\": 25.0, \"mr_america_presteroid_n\": 20, \"mr_america_years\": \"1939-1959\", \"mr_america_mean_normalized_FFMI_kg_m2\": 25.4, \"users_some_exceeded_kg_m2\": 30, \"FFMI_definition\": \"FFM_kg / height_m^2\", \"normalization_in_abstract\": \"FFMI + 6.3*(1.80 - height_m)\"}",
   "sources": [
    {
     "title": "Kouri EM, Pope HG, Katz DL, Oliva P. Fat-free mass index in users and nonusers of anabolic-androgenic steroids. Clin J Sport Med 1995;5:223-228 (Europe PMC abstract record, PMID 7496846)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:7496846%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "McDonald L. Another Look at the Fat-Free Mass Index (FFMI), BodyRecomposition.com (secondary summary of Kouri 1995 full text)",
     "url": "https://bodyrecomposition.com/muscle-gain/another-look-at-the-ffmi"
    },
    {
     "title": "Helms E. 'Weighing the evidence: Kouri et al., 1995', Alan Aragon's Research Review, Aug 2014 (PDF)",
     "url": "https://www.alanaragon.com/wp-content/uploads/2016/08/Helms-Aug-2014-AARR.pdf"
    }
   ],
   "notes": "Abstract (verbatim): 'We calculated fat-free mass index (FFMI) in a sample of 157 male athletes, comprising 83 users of anabolic-androgenic steroids and 74 nonusers... We then added a slight correction of 6.3 x (1.80 m - height) to normalize these values to the height of a 1.8-m man. The normalized FFMI values of athletes who had not used steroids extended up to a well-defined limit of 25.0. Similarly, a sample of 20 Mr. America winners from the presteroid era (1939-1959)... had a mean FFMI of 25.4. By contrast, the FFMI of many of the steroid users in our sample easily exceeded 25.0, and that of some even exceeded 30.' The authors called the findings 'preliminary'. Body fat was by skinfolds; steroid status by interview plus urine test. Paper notes the formula 'may not be satisfactory for fat individuals' (only 6 nonusers had >20% fat; quoted by McDonald). Many users were BELOW 25; the finding is that no nonuser exceeded it, not that every user does."
  },
  {
   "key": "kouri1995_group_means",
   "label": "Kouri 1995 group means (from secondary summaries of the full paper's tables)",
   "status": "reported",
   "values": "{\"users_mean_FFMI_approx\": 25, \"nonusers_mean_FFMI_approx\": 22, \"both_groups_height_m_approx\": 1.8, \"both_groups_bodyfat_pct_approx\": 13, \"users_mean_mass_kg_approx\": 92, \"nonusers_mean_mass_kg_approx\": 82, \"overall_bodyfat_pct\": 12.8, \"overall_bodyfat_sd\": 4.8, \"users_lean_mass_lb\": 175, \"users_lean_mass_kg\": 79.4, \"nonusers_lean_mass_lb\": 158, \"nonusers_lean_mass_kg\": 71.7, \"mr_america_FFMI_sd\": 1.5, \"mr_america_n_above_27\": 3, \"mr_america_max_FFMI\": 28.0, \"mr_america_1939_1944_mean\": 24.9, \"mr_america_1939_1944_max\": 27.3, \"mr_america_1939_1953_mean\": 25.6, \"mr_america_1939_1953_max\": 28.0, \"mr_america_FFMI_trend_per_yr\": 0.044, \"trend_p\": 0.44}",
   "sources": [
    {
     "title": "Helms E. 'Weighing the evidence: Kouri et al., 1995', Alan Aragon's Research Review, Aug 2014 (PDF)",
     "url": "https://www.alanaragon.com/wp-content/uploads/2016/08/Helms-Aug-2014-AARR.pdf"
    },
    {
     "title": "McDonald L. Another Look at the Fat-Free Mass Index (FFMI), BodyRecomposition.com (secondary summary of Kouri 1995 full text)",
     "url": "https://bodyrecomposition.com/muscle-gain/another-look-at-the-ffmi"
    }
   ],
   "notes": "I could not access the full Kouri paper; these numbers are as quoted by Eric Helms (AARR Aug 2014: users ~25 vs non-users ~22, ~1.8 m, ~13% fat, ~92 vs ~82 kg; Mr America mean 25.4, highest 28; 1939-44 mean 24.9 max 27.3; 1939-53 mean 25.6 max 28.0; slope 0.044 FFMI units/yr, p=0.44) and Lyle McDonald (mean body fat 12.8 +/- 4.8%; lean mass ~175 lb users vs ~158 lb nonusers; Mr America mean 25.4 +/- 1.5 with 3 above 27.0; says Mr America FFMIs were computed from reported heights/weights assuming 5% body fat). McDonald also says only 134 of 156 gym recruits had full data, plus 23 from a testosterone study. Treat these as secondary."
  },
  {
   "key": "kouri1995_normalization_constant",
   "label": "Kouri normalized-FFMI height correction constant: 6.3 vs 6.1",
   "status": "disputed",
   "values": "{\"constant_in_PubMed_abstract\": 6.3, \"constant_quoted_by_McDonald_and_common_use\": 6.1, \"formula\": \"FFMI_norm = FFM/h^2 + k*(1.80 - h)\"}",
   "sources": [
    {
     "title": "Kouri EM, Pope HG, Katz DL, Oliva P. Fat-free mass index in users and nonusers of anabolic-androgenic steroids. Clin J Sport Med 1995;5:223-228 (Europe PMC abstract record, PMID 7496846)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:7496846%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "McDonald L. Another Look at the Fat-Free Mass Index (FFMI), BodyRecomposition.com (secondary summary of Kouri 1995 full text)",
     "url": "https://bodyrecomposition.com/muscle-gain/another-look-at-the-ffmi"
    }
   ],
   "notes": "The Europe PMC/PubMed abstract says '6.3 x (1.80 m - height)'. McDonald's write-up of the paper (and most online FFMI calculators) use 6.1. I could not see the paper body to resolve it. Practical effect is tiny (<0.1 FFMI unit for heights 1.65-2.05 m)."
  },
  {
   "key": "graybeal2020_bodybuilders_4C",
   "label": "Graybeal et al. 2020: 4-compartment FFMI of competitive bodybuilders",
   "status": "measured",
   "values": "{\"male_n\": 17, \"male_FFMI_kg_m2_mean\": 25.1, \"male_FFMI_sd\": 1.8, \"male_bodyfat_pct_mean\": 11.8, \"male_bodyfat_sd\": 4.4, \"female_n\": 10, \"female_FFMI_kg_m2_mean\": 18.3, \"female_FFMI_sd\": 1.4, \"female_bodyfat_pct_mean\": 19.7, \"female_bodyfat_sd\": 4.9}",
   "sources": [
    {
     "title": "Graybeal AJ, Moore ML, Cruz MR, Tinsley GM. Body composition assessment in male and female bodybuilders: a 4-compartment model comparison... J Strength Cond Res 2020;34(6):1676-1689 (PMID 30161092)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:30161092%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Abstract: 'Twenty-seven male (n = 17; 4-compartment [4C] model fat-free mass index [FFMI]: 25.1 +/- 1.8 kg/m2; 4C body fat: 11.8 +/- 4.4%) and female (n = 10; 4C FFMI: 18.3 +/- 1.4 kg/m2; 4C body fat: 19.7 +/- 4.9%) bodybuilders'. Competition level and drug status not stated in the abstract. Also concludes single-method body-comp (DXA, BIA) has individual errors large enough to be questionable in muscular physique athletes."
  },
  {
   "key": "withers1997_elite_bb_4C",
   "label": "Withers et al. 1997: 3 elite male bodybuilders, 4-compartment body composition 10 wk and 5 d pre-contest",
   "status": "measured",
   "values": "{\"n\": 3, \"mass_10wk_kg\": 99.7, \"mass_5d_kg\": 92.79, \"BMI_10wk\": 31.6, \"BMI_5d\": 29.2, \"FFM_10wk_kg\": 90.6, \"FFM_5d_kg\": 88.14, \"bodyfat_10wk_pct\": 9.1, \"bodyfat_5d_pct\": 5.0, \"fat_mass_10wk_kg\": 9.1, \"fat_mass_5d_kg\": 4.65, \"implied_height_m_derived\": 1.776, \"implied_FFMI_5d_derived\": 27.9}",
   "sources": [
    {
     "title": "Withers RT et al. Body composition changes in elite male bodybuilders during preparation for competition. Aust J Sci Med Sport 1997;29(1):11-16 (PMID 9127683)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:9127683%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Abstract gives mass, Quetelet index, FFM, %fat (4C: deuterium dilution + DXA + hydrodensitometry). Height is not in the abstract; 1.776 m is derived from mass/BMI, and FFMI 27.9 is derived from that (my calculation). 64% of the 6.91 kg loss was fat. Drug status not stated."
  },
  {
   "key": "mcinnis1999_bodybuilders",
   "label": "McInnis & Balady 1999: 14 male bodybuilders vs weight-matched men",
   "status": "measured",
   "values": "{\"n\": 14, \"mass_kg\": 99, \"mass_sd\": 7, \"height_m\": 1.8, \"height_sd_m\": 0.08, \"bodyfat_pct\": 8, \"bodyfat_sd\": 3, \"FFM_kg\": 91, \"FFM_sd\": 7, \"FFMI_derived_kg_m2\": 28.1, \"control_mass_kg\": 99, \"control_bodyfat_pct\": 24, \"control_FFM_kg\": 73}",
   "sources": [
    {
     "title": "McInnis KJ, Balady GJ. Effect of body composition on oxygen uptake during treadmill exercise: body builders versus weight-matched men. Res Q Exerc Sport 1999;70(2):150-156 (PMID 10380246)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:10380246%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Abstract values. FFMI 28.1 is my derivation from group means (91/1.80^2). Drug status not stated; an FFMI this far above 25 suggests many were not drug-free, but that is an inference, not a finding."
  },
  {
   "key": "katch1980_bodybuilders",
   "label": "Katch et al. 1980: lean body weight and 'excess muscle' in bodybuilders vs lifters",
   "status": "measured",
   "values": "{\"bodybuilders_n\": 18, \"bodybuilders_LBW_kg\": 74.6, \"bodybuilders_bodyfat_pct\": 9.3, \"bodybuilders_excess_muscle_kg\": 15.6, \"powerlifters_n\": 13, \"powerlifters_LBW_kg\": 73.3, \"powerlifters_bodyfat_pct\": 9.1, \"oly_lifters_n\": 8, \"oly_lifters_LBW_kg\": 68.2, \"oly_lifters_bodyfat_pct\": 10.8, \"girth_values\": \"unknown (not in abstract)\"}",
   "sources": [
    {
     "title": "Katch VL, Katch FI, Moffatt R, Gittleson M. Muscular development and lean body weight in body builders and weight lifters. Med Sci Sports Exerc 1980;12(5):340-344 (PMID 7453511)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:7453511%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Abstract: only shoulder, chest, biceps relaxed and flexed, and forearm girths differed between groups, bodybuilders being larger; no differences in frame size, %fat, LBW, skinfolds or diameters. Actual girth numbers are in the paywalled paper and were not obtained - unknown."
  },
  {
   "key": "fry1991_nonelite_bodybuilders",
   "label": "Fry et al. 1991: 36 non-elite male bodybuilders at competition",
   "status": "measured",
   "values": "{\"n\": 36, \"height_m\": 1.744, \"height_sd_m\": 0.067, \"mass_kg\": 80.3, \"mass_sd\": 11.0, \"bodyfat_pct\": 9.3, \"bodyfat_sd\": 1.6, \"FFM_kg\": 72.8, \"FFM_sd\": 9.8, \"FFMI_derived\": 23.9, \"chest_to_abdominal_circ_ratio\": 1.345, \"ratio_sd\": 0.059, \"biacromial_to_biiliac_ratio\": 1.463, \"somatotype\": \"2.3-6.2-1.2\"}",
   "sources": [
    {
     "title": "Fry AC et al. Anthropometric characteristics as discriminators of body-building success. J Sports Sci 1991;9(1):23-32 (PMID 1856909)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:1856909%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Abstract values; FFMI derived from group means. Authors note these non-elite competitors had 'smaller circumferences' than elite bodybuilders in prior literature. Chest/abdominal circumference ratio and shoulder/hip breadth ratio discriminated successful competitors."
  },
  {
   "key": "demoraes2019_competition_day_girths",
   "label": "de Moraes et al. 2019: girths of 24 national-level Brazilian bodybuilders at weigh-in (M1) and on contest day (M2)",
   "status": "measured",
   "values": "{\"population\": \"IFBB Amateur South American Arnold Classic / 47th Brazilian Championship 2016 qualifiers\", \"height_m\": 1.73, \"CL_n\": 15, \"CL_mass_kg_M1\": 79.2, \"CL_mass_kg_M2\": 81.5, \"CL_chest_cm_M2\": 112.3, \"CL_waist_cm_M2\": 79.2, \"CL_hip_cm_M2\": 101.4, \"CL_thigh_cm_M2\": 64.1, \"CL_arm_cm_M2\": 42.4, \"CL_calf_cm_M2\": 41.1, \"CL_forearm_cm_M2\": 33.5, \"NC_n\": 9, \"NC_mass_kg_M1\": 80.5, \"NC_chest_cm_M1\": 112.5, \"NC_waist_cm_M1\": 77.5, \"NC_thigh_cm_M1\": 64.9, \"NC_arm_cm_M1\": 42.6, \"NC_calf_cm_M1\": 40.4, \"NC_forearm_cm_M1\": 32.7, \"orig\": \"Table 2, mean +/- SD; SDs: chest ~6, waist ~3.8, thigh ~3-4, arm ~1.5, calf ~1.4-2, forearm ~2-2.8 cm\"}",
   "sources": [
    {
     "title": "de Moraes WMAM et al. Carbohydrate Loading Practice in Bodybuilders... J Sports Sci Med 2019;18(4):772-779, Table 2",
     "url": "https://jssm.org/tablejssm-18-772.xml/table002.xml"
    },
    {
     "title": "de Moraes et al. 2019 full text (JSSM) - methods/participants",
     "url": "https://www.jssm.org/jssm-18-772.xml%3EFulltext"
    },
    {
     "title": "de Moraes et al. 2019 abstract (PMID 31827362)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:31827362%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Values from Table 2 (CL = carbohydrate-loading group; NC = no loading). Carb loading raised arm, chest, thigh, calf, forearm and hip girths by ~0.5-2.3 cm overnight. The pages I read do not say whether 'arm' was flexed or relaxed - treat as unspecified. Note an internal inconsistency: methods text says CL n=9/NC n=15 but abstract and table say NC n=9/CL n=15. These are regional/national amateurs, far smaller than IFBB pros."
  },
  {
   "key": "bamman1993_precontest_girth_changes",
   "label": "Bamman et al. 1993: girth changes over 12 weeks of contest prep (6 male bodybuilders)",
   "status": "measured",
   "values": "{\"n\": 6, \"body_mass_change_kg\": -7.3, \"bodyfat_change_pct_points\": -5.0, \"waist_change_cm\": -6.9, \"hips_change_cm\": -4.3, \"chest_change\": \"not significant\"}",
   "sources": [
    {
     "title": "Bamman MM et al. Changes in body composition, diet, and strength of bodybuilders during the 12 weeks prior to competition. J Sports Med Phys Fitness 1993;33(4):383-391 (PMID 8035587)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:8035587%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Abstract: 'Circumferences decreased significantly at all sites (p < 0.05) except the chest. The greatest decreases were at the waist (-6.9 cm) and hips (-4.3 cm).' Fat-free mass showed little change; biceps muscle thickness (ultrasound) unchanged. Useful for converting off-season to stage girths."
  },
  {
   "key": "sukwong2022_thai_elite_bodybuilders",
   "label": "Sukwong et al. 2022: elite vs novice Thai bodybuilders (girths)",
   "status": "measured",
   "values": "{\"elite_n\": 10, \"elite_mass_kg\": 81.33, \"elite_mass_sd\": 7.9, \"elite_height_cm\": 170.2, \"elite_height_sd\": 7.23, \"elite_flexed_upper_arm_cm\": 41.75, \"flexed_arm_sd\": 1.84, \"elite_upper_arm_cm\": 37.0, \"upper_arm_sd\": 2.59, \"elite_chest_cm\": 104.95, \"chest_sd\": 4.79, \"elite_bodyfat_pct_BIA\": 17.56, \"novice_mass_kg\": 77.27, \"novice_height_cm\": 170.1, \"novice_chest_cm\": 99.75, \"novice_bodyfat_pct_BIA\": 20.99}",
   "sources": [
    {
     "title": "Sukwong T et al. The Difference of Anthropometric Characteristics Between Elite and Novice Bodybuilders in Thailand. Physical Education Theory and Methodology 2022;22(1) doi:10.17309/tmfv.2022.1.14 (PDF)",
     "url": "https://tmfv.com.ua/journal/article/download/1621/1462"
    }
   ],
   "notes": "From the PDF text. Body fat by BIA (not stage-lean values). Neck, arm, waist, hip, thigh and calf girths did not differ significantly between groups (values for those not extracted). National-level Asian amateurs; a lower bound for 'competitive bodybuilder' girths."
  },
  {
   "key": "mitchell2018_natural_bodybuilders",
   "label": "Mitchell et al. 2018: 9 natural male bodybuilders, DXA over contest prep",
   "status": "measured",
   "values": "{\"n\": 9, \"lean_mass_kg_PRE8\": 71.8, \"lean_mass_kg_PRE1\": 70.9, \"lean_mass_sd\": 9.1, \"lean_mass_kg_POST4\": 72.5, \"fat_mass_kg_PRE16\": 8.8, \"fat_mass_kg_PRE1\": 5.3, \"protein_g_per_kg_day\": \"2.8-3.1\"}",
   "sources": [
    {
     "title": "Mitchell L, Slater G, Hackett D, Johnson N, O'Connor H. Physiological implications of preparing for a natural male bodybuilding competition. Eur J Sport Sci 2018;18(5):619-629 (PMID 29490578)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:29490578%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Abstract values. Height not in abstract, so FFMI cannot be derived here. 'Despite substantial reductions in FM, participants maintained almost all of their LM.'"
  },
  {
   "key": "chappell2019_natural_pro_bodybuilders",
   "label": "Chappell, Simper & Helms 2019: British natural PRO vs amateur bodybuilders (WNBF/DFAC, polygraph + WADA testing)",
   "status": "reported",
   "values": "{\"male_PRO_n\": 8, \"male_PRO_height_m\": 1.77, \"male_PRO_height_sd\": 0.05, \"male_PRO_diet_start_mass_kg\": 95.6, \"start_sd\": 8.3, \"male_PRO_diet_end_mass_kg\": 82.3, \"end_sd\": 6.6, \"male_AMA_n\": 25, \"male_AMA_height_m\": 1.77, \"male_AMA_start_kg\": 88.3, \"male_AMA_end_kg\": 74.9, \"male_PRO_weeks_dieting\": 28.1, \"male_PRO_FFMI_at_end_if_5pct_fat_derived\": 25.0}",
   "sources": [
    {
     "title": "Chappell AJ, Simper T, Helms E. Nutritional strategies of British professional and amateur natural bodybuilders during competition preparation. JISSN 2019;16:35, Table 1 (Europe PMC full text PMC6704518)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC6704518/fullTextXML"
    }
   ],
   "notes": "Table 1 is explicitly 'Self-reported Characteristics' (height and bodyweight self-reported), hence 'reported'. All 8 male PROs had placed top-5 at DFAC or WNBF PRO World Finals; cohort included a two-time overall PRO world champion. The FFMI 25.0 is my derivation assuming 5% stage body fat (an assumption, not measured)."
  },
  {
   "key": "rossow2013_natural_pro_case",
   "label": "Rossow et al. 2013: 12-month case study of a drug-free IFPA pro bodybuilder",
   "status": "measured",
   "values": "{\"age_y\": \"26-27\", \"bodyfat_pct_start\": 14.8, \"bodyfat_pct_contest\": 4.5, \"bodyfat_pct_6mo_after\": 14.6, \"testosterone_ng_mL_start\": 9.22, \"testosterone_contest\": 2.27, \"testosterone_after\": 9.91, \"body_mass_loss_kg_secondary\": 16, \"FFMI_at_contest_secondary\": 24.9, \"squat_bench_deadlift_1RM_lb_start\": [464, 354, 570], \"at_contest\": [400, 324, 530], \"height_m\": \"unknown\"}",
   "sources": [
    {
     "title": "Rossow LM, Fukuda DH, Fahs CA, Loenneke JP, Stout JR. Natural bodybuilding competition preparation and recovery: a 12-month case study. Int J Sports Physiol Perform 2013;8(5):582-592 (PMID 23412685)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:23412685%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "Helms E. 'Weighing the evidence: Kouri et al., 1995', Alan Aragon's Research Review, Aug 2014 (PDF)",
     "url": "https://www.alanaragon.com/wp-content/uploads/2016/08/Helms-Aug-2014-AARR.pdf"
    },
    {
     "title": "Biolayne: 'Lessons learned from recent case studies in drug-tested physique athletes' (secondary)",
     "url": "https://biolayne.com/articles/research/lessons-learned-recent-case-studies-drug-tested-physique-athletes/"
    }
   ],
   "notes": "Abstract gives body fat 14.8% -> 4.5% -> 14.6% and testosterone values. The 16 kg body-mass loss and FFMI 24.9 at contest are from Helms (AARR 2014) reading the full paper; 1RMs from Biolayne. Height and absolute masses not obtained (paywalled) - unknown."
  },
  {
   "key": "bauer2023_bodyfat_ranges_review",
   "label": "Bauer et al. 2023 systematic review: body fat of competitive bodybuilders",
   "status": "measured",
   "values": "{\"studies_included\": 16, \"male_offseason_or_general_prep_bodyfat_pct\": [9.6, 16.3], \"male_near_competition_bodyfat_pct\": [5.8, 10.7], \"female_general_prep_bodyfat_pct\": [15.3, 25.2], \"female_near_competition_bodyfat_pct\": [8.1, 18.3], \"relative_bodyfat_reduction_during_prep_pct\": [30, 60]}",
   "sources": [
    {
     "title": "Bauer P et al. Body Composition of Competitive Bodybuilders: A Systematic Review. J Strength Cond Res 2023;37(3):726-732 (PMID 36727905)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:36727905%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Abstract: 'In the general preparation phase, body fat levels... ranged between 15.3 and 25.2% (female) and from 9.6 to 16.3% (male). Close to competition... 8.1 to 18.3% for female and 5.8-10.7% for male athletes.' Lean mass mostly maintained. Ranges span different methods (DXA, BIA, skinfolds, etc.)."
  },
  {
   "key": "kraemer2020_elite_strongmen_dxa",
   "label": "Kraemer et al. 2020: DXA body composition of 18 elite strongman competitors",
   "status": "measured",
   "values": "{\"n\": 18, \"age_y\": 33.0, \"height_m\": 1.874, \"height_sd_m\": 0.071, \"mass_kg\": 152.9, \"mass_sd\": 19.3, \"BMI\": 43.5, \"fat_mass_kg\": 30.9, \"lean_mass_kg\": 118.0, \"lean_sd\": 11.7, \"bodyfat_pct\": 18.7, \"bodyfat_sd\": 6.2, \"BMC_kg\": 5.23, \"BMD_g_cm2\": 1.78, \"FFMI_lean_plus_BMC_derived\": 35.1}",
   "sources": [
    {
     "title": "Kraemer WJ et al. Body Composition in Elite Strongman Competitors. J Strength Cond Res 2020;34(12):3326-3330 (PMID 33235016)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:33235016%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Abstract values (composite of 5 annual screenings; the competition venue is not stated in the abstract). FFMI derived by me as (lean 118.0 + BMC 5.23)/1.874^2 = 35.1 kg/m2."
  },
  {
   "key": "balshaw2024_eddie_hall_mri",
   "label": "Balshaw et al. 2024: MRI muscle volumes of a World's Strongest Man and deadlift champion (identifiable as Eddie Hall)",
   "status": "measured",
   "values": "{\"height_m\": 1.9, \"body_mass_kg\": 172.0, \"age_y\": 30.6, \"leg_muscle_volume_unilateral_cm3\": 14922, \"untrained_controls_cm3\": 7628, \"vs_untrained_pct\": 96, \"quadriceps_cm3\": 4386, \"quadriceps_vs_untrained_pct\": 127, \"hamstrings_cm3\": 1545, \"vastus_lateralis_cm3\": 1508, \"rectus_femoris_cm3\": 453, \"patellar_tendon_CSA_vs_untrained_pct\": 30, \"CMJ_peak_power_W\": 9866, \"IMTP_gross_N\": 9171}",
   "sources": [
    {
     "title": "Balshaw TG, Massey GJ, Miller R, McDermott EJ, Maden-Wilkinson TM, Folland JP. Muscle and tendon morphology of a world strongman and deadlift champion. J Appl Physiol 2024;137(4):789-799 (full text PMC11486472)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC11486472/fullTextXML"
    }
   ],
   "notes": "Table 1 lists the WSM: n=1, age 30.6 y, height 1.90 m, body mass 172.0 kg. The paper anonymises him but describes one WSM title (14 mo before testing), five Britain's Strongest Man titles and the 500 kg deadlift world record, which identifies Eddie Hall (WSM 2017); the paper itself does not name him. Testing therefore ~mid-2018. MRI covered T12 to ankle only (no upper-body or girth tape measurements)."
  },
  {
   "key": "mr_america_1938_1954_program_girths",
   "label": "Mr America winners' measurements when they won (1956 Mr USA contest program) - pre-steroid girth reference",
   "status": "reported",
   "values": "{\"units\": \"inches / lb\", \"columns\": [\"year\", \"name\", \"height\", \"weight_lb\", \"neck\", \"arm\", \"forearm\", \"chest\", \"waist\", \"thigh\", \"calf\", \"wrist\", \"ankle\"], \"rows\": [[\"1938\", \"Bert Goodrich\", \"5'10.5\\\"\", 195, 17, 17, 14, 47, 33, 24, 17, 7.6, 9.2], [\"1940/41\", \"John Grimek\", \"5'8.5\\\"\", 195, 17, 17.5, 14, 47, 31, 25, 17, 8, 9.8], [\"1942\", \"Frank Leight\", \"5'11.5\\\"\", 209, 17.5, 17.5, 14, 48.5, 33, 24, 16, 8, 9.5], [\"1943\", \"Jules Bacon\", \"5'7\\\"\", 175, 15.5, 15.5, 12.5, 44, 31, 23, 15, 7, 9], [\"1944\", \"Steve Stanko\", \"5'11.5\\\"\", 223, 18, 18, 14.3, 48.5, 35.9, null, 17, 8, 10], [\"1945\", \"Clarence Ross\", \"5'9.5\\\"\", 185, 16.5, 17, 13.5, 47, 32, 24, 16, 7.5, 9.2], [\"1946\", \"Alan Stephan\", \"5'11.5\\\"\", 205, 17.1, 17, 14.2, 47.9, 32.4, 24.8, 16.1, 7.7, 9.7], [\"1947\", \"Steve Reeves\", \"6'1\\\"\", 213, 17.6, 17.5, 14, 48, 31, 25.3, 17.5, 7.9, 9.8], [\"1948\", \"George Eiferman\", \"5'7.5\\\"\", 195, 16.5, 16.7, 13.4, 47.5, 32, 25, 16, 7.3, 9.6], [\"1949\", \"Jack Delinger\", \"5'6\\\"\", 195, 16.8, 17.2, 13.8, 47.5, 32, 25, 16.6, 7.7, 9.5], [\"1950\", \"John Farbotnik\", \"5'9\\\"\", 195, 16.8, 17, 13.5, 47.5, 32, 24.5, 15.7, 7.5, 9.3], [\"1951\", \"Roy Hilligenn\", \"5'6\\\"\", 178, 16.6, 16.7, 13.4, 46, 32, 23.6, 15.4, 7.5, 9.2], [\"1952\", \"James Park\", \"5'7.5\\\"\", 190, 16.7, 17, 13.4, 47, 32.5, 24.2, 15.2, 7.3, 9], [\"1953\", \"Bill Pearl\", \"5'9\\\"\", 201, 17.5, 17.5, 14, 48, 32.5, 25, 16.2, 7.8, 9.5], [\"1954\", \"Dick Dubois\", \"6'1\\\"\", 220, 17.8, 18, 14.2, 49, 32.5, 25.5, 17.2, 8, 9.6]], \"later_from_magazines\": [[\"1965\", \"Jerry Daniels\", \"6'\", 215, null, 19, null, 52, 32, 26.75, 17], [\"1967\", \"Dennis Tinerino\", \"6'0\\\"\", 217, null, 19.75, null, 52, 32, 27, 18], [\"1975\", \"Dale Adrian\", \"5'8\\\"\", 200, 18, 19.25, 15, 53, 30, 26, 18], [\"1977\", \"Kalman Szkalak\", \"5'10\\\"\", 215, null, 20, null, 52, 30, 26.5, 17], [\"1981\", \"Tim Belknap\", \"5'4\\\"\", 225, null, 21, 17.5, null, 31, 29, 19.5]], \"SI_example_Reeves\": {\"height_m\": 1.854, \"mass_kg\": 96.6, \"neck_m\": 0.447, \"arm_m\": 0.445, \"forearm_m\": 0.356, \"chest_m\": 1.219, \"waist_m\": 0.787, \"thigh_m\": 0.643, \"calf_m\": 0.445}}",
   "sources": [
    {
     "title": "MuscleMemory.org transcription: 'Measurements of Mr America winners taken when they won their titles, as listed in the program from the 1956 Mr USA contest' + later winners from magazines",
     "url": "https://s3.musclememory.net/articles/MrAsizes.html"
    }
   ],
   "notes": "Transcribed by MuscleMemory.org from the 1956 Mr USA contest program ('Measurements of Mr America winners, taken when they won their titles'); the 1939 and 1959-1981 rows are from 'various bodybuilding magazines'. Contest-program/magazine numbers, method of measuring (flexed arm? cold or pumped?) not stated - label as reported. These overlap the Kouri 1939-1959 pre-steroid sample. Note how modest arm (15.5-18 in) and calf (15-17.5 in) girths were vs modern pros."
  },
  {
   "key": "ronnie_coleman_height_weight",
   "label": "Ronnie Coleman (8x Mr. Olympia 1998-2005): height and bodyweights",
   "status": "reported",
   "values": "{\"height_m\": 1.803, \"orig_height\": \"5'11\\\"\", \"contest_1998_Olympia_kg\": 112.9, \"contest_1998_lb\": 249, \"contest_2003_Olympia_kg\": 129.7, \"contest_2003_lb\": 286, \"contest_2004_Olympia_kg\": 134.3, \"contest_2004_lb\": 296, \"contest_2004_prejudging_morning_lb\": 291, \"contest_2005_Olympia_kg\": 124.7, \"contest_2005_lb\": 275, \"offseason_range_kg\": [142.9, 149.7], \"offseason_range_lb\": [315, 330], \"heaviest_selfreported_lb\": 330, \"heaviest_selfreported_kg\": 149.7}",
   "sources": [
    {
     "title": "Iron Man Magazine, Lonnie Teper, 'Coleman Destroys Mr. O Field', reported Oct 27 2003",
     "url": "https://www.ironmanmagazine.com/?p=16762"
    },
    {
     "title": "Iron Man Magazine, '2004 IFBB Mr. Olympia' (Feb 2005 issue)",
     "url": "https://www.ironmanmagazine.com/?p=17030"
    },
    {
     "title": "The Barbell (Greg Merritt / FLEX archive), 'The 1998 Mr. Olympia'",
     "url": "https://thebarbell.com/1998-mr-olympia/"
    },
    {
     "title": "The Barbell, 'The 2004 Mr. Olympia' (quotes Peter McGough's FLEX analysis)",
     "url": "https://thebarbell.com/2004-mr-olympia/"
    },
    {
     "title": "The Barbell, Greg Merritt, 'The 2005 Mr. Olympia' (orig. FLEX Jan 2006), Sep 15 2025",
     "url": "https://thebarbell.com/2005-mr-olympia/"
    },
    {
     "title": "FitnessVolt, Derek Hall, 'Ronnie Coleman Flashes Back To Time As A 330lb Mass Monster', Nov 7 2021 (quotes Coleman's own YouTube post)",
     "url": "https://fitnessvolt.com/ronnie-coleman-330lb-mass-monster/"
    },
    {
     "title": "Wikipedia 'Ronnie Coleman' raw wikitext (wiki; cites bodybuildingpro.com and Bodybuilding.com 2015)",
     "url": "https://en.wikipedia.org/w/index.php?title=Ronnie_Coleman&action=raw"
    },
    {
     "title": "FitnessVolt Bodybuilding Database - Ronnie Coleman (height/weight, FFMI at assumed 6% BF; data updated Sep 30 2026)",
     "url": "https://fitnessvolt.com/bodybuilding/athletes/ronnie-coleman/"
    },
    {
     "title": "FitnessVolt - Ronnie Coleman profile (stats box)",
     "url": "https://fitnessvolt.com/ronnie-coleman-profile/"
    }
   ],
   "notes": "Iron Man (Lonnie Teper, Oct 27 2003): 'coming in at an unheard of 286 pounds on his 5'11\" frame'. Iron Man 2004 report: nutrition adviser Chad Nicholls said he weighed 291 the morning of prejudging and 'was probably around 295' after eating. FLEX/Peter McGough via The Barbell: '5'11\", 296 pounds... at his all-time heaviest contest weight' (2004); 1998 posedown '249 pounds next to [Flex Wheeler's] 230'; 2005 'at 275 pounds instead of the 296 of last year'. Off-season 315-330 lb per Wikipedia (citing bodybuildingpro.com/Bodybuilding.com); 330 lb is Coleman's own description of his biggest ever ('I weighed about 330lb. Not contest shape'). CONFLICT: FitnessVolt's profile box lists 'Competition Weight 330 lbs / Off Season 296 lbs' - apparently swapped labels; its own database lists 287 lb."
  },
  {
   "key": "ronnie_coleman_girths",
   "label": "Ronnie Coleman: published girths",
   "status": "disputed",
   "values": "{\"arm_in\": 24, \"arm_m\": 0.61, \"chest_in\": [58, 60], \"chest_m\": [1.473, 1.524], \"waist_in\": 36, \"waist_m\": 0.914, \"thigh_in\": [34, 36], \"thigh_m\": [0.864, 0.914], \"calf_in\": 22, \"calf_m\": 0.559, \"neck\": \"unknown\", \"forearm\": \"unknown\"}",
   "sources": [
    {
     "title": "GreatestPhysiques.com - Ronnie Coleman (fan site; 2017)",
     "url": "https://www.greatestphysiques.com/male-physiques/ronnie-coleman/"
    },
    {
     "title": "FitnessVolt - Ronnie Coleman profile (stats box)",
     "url": "https://fitnessvolt.com/ronnie-coleman-profile/"
    },
    {
     "title": "Wikipedia 'Ronnie Coleman' raw wikitext (wiki; cites bodybuildingpro.com and Bodybuilding.com 2015)",
     "url": "https://en.wikipedia.org/w/index.php?title=Ronnie_Coleman&action=raw"
    }
   ],
   "notes": "Arms 24 in agreed by GreatestPhysiques, FitnessVolt and Wikipedia (Wikipedia: 'biggest upper arms he ever posed on stage at over 24 in in contest shape' at 2006 Olympia). Chest 58 in (GreatestPhysiques, FitnessVolt) vs 'Chest/Back 60 in' (Wikipedia citing bodybuildingpro.com). Thighs 36 in (GreatestPhysiques) vs 34 in (FitnessVolt). Waist 36 in and calves 22 in from GreatestPhysiques only (fan site). None of these state when or how measured (cold/pumped, flexed/relaxed). No neck or forearm figure found."
  },
  {
   "key": "arnold_schwarzenegger_height_weight",
   "label": "Arnold Schwarzenegger (7x Mr. Olympia): height and bodyweights",
   "status": "disputed",
   "values": "{\"height_claimed_m\": 1.88, \"height_claimed\": \"6'2\\\"\", \"height_1969_1980_reports_m\": 1.867, \"height_reports\": \"6'1.5\\\"\", \"height_GP_m\": 1.905, \"height_range_m\": [1.867, 1.905], \"contest_topform_lb\": 235, \"contest_topform_kg\": 106.6, \"contest_1971_Olympia_lb\": 246, \"contest_1971_kg\": 111.6, \"contest_1975_Olympia_lb\": 235, \"offseason_lb\": 260, \"offseason_kg\": 117.9, \"GP_weight_range_lb\": [225, 235]}",
   "sources": [
    {
     "title": "CelebHeights.com - Arnold Schwarzenegger (quotes 'Education of a Bodybuilder' top-form measurements; 1969 and 1980 height reports; fan height estimate)",
     "url": "https://www.celebheights.com/s/Arnold-Schwarzenegger-177.html"
    },
    {
     "title": "FitnessVolt - Arnold Schwarzenegger profile (published 2021-06-26, modified 2026-08-15)",
     "url": "https://fitnessvolt.com/2220/arnold-schwarzenegger/"
    },
    {
     "title": "GreatestPhysiques.com - Arnold Schwarzenegger (fan site)",
     "url": "https://www.greatestphysiques.com/male-physiques/arnold-schwarzenegger/"
    },
    {
     "title": "The Barbell, Greg Merritt, 'The 1971 Mr. Olympia', Mar 15 2023",
     "url": "https://thebarbell.com/1971-mr-olympia/"
    },
    {
     "title": "The Barbell, Greg Merritt, 'The 1975 Mr. Olympia', Apr 9 2025",
     "url": "https://thebarbell.com/1975-mr-olympia/"
    },
    {
     "title": "Wikipedia 'Arnold Schwarzenegger' raw wikitext (cites Bodybuilding.com profile, Oct 11 2015)",
     "url": "https://en.wikipedia.org/w/index.php?title=Arnold_Schwarzenegger&action=raw"
    }
   ],
   "notes": "Height: his book 'Education of a Bodybuilder' lists 6 ft 2 in (as quoted by CelebHeights); CelebHeights also reports a 1980 interview where he said 6 ft 1.5 and a bodybuilder's claim to have measured him at 6 ft 1.5 in 1969; GreatestPhysiques lists 6'3\". Weights: 235 lb top form (book); The Barbell (Greg Merritt): '246-pound Arnold' at the 1971 Olympia ('bigger but smoother'), 'at 235 pounds, Arnold was undersized and a little smooth' in 1975. Off-season 260 lb per FitnessVolt and Wikipedia (citing Bodybuilding.com 2015)."
  },
  {
   "key": "arnold_schwarzenegger_girths",
   "label": "Arnold Schwarzenegger: published 'top form' girths",
   "status": "disputed",
   "values": "{\"arm_in\": 22, \"arm_m\": 0.559, \"chest_in\": 57, \"chest_m\": 1.448, \"waist_in\": [30, 34], \"waist_m\": [0.762, 0.864], \"thigh_in\": 28.5, \"thigh_m\": 0.724, \"calf_in\": 20, \"calf_m\": 0.508, \"neck\": \"unknown\", \"forearm\": \"unknown\", \"orig\": \"Arms 22in, Chest 57in, Waist 34in, Thighs 28.5in, Calves 20in, Weight 235 lbs, Height 6 feet 2 inches\"}",
   "sources": [
    {
     "title": "CelebHeights.com - Arnold Schwarzenegger (quotes 'Education of a Bodybuilder' top-form measurements; 1969 and 1980 height reports; fan height estimate)",
     "url": "https://www.celebheights.com/s/Arnold-Schwarzenegger-177.html"
    },
    {
     "title": "FitnessVolt - Arnold Schwarzenegger profile (published 2021-06-26, modified 2026-08-15)",
     "url": "https://fitnessvolt.com/2220/arnold-schwarzenegger/"
    },
    {
     "title": "GreatestPhysiques.com - Arnold Schwarzenegger (fan site)",
     "url": "https://www.greatestphysiques.com/male-physiques/arnold-schwarzenegger/"
    }
   ],
   "notes": "Self-reported in his book (quoted by CelebHeights: 'Top Form Measurements were: Arms 22in, Chest 57in, Waist 34in, Thighs 28.5in, Calves 20in, Weight 235 lbs, Height 6 feet 2 inches'); FitnessVolt repeats the same set. GreatestPhysiques lists waist 30 in (others identical) - hence disputed waist 30-34 in. Self-reported by the athlete; no independent measurement found."
  },
  {
   "key": "dorian_yates_height_weight",
   "label": "Dorian Yates (6x Mr. Olympia 1992-97): height and bodyweights",
   "status": "disputed",
   "values": "{\"height_m\": [1.753, 1.778], \"height_orig\": \"5'9\\\" (FitnessVolt) or 5'10\\\" (GreatestPhysiques, Wikipedia)\", \"contest_1992_Olympia_lb\": 242, \"contest_1992_kg\": 109.8, \"contest_1993_Olympia_kg\": 116.57, \"contest_1993_lb\": 257, \"contest_range_GP_lb\": [255, 265], \"FV_weight_range_lb\": [260, 290], \"offseason\": \"unknown (no year-specific source found)\"}",
   "sources": [
    {
     "title": "Guinness World Records - 'Heaviest Mr Olympia champion' (Dorian Yates, 1993)",
     "url": "https://guinnessworldrecords.com/world-records/71857-heaviest-mr-olympia-champion"
    },
    {
     "title": "The Barbell, Greg Merritt, 'The 1994 Mr. Olympia', Sep 5 2023",
     "url": "https://thebarbell.com/1994-mr-olympia/"
    },
    {
     "title": "FitnessVolt - Dorian Yates profile",
     "url": "https://fitnessvolt.com/dorian-yates/"
    },
    {
     "title": "GreatestPhysiques.com - Dorian Yates (fan site; 2016)",
     "url": "https://www.greatestphysiques.com/male-physiques/dorian-yates/"
    }
   ],
   "notes": "Guinness: 'In 1993 Dorian Yates (UK) weighed 116.57 kg (18 st 5 lb) when he was crowned Mr Olympia' (page is titled 'Heaviest Mr Olympia champion' but is out of date - Coleman 2003-04 and Elssbiay were heavier). The Barbell (Merritt): 'When Dorian Yates won his first Mr. Olympia in 1992, he weighed 242. One year later... he was 257 grainy pounds'. FitnessVolt gives '260 - 290 lbs' without saying which is contest vs off-season, so off-season is left unknown."
  },
  {
   "key": "dorian_yates_girths",
   "label": "Dorian Yates: published girths",
   "status": "disputed",
   "values": "{\"arm_in\": [20, 21], \"arm_m\": [0.508, 0.533], \"chest_in\": [56, 57], \"chest_m\": [1.422, 1.448], \"waist_in\": [34, 38], \"waist_m\": [0.864, 0.965], \"thigh_in\": 30, \"thigh_m\": 0.762, \"calf_in\": [20, 22], \"calf_m\": [0.508, 0.559], \"neck\": \"unknown\"}",
   "sources": [
    {
     "title": "GreatestPhysiques.com - Dorian Yates (fan site; 2016)",
     "url": "https://www.greatestphysiques.com/male-physiques/dorian-yates/"
    },
    {
     "title": "FitnessVolt - Dorian Yates profile",
     "url": "https://fitnessvolt.com/dorian-yates/"
    }
   ],
   "notes": "GreatestPhysiques: arms 20, chest 56, waist 38, calves 20 in. FitnessVolt: arms 21, legs 30, waist 34, chest 57, calves 22 in. Both fan/magazine-style sites with no date or method; the two disagree on every shared girth."
  },
  {
   "key": "jay_cutler_height_weight",
   "label": "Jay Cutler (4x Mr. Olympia): height and bodyweights",
   "status": "disputed",
   "values": "{\"height_m\": [1.753, 1.778], \"height_orig\": \"5'9\\\" (FLEX 2004 via The Barbell; FitnessVolt profile; GreatestPhysiques; M&F per Wikipedia) or 5'10\\\" (Bodybuilding.com per Wikipedia; FitnessVolt database)\", \"contest_1999_Olympia_lb\": 255, \"contest_2004_lb\": 273, \"contest_2005_lb\": 264, \"contest_2007_lb_approx\": [260, 265], \"contest_2009_lb\": 271, \"contest_2009_kg\": 122.9, \"contest_2010_lb\": 260, \"offseason_lb\": [290, 310], \"offseason_kg\": [131.5, 140.6]}",
   "sources": [
    {
     "title": "The Barbell, 'The 1999 Mr. Olympia' (orig. FLEX Jan 2000)",
     "url": "https://thebarbell.com/1999-mr-olympia/"
    },
    {
     "title": "The Barbell, 'The 2004 Mr. Olympia' (quotes Peter McGough's FLEX analysis)",
     "url": "https://thebarbell.com/2004-mr-olympia/"
    },
    {
     "title": "The Barbell, Greg Merritt, 'The 2005 Mr. Olympia' (orig. FLEX Jan 2006), Sep 15 2025",
     "url": "https://thebarbell.com/2005-mr-olympia/"
    },
    {
     "title": "The Barbell, Greg Merritt, 'The 2007 Mr. Olympia', Oct 20 2023",
     "url": "https://thebarbell.com/2007-mr-olympia/"
    },
    {
     "title": "The Barbell, Greg Merritt, 'The 2009 Mr. Olympia' (orig. FLEX Jan 2010), Apr 24 2024",
     "url": "https://thebarbell.com/2009-mr-olympia/"
    },
    {
     "title": "The Barbell, Greg Merritt, 'The 2010 Mr. Olympia' (orig. FLEX Dec 2010)",
     "url": "https://thebarbell.com/2010-mr-olympia/"
    },
    {
     "title": "FitnessVolt - Jay Cutler profile",
     "url": "https://fitnessvolt.com/jay-cutler/"
    },
    {
     "title": "GreatestPhysiques.com - Jay Cutler (fan site; 2016)",
     "url": "https://www.greatestphysiques.com/male-physiques/jay-cutler/"
    },
    {
     "title": "Wikipedia 'Jay Cutler (bodybuilder)' raw wikitext (cites Bodybuilding.com 2015, M&F Dec 2018)",
     "url": "https://en.wikipedia.org/w/index.php?title=Jay_Cutler_(bodybuilder)&action=raw"
    }
   ],
   "notes": "FLEX contest reports republished by The Barbell: 1999 'JAY CUTLER: 255 pounds'; 2004 '2nd JAY CUTLER 5'9\", 273 pounds'; 2005 'Cutler, at 264'; 2007 'He planned to come in at 275, but his weight fell to 265 and was five pounds less than that after prejudging'; 2009 '271 striated pounds'; 2010 '260-pound' Cutler vs 245-pound Heath. Off-season 310 lb (FitnessVolt) / 290-310 lb (Wikipedia citing Bodybuilding.com 2015)."
  },
  {
   "key": "jay_cutler_girths",
   "label": "Jay Cutler: published girths",
   "status": "disputed",
   "values": "{\"arm_in\": [21, 22], \"arm_m\": [0.533, 0.559], \"chest_in\": 58, \"chest_m\": 1.473, \"waist_in\": [34, 39], \"waist_m\": [0.864, 0.991], \"thigh_in\": 30, \"thigh_m\": 0.762, \"calf_in\": [19, 20], \"calf_m\": [0.483, 0.508], \"neck\": \"unknown\"}",
   "sources": [
    {
     "title": "FitnessVolt - Jay Cutler profile",
     "url": "https://fitnessvolt.com/jay-cutler/"
    },
    {
     "title": "GreatestPhysiques.com - Jay Cutler (fan site; 2016)",
     "url": "https://www.greatestphysiques.com/male-physiques/jay-cutler/"
    },
    {
     "title": "Wikipedia 'Jay Cutler (bodybuilder)' raw wikitext (cites Bodybuilding.com 2015, M&F Dec 2018)",
     "url": "https://en.wikipedia.org/w/index.php?title=Jay_Cutler_(bodybuilder)&action=raw"
    }
   ],
   "notes": "FitnessVolt: arms 22, waist 39, chest 58, thighs 30, calves 20. GreatestPhysiques: arms 21, chest 58, waist 34, thighs 30, calves 19. Wikipedia (citing Bodybuilding.com 2015): upper arms 22, chest 58, thighs 30, waist 34. The 39 in waist is likely an off-season figure but no source says so."
  },
  {
   "key": "phil_heath_height_weight",
   "label": "Phil Heath (7x Mr. Olympia 2011-17): height and bodyweights",
   "status": "reported",
   "values": "{\"height_m\": 1.753, \"height_orig\": \"5'9\\\"\", \"contest_2009_Olympia_lb\": 227, \"contest_2010_lb\": 245, \"contest_2011_lb\": 248, \"contest_2011_kg\": 112.5, \"GP_range_lb\": [245, 255], \"FV_database_lb\": 240, \"offseason_lb\": 270, \"offseason_kg\": 122.5, \"retired_2023_selfreported_lb\": 255}",
   "sources": [
    {
     "title": "The Barbell, Greg Merritt, 'The 2009 Mr. Olympia' (orig. FLEX Jan 2010), Apr 24 2024",
     "url": "https://thebarbell.com/2009-mr-olympia/"
    },
    {
     "title": "The Barbell, Greg Merritt, 'The 2010 Mr. Olympia' (orig. FLEX Dec 2010)",
     "url": "https://thebarbell.com/2010-mr-olympia/"
    },
    {
     "title": "The Barbell, Greg Merritt, 'The 2011 Mr. Olympia' (orig. FLEX Nov 2011), Aug 23 2024",
     "url": "https://thebarbell.com/2011-mr-olympia/"
    },
    {
     "title": "FitnessVolt - Phil Heath complete profile",
     "url": "https://fitnessvolt.com/phil-heath-complete-profile/"
    },
    {
     "title": "GreatestPhysiques.com - Phil Heath (fan site; 2016)",
     "url": "https://www.greatestphysiques.com/male-physiques/phil-heath/"
    },
    {
     "title": "The Barbell, 'Phil Heath' news item, Apr 30 2023 (quotes Heath's video)",
     "url": "https://thebarbell.com/phil-heath/"
    }
   ],
   "notes": "FLEX via The Barbell: 2009 'Friday night he's 227'; 2010 '245-pound Heath'; 2011 'At 248, he's only two pounds more than last year' (orig. FLEX Nov 2011). Off-season 270 lb: Wikipedia citing FitnessVolt 2019; FitnessVolt profile now shows '240-270lbs'. April 2023 (retired): 'I'm sitting around 255 pounds right now' (his video, quoted by The Barbell)."
  },
  {
   "key": "phil_heath_girths",
   "label": "Phil Heath: published girths",
   "status": "reported",
   "values": "{\"arm_in\": 23, \"arm_m\": 0.584, \"chest_in\": 54, \"chest_m\": 1.372, \"waist_in\": 29, \"waist_m\": 0.737, \"thigh_in\": 32, \"thigh_m\": 0.813, \"calf_in\": 20, \"calf_m\": 0.508, \"neck\": \"unknown\"}",
   "sources": [
    {
     "title": "GreatestPhysiques.com - Phil Heath (fan site; 2016)",
     "url": "https://www.greatestphysiques.com/male-physiques/phil-heath/"
    }
   ],
   "notes": "Single source: GreatestPhysiques.com (fan site, published 2016, modified 2017), no date or method. Not corroborated - treat as low confidence."
  },
  {
   "key": "big_ramy_height_weight",
   "label": "Mamdouh 'Big Ramy' Elssbiay (Mr. Olympia 2020, 2021): height and bodyweights",
   "status": "disputed",
   "values": "{\"height_m\": [1.753, 1.803], \"height_orig\": \"5'9\\\" (FitnessVolt, GreatestPhysiques, Wikipedia) vs 5'11\\\" (FLEX 2014 report via The Barbell)\", \"contest_2014_Olympia_lb\": 285, \"contest_2014_kg\": 129.3, \"contest_2015_Olympia_lb_est\": [305, 310], \"contest_2015_kg_est\": [138.3, 140.6], \"weight_heard_2015_lb\": 316, \"FV_database_contest_lb\": 295, \"GP_range_lb\": [295, 310], \"offseason_Jan2022_kg\": 155, \"offseason_Jan2022_lb\": 341, \"offseason_Sep2022_lb\": 337.7, \"offseason_Sep2022_kg\": 153.2}",
   "sources": [
    {
     "title": "The Barbell, Greg Merritt, 'The 2014 Mr. Olympia' (orig. FLEX Dec/Jan 2015), Jan 24 2024",
     "url": "https://thebarbell.com/2014-mr-olympia/"
    },
    {
     "title": "The Barbell, Greg Merritt, 'The 2015 Mr. Olympia' (orig. FLEX), May 7 2025",
     "url": "https://thebarbell.com/2015-mr-olympia/"
    },
    {
     "title": "FitnessVolt - Big Ramy profile",
     "url": "https://fitnessvolt.com/mamdouh-big-ramy-elssbiay-profile/"
    },
    {
     "title": "GreatestPhysiques.com - Mamdouh Elssbiay (fan site; 2017)",
     "url": "https://www.greatestphysiques.com/male-physiques/mamdouh-elssbiay/"
    },
    {
     "title": "FitnessVolt Bodybuilding Database - Mamdouh Elssbiay",
     "url": "https://fitnessvolt.com/bodybuilding/athletes/mamdouh-elssbiay/"
    },
    {
     "title": "FitnessVolt, Doug Murray, 'Big Ramy Revealed His Off Season Weight is 341lbs (155kg)', Jan 14 2022 (quotes Ramy on Instagram)",
     "url": "https://fitnessvolt.com/big-ramy-revealed-off-season-weight-341lbs/"
    },
    {
     "title": "Breaking Muscle, Robert Zeglinski, 'Mamdouh \"Big Ramy\" Elssbiay Weighs 337 Pounds...', Sep 23 2022",
     "url": "https://breakingmuscle.com/mamdouh-big-ramy-elssbiay-weighs-337-pounds/"
    }
   ],
   "notes": "FLEX/Merritt (2014): 'he carries 285 lean pounds on a 5'11\" frame'. 2015: 'Elssbiay likely got into the 305-310 range on stage at Friday's prejudging... Phil Heath wasn't concerned when he heard 316'. Jan 2022 to coach Dennis James: 'Right now, I'm 155kg, (341lbs) with abs' (FitnessVolt). Sep 22 2022 Instagram: 337.7 lb before contest diet (Breaking Muscle). Wikipedia's 'off season 310 lb' (citing FitnessVolt) conflicts with his own 337-341 lb statements. 2020/2021 stage weights not found in a source I could fetch. Girths: none found in any source (unknown)."
  },
  {
   "key": "sergio_oliva_height_weight",
   "label": "Sergio Oliva (Mr. Olympia 1967-69): height and bodyweights",
   "status": "disputed",
   "values": "{\"height_m\": 1.778, \"height_orig\": \"5'10\\\"\", \"contest_1967_lb_approx\": 225, \"contest_1967_kg\": 102.1, \"contest_1972_lb_approx\": 240, \"contest_1972_kg\": 108.9, \"contest_range_lb_Wikipedia\": [225, 245], \"GP_range_lb\": [225, 235], \"FV_profile_lb\": 255, \"FV_database_lb\": 225, \"offseason_lb_Wikipedia\": 235}",
   "sources": [
    {
     "title": "The Barbell, Greg Merritt, 'Sergio Oliva: The Full, Amazing Story of The Myth', Feb 27 2024 (quotes Rick Wayne)",
     "url": "https://thebarbell.com/sergio-oliva/"
    },
    {
     "title": "GreatestPhysiques.com - Sergio Oliva (fan site; 2016, mod. 2018)",
     "url": "https://www.greatestphysiques.com/male-physiques/sergio-oliva/"
    },
    {
     "title": "FitnessVolt - Sergio Oliva profile",
     "url": "https://fitnessvolt.com/sergio-oliva/"
    },
    {
     "title": "Wikipedia 'Sergio Oliva' raw wikitext (cites M&F Olympia gallery)",
     "url": "https://en.wikipedia.org/w/index.php?title=Sergio_Oliva&action=raw"
    }
   ],
   "notes": "The Barbell (Greg Merritt, 2024): 'At 5'10\" and around 225 pounds' at the 1967 Olympia; 'At around 240 pounds' at the 1972 Olympia. Wikipedia (citing M&F): contest 225-245 lb; off-season 235 lb (citing GreatestPhysiques). FitnessVolt profile '255 lbs' is an outlier vs its own database (225 lb)."
  },
  {
   "key": "sergio_oliva_girths",
   "label": "Sergio Oliva: published girths",
   "status": "disputed",
   "values": "{\"arm_in\": [20, 22.5], \"arm_m\": [0.508, 0.572], \"chest_in\": [52, 59], \"chest_m\": [1.321, 1.499], \"waist_in\": [27, 32], \"waist_m\": [0.686, 0.813], \"waist_RickWayne_in\": 29, \"thigh_in_RickWayne\": 29, \"thigh_m\": 0.737, \"calf_in_RickWayne\": \"close to 20\", \"calf_m_approx\": 0.508, \"neck\": \"unknown\"}",
   "sources": [
    {
     "title": "The Barbell, Greg Merritt, 'Sergio Oliva: The Full, Amazing Story of The Myth', Feb 27 2024 (quotes Rick Wayne)",
     "url": "https://thebarbell.com/sergio-oliva/"
    },
    {
     "title": "GreatestPhysiques.com - Sergio Oliva (fan site; 2016, mod. 2018)",
     "url": "https://www.greatestphysiques.com/male-physiques/sergio-oliva/"
    },
    {
     "title": "FitnessVolt - Sergio Oliva profile",
     "url": "https://fitnessvolt.com/sergio-oliva/"
    }
   ],
   "notes": "Rick Wayne (quoted in The Barbell): 'His waist measured all of 29 inches, precisely the circumference of his thighs... His calves measured close to 20 inches!' GreatestPhysiques: arms 22.5, chest 59, waist 27. FitnessVolt: arms 20, waist 32, chest 52. Very wide spread (arm 20-22.5, chest 52-59, waist 27-32)."
  },
  {
   "key": "brian_shaw_height_weight",
   "label": "Brian Shaw (4x World's Strongest Man): height, bodyweight, body fat",
   "status": "disputed",
   "values": "{\"height_m\": [2.0, 2.032], \"height_orig\": \"6'8\\\" (WSM profile per Wikipedia; FitnessVolt) vs 6'6.75\\\" (his own 2025 'BODY FAT TEST' video per Wikipedia)\", \"weight_2019_start_lb\": 440, \"weight_2019_start_kg\": 199.6, \"weight_Feb2024_hydrostatic_lb\": 384.6, \"weight_Feb2024_kg\": 174.5, \"bodyfat_Feb2024_hydrostatic_pct\": 17.6, \"FFM_Feb2024_derived_kg\": 143.8, \"FV_weight_range_lb\": [385, 440], \"Wikipedia_weight_range_lb\": [340, 454], \"FFMI_derived_range\": [34.8, 35.9]}",
   "sources": [
    {
     "title": "FitnessVolt - Brian Shaw profile",
     "url": "https://fitnessvolt.com/brian-shaw/"
    },
    {
     "title": "FitnessVolt, Vedad Tabakovic, 'Brian Shaw's Body Fat Percentage Comes Out To 17.6% During Hydrostatic Testing', Feb 8 2024",
     "url": "https://fitnessvolt.com/brian-shaws-body-fat-percentage-hydrostatic-testing/"
    },
    {
     "title": "FitnessVolt, 'Brian Shaw weight loss journey', Aug 29 2019",
     "url": "https://fitnessvolt.com/brian-shaw-weight-loss-journey/"
    },
    {
     "title": "Wikipedia 'Brian Shaw (strongman)' raw wikitext (cites WSM profile archived 2018 for 6'8\" and SHAWSTRENGTH YouTube 'BODY FAT TEST' for 6'6.75\")",
     "url": "https://en.wikipedia.org/w/index.php?title=Brian_Shaw_(strongman)&action=raw"
    }
   ],
   "notes": "FitnessVolt Feb 8 2024: 'Brian came out at 384.6 pounds (174.5 kilograms)'; hydrostatic body fat 17.6% (filmed for his YouTube, Feb 1). Aug 2019: cutting 'to a goal weight of 400lbs, from a starting weight of 440lbs'. Shaw distrusted his earlier DXA results (reportedly too big for the machine). Height: I did not watch the YouTube short; the 6'6.75\" figure is as cited by Wikipedia. FFM and FFMI (34.8 at 2.03 m, 35.9 at 2.00 m) are my derivations."
  },
  {
   "key": "brian_shaw_girths",
   "label": "Brian Shaw: published girths",
   "status": "disputed",
   "values": "{\"arm\": \"unknown\", \"chest\": \"unknown\", \"waist\": \"unknown\", \"thigh\": \"unknown\", \"calf\": \"unknown\", \"neck\": \"unknown\", \"unreliable_web_claims_in\": {\"chest\": 60, \"biceps\": [20, 23], \"waist\": [40, 47], \"thigh\": 30}}",
   "sources": [
    {
     "title": "FitnessVolt - Brian Shaw profile",
     "url": "https://fitnessvolt.com/brian-shaw/"
    }
   ],
   "notes": "UNKNOWN from any credible source (the FitnessVolt profile lists no girths). A web search surfaced only low-quality SEO pages (chest ~60 in, biceps 20-23 in, waist 40-47 in, thigh 30 in) that contradict each other and also misstate his height (6'3\") - listed only so the owner knows they exist; do not use as data."
  },
  {
   "key": "hafthor_bjornsson_height_weight",
   "label": "Hafthor Julius Bjornsson (WSM 2018; deadlift WR 510 kg, 2025): height and bodyweights",
   "status": "reported",
   "values": "{\"height_m\": [2.05, 2.06], \"height_orig\": \"205 cm (WSM profile per Wikipedia; fight tale of tape '6 ft 9 in (205 cm)') / 206 cm (FitnessVolt '6'9\\\"')\", \"heaviest_2012_kg\": 210, \"heaviest_2012_lb\": 463, \"jul2025_selfreported_kg\": 200, \"jul2025_lb\": 440.9, \"boxing_weighin_19Mar2022_kg\": 152, \"boxing_weighin_lb\": 335, \"FV_profile_lb\": 323}",
   "sources": [
    {
     "title": "Wikipedia 'Hafthor Julius Bjornsson' raw wikitext (cites WSM profile archived 2018; his YouTube for 210 kg)",
     "url": "https://en.wikipedia.org/w/index.php?title=Haf%C3%BE%C3%B3r_J%C3%BAl%C3%ADus_Bj%C3%B6rnsson&action=raw"
    },
    {
     "title": "FitnessVolt - Hafthor Bjornsson profile",
     "url": "https://fitnessvolt.com/hafthor-bjornsson/"
    },
    {
     "title": "FitnessVolt, 'Hafthor Bjornsson Shares 200-kg (440.9-lb) Physique Update...', Jul 20 2025 (quotes his Instagram)",
     "url": "https://fitnessvolt.com/hafthor-bjornsson-200-kg-physique-update-upcoming-deadlift-world-record-attempt/"
    },
    {
     "title": "Wikipedia 'Eddie Hall vs. Hafthor Bjornsson' raw wikitext (tale of the tape)",
     "url": "https://en.wikipedia.org/w/index.php?title=Eddie_Hall_vs._Haf%C3%BE%C3%B3r_Bj%C3%B6rnsson&action=raw"
    },
    {
     "title": "Guinness World Records - Heaviest deadlift (male): 510 kg, 6 Sep 2025",
     "url": "https://www.guinnessworldrecords.com/world-records/heaviest-deadlift.html"
    }
   ],
   "notes": "Wikipedia: career-heaviest 210 kg at 2012 Europe's Strongest Man (cites his YouTube). July 2025 Instagram: '200kg bodyweight. I haven't felt this strong since 2020. I'm ready for 505kg' (FitnessVolt). Boxing vs Eddie Hall, Dubai 19 Mar 2022: 152 kg vs Hall 142 kg (tale of the tape). Wikipedia's infobox note claims 205 kg 'officially measured' at the Sept 2025 World Deadlift Championships - not verified (Guinness record page gives the 510 kg lift but no bodyweight). FitnessVolt profile '323 lbs' matches none of the dated figures and is undated. Girths: none found (unknown)."
  },
  {
   "key": "eddie_hall_height_weight",
   "label": "Eddie Hall (WSM 2017; first 500 kg deadlift 2016): height and bodyweights",
   "status": "measured",
   "values": "{\"height_measured_m\": 1.9, \"mass_measured_kg_c2018\": 172.0, \"height_selfreported\": \"6ft 2.5 (1.89 m)\", \"peak_selfreported_kg\": 196.5, \"peak_selfreported_lb\": 433, \"pre_boxing_Dec2021_kg\": 158, \"boxing_weighin_19Mar2022_kg\": 142, \"boxing_weighin_lb\": 313, \"FV_profile\": \"157 kg, 190 cm\"}",
   "sources": [
    {
     "title": "Balshaw TG, Massey GJ, Miller R, McDermott EJ, Maden-Wilkinson TM, Folland JP. Muscle and tendon morphology of a world strongman and deadlift champion. J Appl Physiol 2024;137(4):789-799 (full text PMC11486472)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC11486472/fullTextXML"
    },
    {
     "title": "talkSPORT, Josh Fordham, 'Eddie Hall posts incredible 31 stone throwback...', 21 Jan 2022 (quotes Hall's Instagram)",
     "url": "https://talksport.com/boxing/1025642/eddie-hall-throwback-transformation-weight-hafthor-bjornsson/"
    },
    {
     "title": "Wikipedia 'Eddie Hall vs. Hafthor Bjornsson' raw wikitext (tale of the tape)",
     "url": "https://en.wikipedia.org/w/index.php?title=Eddie_Hall_vs._Haf%C3%BE%C3%B3r_Bj%C3%B6rnsson&action=raw"
    },
    {
     "title": "FitnessVolt - Eddie Hall profile",
     "url": "https://fitnessvolt.com/eddie-hall-profile/"
    },
    {
     "title": "Wikipedia 'Eddie Hall' raw wikitext",
     "url": "https://en.wikipedia.org/w/index.php?title=Eddie_Hall&action=raw"
    }
   ],
   "notes": "Measured: Balshaw et al. 2024 Table 1, 1.90 m and 172.0 kg (lab visit ~14 months after his 2017 WSM win). Self-reported peak: Instagram 'This is what peak physical strength looks like! 196.5kg // 433lbs // 31stone // 6ft 2.5' (talkSPORT, 21 Jan 2022). Boxing weigh-in 142 kg (tale of the tape). Wikipedia lists 6 ft 2 in (citing a 2018 BarBend list, now a dead link) - the lab-measured 1.90 m should be preferred. Status 'measured' applies to the 1.90 m / 172.0 kg pair only; the others are reported. Girths: no tape girths found (only MRI leg volumes, see balshaw2024_eddie_hall_mri)."
  },
  {
   "key": "lasha_talakhadze_height_weight",
   "label": "Lasha Talakhadze (3x Olympic +109/+102 kg champion; total WR 492 kg): height and official bodyweights",
   "status": "official",
   "values": "{\"height_official_Tokyo2020_m\": 1.95, \"height_Olympedia_m\": 1.97, \"bodyweight_Rio2016_kg\": 157.34, \"bodyweight_Tokyo2020_kg\": 177.0, \"bodyweight_Paris2024_kg\": 178.45, \"bodyweight_Tokyo2020_lb\": 390.2, \"Olympedia_profile_kg\": \"158-160 (stale)\", \"Wikipedia_kg\": 183}",
   "sources": [
    {
     "title": "Tokyo 2020 official results site - athlete profile TALAKHADZE Lasha",
     "url": "https://stacy.olympics.com/tokyo-2020/olympic-games/en/results/weightlifting/athlete-profile-n1290690-talakhadze-lasha.htm"
    },
    {
     "title": "Olympedia - Lasha Talakhadze (athlete page)",
     "url": "https://www.olympedia.org/athletes/134095"
    },
    {
     "title": "Olympedia - 2016 Weightlifting Super-Heavyweight, Men results (bodyweight column)",
     "url": "https://www.olympedia.org/results/354353"
    },
    {
     "title": "Olympedia - 2020 Weightlifting Super-Heavyweight, Men results (bodyweight column)",
     "url": "https://www.olympedia.org/results/19002074"
    },
    {
     "title": "Olympedia - 2024 Weightlifting Super-Heavyweight, Men results (bodyweight column)",
     "url": "https://www.olympedia.org/results/2013236"
    },
    {
     "title": "Wikipedia 'Lasha Talakhadze' raw wikitext",
     "url": "https://en.wikipedia.org/w/index.php?title=Lasha_Talakhadze&action=raw"
    }
   ],
   "notes": "Bodyweights are the competition weigh-in values in Olympedia's results tables ('Bodyweight (kg)' column): Rio 2016 157.34 (473 kg total, gold, WR), Tokyo 2020 177.00 (488 kg, gold, WR/OR), Paris 2024 178.45 (470 kg, gold). Height is DISPUTED: Tokyo 2020 official profile 'Height ( m / ft ): 1.95/6'4''' vs Olympedia and Wikipedia 197 cm. Wikipedia's 183 kg is unsourced. Girths: unknown (none published)."
  },
  {
   "key": "natural_wnbf_malcolm_cooper",
   "label": "Malcolm Cooper - 2023 WNBF Pro Universe winner (drug-tested: polygraph + WADA-style urinalysis federation)",
   "status": "reported",
   "values": "{\"stage_weight_lb\": 174, \"stage_weight_kg\": 79, \"pre_2016_weight_lb\": \">260\", \"height\": \"unknown\", \"girths\": \"unknown\", \"age_y\": 37}",
   "sources": [
    {
     "title": "FitnessVolt, 'Malcolm Cooper Wins 2023 WNBF Pro Universe', Sep 28 2023",
     "url": "https://fitnessvolt.com/malcom-cooper-wins-2023-wnbf-pro-universe/"
    },
    {
     "title": "Breaking Muscle, Chris Colucci, 'Malcolm Cooper Wins 2023 WNBF Pro Universe', Oct 10 2023",
     "url": "https://breakingmuscle.com/2023-wnbf-pro-universe-results/"
    }
   ],
   "notes": "FitnessVolt (Sep 28 2023): 'Malcolm Cooper, who commanded the stage at a weight of 174 pounds... Cooper weighed over 260 pounds at one point before his amateur debut back in 2016.' Breaking Muscle: 'Cooper weighed roughly 174 pounds (79 kilograms)'. Height not found, so FFMI cannot be computed. For a named 'top natural' with height use the Chappell 2019 PRO group (1.77 m, ~82 kg stage, self-reported) or the Rossow 2013 case (FFMI 24.9 at 4.5% fat)."
  },
  {
   "key": "steve_reeves_presteroid",
   "label": "Steve Reeves (Mr America 1947, Mr Universe 1950) - pre-steroid-era reference (NOT drug-tested)",
   "status": "disputed",
   "values": "{\"program_1956\": {\"height_m\": 1.854, \"mass_kg\": 96.6, \"neck_m\": 0.447, \"arm_m\": 0.445, \"forearm_m\": 0.356, \"chest_m\": 1.219, \"waist_m\": 0.787, \"thigh_m\": 0.643, \"calf_m\": 0.445, \"orig\": \"6'1\\\", 213 lb, neck 17.6, arm 17.5, forearm 14, chest 48, waist 31, thigh 25.3, calf 17.5, wrist 7.9, ankle 9.8 in\"}, \"GreatestPhysiques\": {\"mass_kg\": [97.5, 102.1], \"arm_m\": 0.47, \"chest_m\": 1.321, \"waist_m\": 0.737, \"thigh_m\": 0.66, \"calf_m\": 0.47, \"orig\": \"215-225 lb, 6'1\\\", arms 18.5, chest 52, waist 29, thighs 26, calves 18.5 in\"}, \"FFMI_derived_at_5pct_fat\": 26.7}",
   "sources": [
    {
     "title": "MuscleMemory.org transcription: 'Measurements of Mr America winners taken when they won their titles, as listed in the program from the 1956 Mr USA contest' + later winners from magazines",
     "url": "https://s3.musclememory.net/articles/MrAsizes.html"
    },
    {
     "title": "GreatestPhysiques.com - Steve Reeves profile (fan site; published 2016-07-04, modified 2019-03-07)",
     "url": "https://www.greatestphysiques.com/male-physiques/steve-reeves/"
    }
   ],
   "notes": "Two incompatible sets: the 1956 Mr USA program (measurements 'taken when they won their titles') vs the widely repeated 18.5/52/29/26/18.5 set (GreatestPhysiques; probably later 'peak' or idealised figures - an unverified inference: the arm, neck and calf figures are all 18.5 in). A web-search summary also cited a Sept 1947 Muscle Power listing (neck 17 5/8, chest 49.5, biceps 18, waist 29, thigh 25.25, calf 17 1/8, 213 lb) but the page is script-rendered and I could not read it - unverified. FFMI 26.7 is my derivation (213 lb, 6'1\", assumed 5% fat)."
  },
  {
   "key": "fitnessvolt_db_ffmi_method",
   "label": "FitnessVolt database FFMI rankings (contest height/weight, assumed 6% body fat)",
   "status": "derived",
   "values": "{\"assumed_bodyfat_pct\": 6, \"Ronnie_Coleman\": {\"height\": \"5'11\\\"\", \"weight_lb\": 287, \"FFMI\": 37.8, \"norm\": 37.8}, \"Dorian_Yates\": {\"height\": \"5'10\\\"\", \"weight_lb\": 267, \"FFMI\": 35.5, \"norm\": 35.6}, \"Jay_Cutler\": {\"height\": \"5'10\\\"\", \"weight_lb\": 260, \"FFMI\": 35.0, \"norm\": 35.1}, \"Phil_Heath\": {\"height\": \"5'9\\\"\", \"weight_lb\": 240, \"FFMI\": 33.4, \"norm\": 33.7}, \"Big_Ramy\": {\"height\": \"5'9\\\"\", \"weight_lb\": 295, \"FFMI\": 41.1, \"norm\": 41.4, \"rank\": \"2nd of 316 measured men\"}, \"Sergio_Oliva\": {\"height\": \"5'10\\\"\", \"weight_lb\": 225, \"FFMI\": 30.3, \"norm\": 30.4}, \"Arnold\": {\"height\": \"6'2\\\"\", \"weight_lb\": 249, \"FFMI\": 30.1, \"norm\": 29.6}}",
   "sources": [
    {
     "title": "FitnessVolt Bodybuilding Database - Ronnie Coleman (height/weight, FFMI at assumed 6% BF; data updated Sep 30 2026)",
     "url": "https://fitnessvolt.com/bodybuilding/athletes/ronnie-coleman/"
    },
    {
     "title": "FitnessVolt Bodybuilding Database - Mamdouh Elssbiay",
     "url": "https://fitnessvolt.com/bodybuilding/athletes/mamdouh-elssbiay/"
    },
    {
     "title": "FitnessVolt Bodybuilding Database - Dorian Yates",
     "url": "https://fitnessvolt.com/bodybuilding/athletes/dorian-yates/"
    },
    {
     "title": "FitnessVolt Bodybuilding Database - Jay Cutler",
     "url": "https://fitnessvolt.com/bodybuilding/athletes/jay-cutler/"
    },
    {
     "title": "FitnessVolt Bodybuilding Database - Phil Heath",
     "url": "https://fitnessvolt.com/bodybuilding/athletes/phil-heath/"
    },
    {
     "title": "FitnessVolt Bodybuilding Database - Sergio Oliva",
     "url": "https://fitnessvolt.com/bodybuilding/athletes/sergio-oliva/"
    },
    {
     "title": "FitnessVolt Bodybuilding Database - Arnold Schwarzenegger",
     "url": "https://fitnessvolt.com/bodybuilding/athletes/arnold-schwarzenegger/"
    }
   ],
   "notes": "FitnessVolt: 'Both assume the 6% body fat a competitor steps on stage at, because that is the only condition the recorded weight was taken in.' Database holds height+weight for only 463 athletes. Note its single heights/weights differ from other sources (e.g. Jay 5'10\"/260, Dorian 267 lb, Arnold 249 lb)."
  },
  {
   "key": "derived_ffmi_pros",
   "label": "Derived FFMI of pro bodybuilders at reported stage weight (assumed 5% fat)",
   "status": "derived",
   "values": "{\"assumption_bodyfat_pct\": 5, \"Ronnie_2004_296lb_5ft11\": 39.2, \"Ronnie_2003_286lb\": 37.9, \"Dorian_1993_116.57kg_5ft10\": 35.0, \"Jay_2009_271lb_5ft9\": 38.0, \"Phil_2011_248lb_5ft9\": 34.8, \"Ramy_2015_307.5lb_5ft9\": 43.1, \"Ramy_2015_at_5ft11\": 40.7, \"Arnold_1971_246lb_6ft1.5\": 30.4, \"Arnold_1975_235lb\": 29.1, \"Sergio_1967_225lb_5ft10\": 30.7, \"Reeves_1947_213lb_6ft1\": 26.7, \"Shaw_2024_measured_17.6pct_at_2.03m\": 34.8, \"Kouri_natural_ceiling\": 25.0}",
   "sources": [
    {
     "title": "Kouri EM, Pope HG, Katz DL, Oliva P. Fat-free mass index in users and nonusers of anabolic-androgenic steroids. Clin J Sport Med 1995;5:223-228 (Europe PMC abstract record, PMID 7496846)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:7496846%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "My calculation: FFMI = mass*(1-bf)/h^2 using the reported weights/heights in the athlete facts above (Shaw uses his measured 17.6%). The open-class pros listed here, from Oliva (1967) on, land at 29-43, far above the Kouri natural ceiling of 25; stage body fat of 5% is an assumption (Bauer 2023 review: male near-contest 5.8-10.7%, which would lower these by ~0.4-2 units). Script: /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/buildcalc/scripts/ffmi_bb.py."
  }
 ]
}
```

</details>

<details>
<summary>Subagent `verify:comics` (build-calc-research, 2026-10-10 02:19:50 UTC): Mostly accurate. Every directly quoted number checks out against the source. Returned checks: 25 (e.g. superman; batman).</summary>

Workflow run `wf_16409832-67f`, phase `Verify`, agent `a62ced2642f99f67d`. Prompt, verbatim:

```text
Project: a small web calculator. The user picks a BUILD (average man or woman, athlete, record bodybuilder, strongman, comic-book character, or two original characters) and a HEIGHT, and the page shows estimated body WEIGHT and GIRTHS: chest, waist, upper arm (flexed), forearm, thigh, calf and neck. Every number must be sourced or clearly labelled as an estimate. The owner values factual accuracy over flattery: say "unknown" rather than invent, and label magazine-reported or fan-wiki numbers as such.
Write raw downloads and scripts under /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/buildcalc/<topic>/ (create it). Do not edit anything under /home/user. Use WebSearch/WebFetch for sources; prefer primary sources (journals, official databases, publisher handbooks) over wikis. For each fact give: key, label, value(s) with units (SI and the original units), status (measured | official | reported | derived | estimate | disputed), sources (title + URL actually fetched), and notes (what exactly the source says, caveats).

You are a skeptical fact-checker for the topic "comics". Below are the researcher's facts. Re-fetch at least 10 of the cited URLs (prioritise the numbers the calculator will lean on most) and check each value and status against what the source actually says; recompute any derived statistics you can (for ANSUR data, re-download and recompute a few percentiles). Mark ok=false with a correction for anything wrong, mislabelled (e.g. a fan wiki marked official), or unsupported. List important missing items.

FACTS:
{
 "summary": "I found stated heights and weights for all 15 requested characters, plus She-Hulk and Abomination. Hulk is split into four forms and Wolverine into with and without adamantium. Raw files are under /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/buildcalc/comics/: raw/marvel_*.html, raw/dc_*.html, raw/wiki/*.json and raw/wiki/revs/*.txt (fan-wiki revision samples), raw/ia_dk/*.txt (DK book OCR text) and raw/ia_fts_*.txt (archive.org search-inside snippets). Scripts are in scripts/ (metrics.py, revhist.py, revcomments.py, iafts.py, statctx.py, entry.py). Computed metrics are in out/metrics.json.\n\nSOURCES USED\n(1) Marvel.com character pages: official, and they show HEIGHT/WEIGHT. One exception: the Juggernaut page carries Marvel's own disclaimer that it is crowd-sourced content 'not yet verified for accuracy by our erudite editors'.\n(2) DC.com character pages: their 'Character Facts' give no height or weight for any of the five DC characters.\n(3) DK licensed encyclopedias, which are copyright DC Comics / Marvel and carry HEIGHT/WEIGHT factfiles. I treat them as official licensed references, not the Official Handbook of the Marvel Universe (OHOTMU) or DC's Who's Who:\n- DC Comics Encyclopedia New Edition (2021), full OCR read\n- DC Comics Encyclopedia (2008), archive.org search-inside snippets\n- DC Comics Universe Guide (2007), snippets\n- Batman Character Encyclopedia (2016), snippets\n- DC Comics Ultimate Character Guide New Edition (2019), full OCR read\n- Marvel Encyclopedia New Edition (2019), full OCR read\nThe full OCR texts come from third-party archive.org uploads of these books. OCR misreads were corrected by context (for example, 'Gft 3in' read as 6 ft 3 in).\n(4) Fan wikis (Marvel Database, DC Database), including their revision history and edit summaries. Status is always 'reported'.\n\nI could not open any OHOTMU edition directly. Archive.org's OHOTMU copies (1987, 2004, 2006, 2008) are lend-only: text download returned HTTP 401 and search-inside was refused. So every edition-specific OHOTMU claim below is reported second-hand by fan-wiki editors.\n\nDISAGREEMENTS (status 'disputed')\n- Juggernaut: 6 ft 10 in, 900 lb (DK 2019; the fan wiki's 2007 citation of marvel.com/universe; wiki editors say 'every handbook') vs 9 ft 5 in, 1,900 lb (current crowd-sourced Marvel.com page).\n- Doomsday: 7 ft 0 in, 615 lb (DK 2008) vs 7 ft 6 in, 915 lb (DK 2021) vs 8 ft 10 in, 915 lb (DK 2019 guide).\n- Savage Hulk: 7 ft, 1,040 lb (DK 2019) vs 7–8 ft, 1,040–1,400 lb (fan wiki citing handbooks).\n- She-Hulk: 650 lb (DK 2019) vs 700 lb (Marvel.com).\n- Wolverine: Marvel.com gives 300 lb with adamantium and 195 lb without. DK 2019 lists 195 lb while describing his adamantium skeleton.\n- Captain America: 240 lb (Marvel.com and DK 2019). A 220 lb figure for some handbooks is fan-reported only.\n\nGIRTHS: No official source gives chest, waist, arm, forearm, thigh, calf or neck measurements for any of these characters. They are 'unknown' throughout.\n\nPHYSICAL PLAUSIBILITY\nI computed BMI, weight/height^3 (ponderal index, PI) and an upper bound on Kouri-normalised fat-free mass index (FFMI) assuming 0% body fat. Human references:\n- WHO: obesity is BMI 30 or more. At 1.80 m, BMI 25 corresponds to PI 13.9 and BMI 30 to PI 16.7.\n- Kouri 1995: athletes who had not used steroids reached a normalised FFMI of at most 25.0; some steroid users exceeded 30.\nResults:\n- Within the human range: Batman, Black Panther and Superman. Captain America at 240 lb fits steroid-user values but not drug-free ones.\n- Beyond any human value in these references:\n  - Hulk forms: BMI 100–107, PI 44–53\n  - Abomination: BMI 108\n  - Darkseid: BMI 116\n  - Juggernaut: BMI 94–105\n  - Thor: BMI 74\n  - She-Hulk: BMI 73–79\n  - Thing: BMI 68\n  - Doomsday: BMI 57–79\n  - Kingpin and Luke Cage: BMI about 49–51\n  - Bane: BMI 38, or 47 on Venom\n  - Wolverine: BMI 34.5 even without adamantium, which means a normalised FFMI above 30 even at 15% body fat\n- Colossus: his stated 500 lb armoured weight is far below what a body of his size made of steel would weigh. Marvel.com says his armoured tissue is 'analogous to osmium and to carbon steel'.\nI do not offer explanations. Only the publishers' own statements are quoted: Kingpin's bulk 'mostly muscle', Luke Cage's 'dense muscle tissues', Colossus's steel-like tissue, and adamantium adding 105 lb.",
 "facts": [
  {
   "key": "superman",
   "label": "Superman (Clark Kent / Kal-El), DC",
   "status": "official",
   "values": "{\"height_m\":1.905,\"weight_kg\":106.6,\"orig\":\"6 ft 3 in, 235 lbs\",\"bmi\":29.4,\"pi_kg_m3\":15.4,\"girths\":\"unknown (no official source)\",\"alt_reported_weight_kg\":102.1,\"alt_reported_orig\":\"225 lbs (fan wiki 2009-2010 revisions, unsourced)\"}",
   "sources": [
    {
     "title": "DK DC Comics Encyclopedia New Edition (2021), archive.org OCR text (Copyright 2021 DC Comics)",
     "url": "https://archive.org/download/dc-comics-encyclopedia-new-edition/DC%20Comics%20Encyclopedia%2C%20New%20Edition_djvu.txt"
    },
    {
     "title": "DK The DC Comics Encyclopedia (2008), archive.org search-inside snippet",
     "url": "https://archive.org/services/search/beta/page_production/?service_backend=fts&page_type=collection_details&page_target=texts&user_query=identifier%3Adccomicsencyclop0000unse+AND+%22235+lbs%22"
    },
    {
     "title": "DK DC Comics Universe Guide (2007), archive.org search-inside snippet",
     "url": "https://archive.org/details/dccomicsuniverse0000alas"
    },
    {
     "title": "DC.com Superman character page (no height/weight given)",
     "url": "https://www.dc.com/characters/superman"
    },
    {
     "title": "DC Database (fan wiki) Kal-El (New Earth), wikitext + revision history via API",
     "url": "https://dc.fandom.com/api.php?action=parse&page=Kal-El_(New_Earth)&prop=wikitext&format=json"
    }
   ],
   "notes": "DK 2021 factfile, OCR-corrected: 'HEIGHT 6ft 3in WEIGHT 235 lbs EYES Blue HAIR Black'. The DK 2008 snippet and the DK 2007 Universe Guide snippet both read 'journalist BASE Metropolis Height 6ft 3in Weight 235 lbs Eyes Blue Hair Black'. So DK is consistent across 2007, 2008 and 2021. DC.com 'Character Facts' list only powers, first appearance, alter ego, base and occupation. The 225 lb figure is widely repeated online and appeared in DC Database revisions in 2009-10, but I found no official source for it. Status for 225 lb: reported. Girths: none in any source."
  },
  {
   "key": "batman",
   "label": "Batman (Bruce Wayne), DC",
   "status": "official",
   "values": "{\"height_m\":1.88,\"weight_kg\":95.3,\"orig\":\"6 ft 2 in, 210 lbs\",\"book_metric\":\"1.88 m, 95 kg (DK 2019 guide)\",\"bmi\":27.0,\"pi_kg_m3\":14.3,\"girths\":\"unknown (no official source)\"}",
   "sources": [
    {
     "title": "DK DC Comics Encyclopedia New Edition (2021), archive.org OCR text",
     "url": "https://archive.org/download/dc-comics-encyclopedia-new-edition/DC%20Comics%20Encyclopedia%2C%20New%20Edition_djvu.txt"
    },
    {
     "title": "DK DC Comics Ultimate Character Guide New Edition (2019), archive.org OCR text",
     "url": "https://archive.org/download/dc-comics-ultimate-character-guide-new-edition/DC%20Comics%20Ultimate%20Character%20Guide%2C%20New%20Edition_djvu.txt"
    },
    {
     "title": "DK Batman Character Encyclopedia (2016), archive.org search-inside snippet",
     "url": "https://archive.org/details/batmancharactere0000matt"
    },
    {
     "title": "DK The DC Comics Encyclopedia (2008), archive.org search-inside snippet",
     "url": "https://archive.org/services/search/beta/page_production/?service_backend=fts&page_type=collection_details&page_target=texts&user_query=identifier%3Adccomicsencyclop0000unse+AND+%22210+lbs%22"
    },
    {
     "title": "DC.com Batman character page (no height/weight given)",
     "url": "https://www.dc.com/characters/batman"
    }
   ],
   "notes": "DK 2021: 'HEIGHT 6ft 2in WEIGHT 210 lbs EYES Blue HAIR Black'. DK 2019 guide: 'REAL NAME Bruce Wayne ... HEIGHT 6 ft 2 in (1.88 m) WEIGHT 210 lb (95 kg) BASE Gotham City'. DK 2016 snippet: 'Hero, crime fighter Height: 6ft 2in Weight: 210 lbs Base: Gotham City'. The DK 2008 snippet shows 'Gotham City ... 6ft 2in WEIGHT 210 lbs Eyes Blue Hair Black'. A 2007 DC Database revision said 225 lbs (unsourced, fan). Girths: none."
  },
  {
   "key": "captain_america",
   "label": "Captain America (Steve Rogers), Marvel",
   "status": "official",
   "values": "{\"height_m\":1.88,\"weight_kg\":108.9,\"orig\":\"6 ft 2 in, 240 lbs\",\"bmi\":30.8,\"pi_kg_m3\":16.4,\"alt_reported_weight_kg\":99.8,\"alt_reported_orig\":\"220 lbs (fan-reported for some handbooks)\",\"girths\":\"unknown (no official source)\"}",
   "sources": [
    {
     "title": "Marvel.com Captain America (Steve Rogers) In Comics",
     "url": "https://www.marvel.com/characters/captain-america-steve-rogers/in-comics"
    },
    {
     "title": "DK Marvel Encyclopedia New Edition (2019), archive.org OCR text (2019 MARVEL)",
     "url": "https://archive.org/download/marvel-encyclopedia-new-edition_202312/Marvel%20Encyclopedia%20New%20Edition_djvu.txt"
    },
    {
     "title": "Marvel Database (fan wiki) Steven Rogers (Earth-616): revision edit summaries via API",
     "url": "https://marvel.fandom.com/api.php?action=query&prop=revisions&titles=Steven_Rogers_(Earth-616)&rvprop=ids|timestamp|comment|user&rvlimit=500&format=json"
    }
   ],
   "notes": "Marvel.com: 'HEIGHT 6'2'' WEIGHT 240 lbs.' DK 2019 factfile: 'HEIGHT 6ft2in WEIGHT 240 lbs'. Fan-wiki edit summaries, not verified, say the following. Civil War: Battle Damage Report (2007) lists 220 lb. A 2004 Avengers handbook lists 220. The OHOTMU editions of 2006 and 2008 list 240. Avengers: Roll Call #1 lists 240. The fan wiki currently shows 220. A fan-wiki editor also wrote in 2026 that 'Marvel.com profiles are too often incomplete and inaccurate' compared with the handbooks. Reported range across all sources: 220-240 lb. Girths: none."
  },
  {
   "key": "thor",
   "label": "Thor (Thor Odinson) and human host Donald Blake, Marvel",
   "status": "official",
   "values": "{\"height_m\":1.981,\"weight_kg\":290.3,\"orig\":\"6 ft 6 in, 640 lbs\",\"blake_height_m\":1.753,\"blake_weight_kg\":68.0,\"blake_orig\":\"5 ft 9 in, 150 lbs\",\"bmi\":74.0,\"pi_kg_m3\":37.3,\"girths\":\"unknown (no official source)\"}",
   "sources": [
    {
     "title": "Marvel.com Thor (Thor Odinson) In Comics",
     "url": "https://www.marvel.com/characters/thor-thor-odinson/in-comics"
    },
    {
     "title": "DK Marvel Encyclopedia New Edition (2019), archive.org OCR text",
     "url": "https://archive.org/download/marvel-encyclopedia-new-edition_202312/Marvel%20Encyclopedia%20New%20Edition_djvu.txt"
    },
    {
     "title": "Marvel Database (fan wiki) Thor Odinson (Earth-616) wikitext via API",
     "url": "https://marvel.fandom.com/api.php?action=parse&page=Thor_Odinson_(Earth-616)&prop=wikitext&format=json&redirects=1"
    }
   ],
   "notes": "Marvel.com: 'HEIGHT Thor: 6'6\", Donald Blake: 5'9\" WEIGHT Thor: 640 lbs., Donald Blake: 150 lbs.' DK 2019: 'HEIGHT 6ft6 in WEIGHT 640 lbs'. The fan wiki has shown the same 6 ft 6 in, 640 lb in every yearly sample since 2007, so no edition disagreement was found. Marvel.com gives no density explanation. Girths: none."
  },
  {
   "key": "hulk_banner",
   "label": "Bruce Banner (Hulk's human form), Marvel",
   "status": "official",
   "values": "{\"height_m\":1.753,\"weight_kg\":58.1,\"orig\":\"5 ft 9 in, 128 lbs\",\"alt_reported_height_m\":1.778,\"alt_reported_orig\":\"5 ft 10 in (fan wiki citing Avengers: Roll Call #1, 2012)\",\"bmi\":18.9,\"pi_kg_m3\":10.8,\"girths\":\"unknown\"}",
   "sources": [
    {
     "title": "Marvel.com Hulk (Bruce Banner) In Comics",
     "url": "https://www.marvel.com/characters/hulk-bruce-banner/in-comics"
    },
    {
     "title": "Marvel Database (fan wiki) Bruce Banner (Earth-616) wikitext via API",
     "url": "https://marvel.fandom.com/api.php?action=parse&page=Bruce_Banner_(Earth-616)&prop=wikitext&format=json&redirects=1"
    }
   ],
   "notes": "Marvel.com: 'HEIGHT Bruce Banner: 5'9'', Hulk: 7'6'' WEIGHT Bruce Banner: 128 lbs., Hulk: 1150 lbs.' The fan wiki has listed 5 ft 10 in since 2015, and a 2019 revision cites Avengers: Roll Call #1 for it (reported). Isometric scaling of Banner's 128 lb (derived) gives about 231 lb at 7 ft, 284 lb at 7 ft 6 in and 345 lb at 8 ft. Compare the stated Hulk weights of 1,040-1,400 lb."
  },
  {
   "key": "hulk_savage",
   "label": "Hulk, savage green form, Marvel",
   "status": "disputed",
   "values": "{\"height_m_min\":2.134,\"height_m_max\":2.438,\"weight_kg_min\":471.7,\"weight_kg_max\":635.0,\"orig\":\"7 ft / 1,040 lbs (DK 2019); 7-8 ft / 1,040-1,400 lbs (fan wiki)\",\"bmi_range\":\"103.6-106.8\",\"pi_kg_m3_range\":\"43.8-48.6\",\"girths\":\"unknown\"}",
   "sources": [
    {
     "title": "DK Marvel Encyclopedia New Edition (2019), archive.org OCR text: 'THE HULK' factfile",
     "url": "https://archive.org/download/marvel-encyclopedia-new-edition_202312/Marvel%20Encyclopedia%20New%20Edition_djvu.txt"
    },
    {
     "title": "Marvel Database (fan wiki) Bruce Banner (Earth-616) wikitext + revision comments via API",
     "url": "https://marvel.fandom.com/api.php?action=parse&page=Bruce_Banner_(Earth-616)&prop=wikitext&format=json&redirects=1"
    },
    {
     "title": "Adventure International 'Hulk' (1984 licensed game) manual, archive.org search-inside snippet",
     "url": "https://archive.org/details/vgmuseum_ai_hulk-c64-manual"
    }
   ],
   "notes": "DK 2019 factfile: 'REAL NAME Robert Bruce Banner ... HEIGHT 7ft WEIGHT 1,040 lbs EYES Green HAIR Green'. The fan wiki gives Savage Hulk '7' ... lowest limit; 8' ... highest limit' and '1040 lbs ... 1400 lbs'. A 2018 edit summary attributes the Hulk profile to the OHOTMU A to Z (2008) entry (reported, not verified). The 1984 licensed game manual snippet reads 'Weight: 1,040 lbs. Eyes: Green Hair: Green'; its height is garbled in OCR. Marvel.com gives a single Hulk value of 7 ft 6 in / 1,150 lb (see hulk_merged_marvelcom). Girths: none."
  },
  {
   "key": "hulk_grey_joe_fixit",
   "label": "Hulk, grey 'Joe Fixit' form, Marvel",
   "status": "reported",
   "values": "{\"height_m\":1.981,\"weight_kg\":408.2,\"orig\":\"6 ft 6 in, 900 lbs\",\"bmi\":104.0,\"pi_kg_m3\":52.5,\"girths\":\"unknown\"}",
   "sources": [
    {
     "title": "Marvel Database (fan wiki) Bruce Banner (Earth-616) wikitext via API",
     "url": "https://marvel.fandom.com/api.php?action=parse&page=Bruce_Banner_(Earth-616)&prop=wikitext&format=json&redirects=1"
    }
   ],
   "notes": "The fan wiki gives '6'6\" (Joe Fixit)' and '900 lbs (Joe Fixit)'. This was also its 'Gray Hulk' value from 2021 to 2024. No official page I fetched gives a separate grey-Hulk figure. Marvel.com has no Joe Fixit page; the slugs I tried returned 404. The DK 2019 Hulk entry gives only 7 ft / 1,040 lb. Treat as fan-reported."
  },
  {
   "key": "hulk_merged_marvelcom",
   "label": "Hulk as listed on Marvel.com (fan wiki calls these the 'Merged Hulk' values), Marvel",
   "status": "official",
   "values": "{\"height_m\":2.286,\"weight_kg\":521.6,\"orig\":\"7 ft 6 in, 1,150 lbs\",\"bmi\":99.8,\"pi_kg_m3\":43.7,\"girths\":\"unknown\"}",
   "sources": [
    {
     "title": "Marvel.com Hulk (Bruce Banner) In Comics",
     "url": "https://www.marvel.com/characters/hulk-bruce-banner/in-comics"
    },
    {
     "title": "Marvel Database (fan wiki) Bruce Banner (Earth-616) wikitext via API",
     "url": "https://marvel.fandom.com/api.php?action=parse&page=Bruce_Banner_(Earth-616)&prop=wikitext&format=json&redirects=1"
    }
   ],
   "notes": "Marvel.com gives 'Hulk: 7'6'' / 1150 lbs.' and does not say which form. The fan wiki assigns 7 ft 6 in / 1,150 lb to 'the Merged Hulk' (reported). Official Hulk values therefore differ by source: 7 ft / 1,040 lb in DK 2019 versus 7 ft 6 in / 1,150 lb on Marvel.com."
  },
  {
   "key": "thing",
   "label": "The Thing (Ben Grimm), Marvel",
   "status": "official",
   "values": "{\"height_m\":1.829,\"weight_kg\":226.8,\"orig\":\"6 ft, 500 lbs\",\"alt_reported\":\"6 ft 6 in (1.981 m), 430 lbs (195.0 kg) in the fan wiki infobox; the same wiki's body text says 6 ft 6 in and 'almost 500 pounds', citing The Thing #1 (2022)\",\"bmi\":67.8,\"pi_kg_m3\":37.1,\"girths\":\"unknown\"}",
   "sources": [
    {
     "title": "Marvel.com The Thing (Benjamin Grimm) In Comics",
     "url": "https://www.marvel.com/characters/the-thing-benjamin-grimm/in-comics"
    },
    {
     "title": "DK Marvel Encyclopedia New Edition (2019), archive.org OCR text",
     "url": "https://archive.org/download/marvel-encyclopedia-new-edition_202312/Marvel%20Encyclopedia%20New%20Edition_djvu.txt"
    },
    {
     "title": "Marvel Database (fan wiki) Benjamin Grimm (Earth-616) wikitext via API",
     "url": "https://marvel.fandom.com/api.php?action=parse&page=Benjamin_Grimm_(Earth-616)&prop=wikitext&format=json&redirects=1"
    },
    {
     "title": "Marvel Database (fan wiki) Thing Vol 3 1 issue page via API",
     "url": "https://marvel.fandom.com/api.php?action=parse&page=Thing_Vol_3_1&prop=wikitext&format=json&redirects=1"
    }
   ],
   "notes": "Marvel.com: 'HEIGHT 6' WEIGHT 500 lbs.' DK 2019: 'HEIGHT 6 ft WEIGHT 500 lbs'. The fan wiki showed 6 ft / 500 lb from 2007 to 2024. In 2025 it changed to 6 ft 6 in / 430 lb, citing The Thing #1 (2022, Walter Mosley, released Nov 10, 2021). Its body text, citing the same issue, says 'He now walks around at 6'6' feet and almost 500 pounds'. So the fan wiki contradicts itself, and I could not verify the comic text. The fan wiki also notes he is 'often depicted as being much taller' than the 6 ft listing."
  },
  {
   "key": "juggernaut",
   "label": "Juggernaut (Cain Marko), Marvel",
   "status": "disputed",
   "values": "{\"height_m_min\":2.083,\"height_m_max\":2.87,\"weight_kg_min\":408.2,\"weight_kg_max\":861.8,\"orig\":\"6 ft 10 in / 900 lbs (DK 2019; handbooks per fan wiki) vs 9 ft 5 in / 1,900 lbs (current Marvel.com, crowd-sourced)\",\"bmi_range\":\"94.1-104.6\",\"pi_kg_m3_range\":\"36.4-45.2\",\"girths\":\"unknown\"}",
   "sources": [
    {
     "title": "Marvel.com Juggernaut (Cain Marko) page",
     "url": "https://www.marvel.com/characters/juggernaut-cain-marko"
    },
    {
     "title": "DK Marvel Encyclopedia New Edition (2019), archive.org OCR text",
     "url": "https://archive.org/download/marvel-encyclopedia-new-edition_202312/Marvel%20Encyclopedia%20New%20Edition_djvu.txt"
    },
    {
     "title": "Marvel Database (fan wiki) Cain Marko (Earth-616): yearly revision samples and edit summaries via API",
     "url": "https://marvel.fandom.com/api.php?action=query&prop=revisions&titles=Cain_Marko_(Earth-616)&rvprop=ids|timestamp|comment|user&rvlimit=500&format=json"
    }
   ],
   "notes": "The Marvel.com page says 'Take note, True Believer! This crowd-sourced content has not yet been verified for accuracy by our erudite editors!' followed by 'HEIGHT 9'5\" WEIGHT 1,900 lbs.' This was the only page among those fetched with that disclaimer. DK 2019 factfile (REAL NAME Cain Marko): 'HEIGHT 6 ft 10 in WEIGHT 900 lbs EYES Blue HAIR Red'. A Dec 2007 fan-wiki revision gave 6 ft 10 in / 900 lb citing http://marvel.com/universe/Juggernaut_(Cain_Marko); I could not check that archived page because Wayback is blocked here. Fan-wiki editors wrote in 2022 and 2024: 'Every handbook says that Juggernaut is 6'10\" and weighs 900 lbs' (reported). The wiki changed to 9 ft 5 in / 1,900 lb around 2012 and has gone back and forth since. Range: 6 ft 10 in-9 ft 5 in, 900-1,900 lb."
  },
  {
   "key": "colossus",
   "label": "Colossus (Piotr Rasputin), human and armoured forms, Marvel",
   "status": "official",
   "values": "{\"human_height_m\":1.981,\"human_weight_kg\":113.4,\"human_orig\":\"6 ft 6 in, 250 lbs\",\"armored_height_m\":2.261,\"armored_weight_kg\":226.8,\"armored_orig\":\"7 ft 5 in, 500 lbs\",\"human_bmi\":28.9,\"armored_bmi\":44.4,\"armored_pi_kg_m3\":19.6,\"girths\":\"unknown\"}",
   "sources": [
    {
     "title": "Marvel.com Colossus (Piotr Rasputin)",
     "url": "https://www.marvel.com/characters/colossus-piotr-rasputin"
    },
    {
     "title": "DK Marvel Encyclopedia New Edition (2019), archive.org OCR text",
     "url": "https://archive.org/download/marvel-encyclopedia-new-edition_202312/Marvel%20Encyclopedia%20New%20Edition_djvu.txt"
    }
   ],
   "notes": "Marvel.com: 'HEIGHT Piotr Rasputin: 6'6\", Colossus: 7'5\" WEIGHT Piotr Rasputin: 250 lbs., Colossus: 500 lbs.' It also says he 'can convert the tissue of his entire body into an organic, steel-like substance analogous to osmium and to carbon steel'. DK 2019 lists only the armoured form: '7 ft 5 in (armored) / 500 lbs (armored)'. A 2009 fan-wiki edit updated the height per OHOTMU A to Z hardcover Vol 2 (reported). See colossus_density_check."
  },
  {
   "key": "wolverine",
   "label": "Wolverine (James Howlett / Logan), with and without adamantium, Marvel",
   "status": "disputed",
   "values": "{\"height_m\":1.6,\"orig_height\":\"5 ft 3 in\",\"weight_with_adamantium_kg\":136.1,\"weight_without_adamantium_kg\":88.5,\"orig_weight\":\"300 lbs with adamantium, 195 lbs without (Marvel.com); 195 lbs (DK 2019, no qualifier)\",\"adamantium_added_kg\":47.6,\"adamantium_added_lb\":105,\"bmi_with\":53.1,\"bmi_without\":34.5,\"pi_with\":33.2,\"pi_without\":21.6,\"girths\":\"unknown\"}",
   "sources": [
    {
     "title": "Marvel.com Wolverine (Logan/James Howlett) In Comics",
     "url": "https://www.marvel.com/characters/wolverine-james-howlett/in-comics"
    },
    {
     "title": "DK Marvel Encyclopedia New Edition (2019), archive.org OCR text",
     "url": "https://archive.org/download/marvel-encyclopedia-new-edition_202312/Marvel%20Encyclopedia%20New%20Edition_djvu.txt"
    },
    {
     "title": "Marvel Database (fan wiki) James Howlett (Earth-616) wikitext via API",
     "url": "https://marvel.fandom.com/api.php?action=parse&page=James_Howlett_(Earth-616)&prop=wikitext&format=json&redirects=1"
    }
   ],
   "notes": "Marvel.com: 'HEIGHT 5'3\" WEIGHT 300 lbs., Without Adamantium skeleton: 195 lbs.' It also says the alloy 'adds an extra 105 pounds to his frame—or 47.6 kilograms'. DK 2019 factfile: 'HEIGHT 5 ft3in WEIGHT 195 lbs', and the same entry says 'His skeleton has been laced with the unbreakable metal Adamantium'. DK therefore gives 195 lb with no 'without adamantium' qualifier, which is why this is disputed (range 195-300 lb). Height is 5 ft 3 in in every source and every wiki revision sampled since 2007. The fan wiki cites Wolverine: Weapon X #5 for 'nearly 100 pounds of Adamantium' (story text, reported)."
  },
  {
   "key": "kingpin",
   "label": "Kingpin (Wilson Fisk), Marvel",
   "status": "official",
   "values": "{\"height_m\":2.007,\"weight_kg\":204.1,\"orig\":\"6 ft 7 in, 450 lbs\",\"bmi\":50.7,\"pi_kg_m3\":25.3,\"girths\":\"unknown\"}",
   "sources": [
    {
     "title": "Marvel.com Kingpin (Wilson Fisk) In Comics",
     "url": "https://www.marvel.com/characters/kingpin/in-comics"
    },
    {
     "title": "DK Marvel Encyclopedia New Edition (2019), archive.org OCR text",
     "url": "https://archive.org/download/marvel-encyclopedia-new-edition_202312/Marvel%20Encyclopedia%20New%20Edition_djvu.txt"
    },
    {
     "title": "Marvel Database (fan wiki) Wilson Fisk (Earth-616) wikitext via API",
     "url": "https://marvel.fandom.com/api.php?action=parse&page=Wilson_Fisk_(Earth-616)&prop=wikitext&format=json&redirects=1"
    }
   ],
   "notes": "Marvel.com: 'HEIGHT 6'7\" WEIGHT 450 lbs.' and 'Most of Fisk's bulk is actually muscle, not fat; his enormous size is comparable to that of a sumo wrestler.' DK 2019: 'HEIGHT 6 ft7 in WEIGHT 450 lbs'. The fan wiki says 'only the bare 9 pounds actually being fat', citing OHOTMU: Daredevil 2004. That is reported only; I could not verify it in the primary source, and web searches found only copies of the wiki text. Taking 'mostly muscle' at face value implies a normalised FFMI near 45-49, far above the Kouri 1995 human values (derived)."
  },
  {
   "key": "luke_cage",
   "label": "Luke Cage (Carl Lucas), Marvel",
   "status": "official",
   "values": "{\"height_m\":1.981,\"weight_kg\":192.8,\"orig\":\"6 ft 6 in, 425 lbs\",\"bmi\":49.1,\"pi_kg_m3\":24.8,\"girths\":\"unknown\"}",
   "sources": [
    {
     "title": "Marvel.com Luke Cage In Comics",
     "url": "https://www.marvel.com/characters/luke-cage/in-comics"
    },
    {
     "title": "DK Marvel Encyclopedia New Edition (2019), archive.org OCR text",
     "url": "https://archive.org/download/marvel-encyclopedia-new-edition_202312/Marvel%20Encyclopedia%20New%20Edition_djvu.txt"
    }
   ],
   "notes": "Marvel.com: 'HEIGHT 6'6\" WEIGHT 425 lbs.' Its powers list includes 'Superdense Body Mass', and it says his skin is bulletproof 'thanks to the incredibly dense muscle tissues created by the experiment'. DK 2019 gives 'HEIGHT 6ft6in'; its weight line is illegible in OCR in both archive.org copies. The fan wiki has said 6 ft 6 in / 425 lb since 2007."
  },
  {
   "key": "black_panther",
   "label": "Black Panther (T'Challa), Marvel",
   "status": "official",
   "values": "{\"height_m\":1.829,\"weight_kg\":90.7,\"orig\":\"6 ft, 200 lbs\",\"bmi\":27.1,\"pi_kg_m3\":14.8,\"girths\":\"unknown\"}",
   "sources": [
    {
     "title": "Marvel.com Black Panther (T'Challa) In Comics",
     "url": "https://www.marvel.com/characters/black-panther-t-challa/in-comics"
    },
    {
     "title": "DK Marvel Encyclopedia New Edition (2019), archive.org OCR text",
     "url": "https://archive.org/download/marvel-encyclopedia-new-edition_202312/Marvel%20Encyclopedia%20New%20Edition_djvu.txt"
    }
   ],
   "notes": "Marvel.com: 'HEIGHT 6' WEIGHT 200 lbs.' DK 2019: 'HEIGHT 6 ft WEIGHT 200 lbs'. Fan-wiki revisions from 2007-08 said 185 lb (unsourced) and changed to 200 in 2009. This build is plausible for a human: normalised FFMI is about 24 at 10% body fat (derived)."
  },
  {
   "key": "bane",
   "label": "Bane, DC",
   "status": "official",
   "values": "{\"height_m\":2.032,\"weight_kg\":158.8,\"orig\":\"6 ft 8 in, 350 lbs\",\"with_venom_kg\":192.8,\"with_venom_orig\":\"425 lbs with Venom (DK 2021)\",\"book_metric\":\"2.03 m, 159 kg (DK 2019 guide)\",\"bmi\":38.4,\"bmi_venom\":46.7,\"pi_kg_m3\":18.9,\"girths\":\"unknown\"}",
   "sources": [
    {
     "title": "DK DC Comics Encyclopedia New Edition (2021), archive.org OCR text",
     "url": "https://archive.org/download/dc-comics-encyclopedia-new-edition/DC%20Comics%20Encyclopedia%2C%20New%20Edition_djvu.txt"
    },
    {
     "title": "DK DC Comics Ultimate Character Guide New Edition (2019), archive.org OCR text",
     "url": "https://archive.org/download/dc-comics-ultimate-character-guide-new-edition/DC%20Comics%20Ultimate%20Character%20Guide%2C%20New%20Edition_djvu.txt"
    },
    {
     "title": "DK The DC Comics Encyclopedia (2008), archive.org search-inside snippet",
     "url": "https://archive.org/services/search/beta/page_production/?service_backend=fts&page_type=collection_details&page_target=texts&user_query=identifier%3Adccomicsencyclop0000unse+AND+%22350+lbs%22"
    },
    {
     "title": "DC.com Bane page (no height/weight given)",
     "url": "https://www.dc.com/characters/bane"
    }
   ],
   "notes": "DK 2021: 'HEIGHT 6ft 8in WEIGHT 350 lbs (425 lbs with Venom)'. DK 2019 guide: 'HEIGHT 6 ft 8 in (2.03 m) WEIGHT 350 lb (159 kg)'. The DK 2008 snippet shows 'REAL NAME Unknown | Base Gotham City | WEIGHT 350 lbs'; its height was not in the snippet. Fan-wiki revisions included 6 ft 8 in / 400 lb in 2008 (unsourced). At 10% body fat his normalised FFMI is about 33, above every non-user in Kouri 1995 and at the top of the steroid-user range (derived)."
  },
  {
   "key": "doomsday",
   "label": "Doomsday, DC",
   "status": "disputed",
   "values": "{\"height_m_min\":2.134,\"height_m_max\":2.692,\"weight_kg_min\":279.0,\"weight_kg_max\":415.0,\"orig\":\"7 ft 0 in / 615 lbs (DK 2008); 7 ft 6 in / 915 lbs (DK 2021); 8 ft 10 in / 915 lbs (DK 2019 guide, book metric 2.69 m / 415 kg)\",\"bmi_range\":\"57.3-79.4\",\"pi_kg_m3_range\":\"21.3-34.7\",\"girths\":\"unknown\"}",
   "sources": [
    {
     "title": "DK The DC Comics Encyclopedia (2008), archive.org search-inside snippet",
     "url": "https://archive.org/services/search/beta/page_production/?service_backend=fts&page_type=collection_details&page_target=texts&user_query=identifier%3Adccomicsencyclop0000unse+AND+%22615%22"
    },
    {
     "title": "DK DC Comics Encyclopedia New Edition (2021), archive.org OCR text",
     "url": "https://archive.org/download/dc-comics-encyclopedia-new-edition/DC%20Comics%20Encyclopedia%2C%20New%20Edition_djvu.txt"
    },
    {
     "title": "DK DC Comics Ultimate Character Guide New Edition (2019), archive.org OCR text",
     "url": "https://archive.org/download/dc-comics-ultimate-character-guide-new-edition/DC%20Comics%20Ultimate%20Character%20Guide%2C%20New%20Edition_djvu.txt"
    },
    {
     "title": "DC Database (fan wiki) Doomsday (New Earth): revision samples via API",
     "url": "https://dc.fandom.com/api.php?action=parse&page=Doomsday_(New_Earth)&prop=wikitext&format=json&redirects=1"
    },
    {
     "title": "DC.com Doomsday page (no height/weight given)",
     "url": "https://www.dc.com/characters/doomsday"
    }
   ],
   "notes": "DK 2008 snippet: 'Destroyer BASE Earth ... HEIGHT 7ft WEIGHT 615 lbs Eyes Red Hair White'. DK 2021, OCR-corrected: 'HEIGHT 7ft 6in WEIGHT 915 lbs EYES Red HAIR White'. DK 2019 guide: 'HEIGHT 8 ft 10 in (2.69 m) WEIGHT 915 lb (415 kg)'. DC Database revisions from 2007 to 2015 gave 8 ft 0 in, then 8 ft 10 in, with 915 lb (unsourced). In 2016 it switched to 7 ft 0 in / 615 lb citing DK 2008, and its Prime Earth page uses 7 ft 6 in / 915 lb citing the DK New Edition. Range: 7 ft 0 in-8 ft 10 in, 615-915 lb."
  },
  {
   "key": "darkseid",
   "label": "Darkseid (Uxas), DC",
   "status": "official",
   "values": "{\"height_m\":2.667,\"weight_kg\":823.3,\"orig\":\"8 ft 9 in, 1,815 lbs\",\"book_metric\":\"2.67 m, 823 kg (DK 2019 guide)\",\"bmi\":115.7,\"pi_kg_m3\":43.4,\"girths\":\"unknown\"}",
   "sources": [
    {
     "title": "DK DC Comics Encyclopedia New Edition (2021), archive.org OCR text",
     "url": "https://archive.org/download/dc-comics-encyclopedia-new-edition/DC%20Comics%20Encyclopedia%2C%20New%20Edition_djvu.txt"
    },
    {
     "title": "DK The DC Comics Encyclopedia (2008), archive.org search-inside snippet",
     "url": "https://archive.org/services/search/beta/page_production/?service_backend=fts&page_type=collection_details&page_target=texts&user_query=identifier%3Adccomicsencyclop0000unse+AND+%221%2C815%22"
    },
    {
     "title": "DK DC Comics Universe Guide (2007), archive.org search-inside snippet",
     "url": "https://archive.org/details/dccomicsuniverse0000alas"
    },
    {
     "title": "DK DC Comics Ultimate Character Guide New Edition (2019), archive.org OCR text",
     "url": "https://archive.org/download/dc-comics-ultimate-character-guide-new-edition/DC%20Comics%20Ultimate%20Character%20Guide%2C%20New%20Edition_djvu.txt"
    },
    {
     "title": "DC.com Darkseid page (no height/weight given)",
     "url": "https://www.dc.com/characters/darkseid"
    }
   ],
   "notes": "DK 2021, OCR-corrected: 'HEIGHT 8ft 9in WEIGHT 1,815 lbs EYES Red HAIR None'. DK 2008: 'BASE Apokolips ... HEIGHT 8ft 9in WEIGHT 1,815 lbs'. DK 2007: 'Base Apokolips Height 8ft 9in Weight 1,815 lbs'. DK 2019 guide: 'HEIGHT 8 ft. 9 in (2.67 m) WEIGHT 1,815 lb (823 kg)'. DK is consistent across 2007-2021. A 2007 DC Database revision gave 8 ft 5 in / 1,515 lb (unsourced, fan)."
  },
  {
   "key": "she_hulk",
   "label": "She-Hulk (Jennifer Walters), Marvel (bonus)",
   "status": "disputed",
   "values": "{\"height_m\":2.007,\"weight_kg_min\":294.8,\"weight_kg_max\":317.5,\"orig\":\"6 ft 7 in; 650 lbs (DK 2019) vs 700 lbs (Marvel.com)\",\"human_form\":\"Jen Walters 5 ft 10 in (1.778 m), 150 lbs (68.0 kg) per Marvel.com\",\"bmi_range\":\"73.2-78.9\",\"girths\":\"unknown\"}",
   "sources": [
    {
     "title": "Marvel.com She-Hulk (Jennifer Walters) In Comics",
     "url": "https://www.marvel.com/characters/she-hulk-jennifer-walters/in-comics"
    },
    {
     "title": "DK Marvel Encyclopedia New Edition (2019), archive.org OCR text",
     "url": "https://archive.org/download/marvel-encyclopedia-new-edition_202312/Marvel%20Encyclopedia%20New%20Edition_djvu.txt"
    }
   ],
   "notes": "Marvel.com: 'HEIGHT Jen Walters: 5'10\", She-Hulk: 6'7\" WEIGHT Jen Walters: 150 lbs., She-Hulk: 700 lbs.' DK 2019 factfile (REAL NAME Jennifer Walters): 'HEIGHT 6 ft7 in WEIGHT 650 lbs'. The two official sources differ by 50 lb."
  },
  {
   "key": "abomination",
   "label": "Abomination (Emil Blonsky), Marvel (bonus)",
   "status": "official",
   "values": "{\"height_m\":2.032,\"weight_kg\":444.5,\"orig\":\"6 ft 8 in, 980 lbs\",\"human_form\":\"Blonsky 5 ft 10 in (1.778 m), 180 lbs (81.6 kg)\",\"bmi\":107.7,\"pi_kg_m3\":53.0,\"girths\":\"unknown\"}",
   "sources": [
    {
     "title": "Marvel.com Abomination",
     "url": "https://www.marvel.com/characters/abomination"
    },
    {
     "title": "DK Marvel Encyclopedia New Edition (2019), archive.org OCR text",
     "url": "https://archive.org/download/marvel-encyclopedia-new-edition_202312/Marvel%20Encyclopedia%20New%20Edition_djvu.txt"
    }
   ],
   "notes": "Marvel.com: 'HEIGHT Abomination: 6'8\", Blonsky: 5'10\" WEIGHT Abomination: 980 lbs., Blonsky: 180 lbs.' DK 2019 shows 'WEIGHT 980 lbs'; its height is illegible in OCR."
  },
  {
   "key": "dc_com_no_stats",
   "label": "DC.com character pages give no height/weight",
   "status": "official",
   "values": "{\"height_m\":null,\"weight_kg\":null,\"orig\":\"not listed\"}",
   "sources": [
    {
     "title": "DC.com Superman",
     "url": "https://www.dc.com/characters/superman"
    },
    {
     "title": "DC.com Batman",
     "url": "https://www.dc.com/characters/batman"
    },
    {
     "title": "DC.com Bane",
     "url": "https://www.dc.com/characters/bane"
    },
    {
     "title": "DC.com Doomsday",
     "url": "https://www.dc.com/characters/doomsday"
    },
    {
     "title": "DC.com Darkseid",
     "url": "https://www.dc.com/characters/darkseid"
    }
   ],
   "notes": "Each DC.com page's 'Character Facts' block lists only Powers, First Appearance, Alias/Alter Ego, Base of Operations and Occupation, plus a footer saying the site 'may not be accurate, complete, or up-to-date'. All DC heights and weights above therefore come from DK's DC-licensed encyclopedias. The 'Who's Who in the DC Universe' #1-3 (1992) items on archive.org are Mayfair DC Heroes RPG sourcebooks, not DC's loose-leaf series, and have no height or weight lines. DC's own Who's Who (1985-87 or 1990-92 loose-leaf) was not found."
  },
  {
   "key": "human_ref_who_bmi",
   "label": "Human reference: WHO adult BMI cut-offs, converted to weight/height^3 at 1.80 m",
   "status": "official",
   "values": "{\"underweight_bmi_lt\":18.5,\"overweight_bmi_ge\":25,\"obese_bmi_ge\":30,\"pi_at_1_80m\":{\"bmi18_5\":10.3,\"bmi25\":13.9,\"bmi30\":16.7},\"pi_unit\":\"kg/m^3\"}",
   "sources": [
    {
     "title": "WHO Global Health Observatory: Body mass index (BMI) topic page",
     "url": "https://www.who.int/data/gho/data/themes/topics/topic-details/GHO/body-mass-index"
    }
   ],
   "notes": "The WHO GHO page lists indicators 'Underweight among adults, BMI < 18.5', 'Overweight among adults, BMI >= 25' and 'Obesity among adults, BMI >= 30'. The ponderal-index conversions (PI = BMI / height) at 1.80 m are derived."
  },
  {
   "key": "human_ref_kouri_ffmi",
   "label": "Human reference: fat-free mass index ceiling (Kouri et al. 1995)",
   "status": "measured",
   "values": "{\"natural_ffmi_norm_max\":25.0,\"pre_steroid_mr_america_mean_ffmi\":25.4,\"steroid_users_some_exceed\":30,\"normalisation\":\"FFMI + 6.3*(1.80 - h)\",\"derived_at_1_80m_10pct_fat\":{\"ffmi25_mass_kg\":90.0,\"bmi\":27.8,\"pi\":15.4,\"ffmi30_mass_kg\":108.0,\"bmi_ffmi30\":33.3,\"pi_ffmi30\":18.5}}",
   "sources": [
    {
     "title": "Kouri EM, Pope HG, Katz DL, Oliva P. Fat-free mass index in users and nonusers of anabolic-androgenic steroids. Clin J Sport Med 1995;5(4):223-228. PMID 7496846 (Europe PMC REST record)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID%3A7496846+AND+SRC%3AMED&resultType=core&format=json&pageSize=1"
    }
   ],
   "notes": "The abstract says normalised FFMI in non-users 'extended up to a well-defined limit of 25.0'; pre-steroid-era Mr. America winners had a mean of 25.4; some steroid users 'even exceeded 30'. The equivalent body masses at 1.80 m use an assumed 10% body fat (estimate)."
  },
  {
   "key": "plausibility_metrics",
   "label": "Derived: BMI, weight/height^3 and FFMI upper bound for each stated comic figure",
   "status": "derived",
   "values": "{\"cols\":\"height_m,mass_kg,BMI,PI_kg_m3,FFMInorm_upper_0pct_fat,x_mass_of_BMI25_human\",\"batman\":[1.88,95.3,27.0,14.3,26.5,1.08],\"black_panther\":[1.829,90.7,27.1,14.8,26.9,1.08],\"superman\":[1.905,106.6,29.4,15.4,28.7,1.17],\"captain_america_240\":[1.88,108.9,30.8,16.4,30.3,1.23],\"colossus_human\":[1.981,113.4,28.9,14.6,27.7,1.16],\"wolverine_195\":[1.6,88.5,34.5,21.6,35.8,1.38],\"wolverine_300\":[1.6,136.1,53.1,33.2,54.4,2.13],\"bane\":[2.032,158.8,38.4,18.9,37.0,1.54],\"bane_venom\":[2.032,192.8,46.7,23.0,45.2,1.87],\"colossus_armored\":[2.261,226.8,44.4,19.6,41.5,1.78],\"luke_cage\":[1.981,192.8,49.1,24.8,48.0,1.96],\"kingpin\":[2.007,204.1,50.7,25.3,49.4,2.03],\"doomsday_2008\":[2.134,279.0,61.3,28.7,59.2,2.45],\"doomsday_2019_guide\":[2.692,415.0,57.3,21.3,51.6,2.29],\"doomsday_2021\":[2.286,415.0,79.4,34.7,76.4,3.18],\"thing\":[1.829,226.8,67.8,37.1,67.6,2.71],\"she_hulk_650\":[2.007,294.8,73.2,36.5,71.9,2.93],\"she_hulk_700\":[2.007,317.5,78.9,39.3,77.6,3.15],\"thor\":[1.981,290.3,74.0,37.3,72.8,2.96],\"juggernaut_6_10\":[2.083,408.2,94.1,45.2,92.3,3.76],\"juggernaut_9_5\":[2.87,861.8,104.6,36.4,97.9,4.18],\"hulk_marvelcom\":[2.286,521.6,99.8,43.7,96.8,3.99],\"hulk_savage_7ft\":[2.134,471.7,103.6,48.6,101.5,4.15],\"hulk_savage_8ft\":[2.438,635.0,106.8,43.8,102.8,4.27],\"hulk_grey\":[1.981,408.2,104.0,52.5,102.9,4.16],\"abomination\":[2.032,444.5,107.7,53.0,106.2,4.31],\"darkseid\":[2.667,823.3,115.7,43.4,110.3,4.63],\"banner\":[1.753,58.1,18.9,10.8,19.2,0.76],\"blake\":[1.753,68.0,22.2,12.6,22.4,0.89]}",
   "sources": [
    {
     "title": "Computed by scripts/metrics.py from the stated figures above (Marvel.com, DK encyclopedias)",
     "url": "https://www.marvel.com/characters/hulk-bruce-banner/in-comics"
    },
    {
     "title": "Kouri et al. 1995 FFMI normalisation (Europe PMC)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID%3A7496846+AND+SRC%3AMED&resultType=core&format=json&pageSize=1"
    }
   ],
   "notes": "Conversions: 1 in = 0.0254 m, 1 lb = 0.45359237 kg. The FFMI upper bound assumes 0% body fat, so real FFMI would be lower. At 10% body fat the normalised FFMIs are: Batman 23.8, Black Panther 24.2, Superman 25.8, Captain America at 240 lb 27.2 (24.9 at 220 lb), Piotr Rasputin 24.9, Bane 33.1, Wolverine at 195 lb 32.4.\n\nComparison with the Kouri 1995 human values:\n- Batman and Black Panther fall within the drug-free range.\n- Superman is at the drug-free limit.\n- Captain America at 240 lb exceeds the drug-free limit but is within the steroid-user range.\n- Bane and Wolverine (even without adamantium) are above 30 at 10-15% body fat, the top of the reported human range.\n- Everything with BMI above about 45 is far beyond any value in the human references used here.\n\nIsometric scaling shows how far the stated weights depart from a scaled-up human (derived):\n- Banner's 128 lb scales to 231 lb at 7 ft and 345 lb at 8 ft; the Hulk is stated at 1,040-1,400 lb.\n- Blake's 150 lb scales to 217 lb at 6 ft 6 in; Thor is stated at 640 lb.\n- A 6 ft 2 in, 240 lb build (Captain America) scales to 327 lb at 6 ft 10 in, 855 lb at 9 ft 5 in, 686 lb at 8 ft 9 in and 432 lb at 7 ft 6 in. Compare Juggernaut at 900 or 1,900 lb, Darkseid at 1,815 lb and Hulk at 1,150 lb.\n\nI offer no explanations for these departures. Only Marvel's own wording is quoted where it exists: Luke Cage's 'dense muscle tissues' and 'Superdense Body Mass', Colossus's 'steel-like substance', and Kingpin's bulk being 'mostly muscle'."
  },
  {
   "key": "colossus_density_check",
   "label": "Derived: Colossus armoured weight vs Marvel's 'steel-like' description",
   "status": "estimate",
   "values": "{\"assumed_human_density_kg_m3\":[1000,1100],\"armored_volume_m3\":[0.168,0.153],\"steel_density_kg_m3_assumed\":7850,\"mass_if_steel_kg\":[1322,1202],\"mass_if_steel_lb\":[2915,2650],\"stated_armored_kg\":226.8,\"implied_mean_density_kg_m3\":[1346,1481]}",
   "sources": [
    {
     "title": "Marvel.com Colossus (Piotr Rasputin)",
     "url": "https://www.marvel.com/characters/colossus-piotr-rasputin"
    }
   ],
   "notes": "Method:\n1. Start from Marvel's stated human form, 6 ft 6 in and 250 lb.\n2. Assume a body density of 1,000-1,100 kg/m^3, roughly that of water. This is an assumption, not a fetched value.\n3. Scale the volume isometrically to 7 ft 5 in (factor 1.486).\n4. Apply a carbon-steel density of 7,850 kg/m^3. This is a standard handbook value that I did not fetch.\nResult: a steel body of that size would weigh about 1,200-1,320 kg (2,650-2,900 lb), against Marvel's stated 500 lb (227 kg). The stated weight implies a mean density of only about 1,350-1,480 kg/m^3, but Marvel.com calls the tissue 'analogous to osmium and to carbon steel'. These inputs are estimates; only the 6 ft 6 in / 250 lb and 7 ft 5 in / 500 lb figures and the quoted wording are official."
  }
 ],
 "gaps": "1. No OHOTMU edition was read directly. The archive.org copies are lend-only: 'officialhandbook04grue' (1987), 'officialhandbook0000unse_z5q7' (Avengers 2004), 'officialhandbook0001unse' (2006) and 'officialhandbook0000unse_i8k4' (A to Z 2008). Text download returned HTTP 401 and search-inside was refused. Edition-specific handbook claims therefore come only from Marvel Database edit summaries and are marked 'reported':\n   - Captain America at 220 lb in Avengers 2004 and Civil War: Battle Damage Report 2007, and 240 lb in 2006, 2008 and Avengers: Roll Call\n   - Juggernaut at 6 ft 10 in / 900 lb in 'every handbook'\n   - Hulk 7-8 ft / 1,040-1,400 lb (Savage), 6 ft 6 in / 900 lb (Joe Fixit) and 7 ft 6 in / 1,150 lb (Merged), with one edit attributing the Hulk profile to OHOTMU A to Z\n   - Kingpin '9 lb of fat' (OHOTMU: Daredevil 2004)\n   - Banner 5 ft 10 in (Avengers: Roll Call #1)\n   The 1983 (vol. 1), 1985-88 Deluxe and 1990s Master Edition values are therefore unconfirmed.\n2. DC Who's Who: the 1985-87 series and the 1990-92 loose-leaf were not found online. The archive.org 'Who's Who in the DC Universe #1-3' are Mayfair RPG books with no stats. All DC numbers come from DK's licensed encyclopedias (2007, 2008, 2016, 2019 guide, 2021). The often-repeated Superman '225 lbs' has no official source located.\n3. Two DK texts are third-party archive.org uploads of copyrighted books (DC Comics Encyclopedia New Edition 2021 and Marvel Encyclopedia New Edition 2019). I read them as OCR text, and some lines are illegible:\n   - Luke Cage's weight in DK 2019\n   - Abomination's height in DK 2019\n   The DK 2008, 2007 and 2016 books were seen only as search-inside snippets. The Bane height in the 2008 snippet was not visible.\n4. The 2006 first edition of DK's Marvel Encyclopedia is too garbled in OCR to attribute stats to characters.\n5. Wayback Machine and Google Books were blocked or out of quota here. I could not confirm when Marvel.com changed Juggernaut from 6 ft 10 in / 900 lb to 9 ft 5 in / 1,900 lb, or check older Marvel.com/universe pages directly.\n6. Marvel.com has no separate pages for Grey or Savage Hulk; the slugs I tried returned 404.\n7. Girths (chest, waist, upper arm, forearm, thigh, calf, neck): no official or licensed source gives any for these characters, so they are unknown. I did not estimate them here.\n8. Inputs to the plausibility checks that were not fetched: the human body density of 1,000-1,100 kg/m^3 and the steel density of 7,850 kg/m^3 are standard assumptions, labelled as estimates."
}
```

</details>

<details>
<summary>Subagent `verify:model` (build-calc-research, 2026-10-10 02:26:23 UTC): Mostly accurate and reproducible. I re-downloaded the ANSUR II and Penrose/JSE data and recomputed everything independently. Returned checks: 41 (e.g. siri_equation; brozek_equation).</summary>

Workflow run `wf_16409832-67f`, phase `Verify`, agent `a27f7e0f475a045f4`. Prompt, verbatim:

```text
Project: a small web calculator. The user picks a BUILD (average man or woman, athlete, record bodybuilder, strongman, comic-book character, or two original characters) and a HEIGHT, and the page shows estimated body WEIGHT and GIRTHS: chest, waist, upper arm (flexed), forearm, thigh, calf and neck. Every number must be sourced or clearly labelled as an estimate. The owner values factual accuracy over flattery: say "unknown" rather than invent, and label magazine-reported or fan-wiki numbers as such.
Write raw downloads and scripts under /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/buildcalc/<topic>/ (create it). Do not edit anything under /home/user. Use WebSearch/WebFetch for sources; prefer primary sources (journals, official databases, publisher handbooks) over wikis. For each fact give: key, label, value(s) with units (SI and the original units), status (measured | official | reported | derived | estimate | disputed), sources (title + URL actually fetched), and notes (what exactly the source says, caveats).

You are a skeptical fact-checker for the topic "model". Below are the researcher's facts. Re-fetch at least 10 of the cited URLs (prioritise the numbers the calculator will lean on most) and check each value and status against what the source actually says; recompute any derived statistics you can (for ANSUR data, re-download and recompute a few percentiles). Mark ok=false with a correction for anything wrong, mislabelled (e.g. a fan wiki marked official), or unsupported. List important missing items.

FACTS:
{
 "summary": "TOPIC: the physics and physiology of turning a build into a weight and a set of girths. Raw downloads, scripts and outputs are in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/buildcalc/physics/ (raw/, scripts/, out/). The new analyses are scripts/scaling_analysis.py, scripts/segment_volume.py, scripts/vtaper_check.py and scripts/derived_tables.py. Their results are in out/scaling_results.json, out/segment_volume_results.json, out/vtaper_results.json and out/derived_tables.json. They run on measured ANSUR II data (4,082 men and 1,986 women, US Army 2010-12) and on the Penrose 1985 densitometry set (252 men).\n\nKEY FINDINGS\n(1) The two-compartment model assumes fat at 0.900 g/cm3 (0.9007 in the Brozek revision) and fat-free mass (FFM) at 1.100 g/cm3. From these, Siri gives %fat = 495/D - 450 and Brozek gives %fat = 457/D - 414.2. Measured FFM density actually ranges from 1.075 to 1.127. In weight trainers it is 1.089, against 1.099 in controls, so the Siri equation overstates their fat by about 4 points. Whole-body density in 252 men ran from 0.995 to 1.109 g/cm3.\n(2) FFMI = FFM/H^2. Medians are 18.9 for young men and 15.4 for young women. Kouri found a limit of 25.0 in 74 non-users. College athletes measured by DXA reach a 97.5th percentile of about 28.1 to 28.3, with a maximum of 31.7. The Kouri height-correction coefficient is disputed: 6.3 in the abstract, 6.1 as later cited.\n(3) Weight across adults scales with about H^2, with exponents of 1.8 to 2.3 depending on sex and sample (Quetelet; Heymsfield 2007, 2011, 2014). Burton warns that this exponent depends on the statistical method; ANSUR gives 2.0 by ordinary regression and 4.2 by reduced major axis. In ANSUR the chest follows the geometric law girth ∝ sqrt(W/H) almost exactly (fitted W^0.508 H^-0.492). Thigh and upper arm come close. Waist (W^0.73 H^-0.82, matching Krakauer's W^0.68 H^-0.81) scales faster with weight because extra weight between people is mostly fat. Neck, forearm and calf scale slower.\n(4) Behnke and Katch's ponderal somatogram uses W ∝ girth^2 × stature, and total ponderal equivalent matched body weight within 1.5 kg (group means), including world-class bodybuilders. Fitting ANSUR without that constraint gives the same dimensions: ln W has coefficient 0.99 on ln H and the girth coefficients sum to 1.89 to 1.90. Errors from the 7 calculator girths plus height, on ANSUR (1 SD):\n- log-linear regression: 1.9% (men), 2.2% (women)\n- Behnke-type W = k·H·(ΣG)^2: 2.6% / 3.6%\n- circular-frustum volume × 1053 kg/m3: 2.1% / 2.4%\nPublished geometric segment models reach about 2 to 3% on whole-body mass (Yeadon about 2.1%; Jensen <2%; E-Zone body volume about 3% TEM), but error grows to 5 to 10% when subjects differ from the calibration (Williams 2013).\n\nDESIGN NOTE (all of it is an estimate unless a number is sourced)\n\nA. Data model. Store each build as a reference record: H0, W0, body-fat % if known, and the 7 girths. Give every number its own status and source.\n\nB. Same build at a new height H1. W1 = W0·(H1/H0)^p. Girths G1 = G0·sqrt((W1/W0)/(H1/H0)) = G0·(H1/H0)^((p-1)/2).\n- p = 3 is a scaled copy: shape is kept and W/H^3 is unchanged, but FFMI rises in proportion to H. It suits comic characters \"as drawn\".\n- p = 2 keeps BMI and FFMI fixed. It is how real adults differ (exponents 1.8 to 2.3).\n- p of about 2.2 to 2.45 is implied for muscular athletes by the Trexler and Kouri height corrections.\n- The choice matters more than anything else. Going from 1.80 m to 2.20 m multiplies weight by 1.49 at p = 2 and by 1.83 at p = 3, and girths by 1.11 versus 1.22.\n- Show the p = 2 to p = 3 band, or let the user pick p and label it.\n- For the same composition, use the geometric exponents 0.5 and -0.5. Use the ANSUR exponents (for example waist 0.73) only when the weight change is a population-typical change in fat.\n\nC. Weight from girths. Inside the human range, use the ANSUR log-linear equation for each sex:\n- men: ln W = 4.8101 + 0.9873 ln H + 0.4132 ln chest + 0.3061 ln waist + 0.1089 ln arm(flexed) + 0.1260 ln forearm(flexed) + 0.4389 ln thigh + 0.2780 ln calf + 0.2188 ln neck (W in kg, lengths in m)\n- error is about ±2% (1 SD) and ±4% (95%)\n- it held up on the heaviest 2.5% (bias -1.0%), the biggest arms (bias +0.1%) and the Penrose men (SD 2.9%)\nBeyond the data, regressions have no physical guarantee, so switch to volume × density:\n- sum circular frustums from girths and segment lengths (the lengths default to proportions of H)\n- multiply by k_eff = 1053 kg/m3, calibrated on ANSUR (it absorbs lung air and the shape bias)\n- then scale by the Siri density for the target fat % relative to the reference: a 5%-fat build is about 1.088 g/cm3 versus about 1.053 at 20% fat, so add about 3%\n- ANSUR's leanest V-shaped men were under-predicted by 1.3 to 2.1%, which is consistent with that correction\nShow all three estimators; their spread is an honest error bar.\n\nD. Errors to expect.\n- Within human data: about 2 to 4% on weight from a complete set of girths, and 3 to 6% from a single girth relation.\n- Density: ±2 to 4%. FFM density ranges 1.075 to 1.127, and the fat % is unknown.\n- Trunk cross-section: a circle overstates the area of a flattened torso. At a depth/breadth ratio of 0.5 the true area is 0.84 of the circle's; at 0.4 it is 0.75. The trunk is about 51% of body volume, so this alone can shift weight by 5 to 13%.\n- Girths read from comic art: W ∝ G^2, so a 5% error in reading girths gives about 10% on weight.\n- Geometric models drift with distance from their calibration (Williams 2013: r = -0.80 between mass and error, up to ±10%).\n- No dataset tests anything at bodybuilder or comic scale. The largest flexed arm in ANSUR is 49 cm.\n- So report comic characters as a range of about ±15 to 25%, labelled estimate.\n\nE. Plausibility flags. FFMI above 25 exceeds the Kouri non-user limit. Above about 28 it exceeds the athletes' 97.5th percentile. Above 31.7 it exceeds the maximum observed in Trexler. Label these \"beyond human data\". Do not treat a high FFMI as proof of muscle: an obese Penrose subject has FFMI 32.4 at 33.8% fat.",
 "facts": [
  {
   "key": "siri_equation",
   "label": "Siri (1961) two-compartment equation: body density to % fat",
   "status": "reported",
   "values": "{\"equation\":\"%fat = 495/D - 450 (D in g/cm^3)\",\"fat_density_kg_m3\":900,\"ffm_density_kg_m3\":1100,\"orig\":\"fat 0.900 g/cm^3, FFM 1.100 g/cm^3\"}",
   "sources": [
    {
     "title": "Johnson (1996) JSE dataset documentation 'Fitting Percentage of Body Fat to Simple Body Measurements' (Penrose et al. 1985 data)",
     "url": "https://jse.amstat.org/datasets/fat.txt"
    },
    {
     "title": "Modlesky et al. 1996 J Appl Physiol 80:2085 abstract (assumed Dffm 1.1 g/ml in Siri equation)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:8806917%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "Siri WE. Body composition from fluid spaces and density (1961; reprinted Nutrition 1993;9:480-91) - bibliographic record only",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:8286893%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "The JSE documentation states 'Percent body fat using Siri's equation, 495/Density - 450'. Modlesky 1996 and Prior 2001 both describe 1.1 g/cm^3 as the FFM density assumed by the Siri equation. I checked algebraically that 1/D = f/0.900 + (1-f)/1.100 gives exactly 495/D - 450 (derived_tables.json). The Siri 1961 original (in Brozek & Henschel eds., Techniques for Measuring Body Composition, NAS 1961, pp. 223-244) was not accessible; only its bibliographic record was fetched."
  },
  {
   "key": "brozek_equation",
   "label": "Brozek et al. (1963) equation: body density to % fat",
   "status": "reported",
   "values": "{\"equation\":\"%fat = 457/D - 414.2 (D in g/cm^3)\",\"implied_zero_fat_density_kg_m3\":1103.3,\"siri_minus_brozek_points\":{\"D1.00\":2.2,\"D1.03\":1.09,\"D1.06\":0.05,\"D1.09\":-0.94,\"D1.10\":-1.25}}",
   "sources": [
    {
     "title": "Johnson (1996) JSE dataset documentation (Brozek's equation 457/Density - 414.2)",
     "url": "https://jse.amstat.org/datasets/fat.txt"
    },
    {
     "title": "Brozek J, Grande F, Anderson JT, Keys A. Densitometric analysis of body composition: revision of some quantitative assumptions. Ann NY Acad Sci 1963;110:113-140 (record only)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:14062375%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "The equation is quoted from the JSE documentation; the original 1963 paper was not accessible. The zero-fat density (457/414.2) and the Siri-minus-Brozek differences are my own arithmetic. The two equations agree within about 1 percentage point between D = 1.03 and 1.09."
  },
  {
   "key": "component_densities_2c",
   "label": "Assumed densities of fat and fat-free mass in the two-compartment model",
   "status": "reported",
   "values": "{\"fat_kg_m3\":900.7,\"ffm_kg_m3\":1100.0,\"ffm_water_fraction\":0.7372,\"orig\":\"0.9007 g/cm^3 fat; 1.1000 g/cm^3 FFM; 73.72% water\"}",
   "sources": [
    {
     "title": "Kuriyan R. Body composition techniques. Indian J Med Res 2018 (PMC6366261) full text",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC6366261/fullTextXML"
    }
   ],
   "notes": "Quote: 'The anhydrous FM is the chemically extractable fat with an assumed density of 0.9007 g/cm3, whereas the FFM is assumed to have a density of 1.1000 g/cm3 and water content of 73.72 per cent. The 2C model is based on assumption made from the analyses of three male cadavers.' The review also says the errors come more from the validity of these assumptions than from technical accuracy."
  },
  {
   "key": "ffm_density_variation",
   "label": "Measured variation of fat-free-mass density (athletes, weight trainers, ethnicity)",
   "status": "measured",
   "values": "{\"range_athletes_nonathletes_kg_m3\":[1075,1127],\"weight_trainers_kg_m3\":1089,\"weight_trainers_sd\":5,\"controls_kg_m3\":1099,\"controls_sd\":7,\"black_men_implied_kg_m3\":1113.5,\"pctfat_at_D1070\":{\"dffm1100\":12.6,\"dffm1089\":8.5,\"dffm1113\":17.0}}",
   "sources": [
    {
     "title": "Prior BM et al. Muscularity and the density of the fat-free mass in athletes. J Appl Physiol 2001;90:1523-31 (abstract)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:11247955%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "Modlesky CM et al. Density of the fat-free mass and estimates of body composition in male weight trainers. J Appl Physiol 1996;80:2085-96 (abstract)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:8806917%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "Schutte JE et al. Density of lean body mass is greater in blacks than in whites. J Appl Physiol 1984;56:1647-9 (abstract)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:6735823%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Prior 2001 (n=172, 4-component model): 'D(FFM) varied from 1.075 to 1.127 g/cm3'. It was not related to muscularity or mesomorphy; selected sports showed group errors of 2-5% body mass in densitometric %fat. Modlesky 1996 (14 weight trainers vs 14 controls): Dffm 1.089 +/- 0.005 vs 1.099 +/- 0.007 g/ml; Siri %fat was 17.3 vs 13.2 by the 4-component model. Schutte 1984 gives %fat = 100 x (4.374/D - 3.928) for black men, which implies Dffm = 4.374/3.928 = 1.1135 (my arithmetic). The %fat at D = 1.070 under each Dffm is my arithmetic."
  },
  {
   "key": "whole_body_density_sample",
   "label": "Measured whole-body density in 252 men (underwater weighing)",
   "status": "measured",
   "values": "{\"n\":251,\"min_kg_m3\":995,\"max_kg_m3\":1108.9,\"mean_kg_m3\":1055.7,\"p2_5_kg_m3\":1021.1,\"p97_5_kg_m3\":1090.5,\"orig\":\"0.995-1.1089 g/cm^3\"}",
   "sources": [
    {
     "title": "JSE body-fat data file (Penrose, Nelson & Fisher 1985 data)",
     "url": "https://jse.amstat.org/datasets/fat.dat.txt"
    },
    {
     "title": "JSE dataset documentation",
     "url": "https://jse.amstat.org/datasets/fat.txt"
    }
   ],
   "notes": "Computed by me from the data file (out/scaling_results.json), excluding case 42, whose height is documented as wrong. The documentation warns that the densities of cases 48, 76 and 96 seem to contain one-digit errors, and that %fat is truncated at 0 for case 182. Sample: US men, mostly 22-81 y."
  },
  {
   "key": "density_from_fat_table",
   "label": "Whole-body tissue density implied by % fat (Siri model, lungs excluded)",
   "status": "derived",
   "values": "{\"pct3\":1092.7,\"pct5\":1087.9,\"pct8\":1080.8,\"pct10\":1076.1,\"pct15\":1064.5,\"pct20\":1053.2,\"pct25\":1042.1,\"pct30\":1031.3,\"pct40\":1010.2,\"pct50\":990.0,\"unit\":\"kg/m^3\"}",
   "sources": [
    {
     "title": "Kuriyan 2018 (component densities)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC6366261/fullTextXML"
    }
   ],
   "notes": "Computed as D = 1/(f/0.900 + (1-f)/1.100) (scripts/derived_tables.py). It excludes lung and gut gas. If Dffm departs from 1.100 (range 1.075-1.127), shift these values by roughly the same relative amount."
  },
  {
   "key": "muscle_tissue_density",
   "label": "Skeletal muscle tissue density (conventional value)",
   "status": "reported",
   "values": "{\"conventional_kg_m3\":1059.7,\"fixed_4pct_formaldehyde_kg_m3\":1112,\"fixed_37pct_kg_m3\":1055}",
   "sources": [
    {
     "title": "Ward SR, Lieber RL. Density and hydration of fresh and fixed human skeletal muscle. J Biomech 2005;38:2317-20 (abstract)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:16154420%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Ward & Lieber state that studies 'use a density value of 1.0597 g/cm3, which was originally based on unfixed rabbit and canine muscle tissue'. Their own fixed human values were 1.112 (4% formaldehyde) and 1.055 (37% formaldehyde). No fresh living human value is given."
  },
  {
   "key": "ffmi_definition_kouri_limit",
   "label": "FFMI definition and the 'natural limit' of 25 (Kouri et al. 1995)",
   "status": "measured",
   "values": "{\"definition\":\"FFMI = FFM(kg)/H(m)^2\",\"nonuser_upper_limit_kg_m2\":25.0,\"mr_america_1939_1959_mean_kg_m2\":25.4,\"n_athletes\":157,\"n_nonusers\":74,\"n_users\":83}",
   "sources": [
    {
     "title": "Kouri EM, Pope HG, Katz DL, Oliva P. Fat-free mass index in users and nonusers of anabolic-androgenic steroids. Clin J Sport Med 1995;5:223-8 (abstract)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:7496846%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Abstract: non-users' normalized FFMI 'extended up to a well-defined limit of 25.0'; 20 pre-steroid Mr. America winners had an estimated mean of 25.4 (estimated, not measured); some users exceeded 30. The authors call the findings 'preliminary'. The 25 limit rests on 74 non-users, and the body-fat method is not given in the abstract."
  },
  {
   "key": "ffmi_height_correction",
   "label": "FFMI height normalisation coefficient (Kouri): 6.3 vs 6.1",
   "status": "disputed",
   "values": "{\"formula\":\"FFMI_norm = FFMI + c*(1.80 - H_m)\",\"c_in_kouri_abstract\":6.3,\"c_as_cited_by_trexler2017\":6.1,\"trexler_own_slope\":2.943,\"implied_FFM_height_exponent_kouri\":2.44,\"implied_FFM_height_exponent_trexler\":2.21}",
   "sources": [
    {
     "title": "Kouri et al. 1995 abstract (states 6.3 x (1.80 m - height))",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:7496846%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "Trexler ET et al. 2017, J Strength Cond Res, PMC5438288 full text (says Kouri 'utilized a slope of 6.1')",
     "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5438288/"
    }
   ],
   "notes": "The PubMed abstract prints 6.3, while Trexler 2017 and most calculators use 6.1; the Kouri full text was not accessible. Between 1.6 and 2.0 m the two differ by at most 0.04 kg/m^2. Trexler's own regression slope was 2.943 (not significant, r = 0.13). Implied exponents are my derivation: p = 2 + c*1.8/25 at FFMI 25, i.e. FFM proportional to H^p among these athletes."
  },
  {
   "key": "ffmi_population_norms",
   "label": "FFMI reference values in the general population",
   "status": "measured",
   "values": "{\"median_men_18_34_kg_m2\":18.9,\"median_women_18_34_kg_m2\":15.4,\"normalBMI_men_range_kg_m2\":[16.7,19.8],\"normalBMI_women_range_kg_m2\":[14.6,16.8],\"n_schutz\":5635}",
   "sources": [
    {
     "title": "Schutz Y, Kyle UG, Pichard C. Fat-free mass index and fat mass index percentiles in Caucasians aged 18-98 y. Int J Obes 2002;26:953-60 (abstract)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:12080449%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "Kyle UG et al. Body composition interpretation: contributions of FFMI and BFMI. Nutrition 2003;19:597-604 (abstract)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:12831945%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Both studies used a Swiss white sample with FFM from 50-kHz bioelectrical impedance (BIA). Medians are for ages 18-34. Kyle 2003 ranges are FFMI 'within the normal BMI ranges'."
  },
  {
   "key": "ffmi_athletes",
   "label": "FFMI in collegiate athletes (upper tail)",
   "status": "measured",
   "values": "{\"trexler2017_football\":{\"n\":235,\"mean\":23.7,\"sd\":2.1,\"p97_5\":28.1,\"max\":31.7,\"pct_over_25\":26.4,\"method\":\"DXA\"},\"currier2019_men\":{\"n\":209,\"mean_adj\":22.8,\"sd\":2.8,\"p97_5\":28.32,\"rugby_p97_5\":29.1,\"method\":\"DXA\"},\"fields2024_DIII_football\":{\"n\":111,\"mean\":23.5,\"sd\":2.04,\"range\":[18.1,27.7],\"method\":\"BIA\"},\"blue2019_women\":{\"n\":266,\"mean\":16.9,\"sd\":1.7,\"range\":[13.3,25.5],\"method\":\"DXA\"},\"unit\":\"kg/m^2\"}",
   "sources": [
    {
     "title": "Trexler ET et al. FFMI in NCAA Division I and II collegiate American football players. J Strength Cond Res 2017 (abstract)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:27930454%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "Trexler 2017 full text (PMC5438288)",
     "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5438288/"
    },
    {
     "title": "Currier BS et al. FFMI in a diverse sample of male collegiate athletes. J Strength Cond Res 2019 (abstract)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:30985525%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "Fields JB et al. FFMI in a large sample of collegiate American football athletes. 2024 (abstract)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:38665859%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "Blue MNM et al. Normative FFMI values for collegiate female athletes. J Sports Sci 2019 (abstract)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:30893018%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "DXA FFM = lean mass + bone mineral content (Trexler Eq. 1). Methods differ (DXA, BIA, densitometry), so values are not strictly comparable with Kouri's. Drug-free status is not verified in these abstracts. Trexler's and Currier's values are height-adjusted to 1.80 m by regression."
  },
  {
   "key": "ffmi_obesity_caveat",
   "label": "High FFMI also occurs in obesity (Penrose data)",
   "status": "derived",
   "values": "{\"ffmi_mean\":20.4,\"ffmi_sd\":1.9,\"ffmi_min\":16.8,\"ffmi_max\":32.4,\"max_case_bodyfat_brozek_pct\":33.8,\"n\":251}",
   "sources": [
    {
     "title": "JSE body-fat data file (Penrose et al. 1985)",
     "url": "https://jse.amstat.org/datasets/fat.dat.txt"
    }
   ],
   "notes": "Computed by me: FFM = documented 'Fat Free Weight' (Brozek), divided by H^2. The maximum (case 39, FFMI 32.4) is an obese man at 33.8% fat, not a bodybuilder. So FFMI above 25 is not proof of muscularity, and the 2C densitometry may misassign FFM in obesity."
  },
  {
   "key": "quetelet_square_law",
   "label": "Quetelet: adult weight increases as the square of height",
   "status": "reported",
   "values": "{\"exponent\":2,\"orig\":\"'the weight increases as the square of the height' (Quetelet 1830s)\"}",
   "sources": [
    {
     "title": "Eknoyan G. Adolphe Quetelet (1796-1874) - the average man and indices of obesity. Nephrol Dial Transplant 2008;23:47-51 (abstract)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:17890752%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Historical review. Quetelet's index was renamed BMI by Ancel Keys in 1972."
  },
  {
   "key": "benn_index_exponent_debate",
   "label": "Benn index W/H^p and why p is below 3 (Burton 2007)",
   "status": "reported",
   "values": "{\"p_typical_adult_range\":[1.1,2.5],\"ponderal_index\":\"W/H^3 scale-independent\"}",
   "sources": [
    {
     "title": "Burton RF. Why is the body mass index calculated as mass/height2, not as mass/height3? Ann Hum Biol 2007;34:656-63 (abstract)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:18092209%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "Benn RT. Some mathematical properties of weight-for-height indices used as measures of adiposity. Br J Prev Soc Med 1971;25:42-50 (record only)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:5551233%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Burton: BMI 'is an approximation to the Benn index, mass/height(p), where p (typically 1.1-2.5 for adult populations) makes the index uncorrelated with height. Mass/height(3) is an index of body build that is independent of scale.' He argues 'mass must vary more nearly with height(3) than with height(2), although ... conventional statistical techniques suggest otherwise' (p rises with the mass-height correlation). Benn's 1971 text is a scanned image and was not read."
  },
  {
   "key": "heymsfield_2007_scaling",
   "label": "Scaling of body composition compartments to stature (MRI/DXA)",
   "status": "measured",
   "values": "{\"weight_power\":2,\"ffm_and_skeletal_muscle_power\":2,\"bone_mineral_power_range\":[2.31,2.48],\"brain_power_men\":0.83,\"n_mri\":411,\"n_dxa\":1346}",
   "sources": [
    {
     "title": "Heymsfield SB et al. Scaling of human body composition to stature: new insights into body mass index. Am J Clin Nutr 2007;86:82-91 (abstract)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:17616766%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Abstract: weight, skeletal muscle, residual mass, AT-free mass, FFM and liver 'scaled to height with powers of approximately 2'. Bone scaled with 2.31-2.48. Adipose tissue scaled weakly. Adiposity was independent of height."
  },
  {
   "key": "heymsfield_2011_circumferences",
   "label": "Scaling of weight, waist and hip circumference to height (NHANES III)",
   "status": "measured",
   "values": "{\"weight_power_men\":2.29,\"weight_power_men_se\":0.11,\"weight_power_women\":1.80,\"weight_power_women_se\":0.07,\"WC_power_men\":0.76,\"WC_power_women\":0.80,\"HC_power_men\":0.45,\"HC_power_women\":0.53,\"n_men\":7422,\"n_women\":7999}",
   "sources": [
    {
     "title": "Heymsfield SB, Heo M, Pietrobelli A. Are adult body circumferences associated with height? Am J Clin Nutr 2011;93:302-7 (abstract)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:21123461%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Powers are adjusted for age and race. Circumferences rise 0.2-0.5 cm per cm of height. These are univariate height powers, not at fixed BMI. Geometric similarity would predict 3 for weight and 1 for girths."
  },
  {
   "key": "heymsfield_2014_scaling",
   "label": "Scaling of weight and waist to height across sex and ethnic groups (NHANES, KNHANES)",
   "status": "measured",
   "values": "{\"BW_power_men_NHANES\":2.12,\"BW_power_men_KNHANES\":2.11,\"BW_power_women_NHANES\":2.02,\"BW_power_women_KNHANES\":1.99,\"WC_power_men\":[0.66,0.67],\"WC_power_women\":[0.61,0.56]}",
   "sources": [
    {
     "title": "Heymsfield SB et al. Scaling of adult body weight to height across sex and race/ethnic groups: relevance to BMI. Am J Clin Nutr 2014;100:1455-61 (abstract)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:25411280%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "These powers are after controlling for age and adiposity; the SEs are about 0.03-0.06. The conclusion is that BW scales to height with a power of about 2 in all 8 sex and ethnic groups."
  },
  {
   "key": "absi_waist_allometry",
   "label": "Waist circumference allometry in NHANES 1999-2004 (Krakauer & Krakauer ABSI)",
   "status": "measured",
   "values": "{\"lnWC_const\":-2.589,\"exp_weight\":0.6807,\"exp_weight_se\":0.0052,\"exp_height\":-0.814,\"exp_height_se\":0.020,\"R2\":0.829,\"n\":14105,\"rounded\":\"WC ~ W^(2/3) H^(-5/6); ABSI = WC/(BMI^(2/3) H^(1/2))\",\"units\":\"WC, H in m; W in kg; natural log\"}",
   "sources": [
    {
     "title": "Krakauer NY, Krakauer JC. A new body shape index predicts mortality hazard independently of BMI. PLoS ONE 2012;7:e39504 (PDF)",
     "url": "https://journals.plos.org/plosone/article/file?id=10.1371/journal.pone.0039504&type=printable"
    }
   ],
   "notes": "Eq. (1) is read from the PDF text: log(WC) = (-2.589 +/- 0.020) + (0.6807 +/- 0.0052) log(weight) - (0.814 +/- 0.020) log(height). I checked that it gives about 0.94 m for 80 kg and 1.75 m with the natural log. The geometric law would predict W^0.5 H^-0.5; the waist grows faster with weight because between-person weight differences are largely fat."
  },
  {
   "key": "mackay_2010_theory",
   "label": "Biomechanical argument for the mass-height exponent (children)",
   "status": "reported",
   "values": "{\"p_range\":[2.333,2.667],\"p_preferred\":2.667,\"waist_q_range\":[0.667,1.0]}",
   "sources": [
    {
     "title": "MacKay NJ. Scaling of human body mass with height: the body mass index revisited. J Biomech 2010;43:764-6 (abstract)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:19909957%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "MacKay uses a stress-limit argument after Rashevsky: growing children should scale as 7/3 < p < 8/3, with p close to 8/3, and waist as h^q with q near the low end of 2/3 to 1. It is theory checked against Hong Kong and British children, not adults."
  },
  {
   "key": "trefethen_new_bmi",
   "label": "'New BMI' with exponent 2.5 (non-peer-reviewed proposal)",
   "status": "reported",
   "values": "{\"formula\":\"1.3*W(kg)/H(m)^2.5\",\"exponent\":2.5,\"reference_height_m\":1.69}",
   "sources": [
    {
     "title": "Trefethen N. New BMI (New Body Mass Index), University of Oxford web page",
     "url": "https://people.maths.ox.ac.uk/trefethen/bmi.html"
    }
   ],
   "notes": "Personal web proposal: 'You might think that the exponent should simply be 3, but that doesn't match the data at all.' The constant 1.3 equals sqrt(1.69), chosen so the value is unchanged at 1.69 m. Treat as opinion, not data."
  },
  {
   "key": "ansur_mass_height_exponent",
   "label": "Mass-height exponent in ANSUR II, and its dependence on method",
   "status": "derived",
   "values": "{\"men\":{\"n\":4082,\"ols_p\":1.999,\"se\":0.059,\"r\":0.472,\"rma_p\":4.24,\"mean_H_m\":1.756,\"mean_W_kg\":85.5,\"mean_BMI\":27.7},\"women\":{\"n\":1986,\"ols_p\":2.192,\"se\":0.077,\"r\":0.539,\"rma_p\":4.07,\"mean_H_m\":1.629,\"mean_W_kg\":67.8,\"mean_BMI\":25.5}}",
   "sources": [
    {
     "title": "ANSUR II male public data (Penn State OpenLab mirror)",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    },
    {
     "title": "ANSUR II female public data",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_FEMALE_Public.csv"
    }
   ],
   "notes": "My regression of ln W on ln H (scripts/scaling_analysis.py). Ordinary least squares gives about 2, as in NHANES. Reduced major axis gives about 4 because the correlation is weak, which illustrates Burton's point that the 'exponent' depends on the statistics. US Army sample, 2010-12, measured weight and stature; not population-representative."
  },
  {
   "key": "ansur_girth_allometry",
   "label": "Girth allometry ln G = a + b ln W + c ln H (ANSUR II); geometric law predicts b = 0.5, c = -0.5",
   "status": "derived",
   "values": "{\"men\":{\"chest\":[0.508,-0.492,0.870,3.0],\"waist\":[0.728,-0.823,0.845,4.8],\"upper_arm_flexed\":[0.549,-0.626,0.719,5.3],\"forearm_flexed\":[0.368,-0.188,0.666,4.2],\"thigh\":[0.573,-0.538,0.861,3.6],\"calf\":[0.416,-0.315,0.714,4.1],\"neck\":[0.351,-0.377,0.675,3.7]},\"women\":{\"chest\":[0.523,-0.570,0.738,4.5],\"waist\":[0.719,-0.897,0.770,5.7],\"upper_arm_flexed\":[0.632,-0.750,0.798,4.6],\"forearm_flexed\":[0.384,-0.206,0.683,4.0],\"thigh\":[0.576,-0.535,0.842,3.7],\"calf\":[0.411,-0.239,0.652,4.6],\"neck\":[0.305,-0.232,0.602,3.7]},\"array_order\":\"[b_W, c_H, R2, residual SD %]\"}",
   "sources": [
    {
     "title": "ANSUR II male public data",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    },
    {
     "title": "ANSUR II female public data",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_FEMALE_Public.csv"
    }
   ],
   "notes": "Standard errors: b about 0.003-0.009, c about 0.011-0.037 (out/scaling_results.json). The chest follows sqrt(W/H) almost exactly; thigh and upper arm are close. Waist scales faster and neck, forearm and calf slower, because between-person weight differences are mostly fat. ANSUR definitions: chest at chest point; waist at omphalion; flexed biceps and forearm; thigh at gluteal furrow. The Penrose men give similar results (chest 0.549/-0.676, abdomen 0.761/-1.03, thigh 0.509/-0.295)."
  },
  {
   "key": "ansur_geometric_law_test",
   "label": "Error of the pure geometric law G = G_ref*sqrt((W/W_ref)/(H/H_ref)) in ANSUR men",
   "status": "derived",
   "values": "{\"resid_sd_pct\":{\"chest\":3.0,\"waist\":5.9,\"upper_arm_flexed\":5.3,\"forearm_flexed\":4.6,\"thigh\":3.7,\"calf\":4.3,\"neck\":4.4},\"bias_lowest_to_highest_BMI_quintile_pct\":{\"chest\":[-0.2,0.2],\"waist\":[-4.5,4.9],\"upper_arm_flexed\":[-1.4,0.6],\"forearm_flexed\":[2.7,-2.7],\"thigh\":[-1.9,1.1],\"calf\":[1.8,-1.7],\"neck\":[3.5,-2.6]},\"fixed_BMI_height_exponent_men\":{\"chest\":0.525,\"waist\":0.632,\"upper_arm_flexed\":0.471,\"forearm_flexed\":0.549,\"thigh\":0.608,\"calf\":0.516,\"neck\":0.325},\"fixed_BMI_height_exponent_women\":{\"chest\":0.476,\"waist\":0.541,\"upper_arm_flexed\":0.513,\"forearm_flexed\":0.562,\"thigh\":0.616,\"calf\":0.583,\"neck\":0.378}}",
   "sources": [
    {
     "title": "ANSUR II male public data",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    },
    {
     "title": "ANSUR II female public data",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_FEMALE_Public.csv"
    }
   ],
   "notes": "The reference is the sample's geometric-mean man. At fixed BMI the geometric law predicts girth proportional to H^0.5; observed values are 0.47-0.63, except the neck at 0.33. So for moderate height changes at fixed BMI the sqrt rule is accurate to about 1%. Its error shows up mainly when the weight difference is fat (waist)."
  },
  {
   "key": "ponderal_somatogram",
   "label": "Behnke/Katch ponderal somatogram: weight proportional to girth^2 x stature",
   "status": "reported",
   "values": "{\"formula\":\"PE = (g/k)^2 * h_dm, k = g_ref/F, F = sqrt(W_ref_kg/h_ref_dm)\",\"F_male\":2.000,\"F_female\":1.852,\"total_PE_vs_weight_diff_kg\":\"< 1.5 (group means)\",\"datasets\":7}",
   "sources": [
    {
     "title": "Katch FI, Behnke AR, Katch VL. The ponderal somatogram: evaluation of body size and shape from anthropometric girths and stature. Human Biology 1987;59(3):439-458 (abstract page)",
     "url": "https://digitalcommons.wayne.edu/humbiol/vol59/iss3/6"
    }
   ],
   "notes": "Abstract: 'There is similarity between the total body P.E. and body weight for all the data sets (differences less than 1.5 kg). This illustrates the concurrent validity of the fundamental relation between body weight and a squared matrix of girths multiplied by stature.' The data sets include 11 male world-class and 10 female champion bodybuilders. The full PDF (Cloudflare) and Behnke 1961 (J Appl Physiol 16:949, 960) were not accessible, so the k constants and the commonly quoted 0.0111 form are unverified."
  },
  {
   "key": "ansur_weight_from_girths",
   "label": "Predicting weight from the 7 calculator girths + stature (ANSUR II)",
   "status": "derived",
   "values": "{\"loglinear_men\":{\"const\":4.8101,\"lnH\":0.9873,\"ln_chest\":0.4132,\"ln_waist\":0.3061,\"ln_arm_flexed\":0.1089,\"ln_forearm_flexed\":0.1260,\"ln_thigh\":0.4389,\"ln_calf\":0.2780,\"ln_neck\":0.2188,\"cv10_sd_pct\":1.91,\"cv10_mae_pct\":1.51,\"p95_abs_pct\":3.7,\"rmse_kg\":1.64},\"loglinear_women\":{\"const\":4.9332,\"lnH\":0.9911,\"ln_chest\":0.3393,\"ln_waist\":0.2191,\"ln_arm_flexed\":0.1508,\"ln_forearm_flexed\":0.0820,\"ln_thigh\":0.5098,\"ln_calf\":0.3450,\"ln_neck\":0.2518,\"cv10_sd_pct\":2.20,\"p95_abs_pct\":4.15},\"sum_girth_exponents\":{\"men\":1.890,\"women\":1.898},\"behnke_type\":{\"formula\":\"W = k*H*(sum of 7 girths)^2, SI\",\"k_men_kg_m3\":2.904,\"sd_men_pct\":2.61,\"k_women_kg_m3\":3.027,\"sd_women_pct\":3.62},\"single_girth_chest_men\":{\"formula\":\"W = 43.18*H*C_chest^2\",\"sd_pct\":6.0},\"single_girth_waist_men_sd_pct\":11.5}",
   "sources": [
    {
     "title": "ANSUR II male public data",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    },
    {
     "title": "ANSUR II female public data",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_FEMALE_Public.csv"
    }
   ],
   "notes": "My fits (SI units: W kg, H and girths m; natural logs; 10-fold cross-validation). The free regression recovers the dimensional law: height exponent 0.99 and girth exponents summing to about 1.9, i.e. W proportional to H*G^2. Valid only within ANSUR's range: men's flexed arm 24.6-49.0 cm, BMI up to 43.5."
  },
  {
   "key": "ansur_frustum_volume_model",
   "label": "Girth-and-length frustum volume model x effective density (ANSUR II)",
   "status": "derived",
   "values": "{\"k_eff_men_kg_m3\":1052.7,\"k_eff_women_kg_m3\":1053.4,\"mass_err_sd_men_pct\":2.07,\"mass_err_sd_women_pct\":2.44,\"p95_abs_men_pct\":4.13,\"p95_abs_women_pct\":4.79,\"bias_by_BMI_quintile_men_pct\":[0.21,-0.19,0.0,0.04,0.05],\"corr_k_BMI_men\":0.005,\"mean_volume_men_L\":81.3,\"volume_share_men_pct\":{\"trunk\":51.5,\"head_neck\":6.0,\"arms_hands\":12.0,\"legs_feet\":30.5},\"ellipse_trunk_variant_k_men_kg_m3\":1187.7}",
   "sources": [
    {
     "title": "ANSUR II male public data",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    },
    {
     "title": "ANSUR II female public data",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_FEMALE_Public.csv"
    }
   ],
   "notes": "My crude model (scripts/segment_volume.py) uses circular frustums between measured girth levels and ANSUR landmark heights, an ellipsoid head, and box or stadium hands and feet. k_eff is just W/V, so it absorbs lung air, the circular-section bias and omitted shoulder mass; it is a calibration constant, not a tissue density. It shows no BMI trend inside ANSUR. The breadth/depth-ellipse variant gives an impossible 1188 kg/m^3, i.e. it underestimates trunk area. Some segment levels (calf at 65% of ankle-to-tibiale, head height 0.13 H) are my assumptions."
  },
  {
   "key": "ansur_extrapolation_tests",
   "label": "Out-of-range tests of weight-from-girth estimators",
   "status": "derived",
   "values": "{\"top2.5pct_flexed_arm_men\":{\"n\":105,\"arm_threshold_cm\":43.1,\"mean_W_kg\":113.0,\"mean_BMI\":35.4,\"loglinear_bias_pct\":0.09,\"loglinear_sd_pct\":1.83,\"behnke_bias_pct\":2.65},\"top2.5pct_BMI_men\":{\"n\":103,\"bmi_threshold\":36.2,\"loglinear_bias_pct\":-1.04,\"behnke_bias_pct\":2.31},\"women_fit_applied_to_men\":{\"loglinear_bias_pct\":0.89,\"loglinear_sd_pct\":2.08,\"behnke_bias_pct\":4.29},\"ANSUR_men_to_Penrose_men_5girths\":{\"n\":251,\"loglinear_bias_pct\":0.14,\"loglinear_sd_pct\":2.85,\"behnke_bias_pct\":0.07,\"behnke_sd_pct\":3.83},\"vtaper_men_top2.5pct_arm_over_waist\":{\"arm_cm\":39.0,\"waist_cm\":82.4,\"frustum_bias_pct\":-2.11,\"behnke_bias_pct\":-1.05,\"loglinear_bias_pct\":-0.44},\"vtaper_men_top2.5pct_chest_over_waist\":{\"frustum_bias_pct\":-1.26,\"behnke_bias_pct\":-1.72,\"loglinear_bias_pct\":-0.32},\"potbelly_men_bottom2.5pct_chest_over_waist\":{\"frustum_bias_pct\":1.37,\"behnke_bias_pct\":1.93,\"loglinear_bias_pct\":-0.49},\"vtaper_women_top2.5pct_arm_over_waist\":{\"frustum_bias_pct\":-1.88,\"behnke_bias_pct\":-3.80,\"loglinear_bias_pct\":-0.66}}",
   "sources": [
    {
     "title": "ANSUR II male public data",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    },
    {
     "title": "ANSUR II female public data",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_FEMALE_Public.csv"
    },
    {
     "title": "JSE body-fat data file (Penrose et al. 1985)",
     "url": "https://jse.amstat.org/datasets/fat.dat.txt"
    }
   ],
   "notes": "Models were fitted on the remaining subjects and tested on the held-out extreme group (scripts/scaling_analysis.py, scripts/vtaper_check.py). Lean V-shaped people are under-predicted by the geometric methods and pot-bellied people over-predicted, consistent with lean tissue being denser (Siri: about 1.088 at 5% fat vs 1.053 at 20%). The Penrose test used neck, chest, waist/abdomen, thigh and wrist, because Penrose biceps were extended, not flexed. Caveat: even the 'extreme' ANSUR arms (about 43-49 cm) are far below elite bodybuilders, so no test reaches bodybuilder or comic scale."
  },
  {
   "key": "trunk_cross_section_shape",
   "label": "Trunk cross-section shape factors (area vs circle of the same perimeter)",
   "status": "derived",
   "values": "{\"ellipse_area_over_circle_area_by_depth_breadth_ratio\":{\"1.0\":1.0,\"0.9\":0.996,\"0.8\":0.982,\"0.7\":0.954,\"0.6\":0.909,\"0.5\":0.841,\"0.4\":0.745},\"ANSUR_men\":{\"chest_depth_over_breadth\":0.877,\"waist_depth_over_breadth\":0.727,\"buttock_depth_over_breadth\":0.71,\"chest_C_over_ellipse_perimeter\":1.238}}",
   "sources": [
    {
     "title": "ANSUR II male public data",
     "url": "https://tools.openlab.psu.edu/publicData/ANSUR_II_MALE_Public.csv"
    },
    {
     "title": "Yeadon MR 1990 J Biomech 23:67-74 abstract (stadium solids more accurate than elliptical discs)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:2307693%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Isoperimetric ratios are my arithmetic using Ramanujan's ellipse perimeter (scripts/derived_tables.py). The measured ANSUR chest tape is 24% longer than the ellipse built from chest breadth and depth, so real torsos are not ellipses; Yeadon used stadium solids for this reason. A circle-from-girth model overstates the area of a flattened (wide-lat) torso by up to 16-25% at depth/breadth 0.5-0.4."
  },
  {
   "key": "yeadon_model_accuracy",
   "label": "Yeadon (1990) 40-solid inertia model: whole-body mass accuracy",
   "status": "measured",
   "values": "{\"n_solids\":40,\"n_measurements\":95,\"gittoes2009_abs_err_direct_pct\":2.10,\"gittoes2009_abs_err_image_pct\":2.87,\"gittoes_n\":5}",
   "sources": [
    {
     "title": "Yeadon MR. The simulation of aerial movement II: a mathematical inertia model of the human body. J Biomech 1990;23:67-74 (abstract)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:2307693%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "Gittoes MJR, Bezodis IN, Wilson C. An image-based approach to obtaining anthropometric measurements for inertia modeling. J Appl Biomech 2009;25:265-70 (abstract page)",
     "url": "https://pure.cardiffmet.ac.uk/en/publications/an-image-based-approach-to-obtaining-anthropometric-measurements-/"
    }
   ],
   "notes": "Yeadon's abstract says errors in total body mass are 'discussed with reference to the unknown lung volumes'; his own numbers were not accessible (the Loughborough PDF was blocked). Gittoes 2009 tested 5 athletic performers with Dempster segment densities."
  },
  {
   "key": "inertia_model_mass_accuracy_table",
   "label": "Reported whole-body mass accuracy of geometric inertia models (Jensen, Hatze, Yeadon)",
   "status": "reported",
   "values": "{\"jensen1978\":{\"method\":\"photo, elliptical zones\",\"n_measurements\":408,\"mass_accuracy_pct\":\"<2\"},\"hatze1980\":{\"method\":\"direct\",\"n_measurements\":242,\"mass_accuracy_as_printed\":\"<0.05\"},\"yeadon1990\":{\"n_measurements\":95,\"mass_accuracy_pct\":\"<2.1\"},\"gittoes2009\":{\"mass_accuracy_pct\":\"<2.9\"}}",
   "sources": [
    {
     "title": "Williams G, Irwin G, Kerwin DG, Newell KM. Accuracy of body mass prediction using segmental inertia parameters modelled from photographic images. ISBS Proceedings 2013 (Table 1)",
     "url": "https://ojs.ub.uni-konstanz.de/cpa/article/view/5669/5160"
    }
   ],
   "notes": "This is a secondary table. Hatze's '< 0.05' has no unit and may mean 0.05% or be a typo for 0.5%: treat as unverified. The Jensen 1978 (J Biomech 11:349) and Hatze 1980 (J Biomech 13:833) originals were not accessible (records only), and nor was Hanavan 1964 (DTIC blocked)."
  },
  {
   "key": "williams2013_mass_dependent_error",
   "label": "Inertia-model mass error grows away from the calibration body size",
   "status": "measured",
   "values": "{\"n\":15,\"abs_err_pct_mean\":5.42,\"abs_err_pct_sd\":2.92,\"rel_err_pct_mean\":-2.06,\"rel_err_pct_sd\":5.98,\"r_mass_vs_rel_err\":-0.80,\"crossover_mass_kg\":71,\"suggested_error_far_from_71kg_pct\":10}",
   "sources": [
    {
     "title": "Williams G et al. 2013, ISBS Proceedings Archive, 31st Conference (full text PDF)",
     "url": "https://ojs.ub.uni-konstanz.de/cpa/article/view/5669/5160"
    },
    {
     "title": "Same, article landing page (publication date 2013-09-04)",
     "url": "https://ojs.ub.uni-konstanz.de/cpa/article/view/5669"
    }
   ],
   "notes": "Yeadon model with image-based measurements and Dempster densities, in 15 male recreational athletes (74.7 +/- 8.0 kg). Masses above 71 kg tended to be over-estimated and those below under-estimated: 'errors could be up to +/- 10% for participants with body masses much greater or less than 71 kg'. The authors doubt the relation stays linear at the extremes."
  },
  {
   "key": "hanavan_total_weight_error",
   "label": "Hanavan cylinder/frustum model: total weight discrepancy",
   "status": "measured",
   "values": "{\"n\":30,\"barter_equations_bias_pct\":-2.03,\"clauser_equations_bias_pct\":4.59}",
   "sources": [
    {
     "title": "Miller DI, Morrison WE. Prediction of segmental parameters using the Hanavan human body model. Med Sci Sports 1975 (abstract)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:1207433%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "In 30 adult male athletes, the sum of predicted segment weights was below body weight by an average of 2.03% with Barter's equations and above it by 4.59% with Clauser's. The original Hanavan 1964 AMRL report was not accessible."
  },
  {
   "key": "ezone_volume_accuracy",
   "label": "Elliptical zone (E-Zone, Jensen-type) total body volume vs 3D scanning",
   "status": "measured",
   "values": "{\"n\":17,\"total_volume_relative_TEM_pct\":3,\"large_segment_TEM_pct\":\"<10\"}",
   "sources": [
    {
     "title": "Chiu CY, Pease DL, Fawkner S, Sanders RH. Validation of body volume acquisition by using elliptical zone method. Int J Sports Med 2016;37:1117-23 (abstract)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:27676147%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "17 men of diverse somatotypes, with 3D photonic scanning as the reference. Total body volume relative TEM was 'around 3%'. Upper and lower torso, thigh, shank, upper arm and lower arm were within 10%; neck, hand and foot were poor."
  },
  {
   "key": "surface_model_densities",
   "label": "Segment densities used to convert scanned volume to mass (lungs included)",
   "status": "reported",
   "values": "{\"trunk_kg_m3\":940,\"other_segments_kg_m3\":1000}",
   "sources": [
    {
     "title": "Peyer KE, Morris M, Sellers WI. Subject-specific body segment parameter estimation using 3D photogrammetry with multiple cameras. PeerJ 2015;3:e831 (PMC4359122 full text)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/PMC4359122/fullTextXML"
    }
   ],
   "notes": "Quote: 'a trunk density value of 940 kg/m3 was chosen, while a uniform density of 1000 kg/m3 was assumed for all other body segments'. 'The body mass calculated from the volume was never exactly the same as the recorded body mass, so the density values were adjusted pro-rata.' They note that segment densities such as Winter's for the trunk exclude lung volume."
  },
  {
   "key": "limb_volume_from_circumferences",
   "label": "Accuracy of circumference-based (frustum/disc) limb volume vs water displacement",
   "status": "measured",
   "values": "{\"farina2024_segmental_centimetric_mean_err_pct\":0.86,\"farina2024_fixed_height_mean_err_pct\":1.2,\"farina2024_n\":22,\"chromy2015_frustum_sign_err_pct\":[2,8],\"chromy2015_disc_partial_frustum_err_pct\":[1,8]}",
   "sources": [
    {
     "title": "Farina G et al. Limb volume measurements: a comparison of circumferential techniques and optoelectronic systems against water displacement. Bioengineering 2024;11:382 (abstract)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:38671803%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "Chromy A et al. Limb volume measurements: comparison of accuracy and decisive parameters of the most used present methods. SpringerPlus 2015;4:707 (abstract)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:26618096%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Farina used circumferences every 5 cm (arm) or 10 cm (leg), or at proportional heights, and found errors under 2%. Chromy measured only 2 human subjects and reference cylinders; the frustum sign model ranged 2-8% depending on the person measuring. Both concern limbs, not the trunk."
  },
  {
   "key": "weight_from_anthropometry_clinical",
   "label": "Clinical equations predicting body weight from girths and lengths",
   "status": "measured",
   "values": "{\"chumlea1988_n_validation\":228,\"cross_validation_mean_signed_diff_kg\":[0.1,1.8],\"inputs\":\"knee height, arm and calf circumference, triceps and subscapular skinfolds\"}",
   "sources": [
    {
     "title": "Chumlea WC, Guo S, Roche AF, Steinbaugh ML. Prediction of body weight for the nonambulatory elderly from anthropometry. J Am Diet Assoc 1988;88:564-8 (abstract)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:3367012%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Elderly white sample. The abstract gives mean signed differences only, not individual SEE; clinical-validation errors were larger. Shown as an example of an empirical girth-to-weight regression."
  },
  {
   "key": "action_toy_allometry_precedent",
   "label": "Precedent: scaling figures to a 1.78 m man by classical allometry (Pope et al. 1999)",
   "status": "reported",
   "values": "{\"reference_height_m\":1.78,\"girths_measured\":[\"waist\",\"chest\",\"biceps\"]}",
   "sources": [
    {
     "title": "Pope HG et al. Evolving ideals of male body image as seen through action toys. Int J Eat Disord 1999;26:65-72 (abstract)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:10349585%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Abstract: they measured waist, chest and biceps circumference of each figure and 'scaled these measurements using classical allometry to the height of an actual man (1.78 m)'. 'Many contemporary figures far exceed the muscularity of even the largest human bodybuilders.' The per-figure numbers are not in the abstract and were not verified."
  },
  {
   "key": "height_rescaling_multipliers",
   "label": "Weight and girth multipliers for moving a 1.80 m build to another height",
   "status": "derived",
   "values": "{\"formula\":\"W1/W0 = (H1/H0)^p ; G1/G0 = (H1/H0)^((p-1)/2)\",\"H2.0\":{\"W_p2\":1.235,\"W_p2.3\":1.274,\"W_p2.5\":1.301,\"W_p3\":1.372,\"G_p2\":1.054,\"G_p3\":1.111},\"H2.2\":{\"W_p2\":1.494,\"W_p3\":1.826,\"G_p2\":1.106,\"G_p3\":1.222},\"H2.5\":{\"W_p2\":1.929,\"W_p3\":2.679,\"G_p2\":1.179,\"G_p3\":1.389},\"H1.6\":{\"W_p2\":0.790,\"W_p3\":0.702,\"G_p2\":0.943,\"G_p3\":0.889}}",
   "sources": [
    {
     "title": "Heymsfield 2014 (empirical p of about 2)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:25411280%20AND%20SRC:MED&resultType=core&format=json"
    },
    {
     "title": "Burton 2007 (W/H^3 as the scale-independent build index)",
     "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:18092209%20AND%20SRC:MED&resultType=core&format=json"
    }
   ],
   "notes": "Pure arithmetic (out/derived_tables.json), with girths from the geometric law G proportional to sqrt(W/H). Choosing p (2 = same BMI/FFMI, about 2.2-2.45 = athlete FFM scaling implied by the height corrections, 3 = scaled copy) changes the result far more than any other modelling choice."
  }
 ],
 "gaps": "I could not reach these primary sources and used secondary statements instead:\n- Siri 1961 (NAS volume) and Brozek et al. 1963: only bibliographic records. The equations come from the JSE dataset documentation, the densities from Kuriyan 2018, and the Siri form is my algebraic derivation.\n- Behnke 1961 (J Appl Physiol 16:949 and 960) and the full Katch/Behnke 1987 PDF (Cloudflare-blocked). The k constants and the often-quoted 'W = D^2 x h x 0.0111' form are unverified; only the Katch 1987 abstract was read.\n- Jensen 1978, Hatze 1980, Hanavan 1964 (DTIC blocked) and Yeadon's own mass errors (Loughborough PDF blocked). Their accuracies come from a secondary ISBS 2013 table; Hatze's '<0.05' value is ambiguous.\n- Kouri 1995 full text. The height-correction coefficient is 6.3 in the abstract and 6.1 as cited by Trexler, and Kouri's body-fat method is unknown.\n- Benn 1971 is a scanned image and was not read; Burton 2007's abstract stands in for it.\n\nNot found or untested:\n- No dataset pairs measured weight with girths at elite-bodybuilder or comic scale, so extrapolation beyond ANSUR is untested. ANSUR's maximum flexed arm is 49.0 cm and BMI 43.5, and ANSUR has no body-fat measurement, so the fat percentage behind the calibrated k_eff = 1053 kg/m3 is unknown.\n- I found no source on how individual girths change when muscle, rather than fat, is added. The recommendation to use the geometric 0.5 exponent for muscle-driven change is an assumption.\n- I did not source lung-gas volumes; the 940 kg/m3 trunk density (Peyer 2015) and my empirical k_eff stand in for them.\n- The adipose-tissue density value was not sourced (only lipid at 0.9007).\n- The per-figure measurements of Pope et al. 1999 were not verified.\n\nCaveats on my own analyses (ANSUR II, Penrose/JSE):\n- These are derived estimates on military and convenience samples.\n- My frustum model's segment-level placements (calf level, head height, hand and foot shapes) are assumptions."
}
```

</details>


- `TaskCreate` Build calculator: research sourced build data
- `TaskCreate` Build calculator: build page, test, publish, commit

**Claude · 2026-10-10 01:31:23 UTC**

I've started the research workflow for the build calculator. It has four topics, and a separate fact-checker re-fetches each topic's sources:

1. **Everyday bodies:** the US Army ANSUR II survey, about 6,000 measured men and women. It gives real percentiles for height, weight and each girth. I'll also fit how girths scale with weight and height, and how accurately girths predict weight.
2. **Bodybuilders and strongmen:** Coleman, Schwarzenegger, Yates, Cutler, Heath, Big Ramy, Shaw, Björnsson, Hall, plus a drug-tested natural for comparison. Their measurements are mostly magazine-reported, so the page will label them that way.
3. **Comic characters:** official heights and weights from Marvel's Official Handbook and DC sources, e.g. Hulk, Thing, Juggernaut, Superman, Bane. Publishers almost never give girths. Where they don't, the page will derive them and say so.
4. **The model:** body density versus body fat (Siri, Brozek), the muscle-mass-per-height index for natural limits (FFMI), and how girths scale with height and weight.

**How the page will work:** pick a build, set a height, and get weight plus chest, waist, flexed arm, forearm, thigh, calf and neck, in feet and inches or metric. Each number is tagged measured, official, reported or derived. Rex and Ollie join the build list once their picture-based estimate is in. It will be its own page with its own link, in a new folder in lodge-docs.

**Running now:** the Rex mass estimate, the Rex final audit, and this research.

**Next:** finish the Rex work first: fill in the masses, fix the audit findings, publish. Then build the calculator from the checked research. It's a few hours of work.

If you have particular characters or bodybuilders you want included, name them and I'll add them.


*Woken · 2026-10-10 02:25:00 UTC · Background task wqvrczqx3 completed: Dynamic workflow "Adversarial audit of the density/weight and Rex+Ollie features: find issues per lens, then verify each lens" completed. Next: The final audit finished. Extracting the confirmed findings.*

**Claude · 2026-10-10 02:25:03 UTC**

The final audit finished. Extracting the confirmed findings.


- `Bash` Summarise confirmed audit findings: `cd /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387 && python3 - <<'EOF'` (+15 lines)
  - result: Exit code 1
  - result: Traceback (most recent call last):
  - result:   File "<stdin>", line 10, in <module>
- `Bash` Rebuild confirmed findings list from journal: `cd /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387 && head -c 300 tasks/wqvrczqx3.output; echo; python3 - <<'EOF'` (+27 lines)
- `Bash` Parse audit output JSON and list findings: `cd /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387 && python3 - <<'EOF'` (+10 lines)
- `Bash` Check mass estimate workflow progress: `python3 -c "` (+7 lines)
- `Bash` Summarise the three mass estimates: `python3 -c "` (+11 lines)
- `Bash` Set provisional picture-based builds: `cd /home/user/dino-strength-sim && python3 - <<'EOF'` (+11 lines)
- `Workflow` rex-audit-fixes: Fix the 54 confirmed audit findings in four serial batches (density/weight, catch, collide/wrestle, arm/duo/misc), then re-verify every finding on the final build
  - run `wf_068bea6f-0e1`: 6 subagents, listed below

<details>
<summary>Subagent `fix:density-weight` (rex-audit-fixes, 2026-10-10 02:27:52 UTC): The full pipeline ends 'all checks passed': python3 build-data.py &amp;&amp; node build.js &amp;&amp; node test/shots.js &amp;&amp; node test/calibration.js. Files changed: src/engine.js, src/app.html, src/static-data.js, test/calibration.js, research/final-density.json; src/data.js and dist/ were regenerated. Returned items: 15 (e.g. p0; d6).</summary>

Workflow run `wf_068bea6f-0e1`, phase `Fix`, agent `ad3de786a7f378869`. Prompt, verbatim:

```text
You are fixing confirmed audit findings in the "Rex Super-Strength Lab" physics simulator at /home/user/dino-strength-sim.
Findings file: /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit-final.json. It is a JSON array of 4 lenses (physics, regression, data, ux). Each has a "confirmed" array. IDs are the lens initial plus the index in that array: p0 = physics.confirmed[0], r3 = regression.confirmed[3], d4 = data.confirmed[4], u10 = ux.confirmed[10]. Each finding has title, claim, evidence (exact repro), fix, and a skeptic's verdict with a refined fix. Line numbers may have drifted; search by content.
Files: src/engine.js (physics), src/app.html (page text and UI), src/static-data.js (assumption cards), research/final-*.json (sourced facts; build-data.py turns them into src/data.js), test/calibration.js (tests).
Build and test after every few fixes: cd /home/user/dino-strength-sim && python3 build-data.py && node build.js && node test/shots.js && node test/calibration.js   (calibration must end "all checks passed"; it takes about 75 s).
Render any page state and dump its text to check your fix: node /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/weightshot.js '[["name",1280,{STATE}]]'  (state keys: see DEFAULTS in src/app.html; screenshots land in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/<name>.png; add "dark" as a 4th element for dark mode; use 390 for phone width).
Rules:
- Fix the root cause, minimally and consistently; do not widen scope. If two findings conflict, choose the physically correct option and say why.
- For each critical or major physics fix, add a regression check to test/calibration.js.
- Page text: plain, short sentences; every number sourced or labelled an estimate; never invent canon about Ollie (bull-man with horns, nose ring, earrings, vest, cargo pants, boots: no claws). Rex and Ollie are equally strong and equally indestructible.
- Do NOT change: the BUILDS / DEFAULT_BODIES values in src/engine.js (marked provisional; set separately), the art figures and avatars, or the line that forces state.oSame = true on load.
- Do not commit or push. Other agents fix other batches after you, on the same files: leave the tree building and passing.
Return a list of every finding ID in your batch with what you changed (file and function) and how you verified it, or why you left it.

YOUR BATCH (density-weight): p0, p6, p7, p8, d2, d5, d6, d8, d12, u3, u6, u8, r9, r3, u14.
Weight tab, settle/fall-through, neutron-matter caveat, run/walk rules, Pull tab standing check, phone-width charts. p0 (settle units) is critical: fix it first and add the suggested check.
```

</details>

<details>
<summary>Subagent `fix:catch` (rex-audit-fixes, 2026-10-10 02:46:14 UTC): The full required chain passes: build-data.py, build.js, shots.js (no overflow, no errors), and calibration.js ends 'all checks passed'. Calibration now has 18 new regression checks. Returned items: 16 (e.g. p1; p3).</summary>

Workflow run `wf_068bea6f-0e1`, phase `Fix`, agent `a53d9e16ee9ff0949`. Prompt, verbatim:

```text
You are fixing confirmed audit findings in the "Rex Super-Strength Lab" physics simulator at /home/user/dino-strength-sim.
Findings file: /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit-final.json. It is a JSON array of 4 lenses (physics, regression, data, ux). Each has a "confirmed" array. IDs are the lens initial plus the index in that array: p0 = physics.confirmed[0], r3 = regression.confirmed[3], d4 = data.confirmed[4], u10 = ux.confirmed[10]. Each finding has title, claim, evidence (exact repro), fix, and a skeptic's verdict with a refined fix. Line numbers may have drifted; search by content.
Files: src/engine.js (physics), src/app.html (page text and UI), src/static-data.js (assumption cards), research/final-*.json (sourced facts; build-data.py turns them into src/data.js), test/calibration.js (tests).
Build and test after every few fixes: cd /home/user/dino-strength-sim && python3 build-data.py && node build.js && node test/shots.js && node test/calibration.js   (calibration must end "all checks passed"; it takes about 75 s).
Render any page state and dump its text to check your fix: node /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/weightshot.js '[["name",1280,{STATE}]]'  (state keys: see DEFAULTS in src/app.html; screenshots land in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/<name>.png; add "dark" as a 4th element for dark mode; use 390 for phone width).
Rules:
- Fix the root cause, minimally and consistently; do not widen scope. If two findings conflict, choose the physically correct option and say why.
- For each critical or major physics fix, add a regression check to test/calibration.js.
- Page text: plain, short sentences; every number sourced or labelled an estimate; never invent canon about Ollie (bull-man with horns, nose ring, earrings, vest, cargo pants, boots: no claws). Rex and Ollie are equally strong and equally indestructible.
- Do NOT change: the BUILDS / DEFAULT_BODIES values in src/engine.js (marked provisional; set separately), the art figures and avatars, or the line that forces state.oSame = true on load.
- Do not commit or push. Other agents fix other batches after you, on the same files: leave the tree building and passing.
Return a list of every finding ID in your batch with what you changed (file and function) and how you verified it, or why you left it.

YOUR BATCH (catch): p1, p3, d4, p5, p12, r0, r10, r4, r5, r6, r7, u4, u9, u12, d9, d11.
Game of catch and the solo Throw release-angle issue (r0/r10 share a root cause). p1 (energy released at the catcher in relativistic catches) is critical. For d4, use the object crush values only where they mean whole-object strength; otherwise label or add a separate strength. For d9 and d11, correct or add research facts.
```

</details>

<details>
<summary>Subagent `fix:collide-wrestle` (rex-audit-fixes, 2026-10-10 03:40:05 UTC): Full sequence passes: python3 build-data.py, node build.js, node test/shots.js (0 overflow, no errors at both widths) and node test/calibration.js, which ends 'all checks passed'. Ten new regression checks are at the end of /home/user/dino-strength-sim/test/calibration.js, covering u0, r2, p4 and r1. Returned items: 11 (e.g. u0; r2).</summary>

Workflow run `wf_068bea6f-0e1`, phase `Fix`, agent `a7afded9878c51016`. Prompt, verbatim:

```text
You are fixing confirmed audit findings in the "Rex Super-Strength Lab" physics simulator at /home/user/dino-strength-sim.
Findings file: /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit-final.json. It is a JSON array of 4 lenses (physics, regression, data, ux). Each has a "confirmed" array. IDs are the lens initial plus the index in that array: p0 = physics.confirmed[0], r3 = regression.confirmed[3], d4 = data.confirmed[4], u10 = ux.confirmed[10]. Each finding has title, claim, evidence (exact repro), fix, and a skeptic's verdict with a refined fix. Line numbers may have drifted; search by content.
Files: src/engine.js (physics), src/app.html (page text and UI), src/static-data.js (assumption cards), research/final-*.json (sourced facts; build-data.py turns them into src/data.js), test/calibration.js (tests).
Build and test after every few fixes: cd /home/user/dino-strength-sim && python3 build-data.py && node build.js && node test/shots.js && node test/calibration.js   (calibration must end "all checks passed"; it takes about 75 s).
Render any page state and dump its text to check your fix: node /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/weightshot.js '[["name",1280,{STATE}]]'  (state keys: see DEFAULTS in src/app.html; screenshots land in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/<name>.png; add "dark" as a 4th element for dark mode; use 390 for phone width).
Rules:
- Fix the root cause, minimally and consistently; do not widen scope. If two findings conflict, choose the physically correct option and say why.
- For each critical or major physics fix, add a regression check to test/calibration.js.
- Page text: plain, short sentences; every number sourced or labelled an estimate; never invent canon about Ollie (bull-man with horns, nose ring, earrings, vest, cargo pants, boots: no claws). Rex and Ollie are equally strong and equally indestructible.
- Do NOT change: the BUILDS / DEFAULT_BODIES values in src/engine.js (marked provisional; set separately), the art figures and avatars, or the line that forces state.oSame = true on load.
- Do not commit or push. Other agents fix other batches after you, on the same files: leave the tree building and passing.
Return a list of every finding ID in your batch with what you changed (file and function) and how you verified it, or why you left it.

YOUR BATCH (collide-wrestle): p4, u2, r2, u0, d3, d10, u5, u7, r1, u11, p11.
Unstoppable force vs immovable object (Push and Charge), Wrestle tab. u0 (three tabs disagree on the same setup) is critical: make the tabs consistent, or state clearly why they model different situations.
```

</details>

<details>
<summary>Subagent `fix:arm-duo-misc` (rex-audit-fixes, 2026-10-10 04:08:28 UTC): The final run passed in full: python3 build-data.py, node build.js, node test/shots.js (no overflow or errors at 1280 light and 390 dark) and node test/calibration.js (106 ok, 'all checks passed'). I did not commit or push. Returned items: 12 (e.g. p2; p9).</summary>

Workflow run `wf_068bea6f-0e1`, phase `Fix`, agent `a1d595a76492d3ebe`. Prompt, verbatim:

```text
You are fixing confirmed audit findings in the "Rex Super-Strength Lab" physics simulator at /home/user/dino-strength-sim.
Findings file: /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit-final.json. It is a JSON array of 4 lenses (physics, regression, data, ux). Each has a "confirmed" array. IDs are the lens initial plus the index in that array: p0 = physics.confirmed[0], r3 = regression.confirmed[3], d4 = data.confirmed[4], u10 = ux.confirmed[10]. Each finding has title, claim, evidence (exact repro), fix, and a skeptic's verdict with a refined fix. Line numbers may have drifted; search by content.
Files: src/engine.js (physics), src/app.html (page text and UI), src/static-data.js (assumption cards), research/final-*.json (sourced facts; build-data.py turns them into src/data.js), test/calibration.js (tests).
Build and test after every few fixes: cd /home/user/dino-strength-sim && python3 build-data.py && node build.js && node test/shots.js && node test/calibration.js   (calibration must end "all checks passed"; it takes about 75 s).
Render any page state and dump its text to check your fix: node /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/weightshot.js '[["name",1280,{STATE}]]'  (state keys: see DEFAULTS in src/app.html; screenshots land in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/<name>.png; add "dark" as a 4th element for dark mode; use 390 for phone width).
Rules:
- Fix the root cause, minimally and consistently; do not widen scope. If two findings conflict, choose the physically correct option and say why.
- For each critical or major physics fix, add a regression check to test/calibration.js.
- Page text: plain, short sentences; every number sourced or labelled an estimate; never invent canon about Ollie (bull-man with horns, nose ring, earrings, vest, cargo pants, boots: no claws). Rex and Ollie are equally strong and equally indestructible.
- Do NOT change: the BUILDS / DEFAULT_BODIES values in src/engine.js (marked provisional; set separately), the art figures and avatars, or the line that forces state.oSame = true on load.
- Do not commit or push. Other agents fix other batches after you, on the same files: leave the tree building and passing.
Return a list of every finding ID in your batch with what you changed (file and function) and how you verified it, or why you left it.

YOUR BATCH (arm-duo-misc): p2, p9, p10, d0, d1, d13, u1, r8, u10, d7, r11, u13.
Arm wrestling, the duo gate and fighter cards, assumption cards, Lift tile label, tiny-mass input, number formatting.
```

</details>

<details>
<summary>Subagent `reverify:1` (rex-audit-fixes, 2026-10-10 04:34:53 UTC): Rebuilt once (build-data, build, shots: 0 overflow and no errors at 1280 light / 390 dark). Calibration ends 'all checks passed' (106 ok). Returned items: 25 (e.g. p0; p1).</summary>

Workflow run `wf_068bea6f-0e1`, phase `Re-verify`, agent `a3d55036d11a32c8d`. Prompt, verbatim:

```text
You are fixing confirmed audit findings in the "Rex Super-Strength Lab" physics simulator at /home/user/dino-strength-sim.
Findings file: /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit-final.json. It is a JSON array of 4 lenses (physics, regression, data, ux). Each has a "confirmed" array. IDs are the lens initial plus the index in that array: p0 = physics.confirmed[0], r3 = regression.confirmed[3], d4 = data.confirmed[4], u10 = ux.confirmed[10]. Each finding has title, claim, evidence (exact repro), fix, and a skeptic's verdict with a refined fix. Line numbers may have drifted; search by content.
Files: src/engine.js (physics), src/app.html (page text and UI), src/static-data.js (assumption cards), research/final-*.json (sourced facts; build-data.py turns them into src/data.js), test/calibration.js (tests).
Build and test after every few fixes: cd /home/user/dino-strength-sim && python3 build-data.py && node build.js && node test/shots.js && node test/calibration.js   (calibration must end "all checks passed"; it takes about 75 s).
Render any page state and dump its text to check your fix: node /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/weightshot.js '[["name",1280,{STATE}]]'  (state keys: see DEFAULTS in src/app.html; screenshots land in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/<name>.png; add "dark" as a 4th element for dark mode; use 390 for phone width).
Rules:
- Fix the root cause, minimally and consistently; do not widen scope. If two findings conflict, choose the physically correct option and say why.
- For each critical or major physics fix, add a regression check to test/calibration.js.
- Page text: plain, short sentences; every number sourced or labelled an estimate; never invent canon about Ollie (bull-man with horns, nose ring, earrings, vest, cargo pants, boots: no claws). Rex and Ollie are equally strong and equally indestructible.
- Do NOT change: the BUILDS / DEFAULT_BODIES values in src/engine.js (marked provisional; set separately), the art figures and avatars, or the line that forces state.oSame = true on load.
- Do not commit or push. Other agents fix other batches after you, on the same files: leave the tree building and passing.
Return a list of every finding ID in your batch with what you changed (file and function) and how you verified it, or why you left it.

You are now a SKEPTICAL RE-VERIFIER, not a fixer: do not edit project files (scratch scripts under /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/reverify/ only). Rebuild once, then for each of these finding IDs re-run its original reproduction on the current build and decide whether it is really fixed, and whether the fix introduced a new problem nearby: p0 p1 p2 p3 p4 p5 p6 p7 p8 p9 p10 p11 p12 r0 r1 r2 r3 r4 r5 r6 r7 r8 r9 r10 r11.

Fixers' reports:
[
 {
  "batch": "density-weight",
  "report": {
   "items": [
    {
     "id": "p0",
     "status": "fixed",
     "change": "src/engine.js settle() passFor: the gravitational-drag term now uses m*dfCoef*v (a force) instead of m*dfCoef*v^2. test/calibration.js has two new checks: settle().firstPassLossJ / (m g x the 3-D shortfall) is 1 +- 0.15 for the 2 m neutron-star Rex, and the settling time differs between 7.4e16 kg and 1e18 kg.",
     "verified": "node: 7.416e16 kg at 2 m gives a loss of 4.18e18 J per trip (ratio to the 3-D shortfall 1.09) and 2,198 yr; 1e18 kg gives 512 yr. Page {H:2,m:7.416e16}: '~2,200 years / 490 years to 29,000 years', '1 Gt TNT per trip ... magnitude 6.5 quake'. Both new calibration checks pass."
    },
    {
     "id": "d6",
     "status": "fixed",
     "change": "research/final-density.json has two new facts. gravitational_drag_ostriker cites Ostriker 1999, ApJ 513:252, arXiv astro-ph/9810324; its eqs. 12, 14 and 15 were read from the arXiv PDF, and the ln-Lambda = 5 choice is labelled an estimate. rock_sound_speed_prem gives the PREM S and P wave speeds, read from ObsPy prem.nd: 3.2-7.3 and 5.8-13.7 km/s. build-data.py turns both into source rows. src/engine.js: dfCoef takes an optional cs, fallThrough and settle pass opt.cs, and there is a new W8.CS_LOW = 3200. In weight(), the fast end of the settle, shortfall and stop ranges now uses strong rock, k = 2 and cs = 3.2 km/s. app.html bayWeight math line and the static-data.js 'Sinking' card now give the c_s basis and say how the ranges use it.",
     "verified": "Sensitivity scan: with cs 3.5, 6, 9 and 13.7 km/s the 7.4e16 kg settle times are 748, 2,198, 3,551 and 4,419 yr. All now fall inside the shown range of 490 to 29,000 yr. data.js now has the Ostriker and prem.nd rows."
    },
    {
     "id": "p7",
     "status": "fixed",
     "change": "src/engine.js has a new restRadius(body, sigma) helper, and settle() uses it. In weight(), the weak- and strong-rock stuckRange runs integrate with full:true and tMax 4 days until he sticks; if a run never sticks, it falls back to the static rest radius. A run is never mapped to r = 0. stuckRange.swings is now recorded. The calibration check now expects the computed weak-rock stop (10.4 +- 3 km) instead of 'rMin < 50 km'.",
     "verified": "At 2 m, the white-dwarf weak-rock run passes the centre and sticks at 10.4 km (the old run reported 'not stuck'). The page reads 'anywhere from 10.4 km to 646 km from the centre ... weak rock lets him swing through the centre before he stops'. The 3.05 m preset reads '1.08 km to 87.5 km'."
    },
    {
     "id": "d12",
     "status": "fixed",
     "change": "Same engine fix as p7. The verdict sentence in app.html bayWeight adds 'weak rock lets him swing through the centre before he stops' when a run swung first. The deep_rock_strength_assumption note in research/final-density.json is refreshed to the current values: threshold 3.1e6-1.25e8 kg with buoyancy, white-dwarf stop about 10 to 646 km, and the parameters at each end of the range.",
     "verified": "Rendered the white-dwarf states at 2 m and 3.05 m: the page no longer shows '0 mm'. The calibration check passes."
    },
    {
     "id": "u3",
     "status": "fixed",
     "change": "app.html bayWeight verdict now prints the shortfall range itself: 'coasts to a stop X to Y under the far side's surface (it depends on how strong deep rock is)'. 'a few metres/kilometres (about ...)' is gone. A shared shortText says 'up to Y' when the low end is under 1 m, because the 3-D turnaround has a +0.45 m bias in a no-drag run; otherwise the page would print '0 mm to 50 m'. The same text is used in the per-trip bullet.",
     "verified": "m=1e12: '512 km to 951 km under the far side's surface'. m=1e15: '556 m to 1.11 km'. 2 m neutron star: '2.78 m to 9.75 m'. 1e18 kg: 'up to 50.4 m'."
    },
    {
     "id": "d8",
     "status": "fixed",
     "change": "app.html happens() takes an optional cap, and bayWeight calls happens(items, 6). The Weight tab can produce at most 6 bullets, so the osmium and neutron-matter caveat is no longer cut.",
     "verified": "The neutron-star preset at the default height (1.05e18 kg) and the 2 m neutron-star state now show all 6 bullets, including the matter caveat. The other tabs still cap at 5."
    },
    {
     "id": "u6",
     "status": "fixed",
     "change": "Same fix as d8: happens(items, 6) in bayWeight. I raised the cap rather than reordering, because cutting the Bondi bullet instead would orphan the 'Air falls onto him' chip.",
     "verified": "Rendered the Neutron star chip state and m=1e15: the caveat bullet appears in both."
    },
    {
     "id": "p8",
     "status": "fixed",
     "change": "src/engine.js: new W8.RHO_NUC = 2.7e17 and W8.RHO_NS_CORE = 2.7e18 (10 n0, from the Lattimer & Prakash fact). nmCaveat now carries rhoNuc and beyondNS. app.html has a new nmText(). Above 2.7e18 kg/m3 it says he is denser than any known matter, even neutron-star cores, that holding it would take far more than the 2.2-3.4 x 10^32 Pa of nuclear matter, and keeps 16 MeV per neutron as 'at least'. When the energy exceeds Earth's binding energy it is shown as a ratio instead of a 6,300,000% figure.",
     "verified": "m=1e22 and 1e25 render the 'denser than any known matter' text with '2.2-3.4 x 10^32 Pa' and 'at least ...'."
    },
    {
     "id": "d2",
     "status": "fixed",
     "change": "For 1e17 to 2.7e18 kg/m3, app.html nmText() now gives the pressure and energy at nuclear density only: 'At nuclear density (2.7 x 10^17 kg/m3) that takes ... 2.2-3.4 x 10^32 Pa, and more when denser', and '16 +- 2 MeV per neutron ..., and the nuclei that form and decay add more'. The figure for this Rex is labelled 'roughly ... (an estimate)'. I reworded the text below rho0 rather than gating at rho0, so the 1e17-2.7e17 band doesn't fall back to the electron-degenerate white-dwarf sentence. Also updated the E_NM comment in engine.js and the nuclear_saturation_density note.",
     "verified": "Rendered H 2, m 1.08e17 (1.5e17 kg/m3, 0.56 rho0) with comic ground: the text no longer claims 3 x 10^32 Pa or 'at least 16 MeV' for this density."
    },
    {
     "id": "p6",
     "status": "fixed",
     "change": "src/engine.js planetRegime: 'reshapes' no longer has tff, and eLow = m*(0 - premPhi(0)), the energy of sinking to the centre. app.html bayWeight: the 'Earth falls onto him' tile is shown only for earthFalls; reshapes gets a 'Share of Earth's mass' tile ('he sinks to the centre'). The reshapes bullet now says sinking alone releases X and the planet squeezing in adds more. The surface-based dBeat, loose-things and crush-radius sentences and the dBeat chip now appear only in regime 'none'.",
     "verified": "m=1e22: the tiles show 'Share of Earth's mass 0.17% / he sinks to the centre' and 'Energy released, at least 4.9 x 10^29 J'. There is no 14.9 min tile and no surface-granite crush sentence."
    },
    {
     "id": "u8",
     "status": "fixed",
     "change": "In app.html: (1) the reshapes tile, as in p6. (2) earthCutaway() takes a caption, and bayWeight builds it from the outcome. A stuck run reads 'ends up east/west of straight down', using the sign of driftKm; a fall-through reads 'drifts west/east of the exact opposite point'. f.stuck now takes precedence for the end label too, because a heavily damped full run can have both firstPass and stuck. (3) The bedrock clause is printed only when rCrush > his radius and the regime is 'none'. (4) In the 'stands' regime the verdict reads 'The ground holds him, but he's too heavy...' or 'The ground holds him. He can stand, but he's too heavy to walk.'",
     "verified": "Old white-dwarf preset (1.76e9 kg): the caption says 'ends up east of straight down', matching the bullet's '19.2 km east'. Real white-dwarf chip: 'west', matching '159 km west', with end label 'stops here'. m=1e12: 'bedrock stays put.' with no 0.11 mm radius. m=1e25: no 1.1e6 km clause. m=5001.46 with logKg 1: 'The ground holds him, but he's too heavy for his own legs...'."
    },
    {
     "id": "d5",
     "status": "fixed",
     "change": "Followed the skeptic's fix: the rules stay as they are and the basis is stated plainly. In app.html bayWeight, the walk-OK bullet now says the sim sets 1.2 W on one leg against both legs' 1.4x push (a rough rule), that running is the Sprint tab's rough rule, and that real 2-2.9 W running peaks come from springy, near-straight legs the dial doesn't model. The stand and walk-fail bullets say 'both legs', and the math line states each basis. The static-data.js 'Density and weight' card and the moveCheck comment in engine.js are updated to match. I did not adopt the per-leg running rule: it breaks the Bolt calibration.",
     "verified": "Rendered steel (walks), stand-but-no-walk and can't-stand states. The text is consistent, and calibration still passes, including Bolt's top speed."
    },
    {
     "id": "r9",
     "status": "fixed",
     "change": "src/engine.js groundUnderWeight: fallsThrough, strongRockHolds, weakRockFails and rockRatio now use the net weight (m - premRho(crust) V) premG(R_E). This is the same buoyancy-corrected test fallThrough uses to decide he is held. New calibration check: for a 500 m Rex, just below the threshold he is not fallsThrough, and at 1.0005x the threshold he sinks thousands of km, never a 1 s / 4.9 m stop.",
     "verified": "Probe at 2 m and 500 m, from 1.00001x to 1.01x the threshold: every case is fallsThrough with a deep stop, and 0.9995x is 'sinks'. Rendered 500 m granite states on both sides of the rex-build threshold (3.2751e12 kg): 'feet punch into the granite' and 'sinks 24.8 km ... upper mantle' (a real buoyancy stop at the denser mantle). The 4.89 m / 1 s artifact and 'sinks at up to 0 m/s' are gone. The calibration check passes."
    },
    {
     "id": "r3",
     "status": "fixed",
     "change": "src/engine.js pull() now calls moveCheck. Dragging a load means walking, so net force is 0 unless move.walk. It returns cantWalk, cantStand and walkNeedKg, with limitedBy 'legs'. app.html bayPull: new verdict 'Rex can't drag it: he is too heavy to get up off the floor / to walk. Walking needs a dial setting of X', a 'Too heavy to get up/walk' chip, and an explanatory bullet. New calibration check: steel Rex at 2 m (1,413 kg) with a 501 kg dial can't drag a car, and the default Rex at 511 kg still can.",
     "verified": "Page {action:pull,H:2,m:1413,logKg:2.7}: 'Rex can't drag it: he is too heavy to get up off the floor. Walking needs a dial setting of 1.21 t.' White-dwarf state: the same. The default pull is unchanged. The calibration check and the existing relativistic-pull check pass."
    },
    {
     "id": "u14",
     "status": "fixed",
     "change": "app.html earthCutaway: the 'inner core' label now sits beside the circle with a short leader line, because the inner core is at most 69 px across at the 420 px cap. The end and inner-core labels get a var(--surface) halo stroke (paint-order stroke). logBars: when no row has a finite non-zero value, it renders a one-line text summary (e.g. 'Rex's strength no limit · ... none') instead of an axis that draws infinity at 10 N.",
     "verified": "2x screenshots at 390 px in light and dark, and at 1280: the label is readable and clear of the path, and 'stops here' is readable on the inner core. Wrestle push with inf and both bolted shows the text summary instead of the 1 N-10 N axis. shots.js reports overflow 0 and no console errors at 1280 and 390."
    }
   ],
   "testsPass": true,
   "notes": "The full pipeline ends 'all checks passed': python3 build-data.py && node build.js && node test/shots.js && node test/calibration.js. Files changed: src/engine.js, src/app.html, src/static-data.js, test/calibration.js, research/final-density.json; src/data.js and dist/ were regenerated. Nothing committed or pushed.\n\nNot touched: BUILDS / DEFAULT_BODIES, the art and avatars, and the state.oSame = true line.\n\nThings the next agents should know:\n1. Some audit repro states are stale because the build volume changed since the audit. At the default height the Neutron star chip is now 1.049e18 kg, not 2.62e17, and the White dwarf chip is 7.06e9 kg. I verified against both the old states and the real chip values.\n2. The earth_surface_heat_flow research note quoted the old settling time ('23 TW over ~5,000 years'). The p0 fix changed that, so I refreshed it to about 50 TW over about 2,200 years. Notes are not exported to the page.\n3. Left alone, outside my batch:\n   - The Bondi 'air falls onto him' bullet still shows in the reshapes and earthFalls regimes, where he is at or near the centre.\n   - The 'White-dwarf matter is held up by electrons' sentence still shows for 1e14-1e17 kg/m3, which is neutron-drip territory.\n   - The 'outer core' label touches the outer-core boundary at phone width.\n\nScratch tools: /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/cutshot.js screenshots the cut-away. weightshot.js now honours MAXT for longer text dumps."
  }
 },
 {
  "batch": "catch",
  "report": {
   "items": [
    {
     "id": "p1",
     "status": "fixed",
     "change": "engine.js fireballAt: momentum is now computed from energy (pc = sqrt(E²+2Emc²)), which stays exact when v rounds to c. The lump's rest mass now counts its swept air and its heat (E/c²). New fields: Ehere (E minus the motion left after the hit: p²/2M_E if bolted, KE(p, M+m_lump) if free), Eafter, Ecarry, sweepOn, Lnear, Enear (free pair's snowplow heat within sqrt(2 R_E H_s) ≈ 320 km), and Eblast ('before': E; otherwise Ehere+Enear). app.html: pushText now states the energy freed where Ollie stands; the 'arrives' verdict calls Egap heat that 'rides along with it'; catchEnvItems replaces 'air between them takes Egap' with the release accounting; blastBlock is fed Eblast instead of Egap; Show the math gains the release formula. research/final-duo.json relativistic_arrival_classes display and notes updated.",
     "verified": "New calibration checks for the car at 10^22 kg and the pyramid at 10^30 kg, both bolted: blast energy never drops as D falls across before/plasma/arrives, and Ehere > 0.999E. Free-Ollie check: Ehere ≥ Egap and Ehere+Ecarry = E. A sweep of 960 legs found no Ehere<Egap and no NaN. Page renders: car at 10^22 bolted frees 7.4e22 J at every distance (was 7.45e20); pyramid at 10^30 frees 8e30 J (was 3.6e25)."
    },
    {
     "id": "p3",
     "status": "fixed",
     "change": "engine.js catchIt: wholeFront = max(first-hit F1, arm force, hold)/area/strength, so no plate helps once it exceeds 1. leg(): new launch check launchPush = m vL²/(2·stroke), launchRatio over the cross-section, and a new first gate result 'crushed-launch'. app.html adds the verdict, chip, tile, bullet, env item and math line for it, and includes it in lostEarly and CATCH_ARRIVED.",
     "verified": "Checks: shot put at 10^7 kg bolted fastball is 'wreckage' (first hit 4.7 GPa vs 750 MPa); car at 10^8 kg fastball is 'crushed-launch' (7.4× its grip limit). The existing pyramid-across-the-planet check now expects 'crushed-launch': its push is 173,000× its strength, before the air acts, which is correct physics. Rendered on the page."
    },
    {
     "id": "d4",
     "status": "partly",
     "change": "Labelled, with no new strength added. build-data.py adds crushWhole=True on the shot, bar511 and ruyi (solid metal, so the crush value is a whole-object strength), and their grip-limit source rows get a note saying whether the catch uses the value as a whole-object strength or errs toward survival. app.html strengthText(): solid objects read 'the ~X it can take'; all others read 'its ~X grip limit (a rough local value; the whole car gives way sooner)'. This is used in the breaks-up, crushed-launch and wreckage text, the tiles and the math line, and the math line says the checks err toward survival. 'Whole front (2.95 m × 2.95 m)' became 'average cross-section (8.7 m²)'. The catch_breakup_ram_pressure fact display and notes are corrected, and the static-data.js catch card is updated.",
     "verified": "Check: crushWhole only on bar511, ruyi and shot. Rendered car, shot and pyramid states. Left open: hollow objects still use the lenient grip limit as their gate, now labelled. A real whole-structure strength per object would need new sourced research."
    },
    {
     "id": "p5",
     "status": "fixed",
     "change": "engine.js catchIt: tStroke = vE/aRel, the time the stated force actually takes (the 2d/v cap is removed). app.html: when the catches are more than a quarter of the round trip, a bullet explains each catch takes X at the least force and that pulling harder would be quicker; the math line adds t = v_eff/a. Consequence: the default lob's round trip is now 33 s (was 4.5 s), because each least-force catch takes 14.5 s.",
     "verified": "Check: F·tStroke = sqrt(2 F d (m+m_h)) to 1e-6. Default page rendered."
    },
    {
     "id": "p12",
     "status": "fixed",
     "change": "engine.js leg: new armHold field (the arm's weight). app.html legVerdict 'cant-hold' now says 'at this density he can't even hold his own arm up (X)' when the arm is more than half the load. The throwOnce comment is corrected; the scalar sum is kept as a slight overestimate for a load held at the shoulder (the verdict called the vector part optional).",
     "verified": "Check: 1e12 kg partners give cant-hold with armHold > 99% of the load. Page: the oM 7.416e16 state reads 'Ollie can't throw the baseball: at this density he can't even hold his own arm up (2.18 PN)'."
    },
    {
     "id": "r0",
     "status": "fixed",
     "change": "engine.js releaseTable: 16 exact angles (80, 84, 86, 88, 89 added), capped at 89° so nothing interpolates toward the singular 90° value; cached per ctx and object; adds vTop and an exact at(th). aimHard: at or above 1% of c it returns a fireball only if the straight line at the exact aim angle thAim (curvature included) meets him; otherwise it returns overshoots with relativistic set. leg reports the aimed angle's own speed and exact energy. app.html: overshoots text for the relativistic case ('turns into a fireball heading up, not toward him').",
     "verified": "Check: table within 20% of exact throws up to 89° (worst 1.125×, was ~123×). Check: no fastball fireball below 1% of c for Eiffel 10^19 and 10^20 and pyramid 10^18 and 10^20.5 at 100 km. Results: Eiffel 10^19 and pyramid 10^18 are too-weak, as the auditor found; Eiffel 10^20 is overshoots-relativistic."
    },
    {
     "id": "r10",
     "status": "partly",
     "change": "Catch side fixed by the 89° table cap (shared root with r0). Solo Throw: app.html bayThrow's sink bullet now says (for angles ≥45° on failing ground) that the sim lets the ground take the downward part of his push, only the sideways part is footing-limited, and a near-vertical throw is an upper bound. anchorCapacity is unchanged; changing it would alter every throw on yielding ground.",
     "verified": "Rendered pyramid at 10^19 kg at 89° and 90°: both show the note. The cliff itself remains in the model and is now explained on the page."
    },
    {
     "id": "r4",
     "status": "fixed",
     "change": "engine.js aimEasy: an angle whose least reaching speed overshoots (escape or orbit) scores Infinity, so only landing arcs are minimised; noArc is returned only when every reaching angle overshoots, and leg returns 'no-arc' from that. vNeededAt now returns the flight at that speed, so no extra flight is needed.",
     "verified": "Check: tank lobbed 10,000 km at 10^16 kg (comic ground) is no longer no-arc; it aims at 67° and is crushed at launch. The auditor expected breaks-up, and the launch check is earlier."
    },
    {
     "id": "r5",
     "status": "partly",
     "change": "pushApartHill sizes its step to the Hill crawl speed when the stroke would be ≥20× the usual estimate. Catch: release table cached; distance-independent farthest() cached (farthestCached); bisection tolerance 2e-4→5e-4; golden-section stop 0.1°→0.25°; the redundant final flight per angle removed.",
     "verified": "Shove 'both' at 1e21 kg/10^34: 2.2 s → 40 ms. A 120-state shove sweep is identical to the baseline at 4 significant figures, and a 540-state throw/jump/punch sweep at 6. Catch Eiffel lob at 100 km: first render 1.6 → 1.3 s, strength change 0.17 s, distance change 1.2 → 0.9 s. Still slow: b777 with unequal bodies at about 2.5 s, because it computes two separate aims."
    },
    {
     "id": "r6",
     "status": "fixed",
     "change": "engine.js tossPartner returns 'cant-move' when vMax is not above 0, before any flight. app.html catchPartner gets new wording and skips the irrelevant notes.",
     "verified": "Check (plush 5.4 kg bodies, 10 kg dial). Rendered: 'Rex can hold Ollie up, but that takes all the push his arms have, so he can't toss him.'"
    },
    {
     "id": "r7",
     "status": "fixed",
     "change": "engine.js tossPartner takes a 6th argument anchorP and returns 'bolted' when it is bolted. app.html passes cO.anchor and uses the Wrestle > Lift wording.",
     "verified": "Check passes. Rendered: 'Ollie is bolted to the planet: lifting him means lifting the planet. Can't be done.'"
    },
    {
     "id": "u4",
     "status": "fixed",
     "change": "engine.js leg: new 'cant-move' result when every table speed is 0; 'falls-back' (with escapeNeeded from the easy aim) when his own pull eats all his speed; needFactor only when vMax > 0; airWall flag. app.html: no 0 mm range ('barely leaves his hand'), cant-move verdict and chip, the 'More speed hardly helps' bullet only when air is the limit, and the heat chip and item only for flights that happen (showHeat).",
     "verified": "Check: 1e13 kg partners give falls-back. Rendered both auditor states: 'needs 42.2 m/s … his best throw is 20.3 m/s. It drops back into his hand.' and 'can hold the baseball up … can't throw it'. Neither shows the heat chip or the speed bullet."
    },
    {
     "id": "u9",
     "status": "fixed",
     "change": "(a) app.html chip reads 'His arms then stop it: X%' when the first hit dominates, as the verdict advised. (b) Same fix as p12. (c) The slip bullet says 'the more it presses him down…' only when F·sin(angle) > 0.1(M+m)g; otherwise 'He and the car share the stopping, so his arms push X'.",
     "verified": "Rendered the bowling-ball fastball (chip), the dense cant-hold state, and a car lob onto a 181 kg Ollie that arrives at 49° and slips."
    },
    {
     "id": "u12",
     "status": "fixed",
     "change": "engine.js recoilOf: full strength uses the Throw tab's own throwObject recoilV at the aim angle; a lob solves the steady push that gives vL with the same push model; the coast distance uses coastDist, now shared with catchIt. outOfRange when the slide exceeds the gap or the recoil passes 1% of c, and roundTrip drops those trips. Fireball results carry the recoil too. app.html: recoil bullet (speed, slide, out of range, dig-in hint).",
     "verified": "Check: car fastball recoil equals the Throw tab's to 1e-6 (417 m/s; the audit's 602 and 1,270 m/s were on older bodies), and its 1.71 km slide drops the round trip. Rendered: shuttle at 10^10 (7,530 m/s, 4.59 km), piano lob on ice (2.72 m/s), relativistic recoil."
    },
    {
     "id": "d9",
     "status": "fixed",
     "change": "engine.js RAD_H comment corrected: the tables run 30–84 km and radiation above 30 km is left out. app.html heatItem range text: '(plus the most that glowing air below 30 km can radiate; higher up, radiation is left out)'; the math line says the same. research/final-duo.json shock_layer_radiation_onset: display now says the tables run 30–84 km, and the notes add the Table 2 value (36 km: 147 MW/m², about 31× Sutton–Graves).",
     "verified": "Rebuilt data.js and checked the source-table row text; rendered heat lines."
    },
    {
     "id": "d11",
     "status": "fixed",
     "change": "New fact heat_to_vaporise_per_kg in research/final-duo.json (estimate). Sources: iron 483 kJ/mol and forsterite 1,186 kJ/mol from 298 K to boiling (Fegley & Schaefer 2012, JANAF, text checked in the arXiv PDF), plus Wikipedia infobox values for aluminium and copper (fetched) and water. engine.js: per-material eVap (steel 8.6, Al 13.1, Cu 5.9, organic 2.6, stone 8.4 MJ/kg) replaces E_VAP=1e7. The page says 'roughly enough to boil it away N× over'. build-data.py shows all four sources on that row.",
     "verified": "Source row rendered with 4 sources; the relativistic catch text shows 'roughly … 71 billion× over'."
    }
   ],
   "testsPass": true,
   "notes": "The full required chain passes: build-data.py, build.js, shots.js (no overflow, no errors), and calibration.js ends 'all checks passed'. Calibration now has 18 new regression checks. Nothing was committed or pushed.\n\nBehaviour changes later agents will see:\n- **New launch check (p3):** almost every fast heavy throw is now 'crushed-launch' rather than 'breaks-up'. Pushing an object to speed v over a 2.4 m stroke loads it about 25× more than the air does at that speed, so 'breaks-up' is now nearly unreachable. The old pyramid-across-the-planet check was updated to expect 'crushed-launch'.\n- **Slower default round trip (p5):** the default lob's round trip went from about 4.5 s to 33 s. Each least-force catch of the light ball now takes its true 14.5 s; a bullet on the page explains it.\n- **Wider page sweeps:** 960 engine legs showed no invariant violations, and 106 rendered catch states showed no 'Calculation failed', NaN or undefined. Phone width in dark mode has no overflow.\n\nAPI and data changes:\n- `P.tossPartner` takes an optional 6th argument for Ollie's anchor.\n- `P.catchReleaseTable` is newly exported.\n- New leg fields: `recoil`, `launchPush`, `launchRatio`, `launchStroke`, `armHold`, `airWall`, and fireball fields `Ehere`, `Eafter`, `Ecarry`, `Enear`, `Eblast`, `sweepOn`, `Lnear`.\n- New results: 'cant-move' and 'crushed-launch' (legs), and 'bolted' and 'cant-move' (toss).\n- `MATERIALS` gains `eVap`; `CATCH.E_VAP` is removed.\n\nFiles changed: /home/user/dino-strength-sim/src/engine.js, src/app.html, src/static-data.js (catch card), build-data.py, research/final-duo.json, test/calibration.js; src/data.js regenerated. BUILDS, DEFAULT_BODIES, the art and the oSame line are untouched. The pre-change snapshot is at /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/catch-base for diffing."
  }
 },
 {
  "batch": "collide-wrestle",
  "report": {
   "items": [
    {
     "id": "u0",
     "status": "fixed",
     "change": "One rule for an unlimited push between two holds that never let go, used on every tab. engine.js: new helper unlimitedClash(cA,cB) next to groundTear. Comic ground gives 'paradox': nothing moves and the force has no upper limit. Real rock gives 'rockGives': the rock around the bolts tears out (tearA/tearB), and the unlimited push then shoves both apart at just under light speed, each with a plug of rock. It is called from armWrestle (replaces outcome 'undefined'; on comic ground the unbreakable table carries the push, clash 'paradox' via 'table'), pushMatch (replaces undefinedPush/NaN), shoveOnce (replaces undefinedPush) and standoff. Why this is the physical choice: Newton's third law loads both anchors equally, and the rock is the only finite link, so both tear. After that, an unlimited force over the arm stroke acting on finite masses gives unbounded energy. The old 'Rex is carried off' wording was one-sided. app.html: new clashVerdict(kind,a,b,via) gives one shared wording, used by bayArm, wrestlePush, wrestleShove and collidePush. Hold chips now read 'X's rock tears loose' when the rock gives. The force tile reads 'no upper limit' (plus the tear-out force), never 'undefined'. Arm says 'Nobody pins anybody', and its 'feet still let go' clause only shows for an unlimited competitor who is not bolted. The Collide push four-case grid was reworded. Arm on comic ground with plain footing used to claim 'bolted down'; it now says the table carries the push, which is why it differs from Collide > Push for the same footing.",
     "verified": "New calibration checks: Arm, Shoving match, Shove and Collide > Push (both directions) give the same outcome, rockGives on real rock and paradox on comic ground; comic arms go through the table; the shove flings both off at c on rock and nobody moves on comic ground. These fail on the pre-fix engine. Rendered all four tabs for {inf, anchor bolted, oAnchor bolted} with groundHolds false and true: the wording is identical and the chips agree. Render sweep of 756 duo states found no 'undefined', 'NaN' or 'No answer'."
    },
    {
     "id": "r2",
     "status": "fixed",
     "change": "engine.js standoff: contact is now Infinity, not NaN. When cB.immovable and the push is unlimited, the outcome is 'pusherTorn' on real rock (the pusher's rock tears out and he is shoved back at just under c with a plug of rock) or 'pusherPlanet' on comic ground (pusher and planet driven back). The result is 'paradox' only when the immovable holder is bolted to the same unbreakable ground. Conflict: the skeptic suggested 'nothing moves if the pusher is on comic ground'. I chose the pusher plus planet being driven back, because an immovable body that is not bolted is outside the finite-mass pusher-plus-planet system, so the push is external to that system and it must move. app.html collidePush: verdicts for both new outcomes, chips ('X's rock tears loose' / 'X and the planet are driven back', 'Y holds: truly immovable'), a footing bullet, and a force tile reading 'no upper limit'. The forceWins verdict now says 'just under light speed'.",
     "verified": "Calibration checks: no NaN contact over a 216-state standoff grid; the immovable-unbolted, comic and immovable-bolted cases. Rendered the evidence state: 'Rex is truly immovable, so the unlimited push drives Ollie back instead... Rex doesn't move.'"
    },
    {
     "id": "p4",
     "status": "fixed",
     "change": "engine.js collide: rockGives = unlimited pA, holder bolted, real rock, not immovable. In that case held is false, so no out.earth or rock-load is made, and unlimitedVsBolted is computed from the same flag. The Earth figures for planetMoves and closedSystem are no longer printed as 3 x 10^8 m/s (see u2).",
     "verified": "Calibration check: the light-speed charge into bolted Rex on real rock is not held, has no Earth share and gives rockGives; on comic ground it gives planetMoves and held. It fails on the pre-fix engine. Rendered {colSrc:set,colInf:true,anchor:bolted}: no Earth tile, no '∞' crack."
    },
    {
     "id": "u2",
     "status": "fixed",
     "change": "app.html collideCharge: chip 'Rock gives way around his bolts' for rockGives; holder tile 'torn loose with a plug of rock'. The Earth tile now reads 'just under light speed' for planetMoves and 'ends up still' for closedSystem, and is absent for rockGives; it never shows a massive body at 3 x 10^8 m/s. The Earth-momentum bullet only shows for finite momentum. The bolted why-text now reads '...the rock around his bolts tears out, so the Earth keeps almost none of the momentum'. rockChip/rockBullet guard an infinite rT ('Rock gives way around his bolts'). Four-case grid cell: 'just under light speed (the planet too, but only if he's bolted to unbreakable ground)'.",
     "verified": "Rendered the evidence state and the comic-ground variant: the verdict, chips, tiles and bullets agree."
    },
    {
     "id": "d3",
     "status": "fixed",
     "change": "app.html collideCharge math line now reads 'Quake: 1 part in 10,000 of Q (the usual share, give or take ⅔ of a magnitude), as if all of Q reached the ground, which overstates it.' engine.js quakeHeld comment clarified: the energy input is the upper bound and the seismic share is the middle value. static-data card unchanged and now consistent.",
     "verified": "Rendered Collide > Show the math."
    },
    {
     "id": "d10",
     "status": "fixed",
     "change": "research/final-duo.json: new fact collide_rock_wave_speed_estimate (status estimate, 5 km/s, range 3.71-6.1 km/s). Sources: Padmanabha et al. 2021 Table 1, bar speed 3.71 ± 0.16 km/s; Birch 1960 JGR 65(4), granite P-wave speeds 3.7-6.1 km/s at 10 bar, read from the Wikipedia transcription of Birch's table. It becomes a source row through build-data.py. engine.js COL.C_ROCK comment updated (value unchanged). app.html boltsLate bullet uses P.COL.C_ROCK instead of the hard-coded 5000 and says '(at about 5 km/s, an estimate)'.",
     "verified": "build-data.py regenerates data.js with the new row; the build passes."
    },
    {
     "id": "u5",
     "status": "fixed",
     "change": "app.html collideCharge small-knockback verdict: braced Ollie gets 'dug-in boots', braced Rex keeps 'claws'.",
     "verified": "Rendered colGB -7.05 (the original -6.875 no longer gives under 1 m with the 10 ft bodies): 'Ollie's dug-in boots take most of it' and 'Rex's claws...'. A grep shows no other claw text tied to Ollie. The 756-state sweep found no 'Ollie's claws'."
    },
    {
     "id": "u7",
     "status": "fixed",
     "change": "(1) collidePush hold chips: a stalemate with both at their footing limit shows 'Both at their footing limit'. Other footing-limited non-losing cases show 'X at his footing limit: N'. 'feet slip first' now shows only when the object holds. (2) bayArm chip renamed 'Usable push: Rex … · Ollie …'. (3) Catch math prints fmtDist(k.give[0])–fmtDist(k.give[1]) '(1–2.5% of his height, an estimate)' instead of '2–5 cm'.",
     "verified": "Rendered default Push ('Both at their footing limit'), Arm ('Usable push: Rex 15.9 kN · Ollie 15.9 kN') and Catch math ('3 cm–7.6 cm squash')."
    },
    {
     "id": "r1",
     "status": "fixed",
     "change": "app.html wrestleShove rewritten to branch on which body moves (vA/vB). A target who doesn't move is described as bolted (or his footing holds), and the shove throws the shover back, with his slide (slideA) or the light-speed wording. The fireball sentence and the 'indestructible' bullet name whoever passes 1% of c. The target-slides tile becomes 'X moves: not at all'. A 'pusher slides' tile was added. The engine was already correct.",
     "verified": "Rendered logKg 16 with Ollie bolted: 'Ollie is bolted to the planet and doesn't move, so the shove throws Rex back instead. Rex leaves at 2.52% of light speed. The air in Rex's path turns into a fireball.' The default dial with Ollie bolted gives 'Rex flies back at 22.1 m/s and slides 40 m'. Engine check added (vB = 0, vA > 1% c). The sweep found no '0 m/s' mover text."
    },
    {
     "id": "u11",
     "status": "fixed",
     "change": "(1) catchControls: in partner mode with Fastball, the height slider and presets are disabled and labelled 'Toss height: as high as he can (Fastball)', and the miss checkbox is hidden in partner mode. Added CSS for disabled chips and sliders. (2) wrestleShove 'Both at once' says 'They shove each other apart', with a speed and slide for each and a slide tile for each. (3) wrestleLift prints the ground-load bullet only when the lift succeeds. (4) wrestleThrow prints Impact and Landing only when f.landed. (5) The shove slide bullet only names non-relativistic movers and only shows when a slide tile exists.",
     "verified": "Rendered partner Fastball and Lob, Both at once, the failed lift (oM 1e9), the unlimited throw and the unlimited shove; the text matches the controls and outcome. Phone-width dark screenshot checked."
    },
    {
     "id": "p11",
     "status": "fixed",
     "change": "app.html wrestleThrow: with Comic ground on (state.groundHolds), the landing reads 'Landing: comic ground takes it (… TNT), and nothing breaks.', with no 'the ground isn't' or crater. On real ground (including when the sinking gate forces the ground to hold), the original impact and landing text stays.",
     "verified": "Rendered the evidence state with groundHolds true and the same state on real ground."
    }
   ],
   "testsPass": true,
   "notes": "Full sequence passes: python3 build-data.py, node build.js, node test/shots.js (0 overflow, no errors at both widths) and node test/calibration.js, which ends 'all checks passed'. Ten new regression checks are at the end of /home/user/dino-strength-sim/test/calibration.js, covering u0, r2, p4 and r1. Nine of them fail on the pre-fix engine. The r1 check passes on both, because r1 was a page-text bug. A 756-state render sweep over the Arm, Wrestle and Collide tabs found no undefined/NaN text, page errors, claws on Ollie, '∞' crack radius, 3 x 10^8 m/s Earth, or zero-speed movers.\n\nFiles changed: src/engine.js, src/app.html, test/calibration.js and research/final-duo.json; src/data.js was regenerated. I left BUILDS/DEFAULT_BODIES, the art, static-data.js and the state.oSame line alone. Nothing was committed. Baseline copies are in the scratchpad at cw-base/.\n\nLeft alone, outside this batch:\n- Exact-c speeds still read 'light speed (to the last digit)' (the existing fmtSpeed convention) in Shove and Throw.\n- Wrestle > Lift of a bolted partner with unlimited strength on real rock still says 'Can't be done' rather than applying the rock-gives rule.\n- The finite-force both-bolted Shoving match still says 'Neither moves' even when the ground tears around the bolts."
  }
 },
 {
  "batch": "arm-duo-misc",
  "report": {
   "items": [
    {
     "id": "p2",
     "status": "fixed",
     "change": "src/engine.js armWrestle. Once the table is broken, the loser's arm folds (a 'pin') only if the winner presses harder than that arm (Aw > P_loser). The pin is now resisted by the loser's full arm force, not his footing. If the winner can't press harder than the loser's arm, the new outcome 'drag' moves the loser's whole body: net = winner's push minus loser's footing, mass = loser's body plus the winner's forearm effective mass, over the winner's quarter-turn sweep. No slam, crater or table ratio is reported for a drag. While the table holds, a pin's peak elbow-pad load is now computed from torques about each elbow: P_l + (P_w - P_l)(effMass*m_l + holdArm*m_w)/(effMass*(mA+mB)). If that tops tableLat, the table breaks (tableBreaksBy 'pin') and the standing-up rules apply. New outputs: padLoad, padBy, tableBreaksBy, loserSlides. src/app.html bayArm: new verdicts for pin, drag and table-torn-by-pin. A standing pin says the hand 'swings down', never 'hits the pad / goes through the table'. Drag gets its own tiles (loser's speed, energy) and bullet; there is a pad-load bullet and a math line for drag and pad load.",
     "verified": "Added 7 checks to test/calibration.js. Bolted vs standing with equal arms gives a drag (speed matches sqrt(2*net*s/M)). The finding repro (1e12 vs 1e11 kg) gives Ollie dragging Rex by the footing difference. 1,000 t bolted vs 100 t gives a pin resisted by the full arm. 100 t vs 511 kg tears the pad (18x the table). 4 t vs 3.6 t pins on the table, with pad-load coefficient 1.1212. These checks fail on the pre-fix engine. I rendered the default, bolted, braced and both-braced states, plus what-if states from a scratch copy of the page that leaves oSame unforced."
    },
    {
     "id": "p9",
     "status": "fixed",
     "change": "src/engine.js armWrestle now sets each arm's twist from what its own arm carries. Winner = his push x his lever. A pinned loser = his own arm force x his lever. A dragged loser whose arm holds = the whole push. src/app.html: the tile shows 'Twist on the upper arms' as Rex / Ollie when the two differ, and keeps 'each' only when they are equal. The math line is reworded to match.",
     "verified": "Calibration check: pinned Ollie's twist = PB x LB and Rex's = AA x LA, and a dragged arm carries the whole push. Render of the 511 kg what-if Ollie shows '9.2 kN·m / 725 N·m' (the verdict expected about 725 N·m)."
    },
    {
     "id": "p10",
     "status": "fixed",
     "change": "src/static-data.js 'Rex and Ollie' card: 25% share (an estimate; plausibly 10-40%). It now says the regulation table carries the push until its pegs and pads tear out (about 5 kN at regulation size, an estimate), after which only their feet hold. 'Goes through each body to his feet' is kept for shoving and wrestling only. Added the standing-up fold-or-drag rule.",
     "verified": "Dumped the rendered card text from dist/preview.html."
    },
    {
     "id": "d0",
     "status": "fixed",
     "change": "Same card rewrite as p10. The 'Rex's body' card no longer hard-codes '2 m and 180 kg by default': it uses {DEFAULT_BODY} and {DEFAULT_FOOT}, which src/app.html fills from P.DEFAULT_BODIES and makeBody at render. The text can't go stale while those provisional values change, and DEFAULT_BODIES itself is untouched. The calibration card now says 'the 2 m, 180 kg calibration body'. build-data.py renames the density chip 'Water (default)' to 'Water' with note 'Close to a human body's density; the 2 m, 180 kg calibration body uses it.'",
     "verified": "Rendered cards read 'By default 3.05 m and 2.7 t...' and 'Foot contact is 0.31 m² each on his default body...'. The chip title was checked in the page."
    },
    {
     "id": "d1",
     "status": "fixed",
     "change": "src/app.html bayArm math line now reads '(estimate, plausibly 10–40%: ordinary men’s measured arm force against an assumed 1–2× body-weight deadlift)'. 'Same-person data' no longer appears anywhere in src.",
     "verified": "grep finds the phrase only in the research note that says no such data exist. Rendered the math block."
    },
    {
     "id": "d13",
     "status": "fixed",
     "change": "src/app.html bayArm: the 'feet hold' clause now names the actual limit. A foot-limited winner: 'can press only X, all his feet hold (his arm has Y)'. A bolted winner: 'his feet don't cap his push'. Otherwise: 'his feet hold X, more than his arm, so he presses with his full Y'. The table-broken stalemate says 'that's all their feet hold' only when both are foot-limited; otherwise it says 'their arms are locked'.",
     "verified": "The braced-Rex state now reads 'Rex’s feet hold 713 kN, more than his arm, so he presses with his full 222 kN... Rex drags Ollie’s whole body sideways', and both-braced reads 'dead heat at 222 kN: their arms are locked'."
    },
    {
     "id": "u1",
     "status": "fixed",
     "change": "src/app.html bayArm: the bolted or infinite winner gets 'X is bolted, so his feet don’t cap his push: his arm presses with unlimited force'. The engine now reports this case as a drag at light speed, not a 3 ns pin. The 'doesn’t help' sentence appears only for an infinitely strong side whose footing is finite, and it names him with his number: 'Rex’s unlimited strength doesn’t help here: his feet still let go at 15.9 kN.'",
     "verified": "Calibration check 'arm u1'. Rendered {inf:true, oAnchor:'bolted'} and the what-if {oInf:true, anchor:'bolted'}. The both-bolted unlimited case still takes the clash path with no feet sentence."
    },
    {
     "id": "r8",
     "status": "fixed",
     "change": "Already fixed before this batch: the comic-ground unlimited verdict no longer says 'bolted down', and an existing calibration check covers it. I only made the wording follow the gate: when the duo gate forces comic ground, it says 'treating the ground as if it held them'.",
     "verified": "Rendered the evidence state {inf, groundHolds, H 2, m 180, oH 2, oM 180}: 'Both arms are unlimited, and on comic ground, the table never breaks...', with no 'bolted' claim."
    },
    {
     "id": "u10",
     "status": "fixed",
     "change": "src/app.html duoGate: the callout now states each sinker's fate from the groundUnderWeight regime: 'would sink into / sink out of sight into / punch through the X / fall through the Earth'. For Ollie it adds 'The Weight tab shows only Rex: give him the same size and mass there to see it.' bayArm: when pulledTogether, the page shows only the verdict, a gravity chip, three tiles (time to meet, closing speed, energy released) and the fall math. The pin, push and table tiles and the comic-ground chip are skipped. A gate-forced comic ground is labelled 'Treating the ground as if it held them' in the chip, the tile, the bullet, the math line and the clash verdict.",
     "verified": "Rendered {oM:2.6e17}: 'Just standing there, Ollie would fall through the Earth...', then the fall tiles only. {oM:3e8} shows the forced-ground labels."
    },
    {
     "id": "d7",
     "status": "fixed",
     "change": "src/engine.js liftPartner returns dC and gPeakOnPath. In src/app.html wrestleLift, the tile caption is 'peak during the lift, from side by side (centres dC apart)' when the path term wins, else 'overhead, centres dOver apart'. Added a Show the math line with the 0.385 G m² / d² path-peak rule. research/final-duo.json duo_gravity_distances: the display and notes now carry the rule and its derivation (max of y/(x²+y²)^1.5 = 2/(3√3)/x² at y = x/√2).",
     "verified": "Default lift: 'overhead, centres 2.29 m apart'. At the current 2.7 t default the overhead term wins: 9.3e-5 N against 6.6e-5 N. A 2 m calibration Rex with a 181 kg Ollie shows 'peak during the lift, from side by side (centres 91 cm apart)'. The JSON parses and build-data.py runs."
    },
    {
     "id": "r11",
     "status": "fixed",
     "change": "src/app.html: added RHO_MIN = 10 kg/m³ (the slider's left end). The #mass and #o-mass handlers and the stored-state validator now clamp the mass to at least RHO_MIN x volume. src/engine.js tossPartner returns 'not-modelled' for a timed-out flight instead of 'orbit'. The page explains it: catchPartner says 'still in the air ... isn’t modelled to the end', and wrestleThrow gets a matching f.timedOut branch.",
     "verified": "Rendered the four evidence states. oM 1e-300 becomes 7.2 kg / 25.5 kg at 10 kg/m³ and gives an ordinary toss and throw, with no 19 s freeze. oH 500 with oM 1e-6 becomes 112,000 t ('can’t even hold him up'). 0.1 m with 1e-9 kg becomes 0.9 g ('air stops him first'). I couldn't reproduce a timed-out toss after the clamp, so the 'not-modelled' text is unexercised."
    },
    {
     "id": "u13",
     "status": "partly",
     "change": "src/app.html formatting. fmtRatio gives '8.3% of' below 1× (with grammar fixes at the two callers that need it). fmtRatioRange gives 'a–b%' below 1× ('as hard as' reads right). The 'Heat it takes in' tile uses a % value with an 'of' caption. compareEnergy uses '≈' only within 15%. fmtSpeed gives km/s at 10 km/s and up. fmtMach returns nothing above Mach 50, and all callers are guarded. fmtTime gives ps below 1 ns and scientific seconds below 1 ps. 'Gravity at his skin' uses scientific notation at 1e6 g and up. The weak-strength Weight tile reads 'his weight is N× his strength'. The fall-through stop range says 'anywhere from the centre out to X' when the lower bound is 0. showHeat hides the nose-air chip and bullet when the heating is under 5 °C.",
     "verified": "Rendered m=1e25, m=1e22, the white-dwarf mass, the logKg 12 fastball and the default lob. Results: 'his weight is 110 quintillion× his strength', 'Escape speed 1,260 km/s', 'fires the baseball at 744 km/s' (no Mach), and no 'Nose air 15 °C' chip. Partly: '6,300,000,000% of the energy' and 'Rock cracks ∞' were already fixed by earlier batches, so I left them. I did not render a state that hits Castle Bravo; that change rests on the compareEnergy code edit alone."
    }
   ],
   "testsPass": true,
   "notes": "The final run passed in full: python3 build-data.py, node build.js, node test/shots.js (no overflow or errors at 1280 light and 390 dark) and node test/calibration.js (106 ok, 'all checks passed'). I did not commit or push.\n\n**Conflict choice (p2):** The table-holds sub-claim asked only for the pad load to be compared with the table. I went further: if the dynamic elbow-pad load during a pin tops tableLat, the table breaks and the standing-up rules apply. That is physically correct, because the load peaks at the start of the pin and the table can't un-break. I also took the elbow reaction from torques about each elbow (P_loser + 1.12 × surplus for equal bodies). The finding's rough 'forearm mass × a_cm' leaves out the hand force. With oSame forced on the page, the arms are equal, so default outcomes change only where footing differs: bolted or dug-in Rex now drags Ollie instead of pinning him. Unequal arms appear only with a what-if strength.\n\n**Things left alone:**\n- BUILDS / DEFAULT_BODIES are unchanged (I diffed them).\n- The `state.oSame = true` line is intact.\n- The art is untouched.\n- The catch fact row '7.9 kg at 180 kg' is accurate as worded, so I left it.\n\n**Files changed:**\n- /home/user/dino-strength-sim/src/engine.js (armWrestle, liftPartner, tossPartner)\n- /home/user/dino-strength-sim/src/app.html (bayArm, duoGate, wrestleLift, wrestleThrow, catchPartner, formatting helpers, mass clamp, assumption-card fill)\n- /home/user/dino-strength-sim/src/static-data.js\n- /home/user/dino-strength-sim/build-data.py (Water chip)\n- /home/user/dino-strength-sim/research/final-duo.json (duo_gravity_distances)\n- /home/user/dino-strength-sim/test/calibration.js (new arm block)\n\n**Backups and test copies:** Pre-batch sources are in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/src-before-armduo and research-before-armduo. What-if states were rendered from a scratch copy of the page that leaves oSame unforced, made by scratchpad/a3/mkwhatif.sh and rendered with scratchpad/a3/whatifshot.js."
  }
 }
]
```

</details>

<details>
<summary>Subagent `reverify:2` (rex-audit-fixes, 2026-10-10 04:34:54 UTC): Rebuilt once (build-data.py, build.js). Ran shots.js and calibration.js without edits: shots shows 0 overflow and no errors at 1280 light and 390 dark, and calibration ends 'all checks passed' with 0 FAIL. Returned items: 29 (e.g. d0; d1).</summary>

Workflow run `wf_068bea6f-0e1`, phase `Re-verify`, agent `ac3d0facc1ca341bc`. Prompt, verbatim:

```text
You are fixing confirmed audit findings in the "Rex Super-Strength Lab" physics simulator at /home/user/dino-strength-sim.
Findings file: /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit-final.json. It is a JSON array of 4 lenses (physics, regression, data, ux). Each has a "confirmed" array. IDs are the lens initial plus the index in that array: p0 = physics.confirmed[0], r3 = regression.confirmed[3], d4 = data.confirmed[4], u10 = ux.confirmed[10]. Each finding has title, claim, evidence (exact repro), fix, and a skeptic's verdict with a refined fix. Line numbers may have drifted; search by content.
Files: src/engine.js (physics), src/app.html (page text and UI), src/static-data.js (assumption cards), research/final-*.json (sourced facts; build-data.py turns them into src/data.js), test/calibration.js (tests).
Build and test after every few fixes: cd /home/user/dino-strength-sim && python3 build-data.py && node build.js && node test/shots.js && node test/calibration.js   (calibration must end "all checks passed"; it takes about 75 s).
Render any page state and dump its text to check your fix: node /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/weightshot.js '[["name",1280,{STATE}]]'  (state keys: see DEFAULTS in src/app.html; screenshots land in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/<name>.png; add "dark" as a 4th element for dark mode; use 390 for phone width).
Rules:
- Fix the root cause, minimally and consistently; do not widen scope. If two findings conflict, choose the physically correct option and say why.
- For each critical or major physics fix, add a regression check to test/calibration.js.
- Page text: plain, short sentences; every number sourced or labelled an estimate; never invent canon about Ollie (bull-man with horns, nose ring, earrings, vest, cargo pants, boots: no claws). Rex and Ollie are equally strong and equally indestructible.
- Do NOT change: the BUILDS / DEFAULT_BODIES values in src/engine.js (marked provisional; set separately), the art figures and avatars, or the line that forces state.oSame = true on load.
- Do not commit or push. Other agents fix other batches after you, on the same files: leave the tree building and passing.
Return a list of every finding ID in your batch with what you changed (file and function) and how you verified it, or why you left it.

You are now a SKEPTICAL RE-VERIFIER, not a fixer: do not edit project files (scratch scripts under /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/reverify/ only). Rebuild once, then for each of these finding IDs re-run its original reproduction on the current build and decide whether it is really fixed, and whether the fix introduced a new problem nearby: d0 d1 d2 d3 d4 d5 d6 d7 d8 d9 d10 d11 d12 d13 u0 u1 u2 u3 u4 u5 u6 u7 u8 u9 u10 u11 u12 u13 u14.

Fixers' reports:
[
 {
  "batch": "density-weight",
  "report": {
   "items": [
    {
     "id": "p0",
     "status": "fixed",
     "change": "src/engine.js settle() passFor: the gravitational-drag term now uses m*dfCoef*v (a force) instead of m*dfCoef*v^2. test/calibration.js has two new checks: settle().firstPassLossJ / (m g x the 3-D shortfall) is 1 +- 0.15 for the 2 m neutron-star Rex, and the settling time differs between 7.4e16 kg and 1e18 kg.",
     "verified": "node: 7.416e16 kg at 2 m gives a loss of 4.18e18 J per trip (ratio to the 3-D shortfall 1.09) and 2,198 yr; 1e18 kg gives 512 yr. Page {H:2,m:7.416e16}: '~2,200 years / 490 years to 29,000 years', '1 Gt TNT per trip ... magnitude 6.5 quake'. Both new calibration checks pass."
    },
    {
     "id": "d6",
     "status": "fixed",
     "change": "research/final-density.json has two new facts. gravitational_drag_ostriker cites Ostriker 1999, ApJ 513:252, arXiv astro-ph/9810324; its eqs. 12, 14 and 15 were read from the arXiv PDF, and the ln-Lambda = 5 choice is labelled an estimate. rock_sound_speed_prem gives the PREM S and P wave speeds, read from ObsPy prem.nd: 3.2-7.3 and 5.8-13.7 km/s. build-data.py turns both into source rows. src/engine.js: dfCoef takes an optional cs, fallThrough and settle pass opt.cs, and there is a new W8.CS_LOW = 3200. In weight(), the fast end of the settle, shortfall and stop ranges now uses strong rock, k = 2 and cs = 3.2 km/s. app.html bayWeight math line and the static-data.js 'Sinking' card now give the c_s basis and say how the ranges use it.",
     "verified": "Sensitivity scan: with cs 3.5, 6, 9 and 13.7 km/s the 7.4e16 kg settle times are 748, 2,198, 3,551 and 4,419 yr. All now fall inside the shown range of 490 to 29,000 yr. data.js now has the Ostriker and prem.nd rows."
    },
    {
     "id": "p7",
     "status": "fixed",
     "change": "src/engine.js has a new restRadius(body, sigma) helper, and settle() uses it. In weight(), the weak- and strong-rock stuckRange runs integrate with full:true and tMax 4 days until he sticks; if a run never sticks, it falls back to the static rest radius. A run is never mapped to r = 0. stuckRange.swings is now recorded. The calibration check now expects the computed weak-rock stop (10.4 +- 3 km) instead of 'rMin < 50 km'.",
     "verified": "At 2 m, the white-dwarf weak-rock run passes the centre and sticks at 10.4 km (the old run reported 'not stuck'). The page reads 'anywhere from 10.4 km to 646 km from the centre ... weak rock lets him swing through the centre before he stops'. The 3.05 m preset reads '1.08 km to 87.5 km'."
    },
    {
     "id": "d12",
     "status": "fixed",
     "change": "Same engine fix as p7. The verdict sentence in app.html bayWeight adds 'weak rock lets him swing through the centre before he stops' when a run swung first. The deep_rock_strength_assumption note in research/final-density.json is refreshed to the current values: threshold 3.1e6-1.25e8 kg with buoyancy, white-dwarf stop about 10 to 646 km, and the parameters at each end of the range.",
     "verified": "Rendered the white-dwarf states at 2 m and 3.05 m: the page no longer shows '0 mm'. The calibration check passes."
    },
    {
     "id": "u3",
     "status": "fixed",
     "change": "app.html bayWeight verdict now prints the shortfall range itself: 'coasts to a stop X to Y under the far side's surface (it depends on how strong deep rock is)'. 'a few metres/kilometres (about ...)' is gone. A shared shortText says 'up to Y' when the low end is under 1 m, because the 3-D turnaround has a +0.45 m bias in a no-drag run; otherwise the page would print '0 mm to 50 m'. The same text is used in the per-trip bullet.",
     "verified": "m=1e12: '512 km to 951 km under the far side's surface'. m=1e15: '556 m to 1.11 km'. 2 m neutron star: '2.78 m to 9.75 m'. 1e18 kg: 'up to 50.4 m'."
    },
    {
     "id": "d8",
     "status": "fixed",
     "change": "app.html happens() takes an optional cap, and bayWeight calls happens(items, 6). The Weight tab can produce at most 6 bullets, so the osmium and neutron-matter caveat is no longer cut.",
     "verified": "The neutron-star preset at the default height (1.05e18 kg) and the 2 m neutron-star state now show all 6 bullets, including the matter caveat. The other tabs still cap at 5."
    },
    {
     "id": "u6",
     "status": "fixed",
     "change": "Same fix as d8: happens(items, 6) in bayWeight. I raised the cap rather than reordering, because cutting the Bondi bullet instead would orphan the 'Air falls onto him' chip.",
     "verified": "Rendered the Neutron star chip state and m=1e15: the caveat bullet appears in both."
    },
    {
     "id": "p8",
     "status": "fixed",
     "change": "src/engine.js: new W8.RHO_NUC = 2.7e17 and W8.RHO_NS_CORE = 2.7e18 (10 n0, from the Lattimer & Prakash fact). nmCaveat now carries rhoNuc and beyondNS. app.html has a new nmText(). Above 2.7e18 kg/m3 it says he is denser than any known matter, even neutron-star cores, that holding it would take far more than the 2.2-3.4 x 10^32 Pa of nuclear matter, and keeps 16 MeV per neutron as 'at least'. When the energy exceeds Earth's binding energy it is shown as a ratio instead of a 6,300,000% figure.",
     "verified": "m=1e22 and 1e25 render the 'denser than any known matter' text with '2.2-3.4 x 10^32 Pa' and 'at least ...'."
    },
    {
     "id": "d2",
     "status": "fixed",
     "change": "For 1e17 to 2.7e18 kg/m3, app.html nmText() now gives the pressure and energy at nuclear density only: 'At nuclear density (2.7 x 10^17 kg/m3) that takes ... 2.2-3.4 x 10^32 Pa, and more when denser', and '16 +- 2 MeV per neutron ..., and the nuclei that form and decay add more'. The figure for this Rex is labelled 'roughly ... (an estimate)'. I reworded the text below rho0 rather than gating at rho0, so the 1e17-2.7e17 band doesn't fall back to the electron-degenerate white-dwarf sentence. Also updated the E_NM comment in engine.js and the nuclear_saturation_density note.",
     "verified": "Rendered H 2, m 1.08e17 (1.5e17 kg/m3, 0.56 rho0) with comic ground: the text no longer claims 3 x 10^32 Pa or 'at least 16 MeV' for this density."
    },
    {
     "id": "p6",
     "status": "fixed",
     "change": "src/engine.js planetRegime: 'reshapes' no longer has tff, and eLow = m*(0 - premPhi(0)), the energy of sinking to the centre. app.html bayWeight: the 'Earth falls onto him' tile is shown only for earthFalls; reshapes gets a 'Share of Earth's mass' tile ('he sinks to the centre'). The reshapes bullet now says sinking alone releases X and the planet squeezing in adds more. The surface-based dBeat, loose-things and crush-radius sentences and the dBeat chip now appear only in regime 'none'.",
     "verified": "m=1e22: the tiles show 'Share of Earth's mass 0.17% / he sinks to the centre' and 'Energy released, at least 4.9 x 10^29 J'. There is no 14.9 min tile and no surface-granite crush sentence."
    },
    {
     "id": "u8",
     "status": "fixed",
     "change": "In app.html: (1) the reshapes tile, as in p6. (2) earthCutaway() takes a caption, and bayWeight builds it from the outcome. A stuck run reads 'ends up east/west of straight down', using the sign of driftKm; a fall-through reads 'drifts west/east of the exact opposite point'. f.stuck now takes precedence for the end label too, because a heavily damped full run can have both firstPass and stuck. (3) The bedrock clause is printed only when rCrush > his radius and the regime is 'none'. (4) In the 'stands' regime the verdict reads 'The ground holds him, but he's too heavy...' or 'The ground holds him. He can stand, but he's too heavy to walk.'",
     "verified": "Old white-dwarf preset (1.76e9 kg): the caption says 'ends up east of straight down', matching the bullet's '19.2 km east'. Real white-dwarf chip: 'west', matching '159 km west', with end label 'stops here'. m=1e12: 'bedrock stays put.' with no 0.11 mm radius. m=1e25: no 1.1e6 km clause. m=5001.46 with logKg 1: 'The ground holds him, but he's too heavy for his own legs...'."
    },
    {
     "id": "d5",
     "status": "fixed",
     "change": "Followed the skeptic's fix: the rules stay as they are and the basis is stated plainly. In app.html bayWeight, the walk-OK bullet now says the sim sets 1.2 W on one leg against both legs' 1.4x push (a rough rule), that running is the Sprint tab's rough rule, and that real 2-2.9 W running peaks come from springy, near-straight legs the dial doesn't model. The stand and walk-fail bullets say 'both legs', and the math line states each basis. The static-data.js 'Density and weight' card and the moveCheck comment in engine.js are updated to match. I did not adopt the per-leg running rule: it breaks the Bolt calibration.",
     "verified": "Rendered steel (walks), stand-but-no-walk and can't-stand states. The text is consistent, and calibration still passes, including Bolt's top speed."
    },
    {
     "id": "r9",
     "status": "fixed",
     "change": "src/engine.js groundUnderWeight: fallsThrough, strongRockHolds, weakRockFails and rockRatio now use the net weight (m - premRho(crust) V) premG(R_E). This is the same buoyancy-corrected test fallThrough uses to decide he is held. New calibration check: for a 500 m Rex, just below the threshold he is not fallsThrough, and at 1.0005x the threshold he sinks thousands of km, never a 1 s / 4.9 m stop.",
     "verified": "Probe at 2 m and 500 m, from 1.00001x to 1.01x the threshold: every case is fallsThrough with a deep stop, and 0.9995x is 'sinks'. Rendered 500 m granite states on both sides of the rex-build threshold (3.2751e12 kg): 'feet punch into the granite' and 'sinks 24.8 km ... upper mantle' (a real buoyancy stop at the denser mantle). The 4.89 m / 1 s artifact and 'sinks at up to 0 m/s' are gone. The calibration check passes."
    },
    {
     "id": "r3",
     "status": "fixed",
     "change": "src/engine.js pull() now calls moveCheck. Dragging a load means walking, so net force is 0 unless move.walk. It returns cantWalk, cantStand and walkNeedKg, with limitedBy 'legs'. app.html bayPull: new verdict 'Rex can't drag it: he is too heavy to get up off the floor / to walk. Walking needs a dial setting of X', a 'Too heavy to get up/walk' chip, and an explanatory bullet. New calibration check: steel Rex at 2 m (1,413 kg) with a 501 kg dial can't drag a car, and the default Rex at 511 kg still can.",
     "verified": "Page {action:pull,H:2,m:1413,logKg:2.7}: 'Rex can't drag it: he is too heavy to get up off the floor. Walking needs a dial setting of 1.21 t.' White-dwarf state: the same. The default pull is unchanged. The calibration check and the existing relativistic-pull check pass."
    },
    {
     "id": "u14",
     "status": "fixed",
     "change": "app.html earthCutaway: the 'inner core' label now sits beside the circle with a short leader line, because the inner core is at most 69 px across at the 420 px cap. The end and inner-core labels get a var(--surface) halo stroke (paint-order stroke). logBars: when no row has a finite non-zero value, it renders a one-line text summary (e.g. 'Rex's strength no limit · ... none') instead of an axis that draws infinity at 10 N.",
     "verified": "2x screenshots at 390 px in light and dark, and at 1280: the label is readable and clear of the path, and 'stops here' is readable on the inner core. Wrestle push with inf and both bolted shows the text summary instead of the 1 N-10 N axis. shots.js reports overflow 0 and no console errors at 1280 and 390."
    }
   ],
   "testsPass": true,
   "notes": "The full pipeline ends 'all checks passed': python3 build-data.py && node build.js && node test/shots.js && node test/calibration.js. Files changed: src/engine.js, src/app.html, src/static-data.js, test/calibration.js, research/final-density.json; src/data.js and dist/ were regenerated. Nothing committed or pushed.\n\nNot touched: BUILDS / DEFAULT_BODIES, the art and avatars, and the state.oSame = true line.\n\nThings the next agents should know:\n1. Some audit repro states are stale because the build volume changed since the audit. At the default height the Neutron star chip is now 1.049e18 kg, not 2.62e17, and the White dwarf chip is 7.06e9 kg. I verified against both the old states and the real chip values.\n2. The earth_surface_heat_flow research note quoted the old settling time ('23 TW over ~5,000 years'). The p0 fix changed that, so I refreshed it to about 50 TW over about 2,200 years. Notes are not exported to the page.\n3. Left alone, outside my batch:\n   - The Bondi 'air falls onto him' bullet still shows in the reshapes and earthFalls regimes, where he is at or near the centre.\n   - The 'White-dwarf matter is held up by electrons' sentence still shows for 1e14-1e17 kg/m3, which is neutron-drip territory.\n   - The 'outer core' label touches the outer-core boundary at phone width.\n\nScratch tools: /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/cutshot.js screenshots the cut-away. weightshot.js now honours MAXT for longer text dumps."
  }
 },
 {
  "batch": "catch",
  "report": {
   "items": [
    {
     "id": "p1",
     "status": "fixed",
     "change": "engine.js fireballAt: momentum is now computed from energy (pc = sqrt(E²+2Emc²)), which stays exact when v rounds to c. The lump's rest mass now counts its swept air and its heat (E/c²). New fields: Ehere (E minus the motion left after the hit: p²/2M_E if bolted, KE(p, M+m_lump) if free), Eafter, Ecarry, sweepOn, Lnear, Enear (free pair's snowplow heat within sqrt(2 R_E H_s) ≈ 320 km), and Eblast ('before': E; otherwise Ehere+Enear). app.html: pushText now states the energy freed where Ollie stands; the 'arrives' verdict calls Egap heat that 'rides along with it'; catchEnvItems replaces 'air between them takes Egap' with the release accounting; blastBlock is fed Eblast instead of Egap; Show the math gains the release formula. research/final-duo.json relativistic_arrival_classes display and notes updated.",
     "verified": "New calibration checks for the car at 10^22 kg and the pyramid at 10^30 kg, both bolted: blast energy never drops as D falls across before/plasma/arrives, and Ehere > 0.999E. Free-Ollie check: Ehere ≥ Egap and Ehere+Ecarry = E. A sweep of 960 legs found no Ehere<Egap and no NaN. Page renders: car at 10^22 bolted frees 7.4e22 J at every distance (was 7.45e20); pyramid at 10^30 frees 8e30 J (was 3.6e25)."
    },
    {
     "id": "p3",
     "status": "fixed",
     "change": "engine.js catchIt: wholeFront = max(first-hit F1, arm force, hold)/area/strength, so no plate helps once it exceeds 1. leg(): new launch check launchPush = m vL²/(2·stroke), launchRatio over the cross-section, and a new first gate result 'crushed-launch'. app.html adds the verdict, chip, tile, bullet, env item and math line for it, and includes it in lostEarly and CATCH_ARRIVED.",
     "verified": "Checks: shot put at 10^7 kg bolted fastball is 'wreckage' (first hit 4.7 GPa vs 750 MPa); car at 10^8 kg fastball is 'crushed-launch' (7.4× its grip limit). The existing pyramid-across-the-planet check now expects 'crushed-launch': its push is 173,000× its strength, before the air acts, which is correct physics. Rendered on the page."
    },
    {
     "id": "d4",
     "status": "partly",
     "change": "Labelled, with no new strength added. build-data.py adds crushWhole=True on the shot, bar511 and ruyi (solid metal, so the crush value is a whole-object strength), and their grip-limit source rows get a note saying whether the catch uses the value as a whole-object strength or errs toward survival. app.html strengthText(): solid objects read 'the ~X it can take'; all others read 'its ~X grip limit (a rough local value; the whole car gives way sooner)'. This is used in the breaks-up, crushed-launch and wreckage text, the tiles and the math line, and the math line says the checks err toward survival. 'Whole front (2.95 m × 2.95 m)' became 'average cross-section (8.7 m²)'. The catch_breakup_ram_pressure fact display and notes are corrected, and the static-data.js catch card is updated.",
     "verified": "Check: crushWhole only on bar511, ruyi and shot. Rendered car, shot and pyramid states. Left open: hollow objects still use the lenient grip limit as their gate, now labelled. A real whole-structure strength per object would need new sourced research."
    },
    {
     "id": "p5",
     "status": "fixed",
     "change": "engine.js catchIt: tStroke = vE/aRel, the time the stated force actually takes (the 2d/v cap is removed). app.html: when the catches are more than a quarter of the round trip, a bullet explains each catch takes X at the least force and that pulling harder would be quicker; the math line adds t = v_eff/a. Consequence: the default lob's round trip is now 33 s (was 4.5 s), because each least-force catch takes 14.5 s.",
     "verified": "Check: F·tStroke = sqrt(2 F d (m+m_h)) to 1e-6. Default page rendered."
    },
    {
     "id": "p12",
     "status": "fixed",
     "change": "engine.js leg: new armHold field (the arm's weight). app.html legVerdict 'cant-hold' now says 'at this density he can't even hold his own arm up (X)' when the arm is more than half the load. The throwOnce comment is corrected; the scalar sum is kept as a slight overestimate for a load held at the shoulder (the verdict called the vector part optional).",
     "verified": "Check: 1e12 kg partners give cant-hold with armHold > 99% of the load. Page: the oM 7.416e16 state reads 'Ollie can't throw the baseball: at this density he can't even hold his own arm up (2.18 PN)'."
    },
    {
     "id": "r0",
     "status": "fixed",
     "change": "engine.js releaseTable: 16 exact angles (80, 84, 86, 88, 89 added), capped at 89° so nothing interpolates toward the singular 90° value; cached per ctx and object; adds vTop and an exact at(th). aimHard: at or above 1% of c it returns a fireball only if the straight line at the exact aim angle thAim (curvature included) meets him; otherwise it returns overshoots with relativistic set. leg reports the aimed angle's own speed and exact energy. app.html: overshoots text for the relativistic case ('turns into a fireball heading up, not toward him').",
     "verified": "Check: table within 20% of exact throws up to 89° (worst 1.125×, was ~123×). Check: no fastball fireball below 1% of c for Eiffel 10^19 and 10^20 and pyramid 10^18 and 10^20.5 at 100 km. Results: Eiffel 10^19 and pyramid 10^18 are too-weak, as the auditor found; Eiffel 10^20 is overshoots-relativistic."
    },
    {
     "id": "r10",
     "status": "partly",
     "change": "Catch side fixed by the 89° table cap (shared root with r0). Solo Throw: app.html bayThrow's sink bullet now says (for angles ≥45° on failing ground) that the sim lets the ground take the downward part of his push, only the sideways part is footing-limited, and a near-vertical throw is an upper bound. anchorCapacity is unchanged; changing it would alter every throw on yielding ground.",
     "verified": "Rendered pyramid at 10^19 kg at 89° and 90°: both show the note. The cliff itself remains in the model and is now explained on the page."
    },
    {
     "id": "r4",
     "status": "fixed",
     "change": "engine.js aimEasy: an angle whose least reaching speed overshoots (escape or orbit) scores Infinity, so only landing arcs are minimised; noArc is returned only when every reaching angle overshoots, and leg returns 'no-arc' from that. vNeededAt now returns the flight at that speed, so no extra flight is needed.",
     "verified": "Check: tank lobbed 10,000 km at 10^16 kg (comic ground) is no longer no-arc; it aims at 67° and is crushed at launch. The auditor expected breaks-up, and the launch check is earlier."
    },
    {
     "id": "r5",
     "status": "partly",
     "change": "pushApartHill sizes its step to the Hill crawl speed when the stroke would be ≥20× the usual estimate. Catch: release table cached; distance-independent farthest() cached (farthestCached); bisection tolerance 2e-4→5e-4; golden-section stop 0.1°→0.25°; the redundant final flight per angle removed.",
     "verified": "Shove 'both' at 1e21 kg/10^34: 2.2 s → 40 ms. A 120-state shove sweep is identical to the baseline at 4 significant figures, and a 540-state throw/jump/punch sweep at 6. Catch Eiffel lob at 100 km: first render 1.6 → 1.3 s, strength change 0.17 s, distance change 1.2 → 0.9 s. Still slow: b777 with unequal bodies at about 2.5 s, because it computes two separate aims."
    },
    {
     "id": "r6",
     "status": "fixed",
     "change": "engine.js tossPartner returns 'cant-move' when vMax is not above 0, before any flight. app.html catchPartner gets new wording and skips the irrelevant notes.",
     "verified": "Check (plush 5.4 kg bodies, 10 kg dial). Rendered: 'Rex can hold Ollie up, but that takes all the push his arms have, so he can't toss him.'"
    },
    {
     "id": "r7",
     "status": "fixed",
     "change": "engine.js tossPartner takes a 6th argument anchorP and returns 'bolted' when it is bolted. app.html passes cO.anchor and uses the Wrestle > Lift wording.",
     "verified": "Check passes. Rendered: 'Ollie is bolted to the planet: lifting him means lifting the planet. Can't be done.'"
    },
    {
     "id": "u4",
     "status": "fixed",
     "change": "engine.js leg: new 'cant-move' result when every table speed is 0; 'falls-back' (with escapeNeeded from the easy aim) when his own pull eats all his speed; needFactor only when vMax > 0; airWall flag. app.html: no 0 mm range ('barely leaves his hand'), cant-move verdict and chip, the 'More speed hardly helps' bullet only when air is the limit, and the heat chip and item only for flights that happen (showHeat).",
     "verified": "Check: 1e13 kg partners give falls-back. Rendered both auditor states: 'needs 42.2 m/s … his best throw is 20.3 m/s. It drops back into his hand.' and 'can hold the baseball up … can't throw it'. Neither shows the heat chip or the speed bullet."
    },
    {
     "id": "u9",
     "status": "fixed",
     "change": "(a) app.html chip reads 'His arms then stop it: X%' when the first hit dominates, as the verdict advised. (b) Same fix as p12. (c) The slip bullet says 'the more it presses him down…' only when F·sin(angle) > 0.1(M+m)g; otherwise 'He and the car share the stopping, so his arms push X'.",
     "verified": "Rendered the bowling-ball fastball (chip), the dense cant-hold state, and a car lob onto a 181 kg Ollie that arrives at 49° and slips."
    },
    {
     "id": "u12",
     "status": "fixed",
     "change": "engine.js recoilOf: full strength uses the Throw tab's own throwObject recoilV at the aim angle; a lob solves the steady push that gives vL with the same push model; the coast distance uses coastDist, now shared with catchIt. outOfRange when the slide exceeds the gap or the recoil passes 1% of c, and roundTrip drops those trips. Fireball results carry the recoil too. app.html: recoil bullet (speed, slide, out of range, dig-in hint).",
     "verified": "Check: car fastball recoil equals the Throw tab's to 1e-6 (417 m/s; the audit's 602 and 1,270 m/s were on older bodies), and its 1.71 km slide drops the round trip. Rendered: shuttle at 10^10 (7,530 m/s, 4.59 km), piano lob on ice (2.72 m/s), relativistic recoil."
    },
    {
     "id": "d9",
     "status": "fixed",
     "change": "engine.js RAD_H comment corrected: the tables run 30–84 km and radiation above 30 km is left out. app.html heatItem range text: '(plus the most that glowing air below 30 km can radiate; higher up, radiation is left out)'; the math line says the same. research/final-duo.json shock_layer_radiation_onset: display now says the tables run 30–84 km, and the notes add the Table 2 value (36 km: 147 MW/m², about 31× Sutton–Graves).",
     "verified": "Rebuilt data.js and checked the source-table row text; rendered heat lines."
    },
    {
     "id": "d11",
     "status": "fixed",
     "change": "New fact heat_to_vaporise_per_kg in research/final-duo.json (estimate). Sources: iron 483 kJ/mol and forsterite 1,186 kJ/mol from 298 K to boiling (Fegley & Schaefer 2012, JANAF, text checked in the arXiv PDF), plus Wikipedia infobox values for aluminium and copper (fetched) and water. engine.js: per-material eVap (steel 8.6, Al 13.1, Cu 5.9, organic 2.6, stone 8.4 MJ/kg) replaces E_VAP=1e7. The page says 'roughly enough to boil it away N× over'. build-data.py shows all four sources on that row.",
     "verified": "Source row rendered with 4 sources; the relativistic catch text shows 'roughly … 71 billion× over'."
    }
   ],
   "testsPass": true,
   "notes": "The full required chain passes: build-data.py, build.js, shots.js (no overflow, no errors), and calibration.js ends 'all checks passed'. Calibration now has 18 new regression checks. Nothing was committed or pushed.\n\nBehaviour changes later agents will see:\n- **New launch check (p3):** almost every fast heavy throw is now 'crushed-launch' rather than 'breaks-up'. Pushing an object to speed v over a 2.4 m stroke loads it about 25× more than the air does at that speed, so 'breaks-up' is now nearly unreachable. The old pyramid-across-the-planet check was updated to expect 'crushed-launch'.\n- **Slower default round trip (p5):** the default lob's round trip went from about 4.5 s to 33 s. Each least-force catch of the light ball now takes its true 14.5 s; a bullet on the page explains it.\n- **Wider page sweeps:** 960 engine legs showed no invariant violations, and 106 rendered catch states showed no 'Calculation failed', NaN or undefined. Phone width in dark mode has no overflow.\n\nAPI and data changes:\n- `P.tossPartner` takes an optional 6th argument for Ollie's anchor.\n- `P.catchReleaseTable` is newly exported.\n- New leg fields: `recoil`, `launchPush`, `launchRatio`, `launchStroke`, `armHold`, `airWall`, and fireball fields `Ehere`, `Eafter`, `Ecarry`, `Enear`, `Eblast`, `sweepOn`, `Lnear`.\n- New results: 'cant-move' and 'crushed-launch' (legs), and 'bolted' and 'cant-move' (toss).\n- `MATERIALS` gains `eVap`; `CATCH.E_VAP` is removed.\n\nFiles changed: /home/user/dino-strength-sim/src/engine.js, src/app.html, src/static-data.js (catch card), build-data.py, research/final-duo.json, test/calibration.js; src/data.js regenerated. BUILDS, DEFAULT_BODIES, the art and the oSame line are untouched. The pre-change snapshot is at /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/catch-base for diffing."
  }
 },
 {
  "batch": "collide-wrestle",
  "report": {
   "items": [
    {
     "id": "u0",
     "status": "fixed",
     "change": "One rule for an unlimited push between two holds that never let go, used on every tab. engine.js: new helper unlimitedClash(cA,cB) next to groundTear. Comic ground gives 'paradox': nothing moves and the force has no upper limit. Real rock gives 'rockGives': the rock around the bolts tears out (tearA/tearB), and the unlimited push then shoves both apart at just under light speed, each with a plug of rock. It is called from armWrestle (replaces outcome 'undefined'; on comic ground the unbreakable table carries the push, clash 'paradox' via 'table'), pushMatch (replaces undefinedPush/NaN), shoveOnce (replaces undefinedPush) and standoff. Why this is the physical choice: Newton's third law loads both anchors equally, and the rock is the only finite link, so both tear. After that, an unlimited force over the arm stroke acting on finite masses gives unbounded energy. The old 'Rex is carried off' wording was one-sided. app.html: new clashVerdict(kind,a,b,via) gives one shared wording, used by bayArm, wrestlePush, wrestleShove and collidePush. Hold chips now read 'X's rock tears loose' when the rock gives. The force tile reads 'no upper limit' (plus the tear-out force), never 'undefined'. Arm says 'Nobody pins anybody', and its 'feet still let go' clause only shows for an unlimited competitor who is not bolted. The Collide push four-case grid was reworded. Arm on comic ground with plain footing used to claim 'bolted down'; it now says the table carries the push, which is why it differs from Collide > Push for the same footing.",
     "verified": "New calibration checks: Arm, Shoving match, Shove and Collide > Push (both directions) give the same outcome, rockGives on real rock and paradox on comic ground; comic arms go through the table; the shove flings both off at c on rock and nobody moves on comic ground. These fail on the pre-fix engine. Rendered all four tabs for {inf, anchor bolted, oAnchor bolted} with groundHolds false and true: the wording is identical and the chips agree. Render sweep of 756 duo states found no 'undefined', 'NaN' or 'No answer'."
    },
    {
     "id": "r2",
     "status": "fixed",
     "change": "engine.js standoff: contact is now Infinity, not NaN. When cB.immovable and the push is unlimited, the outcome is 'pusherTorn' on real rock (the pusher's rock tears out and he is shoved back at just under c with a plug of rock) or 'pusherPlanet' on comic ground (pusher and planet driven back). The result is 'paradox' only when the immovable holder is bolted to the same unbreakable ground. Conflict: the skeptic suggested 'nothing moves if the pusher is on comic ground'. I chose the pusher plus planet being driven back, because an immovable body that is not bolted is outside the finite-mass pusher-plus-planet system, so the push is external to that system and it must move. app.html collidePush: verdicts for both new outcomes, chips ('X's rock tears loose' / 'X and the planet are driven back', 'Y holds: truly immovable'), a footing bullet, and a force tile reading 'no upper limit'. The forceWins verdict now says 'just under light speed'.",
     "verified": "Calibration checks: no NaN contact over a 216-state standoff grid; the immovable-unbolted, comic and immovable-bolted cases. Rendered the evidence state: 'Rex is truly immovable, so the unlimited push drives Ollie back instead... Rex doesn't move.'"
    },
    {
     "id": "p4",
     "status": "fixed",
     "change": "engine.js collide: rockGives = unlimited pA, holder bolted, real rock, not immovable. In that case held is false, so no out.earth or rock-load is made, and unlimitedVsBolted is computed from the same flag. The Earth figures for planetMoves and closedSystem are no longer printed as 3 x 10^8 m/s (see u2).",
     "verified": "Calibration check: the light-speed charge into bolted Rex on real rock is not held, has no Earth share and gives rockGives; on comic ground it gives planetMoves and held. It fails on the pre-fix engine. Rendered {colSrc:set,colInf:true,anchor:bolted}: no Earth tile, no '∞' crack."
    },
    {
     "id": "u2",
     "status": "fixed",
     "change": "app.html collideCharge: chip 'Rock gives way around his bolts' for rockGives; holder tile 'torn loose with a plug of rock'. The Earth tile now reads 'just under light speed' for planetMoves and 'ends up still' for closedSystem, and is absent for rockGives; it never shows a massive body at 3 x 10^8 m/s. The Earth-momentum bullet only shows for finite momentum. The bolted why-text now reads '...the rock around his bolts tears out, so the Earth keeps almost none of the momentum'. rockChip/rockBullet guard an infinite rT ('Rock gives way around his bolts'). Four-case grid cell: 'just under light speed (the planet too, but only if he's bolted to unbreakable ground)'.",
     "verified": "Rendered the evidence state and the comic-ground variant: the verdict, chips, tiles and bullets agree."
    },
    {
     "id": "d3",
     "status": "fixed",
     "change": "app.html collideCharge math line now reads 'Quake: 1 part in 10,000 of Q (the usual share, give or take ⅔ of a magnitude), as if all of Q reached the ground, which overstates it.' engine.js quakeHeld comment clarified: the energy input is the upper bound and the seismic share is the middle value. static-data card unchanged and now consistent.",
     "verified": "Rendered Collide > Show the math."
    },
    {
     "id": "d10",
     "status": "fixed",
     "change": "research/final-duo.json: new fact collide_rock_wave_speed_estimate (status estimate, 5 km/s, range 3.71-6.1 km/s). Sources: Padmanabha et al. 2021 Table 1, bar speed 3.71 ± 0.16 km/s; Birch 1960 JGR 65(4), granite P-wave speeds 3.7-6.1 km/s at 10 bar, read from the Wikipedia transcription of Birch's table. It becomes a source row through build-data.py. engine.js COL.C_ROCK comment updated (value unchanged). app.html boltsLate bullet uses P.COL.C_ROCK instead of the hard-coded 5000 and says '(at about 5 km/s, an estimate)'.",
     "verified": "build-data.py regenerates data.js with the new row; the build passes."
    },
    {
     "id": "u5",
     "status": "fixed",
     "change": "app.html collideCharge small-knockback verdict: braced Ollie gets 'dug-in boots', braced Rex keeps 'claws'.",
     "verified": "Rendered colGB -7.05 (the original -6.875 no longer gives under 1 m with the 10 ft bodies): 'Ollie's dug-in boots take most of it' and 'Rex's claws...'. A grep shows no other claw text tied to Ollie. The 756-state sweep found no 'Ollie's claws'."
    },
    {
     "id": "u7",
     "status": "fixed",
     "change": "(1) collidePush hold chips: a stalemate with both at their footing limit shows 'Both at their footing limit'. Other footing-limited non-losing cases show 'X at his footing limit: N'. 'feet slip first' now shows only when the object holds. (2) bayArm chip renamed 'Usable push: Rex … · Ollie …'. (3) Catch math prints fmtDist(k.give[0])–fmtDist(k.give[1]) '(1–2.5% of his height, an estimate)' instead of '2–5 cm'.",
     "verified": "Rendered default Push ('Both at their footing limit'), Arm ('Usable push: Rex 15.9 kN · Ollie 15.9 kN') and Catch math ('3 cm–7.6 cm squash')."
    },
    {
     "id": "r1",
     "status": "fixed",
     "change": "app.html wrestleShove rewritten to branch on which body moves (vA/vB). A target who doesn't move is described as bolted (or his footing holds), and the shove throws the shover back, with his slide (slideA) or the light-speed wording. The fireball sentence and the 'indestructible' bullet name whoever passes 1% of c. The target-slides tile becomes 'X moves: not at all'. A 'pusher slides' tile was added. The engine was already correct.",
     "verified": "Rendered logKg 16 with Ollie bolted: 'Ollie is bolted to the planet and doesn't move, so the shove throws Rex back instead. Rex leaves at 2.52% of light speed. The air in Rex's path turns into a fireball.' The default dial with Ollie bolted gives 'Rex flies back at 22.1 m/s and slides 40 m'. Engine check added (vB = 0, vA > 1% c). The sweep found no '0 m/s' mover text."
    },
    {
     "id": "u11",
     "status": "fixed",
     "change": "(1) catchControls: in partner mode with Fastball, the height slider and presets are disabled and labelled 'Toss height: as high as he can (Fastball)', and the miss checkbox is hidden in partner mode. Added CSS for disabled chips and sliders. (2) wrestleShove 'Both at once' says 'They shove each other apart', with a speed and slide for each and a slide tile for each. (3) wrestleLift prints the ground-load bullet only when the lift succeeds. (4) wrestleThrow prints Impact and Landing only when f.landed. (5) The shove slide bullet only names non-relativistic movers and only shows when a slide tile exists.",
     "verified": "Rendered partner Fastball and Lob, Both at once, the failed lift (oM 1e9), the unlimited throw and the unlimited shove; the text matches the controls and outcome. Phone-width dark screenshot checked."
    },
    {
     "id": "p11",
     "status": "fixed",
     "change": "app.html wrestleThrow: with Comic ground on (state.groundHolds), the landing reads 'Landing: comic ground takes it (… TNT), and nothing breaks.', with no 'the ground isn't' or crater. On real ground (including when the sinking gate forces the ground to hold), the original impact and landing text stays.",
     "verified": "Rendered the evidence state with groundHolds true and the same state on real ground."
    }
   ],
   "testsPass": true,
   "notes": "Full sequence passes: python3 build-data.py, node build.js, node test/shots.js (0 overflow, no errors at both widths) and node test/calibration.js, which ends 'all checks passed'. Ten new regression checks are at the end of /home/user/dino-strength-sim/test/calibration.js, covering u0, r2, p4 and r1. Nine of them fail on the pre-fix engine. The r1 check passes on both, because r1 was a page-text bug. A 756-state render sweep over the Arm, Wrestle and Collide tabs found no undefined/NaN text, page errors, claws on Ollie, '∞' crack radius, 3 x 10^8 m/s Earth, or zero-speed movers.\n\nFiles changed: src/engine.js, src/app.html, test/calibration.js and research/final-duo.json; src/data.js was regenerated. I left BUILDS/DEFAULT_BODIES, the art, static-data.js and the state.oSame line alone. Nothing was committed. Baseline copies are in the scratchpad at cw-base/.\n\nLeft alone, outside this batch:\n- Exact-c speeds still read 'light speed (to the last digit)' (the existing fmtSpeed convention) in Shove and Throw.\n- Wrestle > Lift of a bolted partner with unlimited strength on real rock still says 'Can't be done' rather than applying the rock-gives rule.\n- The finite-force both-bolted Shoving match still says 'Neither moves' even when the ground tears around the bolts."
  }
 },
 {
  "batch": "arm-duo-misc",
  "report": {
   "items": [
    {
     "id": "p2",
     "status": "fixed",
     "change": "src/engine.js armWrestle. Once the table is broken, the loser's arm folds (a 'pin') only if the winner presses harder than that arm (Aw > P_loser). The pin is now resisted by the loser's full arm force, not his footing. If the winner can't press harder than the loser's arm, the new outcome 'drag' moves the loser's whole body: net = winner's push minus loser's footing, mass = loser's body plus the winner's forearm effective mass, over the winner's quarter-turn sweep. No slam, crater or table ratio is reported for a drag. While the table holds, a pin's peak elbow-pad load is now computed from torques about each elbow: P_l + (P_w - P_l)(effMass*m_l + holdArm*m_w)/(effMass*(mA+mB)). If that tops tableLat, the table breaks (tableBreaksBy 'pin') and the standing-up rules apply. New outputs: padLoad, padBy, tableBreaksBy, loserSlides. src/app.html bayArm: new verdicts for pin, drag and table-torn-by-pin. A standing pin says the hand 'swings down', never 'hits the pad / goes through the table'. Drag gets its own tiles (loser's speed, energy) and bullet; there is a pad-load bullet and a math line for drag and pad load.",
     "verified": "Added 7 checks to test/calibration.js. Bolted vs standing with equal arms gives a drag (speed matches sqrt(2*net*s/M)). The finding repro (1e12 vs 1e11 kg) gives Ollie dragging Rex by the footing difference. 1,000 t bolted vs 100 t gives a pin resisted by the full arm. 100 t vs 511 kg tears the pad (18x the table). 4 t vs 3.6 t pins on the table, with pad-load coefficient 1.1212. These checks fail on the pre-fix engine. I rendered the default, bolted, braced and both-braced states, plus what-if states from a scratch copy of the page that leaves oSame unforced."
    },
    {
     "id": "p9",
     "status": "fixed",
     "change": "src/engine.js armWrestle now sets each arm's twist from what its own arm carries. Winner = his push x his lever. A pinned loser = his own arm force x his lever. A dragged loser whose arm holds = the whole push. src/app.html: the tile shows 'Twist on the upper arms' as Rex / Ollie when the two differ, and keeps 'each' only when they are equal. The math line is reworded to match.",
     "verified": "Calibration check: pinned Ollie's twist = PB x LB and Rex's = AA x LA, and a dragged arm carries the whole push. Render of the 511 kg what-if Ollie shows '9.2 kN·m / 725 N·m' (the verdict expected about 725 N·m)."
    },
    {
     "id": "p10",
     "status": "fixed",
     "change": "src/static-data.js 'Rex and Ollie' card: 25% share (an estimate; plausibly 10-40%). It now says the regulation table carries the push until its pegs and pads tear out (about 5 kN at regulation size, an estimate), after which only their feet hold. 'Goes through each body to his feet' is kept for shoving and wrestling only. Added the standing-up fold-or-drag rule.",
     "verified": "Dumped the rendered card text from dist/preview.html."
    },
    {
     "id": "d0",
     "status": "fixed",
     "change": "Same card rewrite as p10. The 'Rex's body' card no longer hard-codes '2 m and 180 kg by default': it uses {DEFAULT_BODY} and {DEFAULT_FOOT}, which src/app.html fills from P.DEFAULT_BODIES and makeBody at render. The text can't go stale while those provisional values change, and DEFAULT_BODIES itself is untouched. The calibration card now says 'the 2 m, 180 kg calibration body'. build-data.py renames the density chip 'Water (default)' to 'Water' with note 'Close to a human body's density; the 2 m, 180 kg calibration body uses it.'",
     "verified": "Rendered cards read 'By default 3.05 m and 2.7 t...' and 'Foot contact is 0.31 m² each on his default body...'. The chip title was checked in the page."
    },
    {
     "id": "d1",
     "status": "fixed",
     "change": "src/app.html bayArm math line now reads '(estimate, plausibly 10–40%: ordinary men’s measured arm force against an assumed 1–2× body-weight deadlift)'. 'Same-person data' no longer appears anywhere in src.",
     "verified": "grep finds the phrase only in the research note that says no such data exist. Rendered the math block."
    },
    {
     "id": "d13",
     "status": "fixed",
     "change": "src/app.html bayArm: the 'feet hold' clause now names the actual limit. A foot-limited winner: 'can press only X, all his feet hold (his arm has Y)'. A bolted winner: 'his feet don't cap his push'. Otherwise: 'his feet hold X, more than his arm, so he presses with his full Y'. The table-broken stalemate says 'that's all their feet hold' only when both are foot-limited; otherwise it says 'their arms are locked'.",
     "verified": "The braced-Rex state now reads 'Rex’s feet hold 713 kN, more than his arm, so he presses with his full 222 kN... Rex drags Ollie’s whole body sideways', and both-braced reads 'dead heat at 222 kN: their arms are locked'."
    },
    {
     "id": "u1",
     "status": "fixed",
     "change": "src/app.html bayArm: the bolted or infinite winner gets 'X is bolted, so his feet don’t cap his push: his arm presses with unlimited force'. The engine now reports this case as a drag at light speed, not a 3 ns pin. The 'doesn’t help' sentence appears only for an infinitely strong side whose footing is finite, and it names him with his number: 'Rex’s unlimited strength doesn’t help here: his feet still let go at 15.9 kN.'",
     "verified": "Calibration check 'arm u1'. Rendered {inf:true, oAnchor:'bolted'} and the what-if {oInf:true, anchor:'bolted'}. The both-bolted unlimited case still takes the clash path with no feet sentence."
    },
    {
     "id": "r8",
     "status": "fixed",
     "change": "Already fixed before this batch: the comic-ground unlimited verdict no longer says 'bolted down', and an existing calibration check covers it. I only made the wording follow the gate: when the duo gate forces comic ground, it says 'treating the ground as if it held them'.",
     "verified": "Rendered the evidence state {inf, groundHolds, H 2, m 180, oH 2, oM 180}: 'Both arms are unlimited, and on comic ground, the table never breaks...', with no 'bolted' claim."
    },
    {
     "id": "u10",
     "status": "fixed",
     "change": "src/app.html duoGate: the callout now states each sinker's fate from the groundUnderWeight regime: 'would sink into / sink out of sight into / punch through the X / fall through the Earth'. For Ollie it adds 'The Weight tab shows only Rex: give him the same size and mass there to see it.' bayArm: when pulledTogether, the page shows only the verdict, a gravity chip, three tiles (time to meet, closing speed, energy released) and the fall math. The pin, push and table tiles and the comic-ground chip are skipped. A gate-forced comic ground is labelled 'Treating the ground as if it held them' in the chip, the tile, the bullet, the math line and the clash verdict.",
     "verified": "Rendered {oM:2.6e17}: 'Just standing there, Ollie would fall through the Earth...', then the fall tiles only. {oM:3e8} shows the forced-ground labels."
    },
    {
     "id": "d7",
     "status": "fixed",
     "change": "src/engine.js liftPartner returns dC and gPeakOnPath. In src/app.html wrestleLift, the tile caption is 'peak during the lift, from side by side (centres dC apart)' when the path term wins, else 'overhead, centres dOver apart'. Added a Show the math line with the 0.385 G m² / d² path-peak rule. research/final-duo.json duo_gravity_distances: the display and notes now carry the rule and its derivation (max of y/(x²+y²)^1.5 = 2/(3√3)/x² at y = x/√2).",
     "verified": "Default lift: 'overhead, centres 2.29 m apart'. At the current 2.7 t default the overhead term wins: 9.3e-5 N against 6.6e-5 N. A 2 m calibration Rex with a 181 kg Ollie shows 'peak during the lift, from side by side (centres 91 cm apart)'. The JSON parses and build-data.py runs."
    },
    {
     "id": "r11",
     "status": "fixed",
     "change": "src/app.html: added RHO_MIN = 10 kg/m³ (the slider's left end). The #mass and #o-mass handlers and the stored-state validator now clamp the mass to at least RHO_MIN x volume. src/engine.js tossPartner returns 'not-modelled' for a timed-out flight instead of 'orbit'. The page explains it: catchPartner says 'still in the air ... isn’t modelled to the end', and wrestleThrow gets a matching f.timedOut branch.",
     "verified": "Rendered the four evidence states. oM 1e-300 becomes 7.2 kg / 25.5 kg at 10 kg/m³ and gives an ordinary toss and throw, with no 19 s freeze. oH 500 with oM 1e-6 becomes 112,000 t ('can’t even hold him up'). 0.1 m with 1e-9 kg becomes 0.9 g ('air stops him first'). I couldn't reproduce a timed-out toss after the clamp, so the 'not-modelled' text is unexercised."
    },
    {
     "id": "u13",
     "status": "partly",
     "change": "src/app.html formatting. fmtRatio gives '8.3% of' below 1× (with grammar fixes at the two callers that need it). fmtRatioRange gives 'a–b%' below 1× ('as hard as' reads right). The 'Heat it takes in' tile uses a % value with an 'of' caption. compareEnergy uses '≈' only within 15%. fmtSpeed gives km/s at 10 km/s and up. fmtMach returns nothing above Mach 50, and all callers are guarded. fmtTime gives ps below 1 ns and scientific seconds below 1 ps. 'Gravity at his skin' uses scientific notation at 1e6 g and up. The weak-strength Weight tile reads 'his weight is N× his strength'. The fall-through stop range says 'anywhere from the centre out to X' when the lower bound is 0. showHeat hides the nose-air chip and bullet when the heating is under 5 °C.",
     "verified": "Rendered m=1e25, m=1e22, the white-dwarf mass, the logKg 12 fastball and the default lob. Results: 'his weight is 110 quintillion× his strength', 'Escape speed 1,260 km/s', 'fires the baseball at 744 km/s' (no Mach), and no 'Nose air 15 °C' chip. Partly: '6,300,000,000% of the energy' and 'Rock cracks ∞' were already fixed by earlier batches, so I left them. I did not render a state that hits Castle Bravo; that change rests on the compareEnergy code edit alone."
    }
   ],
   "testsPass": true,
   "notes": "The final run passed in full: python3 build-data.py, node build.js, node test/shots.js (no overflow or errors at 1280 light and 390 dark) and node test/calibration.js (106 ok, 'all checks passed'). I did not commit or push.\n\n**Conflict choice (p2):** The table-holds sub-claim asked only for the pad load to be compared with the table. I went further: if the dynamic elbow-pad load during a pin tops tableLat, the table breaks and the standing-up rules apply. That is physically correct, because the load peaks at the start of the pin and the table can't un-break. I also took the elbow reaction from torques about each elbow (P_loser + 1.12 × surplus for equal bodies). The finding's rough 'forearm mass × a_cm' leaves out the hand force. With oSame forced on the page, the arms are equal, so default outcomes change only where footing differs: bolted or dug-in Rex now drags Ollie instead of pinning him. Unequal arms appear only with a what-if strength.\n\n**Things left alone:**\n- BUILDS / DEFAULT_BODIES are unchanged (I diffed them).\n- The `state.oSame = true` line is intact.\n- The art is untouched.\n- The catch fact row '7.9 kg at 180 kg' is accurate as worded, so I left it.\n\n**Files changed:**\n- /home/user/dino-strength-sim/src/engine.js (armWrestle, liftPartner, tossPartner)\n- /home/user/dino-strength-sim/src/app.html (bayArm, duoGate, wrestleLift, wrestleThrow, catchPartner, formatting helpers, mass clamp, assumption-card fill)\n- /home/user/dino-strength-sim/src/static-data.js\n- /home/user/dino-strength-sim/build-data.py (Water chip)\n- /home/user/dino-strength-sim/research/final-duo.json (duo_gravity_distances)\n- /home/user/dino-strength-sim/test/calibration.js (new arm block)\n\n**Backups and test copies:** Pre-batch sources are in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/src-before-armduo and research-before-armduo. What-if states were rendered from a scratch copy of the page that leaves oSame unforced, made by scratchpad/a3/mkwhatif.sh and rendered with scratchpad/a3/whatifshot.js."
  }
 }
]
```

</details>


- `TaskUpdate` #11 status=in_progress activeForm=Fixing 54 audit findings (workflow)
- `TaskUpdate` #10 status=in_progress

**Claude · 2026-10-10 02:28:02 UTC**

The final audit confirmed 54 findings, about 40 distinct issues once duplicates are merged. They're now being fixed.

**Worst ones:**
1. **Settling time wrong:** a units error makes a neutron-star Rex settle at the Earth's centre in about 130 years. It should be thousands of years, and the per-trip energy and quake size are inflated to match.
2. **Relativistic-catch blast too small:** it counts only the heat made in the air between them, not the energy that actually hits Ollie, so it wrongly shrinks as Ollie stands closer.
3. **Tabs disagree:** three tabs give different answers for the same unstoppable-force setup.
4. **Catch check misses contact:** a shot put crushed on contact still counts as "caught".
5. **Throw speeds near vertical wrong:** steep throws use launch speeds that are up to 190× too high.
6. **Wording contradictions,** including one that gives Ollie claws.

**Fixes in progress:** four fixers work one after another on the same files, in this order: weight tab, catch, collide and wrestle, arm wrestle and the rest. Each one rebuilds, runs the tests and adds a regression check for every serious fix. Two reviewers then re-run all 54 original reproductions against the final build.

**Rex and Ollie's size, provisional for now:**

| | Height | Mass | Volume |
|---|---|---|---|
| Rex | 10 ft | 2.45 t | 2.33 m³ |
| Ollie | 10 ft | 2.48 t | 2.36 m³ |

The three methods landed on 2.36, 2.49 and 2.47 t for Rex, with an overall range of about 2.0–2.9 t. A checker is reconciling them now, and the final numbers will move by a few percent at most.

**Build calculator:** research is still running.

**Next:**
1. Put in the final masses.
2. Check them against the arm-wrestling art, which shows arm depth from the side.
3. Rebuild and rerun every test and sweep.
4. Commit, push and republish.

Expect about 3–4 hours, most of it the fix workflow.


*Woken · 2026-10-10 02:29:54 UTC · Background task wdrz9i0fu completed: Dynamic workflow "Estimate Rex (and Ollie) body volume and mass from the reference picture at a 10 ft height, three independent methods plus an adversarial check" completed. Next: Rex's default body is final: 10 ft (3.05 m), 2,700 kg. Rex  Ollie  ---------  Height  10 ft  10 ft (3.06 m to his horn tips, within measuring error)   Mass  2,700 kg  2,700 kg   Plausible range  2,300–3,000 kg  2,300–3,000 kg   Volume  2.55 m³  2.55 m³   ...*


- `Bash` Read the mass checker's reconciled result: `cd /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387 && python3 - <<'EOF'` (+12 lines)
- `Bash` Write final picture-based builds into engine: `cd /home/user/dino-strength-sim && python3 - <<'EOF'` (+9 lines)
- `Bash` Confirm final default bodies: `node -e "` (+4 lines)

**Claude · 2026-10-10 02:30:51 UTC**

Rex's default body is final: **10 ft (3.05 m), 2,700 kg**.

| | Rex | Ollie |
|---|---|---|
| Height | 10 ft | 10 ft (3.06 m to his horn tips, within measuring error) |
| Mass | 2,700 kg | 2,700 kg |
| Plausible range | 2,300–3,000 kg | 2,300–3,000 kg |
| Volume | 2.55 m³ | 2.55 m³ |
| Density | 1,060 kg/m³ | 1,060 kg/m³ |
| Facing area (air drag) | 4.4 m² | 4.5 m² |
| Foot sole, each | 0.31 m² (wide paws) | 0.15 m² (boots) |
| Weight | 26.5 kN | 26.5 kN |

**How the mass was estimated:**
- **Scale:** 10 ft set the scale at 790 pixels from Rex's crest tip to the floor, about 3.9 mm per pixel.
- **Slices:** each body was cut into 1-pixel slices, each treated as an oval. The depth of each oval came from US Army body-survey proportions (ANSUR II), adjusted for these bulkier builds.
- **Arms:** both arms were sized from the one we can fully see.
- **Tail:** includes the part hidden behind Rex's hips. It also accounts for the tail sitting about 10% farther from the camera.
- **Density:** 1,060 kg/m³ is the measured density of lean bodybuilders, minus some lung air (Fry, Cisar & Housh 1987).
- **What the range covers:** depth, arm, tail and density uncertainty.
- **Not covered:** dinosaur-style air sacs, which could make Rex about 7% lighter.

**Comparisons:**
- About 6.8× an average man scaled up to 10 ft.
- About 4× a 135 kg pro bodybuilder scaled to 10 ft.

**Consequences in the sim:**
- Ollie's boots carry the same weight on half Rex's sole area. On soft ground Ollie sinks first.
- The default strength dial (90.7 t) is about 34× their body weight.

**Running now:**
1. The audit-fix workflow: four fix batches in a row, then re-verification of all 54 findings.
2. The build-calculator research.

**Next:** when the fixes land, I'll update the descriptions to match the new bodies:
- the "Rex's body", "Density" and "His own gravity" assumption cards
- the default density chip, "His build"
- a sourced fact for this estimate
Then rebuild, run all tests and sweeps, commit, push and republish.


*Woken · 2026-10-10 02:41:01 UTC · Background task wiiv3akls completed: Dynamic workflow "Research sourced data for a character build calculator (weight and girths from height and build), then adversarially verify each topic" completed. Next: The build-calculator research is done and checked, and the page is now being built in its own folder (/home/user/build-calc). The build workflow runs four stages: 1.*


- `Bash` Summarise build-calculator research and checks: `cd /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387 && mkdir -p scratchpad/buildcalc && python3 - <<'EOF'` (+13 lines)
- `Workflow` build-calculator: Compile verified build data, build the character build calculator page, then audit it from two angles and fix confirmed findings
  - run `wf_84d11c85-160`: 5 subagents, listed below

<details>
<summary>Subagent `data` (build-calculator, 2026-10-10 02:42:16 UTC): I wrote builds.json and NOTES.md in /home/user/build-calc/data/. A node check loads the file cleanly, with no errors. Every build with a missing girth has a template, and every template chain ends at a real girth.</summary>

Workflow run `wf_84d11c85-160`, phase `Data`, agent `a74b2571360158b43`. Prompt, verbatim:

```text
PROJECT: "Build calculator", a standalone web page. The user picks a BUILD and a HEIGHT; the page shows estimated WEIGHT and GIRTHS (chest, waist, flexed upper arm, forearm, thigh, calf, neck), in imperial or metric. The owner values factual accuracy over flattery: every number must say whether it is measured, official, reported, derived or an estimate, and the page must say "unknown" rather than invent. Writing style: plain, short sentences, no filler.
Project folder: /home/user/build-calc/ (create it). Layout: data/builds.json (compiled data with sources), src/calc.js (the model, plain JS usable in node via module.exports and in the page via window.BuildCalc), src/app.html (the page), build.js (inlines calc.js and the data into dist/index.html), test/test.js (node tests). Do not touch /home/user/dino-strength-sim or /home/user/lodge-docs.
Research (already done and fact-checked): /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/buildcalc/research-all.json. It has 4 topics (anthro = ANSUR II measured data and fits; muscle = bodybuilders and strongmen; comics = official character stats; model = density, FFMI, scaling, volume models). Each has research.facts and verify.checks; where a check has ok=false, its 'corrected' text MUST be applied. Raw downloads and scripts from the research (ANSUR CSVs, fits) are under /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/buildcalc/ (look in its subfolders).

YOUR JOB (DATA): write /home/user/build-calc/data/builds.json and /home/user/build-calc/data/NOTES.md.
1. Facts: carry over every research fact with the verifier corrections applied (keep key, label, status, values, sources, notes). Record which corrections you applied.
2. Builds list. Each build: id, name, group (Everyday, Natural athletes, Bodybuilders, Strongmen and lifters, Comic characters, Rex and Ollie), sex, reference height_m and weight_kg (with status and source keys), any measured/reported girths in metres (chest, waist, arm_flexed, forearm, thigh, calf, neck; note when a source's definition differs from ANSUR's, e.g. relaxed vs flexed arm, natural vs navel waist), body-fat % if known, and a 'template' saying which build's shape fills missing girths. Include: ANSUR II men and women at 5th/50th/95th percentile; a civilian US baseline from NHANES 2015-2018 (Fryar et al. 2021, Vital Health Stat Series 3 No. 46: fetch https://www.cdc.gov/nchs/data/series/sr_03/sr03-046-508.pdf and use only numbers you read there); the natural athletes and bodybuilders/strongmen in the research (use reported values with their exact sources; disputed values as ranges); every comic character in the research (official height/weight, with disputed editions as ranges); and Rex and Ollie.
3. Rex and Ollie: two original characters measured from a reference picture in another project. Height 10 ft = 3.048 m each, mass 2,700 kg each (range 2,300-3,000), volume 2.55 m^3, density 1,060 kg/m^3 (status: estimate, source: picture measurement). Derive their girths from the picture measurements in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/mass/ (start with /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/mass/final.json, then the checker files in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/mass/checker/ and method folders): girth = ellipse perimeter (Ramanujan) of measured width x depth ratio used there. Mark them 'derived (from picture)'. Ollie wears cargo pants, boots and a vest; Rex wears a tank top and cargo pants: say girths include clothing where they do. Rex has a large tail; note that it adds weight but no listed girth.
4. Templates for missing girths: for each build with height and weight but few girths (comics), choose the shape template sensibly (e.g. the measured bodybuilder or strongman closest in weight/height^3) and record the choice; the page will label those girths 'derived'.
5. In NOTES.md, list every correction applied, every judgement call, and gaps.
```

</details>

<details>
<summary>Subagent `build` (build-calculator, 2026-10-10 03:11:09 UTC): The page is built and both test runs pass. The 14 node tests pass, and the headless Chromium check found no problems at 390 and 1280 px, light and dark. dist/index.html is about 505 KB.</summary>

Workflow run `wf_84d11c85-160`, phase `Build`, agent `a8b23e906222fb830`. Prompt, verbatim:

```text
PROJECT: "Build calculator", a standalone web page. The user picks a BUILD and a HEIGHT; the page shows estimated WEIGHT and GIRTHS (chest, waist, flexed upper arm, forearm, thigh, calf, neck), in imperial or metric. The owner values factual accuracy over flattery: every number must say whether it is measured, official, reported, derived or an estimate, and the page must say "unknown" rather than invent. Writing style: plain, short sentences, no filler.
Project folder: /home/user/build-calc/ (create it). Layout: data/builds.json (compiled data with sources), src/calc.js (the model, plain JS usable in node via module.exports and in the page via window.BuildCalc), src/app.html (the page), build.js (inlines calc.js and the data into dist/index.html), test/test.js (node tests). Do not touch /home/user/dino-strength-sim or /home/user/lodge-docs.
Research (already done and fact-checked): /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/buildcalc/research-all.json. It has 4 topics (anthro = ANSUR II measured data and fits; muscle = bodybuilders and strongmen; comics = official character stats; model = density, FFMI, scaling, volume models). Each has research.facts and verify.checks; where a check has ok=false, its 'corrected' text MUST be applied. Raw downloads and scripts from the research (ANSUR CSVs, fits) are under /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/buildcalc/ (look in its subfolders).
PAGE CONTRACT (it will be published as a claude.ai artifact; follow exactly):
- Write only page content: no <!doctype>, <html>, <head> or <body> tags. Put <title>Build Calculator</title> and <style> at the top.
- Fonts from Google Fonts only (link to fonts.googleapis.com) with real fallback stacks; no other external CSS. Scripts: none needed; if you use one it must come from cdnjs.cloudflare.com pinned to an exact version. Everything else inline. No fetch/XHR, no window.print, no alert/confirm/prompt, no downloads.
- Colors as tokens on :root (light values), redefined for dark mode under @media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {...; color-scheme: dark} } and again under :root[data-theme="dark"] {...}. body gets an explicit background from a token.
- Works at 390 px wide with at least 16 px side gutter and no horizontal page scroll; wide tables scroll inside their own overflow-x:auto container. Use font-variant-numeric: tabular-nums for number columns. localStorage only for convenience (units, last build), wrapped in try/catch.
- Design: a precise measuring-tape / tailor's-chart feel suits the subject (e.g. tape-measure ticks, a body diagram with the seven girth lines). Considered type pairing, restrained palette, real hierarchy. Not a generic dashboard.

YOUR JOB (BUILD): data is ready in /home/user/build-calc/data/builds.json (read /home/user/build-calc/data/NOTES.md first). Write src/calc.js, src/app.html, build.js and test/test.js, then build dist/index.html and run the tests.
MODEL (in calc.js, with comments):
- Same-shape scaling: at a new height H with the build's shape, weight W = W0 (H/H0)^3 and each girth G = G0 (H/H0). If the user also sets a weight, girths follow G = G0 sqrt((W/H)/(W0/H0)) (fixed cross-section shape). Cite the ANSUR finding that chest follows this law (exponent about 1.02) and that waist grows faster and calf/forearm/neck slower between soldiers; offer the ANSUR per-girth exponents only as an optional "average-soldier" mode, labelled.
- Missing girths come from the build's template, rescaled the same way, and are labelled 'derived from <template>'.
- Reverse mode: the user types girths (and height); the page estimates weight two ways: the ANSUR II log-linear girth regression (with its RMSE and a clear warning outside the ANSUR range, e.g. flexed arm above 49 cm) and the frustum volume model x density (density from body fat via Siri). Show both and their agreement.
- Also show BMI and FFMI (at a user-set body-fat %, default from the build or 15%) with Kouri's 25 natural reference described exactly as the corrected research says (a sample maximum, not a hard limit).
PAGE: build picker grouped by group (searchable or a clean select), height input in ft/in or cm (units toggle), optional weight override, body-fat input, results: weight big; the seven girths as a tailor's chart with each value's status chip (measured / official / reported / derived / estimate); a body diagram marking where each girth is taken (and the ANSUR definition in a tooltip or note: navel-level waist, flexed arm); comparison bars vs an average man (ANSUR 50th) on one honest scale; a sources section listing every source used by the current build with links. Reverse-mode panel. Everything works at 390 px and in dark mode.
TESTS (test/test.js, node): ANSUR 50th man reproduces his own numbers at his own height; doubling height multiplies weight by 8 and girths by 2; the regression reproduces the research's RMSE on the ANSUR CSV if available (else on the stored summary); reverse mode on the ANSUR median man returns his weight within 3%; every build in builds.json renders without NaN/undefined/Infinity (drive calc.js for each build at 3 heights). Run them and make them pass. Also render the page headless (Chromium at /opt/pw-browsers/chromium-1194/chrome-linux/chrome via require('/opt/node22/lib/node_modules/playwright')) at 390 and 1280, light and dark, screenshot to /home/user/build-calc/shots/, look at them, and fix what looks wrong.

Data agent report:
I wrote `builds.json` and `NOTES.md` in `/home/user/build-calc/data/`. A node check loads the file cleanly, with no errors. Every build with a missing girth has a template, and every template chain ends at a real girth.

**What's in builds.json:**
- **Builds:** 55 in total.
  - Everyday (11): ANSUR II men and women at the 5th, 50th and 95th percentile. NHANES 2015-2018 medians for US men and women. Three extra ANSUR II builds used as templates: the "lean but heavy" men (n=39), the "lean but heavy" women (n=70), and the one man with the largest flexed arm.
  - Natural athletes (4): Chappell 2019 natural PROs, Kouri 1995 non-users, the Mr. America 1938-1954 mean, and Steve Reeves.
  - Bodybuilders (12): 7 pros and 5 study groups.
  - Strongmen and lifters (5).
  - Comic characters (21).
  - Rex and Ollie (2).
- **Facts:** all 134 research facts, plus 5 I added: NHANES, the ANSUR 1988 natural-waist vs navel-waist ratio, Rex and Ollie mass, Rex and Ollie girths, and the template rule.
- **NHANES:** I fetched the CDC PDF and used only numbers I read in it. Its waist is taken at the hip crest, not the navel, so it is flagged as a different definition. Its relaxed arm goes under `extra_girths.arm_relaxed`, not the flexed-arm slot.

**Corrections:** all 23 ok=false corrections are applied. 20 edit facts; 3 are on the model summary and go in as notes on the nearest fact. I also applied the 12 ok=true checks that gave corrected text and the 44 issue notes. That makes 92 log entries, recorded both in the JSON and in NOTES.md. Each text replacement checks that the old phrase exists, so no edit could fail silently.

**Rex and Ollie girths** (Ramanujan ellipse of the picture width × the depth ratio the checker used at that site):

| | Chest | Waist | Upper arm | Forearm | Thigh | Calf | Neck |
|---|---|---|---|---|---|---|---|
| Rex (m) | 3.45 | 2.59 | 1.90 | 1.63 | 1.92 | 2.00 | 1.59 |
| Ollie (m) | 3.69 | 3.50 | 1.75 | 1.21 | 1.99 | 2.08 | 1.48 |

- Each girth carries a range, a "derived (from picture)" label and a clothing flag.
- Over clothing: Rex's chest and waist (tank top), Ollie's chest and waist (open vest), and both figures' thighs and calves (cargo pants).
- Rex's tail is about 0.29 m³, roughly 307 kg inside the 2,700 kg. It has no girth.
- A check of this method on ANSUR II medians gives a chest 12% shorter than the real tape. So both chests probably read low. I didn't adjust them, because the brief fixed the method.

**Templates:**
- **Muscular builds** use the bodybuilder build with recorded girths and the closest weight/height³: Reeves, the Mr. America mean, Oliva, Yates or Coleman.
- **Strongmen and Kingpin** use the ANSUR II largest-arm man, because a stage-lean bodybuilder's waist would be too small for them. Kingpin is there because Marvel compares him to a sumo wrestler.
- **Colossus (armoured)** scales his human form by height only.
- **Banner and the NHANES builds** use the ANSUR average-shape formula.
- **She-Hulk** uses the "lean but heavy" ANSUR women, since there are no female athlete girths.
- **Wolverine's** girths are scaled from his 195 lb body; the adamantium adds weight but not girth.

**Decision for you:** builds above BMI 43.5 (the highest BMI of anyone with measured girths here) are flagged `beyond_human_girth_data`. That covers most comic characters and four of the strongmen. The comics verifier said these should show "unknown / beyond human data". The brief said to show template girths as "derived". The data supports either. I suggest showing them only with a clear "estimate, beyond human data" label.

NOTES.md also covers the other judgement calls: which contest year sets each pro's weight, and which edition is the default when comic sources disagree. It ends with the gaps. The main gaps: no girths at all for strongmen or Big Ramy, and the pros' girths come from undated fan sites.

The scripts are in `/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/bcdata/scripts/`. `compile.py` rebuilds builds.json, and `resolve_test.py` fills every template and prints all girths as a check.

Files are in /home/user/build-calc/data/:
- builds.json
- NOTES.md
```

</details>

<details>
<summary>Subagent `audit:numbers` (build-calculator, 2026-10-10 03:37:20 UTC): Returned findings: 11 (e.g. Typing body fat or weight silently replaces the reference height, so measured/official/rep; FFMI scale plots a Kouri-normalised value against unadjusted reference ticks (badly for wo).</summary>

Workflow run `wf_84d11c85-160`, phase `Audit`, agent `a5fbb7a2c02080a6a`. Prompt, verbatim:

```text
PROJECT: "Build calculator", a standalone web page. The user picks a BUILD and a HEIGHT; the page shows estimated WEIGHT and GIRTHS (chest, waist, flexed upper arm, forearm, thigh, calf, neck), in imperial or metric. The owner values factual accuracy over flattery: every number must say whether it is measured, official, reported, derived or an estimate, and the page must say "unknown" rather than invent. Writing style: plain, short sentences, no filler.
Project folder: /home/user/build-calc/ (create it). Layout: data/builds.json (compiled data with sources), src/calc.js (the model, plain JS usable in node via module.exports and in the page via window.BuildCalc), src/app.html (the page), build.js (inlines calc.js and the data into dist/index.html), test/test.js (node tests). Do not touch /home/user/dino-strength-sim or /home/user/lodge-docs.
Research (already done and fact-checked): /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/buildcalc/research-all.json. It has 4 topics (anthro = ANSUR II measured data and fits; muscle = bodybuilders and strongmen; comics = official character stats; model = density, FFMI, scaling, volume models). Each has research.facts and verify.checks; where a check has ok=false, its 'corrected' text MUST be applied. Raw downloads and scripts from the research (ANSUR CSVs, fits) are under /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/buildcalc/ (look in its subfolders).
PAGE CONTRACT (it will be published as a claude.ai artifact; follow exactly):
- Write only page content: no <!doctype>, <html>, <head> or <body> tags. Put <title>Build Calculator</title> and <style> at the top.
- Fonts from Google Fonts only (link to fonts.googleapis.com) with real fallback stacks; no other external CSS. Scripts: none needed; if you use one it must come from cdnjs.cloudflare.com pinned to an exact version. Everything else inline. No fetch/XHR, no window.print, no alert/confirm/prompt, no downloads.
- Colors as tokens on :root (light values), redefined for dark mode under @media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {...; color-scheme: dark} } and again under :root[data-theme="dark"] {...}. body gets an explicit background from a token.
- Works at 390 px wide with at least 16 px side gutter and no horizontal page scroll; wide tables scroll inside their own overflow-x:auto container. Use font-variant-numeric: tabular-nums for number columns. localStorage only for convenience (units, last build), wrapped in try/catch.
- Design: a precise measuring-tape / tailor's-chart feel suits the subject (e.g. tape-measure ticks, a body diagram with the seven girth lines). Considered type pairing, restrained palette, real hierarchy. Not a generic dashboard.

You are an adversarial AUDITOR of the finished build in /home/user/build-calc/ (do not edit project files; scratch under /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/buildcalc/audit-numbers/). Lens: NUMBERS AND MODEL. Check calc.js and builds.json against the research file and the corrections: every displayed value, its status label and source; the scaling math; the regression and frustum implementations (re-derive from the ANSUR CSV); FFMI and Siri; unit conversions (lb, in, ft/in); comic values and disputed ranges; Rex and Ollie derivations. Reproduce each problem with a node snippet. Report only reproduced problems (verified=true), most severe first, at most 20.
```

</details>

<details>
<summary>Subagent `audit:page` (build-calculator, 2026-10-10 03:37:20 UTC): Returned findings: 20 (e.g. 'Other figure' weights lose their number in imperial mode; Note tells the reader to hide girths that the page shows by default, using internal 'comic).</summary>

Workflow run `wf_84d11c85-160`, phase `Audit`, agent `a238c446c4d7b4060`. Prompt, verbatim:

```text
PROJECT: "Build calculator", a standalone web page. The user picks a BUILD and a HEIGHT; the page shows estimated WEIGHT and GIRTHS (chest, waist, flexed upper arm, forearm, thigh, calf, neck), in imperial or metric. The owner values factual accuracy over flattery: every number must say whether it is measured, official, reported, derived or an estimate, and the page must say "unknown" rather than invent. Writing style: plain, short sentences, no filler.
Project folder: /home/user/build-calc/ (create it). Layout: data/builds.json (compiled data with sources), src/calc.js (the model, plain JS usable in node via module.exports and in the page via window.BuildCalc), src/app.html (the page), build.js (inlines calc.js and the data into dist/index.html), test/test.js (node tests). Do not touch /home/user/dino-strength-sim or /home/user/lodge-docs.
Research (already done and fact-checked): /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/buildcalc/research-all.json. It has 4 topics (anthro = ANSUR II measured data and fits; muscle = bodybuilders and strongmen; comics = official character stats; model = density, FFMI, scaling, volume models). Each has research.facts and verify.checks; where a check has ok=false, its 'corrected' text MUST be applied. Raw downloads and scripts from the research (ANSUR CSVs, fits) are under /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/buildcalc/ (look in its subfolders).
PAGE CONTRACT (it will be published as a claude.ai artifact; follow exactly):
- Write only page content: no <!doctype>, <html>, <head> or <body> tags. Put <title>Build Calculator</title> and <style> at the top.
- Fonts from Google Fonts only (link to fonts.googleapis.com) with real fallback stacks; no other external CSS. Scripts: none needed; if you use one it must come from cdnjs.cloudflare.com pinned to an exact version. Everything else inline. No fetch/XHR, no window.print, no alert/confirm/prompt, no downloads.
- Colors as tokens on :root (light values), redefined for dark mode under @media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {...; color-scheme: dark} } and again under :root[data-theme="dark"] {...}. body gets an explicit background from a token.
- Works at 390 px wide with at least 16 px side gutter and no horizontal page scroll; wide tables scroll inside their own overflow-x:auto container. Use font-variant-numeric: tabular-nums for number columns. localStorage only for convenience (units, last build), wrapped in try/catch.
- Design: a precise measuring-tape / tailor's-chart feel suits the subject (e.g. tape-measure ticks, a body diagram with the seven girth lines). Considered type pairing, restrained palette, real hierarchy. Not a generic dashboard.

You are an adversarial AUDITOR of the finished build in /home/user/build-calc/ (do not edit project files; scratch under /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/buildcalc/audit-page/). Lens: PAGE, TEXT AND UX. Render dist/index.html headless at 390 and 1280, light and dark (screenshots to /home/user/build-calc/shots/audit-*). Try every build, both unit systems, extreme heights (0.5 m to 10 m) and weights, the reverse mode with extreme girths, and keyboard use. Check the page contract (no external resources except Google Fonts, tokens with both dark blocks, body background, no horizontal scroll at 390 px), grammar and clarity, honest labels, contradictions, overflow, and contrast. Report only reproduced problems (verified=true), most severe first, at most 20.
```

</details>

<details>
<summary>Subagent `fix` (build-calculator, 2026-10-10 03:54:19 UTC): I fixed all 31 findings in /home/user/build-calc/ (two of them are the same "Average soldier" label issue). After rebuilding, node test/test.js passes 22 of 22: the 14 old tests and 8 new ones covering these fixes. The ANSUR II CSV checks still match the research.</summary>

Workflow run `wf_84d11c85-160`, phase `Fix`, agent `a822c8e7c8961a8a6`. Prompt, verbatim:

```text
PROJECT: "Build calculator", a standalone web page. The user picks a BUILD and a HEIGHT; the page shows estimated WEIGHT and GIRTHS (chest, waist, flexed upper arm, forearm, thigh, calf, neck), in imperial or metric. The owner values factual accuracy over flattery: every number must say whether it is measured, official, reported, derived or an estimate, and the page must say "unknown" rather than invent. Writing style: plain, short sentences, no filler.
Project folder: /home/user/build-calc/ (create it). Layout: data/builds.json (compiled data with sources), src/calc.js (the model, plain JS usable in node via module.exports and in the page via window.BuildCalc), src/app.html (the page), build.js (inlines calc.js and the data into dist/index.html), test/test.js (node tests). Do not touch /home/user/dino-strength-sim or /home/user/lodge-docs.
Research (already done and fact-checked): /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/buildcalc/research-all.json. It has 4 topics (anthro = ANSUR II measured data and fits; muscle = bodybuilders and strongmen; comics = official character stats; model = density, FFMI, scaling, volume models). Each has research.facts and verify.checks; where a check has ok=false, its 'corrected' text MUST be applied. Raw downloads and scripts from the research (ANSUR CSVs, fits) are under /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/buildcalc/ (look in its subfolders).
PAGE CONTRACT (it will be published as a claude.ai artifact; follow exactly):
- Write only page content: no <!doctype>, <html>, <head> or <body> tags. Put <title>Build Calculator</title> and <style> at the top.
- Fonts from Google Fonts only (link to fonts.googleapis.com) with real fallback stacks; no other external CSS. Scripts: none needed; if you use one it must come from cdnjs.cloudflare.com pinned to an exact version. Everything else inline. No fetch/XHR, no window.print, no alert/confirm/prompt, no downloads.
- Colors as tokens on :root (light values), redefined for dark mode under @media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {...; color-scheme: dark} } and again under :root[data-theme="dark"] {...}. body gets an explicit background from a token.
- Works at 390 px wide with at least 16 px side gutter and no horizontal page scroll; wide tables scroll inside their own overflow-x:auto container. Use font-variant-numeric: tabular-nums for number columns. localStorage only for convenience (units, last build), wrapped in try/catch.
- Design: a precise measuring-tape / tailor's-chart feel suits the subject (e.g. tape-measure ticks, a body diagram with the seven girth lines). Considered type pairing, restrained palette, real hierarchy. Not a generic dashboard.

YOUR JOB (FIX): apply fixes for these audit findings in /home/user/build-calc/, rebuild, re-run test/test.js and the headless screenshots, and report what you changed per finding (or why not).

[
 {
  "title": "Typing body fat or weight silently replaces the reference height, so measured/official/reported labels flip to input/derived",
  "severity": "major",
  "where": "src/app.html readMain() lines 1097-1101 (wired to every input at 1187-1189) and setHeightFields() 589-593; src/calc.js compute() line 262 (atRefH tolerance 1e-9)",
  "evidence": "Any input event, including the body-fat box, re-reads the rounded height fields: 1 decimal place of inches in imperial, 1 decimal place of cm in metric. Browser run of dist/index.html (scratch scripts/t_bf.js), ANSUR II 50th percentile man, imperial (the default). Before: HEIGHT 'MEASURED', weight '187 MEASURED', chest 'MEASURED'. After typing 12 in Body fat: HEIGHT 'YOUR INPUT, Reference 5 ft 9.1 in', weight '187 DERIVED', chest 'DERIVED, Scaled from the measured 41.6 in at 5 ft 9.1 in', plus a Reset button. Ronnie Coleman in metric: his 134.3 kg 'REPORTED' becomes '134.2 DERIVED', and every reported girth becomes DERIVED. In node (scripts/evidence.js), heightParts(1.755) feeds back 1.75514 m and 180.3 cm feeds back 1.8030 m, which differ from 1.755 and 1.8034, so atRefH is false. This hits 27 of 55 builds in imperial and 19 of 55 in metric.",
  "fix": "Update state.heightM only when a height field fires the event. Or treat any typed height within display rounding of the reference (0.05 in or 0.05 cm) as the reference height, so the reference statuses and values are kept.",
  "verified": true
 },
 {
  "title": "FFMI scale plots a Kouri-normalised value against unadjusted reference ticks (badly for women)",
  "severity": "major",
  "where": "src/app.html renderFfmi() lines 671-704; src/calc.js line 334 (ffmiNorm applied to every build, women included)",
  "evidence": "The marker is ff.norm = FFMI + 6.1 x (1.80 - H), which uses the men-only Kouri normalisation to 1.80 m. The female ticks are explicitly unadjusted: Schutz median 15.4 and Blue 2019 max 25.5 ('unadjusted' in the page's own note). Page (t_misc.js): ANSUR p5 woman reads 'FFMI 20.4 normalised ... Unadjusted 18.7', and the marker sits at 20.4 on the 15.4/25.5 scale. ANSUR p50 woman: plotted at 22.5 against unadjusted 21.5. With the assumed 15% fat, the median woman soldier lands 7 units above the median line and near the female-athlete maximum. The male ticks mix bases too: Schutz 18.9 is unadjusted and Trexler 28.1/31.7 use Trexler's own regression slope.",
  "fix": "For women, and for any tick that is not Kouri-normalised, plot the unadjusted FFMI, or convert each reference to the same basis. Use the 1.80 m normalisation only against the Kouri 25.0 line for men. Say on each tick which basis it uses.",
  "verified": true
 },
 {
  "title": "Kouri verdict ('above that sample maximum') is printed from an assumed 15% body fat for ordinary builds",
  "severity": "minor",
  "where": "src/app.html renderFfmi() line 707; src/calc.js DEFAULT_BODY_FAT line 29",
  "evidence": "Page, ANSUR p95 man (110.7 kg soldier, body fat unknown): 'This build: 26.5 at an assumed 15% body fat ... This build is above that sample maximum.' In node, compute() gives above=true for ansur2_m_p95 (26.5), ansur2_m_largest_arm (32.1, BMI 37.4) and ansur2_m_leanheavy (25.6), all with bodyFat.status 'estimate'. The verdict rests entirely on an invented fat %. The research verifier made the Captain America verdict depend on body fat ('exceeds 25.0 only below about 17%') for exactly this reason.",
  "fix": "When body fat is assumed, do not print above or below. Print the break-even body fat instead (the build exceeds 25.0 only below X% fat), or say the verdict is unknown without a body-fat figure.",
  "verified": true
 },
 {
  "title": "Midpoints that no source printed are labelled 'reported'",
  "severity": "minor",
  "where": "data/builds.json: dorian_yates (height, chest, waist, arm_flexed, calf), jay_cutler (height, calf), brian_shaw (height), ronnie_coleman (thigh), sergio_oliva (chest, arm_flexed)",
  "evidence": "In node (evidence.js): dorian_yates and jay_cutler height 1.765 m (5 ft 9.5 in), status 'reported', basis 'midpoint of the disputed range'. brian_shaw 2.016 m, 'reported', midpoint. ronnie_coleman thigh 35.00 in, 'reported', 'midpoint of 34 (FitnessVolt) and 36 (GreatestPhysiques)'. sergio_oliva chest 55.5 in and arm 21.25 in, 'reported', midpoints. Dorian chest 56.5, waist 36, arm 20.5 and calf 21 are also 'reported' midpoints, and so is Jay's calf 19.5. The status vocabulary defines reported as 'Stated by a magazine, fan site...' and derived as 'Calculated ... from other numbers'. These reach the page as the chip 'reported'.",
  "fix": "Label these values 'derived' (midpoint of reported values) and keep the range. Or use one reported value as the reference and show the other as the range end.",
  "verified": true
 },
 {
  "title": "Captain America's DK Avengers edition shows as 6 ft 1.6 in; the book prints 6 ft 2 in",
  "severity": "minor",
  "where": "data/builds.json captain_america.editions[1].height_m = 1.87 (line 5014); rendered by src/app.html renderNotes() line 916",
  "evidence": "Page notes (t_misc.js): 'Edition. DK Avengers Ultimate Character Guides (2010, 2013): 6 ft 1.6 in, 220 lb'. fmt.height(1.87,'imperial') gives '6 ft 1.6 in'. The source text is 'HEIGHT 6 ft 2 in (1.87 m)', and the correction says 'Height 6 ft 2 in (1.88 m; DK prints 1.87 m)'. The page shows an imperial height that no source prints.",
  "fix": "Store 1.8796 m (6 ft 2 in) for that edition and keep 'DK prints 1.87 m' in its label.",
  "verified": true
 },
 {
  "title": "Rex/Ollie weight scaled from an 'estimate' is relabelled 'derived'",
  "severity": "minor",
  "where": "src/calc.js compute() line 280 (weight status) and line 348 (BMI always 'derived')",
  "evidence": "Rex's reference weight_kg.status is 'estimate'. compute({buildId:'rex', heightM: 9 ft}) returns weight 1968 kg with status 'derived' and BMI 'derived', while FFMI stays 'estimate'. Page (t_misc2.js): 'REX at 9 ft: 4,339 DERIVED'. Scaling a picture estimate with height cubed cannot make it more certain. The model also propagates 'estimate' for FFMI but not for weight or BMI.",
  "fix": "Carry the weakest input status: when the reference value is 'estimate', the scaled weight, BMI and scaled girths stay 'estimate'.",
  "verified": true
 },
 {
  "title": "Ollie shows Rex's volume, and his girths and mass are not rescaled to the 10 ft he is given",
  "severity": "minor",
  "where": "data/builds.json ollie.volume_m3 (line 7382) and ollie.height_m; fact rex_ollie_picture_mass",
  "evidence": "ollie.volume_m3.value is 2.55, the shared figure that matches Rex's 2.553. The fact's own volume_central_m3.ollie is 2.531, and the page prints 'Volume. 2.55 m³' on Ollie. Ollie's girths and volume were measured at Rex's scale (0.0038582 m/px), where Ollie is 794 px = 3.063 m to the horn tips (checker results_checker.json: ol_m 3.063; unrounded mass 2683 kg). Yet his reference height is set to 3.048 m with no rescaling. At exactly 10 ft, girths would be x0.995 and mass x0.985 (about 2,644 kg before rounding). The build does not say what Ollie's 10 ft is measured to.",
  "fix": "Set ollie.volume_m3 to 2.53. Either give Ollie his measured height (3.063 m to the horns) or rescale his girths and mass to 3.048 m, and state which landmark the 10 ft refers to.",
  "verified": true
 },
 {
  "title": "Beyond-data note rounds Kraemer's BMI 43.54 to 'BMI 44'",
  "severity": "minor",
  "where": "src/app.html basisHtml() line 744",
  "evidence": "Page (t_misc2.js), Kraemer strongmen: the stats panel says 'BMI 43.5', while each girth note says 'Beyond human data: BMI 44 is above 43.5'. compute() gives bmiGirth 43.538, and fmt.num(43.538, 0) = '44'. The page shows two different BMIs for the same build, and the rounded one exaggerates how far it lies past the 43.45 data maximum.",
  "fix": "Use fmt.num(r.bmiGirth, 1), and say 'above 43.45' or 'above the data maximum of 43.5'.",
  "verified": true
 },
 {
  "title": "Reverse estimate A prints its 90% residual band in kg when imperial units are on",
  "severity": "minor",
  "where": "src/app.html renderReverse() line 999",
  "evidence": "Page in imperial (default), ANSUR p50 man: '± 4 lb (1 SD, 1.91% on ANSUR II men). 90% of soldiers fell within -2.58 to +2.66 kg.' A.resid90 is concatenated with a hard-coded ' kg', so imperial users get one number in lb and the next in kg.",
  "fix": "Format the band with fmt.mass in the current units (about -5.7 to +5.9 lb).",
  "verified": true
 },
 {
  "title": "'Average soldier' option states 'Mostly fat, not muscle' as fact, dropping the required estimate label",
  "severity": "minor",
  "where": "src/app.html line 370 (mode radio label)",
  "evidence": "The page label reads 'How girths differ between US Army soldiers (ANSUR II). Mostly fat, not muscle. Results are estimates.' Verify check ansur2_girth_scaling_male (ok=false) says the 'mostly fat' claim is unsupported by ANSUR II, which has no body-composition data. It must be worded 'roughly 60-70% of between-person weight difference is fat (estimate, Forbes/Hall 2007, derived from data on women)'. calc.js and the methods list carry the estimate wording, but this label does not.",
  "fix": "Change the label to 'Between-soldier differences; roughly 60-70% of the weight difference is fat (estimate, Forbes/Hall 2007).'",
  "verified": true
 },
 {
  "title": "Methods text gives 5.9% waist scatter for the geometric law; ANSUR II re-derivation gives 5.7%",
  "severity": "minor",
  "where": "src/app.html line 473; data/builds.json fact ansur_geometric_law_test.values.resid_sd_pct.waist = 5.9",
  "evidence": "Re-derived from ANSUR_II_MALE_Public.csv (scripts/geo.js) four ways: SD of ln-residual about the sqrt(W/H) law, SD of pred/obs-1, CV of k = G/sqrt(W/H), and RMSE/mean of the least-squares fit through the origin. Results: waist 5.73-5.78% (chest 2.97-2.99%). The verifier's own recompute also gave waist 5.7 (and arm 5.2, forearm 4.5, calf 4.2, neck 4.3 against the stored 5.3/4.6/4.3/4.4). The 5.92 in physics/out/scaling_results.json could not be reproduced.",
  "fix": "Use 5.7% for the waist on the page and in the fact, or state the definition that gives 5.9%.",
  "verified": true
 },
 {
  "title": "'Other figure' weights lose their number in imperial mode",
  "severity": "major",
  "where": "src/app.html:909 (renderNotes, 'Other figure' line)",
  "evidence": "The value is shown only when units are metric or the label contains mean or median. In imperial: Hafthor 'Other figure. career heaviest, 2012 REPORTED' and 'boxing weigh-in, 18 Mar 2022 REPORTED'. Lasha 'Rio 2016 weigh-in OFFICIAL' and 'Paris 2024 weigh-in OFFICIAL'. Eddie Hall 'self-reported peak'. Withers '10 weeks pre-contest'. de Moraes 'weigh-in day (M1)'. Chappell 'start of diet (SD 8.3)'. None of these lines has a number. Metric shows them, e.g. '(210.0 kg)' and '(157.3 kg)'. Imperial is the default.",
  "fix": "Always print the value in the current units (fmt.mass(o.value,u) or lbRange). Skip it only when the label already contains that number.",
  "verified": true
 },
 {
  "title": "Note tells the reader to hide girths that the page shows by default, using internal 'comics verifier' wording",
  "severity": "major",
  "where": "data/builds.json flags.note on 17 builds (e.g. line 4328), rendered at src/app.html:915",
  "evidence": "Hafthor, Eddie Hall, Lasha, Kraemer strongmen, Thor, Hulk and others show: 'Flag. BMI 48 is above 43.5 ... The comics verifier recommends showing such girths as \"unknown / beyond human data\" rather than extrapolating; if shown, label them estimates.' The page defaults to showBeyond=true, so it shows those girths. The note names an internal review step, and 'comics' appears on real strongmen.",
  "fix": "Rewrite as plain reader text: 'BMI 48 is above 43.5, the highest BMI with measured girths. Girths here are rough model estimates. Turn off \"Show girths beyond human data\" to see unknown instead.' Or default showBeyond to off, to match the recommendation.",
  "verified": true
 },
 {
  "title": "Heights far outside human range get no 'beyond data' flag; girths stay labelled 'derived'",
  "severity": "major",
  "where": "src/calc.js:287 (beyond = BMI test only); src/app.html:633 renderHead",
  "evidence": "US Army man p50, metric, height 1000 cm, weight 2500 kg (BMI 25.0): no flags, and all seven girths are labelled DERIVED (chest 240.5 cm). Ronnie at 1 ft 7.7 in (0.5 m): no flag, girths DERIVED, weight 6 lb. Only the reverse section warns. The page's own method text says the law is good to about 1% for height changes of 10% or less.",
  "fix": "Treat height outside the measured human range (e.g. below ANSUR or NHANES min, or above 2.1 m) as beyond human data. Flag it, label scaled girths 'estimate', and say why.",
  "verified": true
 },
 {
  "title": "Normalised FFMI goes negative or meaningless at extreme heights",
  "severity": "major",
  "where": "src/calc.js:334 (ffmiNorm = ffmi + 6.1*(1.8-H)); src/app.html:665,692-699",
  "evidence": "ANSUR p50 at 1000 cm, 2500 kg: 'FFMI -28.8 normalised, Unadjusted 21.3'. Ronnie at 0.5 m: normalised 17.7 vs unadjusted 9.7 (+8 units from the correction). The method text says the correction is checked only between 1.55 and 2.05 m. No caveat is shown, and the scale marker sits at 12 with no off-scale arrow on the low side.",
  "fix": "Outside about 1.55-2.05 m, show the normalised FFMI as unknown (or show unadjusted only), and say the height correction does not apply. Add the low-side off-scale arrow.",
  "verified": true
 },
 {
  "title": "Typing in the build search switches the build and wipes the user's height and weight",
  "severity": "major",
  "where": "src/app.html:575-577 (fillSelect calls setBuild(first))",
  "evidence": "Ronnie, height set to 6 ft 6 in, weight 320. Typing 'j' in Search at once switches the sheet to Jay Cutler. Height resets to 5 ft 9.5 in and weight to empty. Clearing the search does not restore them. 'zzzz' empties the select (value '') while the sheet still shows the old build.",
  "fix": "Filter the list only. Change the build when the user picks an option. Keep user-entered height and weight, or ask before resetting.",
  "verified": true
 },
 {
  "title": "'Average soldier' option states 'Mostly fat, not muscle' as fact, against the applied research correction",
  "severity": "major",
  "where": "src/app.html:370",
  "evidence": "Option text: 'How girths differ between US Army soldiers (ANSUR II). Mostly fat, not muscle. Results are estimates.' research-all.json check ansur2_girth_scaling_male is ok=false. It calls 'mostly fat' unsupported, because ANSUR II has no body-composition data. The corrected wording is 'roughly 60-70% ... is fat (estimate, derived from data on women)'. The method section uses the hedged version, so the page contradicts itself.",
  "fix": "Replace with: 'How girths differ between US Army soldiers (ANSUR II). No body-fat data; probably mostly fat (estimate). Results are estimates.'",
  "verified": true
 },
 {
  "title": "Light-mode secondary text fails WCAG AA contrast",
  "severity": "major",
  "where": "src/app.html:11 (--ink-3 #737C85), used by .eyebrow, .k, .stats dt, .g .site small, .g .v2, figcaption, .fact .use/summary, .foot, .src-group h4, .unit, .cmp-axis, .chip.unknown, .spec",
  "evidence": "Measured in the rendered page (light): 4.06:1 on --sheet for 10.5-12 px text, including the UNKNOWN chip and girth landmark text. .spec (13 px on --paper) is 3.70:1. Dark mode: highlighted girth rows put --ink-3 on --tape-2 at 2.48:1 ('At the navel, relaxed', '91.4 cm'). Dark mode otherwise passes (5.26:1).",
  "fix": "Darken light --ink-3 to about #5F6770 (4.5:1 or better on both paper and sheet). In highlighted rows use --ink-2 for the small text, or lighten the dark --tape-2.",
  "verified": true
 },
 {
  "title": "Height hint promises '1 ft to 33 ft' but 33 ft is rejected",
  "severity": "minor",
  "where": "src/app.html:623 (limit 0.3-10 m) and 1118 (hint text)",
  "evidence": "Entering 33 ft 0 in turns the fields red with 'Enter a height between 1 ft and 33 ft (0.3-10 m).' 33 ft is 10.06 m. The real maximum is 32 ft 9.7 in. Meanwhile 30 cm (11.8 in, under 1 ft) is accepted.",
  "fix": "Say 'between 1 ft and 32 ft 9 in (0.3-10 m)', or make the limits match the text in each unit system.",
  "verified": true
 },
 {
  "title": "Reverse mode: an invalid height or body fat is silently ignored, with a wrong message",
  "severity": "minor",
  "where": "src/app.html:964-974 (readRevFields), 992",
  "evidence": "Reverse height 33 ft 0 in, or 0 ft 0 in: no field is marked invalid. Output: 'Needs height. Without every girth there is no estimate.' Height is not a girth, and no valid range is given. Reverse body fat 0, 70 or 200: no error, and card B says 'No body fat given.' even though the user typed one. The main panel validates body fat at 2-60%; reverse silently uses 0-70.",
  "fix": "Set aria-invalid and show a range message for reverse height and body fat. Word the missing-input message per field, e.g. 'Enter a height between ...'.",
  "verified": true
 },
 {
  "title": "SDs and residuals show without units, or in the wrong units, in imperial mode",
  "severity": "minor",
  "where": "src/app.html:903-904 (basis text), 999 (resid90); data basis strings",
  "evidence": "Kraemer (imperial): 'Weight. 337 lb MEASURED Group mean (SD 19.3).' The SD is kg. 'Height. 6 ft 1.8 in ... (SD 0.071)' is metres. Fry: 'SD 0.067', 'SD 11.0'. Reverse card A always says '90% of soldiers fell within -2.58 to +2.66 kg', even in imperial and next to a 45,515 lb estimate, where that absolute band means nothing.",
  "fix": "Add units to SDs and convert them with the display units. State the residual band as a percentage or in the current units, and tie it clearly to ANSUR soldiers.",
  "verified": true
 },
 {
  "title": "Kraemer strongmen: BMI 43.5 is shown as above the 43.5 limit, and a third FFMI disagrees",
  "severity": "minor",
  "where": "src/calc.js:26,287; src/app.html:663,744; Kraemer notes",
  "evidence": "Stats show 'BMI 43.5 ... Highest with measured girths: 43.5', but the build is flagged BEYOND HUMAN GIRTH DATA, and every girth says 'BMI 44 is above 43.5'. Reverse warnings give the limit as 43.45. The notes also say 'derived FFMI 35.1' (lean plus BMC, unadjusted), while the stat block shows 34.9 normalised and 35.4 unadjusted. Nothing explains the difference.",
  "fix": "Show the limit and the BMI to two decimals near the threshold (43.54 > 43.45), and use one value for the limit everywhere. Label the note's FFMI as '(lean + bone mineral, unadjusted, DXA)'.",
  "verified": true
 },
 {
  "title": "Inconsistent number formatting for large and small weights",
  "severity": "minor",
  "where": "src/calc.js:154 (massNum); src/app.html:543-547 (lbRange), 998-1002 (rcards)",
  "evidence": "Metric big readout '22898 kg' while the other line says '50,482 lb'. Reverse cards '45515 lb' and '15694 lb', while the number line says '15,694 lb'. '± 21441.3 kg' and '± 1260 lb'. 'The source range scales to 49617-50481 lb' and '22506.0-22898.1 kg'. Rex: 'Range in the sources: 5071-6614 lb'. At small heights the ranges collapse to '6-6 lb' and '1-1 lb'.",
  "fix": "Use one formatter with thousands separators and magnitude-aware decimals everywhere. Collapse a range to one value when its ends round to the same number.",
  "verified": true
 },
 {
  "title": "Internal process jargon in reader-facing text",
  "severity": "minor",
  "where": "data/builds.json notes, basis and labels; src/app.html:986",
  "evidence": "'Caveat (verifier): ...' (Mr. America). 'Means computed by the data compiler'. 'Body fat. 9.3% MEASURED Not stated in the fact (SD 1.6)' and hint 'Empty: 9.3% from the data (measured; not stated in the fact (SD 1.6)).' (Fry). 'Forearm 33.9 and neck 41.1 cm are from the fact's orig text.' 'Selection rule (researcher's)'. 'FFMI 25.0 in the fact assumes 5% fat'. 'Checker central volume' (Rex). 'missing sites (chest, waist, arm_flexed, ...)' (Fry template). 'The research assumed about 20% for the men (unsourced)'.",
  "fix": "Rewrite these strings in plain reader terms: the source, what was measured, and what is assumed. Map site keys to labels ('flexed upper arm').",
  "verified": true
 },
 {
  "title": "Raw ASCII math notation mixed with typeset symbols",
  "severity": "minor",
  "where": "fact labels and notes in data/builds.json; footer DATA.meta.units (src/app.html:1168); reverse density note",
  "evidence": "'How each girth scales with sqrt(weight/height), males'. 'G = G_ref*sqrt((W/W_ref)/(H/H_ref))'. 'frustum volume model x effective density'. 'girth = A x W^p x H^q' (NHANES). 'kg/m^3' (footer). 'Siri density at 1% fat (1097.6 kg/m3)'. The same page uses √, ×, ³ elsewhere. The footer also says 'Girths in metres', but every girth on the page is in cm or in.",
  "fix": "Run labels and notes through pretty() (or a richer one) for sqrt to √, ' x ' to ×, ^3 and m3 to ³. Reword the footer to say the data file stores metres.",
  "verified": true
 },
 {
  "title": "Desktop input panel hides Model options behind a near-invisible inner scroll",
  "severity": "minor",
  "where": "src/app.html:79 (.panel sticky, max-height calc(100vh - 32px), overflow:auto)",
  "evidence": "At 1280x720 the panel's scrollHeight is 938 and clientHeight 686. The scrollbar is 2 px wide. 'Average soldier' and 'Show girths beyond human data' sit below the fold and are cut mid-line (shots/audit-1280x720-panel.png). At 1280x900 the last option is still clipped (938 vs 866).",
  "fix": "Drop the max-height and inner scroll (let the panel scroll with the page), or collapse Model options by default on desktop with a visible summary.",
  "verified": true
 },
 {
  "title": "Keyboard: radio-role buttons ignore arrow keys; dead tab stop on the SVG; highlight sticks after focus leaves",
  "severity": "minor",
  "where": "src/app.html:333-336, 444-447 (role=radio buttons); 411 (svg); 1202-1207 (no focusout)",
  "evidence": "Focus on Imperial and press ArrowRight: focus and selection do not move. Both buttons are separate tab stops. Tab order includes 'svg#body[img]', which does nothing. After tabbing from the Neck row to the reverse buttons, Neck stays highlighted in the list, figure and bars, though focus is elsewhere.",
  "fix": "Use real radio inputs, or add roving tabindex with arrow-key handling. Make the svg non-focusable (focusable='false', no tabindex). Clear the active site on focusout or mouseleave of the whole group.",
  "verified": true
 },
 {
  "title": "Unbounded weight input causes horizontal page scroll at 390 px",
  "severity": "minor",
  "where": "src/app.html:1103 (no upper bound); .stats .v (FFMI cell)",
  "evidence": "Metric weight 100000000 gives scrollWidth 399 > 390. Imperial 1000000000 gives 411. The FFMI stat '26147337.5normalised' overflows its cell. Height is capped at 10 m, but weight has no cap.",
  "fix": "Cap weight at a sane maximum (e.g. 1,000,000 kg) with a hint, and let .stats .v wrap (overflow-wrap:anywhere) or shrink.",
  "verified": true
 },
 {
  "title": "Context-free or confusing labels: 'NOT STATED' flag, 'No girths found.', ambiguous lists",
  "severity": "minor",
  "where": "src/app.html:636 (drug_status flag), 992 and 1086 (list joins); Hafthor notes",
  "evidence": "Eight builds (Shaw, Hafthor, Eddie Hall, Kraemer, de Moraes, Sukwong, Withers, Fry) show a bare flag 'NOT STATED', with no subject. Hafthor's notes say 'No girths found.' above a chart showing seven girths. 'Needs chest, waist, upper arm, flexed, forearm, ...' and 'Used for: chest, waist, upper arm, flexed, thigh' read as two sites because the label contains a comma. The flag 'TEMPLATE DIFFERS BY OVER 10% IN W/H³' is jargon.",
  "fix": "Prefix with 'Drug testing: not stated'. Say 'No published girths found; all seven come from a template.' Use 'flexed upper arm' in lists. Rename the flag to 'Template is a different weight for height'.",
  "verified": true
 },
 {
  "title": "Comparison bars: 'unknown' text is overprinted by reference lines",
  "severity": "minor",
  "where": "src/app.html:240 (.track .unk), 884-888",
  "evidence": "She-Hulk with beyond-data girths hidden (dark, 390): the Forearm, Calf and Neck rows show 'unknown' crossed by the solid man and dashed woman reference marks (shots/audit-390-dark-shehulk-hidden.png).",
  "fix": "Give .unk a background and z-index above the refmarks, or move the unknown label into the ratio column.",
  "verified": true
 },
 {
  "title": "Body diagram height tape has no numbers at small heights",
  "severity": "minor",
  "where": "src/app.html:828-838 (renderBody, metric major ticks every 0.5 m)",
  "evidence": "At 50 cm (metric) the yellow tape shows four short ticks and no labels, because the only major tick is at the top and is skipped. The caption still says 'The tape on the left reads this build's height.' At 32 ft 9.7 in (imperial), 32 foot labels at 8 px are crammed together.",
  "fix": "Pick the major and label step from the height (e.g. every 10 cm under 1 m, every 5 ft above 15 ft).",
  "verified": true
 }
]
```

</details>


- `TaskUpdate` #13 status=completed
- `TaskUpdate` #14 status=in_progress

**Claude · 2026-10-10 02:42:23 UTC**

The build-calculator research is done and checked, and the page is now being built in its own folder (`/home/user/build-calc`). The build workflow runs four stages:

1. **Compile the data.** Apply all 23 verifier corrections. Add US civilian averages, since the Army soldiers are leaner than the general public. Derive Rex's and Ollie's girths from their picture measurements.
2. **Build the page.** You pick a build and a height and get weight plus seven girths, each tagged measured, official, reported, derived or estimate. It also has a body diagram, comparison bars against an average man, and BMI and FFMI. A reverse mode takes typed-in girths and estimates weight two ways: from the soldier data, and from a body-volume model.
3. **Audit it twice:** once for numbers and model, once for page text and layout.
4. **Fix** whatever the audits confirm.

Expect the calculator to need a couple of hours more.

**Rex lab:** the audit-fix workflow is working through its four batches. After that come the description updates for the 10 ft, 2,700 kg bodies, then commit, push and republish.


*Woken · 2026-10-10 04:20:43 UTC · Background task wt6h8ok4m completed: Dynamic workflow "Compile verified build data, build the character build calculator page, then audit it from two angles and fix confirmed findings" completed. Next: The build calculator is done: built, audited (31 findings) and all fixed, with 22 of 22 tests passing. Checking it myself before publishing.*


- `Bash` Read calculator audit findings and fix report: `cd /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387 && python3 - <<'EOF'` (+7 lines)

**Claude · 2026-10-10 04:20:57 UTC**

The build calculator is done: built, audited (31 findings) and all fixed, with 22 of 22 tests passing. Checking it myself before publishing.


- `Bash` Check calculator files, tests, and contract basics: `cd /home/user/build-calc && ls; node test/test.js 2>&1 | tail -5; ls -la dist/ shots/ | head -30; grep -o "<title>[^<]*</title>" src/app.html; grep -c "fonts...`
- `Bash` Crop calculator screenshots for review: `python3 -c "` (+4 lines)
- `Read` /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/bc-1280-top.png
- `Read` /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/bc-390-rex.png

**Claude · 2026-10-10 04:21:14 UTC**

It's well built. Two wording fixes before publishing:
- Rex and Ollie show "sex not stated", but you call both of them "he".
- Rex is described as a "lizard build", but he's a dinosaur.


- `Bash` Inspect Rex and Ollie build entries: `python3 - <<'EOF'` (+9 lines)
  - result: Exit code 1
  - result: {"id": "rex", "name": "Rex", "group": "Rex and Ollie", "sex": null, "description": "Original character measured from a reference picture. Lizard build with a large tail; wears a tank top and cargo pants.", "notes": ["All girths are derived 
  - result: {"id": "ollie", "name": "Ollie", "group": "Rex and Ollie", "sex": null, "description": "Original character measured from a reference picture. Bull-headed build; wears cargo pants, boots and an open vest.", "notes": ["All girths are derived 
- `Bash` Check how sex values are used: `python3 -c "` (+2 lines)
- `Bash` Set Rex/Ollie as male, fix dinosaur wording: `python3 - <<'EOF'` (+15 lines)

**Claude · 2026-10-10 04:21:32 UTC**

Tests still pass, 22 of 22. Publishing the calculator as its own page.


- `Artifact` quickstart other
- `Bash` Check page skeleton and stage file for publishing: `head -c 400 dist/index.html; echo; grep -c "<!doctype\|<html\|<body\|<head" dist/index.html; cp dist/index.html /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-b...`
- `Bash` Locate skeleton-tag matches: `grep -n -o ".\{40\}\(<!doctype\|<html\|<body\|<head\).\{40\}" dist/index.html | head`
- `Bash` Locate skeleton-tag matches case-insensitively: `grep -n -i -o ".\{0,40\}\(<!doctype\|<html\|<body\|<head\)[^a-z].\{0,30\}" dist/index.html | head -5`
- `Artifact` publish /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/build-calculator.html

**Claude · 2026-10-10 04:21:55 UTC**

The build calculator is published: https://claude.ai/artifact/9aKMVmtGqXXT2kGMYvZb5E

Copying it into lodge-docs and committing; the Rex fix workflow doesn't touch that folder.


- `Bash` Check how tests find the ANSUR CSVs: `grep -n "csv\|CSV\|scratchpad" test/test.js tools/*.js | head -10; find /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/buildcalc -n...`
- `Bash` Bundle ANSUR CSVs and read data notes: `mkdir -p data/ansur2 && cp /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/buildcalc/ansur2/raw/ANSUR_II_MALE_Public.csv /tmp/claude...`
- `Write` /home/user/build-calc/README.md
- `Bash` Copy calculator into lodge-docs: `cd /home/user/lodge-docs && git status --short | head -5; git fetch origin claude/dinosaur-strength-physics-8o13ft 2>&1 | tail -1; git log --oneline -1 origi...`
  - result: Exit code 127
  - result:  * branch            claude/dinosaur-strength-physics-8o13ft -> FETCH_HEAD
  - result: a5795ee Rex lab: fix third-review findings
- `Bash` Copy calculator via tar and run its tests: `cd /home/user/lodge-docs && rm -rf build-calculator && mkdir -p build-calculator && cd /home/user/build-calc && tar --exclude=./shots --exclude=./node_module...`
- `Bash` Commit and push the build calculator: `cd /home/user/lodge-docs && git add build-calculator && git status --short | head -20 && git commit -q -F - <<'EOF'` (+17 lines)


> **Commit** `4a03723` · 2026-10-10 04:22:29 UTC · Add Build Calculator: weight and girths from height and build  [made in lodge-docs as 4a03723; e919ae4 in rex-strength-lab after the move]

