# Page-audit fixes (2026-10-10), applied to data/builds.json after compile.py.
# Run on a freshly compiled file: python3 -I tools/audit_fixes.py data/builds.json
# It asserts the pre-fix state, so it refuses to run twice.
import json, re, sys

path = sys.argv[1]
d = json.loads(open(path, encoding='utf-8').read())
by = {b['id']: b for b in d['builds']}
F = d['facts']
log = []

def setv(obj, key, val, what):
    old = obj.get(key)
    obj[key] = val
    log.append('%s: %r -> %r' % (what, old, val))

# ---- 4. Midpoints that no source printed: derived, not reported ----
def mid(bid, field, site, basis):
    b = by[bid]
    e = b['height_m'] if field == 'height' else b['girths'][site]
    assert e['status'] == 'reported', (bid, field, site, e['status'])
    rng = e.get('range') if field == 'height' else e.get('range_m')
    assert rng, (bid, field, site)
    setv(e, 'status', 'derived', bid + ' ' + (site or 'height') + ' status')
    setv(e, 'value_basis', basis, bid + ' ' + (site or 'height') + ' value_basis')

mid('dorian_yates', 'height', None, "midpoint of the reported 5'9\" and 5'10\"; no source prints it")
mid('jay_cutler', 'height', None, "midpoint of the reported 5'9\" and 5'10\"; no source prints it")
mid('brian_shaw', 'height', None, "midpoint of the reported 6'6.75\" and 6'8\"; no source prints it")
for s in ('chest', 'waist', 'arm_flexed', 'calf'):
    mid('dorian_yates', 'girth', s, 'midpoint of the reported values; no source prints it')
mid('jay_cutler', 'girth', 'calf', 'midpoint of the reported values; no source prints it')
mid('ronnie_coleman', 'girth', 'thigh', 'midpoint of 34 in (FitnessVolt) and 36 in (GreatestPhysiques); no source prints it')
mid('sergio_oliva', 'girth', 'chest', 'midpoint of 52 in (FitnessVolt) and 59 in (GreatestPhysiques); no source prints it')
mid('sergio_oliva', 'girth', 'arm_flexed', 'midpoint of 20 in (FitnessVolt) and 22.5 in (GreatestPhysiques); no source prints it')

# ---- 5. Captain America DK edition: the book prints 6 ft 2 in ----
ed = by['captain_america']['editions'][1]
assert ed['height_m'] == 1.87
setv(ed, 'height_m', 1.8796, 'captain_america edition 1 height_m')
setv(ed, 'label', 'DK Avengers Ultimate Character Guides (2010, 2013; the book prints 6 ft 2 in and 1.87 m)', 'captain_america edition 1 label')

# ---- 7. Ollie: his own measured height at the picture's scale, his own volume ----
ol, rex = by['ollie'], by['rex']
setv(ol['height_m'], 'value', 3.063, 'ollie height_m.value')
setv(ol['height_m'], 'basis', "to the horn tips, measured at the picture's scale. The project set Rex at 10 ft (3.048 m) from his crest tip to the floor; at that scale Ollie is 3.063 m to the horn tips, 3.021 m to the hair and 2.982 m to the skull. His girths, volume and mass are measured at this scale", 'ollie height_m.basis')
setv(ol['volume_m3'], 'value', 2.53, 'ollie volume_m3.value')
setv(ol['volume_m3'], 'note', 'Central picture estimate 2.531 m^3 (range 2.20-2.77)', 'ollie volume_m3.note')
setv(rex['volume_m3'], 'note', 'Central picture estimate 2.553 m^3 (range 2.26-2.78)', 'rex volume_m3.note')
setv(rex['height_m'], 'basis', "10 ft, set by the project, from the crest tip to the floor. This fixes the picture's scale", 'rex height_m.basis')
H, W = 3.063, 2700.0
setv(ol['derived'], 'bmi', round(W / H ** 2, 1), 'ollie derived.bmi')
setv(ol['derived'], 'pi_kg_m3', round(W / H ** 3, 1), 'ollie derived.pi_kg_m3')
f = F['rex_ollie_picture_mass']
f['values']['height_note'] = ("10 ft set by the project for Rex, crest tip to floor: 790 px, 0.0038582 m/px. "
    "Ollie at the same scale: 3.063 m to horn tips, 3.021 m hair, 2.982 m skull. The calculator uses 3.063 m (horn tips) for Ollie, "
    "the height at which his girths, volume and mass were measured.")
f['notes'] = f['notes'].replace('were reconciled by a checker who re-measured the picture', 'were reconciled by a second, independent measurement of the picture')

