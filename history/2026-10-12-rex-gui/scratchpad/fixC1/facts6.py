"""Round 3 research-data fixes."""
import json
R = '/home/user/rex-strength-lab/rex-strength-lab/research/'
def load(n):
    raw = open(R + n, encoding='utf-8').read(); return raw, json.loads(raw)
def save(n, raw, d):
    open(R + n, 'w', encoding='utf-8', newline='\n').write(json.dumps(d, ensure_ascii=False, indent=1) + ('\n' if raw.endswith('\n') else ''))
def rep(f, field, old, new):
    assert old in f[field], (f['key'], field, old); f[field] = f[field].replace(old, new)
raw, d = load('final-energy.json'); F = {f['key']: f for f in d['facts']}
# fixes-6: modelled and simulated figures are not measured averages
rep(F['energy_lightning_flash'], 'notes', '1 GJ is a round value near the measured averages (Maggio 1.6 GJ for cloud flashes, Koshak 3.9 GJ, Salinas most often under 1 GJ), not a measured mean',
    "1 GJ is a round value near the published central figures (Maggio's estimates from measured electric fields, 1.6 GJ on average for cloud flashes; Koshak's modelled 3.9 GJ, scaled from satellite optical energy by a factor set to an assumed 250 mol of NOx per flash; Salinas's simulated flashes, most often under 1 GJ), not a measured mean")
# fixes-3: NSF PAR labels the PDF an accepted manuscript (typeset)
s = F['energy_chicxulub_impact']['sources'][0]
assert 'par.nsf.gov/servlets/purl/10349743' in s['url']
s['title'] = 'Morgan, Bralower, Brugger & Wünnemann (2022) The Chicxulub impact and its environmental consequences, Nat. Rev. Earth Environ. 3:338-354, doi:10.1038/s43017-022-00283-y; accepted manuscript at NSF PAR (typeset)'
save('final-energy.json', raw, d)
# fixes-5: the PREM check note's stale opening
raw, d = load('final-density.json'); F = {f['key']: f for f in d['facts']}
f = F['energy_earth_binding_prem_computed']
old = "This reproduces the 2.49e32 J that data.js holds as 'claimed' (energy_earth_gravitational_binding). That row could cite this computation as an independent check."
assert old in f['notes']; f['notes'] = f['notes'].replace(old, '').replace('  ', ' ').strip()
save('final-density.json', raw, d)
# fresh-4: the growth rows worked at the brief's energy
raw, d = load('final-presence.json'); F = {f['key']: f for f in d['facts']}
f = F['growth_instant_timescale']
f['display'] = 't = final height ÷ 1,540 m/s: 2 ms (Krakatoa), 7 ms (Chicxulub, mix), 24 ms (Chicxulub, pure size), 0.22 s (one solar second, pure size)'
f['value_si'] = 0.0243
rep(f, 'notes', 'Side speeds: Krakatoa 0.46 m/s; Chicxulub mix 313 m/s (Mach 0.92); Chicxulub pure size 405 m/s (1.19);', 'Side speeds: Krakatoa 0.14-0.29 m/s; Chicxulub mix 317 m/s (Mach 0.93); Chicxulub pure size 407 m/s (1.20);')
f['notes'] += " Pull request C (decision 9): recomputed at the lab's 125 Mt (5.23e17 J) and 5e23 J with the engine (Chicxulub pure size 37.42 m, so 24.3 ms; mix 10.68 m, 6.9 ms); at the brief's 4.2e23 J it was 23 ms."
for k in ['growth_slow_tmin_examples', 'growth_instant_blast_examples']:
    g = F[k]
    g['display'] = g['display'] + ' (worked at the brief’s 4.2 × 10²³ J for Chicxulub; the page now uses 5 × 10²³ J, about 20% more, and gives its own figures)'
    g['notes'] += ' Pull request C: these examples stay at the brief’s energies; the page computes its own at the ladder’s 5e23 J (decision 9).'
save('final-presence.json', raw, d)
print('ok')
