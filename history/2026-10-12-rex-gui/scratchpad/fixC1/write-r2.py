import json
T = '/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/tasks/'
lenses = []
for t in ['wkcabniv0', 'w363c6u5t']:
    d = json.load(open(T + t + '.output')); r = d.get('result', d)
    lenses += json.loads(r) if isinstance(r, str) else r
order = ['brief', 'srcfix', 'code', 'copy']
lenses.sort(key=lambda L: order.index(L['lens']))
OUT = {
 'brief-1': 'Fixed: growth_worked_krakatoa and growth_worked_chicxulub lead with the ladder\'s energies (about 6 kg; about 5,600 t), recomputed with the engine, with the brief\'s figures second.',
 'brief-2': 'Fixed: growthItems takes the rung\'s rough flag; the new mass to one figure, height and density to two; the table rounds each figure the growth changes by 10% or more to two figures; shots.js checks the line and the table.',
 'brief-3': 'Fixed: the milestone set by the dinosaur-killer is given as about one figure (\'about 800 quintillion t\'), with a note that the asteroid\'s energy is uncertain by more than 10×; shots.js checks it.',
 'brief-4': 'Fixed: the link uses EIA\'s public demo key and opens (HTTP 200).',
 'brief-5': 'Fixed: the six gaps in final-environment.json point to their closing facts; the month-of-food note says about 1,000×.',
 'srcfix-1': 'Fixed: low_si 1e7; display 0.01 to 10 GJ; the notes quote Salinas section 6a and keep its caveat only for its own model below 10^6 J; 1 GJ described as near the measured averages.',
 'srcfix-2': 'Fixed (same as brief-4).',
 'srcfix-3': 'Fixed: Toyota first in the spare\'s sources; the stale reported sentence replaced; who_when updated in both facts.',
 'code-1': 'Fixed (same as brief-2).',
 'code-2': 'Fixed: four end-band pins in test/ladder.js (about the same as an end rung at 1.1×; beyond at 1.2×); the no-band mutant fails.',
 'code-3': 'Fixed: decision 8 rewritten with the measured reaches (the dense-matter sentence about 1.5e44 J at 500 m; Collide about 7e40 J; the energy tile\'s black-hole cutoff).',
 'copy-1': 'Fixed: \'the blast of SN 1998bw, an unusually energetic supernova\'; label and display say it is the kinetic energy of its debris.',
 'copy-2': 'Fixed (same as code-3); the top rungs are kept so the ladder ends at a well-measured event and holds if the page\'s reach grows, and the decision says no page energy reaches them today.',
 'copy-3': 'Fixed: every rung\'s source titles cleaned of raw notation, mass in e-notation and fact keys; test/ladder.js now checks titles too.',
 'copy-4': 'Fixed (same as brief-2).',
 'copy-5': 'Refuted: the clause is a true lower bound under either reading; left as it is.',
 'copy-6': 'Fixed (same as brief-1).',
 'copy-7': 'Fixed: energy_earth_binding_prem_computed is derived, noted as an independent check of the Energy row (they agree to under 0.1%).',
 'copy-8': 'Fixed: STATUS.md updated.',
}
n = c = 0; ref = []
for L in lenses:
    for f in L['findings']:
        n += 1; v = f.get('verdict') or {}
        if v.get('real'): c += 1
        else: ref.append(f['id'])
        f['outcome'] = OUT[f['id']]
rec = {'round': 2, 'what': 'Second adversarial review of the energy ladder (pull request C), checking round 1\'s fixes: four lenses (brief compliance; the sources changed in round 1, every rewritten display checked against its fact, plus spot checks; code, data and tests; copy, claims and layout), each finding reproduced or refuted by a skeptic. Reviewed at cf4f03b (the brief and sources lenses) and cf4f03b to 4656cb3 (code and copy).',
       'script': 'workflow rex-gui-c-review (args {round: 2, lenses}); kept in history at the end of the run',
       'counts': {'findings': n, 'confirmed': c, 'refuted': ref, 'no_verdict': []}, 'lenses': lenses}
p = '/home/user/rex-strength-lab/rex-strength-lab/research/reviews/gui-c-round2.json'
open(p, 'w', encoding='utf-8', newline='\n').write(json.dumps(rec, ensure_ascii=False, indent=1) + '\n')
print(rec['counts'])
