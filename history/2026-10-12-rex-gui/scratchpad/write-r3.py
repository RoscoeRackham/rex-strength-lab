import json
d=json.load(open('/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/r3-result.json'))
W='fixed: where the ground couldn\'t bear the push, it takes only what it can (its bearing beyond his weight over the pulse; for a throw or catch its share of the downward push) and their power supplies the rest (supplied, to the endless ocean): jump push-off and landing, throw, catch, Collide held from above, instant growth; page texts say so (suppliedText); powers.js checks the jump, Collide on sand and growth'
P='fixed: MOVES.pull.shake counts the rope\'s pull with They take their own recoil whether or not he is bolted (shakeOff \'ownRecoil\' is just the power); pull() reports ropeT with the power on; the reason text, card and README say bolts too; powers.js checks a bolted pull'
T='fixed: tossPartner gives toGroundT (his push, the Throw tab\'s rule), toGroundC (his catch, at most what the ground bears) and his hands\' air past sound; duoFacts judges the partner toss (sound barrier, ground, shaking, a fireball\'s energy); powers.js checks it'
C='fixed: the two-player catch blast counts the slowed flight\'s own take between them (L.drag.E: it already carries the share); README and decision 6 say so'
H='fixed: his hand\'s (and in the game of catch, the thrower\'s) air counts whenever any of their powers is on (anyPower), so the blast no longer drops from 1% to 0% with the other powers on; with all four off the count is main\'s and the slider\'s read-out at 0% says so; page texts show the hand at 0% with a power on'
SH='fixed: relCatch takes the arriving momentum and rest mass (fin: the fireball\'s conserved p and the lump\'s rest mass m S for the sheath; p from the throw\'s energy at 100%), so the sheath catch frees the energy that arrives; powers.js checks 50%, 99% and 100% at the All-Star dial'
O={
'brief-weak-ground-momentum-exception':W,
'ground-weak-ground-momentum-exception':W,
'brief-pull-bolted-shaking':P,'ground-pull-bolted-shaking-dropped':P,
'brief-catch-partner-unjudged':T,'ground-partner-toss-no-shaking':T,
'brief-catch-blast-share-twice':C,'air-catch-blast-share-twice':C,
'brief-hand-air-zero-cutoff':H,'code-hand-air-zero-gate':H,'copy-hand-air-zero-share':H,
'brief-wrestle-throw-fast-treatment':'fixed: below 100% the Wrestle throw past 1% c flies a straight line, gives the snowplow\'s take at the share and where he goes (leaves the Earth, out of the air at the speed left, or stopped)',
'brief-noshake-reasons':'fixed: the effort box gives the reason for Sprint (footstep model covers walking paces) and Clap (no net push); card and README too',
'brief-allstar-verdict-no-fireball':'fixed: \'no fireball around it\', and the verdict says his hand\'s air makes one where he lets go; shots regex updated',
'brief-real-the-slab':'fixed: \'On real ground, the concrete slab would give ...\'',
'air-sheath-catch-loses-energy':SH,
'air-relcatch-gamma-cap':'fixed with air-sheath-catch-loses-energy: the momentum from the throw\'s energy; unbounded momentum (infinite strength) gives an unbounded catch (relCatch unbounded branch); powers.js checks 1e25, 1e27, 1e30 and infinite',
'air-blast-jumps-at-1pct-c':'fixed: one near-field rule on both sides of 1% c: past it the blast is (1 - share) x its energy (what real air takes); the snowplow\'s whole-path take stays in the text; decision 7 revised; the brief\'s \'half at 50%\' now holds for the blast; powers.js checks no step at 1% c (car at 90%) and the All-Star at exactly half',
'air-escaping-throw-blast-vs-text':'fixed: labelled on the Throw tab (real air wouldn\'t bring it down, so the blast counts the share of all its energy, an upper bound) and in the README',
'air-ocean-keeps-energy-claim':'fixed: at 100% the text says the ocean figure can exceed its own energy (real air would have stopped it long before) and that it keeps its speed and its own energy; below 100% it says it slows less than in real air',
'air-sheath-text-zero-drag':'fixed: the sheath case gets its own air item (the sheath\'s heat), not \'0 J over the flight\'; the blast block uses the sheath\'s energy',
'air-shock-pressure-no-gamma':'fixed: an arrival past 1% c uses gamma^2 rho v^2 (shockGamma2, gated on the fast path); the page names it',
'air-galaxy-threshold':'fixed: the galaxy thresholds are measured from Earth (Sun\'s orbital speed, the climb out of the Sun\'s pull, Earth\'s orbital speed and the climb out of Earth\'s pull), in every direction and in the best one',
'air-air-stops-it-at-11kms':'fixed: with Things keep their form, a throw that leaves the air at 1 km/s or more but short of escape is said to come out of the air at that speed and fall back far away, in the verdict and the text',
'air-hand-dropped-at-0pct':'refuted by its skeptic (not a bug); the related hand-at-0% findings are fixed (any power counts the hand)',
'ground-arm-pin-net-zero':'fixed: a pin whose swing is shorter than a limb\'s contact time leaves no net push (the punch\'s rule); a slower pin keeps the slam; the page explains; powers.js checks both',
'ground-stomp-recoil-pull-unmodelled':'fixed as text: the Stomp tab and README say the shaking counts only the foot\'s blow and is an upper bound (the pull through his standing foot partly cancels it)',
'ground-arm-no-sound-barrier':'fixed: the two-player arm harm check counts the pin\'s swing (or the drag) past the speed of sound, with their powers on (with them off the table breaks first, as on main)',
'ground-horizontal-push-as-vertical':'refuted by its skeptic (not a bug)',
'code-effort-credit-misattributed':'fixed: the effort box credits a power only where the hazard happens with that power off (tested all-out; not bolted for the slide)',
'code-calibration-check-air':'fixed: the calibration reality check runs with the four powers off (real air) and says so',
'code-powers-test-gaps':'fixed: powers.js checks the carried catch\'s energy (heat plus motion), a shove with only their recoil taken, a bolted pull\'s shaking, the partner toss and a supersonic jump\'s air',
'code-shots-test-gaps':'fixed: shots checks that Unbreakable footing is still on and saved after the two-player break-the-ground preset; the Collide real-ground push is checked through the ceiling where the rock cracks',
'code-readme-shots':'fixed: README\'s shots line (about 5 min, the powers-off page comparisons and their all-out cases) and the hint test (block preset)',
'copy-ocean-energy-kept':'fixed with air-ocean-keeps-energy-claim',
'copy-throw-100-no-fireball-verdict':'fixed with brief-allstar-verdict-no-fireball',
'copy-jump-air-blast-dropped':'fixed: with any power on, a jump counts what the air takes from his flight past sound (airLoss) as a blast; the Jump tab says so',
'copy-catch-sheath-false-at-any-share':'fixed: the sheath text no longer says nearly all the drag is taken back; it gives the share when above 0%',
'copy-catch-items-cut':'fixed: Throw, Jump, Stomp, Catch and Wrestle throw show up to 10 items',
'copy-own-recoil-credited-unchanged':'fixed: Catch and Wrestle throw credit They take their own recoil only where he would be shoved back without it, and say how fast',
'copy-duplicate-held-chip':'fixed: the relativistic keep-form chip reads \'Fireball: comes through whole, their power\'',
'copy-throw-math-drag':'fixed: the Throw math line gives (1 - s) x the drag, or the straight line and snowplow past 1% c',
'copy-dhalf-wording':'fixed: \'half of it over the first X of its path\'',
'copy-duo-ground-preset-wrong-reason':'fixed: the standing shoving match and Collide push say their feet slide long before the ground could break; the set-aside note shows only where the test models the ground',
'copy-readme-hint-test':'fixed with code-readme-shots',
}
for x in d:
  for f in x['findings']:
    f['outcome']=O[f['id']]
n=sum(len(x['findings']) for x in d); real=sum(1 for x in d for f in x['findings'] if (f.get('verdict') or {}).get('real'))
ref=[f['id'] for x in d for f in x['findings'] if not (f.get('verdict') or {}).get('real')]
rec={'round':3,'what':'Third adversarial review of the four default powers (BRIEF-gui.md section 5, pull request B), checking round 2\'s fixes: the same five lenses (brief compliance, physics of air and form, physics of ground and recoil, code and tests, copy and layout), each finding reproduced or refuted by a skeptic with its own script. Reviewed at 908af16.','script':'workflow rex-gui-b-review (args {round: 3, prior, decisions}); the script is kept in history at the end of the run','counts':{'findings':n,'confirmed':real,'refuted':ref},'lenses':d}
json.dump(rec,open('/home/user/rex-strength-lab/rex-strength-lab/research/reviews/gui-b-round3.json','w'),indent=1,ensure_ascii=False)
print(n, real, ref)