# ---- 11. Geometric law scatter: the ANSUR II recomputation ----
g = F['ansur_geometric_law_test']
rs = g['values']['resid_sd_pct']
for k, v in (('waist', 5.7), ('upper_arm_flexed', 5.2), ('forearm_flexed', 4.5), ('calf', 4.2), ('neck', 4.3)):
    setv(rs, k, v, 'ansur_geometric_law_test resid_sd_pct.' + k)
g['notes'] += (' Residual SDs are the recomputed values: the SD of ln(G) - 0.5 ln(W/H) over the 4,082 ANSUR II men '
               '(chest 3.0, waist 5.7, arm 5.2, forearm 4.5, thigh 3.7, calf 4.2, neck 4.3%). An earlier stored set (waist 5.9) could not be reproduced.')
g['verify']['applied'].append('Residual SD% restated to the recomputed ANSUR II values (waist 5.7, arm 5.2, forearm 4.5, calf 4.2, neck 4.3).')

# ---- 13. Beyond-human flag notes: plain reader text ----
BMI_MAX = 43.45
for b in d['builds']:
    fl = b.get('flags') or {}
    n = fl.get('note') or ''
    if 'comics verifier' not in n:
        continue
    w = b.get('girth_basis_weight_kg') or b['weight_kg']['value']
    bmi = w / b['height_m']['value'] ** 2
    t = ('%.2f' % bmi) if abs(bmi - BMI_MAX) < 0.1 else ('%.1f' % bmi)
    setv(fl, 'note', 'At its own height and weight the BMI is %s, above 43.45, the highest BMI of anyone with measured girths in these data. '
         'Its girths are rough model estimates, not measurements.' % t, b['id'] + ' flags.note')

# ---- 21. SDs as numbers with units, not inside text ----
def take_sd(entry, key, unit_key, bid, what):
    s = entry[key]
    m = re.search(r'\s*\(SD ([0-9.]+)\)', s)
    assert m, (bid, what, s)
    setv(entry, unit_key, float(m.group(1)), bid + ' ' + what + '.' + unit_key)
    setv(entry, key, s[:m.start()] + s[m.end():], bid + ' ' + what + '.' + key)

for bid in ('chappell2019_natural_pro', 'sukwong2022_thai_elite', 'mcinnis1999_bodybuilders', 'fry1991_nonelite', 'kraemer2020_strongmen'):
    b = by[bid]
    take_sd(b['height_m'], 'basis', 'sd_m', bid, 'height_m')
    take_sd(b['weight_kg'], 'basis', 'sd_kg', bid, 'weight_kg')
take_sd(by['chappell2019_natural_pro']['weight_kg']['other'][0], 'label', 'sd_kg', 'chappell2019_natural_pro', 'weight_kg.other[0]')
for bid in ('mcinnis1999_bodybuilders', 'fry1991_nonelite', 'kraemer2020_strongmen'):
    take_sd(by[bid]['body_fat_pct'], 'method', 'sd_pct', bid, 'body_fat_pct')
setv(by['fry1991_nonelite']['body_fat_pct'], 'method', 'method not given in the source used here', 'fry1991_nonelite body_fat_pct.method')

# ---- 22, 24, 29. Reader-facing text: no process jargon, no raw keys ----
def note_replace(bid, old, new):
    notes = by[bid]['notes']
    i = notes.index(old)
    log.append('%s note: %r -> %r' % (bid, old, new))
    notes[i] = new

note_replace('kraemer2020_strongmen', 'Lean mass 118.0 kg; derived FFMI 35.1.',
             'DXA lean mass 118.0 kg plus bone mineral 5.2 kg gives an FFMI of 35.1 (lean + bone mineral, not height-adjusted, DXA). '
             'The FFMI above uses group-mean weight times (1 - body fat) instead, so it differs a little.')
note_replace('hafthor_bjornsson', 'No girths found.', 'No published girths found; all seven come from a template.')
note_replace('big_ramy', 'No girths found in any source.', 'No published girths found; all seven come from a template.')
note_replace('mr_america_1938_1954_mean', 'Means computed by the data compiler from the 15 program rows (1938-1954).',
             'Means of the 15 program rows (1938-1954), computed for this page.')
mra = by['mr_america_1938_1954_mean']['notes']
i = [k for k, s in enumerate(mra) if s.startswith('Caveat (verifier):')][0]
log.append('mr_america note caveat rewritten')
mra[i] = mra[i].replace('Caveat (verifier): these', 'Caution: these').replace('normalized FFMI', 'normalised FFMI')
note_replace('ansur2_m_leanheavy',
             "Selection rule (researcher's): BMI >= 28 and chest minus navel waist >= 20 cm. Chest and waist differ from other soldiers partly because of that rule.",
             'Selection rule for this subgroup: BMI 28 or more, and chest at least 20 cm larger than the navel waist. Chest and waist differ from other soldiers partly because of that rule.')
