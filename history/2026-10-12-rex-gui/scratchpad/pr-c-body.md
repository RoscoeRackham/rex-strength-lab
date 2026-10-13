Section 6 of `rex-strength-lab/BRIEF-gui.md`: more points of comparison for energy, research first. Pull request C of three (A #20 and B #22 are merged).

## What changed

**The ladder.** Energies are now compared with **58 sourced reference energies**, up from 11.
- It runs from the energy to lift a 100 g apple one metre (about 1 J) to GW150914, the first black-hole collision ever detected (about 5 × 10⁴⁷ J).
- Neighbouring rungs are never more than 100× apart. `build-data.py` refuses to build otherwise.
- The widest steps are 70× (a year of sunlight to the Sun's output for a second) and 33× (Hiroshima to Chelyabinsk; a day of sunlight to the dinosaur-killer).

**The display rule** (`src/ladder.js`, wording only, no physics):
- The page names the nearest rung on a log scale.
  - Above that rung it gives a multiple, at most about 10×. Below it, a share, at least about 10%. Two figures either way.
  - Within 15% of a rung it says "about the same as".
- A rung uncertain by more than 2× gets "roughly" and one figure ("roughly 3×"), or "roughly the same as" within 1.5×. Ten rungs are rough.
- Past either end it says "beyond the ladder" and names the end rung, with no number.
- The old asteroid special case is gone; this rule covers it.

**The research** (`research/final-energy.json`, 140 facts; record in `research/reviews/gui-c-research.json`):
- Seven topics: an audit of the eleven old rungs, then six energy bands.
- Each topic was researched, then checked by a skeptic who fetched every cited source (157 URLs) and recomputed every derived number. The skeptics checked 154 facts and marked 33 wrong or mislabelled; all 33 were corrected.
- The audit changed three old rungs:
  - The grenade drops from 1.0 to 0.93 MJ: the filler's measured heat of detonation (LLNL handbook, checked on the page image). The old figure was a ballistic-mortar TNT equivalence.
  - Krakatoa drops from 200 to 125 Mt: the middle of the one refereed estimate with a stated method, from its air wave.
  - The dinosaur-killer rises from 4.2 × 10²³ to 5 × 10²³ J (Morgan et al. 2022).
- Hiroshima, Castle Bravo, the Tsar Bomba and Earth's binding energy now rest on primary sources. Earth's binding energy is integrated from the PREM paper's density model.

**On the page:**
- The Compared with tiles (Punch, Clap, Stomp), the Weight tab's energy tile, the catch and Collide texts all use the ladder.
- The Weight tab's dense-matter and Earth-falls sentences also use it now. They used to give multiples like "6.3 billion×" Earth's binding energy; now they say in words when the energy is more than enough to blow the Earth apart.
- A new "Energy comparisons" card explains the rule.
- The sources table has one row per rung: its status, all of its sources, and a plain value.
- The growth what-if notes for Krakatoa and the dinosaur-killer match the new values. Rough energies there are given to one figure.

**Tests:**
- `test/ladder.js` (new; added to CLAUDE.md's build line and CI) holds the brief's three tests:
  - every rung has a fact with a status and a web source, and appears in the sources table;
  - every energy from the bottom rung to the top one, in steps of a fiftieth of a decade, gets at most 10× or at least 10%, worded exactly as the rule (restated independently in the test) says;
  - rough wording for exactly the uncertain rungs.
  - It also has hand-pinned cases, beyond-the-ladder at both ends, and plain notation in the sources rows.
- `test/shots.js` has a section 6 block. It runs Punch, Clap and Stomp all-out from 10 kg to 10³⁴ kg (23 wordings, rough ones included) and checks each tile is the ladder's wording for the energy beside it. It also scans the Weight tab and the growth what-if, and checks the sources table lists every rung.

## How it was tested

- The full Rex lab line passes: calibration, presence (383 checks), shots (390 and 1280 px, light and dark), powers (122) and ladder (562). Generated files are rebuilt from source.
- Review rounds, each finding reproduced or refuted by a skeptic with its own script or fetch:
  - **Round 1** (six lenses: brief; the sources of the low, middle and high rungs, every source fetched again; code and tests; copy and layout): 29 findings, 24 confirmed and fixed, 5 refuted (`research/reviews/gui-c-round1.json`).
  - **Round 2** (four lenses, checking round 1's fixes: brief; the sources changed in round 1, every rewritten value checked against its fact; code and tests; copy and layout): 19 findings, 18 confirmed and fixed, 1 refuted (`gui-c-round2.json`).
  - **Round 3** (two lenses: each of round 2's fixes checked with its test reverted in a scratch copy; a fresh read of the whole change): 11 findings, 9 confirmed and fixed, 2 refuted (`gui-c-round3.json`). All of round 3's findings were minor: wording, rounding, research notes and test strength. No defect in the ladder's rule or its numbers was left open.

## Decisions (where the brief was unclear, or I chose)

1. **Display rule.** src/ladder.js names the nearest rung on a log scale. Above it the page gives a multiple (2 figures), below it a share (2 figures). Rungs are never more than 100x apart (build-data.py asserts it), so the multiple is at most 10x and the share at least 10%. Within 15% of a firm rung: 'about the same as'. A rough rung gets 1 figure and 'roughly', and 'roughly the same as' within 1.5x. Past either end: 'beyond the ladder', naming the end rung, with no number. Energies within the 'same' band just outside an end rung still count as on the ladder.
2. **Rough rungs.** A rung is rough when its fact's range runs more than 2x from its value (lightning, Beirut, Chicxulub, the nova, the magnetar flare, supernova light, SN 1998bw), or when the fact says so with its reason (field rough): Krakatoa (its own range is the one refereed estimate with a stated method, but published figures span about 60x), an average hurricane's heat (an illustrative figure with no stated range; storms differ by a factor of a few) and a supernova's blast (typical value known to about 2x, but ordinary events span about 10x; review round 1).
3. **Grenade: Comp B Grade A.** The explosive topic said LLNL's handbook has no measured heat of detonation for Comp B Grade A and used Comp B-3 instead (0.89 MJ). The audit cited the 1981 edition (UCRL-52997, OSTI 6530310), Table 5-2, p. 5-7. Checked on the page image (PDF p. 56): 'Comp B, Grade A', experimental, H2O(l): 1.20 kcal/g (5.02 MJ/kg), 25 C, 8.47 mm charge, density 1.69. The audit is right: the grenade is 0.184 kg x 5.02 MJ/kg = 0.925 MJ. The explosive topic's grenade and Comp B-3 facts are dropped.
4. **Duplicates across topics.** Hiroshima, Castle Bravo and Earth's binding energy: the audit's versions (Earth's integrates the original PREM paper; the planetary one used a code transcription of it). Facts shared by the planetary and stellar topics (Jupiter's mass and orbital speed, Earth's orbital speed and motion, the Sun's year and century): the planetary versions; they differ from the stellar ones by under 0.1%. Small's pitch and Corolla facts duplicate the audit's: the audit's keys are kept.
5. **Facts kept in their own files.** fastest_baseball_pitch (final-humans.json), baseball_mass and toyota_corolla_curb_mass (final-objects.json) are updated in place with the audit's versions, keeping their categories. The twelve old energy facts move from final-environment.json to final-energy.json in the audit's versions. Tunguska and the xkcd baseball stay in final-environment.json, unchanged (not rungs). build-data.py now fails if a key is in two research files.
6. **Pitch wording.** The audit found that 'at release' is our inference for Chapman's 2010 pitch (MLB lists 105.8 mph; Statcast measures at release, but this pitch was tracked by PITCHf/x). The Fastest pitch card now says '47.3 m/s, the ball speed MLB lists. The lab takes it as the speed leaving the hand.'
7. **Rung choice.** 58 rungs from the energy to lift a 100 g apple one metre (0.99 J) to GW150914 (5.4e47 J). Widest steps: a year of sunlight to the Sun's second (70x), Hiroshima to Chelyabinsk (33x), a day of sunlight to Chicxulub (33x), a day of world energy use to a hurricane's day (28x). Left out as redundant (within 2x of a kept rung, or covering a decade already covered): badminton, the 9 mm and .50-calibre bullets, a Corolla at 50 km/h, Tianjin (Beirut kept: better known), Halifax (the ISS kept: within 4%, better constrained), the Sedan test (obscure), a magnitude-7 quake (an estimate), Mount St Helens, Tunguska, the two earthquakes, a hurricane's wind, Tambora (a magazine figure), Earth's internal heat, Vredefort, the 2003 solar flare, the Sun's minute, the Moon's binding energy, the Moon-forming impact, Saturn's motion, Jupiter's binding energy, the Sun's million years and GW190521. The blast of SN 1998bw is kept, rough (its kinetic energy; the phrase says so since review round 2), because without it the step from Jupiter's mass-energy to a supernova's total energy is 176x.
8. **Top of the ladder.** The page compares energies up to about 1.5e44 J: the Weight tab's dense-matter sentence just short of a black hole at the largest height, 500 m (about 9e41 J at his own height). Collide reaches about 4e40 J with two partners whose combined mass is just under the planet-reshaping limit (1/1,000 of Earth's mass), and about 5e42 J with one partner made truly immovable (the other's whole kinetic energy freed), both at the top speed setting, and the Weight tab's Energy released tile stops near 4e34 J at his height and 6e36 J at 500 m, where he becomes a black hole. The ladder runs on to the first black-hole collision detected (5.4e47 J) so that it ends at a well-measured event and still holds if the page's reach grows; no page energy reaches the rungs above Jupiter's mass-energy (1.7e44 J) today. Above the top rung the page says the energy is beyond the ladder. (Corrected in review rounds 1 to 3, which measured these reaches.)
9. **Growth what-if.** Krakatoa and the dinosaur-killer use the ladder's values: 125 Mt (5.2e17 J, the middle of the one refereed estimate with a stated method, from the air wave) instead of the popular 200 Mt, and 5e23 J (Morgan et al. 2022) instead of the brief's 4.2e23 J. The notes under the what-if say so. The engine tests that use 8.4e17 and 4.2e23 J pass those numbers in directly and are unchanged.
10. **Saved-state comparisons.** `test/shots.js` compares saved states with main's page before the reorganisation. The energy comparisons (old and new wording) are set aside there, since section 6 rewrote them; the ladder has its own checks.
11. **Tests in a new file.** The brief's three tests are in `test/ladder.js`, added to CLAUDE.md's build line and CI (one line each, inside the claim), plus a page block in `test/shots.js`.
12. **The Weight tab's older comparisons.** Its dense-matter and Earth-falls sentences compared energies with Earth's binding energy as huge multiples or tiny shares. Section 6's rule covers every comparison, so they now use the ladder and say in words when the energy is more than enough to blow the Earth apart.
13. **Rough numbers stay rough.** Where a rough rung sets another number, the page says so. The growth what-if gives the energy and the mass it makes to one figure, and the height and density it changes to two. It then says every figure after that is rough too. The dinosaur-killer milestone on the strength dial is given as about one figure, with a note that it could sit up to about 30× higher.
14. **Growth worked examples.** The sources-table rows for the growth what-if lead with the ladder's energies, recomputed with the engine. Two harder worked examples say they use the brief's 4.2 × 10²³ J.

## What this needs from you

- Merge when CI is green. After the merge I'll rebuild and republish the live page.
- Nothing on canon.
- One editorial point, your call: the brief's candidates included recent disasters, and Beirut 2020 is now a rung. A review lens asked whether a deadly explosion belongs beside Rex's clap; its skeptic judged it the brief's own choice. If you'd rather the ladder avoid it, I'll drop Beirut. The step from Hubble's motion in orbit to the ISS's would then be 36×, still within the rule.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01Uj6G3iasxRWVsuqr1BAzrS
