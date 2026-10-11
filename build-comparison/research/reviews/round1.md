# Review round 1

Workflow `build-comparison-review-r1`, run 11 October 2026 on the first published page (commit `3cd65f5`, the claims fixes checked against `2093fed` and later). Five independent lenses each looked for real defects and wrote a repro script for every finding. Then one skeptic per lens reproduced or refuted each finding on a clean `git archive` snapshot.

- **Lenses:**
  - **model:** physics and formulas
  - **claims:** every sentence against its data
  - **data:** facts and sources against what the sources say
  - **ux:** layout, accessibility and phone use
  - **code:** the measuring tool, the tests and CI
- **Verbatim results:** [round1.json](round1.json) holds every finding, the verdict on each, and what each reviewer checked and found sound (`verified_ok`). The repro scripts are in the session scratchpad and are copied into the history entry.
- **Totals:** 76 findings. The verifiers confirmed 69 and rejected 7. Of the 7, three were already fixed by the time the verifier ran (code F1, F4 and F11 duplicate model F1 and F3), and four were judged not defects (claims F23, data DC-1 and DC-9, ux L14).

**Round 2 found seven of these fixes only partial:**
- claims F6, F9 and F21
- data DC-14
- UX L1 and L8
- the archive.org quotes

It also showed that the measured limit scores were themselves inflated by the tool's arm reading. All of this is in [round2.md](round2.md).

## Fixes, by lens

Commits are on `claude/hopeful-keller-vly1s9`.

### Model (7 findings, all confirmed). Commit `1af0101`

| ID | Finding | Outcome |
|---|---|---|
| F1 | Limit scores were S(f=1) × f², not the drawn shape as the method text says. The head, hands, feet and joints are not widened, so this overstated arms and thighs by 4–12% and the face limit by about 20%. | Fixed. Each limit's score is now the measuring tool's reading of the widened drawing: arms about 41 (37–41), thighs 46 (42–49), face 87–200. A test re-measures the shapes at another resolution and checks they grow more slowly than f². |
| F2 | The page put the arms and thighs limits above every real man, yet its own top bodybuilder figures already meet both tests. Arms were drawn through the bodies. | Fixed. The tests run on every chart figure (`limits.json` `chart_figures`). Figures are drawn with their arms just past their own rest angle. The limit cards, band notes and gap copy say which figures meet each test sooner: arms from Arnold Schwarzenegger (27), thighs from Ronnie Coleman (39). One drawing height for every figure, with each grid's columns sized to its widest figure. |
| F3 | The target tool missed targets by up to 34% and handed over sheets its own checks reject. | Fixed. A false-position solver to 0.2% (`Figure.solveTarget`), measured from the skull row. It refuses failing sheets, in the page and in `tools/export_targets.js`. Tested on targets 20, 217 and 900, plus 300 on Coleman in the page. |
| F4 | Wrong reason for the 95th percentile soldier scoring lower: he is not taller-for-shape, his assumed body fat is higher. | Fixed. The text now gives the fat (34% against 25%) and says he would score about 23 at the median's fat. |
| F5 | `limits.json` could go stale against its settings. | Fixed. `test.js` recomputes it and compares it whole. This caught a stale note during these fixes. |
| F6 | The arms-limit test exercised a function the limit does not use. | Fixed. The tests cover `armRestAngle`, `armClearAt` on chart figures, and the stored scores. The unused arm-clearance helpers were removed. |
| F7 | `sliceRotated` read a depth profile by grid row, not image row. | Fixed, with a regression test. |

### Claims (24 findings, 23 confirmed). Commit `2093fed`

All 23 confirmed findings were fixed:

- **F1:** switching Figures or View no longer destroys an open details panel.
- **F2:** `limits.json` was stale.
- **F3:** Rex and Ollie: only their thighs are past a limit in the art; their A-pose arms are untested.
- **F4, F20:** the sumo anchor is relabelled and marked derived.
- **F5:** the giants' "official" wording now excludes the grey Hulk's fan-wiki figures.
- **F6:** DERIVED only when body fat is measured.
- **F7, F10:** "every real man" starts at 19 (Banner excluded); "top" comic characters, not "heaviest".
- **F8 to F24:**
  - testing claims for Trexler and Currier
  - "many", not "a few", above 25
  - the Mr America inputs and Kouri's labels
  - Banner's fat note and the drawer's ignore lines
  - 924 never rounded
  - gap tiles say "nothing comparable"
  - band position wording, the Withers height range, and the thigh step width

Kouri's non-users now come from Table 1 of the full paper.

