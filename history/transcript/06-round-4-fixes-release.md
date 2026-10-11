# Round 4 fixes and release

2026-10-10 04:22:29 UTC to 2026-10-10 07:11:33 UTC. 11 assistant events, 2 commit events, 2 subagent events, 25 tool call events, 4 wakeup events.

The round-4 fixes landed, a final leftover-fix round updated the text for the 10 ft bodies, the sweeps passed, and the Rex lab was committed, pushed and republished.


- `TaskUpdate` #14 status=completed
- `Bash` Check Rex fix workflow progress: `python3 -c "` (+10 lines)

**Claude · 2026-10-10 04:22:47 UTC**

The build calculator is live and committed: https://claude.ai/artifact/9aKMVmtGqXXT2kGMYvZb5E

**What it does:**
- Pick a build and a height. You get weight plus chest, waist, flexed arm, forearm, thigh, calf and neck, in imperial or metric.
- Each number is tagged measured, official, reported, derived or estimate.
- It also shows BMI and FFMI, a body diagram, and comparison bars against an average man.
- Reverse mode estimates weight from girths you type in, two ways. On the US Army survey data it's accurate to about 1.6 kg.
- Characters beyond the measured human range get a warning. That covers most comic characters, Rex and Ollie. A switch can hide those girths instead.

**55 builds:**
- US Army soldiers and US adults
- natural and pro bodybuilders
- strongmen
- 21 comic characters
- Rex and Ollie

**Rex and Ollie, from the picture:**

| | Chest | Waist | Upper arm | Thigh | Calf |
|---|---|---|---|---|---|
| Rex | 3.45 m (136 in) | 2.59 m | 1.90 m | 1.92 m | 2.00 m |
| Ollie | 3.69 m | 3.50 m | 1.75 m | 1.99 m | 2.08 m |

- The chests probably read about 12% low. The same method undershoots on real soldiers.
- In the calculator, Ollie is listed at 3.06 m to his horn tips, the picture measurement. The Rex lab rounds him to 10 ft. Both are within measuring error.

**Checks:**
- 22 of 22 tests pass. They re-derive the survey statistics from the raw data.
- 31 audit findings fixed.
- Rex and Ollie now show as male, not "sex not stated". Rex is now a dinosaur build, not a lizard build.

**Committed:** `build-calculator/` in lodge-docs, commit 4a03723, pushed to `claude/dinosaur-strength-physics-8o13ft`. The page is private until you share it from its Share menu.

**Rex lab fixes:** 39 of 42 fixed so far, tests passing:
- weight tab: 15 of 15
- catch: 13 of 16
- collide and wrestle: 11 of 11

The last batch, arm wrestle and the remaining items, is running. After it, two reviewers re-check all 54 findings.

**Next:** when that finishes, I'll update the Rex lab descriptions for the 10 ft, 2,700 kg bodies, rerun every test and sweep, commit, push and republish.


*Woken · 2026-10-10 05:06:50 UTC · Background task wp080g0ba completed: Dynamic workflow "Fix the 54 confirmed audit findings in four serial batches (density/weight, catch, collide/wrestle, arm/duo/misc), then re-verify every finding on the final build" completed. Next: The audit-fix round is done: 49 of 54 findings are confirmed fixed and all 106 calibration checks pass. Fixed (the important ones): 1.*


- `Bash` Summarise fix reports and re-verification: `cd /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387 && python3 - <<'EOF'` (+17 lines)
- `Workflow` rex-final-fixes: Fix the leftovers from the audit re-verification and update the Rex lab text for the new 10 ft picture-based bodies, then re-verify
  - run `wf_47795ee8-097`: 2 subagents, listed below

<details>
<summary>Subagent `fix` (rex-final-fixes, 2026-10-10 05:08:13 UTC): Returned items: 11 (e.g. 1. p5 catch stroke time; 2. u3 'comes back up up to').</summary>

Workflow run `wf_47795ee8-097`, phase `Fix`, agent `a20d5d306d9b6b47a`. Prompt, verbatim:

