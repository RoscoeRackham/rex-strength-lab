"""Round 1 research-data fixes (brief and code lenses). Run once."""
import json
R = '/home/user/rex-strength-lab/rex-strength-lab/research/'
def load(n):
    raw = open(R + n, encoding='utf-8').read(); return raw, json.loads(raw)
def save(n, raw, d):
    open(R + n, 'w', encoding='utf-8', newline='\n').write(json.dumps(d, ensure_ascii=False, indent=1) + ('\n' if raw.endswith('\n') else ''))

# brief-6: restore the object facts' notes lost in the in-place update
raw, d = load('final-objects.json'); F = {f['key']: f for f in d['facts']}
b = F['baseball_mass']
assert ' Other notes in the existing fact (circumference, grip, drag) unchanged.' in b['notes']
b['notes'] = b['notes'].replace(' Other notes in the existing fact (circumference, grip, drag) unchanged.', '') + " Circumference 'not less than nine nor more than 9-1/4 inches' (diameter 72.8 to 74.8 mm). Construction: yarn wound around a small cork/rubber core, covered by two strips of white horsehide or cowhide. Grip material: leather cover over wound yarn; crush/compressive strength not quantified (no source found). Structural note: the ball fits in the hand; grip stress at 1 g is ~142 Pa, trivial; it survives any lift. Deformation threshold at extreme throw accelerations not quantified. Drag: cd_baseball_subsonic, then cd_sphere_mach_fit above ~M 0.7. Area: baseball_cross_section_area. (Restored in review round 1 from the fact before the energy-ladder audit.)"
c = F['toyota_corolla_curb_mass']
c['notes'] += " Dimensions (KBB): length 182.3 in (4.630 m), width 70.1 in (1.781 m; one verifier reports KBB labels this 'with mirrors', not resolved), height 56.5 in (1.435 m, dealer listings, unverified), wheelbase 106.3 in. Grip material: mostly mild/drawing-quality sheet steel panels (DC04-class yield 140 to 210 MPa, mat_dc04_mild_steel) plus higher-strength steels in pillars and sills (not quantified). Structural note: grip stress at 1 g ~1.3 MPa, ~1% of sheet yield in pure bearing, but thin panels work only as part of the welded shell; a hand grip on a door or fender pulls the panel out of plane and dents or tears it (not quantified). Grip a sill, pillar or suspension mount to lift intact. Drag: cd_bluff_body_tumbling_subsonic for a tumbling car. (Restored in review round 1 from the fact before the energy-ladder audit.)"
save('final-objects.json', raw, d)

raw, d = load('final-presence.json')
n = 0
for f in d['facts']:
    for s in f['sources']:
        if s['url'] == 'https://www.kbb.com/toyota/corolla/2026/specs' and 'existing key toyota_corolla_curb_mass' in s['title']:
            s['title'] = s['title'].replace('(existing key toyota_corolla_curb_mass)', '(existing key toyota_corolla_curb_mass, since sourced to toyota.com’s own spec table: the same 2,955 lb)'); n += 1
assert n == 1, n
save('final-presence.json', raw, d)

raw, d = load('final-energy.json'); F = {f['key']: f for f in d['facts']}
f = F['energy_corolla_50kmh']
old = "(2026 LE, 2,955 lb, from KBB and iSeeCars, both secondary; Toyota's own spec page not reached)"
assert old in f['notes']; f['notes'] = f['notes'].replace(old, "(2026 LE, 2,955 lb, now from toyota.com's own spec table; review round 1)")
if not any('toyota.com' in s['url'] for s in f['sources']):
    f['sources'].insert(0, {'title': 'Toyota USA, 2026 Corolla features and specs (curb weight; spec table embedded in the page)', 'url': 'https://www.toyota.com/corolla/2026/features/'})

# brief-4: the supernova blast is rough by judgement (ordinary events span about 10x)
f = F['energy_supernova_blast']
f['rough'] = True
f['notes'] += " Rough by judgement (field rough): the typical value is known to about 2x, but ordinary core-collapse events span about 10^50 to a few 10^51 erg (Janka 2012, p. 12), as supernova light spans 10x across events (review round 1)."

# code-3 / brief-5 tidy: Krakatoa's stored range is the air-wave estimate alone (100-150 Mt); still rough by its field
f = F['energy_krakatoa_1883']
f['high_si'] = 6.276e17
old = 'range 100 to 200 Mt'
assert old in f['notes']; f['notes'] = f['notes'].replace(old, "range 100 to 150 Mt (Harkrider & Press; Choi et al.'s unsourced 200 Mt is outside it, high_si lowered from 200 Mt in review round 1)")
save('final-energy.json', raw, d)
print('ok')
