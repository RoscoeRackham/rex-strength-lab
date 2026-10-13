"""Merge the seven compiled research topics into rex-strength-lab/research/final-energy.json.
Run from anywhere: python3 merge.py. Writes a merge log to merge-log.json next to this script."""
import json, glob, os, collections
HERE = os.path.dirname(os.path.abspath(__file__))
C = os.path.join(HERE, '..', 'researchC', 'compiled')
R = '/home/user/rex-strength-lab/rex-strength-lab/research'
ORDER = ['audit', 'small', 'explosive', 'disaster', 'geophysical', 'planetary', 'stellar']
# which topic's version wins for a key held by more than one topic
PREFER = {'energy_hiroshima_yield': 'audit', 'energy_castle_bravo_yield': 'audit', 'energy_earth_gravitational_binding': 'audit',
          'earth_mean_orbital_speed': 'planetary', 'jupiter_mass': 'planetary', 'jupiter_mean_orbital_speed': 'planetary',
          'energy_sun_output_year': 'planetary', 'energy_sun_output_century': 'planetary', 'energy_earth_orbital_kinetic': 'planetary',
          'energy_jupiter_orbital_kinetic': 'planetary'}
# superseded by another topic's fact for the same thing
DROP = {
    'energy_fastest_pitch': 'duplicate of audit energy_fastest_pitch_kinetic (same 162 J)',
    'energy_corolla_100kmh': 'duplicate of audit energy_corolla_100kmh_kinetic (same 517 kJ)',
    'energy_m67_grenade_heat_of_detonation': 'superseded by audit energy_m67_tnt_equivalent_estimate: LLNL UCRL-52997 (1981) Table 5-2 does list Comp B Grade A, experimental 1.20 kcal/g (5.02 MJ/kg), checked on the page image (PDF p. 56); the Comp B-3 stand-in is not needed',
    'comp_b3_heat_of_detonation': 'superseded by audit energy_comp_b_heat_of_detonation (same table, Comp B Grade A row)',
    'energy_moab_h6_fill_cross_check': 'duplicate of the cross-checks inside audit energy_moab_yield (fill 8,482 kg x 1.35 = 47.9 GJ)',
}
# facts that live in other research files: update them in place, keeping their category
ELSEWHERE = {'fastest_baseball_pitch': 'humans', 'baseball_mass': 'objects', 'toyota_corolla_curb_mass': 'objects'}
# moved from final-environment.json into final-energy.json (the audit's versions replace them)
MOVED = ['energy_tnt_equivalent_per_tonne', 'energy_m67_grenade_explosive_mass', 'energy_comp_b_re_factor', 'energy_m67_tnt_equivalent_estimate',
         'energy_moab_yield', 'energy_hiroshima_yield', 'energy_castle_bravo_yield', 'energy_tsar_bomba_yield', 'energy_krakatoa_1883',
         'energy_chicxulub_impact', 'energy_sun_luminosity', 'energy_earth_gravitational_binding']

held = collections.defaultdict(dict)
for t in ORDER:
    for x in json.load(open(os.path.join(C, t + '.json'), encoding='utf-8'))['facts']:
        held[x['key']][t] = x
log = {'dropped': [], 'duplicates': [], 'elsewhere': [], 'moved': MOVED}
out = []
for k, by in held.items():
    if k in DROP:
        log['dropped'].append({'key': k, 'topic': list(by), 'why': DROP[k]}); continue
    if len(by) > 1:
        win = PREFER[k]
        log['duplicates'].append({'key': k, 'kept': win, 'also_in': [t for t in by if t != win],
                                  'values': {t: by[t].get('value_si') for t in by}})
    else:
        win = next(iter(by))
    x = dict(by[win])
    x['research_topic'] = win
    if k in ELSEWHERE:
        log['elsewhere'].append({'key': k, 'file': 'final-%s.json' % ELSEWHERE[k]}); x.pop('page_short', None); x.pop('research_topic')
        p = os.path.join(R, 'final-%s.json' % ELSEWHERE[k]); raw = open(p, encoding='utf-8').read(); d = json.loads(raw)
        for i, f in enumerate(d['facts']):
            if f['key'] == k:
                x['category'] = f.get('category', x.get('category')); d['facts'][i] = x
        open(p, 'w', encoding='utf-8', newline='\n').write(json.dumps(d, ensure_ascii=False, indent=1) + ('\n' if raw.endswith('\n') else ''))
        continue
    out.append(x)
# environment: take out the moved facts
p = os.path.join(R, 'final-environment.json'); d = json.load(open(p, encoding='utf-8'))
before = len(d['facts']); d['facts'] = [f for f in d['facts'] if f['key'] not in MOVED]
assert before - len(d['facts']) == len(MOVED), (before, len(d['facts']))
open(p, 'w', encoding='utf-8', newline='\n').write(json.dumps(d, ensure_ascii=False, indent=1) + '\n')
out.sort(key=lambda f: (f.get('category') != 'energy_reference', f.get('value_si') or 0))
meta = {'about': 'Energy references for the Rex lab energy ladder (BRIEF-gui.md section 6), researched 13 Oct 2026: seven topics (an audit of the old rungs, then six energy bands), each researched, then checked by a skeptic who fetched every source, then compiled with the corrections applied. Merged by hand; see research/reviews/gui-c-research.json for the topics, the skeptics\' checks and the merge decisions.',
        'facts': out}
open(os.path.join(R, 'final-energy.json'), 'w', encoding='utf-8', newline='\n').write(json.dumps(meta, ensure_ascii=False, indent=1) + '\n')
json.dump(log, open(os.path.join(HERE, 'merge-log.json'), 'w'), indent=1, ensure_ascii=False)
print(len(out), 'facts;', len(log['dropped']), 'dropped;', len(log['duplicates']), 'duplicates resolved;', len(log['elsewhere']), 'updated elsewhere')