```text
Project: "Rex Super-Strength Lab" at /home/user/dino-strength-sim (src/engine.js physics, src/app.html page, src/static-data.js assumption cards, research/final-*.json sourced facts turned into src/data.js by build-data.py, test/calibration.js tests, README.md).
Build and test: cd /home/user/dino-strength-sim && python3 build-data.py && node build.js && node test/shots.js && node test/calibration.js (must end "all checks passed", about 75-100 s).
Render a page state and dump its text: node /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/weightshot.js '[["name",1280,{STATE}]]' (state keys: DEFAULTS in src/app.html; screenshots in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/).
Context files: the re-verification of the last fix round is in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/fix-results.json (key "verify": two reviewers' items, regression notes and newIssues). The original findings are in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit-final.json. The picture-based body estimate is in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/mass/final.json (key "check" has the reconciled numbers and reasoning; "estimates" has the three methods).
Style for page text: plain, short sentences; every number sourced or labelled an estimate. Rex and Ollie are equally strong and equally indestructible; Ollie is a bull-man with horns, nose ring, earrings, vest, cargo pants and boots (no claws); both are male. Do not change the BUILDS / DEFAULT_BODIES numbers in src/engine.js. Do not commit or push.

ITEMS TO FIX (in order):
1. p5, catch stroke time. For lobs the reported stroke time and round trip are wrong (default lob says 14.5 s per catch, round trip about 33 s). Physics: after first contact his hands carry it at v1; with the minimum force the stroke takes 2d/v1, which for a light object is minutes because he can take as long as he likes. Make the model honest: report the catch itself as over at first contact (about 2 x give / v) for light objects, say bringing it to his chest takes as long as he likes, and leave the arm stroke out of the round trip whenever he has spare strength (state that the round trip counts the throws and flights). For heavy objects where the stroke is forced (he slides, or uses most of his strength), keep a physical stroke time t = v1 / a_net with a_net = (F - m g sin(angle) - m * inStroke / d) / (m + m_h) as appropriate. Replace the tautological calibration check with one that checks impulse: F_net * t equals the momentum removed, for a lob and a fastball.
2. u3 regression: the Weight tab's per-trip bullet reads "comes back up up to X short". Fix the wording everywhere shortText is used.
3. u9(c): the slip bullet "It comes down steeply..." fires on level arrivals. Gate it on the arrival angle (for example above 10 degrees), not on F sin(angle).
4. u13 leftover: the Weight chip "His gravity: N of Earth's at his skin" prints "95,000,000,000". Use the page's big-number formatting, e.g. "9.5 × 10¹⁰ × Earth's".
5. Drift after swinging through the centre (u8/p7/d12 notes): fallThrough stuck.driftKm uses an unwrapped longitude times r, which is meaningless when he swings through the centre before sticking (White dwarf preset: "159 km west of straight down" at r = 45 km). Wrap the angle; when the stop point is on the far side of the centre from where he went in (wrapped angle beyond 90 degrees), say "stops X km from the centre, past it on the far side" instead of an east/west drift; otherwise give the arc length at the stop radius. Fix the caption and bullet.
6. d2 note: between about 4 × 10¹⁴ kg/m³ (neutron drip) and nuclear density the caveat still says electrons hold the matter up. Below neutron drip keep the electron sentence; from neutron drip to nuclear density say squeezed matter there is neutron-rich nuclei in a sea of free neutrons, as in a neutron star's inner crust (add a sourced fact for the neutron-drip density, e.g. Chamel & Haensel, Living Reviews in Relativity 2008; read the number you cite).
7. p6 leftovers: in the 'reshapes' and heavier regimes (he sinks to the centre), hide or reword the Bondi 'air falls onto him' paragraph, the foot-pressure tile and the surface rCrush math line, which assume he sits at the surface.
8. u10 note: when the arm-wrestle verdict says someone can't hold his forearm up (or they can't contest), don't show contest tiles (pushing force, time to pin, twist) that imply a contest happened. Same pattern check in Wrestle.
9. r6 leftover: the partner toss says "tosses Ollie 2.74 m up" where 2.74 m is release height; report height above the release point (apex − release height) and say so. r11: don't print catch notes for a toss that never happens.
10. p2/d13 wording: "Ollie's arm is stronger (222 kN)" should say stronger than what Rex's footing lets him push (or similar), with the number that is actually being compared.
11. NEW 10 FT BODIES. Rex's default is now 10 ft (3.048 m) and 2,700 kg; Ollie's is 10 ft and 2,700 kg (he measures 3.06 m to his horn tips, within measuring error). Builds come from their reference picture: volume 2.55 m³ each, density 1,060 kg/m³ (lean bodybuilders, Fry, Cisar & Housh 1987, less some lung air), facing area 4.4 m² (Rex, tail trailing) and 4.5 m² (Ollie), one foot's sole 0.31 m² (Rex's paws) and 0.15 m² (Ollie's boots); plausible mass range 2,300-3,000 kg. The 2 m, 180 kg body is now only the calibration body (a size chip). Do all of:
 a. Add research facts (research/final-duo.json): rex_ollie_picture_build (method summary from /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/mass/final.json: scale 790 px = 3.048 m, slice-by-slice ellipses with ANSUR-based depth ratios, both arms from the visible one, hidden tail base; values and range; status estimate) and density_bodybuilders_fry1987 (fetch and read the source the checker cites; status as verified by you).
 b. build-data.py densities: the Water chip is no longer the default (label "Water", note about water at 4 °C); add a chip "His build (default)" at 1,060 kg/m³ with the new facts as keys and a note "The default Rex and Ollie: 10 ft, about 2,700 kg, measured from their picture".
 c. src/static-data.js cards: "Rex's body" (10 ft, 2,700 kg from his picture; Ollie the same; the 2 m 180 kg calibration body; foot and palm areas), "Two muscle models, one calibration" (the calibration uses the 2 m, 180 kg calibration body, not the default Rex), "Density and weight" (volume from his picture: 2.55 m³ at 10 ft, scaling with height cubed), "His own gravity" (ball of his volume: about 85 cm radius at 10 ft; compute it), and any other card or page text that still says the default Rex is 2 m or 180 kg. Grep the page and cards for "2 m", "180 kg", "0.18 m³", "35 cm".
 d. README.md: describe the new defaults, the picture-based estimate, the art on the page, the calibration body chip, and update test timings.
 e. Make sure the Weight tab's math line shows the build volume coefficient correctly and nothing on the default page still assumes 2 m.
After all items: rebuild, run calibration (all checks passed), run node /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/check2.js (browser sweep of 1,512 states; must report bad 0 and errors []) and fix anything it finds. Report per item what you changed and how you verified it.
```