note_replace('ansur2_m_leanheavy', "Forearm 33.9 and neck 41.1 cm are from the fact's orig text.",
             "Forearm and neck are subgroup medians from the source's full text; its summary table omits them.")
note_replace('ansur2_f_leanheavy', "Forearm 27.5 and neck 34.2 cm are from the fact's orig text.",
             "Forearm and neck are subgroup medians from the source's full text; its summary table omits them.")
setv(by['chappell2019_natural_pro']['body_fat_pct'], 'note',
     'An FFMI of 25.0 for this group assumes 5% stage body fat. The study did not measure body fat', 'chappell bf note')

SITE_WORDS = {'arm_flexed': 'flexed upper arm'}
for b in d['builds']:
    t = b.get('template')
    if not t:
        continue
    r = t['reason']
    r2 = r.replace('that have the missing sites', 'that have the missing girths').replace('arm_flexed', 'flexed upper arm')
    r2 = r2.replace('Closest W/H^3', 'Closest weight for height (W/H^3)').replace('closest W/H^3', 'closest weight for height (W/H^3)')
    if r2 != r:
        setv(t, 'reason', r2, b['id'] + ' template.reason')

# Fact text that names internal roles
def fact_text(key, field, old, new):
    s = F[key][field] if field != 'values.note' else F[key]['values']['normalized_recomputed']['note']
    assert old in s, (key, old)
    s2 = s.replace(old, new)
    if field == 'values.note':
        F[key]['values']['normalized_recomputed']['note'] = s2
    else:
        F[key][field] = s2
    log.append('fact %s.%s: %r -> %r' % (key, field, old, new))

fact_text('build_templates_rule', 'notes', 'Rule set by the data compiler.', 'Rule used by this page.')
fact_text('nhanes_2015_2018_adults', 'notes', 'Read by the data compiler from the PDF', 'Read from the PDF')
fact_text('rex_ollie_picture_girths', 'notes', "are the compiler's choices", 'are assumptions made for this page')
fact_text('rex_ollie_picture_girths', 'notes', "at the checker's scale", "at the picture's scale")
a88 = F['ansur1988_natural_vs_omphalion_waist']
m = re.match(r"Proposed by the anthro verifier \(missing item 2\); recomputed by the data compiler from the verifier's downloaded CSVs", a88['notes'])
assert m
a88['notes'] = 'Computed for this page from the ANSUR 1988 public CSVs' + a88['notes'][m.end():]
log.append('fact ansur1988 notes opening rewritten')
dfp = F['derived_ffmi_pros']['values']
for k, v in dfp.items():
    if isinstance(v, dict) and isinstance(v.get('note'), str) and 'data compiler' in v['note']:
        v['note'] = v['note'].replace('computed by the data compiler', 'computed for this page')
        log.append('fact derived_ffmi_pros.values.%s.note rewritten' % k)

# Template rule note: the same limits the page uses
f = F['build_templates_rule']
old = 'Builds with BMI above 43.5 (the highest BMI of any person with measured girths here) are flagged beyond_human_girth_data.'
assert old in f['notes']
f['notes'] = f['notes'].replace(old, 'Builds with BMI above 43.45 (the highest BMI of any person with measured girths here, an ANSUR II man) are flagged as beyond human girth data. So are heights more than 10% outside the ANSUR II stature range (below 1.28 m or above 2.19 m), because the scaling law is checked only for height changes of about 10%.')
# Strongmen with no published girths: say where all seven come from
assert all(g.get('value_m') is None for g in by['lasha_talakhadze']['girths'].values())
assert all(g.get('value_m') is None for g in by['brian_shaw']['girths'].values())
note_replace('lasha_talakhadze', 'No girths published.', 'No published girths found; all seven come from a template.')
note_replace('brian_shaw', 'No credible girths found. SEO pages with contradictory numbers exist and are not used.',
             'No credible published girths found; all seven come from a template. SEO pages with contradictory numbers exist and are not used.')

# Check: nothing reader-facing in builds still names a role or a raw key
bad = []
def walk(o, p):
    if isinstance(o, list):
        for i, x in enumerate(o): walk(x, '%s[%d]' % (p, i))
    elif isinstance(o, dict):
        for k, v in o.items():
            if k in ('cite', 'sources', 'derivation', 'source_keys', 'url', 'file'): continue
            if isinstance(v, str):
                if re.search(r"verifier|compiler|researcher|checker|orig text|in the fact|arm_flexed|\(SD [0-9]", v): bad.append(p + '.' + k + ': ' + v[:100])
            else: walk(v, p + '.' + k)
for b in d['builds']: walk(b, b['id'])
assert not bad, bad

open(path, 'w', encoding='utf-8').write(json.dumps(d, indent=1, ensure_ascii=False))
print('\n'.join(log))
print(len(log), 'edits')
