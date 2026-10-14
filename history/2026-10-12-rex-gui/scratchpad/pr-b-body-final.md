Builds section 5 of `rex-strength-lab/BRIEF-gui.md`: their four powers, on by default. Pull request B of three (A, the page organisation, is #20).

## What changed

**The four powers** (Their powers panel; all on by default, as canon says):

- **Air resistance absorbed** (a slider, 0–100%, default 100%). The engine's flights feel only the share of the drag left (`dragFactor`). At 100% a throw flies the vacuum arc; past 1% of light speed it flies a straight line. The share taken back goes to the endless ocean, and the page reports it. Their own bodies still meet real air: with any power on, his hand's air past sound counts as a blast (decision 7).
- **Things keep their form.** Grip, launch, its own weight and the air can't break what they hold or throw. Landings and other collisions stay real.
- **Unbreakable footing.** The ground under them never breaks. The energy that would break it is taken back, but the push still goes in, so the ground shakes. Where the ground couldn't bear a push, it takes only what it can and their power supplies the rest; the page says how much (decision 16).
- **They take their own recoil.** The push back from his own throw, stomp, pull and shove goes through his feet into the planet. It shakes the ground there.

Comic ground, Gentle hold and Cool flight are retired. Old saves load with all four new powers on.

**Elsewhere:**

- Pushes into the ground (`toGround`) shake it, by the stomp's ground-wave model. Where the ground strains past the model's elastic range, the figures are flagged rough.
- The two-player tests get ground shaking, broken ground and the six not-so-heroic presets.
- Very fast throws use a relativistic snowplow and fly a straight line; the page states the gravity bend and where they go (the Earth, the solar system, the galaxy). The game of catch flies the straight chord between their hands; past about 12 km that chord runs underground, so the throw hits the ground.
- The lower-the-slider hint. It appears when an air preset can't be reached at the slider's setting but could be at 0%.
- The break-the-ground preset works on real ground.
- The README's Known limits and the assumption cards are updated.

## How it was tested

- The full Rex lab build line passes: `python build-data.py && node build.js && node test/calibration.js && node test/presence.js && node test/shots.js && node test/powers.js`.
  - calibration: all pass
  - presence: 383 checks
  - shots: all views and checks
  - powers.js: 120 checks
- **New `test/powers.js`.**
  - Part 1 turns all four powers off. 15,541 engine results must then match `main`'s engine exactly. The fixture `test/fixtures/powers-off.json` is written from `main`'s engine by `test/make-powers-off.js`.
  - Part 2 runs each power's own checks. They include energy and momentum checks against independent calculations, and the brief's tests that the engine can run.
- **`test/shots.js`** checks the page with the powers on:
  - migration of old saves
  - the slider's read-out
  - presets never move the slider
  - the hint, on Throw and in the game of catch
  - power labels
  - the break-the-ground preset, solo and two-player
  - the two-player presets
- **Saved states with the powers off** still match `main`'s page. The exceptions are the corrections listed under decision 27.
- **CI** gains `node test/powers.js`. The shots run takes about 5 minutes here, so the 20-minute job limit holds.

## Review rounds

Each round used five lenses: brief compliance, physics of air and form, physics of ground and recoil, code and tests, and copy and layout. A skeptic reproduced every finding with its own script before it counted. The records are in `rex-strength-lab/research/reviews/`.

| Round | Findings | Outcome | Record |
|---|---|---|---|
| 1 | 52 | all confirmed; fixed or recorded as decisions | `gui-b-round1.json` |
| 2 | 49 | all confirmed and fixed | `gui-b-round2.json` |
| 3 | 45 | 43 confirmed and fixed, 2 refuted | `gui-b-round3.json` |
| 4 | 32 | 31 confirmed and fixed; 1 without a verdict, covered by a confirmed finding | `gui-b-round4.json` |
| 5 | 35 | all confirmed and fixed | `gui-b-round5.json` |
| Re-check of round 5 | 26 | all confirmed and fixed | `gui-b-round5-recheck.json` |

Each round was run on the previous round's fixes, and each still found real defects. After round 5, instead of a sixth open-ended round, a narrower re-check tried only to break round 5's fixes; its 26 findings are fixed too, but nothing has independently re-checked those last fixes. The counts didn't fall to zero: the page is large, and each round's fixes added text and rules the next round could check. The defects found in rounds 4 and 5 were mostly consistency problems (one rule applied in one place but not another) and wording that no longer matched the numbers, plus some physics at the edges (unlimited strength, catches beyond 12 km, weak soil).

## Decisions (where the brief was unclear or the code didn't match it)

**Scope and gating**

1. **Every new behaviour is gated by its power.** With all four off (Air resistance absorbed at 0%), the engine gives exactly what `main` gives. `test/powers.js` hashes 15,541 results against a fixture written from `main`'s engine. The page's saved-state comparisons with `main` run with the powers off. New result fields appear only when a power is on.
   - Consequence: with Unbreakable footing and They take their own recoil both off, the lab doesn't count a throw's or a two-player push's own shaking at the feet, as `main` didn't. So turning those powers off can lower the shaking shown. The README says so.
2. **'Break the ground' sets Unbreakable footing aside for that preset only.** Its search, effort, courtesy ceiling and the tab shown all run on real ground, and the readout says so.
   - The brief also says "any effort a reader sets past it". I didn't do that part. All-out is past it, so every all-out result would break the ground. And the courtesy ceiling, worked out with the power on, could sit past the break.
   - The two-player 'ground' preset does the same, with its own real-ground ceiling.
3. **The arm-wrestle table counts as a held thing**, so Things keep their form holds it together. It is credited only where the same bout without the power breaks the table.
4. **They take their own recoil covers:** his throw, punch, stomp, a pull, a shove, and the thrower in Catch and Wrestle.
   - Not Collide's stomp-launch, where the stomp is his charge.
   - For a pull, only the rope's pull back goes into the planet. His legs still need friction to move him.
   - Not arm wrestling, the push match or Collide. Those are contests, and Bolted to the planet is the setting for being pushed.
   - A clap has no net recoil. A punch into air leaves the ground no net push: the arm's stop hands it straight back.
5. **Old saves pick up all four powers on**, including a saved Comic ground or Gentle hold that was off. The brief says only which saved value maps to on, and "Old saves pick up the new defaults".
6. **`CLAUDE.md`'s build line and CI gained `node test/powers.js`.** Both are shared files; the claim covers only that line in each, and the change is one line in each.

**Air**

7. **Their own bodies meet real air.** With any power on, his hand's own air past sound counts as a blast: γ² m_air v², an upper bound, capped at the work of his push. So does his foot's in a stomp with Unbreakable footing, and his body's in a supersonic jump. At 100% the boom stays (his hand). With all four off, `main`'s count is kept, and the 0% read-out says so.
8. **The blast near him is (1 − share) × what real air takes from the same throw.** The lab flies the throw once more at full drag to get that. If real air would never bring it down, all of its energy counts (an upper bound). Past 1% of light speed it is all of its energy, as on `main`. One rule on both sides of 1% of light speed, so 50% gives half the 0% blast, as the brief's test asks.
   - Why not the slowed flight's own drag loss: on a long flight the slowed object gives the air much the same energy as at 0%, spread over a longer path, and a low, flat one lands with most of it. Either way the blast near him is judged where it starts, where only that share of the drag acts.
   - A far reach is different. A fast throw's air takes its energy within metres to a few km, so a blast reaching hundreds of km sees nearly all of it as one release. The reach counts all the air took within it (below 1% of light speed, at most the slowed throw's own take). So the brief's "half at 50%" holds near him but not for the far reach.
   - The game of catch counts what the air takes from the slowed flight between them. All of that flight is near them.