</details>

<details>
<summary>Subagent `verify` (rex-final-fixes, 2026-10-10 06:16:09 UTC): All 11 items hold on the current build. The issues below are new or leftover and mostly minor; none blocks. Returned items: 18 (e.g. Rebuild and calibration; Default state of every tab (13 tabs x 390/1280 x light/dark = 52 renders)).</summary>

Workflow run `wf_47795ee8-097`, phase `Verify`, agent `ae540eacb709e6e09`. Prompt, verbatim:

```text
Project: "Rex Super-Strength Lab" at /home/user/dino-strength-sim (src/engine.js physics, src/app.html page, src/static-data.js assumption cards, research/final-*.json sourced facts turned into src/data.js by build-data.py, test/calibration.js tests, README.md).
Build and test: cd /home/user/dino-strength-sim && python3 build-data.py && node build.js && node test/shots.js && node test/calibration.js (must end "all checks passed", about 75-100 s).
Render a page state and dump its text: node /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/weightshot.js '[["name",1280,{STATE}]]' (state keys: DEFAULTS in src/app.html; screenshots in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/).
Context files: the re-verification of the last fix round is in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/fix-results.json (key "verify": two reviewers' items, regression notes and newIssues). The original findings are in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit-final.json. The picture-based body estimate is in /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/mass/final.json (key "check" has the reconciled numbers and reasoning; "estimates" has the three methods).
Style for page text: plain, short sentences; every number sourced or labelled an estimate. Rex and Ollie are equally strong and equally indestructible; Ollie is a bull-man with horns, nose ring, earrings, vest, cargo pants and boots (no claws); both are male. Do not change the BUILDS / DEFAULT_BODIES numbers in src/engine.js. Do not commit or push.

You are a SKEPTICAL VERIFIER: do not edit project files (scratch only under /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/final-verify/). Rebuild once, then check each item below on the current build by reproducing it (page renders and node snippets), including the 10 ft defaults on every tab at 390 and 1280 px, light and dark. Also skim the default state of every tab for anything that still assumes the old 2 m, 180 kg Rex or that contradicts itself. Report ok/not ok per item with evidence, and any new issues.

ITEMS TO FIX (in order):
1. p5, catch stroke time. For lobs the reported stroke time and round trip are wrong (default lob says 14.5 s per catch, round trip about 33 s). Physics: after first contact his hands carry it at v1; with the minimum force the stroke takes 2d/v1, which for a light object is minutes because he can take as long as he likes. Make the model honest: report the catch itself as over at first contact (about 2 x give / v) for light objects, say bringing it to his chest takes as long as he likes, and leave the arm stroke out of the round trip whenever he has spare strength (state that the round trip counts the throws and flights). For heavy objects where the stroke is forced (he slides, or uses most of his strength), keep a physical stroke time t = v1 / a_net with a_net = (F - m g sin(angle) - m * inStroke / d) / (m + m_h) as appropriate. Replace the tautological calibration check with one that checks impulse: F_net * t equals the momentum removed, for a lob and a fastball.
2. u3 regression: the Weight tab's per-trip bullet reads "comes back up up to X short". Fix the wording everywhere shortText is used.
3. u9(c): the slip bullet "It comes down steeply..." fires on level arrivals. Gate it on the arrival angle (for example above 10 degrees), not on F sin(angle).
4. u13 leftover: the Weight chip "His gravity: N of Earth's at his skin" prints "95,000,000,000". Use the page's big-number formatting, e.g. "9.5 × 10¹⁰ × Earth's".
5. Drift after swinging through the centre (u8/p7/d12 notes): fallThrough stuck.driftKm uses an unwrapped longitude times r, which is meaningless when he swings through the centre before sticking (White dwarf preset: "159 km west of straight down" at r = 45 km). Wrap the angle; when the stop point is on the far side of the centre from where he went in (wrapped angle beyond 90 degrees), say "stops X km from the centre, past it on the far side" instead of an east/west drift; otherwise give the arc length at the stop radius. Fix the caption and bullet.
6. d2 note: between about 4 × 10¹⁴ kg/m³ (neutron drip) and nuclear density the caveat still says electrons hold the matter up. Below neutron drip keep the electron sentence; from neutron drip to nuclear density say squeezed matter there is neutron-rich nuclei in a sea of free neutrons, as in a neutron star's inner crust (add a sourced fact for the neutron-drip density, e.g. Chamel & Haensel, Living Reviews in Relativity 2008; read the number you cite).
7. p6 leftovers: in the 'reshapes' and heavier regimes (he sinks to the centre), hide or reword the Bondi 'air falls onto him' paragraph, the foot-pressure tile and the surface rCrush math line, which assume he sits at the surface.
8. u10 note: when the arm-wrestle verdict says someone can't hold his forearm up (or they can't contest), don't show contest tiles (pushing force, time to pin, twist) that imply a contest happened. Same pattern check in Wrestle.
9. r6 leftover: the partner toss says "tosses Ollie 2.74 m up" where 2.74 m is release height; report height above the release point (apex − release height) and say so. r11: don't print catch notes for a toss that never happens.
10. p2/d13 wording: "Ollie's arm is stronger (222 kN)" should say stronger than what Rex's footing lets him push (or similar), with the number that is actually being compared.
11. NEW 10 FT BODIES. Rex's default is now 10 ft (3.048 m) and 2,700 kg; Ollie's is 10 ft and 2,700 kg (he measures 3.06 m to his horn tips, within measuring error). Builds come from their reference picture: volume 2.55 m³ each, density 1,060 kg/m³ (lean bodybuilders, Fry, Cisar & Housh 1987, less some lung air), facing area 4.4 m² (Rex, tail trailing) and 4.5 m² (Ollie), one foot's sole 0.31 m² (Rex's paws) and 0.15 m² (Ollie's boots); plausible mass range 2,300-3,000 kg. The 2 m, 180 kg body is now only the calibration body (a size chip). Do all of:
 a. Add research facts (research/final-duo.json): rex_ollie_picture_build (method summary from /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/mass/final.json: scale 790 px = 3.048 m, slice-by-slice ellipses with ANSUR-based depth ratios, both arms from the visible one, hidden tail base; values and range; status estimate) and density_bodybuilders_fry1987 (fetch and read the source the checker cites; status as verified by you).
 b. build-data.py densities: the Water chip is no longer the default (label "Water", note about water at 4 °C); add a chip "His build (default)" at 1,060 kg/m³ with the new facts as keys and a note "The default Rex and Ollie: 10 ft, about 2,700 kg, measured from their picture".
 c. src/static-data.js cards: "Rex's body" (10 ft, 2,700 kg from his picture; Ollie the same; the 2 m 180 kg calibration body; foot and palm areas), "Two muscle models, one calibration" (the calibration uses the 2 m, 180 kg calibration body, not the default Rex), "Density and weight" (volume from his picture: 2.55 m³ at 10 ft, scaling with height cubed), "His own gravity" (ball of his volume: about 85 cm radius at 10 ft; compute it), and any other card or page text that still says the default Rex is 2 m or 180 kg. Grep the page and cards for "2 m", "180 kg", "0.18 m³", "35 cm".
 d. README.md: describe the new defaults, the picture-based estimate, the art on the page, the calibration body chip, and update test timings.
 e. Make sure the Weight tab's math line shows the build volume coefficient correctly and nothing on the default page still assumes 2 m.
After all items: rebuild, run calibration (all checks passed), run node /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/a3/check2.js (browser sweep of 1,512 states; must report bad 0 and errors []) and fix anything it finds. Report per item what you changed and how you verified it.

FIXER REPORT:
{
 "items": [
  {
   "item": "1. p5 catch stroke time",
   "status": "fixed",
   "change": "src/engine.js catchIt: the stroke time at the stated arm force is now t = (v1 - vSlam)/a_net, with a_net = (F - m g sin(angle) - m*inStroke/d)/(m + m_h) + aC (aC is his own slide). At the least force that works this is exactly 2d/v1. New outputs: forced (he slides, can't stop it, or F >= 0.5 x his strength), tContact (2 x give / v, low and high), Fpull and aNet. roundTrip counts an arm stroke only when it is forced. src/app.html: for light objects the bullet says the catch itself is over at first contact in tContact, and bringing it to his chest takes as long as he likes ('the gentlest steady push that does it, F, takes T'). The palms tile shows the contact time. The verdict and the Round trip tile say 'the throws and flights' (or 'throws, flights and catches' when a stroke is forced). The non-first-contact bullets give the time at the stated force. Stroke times use fmtDuration so very long ones read in years. Math line updated. test/calibration.js: the tautological check is replaced by impulse checks, (F - m g sin angle) x t = m v - (m + m_h) u, for a baseball lob (46.4 deg), a baseball fastball (0.0 deg) and a sliding car fastball. Also added: the default lob is unforced and its round trip = throws + flights; contact under 0.1 s; the sliding car fastball is forced.",
   "verified": "All 3 impulse ratios are 1 within 1e-6. Default Catch page: 'the catch itself is over in about 7.3 ms to 18 ms… the gentlest steady push that does it, 1.04 N, takes 2.99 min' (2d/v1 = 179 s, which is the reviewer's figure). Round trip is now 'about 4.04 s (the throws and flights)', was 33 s. Car lob: 50 kN, 260 ms, matching the reviewer's 0.255 s. Bowling-ball lob: 3.77 s."
  },
  {
   "item": "2. u3 'comes back up up to'",
   "status": "fixed",
   "change": "The shared shortText now says 'at most Y' instead of 'up to Y'. The per-trip bullet reads 'so he falls X short of the far side'.",
   "verified": "Neutron star chip at 10 ft: 'he coasts to a stop at most 53.5 m under the far side’s surface' and 'so he falls at most 53.5 m short of the far side'. At 1.5e15 kg: '371 m to 742 m'. My targeted page sweep (1,190 states) found no 'up up'."
  },
  {
   "item": "3. u9(c) slip bullet",
   "status": "fixed",
   "change": "The 'It comes down steeply…' prefix now fires only when the arrival angle is above 10 deg. It no longer depends on F sin(angle).",
   "verified": "Piano fastball at logKg 7 (arrives level) now reads 'He and the piano share the stopping, so his arms push 32.8 MN, which takes 5.2 ms.' The targeted sweep found no state that shows 'comes down steeply' next to a 'level' arrival tile."
  },
  {
   "item": "4. u13 gravity chip digits",
   "status": "fixed",
   "change": "New gText helper: '9.5 × 10¹⁰ × Earth’s' at 1e6 and up, 'N× Earth’s' at 1 and up, a percentage at 1% and up, otherwise scientific. The Weight chip is now 'His gravity at his skin: …', and the 'real but tiny' bullet uses the same helper.",
   "verified": "At m = 1e22 the chip reads 'His gravity at his skin: 9.5 × 10¹⁰ × Earth’s'. The sweep's check for long digit strings found 0 hits."
  },
  {
   "item": "5. Drift after swinging through the centre",
   "status": "fixed",
   "change": "Engine fallThrough: the longitude is wrapped to -180..180. stuck now has lonDeg, farSide (|lon| > 90), and passedCentre (the radial turnaround happened, or farSide). driftKm is 0 on the far side; otherwise it is the arc length at the stop radius. Page: the headline, cut-away caption and bullet say 'swings through the centre and stops … on the far side of it' / 'He stops X from the centre, past it on the far side.' For a swing through the centre and back they say so, then give the drift 'measured along his circle at that depth'. 'Weak rock lets him swing through the centre' now shows only when the main run did not swing.",
   "verified": "White dwarf preset (7.06e9 kg): wrapped angle 157.3°, 'stops in the inner core on the far side of it, about 44.9 km from the centre'; caption 'he stops past it, on the far side'. Was '159 km west'. At 5e10 kg: 'swings through the centre and back… 730 m west of straight down'. Was 33.8 km. New calibration checks: the WD preset is farSide with no drift, and any drift is at most a quarter circle."
  },
  {
   "item": "6. d2 neutron-drip caveat",
   "status": "fixed",
   "change": "Added fact neutron_drip_density (research/final-density.json, verified). I read Chamel & Haensel 2008, Living Rev. Relativ. 11:10, full text on PMC5255077. It gives ρND ≈ 4 × 10¹¹ g/cm³ and an inner crust up to ρ0/3 ≈ 10¹⁴ g/cm³ that 'is characterized by the presence of free neutrons'. Engine: W8.RHO_DRIP = 4e14 and RHO_CRUST_CORE = 1e17 (which the neutron-matter caveat and decompJ now use), plus a weight() innerCrust flag. Page: from 4e14 to 1e17 kg/m³ it says matter is 'neutron-rich nuclei in a sea of free neutrons, as in a neutron star’s inner crust'. Below 4e14 the electron sentence stays.",
   "verified": "At 1.5e15 kg (5.9e14 kg/m³) the page shows the inner-crust sentence. 5e10 kg keeps the white-dwarf electron sentence. Calibration: 1e14 gets neither, 1e15 is innerCrust, 2e17 gets the nmCaveat. A source row 'Weight: neutron drip density…' is added."
  },
  {
   "item": "7. p6 leftovers (reshapes and heavier)",
   "status": "fixed",
   "change": "These now show only when planet regime is 'none': the Bondi 'Air falls onto him' chip and paragraph, the 'Pressure under his feet' tile, and the Show-the-math lines for Bondi/rCrush, Feet and Bedrock.",
   "verified": "At m = 1e22 there is no Bondi chip or paragraph, no foot-pressure tile, and no rCrush, Feet or Bedrock math line. A 292-state Weight sweep (3 heights, 1e3 to 1e26 kg, comic ground on and off) found none of them in the reshape, Earth-falls or black-hole regimes."
  },
  {
   "item": "8. u10 contest tiles without a contest",
   "status": "fixed",
   "change": "Arm: when someone can't hold his forearm up, the tab now shows a 'No contest' chip, a forearm-weight tile, an arm-push tile, one bullet and a math line, then returns. No push, pin, twist, table or force-bar output. Wrestle pattern check: Push with both too heavy to get up now says 'No shoving match' and shows legs-vs-weight tiles, not 'dead heat at 15.9 kN'. A stalled Shove shows the shove force plus 'Nobody moves' (or their gravity), not '0 m/s' and '0 J' tiles. Lift and Throw already showed no contest tiles.",
   "verified": "oM 3e6: 'Ollie can’t even hold his forearm up (354 kN vs 222 kN)' with only those tiles. logKg 1.5 shove: no zero-speed tiles. logKg 2 push: the no-match verdict. The targeted sweep's 'contest tiles without contest' and 'zero-speed shove tile' checks found 0."
  },
  {
   "item": "9. r6/r11 partner toss",
   "status": "fixed",
   "change": "Engine tossPartner: hTarget is now the height above the release point, and a new out.rise = apex - release height. Page: 'Rex tosses Ollie X above where he lets go (his hands are 2.74 m off the ground)'. The tile is 'Height above his hands' and the slider label is 'Toss height above his hands'. Catch notes print only when there is a catch (t.catch).",
   "verified": "Default partner toss: 'Rex tosses Ollie 10 m above where he lets go'. Calibration: the easy toss rise is 10 m ± 0.01. The 'air stops him first' state shows no catch notes. The sweep's 'catch notes without catch' and 'old toss wording' checks found 0."
  },
  {
   "item": "10. p2/d13 'arm is stronger' wording",
   "status": "fixed",
   "change": "The drag verdict now compares the loser's arm with the push the winner actually makes: 'L’s arm (P) is stronger than that A push' / 'is just as strong as that A push'.",
   "verified": "With Ollie at 3,000 kg: 'Ollie can press only 17.7 kN, all his feet hold… Rex’s arm (222 kN) is stronger than that 17.7 kN push'. The sweep found no old wording."
  },
  {
   "item": "11. 10 ft bodies (a–e)",
   "status": "fixed",
   "change": "(a) research/final-duo.json gets rex_ollie_picture_build (estimate: method, values, 2,300–3,000 kg range, checks) and density_bodybuilders_fry1987 (verified). I fetched and read the BISp abstract: 1.0812 ± 0.0099 g/mL, 12 men, 81.24 kg, 8.48% fat, underwater weighing corrected for residual lung volume. Stale 'at 2 m' and '180 kg' fact displays are updated to 10 ft numbers: lever, dig area, ground tear 697 kN, gravity distances 1.69/1.91/2.29 m, stroke 91 cm, squash 0.85 m, run-up, anchor spacing, hand mass 119 kg, and the black-hole density 2.24e26 kg/m³. The Water and human-density notes are corrected. (b) build-data.py: the Water note now describes water at 4 °C. Added chip 'His build (default)' at 1,060 kg/m³, keyed to both new facts, with the requested note. It asserts the engine's BUILDS rho is 1060. Model rows now use 10 ft values. (c) static-data.js cards updated: Rex’s body, Two muscle models, Density and weight (2.55 m³ at 10 ft), His own gravity (about 85 cm; computed 0.847 m), Pushes (strokes as shares of height and at 10 ft), Rex and Ollie, Game of catch. (d) README.md did not exist in the project, so I created it from the older lodge-docs copy. It covers the defaults, the picture estimate, the art on the page, the calibration-body chip and measured timings. (e) The Weight math line shows kV as 0.08995 with '2.55 m³ at 10 ft'. Extra: the human-sized feats (deadlift, shot put, Bolt, C-17, Cap, DeSoto) now Simulate on the calibration body. On the 10 ft body Bolt's run said 'too weak to sprint'. I also fixed '100%' to 'nearly all' in the first-contact bullet and added earrings to Ollie's alt text.",
   "verified": "A new calibration check confirms the cards quote 8 engine-derived default-body numbers, and another confirms the 1,060 density chip. A grep of app.html, static-data.js and data.js finds '2 m', '180 kg', '0.18 m³' and '35 cm' only where they describe the calibration body. Default Weight page: 'Volume = 0.08995 × height³ (… 2.55 m³ at 10 ft) = 2.55 m³'. The 'His build (default)' chip renders as pressed at 390 px."
  }
 ],
 "calibration": "Full chain run: python3 build-data.py && node build.js && node test/shots.js && node test/calibration.js. It took 97 s, ended 'all checks passed' with 117 ok and 0 FAIL (was 106), and shots reported 0 overflow and no errors at 1280 light and 390 dark. test/sweep.js: 5,184 contexts, 0 problems, 4 min 52 s. Changes to test/calibration.js: the p5 check is replaced (impulse for the lob, fastball and sliding car, plus round-trip and forced-stroke checks). New checks cover the card numbers vs the engine, the build density, the WD far-side stop with no drift, drift no longer than a quarter circle, the neutron-drip thresholds, and the toss rise above the hands. One label changed from 'default Rex stands on loose sand' to 'calibration body…' because it uses the 2 m body.",
 "sweep": "Final run of node scratchpad/a3/check2.js on the last build: 'states 1512 bad 0 slow 0', errors [] (12.5 min). I also ran a targeted sweep for this round's wording (scratchpad/r4/tsweep.js and tsweep2.js): 1,190 Weight, Catch, partner, Arm and Wrestle states, checking for 'up up', long digit strings, broken values, 'comes down steeply' with a level arrival, surface text in the reshape regimes, east/west drift on the far side, contest tiles without a contest, zero-speed shove tiles, catch notes without a catch, and the old 'stronger' and toss wording. All 0, after I fixed a false positive in my own reshape check that matched the 'Black hole' density chip. No project files were committed. The backup is in scratchpad/r4/backup."
}
```

