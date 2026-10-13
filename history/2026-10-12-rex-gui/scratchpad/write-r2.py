import json
d=json.load(open('/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/r2-result.json'))
O={
'brief-duo-ground-ceiling-contradiction':'fixed: broken ground counts as harm in the two-player facts wherever the ground is real (Collide, the catcher\'s feet; skipped where P.holdsGround applies); the real-ground run keeps the hit\'s push (engine option collide({toGround: true}), over the limb pulse). The ceiling now stops where the rock cracks. With the powers off this changes the Collide least-disruptive effort with Rex bolted (main called an effort harmless while showing the rock cracking): shots compares those cases all-out (new fixture cases from main\'s page) and checks the corrected ceiling',
'brief-duo-push-ground-not-modelled':'fixed: the shoving match (pushMatch tear or the unlimited clash), Collide\'s push (standoff rockGives/pusherTorn or cracking rock) and the shove\'s clash give ground facts and a harm; the break-the-ground preset finds 81% on the default push match',
'brief-catch-hits-ground-impact':'fixed: the hits-ground verdict gives the crater (flagged past the fitted range or extrapolated) and the quake, the blast block is shown, and the miss callout skips a throw that hits the ground (miss.hits)',
'brief-pull-recoil-shaking':'fixed: MOVES.pull.shake with They take their own recoil (not bolted): the rope\'s pull back, the load\'s momentum plus the resistance over the pull, as a pulse over the pull time; shakeWithPower names the one power (RESTRAINT.shakeOff); the Pull tab gives that shaking; test in powers.js',
'brief-hand-boom-unstated':'fixed: the slider read-out at 100% says his hand still meets the air; the Throw, Catch and Wrestle texts say his hand breaks the sound barrier as he lets go and give the air it drives; the two-player harm says the thrower\'s hand breaks the sound barrier at 100%',
'brief-push-match-skaters':'fixed: when the shover takes his own recoil the text says he stays put and the other flies off',
'brief-wrestle-push-lift-no-source':'fixed: duoNoModel gives the physical reason for the shoving match, the lift and Collide\'s push; the two-player \'none\' ceiling says when the test doesn\'t judge the ground shaking (with the powers off too: the page-before comparison applies that edit to those cases)',
'brief-readme-stale':'fixed: README count (now 15,541 with round 2\'s cases), the hand counted at every share above 0%, review history entries for B rounds 1 and 2',
'brief-canon-question-not-in-status':'fixed: STATUS.md Waiting on lists the canon question; the PR description repeats it',
'air-hand-subluminal':'fixed: throwBlast counts his hand\'s air at any speed past sound whenever some of the drag is absorbed (k < 1), in the path part; the catch legs carry it (leg().hand) and the two-player blast adds it; the hint wording covers the hand; powers.js checks it at 100%',
'air-hand-gamma':'fixed: limbAir/handAir use gamma^2 m_air v^2, capped at the work of his push (capped flag); the page says that in real air his hand\'s own drag would hold the throw far below that speed where the cap applies; the All-Star check expects the cap',
'air-catch-carried':'fixed: relCatch, when carried, adds the ride\'s air (Enear, the pair\'s snowplow over sqrt(2 R Hs), fireballAt\'s rule) and the two-player blast counts it; roundTrip excludes a carried catch; the tile reads carried off; the sliding-feet clause and the medicine-ball paragraph are replaced; a ride item and blast block are shown',
'air-away-bend':'fixed: away(u) computes its own straightThrow(u); below 1% of light speed it says the path is bent by gravity (escape path); straight up it says gravity only slows it',
'air-away-galaxy':'fixed: leaves the galaxy in every direction only past galaxyHi + 240 km/s (the fact\'s notes, labelled rough); between, the solar text adds that whether it leaves the galaxy depends on direction; the solar threshold folds in Earth\'s escape (hypot); \'far\' dropped',
'air-blast-k2':'fixed in the engine: throwOnce records dragLoss0 (one more flight at the full drag) when 0 < k < 1 past sound, and the blast uses k x dragLoss0, so 50% is exactly half the 0% flight blast (powers.js now checks 0.5)',
'air-catch-near100':'fixed: with Things keep their form on, a fireball whose air heats under 1% of its energy before reaching him (not kind \'before\') becomes an arrival at vLumpAt with a plasma sheath, caught by relCatch; the sheath counts in the two-player blast; the verdict mentions it; powers.js checks 99.99% against 100%',
'air-hitground-angle':'fixed: the crater uses -th - hitAt/R_E (the angle at the hit point); powers.js checks it',
'air-wrestle-nofire':'fixed: the Wrestle throw says no fireball around him and gives his hands\' own air (capped, labelled)',
'air-most-wording':'fixed: the close-to-light-speed wording only when gamma - 1 >= 1; a classical wording otherwise',
'ground-stomp-soil-sinking-kept':'fixed: stompOnce in soil keeps a print up to the Walk tab\'s (sand and gravel: the print at qFail; clay: none) and takes back the energy of deeper sinking; holeDepth capped there; the page shows the kept print; the 5c tests check soil stomps',
'ground-jump-pushoff-gated-by-bearing':'fixed: with Unbreakable footing the push-off counts whenever he jumps; the 5c equality test compares the landing and checks the push-off adds; README says that with the power off only the landing counts',
'ground-pulse-time-rules-inconsistent':'fixed: Collide\'s held and knocked-back pushes use max(limbPulse(holder), contact); the README says the jump push-off and growth keep their own times; the powers.js and shots Collide plaster checks re-based on Ollie jumping onto a bolted Rex at a 1,000 t dial (the default sprint no longer cracks plaster at 5 m)',
'ground-arm-momentum-returned':'fixed: the throw\'s (and catch thrower\'s) push into the ground is the object\'s momentum less his recoil; the punch has no net push (toGround and MOVES.punch.shake removed); texts, cards and README updated; the \'hand included\' test now expects the ball\'s momentum',
'ground-catch-fireball-no-thrower-push':'fixed: leg()\'s pushT attaches the thrower\'s push (and the hand\'s air) to fireball, overshoot and falls-back returns; powers.js checks a fireball leg against the Throw tab',
'ground-elastic-model-out-of-range-unflagged':'fixed: groundShake flags nonlinear (ppvNonlinear at the nearest people\'s distance); the chip and text say the figures are rough past the elastic range',
'ground-pull-text-whole-strength':'fixed: pull() reports ropeT with their recoil taken; the Pull text says how much of his strength the rope takes when his footing sets the pace; the forces chart shows the rope\'s pull',
'code-relcatch-cancellation':'fixed: E1 = 2 E0 mh / (M1 + m + mh) and Ediss = 2 Mb E2 / (Mf + M1 + Mb) with Mf from (M1 + Mb)^2 + 2 Mb E2 / c^2; relCatch only for a throw that met no air (catchIt noAir), restoring the powers-off identity; powers.js checks the dense catcher',
'code-poweroff-cases-gap':'fixed: powers-off cases for the well-dominated catch (Ollie 2e23 and 5.9e21 kg), partial-effort pulls, catch games with the round trip, and gradual growth; fixture regenerated from main\'s engine (15,541 cases, all identical); README lists the coverage instead of \'every exported function\'',
'code-catch-hand-fireball':'fixed: the two-player catch blast adds the thrower\'s hand air (leg().hand) at any share above 0%; the hint follows the total',
'code-catch-sweep-share':'fixed: the fireball item and math line use sweepK when part of the drag acts, and the math line shows x = k x air swept / m',
'code-carried-roundtrip':'fixed with air-catch-carried (roundTrip ok() excludes carried; tile)',
'code-duo-ground-test-weak':'fixed: the two-player break-the-ground check requires an effort, the bay without \'The ground holds: their power\' and the ceiling where the rock cracks; a Catch hint check (car fastball, block, 10^7 t vs 10^6 t; the baseball case now reaches windows through his hand\'s air); a slider move with the element open must change the two-player result',
'code-powers-tests-weak':'fixed: the passenger check at a 70 t dial (real drag between 1.5 g and 3.75 g); a relativistic snowplow check against energy and momentum conservation at gamma 10; a Collide bounce J check; the punch pulse check is moot (no punch push)',
'code-air-slider-no-defer':'fixed: the slider\'s input handler sets dialAt, so searches wait while it moves',
'code-readme-stale':'fixed with brief-readme-stale',
'copy-stomp-foot-air-dropped':'fixed: MOVES.stomp.blast with Unbreakable footing adds the foot\'s own air past sound (footAir: the hand\'s rule with the foot area and stomp stroke, capped); the callout gives it and a blast block',
'copy-catch-carried-off-ride':'fixed with air-catch-carried',
'copy-rattle-from-where-it-lands-regression':'fixed: fromW gives main\'s \'from the fireball\' again with no shake source, and \'from him\' for a run that never lands (a page-only correction where main said \'from where it lands\' for a throw that never lands)',
'copy-straight-line-bend-wrong-speed':'fixed with air-away-bend; angleText rounds up after \'less than\'',
'copy-catch-hits-ground-no-crater':'fixed with brief-catch-hits-ground-impact',
'copy-lift-plate-zero':'fixed: the plate tile uses weight / crush when Things keep their form is on and the grip is within limits',
'copy-math-lines-stale':'fixed: Throw math names their recoil taken; Stomp math names it when he isn\'t bolted; Collide math drops the quake for the immovable body',
'copy-galaxy-escape-direction':'fixed with air-away-galaxy',
'copy-air-energy-over-100':'fixed: the Throw item prints the slowed flight\'s energy balance (dragLoss) for the air\'s take',
'copy-power-credited-unchanged':'fixed: the arm table credited only when the same bout without Things keep their form breaks it; rockChip uses the real-ground rock; the throw recoil tile credits their power only when the recoil changed; the Wrestle landing credit only when the real landing makes a crater',
'copy-power-not-credited':'fixed: Wrestle throw gets a drag item (and \'No drag: their power\' at 100%) against the real-air range; Wrestle lift and the partner toss say where Unbreakable footing holds the ground and the toss gives its drag change; printChip ranks a held print and names the walker',
'copy-slider-readout-100':'fixed with brief-hand-boom-unstated: the read-out limits itself to the flight (the landing is still real, his hand still meets the air)',
'copy-readme-stale-claims':'fixed: README counts, the hand at every share above 0%, the Great Pyramid figure with its angle (52% straight up, 84% level)',
'copy-long-digit-string':'fixed: fmtRatioRange uses big() for the low end past 1,000',
}
for x in d:
  for f in x['findings']:
    f['outcome']=O[f['id']]
missing=[f['id'] for x in d for f in x['findings'] if f['id'] not in O]
assert not missing, missing
n=sum(len(x['findings']) for x in d)
rec={'round':2,'what':'Second adversarial review of the four default powers (BRIEF-gui.md section 5, pull request B), checking round 1\'s fixes: the same five lenses (brief compliance, physics of air and form, physics of ground and recoil, code and tests, copy and layout), each finding reproduced or refuted by a skeptic with its own script. Reviewed at 495f6c8.','script':'workflow rex-gui-b-review (args {round: 2, prior, decisions}); the script is kept in history at the end of the run','counts':{'findings':n,'confirmed':n,'refuted':[]},'lenses':d}
json.dump(rec,open('/home/user/rex-strength-lab/rex-strength-lab/research/reviews/gui-b-round2.json','w'),indent=1,ensure_ascii=False)
print(n)
