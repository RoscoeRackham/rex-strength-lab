# Review round 2

Workflow `build-comparison-review-r2`, run 11 October 2026 on commit `7061d55`, the page after the round 1 fixes. Four lenses each looked for real defects and wrote a repro script for every finding. Then one skeptic per lens reproduced or refuted each finding.

- **Lenses:**
  - **fixcheck:** every confirmed round 1 finding, re-checked against what [round1.md](round1.md) says
  - **modelclaims:** the model and the copy of the changed parts
  - **ux:** layout, accessibility and reading
  - **code:** the Web Worker, the measuring-tool changes, the solver, determinism, the tests and CI
- **Verbatim results:** [round2.json](round2.json) holds the findings, the verdicts and what each reviewer found sound (`verified_ok`).
- **Totals:** 40 findings, all confirmed (9 major, 31 minor).
  - **Round 1 fixes that were partial:** claims F6, F9 and F21; data DC-14; UX L1 and L8; the archive.org quotes; plus four untrue statements in the records.
  - **A defect in the measuring tool:** it dropped arms held far out and counted them as torso. That inflated the face limit, the target outlines and the comic giants' drawing checks.

## The main change: how drawn figures are scored

The measuring tool reads a figure row by row. Round 2 showed two problems with that:

- **Arms held far out were dropped.** The tool kept an arm only if it spanned 10% of the figure's height in image rows. An arm held 68° or more out spans fewer rows, so the tool dropped it and counted it as torso (front width × trunk depth).
  - The score jumped 11% between width factors 1.745 and 1.75.
  - The face limit shapes read 15–19% high.
  - The comic giants' drawing checks read about 20 points high.
- **Followed arms still read high.** Where the tool does follow an arm, it counts the arm at torso depth where it meets the shoulder. That is about 4% high with the arms at 35° and about 20% high near level.

**What changed:**
- **The page's own figures** (limit shapes, chart outlines, drawing checks, target outlines) are now scored as drawn. The tool reads the head and body from the front and side views, and the arms are added as round limbs along their own axis (`Figure.armVolume`, `Figure.headAndBody`, `tools/export_targets.js drawnVolume`).
- **The tool itself:**
  - judges an arm by its length along its own axis, not by the rows it spans
  - stops following an arm after a short stretch without it
  - has a new check, "both arms followed from the armpits", which refuses a sheet whose arms it cannot separate instead of silently counting them as torso
- **Where the arms cannot hang clear at all** (rest angle about 90°), the tool cannot follow them and says so. This is a remaining limit for Step 2: see "Still open".

**New numbers:**
- **Arms out:** about 38 (34–38 across the templates). Round 1 had 41 (37–41).
- **Thighs touch:** about 43 (39–45). Round 1 had 46 (42–49).
- **Hands to face:** 58–170. Contact geometry puts it at about 160; the steep fit at about 58, now derived from the fact on the drawn girths (R2-m1). Round 1 had 87–200.
- **Drawing checks:** from 8% under to 22% over the weight (median +1%). Round 1 had −3% to +34%.

## Findings and outcomes

Commits are on `claude/hopeful-keller-vly1s9`, after `7061d55`.

### Fix check (11)

