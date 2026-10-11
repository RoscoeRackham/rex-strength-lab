
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

## Reproduce

Scripts are in `/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/bcdata/scripts/`:

- `facts_fix.py`: loads the research and applies every correction, with assertions.
- `girths.py`: Rex and Ollie girths (writes `rexollie_girths.json`).
- `compile.py`: writes builds.json. Run `python3 -I compile.py /home/user/build-calc/data/builds.json`.
- `resolve_test.py`: fills every template chain and prints all girths in inches, as a check.
- `ansur1_waist.py`, `mra.py`: the ANSUR 1988 waist ratio and the Mr. America means.

The NHANES PDF is in `scratchpad/bcdata/nhanes_dl/` (sha256 936396720de7ce66b69e392a3b964d552f3170fc241f91fc9e93efb74c447b2d).
