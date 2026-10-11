"""Compile data/facts.json from the research rounds and the verifier's corrections.

Inputs:
  research/round1/research_<topic>.json   raw researcher output (facts with JSON-string values)
  research/round1/verify_<topic>.json     the skeptic's checks (when present)
  research/corrections.json              corrections applied by hand from the checks, each with
                                          the fact key, what changes and why; every one is
                                          asserted against the current text, so none fails silently
  LOCAL below                             facts this session derived itself
Run from build-comparison/: python3 tools/compile_facts.py
"""
import json, os, sys, glob

ROOT = os.path.join(os.path.dirname(__file__), '..')
R1 = os.path.join(ROOT, 'research', 'round1')

def load(p):
    with open(p, encoding='utf-8') as f:
        return json.load(f)

facts = {}
for path in sorted(glob.glob(os.path.join(R1, 'research_*.json'))):
    topic = os.path.basename(path)[len('research_'):-5]
    res = load(path)
    ver = {}
    vp = os.path.join(R1, 'verify_' + topic + '.json')
    if os.path.exists(vp):
        for c in load(vp)['checks']:
            ver[c['key']] = c
    for f in res['facts']:
        k = f['key']
        if k in facts:
            raise SystemExit('duplicate fact key ' + k)
        try:
            values = json.loads(f['values'])
        except Exception:
            values = {'text': f['values']}
        v = ver.get(k)
        facts[k] = {
            'label': f['label'], 'status': f['status'], 'values': values, 'sources': f['sources'], 'notes': f['notes'],
            'topic': topic,
            'verify': None if v is None else {'ok': v['ok'], 'issue': v['issue'], 'corrected': v.get('corrected')},
        }

# Corrections from the checks, applied with assertions.
cp = os.path.join(ROOT, 'research', 'corrections.json')
applied = []
if os.path.exists(cp):
    for c in load(cp)['corrections']:
        if c['key'] not in facts:
            raise SystemExit('correction for an unknown fact key: ' + c['key'])
        f = facts[c['key']]
        for field, change in c.get('set', {}).items():
            f[field] = change
        for old, new in c.get('replace_notes', []):
            assert old in f['notes'], c['key'] + ': text to replace not found: ' + old[:60]
            f['notes'] = f['notes'].replace(old, new)
        if c.get('append_notes'):
            f['notes'] = f['notes'].rstrip() + '\n\nCorrection (verifier): ' + c['append_notes']
        for vk, vv in c.get('values', {}).items():
            f['values'][vk] = vv
        f.setdefault('applied', []).append(c['why'])
        applied.append(c['key'])

# Facts this session derived itself.
LOCAL = {
    'duo_skull_heights': {
        'label': "Rex and Ollie: height to the top of the skull, read off duo.jpg at the picture's scale",
        'status': 'estimate', 'topic': 'duo',
        'values': {'scale_mm_per_px_original_1280px': 3.858, 'scale_mm_per_px_repo_720px': 6.859,
                   'rex_crest_row_720': 4.8, 'rex_skull_row_720': 23, 'rex_skull_row_uncertainty_px': 3, 'rex_floor_row_720': 449.2,
                   'rex_skull_height_m': 2.92, 'rex_skull_height_range_m': [2.90, 2.95],
                   'ollie_hair_top_row_720': 13.5, 'ollie_hair_allowance_m': 0.04, 'ollie_floor_row_720': 453.9,
                   'ollie_skull_height_in_boots_m': 2.98, 'ollie_boot_sole_m': 0.07, 'ollie_boot_sole_range_m': [0.05, 0.09],
                   'ollie_skull_height_barefoot_m': 2.91, 'ollie_skull_height_range_m': [2.87, 2.95],
                   'turnaround_crosscheck_rex_skull_over_crest': 0.947, 'duo_rex_skull_over_crest': 0.959},
        'sources': [{'title': 'rex-strength-lab/assets/duo.jpg (the owner\'s art; 720 x 480 copy of the 1280 px original)', 'file': 'rex-strength-lab/assets/duo.jpg'},
                    {'title': 'Old picture measurement: scale, floor rows, skull rows (checker)', 'file': 'history/scratchpad/mass/checker/results_checker.json'}],
        'notes': "The repository's duo.jpg is the original 1280 px picture resized to 720 x 480 (0.5625x), so the 3.858 mm per pixel of the original is 6.859 mm per pixel here. Rex: crest tip at row 8.5 and floor under the ankles at row 798.5 of the original (444.4 px here, 3.048 m); the top of the skull under the crest spikes was read at row 23 +/- 3 here (row 41 of the original in the old check), so 2.92 m (2.90-2.95). Ollie: hair top at row 13.5 here (24 of the original), skull about 4 cm lower, floor under his boots at row 453.9: 2.98 m in boots. Stature is measured barefoot, so about 7 cm (5-9 cm) of boot sole comes off: 2.91 m (2.87-2.95). Cross-check: on the turnarounds (not used for numbers in Step 1) Rex's skull sits at 0.947 of his crest height in both front and side views, against 0.959 on duo.jpg; the head is tilted up in duo.jpg. Step 2 replaces both readings from the regenerated turnarounds.",
        'verify': None,
    },
    'meatball_and_other_shapes': {
        'label': 'The meatball and two bigger shapes, on the score',
        'status': 'derived', 'topic': 'geometry',
        'values': {'density_kg_m3': 1060, 'fat_pct': 7.5, 'ball': 924.1, 'ball_fat_10': 899.1, 'ball_fat_5': 949.1, 'cylinder_d_equals_h': 1386.2, 'cube': 1764.9},
        'sources': [], 'verify': None,
        'notes': 'Score of a solid shape as tall as the figure: 1.8 x density x (volume / H^3) x (1 - fat). A ball of diameter H holds pi/6 H^3; a cylinder as wide as it is tall pi/4 H^3; a cube H^3. The meatball is where the owner chose to end the scale; a body wider than it is tall could hold more.',
    },
}
for k, f in LOCAL.items():
    assert k not in facts, k
    facts[k] = f

out = {'about': 'Research facts for the Build Comparison, with the verifier\'s result per fact. Builds and their own sources are in build-calculator/data/builds.json.', 'facts': facts, 'corrections_applied': applied}
with open(os.path.join(ROOT, 'data', 'facts.json'), 'w', encoding='utf-8') as f:
    json.dump(out, f, indent=1, ensure_ascii=False)
    f.write('\n')
print('wrote data/facts.json: %d facts, %d corrections applied' % (len(facts), len(applied)))