</details>

**Claude · 2026-10-10 05:08:20 UTC**

The audit-fix round is done: 49 of 54 findings are confirmed fixed and all 106 calibration checks pass.

**Fixed (the important ones):**
1. **Settling time:** a neutron-star Rex now settles at the Earth's centre in about 2,200 years (range 490 to 29,000), not 130. The per-trip energy dropped from trillions of tonnes of TNT to about a billion tonnes, with a magnitude 6.5 quake instead of 8.9.
2. **Relativistic catch blast:** it now counts the full energy released at Ollie, so it no longer shrinks as he stands closer.
3. **Contradictory tabs:** the three tabs that disagreed on the same unstoppable-force setup now agree.
4. **Crushed on contact:** a shot put crushed on contact is no longer "caught".
5. **Steep throws:** release speeds near vertical are no longer up to 190× too high.
6. **Ollie's claws:** his claws are gone from the collide text.

**One last fixer is working now** (then a re-checker):
1. Lob catches still report a meaningless stroke time, which makes the default round trip "about 33 s". After first contact Ollie can take as long as he likes to bring the ball in. The round trip will count only the throws and flights, and say so.
2. Side effects of the fixes: doubled wording, a "comes down steeply" line on level arrivals, and a gravity chip that prints "95,000,000,000".
3. Drift distances that are meaningless after Rex swings through the centre of the Earth.
4. Smaller wording leftovers.
5. **10 ft text updates:** the assumption cards, a "His build (default)" density chip, a sourced fact for the picture estimate, and the README.