| ID | Finding | Outcome |
|---|---|---|
| R2-FIX-01 | Claims F21 not fixed. The example sheet drew the soldier's own girths on a 1.80 m frame, and the page blamed drawing size for the 26 vs 27 difference. | Fixed. The example draws his shape scaled to 1.80 m, as the limits do. The page now gives the true reason the tool reads 27 against the limits' 26: the tool counts each arm at torso depth where it meets the shoulder. |
| R2-FIX-02 | L8 half fixed: a tap at or left of the 924 ring's centre went to "Empty to the end". | Fixed. A tap from 8 px left of the ring rightwards goes to the meatball. `shots.js` taps 3 px left on both tapes. |
| R2-FIX-03 | L1 partly fixed: the focus ring on a pressed segmented button was 2.3:1 / 1.7:1. | Fixed. The ring uses the sheet colour on the dark pressed button. |
| R2-FIX-04 | F6 partly fixed: the key defined ESTIMATE as "body fat assumed", but Brian Shaw's rests on a reported body fat. | Fixed. "ESTIMATE: body fat assumed or only reported." |
| R2-FIX-05 | F9 partly fixed: Kouri's group was still headed "Gym athletes" above "56 gym athletes and 18 volunteers". | Fixed in `build-calculator/data/builds.json` (claimed by this branch): "Men who never used steroids (Kouri 1995, n=74)". Its NOTES row was updated, and both pages rebuilt and tested. |
| R2-FIX-06 | DC-14 partly fixed: DISPUTED was drawn as a REPORTED chip with the wrong tooltip. | Fixed. DISPUTED has its own chip and tooltip. |
| R2-FIX-07 | Rex's tail was 306 kg on the page and 307 in NOTES and builds.json. The round 1 verifier had ruled 307 correct. | Fixed. 307 kg (0.2894 m³ × 1,060), in settings and tests; round1.md corrected. |
| R2-FIX-08 | README: stale test count, the comic body-fat sentence, and "all fixed". | Fixed. |
| R2-FIX-09 | round1.md overstated the per-view refinement speed-up. | Fixed. It saves memory, not much time. |
| R2-FIX-10 | 4 of 21 archive.org search sources had no quote, including the 1987 handbook hit. | Fixed for the official books. 18 of 21 now quote the matched text. The other 3 are explained below. |
| R2-FIX-11 | Stale NOTES numbers (drawn volume vs weight, giants' arm angles). | Fixed, recomputed from `limits.json`. |

The three archive.org sources without a quote:
- one hit is *The Definitive Thor Reloaded*, which is not treated as an official handbook
- one search failed on every fetch; its fact links the DK 2019 OCR text
- Luke Cage's only DK hit is OCR that runs two columns together; its fact links the DK OCR text instead

### Model and claims (10)

| ID | Finding | Outcome |
|---|---|---|
| R2-M1 | The face band was inflated 14–18%: the tool read the level arms as torso. | Fixed: scored as drawn (above). The band is now 58–170. |
| R2-M2 | "Meet this test sooner" compared weight-based chart scores with lean drawn limit scores. | Fixed. Each chart figure's outline is scored the same way as the limit shapes, and the page compares those. For example, Arnold Schwarzenegger's outline is past the arms limit at about 32. |
| R2-M3 | "The width sits where their own girths put it" was false for most of the figures counted. | Fixed. Each card counts the figures drawn on their own published girths and names the template shapes the rest use. |
| R2-M4 | The target tool had a dead zone at 76–83, reported misses as successes, and misread outlines above 85. | Fixed. It solves on the drawn score, which is continuous, and every target tested from 15 to 900 is reached. The status gives the arm angle (and says when it is outside the 30–40° A-pose), and gives what the measuring tool reads, or that it cannot follow the arms. The copied JSON gives the drawing's girths (template × width factor), not the tool's chest reading with the arms in it. |
| R2-M5 | The comic giants' drawing checks were about 20 points high. | Fixed. The drawing check uses the drawn volume from `compute_limits.js`. The giants are now −7% to −1%. |
| R2-m1 | The steep face factor 1.786 was taken relative to the median soldier, but the fit's reference is normal-BMI men. | Fixed. It is derived from the fact: k = 1.785 at 100°, on the median soldier's drawn arm and forearm girths at 1.80 m. That gives width × 1.60, scoring about 58. A test pins it to the fact's numbers. |
| R2-m2 | The front/back landmark check failed on an exact mirror image, because flat profiles flip their narrowest row. | Fixed. Rows that differ still agree if the back view is as narrow at the front's row (within 2 px or 1%). The crotch is found on 3 of 5 midline columns. Tested on the three reported cases plus the median soldier. |
| R2-m3 | The face card's "none meets this test" is true only under contact geometry. | Fixed. "By contact geometry, none … By the steep fit, 11 are: …" |
| R2-m4 | The side-view check rejected Rex's real side view when his tail was not masked. | Fixed. The hip row is skipped when the crotch is not found, with a note instead. Rex now gets the note, not a rejection. |
| R2-m5 | A sentence in "What this ignores" started in lower case. | Fixed. |

### UX (10)

| ID | Finding | Outcome |
|---|---|---|
| UX2-1 | Loading a new sheet mid-measurement showed the old sheet's results under the new name. | Fixed. A new sheet stops the running measurement and clears the results. |
| UX2-2 | Fields edited mid-measurement were not marked stale. | Fixed. The result is flagged when the fields differ from the ones measured. Tested in `shots.js`. |
| UX2-3 | "Meet this test" reads as "pass this test", and the counts differed without saying why. | Fixed. The page now says "already past this limit", with counts on one basis. "The drawn body" is glossed and linked to the limits. |
| UX2-4 | In Real heights mode the lineup still said "drawn at the same height". | Fixed. The sentence follows the mode. |
| UX2-5 | The face card shrank its figure below the skull line. | Fixed. All limit cards share one scale, set by the widest figure. |
| UX2-6 | The locator's accessible name said "920 to 924" and dropped "empty". | Fixed. One string for the line and its name. |
| UX2-7 | Status lines were not announced. | Fixed. `aria-live` on the tool, target and validation lines; the elapsed-time counter is not announced. |
| UX2-8 | The hidden file input showed as a second button to screen readers. | Fixed (`aria-hidden`). |
| UX2-9 | Sheet view captions ran together on phones. | Fixed. They wrap with gaps. |
| UX2-10 | Broken-image icons showed before the first target outline. | Fixed. Hidden until drawn. |

### Code (9)

| ID | Finding | Outcome |
|---|---|---|
| C2-1 | The tool dropped near-level arms without a warning. | Fixed (above). Tests check that the score has no jump across width factors 1.70–1.80, and that level arms are refused. |
| C2-2 | The front/back check rejected mirror images. | Fixed (R2-m2). |
| C2-3 | A measurement still running when a new sheet loaded landed on the new sheet. | Fixed (UX2-1). |
| C2-4 | The example-sheet note blamed the wrong cause. | Fixed (R2-FIX-01). |
| C2-5 | The solver treated a failing sheet inside the bracket as above target and returned a 10.8% miss as success. | Fixed. A failure is retried just beside it, and the solver gives up ("fails") rather than guess. It never returns a miss: it reports "gap" when the score jumps across the target. Tests cover a failing hole and a jump. |
| C2-6 | Two quick measurements ran two timers, and the new job queued behind the old one. | Fixed. One timer; a new job terminates a worker that is still running. |
| C2-7 | The Luke Cage quote was garbled OCR, and the Abomination quote stopped before the claim. | Fixed (R2-FIX-10). The Abomination quote now includes "over 800 pounds of bone marrow and muscle tissue". |
| C2-8 | No test saw the worker path, and an arms-flag assertion could not fail. | Fixed. `shots.js` fails if the measurement did not run in the worker. The thighs and face flags are recomputed independently. The face limit is re-measured. |
| C2-9 | round1.md overstated the crop speed-up. | Fixed (R2-FIX-09). |

The build also gained a guard: `build.js` refuses to write a page whose inline scripts do not parse. This was added after a quoting slip during these fixes left the page blank. `shots.js` caught it, but the build should have.

## Still open

- **The tool reads raised arms high.** It counts each arm at torso depth where it meets the shoulder: about 4% high at 35° and about 20% near level. The page's own figures avoid this by scoring arms as limbs, but a user's sheet gets the tool's reading as it stands.
- **The tool cannot follow arms that cannot hang clear of the body** (rest angle near 90°; above about 100 on the median soldier). It refuses such sheets. The target tool still draws those outlines, scores them as drawn, and says plainly that the tool cannot check art drawn from them. Measuring gap fillers in the 88–130 and 220–924 stretches will need a tool change in Step 2, for example cutting the arms at the shoulder line.
- **A 2,000 px sheet takes about 10 s to measure.** It runs in the worker, so the page stays responsive.

## After the fixes

- `node test/test.js`: 33 passed.
- `node test/duo.js`: Rex 2.54 m³, inside 2.52–2.60.
- `node test/shots.js`: no problems at 390 and 1280 px, light and dark. That covers the tablet sweep, the worker check, the 924 tap, mid-measurement edits and the target outlines.
- The Build Calculator's tests and shots pass.
