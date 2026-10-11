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

There are 92 log entries.

- 23 checks had ok=false. All 23 corrections are applied.
  - 20 are on facts. Each fact is edited.
  - 3 are on the model summary and have no fact. Each is applied as a note on the nearest fact.
- 12 are checks with ok=true that still gave corrected text. Those are applied too.
- 44 are checks with ok=true and only an issue note. The note is added, or the wording is fixed.
- 5 are consistency edits by the compiler. They carry a verifier correction to other facts that repeat the same claim.
- 8 are summary-level items from the verifier verdicts. The research summaries are not carried into builds.json, so these are recorded only.

Every ok=false check is covered. Every check with corrected text is covered. The script asserts that each replaced phrase exists, so no edit failed silently.

