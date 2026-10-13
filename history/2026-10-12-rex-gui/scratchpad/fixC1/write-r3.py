import json
T = '/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/tasks/'
d = json.load(open(T + 'wpbu9q9ws.output')); r = d.get('result', d)
lenses = json.loads(r) if isinstance(r, str) else r
OUT = {
 'fixes-1': 'Refuted at the branch head: the crash was real at a7b9db6 and fixed in 26b62c9 (the replace now runs inside page.evaluate); the full shots.js passes.',
 'fixes-2': 'Fixed: the check reads every table cell (each is his unchanged figure or at most two figures), forbids a three-figure density in the growth sentence, and needs the rough note.',
 'fixes-3': 'Fixed the other way round, as the verifier found: NSF PAR labels the PDF an accepted manuscript (typeset), so the Energy row now says so; the Growth rows were right.',
 'fixes-4': 'Fixed by labelling: for a rough rung the growth box says every figure after the size line follows from an energy uncertain by more than 10×, so each is rough; README says what the page does.',
 'fixes-5': 'Fixed: the stale opening sentences deleted.',
 'fixes-6': 'Fixed: \'near the published central figures\', naming which are measured, modelled and simulated.',
 'fixes-7': 'Refuted: not in the branch; the pull request takes its decision list from research/reviews/gui-c-research.json.',
 'fresh-1': 'Fixed: the growth sentence uses the table\'s rule (only figures the growth changes by 10% or more are rounded and marked \'about\'), so pure size keeps 1,060 kg/m³ and pure density keeps 3.05 m.',
 'fresh-2': 'Fixed: the tooltip says the lab uses about 5 × 10²³ J, an older estimate runs up to 1.7 × 10²⁵ J (about 30× more), so the point could sit much higher.',
 'fresh-3': 'Fixed: decision 8 gives Collide about 4e40 J (two partners under the planet-reshaping limit) and about 5e42 J (one made truly immovable).',
 'fresh-4': 'Fixed: growth_instant_timescale recomputed at the ladder\'s energies (24 ms pure size; side speeds 317 and 407 m/s); the slow-growth and blast examples say they are worked at the brief\'s 4.2 × 10²³ J.',
}
n = c = 0; ref = []
for L in lenses:
    for f in L['findings']:
        n += 1; v = f.get('verdict') or {}
        if v.get('real'): c += 1
        else: ref.append(f['id'])
        f['outcome'] = OUT[f['id']]
rec = {'round': 3, 'what': 'Third review of the energy ladder (pull request C): two lenses, one checking each of round 2\'s fixes (with its test reverted in a scratch copy), one reading the whole change fresh; each finding reproduced or refuted by a skeptic. Reviewed at a7b9db6 (the fixes lens) and a7b9db6 to 26b62c9 (fresh read).',
       'script': 'workflow rex-gui-c-review (args {round: 3, lenses: [fixes, fresh]}); kept in history at the end of the run',
       'counts': {'findings': n, 'confirmed': c, 'refuted': ref, 'no_verdict': []}, 'lenses': lenses}
p = '/home/user/rex-strength-lab/rex-strength-lab/research/reviews/gui-c-round3.json'
open(p, 'w', encoding='utf-8', newline='\n').write(json.dumps(rec, ensure_ascii=False, indent=1) + '\n')
print(rec['counts'])
