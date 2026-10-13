"""Round 2 research-data fixes."""
import json
R = '/home/user/rex-strength-lab/rex-strength-lab/research/'
def load(n):
    raw = open(R + n, encoding='utf-8').read(); return raw, json.loads(raw)
def save(n, raw, d):
    open(R + n, 'w', encoding='utf-8', newline='\n').write(json.dumps(d, ensure_ascii=False, indent=1) + ('\n' if raw.endswith('\n') else ''))
def rep(f, field, old, new):
    assert old in f[field], (f['key'], field, old); f[field] = f[field].replace(old, new)

raw, d = load('final-energy.json'); F = {f['key']: f for f in d['facts']}
# srcfix-1: lightning 0.01-10 GJ (Salinas et al. 2021, section 6a: earlier 'typical values ranging from 10^7 to 10^10 J')
f = F['energy_lightning_flash']
f['low_si'] = 1e7
f['display'] = 'about 1 GJ per flash (published estimates 0.01 to 10 GJ)'
old = f['notes'][f['notes'].index('Salinas et al. 2021 (capacitor model)'):f['notes'].index('Sources differ on which kind is larger')]
f['notes'] = f['notes'].replace(old, "Salinas et al. 2021 (refereed), section 6a: estimates from the charge moved and the potential difference 'have showed typical values ranging from 10^7 to 10^10 J of energy (Cooray 1997; Borovsky 1998; Marshall and Stolzenburg 2001)'; their simulated flashes were 'most frequently <1 GJ'; only their own capacitor estimates below 10^6 J are biased low by their single adjustment factor (their words). ")
rep(f, 'notes', 'span about 100x (0.1 to 10 GJ). Review round 1: high_si raised from 7 GJ to 10 GJ.', 'span about 1,000x (0.01 to 10 GJ). Review round 1 raised high_si from 7 to 10 GJ; round 2 lowered low_si from 0.1 to 0.01 GJ.')
rep(f, 'notes', '1 GJ is a round middle value, not a measured mean', '1 GJ is a round value near the measured averages (Maggio 1.6 GJ for cloud flashes, Koshak 3.9 GJ, Salinas most often under 1 GJ), not a measured mean')
rep(F['energy_month_of_food_2000_calories'], 'notes', '(uncertain by 70x)', '(uncertain by about 1,000x, 0.01 to 10 GJ)')
# brief-4 / srcfix-2: a link readers can open
s = F['energy_hoover_dam_year']['sources'][1]
assert 'api.eia.gov' in s['url']
s['url'] += '&api_key=[redacted]'
s['title'] = "US EIA, Form EIA-923 plant generation, Hoover Dam (plants 154 and 8902), API query with EIA's public demo key (net generation in MWh; rate-limited)"
# srcfix-3: the fuel-tank spare
f = F['energy_car_fuel_tank_petrol']
f['sources'].insert(0, {'title': 'Toyota USA, 2026 Corolla features and specs (spec table embedded in the page)', 'url': 'https://www.toyota.com/corolla/2026/features/'})
rep(f, 'notes', "Arithmetic checked by the skeptic, but the tank volume is 'reported' (KBB trade guide), so this is 'reported', not 'derived' (derived needs verified inputs).", "Arithmetic checked by the skeptic. Both inputs verified (tank from Toyota, KBB agreeing), so 'derived'.")
rep(f, 'notes', ' Review round 1: status back to derived, its tank input now verified from Toyota.', ' Review rounds 1 and 2: status back to derived, the tank now from Toyota.')
f['who_when'] = 'Computed 2026-10-13 from Toyota, EIA and AFDC'
F['toyota_corolla_fuel_tank']['who_when'] = 'Toyota Motor Sales USA (KBB agrees), 2026 model year, accessed 2026-10-13'
save('final-energy.json', raw, d)

# brief-5: the environment file's gaps that C closed
raw, d = load('final-environment.json'); g = d['gaps']
CLOSE = {4: 'energy_krakatoa_1883', 9: 'energy_comp_b_heat_of_detonation and energy_m67_tnt_equivalent_estimate', 11: 'energy_hiroshima_yield and energy_castle_bravo_yield', 12: 'energy_chicxulub_impact', 13: 'energy_earth_gravitational_binding'}
for i, k in CLOSE.items():
    assert isinstance(g[i], str) and 'Closed in' not in g[i]; g[i] += ' Closed in pull request C (13 Oct 2026): see ' + k + ' in final-energy.json.'
assert g[5].startswith('GBU-43 MOAB yield')
g[5] = "GBU-43 MOAB yield: still no official source; now GlobalSecurity's 11 t of TNT via AFP, cross-checked with the H-6 fill (energy_moab_yield in final-energy.json, status reported; pull request C, 13 Oct 2026)."
save('final-environment.json', raw, d)

# brief-1: the growth what-if's worked examples at the ladder's energies (decision 9)
raw, d = load('final-presence.json'); F = {f['key']: f for f in d['facts']}
f = F['growth_worked_krakatoa']
f['value_si'] = 5.82
f['display'] = "About 6 kg at the lab's 125 Mt (5.2 × 10¹⁷ J; +0.2%): height +1 mm (mix) or +2 mm (pure size); 1,062 kg/m³ if pure density. The often-quoted 200 Mt (8.4 × 10¹⁷ J, the brief's) gives about 9 kg. Across the quoted estimates 1–70 kg; about 560 kg at the highest inferred one"
f['notes'] += ' Pull request C (decision 9): the page now uses 5.23e17 J (125 Mt, energy_krakatoa_1883): Δm = 5.82 kg, k = 1.00194, mix H 3.0490 m, pure size 3.0500 m, pure density 1,062 kg/m³ (lab engine, grownBody). value_si moved from the brief\'s 9.346 kg.'
f = F['growth_worked_chicxulub']
f['value_si'] = 5563000
f['display'] = "About 5 × 10²³ J (the lab's value, Morgan et al. 2022) adds about 5,600 t (1,850 times his mass): mix about 11 m tall at about 46,000 kg/m³; pure size about 37 m; pure density about 2 × 10⁶ kg/m³. At the brief's 4.2 × 10²³ J: 4,700 t; mix 10 m; pure size 35 m"
f['notes'] += ' Pull request C (decision 9): the page now uses 5e23 J (energy_chicxulub_impact): Δm = 5,563 t, k = 1,851, mix H 10.68 m at 45,600 kg/m³, pure size 37.4 m, pure density 1.96e6 kg/m³ (lab engine, grownBody). value_si moved from the brief\'s 4,673 t.'
save('final-presence.json', raw, d)
print('ok')
