import json
d=json.load(open('/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/r4-result.json'))
W='fixed: one weak-ground rule for every push (weakGround in the engine): the ground takes at most its bearing beyond the weight standing on it (his own plus what he holds or catches) over the pulse; an angled push\'s sideways part goes in whole; their power supplies the rest (supplied). Used by the all-out throw, the gentle throw (throwPushJ: the lob in the game of catch and the easy partner toss), the hard toss (it now keeps the throw\'s supplied), both catches, Collide, growth and the jump; the Throw tab prints the ground\'s actual take; powers.js checks a vertical escaping car on concrete (J = (bearing - weight) x T) and a gentle toss on sand (no more than it bears, no more than the all-out toss)'
TOSS='fixed: the partner toss tab shows the toss\'s and the catch\'s pushes into the ground (J over T, suppliedText, groundShakeText), a shaking chip for the larger, his hands\' air past sound, and on weak ground says the ground takes only what it bears and their power the rest'
FAST='fixed: the Throw tab\'s destination text is now one shared function (awayText: the gravity bend and where it goes), used by the Throw tab, the Wrestle throw (at 100%, and below it after the snowplow) and the partner toss (straight up: at 100% no air, below it the snowplow at the share with the take, the exit speed and where he goes); the game of catch\'s straight-line texts state the bend (hits the ground) and the drop over the chord (caught)'
SH='fixed: the bow-shock pressure is labelled (1 - s) x rho v^2 (or the gamma^2 form) with s named, whenever some of the drag is absorbed (shockK)'
STOMP='fixed: MOVES.stomp.blow caps the foot\'s blow where real ground would break at the stomping foot\'s own bearing over a foot\'s contact time (his weight is on the other foot) and reports supplied, as the jump does; the Stomp tab says their power stops the foot at the kept print (or the surface) and gives the ground\'s take; decision 22 revised; powers.js checks the cap on sand'
O={
'brief-toss-blast-share':'fixed: the partner toss blast follows the Throw tab\'s near-field rule: past sound, (1 - share) x what real air takes from the same toss (dragLoss0, one more flight at full drag), plus his hands\' air; a fireball counts the larger of the two; powers.js checks dragLoss0 against the 0% toss',
'brief-throw-ground-share-hybrid':W,
'brief-fast-same-treatment-incomplete':FAST,
'brief-toss-shaking-not-shown':TOSS,
'brief-vertical-drag-noise':'fixed: straight up, the Throw tab\'s chip and item and the Wrestle throw\'s \'changed\' test compare heights (the apex), not round-off ranges',
'brief-arm-table-credit-item':'fixed: one table limit (the real table\'s when Things keep their form changed nothing) in the tile, the Forces row and the explanation',
'air-orbit-at-100-timeout':'fixed: fly() and flyTo() solve a drag-free flight (dragK 0, not vacuum) that closes as a Kepler conic as an orbit (or leaves the Hill sphere) at once; powers.js checks a level throw past orbital speed at 100% (orbit, under a second)',
'air-sheath-threshold-flip':'fixed: with Things keep their form a throw past 1% c that reaches him is caught inside its sheath at any share of its energy (the 1% line is gone); powers.js checks there is no flip and the sheath catch\'s energy to 1e-6, including a case where the sheath holds a quarter of it',
'air-solar-escape-slow-exit':'fixed: below about 16.7 km/s (the best direction, along the Earth\'s motion) the text says it escapes the Earth but ends up on its own orbit around the Sun; between that and 72.8 km/s it depends on the way it goes; the distance tile says \'in a straight line\' only while it leaves past 1% c',
'air-shock-label-share':SH,
'ground-weak-share-rule':'no verdict (its verifier failed); the same rule was confirmed by brief-throw-ground-share-hybrid and code-gentle-throw-weak-ground, and is fixed there',
'ground-jump-verdict-whole-pushoff':'fixed: the verdict says the ground takes only what it bears of the push-off where their power supplies some; an unbounded push-off (no push time) leaves the ground none, so infinite strength gives no push-off shaking; powers.js checks it',
'ground-stomp-weak-ground-carveout':STOMP,
'ground-arm-quake-label':'fixed: the two-player arm harm uses the all-of-the-energy quake estimate only with Unbreakable footing off; with it on the shaking comes from the push into the ground (none for a quick pin)',
'ground-pull-reason-false':'fixed: the reason now says his footing caps the rope\'s pull (the figure on this ground), a steady load over seconds, too little to shake the ground; bolted with the power off it says the lab leaves it out; the README lists the jump\'s push-off (Unbreakable footing) and the pull (own recoil) apart from the both-off cases',
'code-gentle-throw-weak-ground':W,
'code-partner-toss-tab-silent':TOSS,
'code-collide-real-push-unguarded':'fixed: shots loads Collide standing, Ollie jumping, 10^6.25 kg, people 3 m off, picks Break the ground, and requires the real-ground ceiling from the hit carried into the ground; powers.js checks collide\'s toGround option (present with it, absent without)',
'code-powers-test-weak-checks':'fixed: the pull check compares the shaking with an independent impulse source to 1e-12; the sheath catch check is tightened to 1e-6 and gains a case at 10^16 kg and 99%; both of the review\'s mutants (pull impulse x10, bare mass in relCatch) now fail',
'copy-partner-toss-unexplained':TOSS+'; '+FAST,
'copy-supplied-push-figure':'fixed: item leads give the whole push (pushFig); suppliedText says \'Of that push (whole), the ground takes only what it can bear, J\', names the sideways part for an angled push, and says when the ground can bear none; groundShakeText says nothing reaches the ground when J is zero',
'copy-stomp-soil-stop-reason':'fixed: \'the ground resists the foot ... stops after about X\' is not shown where Unbreakable footing keeps the print; the taken-back item says their power stops the foot there',
'copy-ground-breaks-never-vs-crater':'fixed: the hazard is named \'The ground under him breaks\', and the ceiling\'s leaves-out clause says \'broken ground under him\'',
'copy-absorb-hint-energy':'fixed: the hint says what the air would have taken goes to the endless ocean and the thrown thing keeps its speed; the README sentence too',
'copy-catch-shock-label':SH,
'copy-solo-shake-nonlinear-unflagged':'fixed: the effort box\'s plaster reach is flagged rough where the move\'s shaking source strains the ground past about 1 part in 10,000 at the nearest people\'s distance',
'copy-jump-landing-supplied-unlabelled':'fixed: the landing item gives the ground\'s take and the supplied part (landBear x the stop time), and says \'stopping him takes\' rather than \'the ground takes\' where their power supplies most of it',
'copy-punch-recoil-counterfactual':'fixed: \'without it he would lurch back about 2.3 cm during the punch, at up to 30.9 m/s\'',
'copy-arcseconds':'fixed: singular \'1 arcsecond\', and a gloss (1/3600 of a degree)',
'copy-courtesy-card-hand-air':'fixed: the card says that with any power on their own bodies\' air counts as a blast near him (hand in a throw, foot in a stomp, body in a supersonic jump)',
'copy-growth-card-canon-label':'fixed: the card marks growing upward from his soles as our reading, not settled canon, a question for the owners',
'copy-pull-bolted-shaking-unshown':'fixed: the Pull tab shows the rope\'s pull into the planet and its shaking whenever They take their own recoil is on, bolted too (\'through his bolts\'); \'a steady load\' only when the pull takes half a second or more',
}
for x in d:
  for f in x['findings']:
    f['outcome']=O[f['id']]
n=sum(len(x['findings']) for x in d); real=sum(1 for x in d for f in x['findings'] if (f.get('verdict') or {}).get('real'))
nov=[f['id'] for x in d for f in x['findings'] if not f.get('verdict')]
ref=[f['id'] for x in d for f in x['findings'] if f.get('verdict') and not f['verdict'].get('real')]
rec={'round':4,'what':'Fourth adversarial review of the four default powers (BRIEF-gui.md section 5, pull request B), checking round 3\'s fixes: the same five lenses (brief compliance, physics of air and form, physics of ground and recoil, code and tests, copy and layout), each finding reproduced or refuted by a skeptic with its own script. Reviewed at 43d7465.','script':'workflow rex-gui-b-review (args {round: 4, prior, decisions}); the script is kept in history at the end of the run','counts':{'findings':n,'confirmed':real,'refuted':ref,'no_verdict':nov},'lenses':d}
json.dump(rec,open('/home/user/rex-strength-lab/rex-strength-lab/research/reviews/gui-b-round4.json','w'),indent=1,ensure_ascii=False)
print(n, real, ref, nov)