F23 (Rex's tail, 307 against 306 kg) was judged not a defect: the unrounded volume, 0.2894 m³, gives 307 kg. The round 1 fix had changed it to 306, and round 2 restored 307.

### Data (14 findings, 12 confirmed). Commit `f594930`

| ID | Finding | Outcome |
|---|---|---|
| DC-1 | Archive.org search-API links often fail, and the handbook items are lending-only. | Rejected as a defect (the API answered the verifier 69 times), but hardened anyway as the verifier suggested. `tools/fetch_archive_snippets.py` keeps the matched text in `research/archive_snippets.json`. API sources now show the quote and are labelled as an API that may fail. Round 2 found 4 of the 21 without a quote; after round 2, 18 have one, and the other 3 are explained in round2.md. Each book's stable archive.org page is added, opening a search inside for the quoted words. |
| DC-2 | A Sources label gave Rex's old-basis numbers (261 vs 159). | Fixed: about 250 vs 160 on the page's basis. |
| DC-3 | Pope's 6–16% was credited to Kouri 1995. | Fixed: credited to Todd 2008 (recalled, unpublished). |
| DC-4 | 19 drawers said "No publisher gives body fat". | Fixed: "none was found in the sources searched". |
| DC-5 | The Vasen note said more than the abstract. | Fixed: a 75–120° brace, all 12 tasks, other joints compensating. |
| DC-6 | The Past-25 verdict mixed Trexler's own scale into Kouri's. | Fixed: 54 of 235 (23%) on Kouri's equation, confirmed in the full text. The 28 and 32 are labelled as the study's own normalised FFMI. |
| DC-7, DC-8 | Two source titles kept wording the verifier had corrected. | Fixed through a new `retitle_sources` correction. |
| DC-9 | "Tall men are slimmer" stated as fact. | Rejected as a defect (true as an average). Reworded anyway to state the average and the dispute. |
| DC-10 | Juggernaut's drawer did not say Marvel.com lists 9'5" / 1,900 lb. | Fixed: the drawer says when sources disagree and which value is counted. |
| DC-11 | The Mr America bar ran from the mean to the top. | Fixed: the winners' spread, 22.6 to 28.0 normalised FFMI. |
| DC-12 | A DC fact's values contradicted its corrected label. | Fixed, with the quote confirmed in the DK DC 2021 OCR text. |
| DC-13 | Stale README counts and band edges. | Fixed. |
| DC-14 | The DISPUTED chip was not in the key. | Fixed. |

### UX (17 findings, 16 confirmed). Commit `7b6306e`

Fixed:

- **L1, L13:** focus rings now sit inside the segmented buttons and figure cells.
- **L2:** the drawer stays in one column below 900 px. A new tablet sweep opens every drawer at 720, 768, 820 and 900 px.
- **L3:** accessible names carry the plate's warnings.
- **L4, L11:** forest axis labels no longer overlap or hang off the tape.
- **L5:** phone value cells sit on their own ground.
- **L6:** plate chips no longer clip.
- **L7:** the real-men cluster ends at 42.
- **L8:** the 924 ring jumps to the meatball.
- **L9:** the page hides its own `[hidden]` elements, and the test skeleton no longer masks this.
- **L12:** focus returns to the opener.
- **L15:** the sheet picker is two buttons.
- **L16:** a band left open where it runs on.
- **L17:** README counts.

**L10 (contrast) is partly fixed.** Forest bars and tape ticks now have a 1 px edge, and the limit figures are outlined. The group colours themselves are unchanged. The suggested darker gold for natural athletes (#97720F) becomes nearly identical to the bodybuilders' orange for deuteranopes (simulated distance 0.015). In light mode the natural athletes' unedged head, hands and feet stay at 1.7:1 on the wall. This is left for the owner's palette decision (see `data/NOTES.md`).

**L14 (no figure on the phone's first screen)** was judged a design trade-off, not a defect. It is not changed.

### Code (14 findings, 11 confirmed; F1, F4 and F11 already fixed by the model-lens commit). Commit `7b6306e`

| ID | Finding | Outcome |
|---|---|---|
| F2 | A front-and-back sheet passed every check, and the back view was used as the side depth (+29%). | Fixed. A new check refuses a side view as wide as the front at both the waist and the hips. The turnarounds' round bellies reach 0.94–1.07 at the waist but 0.6 at the hips, so real side views pass. Tested. |
| F3 | Typed skull rows were not validated (23,800,000 kg, all checks passing). | Fixed. A row outside its view's head is refused and not scored, and the row used is drawn on the sheet. Tested in Node and in the page. |
| F5 | A 2,000 px sheet froze the page for 12–16 s. | Partly fixed. Measuring now runs in a Web Worker built from the inlined tool, with the elapsed time shown, so the page stays responsive. Refinement runs on each view's crop. That uses much less memory but saves little time: a 2,000 px sheet still takes about 10 s. |
| F6 | CI did not check `facts.json` or `limits.json`. | Fixed. CI regenerates `facts.json` and fails on a difference. `limits.json` is compared whole in `test.js`. |
| F7 | Tests did not test what their names said. | Fixed. Tests now check that the tail faces right, check which turnaround checks fail by name, and test the arm functions that are actually used. |
| F8 | Copy used the height field's current value. | Fixed. Copy uses the inputs that were measured and refuses after the fields change. |
| F9 | Transparent sheets failed with a misleading message. | Fixed. Transparent backgrounds are read from alpha, and the message says what the tool needs. |
| F10 | The tool's runs on load blocked the main thread. | Fixed. They start when the tool section comes near. The target solve and the duo.jpg test still run on the main thread at that point (about 1–2 s). |
| F12 | The NaN audit missed text in closed `<details>`. | Fixed. The audit reads all text. |
| F13 | The skull-row hint did not match the view order. | Fixed. |
| F14 | README counts. | Fixed. |

## After the fixes

- `node test/test.js`: 30 passed. The limits are recomputed and compared.
- `node test/duo.js`: Rex 2.54 m³, inside 2.52–2.60.
- `node test/shots.js`: no problems at 390 and 1280 px, light and dark. This covers the new tablet sweep, the tool checks and the focus return.
- The Build Calculator's tests and shots pass.