9. **Past 1% of light speed the text gives the air's whole-path take** from a relativistic snowplow sweeping air at the share of the rate. Close to light speed a small share of a long column of air still takes almost all of the energy. The blast near him follows decision 8.
10. **The Throw tab's text at 0% with Things keep their form off is `main`'s.** Other settings get new texts from the same model.
11. **In the game of catch, with any power on, a throw past 1% of light speed flies a straight line at any share.** Past about 12 km the line to his hands runs underground, so it hits the ground near the thrower with all of its energy. With every power off, `main`'s aim is kept (decision 26).
12. **Every very fast throw that leaves gets the same text:** the Throw tab, the Wrestle throw and the partner toss state the gravity bend of the path and where it goes (the Earth, the solar system from about 16.7 km/s, the galaxy). With every power off, the partner toss keeps `main`'s line.
13. **The drag taken back goes to the endless ocean**, so the object keeps its speed. It doesn't feed growth. The ocean figures are the drag the air would have taken along the path actually flown.
14. **With Things keep their form, a throw past 1% of light speed that reaches him is caught inside its plasma sheath**, whatever share of its energy the sheath holds.
15. **A drag-free level throw past orbital speed is reported as an orbit** (solved as a closed Kepler orbit).

**Ground**

16. **Canon's weak-ground exception, one rule for every push.** Where the ground couldn't bear a push, it takes at most its bearing beyond the weight standing on it, over the push's pulse. That weight is his own plus whatever he holds or catches. Their power supplies the rest, which goes to the endless ocean, and the page says how much.
    - Sideways: a bolted foot (their recoil taken, "as if bolted") hands the planet the whole push, as brief 5d says. A foot standing on friction gets at most the ground's friction on what it bears.
    - Where real ground would just have held, the cap starts at what real ground took (the stomp's kept print, the landing's feet where real ground just bears the landing), so there is no cliff and a harder stomp never shakes the ground less.
    - Elsewhere (a jump's push-off and its landing's body stop, a thrown partner's landing, Collide's take-off) the ground takes its bearing over a pulse that shortens as he pushes harder. A shorter pulse dies out sooner and plaster tolerates it better, so a harder push there can shake the ground less, and the courtesy ceiling can name a hazard all-out doesn't cause. Flooring those at the edge's momentum would push the ground far past what it bears, so I didn't.
    - It covers throws (gentle and all-out), the partner toss, catches, Collide (counting the charger's weight while he lands on him), growth, the jump (push-off and landing), the stomp (the stomping foot's own bearing over a foot's contact time, since his weight is on the other foot) and a thrown partner's landing (downward only: sideways he skids it out, as on real ground).
    - An unbounded push with a push time is capped the same way. A push with no push time (comic mode at infinite strength) leaves the ground none of it.
17. **A stomp in soil with Unbreakable footing keeps the print the Walk tab allows** (sand and gravel: the print where the ground starts to fail; clay: none). Deeper sinking and its energy are taken back.
18. **Pull shaking is counted only with They take their own recoil on**, bolted too (the rope's pull then goes through his bolts). With the power off, `main`'s count (none) is kept.
19. **A quick arm-wrestling pin leaves the ground no net push**, like a punch, when its swing is shorter than a limb's contact time. A slower pin keeps the slam's blow. The two-player arm check counts a supersonic pin with a power on, and uses the all-of-the-energy quake estimate only with Unbreakable footing off.
20. **A stomp's shaking counts only the foot's blow.** The pull through his standing foot partly cancels it, so the figure is an upper bound, and the page says so.

**Two-player tests and presets**

21. **Two-player ground shaking exists only with the powers on**, to keep powers-off results identical. With them on it includes a bolted partner's bolts in a shove and, in Collide, the charger's own take-off (with his Unbreakable footing, as on the Jump and Stomp tabs). With the powers off, the presets say the lab doesn't model that shaking. A thrown partner's landing stays a source, as before.
22. **Two-player presets have no least-disruptive floor.** There, least disruptive is the hardest harmless effort (a ceiling), so a preset is the least shared effort that does it.
23. **The brief's "Collide charge into an immovable object shakes the ground" is tested with Rex bolted**, which is how the page makes him immovable, with Ollie jumping onto him. Collide's push reaches the ground over at least a limb's contact time, so the default sprint doesn't crack plaster 5 m away.
    - The "truly immovable" thought experiment (infinite mass) needs no ground, so the hit puts nothing into it, and the page says so. Only the charger's own take-off reaches the ground there (decision 21).
    - Standing on friction, Rex's feet slide, so the plaster preset says it never cracks plaster there.
24. **The lower-the-slider hint shows only on Throw and in the game of catch, for the air presets**, and only when the same search at 0% finds an effort. The tests use a car: with his hand's air counted, a baseball reaches windows at 100% through his hand.

**Kept as it is, or corrected on purpose**

25. **Two brief tests can't be run in the engine.** Everest hitting a bird and breaking on the Moon: the engine has no collisions for thrown objects other than the landing. The shaking test on ice: lake ice and a steel deck have no ground-wave model.
26. **Pre-existing and left as it is**, because powers-off results must match `main`: below 100%, the game of catch aims a fireball throw with the Earth's curvature term of the wrong sign. With every power off, whether a fireball reaches a catcher past 12 km also comes from that aim (a straight line couldn't reach him). With any power on, the straight-line test replaces it (decision 11).
27. **Page-only corrections that change powers-off text**, made where `main`'s text was false: shaking "from the fireball"; "from him" for a throw that never lands; Collide's immovable thought experiment citing a slide; the no-ground-wave-model wording on ice; the two-player courtesy ceiling counting broken ground as harm (`main` called an effort harmless while showing the rock around Rex's bolts cracking), and saying when a test doesn't judge shaking. The saved-state comparisons list these exceptions.

## Needs from the other person

- **Canon question (owner and collaborator): instant growth with Unbreakable footing on.**
  - Canon has him grow about his middle, with his soles driven into the ground.
  - With the ground unbreakable, his soles can't go down. So the page grows him upward from his soles, as Comic ground did.
  - The ground's push that starts his rise still shakes it.
  - Is that right, or should Unbreakable footing step aside during growth? This is also listed in `STATUS.md` under Waiting on.
- `CLAUDE.md`'s Rex lab build line and the CI workflow each gained `node test/powers.js` (one line each, inside the claim).
- After the merge, the owner's session rebuilds and republishes the live Rex lab page.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_01Uj6G3iasxRWVsuqr1BAzrS
