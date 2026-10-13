import json
d=json.load(open('/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/v5-result.json'))
NAN="fixed: weakGround guards the two subtractions (an unbounded sideways part taken whole supplies nothing) and reports sideTaken; suppliedText picks its angled branch from sideTaken; powers.js checks a 45-degree unbounded throw and Wrestle throw (no NaN, supplied Infinity, suppliedSide 0)"
NEVER="fixed as text: README and the engine comment now say the caps have no cliff where real ground stops holding (the stomp's kept print, the landing's feet) and a harder stomp never shakes the ground less, while a jump's push-off, its landing's body stop, a thrown partner's landing and Collide's take-off take the bearing over a pulse that shortens with effort, so they can shake it less and the courtesy ceiling can name a hazard all-out doesn't cause (the verifier showed flooring them at the edge impulse would push the ground far past what it bears)"
O={
'weak-angled-unbounded-nan':NAN,'R5V-copy-inf-angled-throw-can-bear':NAN,
'jump-harder-shakes-less':NEVER,'v5-duo-landing-harder-shakes-less':NEVER,'R5V-readme-never-shakes-less':NEVER,
'stomp-momentum-roundoff-band':"fixed: inside Unbreakable footing's branch the stomp's foot momentum comes from its energy whenever the foot passes 1% of light speed; powers.js checks every dial from 10^26 to 10^33.5",
'catch-miss-sheath-ignores-air':"fixed: a missed sheath throw below 100% gets the snowplow's exit speed for the lump (miss.vOut, miss.Eheat); the callout gives the motion it still has, the heat in its sheath, and either where it goes or that Earth's gravity brings it back; powers.js checks the 10^15 kg, 1 km, 50% case",
'catch-dense-branch-unfixed':"fixed: the wells-dominated branch runs the chord test too, with a power on; powers.js checks a dense catcher at 15 km, kept and not, at 50% and 99%",
'catch-math-label-slow-sheath':"fixed: the math line says 'Catch of the sheath lump' below 1% of light speed",
'catch-sheath-share-rounds-to-100':"fixed: the sheath share uses pctOfE ('over 99%')",
'catch-sheath-time-doubles':"fixed: a sheath lump's flight time is the path times the mean of 1/v at the two ends (exact for the snowplow); powers.js checks it",
'blast-seam-below-1pct':"fixed: blastAt also applies below 1% of light speed for a supersonic throw (its own take, at most what the air takes within the reach, plus his hand's air), so the far reach is continuous across 1% c; the Throw text and README say so; powers.js checks the continuity at 90%",
'blast-text-what-reach-counts':"fixed: the Throw text and math line say the blast counts the largest of the near-field share, the air's take within the reach and his hand's fireball, shown whenever some drag is absorbed",
'blast-below1pct-much-the-same':"fixed: 'much the same energy' only when the slowed throw gives the air at least 80% of real air's take; otherwise the text says it gives the air its own take and lands with most of the rest",
'blast-readme-dhalf-share':"fixed: README and the engine comment say fastAir's dHalf already includes the division by the share of drag that acts",
'v5-duo-takeoff-item-truncated':"fixed: the Collide tab shows up to 10 items, so the take-off item appears",
'v5-duo-landing-side-supplied-where-ground-holds':"fixed: a thrown partner's landing hands the ground its sideways part whole (he skids it out); only the downward part is capped; README and the powers.js check updated",
'v5-duo-immovable-takeoff-vs-nothing-reaches':"fixed: with a truly immovable target the shaking is modelled when the charger's take-off counts, and the 'nothing reaches the ground' reason shows only when it doesn't",
'v5-duo-landing-text-contradiction':"fixed: where the partner's landing is capped the tab says Unbreakable footing holds the ground under him (with the crater clause only when there is one)",
'v5-duo-real-bay-text':"fixed: the math line names real ground when Break the ground draws the tab, and a hit from above that drives him in says so ('Driven into the ground')",
'v5-duo-shove-bolts-copy':"fixed: 'barely notices' only when the bolts' push shakes nothing; otherwise 'its speed barely changes, but the ground around his bolts shakes'; the chip reads 'The push through Ollie's bolts shakes the ground'",
'R5V-copy-landing-no-push-time':"fixed: the landing passes its stop time to suppliedText, and says nothing of the landing reaches the ground when the weight on it already uses all it bears",
'R5V-copy-zero-push-no-model':"fixed: groundShake reports none for a zero push, and groundShakeText says nothing reaches the ground before any no-model sentence",
'R5V-copy-pull-footing-branch-unreachable':"fixed: with the load moving and the footing binding, the reason says his footing sets his pace and the rope gets part of its push (the rest speeds his own body); README corrected",
'R5V-tests-surviving-mutants':"fixed: checks for a sheath catch below 1% c (momentum kept), the friction cap on concrete where the downward part is borne, the bolted partner at 10^8 kg and the column cap; all four mutants now fail",
'R5V-copy-pastprint-stomp-crossref':"fixed: the footprint phrase drops the Stomp-tab cross-reference and the nested parentheses",
}
for g in d:
  for f in g['findings']:
    f['outcome']=O[f['id']]
n=sum(len(g['findings']) for g in d); real=sum(1 for g in d for f in g['findings'] if (f.get('verdict') or {}).get('real'))
rec={'round':'5-recheck','what':'A focused re-check of round 5\'s fixes (commit 616ced0): five checkers, one per group of fixes (ground caps, game of catch, far blast reach, two-player additions, page copy and tests), each told to break the fixes or find regressions they caused, and a skeptic reproducing each finding.','script':'workflow rex-gui-b-verify-r5 (kept in history at the end of the run)','counts':{'findings':n,'confirmed':real},'groups':d}
json.dump(rec,open('/home/user/rex-strength-lab/rex-strength-lab/research/reviews/gui-b-round5-recheck.json','w'),indent=1,ensure_ascii=False)
print(n,real)
