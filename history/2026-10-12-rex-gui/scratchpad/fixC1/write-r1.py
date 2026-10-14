import json
T = '/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/tasks/'
lenses = []
for t in ['wdz252agj', 'wiswexeas', 'we3qp27vl']:
    d = json.load(open(T + t + '.output')); r = d.get('result', d)
    lenses += json.loads(r) if isinstance(r, str) else r
order = ['brief', 'srclow', 'srcmid', 'srchigh', 'code', 'copy']
lenses.sort(key=lambda L: order.index(L['lens']))
OUT = {
 'brief-1': 'Fixed: nmText and the Earth-falls sentence use the ladder (compareWithEarth), saying in words when it is more than enough to blow the Earth apart; shots.js scans the Weight tab.',
 'brief-2': 'Fixed: the section 6 block picks all-out after each load, needs 15 or more wordings with rough ones, and checks each tile against the ladder for the energy beside it (within 5%, since the page shows 2 or 3 figures).',
 'brief-3': 'Fixed: test/ladder.js restates the rule and checks every comparison word for word, plus figures and hand-pinned cases; the mutants fail.',
 'brief-4': 'Fixed: rough by judgement (field rough), with Janka 2012 and Burrows & Vartanyan in the notes; README and decisions updated (ten rough rungs).',
 'brief-5': 'Refuted (already fixed in de7f9a3); high_si also lowered to 150 Mt so the stored range is the air-wave estimate.',
 'brief-6': 'Fixed: the lost notes restored; energy_corolla_50kmh and the presence KBB title updated.',
 'srclow-1': 'Fixed: range 0.1-10 GJ; the 2024 review (citing Rakov & Uman) and Salinas et al. 2021 added, with Salinas\'s own caveat on its low end.',
 'srclow-2': 'Fixed: Toyota\'s spec table added first; status verified; the fuel-tank spare back to derived.',
 'srcmid-hoover-dated': 'Refuted; the reviewer\'s EIA long-run check added to the notes and sources.',
 'srcmid-beirut-status': 'Fixed: status disputed; notes state Pilger\'s retained estimates; README lists six disputed rungs.',
 'srcmid-krakatoa-display-airwave': 'Fixed: the display credits 100-150 Mt to the air wave and names the 200 Mt as a tsunami paper\'s unsourced total.',
 'srcmid-krakatoa-popular-book': 'Fixed: the page note names the 1982 GSA volume and says \'the one refereed estimate with a stated method\'; README and decisions too.',
 'srcmid-sun-citation': 'Fixed: every arXiv:1510.07674 source titled Mamajek, Prša, Torres et al. (2015), in final-energy.json and the two presence facts.',
 'srchigh-1': 'Fixed (same as brief-4).',
 'srchigh-2': 'Fixed (same as srcmid-sun-citation).',
 'srchigh-3': 'Fixed: \'the energy to blow Pluto apart for good\', \'... Mars apart for good\'.',
 'code-1': 'Fixed (same as brief-2).',
 'code-2': 'Fixed (same as brief-3): the reviewers\' eight mutants now fail test/ladder.js.',
 'code-3': 'Refuted (already fixed in de7f9a3); high_si tidied as in brief-5.',
 'code-4': 'Fixed: the decision now names Collide (about 1e40 J) and the catch fireball, and gives the Weight tab\'s black-hole cutoff.',
 'copy-1': 'Fixed (same as brief-1).',
 'copy-2': 'Fixed (same as brief-2); the growth states are clicked, and a check that rough growth energies are given to one figure added.',
 'copy-3': 'Refuted: Beirut is the brief\'s own candidate rung. Kept; an owner ruling could drop recent disasters later.',
 'copy-4': 'Fixed: \'an air-rifle pellet at the licence-free limit in England and Wales\'.',
 'copy-5': 'Fixed: every rung\'s display rewritten in plain notation (×, superscripts, ±), erg converted to J, kpc to light-years, Bethe dropped, C and PREM glossed; test/ladder.js checks the rows.',
 'copy-6': 'Fixed: the display says NOAA gives no range and the rough flag is the lab\'s estimate; README\'s definition of rough covers it.',
 'copy-7': 'Fixed: a rough rung\'s energy and mass are given to one figure in the growth what-if (\'about 5 × 10¹⁷ J, which becomes about 6 kg\'); shots.js checks it.',
 'copy-8': 'Fixed: \'the total energy of a massive star’s supernova (nearly all in neutrinos)\'; README lists it as a typical case.',
 'copy-9': 'Refuted: both phrases are accurate and follow the brief\'s wording.',
}
n = c = 0; ref = []
for L in lenses:
    for f in L['findings']:
        n += 1; v = f.get('verdict') or {}
        if v.get('real'): c += 1
        else: ref.append(f['id'])
        f['outcome'] = OUT[f['id']]
rec = {'round': 1, 'what': 'First adversarial review of the energy ladder (BRIEF-gui.md section 6, pull request C): six lenses (brief compliance; sources for the low, middle and high rungs, each re-fetching every source; code, data and tests; copy, claims and layout), each finding reproduced or refuted by a skeptic with its own script or fetch. Reviewed at 4f92118 to de7f9a3 (the lenses ran in three parallel runs; fixes from the first lenses landed before the last ones finished).',
       'script': 'workflow rex-gui-c-review (args {round: 1, lenses}); kept in history at the end of the run',
       'counts': {'findings': n, 'confirmed': c, 'refuted': ref, 'no_verdict': []}, 'lenses': lenses}
p = '/home/user/rex-strength-lab/rex-strength-lab/research/reviews/gui-c-round1.json'
open(p, 'w', encoding='utf-8', newline='\n').write(json.dumps(rec, ensure_ascii=False, indent=1) + '\n')
print(rec['counts'])