**Left as a known limit:** a few long-distance catch lobs take 2–3 s to render. Shove went from 2.2 s to under 40 ms.

**Build Calculator:** live and committed.

**Next:** when the fixer and re-checker finish, I'll rerun the full engine sweep, copy everything to lodge-docs, commit, push and republish the Rex lab at the same link. Expect about an hour.


*Woken · 2026-10-10 06:50:25 UTC · Background task wrio42j44 completed: Dynamic workflow "Fix the leftovers from the audit re-verification and update the Rex lab text for the new 10 ft picture-based bodies, then re-verify" completed. Next: All tests pass. Spot-checking the changed text, then running the full sweeps in the background.*


- `Bash` Read final fix and verification results: `cd /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387 && python3 - <<'EOF'` (+11 lines)
- `Bash` Read remaining new issues and locate code: `cd /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387 && python3 -c "` (+2 lines)
- `Bash` Locate code for the remaining minor issues: `grep -n "skids\|barely slip" src/app.html | head -5; grep -n "'Where he stops'\|Where he stops\|At the poles there would be no drift" src/app.html | head -5;...`
- `Bash` Read context for caption and lift tiles: `sed -n 1426,1434p src/app.html | cut -c1-260; sed -n 1870,1886p src/app.html | cut -c1-200; grep -n "const pl = \|pl.regime" src/app.html | sed -n 1,6p`
- `Bash` Locate squash-depth text and other spots: `grep -n "smaller body’s depth\|depthOf\|equal-volume ball\|ball of equal volume" src/app.html src/engine.js src/static-data.js research/final-duo.json | cut ...`
- `Bash` Apply the eight small fixes: `python3 - <<'EOF'` (+46 lines)
- `Bash` Fix squash wording, sweep volume; rebuild and test: `sed -i "s/If they squash by a quarter of the smaller body’s depth (' + fmtDist(r.contact.s) + ' in all)/If they squash by a quarter of the smaller body’s thi...`

**Claude · 2026-10-10 06:53:25 UTC**

All tests pass. Spot-checking the changed text, then running the full sweeps in the background.


- `Bash` Spot-check changed page text: `S=/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad; WD=$(python3 -c "print(2.77e9*2.547)"); node $S/a3/weightshot.js '[["f-sprint",12...`

**Claude · 2026-10-10 06:53:42 UTC**

Text reads correctly. Starting the full sweeps.


- `Bash` Run engine and browser sweeps: `(node test/sweep.js 2>&1 | tail -3) > /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/sweep-final.out; node /tmp/claude-0/-home-user...`

**Claude · 2026-10-10 06:53:49 UTC**

While the sweeps run, syncing the Rex lab into lodge-docs.


- `Bash` Read updated README and research list: `cat README.md | head -80; ls research`
- `Bash` Copy Rex lab files and review records to lodge-docs: `set -e; L=/home/user/lodge-docs/rex-strength-lab; D=/home/user/dino-strength-sim; S=/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad` (+19 lines)
- `Bash` Write lodge-docs README with review history: `cd /home/user/lodge-docs/rex-strength-lab && cat .gitignore; python3 - <<'EOF'` (+15 lines)
- `TaskUpdate` #10 status=completed
- `TaskUpdate` #11 status=completed

**Claude · 2026-10-10 06:54:21 UTC**

Status: all fixes are in and calibration passes (117 of 117). The lodge-docs copy is staged, with a review-history section added to the README. The full engine sweep and browser sweep are running against the final build.

Commit, push and republish wait until both sweeps come back clean, since the README states their results. About 15 minutes.


*Stop hook · 2026-10-10 06:54:22 UTC: Stop hook feedback:
[~/.claude/stop-hook-git-check.sh]: There are uncommitted changes in the repository. Please commit and push these changes to the remote branch.*


- `Bash` Check sweep progress: `cat /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/tasks/b4b3a5nu3.output 2>/dev/null | tail -5; cat /tmp/claude-0/-home-user/6435a7db-fe21-5f...`

**Claude · 2026-10-10 06:54:32 UTC**

Committing now with only the verified result in the README. The sweep results go in a follow-up commit once the sweeps finish.


> **Commit** `64526fb` · 2026-10-10 06:54:40 UTC · Rex lab: density and weight, Ollie and two-player tests, 10 ft bodies  [made in lodge-docs as 64526fb; d9699e2 in rex-strength-lab after the move]


- `Bash` Commit and push Rex lab update: `python3 - <<'EOF'` (+28 lines)

**Claude · 2026-10-10 06:54:46 UTC**

Committed and pushed (64526fb). Republishing the Rex lab at its existing link.


- `Bash` Stage the Rex lab page for republishing: `ls -la /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/rex-strength-lab.html 2>&1; cp /home/user/dino-strength-sim/dist/index.html /...`
- `Artifact` publish https://claude.ai/artifact/YFpbHtX8tM2Qwffd6znbZP /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/rex-strength-lab.html

**Claude · 2026-10-10 06:55:04 UTC**

The Rex lab is updated at its existing link, now version 4: https://claude.ai/artifact/YFpbHtX8tM2Qwffd6znbZP

That link is set to "Anyone with the link", so whoever already has it sees the new version.

**What's new on the page:**
- **Rex and Ollie:** 10 ft and about 2,700 kg each, measured from your picture. The arm-wrestling, unstoppable-force and lifting-rig art and their faces are on the page.
- **Density and weight:** Rex can be anything from plush to black hole. For example, a neutron-star-dense 2 m Rex falls through the Earth, then takes about 2,200 years (490 to 29,000) to come to rest at the centre.
- **Two-player tests:** arm wrestling, wrestling, catch, and unstoppable force vs immovable object.
- **Final audit:** all 54 findings are fixed and re-checked, along with the issues those fixes caused. The calibration tests pass (117 of 117).

**Committed and pushed** to `claude/dinosaur-strength-physics-8o13ft`, no PR:
- `64526fb`: the Rex lab, with the review records in `rex-strength-lab/research/reviews/`.
- `4a03723`: the Build Calculator. It's at https://claude.ai/artifact/9aKMVmtGqXXT2kGMYvZb5E and is private until you share it.

**Still running:** the full engine sweep and the browser sweep against this exact build. The fixers' sweeps passed on the build before my last eight wording fixes. These re-runs check the final one. If both come back clean, I'll add that to the README in a small follow-up commit.

**Next for you:** open the Rex lab, go to Rex + Ollie → Catch, and try the Fastball.


*Woken · 2026-10-10 07:11:14 UTC · Background task b4b3a5nu3 completed: Background command "Run engine and browser sweeps" completed (exit code 0). Next: Both sweeps came back clean on the final build. Adding that to the README.*


- `Bash` Read final sweep results: `cat /tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/tasks/b4b3a5nu3.output | cut -c1-1500`

**Claude · 2026-10-10 07:11:19 UTC**

Both sweeps came back clean on the final build. Adding that to the README.


- `Bash` Commit and push sweep results to README: `python3 - <<'EOF'` (+16 lines)


> **Commit** `15f8d53` · 2026-10-10 07:11:24 UTC · Rex lab README: record the final sweep results  [made in lodge-docs as 15f8d53; 7107110 in rex-strength-lab after the move]


- `TaskUpdate` #9 status=completed

**Claude · 2026-10-10 07:11:33 UTC**

The final checks passed on the build that's live now:
- **Calibration tests:** 117 of 117 pass.
- **Engine sweep:** 5,184 combinations of settings, no problems.
- **Browser sweep:** 1,512 page states across every tab, with no broken text, slow renders or page errors.

The README records this. That's commit `15f8d53`, pushed to `claude/dinosaur-strength-physics-8o13ft`, and the working tree is clean.

**Links:**
- **Rex lab:** https://claude.ai/artifact/YFpbHtX8tM2Qwffd6znbZP (anyone with the link can open it)
- **Build Calculator:** https://claude.ai/artifact/9aKMVmtGqXXT2kGMYvZb5E (private until you share it)

**Next:** open the Rex lab, then Rex + Ollie → Catch → Fastball, to see what a 10 ft, 2,700 kg pitcher does to a baseball.

